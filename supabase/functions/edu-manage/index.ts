import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { askJson, hasProviders } from '../_shared/ai.ts';

// ────────────────────────────────────────────────────────────────────────────
// RA10 EDU — server actions for schools. Every action is authorised from the
// caller's JWT (never from client-supplied roles):
//   scan-school      AI reads the school website → logo + subjects offered + RA10 matches
//   invite           add a student / teacher (new account: invite email; existing
//                    account: "accept the invitation" email + popup on the site)
//   remove-member    take someone out of the school (reverts their plan)
//   analyse-student  AI analysis of one learner's progress (teachers / admins)
//   analyse-class    AI overview of a whole class
//   activate / deactivate / set-subjects   legacy actions used by /admin
// Optional secrets: RESEND_API_KEY (+ EDU_FROM_EMAIL) for branded emails.
// ────────────────────────────────────────────────────────────────────────────

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
const RESEND_KEY = Deno.env.get('RESEND_API_KEY') || '';
const FROM_EMAIL = Deno.env.get('EDU_FROM_EMAIL') || 'RA10 Schools <schools@ra10.co.uk>';
const SITE = (Deno.env.get('SITE_URL') || 'https://ra10.co.uk').replace(/\/$/, '');
const OWNER_EMAIL = 'mistry.hashim@icloud.com';
const OWNER_EMAILS = ['mistry.hashim@icloud.com', 'faiz.mistry@gmail.com'];

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
const clean = (s: unknown, max = 200) => String(s ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
const escHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

interface Ctx { admin: any; user: any; userId: string; email: string; tier: string; name: string }

async function rpcBool(ctx: Ctx, fn: string, args: Record<string, unknown>) {
  const { data, error } = await ctx.user.rpc(fn, args);
  return !error && data === true;
}
const isOwner = (ctx: Ctx) => OWNER_EMAILS.includes(ctx.email) || ctx.tier === 'owner';
const isSchoolAdmin = (ctx: Ctx, school: string) => isOwner(ctx) || rpcBool(ctx, 'edu_is_school_admin', { p_school: school });
const isSchoolStaff = (ctx: Ctx, school: string) => isOwner(ctx) || rpcBool(ctx, 'edu_is_school_staff', { p_school: school });

async function schoolRow(ctx: Ctx, school: string) {
  const { data } = await ctx.admin.from('schools').select('*').eq('id', school).maybeSingle();
  return data;
}

/* ───────────────────────────── email ───────────────────────────── */
async function sendEmail(to: string, subject: string, html: string, text: string) {
  if (!RESEND_KEY) return { sent: false, reason: 'no_email_provider' };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html, text }),
    });
    if (!res.ok) return { sent: false, reason: 'provider_error:' + res.status };
    return { sent: true };
  } catch (e) {
    return { sent: false, reason: String(e) };
  }
}

function inviteEmail(opts: { school: string; logo?: string; inviter: string; role: string; classes: string[]; link: string; existing: boolean }) {
  const where = opts.classes.length ? `${opts.classes.join(', ')}` : opts.school;
  const subject = opts.existing
    ? `${opts.inviter} added you to ${where} on RA10 — accept your invitation`
    : `${opts.inviter} at ${opts.school} has added you to ${where} on RA10`;
  const action = opts.existing ? 'Accept invitation' : 'Create your account';
  const lead = opts.existing
    ? `You already have an RA10 account. Accept the invitation to join <b>${escHtml(opts.school)}</b>${opts.classes.length ? ` and your class${opts.classes.length > 1 ? 'es' : ''} <b>${escHtml(where)}</b>` : ''}. You'll also see the invitation the next time you open ra10.co.uk.`
    : `${escHtml(opts.inviter)} has added you to <b>${escHtml(where)}</b> at <b>${escHtml(opts.school)}</b> as a ${opts.role}. Create your free RA10 account to see your classes and assignments.`;
  const html = `<!doctype html><html><body style="margin:0;background:#f4f5f8;font-family:Arial,Helvetica,sans-serif;color:#14161c">
  <div style="max-width:520px;margin:0 auto;padding:28px 16px">
    <div style="background:#fff;border-radius:18px;padding:28px;border:1px solid #e4e6ee">
      ${opts.logo ? `<img src="${escHtml(opts.logo)}" alt="" style="height:44px;max-width:180px;object-fit:contain;margin-bottom:14px">` : ''}
      <h1 style="margin:0 0 10px;font-size:22px;line-height:1.3">${opts.existing ? 'You have a school invitation' : `Welcome to ${escHtml(opts.school)} on RA10`}</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#3b4150">${lead}</p>
      <a href="${escHtml(opts.link)}" style="display:inline-block;background:#e11d48;color:#fff;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:12px">${action}</a>
      <p style="margin:22px 0 0;font-size:12px;color:#7a8091;line-height:1.5">If you weren't expecting this, you can ignore this email. RA10 · revision for BTEC, AAQ and A-Level.</p>
    </div>
  </div></body></html>`;
  const text = `${subject}\n\n${lead.replace(/<[^>]+>/g, '')}\n\n${action}: ${opts.link}`;
  return { subject, html, text };
}

