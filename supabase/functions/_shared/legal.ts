// Shared Terms of Service gate for edge functions.
// Returns a 403 Response when the user hasn't accepted the current Terms of
// Service + Privacy Policy, or null when they may continue.
//
// Fails open ONLY while supabase/sql/legal-terms-acceptance.sql hasn't been
// applied yet (the RPC doesn't exist), so deploying functions before the SQL
// doesn't take features offline. Any other error fails closed.

// deno-lint-ignore no-explicit-any
type SupabaseLike = { rpc: (fn: string, args?: Record<string, unknown>) => any };

const MISSING_FUNCTION_CODES = new Set(["PGRST202", "42883"]);

export async function requireTermsAccepted(
  supabase: SupabaseLike,
  userId: string,
  headers: Record<string, string>,
): Promise<Response | null> {
  const { data, error } = await supabase.rpc("user_has_accepted_current_terms", { p_user_id: userId });

  if (error) {
    if (MISSING_FUNCTION_CODES.has(String(error.code || ""))) {
      console.warn("legal: user_has_accepted_current_terms missing — run legal-terms-acceptance.sql");
      return null;
    }
    console.error("legal: terms check failed", error);
    return new Response(
      JSON.stringify({ error: "Could not verify Terms of Service acceptance. Please try again.", code: "terms_check_failed" }),
      { status: 503, headers },
    );
  }

  if (data === true) return null;

  return new Response(
    JSON.stringify({
      error: "Please accept the RA10 Terms of Service and Privacy Policy to use this feature.",
      code: "terms_required",
    }),
    { status: 403, headers },
  );
}
