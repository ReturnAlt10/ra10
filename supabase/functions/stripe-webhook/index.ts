import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type SubjectName = "IT" | "Business" | "Sport";
type TierName = "all_subjects" | "ultra" | "school_admin";

type VariantMap = {
  subjects: Record<number, SubjectName>;
  recurring: Record<number, { tier: TierName; credits: number; unlockedSubjects: SubjectName[] }>;
};

function getVariantMap(): VariantMap {
  const subjects: Record<number, SubjectName> = {
    1628887: "IT",
    1628904: "Business",
    1628908: "Sport",
  };
  const recurring: Record<number, { tier: TierName; credits: number; unlockedSubjects: SubjectName[] }> = {
    1628911: { tier: "all_subjects", credits: 1000, unlockedSubjects: ["IT", "Business", "Sport"] },
    1628915: { tier: "ultra",        credits: 999999, unlockedSubjects: ["IT", "Business", "Sport"] },
    1628917: { tier: "school_admin", credits: 300,    unlockedSubjects: ["IT", "Business", "Sport"] },
  };
  return { subjects, recurring };
}

function toLower(s: unknown): string {
  return String(s || "").trim().toLowerCase();
}

function oneMonthFromNowIso(): string {
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() + 1);
  return d.toISOString();
}

async function verifySignature(rawBody: string, signature: string, secret: string): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
  const digestHex = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return digestHex === signature;
}

async function findProfileIdByUserOrEmail(supabase: ReturnType<typeof createClient>, userId: string, email: string): Promise<string | null> {
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
  recurring: { tier: TierName; credits: number; unlockedSubjects: SubjectName[] },
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
      school_id: null,
      school_name: null,
    })
    .eq("id", profileId);
  if (update.error) {
    throw new Error(update.error.message || "Could not downgrade to free");
  }
}

export default Deno.serve(async (req: Request) => {
  console.log("[LS-webhook] Received request", req.method, new Date().toISOString());
  try {
    if (req.method !== "POST") {
      console.log("[LS-webhook] Rejected: not POST");
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405 }
      );
    }

    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";
    const webhookSecret = Deno.env.get("LEMONSQUEEZY_WEBHOOK_SECRET") || "";

    console.log("[LS-webhook] sig present:", !!signature, "secret present:", !!webhookSecret, "body length:", rawBody.length);

    if (!signature || !webhookSecret) {
      console.error("[LS-webhook] Missing signature or secret - sig:", !!signature, "secret:", !!webhookSecret);
      return new Response(
        JSON.stringify({ error: "Missing LemonSqueezy webhook configuration" }),
        { status: 400 }
      );
    }

    const isValid = await verifySignature(rawBody, signature, webhookSecret);
    console.log("[LS-webhook] Signature valid:", isValid);
    if (!isValid) {
      console.error("[LS-webhook] Invalid signature - check LEMONSQUEEZY_WEBHOOK_SECRET matches LemonSqueezy dashboard");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 401 }
      );
    }

    let payload: any = null;
    try {
      payload = JSON.parse(rawBody);
    } catch (err) {
      console.error("Invalid JSON payload", err);
      return new Response(
        JSON.stringify({ error: "Invalid payload" }),
        { status: 400 }
      );
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ error: "Missing Supabase configuration" }),
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const eventName = String(payload?.meta?.event_name || "");
    const data = payload?.data || {};
    const attributes = data?.attributes || {};
    const customData = payload?.meta?.custom_data || attributes?.custom_data || {};

    const userId = String(customData?.user_id || "").trim();
    const email = toLower(customData?.email || attributes?.user_email || attributes?.customer_email);
    const variantId = Number(
      attributes?.first_order_item?.variant_id
      || attributes?.variant_id
      || attributes?.order_item?.variant_id
      || customData?.variant_id
      || 0,
    );

    console.log("[LS-webhook] Event:", eventName, "variantId:", variantId, "userId:", userId, "email:", email);

    const variantMap = getVariantMap();
    const profileId = await findProfileIdByUserOrEmail(supabase, userId, email);
    if (!profileId) {
      console.warn("[LS-webhook] Unknown user/profile - userId:", userId, "email:", email, "event:", eventName);
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }
    console.log("[LS-webhook] Found profileId:", profileId);

    if (eventName === "order_created") {
      const subject = variantMap.subjects[variantId];
      const recurring = variantMap.recurring[variantId];
      if (subject) {
        await appendSubjectUnlock(supabase, profileId, subject);
      } else if (recurring) {
        await applyRecurringTier(supabase, profileId, recurring);
      }
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    if (
      eventName === "subscription_created"
      || eventName === "subscription_updated"
      || eventName === "subscription_resumed"
      || eventName === "subscription_unpaused"
      || eventName === "subscription_payment_success"
    ) {
      const recurring = variantMap.recurring[variantId];
      if (recurring) {
        await applyRecurringTier(supabase, profileId, recurring);
      }
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    if (
      eventName === "subscription_cancelled"
      || eventName === "subscription_expired"
      || eventName === "subscription_paused"
      || eventName === "subscription_payment_failed"
    ) {
      const endsAtRaw = String(attributes?.ends_at || attributes?.renews_at || "");
      const endsAt = endsAtRaw ? new Date(endsAtRaw) : null;
      if (endsAt && !Number.isNaN(endsAt.getTime()) && endsAt.getTime() > Date.now()) {
        return new Response(JSON.stringify({ received: true, deferred: true }), { status: 200 });
      }
      await downgradeToFree(supabase, profileId);
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500 }
    );
  }
});
