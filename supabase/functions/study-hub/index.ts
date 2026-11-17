import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { askJson, hasProviders } from '../_shared/ai.ts';
import { STUDY_HUB_SYSTEM, buildStudyHubPrompt, studyHubPostProcess, ANNOTATE_SYSTEM, buildAnnotatePrompt, cleanAnnotations, annotationsFromAwarded } from '../_shared/study_hub_examiner.ts';

// ────────────────────────────────────────────────────────────────────────────
// RA10 Study Hub — AI-curated bite-size lessons (open to every signed-in account;
// each new lesson takes LESSON_COST uses of the shared AI allowance, see ai-usage.sql).
//   plan      read the learner's recent activity → strengths, gaps and today's focus
//   create    write a lesson (daily or learner-chosen topic) grounded in the unit's
//             real question bank, store it, return it
//   mark      AI-mark the written exam-question step of a lesson
//   complete  finish a lesson once: score + XP (XP goes through the increment_xp guard)
// Access: ai_usage_consume(user, 'ai_mark', LESSON_COST, 'study_hub') before a lesson is written
// (Premium / EDU are not counted), refunded if writing fails. If the usage SQL is missing, the old
// rule applies (study_hub_premium() or one free study_hub_trials lesson).
// ────────────────────────────────────────────────────────────────────────────

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

