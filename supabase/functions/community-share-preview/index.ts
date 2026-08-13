import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const SITE_URL = 'https://ra10.co.uk';

function escapeHtml(value: unknown) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function boardColour(board: string) {
  const value = board.toLowerCase();
  if (value.includes('ocr')) return '#5a1f6a';
  if (value.includes('wjec') || value.includes('eduqas')) return '#2e7d32';
  if (value.includes('ccea')) return '#8b1c1c';
  if (value.includes('pearson') || value.includes('btec') || value.includes('edexcel')) return '#003087';
  return '#d20000';
}

serve(async (request) => {
  const url = new URL(request.url);
  const appId = String(url.searchParams.get('app') || '').trim();
  const fallback = `${SITE_URL}/#/community`;
  if (!appId || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return Response.redirect(fallback, 302);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase
    .from('community_apps')
    .select('id,title,description,subject,level,exam_board,icon_emoji,cover_image_url,status,visibility')
    .eq('id', appId)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .maybeSingle();

  if (!data) return Response.redirect(fallback, 302);

  const title = String(data.title || 'RA10 Study App');
  const subject = String(data.subject || 'Revision');
  const level = String(data.level || 'Study app');
  const board = String(data.exam_board || '');
  const description = String(data.description || `Interactive ${subject} revision guide, flashcards, questions, and quiz on RA10.`).slice(0, 220);
  const appUrl = `${SITE_URL}/#/community?app=${encodeURIComponent(String(data.id))}`;
  const previewImage = String(data.cover_image_url || `${SITE_URL}/logo.png`);
  const accent = boardColour(board);
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)} · RA10</title>
<meta name="description" content="${escapeHtml(description)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="RA10">
<meta property="og:title" content="${escapeHtml(title)} · RA10">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${escapeHtml(appUrl)}">
<meta property="og:image" content="${escapeHtml(previewImage)}">
<meta property="og:image:alt" content="${escapeHtml(title)} study app on RA10">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)} · RA10">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${escapeHtml(previewImage)}">
<meta http-equiv="refresh" content="0;url=${escapeHtml(appUrl)}">
<style>body{margin:0;font-family:system-ui,sans-serif;background:#f7f6f2;color:#28251d;display:grid;place-items:center;min-height:100vh}.card{max-width:520px;margin:24px;padding:28px;border-radius:22px;background:#fff;box-shadow:0 18px 50px #0002}.mark{display:inline-grid;place-items:center;width:52px;height:52px;border-radius:14px;background:${accent};color:#fff;font-size:26px}.tag{display:inline-block;margin:12px 6px 0 0;padding:4px 8px;border-radius:999px;background:#f3f0ec;font-size:12px;font-weight:700}a{color:${accent};font-weight:700}</style>
</head>
<body><main class="card"><div class="mark">${escapeHtml(data.icon_emoji || '📘')}</div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><span class="tag">${escapeHtml(subject)}</span><span class="tag">${escapeHtml(level)}</span>${board ? `<span class="tag">${escapeHtml(board)}</span>` : ''}<p><a href="${escapeHtml(appUrl)}">Open this study app on RA10 →</a></p></main></body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
});
