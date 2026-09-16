import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─────────────────────────────────────────────────────────────────────────────
// RA10 — GoCardless checkout (replacement for create-checkout)
//
// Creates a GoCardless "billing request + hosted flow" so the payer sets up a
// Direct Debit mandate (BACS) online.
//   • Subscriptions (PRO / ULTRA / EDU): mandate-first. The subscription is
//     created later by gocardless-webhook once the mandate is activated
//     (`subscription_request` is only supported for ACH/PAD, not BACS).
//   • One-off payments (subject unlocks / credits): mandate + instant payment.
//
// GoCardless metadata is limited to 3 keys (≤50-char keys, ≤500-char values),
// so we store a single `order_ref` (the gocardless_orders.id) and let the
// webhook look up the full purchase intent from the orders table.
//
// Plans/prices:
//   IT / Business / Sport  — one-off £5 subject unlock (+300 credits)
//   PRO (year/month)        — £20/yr or £2/mo, tier all_subjects (1000 credits)
//   ULTRA (year/month)      — £30/yr or £3/mo, tier ultra (unlimited)
//   EDU                     — £100/yr, tier school_admin (300 credits)
//   CREDITS                 — 1p per credit
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = [
  "https://ra10.co.uk",
  "https://www.ra10.co.uk",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
];

const PAYMENTS_ENABLED = (Deno.env.get("PAYMENTS_ENABLED") || "true").toLowerCase() === "true";
const PAYMENTS_PAUSED_MESSAGE = "Payments are temporarily unavailable. Please try again soon.";

const GC_BASE_URL =
  (Deno.env.get("GOCARDLESS_ENVIRONMENT") || "").toLowerCase() === "sandbox"
    ? "https://api-sandbox.gocardless.com"
    : "https://api.gocardless.com";

type PlanDef = {
  kind: "payment" | "subscription";
  plan: string;
  subject: string;
  amountPence: number;
  credits: number;
  intervalUnit: "monthly" | "yearly" | "";
  description: string;
};

function getCorsHeaders(origin: string) {
  const isAllowed = ALLOWED_ORIGINS.includes(origin);
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };
}

function resolvePlan(planRaw: string, subjectRaw: string, creditsRaw: number, interval: string): PlanDef | null {
  const plan = String(planRaw || "").toUpperCase();
  const subject = String(subjectRaw || "").toUpperCase();
  const credits = Number(creditsRaw || 0);
  const monthly = String(interval || "").toLowerCase() === "month";

  if (plan === "CREDITS" && credits > 0) {
    return {
      kind: "payment",
      plan: "CREDITS",
      subject: "",
      amountPence: credits, // 1p per credit
      credits,
      intervalUnit: "",
      description: `${credits} RA10 credits`,
    };
  }
  if (subject === "IT") {
    return { kind: "payment", plan: "IT", subject: "IT", amountPence: 500, credits: 0, intervalUnit: "", description: "RA10 — IT subject unlock" };
  }
  if (subject === "BUSINESS") {
    return { kind: "payment", plan: "BUSINESS", subject: "Business", amountPence: 500, credits: 0, intervalUnit: "", description: "RA10 — Business subject unlock" };
  }
  if (subject === "SPORT") {
    return { kind: "payment", plan: "SPORT", subject: "Sport", amountPence: 500, credits: 0, intervalUnit: "", description: "RA10 — Sport subject unlock" };
  }
  if (plan === "PRO") {
    return monthly
      ? { kind: "subscription", plan: "PRO", subject: "", amountPence: 200, credits: 1000, intervalUnit: "monthly", description: "RA10 Pro (monthly)" }
      : { kind: "subscription", plan: "PRO", subject: "", amountPence: 2000, credits: 1000, intervalUnit: "yearly", description: "RA10 Pro (yearly)" };
  }
  if (plan === "ULTRA") {
    return monthly
      ? { kind: "subscription", plan: "ULTRA", subject: "", amountPence: 300, credits: -1, intervalUnit: "monthly", description: "RA10 Ultra (monthly)" }
      : { kind: "subscription", plan: "ULTRA", subject: "", amountPence: 3000, credits: -1, intervalUnit: "yearly", description: "RA10 Ultra (yearly)" };
  }
  if (plan === "EDU") {
    return { kind: "subscription", plan: "EDU", subject: "", amountPence: 10000, credits: 300, intervalUnit: "yearly", description: "RA10 School Admin (yearly)" };
  }
  return null;
}

