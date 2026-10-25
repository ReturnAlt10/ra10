import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Owner-only: summarises a moderator applicant (activity, XP, account age,
// forum behaviour, their own words) into a short recommendation. The result is
// cached on the application row so it is only generated once.

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

type Provider = { endpoint: string; key: string; model: string; json: boolean };
function providers(): Provider[] {
  const out: Provider[] = [];
  const openai = Deno.env.get('OPENAI_API_KEY');
  if (openai) out.push({ endpoint: Deno.env.get('OPENAI_ENDPOINT') || 'https://api.openai.com/v1/chat/completions', key: openai, model: Deno.env.get('SUMMARY_MODEL') || 'gpt-4o-mini', json: true });
  const deepseek = Deno.env.get('DEEPSEEK_API_KEY');
  if (deepseek) out.push({ endpoint: 'https://api.deepseek.com/chat/completions', key: deepseek, model: Deno.env.get('DEEPSEEK_MODEL') || 'deepseek-chat', json: true });
  const gemini = Deno.env.get('GEMINI_API_KEY');
  if (gemini) out.push({ endpoint: Deno.env.get('GEMINI_ENDPOINT') || 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', key: gemini, model: 'gemini-2.0-flash', json: false });
  const openrouter = Deno.env.get('OPENROUTER_API_KEY');
  if (openrouter) out.push({ endpoint: 'https://openrouter.ai/api/v1/chat/completions', key: openrouter, model: 'openai/gpt-4o-mini', json: false });
  return out;
}

const SYSTEM = `You help the owner of RA10, a UK revision website for students aged 13-18, decide whether to accept a member as a volunteer forum moderator.
You get the applicant's own message plus objective numbers (XP, how often they use the site, account age, forum activity, how many of their posts the AI moderator had to remove).
Write a fair, concise assessment. Do not invent facts that are not in the data. Judge reliability and likely helpfulness: consistent use of the site, a track record without rule-breaking, and a thoughtful message are good signs. A brand new account with no activity, repeated removals, bans or a careless message are concerns. Do not be swayed by XP alone.
Reply with ONLY JSON: {"headline":"max 12 words","summary":"2-3 sentences","strengths":["..."],"concerns":["..."],"recommendation":"approve"|"consider"|"decline","confidence":"low"|"medium"|"high"}. Max 4 strengths and 4 concerns, each under 14 words.`;

function fallbackSummary(s: any) {
  const strengths: string[] = [], concerns: string[] = [];
  if (s.activeDays30 >= 12) strengths.push(`Active on ${s.activeDays30} of the last 30 days`);
  if (s.xpTotal >= 1500) strengths.push(`${s.xpTotal.toLocaleString()} total XP`);
  if (s.accountAgeDays >= 60) strengths.push(`Account is ${s.accountAgeDays} days old`);
  if (s.replies + s.threads >= 5) strengths.push(`${s.threads + s.replies} forum contributions`);
  if (s.removals === 0 && s.threads + s.replies > 0) strengths.push('No posts removed by the AI moderator');
  if (s.accountAgeDays < 14) concerns.push('Very new account');
  if (s.activeDays30 < 4) concerns.push('Rarely active recently');
  if (s.removals > 0) concerns.push(`${s.removals} post${s.removals === 1 ? '' : 's'} removed by the AI moderator`);
  if (s.banned) concerns.push('Has been banned from the forums');
  if (s.messageWords < 25) concerns.push('Very short application message');
  const score = strengths.length - concerns.length * 1.5;
  return {
    headline: score >= 2 ? 'Looks like a reliable regular' : score >= 0 ? 'Mixed signals — worth a closer look' : 'Limited track record so far',
    summary: `Account is ${s.accountAgeDays} days old with ${s.xpTotal.toLocaleString()} XP and ${s.activeDays30} active days in the last 30. They have posted ${s.threads} thread${s.threads === 1 ? '' : 's'} and ${s.replies} repl${s.replies === 1 ? 'y' : 'ies'}, with ${s.removals} removed by the AI moderator. (Automatic summary — no AI model was available.)`,
    strengths: strengths.slice(0, 4), concerns: concerns.slice(0, 4),
    recommendation: score >= 2 ? 'approve' : score >= 0 ? 'consider' : 'decline', confidence: 'low', source: 'stats',
  };
}

async function askModel(userText: string) {
  for (const p of providers()) {
    try {
      const body: Record<string, unknown> = { model: p.model, temperature: 0.2, max_tokens: 500, messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: userText }] };
      if (p.json) body.response_format = { type: 'json_object' };
      const res = await fetch(p.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.key}` }, body: JSON.stringify(body) });
      if (!res.ok) continue;
      const data = await res.json();
      const m = String(data?.choices?.[0]?.message?.content || '').match(/\{[\s\S]*\}/);
      if (!m) continue;
      const j = JSON.parse(m[0]);
      if (!j.summary) continue;
      return {
        headline: String(j.headline || '').slice(0, 120), summary: String(j.summary).slice(0, 700),
        strengths: (Array.isArray(j.strengths) ? j.strengths : []).slice(0, 4).map((x: unknown) => String(x).slice(0, 120)),
        concerns: (Array.isArray(j.concerns) ? j.concerns : []).slice(0, 4).map((x: unknown) => String(x).slice(0, 120)),
        recommendation: ['approve', 'consider', 'decline'].includes(j.recommendation) ? j.recommendation : 'consider',
        confidence: ['low', 'medium', 'high'].includes(j.confidence) ? j.confidence : 'medium', source: 'ai',
      };
    } catch (_e) { /* next provider */ }
  }
  return null;
}

serve(async (req) => {
  const headers = corsHeaders(req.headers.get('origin'));
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers });
  if (req.method !== 'POST') return json(405, { error: 'POST only' });

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const { data: auth } = await admin.auth.getUser(token);
  if (String(auth?.user?.email || '').toLowerCase() !== OWNER_EMAIL) return json(403, { error: 'Owner only.' });

  let payload: any = {};
  try { payload = await req.json(); } catch (_e) { /* empty */ }
  const id = String(payload.applicationId || '');
  if (!id) return json(400, { error: 'applicationId required' });

  const { data: app } = await admin.from('community_mod_applications').select('*').eq('id', id).maybeSingle();
  if (!app) return json(404, { error: 'Application not found.' });
  if (app.ai_summary && !payload.refresh) return json(200, { summary: app.ai_summary, cached: true });

  const uid = app.user_id;
  const since30 = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const since90 = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
  const [{ data: prof }, { data: u }, d30, d90, dAll, threads, replies, removed, ban, recentPosts, recentReplies] = await Promise.all([
    admin.from('profiles').select('username,full_name,xp_total,xp_this_week,tier').eq('id', uid).maybeSingle(),
    admin.auth.admin.getUserById(uid),
    admin.from('study_days').select('day', { count: 'exact', head: true }).eq('user_id', uid).gte('day', since30),
    admin.from('study_days').select('day', { count: 'exact', head: true }).eq('user_id', uid).gte('day', since90),
    admin.from('study_days').select('day', { count: 'exact', head: true }).eq('user_id', uid),
    admin.from('forum_posts').select('id', { count: 'exact', head: true }).eq('user_id', uid),
    admin.from('forum_comments').select('id', { count: 'exact', head: true }).eq('user_id', uid),
    admin.from('forum_mod_log').select('id', { count: 'exact', head: true }).eq('author_id', uid).eq('action', 'removed'),
    admin.from('forum_bans').select('user_id', { count: 'exact', head: true }).eq('user_id', uid),
    admin.from('forum_posts').select('title').eq('user_id', uid).order('created_at', { ascending: false }).limit(5),
    admin.from('forum_comments').select('body').eq('user_id', uid).order('created_at', { ascending: false }).limit(5),
  ]);
  const created = u?.user?.created_at ? new Date(u.user.created_at) : null;
  const stats = {
    accountAgeDays: created ? Math.max(0, Math.floor((Date.now() - created.getTime()) / 86400000)) : 0,
    xpTotal: Number(prof?.xp_total || 0), xpWeek: Number(prof?.xp_this_week || 0),
    activeDays30: d30.count || 0, activeDays90: d90.count || 0, activeDaysTotal: dAll.count || 0,
    threads: threads.count || 0, replies: replies.count || 0, removals: removed.count || 0, banned: (ban.count || 0) > 0,
    messageWords: String(app.message || '').trim().split(/\s+/).filter(Boolean).length,
  };

  const userText = `APPLICANT DATA
- Account age: ${stats.accountAgeDays} days
- Total XP: ${stats.xpTotal} (this week: ${stats.xpWeek})
- Days active on the site: ${stats.activeDays30} of the last 30, ${stats.activeDays90} of the last 90, ${stats.activeDaysTotal} in total
- Forum: ${stats.threads} threads, ${stats.replies} replies, ${stats.removals} removed by the AI moderator, previously banned: ${stats.banned ? 'yes' : 'no'}
- Recent thread titles: ${(recentPosts.data || []).map((p: any) => `"${p.title}"`).join('; ') || 'none'}
- Recent replies: ${(recentReplies.data || []).map((c: any) => `"${String(c.body).slice(0, 120)}"`).join('; ') || 'none'}

APPLICANT'S MESSAGE
${String(app.message).slice(0, 800)}`;

  const summary = (await askModel(userText)) || fallbackSummary(stats);
  await admin.from('community_mod_applications').update({ ai_summary: summary, ai_summary_at: new Date().toISOString() }).eq('id', id);
  return json(200, { summary, cached: false });
});
