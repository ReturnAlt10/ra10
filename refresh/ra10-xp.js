/* RA10 XP layer — XP boosts (2x / 3x), "you overtook someone" popups and the
   boost countdown pill. Loaded on every page by ra10-refresh.js.

   Every app awards XP with POST /rest/v1/rpc/increment_xp. We watch for those
   calls (instead of editing every app), then:
     1. route it through xp_claim: the server pays what was really earned (+ boost bonus);
     2. compare the leaderboard before/after and, if you moved up past someone,
        show the overtake popup.
   window.RA10XP: boosts(), claim(source), activate(id), refresh(), onChange(fn),
                  BOOSTS (reward catalogue), formatLeft(ms). */
(function () {
  'use strict';
  if (window.RA10XP) return;

  var state = { boosts: [], board: null, me: null, lastPopup: 0, listeners: [], ready: false, available: true };

  var BOOSTS = {
    daily_practice: { title: 'Practice powerhouse', how: 'Answer 10 questions today', mult: 2, mins: 15 },
    daily_tasks: { title: 'Task master', how: 'Complete all of today’s tasks', mult: 2, mins: 30 },
    streak_7: { title: 'Week-long streak', how: 'Practise 7 days in a row', mult: 3, mins: 15 },
    weekly_podium: { title: 'Podium finish', how: 'Finish last week in the top 3', mult: 3, mins: 30 },
  };

  function R() { return window.RA10 || null; }
  function client() { var r = R(); try { return r && r.getClient ? r.getClient() : null; } catch (e) { return null; } }
  function loggedIn() { var r = R(); return !!(r && r.isLoggedIn && r.isLoggedIn()); }
  function myId() { var r = R(); var s = r && r.getSession ? r.getSession() : null; return (s && s.user && s.user.id) || ''; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function emit() { state.listeners.forEach(function (fn) { try { fn(state); } catch (e) {} }); }
  function missing(err) { var m = String((err && (err.message || err.code)) || ''); return /does not exist|Could not find|PGRST20[2-5]|42883|42P01/.test(m); }
  var lastIntegrityWarning = 0;
  // Shown when the server holds an award back (rushed/random answers, or a
  // session started and ended just for the completion XP). Kept quiet, calm
  // and short — it is a gentle nudge, not a telling-off, and it never
  // contradicts a success toast because the app only toasts on a real award.
  function showIntegrityWarning() {
    if (Date.now() - lastIntegrityWarning < 60000 || document.querySelector('.rxp-integrity-warning')) return;
    lastIntegrityWarning = Date.now();
    document.querySelectorAll('#xp-toast, .xp-toast').forEach(function (el) {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    var t = document.createElement('div');
    t.className = 'rxp-toast rxp-integrity-warning';
    t.setAttribute('role', 'status');
    t.textContent = 'Taking a quick XP breather — answer a few real questions and it will pick back up.';
    document.body.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 5000);
  }

  /* ── Styles ─────────────────────────────────────────────────────────── */
  (function css() {
    if (document.getElementById('rxp-css')) return;
    var st = document.createElement('style');
    st.id = 'rxp-css';
    st.textContent = [
      '.rxp-widget{position:fixed;left:0;right:0;margin-inline:auto;width:max-content;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:2147483200;display:inline-flex;align-items:stretch;border-radius:999px;filter:drop-shadow(0 12px 26px rgba(239,68,68,.35));animation:rxpIn .4s cubic-bezier(.2,.9,.3,1.3) both}',
      '.rxp-pill{display:inline-flex;align-items:center;gap:8px;padding:8px 12px 8px 8px;border:0;border-radius:999px 0 0 999px;font:700 .82rem/1 var(--font-b,system-ui,sans-serif);color:#fff;background:radial-gradient(120% 90% at 30% 0%,rgba(255,255,255,.35),transparent 55%),linear-gradient(135deg,#f59e0b,#ef4444 60%,#d946ef);box-shadow:inset 0 1px 1px rgba(255,255,255,.5);cursor:pointer}',
      '.rxp-close{width:30px;border:0;border-left:1px solid rgba(255,255,255,.3);border-radius:0 999px 999px 0;color:#fff;background:linear-gradient(135deg,#ef4444,#d946ef);font:700 1rem/1 var(--font-b,system-ui);cursor:pointer}',
      '.rxp-close:hover,.rxp-close:focus-visible{background:#b91c1c}',
      '.rxp-pill b{display:inline-flex;align-items:center;justify-content:center;min-width:34px;height:26px;padding:0 6px;border-radius:999px;background:rgba(255,255,255,.25);font-size:.9rem}',
      '.rxp-pill .t{font-variant-numeric:tabular-nums}',
      '@media(max-width:640px){.rxp-widget{bottom:calc(90px + env(safe-area-inset-bottom,0px))}.rxp-close{width:28px}}',
      '@keyframes rxpIn{from{opacity:0;transform:translateY(12px) scale(.9)}to{opacity:1;transform:none}}',
      '.rxp-overlay{position:fixed;inset:0;z-index:2147483640;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,12,20,.45);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);animation:rxpFade .2s ease both}',
      '@keyframes rxpFade{from{opacity:0}to{opacity:1}}',
      '.rxp-card{position:relative;width:min(420px,100%);border-radius:28px;padding:26px 22px 20px;color:#14161c;background:linear-gradient(180deg,#ffffff,#f6f7fb);box-shadow:0 30px 80px -20px rgba(0,0,0,.5),inset 0 1px 0 #fff;overflow:hidden;font-family:var(--font-b,system-ui,sans-serif);animation:rxpPop .45s cubic-bezier(.2,.9,.3,1.25) both;text-align:center}',
      '[data-theme="dark"] .rxp-card{color:#eef0f5;background:linear-gradient(180deg,#22242c,#191a20);box-shadow:0 30px 80px -20px rgba(0,0,0,.8),inset 0 1px 0 rgba(255,255,255,.08)}',
      '@keyframes rxpPop{from{opacity:0;transform:translateY(24px) scale(.9)}to{opacity:1;transform:none}}',
      '.rxp-rank{display:inline-flex;align-items:center;justify-content:center;width:84px;height:84px;border-radius:50%;margin:0 auto 10px;font:800 2rem/1 var(--font-b,system-ui);color:#fff;background:radial-gradient(120% 90% at 30% 10%,rgba(255,255,255,.5),transparent 55%),linear-gradient(135deg,#22c55e,#16a34a);box-shadow:0 14px 30px -10px rgba(22,163,74,.7);animation:rxpBounce .9s .2s cubic-bezier(.3,1.6,.5,1) both}',
      '@keyframes rxpBounce{0%{transform:scale(.4)}60%{transform:scale(1.12)}100%{transform:scale(1)}}',
      '.rxp-card h3{margin:0 0 4px;font-size:1.35rem;font-weight:800;letter-spacing:-.01em}',
      '.rxp-card p{margin:0 0 16px;color:#5b6170;font-size:.9rem}',
      '[data-theme="dark"] .rxp-card p{color:#a3a9b8}',
      '.rxp-list{position:relative;display:grid;gap:8px;margin:0 0 18px;text-align:left}',
      '.rxp-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:16px;background:rgba(20,22,28,.05);transition:transform .9s cubic-bezier(.5,0,.2,1),box-shadow .3s}',
      '[data-theme="dark"] .rxp-row{background:rgba(255,255,255,.06)}',
      '.rxp-row.me{background:linear-gradient(135deg,#dcfce7,#bbf7d0);box-shadow:0 0 0 2px #22c55e,0 12px 24px -12px rgba(22,163,74,.6);z-index:2;position:relative}',
      '[data-theme="dark"] .rxp-row.me{background:linear-gradient(135deg,#14532d,#166534)}',
      '.rxp-row.passed{opacity:.75}',
      '.rxp-row .n{width:26px;font-weight:800;color:#6b7280;font-variant-numeric:tabular-nums}',
      '.rxp-row .a{width:32px;height:32px;border-radius:50%;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:.8rem;color:#fff;background:linear-gradient(135deg,#60a5fa,#a78bfa);overflow:hidden}',
      '.rxp-row .a img{width:100%;height:100%;object-fit:cover}',
      '.rxp-row .nm{flex:1;min-width:0;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.rxp-row .x{font-weight:800;font-variant-numeric:tabular-nums}',
      '.rxp-gain{display:inline-flex;align-items:center;gap:6px;margin:0 0 14px;padding:6px 12px;border-radius:999px;background:#fef3c7;color:#92400e;font-weight:800;font-size:.85rem}',
      '.rxp-actions{display:flex;gap:8px}',
      '.rxp-btn{flex:1;height:46px;border:0;border-radius:14px;font:800 .9rem/1 var(--font-b,system-ui);cursor:pointer;background:rgba(20,22,28,.07);color:inherit}',
      '[data-theme="dark"] .rxp-btn{background:rgba(255,255,255,.1)}',
      '.rxp-btn.go{color:#fff;background:linear-gradient(180deg,#22c55e,#16a34a);box-shadow:0 4px 0 #15803d}',
      '.rxp-btn.go:active{transform:translateY(2px);box-shadow:0 2px 0 #15803d}',
      '.rxp-confetti{position:absolute;inset:0;pointer-events:none;overflow:hidden}',
      '.rxp-confetti i{position:absolute;top:-12px;width:8px;height:14px;border-radius:2px;animation:rxpFall 1.6s ease-in forwards}',
      '@keyframes rxpFall{to{transform:translateY(520px) rotate(540deg);opacity:0}}',
      '.rxp-toast{position:fixed;left:50%;top:18px;z-index:2147483645;transform:translateX(-50%);padding:9px 18px;border-radius:999px;color:#3a3325;font:700 .84rem/1.3 var(--font-b,system-ui);background:linear-gradient(135deg,#fef3c7,#fde68a);border:1px solid rgba(120,90,0,.18);box-shadow:0 10px 26px -12px rgba(120,90,0,.4);max-width:calc(100vw - 32px);text-align:center;animation:rxpIn .35s ease both}',
      '[data-theme="dark"] .rxp-toast{color:#fde68a;background:linear-gradient(135deg,#3a2f10,#4a3a12);border-color:rgba(253,230,138,.25)}',
      '@media (prefers-reduced-motion:reduce){.rxp-card,.rxp-rank,.rxp-pill,.rxp-row{animation:none!important;transition:none!important}.rxp-confetti{display:none}}',
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
  })();

  /* ── Data ───────────────────────────────────────────────────────────── */
  function rpc(name, args) {
    var c = client();
    if (!c) return Promise.reject(new Error('offline'));
    return c.rpc(name, args || {}).then(function (res) { if (res.error) throw res.error; return res.data; });
  }

  function activeBoost() {
    var now = Date.now();
    return state.boosts.find(function (b) { return b.expires_at && new Date(b.expires_at).getTime() > now; }) || null;
  }

  function loadBoosts() {
    if (!loggedIn() || !state.available) return Promise.resolve([]);
    return rpc('get_my_boosts').then(function (rows) {
      state.boosts = Array.isArray(rows) ? rows : [];
      renderPill(); emit();
      return state.boosts;
    }, function (err) { if (missing(err)) state.available = false; return []; });
  }

  function snapshot() {
    if (!loggedIn()) return Promise.resolve(null);
    return Promise.all([
      rpc('get_leaderboard', { limit_count: 60 }).catch(function () { return null; }),
      rpc('get_my_rank').catch(function () { return null; }),
    ]).then(function (r) {
      var rows = Array.isArray(r[0]) ? r[0] : null;
      var mine = Array.isArray(r[1]) ? r[1][0] : r[1];
      if (rows) state.board = rows;
      if (mine) state.me = mine;
      return { rows: rows, me: mine };
    });
  }

  /* ── Award hook ─────────────────────────────────────────────────────── */
  // Every app still calls POST /rest/v1/rpc/increment_xp {amount}. Since XP v3
  // (supabase/sql/xp-v3.sql) the server only pays what real learning earned, so:
  //   1. queued activity is sent first, so the server can see the work behind the award;
  //   2. the call goes to xp_claim instead, which returns what was granted plus any
  //      boost bonus (added on the server); the app still receives a plain number;
  //   3. the app's own "+50 XP" toast is corrected to what was really granted.
  // Until xp-v3.sql is applied, xp_claim is missing (404) and the original call is used.
  // Every couple of minutes the rest of the earned XP is paid out too (reading the
  // guide, quiz answers in apps that never call increment_xp).
  var origFetch = window.fetch ? window.fetch.bind(window) : null;
  var isTop = (function () { try { return window.top === window; } catch (e) { return false; } })();
  var v3 = true;
  var lastSettleGrantAt = 0;
  function flushTrack() {
    try { return window.RA10Track && RA10Track.flush ? Promise.resolve(RA10Track.flush()).catch(function () {}) : Promise.resolve(); }
    catch (e) { return Promise.resolve(); }
  }
  function numberResponse(v) { return new Response(JSON.stringify(v), { status: 200, headers: { 'Content-Type': 'application/json' } }); }

  // Unit apps show "+50 XP — Practice 5 complete!" in #xp-toast; make the number honest.
  var toastFix = null;
  function fixAppToast(asked, granted) {
    if (!(asked > 0) || asked === granted || !document.body || typeof MutationObserver === 'undefined') return;
    var re = new RegExp('\\+\\s?' + asked + '\\s?XP');
    function apply() {
      document.querySelectorAll('#xp-toast, .xp-toast').forEach(function (el) {
        if (re.test(el.textContent)) el.textContent = el.textContent.replace(re, '+' + granted + ' XP');
      });
    }
    if (toastFix) toastFix.disconnect();
    toastFix = new MutationObserver(apply);
    toastFix.observe(document.body, { childList: true, subtree: true, characterData: true });
    setTimeout(function () { if (toastFix) { toastFix.disconnect(); toastFix = null; } }, 3000);
  }

  if (origFetch) {
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var isXpCall = /\/rest\/v1\/rpc\/increment_xp(\?|$)/.test(url) && init && init.body && !window.__rxpInternal;
      if (!isXpCall) return origFetch(input, init);
      var amount = 0;
      try { amount = Number(JSON.parse(init.body).amount) || 0; } catch (e) {}
      if (!v3 || amount <= 0) return origFetch(input, init).then(legacyResult);

      return flushTrack().then(function () {
        var claimInit = Object.assign({}, init, { body: JSON.stringify({ p_amount: Math.min(100, Math.round(amount)), p_reason: 'app' }) });
        return origFetch(url.replace(/\/rpc\/increment_xp(\?.*)?$/, '/rpc/xp_claim'), claimInit);
      }).then(function (res) {
        if (res.status === 404) { v3 = false; return origFetch(input, init).then(legacyResult); }
        if (!res.ok) return res;
        return res.json().then(function (j) {
          var granted = Number(j && j.granted) || 0;
          var bonus = Number(j && j.bonus) || 0;
          if (granted > 0) { fixAppToast(amount, granted); onAward(granted, bonus, Number(j.multiplier) || 1); }
          else if (amount >= 10 && Date.now() - lastSettleGrantAt > 300000) showIntegrityWarning();
          return numberResponse(granted);
        }, function () { return numberResponse(0); });
      });
    };
  }
  function legacyResult(res) {
    if (res && res.ok) {
      res.clone().json().then(function (v) {
        var g = Number(Array.isArray(v) ? v[0] : v);
        if (Number.isFinite(g) && g > 0) onAward(g, 0, 1);
      }, function () {});
    }
    return res;
  }

  // Pay out the rest of what was earned (top window only, while the tab is open).
  var settling = false;
  function settle() {
    if (!v3 || settling || !isTop || !loggedIn() || document.visibilityState !== 'visible') return;
    settling = true;
    flushTrack().then(function () { return rpc('xp_claim', { p_amount: 0, p_reason: 'revision' }); }).then(function (j) {
      var g = Number(j && j.granted) || 0, b = Number(j && j.bonus) || 0;
      if (g > 0) {
        lastSettleGrantAt = Date.now();
        toast('+' + (g + b) + ' XP for your revision' + (b ? ' · ' + j.multiplier + 'x boost' : ''));
        onAward(g, b, Number(j.multiplier) || 1, true);
      }
    }, function (err) { if (missing(err)) v3 = false; }).then(function () { settling = false; }, function () { settling = false; });
  }

  var awardQueue = Promise.resolve();
  function onAward(base, bonus, mult, quiet) {
    awardQueue = awardQueue.then(function () { return handleAward(base, bonus || 0, mult || 1, quiet); }).catch(function () {});
    try { window.dispatchEvent(new CustomEvent('ra10:xp', { detail: { granted: base, bonus: bonus || 0 } })); } catch (e) {}
  }

  function handleAward(base, extra, mult, quiet) {
    var before = state.board ? state.board.slice() : null;
    var beforeMe = state.me ? Object.assign({}, state.me) : null;
    var boost = activeBoost();
    if (extra > 0 && !quiet) toast('+' + extra + ' bonus XP · ' + mult + 'x boost');
    return snapshot().then(function (after) {
      if (!after || !before || !beforeMe || !after.me) return;
      var oldRank = Number(beforeMe.rank) || 0;
      var newRank = Number(after.me.rank) || 0;
      if (!oldRank || !newRank || newRank >= oldRank) return;
      if (Date.now() - state.lastPopup < 15000) return;
      state.lastPopup = Date.now();
      showOvertake(before, after.rows || [], oldRank, newRank, base + extra, boost);
    });
  }

  /* ── Overtake popup ─────────────────────────────────────────────────── */
  function nameOf(u) { return u ? (u.username ? '@' + u.username : (u.full_name || 'Player')) : 'Player'; }
  function initials(u) { var n = (u && (u.full_name || u.username)) || '?'; return n.split(/[\s_]+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase(); }
  function avatar(u) {
    var pic = u && u.profile_pic_url;
    return '<span class="a">' + (pic ? '<img alt="" src="' + esc(pic) + '">' : esc(initials(u))) + '</span>';
  }

  function showOvertake(beforeRows, afterRows, oldRank, newRank, gained, boost) {
    if (document.querySelector('.rxp-overlay')) return;
    var id = myId();
    var me = afterRows.find(function (u) { return u.id === id; }) || { id: id, username: (R().getProfile() || {}).username, full_name: (R().getProfile() || {}).full_name, profile_pic_url: (R().getProfile() || {}).profile_pic_url, xp_this_week: state.me && state.me.xp_this_week };
    // People between my new and old rank (the ones I just passed), closest first.
    var passed = beforeRows.slice(newRank - 1, oldRank - 1).filter(function (u) { return u.id !== id; });
    var shown = passed.slice(-3);
    var above = afterRows[newRank - 2] && afterRows[newRank - 2].id !== id ? afterRows[newRank - 2] : null;
    var meRow = { u: me, kind: 'me' };
    function rankBefore(u) { return newRank + passed.indexOf(u); }   // their rank before I passed them

    var ov = document.createElement('div');
    ov.className = 'rxp-overlay';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', 'You moved up the leaderboard');
    var firstName = shown.length ? nameOf(shown[shown.length - 1]) : '';
    ov.innerHTML = '<div class="rxp-card"><div class="rxp-confetti"></div>' +
      '<div class="rxp-rank">#' + newRank + '</div>' +
      '<h3>You moved up ' + (oldRank - newRank) + ' place' + (oldRank - newRank === 1 ? '' : 's') + '!</h3>' +
      '<p>' + (shown.length === 1 ? 'You just overtook <b>' + esc(firstName) + '</b>.' : 'You overtook ' + passed.length + ' players this time.') + ' Keep going to climb higher.</p>' +
      '<div class="rxp-gain">⚡ +' + gained + ' XP' + (boost ? ' · ' + boost.multiplier + 'x boost' : '') + '</div>' +
      '<div class="rxp-list"></div>' +
      '<div class="rxp-actions"><button type="button" class="rxp-btn" data-k>Keep going</button><button type="button" class="rxp-btn go" data-l>See leaderboard</button></div></div>';
    document.body.appendChild(ov);
    var list = ov.querySelector('.rxp-list');
    function rowHtml(r, rankShown) {
      return '<div class="rxp-row ' + r.kind + '"><span class="n">' + rankShown + '</span>' + avatar(r.u) + '<span class="nm">' + esc(nameOf(r.u)) + (r.kind === 'me' ? ' (you)' : '') + '</span><span class="x">' + Number(r.u.xp_this_week || 0) + ' XP</span></div>';
    }
    // Initial order: [above], passed..., me (me at the bottom = old position).
    var order = (above ? [{ u: above, kind: '' }] : []).concat(shown.map(function (u) { return { u: u, kind: 'passed' }; })).concat([meRow]);
    list.innerHTML = order.map(function (r, i) {
      var rank = r.kind === 'me' ? oldRank : (r.kind === 'passed' ? rankBefore(r.u) : newRank - 1);
      return rowHtml(r, rank);
    }).join('');
    var els = Array.prototype.slice.call(list.children);
    var meEl = els[els.length - 1];
    var passedEls = els.slice(above ? 1 : 0, els.length - 1);
    // Animate: me slides up over the passed rows, they slide down one slot.
    requestAnimationFrame(function () {
      setTimeout(function () {
        if (!passedEls.length) return;
        var step = meEl.offsetHeight + 8;
        meEl.style.transform = 'translateY(' + (-step * passedEls.length) + 'px)';
        passedEls.forEach(function (el, i) {
          el.style.transform = 'translateY(' + step + 'px)';
          var n = el.querySelector('.n');
          var after = rankBefore(shown[i]) + 1;
          setTimeout(function () { if (n) n.textContent = String(after); }, 500);
        });
        var meN = meEl.querySelector('.n');
        setTimeout(function () { if (meN) meN.textContent = String(newRank); }, 500);
        confetti(ov.querySelector('.rxp-confetti'));
      }, 450);
    });
    function close() { ov.remove(); document.removeEventListener('keydown', onKey, true); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey, true);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-k]').onclick = close;
    ov.querySelector('[data-l]').onclick = function () { close(); openLeaderboard(); };
    ov.querySelector('[data-k]').focus();
  }

  function confetti(host) {
    if (!host) return;
    var colours = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4'];
    for (var i = 0; i < 40; i++) {
      var c = document.createElement('i');
      c.style.left = Math.random() * 100 + '%';
      c.style.background = colours[i % colours.length];
      c.style.animationDelay = Math.random() * 0.4 + 's';
      c.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      host.appendChild(c);
    }
  }

  function openLeaderboard() {
    try {
      if (window.top !== window && window.top.go) { window.top.go('leaderboard'); return; }
    } catch (e) {}
    if (typeof window.go === 'function') { window.go('leaderboard'); return; }
    window.top.location.href = '/index.html#/leaderboard';
  }

  /* ── Boost pill + toast ─────────────────────────────────────────────── */
  var pill = null, widget = null, tick = null, dismissed = false, dismissedBoostId = null;
  function formatLeft(ms) {
    var s = Math.max(0, Math.round(ms / 1000));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }
  function renderPill() {
    var b = activeBoost();
    if (b && dismissedBoostId !== b.id) dismissed = false;
    if (!b || dismissed) {
      if (widget) { widget.remove(); widget = null; pill = null; }
      document.querySelectorAll('.rxp-widget, .rxp-pill').forEach(function (el) { el.remove(); });
      clearInterval(tick); tick = null; return;
    }
    if (!widget) {
      document.querySelectorAll('.rxp-widget, .rxp-pill').forEach(function (el) { el.remove(); });
      widget = document.createElement('div');
      widget.className = 'rxp-widget';
      widget.setAttribute('role', 'group');
      pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'rxp-pill';
      pill.title = 'XP boost active - open the leaderboard';
      pill.onclick = openLeaderboard;
      var close = document.createElement('button');
      close.type = 'button';
      close.className = 'rxp-close';
      close.setAttribute('aria-label', 'Close XP boost widget');
      close.title = 'Close';
      close.textContent = '×';
      close.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        dismissed = true;
        dismissedBoostId = b.id;
        renderPill();
      };
      widget.appendChild(pill);
      widget.appendChild(close);
      document.body.appendChild(widget);
    }
    function upd() {
      var left = new Date(b.expires_at).getTime() - Date.now();
      if (left <= 0) { dismissed = false; renderPill(); emit(); return; }
      pill.innerHTML = '<b>' + b.multiplier + 'x</b><span>XP boost</span><span class="t">' + formatLeft(left) + '</span>';
    }
    upd();
    clearInterval(tick);
    tick = setInterval(upd, 1000);
  }
  function toast(text) {
    var t = document.createElement('div');
    t.className = 'rxp-toast';
    t.setAttribute('role', 'status');
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(function () { t.style.transition = 'opacity .3s'; t.style.opacity = '0'; }, 2600);
    setTimeout(function () { t.remove(); }, 3000);
  }

  /* ── Public actions ─────────────────────────────────────────────────── */
  function claim(source) {
    return rpc('claim_xp_boost', { p_source: source }).then(function (row) { return loadBoosts().then(function () { return row; }); });
  }
  function activate(id) {
    return rpc('activate_xp_boost', { p_id: id }).then(function (row) { return loadBoosts().then(function () { toast('⚡ ' + row.multiplier + 'x XP boost on for ' + row.minutes + ' minutes!'); return row; }); });
  }

  function boot() {
    var tries = 0;
    (function wait() {
      var r = R();
      if (r && typeof r.isLoggedIn === 'function' && client()) {
        state.ready = true;
        if (loggedIn()) { loadBoosts(); snapshot(); }
        if (typeof r.on === 'function') r.on('authchange', function () { state.boosts = []; renderPill(); if (loggedIn()) { loadBoosts(); snapshot(); } });
        setInterval(function () { if (loggedIn() && document.visibilityState === 'visible') snapshot(); }, 120000);
        setInterval(settle, 120000);
        document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') setTimeout(settle, 1500); });
        setTimeout(settle, 8000);
        return;
      }
      if (++tries < 80) setTimeout(wait, 250);
    })();
  }

  window.RA10XP = {
    BOOSTS: BOOSTS,
    boosts: function () { return state.boosts.slice(); },
    active: activeBoost,
    available: function () { return state.available; },
    settle: settle,
    claim: claim,
    activate: activate,
    refresh: function () { return Promise.all([loadBoosts(), snapshot()]); },
    onChange: function (fn) { state.listeners.push(fn); },
    formatLeft: formatLeft,
    // For testing / previews: RA10XP.demoOvertake()
    demoOvertake: function () {
      var rows = [{ id: 'a', username: 'mia_revises', xp_this_week: 410 }, { id: 'b', username: 'sam.k', xp_this_week: 395 }, { id: myId() || 'me', username: 'you', xp_this_week: 380 }];
      showOvertake(rows, [rows[0], { id: myId() || 'me', username: 'you', xp_this_week: 420 }, rows[1]], 3, 2, 40, activeBoost());
    },
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
