# PL-16 — Pricing, tiers, credits, billing or legal-terms change

**High risk: this pipeline touches money and contracts.** Owner approval is needed at every step. **Fix R-04 (server-side credits) before turning payments back on.**

## Where each rule lives

| Rule | Location |
|---|---|
| Tier labels, prices, monthly credits (display) | `ra10-sdk.js` → `TIER_INFO` |
| Credit costs per action | `ra10-sdk.js` → `ACTION_COSTS` |
| Free-for-all switch | `ra10-sdk.js` → `TRANSITION_MODE`; `PAYMENTS_ENABLED` secret (checkout) |
| Stripe products and prices | Stripe dashboard; secrets `STRIPE_PRICE_*`; `STRIPE_SETUP.md` |
| What a payment grants | `stripe-webhook/index.ts` (source of truth), `confirm-checkout/index.ts` |
| School entitlements | `apply_school_entitlement()` (SQL) |
| Monthly resets | `reset_monthly_credits()` (SQL) |
| Study Hub Premium | `study_hub_premium()` (SQL), and **only** there |
| Upgrade page copy | `index.html` `#p-upgrade` |
| Legal terms | `legal/*.html`, plus `legal_documents` (SQL `legal-terms-acceptance.sql`); server check in `_shared/legal.ts` |

## Steps: price or tier change

1. Create or modify the Stripe product and price in **test mode** (`tools/setup-stripe-test.ps1`).
2. Update the `STRIPE_PRICE_*` secrets in a test project, or temporarily in production with owner approval.
3. Update `TIER_INFO`, `ACTION_COSTS`, the webhook grant logic and the upgrade-page copy **together**.
4. Test the full flow with Stripe test cards:
   - checkout;
   - the webhook (check `profiles.tier` and `credits`);
   - the billing portal;
   - cancellation;
   - the monthly reset.
5. Switch to live prices, deploy the functions, then deploy the site.

## Steps: legal terms change

1. Edit `legal/terms.html` / `privacy.html` and give them a new version.
2. Insert the new version into `legal_documents` (SQL). Users are then asked to accept again (`requireTerms`), and AI features return 403 until they do.
3. Post News. A material change may need advance notice, so check with legal counsel.

## Verify

- [ ] A test purchase grants exactly the advertised tier and credits.
- [ ] Credits cannot be raised from the client (try `profiles.update({credits: 9999})` with a test JWT; it must fail).
- [ ] The upgrade page, the SDK and the webhook agree on every number.
