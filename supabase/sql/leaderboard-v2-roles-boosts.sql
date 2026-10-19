-- ═══════════════════════════════════════════════════════════════════════════
-- RA10 — Leaderboard v2: user roles + XP boosts.  Run in the Supabase SQL
-- editor after fix-get-leaderboard-profile-pic.sql. Safe to re-run.
--
-- 1. profiles.user_role ('student' | 'teacher' | 'educator' | 'other'), set
--    through set_user_role() and shown on the leaderboard.
-- 2. get_leaderboard() now also returns user_role.
-- 3. XP boosts (2x / 3x for a limited time) earned as rewards:
--      daily_practice   10+ questions answered today         2x · 15 min · once a day
--      daily_tasks      all daily tasks done (+1 session)    2x · 30 min · once a day
--      streak_7         practised on 7 days in a row         3x · 15 min · once a week
--      weekly_podium    finished top 3 last week             3x · 30 min · once a week
--    Boosts sit in the user's inventory until activated (one active at a time).
--    While active, xp_boost_bonus(base) adds (multiplier - 1) x base XP via
--    increment_xp, capped per call, per boost and per day.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Roles ───────────────────────────────────────────────────────────────
alter table public.profiles add column if not exists user_role text;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_user_role_check') then
    alter table public.profiles add constraint profiles_user_role_check
      check (user_role is null or user_role in ('student', 'teacher', 'educator', 'other'));
  end if;
end $$;

create or replace function public.set_user_role(p_role text)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'Not signed in' using errcode = '28000'; end if;
  if p_role not in ('student', 'teacher', 'educator', 'other') then
    raise exception 'Unknown role' using errcode = '22023';
  end if;
  update public.profiles set user_role = p_role where id = auth.uid();
  return p_role;
end;
$$;
revoke all on function public.set_user_role(text) from public, anon;
grant execute on function public.set_user_role(text) to authenticated;

-- ─── 2. Leaderboard with roles ──────────────────────────────────────────────
drop function if exists public.get_leaderboard(integer);
create function public.get_leaderboard(limit_count integer default 50)
returns table(
  id uuid, username text, full_name text, profile_pic_url text,
  leaderboard_badge text, leaderboard_badge_week date, leaderboard_last_rank integer,
  leaderboard_award_credits integer, xp_this_week integer, xp_total integer, user_role text
)
language sql
security definer
set search_path = public
as $$
  select p.id, p.username, p.full_name, p.profile_pic_url,
         p.leaderboard_badge, p.leaderboard_badge_week, p.leaderboard_last_rank,
         coalesce(p.leaderboard_award_credits, 0)::int,
         coalesce(p.xp_this_week, 0)::int, coalesce(p.xp_total, 0)::int, p.user_role
  from public.profiles p
  where coalesce(p.xp_this_week, 0) > 0
  order by coalesce(p.xp_this_week, 0) desc, coalesce(p.xp_total, 0) desc
  limit greatest(1, least(coalesce(limit_count, 50), 200));
$$;
grant execute on function public.get_leaderboard(integer) to anon, authenticated, service_role;

-- Rank of the signed-in user this week (also works outside the top 50).
create or replace function public.get_my_rank()
returns table(rank integer, xp_this_week integer, total_players integer)
language sql
security definer
set search_path = public
as $$
  with me as (select coalesce(xp_this_week, 0) as xp, coalesce(xp_total, 0) as tot from public.profiles where id = auth.uid())
  select (select count(*) from public.profiles p, me
          where coalesce(p.xp_this_week, 0) > me.xp
             or (coalesce(p.xp_this_week, 0) = me.xp and coalesce(p.xp_total, 0) > me.tot))::int + 1,
         (select xp from me)::int,
         (select count(*) from public.profiles where coalesce(xp_this_week, 0) > 0)::int;
$$;
revoke all on function public.get_my_rank() from public, anon;
grant execute on function public.get_my_rank() to authenticated;

-- ─── 3. XP boosts ───────────────────────────────────────────────────────────
create table if not exists public.xp_boosts (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  source text not null check (source in ('daily_practice', 'daily_tasks', 'streak_7', 'weekly_podium', 'admin')),
  period_key text not null,
  multiplier integer not null check (multiplier in (2, 3)),
  minutes integer not null check (minutes between 5 and 120),
  granted_at timestamptz not null default now(),
  activated_at timestamptz,
  expires_at timestamptz,
  bonus_awarded integer not null default 0,
  unique (user_id, source, period_key)
);
create index if not exists xp_boosts_user_idx on public.xp_boosts (user_id, granted_at desc);
alter table public.xp_boosts enable row level security;
drop policy if exists "xp_boosts own select" on public.xp_boosts;
create policy "xp_boosts own select" on public.xp_boosts for select to authenticated using (user_id = auth.uid());
-- No insert/update/delete policies: changes only happen through the functions below.
grant select on public.xp_boosts to authenticated;

create or replace function public.get_my_boosts()
returns setof public.xp_boosts
language sql
security definer
set search_path = public
as $$
  select * from public.xp_boosts
  where user_id = auth.uid()
    and (activated_at is null or expires_at > now() - interval '1 day')
    and granted_at > now() - interval '14 days'
  order by (expires_at > now()) desc nulls last, granted_at desc
  limit 20;
