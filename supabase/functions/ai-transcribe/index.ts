// ai-transcribe: turns a photo of handwritten work into editable text so the
// student can paste it into a practice answer and send it to AI Examiner.
//
// • Accepts ONE image as a data URL (JPEG/PNG/WebP, max ~2 MB after base64).
//   The client downsizes photos to <= 1600px before sending.
// • The image is only held in memory for the provider call. It is never stored.
// • Output: { ok, text, confidence, notes } - maths is written in LaTeX ($...$).
//
// Providers (first configured wins, falls back in order): OpenRouter vision
// models, OpenAI, Gemini. Keys/models come from the same env vars as ai-mark,
// plus optional OPENAI_VISION_MODELS / GEMINI_VISION_MODELS / OPENROUTER_VISION_MODELS.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireTermsAccepted } from "../_shared/legal.ts";

const ALLOWED_ORIGINS = [
  "https://ra10.co.uk",
  "https://www.ra10.co.uk",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
];
const MAX_DATA_URL = 2_800_000; // ~2 MB binary
const IMAGE_RE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;

type Provider = { name: string; endpoint: string; models: string[]; apiKey: string };

function list(env: string, fallback: string[]): string[] {
  const v = (Deno.env.get(env) || "").split(",").map((s) => s.trim()).filter(Boolean);
  return v.length ? v : fallback;
}

function providers(): Provider[] {
  const out: Provider[] = [];
  const openai = Deno.env.get("OPENAI_API_KEY") || "";
  const gemini = Deno.env.get("GEMINI_API_KEY") || "";
  const openrouter = Deno.env.get("OPENROUTER_API_KEY") || "";
  if (openrouter) {
    out.push({ name: "openrouter", endpoint: "https://openrouter.ai/api/v1/chat/completions", models: list("OPENROUTER_VISION_MODELS", ["google/gemini-2.0-flash-001"]), apiKey: openrouter });
  }
  if (openai) {
    out.push({ name: "openai", endpoint: Deno.env.get("OPENAI_ENDPOINT") || "https://api.openai.com/v1/chat/completions", models: list("OPENAI_VISION_MODELS", ["gpt-4o-mini"]), apiKey: openai });
  }
  if (gemini) {
    out.push({ name: "gemini", endpoint: Deno.env.get("GEMINI_ENDPOINT") || "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", models: list("GEMINI_VISION_MODELS", ["gemini-2.0-flash"]), apiKey: gemini });
  }
  return out;
}

function cors(origin: string) {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };
}

const SYSTEM = [
  "You transcribe photos of students' handwritten exam answers into plain text.",
  "Copy exactly what the student wrote, in reading order. Do NOT correct, improve, complete or mark the work - mistakes must stay as written so an examiner can mark them.",
  "Write any mathematics, formulas or calculations in LaTeX: inline as $...$, and a line of working as $$...$$ (e.g. $$\\frac{12}{140} \\times 100 = 8.6\\%$$). Use \\times for multiplication and \\% for percent.",
  "Keep line breaks between separate points or lines of working. Ignore crossed-out text.",
  "If a word or number is unreadable write [?]. If the image contains no handwriting or is not student work, return empty text and explain in notes.",
  'Reply with JSON only: {"text": string, "confidence": "high" | "medium" | "low", "notes": string}.',
].join("\n");

function parseJson(s: string): Record<string, unknown> | null {
  try { return JSON.parse(s); } catch { /* fall through */ }
  const a = s.indexOf("{"), b = s.lastIndexOf("}");
  if (a >= 0 && b > a) { try { return JSON.parse(s.slice(a, b + 1)); } catch { /* ignore */ } }
  return null;
}

async function transcribe(image: string, question: string): Promise<{ text: string; confidence: string; notes: string; provider: string }> {
  const list = providers();
  if (!list.length) throw new Error("AI provider keys are not configured");
  const errors: string[] = [];
  const userText = question
    ? `The student was answering this question (for context only - do not answer it):\n${question.slice(0, 1500)}\n\nTranscribe the handwriting in the photo.`
    : "Transcribe the handwriting in the photo.";
  for (const p of list) {
    for (const model of p.models) {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 45000);
      try {
        const res = await fetch(p.endpoint, {
          method: "POST",
          signal: ctrl.signal,
          headers: {
            "Authorization": `Bearer ${p.apiKey}`,
            "Content-Type": "application/json",
            ...(p.name === "openrouter" ? { "HTTP-Referer": "https://ra10.co.uk", "X-Title": "RA10 Transcribe" } : {}),
          },
          body: JSON.stringify({
            model,
            temperature: 0,
            max_tokens: 2000,
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: SYSTEM },
              { role: "user", content: [{ type: "text", text: userText }, { type: "image_url", image_url: { url: image } }] },
            ],
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(String(data?.error?.message || `${p.name} ${res.status}`));
        const parsed = parseJson(String(data?.choices?.[0]?.message?.content || ""));
        if (!parsed) throw new Error("unparseable response");
        const text = String(parsed.text || "").slice(0, 8000);
        const confidence = ["high", "medium", "low"].includes(String(parsed.confidence)) ? String(parsed.confidence) : "medium";
        return { text, confidence, notes: String(parsed.notes || "").slice(0, 500), provider: `${p.name}:${model}` };
      } catch (err) {
        errors.push(`${p.name}:${model} -> ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        clearTimeout(t);
      }
    }
  }
  throw new Error(`All providers failed: ${errors.join(" | ")}`);
}

export default Deno.serve(async (req: Request) => {
  const headers = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers });
  const fail = (status: number, error: string) => new Response(JSON.stringify({ error }), { status, headers });
  try {
    if (req.method !== "POST") return fail(405, "Method not allowed");
    const auth = req.headers.get("authorization") || "";
    if (!auth.startsWith("Bearer ")) return fail(401, "Missing bearer token");

    const body = await req.json().catch(() => ({}));
    const image = String(body?.image || "");
    const question = String(body?.question || "");
    if (!image || image.length > MAX_DATA_URL) return fail(400, "Please send one photo under 2 MB.");
    if (!IMAGE_RE.test(image)) return fail(400, "The photo must be a JPEG, PNG or WebP image.");

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!supabaseUrl || !serviceRole) return fail(500, "Missing Supabase configuration");
    const supabase = createClient(supabaseUrl, serviceRole);
    const { data: userData, error: userError } = await supabase.auth.getUser(auth.slice(7));
    if (userError || !userData.user) return fail(401, "Unauthorized");
    const denied = await requireTermsAccepted(supabase, String(userData.user.id), headers);
    if (denied) return denied;

    const out = await transcribe(image, question);
    return new Response(JSON.stringify({ ok: true, ...out }), { status: 200, headers });
  } catch (err) {
    console.error("ai-transcribe error:", err);
    return fail(500, err instanceof Error ? err.message : "Internal server error");
  }
});
