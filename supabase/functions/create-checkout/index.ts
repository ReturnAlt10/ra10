import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS allowed origins
const ALLOWED_ORIGINS = [
  "https://ra10.co.uk",
  "https://www.ra10.co.uk",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
];

const PAYMENTS_ENABLED = (Deno.env.get("PAYMENTS_ENABLED") || "true").toLowerCase() === "true";
const PAYMENTS_PAUSED_MESSAGE = "Payments are temporarily unavailable. Please try again soon.";

type CheckoutTarget = {
  mode: "payment" | "subscription";
  priceId: string;
  plan: string;
  subject: string;
};

function envPriceMap() {
  return {
    IT: Deno.env.get("STRIPE_PRICE_IT") || "",
    BUSINESS: Deno.env.get("STRIPE_PRICE_BUSINESS") || "",
    SPORT: Deno.env.get("STRIPE_PRICE_SPORT") || "",
    PRO: Deno.env.get("STRIPE_PRICE_PRO") || "",
    ULTRA: Deno.env.get("STRIPE_PRICE_ULTRA") || "",
    EDU: Deno.env.get("STRIPE_PRICE_EDU") || "",
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

function resolveTarget(planRaw: string, subjectRaw: string): CheckoutTarget | null {
  const prices = envPriceMap();
  const plan = String(planRaw || "").trim().toUpperCase();
  const subject = String(subjectRaw || "").trim().toUpperCase();

  if (subject === "IT" && prices.IT) {
    return { mode: "payment", priceId: prices.IT, plan: "IT", subject: "IT" };
  }
  if (subject === "BUSINESS" && prices.BUSINESS) {
    return { mode: "payment", priceId: prices.BUSINESS, plan: "BUSINESS", subject: "BUSINESS" };
  }
  if (subject === "SPORT" && prices.SPORT) {
    return { mode: "payment", priceId: prices.SPORT, plan: "SPORT", subject: "SPORT" };
  }
  if (plan === "PRO" && prices.PRO) {
    return { mode: "subscription", priceId: prices.PRO, plan: "PRO", subject: "" };
  }
  if (plan === "ULTRA" && prices.ULTRA) {
    return { mode: "subscription", priceId: prices.ULTRA, plan: "ULTRA", subject: "" };
  }
  if (plan === "EDU" && prices.EDU) {
    return { mode: "subscription", priceId: prices.EDU, plan: "EDU", subject: "" };
  }
  return null;
}

// Helper: Get CORS headers
function getCorsHeaders(origin: string) {
  const isAllowed = ALLOWED_ORIGINS.includes(origin);
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };
}

export default Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: corsHeaders,
        }
      );
    }

    if (!PAYMENTS_ENABLED) {
      return new Response(
        JSON.stringify({ error: PAYMENTS_PAUSED_MESSAGE }),
        {
          status: 503,
          headers: corsHeaders,
        }
      );
    }

    const body = await req.json();
    const plan = String(body?.plan || "").toUpperCase();
    const subject = String(body?.subject || "").toUpperCase();
    const returnUrl = String(body?.returnUrl || "");

    if (!plan && !subject) {
      return new Response(
        JSON.stringify({ error: "plan or subject is required" }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid Authorization header" }),
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    const jwt = authHeader.slice(7);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase configuration" }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { data: userData, error: userError } = await supabase.auth.getUser(
      jwt
    );

    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    const user = userData.user;
    const target = resolveTarget(plan, subject);
    if (!target) {
      return new Response(
        JSON.stringify({ error: "Stripe price is not configured for this plan/subject" }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    const baseReturnUrl = getBaseReturnUrl(returnUrl);
    const successUrl = baseReturnUrl.replace(/\/$/, "") + "/#/upgrade?checkout=success&session_id={CHECKOUT_SESSION_ID}";
    const cancelUrl = baseReturnUrl.replace(/\/$/, "") + "/#/upgrade?checkout=cancel";

    const params = new URLSearchParams();
    params.set("mode", target.mode);
    params.set("line_items[0][price]", target.priceId);
    params.set("line_items[0][quantity]", "1");
    params.set("success_url", successUrl);
    params.set("cancel_url", cancelUrl);
    params.set("customer_email", String(user.email || ""));
    params.set("client_reference_id", String(user.id || ""));
    params.set("allow_promotion_codes", "true");
    params.set("metadata[user_id]", String(user.id || ""));
    params.set("metadata[email]", String(user.email || ""));
    params.set("metadata[plan]", String(target.plan || ""));
    params.set("metadata[subject]", String(target.subject || ""));
    if (target.mode === "payment") {
      params.set("payment_intent_data[metadata][user_id]", String(user.id || ""));
      params.set("payment_intent_data[metadata][email]", String(user.email || ""));
      params.set("payment_intent_data[metadata][plan]", String(target.plan || ""));
      params.set("payment_intent_data[metadata][subject]", String(target.subject || ""));
    } else {
      params.set("subscription_data[metadata][user_id]", String(user.id || ""));
      params.set("subscription_data[metadata][email]", String(user.email || ""));
      params.set("subscription_data[metadata][plan]", String(target.plan || ""));
      params.set("subscription_data[metadata][subject]", String(target.subject || ""));
    }

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const stripePayload = await stripeResponse.json();
    if (!stripeResponse.ok) {
      const stripeErr = stripePayload?.error?.message || "Stripe checkout creation failed";
      return new Response(
        JSON.stringify({ error: stripeErr }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    return new Response(JSON.stringify({ url: stripePayload?.url || "", id: stripePayload?.id || "" }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Checkout function error:", error);

    const corsHeaders = getCorsHeaders(req.headers.get("origin") || "");
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
