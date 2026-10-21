import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireTermsAccepted } from "../_shared/legal.ts";

// AI Assigner / AI Helper — revision assistant across all RA10 units.
// Two modes:
//   "hint": free-form help/coaching, unit-aware (see UNIT_PROFILES) so it always
//           answers in the correct subject context.
//   "mark": marks an uploaded/typed assignment submission for Unit 3/4 tasks.
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

const UNIT_PROFILES: Record<string, string> = {
  // ---------------- BTEC Level 3 IT AAQ ----------------
  "it-aaq-unit-1": [
    "BTEC Level 3 IT (AAQ 2025) Unit 1: Information Technology Systems.",
    "ASSESSMENT TYPE: EXTERNALLY ASSESSED WRITTEN EXAM (set exam). Two hours, 90 marks, four questions mapping to Learning Aims A–F. NOT an assignment or coursework.",
    "Learning Aims:",
    "- A: Digital devices & IT systems — functions/use of devices (PCs, mobile, servers, embedded/IoT), peripherals, software types, OS types and roles, user interfaces, open-source vs proprietary, choosing/upgrading systems, emerging tech & AI.",
    "- B: Transmitting data — connectivity (Bluetooth/USB/Wi-Fi/Ethernet), networks (PAN/LAN/WAN/VPN), topologies (star/ring/bus), protocols (HTTP/HTTPS, SMTP/POP/IMAP), bandwidth/latency, compression (lossy/lossless), codecs.",
    "- C: Operating online — online systems, cloud computing (private/public/hybrid; IaaS/PaaS/SaaS), remote working (VPN/remote desktop), online communities (social media, blog, wiki, forum), selection factors.",
    "- D: Protecting data & information — external threats (malware, hacking, DDoS, social engineering), internal threats, impacts of loss; protection (permissions, backup, passwords/MFA, biometrics, antivirus, firewalls, encryption).",
    "- E: Impact of IT systems — online services (retail, banking, education, booking), data manipulation, accuracy (verification/validation), UI characteristics/accessibility.",
    "- F: Issues — moral & ethical (privacy, environmental, acceptable use), legal (Computer Misuse Act, GDPR/DPA, Copyright).",
    "Common command verbs: State, Give, Identify, Name, Describe, Explain, Discuss, Evaluate, Draw (diagram/flowchart).",
    "Exam questions are scenario-based with 1–12 mark items; a diagram/flowchart question (draw a network or a process) usually appears. Mark answers against Pearson-style mark schemes / levels-based descriptors for longer questions.",
  ].join("\n"),

  "it-aaq-unit-2": [
    "BTEC Level 3 IT (AAQ 2025) Unit 2: Cyber Security and Incident Management.",
    "ASSESSMENT TYPE: EXTERNALLY ASSESSED WRITTEN EXAM (set exam). NOT an assignment, NOT coursework. Do NOT describe this unit as a 'set assignment' or 'task-based'.",
    "Learning Aims A–D:",
    "- A: Cyber security threats, vulnerabilities & protection — internal threats (employee sabotage, accidental disclosure); external threats (malware: viruses/worms/trojans/ransomware/spyware/adware; hacking: DoS/DDoS, browser hijack, data theft; social engineering: phishing/vishing/smishing/whaling/spear phishing/DNS spoofing/pretexting; physical: tailgating/shoulder surfing/theft); impact of a threat (operational/financial/reputational/IP loss); system vulnerabilities (network, organisational, software, mobile, people/process, cloud/IoT); vulnerability assessment (port scanners, network mappers, pen testing); passive risk management (transfer/avoidance/acceptance); legislation (GDPR, Computer Misuse Act 1990); protection measures (physical security, backup, antivirus, firewalls, authentication/MFA, access controls DAC/RBAC, encryption AES/RSA, WLAN protection MAC filtering/WPA2-3, security by design, ISO 27000).",
    "- B: Networking architectures & principles — network types (LAN/WLAN/WAN/SAN/PAN, intranet/extranet/cloud), topologies (star, extended star, mesh, bus/ring), architecture (peer-to-peer, client/server, thin client), trends (virtualisation, cloud, BYOD, SDN, IoT, remote working); components (switches, routers, gateways, APs, media incl. fibre/Li-Fi); TCP/IP (4-layer model, TLS, ports, NAT, IPv4/IPv6, RFC1918, APIPA, loopback); infrastructure services (DNS, DHCP, directory/authentication services, routing, remote access/VPN).",
    "- C: Cyber security documentation — internal policies (cyber security policy Plan-Do-Check-Act/ISO 27001, internet/email use, password, staff responsibilities/training), security audits, backup policy, data protection policy (DPO, GDPR principles), incident response policy, disaster recovery policy, external services policy.",
    "- D: Forensic procedures — forensic collection of evidence (devices, live forensics, network forensics, documenting the scene, chain of custody), systematic analysis (snapshots, hashing, recording findings, visual evidence, false positives), assessing findings (indicators of compromise), writing security reports.",
    "Answer in EXAM style: relate to command verbs (State/Identify/Describe/Explain/Evaluate/Compare) and Pearson-style mark schemes. Be accurate with technical terminology and link answers back to the learning aims.",
  ].join("\n"),

  "it-aaq-unit-3": [
    "BTEC Level 3 IT (AAQ) Unit 3: Website Development.",
    "ASSESSMENT TYPE: INTERNALLY ASSESSED Pearson Set Assignment (coursework, 3 tasks). NOT an exam.",
    "- Task 1 (Aim A): research how existing websites meet purpose & audience, legal/ethical constraints, content ideas, annotated SITE MAP meeting every client requirement.",
    "- Task 2 (Aim B): WIREFRAMES, VISUAL DESIGNS (colour palette, branding, typography), page MOCKUPS, review/improve, ASSET MANAGEMENT (folder structure, naming, asset log).",
    "- Task 3 (Aim C): build with HTML/CSS/JS, accessibility (WCAG, semantic HTML, alt text, contrast, keyboard nav), responsive design, test (test plan expected vs actual) & usability testing, self-review & refine.",
    "Key content: purpose (eCommerce/information/promotion/entertainment); audience (personas); page layout (F-shaped, Z-shaped, grid, visual hierarchy); navigation (sticky, vertical, hamburger); content & calls-to-action; typography/colour; UX & motion (micro-interactions, animation, parallax); dynamic sites; cross-browser compatibility; SEO.",
    "Legal/ethical: Copyright (CDPA 1988), data protection (UK GDPR), digital accessibility (Equality Act 2010, WCAG).",
    "Coach the student — do NOT write their whole assignment/website. Give hints, structure, checklists, code snippets and worked mini-examples.",
  ].join("\n"),

  "it-aaq-unit-4": [
    "BTEC Level 3 IT (AAQ) Unit 4: Relational Database Development.",
    "ASSESSMENT TYPE: INTERNALLY ASSESSED Pearson Set Assignment (coursework, 3 tasks). NOT an exam.",
    "- Task 1 (Aim A): RDBMS types, data structure concepts, relational algebra, keys, integrity constraints, entity relationships, SQL, NORMALISATION (1NF/2NF/3NF), scoping to a brief.",
    "- Task 2 (Aim B): ERDs (entities, relationships, cardinality, crow's-foot notation), DATA DICTIONARY, design documentation, UI design, review & refine designs, test plan.",
    "- Task 3 (Aim C): build the database (create tables, keys, relationships), SQL (SELECT/INSERT/UPDATE/DELETE, joins, aggregate queries), TEST, REVIEW & OPTIMISE.",
    "Coach the student — do NOT write their whole assignment. Give hints, structure, checklists, SQL snippets and worked examples, linked to Pass/Merit/Distinction.",
  ].join("\n"),

  // ---------------- BTEC Level 3 Business ----------------
  "business-unit-2": [
    "BTEC Level 3 Business Unit 2: Developing a Marketing Campaign (31489H).",
    "ASSESSMENT TYPE: EXTERNALLY ASSESSED set task, 70 marks: Part A research pack (2 hours prep, two sides of A4 notes) then a 3-hour supervised Part B on a computer. Activity 1 = rationale (34 marks); Activity 2 = campaign plan (36 marks). Marked on 8 assessment foci: AF1 structure 4, AF2 aims/objectives 8, AF3 research & analysis 12, AF4 justification 10, AF5 marketing mix/message/media 20, AF6 budget 8, AF7 timescale 4, AF8 presentation 4. Content areas: A principles/purposes of marketing, aims/objectives, mass/niche markets, segmentation, branding, internal and external (PESTLE) influences; B research (primary/secondary, validity, reliability, currency, product life cycle); C SWOT/PESTLE, 7Ps marketing mix, message, media, budget, timescale, evaluation, appropriateness.",
    "Coach the student: objectives need numbers and dates with a rationale; analyse (not copy) both primary and secondary data and evaluate reliability/validity; SWOT/PESTLE must be turned into actions; cover all 7Ps in context (people = employees, not the target market); itemise the budget in £ including wider costs; give a dated timescale with reasons. Do NOT write the whole answer for them.",
  ].join("\n"),

  "business-unit-3": [
    "BTEC Level 3 Business Unit 3: Personal and Business Finance (31463H).",
    "ASSESSMENT TYPE: EXTERNALLY ASSESSED WRITTEN EXAM, 2 hours (80 marks from 2021; 100 before). Section A personal finance (about one third), Section B business finance. Formulae are not given. Content areas: A personal finance (functions of money, ways to pay, current accounts, borrowing, saving/investing, insurance); B the personal finance sector (institutions, FCA/FOS/FSCS, advice, IFA vs IVA); C purpose of accounting, income and expenditure; D sources of business finance; E cash flow forecasts and break-even/margin of safety; F statements of comprehensive income and financial position, depreciation, ratios (gross profit margin, mark-up, profit margin, ROCE, current/liquid ratios, receivable/payable days, inventory turnover) and their limitations.",
    "Coach the student: learn every formula; show working and use the own-figure rule; calculate ratios (1.2:1) rather than presenting two figures; explain questions need a point + linked development; 6-12 mark questions need application to the scenario, balance and a judgement; compare every option in a table. Do NOT write full answers for them.",
  ].join("\n"),

  "business-unit-6": [
    "BTEC Level 3 Business Unit 6: Principles of Management (31588H).",
    "ASSESSMENT TYPE: EXTERNALLY ASSESSED set task, 88 marks: Part A case study and data (about 6 hours preparation, no notes allowed in Part B), Part B 3 hours on a computer: Activity 1 report (44 marks, size 12 font) and Activity 2 presentation with speaker notes (44 marks). Each activity has four assessment foci: data analysis & interpretation 12, key principles of management 12, suggested alternative management approaches 12, structure/presentation 8. Content: management/leadership functions and styles, business culture (Handy, Schein, Hofstede), skills and theories (Fayol, Weber, Blake & Mouton), HR and HR planning, motivation (Maslow, Herzberg, Taylor, Mayo), training and appraisal, managing change (Lewin, Kotter), quality management (BSI/ISO, quality circles, lean, six sigma, kaizen, audits).",
    "Coach the student: use the figures in the case tables, link every theory to the business goals, recommend specific realistic actions with benefits and drawbacks, and structure the report/presentation clearly. Do NOT write the whole answer for them.",
  ].join("\n"),

  "business-unit-7": [
    "BTEC Level 3 Business Unit 7: Business Decision Making (31589H), Part S.",
    "ASSESSMENT TYPE: EXTERNALLY ASSESSED 3-hour set task on a computer, 70 marks: Activity 1 report on two options (52 marks) and Activity 2 presentation with speaker notes (18 marks). Foci: AF1 data selection 8, AF2 resources 8, AF3 financial forecasting 8, AF4 key factors/risks/alternatives using at least two decision tools 16, AF5 supported decision 8, AF6 structure 4, AF7 overview 6, AF8 pitch 6, AF9 design 6. Content: human/physical/financial/time resources, gross and net profit and margins, break-even and margin of safety, ROCE, cash flow, SWOT, PESTLE, Porter's five forces, 5C model, risks and alternatives, recommendations.",
    "Coach the student: analyse BOTH options throughout, show financial working (own-figure rule), use two or more tools, link to the client's aims and give one justified recommendation including why the other is rejected. Do NOT write the whole answer for them.",
  ].join("\n"),

  // ---------------- BTEC Level 3 Sport ----------------
  "sport-unit-1": [
    "BTEC Level 3 Sport Unit 1: Anatomy and Physiology.",
    "ASSESSMENT TYPE: EXTERNALLY ASSESSED WRITTEN EXAM. NOT coursework.",
    "Learning Aims: A — Skeletal system (bones, joints, cartilage, ligaments, movement); B — Muscular system (major muscles, fibre types, contractions, adaptations); C — Respiratory system (mechanics, gas exchange, adaptations); D — Cardiovascular system (heart, vessels, blood, adaptations); E — Energy systems (ATP-PC, lactate, aerobic).",
    "Be precise with anatomical terminology and link structure to sport performance.",
  ].join("\n"),

  "sport-unit-2": [
    "BTEC Level 3 Sport Unit 2: Fitness Training and Programming for Health, Sport and Well-being.",
    "ASSESSMENT TYPE: EXTERNALLY ASSESSED with a scenario (set task). NOT coursework.",
    "Learning Aims: A — Lifestyle factors & health; B — Screening processes (health/physiological tests, consent, safety); C — Nutritional needs (nutrients, energy balance, hydration); D — Training methods & fitness (components of fitness); E — Training programme design (principles, periodisation, review).",
    "Apply training/nutrition knowledge to the athlete or client in the scenario.",
  ].join("\n"),

  // ---------------- BTEC Level 2 IT ----------------
  "it-l2-unit-2": [
    "BTEC Level 2 IT Unit 2: Technology Systems.",
    "ASSESSMENT TYPE: EXTERNALLY ASSESSED DIGITAL EXAM. NOT coursework.",
    "Learning Aims: A — Applications & issues (hardware/software in applications, cloud services, data security/privacy, backup/recovery, networking in organisations); B — Hardware & software (CPU, memory, storage, I/O devices, system vs application software, licensing); C — Programming basics (languages, structure, variables/data types, control flow, functions).",
    "Keep explanations clear and Level-2 appropriate; relate to how technology is used in organisations.",
  ].join("\n"),

  // ---------------- A-Level ---------------
  "a-level-business": [
    "AQA A-Level Business (7132).",
    "ASSESSMENT TYPE: EXTERNALLY ASSESSED WRITTEN EXAMS (Papers 1–3). NOT coursework.",
    "Topics 1–10: What is business; managers/leadership/decision making; marketing; operations; finance; human resources; strategic position; strategic direction; strategic methods; managing strategic change.",
    "Data-response and case-study questions require application, analysis and evaluation (chains of reasoning). Use case data, build arguments (cause → effect → consequence) and support judgement.",
  ].join("\n"),
};

