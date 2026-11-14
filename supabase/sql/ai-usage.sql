-- RA10 — AI usage limits (hourly + daily), replacing credits for the AI Examiner.
--
-- Run AFTER security-hardening-profiles.sql and edu-platform.sql (uses profiles, school_members,
-- edu_is_owner). Safe to re-run.
--
-- How it works
--   * Every AI Examiner mark by a Standard-plan learner records one row in ai_usage_events.
--   * Limits are ROLLING windows: the last 60 minutes and the last 24 hours (like Claude's usage
--     limits). A use "comes back" exactly one hour / one day after it was spent.
--   * Plans (single source of truth: ai_usage_plan):
--       premium  — Pro (all_subjects), Ultra, owner, unlimited_credits accounts → no usage counted
--       edu      — school tiers and active school members                       → no limits
--       standard — everyone else (free, subject)                                 → hourly + daily limits
--   * Launch extension: while ai_usage_config.extension_active is true, Standard limits are
--     multiplied by extension_multiplier. Turn it off when the enterprise migration is finished:
--       update public.ai_usage_config set extension_active = false where feature = 'ai_mark';
--     (or the owner RPC ai_usage_set_config). No code deploy is needed.
--   * Enforcement is server-side only: the ai-mark edge function calls ai_usage_consume() with the
--     service role BEFORE any AI provider is called, and ai_usage_refund() if marking fails.
--     Learners can read their own status (ai_usage_status) but cannot write usage rows.
--   * Retention: rows older than 2 days are deleted on the user's next use (only the last 24 h matter).

-- 1. Configuration (one row per AI feature) ───────────────────────────────────────────────────
create table if not exists public.ai_usage_config (
  feature              text primary key,
  label                text not null,
  hourly_limit         integer not null check (hourly_limit > 0),
  daily_limit          integer not null check (daily_limit > 0),
  extension_active     boolean not null default true,
  extension_multiplier numeric(4,2) not null default 3 check (extension_multiplier >= 1),
  extension_note       text,
  updated_at           timestamptz not null default now()
);

alter table public.ai_usage_config enable row level security;
drop policy if exists ai_usage_config_read on public.ai_usage_config;
create policy ai_usage_config_read on public.ai_usage_config for select to anon, authenticated using (true);

insert into public.ai_usage_config (feature, label, hourly_limit, daily_limit, extension_active, extension_multiplier, extension_note)
values ('ai_mark', 'AI Examiner', 10, 40, true, 3,
        'Launch extension: 3× limits while RA10 is being upgraded')
on conflict (feature) do nothing;

-- 2. Usage events ──────────────────────────────────────────────────────────────────────────────
create table if not exists public.ai_usage_events (
  id         bigserial primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  feature    text not null,
  created_at timestamptz not null default now()
);
create index if not exists ai_usage_events_user_feature_time
  on public.ai_usage_events (user_id, feature, created_at desc);

alter table public.ai_usage_events enable row level security;
drop policy if exists ai_usage_events_select_own on public.ai_usage_events;
create policy ai_usage_events_select_own on public.ai_usage_events for select to authenticated
  using (user_id = auth.uid());
-- No insert / update / delete policies: rows are written only by the security-definer functions below.

-- 3. Plan (who is limited) ─────────────────────────────────────────────────────────────────────
create or replace function public.ai_usage_plan(p_user uuid default auth.uid())
returns text language sql stable security definer set search_path = public as $$
  select case
    when p_user is null then 'none'
    when exists (
      select 1 from public.profiles p
      left join auth.users u on u.id = p.id
      where p.id = p_user
        and (lower(coalesce(p.tier, '')) in ('all_subjects', 'ultra', 'owner')
             or coalesce(p.unlimited_credits, false)
             or lower(coalesce(u.email, '')) in ('mistry.hashim@icloud.com', 'faiz.mistry@gmail.com'))) then 'premium'
    when exists (
      select 1 from public.profiles p
      where p.id = p_user and lower(coalesce(p.tier, '')) in ('school_student', 'school_teacher', 'school_admin'))
      or exists (
      select 1 from public.school_members m
      join auth.users u on lower(u.email) = lower(m.email)
      where u.id = p_user and m.status = 'active') then 'edu'
    else 'standard'
  end;