/* ───────────────────────────── invite ───────────────────────────── */
async function invite(ctx: Ctx, body: any) {
  const school = clean(body.schoolId, 80);
  const email = clean(body.email, 200).toLowerCase();
  const role = String(body.role || 'student').toLowerCase() === 'teacher' ? 'teacher' : 'student';
  const classIds: string[] = (Array.isArray(body.classIds) ? body.classIds : []).map((x: unknown) => clean(x, 60)).filter(Boolean).slice(0, 20);
  const displayName = clean(body.name, 80) || null;
  if (!school || !isEmail(email)) return { ok: false, error: 'Enter a valid email address.' };
  if (role === 'teacher' ? !(await isSchoolAdmin(ctx, school)) : !(await isSchoolStaff(ctx, school))) {
    return { ok: false, error: role === 'teacher' ? 'Only the EDU admin can add staff.' : 'Only staff can add students.' };
  }
  const s = await schoolRow(ctx, school);
  if (!s) return { ok: false, error: 'School not found.' };

  // Class names (only classes in this school)
  let classes: { id: string; name: string }[] = [];
  if (classIds.length) {
    const { data } = await ctx.admin.from('edu_classes').select('id, name').eq('school_id', school).in('id', classIds);
    classes = data || [];
  }

  // Look for an existing account
  const { data: prof } = await ctx.admin.from('profiles').select('id, school_id').ilike('email', email).limit(1).maybeSingle();
  const existing = !!prof?.id;
  const sameSchool = existing && String(prof.school_id || '') === school;

  // Membership row (school level)
  const { data: prior } = await ctx.admin.from('school_members').select('id, status, role').eq('school_id', school).ilike('email', email).order('id', { ascending: false }).limit(1).maybeSingle();
  const status = sameSchool && prior?.status === 'active' ? 'active' : 'invited';
  const row = { school_id: school, email, role, status, display_name: displayName, invited_by: ctx.userId, invited_at: new Date().toISOString() };
  const memRes = prior?.id
    ? await ctx.admin.from('school_members').update(row).eq('id', prior.id)
    : await ctx.admin.from('school_members').insert(row);
  if (memRes.error) return { ok: false, error: memRes.error.message };

  // Class places
  for (const c of classes) {
    await ctx.admin.from('edu_class_members').upsert({ class_id: c.id, email, role, status, user_id: prof?.id || null, added_by: ctx.userId }, { onConflict: 'class_id,email' });
  }
  if (status === 'active') return { ok: true, status, emailed: false, note: 'Already a member — added to the class.' };

  const meta = { school_id: String(s.id), school_name: s.name, invited_role: role, class_names: classes.map((c) => c.name).join(', '), inviter_name: ctx.name };
  const inviter = ctx.name || s.name;

  if (!existing) {
    // Brand-new account: Supabase invite link (lands on /school/ after setting a password)
    const redirectTo = `${SITE}/school/?welcome=1`;
    if (RESEND_KEY) {
      const gen = await ctx.admin.auth.admin.generateLink({ type: 'invite', email, options: { data: meta, redirectTo } });
      const link = gen?.data?.properties?.action_link;
      if (link) {
        const m = inviteEmail({ school: s.name, logo: s.logo_url, inviter, role, classes: classes.map((c) => c.name), link, existing: false });
        const sent = await sendEmail(email, m.subject, m.html, m.text);
        if (sent.sent) return { ok: true, status, emailed: true, newAccount: true };
      }
    }
    const inv = await ctx.admin.auth.admin.inviteUserByEmail(email, { data: meta, redirectTo });
    if (!inv.error) return { ok: true, status, emailed: true, newAccount: true };
    if (/rate.?limit/i.test(String(inv.error.message))) {
      const gen = await ctx.admin.auth.admin.generateLink({ type: 'invite', email, options: { data: meta, redirectTo } });
      const link = gen?.data?.properties?.action_link;
      if (link) return { ok: true, status, emailed: false, newAccount: true, link, note: 'Email limit reached — share this sign-up link instead.' };
    }
    return { ok: true, status, emailed: false, newAccount: true, note: 'Invite saved, but the email failed: ' + inv.error.message };
  }

  // Existing account: "accept your invitation" email + popup on the website
  const link = `${SITE}/school/?invite=${encodeURIComponent(String(s.id))}`;
  const m = inviteEmail({ school: s.name, logo: s.logo_url, inviter, role, classes: classes.map((c) => c.name), link, existing: true });
  const sent = await sendEmail(email, m.subject, m.html, m.text);
  return { ok: true, status, emailed: sent.sent, existingAccount: true, note: sent.sent ? '' : 'They will see the invitation the next time they open RA10.' };
}

