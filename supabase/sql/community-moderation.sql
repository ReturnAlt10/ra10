-- ═══════════════════════════════════════════════════════════════════════════
-- RA10 — Moderator requests, member directory and the AI moderator
-- Run AFTER supabase/sql/community-forums.sql. Safe to re-run.
--
--   1. community_staff_invites + RPCs  — owner sends a request, the member
--                                        accepts or declines when they log in
--   2. community_member_search()       — owner-only list of every member
--   3. forum_mod_queue / forum_mod_log — the AI moderator's work queue + audit log
--   4. forum_restore()                 — staff can undo an AI removal
--   5. forum_latest_announcement()     — powers the "new announcement" alert
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Moderator requests
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.community_staff_invites (
  email text primary key,
  invited_by uuid default auth.uid(),
  status text not null default 'pending' check (status in ('pending', 'declined')),
  created_at timestamptz not null default now()
);
alter table public.community_staff_invites enable row level security;
drop policy if exists "staff_invites owner" on public.community_staff_invites;
create policy "staff_invites owner" on public.community_staff_invites for all to authenticated
  using (public.is_community_owner()) with check (public.is_community_owner());
grant select, insert, update, delete on public.community_staff_invites to authenticated;

-- Owner: send a request to a member (by email).
create or replace function public.community_invite_moderator(p_email text)
returns void language plpgsql security definer set search_path = public as $$
declare v_email text := lower(btrim(p_email));
begin
  if not public.is_community_owner() then raise exception 'Owner only.' using errcode = '42501'; end if;
  if v_email = '' or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Enter a valid email address.' using errcode = 'P0001'; end if;
  if v_email = 'mistry.hashim@icloud.com' then raise exception 'You are already the owner.' using errcode = 'P0001'; end if;
  if exists (select 1 from public.community_staff where email = v_email) then raise exception 'They are already a moderator.' using errcode = 'P0001'; end if;
  insert into public.community_staff_invites (email, invited_by, status) values (v_email, auth.uid(), 'pending')
  on conflict (email) do update set status = 'pending', invited_by = auth.uid(), created_at = now();
end;
$$;
grant execute on function public.community_invite_moderator(text) to authenticated;

-- Member: is there a pending request for me?
create or replace function public.community_my_invite()
returns table (email text, created_at timestamptz, inviter_name text)
language plpgsql stable security definer set search_path = public as $$
begin
  return query
    select i.email, i.created_at,
           coalesce(nullif(p.username::text, ''), nullif(p.full_name::text, ''), 'The RA10 team')
      from public.community_staff_invites i
      left join public.profiles p on p.id = i.invited_by
     where i.email = lower(coalesce(auth.jwt() ->> 'email', '')) and i.status = 'pending'
     limit 1;
end;
$$;
grant execute on function public.community_my_invite() to authenticated;

-- Member: accept or decline.
create or replace function public.community_respond_invite(p_accept boolean)
returns text language plpgsql security definer set search_path = public as $$
declare v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
begin
  if not exists (select 1 from public.community_staff_invites where email = v_email and status = 'pending') then
    raise exception 'There is no pending request.' using errcode = 'P0001';
  end if;
  if p_accept then
    insert into public.community_staff (email, added_by) values (v_email, (select invited_by from public.community_staff_invites where email = v_email))
    on conflict (email) do nothing;
    delete from public.community_staff_invites where email = v_email;
    return 'accepted';
  end if;
  update public.community_staff_invites set status = 'declined' where email = v_email;
  return 'declined';
end;
$$;
grant execute on function public.community_respond_invite(boolean) to authenticated;

