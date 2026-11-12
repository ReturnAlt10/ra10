import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { askJson, hasProviders } from '../_shared/ai.ts';
import { requireTermsAccepted } from '../_shared/legal.ts';

// ────────────────────────────────────────────────────────────────────────────
// RA10 daily games — three short games a day, built for the learner's own unit.
//   state    today's game sets and plays for this learner
//   today    get (or build) today's set for a unit:
//              • Match-up       6 term ↔ meaning pairs   (AI, then checked by a second AI pass)
//              • True or False 10 statements              (AI, then checked by a second AI pass)
//              • Quickfire      8 real questions from the unit's own quiz bank (no AI)
//            Every AI item is grounded in the unit's verified quiz bank; anything the checker
//            cannot confirm is dropped. If AI is unavailable, both AI games are built from the
//            bank alone, so the games never contain unverified facts.
//   start    record when a game starts (server time)
//   finish   the server re-scores the learner's picks against the stored keys and pays XP once
//            per game per day through xp_award_server (caps live in xp-v3.sql)
// Tables: daily_games, daily_game_plays (xp-v3.sql).
// ────────────────────────────────────────────────────────────────────────────

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const ALLOWED_ORIGINS = new Set([
  'https://ra10.co.uk', 'https://www.ra10.co.uk',
  'http://localhost:5500', 'http://127.0.0.1:5500',
]);
function cors(origin: string | null) {
  return {
    'Access-Control-Allow-Origin': origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://ra10.co.uk',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    'Vary': 'Origin',
  };
}
const json = (body: unknown, headers: Record<string, string>, status = 200) => new Response(JSON.stringify(body), { status, headers });
const clean = (s: unknown, max = 200) => String(s ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const norm = (s: unknown) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const londonDate = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date());
const shuffle = <T,>(a: T[]) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

const GAMES = {
  match: { title: 'Match-up', xp: 25, minSeconds: 12 },
  truefalse: { title: 'True or False', xp: 20, minSeconds: 10 },
  quickfire: { title: 'Quickfire', xp: 25, minSeconds: 15 },
} as const;
type GameId = keyof typeof GAMES;
const MAX_SETS_PER_DAY = 3;

type Mcq = { q: string; choices: string[]; correct: number };
type Pair = { term: string; def: string };
type Tf = { s: string; answer: boolean; why: string };

// ───────────────────────────── grounding from the unit app ─────────────────────────────
function readGrounding(g: any): { topics: string[]; quiz: Mcq[] } {
  const topics = (Array.isArray(g?.topics) ? g.topics : []).map((t: unknown) => clean(t, 90)).filter(Boolean).slice(0, 60);
  const quiz: Mcq[] = [];
  const seen = new Set<string>();
  for (const raw of Array.isArray(g?.quiz) ? g.quiz.slice(0, 80) : []) {
    const q = clean(raw?.q, 260);
    const choices = (Array.isArray(raw?.choices) ? raw.choices : []).map((c: unknown) => clean(c, 140)).filter(Boolean).slice(0, 6);
    const correct = Math.round(Number(raw?.correct));
    if (!q || choices.length < 2 || !(correct >= 0 && correct < choices.length) || seen.has(norm(q))) continue;
    if (new Set(choices.map(norm)).size !== choices.length) continue;
    seen.add(norm(q));
    quiz.push({ q, choices, correct });
  }
  return { topics, quiz };
}

// ───────────────────────────── bank-only games (always accurate) ─────────────────────────────
function bankQuickfire(quiz: Mcq[]) {
  return shuffle(quiz).slice(0, 8).map((m) => {
    const order = shuffle(m.choices.map((_, i) => i));
    return { q: m.q, choices: order.map((i) => m.choices[i]), answer: order.indexOf(m.correct) };
  });
}
function bankPairs(quiz: Mcq[]): Pair[] {
  const out: Pair[] = [];
  const used = new Set<string>();
  for (const m of shuffle(quiz)) {
    const a = m.choices[m.correct];
    if (!a || a.length > 70 || m.q.length > 120 || /all of the above|none of the above|both/i.test(a) || used.has(norm(a))) continue;
    used.add(norm(a));
    out.push({ term: m.q, def: a });
    if (out.length >= 6) break;
  }
  return out;
}
function bankTrueFalse(quiz: Mcq[]): Tf[] {
  const out: Tf[] = [];
  for (const m of shuffle(quiz)) {
    if (m.q.length > 170) continue;
    const truth = out.length % 2 === 0;
    const wrong = m.choices.map((_, i) => i).filter((i) => i !== m.correct && !/all of the above|none of the above/i.test(m.choices[i]));
    if (!truth && !wrong.length) continue;
    const pick = truth ? m.correct : wrong[Math.floor(Math.random() * wrong.length)];
    out.push({ s: `${m.q} → ${m.choices[pick]}`, answer: truth, why: truth ? 'That is the correct answer.' : `The correct answer is: ${m.choices[m.correct]}.` });
    if (out.length >= 10) break;
  }
  return shuffle(out);
}