const ALLOWED_ORIGINS = new Set([
  'https://ra10.co.uk', 'https://www.ra10.co.uk',
  'http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:5173', 'http://127.0.0.1:5173',
]);
function cors(origin: string | null) {
  return {
    'Access-Control-Allow-Origin': origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://ra10.co.uk',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}
const json = (body: unknown, headers: Record<string, string>, status = 200) => new Response(JSON.stringify(body), { status, headers });
const clean = (s: unknown, max = 200) => String(s ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, ' ').replace(/[ \t]+/g, ' ').trim().slice(0, max);
const londonDate = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date());
const norm = (s: unknown) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const shuffle = <T,>(a: T[]) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

interface Ctx { admin: any; user: any; userId: string; email: string; name: string }

async function access(ctx: Ctx) {
  const { data: premium } = await ctx.admin.rpc('study_hub_premium', { p_user: ctx.userId });
  const { data: trial } = await ctx.admin.from('study_hub_trials').select('user_id').eq('user_id', ctx.userId).maybeSingle();
  return { premium: premium === true, trialUsed: !!trial };
}

// One new lesson = 5 uses of the shared AI allowance (the lesson's own exam marking is included).
const LESSON_COST = 5;
type Spend = { mode: 'usage'; eventId: number | null; usage: any } | { mode: 'trial' } | { mode: 'premium' };

// Takes the lesson's uses. Returns { blocked } with the usage snapshot when a limit is reached.
async function spendForLesson(ctx: Ctx): Promise<{ spend?: Spend; blocked?: any; error?: string }> {
  const { data, error } = await ctx.admin.rpc('ai_usage_consume', { p_user: ctx.userId, p_feature: 'ai_mark', p_amount: LESSON_COST, p_source: 'study_hub' });
  if (!error && data) {
    if (data.allowed === false) return { blocked: data };
    return { spend: { mode: 'usage', eventId: data.event_id ? Number(data.event_id) : null, usage: data } };
  }
  // usage SQL not applied yet: fall back to the old Premium / one-free-lesson rule
  console.warn('study-hub: usage check unavailable, using the old access rule:', error?.message);
  const acc = await access(ctx);
  if (acc.premium) return { spend: { mode: 'premium' } };
  if (acc.trialUsed) return { error: 'You have already used your free Study Hub lesson.' };
  const ins = await ctx.admin.from('study_hub_trials').insert({ user_id: ctx.userId });
  if (ins.error) return { error: 'You have already used your free Study Hub lesson.' };
  return { spend: { mode: 'trial' } };
}

async function refundLesson(ctx: Ctx, spend: Spend | undefined) {
  if (!spend) return null;
  if (spend.mode === 'trial') { await ctx.admin.from('study_hub_trials').delete().eq('user_id', ctx.userId); return null; }
  if (spend.mode === 'usage' && spend.eventId) {
    const { data, error } = await ctx.admin.rpc('ai_usage_refund', { p_user: ctx.userId, p_event_id: spend.eventId });
    if (error) console.warn('study-hub: usage refund failed:', error.message);
    spend.eventId = null;
    return error ? null : data;
  }
  return null;
}

function limitMessage(u: any) {
  const need = Number(u?.need) || LESSON_COST;
  return u?.blocked_by === 'day'
    ? `A Study Hub lesson uses ${need} AI uses, and you don't have enough left today.`
    : `A Study Hub lesson uses ${need} AI uses, and you don't have enough left this hour.`;
}

/* ───────────────────────────── learner profile ───────────────────────────── */
const unitKey = (u: unknown) => {
  const s = String(u || '').replace(/\/index\.html.*$/, '').replace(/\/$/, '');
  return /^\/(btec|a-level)\//.test(s) ? '/revision' + s : s;
};

async function profile(ctx: Ctx) {
  const since = new Date(Date.now() - 30 * 86400000).toISOString();
  const { data: ev } = await ctx.admin.from('activity_events')
    .select('kind, unit, view, ref, title, score, max_score, meta, duration_s, created_at')
    .eq('user_id', ctx.userId).gte('created_at', since).order('created_at', { ascending: false }).limit(3000);
  const { data: lessons } = await ctx.admin.from('study_lessons')
    .select('unit, topic, score, max_score, status, created_at').eq('user_id', ctx.userId)
    .order('created_at', { ascending: false }).limit(30);

  const units: Record<string, { n: number; last: string; secs: number }> = {};
  const topics: Record<string, { unit: string; topic: string; n: number; got: number; max: number; last: string }> = {};
  const reading: { unit: string; topic: string; at: string }[] = [];
  for (const e of ev || []) {
    const u = unitKey(e.unit);
    if (u.startsWith('/revision/')) {
      const r = units[u] || (units[u] = { n: 0, last: e.created_at, secs: 0 });
      r.n++; r.secs += Number(e.duration_s) || 0;
    }
    const topic = clean(e.meta?.topic || '', 90);
    const scored = e.score != null && Number(e.max_score) > 0;
    if (u && topic && scored) {
      const k = u + '|' + norm(topic);
      const t = topics[k] || (topics[k] = { unit: u, topic, n: 0, got: 0, max: 0, last: e.created_at });
      t.n++; t.got += Number(e.score); t.max += Number(e.max_score);
    }
    if (e.kind === 'guide_section' && u && e.title && reading.length < 12) reading.push({ unit: u, topic: clean(e.title, 90), at: e.created_at });
  }
  const recentLessonTopics = new Set((lessons || []).filter((l: any) => Date.now() - new Date(l.created_at).getTime() < 2.5 * 86400000).map((l: any) => norm(l.topic)));
  const tlist = Object.values(topics).map((t) => ({ ...t, pct: t.max ? Math.round((t.got / t.max) * 100) : 0 }));
  const weak = tlist.filter((t) => t.n >= 2 && t.pct < 65).sort((a, b) => a.pct - b.pct || b.n - a.n);
  const strong = tlist.filter((t) => t.n >= 3 && t.pct >= 80).sort((a, b) => b.pct - a.pct);
  const unitList = Object.entries(units).map(([path, r]) => ({ path, events: r.n, last: r.last, minutes: Math.round(r.secs / 60) })).sort((a, b) => b.last.localeCompare(a.last));
  const totals = { events: (ev || []).length, answered: tlist.reduce((s, t) => s + t.n, 0), units: unitList.length };

  // today's focus
  let focus: { unit: string; topic: string | null; reason: string; why: string } | null = null;
  const fresh = (t: { topic: string }) => !recentLessonTopics.has(norm(t.topic));
  const w = weak.find(fresh);
  if (w) focus = { unit: w.unit, topic: w.topic, why: 'weak', reason: `You've been scoring ${w.pct}% on ${w.topic} (${w.n} questions recently), so today we'll fix that.` };
  const rd = !focus && reading.find((r) => fresh(r) && Date.now() - new Date(r.at).getTime() < 7 * 86400000);
  if (rd) focus = { unit: rd.unit, topic: rd.topic, why: 'reading', reason: `You read about ${rd.topic} recently — let's lock it into memory with some practice.` };
  const rev = !focus && (lessons || []).find((l: any) => l.status === 'done' && l.max_score && l.score / l.max_score < 0.7 && Date.now() - new Date(l.created_at).getTime() > 2 * 86400000 && l.unit);
  if (rev) focus = { unit: rev.unit, topic: rev.topic, why: 'review', reason: `Spaced review: you found ${rev.topic || 'this'} tricky in an earlier lesson. Coming back to it now makes it stick.` };
  if (!focus && unitList[0]) focus = { unit: unitList[0].path, topic: null, why: 'continue', reason: `You've been revising this unit most recently, so here's a fresh topic to keep your momentum going.` };
  return { focus, weak: weak.slice(0, 6), strong: strong.slice(0, 6), units: unitList.slice(0, 6), reading: reading.slice(0, 5), totals, recentLessonTopics: Array.from(recentLessonTopics).slice(0, 8) };
}

/* ───────────────────────────── lesson writing ───────────────────────────── */
const STEP_TYPES = ['learn', 'mcq', 'truefalse', 'fill', 'match', 'order', 'exam', 'code', 'recap'];
const CODE_LANGS = ['python', 'javascript', 'sql'];

// Which programming language a lesson should practise (coding units, or a learner who asks for a language).
function codingLang(unit: string, unitName: string, request: string, topic: string | null): string | null {
  const t = (request + ' ' + (topic || '')).toLowerCase();
  if (/\bsql\b|database quer|select statement/.test(t)) return 'sql';
  if (/javascript|\bjs\b/.test(t)) return 'javascript';
  if (/python/.test(t)) return 'python';
  const u = (unit + ' ' + unitName).toLowerCase();
  if (/computing-aaq\/unit-(1|4)\b|programming fundamentals|practical programming/.test(u)) return 'python';
  if (/it-aaq\/unit-4\b|relational database/.test(u)) return 'sql';
  if (/it-aaq\/unit-3\b|website development/.test(u)) return 'javascript';
  return null;
}

/* ───────────── diagrams on learn cards ─────────────
   The AI describes a diagram as data; the Study Hub page draws it (study.js diagramHtml), so it is always
   tidy and readable. Every diagram is checked by the second (examiner) pass with the rest of the lesson.
   Which types a unit gets is decided by diagramPlan(). */
const DIAGRAM_TYPES = ['flow', 'concept', 'table', 'network', 'breakeven'];
const NET_KINDS = ['internet', 'router', 'firewall', 'switch', 'server', 'pc', 'laptop', 'wap', 'phone', 'cloud', 'iot'];
const NET_LINKS = ['wired', 'wireless', 'vpn', 'internet'];
function sanitiseDiagram(d: any, allowed: string[] = DIAGRAM_TYPES): any | null {
  if (!d || typeof d !== 'object') return null;
  const type = String(d.type || '').toLowerCase();
  if (!allowed.includes(type)) return null;
  const s = (x: unknown, n: number) => clean(x, n);
  const title = s(d.title, 80) || undefined;
  if (type === 'flow') {
    const steps = (Array.isArray(d.steps) ? d.steps : []).map((x: unknown) => s(x, 60)).filter(Boolean).slice(0, 7);
    if (steps.length < 2) return null;
    return { type, title, steps, cycle: d.cycle === true && steps.length >= 3 };
  }
  if (type === 'concept') {
    const centre = s(d.centre ?? d.center, 40);
    const parts = (Array.isArray(d.parts) ? d.parts : []).map((p: any) => ({ label: s(p?.label, 30), note: s(p?.note, 80) || undefined })).filter((p: any) => p.label).slice(0, 6);
    if (!centre || parts.length < 3) return null;
    return { type, title, centre, parts };
  }
  if (type === 'table') {
    const headers = (Array.isArray(d.headers) ? d.headers : []).map((h: unknown) => s(h, 30)).filter(Boolean).slice(0, 3);
    if (headers.length < 2) return null;
    const rows = (Array.isArray(d.rows) ? d.rows : []).filter(Array.isArray).map((r: any[]) => headers.map((_: string, i: number) => s(r[i], 90))).filter((r: string[]) => r.some(Boolean)).slice(0, 6);
    if (rows.length < 2) return null;
    return { type, title, headers, rows };
  }
  if (type === 'network') {
    const ids = new Set<string>();
    const perRow = [0, 0, 0, 0];
    const nodes = (Array.isArray(d.nodes) ? d.nodes : []).map((n: any) => ({
      id: s(n?.id, 20), kind: NET_KINDS.includes(String(n?.kind)) ? String(n.kind) : '', label: s(n?.label, 24), sub: s(n?.sub, 28) || undefined,
      row: Math.max(0, Math.min(3, Math.round(Number(n?.row) || 0))),
    })).filter((n: any) => n.id && n.kind && n.label && !ids.has(n.id) && ids.add(n.id) && ++perRow[n.row] <= 5).slice(0, 12);
    const keep = new Set(nodes.map((n: any) => n.id));
    const links = (Array.isArray(d.links) ? d.links : []).map((l: any) => ({ from: s(l?.from, 20), to: s(l?.to, 20), kind: NET_LINKS.includes(String(l?.kind)) ? String(l.kind) : 'wired', label: s(l?.label, 18) || undefined }))
      .filter((l: any) => keep.has(l.from) && keep.has(l.to) && l.from !== l.to).slice(0, 16);
    if (nodes.length < 2 || !links.length) return null;
    return { type, title, nodes, links };
  }
  if (type === 'breakeven') {
    const fixed = Number(d.fixed), variable = Number(d.variable), price = Number(d.price);
    if (!(fixed > 0 && fixed <= 1e9 && variable >= 0 && price > variable && price <= 1e6)) return null;
    const be = fixed / (price - variable);
    let maxUnits = Math.round(Number(d.maxUnits));
    if (!(maxUnits > be * 1.2 && maxUnits <= be * 4)) maxUnits = Math.max(2, Math.ceil(be * 2));
    return { type, title, fixed, variable, price, maxUnits, unit: s(d.unit, 16) || 'units' };
  }
  return null;
}
const DIAGRAM_SHAPES: Record<string, string> = {
  flow: '{"type":"flow","title":"","steps":["first","second","third"],"cycle":false}',
  concept: '{"type":"concept","title":"","centre":"","parts":[{"label":"","note":""}]}',
  table: '{"type":"table","title":"","headers":["",""],"rows":[["",""],["",""]]}',
  network: '{"type":"network","title":"","nodes":[{"id":"net","kind":"internet","label":"Internet","row":0},{"id":"fw","kind":"firewall","label":"Firewall","row":1},{"id":"sw","kind":"switch","label":"Switch","sub":"192.168.1.0/24","row":2},{"id":"pc1","kind":"pc","label":"Staff PC","row":3}],"links":[{"from":"net","to":"fw","kind":"internet"},{"from":"fw","to":"sw","kind":"wired"},{"from":"sw","to":"pc1","kind":"wired"}]}',
  breakeven: '{"type":"breakeven","title":"","fixed":12000,"variable":4,"price":10,"unit":"units"}',
};
function diagramPlan(unit: string, unitName: string): { types: string[]; hint: string } {
  const u = `${unit} ${unitName}`.toLowerCase();
  if (/it-aaq|computing|\/it\/|information technology|cyber|network|database|website/.test(u)) {
    return { types: ['network', 'flow', 'concept', 'table'], hint: 'Use a "network" diagram for any networking or security topic (devices, segments, firewalls, VPNs, DMZs, Wi-Fi; node kinds: ' + NET_KINDS.join(', ') + '; link kinds: ' + NET_LINKS.join(', ') + '; "row" 0 = internet at the top down to 3 = end devices; put an IP address, subnet or port in "sub" where it teaches something). Use a "flow" for processes (incident response, the forensic procedure, algorithms), a "concept" map for categories, and a "table" to compare.' };
  }
  if (/business/.test(u)) {
    return { types: ['breakeven', 'flow', 'concept', 'table'], hint: 'Use "breakeven" only for break-even, contribution or cost topics: give realistic whole-number fixed costs, variable cost per unit and selling price, and make the learn card\'s numbers match them (the page calculates the lines and the break-even point). Use a "flow" for processes (e.g. recruitment, the marketing planning process), a "concept" map for factors or stakeholders, and a "table" to compare options.' };
  }
  if (/sport|health|medical|childhood|psychology|anatomy/.test(u)) {
    return { types: ['flow', 'concept', 'table'], hint: 'Use a "flow" for processes and pathways (set "cycle": true only for a genuine cycle such as the cardiac cycle), a "concept" map for components (e.g. components of fitness), and a "table" to compare (e.g. types, studies, strengths and weaknesses).' };
  }
  return { types: ['flow', 'concept', 'table'], hint: 'Use a "flow" for processes, a "concept" map for components and a "table" to compare.' };
}

// Fill-the-gap answers compare loosely: case, punctuation, a leading article and simple plurals don't matter.
// Kept in step with fillKey() in study-hub/study.js.
function fillKey(x: unknown): string {
  return norm(x).replace(/^(a|an|the) /, '').split(' ').map((w) => w.length <= 3 ? w
    : /ies$/.test(w) ? w.slice(0, -3) + 'y'
    : /(sses|xes|ches|shes|zes)$/.test(w) ? w.slice(0, -2)
    : /[^s]s$/.test(w) ? w.slice(0, -1) : w).join(' ');
}

/* ───────────── multiple choice: giveaways and repeats ─────────────
   A question is a giveaway when the right answer is clearly the longest choice (students learn to pick it).
   Two checks are "the same" when their wording overlaps heavily, or they share the correct answer and the
   key words of the question. */
function lengthTell(s: any): boolean {
  if (!s || s.type !== 'mcq' || !Array.isArray(s.choices) || s.choices.length < 3) return false;
  const L = s.choices.map((c: string) => String(c || '').length);
  const a = L[s.answer];
  const other = Math.max(...L.filter((_: number, i: number) => i !== s.answer));
  return a > other * 1.25 && a - other >= 10;
}
type Check = { q: string; a: string };
const STOP = new Set('the a an of to in and or is are was were which what why how when who for on with by be been this that these those it its as at from does do can could would should will not your their they them than then into about most best main one two following'.split(' '));
const keyWords = (s: string) => new Set(norm(s).split(' ').filter((w) => w.length > 2 && !STOP.has(w)).map((w) => w.replace(/(ies|es|s)$/, '')));
function checkOf(s: any): Check {
  if (s.type === 'mcq') return { q: s.q, a: String(s.choices?.[s.answer] ?? '') };
  if (s.type === 'truefalse') return { q: s.statement, a: s.answer ? 'true' : 'false' };
  return { q: String(s.q || s.text || ''), a: '' };
}
function sameCheck(x: Check, y: Check): boolean {
  if (!x.q || !y.q) return false;
  if (norm(x.q) === norm(y.q)) return true;
  const A = keyWords(x.q), B = keyWords(y.q);
  if (!A.size || !B.size) return false;
  let n = 0; A.forEach((w) => { if (B.has(w)) n++; });
  const overlap = n / Math.min(A.size, B.size);
  const sameAnswer = !!x.a && x.a.length > 5 && norm(x.a) === norm(y.a);
  return (overlap >= 0.75 && n >= 3) || (sameAnswer && n >= 2);
}
function dedupeChecks(steps: any[]): any[] {
  const kept: Check[] = [];
  return steps.filter((s) => {
    if (s.type !== 'mcq' && s.type !== 'truefalse') return true;
    const c = checkOf(s);
    if (kept.some((k) => sameCheck(c, k))) return false;
    kept.push(c); return true;
  });
}
/* Spaced recall. A check that just asks the learner to repeat what the card in front of it said (its definition,
   term or a copied sentence) only tests the last 20 seconds of reading. Such checks are moved later in the lesson —
   into a "quick recall" stretch before the exam step — so they test whether the learner really remembered it.
   Checks that make the learner apply or reason with the card stay where they are. */
const RECALL_Q = /^(what is|what are|what does\b.*\b(mean|stand for)|what do we call|what is meant by|define|which (term|word|name)\b|which of these is (the )?(definition|name|term))/i;
const cardText = (c: any) => [c.title, c.body, ...(Array.isArray(c.points) ? c.points : []), c.example].filter(Boolean).join(' ');
function recallOfCard(s: any, card: any): boolean {
  if (!card) return false;
  if (s.type === 'match') return true;                 // terms and definitions straight after reading them
  const text = s.type === 'fill' ? String(s.text || '') + ' ' + (Array.isArray(s.blanks) ? s.blanks.join(' ') : '')
    : s.type === 'truefalse' ? String(s.statement || '')
    : s.type === 'mcq' ? String(s.q || '') + ' ' + String(s.choices?.[s.answer] ?? '') : '';
  const W = keyWords(text), C = keyWords(cardText(card));
  if (!W.size || !C.size) return false;
  let n = 0; W.forEach((w) => { if (C.has(w)) n++; });
  const overlap = n / W.size;
  if (s.type === 'fill' || s.type === 'truefalse') return overlap >= 0.7;   // a sentence lifted from the card
  return s.type === 'mcq' && (RECALL_Q.test(String(s.q || '').trim()) || overlap >= 0.8);
}
function spaceRecall(steps: any[]): any[] {
  const out: any[] = [], moved: any[] = [];
  let card: any = null, since = 99;
  for (const s of steps) {
    if (s.type === 'learn') { card = s; since = 0; out.push(s); continue; }
    since++;
    if (since <= 2 && !s.bank && ['mcq', 'truefalse', 'fill', 'match'].includes(s.type) && recallOfCard(s, card)) { moved.push({ ...s, recall: true }); continue; }
    out.push(s);
  }
  if (!moved.length) return steps;
  let at = out.findIndex((s) => s.type === 'exam');
  if (at < 0) at = out.findIndex((s) => s.type === 'recap');
  if (at < 0) at = out.length;
  out.splice(at, 0, ...moved);
  return out;
}
// Multiple-choice and true/false checks from the learner's recent lessons in this unit (so they are not asked again).
async function pastChecks(ctx: Ctx, unit: string): Promise<Check[]> {
  if (!unit) return [];
  const { data } = await ctx.admin.from('study_lessons').select('content').eq('user_id', ctx.userId).eq('unit', unit).order('created_at', { ascending: false }).limit(25);
  const out: Check[] = [];
  for (const l of data || []) for (const s of (l?.content?.steps || [])) if (s && (s.type === 'mcq' || s.type === 'truefalse')) out.push(checkOf(s));
  return out.filter((c) => c.q).slice(0, 120);
}

/* ───────────── pictures on learn cards ─────────────
   The AI gives a search phrase; openly licensed candidates come from Wikimedia Commons, and a second AI call
   picks the one that really shows what the card teaches (or none — a wrong picture is worse than no picture).
   Only the picture's link, caption and credit are stored. */
function sanitiseImage(x: any): any {
  if (!x || typeof x !== 'object') return undefined;
  const src = String(x.src || '');
  if (/^https:\/\/(upload|thumb)\.wikimedia\.org\/[^\s"'<>]+$/.test(src) && src.length <= 600) {
    const page = String(x.page || '');
    return { src, page: /^https:\/\/commons\.wikimedia\.org\/[^\s"'<>]+$/.test(page) && page.length <= 600 ? page : undefined,
      caption: clean(x.caption, 140) || undefined, credit: clean(x.credit, 120) || undefined, license: clean(x.license, 40) || undefined };
  }
  const query = clean(x.query, 80);
  return query ? { query, caption: clean(x.caption, 140) || undefined } : undefined;
}
const stripTags = (s: unknown) => String(s ?? '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/\s+/g, ' ').trim();
async function commonsSearch(query: string): Promise<any[]> {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=8'
    + '&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiurlwidth=800&iiextmetadatafilter=LicenseShortName|Artist|ImageDescription'
    + '&gsrsearch=' + encodeURIComponent(query + ' filetype:bitmap|drawing');
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 8000);
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'RA10-StudyHub/1.0 (https://ra10.co.uk; revision lesson pictures)' }, signal: ctl.signal });
    if (!r.ok) return [];
    const j = await r.json();
    const pages = Object.values(j?.query?.pages || {}) as any[];
    return pages.sort((a, b) => (a.index || 0) - (b.index || 0)).map((p) => {
      const ii = p?.imageinfo?.[0] || {}; const md = ii.extmetadata || {};
      const license = stripTags(md.LicenseShortName?.value);
      return { title: String(p.title || '').replace(/^File:/, '').replace(/\.[a-z0-9]+$/i, ''), desc: stripTags(md.ImageDescription?.value).slice(0, 220),
        src: String(ii.thumburl || ''), page: String(ii.descriptionurl || ''), w: Number(ii.thumbwidth) || 0, h: Number(ii.thumbheight) || 0,
        mime: String(ii.mime || ''), license, credit: stripTags(md.Artist?.value).slice(0, 100) };
    }).filter((c) => /^image\/(jpeg|png|svg\+xml|webp)$/.test(c.mime) && c.src && c.w >= 300 && c.h >= 160 && c.w / c.h < 3.2 && c.h / c.w < 2.2
      && c.license && !/fair use|non-free/i.test(c.license) && !/\b(flag of|coat of arms|signature|logo)\b/i.test(c.title));
  } catch { return []; } finally { clearTimeout(t); }
}
async function findPictures(steps: any[], unitName: string, qual: string): Promise<Map<number, any>> {
  const out = new Map<number, any>();
  const cards = steps.filter((s) => s.type === 'learn' && !s.diagram && s.image?.query).slice(0, 3);
  if (!cards.length || !hasProviders()) return out;
  const found = await Promise.all(cards.map((s) => commonsSearch(s.image.query)));
  const ask = cards.map((s, n) => ({ card: s._k, title: s.title, teaches: clean(s.body, 300), wanted: s.image.query,
    candidates: found[n].slice(0, 6).map((c, j) => ({ id: j, title: c.title, description: c.desc })) })).filter((x) => x.candidates.length);
  if (!ask.length) return out;
  const r = await askJson(
    'You choose pictures for a revision lesson for UK students. A picture must clearly and accurately show what the card teaches. Pick nothing rather than a vague, misleading, off-topic, low-value, mostly-text, unrelated-language, gory or adult picture, or a portrait of someone the card is not about. Reply with JSON only.',
    `Course: ${qual} — ${unitName}
For each card, choose the candidate (by id) that best shows what the card teaches, judging from its title and description, or null if none clearly does.
Cards: ${JSON.stringify(ask)}
Return {"cards":[{"card":0,"pick":0|null,"caption":"under 12 words: what the picture shows, as it relates to the card"}]}`,
    20000, { temperature: 0, maxTokens: 900 });
  for (const v of (Array.isArray(r.json?.cards) ? r.json.cards : [])) {
    const k = Math.round(Number(v?.card)); const n = cards.findIndex((s) => s._k === k);
    const pick = v?.pick == null ? -1 : Math.round(Number(v.pick));
    if (n < 0 || !(pick >= 0)) continue;
    const c = found[n][pick]; if (!c) continue;
    const img = sanitiseImage({ src: c.src, page: c.page, caption: clean(v.caption, 140) || cards[n].image.caption, credit: c.credit, license: c.license });
    if (img?.src) out.set(k, img);
  }
  return out;
}

