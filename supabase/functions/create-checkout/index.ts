import Stripe from "https://esm.sh/stripe@14?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Hardcoded price IDs
const STRIPE_PRICE_BASIC_IT = "price_1TTNRZLA7pznmZIOCkXXIVVH";
const STRIPE_PRICE_PRO = "price_1TTNSPLA7pznmZIOjn1EcfIH";
const STRIPE_PRICE_ULTRA = "price_1TTNT4LA7pznmZIOTMlq0l7C";
const STRIPE_PRICE_EDU_ADMIN = "price_1TTNU7LA7pznmZIOB4Ess5R1";

// CORS allowed origins
const ALLOWED_ORIGINS = [
  "https://ra10.co.uk",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
];

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

    // Parse request body
    const body = await req.json();
    const { priceId } = body;

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: "priceId is required" }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Get JWT from Authorization header
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

    const jwt = authHeader.slice(7); // Remove "Bearer " prefix

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

    // Verify JWT and get user
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

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch user profile" }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: "Missing Stripe configuration" }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    let stripeCustomerId = profile?.stripe_customer_id;

    // Create Stripe customer if it doesn't exist
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      });

      stripeCustomerId = customer.id;

      // Update user profile with stripe_customer_id
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", user.id);

      if (updateError) {
        console.error(
          "Failed to update profile with stripe_customer_id:",
          updateError
        );
      }
    }

    // Determine checkout mode
    const mode =
      priceId === STRIPE_PRICE_BASIC_IT ? "payment" : "subscription";

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: mode as "payment" | "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: stripeCustomerId,
      success_url: "https://ra10.co.uk/#/account?upgraded=1",
      cancel_url: "https://ra10.co.uk/#/upgrade",
      metadata: {
        user_id: user.id,
        price_id: priceId,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
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
