import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://ra10.co.uk",
  "https://www.ra10.co.uk",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
];

type ProviderConfig = {
  name: string;
  endpoint: string;
  models: string[];
  apiKey: string;
  timeout: number;
};

const PROVIDERS: ProviderConfig[] = [];

function initProviders() {
  const openrouterKey = Deno.env.get("OPENROUTER_API_KEY") || "";
  const deepseekKey = Deno.env.get("DEEPSEEK_API_KEY") || "";
  const openaiKey = Deno.env.get("OPENAI_API_KEY") || "";
  const geminiKey = Deno.env.get("GEMINI_API_KEY") || "";

  // Priority order: OpenRouter free (0 cost) → DeepSeek (cheaper) → OpenAI (expensive)
  if (openrouterKey) {
    const openrouterModels = (Deno.env.get("OPENROUTER_MODELS") || "")
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    PROVIDERS.push({
      name: "openrouter",
      endpoint: "https://openrouter.ai/api/v1/chat/completions",
      models: openrouterModels.length > 0
        ? openrouterModels
        : [
          "meta-llama/llama-3.3-8b-instruct:free",
          "qwen/qwen-2.5-7b-instruct:free",
          "google/gemma-2-9b-it:free",
        ],
      apiKey: openrouterKey,
      timeout: 12000,
    });
  }

  if (deepseekKey) {
    PROVIDERS.push({
      name: "deepseek",
      endpoint: "https://api.deepseek.com/chat/completions",
      models: [Deno.env.get("DEEPSEEK_MODEL") || "deepseek-chat"],
      apiKey: deepseekKey,
      timeout: 12000,
    });
  }

  if (openaiKey) {
    const openaiModels = (Deno.env.get("OPENAI_MODELS") || "")
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    PROVIDERS.push({
      name: "openai",
      endpoint: Deno.env.get("OPENAI_ENDPOINT") || "https://api.openai.com/v1/chat/completions",
      models: openaiModels.length > 0 ? openaiModels : ["gpt-4o-mini"],
      apiKey: openaiKey,
      timeout: 12000,
    });
  }

  if (geminiKey) {
    const geminiModels = (Deno.env.get("GEMINI_MODELS") || "")
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    PROVIDERS.push({
      name: "gemini",
      endpoint: Deno.env.get("GEMINI_ENDPOINT") || "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      models: geminiModels.length > 0 ? geminiModels : ["gemini-2.0-flash", "gemini-1.5-flash"],
      apiKey: geminiKey,
      timeout: 12000,
    });
  }

  if (PROVIDERS.length === 0) {
    console.warn("No AI providers configured (missing API keys)");
  }
}

type MarkResult = {
  source: "ai";
  earned: number;
  max: number;
  strengths: string[];
  improvements: string[];
  feedback: string;
};

function getCorsHeaders(origin: string) {
  const isAllowed = ALLOWED_ORIGINS.includes(origin);
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };
}

