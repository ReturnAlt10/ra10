import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const url = Deno.env.get('SUPABASE_URL') || '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const allowedOrigins = new Set(['https://ra10.co.uk', 'https://www.ra10.co.uk', 'http://localhost:5500', 'http://127.0.0.1:5500']);

function headers(origin: string | null) {
  return {
    'Access-Control-Allow-Origin': allowedOrigins.has(origin || '') ? String(origin) : 'https://ra10.co.uk',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}
function text(value: unknown, max = 1000) { return String(value || '').trim().slice(0, max); }
function count(value: unknown, fallback: number, min: number, max: number) {
  const n = Number(value); return Number.isFinite(n) ? Math.max(min, Math.min(max, Math.round(n))) : fallback;
}

serve(async (request) => {
  const cors = headers(request.headers.get('origin'));
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: cors });
  if (!url || !serviceKey) return new Response(JSON.stringify({ error: 'Server is not configured.' }), { status: 500, headers: cors });

  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
  const admin = createClient(url, serviceKey);
  const { data: auth } = await admin.auth.getUser(token);
  if (!auth?.user) return new Response(JSON.stringify({ error: 'Sign in required.' }), { status: 401, headers: cors });

  try {
    const body = await request.json();
    const subject = text(body.subject, 80) || 'General';
    const level = text(body.level, 80) || 'Mixed';
    const examBoard = text(body.examBoard, 80) || 'Mixed';
    const sourceText = text(body.sourceText, 50000);
    const title = text(body.title, 120) || `${subject} ${level} Revision App`;
    const features = Array.isArray(body.features) ? body.features.map((x: unknown) => text(x, 40)).filter(Boolean).slice(0, 4) : ['revision_guide', 'question_bank', 'flashcards', 'quiz'];
    if (!features.length) throw new Error('Choose at least one content type.');

    const targets = body.generationTargets || {};
    const metadata = {
      sourceText,
      sourceFileName: text(body.sourceFileName, 160),
      guidance: text(body.guidance, 12000),
      focus: Array.isArray(body.focus) ? body.focus.map((x: unknown) => text(x, 80)).filter(Boolean).slice(0, 16) : [],
      features,
      generationTargets: {
        question_count: count(targets.question_count, 24, 8, 80),
        flashcard_count: count(targets.flashcard_count, 30, 8, 120),
        quiz_count: count(targets.quiz_count, 20, 6, 60),
        guide_chapter_count: count(targets.guide_chapter_count, 8, 3, 20),
      },
      enrichment: body.enrichment || {},
      requestedAt: new Date().toISOString(),
    };

    const { data: app, error: appError } = await admin.from('community_apps').insert({
      creator_id: auth.user.id,
      title,
      description: text(body.description, 320) || `AI-generated ${subject} revision resources.`,
      subject,
      level,
      exam_board: examBoard,
      tags: metadata.focus,
      icon_emoji: subject === 'IT' ? '💻' : subject === 'Business' ? '💼' : subject === 'Sport' ? '⚽' : '📘',
      credit_cost: 1,
      like_count: 0,
      comment_count: 0,
      uses_deeptutor: true,
      visibility: text(body.visibility, 20) === 'private' ? 'private' : 'public',
      status: 'draft',
    }).select('id').single();
    if (appError || !app) throw new Error(appError?.message || 'Could not create the app record.');

    const { error: metadataError } = await admin.from('community_app_contents').insert({ app_id: app.id, kind: 'metadata', payload: JSON.stringify(metadata) });
    if (metadataError) throw new Error(metadataError.message);
    const { data: job, error: jobError } = await admin.from('community_app_jobs').insert({
      creator_id: auth.user.id,
      app_id: app.id,
      status: 'queued',
      progress: 5,
      status_note: 'Queued for generation',
      eta_seconds: 120,
    }).select('id').single();
    if (jobError || !job) throw new Error(jobError?.message || 'Could not queue generation.');

    return new Response(JSON.stringify({ jobId: job.id, appId: app.id, subject, generationCost: 0 }), { headers: cors });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Could not create job.' }), { status: 400, headers: cors });
  }
});
