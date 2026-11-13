import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { BUSINESS_SYSTEM, buildBusinessPrompt, businessPostProcess, isALevelBusiness } from "./business_examiner.ts";
import { BUSINESS_2026_SYSTEM, buildBusiness2026Prompt, business2026PostProcess, is2026Business } from "./business_2026_examiner.ts";
import { BUSINESS_BTEC_SYSTEM, buildBusinessBtecPrompt, businessBtecPostProcess, isBusinessBtec } from "./business_btec_examiner.ts";
import { SPORT_U2_SYSTEM, buildSportUnit2Prompt, sportUnit2PostProcess, isSportUnit2Task } from "./sport_unit2_examiner.ts";
import { PSYCHOLOGY_SYSTEM, buildPsychologyPrompt, psychologyPostProcess, isPsychology } from "./psychology_examiner.ts";
import { EDEXCEL_BUSINESS_SYSTEM, buildEdexcelBusinessPrompt, edexcelBusinessPostProcess, isEdexcelBusiness } from "./edexcel_business_examiner.ts";
import { IT_U2_SYSTEM, buildItUnit2Prompt, itUnit2PostProcess, isItUnit2 } from "./it_unit2_examiner.ts";
import { IT_U14_SYSTEM, buildItUnit14Prompt, itUnit14PostProcess, isItUnit14 } from "./it_unit14_examiner.ts";
import { requireTermsAccepted } from "../_shared/legal.ts";

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
  // Called on every request: start from an empty list, or a warm instance keeps appending duplicate providers.
  PROVIDERS.length = 0;
  const openrouterKey = Deno.env.get("OPENROUTER_API_KEY") || "";
  const deepseekKey = Deno.env.get("DEEPSEEK_API_KEY") || "";
  const openaiKey = Deno.env.get("OPENAI_API_KEY") || "";
  const geminiKey = Deno.env.get("GEMINI_API_KEY") || "";

  // Business marking uses OpenAI/Gemini first; OpenRouter is the preferred fallback.
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

  const result: MarkResult = {
    source: "ai",
    earned,
    max,
    strengths,
    improvements,
    feedback: String(raw?.feedback || "").trim(),
  };
  // Optional richer fields (used by the A-level Business examiner).
  const extra: Record<string, unknown> = {};
  if (Number.isFinite(Number(raw?.level))) extra.level = Math.round(Number(raw.level));
  if (raw?.level_marks) extra.level_marks = String(raw.level_marks);
  if (raw?.ao_feedback && typeof raw.ao_feedback === "object") extra.ao_feedback = raw.ao_feedback;
  if (Array.isArray(raw?.annotations)) extra.annotations = raw.annotations.slice(0, 12);
  if (Array.isArray(raw?.next_level)) extra.next_level = raw.next_level.map((x: unknown) => String(x)).slice(0, 4);
  if (raw?.examiner_comment) extra.examiner_comment = String(raw.examiner_comment);
  if (raw?.calculation_check) extra.calculation_check = String(raw.calculation_check);
  return Object.assign(result, extra);
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

// rotate: start from the n-th provider in the ranked order (the ensemble's second opinion uses a different model).
// only: restrict to these provider names (the ensemble never falls back to small free models).
type CallOptions = { system?: string; timeout?: number; maxTokens?: number; image?: string; temperature?: number; rotate?: number; only?: string[] };

// A drawn / photographed diagram arrives as a data URL; only small PNG / JPEG / WebP images are accepted.
function validImage(v: unknown): string {
  const s = typeof v === "string" ? v : "";
  if (!s) return "";
  if (!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(s)) return "";
  return s.length <= 3_000_000 ? s : "";
}

const DIAGRAM_NOTE = [
  "",
  "IMPORTANT: the student's diagram is attached as an image. Mark the diagram itself against the mark scheme.",
  "Read every device, symbol, connection, arrow, label and annotation in the image. For flowcharts check the symbols (terminators, processes, decisions with Yes/No branches) and that the logic is correct.",
  "Any typed text is extra notes that go with the diagram. If the image is blank, unreadable or unrelated to the question, award marks only for what can be credited and say so in the feedback.",
].join("\n");

