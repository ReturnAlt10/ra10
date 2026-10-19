/* RA10 Liquid — one switch for every liquid glass surface on the site.

   Tiers (html[data-glass] reflects the active one so CSS can follow):
     "webgl" — real refraction via @ybouane/liquidglass (vendored, lazy-loaded).
               Only used inside small "stages" (see stage() below), never on
               scrolling content, because it rasterises the stage's DOM.
     "css"   — the optimised tier: backdrop-filter glass from ra10-glass.css.
               Same look minus true refraction, near-zero cost.
     "off"   — solid surfaces (also used for High contrast / Reduce transparency).

   Choosing a tier
     RA10Liquid.setMode('auto' | 'webgl' | 'css' | 'off')   // persisted per device
     ?glass=css in the URL overrides it for one page load.
     RA10Liquid.DEFAULT_MODE below is the site-wide default — set it to 'css'
     to switch everyone to the optimised version in one line.

   'auto' picks WebGL only on capable devices, and a frame-time watchdog
   downgrades to CSS for the rest of the session if a stage makes the page
   drop below ~45fps. */
(function () {
  'use strict';
  if (window.RA10Liquid) return;

  var DEFAULT_MODE = 'auto';
  var STORAGE_KEY = 'ra10_glass_mode';
  var DOWNGRADE_KEY = 'ra10_glass_downgraded';
  var MAX_LIVE_STAGES = 3;          // each stage holds its own WebGL context
  var SLOW_FRAME_MS = 22;           // avg frame budget before downgrading
  var SLOW_INIT_MS = 2500;          // init slower than this → CSS tier (auto mode)
  var KEEP_ALIVE_MS = 60000;        // keep a hidden stage's context warm this long

  var LIB_URL = (function () {
    var src = '';
    try { src = (document.currentScript && document.currentScript.src) || ''; } catch (e) {}
    var base = src ? src.replace(/ra10-liquid\.js(\?.*)?$/, '') : '/refresh/';
    return base + 'vendor/liquidglass-1.0.3.min.js';
  })();

  var libPromise = null;
  var libFailed = false;
  var stages = [];
  var listeners = [];

  function readStored() {
    try { return localStorage.getItem(STORAGE_KEY) || ''; } catch (e) { return ''; }
  }
  function queryOverride() {
    try { return new URLSearchParams(location.search).get('glass') || ''; } catch (e) { return ''; }
  }
  function valid(m) { return m === 'auto' || m === 'webgl' || m === 'css' || m === 'off'; }

  function preferred() {
    var q = queryOverride();
    if (valid(q)) return q;
    var s = readStored();
    return valid(s) ? s : DEFAULT_MODE;
  }

  function mq(q) { try { return window.matchMedia(q).matches; } catch (e) { return false; } }

  function forcedSolid() {
    var html = document.documentElement;
    return html.classList.contains('a11y-contrast') || mq('(prefers-reduced-transparency: reduce)') || mq('(forced-colors: active)');
  }

  var webglOk = null;
  function hasWebGL() {
    if (webglOk !== null) return webglOk;
    try {
      var c = document.createElement('canvas');
      webglOk = !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
    } catch (e) { webglOk = false; }
    return webglOk;
  }

  function capableDevice() {
    var nav = navigator || {};
    var conn = nav.connection || {};
    if (conn.saveData) return false;
    if ((nav.deviceMemory || 8) < 4) return false;
    if ((nav.hardwareConcurrency || 8) < 4) return false;
    if (mq('(prefers-reduced-motion: reduce)')) return false;
    // Phones: CSS glass looks almost identical at that size and saves battery.
    if (mq('(pointer: coarse)') && Math.min(screen.width || 0, screen.height || 0) < 600) return false;
    return hasWebGL();
  }

  function sessionDowngraded() {
    try { return sessionStorage.getItem(DOWNGRADE_KEY) === '1'; } catch (e) { return false; }
  }

  function resolve() {
    var m = preferred();
    if (m === 'off' || forcedSolid()) return 'off';
    if (m === 'css') return 'css';
    if (m === 'webgl') return hasWebGL() && !libFailed ? 'webgl' : 'css';
    return capableDevice() && !sessionDowngraded() ? 'webgl' : 'css';
  }

  var active = 'css';
  function apply() {
    var next = resolve();
    var changed = next !== active;
    active = next;
    document.documentElement.setAttribute('data-glass', active);
    if (changed) {
      stages.forEach(function (s) { s._sync(); });
      listeners.forEach(function (fn) { try { fn(active); } catch (e) {} });
    }
  }

  function loadLib() {
    if (!libPromise) {
      libPromise = import(LIB_URL).then(function (mod) { return mod.LiquidGlass; });
      libPromise.catch(function () { libPromise = null; });
    }
    return libPromise;
  }

  function liveCount() {
    return stages.filter(function (s) { return !!s._instance; }).length;
  }

  // Watch frame times for a couple of seconds after a stage comes alive.
  function watchFrames() {
    if (preferred() !== 'auto') return;
    var start = performance.now(), last = start, total = 0, frames = 0;
    function tick(now) {
      total += now - last; frames++; last = now;
      if (now - start < 2000) { requestAnimationFrame(tick); return; }
      if (document.visibilityState === 'visible' && frames > 10 && total / frames > SLOW_FRAME_MS) downgrade();
    }
    requestAnimationFrame(function (t) { last = t; start = t; requestAnimationFrame(tick); });
  }

  // Auto mode only: drop to the CSS tier for the rest of this session.
  function downgrade() {
    if (preferred() !== 'auto') return;
    try { sessionStorage.setItem(DOWNGRADE_KEY, '1'); } catch (e) {}
    apply();
  }

  // Start heavy work (shader compile + capture) when the main thread is idle,
  // so it never lands on top of a click or a panel animation.
  function idle() {
    return new Promise(function (resolve) {
      if (window.requestIdleCallback) requestIdleCallback(function () { resolve(); }, { timeout: 1500 });
      else setTimeout(resolve, 300);
    });
  }

  /* stage(root, glassEls, opts) — upgrade a small container to WebGL glass.
     root:     element whose DIRECT children include the glass elements and a
               static backdrop (ideally a <canvas> — it's drawn without DOM capture).
     glassEls: array of direct children to render as glass.
     opts.config: per-element GlassConfig defaults for this stage.
     The elements keep their CSS-glass styling at all times; while WebGL is
     live, root gets .lg-live so CSS can drop its own backdrop blur.
     Returns { refresh(el?), setEnabled(bool), destroy() }. Stages auto-pause when off-screen. */
  function stage(root, glassEls, opts) {
    opts = opts || {};
    var s = {
      _instance: null,
      _pending: false,
      _visible: false,
      _enabled: true,
      _dead: false,
      _sync: function () {
        if (s._dead) return;
        var want = active === 'webgl' && s._visible && s._enabled && document.visibilityState === 'visible';
        if (want) {
          clearTimeout(s._stopTimer); s._stopTimer = 0;
          if (!s._instance && !s._pending) start();
        } else if (s._instance && !s._stopTimer) {
          // Hidden, not gone: keep the context warm for a while so reopening
          // a panel doesn't pay the shader-compile cost again. Leaving the
          // WebGL tier tears down immediately.
          if (active !== 'webgl') stop();
          else s._stopTimer = setTimeout(function () { s._stopTimer = 0; s._sync(); if (!s._visible || !s._enabled || document.visibilityState !== 'visible') stop(); }, KEEP_ALIVE_MS);
        }
      },
      // Pause/resume explicitly (e.g. a panel hidden with visibility:hidden,
      // which IntersectionObserver still reports as visible).
      setEnabled: function (on) { s._enabled = !!on; s._sync(); },
      refresh: function (el) { if (s._instance) { try { s._instance.markChanged(el); } catch (e) {} } },
      destroy: function () {
        s._dead = true;
        stop();
        if (io) io.disconnect();
        stages = stages.filter(function (x) { return x !== s; });
      }
    };

    function start() {
      if (liveCount() >= MAX_LIVE_STAGES) return;
      s._pending = true;
      var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
      var t0 = 0;
      Promise.all([loadLib(), fontsReady, idle()]).then(function (r) {
        var LiquidGlass = r[0];
        if (s._dead || active !== 'webgl' || !s._visible || !s._enabled) return null;
        var els = glassEls.filter(function (el) { return el && el.parentElement === root; });
        if (!els.length) return null;
        t0 = performance.now();
        return LiquidGlass.init({ root: root, glassElements: els, defaults: opts.config || {} });
      }).then(function (inst) {
        s._pending = false;
        if (!inst) return;
        if (s._dead || active !== 'webgl' || !s._visible || !s._enabled) { try { inst.destroy(); } catch (e) {} return; }
        s._instance = inst;
        // The library disables text selection on its root; stages only hold
        // a canvas + empty glass shapes, so nothing selectable is affected.
        root.classList.add('lg-live');
        if (preferred() === 'auto' && performance.now() - t0 > SLOW_INIT_MS) { downgrade(); return; }
        watchFrames();
      }).catch(function (err) {
        s._pending = false;
        if (window.console && console.warn) console.warn('RA10Liquid: WebGL glass unavailable, using CSS glass.', err);
        libFailed = true;   // never retry a broken library on this page
        try { sessionStorage.setItem(DOWNGRADE_KEY, '1'); } catch (e) {}
        apply();
      });
    }

    function stop() {
      clearTimeout(s._stopTimer); s._stopTimer = 0;
      root.classList.remove('lg-live');
      if (s._instance) { try { s._instance.destroy(); } catch (e) {} }
      s._instance = null;
    }

    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { s._visible = e.isIntersecting && e.intersectionRatio > 0; });
        s._sync();
      });
      io.observe(root);
    } else {
      s._visible = true;
    }

    stages.push(s);
    s._sync();
    return s;
  }

  document.addEventListener('visibilitychange', function () { stages.forEach(function (s) { s._sync(); }); });
  ['(prefers-reduced-transparency: reduce)', '(prefers-reduced-motion: reduce)', '(forced-colors: active)'].forEach(function (q) {
    try { window.matchMedia(q).addEventListener('change', apply); } catch (e) {}
  });
  // RA10's accessibility panel toggles html.a11y-contrast.
  try {
    new MutationObserver(apply).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  } catch (e) {}

  window.RA10Liquid = {
    get mode() { return active; },
    get preference() { return preferred(); },
    DEFAULT_MODE: DEFAULT_MODE,
    setMode: function (m) {
      if (!valid(m)) return;
      try { localStorage.setItem(STORAGE_KEY, m); } catch (e) {}
      try { sessionStorage.removeItem(DOWNGRADE_KEY); } catch (e) {}
      apply();
    },
    onChange: function (fn) { if (typeof fn === 'function') listeners.push(fn); },
    stage: stage,
    stats: function () {
      return stages.map(function (s) { return { live: !!s._instance, visible: s._visible, fps: s._instance ? s._instance.fps : 0 }; });
    }
  };

  apply();
})();
