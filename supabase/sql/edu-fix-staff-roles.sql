-- ═══════════════════════════════════════════════════════════════════════════
-- RA10 EDU — fix staff being shown as students. Run in the Supabase SQL editor
-- (after edu-platform.sql). Safe to re-run.
--
-- Cause: adding someone again through a class's "Add students" form re-saved
-- their school membership with role = 'student', downgrading a teacher.
--  1. Guard: a teacher's school membership is never downgraded to student by an
--     invite / add form (only the EDU admin's "Make student" action can do it).
--  2. Guard: anyone who is staff at the school is always a teacher in a class.
--  3. edu_set_member_role(): the EDU admin's "Make staff / Make student" switch.
--  4. Repair: memberships already downgraded are restored (their profile still
--     says school_teacher), and their class places are set back to teacher.
-- ═══════════════════════════════════════════════════════════════════════════

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
