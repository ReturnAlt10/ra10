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

function sanitiseStep(s: any, keepOrder = false): any | null {
  if (!s || typeof s !== 'object') return null;
  const t = String(s.type || '').toLowerCase();
  if (!STEP_TYPES.includes(t)) return null;
  const str = (x: unknown, n = 600) => clean(x, n);
  if (t === 'learn') {
    const body = str(s.body, 900); if (!body) return null;
    return { type: t, title: str(s.title, 90), body, points: (Array.isArray(s.points) ? s.points : []).map((p: unknown) => str(p, 200)).filter(Boolean).slice(0, 4), example: str(s.example, 400) || undefined };
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
    const options = Array.from(new Set([...blanks, ...(Array.isArray(s.options) ? s.options : []).map((o: unknown) => str(o, 40)).filter(Boolean)])).slice(0, 7);
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
  return [];
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

const CODE_PROMPT: Record<string, string> = {
  python: `This is a PROGRAMMING lesson in Python 3 (the language in the specification). Include exactly 2 "code" steps where the learner writes a short program (5–15 lines), placed after the learn cards that teach what they need. Use only the standard library. Programs read input with input() and write with print(). Each code step has 2–3 tests: each test gives the "stdin" lines to feed input() (or [] if none) and, for function tasks, an optional "check" of Python assert statements run after the program (eg "assert total([1,2]) == 3"). Do NOT write expected outputs — they are produced by running your "solution", which must be correct, complete and pass every check.`,
  javascript: `This is a PROGRAMMING lesson in JavaScript for web development. Include exactly 2 "code" steps where the learner writes a short function (5–15 lines). Each test has a "check" of JavaScript statements using assert(condition, message), eg "assert(add(2, 3) === 5, 'add(2,3) should be 5')". Do not use the DOM or network. Your "solution" must pass every check.`,
  sql: `This is a DATABASE lesson in SQL (SQLite dialect). Include exactly 2 "code" steps where the learner writes one SQL query. Each code step has "setup" (CREATE TABLE and INSERT statements for a small table of 5–8 realistic rows), a "starter" (eg "SELECT"), and a correct "solution" query. The learner's result is compared with the result of your solution, so the solution must be exactly right; include ORDER BY when the order matters.`,
};

async function writeLesson(input: { unitName: string; qual: string; topic: string | null; request: string; focusReason: string; prof: any; grounding: any; length?: string; focus?: string; coding?: string | null }) {
  const g = input.grounding || {};
  const bankQuiz = (Array.isArray(g.quiz) ? g.quiz : []).slice(0, 8);
  const realExam = (Array.isArray(g.exam) ? g.exam : []).map(trimReal).filter((q: any) => q && clean(q.question)).slice(0, 3);
  const bankExam = realExam.length
    ? realExam.map((q: any) => ({ ref: String(q.id), q: clean(q.question, 700), marks: q.marks, verb: q.command_verb || '', context: clean(q.scenario || q.context || '', 500), mark_scheme: schemePoints(q.mark_scheme) }))
    : (Array.isArray(g.questions) ? g.questions : []).slice(0, 3);
  const specTopics = (Array.isArray(g.topics) ? g.topics : []).slice(0, 60).map((t: unknown) => clean(t, 90));
  const len = LENGTHS[String(input.length || '')] || LENGTHS.standard;
  const focus = FOCUS[String(input.focus || '')] || '';
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
If one of these real exam questions fits the topic, the exam step MUST be that question word-for-word with "source":"exam" and "ref" set to its ref, using its mark scheme for "points".

Write a ${len.minutes}-minute lesson of ${len.steps} steps that TEACHES the topic and then checks understanding. Alternate short "learn" cards with practice. Use at least ${len.learn} learn cards, at least 3 mcq, 1 truefalse, 1 fill, 1 match, 1 order (only if the topic has a genuine fixed sequence — otherwise another mcq), exactly 1 exam step near the end, and finish with 1 recap.
${focus}
${input.coding ? CODE_PROMPT[input.coding] + '\n' : ''}Answer-key rules (these are checked — be precise):
- mcq: 4 choices, exactly ONE correct; distractors are plausible but definitely wrong (no "all of the above", no two choices that could both be argued). "answer" is the 0-based index of the correct choice.
- truefalse: a single clear claim that is unambiguously true or false per the specification — no trick wording.
- fill: a sentence from the learn cards with 1 (max 2) "___" gaps where the missing word is a specific KEY TERM; "blanks" are the exact words; "options" contain the blanks plus 2–3 distractors that DO NOT make the sentence true (never synonyms or near-synonyms of the answer).
- match: 4 pairs of [term, short definition]; each definition fits only its own term.
- order: items listed in the CORRECT order of a recognised sequence (process stages, steps of a model), not a matter of opinion.
- exam: marks 2–6, "points" are mark-scheme points as an examiner would write them, "model" is a full-mark answer.
- learn cards: 2–4 short sentences (max 70 words), 2–3 bullet points, and a concrete example where useful. Every check must be answerable from the learn cards.
Every check has a one-sentence "explain" that teaches.
Pick "icon" for the lesson from: ${ICONS.join(', ')}.
Return JSON exactly like:
{"title":"short catchy lesson title","icon":"shield","topic":"the specific topic","summary":"one sentence: what you'll be able to do","minutes":${len.minutes},
 "steps":[
  {"type":"learn","title":"","body":"","points":["",""],"example":""},
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
    const s = sanitiseStep(raw);
    if (!s) return;
    if (s.type === 'exam') {
      const ref = clean(raw?.ref, 80);
      const real = realExam.find((q: any) => ref && String(q.id) === ref) || realExam.find((q: any) => norm(q.question).slice(0, 80) === norm(s.q).slice(0, 80));
      if (real) {
        const pts = schemePoints(real.mark_scheme);
        steps.push({ ...s, q: clean(real.question, 900), marks: Math.max(1, Math.min(30, Math.round(Number(real.marks) || s.marks))), verb: clean(real.command_verb, 20) || s.verb, context: clean(real.scenario || real.context || s.context || '', 1500) || undefined, points: pts.length ? pts : s.points, source: 'exam', real });
        return;
      }
      s.source = 'practice';
    }
    steps.push(s);
  });
  // check every answer key with a second, independent pass
  const checked = await verifySteps(steps, input.unitName, input.qual).catch((e) => { console.warn('study-hub verify failed', e); return { steps, verified: false }; });
  steps = checked.steps;
  // make sure a couple of genuine bank questions appear (before the exam step)
  const have = new Set(steps.filter((s: any) => s.type === 'mcq').map((s: any) => norm(s.q)));
  const extra = bankQuiz.map(bankMcq).filter((s: any) => s && !have.has(norm(s.q))).slice(0, 2);
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
    if (s.type === 'learn') Object.assign(base, { title: s.title, body: s.body, points: s.points, example: s.example });
    if (s.type === 'mcq') Object.assign(base, { q: s.q, choices: s.choices, answer: s.answer });
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
- learn: are all statements accurate for the specification? Fix wrong facts.
- mcq: is "answer" (0-based index into "choices" exactly as given) the ONE correct choice? Could any other choice also be argued correct?
- truefalse: is the keyed true/false definitely right and unambiguous?
- fill: put each option into each gap — does ONLY the keyed word make the sentence correct? A distractor that also fits (a synonym, a broader or narrower correct term) makes the item invalid: replace that distractor.
- match: is every pair correct and is each definition unique to its term?
- order: is the order a recognised, correct sequence?
- exam: are the mark-scheme points correct and is the model answer worth full marks?
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
    ['answer', 'choices', 'blanks', 'options', 'pairs', 'items', 'statement', 'text', 'body', 'points', 'model', 'q'].forEach((f) => { if (v[f] !== undefined) patch[f] = v[f]; });
    const fixed = sanitiseStep({ ...s, ...patch, type: s.type });
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
      try { L = await writeLesson({ unitName, qual, topic, request, focusReason: reason, prof, grounding: body.grounding, length: clean(body.length, 12), focus: clean(body.focus, 12), coding: codingLang(unit, unitName, request, topic) }); }
      catch (e) { console.warn('study-hub write failed', e); }
    }
    if (!L) L = bankLesson(unitName, topic, body.grounding);
    if (!L) throw new Error('The lesson writer is busy right now. Please try again in a minute.');
    const row = {
      user_id: ctx.userId, kind: mode, trial, lesson_date: today, unit: unit || null, topic: L.topic || topic,
      title: L.title, emoji: L.icon || null, reason: reason || L.summary || null, minutes: L.minutes,
      content: { summary: L.summary, steps: L.steps, unitName, qual, icon: L.icon || null, verified: !!L.verified, length: clean(body.length, 12) || 'standard', focus: clean(body.focus, 12) }, provider: L.provider,
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
  const { data: L } = await ctx.admin.from('study_lessons').select('id, user_id, status, content, xp, kind, title, assignment_id, item_id').eq('id', id).maybeSingle();
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
  const xp = Math.min(60, 15 + Math.round((max ? score / max : 0) * 30) + (Number(body.bestCombo) >= 5 ? 5 : 0));
  const { error } = await ctx.admin.from('study_lessons').update({
    status: 'done', score, max_score: max, xp, completed_at: new Date().toISOString(),
    progress: { i: steps.length, results: res },
  }).eq('id', id).neq('status', 'done');
  if (error) return { ok: false, error: error.message };
  let awarded = 0;
  try { const { error: xe } = await ctx.user.rpc('increment_xp', { amount: xp }); if (!xe) awarded = xp; } catch (_) { /* XP is a bonus */ }
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
  return { ok: true, xp: awarded || xp, score, max };
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
    L = await writeLesson({ unitName, qual, topic, request, focusReason: `A lesson for the class ${cls?.name || ''}, set by their teacher.`, prof: null, grounding: body.grounding, length: clean(body.length, 12), focus: clean(body.focus, 12), coding: codingLang(unit, unitName, request, topic) });
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
    try { L = await writeLesson({ unitName, qual, topic, request: clean(it.request, 300), focusReason: reason, prof, grounding: body.grounding, length: clean(it.length, 12), focus: clean(it.focus, 12), coding: codingLang(unit, unitName, clean(it.request, 300), topic) }); }
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
