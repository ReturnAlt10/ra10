drop function if exists public.get_leaderboard(integer);

create function public.get_leaderboard(limit_count integer default 50)
returns table(
  id uuid,
  username text,
  full_name text,
  profile_pic_url text,
  xp_this_week integer,
  xp_total integer
)
language sql
security definer
set search_path = public
as $$
  select
    p.id,
    p.username,
    p.full_name,
    p.profile_pic_url,
    coalesce(p.xp_this_week, 0)::int as xp_this_week,
    coalesce(p.xp_total, 0)::int as xp_total
  from public.profiles p
  where coalesce(p.xp_this_week, 0) > 0
  order by coalesce(p.xp_this_week, 0) desc, coalesce(p.xp_total, 0) desc
  limit greatest(1, least(coalesce(limit_count, 50), 200));
$$;

grant execute on function public.get_leaderboard(integer) to anon, authenticated, service_role;
