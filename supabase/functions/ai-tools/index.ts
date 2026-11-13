import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { askJson, hasProviders } from '../_shared/ai.ts';
import { askVisionJson, IMAGE_RE, MAX_IMAGE } from '../_shared/vision.ts';
import { requireTermsAccepted } from '../_shared/legal.ts';

// ────────────────────────────────────────────────────────────────────────────
// RA10 AI study tools (one function, one action per tool). Access rules live in ai-tools.sql:
//   Premium tools (free tries first): coach · blurt · prerelease · bughunt
//   Free tools: ajim · scan-cards · drill
// Every AI call takes one "ai_tools" use (ai-usage.sql) and gives it back if the call fails.
//
//   status                      what the learner can use
//   coach / coach-check         "Fix the weak link": find the weakest sentence, then check the rewrite
//   ajim                        check an evaluation conclusion for Answer / Justify / It depends / Most important
//   blurt / blurt-mark          map a brain-dump onto the spec, then mark the 2-question drill
//   pack / pack-notes / pack-partb / pack-mark / pack-list    BTEC Part A / Part B simulator
//   bug / bug-mark              "Spot the bug" challenges (Python / SQL checked in the browser, pseudocode marked here)
//   scan-cards                  photo of handwritten flashcards → cards
//   drill                       3-question micro-drill on a weak topic (daily "spec-gap" task)
// ────────────────────────────────────────────────────────────────────────────

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const ALLOWED = new Set(['https://ra10.co.uk', 'https://www.ra10.co.uk', 'http://localhost:5500', 'http://127.0.0.1:5500']);
const cors = (o: string | null) => ({
  'Access-Control-Allow-Origin': o && ALLOWED.has(o) ? o : 'https://ra10.co.uk',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Content-Type': 'application/json', 'Vary': 'Origin',
});
const json = (b: unknown, h: Record<string, string>, s = 200) => new Response(JSON.stringify(b), { status: s, headers: h });
const clean = (s: unknown, max = 200) => String(s ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, ' ').replace(/[ \t]+/g, ' ').trim().slice(0, max);
const cleanBlock = (s: unknown, max = 4000) => String(s ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, ' ').replace(/\r\n/g, '\n').trim().slice(0, max);
const arr = (x: unknown) => (Array.isArray(x) ? x : []);
const num = (x: unknown, lo: number, hi: number, d = lo) => { const n = Math.round(Number(x)); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : d; };
const shuffle = <T,>(a: T[]) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const norm = (s: unknown) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

interface Ctx { admin: any; userId: string; headers: Record<string, string>; usageId: number | null; trial: string | null }
class Stop extends Error { constructor(public body: any) { super('stop'); } }

/* ───────────── access: usage limit + Premium / free tries ───────────── */
async function useAI(ctx: Ctx) {
  const { data, error } = await ctx.admin.rpc('ai_usage_consume', { p_user: ctx.userId, p_feature: 'ai_tools' });
  if (error) { console.warn('ai-tools: usage check unavailable, allowing', error.message); return; }
  if (data && data.allowed === false) throw new Stop({ ok: false, code: 'usage_limit', usage: data, error: data.blocked_by === 'day' ? 'You\'ve reached today\'s AI tools limit.' : 'You\'ve reached this hour\'s AI tools limit.' });
  ctx.usageId = data && data.event_id ? Number(data.event_id) : null;
}
async function takeTry(ctx: Ctx, feature: string) {
  const { data, error } = await ctx.admin.rpc('ai_tool_take', { p_user: ctx.userId, p_feature: feature });
  if (error) throw new Stop({ ok: false, error: 'AI tools are being switched on. Please try again soon.' });
  if (!data?.allowed) throw new Stop({ ok: false, code: 'premium', feature, error: 'You\'ve used your free tries. This tool is part of RA10 Premium.' });
  ctx.trial = data.premium ? null : feature;
  return data;
}
async function refund(ctx: Ctx) {
  if (ctx.usageId) { await ctx.admin.rpc('ai_usage_refund', { p_user: ctx.userId, p_event_id: ctx.usageId }).catch(() => {}); ctx.usageId = null; }
  if (ctx.trial) { await ctx.admin.rpc('ai_tool_refund', { p_user: ctx.userId, p_feature: ctx.trial }).catch(() => {}); ctx.trial = null; }
}
async function terms(ctx: Ctx) {
  const denied = await requireTermsAccepted(ctx.admin, ctx.userId, ctx.headers);
  if (denied) throw new Stop({ ok: false, code: 'terms_required', error: 'Please accept the RA10 Terms of Service to use AI tools.' });
}