function resolveUnitProfile(unit: string): string | null {
  const key = String(unit || "").trim().toLowerCase();
  if (!key) return null;
  if (UNIT_PROFILES[key]) return UNIT_PROFILES[key];
  // Accept looser matches (e.g. "unit-1", "it unit 2")
  for (const k of Object.keys(UNIT_PROFILES)) {
    if (key.includes(k) || k.includes(key)) return UNIT_PROFILES[k];
  }
  return null;
}

function buildSystemHint(unit: string): string {
  const profile = resolveUnitProfile(unit);
  const base = [
    "You are 'AI Helper', a friendly, rigorous RA10 revision assistant for a UK qualification.",
    "Answer in the SPECIFIC subject context provided. Never drift into a different BTEC unit or subject.",
    profile
      ? "CURRENT UNIT PROFILE (you are answering ONLY about this):\n" + profile
      : "No specific unit was detected. Ask the student which qualification/unit they are studying if it matters, and stay generic and safe.",
    "Rules:",
    "- Be concise: short paragraphs and bullet points.",
    "- If the unit is exam-based, relate answers to mark schemes, command verbs and levels-based descriptors where relevant.",
    "- If the unit is assignment/coursework-based, coach (give hints, structure, checklists and short examples) — NEVER write the student's whole assignment for them.",
    "- Use correct technical terminology.",
    "- Use markdown: **bold**, lists, - [ ] task lists, tables and fenced code blocks where helpful.",
  ].join("\n");
  return base;
}

