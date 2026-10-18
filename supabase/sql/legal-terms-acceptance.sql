-- ═══════════════════════════════════════════════════════════════════════════
-- RA10 — Terms of Service / Privacy Policy acceptance + onboarding
-- Run this in the Supabase SQL editor (https://supabase.com/dashboard).
-- Safe to re-run.
--
-- What this adds
--   1. public.legal_documents    — the CURRENT version of each legal document.
--                                  This is the single source of truth.
--   2. profiles columns          — which version each user accepted, and when.
--   3. public.legal_acceptances  — append-only audit log of every acceptance.
--   4. Guard triggers            — acceptance columns can only be written by the
--                                  accept_legal_terms() RPC or the service role,
--                                  so a user can't PATCH their own row to "accept".
--   5. RPCs                      — get_legal_status(), accept_legal_terms(),
--                                  has_accepted_current_terms().
--   6. Feature gating            — revision_sessions writes (XP / leaderboard)
--                                  require acceptance at the database level.
--                                  Edge functions (AI marking, AI Assigner,
--                                  community builder, profile pictures) check
--                                  via supabase/functions/_shared/legal.ts.
--
-- ─── Publishing a new version of the Terms or Privacy Policy ───────────────
-- 1. Edit legal/terms.html (or legal/privacy.html) and update the version
--    + "Last updated" date shown at the top of the page.
-- 2. Bump the version here — every user is asked to accept again on their
--    next visit, exactly once:
--
--      update public.legal_documents
--      set version = '2027-01-15',
--          change_summary = 'One-sentence summary of what changed.',
--          effective_at = now(),
--          updated_at = now()
--      where slug = 'terms';
--
-- 3. Update LEGAL_FALLBACK_VERSIONS in ra10-sdk.js to match (only used if
--    this database is unreachable).
-- ═══════════════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Current legal document versions
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.legal_documents (
  slug text primary key check (slug in ('terms', 'privacy')),
  title text not null,
  version text not null,
  url text not null,
  change_summary text,
  effective_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.legal_documents (slug, title, version, url, change_summary)
values
  ('terms',   'Terms of Service', '2026-10-18', 'https://ra10.co.uk/legal/terms.html',   'First published version.'),
  ('privacy', 'Privacy Policy',   '2026-10-18', 'https://ra10.co.uk/legal/privacy.html', 'First published version.')
on conflict (slug) do nothing;

alter table public.legal_documents enable row level security;

drop policy if exists "legal_documents readable by everyone" on public.legal_documents;
create policy "legal_documents readable by everyone"
  on public.legal_documents for select
  to anon, authenticated
  using (true);
-- No insert/update/delete policies: only the SQL editor / service role can
-- change versions.


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Profile columns
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists terms_accepted_version text,
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists privacy_accepted_version text,
  add column if not exists age_confirmed_at timestamptz;

-- onboarding_completed_at is NOT protected — the client sets it when the user
-- finishes the onboarding wizard. Existing accounts are backfilled the first
-- time this script runs so they only see the terms step, not the full wizard.
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'onboarding_completed_at'
  ) then
    alter table public.profiles add column onboarding_completed_at timestamptz;
    update public.profiles set onboarding_completed_at = coalesce(created_at, now());
  end if;
end;
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Audit log
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.legal_acceptances (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  document text not null,
  version text not null,
  accepted_at timestamptz not null default now(),
  user_agent text
);

create index if not exists legal_acceptances_user_idx
  on public.legal_acceptances (user_id, accepted_at desc);

alter table public.legal_acceptances enable row level security;

drop policy if exists "legal_acceptances own rows readable" on public.legal_acceptances;
create policy "legal_acceptances own rows readable"
  on public.legal_acceptances for select
  to authenticated
  using (user_id = auth.uid());
-- Inserts happen only inside accept_legal_terms() (security definer).


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Guard triggers — acceptance can't be faked through the public API
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public._legal_write_authorised()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  bypass text;
  caller_role text;
begin
  begin
    bypass := coalesce(current_setting('app.skip_legal_check', true), '');
  exception when others then
    bypass := '';
  end;
  if bypass = 'true' then
    return true;
  end if;

  begin
    caller_role := coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '');
  exception when others then
    caller_role := '';
  end;
  return caller_role = 'service_role';
end;
$$;

revoke all on function public._legal_write_authorised() from public;

create or replace function public.protect_legal_acceptance_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public._legal_write_authorised() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.terms_accepted_version := null;
    new.terms_accepted_at := null;
    new.privacy_accepted_version := null;
    new.age_confirmed_at := null;
    return new;
  end if;

  if new.terms_accepted_version is distinct from old.terms_accepted_version
     or new.terms_accepted_at is distinct from old.terms_accepted_at
     or new.privacy_accepted_version is distinct from old.privacy_accepted_version
     or new.age_confirmed_at is distinct from old.age_confirmed_at then
    raise exception 'Forbidden: use accept_legal_terms() to accept the Terms of Service';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_protect_legal_acceptance_columns on public.profiles;
create trigger trg_protect_legal_acceptance_columns
  before insert or update on public.profiles
  for each row
  execute function public.protect_legal_acceptance_columns();


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. RPCs
-- ─────────────────────────────────────────────────────────────────────────────

