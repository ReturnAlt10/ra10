# PL-10 — New or changed edge function

**Skill:** `.claude/skills/ra10-edge-function`.

## Template checklist

Every function must do the following:

1. **Handle `OPTIONS`** with CORS headers. **Do not fall back to `*`** for unknown origins (risk R-06): echo the origin only if it is in the allow-list (`https://ra10.co.uk`, `https://www.ra10.co.uk`, `http://127.0.0.1:5500`).
2. **Authenticate:** `const { data: { user } } = await supabase.auth.getUser(jwt)`. Return 401 if there is no user.
3. **Authorise from the server side only:**
   - for the owner, use the JWT email (never `profiles.email`);
   - for roles, use an RPC or the database.
4. **Check legal terms** for any AI or learner-content feature: `requireTermsAccepted(supabase, userId, cors)` from `_shared/legal.ts`.
5. **Validate input.** Check type and length limits; cap images at about 2 MB. Reject unknown `action` values.
6. **Charge and rate-limit** paid or AI actions on the server (after M-4: `spend_credits(action)` and a rate-limit RPC). Do this **before** calling the LLM.
7. **Call AI through `_shared/ai.ts`** (`askJson`, with `preferStrong:true` where accuracy matters). Never hard-code a provider.
8. **Return JSON** `{ok, …}` or `{error}` with the correct status code. Never leak stack traces or provider errors.
9. **Log** one structured line per request: function, action, user id hash, latency, provider, outcome.

## Steps

1. Create `supabase/functions/<name>/index.ts`. Copy the closest function:
   - `study-hub` (multi-action, AI);
   - `site-announcement` (owner-only);
   - `upload-profile-image` (storage).
2. Add any new secrets with `npx supabase secrets set NAME=value` (owner), and document them in [04-backend-api.md](../docs/04-backend-api.md).
3. Run `deno check supabase/functions/<name>/index.ts`.
4. Run it locally with `npx supabase functions serve <name> --env-file .env.local` (never commit `.env.local`). Test it with `curl`, sending a real test-user JWT.
5. Add the client call to `ra10-sdk.js` (or the feature's JS), going through the SDK's session handling.
6. The owner deploys: `npx supabase functions deploy <name>`.
7. Watch the logs for 24 hours: `npx supabase functions logs <name>`.

## Verify

- [ ] 401 without a JWT; 403 for the wrong role; 400 for bad input; the expected 200 for a valid call.
- [ ] Unknown origins get no CORS allow header.
- [ ] Paid actions cannot be called without credits (once M-4 is in place).
- [ ] [04-backend-api.md](../docs/04-backend-api.md) and the relevant `specs/*/plan.md` are updated.
