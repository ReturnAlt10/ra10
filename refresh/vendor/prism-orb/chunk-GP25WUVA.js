"use client";

// src/motion.ts
var Spring = class {
  constructor(value, omega = 5.5) {
    this.omega = omega;
    this.v = 0;
    this.x = value;
    this.target = value;
  }
  step(dt) {
    const w = this.omega;
    const a = w * w * (this.target - this.x) - 2 * w * this.v;
    this.v += a * dt;
    this.x += this.v * dt;
    return this.x;
  }
  snap() {
    this.x = this.target;
    this.v = 0;
  }
};
function hash(n) {
  const s2 = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s2 - Math.floor(s2);
}
function vnoise(x) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return hash(i) * (1 - u) + hash(i + 1) * u;
}
var smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
function voiceEnvelope(t, seed) {
  const phrase = smoothstep(0.38, 0.55, vnoise(t * 0.55 + seed * 13.1));
  const syl = Math.abs(Math.sin(t * Math.PI * (4.2 + vnoise(t * 0.8 + seed) * 1.6)));
  const accent = 0.55 + 0.45 * vnoise(t * 3.1 + seed * 7.7);
  return phrase * (0.25 + 0.75 * syl ** 1.6) * accent;
}
function ambientEnvelope(t, seed) {
  const gate = smoothstep(0.3, 0.6, vnoise(t * 0.7 + seed * 5.3));
  return gate * (0.2 + 0.5 * vnoise(t * 5.3 + seed * 3.7) + 0.3 * vnoise(t * 11.1 + seed));
}
function follow(current, target, dt, attack = 18, release = 5) {
  const rate = target > current ? attack : release;
  return current + (target - current) * (1 - Math.exp(-rate * dt));
}

// src/audio.ts
var BANDS = 8;
var WAVE = 32;
var clamp01 = (v) => Math.min(1, Math.max(0, v));
var Analysis = class {
  constructor(analyser, mic = false) {
    this.analyser = analyser;
    this.mic = mic;
    this.lastRead = -1;
    this.peak = 0.05;
    this.db = -20;
    this.floorDb = -20;
    this.peakDb = -30;
    this.features = { level: 0, bands: new Float32Array(BANDS) };
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.6;
    const nyquist = analyser.context.sampleRate / 2;
    const n = analyser.frequencyBinCount;
    const edge = (i) => 80 * Math.pow(8e3 / 80, i / BANDS);
    this.bins = Array.from({ length: BANDS }, (_, i) => {
      const a = Math.max(1, Math.floor(edge(i) / nyquist * n));
      const b = Math.max(a + 1, Math.ceil(edge(i + 1) / nyquist * n));
      return [a, Math.min(b, n)];
    });
    this.freq = new Uint8Array(n);
    this.time = new Float32Array(analyser.fftSize);
  }
  read(now) {
    const f = this.features;
    if (now === this.lastRead) return f;
    const dt = this.lastRead < 0 ? 1 / 60 : Math.min((now - this.lastRead) / 1e3, 0.1);
    this.lastRead = now;
    const an = this.analyser;
    an.getFloatTimeDomainData(this.time);
    let sum = 0;
    for (let i = 0; i < this.time.length; i++) sum += this.time[i] * this.time[i];
    const rms = Math.sqrt(sum / this.time.length);
    if (this.mic) f.level = this.micLevel(rms, dt);
    else {
      this.peak = Math.max(rms, this.peak * 0.998, 0.06);
      f.level = clamp01((rms - 0.01) / (this.peak - 0.01)) ** 1.2;
    }
    an.getByteFrequencyData(this.freq);
    for (let b = 0; b < BANDS; b++) {
      const [lo, hi] = this.bins[b];
      let acc = 0;
      for (let i = lo; i < hi; i++) acc += this.freq[i];
      const v = clamp01(acc / (hi - lo) / 255 * (1 + b * 0.22)) * Math.min(1, f.level * 1.4);
      f.bands[b] += (v - f.bands[b]) * 0.5;
    }
    return f;
  }
  micLevel(rms, dt) {
    const db = 20 * Math.log10(Math.max(rms, 1e-5));
    this.db += (db - this.db) * (1 - Math.exp(-dt * 30));
    this.floorDb = Math.max(-65, this.db < this.floorDb ? this.db : this.floorDb + dt * 0.4);
    const gate = this.floorDb + 6;
    this.peakDb = Math.max(db, this.peakDb - dt * 2);
    const range = Math.min(30, Math.max(24, this.peakDb - gate));
    return clamp01((db - gate) / range);
  }
  reset() {
    this.features.level = 0;
    this.features.bands.fill(0);
  }
};
var MicInput = class {
  constructor() {
    this.ctx = null;
    this.stream = null;
    this.analysis = null;
    this.status = "off";
    this.listeners = /* @__PURE__ */ new Set();
    this.idle = { level: 0, bands: new Float32Array(BANDS) };
    this.subscribe = (fn) => {
      this.listeners.add(fn);
      return () => this.listeners.delete(fn);
    };
    this.getStatus = () => this.status;
  }
  get active() {
    return this.status === "on";
  }
  setStatus(s2) {
    this.status = s2;
    for (const fn of this.listeners) fn();
  }
  async start() {
    if (this.status === "on" || this.status === "requesting") return;
    this.setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: true, autoGainControl: false }
      });
      const ctx = new AudioContext();
      if (ctx.state === "suspended") {
        const resume = () => void ctx.resume();
        for (const e of ["pointerdown", "keydown"]) window.addEventListener(e, resume, { once: true });
      }
      const analyser = ctx.createAnalyser();
      ctx.createMediaStreamSource(stream).connect(analyser);
      this.ctx = ctx;
      this.stream = stream;
      this.analysis = new Analysis(analyser, true);
      this.setStatus("on");
    } catch (e) {
      this.cleanup();
      this.setStatus(e?.name === "NotAllowedError" ? "denied" : "error");
    }
  }
  stop() {
    this.cleanup();
    this.setStatus("off");
  }
  cleanup() {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.ctx?.close().catch(() => {
    });
    this.stream = null;
    this.ctx = null;
    this.analysis = null;
  }
  read(now) {
    return this.analysis?.read(now) ?? this.idle;
  }
};
var orbMic = new MicInput();
var voiceCtx = null;
var voices = /* @__PURE__ */ new WeakMap();
function voiceAnalysis(source) {
  const hit = voices.get(source);
  if (hit) return hit;
  try {
    let analyser;
    if (source instanceof MediaStream || source instanceof HTMLMediaElement) {
      voiceCtx ?? (voiceCtx = new AudioContext());
      const ctx = voiceCtx;
      analyser = ctx.createAnalyser();
      if (source instanceof MediaStream) {
        ctx.createMediaStreamSource(source).connect(analyser);
      } else {
        const node = ctx.createMediaElementSource(source);
        node.connect(analyser);
        node.connect(ctx.destination);
        source.addEventListener("play", () => void ctx.resume().catch(() => {
        }));
      }
      if (ctx.state === "suspended") void ctx.resume().catch(() => {
      });
    } else {
      analyser = source.context.createAnalyser();
      source.connect(analyser);
    }
    const analysis = new Analysis(analyser);
    voices.set(source, analysis);
    return analysis;
  } catch {
    return null;
  }
}
function simulateBands(clock, seed, level, out) {
  for (let b = 0; b < BANDS; b++) {
    const tilt = 1 - b * 0.07;
    const v = level * tilt * (0.35 + 0.65 * vnoise(clock * (4 + b * 0.9) + b * 3.1 + seed * 7));
    out[b] += (v - out[b]) * 0.35;
  }
}
function synthWave(bands, level, clock, out) {
  for (let i = 0; i < WAVE; i++) {
    const x = i / (WAVE - 1) * 2 - 1;
    let v = 0;
    for (let b = 0; b < BANDS; b++) {
      const k = 0.8 + b * 0.5;
      const drift = clock * (0.25 + b * 0.05) * (b % 2 ? 1 : -1);
      const osc = Math.sin(clock * (3.1 + b * 1.3) + b * 2.7);
      v += bands[b] * Math.sin(x * k * Math.PI + b * 1.9 + drift) * osc / (1 + b * 0.3);
    }
    const taper = 1 - x * x;
    const target = Math.max(-1, Math.min(1, v * 0.7 * taper * (0.35 + level)));
    out[i] += (target - out[i]) * 0.2;
  }
}

