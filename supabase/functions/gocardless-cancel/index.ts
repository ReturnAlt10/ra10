import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─────────────────────────────────────────────────────────────────────────────
// RA10 — GoCardless cancel subscription (replacement for create-billing-portal)
//
// GoCardless has no Stripe-style self-serve billing portal, so "Manage billing"
// becomes: cancel your current Direct Debit mandate/subscription. The webhook
// then downgrades the profile to free.
// ─────────────────────────────────────────────────────────────────────────────

const GC_BASE_URL =
  (Deno.env.get("GOCARDLESS_ENVIRONMENT") || "").toLowerCase() === "sandbox"
    ? "https://api-sandbox.gocardless.com"
    : "https://api.gocardless.com";

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

function gcHeaders(token: string) {
  return {
    "Authorization": `Bearer ${token}`,
    "GoCardless-Version": "2015-07-06",
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
}

async function gcGet(path: string, token: string): Promise<any | null> {
  const res = await fetch(`${GC_BASE_URL}${path}`, { method: "GET", headers: gcHeaders(token) });
  if (!res.ok) return null;
  return await res.json().catch(() => null);
}

async function gcPost(path: string, token: string): Promise<any | null> {
  const res = await fetch(`${GC_BASE_URL}${path}`, {
    method: "POST",
    headers: gcHeaders(token),
    body: JSON.stringify({}),
  });
  if (!res.ok) return null;
  return await res.json().catch(() => null);
}

export default Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
    }

    const authHeader = req.headers.get("authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing bearer token" }), { status: 401, headers: corsHeaders });
    }
    const jwt = authHeader.slice(7);

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const gcToken = Deno.env.get("GOCARDLESS_ACCESS_TOKEN") || "";
    if (!supabaseUrl || !serviceRole || !gcToken) {
      return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500, headers: corsHeaders });
    }

    const supabase = createClient(supabaseUrl, serviceRole);
    const { data: userData, error: userError } = await supabase.auth.getUser(jwt);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid auth token" }), { status: 401, headers: corsHeaders });
    }
    const user = userData.user;
    const userId = String(user.id || "");
    const email = String(user.email || "").trim().toLowerCase();

    // Find the latest fulfilled subscription order.
    const orderQuery = supabase
      .from("gocardless_orders")
      .select("gocardless_ref")
      .eq("kind", "subscription")
      .eq("status", "fulfilled")
      .order("fulfilled_at", { ascending: false })
      .limit(1);

    const byUser = userId ? await orderQuery.eq("user_id", userId).maybeSingle() : { data: null, error: null };
    let order = byUser.data || null;
    if (!order && email) {
      const byEmail = await supabase
        .from("gocardless_orders")
        .select("gocardless_ref")
        .eq("kind", "subscription")
        .eq("status", "fulfilled")
        .eq("email", email)
        .order("fulfilled_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      order = byEmail.data || null;
    }

    if (!order) {
      return new Response(JSON.stringify({ error: "No active subscription found." }), { status: 404, headers: corsHeaders });
    }

    const brPayload = await gcGet(`/billing_requests/${encodeURIComponent(String(order.gocardless_ref))}`, gcToken);
    const billingRequest = brPayload?.billing_requests || {};
    const mandateId = String(billingRequest?.links?.mandate || "");

    if (!mandateId) {
      return new Response(JSON.stringify({ error: "No mandate found for this subscription." }), { status: 404, headers: corsHeaders });
    }

    const cancelRes = await gcPost(`/mandates/${encodeURIComponent(mandateId)}/actions/cancel`, gcToken);
    if (!cancelRes) {
      return new Response(JSON.stringify({ error: "Could not cancel the mandate." }), { status: 500, headers: corsHeaders });
    }

    return new Response(
      JSON.stringify({ ok: true, message: "Your subscription has been cancelled." }),
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("gocardless-cancel error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: getCorsHeaders(req.headers.get("origin") || "") },
    );
  }
});