// ───────────────────────────── AI games, then an AI check ─────────────────────────────
async function aiGames(unitName: string, qual: string, topics: string[], quiz: Mcq[]) {
  const bank = shuffle(quiz).slice(0, 30).map((m) => ({ q: m.q, answer: m.choices[m.correct] }));
  const sys = `You are an expert ${qual} teacher who designs quick, fun revision games. Accuracy is the top priority: use only facts that are stated in, or follow directly from, the verified question bank you are given. Never invent statistics, dates, names or numbers. British English. Reply with JSON only.`;
  const user = `Unit: ${unitName}
Specification topics: ${JSON.stringify(topics.slice(0, 40))}
Verified question bank (each answer is correct): ${JSON.stringify(bank)}

Make today's game set for this unit:
1. "title": a short, fun name for today's set (max 6 words, no emoji).
2. "match": exactly 6 pairs. Each "term" is a key term from the bank (max 6 words). Each "def" is its meaning in max 16 words, taken from the bank's content. Every definition must fit only its own term.
3. "truefalse": exactly 10 statements (max 25 words each), about half true and half false. False statements must be clearly false by changing one key detail from a bank fact. "why" explains the right answer in max 20 words.
Return {"title":"","match":[{"term":"","def":""}],"truefalse":[{"s":"","answer":true,"why":""}]}`;
  const r = await askJson(sys, user, 40000, { preferStrong: true, temperature: 0.5, maxTokens: 2500 });
  const pairs: Pair[] = (Array.isArray(r.json?.match) ? r.json.match : []).map((p: any) => ({ term: clean(p?.term, 70), def: clean(p?.def, 160) })).filter((p: Pair) => p.term && p.def);
  const tf: Tf[] = (Array.isArray(r.json?.truefalse) ? r.json.truefalse : []).map((t: any) => ({ s: clean(t?.s, 220), answer: t?.answer === true || t?.answer === 'true', why: clean(t?.why, 200) })).filter((t: Tf) => t.s);
  return { title: clean(r.json?.title, 60), pairs, tf, provider: r.provider, bank };
}

async function checkGames(unitName: string, qual: string, bank: { q: string; answer: string }[], pairs: Pair[], tf: Tf[]) {
  const items = [
    ...pairs.map((p, i) => ({ id: 'm' + i, type: 'match', term: p.term, def: p.def })),
    ...tf.map((t, i) => ({ id: 't' + i, type: 'truefalse', statement: t.s, answer: t.answer })),
  ];
  const r = await askJson(
    `You are a meticulous senior ${qual} examiner checking revision game items before students see them. Be strict: anything wrong, ambiguous, unsupported by the bank, or arguable must be dropped. Reply with JSON only.`,
    `Unit: ${unitName}
Verified question bank: ${JSON.stringify(bank)}
Check each item:
- match: is "def" a correct meaning of "term", and could it NOT reasonably describe any other term in the list?
- truefalse: is the keyed answer definitely right and unambiguous for this specification?
Items: ${JSON.stringify(items)}
Return {"items":[{"id":"m0","ok":true|false}]}`,
    40000, { preferStrong: true, temperature: 0, maxTokens: 1500 });
  const verdicts = new Map<string, boolean>();
  for (const v of Array.isArray(r.json?.items) ? r.json.items : []) verdicts.set(String(v?.id), v?.ok === true);
  if (!verdicts.size) throw new Error('checker returned nothing');
  return {
    pairs: pairs.filter((_, i) => verdicts.get('m' + i) === true),
    tf: tf.filter((_, i) => verdicts.get('t' + i) === true),
  };
}

async function buildSet(unitName: string, qual: string, topics: string[], quiz: Mcq[]) {
  let pairs: Pair[] = [], tf: Tf[] = [], title = '', provider = 'bank', verified = false;
  if (hasProviders() && quiz.length >= 6) {
    try {
      const made = await aiGames(unitName, qual, topics, quiz);
      const checked = await checkGames(unitName, qual, made.bank, made.pairs, made.tf);
      const uniqueDefs = new Set(checked.pairs.map((p) => norm(p.def))).size === checked.pairs.length;
      if (checked.pairs.length >= 4 && uniqueDefs) pairs = checked.pairs.slice(0, 6);
      if (checked.tf.length >= 6) tf = checked.tf.slice(0, 10);
      title = made.title;
      provider = made.provider;
      verified = true;
    } catch (e) {
      console.warn('daily-games AI failed; using the bank only', e instanceof Error ? e.message : e);
    }
  }
  if (pairs.length < 4) pairs = bankPairs(quiz);
  if (tf.length < 6) tf = bankTrueFalse(quiz);
  const quick = bankQuickfire(quiz);
  const games: any[] = [];
  if (pairs.length >= 4) games.push({ id: 'match', title: GAMES.match.title, pairs });
  if (tf.length >= 6) games.push({ id: 'truefalse', title: GAMES.truefalse.title, seconds: 75, items: tf });
  if (quick.length >= 4) games.push({ id: 'quickfire', title: GAMES.quickfire.title, items: quick });
  return { title: title || `${unitName.replace(/^Unit \d+:\s*/, '')} games`, games, provider, verified };
}

