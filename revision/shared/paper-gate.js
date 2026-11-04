/* RA10 — sign-in required to print / download standalone papers, mark schemes and aim booklets.
   These pages don't load the full SDK, so this reads the stored RA10 session (ra10.auth.token). */
(function () {
  'use strict';
  function signedIn() {
    try {
      var raw = localStorage.getItem('ra10.auth.token');
      if (!raw) return false;
      var s = JSON.parse(raw);
      s = s && (s.currentSession || s);
      return !!(s && (s.refresh_token || (s.access_token && (!s.expires_at || s.expires_at * 1000 > Date.now()))));
    } catch (e) { return false; }
  }
  var css = document.createElement('style');
  css.textContent = '@media print{html.ra10-locked body>*{display:none!important}html.ra10-locked body::after{content:"Sign in at ra10.co.uk to print or download RA10 papers.";display:block;padding:40px;font:700 18px Arial,sans-serif}}' +
    '.ra10-gate-bar{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:99999;display:flex;gap:12px;align-items:center;padding:12px 16px;border-radius:14px;background:#111827;color:#fff;font:600 14px/1.3 Arial,sans-serif;box-shadow:0 14px 40px -12px rgba(0,0,0,.6)}' +
    '.ra10-gate-bar a{padding:8px 14px;border-radius:10px;background:#e11d48;color:#fff;text-decoration:none;font-weight:800}';
  (document.head || document.documentElement).appendChild(css);
  function sync() { document.documentElement.classList.toggle('ra10-locked', !signedIn()); }
  sync();
  window.addEventListener('storage', sync);
  window.addEventListener('beforeprint', sync);
  function prompt() {
    if (document.querySelector('.ra10-gate-bar')) return;
    var bar = document.createElement('div');
    bar.className = 'ra10-gate-bar';
    bar.innerHTML = '<span>Sign in (free) to print or download this paper.</span><a href="/auth" target="_top">Sign in</a>';
    document.body.appendChild(bar);
    setTimeout(function () { bar.remove(); }, 7000);
  }
  var print = window.print ? window.print.bind(window) : null;
  window.print = function () { if (signedIn()) { if (print) print(); } else prompt(); };
  // jsPDF-based "Download PDF" buttons
  setInterval(function () {
    var J = window.jspdf && window.jspdf.jsPDF;
    if (J && J.API && !J.API.__ra10Gate) {
      var save = J.API.save;
      J.API.save = function () { if (!signedIn()) { prompt(); return this; } return save.apply(this, arguments); };
      J.API.__ra10Gate = true;
    }
  }, 800);
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-download-paper], a[download], a[href$=".pdf"]');
    if (b && !signedIn()) { e.preventDefault(); e.stopImmediatePropagation(); prompt(); }
  }, true);
})();