-- Owner: moderators + invite state in one list.
create or replace function public.community_staff_overview()
returns table (email text, state text, created_at timestamptz, user_id uuid, username text, full_name text, profile_pic_url text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_community_owner() then raise exception 'Owner only.' using errcode = '42501'; end if;
  return query
    select x.email, x.state, x.created_at, p.id, p.username::text, p.full_name::text, p.profile_pic_url::text
      from (
        select s.email, 'active'::text as state, s.created_at from public.community_staff s
        union all
        select i.email, i.status, i.created_at from public.community_staff_invites i
      ) x
      left join public.profiles p on lower(p.email) = x.email
     order by (x.state = 'active') desc, x.created_at desc;
end;
$$;
grant execute on function public.community_staff_overview() to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Member directory (owner only — it exposes email addresses)
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.community_member_search(p_q text default '', p_limit integer default 30, p_offset integer default 0)
returns table (id uuid, email text, username text, full_name text, profile_pic_url text, status text, total bigint)
language plpgsql stable security definer set search_path = public as $$
declare v_q text := '%' || lower(btrim(coalesce(p_q, ''))) || '%';
begin
  if not public.is_community_owner() then raise exception 'Owner only.' using errcode = '42501'; end if;
  return query
    with m as (
      select p.id, lower(p.email) as email, p.username::text as username, p.full_name::text as full_name, p.profile_pic_url::text as pic,
             case when lower(p.email) = 'mistry.hashim@icloud.com' then 'owner'
                  when exists (select 1 from public.community_staff s where s.email = lower(p.email)) then 'moderator'
                  when exists (select 1 from public.community_staff_invites i where i.email = lower(p.email) and i.status = 'pending') then 'invited'
                  else null end as st
        from public.profiles p
       where p.email is not null
         and (v_q = '%%' or lower(p.email) like v_q or lower(coalesce(p.username::text, '')) like v_q or lower(coalesce(p.full_name::text, '')) like v_q)
    )
    select m.id, m.email, m.username, m.full_name, m.pic, m.st, count(*) over ()
      from m
     order by lower(coalesce(m.username, m.full_name, m.email))
     limit least(greatest(p_limit, 1), 100) offset greatest(p_offset, 0);
end;
$$;
grant execute on function public.community_member_search(text, integer, integer) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. AI moderator — queue + audit log (written by the community-moderate edge function)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.forum_mod_queue (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('post', 'comment')),
  target_id uuid not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'done', 'error')),
  attempts integer not null default 0,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);
create index if not exists forum_mod_queue_pending_idx on public.forum_mod_queue (status, created_at) where status in ('pending', 'error');
create unique index if not exists forum_mod_queue_target_idx on public.forum_mod_queue (kind, target_id);
alter table public.forum_mod_queue enable row level security;   -- no policies: service role only

create table if not exists public.forum_mod_log (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('post', 'comment')),
  target_id uuid not null,
  post_id uuid,
  author_id uuid,
  category_id text,
  title text,
  content text not null,
  parent_id uuid,
  original_created_at timestamptz,
  action text not null check (action in ('removed', 'flagged', 'restored')),
  category text,
  severity integer not null default 0,
  reason text,
  source text not null default 'ai',
  reviewed boolean not null default false,
  reviewed_by uuid,
  created_at timestamptz not null default now()
);
create index if not exists forum_mod_log_recent_idx on public.forum_mod_log (reviewed, created_at desc);
create index if not exists forum_mod_log_author_idx on public.forum_mod_log (author_id, created_at desc);
alter table public.forum_mod_log enable row level security;
drop policy if exists "forum_mod_log staff read" on public.forum_mod_log;
create policy "forum_mod_log staff read" on public.forum_mod_log for select to authenticated using (public.is_community_staff());
drop policy if exists "forum_mod_log staff update" on public.forum_mod_log;
create policy "forum_mod_log staff update" on public.forum_mod_log for update to authenticated using (public.is_community_staff()) with check (public.is_community_staff());
grant select, update on public.forum_mod_log to authenticated;

-- Every new post / reply is queued for the AI moderator.
create or replace function public.forum_enqueue_moderation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if coalesce(current_setting('ra10.forum_restore', true), '') = '1' then return new; end if;
  insert into public.forum_mod_queue (kind, target_id)
  values (case when tg_table_name = 'forum_posts' then 'post' else 'comment' end, new.id)
  on conflict (kind, target_id) do nothing;
  return new;
