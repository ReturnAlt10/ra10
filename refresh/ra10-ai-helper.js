/* RA10 AI Helper — floating "Ask AI" button, selection pop-up and chat panel
   on revision/unit pages. The UI, saved chat history and liquid glass all
   live in /refresh/ra10-ai.js; this file only boots it. */
(function () {
  'use strict';
  if (window.__ra10AiHelperLoaded) return;
  window.__ra10AiHelperLoaded = true;
  if (!/\/revision\//i.test(String(location.pathname || ''))) return;

  var V = '20261021';
  var base = '/refresh/';
  try {
    var src = (document.currentScript && document.currentScript.src) || '';
    if (src) base = src.replace(/ra10-ai-helper\.js(\?.*)?$/, '');
  } catch (e) {}

  function load(id, url) {
    if (document.getElementById(id)) return;
    var s = document.createElement('script');
    s.id = id;
    s.src = url;
    (document.head || document.documentElement).appendChild(s);
    return s;
  }

  // Some pages (learning-aim notes, mind maps, printable papers) don't load
  // the SDK. Load it so the helper can sign in and spend credits there too.
  function ensureSdk() {
    if (window.RA10 || document.querySelector('script[src*="ra10-sdk.js"]:not(#ra10-ai-sdk)')) return;
    var s = load('ra10-ai-sdk', base + '../ra10-sdk.js?v=' + V);
    if (s) s.onload = function () {
      try { if (window.RA10 && typeof RA10.init === 'function') RA10.init(); } catch (e) {}
    };
  }

  function boot() {
    // The button appears as soon as the UI core is ready; sign-in/credits are
    // checked when the user actually sends something.
    var tries = 0;
    (function wait() {
      if (window.RA10AI) { RA10AI.installHelper(); return; }
      if (++tries < 80) setTimeout(wait, 150);
    })();
    setTimeout(ensureSdk, 2500);
  }

  if (!window.RA10AI) load('ra10-ai-js', base + 'ra10-ai.js?v=' + V);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
