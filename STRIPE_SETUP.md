# Stripe Setup (Test Mode)

This project now uses Stripe for checkout and webhooks.

## Quick Start (Do This First)

If you want the easiest path, run the interactive setup script:

```powershell
cd c:\Users\mistr\Downloads\ra10
.\tools\setup-stripe-test.ps1
```

What it does for you:

- Prompts for your Stripe test key and all price IDs
- Sets Supabase function secrets
- Deploys `create-checkout` and `stripe-webhook`
- Prints your webhook endpoint URL

## 1) Create products/prices in Stripe (Test mode)

Create these prices and copy the `price_...` IDs:

- IT one-time: `GBP 5`, one-time
- Business one-time: `GBP 5`, one-time
- Sport one-time: `GBP 5`, one-time
- Pro: `GBP 20`, recurring yearly
- Ultra: `GBP 30`, recurring yearly
- EDU Admin: `GBP 100`, recurring yearly

## 2) Set Supabase Edge Function secrets

Set these in Supabase (project secrets / function env):

- `STRIPE_SECRET_KEY` = your Stripe test secret key (`sk_test_...`)
- `STRIPE_WEBHOOK_SECRET` = webhook endpoint signing secret (`whsec_...`)
- `STRIPE_PRICE_IT` = `price_...`
- `STRIPE_PRICE_BUSINESS` = `price_...`
- `STRIPE_PRICE_SPORT` = `price_...`
- `STRIPE_PRICE_PRO` = `price_...`
- `STRIPE_PRICE_ULTRA` = `price_...`
- `STRIPE_PRICE_EDU` = `price_...`
- `PAYMENTS_ENABLED` = `true`
- `SITE_URL` = `https://ra10.co.uk`

Required existing secrets:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 3) Deploy functions

Deploy these edge functions:

- `create-checkout`
- `stripe-webhook`

## 4) Configure Stripe webhook endpoint

In Stripe dashboard (Test mode):

- Endpoint URL:
  - `https://<your-project-ref>.supabase.co/functions/v1/stripe-webhook`
- Events to send:
  - `checkout.session.completed`
  - `invoice.paid`
  - `invoice.payment_failed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

Then copy the endpoint signing secret into `STRIPE_WEBHOOK_SECRET`.

## 5) Test cards

Use Stripe test cards, for example:

- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- 3DS required: `4000 0025 0000 3155`

Use any future expiry, any CVC, and any postcode.

## 6) Verify in app

- Open `#/upgrade`
- Click `Buy Pro` or one-time subject purchase
- Complete Stripe checkout in test mode
- Confirm user profile updates:
  - Subject one-time adds 300 credits and unlocks that subject
  - Pro/Ultra/EDU updates tier + credits

## 7) Go live later

When moving to live mode:

- Replace all Stripe keys and price IDs with live versions
- Keep webhook endpoint but replace signing secret with live endpoint secret
- Confirm `PAYMENTS_ENABLED=true`
