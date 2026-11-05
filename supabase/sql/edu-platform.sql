-- ═══════════════════════════════════════════════════════════════════════════
-- RA10 EDU platform + activity tracking + XP abuse guard.
-- Run in the Supabase SQL editor AFTER security-hardening-profiles.sql and
-- leaderboard-v2-roles-boosts.sql. Safe to re-run.
--
--  1. Helpers           edu_my_email(), edu_is_owner(), edu_is_school_admin(),
--                       edu_is_school_staff(), edu_teaches_class(), edu_in_class(),
--                       edu_can_view_student()
--  2. Schools           extra columns on schools / school_members
--  3. Classes           edu_classes, edu_class_members
--  4. Assignments       edu_assignments, edu_submissions
--  5. Feedback          edu_comments (comments + recommended work), edu_ai_reports
--  6. Activity          activity_events (every question, answer, guide section, page)
--  7. RPCs              edu_setup_school, edu_my_context, edu_accept_invite,
--                       edu_decline_invite, edu_student_summary, my_activity_summary
--  8. School entitlement only applies once the invite is accepted
--  9. XP guard          increment_xp() now caps per call / per minute / per day
-- 10. Grant the EDU admin role to business.returnalt10@gmail.com (test account)
-- ═══════════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

alter table public.school_members add column if not exists is_admin boolean default false;

-- ─── 1. Helpers ─────────────────────────────────────────────────────────────
create or replace function public.edu_my_email()
returns text language sql stable security definer set search_path = public as $$
  select lower(coalesce((select email from auth.users where id = auth.uid()), ''));
$$;

create or replace function public.edu_is_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select public.edu_my_email() = 'mistry.hashim@icloud.com'
      or exists (select 1 from public.profiles p where p.id = auth.uid() and lower(coalesce(p.tier, '')) = 'owner');
$$;

-- School admin = owner of the school row, or a member flagged is_admin.
-- The RA10 platform owner account is deliberately NOT an EDU admin anywhere.
create or replace function public.edu_is_school_admin(p_school text)
returns boolean language sql stable security definer set search_path = public as $$
  select auth.uid() is not null and not public.edu_is_owner() and (
    exists (select 1 from public.schools s where s.id::text = p_school and s.owner_id = auth.uid())
    or exists (select 1 from public.school_members m
               where m.school_id::text = p_school and lower(m.email) = public.edu_my_email()
                 and m.status = 'active' and coalesce(m.is_admin, false))
  );
$$;

-- Staff (first version — redefined after the classes table exists, in section 3)
create or replace function public.edu_is_school_staff(p_school text)
returns boolean language sql stable security definer set search_path = public as $$
  select public.edu_is_school_admin(p_school)
      or exists (select 1 from public.school_members m
                 where m.school_id::text = p_school and lower(m.email) = public.edu_my_email()
                   and m.role = 'teacher' and m.status <> 'removed');
$$;

-- ─── 2. Schools: extra columns ──────────────────────────────────────────────
alter table public.schools add column if not exists website text;
alter table public.schools add column if not exists logo_url text;
alter table public.schools add column if not exists offered_subjects text[] default array[]::text[];
alter table public.schools add column if not exists ra10_units text[] default array[]::text[];
alter table public.schools add column if not exists onboarded_at timestamptz;
alter table public.schools add column if not exists brand_color text;

alter table public.school_members add column if not exists user_id uuid;
alter table public.school_members add column if not exists display_name text;
alter table public.school_members add column if not exists is_admin boolean default false;
alter table public.school_members add column if not exists invited_by uuid;
alter table public.school_members add column if not exists invited_at timestamptz default now();
alter table public.school_members add column if not exists accepted_at timestamptz;

-- ─── 3. Classes ─────────────────────────────────────────────────────────────
create table if not exists public.edu_classes (
  id uuid primary key default gen_random_uuid(),
  school_id text not null,
  name text not null check (char_length(name) between 1 and 80),
  description text,
  year_group text,
  color text default '#2563eb',
  units text[] not null default array[]::text[],      -- internal unit paths, e.g. /revision/btec/level-3/IT-AAQ/unit-2
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  archived boolean not null default false
);
create index if not exists edu_classes_school_idx on public.edu_classes (school_id);

create table if not exists public.edu_class_members (
  class_id uuid not null references public.edu_classes (id) on delete cascade,
  email text not null,
  user_id uuid,
  role text not null default 'student' check (role in ('student', 'teacher')),
  status text not null default 'invited' check (status in ('invited', 'active')),
  added_by uuid default auth.uid(),
  added_at timestamptz not null default now(),
  primary key (class_id, email)
);
create index if not exists edu_class_members_email_idx on public.edu_class_members (lower(email));
create index if not exists edu_class_members_user_idx on public.edu_class_members (user_id);

-- Staff = school admin, anyone with a (not removed) teacher membership at the school,
-- or anyone who teaches one of the school's classes.
create or replace function public.edu_is_school_staff(p_school text)
returns boolean language sql stable security definer set search_path = public as $$
  select public.edu_is_school_admin(p_school)
      or exists (select 1 from public.school_members m
                 where m.school_id::text = p_school and lower(m.email) = public.edu_my_email()
                   and m.role = 'teacher' and m.status <> 'removed')
      or exists (select 1 from public.edu_class_members cm
                 join public.edu_classes c on c.id = cm.class_id
                 where c.school_id = p_school and cm.role = 'teacher'
                   and (cm.user_id = auth.uid() or lower(cm.email) = public.edu_my_email()));
$$;

create or replace function public.edu_class_school(p_class uuid)
returns text language sql stable security definer set search_path = public as $$
  select school_id from public.edu_classes where id = p_class;
$$;

