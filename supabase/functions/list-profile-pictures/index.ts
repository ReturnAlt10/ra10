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
    const authEmail = String(userRes.user.email || '').toLowerCase();
    const allowed = await hasOwnerAccess(supabase, requesterId, authEmail);
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Forbidden: owner access required' }), { status: 403, headers });
    }

    let body: any = null;
    try {
      body = await req.json();
    } catch {
      body = null;
    }

    const rawLimit = Number((body && body.limit_count) || 120);
    const limitCount = Math.max(1, Math.min(400, Number.isFinite(rawLimit) ? Math.floor(rawLimit) : 120));

    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, email, profile_pic_url')
      .not('profile_pic_url', 'is', null)
      .limit(limitCount);

    if (error) {
      throw error;
    }

    const rows = (Array.isArray(data) ? data : [])
      .map((row: any) => ({
        id: String(row?.id || ''),
        username: String(row?.username || ''),
        email: String(row?.email || ''),
        profile_pic_url: String(row?.profile_pic_url || '').trim(),
      }))
      .filter((row: any) => /^https?:\/\//i.test(row.profile_pic_url));

    return new Response(JSON.stringify(rows), { status: 200, headers });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers });
  }
});
