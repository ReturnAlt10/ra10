-- ═══════════════════════════════════════════════════════════════════════════
-- RA10 Study Hub — AI daily lessons (Premium, with one free trial lesson).
-- Run in the Supabase SQL editor AFTER edu-platform.sql (uses activity_events
-- and the increment_xp guard). Safe to re-run.
--
--  study_lessons      one row per lesson (daily or made by the learner)
--  study_hub_trials   records the single free lesson a non-Premium account may make
--  study_hub_premium  who counts as Premium (single source of truth, also used by the
--                     edge function `study-hub`)
--  study_hub_status   access + streak + recent lessons for the app's home screen
--
-- Lessons are only ever CREATED by the `study-hub` edge function (service role),
-- which enforces Premium / the free trial. Learners may read their own lessons and
-- save their progress through them.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.study_lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  lesson_date date not null default ((now() at time zone 'Europe/London')::date),
  kind text not null default 'custom' check (kind in ('daily', 'custom')),
  trial boolean not null default false,
  unit text,
  topic text,
  title text not null,
  emoji text,
  reason text,
  minutes integer,
  content jsonb not null default '{}'::jsonb,       -- { summary, steps: [...] }
  status text not null default 'ready' check (status in ('ready', 'in_progress', 'done')),
  progress jsonb not null default '{}'::jsonb,      -- { i, results: { stepIndex: {ok, score, max} } }
  score integer,
  max_score integer,
  xp integer not null default 0,
  completed_at timestamptz,
  provider text
);
create index if not exists study_lessons_user_idx on public.study_lessons (user_id, created_at desc);
create unique index if not exists study_lessons_one_daily on public.study_lessons (user_id, lesson_date) where kind = 'daily';

-- Teacher-set lessons (RA10 EDU): a teacher's class lesson is a 'template' row they own and can
-- edit; each student plays their own 'assigned' copy (or a personalised lesson built for them).
alter table public.study_lessons add column if not exists assignment_id uuid;
alter table public.study_lessons add column if not exists item_id text;
alter table public.study_lessons add column if not exists class_id uuid;
alter table public.study_lessons add column if not exists school_id text;
alter table public.study_lessons drop constraint if exists study_lessons_kind_check;
alter table public.study_lessons add constraint study_lessons_kind_check check (kind in ('daily', 'custom', 'assigned', 'template'));
create unique index if not exists study_lessons_one_per_item on public.study_lessons (user_id, assignment_id, item_id) where assignment_id is not null;

create table if not exists public.study_hub_trials (
  user_id uuid primary key references auth.users (id) on delete cascade,
  lesson_id uuid,
  used_at timestamptz not null default now()
);

alter table public.study_lessons enable row level security;
alter table public.study_hub_trials enable row level security;

drop policy if exists study_lessons_select on public.study_lessons;
create policy study_lessons_select on public.study_lessons for select to authenticated
  using (user_id = auth.uid());
-- learners save progress only; content / kind / trial / xp are protected by the trigger below
drop policy if exists study_lessons_update on public.study_lessons;
create policy study_lessons_update on public.study_lessons for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists study_lessons_delete on public.study_lessons;
create policy study_lessons_delete on public.study_lessons for delete to authenticated
  using (user_id = auth.uid());
drop policy if exists study_hub_trials_select on public.study_hub_trials;
create policy study_hub_trials_select on public.study_hub_trials for select to authenticated
  using (user_id = auth.uid());

revoke insert on public.study_lessons from authenticated, anon;
revoke insert, update, delete on public.study_hub_trials from authenticated, anon;

-- Learners can move through a lesson, but not rewrite it or mark it complete themselves
-- (completion + XP go through the edge function so XP is awarded once).
create or replace function public.study_lessons_guard()
returns trigger language plpgsql as $$
begin
  if current_user in ('authenticated', 'anon') then
    new.id := old.id; new.user_id := old.user_id; new.created_at := old.created_at;
    new.lesson_date := old.lesson_date; new.kind := old.kind; new.trial := old.trial;
    new.unit := old.unit; new.topic := old.topic; new.title := old.title; new.emoji := old.emoji;
    new.reason := old.reason; new.minutes := old.minutes; new.content := old.content;
    new.xp := old.xp; new.completed_at := old.completed_at; new.provider := old.provider;
    new.score := old.score; new.max_score := old.max_score;
    if new.status = 'done' and old.status <> 'done' then new.status := 'in_progress'; end if;
    if old.status = 'done' then new.status := 'done'; end if;
    if pg_column_size(new.progress) > 60000 then new.progress := old.progress; end if;
    new.assignment_id := old.assignment_id; new.item_id := old.item_id; new.class_id := old.class_id; new.school_id := old.school_id;
    if old.kind = 'template' then new.status := old.status; new.progress := old.progress; end if;
  end if;
  return new;
