# 04 — Backend API (Supabase Edge Functions)

- **Base URL:** `https://tcrrgsylxbyyrmnouihl.supabase.co/functions/v1/<name>`
- **Runtime:** Deno (TypeScript), one folder per function (`supabase/functions/<name>/index.ts`).
- **Auth:** `Authorization: Bearer <user JWT>`. Every function except `stripe-webhook` and `community-share-preview` calls `auth.getUser()`.
- **Owner-only functions** check the **JWT email**, never the client-editable `profiles.email`.

## Catalogue

| Function | Caller | Auth | Purpose | Actions / inputs |
|---|---|---|---|---|
| `ai-mark` | `RA10.examineAnswer`, `aiMarkAnswer` (unit apps, Study Hub, quality benchmark) | User + legal terms + **usage limits** (`ai_usage_consume` before the AI call, `ai_usage_refund` on failure; **429** `{code:'usage_limit', usage}` when a limit is reached; success responses include `usage`; fails open if `ai-usage.sql` is not applied) | **AI Examiner.** Routes by question metadata to `psychology_examiner.ts` (7182), `edexcel_business_examiner.ts` (9BS0), `business_2026_examiner.ts` (7138), `business_examiner.ts` (7132), `business_btec_examiner.ts`, `sport_unit2_examiner.ts`, or generic marking. Accepts small diagram images as data URLs | `{question, answer, image?}` → marks, levels, feedback |
| `ai-assign` | `RA10.askAiAssigner`, `markAssignment`, AI helper | User | AI Assigner/Helper: unit-aware hints (`UNIT_PROFILES`) and coursework guidance. **It must never grade assignment drafts as final** (authenticity rule) | `mode: hint` / … |
| `ai-transcribe` | `RA10.transcribeWork` | User | Photo of handwriting → text (one image, up to about 2 MB) | `{image}` |
| `study-hub` | `study-hub/study.js`, `school.js` | User; Premium via `study_hub_premium()` | AI lessons | `plan`, `create`, `mark` (fallback only), `complete`, `assigned`, `draft`, `save-template`, `rewrite-step`, `refine` |
| `edu-manage` | `school.js`, `admin/` | User, with the role derived from the JWT | Schools | `scan-school` (AI reads the school website), `invite`, `invite-many`, `remove-member`, `analyse-student`, `analyse-class`, `set-subjects`, `activate`, `deactivate` |
| `community-moderate` | DB queue / staff | User + staff / owner | AI moderation of forum posts (`forum_mod_queue`); `remove` | |
| `community-applicant-summary` | Owner | Owner | Summarises a moderator applicant and caches the result on the application row | |
| `community-create-job`, `community-process-job` | Community studio | User | Async "create a study app" jobs (`community_app_jobs`) | |
| `community-share-preview` | Social crawlers | **Public** | Open Graph preview for shared community apps | |
| `site-announcement` | Shell (`fetchSiteAnnouncement`), owner panel | Public `get`; owner `post` / `clear` | Site-wide announcement bar (message of up to 240 characters, emoji, expiry) | |
| `create-checkout` | `RA10.startCheckout` | User | Stripe Checkout session; gated by `PAYMENTS_ENABLED` | price key |
| `confirm-checkout` | Return page | User | Confirms the session and applies the entitlement | |
| `stripe-webhook` | Stripe | **Stripe signature** (`STRIPE_WEBHOOK_SECRET`) | Source of truth for tier and credits after payment | |
| `billing-status` | Account page | User | Subscription status from Stripe | |
| `create-billing-portal` | Account page | User | Stripe customer portal URL | |
| `upload-profile-image` | Account | User | Validated avatar upload to storage | |
| `list-profile-pictures`, `remove-profile-picture`, `reset-username` | Owner tools | Owner | Profile moderation | |
| `gocardless-*` | — | — | **Empty folders. Delete them** | |

## Shared modules

### `_shared/ai.ts`

- **Providers:** `providers(timeout)` builds the chain **OpenRouter → DeepSeek → OpenAI → Gemini** from whichever keys are set.
- **`askJson(system, user, timeout, {preferStrong, temperature, maxTokens})`** returns the first JSON reply that parses. With `preferStrong:true` it tries paid or larger models before the free OpenRouter ones. Use it whenever accuracy matters (answer keys, verification).
- **`extractJson`** strips code fences and recovers the first `{…}` object.
- **Duplication:** `ai-mark` and `ai-assign` keep their own copies of the provider chain (same order and env vars). Consolidating them is roadmap M-6.

### `_shared/legal.ts`

`requireTermsAccepted(supabase, userId, cors)` returns 403 until the user accepts the current terms (`legal_documents`).

## Secrets (Supabase → Edge Functions → Secrets)

| Secret | Used by |
|---|---|
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY` | All functions (auto-injected) |
| `OPENROUTER_API_KEY`, `OPENROUTER_MODELS` | AI functions |
| `DEEPSEEK_API_KEY`, `DEEPSEEK_MODEL` | AI functions |
| `OPENAI_API_KEY`, `OPENAI_ENDPOINT`, `OPENAI_MODELS` | AI functions |
| `GEMINI_API_KEY`, `GEMINI_ENDPOINT`, `GEMINI_MODELS` | AI functions |
| `AI_MARK_ENSEMBLE` | `ai-mark`: `off` stops the second opinion on long answers (default on; doubles AI cost for 9+ mark answers) |
| `MODERATION_MODEL`, `SUMMARY_MODEL` | Community AI |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Billing |
| `STRIPE_PRICE_{IT,BUSINESS,SPORT,PRO,PRO_MONTHLY,ULTRA,ULTRA_MONTHLY,EDU,CREDITS}` | Billing |
| `PAYMENTS_ENABLED` | `create-checkout` kill switch |
| `SITE_URL` | Checkout, portal and email links |
| `RESEND_API_KEY`, `EDU_FROM_EMAIL` | Optional branded EDU emails |

## Known API weaknesses (also in the risk register)

| ID | Issue | Fix |
|---|---|---|
| R-04 | **Fixed for the AI Examiner (12 Nov 2026):** server-side usage limits replace credits. **Still open for other paid actions:** credits are deducted in the browser (`RA10.spendCredits` updates `profiles.credits`). AI functions check sign-in and terms but do not charge or meter, so a user can call `ai-mark` directly without spending credits. Today `TRANSITION_MODE` makes this moot, but it must be fixed before payments return | Move charging into the functions: an atomic `spend_credits(action)` RPC called with the user's JWT, before the LLM call |
| R-05 | **`ai-mark` now has hourly and daily limits** (`ai-usage.sql`). Still **no limit** on `ai-assign`, `ai-transcribe` or `study-hub`; reuse `ai_usage_consume` with a new `feature` row | A per-user token bucket in Postgres (as in `xp_rate`) or an API gateway |
| R-06 | **The CORS allow-list falls back to `*`** (`isAllowed ? origin : "*"`), so the list has no effect | Return no ACAO header (or 403) for unknown origins |
| R-07 | Functions have no contract tests and no typed request/response schemas | Add zod schemas and Deno tests per function (roadmap M-3) |

## Calling convention (client)

Always go through `window.RA10`. It handles the session, legal gate, paywall and error toasts:

```js
const ok  = await RA10.gate('ai_mark');          // sign-in + terms + credits check (ACTION_COSTS.ai_mark = 3)
const res = await RA10.examineAnswer(input);     // AI Examiner; input = { question, answer, … } (see ra10-sdk.js ~L2046)
```

Calling `fetch(FUNCTIONS_URL + '/x')` directly is reserved for code that cannot load the SDK (for example the announcement fetch).
