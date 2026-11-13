// Shared vision call (photo + prompt → JSON), same providers and env vars as ai-transcribe:
// OpenRouter vision models, OpenAI, Gemini (OPENROUTER_VISION_MODELS / OPENAI_VISION_MODELS / GEMINI_VISION_MODELS).
// The image is only held in memory for the provider call; it is never stored.
import { extractJson } from "./ai.ts";

type Provider = { name: string; endpoint: string; models: string[]; apiKey: string };
const list = (env: string, fallback: string[]) => {
  const v = (Deno.env.get(env) || "").split(",").map((s) => s.trim()).filter(Boolean);
  return v.length ? v : fallback;
};
function providers(): Provider[] {
  const out: Provider[] = [];
  const or = Deno.env.get("OPENROUTER_API_KEY") || "", oa = Deno.env.get("OPENAI_API_KEY") || "", gm = Deno.env.get("GEMINI_API_KEY") || "";
  if (or) out.push({ name: "openrouter", endpoint: "https://openrouter.ai/api/v1/chat/completions", models: list("OPENROUTER_VISION_MODELS", ["google/gemini-2.0-flash-001"]), apiKey: or });
  if (oa) out.push({ name: "openai", endpoint: Deno.env.get("OPENAI_ENDPOINT") || "https://api.openai.com/v1/chat/completions", models: list("OPENAI_VISION_MODELS", ["gpt-4o-mini"]), apiKey: oa });
  if (gm) out.push({ name: "gemini", endpoint: Deno.env.get("GEMINI_ENDPOINT") || "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", models: list("GEMINI_VISION_MODELS", ["gemini-2.0-flash"]), apiKey: gm });
  return out;
}
export const IMAGE_RE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
export const MAX_IMAGE = 2_800_000;

export async function askVisionJson(system: string, text: string, image: string, timeout = 45000): Promise<{ json: any; provider: string }> {
  const errors: string[] = [];
  for (const p of providers()) {
    for (const model of p.models) {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), timeout);
      try {
        const res = await fetch(p.endpoint, {
          method: "POST", signal: ctl.signal,
          headers: { "Authorization": `Bearer ${p.apiKey}`, "Content-Type": "application/json", ...(p.name === "openrouter" ? { "HTTP-Referer": "https://ra10.co.uk", "X-Title": "RA10 Scanner" } : {}) },
          body: JSON.stringify({
            model, temperature: 0, max_tokens: 3000, response_format: { type: "json_object" },
            messages: [{ role: "system", content: system }, { role: "user", content: [{ type: "text", text }, { type: "image_url", image_url: { url: image } }] }],
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(String(data?.error?.message || `${p.name} ${res.status}`));
        const json = extractJson(String(data?.choices?.[0]?.message?.content || ""));
        if (!json) throw new Error("no JSON in reply");
        return { json, provider: `${p.name}:${model}` };
      } catch (e) {
        errors.push(`${p.name}:${model} -> ${e instanceof Error ? e.message : String(e)}`);
      } finally { clearTimeout(t); }
    }
  }
  throw new Error(errors.length ? `All vision providers failed: ${errors.join(" | ")}` : "No AI providers configured");
}
