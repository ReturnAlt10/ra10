-- Weekly leaderboard settlement.
-- Run after the profiles table and the profile privilege guard exist.

alter table public.profiles
  add column if not exists leaderboard_badge text,
  add column if not exists leaderboard_badge_week date,
  add column if not exists leaderboard_last_rank integer,
  add column if not exists leaderboard_award_credits integer not null default 0;

create table if not exists public.leaderboard_weekly_results (
  week_start date not null,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  rank integer not null check (rank between 1 and 3),
  credits_awarded integer not null check (credits_awarded >= 0),
  badge text not null,
  settled_at timestamptz not null default now(),
  primary key (week_start, profile_id),
  unique (week_start, rank)
);

alter table public.leaderboard_weekly_results enable row level security;

drop policy if exists "Leaderboard results are publicly readable"
  on public.leaderboard_weekly_results;
create policy "Leaderboard results are publicly readable"
  on public.leaderboard_weekly_results for select
  using (true);
grant select on public.leaderboard_weekly_results to anon, authenticated;

create or replace function public.settle_previous_leaderboard()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_week_start date := date_trunc('week', now())::date - 7;
  v_count integer := 0;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  -- Serialize the rollover so two users opening the board at once cannot
  -- race the unique weekly podium rows.
  perform pg_advisory_xact_lock(hashtext('ra10-leaderboard-settlement'));

  -- A weekly key makes retries from multiple browsers harmless.
  if exists (
    select 1
    from public.leaderboard_weekly_results
    where week_start = v_week_start
  ) then
    return json_build_object('ok', true, 'settled', false, 'week_start', v_week_start);
  end if;

  perform set_config('app.skip_profile_priv_check', 'true', true);

  with ranked as (
    select
      p.id,
      row_number() over (
        order by coalesce(p.xp_this_week, 0) desc, coalesce(p.xp_total, 0) desc, p.id
      )::integer as rank
    from public.profiles p
    where coalesce(p.xp_this_week, 0) > 0
  ),
  podium as (
    select
      id,
      rank,
      case rank when 1 then 30 when 2 then 20 when 3 then 10 else 0 end as credits_awarded,
      case rank when 1 then '🥇 1st' when 2 then '🥈 2nd' when 3 then '🥉 3rd' end as badge
    from ranked
    where rank <= 3
  ),
  inserted as (
    insert into public.leaderboard_weekly_results (
      week_start, profile_id, rank, credits_awarded, badge
    )
    select v_week_start, id, rank, credits_awarded, badge
    from podium
    on conflict (week_start, profile_id) do nothing
    returning profile_id, rank, credits_awarded, badge
  )
  update public.profiles p
  set credits = coalesce(p.credits, 0) + i.credits_awarded,
      leaderboard_badge = i.badge || ' · Last week',
      leaderboard_badge_week = v_week_start,
      leaderboard_last_rank = i.rank,
      leaderboard_award_credits = i.credits_awarded
  from inserted i
  where p.id = i.profile_id;

  get diagnostics v_count = row_count;

  update public.profiles
  set xp_this_week = 0
  where coalesce(xp_this_week, 0) > 0;

  return json_build_object(
    'ok', true,
    'settled', true,
    'week_start', v_week_start,
    'winners', v_count
  );
end;
$$;

revoke all on function public.settle_previous_leaderboard() from public;
grant execute on function public.settle_previous_leaderboard() to authenticated;