// src/color.ts
var MAX_STOPS = 5;
function oklchToOklab({ l, c, h }) {
  const r = h * Math.PI / 180;
  return [l, c * Math.cos(r), c * Math.sin(r)];
}
function packPalette(palette, out = new Float32Array(MAX_STOPS * 3)) {
  const n = Math.max(1, Math.min(MAX_STOPS, palette.length));
  for (let i = 0; i < MAX_STOPS; i++) {
    const lab = oklchToOklab(palette[i % n]);
    out[i * 3] = lab[0];
    out[i * 3 + 1] = lab[1];
    out[i * 3 + 2] = lab[2];
  }
  return { data: out, count: n };
}
function oklchCss({ l, c, h }, alpha = 1) {
  const a = alpha < 1 ? ` / ${round(alpha, 3)}` : "";
  return `oklch(${round(l, 3)} ${round(c, 3)} ${round(h, 1)}${a})`;
}
function round(v, d) {
  const m = 10 ** d;
  return Math.round(v * m) / m;
}
function oklchToHex(stop) {
  const [L, a, b] = oklchToOklab(stop);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s2 = s_ ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s2,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s2,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s2
  ];
  return "#" + rgb.map((v) => {
    const c = Math.min(1, Math.max(0, v));
    const srgb = c <= 31308e-7 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
    return Math.round(srgb * 255).toString(16).padStart(2, "0");
  }).join("");
}
function hexToOklch(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  const lin = [n >> 16 & 255, n >> 8 & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const [r, g, b] = lin;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s2 = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s2;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s2;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s2;
  const C = Math.hypot(A, B);
  let H = Math.atan2(B, A) * 180 / Math.PI;
  if (H < 0) H += 360;
  return { l: round(L, 3), c: round(C, 3), h: C < 2e-3 ? 0 : round(H, 1) };
}

// src/states.ts
var ORB_STATES = ["idle", "listening", "thinking", "speaking"];
var STATE_TARGETS = {
  idle: { speed: 0.55, warp: 0.85, swirl: 0, scale: 1, bright: 0, voice: 0, ambient: 0, breathe: 1, orbit: 1 },
  listening: { speed: 1, warp: 1, swirl: 0, scale: 1.025, bright: 0.035, voice: 0, ambient: 1, breathe: 0.3, orbit: 0.12 },
  thinking: { speed: 1.9, warp: 1.35, swirl: 0.25, scale: 0.955, bright: 0.015, voice: 0, ambient: 0, breathe: 0, orbit: 1 },
  speaking: { speed: 1, warp: 1, swirl: 0, scale: 1.025, bright: 0.035, voice: 1, ambient: 0, breathe: 0.3, orbit: 0.12 }
};
var MOTION_STATES = ["listening", "thinking", "speaking"];
var MOTIONS = {
  listening: [
    { id: "inflow", label: "Inflow" },
    { id: "wobble", label: "Wobble" },
    { id: "lean", label: "Lean" }
  ],
  thinking: [
    { id: "orbit", label: "Orbit swirl" },
    { id: "sparkle", label: "Synapse sparkle" },
    { id: "hue", label: "Hue cycle" },
    { id: "churn", label: "Churn" },
    { id: "deepen", label: "Deepening" }
  ],
  speaking: [
    { id: "waveform", label: "Waveform" },
    { id: "eq", label: "Radial EQ" },
    { id: "bloom", label: "Bloom" }
  ]
};
var DEFAULT_MOTION = {
  listening: "inflow",
  thinking: "churn",
  speaking: "bloom"
};
var FX = MOTION_STATES.flatMap((s2) => MOTIONS[s2].map((m) => m.id));
var FX_INDEX = Object.fromEntries(FX.map((id, i) => [id, i]));
var FX_STATE = Object.fromEntries(
  MOTION_STATES.flatMap((s2) => MOTIONS[s2].map((m) => [m.id, s2]))
);
var MOTION_MODS = {
  orbit: { swirl: 1.4 },
  sparkle: { swirl: 0.1, speed: 1.4 },
  hue: { swirl: 0.05, speed: 1.3 },
  churn: { swirl: 0.3, speed: 2.4, warp: 1.6, scale: 0.93 },
  deepen: { swirl: 0.12, speed: 1.6, warp: 1.3, scale: 0.96 }
};
function targetsFor(state, motion) {
  return state === "idle" ? STATE_TARGETS.idle : { ...STATE_TARGETS[state], ...MOTION_MODS[motion[state]] };
}
function resolveTargets(state, intensity, motion = DEFAULT_MOTION) {
  const idle = targetsFor("idle", motion);
  const s2 = targetsFor(state, motion);
  const out = {};
  for (const k in idle) {
    const key = k;
    out[key] = idle[key] + (s2[key] - idle[key]) * intensity;
  }
  return out;
}
var DEFAULT_PARAMS = {
  speed: 0.9,
  flow: 0.65,
  direction: 90,
  drift: 0.35,
  turbulence: 0.4,
  intensity: 1,
  grain: 0.1,
  softness: 0.4,
  dispersion: 0.5,
  rim: 0.15,
  rimSoftness: 0.1,
  whiteSpread: 0.1,
  toneMap: 0.15,
  vignette: 0.08,
  reactivity: 1.25
};
var VOICE_FLOW = { speed: 2.48, flow: 0.36, direction: 128, drift: 0.37, turbulence: 0.55 };
var DEFAULT_STATE_PARAMS = {
  listening: VOICE_FLOW,
  speaking: VOICE_FLOW
};
var DEFAULT_VARIANT_PARAMS = {
  waveform: { flow: 0.13, turbulence: 0.03, reactiveRim: true }
};
var NOISES = ["simplex", "perlin", "value", "worley"];
var FIELDS = ["noise", "sine", "ripple", "spiral"];

// src/gl/instance.ts
var PARAM_KEYS = Object.keys(DEFAULT_PARAMS);
var fx = (id) => FX_INDEX[id];
var RADIUS = 0.86;
var TARGET_KEYS = [
  "speed",
  "warp",
  "swirl",
  "scale",
  "bright",
  "voice",
  "ambient",
  "breathe",
  "orbit"
];
var OrbInstance = class {
  constructor(canvas, props) {
    this.state = "idle";
    this.params = DEFAULT_PARAMS;
    this.variantParams = {};
    this.stateParams = {};
    this.eff = { ...DEFAULT_PARAMS };
    this.effSprings = {};
    this.noise = "simplex";
    this.field = "noise";
    this.programKey = "";
    this.motion = DEFAULT_MOTION;
    this.audio = "mic";
    this.voiceSource = null;
    this.voiceAnalysis = null;
    this.reactiveRim = false;
    this.transitionSpeed = 1;
    this.palette = new Float32Array(MAX_STOPS * 3);
    this.paletteCount = 1;
    this.visible = false;
    this.cssSize = 0;
    this.px = 0;
    this.slotX = 0;
    this.slotY = 0;
    this.dirty = true;
    this.acc = 0;
    this.springs = {};
    this.clock = 0;
    this.phase = 0;
    this.flow = [0, 0];
    this.orbitPhase = 0;
    this.rot = 0;
    this.lvl = 0;
    this.warpLvl = 0;
    this.talk = 0;
    this.thinkTime = 0;
    this.deep = 0;
    this.fxSprings = FX.map(() => new Spring(0, 6));
    this.fx = new Float32Array(FX.length);
    this.bands = new Float32Array(BANDS);
    this.wave = new Float32Array(WAVE);
    this.hue = 0;
    this.detail = 1;
    this.rimSpring = new Spring(0, 6);
    this.rimReact = 0;
    this.u = { scale: 1, warp: 0.5, swirl: 0, bright: 0, radius: 0.92 };
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true });
    this.seed = props.seed ?? Math.random() * 10;
    this.clock = this.seed * 3.7;
    this.phase = this.seed * 5.3;
    this.orbitPhase = this.phase;
    const motion = { ...DEFAULT_MOTION, ...props.motion };
    const start = {
      ...props.params,
      ...paramsOnly(overrideFor(props.state, motion, props.stateParams, props.variantParams))
    };
    const tg = resolveTargets(props.state, start.intensity, motion);
    for (const k of TARGET_KEYS) this.springs[k] = new Spring(tg[k]);
    for (const k of PARAM_KEYS) this.effSprings[k] = new Spring(start[k], 7);
    this.set(props);
    for (const k of PARAM_KEYS) {
      this.effSprings[k].snap();
      this.eff[k] = this.effSprings[k].x;
    }
    this.fxSprings.forEach((sp) => sp.snap());
    this.rimSpring.snap();
  }
  get clockTime() {
    return this.clock % 3600;
  }
  set(props) {
    this.state = props.state;
    this.params = props.params;
    this.variantParams = props.variantParams ?? {};
    this.stateParams = props.stateParams ?? {};
    this.noise = props.noise ?? "simplex";
    this.field = props.field ?? "noise";
    this.programKey = `${this.noise}:${this.field}`;
    this.motion = { ...DEFAULT_MOTION, ...props.motion };
    this.audio = props.audio ?? "mic";
    const vs = props.voice ?? null;
    if (vs !== this.voiceSource) {
      this.voiceSource = vs;
      this.voiceAnalysis = vs ? voiceAnalysis(vs) : null;
    }
    const override = overrideFor(props.state, this.motion, this.stateParams, this.variantParams);
    this.reactiveRim = override?.reactiveRim ?? props.reactiveRim ?? false;
    const target = { ...props.params, ...paramsOnly(override) };
    for (const k of PARAM_KEYS) this.effSprings[k].target = target[k];
    this.level = props.level;
    this.fps = props.fps;
    this.transitionSpeed = Math.max(0.05, props.transitionSpeed ?? 1);
    if (props.seed !== void 0) this.seed = props.seed;
    this.paletteCount = packPalette(props.palette, this.palette).count;
    const tg = resolveTargets(props.state, target.intensity, this.motion);
    for (const k of TARGET_KEYS) this.springs[k].target = tg[k];
    FX.forEach((id, i) => {
      const st = FX_STATE[id];
      this.fxSprings[i].target = this.state === st && this.motion[st] === id ? 1 : 0;
    });
    const audioState = this.state === "listening" || this.state === "speaking";
    this.rimSpring.target = this.reactiveRim && audioState ? 1 : 0;
    this.dirty = true;
  }
  update(dt, reduced, now) {
    const s2 = this.springs;
    const f = this.fx;
    const sdt = dt * this.transitionSpeed;
    if (reduced) {
      for (const k of TARGET_KEYS) s2[k].snap();
      this.fxSprings.forEach((sp, i) => {
        sp.snap();
        f[i] = sp.x;
      });
      this.rimSpring.snap();
    } else {
      for (const k of TARGET_KEYS) s2[k].step(sdt);
      this.fxSprings.forEach((sp, i) => f[i] = Math.max(0, sp.step(sdt)));
      this.rimSpring.step(sdt);
      this.clock += dt;
    }
    this.rimReact = Math.max(0, this.rimSpring.x);
    for (const k of PARAM_KEYS) {
      const sp = this.effSprings[k];
      if (reduced) sp.snap();
      else sp.step(sdt);
      this.eff[k] = sp.x;
    }
    const p = this.eff;
    const gate = Math.min(1, s2.voice.x + s2.ambient.x);
    const mic = this.audio === "mic" && orbMic.active ? orbMic.read(now) : null;
    const voice = this.voiceAnalysis?.read(now) ?? null;
    let raw;
    if (typeof this.level === "function") raw = this.level();
    else if (typeof this.level === "number") raw = this.level;
    else {
      raw = s2.ambient.x * Math.min(1, (mic ? mic.level : ambientEnvelope(this.clock, this.seed)) * 1.4) + s2.voice.x * (voice ? voice.level : voiceEnvelope(this.clock, this.seed));
    }
    const gain = p.reactivity;
    raw = Math.max(0, Math.min(1, raw * gain));
    this.lvl = reduced ? 0 : follow(this.lvl, raw, dt, 10, 4);
    const realListen = mic && s2.ambient.x > 1e-3;
    const realVoice = voice && s2.voice.x > 1e-3;
    if (realListen || realVoice) {
      for (let b = 0; b < BANDS; b++) {
        const v = (realListen ? mic.bands[b] * s2.ambient.x : 0) + (realVoice ? voice.bands[b] * s2.voice.x : 0);
        this.bands[b] += (Math.min(1, v * gain) - this.bands[b]) * 0.6;
      }
    } else simulateBands(this.clock, this.seed, this.lvl, this.bands);
    synthWave(this.bands, this.lvl, this.clock, this.wave);
    this.thinkTime = this.state === "thinking" ? this.thinkTime + dt : 0;
    const t = Math.min(1, Math.max(0, (this.thinkTime - 1.5) / 10));
    this.deep = reduced ? 0 : f[fx("deepen")] * t * t * (3 - 2 * t);
    if (!reduced) {
      this.talk = follow(this.talk, Math.min(1, this.lvl * 3), dt, 6, 1.2);
      const hush = 1 - gate * 0.8 * (1 - this.talk);
      const dPhase = dt * (p.speed * s2.speed.x * hush * (1 + this.deep * 0.9) + gate * this.lvl * 1.1);
      this.phase += dPhase;
      const da = p.direction * Math.PI / 180;
      this.flow[0] += Math.cos(da) * p.drift * dPhase;
      this.flow[1] += Math.sin(da) * p.drift * dPhase;
      this.orbitPhase += dt * p.speed * s2.speed.x * s2.orbit.x;
      this.rot += dt * (s2.swirl.x * 1.1 + this.deep * 0.5) * p.speed;
      this.hue += dt * 0.45 * p.speed;
    }
    this.detail = Math.min(1, Math.max(0, (this.cssSize - 32) / 64));
    const breathe = reduced ? 0 : s2.breathe.x * Math.sin(this.clock * 1.4) * 0.012;
    const bloom = f[fx("bloom")];
    this.u.scale = s2.scale.x * (1 + this.lvl * 0.025 + breathe + bloom * this.lvl * 0.04) * (1 - this.deep * 0.035);
    this.warpLvl = follow(this.warpLvl, this.lvl, dt, 1.5, 0.8);
    this.u.warp = p.flow * s2.warp.x + this.warpLvl * (0.06 + gate * 0.18) + this.deep * 0.35;
    this.u.swirl = s2.swirl.x;
    this.u.bright = s2.bright.x + this.deep * 0.03;
    this.u.radius = RADIUS;
    if (reduced) {
      const d = this.dirty;
      this.dirty = false;
      return d;
    }
    const fps = this.fps ?? (this.cssSize < 48 ? 30 : 60);
    this.acc += dt;
    const interval = 1 / fps;
    if (this.acc + 2e-3 < interval && !this.dirty) return false;
    this.acc = this.acc >= interval * 2 ? 0 : Math.max(0, this.acc - interval);
    this.dirty = false;
    return true;
  }
};
function overrideFor(state, motion, sp, vp) {
  const variant = state === "idle" ? void 0 : vp?.[motion[state]];
  const st = sp?.[state];
  return st || variant ? { ...st, ...variant } : void 0;
}
function paramsOnly(o) {
  if (!o) return {};
  const { reactiveRim: _rim, ...rest } = o;
  void _rim;
  return rest;
}