-- Is this person THIS class's teacher (or the school's EDU admin)? Used to decide which classes
-- and assignments appear on their own homepage.
create or replace function public.edu_is_class_teacher(p_class uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select auth.uid() is not null and (
    public.edu_is_school_admin(public.edu_class_school(p_class))
    or exists (select 1 from public.edu_class_members cm
               where cm.class_id = p_class and cm.role = 'teacher'
                 and (cm.user_id = auth.uid() or lower(cm.email) = public.edu_my_email()))
  );
$$;

-- May this person manage the class (set / edit assignments, see the roster and students' work)?
-- Any member of staff at the class's school may, not only the class's own teacher(s): staff
-- cover each other's classes, and this keeps "can view" and "can create" consistent.
create or replace function public.edu_teaches_class(p_class uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select auth.uid() is not null and (
    public.edu_is_class_teacher(p_class)
    or public.edu_is_school_staff(public.edu_class_school(p_class))
  );
$$;

create or replace function public.edu_in_class(p_class uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select auth.uid() is not null and exists (
    select 1 from public.edu_class_members cm
    where cm.class_id = p_class and cm.status = 'active'
      and (cm.user_id = auth.uid() or lower(cm.email) = public.edu_my_email()));
$$;

-- Can the caller see this student's work? (platform owner, the student, a teacher
-- of one of their classes, or an admin of their school)
create or replace function public.edu_can_view_student(p_student uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select auth.uid() is not null and (
    p_student = auth.uid()
    or public.edu_is_owner()
    or exists (
      select 1 from public.edu_class_members s
      join public.edu_classes c on c.id = s.class_id
      where s.role = 'student'
        and (s.user_id = p_student or lower(s.email) = lower(coalesce((select email from auth.users where id = p_student), '#')))
        and public.edu_teaches_class(c.id))
    or exists (
      select 1 from public.profiles p
      where p.id = p_student and p.school_id is not null and public.edu_is_school_admin(p.school_id::text))
  );
$$;

alter table public.edu_classes enable row level security;
alter table public.edu_class_members enable row level security;

drop policy if exists edu_classes_select on public.edu_classes;
create policy edu_classes_select on public.edu_classes for select to authenticated
  using (public.edu_is_school_staff(school_id) or public.edu_in_class(id) or public.edu_teaches_class(id));
drop policy if exists edu_classes_insert on public.edu_classes;
create policy edu_classes_insert on public.edu_classes for insert to authenticated
  with check (public.edu_is_school_staff(school_id));
drop policy if exists edu_classes_update on public.edu_classes;
create policy edu_classes_update on public.edu_classes for update to authenticated
  using (public.edu_teaches_class(id)) with check (public.edu_teaches_class(id));
drop policy if exists edu_classes_delete on public.edu_classes;
create policy edu_classes_delete on public.edu_classes for delete to authenticated
  using (public.edu_is_school_admin(school_id));

drop policy if exists edu_cm_select on public.edu_class_members;
create policy edu_cm_select on public.edu_class_members for select to authenticated
  using (public.edu_teaches_class(class_id) or user_id = auth.uid() or lower(email) = public.edu_my_email());
-- a teacher who creates a class can add themselves as its teacher (after that, edu_teaches_class covers it)
drop policy if exists edu_cm_self_teacher on public.edu_class_members;
create policy edu_cm_self_teacher on public.edu_class_members for insert to authenticated
  with check (role = 'teacher' and lower(email) = public.edu_my_email()
              and public.edu_is_school_staff(public.edu_class_school(class_id)));
drop policy if exists edu_cm_write on public.edu_class_members;
create policy edu_cm_write on public.edu_class_members for all to authenticated
  using (public.edu_teaches_class(class_id)) with check (public.edu_teaches_class(class_id));

-- ─── 4. Assignments ─────────────────────────────────────────────────────────
-- items: [{ id, type: 'question'|'mcq'|'guide'|'topic'|'paper', unit, ref, title, marks, count, aim, topic }]
create table if not exists public.edu_assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.edu_classes (id) on delete cascade,
  school_id text not null,
  title text not null check (char_length(title) between 1 and 140),
  instructions text,
  items jsonb not null default '[]'::jsonb,
  due_at timestamptz,
  status text not null default 'published' check (status in ('draft', 'published', 'closed')),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists edu_assignments_class_idx on public.edu_assignments (class_id, created_at desc);

create table if not exists public.edu_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.edu_assignments (id) on delete cascade,
  user_id uuid not null default auth.uid(),
  item_id text not null,
  item_type text,
  question_ref text,
  question_text text,
  answer text,
  score numeric,
  max_score numeric,
  feedback jsonb,
  done boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (assignment_id, user_id, item_id)
);
create index if not exists edu_submissions_user_idx on public.edu_submissions (user_id, updated_at desc);

create or replace function public.edu_assignment_class(p_assignment uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select class_id from public.edu_assignments where id = p_assignment;
$$;

alter table public.edu_assignments enable row level security;
alter table public.edu_submissions enable row level security;

drop policy if exists edu_asg_select on public.edu_assignments;
create policy edu_asg_select on public.edu_assignments for select to authenticated
  using (public.edu_teaches_class(class_id) or (status <> 'draft' and public.edu_in_class(class_id)));
drop policy if exists edu_asg_write on public.edu_assignments;
create policy edu_asg_write on public.edu_assignments for all to authenticated
  using (public.edu_teaches_class(class_id))
  with check (public.edu_teaches_class(class_id) and school_id = public.edu_class_school(class_id));

drop policy if exists edu_sub_select on public.edu_submissions;
create policy edu_sub_select on public.edu_submissions for select to authenticated
  using (user_id = auth.uid() or public.edu_teaches_class(public.edu_assignment_class(assignment_id)));
drop policy if exists edu_sub_insert on public.edu_submissions;
create policy edu_sub_insert on public.edu_submissions for insert to authenticated
  with check (user_id = auth.uid() and public.edu_in_class(public.edu_assignment_class(assignment_id)));
drop policy if exists edu_sub_update on public.edu_submissions;
create policy edu_sub_update on public.edu_submissions for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ─── 5. Comments, recommended work, AI reports ─────────────────────────────
create table if not exists public.edu_comments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null,
  author_id uuid not null default auth.uid(),
  author_name text,
  class_id uuid references public.edu_classes (id) on delete set null,
  assignment_id uuid references public.edu_assignments (id) on delete cascade,
  submission_id uuid references public.edu_submissions (id) on delete cascade,
  activity_id bigint,
  kind text not null default 'comment' check (kind in ('comment', 'recommendation')),
  body text not null check (char_length(body) between 1 and 4000),
  recommendation jsonb,           -- { unit, type, ref, title }
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists edu_comments_student_idx on public.edu_comments (student_id, created_at desc);

create table if not exists public.edu_ai_reports (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null,
  class_id uuid,
  author_id uuid default auth.uid(),
  report jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists edu_ai_reports_student_idx on public.edu_ai_reports (student_id, created_at desc);

alter table public.edu_comments enable row level security;
alter table public.edu_ai_reports enable row level security;

drop policy if exists edu_comments_select on public.edu_comments;
create policy edu_comments_select on public.edu_comments for select to authenticated
  using (student_id = auth.uid() or author_id = auth.uid() or public.edu_can_view_student(student_id));
drop policy if exists edu_comments_insert on public.edu_comments;
create policy edu_comments_insert on public.edu_comments for insert to authenticated
  with check (author_id = auth.uid() and student_id <> auth.uid() and public.edu_can_view_student(student_id));
drop policy if exists edu_comments_delete on public.edu_comments;
create policy edu_comments_delete on public.edu_comments for delete to authenticated
  using (author_id = auth.uid());

drop policy if exists edu_ai_reports_select on public.edu_ai_reports;
create policy edu_ai_reports_select on public.edu_ai_reports for select to authenticated
  using (public.edu_can_view_student(student_id) and student_id <> auth.uid());

-- Students mark comments as read without being able to edit them.
create or replace function public.edu_mark_comments_read(p_ids uuid[])
returns integer language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  update public.edu_comments set read_at = now()
   where id = any(p_ids) and student_id = auth.uid() and read_at is null;
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.edu_mark_comments_read(uuid[]) from public, anon;
grant execute on function public.edu_mark_comments_read(uuid[]) to authenticated;

-- ─── 6. Activity events (progress monitoring) ──────────────────────────────
-- kind: page_view | view | question | mcq | ai_examine | guide_section | paper_open |
--       answer | flashcard | assignment | download | search
create table if not exists public.activity_events (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  session_id text,
  kind text not null check (char_length(kind) <= 32),
  unit text,                 -- internal unit path or app key
  path text,                 -- page or route
  view text,                 -- unit section (guide, quiz, papers …)
  ref text,                  -- question id / guide section id / paper id
  title text,                -- human label (question text, section heading …)
  answer text,               -- what the learner wrote / chose
  score numeric,
  max_score numeric,
  duration_s integer,
  meta jsonb
);
create index if not exists activity_events_user_idx on public.activity_events (user_id, created_at desc);
create index if not exists activity_events_kind_idx on public.activity_events (kind, created_at desc);

-- Keep rows small and stop one account flooding the table.
create or replace function public.activity_events_guard()
returns trigger language plpgsql security definer set search_path = public as $$
declare recent integer;
begin
  new.user_id := coalesce(auth.uid(), new.user_id);
  new.created_at := now();
  new.title := left(new.title, 600);
  new.answer := left(new.answer, 12000);
  new.path := left(new.path, 300);
  new.unit := left(new.unit, 160);
  new.view := left(new.view, 60);
  new.ref := left(new.ref, 160);
  new.session_id := left(new.session_id, 64);
  if new.meta is not null and pg_column_size(new.meta) > 8000 then new.meta := null; end if;
  select count(*) into recent from public.activity_events
   where user_id = new.user_id and created_at > now() - interval '1 minute';
  if recent >= 120 then return null; end if;   -- silently drop the flood
  return new;
end $$;
drop trigger if exists trg_activity_events_guard on public.activity_events;
create trigger trg_activity_events_guard before insert on public.activity_events
  for each row execute function public.activity_events_guard();

alter table public.activity_events enable row level security;
drop policy if exists activity_insert_own on public.activity_events;
create policy activity_insert_own on public.activity_events for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists activity_select on public.activity_events;
create policy activity_select on public.activity_events for select to authenticated
  using (user_id = auth.uid() or public.edu_can_view_student(user_id));
drop policy if exists activity_delete_own on public.activity_events;
create policy activity_delete_own on public.activity_events for delete to authenticated
  using (user_id = auth.uid());

-- ─── 7. RPCs ────────────────────────────────────────────────────────────────

-- Onboarding: create / update the caller's school (EDU admins only).
create or replace function public.edu_setup_school(
  p_name text, p_website text default null, p_logo_url text default null,
  p_subjects text[] default null, p_units text[] default null, p_color text default null)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_tier text;
  v_school public.schools;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  select lower(coalesce(tier, '')) into v_tier from public.profiles where id = auth.uid();
  if v_tier <> 'school_admin' or public.edu_is_owner() then
    raise exception 'EDU admin plan required' using errcode = '42501';
  end if;
  if coalesce(trim(p_name), '') = '' then raise exception 'School name required'; end if;

  select * into v_school from public.schools where owner_id = auth.uid() limit 1;
  if v_school.id is null then
    insert into public.schools (owner_id, name) values (auth.uid(), trim(p_name)) returning * into v_school;
  end if;

  update public.schools set
    name = trim(p_name),
    website = coalesce(nullif(trim(p_website), ''), website),
    logo_url = coalesce(nullif(trim(p_logo_url), ''), logo_url),
    offered_subjects = coalesce(p_subjects, offered_subjects),
    ra10_units = coalesce(p_units, ra10_units),
    brand_color = coalesce(nullif(trim(p_color), ''), brand_color),
    onboarded_at = coalesce(onboarded_at, now())
  where id = v_school.id
  returning * into v_school;

  update public.profiles set school_id = v_school.id, school_name = v_school.name where id = auth.uid();

  -- The admin is also staff: make sure they appear in the staff list.
  if not exists (select 1 from public.school_members where school_id::text = v_school.id::text and lower(email) = public.edu_my_email()) then
    insert into public.school_members (school_id, email, role, status, is_admin, user_id, accepted_at)
    values (v_school.id, public.edu_my_email(), 'teacher', 'active', true, auth.uid(), now());
  else
    update public.school_members set is_admin = true, status = 'active', user_id = auth.uid(), role = 'teacher'
     where school_id::text = v_school.id::text and lower(email) = public.edu_my_email();
  end if;

  return row_to_json(v_school);
end $$;
revoke all on function public.edu_setup_school(text, text, text, text[], text[], text) from public, anon;
grant execute on function public.edu_setup_school(text, text, text, text[], text[], text) to authenticated;

-- The school an account is "in" right now. Someone linked to several schools (common with
-- test accounts) is shown the one where they have the most responsibility:
--   1 owns it / EDU admin   2 staff (teacher membership or teaches a class)   3 student
-- Within the same level the school already on their profile wins, so nothing flips at sign-in.
create or replace function public.edu_current_school()
returns text language sql stable security definer set search_path = public as $$
  with me as (select auth.uid() as uid, public.edu_my_email() as em,
                     (select school_id::text from public.profiles where id = auth.uid()) as cur),
  cand as (
    select s.id::text as sid, 1 as pri from public.schools s, me where s.owner_id = me.uid
    union all
    select m.school_id::text, 1 from public.school_members m, me
     where lower(m.email) = me.em and m.status = 'active' and coalesce(m.is_admin, false)
    union all
    select m.school_id::text, 2 from public.school_members m, me
     where lower(m.email) = me.em and m.status = 'active' and m.role = 'teacher'
    union all
    select c.school_id, 2 from public.edu_class_members cm join public.edu_classes c on c.id = cm.class_id, me
     where cm.role = 'teacher' and (cm.user_id = me.uid or lower(cm.email) = me.em)
    union all
    select m.school_id::text, 3 from public.school_members m, me
     where lower(m.email) = me.em and m.status = 'active'
  )
  select cand.sid from cand, me
  where not public.edu_is_owner()
  order by cand.pri, (cand.sid = me.cur) desc
  limit 1;
$$;
revoke all on function public.edu_current_school() from public, anon;
grant execute on function public.edu_current_school() to authenticated;

-- Everything the shell needs for the EDU homepage in one call.
create or replace function public.edu_my_context()
returns json language plpgsql stable security definer set search_path = public as $$
declare
  v_email text := public.edu_my_email();
  v_uid uuid := auth.uid();
  v_profile record;
  v_school json;
  v_role text := null;
  v_classes json;
  v_invites json;
  v_assignments json;
  v_comments json;
  v_cur text;
begin
  if v_uid is null then return json_build_object('signed_in', false); end if;
  select id, tier, school_id, school_name, display_name into v_profile from public.profiles where id = v_uid;
  v_cur := public.edu_current_school();

  if v_cur is not null then
    select json_build_object('id', s.id, 'name', s.name, 'logo_url', s.logo_url, 'website', s.website,
                             'brand_color', s.brand_color, 'onboarded', s.onboarded_at is not null,
                             'units', s.ra10_units, 'offered_subjects', s.offered_subjects)
      into v_school from public.schools s where s.id::text = v_cur;
    if public.edu_is_school_admin(v_cur) then v_role := 'admin';
    elsif public.edu_is_school_staff(v_cur) then v_role := 'teacher';
    else v_role := 'student';
    end if;
  elsif lower(coalesce(v_profile.tier, '')) = 'school_admin' and not public.edu_is_owner() then
    v_role := 'admin';   -- admin who has not finished onboarding yet
  end if;

  select coalesce(json_agg(x order by x->>'name'), '[]'::json) into v_classes from (
    select json_build_object('id', c.id, 'name', c.name, 'color', c.color, 'units', c.units, 'year_group', c.year_group,
                             'my_role', case when public.edu_is_class_teacher(c.id) then 'teacher' else 'student' end,
                             'students', (select count(*) from public.edu_class_members x where x.class_id = c.id and x.role = 'student'),
                             'teachers', (select coalesce(json_agg(coalesce(p.display_name, t.email)), '[]'::json)
                                          from public.edu_class_members t left join public.profiles p on p.id = t.user_id
                                          where t.class_id = c.id and t.role = 'teacher')) as x
    from public.edu_classes c
    where not c.archived and c.school_id = v_cur
      and (public.edu_in_class(c.id) or public.edu_is_class_teacher(c.id))
  ) q;

  -- Pending invitations (school-level, with the classes they were added to).
  select coalesce(json_agg(json_build_object(
           'school_id', m.school_id, 'school_name', s.name, 'logo_url', s.logo_url, 'role', m.role,
           'invited_by', coalesce(ip.display_name, ip.email, s.name),
           'classes', (select coalesce(json_agg(c.name), '[]'::json) from public.edu_class_members cm
                       join public.edu_classes c on c.id = cm.class_id
                       where lower(cm.email) = v_email and cm.status = 'invited' and c.school_id = m.school_id::text))), '[]'::json)
    into v_invites
    from public.school_members m
    join public.schools s on s.id::text = m.school_id::text
    left join public.profiles ip on ip.id = m.invited_by
   where lower(m.email) = v_email and m.status = 'invited';

  select coalesce(json_agg(j order by (j->>'due_at') nulls last), '[]'::json) into v_assignments from (
    select json_build_object('id', a.id, 'title', a.title, 'class_id', a.class_id, 'class_name', c.name, 'class_color', c.color,
                             'due_at', a.due_at, 'items', jsonb_array_length(a.items), 'item_list', a.items,
                             'instructions', a.instructions, 'created_at', a.created_at,
                             'done', (select count(*) from public.edu_submissions s where s.assignment_id = a.id and s.user_id = v_uid and s.done),
                             'submitted', (select count(distinct s.user_id) from public.edu_submissions s where s.assignment_id = a.id and s.done),
                             'mine', public.edu_is_class_teacher(a.class_id)) as j
    from public.edu_assignments a join public.edu_classes c on c.id = a.class_id
    where a.status = 'published' and c.school_id = v_cur
      and (public.edu_in_class(a.class_id) or public.edu_is_class_teacher(a.class_id))
    order by a.created_at desc limit 40
  ) q;

  select coalesce(json_agg(json_build_object('id', e.id, 'kind', e.kind, 'body', e.body, 'author', e.author_name,
                                              'recommendation', e.recommendation, 'created_at', e.created_at,
                                              'read', e.read_at is not null, 'assignment_id', e.assignment_id)
                           order by e.created_at desc), '[]'::json)
    into v_comments
    from (select * from public.edu_comments where student_id = v_uid order by created_at desc limit 20) e;

  return json_build_object('signed_in', true, 'tier', v_profile.tier, 'role', v_role, 'school', v_school,
                           'classes', v_classes, 'invites', v_invites, 'assignments', v_assignments,
                           'comments', v_comments, 'email', v_email);
end $$;
revoke all on function public.edu_my_context() from public, anon;
grant execute on function public.edu_my_context() to authenticated;

-- Accept a school invitation: activates the membership and the class places,
-- then applies the school plan to the profile.
create or replace function public.edu_accept_invite(p_school text)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_email text := public.edu_my_email();
  v_member record;
  v_school record;
  v_tier text;
  v_current text;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  select * into v_member from public.school_members
   where school_id::text = p_school and lower(email) = v_email and status in ('invited', 'active')
   order by (role = 'teacher') desc, (status = 'active') desc, id desc limit 1;
  if v_member.id is null then return json_build_object('ok', false, 'reason', 'no_invite'); end if;
  select id, name into v_school from public.schools where id::text = p_school;

  perform set_config('app.edu_role_change', 'true', true);
  update public.school_members set status = 'active', user_id = auth.uid(), accepted_at = coalesce(accepted_at, now()), role = v_member.role
   where school_id::text = p_school and lower(email) = v_email and status in ('invited', 'active');
  update public.edu_class_members cm set status = 'active', user_id = auth.uid()
   where lower(cm.email) = v_email and cm.class_id in (select id from public.edu_classes where school_id = p_school);

  select lower(coalesce(tier, '')) into v_current from public.profiles where id = auth.uid();
  v_tier := case when v_member.role = 'teacher' then 'school_teacher' else 'school_student' end;
  perform set_config('app.skip_profile_priv_check', 'true', true);
  update public.profiles
     set tier = case when v_current in ('owner', 'ultra', 'school_admin') then tier else v_tier end,
         school_id = v_school.id, school_name = v_school.name,
         unlocked_subjects = coalesce(v_member.subjects, array['IT AAQ', 'Business Level 3', 'Sport Level 3'])
   where id = auth.uid();
  return json_build_object('ok', true, 'school', v_school.name, 'role', v_member.role);
end $$;
revoke all on function public.edu_accept_invite(text) from public, anon;
grant execute on function public.edu_accept_invite(text) to authenticated;

create or replace function public.edu_decline_invite(p_school text)
returns json language plpgsql security definer set search_path = public as $$
declare v_email text := public.edu_my_email();
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  update public.school_members set status = 'removed'
   where school_id::text = p_school and lower(email) = v_email and status = 'invited';
  delete from public.edu_class_members
   where lower(email) = v_email and status = 'invited'
     and class_id in (select id from public.edu_classes where school_id = p_school);
  return json_build_object('ok', true);
end $$;
revoke all on function public.edu_decline_invite(text) from public, anon;
grant execute on function public.edu_decline_invite(text) to authenticated;

-- Roster with profile names / last activity, for the teacher dashboard.
create or replace function public.edu_class_roster(p_class uuid)
returns table(email text, user_id uuid, role text, status text, display_name text, username text,
              profile_pic_url text, last_active timestamptz, events_7d integer, avg_score numeric)
language sql stable security definer set search_path = public as $$
  select cm.email, coalesce(cm.user_id, u.id), cm.role, cm.status,
         p.display_name, p.username, p.profile_pic_url,
         (select max(e.created_at) from public.activity_events e where e.user_id = coalesce(cm.user_id, u.id)),
         (select count(*)::int from public.activity_events e where e.user_id = coalesce(cm.user_id, u.id) and e.created_at > now() - interval '7 days'),
         (select round(avg(case when e.max_score > 0 then e.score / e.max_score * 100 end), 1)
            from public.activity_events e where e.user_id = coalesce(cm.user_id, u.id) and e.max_score > 0 and e.created_at > now() - interval '30 days')
  from public.edu_class_members cm
  left join auth.users u on lower(u.email) = lower(cm.email)
  left join public.profiles p on p.id = coalesce(cm.user_id, u.id)
  where cm.class_id = p_class and public.edu_teaches_class(p_class)
  order by cm.role desc, coalesce(p.display_name, cm.email);
$$;
revoke all on function public.edu_class_roster(uuid) from public, anon;
grant execute on function public.edu_class_roster(uuid) to authenticated;

-- Resolve a student email to an id the caller may view (teacher pages link by email).
create or replace function public.edu_student_id(p_email text)
returns uuid language sql stable security definer set search_path = public as $$
  select u.id from auth.users u
  where lower(u.email) = lower(p_email) and public.edu_can_view_student(u.id)
  limit 1;
$$;
revoke all on function public.edu_student_id(text) from public, anon;
grant execute on function public.edu_student_id(text) to authenticated;

-- Aggregate progress for one learner (used by the teacher view, "My activity" and the AI analysis).
create or replace function public.edu_student_summary(p_student uuid, p_days integer default 30)
returns json language plpgsql stable security definer set search_path = public as $$
declare
  v_since timestamptz := now() - make_interval(days => greatest(1, least(coalesce(p_days, 30), 365)));
  v json;
begin
  if not public.edu_can_view_student(p_student) then raise exception 'Not allowed' using errcode = '42501'; end if;
  select json_build_object(
    'student', (select json_build_object('id', p.id, 'name', coalesce(p.display_name, p.username), 'username', p.username,
                                         'email', u.email, 'profile_pic_url', p.profile_pic_url, 'xp_total', p.xp_total, 'xp_this_week', p.xp_this_week)
                from public.profiles p join auth.users u on u.id = p.id where p.id = p_student),
    'totals', (select json_build_object(
                 'events', count(*),
                 'questions', count(*) filter (where kind in ('question', 'ai_examine', 'answer')),
                 'mcqs', count(*) filter (where kind = 'mcq'),
                 'mcq_correct', count(*) filter (where kind = 'mcq' and score > 0),
                 'guide_sections', count(distinct ref) filter (where kind = 'guide_section'),
                 'papers', count(distinct ref) filter (where kind = 'paper_open'),
                 'pages', count(*) filter (where kind = 'page_view'),
                 'active_days', count(distinct date_trunc('day', created_at)),
                 'minutes', coalesce(sum(duration_s), 0) / 60,
                 'avg_pct', round(avg(case when max_score > 0 then score / max_score * 100 end), 1),
                 'last_active', max(created_at))
               from public.activity_events where user_id = p_student and created_at > v_since),
    'by_unit', (select coalesce(json_agg(x order by (x->>'events')::int desc), '[]'::json) from (
                 select json_build_object('unit', unit, 'events', count(*),
                                          'questions', count(*) filter (where kind in ('question', 'ai_examine', 'answer', 'mcq')),
                                          'avg_pct', round(avg(case when max_score > 0 then score / max_score * 100 end), 1),
                                          'last', max(created_at)) as x
                 from public.activity_events where user_id = p_student and created_at > v_since and unit is not null
                 group by unit) q),
    'by_day', (select coalesce(json_agg(x order by x->>'day'), '[]'::json) from (
                 select json_build_object('day', to_char(date_trunc('day', created_at), 'YYYY-MM-DD'), 'events', count(*)) as x
                 from public.activity_events where user_id = p_student and created_at > v_since
                 group by date_trunc('day', created_at)) q),
    'weak', (select coalesce(json_agg(x), '[]'::json) from (
                 select json_build_object('unit', unit, 'topic', coalesce(meta->>'topic', meta->>'aim', view), 'avg_pct',
                                          round(avg(score / max_score * 100), 1), 'n', count(*)) as x
                 from public.activity_events
                 where user_id = p_student and created_at > v_since and max_score > 0
                 group by unit, coalesce(meta->>'topic', meta->>'aim', view)
                 having count(*) >= 2
                 order by avg(score / max_score) asc limit 6) q)
  ) into v;
  return v;
end $$;
revoke all on function public.edu_student_summary(uuid, integer) from public, anon;
grant execute on function public.edu_student_summary(uuid, integer) to authenticated;

-- Owner tool: find a user by email / username / name.
create or replace function public.owner_find_users(p_query text)
returns table(id uuid, email text, username text, display_name text, tier text, last_active timestamptz)
language sql stable security definer set search_path = public as $$
  select p.id, u.email::text, p.username, p.display_name, p.tier,
         (select max(e.created_at) from public.activity_events e where e.user_id = p.id)
  from public.profiles p join auth.users u on u.id = p.id
  where public.edu_is_owner()
    and (u.email ilike '%' || p_query || '%' or p.username ilike '%' || p_query || '%' or p.display_name ilike '%' || p_query || '%')
  order by 6 desc nulls last limit 30;
$$;
revoke all on function public.owner_find_users(text) from public, anon;
grant execute on function public.owner_find_users(text) to authenticated;

-- Owner tool: the live feed across every account.
create or replace function public.owner_recent_activity(p_limit integer default 100)
returns table(id bigint, user_id uuid, email text, display_name text, created_at timestamptz, kind text, unit text,
              path text, view text, ref text, title text, answer text, score numeric, max_score numeric)
language sql stable security definer set search_path = public as $$
  select e.id, e.user_id, u.email::text, p.display_name, e.created_at, e.kind, e.unit, e.path, e.view, e.ref, e.title,
         left(e.answer, 600), e.score, e.max_score
  from public.activity_events e
  join auth.users u on u.id = e.user_id
  left join public.profiles p on p.id = e.user_id
  where public.edu_is_owner()
  order by e.created_at desc
  limit greatest(1, least(coalesce(p_limit, 100), 500));
$$;
revoke all on function public.owner_recent_activity(integer) from public, anon;
grant execute on function public.owner_recent_activity(integer) to authenticated;

-- Everyone at a school (staff + students) with profile details, for admins/teachers.
create or replace function public.edu_school_people(p_school text)
returns table(member_id text, email text, role text, status text, is_admin boolean, user_id uuid,
              display_name text, username text, profile_pic_url text, invited_at timestamptz,
              accepted_at timestamptz, last_active timestamptz, classes text[])
language sql stable security definer set search_path = public as $$
  select m.id::text, lower(m.email), m.role, m.status, coalesce(m.is_admin, false), coalesce(m.user_id, u.id),
         p.display_name, p.username, p.profile_pic_url, m.invited_at, m.accepted_at,
         (select max(e.created_at) from public.activity_events e where e.user_id = coalesce(m.user_id, u.id)),
         (select coalesce(array_agg(c.name order by c.name), array[]::text[]) from public.edu_class_members cm
            join public.edu_classes c on c.id = cm.class_id
           where lower(cm.email) = lower(m.email) and c.school_id = p_school)
  from public.school_members m
  left join auth.users u on lower(u.email) = lower(m.email)
  left join public.profiles p on p.id = coalesce(m.user_id, u.id)
  where m.school_id::text = p_school and m.status <> 'removed' and public.edu_is_school_staff(p_school)
  order by m.role desc, coalesce(p.display_name, m.email);
$$;
revoke all on function public.edu_school_people(text) from public, anon;
grant execute on function public.edu_school_people(text) to authenticated;

-- Put people who are ALREADY at the school (Students & staff list) into a class, with no new
-- invitation email. Their class role comes from their school role (staff -> teacher), their
-- status from their school membership (a pending invite stays pending until they accept).
-- Emails that are not at the school yet are returned in 'unknown' so the app can invite them.
create or replace function public.edu_add_to_class(p_class uuid, p_emails text[])
returns json language plpgsql security definer set search_path = public as $$
declare
  v_school text := public.edu_class_school(p_class);
  v_added integer := 0;
  v_already integer := 0;
  v_unknown text[] := array[]::text[];
  v_email text;
  v_m record;
begin
  if v_school is null then raise exception 'Class not found'; end if;
  if not public.edu_teaches_class(p_class) then raise exception 'Only staff at this school can add people to the class' using errcode = '42501'; end if;
  foreach v_email in array coalesce(p_emails, array[]::text[]) loop
    v_email := lower(trim(v_email));
    continue when v_email = '' or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$';
    select m.role, m.status, coalesce(m.user_id, u.id) as uid into v_m
      from public.school_members m left join auth.users u on lower(u.email) = lower(m.email)
     where m.school_id::text = v_school and lower(m.email) = v_email and m.status <> 'removed'
     order by (m.role = 'teacher') desc, (m.status = 'active') desc limit 1;
    if not found then v_unknown := v_unknown || v_email; continue; end if;
    if exists (select 1 from public.edu_class_members where class_id = p_class and lower(email) = v_email) then
      v_already := v_already + 1; continue;
    end if;
    insert into public.edu_class_members (class_id, email, user_id, role, status, added_by)
    values (p_class, v_email, v_m.uid, case when v_m.role = 'teacher' then 'teacher' else 'student' end,
            case when v_m.status = 'active' then 'active' else 'invited' end, auth.uid());
    v_added := v_added + 1;
  end loop;
  return json_build_object('ok', true, 'added', v_added, 'already', v_already, 'unknown', to_json(v_unknown));
end $$;
revoke all on function public.edu_add_to_class(uuid, text[]) from public, anon;
grant execute on function public.edu_add_to_class(uuid, text[]) to authenticated;

-- ─── 8. School entitlement needs an accepted invitation ─────────────────────
-- Previously any 'invited' row was applied silently on sign-in. Now an invited
-- EXISTING account must accept (popup / email). Brand-new accounts created from
-- the invite email (their auth metadata carries the school id) join automatically.
create or replace function public.apply_school_entitlement()
returns json language plpgsql security definer set search_path = public as $$
declare
  v_user_id uuid := auth.uid();
  v_email text;
  v_meta_school text;
  v_invite record;
  v_school text;
  v_staff boolean;
  v_subjects text[];
  v_tier text;
  v_current text;
begin
  if v_user_id is null then raise exception 'Not authenticated'; end if;
  if public.edu_is_owner() then return json_build_object('ok', false, 'reason', 'owner'); end if;
  select lower(coalesce(email, '')), coalesce(raw_user_meta_data->>'school_id', '')
    into v_email, v_meta_school from auth.users where id = v_user_id;

  v_school := public.edu_current_school();
  if v_school is null then
    -- brand-new account created from an invite email joins that school automatically
    select school_id into v_invite from public.school_members
     where lower(email) = v_email and status = 'invited' and school_id::text = v_meta_school limit 1;
    if v_invite.school_id is not null then return public.edu_accept_invite(v_meta_school); end if;
    return json_build_object('ok', false, 'reason', 'no_membership');
  end if;

  v_staff := public.edu_is_school_staff(v_school);
  select m.subjects into v_subjects from public.school_members m
   where m.school_id::text = v_school and lower(m.email) = v_email and m.status = 'active'
   order by (m.role = 'teacher') desc, m.id desc limit 1;
  select lower(coalesce(tier, '')) into v_current from public.profiles where id = v_user_id;
  v_tier := case when v_staff then 'school_teacher' else 'school_student' end;
  perform set_config('app.skip_profile_priv_check', 'true', true);
  update public.profiles
     set tier = case when v_current in ('owner', 'ultra', 'school_admin') then tier else v_tier end,
         school_id = (select id from public.schools where id::text = v_school),
         school_name = (select name from public.schools where id::text = v_school),
         unlocked_subjects = coalesce(v_subjects, array['IT AAQ', 'Business Level 3', 'Sport Level 3'])
   where id = v_user_id;
  return json_build_object('ok', true, 'tier', v_tier, 'school', v_school);
end $$;
revoke all on function public.apply_school_entitlement() from public;
grant execute on function public.apply_school_entitlement() to authenticated;

-- ─── 9. XP abuse guard ──────────────────────────────────────────────────────
-- The original increment_xp(amount) is kept as increment_xp_unguarded (only
-- callable from the server). The public increment_xp now:
--   • clamps one award to 1–100 XP
--   • allows at most 150 XP per minute per account (all devices combined)
--   • halves XP after 1,500 in a day and stops at 3,000 XP per day
-- so spamming the AI Examiner or opening many tabs/devices stops paying out.
do $$
declare v_fn regprocedure;
begin
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'increment_xp_unguarded') then
    select p.oid::regprocedure into v_fn from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.proname = 'increment_xp' and p.pronargs = 1 limit 1;
    if v_fn is not null then
      execute format('alter function %s rename to increment_xp_unguarded', v_fn);
    end if;
  end if;
end $$;

create table if not exists public.xp_rate (
  user_id uuid primary key references auth.users (id) on delete cascade,
  minute_start timestamptz not null default now(),
  minute_xp integer not null default 0,
  day date not null default current_date,
  day_xp integer not null default 0,
  blocked integer not null default 0
);
alter table public.xp_rate enable row level security;
drop policy if exists xp_rate_own on public.xp_rate;
create policy xp_rate_own on public.xp_rate for select to authenticated using (user_id = auth.uid());

create or replace function public.increment_xp(amount integer)
returns integer language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_row public.xp_rate;
  v_amt integer := greatest(0, least(coalesce(amount, 0), 100));
begin
  if v_uid is null or v_amt <= 0 then return 0; end if;
  insert into public.xp_rate (user_id) values (v_uid) on conflict (user_id) do nothing;
  select * into v_row from public.xp_rate where user_id = v_uid for update;
  if v_row.day <> current_date then v_row.day := current_date; v_row.day_xp := 0; end if;
  if v_row.minute_start < now() - interval '1 minute' then v_row.minute_start := now(); v_row.minute_xp := 0; end if;

  if v_row.day_xp >= 1500 then v_amt := ceil(v_amt / 2.0)::int; end if;     -- diminishing returns
  v_amt := least(v_amt, 150 - v_row.minute_xp, 3000 - v_row.day_xp);
  if v_amt <= 0 then
    update public.xp_rate set blocked = blocked + 1, minute_start = v_row.minute_start, minute_xp = v_row.minute_xp,
                              day = v_row.day, day_xp = v_row.day_xp where user_id = v_uid;
    return 0;
  end if;

  update public.xp_rate set minute_start = v_row.minute_start, minute_xp = v_row.minute_xp + v_amt,
                            day = v_row.day, day_xp = v_row.day_xp + v_amt where user_id = v_uid;
  perform public.increment_xp_unguarded(v_amt);
  return v_amt;
end $$;
revoke all on function public.increment_xp(integer) from public, anon;
grant execute on function public.increment_xp(integer) to authenticated;
do $$
declare v_fn regprocedure;
begin
  select p.oid::regprocedure into v_fn from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.proname = 'increment_xp_unguarded' limit 1;
  if v_fn is not null then
    execute format('revoke all on function %s from public, anon, authenticated', v_fn);
  end if;
end $$;

-- ─── 10. Test account: give business.returnalt10@gmail.com the EDU admin role ─
-- The account must already exist (sign up once first). Their school is created
-- in the onboarding screen at https://ra10.co.uk/school/.
do $$
declare v_uid uuid;
begin
  select id into v_uid from auth.users where lower(email) = 'business.returnalt10@gmail.com';
  if v_uid is null then
    raise notice 'business.returnalt10@gmail.com has no RA10 account yet - sign up, then run this file again.';
    return;
  end if;
  perform set_config('app.skip_profile_priv_check', 'true', true);
  update public.profiles set tier = 'school_admin' where id = v_uid;
  raise notice 'business.returnalt10@gmail.com is now an EDU admin.';
end $$;

-- ─── 11. Staff roles: guards, EDU admin switch and repair (also in edu-fix-staff-roles.sql) ───
-- 1. never downgrade staff by accident
create or replace function public.edu_keep_staff_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if coalesce(current_setting('app.edu_role_change', true), '') = 'true' then return new; end if;
  if old.role = 'teacher' and new.role = 'student' then new.role := 'teacher'; end if;
  if coalesce(old.is_admin, false) and not coalesce(new.is_admin, false) then new.is_admin := true; end if;
  return new;
end $$;
drop trigger if exists trg_edu_keep_staff_role on public.school_members;
create trigger trg_edu_keep_staff_role before update on public.school_members
  for each row execute function public.edu_keep_staff_role();

-- 2. staff are teachers in every class they are added to
create or replace function public.edu_class_member_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if coalesce(current_setting('app.edu_role_change', true), '') = 'true' then return new; end if;
  if exists (select 1 from public.school_members m
             join public.edu_classes c on c.school_id = m.school_id::text
             where c.id = new.class_id and lower(m.email) = lower(new.email)
               and m.role = 'teacher' and m.status <> 'removed') then
    new.role := 'teacher';
    if new.status = 'invited' and exists (select 1 from public.school_members m join public.edu_classes c on c.school_id = m.school_id::text
               where c.id = new.class_id and lower(m.email) = lower(new.email) and m.status = 'active') then
      new.status := 'active';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists trg_edu_class_member_role on public.edu_class_members;
create trigger trg_edu_class_member_role before insert or update on public.edu_class_members
  for each row execute function public.edu_class_member_role();

-- 3. EDU admin switch: make someone staff or a student
create or replace function public.edu_set_member_role(p_school text, p_email text, p_role text)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_role text := case when lower(coalesce(p_role, '')) = 'teacher' then 'teacher' else 'student' end;
  v_email text := lower(trim(coalesce(p_email, '')));
  v_n integer;
begin
  if not public.edu_is_school_admin(p_school) then raise exception 'Only the EDU admin can change roles' using errcode = '42501'; end if;
  if v_email = public.edu_my_email() then raise exception 'You cannot change your own role'; end if;
  perform set_config('app.edu_role_change', 'true', true);
  update public.school_members set role = v_role
   where school_id::text = p_school and lower(email) = v_email and status <> 'removed';
  get diagnostics v_n = row_count;
  if v_n = 0 then return json_build_object('ok', false, 'reason', 'not_found'); end if;
  update public.edu_class_members set role = v_role
   where lower(email) = v_email and class_id in (select id from public.edu_classes where school_id = p_school);
  perform set_config('app.skip_profile_priv_check', 'true', true);
  update public.profiles
     set tier = case when v_role = 'teacher' then 'school_teacher' else 'school_student' end
   where lower(coalesce(email, '')) = v_email and school_id::text = p_school
     and lower(coalesce(tier, '')) in ('school_student', 'school_teacher');
  return json_build_object('ok', true, 'role', v_role);
end $$;
revoke all on function public.edu_set_member_role(text, text, text) from public, anon;
grant execute on function public.edu_set_member_role(text, text, text) to authenticated;

-- 4. repair accounts that were already downgraded
do $$
begin
  perform set_config('app.edu_role_change', 'true', true);
  update public.school_members m set role = 'teacher'
    from public.profiles p, auth.users u
   where u.id = p.id and lower(u.email) = lower(m.email)
     and p.school_id::text = m.school_id::text
     and lower(coalesce(p.tier, '')) = 'school_teacher'
     and m.role = 'student' and m.status <> 'removed';
  update public.edu_class_members cm set role = 'teacher'
    from public.edu_classes c, public.school_members m
   where c.id = cm.class_id and m.school_id::text = c.school_id
     and lower(m.email) = lower(cm.email) and m.role = 'teacher' and m.status <> 'removed'
     and cm.role = 'student';
end $$;

-- 5. Staff check (same as edu-platform.sql)
-- Staff = school admin, anyone with a (not removed) teacher membership at the school,
-- or anyone who teaches one of the school's classes.
create or replace function public.edu_is_school_staff(p_school text)
returns boolean language sql stable security definer set search_path = public as $$
  select public.edu_is_school_admin(p_school)
      or exists (select 1 from public.school_members m
                 where m.school_id::text = p_school and lower(m.email) = public.edu_my_email()
                   and m.role = 'teacher' and m.status <> 'removed')
      or exists (select 1 from public.edu_class_members cm
                 join public.edu_classes c on c.id = cm.class_id
                 where c.school_id = p_school and cm.role = 'teacher'
                   and (cm.user_id = auth.uid() or lower(cm.email) = public.edu_my_email()));
$$;

-- 6. Repair existing accounts: one role per person per school. If ANY of their
--    records says teacher, or they teach a class, they are staff everywhere at that school.
do $$
begin
  perform set_config('app.edu_role_change', 'true', true);
  update public.school_members m set role = 'teacher'
   where m.role <> 'teacher' and m.status <> 'removed'
     and (exists (select 1 from public.school_members t
                  where t.school_id::text = m.school_id::text and lower(t.email) = lower(m.email)
                    and t.role = 'teacher' and t.status <> 'removed')
          or exists (select 1 from public.edu_class_members cm join public.edu_classes c on c.id = cm.class_id
                     where c.school_id = m.school_id::text and lower(cm.email) = lower(m.email) and cm.role = 'teacher'));
  -- a joined staff member's other records are joined too
  update public.school_members m set status = 'active'
   where m.status = 'invited' and m.role = 'teacher'
     and exists (select 1 from public.school_members t where t.school_id::text = m.school_id::text
                   and lower(t.email) = lower(m.email) and t.status = 'active');
  update public.edu_class_members cm set role = 'teacher'
    from public.edu_classes c, public.school_members m
   where c.id = cm.class_id and m.school_id::text = c.school_id and lower(m.email) = lower(cm.email)
     and m.role = 'teacher' and m.status <> 'removed' and cm.role = 'student';
  perform set_config('app.skip_profile_priv_check', 'true', true);
  update public.profiles p set tier = 'school_teacher'
    from auth.users u
   where u.id = p.id and lower(coalesce(p.tier, '')) in ('school_student', 'free')
     and exists (select 1 from public.school_members m
                 where lower(m.email) = lower(u.email) and m.role = 'teacher' and m.status = 'active'
                   and (p.school_id is null or m.school_id::text = p.school_id::text));
  update public.profiles p set school_id = m.school_id, school_name = s.name
    from auth.users u, public.school_members m, public.schools s
   where u.id = p.id and p.school_id is null and lower(m.email) = lower(u.email)
     and m.role = 'teacher' and m.status = 'active' and s.id::text = m.school_id::text;
end $$;

-- ─── 12. The RA10 owner account (mistry.hashim@icloud.com) is not part of any school ───
-- Removes its school memberships and class places and unlinks its profile. A school it
-- created is handed to another active EDU admin of that school when there is one.
do $$
declare v_uid uuid; r record; v_new uuid;
begin
  select id into v_uid from auth.users where lower(email) = 'mistry.hashim@icloud.com';
  if v_uid is null then return; end if;
  perform set_config('app.edu_role_change', 'true', true);
  update public.school_members set status = 'removed' where lower(email) = 'mistry.hashim@icloud.com' and status <> 'removed';
  delete from public.edu_class_members where lower(email) = 'mistry.hashim@icloud.com' or user_id = v_uid;
  perform set_config('app.skip_profile_priv_check', 'true', true);
  update public.profiles
     set school_id = null, school_name = null,
         tier = case when lower(coalesce(tier, '')) like 'school_%' then 'owner' else tier end
   where id = v_uid;
  for r in select id, name from public.schools where owner_id = v_uid loop
    select coalesce(m.user_id, u.id) into v_new
      from public.school_members m left join auth.users u on lower(u.email) = lower(m.email)
     where m.school_id::text = r.id::text and coalesce(m.is_admin, false) and m.status = 'active'
       and lower(m.email) <> 'mistry.hashim@icloud.com' and coalesce(m.user_id, u.id) is not null
     limit 1;
    if v_new is not null then
      update public.schools set owner_id = v_new where id = r.id;
      raise notice 'School "%" handed to another EDU admin.', r.name;
    else
      raise notice 'School "%" was created by the owner account and has no other EDU admin. It is kept but has no admin now.', r.name;
    end if;
  end loop;
end $$;
