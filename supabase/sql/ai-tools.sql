-- ═══════════════════════════════════════════════════════════════════════════
-- RA10 — AI study tools: access (Premium + free tries), scanned flashcards and
-- pre-release packs. Used by the ai-tools edge function and the tool pages.
-- Run AFTER study-hub.sql (study_hub_premium) and ai-usage.sql. Safe to re-run.
--
--   Tool               feature key    Access
--   Paragraph coach    coach          Premium · 3 free tries
--   Blurt & Grill      blurt          Premium · 3 free tries
--   Pre-release sim    prerelease     Premium · 2 free tries
--   Bug Hunt           bughunt        Premium · 3 free tries
--   Scanner, AJIM, gap drills         free for every signed-in learner
-- Every AI call also counts against the "ai_tools" hourly / daily usage limit
-- (ai-usage.sql). Premium and EDU plans are not limited there.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Usage limit row for the AI tools ────────────────────────────────────
insert into public.ai_usage_config (feature, label, hourly_limit, daily_limit, extension_active, extension_multiplier, extension_note)
values ('ai_tools', 'AI study tools', 15, 50, true, 2, 'Launch extension: 2× limits while RA10 is being upgraded')
on conflict (feature) do nothing;

-- ─── 2. Free tries ──────────────────────────────────────────────────────────
create table if not exists public.ai_tool_trials (
  user_id uuid not null references auth.users (id) on delete cascade,
  feature text not null check (feature in ('coach', 'blurt', 'prerelease', 'bughunt')),
  used integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, feature)
);
alter table public.ai_tool_trials enable row level security;
drop policy if exists ai_tool_trials_own on public.ai_tool_trials;
create policy ai_tool_trials_own on public.ai_tool_trials for select to authenticated using (user_id = auth.uid());
grant select on public.ai_tool_trials to authenticated;

create or replace function public.ai_tool_free_tries(p_feature text)
returns integer language sql immutable as $$
  select case p_feature when 'prerelease' then 2 when 'coach' then 3 when 'blurt' then 3 when 'bughunt' then 3 else 0 end
$$;

create or replace function public.ai_tool_is_premium(p_user uuid)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v boolean := false;
begin
  if to_regprocedure('public.study_hub_premium(uuid)') is not null then
    execute 'select public.study_hub_premium($1)' into v using p_user;
  end if;
  return coalesce(v, false);
end $$;
revoke all on function public.ai_tool_is_premium(uuid) from public, anon, authenticated;
grant execute on function public.ai_tool_is_premium(uuid) to service_role;

-- What the learner can use (shown on the tool pages).
create or replace function public.ai_tool_status()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_prem boolean;
  v_out jsonb := '{}'::jsonb;
  f text;
  v_used integer;
begin
  if v_uid is null then return jsonb_build_object('signed_in', false); end if;
  v_prem := public.ai_tool_is_premium(v_uid);
  foreach f in array array['coach', 'blurt', 'prerelease', 'bughunt'] loop
    select used into v_used from public.ai_tool_trials where user_id = v_uid and feature = f;
    v_out := v_out || jsonb_build_object(f, jsonb_build_object(
      'free', public.ai_tool_free_tries(f),
      'left', greatest(0, public.ai_tool_free_tries(f) - coalesce(v_used, 0))));
  end loop;
  return jsonb_build_object('signed_in', true, 'premium', v_prem, 'tools', v_out);
end $$;
revoke all on function public.ai_tool_status() from public, anon;
grant execute on function public.ai_tool_status() to authenticated;

-- Edge function (service role): may this learner start one more use? Takes a try when not Premium.
create or replace function public.ai_tool_take(p_user uuid, p_feature text)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  v_free integer := public.ai_tool_free_tries(p_feature);
  v_used integer;
