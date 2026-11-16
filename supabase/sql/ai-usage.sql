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
--   * Weighted uses (2026-11-16): an AI Examiner mark takes 1 use, a Study Hub lesson takes 5
--     (study-hub edge function). Study Hub shares this same ai_mark allowance.
--   * Owner tools: ai_usage_admin_view / _reset (hour or day) / _topup (bonus uses that are spent
--     only once a limit is reached and never expire). Every change is logged in ai_usage_admin_log.

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

-- 3b. Weighted uses, top-ups and resets (added 2026-11-16) ───────────────────────────────────
--   * amount     — how many uses one event takes. An AI Examiner mark is 1; a Study Hub lesson is 5
--                  (and its in-lesson exam marking is included, see study-hub.sql).
--   * from_bonus — the use was paid from an owner top-up, so it does not count towards the windows.
--   * source     — what spent it ('ai_mark', 'study_hub', …), for the owner's view.
alter table public.ai_usage_events add column if not exists amount integer not null default 1;
alter table public.ai_usage_events add column if not exists from_bonus boolean not null default false;
alter table public.ai_usage_events add column if not exists source text;
alter table public.ai_usage_events drop constraint if exists ai_usage_events_amount_check;
alter table public.ai_usage_events add constraint ai_usage_events_amount_check check (amount between 1 and 50);

-- Per-user owner adjustments: a top-up balance (spent only once a limit is reached, never
-- expires) and reset times (uses before a reset no longer count towards that window).
create table if not exists public.ai_usage_overrides (
  user_id       uuid not null references auth.users (id) on delete cascade,
  feature       text not null,
  bonus         integer not null default 0 check (bonus >= 0),
  hour_reset_at timestamptz,
  day_reset_at  timestamptz,
  updated_at    timestamptz not null default now(),
  updated_by    uuid,
  primary key (user_id, feature)
);
alter table public.ai_usage_overrides enable row level security;
drop policy if exists ai_usage_overrides_select_own on public.ai_usage_overrides;
create policy ai_usage_overrides_select_own on public.ai_usage_overrides for select to authenticated
  using (user_id = auth.uid());

-- Every owner adjustment is logged.
create table if not exists public.ai_usage_admin_log (
  id         bigserial primary key,
  created_at timestamptz not null default now(),
  admin_id   uuid,
  user_id    uuid not null references auth.users (id) on delete cascade,
  feature    text not null,
  action     text not null check (action in ('reset_hour', 'reset_day', 'topup')),
  amount     integer
);
alter table public.ai_usage_admin_log enable row level security;
-- no policies: only the owner functions below read or write it

update public.ai_usage_config set label = 'AI' where feature = 'ai_mark' and label = 'AI Examiner';

-- 4. Snapshot of one user's usage for one feature ──────────────────────────────────────────────
-- p_need = how many uses the next action takes (1 for a mark, 5 for a Study Hub lesson).
-- resets_at = when enough uses come back for that action; clears_at = when the window is empty.
drop function if exists public.ai_usage_snapshot(uuid, text);
create or replace function public.ai_usage_snapshot(p_user uuid, p_feature text, p_need integer default 1)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  c         public.ai_usage_config;
  o         public.ai_usage_overrides;
  v_plan    text;
  v_mult    numeric;
  v_hl      integer;
  v_dl      integer;
  v_h       integer;
  v_d       integer;
  v_hs      timestamptz;
  v_ds      timestamptz;
  v_bonus   integer;
  v_need    integer := greatest(coalesce(p_need, 1), 1);
  v_fit     boolean;
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
  select * into o from public.ai_usage_overrides where user_id = p_user and feature = p_feature;

  v_plan  := public.ai_usage_plan(p_user);
  v_unl   := v_plan in ('premium', 'edu');
  v_mult  := case when c.extension_active then c.extension_multiplier else 1 end;
  v_hl    := floor(c.hourly_limit * v_mult);
  v_dl    := floor(c.daily_limit * v_mult);
  v_bonus := coalesce(o.bonus, 0);
  v_hs    := greatest(now() - interval '1 hour',   coalesce(o.hour_reset_at, '-infinity'::timestamptz));
  v_ds    := greatest(now() - interval '24 hours', coalesce(o.day_reset_at,  '-infinity'::timestamptz));

  select coalesce(sum(amount), 0), max(created_at) + interval '1 hour' into v_h, v_h_clear
    from public.ai_usage_events
   where user_id = p_user and feature = p_feature and not from_bonus and created_at > v_hs;
  select coalesce(sum(amount), 0), max(created_at) + interval '24 hours' into v_d, v_d_clear
    from public.ai_usage_events
   where user_id = p_user and feature = p_feature and not from_bonus and created_at > v_ds;

  -- the oldest use that has to expire before the next action fits inside the limit
  select t.created_at + interval '1 hour' into v_h_reset from (
    select created_at, sum(amount) over (order by created_at, id) as run
      from public.ai_usage_events
     where user_id = p_user and feature = p_feature and not from_bonus and created_at > v_hs) t
   where t.run >= v_h + v_need - v_hl
   order by t.created_at limit 1;
  select t.created_at + interval '24 hours' into v_d_reset from (
    select created_at, sum(amount) over (order by created_at, id) as run
      from public.ai_usage_events
     where user_id = p_user and feature = p_feature and not from_bonus and created_at > v_ds) t
   where t.run >= v_d + v_need - v_dl
   order by t.created_at limit 1;

  v_fit := v_h + v_need <= v_hl and v_d + v_need <= v_dl;

  return jsonb_build_object(
    'feature',   p_feature,
    'label',     c.label,
    'plan',      v_plan,
    'unlimited', v_unl,
    'need',      v_need,
    'bonus',     v_bonus,
    'allowed',   v_plan <> 'none' and (v_unl or v_fit or v_bonus >= v_need),
    'blocked_by', case when v_unl or v_plan = 'none' or v_fit or v_bonus >= v_need then null
                       when v_d + v_need > v_dl then 'day'
                       else 'hour' end,
    'hour', jsonb_build_object('used', v_h, 'limit', v_hl, 'remaining', greatest(v_hl - v_h, 0),
                               'resets_at', v_h_reset, 'clears_at', v_h_clear),
    'day',  jsonb_build_object('used', v_d, 'limit', v_dl, 'remaining', greatest(v_dl - v_d, 0),
                               'resets_at', v_d_reset, 'clears_at', v_d_clear),
    'base', jsonb_build_object('hour', c.hourly_limit, 'day', c.daily_limit),
    'costs', jsonb_build_object('ai_mark', 1, 'study_hub_lesson', 5),
    'extension', jsonb_build_object('active', c.extension_active, 'multiplier', c.extension_multiplier,
                                    'note', c.extension_note),
    'now', now()
  );