async function removeMember(ctx: Ctx, body: any) {
  const school = clean(body.schoolId, 80);
  const email = clean(body.email, 200).toLowerCase();
  if (!school || !email) return { ok: false, error: 'Missing details.' };
  if (!(await isSchoolAdmin(ctx, school))) return { ok: false, error: 'Only the EDU admin can remove people.' };
  if (email === ctx.email) return { ok: false, error: 'You cannot remove yourself.' };
  await ctx.admin.from('school_members').update({ status: 'removed' }).eq('school_id', school).ilike('email', email);
  const { data: cls } = await ctx.admin.from('edu_classes').select('id').eq('school_id', school);
  const ids = (cls || []).map((c: any) => c.id);
  if (ids.length) await ctx.admin.from('edu_class_members').delete().in('class_id', ids).ilike('email', email);
  const { data: prof } = await ctx.admin.from('profiles').select('id, school_id, tier').ilike('email', email).limit(1).maybeSingle();
  if (prof?.id && String(prof.school_id || '') === school && /^school_(student|teacher)$/.test(String(prof.tier || ''))) {
    await ctx.admin.from('profiles').update({ tier: 'free', school_id: null, school_name: null, unlocked_subjects: [] }).eq('id', prof.id);
  }
  return { ok: true };
}

/* ───────────────────────────── school website scan ───────────────────────────── */
function safeUrl(raw: string): URL | null {
  let s = clean(raw, 300);
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  try {
    const u = new URL(s);
    if (!/^https?:$/.test(u.protocol) || (u.port && !['80', '443'].includes(u.port))) return null;
    const h = u.hostname.toLowerCase();
    if (h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal') || !h.includes('.')) return null;
    if (/^(\d+\.){3}\d+$/.test(h) || h.includes(':')) return null;   // no raw IPs
    return u;
  } catch { return null; }
}

async function fetchText(u: URL, ms = 8000): Promise<string> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    const res = await fetch(u.toString(), { headers: { 'User-Agent': 'RA10-SchoolSetup/1.0 (+https://ra10.co.uk)', 'Accept': 'text/html' }, redirect: 'follow', signal: ctl.signal });
    if (!res.ok) return '';
    const type = res.headers.get('content-type') || '';
    if (!/html|text/i.test(type)) return '';
    const buf = await res.arrayBuffer();
    return new TextDecoder().decode(buf.slice(0, 1_500_000));
  } catch { return ''; } finally { clearTimeout(t); }
}

function pageText(html: string, max: number) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim().slice(0, max);
}
function attr(tag: string, name: string) {
  const m = tag.match(new RegExp(name + '\\s*=\\s*["\']([^"\']+)["\']', 'i'));
  return m ? m[1] : '';
}

