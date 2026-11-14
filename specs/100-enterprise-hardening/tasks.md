# Tasks: Enterprise hardening

**Input**: [spec.md](spec.md), [plan.md](plan.md). Tasks marked **[P]** can run in parallel. Tasks marked **⚑** need the owner's approval.

## Phase 0 — Repo hygiene (M-0)

- [ ] T001 `git rm -r --cached supabase/.temp revision/btec/level-3/IT-AAQ/unit-2/data/gen/__pycache__` (both are already in `.gitignore`)
- [ ] T002 ⚑ Untrack the 11 PDFs under `training-data/btec/level-3/{business,it,sport}/`, add their folders to `.gitignore`, and purge them from history with `git filter-repo --path-glob '*.pdf' --invert-paths`. Coordinate a force-push and re-clone.
- [ ] T003 [P] Delete the empty `supabase/functions/gocardless-*` folders
- [ ] T004 [P] Move `tools/gen_*.py`, `tools/patch_*.py`, `tools/fix_*.py` and `tools/rewrite_*.py` to `tools/archive/` with a README (provenance only)
- [ ] T005 [P] Add `CODEOWNERS`; enable branch protection on `main` (require a PR and the checks)
- [ ] T006 [P] Align the mismatched `?v=` tokens reported by `health_check.py` (`ra10-track.js`, the business `biz-*` files, `school.css`)

## Phase 1 — Schema in git (M-1)

- [ ] T010 ⚑ `npx supabase db dump --schema public,storage > supabase/schema/baseline.sql`; commit it
- [ ] T011 Convert `supabase/sql/*.sql` to `supabase/migrations/<ts>_<name>.sql` in the documented order ([03-data-model.md](../../enterprise/docs/03-data-model.md#2-migration-order))
- [ ] T012 Consolidate the duplicate functions (`increment_xp`, `xp_answer_is_meaningful`, `get_leaderboard`, `apply_school_entitlement`, the `edu_*` staff-role functions) into one migration each
- [ ] T013 Prove it: `supabase db reset` on a fresh local stack, then a diff against the production dump must be empty

## Phase 2 — Staging (M-2)

- [ ] T020 ⚑ Create a staging Supabase project or branch; deploy the functions; set test secrets (Stripe test mode)
- [ ] T021 Seed script: one user per tier and role (free, pro, ultra, school student, teacher, admin, moderator, owner-test)
- [ ] T022 Make the Supabase URL and anon key configurable (one `ra10-config.js`) so a preview site can point at staging. Today they are hard-coded in 48 files.

## Phase 3 — CI gates (M-3)

- [ ] T030 Workflow `ci.yml` on PRs:
  - `python enterprise/scripts/health_check.py`;
  - `node training-data/btec/level-3/aaq-build/check_units.js`;
  - `deno check` and `deno lint` for `supabase/functions/**`.
- [ ] T031 Playwright smoke test in CI: serve the repo, then run `browser_test.py` across all AAQ units and a generic per-unit smoke test for the other families
- [ ] T032 pgTAP tests: RLS cross-user denial, `increment_xp` caps, privilege-escalation trigger, `study_hub_premium()`
- [ ] T033 Make the Pages deploy depend on CI success

## Phase 4 — Money and abuse (M-4)

- [ ] T040 Migration: `action_costs`, `spend_credits()`, `refund_credits()` (plan.md)
- [ ] T041 Call `spend_credits` in `ai-mark`, `ai-assign`, `ai-transcribe` and `study-hub` (create) before the LLM call; refund on failure
- [ ] T042 Migration and RPC: `rate_check()`; apply it in the same functions
- [ ] T043 Strict CORS in every function (no `*` fallback)
- [ ] T044 Client: remove the direct `profiles.update({credits})` in `ra10-sdk.js`; display only. Tighten the trigger to reject all client credit changes.
- [ ] T045 Security test: curl without credits → refused; `profiles.update` of credits → refused

## Phase 5 — Roles (M-5), hosting (M-8)

- [ ] T050 Migration: `app_roles`, `has_role()`, `is_owner()`; backfill the owner
- [ ] T051 Replace the email checks (`grep -rn "mistry.hashim\|OWNER_EMAIL"`) in SQL, edge functions and the SDK
- [ ] T052 [P] ⚑ Move hosting to Cloudflare Pages or Netlify with `_redirects` (clean URLs) and `_headers` (CSP, HSTS, frame-ancestors); retire the `404.html` bounce
- [ ] T053 [P] Add SRI hashes to CDN scripts (supabase-js, CodeMirror, Pyodide loader, sql.js)

## Phase 6 — Build step and engines (M-6)

- [ ] T060 Vite multi-page build with hashed assets; remove manual `?v=` handling
- [ ] T061 Merge the three `biz-*` engine copies into one package with family adapters; update `build_apps.py`, `make_shared.py` and `build_units.py`
- [ ] T062 Consolidate the AI provider chain in `ai-mark` and `ai-assign` onto `_shared/ai.ts`
- [ ] T063 Split `refresh/site.js` by page (router, dashboard, account, news, owner tools)

## Phase 7 — Observability, AI quality, compliance (M-7, M-9, M-10)

- [ ] T070 Sentry for the frontend and functions; structured function logs; an LLM cost dashboard
- [ ] T071 Nightly AI benchmark run with alerts; add the Psychology and Edexcel sets (PL-08)
- [ ] T072 Server-side XP credibility: answer-review queue, async AI scoring, claw-back RPC; fix the "AI" false positive in `jsAnswerCredibility`
- [ ] T073 Decide whether to protect premium assets (signed URLs) or keep them public (M-7)
- [ ] T074 DPIA, retention jobs per table, `export_my_data()` / `delete_my_account()`, processor register, WCAG 2.2 AA audit
