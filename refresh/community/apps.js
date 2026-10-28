/* RA10 Community — study apps library + app viewer.
   Mirrors the official unit apps: hero card with stat tiles, launchpad tiles,
   a chaptered guide, exam-style practice, quiz, flashcards and progress.
   Uses the helpers and data functions that live in index.html. */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (v) { return communityEscape(v); };
  var S = function () { return window.__caState; };

  var THEMES = {
    business: ['#1e3a8a', '#3b82f6'], it: ['#065f46', '#10b981'], sport: ['#6d28d9', '#d946ef'], maths: ['#b45309', '#f59e0b'],
    science: ['#0f766e', '#22d3ee'], english: ['#9f1239', '#fb7185'], history: ['#7c2d12', '#fb923c'], general: ['#334155', '#94a3b8']
  };
  var FALLBACK = [['#7a0000', '#ef4444'], ['#312e81', '#818cf8'], ['#134e4a', '#2dd4bf'], ['#831843', '#f472b6']];
  function themeOf(app) {
    var k = String(app.subject || '').toLowerCase().trim();
    if (THEMES[k]) return THEMES[k];
    var h = 0; for (var i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) >>> 0;
    return FALLBACK[h % FALLBACK.length];
  }
  function themeStyle(app) { var t = themeOf(app); return '--c1:' + t[0] + ';--c2:' + t[1]; }
  function boardLabel(app) { var b = String(app.exam_board || '').trim(); return b && b !== 'Mixed' && b !== 'Other' ? b : ''; }
  function me() { try { return RA10 && RA10.isLoggedIn && RA10.isLoggedIn() ? String(RA10.getSession().user.id) : ''; } catch (e) { return ''; } }
  function isStaff() { return !!(window.RA10Forum && RA10Forum.isStaff && RA10Forum.isStaff()); }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
  function ago(iso) {
    var t = new Date(iso).getTime(); if (!t) return '';
    var d = Math.floor((Date.now() - t) / 86400000);
    if (d < 1) return 'today'; if (d < 2) return 'yesterday'; if (d < 30) return d + 'd ago';
    if (d < 365) return Math.floor(d / 30) + 'mo ago'; return Math.floor(d / 365) + 'y ago';
  }
  function reduceMotion() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  var I = {
    heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>',
    chat: '<path d="M21 11.5a8.38 8.38 0 0 1-9 8.3 9.5 9.5 0 0 1-4.6-1.2L3 20l1.4-4.1A8.5 8.5 0 1 1 21 11.5z"/>',
    pin: '<path d="M12 17v4"/><path d="M9 3h6l-1 6v4l2 2H8l2-2V9z"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4"/><path d="m8.6 13.5 6.8 4"/>',
    book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5V4.5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
    cards: '<rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 6V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2"/>',
    sparkle: '<path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/>',
    back: '<path d="M15 18l-6-6 6-6"/>', next: '<path d="M9 18l6-6-6-6"/>', check: '<path d="m5 12 5 5 9-10"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>', plus: '<path d="M12 5v14M5 12h14"/>', refresh: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/>', trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', shuffle: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>', grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'
  };
  function ic(name, size) { return '<svg class="ca-i" ' + (size ? 'style="width:' + size + 'px;height:' + size + 'px" ' : '') + 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[name] + '</svg>'; }

  /* ── progress (per app, per device) ─────────────────────────────────── */
  function progKey(id) { return 'ra10-capp:' + (me() || 'guest') + ':' + id; }
  function loadProg(id) { try { return Object.assign({ guide: {}, known: {}, practised: {}, quizBest: null }, JSON.parse(localStorage.getItem(progKey(id)) || '{}')); } catch (e) { return { guide: {}, known: {}, practised: {}, quizBest: null }; } }
  function saveProg() { var st = S().open; if (!st) return; try { localStorage.setItem(progKey(st.app.id), JSON.stringify(st.prog)); } catch (e) {} }

  /* ── tiny markdown ───────────────────────────────────────────────────── */
  function inline(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>').replace(/`([^`]+)`/g, '<code>$1</code>'); }
  function md(text) {
    var out = [], list = null;
    function close() { if (list) { out.push('</' + list + '>'); list = null; } }
    String(text || '').split(/\r?\n/).forEach(function (raw) {
      var l = raw.trim();
      if (!l) { close(); return; }
      var h = l.match(/^(#{1,4})\s+(.*)$/);
      if (h) { close(); var n = Math.min(h[1].length + 2, 5); out.push('<h' + n + '>' + inline(h[2]) + '</h' + n + '>'); return; }
      var b = l.match(/^[-*•]\s+(.*)$/);
      if (b) { if (list !== 'ul') { close(); out.push('<ul>'); list = 'ul'; } out.push('<li>' + inline(b[1]) + '</li>'); return; }
      var nn = l.match(/^\d+[.)]\s+(.*)$/);
      if (nn) { if (list !== 'ol') { close(); out.push('<ol>'); list = 'ol'; } out.push('<li>' + inline(nn[1]) + '</li>'); return; }
      close();
      var call = l.match(/^(exam tip|tip|key term|key point|remember|watch out|example)\s*[:\-–]\s*(.*)$/i);
      if (call) { out.push('<div class="ca-callout"><b>' + esc(call[1].replace(/\b\w/g, function (c) { return c.toUpperCase(); })) + '</b>' + inline(call[2]) + '</div>'); return; }
      out.push('<p>' + inline(l) + '</p>');
    });
    close();
    return out.join('');
  }

  /* ── library ─────────────────────────────────────────────────────────── */
  var lib = { level: '', sort: 'new', saved: false, loading: false };
  var LEVELS = ['GCSE', 'A-Level', 'BTEC Level 2', 'BTEC Level 3', 'IB', 'Undergraduate'];

  function toolbarHtml() {
    return '<div class="ca-toolbar">' +
      '<label class="ca-search">' + ic('search') + '<input id="community-search" type="search" placeholder="Search apps by title, subject or topic…" autocomplete="off" aria-label="Search study apps"></label>' +
      '<select id="community-subject-filter" class="ca-select" aria-label="Subject"><option value="">All subjects</option><option>Business</option><option>IT</option><option>Sport</option><option>Maths</option><option>Science</option><option>English</option><option>History</option><option>General</option></select>' +
      '<select id="ca-level" class="ca-select" aria-label="Level"><option value="">Any level</option>' + LEVELS.map(function (l) { return '<option>' + l + '</option>'; }).join('') + '</select>' +
      '<select id="ca-sort" class="ca-select" aria-label="Sort"><option value="new">Newest</option><option value="popular">Most liked</option><option value="discussed">Most discussed</option></select>' +
      '<button id="community-refresh-btn" class="ca-iconbtn" type="button" title="Refresh" aria-label="Refresh">' + ic('refresh') + '</button>' +
      '<button id="community-new-app-btn" class="ca-btn primary" type="button">' + ic('plus') + 'Create app</button></div>';
  }
  function bindToolbar() {
    var lv = $('#ca-level'), so = $('#ca-sort');
    if (lv && !lv.dataset.bound) { lv.dataset.bound = '1'; lv.addEventListener('change', function () { lib.level = lv.value; loadLibrary(); }); }
    if (so && !so.dataset.bound) { so.dataset.bound = '1'; so.addEventListener('change', function () { lib.sort = so.value; loadLibrary(); }); }
  }

  function skeleton() { var o = ''; for (var i = 0; i < 6; i++) o += '<div class="ca-card skel"><div class="ca-cover"></div><div class="ca-card-body"><i></i><i></i><i></i></div></div>'; return o; }

  function cardHtml(app, ctx, i) {
    var creator = ctx.creators[String(app.creator_id)] || communityResolveCreator(app.creator_id);
    var name = communityUserLabel(creator, app.creator_id), pic = String(creator.profile_pic_url || '').trim();
    var title = String(app.title || '').trim() || ((app.subject || 'General') + ' Revision App');
    var desc = String(app.description || '').trim() || ('AI-built revision materials for ' + (app.subject || 'this subject') + '.');
    var liked = !!ctx.liked[String(app.id)], pinned = ctx.pinned.indexOf(String(app.id)) >= 0, board = boardLabel(app);
    var tags = Array.isArray(app.tags) ? app.tags.slice(0, 3) : [];
    var open = S().open && String(S().open.app.id) === String(app.id);
    var id = String(app.id);
    return '<article class="ca-card' + (open ? ' on' : '') + '" style="' + themeStyle(app) + ';--i:' + Math.min(i, 12) + '" role="link" tabindex="0" onclick="communityOpenApp(\'' + id + '\')" onkeydown="if(event.target===this&&(event.key===\'Enter\'||event.key===\' \')){event.preventDefault();communityOpenApp(\'' + id + '\');}" aria-label="Open ' + esc(title) + '">' +
      '<div class="ca-cover"><span class="ca-emoji" aria-hidden="true">' + esc(String(app.icon_emoji || '📘')) + '</span>' + (board ? '<span class="ca-board">' + esc(board) + '</span>' : '') +
      '<button class="ca-pinbtn' + (pinned ? ' on' : '') + '" type="button" aria-pressed="' + pinned + '" aria-label="' + (pinned ? 'Unsave' : 'Save') + ' ' + esc(title) + '" title="' + (pinned ? 'Remove from saved' : 'Save for later') + '" onclick="event.stopPropagation();communityTogglePin(\'' + id + '\',event)">' + ic('pin', 16) + '</button></div>' +
      '<div class="ca-card-body"><div class="ca-kicker">' + esc(app.subject || 'General') + ' · ' + esc(app.level || 'Mixed') + '</div>' +
      '<h3>' + esc(title) + '</h3><p>' + esc(desc) + '</p>' +
      (tags.length ? '<div class="ca-tags">' + tags.map(function (t) { return '<span>#' + esc(t) + '</span>'; }).join('') + '</div>' : '') +
      '<div class="ca-card-foot"><span class="ca-by"><span class="ca-av">' + (pic ? '<img src="' + esc(pic) + '" alt="" loading="lazy">' : esc(communityInitials(name))) + '</span><span>' + esc(name) + '</span>' + (creator.badge === 'owner' ? '<em class="ca-role o">👑</em>' : creator.badge === 'admin' ? '<em class="ca-role a">🛡️</em>' : '') + '</span>' +
      '<span class="ca-stats"><button type="button" class="ca-stat' + (liked ? ' on' : '') + '" aria-pressed="' + liked + '" aria-label="' + (liked ? 'Unlike' : 'Like') + '" onclick="event.stopPropagation();communityToggleLike(\'' + id + '\',event)">' + ic('heart', 15) + (app.like_count || 0) + '</button>' +
      '<button type="button" class="ca-stat" aria-label="Comments" onclick="event.stopPropagation();communityOpenComments(\'' + id + '\')">' + ic('chat', 15) + (app.comment_count || 0) + '</button>' +
      '<button type="button" class="ca-stat" aria-label="Share" onclick="event.stopPropagation();communityShareApp(\'' + id + '\')">' + ic('share', 15) + '</button></span></div></div></article>';
  }

  async function loadLibrary() {
    var host = $('#community-library'); if (!host) return;
    var qtext = String(($('#community-search') || {}).value || '').trim().toLowerCase();
    var subj = String(($('#community-subject-filter') || {}).value || '').trim();
    if (!host.dataset.loaded) host.innerHTML = skeleton();
    var order = lib.sort === 'popular' ? 'like_count.desc,created_at.desc' : lib.sort === 'discussed' ? 'comment_count.desc,created_at.desc' : 'created_at.desc';
    var path = 'community_apps?select=id,title,description,subject,level,exam_board,tags,icon_emoji,cover_image_url,credit_cost,like_count,comment_count,creator_id,uses_deeptutor,created_at&status=eq.published&visibility=eq.public&order=' + order + '&limit=80';
    if (subj) path += '&subject=eq.' + encodeURIComponent(subj);
    if (lib.level) path += '&level=eq.' + encodeURIComponent(lib.level);
    try {
      var rows = await communityRest(path, 'GET', null, false);
      var all = Array.isArray(rows) ? rows : [];
      var st = S();
      st.apps = all.filter(function (r) { return !qtext || [r.title, r.description, r.subject, r.level, r.exam_board, (r.tags || []).join(' ')].join(' ').toLowerCase().indexOf(qtext) >= 0; });
      var cnt = $('#community-stat-count'); if (cnt) cnt.textContent = all.length;
      var creatorIds = Array.from(new Set(st.apps.map(function (x) { return String(x.creator_id || ''); }).filter(Boolean)));
      var creators = await communityLoadPublicProfiles(creatorIds); st.creators = creators;
      var liked = {};
      if (me()) {
        try {
          var ids = st.apps.map(function (x) { return String(x.id); });
          if (ids.length) { var lr = await communityRest('community_app_likes?select=app_id&user_id=eq.' + encodeURIComponent(me()) + '&app_id=in.(' + ids.map(encodeURIComponent).join(',') + ')', 'GET', null, true); (lr || []).forEach(function (r) { liked[String(r.app_id)] = true; }); }
        } catch (e) { /* likes are optional */ }
      }
      var pinned = communityGetPinnedIds();
      var ctx = { creators: creators, liked: liked, pinned: pinned };
      var savedApps = pinned.map(function (id) { return st.apps.filter(function (a) { return String(a.id) === id; })[0]; }).filter(Boolean);
      var list = lib.saved ? savedApps : st.apps;
      host.dataset.loaded = '1';
      var html = '';
      if (savedApps.length && !lib.saved) {
        html += '<section class="ca-saved community-pinned-section"><div class="ca-sec-head"><h2>📌 Saved for you</h2><span>' + savedApps.length + '</span></div><div class="ca-saved-row">' + savedApps.map(function (a) {
          return '<button type="button" class="ca-mini" style="' + themeStyle(a) + '" onclick="communityOpenApp(\'' + a.id + '\')"><span class="ca-mini-ico">' + esc(String(a.icon_emoji || '📘')) + '</span><span><b>' + esc(a.title || 'Study app') + '</b><small>' + esc(a.subject || 'General') + ' · ' + esc(a.level || '') + '</small></span></button>';
        }).join('') + '</div></section>';
      }
      html += '<div class="ca-sec-head"><h2>' + (lib.saved ? 'Saved apps' : (qtext || subj || lib.level ? 'Results' : 'All study apps')) + '</h2><span>' + plural(list.length, 'app') + '</span>' +
        '<button type="button" class="ca-chip' + (lib.saved ? ' on' : '') + '" data-ca-saved aria-pressed="' + lib.saved + '">' + ic('pin', 14) + 'Saved only</button></div>';
      html += list.length ? '<div class="ca-grid">' + list.map(function (a, i) { return cardHtml(a, ctx, i); }).join('') + '</div>'
        : '<div class="ca-empty"><div class="ca-empty-ico">🔎</div><h3>' + (lib.saved ? 'Nothing saved yet' : 'No apps match') + '</h3><p>' + (lib.saved ? 'Tap the pin on any app to keep it here.' : 'Try different filters — or build the app yourself in a minute.') + '</p><button type="button" class="ca-btn primary" onclick="document.getElementById(\'community-new-app-btn\').click()">Create an app</button></div>';
      host.innerHTML = html;
      var sv = $('[data-ca-saved]', host); if (sv) sv.onclick = function () { lib.saved = !lib.saved; loadLibrary(); };
    } catch (e) {
      host.innerHTML = '<div class="ca-empty"><div class="ca-empty-ico">⚠️</div><h3>Couldn’t load study apps</h3><p>' + esc((e && e.message) || 'Check your connection and try again.') + '</p><button type="button" class="ca-btn" onclick="loadCommunityApps()">Try again</button></div>';
    }
  }

  /* ── view switching ──────────────────────────────────────────────────── */
  function showLibrary() {
    var lv = $('#ca-library-view'), ap = $('#community-open-app');
    if (lv) lv.hidden = false; if (ap) ap.hidden = true;
  }
  function closeApp() { S().open = null; showLibrary(); loadLibrary(); var t = $('.cf-tabs'); if (t && t.scrollIntoView) t.scrollIntoView({ block: 'start' }); }

  /* ── open an app ─────────────────────────────────────────────────────── */
  async function openApp(appId) {
    var host = $('#community-open-app'); if (!host) return;
    var st = S(); var app = st.apps.filter(function (x) { return String(x.id) === String(appId); })[0];
    if (!app) return;
    var lv = $('#ca-library-view'); if (lv) lv.hidden = true;
    host.hidden = false;
    host.innerHTML = '<div class="ca-app" style="' + themeStyle(app) + '"><div class="ca-loading"><div class="ca-spin"></div><p>Opening ' + esc(app.title || 'app') + '…</p></div></div>';
    var t = $('.cf-tabs'); if (t && t.scrollIntoView) t.scrollIntoView({ block: 'start' });

    var preview = false, canAuth = !!me();
    if (!canAuth) preview = true;
    else {
      try { var spent = await RA10.spendCredits('community_open_app'); if (!spent) { preview = true; showMiniToast('Opened in preview mode (full open needs credits).'); } }
      catch (e) { preview = true; showMiniToast('Opened in preview mode.'); }
    }
    var rows = [];
    try { rows = await communityRest('community_app_contents?select=kind,payload&app_id=eq.' + encodeURIComponent(appId), 'GET', null, canAuth && !preview); }
    catch (e) { try { rows = await communityRest('community_app_contents?select=kind,payload&app_id=eq.' + encodeURIComponent(appId), 'GET', null, false); preview = true; } catch (e2) { rows = []; } }
    var byKind = {}; (Array.isArray(rows) ? rows : []).forEach(function (x) { byKind[String(x.kind)] = String(x.payload || ''); });
    var meta = {}; try { meta = JSON.parse(byKind.metadata || '{}'); } catch (e) { meta = {}; }
    var guide = communityParseGuideSections(byKind.revision_guide || '');
    st.open = {
      app: app, byKind: byKind, metadata: meta, preview: preview, view: 'overview',
      guide: guide, guideIdx: 0,
      questionBank: communityNormalizeQuestionBank(communityParseArray(byKind.question_bank || '[]')), qIdx: 0, qDrafts: {}, qShowScheme: false, qFilter: '',
      flashcards: communityParseArray(byKind.flashcards || '[]'), cardIdx: 0, cardFlip: false, cardOnlyUnknown: false,
      quiz: communityParseArray(byKind.quiz || '[]'), quizRun: null,
      canOwnerControls: !!me() && me() === String(app.creator_id || ''),
      prog: loadProg(app.id)
    };
    draw();
    if (st.creators && !st.creators[String(app.creator_id)]) { var c = await communityLoadPublicProfiles([String(app.creator_id)]); Object.assign(st.creators, c); draw(); }
    await communityLoadComments(appId);
    $$('.ca-card').forEach(function (c2) { c2.classList.toggle('on', c2.getAttribute('onclick').indexOf(String(appId)) >= 0); });
    if (window._updateNavAuth) { try { await window._updateNavAuth(); } catch (e3) {} }
  }

  /* ── app shell ───────────────────────────────────────────────────────── */
  var TABS = [['overview', 'Overview', 'grid'], ['guide', 'Guide', 'book'], ['practice', 'Practice', 'target'], ['quiz', 'Quiz', 'bolt'], ['cards', 'Flashcards', 'cards']];
  function counts() {
    var s = S().open;
    return { guide: s.guide.length, q: s.questionBank.length, quiz: s.quiz.length, cards: s.flashcards.length };
  }
  function draw() {
    var host = $('#community-open-app'), s = S().open; if (!host || !s) return;
    var app = s.app, creator = (S().creators || {})[String(app.creator_id)] || communityResolveCreator(app.creator_id);
    var cname = communityUserLabel(creator, app.creator_id), pic = String(creator.profile_pic_url || '').trim();
    var c = counts(), board = boardLabel(app);
    var title = String(app.title || '').trim() || ((app.subject || 'General') + ' Revision App');
    var mine = me() === String(app.creator_id || ''), staff = isStaff();
    var tabs = TABS.slice(); if (s.canOwnerControls) tabs.push(['refine', 'Refine', 'sparkle']);
    var pinned = communityGetPinnedIds().indexOf(String(app.id)) >= 0;
    host.innerHTML = '<div class="ca-app" style="' + themeStyle(app) + '">' +
      '<nav class="ca-crumbs" aria-label="Breadcrumb"><button type="button" class="ca-back" data-ca="close">' + ic('back', 16) + 'Study apps</button><span>›</span><b>' + esc(title) + '</b></nav>' +
      (s.preview ? '<div class="ca-banner">👀 Preview mode — sign in with credits to unlock everything in this app.</div>' : '') +
      '<header class="ca-hero"><div class="ca-hero-copy"><div class="ca-eyebrow">' + esc([board, app.level, app.subject].filter(Boolean).join(' · ')) + ' — community app</div>' +
      '<h1><span class="ca-hero-ico" aria-hidden="true">' + esc(String(app.icon_emoji || '📘')) + '</span>' + esc(title) + '</h1>' +
      '<p>' + esc(String(app.description || '').trim() || 'An AI-built revision app with a guide, exam-style questions, a quiz and flashcards.') + '</p>' +
      '<div class="ca-hero-meta"><span class="ca-by"><span class="ca-av">' + (pic ? '<img src="' + esc(pic) + '" alt="" loading="lazy">' : esc(communityInitials(cname))) + '</span><span>by <b>' + esc(cname) + '</b></span>' + (creator.badge === 'owner' ? '<em class="ca-role o">👑 Owner</em>' : creator.badge === 'admin' ? '<em class="ca-role a">🛡️ Admin</em>' : '') + '</span><span class="ca-dim">' + ago(app.created_at) + '</span></div>' +
      '<div class="ca-hero-actions"><button type="button" class="ca-btn" data-ca="like">' + ic('heart', 16) + (app.like_count || 0) + ' Like</button>' +
      '<button type="button" class="ca-btn' + (pinned ? ' on' : '') + '" data-ca="pin">' + ic('pin', 16) + (pinned ? 'Saved' : 'Save') + '</button>' +
      '<button type="button" class="ca-btn" data-ca="share">' + ic('share', 16) + 'Share</button>' +
      '<button type="button" class="ca-btn" data-ca="comments">' + ic('chat', 16) + (app.comment_count || 0) + '</button>' +
      (staff && !mine ? '<button type="button" class="ca-btn" data-ca="hide">' + ic('eye', 16) + (app.status === 'hidden' ? 'Unhide' : 'Hide') + '</button>' : '') +
      ((mine || staff) ? '<button type="button" class="ca-btn danger" data-ca="delete">' + ic('trash', 16) + 'Delete</button>' : '') + '</div></div>' +
      '<div class="ca-tiles">' + [[c.q, 'Practice questions'], [c.quiz, 'Quiz questions'], [c.cards, 'Flashcards'], [c.guide, 'Guide chapters']].map(function (t) { return '<div class="ca-tile"><b>' + t[0] + '</b><span>' + t[1] + '</span></div>'; }).join('') + '</div></header>' +
      '<nav class="ca-tabs" role="tablist" aria-label="App sections">' + tabs.map(function (t) { return '<button type="button" role="tab" class="ca-tab' + (s.view === t[0] ? ' on' : '') + '" aria-selected="' + (s.view === t[0]) + '" data-ca-tab="' + t[0] + '">' + ic(t[2], 16) + '<span>' + t[1] + '</span></button>'; }).join('') + '</nav>' +
      '<div id="ca-body" class="ca-body"></div>' +
      '<section class="community-comment-section ca-discussion"><h2>Discussion <span id="community-comments-count"></span></h2>' +
      '<div class="community-comment-input-row"><input id="community-comment-input" class="auth-input" type="text" maxlength="320" placeholder="Ask a question or leave feedback for the creator…" onkeydown="if(event.key===\'Enter\'){event.preventDefault();communityPostComment(\'' + app.id + '\');}"><button class="ca-btn primary" type="button" onclick="communityPostComment(\'' + app.id + '\')">Post</button></div>' +
      '<div id="community-comments" class="community-comment-list"></div></section></div>';
    drawBody();
  }

  // Re-read the app row from the refreshed library so like counts etc. stay current.
  function syncApp() {
    var st = S(); if (!st.open) return;
    var fresh = st.apps.filter(function (a) { return String(a.id) === String(st.open.app.id); })[0];
    if (fresh) st.open.app = fresh;
    var keep = $('#community-comment-input'); var val = keep ? keep.value : '';
    draw(); var ni = $('#community-comment-input'); if (ni && val) ni.value = val;
    communityLoadComments(st.open.app.id);
  }
  function setView(v) { var s = S().open; if (!s) return; s.view = v; $$('.ca-tab').forEach(function (b) { var on = b.dataset.caTab === v; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); }); drawBody(); var tb = $('.ca-tabs'); if (tb && tb.getBoundingClientRect().top < 0) tb.scrollIntoView({ block: 'start', behavior: reduceMotion() ? 'auto' : 'smooth' }); }
  function drawBody() {
    var body = $('#ca-body'), s = S().open; if (!body || !s) return;
    ({ overview: viewOverview, guide: viewGuide, practice: viewPractice, quiz: viewQuiz, cards: viewCards, refine: viewRefine }[s.view] || viewOverview)(body, s);
  }
  function empty(body, icon, h, p) { body.innerHTML = '<div class="ca-empty inline"><div class="ca-empty-ico">' + icon + '</div><h3>' + h + '</h3><p>' + p + '</p></div>'; }
  function bar(done, total) { var p = total ? Math.round(done / total * 100) : 0; return '<span class="ca-prog" role="progressbar" aria-valuenow="' + p + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + p + '%"></i></span>'; }

  /* ── overview (launchpad) ────────────────────────────────────────────── */
  function viewOverview(body, s) {
    var c = counts(), p = s.prog;
    var read = Object.keys(p.guide).length, known = Object.keys(p.known).length, prac = Object.keys(p.practised).length;
    function tile(cls, view, icon, h, d, meta, prog) {
      return '<button type="button" class="ca-launch ' + cls + '" data-ca-go="' + view + '"><span class="ca-launch-ico">' + ic(icon, 22) + '</span><span class="ca-launch-copy"><b>' + h + '</b><span>' + d + '</span><small>' + meta + '</small>' + (prog || '') + '</span></button>';
    }
    body.innerHTML = '<div class="ca-launchpad">' +
      tile('primary', 'guide', 'book', 'Revision guide', 'Chapter-by-chapter notes with tips and key terms', c.guide ? plural(c.guide, 'chapter') + ' · ' + read + ' read' : 'No guide in this app', c.guide ? bar(read, c.guide) : '') +
      tile('primary', 'practice', 'target', 'Exam-style practice', 'Write answers and get marked by the AI Examiner', c.q ? plural(c.q, 'question') + ' · ' + prac + ' attempted' : 'No questions in this app', c.q ? bar(prac, c.q) : '') +
      tile('', 'quiz', 'bolt', 'Quick quiz', 'Multiple choice with instant feedback', c.quiz ? plural(c.quiz, 'question') + (p.quizBest != null ? ' · best ' + p.quizBest + '%' : '') : 'No quiz in this app', c.quiz && p.quizBest != null ? bar(p.quizBest, 100) : '') +
      tile('', 'cards', 'cards', 'Flashcards', 'Flip, then mark what you know', c.cards ? plural(c.cards, 'card') + ' · ' + known + ' known' : 'No flashcards in this app', c.cards ? bar(known, c.cards) : '') +
      (s.canOwnerControls ? tile('', 'refine', 'sparkle', 'Refine with AI', 'Ask the AI to add questions, cards or improve the quiz', 'Creator only') : '') + '</div>' +
      (s.metadata && (s.metadata.topics || s.metadata.focus_topics) ? '<div class="ca-card-box"><h3>Covers</h3><div class="ca-tags big">' + [].concat(s.metadata.topics || s.metadata.focus_topics).slice(0, 12).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div></div>' : '');
  }

  /* ── guide ───────────────────────────────────────────────────────────── */
  function viewGuide(body, s) {
    if (!s.guide.length) return empty(body, '📘', 'No guide yet', 'This app doesn’t include a revision guide.');
    var i = Math.max(0, Math.min(s.guide.length - 1, s.guideIdx)), g = s.guide[i], read = s.prog.guide[i];
    body.innerHTML = '<div class="ca-guide"><aside class="ca-toc" aria-label="Chapters"><div class="ca-toc-head">Chapters <span>' + Object.keys(s.prog.guide).length + '/' + s.guide.length + '</span></div>' +
      s.guide.map(function (x, n) { return '<button type="button" class="ca-toc-item' + (n === i ? ' on' : '') + (s.prog.guide[n] ? ' done' : '') + '" data-ca-ch="' + n + '"><i>' + (s.prog.guide[n] ? ic('check', 12) : (n + 1)) + '</i><span>' + esc(x.title || ('Chapter ' + (n + 1))) + '</span></button>'; }).join('') + '</aside>' +
      '<article class="ca-chapter"><select class="ca-select ca-toc-select" aria-label="Chapter" data-ca-chsel>' + s.guide.map(function (x, n) { return '<option value="' + n + '"' + (n === i ? ' selected' : '') + '>' + (n + 1) + '. ' + esc(x.title || 'Chapter') + '</option>'; }).join('') + '</select>' +
      '<div class="ca-chapter-kick">Chapter ' + (i + 1) + ' of ' + s.guide.length + '</div><h2>' + esc(g.title || ('Chapter ' + (i + 1))) + '</h2><div class="ca-prose">' + md(g.body) + '</div>' +
      '<div class="ca-chapter-foot"><button type="button" class="ca-btn" data-ca-ch="' + (i - 1) + '"' + (i === 0 ? ' disabled' : '') + '>' + ic('back', 16) + 'Previous</button>' +
      '<button type="button" class="ca-btn ' + (read ? 'on' : '') + '" data-ca-read="' + i + '">' + ic('check', 16) + (read ? 'Read' : 'Mark as read') + '</button>' +
      '<button type="button" class="ca-btn primary" data-ca-ch="' + (i + 1) + '"' + (i === s.guide.length - 1 ? ' disabled' : '') + '>Next' + ic('next', 16) + '</button></div></article></div>';
  }

  /* ── practice (exam-style) ───────────────────────────────────────────── */
  function viewPractice(body, s) {
    var all = s.questionBank; if (!all.length) return empty(body, '🎯', 'No questions yet', 'This app doesn’t include practice questions.');
    var idxs = all.map(function (q, n) { return n; }).filter(function (n) { return !s.qFilter || all[n].topic === s.qFilter; });
    if (!idxs.length) { s.qFilter = ''; idxs = all.map(function (q, n) { return n; }); }
    if (idxs.indexOf(s.qIdx) < 0) s.qIdx = idxs[0];
    var n = s.qIdx, item = all[n], pos = idxs.indexOf(n), marks = communityGetQuestionMarks(item);
    var topics = Array.from(new Set(all.map(function (q) { return q.topic; }).filter(Boolean)));
    var ms = item.mark_scheme || {};
    var points = (ms.points || []).concat(ms.indicative_content || []);
    body.innerHTML = '<div class="ca-practice"><div class="ca-prac-bar"><div class="ca-dots" role="list" aria-label="Questions">' + idxs.map(function (k, j) { return '<button type="button" role="listitem" class="ca-dot' + (k === n ? ' on' : '') + (s.prog.practised[k] ? ' done' : '') + '" data-ca-q="' + k + '" aria-label="Question ' + (j + 1) + '">' + (j + 1) + '</button>'; }).join('') + '</div>' +
      (topics.length > 1 ? '<select class="ca-select" data-ca-qfilter aria-label="Topic"><option value="">All topics</option>' + topics.map(function (t) { return '<option' + (t === s.qFilter ? ' selected' : '') + '>' + esc(t) + '</option>'; }).join('') + '</select>' : '') + '</div>' +
      '<article class="ca-qcard"><div class="ca-qhead"><span class="ca-qnum">Q' + (pos + 1) + '<small> / ' + idxs.length + '</small></span><span class="ca-marks">' + marks + ' mark' + (marks === 1 ? '' : 's') + '</span>' + (item.command_verb ? '<span class="ca-chip static">' + esc(item.command_verb) + '</span>' : '') + (item.topic ? '<span class="ca-chip static">' + esc(item.topic) + '</span>' : '') + '<span class="ca-time">' + ic('clock', 14) + '~' + Math.max(1, Math.round(marks * 1.2)) + ' min</span></div>' +
      (item.scenario ? '<div class="ca-scenario"><b>Scenario</b>' + esc(item.scenario) + '</div>' : '') +
      '<p class="ca-qtext">' + esc(communityGetQuestionText(item, n)) + '</p>' +
      '<textarea id="community-answer-input" class="ca-answer" rows="' + Math.max(6, Math.min(16, marks * 2)) + '" placeholder="Write your answer here…" aria-label="Your answer">' + esc(s.qDrafts[n] || '') + '</textarea>' +
      '<div class="ca-ansfoot"><span class="ca-dim" id="ca-wc">0 words</span><div class="ca-ansbtns"><button type="button" class="ca-btn" data-ca-mark="marker">' + ic('bolt', 16) + 'Quick mark</button><button type="button" class="ca-btn primary" data-ca-mark="examiner">' + ic('sparkle', 16) + 'AI Examiner</button></div></div>' +
      '<div id="community-ai-output" class="ca-ai" style="display:none"></div>' +
      '<div class="ca-scheme-wrap"><button type="button" class="ca-btn" data-ca-scheme>' + ic('eye', 16) + (s.qShowScheme ? 'Hide mark scheme' : 'Show mark scheme') + '</button>' +
      (s.qShowScheme ? '<div class="ca-scheme">' + (points.length ? '<h4>What earns marks</h4><ul>' + points.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' : '<p class="ca-dim">No mark scheme was provided.</p>') + (ms.explanation ? '<p>' + esc(ms.explanation) + '</p>' : '') + '</div>' : '') + '</div></article>' +
      '<div class="ca-chapter-foot"><button type="button" class="ca-btn" data-ca-qstep="-1"' + (pos === 0 ? ' disabled' : '') + '>' + ic('back', 16) + 'Previous</button><button type="button" class="ca-btn primary" data-ca-qstep="1"' + (pos === idxs.length - 1 ? ' disabled' : '') + '>Next' + ic('next', 16) + '</button></div></div>';
    var ta = $('#community-answer-input'), wc = $('#ca-wc');
    function count() { var w = ta.value.trim().split(/\s+/).filter(Boolean).length; wc.textContent = plural(w, 'word'); }
    ta.addEventListener('input', function () { s.qDrafts[n] = ta.value; count(); }); count();
  }
  async function runMark(mode) {
    var s = S().open, ta = $('#community-answer-input'), out = $('#community-ai-output'); if (!s || !ta || !out) return;
    var answer = ta.value.trim(); out.style.display = '';
    if (!answer) { out.innerHTML = '<p class="ca-dim">Write your answer first.</p>'; return; }
    var n = s.qIdx; s.qDrafts[n] = ta.value;
    out.innerHTML = '<div class="ca-marking"><div class="ca-spin sm"></div> ' + (mode === 'examiner' ? 'The AI Examiner is reading your answer…' : 'Marking…') + '</div>';
    try {
      var payload = { question: communityBuildQuestionObject(s.questionBank[n], n), answer: answer };
      var res = mode === 'examiner' ? await RA10.examineAnswer(payload) : await RA10.aiMarkAnswer(payload);
      var r = res && res.result; if (!r) { out.innerHTML = '<p class="ca-dim">No marking result came back.</p>'; return; }
      s.prog.practised[n] = 1; saveProg();
      var pct = Math.round((Number(r.earned) || 0) / Math.max(Number(r.max) || 1, 1) * 100);
      var list = function (a) { return Array.isArray(a) && a.length ? '<ul>' + a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : ''; };
      out.innerHTML = '<div class="ca-score"><div class="ca-ring" style="--p:' + pct + '"><b>' + esc(r.earned) + '<small>/' + esc(r.max) + '</small></b></div><div><h4>' + (pct >= 70 ? 'Strong answer' : pct >= 40 ? 'Getting there' : 'Needs work') + '</h4>' + (r.feedback ? '<p>' + esc(r.feedback) + '</p>' : '') + '</div></div>' +
        (Array.isArray(r.strengths) && r.strengths.length ? '<h5 class="pro">What worked</h5>' + list(r.strengths) : '') + (Array.isArray(r.improvements) && r.improvements.length ? '<h5 class="con">How to improve</h5>' + list(r.improvements) : '');
      var dot = $('.ca-dot.on'); if (dot) dot.classList.add('done');
    } catch (e) { out.innerHTML = '<p class="ca-dim">' + esc((e && e.message) || 'Could not mark that answer.') + '</p>'; }
  }

  /* ── quiz ────────────────────────────────────────────────────────────── */
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function viewQuiz(body, s) {
    var all = s.quiz; if (!all.length) return empty(body, '⚡', 'No quiz yet', 'This app doesn’t include a quiz.');
    var run = s.quizRun;
    if (!run) {
      var opts = [10, 20, all.length].filter(function (v, i, a) { return v <= all.length && a.indexOf(v) === i; });
      body.innerHTML = '<div class="ca-quizstart"><div class="ca-qs-ico">⚡</div><h2>Quick quiz</h2><p>' + plural(all.length, 'question') + ' with instant feedback' + (s.prog.quizBest != null ? ' · your best is <b>' + s.prog.quizBest + '%</b>' : '') + '.</p>' +
        '<div class="ca-qs-opts">' + opts.map(function (o, i) { return '<button type="button" class="ca-chip' + (i === 0 ? ' on' : '') + '" data-ca-qn="' + o + '">' + (o === all.length ? 'All ' + o : o + ' questions') + '</button>'; }).join('') + '</div>' +
        '<button type="button" class="ca-btn primary big" data-ca-qstart>Start quiz</button></div>';
      var first = $('[data-ca-qn]', body); if (first) body.dataset.qn = first.dataset.caQn;
      return;
    }
    if (run.done) {
      var pct = Math.round(run.correct / Math.max(run.graded, 1) * 100);
      var wrong = run.order.filter(function (k) { var a = run.answers[k]; var ex = communityResolveQuizAnswerIndex(all[k]); return ex >= 0 && a !== ex; });
      body.innerHTML = '<div class="ca-result"><div class="ca-ring big" style="--p:' + pct + '"><b>' + pct + '%</b><small>' + run.correct + ' / ' + run.graded + '</small></div><h2>' + (pct >= 80 ? 'Brilliant!' : pct >= 50 ? 'Nice work' : 'Keep going') + '</h2><p>' + (pct >= 80 ? 'You really know this topic.' : pct >= 50 ? 'A bit more practice and you’ll nail it.' : 'Revisit the guide, then try again.') + '</p>' +
        '<div class="ca-chapter-foot center"><button type="button" class="ca-btn" data-ca-quizreset>Back</button><button type="button" class="ca-btn primary" data-ca-qstart>Try again</button></div>' +
        (wrong.length ? '<div class="ca-review"><h3>Review your mistakes</h3>' + wrong.map(function (k) { var q = all[k], ex = communityResolveQuizAnswerIndex(q), a = run.answers[k]; return '<div class="ca-rv"><b>' + esc(q.question) + '</b><span class="bad">Your answer: ' + esc((q.options || [])[a] || '—') + '</span><span class="good">Correct: ' + esc((q.options || [])[ex]) + '</span>' + (q.explanation ? '<small>' + esc(q.explanation) + '</small>' : '') + '</div>'; }).join('') + '</div>' : '') + '</div>';
      return;
    }
    var k = run.order[run.pos], q = all[k] || {}, options = Array.isArray(q.options) ? q.options : [];
    var ex = communityResolveQuizAnswerIndex(q), picked = run.answers[k], answered = picked != null;
    body.innerHTML = '<div class="ca-quiz"><div class="ca-qtop"><span>Question ' + (run.pos + 1) + ' of ' + run.order.length + '</span><span class="ca-dim">' + run.correct + ' correct</span></div>' + bar(run.pos + (answered ? 1 : 0), run.order.length) +
      '<p class="ca-quiz-q">' + esc(q.question || ('Question ' + (run.pos + 1))) + '</p><div class="ca-opts" role="radiogroup">' +
      options.map(function (o, i) {
        var cls = answered ? (ex === i ? 'right' : (picked === i ? 'wrong' : 'dim')) : '';
        return '<button type="button" role="radio" aria-checked="' + (picked === i) + '" class="ca-opt ' + cls + '" data-ca-opt="' + i + '"' + (answered ? ' disabled' : '') + '><i>' + String.fromCharCode(65 + i) + '</i><span>' + esc(o) + '</span></button>';
      }).join('') + '</div>' +
      (answered ? '<div class="ca-feedback ' + (ex < 0 ? '' : picked === ex ? 'good' : 'bad') + '"><b>' + (ex < 0 ? 'No answer key for this one' : picked === ex ? '✓ Correct!' : '✗ Not quite') + '</b>' + (q.explanation ? '<p>' + esc(q.explanation) + '</p>' : '') + '</div><div class="ca-chapter-foot right"><button type="button" class="ca-btn primary" data-ca-qnext>' + (run.pos === run.order.length - 1 ? 'See results' : 'Next') + ic('next', 16) + '</button></div>' : '') + '</div>';
  }
  function startQuiz(n) {
    var s = S().open; var order = shuffle(s.quiz.map(function (q, i) { return i; })).slice(0, n || s.quiz.length);
    s.quizRun = { order: order, pos: 0, answers: {}, correct: 0, graded: 0, done: false }; drawBody();
  }
  function pickOption(i) {
    var s = S().open, run = s.quizRun, k = run.order[run.pos]; if (run.answers[k] != null) return;
    run.answers[k] = i; var ex = communityResolveQuizAnswerIndex(s.quiz[k]);
    if (ex >= 0) { run.graded++; if (i === ex) run.correct++; } drawBody();
  }
  function nextQuiz() {
    var s = S().open, run = s.quizRun;
    if (run.pos >= run.order.length - 1) {
      run.done = true; var pct = Math.round(run.correct / Math.max(run.graded, 1) * 100);
      if (s.prog.quizBest == null || pct > s.prog.quizBest) s.prog.quizBest = pct; saveProg();
    } else run.pos++;
    drawBody();
  }

  /* ── flashcards ──────────────────────────────────────────────────────── */
  function cardList(s) { var l = s.flashcards.map(function (c, i) { return i; }); return s.cardOnlyUnknown ? l.filter(function (i) { return !s.prog.known[i]; }) : l; }
  function viewCards(body, s) {
    if (!s.flashcards.length) return empty(body, '🃏', 'No flashcards yet', 'This app doesn’t include flashcards.');
    var list = cardList(s);
    if (!list.length) { body.innerHTML = '<div class="ca-empty inline"><div class="ca-empty-ico">🎉</div><h3>You know them all!</h3><p>Every card is marked as known.</p><button type="button" class="ca-btn primary" data-ca-resetcards>Start again</button></div>'; return; }
    if (s.cardIdx >= list.length) s.cardIdx = 0;
    var i = list[s.cardIdx], c = s.flashcards[i] || {}, known = Object.keys(s.prog.known).length;
    body.innerHTML = '<div class="ca-cards"><div class="ca-qtop"><span>Card ' + (s.cardIdx + 1) + ' of ' + list.length + '</span><span class="ca-dim">' + known + '/' + s.flashcards.length + ' known</span></div>' + bar(known, s.flashcards.length) +
      '<div class="ca-flip' + (s.cardFlip ? ' flipped' : '') + '" data-ca-flip tabindex="0" role="button" aria-label="Flip card" aria-pressed="' + s.cardFlip + '"><div class="ca-face front"><small>Term</small><p>' + esc(c.front || c.term || 'Front') + '</p><em>Tap to flip</em></div><div class="ca-face back"><small>Definition</small><p>' + esc(c.back || c.definition || 'Back') + '</p></div></div>' +
      '<div class="ca-cardbtns"><button type="button" class="ca-btn" data-ca-cstep="-1">' + ic('back', 16) + '</button><button type="button" class="ca-btn warn" data-ca-know="0">Still learning</button><button type="button" class="ca-btn good" data-ca-know="1">' + ic('check', 16) + 'Got it</button><button type="button" class="ca-btn" data-ca-cstep="1">' + ic('next', 16) + '</button></div>' +
      '<div class="ca-cardtools"><button type="button" class="ca-chip" data-ca-shuffle>' + ic('shuffle', 14) + 'Shuffle</button><button type="button" class="ca-chip' + (s.cardOnlyUnknown ? ' on' : '') + '" data-ca-unknown aria-pressed="' + s.cardOnlyUnknown + '">Only unknown</button><span class="ca-dim small">Space flips · ← → moves · 1 / 2 marks</span></div></div>';
  }

  /* ── refine (creator) ────────────────────────────────────────────────── */
  function viewRefine(body, s) {
    body.innerHTML = '<div class="ca-card-box"><h3>✨ Refine with AI</h3><p class="ca-dim">Only you can see this. Ask the AI to improve your app.</p><div class="ca-tags big">' +
      ['Add more exam questions and raise difficulty progression', 'Generate more flashcards with concise backs', 'Improve quiz quality and distractor options'].map(function (t) { return '<button type="button" class="ca-chip" data-ca-tag="' + esc(t) + '">' + esc(t.split(' ').slice(0, 3).join(' ')) + '…</button>'; }).join('') + '</div>' +
      '<div class="ca-refine-row"><input id="community-chat-input" class="auth-input" type="text" placeholder="Ask how to improve this app"><button type="button" class="ca-btn primary" data-ca-ask>Ask AI</button></div><div id="community-chat-reply" class="ca-ai" style="margin-top:12px"></div></div>';
  }

  /* ── events ──────────────────────────────────────────────────────────── */
  function onClick(e) {
    var s = S().open, t = e.target;
    var a = t.closest('[data-ca]');
    if (a) {
      var act = a.dataset.ca, app = s && s.app;
      if (act === 'close') return closeApp();
      if (!app) return;
      if (act === 'like') { Promise.resolve(communityToggleLike(String(app.id), e)).then(syncApp); return; }
      if (act === 'pin') { communityTogglePin(String(app.id), e); setTimeout(syncApp, 400); return; }
      if (act === 'share') return communityShareApp(String(app.id));
      if (act === 'comments') { var cs = $('.ca-discussion'); if (cs) { cs.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(function () { var i = $('#community-comment-input'); if (i) i.focus(); }, 350); } return; }
      if (act === 'hide') return communityHideApp(String(app.id), app.status !== 'hidden');
      if (act === 'delete') return communityDeleteApp(String(app.id));
    }
    if (!s) return;
    var tab = t.closest('[data-ca-tab]'); if (tab) return setView(tab.dataset.caTab);
    var go = t.closest('[data-ca-go]'); if (go) return setView(go.dataset.caGo);
    var ch = t.closest('[data-ca-ch]'); if (ch && !ch.disabled) { s.guideIdx = Number(ch.dataset.caCh); drawBody(); var ct = $('.ca-chapter'); if (ct && ct.getBoundingClientRect().top < 60) ct.scrollIntoView({ block: 'start' }); return; }
    var rd = t.closest('[data-ca-read]'); if (rd) { var k = rd.dataset.caRead; if (s.prog.guide[k]) delete s.prog.guide[k]; else s.prog.guide[k] = 1; saveProg(); return drawBody(); }
    var q = t.closest('[data-ca-q]'); if (q) { s.qIdx = Number(q.dataset.caQ); s.qShowScheme = false; return drawBody(); }
    var qs = t.closest('[data-ca-qstep]'); if (qs && !qs.disabled) { var all = s.questionBank, idxs = all.map(function (x, i) { return i; }).filter(function (i) { return !s.qFilter || all[i].topic === s.qFilter; }); var p = idxs.indexOf(s.qIdx) + Number(qs.dataset.caQstep); s.qIdx = idxs[Math.max(0, Math.min(idxs.length - 1, p))]; s.qShowScheme = false; return drawBody(); }
    var mk = t.closest('[data-ca-mark]'); if (mk) return runMark(mk.dataset.caMark);
    if (t.closest('[data-ca-scheme]')) { s.qDrafts[s.qIdx] = ($('#community-answer-input') || {}).value || s.qDrafts[s.qIdx]; s.qShowScheme = !s.qShowScheme; return drawBody(); }
    var qn = t.closest('[data-ca-qn]'); if (qn) { $$('[data-ca-qn]').forEach(function (b) { b.classList.toggle('on', b === qn); }); $('#ca-body').dataset.qn = qn.dataset.caQn; return; }
    if (t.closest('[data-ca-qstart]')) return startQuiz(Number($('#ca-body').dataset.qn) || s.quiz.length);
    if (t.closest('[data-ca-quizreset]')) { s.quizRun = null; return drawBody(); }
    var op = t.closest('[data-ca-opt]'); if (op) return pickOption(Number(op.dataset.caOpt));
    if (t.closest('[data-ca-qnext]')) return nextQuiz();
    if (t.closest('[data-ca-flip]')) { s.cardFlip = !s.cardFlip; return drawBody(); }
    var cs2 = t.closest('[data-ca-cstep]'); if (cs2) { var L = cardList(s).length; s.cardIdx = (s.cardIdx + Number(cs2.dataset.caCstep) + L) % L; s.cardFlip = false; return drawBody(); }
    var kn = t.closest('[data-ca-know]'); if (kn) { var cl = cardList(s), ci = cl[s.cardIdx]; if (kn.dataset.caKnow === '1') s.prog.known[ci] = 1; else delete s.prog.known[ci]; saveProg(); s.cardFlip = false; var nl = cardList(s).length; s.cardIdx = s.cardOnlyUnknown ? (s.cardIdx >= nl ? 0 : s.cardIdx) : (s.cardIdx + 1) % Math.max(cl.length, 1); return drawBody(); }
    if (t.closest('[data-ca-shuffle]')) { s.flashcards = shuffle(s.flashcards); s.prog.known = {}; saveProg(); s.cardIdx = 0; s.cardFlip = false; return drawBody(); }
    if (t.closest('[data-ca-unknown]')) { s.cardOnlyUnknown = !s.cardOnlyUnknown; s.cardIdx = 0; return drawBody(); }
    if (t.closest('[data-ca-resetcards]')) { s.prog.known = {}; saveProg(); s.cardOnlyUnknown = false; s.cardIdx = 0; return drawBody(); }
    var tg = t.closest('[data-ca-tag]'); if (tg) { var ci2 = $('#community-chat-input'); if (ci2) { ci2.value = tg.dataset.caTag; ci2.focus(); } return; }
    if (t.closest('[data-ca-ask]')) return communityAskRefine(String(s.app.id));
  }
  function onChange(e) {
    var s = S().open; if (!s) return;
    if (e.target.matches('[data-ca-chsel]')) { s.guideIdx = Number(e.target.value); drawBody(); }
    else if (e.target.matches('[data-ca-qfilter]')) { s.qFilter = e.target.value; s.qIdx = -1; drawBody(); }
  }
  function onKey(e) {
    var s = S().open; if (!s || s.view !== 'cards') return;
    if (/input|textarea|select/i.test((e.target.tagName || ''))) return;
    if (e.key === ' ' || e.key === 'Enter') { if (e.target.closest && e.target.closest('[data-ca-flip]') || e.key === ' ') { e.preventDefault(); s.cardFlip = !s.cardFlip; drawBody(); } }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var L = cardList(s).length; if (!L) return; s.cardIdx = (s.cardIdx + (e.key === 'ArrowRight' ? 1 : -1) + L) % L; s.cardFlip = false; drawBody(); }
    else if (e.key === '1' || e.key === '2') { var b = $('[data-ca-know="' + (e.key === '2' ? 1 : 0) + '"]'); if (b) b.click(); }
  }

  function mount() {
    var root = $('#ca-root'); if (!root || root.dataset.mounted) return;
    root.dataset.mounted = '1';
    var tb = $('#ca-toolbar-slot'); if (tb) tb.innerHTML = toolbarHtml();
    bindToolbar();
    root.addEventListener('click', onClick); root.addEventListener('change', onChange); root.addEventListener('keydown', onKey);
  }

  window.RA10Apps = {
    mount: function () { mount(); bindToolbar(); },
    loadLibrary: function () { mount(); return loadLibrary(); },
    openApp: openApp, closeApp: closeApp, redraw: draw
  };
})();
