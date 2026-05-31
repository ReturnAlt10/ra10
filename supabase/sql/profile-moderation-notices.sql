alter table public.profiles
  add column if not exists moderation_notice_type text,
  add column if not exists moderation_notice_reason text,
  add column if not exists moderation_notice_message text,
  add column if not exists moderation_notice_created_at timestamptz,
  add column if not exists moderation_notice_seen boolean not null default true;
