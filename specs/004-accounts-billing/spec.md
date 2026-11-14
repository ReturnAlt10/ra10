# Feature Specification: Accounts, tiers, credits and billing

**Status**: As-built. **Payments paused:** transition mode gives every signed-in user unlimited use.

## User Scenarios & Testing

### US1 — Create an account and sign in (P1)

**Acceptance Scenarios**

1. **Given** a visitor, **When** they sign up with an email and password, **Then** an account is created with the Free tier and 10 credits. New accounts can never start with a privileged tier or extra credits.
2. **Given** a user who has forgotten their password, **When** they request a reset, **Then** they get a recovery link and can set a new password.
3. **Given** a signed-in user who has not accepted the current terms, **When** they use an AI feature, **Then** they are asked to accept first.

### US2 — Choose a plan and pay (P1, when payments resume)

**Acceptance Scenarios**

1. **Given** the upgrade page, **When** a user buys a plan, **Then** after successful payment their tier and credits match what was advertised.

   | Plan | Price | Credits |
   |---|---|---|
   | Subject | £5 one-time | 300 |
   | Pro | £20/yr | 1,000/month |
   | Ultra | £30/yr | Unlimited |
   | Credit packs | — | As bought |

2. **Given** a subscriber, **When** they open billing management, **Then** they can update or cancel through the payment provider's portal.
3. **Given** a monthly plan, **When** the month rolls over, **Then** credits reset to the plan's allowance.

### US3 — Spend credits on premium actions (P1)

**Acceptance Scenario**

1. **Given** a user with credits, **When** they use a paid action, **Then** the cost is deducted and the action runs. Costs: AI marking 3, mock paper 5, full guide 10, …
2. **When** credits are insufficient, **Then** a paywall explains the options.

### Edge Cases

- A user tries to raise their own credits or tier from the browser: this is rejected.
- A payment succeeds but the redirect fails: the webhook still applies the entitlement.
- School members get entitlements from their school: students 300 credits a month, teachers 600.

## Requirements

- **FR-001**: Entitlements (tier, unlimited flag, credit increases) MUST change only through server code: the payment webhook, monthly reset and school entitlement.
- **FR-002**: Credit spending MUST be atomic and enforced on the server for every paid action. *Gap today (R-04): spending is done from the client; the database only blocks increases.*
- **FR-003**: Checkout MUST have a kill switch (`PAYMENTS_ENABLED`) and a free-for-all transition mode.
- **FR-004**: Payment webhooks MUST be signature-verified.

## Key Entities

- **Profile:** tier, credits, credit reset date, unlimited flag, unlocked subjects, school, role, XP.
- **Plan** (tier info).
- **Action cost.**
- **Payment session / subscription** (at the payment provider).

## Success Criteria

- **SC-001**: 100% of successful test payments grant the exact advertised entitlement.
- **SC-002**: 0 successful client-side attempts to raise credits or tier in security tests.
