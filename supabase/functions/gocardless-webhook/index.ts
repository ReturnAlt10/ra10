import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─────────────────────────────────────────────────────────────────────────────
// RA10 — GoCardless webhook (replacement for stripe-webhook)
//
// Verifies the `Webhook-Signature` header (HMAC-SHA256, hex, timing-safe) then
// grants/revokes entitlements from GoCardless events. Metadata on GoCardless
// resources is limited to 3 keys, so checkout stores a single `order_ref`
// (the gocardless_orders.id) and this handler looks the intent back up.
//
// Events handled:
//   mandates.activated        → (subscriptions) create the recurring subscription
//   subscriptions.created     → activate paid tier + credits
//   payments.confirmed        → (one-off) add credits / unlock subject
//   payment.paid_out          → same as confirmed (safe idempotent path)
//   mandates.cancelled/failed/expired
//        & subscriptions.cancelled/finished → downgrade profile to free
// ─────────────────────────────────────────────────────────────────────────────

const GC_BASE_URL =
  (Deno.env.get("GOCARDLESS_ENVIRONMENT") || "").toLowerCase() === "sandbox"
    ? "https://api-sandbox.gocardless.com"
    : "https://api.gocardless.com";

type SubjectName = "IT" | "Business" | "Sport";

const SUBJECTS_ALL: SubjectName[] = ["IT", "Business", "Sport"];

function toUpper(v: unknown): string {
  return String(v || "").trim().toUpperCase();
}

function oneMonthFromNowIso(): string {
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() + 1);
  return d.toISOString();
}

