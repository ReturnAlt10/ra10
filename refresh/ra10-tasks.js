/* RA10 — Tasks page: five daily tasks that rotate for every learner, and three
   daily games the AI builds from the learner's own unit.

   Server side (supabase/sql/xp-v3.sql + supabase/functions/daily-games):
     get_daily_tasks()        today's 5 tasks with progress the server measured
     claim_daily_task(key)    pays the task's XP once, only if the progress is real
     claim_xp_boost(source)   boost rewards (checked on the server)
     daily-games  state | today | start | finish   (the server re-scores every game)

   RA10Tasks.render(host)  — called by site.js for /tasks. Falls back to the old
   local tasks (site.js renderLegacyGlobalTasksPage) until xp-v3.sql is applied. */
(function () {
  'use strict';
  if (window.RA10Tasks) return;

  var S = { data: null, games: null, unit: null, busy: false, host: null, building: false, cat: {} };
  var $ = function (s, p) { return (p || document).querySelector(s); };
  var $$ = function (s, p) { return Array.prototype.slice.call((p || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function R() { return window.RA10 || null; }
  function client() { try { return R() && R().getClient ? R().getClient() : null; } catch (e) { return null; } }
  function loggedIn() { try { return !!(R() && R().isLoggedIn()); } catch (e) { return false; } }
  function missing(err) { var m = String((err && (err.message || err.code)) || ''); return /does not exist|Could not find|PGRST20[2-5]|42883|42P01/.test(m); }
  function rpc(name, args) {
    var c = client();
    if (!c) return Promise.reject(new Error('offline'));
    return c.rpc(name, args || {}).then(function (res) { if (res.error) throw res.error; return res.data; });
  }
  function units() { return window.RA10Units ? RA10Units.all() : []; }
  function unitOf(p) { return window.RA10Units ? RA10Units.byPath(p) : null; }
  function nav(path) { if (typeof window.go === 'function') window.go(path); else location.href = path; }
  function fmt(n) { return Number(n || 0).toLocaleString('en-GB'); }

  /* ── icons ─────────────────────────────────────────────────────────── */
  var IC = {
    write: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    ai: '<path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/><path d="M19 15l.8 1.9 1.9.8-1.9.8L19 20.4l-.8-1.9-1.9-.8 1.9-.8z"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/>',
    explore: '<path d="M2 5h6a4 4 0 0 1 4 4v11a3 3 0 0 0-3-3H2z"/><path d="M22 5h-6a4 4 0 0 0-4 4v11a3 3 0 0 1 3-3h7z"/>',
    game: '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="15.5" cy="12" r="1"/><circle cx="18" cy="14" r="1"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    match: '<path d="M4 7h6M4 17h6"/><path d="M14 7h6M14 17h6"/><path d="m10 7 4 10M10 17l4-10"/>',
    tf: '<path d="m4 12 4 4 6-8"/><path d="M15 9l5 6M20 9l-5 6"/>',
    fire: '<path d="M12 22c4.4 0 7-2.7 7-6.6 0-3.4-2.2-5.5-3.6-7.4-.6 1.7-1.6 2.7-2.9 3 .4-3.2-1-6.4-3.5-8-.2 3.3-2 5.3-3.6 7.2C4.3 11.5 5 13.6 5 15.4 5 19.3 7.6 22 12 22Z"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  };
  function icon(name, size) { return '<svg width="' + (size || 20) + '" height="' + (size || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[name] || '') + '</svg>'; }

  /* ── styles ────────────────────────────────────────────────────────── */
  function css() {
    if (document.getElementById('rt-css')) return;
    var st = document.createElement('style');
    st.id = 'rt-css';
    st.textContent = [
      '.rt{--rt-card:var(--color-surface-2,#fbfbf9);--rt-line:var(--color-border,#d4d1ca);--rt-text:var(--color-text,#28251d);--rt-muted:var(--color-text-muted,#7a7974);--rt-red:var(--color-primary,#d20000);--rt-ok:#15803d;--rt-ok-bg:#dcfce7;--rt-track:color-mix(in srgb,var(--rt-text) 10%,transparent);font-family:var(--font-b,"DM Sans",system-ui,sans-serif);color:var(--rt-text)}',
      'html[data-theme="dark"] .rt{--rt-ok:#4ade80;--rt-ok-bg:rgba(34,197,94,.14)}',
      '.rt *{box-sizing:border-box}',
      '.rt h2{font-family:var(--font-d,"Instrument Serif",Georgia,serif);font-weight:400;font-size:clamp(1.6rem,4vw,2.1rem);letter-spacing:-.01em;margin:0}',
      '.rt-sub{color:var(--rt-muted);margin:4px 0 0;font-size:.95rem}',
      '.rt-hero{display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:center;padding:22px;border:1px solid var(--rt-line);border-radius:22px;background:radial-gradient(120% 140% at 0% 0%,color-mix(in srgb,var(--rt-red) 9%,transparent),transparent 60%),var(--rt-card);margin-bottom:18px}',
      '.rt-ring{position:relative;width:96px;height:96px}',
      '.rt-ring svg{display:block;transform:rotate(-90deg)}',
      '.rt-ring .tr{fill:none;stroke:var(--rt-track);stroke-width:9}',
      '.rt-ring .ar{fill:none;stroke:var(--rt-red);stroke-width:9;stroke-linecap:round;transition:stroke-dashoffset .8s cubic-bezier(.16,1,.3,1)}',
      '.rt-ring b{position:absolute;inset:0;display:grid;place-items:center;font:700 1.35rem/1 var(--font-b);font-variant-numeric:tabular-nums}',
      '.rt-ring b small{display:block;font-size:.7rem;font-weight:600;color:var(--rt-muted);margin-top:3px;text-align:center}',
      '.rt-kpis{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}',
      '.rt-kpi{display:inline-flex;align-items:center;gap:6px;padding:6px 11px;border-radius:999px;background:var(--rt-track);font-size:.8rem;font-weight:600}',
      '.rt-meter{height:6px;border-radius:999px;background:var(--rt-track);overflow:hidden;margin-top:10px;max-width:420px}',
      '.rt-meter i{display:block;height:100%;background:var(--rt-red);border-radius:inherit;transition:width .6s ease}',
      '.rt-list{display:grid;gap:10px}',
      '.rt-task{display:grid;grid-template-columns:44px 1fr auto;gap:14px;align-items:center;padding:14px 16px;border:1px solid var(--rt-line);border-radius:18px;background:var(--rt-card);transition:border-color .2s,transform .2s}',
      '.rt-task.claimable{border-color:var(--rt-red);box-shadow:0 0 0 3px color-mix(in srgb,var(--rt-red) 14%,transparent)}',
      '.rt-task.done{opacity:.78}',
      '.rt-ico{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:var(--rt-track);color:var(--rt-text)}',
      '.rt-task.done .rt-ico{background:var(--rt-ok-bg);color:var(--rt-ok)}',
      '.rt-task h3{margin:0;font-size:1rem;font-weight:700;line-height:1.3}',
      '.rt-task p{margin:2px 0 0;color:var(--rt-muted);font-size:.86rem;line-height:1.4}',
      '.rt-prog{display:flex;align-items:center;gap:8px;margin-top:8px;font-size:.78rem;color:var(--rt-muted);font-variant-numeric:tabular-nums}',
      '.rt-prog .bar{flex:1;max-width:220px;height:6px;border-radius:999px;background:var(--rt-track);overflow:hidden}',
      '.rt-prog .bar i{display:block;height:100%;background:var(--rt-text);border-radius:inherit}',
      '.rt-task.done .rt-prog .bar i{background:var(--rt-ok)}',
      '.rt-side{display:flex;flex-direction:column;align-items:flex-end;gap:8px}',
      '.rt-xp{display:inline-flex;align-items:center;gap:4px;font-weight:700;font-size:.82rem;white-space:nowrap}',
      '.rt-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:38px;padding:8px 16px;border-radius:999px;border:1px solid var(--rt-line);background:transparent;color:var(--rt-text);font:600 .88rem/1 var(--font-b);cursor:pointer;white-space:nowrap;text-decoration:none}',
      '.rt-btn:hover{background:var(--rt-track)}',
      '.rt-btn:focus-visible{outline:2px solid var(--rt-red);outline-offset:2px}',
      '.rt-btn.primary{background:var(--rt-red);border-color:var(--rt-red);color:#fff}',
      '.rt-btn.primary:hover{filter:brightness(1.08);background:var(--rt-red)}',
      '.rt-btn.dark{background:var(--rt-text);border-color:var(--rt-text);color:var(--color-bg,#fff)}',
      '.rt-btn[disabled]{opacity:.55;cursor:default}',
      '.rt-done{display:inline-flex;align-items:center;gap:4px;color:var(--rt-ok);font-weight:700;font-size:.85rem}',
      '.rt-sec{margin-top:28px}',
      '.rt-sec-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px}',
      '.rt-units{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px}',
      '.rt-chip{min-height:36px;padding:7px 14px;border-radius:999px;border:1px solid var(--rt-line);background:var(--rt-card);color:var(--rt-text);font:600 .84rem/1.1 var(--font-b);cursor:pointer;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.rt-chip.on{background:var(--rt-text);border-color:var(--rt-text);color:var(--color-bg,#fff)}',
      '.rt-select{min-height:36px;max-width:100%;padding:6px 12px;border-radius:999px;border:1px solid var(--rt-line);background:var(--rt-card);color:var(--rt-text);font:500 .84rem var(--font-b)}',
      '.rt-games{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}',
      '.rt-game{position:relative;display:flex;flex-direction:column;gap:8px;padding:18px;border-radius:20px;border:1px solid var(--rt-line);background:var(--rt-card);overflow:hidden;min-height:170px}',
      '.rt-game::after{content:"";position:absolute;right:-30px;bottom:-40px;width:130px;height:130px;border-radius:50%;background:var(--g,#d20000);opacity:.09;pointer-events:none}',
      '.rt-game .gi{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;color:#fff;background:var(--g,#d20000)}',
      '.rt-game h3{margin:4px 0 0;font-size:1.05rem}',
      '.rt-game p{margin:0;color:var(--rt-muted);font-size:.85rem;flex:1}',
      '.rt-game .row{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}',
      '.rt-empty{padding:22px;border:1px dashed var(--rt-line);border-radius:20px;text-align:center;color:var(--rt-muted)}',
      '.rt-empty .rt-btn{margin-top:12px}',
      '.rt-build{display:flex;flex-direction:column;align-items:center;gap:10px;padding:26px;border:1px solid var(--rt-line);border-radius:20px;background:var(--rt-card);text-align:center}',
      '.rt-spin{width:34px;height:34px;border-radius:50%;border:3px solid var(--rt-track);border-top-color:var(--rt-red);animation:rtSpin .9s linear infinite}',
      '@keyframes rtSpin{to{transform:rotate(360deg)}}',
      '.rt-boosts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
      '.rt-boost{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:18px;border:1px solid var(--rt-line);background:var(--rt-card)}',
      '.rt-boost .bi{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#f59e0b,#ef4444)}',
      '.rt-boost div{flex:1;min-width:0}',
      '.rt-boost b{display:block;font-size:.92rem}',
      '.rt-boost small{color:var(--rt-muted);font-size:.8rem}',
      '.rt-msg{min-height:1.2em;margin:8px 2px 0;font-size:.85rem;color:var(--rt-muted)}',
      '.rt-how{margin-top:28px;padding:18px 20px;border-radius:20px;border:1px solid var(--rt-line);background:var(--rt-card)}',
      '.rt-how h3{margin:0 0 8px;font-size:1rem}',
      '.rt-how ul{margin:0;padding-left:18px;color:var(--rt-muted);font-size:.88rem;line-height:1.6}',
      '.rt-gap{margin:6px 0 0!important;padding:8px 10px;border-radius:10px;background:#fef3c7;color:#92400e!important;font-size:.84rem!important}',
      'html[data-theme="dark"] .rt-gap{background:rgba(245,158,11,.16);color:#fcd34d!important}',
      '.rt-toast{position:fixed!important;left:50%;top:18px;transform:translateX(-50%);z-index:2147483300;padding:10px 18px;border-radius:999px;background:var(--color-text,#28251d);color:var(--color-bg,#fff);font:700 .88rem var(--font-b,system-ui);box-shadow:0 12px 30px rgba(0,0,0,.25);animation:rtIn .3s ease both;max-width:calc(100vw - 32px);text-align:center}',
      '@keyframes rtIn{from{opacity:0;transform:translate(-50%,-8px)}to{opacity:1;transform:translate(-50%,0)}}',
      /* game player */
      '.rtg{position:fixed!important;inset:0;z-index:2147483100;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(18,16,12,.55);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);animation:rtFade .2s ease both}',
      '@keyframes rtFade{from{opacity:0}to{opacity:1}}',
      'html[data-theme="dark"] .rtg-card{background:var(--color-surface,#1c1b19)}',
      '.rtg-card{position:relative;width:min(720px,100%);max-height:calc(100dvh - 32px);overflow:auto;border-radius:24px;background:var(--color-bg,#f7f6f2);border:1px solid var(--color-border,#d4d1ca);color:var(--color-text,#28251d);box-shadow:0 30px 80px -20px rgba(0,0,0,.55);padding:20px 20px 22px;font-family:var(--font-b,"DM Sans",system-ui,sans-serif)}',
      '.rtg-top{display:flex;align-items:center;gap:12px;margin-bottom:14px}',
      '.rtg-top .gi{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;color:#fff;background:var(--g,#d20000);flex:none}',
      '.rtg-top h3{margin:0;font-size:1.05rem;flex:1;min-width:0}',
      '.rtg-top small{display:block;color:var(--color-text-muted,#7a7974);font-weight:500;font-size:.8rem}',
      '.rtg-x{width:36px;height:36px;border-radius:50%;border:0;background:transparent;color:inherit;cursor:pointer;display:grid;place-items:center}',
      '.rtg-x:hover{background:color-mix(in srgb,currentColor 10%,transparent)}',
      '.rtg-bar{height:6px;border-radius:999px;background:color-mix(in srgb,currentColor 10%,transparent);overflow:hidden;margin-bottom:16px}',
      '.rtg-bar i{display:block;height:100%;background:var(--g,#d20000);transition:width .3s linear}',
      '.rtg-cols{display:grid;grid-template-columns:1fr 1fr;gap:10px}',
      '.rtg-col{display:grid;gap:8px;align-content:start}',
      '.rtg-tile{min-height:52px;padding:10px 12px;border-radius:14px;border:1.5px solid var(--color-border,#d4d1ca);background:var(--color-surface-2,#fff);color:inherit;font:500 .88rem/1.35 var(--font-b);text-align:left;cursor:pointer;transition:transform .12s,border-color .15s,background .15s}',
      '.rtg-tile.term{font-weight:700}',
      '.rtg-tile:hover{border-color:var(--color-text,#28251d)}',
      '.rtg-tile.sel{border-color:var(--g,#d20000);box-shadow:0 0 0 3px color-mix(in srgb,var(--g,#d20000) 20%,transparent)}',
      '.rtg-tile.ok{border-color:#16a34a;background:#dcfce7;color:#14532d;cursor:default}',
      'html[data-theme="dark"] .rtg-tile.ok{background:rgba(34,197,94,.16);color:#bbf7d0}',
      '.rtg-tile.bad{animation:rtShake .35s;border-color:#dc2626}',
      '@keyframes rtShake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}',
      '.rtg-big{padding:22px 18px;border-radius:18px;background:var(--color-surface-2,#fff);border:1px solid var(--color-border,#d4d1ca);font-size:1.08rem;line-height:1.45;font-weight:600;min-height:110px;display:flex;align-items:center;justify-content:center;text-align:center}',
      '.rtg-big.ok{border-color:#16a34a;box-shadow:0 0 0 3px rgba(22,163,74,.2)}',
      '.rtg-big.bad{border-color:#dc2626;box-shadow:0 0 0 3px rgba(220,38,38,.2)}',
      '.rtg-tf{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}',
      '.rtg-tf button,.rtg-opt{min-height:56px;border-radius:16px;border:0;font:700 1rem var(--font-b);cursor:pointer;color:#fff}',
      '.rtg-tf .t{background:#16a34a}.rtg-tf .f{background:#dc2626}',
      '.rtg-tf button:active,.rtg-opt:active{transform:translateY(1px)}',
      '.rtg-opts{display:grid;gap:8px;margin-top:14px}',
      '.rtg-opt{min-height:50px;padding:10px 14px;text-align:left;background:var(--color-surface-2,#fff);color:inherit;border:1.5px solid var(--color-border,#d4d1ca);font-weight:600;font-size:.92rem;line-height:1.35}',
      '.rtg-opt:hover{border-color:var(--color-text,#28251d)}',
      '.rtg-opt.ok{border-color:#16a34a;background:#dcfce7;color:#14532d}',
      '.rtg-opt.bad{border-color:#dc2626;background:#fee2e2;color:#7f1d1d}',
      'html[data-theme="dark"] .rtg-opt.ok{background:rgba(34,197,94,.16);color:#bbf7d0}',
      'html[data-theme="dark"] .rtg-opt.bad{background:rgba(239,68,68,.16);color:#fecaca}',
      '.rtg-meta{display:flex;justify-content:space-between;color:var(--color-text-muted,#7a7974);font-size:.82rem;margin-top:12px;font-variant-numeric:tabular-nums}',
      '.rtg-res{text-align:center;padding:6px 4px}',
      '.rtg-score{font:400 3.2rem/1 var(--font-d,"Instrument Serif",Georgia,serif);margin:6px 0 4px}',
      '.rtg-xp{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:999px;background:#fef3c7;color:#92400e;font-weight:800;font-size:.9rem;margin:6px 0}',
      'html[data-theme="dark"] .rtg-xp{background:rgba(245,158,11,.18);color:#fcd34d}',
      '.rtg-note{color:var(--color-text-muted,#7a7974);font-size:.88rem;margin:6px 0 0}',
      '.rtg-review{text-align:left;margin-top:16px;display:grid;gap:8px}',
      '.rtg-review div{padding:10px 12px;border-radius:12px;background:var(--color-surface-2,#fff);border:1px solid var(--color-border,#d4d1ca);font-size:.86rem;line-height:1.45}',
      '.rtg-review b{display:block;margin-bottom:2px}',
      '.rtg-actions{display:flex;gap:10px;justify-content:center;margin-top:18px;flex-wrap:wrap}',
      '@media (max-width:720px){.rt-games{grid-template-columns:1fr}.rt-boosts{grid-template-columns:1fr}.rt-game{min-height:0}}',
      '@media (max-width:560px){.rt-hero{grid-template-columns:1fr;justify-items:start;padding:18px}.rt-task{grid-template-columns:40px 1fr;padding:13px}.rt-ico{width:40px;height:40px}.rt-side{grid-column:1/-1;flex-direction:row;justify-content:space-between;align-items:center}.rtg{padding:0;align-items:flex-end}.rtg-card{border-radius:22px 22px 0 0;max-height:94dvh;padding:18px 14px calc(18px + env(safe-area-inset-bottom,0px))}.rtg-cols{gap:8px}.rtg-tile{font-size:.82rem;padding:9px 10px}}',
      '@media (prefers-reduced-motion:reduce){.rt *,.rtg,.rtg *{animation:none!important;transition:none!important}}',
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
  }

  function toast(text) {
    css();
    var t = document.createElement('div');
    t.className = 'rt-toast';
    t.setAttribute('role', 'status');
    t.textContent = text;
    document.documentElement.appendChild(t);
    setTimeout(function () { t.style.transition = 'opacity .3s'; t.style.opacity = '0'; }, 2600);
    setTimeout(function () { t.remove(); }, 3000);
  }

  /* ── games API ─────────────────────────────────────────────────────── */
  function api(action, body) {
    var r = R();
    var s = r && r.getSession ? r.getSession() : null;
    var raw = (r && r._raw) || {};
    if (!s || !s.access_token) return Promise.reject(new Error('Please sign in.'));
    return fetch((raw.SUPABASE_URL || 'https://tcrrgsylxbyyrmnouihl.supabase.co') + '/functions/v1/daily-games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s.access_token, apikey: raw.SUPABASE_ANON_KEY || '' },
      body: JSON.stringify(Object.assign({ action: action }, body || {})),
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (j) {
        if (res.status === 404 && !j.error) throw Object.assign(new Error('Games are not switched on yet.'), { code: 'missing' });
        if (!res.ok || j.ok === false) throw Object.assign(new Error(j.error || 'Something went wrong.'), { code: j.code });
        return j;
      });
    });
  }

  // The unit's verified quiz bank and spec topics, read from the unit app (same as Study Hub).
  function loadCatalog(path) {
    if (S.cat[path]) return Promise.resolve(S.cat[path]);
    try { var c = JSON.parse(sessionStorage.getItem('ra10_cat_' + path) || 'null'); if (c) { S.cat[path] = c; return Promise.resolve(c); } } catch (e) {}
    var u = unitOf(path);
    if (!u) return Promise.reject(new Error('Unknown unit'));
    return new Promise(function (resolve, reject) {
      var f = document.createElement('iframe');
      f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1;
      f.style.cssText = 'position:fixed;left:-3000px;top:0;width:1200px;height:900px;visibility:hidden;border:0';
      f.src = u.app + '?ra10catalog=1';
      var t;
      function done(v, err) { window.removeEventListener('message', onMsg); clearTimeout(t); f.remove(); if (err) reject(err); else resolve(v); }
      function onMsg(e) { if (e.origin === location.origin && e.data && e.data.type === 'ra10:catalog' && e.source === f.contentWindow) done(e.data.catalog); }
      t = setTimeout(function () { done(null, new Error('The unit took too long to load. Try again.')); }, 40000);
      window.addEventListener('message', onMsg);
      document.body.appendChild(f);
    }).then(function (cat) {
      S.cat[path] = cat;
      try { sessionStorage.setItem('ra10_cat_' + path, JSON.stringify(cat)); } catch (e) {}
      return cat;
    });
  }
  function grounding(cat) {
    var L = 'ABCDEF';
    var quiz = ((cat && cat.quiz) || []).map(function (q) {
      var choices = q.choices || [];
      var c = q.correct;
      if (typeof c === 'string' && /^[A-F]$/i.test(c.trim())) c = L.indexOf(c.trim().toUpperCase());
      else if (typeof c === 'string') c = choices.findIndex(function (x) { return String(x).trim().toLowerCase() === c.trim().toLowerCase(); });
      return { q: q.q, choices: choices, correct: Number(c) };
    }).filter(function (q) { return q.q && q.choices.length >= 2 && q.correct >= 0 && q.correct < q.choices.length; });
    for (var i = quiz.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = quiz[i]; quiz[i] = quiz[j]; quiz[j] = tmp; }
    var topics = [];
    Object.keys((cat && cat.spec) || {}).forEach(function (a) { ((cat.spec[a] || {}).topics || []).forEach(function (t) { var s = ((t.code ? t.code + ' ' : '') + (t.name || '')).trim(); if (s) topics.push(s); }); });
    return { quiz: quiz.slice(0, 60), topics: topics.slice(0, 60) };
  }

  /* ── page ──────────────────────────────────────────────────────────── */
  var SLOT_GO = { write: 'Answer questions', ai: 'Open AI Examiner', quiz: 'Start a quiz', explore: 'Open a guide', game: 'Play' };

  function render(host) {
    css();
    S.host = host;
    if (!loggedIn()) {
      host.innerHTML = '<div class="rt"><div class="rt-empty">Sign in to see today’s tasks and games.</div></div>';
      return Promise.resolve();
    }
    if (!S.data) host.innerHTML = '<div class="rt"><div class="rt-build"><div class="rt-spin"></div><div>Loading today’s tasks…</div></div></div>';
    return rpc('get_daily_tasks').then(function (d) {
      S.data = d;
      if (!S.unit) S.unit = pickUnit(d);
      paint();
      // the XP layer (boost rewards) loads after the page: show its section once it is ready
      if (!window.RA10XP) {
        var n = 0, wait = setInterval(function () {
          if (window.RA10XP || ++n > 40) { clearInterval(wait); if (window.RA10XP && S.host && document.body.contains(S.host)) { paint(); paintGames(); } }
        }, 250);
      }
      return loadGames();
    }, function (err) {
      if (missing(err) && typeof window.renderLegacyGlobalTasksPage === 'function') return window.renderLegacyGlobalTasksPage();
      host.innerHTML = '<div class="rt"><div class="rt-empty">Could not load your tasks. <button class="rt-btn" type="button" data-rt-retry>Try again</button></div></div>';
      var b = $('[data-rt-retry]', host); if (b) b.onclick = function () { render(host); };
    });
  }

  function pickUnit(d) {
    var saved = null;
    try { saved = localStorage.getItem('ra10_games_unit'); } catch (e) {}
    if (saved && unitOf(saved)) return saved;
    var recent = (d && d.recent_units) || [];
    for (var i = 0; i < recent.length; i++) if (unitOf(recent[i])) return recent[i];
    return null;
  }

  function paint() {
    var d = S.data || {};
    var tasks = d.tasks || [];
    var done = tasks.filter(function (t) { return t.claimed; }).length;
    var C = 2 * Math.PI * 40;
    var xpToday = Number(d.xp_today || 0), cap = Number(d.xp_cap || 1000);
    var html = '<div class="rt">' +
      '<div class="rt-hero">' +
        '<div class="rt-ring" aria-hidden="true"><svg width="96" height="96" viewBox="0 0 96 96"><circle class="tr" cx="48" cy="48" r="40"/><circle class="ar" cx="48" cy="48" r="40" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - (tasks.length ? done / tasks.length : 0))).toFixed(1) + '"/></svg><b><span>' + done + '/' + (tasks.length || 5) + '<small>done</small></span></b></div>' +
        '<div><h2>Today’s tasks</h2><p class="rt-sub">Five new tasks every day, picked for you. They reset at midnight (UK time).</p>' +
          '<div class="rt-kpis"><span class="rt-kpi">' + icon('bolt', 14) + fmt(xpToday) + ' XP today</span><span class="rt-kpi">Daily limit ' + fmt(cap) + ' XP</span></div>' +
          '<div class="rt-meter" title="XP earned today"><i style="width:' + Math.min(100, Math.round(xpToday / cap * 100)) + '%"></i></div></div>' +
      '</div>' +
      '<div class="rt-list" role="list">' + tasks.map(taskHtml).join('') + '</div>' +
      boostsHtml(d) +
      '<section class="rt-sec" id="rt-games-sec" aria-labelledby="rt-games-h"><div class="rt-sec-head"><div><h2 id="rt-games-h">Today’s games</h2><p class="rt-sub">Three quick games the AI builds from your unit’s own questions. Every answer is checked before you see it.</p></div></div>' +
        unitPickerHtml() + '<div id="rt-games"></div></section>' +
      '<div class="rt-how"><h3>How XP works</h3><ul>' +
        '<li>XP comes from real learning: written answers, correct quiz answers, AI Examiner marks, guide sections, tasks and games.</li>' +
        '<li>Each question counts once a day. Random or copied answers, and tapping through, earn nothing.</li>' +
        '<li>You can earn up to ' + fmt(cap) + ' XP a day. Finish in the top three on Saturday for a podium badge and a 3x XP boost.</li>' +
      '</ul></div>' +
    '</div>';
    S.host.innerHTML = html;
    wire();
  }

  function taskHtml(t) {
    var pct = Math.round(Math.min(1, t.progress / Math.max(1, t.target)) * 100);
    var right;
    if (t.claimed) right = '<span class="rt-done">' + icon('check', 16) + 'Done</span>';
    else if (t.claimable) right = '<button class="rt-btn primary" type="button" data-rt-claim="' + esc(t.key) + '">Claim +' + t.xp + ' XP</button>';
    else if (t.key === 'gap_drill' && t.gap) right = '<button class="rt-btn primary" type="button" data-rt-gap>Start 3-min drill</button>';
    else right = '<button class="rt-btn" type="button" data-rt-go="' + esc(t.slot) + '" data-rt-key="' + esc(t.key) + '">' + esc(t.key === 'study_hub' ? 'Open Study Hub' : SLOT_GO[t.slot] || 'Go') + '</button>';
    var gapLine = t.key === 'gap_drill' && t.gap ? '<p class="rt-gap">You scored <b>' + esc(t.gap.score) + '/' + esc(t.gap.max) + '</b> on <b>' + esc(t.gap.topic) + '</b> — let\u2019s fix it.</p>' : '';
    return '<div class="rt-task' + (t.claimed ? ' done' : t.claimable ? ' claimable' : '') + '" role="listitem">' +
      '<span class="rt-ico">' + icon(t.claimed ? 'check' : t.slot, 21) + '</span>' +
      '<div><h3>' + esc(t.title) + '</h3><p>' + esc(t.detail) + '</p>' + gapLine +
        '<div class="rt-prog"><span class="bar"><i style="width:' + pct + '%"></i></span><span>' + t.progress + ' / ' + t.target + '</span></div></div>' +
      '<div class="rt-side"><span class="rt-xp">' + icon('bolt', 14) + t.xp + ' XP</span>' + right + '</div>' +
    '</div>';
  }

  function boostsHtml(d) {
    var XP = window.RA10XP;
    if (!XP || !XP.available || !XP.available()) return '';
    var today = (d && d.day) || '';
    var has = function (src) { return XP.boosts().some(function (b) { return b.source === src && String(b.period_key || '') === today; }); };
    var rows = [
      { src: 'daily_tasks', title: '2x XP for 30 minutes', how: 'Finish all five of today’s tasks.', ready: !!(d && d.all_done) },
      { src: 'daily_practice', title: '2x XP for 15 minutes', how: 'Answer 10 questions properly today.', ready: true },
    ];
    return '<section class="rt-sec" aria-label="Boost rewards"><div class="rt-boosts">' + rows.map(function (r) {
      var claimed = has(r.src);
      return '<div class="rt-boost"><span class="bi">' + icon('bolt', 20) + '</span><div><b>' + r.title + '</b><small>' + r.how + '</small></div>' +
        '<button class="rt-btn' + (r.ready && !claimed ? ' dark' : '') + '" type="button" data-rt-boost="' + r.src + '"' + (claimed || (r.src === 'daily_tasks' && !r.ready) ? ' disabled' : '') + '>' + (claimed ? 'Claimed' : r.src === 'daily_tasks' && !r.ready ? 'Locked' : 'Claim') + '</button></div>';
    }).join('') + '</div><p class="rt-msg" data-rt-boost-msg aria-live="polite"></p></section>';
  }

  function unitPickerHtml() {
    var recent = ((S.data && S.data.recent_units) || []).filter(unitOf);
    if (S.unit && recent.indexOf(S.unit) < 0) recent.unshift(S.unit);
    var chips = recent.slice(0, 4).map(function (p) { var u = unitOf(p); return '<button type="button" class="rt-chip' + (p === S.unit ? ' on' : '') + '" data-rt-unit="' + esc(p) + '" title="' + esc(u.name) + '">' + esc(u.short || u.name) + '</button>'; }).join('');
    var opts = units().map(function (u) { return '<option value="' + esc(u.path) + '"' + (u.path === S.unit ? ' selected' : '') + '>' + esc(u.short + ' — ' + u.name.replace(/^Unit \d+:\s*/, '')) + '</option>'; }).join('');
    return '<div class="rt-units">' + chips + '<select class="rt-select" data-rt-unit-select aria-label="Choose a unit for today’s games"><option value="">' + (recent.length ? 'Another unit…' : 'Choose a unit…') + '</option>' + opts + '</select></div>';
  }

  function wire() {
    var host = S.host;
    $$('[data-rt-claim]', host).forEach(function (b) {
      b.onclick = function () {
        b.disabled = true;
        rpc('claim_daily_task', { p_key: b.getAttribute('data-rt-claim') }).then(function (r) {
          var g = Number(r && r.granted) || 0, bonus = Number(r && r.bonus) || 0;
          toast(g > 0 ? '+' + (g + bonus) + ' XP — task complete!' + (bonus ? ' (' + r.multiplier + 'x boost)' : '') : 'Task complete! You’ve reached today’s XP limit.');
          try { if (window.RA10XP) RA10XP.refresh(); } catch (e) {}
          return refresh();
        }, function (e) { b.disabled = false; toast((e && e.message) || 'Not finished yet.'); });
      };
    });
    var gb = $('[data-rt-gap]', host);
    if (gb) gb.onclick = function () { var t = (S.data.tasks || []).filter(function (x) { return x.key === 'gap_drill'; })[0]; if (t && t.gap) gapDrill(t.gap); };
    $$('[data-rt-go]', host).forEach(function (b) {
      b.onclick = function () {
        var slot = b.getAttribute('data-rt-go');
        if (b.getAttribute('data-rt-key') === 'study_hub') { location.href = '/study-hub/'; return; }
        if (slot === 'game') { var g = $('#rt-games-sec', host); if (g) g.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
        var u = unitOf(S.unit || ((S.data && S.data.recent_units) || [])[0]);
        nav(u ? u.publicPath : '/subjects');
      };
    });
    $$('[data-rt-boost]', host).forEach(function (b) {
      b.onclick = function () {
        var msg = $('[data-rt-boost-msg]', host);
        b.disabled = true;
        RA10XP.claim(b.getAttribute('data-rt-boost')).then(function () {
          b.textContent = 'Claimed';
          if (msg) msg.innerHTML = 'Boost added. <a href="/leaderboard" onclick="go(\'leaderboard\');return false;">Switch it on from the leaderboard</a> when you’re ready to revise.';
        }, function (e) { b.disabled = false; if (msg) msg.textContent = (e && e.message) || 'Not unlocked yet.'; });
      };
    });
    $$('[data-rt-unit]', host).forEach(function (b) { b.onclick = function () { setUnit(b.getAttribute('data-rt-unit')); }; });
    var sel = $('[data-rt-unit-select]', host);
    if (sel) sel.onchange = function () { if (sel.value) setUnit(sel.value); };
  }

  function setUnit(p) {
    S.unit = p;
    try { localStorage.setItem('ra10_games_unit', p); } catch (e) {}
    $$('[data-rt-unit]', S.host).forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-rt-unit') === p); });
    if (!$('[data-rt-unit="' + p.replace(/"/g, '') + '"]', S.host)) { var box = $('.rt-units', S.host); if (box) { box.outerHTML = unitPickerHtml(); wire(); } }
    paintGames();
  }

  function refresh() {
    return rpc('get_daily_tasks').then(function (d) {
      S.data = d;
      var y = window.scrollY;
      paint(); paintGames();
      window.scrollTo(0, y);
    }, function () {});
  }

  /* ── games section ─────────────────────────────────────────────────── */
  var GAME_UI = {
    match: { name: 'Match-up', icon: 'match', color: '#7c3aed', blurb: 'Pair each key term with its meaning. First tries count.' },
    truefalse: { name: 'True or False', icon: 'tf', color: '#0e7490', blurb: '75 seconds. How many statements can you call correctly?' },
    quickfire: { name: 'Quickfire', icon: 'fire', color: '#d20000', blurb: 'Eight questions straight from your unit’s own quiz bank.' },
  };

  function loadGames() {
    return api('state').then(function (j) { S.games = j; paintGames(); }, function (e) {
      S.games = { error: e && e.code === 'missing' ? 'Games are switched on soon.' : (e && e.message) || 'Games are unavailable right now.' };
      paintGames();
    });
  }
  function setFor(unit) { return ((S.games && S.games.sets) || []).filter(function (s) { return s.unit === unit; })[0] || null; }
  function playOf(setId, game) { return ((S.games && S.games.plays) || []).filter(function (p) { return p.set_id === setId && p.game === game; })[0] || null; }

  function paintGames() {
    var box = $('#rt-games', S.host);
    if (!box) return;
    if (S.building) return;
    if (!S.games) { box.innerHTML = '<div class="rt-build"><div class="rt-spin"></div><div>Loading games…</div></div>'; return; }
    if (S.games.error) { box.innerHTML = '<div class="rt-empty">' + esc(S.games.error) + '</div>'; return; }
    if (!S.unit) { box.innerHTML = '<div class="rt-empty">Choose a unit above and the AI will build today’s three games from its questions.</div>'; return; }
    var u = unitOf(S.unit);
    var set = setFor(S.unit);
    if (!set) {
      var made = ((S.games && S.games.sets) || []).length, max = (S.games && S.games.maxSets) || 3;
      box.innerHTML = '<div class="rt-empty"><div><strong>' + esc(u ? u.name : S.unit) + '</strong></div><div>' + (made >= max ? 'You’ve built ' + max + ' game sets today. New games arrive tomorrow.' : 'Your games for this unit are not built yet. It takes about half a minute.') + '</div>' +
        (made >= max ? '' : '<button class="rt-btn primary" type="button" data-rt-build>' + icon('ai', 16) + 'Build today’s games</button>') + '</div>';
      var b = $('[data-rt-build]', box); if (b) b.onclick = build;
      return;
    }
    box.innerHTML = '<p class="rt-sub" style="margin:-4px 0 12px"><strong>' + esc(set.title || 'Today’s set') + '</strong> · ' + esc(u ? u.short : set.unit_name || '') + '</p><div class="rt-games">' + (set.games || []).map(function (g) {
      var ui = GAME_UI[g.id] || { name: g.title, icon: 'game', color: '#d20000', blurb: '' };
      var p = playOf(set.id, g.id);
      var fin = p && p.finished_at;
      return '<div class="rt-game" style="--g:' + ui.color + '"><span class="gi">' + icon(ui.icon, 21) + '</span><h3>' + esc(ui.name) + '</h3><p>' + esc(ui.blurb) + '</p>' +
        '<div class="row">' + (fin ? '<span class="rt-done">' + icon('check', 16) + p.score + '/' + p.max_score + (p.xp ? ' · +' + p.xp + ' XP' : '') + '</span>' : '<span class="rt-xp">' + icon('bolt', 14) + 'up to ' + gameXp(g.id) + ' XP</span>') +
        '<button class="rt-btn' + (fin ? '' : ' dark') + '" type="button" data-rt-play="' + g.id + '">' + (fin ? 'Play again' : 'Play') + '</button></div></div>';
    }).join('') + '</div>';
    $$('[data-rt-play]', box).forEach(function (b) { b.onclick = function () { play(set, b.getAttribute('data-rt-play')); }; });
  }
  function gameXp(id) { return id === 'truefalse' ? 24 : 30; }

  function build() {
    var box = $('#rt-games', S.host);
    var unit = S.unit, u = unitOf(unit);
    if (!u || S.building) return;
    S.building = true;
    var steps = ['Reading your unit’s questions…', 'The AI is building your games…', 'Checking every answer…'];
    var i = 0;
    box.innerHTML = '<div class="rt-build" aria-live="polite"><div class="rt-spin"></div><div data-rt-step>' + steps[0] + '</div></div>';
    var stepEl = function () { return $('[data-rt-step]', box); };
    var timer = setInterval(function () { if (i < steps.length - 1) { i++; var el = stepEl(); if (el) el.textContent = steps[i]; } }, 9000);
    loadCatalog(unit).then(function (cat) {
      i = 1; var el = stepEl(); if (el) el.textContent = steps[1];
      return api('today', { unit: unit, unitName: u.name, qual: u.qual, grounding: grounding(cat) });
    }).then(function (j) {
      clearInterval(timer);
      S.building = false;
      S.games = S.games || { sets: [], plays: [] };
      S.games.sets = (S.games.sets || []).filter(function (s) { return s.id !== j.set.id; }).concat([j.set]);
      S.games.plays = (S.games.plays || []).concat(j.plays || []);
      paintGames();
    }, function (e) {
      clearInterval(timer);
      S.building = false;
      box.innerHTML = '<div class="rt-empty">' + esc((e && e.message) || 'Could not build the games.') + '<div><button class="rt-btn" type="button" data-rt-build>' + icon('refresh', 16) + 'Try again</button></div></div>';
      var b = $('[data-rt-build]', box); if (b) b.onclick = build;
    });
  }

  /* ── game player ───────────────────────────────────────────────────── */
  function play(set, gameId) {
    var g = (set.games || []).filter(function (x) { return x.id === gameId; })[0];
    if (!g) return;
    css();
    var ui = GAME_UI[gameId];
    var ov = document.createElement('div');
    ov.className = 'rtg';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', ui.name);
    ov.style.setProperty('--g', ui.color);
    ov.innerHTML = '<div class="rtg-card"><div class="rtg-top"><span class="gi">' + icon(ui.icon, 20) + '</span><h3>' + esc(ui.name) + '<small>' + esc(set.title || '') + '</small></h3><button class="rtg-x" type="button" aria-label="Close game">' + icon('x', 20) + '</button></div><div class="rtg-bar"><i style="width:0%"></i></div><div class="rtg-body"></div></div>';
    document.documentElement.appendChild(ov);
    var body = $('.rtg-body', ov), bar = $('.rtg-bar i', ov);
    var timers = [];
    var opener = document.activeElement;
    function close() {
      timers.forEach(clearInterval); timers.forEach(clearTimeout);
      document.removeEventListener('keydown', onKey, true);
      ov.remove();
      if (opener && opener.focus) try { opener.focus(); } catch (e) {}
    }
    var keyHandler = null;
    function onKey(e) { if (e.key === 'Escape') { e.preventDefault(); close(); return; } if (keyHandler) keyHandler(e); }
    document.addEventListener('keydown', onKey, true);
    $('.rtg-x', ov).onclick = close;
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    var started = Date.now();
    api('start', { setId: set.id, game: gameId }).catch(function () {});

    function finish(picks, review) {
      timers.forEach(clearInterval); timers.forEach(clearTimeout); keyHandler = null;
      bar.style.width = '100%';
      body.innerHTML = '<div class="rt-build" style="border:0;background:transparent"><div class="rt-spin"></div><div>Checking your answers…</div></div>';
      api('finish', { setId: set.id, game: gameId, picks: picks }).then(function (r) {
        var xp = (Number(r.xp) || 0) + (Number(r.bonus) || 0);
        var wrong = review.filter(function (x, i) { return !(r.detail || [])[i]; });
        body.innerHTML = '<div class="rtg-res"><div class="rtg-score">' + r.score + '/' + r.max + '</div>' +
          '<div>' + (r.score === r.max ? 'Perfect!' : r.score / r.max >= 0.8 ? 'Great work.' : r.score / r.max >= 0.5 ? 'Good effort.' : 'Keep going — review the ones below.') + '</div>' +
          (xp > 0 ? '<div class="rtg-xp">' + icon('bolt', 15) + '+' + xp + ' XP' + (r.bonus ? ' (boost)' : '') + '</div>' : '') +
          (r.replay ? '<p class="rtg-note">Practice round: XP is only given the first time you finish a game.</p>' : '') +
          (r.note ? '<p class="rtg-note">' + esc(r.note) + '</p>' : '') +
          (wrong.length ? '<div class="rtg-review">' + wrong.slice(0, 10).map(function (w) { return '<div><b>' + esc(w.q) + '</b>' + esc(w.a) + '</div>'; }).join('') + '</div>' : '') +
          '<div class="rtg-actions"><button class="rt-btn dark" type="button" data-done>Done</button></div></div>';
        $('[data-done]', body).onclick = close;
        $('[data-done]', body).focus();
        if (xp > 0) { try { window.dispatchEvent(new CustomEvent('ra10:xp', { detail: { granted: r.xp, bonus: r.bonus } })); if (window.RA10XP) RA10XP.refresh(); } catch (e) {} }
        // update the cards and tasks behind the overlay
        loadGames().then(refresh);
      }, function (e) {
        body.innerHTML = '<div class="rtg-res"><p>' + esc((e && e.message) || 'Could not save your result.') + '</p><div class="rtg-actions"><button class="rt-btn" type="button" data-done>Close</button></div></div>';
        $('[data-done]', body).onclick = close;
      });
    }

    if (gameId === 'match') playMatch(); else if (gameId === 'truefalse') playTf(); else playQuick();

    function playMatch() {
      var pairs = g.pairs || [];
      var defOrder = shuffled(pairs.map(function (_, i) { return i; }));
      var attempts = [], solved = {}, sel = null;
      body.innerHTML = '<p class="rtg-note" style="margin:0 0 12px">Tap a term, then its meaning.</p><div class="rtg-cols"><div class="rtg-col">' +
        pairs.map(function (p, i) { return '<button type="button" class="rtg-tile term" data-t="' + i + '">' + esc(p.term) + '</button>'; }).join('') + '</div><div class="rtg-col">' +
        defOrder.map(function (i) { return '<button type="button" class="rtg-tile" data-d="' + i + '">' + esc(pairs[i].def) + '</button>'; }).join('') + '</div></div><div class="rtg-meta"><span data-m>0 of ' + pairs.length + ' matched</span><span data-c>0:00</span></div>';
      clock();
      $$('[data-t]', body).forEach(function (b) {
        b.onclick = function () { if (solved[b.dataset.t]) return; $$('[data-t]', body).forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); sel = Number(b.dataset.t); };
      });
      $$('[data-d]', body).forEach(function (b) {
        b.onclick = function () {
          if (sel === null || b.classList.contains('ok')) return;
          var d = Number(b.dataset.d), t = sel;
          attempts.push([t, d]);
          var tb = $('[data-t="' + t + '"]', body);
          if (t === d) {
            solved[t] = true; tb.classList.remove('sel'); tb.classList.add('ok'); b.classList.add('ok'); sel = null;
            var n = Object.keys(solved).length;
            $('[data-m]', body).textContent = n + ' of ' + pairs.length + ' matched';
            bar.style.width = Math.round(n / pairs.length * 100) + '%';
            if (n === pairs.length) setTimeout(function () { finish(attempts, pairs.map(function (p) { return { q: p.term, a: p.def }; })); }, 500);
          } else {
            b.classList.remove('bad'); void b.offsetWidth; b.classList.add('bad');
          }
        };
      });
    }

    function playTf() {
      var items = g.items || [], picks = items.map(function () { return null; }), i = 0, secs = Number(g.seconds) || 75, locked = false;
      var left = secs;
      function show() {
        if (i >= items.length) return end();
        locked = false;
        body.innerHTML = '<div class="rtg-big" data-s>' + esc(items[i].s) + '</div><div class="rtg-tf"><button type="button" class="t" data-v="1">True <small style="opacity:.7">(T)</small></button><button type="button" class="f" data-v="0">False <small style="opacity:.7">(F)</small></button></div><div class="rtg-meta"><span>' + (i + 1) + ' of ' + items.length + '</span><span data-left>' + left + 's left</span></div>';
        $$('[data-v]', body).forEach(function (b) { b.onclick = function () { answer(b.dataset.v === '1'); }; });
      }
      function answer(v) {
        if (locked) return;
        locked = true;
        picks[i] = v;
        var ok = v === items[i].answer;
        var s = $('[data-s]', body); if (s) s.classList.add(ok ? 'ok' : 'bad');
        i++;
        timers.push(setTimeout(show, 650));
      }
      function end() { finish(picks, items.map(function (it) { return { q: it.s, a: (it.answer ? 'True' : 'False') + (it.why ? ' — ' + it.why : '') }; })); }
      keyHandler = function (e) { var k = e.key.toLowerCase(); if (k === 't' || k === 'arrowleft') answer(true); else if (k === 'f' || k === 'arrowright') answer(false); };
      var tick = setInterval(function () {
        left = Math.max(0, secs - Math.floor((Date.now() - started) / 1000));
        bar.style.width = Math.round((1 - left / secs) * 100) + '%';
        var el = $('[data-left]', body); if (el) el.textContent = left + 's left';
        if (left <= 0) { clearInterval(tick); i = items.length; end(); }
      }, 250);
      timers.push(tick);
      show();
    }

    function playQuick() {
      var items = g.items || [], picks = items.map(function () { return null; }), i = 0, locked = false;
      function show() {
        if (i >= items.length) return finish(picks, items.map(function (it) { return { q: it.q, a: 'Answer: ' + it.choices[it.answer] }; }));
        locked = false;
        bar.style.width = Math.round(i / items.length * 100) + '%';
        body.innerHTML = '<div class="rtg-big" style="font-size:1rem;min-height:90px">' + esc(items[i].q) + '</div><div class="rtg-opts">' +
          items[i].choices.map(function (c, k) { return '<button type="button" class="rtg-opt" data-k="' + k + '">' + (k + 1) + '. ' + esc(c) + '</button>'; }).join('') +
          '</div><div class="rtg-meta"><span>' + (i + 1) + ' of ' + items.length + '</span><span data-c>0:00</span></div>';
        $$('[data-k]', body).forEach(function (b) { b.onclick = function () { answer(Number(b.dataset.k)); }; });
      }
      function answer(k) {
        if (locked || !(k >= 0 && k < items[i].choices.length)) return;
        locked = true;
        picks[i] = k;
        var right = items[i].answer;
        $$('[data-k]', body).forEach(function (b) { var n = Number(b.dataset.k); if (n === right) b.classList.add('ok'); else if (n === k) b.classList.add('bad'); b.disabled = true; });
        i++;
        timers.push(setTimeout(show, k === right ? 650 : 1300));
      }
      keyHandler = function (e) { if (/^[1-6]$/.test(e.key)) answer(Number(e.key) - 1); };
      clock();
      show();
    }

    function clock() {
      timers.push(setInterval(function () {
        var el = $('[data-c]', body); if (!el) return;
        var s = Math.floor((Date.now() - started) / 1000);
        el.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
      }, 500));
    }
  }
  function shuffled(a) { var b = a.slice(); for (var i = b.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = b[i]; b[i] = b[j]; b[j] = t; } return b; }

  /* ── spec-gap micro-drill: 3 questions on a topic the learner lost marks on ── */
  function gapDrill(gap) {
    css();
    var ov = document.createElement('div');
    ov.className = 'rtg'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Weak spot drill');
    ov.style.setProperty('--g', '#d97706');
    ov.innerHTML = '<div class="rtg-card"><div class="rtg-top"><span class="gi">' + icon('ai', 20) + '</span><h3>Fix your weak spot<small>' + esc(gap.topic) + '</small></h3><button class="rtg-x" type="button" aria-label="Close">' + icon('x', 20) + '</button></div><div class="rtg-bar"><i style="width:0%"></i></div><div class="rtg-body"><div class="rt-build" style="border:0;background:transparent">' + (window.RA10Tools ? RA10Tools.mascot('think', 72) : '<div class="rt-spin"></div>') + '<div>Building your drill…</div></div></div></div>';
    document.documentElement.appendChild(ov);
    var body = $('.rtg-body', ov), bar = $('.rtg-bar i', ov);
    var close = function () { ov.remove(); };
    $('.rtg-x', ov).onclick = close;
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    var u = unitOf(gap.unit);
    var words = String(gap.topic || '').toLowerCase().split(/[^a-z0-9]+/).filter(function (w) { return w.length > 3; });
    var bankP = u ? loadCatalog(gap.unit).then(function (cat) {
      return grounding(cat).quiz.filter(function (q) { var t = String(q.q).toLowerCase(); return words.filter(function (w) { return t.indexOf(w) >= 0; }).length >= Math.min(2, words.length); }).slice(0, 12);
    }, function () { return []; }) : Promise.resolve([]);
    bankP.then(function (bank) {
      if (!window.RA10Tools) throw new Error('Please refresh the page and try again.');
      return RA10Tools.api('drill', { topic: gap.topic, unit: gap.unit, unitName: u ? u.name : '', qual: u ? u.qual : '', question: gap.question, bank: bank });
    }).then(function (r) {
      var items = r.items, i = 0, right = 0, locked = false;
      function show() {
        if (i >= items.length) return done();
        locked = false; bar.style.width = Math.round(i / items.length * 100) + '%';
        body.innerHTML = '<div class="rtg-big" style="font-size:1rem;min-height:90px">' + esc(items[i].q) + '</div><div class="rtg-opts">' + items[i].choices.map(function (c, k) { return '<button type="button" class="rtg-opt" data-k="' + k + '">' + (k + 1) + '. ' + esc(c) + '</button>'; }).join('') + '</div><div data-ex></div><div class="rtg-meta"><span>' + (i + 1) + ' of ' + items.length + '</span><span>' + right + ' right</span></div>';
        $$('[data-k]', body).forEach(function (b) { b.onclick = function () { pick(Number(b.dataset.k)); }; });
      }
      function pick(k) {
        if (locked) return; locked = true;
        var it = items[i], ok = k === it.answer; if (ok) right++;
        $$('[data-k]', body).forEach(function (b) { var n = Number(b.dataset.k); if (n === it.answer) b.classList.add('ok'); else if (n === k) b.classList.add('bad'); b.disabled = true; });
        var ex = $('[data-ex]', body);
        ex.innerHTML = (it.explain ? '<p class="rtg-note" style="margin:10px 0 0">' + esc(it.explain) + '</p>' : '') + '<div class="rtg-actions"><button class="rt-btn dark" type="button" data-next>' + (i + 1 < items.length ? 'Next' : 'Finish') + '</button></div>';
        $('[data-next]', ex).onclick = function () { i++; show(); };
        $('[data-next]', ex).focus();
      }
      function done() {
        bar.style.width = '100%';
        var pass = right >= 2;
        try { if (window.RA10Track) { RA10Track.log('gap_drill', { ref: String(gap.topic).slice(0, 150), title: gap.topic, unit: gap.unit || null, score: right, max_score: items.length }); } } catch (e) {}
        body.innerHTML = '<div class="rtg-res">' + (window.RA10Tools ? RA10Tools.mascot(pass ? 'cheer' : 'think', 84) : '') + '<div class="rtg-score">' + right + '/' + items.length + '</div><p class="rtg-note">' + (pass ? 'Weak spot fixed. Claim your task XP.' : 'Nearly — try the drill again.') + '</p><div class="rtg-actions">' + (pass ? '<button class="rt-btn primary" type="button" data-claim>Claim task XP</button>' : '<button class="rt-btn dark" type="button" data-again>Try again</button>') + '<button class="rt-btn" type="button" data-close>Close</button></div></div>';
        $('[data-close]', body).onclick = function () { close(); refresh(); };
        var ag = $('[data-again]', body); if (ag) ag.onclick = function () { close(); gapDrill(gap); };
        var cl = $('[data-claim]', body);
        if (cl) cl.onclick = function () {
          cl.disabled = true; cl.textContent = 'Claiming…';
          Promise.resolve(window.RA10Track && RA10Track.flush ? RA10Track.flush() : null).then(function () { return rpc('claim_daily_task', { p_key: 'gap_drill' }); }).then(function (res) {
            var g = (Number(res && res.granted) || 0) + (Number(res && res.bonus) || 0);
            toast(g > 0 ? '+' + g + ' XP — weak spot fixed!' : 'Task complete!');
            close(); refresh();
          }, function (e) { cl.disabled = false; cl.textContent = 'Claim task XP'; toast((e && e.message) || 'Try again in a moment.'); });
        };
      }
      show();
    }).catch(function (e) {
      if (e && e.handled) return close();
      body.innerHTML = '<div class="rtg-res"><p>' + esc((e && e.message) || 'Could not build the drill.') + '</p><div class="rtg-actions"><button class="rt-btn" type="button" data-close>Close</button></div></div>';
      $('[data-close]', body).onclick = close;
    });
  }

  // Live progress: refresh the task list when XP lands or the learner comes back.
  window.addEventListener('ra10:xp', function () { if (S.host && document.body.contains(S.host) && S.data) setTimeout(refresh, 600); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible' && S.host && document.body.contains(S.host) && S.data) refresh(); });

  // Sign-in settles after the page renders: draw the page again when it does.
  (function hookAuth(tries) {
    var r = R();
    if (r && typeof r.on === 'function') {
      r.on('authchange', function () {
        var page = document.getElementById('p-tasks');
        if (S.host && document.body.contains(S.host) && page && page.classList.contains('active')) { S.data = null; S.games = null; S.unit = null; render(S.host); }
      });
      return;
    }
    if (tries < 60) setTimeout(function () { hookAuth(tries + 1); }, 250);
  })(0);

  window.RA10Tasks = { render: render, refresh: refresh, _state: S };
})();
