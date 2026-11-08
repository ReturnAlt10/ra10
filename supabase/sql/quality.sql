-- ═══════════════════════════════════════════════════════════════════════════
-- RA10 — Quality ratings (owner-only analytics)              run AFTER edu-platform.sql
--
--  1. content_feedback    learner votes and mistake reports (guide sections, questions,
--                         quiz items, papers, AI Examiner marks)
--  2. feedback_submit()   the ONLY way learners write feedback (validated, rate-limited)
--  3. quality_snapshots   saved content audits and AI Examiner benchmark runs
--  4. Owner RPCs          quality_usage, quality_feedback, quality_reports,
--                         quality_resolve, quality_save_snapshot, quality_snapshots_list
--
-- Everything the owner reads goes through security-definer functions that check
-- public.edu_is_owner() (defined in edu-platform.sql). The owner's own activity and
-- feedback are left out of the statistics so testing never skews the ratings.
-- Safe to re-run.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Feedback ────────────────────────────────────────────────────────────
create table if not exists public.content_feedback (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  unit text not null,                       -- unit path from ra10-units.js, e.g. /revision/btec/level-3/computing-aaq/unit-1
  target text not null check (target in ('guide', 'question', 'mcq', 'paper', 'ai_mark', 'flashcard', 'other')),
  ref text not null default '',             -- guide section id / question id / paper id
  title text,                               -- human label (section heading, question text)
  vote text check (vote in ('helpful', 'not_helpful', 'too_low', 'fair', 'too_high')),
  report_category text check (report_category in ('wrong_answer', 'mark_scheme', 'unclear', 'typo', 'off_spec', 'ai_mark', 'broken', 'other')),
  comment text,
  score numeric,                            -- ai_mark: the mark the AI gave
  max_score numeric,
  meta jsonb,
  status text not null default 'open' check (status in ('open', 'fixed', 'dismissed')),
  resolved_at timestamptz,
  resolved_note text,
  constraint content_feedback_has_content check (vote is not null or report_category is not null)
);
create index if not exists content_feedback_unit_idx on public.content_feedback (unit, created_at desc);
create index if not exists content_feedback_open_idx on public.content_feedback (status, created_at desc) where report_category is not null;
-- one helpful/unhelpful vote per learner per item (AI marks are rated per marking, so not unique)
create unique index if not exists content_feedback_one_vote
  on public.content_feedback (user_id, unit, target, ref)
  where vote is not null and target <> 'ai_mark';

alter table public.content_feedback enable row level security;
drop policy if exists content_feedback_select_own on public.content_feedback;
create policy content_feedback_select_own on public.content_feedback for select to authenticated
  using (user_id = auth.uid());
drop policy if exists content_feedback_delete_own on public.content_feedback;
create policy content_feedback_delete_own on public.content_feedback for delete to authenticated
  using (user_id = auth.uid());
-- no insert/update policies: learners write only through feedback_submit()
revoke insert, update on public.content_feedback from anon, authenticated;
grant select, delete on public.content_feedback to authenticated;

-- ─── 2. feedback_submit ─────────────────────────────────────────────────────
-- p_vote = 'clear' removes the learner's vote on that item.
create or replace function public.feedback_submit(
  p_unit text, p_target text, p_ref text default '', p_title text default null,
  p_vote text default null, p_category text default null, p_comment text default null,
  p_score numeric default null, p_max numeric default null, p_meta jsonb default null)
returns bigint language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_recent integer;
  v_id bigint;
  v_ref text := left(coalesce(p_ref, ''), 200);
begin
  if v_uid is null then raise exception 'Sign in to send feedback'; end if;
  if coalesce(trim(p_unit), '') = '' then raise exception 'Missing unit'; end if;
  if p_target not in ('guide', 'question', 'mcq', 'paper', 'ai_mark', 'flashcard', 'other') then raise exception 'Unknown feedback target'; end if;

  if p_vote = 'clear' then
    delete from public.content_feedback
     where user_id = v_uid and unit = left(p_unit, 200) and target = p_target and ref = v_ref and vote is not null and target <> 'ai_mark';
    return null;
  end if;
  if p_vote is null and p_category is null then raise exception 'Nothing to save'; end if;

  -- 60 pieces of feedback an hour is far more than any real learner sends
  select count(*) into v_recent from public.content_feedback
   where user_id = v_uid and updated_at > now() - interval '1 hour';
  if v_recent >= 60 then raise exception 'Too much feedback in a short time. Please try again later.'; end if;

  if p_vote is not null and p_target <> 'ai_mark' then
    insert into public.content_feedback (user_id, unit, target, ref, title, vote, meta)
    values (v_uid, left(p_unit, 200), p_target, v_ref, left(p_title, 400), p_vote, p_meta)
    on conflict (user_id, unit, target, ref) where vote is not null and target <> 'ai_mark'
    do update set vote = excluded.vote, title = coalesce(excluded.title, content_feedback.title),
                  meta = coalesce(excluded.meta, content_feedback.meta), updated_at = now()
    returning id into v_id;
  else
    insert into public.content_feedback (user_id, unit, target, ref, title, vote, report_category, comment, score, max_score, meta)
    values (v_uid, left(p_unit, 200), p_target, v_ref, left(p_title, 400), p_vote, p_category,
            left(nullif(trim(p_comment), ''), 1500), p_score, p_max, p_meta)
    returning id into v_id;
  end if;
  return v_id;
