// Shared AI provider fallback (OpenRouter → DeepSeek → OpenAI → Gemini), same
// order and env vars as ai-assign / ai-mark. Returns the first successful reply.

type ProviderConfig = { name: string; endpoint: string; models: string[]; apiKey: string; timeout: number };

function list(env: string): string[] {
  return (Deno.env.get(env) || "").split(",").map((m) => m.trim()).filter(Boolean);
}

export function providers(timeout = 25000): ProviderConfig[] {
  const out: ProviderConfig[] = [];
  const or = Deno.env.get("OPENROUTER_API_KEY") || "";
  const ds = Deno.env.get("DEEPSEEK_API_KEY") || "";
  const oa = Deno.env.get("OPENAI_API_KEY") || "";
  const gm = Deno.env.get("GEMINI_API_KEY") || "";
  if (or) out.push({ name: "openrouter", endpoint: "https://openrouter.ai/api/v1/chat/completions", models: list("OPENROUTER_MODELS").length ? list("OPENROUTER_MODELS") : ["meta-llama/llama-3.3-70b-instruct:free", "qwen/qwen-2.5-72b-instruct:free"], apiKey: or, timeout });
  if (ds) out.push({ name: "deepseek", endpoint: "https://api.deepseek.com/chat/completions", models: [Deno.env.get("DEEPSEEK_MODEL") || "deepseek-chat"], apiKey: ds, timeout });
  if (oa) out.push({ name: "openai", endpoint: Deno.env.get("OPENAI_ENDPOINT") || "https://api.openai.com/v1/chat/completions", models: list("OPENAI_MODELS").length ? list("OPENAI_MODELS") : ["gpt-4o-mini"], apiKey: oa, timeout });
  if (gm) out.push({ name: "gemini", endpoint: Deno.env.get("GEMINI_ENDPOINT") || "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", models: list("GEMINI_MODELS").length ? list("GEMINI_MODELS") : ["gemini-2.0-flash", "gemini-1.5-flash"], apiKey: gm, timeout });
  return out;
}

export function hasProviders(): boolean {
  return providers().length > 0;
}

export function extractJson(text: string): any {
  const raw = String(text || "").trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { /* fall through */ }
  const a = raw.indexOf("{"), b = raw.lastIndexOf("}");
  if (a >= 0 && b > a) { try { return JSON.parse(raw.slice(a, b + 1)); } catch { return null; } }
  return null;
}

export async function askJson(system: string, user: string, timeout = 25000): Promise<{ json: any; provider: string }> {
  const errors: string[] = [];
  for (const p of providers(timeout)) {
    for (const model of p.models) {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), p.timeout);
      try {
        const res = await fetch(p.endpoint, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${p.apiKey}`,
            "Content-Type": "application/json",
            ...(p.name === "openrouter" ? { "HTTP-Referer": "https://ra10.co.uk", "X-Title": "RA10 EDU" } : {}),
          },
          body: JSON.stringify({ model, temperature: 0.2, response_format: { type: "json_object" }, messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
          signal: ctl.signal,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(String(data?.error?.message || data?.message || res.status));
        const json = extractJson(String(data?.choices?.[0]?.message?.content || ""));
        if (!json) throw new Error("no JSON in reply");
        return { json, provider: `${p.name}:${model}` };
      } catch (e) {
        errors.push(`${p.name}:${model} -> ${e instanceof Error ? e.message : String(e)}`);
      } finally {
        clearTimeout(t);
      }
    }
  }
  throw new Error(errors.length ? `All AI providers failed: ${errors.join(" | ")}` : "No AI providers configured");
}