$$;
revoke all on function public.ai_usage_plan(uuid) from public, anon;
grant execute on function public.ai_usage_plan(uuid) to authenticated, service_role;

-- 4. Snapshot of one user's usage for one feature ──────────────────────────────────────────────
-- resets_at = when the next use becomes available (only meaningful once the window is full);
-- clears_at = when the whole window is empty again.
create or replace function public.ai_usage_snapshot(p_user uuid, p_feature text)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  c         public.ai_usage_config;
  v_plan    text;
  v_mult    numeric;
  v_hl      integer;
  v_dl      integer;
  v_h       integer;
  v_d       integer;
  v_h_reset timestamptz;
  v_d_reset timestamptz;
  v_h_clear timestamptz;
  v_d_clear timestamptz;
  v_unl     boolean;
begin
  select * into c from public.ai_usage_config where feature = p_feature;
  if not found then
    raise exception 'Unknown AI feature %', p_feature;
  end if;

  v_plan := public.ai_usage_plan(p_user);
  v_unl  := v_plan in ('premium', 'edu');
  v_mult := case when c.extension_active then c.extension_multiplier else 1 end;
  v_hl   := floor(c.hourly_limit * v_mult);
  v_dl   := floor(c.daily_limit * v_mult);

  select count(*), max(created_at) + interval '1 hour' into v_h, v_h_clear
    from public.ai_usage_events
   where user_id = p_user and feature = p_feature and created_at > now() - interval '1 hour';
  select count(*), max(created_at) + interval '24 hours' into v_d, v_d_clear
    from public.ai_usage_events
   where user_id = p_user and feature = p_feature and created_at > now() - interval '24 hours';

  -- the use that has to expire before the count drops below the limit
  select created_at + interval '1 hour' into v_h_reset
    from public.ai_usage_events
   where user_id = p_user and feature = p_feature and created_at > now() - interval '1 hour'
   order by created_at asc offset greatest(v_h - v_hl, 0) limit 1;
  select created_at + interval '24 hours' into v_d_reset
    from public.ai_usage_events
   where user_id = p_user and feature = p_feature and created_at > now() - interval '24 hours'
   order by created_at asc offset greatest(v_d - v_dl, 0) limit 1;

  return jsonb_build_object(
    'feature',   p_feature,
    'label',     c.label,
    'plan',      v_plan,
    'unlimited', v_unl,
    'allowed',   v_plan <> 'none' and (v_unl or (v_h < v_hl and v_d < v_dl)),
    'blocked_by', case when v_unl or v_plan = 'none' then null
                       when v_d >= v_dl then 'day'
                       when v_h >= v_hl then 'hour' end,
    'hour', jsonb_build_object('used', v_h, 'limit', v_hl, 'remaining', greatest(v_hl - v_h, 0),
                               'resets_at', v_h_reset, 'clears_at', v_h_clear),
    'day',  jsonb_build_object('used', v_d, 'limit', v_dl, 'remaining', greatest(v_dl - v_d, 0),
                               'resets_at', v_d_reset, 'clears_at', v_d_clear),
    'base', jsonb_build_object('hour', c.hourly_limit, 'day', c.daily_limit),
    'extension', jsonb_build_object('active', c.extension_active, 'multiplier', c.extension_multiplier,
                                    'note', c.extension_note),
    'now', now()
  );
end;
$$;
revoke all on function public.ai_usage_snapshot(uuid, text) from public, anon, authenticated;
grant execute on function public.ai_usage_snapshot(uuid, text) to service_role;