end $$;
revoke all on function public.feedback_submit(text, text, text, text, text, text, text, numeric, numeric, jsonb) from public, anon;
grant execute on function public.feedback_submit(text, text, text, text, text, text, text, numeric, numeric, jsonb) to authenticated;

-- ─── 3. Snapshots (content audits, AI Examiner benchmark runs) ──────────────
create table if not exists public.quality_snapshots (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  kind text not null check (kind in ('audit', 'benchmark')),
  label text,
  data jsonb not null
);
create index if not exists quality_snapshots_kind_idx on public.quality_snapshots (kind, created_at desc);
alter table public.quality_snapshots enable row level security;   -- no policies: owner RPCs only
revoke all on public.quality_snapshots from anon, authenticated;

-- ─── 4. Owner RPCs ──────────────────────────────────────────────────────────
-- Accounts whose activity is left out of the statistics (the owner and owner-tier accounts).
create or replace function public.quality_excluded_users()
returns setof uuid language sql stable security definer set search_path = public as $$
  select u.id from auth.users u where lower(coalesce(u.email, '')) = 'mistry.hashim@icloud.com'
  union
  select p.id from public.profiles p where lower(coalesce(p.tier, '')) = 'owner';
$$;
revoke all on function public.quality_excluded_users() from public, anon, authenticated;

-- Usage per unit for a window of p_days ending p_offset_days ago (offset lets the page compare periods).
create or replace function public.quality_usage(p_days integer default 30, p_offset_days integer default 0)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_to timestamptz := now() - make_interval(days => greatest(0, coalesce(p_offset_days, 0)));
  v_from timestamptz := v_to - make_interval(days => greatest(1, least(coalesce(p_days, 30), 730)));
  v_out jsonb;
begin
  if not public.edu_is_owner() then raise exception 'Owner only'; end if;
  with ev as (
    select e.user_id, e.session_id, e.created_at, e.kind, e.unit, e.view, e.score, e.max_score, e.duration_s
    from public.activity_events e
    where e.created_at >= v_from and e.created_at < v_to
      and e.unit is not null and e.unit <> ''
      and e.user_id not in (select public.quality_excluded_users())
  ),
  per_user as (
    select unit, user_id, count(distinct created_at::date) as days,
           coalesce(sum(duration_s) filter (where kind = 'view'), 0) as secs
    from ev group by unit, user_id
  ),
  views as (
    select unit, jsonb_object_agg(view, mins) as by_view
    from (select unit, view, round(sum(duration_s) / 60.0, 1) as mins
          from ev where kind = 'view' and view is not null and duration_s is not null group by unit, view) v
    group by unit
  ),
  agg as (
    select unit,
      count(distinct user_id) as learners,
      count(distinct session_id) as sessions,
      count(*) as events,
      round(coalesce(sum(duration_s) filter (where kind = 'view'), 0) / 60.0, 1) as minutes,
      count(*) filter (where kind = 'guide_section') as guide_sections,
      count(distinct user_id) filter (where kind = 'guide_section') as guide_readers,
      count(*) filter (where kind = 'mcq') as mcq,
      count(*) filter (where kind = 'mcq' and score >= 1) as mcq_correct,
      count(*) filter (where kind = 'answer') as answers,
      count(*) filter (where kind = 'ai_examine') as ai,
      round((avg(score / nullif(max_score, 0)) filter (where kind = 'ai_examine' and score is not null)) * 100, 1) as ai_pct,
      count(*) filter (where kind = 'paper_open') as papers,
      count(*) filter (where kind = 'download') as downloads,
      count(distinct view) filter (where kind = 'view') as views_used,
      max(created_at) as last_at
    from ev group by unit
  )
  select coalesce(jsonb_object_agg(a.unit, jsonb_build_object(
      'learners', a.learners, 'sessions', a.sessions, 'events', a.events, 'minutes', a.minutes,
      'returning', (select count(*) from per_user pu where pu.unit = a.unit and pu.days >= 2),
      'median_minutes', (select round((percentile_cont(0.5) within group (order by pu.secs) / 60.0)::numeric, 1) from per_user pu where pu.unit = a.unit),
      'by_view', coalesce(v.by_view, '{}'::jsonb),
      'guide_sections', a.guide_sections, 'guide_readers', a.guide_readers,
      'mcq', a.mcq, 'mcq_correct', a.mcq_correct, 'answers', a.answers,
      'ai', a.ai, 'ai_pct', a.ai_pct, 'papers', a.papers, 'downloads', a.downloads,
      'views_used', a.views_used, 'last_at', a.last_at)), '{}'::jsonb)
    into v_out
  from agg a left join views v on v.unit = a.unit;
  return jsonb_build_object('from', v_from, 'to', v_to, 'units', v_out);