end;
$$;
revoke all on function public.ai_usage_snapshot(uuid, text, integer) from public, anon, authenticated;
grant execute on function public.ai_usage_snapshot(uuid, text, integer) to service_role;

-- 5. Learner-facing status (own account only) ─────────────────────────────────────────────────
create or replace function public.ai_usage_status(p_feature text default 'ai_mark')
returns jsonb language plpgsql volatile security definer set search_path = public as $$
begin
  if auth.uid() is null then
    return jsonb_build_object('feature', p_feature, 'plan', 'none', 'allowed', false, 'signed_in', false);
  end if;
  return public.ai_usage_snapshot(auth.uid(), p_feature, 1);
end;
$$;
revoke all on function public.ai_usage_status(text) from public, anon;
grant execute on function public.ai_usage_status(text) to authenticated;

-- 6. Consume uses (edge functions only, service role) ─────────────────────────────────────────
-- Inside the limits the uses count towards the windows; once a limit is reached an owner top-up
-- (bonus) pays for it instead; otherwise the request is refused.
drop function if exists public.ai_usage_consume(uuid, text);
create or replace function public.ai_usage_consume(p_user uuid, p_feature text default 'ai_mark',
                                                   p_amount integer default 1, p_source text default null)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  s     jsonb;
  v_amt integer := least(greatest(coalesce(p_amount, 1), 1), 50);
  v_id  bigint;
  v_fit boolean;
begin
  if p_user is null then
    raise exception 'A user is required';
  end if;
  -- serialise concurrent requests from the same account so two tabs cannot both take the last use
  perform pg_advisory_xact_lock(hashtextextended(p_user::text || ':' || p_feature, 0));
  delete from public.ai_usage_events
   where user_id = p_user and feature = p_feature and created_at < now() - interval '2 days';

  s := public.ai_usage_snapshot(p_user, p_feature, v_amt);
  if (s ->> 'unlimited')::boolean then
    return s || jsonb_build_object('allowed', true, 'event_id', null);   -- Premium / EDU: nothing counted
  end if;
  if not (s ->> 'allowed')::boolean then
    return s || jsonb_build_object('event_id', null);
  end if;

  v_fit := (s -> 'hour' ->> 'used')::int + v_amt <= (s -> 'hour' ->> 'limit')::int
       and (s -> 'day'  ->> 'used')::int + v_amt <= (s -> 'day'  ->> 'limit')::int;
  if v_fit then
    insert into public.ai_usage_events (user_id, feature, amount, source)
    values (p_user, p_feature, v_amt, p_source) returning id into v_id;
  else
    update public.ai_usage_overrides set bonus = bonus - v_amt, updated_at = now()
     where user_id = p_user and feature = p_feature and bonus >= v_amt;
    if not found then
      return s || jsonb_build_object('allowed', false, 'event_id', null);
    end if;
    insert into public.ai_usage_events (user_id, feature, amount, source, from_bonus)
    values (p_user, p_feature, v_amt, p_source, true) returning id into v_id;
  end if;
  return public.ai_usage_snapshot(p_user, p_feature, 1) || jsonb_build_object('allowed', true, 'event_id', v_id, 'spent', v_amt);
end;
$$;
revoke all on function public.ai_usage_consume(uuid, text, integer, text) from public, anon, authenticated;
grant execute on function public.ai_usage_consume(uuid, text, integer, text) to service_role;

