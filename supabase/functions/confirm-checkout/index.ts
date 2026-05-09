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

const SUBJECTS_ALL: SubjectName[] = ["IT", "Business", "Sport"];
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

function toUpper(v: unknown): string {
  return String(v || "").trim().toUpperCase();
}

function oneMonthFromNowIso(): string {
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() + 1);
  return d.toISOString();
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

async function ensureProfileRow(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  email: string,
): Promise<string | null> {
  const byId = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
  if (!byId.error && byId.data?.id) {
    return String(byId.data.id);
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

  return null;
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

  const nextSubjects = [...existing, subject];
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
      return new Response(JSON.stringify({ error: "Missing bearer token" }), { status: 401, headers: corsHeaders });
    }

    const jwt = authHeader.slice(7);
    const body = await req.json().catch(() => ({}));
    const sessionId = String(body?.sessionId || "").trim();
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "sessionId is required" }), { status: 400, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!supabaseUrl || !serviceRole) {
      return new Response(JSON.stringify({ error: "Missing Supabase configuration" }), { status: 500, headers: corsHeaders });
    }

    const supabase = createClient(supabaseUrl, serviceRole);
    const { data: userData, error: userError } = await supabase.auth.getUser(jwt);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const user = userData.user;
    const checkout = await stripeGet(`checkout/sessions/${encodeURIComponent(sessionId)}`);
    if (!checkout) {
      return new Response(JSON.stringify({ error: "Checkout session not found" }), { status: 404, headers: corsHeaders });
    }

    const paid = String(checkout?.payment_status || "") === "paid" || String(checkout?.status || "") === "complete";
    if (!paid) {
      return new Response(JSON.stringify({ error: "Checkout is not paid/complete yet" }), { status: 409, headers: corsHeaders });
    }

    const metadata = checkout?.metadata || {};
    const metaUserId = String(metadata?.user_id || checkout?.client_reference_id || "").trim();
    if (metaUserId && metaUserId !== String(user.id)) {
      return new Response(JSON.stringify({ error: "Checkout session does not belong to current user" }), { status: 403, headers: corsHeaders });
    }

    const email = String(user.email || metadata?.email || checkout?.customer_email || "").trim().toLowerCase();
    const profileId = await ensureProfileRow(supabase, String(user.id), email);
    if (!profileId) {
      return new Response(JSON.stringify({ error: "Could not resolve profile" }), { status: 500, headers: corsHeaders });
    }

    let action = resolveActionFromMetadata(metadata);
    if (!action) {
      const lineItems = await stripeGet(`checkout/sessions/${encodeURIComponent(sessionId)}/line_items?limit=1`);
      const priceId = String(lineItems?.data?.[0]?.price?.id || "").trim();
      if (priceId) {
        action = getPriceMap()[priceId] || null;
      }
    }

    if (!action) {
      return new Response(JSON.stringify({ error: "Could not determine purchased plan from checkout session" }), { status: 400, headers: corsHeaders });
    }

    await applyAction(supabase, profileId, action);

    const updated = await supabase.from("profiles").select("id, tier, credits, unlimited_credits, unlocked_subjects").eq("id", profileId).single();
    if (updated.error) {
      return new Response(JSON.stringify({ ok: true, warning: "Applied action but could not fetch updated profile" }), { status: 200, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ ok: true, profile: updated.data }), { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("confirm-checkout error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: getCorsHeaders(req.headers.get("origin") || "") },
    );
  }
});