// src/gl/program.ts
var UNIFORM_NAMES = [
  "uColors",
  "uCount",
  "uTime",
  "uRot",
  "uWarp",
  "uTurb",
  "uSwirl",
  "uScale",
  "uBright",
  "uLevel",
  "uGrain",
  "uSoft",
  "uRim",
  "uRimSoft",
  "uWhite",
  "uVignette",
  "uDispersion",
  "uDir",
  "uFlow",
  "uDrift",
  "uSeed",
  "uRadius",
  "uPx",
  "uFx",
  "uBands",
  "uWave",
  "uRimReact",
  "uHue",
  "uDetail",
  "uClock",
  "uOrbit",
  "uDeep",
  "uToneMap"
];
var ARRAYS = /* @__PURE__ */ new Set(["uColors", "uFx", "uBands", "uWave"]);
function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS) && !gl.isContextLost()) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`[orb] shader compile failed:
${log}`);
  }
  return sh;
}
function createProgram(gl, vert, frag) {
  const vs = compile(gl, gl.VERTEX_SHADER, vert);
  const fs = compile(gl, gl.FRAGMENT_SHADER, frag);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) {
    throw new Error(`[orb] program link failed:
${gl.getProgramInfoLog(program)}`);
  }
  const loc = {};
  for (const name of UNIFORM_NAMES) {
    loc[name] = gl.getUniformLocation(program, ARRAYS.has(name) ? `${name}[0]` : name);
  }
  return { program, loc };
}