// ───────────────────────────── scoring ─────────────────────────────
function score(game: any, picks: any): { score: number; max: number; detail: boolean[] } {
  if (game.id === 'match') {
    const n = game.pairs.length;
    const first = new Map<number, boolean>();
    for (const a of Array.isArray(picks) ? picks.slice(0, 200) : []) {
      const t = Math.round(Number(a?.[0])), d = Math.round(Number(a?.[1]));
      if (!(t >= 0 && t < n) || !(d >= 0 && d < n) || first.has(t)) continue;
      first.set(t, t === d);
    }
    const detail = game.pairs.map((_: any, i: number) => first.get(i) === true);
    return { score: detail.filter(Boolean).length, max: n, detail };
  }
  const items = game.items || [];
  const p = Array.isArray(picks) ? picks : [];
  const detail = items.map((it: any, i: number) => game.id === 'truefalse' ? p[i] === it.answer : Math.round(Number(p[i])) === it.answer && p[i] !== null && p[i] !== undefined);
  return { score: detail.filter(Boolean).length, max: items.length, detail };
}

// ───────────────────────────── actions ─────────────────────────────
interface Ctx { admin: any; userId: string }

async function playsFor(ctx: Ctx, setIds: string[]) {
  if (!setIds.length) return [];
  const { data } = await ctx.admin.from('daily_game_plays').select('set_id, game, started_at, finished_at, score, max_score, xp').eq('user_id', ctx.userId).in('set_id', setIds);
  return data || [];
}

async function state(ctx: Ctx) {
  const day = londonDate();
  const { data: sets } = await ctx.admin.from('daily_games').select('id, unit, unit_name, title, games, verified, created_at').eq('user_id', ctx.userId).eq('day', day).order('created_at', { ascending: true });
  const plays = await playsFor(ctx, (sets || []).map((s: any) => s.id));
  return { ok: true, day, sets: sets || [], plays, maxSets: MAX_SETS_PER_DAY };
}

async function today(ctx: Ctx, body: any, headers: Record<string, string>) {
  const unit = clean(body.unit, 160);
  if (!/^\/revision\/(btec|a-level)\/[A-Za-z0-9/_-]{2,120}$/.test(unit)) return { ok: false, error: 'Pick a unit first.' };
  const day = londonDate();
  const { data: existing } = await ctx.admin.from('daily_games').select('id, unit, unit_name, title, games, verified, created_at').eq('user_id', ctx.userId).eq('day', day).eq('unit', unit).maybeSingle();
  if (existing) return { ok: true, day, set: existing, plays: await playsFor(ctx, [existing.id]) };

  const { count } = await ctx.admin.from('daily_games').select('id', { count: 'exact', head: true }).eq('user_id', ctx.userId).eq('day', day);
  if ((count || 0) >= MAX_SETS_PER_DAY) return { ok: false, error: `You've made ${MAX_SETS_PER_DAY} game sets today. New games arrive tomorrow.` };

  const termsDenied = await requireTermsAccepted(ctx.admin, ctx.userId, headers);
  if (termsDenied) return { ok: false, error: 'Please accept the RA10 Terms of Service to play AI games.', code: 'terms_required' };

  const g = readGrounding(body.grounding);
  if (g.quiz.length < 4) return { ok: false, error: 'This unit does not have enough quiz questions for games yet. Try another unit.' };
  const unitName = clean(body.unitName, 120) || unit;
  const qual = clean(body.qual, 80) || 'BTEC / A-Level';
  const built = await buildSet(unitName, qual, g.topics, g.quiz);
  if (!built.games.length) return { ok: false, error: 'Could not build games for this unit. Try another unit.' };

  const row = { user_id: ctx.userId, day, unit, unit_name: unitName, title: built.title, games: built.games, provider: built.provider, verified: built.verified };
  const { data: saved, error } = await ctx.admin.from('daily_games').insert(row).select('id, unit, unit_name, title, games, verified, created_at').single();
  if (error) {
    const { data: again } = await ctx.admin.from('daily_games').select('id, unit, unit_name, title, games, verified, created_at').eq('user_id', ctx.userId).eq('day', day).eq('unit', unit).maybeSingle();
    if (again) return { ok: true, day, set: again, plays: await playsFor(ctx, [again.id]) };
    return { ok: false, error: error.message };
  }
  return { ok: true, day, set: saved, plays: [] };
}

