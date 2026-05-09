import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type SubjectName = "IT" | "Business" | "Sport";
type TierName = "all_subjects" | "ultra" | "school_admin";

type RecurringTier = {
  tier: TierName;
  credits: number;
  unlockedSubjects: SubjectName[];
};

type PriceAction =
  | { type: "subject"; subject: SubjectName }
  | { type: "recurring"; recurring: RecurringTier };

type StripeEvent = {
  id?: string;
  type?: string;
  data?: {
    object?: any;
  };
};

const SUBJECTS_ALL: SubjectName[] = ["IT", "Business", "Sport"];
const SIGNATURE_TOLERANCE_SECONDS = 300;

function oneMonthFromNowIso(): string {
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() + 1);
  return d.toISOString();
}

function toLower(s: unknown): string {
  return String(s || "").trim().toLowerCase();
}

function toUpper(s: unknown): string {
  return String(s || "").trim().toUpperCase();
}

function getRecurringByPlan(planRaw: unknown): RecurringTier | null {
  const plan = toUpper(planRaw);
  if (plan === "PRO") {
    return { tier: "all_subjects", credits: 1000, unlockedSubjects: SUBJECTS_ALL };
  }
  if (plan === "ULTRA") {
    return { tier: "ultra", credits: 999999, unlockedSubjects: SUBJECTS_ALL };
  }
  if (plan === "EDU") {
    return { tier: "school_admin", credits: 300, unlockedSubjects: SUBJECTS_ALL };
  }
  return null;
}

function getSubjectByAny(value: unknown): SubjectName | null {
  const key = toUpper(value);
  if (key === "IT") return "IT";
  if (key === "BUSINESS") return "Business";
  if (key === "SPORT") return "Sport";
  return null;
}

function getPriceMap(): Record<string, PriceAction> {
  const map: Record<string, PriceAction> = {};

  const stripePriceIt = Deno.env.get("STRIPE_PRICE_IT") || "";
  const stripePriceBusiness = Deno.env.get("STRIPE_PRICE_BUSINESS") || "";
  const stripePriceSport = Deno.env.get("STRIPE_PRICE_SPORT") || "";
  const stripePricePro = Deno.env.get("STRIPE_PRICE_PRO") || "";
  const stripePriceUltra = Deno.env.get("STRIPE_PRICE_ULTRA") || "";
  const stripePriceEdu = Deno.env.get("STRIPE_PRICE_EDU") || "";

  if (stripePriceIt) map[stripePriceIt] = { type: "subject", subject: "IT" };
  if (stripePriceBusiness) map[stripePriceBusiness] = { type: "subject", subject: "Business" };
  if (stripePriceSport) map[stripePriceSport] = { type: "subject", subject: "Sport" };
  if (stripePricePro) {
    map[stripePricePro] = {
      type: "recurring",
      recurring: { tier: "all_subjects", credits: 1000, unlockedSubjects: SUBJECTS_ALL },
    };
  }
  if (stripePriceUltra) {
    map[stripePriceUltra] = {
      type: "recurring",
      recurring: { tier: "ultra", credits: 999999, unlockedSubjects: SUBJECTS_ALL },
    };
  }
  if (stripePriceEdu) {
    map[stripePriceEdu] = {
      type: "recurring",
      recurring: { tier: "school_admin", credits: 300, unlockedSubjects: SUBJECTS_ALL },
    };
  }

  return map;
}

function parseStripeSignature(header: string): { timestamp: number; signatures: string[] } | null {
  const pairs = String(header || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  let timestamp = 0;
  const signatures: string[] = [];

  for (const pair of pairs) {
    const [k, v] = pair.split("=");
    if (!k || !v) continue;
    if (k === "t") {
      timestamp = Number(v);
      continue;
    }
    if (k === "v1") {
      signatures.push(v);
    }
  }

  if (!timestamp || !signatures.length) {
    return null;
  }

  return { timestamp, signatures };
}

async function hmacSha256Hex(secret: string, payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyStripeSignature(rawBody: string, signatureHeader: string, secret: string): Promise<boolean> {
  const parsed = parseStripeSignature(signatureHeader);
  if (!parsed) return false;

  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - parsed.timestamp) > SIGNATURE_TOLERANCE_SECONDS) {
    return false;
  }

  const signedPayload = `${parsed.timestamp}.${rawBody}`;
  const expected = await hmacSha256Hex(secret, signedPayload);
  return parsed.signatures.includes(expected);
}