end;
$$;
drop trigger if exists forum_posts_enqueue on public.forum_posts;
create trigger forum_posts_enqueue after insert on public.forum_posts for each row execute function public.forum_enqueue_moderation();
drop trigger if exists forum_comments_enqueue on public.forum_comments;
create trigger forum_comments_enqueue after insert on public.forum_comments for each row execute function public.forum_enqueue_moderation();

-- Edited content gets looked at again.
create or replace function public.forum_requeue_on_edit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.body is distinct from old.body or (tg_table_name = 'forum_posts' and new.title is distinct from old.title) then
    insert into public.forum_mod_queue (kind, target_id, status)
    values (case when tg_table_name = 'forum_posts' then 'post' else 'comment' end, new.id, 'pending')
    on conflict (kind, target_id) do update set status = 'pending', attempts = 0, processed_at = null;
  end if;
  return new;
end;
$$;
drop trigger if exists forum_posts_requeue on public.forum_posts;
create trigger forum_posts_requeue after update on public.forum_posts for each row execute function public.forum_requeue_on_edit();
drop trigger if exists forum_comments_requeue on public.forum_comments;
create trigger forum_comments_requeue after update on public.forum_comments for each row execute function public.forum_requeue_on_edit();

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Restore content the AI removed by mistake (staff only)
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.forum_restore(p_log_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare l public.forum_mod_log%rowtype;
begin
  if not public.is_community_staff() then raise exception 'Moderators only.' using errcode = '42501'; end if;
  select * into l from public.forum_mod_log where id = p_log_id;
  if not found or l.action <> 'removed' then raise exception 'Nothing to restore.' using errcode = 'P0001'; end if;
  perform set_config('ra10.forum_restore', '1', true);
  if l.kind = 'post' then
    insert into public.forum_posts (id, category_id, user_id, title, body, created_at, last_activity_at)
    values (l.target_id, coalesce(l.category_id, 'general'), l.author_id, coalesce(l.title, 'Restored thread'), l.content, coalesce(l.original_created_at, now()), now())
    on conflict (id) do nothing;
  else
    if not exists (select 1 from public.forum_posts where id = l.post_id) then
      perform set_config('ra10.forum_restore', '', true);
      raise exception 'The thread this reply belonged to no longer exists.' using errcode = 'P0001';
    end if;
    insert into public.forum_comments (id, post_id, parent_id, user_id, body, created_at)
    values (l.target_id, l.post_id, case when exists (select 1 from public.forum_comments where id = l.parent_id) then l.parent_id else null end, l.author_id, l.content, coalesce(l.original_created_at, now()))
    on conflict (id) do nothing;
  end if;
  perform set_config('ra10.forum_restore', '', true);
  update public.forum_mod_queue set status = 'done' where kind = l.kind and target_id = l.target_id;
  update public.forum_mod_log set action = 'restored', reviewed = true, reviewed_by = auth.uid() where id = p_log_id;
  return 'restored';
end;
$$;
grant execute on function public.forum_restore(uuid) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Latest staff announcement (used for the navbar dot + popup)
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.forum_latest_announcement()
returns table (id uuid, title text, author_id uuid, author_name text, badge text, created_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  return query
    select p.id, p.title, p.user_id,
           coalesce(nullif(u.username::text, ''), nullif(u.full_name::text, ''), 'The RA10 team'),
           case when lower(u.email) = 'mistry.hashim@icloud.com' then 'owner'
                when exists (select 1 from public.community_staff s where s.email = lower(u.email)) then 'admin'
                else null end::text,
           p.created_at
      from public.forum_posts p
      left join public.profiles u on u.id = p.user_id
     where p.category_id = 'announcements'
     order by p.created_at desc
     limit 1;
end;
$$;
grant execute on function public.forum_latest_announcement() to anon, authenticated;

-- Owner: withdraw a pending (or cleared declined) request.
create or replace function public.community_cancel_invite(p_email text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_community_owner() then raise exception 'Owner only.' using errcode = '42501'; end if;
  delete from public.community_staff_invites where email = lower(btrim(p_email));
end;
$$;
grant execute on function public.community_cancel_invite(text) to authenticated;
