# PL-09 — Database change (table, column, RPC, RLS)

**Skill:** `.claude/skills/ra10-supabase-migration`.

## Rules

- **Idempotent.** Use `create table if not exists`, `alter table … add column if not exists`, `create or replace function`, and `drop policy if exists` before `create policy`. Every file must be safe to re-run.
- **RLS on every new table.** Enable it straight away and write explicit policies. The default is deny.
- **Validated writes go through `security definer` RPCs** that:
  - check `auth.uid()`;
  - `set search_path = public`;
  - `revoke all … from public, anon` and `grant execute … to authenticated`.
- **One definition per function.** If the function already exists in another file, change that file or remove its old copy in the same commit (risk R-02).
- **Owner-only RPCs** call `edu_is_owner()`. After M-5 they call `is_owner()`.
- **No client-trust columns.** If a column grants anything (tier, credits, role, XP), guard it with a trigger, like `prevent_profile_privilege_escalation`.
- **Personal data:** decide retention when you create the table, and document it in [03-data-model.md](../docs/03-data-model.md).

## Steps

1. **Write the script.**
   - Today: `supabase/sql/<feature>.sql`, with a header comment giving its purpose, "Run AFTER x.sql" and "Safe to re-run".
   - After M-1: `npx supabase migration new <feature>`.
2. **Test locally** in a throwaway Postgres:

   ```bash
   docker run --rm -d --name ra10pg -e POSTGRES_PASSWORD=x -p 54329:5432 postgres:15
   # create stubs: schema auth; function auth.uid() returns uuid (reads a GUC); tables profiles/schools as needed
   psql postgresql://postgres:x@localhost:54329/postgres -f stubs.sql -f supabase/sql/<feature>.sql
   psql … -f supabase/sql/<feature>.sql     # run TWICE: proves idempotency
   docker rm -f ra10pg && docker image rm postgres:15   # the owner's disk is small
   ```

   Exercise each RPC as two different fake users, and check that RLS denies cross-user reads.
3. **Update the docs:** [03-data-model.md](../docs/03-data-model.md) (tables, RPCs, migration order) and the matching spec in `specs/`.
4. **Get owner approval,** then the owner runs the script in **Supabase → SQL editor**. Production.
5. **Verify in production.** Check with `select pg_get_functiondef(...)` and `select * from pg_policies where tablename = '<t>'`.

## Verify

- [ ] The script ran twice cleanly in the test container.
- [ ] RLS is enabled, and cross-user access is denied.
- [ ] No function is now defined differently in two files (`grep -n "function public.<name>" supabase/sql/*.sql`).
- [ ] The data model doc and the migration order are updated.