async function findProfileIdByUserOrEmail(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  email: string,
): Promise<string | null> {
  if (userId) {
    const byId = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
    if (!byId.error && byId.data?.id) {
      return String(byId.data.id);
    }
  }

  if (!email) {
    return null;
  }

  const byEmail = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
  if (byEmail.error || !byEmail.data?.id) {
    return null;
  }

  return String(byEmail.data.id);
}

async function ensureProfileRowByUserOrEmail(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  email: string,
): Promise<string | null> {
  const existing = await findProfileIdByUserOrEmail(supabase, userId, email);
  if (existing) return existing;

  if (!userId) {
    return null;
  }

  const createdAt = new Date();
  createdAt.setUTCMonth(createdAt.getUTCMonth() + 1);
  const displayName = String(email || "").split("@")[0] || "";

  const insert = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        email: email || "",
        display_name: displayName,
        tier: "free",
        credits: 10,
        credits_reset_at: createdAt.toISOString(),
        unlimited_credits: false,
        unlocked_subjects: [],
      },
      { onConflict: "id" },
    )
    .select("id")
    .single();

  if (!insert.error && insert.data?.id) {
    return String(insert.data.id);
  }

  return await findProfileIdByUserOrEmail(supabase, userId, email);
}

async function appendSubjectUnlock(
  supabase: ReturnType<typeof createClient>,
  profileId: string,
  subject: SubjectName,
): Promise<void> {
  const profileRes = await supabase.from("profiles").select("unlocked_subjects, credits, tier").eq("id", profileId).single();
  if (profileRes.error || !profileRes.data) {
    throw new Error("Profile not found when applying subject unlock");
  }

  const existing = Array.isArray(profileRes.data.unlocked_subjects) ? profileRes.data.unlocked_subjects : [];
  if (existing.includes(subject)) {
    return;
  }
  const nextSubjects = existing.includes(subject) ? existing : [...existing, subject];
  const nextCredits = Number(profileRes.data.credits || 0) + 300;
  const nextTier = profileRes.data.tier === "free" ? "subject" : profileRes.data.tier;

  const update = await supabase
    .from("profiles")
    .update({
      tier: nextTier,
      credits: nextCredits,
      unlocked_subjects: nextSubjects,
    })
    .eq("id", profileId);

  if (update.error) {
    throw new Error(update.error.message || "Could not update profile for subject unlock");
  }
}

async function applyRecurringTier(
  supabase: ReturnType<typeof createClient>,
  profileId: string,
  recurring: RecurringTier,
): Promise<void> {
  const update = await supabase
    .from("profiles")
    .update({
      tier: recurring.tier,
      credits: recurring.credits,
      credits_reset_at: oneMonthFromNowIso(),
      unlocked_subjects: recurring.unlockedSubjects,
      unlimited_credits: recurring.tier === "ultra",
    })
    .eq("id", profileId);

  if (update.error) {
    throw new Error(update.error.message || "Could not apply recurring tier");
  }
}

async function downgradeToFree(supabase: ReturnType<typeof createClient>, profileId: string): Promise<void> {
  const update = await supabase
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

  if (update.error) {
    throw new Error(update.error.message || "Could not downgrade to free");
  }
}

function resolveActionFromMetadata(metadata: any): PriceAction | null {
  const subject = getSubjectByAny(metadata?.subject);
  if (subject) {
    return { type: "subject", subject };
  }

  const recurring = getRecurringByPlan(metadata?.plan);
  if (recurring) {
    return { type: "recurring", recurring };
  }

  return null;
}

function extractPriceIdFromObject(obj: any): string {
  const fromLines = obj?.lines?.data?.[0]?.price?.id;
  const fromItems = obj?.items?.data?.[0]?.price?.id;
  const fromLineItems = obj?.line_items?.data?.[0]?.price?.id;
  const fromPlan = obj?.plan?.id;
  const fromPrice = obj?.price?.id;
  return String(fromLines || fromItems || fromLineItems || fromPlan || fromPrice || "").trim();
}

function getStripeSecretKey(): string {
  return Deno.env.get("STRIPE_SECRET_KEY") || "";
}