begin
  if p_user is null or v_free = 0 then return jsonb_build_object('allowed', false, 'reason', 'unknown'); end if;
  if public.ai_tool_is_premium(p_user) then return jsonb_build_object('allowed', true, 'premium', true); end if;
  insert into public.ai_tool_trials (user_id, feature) values (p_user, p_feature) on conflict do nothing;
  select used into v_used from public.ai_tool_trials where user_id = p_user and feature = p_feature for update;
  if v_used >= v_free then
    return jsonb_build_object('allowed', false, 'premium', false, 'left', 0, 'reason', 'trial_used');
  end if;
  update public.ai_tool_trials set used = used + 1, updated_at = now() where user_id = p_user and feature = p_feature;
  return jsonb_build_object('allowed', true, 'premium', false, 'left', v_free - v_used - 1);
end $$;
revoke all on function public.ai_tool_take(uuid, text) from public, anon, authenticated;
grant execute on function public.ai_tool_take(uuid, text) to service_role;

-- Give a try back when the AI call fails.
create or replace function public.ai_tool_refund(p_user uuid, p_feature text)
returns void language sql security definer set search_path = public as $$
  update public.ai_tool_trials set used = greatest(0, used - 1), updated_at = now()
   where user_id = p_user and feature = p_feature and not public.ai_tool_is_premium(p_user);
$$;
revoke all on function public.ai_tool_refund(uuid, text) from public, anon, authenticated;
grant execute on function public.ai_tool_refund(uuid, text) to service_role;

-- ─── 3. Scanned flashcards (free) ───────────────────────────────────────────
create table if not exists public.user_flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  deck text not null default 'My cards' check (char_length(deck) between 1 and 60),
  front text not null check (char_length(front) between 1 and 300),
  back text not null check (char_length(back) between 1 and 600),
  box integer not null default 1 check (box between 1 and 5),     -- Leitner box: 1 = every day … 5 = every 2 weeks
  due_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists user_flashcards_user_idx on public.user_flashcards (user_id, deck, created_at);
alter table public.user_flashcards enable row level security;
drop policy if exists user_flashcards_own on public.user_flashcards;
create policy user_flashcards_own on public.user_flashcards for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
grant select, insert, update, delete on public.user_flashcards to authenticated;

-- Pictures on cards (Study Hub flashcards): an https link only (e.g. Wikimedia Commons). Nothing is uploaded.
alter table public.user_flashcards add column if not exists front_image text;
alter table public.user_flashcards add column if not exists back_image text;
alter table public.user_flashcards drop constraint if exists user_flashcards_images_chk;
alter table public.user_flashcards add constraint user_flashcards_images_chk check (
  (front_image is null or (char_length(front_image) <= 600 and front_image ~ '^https://[^[:space:]<>"''`]+$'))
  and (back_image is null or (char_length(back_image) <= 600 and back_image ~ '^https://[^[:space:]<>"''`]+$')));

create or replace function public.user_flashcards_guard()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.user_id := coalesce(auth.uid(), new.user_id);
  new.front := left(btrim(new.front), 300);
  new.back := left(btrim(new.back), 600);
  new.front_image := nullif(btrim(coalesce(new.front_image, '')), '');
  new.back_image := nullif(btrim(coalesce(new.back_image, '')), '');
  new.deck := left(coalesce(nullif(btrim(new.deck), ''), 'My cards'), 60);
  if tg_op = 'INSERT' then
    new.created_at := now();
    if (select count(*) from public.user_flashcards where user_id = new.user_id) >= 2000 then
      raise exception 'You have reached the limit of 2,000 cards.' using errcode = 'P0001';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists trg_user_flashcards_guard on public.user_flashcards;
create trigger trg_user_flashcards_guard before insert or update on public.user_flashcards
  for each row execute function public.user_flashcards_guard();

-- ─── 4. Pre-release packs (written and read only by the edge function) ──────
create table if not exists public.prerelease_packs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  unit text not null,
  title text,
  pack jsonb not null,            -- what the learner sees (scenario, tables, charts)
  keys jsonb not null,            -- hidden: key facts to note, Part B tasks with mark schemes
  notes text,
  notes_result jsonb,
  partb_answers jsonb,
  partb_result jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists prerelease_packs_user_idx on public.prerelease_packs (user_id, created_at desc);
alter table public.prerelease_packs enable row level security;   -- no client policies: edge function only
