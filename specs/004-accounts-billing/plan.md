# Implementation Plan (as-built): Accounts, tiers, credits and billing

## Components

| Piece | Where |
|---|---|
| Auth | Supabase Auth via `ra10-sdk.js` (`signUp`, `signIn`, `resetPassword`, `handleRecoveryTokens`); session key `ra10.auth.token` |
| Tiers and costs | `ra10-sdk.js`: `TIER_INFO` (free, subject, all_subjects/Pro, ultra, school_student, school_teacher, school_admin, owner), `ACTION_COSTS`, `UNLIMITED_TIERS`, `TRANSITION_MODE = true` |
| Spending | `RA10.spendCredits(action)`. Client-side `profiles.update({credits})`, plus an exam-season bonus in localStorage |
| Guard triggers | `security-hardening-profiles.sql`: `prevent_profile_privilege_escalation` (no tier or unlimited changes, no credit increases); `sanitise_profile_insert` (10 credits, not unlimited) |
| Server grants | `stripe-webhook` (source of truth), `confirm-checkout`, `reset_monthly_credits()`, `apply_school_entitlement()` |
| Checkout and portal | `create-checkout` (`PAYMENTS_ENABLED`, `STRIPE_PRICE_*`), `create-billing-portal`, `billing-status` |
| Setup notes | `STRIPE_SETUP.md`, `tools/setup-stripe-test.ps1` |

## Known gaps → roadmap M-4

1. Add `spend_credits(p_action text) returns integer` (`security definer`). It looks up the cost in a server-side `action_costs` table, then decrements atomically (`update … where credits >= cost returning credits`), or allows the action for unlimited users.
2. Each paid edge function calls it with the user's JWT before the LLM call, and refunds on provider failure.
3. The client stops writing `credits` directly; the trigger then rejects all client credit changes.
4. Retire the localStorage exam bonus, or move it to the server.
5. Only then set `TRANSITION_MODE = false` and `PAYMENTS_ENABLED=true`.