end $$;
revoke all on function public.quality_usage(integer, integer) from public, anon;
grant execute on function public.quality_usage(integer, integer) to authenticated;

-- Feedback grouped by unit / target / item (votes in the window; reports of any age that are still open).
create or replace function public.quality_feedback(p_days integer default 90)
returns table(unit text, target text, ref text, title text, helpful bigint, not_helpful bigint,
              fair bigint, too_low bigint, too_high bigint, reports_open bigint, reports_total bigint,
              ai_score_avg numeric, last_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.edu_is_owner() then raise exception 'Owner only'; end if;
  return query
  select f.unit, f.target, f.ref, max(f.title),
         count(*) filter (where f.vote = 'helpful'), count(*) filter (where f.vote = 'not_helpful'),
         count(*) filter (where f.vote = 'fair'), count(*) filter (where f.vote = 'too_low'), count(*) filter (where f.vote = 'too_high'),
         count(*) filter (where f.report_category is not null and f.status = 'open'),
         count(*) filter (where f.report_category is not null),
         round(avg(f.score / nullif(f.max_score, 0)) filter (where f.target = 'ai_mark') * 100, 1),
         max(f.updated_at)
  from public.content_feedback f
  where f.user_id not in (select public.quality_excluded_users())
    and (f.updated_at >= now() - make_interval(days => greatest(1, least(coalesce(p_days, 90), 730)))
         or (f.report_category is not null and f.status = 'open'))
  group by f.unit, f.target, f.ref
  order by max(f.updated_at) desc
  limit 8000;
end $$;
revoke all on function public.quality_feedback(integer) from public, anon;
grant execute on function public.quality_feedback(integer) to authenticated;

-- Mistake reports inbox.
create or replace function public.quality_reports(p_status text default 'open', p_limit integer default 300)
returns table(id bigint, created_at timestamptz, unit text, target text, ref text, title text, category text,
              comment text, score numeric, max_score numeric, meta jsonb, status text, resolved_note text,
              reporter text, reporter_email text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.edu_is_owner() then raise exception 'Owner only'; end if;
  return query
  select f.id, f.created_at, f.unit, f.target, f.ref, f.title, f.report_category, f.comment, f.score, f.max_score,
         f.meta, f.status, f.resolved_note, coalesce(p.display_name, p.username), u.email::text
  from public.content_feedback f
  join auth.users u on u.id = f.user_id
  left join public.profiles p on p.id = f.user_id
  where f.report_category is not null
    and (coalesce(p_status, 'all') = 'all' or f.status = p_status)
  order by f.created_at desc
  limit greatest(1, least(coalesce(p_limit, 300), 1000));
end $$;
revoke all on function public.quality_reports(text, integer) from public, anon;
grant execute on function public.quality_reports(text, integer) to authenticated;

create or replace function public.quality_resolve(p_id bigint, p_status text, p_note text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.edu_is_owner() then raise exception 'Owner only'; end if;
  if p_status not in ('open', 'fixed', 'dismissed') then raise exception 'Unknown status'; end if;
  update public.content_feedback
     set status = p_status,
         resolved_at = case when p_status = 'open' then null else now() end,
         resolved_note = left(nullif(trim(p_note), ''), 1000)
   where id = p_id and report_category is not null;
end $$;
revoke all on function public.quality_resolve(bigint, text, text) from public, anon;
grant execute on function public.quality_resolve(bigint, text, text) to authenticated;

create or replace function public.quality_save_snapshot(p_kind text, p_data jsonb, p_label text default null)
returns bigint language plpgsql security definer set search_path = public as $$
declare v_id bigint;
begin
  if not public.edu_is_owner() then raise exception 'Owner only'; end if;
  if p_kind not in ('audit', 'benchmark') then raise exception 'Unknown snapshot kind'; end if;
  if pg_column_size(p_data) > 4000000 then raise exception 'Snapshot too large'; end if;
  insert into public.quality_snapshots (kind, label, data) values (p_kind, left(p_label, 200), p_data) returning id into v_id;
  return v_id;
end $$;
revoke all on function public.quality_save_snapshot(text, jsonb, text) from public, anon;
grant execute on function public.quality_save_snapshot(text, jsonb, text) to authenticated;

-- Latest snapshots of a kind (with data), newest first.
create or replace function public.quality_snapshots_list(p_kind text, p_limit integer default 5)
returns table(id bigint, created_at timestamptz, label text, data jsonb)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.edu_is_owner() then raise exception 'Owner only'; end if;
  return query
  select s.id, s.created_at, s.label, s.data from public.quality_snapshots s
  where s.kind = p_kind order by s.created_at desc limit greatest(1, least(coalesce(p_limit, 5), 50));
end $$;
revoke all on function public.quality_snapshots_list(text, integer) from public, anon;
grant execute on function public.quality_snapshots_list(text, integer) to authenticated;