// src/gl/shaders/common.ts
var FX_DEFINES = FX.map((id, i) => `#define FX_${id.toUpperCase()} ${i}`).join("\n");
var VERT = `#version 300 es
out vec2 vPos;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vPos = p * 2.0 - 1.0;
  gl_Position = vec4(vPos, 0.0, 1.0);
}`;
var COMMON = `
precision highp float;

in vec2 vPos;
out vec4 outColor;

uniform vec3 uColors[5];
uniform int uCount;
uniform float uTime;
uniform float uRot;
uniform float uWarp;
uniform float uTurb;
uniform float uSwirl;
uniform float uScale;
uniform float uBright;
uniform float uLevel;
uniform float uGrain;
uniform float uSoft;
uniform float uRim;
uniform float uRimSoft;
uniform float uWhite;
uniform float uVignette;
uniform float uDispersion;
uniform vec2  uDir;
uniform vec2  uFlow;
uniform float uDrift;
uniform float uSeed;
uniform float uRadius;
uniform float uPx;

uniform float uFx[${FX.length}];
uniform float uBands[8];
uniform float uWave[32];
uniform float uRimReact;
uniform float uHue;
uniform float uDetail;
uniform float uClock;
uniform float uOrbit;
uniform float uDeep;
uniform float uToneMap;

${FX_DEFINES}

const float TAU = 6.28318530718;

vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
    i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
    i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return -1.0 + 2.0 * fract((p.xxy + p.yxx) * p.zyx);
}
float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

float perlin(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float n000 = dot(hash33(i), f);
  float n100 = dot(hash33(i + vec3(1, 0, 0)), f - vec3(1, 0, 0));
  float n010 = dot(hash33(i + vec3(0, 1, 0)), f - vec3(0, 1, 0));
  float n110 = dot(hash33(i + vec3(1, 1, 0)), f - vec3(1, 1, 0));
  float n001 = dot(hash33(i + vec3(0, 0, 1)), f - vec3(0, 0, 1));
  float n101 = dot(hash33(i + vec3(1, 0, 1)), f - vec3(1, 0, 1));
  float n011 = dot(hash33(i + vec3(0, 1, 1)), f - vec3(0, 1, 1));
  float n111 = dot(hash33(i + vec3(1, 1, 1)), f - vec3(1, 1, 1));
  return 1.6 * mix(
    mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
    mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y), u.z);
}

float valueNoise(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float v = mix(
    mix(mix(hash13(i), hash13(i + vec3(1, 0, 0)), u.x),
        mix(hash13(i + vec3(0, 1, 0)), hash13(i + vec3(1, 1, 0)), u.x), u.y),
    mix(mix(hash13(i + vec3(0, 0, 1)), hash13(i + vec3(1, 0, 1)), u.x),
        mix(hash13(i + vec3(0, 1, 1)), hash13(i + vec3(1, 1, 1)), u.x), u.y), u.z);
  return v * 2.0 - 1.0;
}

float worley(vec3 p) {
  vec2 i = floor(p.xy), f = fract(p.xy);
  float d = 8.0;
  for (int y = -1; y <= 1; y++)
  for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y));
    vec3 h = hash33(vec3(i + g, 7.0));
    vec2 o = 0.5 + 0.45 * sin(p.z * 1.6 + TAU * h.xy);
    vec2 r = g + o - f;
    d = min(d, dot(r, r));
  }
  return sqrt(d) * 2.2 - 1.0;
}

float noise3(vec3 p) {
#if defined(NOISE_PERLIN)
  return perlin(p);
#elif defined(NOISE_VALUE)
  return valueNoise(p);
#elif defined(NOISE_WORLEY)
  return worley(p);
#else
  return snoise(p);
#endif
}

vec2 warpField(vec2 q, float f, float t, vec2 flow) {
#if defined(FIELD_RIPPLE) || defined(FIELD_SPIRAL)
  q += uDir * uDrift * 0.9;
#else
  q -= flow * 1.3;
#endif
#if defined(FIELD_SINE)
  vec2 w1 = vec2(sin(q.y * f * 4.2 + t * 1.3), sin(q.x * f * 4.2 - t * 1.1));
  vec2 q2 = q + w1 * uWarp * 0.5;
  vec2 w2 = vec2(sin((q2.x + q2.y) * f * 5.3 + t * 1.7), cos((q2.x - q2.y) * f * 4.7 - t * 1.5));
  return w1 * 0.62 + w2 * 0.28;
#elif defined(FIELD_RIPPLE)
  float r = length(q) + 1e-4;
  vec2 d = q / r;
  float c = smoothstep(0.0, 0.35, r);
  return c * (d * (sin(r * f * 7.0 - t * 2.2) * 0.38 + sin(r * f * 13.0 - t * 3.1) * 0.12)
       + vec2(-d.y, d.x) * sin(t * 0.7) * 0.1);
#elif defined(FIELD_SPIRAL)
  float r = length(q) + 1e-4;
  float a = atan(q.y, q.x);
  vec2 d = q / r;
  float c = smoothstep(0.0, 0.35, r);
  return c * (vec2(-d.y, d.x) * sin(r * f * 6.0 - t * 1.8 + a * 2.0) * 0.5 + d * sin(a * 3.0 + t) * 0.12);
#else
  vec2 w1 = vec2(noise3(vec3(q * f, t)), noise3(vec3(q * f + 7.31, t + 3.17)));
  vec2 q2 = q + w1 * uWarp * 0.55;
  vec2 w2 = vec2(noise3(vec3(q2 * f * 1.9 + 1.7, t * 1.4)), noise3(vec3(q2 * f * 1.9 - 4.1, t * 1.4 + 9.2)));
  return w1 * 0.55 + w2 * 0.22;
#endif
}

mat2 rot2(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

vec3 oklabToLinear(vec3 c) {
  float l_ = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m_ = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s_ = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  float l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;
  return vec3(
     4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 linearToSrgb(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(12.92 * c, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}
vec3 oklabToSrgb(vec3 c) { return linearToSrgb(oklabToLinear(c)); }

vec2 pixelCoord() { return floor((vPos * 0.5 + 0.5) * uPx); }

float bandAt(vec2 p) {
  float x = abs(atan(p.x, -p.y)) / 3.14159265 * 7.0;
  int i0 = int(floor(x));
  int i1 = min(i0 + 1, 7);
  return mix(uBands[i0], uBands[i1], smoothstep(0.0, 1.0, fract(x)));
}

float waveAt(float x) {
  float t = clamp(x * 0.5 + 0.5, 0.0, 1.0) * 31.0;
  int i0 = int(floor(t));
  int i1 = min(i0 + 1, 31);
  return mix(uWave[i0], uWave[i1], smoothstep(0.0, 1.0, fract(t)));
}

vec2 fxShape(vec2 p) {
  float wob = uFx[FX_WOBBLE];
  float eq = uFx[FX_EQ];
  if (wob + eq < 0.001) return p;
  float ang = atan(p.y, p.x);
  float b = bandAt(p);
  float d = 0.0;
  if (wob > 0.001) {
    float n = sin(ang * 3.0 + uClock * 1.3) * 0.6 + sin(ang * 5.0 - uClock * 1.9) * 0.4;
    d += wob * (0.012 + uLevel * 0.035) * (n + b * 1.2);
  }
  if (eq > 0.001) d += eq * b * mix(0.035, 0.065, uDetail);
  return p / (1.0 + d);
}

vec2 fxWarp(vec2 q) {
  vec2 w = vec2(0.0);
  float r = length(q) + 1e-4;
  vec2 d = q / r;
  float c = smoothstep(0.0, 0.3, r);
  float inflow = uFx[FX_INFLOW];
  if (inflow > 0.001) w += d * c * sin(r * 9.0 + uClock * 4.4) * inflow * (0.012 + uLevel * 0.26);
  float bloom = uFx[FX_BLOOM];
  if (bloom > 0.001) w += d * c * sin(r * 9.0 - uClock * 4.4) * bloom * (0.012 + uLevel * 0.26);
  float lean = uFx[FX_LEAN];
  if (lean > 0.001) w += vec2(0.0, 0.24) * lean * (0.4 + uLevel);
  return w;
}

float fxGlow(vec2 q) {
  float g = 0.0;
  float sparkle = uFx[FX_SPARKLE] + uDeep * 0.7;
  if (sparkle > 0.001) {
    float n = snoise(vec3(q * 7.0, uClock * 0.7 + uSeed));
    float m = snoise(vec3(q * 2.2 + 11.0, uClock * 0.35));
    g += smoothstep(0.64, 0.92, n) * smoothstep(-0.1, 0.45, m) * sparkle * 1.4;
  }
  return g;
}

vec3 fxColor(vec3 lab) {
  float hue = uFx[FX_HUE];
  if (hue > 0.001) lab.yz = mix(lab.yz, rot2(uHue) * lab.yz, hue);
  return lab;
}

vec3 paletteLinear(float u) {
  float x = clamp(u, 0.0, 1.0) * float(uCount - 1);
  int i0 = int(floor(x));
  int i1 = min(i0 + 1, uCount - 1);
  return mix(uColors[i0], uColors[i1], smoothstep(0.0, 1.0, fract(x)));
}

vec3 rimPass(vec3 lin, float r, float aa, vec2 p) {
  float e = max(1.0 - r, 0.0);
  float extra = 0.0;
  if (uRimReact > 0.001) extra += uRimReact * (0.2 + uLevel * 0.45 + bandAt(p) * 0.35);
  float eq = uFx[FX_EQ];
  if (eq > 0.001) extra += eq * bandAt(p) * 1.1;
  float v = pow(smoothstep(0.2, 1.0, r), 2.0) * uVignette;
  lin *= 1.0 - v * 0.75;
  float ws = exp(-e / mix(0.015, 0.5, uWhite)) * uWhite;
  lin = mix(lin, vec3(1.0), clamp(ws * 0.92, 0.0, 1.0));
  float line = exp(-e / max(mix(0.004, 0.09, uRimSoft) + extra * 0.035, aa)) * (uRim + extra);
  lin = mix(lin, lin * 1.9 + 0.28, clamp(line, 0.0, 1.0));
  return lin;
}
`;