end $$;
drop trigger if exists trg_study_lessons_guard on public.study_lessons;
create trigger trg_study_lessons_guard before update on public.study_lessons
  for each row execute function public.study_lessons_guard();

-- Who has Study Hub? Premium plans (Pro / all subjects, Ultra), the owner, and everyone on a
-- school (RA10 EDU) plan — students, teachers and EDU admins. Free accounts get one free trial
-- lesson. Change it here when subscriptions launch — the edge function asks this function too.
create or replace function public.study_hub_premium(p_user uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    left join auth.users u on u.id = p.id
    where p.id = p_user
      and (lower(coalesce(p.tier, '')) in ('all_subjects', 'ultra', 'owner', 'school_student', 'school_teacher', 'school_admin')
           or coalesce(p.unlimited_credits, false)
           or lower(coalesce(u.email, '')) = 'mistry.hashim@icloud.com'))
  or exists (
    select 1 from public.school_members m
    join auth.users u on lower(u.email) = lower(m.email)
    where u.id = p_user and m.status = 'active');
$$;
revoke all on function public.study_hub_premium(uuid) from public, anon;
grant execute on function public.study_hub_premium(uuid) to authenticated, service_role;

-- Home screen data: access, streak, totals and the lesson list (without lesson content).
create or replace function public.study_hub_status()
returns json language plpgsql stable security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_today date := (now() at time zone 'Europe/London')::date;
  v_premium boolean;
  v_trial boolean;
  v_streak integer := 0;
  v_d date;
begin
  if v_uid is null then return json_build_object('signed_in', false); end if;
  v_premium := public.study_hub_premium(v_uid);
  v_trial := exists (select 1 from public.study_hub_trials where user_id = v_uid);
  -- streak: consecutive days (ending today, or yesterday if today isn't done yet) with a finished lesson
  v_d := case when exists (select 1 from public.study_lessons where user_id = v_uid and status = 'done'
                            and (completed_at at time zone 'Europe/London')::date = v_today)
              then v_today else v_today - 1 end;
  while exists (select 1 from public.study_lessons where user_id = v_uid and status = 'done'
                and (completed_at at time zone 'Europe/London')::date = v_d) loop
    v_streak := v_streak + 1; v_d := v_d - 1;
    exit when v_streak > 3650;
  end loop;
  return json_build_object(
    'signed_in', true,
    'premium', v_premium,
    'trial_used', v_trial,
    'can_create', v_premium or not v_trial,
    'today', v_today,
    'streak', v_streak,
    'done_today', exists (select 1 from public.study_lessons where user_id = v_uid and status = 'done'
                          and (completed_at at time zone 'Europe/London')::date = v_today),
    'total_done', (select count(*) from public.study_lessons where user_id = v_uid and status = 'done'),
    'total_xp', (select coalesce(sum(xp), 0) from public.study_lessons where user_id = v_uid),
    'week', (select coalesce(json_agg(json_build_object('day', d::date,
                      'done', exists (select 1 from public.study_lessons l where l.user_id = v_uid and l.status = 'done'
                                       and (l.completed_at at time zone 'Europe/London')::date = d::date)) order by d), '[]'::json)
               from generate_series(v_today - 6, v_today, interval '1 day') d),
    'daily', (select json_build_object('id', id, 'title', title, 'emoji', emoji, 'status', status, 'reason', reason,
                                       'minutes', minutes, 'unit', unit, 'topic', topic, 'score', score, 'max_score', max_score)
                from public.study_lessons where user_id = v_uid and kind = 'daily' and lesson_date = v_today limit 1),
    'lessons', (select coalesce(json_agg(j order by created_at desc), '[]'::json) from (
                  select created_at, json_build_object('id', id, 'title', title, 'emoji', emoji, 'kind', kind, 'status', status,
                         'unit', unit, 'topic', topic, 'score', score, 'max_score', max_score, 'xp', xp, 'minutes', minutes,
                         'lesson_date', lesson_date, 'created_at', created_at, 'trial', trial,
                         'assignment_id', assignment_id, 'item_id', item_id) as j
                  from public.study_lessons where user_id = v_uid and kind <> 'template' order by created_at desc limit 60) x)
  );
end $$;
revoke all on function public.study_hub_status() from public, anon;
grant execute on function public.study_hub_status() to authenticated;
