import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const OWNER_EMAIL = 'mistry.hashim@icloud.com';
const BUCKET_NAME = 'public-config';
const OBJECT_PATH = 'site-announcement.json';

const ALLOWED_ORIGINS = new Set([
  'https://ra10.co.uk',
  'https://www.ra10.co.uk',
  'http://localhost:8765',
  'http://127.0.0.1:8765',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

function isAllowedOrigin(origin: string | null) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    const u = new URL(origin);
    if (u.protocol !== 'https:') return false;
    return u.hostname === 'ra10.co.uk' || u.hostname.endsWith('.ra10.co.uk');
  } catch (_e) {
    return false;
  }
}

function corsHeaders(origin: string | null) {
  const allowOrigin = isAllowedOrigin(origin) ? String(origin) : 'https://ra10.co.uk';
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

async function ensureBucket(supabase: any) {
  const { data: existing } = await supabase.storage.listBuckets();
  const found = Array.isArray(existing) && existing.some((b: any) => String(b?.name || '') === BUCKET_NAME);
  if (!found) {
    await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 65536,
      allowedMimeTypes: ['application/json'],
    });
  }
  await supabase.storage.updateBucket(BUCKET_NAME, {
    public: true,
    fileSizeLimit: 65536,
    allowedMimeTypes: ['application/json'],
  });
}

async function readAnnouncement(supabase: any) {
  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).download(OBJECT_PATH);
    if (error || !data) return null;
    const raw = await data.text();
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch (_e) {
    return null;
  }
}

function sanitizeEmoji(input: unknown) {
  const raw = String(input || '').trim();
  if (!raw) return '📣';
  return raw.slice(0, 4);
}

function sanitizeMessage(input: unknown) {
  return String(input || '').trim().slice(0, 240);
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

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }
  const action = String((body && body.action) || 'get').trim().toLowerCase();

  if (action === 'get') {
    await ensureBucket(supabase);
    const announcement = await readAnnouncement(supabase);
    const now = Date.now();
    const expiresAtMs = announcement?.expires_at ? Date.parse(String(announcement.expires_at)) : NaN;
    if (!announcement || Number.isNaN(expiresAtMs) || expiresAtMs <= now) {
      return new Response(JSON.stringify({ ok: true, announcement: null }), { status: 200, headers });
    }
    return new Response(JSON.stringify({ ok: true, announcement }), { status: 200, headers });
  }

  const auth = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing bearer token' }), { status: 401, headers });
  }

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

    await ensureBucket(supabase);

    if (action === 'clear') {
      await supabase.storage.from(BUCKET_NAME).remove([OBJECT_PATH]);
      return new Response(JSON.stringify({ ok: true, announcement: null }), { status: 200, headers });
    }

    if (action !== 'set') {
      return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers });
    }

    const message = sanitizeMessage(body?.message);
    const emoji = sanitizeEmoji(body?.emoji);
    const durationRaw = Number(body?.duration_hours || 24);
    const durationHours = Math.max(1, Math.min(168, Number.isFinite(durationRaw) ? Math.floor(durationRaw) : 24));

    if (!message || message.length < 3) {
      return new Response(JSON.stringify({ error: 'Announcement message must be at least 3 characters.' }), { status: 400, headers });
    }

    const now = new Date();
    const expires = new Date(now.getTime() + durationHours * 60 * 60 * 1000);

    const announcement = {
      emoji,
      message,
      duration_hours: durationHours,
      created_at: now.toISOString(),
      expires_at: expires.toISOString(),
      created_by: requesterId,
    };

    const payload = new TextEncoder().encode(JSON.stringify(announcement));
    const uploadRes = await supabase.storage
      .from(BUCKET_NAME)
      .upload(OBJECT_PATH, payload, {
        upsert: true,
        contentType: 'application/json',
        cacheControl: '60',
      });

    if (uploadRes.error) {
      throw uploadRes.error;
    }

    return new Response(JSON.stringify({ ok: true, announcement }), { status: 200, headers });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers });
  }
});