$$;
revoke all on function public.get_my_boosts() from public, anon;
grant execute on function public.get_my_boosts() to authenticated;

-- Claim a reward boost. Conditions are checked against real activity where possible.
create or replace function public.claim_xp_boost(p_source text)
returns public.xp_boosts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_today date := (now() at time zone 'Europe/London')::date;
  v_key text;
  v_mult integer;
  v_min integer;
  v_q integer;
  v_days integer;
  v_profile record;
  v_row public.xp_boosts;
begin
  if v_uid is null then raise exception 'Not signed in' using errcode = '28000'; end if;

  if p_source = 'daily_practice' then
    select coalesce(sum(questions_total), 0) into v_q from public.revision_sessions
     where user_id = v_uid and (created_at at time zone 'Europe/London')::date = v_today;
    if v_q < 10 then raise exception 'Answer 10 questions today to unlock this boost (% so far).', v_q using errcode = 'P0001'; end if;
    v_key := v_today::text; v_mult := 2; v_min := 15;
  elsif p_source = 'daily_tasks' then
    if not exists (select 1 from public.revision_sessions where user_id = v_uid and (created_at at time zone 'Europe/London')::date = v_today) then
      raise exception 'Finish a revision session today to unlock this boost.' using errcode = 'P0001';
    end if;
    v_key := v_today::text; v_mult := 2; v_min := 30;
  elsif p_source = 'streak_7' then
    select count(distinct (created_at at time zone 'Europe/London')::date) into v_days from public.revision_sessions
     where user_id = v_uid and (created_at at time zone 'Europe/London')::date > v_today - 7;
    if v_days < 7 then raise exception 'Practise on 7 days in a row to unlock this boost (% of 7).', v_days using errcode = 'P0001'; end if;
    v_key := to_char(v_today, 'IYYY-IW'); v_mult := 3; v_min := 15;
  elsif p_source = 'weekly_podium' then
    select leaderboard_last_rank, leaderboard_badge_week into v_profile from public.profiles where id = v_uid;
    if coalesce(v_profile.leaderboard_last_rank, 99) > 3 or v_profile.leaderboard_badge_week is null then
      raise exception 'Finish in the top 3 to unlock this boost.' using errcode = 'P0001';
    end if;
    v_key := v_profile.leaderboard_badge_week::text; v_mult := 3; v_min := 30;
  else
    raise exception 'Unknown boost' using errcode = '22023';
  end if;

  insert into public.xp_boosts (user_id, source, period_key, multiplier, minutes)
  values (v_uid, p_source, v_key, v_mult, v_min)
  on conflict (user_id, source, period_key) do nothing
  returning * into v_row;
  if v_row.id is null then
    raise exception 'You have already claimed this boost.' using errcode = 'P0001';
  end if;
  return v_row;
end;
$$;
revoke all on function public.claim_xp_boost(text) from public, anon;
grant execute on function public.claim_xp_boost(text) to authenticated;

create or replace function public.activate_xp_boost(p_id bigint)
returns public.xp_boosts
language plpgsql
security definer
set search_path = public
as $$
declare v_row public.xp_boosts;
begin
  if exists (select 1 from public.xp_boosts where user_id = auth.uid() and expires_at > now()) then
    raise exception 'A boost is already running. Wait for it to finish.' using errcode = 'P0001';
  end if;
  update public.xp_boosts
     set activated_at = now(), expires_at = now() + make_interval(mins => minutes)
   where id = p_id and user_id = auth.uid() and activated_at is null
  returning * into v_row;
  if v_row.id is null then raise exception 'Boost not available.' using errcode = 'P0001'; end if;
  return v_row;
end;
$$;
revoke all on function public.activate_xp_boost(bigint) from public, anon;
grant execute on function public.activate_xp_boost(bigint) to authenticated;

-- Extra XP for an award that just happened. Called by the client right after
-- increment_xp(base). Caps: 100 base XP per call, 600 bonus per boost, 1500 bonus per day.
create or replace function public.xp_boost_bonus(p_base integer)
returns table(bonus integer, multiplier integer, expires_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.xp_boosts;
  v_bonus integer;
  v_today_bonus integer;
begin
  if auth.uid() is null or coalesce(p_base, 0) <= 0 then return; end if;
  select * into v_row from public.xp_boosts
   where user_id = auth.uid() and expires_at > now()
   order by expires_at desc limit 1 for update;
  if v_row.id is null then return; end if;
  v_bonus := least(p_base, 100) * (v_row.multiplier - 1);
  v_bonus := least(v_bonus, 600 - v_row.bonus_awarded);
  select coalesce(sum(b.bonus_awarded), 0) into v_today_bonus from public.xp_boosts b
   where b.user_id = auth.uid() and b.activated_at > now() - interval '1 day';
  v_bonus := least(v_bonus, 1500 - v_today_bonus);
  if v_bonus <= 0 then
    return query select 0, v_row.multiplier, v_row.expires_at; return;
  end if;
  perform public.increment_xp(v_bonus);
  update public.xp_boosts set bonus_awarded = bonus_awarded + v_bonus where id = v_row.id;
  return query select v_bonus, v_row.multiplier, v_row.expires_at;
end;
$$;
revoke all on function public.xp_boost_bonus(integer) from public, anon;
grant execute on function public.xp_boost_bonus(integer) to authenticated;
