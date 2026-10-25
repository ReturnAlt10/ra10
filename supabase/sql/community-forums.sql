-- ═══════════════════════════════════════════════════════════════════════════
-- RA10 — Community forums, community managers and moderation
-- Run this in the Supabase SQL editor. Safe to re-run.
--
-- What this adds
--   1. community_staff        — community managers, assigned by email by the owner
--   2. is_community_staff()   — owner or manager (used by every policy below)
--   3. forum_categories / forum_posts / forum_comments (one reply level)
--      forum_post_likes / forum_comment_likes / forum_reports / forum_bans
--   4. community_public_profiles()  — names + avatars + Admin/Manager badge
--   5. Fixes + moderation for the existing Study Apps community:
--      working comments (RLS + comment_count) and staff delete/hide.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Staff
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.community_staff (
  email text primary key,
  role text not null default 'manager' check (role in ('manager')),
  added_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create or replace function public.community_staff_normalise()
returns trigger language plpgsql as $$
begin
  new.email := lower(btrim(new.email));
  if new.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Enter a valid email address.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
drop trigger if exists community_staff_normalise on public.community_staff;
create trigger community_staff_normalise before insert or update on public.community_staff
for each row execute function public.community_staff_normalise();

create or replace function public.is_community_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'mistry.hashim@icloud.com';
$$;

create or replace function public.is_community_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_community_owner()
      or exists (select 1 from public.community_staff s
                  where s.email = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;
grant execute on function public.is_community_owner() to anon, authenticated;
grant execute on function public.is_community_staff() to anon, authenticated;

alter table public.community_staff enable row level security;
drop policy if exists "community_staff read" on public.community_staff;
create policy "community_staff read" on public.community_staff for select to authenticated
  using (public.is_community_owner() or email = lower(coalesce(auth.jwt() ->> 'email', '')));
drop policy if exists "community_staff owner write" on public.community_staff;
create policy "community_staff owner write" on public.community_staff for all to authenticated
  using (public.is_community_owner()) with check (public.is_community_owner());
grant select, insert, update, delete on public.community_staff to authenticated;

-- Owner-only list of managers, with the account (if any) behind each email.
create or replace function public.community_staff_list()
returns table (email text, created_at timestamptz, user_id uuid, username text, full_name text, profile_pic_url text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_community_owner() then
    raise exception 'Owner only.' using errcode = '42501';
  end if;
  return query
    select s.email, s.created_at, p.id, p.username::text, p.full_name::text, p.profile_pic_url::text
      from public.community_staff s
      left join public.profiles p on lower(p.email) = s.email
     order by s.created_at desc;
end;
$$;
grant execute on function public.community_staff_list() to authenticated;

-- Names, avatars and role badges for any set of user ids (public, safe fields only).
create or replace function public.community_public_profiles(p_ids uuid[])
returns table (id uuid, username text, full_name text, profile_pic_url text, badge text)
language plpgsql stable security definer set search_path = public as $$
begin
  return query
    select p.id, p.username::text, p.full_name::text, p.profile_pic_url::text,
           case when lower(p.email) = 'mistry.hashim@icloud.com' then 'owner'
                when exists (select 1 from public.community_staff s where s.email = lower(p.email)) then 'admin'
                else null end::text
      from public.profiles p
     where p.id = any (p_ids)
     limit 200;
end;
$$;
grant execute on function public.community_public_profiles(uuid[]) to anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Forum tables
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.forum_categories (
  id text primary key check (id ~ '^[a-z0-9-]{2,40}$'),
  name text not null check (char_length(name) between 2 and 60),
  description text not null default '',
  icon text not null default '💬',
  color text not null default '#d20000',
  sort integer not null default 100,
  staff_only boolean not null default false,   -- only owner/managers may start threads
  created_at timestamptz not null default now()
);

create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  category_id text not null references public.forum_categories (id) on update cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 3 and 140),
  body text not null check (char_length(btrim(body)) between 1 and 8000),
  pinned boolean not null default false,
  locked boolean not null default false,
  comment_count integer not null default 0,
  like_count integer not null default 0,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  last_activity_at timestamptz not null default now()
);
create index if not exists forum_posts_cat_idx on public.forum_posts (category_id, pinned desc, last_activity_at desc);
create index if not exists forum_posts_activity_idx on public.forum_posts (last_activity_at desc);
create index if not exists forum_posts_user_idx on public.forum_posts (user_id, created_at desc);

create table if not exists public.forum_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forum_posts (id) on delete cascade,
  parent_id uuid references public.forum_comments (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 3000),
  like_count integer not null default 0,
  created_at timestamptz not null default now(),
  edited_at timestamptz
);
create index if not exists forum_comments_post_idx on public.forum_comments (post_id, created_at);
create index if not exists forum_comments_user_idx on public.forum_comments (user_id, created_at desc);