// src/gl/shaders/prism.ts
var PRISM_FRAG = `${COMMON}
vec2 envSample(vec2 s, vec2 warp) {
  vec2 q = s + warp;
  float w = mix(0.1, 0.42, uSoft);
  float wave = uFx[FX_WAVEFORM];
  float by = (q.y - waveAt(clamp(q.x * 0.4, -1.0, 1.0)) * 0.55 * wave) / (w * (1.0 - 0.2 * wave));
  float band = exp(-by * by) * (1.0 + 0.2 * wave);
  float glow = exp(-length(q * vec2(0.7, 0.95)) * 1.15);
  return vec2(band * 0.95 + glow * 1.1 + min(fxGlow(q * 0.75), 1.2) * 0.8, 0.5 - q.y * 0.55);
}

vec3 toneMap(vec3 c) {
  float peak = max(max(c.r, c.g), c.b);
  const float K = 0.8;
  if (peak <= K) return c;
  float mapped = K + (1.0 - K) * (1.0 - exp(-(peak - K) / (1.0 - K)));
  vec3 t = c * (mapped / peak);
  return mix(t, vec3(mapped), smoothstep(0.9, 2.6, peak) * 0.7);
}

void main() {
  float R = uRadius * uScale;
  vec2 p = fxShape(vPos / R);
  float r2 = dot(p, p);
  float r = sqrt(r2);
  float aa = fwidth(r) * 1.25;
  if (r > 1.3) { outColor = vec4(0.0); return; }

  float inside = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, r);
  vec3 n = vec3(p, sqrt(max(1.0 - r2, 0.0)));
  vec3 I = vec3(0.0, 0.0, -1.0);

  float spread = 0.012 + uDispersion * 0.07;
  vec3 eta = 1.0 / (1.36 + vec3(-spread, 0.0, spread));
  float lensScale = mix(1.6, 2.8, uTurb);
  vec3 TR = refract(I, n, eta.r);
  vec3 TG = refract(I, n, eta.g);
  vec3 TB = refract(I, n, eta.b);
  vec2 sR = TR.xy / max(-TR.z, 0.15) * lensScale;
  vec2 sG = TG.xy / max(-TG.z, 0.15) * lensScale;
  vec2 sB = TB.xy / max(-TB.z, 0.15) * lensScale;

  vec2 warp = warpField(sG * 0.6 + vec2(uRot * 0.3, 0.0), mix(0.7, 1.6, uTurb), uTime * 0.32, uFlow * 0.32) * uWarp * 0.7
            + fxWarp(sG * 0.6) * 0.9;
  vec2 eR = envSample(sR, warp);
  vec2 eG = envSample(sG, warp);
  vec2 eB = envSample(sB, warp);
  float boost = 1.0 + uLevel * 0.3 + uBright * 3.0;
  vec3 lightCol = oklabToLinear(fxColor(paletteLinear(eG.y)));
  vec3 light = lightCol * vec3(eR.x, eG.x, eB.x) * boost;

  vec3 avg = vec3(0.0);
  float chroma = 0.0;
  for (int i = 0; i < 5; i++) { if (i >= uCount) break; avg += uColors[i]; chroma += length(uColors[i].yz); }
  avg /= float(uCount);
  chroma /= float(uCount);
  float split = smoothstep(0.0, 0.05, chroma);
  const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);
  light = mix(vec3(dot(light, LUMA)), light, split);

  vec3 core = oklabToLinear(vec3(0.085, avg.yz * 0.45));

  float rimK = min(uRim / 0.3, 1.0);
  vec3 rimTint = mix(oklabToLinear(fxColor(paletteLinear(0.2))), vec3(1.0), 0.35);
  float fres = pow(1.0 - n.z, 3.0);
  vec3 rr = r * (1.0 + vec3(1.0, 0.0, -1.0) * (0.004 + uDispersion * 0.012));
  vec3 ed = (1.0 - rr) / max(0.03, aa * 2.0);
  vec3 edge = exp(-ed * ed) * (1.0 - smoothstep(1.0 - aa, 1.0 + aa, rr));
  edge = mix(vec3(dot(edge, vec3(1.0 / 3.0))), edge, split);

  float lensFalloff = 1.0 - smoothstep(0.55, 1.0, r) * 0.65;
  vec3 col = core + light * lensFalloff * 0.9 + rimTint * (fres * 0.7 * mix(0.35, 1.0, rimK) + edge * 0.9 * rimK);
  col *= inside;
  col = rimPass(col, r, aa, p) * inside;

  float halo = r > 1.0 ? exp(-(r - 1.0) * mix(38.0, 14.0, uSoft)) * 0.45 * rimK : 0.0;
  col += rimTint * halo;
  float alpha = clamp(max(inside, halo), 0.0, 1.0);

  float g = hash12(pixelCoord() + uSeed * 97.0) - 0.5;
  col *= 1.0 + g * uGrain * 0.5;

  vec3 straight = alpha > 0.001 ? col / alpha : vec3(0.0);
  if (uToneMap > 0.001) straight = mix(straight, toneMap(straight), uToneMap);
  outColor = vec4(linearToSrgb(straight) * alpha, alpha);
}`;