function buildHintPrompt(input: any) {
  const context = String(input?.context || "").slice(0, 4000);
  const message = String(input?.message || "").trim();
  const history = Array.isArray(input?.history) ? input.history.slice(-8) : [];
  return { context, message, history };
}

const SYSTEM_MARK = [
  "You are a strict but fair BTEC Level 3 IT Unit 3 (Website Development) internal assessor.",
  "You mark student assignment submissions against Pearson Pass/Merit/Distinction criteria for ONE task at a time.",
  "Familiarise yourself with the standards for each learning aim:",
  "- Task 1 (Aim A): A.P1/A.P2 (Pass) adequate research with partially relevant examples, a site map partially meeting requirements; A.M1/A.M2 (Merit) good research with mostly relevant examples, explain impact on the user, annotated site map meeting most requirements, appropriate structure and some technical vocabulary; A.D1 (Distinction) effective accomplished research with pertinent examples, thorough understanding and analysis of positive AND negative outcomes, detailed site map clearly annotated to show how it meets ALL client requirements, well-structured, accurate technical vocabulary.",
  "- Task 2 (Aim B): B.P3/B.P4 (Pass) basic wireframing tools producing adequate wireframes, straightforward visual designs showing partial understanding, assets with some audience appeal meeting key requirements; B.M3/B.M4 (Merit) good use of wireframing tools producing mostly effective wireframes, appropriate designs showing good understanding, assets with appropriate appeal meeting most requirements; B.D2 (Distinction) accomplished wireframing producing effective wireframes, effective designs demonstrating thorough understanding of client requirements AND user needs, effective asset management (asset log, folder structure, naming) with clear audience appeal comprehensively meeting requirements.",
  "- Task 3 (Aim C): C.P5 (Pass) basic tools producing a functional website meeting key requirements (some missed), straightforward functionality and usability testing, some refinements; C.M5 (Merit) good tools meeting most requirements, appropriate accessibility features, appropriate testing with appropriate refinements; C.D3 (Distinction) creative tools meeting ALL requirements, effective understanding of web standards (accessibility, semantic HTML), consistent and accessible website, effective functionality AND usability testing, considered refinements from a thorough self-review.",
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
    const termsDenied = await requireTermsAccepted(supabase, userId, corsHeaders);
    if (termsDenied) return termsDenied;
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

    const aiResponse = await callAnyProvider(buildSystemHint(body?.unit), userMsg, false);
    return new Response(JSON.stringify({ ok: true, reply: aiResponse.content.trim(), provider: aiResponse.provider }), { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("ai-assign error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: getCorsHeaders(req.headers.get("origin") || "") },
    );
  }
});