create table if not exists public.forum_post_likes (
  post_id uuid not null references public.forum_posts (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
create table if not exists public.forum_comment_likes (
  comment_id uuid not null references public.forum_comments (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

create table if not exists public.forum_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.forum_posts (id) on delete cascade,
  comment_id uuid references public.forum_comments (id) on delete cascade,
  app_id uuid,
  reporter_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  reason text not null check (char_length(btrim(reason)) between 3 and 400),
  status text not null default 'open' check (status in ('open', 'resolved')),
  resolved_by uuid,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  check (post_id is not null or comment_id is not null or app_id is not null)
);
create index if not exists forum_reports_status_idx on public.forum_reports (status, created_at desc);
create unique index if not exists forum_reports_once_post on public.forum_reports (reporter_id, post_id) where post_id is not null and comment_id is null;
create unique index if not exists forum_reports_once_comment on public.forum_reports (reporter_id, comment_id) where comment_id is not null;
create unique index if not exists forum_reports_once_app on public.forum_reports (reporter_id, app_id) where app_id is not null;

create table if not exists public.forum_bans (
  user_id uuid primary key references auth.users (id) on delete cascade,
  reason text,
  banned_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Triggers — ownership, rate limits, counters, locked threads
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.forum_is_banned(p_user uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.forum_bans b
                  where b.user_id = p_user and (b.expires_at is null or b.expires_at > now()));
$$;

create or replace function public.forum_posts_before_write()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_staff boolean := public.is_community_staff();
  v_internal boolean := coalesce(current_setting('ra10.forum_internal', true), '') = '1';
  v_cat public.forum_categories%rowtype;
begin
  if tg_op = 'INSERT' and coalesce(current_setting('ra10.forum_restore', true), '') = '1' then
    return new;  -- staff restoring AI-removed content keeps its original author/date
  end if;
  if tg_op = 'INSERT' then
    new.user_id := coalesce(auth.uid(), new.user_id);
    if auth.uid() is null then raise exception 'Sign in to post.' using errcode = 'P0001'; end if;
    if public.forum_is_banned(new.user_id) then raise exception 'You can''t post right now.' using errcode = 'P0001'; end if;
    select * into v_cat from public.forum_categories where id = new.category_id;
    if not found then raise exception 'Unknown category.' using errcode = 'P0001'; end if;
    if v_cat.staff_only and not v_staff then raise exception 'Only community managers can post in this category.' using errcode = 'P0001'; end if;
    if not v_staff and (select count(*) from public.forum_posts where user_id = new.user_id and created_at > now() - interval '1 hour') >= 8 then
      raise exception 'Slow down — you can start up to 8 threads an hour.' using errcode = 'P0001';
    end if;
    if not v_staff then new.pinned := false; new.locked := false; end if;
    new.title := btrim(new.title); new.body := btrim(new.body);
    new.comment_count := 0; new.like_count := 0;
    new.created_at := now(); new.last_activity_at := now(); new.edited_at := null;
  else
    new.user_id := old.user_id;
    new.created_at := old.created_at;
    if not v_internal then
      new.comment_count := old.comment_count;
      new.like_count := old.like_count;
      new.last_activity_at := old.last_activity_at;
      if not v_staff then
        if old.user_id <> auth.uid() then raise exception 'Not your thread.' using errcode = 'P0001'; end if;
        if old.locked then raise exception 'This thread is locked.' using errcode = 'P0001'; end if;
        new.pinned := old.pinned; new.locked := old.locked; new.category_id := old.category_id;
      end if;
      if new.title is distinct from old.title or new.body is distinct from old.body then
        new.title := btrim(new.title); new.body := btrim(new.body); new.edited_at := now();
      end if;
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists forum_posts_before_write on public.forum_posts;
create trigger forum_posts_before_write before insert or update on public.forum_posts
for each row execute function public.forum_posts_before_write();

create or replace function public.forum_comments_before_write()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_staff boolean := public.is_community_staff();
  v_internal boolean := coalesce(current_setting('ra10.forum_internal', true), '') = '1';
  v_post public.forum_posts%rowtype;
  v_parent public.forum_comments%rowtype;
begin
  if tg_op = 'INSERT' and coalesce(current_setting('ra10.forum_restore', true), '') = '1' then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.user_id := coalesce(auth.uid(), new.user_id);
    if auth.uid() is null then raise exception 'Sign in to comment.' using errcode = 'P0001'; end if;
    if public.forum_is_banned(new.user_id) then raise exception 'You can''t comment right now.' using errcode = 'P0001'; end if;
    select * into v_post from public.forum_posts where id = new.post_id;
    if not found then raise exception 'That thread no longer exists.' using errcode = 'P0001'; end if;
    if v_post.locked and not v_staff then raise exception 'This thread is locked.' using errcode = 'P0001'; end if;
    if new.parent_id is not null then
      select * into v_parent from public.forum_comments where id = new.parent_id;
      if not found or v_parent.post_id <> new.post_id then raise exception 'Reply target not found.' using errcode = 'P0001'; end if;
      if v_parent.parent_id is not null then new.parent_id := v_parent.parent_id; end if;  -- keep it one level deep
    end if;
    if not v_staff and (select count(*) from public.forum_comments where user_id = new.user_id and created_at > now() - interval '1 hour') >= 40 then
      raise exception 'Slow down — too many comments this hour.' using errcode = 'P0001';
    end if;
    new.body := btrim(new.body); new.like_count := 0; new.created_at := now(); new.edited_at := null;
  else
    new.user_id := old.user_id; new.post_id := old.post_id; new.parent_id := old.parent_id; new.created_at := old.created_at;
    if not v_internal then
      new.like_count := old.like_count;
      if old.user_id <> auth.uid() and not v_staff then raise exception 'Not your comment.' using errcode = 'P0001'; end if;
      if new.body is distinct from old.body then new.body := btrim(new.body); new.edited_at := now(); end if;
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists forum_comments_before_write on public.forum_comments;
create trigger forum_comments_before_write before insert or update on public.forum_comments
for each row execute function public.forum_comments_before_write();

create or replace function public.forum_counters()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform set_config('ra10.forum_internal', '1', true);
  if tg_table_name = 'forum_comments' then
    if tg_op = 'INSERT' then
      update public.forum_posts set comment_count = comment_count + 1, last_activity_at = now() where id = new.post_id;
    else
      update public.forum_posts set comment_count = greatest(0, comment_count - 1) where id = old.post_id;
    end if;
  elsif tg_table_name = 'forum_post_likes' then
    if tg_op = 'INSERT' then update public.forum_posts set like_count = like_count + 1 where id = new.post_id;
    else update public.forum_posts set like_count = greatest(0, like_count - 1) where id = old.post_id; end if;
  elsif tg_table_name = 'forum_comment_likes' then
    if tg_op = 'INSERT' then update public.forum_comments set like_count = like_count + 1 where id = new.comment_id;
    else update public.forum_comments set like_count = greatest(0, like_count - 1) where id = old.comment_id; end if;
  end if;
  perform set_config('ra10.forum_internal', '', true);
  return null;
end;
$$;
drop trigger if exists forum_comments_counter on public.forum_comments;
create trigger forum_comments_counter after insert or delete on public.forum_comments
for each row execute function public.forum_counters();
drop trigger if exists forum_post_likes_counter on public.forum_post_likes;
create trigger forum_post_likes_counter after insert or delete on public.forum_post_likes
for each row execute function public.forum_counters();
drop trigger if exists forum_comment_likes_counter on public.forum_comment_likes;
create trigger forum_comment_likes_counter after insert or delete on public.forum_comment_likes
for each row execute function public.forum_counters();

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Row level security
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.forum_categories enable row level security;
alter table public.forum_posts enable row level security;
alter table public.forum_comments enable row level security;
alter table public.forum_post_likes enable row level security;
alter table public.forum_comment_likes enable row level security;
alter table public.forum_reports enable row level security;
alter table public.forum_bans enable row level security;

drop policy if exists "forum_categories read" on public.forum_categories;
create policy "forum_categories read" on public.forum_categories for select to anon, authenticated using (true);
drop policy if exists "forum_categories owner write" on public.forum_categories;
create policy "forum_categories owner write" on public.forum_categories for all to authenticated
  using (public.is_community_owner()) with check (public.is_community_owner());

drop policy if exists "forum_posts read" on public.forum_posts;
create policy "forum_posts read" on public.forum_posts for select to anon, authenticated using (true);
drop policy if exists "forum_posts insert" on public.forum_posts;
create policy "forum_posts insert" on public.forum_posts for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "forum_posts update" on public.forum_posts;
create policy "forum_posts update" on public.forum_posts for update to authenticated
  using (user_id = auth.uid() or public.is_community_staff()) with check (true);
drop policy if exists "forum_posts delete" on public.forum_posts;
create policy "forum_posts delete" on public.forum_posts for delete to authenticated
  using (user_id = auth.uid() or public.is_community_staff());

drop policy if exists "forum_comments read" on public.forum_comments;
create policy "forum_comments read" on public.forum_comments for select to anon, authenticated using (true);
drop policy if exists "forum_comments insert" on public.forum_comments;
create policy "forum_comments insert" on public.forum_comments for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "forum_comments update" on public.forum_comments;
create policy "forum_comments update" on public.forum_comments for update to authenticated
  using (user_id = auth.uid() or public.is_community_staff()) with check (true);
drop policy if exists "forum_comments delete" on public.forum_comments;
create policy "forum_comments delete" on public.forum_comments for delete to authenticated
  using (user_id = auth.uid() or public.is_community_staff());

drop policy if exists "forum_post_likes read" on public.forum_post_likes;
create policy "forum_post_likes read" on public.forum_post_likes for select to authenticated using (user_id = auth.uid());
drop policy if exists "forum_post_likes write" on public.forum_post_likes;
create policy "forum_post_likes write" on public.forum_post_likes for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "forum_post_likes delete" on public.forum_post_likes;
create policy "forum_post_likes delete" on public.forum_post_likes for delete to authenticated using (user_id = auth.uid());

drop policy if exists "forum_comment_likes read" on public.forum_comment_likes;
create policy "forum_comment_likes read" on public.forum_comment_likes for select to authenticated using (user_id = auth.uid());
drop policy if exists "forum_comment_likes write" on public.forum_comment_likes;
create policy "forum_comment_likes write" on public.forum_comment_likes for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "forum_comment_likes delete" on public.forum_comment_likes;
create policy "forum_comment_likes delete" on public.forum_comment_likes for delete to authenticated using (user_id = auth.uid());

drop policy if exists "forum_reports insert" on public.forum_reports;
create policy "forum_reports insert" on public.forum_reports for insert to authenticated with check (reporter_id = auth.uid());
drop policy if exists "forum_reports staff read" on public.forum_reports;
create policy "forum_reports staff read" on public.forum_reports for select to authenticated using (public.is_community_staff());
drop policy if exists "forum_reports staff update" on public.forum_reports;
create policy "forum_reports staff update" on public.forum_reports for update to authenticated using (public.is_community_staff()) with check (public.is_community_staff());
drop policy if exists "forum_reports staff delete" on public.forum_reports;
create policy "forum_reports staff delete" on public.forum_reports for delete to authenticated using (public.is_community_staff());

drop policy if exists "forum_bans staff" on public.forum_bans;
create policy "forum_bans staff" on public.forum_bans for all to authenticated
  using (public.is_community_staff()) with check (public.is_community_staff());

grant select on public.forum_categories, public.forum_posts, public.forum_comments to anon, authenticated;
grant insert, update, delete on public.forum_categories to authenticated;
grant insert, update, delete on public.forum_posts, public.forum_comments to authenticated;
grant select, insert, delete on public.forum_post_likes, public.forum_comment_likes to authenticated;
grant select, insert, update, delete on public.forum_reports, public.forum_bans to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Starter categories
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.forum_categories (id, name, description, icon, color, sort, staff_only) values
  ('announcements', 'Announcements', 'News and updates from the RA10 team.', '📣', '#d20000', 1, true),
  ('general', 'General chat', 'Anything study-related that doesn''t fit elsewhere.', '💬', '#2563eb', 10, false),
  ('a-level-business', 'A-Level Business', 'AQA 7132 and the new 7138 spec: questions, essays, case studies.', '📈', '#1e3a8a', 20, false),
  ('btec-business', 'BTEC Business', 'Units 2, 3, 6 and 7: set tasks, exams and finance.', '💼', '#0f766e', 30, false),
  ('btec-sport', 'BTEC Sport', 'Fitness, anatomy and Unit 2 set tasks.', '🏃', '#7c3aed', 40, false),
  ('btec-it', 'BTEC IT', 'Cyber security, databases, web development and more.', '💻', '#16a34a', 50, false),
  ('exam-tips', 'Exam tips & study skills', 'Revision timetables, mark-scheme tricks, staying calm.', '🎯', '#ea580c', 60, false),
  ('share-apps', 'Share your apps', 'Show off a study app you built and get feedback.', '📚', '#c026d3', 70, false),
  ('feedback', 'Ideas & feedback', 'Suggest features or report problems with RA10.', '💡', '#ca8a04', 80, false)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Study Apps community: working comments + staff moderation
--    (these tables were created before this repo tracked SQL, so everything
--     here is guarded and only adds policies / a counter trigger)
-- ─────────────────────────────────────────────────────────────────────────────
do $$
begin
  if to_regclass('public.community_app_comments') is not null then
    execute 'alter table public.community_app_comments enable row level security';
    execute 'drop policy if exists "app comments read" on public.community_app_comments';
    execute 'create policy "app comments read" on public.community_app_comments for select to anon, authenticated using (true)';
    execute 'drop policy if exists "app comments insert own" on public.community_app_comments';
    execute 'create policy "app comments insert own" on public.community_app_comments for insert to authenticated with check (user_id = auth.uid())';
    execute 'drop policy if exists "app comments delete own or staff" on public.community_app_comments';
    execute 'create policy "app comments delete own or staff" on public.community_app_comments for delete to authenticated using (user_id = auth.uid() or public.is_community_staff())';
    execute 'grant select on public.community_app_comments to anon, authenticated';
    execute 'grant insert, delete on public.community_app_comments to authenticated';
  end if;

  if to_regclass('public.community_apps') is not null then
    execute 'drop policy if exists "apps staff delete" on public.community_apps';
    execute 'create policy "apps staff delete" on public.community_apps for delete to authenticated using (public.is_community_staff())';
    execute 'drop policy if exists "apps staff update" on public.community_apps';
    execute 'create policy "apps staff update" on public.community_apps for update to authenticated using (public.is_community_staff()) with check (public.is_community_staff())';
    execute 'drop policy if exists "apps staff read all" on public.community_apps';
    execute 'create policy "apps staff read all" on public.community_apps for select to authenticated using (public.is_community_staff())';
  end if;
end;
$$;

-- Keep community_apps.comment_count in step with the comments table.
create or replace function public.community_app_comment_counter()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_app uuid;
begin
  if tg_op = 'DELETE' then v_app := old.app_id; else v_app := new.app_id; end if;
  -- Recount rather than +/-1 so it stays correct even if another trigger also exists.
  update public.community_apps
     set comment_count = (select count(*) from public.community_app_comments c where c.app_id = v_app)
   where id = v_app;
  return null;
end;
$$;
do $$
begin
  if to_regclass('public.community_app_comments') is not null and to_regclass('public.community_apps') is not null then
    execute 'drop trigger if exists community_app_comment_counter on public.community_app_comments';
    execute 'create trigger community_app_comment_counter after insert or delete on public.community_app_comments for each row execute function public.community_app_comment_counter()';
  end if;
end;
$$;