function oneYearFromNowIso(): string {
  const d = new Date();
  d.setUTCFullYear(d.getUTCFullYear() + 1);
  return d.toISOString();
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

async function gcPost(path: string, token: string, body: Record<string, unknown>): Promise<any | null> {
  const res = await fetch(`${GC_BASE_URL}${path}`, {
    method: "POST",
    headers: gcHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  return await res.json().catch(() => null);
}

async function hmacSha256Hex(secret: string, payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function findProfileId(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  email: string,
): Promise<string | null> {
  if (userId) {
    const byId = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
    if (!byId.error && byId.data?.id) return String(byId.data.id);
  }
  if (!email) return null;
  const byEmail = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
  return byEmail.error || !byEmail.data?.id ? null : String(byEmail.data.id);
}

async function findOrderByRef(supabase: ReturnType<typeof createClient>, orderRef: string): Promise<any | null> {
  if (!orderRef) return null;
  const res = await supabase.from("gocardless_orders").select("*").eq("id", orderRef).maybeSingle();
  if (res.error || !res.data) return null;
  return res.data;
}

async function unlockSubject(
  supabase: ReturnType<typeof createClient>,
  profileId: string,
  subject: SubjectName,
): Promise<void> {
  const profileRes = await supabase
    .from("profiles")
    .select("unlocked_subjects, credits, tier")
    .eq("id", profileId)
    .single();
  if (profileRes.error || !profileRes.data) return;
  const existing = Array.isArray(profileRes.data.unlocked_subjects) ? profileRes.data.unlocked_subjects : [];
  if (existing.includes(subject)) return;
  const nextSubjects = [...existing, subject];
  const nextCredits = Number(profileRes.data.credits || 0) + 300;
  const nextTier = profileRes.data.tier === "free" ? "subject" : profileRes.data.tier;
  await supabase
    .from("profiles")
    .update({ tier: nextTier, credits: nextCredits, unlocked_subjects: nextSubjects })
    .eq("id", profileId);
}

async function addCredits(supabase: ReturnType<typeof createClient>, profileId: string, credits: number): Promise<void> {
  if (credits <= 0) return;
  const profileRes = await supabase.from("profiles").select("credits").eq("id", profileId).single();
  if (profileRes.error || !profileRes.data) return;
  const next = Number(profileRes.data.credits || 0) + credits;
  await supabase.from("profiles").update({ credits: next }).eq("id", profileId);
}

function recurringForPlan(plan: string): { tier: string; credits: number; unlimited: boolean } | null {
  const p = toUpper(plan);
  if (p === "PRO") return { tier: "all_subjects", credits: 1000, unlimited: false };
  if (p === "ULTRA") return { tier: "ultra", credits: 999999, unlimited: true };
  if (p === "EDU") return { tier: "school_admin", credits: 300, unlimited: false };
  return null;
}

async function applyRecurring(
  supabase: ReturnType<typeof createClient>,
  profileId: string,
  recurring: { tier: string; credits: number; unlimited: boolean },
  intervalUnit: string,
): Promise<void> {
  const resetAt = intervalUnit === "yearly" ? oneYearFromNowIso() : oneMonthFromNowIso();
  await supabase
    .from("profiles")
    .update({
      tier: recurring.tier,
      credits: recurring.credits,
      credits_reset_at: resetAt,
      unlocked_subjects: SUBJECTS_ALL,
      unlimited_credits: recurring.unlimited,
    })
    .eq("id", profileId);
}

async function downgradeToFree(supabase: ReturnType<typeof createClient>, profileId: string): Promise<void> {
  await supabase
    .from("profiles")
    .update({
      tier: "free",
      credits: 10,
      credits_reset_at: oneMonthFromNowIso(),
      unlimited_credits: false,
      unlocked_subjects: [],
      school_id: null,
      school_name: null,
    })
    .eq("id", profileId);
}

async function markOrderFulfilled(supabase: ReturnType<typeof createClient>, orderRef: string): Promise<void> {
  if (!orderRef) return;
  await supabase
    .from("gocardless_orders")
    .update({ status: "fulfilled", fulfilled_at: new Date().toISOString() })
    .eq("id", orderRef);
}

function orderRefFromMetadata(meta: any, fallback: any): string {
  return String(meta?.order_ref || fallback?.order_ref || "").trim();
}

export default Deno.serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    const rawBody = await req.text();
    const signature = req.headers.get("webhook-signature") || req.headers.get("Webhook-Signature") || "";
    const webhookSecret = Deno.env.get("GOCARDLESS_WEBHOOK_SECRET") || "";

    if (!signature || !webhookSecret) {
      return new Response(JSON.stringify({ error: "Missing webhook secret or signature" }), { status: 400 });
    }

    const expected = await hmacSha256Hex(webhookSecret, rawBody);
    if (!constantTimeEqual(expected, String(signature).toLowerCase())) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 498 });
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const gcToken = Deno.env.get("GOCARDLESS_ACCESS_TOKEN") || "";
    if (!supabaseUrl || !serviceRole || !gcToken) {
      return new Response(JSON.stringify({ error: "Missing server configuration" }), { status: 500 });
    }
    const supabase = createClient(supabaseUrl, serviceRole);

    const events = Array.isArray(payload?.events) ? payload.events : [];

    for (const event of events) {
      const action = String(event?.action || "").toLowerCase();
      const resourceType = String(event?.resource_type || "").toLowerCase();
      const resourceMetadata = event?.resource_metadata || {};
      // Fallback: the event's own metadata (present when origin === 'api').
      const eventMetadata = event?.metadata || {};

      console.log(`gocardless webhook: ${resourceType}.${action}`);

      try {
        if (resourceType === "mandates" && action === "activated") {
          const orderRef = orderRefFromMetadata(resourceMetadata, eventMetadata);
          const order = await findOrderByRef(supabase, orderRef);
          if (!order || order.kind !== "subscription") continue;
          const recurring = recurringForPlan(order.plan);
          if (!recurring) continue;
          const intervalUnit = String(order.interval_unit || "yearly");
          // Create the subscription against the newly activated mandate.
          const links = event?.links || {};
          const mandateId = String(links.mandate || "");
          if (!mandateId) continue;
          await gcPost("/subscriptions", gcToken, {
            subscriptions: {
              amount: Number(order.amount_pence || 0),
              currency: "GBP",
              interval: 1,
              interval_unit: intervalUnit === "monthly" ? "monthly" : "yearly",
              name: String(order.plan || "RA10").toUpperCase() === "PRO" ? "RA10 Pro" : "RA10",
              metadata: { order_ref: orderRef },
              links: { mandate: mandateId },
            },
          });
        } else if (resourceType === "subscriptions" && (action === "created" || action === "activated")) {
          const orderRef = orderRefFromMetadata(resourceMetadata, eventMetadata);
          const order = await findOrderByRef(supabase, orderRef);
          if (!order || order.kind !== "subscription") continue;
          const recurring = recurringForPlan(order.plan);
          if (!recurring) continue;
          const profileId = await findProfileId(supabase, String(order.user_id || ""), String(order.email || ""));
          if (!profileId) continue;
          await applyRecurring(supabase, profileId, recurring, String(order.interval_unit || "yearly"));
          await markOrderFulfilled(supabase, orderRef);
        } else if (resourceType === "payments" && (action === "confirmed" || action === "paid_out")) {
          const orderRef = orderRefFromMetadata(resourceMetadata, eventMetadata);
          const order = await findOrderByRef(supabase, orderRef);
          if (!order || order.kind !== "payment") continue;
          const profileId = await findProfileId(supabase, String(order.user_id || ""), String(order.email || ""));
          if (!profileId) continue;
          if (order.plan === "CREDITS") {
            await addCredits(supabase, profileId, Number(order.credits || 0));
          } else {
            const subject = toUpper(order.subject);
            const mapped: SubjectName | null =
              subject === "IT" ? "IT" : subject === "BUSINESS" ? "Business" : subject === "SPORT" ? "Sport" : null;
            if (mapped) await unlockSubject(supabase, profileId, mapped);
          }
          await markOrderFulfilled(supabase, orderRef);
        } else if (
          (resourceType === "mandates" && (action === "cancelled" || action === "failed" || action === "expired")) ||
          (resourceType === "subscriptions" && (action === "cancelled" || action === "finished"))
        ) {
          const orderRef = orderRefFromMetadata(resourceMetadata, eventMetadata);
          const order = await findOrderByRef(supabase, orderRef);
          if (!order) continue;
          const profileId = await findProfileId(supabase, String(order.user_id || ""), String(order.email || ""));
          if (profileId) {
            await downgradeToFree(supabase, profileId);
          }
        }
      } catch (innerErr) {
        console.error(`gocardless webhook event handling failed (${resourceType}.${action}):`, innerErr);
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error("gocardless-webhook error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500 },
    );
  }
});