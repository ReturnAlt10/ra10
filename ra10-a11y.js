(function (window, document) {
  // RA10 accessibility preferences.
  // Exposed globally as window.RA10A11y. Preferences are per-device
  // (localStorage) and applied to this document plus any same-origin iframes
  // (revision apps), so a setting chosen once follows the student everywhere.
  if (window.RA10A11y) return;

  const STORAGE_KEY = 'ra10_a11y_prefs_v1';
  const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap';
  const DEFAULTS = {
    textSize: 'default', // default | large | xlarge
    contrast: false,
    reduceMotion: false,
    readableFont: false,
    spacing: false,
    underlineLinks: false,
    strongFocus: false,
  };
  const TOGGLES = [
    { key: 'contrast', label: 'High contrast', hint: 'Darker text and stronger borders.' },
    { key: 'reduceMotion', label: 'Reduce motion', hint: 'Turns off animations and transitions.' },
    { key: 'readableFont', label: 'Readable font', hint: 'Atkinson Hyperlegible, designed for low vision and dyslexia.' },
    { key: 'spacing', label: 'Extra spacing', hint: 'More space between lines, letters and words.' },
    { key: 'underlineLinks', label: 'Underline links', hint: 'Makes links easy to tell apart from text.' },
    { key: 'strongFocus', label: 'Strong focus outline', hint: 'High-visibility outline for keyboard users.' },
  ];
  const CLASS_MAP = {
    contrast: 'a11y-contrast',
    reduceMotion: 'a11y-reduce-motion',
    readableFont: 'a11y-readable-font',
    spacing: 'a11y-spacing',
    underlineLinks: 'a11y-underline-links',
    strongFocus: 'a11y-strong-focus',
  };

  const CSS = `
html.a11y-text-large{font-size:112.5%!important}
html.a11y-text-xlarge{font-size:125%!important}
html.a11y-contrast{--color-text:#000;--color-text-muted:#3b3a36;--color-text-faint:#55544f;--color-border:#6f6c65;--color-divider:#8d8a83}
html.a11y-contrast[data-theme="dark"]{--color-text:#fff;--color-text-muted:#dedddb;--color-text-faint:#bdbcb8;--color-border:#a3a29e;--color-divider:#7d7c78}
html.a11y-reduce-motion *,html.a11y-reduce-motion *::before,html.a11y-reduce-motion *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}
html.a11y-readable-font body,html.a11y-readable-font body *:not(svg):not(svg *):not(code):not(pre):not(kbd){font-family:'Atkinson Hyperlegible',Verdana,Tahoma,sans-serif!important}
html.a11y-spacing p,html.a11y-spacing li,html.a11y-spacing dd,html.a11y-spacing label{line-height:1.9!important;letter-spacing:.04em!important;word-spacing:.12em!important}
html.a11y-underline-links a{text-decoration:underline!important;text-underline-offset:.18em}
html.a11y-strong-focus *:focus-visible{outline:3px solid #ffbf47!important;outline-offset:2px!important;box-shadow:0 0 0 6px #0b0c0c!important;border-radius:2px}

.ra10-a11y-overlay{position:fixed!important;inset:0!important;z-index:2147483640!important;margin:0!important;background:rgba(15,23,42,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;padding-bottom:calc(16px + env(safe-area-inset-bottom,0px))}
.ra10-a11y-overlay[hidden]{display:none!important}
.ra10-a11y-dialog{background:radial-gradient(120% 70% at 25% -25%,rgba(255,255,255,.55),rgba(255,255,255,0) 62%),linear-gradient(180deg,rgba(255,255,255,.86),rgba(250,250,252,.78));-webkit-backdrop-filter:blur(26px) saturate(190%);backdrop-filter:blur(26px) saturate(190%);color:var(--color-text,#1a1a1a);border:0;border-radius:28px;box-shadow:inset 0 0 0 .5px rgba(255,255,255,.42),inset 0 1px 1px rgba(255,255,255,.92),0 0 0 .5px rgba(15,23,42,.08),0 24px 60px -14px rgba(15,23,42,.32),0 6px 18px rgba(15,23,42,.08);width:min(460px,100%);max-height:min(90vh,760px);overflow:auto;padding:24px;font-family:var(--font-b,system-ui,sans-serif)}
[data-theme="dark"] .ra10-a11y-dialog{background:radial-gradient(120% 70% at 25% -25%,rgba(255,255,255,.12),rgba(255,255,255,0) 62%),linear-gradient(180deg,rgba(44,44,50,.9),rgba(28,28,32,.86));box-shadow:inset 0 0 0 .5px rgba(255,255,255,.13),inset 0 1px 1px rgba(255,255,255,.3),0 0 0 .5px rgba(0,0,0,.5),0 26px 64px -14px rgba(0,0,0,.7)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .ra10-a11y-dialog{background:linear-gradient(180deg,rgba(44,44,50,.92),rgba(28,28,32,.9));box-shadow:inset 0 1px 1px rgba(255,255,255,.3),0 26px 64px -14px rgba(0,0,0,.7)}}
html.a11y-contrast .ra10-a11y-dialog{background:var(--color-surface,#fff);-webkit-backdrop-filter:none;backdrop-filter:none}
@media (prefers-reduced-transparency:reduce){.ra10-a11y-dialog{background:var(--color-surface,#fff)!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}}
.ra10-a11y-dialog .ra10-a11y-toggle,.ra10-a11y-dialog .ra10-a11y-size span{background:rgba(255,255,255,.35)}
[data-theme="dark"] .ra10-a11y-dialog .ra10-a11y-toggle,[data-theme="dark"] .ra10-a11y-dialog .ra10-a11y-size span{background:rgba(255,255,255,.05)}
.ra10-a11y-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:16px}
.ra10-a11y-title{font-family:var(--font-d,Georgia,serif);font-size:1.5rem;font-weight:400;line-height:1.2;margin:0}
.ra10-a11y-sub{color:var(--color-text-muted,#5f5e5a);font-size:.9rem;margin:4px 0 0}
.ra10-a11y-close{flex:none;width:40px;height:40px;border-radius:999px;border:1px solid var(--color-border,#d4d1ca);background:transparent;color:inherit;font-size:1.1rem;cursor:pointer}
.ra10-a11y-group{border:0;margin:0 0 16px;padding:0}
.ra10-a11y-legend{font-weight:700;font-size:.95rem;margin-bottom:8px;padding:0}
.ra10-a11y-sizes{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.ra10-a11y-size{position:relative}
.ra10-a11y-size input{position:absolute;opacity:0;width:1px;height:1px}
.ra10-a11y-size span{display:flex;align-items:center;justify-content:center;min-height:48px;border:1px solid var(--color-border,#d4d1ca);border-radius:12px;cursor:pointer;font-weight:600}
.ra10-a11y-size input:checked+span{border-color:var(--color-primary,#d20000);background:var(--color-primary-highlight,#f4d4d4);color:var(--color-text,#1a1a1a)}
.ra10-a11y-size input:focus-visible+span{outline:2px solid var(--color-primary,#d20000);outline-offset:2px}
.ra10-a11y-toggle{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-height:56px;padding:10px 12px;margin-bottom:6px;border:1px solid var(--color-border,#d4d1ca);border-radius:12px;background:transparent;color:inherit;text-align:left;cursor:pointer;font:inherit}
.ra10-a11y-toggle strong{display:block;font-size:.95rem}
.ra10-a11y-toggle small{display:block;color:var(--color-text-muted,#5f5e5a);font-size:.8rem;line-height:1.35}
.ra10-a11y-switch{flex:none;width:44px;height:26px;border-radius:999px;background:var(--color-surface-dynamic,#cfccc6);position:relative;transition:background .15s}
.ra10-a11y-switch::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:transform .15s}
.ra10-a11y-toggle[aria-pressed="true"]{border-color:var(--color-primary,#d20000)}
.ra10-a11y-toggle[aria-pressed="true"] .ra10-a11y-switch{background:var(--color-primary,#d20000)}
.ra10-a11y-toggle[aria-pressed="true"] .ra10-a11y-switch::after{transform:translateX(18px)}
.ra10-a11y-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-top:16px;padding-top:16px;border-top:1px solid var(--color-divider,#dcd9d5);font-size:.9rem}
.ra10-a11y-foot a{color:var(--color-primary,#d20000)}
.ra10-a11y-reset{min-height:44px;padding:8px 16px;border-radius:999px;border:1px solid var(--color-border,#d4d1ca);background:transparent;color:inherit;cursor:pointer;font:inherit}
.ra10-sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
`;

  let prefs = load();
  let overlay = null;
  let lastFocus = null;

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      return Object.assign({}, DEFAULTS, raw && typeof raw === 'object' ? raw : {});
    } catch (e) {
      return Object.assign({}, DEFAULTS);
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {}
  }

  function ensureStyle(doc) {
    if (!doc || !doc.head || doc.getElementById('ra10-a11y-style')) return;
    const style = doc.createElement('style');
    style.id = 'ra10-a11y-style';
    style.textContent = CSS;
    doc.head.appendChild(style);
  }

  function ensureFont(doc) {
    if (!prefs.readableFont || !doc || !doc.head || doc.getElementById('ra10-a11y-font')) return;
    const link = doc.createElement('link');
    link.id = 'ra10-a11y-font';
    link.rel = 'stylesheet';
    link.href = FONT_HREF;
    doc.head.appendChild(link);
  }

  function applyTo(doc) {
    if (!doc || !doc.documentElement) return;
    const root = doc.documentElement;
    ensureStyle(doc);
    ensureFont(doc);
    root.classList.toggle('a11y-text-large', prefs.textSize === 'large');
    root.classList.toggle('a11y-text-xlarge', prefs.textSize === 'xlarge');
    Object.keys(CLASS_MAP).forEach(function (key) {
      root.classList.toggle(CLASS_MAP[key], !!prefs[key]);
    });
  }

  function applyToFrame(frame) {
    try {
      const doc = frame.contentDocument;
      if (doc && doc.readyState !== 'uninitialized') applyTo(doc);
    } catch (e) {
      // Cross-origin frame — nothing we can do.
    }
  }

  function applyEverywhere() {
    applyTo(document);
    document.querySelectorAll('iframe').forEach(applyToFrame);
  }

  function bindFrame(frame) {
    if (frame.dataset.ra10A11yBound) return;
    frame.dataset.ra10A11yBound = '1';
    frame.addEventListener('load', function () { applyToFrame(frame); });
    applyToFrame(frame);
  }

  function bindFrames() {
    document.querySelectorAll('iframe').forEach(bindFrame);
    if (!('MutationObserver' in window)) return;
    new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (node.tagName === 'IFRAME') bindFrame(node);
          else if (node.querySelectorAll) node.querySelectorAll('iframe').forEach(bindFrame);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  function set(key, value) {
    if (!(key in DEFAULTS)) return;
    prefs[key] = value;
    save();
    applyEverywhere();
    syncDialog();
    announce(describe(key));
  }

  function reset() {
    prefs = Object.assign({}, DEFAULTS);
    save();
    applyEverywhere();
    syncDialog();
    announce('Accessibility settings reset to default.');
  }

  function describe(key) {
    if (key === 'textSize') {
      return 'Text size: ' + ({ default: 'default', large: 'large', xlarge: 'extra large' }[prefs.textSize] || 'default') + '.';
    }
    const toggle = TOGGLES.find(function (t) { return t.key === key; });
    return toggle ? toggle.label + (prefs[key] ? ' on.' : ' off.') : '';
  }

  // Polite live region shared by the whole page.
  function announce(message) {
    if (!message || !document.body) return;
    let region = document.getElementById('ra10-live-region');
    if (!region) {
      region = document.createElement('div');
      region.id = 'ra10-live-region';
      region.className = 'ra10-sr-only';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      document.body.appendChild(region);
    }
    region.textContent = '';
    setTimeout(function () { region.textContent = message; }, 50);
  }

  function statementHref() {
    const path = window.location.pathname || '/';
    return path.indexOf('/legal/') !== -1 ? 'accessibility.html' : 'legal/accessibility.html';
  }

  function buildDialog() {
    overlay = document.createElement('div');
    overlay.className = 'ra10-a11y-overlay';
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="ra10-a11y-dialog" role="dialog" aria-modal="true" aria-labelledby="ra10-a11y-title" aria-describedby="ra10-a11y-sub">' +
        '<div class="ra10-a11y-head">' +
          '<div><h2 class="ra10-a11y-title" id="ra10-a11y-title">Accessibility settings</h2>' +
          '<p class="ra10-a11y-sub" id="ra10-a11y-sub">Saved on this device and applied across RA10.</p></div>' +
          '<button type="button" class="ra10-a11y-close" data-a11y-close aria-label="Close accessibility settings">✕</button>' +
        '</div>' +
        '<fieldset class="ra10-a11y-group"><legend class="ra10-a11y-legend">Text size</legend><div class="ra10-a11y-sizes">' +
          ['default|Default|A', 'large|Large|A+', 'xlarge|Extra large|A++'].map(function (row) {
            const parts = row.split('|');
            return '<label class="ra10-a11y-size"><input type="radio" name="ra10-a11y-size" value="' + parts[0] + '">' +
              '<span aria-hidden="true">' + parts[2] + '</span><span class="ra10-sr-only">' + parts[1] + '</span></label>';
          }).join('') +
        '</div></fieldset>' +
        '<div class="ra10-a11y-group" role="group" aria-labelledby="ra10-a11y-display-label">' +
          '<div class="ra10-a11y-legend" id="ra10-a11y-display-label">Display and reading</div>' +
          TOGGLES.map(function (t) {
            return '<button type="button" class="ra10-a11y-toggle" data-a11y-toggle="' + t.key + '" aria-pressed="false">' +
              '<span><strong>' + t.label + '</strong><small>' + t.hint + '</small></span>' +
              '<span class="ra10-a11y-switch" aria-hidden="true"></span></button>';
          }).join('') +
        '</div>' +
        '<div class="ra10-a11y-foot">' +
          '<a href="' + statementHref() + '">Accessibility statement</a>' +
          '<button type="button" class="ra10-a11y-reset" data-a11y-reset>Reset to default</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.closest('[data-a11y-close]')) close();
      const toggle = e.target.closest('[data-a11y-toggle]');
      if (toggle) {
        const key = toggle.getAttribute('data-a11y-toggle');
        set(key, !prefs[key]);
      }
      if (e.target.closest('[data-a11y-reset]')) reset();
    });
    overlay.addEventListener('change', function (e) {
      if (e.target.name === 'ra10-a11y-size') set('textSize', e.target.value);
    });
    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = Array.prototype.filter.call(
        overlay.querySelectorAll('button, a[href], input:checked, input[type="radio"]:not([name])'),
        function (el) { return !el.disabled && el.offsetParent !== null; }
      );
      // Radio groups expose a single tab stop: the checked input.
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  function syncDialog() {
    if (!overlay) return;
    overlay.querySelectorAll('input[name="ra10-a11y-size"]').forEach(function (input) {
      input.checked = input.value === prefs.textSize;
    });
    overlay.querySelectorAll('[data-a11y-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', prefs[btn.getAttribute('data-a11y-toggle')] ? 'true' : 'false');
    });
  }

  function open() {
    if (!overlay) buildDialog();
    lastFocus = document.activeElement;
    syncDialog();
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    const closeBtn = overlay.querySelector('[data-a11y-close]');
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  // Apply as early as possible to avoid a flash of unstyled preferences.
  applyTo(document);

  function onReady() {
    applyEverywhere();
    bindFrames();
    document.addEventListener('click', function (e) {
      const trigger = e.target.closest && e.target.closest('[data-open-a11y]');
      if (trigger) {
        e.preventDefault();
        open();
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();

  // Keep tabs in sync when settings change in another tab.
  window.addEventListener('storage', function (e) {
    if (e.key !== STORAGE_KEY) return;
    prefs = load();
    applyEverywhere();
    syncDialog();
  });

  window.RA10A11y = {
    open: open,
    close: close,
    get: function () { return Object.assign({}, prefs); },
    set: set,
    reset: reset,
    applyTo: applyTo,
    announce: announce,
  };
})(window, document);
