import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// RA10 AI moderator for the community forums.
//
// Policy: swearing and rude banter are fine. Racism, hate, serious threats,
// sexual content, self-harm encouragement, doxxing and scams are removed.
// Called by the website right after someone posts (body: { kind, id }) and by
// moderators for a catch-up sweep (body: { sweep: true }).

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const OWNER_EMAIL = 'mistry.hashim@icloud.com';

const ALLOWED_ORIGINS = new Set([
  'https://ra10.co.uk', 'https://www.ra10.co.uk',
  'http://localhost:8765', 'http://127.0.0.1:8765', 'http://localhost:5500', 'http://127.0.0.1:5500',
  'http://localhost:5173', 'http://127.0.0.1:5173',
]);
function corsHeaders(origin: string | null) {
  let allow = 'https://ra10.co.uk';
  if (origin) {
    try {
      const u = new URL(origin);
      if (ALLOWED_ORIGINS.has(origin) || (u.protocol === 'https:' && (u.hostname === 'ra10.co.uk' || u.hostname.endsWith('.ra10.co.uk')))) allow = origin;
    } catch (_e) { /* ignore */ }
  }
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

type Verdict = { action: 'allow' | 'flag' | 'remove'; severity: number; category: string; reason: string };

const SYSTEM = `You are the community moderator for RA10, a UK revision website used by students aged 13-18 (GCSE, A-Level, BTEC).

ALLOWED - never remove or flag these:
- Swearing and profanity ("this exam is shit", "fuck my life"), crude humour, banter, complaining, sarcasm.
- Disagreement, blunt criticism of ideas, jokes, memes, off-topic chat, mild insults between friends.
- Discussing difficult topics respectfully (exam stress, mental health, politics) without hate.

REMOVE (action "remove") - clear, serious violations:
- racism or hate speech: slurs or demeaning stereotypes about race, ethnicity, religion, nationality, gender, sexuality, disability, etc. (severity 3)
- serious threats of violence, wishing death or harm on someone, encouraging suicide or self-harm ("kill yourself") (severity 3)
- sexual or explicit content, sexualising anyone, any sexual content involving minors (severity 3)
- targeted harassment or bullying of a specific person, doxxing / sharing personal details such as addresses, phone numbers, full names with school (severity 2)
- scams, phishing, adverts for cheating services, malware links, drugs sales (severity 2)
- sharing leaked or live exam questions or mark schemes before the exam has finished (severity 2)

FLAG (action "flag") - borderline, leave it up but ask a human to look:
- heated personal attacks, possible bullying without a clear target, ambiguous hateful wording, possible exam leak, anything you are unsure about (severity 1)

Judge intent and context, not just words. Quoting a slur to report it or discuss why it is wrong is not a violation. Be conservative about removing: if unsure choose "flag", not "remove".

Reply with ONLY a JSON object: {"action":"allow"|"flag"|"remove","severity":0-3,"category":"short label e.g. racism, threat, sexual, harassment, personal-info, spam, exam-leak, other, none","reason":"one short sentence addressed to the author, no quoting of slurs"}`;

// Backstop used before the model, and if no model is reachable. Deliberately tiny.
const HARD_PATTERNS: Array<[RegExp, string]> = [
  [/\bn+[i1!|]+g+[g]*[a@e3]+r*s?\b/i, 'racism'],
  [/\bk+y+s\b|\bkill\s+your\s*self\b|\bgo\s+(and\s+)?die\b/i, 'threat'],
];

function quickVerdict(text: string): Verdict | null {
  const t = text.replace(/[​-‍]/g, '');
  for (const [re, category] of HARD_PATTERNS) {
    if (re.test(t)) return { action: 'remove', severity: 3, category, reason: category === 'racism' ? 'Racist or hateful language isn’t allowed on RA10.' : 'Threats and encouraging self-harm aren’t allowed on RA10.' };
  }
  return null;
}

type Provider = { name: string; endpoint: string; key: string; models: string[]; json: boolean };
function providers(): Provider[] {
  const out: Provider[] = [];
  const openai = Deno.env.get('OPENAI_API_KEY');
  if (openai) out.push({ name: 'openai', endpoint: Deno.env.get('OPENAI_ENDPOINT') || 'https://api.openai.com/v1/chat/completions', key: openai, models: [Deno.env.get('MODERATION_MODEL') || 'gpt-4o-mini'], json: true });
  const deepseek = Deno.env.get('DEEPSEEK_API_KEY');
  if (deepseek) out.push({ name: 'deepseek', endpoint: 'https://api.deepseek.com/chat/completions', key: deepseek, models: [Deno.env.get('DEEPSEEK_MODEL') || 'deepseek-chat'], json: true });
  const gemini = Deno.env.get('GEMINI_API_KEY');
  if (gemini) out.push({ name: 'gemini', endpoint: Deno.env.get('GEMINI_ENDPOINT') || 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', key: gemini, models: ['gemini-2.0-flash'], json: false });
  const openrouter = Deno.env.get('OPENROUTER_API_KEY');
  if (openrouter) out.push({ name: 'openrouter', endpoint: 'https://openrouter.ai/api/v1/chat/completions', key: openrouter, models: ['openai/gpt-4o-mini'], json: false });
  return out;
}

function parseVerdict(raw: string): Verdict | null {
  const m = String(raw || '').match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    const j = JSON.parse(m[0]);
    const action = ['allow', 'flag', 'remove'].includes(j.action) ? j.action : null;
    if (!action) return null;
    return { action, severity: Math.max(0, Math.min(3, Number(j.severity) || 0)), category: String(j.category || 'other').slice(0, 40), reason: String(j.reason || '').slice(0, 240) };
  } catch (_e) { return null; }
}

async function askModel(text: string, context: string): Promise<Verdict | null> {
  const user = `${context}\n\n--- CONTENT TO REVIEW ---\n${text.slice(0, 6000)}`;
  for (const p of providers()) {
    for (const model of p.models) {
      try {
        const body: Record<string, unknown> = { model, temperature: 0, max_tokens: 200, messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: user }] };
        if (p.json) body.response_format = { type: 'json_object' };
        const res = await fetch(p.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.key}` }, body: JSON.stringify(body) });
        if (!res.ok) continue;
        const data = await res.json();
        const v = parseVerdict(data?.choices?.[0]?.message?.content || '');
        if (v) return v;
      } catch (_e) { /* try next */ }
    }
  }
  return null;
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers });
  if (req.method !== 'POST') return json(405, { error: 'POST only' });

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const { data: auth } = await admin.auth.getUser(token);
  const caller = auth?.user;
  if (!caller) return json(401, { error: 'Sign in required.' });
  const callerEmail = String(caller.email || '').toLowerCase();

  let payload: any = {};
  try { payload = await req.json(); } catch (_e) { /* empty */ }

  const isStaff = async () => {
    if (callerEmail === OWNER_EMAIL) return true;
    const { data } = await admin.from('community_staff').select('email').eq('email', callerEmail).maybeSingle();
    return !!data;
  };

  // Which queue rows to work on
  let items: Array<{ id: number; kind: string; target_id: string }> = [];
  if (payload.sweep) {
    if (!(await isStaff())) return json(403, { error: 'Moderators only.' });
    const { data } = await admin.from('forum_mod_queue').select('id,kind,target_id')
      .or('status.eq.pending,and(status.eq.error,attempts.lt.4)').order('created_at').limit(15);
    items = data || [];
  } else if (payload.kind && payload.id) {
    const { data } = await admin.from('forum_mod_queue').select('id,kind,target_id')
      .eq('kind', String(payload.kind)).eq('target_id', String(payload.id)).in('status', ['pending', 'error']).limit(1);
    items = data || [];
  } else return json(400, { error: 'Send { kind, id } or { sweep: true }.' });

  const results: any[] = [];
  for (const item of items) {
    // Claim it so two callers don't double-process
    const { data: claimed } = await admin.from('forum_mod_queue').update({ status: 'processing' }).eq('id', item.id).in('status', ['pending', 'error']).select('id,attempts').maybeSingle();
    if (!claimed) continue;

    let title = '', content = '', authorId = '', postId = '', parentId: string | null = null, categoryId: string | null = null, createdAt: string | null = null, context = '';
    if (item.kind === 'post') {
      const { data: p } = await admin.from('forum_posts').select('id,title,body,user_id,category_id,created_at').eq('id', item.target_id).maybeSingle();
      if (!p) { await admin.from('forum_mod_queue').update({ status: 'done', processed_at: new Date().toISOString() }).eq('id', item.id); continue; }
      title = p.title; content = p.body; authorId = p.user_id; postId = p.id; categoryId = p.category_id; createdAt = p.created_at;
      context = `This is a new forum THREAD in the "${p.category_id}" category.\nTitle: ${p.title}`;
    } else {
      const { data: c } = await admin.from('forum_comments').select('id,body,user_id,post_id,parent_id,created_at').eq('id', item.target_id).maybeSingle();
      if (!c) { await admin.from('forum_mod_queue').update({ status: 'done', processed_at: new Date().toISOString() }).eq('id', item.id); continue; }
      const { data: p } = await admin.from('forum_posts').select('title').eq('id', c.post_id).maybeSingle();
      content = c.body; authorId = c.user_id; postId = c.post_id; parentId = c.parent_id; createdAt = c.created_at;
      context = `This is a REPLY in a forum thread titled: ${p?.title || '(unknown)'}`;
    }

    // Staff are trusted: never auto-remove their content.
    const { data: au } = await admin.auth.admin.getUserById(authorId);
    const authorEmail = String(au?.user?.email || '').toLowerCase();
    let trusted = authorEmail === OWNER_EMAIL;
    if (!trusted && authorEmail) {
      const { data: st } = await admin.from('community_staff').select('email').eq('email', authorEmail).maybeSingle();
      trusted = !!st;
    }

    const text = (title ? title + '\n\n' : '') + content;
    let verdict: Verdict | null = trusted ? { action: 'allow', severity: 0, category: 'none', reason: '' } : quickVerdict(text);
    let source = 'ai';
    if (verdict) source = trusted ? 'ai' : 'filter';
    else verdict = await askModel(text, context);

    if (!verdict) {
      // No model answered — leave the content up and retry later.
      await admin.from('forum_mod_queue').update({ status: 'error', attempts: (claimed.attempts || 0) + 1 }).eq('id', item.id);
      results.push({ kind: item.kind, id: item.target_id, action: 'pending' });
      continue;
    }

    if (verdict.action !== 'allow') {
      await admin.from('forum_mod_log').insert({
        kind: item.kind, target_id: item.target_id, post_id: postId || null, author_id: authorId, category_id: categoryId, title: title || null,
        content, parent_id: parentId, original_created_at: createdAt,
        action: verdict.action === 'remove' ? 'removed' : 'flagged', category: verdict.category, severity: verdict.severity, reason: verdict.reason, source,
      });
    }

    if (verdict.action === 'remove') {
      await admin.from(item.kind === 'post' ? 'forum_posts' : 'forum_comments').delete().eq('id', item.target_id);
      // Escalate: severe first offence = 1 day, repeat offenders = 7 days.
      const since = new Date(Date.now() - 30 * 86400000).toISOString();
      const { count } = await admin.from('forum_mod_log').select('id', { count: 'exact', head: true }).eq('author_id', authorId).eq('action', 'removed').gte('created_at', since);
      const strikes = count || 0;
      if (verdict.severity >= 3 || strikes >= 3) {
        const days = strikes >= 3 ? 7 : 1;
        await admin.from('forum_bans').upsert({ user_id: authorId, reason: `Automatic: ${verdict.category} (${strikes} recent removal${strikes === 1 ? '' : 's'})`, expires_at: new Date(Date.now() + days * 86400000).toISOString(), banned_by: null });
      }
    }
    await admin.from('forum_mod_queue').update({ status: 'done', processed_at: new Date().toISOString() }).eq('id', item.id);
    results.push({ kind: item.kind, id: item.target_id, action: verdict.action, reason: verdict.reason, category: verdict.category, authorId });
  }
  return json(200, { results });
});