function findLogos(html: string, base: URL) {
  const out: { url: string; kind: string; score: number }[] = [];
  const add = (src: string, kind: string, score: number) => {
    if (!src || /^data:/i.test(src)) return;
    try { const u = new URL(src, base); if (/^https?:$/.test(u.protocol)) out.push({ url: u.toString(), kind, score }); } catch { /* ignore */ }
  };
  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    const blob = (attr(tag, 'src') + ' ' + attr(tag, 'alt') + ' ' + attr(tag, 'class') + ' ' + attr(tag, 'id')).toLowerCase();
    if (/logo|crest|badge|emblem/.test(blob)) add(attr(tag, 'src') || attr(tag, 'data-src'), 'logo', /\.svg/i.test(attr(tag, 'src')) ? 10 : 9);
  }
  for (const tag of html.match(/<link\b[^>]*>/gi) || []) {
    const rel = attr(tag, 'rel').toLowerCase();
    if (/apple-touch-icon/.test(rel)) add(attr(tag, 'href'), 'icon', 6);
    else if (/\bicon\b/.test(rel)) add(attr(tag, 'href'), 'icon', /\.svg/i.test(attr(tag, 'href')) ? 5 : 3);
  }
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    if (/og:image|twitter:image/i.test(attr(tag, 'property') + attr(tag, 'name'))) add(attr(tag, 'content'), 'social', 4);
  }
  add(`https://www.google.com/s2/favicons?domain=${base.hostname}&sz=128`, 'favicon', 1);
  const seen = new Set<string>();
  return out.filter((x) => (seen.has(x.url) ? false : (seen.add(x.url), true))).sort((a, b) => b.score - a.score).slice(0, 6);
}

const SUBJECT_WORDS = ['Accounting', 'Art', 'Biology', 'Business', 'Chemistry', 'Computer Science', 'Computing', 'Design and Technology', 'Drama', 'Economics', 'Engineering', 'English Language', 'English Literature', 'English', 'Film Studies', 'French', 'Further Mathematics', 'Geography', 'German', 'Health and Social Care', 'History', 'Information Technology', 'Law', 'Mathematics', 'Maths', 'Media Studies', 'Music', 'Philosophy', 'Physical Education', 'Physics', 'Politics', 'Psychology', 'Religious Studies', 'Sociology', 'Spanish', 'Sport', 'Applied Science', 'Criminology', 'Photography', 'Travel and Tourism', 'Cyber Security'];

function keywordMatches(text: string, catalog: any[]) {
  const t = text.toLowerCase();
  const subjects = SUBJECT_WORDS.filter((w) => t.includes(w.toLowerCase()));
  const matches = catalog.filter((c) => (c.keywords || []).some((k: string) => t.includes(String(k).toLowerCase())))
    .map((c) => ({ path: c.path, confidence: 'medium', reason: 'The website mentions ' + (c.keywords || []).find((k: string) => t.includes(String(k).toLowerCase())) }));
  return { subjects, matches };
}

