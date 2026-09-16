# GoCardless Setup

This project now uses **GoCardless** (Direct Debit / BACS) for checkout and webhooks, replacing Stripe.

## How it fits together

```
Buy button  →  RA10.startCheckout()  →  /functions/v1/gocardless-checkout
                                            │  1) insert gocardless_orders row (order_ref)
                                            │  2) create GoCardless billing_request
                                            │     (mandate_request, + payment_request if one-off)
                                            │  3) link billing request id → order.gocardless_ref
                                            │  4) create billing_request_flow → authorisation_url
                                            ▼
                                    user's browser → GoCardless hosted payment page
                                            │
                        (user sets up Direct Debit mandate)
                                            │
                                            ▼
                              GoCardless webhook → /functions/v1/gocardless-webhook
                                            │  verifies Webhook-Signature (HMAC-SHA256 hex)
                                            │  looks up gocardless_orders by order_ref (metadata)
                                            │  grants tier/credits/subjects on profiles
                                            ▼
                              billing-status / cancel read gocardless_orders + GoCardless
```

## Important GoCardless constraints this code depends on

- **Metadata is limited to 3 keys** (key ≤ 50 chars, value ≤ 500 chars). The code stores only `{ order_ref }` and looks up the full purchase intent from the `gocardless_orders` table.
- **`subscription_request` on a billing request is only supported for ACH/PAD — NOT BACS.** Subscriptions are therefore created *after* the mandate activates (the webhook listens for `mandates.activated`, then creates the subscription and, on `subscriptions.created`, grants the plan).
- **BACS settlement is slow.** One-off Direct Debit payments aren't instant — the account is upgraded on the `payments.confirmed` webhook, not on redirect.
- **`payment_request.amount` is a number** in minor units (pence), not a string.

## 1) Create `gocardless_orders` table

Run the SQL in the Supabase dashboard SQL editor (paste the whole file):

```
supabase/sql/gocardless-orders.sql
```

This creates the order-tracking table with service-role-only RLS.

## 2) Get GoCardless credentials (sandbox first)

1. Create a sandbox account: https://manage-sandbox.gocardless.com/
2. Create an **Access Token** (Sandbox → Developers → Create token).
3. Create a **Webhook Endpoint** in the dashboard and copy the **Webhook Secret**.

Sandbox test bank details (use these on the hosted page):
- Sort code: `200000`
- Account number: `55779911`

## 3) Set Supabase Edge Function secrets

Set these in Supabase (project settings → Edge Functions → Secrets):

- `GOCARDLESS_ACCESS_TOKEN` = your access token (sandbox: `4S...`)
- `GOCARDLESS_ENVIRONMENT` = `sandbox` (or `live` for production)
- `GOCARDLESS_WEBHOOK_SECRET` = webhook endpoint secret from the dashboard
- `SUPABASE_URL` = `https://tcrrgsylxbyyrmnouihl.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = your service-role key (already set for other functions)
- `SITE_URL` = `https://ra10.co.uk` (used for the redirect URL)

## 4) Deploy the functions

```powershell
cd c:\Users\mistr\OneDrive\Documents\GitHub\ra10
npx supabase@latest functions deploy gocardless-checkout --no-verify-jwt
npx supabase@latest functions deploy gocardless-webhook --no-verify-jwt
npx supabase@latest functions deploy gocardless-billing-status --no-verify-jwt
npx supabase@latest functions deploy gocardless-cancel --no-verify-jwt
```

> The "Docker" warning is noise — "Deployed Functions." means success.

## 5) Point the GoCardless webhook at the function

In the GoCardless dashboard, set the webhook endpoint URL to:

```
https://tcrrgsylxbyyrmnouihl.supabase.co/functions/v1/gocardless-webhook
```

## 6) Frontend (already wired)

- `ra10-sdk.js` → `startCheckout()` posts to `gocardless-checkout`; `startBillingPortal()` posts to `gocardless-cancel`.
- `index.html` → billing status polls `gocardless-billing-status`; "Manage billing" button triggers cancellation.

## Plans / pricing (mirrors Stripe)

| Plan | Amount | Interval | Entitlement |
|------|--------|----------|-------------|
| IT / Business / Sport | £5 | one-time | subject unlock + 300 credits |
| Credits | 1p/credit | one-time | +credits |
| Pro | £20 / £2 | yearly / monthly | `all_subjects`, 1000 credits |
| Ultra | £30 / £3 | yearly / monthly | `ultra`, unlimited |
| EDU | £100 | yearly | `school_admin`, 300 credits |

## Going live

1. Complete GoCardless verification (creditor + bank account in `https://manage.gocardless.com/`).
2. Set `GOCARDLESS_ENVIRONMENT=live` and replace `GOCARDLESS_ACCESS_TOKEN` with the live token.
3. Update the live webhook endpoint URL + secret.
4. Re-deploy `gocardless-checkout` and `gocardless-webhook`.

> ⚠️ **Important (Direct Debit compliance):** GoCardless requires advance notice before taking payments (typically ~3 working days for the first payment / new mandate). Test with the sandbox, then allow for settlement time in production messaging.