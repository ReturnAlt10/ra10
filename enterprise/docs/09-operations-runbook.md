# 09 — Operations Runbook

## 1. Local development

```bash
# from the repo root: serve the static site (unit browser tests expect port 5500)
python -m http.server 5500 --bind 127.0.0.1
# open http://127.0.0.1:5500/  (clean URLs need the 404 bounce, so open /index.html or use
# http://127.0.0.1:5500/?__route=/btec/level-3/sport/unit-1 to test a deep link)
```

| Need | Tool |
|---|---|
| Python 3.11+ | Build pipelines. `pip install pymupdf playwright` → `playwright install chromium` (the tests use `channel='chrome'`) |
| Node 18+ | `node --check`, `check_units.js`, exporting data such as `PY_TASKS` |
| Supabase CLI | `npx supabase` (already linked to project `ra10` / `tcrrgsylxbyyrmnouihl` on the owner's machine) |
| Docker (optional) | Throwaway `postgres:15` for SQL tests |

The local site talks to the **production** Supabase project; there is no staging yet (M-2). Use a test account, not the owner account, when testing writes.

## 2. Release procedure (static site)

1. Run the checks:

   ```bash
   python enterprise/scripts/health_check.py            # repo health (must be 0 FAIL)
   node training-data/btec/level-3/aaq-build/check_units.js   # if AAQ content changed
   python training-data/btec/level-3/aaq-build/browser_test.py <slug> <N>   # if a unit changed
   ```

2. Bump the cache versions for every shared asset you changed (table in [05-frontend-runtime.md §6](05-frontend-runtime.md#6-caching-and-versioning)).
3. If public features changed, add a News article to `index.html` (`#p-news`, playbook PL-14).
4. Commit and push to `main`. The **Pages workflow deploys automatically** in about 1–2 minutes. Watch it in GitHub → Actions.
5. Smoke test production: the homepage, one unit per family, sign-in, an AI Examiner call and Study Hub.

**Rollback:** `git revert <sha>` and push; Pages redeploys. Cached assets clear once versions are bumped.

## 3. Edge functions

```bash
npx supabase functions deploy ai-mark            # one function
npx supabase functions deploy ai-mark ai-assign study-hub
npx supabase secrets list
npx supabase secrets set OPENAI_MODELS="gpt-4o-mini,gpt-4o"
npx supabase functions logs ai-mark --tail       # (or Dashboard → Edge Functions → Logs)
```

- **Rollback:** redeploy the previous git revision of the function folder.
- **Shared code:** functions bundle `_shared/` at deploy time. If you change `_shared/ai.ts`, redeploy every function that imports it (`grep -l "_shared/ai" supabase/functions/*/index.ts`).

## 4. Database changes

Today the owner pastes SQL into **Dashboard → SQL editor**.

1. Write an idempotent script (`create … if not exists`, `create or replace`, `drop policy if exists`).
2. Test it in a throwaway container (see [03-data-model.md §4](03-data-model.md#4-testing-sql-safely)).
3. Get the owner's approval, then run it in production.
4. If it redefines a function that exists in another file, update or remove the other definition in the same commit.
5. Re-run `xp-integrity.sql` after re-running `edu-platform.sql` (R-02).

Once M-1 lands, this becomes `npx supabase migration new <name>` → `supabase db push` through CI.

## 5. Secrets rotation

| Secret | Rotate how |
|---|---|
| LLM keys | Create a new key in the provider console → `supabase secrets set` → revoke the old key |
| `STRIPE_SECRET_KEY` | Roll it in Stripe → set the secret → redeploy the billing functions |
| `STRIPE_WEBHOOK_SECRET` | Roll the endpoint secret → set → redeploy `stripe-webhook` |
| Service role key | Supabase → Settings → API (rotate JWT secret). **This invalidates all sessions; plan downtime** |
| Anon key | Public by design, but **hard-coded in 48 files** (`ra10-sdk.js`, `refresh/site.js`, `admin/index.html` and every unit's `js/app.js`). To rotate: regenerate the units through their builders and search-replace the rest. Roadmap M-6 should centralise it in one config module |

## 6. Common operational tasks

| Task | How |
|---|---|
| Post a site announcement | Account page (owner) → "Owner announcement bar": emoji, message of up to 240 characters, duration (playbook PL-14) |
| **End the AI Examiner launch extension** (when the enterprise migration is over) | `update public.ai_usage_config set extension_active = false where feature = 'ai_mark';` Limits drop from 30/120 to 10/40 straight away; no deploy needed. To undo, set it back to `true` |
| Change AI Examiner limits | `update public.ai_usage_config set hourly_limit = 12, daily_limit = 50 where feature = 'ai_mark';` (or the owner RPC `ai_usage_set_config`) |
| Review suspicious XP | `select * from public.xp_owner_review(50);` as the owner shows weekly XP the ledger cannot explain. Correct one account with `select public.xp_owner_adjust('<uuid>', -500, 'reason');`. To make this week's board fair after deploying XP v3: `select public.xp_owner_reset_week_to_ledger();` |
| Change daily tasks | Edit rows in `daily_task_catalog` (slot, target, xp, `active`). One task per slot is picked per learner per day |
| Change AI tool free tries | Edit `ai_tool_free_tries()` in `ai-tools.sql` (coach 3, blurt 3, prerelease 2, bughunt 3) and re-run it. Give someone more tries: `delete from public.ai_tool_trials where user_id = '<uuid>';` |
| Change AI tool usage limits | `update public.ai_usage_config set hourly_limit = 15, daily_limit = 50 where feature = 'ai_tools';` |
| See a learner's AI usage | `select public.ai_usage_snapshot('<user uuid>', 'ai_mark');` |
| Turn payments back on | Set the `PAYMENTS_ENABLED` secret; set `TRANSITION_MODE = false` in `ra10-sdk.js`; deploy. **Fix R-04 first** |
| Grant a role or badge | `set_user_role` RPC (owner) or the owner tools on the account page |
| Make a school admin | `edu_setup_school` / `apply_school_entitlement` (see `edu-platform.sql`) |
| Change who is Premium (Study Hub) | Edit **only** `study_hub_premium()` in `study-hub.sql` |
| Review AI moderation | Community → staff tools (`forum_mod_log`, `forum_restore`) |
| Check content quality | `/admin/quality/` (owner): run the audit, review reports, run the benchmark |
| Ban a forum user | Staff tools → `forum_bans` |

## 7. Incident playbooks

| Symptom | Likely cause | Action |
|---|---|---|
| AI Examiner returns "AI provider keys are not configured" (503) | Secrets missing after a project change | `supabase secrets list`; set the keys |
| AI marking slow or failing | Provider outage | Check function logs. The chain falls back automatically; reorder or remove a provider through `*_MODELS` secrets |
| Users see an old UI after a deploy | Cache token not bumped | Bump `?v=` / `V` and redeploy |
| Deep link shows the homepage | The `404.html` bounce or the route map | Check `toInternalPath` and the route map in `site.js` |
| XP spikes on the leaderboard | XP from before XP v3, or an unexpected path | `select * from public.xp_ledger where user_id = '<uuid>' order by created_at desc limit 50;` and `xp_owner_review()`. Confirm the live definition: `select pg_get_functiondef('public.increment_xp(integer)'::regprocedure)` must mention `xp_claim` |
| Stripe paid but no tier | Webhook failure | Stripe → Webhooks → resend the event; check `stripe-webhook` logs |
| Overlay frozen or invisible on a standalone page | CSS stacking | `position:fixed!important` + attach to `document.documentElement` |
| Unit shows "RA10UnitUI is not defined" in tests | Slow load (known flake) | Rerun before investigating |