function sanitiseStep(s: any, keepOrder = false, diagramTypes: string[] = DIAGRAM_TYPES): any | null {
  if (!s || typeof s !== 'object') return null;
  const t = String(s.type || '').toLowerCase();
  if (!STEP_TYPES.includes(t)) return null;
  const str = (x: unknown, n = 600) => clean(x, n);
  if (t === 'learn') {
    const body = str(s.body, 900); if (!body) return null;
    return { type: t, title: str(s.title, 90), body, points: (Array.isArray(s.points) ? s.points : []).map((p: unknown) => str(p, 200)).filter(Boolean).slice(0, 4), example: str(s.example, 400) || undefined, diagram: sanitiseDiagram(s.diagram, diagramTypes) || undefined, image: sanitiseImage(s.image) };
  }
  if (t === 'mcq') {
    const choices = (Array.isArray(s.choices) ? s.choices : []).map((c: unknown) => str(c, 200)).filter(Boolean);
    const a = Number(s.answer);
    if (!str(s.q) || choices.length < 2 || choices.length > 5 || !(a >= 0 && a < choices.length)) return null;
    if (new Set(choices.map(norm)).size !== choices.length) return null;
    // re-order so the right answer isn't always in the same place
    const order = keepOrder ? choices.map((_: string, i: number) => i) : shuffle(choices.map((_: string, i: number) => i));
    return { type: t, q: str(s.q), choices: order.map((i) => choices[i]), answer: order.indexOf(a), explain: str(s.explain, 400), bank: !!s.bank || undefined };
  }
  if (t === 'truefalse') {
    if (!str(s.statement) || typeof s.answer !== 'boolean') return null;
    return { type: t, statement: str(s.statement), answer: s.answer, explain: str(s.explain, 400) };
  }
  if (t === 'fill') {
    const text = str(s.text, 400);
    const blanks = (Array.isArray(s.blanks) ? s.blanks : []).map((b: unknown) => str(b, 40)).filter(Boolean);
    const gaps = (text.match(/_{2,}/g) || []).length;
    if (!text || !blanks.length || gaps !== blanks.length || blanks.length > 3) return null;
    // One tile per gap (a word that fills two gaps gets two tiles), then distractors. A "distractor" that is only
    // a variant of an answer (plural, article, capitals: "firewalls" for "firewall") would be marked wrong while
    // looking right, so it is removed.
    const answerKeys = new Set(blanks.map(fillKey));
    const distractors: string[] = [];
    const seenD = new Set<string>();
    for (const o of (Array.isArray(s.options) ? s.options : []).map((o: unknown) => str(o, 40)).filter(Boolean)) {
      const k = fillKey(o);
      if (!k || answerKeys.has(k) || seenD.has(k)) continue;
      seenD.add(k); distractors.push(o);
    }
    const options = [...blanks, ...distractors.slice(0, Math.max(2, 7 - blanks.length))];
    return { type: t, text: text.replace(/_{2,}/g, '___'), blanks, options: keepOrder ? options : shuffle(options), explain: str(s.explain, 400) };
  }
  if (t === 'match') {
    const pairs = (Array.isArray(s.pairs) ? s.pairs : []).map((p: any) => Array.isArray(p) ? [str(p[0], 60), str(p[1], 140)] : [str(p?.term ?? p?.left, 60), str(p?.definition ?? p?.right, 140)]).filter((p: string[]) => p[0] && p[1]).slice(0, 5);
    if (pairs.length < 3 || new Set(pairs.map((p: string[]) => norm(p[0]))).size !== pairs.length) return null;
    return { type: t, prompt: str(s.prompt, 160) || 'Match each term to its meaning', pairs };
  }
  if (t === 'order') {
    const items = (Array.isArray(s.items) ? s.items : []).map((x: unknown) => str(x, 120)).filter(Boolean).slice(0, 6);
    if (items.length < 3 || new Set(items.map(norm)).size !== items.length) return null;
    return { type: t, prompt: str(s.prompt, 200) || 'Put these in the right order', items, explain: str(s.explain, 400) };
  }
  if (t === 'exam') {
    const marks = Math.max(1, Math.min(12, Math.round(Number(s.marks) || 0)));
    const points = (Array.isArray(s.points) ? s.points : []).map((p: unknown) => str(p, 220)).filter(Boolean).slice(0, 12);
    if (!str(s.q) || !points.length) return null;
    return { type: t, q: str(s.q, 900), context: str(s.context, 900) || undefined, marks, points, model: str(s.model, 1500), source: s.source === 'exam' ? 'exam' : 'practice', verb: str(s.verb, 20) || undefined };
  }
  if (t === 'code') {
    // Checked by RUNNING it in the learner's browser: the model solution must pass every test before the step is shown,
    // and expected outputs are produced from the solution itself, so no hand-written answer key can be wrong.
    const lang = CODE_LANGS.includes(String(s.lang || '').toLowerCase()) ? String(s.lang).toLowerCase() : 'python';
    const code = (x: unknown, n: number) => String(x == null ? '' : x).replace(/\r/g, '').slice(0, n);
    const brief = str(s.brief, 700), solution = code(s.solution, 3000);
    if (!brief || !solution.trim()) return null;
    const tests = (Array.isArray(s.tests) ? s.tests : []).slice(0, 5).map((x: any) => ({
      stdin: Array.isArray(x?.stdin) ? x.stdin.map((v: unknown) => String(v).slice(0, 200)).slice(0, 12) : [],
      check: code(x?.check, 1500) || undefined,
    }));
    if (lang !== 'sql' && !tests.length) return null;
    return { type: t, lang, title: str(s.title, 90) || 'Write the code', brief, starter: code(s.starter, 2000), solution,
      setup: lang === 'sql' ? code(s.setup, 4000) : undefined, tests: lang === 'sql' ? [] : tests,
      hints: (Array.isArray(s.hints) ? s.hints : []).map((h: unknown) => str(h, 240)).filter(Boolean).slice(0, 3), explain: str(s.explain, 400) };
  }
  if (t === 'recap') {
    const points = (Array.isArray(s.points) ? s.points : []).map((p: unknown) => str(p, 200)).filter(Boolean).slice(0, 5);
    if (!points.length) return null;
    return { type: t, title: str(s.title, 90) || 'Key takeaways', points };
  }
  return null;
}