async function callProvider(provider: ProviderConfig, prompt: string, opts: CallOptions = {}): Promise<any> {
  const modelErrors: string[] = [];
  for (const model of provider.models) {
    const payload: Record<string, unknown> = {
      model,
      temperature: opts.temperature ?? (opts.system ? 0 : 0.1),
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: opts.system || "You are a strict but fair examiner. Output JSON only.",
        },
        {
          role: "user",
          content: opts.image
            ? [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: opts.image } }]
            : prompt,
        },
      ],
    };

    if (opts.maxTokens) payload.max_tokens = opts.maxTokens;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), opts.timeout || provider.timeout);

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

async function callAnyProvider(prompt: string, opts: CallOptions = {}, preferStrong = false): Promise<{ content: string; provider: string }> {
  if (PROVIDERS.length === 0) {
    throw new Error("No AI providers configured");
  }

  // Level-of-response marking needs a capable model: try paid/stronger providers before
  // small free OpenRouter models when preferStrong is set.
  const rank: Record<string, number> = { openai: 0, gemini: 1, openrouter: 2, deepseek: 3 };
  // Images need a vision model: DeepSeek's chat API has none, and the strongest providers go first.
  let pool = opts.image ? PROVIDERS.filter((p) => p.name !== "deepseek") : PROVIDERS;
  if (opts.only) pool = pool.filter((p) => opts.only!.includes(p.name));
  if (pool.length === 0) throw new Error("No AI provider that can read images is configured");
  let ordered = preferStrong || opts.image ? pool.slice().sort((a, b) => (rank[a.name] ?? 9) - (rank[b.name] ?? 9)) : pool;
  const rot = (opts.rotate || 0) % ordered.length;
  if (rot) ordered = ordered.slice(rot).concat(ordered.slice(0, rot));

  const errors: string[] = [];
  for (const provider of ordered) {
    const result = await callProvider(provider, prompt, opts);
    if (result.success) {
      console.log(`AI mark succeeded with provider: ${result.provider}`);
      return { content: result.content, provider: result.provider };
    }
    errors.push(`${result.provider}: ${result.error}`);
  }

  const errorMsg = `All providers failed: ${errors.join(" | ")}`;
  throw new Error(errorMsg);
}

// ── Ensemble marking ────────────────────────────────────────────────────────────────────────────
// AI_MARK_ENSEMBLE=off turns it off (halves AI cost for long answers).
const ENSEMBLE_ON = () => (Deno.env.get("AI_MARK_ENSEMBLE") || "on").toLowerCase() !== "off";

async function oneOpinion(prompt: string, opts: CallOptions, post: (raw: any) => any): Promise<{ parsed: any; provider: string }> {
  const r = await callAnyProvider(prompt, opts, true);
  const raw = extractJsonObject(r.content);
  if (!raw || typeof raw !== "object") throw new Error("AI response could not be parsed as JSON");
  return { parsed: post(raw), provider: r.provider };
}

async function markWithEnsemble(prompt: string, opts: CallOptions, post: (raw: any) => any, max: number): Promise<{ parsed: any; provider: string }> {
  // A second opinion from a different strong model when one is configured; otherwise a second sample of the same one.
  const STRONG = ["openai", "gemini"];
  const strong = PROVIDERS.filter((p) => STRONG.includes(p.name)).map((p) => p.name);
  if (!strong.length) return await oneOpinion(prompt, opts, post);   // no capable second model: one opinion only
  const second: CallOptions = strong.length >= 2 ? { ...opts, rotate: 1, only: STRONG } : { ...opts, temperature: 0.4, only: STRONG };
  const runs = (await Promise.allSettled([oneOpinion(prompt, opts, post), oneOpinion(prompt, second, post)]))
    .filter((r): r is PromiseFulfilledResult<{ parsed: any; provider: string }> => r.status === "fulfilled").map((r) => r.value);
  if (!runs.length) return await oneOpinion(prompt, opts, post);   // both failed: one ordinary attempt (throws on failure)
  if (runs.length === 1) return runs[0];
  const mark = (r: { parsed: any }) => Math.max(0, Math.min(max, Math.round(Number(r.parsed?.earned) || 0)));
  // Opinions more than a level apart: ask a third time and take the median.
  const spread = Math.abs(mark(runs[0]) - mark(runs[1]));
  if (spread > Math.max(2, Math.round(max / 5))) {
    try { runs.push(await oneOpinion(prompt, { ...opts, temperature: 0.2, only: STRONG }, post)); } catch (_) { /* two opinions still stand */ }
  }
  const marks = runs.map(mark).sort((a, b) => a - b);
  let final: number;
  if (marks.length === 3) final = marks[1];
  else {
    const mean = (marks[0] + marks[1]) / 2;
    // A .5 tie goes the way of the primary (strongest) model.
    final = Number.isInteger(mean) ? mean : (mark(runs[0]) > mean ? Math.ceil(mean) : Math.floor(mean));
  }
  // Use the written feedback of the opinion closest to the final mark, re-banded to that mark.
  const best = runs.slice().sort((a, b) => Math.abs(mark(a) - final) - Math.abs(mark(b) - final))[0];
  const merged = { ...best.parsed, earned: final, level: undefined, level_marks: undefined, band: undefined };
  const reposted = post(merged);
  // Keep the explanation honest when the mark moved away from what that opinion said.
  if (mark(best) !== final && reposted.examiner_comment) {
    reposted.examiner_comment = String(reposted.examiner_comment).replace(/\bLevel \d\b/, "Level " + (reposted.level ?? ""));
  }
  return { parsed: reposted, provider: runs.map((r) => r.provider).join(" + ") };
}

