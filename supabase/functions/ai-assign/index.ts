import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// AI Assigner — Unit 3 Website Development assistant.
// Two modes:
//   "hint": free-form help/coaching for theory (Aim A/B) or coding help (Aim C) or task guidance (Aim D/assignment).
//   "mark": marks an uploaded/typed assignment submission against Pass/Merit/Distinction criteria for a task.
// Mirrors ai-mark's provider-fallback + auth pattern.

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

  if (openrouterKey) {
    const openrouterModels = (Deno.env.get("OPENROUTER_MODELS") || "")
      .split(",").map((m) => m.trim()).filter(Boolean);
    PROVIDERS.push({
      name: "openrouter",
      endpoint: "https://openrouter.ai/api/v1/chat/completions",
      models: openrouterModels.length > 0 ? openrouterModels : [
        "meta-llama/llama-3.3-8b-instruct:free",
        "qwen/qwen-2.5-7b-instruct:free",
        "google/gemma-2-9b-it:free",
      ],
      apiKey: openrouterKey,
      timeout: 14000,
    });
  }
  if (deepseekKey) {
    PROVIDERS.push({
      name: "deepseek",
      endpoint: "https://api.deepseek.com/chat/completions",
      models: [Deno.env.get("DEEPSEEK_MODEL") || "deepseek-chat"],
      apiKey: deepseekKey,
      timeout: 14000,
    });
  }
  if (openaiKey) {
    const openaiModels = (Deno.env.get("OPENAI_MODELS") || "")
      .split(",").map((m) => m.trim()).filter(Boolean);
    PROVIDERS.push({
      name: "openai",
      endpoint: Deno.env.get("OPENAI_ENDPOINT") || "https://api.openai.com/v1/chat/completions",
      models: openaiModels.length > 0 ? openaiModels : ["gpt-4o-mini"],
      apiKey: openaiKey,
      timeout: 14000,
    });
  }
  if (geminiKey) {
    const geminiModels = (Deno.env.get("GEMINI_MODELS") || "")
      .split(",").map((m) => m.trim()).filter(Boolean);
    PROVIDERS.push({
      name: "gemini",
      endpoint: Deno.env.get("GEMINI_ENDPOINT") || "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      models: geminiModels.length > 0 ? geminiModels : ["gemini-2.0-flash", "gemini-1.5-flash"],
      apiKey: geminiKey,
      timeout: 14000,
    });
  }
  if (PROVIDERS.length === 0) {
    console.warn("No AI providers configured (missing API keys)");
  }
}

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
      try { return JSON.parse(raw.slice(first, last + 1)); } catch { return null; }
    }
    return null;
  }
}

const SYSTEM_HINT = [
  "You are 'AI Assigner', a friendly but rigorous BTEC Level 3 IT Unit 3 (Website Development) mentor.",
  "You help students with: Learning Aim A (design principles, legislation, wireframes, sitemaps),",
  "Learning Aim B (website development technologies, tools, file types, testing/optimisation approaches),",
  "Learning Aim C (building a working website to a client brief using HTML/CSS/JavaScript),",
  "and their live assignment (writing to a Pearson-style client brief, hitting Pass/Merit/Distinction criteria).",
  "Rules:",
  "- NEVER simply write the student's whole assignment/website for them. Give hints, structure, checklists, code SNIPPETS (a few lines) and worked mini-examples, not full solutions to their specific brief.",
  "- If asked for code help unrelated to their live assignment (general HTML/CSS/JS learning), you MAY give fuller examples.",
  "- Be concise, use short paragraphs/bullet points, and always relate advice back to Pass/Merit/Distinction criteria when relevant.",
  "- If the student seems to be trying to get you to write their entire assignment, politely redirect them to work through it themselves with your guidance.",
].join("\n");

function buildHintPrompt(input: any) {
  const context = String(input?.context || "").slice(0, 4000);
  const message = String(input?.message || "").trim();
  const history = Array.isArray(input?.history) ? input.history.slice(-8) : [];
  return { context, message, history };
}

const SYSTEM_MARK = [
  "You are a strict but fair BTEC Level 3 IT Unit 3 (Website Development) internal assessor.",
  "You mark student assignment submissions against Pearson Pass/Merit/Distinction criteria for ONE task at a time.",
  "Output JSON only, no explanation outside the JSON.",
].join("\n");

function buildMarkPrompt(input: any) {
  const taskTitle = String(input?.taskTitle || "Task");
  const criteria = input?.criteria || {};
  const submission = String(input?.submission || "").slice(0, 12000);
  return [
    "Mark the student's submission below against the criteria for this task.",
    "Criteria (Pearson-style, JSON):",
    JSON.stringify(criteria),
    "",
    "Task: " + taskTitle,
    "",
    "Student submission (may include code, written explanation, or both):",
    submission,
    "",
    "Respond with JSON exactly in this shape:",
    "{",
    '  "grade": "Not yet met" | "Pass" | "Merit" | "Distinction",',
    '  "criteriaMet": [ { "code": "P1", "met": true, "comment": "short comment" }, ... for every criterion code given ],',
    '  "strengths": [ "2-4 short bullet points" ],',
    '  "improvements": [ "2-4 short, specific, actionable bullet points to reach the next grade" ],',
    '  "nextGradeFocus": "one or two sentences describing exactly what would push this to the next grade up",',
    '  "feedback": "one short paragraph overall summary, encouraging tone"',
    "}",
    "Output JSON only.",
  ].join("\n");
}

