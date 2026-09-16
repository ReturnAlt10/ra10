import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const OWNER_EMAIL = 'mistry.hashim@icloud.com';

const ALLOWED_ORIGINS = new Set([
  'https://ra10.co.uk',
  'https://www.ra10.co.uk',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

function corsHeaders(origin: string | null) {
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://ra10.co.uk';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

function error(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), { status, headers });
}

// ────────────────────────────────────────────────────────────────────────────
// Two school-admin actions, previously performed client-side with a hardcoded
// service-role key. Now executed server-side with proper authz:
//   1. activate  — give an existing account school tier/credits/access.
//   2. invite    — invite a new (or reactivated) account and/or activate it.
// ────────────────────────────────────────────────────────────────────────────

interface Ctx {
  supabase: any;
  userId: string;
  userEmail: string;
}

// The caller must be the school's owner (or the platform owner).
// Authorisation is based on the JWT identity (email) and the authorised
// user's tier, never on the client-editable profiles.email column (which a
// logged-in user could otherwise overwrite to impersonate the owner).
async function assertSchoolOwner(ctx: Ctx, schoolId: string) {
  const email = String(ctx.userEmail || '').toLowerCase();
  if (email === OWNER_EMAIL) return true;

  const { data } = await ctx.supabase
    .from('profiles')
    .select('tier')
    .eq('id', ctx.userId)
    .maybeSingle();

  const tier = String(data?.tier || '').toLowerCase();
  if (tier === 'owner' || tier === 'ultra') return true;
  if (tier === 'school_admin') {
    if (!schoolId) return false;
    const { data: school } = await ctx.supabase
      .from('schools')
      .select('owner_id')
      .eq('id', schoolId)
      .maybeSingle();
    if (!school || !school.owner_id) return false;
    if (String(school.owner_id) === String(ctx.userId)) return true;
  }
  return false;
}

async function activateMember(ctx: Ctx, email: string, role: string, schoolId: string, schoolName: string) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedRole = String(role || '').toLowerCase() === 'teacher' ? 'teacher' : 'student';
  const tier = normalizedRole === 'teacher' ? 'school_teacher' : 'school_student';
  const credits = normalizedRole === 'teacher' ? 600 : 300;
  const nextReset = new Date();
  nextReset.setUTCMonth(nextReset.getUTCMonth() + 1);
  const unlockedSubjects = ['IT AAQ', 'Business Level 3', 'Sport Level 3'];

  if (!normalizedEmail) return { ok: false, error: 'Missing email.' };

  const { data: profileRows, error: lookupErr } = await ctx.supabase
    .from('profiles')
    .select('id, email')
    .ilike('email', normalizedEmail)
    .limit(1);

  if (lookupErr) return { ok: false, error: lookupErr.message || 'Profile lookup failed.' };
  if (!Array.isArray(profileRows) || profileRows.length === 0 || !profileRows[0].id) {
    return { ok: false, error: 'No matching profile row found.' };
  }

  const profileId = String(profileRows[0].id);
  const { error: patchErr } = await ctx.supabase
    .from('profiles')
    .update({
      tier,
      credits,
      credits_reset_at: nextReset.toISOString(),
      school_id: schoolId,
      school_name: schoolName,
      unlocked_subjects: unlockedSubjects,
    })
    .eq('id', profileId);

  if (patchErr) return { ok: false, error: patchErr.message || 'Profile activation failed.' };

  await ctx.supabase
    .from('school_members')
    .update({ status: 'active' })
    .eq('school_id', String(schoolId || ''))
    .ilike('email', normalizedEmail)
    .eq('role', normalizedRole);

  return { ok: true, activated: true };
}

// Revert a member's profile to free tier server-side. Client cannot legally
// write tier/credits once the DB privilege-escalation trigger is enabled, so
// removal must go through the service_role here.
async function deactivateMember(ctx: Ctx, email: string) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail) return { ok: false, error: 'Missing email.' };

  const { data: rows, error: lookupErr } = await ctx.supabase
    .from('profiles')
    .select('id')
    .ilike('email', normalizedEmail)
    .limit(1);

  if (lookupErr) return { ok: false, error: lookupErr.message || 'Profile lookup failed.' };
  if (!Array.isArray(rows) || rows.length === 0 || !rows[0].id) {
    return { ok: false, error: 'No matching profile row found.' };
  }

  const { error: patchErr } = await ctx.supabase
    .from('profiles')
    .update({
      tier: 'free',
      credits: 10,
      credits_reset_at: new Date().toISOString(),
      school_id: null,
      school_name: null,
      unlocked_subjects: [],
      unlimited_credits: false,
    })
    .eq('id', String(rows[0].id));

  if (patchErr) return { ok: false, error: patchErr.message || 'Profile deactivation failed.' };
  return { ok: true, deactivated: true };
}