// ── AI usage limits (supabase/sql/ai-usage.sql) ──────────────────────────────────────────────
// One use is taken BEFORE any AI provider is called and refunded if marking fails. Premium and
// EDU plans are never counted. If the usage SQL has not been applied yet we fail open (allow),
// so deploying this function first never blocks marking.
type UsageJson = Record<string, any>;
type UsageCtx = { supabase: any; userId: string; eventId: number | null };

async function consumeUsage(supabase: any, userId: string): Promise<UsageJson | null> {
  const { data, error } = await supabase.rpc("ai_usage_consume", { p_user: userId, p_feature: "ai_mark" });
  if (error) {
    console.warn("ai-mark: usage check unavailable, allowing request:", error.message);
    return null;
  }
  return data as UsageJson;
}

async function refundUsage(ctx: UsageCtx | null): Promise<UsageJson | null> {
  if (!ctx || !ctx.eventId) return null;
  const { data, error } = await ctx.supabase.rpc("ai_usage_refund", { p_user: ctx.userId, p_event_id: ctx.eventId });
  if (error) console.warn("ai-mark: usage refund failed:", error.message);
  ctx.eventId = null;
  return error ? null : (data as UsageJson);
}

function usageLimitMessage(usage: UsageJson): string {
  const label = String(usage?.label || "AI Examiner");
  return usage?.blocked_by === "day"
    ? `You've reached today's ${label} limit.`
    : `You've reached this hour's ${label} limit.`;
}