// src/gl/renderer.ts
function fragmentSource(noise, field) {
  return `#version 300 es
#define NOISE_${noise.toUpperCase()}
#define FIELD_${field.toUpperCase()}
${PRISM_FRAG}`;
}
var TEARDOWN_DELAY = 3e3;
var ATLAS_MIN = 512;
var ATLAS_PAD = 2;
var SharedRenderer = class {
  constructor() {
    this.canvas = null;
    this.gl = null;
    this.programs = /* @__PURE__ */ new Map();
    this.instances = /* @__PURE__ */ new Set();
    this.io = null;
    this.ro = null;
    this.byEl = /* @__PURE__ */ new WeakMap();
    this.raf = 0;
    this.last = 0;
    this.teardownTimer = null;
    this.reduced = false;
    this.mql = null;
    this.dprCap = 2;
    this.supported = null;
    this.frames = 0;
    this.cpuAcc = 0;
    this.statsT = 0;
    this.listeners = /* @__PURE__ */ new Set();
    this.stats = {
      supported: true,
      contexts: 0,
      total: 0,
      active: 0,
      drawn: 0,
      fps: 0,
      frameMs: 0,
      atlas: [0, 0],
      dprCap: 2
    };
    this.subscribe = (fn) => {
      this.listeners.add(fn);
      return () => this.listeners.delete(fn);
    };
    this.getStats = () => this.stats;
    this.onReducedChange = (e) => {
      this.reduced = e.matches;
      for (const inst of this.instances) inst.dirty = true;
      this.schedule();
    };
    this.frame = (now) => {
      this.raf = 0;
      const dt = this.last ? Math.min((now - this.last) / 1e3, 1 / 20) : 1 / 60;
      this.last = now;
      const t0 = performance.now();
      const list = [];
      let active = 0;
      for (const inst of this.instances) {
        if (!inst.visible || inst.px === 0) continue;
        active++;
        if (inst.update(dt, this.reduced, now)) list.push(inst);
      }
      if (list.length) this.draw(list);
      const cpu = performance.now() - t0;
      this.frames++;
      this.cpuAcc += cpu;
      if (!this.statsT) this.statsT = now;
      if (now - this.statsT >= 500) {
        const el = (now - this.statsT) / 1e3;
        this.stats = {
          supported: this.supported !== false,
          contexts: this.gl && !this.gl.isContextLost() ? 1 : 0,
          total: this.instances.size,
          active,
          drawn: list.length,
          fps: Math.round(this.frames / el),
          frameMs: this.cpuAcc / Math.max(1, this.frames),
          atlas: this.canvas ? [this.canvas.width, this.canvas.height] : [0, 0],
          dprCap: this.dprCap
        };
        this.frames = 0;
        this.cpuAcc = 0;
        this.statsT = now;
        for (const fn of this.listeners) fn();
      }
      if (active > 0 && !this.reduced) this.schedule();
      else {
        this.last = 0;
        this.statsT = 0;
        this.frames = 0;
        this.cpuAcc = 0;
        if (this.stats.active !== active || this.stats.fps !== 0) {
          this.stats = { ...this.stats, active, total: this.instances.size, fps: 0, drawn: list.length };
          for (const fn of this.listeners) fn();
        }
      }
    };
  }
  isSupported() {
    if (this.supported !== null) return this.supported;
    if (typeof document === "undefined") return true;
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2");
      this.supported = !!gl;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      this.supported = false;
    }
    return this.supported;
  }
  register(inst) {
    if (this.teardownTimer) {
      clearTimeout(this.teardownTimer);
      this.teardownTimer = null;
    }
    this.ensureObservers();
    this.instances.add(inst);
    this.byEl.set(inst.canvas, inst);
    this.io.observe(inst.canvas);
    this.ro.observe(inst.canvas);
    this.schedule();
  }
  unregister(inst) {
    this.instances.delete(inst);
    this.io?.unobserve(inst.canvas);
    this.ro?.unobserve(inst.canvas);
    if (this.instances.size === 0) {
      this.teardownTimer = setTimeout(() => this.teardown(), TEARDOWN_DELAY);
    }
  }
  invalidate(inst) {
    inst.dirty = true;
    this.schedule();
  }
  setDprCap(cap) {
    this.dprCap = cap;
    for (const inst of this.instances) this.measure(inst, inst.cssSize);
    this.schedule();
  }
  getDprCap() {
    return this.dprCap;
  }
  ensureObservers() {
    if (this.io) return;
    this.io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const inst = this.byEl.get(e.target);
          if (!inst) continue;
          inst.visible = e.isIntersecting;
          if (inst.visible) inst.dirty = true;
        }
        this.schedule();
      },
      { rootMargin: "48px" }
    );
    this.ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const inst = this.byEl.get(e.target);
        if (inst) this.measure(inst, e.contentRect.width);
      }
      this.schedule();
    });
    this.mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.reduced = this.mql.matches;
    this.mql.addEventListener("change", this.onReducedChange);
  }
  measure(inst, cssSize) {
    inst.cssSize = cssSize;
    const dpr = Math.min(window.devicePixelRatio || 1, this.dprCap, cssSize < 48 ? 1.5 : Infinity);
    const px = Math.max(1, Math.round(cssSize * dpr));
    if (px !== inst.px) {
      inst.px = px;
      inst.canvas.width = px;
      inst.canvas.height = px;
      inst.dirty = true;
    }
  }
  initGl() {
    if (this.gl && !this.gl.isContextLost()) return this.gl;
    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
      this.canvas.width = ATLAS_MIN;
      this.canvas.height = ATLAS_MIN;
      this.canvas.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
        this.programs.clear();
      });
      this.canvas.addEventListener("webglcontextrestored", () => {
        this.setupGl();
        for (const inst of this.instances) inst.dirty = true;
        this.schedule();
      });
    }
    const gl = this.canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "low-power"
    });
    if (!gl) {
      this.supported = false;
      return null;
    }
    this.gl = gl;
    this.setupGl();
    return gl;
  }
  setupGl() {
    const gl = this.gl;
    gl.bindVertexArray(gl.createVertexArray());
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
  }
  program(inst) {
    const cached = this.programs.get(inst.programKey);
    if (cached !== void 0) return cached;
    let p = null;
    try {
      p = createProgram(this.gl, VERT, fragmentSource(inst.noise, inst.field));
    } catch (e) {
      console.error(e);
    }
    this.programs.set(inst.programKey, p);
    return p;
  }
  schedule() {
    if (!this.raf && typeof window !== "undefined") this.raf = requestAnimationFrame(this.frame);
  }
  draw(list) {
    const gl = this.initGl();
    if (!gl) return;
    list.sort((a, b) => b.px - a.px || (a.programKey < b.programKey ? -1 : 1));
    const rowW = Math.max(ATLAS_MIN, list[0].px + ATLAS_PAD);
    let x = 0, y = 0, shelfH = 0;
    for (const inst of list) {
      if (x + inst.px > rowW) {
        x = 0;
        y += shelfH + ATLAS_PAD;
        shelfH = 0;
      }
      inst.slotX = x;
      inst.slotY = y;
      x += inst.px + ATLAS_PAD;
      shelfH = Math.max(shelfH, inst.px);
    }
    const needH = y + shelfH;
    const c = this.canvas;
    if (c.width < rowW || c.height < needH) {
      c.width = Math.max(c.width, Math.ceil(rowW / 256) * 256);
      c.height = Math.max(c.height, Math.ceil(needH / 256) * 256);
    }
    const H = c.height;
    let current = null;
    let prog = null;
    for (const inst of list) {
      if (inst.programKey !== current) {
        current = inst.programKey;
        prog = this.program(inst);
        if (prog) gl.useProgram(prog.program);
      }
      if (!prog) continue;
      const L = prog.loc;
      const p = inst.eff;
      const u = inst.u;
      gl.viewport(inst.slotX, H - inst.slotY - inst.px, inst.px, inst.px);
      gl.uniform3fv(L.uColors, inst.palette);
      gl.uniform1i(L.uCount, inst.paletteCount);
      gl.uniform1f(L.uTime, inst.phase);
      gl.uniform1f(L.uRot, inst.rot);
      gl.uniform1f(L.uWarp, u.warp);
      gl.uniform1f(L.uTurb, p.turbulence);
      gl.uniform1f(L.uSwirl, u.swirl);
      gl.uniform1f(L.uScale, u.scale);
      gl.uniform1f(L.uBright, u.bright);
      gl.uniform1f(L.uLevel, inst.lvl);
      gl.uniform1f(L.uGrain, p.grain);
      gl.uniform1f(L.uSoft, p.softness);
      gl.uniform1f(L.uRim, p.rim);
      gl.uniform1f(L.uRimSoft, p.rimSoftness);
      gl.uniform1f(L.uWhite, p.whiteSpread);
      gl.uniform1f(L.uVignette, p.vignette);
      gl.uniform1f(L.uDispersion, p.dispersion);
      const da = p.direction * Math.PI / 180;
      gl.uniform2f(L.uDir, Math.cos(da), Math.sin(da));
      gl.uniform1f(L.uDrift, p.drift);
      gl.uniform2f(L.uFlow, inst.flow[0], inst.flow[1]);
      gl.uniform1f(L.uSeed, inst.seed);
      gl.uniform1f(L.uRadius, u.radius);
      gl.uniform1f(L.uPx, inst.px);
      gl.uniform1fv(L.uFx, inst.fx);
      gl.uniform1fv(L.uBands, inst.bands);
      gl.uniform1fv(L.uWave, inst.wave);
      gl.uniform1f(L.uRimReact, inst.rimReact);
      gl.uniform1f(L.uHue, inst.hue);
      gl.uniform1f(L.uDetail, inst.detail);
      gl.uniform1f(L.uClock, inst.clockTime);
      gl.uniform1f(L.uOrbit, inst.orbitPhase);
      gl.uniform1f(L.uDeep, inst.deep);
      gl.uniform1f(L.uToneMap, p.toneMap);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    for (const inst of list) {
      const ctx = inst.ctx;
      if (!ctx) continue;
      ctx.clearRect(0, 0, inst.px, inst.px);
      ctx.drawImage(c, inst.slotX, inst.slotY, inst.px, inst.px, 0, 0, inst.px, inst.px);
    }
  }
  teardown() {
    this.teardownTimer = null;
    if (this.instances.size) return;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.gl?.getExtension("WEBGL_lose_context")?.loseContext();
    this.gl = null;
    this.canvas = null;
    this.programs.clear();
    this.stats = { ...this.stats, contexts: 0, total: 0, active: 0, drawn: 0, fps: 0, atlas: [0, 0] };
    for (const fn of this.listeners) fn();
  }
};
var sharedRenderer = new SharedRenderer();
var orbRenderer = sharedRenderer;

