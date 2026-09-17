# Stripe Setup (new account — test mode first)

This is a clean-room guide for pointing `ra10.co.uk` at a **brand-new Stripe account**. The edge functions are already written in the repo — this covers the config, deployment, and verification from zero.

## Order of work

1. Create the Stripe account + products/prices (you)
2. Authenticate the Supabase CLI (you, once)
3. Deploy the 5 functions + set secrets (script / CLI)
4. Create the Stripe webhook endpoint + set sign + secret (you)
5. Test end-to-end

---

## 1) Create the new Stripe account (Test mode)

1. Sign up at https://stripe.com — use the **new** account (not the broken one).
2. Top-right toggle → **Test mode** must be **ON**.

## 2) Create products & prices

Go to **Product catalog → Add product**. For recurring, put both monthly + yearly prices on the same product. Copy each `price_...` ID.

| Env var | What | Mode |
|---|---|---|
| `STRIPE_PRICE_IT` | IT subject unlock, £5 | one-time |
| `STRIPE_PRICE_BUSINESS` | Business subject unlock, £5 | one-time |
| `STRIPE_PRICE_SPORT` | Sport subject unlock, £5 | one-time |
| `STRIPE_PRICE_PRO` | Pro, £20 | recurring **yearly** |
| `STRIPE_PRICE_PRO_MONTHLY` | Pro, £2 | recurring **monthly** |
| `STRIPE_PRICE_ULTRA` | Ultra, £30 | recurring **yearly** |
| `STRIPE_PRICE_ULTRA_MONTHLY` | Ultra, £3 | recurring **monthly** |
| `STRIPE_PRICE_EDU` | EDU Admin, £100 | recurring **yearly** |
| `STRIPE_PRICE_CREDITS` | 1 credit, £0.01 | one-time (quantity = credits) |

> The credits price is £0.01 and uses Stripe *quantity*. The frontend sends `credits: N` and the function sets `line_items[0][quantity]=N`, so 200 credits = £2.00.

## 3) (Optional) RA10 10% promo code

**Product catalog → Promotions → Coupons**: percentage 10%, duration Forever. Then create a **promotion code** with code `RA10`. The checkout already sends `allow_promotion_codes=true`.

## 4) Authenticate the Supabase CLI (once)

The CLI isn't installed globally, so use `npx`:

```powershell
cd c:\Users\mistr\OneDrive\Documents\GitHub\ra10
npx supabase@latest login
```

This opens a browser to copy an access token (stays on your machine, not in the repo).

> Need a personal access token instead? Supabase dashboard → Settings → Access Tokens → generate, then:
> `$env:SUPABASE_ACCESS_TOKEN = "sbp_..."` (paste it yourself; never commit it).

## 5) Deploy + set secrets

All 5 functions and secrets in one step — run the helper:

```powershell
cd c:\Users\mistr\OneDrive\Documents\GitHub\ra10
.\tools\setup-stripe-test.ps1
```

It prompts for the project ref, the test secret key, and **all 9 price IDs**, sets the secrets, and deploys:

- `create-checkout`
- `confirm-checkout`
- `create-billing-portal`
- `billing-status`
- `stripe-webhook`

Or do it manually:

```powershell
cd c:\Users\mistr\OneDrive\Documents\GitHub\ra10

npx supabase@latest secrets set --project-ref <PROJECT_REF> `
  STRIPE_SECRET_KEY=sk_test_replace_me `
  STRIPE_PRICE_IT=price_... STRIPE_PRICE_BUSINESS=price_... STRIPE_PRICE_SPORT=price_... `
  STRIPE_PRICE_PRO=price_... STRIPE_PRICE_PRO_MONTHLY=price_... `
  STRIPE_PRICE_ULTRA=price_... STRIPE_PRICE_ULTRA_MONTHLY=price_... `
  STRIPE_PRICE_EDU=price_... STRIPE_PRICE_CREDITS=price_... `
  PAYMENTS_ENABLED=true SITE_URL=https://ra10.co.uk

npx supabase@latest functions deploy create-checkout --project-ref <PROJECT_REF> --no-verify-jwt
npx supabase@latest functions deploy confirm-checkout --project-ref <PROJECT_REF> --no-verify-jwt
npx supabase@latest functions deploy create-billing-portal --project-ref <PROJECT_REF> --no-verify-jwt
npx supabase@latest functions deploy billing-status --project-ref <PROJECT_REF> --no-verify-jwt
npx supabase@latest functions deploy stripe-webhook --project-ref <PROJECT_REF> --no-verify-jwt
```

> `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-provided by Supabase at runtime for linked projects — no need to set them.

## 6) Create the Stripe webhook endpoint

Stripe dashboard (Test mode) → **Developers → Webhooks → Add endpoint**:

- **URL:** `https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`
  - For this project: `https://tcrrgsylxbyyrmnouihl.supabase.co/functions/v1/stripe-webhook`
- **Events to send:**
  - `checkout.session.completed`
  - `invoice.paid`
  - `invoice.payment_failed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

After creating it, reveal the **signing secret** (`whsec_...`) and set it:

```powershell
npx supabase@latest secrets set --project-ref <PROJECT_REF> STRIPE_WEBHOOK_SECRET=whsec_replace_me
```

## 7) Test end-to-end

Test cards (any future expiry / CVC / postcode):

- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- 3DS challenge: `4000 0025 0000 3155`

Then in the app:

1. Open `#/upgrade`
2. Buy Pro / Ultra (a subscription) and confirm: tier upgrades, credits granted, no ads.
3. Buy a one-time subject (IT/Business/Sport) and confirm: +300 credits, subject unlocked.
4. Buy a credits top-up and confirm: credits increase by the chosen amount.
5. Confirm the webhook applied changes (check the Supabase Function logs for `stripe-webhook`).

## 8) Go live

- Switch the Stripe account out of test mode.
- Replace all keys + price IDs with **live** values (re-run the setup with live IDs).
- Create a **live** webhook endpoint + replace `STRIPE_WEBHOOK_SECRET`.

> Keep test mode until every flow above passes.