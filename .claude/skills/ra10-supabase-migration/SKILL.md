---
name: ra10-supabase-migration
description: Write, test and document an RA10 database change (table, column, RPC, RLS policy, trigger) for Supabase Postgres — idempotent SQL, RLS by default, security-definer RPCs, no duplicate function definitions, tested in a throwaway postgres:15 container. Use for any schema or SQL change.
---

# Supabase migration (RA10)

- Pipeline: `enterprise/playbook/PL-09-database-migration.md`.
- Data model: `enterprise/docs/03-data-model.md`.

## Hard rules

1. **Idempotent:** `if not exists`, `create or replace`, and `drop policy if exists` before `create policy`. The file must be safe to re-run.
2. **RLS on every new table,** with explicit policies.
3. **Validated writes go through `security definer` RPCs** with:
   - `set search_path = public` and `auth.uid()` checks;
   - `revoke all … from public, anon` and `grant execute … to authenticated`.
4. **Owner checks** use `edu_is_owner()`. Never compare against a client-supplied email.
5. **One definition per function.** Before writing `create or replace function public.<f>`, run `grep -n "function public.<f>" supabase/sql/*.sql`. If it exists elsewhere, edit that definition or delete the old copy in the same change. Known hazard: `increment_xp` is in `edu-platform.sql`, `profile-preferences.sql` and `xp-integrity.sql`, and `xp-integrity.sql` must be run last.
6. **Privileged columns** (tier, credits, role, XP) must be protected by triggers (see `prevent_profile_privilege_escalation`).
7. **Header comment:** purpose, `Run AFTER <file>.sql`, `Safe to re-run`.
8. **Never run SQL on production yourself.** Hand the file to the owner.

## Test

1. Start a throwaway container:

   ```bash
   docker run --rm -d --name ra10pg -e POSTGRES_PASSWORD=x -p 54329:5432 postgres:15
   ```

2. Write `stubs.sql` with:
   - `create schema auth;`
   - `create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;`
   - the roles `anon` and `authenticated`;
   - minimal `profiles` / `schools` tables as needed.
3. Apply the files:

   ```bash
   psql postgresql://postgres:x@localhost:54329/postgres -f stubs.sql -f <deps>.sql -f supabase/sql/<new>.sql
   psql postgresql://postgres:x@localhost:54329/postgres -f supabase/sql/<new>.sql   # 2nd run = idempotency
   ```

4. Exercise the RPCs as two users (`set request.jwt.claim.sub = '<uuid>'`; `set role authenticated;`). Cross-user reads must fail.
5. Clean up: `docker rm -f ra10pg && docker image rm postgres:15` (the owner's disk is small).

## Document

Update the tables and RPCs, the migration order and the drift table in `enterprise/docs/03-data-model.md`, and the matching `specs/*/plan.md`.
