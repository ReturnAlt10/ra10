/* ---------- THEME ---------- */
(function(){
  const THEME_KEY = 'ra10-theme';
  const btn = document.getElementById('theme-toggle');
  const mobileBtn = document.getElementById('mobile-theme-toggle');
  const themeButtons = [btn, mobileBtn].filter(Boolean);
  const root = document.documentElement;
  function syncIframeThemes(){
    const theme = root.getAttribute('data-theme') || 'light';
    document.querySelectorAll('iframe').forEach(frame => {
      try {
        if (frame.contentWindow) frame.contentWindow.postMessage({ type: 'RA10_THEME', theme }, '*');
      } catch (_) {}
    });
  }
  function applyTheme(theme, persist){
    const next = theme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    icon(next);
    themeButtons.forEach((button) => {
      button.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
    if (persist) localStorage.setItem(THEME_KEY, next);
    syncIframeThemes();
  }
  const initial = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(initial, false);
  themeButtons.forEach((button) => button.addEventListener('click',()=>{
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  }));
  window.addEventListener('storage', (event) => {
    if (event.key === THEME_KEY && event.newValue) applyTheme(event.newValue, false);
  });
  document.querySelectorAll('iframe').forEach(frame => frame.addEventListener('load', syncIframeThemes));
  function icon(t){
    const markup = t==='dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    themeButtons.forEach((button) => { button.innerHTML = markup; });
  }
  window.syncIframeThemes = syncIframeThemes;
})();

/* ---------- ROUTER ---------- */
const ROUTES = {
  '/':                                    'p-home',
  '':                                     'p-home',
  'leaderboard':                          'p-leaderboard',
  '/leaderboard':                         'p-leaderboard',
  '/news':                                'p-news',
  '/updates':                             'p-news',   // old link used by the A-Level paper-1 app
  '/revision':                            'p-revision',
  '/revision/a-level/business-2023':      'p-aqa-business-2023',
  '/revision/a-level/business-2026':      'p-aqa-business-2026',
  '/revision/btec':                       'p-btec',
  '/revision/a-level':                    'p-alevel',
  '/revision/btec/level-3':              'p-btec-l3',
  '/revision/btec/level-3/business':     'p-btec-business-l3',
  '/revision/btec/level-3/business/unit-2': 'p-bus-u2',
  '/revision/btec/level-3/business/unit-3': 'p-bus-u3',
  '/revision/btec/level-3/business/unit-6': 'p-bus-u6',
  '/revision/btec/level-3/business/unit-7': 'p-bus-u7',
  '/revision/btec/level-3/sport':        'p-btec-sport-l3',
  '/revision/btec/level-3/sport/unit-1': 'p-sport-u1',
  '/revision/btec/level-3/sport/unit-2': 'p-sport-u2',
  '/revision/btec/level-3/IT-AAQ':       'p-it-aaq',
  '/revision/btec/level-3/IT-AAQ/unit-1':'p-unit1',
  '/revision/btec/level-3/IT-AAQ/unit-2':'p-unit2',
  '/revision/btec/level-3/IT-AAQ/unit-3':'p-unit3',
  '/revision/btec/level-3/IT-AAQ/unit-4':'p-unit4',
  '/revision/btec/level-2':              'p-btec-l2',
  '/revision/btec/level-2/it':           'p-btec-l2-it',
  '/revision/btec/level-2/it/unit-2':    'p-it-l2-u2',
  '/community':                           'p-community',
  '/tasks':                               'p-tasks',
  '/exams':                               'p-exams',
  '/auth':                                'p-auth',
  '/upgrade':                             'p-upgrade',
  '/account':                             'p-account',
};
const NAV_MAP = {'/':'home','leaderboard':'leaderboard','/revision':'revision','/community':'community','/tasks':'tasks','/exams':'exams'};

let _lbHideTimeout = null;
window._lbHideTimeout = null;

function showLbPreview() {
  clearTimeout(window._lbHideTimeout);
  const wrap = document.getElementById('nav-lb-wrap');
  if (wrap) wrap.classList.add('open');
  const preview = document.getElementById('lb-preview');
  if (preview) {
    ensureNavFlyoutPortal('lb-preview');
    preview.style.display = 'block';
    positionNavFlyout('nav-lb-wrap', 'lb-preview');
  }
  loadLbPreview();
}

function hideLbPreview() {
  window._lbHideTimeout = setTimeout(() => {
    const wrap = document.getElementById('nav-lb-wrap');
    const preview = document.getElementById('lb-preview');
    if (wrap && (wrap.matches(':hover') || wrap.matches(':focus-within'))) return;
    if (preview && (preview.matches(':hover') || preview.matches(':focus-within'))) return;
    const el = document.getElementById('lb-preview');
    if (el) el.style.display = 'none';
    if (wrap) wrap.classList.remove('open');
  }, 300);
}

const _lbDigitStackHtml = '<span class="lb-digit-stack"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span></span>';

function buildCountdownPill(el) {
  if (!el || el.dataset.countdownBuilt === '1') return;
  el.dataset.countdownBuilt = '1';
  const block = (unit, label, a, b) => `
      <span class="lb-time-block" data-unit="${unit}">
        <span class="lb-digits">
          <span class="lb-digit" data-slot="${a}">${_lbDigitStackHtml}</span>
          <span class="lb-digit" data-slot="${b}">${_lbDigitStackHtml}</span>
        </span>
        <span class="lb-time-unit">${label}</span>
      </span>`;
  el.innerHTML = `
    <span class="lbt-head">
      <span class="lbt-live"><i></i>Live</span>
      <span class="lbt-title">Weekly reset</span>
      <span class="lbt-when" data-slot="when"></span>
    </span>
    <span class="lb-count-grid" aria-hidden="true">${block('days', 'Days', 'd1', 'd2')}${block('hours', 'Hours', 'h1', 'h2')}${block('mins', 'Mins', 'm1', 'm2')}${block('secs', 'Secs', 's1', 's2')}</span>
    <span class="lbt-foot">
      <span class="lbt-bar" aria-hidden="true"><i data-slot="bar"></i></span>
      <span class="lbt-caption"><span data-slot="pct"></span><span>Top 3 win <b>credits</b> at reset</span></span>
    </span>
    <span class="lb-visually-hidden" data-slot="aria"></span>
  `;
}

function updateCountdownDigits(el, days, hours, mins, secs) {
  const safeDays = Math.max(0, Math.min(99, days));
  const values = {
    d1: Math.floor(safeDays / 10),
    d2: safeDays % 10,
    h1: Math.floor(hours / 10),
    h2: hours % 10,
    m1: Math.floor(mins / 10),
    m2: mins % 10,
    s1: Math.floor(secs / 10),
    s2: secs % 10,
  };
  Object.entries(values).forEach(([slot, digit]) => {
    const stack = el.querySelector(`[data-slot="${slot}"] .lb-digit-stack`);
    if (stack) stack.style.transform = `translateY(-${digit}em)`;
  });
  const text = `Reset in ${safeDays}d ${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  el.setAttribute('aria-label', text);
  const ariaEl = el.querySelector('[data-slot="aria"]');
  if (ariaEl) ariaEl.textContent = text;
}

// ── Shared navbar on subject-app pages ──────────────────────────────────
// The unit frame sits below the site header (and above the phone dock); these
// CSS variables tell the layout how tall that chrome currently is.
function measureShellChrome() {
  const rootStyle = document.documentElement.style;
  const mobileTop = document.querySelector('.mobile-top-nav');
  const desktopNav = document.querySelector('.nav');
  const dock = document.querySelector('.mobile-bottom-nav');
  const visible = (el) => el && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().height > 0;
  const top = visible(mobileTop) ? mobileTop : (visible(desktopNav) ? desktopNav : null);
  if (top) rootStyle.setProperty('--shell-nav-h', Math.ceil(top.getBoundingClientRect().bottom + (top === desktopNav ? 8 : 0)) + 'px');
  if (visible(dock)) rootStyle.setProperty('--shell-dock-h', Math.ceil(window.innerHeight - dock.getBoundingClientRect().top + 8) + 'px');
  else rootStyle.setProperty('--shell-dock-h', '0px');
}
window.addEventListener('resize', () => { if (document.body.classList.contains('unit-shell-mode')) measureShellChrome(); });

// "Jump to" in the navbar opens the active subject app's section menu.
function openUnitJumpMenu() {
  const frame = document.querySelector('.page-iframe.active iframe');
  if (!frame || !frame.contentWindow) return;
  try {
    if (frame.contentWindow.RA10UnitUI && typeof frame.contentWindow.RA10UnitUI.open === 'function') { frame.contentWindow.RA10UnitUI.open(); return; }
  } catch (e) { /* cross-origin: fall back to a message */ }
  frame.contentWindow.postMessage({ type: 'ra10:unit-open-menu' }, location.origin);
}
window.openUnitJumpMenu = openUnitJumpMenu;

// ── Loading skeleton for subject apps ────────────────────────────────────
// A subject app takes a moment to download and start; until it says it's ready
// ('ra10:unit-ready' from unit-ui.js) the frame shows a skeleton of the dashboard.
const UNIT_SKELETON_HTML = '<div class="unit-skel" aria-hidden="true">'
  + '<div class="us-hero"><div class="us-copy"><i class="us-l s"></i><i class="us-l xl"></i><i class="us-l xl w60"></i><i class="us-l"></i><i class="us-l w80"></i></div>'
  + '<div class="us-stats"><i></i><i></i><i></i><i></i></div></div>'
  + '<div class="us-tiles"><i class="big"></i><i class="big"></i><i></i><i></i><i></i><i></i><i></i></div>'
  + '</div>';
function showUnitSkeleton(pageEl) {
  const wrap = pageEl && pageEl.querySelector('.iframe-wrap');
  const frame = wrap && wrap.querySelector('iframe');
  if (!wrap || !frame || frame.dataset.ready === '1') return;
  if (!wrap.querySelector('.unit-skel')) wrap.insertAdjacentHTML('afterbegin', UNIT_SKELETON_HTML);
  wrap.classList.add('is-loading');
  const done = () => hideUnitSkeleton(frame);
  if (!frame.dataset.skelBound) {
    frame.dataset.skelBound = '1';
    // Fallbacks: the page finished loading (apps without unit-ui), or it is taking far too long.
    frame.addEventListener('load', () => setTimeout(done, 1200));
  }
  clearTimeout(frame._skelTimer);
  frame._skelTimer = setTimeout(done, 15000);
}
function hideUnitSkeleton(frame) {
  if (!frame) return;
  frame.dataset.ready = '1';
  clearTimeout(frame._skelTimer);
  const wrap = frame.closest('.iframe-wrap');
  if (!wrap || !wrap.classList.contains('is-loading')) return;
  wrap.classList.remove('is-loading');
  wrap.classList.add('is-ready');
  const skel = wrap.querySelector('.unit-skel');
  if (skel) setTimeout(() => skel.remove(), 400);
}
window.addEventListener('message', (e) => {
  if (e.origin !== location.origin || !e.data || e.data.type !== 'ra10:unit-ready') return;
  document.querySelectorAll('.page-iframe iframe').forEach(f => { if (f.contentWindow === e.source) hideUnitSkeleton(f); });
});

// The subject app reports which section is open; the navbar button shows it.
function setUnitSectionLabel(title) {
  document.querySelectorAll('.nav-unit-jump').forEach(btn => {
    const span = btn.querySelector('span');
    if (span) span.textContent = title || 'Dashboard';
    btn.setAttribute('aria-label', 'Section: ' + (title || 'Dashboard') + '. Choose another section');
    btn.title = 'Choose a section';
  });
}
window.addEventListener('message', (e) => {
  if (e.origin !== location.origin || !e.data || e.data.type !== 'ra10:unit-view') return;
  const frame = document.querySelector('.page-iframe.active iframe');
  if (frame && e.source !== frame.contentWindow) return;
  setUnitSectionLabel(String(e.data.title || '').slice(0, 40));
});

function nextSundayResetDate() {
  const now = new Date();
  const next = new Date(now);
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
  next.setDate(now.getDate() + daysUntilSunday);
  next.setHours(0, 0, 0, 0);
  return next;
}

function updateLeaderboardCountdown() {
  const target = nextSundayResetDate().getTime();
  const total = Math.max(0, Math.floor((target - Date.now()) / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const WEEK = 7 * 86400;
  const pct = Math.max(0, Math.min(100, Math.round((1 - total / WEEK) * 1000) / 10));
  const urgency = total < 3600 ? 'now' : total < 86400 ? 'soon' : 'ok';
  const whenText = new Date(target).toLocaleDateString(undefined, { weekday: 'long' }) + ' midnight';
  document.querySelectorAll('#lb-preview-countdown, #lb-countdown-inline').forEach((el) => {
    buildCountdownPill(el);
    updateCountdownDigits(el, days, hours, mins, secs);
    el.dataset.urgency = urgency;
    el.style.setProperty('--lbt-p', pct + '%');
    const pc = el.querySelector('[data-slot="pct"]'); if (pc) pc.innerHTML = 'Week <b>' + Math.round(pct) + '%</b> complete';
    const wh = el.querySelector('[data-slot="when"]'); if (wh) wh.textContent = whenText;
  });
}

let _revHideTimeout = null;
window._revHideTimeout = null;

function showRevPreview() {
  clearTimeout(window._revHideTimeout);
  const wrap = document.getElementById('nav-rev-wrap');
  if (wrap) wrap.classList.add('open');
  const preview = document.getElementById('rev-preview');
  if (preview) {
    ensureNavFlyoutPortal('rev-preview');
    preview.style.display = 'block';
    positionNavFlyout('nav-rev-wrap', 'rev-preview');
  }
}

function hideRevPreview() {
  window._revHideTimeout = setTimeout(() => {
    const wrap = document.getElementById('nav-rev-wrap');
    const preview = document.getElementById('rev-preview');
    if (wrap && (wrap.matches(':hover') || wrap.matches(':focus-within'))) return;
    if (preview && (preview.matches(':hover') || preview.matches(':focus-within'))) return;
    const el = document.getElementById('rev-preview');
    if (el) el.style.display = 'none';
    if (wrap) wrap.classList.remove('open');
  }, 300);
}

function bindRevPreviewHover() {
  const wrap = document.getElementById('nav-rev-wrap');
  const preview = document.getElementById('rev-preview');
  if (!wrap || !preview) return;
  if (wrap.dataset.revHoverBound) return;
  wrap.dataset.revHoverBound = '1';
  // Keep the dropdown open while the pointer is over either the button or the
  // dropdown itself. Because the dropdown is portalled to <body>, the button's
  // :hover is lost the instant the pointer crosses the gap, so we track both
  // elements directly with a shared timer instead of relying on :hover.
  wrap.addEventListener('mouseenter', showRevPreview);
  wrap.addEventListener('mouseleave', hideRevPreview);
  wrap.addEventListener('focusin', showRevPreview);
  wrap.addEventListener('focusout', hideRevPreview);
  preview.addEventListener('mouseenter', showRevPreview);
  preview.addEventListener('mouseleave', hideRevPreview);
  preview.addEventListener('focusin', showRevPreview);
  preview.addEventListener('focusout', hideRevPreview);
}

function ensureNavFlyoutPortal(flyoutId) {
  const flyout = document.getElementById(flyoutId);
  if (!flyout) return;
  if (flyout.parentElement !== document.body) {
    document.body.appendChild(flyout);
  }
}

let _accountHideTimeout = null;

function showAccountDropdown() {
  clearTimeout(_accountHideTimeout);
  const wrap = document.getElementById('nav-user-wrap');
  const dropdown = document.getElementById('nav-user-dropdown');
  if (!wrap || !dropdown) return;
  ensureNavFlyoutPortal('nav-user-dropdown');
  wrap.classList.add('open');
  dropdown.style.display = 'block';
  positionNavFlyout('nav-user-wrap', 'nav-user-dropdown');
}

function positionAccountDropdown() {
  positionNavFlyout('nav-user-wrap', 'nav-user-dropdown');
}

function hideAccountDropdown(immediate) {
  clearTimeout(_accountHideTimeout);
  const run = () => {
    const wrap = document.getElementById('nav-user-wrap');
    const dropdown = document.getElementById('nav-user-dropdown');
    if (!immediate) {
      if (wrap && (wrap.matches(':hover') || wrap.matches(':focus-within'))) return;
      if (dropdown && (dropdown.matches(':hover') || dropdown.matches(':focus-within'))) return;
    }
    if (wrap) wrap.classList.remove('open');
    if (dropdown) dropdown.style.display = 'none';
  };
  if (immediate) run();
  else _accountHideTimeout = setTimeout(run, 220);
}

function toggleAccountDropdown() {
  const wrap = document.getElementById('nav-user-wrap');
  if (!wrap) return;
  if (wrap.classList.contains('open')) hideAccountDropdown(true);
  else showAccountDropdown();
}

function positionNavFlyout(anchorId, flyoutId) {
  const anchor = document.getElementById(anchorId);
  const flyout = document.getElementById(flyoutId);
  if (!anchor || !flyout || flyout.style.display === 'none') return;

  const anchorRect = anchor.getBoundingClientRect();
  const gap = 8;
  const viewportPadding = 12;
  const flyoutWidth = flyout.offsetWidth || 320;
  const maxLeft = window.innerWidth - flyoutWidth - viewportPadding;
  const preferredLeft = anchorRect.left + (anchorRect.width / 2) - (flyoutWidth / 2);
  const left = Math.max(viewportPadding, Math.min(preferredLeft, maxLeft));

  flyout.style.left = Math.round(left) + 'px';
  flyout.style.top = Math.round(anchorRect.bottom + gap) + 'px';
  flyout.style.transform = 'none';
}

function bindDesktopHoverPreviews() {
  bindRevPreviewHover();
  const lbWrap = document.getElementById('nav-lb-wrap');
  if (lbWrap && !lbWrap.dataset.previewBound) {
    lbWrap.dataset.previewBound = '1';
    lbWrap.addEventListener('mouseenter', showLbPreview);
    lbWrap.addEventListener('mouseleave', hideLbPreview);
    lbWrap.addEventListener('focusin', showLbPreview);
    lbWrap.addEventListener('focusout', hideLbPreview);
  }
}

window.addEventListener('resize', () => {
  positionNavFlyout('nav-rev-wrap', 'rev-preview');
  positionNavFlyout('nav-lb-wrap', 'lb-preview');
});

window.addEventListener('scroll', () => {
  positionNavFlyout('nav-rev-wrap', 'rev-preview');
  positionNavFlyout('nav-lb-wrap', 'lb-preview');
}, { passive:true });

function openMobileSubjectSheet() {
  document.body.classList.remove('mobile-you-open');
  const youBtn = document.getElementById('mobile-you-btn');
  if (youBtn) youBtn.setAttribute('aria-expanded', 'false');
  const youSheet = document.getElementById('mobile-you-sheet');
  if (youSheet) youSheet.setAttribute('aria-hidden', 'true');

  document.body.classList.add('mobile-sheet-open');
  const btn = document.getElementById('mobile-subjects-btn');
  if (btn) btn.setAttribute('aria-expanded', 'true');
  const sheet = document.getElementById('mobile-subject-sheet');
  if (sheet) sheet.setAttribute('aria-hidden', 'false');
}

function closeMobileSubjectSheet() {
  document.body.classList.remove('mobile-sheet-open');
  const btn = document.getElementById('mobile-subjects-btn');
  if (btn) btn.setAttribute('aria-expanded', 'false');
  const sheet = document.getElementById('mobile-subject-sheet');
  if (sheet) sheet.setAttribute('aria-hidden', 'true');
}

function openMobileYouSheet() {
  document.body.classList.remove('mobile-sheet-open');
  const subjectsBtn = document.getElementById('mobile-subjects-btn');
  if (subjectsBtn) subjectsBtn.setAttribute('aria-expanded', 'false');
  const subjectsSheet = document.getElementById('mobile-subject-sheet');
  if (subjectsSheet) subjectsSheet.setAttribute('aria-hidden', 'true');

  document.body.classList.add('mobile-you-open');
  const btn = document.getElementById('mobile-you-btn');
  if (btn) btn.setAttribute('aria-expanded', 'true');
  const sheet = document.getElementById('mobile-you-sheet');
  if (sheet) sheet.setAttribute('aria-hidden', 'false');
}

function closeMobileYouSheet() {
  document.body.classList.remove('mobile-you-open');
  const btn = document.getElementById('mobile-you-btn');
  if (btn) btn.setAttribute('aria-expanded', 'false');
  const sheet = document.getElementById('mobile-you-sheet');
  if (sheet) sheet.setAttribute('aria-hidden', 'true');
}

// ---------- Customisable mobile dock ----------
const MOBILE_DOCK_KEY = 'ra10-mobile-dock-v1';
// Order matters: these are the dock items (excluding the fixed "More" button).
const MOBILE_DOCK_DEFAULT = ['home', 'subjects', 'exams', 'tasks'];
// Items that live in the "More" drawer and can be promoted into the dock.
const MOBILE_DOCK_POOL = [
  { id: 'home', label: 'Home' },
  { id: 'subjects', label: 'Subjects' },
  { id: 'exams', label: 'Exams' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'community', label: 'Community' },
  { id: 'leaderboard', label: 'Leaderboard' },
];

function getMobileDockOrder() {
  let order = null;
  try {
    const raw = localStorage.getItem(MOBILE_DOCK_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        // Filter to valid ids, preserve order, dedupe.
        const valid = arr.filter(id => MOBILE_DOCK_POOL.some(p => p.id === id));
        const seen = new Set();
        order = valid.filter(id => { if (seen.has(id)) return false; seen.add(id); return true; });
      }
    }
  } catch (e) {}
  if (!order) order = MOBILE_DOCK_DEFAULT.slice();
  // Home is always present and always first.
  if (!order.includes('home')) order.unshift('home');
  return order;
}

function saveMobileDockOrder(order) {
  try { localStorage.setItem(MOBILE_DOCK_KEY, JSON.stringify(order)); } catch (e) {}
}

// Rebuild the dock buttons (excluding the fixed More button) to match order.
function applyMobileDockOrder() {
  const nav = document.querySelector('.mobile-bottom-nav');
  if (!nav) return;
  const order = getMobileDockOrder();
  const moreBtn = document.getElementById('mobile-you-btn');
  // Map of id -> existing button element (first pass).
  const existing = {};
  nav.querySelectorAll('.mobile-nav-btn[data-dock-id]').forEach(btn => {
    if (btn.dataset.dockId !== 'more') existing[btn.dataset.dockId] = btn;
  });
  // Ensure we have buttons for every pool id by cloning a template if needed.
  order.forEach(id => {
    if (existing[id]) return;
    const btn = createDockButton(id);
    existing[id] = btn;
  });
  // Re-append in order, then the More button last.
  order.forEach(id => {
    const btn = existing[id];
    if (btn) nav.appendChild(btn);
  });
  if (moreBtn) nav.appendChild(moreBtn);
  // Remove any dock buttons (except More) that are no longer in the order.
  nav.querySelectorAll('.mobile-nav-btn[data-dock-id]').forEach(btn => {
    const id = btn.dataset.dockId;
    if (id === 'more') return;
    if (!order.includes(id)) btn.remove();
  });
  refreshDockEditUI();
  // Reposition the pebbles to match the current button count.
  syncDockPebbles();
  positionMobileDockBlob();
}

function createDockButton(id) {
  const pool = MOBILE_DOCK_POOL.find(p => p.id === id);
  const btn = document.createElement('button');
  btn.className = 'mobile-nav-btn';
  btn.type = 'button';
  btn.dataset.dockId = id;
  // Keep data-mobile-nav for the active-state highlight, and keep the
  // subjects button special so the sheet still opens.
  btn.dataset.mobileNav = id;
  if (id === 'subjects') {
    btn.id = 'mobile-subjects-btn';
    btn.setAttribute('aria-expanded', 'false');
  }
  btn.innerHTML = dockButtonInner(id, pool ? pool.label : id);
  // Wire onclick based on id.
  bindDockButton(btn, id);
  return btn;
}

function dockButtonInner(id, label) {
  const svgs = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M3 10.5 12 3l9 7.5"></path><path d="M5 9.5V21h14V9.5"></path></svg>',
    subjects: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17.5a.5.5 0 0 1-.77.42L16 19l-3.23 1.92A.5.5 0 0 1 12 20.5V5.5A2.5 2.5 0 0 0 9.5 3H6.5A2.5 2.5 0 0 0 4 5.5V20"></path></svg>',
    exams: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7V3h8v4"/><path d="M4 21V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v15l-2-1.5L16 21l-2-1.5L12 21l-2-1.5L8 21l-2-1.5L4 21z"/><path d="M9 11h6"/><path d="M9 15h4"/></svg>',
    tasks: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M9 6h11"></path><path d="M9 12h11"></path><path d="M9 18h11"></path><path d="M4 6l1.5 1.5L7.5 5.5"></path><path d="M4 12l1.5 1.5L7.5 11.5"></path><path d="M4 18l1.5 1.5L7.5 17.5"></path></svg>',
    community: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    leaderboard: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 4h10v3a5 5 0 0 1-10 0z"></path><path d="M7 6H4a2 2 0 0 0 2 3M17 6h3a2 2 0 0 1-2 3"></path></svg>',
  };
  return (svgs[id] || '') + '<span>' + label + '</span>';
}

function bindDockButton(btn, id) {
  btn.onclick = function (ev) {
    if (document.body.classList.contains('mobile-dock-edit')) {
      ev.preventDefault();
      return; // Ignore navigation while editing.
    }
    if (id === 'subjects') {
      if (document.body.classList.contains('mobile-sheet-open')) closeMobileSubjectSheet();
      else openMobileSubjectSheet();
    } else if (id === 'home') go('/');
    else if (id === 'exams') go('/exams');
    else if (id === 'tasks') go('/tasks');
    else if (id === 'community') go('/community');
    else if (id === 'leaderboard') go('leaderboard');
  };
}

function refreshDockEditUI() {
  const editing = document.body.classList.contains('mobile-dock-edit');
  const order = getMobileDockOrder();
  const list = document.querySelector('.mobile-you-list');

  // Toggle the Edit dock button into a Done button (vice versa).
  const editBtn = document.getElementById('mobile-you-edit');
  if (editBtn) {
    const editIcon = editBtn.querySelector('.edit-icon');
    const doneIcon = editBtn.querySelector('.done-icon');
    const label = document.getElementById('mobile-you-edit-label');
    if (editing) {
      editBtn.classList.add('is-done');
      if (editIcon) editIcon.style.display = 'none';
      if (doneIcon) doneIcon.style.display = '';
      if (label) label.textContent = 'Done';
    } else {
      editBtn.classList.remove('is-done');
      if (editIcon) editIcon.style.display = '';
      if (doneIcon) doneIcon.style.display = 'none';
      if (label) label.textContent = 'Edit dock';
    }
  }

  if (!list) return;
  // For each pool item, reflect whether it's in the dock.
  list.querySelectorAll('.mobile-you-item[data-dock-item]').forEach(item => {
    const id = item.dataset.dockItem;
    const inDock = order.includes(id);
    item.classList.toggle('dock-missing', !inDock);
    const add = item.querySelector('.mobile-you-add');
    const remove = item.querySelector('.mobile-you-remove');
    if (editing) {
      // In edit mode show everything so users can add/remove/reorder.
      item.style.display = '';
      if (inDock) { if (add) add.style.display = 'none'; if (remove) remove.style.display = 'inline-flex'; }
      else { if (add) add.style.display = 'inline-flex'; if (remove) remove.style.display = 'none'; }
    } else {
      // Outside edit mode, hide items that are already in the dock.
      item.style.display = inDock ? 'none' : '';
      if (add) add.style.display = 'none';
      if (remove) remove.style.display = 'none';
    }
  });
}

function enterDockEdit() {
  document.body.classList.add('mobile-dock-edit');
  // Add remove/add controls to the pool items in the You drawer.
  ensureDockPoolControls();
  refreshDockEditUI();
  closeMobileYouSheet();
  const sheet = document.getElementById('mobile-you-sheet');
  // Re-open the sheet so the user sees the editing list.
  openMobileYouSheet();
  refreshDockEditUI();
}

function exitDockEdit() {
  document.body.classList.remove('mobile-dock-edit');
  refreshDockEditUI();
}

function ensureDockPoolControls() {
  const list = document.querySelector('.mobile-you-list');
  if (!list) return;
  list.querySelectorAll('.mobile-you-item[data-dock-item]').forEach(item => {
    if (item.querySelector('.mobile-you-remove')) return;
    const remove = document.createElement('button');
    remove.className = 'mobile-you-remove';
    remove.type = 'button';
    remove.innerHTML = '−';
    remove.setAttribute('aria-label', 'Remove from dock');
    remove.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = item.dataset.dockItem;
      removeFromDock(id);
    });
    const add = document.createElement('em');
    add.className = 'mobile-you-add';
    add.textContent = 'Add';
    add.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = item.dataset.dockItem;
      addToDock(id);
    });
    item.appendChild(add);
    item.appendChild(remove);
  });
}

// The dock holds the fixed Home button plus a limited number of extra items.
const MOBILE_DOCK_MAX_EXTRA = 3; // Home + 3 others = 4 total dock buttons.

function removeFromDock(id) {
  if (id === 'home') {
    showDockToast('The Home button can&rsquo;t be removed.');
    return;
  }
  let order = getMobileDockOrder();
  if (order.length <= 1) return; // keep at least one item
  order = order.filter(x => x !== id);
  saveMobileDockOrder(order);
  applyMobileDockOrder();
  refreshDockEditUI();
}

function addToDock(id) {
  const order = getMobileDockOrder();
  if (order.includes(id)) return;
  // Home is always present; limit the number of extra items.
  const extras = order.filter(x => x !== 'home').length;
  if (extras >= MOBILE_DOCK_MAX_EXTRA) {
    showDockToast('You can add up to ' + MOBILE_DOCK_MAX_EXTRA + ' extra buttons. Remove one first.');
    return;
  }
  order.push(id);
  saveMobileDockOrder(order);
  applyMobileDockOrder();
  refreshDockEditUI();
}

let _dockToastTimer = null;
function showDockToast(html) {
  let toast = document.getElementById('mobile-dock-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'mobile-dock-toast';
    toast.className = 'mobile-dock-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = html;
  // Force reflow then show.
  void toast.offsetWidth;
  toast.classList.add('show');
  clearTimeout(_dockToastTimer);
  _dockToastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// Move the morphing "liquid" blob so it sits under (and stretches to) the
// active dock button, like a gooey indicator that morphs between buttons.
function positionMobileDockBlob() {
  const nav = document.querySelector('.mobile-bottom-nav');
  const blob = document.getElementById('mobile-dock-blob');
  if (!nav || !blob) return;
  const active = nav.querySelector('.mobile-nav-btn.active');
  if (!active) {
    blob.style.width = '0';
    return;
  }
  moveDockBlobTo(active);
}

// Liquid Glass lens: spans almost the whole tab cell, like iOS.
function moveDockBlobTo(btn) {
  const nav = document.querySelector('.mobile-bottom-nav');
  const blob = document.getElementById('mobile-dock-blob');
  if (!nav || !blob || !btn) return;
  const navRect = nav.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  // Uses the independent `translate` property (not `transform`) so the
  // press-time `scale` magnifies the lens in place instead of shifting it.
  blob.style.transform = 'none';
  blob.style.translate = (btnRect.left - navRect.left + 1) + 'px 0';
  blob.style.width = (btnRect.width - 2) + 'px';
}

// While a finger is on the dock the lens magnifies and follows it from tab
// to tab; releasing over a different tab than the one pressed opens it.
function initDockLiquidPress() {
  const nav = document.querySelector('.mobile-bottom-nav');
  if (!nav) return;
  let startBtn = null;
  let underBtn = null;

  function setUnder(btn) {
    if (btn === underBtn) return;
    if (underBtn) underBtn.classList.remove('is-under-finger');
    underBtn = btn;
    if (btn) {
      btn.classList.add('is-under-finger');
      moveDockBlobTo(btn);
    }
  }
  function end(commit) {
    if (!startBtn) return;
    const target = underBtn;
    const pressed = startBtn;
    startBtn = null;
    setUnder(null);
    nav.classList.remove('is-pressing');
    if (commit && target && target !== pressed) {
      target.click();
      // The browser may still fire its own click on the originally pressed
      // tab (touch capture keeps it as the target) — swallow that one.
      const swallow = (e) => {
        if (e.target.closest && e.target.closest('.mobile-nav-btn') === pressed) {
          e.stopPropagation();
          e.preventDefault();
        }
      };
      nav.addEventListener('click', swallow, true);
      setTimeout(() => nav.removeEventListener('click', swallow, true), 400);
    }
    setTimeout(positionMobileDockBlob, 80);
  }

  nav.addEventListener('pointerdown', (e) => {
    if (document.body.classList.contains('mobile-dock-edit')) return;
    const btn = e.target.closest('.mobile-nav-btn');
    if (!btn) return;
    startBtn = btn;
    nav.classList.add('is-pressing');
    setUnder(btn);
  });
  nav.addEventListener('pointermove', (e) => {
    if (!startBtn) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const btn = el && el.closest ? el.closest('.mobile-bottom-nav .mobile-nav-btn') : null;
    if (btn) setUnder(btn);
  });
  nav.addEventListener('pointerup', () => end(true));
  nav.addEventListener('pointercancel', () => end(false));
  nav.addEventListener('lostpointercapture', () => end(false));
}

// Reposition the gooey pebbles so each sits at the centre of a dock button.
function syncDockPebbles() {
  const nav = document.querySelector('.mobile-bottom-nav');
  if (!nav) return;
  const buttons = nav.querySelectorAll('.mobile-nav-btn[data-dock-id]');
  const navRect = nav.getBoundingClientRect();
  buttons.forEach(btn => {
    const id = btn.dataset.dockId;
    const pebble = nav.querySelector('.mobile-dock-pebble[data-pebble="' + id + '"]');
    if (!pebble) return;
    if (!id) return;
    const btnRect = btn.getBoundingClientRect();
    const centerX = (btnRect.left - navRect.left) + btnRect.width / 2;
    pebble.style.transform = 'translateX(' + (centerX - 4) + 'px)';
  });
}

function initDockReorder() {
  const nav = document.querySelector('.mobile-bottom-nav');
  if (!nav) return;
  let dragEl = null;
  nav.addEventListener('pointerdown', (e) => {
    if (!document.body.classList.contains('mobile-dock-edit')) return;
    const btn = e.target.closest('.mobile-nav-btn[data-dock-id]');
    if (!btn || btn.dataset.dockId === 'more') return;
    dragEl = btn;
    dragEl.classList.add('dock-dragging');
    dragEl.setPointerCapture(e.pointerId);
  });
  nav.addEventListener('pointermove', (e) => {
    if (!dragEl) return;
    // Determine which sibling to swap with.
    const navEl = nav;
    const btns = Array.from(navEl.querySelectorAll('.mobile-nav-btn[data-dock-id]')).filter(b => b.dataset.dockId !== 'more');
    const dragRect = dragEl.getBoundingClientRect();
    const cx = dragRect.left + dragRect.width / 2;
    for (const b of btns) {
      if (b === dragEl) continue;
      const r = b.getBoundingClientRect();
      const bcx = r.left + r.width / 2;
      if ((cx > bcx && dragRect.left < r.right) || (cx < bcx && dragRect.right > r.left)) {
        // swap order in DOM
        const a = dragEl, bb = b;
        if (a.compareDocumentPosition(bb) & Node.DOCUMENT_POSITION_FOLLOWING) {
          navEl.insertBefore(a, bb);
        } else {
          navEl.insertBefore(a, bb.nextSibling);
        }
        break;
      }
    }
  });
  nav.addEventListener('pointerup', (e) => {
    if (!dragEl) return;
    dragEl.classList.remove('dock-dragging');
    if (dragEl.hasPointerCapture && dragEl.hasPointerCapture(e.pointerId)) dragEl.releasePointerCapture(e.pointerId);
    dragEl = null;
    // Persist new order.
    const order = Array.from(nav.querySelectorAll('.mobile-nav-btn[data-dock-id]'))
      .filter(b => b.dataset.dockId !== 'more')
      .map(b => b.dataset.dockId);
    saveMobileDockOrder(order);
    refreshDockEditUI();
  });
}

function updateYouAccountIcon(profile) {
  const icon = document.getElementById('mobile-you-account-icon');
  if (!icon) return;
  const url = getProfilePictureUrl(profile);
  if (url) {
    icon.classList.add('mobile-you-account-avatar');
    const img = document.createElement('img');
    img.src = url;
    img.alt = '';
    img.loading = 'lazy';
    img.onerror = function () {
      icon.classList.remove('mobile-you-account-avatar');
      icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"></circle><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"></path></svg>';
    };
    icon.innerHTML = '';
    icon.appendChild(img);
  } else {
    icon.classList.remove('mobile-you-account-avatar');
    icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"></circle><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"></path></svg>';
  }
}

function syncMobileNavChrome() {
  const isMobile = window.matchMedia('(max-width: 640px) and (hover: none) and (pointer: coarse)').matches;
  const topNav = document.querySelector('.mobile-top-nav');
  const bottomNav = document.querySelector('.mobile-bottom-nav');
  const sheet = document.getElementById('mobile-subject-sheet');
  document.body.classList.toggle('mobile-ui', isMobile);
  if (topNav) {
    topNav.style.display = isMobile ? 'flex' : '';
    topNav.style.position = '';
    topNav.style.top = '';
    topNav.style.left = '';
    topNav.style.right = '';
  }
  if (bottomNav) {
    bottomNav.style.display = isMobile ? 'flex' : '';
    bottomNav.style.position = '';
    bottomNav.style.left = '';
    bottomNav.style.right = '';
    bottomNav.style.bottom = '';
    bottomNav.style.zIndex = '';
    bottomNav.style.visibility = '';
    bottomNav.style.pointerEvents = '';
  }
  if (!isMobile && document.body.classList.contains('mobile-sheet-open')) {
    closeMobileSubjectSheet();
  }
  if (!isMobile && document.body.classList.contains('mobile-you-open')) {
    closeMobileYouSheet();
  }
  if (isMobile && sheet && sheet.getAttribute('aria-hidden') === 'true') {
    document.body.classList.remove('mobile-sheet-open');
  }
}

function openSignInOverlayFallback() {
  const overlayIds = [
    'set-password-overlay',
    'profile-setup-overlay',
    'username-setup-overlay',
    'account-delete-overlay',
    'plan-welcome-overlay'
  ];
  overlayIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('open');
      el.setAttribute('hidden', '');
    }
  });

  const overlay = document.getElementById('auth-overlay');
  if (!overlay) return;
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.zIndex = '2147483600';
  overlay.removeAttribute('hidden');
  overlay.classList.add('open');
  ['signin', 'signup', 'forgot'].forEach((tab) => {
    document.getElementById('tab-' + tab)?.classList.toggle('active', tab === 'signin');
    document.getElementById('panel-' + tab)?.classList.toggle('active', tab === 'signin');
  });
  document.body.classList.add('auth-popup-open');
}

function openAccountOrSignIn() {
  try {
    if (window.RA10 && typeof window.RA10.isLoggedIn === 'function' && window.RA10.isLoggedIn()) {
      go('/account');
      return;
    }
  } catch (_err) {}
  openSignInOverlayFallback();
}

document.addEventListener('click', (event) => {
  const signInBtn = event.target && event.target.closest ? event.target.closest('#nav-auth-btn') : null;
  if (signInBtn) {
    event.preventDefault();
    openSignInOverlayFallback();
    return;
  }
  const mobileProfileBtn = event.target && event.target.closest ? event.target.closest('#mobile-profile-btn') : null;
  if (mobileProfileBtn) {
    event.preventDefault();
    openAccountOrSignIn();
  }
});

function getLeaderboardBadgeEmoji(profile) {
  // leaderboard_badge is historical podium metadata and must not decorate the current week's name.
  return String((profile && (profile.badge_emoji || profile.emoji_badge)) || '').trim();
}

function getLeaderboardDisplayName(profile) {
  const badge = getLeaderboardBadgeEmoji(profile);
  const name = profile?.username ? '@' + profile.username : (profile?.full_name || 'Anonymous');
  return badge ? badge + ' ' + name : name;
}

function getEarnedLeaderboardBadge(profile) {
  const badge = getLeaderboardBadgeEmoji(profile);
  const week = String(profile?.leaderboard_badge_week || '').trim();
  const credits = Number(profile?.leaderboard_award_credits || 0);
  if (!badge || !week) return '';
  return badge + ' · Week of ' + week + (credits > 0 ? ' · +' + credits + ' credits' : '');
}

function getLeaderboardInitials(profile) {
  const raw = String(profile?.full_name || profile?.username || 'RA').trim();
  const cleaned = raw.replace(/^@+/, '').replace(/[^a-zA-Z0-9 ]+/g, ' ').trim();
  if (!cleaned) return 'RA';
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getProfilePictureUrl(profile) {
  if (!profile || typeof profile !== 'object') return '';
  const candidates = [
    profile.profile_pic_url,
    profile.profile_picture_url,
    profile.profile_image_url,
    profile.avatar_url,
    profile.image_url
  ];
  for (const c of candidates) {
    const url = String(c || '').trim();
    if (!url) continue;
    if (/^https?:\/\//i.test(url)) return url;
  }
  return '';
}

function renderCircleAvatar(el, imageUrl, initials) {
  if (!el) return;
  const safeInitials = String(initials || '?').slice(0, 2).toUpperCase();
  const url = String(imageUrl || '').trim();
  el.innerHTML = '';
  if (url && /^https?:\/\//i.test(url)) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = '';
    img.loading = 'lazy';
    img.onerror = function() {
      el.innerHTML = '';
      el.textContent = safeInitials;
    };
    el.appendChild(img);
    return;
  }
  el.textContent = safeInitials;
}

function isMissingProfilePicColumnError(err) {
  const msg = String((err && err.message) || err || '');
  if (!msg) return false;
  if (/column .* does not exist/i.test(msg)) return true;
  if (/schema cache/i.test(msg) && /(profile_pic_url|profile_picture_url|profile_image_url|avatar_url|image_url)/i.test(msg)) return true;
  return false;
}

function escapeHtmlAttr(v) {
  return String(v || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function validateProfileImageUrl(raw) {
  const value = String(raw || '').trim();
  if (!value) return { ok: true, value: '' };
  if (!/^https?:\/\//i.test(value)) {
    return { ok: false, value, error: 'Use a full URL starting with http:// or https://.' };
  }
  if (value.length > 1000) {
    return { ok: false, value, error: 'URL is too long.' };
  }
  return { ok: true, value };
}

async function uploadProfilePictureToCatbox(file) {
  if (!file) throw new Error('Choose an image file first.');
  if (!String(file.type || '').startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }
  if (Number(file.size || 0) > 2 * 1024 * 1024) {
    throw new Error('Image is too large. Please use a file smaller than 2 MB.');
  }

  const contentBase64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image file.'));
    reader.onload = () => {
      const result = String(reader.result || '');
      const parts = result.split(',', 2);
      resolve(parts.length === 2 ? parts[1] : '');
    };
    reader.readAsDataURL(file);
  });

  if (!contentBase64 || typeof contentBase64 !== 'string') {
    throw new Error('Could not process image file.');
  }

  try {
    const data = await callAuthedFunctionGlobal('upload-profile-image', {
      fileName: String(file.name || 'avatar.png').slice(0, 140),
      mimeType: String(file.type || 'application/octet-stream').slice(0, 80),
      contentBase64,
    });
    const uploadedUrl = String((data && data.url) || '').trim();
    if (!/^https?:\/\//i.test(uploadedUrl)) {
      throw new Error('Upload did not return a valid URL.');
    }
    return uploadedUrl;
  } catch (e) {
    const msg = String((e && e.message) || '');
    if (msg) throw new Error(msg);
    throw new Error('Image host upload failed. Open image host and paste the URL manually.');
  }
}

async function callAuthedFunctionGlobal(functionName, payload) {
  const token = getAuthAccessTokenOrThrow();
  const res = await fetch('https://tcrrgsylxbyyrmnouihl.supabase.co/functions/v1/' + encodeURIComponent(functionName), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(payload || {})
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {}
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || text || 'Request failed.';
    throw new Error(msg);
  }
  return data;
}

async function deleteOwnProfilePictureStorage() {
  const data = await callAuthedFunctionGlobal('upload-profile-image', { deleteOnly: true });
  return !!(data && data.ok);
}

function renderAccountPicturePreview(url) {
  const wrap = document.getElementById('account-pic-preview-wrap');
  const img = document.getElementById('account-pic-preview-img');
  if (!wrap || !img) return;
  const src = String(url || '').trim();
  if (!src) {
    wrap.style.display = 'none';
    img.removeAttribute('src');
    return;
  }
  img.src = src;
  wrap.style.display = 'flex';
}

function renderAccountPictureDisplay(url) {
  const wrap = document.getElementById('account-profile-pic-display-wrap');
  const img = document.getElementById('account-profile-pic-display');
  if (!wrap || !img) return;
  const src = String(url || '').trim();
  if (!src) {
    wrap.style.display = 'none';
    img.removeAttribute('src');
    return;
  }
  img.src = src;
  wrap.style.display = 'flex';
}

function getAuthAccessTokenOrThrow() {
  const session = RA10.getSession ? RA10.getSession() : null;
  const token = session && session.access_token;
  if (!token) throw new Error('Not authenticated.');
  return token;
}

async function authedProfilesRequest(method, query, payload, preferHeader) {
  const token = getAuthAccessTokenOrThrow();
  const url = 'https://tcrrgsylxbyyrmnouihl.supabase.co/rest/v1/profiles' + (query || '');
  const headers = {
    'Content-Type': 'application/json',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyMTEsImV4cCI6MjA5MzQ2MTIxMX0.eOp6ma-mfgh8F20nM7E2OaBW28LlZlwuEEWr6k2zDWw',
    'Authorization': 'Bearer ' + token,
  };
  if (preferHeader) headers['Prefer'] = preferHeader;
  const res = await fetch(url, {
    method,
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {}
  if (!res.ok) {
    const msg = (data && (data.message || data.error_description || data.error)) || text || 'Request failed.';
    throw new Error(msg);
  }
  return data;
}

async function fetchCurrentUserProfilePicture(sb, userId) {
  if (!userId) return '';
  const query = '?select=profile_pic_url&id=eq.' + encodeURIComponent(userId) + '&limit=1';
  const rows = await authedProfilesRequest('GET', query, null, null);
  const row = Array.isArray(rows) && rows.length ? rows[0] : null;
  return String((row && row.profile_pic_url) || '').trim();
}

async function upsertCurrentUserProfilePicture(sb, userId, pictureUrlOrNull) {
  const profile = RA10.getProfile ? (RA10.getProfile() || {}) : {};
  const session = RA10.getSession ? (RA10.getSession() || {}) : {};
  const user = session.user || {};
  const payload = {
    id: userId,
    profile_pic_url: pictureUrlOrNull ? String(pictureUrlOrNull).trim() : null,
    email: String(profile.email || user.email || '').trim() || null,
    full_name: String(profile.full_name || profile.display_name || user.user_metadata?.full_name || '').trim() || null,
  };
  const rows = await authedProfilesRequest('POST', '?on_conflict=id', payload, 'resolution=merge-duplicates,return=representation');
  if (!Array.isArray(rows) || !rows.length) {
    throw new Error('Could not upsert profile row.');
  }
}

function getLeaderboardWeekKey() {
  return nextSundayResetDate().toISOString().slice(0, 10);
}

function getLeaderboardTheme() {
  const themes = [
    {
      name: 'Neon Night Run', icon: '🌃', copy: 'Glowing city lanes and late-night grind energy.',
      hero: { spotA: 'rgba(56,189,248,.28)', spotB: 'rgba(236,72,153,.22)', g1: '#f0f9ff', g2: '#eef2ff', g3: '#fff1fb', border: '#93c5fd', shadow: 'rgba(37,99,235,.16)' },
      stage: { border: '#93c5fd', spotA: 'rgba(191,219,254,.45)', spotB: 'rgba(244,114,182,.26)', g1: '#f3f8ff', g2: '#eef4ff', g3: '#fff4fb', shadow: 'rgba(29,78,216,.16)' },
      banner: { a: '#2563eb', b: '#db2777', shadow: 'rgba(37,99,235,.34)' },
      podium: {
        1: { accent: 'linear-gradient(180deg,#93c5fd 0%,#2563eb 100%)', glow: '0 20px 35px rgba(37,99,235,.3)' },
        2: { accent: 'linear-gradient(180deg,#f9a8d4 0%,#db2777 100%)', glow: '0 16px 28px rgba(219,39,119,.22)' },
        3: { accent: 'linear-gradient(180deg,#c4b5fd 0%,#7c3aed 100%)', glow: '0 16px 28px rgba(124,58,237,.2)' }
      }
    },
    {
      name: 'Sunset Sprint', icon: '🌅', copy: 'Warm tones, fast starts, and sharp finishing kicks.',
      hero: { spotA: 'rgba(251,146,60,.3)', spotB: 'rgba(239,68,68,.2)', g1: '#fff7ed', g2: '#ffedd5', g3: '#fff1f2', border: '#fdba74', shadow: 'rgba(234,88,12,.14)' },
      stage: { border: '#fdba74', spotA: 'rgba(254,215,170,.45)', spotB: 'rgba(252,165,165,.28)', g1: '#fff8ef', g2: '#fff1e2', g3: '#fff5f5', shadow: 'rgba(194,65,12,.16)' },
      banner: { a: '#ea580c', b: '#ef4444', shadow: 'rgba(234,88,12,.34)' },
      podium: {
        1: { accent: 'linear-gradient(180deg,#fdba74 0%,#ea580c 100%)', glow: '0 20px 35px rgba(234,88,12,.3)' },
        2: { accent: 'linear-gradient(180deg,#fca5a5 0%,#ef4444 100%)', glow: '0 16px 28px rgba(239,68,68,.22)' },
        3: { accent: 'linear-gradient(180deg,#fdba74 0%,#f97316 100%)', glow: '0 16px 28px rgba(249,115,22,.2)' }
      }
    },
    {
      name: 'Retro Arcade', icon: '🕹️', copy: 'Pixel vibes, combo streaks, and high-score pressure.',
      hero: { spotA: 'rgba(45,212,191,.26)', spotB: 'rgba(168,85,247,.24)', g1: '#f0fdfa', g2: '#ecfeff', g3: '#f5f3ff', border: '#5eead4', shadow: 'rgba(13,148,136,.16)' },
      stage: { border: '#5eead4', spotA: 'rgba(153,246,228,.42)', spotB: 'rgba(196,181,253,.28)', g1: '#f2fffc', g2: '#effcff', g3: '#f7f4ff', shadow: 'rgba(15,118,110,.16)' },
      banner: { a: '#0f766e', b: '#7c3aed', shadow: 'rgba(15,118,110,.34)' },
      podium: {
        1: { accent: 'linear-gradient(180deg,#5eead4 0%,#0f766e 100%)', glow: '0 20px 35px rgba(15,118,110,.3)' },
        2: { accent: 'linear-gradient(180deg,#c4b5fd 0%,#7c3aed 100%)', glow: '0 16px 28px rgba(124,58,237,.22)' },
        3: { accent: 'linear-gradient(180deg,#67e8f9 0%,#0891b2 100%)', glow: '0 16px 28px rgba(8,145,178,.2)' }
      }
    },
    {
      name: 'Cosmic Drift', icon: '🪐', copy: 'Orbiting progress with spaced-out momentum.',
      hero: { spotA: 'rgba(99,102,241,.28)', spotB: 'rgba(168,85,247,.22)', g1: '#eef2ff', g2: '#f5f3ff', g3: '#faf5ff', border: '#a5b4fc', shadow: 'rgba(79,70,229,.16)' },
      stage: { border: '#a5b4fc', spotA: 'rgba(199,210,254,.44)', spotB: 'rgba(216,180,254,.28)', g1: '#f1f4ff', g2: '#f7f4ff', g3: '#fcf7ff', shadow: 'rgba(99,102,241,.16)' },
      banner: { a: '#4f46e5', b: '#9333ea', shadow: 'rgba(79,70,229,.34)' },
      podium: {
        1: { accent: 'linear-gradient(180deg,#a5b4fc 0%,#4f46e5 100%)', glow: '0 20px 35px rgba(79,70,229,.3)' },
        2: { accent: 'linear-gradient(180deg,#d8b4fe 0%,#9333ea 100%)', glow: '0 16px 28px rgba(147,51,234,.22)' },
        3: { accent: 'linear-gradient(180deg,#c4b5fd 0%,#7c3aed 100%)', glow: '0 16px 28px rgba(124,58,237,.2)' }
      }
    },
    {
      name: 'Ocean Pulse', icon: '🌊', copy: 'Wave-by-wave progress with calm, steady gains.',
      hero: { spotA: 'rgba(14,165,233,.28)', spotB: 'rgba(45,212,191,.2)', g1: '#f0f9ff', g2: '#ecfeff', g3: '#f0fdfa', border: '#7dd3fc', shadow: 'rgba(14,116,144,.15)' },
      stage: { border: '#7dd3fc', spotA: 'rgba(125,211,252,.44)', spotB: 'rgba(153,246,228,.28)', g1: '#f2faff', g2: '#edfeff', g3: '#f2fffc', shadow: 'rgba(3,105,161,.15)' },
      banner: { a: '#0284c7', b: '#0f766e', shadow: 'rgba(2,132,199,.34)' },
      podium: {
        1: { accent: 'linear-gradient(180deg,#7dd3fc 0%,#0284c7 100%)', glow: '0 20px 35px rgba(2,132,199,.3)' },
        2: { accent: 'linear-gradient(180deg,#67e8f9 0%,#0891b2 100%)', glow: '0 16px 28px rgba(8,145,178,.22)' },
        3: { accent: 'linear-gradient(180deg,#5eead4 0%,#0f766e 100%)', glow: '0 16px 28px rgba(15,118,110,.2)' }
      }
    },
    {
      name: 'Solar Flare', icon: '☀️', copy: 'Bright streaks, high heat, and explosive XP pushes.',
      hero: { spotA: 'rgba(250,204,21,.3)', spotB: 'rgba(251,146,60,.24)', g1: '#fffbeb', g2: '#fff7ed', g3: '#fff1f2', border: '#fcd34d', shadow: 'rgba(217,119,6,.14)' },
      stage: { border: '#fcd34d', spotA: 'rgba(253,224,71,.42)', spotB: 'rgba(253,186,116,.28)', g1: '#fffcef', g2: '#fff7ea', g3: '#fff4f0', shadow: 'rgba(180,83,9,.16)' },
      banner: { a: '#d97706', b: '#ea580c', shadow: 'rgba(217,119,6,.34)' },
      podium: {
        1: { accent: 'linear-gradient(180deg,#fcd34d 0%,#d97706 100%)', glow: '0 20px 35px rgba(217,119,6,.3)' },
        2: { accent: 'linear-gradient(180deg,#fdba74 0%,#ea580c 100%)', glow: '0 16px 28px rgba(234,88,12,.22)' },
        3: { accent: 'linear-gradient(180deg,#fca5a5 0%,#ef4444 100%)', glow: '0 16px 28px rgba(239,68,68,.2)' }
      }
    },
    {
      name: 'Midnight Circuit', icon: '🌌', copy: 'Dark-sky focus sessions and clean leaderboard climbs.',
      hero: { spotA: 'rgba(59,130,246,.3)', spotB: 'rgba(147,51,234,.22)', g1: '#eff6ff', g2: '#eef2ff', g3: '#f5f3ff', border: '#93c5fd', shadow: 'rgba(30,64,175,.16)' },
      stage: { border: '#93c5fd', spotA: 'rgba(147,197,253,.4)', spotB: 'rgba(192,132,252,.26)', g1: '#f2f7ff', g2: '#f1f3ff', g3: '#f8f5ff', shadow: 'rgba(29,78,216,.16)' },
      banner: { a: '#1d4ed8', b: '#7e22ce', shadow: 'rgba(29,78,216,.34)' },
      podium: {
        1: { accent: 'linear-gradient(180deg,#93c5fd 0%,#1d4ed8 100%)', glow: '0 20px 35px rgba(29,78,216,.3)' },
        2: { accent: 'linear-gradient(180deg,#c4b5fd 0%,#7e22ce 100%)', glow: '0 16px 28px rgba(126,34,206,.22)' },
        3: { accent: 'linear-gradient(180deg,#67e8f9 0%,#0369a1 100%)', glow: '0 16px 28px rgba(3,105,161,.2)' }
      }
    },
    {
      name: 'Aurora Rush', icon: '✨', copy: 'Color-shifting momentum built from daily consistency.',
      hero: { spotA: 'rgba(45,212,191,.28)', spotB: 'rgba(99,102,241,.24)', g1: '#ecfeff', g2: '#eef2ff', g3: '#f5f3ff', border: '#99f6e4', shadow: 'rgba(13,148,136,.16)' },
      stage: { border: '#99f6e4', spotA: 'rgba(153,246,228,.42)', spotB: 'rgba(165,180,252,.26)', g1: '#efffff', g2: '#f1f4ff', g3: '#f7f5ff', shadow: 'rgba(15,118,110,.16)' },
      banner: { a: '#0f766e', b: '#4f46e5', shadow: 'rgba(15,118,110,.34)' },
      podium: {
        1: { accent: 'linear-gradient(180deg,#99f6e4 0%,#0f766e 100%)', glow: '0 20px 35px rgba(15,118,110,.3)' },
        2: { accent: 'linear-gradient(180deg,#a5b4fc 0%,#4f46e5 100%)', glow: '0 16px 28px rgba(79,70,229,.22)' },
        3: { accent: 'linear-gradient(180deg,#d8b4fe 0%,#9333ea 100%)', glow: '0 16px 28px rgba(147,51,234,.2)' }
      }
    }
  ];
  const reset = nextSundayResetDate();
  const utc = Date.UTC(reset.getUTCFullYear(), reset.getUTCMonth(), reset.getUTCDate());
  const weekIndex = Math.floor(utc / 604800000);
  return themes[Math.abs(weekIndex) % themes.length];
}

function showLeaderboardWinnerPopup(profile, creditsReward) {
  const popup = document.getElementById('leaderboard-win-popup');
  if (!popup) return;
  const key = 'ra10_leaderboard_win_seen_' + getLeaderboardWeekKey();
  if (localStorage.getItem(key) === '1') return;
  localStorage.setItem(key, '1');
  const titleEl = popup.querySelector('[data-lb-win-title]');
  const bodyEl = popup.querySelector('[data-lb-win-body]');
  const name = getLeaderboardDisplayName(profile);
  if (titleEl) titleEl.textContent = 'Top spot';
  if (bodyEl) {
    bodyEl.textContent = name + ' is currently in first place. You will get ' + creditsReward + ' credits when the leaderboard resets at the end of Saturday.';
  }
  popup.style.display = 'block';
}

async function loadLbPreview() {
  const listEl = document.getElementById('lb-preview-list');
  if (!listEl || !window.supabase) return;
  try {
    const sb = RA10.getClient();
    let data = [];
    try {
      const previewRes = await sb.rpc('get_leaderboard_preview');
      if (!previewRes.error && Array.isArray(previewRes.data)) data = previewRes.data;
    } catch (e) {}
    if (!data.length) data = await fetchLeaderboardRows(sb, 3);
    const medals = ['🥇','🥈','🥉'];
    if (!data?.length) {
      listEl.innerHTML = '<div style="color:var(--color-text-faint);font-size:var(--tx-sm)">No XP earned yet this week!</div>';
      return;
    }
    listEl.innerHTML = data.map((u, i) => `
      <div style="display:flex;align-items:center;justify-content:space-between;
        padding:4px 0;font-size:var(--tx-sm);">
        <span>${medals[i]} ${getLeaderboardDisplayName(u)}</span>
        <span style="font-weight:700;color:var(--color-primary)">${u.xp_this_week} XP this week</span>
      </div>
    `).join('');
  } catch(e) {
    listEl.innerHTML = '<div style="color:var(--color-text-faint);font-size:var(--tx-sm)">Could not load.</div>';
  }
}

async function fetchLeaderboardRows(sb, limitCount) {
  const safeLimit = Number(limitCount || 50);
  try {
    const rpcRes = await sb.rpc('get_leaderboard', { limit_count: safeLimit });
    if (!rpcRes.error && Array.isArray(rpcRes.data)) return rpcRes.data;
  } catch (e) {}

  try {
    const q = await sb
      .from('profiles')
      .select('id, username, full_name, leaderboard_badge, badge_emoji, emoji_badge, profile_pic_url, xp_this_week, xp_total')
      .gt('xp_this_week', 0)
      .order('xp_this_week', { ascending: false })
      .order('xp_total', { ascending: false })
      .limit(safeLimit);
    if (!q.error && Array.isArray(q.data)) return q.data;
    if (q.error && isMissingProfilePicColumnError(q.error)) {
      const fallback = await sb
        .from('profiles')
        .select('id, username, full_name, leaderboard_badge, badge_emoji, emoji_badge, profile_pic_url, xp_this_week, xp_total')
        .gt('xp_this_week', 0)
        .order('xp_this_week', { ascending: false })
        .order('xp_total', { ascending: false })
        .limit(safeLimit);
      if (!fallback.error && Array.isArray(fallback.data)) return fallback.data;
    }
  } catch (e) {}

  return [];
}

async function renderLeaderboard() {
  const tableEl = document.getElementById('lb-table');
  const loadingEl = document.getElementById('lb-loading');
  const myRankEl = document.getElementById('lb-my-rank');
  const heroBox = document.querySelector('#p-leaderboard .lb-hero-duo');
  const heroHeading = document.getElementById('lb-theme-heading');
  const heroCopy = document.getElementById('lb-theme-copy');
  const heroPill = document.getElementById('lb-theme-pill');
  if (!tableEl || !window.supabase) return;
  try {
    const sb = RA10.getClient();
    const data = await fetchLeaderboardRows(sb, 50);
    if (loadingEl) loadingEl.style.display = 'none';
    // Leaderboard v2 (refresh/ra10-leaderboard.js): arena, boosts, roles, picture editor.
    if (window.RA10Leaderboard) {
      const lbCurrentId = RA10.isLoggedIn() ? RA10.getSession()?.user?.id : null;
      RA10Leaderboard.render({ host: tableEl, rows: Array.isArray(data) ? data : [], sb, currentId: lbCurrentId });
      if (myRankEl) myRankEl.innerHTML = '';
      updateLeaderboardCountdown();
      const lbWinner = Array.isArray(data) ? data[0] : null;
      if (lbCurrentId && lbWinner && lbWinner.id === lbCurrentId) showLeaderboardWinnerPopup(lbWinner, 30);
      return;
    }
    tableEl.style.display = 'block';
    const theme = getLeaderboardTheme();
    if (heroBox && theme.hero) {
      heroBox.style.setProperty('--lb-hero-spot-a', theme.hero.spotA);
      heroBox.style.setProperty('--lb-hero-spot-b', theme.hero.spotB);
      heroBox.style.setProperty('--lb-hero-g1', theme.hero.g1);
      heroBox.style.setProperty('--lb-hero-g2', theme.hero.g2);
      heroBox.style.setProperty('--lb-hero-g3', theme.hero.g3);
      heroBox.style.setProperty('--lb-hero-border', theme.hero.border);
      heroBox.style.setProperty('--lb-hero-shadow', theme.hero.shadow);
    }
    if (heroHeading) heroHeading.textContent = theme.icon + ' ' + theme.name;
    if (heroCopy) heroCopy.textContent = theme.copy + ' Earn XP daily and lock in your top rank before reset.';
    if (heroPill) heroPill.textContent = 'Theme: ' + theme.name;
    const medals = ['🥇','🥈','🥉'];
    const currentId = RA10.isLoggedIn() ? RA10.getSession()?.user?.id : null;
    if (!data?.length) {
      tableEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--color-text-muted)">No XP earned yet this week. Be the first!</div>';
      return;
    }
    const winner = data[0];
    const maxWeeklyXp = Math.max(1, Number((winner && winner.xp_this_week) || 1));
    const top3 = [data[1], data[0], data[2]].filter(Boolean);
    const podium = top3.map((u, i) => {
      const rank = i === 1 ? 1 : (i === 0 ? 2 : 3);
      const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
      const blockHeight = rank === 1 ? 190 : (rank === 2 ? 144 : 124);
      const palette = (theme.podium && theme.podium[rank]) || null;
      const accent = palette ? palette.accent : (rank === 1
        ? 'linear-gradient(180deg,#86efac 0%,#22c55e 100%)'
        : (rank === 2
          ? 'linear-gradient(180deg,#93c5fd 0%,#3b82f6 100%)'
          : 'linear-gradient(180deg,#f0abfc 0%,#d946ef 100%)'));
      const glow = palette ? palette.glow : (rank === 1
        ? '0 20px 35px rgba(34,197,94,.3)'
        : (rank === 2 ? '0 16px 28px rgba(59,130,246,.22)' : '0 16px 28px rgba(217,70,239,.2)'));
      const avatarGradient = rank === 1
        ? 'linear-gradient(140deg,#fde68a,#fbbf24)'
        : (rank === 2 ? 'linear-gradient(140deg,#bfdbfe,#60a5fa)' : 'linear-gradient(140deg,#e9d5ff,#c084fc)');
      const pic = getProfilePictureUrl(u);
      const avatarNode = pic
        ? '<img class="lb-podium-avatar" src="' + escapeHtmlAttr(pic) + '" alt="' + escapeHtmlAttr(getLeaderboardDisplayName(u)) + '" loading="lazy">'
        : '<span class="lb-podium-avatar" style="background:' + avatarGradient + ';">' + getLeaderboardInitials(u) + '</span>';
      return `
        <div class="lb-podium-card rank-${rank}">
          ${avatarNode}
          <div class="lb-podium-meta">
            <div style="font-size:1.35rem;line-height:1;margin-bottom:6px;">${medals[rank]}</div>
            <div class="lb-podium-name">${getLeaderboardDisplayName(u)}</div>
            <div class="lb-podium-xp">${u.xp_this_week} XP</div>
          </div>
          <div class="lb-podium-tower" style="height:${blockHeight}px;background:${accent};box-shadow:${glow};">
            ${rank === 1 ? '<span class="lb-podium-crown">👑</span>' : ''}
            <span class="lb-podium-ribbon">Rank ${rank}</span>
            <div class="lb-podium-rank">${rank}</div>
          </div>
        </div>
      `;
    }).join('');
    tableEl.innerHTML = `
      <div class="lb-stage duo-board" style="--lb-stage-border:${theme.stage.border};--lb-stage-spot-a:${theme.stage.spotA};--lb-stage-spot-b:${theme.stage.spotB};--lb-stage-g1:${theme.stage.g1};--lb-stage-g2:${theme.stage.g2};--lb-stage-g3:${theme.stage.g3};--lb-stage-shadow:${theme.stage.shadow};">
        <div class="lb-theme-banner" style="--lb-banner-a:${theme.banner.a};--lb-banner-b:${theme.banner.b};--lb-banner-shadow:${theme.banner.shadow};">
          <div class="lb-theme-title">${theme.icon} ${theme.name} · Weekly Theme</div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="lb-theme-chip">🥇 30 Credits</span>
            <span class="lb-theme-chip">🥈 20</span>
            <span class="lb-theme-chip">🥉 10</span>
          </div>
        </div>

        <div class="lb-podium-shell">
          <div class="lb-podium-head">
            <div>
              <div style="font-size:var(--tx-xs);font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#16a34a;">Podium</div>
              <div style="font-family:var(--font-d);font-size:var(--tx-lg);font-weight:400;">Top 3 this week</div>
            </div>
            <div style="display:inline-flex;align-items:center;gap:var(--sp2);padding:8px 12px;border-radius:999px;background:#f1fff4;border:1px solid #b9e8c6;font-size:var(--tx-xs);font-weight:800;color:#15803d;">🔥 Keep your streak alive before reset</div>
          </div>
          <div style="padding:4px 6px 0;background:linear-gradient(180deg,rgba(255,255,255,.16),rgba(255,255,255,.03));border-radius:16px;">
            <div class="lb-podium-grid">${podium}</div>
            <div style="height:14px;margin:6px auto 0;max-width:92%;border-radius:999px;background:linear-gradient(90deg,rgba(34,197,94,.45),rgba(59,130,246,.4),rgba(217,70,239,.38));filter:blur(2px);box-shadow:0 0 22px rgba(34,197,94,.3),0 0 28px rgba(59,130,246,.24);"></div>
          </div>
        </div>

        <div class="lb-row-wrap duo-rows">
          <div class="lb-list-head"><span>Player</span><span>XP this week</span></div>
          ${data.map((u, i) => {
            const isMe = u.id === currentId;
            const isWinner = i === 0;
            const badgeEmoji = getLeaderboardBadgeEmoji(u);
            const name = getLeaderboardDisplayName(u);
            const pic = getProfilePictureUrl(u);
            const avatarNode = pic
              ? '<img class="lb-user-avatar" src="' + escapeHtmlAttr(pic) + '" alt="' + escapeHtmlAttr(name) + '" loading="lazy">'
              : '<span class="lb-user-avatar initials">' + getLeaderboardInitials(u) + '</span>';
            const xpNow = Number(u.xp_this_week || 0);
            const progress = Math.max(4, Math.round((xpNow / maxWeeklyXp) * 100));
            return `
              <div class="lb-duo-row ${isMe ? 'is-me' : ''} ${isWinner ? 'is-top' : ''}">
                <div class="lb-duo-left">
                  <span class="lb-rank-badge">${medals[i] || (i+1)}</span>
                  ${avatarNode}
                  <div class="lb-user-meta">
                    <div class="lb-name-line">
                      <span>${name}</span>
                      ${badgeEmoji ? '<span class="lb-badge-chip">' + badgeEmoji + '</span>' : ''}
                      ${isWinner ? '<span class="lb-top-pill">Top</span>' : ''}
                      ${isMe ? '<span class="lb-you-pill">You</span>' : ''}
                    </div>
                    <div class="lb-total-xp">${u.xp_total||0} total XP</div>
                    <div class="lb-row-progress"><span style="width:${progress}%"></span></div>
                  </div>
                </div>
                <div class="lb-weekly-xp">${u.xp_this_week} XP</div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="lb-rules-card">🏆 First place wins <strong>30 credits</strong>, second gets <strong>20</strong> and third gets <strong>10</strong> when the week ends on Saturday.</div>
      </div>
    `;
    updateLeaderboardCountdown();
    if (currentId && winner && winner.id === currentId) {
      showLeaderboardWinnerPopup(winner, 30);
    } else if (currentId && !data.find(u => u.id === currentId)) {
      const { data: me } = await sb.from('profiles')
        .select('username, full_name, leaderboard_badge, badge_emoji, emoji_badge, profile_pic_url, xp_this_week, xp_total')
        .eq('id', currentId).single();
      if (me && myRankEl) {
        const meName = getLeaderboardDisplayName(me);
        const mePic = getProfilePictureUrl(me);
        const meAvatarNode = mePic
          ? '<img class="lb-user-avatar" src="' + escapeHtmlAttr(mePic) + '" alt="' + escapeHtmlAttr(meName) + '" loading="lazy">'
          : '<span class="lb-user-avatar initials">' + getLeaderboardInitials(me) + '</span>';
        myRankEl.innerHTML = `
          <div class="lb-row-wrap" style="margin-top:var(--sp3);">
            <div class="lb-list-head"><span>Your position</span><span>XP this week</span></div>
            <div class="lb-duo-row is-me">
              <div class="lb-duo-left">
                <span class="lb-rank-badge">You</span>
                ${meAvatarNode}
                <div class="lb-user-meta">
                  <div class="lb-name-line">
                    <span>${meName}</span>
                    ${getLeaderboardBadgeEmoji(me) ? '<span class="lb-badge-chip">' + getLeaderboardBadgeEmoji(me) + '</span>' : ''}
                    <span class="lb-you-pill">You</span>
                  </div>
                  <div class="lb-total-xp">${me.xp_total||0} total XP</div>
                </div>
              </div>
              <div class="lb-weekly-xp">${me.xp_this_week||0} XP</div>
            </div>
          </div>
        `;
      }
    }
  } catch(e) {
    if (loadingEl) loadingEl.textContent = 'Could not load leaderboard.';
  }
}

// Weekly XP reset check
async function checkWeeklyXpReset() {
  if (!window.supabase || !RA10.isLoggedIn()) return;
  try {
    const sb = RA10.getClient();
    const session = RA10.getSession();
    const { data } = await sb.from('profiles')
      .select('xp_week_reset_at')
      .eq('id', session.user.id)
      .single();
    if (!data) return;
    const daysSince = (Date.now() - new Date(data.xp_week_reset_at)) / 86400000;
    if (daysSince >= 7) await sb.rpc('reset_weekly_xp');
  } catch(e) { console.warn('XP reset check failed', e); }
}

// Render leaderboard when navigating to it
window.addEventListener('ra10:route', () => {
  const routePath = ra10RoutePath();
  if (routePath === '/leaderboard') {
    setTimeout(renderLeaderboard, 100);
  }
});

// ── Routing with clean URLs ──────────────────────────────────────────────
// Internal route paths stay as before ('/revision/btec/level-3/sport/unit-1');
// the address bar shows the public form ('/btec/level-3/sport/unit-1').
// /revision -> /subjects, /revision/btec/... -> /btec/..., /revision/a-level/... -> /a-level/...
// (public paths never collide with real folders on the static host).
function toPublicPath(p) { p = String(p || '/'); return p === '/revision' ? '/subjects' : p.replace(/^\/revision\/(btec|a-level)(?=\/|$)/, '/$1'); }
function toInternalPath(p) { p = String(p || '/'); return p === '/subjects' ? '/revision' : p.replace(/^\/(btec|a-level)(?=\/|$)/, '/revision/$1'); }
// The current route as '/path?query' (internal form). Still understands old #/ links.
function ra10Route() {
  const h = location.hash || '';
  if (/^#\//.test(h)) return h.slice(1).split('#')[0];
  let p = location.pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/';
  return toInternalPath(p) + (location.search || '');
}
function ra10RoutePath() { return ra10Route().split('?')[0] || '/'; }
window.ra10Route = ra10Route;
window.ra10RoutePath = ra10RoutePath;

function go(path, opts){
  document.querySelectorAll('.iframe-wrap.full-screen').forEach(w=>w.classList.remove('full-screen'));
  document.body.classList.remove('iframe-fullscreen-mode');
  closeMobileSubjectSheet();
  closeMobileYouSheet();
  let target = String(path == null ? '/' : path).replace(/^#/, '');
  if (target.charAt(0) !== '/') target = '/' + target;
  const qi = target.indexOf('?');
  const url = toPublicPath(qi >= 0 ? target.slice(0, qi) : target) + (qi >= 0 ? target.slice(qi) : '');
  const same = url === location.pathname + location.search && !location.hash;
  if (!same) history[(opts && opts.replace) ? 'replaceState' : 'pushState'](null, '', url);
  route();
  if (!same) window.scrollTo(0, 0);
}
window.go = go;

// Keep every in-site link inside the app (no full reloads), and keep old
// '#/...' style links working: they are converted to clean URLs.
document.addEventListener('click', function (e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest && e.target.closest('a[href]');
  if (!a || (a.target && a.target !== '_self' && a.target !== '_top')) return;
  const href = a.getAttribute('href') || '';
  if (/^#\//.test(href)) { e.preventDefault(); if (!a.getAttribute('onclick')) go(href.slice(1)); return; }
  if (/^#[^/]/.test(href)) {
    // In-page anchors (<base href="/"> would otherwise send them to the home page).
    e.preventDefault();
    const t = document.getElementById(decodeURIComponent(href.slice(1)));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (/^\/(?!\/)/.test(href) && !/\.(html?|pdf|png|jpe?g|svg|webp|xml|txt|json|js|css|zip|docx?|pptx?|xlsx?)(\?|#|$)/i.test(href) && !/^\/(legal|admin|tools)(\/|$)/.test(href)) {
    e.preventDefault();
    if (!a.getAttribute('onclick')) go(href);
  }
}, true);

(function(){
  document.querySelectorAll('[data-iframe-fullscreen]').forEach(button=>{
    const wrapper = button.closest('.iframe-wrap');
    if(!wrapper) return;
    button.addEventListener('click',()=>{
      wrapper.classList.add('full-screen');
      document.body.classList.add('iframe-fullscreen-mode');
    });
  });
})();

function exitIframeFullscreen(){
  document.querySelectorAll('.iframe-wrap.full-screen').forEach(w=>w.classList.remove('full-screen'));
  document.body.classList.remove('iframe-fullscreen-mode');
}

const DAILY_TASK_XP_SYNC_KEY = 'ra10-daily-task-xp-sync-v1';
const CREDIT_GIFT_OWNER_EMAIL = 'mistry.hashim@icloud.com';
const CREDIT_GIFT_POPUP_SEEN_KEY = 'ra10_credit_gift_popup_seen_ids_v1';
const CREDIT_GIFT_SENT_REFRESH_MS = 20000;
const DAILY_TASK_XP_VALUES = { dailyQuiz: 25, practice5: 50, practice10: 30, practice15: 45, flashReview: 15, share: 30, leaderboard: 10, hub: 10, login: 5 };
let _giftSentFetchInFlight = false;
let _giftSentLastLoadedAt = 0;
let _ownerProfilePicsFetchInFlight = false;
let _ownerProfilePicsLastLoadedAt = 0;

function isOwnerAccount(profile) {
  const p = profile || (window.RA10 && RA10.getProfile ? RA10.getProfile() : null) || {};
  const session = (window.RA10 && RA10.getSession) ? (RA10.getSession() || {}) : {};
  const sessionUser = session.user || {};
  const email = String((p && p.email) || sessionUser.email || '').toLowerCase();
  const tier = String((window.RA10 && RA10.getTier ? RA10.getTier() : '') || (p && p.tier) || '').toLowerCase();
  if (tier === 'owner' || tier === 'ultra') return true;
  try {
    if (window.RA10 && typeof RA10.isOwner === 'function' && RA10.isOwner()) return true;
  } catch (e) {}
  return email === CREDIT_GIFT_OWNER_EMAIL;
}

function readDailyTaskXpSyncState(today) {
  try {
    const parsed = JSON.parse(localStorage.getItem(DAILY_TASK_XP_SYNC_KEY) || '{}');
    if (parsed && parsed.date === today && parsed.awarded) {
      return { date: today, awarded: Object.assign({}, parsed.awarded) };
    }
  } catch (e) {}
  return { date: today, awarded: {} };
}

function writeDailyTaskXpSyncState(state) {
  localStorage.setItem(DAILY_TASK_XP_SYNC_KEY, JSON.stringify(state));
}

async function awardTaskXpToProfile(amount) {
  if (!window.RA10 || !RA10.isLoggedIn()) return false;
  const session = RA10.getSession ? RA10.getSession() : null;
  if (!session || !session.access_token) return false;

  try {
    const res = await fetch('https://tcrrgsylxbyyrmnouihl.supabase.co/rest/v1/rpc/increment_xp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyMTEsImV4cCI6MjA5MzQ2MTIxMX0.eOp6ma-mfgh8F20nM7E2OaBW28LlZlwuEEWr6k2zDWw',
        'Authorization': 'Bearer ' + session.access_token
      },
      body: JSON.stringify({ amount: Number(amount || 0) })
    });
    return !!res.ok;
  } catch (e) {
    console.warn('Daily task XP sync failed', e);
    return false;
  }
}

async function syncDailyTaskXpToLeaderboard(state) {
  if (!state || !state.date || !state.tasks) return;
  const today = state.date;
  const syncState = readDailyTaskXpSyncState(today);
  let changed = false;
  const awardedKeys = [];
  let totalXp = 0;

  for (const [taskKey, xp] of Object.entries(DAILY_TASK_XP_VALUES)) {
    if (!state.tasks[taskKey] || syncState.awarded[taskKey]) continue;
    const ok = await awardTaskXpToProfile(xp);
    if (ok) {
      syncState.awarded[taskKey] = true;
      changed = true;
      awardedKeys.push(taskKey);
      totalXp += Number(xp || 0);
    }
  }

  if (!changed) return { awardedKeys: [], totalXp: 0 };
  writeDailyTaskXpSyncState(syncState);
  if (window.RA10 && typeof RA10.refreshProfile === 'function') {
    try { await RA10.refreshProfile(); } catch (e) {}
  }
  const routePath = ra10RoutePath();
  if (routePath === '/leaderboard') {
    setTimeout(renderLeaderboard, 60);
  }
  return { awardedKeys, totalXp };
}

const GLOBAL_DAILY_TASKS_KEY = 'ra10-daily-tasks-v2';

function readGlobalDailyTasksState() {
  const today = new Date().toISOString().slice(0, 10);
  const defaultTasks = {
    dailyQuiz: false,
    practice5: false,
    practice10: false,
    practice15: false,
    flashReview: false,
    share: false,
    leaderboard: false,
    hub: false,
    login: false,
  };
  let state = null;
  try {
    const raw = localStorage.getItem(GLOBAL_DAILY_TASKS_KEY);
    state = raw ? JSON.parse(raw) : null;
  } catch (e) {
    state = null;
  }
  if (!state || state.date !== today || !state.tasks) {
    state = {
      date: today,
      tasks: Object.assign({}, defaultTasks),
      practiceCount: 0
    };
  } else {
    state = {
      date: today,
      tasks: Object.assign({}, defaultTasks, state.tasks || {}),
      practiceCount: Number(state.practiceCount || 0)
    };
  }
  return state;
}

function writeGlobalDailyTasksState(state) {
  localStorage.setItem(GLOBAL_DAILY_TASKS_KEY, JSON.stringify(state));
}

async function completeGlobalDailyTask(taskKey) {
  if (!window.RA10 || !RA10.isLoggedIn()) return false;
  const state = readGlobalDailyTasksState();
  if (state.tasks[taskKey]) return false;
  state.tasks[taskKey] = true;
  writeGlobalDailyTasksState(state);
  const syncResult = await syncDailyTaskXpToLeaderboard(state);
  const xp = Number(DAILY_TASK_XP_VALUES[taskKey] || 0);
  if (syncResult && Array.isArray(syncResult.awardedKeys) && syncResult.awardedKeys.includes(taskKey) && xp > 0) {
    showMiniToast('+' + xp + ' XP earned');
  }
  if (document.getElementById('p-tasks')?.classList.contains('active')) {
    renderGlobalTasksPage();
  }
  return true;
}

async function shareGlobalDailyLink() {
  const text = 'Check out RA10 for BTEC revision: https://ra10.co.uk';
  try {
    if (navigator.share) {
      await navigator.share({ title: 'RA10', text, url: 'https://ra10.co.uk' });
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      throw new Error('Clipboard unavailable');
    }
  } catch (e) {
    try {
      const t = document.createElement('textarea');
      t.value = text;
      document.body.appendChild(t);
      t.select();
      const copied = document.execCommand('copy');
      t.remove();
      if (!copied) throw new Error('Copy fallback failed');
    } catch (fallbackError) {
      window.prompt('Copy this share link', text);
    }
  }
  if (await completeGlobalDailyTask('share')) {
    showMiniToast('Share link copied');
  }
}

async function renderGlobalTasksPage() {
  const host = document.getElementById('global-tasks-host');
  if (!host) return;
  if (!window.RA10 || !RA10.isLoggedIn()) {
    host.innerHTML = '<div class="card"><p class="muted">Sign in to view your daily tasks.</p></div>';
    return;
  }

  function readPracticeCountForToday() {
    let count = 0;
    const today = new Date().toISOString().slice(0, 10);
    const legacyCount = Number(localStorage.getItem('ra10_practice_today_' + today) || '0');
    if (Number.isFinite(legacyCount) && legacyCount > 0) count = legacyCount;
    try {
      const stored = JSON.parse(localStorage.getItem('ra10_practice_today') || 'null');
      if (stored && stored.date === today) {
        const c = Number(stored.count || 0);
        if (Number.isFinite(c) && c > count) count = c;
      }
    } catch (e) {}
    return count;
  }
  const state = readGlobalDailyTasksState();
  const beforeTasks = Object.assign({}, state.tasks);

  state.practiceCount = Math.max(state.practiceCount, readPracticeCountForToday());
  state.tasks.practice5 = state.tasks.practice5 || state.practiceCount >= 5;
  state.tasks.practice10 = state.tasks.practice10 || state.practiceCount >= 10;
  state.tasks.practice15 = state.tasks.practice15 || state.practiceCount >= 15;
  const loginJustCompleted = !state.tasks.login;
  state.tasks.login = true;
  writeGlobalDailyTasksState(state);

  // Sync any newly auto-completed tasks (practice thresholds + login) and show XP feedback.
  const autoCompletedChanged = Object.keys(state.tasks).some((key) => !!state.tasks[key] && !beforeTasks[key]);
  if (loginJustCompleted || autoCompletedChanged) {
    const syncResult = await syncDailyTaskXpToLeaderboard(state);
    if (syncResult && Number(syncResult.totalXp || 0) > 0) {
      showMiniToast('+' + Number(syncResult.totalXp) + ' XP earned');
    }
  }

  const practiceCount = Number(state.practiceCount || 0);

  const items = [
    { key: 'dailyQuiz', name: 'Daily Quiz', xp: 25, note: 'Complete one 10-question quiz on any unit.', actionLabel: 'Start quiz', action: "go('/revision/btec/level-3/IT-AAQ/unit-1')" },
    { key: 'practice5', name: 'Answer 5 practice questions', xp: 50, note: String(Math.min(practiceCount, 5)) + ' / 5 completed' },
    { key: 'practice10', name: 'Answer 10 practice questions', xp: 30, note: String(Math.min(practiceCount, 10)) + ' / 10 completed' },
    { key: 'practice15', name: 'Answer 15 practice questions', xp: 45, note: String(Math.min(practiceCount, 15)) + ' / 15 completed' },
    { key: 'flashReview', name: 'Review flashcards', xp: 15, note: 'Open flashcards in any unit.', actionLabel: 'Open flashcards', action: "go('/revision/btec/level-3/IT-AAQ/unit-1')" },
    { key: 'share', name: 'Share RA10', xp: 30, note: 'Use the share action once.', actionLabel: 'Copy share link', action: 'shareGlobalDailyLink()' },
    { key: 'leaderboard', name: 'Visit the leaderboard', xp: 10, note: 'Open the weekly leaderboard once.', actionLabel: 'Open leaderboard', action: "completeGlobalDailyTask('leaderboard').then(() => go('leaderboard'))" },
    { key: 'hub', name: 'Open the revision hub', xp: 10, note: 'Jump into the BTEC level 3 hub once.', actionLabel: 'Open hub', action: "completeGlobalDailyTask('hub').then(() => go('/revision/btec/level-3'))" },
    { key: 'login', name: 'Log in today', xp: 5, note: 'Automatic bonus once per day.' }
  ];

  const doneCount = items.filter(function(item) { return !!state.tasks[item.key]; }).length;
  const pct = Math.round((doneCount / items.length) * 100);

  host.innerHTML = ''
    + '<div class="tasks-hero-panel">'
    +   '<div class="tasks-hero-title">Today\'s mission: ' + doneCount + '/' + items.length + ' complete</div>'
    +   '<div class="tasks-hero-copy">Stack XP by finishing shared tasks once per day, then jump into any subject.</div>'
    +   '<div class="tasks-meter"><span style="width:' + pct + '%"></span></div>'
    +   '<div class="tasks-kpi-row">'
    +     '<span class="tasks-kpi">Progress: ' + pct + '%</span>'
    +     '<span class="tasks-kpi">Practice today: ' + practiceCount + '</span>'
    +     '<span class="tasks-kpi">Daily reset: midnight</span>'
    +   '</div>'
    + '</div>'
    + '<div class="grid grid-2">' + items.map(function(item) {
    const done = !!state.tasks[item.key];
    const actionButton = item.action ? (
      '<button class="btn ' + (item.key === 'share' ? 'btn-p' : 'btn-s') + '" type="button"' + (done ? ' disabled' : '') + ' onclick="' + item.action + '">' + (done ? 'Completed today' : item.actionLabel) + '</button>'
    ) : '';
    return '<div class="card tasks-card" style="border-color:' + (done ? 'var(--color-success)' : 'var(--color-border)') + ';">'
      + '<div class="card-tag">Task</div>'
      + '<h3>' + item.name + '</h3>'
      + '<p>' + item.note + '</p>'
      + '<div class="card-ft" style="gap:var(--sp2);flex-wrap:wrap;align-items:center;">'
      + '<span class="pill ' + (done ? 'pill-ok' : 'pill-live') + '">' + (done ? 'Completed' : 'Available') + '</span><span class="pill">⚡ ' + item.xp + ' XP</span>'
      + actionButton
      + '</div>'
      + '</div>';
  }).join('') + '</div>'
    + '<div style="display:flex;gap:var(--sp3);flex-wrap:wrap;margin-top:var(--sp5);">'
    + '<button class="btn btn-p btn-accent-it" onclick="go(\'/revision/btec/level-3/IT-AAQ/unit-1\')">Start in IT</button>'
    + '<button class="btn btn-p btn-accent-business" onclick="go(\'/revision/btec/level-3/business/unit-3\')">Start in Business</button>'
    + '<button class="btn btn-p btn-accent-sport" onclick="go(\'/revision/btec/level-3/sport/unit-1\')">Start in Sport</button>'
    + '</div>';
  renderTaskBoostRewards(host, doneCount === items.length, practiceCount);
}

// XP boost rewards for daily tasks (refresh/ra10-xp.js + leaderboard-v2 SQL).
function renderTaskBoostRewards(host, allDone, practiceCount) {
  const XP = window.RA10XP;
  if (!host || !XP || !XP.available()) return;
  const box = document.createElement('div');
  box.className = 'card tasks-boosts';
  box.style.cssText = 'margin-top:var(--sp5);background:linear-gradient(135deg,#fff7ed,#fdf2f8);border-color:#fdba74;';
  const today = new Date().toISOString().slice(0, 10);
  const has = (src) => XP.boosts().some((b) => b.source === src && String(b.granted_at || '').slice(0, 10) === today);
  const rows = [
    { src: 'daily_tasks', ok: allDone, title: '2x XP for 30 minutes', how: 'Complete every task on this page today.' },
    { src: 'daily_practice', ok: practiceCount >= 10, title: '2x XP for 15 minutes', how: 'Answer 10 practice questions today (' + Math.min(practiceCount, 10) + '/10).' },
  ];
  box.innerHTML = '<div class="card-tag">⚡ Task rewards</div><h3>Earn XP boosts</h3>'
    + '<p>Finish tasks to unlock boosts, then switch them on from the leaderboard when you’re ready to revise.</p>'
    + '<div style="display:grid;gap:var(--sp2);">' + rows.map((r) => {
      const claimed = has(r.src);
      return '<div style="display:flex;align-items:center;gap:var(--sp3);flex-wrap:wrap;justify-content:space-between;">'
        + '<span><strong>' + r.title + '</strong><br><small class="muted">' + r.how + '</small></span>'
        + '<button class="btn ' + (r.ok && !claimed ? 'btn-p' : 'btn-s') + '" type="button" data-boost-claim="' + r.src + '"' + (!r.ok || claimed ? ' disabled' : '') + '>'
        + (claimed ? 'Claimed today' : r.ok ? 'Claim boost' : 'Locked') + '</button></div>';
    }).join('') + '</div><p class="muted" data-boost-msg style="margin-top:var(--sp2);min-height:1.2em;"></p>';
  host.appendChild(box);
  box.querySelectorAll('[data-boost-claim]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const msg = box.querySelector('[data-boost-msg]');
      btn.disabled = true;
      try {
        await XP.claim(btn.getAttribute('data-boost-claim'));
        btn.textContent = 'Claimed today';
        msg.innerHTML = 'Boost added! <a href="/leaderboard" onclick="go(\'leaderboard\');return false;">Activate it on the leaderboard</a>.';
      } catch (e) {
        btn.disabled = false;
        msg.textContent = (e && e.message) || 'Not unlocked yet.';
      }
    });
  });
}

const COMMUNITY_SB_URL = 'https://tcrrgsylxbyyrmnouihl.supabase.co';
const COMMUNITY_SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyMTEsImV4cCI6MjA5MzQ2MTIxMX0.eOp6ma-mfgh8F20nM7E2OaBW28LlZlwuEEWr6k2zDWw';
let _communityApps = [];
let _communityJobsPoller = null;
let _communityCreatorsById = {};
let _communityOpenState = null;
// Shared with refresh/community/apps.js (the study-app library + viewer).
window.__caState = {
  get apps() { return _communityApps; }, set apps(v) { _communityApps = v; },
  get open() { return _communityOpenState; }, set open(v) { _communityOpenState = v; },
  get creators() { return _communityCreatorsById; }, set creators(v) { _communityCreatorsById = v; },
};
let _communityQueuedKickoff = {};
let _communityPdfLoader = null;
let _communityDocxLoader = null;

function communityLoadExternalScript(src) {
  return new Promise((resolve, reject) => {
    const tag = document.createElement('script');
    tag.src = src;
    tag.async = true;
    tag.onload = () => resolve(true);
    tag.onerror = () => reject(new Error('Failed to load script: ' + src));
    document.head.appendChild(tag);
  });
}

async function communityEnsurePdfJs() {
  if (window.pdfjsLib) return window.pdfjsLib;
  if (!_communityPdfLoader) {
    _communityPdfLoader = communityLoadExternalScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js')
      .then(() => {
        if (!window.pdfjsLib) throw new Error('PDF parser unavailable.');
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        return window.pdfjsLib;
      })
      .catch((e) => {
        _communityPdfLoader = null;
        throw e;
      });
  }
  return _communityPdfLoader;
}

async function communityEnsureMammoth() {
  if (window.mammoth) return window.mammoth;
  if (!_communityDocxLoader) {
    _communityDocxLoader = communityLoadExternalScript('https://unpkg.com/mammoth@1.8.0/mammoth.browser.min.js')
      .then(() => {
        if (!window.mammoth) throw new Error('DOCX parser unavailable.');
        return window.mammoth;
      })
      .catch((e) => {
        _communityDocxLoader = null;
        throw e;
      });
  }
  return _communityDocxLoader;
}

function communityGetToken() {
  const s = RA10.getSession ? RA10.getSession() : null;
  return s && s.access_token ? s.access_token : '';
}

async function communityCallFunction(functionName, payload) {
  const token = communityGetToken();
  if (!token) throw new Error('Sign in required.');
  const res = await fetch(COMMUNITY_SB_URL + '/functions/v1/' + encodeURIComponent(functionName), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      'apikey': COMMUNITY_SB_ANON,
      'x-client-info': 'ra10-community-web',
    },
    body: JSON.stringify(payload || {}),
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) {}
  if (!res.ok) throw new Error((data && (data.error || data.message)) || text || 'Request failed.');
  return data;
}

async function communityLoadPublicProfiles(userIds) {
  const ids = Array.isArray(userIds) ? userIds.map((x) => String(x || '').trim()).filter(Boolean) : [];
  if (!ids.length) return {};
  try {
    const client = window.RA10 && RA10.getClient ? RA10.getClient() : null;
    if (!client) return {};
    const { data, error } = await client.rpc('community_public_profiles', { p_ids: ids });
    if (error) throw error;
    const map = {};
    (data || []).forEach((row) => {
      const id = String(row && row.id || '').trim();
      if (!id) return;
      map[id] = {
        id,
        username: String(row.username || ''),
        full_name: String(row.full_name || ''),
        profile_pic_url: String(row.profile_pic_url || ''),
        badge: String(row.badge || ''),
      };
    });
    return map;
  } catch (e) {
    return {};
  }
}

async function communityRest(path, method, payload, useAuth) {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': COMMUNITY_SB_ANON,
  };
  if (useAuth) {
    const token = communityGetToken();
    if (!token) throw new Error('Sign in required.');
    headers['Authorization'] = 'Bearer ' + token;
  }
  const res = await fetch(COMMUNITY_SB_URL + '/rest/v1/' + path, {
    method: method || 'GET',
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) {}
  if (!res.ok) {
    throw new Error((data && (data.message || data.error_description || data.error)) || text || 'REST request failed.');
  }
  return data;
}

function communityEscape(v) {
  return String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function communityInitials(name) {
  const raw = String(name || 'RA').trim();
  if (!raw) return 'RA';
  const parts = raw.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function communityUserLabel(profile, userId) {
  const p = profile || {};
  if (p.username) return '@' + String(p.username);
  if (p.full_name) return String(p.full_name);
  if (RA10 && RA10.isLoggedIn && RA10.isLoggedIn()) {
    const me = RA10.getSession().user;
    if (String(me && me.id || '') === String(userId || '')) return 'You';
  }
  return 'Community member';
}

function communityResolveCreator(userId) {
  const me = RA10 && RA10.isLoggedIn && RA10.isLoggedIn() ? RA10.getSession().user : null;
  const cached = _communityCreatorsById[String(userId || '')] || {};
  const mine = me && String(me.id || '') === String(userId || '')
    ? {
        id: me.id,
        username: String(me.user_metadata?.username || me.user_metadata?.user_name || ''),
        full_name: String(me.user_metadata?.full_name || me.user_metadata?.name || ''),
        profile_pic_url: String(me.user_metadata?.avatar_url || ''),
      }
    : {};
  return {
    id: String(userId || ''),
    username: cached.username || mine.username || '',
    full_name: cached.full_name || mine.full_name || '',
    profile_pic_url: cached.profile_pic_url || mine.profile_pic_url || '',
  };
}

function communityParseArray(raw) {
  try {
    const parsed = JSON.parse(String(raw || '[]'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function communityGetQuestionText(item, idx) {
  const obj = item && typeof item === 'object' ? item : {};
  const text = String(obj.question || obj.q || obj.stem || obj.prompt || '').trim();
  return text || ('Question ' + (idx + 1));
}

function communityGetQuestionAnswer(item) {
  const obj = item && typeof item === 'object' ? item : {};
  const direct = String(obj.answer || obj.model_answer || obj.mark_scheme_text || '').trim();
  if (direct) return direct;
  const points = obj.mark_scheme && Array.isArray(obj.mark_scheme.points)
    ? obj.mark_scheme.points.map((x) => String(x || '').trim()).filter(Boolean)
    : [];
  return points.length ? points.join('; ') : '';
}

function communityGetQuestionMarkScheme(item) {
  const obj = item && typeof item === 'object' ? item : {};
  const raw = obj.mark_scheme && typeof obj.mark_scheme === 'object' && !Array.isArray(obj.mark_scheme) ? obj.mark_scheme : {};
  const points = Array.isArray(raw.points) ? raw.points.map((x) => String(x || '').trim()).filter(Boolean) : [];
  const indicative = Array.isArray(raw.indicative_content) ? raw.indicative_content.map((x) => String(x || '').trim()).filter(Boolean) : [];
  const levels = Array.isArray(raw.level_descriptors) ? raw.level_descriptors : [];
  return {
    ...raw,
    points: points.length ? points : (communityGetQuestionAnswer(obj) ? [communityGetQuestionAnswer(obj)] : []),
    indicative_content: indicative,
    level_descriptors: levels,
    answer: String(raw.answer || obj.answer || '').trim(),
    explanation: String(raw.explanation || '').trim(),
    formulae: Array.isArray(raw.formulae) ? raw.formulae : [],
  };
}

function communityGetQuestionMarks(item) {
  const obj = item && typeof item === 'object' ? item : {};
  const n = Number(obj.marks ?? obj.marks_available ?? obj.points ?? 4);
  if (!Number.isFinite(n)) return 4;
  return Math.max(1, Math.min(40, Math.round(n)));
}

function communityNormalizeQuestionBank(list) {
  const source = Array.isArray(list) ? list : [];
  const normalized = source.map((item, idx) => {
    return {
      question: communityGetQuestionText(item, idx),
      answer: communityGetQuestionAnswer(item),
      marks: communityGetQuestionMarks(item),
      topic: String((item && item.topic) || '').trim(),
      command_verb: String((item && item.command_verb) || '').trim(),
      scenario: String((item && (item.scenario || item.context || item.case_study)) || '').trim(),
      subject: String((item && item.subject) || '').trim(),
      type: String((item && (item.type || item.question_type)) || '').trim(),
      mark_scheme: communityGetQuestionMarkScheme(item),
    };
  }).filter((item) => item.question.length >= 8);
  return normalized;
}

function communityClampInt(raw, fallback, min, max) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.round(n)));
}

function communityParseGuideSections(raw) {
  const text = String(raw || '').trim();
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const sections = [];
  let title = '';
  let buf = [];
  for (const lineRaw of lines) {
    const line = String(lineRaw || '').trim();
    const mdHeading = line.match(/^#{1,3}\s+(.+)$/);
    const chapterHeading = !mdHeading ? line.match(/^(chapter|topic|unit|section)\s*\d*[:.-]?\s*(.+)?$/i) : null;
    if (mdHeading || chapterHeading) {
      if (title || buf.length) {
        sections.push({ title: title || ('Chapter ' + (sections.length + 1)), body: buf.join('\n').trim() });
      }
      title = (mdHeading ? mdHeading[1] : (chapterHeading[2] || line)).trim();
      buf = [];
    } else {
      buf.push(lineRaw);
    }
  }
  if (title || buf.length) {
    sections.push({ title: title || ('Chapter ' + (sections.length + 1)), body: buf.join('\n').trim() });
  }
  if (sections.length > 1) return sections;

  const chunks = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return chunks.map((chunk, idx) => ({
    title: 'Chapter ' + (idx + 1),
    body: chunk,
  }));
}

function communityBuildQuestionObject(item, idx) {
  const marks = communityGetQuestionMarks(item);
  const answerText = communityGetQuestionAnswer(item);
  const markScheme = communityGetQuestionMarkScheme(item);
  return {
    question: communityGetQuestionText(item, idx),
    marks,
    mark_scheme: {
      ...markScheme,
      points: Array.isArray(markScheme.points) && markScheme.points.length ? markScheme.points : (answerText ? [answerText] : []),
    },
    topic: String(item.topic || ''),
    command_verb: String(item.command_verb || ''),
    scenario: String(item.scenario || ''),
    subject: String(item.subject || _communityOpenState?.app?.subject || ''),
    type: String(item.type || ''),
  };
}

function communityResolveQuizAnswerIndex(item) {
  const options = Array.isArray(item && item.options) ? item.options.map((x) => String(x || '')) : [];
  const max = options.length;
  const candidates = [
    item && item.answer,
    item && item.correct,
    item && item.correct_answer,
    item && item.answer_index,
    item && item.correct_index,
  ];
  for (const value of candidates) {
    if (Number.isInteger(value)) {
      const n = Number(value);
      if (n >= 0 && n < max) return n;
      if (n >= 1 && n <= max) return n - 1;
    }
    const asNum = Number(value);
    if (Number.isInteger(asNum)) {
      if (asNum >= 0 && asNum < max) return asNum;
      if (asNum >= 1 && asNum <= max) return asNum - 1;
    }
    const txt = String(value || '').trim();
    if (!txt) continue;
    const letter = txt.toUpperCase();
    if (/^[A-D]$/.test(letter)) {
      const idx = letter.charCodeAt(0) - 65;
      if (idx >= 0 && idx < max) return idx;
    }
    const optionMatch = options.findIndex((opt) => opt.trim().toLowerCase() === txt.toLowerCase());
    if (optionMatch >= 0) return optionMatch;
  }
  return -1;
}

function communityApplyRefineTag(tag) {
  const input = document.getElementById('community-chat-input');
  if (!input) return;
  input.value = String(tag || '').trim();
  input.focus();
}

async function communityReadSourceText() {
  const pasted = String(document.getElementById('community-source')?.value || '').trim();
  const fileInput = document.getElementById('community-file');
  const file = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
  let fileText = '';
  if (file) {
    const fileName = String(file.name || '').toLowerCase();
    if (/\.(txt|md|csv|json|html|xml|rtf)$/i.test(fileName)) {
      fileText = await file.text();
    } else if (/\.pdf$/i.test(fileName)) {
      const pdfjs = await communityEnsurePdfJs();
      const data = new Uint8Array(await file.arrayBuffer());
      const doc = await pdfjs.getDocument({ data }).promise;
      const pages = [];
      for (let i = 1; i <= doc.numPages; i += 1) {
        const page = await doc.getPage(i);
        const txt = await page.getTextContent();
        const line = (txt.items || []).map((it) => String(it && it.str || '')).join(' ').trim();
        if (line) pages.push(line);
      }
      fileText = pages.join('\n\n');
    } else if (/\.docx$/i.test(fileName)) {
      const mammoth = await communityEnsureMammoth();
      const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
      fileText = String(result && result.value || '').trim();
    } else if (/\.doc$/i.test(fileName)) {
      throw new Error('Legacy .doc is not supported in-browser. Save it as .docx or .pdf first.');
    } else {
      throw new Error('Unsupported file type. Use txt/md/csv/json/html/xml/rtf/pdf/docx.');
    }
    if (!String(fileText || '').trim()) {
      throw new Error('Could not extract readable text from this file. Try another export or paste text.');
    }
  }
  return {
    text: [pasted, fileText].filter(Boolean).join('\n\n').trim(),
    fileName: file ? String(file.name || '') : '',
  };
}

async function createCommunityAppJob() {
  const msgEl = document.getElementById('community-create-msg');
  const errEl = document.getElementById('community-create-err');
  const btn   = document.getElementById('community-create-btn');

  const showMsg = (txt) => { if (msgEl) { msgEl.textContent = txt; msgEl.style.display = txt ? '' : 'none'; } };
  const showErr = (txt) => { if (errEl) { errEl.textContent = txt; errEl.style.display = txt ? '' : 'none'; } };

  showMsg(''); showErr('');
  if (btn) btn.disabled = true;

  try {
    if (!RA10 || !RA10.isLoggedIn || !RA10.isLoggedIn()) {
      throw new Error('Sign in to create community apps.');
    }

    const required = cwizValidateStep(0) || cwizValidateStep(2);
    if (required) {
      cwizShowError(required);
      cwizGo(required.includes('content') ? 2 : 0);
      return;
    }

    const source = await communityReadSourceText();
    // Source text is now optional — AI uses general knowledge + online research if nothing provided
    const hasSource = source.text && source.text.length >= 60;

    const subject     = cwizGetVal('community-subject');
    const description = cwizGetVal('community-desc');
    const level       = cwizGetVal('community-level') || 'Mixed';
    const examBoard   = cwizGetVal('community-exam-board') || 'Mixed';
    // The generation service requires a non-empty title. When users leave it
    // blank, create a clear starter title that the AI can refine (unless title
    // locking is enabled) instead of submitting an invalid empty value.
    const typedTitle = cwizGetVal('community-title');
    const title = typedTitle.length >= 4
      ? typedTitle
      : [examBoard !== 'Mixed' ? examBoard : '', level !== 'Mixed' ? level : '', subject || 'Revision', 'Study App'].filter(Boolean).join(' ');
    const difficulty  = cwizGetVal('cw-difficulty') || 'Mixed';
    const qStyle      = cwizGetVal('cw-qstyle') || 'Exam-style';
    const specNotes   = cwizGetVal('community-spec-notes');
    const focus       = cwizGetVal('community-focus').split(',').map(x => x.trim()).filter(Boolean).slice(0, 16);
    const lockTitle   = cwizChecked('community-lock-title');

    // Build rich AI guidance string combining user guidance + toggles
    const userGuidance   = cwizGetVal('community-guidance');
    const usePastPapers  = cwizChecked('cw-toggle-pastpapers');
    const useResearch    = cwizChecked('cw-toggle-research');
    const useExamples    = cwizChecked('cw-toggle-examples');
    const useTechnique   = cwizChecked('cw-toggle-technique');
    const isPublic       = cwizChecked('cw-toggle-public');

    const guidanceParts = [];
    if (userGuidance) guidanceParts.push(userGuidance);
    if (usePastPapers) guidanceParts.push('Reference real past paper question styles, command verbs and mark allocation patterns for ' + (examBoard || 'the relevant exam board') + ' at ' + (level || 'this level') + '.');
    if (useResearch)   guidanceParts.push('Enrich the app with online research: look up current definitions, recent examples, key statistics, and latest developments relevant to this topic.');
    if (useExamples)   guidanceParts.push('Include real-world case studies and named examples (e.g. specific businesses, scientists, historical events) to make questions more authentic and contextual.');
    if (useTechnique)  guidanceParts.push('Include exam technique guidance in the revision guide: command verb explanations, mark allocation tips, timing advice, and common mistakes to avoid.');
    if (specNotes)     guidanceParts.push('SPECIFICATION NOTES — match the following bullet points exactly:\n' + specNotes);
    if (difficulty !== 'Mixed') guidanceParts.push('Target difficulty: ' + difficulty + '. Calibrate question complexity accordingly.');
    if (qStyle !== 'Exam-style') guidanceParts.push('Preferred question style: ' + qStyle + '.');

    const guidance = guidanceParts.join('\n\n');

    const features = Array.from(document.querySelectorAll('.community-feature:checked')).map(el => String(el.value || '').trim()).filter(Boolean);
    if (!features.length) throw new Error('Select at least one content type to generate.');

    const generationTargets = {
      question_count:    communityClampInt(document.getElementById('community-target-questions')?.value, 24, 8, 80),
      flashcard_count:   communityClampInt(document.getElementById('community-target-flashcards')?.value, 30, 8, 120),
      quiz_count:        communityClampInt(document.getElementById('community-target-quiz')?.value, 20, 6, 60),
      guide_chapter_count: communityClampInt(document.getElementById('community-target-chapters')?.value, 8, 3, 20),
    };

    const tier = String((RA10.getTier && RA10.getTier()) || 'free').toLowerCase();
    const included = ['all_subjects','ultra','school_student','school_teacher','school_admin','owner'].includes(tier);
    if (!included && tier !== 'free') throw new Error('This tool is included for Pro, Ultra and Education plans. Free can still generate with 30 credits.');
    if (tier === 'free' && Number(RA10.getCredits ? RA10.getCredits() : 0) < 30) throw new Error('Free accounts need 30 credits to generate a community app.');

    // Start progress animation
    cwizSimulateProgress();

    const data = await communityCallFunction('community-create-job', {
      title,
      subject,
      description,
      level,
      examBoard,
      guidance,
      focus,
      lockTitle,
      features,
      generationTargets,
      sourceText: source.text || '',
      sourceFileName: source.fileName || '',
      // Extra enrichment flags (server can use if supported)
      enrichment: { pastPapers: usePastPapers, onlineResearch: useResearch, examples: useExamples, technique: useTechnique },
      visibility: isPublic ? 'public' : 'private',
    });

    const fill = document.getElementById('cw-gen-bar-fill');
    if (fill) fill.style.width = '100%';

    const costText = Number(data?.generationCost || 0) > 0 ? ' · Charged ' + Number(data?.generationCost || 0) + ' credits.' : ' · Included in your plan.';
    showMsg('✓ App queued! Subject: ' + String(data?.subject || subject || 'General') + ' · ' + generationTargets.question_count + ' Qs, ' + generationTargets.flashcard_count + ' cards, ' + generationTargets.quiz_count + ' quiz items' + costText + ' Check the queue below for progress.');

    if (data && data.jobId) {
      const newJobId = String(data.jobId || '');
      if (newJobId) {
        _communityQueuedKickoff[newJobId] = true;
        cwizTrackJob(newJobId);
        communityCallFunction('community-process-job', { jobId: newJobId })
          .catch((error) => {
            delete _communityQueuedKickoff[newJobId];
            cwizShowProcessorFailure(error);
          })
          .finally(() => { setTimeout(() => { loadCommunityJobs(); }, 1400); });
      }
    }
    await Promise.all([loadCommunityJobs(), loadCommunityApps()]);
  } catch (e) {
    const prog = document.getElementById('cw-gen-progress');
    const message = String((e && e.message) || e || 'Could not create job.');
    const setupHint = /404|not found|function/i.test(message)
      ? ' The Community generator service has not been deployed yet. Deploy the community-create-job and community-process-job Supabase functions, then try again.'
      : '';
    const fullMessage = message + setupHint;
    if (prog) {
      prog.classList.add('visible', 'failed');
      const title = prog.querySelector('strong');
      if (title) title.textContent = 'Generation could not start';
      const fill = document.getElementById('cw-gen-bar-fill');
      if (fill) fill.style.width = '100%';
      const steps = document.getElementById('cw-gen-steps');
      if (steps) steps.innerHTML = '<div class="cw-gen-step-row"><span class="cw-gen-step-dot"></span><span>' + communityEscape(fullMessage) + '</span></div>';
    }
    showErr(fullMessage);
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function loadCommunityJobs() {
  const host = document.getElementById('community-jobs');
  if (!host) return;
  if (!RA10 || !RA10.isLoggedIn || !RA10.isLoggedIn()) {
    host.innerHTML = '<div class="credit-log-note">Sign in to view your jobs.</div>';
    return;
  }
  try {
    const rows = await communityRest('community_app_jobs?select=id,status,progress,status_note,eta_seconds,error_message,created_at,community_apps(title)&order=created_at.desc&limit=20', 'GET', null, true);
    if (!Array.isArray(rows) || !rows.length) {
      host.innerHTML = '<div class="credit-log-note">No jobs yet.</div>';
      return;
    }
    host.innerHTML = rows.map((row) => {
      const pct = Math.max(0, Math.min(100, Number(row.progress || 0)));
      const title = communityEscape((row.community_apps && row.community_apps.title) || 'Untitled app');
      const statusRaw = String(row.status || 'queued');
      const statusLabel = communityEscape(statusRaw);
      const statusCls = statusRaw === 'running' || statusRaw === 'processing' ? 'running' : (statusRaw === 'completed' ? 'done' : (statusRaw === 'failed' ? 'failed' : ''));
      const note = communityEscape(String(row.status_note || ''));
      const etaRaw = Number(row.eta_seconds);
      const eta = Number.isFinite(etaRaw) && etaRaw > 0 ? ('~' + etaRaw + 's') : '';
      const when = row.created_at ? new Date(row.created_at).toLocaleString() : '';
      const err = row.error_message ? '<div class="auth-error" style="margin-top:var(--sp2);">' + communityEscape(row.error_message) + '</div>' : '';
      const canRetry = statusRaw === 'failed';
      const retryBtn = canRetry
        ? '<button class="btn btn-s" type="button" style="margin-top:var(--sp2);" onclick="communityStartJob(\'' + String(row.id || '') + '\')">Retry</button>'
        : '';
      return ''
        + '<div class="community-job-item">'
        +   '<div class="community-job-top">'
        +     '<span class="community-job-title">' + title + '</span>'
        +     '<span class="community-job-status ' + statusCls + '">' + statusLabel + '</span>'
        +   '</div>'
        +   '<div class="community-job-meta">' + communityEscape(when) + (note ? ' · ' + note : '') + (eta ? ' · ETA ' + eta : '') + '</div>'
        +   (pct > 0 && pct < 100 ? '<div class="community-job-progress"><span style="width:' + pct + '%"></span></div>' : '')
        +   retryBtn
        +   err
        + '</div>';
    }).join('');

    rows.forEach((row) => {
      const status = String(row && row.status || '');
      const id = String(row && row.id || '');
      if (!id || status !== 'queued') return;
      if (_communityQueuedKickoff[id]) return;
      _communityQueuedKickoff[id] = true;
      communityCallFunction('community-process-job', { jobId: id })
        .catch(() => { delete _communityQueuedKickoff[id]; })
        .finally(() => { setTimeout(() => { loadCommunityJobs(); }, 1600); });
    });
  } catch (e) {
    host.innerHTML = '<div class="credit-log-note">Could not load jobs.</div>';
  }
}

async function communityStartJob(jobId) {
  if (!jobId) return;
  try {
    await communityCallFunction('community-process-job', { jobId });
    showMiniToast('Job started');
    await loadCommunityJobs();
  } catch (e) {
    showMiniToast(String((e && e.message) || 'Could not start job'));
  }
}

function communityPinnedStorageKey() {
  const userId = RA10 && RA10.isLoggedIn && RA10.isLoggedIn()
    ? String(RA10.getSession()?.user?.id || 'guest')
    : 'guest';
  return 'ra10-community-pinned-apps:' + userId;
}

function communityGetPinnedIds() {
  try {
    const saved = JSON.parse(localStorage.getItem(communityPinnedStorageKey()) || '[]');
    return Array.isArray(saved) ? saved.map(String) : [];
  } catch (e) { return []; }
}

function communitySetPinnedIds(ids) {
  try { localStorage.setItem(communityPinnedStorageKey(), JSON.stringify(Array.from(new Set(ids.map(String))).slice(0, 12))); } catch (e) {}
}

function communityAnimatePin(originRect) {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const target = document.querySelector('.community-pinned-section');
  if (!originRect || !target) return;
  const from = originRect;
  const to = target.getBoundingClientRect();
  const ghost = document.createElement('div');
  ghost.className = 'community-pin-flight';
  ghost.textContent = '📌 Pinned';
  ghost.style.left = from.left + 'px';
  ghost.style.top = from.top + 'px';
  document.body.appendChild(ghost);
  requestAnimationFrame(() => {
    ghost.style.transform = 'translate(' + (to.left - from.left + 18) + 'px,' + (to.top - from.top + 18) + 'px) scale(.72)';
    ghost.style.opacity = '.15';
  });
  setTimeout(() => {
    ghost.remove();
    target.animate([{ transform: 'scale(.98)' }, { transform: 'scale(1.02)' }, { transform: 'scale(1)' }], { duration: 480, easing: 'cubic-bezier(.16,1,.3,1)' });
  }, 660);
}

function communityTogglePin(appId, origin) {
  const id = String(appId || '');
  if (!id) return;
  // Event.currentTarget is cleared by the browser after the click handler;
  // retain the actual button before the async library re-render happens.
  const originButton = origin && origin.currentTarget instanceof Element ? origin.currentTarget : null;
  const originRect = originButton ? originButton.getBoundingClientRect() : null;
  const pinned = communityGetPinnedIds();
  const isPinned = pinned.includes(id);
  communitySetPinnedIds(isPinned ? pinned.filter(x => x !== id) : [id].concat(pinned));
  loadCommunityApps().then(() => { if (!isPinned) communityAnimatePin(originRect); });
}

async function loadCommunityApps() {
  if (window.RA10Apps) return RA10Apps.loadLibrary();
}


function communityCelebrateLike(origin) {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const button = origin && origin.currentTarget instanceof Element ? origin.currentTarget : null;
  const rect = button ? button.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
  const layer = document.createElement('div');
  layer.className = 'community-confetti-layer';
  document.body.appendChild(layer);
  const colours = ['#d20000', '#ef4444', '#f59e0b', '#ec4899', '#fb7185'];
  for (let i = 0; i < 18; i += 1) {
    const heart = document.createElement('span');
    heart.className = 'community-confetti-heart';
    heart.textContent = i % 3 === 0 ? '✦' : '♥';
    heart.style.left = (rect.left + rect.width / 2) + 'px';
    heart.style.top = (rect.top + rect.height / 2) + 'px';
    heart.style.color = colours[i % colours.length];
    heart.style.setProperty('--x', ((Math.random() - .5) * 180) + 'px');
    heart.style.setProperty('--y', (-55 - Math.random() * 140) + 'px');
    heart.style.setProperty('--r', ((Math.random() - .5) * 90) + 'deg');
    heart.style.animationDelay = (i * 14) + 'ms';
    layer.appendChild(heart);
  }
  setTimeout(() => layer.remove(), 1100);
}

async function communityToggleLike(appId, origin) {
  if (!RA10 || !RA10.isLoggedIn || !RA10.isLoggedIn()) {
    RA10.showPaywall('login', 'community_like');
    return;
  }
  const userId = RA10.getSession().user.id;
  try {
    const existing = await communityRest('community_app_likes?select=app_id&app_id=eq.' + encodeURIComponent(appId) + '&user_id=eq.' + encodeURIComponent(userId) + '&limit=1', 'GET', null, true);
    const isRemoving = Array.isArray(existing) && existing.length;
    if (isRemoving) {
      await communityRest('community_app_likes?app_id=eq.' + encodeURIComponent(appId) + '&user_id=eq.' + encodeURIComponent(userId), 'DELETE', null, true);
    } else {
      await communityRest('community_app_likes', 'POST', { app_id: appId, user_id: userId }, true);
      communityCelebrateLike(origin);
    }
    await loadCommunityApps();
  } catch (e) {
    showMiniToast('Could not update like');
  }
}

async function communityOpenComments(appId) {
  const currentId = String(_communityOpenState?.app?.id || '');
  if (currentId !== String(appId || '')) {
    await communityOpenApp(appId);
  }
  requestAnimationFrame(() => {
    const comments = document.querySelector('.community-comment-section');
    if (comments) {
      comments.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = document.getElementById('community-comment-input');
      if (input) setTimeout(() => input.focus(), 350);
    }
  });
}

let _communityShareApp = null;

function communityShareLink(appId) {
  const id = encodeURIComponent(String(appId || ''));
  return 'https://ra10.co.uk/community?app=' + id;
}

function communitySharePreviewLink(appId) {
  return COMMUNITY_SB_URL + '/functions/v1/community-share-preview?app=' + encodeURIComponent(String(appId || ''));
}

function communityShareApp(appId) {
  const app = _communityApps.find(item => String(item.id || '') === String(appId || ''));
  if (!app) return;
  _communityShareApp = app;
  const title = String(app.title || 'RA10 Study App');
  const subject = String(app.subject || 'Revision');
  const preview = document.getElementById('community-share-preview');
  if (preview) preview.innerHTML = '<div class="community-share-preview-icon">' + communityEscape(String(app.icon_emoji || '📘')) + '</div><div><strong>' + communityEscape(title) + '</strong><span>' + communityEscape(subject) + ' · ' + communityEscape(String(app.level || 'Revision app')) + '</span></div>';
  const sheet = document.getElementById('community-share-sheet');
  if (sheet) sheet.classList.add('open');
}

async function communityRunShare(kind) {
  const app = _communityShareApp;
  if (!app) return;
  const appLink = communityShareLink(app.id);
  // Crawlers used by WhatsApp/iMessage/Discord need the preview endpoint,
  // which serves Open Graph metadata before redirecting people into the app.
  const link = communitySharePreviewLink(app.id);
  const title = String(app.title || 'RA10 Study App');
  const message = 'Try this RA10 study app: ' + title + '\n' + link;
  if (kind === 'open') { communityCloseShare(); location.href = appLink; return; }
  if (kind === 'whatsapp') { window.open('https://wa.me/?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer'); return; }
  if (kind === 'native' && navigator.share) {
    try { await navigator.share({ title, text: 'Study with this RA10 revision app.', url: link }); } catch (e) {}
    return;
  }
  try {
    await navigator.clipboard.writeText(link);
    showMiniToast('Share link copied');
  } catch (e) {
    window.prompt('Copy this app link:', link);
  }
}

function communityCloseShare() {
  const sheet = document.getElementById('community-share-sheet');
  if (sheet) sheet.classList.remove('open');
}

async function communityToggleFollow(targetUserId) {
  if (!RA10 || !RA10.isLoggedIn || !RA10.isLoggedIn()) {
    RA10.showPaywall('login', 'community_follow');
    return;
  }
  const userId = RA10.getSession().user.id;
  if (String(userId) === String(targetUserId)) return;
  try {
    const existing = await communityRest('community_user_follows?select=following_id&follower_id=eq.' + encodeURIComponent(userId) + '&following_id=eq.' + encodeURIComponent(targetUserId) + '&limit=1', 'GET', null, true);
    if (Array.isArray(existing) && existing.length) {
      await communityRest('community_user_follows?follower_id=eq.' + encodeURIComponent(userId) + '&following_id=eq.' + encodeURIComponent(targetUserId), 'DELETE', null, true);
    } else {
      await communityRest('community_user_follows', 'POST', { follower_id: userId, following_id: targetUserId }, true);
    }
    await loadCommunityApps();
  } catch (e) {
    showMiniToast('Could not update follow');
  }
}

async function communityOpenApp(appId) {
  if (window.RA10Apps) return RA10Apps.openApp(appId);
}


async function communityLoadComments(appId) {
  const host = document.getElementById('community-comments');
  if (!host) return;
  try {
    const rows = await communityRest('community_app_comments?select=id,user_id,body,created_at&app_id=eq.' + encodeURIComponent(appId) + '&order=created_at.desc&limit=60', 'GET', null, !!(RA10 && RA10.isLoggedIn && RA10.isLoggedIn()));
    const list = Array.isArray(rows) ? rows : [];
    const head = document.getElementById('community-comments-count');
    if (head) head.textContent = list.length ? '(' + list.length + ')' : '';
    if (!list.length) {
      host.innerHTML = '<div class="credit-log-note">No comments yet — be the first to say something.</div>';
      return;
    }

    const commentUserIds = Array.from(new Set(list.map((row) => String(row.user_id || '')).filter(Boolean)));
    const commentersById = await communityLoadPublicProfiles(commentUserIds);
    const me = RA10 && RA10.isLoggedIn && RA10.isLoggedIn() ? String(RA10.getSession().user.id || '') : '';
    const isStaff = !!(window.RA10Forum && RA10Forum.isStaff && RA10Forum.isStaff());

    host.innerHTML = list.map((row) => {
      const user = commentersById[String(row.user_id)] || communityResolveCreator(row.user_id);
      const name = communityUserLabel(user, row.user_id);
      const avatar = String(user.profile_pic_url || '').trim();
      const when = row.created_at ? new Date(row.created_at).toLocaleString() : '';
      const badge = user.badge === 'owner' ? '<span class="cf-role owner">👑 Owner</span>' : (user.badge === 'admin' ? '<span class="cf-role admin">🛡️ Admin</span>' : '');
      const canRemove = isStaff || (me && me === String(row.user_id));
      return ''
        + '<div class="community-comment">'
        +   '<div class="community-comment-head">'
        +     '<div class="community-creator-avatar" style="width:24px;height:24px;font-size:.68rem;">' + (avatar ? '<img src="' + communityEscape(avatar) + '" alt="" loading="lazy">' : communityEscape(communityInitials(name))) + '</div>'
        +     '<span class="community-comment-name">' + communityEscape(name) + '</span>' + badge
        +     '<span class="community-comment-time">' + communityEscape(when) + '</span>'
        +     (canRemove ? '<button type="button" class="cf-comment-del" title="Delete comment" aria-label="Delete comment" onclick="communityDeleteComment(\'' + String(appId) + '\',\'' + String(row.id) + '\')">✕</button>' : '')
        +   '</div>'
        +   '<div>' + communityEscape(row.body || '') + '</div>'
        + '</div>';
    }).join('');
  } catch (e) {
    host.innerHTML = '<div class="credit-log-note">Could not load comments' + (e && e.message ? ' (' + communityEscape(e.message) + ')' : '') + '.</div>';
  }
}

async function communityPostComment(appId) {
  if (!RA10 || !RA10.isLoggedIn || !RA10.isLoggedIn()) {
    RA10.showPaywall('login', 'community_comment');
    return;
  }
  const input = document.getElementById('community-comment-input');
  const body = String(input && input.value || '').trim();
  if (!body) return;
  try {
    await communityRest('community_app_comments', 'POST', {
      app_id: appId,
      user_id: RA10.getSession().user.id,
      body,
    }, true);
    input.value = '';
    await Promise.all([communityLoadComments(appId), loadCommunityApps()]);
  } catch (e) {
    showMiniToast(String((e && e.message) || 'Could not post comment').slice(0, 120));
  }
}

async function communityDeleteApp(appId) {
  if (!RA10 || !RA10.isLoggedIn || !RA10.isLoggedIn()) {
    RA10.showPaywall('login', 'community_delete');
    return;
  }
  const app = _communityApps.find((x) => String(x.id) === String(appId));
  const userId = String(RA10.getSession().user.id || '');
  const staff = !!(window.RA10Forum && RA10Forum.isStaff && RA10Forum.isStaff());
  if (!app || (String(app.creator_id || '') !== userId && !staff)) {
    showMiniToast('Only the creator or a community manager can delete this app.');
    return;
  }
  if (!confirm('Delete this app permanently? This will remove generated content, likes, comments and jobs.')) return;
  try {
    await communityRest('community_apps?id=eq.' + encodeURIComponent(appId), 'DELETE', null, true);
    if (window.RA10Apps) RA10Apps.closeApp();
    await Promise.all([loadCommunityApps(), loadCommunityJobs()]);
    showMiniToast('App deleted');
  } catch (e) {
    showMiniToast(String((e && e.message) || 'Could not delete app'));
  }
}

async function communityHideApp(appId, hide) {
  try {
    await communityRest('community_apps?id=eq.' + encodeURIComponent(appId), 'PATCH', { status: hide ? 'hidden' : 'published' }, true);
    showMiniToast(hide ? 'App hidden from the library' : 'App is visible again');
    await Promise.all([loadCommunityApps(), communityOpenApp(appId)]);
  } catch (e) {
    showMiniToast(String((e && e.message) || 'Could not update app'));
  }
}

async function communityDeleteComment(appId, commentId) {
  if (!confirm('Delete this comment?')) return;
  try {
    await communityRest('community_app_comments?id=eq.' + encodeURIComponent(commentId), 'DELETE', null, true);
    await Promise.all([communityLoadComments(appId), loadCommunityApps()]);
  } catch (e) {
    showMiniToast(String((e && e.message) || 'Could not delete comment'));
  }
}
window.communityHideApp = communityHideApp;
window.communityDeleteComment = communityDeleteComment;

async function communityAskRefine(appId) {
  const input = document.getElementById('community-chat-input');
  const out = document.getElementById('community-chat-reply');
  const message = String(input && input.value || '').trim();
  if (!message || !out) return;
  out.textContent = 'Thinking...';
  try {
    const data = await communityCallFunction('community-chat', { appId, message });
    out.textContent = String(data && data.reply || 'No response');
  } catch (e) {
    out.textContent = String((e && e.message) || e || 'Could not get response');
  }
}

// ============================================================
//  COMMUNITY WIZARD — subject / board pickers, steps
// ============================================================
const CW_SUBJECTS = [
  { value:'Business',    label:'Business',    icon:'💼', cls:'cw-subj-business' },
  { value:'IT',          label:'IT',          icon:'💻', cls:'cw-subj-it' },
  { value:'Science',     label:'Science',     icon:'🔬', cls:'cw-subj-science' },
  { value:'Maths',       label:'Maths',       icon:'📐', cls:'cw-subj-maths' },
  { value:'English',     label:'English',     icon:'📖', cls:'cw-subj-english' },
  { value:'History',     label:'History',     icon:'🏛️', cls:'cw-subj-history' },
  { value:'Geography',   label:'Geography',   icon:'🌍', cls:'cw-subj-geography' },
  { value:'Psychology',  label:'Psychology',  icon:'🧠', cls:'cw-subj-psychology' },
  { value:'Economics',   label:'Economics',   icon:'📈', cls:'cw-subj-economics' },
  { value:'Sport',       label:'Sport / PE',  icon:'⚽', cls:'cw-subj-sport' },
  { value:'Art',         label:'Art & Design',icon:'🎨', cls:'cw-subj-art' },
  { value:'General',     label:'General',     icon:'📚', cls:'cw-subj-general' },
];

const CW_BOARDS = [
  { value:'AQA',        label:'AQA',          sub:'GCSE / A-Level',   abbr:'AQA',  cls:'cw-logo-aqa' },
  { value:'Edexcel',    label:'Edexcel',       sub:'GCSE / A-Level',   abbr:'EDX',  cls:'cw-logo-edexcel' },
  { value:'Pearson',    label:'Pearson BTEC',  sub:'BTEC / AAQ',       abbr:'PRS',  cls:'cw-logo-pearson' },
  { value:'OCR',        label:'OCR',           sub:'GCSE / A-Level',   abbr:'OCR',  cls:'cw-logo-ocr' },
  { value:'WJEC',       label:'WJEC / Eduqas', sub:'Wales',            abbr:'WJC',  cls:'cw-logo-wjec' },
  { value:'Cambridge',  label:'Cambridge',     sub:'IGCSE / Pre-U',    abbr:'CAM',  cls:'cw-logo-cambridge' },
  { value:'IB',         label:'IB',            sub:'International Baccalaureate', abbr:'IB', cls:'cw-logo-ib' },
  { value:'CCEA',       label:'CCEA',          sub:'Northern Ireland',  abbr:'CCE',  cls:'cw-logo-ccea' },
  { value:'Other',      label:'Other / Mixed', sub:'',                  abbr:'···',  cls:'cw-logo-other' },
];

let _cwizStep = 0;
const _cwizTotalSteps = 5;

function cwizInit() {
  // Build subject picker
  const sg = document.getElementById('cw-subject-grid');
  if (sg && !sg.dataset.built) {
    sg.dataset.built = '1';
    sg.innerHTML = CW_SUBJECTS.map(s =>
      `<div class="cw-picker-tile" data-value="${s.value}" onclick="cwizPickSubject(this)">
        <input type="radio" name="cw-subject" value="${s.value}">
        <div class="cw-picker-logo ${s.cls}" style="font-size:1.4rem;background:transparent;border:none;">${s.icon}</div>
        <div class="cw-picker-name">${s.label}</div>
        <div class="cw-picker-check"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
      </div>`
    ).join('');
  }

  // Build board picker
  const bg = document.getElementById('cw-board-grid');
  if (bg && !bg.dataset.built) {
    bg.dataset.built = '1';
    bg.innerHTML = CW_BOARDS.map(b =>
      `<div class="cw-picker-tile" data-value="${b.value}" onclick="cwizPickBoard(this)">
        <input type="radio" name="cw-board" value="${b.value}">
        <div class="cw-picker-logo ${b.cls}" style="font-size:.72rem;font-weight:900;width:38px;height:38px;">${b.abbr}</div>
        <div class="cw-picker-name">${b.label}</div>
        ${b.sub ? `<div class="cw-picker-sub">${b.sub}</div>` : ''}
        <div class="cw-picker-check"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
      </div>`
    ).join('');
  }

  cwizUpdateNav();
}

function cwizPickSubject(tile) {
  document.querySelectorAll('#cw-subject-grid .cw-picker-tile').forEach(t => t.classList.remove('selected'));
  tile.classList.add('selected');
  const sel = document.getElementById('community-subject');
  if (sel) sel.value = tile.dataset.value || '';
}

function cwizPickBoard(tile) {
  document.querySelectorAll('#cw-board-grid .cw-picker-tile').forEach(t => t.classList.remove('selected'));
  tile.classList.add('selected');
  const inp = document.getElementById('community-exam-board');
  if (inp) inp.value = tile.dataset.value || '';
}

function cwizPickLevel(btn) {
  document.querySelectorAll('#cw-level-row .cw-level-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const inp = document.getElementById('community-level');
  if (inp) inp.value = btn.dataset.level || '';
}

function cwizPickDiff(btn) {
  btn.closest('.cw-level-row').querySelectorAll('.cw-level-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const inp = document.getElementById('cw-difficulty');
  if (inp) inp.value = btn.dataset.diff || 'Mixed';
}

function cwizPickQStyle(btn) {
  btn.closest('.cw-level-row').querySelectorAll('.cw-level-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const inp = document.getElementById('cw-qstyle');
  if (inp) inp.value = btn.dataset.qstyle || 'Exam-style';
}

const _cwizPresets = {
  quick:         { q:15, f:20, quiz:10, ch:5 },
  standard:      { q:24, f:30, quiz:20, ch:8 },
  comprehensive: { q:50, f:60, quiz:40, ch:14 },
};

function cwizPickPreset(card) {
  document.querySelectorAll('.cw-preset-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  const p = _cwizPresets[card.dataset.preset] || _cwizPresets.standard;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  set('community-target-questions', p.q);
  set('community-target-flashcards', p.f);
  set('community-target-quiz', p.quiz);
  set('community-target-chapters', p.ch);
}

function cwizGo(stepIdx) {
  _cwizStep = Math.max(0, Math.min(_cwizTotalSteps - 1, stepIdx));
  document.querySelectorAll('.cwiz-pane').forEach((p, i) => p.classList.toggle('active', i === _cwizStep));
  document.querySelectorAll('.cwiz-step').forEach((s, i) => {
    s.classList.toggle('active', i === _cwizStep);
    s.classList.toggle('done', i < _cwizStep);
  });
  if (_cwizStep === _cwizTotalSteps - 1) cwizBuildReview();
  cwizUpdateNav();
}

function cwizShowError(message) {
  const host = document.getElementById('cwiz-inline-error');
  if (!host) return;
  host.textContent = message || '';
  host.classList.toggle('show', !!message);
}

function cwizValidateStep(step) {
  if (step === 0) {
    if (!cwizGetVal('community-subject')) return 'Choose a subject before continuing.';
    if (!cwizGetVal('community-level')) return 'Choose a qualification level before continuing.';
    if (!cwizGetVal('community-exam-board')) return 'Choose an exam board before continuing.';
  }
  if (step === 2) {
    if (!document.querySelector('.community-feature:checked')) return 'Choose at least one type of revision content to generate.';
  }
  return '';
}

function cwizStep(dir) {
  if (dir > 0) {
    const error = cwizValidateStep(_cwizStep);
    if (error) { cwizShowError(error); return; }
  }
  cwizShowError('');
  cwizGo(_cwizStep + dir);
}

function cwizUpdateNav() {
  const prev = document.getElementById('cwiz-prev');
  const next = document.getElementById('cwiz-next');
  const gen  = document.getElementById('community-create-btn');
  const lbl  = document.getElementById('cwiz-step-label');
  const isLast = _cwizStep === _cwizTotalSteps - 1;
  if (prev) prev.style.display = _cwizStep > 0 ? '' : 'none';
  if (next) next.style.display = isLast ? 'none' : '';
  if (gen)  gen.style.display  = isLast ? '' : 'none';
  if (lbl)  lbl.textContent = 'Step ' + (_cwizStep + 1) + ' of ' + _cwizTotalSteps;
}

function cwizGetVal(id) { return String(document.getElementById(id)?.value || '').trim(); }
function cwizChecked(id) { return !!document.getElementById(id)?.checked; }

function cwizBuildReview() {
  const host = document.getElementById('cwiz-review-summary');
  if (!host) return;
  const subject   = cwizGetVal('community-subject') || 'Not selected';
  const board     = cwizGetVal('community-exam-board') || 'Not selected';
  const level     = cwizGetVal('community-level') || 'Not selected';
  const title     = cwizGetVal('community-title') || '(AI will generate a title)';
  const desc      = cwizGetVal('community-desc') || '—';
  const diff      = cwizGetVal('cw-difficulty') || 'Mixed';
  const qstyle    = cwizGetVal('cw-qstyle') || 'Exam-style';
  const qCount    = cwizGetVal('community-target-questions');
  const fCount    = cwizGetVal('community-target-flashcards');
  const qzCount   = cwizGetVal('community-target-quiz');
  const chCount   = cwizGetVal('community-target-chapters');
  const pastP     = cwizChecked('cw-toggle-pastpapers');
  const research  = cwizChecked('cw-toggle-research');
  const examples  = cwizChecked('cw-toggle-examples');
  const technique = cwizChecked('cw-toggle-technique');
  const features  = Array.from(document.querySelectorAll('.community-feature:checked')).map(e => e.value);
  const fileEl    = document.getElementById('community-source');
  const hasSource = (fileEl && fileEl.value.trim().length > 0) || (document.getElementById('community-file')?.files?.length > 0);

  const row = (label, val) => `<div style="display:flex;gap:var(--sp3);align-items:baseline;font-size:var(--tx-xs);"><span style="color:var(--color-text-muted);min-width:130px;flex-shrink:0;">${label}</span><span style="font-weight:600;color:var(--color-text);">${val}</span></div>`;
  const tick = v => v ? '<span style="color:var(--color-success);">✓</span>' : '<span style="color:var(--color-text-faint);">✗</span>';

  host.innerHTML =
    `<div style="display:grid;gap:var(--sp2);">
      ${row('Title', communityEscape(title))}
      ${row('Subject', communityEscape(subject))}
      ${row('Exam board', communityEscape(board))}
      ${row('Level', communityEscape(level))}
      ${row('Difficulty', communityEscape(diff))}
      ${row('Question style', communityEscape(qstyle))}
    </div>
    <div style="border-top:1px solid var(--color-border);padding-top:var(--sp3);display:grid;gap:var(--sp2);">
      ${row('Content', features.map(f => f.replace('_',' ')).join(', ') || 'None selected')}
      ${row('Questions', qCount + ' Qs · ' + fCount + ' cards · ' + qzCount + ' quiz · ' + chCount + ' chapters')}
      ${row('Source material', hasSource ? '✓ Provided' : '⚠ None — AI will use general knowledge only')}
    </div>
    <div style="border-top:1px solid var(--color-border);padding-top:var(--sp3);display:grid;gap:var(--sp2);">
      ${row('Past paper styles', tick(pastP) + (pastP ? ' Yes' : ' No'))}
      ${row('Online research', tick(research) + (research ? ' Yes' : ' No'))}
      ${row('Real-world examples', tick(examples) + (examples ? ' Yes' : ' No'))}
      ${row('Exam technique tips', tick(technique) + (technique ? ' Yes' : ' No'))}
    </div>`;
}

function cwizSimulateProgress() {
  const prog = document.getElementById('cw-gen-progress');
  const fill = document.getElementById('cw-gen-bar-fill');
  if (!prog) return;
  prog.classList.remove('failed');
  prog.classList.add('visible');
  const title = prog.querySelector('strong');
  if (title) title.textContent = '⏳ Your app is queued…';
  const stepsHost = document.getElementById('cw-gen-steps');
  if (stepsHost) stepsHost.innerHTML = '<div class="cw-gen-step-row active" id="cws-queued"><span class="cw-gen-step-dot"></span>Waiting for the generator to confirm the job…</div><div class="cw-gen-step-row" id="cws-status"><span class="cw-gen-step-dot"></span>Live progress will appear in Generation Queue below.</div>';
  if (fill) fill.style.width = '18%';
}

async function cwizTrackJob(jobId) {
  const prog = document.getElementById('cw-gen-progress');
  const fill = document.getElementById('cw-gen-bar-fill');
  const title = prog?.querySelector('strong');
  const statusRow = document.getElementById('cws-status');
  if (!jobId || !prog) return;
  let attempts = 0;
  const check = async () => {
    attempts += 1;
    try {
      const rows = await communityRest('community_app_jobs?select=status,progress,status_note,error_message&limit=1&id=eq.' + encodeURIComponent(jobId), 'GET', null, true);
      const job = Array.isArray(rows) ? rows[0] : null;
      if (!job) throw new Error('Generation job could not be found.');
      const status = String(job.status || 'queued');
      const progress = Math.max(5, Math.min(100, Number(job.progress || 0)));
      if (fill) fill.style.width = progress + '%';
      if (statusRow) statusRow.innerHTML = '<span class="cw-gen-step-dot"></span>' + communityEscape(String(job.status_note || status));
      if (status === 'completed') {
        if (title) title.textContent = '✓ Your app is published';
        prog.classList.remove('failed');
        const row = document.getElementById('cws-queued'); if (row) { row.classList.remove('active'); row.classList.add('done'); }
        await loadCommunityApps();
        return;
      }
      if (status === 'failed') {
        prog.classList.add('failed');
        if (title) title.textContent = 'Generation could not complete';
        if (statusRow) statusRow.innerHTML = '<span class="cw-gen-step-dot"></span>' + communityEscape(String(job.error_message || job.status_note || 'The generator returned an error.'));
        return;
      }
      if (attempts < 60) {
        setTimeout(check, 2500);
      } else {
        prog.classList.add('failed');
        if (title) title.textContent = 'Generation is taking longer than expected';
        if (statusRow) statusRow.innerHTML = '<span class="cw-gen-step-dot"></span>The generator has not confirmed completion. Open Generation Queue below to retry or view the server note.';
      }
    } catch (error) {
      prog.classList.add('failed');
      if (title) title.textContent = 'Could not check generation status';
      if (statusRow) statusRow.innerHTML = '<span class="cw-gen-step-dot"></span>' + communityEscape(String((error && error.message) || error));
    }
  };
  check();
}

function cwizShowProcessorFailure(error) {
  const prog = document.getElementById('cw-gen-progress');
  const title = prog?.querySelector('strong');
  const status = document.getElementById('cws-status');
  const rawMessage = String((error && error.message) || error || 'The generator could not start.');
  const message = /unauthorized|401|jwt|sign in/i.test(rawMessage)
    ? 'Your session has expired. Please sign out and sign back in, then retry generation.'
    : rawMessage;
  if (prog) prog.classList.add('visible', 'failed');
  if (title) title.textContent = 'Generation processor could not start';
  if (status) status.innerHTML = '<span class="cw-gen-step-dot"></span>' + communityEscape(message) + ' Open Generation Queue below and use Retry after resolving this server error.';
  const err = document.getElementById('community-create-err');
  if (err) { err.textContent = message; err.style.display = ''; }
}

// ============================================================
//  END COMMUNITY WIZARD
// ============================================================

function initCommunityBindings() {
  // Init wizard pickers on first run
  cwizInit();

  const shareSheet = document.getElementById('community-share-sheet');
  const bindShare = (id, action) => {
    const button = document.getElementById(id);
    if (button && !button.dataset.bound) {
      button.dataset.bound = '1';
      button.addEventListener('click', action);
    }
  };
  bindShare('community-share-native', () => communityRunShare('native'));
  bindShare('community-share-copy', () => communityRunShare('copy'));
  bindShare('community-share-whatsapp', () => communityRunShare('whatsapp'));
  bindShare('community-share-open', () => communityRunShare('open'));
  bindShare('community-share-close', communityCloseShare);
  if (shareSheet && !shareSheet.dataset.bound) {
    shareSheet.dataset.bound = '1';
    shareSheet.addEventListener('click', (event) => { if (event.target === shareSheet) communityCloseShare(); });
  }

  const createBtn = document.getElementById('community-create-btn');
  if (createBtn && !createBtn.dataset.bound) {
    createBtn.dataset.bound = '1';
    createBtn.addEventListener('click', createCommunityAppJob);
  }
  const refreshBtn = document.getElementById('community-refresh-btn');
  if (refreshBtn && !refreshBtn.dataset.bound) {
    refreshBtn.dataset.bound = '1';
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.classList.add('is-loading');
      refreshBtn.disabled = true;
      try {
        await loadCommunityApps();
        showMiniToast('Library refreshed');
      } finally {
        refreshBtn.classList.remove('is-loading');
        refreshBtn.disabled = false;
      }
    });
  }
  const search = document.getElementById('community-search');
  if (search && !search.dataset.bound) {
    search.dataset.bound = '1';
    search.addEventListener('input', () => { loadCommunityApps(); });
  }
  const subject = document.getElementById('community-subject-filter');
  if (subject && !subject.dataset.bound) {
    subject.dataset.bound = '1';
    subject.addEventListener('change', () => { loadCommunityApps(); });
  }
  const newAppBtn = document.getElementById('community-new-app-btn');
  const createDrawer = document.getElementById('community-create-drawer');
  const createClose = document.getElementById('community-create-close');
  if (newAppBtn && createDrawer && !newAppBtn.dataset.bound) {
    newAppBtn.dataset.bound = '1';
    newAppBtn.addEventListener('click', () => {
      const isOpen = createDrawer.style.display !== 'none';
      createDrawer.style.display = isOpen ? 'none' : 'block';
      if (!isOpen) {
        cwizInit();
        cwizGo(0);
        createDrawer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
  if (createClose && createDrawer && !createClose.dataset.bound) {
    createClose.dataset.bound = '1';
    createClose.addEventListener('click', () => {
      createDrawer.style.display = 'none';
    });
  }
  const fileInput = document.getElementById('community-file');
  const fileStatus = document.getElementById('community-file-status');
  if (fileInput && fileStatus && !fileInput.dataset.bound) {
    fileInput.dataset.bound = '1';
    fileInput.addEventListener('change', () => {
      const f = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
      fileStatus.textContent = f
        ? (String(f.name || 'File selected') + ' (' + Math.max(1, Math.round(Number(f.size || 0) / 1024)) + ' KB)')
        : 'No file selected';
    });
  }
}

async function renderCommunityPage() {
  if (window.RA10Forum && typeof RA10Forum.show === 'function') RA10Forum.show();
  if (window.RA10Apps) RA10Apps.mount();
  initCommunityBindings();
  if (!_communityJobsPoller) {
    _communityJobsPoller = setInterval(() => {
      if (ra10RoutePath() === '/community') {
        loadCommunityJobs();
      }
    }, 3000);
  }
  await Promise.all([loadCommunityApps(), loadCommunityJobs()]);
  const query = new URLSearchParams(ra10Route().split('?')[1] || '');
  const sharedAppId = query.get('app');
  if (sharedAppId && (!_communityOpenState || String(_communityOpenState.app?.id || '') !== String(sharedAppId))) {
    communityOpenApp(sharedAppId);
  }
}

window.communityToggleLike = communityToggleLike;
window.communityToggleFollow = communityToggleFollow;
window.communityOpenApp = communityOpenApp;
window.communityOpenComments = communityOpenComments;
window.communityTogglePin = communityTogglePin;
window.communityShareApp = communityShareApp;
window.cwizGo = cwizGo;
window.cwizStep = cwizStep;
window.cwizPickSubject = cwizPickSubject;
window.cwizPickBoard = cwizPickBoard;
window.cwizPickLevel = cwizPickLevel;
window.cwizPickDiff = cwizPickDiff;
window.cwizPickQStyle = cwizPickQStyle;
window.cwizPickPreset = cwizPickPreset;
window.communityApplyRefineTag = communityApplyRefineTag;
window.communityPostComment = communityPostComment;
window.communityAskRefine = communityAskRefine;
window.communityStartJob = communityStartJob;
window.communityDeleteApp = communityDeleteApp;

const PINNED_APPS_KEY = 'ra10_pinned_apps_v1';
const ALL_APPS = [
  { path: '/revision/btec/level-3/IT-AAQ/unit-1', icon: 'it', label: 'IT', name: 'IT AAQ Unit 1', desc: 'Systems, exam practice, AI feedback' },
  { path: '/revision/btec/level-3/IT-AAQ/unit-2', icon: 'it', label: 'IT', name: 'IT AAQ Unit 2', desc: 'Cyber security & incident management' },
  { path: '/revision/btec/level-3/IT-AAQ/unit-3', icon: 'it', label: 'IT', name: 'IT AAQ Unit 3', desc: 'Website development & assignment support' },
  { path: '/revision/btec/level-3/IT-AAQ/unit-4', icon: 'it', label: 'IT', name: 'IT AAQ Unit 4', desc: 'Relational databases, SQL & MS Access' },
  { path: '/revision/btec/level-3/business/unit-2', icon: 'business', label: 'BU', name: 'Business Unit 2', desc: 'Marketing campaign set tasks marked by AI Examiner' },
  { path: '/revision/btec/level-3/business/unit-3', icon: 'business', label: 'BU', name: 'Business Unit 3', desc: 'Finance exams, calculations and AI marking' },
  { path: '/revision/btec/level-3/business/unit-6', icon: 'business', label: 'BU', name: 'Business Unit 6', desc: 'Principles of Management set tasks' },
  { path: '/revision/btec/level-3/business/unit-7', icon: 'business', label: 'BU', name: 'Business Unit 7', desc: 'Business Decision Making Part S tasks' },
  { path: '/revision/a-level/business-2023', icon: 'business', label: 'AL', name: 'A-Level Business (7132)', desc: 'Past papers, RA10 papers, visual guide, AI Examiner' },
  { path: '/revision/a-level/business-2026', icon: 'business', label: 'AL', name: 'A-Level Business (7138, 2026 spec)', desc: 'New spec: sample papers, RA10 papers, guide, AI Examiner' },
  { path: '/revision/btec/level-3/sport/unit-1', icon: 'sport', label: 'SP', name: 'Sport Unit 1', desc: 'Anatomy recall with timed checks' },
  { path: '/revision/btec/level-3/sport/unit-2', icon: 'sport', label: 'SP', name: 'Sport Unit 2', desc: 'Pearson set tasks marked by AI Examiner' },
  { path: '/revision/btec/level-2/it/unit-2', icon: 'l2', label: 'L2', name: 'IT Level 2 Unit 2', desc: 'Technology systems done properly' }
];

const PINNED_EXAMS_KEY = 'ra10_pinned_exams_v1';

// Exam timetable data. Sources: Pearson BTEC 2027 timetables (winter + summer),
// plus standard AQA/Edexcel/OCR GCSE, AS and A-Level exam windows.
const EXAM_DATA = [
  // ---- Pearson BTEC Level 3 IT AAQ (source: Pearson table builder xlsx) ----
  { id: 'btec-it-u1', board: 'Pearson BTEC', level: 'BTEC', subject: 'IT AAQ Unit 1', name: 'Information Technology Systems', dates: ['2027-01-08', '2027-05-14'], appPath: '/revision/btec/level-3/IT-AAQ/unit-1', specUrl: 'https://qualifications.pearson.com/content/dam/pdf/btec-aaqs/information-technology/2025/specification-and-sample-assessments/btec-level-3-national-ext-cert-in-it-aaq-spec.pdf' },
  { id: 'btec-it-u2', board: 'Pearson BTEC', level: 'BTEC', subject: 'IT AAQ Unit 2', name: 'Cyber Security & Incident Management', dates: ['2027-01-12', '2027-05-05'], appPath: '/revision/btec/level-3/IT-AAQ/unit-2', specUrl: 'https://qualifications.pearson.com/content/dam/pdf/btec-aaqs/information-technology/2025/specification-and-sample-assessments/btec-level-3-national-ext-cert-in-it-aaq-spec.pdf' },
  // ---- Pearson BTEC Level 3 Business ----
  { id: 'btec-bus-u3', board: 'Pearson BTEC', level: 'BTEC', subject: 'Business Unit 3', name: 'Personal and Business Finance', dates: ['2027-01-18', '2027-05-11'], appPath: '/revision/btec/level-3/business/unit-3' },
  { id: 'btec-bus-u2', board: 'Pearson BTEC', level: 'BTEC', subject: 'Business Unit 2', name: 'Developing a Marketing Campaign', dates: ['2027-01-07', '2027-05-07'], appPath: '/revision/btec/level-3/business/unit-2' },
  // ---- Pearson BTEC Level 3 Sport ----
  { id: 'btec-sport-u1', board: 'Pearson BTEC', level: 'BTEC', subject: 'Sport Unit 1', name: 'Fitness Training & Programming', dates: ['2027-01-06', '2027-04-29'], appPath: '/revision/btec/level-3/sport/unit-1' },
  { id: 'btec-sport-u19', board: 'Pearson BTEC', level: 'BTEC', subject: 'Sport Unit 19', name: 'Development & Provision of Sport', dates: ['2027-01-14', '2027-05-07'], appPath: '/revision/btec/level-3/sport/unit-1' },
  // ---- Pearson BTEC Level 2 IT ----
  { id: 'btec-l2-it-u2', board: 'Pearson BTEC', level: 'BTEC', subject: 'IT Level 2 Unit 2', name: 'IT Service Solutions', dates: ['2027-02-01', '2027-06-07'], appPath: '/revision/btec/level-2/it/unit-2' },
  // ---- Pearson BTEC Level 3 IT (additional units) ----
  { id: 'btec-it-u14', board: 'Pearson BTEC', level: 'BTEC', subject: 'IT Unit 14', name: 'IT Service Delivery', dates: ['2027-01-05', '2027-04-19'] },
  { id: 'btec-it-u2-systems', board: 'Pearson BTEC', level: 'BTEC', subject: 'IT Unit 2', name: 'Creating Systems to Manage Information', dates: ['2027-01-13', '2027-05-06'] },
  // ---- Pearson BTEC Level 3 Business (additional) ----
  { id: 'btec-bus-u6', board: 'Pearson BTEC', level: 'BTEC', subject: 'Business Unit 6', name: 'Principles of Management', dates: ['2027-01-15', '2027-04-28'], appPath: '/revision/btec/level-3/business/unit-6' },
  { id: 'btec-bus-u7', board: 'Pearson BTEC', level: 'BTEC', subject: 'Business Unit 7', name: 'Business Decision Making', dates: ['2027-01-16', '2027-05-08'], appPath: '/revision/btec/level-3/business/unit-7' },
  // ---- Pearson BTEC Level 3 Sport (additional) ----
  { id: 'btec-sport-u22', board: 'Pearson BTEC', level: 'BTEC', subject: 'Sport Unit 22', name: 'Investigating Business in Sport', dates: ['2027-01-11', '2027-05-14'] },
  { id: 'btec-sport-u2', board: 'Pearson BTEC', level: 'BTEC', subject: 'Sport Unit 2', name: 'Fitness Training & Programming', dates: ['2027-01-06', '2027-04-29'] },
  // ---- Pearson BTEC Level 3 Computing ----
  { id: 'btec-computing-u3', board: 'Pearson BTEC', level: 'BTEC', subject: 'Computing Unit 3', name: 'Planning & Management of Computing Projects', dates: ['2027-04-28', '2027-05-05'] },
  { id: 'btec-computing-u4', board: 'Pearson BTEC', level: 'BTEC', subject: 'Computing Unit 4', name: 'Software Design & Development Project', dates: ['2027-04-26'] },
  // ---- Pearson BTEC Level 3 Health & Social Care ----
  { id: 'btec-hsc-u4', board: 'Pearson BTEC', level: 'BTEC', subject: 'Health & Social Care Unit 4', name: 'Enquiries into Current Research', dates: ['2027-05-10'] },
  // ---- Pearson BTEC Level 3 Applied Science ----
  { id: 'btec-science-u7', board: 'Pearson BTEC', level: 'BTEC', subject: 'Applied Science Unit 7', name: 'Contemporary Issues in Science', dates: ['2027-05-18'] },
  // ---- Pearson BTEC Level 3 Engineering ----
  { id: 'btec-eng-u3', board: 'Pearson BTEC', level: 'BTEC', subject: 'Engineering Unit 3', name: 'Engineering Product Design & Manufacture', dates: ['2027-05-20'] },
  // ---- Pearson BTEC Level 3 Travel & Tourism ----
  { id: 'btec-travel-u2', board: 'Pearson BTEC', level: 'BTEC', subject: 'Travel & Tourism Unit 2', name: 'Global Destinations', dates: ['2027-05-04'] },
  // ---- AQA A-Level Business ----
  { id: 'aqa-bus-al', board: 'AQA', level: 'A-Level', subject: 'A-Level Business', name: 'Business (7132) Papers 1-3', dates: ['2027-06-02', '2027-06-09', '2027-06-16'], appPath: '/revision/a-level/business-2023' },
  // ---- GCSE (source: BBC Bitesize 2027 timetable, morning unless noted) ----
  { id: 'gcse-compsci', board: 'AQA', level: 'GCSE', subject: 'GCSE Computer Science', name: 'Computer Science (8525)', dates: ['2027-05-10', '2027-05-19'] },
  { id: 'gcse-maths', board: 'AQA', level: 'GCSE', subject: 'GCSE Maths', name: 'Mathematics (8300)', dates: ['2027-05-14', '2027-05-27', '2027-06-14'] },
  { id: 'gcse-english-lit', board: 'AQA', level: 'GCSE', subject: 'GCSE English Literature', name: 'English Literature (8702)', dates: ['2027-05-12', '2027-05-19'] },
  { id: 'gcse-biology', board: 'AQA', level: 'GCSE', subject: 'GCSE Biology', name: 'Biology (8461)', dates: ['2027-05-11', '2027-06-10'] },
  { id: 'gcse-chemistry', board: 'AQA', level: 'GCSE', subject: 'GCSE Chemistry', name: 'Chemistry (8462)', dates: ['2027-05-17', '2027-06-15'] },
  { id: 'gcse-physics', board: 'AQA', level: 'GCSE', subject: 'GCSE Physics', name: 'Physics (8463)', dates: ['2027-05-25', '2027-06-18'] },
  { id: 'gcse-english-lang', board: 'AQA', level: 'GCSE', subject: 'GCSE English Language', name: 'English Language (8700)', dates: ['2027-05-24', '2027-06-08'] },
  { id: 'gcse-history', board: 'AQA', level: 'GCSE', subject: 'GCSE History', name: 'History (8145)', dates: ['2027-05-20', '2027-05-28'] },
  { id: 'gcse-geography', board: 'AQA', level: 'GCSE', subject: 'GCSE Geography', name: 'Geography (8035)', dates: ['2027-05-18', '2027-05-26', '2027-06-10'] },
  { id: 'gcse-science-combined', board: 'AQA', level: 'GCSE', subject: 'GCSE Combined Science', name: 'Combined Science: Trilogy (8464)', dates: ['2027-05-11', '2027-05-17', '2027-05-25', '2027-06-10', '2027-06-15', '2027-06-18'] },
  // ---- AS Level ----
  { id: 'aqa-as-maths', board: 'AQA', level: 'AS', subject: 'AS Maths', name: 'Mathematics (7356)', dates: ['2027-05-19', '2027-05-26'] },
  { id: 'aqa-as-biology', board: 'AQA', level: 'AS', subject: 'AS Biology', name: 'Biology (7401)', dates: ['2027-05-18', '2027-05-25'] },
  // ---- AQA A-Level ----
  { id: 'aqa-al-maths', board: 'AQA', level: 'A-Level', subject: 'A-Level Maths', name: 'Mathematics (7357)', dates: ['2027-06-03', '2027-06-10', '2027-06-17'] },
  { id: 'aqa-al-biology', board: 'AQA', level: 'A-Level', subject: 'A-Level Biology', name: 'Biology (7402)', dates: ['2027-06-04', '2027-06-11', '2027-06-18'] },
  { id: 'aqa-al-chemistry', board: 'AQA', level: 'A-Level', subject: 'A-Level Chemistry', name: 'Chemistry (7405)', dates: ['2027-06-02', '2027-06-09', '2027-06-16'] },
  { id: 'aqa-al-physics', board: 'AQA', level: 'A-Level', subject: 'A-Level Physics', name: 'Physics (7408)', dates: ['2027-06-03', '2027-06-10', '2027-06-17'] },
  // ---- Edexcel GCSE ----
  { id: 'edexcel-gcse-maths', board: 'Edexcel', level: 'GCSE', subject: 'GCSE Maths', name: 'Mathematics (1MA1)', dates: ['2027-05-14', '2027-05-27', '2027-06-14'] },
  { id: 'edexcel-gcse-english', board: 'Edexcel', level: 'GCSE', subject: 'GCSE English', name: 'English Language (1EN0)', dates: ['2027-05-24', '2027-06-08'] },
  // ---- Edexcel A-Level ----
  { id: 'edexcel-al-maths', board: 'Edexcel', level: 'A-Level', subject: 'A-Level Maths', name: 'Mathematics (9MA0)', dates: ['2027-06-04', '2027-06-11', '2027-06-18'] },
  // ---- OCR GCSE ----
  { id: 'ocr-gcse-maths', board: 'OCR', level: 'GCSE', subject: 'GCSE Maths', name: 'Mathematics (J560)', dates: ['2027-05-14', '2027-05-27', '2027-06-14'] },
  { id: 'ocr-gcse-science', board: 'OCR', level: 'GCSE', subject: 'GCSE Science', name: 'Combined Science (J260)', dates: ['2027-05-11', '2027-05-17', '2027-05-25', '2027-06-10', '2027-06-15', '2027-06-18'] }
];

function getPinnedExams() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PINNED_EXAMS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(p => typeof p === 'string') : [];
  } catch (_) { return []; }
}
function setPinnedExams(list) {
  localStorage.setItem(PINNED_EXAMS_KEY, JSON.stringify(Array.from(new Set(list))));
}
function togglePinnedExam(id) {
  const current = getPinnedExams();
  const next = current.includes(id) ? current.filter(p => p !== id) : current.concat(id);
  setPinnedExams(next);
  renderExamsPage();
  renderSignedInDashboard();
}

function getPinnedApps() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PINNED_APPS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(p => typeof p === 'string') : [];
  } catch (_) { return []; }
}
function setPinnedApps(list) {
  localStorage.setItem(PINNED_APPS_KEY, JSON.stringify(Array.from(new Set(list))));
}
function togglePinnedApp(path) {
  const current = getPinnedApps();
  const next = current.includes(path) ? current.filter(p => p !== path) : current.concat(path);
  setPinnedApps(next);
  renderSignedInDashboard();
}


/* Animated icon set for the signed-in dashboard (inline SVG, CSS-animated). */
const SD_SVG = (inner, cls) => '<svg class="sd-svg ' + (cls || '') + '" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
const SD_ICONS = {
  flame: SD_SVG('<path class="a-flame" d="M24 5c1 7 9 10 9 20a9 9 0 0 1-18 0c0-4 2-6 4-8 0 4 2 5 3 5 0-6-1-11 2-17z" fill="currentColor" fill-opacity=".18"/><path class="a-flame2" d="M24 40a4.5 4.5 0 0 1-4.5-4.5c0-3 2.5-4 4.5-7 2 3 4.5 4 4.5 7A4.5 4.5 0 0 1 24 40z" fill="currentColor" fill-opacity=".5" stroke="none"/>'),
  bolt: SD_SVG('<path class="a-bolt" d="M27 4 10 27h12l-3 17 19-25H26z" fill="currentColor" fill-opacity=".2"/><path class="a-spark" d="M38 6v6M35 9h6M9 38v5M6.5 40.5h5" stroke-width="2"/>'),
  cap: SD_SVG('<path class="a-cap" d="M3 18 24 8l21 10-21 10z" fill="currentColor" fill-opacity=".18"/><path d="M11 23v9c0 3 6 6 13 6s13-3 13-6v-9"/><path class="a-tassel" d="M42 20v12"/>'),
  cal: SD_SVG('<rect x="6" y="9" width="36" height="33" rx="7" fill="currentColor" fill-opacity=".12"/><path d="M6 19h36M16 5v8M32 5v8"/><path class="a-tick" d="m16 30 6 6 11-12" stroke-dasharray="40" stroke-dashoffset="40"/>'),
  tasks: SD_SVG('<rect x="8" y="6" width="32" height="36" rx="7" fill="currentColor" fill-opacity=".12"/><path class="a-t1" d="m15 17 3 3 6-7" stroke-dasharray="20"/><path d="M28 17h7"/><path class="a-t2" d="m15 30 3 3 6-7" stroke-dasharray="20"/><path d="M28 30h7"/>'),
  trophy: SD_SVG('<path d="M14 6h20v12a10 10 0 0 1-20 0z" fill="currentColor" fill-opacity=".18"/><path d="M14 10H6c0 8 3 11 8 11M34 10h8c0 8-3 11-8 11M24 28v8M15 42h18M18 36h12"/><path class="a-shine" d="M19 12v6" stroke-width="2"/>'),
  people: SD_SVG('<circle class="a-p1" cx="17" cy="16" r="6" fill="currentColor" fill-opacity=".18"/><circle class="a-p2" cx="33" cy="19" r="5" fill="currentColor" fill-opacity=".12"/><path d="M5 40c0-7 5-11 12-11s12 4 12 11M31 30c6 0 11 3 11 10"/>'),
  books: SD_SVG('<rect class="a-b1" x="7" y="7" width="9" height="34" rx="2" fill="currentColor" fill-opacity=".18"/><rect class="a-b2" x="19" y="11" width="9" height="30" rx="2" fill="currentColor" fill-opacity=".12"/><path class="a-b3" d="m31 14 8-3 6 26-8 3z" fill="currentColor" fill-opacity=".18"/>'),
  business: SD_SVG('<path d="M6 42h36"/><rect class="a-bar b1" x="9" y="26" width="8" height="16" rx="2" fill="currentColor" fill-opacity=".22"/><rect class="a-bar b2" x="20" y="16" width="8" height="26" rx="2" fill="currentColor" fill-opacity=".22"/><rect class="a-bar b3" x="31" y="8" width="8" height="34" rx="2" fill="currentColor" fill-opacity=".22"/>'),
  sport: SD_SVG('<circle cx="24" cy="24" r="17" fill="currentColor" fill-opacity=".1"/><path class="a-pulse" d="M5 25h9l4-10 6 20 5-14 3 4h11" stroke-dasharray="90"/>'),
  it: SD_SVG('<rect x="5" y="8" width="38" height="28" rx="6" fill="currentColor" fill-opacity=".12"/><path d="m16 18-6 6 6 6M32 18l6 6-6 6"/><path class="a-cursor" d="M24 17v14" stroke-width="3"/><path d="M16 42h16"/>'),
  l2: SD_SVG('<path class="a-page" d="M6 10c7-3 13-2 18 2 5-4 11-5 18-2v28c-7-3-13-2-18 2-5-4-11-5-18-2z" fill="currentColor" fill-opacity=".16"/><path d="M24 12v28"/>')
};
function sdIcon(name) { return SD_ICONS[name] || SD_ICONS.books; }

function sdCountUp(root) {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  (root || document).querySelectorAll('[data-count]').forEach(el => {
    const to = Number(el.getAttribute('data-count'));
    if (!isFinite(to) || reduce || to < 2) { el.textContent = isFinite(to) ? to : el.textContent; return; }
    const t0 = performance.now(), dur = 900;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

const RECENT_APPS_KEY = 'ra10_recent_apps_v1';
function getRecentApps() {
  try { const r = JSON.parse(localStorage.getItem(RECENT_APPS_KEY) || '[]'); return Array.isArray(r) ? r : []; } catch (_) { return []; }
}
function recordRecentApp(path) {
  if (!ALL_APPS.some(a => a.path === path)) return;
  try {
    const list = getRecentApps().filter(r => r.path !== path);
    list.unshift({ path, t: Date.now() });
    localStorage.setItem(RECENT_APPS_KEY, JSON.stringify(list.slice(0, 8)));
  } catch (_) {}
}
function sdUpcomingExams() {
  const now = new Date();
  const pinnedPaths = getPinnedApps();
  const out = [];
  EXAM_DATA.forEach(e => {
    const next = (e.dates || []).map(d => new Date(d + 'T09:00:00')).filter(d => d.getTime() >= now.getTime() - 86400000).sort((a, b) => a - b)[0];
    if (!next) return;
    out.push({ exam: e, date: next, days: Math.max(0, Math.ceil((next.getTime() - now.getTime()) / 86400000)), subject: e.subject, pinned: !!(e.appPath && pinnedPaths.includes(e.appPath)) });
  });
  out.sort((a, b) => (b.pinned - a.pinned) || (a.date - b.date));
  return out;
}
function sdNextExam() {
  const list = sdUpcomingExams();
  return list.length ? list[0] : null;
}
function renderSdNext(ne) {
  const host = document.getElementById('sd-next');
  if (!host) return;
  if (!ne) { host.innerHTML = '<div class="sd-card-head"><h3>Next exam</h3></div><p class="sd-empty">No upcoming exams found.</p>'; return; }
  const total = 120, pct = Math.max(4, Math.min(100, Math.round((1 - Math.min(ne.days, total) / total) * 100)));
  const dateStr = ne.date.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  host.innerHTML = '<div class="sd-card-head"><h3>Next exam</h3><span>' + (ne.pinned ? 'From your pinned subjects' : 'Soonest overall') + '</span></div>'
    + '<div class="sd-count"><div class="sd-ring" style="--p:' + pct + '"><b>' + ne.days + '</b><small>' + (ne.days === 1 ? 'day' : 'days') + '</small></div>'
    + '<div class="sd-count-copy"><strong>' + ne.subject + '</strong><span>' + ne.exam.board + ' · ' + dateStr + '</span>'
    + (ne.exam.appPath ? '<button class="sd-btn sd-btn-primary sm" type="button" onclick="go(\'' + ne.exam.appPath + '\')">Revise this</button>' : '<button class="sd-btn sm" type="button" onclick="go(\'/exams\')">Exam calendar</button>') + '</div></div>';
}

function renderSignedInDashboard() {
  document.querySelectorAll('#signed-in-dashboard .sd-ql').forEach(el => { const n = el.className.replace('sd-ql', '').trim(); if (!el.firstElementChild && el.textContent.indexOf('ICON_') === 0) el.innerHTML = sdIcon(n); });
  const dash = document.getElementById('signed-in-dashboard');
  if (!dash) return;
  const loggedIn = window.RA10 && typeof RA10.isLoggedIn === 'function' && RA10.isLoggedIn();
  const hero = document.getElementById('p-home') ? document.getElementById('p-home').querySelector('.hm-hero') : null;
  if (!loggedIn) {
    dash.style.display = 'none';
    if (hero) hero.style.display = '';
    document.body.classList.remove('home-signed-in');
    return;
  }
  dash.style.display = 'block';
  // When signed in, hide the standalone hero so the dashboard is the single intro widget.
  if (hero) hero.style.display = 'none';
  document.body.classList.add('home-signed-in');

  const pinned = getPinnedApps();
  const pinnedApps = ALL_APPS.filter(a => pinned.includes(a.path));
  const unpinnedApps = ALL_APPS.filter(a => !pinned.includes(a.path));

  const profile = (window.RA10 && typeof RA10.getProfile === 'function') ? (RA10.getProfile() || {}) : {};
  const displayName = profile.full_name || profile.username || 'Learner';
  const nameEl = document.getElementById('signed-in-dash-name');
  if (nameEl) nameEl.textContent = displayName;
  const avatarEl = document.getElementById('signed-in-dash-avatar');
  if (avatarEl) {
    const initial = String(displayName || 'L').trim().charAt(0).toUpperCase();
    avatarEl.textContent = initial;
    if (profile.profile_pic_url) {
      avatarEl.innerHTML = '<img src="' + profile.profile_pic_url + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">';
    }
  }

  // School + group badges
  const schoolRow = document.getElementById('signed-in-dash-school');
  if (schoolRow) {
    const schoolName = profile.school_name || '';
    const groupName = profile.group_name || '';
    const hasSchool = !!schoolName.trim();
    const hasGroup = !!groupName.trim();
    const schoolChip = document.getElementById('signed-in-dash-school-chip');
    const groupChip = document.getElementById('signed-in-dash-group-chip');
    if (schoolChip) {
      if (hasSchool) {
        schoolChip.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>' + escapeHtmlAttr(profile.school_name);
      } else {
        schoolChip.classList.add('hidden');
      }
    }
    if (groupChip) {
      if (hasGroup) {
        groupChip.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' + escapeHtmlAttr(profile.group_name);
        groupChip.style.display = '';
      } else {
        groupChip.style.display = 'none';
      }
    }
    schoolRow.style.display = (hasSchool || hasGroup) ? '' : 'none';
  }

  const hour = new Date().getHours();
  const greetEl = document.getElementById('sd-greet');
  if (greetEl) greetEl.textContent = hour < 5 ? 'Up late' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const streak = (window.RA10 && typeof RA10.getStreak === 'function') ? (RA10.getStreak() || 0) : 0;
  const credits = (window.RA10 && typeof RA10.getCredits === 'function') ? (RA10.getCredits() || 0) : 0;
  const tier = (window.RA10 && typeof RA10.getTier === 'function') ? (RA10.getTier() || 'free') : 'free';
  const nextExam = sdNextExam();
  const statsHost = document.getElementById('signed-in-dash-stats');
  if (statsHost) {
    let statIdx = 0;
    const stat = (icon, val, label, sub, cls) => '<div class="sd-stat ' + (cls || '') + '" style="--i:' + (statIdx++) + '"><span class="sd-stat-ico" aria-hidden="true">' + sdIcon(icon) + '</span><div><b data-count="' + val + '">' + val + '</b><span>' + label + '</span>' + (sub ? '<small>' + sub + '</small>' : '') + '</div></div>';
    statsHost.innerHTML = [
      stat('flame', streak, 'day streak', streak ? 'Keep it going today' : 'Start one today', 'streak'),
      stat('bolt', (credits === Infinity ? '∞' : credits), 'credits', tier === 'free' ? 'Free plan' : 'AI Examiner included', 'credits'),
      stat('cap', pinned.length || '–', 'pinned subjects', pinned.length ? 'Shown first below' : 'Pin one below', 'pins'),
      stat('cal', nextExam ? nextExam.days : '–', nextExam ? (nextExam.days === 1 ? 'day to next exam' : 'days to next exam') : 'no exam set', nextExam ? nextExam.subject : '', 'exam')
    ].join('');
  }

  const cardHtml = (app) => {
    const isPinned = pinned.includes(app.path);
    return '<div class="sd-app" style="--i:' + ((window._sdI = (window._sdI || 0) + 1) % 14) + '" role="link" tabindex="0" onclick="go(\'' + app.path + '\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();go(\'' + app.path + '\')}">'
      + '<span class="sd-app-ico ' + app.icon + '">' + sdIcon(app.icon) + '<em>' + app.label + '</em></span>'
      + '<span class="sd-app-copy"><strong>' + app.name + '</strong><small>' + app.desc + '</small></span>'
      + '<button class="sd-pin' + (isPinned ? ' on' : '') + '" type="button" aria-pressed="' + isPinned + '" aria-label="' + (isPinned ? 'Unpin ' : 'Pin ') + app.name + '" onclick="event.stopPropagation();togglePinnedApp(\'' + app.path + '\')">' + (isPinned ? '★' : '☆') + '</button>'
      + '</div>';
  };

  const recent = getRecentApps().map(r => ALL_APPS.find(a => a.path === r.path)).filter(Boolean).slice(0, 3);
  const recentHost = document.getElementById('sd-recent');
  if (recentHost) {
    if (recent.length) {
      recentHost.innerHTML = recent.map((app, i) => '<button type="button" class="sd-resume' + (i === 0 ? ' first' : '') + '" onclick="go(\'' + app.path + '\')"><span class="sd-app-ico ' + app.icon + '">' + sdIcon(app.icon) + '<em>' + app.label + '</em></span><span class="sd-resume-copy"><small>' + (i === 0 ? 'Last opened' : 'Recently opened') + '</small><strong>' + app.name + '</strong><em>' + app.desc + '</em></span><span class="sd-go" aria-hidden="true">' + (i === 0 ? 'Continue →' : '→') + '</span></button>').join('');
    } else {
      const picks = ALL_APPS.filter(a => /business-2026|business\/unit-3|sport\/unit-2/.test(a.path)).slice(0, 3);
      recentHost.innerHTML = '<p class="sd-empty">Nothing opened yet. Good places to start:</p>' + picks.map(cardHtml).join('');
    }
  }

  const pinnedHost = document.getElementById('signed-in-pinned-grid');
  if (pinnedHost) pinnedHost.innerHTML = pinnedApps.length ? pinnedApps.map(cardHtml).join('') : '<p class="sd-empty">No pinned subjects yet. Tap the star on any subject below to keep it here.</p>';

  const groups = [['all', 'All'], ['business', 'Business'], ['sport', 'Sport'], ['it', 'IT'], ['l2', 'Level 2']];
  const filter = window._sdFilter || 'all';
  const filterHost = document.getElementById('sd-filter');
  if (filterHost) {
    filterHost.innerHTML = groups.map(([k, l]) => '<button type="button" class="sd-chip' + (k === filter ? ' on' : '') + '" aria-pressed="' + (k === filter) + '" onclick="window._sdFilter=\'' + k + '\';renderSignedInDashboard()">' + l + '</button>').join('');
  }
  const allHost = document.getElementById('signed-in-all-grid');
  if (allHost) allHost.innerHTML = ALL_APPS.filter(a => filter === 'all' || a.icon === filter).map(cardHtml).join('');

  renderSdNext(nextExam);
  sdCountUp(dash);
  renderExamTimes();
}

let _examsFilter = { board: 'all', level: 'all', subject: 'all', pinnedOnly: false, search: '', sort: 'date', view: 'calendar' };
let _examsCalState = { year: null, month: null };

function examsProgressPct(next, now) {
  // Estimate how close we are to the exam: assume a ~365 day revision window.
  const total = 365 * 24 * 60 * 60 * 1000;
  const elapsed = total - (next.getTime() - now.getTime());
  return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
}

// ── Exam calendar export (ICS + Google Calendar deep-link) ──
function examCalendarTitle(exam) {
  const subject = String(exam.subject || '').trim();
  const name = String(exam.name || '').trim();
  return name ? (subject + ' — ' + name) : subject;
}

function examCalendarDescription(exam) {
  const lines = [];
  lines.push('Board: ' + (exam.board || ''));
  lines.push('Level: ' + (exam.level || ''));
  const sittings = (exam.dates || [])
    .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(String(d)))
    .map(d => new Date(d + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
    .join(', ');
  if (sittings) lines.push('Sittings: ' + sittings);
  if (exam.specUrl) lines.push('Specification: ' + exam.specUrl);
  if (exam.appPath) lines.push('Revise on RA10: https://ra10.co.uk' + exam.appPath);
  lines.push('Generated by RA10 — ra10.co.uk');
  return lines.join('\n');
}

function icsEscape(text) {
  return String(text == null ? '' : text)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n/g, '\n')
    .replace(/\n/g, '\\n');
}

function icsStamp(date) {
  return date.getUTCFullYear()
    + String(date.getUTCMonth() + 1).padStart(2, '0')
    + String(date.getUTCDate()).padStart(2, '0') + 'T'
    + String(date.getUTCHours()).padStart(2, '0')
    + String(date.getUTCMinutes()).padStart(2, '0')
    + String(date.getUTCSeconds()).padStart(2, '0') + 'Z';
}

function examNextDayYmd(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + 1);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function icsEventLines(lines, exam, d, now) {
  const start = String(d).replace(/-/g, '');
  const end = examNextDayYmd(d).replace(/-/g, '');
  lines.push('BEGIN:VEVENT');
  lines.push('UID:ra10-' + exam.id + '-' + start + '@ra10.co.uk');
  lines.push('DTSTAMP:' + icsStamp(now));
  lines.push('DTSTART;VALUE=DATE:' + start);
  lines.push('DTEND;VALUE=DATE:' + end);
  lines.push('SUMMARY:' + icsEscape(examCalendarTitle(exam)));
  lines.push('DESCRIPTION:' + icsEscape(examCalendarDescription(exam)));
  lines.push('END:VEVENT');
}

function buildExamIcs(exam) {
  const now = new Date();
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//RA10//Exam Timetable//EN', 'CALSCALE:GREGORIAN'];
  (exam.dates || []).forEach((d) => { if (/^\d{4}-\d{2}-\d{2}$/.test(String(d))) icsEventLines(lines, exam, d, now); });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function buildTimetableIcs(exams) {
  const now = new Date();
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//RA10//Exam Timetable//EN', 'CALSCALE:GREGORIAN'];
  (exams || []).forEach((exam) => {
    (exam.dates || []).forEach((d) => { if (/^\d{4}-\d{2}-\d{2}$/.test(String(d))) icsEventLines(lines, exam, d, now); });
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function triggerIcsDownload(filename, icsText) {
  const blob = new Blob([icsText], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
}

function downloadExamIcs(examId) {
  const exam = EXAM_DATA.find(e => e.id === examId);
  if (!exam) return;
  triggerIcsDownload('ra10-' + exam.id + '.ics', buildExamIcs(exam));
  showExamToast('Downloaded — open the file to add it to Apple Calendar, Outlook or Google.');
}

function downloadTimetableIcs() {
  const exams = examsFiltered();
  if (!exams.length) { showExamToast('No exams match the current filters.'); return; }
  triggerIcsDownload('ra10-exam-timetable.ics', buildTimetableIcs(exams));
  showExamToast('Timetable downloaded — open the file to add all these exams to your calendar.');
}

function googleCalendarAddUrl(exam, dateStr) {
  const start = String(dateStr).replace(/-/g, '');
  const end = examNextDayYmd(dateStr).replace(/-/g, '');
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: examCalendarTitle(exam),
    dates: start + '/' + end,
    details: examCalendarDescription(exam),
    location: 'RA10 — ra10.co.uk'
  });
  return 'https://calendar.google.com/calendar/render?' + p.toString();
}

function showExamToast(msg) {
  let t = document.getElementById('exam-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'exam-toast';
    t.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(20px);background:var(--color-text);color:var(--color-bg);padding:11px 18px;border-radius:12px;font-size:14px;font-weight:600;z-index:2147483647;opacity:0;transition:opacity .2s,transform .2s;box-shadow:0 12px 32px rgba(0,0,0,.28);max-width:88vw;text-align:center;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(function () { t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)'; });
  clearTimeout(t._hide);
  t._hide = setTimeout(function () { t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(20px)'; }, 2800);
}

function renderExamsPage() {
  const list = document.getElementById('exams-list');
  if (!list) return;

  // Populate subject filter options once.
  const subjectSel = document.getElementById('exams-filter-subject');
  if (subjectSel && subjectSel.options.length <= 1) {
    const subjects = Array.from(new Set(EXAM_DATA.map(e => e.subject))).sort();
    subjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      subjectSel.appendChild(opt);
    });
  }

  const pinned = getPinnedExams();
  const now = new Date();
  const search = (_examsFilter.search || '').toLowerCase();

  const filtered = EXAM_DATA.filter((exam) => {
    if (_examsFilter.board !== 'all' && exam.board !== _examsFilter.board) return false;
    if (_examsFilter.level !== 'all' && exam.level !== _examsFilter.level) return false;
    if (_examsFilter.subject !== 'all' && exam.subject !== _examsFilter.subject) return false;
    if (_examsFilter.pinnedOnly && !pinned.includes(exam.id)) return false;
    if (search && (exam.subject + ' ' + exam.name + ' ' + exam.board).toLowerCase().indexOf(search) === -1) return false;
    return true;
  });

  const withNext = filtered.map((exam) => {
    const upcoming = (exam.dates || []).map(d => new Date(d + 'T09:00:00')).filter(d => d.getTime() >= now.getTime() - 86400000).sort((a, b) => a - b);
    const next = upcoming[0] || new Date((exam.dates || [])[0] + 'T09:00:00');
    return { exam, next };
  });

  // Sort.
  const sort = _examsFilter.sort || 'date';
  withNext.sort((a, b) => {
    if (sort === 'board') return a.exam.board.localeCompare(b.exam.board) || a.next - b.next;
    if (sort === 'subject') return a.exam.subject.localeCompare(b.exam.subject) || a.next - b.next;
    if (sort === 'level') {
      const order = { 'GCSE': 0, 'AS': 1, 'A-Level': 2, 'BTEC': 3 };
      return (order[a.exam.level] || 9) - (order[b.exam.level] || 9) || a.next - b.next;
    }
    return a.next - b.next;
  });

  const summary = document.getElementById('exams-summary');
  if (summary) {
    const pinnedCount = pinned.length;
    const upcomingCount = withNext.filter(x => x.next.getTime() >= now.getTime()).length;
    summary.innerHTML = '<div class="exams-summary-stat"><b>' + EXAM_DATA.length + '</b><span>Total exams</span></div>'
      + '<div class="exams-summary-stat"><b>' + upcomingCount + '</b><span>Upcoming</span></div>'
      + '<div class="exams-summary-stat"><b>' + pinnedCount + '</b><span>Pinned</span></div>';
  }

  if (!withNext.length) {
    list.innerHTML = '<div class="exams-empty">No exams match your filters.</div>';
    return;
  }

  const view = _examsFilter.view || 'calendar';
  const calEl = document.getElementById('exams-calendar');

  if (view === 'calendar') {
    if (calEl) calEl.style.display = '';
    list.style.display = 'none';
    renderExamsCalendar();
    return;
  }

  if (calEl) calEl.style.display = 'none';
  list.style.display = '';
  list.className = 'exams-list ' + (view === 'list' ? 'exams-list-view' : 'exams-grid-view');

  list.innerHTML = withNext.map(({ exam, next }) => {
    const isPinned = pinned.includes(exam.id);
    const diffMs = next.getTime() - now.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    let badge, cls;
    if (days < 0) { badge = 'Done'; cls = ''; }
    else if (days === 0) { badge = 'Today'; cls = 'today'; }
    else if (days <= 7) { badge = days + ' day' + (days === 1 ? '' : 's') + ' to go'; cls = 'soon'; }
    else { badge = days + ' days to go'; cls = ''; }
    const dateStr = next.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
    const allDates = (exam.dates || []).map(d => new Date(d + 'T09:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short' })).join(', ');
    const appLink = exam.appPath ? '<button class="exams-open-app" type="button" onclick="go(\'' + exam.appPath + '\')">Open app</button>' : '';
    const pct = examsProgressPct(next, now);
    const gcalUrl = googleCalendarAddUrl(exam, ymdLocal(next));
    return '<div class="exams-card' + (isPinned ? ' pinned' : '') + '">'
      + '<div class="exams-card-top">'
      +   '<span class="exams-board ' + exam.board.toLowerCase().replace(/\s+/g, '-') + '">' + exam.board + '</span>'
      +   '<span class="exams-level">' + exam.level + '</span>'
      +   '<button class="exams-pin ' + (isPinned ? 'pinned' : '') + '" type="button" title="' + (isPinned ? 'Unpin' : 'Pin') + '" onclick="togglePinnedExam(\'' + exam.id + '\')">' + (isPinned ? '★' : '☆') + '</button>'
      + '</div>'
      + '<div class="exams-card-body">'
      +   '<div class="exams-subject">' + exam.subject + '</div>'
      +   '<div class="exams-name">' + exam.name + '</div>'
      +   '<div class="exams-dates">All sittings: ' + allDates + '</div>'
      + '</div>'
      + '<div class="exams-progress"><div class="exams-progress-track"><span style="width:' + pct + '%"></span></div><span class="exams-progress-label">' + pct + '% of the way there</span></div>'
      + '<div class="exams-card-foot">'
      +   '<span class="exams-countdown ' + cls + '">' + badge + '</span>'
      +   '<span class="exams-next-date">Next: ' + dateStr + '</span>'
      +   appLink
      + '</div>'
      + '<div class="exams-sync">'
      +   '<a class="exams-sync-btn" href="' + gcalUrl + '" target="_blank" rel="noopener">📅 Google Calendar</a>'
      +   '<button class="exams-sync-btn" type="button" onclick="downloadExamIcs(\'' + exam.id + '\')">⤓ Apple / .ics</button>'
      + '</div>'
      + '</div>';
  }).join('');
}

// ---------- Exams calendar ----------
function examsFiltered() {
  const pinned = getPinnedExams();
  const search = (_examsFilter.search || '').toLowerCase();
  return EXAM_DATA.filter((exam) => {
    if (_examsFilter.board !== 'all' && exam.board !== _examsFilter.board) return false;
    if (_examsFilter.level !== 'all' && exam.level !== _examsFilter.level) return false;
    if (_examsFilter.subject !== 'all' && exam.subject !== _examsFilter.subject) return false;
    if (_examsFilter.pinnedOnly && !pinned.includes(exam.id)) return false;
    if (search && (exam.subject + ' ' + exam.name + ' ' + exam.board).toLowerCase().indexOf(search) === -1) return false;
    return true;
  });
}

function examsForDate(ymd) {
  return examsFiltered().filter(exam => (exam.dates || []).includes(ymd));
}

// When the user searches, jump the calendar to the month of the best-matching
// exam's next sitting — even if it's in a different month/year.
function jumpCalendarToSearchMatch() {
  const search = (_examsFilter.search || '').trim().toLowerCase();
  if (!search) {
    // Reset the calendar back to the current month when the search is cleared.
    const now = new Date();
    _examsCalState.year = now.getFullYear();
    _examsCalState.month = now.getMonth();
    return;
  }
  const matches = examsFiltered();
  if (!matches.length) return;
  const now = new Date();
  // Prefer the earliest upcoming sitting among the matches.
  let bestDate = null;
  for (const exam of matches) {
    const upcoming = (exam.dates || [])
      .map(d => new Date(d + 'T09:00:00'))
      .filter(d => d.getTime() >= now.getTime() - 86400000)
      .sort((a, b) => a - b);
    const next = upcoming[0] || new Date((exam.dates || [])[0] + 'T09:00:00');
    if (!bestDate || next < bestDate) bestDate = next;
  }
  if (!bestDate || Number.isNaN(bestDate.getTime())) return;
  _examsCalState.year = bestDate.getFullYear();
  _examsCalState.month = bestDate.getMonth();
}

function ymdLocal(dt) {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

function renderExamsCalendar() {
  const cal = document.getElementById('exams-calendar');
  if (!cal) return;
  const pinned = getPinnedExams();
  const now = new Date();
  const baseYear = _examsCalState.year != null ? _examsCalState.year : now.getFullYear();
  const baseMonth = _examsCalState.month != null ? _examsCalState.month : now.getMonth();
  const first = new Date(baseYear, baseMonth, 1);
  const startDow = first.getDay(); // 0 = Sunday
  const daysInMonth = new Date(baseYear, baseMonth + 1, 0).getDate();
  const daysInPrev = new Date(baseYear, baseMonth, 0).getDate();

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const cells = [];
  // Leading days from previous month
  for (let i = startDow - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const ymd = ymdLocal(new Date(baseYear, baseMonth - 1, d));
    cells.push({ ymd, day: d, other: true });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const ymd = ymdLocal(new Date(baseYear, baseMonth, d));
    cells.push({ ymd, day: d, other: false });
  }
  // Trailing days to complete the grid (multiple of 7)
  let trailing = 1;
  while (cells.length % 7 !== 0) {
    const ymd = ymdLocal(new Date(baseYear, baseMonth + 1, trailing));
    cells.push({ ymd, day: trailing, other: true });
    trailing++;
  }

  const todayYmd = ymdLocal(now);

  const dow = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let html = '<div class="exams-cal-head">'
    + '<div class="exams-cal-nav">'
    +   '<button type="button" onclick="examsCalShift(-1)" aria-label="Previous month">‹</button>'
    +   '<span class="exams-cal-title">' + monthNames[baseMonth] + ' ' + baseYear + '</span>'
    +   '<button type="button" onclick="examsCalShift(1)" aria-label="Next month">›</button>'
    + '</div>'
    + '<button type="button" class="exams-cal-today" onclick="examsCalToday()">Today</button>'
    + '</div>'
    + '<div class="exams-cal-grid">';

  dow.forEach(d => { html += '<div class="exams-cal-dow">' + d + '</div>'; });

  cells.forEach(cell => {
    const exams = examsForDate(cell.ymd);
    const isToday = cell.ymd === todayYmd;
    const dots = exams.slice(0, 4).map(e => {
      const p = pinned.includes(e.id) ? ' pinned' : '';
      return '<span class="exams-cal-dot' + p + '" title="' + e.subject.replace(/"/g, '&quot;') + '"></span>';
    }).join('');
    const more = exams.length > 4 ? '<div class="cal-more">+' + (exams.length - 4) + ' more</div>' : '';
    html += '<div class="exams-cal-day' + (cell.other ? ' other-month' : '') + (isToday ? ' today' : '') + '" data-ymd="' + cell.ymd + '" onclick="openExamDay(\'' + cell.ymd + '\')">'
      +   '<span class="cal-num">' + cell.day + '</span>'
      +   (exams.length ? '<div class="cal-dots">' + dots + '</div>' + more : '')
      + '</div>';
  });

  html += '</div>';
  cal.innerHTML = html;
}

function examsCalShift(delta) {
  const now = new Date();
  const year = _examsCalState.year != null ? _examsCalState.year : now.getFullYear();
  const month = _examsCalState.month != null ? _examsCalState.month : now.getMonth();
  const d = new Date(year, month + delta, 1);
  _examsCalState.year = d.getFullYear();
  _examsCalState.month = d.getMonth();
  renderExamsCalendar();
}

function examsCalToday() {
  const now = new Date();
  _examsCalState.year = now.getFullYear();
  _examsCalState.month = now.getMonth();
  renderExamsCalendar();
}

function openExamDay(ymd) {
  const exams = examsForDate(ymd);
  if (!exams.length) return;
  const overlay = document.getElementById('exam-modal-overlay');
  const content = document.getElementById('exam-modal-content');
  if (!overlay || !content) return;
  const pinned = getPinnedExams();
  const pretty = new Date(ymd + 'T09:00:00').toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const boardSpecBase = {
    'Pearson BTEC': 'https://qualifications.pearson.com/en/qualifications/btec-nationals.html',
    'Edexcel': 'https://qualifications.pearson.com/en/qualifications/edexcel-a-levels.html',
    'AQA': 'https://www.aqa.org.uk/subjects',
    'OCR': 'https://www.ocr.org.uk/qualifications/'
  };

  content.innerHTML = '<div style="margin-bottom:var(--sp3);color:var(--color-text-muted);font-size:var(--tx-sm);">' + pretty + '</div>'
    + exams.map(exam => {
      const boardCls = exam.board.toLowerCase().replace(/\s+/g, '-');
      const isPinned = pinned.includes(exam.id);
      const datesHtml = (exam.dates || []).map(d => {
        const dp = new Date(d + 'T09:00:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
        return '<li><b>' + dp + '</b>' + (d === ymd ? ' <span style="color:var(--color-primary);font-weight:800;">&larr; this sitting</span>' : '') + '</li>';
      }).join('');
      const specUrl = exam.specUrl || boardSpecBase[exam.board] || 'https://qualifications.pearson.com/';
      const specBtn = '<a class="ghost" href="' + specUrl + '" target="_blank" rel="noopener">View exam spec &#8599;</a>';
      const appBtn = exam.appPath ? '<a href="javascript:void(0)" onclick="closeExamModal();go(\'' + exam.appPath + '\')">Open RA10 course</a>' : '';
      const pinBtn = '<button class="ghost" type="button" onclick="togglePinnedExam(\'' + exam.id + '\')">' + (isPinned ? '★ Unpin' : '☆ Pin') + '</button>';
      const calBtn = '<a class="ghost" href="' + googleCalendarAddUrl(exam, ymd) + '" target="_blank" rel="noopener">📅 Google Calendar</a>';
      const icsBtn = '<button class="ghost" type="button" onclick="downloadExamIcs(\'' + exam.id + '\')">⤓ Download .ics</button>';
      return '<div style="margin-bottom:var(--sp6);padding-bottom:var(--sp6);border-bottom:1px solid var(--color-border);">'
        + '<span class="exam-modal-board ' + boardCls + '">' + exam.board + '</span>'
        + '<h3>' + exam.subject + '</h3>'
        + '<p class="exam-modal-name">' + exam.name + '</p>'
        + '<ul class="exam-modal-dates">' + datesHtml + '</ul>'
        + '<div class="exam-modal-actions">' + appBtn + specBtn + pinBtn + calBtn + icsBtn + '</div>'
        + '</div>';
    }).join('');

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeExamModal() {
  const overlay = document.getElementById('exam-modal-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function initHomeReveal() {
  const home = document.getElementById('p-home');
  if (!home) return;
  const targets = home.querySelectorAll('.hm-section, .hm-unit-col, .hm-tile, .hm-cta');
  targets.forEach((el, i) => {
    el.classList.add('hx-reveal');
    if (i % 4) el.setAttribute('data-reveal-delay', String(i % 4));
  });
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(el => io.observe(el));
}

function renderHomeExams() {
  const host = document.getElementById('home-exams-grid');
  if (!host) return;
  const now = new Date();
  const pinned = getPinnedExams();
  // Show the next 6 upcoming exams, pinned ones first.
  const withNext = EXAM_DATA.map((exam) => {
    const upcoming = (exam.dates || []).map(d => new Date(d + 'T09:00:00')).filter(d => d.getTime() >= now.getTime()).sort((a, b) => a - b);
    return { exam, next: upcoming[0] || null };
  }).filter(x => x.next).sort((a, b) => {
    const pa = pinned.includes(a.exam.id) ? 0 : 1;
    const pb = pinned.includes(b.exam.id) ? 0 : 1;
    if (pa !== pb) return pa - pb;
    return a.next - b.next;
  }).slice(0, 6);

  if (!withNext.length) { host.innerHTML = '<div class="hx-exams-empty">No upcoming exams.</div>'; return; }

  host.innerHTML = withNext.map(({ exam, next }) => {
    const isPinned = pinned.includes(exam.id);
    const days = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const pct = examsProgressPct(next, now);
    const dateStr = next.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
    let countCls = '';
    if (days === 0) countCls = 'soon';
    else if (days <= 7) countCls = 'soon';
    const waterLow = pct < 42 ? ' water-low' : '';
    const dayTxt = (days === 0 ? 'Today' : (days === 1 ? '1 day to go' : days + ' days to go'));
    return '<div class="hx-exam-card' + (isPinned ? ' pinned' : '') + '" onclick="go(\'/exams\')">'
      + '<div class="hx-exam-top">'
      +   '<span class="hx-exam-board ' + exam.board.toLowerCase().replace(/\s+/g, '-') + '">' + exam.board + '</span>'
      +   '<button class="hx-exam-pin ' + (isPinned ? 'pinned' : '') + '" type="button" title="' + (isPinned ? 'Unpin' : 'Pin') + '" onclick="event.stopPropagation();togglePinnedExam(\'' + exam.id + '\')">' + (isPinned ? '★' : '☆') + '</button>'
      + '</div>'
      + '<div class="hx-exam-subject">' + exam.subject + '</div>'
      + '<div class="hx-exam-name">' + exam.name + '</div>'
      + '<div class="hx-exam-count ' + countCls + waterLow + '">'
      +   '<div class="hx-exam-water" style="height:' + pct + '%"></div>'
      +   '<div class="hx-exam-count-inner">'
      +     '<span class="hx-exam-count-num">' + days + '</span>'
      +     '<span class="hx-exam-count-txt">' + dayTxt + '</span>'
      +   '</div>'
      + '</div>'
      + '<div class="hx-exam-foot">'
      +   '<span class="hx-exam-dot"></span><span class="hx-exam-date">' + dateStr + '</span>'
      + (isPinned ? '<span class="hx-exam-pinned-tag">Pinned</span>' : '')
      + '</div>'
      + '</div>';
  }).join('');
}

function bindExamsFilters() {
  const board = document.getElementById('exams-filter-board');
  const level = document.getElementById('exams-filter-level');
  const subject = document.getElementById('exams-filter-subject');
  const pinnedBtn = document.getElementById('exams-filter-pinned');
  const search = document.getElementById('exams-search-input');
  const sort = document.getElementById('exams-sort');
  const viewGrid = document.getElementById('exams-view-grid');
  const viewList = document.getElementById('exams-view-list');
  const viewCalendar = document.getElementById('exams-view-calendar');
  if (board) board.addEventListener('change', () => { _examsFilter.board = board.value; renderExamsPage(); });
  if (level) level.addEventListener('change', () => { _examsFilter.level = level.value; renderExamsPage(); });
  if (subject) subject.addEventListener('change', () => { _examsFilter.subject = subject.value; renderExamsPage(); });
  if (pinnedBtn) pinnedBtn.addEventListener('click', () => { _examsFilter.pinnedOnly = !_examsFilter.pinnedOnly; pinnedBtn.classList.toggle('active', _examsFilter.pinnedOnly); renderExamsPage(); });
  if (search) search.addEventListener('input', () => {
    _examsFilter.search = search.value;
    jumpCalendarToSearchMatch();
    renderExamsPage();
  });
  if (sort) sort.addEventListener('change', () => { _examsFilter.sort = sort.value; renderExamsPage(); });
  const viewBtns = [viewCalendar, viewGrid, viewList].filter(Boolean);
  function setView(v) {
    _examsFilter.view = v;
    viewBtns.forEach(b => b.classList.toggle('active', b.dataset.view === v));
    renderExamsPage();
  }
  if (viewCalendar) viewCalendar.addEventListener('click', () => setView('calendar'));
  if (viewGrid) viewGrid.addEventListener('click', () => setView('grid'));
  if (viewList) viewList.addEventListener('click', () => setView('list'));
  // Mark data-view attributes on buttons for toggling.
  if (viewCalendar) viewCalendar.dataset.view = 'calendar';
  if (viewGrid) viewGrid.dataset.view = 'grid';
  if (viewList) viewList.dataset.view = 'list';

  const modalOverlay = document.getElementById('exam-modal-overlay');
  const modalClose = document.getElementById('exam-modal-close');
  if (modalClose) modalClose.addEventListener('click', closeExamModal);
  if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeExamModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeExamModal(); });

  const exportIcs = document.getElementById('exams-export-ics');
  if (exportIcs) exportIcs.addEventListener('click', downloadTimetableIcs);
}

// Exam dates from the Pearson BTEC 2027 timetables (winter + summer).
// Each subject lists its winter and summer sittings; the next upcoming one is shown.
const EXAM_TIMES = [
  { subject: 'IT AAQ Unit 1', board: 'Pearson BTEC', dates: ['2027-01-08', '2027-05-14'], note: 'Information Technology Systems' },
  { subject: 'IT AAQ Unit 2', board: 'Pearson BTEC', dates: ['2027-01-12', '2027-05-05'], note: 'Cyber Security & Incident Management' },
  { subject: 'Business Unit 3', board: 'Pearson BTEC', dates: ['2027-01-18', '2027-05-11'], note: 'Business Decision Making' },
  { subject: 'Sport Unit 1', board: 'Pearson BTEC', dates: ['2027-01-06', '2027-04-29'], note: 'Fitness Training & Programming' },
  { subject: 'IT Level 2 Unit 2', board: 'Pearson BTEC', dates: ['2027-02-01', '2027-06-07'], note: 'IT Service Solutions' },
  { subject: 'GCSE Maths', board: 'AQA', dates: ['2027-05-14', '2027-05-27', '2027-06-14'], note: 'Mathematics (8300)' },
  { subject: 'A-Level Business (7132)', board: 'AQA', dates: ['2027-06-02'], note: 'Paper 1-3' }
];

function renderExamTimes() {
  const host = document.getElementById('signed-in-exams');
  if (!host) return;
  const list = sdUpcomingExams().slice(0, 5);
  host.innerHTML = list.length ? list.map(x => {
    const cls = x.days <= 7 ? 'soon' : x.days <= 30 ? 'near' : '';
    return '<div class="sd-exam"><div class="sd-exam-date"><b>' + x.date.getDate() + '</b><span>' + x.date.toLocaleDateString(undefined, { month: 'short' }) + '</span></div>'
      + '<div class="sd-exam-copy"><strong>' + x.subject + '</strong><small>' + x.exam.board + ' · ' + (x.exam.name || '') + '</small></div>'
      + '<span class="sd-exam-days ' + cls + '">' + (x.days === 0 ? 'Today' : x.days + 'd') + '</span></div>';
  }).join('') : '<p class="sd-empty">No upcoming exams.</p>';
}

const LEGAL_ROUTES = { '/terms': 'terms', '/privacy': 'privacy', '/cookies': 'cookies', '/accessibility': 'accessibility' };
let _routeAnnounceReady = false;

function ra10SkipToMain(event) {
  if (event) event.preventDefault();
  const target = document.querySelector('.page.active') || document.querySelector('.page');
  if (target) {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus();
    target.scrollIntoView();
  }
  return false;
}

function route(){
  closeMobileSubjectSheet();
  document.body.classList.remove('iframe-fullscreen-mode');
  document.body.classList.remove('unit-shell-mode');
  const rawPath = ra10Route() || '/';
  const path = rawPath.split('?')[0] || '/';
  if (LEGAL_ROUTES[path]) {
    location.replace('legal/' + LEGAL_ROUTES[path] + '.html');
    return;
  }
  if (path === '/accept-terms') {
    history.replaceState(null, '', '/');
    route();
    setTimeout(() => { if (window.RA10Onboarding) RA10Onboarding.openTerms({}); }, 800);
    return;
  }
  // Unknown paths get the 404 page (the home page only for '/').
  const id   = ROUTES[path] || (path === '/' || path === '' ? 'p-home' : 'p-notfound');
  if (id === 'p-notfound') {
    const np = document.getElementById('nf-path');
    if (np) np.textContent = location.pathname;
    document.title = 'Page not found \u00b7 RA10';
  }
  document.querySelectorAll('.page').forEach(p=>{ p.classList.remove('active'); p.removeAttribute('role'); });
  const el = document.getElementById(id);
  if(el){
    el.classList.add('active');
    el.setAttribute('role', 'main');
    window.scrollTo(0,0);
    if (_routeAnnounceReady && window.RA10A11y) {
      const heading = el.querySelector('h1, h2');
      const label = heading ? heading.textContent.trim().replace(/\s+/g, ' ') : 'RA10';
      RA10A11y.announce(label + ' page');
    }
    _routeAnnounceReady = true;
  }
  recordRecentApp(path);
  if (id === 'p-home') {
    renderSignedInDashboard();
    renderHomeExams();
  }
  if (id === 'p-tasks') {
    renderGlobalTasksPage();
  }
  if (id === 'p-exams') {
    renderExamsPage();
    bindExamsFilters();
  }
  if (id === 'p-community') {
    renderCommunityPage();
  } else if (_communityJobsPoller) {
    clearInterval(_communityJobsPoller);
    _communityJobsPoller = null;
  }
  if (id === 'p-leaderboard') {
    const tableEl = document.getElementById('lb-table');
    const loadingEl = document.getElementById('lb-loading');
    const myRankEl = document.getElementById('lb-my-rank');
    if (tableEl) {
      tableEl.style.display = 'none';
      tableEl.innerHTML = '';
    }
    if (myRankEl) myRankEl.innerHTML = '';
    if (loadingEl) {
      loadingEl.style.display = 'block';
      loadingEl.innerHTML = '<div class="page-skel" aria-hidden="true"><i class="ps-hero"></i><div class="ps-podium"><i></i><i class="tall"></i><i></i></div><i class="ps-row"></i><i class="ps-row"></i><i class="ps-row"></i><i class="ps-row"></i><i class="ps-row"></i></div><span class="lb-visually-hidden">Loading leaderboard…</span>';
    }
    setTimeout(renderLeaderboard, 40);
  }
  // Auto-fullscreen for iframe pages (breadcrumb stays visible via CSS)
  if(el && el.classList.contains('page-iframe')){
    document.body.classList.add('unit-shell-mode');
    document.body.classList.add('iframe-fullscreen-mode');
  }
  measureShellChrome();
  if (el && el.classList.contains('page-iframe')) setUnitSectionLabel('Dashboard');
  if (el && el.classList.contains('page-iframe')) showUnitSkeleton(el);
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => btn.classList.remove('active'));
  for(const [prefix,key] of Object.entries(NAV_MAP)){
    const pre = prefix.charAt(0) === '/' ? prefix : '/' + prefix;
    if(pre === '/' ? path === '/' : path.startsWith(pre)){
      const nl = document.querySelector(`[data-nav="${key}"]`);
      if(nl) nl.classList.add('active');
      break;
    }
  }
  const mobileKey = path === '/' || path === '' ? 'home'
    : path.startsWith('/exams') ? 'exams'
    : path.startsWith('/tasks') ? 'tasks'
    : path.startsWith('/revision') || path.startsWith('/revision/btec/level-3/') ? 'subjects'
    : path.startsWith('leaderboard') ? 'leaderboard'
    : path.startsWith('/community') ? 'community'
    : path.startsWith('/account') || path.startsWith('/upgrade') || path.startsWith('/news') ? 'you'
    : '';
  if (mobileKey) {
    const mobileBtn = document.querySelector(`[data-mobile-nav="${mobileKey}"]`);
    if (mobileBtn) mobileBtn.classList.add('active');
  }
  positionMobileDockBlob();

  const revPreview = document.getElementById('rev-preview');
  const lbPreview = document.getElementById('lb-preview');
  const revWrap = document.getElementById('nav-rev-wrap');
  const lbWrap = document.getElementById('nav-lb-wrap');
  hideAccountDropdown(true);
  if (revPreview) revPreview.style.display = 'none';
  if (lbPreview) lbPreview.style.display = 'none';
  if (revWrap) revWrap.classList.remove('open');
  if (lbWrap) lbWrap.classList.remove('open');

  syncMobileNavChrome();
  document.documentElement.classList.remove('route-pending');
  try { window.dispatchEvent(new Event('ra10:route')); } catch (e) {}
}

function setPriceSnapshotView(mode, trigger) {
  const root = document.getElementById('home-price-visual');
  if (!root) return;

  const labelMap = {
    all: 'Lower is better',
    seneca: 'Showing RA10 vs Seneca',
    'sme-low': 'Showing RA10 vs Save My Exams',
  };

  root.querySelectorAll('[data-snapshot-view]').forEach(function(btn) {
    const active = btn.getAttribute('data-snapshot-view') === mode;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  root.querySelectorAll('.price-bar-row[data-snapshot-key]').forEach(function(row) {
    const key = row.getAttribute('data-snapshot-key');
    const isRa10 = key === 'ra10-pro' || key === 'ra10-ultra';
    const show = isRa10 || mode === 'all' || key === mode;
    row.style.display = show ? '' : 'none';
  });

  const label = root.querySelector('[data-snapshot-label]');
  if (label) label.textContent = labelMap[mode] || labelMap.all;

  if (trigger && typeof trigger.blur === 'function') trigger.blur();
}

window.addEventListener('popstate', route);
window.addEventListener('hashchange', function () {
  const h = location.hash || '';
  if (/^#\//.test(h) && !/access_token=|type=recovery|type=invite/.test(h)) {
    const r = h.slice(1);
    const qi = r.indexOf('?');
    history.replaceState(null, '', toPublicPath(qi >= 0 ? r.slice(0, qi) : r) + (qi >= 0 ? r.slice(qi) : ''));
    route();
  }
});
window.addEventListener('resize', () => {
  syncMobileNavChrome();
  syncDockPebbles();
  positionMobileDockBlob();
});
window.addEventListener('orientationchange', () => {
  syncMobileNavChrome();
  syncDockPebbles();
  positionMobileDockBlob();
});

async function waitForRA10Sdk(timeoutMs) {
  if (window.RA10) return window.RA10;
  const ready = window.__ra10SdkReady;
  if (!ready || typeof ready.then !== 'function') {
    throw new Error('RA10 SDK loader unavailable');
  }
  const timeout = Number(timeoutMs || 0);
  if (!timeout || timeout < 1) {
    await ready;
  } else {
    await Promise.race([
      ready,
      new Promise((_, reject) => setTimeout(() => reject(new Error('RA10 SDK timeout')), timeout)),
    ]);
  }
  if (!window.RA10) throw new Error('RA10 SDK unavailable');
  return window.RA10;
}

  let authRestorePending = true;
  // Declared before DOMContentLoaded: these are read by code that can run
  // before the handler reaches their original position (temporal dead zone).
  const TRANSITION_POPUP_SEEN_KEY = 'ra10_transition_popup_seen_v1';
  const SITE_ANNOUNCEMENT_DISMISS_KEY = 'ra10-site-announcement-dismiss-v1';

  document.addEventListener('DOMContentLoaded', async () => {
    route();
    syncMobileNavChrome();
    refreshSiteAnnouncement({ silent: true });
    startSiteAnnouncementRefreshLoop();
    bindDesktopHoverPreviews();
    bindContactModal();
    setPriceSnapshotView('all');
    updateLeaderboardCountdown();
    setInterval(updateLeaderboardCountdown, 1000);
    initHomeReveal();
    applyMobileDockOrder();
    initDockReorder();
    initDockLiquidPress();
    requestAnimationFrame(() => {
      syncDockPebbles();
      positionMobileDockBlob();
    });

    let uiHandlersBound = false;
    function bindUiEventHandlers() {
      if (uiHandlersBound) return;
      uiHandlersBound = true;

      const navAuthBtn = document.getElementById('nav-auth-btn');
      if (navAuthBtn) {
        navAuthBtn.addEventListener('click', () => openAuthModal('signin'));
      }
      document.getElementById('mobile-profile-btn')?.addEventListener('click', () => {
        if (window.RA10 && RA10.isLoggedIn()) go('/account');
        else openAuthModal('signin');
      });
      document.getElementById('mobile-you-btn')?.addEventListener('click', (event) => {
        event.preventDefault();
        if (document.body.classList.contains('mobile-you-open')) closeMobileYouSheet();
        else openMobileYouSheet();
      });
      document.getElementById('mobile-subjects-btn')?.addEventListener('click', (event) => {
        event.preventDefault();
        if (document.body.classList.contains('mobile-sheet-open')) closeMobileSubjectSheet();
        else openMobileSubjectSheet();
      });
      document.getElementById('mobile-sheet-backdrop')?.addEventListener('click', () => {
        closeMobileSubjectSheet();
        closeMobileYouSheet();
      });
      document.getElementById('mobile-sheet-close')?.addEventListener('click', closeMobileSubjectSheet);
      document.getElementById('mobile-you-close')?.addEventListener('click', closeMobileYouSheet);
      document.getElementById('site-announcement-close')?.addEventListener('click', () => {
        dismissAnnouncement(_siteAnnouncementData);
        renderSiteAnnouncement(null);
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          if (document.body.classList.contains('mobile-sheet-open')) closeMobileSubjectSheet();
          if (document.body.classList.contains('mobile-you-open')) closeMobileYouSheet();
        }
      });

      document.querySelectorAll('[data-mobile-subject]').forEach(button => {
        button.addEventListener('click', () => {
          closeMobileSubjectSheet();
          go(button.dataset.mobileSubject);
        });
      });
      document.querySelectorAll('[data-mobile-you]').forEach(button => {
        button.addEventListener('click', () => {
          closeMobileYouSheet();
          const path = button.dataset.mobileYou;
          if (path === '/account') { openAccountOrSignIn(); return; }
          go(path);
        });
      });
      document.getElementById('mobile-you-signout')?.addEventListener('click', async () => {
        closeMobileYouSheet();
        if (window.RA10 && RA10.signOut) await RA10.signOut();
        go('/');
      });
      document.getElementById('mobile-you-edit')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (document.body.classList.contains('mobile-dock-edit')) exitDockEdit();
        else enterDockEdit();
      });
      document.getElementById('auth-close')?.addEventListener('click', closeAuthModal);
      document.getElementById('auth-overlay')?.addEventListener('click', e => { if (e.target === document.getElementById('auth-overlay')) closeAuthModal(); });
      document.getElementById('tab-signin')?.addEventListener('click', () => switchAuthTab('signin'));
      document.getElementById('tab-signup')?.addEventListener('click', () => switchAuthTab('signup'));
      document.getElementById('forgot-link')?.addEventListener('click', () => switchAuthTab('forgot'));
      document.getElementById('back-to-signin')?.addEventListener('click', () => switchAuthTab('signin'));

      const runSignIn = async () => {
        const btn = document.getElementById('signin-btn');
        const err = document.getElementById('signin-error');
        if (!btn || !err) return;
        err.classList.remove('show');
        btn.disabled = true;
        btn.textContent = 'Signing in…';
        try {
          const ra10 = await waitForRA10Sdk(8000);
          const { error } = await RA10.signIn(
            document.getElementById('signin-email').value,
            document.getElementById('signin-password').value
          );
          if (error) {
            err.textContent = error.message || 'Could not sign in. Please try again.';
            err.classList.add('show');
          } else {
            closeAuthModal();
            try { await ra10.refreshProfile(); } catch (e) {}
            await _updateNavAuth();
          }
        } catch (signInErr) {
          err.textContent = (signInErr && signInErr.message) ? signInErr.message : 'Could not sign in. Please try again.';
          err.classList.add('show');
        } finally {
          authRestorePending = false;
          btn.disabled = false;
          btn.textContent = 'Sign in';
          _updateNavAuth();
        }
      };

      document.getElementById('panel-signin')?.addEventListener('submit', async (event) => {
        event.preventDefault();
        await runSignIn();
      });
      document.getElementById('signin-btn')?.addEventListener('click', async (event) => {
        event.preventDefault();
        await runSignIn();
      });
    }

    bindUiEventHandlers();

    _updateNavAuth();

    let ra10;
    try {
      ra10 = await waitForRA10Sdk(6000);
    } catch (sdkErr) {
      console.warn('RA10 SDK failed to load', sdkErr);
      authRestorePending = false;
      _updateNavAuth();
      return;
    }

    const initPromise = ra10.init();
    try {
      await Promise.race([
        initPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Auth init timeout')), 8000)),
      ]);
    } catch (initErr) {
      console.warn('RA10 auth init failed', initErr);
    } finally {
      authRestorePending = false;
    }

    // Handle Supabase email callback (invite or password reset)
    // Supabase appends tokens as a second hash fragment, e.g.
    //   https://ra10.co.uk/#/auth#access_token=...&type=recovery
    // so we must parse the LAST hash fragment, not the route hash.
    const fullHash = window.location.hash || '';
    const lastHashIdx = fullHash.lastIndexOf('#');
    const tokenFragment = lastHashIdx > 0 ? fullHash.slice(lastHashIdx + 1) : fullHash.slice(1);
    const hashParams = new URLSearchParams(tokenFragment);
    const cbToken = hashParams.get('access_token');
    const cbType = hashParams.get('type');
    if (cbToken && (cbType === 'invite' || cbType === 'recovery')) {
      // Establish the recovery/invite session from the URL tokens BEFORE
      // clearing the URL, so updateUser has a valid session.
      try {
        const rec = await RA10.handleRecoveryTokens();
        if (!rec.ok) {
          console.warn('Recovery session exchange failed', rec.error || rec.reason);
        }
      } catch (e) {
        console.warn('Recovery session exchange error', e);
      }
      history.replaceState(null, '', window.location.pathname);
      setTimeout(() => {
        document.getElementById('set-password-overlay').classList.add('open');
      }, 400);
    }

    _updateNavAuth();
    applyTransitionModeUi();

   ra10.on('authchange', () => {
     _updateNavAuth();
     renderSignedInDashboard();
     updateTransitionSignInActions();
   });
  ra10.on('creditschange', _updateNavAuth);

    let focusRefreshInFlight = false;
    window.addEventListener('focus', async () => {
      if (!ra10.isLoggedIn() || focusRefreshInFlight) return;
      focusRefreshInFlight = true;
      try {
        await ra10.refreshProfile();
        _updateNavAuth();
      } catch (e) {
        console.warn('Profile refresh on focus failed', e);
      } finally {
        focusRefreshInFlight = false;
      }
    });

    let schoolSubLookupSeq = 0;
    let stripeBillingLookupSeq = 0;
    let stripeBillingCache = { key: '', ts: 0, data: null };
    let billingReconcileInFlight = false;
    let navSyncRefreshTimer = null;
    const SUBSCRIPTION_SYNC_KEY = 'ra10:subscription-sync-until';
    const SCHOOL_CANCEL_NOTICE_KEY = 'ra10:school-cancel-notice';

    function setSubscriptionSyncWindow(ms) {
      const duration = Math.max(0, Number(ms || 0));
      const until = Date.now() + duration;
      try {
        localStorage.setItem(SUBSCRIPTION_SYNC_KEY, String(until));
      } catch (e) {}
      return until;
    }

    function getSubscriptionSyncUntil() {
      try {
        const raw = localStorage.getItem(SUBSCRIPTION_SYNC_KEY);
        const val = Number(raw || 0);
        return Number.isFinite(val) ? val : 0;
      } catch (e) {
        return 0;
      }
    }

    function isRecurringPaidTier(tier) {
      return tier === 'all_subjects' || tier === 'ultra' || tier === 'school_admin' || tier === 'owner';
    }

    async function getStripeBillingMeta(profile, tier) {
      if (!profile || !isRecurringPaidTier(tier)) return null;
      const session = RA10.getSession ? RA10.getSession() : null;
      const token = session && session.access_token ? session.access_token : '';
      if (!token) return null;

      const cacheKey = String(profile.id || '') + ':' + String(tier || '') + ':' + String(profile.email || '');
      const now = Date.now();
      if (stripeBillingCache.key === cacheKey && stripeBillingCache.data && (now - stripeBillingCache.ts) < 60000) {
        return stripeBillingCache.data;
      }

      try {
        const res = await fetch('https://tcrrgsylxbyyrmnouihl.supabase.co/functions/v1/billing-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({})
        });
        if (!res.ok) return null;
        const payload = await res.json();
        const data = payload && payload.billing ? payload.billing : null;
        stripeBillingCache = { key: cacheKey, ts: Date.now(), data };
        return data;
      } catch (e) {
        return null;
      }
    }

    async function getSchoolSubscriptionMeta(profile, tier) {
      if (!window.supabase || !profile || tier !== 'school_admin') return null;
      const session = RA10.getSession ? RA10.getSession() : null;
      const token = session && session.access_token ? session.access_token : null;
      if (!token) return null;

      try {
        const sb = window.supabase.createClient(
          'https://tcrrgsylxbyyrmnouihl.supabase.co',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyMTEsImV4cCI6MjA5MzQ2MTIxMX0.eOp6ma-mfgh8F20nM7E2OaBW28LlZlwuEEWr6k2zDWw',
          { global: { headers: { Authorization: 'Bearer ' + token } } }
        );

        let schoolRes = null;
        if (profile.school_id) {
          schoolRes = await sb.from('schools').select('*').eq('id', profile.school_id).maybeSingle();
        } else {
          schoolRes = await sb.from('schools').select('*').eq('owner_id', profile.id).limit(1).maybeSingle();
        }
        if (schoolRes && !schoolRes.error && schoolRes.data) return schoolRes.data;
      } catch (e) {
        console.warn('School subscription lookup failed', e);
      }
      return null;
    }

    function getSchoolRenewalDate(schoolRow) {
      if (!schoolRow) return null;
      const candidates = [
        schoolRow.subscription_renewal,
        schoolRow.renews_at,
        schoolRow.current_period_end,
        schoolRow.current_period_ends_at,
        schoolRow.subscription_ends_at,
        schoolRow.subscription_end_at,
        schoolRow.ends_at
      ];
      for (const raw of candidates) {
        if (!raw) continue;
        let val = raw;
        if (typeof raw === 'string' && /^\d+$/.test(raw)) {
          val = Number(raw);
        }
        if (typeof val === 'number' && Number.isFinite(val)) {
          const ms = val < 1000000000000 ? val * 1000 : val;
          const d = new Date(ms);
          if (!Number.isNaN(d.getTime())) return d;
          continue;
        }
        const d = new Date(val);
        if (!Number.isNaN(d.getTime())) return d;
      }
      return null;
    }

    function isSchoolSubscriptionActive(schoolRow) {
      const status = String((schoolRow && schoolRow.subscription_status) || '').trim().toLowerCase();
      if (!status) return true;
      if (status === 'active' || status === 'trialing' || status === 'trial' || status === 'paid') {
        return true;
      }
      const renewalAt = getSchoolRenewalDate(schoolRow);
      const hasFutureEndDate = renewalAt && renewalAt.getTime() > Date.now();
      if ((status === 'cancelled' || status === 'canceled' || status === 'cancel_at_period_end') && hasFutureEndDate) {
        return true;
      }
      return false;
    }

    function renderAccountCreditLog() {
      const host = document.getElementById('account-credit-log');
      if (!host) return;
      if (!window.RA10 || typeof RA10.getCreditActivity !== 'function' || !RA10.isLoggedIn()) {
        host.innerHTML = '<div class="credit-log-note">Sign in to view your credit history.</div>';
        return;
      }
      const entries = RA10.getCreditActivity(50) || [];
      if (!entries.length) {
        host.innerHTML = '<div class="credit-log-note">No recent credit activity yet.</div>';
        return;
      }
      const creditBreakdown = (typeof RA10.getCreditBreakdown === 'function') ? RA10.getCreditBreakdown() : null;
      const currentTotal = creditBreakdown && Number.isFinite(creditBreakdown.totalCredits)
        ? Number(creditBreakdown.totalCredits)
        : NaN;
      let runningDeltaFromCurrent = 0;
      host.innerHTML = entries.map((entry) => {
        const amount = Number(entry.amount || 0);
        const cls = amount < 0 ? 'spend' : 'gain';
        const sign = amount > 0 ? '+' : '';
        const dt = new Date(Number(entry.ts || Date.now()));
        const timeText = Number.isNaN(dt.getTime()) ? 'Just now' : dt.toLocaleString('en-GB', {
          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
        });
        // Show source and note clearly
        let sourceLabel = '';
        if (entry.source === 'exam_season_bonus') sourceLabel = 'Exam season bonus';
        else if (entry.source === 'stored_credits') sourceLabel = 'Account credits';
        else if (entry.source === 'credit_award') sourceLabel = 'Awarded';
        else if (entry.source === 'plan_credits') sourceLabel = 'Plan credits';
        else if (entry.source === 'plan_renewal') sourceLabel = 'Plan renewal';
        else if (entry.source === 'subject_purchase') sourceLabel = 'Subject purchase';
        else if (entry.source) sourceLabel = entry.source.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const actionText = entry.action ? (' (' + String(entry.action) + ')') : '';
        const note = (sourceLabel ? `<strong>${sourceLabel}</strong>: ` : '') + String(entry.note || actionText);
        // Show running balance after this entry
        let balanceText = '';
        const canReconstruct = Number.isFinite(currentTotal);
        const reconstructedAfter = canReconstruct ? (currentTotal - runningDeltaFromCurrent) : NaN;
        const fallbackAfter = Number(entry.balanceAfter);
        const displayAfter = Number.isFinite(reconstructedAfter)
          ? reconstructedAfter
          : (Number.isFinite(fallbackAfter) ? fallbackAfter : NaN);
        if (Number.isFinite(displayAfter)) {
          balanceText = `<span class="credit-log-balance">Balance after: <strong>${Math.max(0, Math.floor(displayAfter))}</strong></span>`;
        }
        runningDeltaFromCurrent += amount;
        return ''
          + '<div class="credit-log-item">'
          +   '<div class="credit-log-main">'
          +     '<div class="credit-log-note">' + note + '</div>'
          +     '<div class="credit-log-time">' + timeText + '</div>'
          +     (balanceText ? '<div class="credit-log-balance-row">' + balanceText + '</div>' : '')
          +   '</div>'
          +   '<div class="credit-log-amt ' + cls + '">' + sign + amount + '</div>'
          + '</div>';
      }).join('');
    }

    async function _updateNavAuth() {
      const navAuthBtn = document.getElementById('nav-auth-btn');
      const navUserWrap = document.getElementById('nav-user-wrap');
      const mobileProfileLabel = document.getElementById('mobile-profile-label');
      const navCreditChip = document.getElementById('nav-credit-chip');
      const mobileCreditChip = document.getElementById('mobile-credit-chip');
      const mobileUpgradeBtn = document.getElementById('mobile-upgrade-btn');
      const examBanner = document.getElementById('exam-banner');
      const navUpgradeBtn = document.getElementById('nav-upgrade-btn');
      const dropdownUpgrade = document.getElementById('dropdown-upgrade');
      const mobileYouUpgrade = document.getElementById('mobile-you-upgrade');
      const transitionMode = !!(window.RA10 && window.RA10._raw && window.RA10._raw.TRANSITION_MODE);
      if (transitionMode) {
        if (navUpgradeBtn) navUpgradeBtn.style.display = 'none';
        if (dropdownUpgrade) dropdownUpgrade.style.display = 'none';
        if (mobileUpgradeBtn) mobileUpgradeBtn.style.display = 'none';
        if (mobileYouUpgrade) mobileYouUpgrade.style.display = 'none';
      }

      if (authRestorePending) {
        if (navAuthBtn) {
          navAuthBtn.style.display = '';
          navAuthBtn.textContent = 'Sign in';
          navAuthBtn.disabled = false;
        }
        if (navUserWrap) navUserWrap.style.display = 'none';
        if (mobileProfileLabel) mobileProfileLabel.textContent = 'More';
        const mobileYouSignout = document.getElementById('mobile-you-signout');
        if (mobileYouSignout) mobileYouSignout.style.display = 'none';
        if (navCreditChip) navCreditChip.style.display = 'none';
        if (mobileCreditChip) mobileCreditChip.style.display = 'none';
        if (mobileUpgradeBtn) mobileUpgradeBtn.style.display = transitionMode ? 'none' : 'inline-flex';
        if (examBanner) examBanner.style.display = '';
        return;
      }

      if (!window.RA10) {
        if (navAuthBtn) {
          navAuthBtn.style.display = '';
          navAuthBtn.textContent = 'Sign in';
          navAuthBtn.disabled = false;
        }
        if (navUserWrap) navUserWrap.style.display = 'none';
        if (mobileProfileLabel) mobileProfileLabel.textContent = 'More';
        const mobileYouSignout2 = document.getElementById('mobile-you-signout');
        if (mobileYouSignout2) mobileYouSignout2.style.display = 'none';
        if (navCreditChip) navCreditChip.style.display = 'none';
        if (mobileCreditChip) mobileCreditChip.style.display = 'none';
        if (mobileUpgradeBtn) mobileUpgradeBtn.style.display = transitionMode ? 'none' : 'inline-flex';
        if (examBanner) examBanner.style.display = '';
        return;
      }

      const loggedIn = RA10.isLoggedIn();
      const profile = RA10.getProfile();
      const tier = RA10.getTier();
      if (navAuthBtn) {
        navAuthBtn.style.display = loggedIn ? 'none' : '';
        navAuthBtn.textContent = 'Sign in';
        navAuthBtn.disabled = false;
      }
      if (navUserWrap) navUserWrap.style.display = loggedIn ? '' : 'none';
      if (transitionMode) {
        if (navUpgradeBtn) navUpgradeBtn.style.display = 'none';
        if (mobileUpgradeBtn) mobileUpgradeBtn.style.display = 'none';
      } else {
        if (navUpgradeBtn) navUpgradeBtn.style.display = (!loggedIn || !tier || tier === 'free') ? 'inline-flex' : 'none';
        if (mobileUpgradeBtn) mobileUpgradeBtn.style.display = (!loggedIn || !tier || tier === 'free') ? 'inline-flex' : 'none';
      }
      if (examBanner) {
        const isFreeOrSignedOut = !loggedIn || tier === 'free';
        examBanner.style.display = isFreeOrSignedOut ? '' : 'none';
      }
      if (navCreditChip) navCreditChip.style.display = loggedIn ? '' : 'none';
      if (mobileCreditChip) mobileCreditChip.style.display = loggedIn ? '' : 'none';
      const mobileYouSignout = document.getElementById('mobile-you-signout');
      if (mobileYouSignout) mobileYouSignout.style.display = loggedIn ? '' : 'none';
      const mobileYouAccountLabel = document.getElementById('mobile-you-account-label');
      if (mobileYouAccountLabel) mobileYouAccountLabel.textContent = loggedIn ? 'My Account' : 'Sign in';
      updateYouAccountIcon(loggedIn ? profile : null);
      renderCircleAvatar(document.getElementById('nav-avatar-initials'), '', '?');
      if (loggedIn && profile) {
        const initials = (profile.display_name || profile.email || '?').slice(0,2).toUpperCase();
        const profilePicUrl = getProfilePictureUrl(profile);
        renderCircleAvatar(document.getElementById('nav-avatar-initials'), profilePicUrl, initials);
        document.getElementById('nav-display-name').textContent = profile.display_name || profile.email;
        document.getElementById('dropdown-email').textContent = profile.email;
        const badge = document.getElementById('nav-tier-badge');
        badge.textContent = RA10.getTierInfo().label;
        badge.className = 'nav-tier-badge ' + RA10.getTier();
        const syncUntil = getSubscriptionSyncUntil();
        const inSyncWindow = syncUntil > Date.now();
        if (inSyncWindow && RA10.getTier() === 'free') {
          badge.textContent = 'Syncing subscription...';
          badge.className = 'nav-tier-badge pro';
          if (!navSyncRefreshTimer) {
            navSyncRefreshTimer = setTimeout(async () => {
              navSyncRefreshTimer = null;
              try {
                await RA10.refreshProfile();
              } catch (e) {}
              _updateNavAuth();
            }, 1500);
          }
        }
        if (isRecurringPaidTier(RA10.getTier())) {
          const billingMetaForNav = await getStripeBillingMeta(profile, RA10.getTier());
          const navBillingStatus = String((billingMetaForNav && billingMetaForNav.status) || '').toLowerCase();
          if (navBillingStatus === 'canceled' || navBillingStatus === 'incomplete_expired') {
            try {
              await RA10.refreshProfile();
            } catch (e) {}
            try {
              localStorage.removeItem(SUBSCRIPTION_SYNC_KEY);
            } catch (e) {}
            badge.textContent = 'Free';
            badge.className = 'nav-tier-badge free';
          }
        }
        const tierMap = {
          free:'free',
          subject:'subject',
          all_subjects:'pro',
          ultra:'ultra',
          school_admin:'edu',
          school_teacher:'edu',
          school_student:'edu',
          owner:'ultra'
        };
        const currentPlan = tierMap[RA10.getTier()] || 'free';
        ['free','pro','ultra','edu','one-time-it','one-time-business','one-time-sport'].forEach(p => {
          const badge = document.getElementById('badge-' + p);
          const card = document.getElementById('plan-' + p);
          if (badge) badge.style.display = 'none';
          if (card) card.style.outline = '';
        });
        if (currentPlan === 'subject') {
          const unlocked = Array.isArray(profile?.unlocked_subjects) ? profile.unlocked_subjects : [];
          const owns = {
            'one-time-it': unlocked.includes('IT'),
            'one-time-business': unlocked.includes('Business'),
            'one-time-sport': unlocked.includes('Sport')
          };
          Object.entries(owns).forEach(([key, has]) => {
            const badge = document.getElementById('badge-' + key);
            const card = document.getElementById('plan-' + key);
            if (badge) badge.style.display = has ? '' : 'none';
            if (card) card.style.outline = has ? '2px solid var(--color-primary)' : '';
          });
        } else {
          const badge = document.getElementById('badge-' + currentPlan);
          const card = document.getElementById('plan-' + currentPlan);
          if (badge) badge.style.display = '';
          if (card) card.style.outline = '2px solid var(--color-primary)';
        }
        const credits = RA10.getCredits();
        const creditBreakdown = (typeof RA10.getCreditBreakdown === 'function') ? RA10.getCreditBreakdown() : null;
        const storedCredits = creditBreakdown && Number.isFinite(creditBreakdown.storedCredits)
          ? Number(creditBreakdown.storedCredits)
          : (Number.isFinite(credits) ? Number(credits) : 0);
        const examBonusRemaining = creditBreakdown ? Number(creditBreakdown.examBonusRemaining || 0) : 0;
        const creditsText = credits === Infinity ? '∞ credits' : credits + ' credits';
        const openCreditsClick = (e) => {
          e && e.stopPropagation();
          const openFn = (window.RA10 && typeof RA10.openCreditsPanel === 'function') ? RA10.openCreditsPanel : null;
          if (openFn) openFn();
        };
        ['nav-credit-chip', 'mobile-credit-chip'].forEach((idVal) => {
          const el = document.getElementById(idVal);
          if (!el) return;
          el.textContent = creditsText;
          el.style.cursor = 'pointer';
          el.title = 'View your credits';
          el.onclick = openCreditsClick;
        });
        const eduLink = document.getElementById('dropdown-edu-admin');
        if (eduLink) {
          const t = RA10.getTier();
          const em = (profile?.email || '').toLowerCase();
          const show = t === 'school_admin' || em === 'mistry.hashim@icloud.com';
          eduLink.style.display = show ? '' : 'none';
        }
        const accountTier = RA10.getTier();
        document.querySelectorAll('.card[data-tier]').forEach(card => {
          card.classList.toggle('current-plan', card.dataset.tier === accountTier);
        });
        document.getElementById('account-display-name').textContent = profile.display_name || profile.email;
        document.getElementById('account-email').textContent = profile.email;
        const giftPanel = document.getElementById('account-credit-gift-panel');
        const ownerPicPanel = document.getElementById('account-owner-pic-panel');
        const isOwner = isOwnerAccount(profile);
        if (window.RA10Forum && RA10Forum.refresh) RA10Forum.refresh();
        if (giftPanel) {
          giftPanel.style.display = isOwner ? 'block' : 'none';
          if (ownerPicPanel) ownerPicPanel.style.display = isOwner ? 'block' : 'none';
        }
        loadSentCreditGifts({ silent: true });
        if (isOwner) {
          loadOwnerProfilePictures({ silent: true });
        } else {
          const ownerList = document.getElementById('owner-profile-pic-list');
          if (ownerList) {
            ownerList.innerHTML = '<div class="credit-log-note">Owner access required.</div>';
            ownerList.dataset.loaded = '0';
          }
        }
        const accountSchoolEl = document.getElementById('account-school');
        if (accountSchoolEl) {
          const tier = String(RA10.getTier() || '');
          const schoolName = String((profile && profile.school_name) || '').trim();
          const isSchoolTier = tier === 'school_student' || tier === 'school_teacher' || tier === 'school_admin';
          if (isSchoolTier && schoolName) {
            accountSchoolEl.textContent = 'School: ' + schoolName;
            accountSchoolEl.style.display = '';
          } else {
            accountSchoolEl.textContent = '';
            accountSchoolEl.style.display = 'none';
          }
        }
        document.getElementById('account-username').textContent = RA10.getProfile()?.username ? ('@' + RA10.getProfile().username) : 'No username set';
        document.getElementById('account-display-name-current').textContent = profile.full_name || profile.display_name || profile.email;
        const accountNameInput = document.getElementById('account-name-input');
        const accountUsernameInput = document.getElementById('account-username-input');
        const accountBadgeInput = document.getElementById('account-badge-input');
        const accountPicInput = document.getElementById('account-pic-input');
        document.getElementById('account-username-current').textContent = profile.username ? ('@' + profile.username) : 'No username set';
        document.getElementById('account-badge-current').textContent = getLeaderboardBadgeEmoji(profile) || 'No badge set';
        const earnedBadgeEl = document.getElementById('account-earned-leaderboard-badge');
        if (earnedBadgeEl) {
          earnedBadgeEl.textContent = getEarnedLeaderboardBadge(profile) || 'No weekly podium finish yet';
        }
        let currentPicUrl = getProfilePictureUrl(profile);
        if (!currentPicUrl) {
          try {
            const currentUserId = (RA10.getSession && RA10.getSession()?.user?.id) || profile.id || '';
            if (currentUserId) {
              currentPicUrl = await fetchCurrentUserProfilePicture(null, currentUserId);
            }
          } catch (e) {}
        }
        const currentPicLabel = document.getElementById('account-profile-pic-current');
        if (currentPicLabel) currentPicLabel.textContent = currentPicUrl ? 'Profile picture set' : 'No profile picture set';
        renderAccountPicturePreview(currentPicUrl);
        renderAccountPictureDisplay(currentPicUrl);
        if (accountNameInput) {
          const isNameEditing = document.activeElement === accountNameInput;
          if (!isNameEditing) {
            accountNameInput.value = profile.full_name || profile.display_name || '';
          }
        }
        if (accountUsernameInput) {
          const isUsernameEditing = document.activeElement === accountUsernameInput;
          if (!isUsernameEditing) {
            accountUsernameInput.value = profile.username || '';
          }
        }
        if (accountBadgeInput) {
          const isBadgeEditing = document.activeElement === accountBadgeInput;
          if (!isBadgeEditing) {
            accountBadgeInput.value = getLeaderboardBadgeEmoji(profile) || '';
          }
        }
        if (accountPicInput) {
          const isPicEditing = document.activeElement === accountPicInput;
          accountPicInput.dataset.currentPicUrl = currentPicUrl || '';
          if (!isPicEditing) accountPicInput.value = '';
        }
        const tier = RA10.getTier();
        const unlockedSubjects = Array.isArray(profile.unlocked_subjects) ? profile.unlocked_subjects.filter(Boolean) : [];
        document.getElementById('account-tier-badge').textContent = RA10.getTierInfo().label;
        if (tier === 'subject') {
          const subjectPoolTotal = Math.max(0, unlockedSubjects.length * 300);
          const subjectCreditsAvailable = Math.max(0, Math.min(subjectPoolTotal, storedCredits));
          const universalStored = Math.max(0, storedCredits - subjectPoolTotal);
          const universalCredits = Math.max(0, universalStored + examBonusRemaining);
          if (unlockedSubjects.length === 1) {
            const subjectName = unlockedSubjects[0] || 'Subject';
            document.getElementById('account-credits').textContent = subjectCreditsAvailable + ' ' + subjectName + ' subject credits + ' + universalCredits + ' universal credits';
          } else {
            document.getElementById('account-credits').textContent = subjectCreditsAvailable + ' subject credits + ' + universalCredits + ' universal credits';
          }
        } else {
          document.getElementById('account-credits').textContent = credits === Infinity ? 'Unlimited credits' : credits + ' credits';
        }
        const resetAt = profile.credits_reset_at ? new Date(profile.credits_reset_at) : null;
        const resetDate = resetAt ? resetAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';
        const accountNextBillingEl = document.getElementById('account-next-billing');
        if (accountNextBillingEl) {
          accountNextBillingEl.textContent = '—';
        }
        if (tier === 'subject') {
          document.getElementById('account-reset-date').textContent = 'No renewal (one-time credits)';
          if (accountNextBillingEl) accountNextBillingEl.textContent = 'No billing (one-time purchase)';
        } else {
          document.getElementById('account-reset-date').textContent = resetDate;
          if (accountNextBillingEl && tier === 'free') accountNextBillingEl.textContent = 'No active subscription';
          if (accountNextBillingEl && isRecurringPaidTier(tier)) accountNextBillingEl.textContent = 'Loading billing date...';
        }
        const subStatusEl = document.getElementById('account-sub-status');
        if (subStatusEl) {
          if (tier === 'free') {
            subStatusEl.textContent = 'No active subscription';
            subStatusEl.style.color = 'var(--color-text-muted)';
          } else if (tier === 'subject') {
            subStatusEl.textContent = 'One-time purchase';
            subStatusEl.style.color = 'var(--color-primary)';
          } else if (tier === 'ultra' || tier === 'owner') {
            subStatusEl.textContent = 'Active';
            subStatusEl.style.color = 'var(--color-success)';
          } else if (resetAt && resetAt.getTime() > Date.now()) {
            subStatusEl.textContent = 'Active';
            subStatusEl.style.color = 'var(--color-success)';
          } else {
            subStatusEl.textContent = 'Expired / cancelled';
            subStatusEl.style.color = 'var(--color-error)';
          }
        }

        if (tier === 'school_admin') {
          const stripeLookupSeq = ++stripeBillingLookupSeq;
          const billingMeta = await getStripeBillingMeta(profile, tier);
          if (stripeLookupSeq !== stripeBillingLookupSeq) return;

          let handledByStripe = false;
          if (billingMeta) {
            const billingStatus = String(billingMeta.status || '').toLowerCase();
            const periodEndDate = billingMeta.current_period_end ? new Date(billingMeta.current_period_end) : null;
            const periodEndText = periodEndDate && !Number.isNaN(periodEndDate.getTime())
              ? periodEndDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
              : null;
            const nextBillingDate = billingMeta.next_billing_at ? new Date(billingMeta.next_billing_at) : null;
            const nextBillingText = nextBillingDate && !Number.isNaN(nextBillingDate.getTime())
              ? nextBillingDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
              : 'Billing date unavailable';

            if (billingStatus === 'canceled' || billingStatus === 'incomplete_expired') {
              handledByStripe = true;
              if (subStatusEl) {
                subStatusEl.textContent = 'Cancelled';
                subStatusEl.style.color = 'var(--color-error)';
              }
              if (accountNextBillingEl) accountNextBillingEl.textContent = 'No active subscription';
              if (eduLink) eduLink.style.display = 'none';
            } else if (billingMeta.cancel_at_period_end) {
              handledByStripe = true;
              if (subStatusEl) {
                subStatusEl.textContent = periodEndText ? ('Cancelled (ending on ' + periodEndText + ')') : 'Cancelled (ending at period end)';
                subStatusEl.style.color = 'var(--color-warning)';
              }
              if (accountNextBillingEl) accountNextBillingEl.textContent = periodEndText ? ('Ending on ' + periodEndText) : 'Cancelled at period end';
              if (periodEndText) {
                document.getElementById('account-reset-date').textContent = 'Ending on ' + periodEndText;
              }
              if (periodEndText && profile && profile.id) {
                const noticeKey = SCHOOL_CANCEL_NOTICE_KEY + ':' + String(profile.id) + ':' + periodEndText;
                let alreadyShown = false;
                try {
                  alreadyShown = localStorage.getItem(noticeKey) === '1';
                } catch (e) {}
                if (!alreadyShown) {
                  alert('Your school subscription will end on ' + periodEndText + '.');
                  try {
                    localStorage.setItem(noticeKey, '1');
                  } catch (e) {}
                }
              }
            } else {
              handledByStripe = true;
              if (subStatusEl) {
                subStatusEl.textContent = 'Active';
                subStatusEl.style.color = 'var(--color-success)';
              }
              if (accountNextBillingEl) accountNextBillingEl.textContent = nextBillingText;
            }
          }

          if (!handledByStripe) {
            const schoolLookupSeq = ++schoolSubLookupSeq;
            const schoolRow = await getSchoolSubscriptionMeta(profile, tier);
            if (schoolLookupSeq !== schoolSubLookupSeq) return;

            if (schoolRow) {
              const active = isSchoolSubscriptionActive(schoolRow);
              if (subStatusEl) {
                subStatusEl.textContent = active ? 'Active' : 'Expired / cancelled';
                subStatusEl.style.color = active ? 'var(--color-success)' : 'var(--color-error)';
              }
              if (!active && eduLink) {
                eduLink.style.display = 'none';
              }

              const schoolStatus = String((schoolRow.subscription_status || '')).trim().toLowerCase();
              const schoolRenewal = getSchoolRenewalDate(schoolRow);
              const schoolRenewalText = schoolRenewal && !Number.isNaN(schoolRenewal.getTime())
                ? schoolRenewal.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                : null;
              const isEnding = (schoolStatus === 'cancelled' || schoolStatus === 'canceled' || schoolStatus === 'cancel_at_period_end')
                && schoolRenewal && schoolRenewal.getTime() > Date.now();
              if (subStatusEl && isEnding && schoolRenewalText) {
                subStatusEl.textContent = 'Cancelled (ending on ' + schoolRenewalText + ')';
                subStatusEl.style.color = 'var(--color-warning)';
              }
              if (schoolRenewalText) {
                document.getElementById('account-reset-date').textContent = (isEnding ? 'Ending on ' : '') + schoolRenewalText;
                if (accountNextBillingEl) {
                  accountNextBillingEl.textContent = isEnding ? ('Ending on ' + schoolRenewalText) : schoolRenewalText;
                }
              } else if (accountNextBillingEl) {
                accountNextBillingEl.textContent = 'Billing date unavailable';
              }
            } else if (accountNextBillingEl) {
              accountNextBillingEl.textContent = 'Billing date unavailable';
            }
          }
        } else if (isRecurringPaidTier(tier)) {
          const lookupSeq = ++stripeBillingLookupSeq;
          const billingMeta = await getStripeBillingMeta(profile, tier);
          if (lookupSeq !== stripeBillingLookupSeq) return;
          if (billingMeta) {
            const billingStatus = String(billingMeta.status || '').toLowerCase();
            const nextBillingDate = billingMeta.next_billing_at ? new Date(billingMeta.next_billing_at) : null;
            const periodEndDate = billingMeta.current_period_end ? new Date(billingMeta.current_period_end) : null;
            const nextBillingText = nextBillingDate && !Number.isNaN(nextBillingDate.getTime())
              ? nextBillingDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
              : '—';
            const periodEndText = periodEndDate && !Number.isNaN(periodEndDate.getTime())
              ? periodEndDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
              : null;

            if (billingStatus === 'canceled' || billingStatus === 'incomplete_expired') {
              if (subStatusEl) {
                subStatusEl.textContent = 'Cancelled';
                subStatusEl.style.color = 'var(--color-error)';
              }
              if (accountNextBillingEl) accountNextBillingEl.textContent = 'No active subscription';
              if (!billingReconcileInFlight && tier !== 'free') {
                billingReconcileInFlight = true;
                try {
                  await RA10.refreshProfile();
                } catch (e) {}
                _updateNavAuth();
                billingReconcileInFlight = false;
              }
            } else if (billingMeta.cancel_at_period_end) {
              if (subStatusEl) {
                subStatusEl.textContent = periodEndText ? ('Active (ending on ' + periodEndText + ')') : 'Active (ending at period end)';
                subStatusEl.style.color = 'var(--color-warning)';
              }
              if (accountNextBillingEl) accountNextBillingEl.textContent = 'Cancelled at period end';
            } else {
              if (accountNextBillingEl) {
                const isYearly = String(billingMeta.billing_interval || '').toLowerCase() === 'year';
                accountNextBillingEl.textContent = nextBillingText !== '—'
                  ? (isYearly ? (nextBillingText + ' (yearly)') : nextBillingText)
                  : 'Billing date unavailable';
              }
            }
          } else if (accountNextBillingEl) {
            accountNextBillingEl.textContent = 'Billing date unavailable';
          }
        }
        renderAccountCreditLog();
        maybeShowPlanWelcome();
      } else {
        renderAccountCreditLog();
      }
    }
    const updateNavAuth = _updateNavAuth;

    function showMiniToast(msg) {
      let t = document.getElementById('mini-toast');
      if (!t) {
        t = document.createElement('div');
        t.id = 'mini-toast';
        t.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:10010;background:var(--color-primary);color:#fff;padding:10px 14px;border-radius:999px;font-size:var(--tx-sm);font-weight:700;box-shadow:var(--shadow-lg);opacity:0;transform:translateY(8px);transition:opacity .2s,transform .2s;';
        document.body.appendChild(t);
      }
      t.textContent = msg;
      t.style.opacity = '1';
      t.style.transform = 'translateY(0)';
      clearTimeout(window._miniToastTimer);
      window._miniToastTimer = setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateY(8px)';
      }, 2000);
    }

    var _siteAnnouncementData = null;
    var _siteAnnouncementRefreshTimer = null;

    function announcementDismissToken(ann) {
      if (!ann || !ann.message) return '';
      return [String(ann.message || '').trim(), String(ann.created_at || ''), String(ann.expires_at || '')].join('|');
    }

    function isAnnouncementDismissed(ann) {
      const token = announcementDismissToken(ann);
      if (!token) return false;
      return localStorage.getItem(SITE_ANNOUNCEMENT_DISMISS_KEY) === token;
    }

    function dismissAnnouncement(ann) {
      const token = announcementDismissToken(ann);
      if (!token) return;
      localStorage.setItem(SITE_ANNOUNCEMENT_DISMISS_KEY, token);
    }

    function formatAnnouncementDate(ts) {
      const d = new Date(ts || '');
      if (Number.isNaN(d.getTime())) return '';
      return d.toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    }

    function renderSiteAnnouncement(ann) {
      const bar = document.getElementById('site-announcement-bar');
      const emojiEl = document.getElementById('site-announcement-emoji');
      const textEl = document.getElementById('site-announcement-text');
      const metaEl = document.getElementById('site-announcement-meta');
      if (!bar || !emojiEl || !textEl || !metaEl) return;

      // Fallback announcement shown when no live Supabase announcement is set.
      const fallback = {
        emoji: '🎉',
        message: 'BTEC IT Unit 3 (Website Development) is now live — study guide, wireframe & sitemap builders, code editor, sample assignments and AI Assigner.',
        duration_hours: 168,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      const effective = (ann && ann.message) ? ann : fallback;

      const now = Date.now();
      const expiresAtMs = effective && effective.expires_at ? Date.parse(String(effective.expires_at)) : NaN;
      if (!effective || !effective.message || Number.isNaN(expiresAtMs) || expiresAtMs <= now) {
        bar.style.display = 'none';
        textEl.textContent = '';
        metaEl.textContent = '';
        return;
      }
      if (isAnnouncementDismissed(effective)) {
        bar.style.display = 'none';
        return;
      }

      emojiEl.textContent = String(effective.emoji || '📣').slice(0, 4);
      textEl.textContent = String(effective.message || '').trim();

      const createdLabel = formatAnnouncementDate(effective.created_at);
      const expiresLabel = formatAnnouncementDate(effective.expires_at);
      const durationHours = Number(effective.duration_hours || 0);
      const durationLabel = Number.isFinite(durationHours) && durationHours > 0 ? (durationHours + 'h') : '';
      const parts = [];
      if (createdLabel) parts.push('Posted ' + createdLabel);
      if (durationLabel) parts.push('Shows for ' + durationLabel);
      if (expiresLabel) parts.push('Until ' + expiresLabel);
      metaEl.textContent = parts.join(' • ');
      bar.style.display = 'block';
    }

    async function fetchSiteAnnouncement() {
      const res = await fetch('https://tcrrgsylxbyyrmnouihl.supabase.co/functions/v1/site-announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get' }),
      });
      const text = await res.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
      if (!res.ok) {
        const msg = (data && (data.error || data.message)) || text || 'Could not fetch announcement.';
        throw new Error(msg);
      }
      return data && data.announcement ? data.announcement : null;
    }

    async function refreshSiteAnnouncement(options) {
      const opts = options || {};
      try {
        const ann = await fetchSiteAnnouncement();
        _siteAnnouncementData = ann;
        renderSiteAnnouncement(ann);
      } catch (e) {
        if (!opts.silent) console.warn('announcement refresh failed', e);
        renderSiteAnnouncement(_siteAnnouncementData);
      }
    }

    function startSiteAnnouncementRefreshLoop() {
      if (_siteAnnouncementRefreshTimer) return;
      _siteAnnouncementRefreshTimer = setInterval(() => {
        refreshSiteAnnouncement({ silent: true });
      }, 60000);
    }

    async function callAuthedRpc(name, payload) {
      const session = RA10.getSession ? RA10.getSession() : null;
      const token = session && session.access_token;
      if (!token) throw new Error('Not authenticated.');
      const res = await fetch('https://tcrrgsylxbyyrmnouihl.supabase.co/rest/v1/rpc/' + encodeURIComponent(name), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyMTEsImV4cCI6MjA5MzQ2MTIxMX0.eOp6ma-mfgh8F20nM7E2OaBW28LlZlwuEEWr6k2zDWw',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload || {})
      });
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (e) {}
      if (!res.ok) {
        const msg = (data && (data.message || data.error_description || data.error)) || text || 'Request failed.';
        throw new Error(msg);
      }
      return data;
    }

    async function callAuthedFunction(functionName, payload) {
      const session = RA10.getSession ? RA10.getSession() : null;
      const token = session && session.access_token;
      if (!token) throw new Error('Not authenticated.');
      const res = await fetch('https://tcrrgsylxbyyrmnouihl.supabase.co/functions/v1/' + encodeURIComponent(functionName), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload || {})
      });
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (e) {}
      if (!res.ok) {
        const msg = (data && (data.error || data.message)) || text || 'Request failed.';
        throw new Error(msg);
      }
      return data;
    }

    async function updateCurrentUserProfilePicture(sb, userId, pictureUrlOrNull) {
      const value = pictureUrlOrNull ? String(pictureUrlOrNull).trim() : null;
      const patchQuery = '?id=eq.' + encodeURIComponent(userId);
      const payload = { profile_pic_url: value };
      try {
        const rows = await authedProfilesRequest('PATCH', patchQuery, payload, 'return=representation');
        if (Array.isArray(rows) && rows.length) return 'profile_pic_url';
      } catch (e) {
        if (isMissingProfilePicColumnError(e)) {
          throw new Error('Profile picture column is not configured in Supabase yet.');
        }
        throw e;
      }
      await upsertCurrentUserProfilePicture(sb, userId, value);
      return 'profile_pic_url';
    }

    async function checkGiftCreditPopup() {
      if (!window.supabase || !RA10.isLoggedIn()) return;
      try {
        const data = await callAuthedRpc('get_unseen_credit_gifts');
        if (!Array.isArray(data) || !data.length) return;
        const ids = data.map((row) => Number(row.id)).filter((n) => Number.isFinite(n));
        if (!ids.length) return;
        const seenMap = (() => {
          try {
            return JSON.parse(localStorage.getItem(CREDIT_GIFT_POPUP_SEEN_KEY) || '{}') || {};
          } catch (e) {
            return {};
          }
        })();
        const unseenForPopup = ids.filter((id) => !seenMap[String(id)]);
        if (!unseenForPopup.length) return;
        const total = data.reduce((sum, row) => sum + Number(row.amount || 0), 0);
        const senders = Array.from(new Set(data.map((row) => String(row.sender_email || '').toLowerCase()).filter(Boolean)));
        const senderLabel = senders.length ? senders.join(', ') : 'a supporter';
        const popup = document.getElementById('gift-credit-popup');
        if (!popup) return;
        const amountEl = popup.querySelector('[data-gift-amount]');
        const senderEl = popup.querySelector('[data-gift-sender]');
        const noteWrapEl = popup.querySelector('[data-gift-note-wrap]');
        const noteEl = popup.querySelector('[data-gift-note]');
        if (amountEl) amountEl.textContent = String(total);
        if (senderEl) senderEl.textContent = senderLabel;
        const firstNote = String(((data[0] && data[0].note) || '')).trim();
        if (noteWrapEl && noteEl) {
          if (firstNote) {
            noteEl.textContent = firstNote;
            noteWrapEl.style.display = '';
          } else {
            noteEl.textContent = '';
            noteWrapEl.style.display = 'none';
          }
        }
        popup.dataset.ids = ids.join(',');
        popup.style.display = 'block';
        ids.forEach((id) => { seenMap[String(id)] = 1; });
        try {
          localStorage.setItem(CREDIT_GIFT_POPUP_SEEN_KEY, JSON.stringify(seenMap));
        } catch (e) {}
        try {
          await callAuthedRpc('mark_credit_gifts_seen', { gift_ids: ids });
        } catch (e) {
          console.warn('mark seen on gift popup open failed', e);
        }
      } catch (e) {
        console.warn('gift popup check failed', e);
      }
    }

    function moderationReasonLabel(code) {
      const key = String(code || '').toLowerCase();
      if (key === 'policy_violation') return 'Policy violation';
      if (key === 'offensive_image') return 'Offensive or inappropriate image';
      if (key === 'copyright_issue') return 'Copyright issue';
      if (key === 'impersonation') return 'Impersonation';
      if (key === 'username_policy') return 'Username policy breach';
      if (key === 'abusive_content') return 'Abusive content';
      if (key === 'requested_reset') return 'Requested reset';
      return 'Owner moderation';
    }

    async function checkModerationNotice() {
      if (!window.supabase || !RA10.isLoggedIn()) return;
      try {
        const session = RA10.getSession ? RA10.getSession() : null;
        const currentUserId = session?.user?.id || RA10.getProfile()?.id || '';
        if (!currentUserId) return;
        const query = '?select=moderation_notice_type,moderation_notice_reason,moderation_notice_message,moderation_notice_created_at,moderation_notice_seen&id=eq.' + encodeURIComponent(currentUserId) + '&limit=1';
        const rows = await authedProfilesRequest('GET', query, null, null);
        const row = Array.isArray(rows) && rows.length ? rows[0] : null;
        if (!row) return;
        const noticeType = String(row.moderation_notice_type || '').trim();
        const noticeSeen = !!row.moderation_notice_seen;
        const modSeenKey = 'ra10_mod_notice_seen_' + currentUserId + '_' + String(row.moderation_notice_created_at || noticeType);
        let seenLocally = false;
        try { seenLocally = localStorage.getItem(modSeenKey) === '1'; } catch (e) {}
        if (!noticeType || noticeSeen || seenLocally) return;

        const popup = document.getElementById('moderation-popup');
        if (!popup) return;
        const titleEl = popup.querySelector('[data-mod-title]');
        const bodyEl = popup.querySelector('[data-mod-body]');
        const reasonEl = popup.querySelector('[data-mod-reason]');
        const msgWrapEl = popup.querySelector('[data-mod-message-wrap]');
        const msgEl = popup.querySelector('[data-mod-message]');
        const reasonCode = String(row.moderation_notice_reason || '').trim();
        const message = String(row.moderation_notice_message || '').trim();

        if (titleEl) titleEl.textContent = noticeType === 'username_reset' ? 'Your username was reset' : 'Your profile picture was removed';
        if (bodyEl) {
          bodyEl.textContent = noticeType === 'username_reset'
            ? 'Your username was reset by the RA10 owner moderation team.'
            : 'Your profile picture was removed by the RA10 owner moderation team.';
        }
        if (reasonEl) reasonEl.textContent = moderationReasonLabel(reasonCode);
        if (msgWrapEl && msgEl) {
          if (message) {
            msgEl.textContent = message;
            msgWrapEl.style.display = '';
          } else {
            msgEl.textContent = '';
            msgWrapEl.style.display = 'none';
          }
        }
        popup.dataset.userId = currentUserId;
        popup.style.display = 'block';
        // Shown once: mark it seen right now rather than waiting for the close button.
        try { localStorage.setItem(modSeenKey, '1'); } catch (e) {}
        authedProfilesRequest('PATCH', '?id=eq.' + encodeURIComponent(currentUserId), { moderation_notice_seen: true }, null).catch(function (err) { console.warn('mark moderation notice seen failed', err); });
      } catch (e) {
        console.warn('moderation popup check failed', e);
      }
    }

    async function loadSentCreditGifts(opts) {
      const options = opts || {};
      const force = !!options.force;
      const silent = options.silent !== false;
      const host = document.getElementById('gift-credit-sent-list');
      if (!host) return;
      if (!window.supabase || !RA10.isLoggedIn()) {
        if (!silent) host.innerHTML = '<div class="credit-log-note">Sign in to view sent gifts.</div>';
        host.dataset.loaded = '0';
        return;
      }
      const profile = RA10.getProfile();
      if (!isOwnerAccount(profile)) {
        if (!silent) host.innerHTML = '<div class="credit-log-note">No gifts sent yet.</div>';
        host.dataset.loaded = '0';
        return;
      }
      if (_giftSentFetchInFlight) return;
      const isFresh = (Date.now() - _giftSentLastLoadedAt) < CREDIT_GIFT_SENT_REFRESH_MS;
      if (!force && isFresh && host.dataset.loaded === '1') return;
      if (!silent || host.dataset.loaded !== '1') {
        host.innerHTML = '<div class="credit-log-note">Loading sent gifts...</div>';
      }
      _giftSentFetchInFlight = true;
      try {
        const data = await callAuthedRpc('get_sent_credit_gifts', { limit_count: 8 });
        if (!Array.isArray(data) || !data.length) {
          host.innerHTML = '<div class="credit-log-note">No gifts sent yet.</div>';
          host.dataset.loaded = '1';
          _giftSentLastLoadedAt = Date.now();
          return;
        }
        host.innerHTML = data.map((row) => {
          const toEmail = String(row.recipient_email || '').trim() || 'unknown';
          const amount = Number(row.amount || 0);
          const note = String(row.note || '').trim();
          const when = row.created_at ? new Date(row.created_at).toLocaleString() : '';
          return ''
            + '<div class="credit-log-item">'
            +   '<div class="credit-log-main">'
            +     '<div class="credit-log-note">To: ' + toEmail + (note ? ' - ' + note : '') + '</div>'
            +     '<div class="credit-log-time">' + when + '</div>'
            +   '</div>'
            +   '<div class="credit-log-amt gain">+' + amount + '</div>'
            + '</div>';
        }).join('');
        host.dataset.loaded = '1';
        _giftSentLastLoadedAt = Date.now();
      } catch (e) {
        if (!silent) host.innerHTML = '<div class="credit-log-note">Could not load sent gifts.</div>';
      } finally {
        _giftSentFetchInFlight = false;
      }
    }

    async function loadOwnerProfilePictures(opts) {
      const options = opts || {};
      const force = !!options.force;
      const silent = options.silent !== false;
      const host = document.getElementById('owner-profile-pic-list');
      if (!host) return;
      if (!window.supabase || !RA10.isLoggedIn()) {
        if (!silent) host.innerHTML = '<div class="credit-log-note">Sign in as owner to view profile pictures.</div>';
        host.dataset.loaded = '0';
        return;
      }
      const profile = RA10.getProfile();
      if (!isOwnerAccount(profile)) {
        if (!silent) host.innerHTML = '<div class="credit-log-note">Owner access required.</div>';
        host.dataset.loaded = '0';
        return;
      }
      if (_ownerProfilePicsFetchInFlight) return;
      const isFresh = (Date.now() - _ownerProfilePicsLastLoadedAt) < CREDIT_GIFT_SENT_REFRESH_MS;
      if (!force && isFresh && host.dataset.loaded === '1') return;
      if (!silent || host.dataset.loaded !== '1') {
        host.innerHTML = '<div class="credit-log-note">Loading profile pictures...</div>';
      }
      _ownerProfilePicsFetchInFlight = true;
      try {
        const data = await callAuthedFunction('list-profile-pictures', { limit_count: 120 });
        const rows = Array.isArray(data) ? data : [];
        if (!rows.length) {
          host.innerHTML = '<div class="credit-log-note">No profile pictures found.</div>';
          host.dataset.loaded = '1';
          _ownerProfilePicsLastLoadedAt = Date.now();
          return;
        }
        host.innerHTML = rows.map((row) => {
          const id = String((row && row.id) || '').trim();
          const username = String((row && row.username) || '').trim();
          const email = String((row && row.email) || '').trim();
          const pic = String((row && row.profile_pic_url) || '').trim();
          const label = username ? ('@' + username) : (email || id || 'unknown');
          const escLabel = escapeHtmlAttr(label);
          const escPic = escapeHtmlAttr(pic);
          const target = escapeHtmlAttr(id || username || email);
          return ''
            + '<div class="credit-log-item" style="align-items:center;gap:10px;">'
            +   '<div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1;">'
            +     '<img src="' + escPic + '" alt="' + escLabel + '" loading="lazy" style="width:36px;height:36px;border-radius:999px;object-fit:cover;border:1px solid var(--color-border);background:var(--color-surface-offset);">'
            +     '<div class="credit-log-main" style="min-width:0;">'
            +       '<div class="credit-log-note" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escLabel + '</div>'
            +       '<div class="credit-log-time" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escapeHtmlAttr(email || id) + '</div>'
            +     '</div>'
            +   '</div>'
            +   '<button class="btn account-btn account-btn-danger owner-inline-remove-pic-btn" data-owner-remove-target="' + target + '" type="button">Remove</button>'
            + '</div>';
        }).join('');
        host.dataset.loaded = '1';
        _ownerProfilePicsLastLoadedAt = Date.now();
      } catch (e) {
        if (!silent) host.innerHTML = '<div class="credit-log-note">Could not load profile pictures.</div>';
      } finally {
        _ownerProfilePicsFetchInFlight = false;
      }
    }

    function getPlanWelcomeContent() {
      if (!RA10.isLoggedIn()) return null;
      const profile = RA10.getProfile();
      if (!profile) return null;
      const tier = RA10.getTier();
      if (tier === 'free') return null;

      const subjects = Array.isArray(profile.unlocked_subjects) ? profile.unlocked_subjects.filter(Boolean) : [];
      const tierLabel = RA10.getTierInfo()?.label || 'Plan';
      const credits = RA10.getCredits();
      const creditLabel = credits === Infinity ? 'Unlimited credits' : credits + ' credits';
      const signature = [tier, subjects.slice().sort().join('|')].join('::');

      var benefits = [];
      var title = 'Welcome to your ' + tierLabel + ' plan';

      if (tier === 'subject') {
        const subjectName = subjects[0] || 'your selected subject';
        benefits = [
          'One-time allocation: ' + creditLabel + ' for ' + subjectName,
          'No monthly renewal and no expiry date on this credit pack',
          'No ads while you use this paid plan'
        ];
      } else if (tier === 'all_subjects') {
        benefits = [
          'All subjects unlocked',
          '1000 credits each month',
          'No ads'
        ];
      } else if (tier === 'ultra' || tier === 'owner') {
        benefits = [
          'Unlimited credits',
          'All subjects and tools unlocked',
          'No ads'
        ];
      } else if (tier === 'school_student') {
        benefits = [
          '300 credits each month',
          'No ads',
          'School assigned subjects: ' + (subjects.length ? subjects.join(', ') : 'Set by your teacher/admin')
        ];
      } else if (tier === 'school_teacher') {
        benefits = [
          '600 credits each month',
          'No ads',
          'School assigned subjects: ' + (subjects.length ? subjects.join(', ') : 'Set by EDU Admin')
        ];
      } else if (tier === 'school_admin') {
        benefits = [
          '300 credits each month',
          'Access to EDU Admin portal',
          'No ads'
        ];
      } else {
        benefits = [creditLabel, 'No ads'];
      }

      return { title, benefits, signature };
    }

    function maybeShowPlanWelcome() {
      const content = getPlanWelcomeContent();
      if (!content) return;
      const profile = RA10.getProfile();
      const userKey = profile?.id || RA10.getSession()?.user?.id || 'anon';
      const storageKey = 'ra10_plan_welcome_seen_' + userKey;
      if (localStorage.getItem(storageKey) === content.signature) return;

      localStorage.setItem(storageKey, content.signature);
      const overlay = document.getElementById('plan-welcome-overlay');
      const titleEl = document.getElementById('plan-welcome-title');
      const listEl = document.getElementById('plan-welcome-list');
      const escHtml = function(v) {
        return String(v == null ? '' : v)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      };
      if (!overlay || !titleEl || !listEl) return;
      titleEl.textContent = content.title;
      listEl.innerHTML = content.benefits.map(function(item) {
        return '<li style="margin-bottom:var(--sp2)">' + escHtml(item) + '</li>';
      }).join('');
      overlay.classList.add('open');
    }

    document.getElementById('plan-welcome-close')?.addEventListener('click', () => {
      document.getElementById('plan-welcome-overlay')?.classList.remove('open');
    });

    document.getElementById('plan-welcome-overlay')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('plan-welcome-overlay')) {
        document.getElementById('plan-welcome-overlay').classList.remove('open');
      }
    });

    const PROFILE_SETUP_DISMISSED_KEY = 'ra10_profile_setup_dismissed';
    const USERNAME_SETUP_DISMISSED_KEY = 'ra10_username_setup_dismissed';
    const USERNAME_NOTICE_PENDING_PREFIX = 'ra10_username_notice_pending_';
    const USERNAME_LAST_VALUE_PREFIX = 'ra10_username_last_seen_';
    let profileSetupTimer = 0;
    let usernameSetupTimer = 0;
    let usernamePolicySyncInFlight = false;

    const BLOCKED_TERMS = [
      'nigger', 'nigga', 'faggot', 'fag',
      'kike', 'cunt'
    ];

    function normalizeForModeration(raw) {
      return String(raw || '').toLowerCase();
    }

    function getModerationTokens(raw) {
      return normalizeForModeration(raw)
        .replace(/[^a-z0-9_\s]/g, ' ')
        .split(/[^a-z0-9]+/)
        .filter(Boolean);
    }

    function hasBlockedContent(raw) {
      const tokens = getModerationTokens(raw);
      if (!tokens.length) return false;
      return tokens.some(function(t) { return BLOCKED_TERMS.includes(t); });
    }

    function normalizeUsername(raw) {
      return String(raw || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    }

    function validateUsername(raw) {
      const username = normalizeUsername(raw);
      if (!username || username.length < 3) {
        return { ok: false, username, error: 'Username must be at least 3 characters.' };
      }
      if (username.length > 24) {
        return { ok: false, username, error: 'Username must be 24 characters or fewer.' };
      }
      if (username.startsWith('_') || username.endsWith('_')) {
        return { ok: false, username, error: 'Username cannot start or end with an underscore.' };
      }
      const usernameTokens = username.split(/[_0-9]+/).filter(Boolean);
      if (usernameTokens.some(function(t) { return BLOCKED_TERMS.includes(t); })) {
        return { ok: false, username, error: 'That username is not allowed. Please choose another.' };
      }
      return { ok: true, username, error: '' };
    }

    function validateDisplayName(raw) {
      const name = String(raw || '').trim();
      if (!name) {
        return { ok: false, value: name, error: 'Please enter your name.' };
      }
      if (name.length > 60) {
        return { ok: false, value: name, error: 'Display name must be 60 characters or fewer.' };
      }
      if (hasBlockedContent(name)) {
        return { ok: false, value: name, error: 'That display name is not allowed. Please choose another.' };
      }
      return { ok: true, value: name, error: '' };
    }

    async function saveUsernameForCurrentUser(username) {
      const session = RA10.getSession();
      const currentUserId = session?.user?.id || RA10.getProfile()?.id || '';
      const token = session?.access_token || '';
      if (!currentUserId) {
        throw new Error('You are not signed in. Please refresh and try again.');
      }
      if (!token) {
        throw new Error('Session expired. Please sign in again.');
      }

      const endpoint = 'https://tcrrgsylxbyyrmnouihl.supabase.co/rest/v1/profiles?id=eq.' + encodeURIComponent(currentUserId);
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyMTEsImV4cCI6MjA5MzQ2MTIxMX0.eOp6ma-mfgh8F20nM7E2OaBW28LlZlwuEEWr6k2zDWw',
          'Authorization': 'Bearer ' + token,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ username: username })
      });

      let payload = null;
      try {
        payload = await res.json();
      } catch (e) {}

      if (!res.ok) {
        const code = String(payload?.code || '');
        if (res.status === 409 || code === '23505') {
          const duplicate = new Error('That username is already taken.');
          duplicate.code = 'USERNAME_TAKEN';
          throw duplicate;
        }
        throw new Error(payload?.message || 'Could not save username.');
      }

      if (!Array.isArray(payload) || !payload.length) {
        throw new Error('Could not save username.');
      }

      return username;
    }

    function isDefaultResetUsername(raw) {
      return /^user_[0-9a-f]{8}$/i.test(String(raw || ''));
    }

    function getUsernameNoticeKeys() {
      const userId = RA10.getSession()?.user?.id || RA10.getProfile()?.id || '';
      if (!userId) {
        return null;
      }
      return {
        pendingKey: USERNAME_NOTICE_PENDING_PREFIX + userId,
        lastSeenKey: USERNAME_LAST_VALUE_PREFIX + userId,
      };
    }

    function maybeNotifyUsernameReset(profile) {
      if (!profile) {
        return;
      }
      const keys = getUsernameNoticeKeys();
      if (!keys) {
        return;
      }
      const current = String(profile.username || '');
      const previous = String(localStorage.getItem(keys.lastSeenKey) || '');
      const pending = localStorage.getItem(keys.pendingKey) === '1';

      const currentIsDefault = isDefaultResetUsername(current);
      const previousIsDefault = isDefaultResetUsername(previous);
      const transitionedToDefault = currentIsDefault && !previousIsDefault;
      const transitionedToEmpty = !current && !!previous;

      if (pending || transitionedToDefault || transitionedToEmpty) {
        showMiniToast('Your username was reset for safety. You can change it in Profile settings.');
        localStorage.removeItem(USERNAME_SETUP_DISMISSED_KEY);
        openUsernameSetupOverlayLater();
      }

      if (current && !currentIsDefault) {
        localStorage.removeItem(keys.pendingKey);
      } else if (pending) {
        localStorage.removeItem(keys.pendingKey);
      }

      localStorage.setItem(keys.lastSeenKey, current);
    }

    async function enforceUsernamePolicyForCurrentUser() {
      if (usernamePolicySyncInFlight || !RA10.isLoggedIn()) {
        return;
      }
      const profile = RA10.getProfile();
      const current = String(profile?.username || '');
      if (!current) {
        return;
      }
      const policy = validateUsername(current);
      if (policy.ok && policy.username === current.toLowerCase()) {
        return;
      }

      usernamePolicySyncInFlight = true;
      try {
        const sb = RA10.getClient();
        const session = RA10.getSession();
        if (!session?.user?.id) {
          return;
        }
        const { error } = await sb.from('profiles').update({ username: null }).eq('id', session.user.id);
        if (!error) {
          localStorage.setItem(USERNAME_NOTICE_PENDING_PREFIX + session.user.id, '1');
          await RA10.init();
          _updateNavAuth();
          localStorage.removeItem(USERNAME_SETUP_DISMISSED_KEY);
          maybeNotifyUsernameReset(RA10.getProfile());
        }
      } catch (e) {
        console.warn('username policy enforcement failed', e);
      } finally {
        usernamePolicySyncInFlight = false;
      }
    }

    function clearProfileSetupDismissal() {
      sessionStorage.removeItem(PROFILE_SETUP_DISMISSED_KEY);
      localStorage.removeItem(PROFILE_SETUP_DISMISSED_KEY);
    }

    function openProfileSetupOverlayLater() {
      clearTimeout(profileSetupTimer);
      profileSetupTimer = setTimeout(() => {
        if (!RA10.isLoggedIn()) return;
        const latestProfile = RA10.getProfile();
        const latestName = (latestProfile?.display_name || latestProfile?.full_name || '').trim();
        if (latestName) return;
        if (localStorage.getItem(PROFILE_SETUP_DISMISSED_KEY) === '1') return;
        if (sessionStorage.getItem(PROFILE_SETUP_DISMISSED_KEY) === '1') return;
        document.getElementById('profile-setup-overlay')?.classList.add('open');
      }, 800);
    }

    function openUsernameSetupOverlayLater() {
      clearTimeout(usernameSetupTimer);
      usernameSetupTimer = setTimeout(() => {
        if (!RA10.isLoggedIn()) return;
        const latestProfile = RA10.getProfile();
        if (latestProfile?.username) return;
        if (localStorage.getItem(USERNAME_SETUP_DISMISSED_KEY) === '1') return;
        document.getElementById('username-setup-overlay')?.classList.add('open');
      }, 1000);
    }

    async function checkProfileCompletion() {
      if (!RA10.isLoggedIn()) return;
      if (window.RA10Onboarding && RA10Onboarding.handlesProfile()) return;
      await enforceUsernamePolicyForCurrentUser();
      const profile = RA10.getProfile();
      maybeNotifyUsernameReset(profile);
      const name = (profile?.display_name || profile?.full_name || '').trim();
      if (!name) {
        if (localStorage.getItem(PROFILE_SETUP_DISMISSED_KEY) === '1') return;
        if (sessionStorage.getItem(PROFILE_SETUP_DISMISSED_KEY) === '1') return;
        openProfileSetupOverlayLater();
        return;
      }
      clearProfileSetupDismissal();
      clearTimeout(profileSetupTimer);
      if (!profile?.username) {
        if (localStorage.getItem(USERNAME_SETUP_DISMISSED_KEY) === '1') return;
        openUsernameSetupOverlayLater();
        return;
      }
      localStorage.removeItem(USERNAME_SETUP_DISMISSED_KEY);
      clearTimeout(usernameSetupTimer);
    }

    function closeProfileSetupOverlay() {
      clearTimeout(profileSetupTimer);
      sessionStorage.setItem(PROFILE_SETUP_DISMISSED_KEY, '1');
      localStorage.setItem(PROFILE_SETUP_DISMISSED_KEY, '1');
      document.getElementById('profile-setup-overlay')?.classList.remove('open');
    }

    document.getElementById('profile-setup-close')?.addEventListener('click', closeProfileSetupOverlay);
    document.getElementById('profile-setup-overlay')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('profile-setup-overlay')) closeProfileSetupOverlay();
    });

    document.getElementById('username-setup-skip')?.addEventListener('click', () => {
      clearTimeout(usernameSetupTimer);
      localStorage.setItem(USERNAME_SETUP_DISMISSED_KEY, '1');
      document.getElementById('username-setup-overlay').classList.remove('open');
    });

    document.getElementById('username-setup-btn')?.addEventListener('click', async () => {
      const btn = document.getElementById('username-setup-btn');
      const err = document.getElementById('username-setup-error');
      const originalText = 'Save username';
      btn.disabled = true; btn.textContent = 'Saving...';
      const safetyTimeout = setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalText;
      }, 5000);
      try {
        const policy = validateUsername(document.getElementById('username-setup-input').value);
        const val = policy.username;
        document.getElementById('username-setup-input').value = val;
        err.classList.remove('show');
        if (!policy.ok) {
          err.textContent = policy.error;
          err.classList.add('show');
          return;
        }
        await saveUsernameForCurrentUser(val);
        clearTimeout(safetyTimeout);
        await RA10.init();
        _updateNavAuth();
        localStorage.removeItem(USERNAME_SETUP_DISMISSED_KEY);
        document.getElementById('username-setup-overlay').classList.remove('open');
        checkProfileCompletion();
        showMiniToast('Username saved');
        btn.disabled = false;
        btn.textContent = originalText;
        return;
      } catch(e) {
        err.textContent = e?.code === 'USERNAME_TAKEN'
          ? 'That username is already taken.'
          : (e?.message || 'Could not save. Try again.');
        err.classList.add('show');
        btn.disabled = false;
        btn.textContent = originalText;
      } finally {
        clearTimeout(safetyTimeout);
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });

    document.getElementById('profile-setup-btn').addEventListener('click', async () => {
      const btn = document.getElementById('profile-setup-btn');
      const err = document.getElementById('profile-setup-error');
      const originalText = 'Save and continue';
      btn.disabled = true; btn.textContent = 'Saving...';
      const safetyTimeout = setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalText;
      }, 5000);
      try {
        const namePolicy = validateDisplayName(document.getElementById('profile-setup-name').value);
        const name = namePolicy.value;
        err.classList.remove('show');
        if (!namePolicy.ok) {
          err.textContent = namePolicy.error;
          err.classList.add('show');
          return;
        }
        const sb = RA10.getClient();
        const session = RA10.getSession();
        const { error: nameError } = await sb.from('profiles').update({ full_name: name }).eq('id', session.user.id);
        if (nameError) throw nameError;
        clearTimeout(safetyTimeout);
        await RA10.init();
        _updateNavAuth();
        clearProfileSetupDismissal();
        document.getElementById('profile-setup-overlay').classList.remove('open');
        checkProfileCompletion();
        btn.disabled = false;
        btn.textContent = originalText;
        return;
      } catch(e) {
        err.textContent = 'Could not save. Please try again.';
        err.classList.add('show');
        btn.disabled = false;
        btn.textContent = originalText;
        setTimeout(() => {
          document.getElementById('profile-setup-overlay').classList.remove('open');
        }, 3000);
      } finally {
        clearTimeout(safetyTimeout);
      }
    });

    function checkExamSeasonToast() {
      if (!RA10.isLoggedIn()) return;
      if (localStorage.getItem('ra10_exam_toast_seen')) return;
      if (sessionStorage.getItem('ra10_exam_toast_shown')) return;
      const activity = (typeof RA10.getCreditActivity === 'function') ? (RA10.getCreditActivity(200) || []) : [];
      if (activity.some((entry) => String(entry.source || '') === 'exam_season_bonus')) return;
      const session = RA10.getSession();
      if (!session?.user) return;
      const created = new Date(session.user.created_at);
      if (created >= new Date('2026-05-01') && created < new Date('2026-08-01')) {
        sessionStorage.setItem('ra10_exam_toast_shown', '1');
        setTimeout(() => { document.getElementById('exam-credits-toast').style.display = 'block'; }, 2000);
      }
    }

    if (localStorage.getItem('ra10_banner_hidden')) {
      const b = document.getElementById('exam-banner');
      if (b) b.style.display = 'none';
    }

    window.__ra10ProfileHelpers = {
      validateDisplayName,
      validateUsername,
      saveUsernameForCurrentUser,
      checkProfileCompletion,
      updateNavAuth: _updateNavAuth,
      showMiniToast,
      openAuthModal,
    };
    RA10.on('authchange', () => { if (window.RA10Onboarding) RA10Onboarding.check(); });
    if (window.RA10Onboarding) RA10Onboarding.check();

    RA10.on('authchange', checkProfileCompletion);
    RA10.on('authchange', checkWeeklyXpReset);
    RA10.on('streakchange', () => { if (typeof renderSignedInDashboard === 'function') renderSignedInDashboard(); });
    RA10.on('authchange', checkExamSeasonToast);
    RA10.on('authchange', checkGiftCreditPopup);
    RA10.on('authchange', checkModerationNotice);
    checkProfileCompletion();
    checkWeeklyXpReset();
    checkExamSeasonToast();
    checkGiftCreditPopup();
    checkModerationNotice();

    if (ra10RoutePath() === '/leaderboard') {
      setTimeout(renderLeaderboard, 100);
    }

    function openAuthModal(tab) {
      const overlay = document.getElementById('auth-overlay');
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.zIndex = '2147483600';
      overlay.removeAttribute('hidden');
      overlay.classList.add('open');
      document.body.classList.add('auth-popup-open');
      if(tab) switchAuthTab(tab);
    }
    function closeAuthModal() {
      const overlay = document.getElementById('auth-overlay');
      overlay.classList.remove('open');
      overlay.setAttribute('hidden', '');
      document.body.classList.remove('auth-popup-open');
    }
    function switchAuthTab(tab) {
      ['signin','signup','forgot'].forEach(t => {
        document.getElementById('tab-' + t)?.classList.toggle('active', t === tab);
        document.getElementById('panel-' + t)?.classList.toggle('active', t === tab);
      });
    }

    bindUiEventHandlers();

    function isEmailRateLimitError(error) {
      var msg = String((error && error.message) || '').toLowerCase();
      return msg.includes('rate limit') || msg.includes('over_email_send_rate_limit');
    }

    function getSignupCooldownUntil() {
      var raw = localStorage.getItem('ra10_signup_cooldown_until');
      var n = Number(raw || 0);
      return Number.isFinite(n) ? n : 0;
    }

    function setSignupCooldown(seconds) {
      var until = Date.now() + (seconds * 1000);
      localStorage.setItem('ra10_signup_cooldown_until', String(until));
      return until;
    }

    function clearSignupCooldown() {
      localStorage.removeItem('ra10_signup_cooldown_until');
    }

    document.getElementById('signup-btn').addEventListener('click', async () => {
      const btn = document.getElementById('signup-btn');
      const err = document.getElementById('signup-error');
      const suc = document.getElementById('signup-success');
      err.classList.remove('show'); suc.classList.remove('show');

      const consentBox = document.getElementById('signup-consent');
      if (consentBox && !consentBox.checked) {
        err.textContent = 'Please confirm you are 13 or older and agree to the Terms of Service and Privacy Policy.';
        err.classList.add('show');
        consentBox.focus();
        return;
      }

      const signupNamePolicy = validateDisplayName(document.getElementById('signup-name').value);
      if (!signupNamePolicy.ok) {
        err.textContent = signupNamePolicy.error;
        err.classList.add('show');
        return;
      }

      const signupUsernamePolicy = validateUsername(document.getElementById('signup-username').value || '');
      const hasSignupUsername = String(document.getElementById('signup-username').value || '').trim().length > 0;
      if (hasSignupUsername && !signupUsernamePolicy.ok) {
        err.textContent = signupUsernamePolicy.error;
        err.classList.add('show');
        return;
      }

      var cooldownUntil = getSignupCooldownUntil();
      if (cooldownUntil > Date.now()) {
        var remainingSec = Math.max(1, Math.ceil((cooldownUntil - Date.now()) / 1000));
        suc.textContent = 'Please wait ' + remainingSec + 's before requesting another confirmation email.';
        suc.classList.add('show');
        return;
      }

      btn.disabled = true; btn.textContent = 'Creating account…';
      const signupEmailValue = document.getElementById('signup-email').value;
      const { data: signupData, error } = await RA10.signUp(
        document.getElementById('signup-email').value,
        document.getElementById('signup-password').value,
        signupNamePolicy.value
      );
      btn.disabled = false; btn.textContent = 'Create free account';
      if (error) {
        if (isEmailRateLimitError(error)) {
          setSignupCooldown(60);
          suc.textContent = 'Confirmation email is already on its way. Please check inbox/spam and wait a minute before trying again.';
          suc.classList.add('show');
          return;
        }
        err.textContent = error.message;
        err.classList.add('show');
      }
      else {
        clearSignupCooldown();
        // Consent was given on this form; record it server-side as soon as a
        // session exists (now, or on first sign-in after email confirmation).
        if (window.RA10Onboarding) RA10Onboarding.rememberSignupConsent(signupEmailValue);
        if (signupData && signupData.session && window.RA10Onboarding) RA10Onboarding.check();
        const usernamePolicy = validateUsername(document.getElementById('signup-username').value);
        document.getElementById('signup-username').value = usernamePolicy.username;
        if (usernamePolicy.ok) {
          try {
            const sb = RA10.getClient();
            await sb.from('profiles').update({ username: usernamePolicy.username })
              .eq('email', document.getElementById('signup-email').value.trim());
          } catch(e) { console.warn('username save failed', e); }
        } else if (document.getElementById('signup-username').value.trim()) {
          err.textContent = usernamePolicy.error;
          err.classList.add('show');
        }
        suc.textContent = 'Check your email to confirm your account, then sign in.';
        suc.classList.add('show');
      }
    });

    document.getElementById('forgot-btn').addEventListener('click', async () => {
      const btn = document.getElementById('forgot-btn');
      const err = document.getElementById('forgot-error');
      const suc = document.getElementById('forgot-success');
      err.classList.remove('show'); suc.classList.remove('show');
      btn.disabled = true; btn.textContent = 'Sending…';
      const { error } = await RA10.resetPassword(document.getElementById('forgot-email').value);
      btn.disabled = false; btn.textContent = 'Send reset link';
      if (error) { err.textContent = error.message; err.classList.add('show'); }
      else { suc.textContent = 'Reset link sent — check your email.'; suc.classList.add('show'); }
    });

    document.getElementById('setpw-btn').addEventListener('click', async () => {
      const btn = document.getElementById('setpw-btn');
      const err = document.getElementById('setpw-error');
      const pw = document.getElementById('setpw-input').value;
      const cf = document.getElementById('setpw-confirm').value;
      err.classList.remove('show');
      if (pw.length < 8) {
        err.textContent = 'Password must be at least 8 characters.';
        err.classList.add('show'); return;
      }
      if (pw !== cf) {
        err.textContent = 'Passwords do not match.';
        err.classList.add('show'); return;
      }
      btn.disabled = true;
      btn.textContent = 'Saving...';
      try {
        const ra10 = await waitForRA10Sdk(8000);
        const { error } = await RA10.updatePassword(pw);
        if (error) {
          err.textContent = error.message;
          err.classList.add('show');
          btn.disabled = false;
          btn.textContent = 'Set password';
        } else {
          document.getElementById('set-password-overlay').classList.remove('open');
          await RA10.init();
          _updateNavAuth();
          go('account');
        }
      } catch(e) {
        err.textContent = 'Something went wrong. Please try again.';
        err.classList.add('show');
        btn.disabled = false;
        btn.textContent = 'Set password';
      }
    });

    document.getElementById('nav-user-btn').addEventListener('click', e => {
      e.stopPropagation();
      toggleAccountDropdown();
    });
    document.addEventListener('click', (event) => {
      const wrap = document.getElementById('nav-user-wrap');
      const dropdown = document.getElementById('nav-user-dropdown');
      if (wrap?.contains(event.target) || dropdown?.contains(event.target)) return;
      hideAccountDropdown(true);
    });
    document.getElementById('nav-user-wrap')?.addEventListener('mouseenter', () => showAccountDropdown());
    document.getElementById('nav-user-wrap')?.addEventListener('mouseleave', () => hideAccountDropdown(false));
    document.getElementById('nav-user-dropdown')?.addEventListener('mouseenter', () => showAccountDropdown());
    document.getElementById('nav-user-dropdown')?.addEventListener('mouseleave', () => hideAccountDropdown(false));
    window.addEventListener('resize', positionAccountDropdown);
    window.addEventListener('scroll', positionAccountDropdown, true);

    document.getElementById('nav-signout-btn').addEventListener('click', async () => {
      await RA10.signOut(); go('/');
    });

    document.getElementById('dropdown-reset-pw')?.addEventListener('click', async () => {
      hideAccountDropdown(true);
      const profile = RA10.getProfile();
      if (!profile?.email) return;
      const result = await RA10.resetPassword(profile.email);
      if (!result?.error) {
        alert('Password reset email sent to ' + profile.email + '. Check your inbox.');
      } else {
        alert('Could not send reset email: ' + result.error.message);
      }
    });

    const PURCHASES_TEMPORARILY_DISABLED = false;

    function transitionModeActive() {
      return !!(window.RA10 && window.RA10._raw && window.RA10._raw.TRANSITION_MODE);
    }

    function transitionPopupSeen() {
      try {
        return localStorage.getItem(TRANSITION_POPUP_SEEN_KEY) === '1';
      } catch (e) {
        return false;
      }
    }

    function updateTransitionSignInActions() {
      const signedIn = !!(window.RA10 && typeof RA10.isLoggedIn === 'function' && RA10.isLoggedIn());
      const homeSignIn = document.getElementById('transition-home-signin');
      if (homeSignIn) homeSignIn.style.display = signedIn ? 'none' : '';
      const popupSignIn = document.getElementById('transition-popup-signin');
      if (popupSignIn) popupSignIn.style.display = signedIn ? 'none' : '';
      const popupSignInCopy = document.getElementById('transition-popup-signin-copy');
      if (popupSignInCopy) popupSignInCopy.style.display = signedIn ? 'none' : '';
    }

    // Hides every upgrade / buy entry point while transition mode is on, and
    // swaps the upgrade page body for an "everything is unlocked" notice.
    function applyTransitionModeUi() {
      const on = transitionModeActive();
      const navUpgradeBtn = document.getElementById('nav-upgrade-btn');
      const mobileUpgradeBtn = document.getElementById('mobile-upgrade-btn');
      const dropdownUpgrade = document.getElementById('dropdown-upgrade');
      const mobileYouUpgrade = document.getElementById('mobile-you-upgrade');
      if (navUpgradeBtn) navUpgradeBtn.style.display = on ? 'none' : '';
      if (mobileUpgradeBtn) mobileUpgradeBtn.style.display = on ? 'none' : '';
      if (dropdownUpgrade) dropdownUpgrade.style.display = on ? 'none' : '';
      if (mobileYouUpgrade) mobileYouUpgrade.style.display = on ? 'none' : '';
      const pausedCard = document.getElementById('upgrade-paused-card');
      const upgradeContent = document.getElementById('p-upgrade-content');
      if (pausedCard) pausedCard.style.display = on ? 'block' : 'none';
      if (upgradeContent) upgradeContent.style.display = on ? 'none' : '';
      const manageBillingBtn = document.getElementById('btn-manage-billing');
      if (manageBillingBtn) manageBillingBtn.style.display = on ? 'none' : '';
      if (on) {
        showTransitionPopup();
      }
      updateTransitionSignInActions();
    }

    function showTransitionPopup() {
      if (transitionPopupSeen()) return;
      if (document.getElementById('transition-popup-overlay')) return;
      try { localStorage.setItem(TRANSITION_POPUP_SEEN_KEY, '1'); } catch (e) {}   // one showing only, even if it is dismissed by refreshing
      const overlay = document.createElement('div');
      overlay.id = 'transition-popup-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1200;display:flex;align-items:center;justify-content:center;padding:16px;font-family:sans-serif;';
      const card = document.createElement('div');
      card.style.cssText = 'width:min(520px,100%);background:var(--color-surface,#fff);color:var(--color-text,#101218);border:1px solid var(--color-border,#d6dbe8);border-radius:18px;padding:24px;box-shadow:0 12px 40px rgba(0,0,0,.28);text-align:center;';
      card.innerHTML = ''
        + '<div style="font-size:2rem;line-height:1;margin-bottom:10px;">🎉</div>'
        + '<h3 style="margin:0 0 10px 0;font-size:1.3rem;font-weight:700;">RA10.CO.UK is turning into something new</h3>'
        + '<p style="margin:0 0 16px 0;color:var(--color-text-muted,#5f6780);line-height:1.6;">Payments are paused for now, so as a transition gift <strong>everyone signed in gets unlimited credits</strong> and full access to revision guides and premium features — completely free.</p>'
        + '<p id="transition-popup-signin-copy" style="margin:0 0 16px 0;color:var(--color-text-muted,#5f6780);line-height:1.6;"><strong>You still need to be signed in</strong> to use everything.</p>'
        + '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">'
        +   '<button id="transition-popup-signin" class="btn btn-p" type="button" style="justify-content:center;">Sign in</button>'
        +   '<button id="transition-popup-close" class="btn btn-s" type="button" style="justify-content:center;">Got it</button>'
        + '</div>';
      overlay.appendChild(card);
      document.body.appendChild(overlay);
      updateTransitionSignInActions();
      const markSeen = () => {
        try { localStorage.setItem(TRANSITION_POPUP_SEEN_KEY, '1'); } catch (e) {}
        overlay.remove();
      };
      document.getElementById('transition-popup-close')?.addEventListener('click', markSeen);
      document.getElementById('transition-popup-signin')?.addEventListener('click', () => {
        overlay.remove();
        openAuthModal('signin');
      });
      overlay.addEventListener('click', (e) => { if (e.target === overlay) markSeen(); });
    }

    window.applyTransitionModeUi = applyTransitionModeUi;
    window.showTransitionPopup = showTransitionPopup;

    function showPurchasesPausedPopup() {
      const existing = document.getElementById('purchase-paused-overlay');
      if (existing) {
        existing.style.display = 'flex';
        return;
      }
      const overlay = document.createElement('div');
      overlay.id = 'purchase-paused-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1200;display:flex;align-items:center;justify-content:center;padding:16px;';

      const card = document.createElement('div');
      card.style.cssText = 'width:min(520px,100%);background:var(--color-surface,#fff);color:var(--color-text,#101218);border:1px solid var(--color-border,#d6dbe8);border-radius:18px;padding:20px;box-shadow:0 12px 40px rgba(0,0,0,.28);';
      card.innerHTML = ''
        + '<h3 style="margin:0 0 8px 0;font-size:1.15rem;">Payments are live</h3>'
        + '<p style="margin:0;color:var(--color-text-muted,#5f6780);line-height:1.6;">If checkout does not open, refresh once and try again. Live payments are now enabled on the website.</p>'
        + '<div style="margin-top:16px;display:flex;justify-content:flex-end;">'
        + '<button id="purchase-paused-close" class="btn btn-p" style="justify-content:center;">OK</button>'
        + '</div>';

      overlay.appendChild(card);
      document.body.appendChild(overlay);

      const close = () => { overlay.style.display = 'none'; };
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
      });
      document.getElementById('purchase-paused-close')?.addEventListener('click', close);
    }

    async function lsBuy(plan, subject, extra) {
      if (transitionModeActive()) {
        showTransitionPopup();
        return;
      }
      if (PURCHASES_TEMPORARILY_DISABLED) {
        showPurchasesPausedPopup();
        return;
      }
      if (!RA10.isLoggedIn()) {
        openAuthModal('signin');
        return;
      }
      try {
        const result = await RA10.startCheckout({
          plan: String(plan || '').toUpperCase(),
          subject: subject ? String(subject).toUpperCase() : '',
          credits: Number((extra && extra.credits) || 0),
          amountPence: Number((extra && extra.amountPence) || 0),
          billingInterval: String((extra && extra.billingInterval) || ''),
        });
        window.location.href = result.url;
      } catch (err) {
        const message = (err && err.message) ? String(err.message) : 'Checkout could not be started.';
        alert(message);
      }
    }

    document.getElementById('btn-buy-it')?.addEventListener('click', () => lsBuy('it', 'it'));
    document.getElementById('btn-buy-business')?.addEventListener('click', () => lsBuy('business', 'business'));
    document.getElementById('btn-buy-sport')?.addEventListener('click', () => lsBuy('sport', 'sport'));
    document.getElementById('btn-buy-pro')?.addEventListener('click', () => lsBuy('pro', '', { billingInterval: _billingInterval }));
    document.getElementById('btn-buy-ultra')?.addEventListener('click', () => lsBuy('ultra', '', { billingInterval: _billingInterval }));
    document.getElementById('btn-buy-edu')?.addEventListener('click', () => lsBuy('edu'));
    if (transitionModeActive()) applyTransitionModeUi();

    // ---- Billing interval (monthly vs yearly) ----
    let _billingInterval = 'year';
    window.setBillingInterval = function (interval) {
      _billingInterval = String(interval || 'year');
      const yearly = _billingInterval === 'year';
      const yearlyBtn = document.getElementById('billing-yearly-btn');
      const monthlyBtn = document.getElementById('billing-monthly-btn');
      if (yearlyBtn) { yearlyBtn.classList.toggle('btn-p', yearly); yearlyBtn.classList.toggle('btn-g', !yearly); }
      if (monthlyBtn) { monthlyBtn.classList.toggle('btn-p', !yearly); monthlyBtn.classList.toggle('btn-g', yearly); }
      const proPrice = document.getElementById('pro-price');
      const proPeriod = document.getElementById('pro-price-period');
      const proEquiv = document.getElementById('pro-price-equiv');
      const ultraPrice = document.getElementById('ultra-price');
      const ultraPeriod = document.getElementById('ultra-price-period');
      const ultraEquiv = document.getElementById('ultra-price-equiv');
      const savingsNote = document.getElementById('billing-savings-note');
      if (yearly) {
        if (proPrice) proPrice.textContent = '£20';
        if (proPeriod) proPeriod.textContent = 'per year';
        if (proEquiv) proEquiv.textContent = '£1.67/month equivalent (billed yearly)';
        if (ultraPrice) ultraPrice.textContent = '£30';
        if (ultraPeriod) ultraPeriod.textContent = 'per year';
        if (ultraEquiv) ultraEquiv.textContent = '£2.50/month equivalent (billed yearly)';
        if (savingsNote) savingsNote.textContent = 'Save ~17% with yearly';
      } else {
        if (proPrice) proPrice.textContent = '£2';
        if (proPeriod) proPeriod.textContent = 'per month';
        if (proEquiv) proEquiv.textContent = 'Billed monthly — cancel anytime';
        if (ultraPrice) ultraPrice.textContent = '£3';
        if (ultraPeriod) ultraPeriod.textContent = 'per month';
        if (ultraEquiv) ultraEquiv.textContent = 'Billed monthly — cancel anytime';
        if (savingsNote) savingsNote.textContent = 'Switch to yearly and save ~17%';
      }
    };
    setBillingInterval('year');

    // ---- Credits top-up ----
    const CREDITS_PENCE_PER_CREDIT = 1; // £1 per 100 credits => 1p per credit
    function creditsCostPreview() {
      const input = document.getElementById('credits-amount');
      const preview = document.getElementById('credits-cost-preview');
      const hint = document.getElementById('credits-ultra-hint');
      if (!input) return;
      let amount = Math.max(0, Math.round(Number(input.value || 0) / 100) * 100);
      const costPounds = (amount * CREDITS_PENCE_PER_CREDIT) / 100;
      if (preview) preview.textContent = '£' + costPounds.toFixed(2) + ' for ' + amount + ' credits';
      // Nudge Ultra for larger orders (>= £10 equivalent).
      if (hint) hint.style.display = costPounds >= 10 ? '' : 'none';
    }
    document.getElementById('credits-amount')?.addEventListener('input', creditsCostPreview);
    creditsCostPreview();
    document.getElementById('btn-buy-credits')?.addEventListener('click', () => {
      const input = document.getElementById('credits-amount');
      const amount = Math.max(100, Math.round(Number(input.value || 0) / 100) * 100);
      if (!amount || amount < 100) { alert('Please choose at least 100 credits.'); return; }
      const costPounds = (amount * CREDITS_PENCE_PER_CREDIT) / 100;
      if (costPounds >= 10) {
        const goUltra = confirm('💡 Ultra has unlimited credits for the whole year.\n\nA top-up of ' + amount + ' credits costs £' + costPounds.toFixed(2) + '. Ultra is £30/year with unlimited credits.\n\nContinue with the one-off top-up anyway?');
        if (!goUltra) return;
      }
      lsBuy('credits', '', { credits: amount, amountPence: Math.round(costPounds * 100) });
    });

    function setUpgradeGroup(group) {
      const selected = String(group || 'personal');
      document.querySelectorAll('[data-upgrade-group]').forEach((btn) => {
        const active = btn.getAttribute('data-upgrade-group') === selected;
        btn.classList.toggle('btn-p', active);
        btn.classList.toggle('btn-g', !active);
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      document.querySelectorAll('[data-upgrade-card]').forEach((card) => {
        const show = card.getAttribute('data-upgrade-card') === selected;
        card.style.display = show ? '' : 'none';
      });
      // Only show the billing (yearly/monthly) toggle on personal subscriptions.
      const billingToggle = document.getElementById('upgrade-billing-toggle');
      if (billingToggle) billingToggle.style.display = selected === 'personal' ? '' : 'none';
    }
    window.setUpgradeGroup = setUpgradeGroup;

    document.querySelectorAll('[data-upgrade-group]').forEach((btn) => {
      btn.addEventListener('click', () => setUpgradeGroup(btn.getAttribute('data-upgrade-group')));
    });
    setUpgradeGroup('personal');

    function showUpgradeCheckoutStatus(kind, message) {
      const host = document.getElementById('upgrade-checkout-status');
      if (!host) return;
      const palette = kind === 'ok'
        ? { bg: 'var(--color-success-highlight,#e8f4df)', border: 'var(--color-success,#2e7d32)', text: 'var(--color-text,#102018)' }
        : kind === 'warn'
          ? { bg: 'var(--color-warning-highlight,#fff3e3)', border: 'var(--color-warning,#b4691f)', text: 'var(--color-text,#2a1b0f)' }
          : { bg: 'var(--color-error-soft,#fdecec)', border: 'var(--color-error,#c62828)', text: 'var(--color-text,#2a1111)' };
      host.style.display = '';
      host.style.background = palette.bg;
      host.style.borderColor = palette.border;
      host.style.color = palette.text;
      host.innerHTML = '<strong style="display:block;margin-bottom:6px;">' + (kind === 'ok' ? 'Payment successful' : kind === 'warn' ? 'Checkout update pending' : 'Checkout error') + '</strong>'
        + '<div style="font-size:var(--tx-sm);line-height:1.6;">' + message + '</div>';
    }

    function hasCheckoutStateAdvanced(previousTier, previousCredits, previousSubjects) {
      const nextProfile = RA10.getProfile();
      if (!nextProfile) return false;
      const nextTier = String(RA10.getTier() || '');
      const nextCredits = Number(RA10.getCredits());
      const nextSubjects = Array.isArray(nextProfile.unlocked_subjects) ? nextProfile.unlocked_subjects.filter(Boolean) : [];
      if (nextTier !== String(previousTier || '')) return true;
      if (Number.isFinite(previousCredits) && Number.isFinite(nextCredits) && nextCredits !== previousCredits) return true;
      if (JSON.stringify(nextSubjects) !== JSON.stringify(previousSubjects || [])) return true;
      return false;
    }

    async function confirmCheckoutSession(sessionId) {
      if (!sessionId || !window.RA10 || !RA10.isLoggedIn()) return false;
      const session = RA10.getSession && RA10.getSession();
      const token = session && session.access_token ? session.access_token : '';
      if (!token) return false;
      const endpoint = 'https://tcrrgsylxbyyrmnouihl.supabase.co/functions/v1/confirm-checkout';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ sessionId: String(sessionId) }),
      });
      return !!res.ok;
    }

    async function handleCheckoutReturn() {
      const rawRoute = ra10Route();
      const currentPath = (rawRoute.split('?')[0] || '/');
      if (currentPath !== '/upgrade') return;
      const query = rawRoute.includes('?') ? rawRoute.slice(rawRoute.indexOf('?') + 1) : '';
      const params = new URLSearchParams(query);
      const status = params.get('checkout');
      const sessionId = params.get('session_id') || '';
      if (!status) return;

      if (status === 'success') {
        const previousProfile = RA10.getProfile() || {};
        const previousTier = String(RA10.getTier() || '');
        const previousCredits = Number(RA10.getCredits());
        const previousSubjects = Array.isArray(previousProfile.unlocked_subjects)
          ? previousProfile.unlocked_subjects.filter(Boolean)
          : [];
        setSubscriptionSyncWindow(30000);
        showUpgradeCheckoutStatus('warn', 'Payment received. Updating your account now...');
        try {
          const confirmed = await confirmCheckoutSession(sessionId);
          if (confirmed) {
            showUpgradeCheckoutStatus('warn', 'Payment received. Finalising your account now...');
          } else {
            showUpgradeCheckoutStatus('warn', 'Payment succeeded, but profile update is still syncing. It should appear shortly after webhook processing.');
          }
        } catch (e) {
          showUpgradeCheckoutStatus('warn', 'Payment succeeded, but immediate sync failed. Webhook processing should still update your account shortly.');
        }
        let synced = false;
        for (let i = 0; i < 10; i++) {
          try {
            await RA10.refreshProfile();
            await _updateNavAuth();
            window.dispatchEvent(new Event('ra10:profilerefreshed'));
            if (hasCheckoutStateAdvanced(previousTier, previousCredits, previousSubjects)) {
              synced = true;
              break;
            }
          } catch (e) {}
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }
        if (synced) {
          showUpgradeCheckoutStatus('ok', 'Your plan is now active and your account has been updated.');
        } else {
          showUpgradeCheckoutStatus('warn', 'Payment succeeded, but the account update is still syncing. It should appear automatically shortly.');
        }
      } else if (status === 'cancel') {
        showUpgradeCheckoutStatus('warn', 'Checkout was cancelled. No payment was taken.');
      }

      history.replaceState(null, '', '/upgrade');
      route();
    }

    handleCheckoutReturn();

    document.getElementById('btn-account-signout')?.addEventListener('click', async () => {
      await RA10.signOut(); go('/');
    });

    document.getElementById('btn-manage-billing')?.addEventListener('click', async () => {
      const btn = document.getElementById('btn-manage-billing');
      const original = btn ? btn.textContent : 'Manage billing';
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Opening...';
      }
      try {
        const result = await RA10.startBillingPortal({
          returnUrl: window.location.origin + '/#/account',
        });
        if (!result || !result.url) throw new Error('Billing portal is unavailable right now.');
        window.location.href = result.url;
      } catch (e) {
        alert((e && e.message) ? e.message : 'Could not open billing portal.');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = original;
        }
      }
    });

    document.getElementById('account-change-name-btn')?.addEventListener('click', () => {
      document.getElementById('account-name-edit').style.display = 'block';
      document.getElementById('account-name-error').classList.remove('show');
      document.getElementById('account-name-input')?.focus();
    });

    document.getElementById('account-change-username-btn')?.addEventListener('click', () => {
      document.getElementById('account-username-edit').style.display = 'block';
      document.getElementById('account-username-error').classList.remove('show');
      document.getElementById('account-username-input')?.focus();
    });

    document.getElementById('account-change-badge-btn')?.addEventListener('click', () => {
      document.getElementById('account-badge-edit').style.display = 'block';
      document.getElementById('account-badge-error').classList.remove('show');
      document.getElementById('account-badge-input')?.focus();
    });

    document.getElementById('account-change-pic-btn')?.addEventListener('click', () => {
      document.getElementById('account-pic-edit').style.display = 'block';
      document.getElementById('account-pic-error').classList.remove('show');
      const inputEl = document.getElementById('account-pic-input');
      const current = String((inputEl && inputEl.dataset && inputEl.dataset.currentPicUrl) || '').trim();
      if (inputEl) inputEl.value = '';
      renderAccountPicturePreview(current);
      document.getElementById('account-pic-input')?.focus();
    });

    document.getElementById('account-pic-input')?.addEventListener('input', (ev) => {
      const raw = String((ev && ev.target && ev.target.value) || '');
      const parsed = validateProfileImageUrl(raw);
      renderAccountPicturePreview(parsed.ok ? parsed.value : '');
    });

    document.getElementById('account-upload-pic-btn')?.addEventListener('click', () => {
      const fileInput = document.getElementById('account-pic-file-input');
      const err = document.getElementById('account-pic-error');
      err?.classList.remove('show');
      if (!fileInput) return;
      fileInput.value = '';
      fileInput.click();
    });

    document.getElementById('account-delete-pic-btn')?.addEventListener('click', async () => {
      const err = document.getElementById('account-pic-error');
      const btn = document.getElementById('account-delete-pic-btn');
      const input = document.getElementById('account-pic-input');
      err?.classList.remove('show');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Deleting...';
      }
      try {
        const sb = RA10.getClient();
        const session = RA10.getSession();
        const currentUserId = session?.user?.id || RA10.getProfile()?.id || '';
        if (!currentUserId) throw new Error('You are not signed in. Please refresh and try again.');
        await updateCurrentUserProfilePicture(sb, currentUserId, null);
        await deleteOwnProfilePictureStorage();
        const currentPicLabel = document.getElementById('account-profile-pic-current');
        if (currentPicLabel) currentPicLabel.textContent = 'No profile picture set';
        if (input) {
          input.dataset.currentPicUrl = '';
          input.value = '';
        }
        renderAccountPicturePreview('');
        renderAccountPictureDisplay('');
        await RA10.init();
        _updateNavAuth();
        showMiniToast('Profile picture deleted');
      } catch (e) {
        if (err) {
          err.textContent = e.message || 'Could not delete profile picture.';
          err.classList.add('show');
        }
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Delete picture';
        }
      }
    });

    document.getElementById('account-pic-file-input')?.addEventListener('change', async (ev) => {
      const fileInput = ev && ev.target;
      const file = fileInput && fileInput.files && fileInput.files[0];
      if (!file) return;
      const err = document.getElementById('account-pic-error');
      const uploadBtn = document.getElementById('account-upload-pic-btn');
      const picInput = document.getElementById('account-pic-input');
      err?.classList.remove('show');
      if (uploadBtn) {
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';
      }
      try {
        const uploadedUrl = await uploadProfilePictureToCatbox(file);
        const parsed = validateProfileImageUrl(uploadedUrl);
        if (!parsed.ok) throw new Error(parsed.error || 'Uploaded image URL is invalid.');
        if (picInput) {
          picInput.dataset.currentPicUrl = parsed.value;
          picInput.value = '';
        }
        renderAccountPicturePreview(parsed.value);
        showMiniToast('Image uploaded. Click Save to apply.');
      } catch (e) {
        if (err) {
          err.textContent = e.message || 'Could not upload image.';
          err.classList.add('show');
        }
      } finally {
        if (uploadBtn) {
          uploadBtn.disabled = false;
          uploadBtn.textContent = 'Upload image';
        }
        if (fileInput) fileInput.value = '';
      }
    });

    document.getElementById('account-save-name-btn')?.addEventListener('click', async () => {
      const err = document.getElementById('account-name-error');
      const btn = document.getElementById('account-save-name-btn');
      const namePolicy = validateDisplayName(document.getElementById('account-name-input').value);
      const val = namePolicy.value;
      err.classList.remove('show');
      if (!namePolicy.ok) {
        err.textContent = namePolicy.error;
        err.classList.add('show');
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Saving...';
      try {
        const sb = RA10.getClient();
        const session = RA10.getSession();
        const { error } = await sb.from('profiles').update({ full_name: val }).eq('id', session.user.id);
        if (error) throw error;
        await RA10.init();
        _updateNavAuth();
        document.getElementById('account-name-edit').style.display = 'none';
        showMiniToast('Profile updated');
      } catch (e) {
        err.textContent = e.message || 'Could not save profile.';
        err.classList.add('show');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Save';
      }
    });

    document.getElementById('account-save-username-btn')?.addEventListener('click', async () => {
      const err = document.getElementById('account-username-error');
      const btn = document.getElementById('account-save-username-btn');
      const policy = validateUsername(document.getElementById('account-username-input').value);
      const val = policy.username;
      document.getElementById('account-username-input').value = val;
      err.classList.remove('show');
      if (!policy.ok) {
        err.textContent = policy.error;
        err.classList.add('show');
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Saving...';
      try {
        await saveUsernameForCurrentUser(val);
        await RA10.init();
        _updateNavAuth();
        document.getElementById('account-username-edit').style.display = 'none';
        showMiniToast('Username updated');
      } catch (e) {
        err.textContent = e?.code === 'USERNAME_TAKEN'
          ? 'That username is already taken.'
          : (e?.message || 'Could not save username.');
        err.classList.add('show');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Save';
      }
    });

    document.getElementById('account-save-badge-btn')?.addEventListener('click', async () => {
      const err = document.getElementById('account-badge-error');
      const btn = document.getElementById('account-save-badge-btn');
      const input = document.getElementById('account-badge-input');
      const val = String((input && input.value) || '').trim().slice(0, 8);
      if (input) input.value = val;
      err.classList.remove('show');
      btn.disabled = true;
      btn.textContent = 'Saving...';
      try {
        const sb = RA10.getClient();
        const session = RA10.getSession();
        const currentUserId = session?.user?.id || RA10.getProfile()?.id || '';
        if (!currentUserId) {
          throw new Error('You are not signed in. Please refresh and try again.');
        }
        const { error } = await sb.from('profiles').update({ leaderboard_badge: val || null }).eq('id', currentUserId);
        if (error) throw error;
        await RA10.init();
        _updateNavAuth();
        document.getElementById('account-badge-edit').style.display = 'none';
        showMiniToast('Badge updated');
      } catch (e) {
        err.textContent = e.message || 'Could not save badge.';
        err.classList.add('show');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Save';
      }
    });

    document.getElementById('account-save-pic-btn')?.addEventListener('click', async () => {
      const err = document.getElementById('account-pic-error');
      const btn = document.getElementById('account-save-pic-btn');
      const input = document.getElementById('account-pic-input');
      const parsed = validateProfileImageUrl(input ? input.value : '');
      const currentStored = String((input && input.dataset && input.dataset.currentPicUrl) || '').trim();
      const desiredUrl = String(parsed.value || '').trim() || currentStored;
      err.classList.remove('show');
      if (!parsed.ok) {
        err.textContent = parsed.error || 'Please enter a valid image URL.';
        err.classList.add('show');
        return;
      }
      if (!desiredUrl) {
        err.textContent = 'Upload an image or paste a URL first.';
        err.classList.add('show');
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Saving...';
      try {
        const sb = RA10.getClient();
        const session = RA10.getSession();
        const currentUserId = session?.user?.id || RA10.getProfile()?.id || '';
        if (!currentUserId) throw new Error('You are not signed in. Please refresh and try again.');
        const oldStored = String((input && input.dataset && input.dataset.currentPicUrl) || '').trim();
        const oldWasSupabase = /\/storage\/v1\/object\/public\/profile-pics\//i.test(oldStored);
        const nextIsSupabase = /\/storage\/v1\/object\/public\/profile-pics\//i.test(desiredUrl);
        if (oldWasSupabase && !nextIsSupabase) {
          try {
            await deleteOwnProfilePictureStorage();
          } catch (e) {}
        }
        await updateCurrentUserProfilePicture(sb, currentUserId, desiredUrl || null);
        let savedPicUrl = await fetchCurrentUserProfilePicture(sb, currentUserId);
        const expected = desiredUrl;
        if (savedPicUrl !== expected) {
          await upsertCurrentUserProfilePicture(sb, currentUserId, desiredUrl || null);
          savedPicUrl = await fetchCurrentUserProfilePicture(sb, currentUserId);
        }
        if (savedPicUrl !== expected) {
          throw new Error('Save did not persist. Your profile row could not be updated.');
        }
        const currentPicLabel = document.getElementById('account-profile-pic-current');
        if (currentPicLabel) currentPicLabel.textContent = savedPicUrl ? 'Profile picture set' : 'No profile picture set';
        if (input) {
          input.dataset.currentPicUrl = savedPicUrl || '';
          input.value = '';
        }
        renderAccountPicturePreview(savedPicUrl);
        renderAccountPictureDisplay(savedPicUrl);
        await RA10.init();
        _updateNavAuth();
        document.getElementById('account-pic-edit').style.display = 'none';
        showMiniToast(desiredUrl ? 'Profile picture updated' : 'Profile picture removed');
      } catch (e) {
        err.textContent = e.message || 'Could not save profile picture.';
        err.classList.add('show');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Save';
      }
    });

    document.getElementById('owner-remove-profile-pic-btn')?.addEventListener('click', async () => {
      const err = document.getElementById('owner-profile-pic-error');
      const suc = document.getElementById('owner-profile-pic-success');
      const btn = document.getElementById('owner-remove-profile-pic-btn');
      const input = document.getElementById('owner-profile-pic-target');
      const target = String((input && input.value) || '').trim();
      err.classList.remove('show');
      suc.classList.remove('show');
      if (!target) {
        err.textContent = 'Enter a username, email, or user id.';
        err.classList.add('show');
        return;
      }
      const profile = RA10.getProfile();
      if (!isOwnerAccount(profile)) {
        err.textContent = 'Only the owner can remove profile pictures.';
        err.classList.add('show');
        return;
      }
      const reasonInput = document.getElementById('owner-profile-pic-reason');
      const messageInput = document.getElementById('owner-profile-pic-message');
      const reasonCode = String((reasonInput && reasonInput.value) || 'policy_violation').trim();
      const reasonMessage = String((messageInput && messageInput.value) || '').trim();
      btn.disabled = true;
      btn.textContent = 'Removing...';
      try {
        const data = await callAuthedFunction('remove-profile-picture', {
          target,
          reason_code: reasonCode,
          reason_message: reasonMessage || null,
        });
        const who = String((data && data.target) || target);
        suc.textContent = 'Removed profile picture for ' + who + '.';
        suc.classList.add('show');
        if (input) input.value = '';
        if (messageInput) messageInput.value = '';
        await loadOwnerProfilePictures({ force: true, silent: false });
        await RA10.refreshProfile();
        _updateNavAuth();
      } catch (e) {
        err.textContent = e.message || 'Could not remove profile picture.';
        err.classList.add('show');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Remove picture';
      }
    });

    document.getElementById('owner-refresh-profile-pics-btn')?.addEventListener('click', async () => {
      await loadOwnerProfilePictures({ force: true, silent: false });
    });

    document.getElementById('owner-profile-pic-list')?.addEventListener('click', async (ev) => {
      const btn = ev && ev.target && ev.target.closest ? ev.target.closest('.owner-inline-remove-pic-btn') : null;
      if (!btn) return;
      const target = String(btn.getAttribute('data-owner-remove-target') || '').trim();
      if (!target) return;
      const err = document.getElementById('owner-profile-pic-error');
      const suc = document.getElementById('owner-profile-pic-success');
      err?.classList.remove('show');
      suc?.classList.remove('show');
      const profile = RA10.getProfile();
      if (!isOwnerAccount(profile)) {
        if (err) {
          err.textContent = 'Only the owner can remove profile pictures.';
          err.classList.add('show');
        }
        return;
      }
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Removing...';
      try {
        const data = await callAuthedFunction('remove-profile-picture', {
          target,
          reason_code: 'policy_violation',
          reason_message: null,
        });
        const who = String((data && data.target) || target);
        if (suc) {
          suc.textContent = 'Removed profile picture for ' + who + '.';
          suc.classList.add('show');
        }
        await loadOwnerProfilePictures({ force: true, silent: false });
      } catch (e) {
        if (err) {
          err.textContent = e.message || 'Could not remove profile picture.';
          err.classList.add('show');
        }
      } finally {
        btn.disabled = false;
        btn.textContent = original || 'Remove';
      }
    });

    document.getElementById('gift-credit-send-btn')?.addEventListener('click', async () => {
      const err = document.getElementById('gift-credit-error');
      const suc = document.getElementById('gift-credit-success');
      const btn = document.getElementById('gift-credit-send-btn');
      const emailInput = document.getElementById('gift-credit-email');
      const amountInput = document.getElementById('gift-credit-amount');
      const noteInput = document.getElementById('gift-credit-note');
      const email = String((emailInput && emailInput.value) || '').trim().toLowerCase();
      const amount = Number((amountInput && amountInput.value) || 0);
      const note = String((noteInput && noteInput.value) || '').trim();
      err.classList.remove('show');
      suc.classList.remove('show');
      if (!isOwnerAccount(RA10.getProfile())) {
        err.textContent = 'Only the owner can send gift credits.';
        err.classList.add('show');
        return;
      }
      if (!email || !email.includes('@')) {
        err.textContent = 'Enter a valid recipient email.';
        err.classList.add('show');
        return;
      }
      if (!Number.isFinite(amount) || amount < 1 || amount > 5000) {
        err.textContent = 'Enter a credit amount between 1 and 5000.';
        err.classList.add('show');
        return;
      }
      if (note.length > 180) {
        err.textContent = 'Note must be 180 characters or less.';
        err.classList.add('show');
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Sending...';
      try {
        const data = await callAuthedRpc('grant_credit_gift_by_email', {
          target_email: email,
          gift_amount: Math.floor(amount),
          gift_note: note || null
        });
        const result = Array.isArray(data) ? data[0] : data;
        if (!result || !result.ok) {
          throw new Error((result && result.message) || 'Could not send credits.');
        }
        suc.textContent = 'Gift sent to ' + email + ' (' + Math.floor(amount) + ' credits).';
        suc.classList.add('show');
        if (emailInput) emailInput.value = '';
        if (amountInput) amountInput.value = '';
        if (noteInput) noteInput.value = '';
        await loadSentCreditGifts({ force: true, silent: false });
        await RA10.refreshProfile();
        _updateNavAuth();
      } catch (e) {
        err.textContent = e.message || 'Could not send gift credits.';
        err.classList.add('show');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Send gift';
      }
    });

    document.getElementById('owner-reset-username-btn')?.addEventListener('click', async () => {
      const err = document.getElementById('owner-profile-pic-error');
      const suc = document.getElementById('owner-profile-pic-success');
      const btn = document.getElementById('owner-reset-username-btn');
      const targetInput = document.getElementById('owner-username-target');
      const reasonInput = document.getElementById('owner-username-reason');
      const messageInput = document.getElementById('owner-username-message');
      const target = String((targetInput && targetInput.value) || '').trim();
      const reasonCode = String((reasonInput && reasonInput.value) || 'username_policy').trim();
      const reasonMessage = String((messageInput && messageInput.value) || '').trim();
      err.classList.remove('show');
      suc.classList.remove('show');
      if (!target) {
        err.textContent = 'Enter a username, email, or user id.';
        err.classList.add('show');
        return;
      }
      if (!isOwnerAccount(RA10.getProfile())) {
        err.textContent = 'Only the owner can reset usernames.';
        err.classList.add('show');
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Resetting...';
      try {
        const data = await callAuthedFunction('reset-username', {
          target,
          reason_code: reasonCode,
          reason_message: reasonMessage || null,
        });
        const who = String((data && data.target) || target);
        suc.textContent = 'Username reset for ' + who + '.';
        suc.classList.add('show');
        if (targetInput) targetInput.value = '';
        if (messageInput) messageInput.value = '';
      } catch (e) {
        err.textContent = e.message || 'Could not reset username.';
        err.classList.add('show');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Reset username';
      }
    });

    document.getElementById('owner-announcement-publish-btn')?.addEventListener('click', async () => {
      const err = document.getElementById('owner-announcement-error');
      const suc = document.getElementById('owner-announcement-success');
      const btn = document.getElementById('owner-announcement-publish-btn');
      const messageInput = document.getElementById('owner-announcement-message');
      const emojiInput = document.getElementById('owner-announcement-emoji');
      const durationInput = document.getElementById('owner-announcement-duration');

      err?.classList.remove('show');
      suc?.classList.remove('show');

      if (!isOwnerAccount(RA10.getProfile())) {
        if (err) {
          err.textContent = 'Only the owner can publish announcements.';
          err.classList.add('show');
        }
        return;
      }

      const message = String((messageInput && messageInput.value) || '').trim();
      const emoji = String((emojiInput && emojiInput.value) || '📣').trim() || '📣';
      const durationHours = Number((durationInput && durationInput.value) || 24);

      if (!message || message.length < 3) {
        if (err) {
          err.textContent = 'Announcement message must be at least 3 characters.';
          err.classList.add('show');
        }
        return;
      }
      if (message.length > 240) {
        if (err) {
          err.textContent = 'Announcement message must be 240 characters or less.';
          err.classList.add('show');
        }
        return;
      }
      if (!Number.isFinite(durationHours) || durationHours < 1 || durationHours > 168) {
        if (err) {
          err.textContent = 'Duration must be between 1 and 168 hours.';
          err.classList.add('show');
        }
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Publishing...';
      try {
        await callAuthedFunction('site-announcement', {
          action: 'set',
          message,
          emoji,
          duration_hours: Math.floor(durationHours),
        });
        if (suc) {
          suc.textContent = 'Announcement published.';
          suc.classList.add('show');
        }
        await refreshSiteAnnouncement({ silent: false });
      } catch (e) {
        if (err) {
          err.textContent = e.message || 'Could not publish announcement.';
          err.classList.add('show');
        }
      } finally {
        btn.disabled = false;
        btn.textContent = 'Publish announcement';
      }
    });

    document.getElementById('owner-announcement-clear-btn')?.addEventListener('click', async () => {
      const err = document.getElementById('owner-announcement-error');
      const suc = document.getElementById('owner-announcement-success');
      const btn = document.getElementById('owner-announcement-clear-btn');

      err?.classList.remove('show');
      suc?.classList.remove('show');

      if (!isOwnerAccount(RA10.getProfile())) {
        if (err) {
          err.textContent = 'Only the owner can clear announcements.';
          err.classList.add('show');
        }
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Clearing...';
      try {
        await callAuthedFunction('site-announcement', { action: 'clear' });
        if (suc) {
          suc.textContent = 'Announcement cleared.';
          suc.classList.add('show');
        }
        await refreshSiteAnnouncement({ silent: false });
      } catch (e) {
        if (err) {
          err.textContent = e.message || 'Could not clear announcement.';
          err.classList.add('show');
        }
      } finally {
        btn.disabled = false;
        btn.textContent = 'Clear announcement';
      }
    });

    document.getElementById('gift-credit-popup-close')?.addEventListener('click', async () => {
      const popup = document.getElementById('gift-credit-popup');
      if (!popup || !window.supabase || !RA10.isLoggedIn()) {
        if (popup) popup.style.display = 'none';
        return;
      }
      const ids = String(popup.dataset.ids || '').split(',').map((v) => Number(v)).filter((n) => Number.isFinite(n));
      try {
        if (ids.length) {
          await callAuthedRpc('mark_credit_gifts_seen', { gift_ids: ids });
        }
      } catch (e) {
        console.warn('mark gift popup seen failed', e);
      }
      popup.style.display = 'none';
      popup.dataset.ids = '';
    });

    document.getElementById('moderation-popup-close')?.addEventListener('click', async () => {
      const popup = document.getElementById('moderation-popup');
      if (!popup || !window.supabase || !RA10.isLoggedIn()) {
        if (popup) popup.style.display = 'none';
        return;
      }
      const userId = String(popup.dataset.userId || '').trim();
      if (userId) {
        try {
          const query = '?id=eq.' + encodeURIComponent(userId);
          await authedProfilesRequest('PATCH', query, { moderation_notice_seen: true }, null);
        } catch (e) {
          console.warn('mark moderation notice seen failed', e);
        }
      }
      popup.style.display = 'none';
      popup.dataset.userId = '';
    });

    document.getElementById('btn-account-delete')?.addEventListener('click', () => {
      document.getElementById('account-delete-confirm-input').value = '';
      document.getElementById('account-delete-error').classList.remove('show');
      document.getElementById('account-delete-overlay').classList.add('open');
    });

    document.getElementById('account-delete-cancel')?.addEventListener('click', () => {
      document.getElementById('account-delete-overlay').classList.remove('open');
    });

    document.getElementById('account-delete-overlay')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('account-delete-overlay')) {
        document.getElementById('account-delete-overlay').classList.remove('open');
      }
    });

    document.getElementById('account-delete-confirm')?.addEventListener('click', async () => {
      const input = document.getElementById('account-delete-confirm-input');
      const err = document.getElementById('account-delete-error');
      const msg = document.getElementById('account-delete-message');
      const btn = document.getElementById('account-delete-confirm');
      err.classList.remove('show');
      if ((input.value || '').trim() !== 'DELETE') {
        err.textContent = 'Please type DELETE to confirm.';
        err.classList.add('show');
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Processing...';
      try {
        const sb = RA10.getClient();
        await sb.auth.signOut();
        document.getElementById('account-delete-overlay').classList.remove('open');
        msg.textContent = 'Account deletion requested — contact contact@ra10studios.co.uk to complete removal.';
        msg.style.display = 'block';
      } catch (e) {
        err.textContent = 'Could not process request. Please try again.';
        err.classList.add('show');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Confirm request';
      }
    });

    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'RA10_OPEN_AUTH') {
        openAuthModal('signin');
      }
    });

    if (ra10RoutePath() === '/auth') {
      go('/');
      setTimeout(() => openAuthModal('signin'), 100);
    }
  });
