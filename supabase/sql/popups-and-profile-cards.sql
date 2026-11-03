-- ═══════════════════════════════════════════════════════════════════════════
-- RA10 — account-wide "seen" popups + public profile cards.
-- Run in the Supabase SQL editor after leaderboard-rewards.sql, study-streak.sql
-- and community-forums.sql. Safe to re-run.
--
-- 1. profiles.seen_flags: which popups / notices a user has closed, so they stay
--    closed on every browser and device (and after site updates).
-- 2. get_public_profile(): the safe, public fields shown when anyone clicks a
--    user's name – streak, join date and weekly leaderboard results.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Seen popups ─────────────────────────────────────────────────────────
alter table public.profiles add column if not exists seen_flags jsonb not null default '{}'::jsonb;

-- Merge { key: value } pairs into the signed-in user's seen_flags.
create or replace function public.mark_seen(p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_items jsonb := '{}'::jsonb;
  v_key text;
  v_val jsonb;
  v_out jsonb;
begin
  if auth.uid() is null then raise exception 'Not signed in' using errcode = '28000'; end if;
  if jsonb_typeof(p_items) <> 'object' then raise exception 'Expected an object' using errcode = '22023'; end if;
  -- keep it small: short keys, short string values, at most 50 per call
  for v_key, v_val in select key, value from jsonb_each(p_items) limit 50 loop
    if length(v_key) between 1 and 120 and jsonb_typeof(v_val) = 'string' and length(v_val #>> '{}') <= 2000 then
      v_items := v_items || jsonb_build_object(v_key, v_val);
    end if;
  end loop;
  update public.profiles
     set seen_flags = coalesce(seen_flags, '{}'::jsonb) || v_items
   where id = auth.uid()
   returning seen_flags into v_out;
  -- never let one account grow without limit
  if v_out is not null and (select count(*) from jsonb_object_keys(v_out)) > 400 then
    update public.profiles set seen_flags = v_items where id = auth.uid() returning seen_flags into v_out;
  end if;
  return coalesce(v_out, '{}'::jsonb);
end;
$$;
revoke all on function public.mark_seen(jsonb) from public, anon;
grant execute on function public.mark_seen(jsonb) to authenticated;

-- ─── 2. Public profile card ─────────────────────────────────────────────────
-- Look up by id, or by username when the id isn't known.
drop function if exists public.get_public_profile(uuid, text);
create function public.get_public_profile(p_id uuid default null, p_username text default null)
returns table (
  id uuid, username text, full_name text, profile_pic_url text, badge text, user_role text,
  joined_at timestamptz, xp_total integer, xp_this_week integer,
  streak integer, best_streak integer, study_days integer,
  wins integer, podiums integer, best_rank integer, last_win_week date
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  select p.id into v_id from public.profiles p
   where (p_id is not null and p.id = p_id)
      or (p_id is null and p_username is not null and lower(p.username) = lower(btrim(p_username)))
   limit 1;
  if v_id is null then return; end if;

  return query
  with d as (
    select sd.day from public.study_days sd where sd.user_id = v_id
  ),
  g as (
    select d.day, d.day - (row_number() over (order by d.day))::int as grp from d
  ),
  runs as (
    select grp, count(*)::int as len, max(day) as last_day from g group by grp
  ),
  lb as (
    select count(*) filter (where r.rank = 1)::int as wins,
           count(*)::int as podiums,
           min(r.rank)::int as best_rank,
           max(r.week_start) filter (where r.rank = 1) as last_win_week
      from public.leaderboard_weekly_results r
     where r.profile_id = v_id
  )
  select p.id, p.username::text, p.full_name::text, p.profile_pic_url::text,
         case when lower(p.email) = 'mistry.hashim@icloud.com' then 'owner'
              when exists (select 1 from public.community_staff s where s.email = lower(p.email)) then 'admin'
              else null end::text,
         p.user_role::text,
         p.created_at,
         coalesce(p.xp_total, 0)::int, coalesce(p.xp_this_week, 0)::int,
         -- current streak: the run that ends today or yesterday (days are the user's local dates)
         coalesce((select r.len from runs r where r.last_day >= (now() at time zone 'utc')::date - 1 order by r.last_day desc limit 1), 0),
         coalesce((select max(r.len) from runs r), 0),
         (select count(*)::int from d),
         coalesce(lb.wins, 0), coalesce(lb.podiums, 0), lb.best_rank, lb.last_win_week
    from public.profiles p, lb
   where p.id = v_id;
end;
$$;
grant execute on function public.get_public_profile(uuid, text) to anon, authenticated;
