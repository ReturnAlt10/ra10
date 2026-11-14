# Implementation Plan (as-built): AI Examiner and AI Assigner

## Components

| Piece | Where |
|---|---|
| Client API | `ra10-sdk.js`: `examineAnswer(input)` (around line 2046), `aiMarkAnswer`, `askAiAssigner`, `markAssignment`, `transcribeWork`, `canUseAiMarking`, `gate('ai_mark')` (cost 3) |
| Marking function | `supabase/functions/ai-mark/index.ts` (about 1.7k lines): auth → `requireTermsAccepted` → profile → route → provider chain → post-process |
| Examiner modules | `ai-mark/{psychology,edexcel_business,business_2026,business,business_btec,sport_unit2}_examiner.ts`. Each exports `isX`, `X_SYSTEM`, `buildXPrompt`, `xPostProcess` |
| Routing order | Edexcel → Psychology → AQA 7138 → AQA 7132 → Sport U2 → BTEC Business → IT Unit 2 (`it_unit2_examiner.ts`) → IT Unit 14 2016 Nationals (`it_unit14_examiner.ts`, holistic band per activity) → generic |
| Ensemble | 9+ mark levels answers for AQA 7132 / 7138 and IT Unit 2: two independent opinions (OpenAI + Gemini, or two samples of one), a third if they are more than a level apart (median); `AI_MARK_ENSEMBLE=off` turns it off |
| Assigner | `supabase/functions/ai-assign` (`UNIT_PROFILES`, modes such as `hint`) |
| Transcription | `supabase/functions/ai-transcribe` (one image, about 2 MB) |
| Provider chain | OpenRouter → DeepSeek → OpenAI → Gemini (keys and models from secrets). `preferStrong` reorders it to paid models first |
| Feedback hook | `unit-ui.js` dispatches `ra10:ai-marked` → `unit-feedback.js` "Was this mark fair?" |
| Benchmark | `admin/quality/bench/*.json`, runner in `/admin/quality` |

## Usage limits (12 Nov 2026)

| Layer | Detail |
|---|---|
| SQL | `supabase/sql/ai-usage.sql`: `ai_usage_config` (10/hour, 40/day, ×3 launch extension), `ai_usage_events`, `ai_usage_plan`, `ai_usage_snapshot`, `ai_usage_status`, `ai_usage_consume`, `ai_usage_refund`, `ai_usage_set_config`. Tested in postgres:15: plans, limits, rolling windows, refunds, permissions, idempotency |
| Edge | `ai-mark`: `consumeUsage()` runs before the provider call; it returns **429** `{code:'usage_limit', usage}` when blocked; `refundUsage()` runs in `catch`; success includes `usage`. It fails open if the RPC is missing |
| SDK | `ra10-sdk.js`: `getAiUsage()`, `showUsageLimit(usage)`, `renderUsageCard(el)`, the `usagechange` event, a running-low toast, and the limit sheet. `examineAnswer` / `aiMarkAnswer` share `_postAiMark`. A filter skips the duplicate `alert()` that unit apps raise for the limit message. `ACTION_COSTS.ai_mark = 0` |
| Shell | Account page `#account-ai-usage` card (`site.js` mounts `RA10.renderUsageCard`). **Navbar ring** (`.ra10u-nav`): the SDK inserts it before `#nav-user-wrap` (desktop) and `#mobile-theme-toggle` (phone top bar) on the shell and on standalone pages that use `ra10-site-chrome.js`. It shows the marks usable right now (the fewer of hour/day left), is hidden for signed-out, Premium and EDU users, refreshes every 90 s, and opens the usage popup |

## Contract (response)

Every module's post-processor returns the shape the unit apps render: marks (clamped to `0..q.marks`), level, feedback sections, and optional AO or skill breakdowns. Keep it stable.

## Known gaps → roadmap

- **R-04 / R-05:** fixed for `ai-mark` (usage limits). Extend the same `feature` mechanism to `ai-assign`, `ai-transcribe` and `study-hub` (M-4).
- **R-06:** the CORS fallback is `*` (M-4).
- `ai-mark` and `ai-assign` keep their own copies of the provider chain. Consolidate them on `_shared/ai.ts` (M-6).
- The benchmark covers AQA 7132 only. Psychology and Edexcel sets are pending (PL-08).