async function loadGame(ctx: Ctx, body: any) {
  const setId = clean(body.setId, 60);
  const game = clean(body.game, 20) as GameId;
  if (!(game in GAMES)) return null;
  const { data: set } = await ctx.admin.from('daily_games').select('id, user_id, day, games').eq('id', setId).maybeSingle();
  if (!set || set.user_id !== ctx.userId) return null;
  const g = (set.games || []).find((x: any) => x && x.id === game);
  return g ? { set, game, g } : null;
}

async function start(ctx: Ctx, body: any) {
  const L = await loadGame(ctx, body);
  if (!L) return { ok: false, error: 'Game not found.' };
  await ctx.admin.from('daily_game_plays').upsert({ user_id: ctx.userId, set_id: L.set.id, day: L.set.day, game: L.game }, { onConflict: 'user_id,set_id,game', ignoreDuplicates: true });
  const { data: play } = await ctx.admin.from('daily_game_plays').select('started_at, finished_at, score, max_score, xp').eq('user_id', ctx.userId).eq('set_id', L.set.id).eq('game', L.game).maybeSingle();
  return { ok: true, play };
}

async function finish(ctx: Ctx, body: any) {
  const L = await loadGame(ctx, body);
  if (!L) return { ok: false, error: 'Game not found.' };
  const { data: play } = await ctx.admin.from('daily_game_plays').select('id, started_at, finished_at, score, max_score, xp').eq('user_id', ctx.userId).eq('set_id', L.set.id).eq('game', L.game).maybeSingle();
  if (!play) return { ok: false, error: 'Start the game first.' };
  const s = score(L.g, body.picks);
  if (play.finished_at) return { ok: true, score: s.score, max: s.max, detail: s.detail, xp: 0, replay: true, first: { score: play.score, max: play.max_score, xp: play.xp } };

  const seconds = (Date.now() - Date.parse(play.started_at)) / 1000;
  const tooFast = seconds < GAMES[L.game].minSeconds;
  const isToday = L.set.day === londonDate();
  let xp = 0, bonus = 0, note = '';
  if (tooFast) note = 'That was too quick to count for XP. Take your time and read each one.';
  else if (!isToday) note = 'Yesterday\'s games do not earn XP. Today\'s are ready on the Tasks page.';
  else {
    const want = Math.round(GAMES[L.game].xp * (s.max ? s.score / s.max : 0));
    if (want > 0) {
      const { data, error } = await ctx.admin.rpc('xp_award_server', { p_user: ctx.userId, p_source: 'game', p_amount: want, p_ref: `game:${L.set.id}:${L.game}` });
      if (!error && data) { xp = Number(data.granted) || 0; bonus = Number(data.bonus) || 0; if (!xp && data.reason === 'cap') note = 'You have reached today\'s XP limit for games.'; }
    }
  }
  const { error: upErr } = await ctx.admin.from('daily_game_plays').update({ finished_at: new Date().toISOString(), score: s.score, max_score: s.max, xp: xp + bonus })
    .eq('id', play.id).is('finished_at', null);
  if (upErr) return { ok: false, error: upErr.message };
  return { ok: true, score: s.score, max: s.max, detail: s.detail, xp, bonus, note };
}

// ───────────────────────────── entry ─────────────────────────────
serve(async (req) => {
  const headers = cors(req.headers.get('origin'));
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, headers, 405);
  if (!SUPABASE_URL || !SERVICE_KEY) return json({ error: 'Server not configured' }, headers, 500);
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return json({ error: 'Please sign in to play.' }, headers, 401);
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  const { data: u, error: uErr } = await admin.auth.getUser(token);
  if (uErr || !u?.user?.id) return json({ error: 'Please sign in again.' }, headers, 401);
  const ctx: Ctx = { admin, userId: u.user.id };

  let body: any = {};
  try { body = await req.json(); } catch { body = {}; }
  const action = String(body?.action || '').trim().toLowerCase();
  try {
    if (action === 'state') return json(await state(ctx), headers);
    if (action === 'today') return json(await today(ctx, body, headers), headers);
    if (action === 'start') return json(await start(ctx, body), headers);
    if (action === 'finish') return json(await finish(ctx, body), headers);
    return json({ error: 'Unknown action.' }, headers, 400);
  } catch (e) {
    console.error('daily-games', action, e);
    return json({ ok: false, error: 'Something went wrong. Please try again.' }, headers, 500);
  }
});