-- 5. Learner-facing status (own account only) ─────────────────────────────────────────────────
create or replace function public.ai_usage_status(p_feature text default 'ai_mark')
returns jsonb language plpgsql volatile security definer set search_path = public as $$
begin
  if auth.uid() is null then
    return jsonb_build_object('feature', p_feature, 'plan', 'none', 'allowed', false, 'signed_in', false);
  end if;
  return public.ai_usage_snapshot(auth.uid(), p_feature);
end;
$$;
revoke all on function public.ai_usage_status(text) from public, anon;
grant execute on function public.ai_usage_status(text) to authenticated;

-- 6. Consume one use (edge functions only, service role) ──────────────────────────────────────
create or replace function public.ai_usage_consume(p_user uuid, p_feature text default 'ai_mark')
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  s    jsonb;
  v_id bigint;
begin
  if p_user is null then
    raise exception 'A user is required';
  end if;
  -- serialise concurrent requests from the same account so two tabs cannot both take the last use
  perform pg_advisory_xact_lock(hashtextextended(p_user::text || ':' || p_feature, 0));
  delete from public.ai_usage_events
   where user_id = p_user and feature = p_feature and created_at < now() - interval '2 days';

  s := public.ai_usage_snapshot(p_user, p_feature);
  if (s ->> 'unlimited')::boolean then
    return s || jsonb_build_object('allowed', true, 'event_id', null);   -- Premium / EDU: nothing counted
  end if;
  if not (s ->> 'allowed')::boolean then
    return s || jsonb_build_object('event_id', null);
  end if;

  insert into public.ai_usage_events (user_id, feature) values (p_user, p_feature) returning id into v_id;
  return public.ai_usage_snapshot(p_user, p_feature) || jsonb_build_object('allowed', true, 'event_id', v_id);
end;
$$;
revoke all on function public.ai_usage_consume(uuid, text) from public, anon, authenticated;
grant execute on function public.ai_usage_consume(uuid, text) to service_role;

-- 7. Refund a use when marking failed (edge functions only) ───────────────────────────────────
create or replace function public.ai_usage_refund(p_user uuid, p_event_id bigint)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  v_feature text;
begin
  delete from public.ai_usage_events where id = p_event_id and user_id = p_user returning feature into v_feature;
  if v_feature is null then
    return jsonb_build_object('refunded', false);
  end if;
  return public.ai_usage_snapshot(p_user, v_feature) || jsonb_build_object('refunded', true);
end;
$$;
revoke all on function public.ai_usage_refund(uuid, bigint) from public, anon, authenticated;
grant execute on function public.ai_usage_refund(uuid, bigint) to service_role;

-- 8. Owner: change limits / end the launch extension ──────────────────────────────────────────
create or replace function public.ai_usage_set_config(
  p_feature text,
  p_hourly integer default null,
  p_daily integer default null,
  p_extension_active boolean default null,
  p_extension_multiplier numeric default null,
  p_extension_note text default null)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  c public.ai_usage_config;
begin
  if not public.edu_is_owner() then
    raise exception 'Forbidden';
  end if;
  update public.ai_usage_config set
    hourly_limit         = coalesce(p_hourly, hourly_limit),
    daily_limit          = coalesce(p_daily, daily_limit),
    extension_active     = coalesce(p_extension_active, extension_active),
    extension_multiplier = coalesce(p_extension_multiplier, extension_multiplier),
    extension_note       = coalesce(p_extension_note, extension_note),
    updated_at           = now()
  where feature = p_feature
  returning * into c;
  if not found then
    raise exception 'Unknown AI feature %', p_feature;
  end if;
  return to_jsonb(c);
end;
$$;
revoke all on function public.ai_usage_set_config(text, integer, integer, boolean, numeric, text) from public, anon;
grant execute on function public.ai_usage_set_config(text, integer, integer, boolean, numeric, text) to authenticated;