async function stripeGet(path: string): Promise<any | null> {
  const secret = getStripeSecretKey();
  if (!secret) return null;
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${secret}`,
    },
  });
  if (!res.ok) return null;
  return await res.json();
}

async function getCustomerEmail(customerId: string): Promise<string> {
  if (!customerId) return "";
  const customer = await stripeGet(`customers/${customerId}`);
  return toLower(customer?.email || "");
}

async function getCheckoutSessionLineItemPriceId(sessionId: string): Promise<string> {
  if (!sessionId) return "";
  const payload = await stripeGet(`checkout/sessions/${sessionId}/line_items?limit=1`);
  return String(payload?.data?.[0]?.price?.id || "").trim();
}

async function applyAction(
  supabase: ReturnType<typeof createClient>,
  profileId: string,
  action: PriceAction,
): Promise<void> {
  if (action.type === "subject") {
    await appendSubjectUnlock(supabase, profileId, action.subject);
    return;
  }
  await applyRecurringTier(supabase, profileId, action.recurring);
}

export default Deno.serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature") || "";
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

    if (!signature || !webhookSecret) {
      return new Response(
        JSON.stringify({ error: "Missing STRIPE_WEBHOOK_SECRET or stripe-signature" }),
        { status: 400 },
      );
    }

    const valid = await verifyStripeSignature(rawBody, signature, webhookSecret);
    if (!valid) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 401 });
    }

    let event: StripeEvent;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRole) {
      return new Response(JSON.stringify({ error: "Missing Supabase configuration" }), { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRole);
    const priceMap = getPriceMap();

    const eventType = String(event?.type || "");
    const object = event?.data?.object || {};

    const metadata = object?.metadata || {};
    const userId = String(metadata?.user_id || object?.client_reference_id || "").trim();
    let email = toLower(
      metadata?.email
      || object?.customer_details?.email
      || object?.customer_email
      || object?.receipt_email,
    );

    if (!email) {
      email = await getCustomerEmail(String(object?.customer || "").trim());
    }

    const profileId = await ensureProfileRowByUserOrEmail(supabase, userId, email);
    if (!profileId) {
      return new Response(JSON.stringify({ received: true, skipped: true }), { status: 200 });
    }

    if (eventType === "checkout.session.completed") {
      let action = resolveActionFromMetadata(metadata);
      if (!action) {
        let priceId = extractPriceIdFromObject(object);
        if (!priceId) {
          priceId = await getCheckoutSessionLineItemPriceId(String(object?.id || "").trim());
        }
        action = priceMap[priceId] || null;
      }

      if (action) {
        await applyAction(supabase, profileId, action);
      }
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    if (eventType === "invoice.paid" || eventType === "invoice.payment_succeeded") {
      const priceId = extractPriceIdFromObject(object);
      const mapped = priceMap[priceId];
      if (mapped && mapped.type === "recurring") {
        await applyRecurringTier(supabase, profileId, mapped.recurring);
      }
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    if (eventType === "customer.subscription.updated" || eventType === "customer.subscription.created") {
      const status = String(object?.status || "").toLowerCase();
      const active = status === "active" || status === "trialing" || status === "past_due";
      if (active) {
        const priceId = extractPriceIdFromObject(object);
        const mapped = priceMap[priceId];
        if (mapped && mapped.type === "recurring") {
          await applyRecurringTier(supabase, profileId, mapped.recurring);
        }
      } else {
        const isCancelledNow = status === "canceled"
          || status === "incomplete_expired"
          || (eventType === "customer.subscription.updated" && !!object?.canceled_at && !object?.cancel_at_period_end);
        if (isCancelledNow) {
          await downgradeToFree(supabase, profileId);
        }
      }
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    if (
      eventType === "customer.subscription.deleted"
      || eventType === "invoice.payment_failed"
      || eventType === "charge.refunded"
      || eventType === "charge.refund.updated"
    ) {
      const isRefundEvent = eventType === "charge.refunded" || eventType === "charge.refund.updated";
      const refundedNow = Boolean(object?.refunded) || Number(object?.amount_refunded || 0) > 0;
      if (!isRefundEvent || refundedNow) {
        await downgradeToFree(supabase, profileId);
      }
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500 },
    );
  }
});
