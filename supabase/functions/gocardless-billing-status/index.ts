import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─────────────────────────────────────────────────────────────────────────────
// RA10 — GoCardless billing status (replacement for billing-status)
//
// Returns the same `{ billing: {...} }` shape the frontend already consumes,
// but sourced from GoCardless subscriptions/mandates instead of Stripe.
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

function isoFromGcDate(raw: unknown): string | null {
  const v = String(raw || "").trim();
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
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

    // 1) Find the user's latest fulfilled subscription order (their active plan).
    const orderQuery = supabase
      .from("gocardless_orders")
      .select("gocardless_ref, plan, interval_unit")
      .eq("kind", "subscription")
      .eq("status", "fulfilled")
      .order("fulfilled_at", { ascending: false })
      .limit(1);

    const byUser = userId
      ? await orderQuery.eq("user_id", userId).maybeSingle()
      : { data: null, error: null };
    let order = byUser.data || null;
    if (!order && email) {
      const byEmail = await supabase
        .from("gocardless_orders")
        .select("gocardless_ref, plan, interval_unit")
        .eq("kind", "subscription")
        .eq("status", "fulfilled")
        .eq("email", email)
        .order("fulfilled_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      order = byEmail.data || null;
    }

    if (!order) {
      return new Response(JSON.stringify({ billing: null }), { status: 200, headers: corsHeaders });
    }

    // 2) Find the matching GoCardless subscription from the billing request.
    //    (gocardless_ref stores the billing request id.)
    const brPayload = await gcGet(`/billing_requests/${encodeURIComponent(String(order.gocardless_ref))}`, gcToken);
    const billingRequest = brPayload?.billing_requests || {};
    const mandateId = String(billingRequest?.links?.mandate || "");
    let subscriptionId = String(billingRequest?.links?.subscription || "");

    let subscription: any = null;
    if (!subscriptionId && mandateId) {
      // We created the subscription from the mandate; list subscriptions for it.
      const subscriptionsRes = await gcGet(
        `/subscriptions?mandate=${encodeURIComponent(mandateId)}&limit=1`,
        gcToken,
      );
      const subs = Array.isArray(subscriptionsRes?.subscriptions) ? subscriptionsRes.subscriptions : [];
      subscription = subs[0] || null;
      if (subscription) subscriptionId = String(subscription.id || "");
    }
    if (!subscription && subscriptionId) {
      const subPayload = await gcGet(`/subscriptions/${encodeURIComponent(subscriptionId)}`, gcToken);
      subscription = subPayload?.subscriptions || null;
    }

    if (!subscription) {
      // No live subscription — return a cancelled-shaped billing object.
      return new Response(
        JSON.stringify({
          billing: {
            subscription_id: subscriptionId || "",
            status: "cancelled",
            cancel_at_period_end: false,
            current_period_end: null,
            next_billing_at: null,
            billing_interval: String(order.interval_unit || "yearly").replace("ly", ""),
            billing_interval_count: 1,
          },
        }),
        { status: 200, headers: corsHeaders },
      );
    }

    const gcStatus = String(subscription.status || "").toLowerCase();
    // Map GoCardless status → the shape index.html expects (Stripe-compatible).
    // Note: Stripe spells it "canceled" (single l); GoCardless uses "cancelled".
    const cancelledNow = gcStatus === "cancelled" || gcStatus === "finished" || gcStatus === "customer_approval_denied";
    const status = cancelledNow ? "canceled" : gcStatus === "active" ? "active" : gcStatus;

    const upcoming = Array.isArray(subscription.upcoming_payments) ? subscription.upcoming_payments : [];
    const nextPayment = upcoming[0] || null;
    const nextBillingAt = isoFromGcDate(nextPayment?.charge_date);

    const billing = {
      subscription_id: subscriptionId,
      status,
      cancel_at_period_end: false, // GoCardless mandates cancel immediately
      current_period_end: nextBillingAt,
      next_billing_at: cancelledNow ? null : nextBillingAt,
      billing_interval: String(subscription.interval_unit || order.interval_unit || "yearly").replace("ly", ""),
      billing_interval_count: Number(subscription.interval || 1),
    };

    return new Response(JSON.stringify({ billing }), { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("gocardless-billing-status error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: getCorsHeaders(req.headers.get("origin") || "") },
    );
  }
});