// one free regeneration ticket (Bug Hunt: when a generated challenge fails the in-browser check)
async function hmac(text: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(SERVICE_KEY), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(sig)).slice(0, 16).map((b) => b.toString(16).padStart(2, '0')).join('');
}
async function makeTicket(userId: string) { const t = Date.now(); return `${t}.${await hmac(userId + ':' + t)}`; }
async function ticketOk(userId: string, ticket: unknown) {
  const [t, sig] = String(ticket || '').split('.');
  return !!t && Date.now() - Number(t) < 10 * 60000 && sig === await hmac(userId + ':' + t);
}

/* ───────────── 1. Paragraph coach ───────────── */
function sentences(text: string): string[] {
  const t = cleanBlock(text, 6000).replace(/\s+/g, ' ');
  const out = t.match(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g) || [];
  return out.map((s) => s.trim()).filter((s) => s.length > 2).slice(0, 60);
}
function questionBits(b: any) {
  return {
    question: clean(b.question, 1500), marks: num(b.marks, 1, 40, 9), verb: clean(b.verb, 30),
    context: clean(b.context, 2500), scheme: arr(b.points).map((p: unknown) => clean(p, 260)).filter(Boolean).slice(0, 14),
    qual: clean(b.qual, 80) || 'BTEC / A-Level',
  };
}
async function coach(ctx: Ctx, b: any) {
  const q = questionBits(b);
  const ss = sentences(b.answer);
  if (!q.question || ss.length < 2) return { ok: false, error: 'Write at least two sentences first.' };
  await terms(ctx); await takeTry(ctx, 'coach'); await useAI(ctx);
  const r = await askJson(
    `You are a senior ${q.qual} examiner coaching a student to improve ONE sentence of their answer. You never rewrite it for them. British English. Reply with JSON only.`,
    `Question (${q.marks} marks${q.verb ? ', command word: ' + q.verb : ''}): ${q.question}
${q.context ? 'Case study / context: ' + q.context + '\n' : ''}${q.scheme.length ? 'Mark scheme points: ' + JSON.stringify(q.scheme) + '\n' : ''}Student answer, numbered by sentence: ${JSON.stringify(ss.map((s, i) => ({ i, s })))}
Find the single sentence whose improvement would gain the most marks. Typical weak links:
- "chain": a point is stated but the knock-on effect is not explained (no "this means that… which leads to…")
- "application": generic, not tied to the case study / organisation in the question
- "judgement": a conclusion or evaluation with no justification, or no "it depends on"
- "knowledge": a key term is wrong or vague
Return {"weak":{"i":0,"kind":"chain|application|judgement|knowledge","problem":"max 25 words, about THIS sentence","nudge":"one question (max 20 words) that makes them think of the missing step — do not give the answer"},"level_now":"e.g. Level 2 or a mark band","to_reach":"max 25 words: what the next level needs","strengths":["max 2 short points"]}`,
    40000, { preferStrong: true, temperature: 0.2, maxTokens: 900 });
  const w = r.json?.weak || {};
  const i = num(w.i, 0, ss.length - 1, 0);
  return {
    ok: true, sentences: ss,
    weak: { i, kind: ['chain', 'application', 'judgement', 'knowledge'].includes(String(w.kind)) ? String(w.kind) : 'chain', problem: clean(w.problem, 220), nudge: clean(w.nudge, 200) },
    level_now: clean(r.json?.level_now, 40), to_reach: clean(r.json?.to_reach, 220), strengths: arr(r.json?.strengths).map((s: unknown) => clean(s, 120)).filter(Boolean).slice(0, 2),
  };
}
async function coachCheck(ctx: Ctx, b: any) {
  const q = questionBits(b);
  const original = clean(b.original, 600), rewrite = clean(b.rewrite, 900);
  if (!original || rewrite.length < 8) return { ok: false, error: 'Write your new version of the sentence first.' };
  await useAI(ctx);
  const r = await askJson(
    `You are a senior ${q.qual} examiner checking whether a student's rewritten sentence is better. Be encouraging but honest. British English. Reply with JSON only.`,
    `Question (${q.marks} marks): ${q.question}
${q.context ? 'Context: ' + q.context + '\n' : ''}The weakness to fix (${clean(b.kind, 20)}): ${clean(b.problem, 220)}
Sentence before it: ${clean(b.before, 600)}
Original sentence: ${original}
Rewritten sentence: ${rewrite}
Return {"rating":0|1|2|3,"improved":true|false,"feedback":"max 35 words: what is now better","still_missing":"max 20 words, or empty if it is now strong"}
rating: 0 = not better, 1 = slightly better, 2 = fixes the weak link, 3 = fixes it and is exam-ready.`,
    30000, { preferStrong: true, temperature: 0, maxTokens: 400 });
  return { ok: true, rating: num(r.json?.rating, 0, 3, 0), improved: r.json?.improved === true, feedback: clean(r.json?.feedback, 260), still_missing: clean(r.json?.still_missing, 160) };
}

