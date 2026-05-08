import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const LS_CHECKOUTS = {
  IT:       "https://ra10edu.lemonsqueezy.com/checkout/buy/b428f59a-2ea6-4bed-86d4-09541c3457b9",
  BUSINESS: "https://ra10edu.lemonsqueezy.com/checkout/buy/4e639075-b1f4-4850-a7af-729fb8c5a4bb",
  SPORT:    "https://ra10edu.lemonsqueezy.com/checkout/buy/877858f8-0ebd-4948-8894-8b647eeac756",
  PRO:      "https://ra10edu.lemonsqueezy.com/checkout/buy/e5ddcd2d-d806-43cc-b0b8-40017d83f80e",
  ULTRA:    "https://ra10edu.lemonsqueezy.com/checkout/buy/dbb9ef1f-9a7e-4a4b-bb9e-74bf480781dd",
  EDU:      "https://ra10edu.lemonsqueezy.com/checkout/buy/8c8421fa-7b05-4bfb-930b-a4073cb78f19",
};

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

    const body = await req.json();
    const plan = String(body?.plan || "").toUpperCase();
    const subject = String(body?.subject || "").toUpperCase();

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
    let checkoutBase = "";
    if (subject === "IT") checkoutBase = LS_CHECKOUTS.IT;
    if (subject === "BUSINESS") checkoutBase = LS_CHECKOUTS.BUSINESS;
    if (subject === "SPORT") checkoutBase = LS_CHECKOUTS.SPORT;
    if (plan === "PRO") checkoutBase = LS_CHECKOUTS.PRO;
    if (plan === "ULTRA") checkoutBase = LS_CHECKOUTS.ULTRA;
    if (plan === "EDU") checkoutBase = LS_CHECKOUTS.EDU;

    if (!checkoutBase) {
      return new Response(
        JSON.stringify({ error: "Checkout URL is not configured for this plan/subject" }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const url = new URL(checkoutBase);
    url.searchParams.set("checkout[email]", String(user.email || ""));
    url.searchParams.set("checkout[custom][user_id]", String(user.id || ""));
    url.searchParams.set("checkout[custom][email]", String(user.email || ""));
    if (plan) url.searchParams.set("checkout[custom][plan]", plan);
    if (subject) url.searchParams.set("checkout[custom][subject]", subject);

    return new Response(JSON.stringify({ url: url.toString() }), {
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