export default Deno.serve(async (req: Request) => {
  initProviders();
  const origin = req.headers.get("origin") || "";
  const corsHeaders = getCorsHeaders(origin);
  let usageCtx: UsageCtx | null = null;

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
    const image = validImage(body?.image);
    if (body?.image && !image) {
      return new Response(JSON.stringify({ error: "The diagram image is too large or not a PNG/JPEG. Please try a smaller picture." }), {
        status: 400,
        headers: corsHeaders,
      });
    }
    const answer = String(body?.answer || "").trim() || (image ? "(The answer is the attached diagram.)" : "");

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
    const termsDenied = await requireTermsAccepted(supabase, userId, corsHeaders);
    if (termsDenied) return termsDenied;
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

    // Usage limits: take one use now (server-side, synced per account).
    const usage = await consumeUsage(supabase, userId);
    if (usage && usage.allowed === false) {
      return new Response(JSON.stringify({ error: usageLimitMessage(usage), code: "usage_limit", usage }), {
        status: 429,
        headers: corsHeaders,
      });
    }
    usageCtx = { supabase, userId, eventId: usage && usage.event_id ? Number(usage.event_id) : null };

    const marksMax = clamp(Math.round(safeNum(question?.marks, 1)), 1, 60);
    const edx = isEdexcelBusiness(question);
    const psych = !edx && isPsychology(question);
    const b2026 = !edx && !psych && is2026Business(question);
    const business = !edx && !psych && !b2026 && isALevelBusiness(question);
    const sportU2 = !edx && !psych && !business && !b2026 && isSportUnit2Task(question);
    const btec = !edx && !psych && !business && !b2026 && !sportU2 && isBusinessBtec(question);
    const it2 = !edx && !psych && !business && !b2026 && !sportU2 && !btec && isItUnit2(question);
    const it14 = !edx && !psych && !business && !b2026 && !sportU2 && !btec && !it2 && isItUnit14(question);
    const basePrompt = edx ? buildEdexcelBusinessPrompt(question, answer) : psych ? buildPsychologyPrompt(question, answer) : b2026 ? buildBusiness2026Prompt(question, answer) : business ? buildBusinessPrompt(question, answer) : sportU2 ? buildSportUnit2Prompt(question, answer) : btec ? buildBusinessBtecPrompt(question, answer) : it2 ? buildItUnit2Prompt(question, answer, !!image) : it14 ? buildItUnit14Prompt(question, answer) : buildPrompt(question, answer, []);
    // The IT module writes its own diagram instructions.
    const prompt = image && !it2 ? basePrompt + "\n" + DIAGRAM_NOTE : basePrompt;

    const callOpts: CallOptions | null = edx ? { system: EDEXCEL_BUSINESS_SYSTEM, timeout: 50000, maxTokens: 2200, image }
      : psych ? { system: PSYCHOLOGY_SYSTEM, timeout: 50000, maxTokens: 2200, image }
      : b2026 ? { system: BUSINESS_2026_SYSTEM, timeout: 50000, maxTokens: 2200, image }
      : business ? { system: BUSINESS_SYSTEM, timeout: 45000, maxTokens: 1800, image }
      : sportU2 ? { system: SPORT_U2_SYSTEM, timeout: 45000, maxTokens: 1800, image }
      : btec ? { system: BUSINESS_BTEC_SYSTEM, timeout: 55000, maxTokens: 2400, image }
      : it2 ? { system: IT_U2_SYSTEM, timeout: 45000, maxTokens: 1800, image }
      : it14 ? { system: IT_U14_SYSTEM, timeout: 55000, maxTokens: 2400, image }
      : null;
    const post = (raw: any) => edx ? edexcelBusinessPostProcess(raw, question, answer)
      : psych ? psychologyPostProcess(raw, question, answer)
      : b2026 ? business2026PostProcess(raw, question, answer)
      : business ? businessPostProcess(raw, question, answer)
      : sportU2 ? sportUnit2PostProcess(raw, question)
      : btec ? businessBtecPostProcess(raw, question)
      : it2 ? itUnit2PostProcess(raw, question, answer, !!image)
      : it14 ? itUnit14PostProcess(raw, question, answer)
      : raw;

    let parsed: any;
    let aiResponse: { content: string; provider: string };
    // Levels-marked long answers (AQA 7132 / 7138, IT Unit 2) get a second, independent opinion: single model
    // runs scatter by a level or more on the same answer, and two opinions combined track examiners more closely.
    // IT Unit 14 set-task activities (8–20 marks) are holistic band judgements, so they get the second opinion too.
    const it14Activity = it14 && Array.isArray(question?.mark_scheme?.afs) && question.mark_scheme.afs.length > 0;
    const ensemble = !!callOpts && !image && ((marksMax >= 9 && (business || b2026 || it2)) || it14Activity) && ENSEMBLE_ON();
    if (ensemble && callOpts) {
      const r = await markWithEnsemble(prompt, callOpts, post, marksMax);
      parsed = r.parsed;
      aiResponse = { content: "", provider: r.provider };
    } else {
      aiResponse = callOpts ? await callAnyProvider(prompt, callOpts, true) : await callAnyProvider(prompt, image ? { timeout: 50000, image } : {});
      parsed = extractJsonObject(aiResponse.content);
      if (!parsed || typeof parsed !== "object") {
        throw new Error("AI response could not be parsed as JSON");
      }
      parsed = post(parsed);
    }

    const result = ensureResultShape(parsed, marksMax);

    // XP v3 (xp-v3.sql): record the real score so AI Examiner XP is based on what was actually marked.
    try {
      await supabase.rpc("xp_record_mark", {
        p_user: userId,
        p_ref: String(question?.id ?? "").slice(0, 160),
        p_score: Number(result.earned) || 0,
        p_max: Number(result.max) || marksMax,
      });
    } catch (_) { /* XP is a bonus; marking must never fail because of it */ }

    const usageOut = usage ? (({ event_id: _e, ...rest }) => rest)(usage) : null;
    return new Response(JSON.stringify({ ok: true, result, provider: aiResponse.provider, usage: usageOut }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("ai-mark error:", error);
    // Marking failed after a use was taken: give it back so failures never cost the learner.
    const refunded = await refundUsage(usageCtx).catch(() => null);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error", usage: refunded }),
      { status: 500, headers: getCorsHeaders(req.headers.get("origin") || "") },
    );
  }
});