// src/palettes.ts
var s = (l, c, h) => ({ l, c, h });
var PALETTES = [
  {
    id: "sky",
    name: "Sky",
    stops: [s(0.62, 0.18, 259), s(0.77, 0.12, 244), s(0.96, 0.02, 250), s(0.69, 0.15, 252)]
  },
  {
    id: "dusk",
    name: "Dusk",
    stops: [s(0.8, 0.11, 290), s(0.82, 0.1, 352), s(0.72, 0.085, 248), s(0.91, 0.045, 60)]
  },
  {
    id: "lilac",
    name: "Lilac",
    stops: [s(0.78, 0.1, 302), s(0.7, 0.13, 282), s(0.93, 0.035, 312), s(0.83, 0.08, 252)]
  },
  {
    id: "mint",
    name: "Mint",
    stops: [s(0.88, 0.08, 168), s(0.78, 0.1, 192), s(0.96, 0.03, 150), s(0.7, 0.1, 212)]
  },
  {
    id: "mono",
    name: "Mono",
    stops: [s(0.28, 0, 0), s(0.62, 0, 0), s(0.93, 0, 0), s(0.76, 0, 0)]
  },
  {
    id: "violet-glass",
    name: "Violet Glass",
    stops: [s(0.72, 0.19, 352), s(0.6, 0.2, 300), s(0.9, 0.06, 262), s(0.62, 0.16, 282)]
  },
  {
    id: "swiss-red",
    name: "Swiss Red",
    stops: [s(0.6, 0.22, 30), s(0.7, 0.19, 44), s(0.94, 0.03, 62), s(0.78, 0.14, 56)]
  }
];
var DEFAULT_PALETTE = PALETTES.find((p) => p.id === "sky") ?? PALETTES[0];

