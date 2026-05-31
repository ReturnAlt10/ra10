import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

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

function sanitizeFileName(raw: string) {
  const safe = String(raw || 'avatar.png').replace(/[^a-zA-Z0-9._-]/g, '_');
  return safe.slice(0, 140) || 'avatar.png';
}

function base64ToUint8Array(base64: string) {
  const normalized = String(base64 || '').replace(/\s+/g, '');
  const bin = atob(normalized);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

function extensionForMime(mimeType: string) {
  const m = String(mimeType || '').toLowerCase();
  if (m === 'image/png') return 'png';
  if (m === 'image/jpeg' || m === 'image/jpg') return 'jpg';
  if (m === 'image/webp') return 'webp';
  if (m === 'image/gif') return 'gif';
  if (m === 'image/avif') return 'avif';
  return 'png';
}

async function ensureBucket(supabase: any, bucketName: string) {
  const { data: existing } = await supabase.storage.listBuckets();
  const found = Array.isArray(existing) && existing.some((b: any) => String(b?.name || '') === bucketName);
  if (!found) {
    await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 2097152,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'],
    });
  }
  await supabase.storage.updateBucket(bucketName, {
    public: true,
    fileSizeLimit: 2097152,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'],
  });
}

async function clearUserAvatarFiles(supabase: any, bucketName: string, userId: string) {
  const prefix = userId + '/';
  const { data, error } = await supabase.storage.from(bucketName).list(prefix, {
    limit: 100,
    offset: 0,
  });
  if (error) return;
  const files = Array.isArray(data)
    ? data
      .map((item: any) => String(item?.name || '').trim())
      .filter((name: string) => !!name)
      .map((name: string) => prefix + name)
    : [];
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

    let body: any = null;
    try {
      body = await req.json();
    } catch {
      body = null;
    }

    const contentBase64 = String((body && body.contentBase64) || '').trim();
    const mimeType = String((body && body.mimeType) || 'application/octet-stream').trim().slice(0, 80);
    const fileName = sanitizeFileName(String((body && body.fileName) || 'avatar.png'));
    const deleteOnly = !!(body && body.deleteOnly);

    const userId = String(userRes.user.id || '').trim();
    const bucketName = 'profile-pics';
    await ensureBucket(supabase, bucketName);

    if (deleteOnly) {
      await clearUserAvatarFiles(supabase, bucketName, userId);
      return new Response(JSON.stringify({ ok: true, deleted: true }), { status: 200, headers });
    }

    if (!contentBase64) {
      return new Response(JSON.stringify({ error: 'Missing image data.' }), { status: 400, headers });
    }

    if (!/^image\//i.test(mimeType)) {
      return new Response(JSON.stringify({ error: 'Only image uploads are allowed.' }), { status: 400, headers });
    }

    const bytes = base64ToUint8Array(contentBase64);
    if (bytes.byteLength < 16) {
      return new Response(JSON.stringify({ error: 'Image file is invalid.' }), { status: 400, headers });
    }
    if (bytes.byteLength > 2 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'Image is too large. Max 2 MB.' }), { status: 400, headers });
    }

    await clearUserAvatarFiles(supabase, bucketName, userId);

    const ext = extensionForMime(mimeType);
    const objectPath = userId + '/avatar.' + ext;
    const cacheBust = Date.now();

    const uploadRes = await supabase.storage
      .from(bucketName)
      .upload(objectPath, bytes, {
        upsert: true,
        contentType: mimeType,
        cacheControl: '3600',
      });

    if (uploadRes.error) {
      return new Response(
        JSON.stringify({ error: 'Could not upload image to storage: ' + String(uploadRes.error.message || 'unknown') }),
        { status: 502, headers },
      );
    }

    const pub = supabase.storage.from(bucketName).getPublicUrl(objectPath);
    const url = String(pub?.data?.publicUrl || '').trim();
    if (!/^https?:\/\//i.test(url)) {
      return new Response(JSON.stringify({ error: 'Upload succeeded but URL generation failed.' }), { status: 500, headers });
    }

    return new Response(JSON.stringify({ ok: true, url: url + '?v=' + cacheBust, host: 'supabase-storage' }), { status: 200, headers });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers });
  }
});
