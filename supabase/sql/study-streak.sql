-- ═══════════════════════════════════════════════════════════════════════════
-- RA10 — account-based study streak
-- Run this in the Supabase SQL editor. Safe to re-run.
--
-- One row per (user, calendar day) the user studied. The site derives the
-- streak from these rows, so it is identical on every device and browser.
-- Days are the user's own local calendar day, sent by the client.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.study_days (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  day date not null,
  created_at timestamptz not null default now(),
  primary key (user_id, day)
);
create index if not exists study_days_user_day_idx on public.study_days (user_id, day desc);

-- Keep the data honest: a day can't be in the future (allowing for time zones
-- up to UTC+14) or more than 400 days old, and ownership can't be spoofed.
create or replace function public.study_days_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.user_id := coalesce(auth.uid(), new.user_id);
  if new.day > (now() at time zone 'utc')::date + 1 or new.day < (now() at time zone 'utc')::date - 400 then
    return null;  -- silently skip out-of-range days (keeps bulk upserts working)
  end if;
  new.created_at := now();
  return new;
end;
$$;

drop trigger if exists study_days_before_insert on public.study_days;
create trigger study_days_before_insert
before insert on public.study_days
for each row execute function public.study_days_before_insert();

alter table public.study_days enable row level security;

drop policy if exists "study_days own select" on public.study_days;
create policy "study_days own select" on public.study_days
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "study_days own insert" on public.study_days;
create policy "study_days own insert" on public.study_days
  for insert to authenticated
  with check (user_id = auth.uid());

grant select, insert on public.study_days to authenticated;