function safeNum(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function extractJsonObject(text: string): any {
  const raw = String(text || "").trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    const first = raw.indexOf("{");
    const last = raw.lastIndexOf("}");
    if (first >= 0 && last > first) {
      const sliced = raw.slice(first, last + 1);
      try {
        return JSON.parse(sliced);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function ensureResultShape(raw: any, marksMax: number): MarkResult {
  const max = clamp(Math.round(safeNum(raw?.max, marksMax)), 1, Math.max(1, marksMax));
  const earned = clamp(Math.round(safeNum(raw?.earned, 0)), 0, max);
  
  const strengths = Array.isArray(raw?.strengths) 
    ? raw.strengths.map((s: any) => String(s || "").trim()).filter((s: string) => s.length > 0)
    : [];
  
  const improvements = Array.isArray(raw?.improvements) 
    ? raw.improvements.map((i: any) => String(i || "").trim()).filter((i: string) => i.length > 0)
    : [];

  return {
    source: "ai",
    earned,
    max,
    strengths,
    improvements,
    feedback: String(raw?.feedback || "").trim(),
  };
}

function buildPrompt(question: any, answer: string, learnedHints: string[]) {
  const markScheme = question?.mark_scheme || {};

  return [
    "You are a BTEC exam examiner. Mark this answer fairly based on the mark scheme provided.",
    "Give your response in simple JSON with exactly these fields:",
    "{",
    '  "earned": <number out of the max marks>,',
    '  "max": <total marks available>,',
    '  "strengths": <concise array of 2-3 things the student did well>,',
    '  "improvements": <concise array of 2-3 specific areas to improve>,',
    '  "feedback": <one sentence summary of the mark and key feedback>',
    "}",
    "",
    "Mark scheme details:",
    JSON.stringify(markScheme),
    "",
    "Question: " + String(question?.question || ""),
    "",
    "Student answer: " + String(answer || ""),
    "",
    "Output JSON only, no explanation.",
  ].filter(Boolean).join("\n");
}

async function callProvider(provider: ProviderConfig, prompt: string): Promise<any> {
  const modelErrors: string[] = [];
  for (const model of provider.models) {
    const payload = {
      model,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a strict but fair examiner. Output JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), provider.timeout);

    try {
      const response = await fetch(provider.endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${provider.apiKey}`,
          "Content-Type": "application/json",
          ...(provider.name === "openrouter" ? {
            "HTTP-Referer": "https://ra10.co.uk",
            "X-Title": "RA10 AI Marking",
          } : {}),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }).catch((err) => {
        throw new Error(`${provider.name} network error: ${err.message}`);
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const msg = String(data?.error?.message || data?.message || `${provider.name} returned ${response.status}`);
        throw new Error(msg);
      }

      const content = String(data?.choices?.[0]?.message?.content || "").trim();
      if (!content) {
        throw new Error(`${provider.name} returned empty response`);
      }

      return { success: true, content, provider: `${provider.name}:${model}` };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      modelErrors.push(`${model} -> ${message}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return { success: false, error: modelErrors.join(" || "), provider: provider.name };
}

async function callAnyProvider(prompt: string): Promise<{ content: string; provider: string }> {
  if (PROVIDERS.length === 0) {
    throw new Error("No AI providers configured");
  }

  const errors: string[] = [];
  for (const provider of PROVIDERS) {
    const result = await callProvider(provider, prompt);
    if (result.success) {
      console.log(`AI mark succeeded with provider: ${result.provider}`);
      return { content: result.content, provider: result.provider };
    }
    errors.push(`${result.provider}: ${result.error}`);
  }

  const errorMsg = `All providers failed: ${errors.join(" | ")}`;
  throw new Error(errorMsg);
}

export default Deno.serve(async (req: Request) => {
  initProviders();
  const origin = req.headers.get("origin") || "";
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: corsHeaders,
      });
    }

    const authHeader = req.headers.get("authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing bearer token" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const jwt = authHeader.slice(7);
    const body = await req.json().catch(() => ({}));
    const question = body?.question || null;
    const answer = String(body?.answer || "").trim();

    if (!question || !answer) {
      return new Response(JSON.stringify({ error: "question and answer are required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!supabaseUrl || !serviceRole) {
      return new Response(JSON.stringify({ error: "Missing Supabase configuration" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const supabase = createClient(supabaseUrl, serviceRole);
    const { data: userData, error: userError } = await supabase.auth.getUser(jwt);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const userId = String(userData.user.id || "");
    const profileRes = await supabase.from("profiles").select("tier, unlimited_credits").eq("id", userId).maybeSingle();
    if (profileRes.error || !profileRes.data) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    if (PROVIDERS.length === 0) {
      return new Response(JSON.stringify({ error: "AI provider keys are not configured" }), {
        status: 503,
        headers: corsHeaders,
      });
    }

    const marksMax = clamp(Math.round(safeNum(question?.marks, 1)), 1, 20);
    const prompt = buildPrompt(question, answer, []);

    const aiResponse = await callAnyProvider(prompt);
    const parsed = extractJsonObject(aiResponse.content);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("AI response could not be parsed as JSON");
    }

    const result = ensureResultShape(parsed, marksMax);

    return new Response(JSON.stringify({ ok: true, result, provider: aiResponse.provider }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("ai-mark error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: getCorsHeaders(req.headers.get("origin") || "") },
    );
  }
});
