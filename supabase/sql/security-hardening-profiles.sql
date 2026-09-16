-- ═══════════════════════════════════════════════════════════════════════════
-- RA10 — profiles privilege-escalation hardening
-- Run this in the Supabase SQL editor (https://supabase.com/dashboard).
--
-- The profiles UPDATE policy currently allows any authenticated user to
-- update their OWN row (auth.uid() = id) with NO column restrictions. That
-- means a signed-in user can PATCH /rest/v1/profiles and set
--   - tier              → 'owner' / 'ultra'  (unlimited credits + admin paths)
--   - unlimited_credits → true               (isOwner() + ∞ credits)
--   - credits           → 999999             (free usage, defeats paywall)
--   - unlocked_subjects → ['IT AAQ', ...]    (unlock paid subjects)
--
-- This trigger closes those holes by rejecting privileged changes that do NOT
-- come from the service_role (i.e. edge functions) or a security-definer RPC
-- that set the internal bypass flag. Client (anon/authenticated) requests are
-- only allowed to decrement credits (spending) and edit non-privileged fields
-- (display name, profile picture, school_id/school_name, etc.).
--
-- ⚠️  IMPORTANT — the two client flows below that previously self-upgraded
-- tier/credits must now go through the server-side RPCs (also provided here):
--   1. `_applySchoolEntitlementByEmail`  → apply_school_entitlement()
--   2. `_maybeResetMonthlyCredits`       → reset_monthly_credits()
-- The shipped ra10-sdk.js already calls these RPCs first, with a legacy
-- direct-update fallback that runs only until this SQL is applied.
-- ═══════════════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Privilege-escalation guard trigger
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.prevent_profile_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role text;
  bypass text;
begin
  -- Security-definer RPCs set this local GUC inside their transaction; it is
  -- invisible to direct client requests, so it cannot be spoofed from the API.
  begin
    bypass := coalesce(current_setting('app.skip_profile_priv_check', true), '');
  exception when others then
    bypass := '';
  end;
  if bypass = 'true' then
    return new;
  end if;

  -- Edge functions use the service_role key; give them unrestricted access.
  begin
    caller_role := coalesce(
      current_setting('request.jwt.claims', true)::jsonb ->> 'role',
      ''
    );
  exception when others then
    caller_role := '';
  end;

  if caller_role = 'service_role' then
    return new;
  end if;

  -- Privileged columns must never change via the public API.
  if new.tier is distinct from old.tier then
    raise exception 'Forbidden: tier cannot be changed directly';
  end if;
  if new.unlimited_credits is distinct from old.unlimited_credits then
    raise exception 'Forbidden: unlimited_credits cannot be changed directly';
  end if;
  if new.unlocked_subjects is distinct from old.unlocked_subjects then
    raise exception 'Forbidden: unlocked_subjects cannot be changed directly';
  end if;
  -- Note: school_id / school_name are deliberately NOT protected — they are
  -- updated by the admin portal on the admin's own profile during onboarding
  -- and do not grant access by themselves (tier + unlimited_credits do).

  -- Credits may only go down (spending). Increases must use the RPC below.
  if coalesce(new.credits, 0) > coalesce(old.credits, 0) then
    raise exception 'Forbidden: credits cannot be increased directly';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_prevent_profile_privilege_escalation on public.profiles;
create trigger trg_prevent_profile_privilege_escalation
  before update on public.profiles
  for each row
  execute function public.prevent_profile_privilege_escalation();


-- ─────────────────────────────────────────────────────────────────────────────
-- 1b. INSERT guard — force safe defaults on self-service profile creation.
--     A brand-new user must not be able to insert their own row with
--     tier='owner' / unlimited_credits=true and thereby escalate.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.sanitise_profile_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role text;
begin
  begin
    caller_role := coalesce(
      current_setting('request.jwt.claims', true)::jsonb ->> 'role',
      ''
    );
  exception when others then
    caller_role := '';
  end;

  -- Edge functions may insert arbitrary values.
  if caller_role = 'service_role' then
    return new;
  end if;

  new.tier := 'free';
  new.credits := 10;
  new.unlimited_credits := false;
  new.unlocked_subjects := coalesce(new.unlocked_subjects, array[]::text[]);
  new.school_id := null;
  new.school_name := null;
  return new;
end;
$$;

drop trigger if exists trg_sanitise_profile_insert on public.profiles;
create trigger trg_sanitise_profile_insert
  before insert on public.profiles
  for each row
  execute function public.sanitise_profile_insert();


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. School entitlement (replaces client-side _applySchoolEntitlementByEmail)
--    Server-side look-up of school_members; only upgrades tiers the school
--    membership actually authorises. Callable ONLY by the affected user.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.apply_school_entitlement()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text;
  v_member record;
  v_tier text;
  v_credits integer;
  v_subjects text[];
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select email into v_email from auth.users where id = v_user_id;
  v_email := lower(coalesce(v_email, ''));

  select id, role, school_id, status, subjects into v_member
  from public.school_members
  where lower(email) = v_email
    and status in ('invited', 'active')
    and role in ('student', 'teacher')
  order by id desc
  limit 1;

  if v_member.id is null then
    return json_build_object('ok', false, 'reason', 'no_membership');
  end if;

  v_tier := case when v_member.role = 'teacher' then 'school_teacher' else 'school_student' end;
  v_credits := case when v_member.role = 'teacher' then 600 else 300 end;
  v_subjects := coalesce(v_member.subjects, array['IT AAQ', 'Business Level 3', 'Sport Level 3']);

  -- Authorise this server-side write through the privilege-escalation trigger.
  perform set_config('app.skip_profile_priv_check', 'true', true);

  update public.profiles
  set tier = v_tier,
      credits = v_credits,
      credits_reset_at = (now() + interval '1 month'),
      school_id = v_member.school_id,
      unlocked_subjects = v_subjects
  where id = v_user_id;

  update public.school_members
  set status = 'active'
  where id = v_member.id and status <> 'active';

  return json_build_object('ok', true, 'tier', v_tier, 'credits', v_credits);
end;
$$;

revoke all on function public.apply_school_entitlement() from public;
grant execute on function public.apply_school_entitlement() to authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Monthly reset (replaces client-side _maybeResetMonthlyCredits)
--    Only sets the tier-correct amount when the reset date has actually passed.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.reset_monthly_credits()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_row record;
  v_amount integer;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select tier, credits, credits_reset_at into v_row
  from public.profiles
  where id = v_user_id;

  if v_row.tier not in ('free', 'all_subjects', 'school_student', 'school_teacher', 'school_admin') then
    return json_build_object('ok', true, 'skipped', true);
  end if;

  if v_row.credits_reset_at is not null and v_row.credits_reset_at > now() then
    return json_build_object('ok', true, 'skipped', true);
  end if;

  v_amount := case v_row.tier
    when 'free' then 10
    when 'all_subjects' then 1000
    when 'school_admin' then 300
    when 'school_student' then 300
    when 'school_teacher' then 600
    else 0
  end;

  -- Authorise this server-side write through the privilege-escalation trigger.
  perform set_config('app.skip_profile_priv_check', 'true', true);

  update public.profiles
  set credits = v_amount,
      credits_reset_at = (now() + interval '1 month')
  where id = v_user_id;

  return json_build_object('ok', true, 'credits', v_amount);
end;
$$;

revoke all on function public.reset_monthly_credits() from public;
grant execute on function public.reset_monthly_credits() to authenticated;