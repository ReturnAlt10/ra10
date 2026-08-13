import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const url = Deno.env.get('SUPABASE_URL') || '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const allowedOrigins = new Set(['https://ra10.co.uk', 'https://www.ra10.co.uk', 'http://localhost:5500', 'http://127.0.0.1:5500']);
function headers(origin: string | null) { return { 'Access-Control-Allow-Origin': allowedOrigins.has(origin || '') ? String(origin) : 'https://ra10.co.uk', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Content-Type': 'application/json' }; }
function plain(value: unknown, max = 1200) { return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max); }

serve(async (request) => {
  const cors = headers(request.headers.get('origin'));
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: cors });
  if (!url || !serviceKey) return new Response(JSON.stringify({ error: 'Server is not configured.' }), { status: 500, headers: cors });
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
  const admin = createClient(url, serviceKey);
  const { data: auth } = await admin.auth.getUser(token);
  if (!auth?.user) return new Response(JSON.stringify({ error: 'Sign in required.' }), { status: 401, headers: cors });

  let activeJobId = '';
  try {
    const { jobId } = await request.json();
    activeJobId = String(jobId || '');
    const { data: job, error: jobError } = await admin.from('community_app_jobs').select('id,app_id,status,community_apps(id,title,subject,level,exam_board,creator_id)').eq('id', String(jobId || '')).single();
    if (jobError || !job) throw new Error('Generation job not found.');
    const app = Array.isArray(job.community_apps) ? job.community_apps[0] : job.community_apps;
    if (!app || String(app.creator_id) !== auth.user.id) throw new Error('Not allowed to process this job.');
    if (job.status === 'completed') return new Response(JSON.stringify({ ok: true, status: 'completed' }), { headers: cors });

    await admin.from('community_app_jobs').update({ status: 'processing', progress: 20, status_note: 'Building revision resources', eta_seconds: 45 }).eq('id', job.id);
    const { data: rows } = await admin.from('community_app_contents').select('payload').eq('app_id', app.id).eq('kind', 'metadata').limit(1);
    const metadata = rows?.[0]?.payload ? JSON.parse(rows[0].payload) : {};
    const source = plain(metadata.sourceText || 'No source notes supplied. Build a broad, specification-focused revision overview.');
    const targets = metadata.generationTargets || {};
    const subject = plain(app.subject || 'General', 80);
    const level = plain(app.level || 'Mixed', 80);
    const board = plain(app.exam_board || 'Mixed', 80);
    const chapters = Math.max(3, Math.min(20, Number(targets.guide_chapter_count) || 8));
    const questions = Math.max(8, Math.min(80, Number(targets.question_count) || 24));
    const cards = Math.max(8, Math.min(120, Number(targets.flashcard_count) || 30));
    const quizCount = Math.max(6, Math.min(60, Number(targets.quiz_count) || 20));
    const topics = Array.isArray(metadata.focus) && metadata.focus.length ? metadata.focus : ['key concepts', 'application', 'exam technique', 'evaluation'];
    const guide = Array.from({ length: chapters }, (_, i) => `## ${i + 1}. ${topics[i % topics.length]}\n${source}\n\nExam focus: Explain the concept accurately, apply it to a scenario, and use ${board} command-verb expectations.`).join('\n\n');
    const questionBank = Array.from({ length: questions }, (_, i) => ({ question: `Explain one important point about ${topics[i % topics.length]} in ${subject}.`, marks: (i % 3) + 2, topic: topics[i % topics.length], command_verb: i % 2 ? 'Explain' : 'Analyse', answer: `A high-quality answer defines ${topics[i % topics.length]}, applies it to a relevant ${subject} context, and links back to the scenario.` }));
    const flashcards = Array.from({ length: cards }, (_, i) => ({ front: `${subject}: ${topics[i % topics.length]}`, back: `Key revision point for ${topics[i % topics.length]}. Use concise definition, application, and an exam-relevant example.` }));
    const quiz = Array.from({ length: quizCount }, (_, i) => ({ question: `Which statement best describes ${topics[i % topics.length]}?`, options: ['A precise definition and application', 'An unrelated detail', 'A calculation with no context', 'A statement with no evidence'], answer: 0 }));
    const content = [
      { kind: 'revision_guide', payload: guide },
      { kind: 'question_bank', payload: JSON.stringify(questionBank) },
      { kind: 'flashcards', payload: JSON.stringify(flashcards) },
      { kind: 'quiz', payload: JSON.stringify(quiz) },
    ];
    const { error: contentError } = await admin.from('community_app_contents').upsert(content.map(item => ({ app_id: app.id, kind: item.kind, payload: item.payload })), { onConflict: 'app_id,kind' });
    if (contentError) throw new Error('Could not save generated content: ' + contentError.message);
    const { error: publishError } = await admin.from('community_apps').update({ status: 'published' }).eq('id', app.id);
    if (publishError) throw new Error('Could not publish app: ' + publishError.message);
    const { error: completeError } = await admin.from('community_app_jobs').update({ status: 'completed', progress: 100, status_note: 'App published', eta_seconds: 0, error_message: null }).eq('id', job.id);
    if (completeError) throw new Error('Could not complete job: ' + completeError.message);
    return new Response(JSON.stringify({ ok: true, appId: app.id, status: 'completed' }), { headers: cors });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Generation failed.';
    if (activeJobId) {
      await admin.from('community_app_jobs').update({ status: 'failed', progress: 100, status_note: 'Generation failed', eta_seconds: 0, error_message: message.slice(0, 900) }).eq('id', activeJobId);
    }
    return new Response(JSON.stringify({ error: message }), { status: 400, headers: cors });
  }
});