async function gcPost(path: string, token: string, body: Record<string, unknown>) {
  const res = await fetch(`${GC_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "GoCardless-Version": "2015-07-06",
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(body),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const gcerror = payload?.error || {};
    const message = gcerror.message || payload?.message || `GoCardless request failed (${res.status})`;
    throw new Error(message);
  }
  return payload;
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
    if (!PAYMENTS_ENABLED) {
      return new Response(JSON.stringify({ error: PAYMENTS_PAUSED_MESSAGE }), { status: 503, headers: corsHeaders });
    }

    const authHeader = req.headers.get("authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing bearer token" }), { status: 401, headers: corsHeaders });
    }
    const jwt = authHeader.slice(7);

    const body = await req.json().catch(() => ({}));
    const plan = String(body?.plan || "");
    const subject = String(body?.subject || "");
    const credits = Number(body?.credits || 0);
    const billingInterval = String(body?.billingInterval || "");

    const target = resolvePlan(plan, subject, credits, billingInterval);
    if (!target) {
      return new Response(JSON.stringify({ error: "Payment plan is not configured for this selection." }), { status: 400, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const gcToken = Deno.env.get("GOCARDLESS_ACCESS_TOKEN") || "";
    if (!supabaseUrl || !serviceRole || !gcToken) {
      return new Response(JSON.stringify({ error: "Server not configured (missing GoCardless credentials)" }), { status: 500, headers: corsHeaders });
    }

    const supabase = createClient(supabaseUrl, serviceRole);
    const { data: userData, error: userError } = await supabase.auth.getUser(jwt);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const user = userData.user;
    const userId = String(user.id || "");
    const email = String(user.email || "").trim().toLowerCase();
    const displayName = String(
      user.user_metadata?.display_name || user.user_metadata?.full_name || email.split("@")[0] || "Student",
    );
    const givenName = displayName.split(/\s+/)[0] || "Student";
    const familyName = displayName.split(/\s+/).slice(1).join(" ") || "Student";

    const siteUrl = Deno.env.get("SITE_URL") || "https://ra10.co.uk";
    const successUrl = `${siteUrl}/#/upgrade?checkout=success`;
    const exitUrl = `${siteUrl}/#/upgrade?checkout=cancel`;

    // 1) Record the order intent up-front so the webhook can fulfil it.
    const { data: orderData, error: orderError } = await supabase
      .from("gocardless_orders")
      .insert({
        user_id: userId || null,
        email,
        kind: target.kind,
        plan: target.plan,
        subject: target.subject,
        credits: target.credits > 0 ? target.credits : 0,
        amount_pence: target.amountPence,
        interval_unit: target.intervalUnit,
        status: "pending",
      })
      .select("id")
      .single();
    if (orderError || !orderData?.id) {
      throw new Error(orderError?.message || "Could not record order");
    }
    const orderRef = String(orderData.id);

    // 2) Create the billing request. Metadata is limited to 3 keys, so a single
    //    `order_ref` points the webhook back at the full order row.
    const billingRequestBody: Record<string, unknown> = {
      billing_requests: {
        mandate_request: {
          scheme: "bacs",
          verify: "minimum",
          metadata: { order_ref: orderRef },
        },
      },
    };

    if (target.kind === "payment") {
      (billingRequestBody.billing_requests as Record<string, unknown>).payment_request = {
        description: target.description,
        amount: target.amountPence, // number, minor unit (pence)
        currency: "GBP",
        metadata: { order_ref: orderRef },
      };
    }

    const brPayload = await gcPost("/billing_requests", gcToken, billingRequestBody);
    const brequest = brPayload?.billing_requests || {};
    const billingRequestId = String(brequest.id || "");
    if (!billingRequestId) {
      throw new Error("GoCardless did not return a billing request id");
    }

    // Persist the billing request id so billing-status / cancel can find it.
    const { error: linkErr } = await supabase
      .from("gocardless_orders")
      .update({ gocardless_ref: billingRequestId })
      .eq("id", orderRef);
    if (linkErr) {
      throw new Error(linkErr.message || "Could not link order to billing request");
    }

    // 3) Create the hosted flow and return its authorisation URL.
    const flowPayload = await gcPost("/billing_request_flows", gcToken, {
      billing_request_flows: {
        redirect_uri: successUrl,
        exit_uri: exitUrl,
        prefilled_customer: {
          given_name: givenName,
          family_name: familyName,
          email,
        },
        links: { billing_request: billingRequestId },
      },
    });
    const flow = flowPayload?.billing_request_flows || {};
    const authorisationUrl = String(flow.authorisation_url || "");

    if (!authorisationUrl) {
      throw new Error("GoCardless did not return a payment authorisation URL");
    }

    return new Response(JSON.stringify({ url: authorisationUrl, id: billingRequestId, orderRef }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("gocardless-checkout error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: getCorsHeaders(req.headers.get("origin") || "") },
    );
  }
});