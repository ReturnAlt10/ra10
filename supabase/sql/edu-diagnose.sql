-- ═══════════════════════════════════════════════════════════════════════════
-- RA10 EDU — why does this person get the student view?  (read-only)
-- 1. Put the person's email on the LAST line.  2. Run in the Supabase SQL editor.
-- It returns one table: their account, school records, classes, which version of
-- the staff check is installed, and the role their homepage would show.
-- ═══════════════════════════════════════════════════════════════════════════
create or replace function pg_temp.ra10_diag(p_email text)
returns table(item text, value text) language plpgsql as $$
declare
  v_uid uuid; v_school text; v_def text; v_ctx json;
begin
  select id into v_uid from auth.users where lower(email) = lower(trim(p_email)) limit 1;
  item := '1. account'; value := coalesce(v_uid::text, 'NO ACCOUNT WITH THIS EMAIL'); return next;
  if v_uid is null then return; end if;

  select school_id::text into v_school from public.profiles where id = v_uid;
  item := '2. profile tier / school';
  value := (select coalesce(p.tier, 'null') || ' / ' || coalesce(p.school_id::text, 'NO SCHOOL') || coalesce(' (' || s.name || ')', '')
              from public.profiles p left join public.schools s on s.id::text = p.school_id::text where p.id = v_uid);
  return next;

  item := '3. school memberships (role, status, school)';
  value := coalesce((select string_agg(m.role || ', ' || m.status || ', ' || coalesce(s.name, m.school_id::text), '  |  ' order by m.id)
                       from public.school_members m left join public.schools s on s.id::text = m.school_id::text
                      where lower(m.email) = lower(trim(p_email))), 'NONE');
  return next;

  item := '4. class places (class, role, status)';
  value := coalesce((select string_agg(c.name || ', ' || cm.role || ', ' || cm.status, '  |  ')
                       from public.edu_class_members cm join public.edu_classes c on c.id = cm.class_id
                      where lower(cm.email) = lower(trim(p_email)) or cm.user_id = v_uid), 'NONE');
  return next;

  select pg_get_functiondef('public.edu_is_school_staff(text)'::regprocedure) into v_def;
  item := '5. staff check installed';
  value := case when v_def like '%edu_class_members%' and v_def like '%<> ''removed''%' then 'NEW (fixed)' else 'OLD — run edu-platform.sql again and check it finishes without an error' end;
  return next;

  item := '6. staff-role guards installed';
  value := case when exists (select 1 from pg_trigger where tgname = 'trg_edu_keep_staff_role') then 'yes' else 'NO — run edu-platform.sql' end;
  return next;

  -- run the homepage logic as this person
  perform set_config('request.jwt.claims', json_build_object('sub', v_uid, 'role', 'authenticated')::text, true);
  perform set_config('request.jwt.claim.sub', v_uid::text, true);
  item := '7. is staff at their school (as them)';
  value := case when v_school is null then 'no school on profile' else public.edu_is_school_staff(v_school)::text end;
  return next;

  v_ctx := public.edu_my_context();
  item := '8. HOMEPAGE ROLE (as them)'; value := coalesce(v_ctx->>'role', 'none'); return next;
  item := '9. classes they teach (as them)';
  value := coalesce((select string_agg(x->>'name' || ' (' || (x->>'my_role') || ')', ', ') from json_array_elements(v_ctx->'classes') x), 'none');
  return next;
end $$;

select * from pg_temp.ra10_diag('PUT-THE-TEACHER-EMAIL-HERE@example.com');