function bankMcq(q: any) {
  const choices = (Array.isArray(q?.choices) ? q.choices : []).map((c: unknown) => clean(c, 200)).filter(Boolean);
  const a = Number(q?.correct);
  if (!clean(q?.q) || choices.length < 2 || !(a >= 0 && a < choices.length)) return null;
  return sanitiseStep({ type: 'mcq', q: q.q, choices, answer: a, explain: '', bank: true });
}

// Icon keys the app can draw (custom animated SVGs — no emojis).
const ICONS = ['shield', 'lock', 'network', 'database', 'code', 'chip', 'globe', 'alert', 'chart', 'coins', 'megaphone', 'people', 'scales', 'target', 'heart', 'dumbbell', 'lungs', 'bolt', 'book', 'brain', 'cloud', 'gear', 'clipboard', 'lightbulb'];

// Plain strings from a mark scheme, whatever shape it is stored in.
function schemePoints(ms: any): string[] {
  if (!ms || typeof ms !== 'object') return [];
  const toStr = (x: any) => typeof x === 'string' ? x : x && typeof x === 'object' ? String(x.text || x.point || x.description || x.descriptor || x.content || '') : '';
  for (const k of ['points', 'indicative_content', 'marking_points', 'answers', 'credit']) {
    if (Array.isArray(ms[k]) && ms[k].length) return ms[k].map(toStr).map((s: string) => clean(s, 260)).filter(Boolean).slice(0, 14);
  }
  if (Array.isArray(ms.levels)) return ms.levels.map((l: any) => clean(`${l.level ? 'Level ' + l.level + (l.marks ? ' (' + l.marks + ')' : '') + ': ' : ''}${toStr(l)}`, 260)).filter(Boolean).slice(0, 6);
  // past-paper schemes are sometimes only stored as the official text
  if (typeof ms.raw === 'string' && ms.raw.trim()) return ms.raw.split('\n').map((l: string) => clean(l.replace(/^[•\-]\s*/, ''), 260)).filter((l: string) => l && !/^guidance:/i.test(l)).slice(0, 14);
  return [];
}
// A real question is only used as the lesson's exam step if it stands on its own: it has a mark scheme we can show,
// and it does not depend on a table, figure, diagram or code listing that Study Hub cannot display (otherwise the
// question looks unrelated to its mark scheme).
function usableReal(q: any): boolean {
  if (!q || !clean(q.question)) return false;
  if (!schemePoints(q.mark_scheme).length) return false;
  const t = String(q.question || '');
  if (q.fig || q.padFig || q.diagram || String(q.type || '') === 'diagram') return false;
  if (/\b(the|this|following) (table|figure|diagram|flowchart|flow chart|graph|chart|trace table|truth table|logic (circuit|diagram)|algorithm|code|program|pseudocode)\b|\bfig\.?\s*\d|\btick\b|\bcomplete the\b|\bshown (below|above)\b|\bin the box\b|\bline (number|\d)/i.test(t)) return false;
  return true;
}
// Keep a real question small enough to store with the lesson and send to the AI Examiner.
function trimReal(q: any) {
  if (!q || typeof q !== 'object') return null;
  try {
    const keep: any = {};
    for (const k of ['id', 'question', 'marks', 'command_verb', 'topic', 'learning_aim', 'scenario', 'context', 'case_study', 'subject', 'spec_code', 'unit', 'paper_id', 'activity', 'type', 'mark_scheme', 'stem', 'data', 'extract']) if (q[k] != null) keep[k] = q[k];
    const s = JSON.stringify(keep);
    return s.length <= 24000 ? JSON.parse(s) : { ...keep, mark_scheme: { points: schemePoints(q.mark_scheme) } };
  } catch { return null; }
}

const LENGTHS: Record<string, { steps: string; learn: number; minutes: number }> = {
  quick: { steps: '8–10', learn: 3, minutes: 4 },
  standard: { steps: '12–15', learn: 4, minutes: 7 },
  deep: { steps: '16–20', learn: 6, minutes: 11 },
};
const FOCUS: Record<string, string> = {
  learn: 'Focus on TEACHING: more learn cards with clear explanations and examples; checks are gentle and follow each card.',
  practise: 'Focus on PRACTICE: keep learn cards short (refreshers) and use more varied checks.',
  exam: 'Focus on EXAM TECHNIQUE: include learn cards on what the command words require and how marks are awarded, and include 2 exam steps instead of 1.',
};

// Difficulty (chosen in "Make a lesson"; the daily lesson is always medium).
const DIFFICULTY: Record<string, { label: string; prompt: string; exam: string }> = {
  easy: {
    label: 'Easy',
    prompt: 'DIFFICULTY: EASY. The learner is building confidence: teach the core definitions and the most important facts in plain language with familiar examples. Checks test recall and recognition of key terms; mcq distractors are clearly wrong to someone who read the cards; no multi-step reasoning.',
    exam: 'exam: marks 2–4, a State / Identify / Describe / short Explain question on core content.',
  },
  medium: {
    label: 'Medium',
    prompt: 'DIFFICULTY: MEDIUM. Exam-standard: teach the content at the depth of the specification. Checks mix recall with understanding and application to short examples; mcq distractors are plausible misconceptions.',
    exam: 'exam: marks 3–6, an Explain / Describe / Analyse question, ideally applied to a short context.',
  },
  hard: {
    label: 'Hard',
    prompt: 'DIFFICULTY: HARD. Stretch towards the top grades: include the finer detail, links between ideas, exceptions, limitations and evaluation, and less common parts of the topic. Checks need application to unfamiliar scenarios and multi-step reasoning; mcq distractors are strong misconceptions that need real understanding to rule out; true/false claims test precise detail.',
    exam: 'exam: marks 6–9, an Analyse / Discuss / Assess / Evaluate question applied to a short scenario in "context"; "points" are indicative content covering both sides and a judgement, the model answer reaches a supported conclusion.',
  },
};

const CODE_PROMPT: Record<string, string> = {
  python: `This is a PROGRAMMING lesson in Python 3 (the language in the specification). Include exactly 2 "code" steps where the learner writes a short program (5–15 lines), placed after the learn cards that teach what they need. Use only the standard library. Programs read input with input() and write with print(). Each code step has 2–3 tests: each test gives the "stdin" lines to feed input() (or [] if none) and, for function tasks, an optional "check" of Python assert statements run after the program (eg "assert total([1,2]) == 3"). Do NOT write expected outputs — they are produced by running your "solution", which must be correct, complete and pass every check.`,
  javascript: `This is a PROGRAMMING lesson in JavaScript for web development. Include exactly 2 "code" steps where the learner writes a short function (5–15 lines). Each test has a "check" of JavaScript statements using assert(condition, message), eg "assert(add(2, 3) === 5, 'add(2,3) should be 5')". Do not use the DOM or network. Your "solution" must pass every check.`,
  sql: `This is a DATABASE lesson in SQL (SQLite dialect). Include exactly 2 "code" steps where the learner writes one SQL query. Each code step has "setup" (CREATE TABLE and INSERT statements for a small table of 5–8 realistic rows), a "starter" (eg "SELECT"), and a correct "solution" query. The learner's result is compared with the result of your solution, so the solution must be exactly right; include ORDER BY when the order matters.`,
};