-- True when the given user has accepted the current Terms AND Privacy Policy.
create or replace function public.user_has_accepted_current_terms(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = p_user_id
      and p.terms_accepted_version = (select version from public.legal_documents where slug = 'terms')
      and p.privacy_accepted_version = (select version from public.legal_documents where slug = 'privacy')
  );
$$;

revoke all on function public.user_has_accepted_current_terms(uuid) from public, anon, authenticated;
grant execute on function public.user_has_accepted_current_terms(uuid) to service_role;

-- Same check for the calling user — used by RLS policies and the client.
create or replace function public.has_accepted_current_terms()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.user_has_accepted_current_terms(auth.uid()), false);
$$;

revoke all on function public.has_accepted_current_terms() from public;
grant execute on function public.has_accepted_current_terms() to authenticated;

-- Current versions (anyone) + the caller's acceptance state (if signed in).
create or replace function public.get_legal_status()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_terms json;
  v_privacy json;
  v_terms_version text;
  v_privacy_version text;
  v_accepted_terms text;
  v_accepted_privacy text;
  v_accepted_at timestamptz;
  v_onboarded_at timestamptz;
begin
  select version,
         json_build_object('version', version, 'url', url, 'change_summary', change_summary, 'effective_at', effective_at)
  into v_terms_version, v_terms
  from public.legal_documents where slug = 'terms';

  select version,
         json_build_object('version', version, 'url', url, 'change_summary', change_summary, 'effective_at', effective_at)
  into v_privacy_version, v_privacy
  from public.legal_documents where slug = 'privacy';

  if v_user_id is not null then
    select terms_accepted_version, privacy_accepted_version, terms_accepted_at, onboarding_completed_at
    into v_accepted_terms, v_accepted_privacy, v_accepted_at, v_onboarded_at
    from public.profiles where id = v_user_id;
  end if;

  return json_build_object(
    'terms', v_terms,
    'privacy', v_privacy,
    'signed_in', v_user_id is not null,
    'accepted_terms_version', v_accepted_terms,
    'accepted_privacy_version', v_accepted_privacy,
    'accepted_at', v_accepted_at,
    'has_previous_acceptance', v_accepted_terms is not null,
    'onboarding_completed_at', v_onboarded_at,
    'needs_acceptance', v_user_id is not null and (
      v_accepted_terms is distinct from v_terms_version
      or v_accepted_privacy is distinct from v_privacy_version
    )
  );
end;
$$;

revoke all on function public.get_legal_status() from public;
grant execute on function public.get_legal_status() to anon, authenticated;

-- Records acceptance. The client passes the versions it showed the user; a
-- mismatch (terms changed while the dialog was open) is rejected so nobody
-- "accepts" a version they never saw.
create or replace function public.accept_legal_terms(
  p_terms_version text,
  p_privacy_version text,
  p_age_confirmed boolean default false,
  p_user_agent text default null
)
returns json
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_terms_version text;
  v_privacy_version text;
  v_updated integer;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if not coalesce(p_age_confirmed, false) then
    return json_build_object('ok', false, 'reason', 'age_confirmation_required');
  end if;

  select version into v_terms_version from public.legal_documents where slug = 'terms';
  select version into v_privacy_version from public.legal_documents where slug = 'privacy';

  if p_terms_version is distinct from v_terms_version
     or p_privacy_version is distinct from v_privacy_version then
    return json_build_object(
      'ok', false,
      'reason', 'version_mismatch',
      'terms_version', v_terms_version,
      'privacy_version', v_privacy_version
    );
  end if;

  perform set_config('app.skip_legal_check', 'true', true);

  update public.profiles
  set terms_accepted_version = v_terms_version,
      terms_accepted_at = now(),
      privacy_accepted_version = v_privacy_version,
      age_confirmed_at = coalesce(age_confirmed_at, now())
  where id = v_user_id;
  get diagnostics v_updated = row_count;

  if v_updated = 0 then
    return json_build_object('ok', false, 'reason', 'no_profile');
  end if;

  insert into public.legal_acceptances (user_id, document, version, user_agent)
  values
    (v_user_id, 'terms', v_terms_version, left(p_user_agent, 400)),
    (v_user_id, 'privacy', v_privacy_version, left(p_user_agent, 400));

  return json_build_object(
    'ok', true,
    'terms_version', v_terms_version,
    'privacy_version', v_privacy_version,
    'accepted_at', now()
  );
end;
$$;

revoke all on function public.accept_legal_terms(text, text, boolean, text) from public;
grant execute on function public.accept_legal_terms(text, text, boolean, text) to authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Database-level feature gating
--    RESTRICTIVE policies are AND-ed with the existing permissive ones, so this
--    only adds the terms requirement — it never widens access.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
begin
  if to_regclass('public.revision_sessions') is not null then
    execute 'drop policy if exists "revision_sessions require terms (insert)" on public.revision_sessions';
    execute 'create policy "revision_sessions require terms (insert)" on public.revision_sessions
               as restrictive for insert to authenticated
               with check (public.has_accepted_current_terms())';
    execute 'drop policy if exists "revision_sessions require terms (update)" on public.revision_sessions';
    execute 'create policy "revision_sessions require terms (update)" on public.revision_sessions
               as restrictive for update to authenticated
               using (public.has_accepted_current_terms())
               with check (public.has_accepted_current_terms())';
  end if;
end;
$$;
