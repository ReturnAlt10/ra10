/* RA10 AI study tools — shared client helper (Study Hub, tool pages, unit apps).
     RA10Tools.api(action, body)   → POST /functions/v1/ai-tools; shows the Premium gate or the usage-limit sheet itself
     RA10Tools.status(force)       → { signed_in, premium, tools: { coach|blurt|prerelease|bughunt: { free, left } } }
     RA10Tools.badge(feature)      → small "Premium" / "3 free tries" / "Free" pill (HTML)
     RA10Tools.gate(feature)       → the "free tries used" sheet
     RA10Tools.mascot(pose, size)  → Tenn, RA10's study buddy (inline SVG): idle | wave | think | cheer | listen
   Server: supabase/functions/ai-tools, supabase/sql/ai-tools.sql. */
(function () {
  'use strict';
  if (window.RA10Tools) return;

  var NAMES = { coach: 'Paragraph coach', blurt: 'Blurt & Grill', prerelease: 'Pre-release simulator', bughunt: 'Bug Hunt' };
  var cache = null, cacheAt = 0;
  function R() { return window.RA10 || null; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ── Tenn the mascot ─────────────────────────────────────────────── */
  var uid = 0;
  function mascot(pose, size) {
    pose = pose || 'idle'; size = size || 96;
    var g = 'tg' + (++uid);
    var happy = pose === 'cheer';
    var eyes = happy
      ? '<path d="M40 58q7-8 14 0M66 58q7-8 14 0" fill="none" stroke="#1b1640" stroke-width="4" stroke-linecap="round"/>'
      : '<ellipse cx="47" cy="58" rx="7.5" ry="9" fill="#fff"/><ellipse cx="73" cy="58" rx="7.5" ry="9" fill="#fff"/>' +
        (pose === 'think' ? '<circle cx="49" cy="54" r="3.6" fill="#1b1640"/><circle cx="75" cy="54" r="3.6" fill="#1b1640"/>' : '<circle cx="48" cy="60" r="3.6" fill="#1b1640"/><circle cx="74" cy="60" r="3.6" fill="#1b1640"/>');
    var mouth = pose === 'think' ? '<path d="M54 79h12" stroke="#1b1640" stroke-width="3.4" stroke-linecap="round"/>'
      : pose === 'listen' ? '<ellipse cx="60" cy="79" rx="4.5" ry="3.6" fill="#1b1640"/>'
      : '<path d="M51 76q9 8 18 0" fill="none" stroke="#1b1640" stroke-width="3.4" stroke-linecap="round"/>';
    var armL = pose === 'cheer' ? '<path d="M24 62q-12-10-10-24" fill="none" stroke="url(#' + g + ')" stroke-width="9" stroke-linecap="round"/>' : '<path d="M24 70q-9 4-10 14" fill="none" stroke="url(#' + g + ')" stroke-width="9" stroke-linecap="round"/>';
    var armR = pose === 'wave' || pose === 'cheer' ? '<path class="t-wave" d="M96 62q12-10 10-24" fill="none" stroke="url(#' + g + ')" stroke-width="9" stroke-linecap="round"/>' : '<path d="M96 70q9 4 10 14" fill="none" stroke="url(#' + g + ')" stroke-width="9" stroke-linecap="round"/>';
    var extra = pose === 'think' ? '<circle cx="100" cy="30" r="3" fill="var(--t-soft,#c9c3ff)"/><circle cx="108" cy="20" r="4.5" fill="var(--t-soft,#c9c3ff)"/>'
      : pose === 'listen' ? '<path d="M102 50q6 10 0 20M108 44q10 16 0 32" fill="none" stroke="var(--t-soft,#c9c3ff)" stroke-width="3" stroke-linecap="round"/>'
      : pose === 'cheer' ? '<path d="M14 24l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM104 14l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" fill="#f5a524"/>' : '';
    return '<svg class="tenn tenn-' + esc(pose) + '" width="' + size + '" height="' + size + '" viewBox="0 0 120 120" role="img" aria-label="Tenn, your RA10 study buddy">' +
      '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--t-a,#7b6dff)"/><stop offset="1" stop-color="var(--t-b,#4636d8)"/></linearGradient></defs>' +
      '<ellipse cx="60" cy="108" rx="30" ry="5" fill="#000" opacity=".08"/>' + armL + armR +
      '<path d="M60 16v10" stroke="var(--t-b,#4636d8)" stroke-width="4" stroke-linecap="round"/><path d="M60 5l2.6 5.8 6.2.8-4.6 4.2 1.2 6.2L60 19l-5.4 3 1.2-6.2-4.6-4.2 6.2-.8z" fill="#f5a524"/>' +
      '<rect x="22" y="26" width="76" height="76" rx="28" fill="url(#' + g + ')"/>' +
      '<path d="M34 40q8-8 22-8" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".28"/>' +
      eyes + '<circle cx="37" cy="72" r="5" fill="#ff8fb1" opacity=".35"/><circle cx="83" cy="72" r="5" fill="#ff8fb1" opacity=".35"/>' + mouth + extra + '</svg>';
  }

  /* ── styles (gate sheet, pills) ─────────────────────────────────── */
  function css() {
    if (document.getElementById('rtl-css')) return;
    var st = document.createElement('style'); st.id = 'rtl-css';
    st.textContent = [
      '.tenn .t-wave{transform-origin:96px 66px;animation:tennWave 2.4s ease-in-out infinite}',
      '@keyframes tennWave{0%,60%,100%{transform:rotate(0)}70%{transform:rotate(-14deg)}80%{transform:rotate(8deg)}90%{transform:rotate(-8deg)}}',
      '.tenn{display:block;flex:none}',
      '@media (prefers-reduced-motion:reduce){.tenn .t-wave{animation:none}}',
      '.rtl-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:999px;font:700 .72rem/1.2 var(--font-b,"DM Sans",system-ui,sans-serif);letter-spacing:.01em;white-space:nowrap}',
      '.rtl-pill.free{background:#dcfce7;color:#166534}.rtl-pill.try{background:#ede9fe;color:#5b21b6}.rtl-pill.prem{background:#fef3c7;color:#92400e}',
      'html[data-theme="dark"] .rtl-pill.free{background:rgba(34,197,94,.16);color:#86efac}html[data-theme="dark"] .rtl-pill.try{background:rgba(139,92,246,.2);color:#c4b5fd}html[data-theme="dark"] .rtl-pill.prem{background:rgba(245,158,11,.18);color:#fcd34d}',
      '.rtl-ov{position:fixed!important;inset:0;z-index:2147483200;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(18,16,30,.5);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}',
      '.rtl-card{width:min(420px,100%);border-radius:24px;padding:24px 22px 20px;background:var(--color-surface-2,#fff);color:var(--color-text,#1f1d2b);text-align:center;box-shadow:0 30px 80px -20px rgba(0,0,0,.5);font-family:var(--font-b,"DM Sans",system-ui,sans-serif)}',
      'html[data-theme="dark"] .rtl-card{background:#1f1d2a;color:#eeedf5}',
      '.rtl-card .tenn{margin:0 auto 6px}',
      '.rtl-card h3{margin:0 0 6px;font:400 1.6rem/1.2 var(--font-d,"Instrument Serif",Georgia,serif)}',
      '.rtl-card p{margin:0 0 16px;color:var(--color-text-muted,#6b6880);font-size:.95rem;line-height:1.5}',
      '.rtl-card .row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}',
      '.rtl-btn{min-height:44px;padding:10px 18px;border-radius:999px;border:1px solid var(--color-border,#d4d1ca);background:transparent;color:inherit;font:700 .92rem var(--font-b,system-ui);cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}',
      '.rtl-btn.pri{background:#5b4cf5;border-color:#5b4cf5;color:#fff}',
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
  }

  /* ── access ─────────────────────────────────────────────────────── */
  function status(force) {
    var r = R(), c = r && r.getClient ? r.getClient() : null;
    if (!c || !(r.isLoggedIn && r.isLoggedIn())) return Promise.resolve({ signed_in: false });
    if (cache && !force && Date.now() - cacheAt < 60000) return Promise.resolve(cache);
    return c.rpc('ai_tool_status').then(function (res) {
      if (res.error) return { signed_in: true, premium: false, tools: {}, unavailable: true };
      cache = res.data; cacheAt = Date.now(); return cache;
    }, function () { return { signed_in: true, premium: false, tools: {}, unavailable: true }; });
  }
  function badge(feature, st) {
    st = st || cache;
    if (!feature) return '<span class="rtl-pill free">Free</span>';
    if (st && st.premium) return '<span class="rtl-pill prem">Premium</span>';
    var t = st && st.tools && st.tools[feature];
    if (t && t.left > 0) return '<span class="rtl-pill try">' + t.left + ' free ' + (t.left === 1 ? 'try' : 'tries') + '</span>';
    return '<span class="rtl-pill prem">Premium</span>';
  }
  function gate(feature) {
    css();
    var ov = document.createElement('div'); ov.className = 'rtl-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
    ov.innerHTML = '<div class="rtl-card">' + mascot('think', 92) + '<h3>You’ve had your free tries</h3><p>' + esc(NAMES[feature] || 'This tool') + ' is part of <b>RA10 Premium</b>. Everything else on RA10, including the scanner and your daily tasks, stays free.</p>' +
      '<div class="row"><button type="button" class="rtl-btn" data-x>Maybe later</button><a class="rtl-btn pri" href="/upgrade">See Premium</a></div></div>';
    document.documentElement.appendChild(ov);
    var close = function () { ov.remove(); };
    ov.addEventListener('click', function (e) { if (e.target === ov || e.target.closest('[data-x]')) close(); });
    document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
    var b = ov.querySelector('[data-x]'); if (b) b.focus();
  }
  function signIn() {
    try { if (window.top && window.top.openSignInOverlayFallback) return window.top.openSignInOverlayFallback(); } catch (e) {}
    location.href = '/auth';
  }

  function api(action, body) {
    var r = R(), s = r && r.getSession ? r.getSession() : null, raw = (r && r._raw) || {};
    if (!s || !s.access_token) { signIn(); return Promise.reject(Object.assign(new Error('Please sign in to use AI tools.'), { code: 'signin' })); }
    return fetch((raw.SUPABASE_URL || 'https://tcrrgsylxbyyrmnouihl.supabase.co') + '/functions/v1/ai-tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s.access_token, apikey: raw.SUPABASE_ANON_KEY || '' },
      body: JSON.stringify(Object.assign({ action: action }, body || {})),
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (j) {
        if (j && j.code === 'premium') { cache = null; gate(j.feature); throw Object.assign(new Error(j.error), { code: 'premium', handled: true }); }
        if (j && j.code === 'usage_limit') { try { if (r.showUsageLimit) r.showUsageLimit(j.usage, { mode: 'limit' }); } catch (e) {} throw Object.assign(new Error(j.error), { code: 'usage_limit', handled: true }); }
        if (res.status === 404 && !j.error) throw Object.assign(new Error('AI tools are being switched on. Please try again soon.'), { code: 'missing' });
        if (!res.ok || j.ok === false) throw Object.assign(new Error(j.error || 'Something went wrong. Please try again.'), { code: j.code });
        cache = null;   // tries may have changed
        return j;
      });
    });
  }

  css();
  window.RA10Tools = { api: api, status: status, badge: badge, gate: gate, mascot: mascot, names: NAMES, esc: esc };
})();