/* ───────────── 2. AJIM ───────────── */
async function ajim(ctx: Ctx, b: any) {
  const q = questionBits(b);
  const text = cleanBlock(b.conclusion, 2500);
  if (!q.question || text.split(/\s+/).length < 12) return { ok: false, error: 'Write a few sentences of judgement first.' };
  await useAI(ctx);
  const r = await askJson(
    `You are a senior ${q.qual} examiner checking a student's final judgement for the AJIM structure. British English. Reply with JSON only.`,
    `Question (${q.marks} marks): ${q.question}
Student's conclusion: ${text}
AJIM: A = Answer the question directly; J = Justify with the strongest reason, linked to the case; I = It depends on (a condition that would change the answer); M = Most important factor, explained.
Return {"A":{"ok":true|false,"tip":"max 18 words"},"J":{...},"I":{...},"M":{...}} — tips say what to add, never write it for them.`,
    25000, { temperature: 0, maxTokens: 500 });
  const part = (k: string) => ({ ok: r.json?.[k]?.ok === true, tip: clean(r.json?.[k]?.tip, 140) });
  return { ok: true, A: part('A'), J: part('J'), I: part('I'), M: part('M') };
}

/* ───────────── 3. Blurt & Grill ───────────── */
async function blurt(ctx: Ctx, b: any) {
  const points = arr(b.points).map((p: unknown) => clean(p, 140)).filter(Boolean).slice(0, 30);
  const text = cleanBlock(b.text, 5000);
  if (points.length < 2) return { ok: false, error: 'This learning aim has no checklist yet. Pick another one.' };
  if (text.split(/\s+/).length < 8) return { ok: false, error: 'Say or type a bit more — at least a couple of sentences.' };
  await terms(ctx); await takeTry(ctx, 'blurt'); await useAI(ctx);
  const qual = clean(b.qual, 80) || 'BTEC / A-Level';
  const r = await askJson(
    `You are an expert ${qual} teacher checking a student's "blurt" (everything they remember) against the specification checklist. Be fair: credit ideas in the student's own words; do not credit vague mentions. British English. Reply with JSON only.`,
    `Unit: ${clean(b.unitName, 120)} — ${clean(b.aim, 160)}
Specification checklist: ${JSON.stringify(points.map((p, i) => ({ i, p })))}
Student's blurt: """${text}"""
For EVERY checklist item give status "covered" (accurate and specific), "partial" (mentioned but vague or partly wrong) or "missed". "note" is max 16 words: for partial, what was missing or wrong; for covered, empty.
Then write a 2-question drill on the most important missed / partial items: short-answer questions a student could answer in 1–3 sentences, each with a model answer and 2 mark points.
Return {"items":[{"i":0,"status":"covered|partial|missed","note":""}],"drill":[{"q":"","model":"","points":["",""]}],"praise":"max 15 words"}`,
    50000, { preferStrong: true, temperature: 0.2, maxTokens: 2200 });
  const st: Record<number, any> = {};
  for (const it of arr(r.json?.items)) { const i = num(it?.i, -1, points.length - 1, -1); if (i >= 0) st[i] = { status: ['covered', 'partial', 'missed'].includes(String(it.status)) ? String(it.status) : 'missed', note: clean(it.note, 120) }; }
  const items = points.map((p, i) => ({ i, point: p, ...(st[i] || { status: 'missed', note: '' }) }));
  const drill = arr(r.json?.drill).map((d: any) => ({ q: clean(d?.q, 300), model: clean(d?.model, 600), points: arr(d?.points).map((p: unknown) => clean(p, 200)).filter(Boolean).slice(0, 3) })).filter((d: any) => d.q && d.model).slice(0, 2);
  return { ok: true, items, drill, praise: clean(r.json?.praise, 120) };
}
async function blurtMark(ctx: Ctx, b: any) {
  const drill = arr(b.drill).slice(0, 2).map((d: any) => ({ q: clean(d?.q, 300), model: clean(d?.model, 600), points: arr(d?.points).map((p: unknown) => clean(p, 200)).slice(0, 3) }));
  const answers = arr(b.answers).slice(0, 2).map((a: unknown) => clean(a, 1200));
  if (!drill.length) return { ok: false, error: 'Nothing to mark.' };
  await useAI(ctx);
  const r = await askJson('You are a fair examiner marking short answers. British English. Reply with JSON only.',
    `Mark each answer out of 2 using its mark points. ${JSON.stringify(drill.map((d: any, i: number) => ({ i, q: d.q, points: d.points, answer: answers[i] || '' })))}
Return {"marks":[{"i":0,"score":0,"feedback":"max 25 words"}]}`, 25000, { temperature: 0, maxTokens: 500 });
  const m: any[] = drill.map((_: any, i: number) => { const x = arr(r.json?.marks).find((y: any) => num(y?.i, -1, 9, -1) === i) || {}; return { score: num(x.score, 0, 2, 0), feedback: clean(x.feedback, 200) }; });
  return { ok: true, marks: m };
}

