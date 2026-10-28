-- ═══════════════════════════════════════════════════════════════════════════
-- RA10 — FIX: AI Helper / Assigner / Examiner chats open with no messages
-- Run this once in the Supabase SQL editor. Safe to re-run.
--
-- The message table's "no base64 blobs" check used the regex '{2000,}', but
-- Postgres only allows repeat counts up to 255, so every message insert threw
-- "invalid regular expression" and was rejected. Chats were created (they show
-- in history) but contained nothing. This swaps in an equivalent valid check.
-- ═══════════════════════════════════════════════════════════════════════════
alter table public.ai_chat_messages drop constraint if exists ai_chat_messages_content_check;
alter table public.ai_chat_messages add constraint ai_chat_messages_content_check check (
  char_length(content) between 1 and 8000
  and content !~* 'data:[a-z]+/[a-z0-9.+-]+;base64,'
  and content !~ '([A-Za-z0-9+/]{250}){8}'
);

notify pgrst, 'reload schema';