async function writeLesson(input: { unit?: string; unitName: string; qual: string; topic: string | null; request: string; focusReason: string; prof: any; grounding: any; length?: string; focus?: string; difficulty?: string; coding?: string | null; seen?: Check[] }) {
  const diff = DIFFICULTY[String(input.difficulty || '')] || DIFFICULTY.medium;
  const seen: Check[] = Array.isArray(input.seen) ? input.seen : [];
  const g = input.grounding || {};
  // bank questions whose right answer is clearly the longest choice, or that the learner has already had, are left out
  const seenIn: Check[] = Array.isArray(input.seen) ? input.seen : [];
  const bankQuiz = (Array.isArray(g.quiz) ? g.quiz : []).filter((q: any) => q && Array.isArray(q.choices)
    && !lengthTell({ type: 'mcq', choices: q.choices.map((c: unknown) => String(c ?? '')), answer: Number(q.correct) })
    && !seenIn.some((x) => sameCheck({ q: String(q.q || ''), a: String(q.choices[Number(q.correct)] ?? '') }, x))).slice(0, 8);
  const realExam = (Array.isArray(g.exam) ? g.exam : []).filter(usableReal).map(trimReal).filter((q: any) => q && clean(q.question)).slice(0, 3);
  const bankExam = realExam.length
    ? realExam.map((q: any) => ({ ref: String(q.id), q: clean(q.question, 700), marks: q.marks, verb: q.command_verb || '', context: clean(q.scenario || q.context || '', 500), mark_scheme: schemePoints(q.mark_scheme) }))
    : (Array.isArray(g.questions) ? g.questions : []).slice(0, 3);
  const specTopics = (Array.isArray(g.topics) ? g.topics : []).slice(0, 60).map((t: unknown) => clean(t, 90));
  const len = LENGTHS[String(input.length || '')] || LENGTHS.standard;
  const focus = FOCUS[String(input.focus || '')] || '';
  const plan = diagramPlan(String(input.unit || ''), input.unitName);
  const sys = `You are an expert ${input.qual} teacher and examiner who writes bite-size, game-like revision lessons (like Duolingo). Accuracy is the top priority: every fact and every answer key must be correct for the ${input.qual} specification, and every question must have exactly one defensible correct answer. British English. Reply with JSON only.`;
  const learner = {
    weak_topics: (input.prof?.weak || []).map((t: any) => `${t.topic} (${t.pct}%)`),
    strong_topics: (input.prof?.strong || []).map((t: any) => t.topic),
    recently_read: (input.prof?.reading || []).map((r: any) => r.topic),
  };
  const user = `Unit: ${input.unitName}
${input.topic ? `Topic for this lesson: ${input.topic}` : `No topic chosen — pick ONE specific topic from the unit's specification that is NOT one of the learner's strong topics${input.prof?.recentLessonTopics?.length ? ' and not one of these recent lessons: ' + input.prof.recentLessonTopics.join('; ') : ''}.`}
${input.request ? `The learner asked: "${clean(input.request, 300)}"` : ''}
Why this lesson: ${input.focusReason || 'learner chose it'}
Learner profile: ${JSON.stringify(learner)}
Specification topics in this unit: ${JSON.stringify(specTopics)}
Real multiple-choice questions from the RA10 bank on this area (correct answers are reliable; you may reuse them): ${JSON.stringify(bankQuiz)}
Real exam questions on this area, with their official mark schemes: ${JSON.stringify(bankExam)}
${seen.length ? `Questions this learner has ALREADY had in recent lessons — do not ask any of these again or test the same fact in the same way: ${JSON.stringify(seen.slice(0, 30).map((x) => x.q))}` : ''}
If one of these real exam questions fits the topic, the exam step MUST be that question word-for-word with "source":"exam" and "ref" set to its ref, using its mark scheme for "points".

Write a ${len.minutes}-minute lesson of ${len.steps} steps that TEACHES the topic and then checks understanding. Alternate short "learn" cards with practice.
How checks are placed (this matters most for learning):
- The check(s) straight after a learn card must make the learner THINK with what they just read, never just repeat it back: apply it to a short new scenario, pick the example that fits, predict what would happen, explain why, spot the mistake, or compare two ideas. NEVER ask straight after a card for the definition, term or fact that card has just stated (no "What is …?", "Which term means …?", or a fill / true-false that copies a sentence from that card).
- Straight recall of definitions, key terms and facts (eg "Which term means …?", fill-the-gap, match) goes LATER, as spaced retrieval: at least two steps after the card that taught it — ideally in a mixed "quick recall" stretch near the end, before the exam step, drawing on several earlier cards. Use at least ${len.learn} learn cards, at least 3 mcq, 1 truefalse, 1 fill, 1 match, 1 order (only if the topic has a genuine fixed sequence — otherwise another mcq), exactly 1 exam step near the end, and finish with 1 recap.
${focus}
${diff.prompt}
${input.coding ? CODE_PROMPT[input.coding] + '\n' : ''}Answer-key rules (these are checked — be precise):
- mcq: 4 choices, exactly ONE correct; distractors are plausible but definitely wrong (no "all of the above", no two choices that could both be argued). "answer" is the 0-based index of the correct choice.
- mcq must NOT be guessable without knowing the topic: all 4 choices are the same kind of thing, in the same grammatical form, with the SAME length and level of detail (within a few words of each other). The correct choice must NOT be the longest, the most detailed or the only "textbook-sounding" one — write it as briefly as the distractors, or give the distractors equal detail. Distractors are real misconceptions or closely related terms from this unit, never silly or obviously off-topic; no clue words shared only between the question and the answer; no absolute words ("always", "never") used only in distractors.
- every mcq, truefalse and fill tests a DIFFERENT fact — never ask the same thing twice in one lesson, even in different words.
- truefalse: a single clear claim that is unambiguously true or false per the specification — no trick wording.
- fill: a sentence from an EARLIER learn card (not the card just before it) with 1 (max 2) "___" gaps where the missing word is a specific KEY TERM; "blanks" are the exact words in gap order, written exactly as they read in the sentence (same form, singular/plural); with 2 gaps the two answers must be different words that cannot be swapped; "options" contain the blanks plus 2–3 distractors that DO NOT make the sentence true (never synonyms, plurals or near-synonyms of the answer). EVERY option must fit the sentence grammatically — the same part of speech, singular/plural and tense as the answer — so grammar never gives the answer away or rules an option out; do not put "a" or "an" directly before a gap (write "the ___" or rephrase).
- match: 4 pairs of [term, short definition]; each definition fits only its own term.
- order: items listed in the CORRECT order of a recognised sequence (process stages, steps of a model), not a matter of opinion.
- ${diff.exam} "points" are the mark scheme as an examiner writes it: one creditable idea per line with "(1)", a "point (1) + linked expansion (1)" line for Explain marks, and "/" between acceptable alternatives. Give MORE creditable points than the marks available (at least marks + 2) so different correct answers are all covered. "model" is a full-mark answer that uses the command word properly.
- learn cards: 2–4 short sentences (max 70 words), 2–3 bullet points, and a concrete example where useful. Every check must be answerable from the learn cards.
- diagrams: give 2–3 learn cards a "diagram" where a picture genuinely helps (otherwise "diagram": null). Allowed types for this unit: ${plan.types.join(', ')}. ${plan.hint} Labels are short and must be accurate for the specification. Shapes: ${plan.types.map((k) => DIAGRAM_SHAPES[k]).join(' | ')}
- pictures: give 1–3 learn cards that have NO diagram an "image" when a real photo or illustration would help the learner picture what the card teaches — a device or piece of equipment, a body part or organ, a place or building, a real product, event or organisation, a named theorist, or a real-world example from the card. "query" is 2–5 plain English words to search Wikimedia Commons for exactly that thing (e.g. "network switch rack", "human heart anatomy", "WannaCry ransom note"); "caption" says in under 12 words what the picture shows. Use "image": null for abstract ideas that a photo cannot show.
Every check has a one-sentence "explain" that teaches.
Pick "icon" for the lesson from: ${ICONS.join(', ')}.
Return JSON exactly like:
{"title":"short catchy lesson title","icon":"shield","topic":"the specific topic","summary":"one sentence: what you'll be able to do","minutes":${len.minutes},
 "steps":[
  {"type":"learn","title":"","body":"","points":["",""],"example":"","diagram":null,"image":{"query":"","caption":""}},
  {"type":"mcq","q":"","choices":["","","",""],"answer":0,"explain":""},
  {"type":"truefalse","statement":"","answer":true,"explain":""},
  {"type":"fill","text":"A ___ is ...","blanks":["word"],"options":["word","other","other"],"explain":""},
  {"type":"match","prompt":"Match each term to its meaning","pairs":[["term","meaning"]]},
  {"type":"order","prompt":"","items":["first","second","third","fourth"],"explain":""},
  {"type":"exam","q":"","context":"optional short scenario","marks":4,"verb":"Explain","points":["",""],"model":"","source":"practice","ref":""},${input.coding ? `
  {"type":"code","lang":"${input.coding}","title":"","brief":"what to write, with an example","starter":"","solution":"",${input.coding === 'sql' ? '"setup":"CREATE TABLE ...; INSERT INTO ...;",' : '"tests":[{"stdin":[],"check":""}],'}"hints":["",""],"explain":"what the solution shows"},` : ''}
  {"type":"recap","title":"Key takeaways","points":["",""]}
 ]}`;
  const r = await askJson(sys, user, 70000, { preferStrong: true, temperature: 0.25, maxTokens: 6000 });
  const L = r.json || {};
  const rawSteps = Array.isArray(L.steps) ? L.steps : [];
  // keep the AI's ref next to each sanitised step
  let steps: any[] = [];
  rawSteps.forEach((raw: any) => {
    const s = sanitiseStep(raw, false, plan.types);
    if (!s) return;
    if (s.type === 'exam') {
      const ref = clean(raw?.ref, 80);
      const real = realExam.find((q: any) => ref && String(q.id) === ref) || realExam.find((q: any) => norm(q.question).slice(0, 80) === norm(s.q).slice(0, 80));
      const pts = real ? schemePoints(real.mark_scheme) : [];
      // the real question is used only together with its own official mark scheme — never with the AI's points
      if (real && pts.length) {
        steps.push({ ...s, q: clean(real.question, 900), marks: Math.max(1, Math.min(30, Math.round(Number(real.marks) || s.marks))), verb: clean(real.command_verb, 20) || s.verb, context: clean(real.scenario || real.context || s.context || '', 1500) || undefined, points: pts, model: '', source: 'exam', real });
        return;
      }
      s.source = 'practice';
    }
    steps.push(s);
  });
  // the same fact asked twice in one lesson: keep the first
  steps = dedupeChecks(steps);
  steps.forEach((s: any, k: number) => { s._k = k; });
  // check every answer key with a second, independent pass; find the learn-card pictures at the same time
  const [checked, pics] = await Promise.all([
    verifySteps(steps, input.unitName, input.qual).catch((e) => { console.warn('study-hub verify failed', e); return { steps, verified: false }; }),
    findPictures(steps, input.unitName, input.qual).catch((e) => { console.warn('study-hub pictures failed', e); return new Map<number, any>(); }),
  ]);
  steps = checked.steps.map((s: any) => {
    const pic = s.type === 'learn' && !s.diagram ? pics.get(s._k) : null;
    const { _k, ...rest } = s;
    if (rest.type === 'learn') { if (pic) rest.image = pic; else delete rest.image; }
    return rest;
  });
  // a giveaway the checker could not fix (the right answer is clearly the longest): leave it out if enough mcqs remain
  const mcqs = () => steps.filter((s: any) => s.type === 'mcq').length;
  for (const s of steps.slice()) if (s.type === 'mcq' && lengthTell(s) && mcqs() > 3) steps = steps.filter((x: any) => x !== s);
  // questions the learner has already had in recent lessons (keep at least two mcqs)
  if (seen.length) for (const s of steps.slice()) if (s.type === 'mcq' && mcqs() > 2 && seen.some((x) => sameCheck(checkOf(s), x))) steps = steps.filter((x: any) => x !== s);
  steps = dedupeChecks(steps);
  // "what did you just read?" checks move later, as spaced recall
  steps = spaceRecall(steps);
  // make sure a couple of genuine bank questions appear (before the exam step) — new to the learner, not a repeat
  // of a lesson question, and not a giveaway
  const have = steps.filter((s: any) => s.type === 'mcq' || s.type === 'truefalse').map(checkOf);
  const extra = bankQuiz.map(bankMcq).filter((s: any) => s && !lengthTell(s) && !have.some((h) => sameCheck(checkOf(s), h)) && !seen.some((h) => sameCheck(checkOf(s), h))).slice(0, 2);
  if (extra.length) {
    const at = steps.findIndex((s: any) => s.type === 'exam');
    steps.splice(at >= 0 ? at : Math.max(0, steps.length - 1), 0, ...extra);
  }
  steps = steps.slice(0, 22);
  const checks = steps.filter((s: any) => !['learn', 'recap'].includes(s.type)).length;
  if (steps.length < 6 || checks < 4) throw new Error('The lesson came back incomplete.');
  return {
    title: clean(L.title, 80) || ('Lesson: ' + (input.topic || input.unitName)),
    icon: ICONS.includes(String(L.icon)) ? String(L.icon) : null,
    topic: clean(L.topic, 90) || input.topic || null,
    summary: clean(L.summary, 200),
    minutes: Math.max(3, Math.min(15, Math.round(Number(L.minutes) || len.minutes))),
    steps, provider: r.provider, verified: checked.verified,
  };
}