/* ───────────── 4. Pre-release simulator ───────────── */
const PACKS: Record<string, { name: string; qual: string; brief: string; partB: string }> = {
  '/revision/btec/level-3/business/unit-2': { name: 'Unit 2: Developing a Marketing Campaign', qual: 'BTEC Level 3 Business', brief: 'a small UK business planning a new product or service launch: market size and growth, a customer survey, competitor pricing and promotion, and the marketing budget available', partB: 'a rationale for a marketing campaign (aims, objectives, target market, research findings) and a campaign plan (marketing mix, media, budget, timescales, evaluation)' },
  '/revision/btec/level-3/business/unit-6': { name: 'Unit 6: Principles of Management', qual: 'BTEC Level 3 Business', brief: 'a UK organisation facing a management challenge: staffing data (turnover, absence, training), structure, a staff survey, quality issues and a planned change', partB: 'analysing management and leadership, motivation, workforce planning, quality and change management in the organisation, with recommendations' },
  '/revision/btec/level-3/business/unit-7': { name: 'Unit 7: Business Decision Making', qual: 'BTEC Level 3 Business', brief: 'a UK business choosing between options: sales and cost figures, a cash-flow extract, market data and the owner\'s objectives', partB: 'using the data to compare options (e.g. break-even, investment appraisal, ratios) and making a justified decision' },
  '/revision/btec/level-3/sport/unit-2': { name: 'Unit 2: Fitness Training and Programming for Health, Sport and Well-being', qual: 'BTEC Level 3 Sport', brief: 'a client case study: age, lifestyle, diet diary, health screening results (blood pressure, resting heart rate, BMI), activity levels and goals', partB: 'interpreting the screening data, recommending lifestyle changes and nutrition, and designing a safe, progressive training programme' },
  '/revision/btec/level-3/IT-AAQ/unit-2': { name: 'Unit 2: Cyber Security and Incident Management', qual: 'BTEC Level 3 IT (AAQ)', brief: 'a UK organisation\'s IT set-up: network description, devices and users, current security measures, a log extract or incident timeline, and recent threats', partB: 'identifying threats and vulnerabilities, evaluating protection measures, planning incident response and writing part of a security policy' },
};
function sanitisePack(raw: any) {
  const tables = arr(raw?.tables).map((t: any) => {
    const headers = arr(t?.headers).map((h: unknown) => clean(h, 40)).filter(Boolean).slice(0, 6);
    const rows = arr(t?.rows).filter(Array.isArray).map((r: any[]) => headers.map((_: string, i: number) => clean(r[i], 60))).slice(0, 12);
    return headers.length >= 2 && rows.length ? { title: clean(t?.title, 100), headers, rows, note: clean(t?.note, 160) || undefined } : null;
  }).filter(Boolean).slice(0, 4);
  const charts = arr(raw?.charts).map((c: any) => {
    const data = arr(c?.data).map((d: any) => ({ label: clean(d?.label, 30), value: Number(d?.value) })).filter((d: any) => d.label && Number.isFinite(d.value) && d.value >= 0).slice(0, 8);
    return data.length >= 2 ? { title: clean(c?.title, 100), unit: clean(c?.unit, 20), data } : null;
  }).filter(Boolean).slice(0, 3);
  const sections = arr(raw?.sections).map((s: any) => ({ heading: clean(s?.heading, 80), paras: arr(s?.paras).map((p: unknown) => clean(p, 700)).filter(Boolean).slice(0, 4) })).filter((s: any) => s.heading && s.paras.length).slice(0, 6);
  return { title: clean(raw?.title, 100), organisation: clean(raw?.organisation, 80), intro: clean(raw?.intro, 600), sections, tables, charts };
}
async function pack(ctx: Ctx, b: any) {
  const unit = clean(b.unit, 160), P = PACKS[unit];
  if (!P) return { ok: false, error: 'Pick one of the listed units.' };
  await terms(ctx); await takeTry(ctx, 'prerelease'); await useAI(ctx);
  const r = await askJson(
    `You are a senior ${P.qual} examiner writing a realistic MOCK Part A pre-release pack (not a real Pearson paper) for ${P.name}. The organisation is FICTIONAL but realistic for the UK; every figure is invented for practice and must be internally consistent (totals add up, percentages match). British English. Reply with JSON only.`,
    `Write a Part A research pack about ${P.brief}.
Include: a short intro; 3–5 sections of scenario text; 2–3 data tables; 1–2 bar charts (e.g. survey results, monthly sales) with numbers; and details students should spot (strengths, weaknesses, risks, trends, anomalies).
Also write the hidden examiner material:
- "key_facts": 8–12 things a well-prepared student should note in their Part A notes (a statistic, a trend, a SWOT point, a risk / vulnerability), each with "why" it matters for Part B.
- "partb": 3 Part B tasks testing ${P.partB}: marks 6, 8 and 12; each with "verb", "q", "points" (indicative content, 5–8 points) and for the 12-mark task "levels" (3 short level descriptors).
Return {"title":"","organisation":"","intro":"","sections":[{"heading":"","paras":[""]}],"tables":[{"title":"","headers":["",""],"rows":[["",""]],"note":""}],"charts":[{"title":"","unit":"%","data":[{"label":"","value":0}]}],"key_facts":[{"point":"","why":""}],"partb":[{"q":"","marks":6,"verb":"","points":[""],"levels":[]}]}`,
    90000, { preferStrong: true, temperature: 0.6, maxTokens: 6000 });
  const pub = sanitisePack(r.json);
  const keyFacts = arr(r.json?.key_facts).map((k: any) => ({ point: clean(k?.point, 220), why: clean(k?.why, 220) })).filter((k: any) => k.point).slice(0, 12);
  const partb = arr(r.json?.partb).map((t: any) => ({ q: clean(t?.q, 700), marks: num(t?.marks, 2, 20, 8), verb: clean(t?.verb, 30), points: arr(t?.points).map((p: unknown) => clean(p, 260)).filter(Boolean).slice(0, 10), levels: arr(t?.levels).map((l: unknown) => clean(l, 260)).filter(Boolean).slice(0, 4) })).filter((t: any) => t.q && t.points.length).slice(0, 3);
  if (!pub.sections.length || !pub.tables.length || keyFacts.length < 5 || partb.length < 2) throw new Error('The pack came back incomplete.');
  const { data, error } = await ctx.admin.from('prerelease_packs').insert({ user_id: ctx.userId, unit, title: pub.title, pack: pub, keys: { key_facts: keyFacts, partb } }).select('id, created_at').single();
  if (error) throw new Error(error.message);
  return { ok: true, id: data.id, unit, unitName: P.name, pack: pub, tasks: partb.map((t: any) => ({ q: t.q, marks: t.marks, verb: t.verb })) };
}
async function ownPack(ctx: Ctx, id: unknown) {
  const { data } = await ctx.admin.from('prerelease_packs').select('*').eq('id', clean(id, 60)).maybeSingle();
  if (!data || data.user_id !== ctx.userId) throw new Stop({ ok: false, error: 'Pack not found.' });
  return data;
}
async function packNotes(ctx: Ctx, b: any) {
  const P = await ownPack(ctx, b.id);
  const notes = cleanBlock(b.notes, 6000);
  if (notes.split(/\s+/).length < 20) return { ok: false, error: 'Write some notes first (at least a few lines).' };
  await useAI(ctx);
  const facts = arr(P.keys?.key_facts);
  const r = await askJson('You are a senior BTEC examiner checking a student\'s Part A preparation notes against what a well-prepared student would have noted. Be fair: credit the idea in any wording or abbreviation. British English. Reply with JSON only.',
    `Key facts: ${JSON.stringify(facts.map((f: any, i: number) => ({ i, point: f.point })))}
Student notes: """${notes}"""
Return {"found":[0],"partial":[{"i":0,"note":"max 15 words"}],"tips":["max 3 tips, max 20 words each, about how to make the notes more useful for Part B"]}`,
    35000, { temperature: 0, maxTokens: 800 });
  const found = new Set(arr(r.json?.found).map((i: unknown) => num(i, -1, 99, -1)));
  const partial: Record<number, string> = {}; arr(r.json?.partial).forEach((p: any) => { const i = num(p?.i, -1, 99, -1); if (i >= 0) partial[i] = clean(p?.note, 120); });
  const items = facts.map((f: any, i: number) => ({ point: f.point, why: f.why, status: found.has(i) ? 'found' : partial[i] !== undefined ? 'partial' : 'missed', note: partial[i] || '' }));
  const result = { items, score: items.filter((x: any) => x.status === 'found').length + items.filter((x: any) => x.status === 'partial').length * 0.5, total: items.length, tips: arr(r.json?.tips).map((t: unknown) => clean(t, 160)).filter(Boolean).slice(0, 3) };
  await ctx.admin.from('prerelease_packs').update({ notes, notes_result: result, updated_at: new Date().toISOString() }).eq('id', P.id);
  return { ok: true, ...result };
}
async function packMark(ctx: Ctx, b: any) {
  const P = await ownPack(ctx, b.id);
  const tasks = arr(P.keys?.partb);
  const answers = arr(b.answers).slice(0, tasks.length).map((a: unknown) => cleanBlock(a, 8000));
  if (!answers.some((a: string) => a.split(/\s+/).length >= 15)) return { ok: false, error: 'Answer at least one task first.' };
  await useAI(ctx);
  const r = await askJson('You are a senior BTEC examiner marking Part B answers against the indicative content and levels. Credit relevant points applied to the Part A scenario. British English. Reply with JSON only.',
    `Scenario summary: ${clean(P.pack?.intro, 600)}
Tasks: ${JSON.stringify(tasks.map((t: any, i: number) => ({ i, q: t.q, marks: t.marks, points: t.points, levels: t.levels, answer: answers[i] || '' })))}
Return {"marks":[{"i":0,"mark":0,"level":"","www":"max 30 words","ebi":"max 30 words"}]}`,
    50000, { preferStrong: true, temperature: 0, maxTokens: 1500 });
  const marks = tasks.map((t: any, i: number) => { const x = arr(r.json?.marks).find((y: any) => num(y?.i, -1, 9, -1) === i) || {}; return { mark: answers[i] ? num(x.mark, 0, t.marks, 0) : 0, max: t.marks, level: clean(x.level, 30), www: clean(x.www, 240), ebi: clean(x.ebi, 240) }; });
  await ctx.admin.from('prerelease_packs').update({ partb_answers: answers, partb_result: marks, updated_at: new Date().toISOString() }).eq('id', P.id);
  return { ok: true, marks, points: tasks.map((t: any) => t.points) };
}
async function packList(ctx: Ctx) {
  const { data } = await ctx.admin.from('prerelease_packs').select('id, unit, title, created_at, notes_result, partb_result').eq('user_id', ctx.userId).order('created_at', { ascending: false }).limit(20);
  return { ok: true, packs: (data || []).map((p: any) => ({ id: p.id, unit: p.unit, title: p.title, created_at: p.created_at, notes: p.notes_result ? { score: p.notes_result.score, total: p.notes_result.total } : null, partb: p.partb_result ? { mark: p.partb_result.reduce((s: number, x: any) => s + (x.mark || 0), 0), max: p.partb_result.reduce((s: number, x: any) => s + (x.max || 0), 0) } : null })) };
}
async function packOpen(ctx: Ctx, b: any) {
  const P = await ownPack(ctx, b.id);
  return { ok: true, id: P.id, unit: P.unit, unitName: PACKS[P.unit]?.name || P.unit, pack: P.pack, tasks: arr(P.keys?.partb).map((t: any) => ({ q: t.q, marks: t.marks, verb: t.verb })), notes: P.notes || '', notes_result: P.notes_result, partb_answers: P.partb_answers, partb_result: P.partb_result };
}