// src/options.ts
function resolveOptions(o) {
  return {
    state: o.state ?? "idle",
    palette: o.palette ?? DEFAULT_PALETTE.stops,
    params: { ...DEFAULT_PARAMS, ...o.params },
    noise: o.noise,
    field: o.field,
    motion: o.motion,
    audio: o.audio,
    voice: o.voice,
    reactiveRim: o.reactiveRim,
    variantParams: o.variantParams ?? DEFAULT_VARIANT_PARAMS,
    stateParams: o.stateParams ?? DEFAULT_STATE_PARAMS,
    level: o.level,
    fps: o.fps,
    seed: o.seed,
    transitionSpeed: o.transitionSpeed
  };
}
function fallbackStyle(palette) {
  const [a, b = a] = palette;
  return {
    borderRadius: "50%",
    scale: "0.86",
    background: `radial-gradient(circle at 50% 30%, ${oklchCss(a, 0.9)}, transparent 55%), radial-gradient(circle at 50% 85%, ${oklchCss(b, 0.6)}, transparent 50%), oklch(0.16 0.02 260)`,
    boxShadow: `inset 0 0 0 1px ${oklchCss({ ...a, l: Math.min(a.l + 0.15, 1) }, 0.5)}`
  };
}

// src/vanilla.ts
function createOrb(target, options = {}) {
  let canvas;
  let owned = false;
  if (target instanceof HTMLCanvasElement) canvas = target;
  else {
    canvas = document.createElement("canvas");
    canvas.style.cssText = "display:block;width:100%;height:100%";
    target.appendChild(canvas);
    owned = true;
  }
  canvas.setAttribute("role", "img");
  let opts = { ...options };
  const label = () => canvas.setAttribute("aria-label", `AI assistant, ${opts.state ?? "idle"}`);
  label();
  if (!orbRenderer.isSupported()) {
    const paint = () => Object.assign(canvas.style, fallbackStyle(resolveOptions(opts).palette));
    paint();
    return {
      canvas,
      set(o) {
        opts = { ...opts, ...o };
        label();
        paint();
      },
      destroy() {
        if (owned) canvas.remove();
      }
    };
  }
  const inst = new OrbInstance(canvas, resolveOptions(opts));
  sharedRenderer.register(inst);
  return {
    canvas,
    set(o) {
      opts = { ...opts, ...o };
      label();
      inst.set(resolveOptions(opts));
      sharedRenderer.invalidate(inst);
    },
    destroy() {
      sharedRenderer.unregister(inst);
      if (owned) canvas.remove();
    }
  };
}
var ATTRS = ["state", "size", "noise", "field", "audio", "seed", "fps", "reactive-rim", "listening-motion", "thinking-motion", "speaking-motion"];
var PROPS = ["palette", "params", "motion", "voice", "level", "stateParams", "variantParams", "transitionSpeed"];
function defineOrbElement(tag = "prism-orb") {
  if (typeof customElements === "undefined" || customElements.get(tag)) return;
  class PrismOrbElement extends HTMLElement {
    constructor() {
      super();
      this.handle = null;
      this.props = {};
      const root = this.attachShadow({ mode: "open" });
      root.innerHTML = `<style>:host{display:inline-block;width:160px;aspect-ratio:1;vertical-align:middle}div{width:100%;height:100%}</style><div></div>`;
      this.host = root.querySelector("div");
    }
    connectedCallback() {
      for (const key of PROPS) {
        if (!Object.prototype.hasOwnProperty.call(this, key)) continue;
        const value = this[key];
        delete this[key];
        this.props = { ...this.props, [key]: value };
      }
      this.handle ?? (this.handle = createOrb(this.host, this.options()));
    }
    disconnectedCallback() {
      this.handle?.destroy();
      this.handle = null;
    }
    attributeChangedCallback(name) {
      if (name === "size") {
        const s2 = Number(this.getAttribute("size"));
        this.style.width = s2 > 0 ? `${s2}px` : "";
      }
      this.handle?.set(this.options());
    }
    set(options) {
      this.props = { ...this.props, ...options };
      this.handle?.set(this.options());
    }
    options() {
      const a = (n) => this.getAttribute(n) ?? void 0;
      const num = (n) => this.hasAttribute(n) ? Number(this.getAttribute(n)) : void 0;
      const motion = {
        ...this.props.motion,
        ...a("listening-motion") && { listening: a("listening-motion") },
        ...a("thinking-motion") && { thinking: a("thinking-motion") },
        ...a("speaking-motion") && { speaking: a("speaking-motion") }
      };
      return {
        ...this.props,
        state: a("state") ?? this.props.state,
        noise: a("noise") ?? this.props.noise,
        field: a("field") ?? this.props.field,
        audio: a("audio") ?? this.props.audio,
        seed: num("seed") ?? this.props.seed,
        fps: num("fps") ?? this.props.fps,
        reactiveRim: this.hasAttribute("reactive-rim") || this.props.reactiveRim,
        motion
      };
    }
  }
  PrismOrbElement.observedAttributes = ATTRS;
  for (const key of PROPS) {
    Object.defineProperty(PrismOrbElement.prototype, key, {
      get() {
        return this.props[key];
      },
      set(v) {
        this.set({ [key]: v });
      }
    });
  }
  customElements.define(tag, PrismOrbElement);
}

export {
  ORB_STATES,
  MOTION_STATES,
  MOTIONS,
  DEFAULT_MOTION,
  DEFAULT_PARAMS,
  DEFAULT_STATE_PARAMS,
  DEFAULT_VARIANT_PARAMS,
  NOISES,
  FIELDS,
  sharedRenderer,
  orbRenderer,
  orbMic,
  oklchCss,
  oklchToHex,
  hexToOklch,
  OrbInstance,
  PALETTES,
  DEFAULT_PALETTE,
  resolveOptions,
  fallbackStyle,
  createOrb,
  defineOrbElement
};