// Second pass: an examiner checks each answer key and either confirms it, corrects it or removes the item.
async function verifySteps(steps: any[], unitName: string, qual: string): Promise<{ steps: any[]; verified: boolean }> {
  const items = steps.map((s, i) => ({ s, i })).filter(({ s }) => !s.bank && s.type !== 'recap' && s.type !== 'code' && !(s.type === 'exam' && s.source === 'exam')).map(({ s, i }) => {
    const base: any = { i, type: s.type };
    if (s.type === 'learn') Object.assign(base, { title: s.title, body: s.body, points: s.points, example: s.example, diagram: s.diagram });
    if (s.type === 'mcq') Object.assign(base, { q: s.q, choices: s.choices, answer: s.answer, length_giveaway: lengthTell(s) || undefined });
    if (s.type === 'truefalse') Object.assign(base, { statement: s.statement, answer: s.answer });
    if (s.type === 'fill') Object.assign(base, { text: s.text, blanks: s.blanks, options: s.options });
    if (s.type === 'match') Object.assign(base, { pairs: s.pairs });
    if (s.type === 'order') Object.assign(base, { prompt: s.prompt, items: s.items });
    if (s.type === 'exam') Object.assign(base, { q: s.q, marks: s.marks, points: s.points, model: s.model });
    return base;
  });
  if (!items.length) return { steps, verified: true };
  const r = await askJson(
    `You are a meticulous senior ${qual} examiner checking a revision lesson before students see it. You are strict: anything factually wrong, ambiguous, or with more than one defensible answer must be fixed or removed. Reply with JSON only.`,
    `Unit: ${unitName}
Check each item:
- learn: are all statements accurate for the specification? Fix wrong facts. If it has a "diagram", check every label, step order, connection and number (for "breakeven", that the card's figures match fixed / variable / price); return a corrected "diagram" of the same shape, or "diagram": null to remove one that is wrong or unhelpful.
- mcq: is "answer" (0-based index into "choices" exactly as given) the ONE correct choice? Could any other choice also be argued correct?
- mcq giveaways: could a student who has NOT studied this pick the answer — because it is the longest or most detailed choice, the only one that sounds like a textbook definition, repeats a word from the question, or the distractors are silly or off-topic? If so (and always when "length_giveaway" is true), verdict "fix" with rewritten "choices" (and "answer") where all four are the same kind of thing and about the same length, the correct one is NOT the longest, and the distractors are believable misconceptions that are still definitely wrong.
- truefalse: is the keyed true/false definitely right and unambiguous?
- fill: put each option into each gap — does ONLY the keyed word make the sentence correct? A distractor that also fits (a synonym, a broader or narrower correct term) makes the item invalid: replace that distractor. Every option must also read as grammatical English in the gap (same part of speech, singular/plural, tense; nothing like "an bus" or "a encryption") so grammar never gives the answer away: fix the "text" (e.g. "the ___" instead of "a ___") or the options.
- match: is every pair correct and is each definition unique to its term?
- order: is the order a recognised, correct sequence?
- exam: does EVERY mark-scheme point answer THIS exact question (same topic, same command word, same scenario)? Points written for a different question, or that a student answering this question could never write, are the most serious error: verdict "fix" with new "points" (and "model") that match the question exactly. Are the points correct, and is the model answer worth full marks? Never change the question "q" of an exam item — fix its points and model instead.
Items: ${JSON.stringify(items)}
Return {"items":[{"i":0,"verdict":"ok"|"fix"|"drop","reason":"short", ...corrected fields when verdict is "fix" (e.g. "answer", "choices", "blanks", "options", "pairs", "items", "statement", "text", "body", "points", "model")}]}`,
    45000, { preferStrong: true, temperature: 0, maxTokens: 5000 });
  const verdicts = Array.isArray(r.json?.items) ? r.json.items : [];
  if (!verdicts.length) return { steps, verified: false };
  const out = steps.slice();
  const drop = new Set<number>();
  for (const v of verdicts) {
    const i = Math.round(Number(v?.i));
    if (!(i >= 0 && i < out.length) || !out[i]) continue;
    const verdict = String(v.verdict || 'ok').toLowerCase();
    if (verdict === 'drop') { drop.add(i); continue; }
    if (verdict !== 'fix') continue;
    const s = out[i];
    const patch: any = {};
    ['answer', 'choices', 'blanks', 'options', 'pairs', 'items', 'statement', 'text', 'body', 'points', 'model', 'q', 'diagram'].forEach((f) => { if (v[f] !== undefined) patch[f] = v[f]; });
    // an exam question keeps its wording: a rewritten question with the old mark scheme is how they drift apart
    if (s.type === 'exam') delete patch.q;
    const fixed = sanitiseStep({ ...s, ...patch, type: s.type });
    if (fixed && s._k != null) fixed._k = s._k;
    if (fixed) out[i] = s.type === 'exam' ? { ...s, ...fixed } : fixed; else drop.add(i);
  }
  return { steps: out.filter((_, i) => !drop.has(i)), verified: true };
}

// No AI available: a practice lesson built only from the real question bank.
function bankLesson(unitName: string, topic: string | null, grounding: any) {
  const steps = (Array.isArray(grounding?.quiz) ? grounding.quiz : []).map(bankMcq).filter(Boolean).slice(0, 8);
  if (steps.length < 4) return null;
  return { title: 'Quick practice: ' + (topic || unitName), icon: 'target', topic, summary: 'Real questions from the RA10 bank.', minutes: Math.max(3, Math.round(steps.length * 0.6)), steps: [...steps, { type: 'recap', title: 'Nice work', points: ['Review any questions you got wrong in the unit guide.', 'Come back tomorrow for a full AI lesson.'] }], provider: 'bank' };
}

async function create(ctx: Ctx, body: any) {
  const mode = body.mode === 'daily' ? 'daily' : 'custom';
  const today = londonDate();
  if (mode === 'daily') {
    const { data: existing } = await ctx.admin.from('study_lessons').select('*').eq('user_id', ctx.userId).eq('kind', 'daily').eq('lesson_date', today).maybeSingle();
    if (existing) return { ok: true, lesson: existing, existing: true };
  }

  const unit = clean(body.unit, 120);
  const unitName = clean(body.unitName, 120) || unit;
  const qual = clean(body.qual, 80) || 'BTEC / A-Level';
  const topic = clean(body.topic, 100) || null;
  const request = clean(body.request, 300);
  // the daily lesson is always medium; made lessons use the learner's choice
  const difficulty = mode === 'daily' ? 'medium' : (DIFFICULTY[clean(body.difficulty, 10)] ? clean(body.difficulty, 10) : 'medium');
  if (!unit && !request) return { ok: false, error: 'Choose a unit or tell us what you want to learn.' };

  // take the lesson's AI uses first (server-side, serialised per account) so two tabs can't overspend
  const paid = await spendForLesson(ctx);
  if (paid.blocked) return { ok: false, code: 'usage_limit', usage: paid.blocked, error: limitMessage(paid.blocked) };
  if (paid.error || !paid.spend) return { ok: false, locked: true, error: paid.error || 'Study Hub is unavailable right now.' };
  const spend = paid.spend;
  const trial = spend.mode === 'trial';
  try {
    const prof = await profile(ctx).catch(() => null);
    const reason = clean(body.reason, 300) || (topic ? `You picked ${topic}.` : '');
    let L: any = null;
    if (hasProviders()) {
      const seen = await pastChecks(ctx, unit).catch(() => [] as Check[]);
      try { L = await writeLesson({ unitName, qual, topic, request, focusReason: reason, prof, grounding: body.grounding, length: clean(body.length, 12), focus: clean(body.focus, 12), difficulty, unit, coding: codingLang(unit, unitName, request, topic), seen }); }
      catch (e) { console.warn('study-hub write failed', e); }
    }
    if (!L) L = bankLesson(unitName, topic, body.grounding);
    if (!L) throw new Error('The lesson writer is busy right now. Please try again in a minute.');
    const row = {
      user_id: ctx.userId, kind: mode, trial, lesson_date: today, unit: unit || null, topic: L.topic || topic,
      title: L.title, emoji: L.icon || null, reason: reason || L.summary || null, minutes: L.minutes,
      content: { summary: L.summary, steps: L.steps, unitName, qual, icon: L.icon || null, verified: !!L.verified, length: clean(body.length, 12) || 'standard', focus: clean(body.focus, 12), difficulty }, provider: L.provider,
    };
    let { data: saved, error } = await ctx.admin.from('study_lessons').insert(row).select('*').single();
    if (error && mode === 'daily') {
      // someone else (another tab) created today's lesson first
      const { data: existing } = await ctx.admin.from('study_lessons').select('*').eq('user_id', ctx.userId).eq('kind', 'daily').eq('lesson_date', today).maybeSingle();
      if (existing) { await refundLesson(ctx, spend); return { ok: true, lesson: existing, existing: true }; }
    }
    if (error) throw new Error(error.message);
    if (trial) await ctx.admin.from('study_hub_trials').update({ lesson_id: saved.id }).eq('user_id', ctx.userId);
    return { ok: true, lesson: saved, usage: spend.mode === 'usage' ? spend.usage : null };
  } catch (e) {
    const usage = await refundLesson(ctx, spend);
    return { ok: false, error: e instanceof Error ? e.message : String(e), usage };
  }
}

/* ───────────────────────────── marking ───────────────────────────── */
function heuristicMark(answer: string, points: string[], marks: number) {
  const stop = new Set('the a an and or of to in is are be for on with that this it as by can will their they which from at more less its into than also'.split(' '));
  const words = (s: string) => norm(s).split(' ').filter((w) => w.length > 3 && !stop.has(w));
  const ans = new Set(words(answer));
  const got: number[] = [];
  points.forEach((p, i) => { const w = words(p); if (w.length && w.filter((x) => ans.has(x)).length / w.length >= 0.45) got.push(i); });
  return { score: Math.min(marks, got.length), got, feedback: got.length ? 'You covered some of the key points. Compare your answer with the model answer below.' : 'Have a look at the mark scheme points below and try to include them next time.' };
}