/* ───────────── 5. Bug Hunt ───────────── */
const LANGS = ['python', 'sql', 'pseudocode'];
async function bug(ctx: Ctx, b: any) {
  const lang = LANGS.includes(String(b.lang)) ? String(b.lang) : 'python';
  const level = ['gcse', 'alevel', 'btec'].includes(String(b.level)) ? String(b.level) : 'btec';
  const topic = clean(b.topic, 80);
  const retry = await ticketOk(ctx.userId, b.ticket);
  await terms(ctx);
  if (!retry) await takeTry(ctx, 'bughunt');
  await useAI(ctx);
  const who = level === 'gcse' ? 'GCSE Computer Science (OCR J277)' : level === 'alevel' ? 'A-Level Computer Science (OCR H446)' : 'BTEC Level 3 Computing / IT';
  const spec = lang === 'python'
    ? `Python 3, standard library only, 8–20 lines. The program reads with input() and prints results. Give 3 "tests": each has "stdin" (list of input lines) and an optional "check" of Python asserts run after the program. Do NOT give expected outputs — they come from running "solution".`
    : lang === 'sql'
    ? `SQLite. Give "setup" (CREATE TABLE + INSERT statements, 1–2 tables, 5–8 rows each), the "buggy" query and the correct "solution" query. Include ORDER BY when order matters.`
    : `OCR Exam Reference Language pseudocode (e.g. for i = 0 to 9 … next i, if … then … endif, while … endwhile, procedure/function … endprocedure/endfunction, print()). 8–18 lines. Also give "points": 3 mark-scheme points for a correct fix and explanation.`;
  const r = await askJson(
    `You write "spot the bug" exercises for ${who} students. The bugs must be subtle LOGIC errors (off-by-one, wrong comparison, wrong boolean operator, wrong JOIN or WHERE condition, wrong accumulator, unreachable branch) — never syntax errors. Exactly 1 or 2 bugs. British English. Reply with JSON only.`,
    `${topic ? 'Topic: ' + topic + '\n' : ''}Language: ${lang}. ${spec}
"buggy" and "solution" must be identical except for the bug fix(es). "bugs" lists each bug's line number in "buggy" (1-based), its kind and a one-sentence explanation. "brief" says what the program SHOULD do (2–3 sentences, with an example).
Return {"title":"","brief":"","buggy":"","solution":"",${lang === 'python' ? '"tests":[{"stdin":[],"check":""}],' : lang === 'sql' ? '"setup":"",' : '"points":["","",""],'}"hint":"one nudge, max 20 words","bugs":[{"line":1,"kind":"off-by-one","explain":""}]}`,
    45000, { preferStrong: true, temperature: 0.7, maxTokens: 2500 });
  const J = r.json || {};
  const c = (x: unknown) => cleanBlock(x, 4000);
  const out: any = { lang, level, title: clean(J.title, 90), brief: clean(J.brief, 600), buggy: c(J.buggy), solution: c(J.solution), hint: clean(J.hint, 160),
    bugs: arr(J.bugs).map((x: any) => ({ line: num(x?.line, 1, 200, 1), kind: clean(x?.kind, 40), explain: clean(x?.explain, 260) })).slice(0, 3) };
  if (lang === 'python') out.tests = arr(J.tests).map((t: any) => ({ stdin: arr(t?.stdin).map((s: unknown) => clean(s, 200)).slice(0, 20), check: c(t?.check).slice(0, 800) })).slice(0, 4);
  if (lang === 'sql') out.setup = c(J.setup);
  if (lang === 'pseudocode') out.points = arr(J.points).map((p: unknown) => clean(p, 200)).filter(Boolean).slice(0, 4);
  if (!out.buggy || !out.solution || out.buggy === out.solution || (lang === 'python' && !out.tests.length) || (lang === 'sql' && !out.setup)) throw new Error('The challenge came back incomplete.');
  return { ok: true, challenge: out, ticket: retry ? null : await makeTicket(ctx.userId) };
}
async function bugMark(ctx: Ctx, b: any) {
  const ch = b.challenge || {};
  const fix = cleanBlock(b.fix, 4000), why = clean(b.explain, 800);
  if (!fix) return { ok: false, error: 'Fix the code first.' };
  await useAI(ctx);
  const r = await askJson('You are an OCR Computer Science examiner marking a student\'s bug fix in exam reference language. Accept any correct fix, not only the model one. British English. Reply with JSON only.',
    `What the program should do: ${clean(ch.brief, 600)}
Buggy version: ${cleanBlock(ch.buggy, 3000)}
Model fix: ${cleanBlock(ch.solution, 3000)}
Mark points: ${JSON.stringify(arr(ch.points).map((p: unknown) => clean(p, 200)))}
Student's fixed code: ${fix}
Student's explanation: ${why}
Return {"score":0,"max":3,"fixed":true|false,"feedback":"max 40 words"}`, 30000, { temperature: 0, maxTokens: 400 });
  return { ok: true, score: num(r.json?.score, 0, 3, 0), max: 3, fixed: r.json?.fixed === true, feedback: clean(r.json?.feedback, 300) };
}

