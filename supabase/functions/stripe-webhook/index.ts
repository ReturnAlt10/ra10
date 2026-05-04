import Stripe from "https://esm.sh/stripe@14?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Hardcoded price → tier mapping
const PRICE_TIER_MAP: Record<string, any> = {
  "price_1TTNRZLA7pznmZIOCkXXIVVH": {
    tier: "subject",
    credits: 300,
    resetsMonthly: false,
    subject: "IT",
  },
  "price_1TTNSPLA7pznmZIOjn1EcfIH": {
    tier: "all_subjects",
    credits: 1000,
    resetsMonthly: true,
  },
  "price_1TTNT4LA7pznmZIOTMlq0l7C": {
    tier: "ultra",
    credits: 999999,
    resetsMonthly: false,
  },
  "price_1TTNU7LA7pznmZIOB4Ess5R1": {
    tier: "school_admin",
    credits: 300,
    resetsMonthly: true,
  },
};

// Helper: Calculate credits_reset_at
function getCreditsResetAt(resetsMonthly: boolean): string | null {
  if (!resetsMonthly) return null;
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString();
}

export default Deno.serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405 }
      );
    }

    // Get raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing stripe-signature header" }),
        { status: 400 }
      );
    }

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeSecretKey || !stripeWebhookSecret) {
      console.error("Missing Stripe configuration");
      return new Response(
        JSON.stringify({ error: "Missing Stripe configuration" }),
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    // Verify webhook signature
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        rawBody,
        signature,
        stripeWebhookSecret
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
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

    // Handle different event types
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { user_id, price_id } = session.metadata || {};

      if (!user_id || !price_id) {
        console.warn("Missing user_id or price_id in checkout.session.completed");
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      const tierInfo = PRICE_TIER_MAP[price_id];
      if (!tierInfo) {
        console.warn(`Unknown price_id: ${price_id}`);
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      const creditsResetAt = getCreditsResetAt(tierInfo.resetsMonthly);

      // Update profile with tier info
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          tier: tierInfo.tier,
          credits: tierInfo.credits,
          credits_reset_at: creditsResetAt,
          stripe_customer_id: session.customer,
        })
        .eq("id", user_id);

      if (updateError) {
        console.error("Failed to update profile:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update profile" }),
          { status: 500 }
        );
      }

      // If tier is 'subject', append subject to unlocked_subjects array
      if (tierInfo.tier === "subject" && tierInfo.subject) {
        const { data: profile, error: fetchError } = await supabase
          .from("profiles")
          .select("unlocked_subjects")
          .eq("id", user_id)
          .single();

        if (fetchError) {
          console.error("Failed to fetch unlocked_subjects:", fetchError);
        } else if (profile) {
          const currentSubjects = profile.unlocked_subjects || [];
          if (!currentSubjects.includes(tierInfo.subject)) {
            const updatedSubjects = [...currentSubjects, tierInfo.subject];
            const { error: arrayError } = await supabase
              .from("profiles")
              .update({ unlocked_subjects: updatedSubjects })
              .eq("id", user_id);

            if (arrayError) {
              console.error("Failed to update unlocked_subjects:", arrayError);
            }
          }
        }
      }
    } else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      if (!customerId) {
        console.warn("Missing customer id in subscription.deleted event");
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      const creditsResetAt = getCreditsResetAt(true); // Free tier resets monthly

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          tier: "free",
          credits: 10,
          credits_reset_at: creditsResetAt,
        })
        .eq("stripe_customer_id", customerId);

      if (updateError) {
        console.error(
          "Failed to update profile on subscription deletion:",
          updateError
        );
        return new Response(
          JSON.stringify({ error: "Failed to update profile" }),
          { status: 500 }
        );
      }
    } else if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object;
      const customerId = invoice.customer;
      const lineItem = invoice.lines.data?.[0];
      const priceId = lineItem?.price?.id;

      if (!customerId || !priceId) {
        console.warn("Missing customer or price_id in invoice.payment_succeeded");
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      const tierInfo = PRICE_TIER_MAP[priceId];
      if (!tierInfo || !tierInfo.resetsMonthly) {
        // Only update if tier exists and is a recurring tier
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      const creditsResetAt = getCreditsResetAt(true);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          credits: tierInfo.credits,
          credits_reset_at: creditsResetAt,
        })
        .eq("stripe_customer_id", customerId);

      if (updateError) {
        console.error("Failed to update profile on invoice payment:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update profile" }),
          { status: 500 }
        );
      }
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
