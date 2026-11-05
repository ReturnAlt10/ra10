import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { askJson, hasProviders } from '../_shared/ai.ts';

// ────────────────────────────────────────────────────────────────────────────
// RA10 Study Hub — AI-curated bite-size lessons (Premium; one free trial lesson).
//   plan      read the learner's recent activity → strengths, gaps and today's focus
//   create    write a lesson (daily or learner-chosen topic) grounded in the unit's
//             real question bank, store it, return it
//   mark      AI-mark the written exam-question step of a lesson
//   complete  finish a lesson once: score + XP (XP goes through the increment_xp guard)
// Access is decided server-side by public.study_hub_premium() + study_hub_trials.
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
const STEP_TYPES = ['learn', 'mcq', 'truefalse', 'fill', 'match', 'order', 'exam', 'recap'];

function sanitiseStep(s: any): any | null {
  if (!s || typeof s !== 'object') return null;
  const t = String(s.type || '').toLowerCase();
  if (!STEP_TYPES.includes(t)) return null;
  const str = (x: unknown, n = 600) => clean(x, n);
  if (t === 'learn') {
    const body = str(s.body, 900); if (!body) return null;
    return { type: t, title: str(s.title, 90), body, points: (Array.isArray(s.points) ? s.points : []).map((p: unknown) => str(p, 200)).filter(Boolean).slice(0, 4), example: str(s.example, 400) || undefined, emoji: str(s.emoji, 4) || undefined };
  }
  if (t === 'mcq') {
    const choices = (Array.isArray(s.choices) ? s.choices : []).map((c: unknown) => str(c, 200)).filter(Boolean);
    const a = Number(s.answer);
    if (!str(s.q) || choices.length < 2 || choices.length > 5 || !(a >= 0 && a < choices.length)) return null;
    if (new Set(choices.map(norm)).size !== choices.length) return null;
    // re-order so the right answer isn't always in the same place
    const order = shuffle(choices.map((_: string, i: number) => i));
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
    const options = Array.from(new Set([...blanks, ...(Array.isArray(s.options) ? s.options : []).map((o: unknown) => str(o, 40)).filter(Boolean)])).slice(0, 7);
    return { type: t, text: text.replace(/_{2,}/g, '___'), blanks, options: shuffle(options), explain: str(s.explain, 400) };
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

async function writeLesson(input: { unitName: string; qual: string; topic: string | null; request: string; focusReason: string; prof: any; grounding: any }) {
  const g = input.grounding || {};
  const bankQuiz = (Array.isArray(g.quiz) ? g.quiz : []).slice(0, 8);
  const bankExam = (Array.isArray(g.questions) ? g.questions : []).slice(0, 3);
  const specTopics = (Array.isArray(g.topics) ? g.topics : []).slice(0, 60).map((t: unknown) => clean(t, 90));
  const sys = `You are an outstanding UK teacher and learning designer. You write bite-size, game-like revision lessons (like Duolingo) for ${input.qual} students. Everything must be accurate to the ${input.qual} specification, in British English, friendly and encouraging but never childish. Reply with JSON only.`;
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
Real multiple-choice questions from the RA10 bank on this area (you may reuse/adapt them): ${JSON.stringify(bankQuiz)}
Real exam questions on this area (if one fits, use it word-for-word as the exam step with "source":"exam"): ${JSON.stringify(bankExam)}

Write a 6–9 minute lesson of 12–16 steps that TEACHES the topic from scratch and then checks understanding. Alternate short "learn" cards with practice. Include: at least 4 learn cards, 3 mcq, 1 truefalse, 1 fill, 1 match, 1 order (only if the topic has a natural sequence or ranking; otherwise another mcq), exactly 1 exam step near the end, and finish with 1 recap.
Rules: learn bodies are 2–4 short sentences (max 70 words) with 2–3 bullet points and, where useful, a concrete business/IT/sport example; questions test what was just taught; mcq has 4 plausible choices with ONE correct answer (answer = index); fill uses "___" for each blank (1–2 blanks) and options includes the right words plus 2–3 distractors; match has 4 pairs of [term, short meaning]; order items are listed in the CORRECT order; exam is a real-style exam question with marks 2–6, mark-scheme points (one per mark, as an examiner would write them) and a model answer; every check has a one-sentence "explain" that teaches.
Return JSON exactly like:
{"title":"short catchy lesson title","emoji":"one emoji","topic":"the specific topic","summary":"one sentence: what you'll be able to do","minutes":7,
 "steps":[
  {"type":"learn","title":"","body":"","points":["",""],"example":""},
  {"type":"mcq","q":"","choices":["","","",""],"answer":0,"explain":""},
  {"type":"truefalse","statement":"","answer":true,"explain":""},
  {"type":"fill","text":"A ___ is ...","blanks":["word"],"options":["word","other","other"],"explain":""},
  {"type":"match","prompt":"Match each term to its meaning","pairs":[["term","meaning"]]},
  {"type":"order","prompt":"","items":["first","second","third","fourth"],"explain":""},
  {"type":"exam","q":"","context":"optional short scenario","marks":4,"verb":"Explain","points":["",""],"model":"","source":"practice"},
  {"type":"recap","title":"Key takeaways","points":["",""]}
 ]}`;
  const r = await askJson(sys, user, 75000);
  const L = r.json || {};
  let steps = (Array.isArray(L.steps) ? L.steps : []).map(sanitiseStep).filter(Boolean);
  // make sure a couple of genuine bank questions appear (before the exam step)
  const have = new Set(steps.filter((s: any) => s.type === 'mcq').map((s: any) => norm(s.q)));
  const extra = bankQuiz.map(bankMcq).filter((s: any) => s && !have.has(norm(s.q))).slice(0, 2);
  if (extra.length) {
    const at = steps.findIndex((s: any) => s.type === 'exam');
    steps.splice(at >= 0 ? at : Math.max(0, steps.length - 1), 0, ...extra);
  }
  steps = steps.slice(0, 18);
  const checks = steps.filter((s: any) => !['learn', 'recap'].includes(s.type)).length;
  if (steps.length < 6 || checks < 4) throw new Error('The lesson came back incomplete.');
  return {
    title: clean(L.title, 80) || ('Lesson: ' + (input.topic || input.unitName)),
    emoji: clean(L.emoji, 4) || '✨',
    topic: clean(L.topic, 90) || input.topic || null,
    summary: clean(L.summary, 200),
    minutes: Math.max(3, Math.min(15, Math.round(Number(L.minutes) || Math.round(steps.length * 0.55)))),
    steps, provider: r.provider,
  };
}

// No AI available: a practice lesson built only from the real question bank.
function bankLesson(unitName: string, topic: string | null, grounding: any) {
  const steps = (Array.isArray(grounding?.quiz) ? grounding.quiz : []).map(bankMcq).filter(Boolean).slice(0, 8);
  if (steps.length < 4) return null;
  return { title: 'Quick practice: ' + (topic || unitName), emoji: '🎯', topic, summary: 'Real questions from the RA10 bank.', minutes: Math.max(3, Math.round(steps.length * 0.6)), steps: [...steps, { type: 'recap', title: 'Nice work', points: ['Review any questions you got wrong in the unit guide.', 'Come back tomorrow for a full AI lesson.'] }], provider: 'bank' };
}

async function create(ctx: Ctx, body: any) {
  const acc = await access(ctx);
  const mode = body.mode === 'daily' ? 'daily' : 'custom';
  const today = londonDate();
  if (mode === 'daily') {
    const { data: existing } = await ctx.admin.from('study_lessons').select('*').eq('user_id', ctx.userId).eq('kind', 'daily').eq('lesson_date', today).maybeSingle();
    if (existing) return { ok: true, lesson: existing, existing: true };
  }
  if (!acc.premium && acc.trialUsed) return { ok: false, locked: true, error: 'Study Hub is a Premium feature. You have used your free lesson.' };

  const unit = clean(body.unit, 120);
  const unitName = clean(body.unitName, 120) || unit;
  const qual = clean(body.qual, 80) || 'BTEC / A-Level';
  const topic = clean(body.topic, 100) || null;
  const request = clean(body.request, 300);
  if (!unit && !request) return { ok: false, error: 'Choose a unit or tell us what you want to learn.' };

  // claim the free trial first so two tabs can't both use it
  let trial = false;
  if (!acc.premium) {
    const { error } = await ctx.admin.from('study_hub_trials').insert({ user_id: ctx.userId });
    if (error) return { ok: false, locked: true, error: 'You have already used your free Study Hub lesson.' };
    trial = true;
  }
  try {
    const prof = await profile(ctx).catch(() => null);
    const reason = clean(body.reason, 300) || (topic ? `You picked ${topic}.` : '');
    let L: any = null;
    if (hasProviders()) {
      try { L = await writeLesson({ unitName, qual, topic, request, focusReason: reason, prof, grounding: body.grounding }); }
      catch (e) { console.warn('study-hub write failed', e); }
    }
    if (!L) L = bankLesson(unitName, topic, body.grounding);
    if (!L) throw new Error('The lesson writer is busy right now. Please try again in a minute.');
    const row = {
      user_id: ctx.userId, kind: mode, trial, lesson_date: today, unit: unit || null, topic: L.topic || topic,
      title: L.title, emoji: L.emoji, reason: reason || L.summary || null, minutes: L.minutes,
      content: { summary: L.summary, steps: L.steps, unitName, qual }, provider: L.provider,
    };
    let { data: saved, error } = await ctx.admin.from('study_lessons').insert(row).select('*').single();
    if (error && mode === 'daily') {
      // someone else (another tab) created today's lesson first
      const { data: existing } = await ctx.admin.from('study_lessons').select('*').eq('user_id', ctx.userId).eq('kind', 'daily').eq('lesson_date', today).maybeSingle();
      if (existing) { if (trial) await ctx.admin.from('study_hub_trials').delete().eq('user_id', ctx.userId); return { ok: true, lesson: existing, existing: true }; }
    }
    if (error) throw new Error(error.message);
    if (trial) await ctx.admin.from('study_hub_trials').update({ lesson_id: saved.id }).eq('user_id', ctx.userId);
    return { ok: true, lesson: saved };
  } catch (e) {
    if (trial) await ctx.admin.from('study_hub_trials').delete().eq('user_id', ctx.userId);
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
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
      const r = await askJson('You are a fair, encouraging UK exam marker. Mark strictly against the mark scheme points. Reply with JSON only.',
        `Question (${s.marks} marks): ${s.q}
${s.context ? 'Context: ' + s.context : ''}
Mark scheme points (one mark each unless stated): ${JSON.stringify(s.points)}
Student answer: """${answer}"""
Return JSON: {"score":0,"got":[indices of mark scheme points the answer earns],"feedback":"2 sentences: what was good, the single most useful improvement","tip":"one short exam technique tip"}`, 30000);
      const sc = Math.max(0, Math.min(s.marks, Math.round(Number(r.json?.score) || 0)));
      const got = (Array.isArray(r.json?.got) ? r.json.got : []).map(Number).filter((n: number) => n >= 0 && n < s.points.length);
      return { ok: true, score: sc, max: s.marks, got, feedback: clean(r.json?.feedback, 500), tip: clean(r.json?.tip, 200), ai: true };
    } catch (e) { console.warn('study-hub mark failed', e); }
  }
  const h = heuristicMark(answer, s.points, s.marks);
  return { ok: true, max: s.marks, ...h, ai: false };
}

/* ───────────────────────────── complete ───────────────────────────── */
async function complete(ctx: Ctx, body: any) {
  const id = clean(body.lessonId, 60);
  const { data: L } = await ctx.admin.from('study_lessons').select('id, user_id, status, content, xp').eq('id', id).maybeSingle();
  if (!L || L.user_id !== ctx.userId) return { ok: false, error: 'Lesson not found.' };
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
  const xp = Math.min(60, 15 + Math.round((max ? score / max : 0) * 30) + (Number(body.bestCombo) >= 5 ? 5 : 0));
  const { error } = await ctx.admin.from('study_lessons').update({
    status: 'done', score, max_score: max, xp, completed_at: new Date().toISOString(),
    progress: { i: steps.length, results: res },
  }).eq('id', id).neq('status', 'done');
  if (error) return { ok: false, error: error.message };
  let awarded = 0;
  try { const { error: xe } = await ctx.user.rpc('increment_xp', { amount: xp }); if (!xe) awarded = xp; } catch (_) { /* XP is a bonus */ }
  return { ok: true, xp: awarded || xp, score, max };
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
    return json({ error: 'Unknown action.' }, headers, 400);
  } catch (e) {
    console.error('study-hub', action, e);
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, headers, 500);
  }
});
