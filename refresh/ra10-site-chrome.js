/* RA10 — the main site's navigation for standalone pages (e.g. /study-hub/).
   Copies the real top navbar, mobile top bar, mobile bottom dock and its two sheets out of
   /index.html (so they never drift from the shell), then wires up the parts that site.js
   normally drives: links, account menu, theme toggle and the mobile sheets.
   Usage: <div id="ra10-site-chrome" data-active="study-hub"></div> + this script (defer).
   Needs /refresh/site.css, ra10-refresh.css and ra10-glass.css on the page, and
   body.ra10-refresh-enabled. */
(function () {
  'use strict';
  var mount = document.getElementById('ra10-site-chrome');
  if (!mount) return;
  var ACTIVE = mount.getAttribute('data-active') || '';
  var CACHE_KEY = 'ra10_site_chrome_v2';
  var PARTS = ['nav.nav', '#mobile-sheet-backdrop', '#mobile-subject-sheet', '.mobile-top-nav', '#mobile-you-sheet', 'nav.mobile-bottom-nav'];

  function toPublic(p) {
    p = String(p || '/');
    if (!/^\//.test(p)) p = '/' + p;
    return p === '/revision' ? '/subjects' : p.replace(/^\/revision\/(btec|a-level)(?=\/|$)/, '/$1');
  }
  // the shell's inline handlers call these
  window.go = function (path) { location.href = toPublic(path); };
  window.hideRevPreview = function () {};
  window.openUnitJumpMenu = function () {};
  window.exitIframeFullscreen = function () {};
  window.openSignInOverlayFallback = function () {
    try { sessionStorage.setItem('ra10_after_auth', location.pathname + location.search); } catch (e) {}
    location.href = '/auth';
  };
  window.dismissA2HS = function () {};

  function extract(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var out = [];
    PARTS.forEach(function (sel) { var n = doc.querySelector(sel); if (n) out.push(n.outerHTML); });
    return out.join('\n');
  }
  function load() {
    try { var c = sessionStorage.getItem(CACHE_KEY); if (c) return Promise.resolve(c); } catch (e) {}
    return fetch('/index.html', { credentials: 'same-origin' }).then(function (r) { return r.text(); }).then(function (html) {
      var parts = extract(html);
      try { sessionStorage.setItem(CACHE_KEY, parts); } catch (e) {}
      return parts;
    });
  }

  function $(s, p) { return (p || document).querySelector(s); }
  function $$(s, p) { return Array.prototype.slice.call((p || document).querySelectorAll(s)); }

  function mountChrome(html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    // shell-only controls that make no sense here
    $$('.nav-unit-jump, .iframe-exit, #rev-preview, #lb-preview, #nav-credit-chip, #mobile-credit-chip, .mobile-you-edit', tmp).forEach(function (n) { n.remove(); });
    // relative links in the shell markup are relative to the site root
    $$('img[src]:not([src^="/"]):not([src^="http"]):not([src^="data:"])', tmp).forEach(function (i) { i.setAttribute('src', '/' + i.getAttribute('src')); });
    $$('a[href]:not([href^="/"]):not([href^="http"]):not([href^="#"]):not([href^="mailto:"])', tmp).forEach(function (a) { a.setAttribute('href', '/' + a.getAttribute('href')); });
    var frag = document.createDocumentFragment();
    while (tmp.firstChild) frag.appendChild(tmp.firstChild);
    mount.replaceWith(frag);
    wire();
  }

  function wire() {
    // active link
    $$('.nav-link').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-nav') === ACTIVE); });
    $$('.mobile-nav-btn').forEach(function (b) { b.classList.remove('active'); b.removeAttribute('aria-current'); });

    // theme (same key and icons as the shell)
    var root = document.documentElement;
    function icon(t) {
      var m = t === 'dark'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      $$('#theme-toggle, #mobile-theme-toggle').forEach(function (b) { b.innerHTML = m; b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); });
    }
    icon(root.getAttribute('data-theme') || 'light');
    $$('#theme-toggle, #mobile-theme-toggle').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', t);
        try { localStorage.setItem('ra10-theme', t); } catch (e) {}
        icon(t);
      });
    });

    // account menu
    var wrap = $('#nav-user-wrap'), btn = $('#nav-user-btn'), dd = $('#nav-user-dropdown');
    if (dd) { document.body.appendChild(dd); dd.style.display = 'none'; dd.style.position = 'fixed'; }
    function place() {
      if (!wrap || !dd || dd.style.display === 'none') return;
      var r = wrap.getBoundingClientRect(), w = dd.offsetWidth || 260;
      dd.style.left = Math.round(Math.max(12, Math.min(r.right - w, innerWidth - w - 12))) + 'px';
      dd.style.top = Math.round(r.bottom + 8) + 'px';
      dd.style.transform = 'none';
    }
    function show(on) { if (!dd) return; dd.style.display = on ? 'block' : 'none'; if (wrap) wrap.classList.toggle('open', on); place(); }
    if (btn) btn.addEventListener('click', function (e) { e.stopPropagation(); show(dd.style.display === 'none'); });
    document.addEventListener('click', function (e) { if (dd && !dd.contains(e.target) && !(wrap && wrap.contains(e.target))) show(false); });
    addEventListener('resize', place);
    var reset = $('#dropdown-reset-pw'); if (reset) reset.addEventListener('click', function () { location.href = '/account'; });
    var a11y = $('[data-open-a11y]', dd || document); if (a11y && !window.RA10A11y) a11y.addEventListener('click', function () { location.href = '/account'; });

    // mobile chrome
    var mq = matchMedia('(max-width: 640px) and (hover: none) and (pointer: coarse)');
    function sync() { document.body.classList.toggle('mobile-ui', mq.matches); }
    sync(); if (mq.addEventListener) mq.addEventListener('change', sync);
    function sheet(name, open) {
      var cls = name === 'you' ? 'mobile-you-open' : 'mobile-sheet-open';
      var other = name === 'you' ? 'mobile-sheet-open' : 'mobile-you-open';
      document.body.classList.remove(other);
      document.body.classList.toggle(cls, open);
      var s = document.getElementById(name === 'you' ? 'mobile-you-sheet' : 'mobile-subject-sheet');
      var b = document.getElementById(name === 'you' ? 'mobile-you-btn' : 'mobile-subjects-btn');
      if (s) s.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (b) b.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    var closeAll = function () { sheet('you', false); sheet('subjects', false); };
    var sb = $('#mobile-subjects-btn'); if (sb) { sb.removeAttribute('onclick'); sb.addEventListener('click', function () { sheet('subjects', !document.body.classList.contains('mobile-sheet-open')); }); }
    var yb = $('#mobile-you-btn'); if (yb) { yb.removeAttribute('onclick'); yb.addEventListener('click', function () { sheet('you', !document.body.classList.contains('mobile-you-open')); }); }
    $$('#mobile-sheet-close, #mobile-you-close, #mobile-sheet-backdrop').forEach(function (n) { n.addEventListener('click', closeAll); });
    $$('[data-mobile-you]').forEach(function (b) { b.addEventListener('click', function () { closeAll(); window.go(b.getAttribute('data-mobile-you')); }); });
    var so = $('#mobile-you-signout');
    if (so) so.addEventListener('click', function () { signOut(); });
    var so2 = $('#nav-signout-btn'); if (so2) so2.addEventListener('click', function () { signOut(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); show(false); } });

    syncUser();
  }

  function signOut() {
    Promise.resolve(window.RA10 && RA10.signOut ? RA10.signOut() : null).then(function () { location.href = '/'; }, function () { location.href = '/'; });
  }

  // signed-in state (name hidden like the shell; avatar initials, email, school link)
  function syncUser() {
    var R = window.RA10;
    var on = !!(R && R.isLoggedIn && R.isLoggedIn());
    var p = on && R.getProfile ? (R.getProfile() || {}) : {};
    var email = on ? ((R.getSession && R.getSession() && R.getSession().user && R.getSession().user.email) || p.email || '') : '';
    var auth = $('#nav-auth-btn'), wrap = $('#nav-user-wrap');
    if (auth) auth.style.display = on ? 'none' : '';
    if (wrap) wrap.style.display = on ? '' : 'none';
    var ini = $('#nav-avatar-initials');
    if (ini && on) {
      var src = p.profile_pic_url;
      if (src) ini.innerHTML = '<img src="' + String(src).replace(/"/g, '&quot;') + '" alt="" style="width:100%;height:100%;border-radius:inherit;object-fit:cover">';
      else ini.textContent = String(p.display_name || p.username || email || '?').replace(/@.*/, '').split(/[\s._-]+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase() || '?';
    }
    var de = $('#dropdown-email'); if (de) de.textContent = email;
    var edu = $('#dropdown-edu-admin');
    if (edu) edu.style.display = on && /^(school_admin|school_teacher)$/.test(String(p.tier || '')) && email.toLowerCase() !== 'mistry.hashim@icloud.com' ? '' : 'none';
    var so = $('#mobile-you-signout'); if (so) so.style.display = on ? '' : 'none';
    var lbl = $('#mobile-you-account-label'); if (lbl) lbl.textContent = on ? 'My Account' : 'Sign in';
  }
  // The page's own code calls RA10.init(); follow the sign-in state as it settles.
  var tries = 0, hooked = false;
  (function follow() {
    if (window.RA10 && !hooked && RA10.on) { hooked = true; try { RA10.on('authchange', function () { if (document.getElementById('nav-user-wrap')) syncUser(); }); } catch (e) {} }
    if (document.getElementById('nav-user-wrap')) syncUser();
    if (tries++ < 40) setTimeout(follow, 250);
  })();

  load().then(mountChrome, function (e) { console.warn('RA10 site chrome failed to load', e); mount.remove(); });
})();
