-- ═══════════════════════════════════════════════════════════════════════════
-- RA10 — "Apply to be a moderator"
-- Run AFTER community-forums.sql and community-moderation.sql. Safe to re-run.
--
-- Any signed-in member can apply from the Community page. The owner is alerted
-- on the site, sees the applicant's XP / activity / account age plus an AI
-- summary, then accepts (they become an Admin) or rejects.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.community_mod_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  message text not null check (char_length(btrim(message)) between 20 and 800),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid,
  decision_note text check (decision_note is null or char_length(decision_note) <= 300),
  notified boolean not null default false,       -- has the applicant seen the decision?
  ai_summary jsonb,                               -- cached by community-applicant-summary
  ai_summary_at timestamptz
);
create unique index if not exists community_mod_apps_one_pending on public.community_mod_applications (user_id) where status = 'pending';
create index if not exists community_mod_apps_status_idx on public.community_mod_applications (status, created_at desc);
alter table public.community_mod_applications enable row level security;   -- RPC-only access
grant select, update on public.community_mod_applications to service_role;

-- Member: submit an application
create or replace function public.community_apply_moderator(p_message text)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  v_last public.community_mod_applications%rowtype;
  v_id uuid;
begin
  if auth.uid() is null then raise exception 'Sign in to apply.' using errcode = 'P0001'; end if;
  if public.is_community_staff() then raise exception 'You are already part of the moderation team.' using errcode = 'P0001'; end if;
  if char_length(btrim(coalesce(p_message, ''))) < 20 then raise exception 'Tell us a bit more — at least 20 characters.' using errcode = 'P0001'; end if;
  if public.forum_is_banned(auth.uid()) then raise exception 'You can''t apply while you are banned from the forums.' using errcode = 'P0001'; end if;
  select * into v_last from public.community_mod_applications where user_id = auth.uid() order by created_at desc limit 1;
  if found and v_last.status = 'pending' then raise exception 'You already have an application waiting for review.' using errcode = 'P0001'; end if;
  if found and v_last.status = 'rejected' and v_last.decided_at > now() - interval '14 days' then
    raise exception 'You can apply again on %.', to_char(v_last.decided_at + interval '14 days', 'DD Mon YYYY') using errcode = 'P0001';
  end if;
  insert into public.community_mod_applications (user_id, message) values (auth.uid(), btrim(p_message)) returning id into v_id;
  -- an outstanding owner request is superseded
  delete from public.community_staff_invites where email = v_email;
  return v_id;
end;
$$;
grant execute on function public.community_apply_moderator(text) to authenticated;

-- Member: my latest application
create or replace function public.community_my_application()
returns table (id uuid, status text, message text, created_at timestamptz, decided_at timestamptz, decision_note text, notified boolean, can_reapply_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  return query
    select a.id, a.status, a.message, a.created_at, a.decided_at, a.decision_note, a.notified,
           case when a.status = 'rejected' then a.decided_at + interval '14 days' else null end
      from public.community_mod_applications a
     where a.user_id = auth.uid()
     order by a.created_at desc limit 1;
end;
$$;
grant execute on function public.community_my_application() to authenticated;

create or replace function public.community_ack_application(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.community_mod_applications set notified = true where id = p_id and user_id = auth.uid();
end;
$$;
grant execute on function public.community_ack_application(uuid) to authenticated;

-- Owner: applications with the numbers needed to judge them
create or replace function public.community_applications_list(p_status text default 'pending')
returns table (
  id uuid, user_id uuid, email text, username text, full_name text, profile_pic_url text,
  message text, status text, created_at timestamptz, decided_at timestamptz, decision_note text, ai_summary jsonb,
  xp_total bigint, xp_this_week bigint, account_created timestamptz,
  active_days_30 bigint, active_days_90 bigint, active_days_total bigint, last_active date,
  threads bigint, replies bigint, removals bigint
)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_community_owner() then raise exception 'Owner only.' using errcode = '42501'; end if;
  return query
    select a.id, a.user_id, lower(p.email), p.username::text, p.full_name::text, p.profile_pic_url::text,
           a.message, a.status, a.created_at, a.decided_at, a.decision_note, a.ai_summary,
           coalesce(p.xp_total, 0)::bigint, coalesce(p.xp_this_week, 0)::bigint, u.created_at,
           (select count(*) from public.study_days d where d.user_id = a.user_id and d.day > current_date - 30),
           (select count(*) from public.study_days d where d.user_id = a.user_id and d.day > current_date - 90),
           (select count(*) from public.study_days d where d.user_id = a.user_id),
           (select max(d.day) from public.study_days d where d.user_id = a.user_id),
           (select count(*) from public.forum_posts t where t.user_id = a.user_id),
           (select count(*) from public.forum_comments c where c.user_id = a.user_id),
           (select count(*) from public.forum_mod_log l where l.author_id = a.user_id and l.action = 'removed')
      from public.community_mod_applications a
      left join public.profiles p on p.id = a.user_id
      left join auth.users u on u.id = a.user_id
     where (p_status = 'all' or a.status = p_status)
     order by (a.status = 'pending') desc, a.created_at desc
     limit 100;
end;
$$;
grant execute on function public.community_applications_list(text) to authenticated;

-- Owner: accept (becomes an Admin immediately) or reject
create or replace function public.community_decide_application(p_id uuid, p_accept boolean, p_note text default null)
returns text language plpgsql security definer set search_path = public as $$
declare
  a public.community_mod_applications%rowtype;
  v_email text;
begin
  if not public.is_community_owner() then raise exception 'Owner only.' using errcode = '42501'; end if;
  select * into a from public.community_mod_applications where id = p_id for update;
  if not found or a.status <> 'pending' then raise exception 'That application has already been decided.' using errcode = 'P0001'; end if;
  if p_accept then
    select lower(email) into v_email from auth.users where id = a.user_id;
    if v_email is null then raise exception 'That account no longer exists.' using errcode = 'P0001'; end if;
    insert into public.community_staff (email, added_by) values (v_email, auth.uid()) on conflict (email) do nothing;
    delete from public.community_staff_invites where email = v_email;
  end if;
  update public.community_mod_applications
     set status = case when p_accept then 'approved' else 'rejected' end,
         decided_at = now(), decided_by = auth.uid(), decision_note = nullif(left(btrim(coalesce(p_note, '')), 300), ''), notified = false
   where id = p_id;
  return case when p_accept then 'approved' else 'rejected' end;
end;
$$;
grant execute on function public.community_decide_application(uuid, boolean, text) to authenticated;

notify pgrst, 'reload schema';