/* ───────────── 6. Scanner (free) ───────────── */
async function scanCards(ctx: Ctx, b: any) {
  const image = String(b.image || '');
  if (!image || image.length > MAX_IMAGE || !IMAGE_RE.test(image)) return { ok: false, error: 'Please send one photo (JPEG, PNG or WebP) under 2 MB.' };
  await terms(ctx); await useAI(ctx);
  const r = await askVisionJson(
    'You read photos of students\' handwritten or printed revision flashcards and notes, and turn them into question/answer flashcards. Copy what is written; never add facts that are not on the page. If a card has only a term, use the term as "front" and the written definition as "back". Ignore crossed-out text. Unreadable words become [?]. Reply with JSON only.',
    'Make flashcards from this photo. Return {"cards":[{"front":"term or question","back":"definition or answer"}],"notes":"anything you could not read"}',
    image);
  const cards = arr(r.json?.cards).map((c: any) => ({ front: clean(c?.front, 300), back: clean(c?.back, 600) })).filter((c: any) => c.front && c.back).slice(0, 40);
  return { ok: true, cards, notes: clean(r.json?.notes, 300) };
}

/* ───────────── 7. Spec-gap micro-drill (free) ───────────── */
async function drill(ctx: Ctx, b: any) {
  const topic = clean(b.topic, 140);
  if (!topic) return { ok: false, error: 'No topic.' };
  const bank = arr(b.bank).map((q: any) => ({ q: clean(q?.q, 300), choices: arr(q?.choices).map((c: unknown) => clean(c, 160)).filter(Boolean).slice(0, 5), answer: Math.round(Number(q?.correct)) }))
    .filter((q: any) => q.q && q.choices.length >= 2 && q.answer >= 0 && q.answer < q.choices.length);
  if (bank.length >= 3) {
    // real questions from the unit's own bank: no AI needed
    return { ok: true, source: 'bank', items: shuffle(bank).slice(0, 3).map((q: any) => { const o = shuffle(q.choices.map((_: string, i: number) => i)); return { q: q.q, choices: o.map((i: number) => q.choices[i]), answer: o.indexOf(q.answer), explain: '' }; }) };
  }
  await useAI(ctx);
  const qual = clean(b.qual, 80) || 'BTEC / A-Level';
  const r = await askJson(`You write accurate multiple-choice questions for ${qual}. Exactly one defensible correct answer per question. British English. Reply with JSON only.`,
    `Unit: ${clean(b.unitName, 120)}. The student lost marks on: ${topic}${b.question ? ' (question: ' + clean(b.question, 400) + ')' : ''}.
Write 3 questions that target the misunderstanding behind this, each with 4 choices, "answer" (0-based) and a one-sentence "explain".
Return {"items":[{"q":"","choices":["","","",""],"answer":0,"explain":""}]}`, 35000, { preferStrong: true, temperature: 0.3, maxTokens: 1200 });
  let items = arr(r.json?.items).map((x: any) => ({ q: clean(x?.q, 300), choices: arr(x?.choices).map((c: unknown) => clean(c, 160)).filter(Boolean).slice(0, 4), answer: Math.round(Number(x?.answer)), explain: clean(x?.explain, 260) }))
    .filter((x: any) => x.q && x.choices.length === 4 && x.answer >= 0 && x.answer < 4 && new Set(x.choices.map(norm)).size === 4);
  // second pass: an examiner confirms each key
  const v = await askJson(`You are a strict ${qual} examiner. Reply with JSON only.`,
    `Check each question: is "answer" the one correct choice, with no other arguable choice? ${JSON.stringify(items.map((x: any, i: number) => ({ i, q: x.q, choices: x.choices, answer: x.answer })))}
Return {"ok":[0,1,2]} listing only the questions that are definitely correct.`, 25000, { preferStrong: true, temperature: 0, maxTokens: 200 }).catch(() => null);
  if (v) { const keep = new Set(arr(v.json?.ok).map((i: unknown) => num(i, -1, 9, -1))); items = items.filter((_: any, i: number) => keep.has(i)); }
  if (items.length < 2) throw new Error('Could not build the drill. Try again.');
  return { ok: true, source: 'ai', items: items.map((x: any) => { const o = shuffle([0, 1, 2, 3]); return { q: x.q, choices: o.map((i) => x.choices[i]), answer: o.indexOf(x.answer), explain: x.explain }; }) };
}

