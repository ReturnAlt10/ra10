---
name: ra10-edge-function
description: Create or modify an RA10 Supabase Edge Function (Deno/TypeScript) with the house security checklist — strict CORS, JWT auth, server-side authorisation, legal-terms gate, input validation, server-side credits/rate limits, AI via _shared/ai.ts — then type-check, serve locally and document. Use for any backend endpoint work.
---

# RA10 edge function

- Pipeline: `enterprise/playbook/PL-10-edge-function.md`.
- Catalogue and secrets: `enterprise/docs/04-backend-api.md`.

## Skeleton

```ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";   // house style (Deno.serve also works)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { askJson } from "../_shared/ai.ts";
import { requireTermsAccepted } from "../_shared/legal.ts";

const ALLOWED_ORIGINS = ["https://ra10.co.uk", "https://www.ra10.co.uk", "http://127.0.0.1:5500", "http://localhost:5500"];
const cors = (origin: string) => ({
  ...(ALLOWED_ORIGINS.includes(origin) ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" } : {}),   // no "*" fallback
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
});

serve(async (req) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const jwt = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const { data: { user } } = await supabase.auth.getUser(jwt);
  if (!user) return new Response(JSON.stringify({ error: "Sign in required" }), { status: 401, headers: h });
  const denied = await requireTermsAccepted(supabase, user.id, h); if (denied) return denied;
  const body = await req.json().catch(() => ({}));
  // validate body.action and every field (types, lengths); reject unknown actions with 400
  // authorise: owner = user.email (JWT) — never profiles.email; roles from DB/RPC
  // charge + rate-limit BEFORE any LLM call (server-side; see risk R-04/R-05)
  // const { json } = await askJson(SYSTEM, prompt, 25000, { preferStrong: true });
  return new Response(JSON.stringify({ ok: true }), { headers: h });
});
```

The imports match `supabase/functions/study-hub/index.ts` and `supabase/functions/site-announcement/index.ts`.

## Steps

1. Run `deno check supabase/functions/<name>/index.ts`.
2. Run `npx supabase functions serve <name> --env-file .env.local` (never commit that file) and `curl` it with a test-user JWT. Check:
   - 401 with no token;
   - 403 for the wrong role;
   - 400 for bad input;
   - 200 for a valid call.
3. Add the client call to `ra10-sdk.js`, or the feature's JS.
4. Document the function and any new secrets in `enterprise/docs/04-backend-api.md`.
5. Ask the owner to deploy: `npx supabase functions deploy <name>`. If you changed `_shared/*`, redeploy every function that imports it.
