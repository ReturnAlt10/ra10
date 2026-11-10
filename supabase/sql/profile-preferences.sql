-- RA10 — learner preferences stored on the profile.
-- Run after leaderboard-v2-roles-boosts.sql. Safe to re-run.
--
--   1. profiles.exam_subjects (text[]) — the exam IDs (EXAM_DATA ids) a learner
--      has chosen to sit. Powers the dashboard "next exam" countdown so it
--      never infers a learner's exams from the modules they happen to open.
--   2. set_exam_subjects() — own-row writer, mirroring set_user_role().
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.profiles add column if not exists exam_subjects text[];

create or replace function public.set_exam_subjects(p_ids text[])
returns text[]
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_ids text[];
begin
  if v_uid is null then raise exception 'Not signed in' using errcode = '28000'; end if;
  -- Keep only short, well-formed IDs, de-duplicated, capped at a sane size.
  select coalesce(array_agg(distinct left(x, 64)), '{}')
    into v_ids
    from unnest(coalesce(p_ids, '{}'::text[])) as x
   where x is not null and btrim(x) <> '';
  v_ids := coalesce(v_ids[1:100], '{}');
  update public.profiles set exam_subjects = v_ids where id = v_uid;
  return v_ids;
end;
$$;
revoke all on function public.set_exam_subjects(text[]) from public, anon;
grant execute on function public.set_exam_subjects(text[]) to authenticated;