async function scanSchool(ctx: Ctx, body: any) {
  if (!['school_admin', 'owner', 'ultra'].includes(ctx.tier) && !isOwner(ctx)) return { ok: false, error: 'EDU admin plan required.' };
  const base = safeUrl(body.website);
  if (!base) return { ok: false, error: 'Enter the school website, e.g. www.yourschool.org.uk' };
  const catalog = (Array.isArray(body.catalog) ? body.catalog : []).slice(0, 60).map((c: any) => ({ path: clean(c.path, 120), name: clean(c.name, 120), subject: clean(c.subject, 60), qualification: clean(c.qualification, 80), keywords: (Array.isArray(c.keywords) ? c.keywords : []).map((k: unknown) => clean(k, 40)).slice(0, 12) }));

  const home = await fetchText(base);
  if (!home) return { ok: false, error: 'We could not open that website. Check the address, or skip this step and pick subjects yourself.' };
  const logos = findLogos(home, base);
  const titleTag = (home.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '';
  const ogName = attr((home.match(/<meta[^>]+og:site_name[^>]*>/i) || [''])[0], 'content');

  // Follow a few curriculum / subjects / sixth-form links on the same site
  const links: URL[] = [];
  for (const tag of home.match(/<a\b[^>]*href=["'][^"']+["'][^>]*>[\s\S]{0,120}?<\/a>/gi) || []) {
    const href = attr(tag, 'href');
    const label = pageText(tag, 120).toLowerCase();
    if (!/curriculum|subject|sixth[\s-]?form|courses?|post[\s-]?16|key[\s-]?stage|ks4|ks5|options|qualifications|btec|a[\s-]?level|gcse/.test(href.toLowerCase() + ' ' + label)) continue;
    try {
      const u = new URL(href, base);
      if (u.hostname.replace(/^www\./, '') !== base.hostname.replace(/^www\./, '')) continue;
      if (!links.some((x) => x.href === u.href)) links.push(u);
    } catch { /* ignore */ }
    if (links.length >= 5) break;
  }
  const pages = await Promise.all(links.slice(0, 5).map((u) => fetchText(u, 7000)));
  const text = [pageText(home, 7000), ...pages.map((h, i) => (h ? `\n[${links[i].pathname}] ` + pageText(h, 3500) : ''))].join(' ').slice(0, 22000);

  let result: any = null;
  let provider = 'keywords';
  if (hasProviders()) {
    try {
      const sys = 'You help UK schools set up RA10, a revision website. Read the text scraped from a school website and reply with JSON only.';
      const user = `School website: ${base.toString()}
Page title: ${clean(titleTag, 200)}
Scraped text (homepage + curriculum pages):
"""${text}"""

RA10 courses available (match against these only, by path):
${JSON.stringify(catalog)}

Return JSON:
{
 "school_name": "the school's proper name",
 "phase": "e.g. 11-18 secondary with sixth form / sixth form college / FE college",
 "subjects": ["every subject the school says it teaches, short names, max 40"],
 "qualifications": ["GCSE", "A-Level", "BTEC", ...],
 "matches": [{"path": "<RA10 path>", "confidence": "high|medium|low", "reason": "one short sentence quoting what on the site suggests it"}],
 "summary": "one sentence about the school"
}
Only include an RA10 match when the website gives evidence the school teaches that subject at a suitable level (e.g. BTEC IT, A-Level Business, BTEC Sport). If unsure use confidence "low".`;
      const r = await askJson(sys, user, 30000);
      result = r.json; provider = r.provider;
    } catch (e) {
      console.warn('scan-school AI failed', e);
    }
  }
  const kw = keywordMatches(text, catalog);
  if (!result) result = { school_name: clean(ogName || titleTag.split(/[|\-–]/)[0], 120), subjects: kw.subjects, matches: kw.matches, qualifications: [], summary: '' };
  const validPaths = new Set(catalog.map((c: any) => c.path));
  result.matches = (Array.isArray(result.matches) ? result.matches : []).filter((m: any) => m && validPaths.has(m.path)).slice(0, 20);
  result.subjects = (Array.isArray(result.subjects) ? result.subjects : []).map((s: unknown) => clean(s, 60)).filter(Boolean).slice(0, 40);
  return { ok: true, website: base.origin, logos, provider, pagesRead: 1 + pages.filter(Boolean).length, ...result };
}

/* ───────────────────────────── AI progress analysis ───────────────────────────── */
async function analyseStudent(ctx: Ctx, body: any) {
  const student = clean(body.studentId, 60);
  const days = Math.max(7, Math.min(120, Number(body.days) || 30));
  if (!student) return { ok: false, error: 'Missing student.' };
  if (!(await rpcBool(ctx, 'edu_can_view_student', { p_student: student })) || student === ctx.userId) return { ok: false, error: 'You can only analyse students in your classes.' };

  const [{ data: summary, error: sErr }, { data: events }, { data: subs }] = await Promise.all([
    ctx.user.rpc('edu_student_summary', { p_student: student, p_days: days }),
    ctx.user.from('activity_events').select('created_at, kind, unit, view, ref, title, answer, score, max_score, meta').eq('user_id', student).neq('kind', 'page_view').order('created_at', { ascending: false }).limit(160),
    ctx.admin.from('edu_submissions').select('assignment_id, item_type, question_text, answer, score, max_score, done, updated_at').eq('user_id', student).order('updated_at', { ascending: false }).limit(60),
  ]);
  if (sErr) return { ok: false, error: sErr.message };

  const compact = (events || []).map((e: any) => ({
    t: String(e.created_at).slice(0, 16), k: e.kind, u: (e.unit || '').replace('/revision/', ''), v: e.view || undefined,
    q: e.title ? clean(e.title, 160) : undefined, a: e.answer ? clean(e.answer, 220) : undefined,
    s: e.max_score ? `${e.score}/${e.max_score}` : undefined, topic: e.meta?.topic || e.meta?.aim || undefined,
  }));
  const fallback = () => {
    const t = summary?.totals || {};
    return {
      headline: `${t.active_days || 0} active days, ${t.questions || 0} written answers and ${t.mcqs || 0} quiz answers in the last ${days} days.`,
      summary: t.avg_pct != null ? `Average marked score ${t.avg_pct}%.` : 'Not enough marked work yet to judge attainment.',
      strengths: [], concerns: (summary?.weak || []).map((w: any) => `${w.topic || w.unit}: ${w.avg_pct}% over ${w.n} answers`),
      topics: [], engagement: { level: (t.active_days || 0) >= 8 ? 'high' : (t.active_days || 0) >= 3 ? 'medium' : 'low', note: '' },
      recommendations: [], teacher_actions: [], risk: (t.active_days || 0) < 2 ? 'high' : 'medium',
    };
  };
  let report: any = null, provider = 'rules';
  if (hasProviders() && compact.length) {
    try {
      const sys = 'You are an experienced UK BTEC / A-Level teacher and data analyst. You analyse a student\'s revision activity on RA10 and write a precise, evidence-based progress report for their teacher. Reply with JSON only. Never invent data that is not in the log.';
      const user = `Student activity for the last ${days} days.
Summary stats: ${JSON.stringify(summary)}
Assignment submissions: ${JSON.stringify((subs || []).map((s: any) => ({ type: s.item_type, q: clean(s.question_text, 140), a: clean(s.answer, 200), s: s.max_score ? `${s.score}/${s.max_score}` : null, done: s.done })))}
Event log (newest first; k=kind, u=unit, q=question/section, a=what they wrote/chose, s=score): ${JSON.stringify(compact)}

Return JSON:
{
 "headline": "one sentence verdict",
 "summary": "3-4 sentences on attainment and effort, quoting numbers",
 "strengths": ["specific, evidence-based"],
 "concerns": ["specific misconceptions or gaps, quoting what they wrote where useful"],
 "topics": [{"topic": "", "unit": "", "status": "secure|developing|weak", "evidence": ""}],
 "exam_technique": "how well they use command words, structure and application, from their written answers",
 "engagement": {"level": "high|medium|low", "note": "patterns: days, time, consistency"},
 "recommendations": [{"title": "", "why": "", "type": "guide|questions|quiz|paper|flashcards", "unit": "unit path if known"}],
 "teacher_actions": ["concrete next steps for the teacher"],
 "risk": "low|medium|high"
}`;
      const r = await askJson(sys, user, 40000);
      report = r.json; provider = r.provider;
    } catch (e) {
      console.warn('analyse-student AI failed', e);
    }
  }
  if (!report) report = fallback();
  report.generated_at = new Date().toISOString();
  report.provider = provider;
  report.days = days;
  await ctx.admin.from('edu_ai_reports').insert({ student_id: student, class_id: body.classId || null, author_id: ctx.userId, report });
  return { ok: true, report, summary };
}

async function analyseClass(ctx: Ctx, body: any) {
  const classId = clean(body.classId, 60);
  if (!classId || !(await rpcBool(ctx, 'edu_teaches_class', { p_class: classId }))) return { ok: false, error: 'You do not teach this class.' };
  const { data: roster } = await ctx.user.rpc('edu_class_roster', { p_class: classId });
  const students = (roster || []).filter((r: any) => r.role === 'student' && r.user_id);
  const rows = [];
  for (const s of students.slice(0, 40)) {
    const { data } = await ctx.user.rpc('edu_student_summary', { p_student: s.user_id, p_days: 30 });
    rows.push({ name: s.display_name || s.email, totals: data?.totals, weak: data?.weak, by_unit: data?.by_unit });
  }
  let report: any = null, provider = 'rules';
  if (hasProviders() && rows.length) {
    try {
      const r = await askJson('You are a UK head of department analysing class revision data from RA10. Reply with JSON only and base every claim on the data.',
        `Class data (last 30 days): ${JSON.stringify(rows)}
Return JSON: {"headline":"","summary":"","top_performers":[""],"needs_support":[{"name":"","why":""}],"common_gaps":[{"topic":"","evidence":""}],"engagement":"","teacher_actions":[""]}`, 40000);
      report = r.json; provider = r.provider;
    } catch (e) { console.warn('analyse-class AI failed', e); }
  }
  if (!report) {
    const active = rows.filter((r) => (r.totals?.active_days || 0) > 0).length;
    report = { headline: `${active} of ${rows.length} students revised on RA10 in the last 30 days.`, summary: '', top_performers: [], needs_support: rows.filter((r) => !(r.totals?.active_days)).map((r) => ({ name: r.name, why: 'No activity in 30 days' })), common_gaps: [], engagement: '', teacher_actions: [] };
  }
  report.generated_at = new Date().toISOString();
  report.provider = provider;
  return { ok: true, report };
}

/* ───────────────────────────── legacy (/admin) ───────────────────────────── */
async function legacy(ctx: Ctx, action: string, body: any) {
  const school = clean(body.schoolId, 80);
  if (!school || !(await isSchoolAdmin(ctx, school))) return { ok: false, error: 'Forbidden: school admin access required' };
  const email = clean(body.email, 200).toLowerCase();
  const { data: rows } = await ctx.admin.from('profiles').select('id').ilike('email', email).limit(1);
  const id = Array.isArray(rows) && rows[0] ? String(rows[0].id) : '';
  if (action === 'invite') return invite(ctx, body);
  if (!id) return { ok: false, error: 'No matching profile row found.' };
  if (action === 'activate') {
    const role = String(body.role || '').toLowerCase() === 'teacher' ? 'teacher' : 'student';
    const s = await schoolRow(ctx, school);
    await ctx.admin.from('profiles').update({ tier: role === 'teacher' ? 'school_teacher' : 'school_student', school_id: school, school_name: s?.name || body.schoolName || null, unlocked_subjects: ['IT AAQ', 'Business Level 3', 'Sport Level 3'] }).eq('id', id);
    await ctx.admin.from('school_members').update({ status: 'active', user_id: id }).eq('school_id', school).ilike('email', email);
    return { ok: true, activated: true };
  }
  if (action === 'deactivate') {
    await ctx.admin.from('profiles').update({ tier: 'free', school_id: null, school_name: null, unlocked_subjects: [], unlimited_credits: false }).eq('id', id);
    return { ok: true, deactivated: true };
  }
  if (action === 'set-subjects') {
    const subjects = (Array.isArray(body.subjects) ? body.subjects : []).map((x: unknown) => clean(x, 60)).filter(Boolean);
    await ctx.admin.from('profiles').update({ unlocked_subjects: subjects }).eq('id', id);
    return { ok: true };
  }
  return { ok: false, error: 'Unknown action.' };
}

/* ───────────────────────────── entry ───────────────────────────── */
serve(async (req) => {
  const headers = cors(req.headers.get('origin'));
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, headers, 405);
  if (!SUPABASE_URL || !SERVICE_KEY || !ANON_KEY) return json({ error: 'Server not configured' }, headers, 500);

  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return json({ error: 'Missing bearer token' }, headers, 401);

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  const { data: u, error: uErr } = await admin.auth.getUser(token);
  if (uErr || !u?.user?.id) return json({ error: 'Invalid auth token' }, headers, 401);
  const user = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false }, global: { headers: { Authorization: `Bearer ${token}` } } });
  const { data: prof } = await admin.from('profiles').select('tier, display_name').eq('id', u.user.id).maybeSingle();
  const ctx: Ctx = {
    admin, user, userId: u.user.id,
    email: String(u.user.email || '').toLowerCase(),
    tier: String(prof?.tier || '').toLowerCase(),
    name: clean(prof?.display_name || u.user.user_metadata?.full_name || '', 80),
  };

  let body: any = {};
  try { body = await req.json(); } catch { body = {}; }
  const action = String(body?.action || '').trim().toLowerCase();
  try {
    if (action === 'scan-school') return json(await scanSchool(ctx, body), headers);
    if (action === 'invite' && Array.isArray(body.classIds)) return json(await invite(ctx, body), headers);
    if (action === 'invite-many') {
      const rows = (Array.isArray(body.rows) ? body.rows : []).slice(0, 200);
      const results = [];
      for (const r of rows) results.push({ email: r.email, ...(await invite(ctx, { ...body, email: r.email, name: r.name, role: r.role || body.role })) });
      return json({ ok: true, results }, headers);
    }
    if (action === 'remove-member') return json(await removeMember(ctx, body), headers);
    if (action === 'analyse-student') return json(await analyseStudent(ctx, body), headers);
    if (action === 'analyse-class') return json(await analyseClass(ctx, body), headers);
    if (['activate', 'invite', 'deactivate', 'set-subjects'].includes(action)) return json(await legacy(ctx, action, body), headers);
    return json({ error: 'Unknown action.' }, headers, 400);
  } catch (e) {
    console.error('edu-manage', action, e);
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, headers, 500);
  }
});