async function callProvider(provider: ProviderConfig, systemMsg: string, userMsg: string, jsonMode: boolean): Promise<any> {
  const modelErrors: string[] = [];
  for (const model of provider.models) {
    const payload: any = {
      model,
      temperature: jsonMode ? 0.2 : 0.5,
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: userMsg },
      ],
    };
    if (jsonMode) payload.response_format = { type: "json_object" };

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
            "X-Title": "RA10 AI Assigner",
          } : {}),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }).catch((err) => { throw new Error(`${provider.name} network error: ${err.message}`); });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const msg = String(data?.error?.message || data?.message || `${provider.name} returned ${response.status}`);
        throw new Error(msg);
      }
      const content = String(data?.choices?.[0]?.message?.content || "").trim();
      if (!content) throw new Error(`${provider.name} returned empty response`);
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

async function callAnyProvider(systemMsg: string, userMsg: string, jsonMode: boolean): Promise<{ content: string; provider: string }> {
  if (PROVIDERS.length === 0) throw new Error("No AI providers configured");
  const errors: string[] = [];
  for (const provider of PROVIDERS) {
    const result = await callProvider(provider, systemMsg, userMsg, jsonMode);
    if (result.success) return { content: result.content, provider: result.provider };
    errors.push(`${result.provider}: ${result.error}`);
  }
  throw new Error(`All providers failed: ${errors.join(" | ")}`);
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
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
    }

    const authHeader = req.headers.get("authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing bearer token" }), { status: 401, headers: corsHeaders });
    }
    const jwt = authHeader.slice(7);
    const body = await req.json().catch(() => ({}));
    const mode = String(body?.mode || "hint");

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
    const userId = String(userData.user.id || "");
    const profileRes = await supabase.from("profiles").select("tier, unlimited_credits").eq("id", userId).maybeSingle();
    if (profileRes.error || !profileRes.data) {
      return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404, headers: corsHeaders });
    }
    if (PROVIDERS.length === 0) {
      return new Response(JSON.stringify({ error: "AI provider keys are not configured" }), { status: 503, headers: corsHeaders });
    }

    if (mode === "mark") {
      const submission = String(body?.submission || "").trim();
      if (!submission) {
        return new Response(JSON.stringify({ error: "submission is required" }), { status: 400, headers: corsHeaders });
      }
      const prompt = buildMarkPrompt(body);
      const aiResponse = await callAnyProvider(SYSTEM_MARK, prompt, true);
      const parsed = extractJsonObject(aiResponse.content);
      if (!parsed || typeof parsed !== "object") throw new Error("AI response could not be parsed as JSON");

      const grade = ["Not yet met", "Pass", "Merit", "Distinction"].includes(parsed.grade) ? parsed.grade : "Not yet met";
      const criteriaMet = Array.isArray(parsed.criteriaMet)
        ? parsed.criteriaMet.map((c: any) => ({
            code: String(c?.code || "").trim(),
            met: !!c?.met,
            comment: String(c?.comment || "").trim(),
          }))
        : [];
      const strengths = Array.isArray(parsed.strengths) ? parsed.strengths.map((s: any) => String(s || "").trim()).filter(Boolean) : [];
      const improvements = Array.isArray(parsed.improvements) ? parsed.improvements.map((s: any) => String(s || "").trim()).filter(Boolean) : [];
      const result = {
        grade,
        criteriaMet,
        strengths,
        improvements,
        nextGradeFocus: String(parsed.nextGradeFocus || "").trim(),
        feedback: String(parsed.feedback || "").trim(),
      };
      return new Response(JSON.stringify({ ok: true, result, provider: aiResponse.provider }), { status: 200, headers: corsHeaders });
    }

    // default: "hint" mode — free-form coaching chat
    const { context, message, history } = buildHintPrompt(body);
    if (!message) {
      return new Response(JSON.stringify({ error: "message is required" }), { status: 400, headers: corsHeaders });
    }
    const historyText = history.length
      ? "\n\nRecent conversation:\n" + history.map((h: any) => `${h.role === "user" ? "Student" : "AI Assigner"}: ${String(h.content || "").slice(0, 600)}`).join("\n")
      : "";
    const userMsg = [
      context ? ("Context about what the student is currently doing:\n" + context) : "",
      historyText,
      "\n\nStudent's question/message:\n" + message,
    ].filter(Boolean).join("\n");

    const aiResponse = await callAnyProvider(SYSTEM_HINT, userMsg, false);
    return new Response(JSON.stringify({ ok: true, reply: aiResponse.content.trim(), provider: aiResponse.provider }), { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("ai-assign error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: getCorsHeaders(req.headers.get("origin") || "") },
    );
  }
});