// Sync an active member's unlocked_subjects on their profile (server-side).
async function setMemberSubjects(ctx: Ctx, email: string, subjects: string[]) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail) return { ok: false, error: 'Missing email.' };

  const clean = (Array.isArray(subjects) ? subjects : [])
    .map((s) => String(s || '').trim())
    .filter(Boolean);

  const { data: rows, error: lookupErr } = await ctx.supabase
    .from('profiles')
    .select('id')
    .ilike('email', normalizedEmail)
    .limit(1);

  if (lookupErr) return { ok: false, error: lookupErr.message || 'Profile lookup failed.' };
  if (!Array.isArray(rows) || rows.length === 0 || !rows[0].id) {
    return { ok: false, error: 'No matching profile row found.' };
  }

  const { error: patchErr } = await ctx.supabase
    .from('profiles')
    .update({ unlocked_subjects: clean })
    .eq('id', String(rows[0].id));

  if (patchErr) return { ok: false, error: patchErr.message || 'Subject update failed.' };
  return { ok: true };
}

async function inviteMember(ctx: Ctx, email: string, role: string, schoolId: string, schoolName: string) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail) return { ok: false, error: 'Missing email.' };

  // Already has an account? Activate instead of emailing.
  const { data: existing } = await ctx.supabase
    .from('profiles')
    .select('id')
    .ilike('email', normalizedEmail)
    .limit(1);

  if (Array.isArray(existing) && existing.length > 0) {
    const activated = await activateMember(ctx, normalizedEmail, role, schoolId, schoolName);
    if (activated.ok) return { ok: true, skipped: true, activated: true };
    return { ok: true, skipped: true, activationError: activated.error || '' };
  }

  // Send the invite email.
  const inviteRes = await ctx.supabase.auth.admin.inviteUserByEmail(normalizedEmail, {
    data: { role, school_id: schoolId, school_name: schoolName },
    redirectTo: 'https://ra10.co.uk/#/account',
  });

  if (inviteRes && !inviteRes.error && inviteRes.data?.user) {
    return { ok: true };
  }

  // Supabase may rate-limit invite emails; fall back to a shareable one-time link.
  const errMsg = String(inviteRes?.error?.message || '');
  if (/rate.?limit/i.test(errMsg)) {
    try {
      const genRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/generate_link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_SERVICE_ROLE_KEY,
        },
        body: JSON.stringify({
          type: 'invite',
          email: normalizedEmail,
          data: { role, school_id: schoolId, school_name: schoolName },
          redirect_to: 'https://ra10.co.uk/#/account',
        }),
      });
      if (genRes.ok) {
        const linkBody = await genRes.json();
        const url = linkBody.action_link || linkBody.hashed_token;
        if (url) return { ok: true, link: url };
      }
    } catch (_) { /* ignore */ }
    return { ok: false, error: 'rate_limited' };
  }

  return { ok: false, error: errMsg || 'Invite failed.' };
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);

  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') {
    return error({ error: 'Method not allowed' }, 405, headers);
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return error({ error: 'Server not configured' }, 500, headers);
  }

  const auth = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
  if (!token) return error({ error: 'Missing bearer token' }, 401, headers);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: userRes, error: userErr } = await supabase.auth.getUser(token);
  if (userErr || !userRes?.user?.id) {
    return error({ error: 'Invalid auth token' }, 401, headers);
  }

  const ctx: Ctx = {
    supabase,
    userId: String(userRes.user.id),
    userEmail: String(userRes.user.email || userRes.user.user_metadata?.email || ''),
  };

  let body: any = null;
  try { body = await req.json(); } catch { body = null; }

  const action = String((body && body.action) || '').trim().toLowerCase();
  const email = String((body && body.email) || '').trim();
  const role = String((body && body.role) || 'student').trim();
  const schoolId = String((body && body.schoolId) || '');
  const schoolName = String((body && body.schoolName) || 'Your School');

  if (!schoolId) return error({ error: 'Missing school id.' }, 400, headers);

  const allowed = await assertSchoolOwner(ctx, schoolId);
  if (!allowed) {
    return error({ error: 'Forbidden: school admin access required' }, 403, headers);
  }

  if (action === 'activate') {
    return new Response(JSON.stringify(await activateMember(ctx, email, role, schoolId, schoolName)), { headers });
  }
  if (action === 'invite') {
    return new Response(JSON.stringify(await inviteMember(ctx, email, role, schoolId, schoolName)), { headers });
  }
  if (action === 'deactivate') {
    return new Response(JSON.stringify(await deactivateMember(ctx, email)), { headers });
  }
  if (action === 'set-subjects') {
    const subjects = Array.isArray(body && body.subjects) ? body.subjects : [];
    return new Response(JSON.stringify(await setMemberSubjects(ctx, email, subjects)), { headers });
  }

  return error({ error: 'Unknown action.' }, 400, headers);
});