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

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function reasonLabel(code: string) {
  const key = String(code || '').toLowerCase();
  if (key === 'policy_violation') return 'Policy violation';
  if (key === 'offensive_image') return 'Offensive or inappropriate image';
  if (key === 'copyright_issue') return 'Copyright issue';
  if (key === 'impersonation') return 'Impersonation';
  return 'Owner moderation';
}

async function hasOwnerAccess(supabase: any, requesterId: string, authEmail: string) {
  const email = String(authEmail || '').toLowerCase();
  if (email === OWNER_EMAIL) return true;

  const { data } = await supabase
    .from('profiles')
    .select('email, tier')
    .eq('id', requesterId)
    .maybeSingle();

  const profileEmail = String(data?.email || '').toLowerCase();
  const profileTier = String(data?.tier || '').toLowerCase();
  if (profileEmail === OWNER_EMAIL) return true;
  if (profileTier === 'owner' || profileTier === 'ultra') return true;
  return false;
}

async function clearProfilePicture(supabase: any, userId: string) {
  const columns = ['profile_pic_url', 'profile_picture_url', 'profile_image_url', 'avatar_url', 'image_url'];
  let missingColumns = 0;

  for (const column of columns) {
    const payload: Record<string, null> = {};
    payload[column] = null;
    const { error } = await supabase.from('profiles').update(payload).eq('id', userId);
    if (!error) return { column };
    const msg = String(error.message || '');
    if (/column .* does not exist/i.test(msg)) {
      missingColumns += 1;
      continue;
    }
    throw error;
  }

  if (missingColumns === columns.length) {
    throw new Error('Profile picture column is not configured. Add profile_pic_url to profiles.');
  }

  throw new Error('Could not remove profile picture.');
}

async function clearUserAvatarFiles(supabase: any, userId: string) {
  const bucketName = 'profile-pics';
  const prefix = userId + '/';
  const listed = await supabase.storage.from(bucketName).list(prefix, {
    limit: 100,
    offset: 0,
  });
  if (listed.error || !Array.isArray(listed.data)) return;
  const files = listed.data
    .map((item: any) => String(item?.name || '').trim())
    .filter((name: string) => !!name)
    .map((name: string) => prefix + name);
  if (!files.length) return;
  await supabase.storage.from(bucketName).remove(files);
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Server not configured' }), { status: 500, headers });
  }

  const auth = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing bearer token' }), { status: 401, headers });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data: userRes, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userRes?.user?.id) {
      return new Response(JSON.stringify({ error: 'Invalid auth token' }), { status: 401, headers });
    }

    const requesterId = String(userRes.user.id || '');
    const requesterEmail = String(userRes.user.email || '').toLowerCase();
    const allowed = await hasOwnerAccess(supabase, requesterId, requesterEmail);
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Forbidden: owner access required' }), { status: 403, headers });
    }

    let body: any = null;
    try {
      body = await req.json();
    } catch {
      body = null;
    }

    const targetRaw = String((body && body.target) || '').trim();
    const reasonCode = String((body && body.reason_code) || 'policy_violation').trim().slice(0, 64) || 'policy_violation';
    const reasonMessageRaw = String((body && body.reason_message) || '').trim();
    const reasonMessage = (reasonMessageRaw || reasonLabel(reasonCode)).slice(0, 240);
    if (!targetRaw) {
      return new Response(JSON.stringify({ error: 'Missing target (username, email, or user id).' }), { status: 400, headers });
    }

    let targetRow: any = null;

    if (isUuid(targetRaw)) {
      const byId = await supabase
        .from('profiles')
        .select('id, username, email')
        .eq('id', targetRaw)
        .maybeSingle();
      if (!byId.error && byId.data) targetRow = byId.data;
    }

    if (!targetRow && targetRaw.includes('@')) {
      const byEmail = await supabase
        .from('profiles')
        .select('id, username, email')
        .ilike('email', targetRaw)
        .maybeSingle();
      if (!byEmail.error && byEmail.data) targetRow = byEmail.data;
    }

    if (!targetRow) {
      const normalized = targetRaw.replace(/^@+/, '').toLowerCase();
      const byUsername = await supabase
        .from('profiles')
        .select('id, username, email')
        .eq('username', normalized)
        .maybeSingle();
      if (!byUsername.error && byUsername.data) targetRow = byUsername.data;
    }

    if (!targetRow || !targetRow.id) {
      return new Response(JSON.stringify({ error: 'Target user not found.' }), { status: 404, headers });
    }

    const cleared = await clearProfilePicture(supabase, String(targetRow.id));
    await clearUserAvatarFiles(supabase, String(targetRow.id));
    const noticeUpdate = await supabase
      .from('profiles')
      .update({
        moderation_notice_type: 'profile_picture_removed',
        moderation_notice_reason: reasonCode,
        moderation_notice_message: reasonMessage,
        moderation_notice_created_at: new Date().toISOString(),
        moderation_notice_seen: false,
      })
      .eq('id', String(targetRow.id));
    if (noticeUpdate.error) throw noticeUpdate.error;

    return new Response(
      JSON.stringify({
        ok: true,
        target: targetRow.username ? '@' + String(targetRow.username) : (targetRow.email || String(targetRow.id)),
        id: String(targetRow.id),
        column: cleared.column,
      }),
      { status: 200, headers },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers });
  }
});