async function mark(ctx: Ctx, body: any) {
  const id = clean(body.lessonId, 60);
  const i = Math.round(Number(body.step));
  const answer = clean(body.answer, 4000);
  const { data: L } = await ctx.admin.from('study_lessons').select('id, user_id, content').eq('id', id).maybeSingle();
  if (!L || L.user_id !== ctx.userId) return { ok: false, error: 'Lesson not found.' };
  const s = L.content?.steps?.[i];
  if (!s || s.type !== 'exam') return { ok: false, error: 'Not an exam step.' };
  if (answer.split(/\s+/).filter(Boolean).length < 3) return { ok: true, score: 0, max: s.marks, got: [], feedback: 'Write a little more so it can be marked — aim for a sentence per mark.' };
  if (hasProviders()) {
    try {
      // the same point-by-point examiner the AI Examiner (ai-mark) uses for Study Hub questions
      const taught = (L.content?.steps || []).slice(0, i).filter((x: any) => x?.type === 'learn').map((x: any) => `${x.title ? x.title + ': ' : ''}${x.body || ''}`).join('\n').slice(0, 2500);
      const remark = body.remark && typeof body.remark === 'object' ? { previous: Number(body.remark.previous) || 0, dispute: clean(body.remark.dispute, 600) } : undefined;
      const q = { study_hub: true, study_hub_points: s.points, study_hub_model: s.model || '', study_hub_taught: taught, study_hub_remark: remark, question: s.q, marks: s.marks, command_verb: s.verb || '', scenario: s.context || '', topic: L.content?.topic || '', unit: L.content?.unitName || '', qualification: L.content?.qual || '', mark_scheme: s.real?.mark_scheme || {} };
      const r = await askJson(STUDY_HUB_SYSTEM, buildStudyHubPrompt(q, answer), 40000, { preferStrong: true, temperature: 0, maxTokens: 2000 });
      if (!r.json) throw new Error('no JSON');
      const m = studyHubPostProcess(r.json, q, answer);
      if (!(m.annotations || []).length) {
        try { const a = await askJson(ANNOTATE_SYSTEM, buildAnnotatePrompt(q, answer, m), 25000, { preferStrong: true, temperature: 0, maxTokens: 1200 }); m.annotations = cleanAnnotations(a.json?.annotations, answer); } catch (e) { /* highlights are a bonus */ }
        if (!(m.annotations || []).length) m.annotations = annotationsFromAwarded(r.json, answer);
      }
      const max = Number(m.max) || s.marks;
      return { ok: true, score: Math.max(0, Math.min(max, Math.round(Number(m.earned) || 0))), max, got: m.got || [], feedback: clean(m.examiner_comment || m.feedback, 500), strengths: m.strengths || [], improvements: m.improvements || [], annotations: m.annotations || [], ai: true };
    } catch (e) { console.warn('study-hub mark failed', e); }
  }
  const h = heuristicMark(answer, s.points, s.marks);
  return { ok: true, max: s.marks, ...h, ai: false };
}

/* ───────────────────────────── complete ───────────────────────────── */
async function complete(ctx: Ctx, body: any) {
  const id = clean(body.lessonId, 60);
  const { data: L } = await ctx.admin.from('study_lessons').select('id, user_id, status, content, xp, kind, title, assignment_id, item_id, created_at').eq('id', id).maybeSingle();
  if (!L || L.user_id !== ctx.userId) return { ok: false, error: 'Lesson not found.' };
  if (L.kind === 'template') return { ok: true, xp: 0, preview: true };
  const steps = L.content?.steps || [];
  const res = body.results && typeof body.results === 'object' ? body.results : {};
  let score = 0, max = 0;
  steps.forEach((s: any, i: number) => {
    if (s.type === 'learn' || s.type === 'recap') return;
    const m = s.type === 'exam' ? s.marks : 1;
    const r = res[i] || res[String(i)] || {};
    max += m;
    score += Math.max(0, Math.min(m, Math.round(Number(r.score) || 0)));
  });
  if (L.status === 'done') {
    return { ok: true, xp: 0, score, max, replay: true };
  }
  // A lesson rushed through faster than anyone could read it earns no XP (it still counts as done).
  const checkable = steps.filter((s: any) => s.type !== 'learn' && s.type !== 'recap').length;
  const minSeconds = Math.max(45, checkable * 6);
  const started = Date.parse(String(L.created_at || ''));
  const rushed = Number.isFinite(started) && (Date.now() - started) / 1000 < minSeconds;
  const xp = rushed ? 0 : Math.min(70, 18 + Math.round((max ? score / max : 0) * 36) + (Number(body.bestCombo) >= 5 ? 6 : 0));
  const { error } = await ctx.admin.from('study_lessons').update({
    status: 'done', score, max_score: max, xp, completed_at: new Date().toISOString(),
    progress: { i: steps.length, results: res },
  }).eq('id', id).neq('status', 'done');
  if (error) return { ok: false, error: error.message };
  // XP goes through the server-only award (xp-v3.sql: Study Hub cap 150 a day). Until that SQL is
  // applied, fall back to the old guarded increment_xp.
  let awarded = 0;
  if (xp > 0) {
    try {
      const { data: xa, error: xe } = await ctx.admin.rpc('xp_award_server', { p_user: ctx.userId, p_source: 'study_hub', p_amount: xp, p_ref: `lesson:${id}` });
      if (!xe && xa) awarded = (Number(xa.granted) || 0) + (Number(xa.bonus) || 0);
      else if (xe && /PGRST202|42883|Could not find/.test(String(xe.code || '') + ' ' + String(xe.message || ''))) {
        const { data: old, error: oe } = await ctx.user.rpc('increment_xp', { amount: xp });
        if (!oe) awarded = Number(old) || 0;
      }
    } catch (_) { /* XP is a bonus */ }
  }
  // a lesson set as homework counts as the student's submission for that assignment item
  if (L.assignment_id && L.item_id) {
    const pct = max ? Math.round((score / max) * 100) : 100;
    const wrong = steps.map((s: any, i: number) => ({ s, r: res[i] || res[String(i)] || {} })).filter((x: any) => !['learn', 'recap'].includes(x.s.type) && !x.r.ok)
      .map((x: any) => clean(x.s.q || x.s.statement || x.s.text || x.s.prompt || '', 140)).filter(Boolean).slice(0, 6);
    await ctx.admin.from('edu_submissions').upsert({
      assignment_id: L.assignment_id, user_id: ctx.userId, item_id: L.item_id, item_type: 'studyhub', question_ref: L.id,
      question_text: clean(L.title, 300), answer: 'done', score, max_score: max, done: true, updated_at: new Date().toISOString(),
      feedback: { summary: `Study Hub lesson: ${pct}% (${score}/${max})${Number(body.bestCombo) >= 3 ? ` · best streak ${Number(body.bestCombo)} in a row` : ''}`, lesson_id: L.id, missed: wrong },
    }, { onConflict: 'assignment_id,user_id,item_id' });
  }
  return { ok: true, xp: awarded, score, max, ...(rushed ? { note: 'Finished too quickly to earn XP. Take your time on the next one.' } : {}) };
}

/* ───────────────────────────── RA10 EDU: lessons set by teachers ─────────────────────────────
   draft            teacher writes a class lesson (kind 'template', owned by the teacher)
   save-template    teacher's edited steps (re-validated here)
   rewrite-step     AI rewrites one step (optionally following the teacher's instruction), then it is checked
   refine           AI changes the whole lesson following the teacher's instruction, then it is checked
   assigned         a student opens a Study Hub item from an assignment: their own copy of the class
                    lesson, or a lesson personalised to their learning
   complete (above) also records the score as the student's submission for that assignment item */
async function teachesClass(ctx: Ctx, classId: string) {
  if (!classId) return false;
  const { data, error } = await ctx.user.rpc('edu_teaches_class', { p_class: classId });
  return !error && data === true;
}
async function ownTemplate(ctx: Ctx, id: string) {
  const { data: L } = await ctx.admin.from('study_lessons').select('*').eq('id', clean(id, 60)).maybeSingle();
  if (!L || L.user_id !== ctx.userId || L.kind !== 'template') return null;
  if (L.class_id && !(await teachesClass(ctx, L.class_id))) return null;
  return L;
}
// a teacher's edited step list → valid steps (a real exam question keeps its official scheme only if unchanged)
function cleanSteps(steps: any[]): any[] {
  return (Array.isArray(steps) ? steps : []).slice(0, 24).map((raw: any) => {
    const s = sanitiseStep(raw, true);
    if (!s) return null;
    if (s.type === 'exam') {
      const real = raw?.real ? trimReal(raw.real) : null;
      if (real && norm(real.question) === norm(s.q)) return { ...s, source: 'exam', real };
      return { ...s, source: raw?.source === 'exam' && real ? 'exam' : 'practice' };
    }
    if (raw?.bank) s.bank = true;
    return s;
  }).filter(Boolean);
}

async function draft(ctx: Ctx, body: any) {
  const classId = clean(body.classId, 60);
  if (!(await teachesClass(ctx, classId))) return { ok: false, error: 'Only staff who can manage this class can write lessons for it.' };
  const { data: cls } = await ctx.admin.from('edu_classes').select('id, school_id, name').eq('id', classId).maybeSingle();
  const unit = clean(body.unit, 120), unitName = clean(body.unitName, 120) || unit, qual = clean(body.qual, 80) || 'BTEC / A-Level';
  const topic = clean(body.topic, 100) || null, request = clean(body.request, 300);
  if (!unit) return { ok: false, error: 'Choose a unit.' };
  if (!hasProviders()) return { ok: false, error: 'AI is not configured.' };
  let L: any;
  try {
    L = await writeLesson({ unitName, qual, topic, request, focusReason: `A lesson for the class ${cls?.name || ''}, set by their teacher.`, prof: null, grounding: body.grounding, length: clean(body.length, 12), focus: clean(body.focus, 12), unit, coding: codingLang(unit, unitName, request, topic) });
  } catch (e) { return { ok: false, error: 'The lesson writer is busy right now. Please try again in a minute. (' + (e instanceof Error ? e.message : String(e)) + ')' }; }
  const { data: saved, error } = await ctx.admin.from('study_lessons').insert({
    user_id: ctx.userId, kind: 'template', unit, topic: L.topic || topic, title: L.title, emoji: L.icon || null, minutes: L.minutes,
    reason: request || null, class_id: classId, school_id: cls?.school_id || null, provider: L.provider,
    content: { summary: L.summary, steps: L.steps, unitName, qual, icon: L.icon || null, verified: !!L.verified, length: clean(body.length, 12) || 'standard', focus: clean(body.focus, 12) },
  }).select('*').single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, lesson: saved };
}

async function saveTemplate(ctx: Ctx, body: any) {
  const L = await ownTemplate(ctx, body.lessonId);
  if (!L) return { ok: false, error: 'Lesson not found.' };
  const steps = cleanSteps(body.steps);
  if (steps.length < 2) return { ok: false, error: 'A lesson needs at least two valid steps. Check for empty questions or answers.' };
  const title = clean(body.title, 80) || L.title;
  const content = { ...(L.content || {}), steps, summary: clean(body.summary, 200) || L.content?.summary || '', edited_at: new Date().toISOString() };
  const minutes = Math.max(2, Math.min(20, Math.round(steps.length * 0.55)));
  const { data, error } = await ctx.admin.from('study_lessons').update({ title, content, minutes }).eq('id', L.id).select('*').single();
  if (error) return { ok: false, error: error.message };
  const dropped = (Array.isArray(body.steps) ? body.steps.length : 0) - steps.length;
  return { ok: true, lesson: data, dropped };
}

