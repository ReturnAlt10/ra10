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
}

// The caller must be the school's owner (or the platform owner).
async function assertSchoolOwner(ctx: Ctx, schoolId: string) {
  const { data } = await ctx.supabase
    .from('profiles')
    .select('email, tier')
    .eq('id', ctx.userId)
    .maybeSingle();

  const email = String(data?.email || '').toLowerCase();
  const tier = String(data?.tier || '').toLowerCase();
  if (email === OWNER_EMAIL) return true;
  if (tier === 'owner' || tier === 'ultra' || tier === 'school_admin') {
    // school_admin must also actually own this school (defence in depth)
    if (!schoolId) return tier === 'owner' || tier === 'ultra';
    const { data: school } = await ctx.supabase
      .from('schools')
      .select('owner_id')
      .eq('id', schoolId)
      .maybeSingle();
    if (!school || !school.owner_id) return tier === 'owner' || tier === 'ultra';
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

  const ctx: Ctx = { supabase, userId: String(userRes.user.id) };

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

  return error({ error: 'Unknown action.' }, 400, headers);
});