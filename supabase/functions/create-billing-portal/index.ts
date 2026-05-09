import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://ra10.co.uk",
  "https://www.ra10.co.uk",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
];

function getCorsHeaders(origin: string) {
  const isAllowed = ALLOWED_ORIGINS.includes(origin);
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };
}

function getBaseReturnUrl(inputUrl: string | undefined): string {
  const fallback = Deno.env.get("SITE_URL") || "https://ra10.co.uk";
  const candidate = String(inputUrl || "").trim();
  if (!candidate) return fallback;
  try {
    const parsed = new URL(candidate);
    const origin = parsed.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
      return origin;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

async function stripeGet(path: string, secret: string) {
  const res = await fetch(`https://api.stripe.com${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload?.error?.message || "Stripe request failed");
  }
  return payload;
}

async function stripePost(path: string, secret: string, body: URLSearchParams) {
  const res = await fetch(`https://api.stripe.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload?.error?.message || "Stripe request failed");
  }
  return payload;
}

export default Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
    }

    const authHeader = req.headers.get("authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing or invalid Authorization header" }), { status: 401, headers: corsHeaders });
    }

    const jwt = authHeader.slice(7);
    const body = await req.json().catch(() => ({}));
    const returnUrl = getBaseReturnUrl(String(body?.returnUrl || ""));
    const finalReturnUrl = returnUrl.replace(/\/$/, "") + "/#/account";

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || "";

    if (!supabaseUrl || !supabaseServiceRoleKey || !stripeSecretKey) {
      return new Response(JSON.stringify({ error: "Missing server configuration" }), { status: 500, headers: corsHeaders });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const { data: userData, error: userError } = await supabase.auth.getUser(jwt);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const user = userData.user;
    const userId = String(user.id || "");
    const email = String(user.email || "").trim().toLowerCase();
    if (!userId && !email) {
      return new Response(JSON.stringify({ error: "User identity unavailable" }), { status: 400, headers: corsHeaders });
    }

    let customerId = "";

    if (userId) {
      const escapedUserId = userId.replace(/'/g, "\\'");
      try {
        const subsByUserId = await stripeGet(
          `/v1/subscriptions/search?query=${encodeURIComponent(`metadata['user_id']:'${escapedUserId}'`)}&limit=1`,
          stripeSecretKey,
        );
        const sub = Array.isArray(subsByUserId?.data) ? subsByUserId.data[0] : null;
        if (sub?.customer) customerId = String(sub.customer);
      } catch {
        customerId = "";
      }
    }

    if (!customerId && email) {
      const escapedEmail = email.replace(/'/g, "\\'");
      try {
        const subsByEmail = await stripeGet(
          `/v1/subscriptions/search?query=${encodeURIComponent(`metadata['email']:'${escapedEmail}'`)}&limit=1`,
          stripeSecretKey,
        );
        const sub = Array.isArray(subsByEmail?.data) ? subsByEmail.data[0] : null;
        if (sub?.customer) customerId = String(sub.customer);
      } catch {
        customerId = "";
      }
    }

    if (!customerId && email) {
      const customers = await stripeGet(
        `/v1/customers/search?query=${encodeURIComponent(`email:'${email.replace(/'/g, "\\'")}'`)}&limit=1`,
        stripeSecretKey,
      );
      const customer = Array.isArray(customers?.data) ? customers.data[0] : null;
      if (customer?.id) customerId = String(customer.id);
    }

    if (!customerId) {
      return new Response(JSON.stringify({ error: "No Stripe customer found for this account yet." }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    const params = new URLSearchParams();
    params.set("customer", customerId);
    params.set("return_url", finalReturnUrl);

    const portal = await stripePost("/v1/billing_portal/sessions", stripeSecretKey, params);
    const url = String(portal?.url || "");
    if (!url) {
      return new Response(JSON.stringify({ error: "Stripe billing portal URL not returned" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ url }), { status: 200, headers: corsHeaders });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
});
