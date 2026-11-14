# Implementation Plan (as-built): AI study tools

## Components

| Piece | Where |
|---|---|
| SQL | `supabase/sql/ai-tools.sql`: `ai_tool_trials`, `ai_tool_take` / `ai_tool_refund` (service role), `ai_tool_status()` (learner), `ai_tool_is_premium`, `user_flashcards` (own rows only), `prerelease_packs` (edge function only), `ai_usage_config` row `ai_tools`. Tested in postgres:15 and safe to re-run |
| Spec-gap task | `supabase/sql/xp-v3.sql`: `xp_gap()`, catalogue row `gap_drill` (never picked at random), metric `gap_drill` (activity kind `gap_drill`, score ≥ 2) |
| Edge function | `supabase/functions/ai-tools` actions: `status`, `coach`, `coach-check`, `ajim`, `blurt`, `blurt-mark`, `pack`, `pack-notes`, `pack-mark`, `pack-list`, `pack-open`, `bug`, `bug-mark`, `scan-cards`, `drill`. `_shared/vision.ts` reads images |
| Client helper | `refresh/ra10-ai-tools.js` (`RA10Tools`: `api`, `status`, `badge`, `gate`, `mascot`) |
| Unit apps | `refresh/ra10-coach.js` (AJIM checklist and fix-the-weak-link), injected by `ra10-refresh.js`. It listens for `ra10:ai-marked` |
| Study Hub | `study-hub/blurt.js` (`SHBlurt`), the tools row in `study.js` `paintMake()`, and the mascot hero |
| Tool pages | `/tools/prerelease/`, `/tools/bug-hunt/` (uses `study-hub/code-runner.js`), `/tools/scan/`, sharing `tools/ai-tools.css`. Deployed by the Pages workflow |
| Tasks | `refresh/ra10-tasks.js` `gapDrill()` |

## Mascot

Tenn (`RA10Tools.mascot(pose, size)`) is a flat, geometric study buddy with the poses idle, wave, think, cheer and listen. Use it sparingly: one per screen, for greetings, empty states, loading and results.

## Deploy order

1. Run `ai-tools.sql`.
2. Re-run `xp-v3.sql`.
3. Deploy the `ai-tools`, `daily-games` and `study-hub` functions.
4. Push the site.