const STEP_SHAPES: Record<string, string> = {
  learn: '{"type":"learn","title":"","body":"","points":["",""],"example":""}',
  mcq: '{"type":"mcq","q":"","choices":["","","",""],"answer":0,"explain":""}',
  truefalse: '{"type":"truefalse","statement":"","answer":true,"explain":""}',
  fill: '{"type":"fill","text":"A ___ is ...","blanks":["word"],"options":["word","other","other"],"explain":""}',
  match: '{"type":"match","prompt":"","pairs":[["term","meaning"]]}',
  order: '{"type":"order","prompt":"","items":["first","second","third"],"explain":""}',
  exam: '{"type":"exam","q":"","context":"","marks":4,"verb":"Explain","points":["",""],"model":"","source":"practice"}',
  recap: '{"type":"recap","title":"Key takeaways","points":["",""]}',
};

async function rewriteStep(ctx: Ctx, body: any) {
  const L = await ownTemplate(ctx, body.lessonId);
  if (!L) return { ok: false, error: 'Lesson not found.' };
  const steps: any[] = Array.isArray(body.steps) && body.steps.length ? body.steps : (L.content?.steps || []);
  const i = Math.round(Number(body.index));
  const cur = steps[i];
  if (!cur) return { ok: false, error: 'Step not found.' };
  const type = STEP_SHAPES[String(body.type || '')] ? String(body.type) : cur.type;
  const qual = L.content?.qual || 'BTEC / A-Level', unitName = L.content?.unitName || L.unit;
  const neighbours = steps.filter((s: any) => s && s.type === 'learn').map((s: any) => ({ title: s.title, body: s.body, points: s.points }));
  const r = await askJson(`You are an expert ${qual} teacher writing one step of a bite-size revision lesson. Accuracy matters most: exactly one defensible correct answer, facts correct for the specification, British English. Reply with JSON only.`,
    `Unit: ${unitName}. Lesson: "${L.title}" on ${L.topic || 'this topic'}.
What the lesson teaches: ${JSON.stringify(neighbours).slice(0, 4000)}
Current step: ${JSON.stringify({ ...cur, real: undefined })}
Teacher's instruction: ${clean(body.instruction, 300) || 'Write a better version of this step.'}
Write ONE replacement step of type "${type}". Rules: mcq has 4 choices and one correct "answer" index; fill distractors must NOT also fit the gap; match definitions are unique; order items are in the correct order; exam has mark-scheme "points" and a full-mark "model".
Return {"step": ${STEP_SHAPES[type]}}`, 45000, { preferStrong: true, temperature: 0.3, maxTokens: 1800 });
  let step = sanitiseStep(r.json?.step);
  if (!step) return { ok: false, error: 'The AI could not write a valid step. Try again or edit it by hand.' };
  const checked = await verifySteps([step], unitName, qual).catch(() => ({ steps: [step], verified: false }));
  step = checked.steps[0];
  if (!step) return { ok: false, error: 'The rewritten step failed the answer check. Try again with a clearer instruction.' };
  return { ok: true, step, verified: checked.verified };
}

async function refine(ctx: Ctx, body: any) {
  const L = await ownTemplate(ctx, body.lessonId);
  if (!L) return { ok: false, error: 'Lesson not found.' };
  const instruction = clean(body.instruction, 400);
  if (!instruction) return { ok: false, error: 'Tell the AI what to change.' };
  const steps: any[] = cleanSteps(Array.isArray(body.steps) && body.steps.length ? body.steps : (L.content?.steps || []));
  const qual = L.content?.qual || 'BTEC / A-Level', unitName = L.content?.unitName || L.unit;
  const reals = steps.filter((s: any) => s.type === 'exam' && s.real);
  const r = await askJson(`You are an expert ${qual} teacher revising a bite-size, Duolingo-style revision lesson for a class. Keep everything accurate for the specification, with exactly one defensible correct answer per question. British English. Reply with JSON only.`,
    `Unit: ${unitName}. Lesson title: "${L.title}".
Current steps: ${JSON.stringify(steps.map((s: any) => ({ ...s, real: undefined })))}
Teacher's instruction: "${instruction}"
Apply the instruction and return the whole revised lesson. Keep step shapes exactly as given (types: learn, mcq, truefalse, fill, match, order, exam, code, recap). Keep any exam step with "source":"exam" word-for-word unless the teacher asks otherwise.
Return {"title":"","steps":[...]}`, 70000, { preferStrong: true, temperature: 0.25, maxTokens: 6000 });
  let out = (Array.isArray(r.json?.steps) ? r.json.steps : []).map((raw: any) => {
    const s = sanitiseStep(raw);
    if (s && s.type === 'exam') { const real = reals.find((x: any) => norm(x.q) === norm(s.q)); return real ? { ...s, source: 'exam', real: real.real, points: real.points } : { ...s, source: 'practice' }; }
    return s;
  }).filter(Boolean);
  if (out.length < 4) return { ok: false, error: 'The AI did not return a usable lesson. Try rewording the instruction.' };
  const checked = await verifySteps(out, unitName, qual).catch(() => ({ steps: out, verified: false }));
  out = checked.steps;
  return { ok: true, title: clean(r.json?.title, 80) || L.title, steps: out, verified: checked.verified };
}

async function assigned(ctx: Ctx, body: any) {
  const assignmentId = clean(body.assignmentId, 60), itemId = clean(body.itemId, 80);
  // the student must be able to see the assignment (row-level security decides)
  const { data: a } = await ctx.user.from('edu_assignments').select('id, class_id, school_id, title, items, status').eq('id', assignmentId).maybeSingle();
  if (!a) return { ok: false, error: 'That assignment could not be found.' };
  const it = (Array.isArray(a.items) ? a.items : []).find((x: any) => String(x.id) === itemId && x.type === 'studyhub');
  if (!it) return { ok: false, error: 'That Study Hub lesson is not part of the assignment.' };
  const { data: mine } = await ctx.admin.from('study_lessons').select('*').eq('user_id', ctx.userId).eq('assignment_id', assignmentId).eq('item_id', itemId).maybeSingle();
  if (mine) return { ok: true, lesson: mine, existing: true };
  const base = { user_id: ctx.userId, kind: 'assigned', assignment_id: assignmentId, item_id: itemId, class_id: a.class_id, school_id: a.school_id };
  let row: any;
  if (it.mode === 'class') {
    const { data: T } = await ctx.admin.from('study_lessons').select('*').eq('id', clean(it.lessonId, 60)).maybeSingle();
    if (!T || T.kind !== 'template' || String(T.class_id || '') !== String(a.class_id)) return { ok: false, error: 'Your teacher\'s lesson is no longer available.' };
    row = { ...base, unit: T.unit, topic: T.topic, title: T.title, emoji: T.emoji, minutes: T.minutes, provider: T.provider,
      reason: `Set by your teacher: ${a.title}`, content: { ...(T.content || {}), template_id: T.id } };
  } else {
    if (!hasProviders()) return { ok: false, error: 'AI is not configured.' };
    const unit = clean(it.unit, 120), unitName = clean(body.unitName, 120) || unit, qual = clean(body.qual, 80) || 'BTEC / A-Level';
    const prof = await profile(ctx).catch(() => null);
    // personalised: the teacher's topic if they chose one, otherwise this student's weakest topic in the unit
    const weak = (prof?.weak || []).find((t: any) => t.unit === unit);
    const topic = clean(it.topic, 100) || clean(body.topic, 100) || (weak ? weak.topic : null);
    const reason = weak && topic === weak.topic ? `Set by your teacher, built around ${weak.topic} — you've been scoring ${weak.pct}% on it.` : `Set by your teacher: ${a.title}. Built from your own progress.`;
    let L: any = null;
    try { L = await writeLesson({ unitName, qual, topic, request: clean(it.request, 300), focusReason: reason, prof, grounding: body.grounding, length: clean(it.length, 12), focus: clean(it.focus, 12), unit, coding: codingLang(unit, unitName, clean(it.request, 300), topic) }); }
    catch (e) { console.warn('assigned write failed', e); }
    if (!L) L = bankLesson(unitName, topic, body.grounding);
    if (!L) return { ok: false, error: 'The lesson writer is busy right now. Please try again in a minute.' };
    row = { ...base, unit, topic: L.topic || topic, title: L.title, emoji: L.icon || null, minutes: L.minutes, provider: L.provider, reason,
      content: { summary: L.summary, steps: L.steps, unitName, qual, icon: L.icon || null, verified: !!L.verified, personal: true } };
  }
  const { data: saved, error } = await ctx.admin.from('study_lessons').insert(row).select('*').single();
  if (error) {
    const { data: again } = await ctx.admin.from('study_lessons').select('*').eq('user_id', ctx.userId).eq('assignment_id', assignmentId).eq('item_id', itemId).maybeSingle();
    if (again) return { ok: true, lesson: again, existing: true };
    return { ok: false, error: error.message };
  }
  return { ok: true, lesson: saved };
}

/* ───────────────────────────── entry ───────────────────────────── */
serve(async (req) => {
  const headers = cors(req.headers.get('origin'));
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, headers, 405);
  if (!SUPABASE_URL || !SERVICE_KEY || !ANON_KEY) return json({ error: 'Server not configured' }, headers, 500);
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return json({ error: 'Please sign in to use Study Hub.' }, headers, 401);
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  const { data: u, error: uErr } = await admin.auth.getUser(token);
  if (uErr || !u?.user?.id) return json({ error: 'Please sign in again.' }, headers, 401);
  const user = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false }, global: { headers: { Authorization: `Bearer ${token}` } } });
  const ctx: Ctx = { admin, user, userId: u.user.id, email: String(u.user.email || '').toLowerCase(), name: '' };

  let body: any = {};
  try { body = await req.json(); } catch { body = {}; }
  const action = String(body?.action || '').trim().toLowerCase();
  try {
    if (action === 'plan') { const [p, a] = await Promise.all([profile(ctx), access(ctx)]); return json({ ok: true, ...p, access: a }, headers); }
    if (action === 'create') return json(await create(ctx, body), headers);
    if (action === 'mark') return json(await mark(ctx, body), headers);
    if (action === 'complete') return json(await complete(ctx, body), headers);
    if (action === 'draft') return json(await draft(ctx, body), headers);
    if (action === 'save-template') return json(await saveTemplate(ctx, body), headers);
    if (action === 'rewrite-step') return json(await rewriteStep(ctx, body), headers);
    if (action === 'refine') return json(await refine(ctx, body), headers);
    if (action === 'assigned') return json(await assigned(ctx, body), headers);
    return json({ error: 'Unknown action.' }, headers, 400);
  } catch (e) {
    console.error('study-hub', action, e);
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, headers, 500);
  }
});