/* ───────────── entry ───────────── */
serve(async (req) => {
  const headers = cors(req.headers.get('origin'));
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, headers, 405);
  if (!SUPABASE_URL || !SERVICE_KEY) return json({ error: 'Server not configured' }, headers, 500);
  const token = (req.headers.get('authorization') || '').replace(/^Bearer /, '');
  if (!token) return json({ ok: false, error: 'Please sign in to use AI tools.' }, headers, 401);
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  const { data: u, error: uErr } = await admin.auth.getUser(token);
  if (uErr || !u?.user?.id) return json({ ok: false, error: 'Please sign in again.' }, headers, 401);
  const ctx: Ctx = { admin, userId: u.user.id, headers, usageId: null, trial: null };
  let body: any = {};
  try { body = await req.json(); } catch { body = {}; }
  const action = String(body?.action || '').trim().toLowerCase();
  const AI = new Set(['coach', 'coach-check', 'ajim', 'blurt', 'blurt-mark', 'pack', 'pack-notes', 'pack-mark', 'bug', 'bug-mark', 'scan-cards', 'drill']);
  if (AI.has(action) && !hasProviders()) return json({ ok: false, error: 'AI is not configured.' }, headers, 503);
  try {
    const run: Record<string, () => Promise<any>> = {
      status: async () => { const { data } = await admin.rpc('ai_tool_is_premium', { p_user: ctx.userId }); return { ok: true, premium: data === true }; },
      coach: () => coach(ctx, body), 'coach-check': () => coachCheck(ctx, body), ajim: () => ajim(ctx, body),
      blurt: () => blurt(ctx, body), 'blurt-mark': () => blurtMark(ctx, body),
      pack: () => pack(ctx, body), 'pack-notes': () => packNotes(ctx, body), 'pack-mark': () => packMark(ctx, body), 'pack-list': () => packList(ctx), 'pack-open': () => packOpen(ctx, body),
      bug: () => bug(ctx, body), 'bug-mark': () => bugMark(ctx, body),
      'scan-cards': () => scanCards(ctx, body), drill: () => drill(ctx, body),
    };
    if (!run[action]) return json({ ok: false, error: 'Unknown action.' }, headers, 400);
    return json(await run[action](), headers);
  } catch (e) {
    if (e instanceof Stop) { await refund(ctx).catch(() => {}); return json(e.body, headers, e.body?.code === 'usage_limit' ? 429 : 200); }
    console.error('ai-tools', action, e);
    await refund(ctx).catch(() => {});
    return json({ ok: false, error: 'The AI is busy right now — nothing was used up. Please try again in a moment.' }, headers, 500);
  }
});
