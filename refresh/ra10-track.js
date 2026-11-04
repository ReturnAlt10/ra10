/* RA10 activity tracker — records what a signed-in learner does so they (and their
   teachers, and the site owner) can see real progress: every page, unit section,
   question answered (with the answer written), quiz choice, AI Examiner mark,
   revision-guide section read and paper opened.

   RA10Track.log(kind, { unit, view, ref, title, answer, score, max_score, duration_s, meta })
   RA10Track.flush()          send queued events now
   RA10Track.context()        { unit, path, view, session }

   Events are batched (every few seconds and when the page is hidden) and written to
   public.activity_events under the learner's own account (RLS: own rows only, plus
   teachers of their classes). Guests are never tracked. */
(function () {
  'use strict';
  if (window.RA10Track) return;

  var Q = [];
  var lastSig = {};
  var timer = null;
  var MAX_Q = 200;
  var isTop = (function () { try { return window.top === window; } catch (e) { return false; } })();

  function R() { return window.RA10 || null; }
  function session() { var r = R(); try { return r && r.getSession ? r.getSession() : null; } catch (e) { return null; } }
  function loggedIn() { var r = R(); try { return !!(r && r.isLoggedIn && r.isLoggedIn()); } catch (e) { return false; } }
  function sid() {
    try {
      var k = 'ra10_track_sid', v = sessionStorage.getItem(k);
      if (!v) { v = Date.now().toString(36) + Math.random().toString(36).slice(2, 8); sessionStorage.setItem(k, v); }
      return v;
    } catch (e) { return 'nosession'; }
  }
  function cut(s, n) { s = s == null ? '' : String(s); return s.length > n ? s.slice(0, n) : s; }
  function unitPath() {
    try { var u = window.RA10Units && RA10Units.fromLocation(location.pathname); if (u) return u.path; } catch (e) {}
    var m = String(location.pathname).match(/\/revision\/(?:btec|a-level)\/[^?#]*?(?:unit-\d+|business-\d{4})/i);
    return m ? m[0] : null;
  }
  function context() {
    return {
      unit: unitPath(),
      path: isTop ? location.pathname : (function () { try { return window.top.location.pathname; } catch (e) { return location.pathname; } })(),
      view: document.documentElement.getAttribute('data-ux-view') || null,
      session: sid()
    };
  }

  function log(kind, f) {
    if (!kind) return;
    f = f || {};
    var c = context();
    var row = {
      kind: cut(kind, 32),
      session_id: c.session,
      unit: f.unit !== undefined ? f.unit : c.unit,
      path: cut(f.path || c.path, 300),
      view: f.view !== undefined ? f.view : c.view,
      ref: f.ref != null ? cut(f.ref, 160) : null,
      title: f.title != null ? cut(String(f.title).replace(/\s+/g, ' ').trim(), 600) : null,
      answer: f.answer != null ? cut(f.answer, 12000) : null,
      score: Number.isFinite(Number(f.score)) && f.score !== null && f.score !== '' ? Number(f.score) : null,
      max_score: Number.isFinite(Number(f.max_score)) && f.max_score ? Number(f.max_score) : null,
      duration_s: Number.isFinite(Number(f.duration_s)) ? Math.max(0, Math.min(86400, Math.round(f.duration_s))) : null,
      meta: f.meta || null
    };
    // drop exact repeats fired twice in quick succession (double handlers, re-renders)
    var sig = row.kind + '|' + row.ref + '|' + row.view + '|' + (row.answer || '').slice(0, 80) + '|' + row.score;
    var now = Date.now();
    if (lastSig[sig] && now - lastSig[sig] < 8000) return;
    lastSig[sig] = now;
    row.client_ts = new Date().toISOString();
    Q.push(row);
    if (Q.length > MAX_Q) Q.splice(0, Q.length - MAX_Q);
    schedule();
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(flush, Q.length >= 20 ? 300 : 4000);
  }

  function flush(useBeacon) {
    if (!Q.length) return Promise.resolve();
    var s = session();
    if (!loggedIn() || !s || !s.access_token || !s.user) {
      // not signed in (yet): keep a short queue and retry later
      clearTimeout(timer); timer = setTimeout(flush, 8000);
      return Promise.resolve();
    }
    var raw = R() && R()._raw ? R()._raw : {};
    var url = (raw.SUPABASE_URL || 'https://tcrrgsylxbyyrmnouihl.supabase.co') + '/rest/v1/activity_events';
    var batch = Q.splice(0, 40).map(function (r) {
      var o = {}; for (var k in r) if (k !== 'client_ts') o[k] = r[k];
      o.user_id = s.user.id;
      if (o.meta) o.meta = Object.assign({ ts: r.client_ts }, o.meta);
      return o;
    });
    var body = JSON.stringify(batch);
    try {
      return fetch(url, {
        method: 'POST', keepalive: !!useBeacon && body.length < 60000,
        headers: { 'Content-Type': 'application/json', apikey: raw.SUPABASE_ANON_KEY || '', Authorization: 'Bearer ' + s.access_token, Prefer: 'return=minimal' },
        body: body
      }).then(function (res) {
        if (!res.ok && res.status >= 500) Q = batch.concat(Q).slice(-MAX_Q);   // retry server errors later
        if (Q.length) schedule();
      }, function () { Q = batch.concat(Q).slice(-MAX_Q); schedule(); });
    } catch (e) { return Promise.resolve(); }
  }

  /* ── Page views in the site shell (with time spent) ─────────────────── */
  var page = null;
  function pageTitle() {
    var t = document.title || '';
    var h = document.querySelector('.page.active h1, .page.active h2');
    return (h && h.textContent.trim()) || t;
  }
  function endPage() {
    if (!page) return;
    var secs = (Date.now() - page.t) / 1000;
    if (secs >= 2) log('page_view', { unit: null, view: null, path: page.path, title: page.title, duration_s: secs });
    page = null;
  }
  function startPage() {
    endPage();
    page = { path: location.pathname + location.search, title: '', t: Date.now() };
    setTimeout(function () { if (page) page.title = pageTitle(); }, 600);
  }
  if (isTop) {
    window.addEventListener('ra10:route', startPage);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startPage); else startPage();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') { if (isTop) endPage(); flush(true); }
    else if (isTop && !page) startPage();
  });
  window.addEventListener('pagehide', function () { if (isTop) endPage(); flush(true); });

  window.RA10Track = { log: log, flush: flush, context: context };
})();