-- 7. Refund uses when the AI call failed (edge functions only) ────────────────────────────────
create or replace function public.ai_usage_refund(p_user uuid, p_event_id bigint)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  v_feature text;
  v_amount  integer;
  v_bonus   boolean;
begin
  delete from public.ai_usage_events where id = p_event_id and user_id = p_user
  returning feature, amount, from_bonus into v_feature, v_amount, v_bonus;
  if v_feature is null then
    return jsonb_build_object('refunded', false);
  end if;
  if v_bonus then
    update public.ai_usage_overrides set bonus = bonus + v_amount, updated_at = now()
     where user_id = p_user and feature = v_feature;
  end if;
  return public.ai_usage_snapshot(p_user, v_feature, 1) || jsonb_build_object('refunded', true);
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

-- 9. Owner: look up, reset and top up one learner's AI usage ──────────────────────────────────
-- Used by the Owner tools card on the account page. Learners are found by email.
create or replace function public.ai_usage_admin_user(p_email text)
returns uuid language sql stable security definer set search_path = public as $$
  select id from auth.users where lower(email) = lower(trim(coalesce(p_email, ''))) limit 1;
$$;
revoke all on function public.ai_usage_admin_user(text) from public, anon, authenticated;

create or replace function public.ai_usage_admin_view(p_email text, p_feature text default 'ai_mark')
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  v_user uuid;
  v_name text;
begin
  if not public.edu_is_owner() then
    raise exception 'Forbidden';
  end if;
  v_user := public.ai_usage_admin_user(p_email);
  if v_user is null then
    raise exception 'No account uses that email address';
  end if;
  select to_jsonb(p) ->> 'display_name' into v_name from public.profiles p where p.id = v_user;
  return public.ai_usage_snapshot(v_user, p_feature, 1) || jsonb_build_object(
    'user_id', v_user,
    'email', lower(trim(p_email)),
    'name', v_name,
    'recent', (select coalesce(jsonb_agg(x order by x.created_at desc), '[]'::jsonb) from (
                 select e.created_at, e.amount, e.from_bonus, e.source
                   from public.ai_usage_events e
                  where e.user_id = v_user and e.feature = p_feature
                  order by e.created_at desc limit 8) x));
end;
$$;
revoke all on function public.ai_usage_admin_view(text, text) from public, anon;
grant execute on function public.ai_usage_admin_view(text, text) to authenticated;

-- p_scope: 'hour' clears the hourly window; 'day' clears both windows.
create or replace function public.ai_usage_admin_reset(p_email text, p_scope text default 'hour', p_feature text default 'ai_mark')
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  v_user uuid;
begin
  if not public.edu_is_owner() then
    raise exception 'Forbidden';
  end if;
  if p_scope not in ('hour', 'day') then
    raise exception 'Scope must be hour or day';
  end if;
  v_user := public.ai_usage_admin_user(p_email);
  if v_user is null then
    raise exception 'No account uses that email address';
  end if;
  insert into public.ai_usage_overrides (user_id, feature, hour_reset_at, day_reset_at, updated_by)
  values (v_user, p_feature, now(), case when p_scope = 'day' then now() end, auth.uid())
  on conflict (user_id, feature) do update set
    hour_reset_at = now(),
    day_reset_at  = case when p_scope = 'day' then now() else public.ai_usage_overrides.day_reset_at end,
    updated_at    = now(),
    updated_by    = auth.uid();
  insert into public.ai_usage_admin_log (admin_id, user_id, feature, action)
  values (auth.uid(), v_user, p_feature, 'reset_' || p_scope);
  return public.ai_usage_admin_view(p_email, p_feature);
end;
$$;
revoke all on function public.ai_usage_admin_reset(text, text, text) from public, anon;
grant execute on function public.ai_usage_admin_reset(text, text, text) to authenticated;

-- Adds (or with a negative amount removes) top-up uses. The balance never goes below 0.
create or replace function public.ai_usage_admin_topup(p_email text, p_amount integer, p_feature text default 'ai_mark')
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  v_user uuid;
begin
  if not public.edu_is_owner() then
    raise exception 'Forbidden';
  end if;
  if p_amount is null or p_amount = 0 or abs(p_amount) > 1000 then
    raise exception 'Top-up must be between -1000 and 1000 (not 0)';
  end if;
  v_user := public.ai_usage_admin_user(p_email);
  if v_user is null then
    raise exception 'No account uses that email address';
  end if;
  insert into public.ai_usage_overrides (user_id, feature, bonus, updated_by)
  values (v_user, p_feature, greatest(p_amount, 0), auth.uid())
  on conflict (user_id, feature) do update set
    bonus      = greatest(public.ai_usage_overrides.bonus + p_amount, 0),
    updated_at = now(),
    updated_by = auth.uid();
  insert into public.ai_usage_admin_log (admin_id, user_id, feature, action, amount)
  values (auth.uid(), v_user, p_feature, 'topup', p_amount);
  return public.ai_usage_admin_view(p_email, p_feature);
end;
$$;
revoke all on function public.ai_usage_admin_topup(text, integer, text) from public, anon;
grant execute on function public.ai_usage_admin_topup(text, integer, text) to authenticated;
