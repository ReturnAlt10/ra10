-- ═══════════════════════════════════════════════════════════════════════════
-- RA10 — AI chat history (AI Helper, AI Assigner, AI Examiner)
-- Run this in the Supabase SQL editor. Safe to re-run.
--
-- What this adds
--   1. public.ai_chat_groups    — user-made groups ("Unit 3 coursework").
--                                 Chats in the same group share context.
--   2. public.ai_chats          — one row per conversation, tagged with
--                                 subject / qualification / unit / topic.
--   3. public.ai_chat_messages  — TEXT ONLY. No images, files or base64 blobs.
--   4. Retention                — unsaved chats expire 30 days after their
--                                 last message. Saving a chat clears the
--                                 expiry; unsaving restarts the 30 days.
--                                 Expired rows are hidden by RLS at once and
--                                 hard-deleted by a daily pg_cron job.
--   5. Storage guards           — per-message, per-chat and per-user caps.
-- ═══════════════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Groups
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.ai_chat_groups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  color text check (color is null or color ~ '^#[0-9a-fA-F]{6}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists ai_chat_groups_user_idx on public.ai_chat_groups (user_id, updated_at desc);


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Chats
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.ai_chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  group_id uuid references public.ai_chat_groups (id) on delete set null,
  product text not null default 'helper' check (product in ('helper', 'assigner', 'examiner')),
  title text not null default 'New chat' check (char_length(title) <= 120),
  subject text check (subject is null or char_length(subject) <= 60),
  qualification text check (qualification is null or char_length(qualification) <= 60),
  unit text check (unit is null or char_length(unit) <= 80),
  topic text check (topic is null or char_length(topic) <= 120),
  unit_key text check (unit_key is null or char_length(unit_key) <= 64),
  page_path text check (page_path is null or char_length(page_path) <= 200),
  -- Short rolling summary of the conversation, used as shared context for
  -- other chats in the same group. Written by the client.
  digest text check (digest is null or char_length(digest) <= 1200),
  saved boolean not null default false,
  message_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz default (now() + interval '30 days')
);
create index if not exists ai_chats_user_idx on public.ai_chats (user_id, updated_at desc);
create index if not exists ai_chats_group_idx on public.ai_chats (group_id, updated_at desc) where group_id is not null;
create index if not exists ai_chats_expiry_idx on public.ai_chats (expires_at) where expires_at is not null;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Messages — text only
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.ai_chat_messages (
  id bigint generated always as identity primary key,
  chat_id uuid not null references public.ai_chats (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (
    char_length(content) between 1 and 8000
    -- Reject embedded images / files (data URIs, long base64 runs).
    and content !~* 'data:[a-z]+/[a-z0-9.+-]+;base64,'
    and content !~ '[A-Za-z0-9+/]{2000,}'
  ),
  created_at timestamptz not null default now()
);
create index if not exists ai_chat_messages_chat_idx on public.ai_chat_messages (chat_id, id);


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Triggers
-- ─────────────────────────────────────────────────────────────────────────────

-- Chats: keep ownership, groups and expiry consistent; cap chats per user.
create or replace function public.ai_chats_before_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  -- Set only by ai_chat_messages_before_insert for its own bookkeeping update.
  v_internal boolean := coalesce(current_setting('ra10.ai_chat_internal', true), '') = '1';
begin
  if tg_op = 'INSERT' then
    new.user_id := coalesce(auth.uid(), new.user_id);
    new.message_count := 0;
    new.created_at := now();
    if (select count(*) from public.ai_chats c where c.user_id = new.user_id
          and (c.expires_at is null or c.expires_at > now())) >= 500 then
      raise exception 'Chat limit reached. Delete some old chats first.' using errcode = 'P0001';
    end if;
  else
    new.user_id := old.user_id;            -- ownership can't change
    new.created_at := old.created_at;
    if not v_internal then
      -- Clients can't move these directly (e.g. to dodge the 30-day expiry).
      new.message_count := old.message_count;
      if not new.saved and not old.saved then
        new.expires_at := old.expires_at;
      end if;
    end if;
  end if;

  if new.group_id is not null and not exists (
    select 1 from public.ai_chat_groups g where g.id = new.group_id and g.user_id = new.user_id
  ) then
    raise exception 'Unknown group.' using errcode = 'P0001';
  end if;

  new.title := left(coalesce(nullif(btrim(new.title), ''), 'New chat'), 120);
  new.updated_at := now();

  -- Saved chats never expire. Unsaved chats expire 30 days after last activity.
  if new.saved then
    new.expires_at := null;
  elsif tg_op = 'INSERT' or old.saved or new.expires_at is null then
    new.expires_at := now() + interval '30 days';
  end if;
  -- Never more than 30 days out. (LEAST ignores NULLs, so guard saved chats.)
  if new.expires_at is not null then
    new.expires_at := least(new.expires_at, now() + interval '30 days');
  end if;
  return new;
end;
$$;

drop trigger if exists ai_chats_before_write on public.ai_chats;
create trigger ai_chats_before_write
before insert or update on public.ai_chats
for each row execute function public.ai_chats_before_write();

-- Messages: must belong to the caller's live chat; cap messages per chat;
-- bump the chat's activity + expiry.
create or replace function public.ai_chat_messages_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_chat public.ai_chats%rowtype;
begin
  new.user_id := coalesce(auth.uid(), new.user_id);
  new.created_at := now();
  select * into v_chat from public.ai_chats where id = new.chat_id for update;
  if not found or v_chat.user_id <> new.user_id
     or (v_chat.expires_at is not null and v_chat.expires_at <= now()) then
    raise exception 'Chat not found.' using errcode = 'P0001';
  end if;
  if v_chat.message_count >= 300 then
    raise exception 'This chat is full. Start a new chat in the same group to keep the context.' using errcode = 'P0001';
  end if;
  perform set_config('ra10.ai_chat_internal', '1', true);
  update public.ai_chats
     set message_count = message_count + 1,
         updated_at = now(),
         expires_at = case when saved then null else now() + interval '30 days' end
   where id = new.chat_id;
  perform set_config('ra10.ai_chat_internal', '', true);
  return new;
end;
$$;

drop trigger if exists ai_chat_messages_before_insert on public.ai_chat_messages;
create trigger ai_chat_messages_before_insert
before insert on public.ai_chat_messages
for each row execute function public.ai_chat_messages_before_insert();

-- Groups: cap per user, keep ownership.
create or replace function public.ai_chat_groups_before_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    new.user_id := coalesce(auth.uid(), new.user_id);
    if (select count(*) from public.ai_chat_groups g where g.user_id = new.user_id) >= 50 then
      raise exception 'Group limit reached (50).' using errcode = 'P0001';
    end if;
  else
    new.user_id := old.user_id;
    new.created_at := old.created_at;
  end if;
  new.name := btrim(new.name);
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists ai_chat_groups_before_write on public.ai_chat_groups;
create trigger ai_chat_groups_before_write
before insert or update on public.ai_chat_groups
for each row execute function public.ai_chat_groups_before_write();


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Row level security — users only ever see their own, unexpired rows
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.ai_chat_groups enable row level security;
alter table public.ai_chats enable row level security;
alter table public.ai_chat_messages enable row level security;

drop policy if exists "ai_chat_groups own" on public.ai_chat_groups;
create policy "ai_chat_groups own" on public.ai_chat_groups
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "ai_chats own select" on public.ai_chats;
create policy "ai_chats own select" on public.ai_chats
  for select to authenticated
  using (user_id = auth.uid() and (expires_at is null or expires_at > now()));

drop policy if exists "ai_chats own insert" on public.ai_chats;
create policy "ai_chats own insert" on public.ai_chats
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "ai_chats own update" on public.ai_chats;
create policy "ai_chats own update" on public.ai_chats
  for update to authenticated
  using (user_id = auth.uid() and (expires_at is null or expires_at > now()))
  with check (user_id = auth.uid());

drop policy if exists "ai_chats own delete" on public.ai_chats;
create policy "ai_chats own delete" on public.ai_chats
  for delete to authenticated
  using (user_id = auth.uid());

drop policy if exists "ai_chat_messages own select" on public.ai_chat_messages;
create policy "ai_chat_messages own select" on public.ai_chat_messages
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "ai_chat_messages own insert" on public.ai_chat_messages;
create policy "ai_chat_messages own insert" on public.ai_chat_messages
  for insert to authenticated
  with check (user_id = auth.uid());
-- No update policy: messages are immutable. Deleting a chat cascades.

grant select, insert, update, delete on public.ai_chat_groups to authenticated;
grant select, insert, update, delete on public.ai_chats to authenticated;
grant select, insert on public.ai_chat_messages to authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Daily purge of expired chats (messages cascade)
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.purge_expired_ai_chats()
returns integer
language sql
security definer
set search_path = public
as $$
  with gone as (
    delete from public.ai_chats
     where expires_at is not null and expires_at <= now()
    returning 1
  )
  select count(*)::integer from gone;
$$;
revoke all on function public.purge_expired_ai_chats() from public, anon, authenticated;

-- Requires the pg_cron extension (Dashboard → Database → Extensions → pg_cron).
-- If it isn't enabled yet this block only prints a notice; expired chats stay
-- hidden by RLS until the job exists.
do $$
begin
  create extension if not exists pg_cron;
  if exists (select 1 from cron.job where jobname = 'ra10-purge-expired-ai-chats') then
    perform cron.unschedule('ra10-purge-expired-ai-chats');
  end if;
  perform cron.schedule('ra10-purge-expired-ai-chats', '17 3 * * *', 'select public.purge_expired_ai_chats()');
exception when others then
  raise notice 'pg_cron not available (%). Enable it and re-run this file to schedule the purge.', sqlerrm;
end;
$$;
