/* RA10 Community — forums, moderation and community managers.
   Backed by supabase/sql/community-forums.sql. Exposes window.RA10Forum. */
(function () {
  'use strict';

  var PAGE = 20;
  var OWNER_EMAIL = 'mistry.hashim@icloud.com';
  var host = null;            // #cf-pane-forum
  var state = { view: 'home', cat: null, postId: null, sort: 'active', q: '', loaded: false };
  var cats = [];              // forum_categories
  var catStats = {};          // id -> {count, last}
  var profiles = {};          // id -> {username, full_name, profile_pic_url, badge}
  var myLikes = { posts: {}, comments: {} };
  var staff = false;          // owner or community manager
  var owner = false;
  var staffChecked = false;
  var banned = null;          // active ban row for this user
  var tab = 'forum';
  var modSub = 'reports';
  var postsCache = [];
  var postsEnd = false;
  var booted = false;

  /* ── helpers ─────────────────────────────────────────────────────────── */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(v) { return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function client() { return window.RA10 && RA10.getClient ? RA10.getClient() : null; }
  function loggedIn() { return !!(window.RA10 && RA10.isLoggedIn && RA10.isLoggedIn()); }
  function me() { try { return loggedIn() ? RA10.getSession().user : null; } catch (e) { return null; } }
  function myId() { var u = me(); return u ? String(u.id) : ''; }
  function myEmail() { var u = me(); return u && u.email ? String(u.email).toLowerCase() : ''; }
  function toast(msg) {
    if (typeof window.showMiniToast === 'function') { window.showMiniToast(msg); return; }
    var t = document.createElement('div'); t.className = 'cf-toast'; t.textContent = msg; document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3200);
  }
  function needLogin(action) {
    if (loggedIn()) return false;
    if (window.RA10 && RA10.showPaywall) RA10.showPaywall('login', action || 'community_post'); else toast('Sign in to do that.');
    return true;
  }
  function errMsg(e) {
    var m = (e && (e.message || e.error_description)) || 'Something went wrong.';
    if (/relation .* does not exist|schema cache|Could not find the (table|function)/i.test(m)) return 'The forums need the database update (run supabase/sql/community-forums.sql).';
    if (/row-level security/i.test(m)) return 'You don’t have permission to do that.';
    return String(m).slice(0, 160);
  }
  function ago(iso) {
    var t = new Date(iso).getTime(); if (!t) return '';
    var s = Math.max(1, Math.round((Date.now() - t) / 1000));
    if (s < 60) return 'just now';
    var m = Math.round(s / 60); if (m < 60) return m + 'm ago';
    var h = Math.round(m / 60); if (h < 24) return h + 'h ago';
    var d = Math.round(h / 24); if (d < 30) return d + 'd ago';
    return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: d > 330 ? 'numeric' : undefined });
  }
  function initials(name) {
    var p = String(name || '?').replace(/^@/, '').trim().split(/\s+/).filter(Boolean);
    if (!p.length) return '?';
    return (p.length === 1 ? p[0].slice(0, 2) : p[0][0] + p[1][0]).toUpperCase();
  }
  var HUES = [350, 12, 28, 160, 190, 215, 250, 280, 320];
  function hue(id) { var h = 0, s = String(id || ''); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return HUES[h % HUES.length]; }
  function nameOf(id) {
    var p = profiles[id];
    if (p && p.username) return '@' + p.username;
    if (p && p.full_name) return p.full_name;
    if (String(id) === myId()) return 'You';
    return 'Member';
  }
  function avatar(id, size) {
    var p = profiles[id] || {};
    var s = size || 36;
    var inner = p.profile_pic_url ? '<img src="' + esc(p.profile_pic_url) + '" alt="" loading="lazy">' : esc(initials(nameOf(id)));
    return '<span class="cf-av" style="--s:' + s + 'px;--h:' + hue(id) + '">' + inner + '</span>';
  }
  function roleBadge(id) {
    var b = profiles[id] && profiles[id].badge;
    return b === 'owner' ? '<span class="cf-role owner" title="Site owner">👑 Owner</span>' : b === 'admin' ? '<span class="cf-role admin" title="Community moderator">🛡️ Admin</span>' : '';
  }
  function byline(id) { return '<span class="cf-by"><b>' + esc(nameOf(id)) + '</b>' + roleBadge(id) + '</span>'; }
  function catOf(id) { return cats.filter(function (c) { return c.id === id; })[0] || { id: id, name: id, icon: '💬', color: '#64748b' }; }
  function rich(text) {
    var out = esc(text).replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)\]])/g, '<a href="$1" target="_blank" rel="noopener noreferrer nofollow">$1</a>');
    return out.split(/\n{2,}/).map(function (p) { return '<p>' + p.replace(/\n/g, '<br>') + '</p>'; }).join('');
  }
  function excerpt(text, n) { var t = String(text || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t; }
  function icon(name) {
    var P = {
      like: '<path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM7 11l4-8a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 20H7"/>',
      chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.5A8 8 0 1 1 21 12z"/>',
      pin: '<path d="M12 17v5M9 3h6l-1 6 3 3v2H7v-2l3-3z"/>',
      lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
      flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
      trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
      edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
      share: '<path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14"/>',
      back: '<path d="M15 18l-6-6 6-6"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      shield: '<path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
      eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
      reply: '<path d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 6 6v3"/>',
      ban: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>'
    };
    return '<svg class="cf-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || '') + '</svg>';
  }

  /* ── dialogs ─────────────────────────────────────────────────────────── */
  function dialog(o) {
    return new Promise(function (resolve) {
      var ov = document.createElement('div');
      ov.className = 'cf-modal-ov';
      ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', o.title || 'Dialog');
      var fields = (o.fields || []).map(function (f) {
        if (f.type === 'select') return '<label class="cf-lbl">' + esc(f.label) + '<select class="cf-in" data-f="' + f.name + '">' + f.options.map(function (op) { return '<option value="' + esc(op[0]) + '">' + esc(op[1]) + '</option>'; }).join('') + '</select></label>';
        if (f.type === 'textarea') return '<label class="cf-lbl">' + esc(f.label) + '<textarea class="cf-in" rows="3" maxlength="' + (f.max || 400) + '" data-f="' + f.name + '" placeholder="' + esc(f.placeholder || '') + '"></textarea></label>';
        return '<label class="cf-lbl">' + esc(f.label) + '<input class="cf-in" type="' + (f.type || 'text') + '" maxlength="' + (f.max || 200) + '" data-f="' + f.name + '" placeholder="' + esc(f.placeholder || '') + '"></label>';
      }).join('');
      ov.innerHTML = '<div class="cf-modal"><h3>' + esc(o.title || '') + '</h3>' + (o.body ? '<p>' + esc(o.body) + '</p>' : '') + fields +
        '<div class="cf-modal-actions"><button type="button" class="cf-btn" data-x="cancel">Cancel</button><button type="button" class="cf-btn ' + (o.danger ? 'danger' : 'primary') + '" data-x="ok">' + esc(o.confirm || 'OK') + '</button></div></div>';
      document.body.appendChild(ov);
      var first = $('.cf-in', ov); (first || $('[data-x="ok"]', ov)).focus();
      function close(v) { ov.remove(); document.removeEventListener('keydown', key, true); resolve(v); }
      function key(e) { if (e.key === 'Escape') close(null); }
      document.addEventListener('keydown', key, true);
      ov.addEventListener('click', function (e) {
        if (e.target === ov) return close(null);
        var x = e.target.closest('[data-x]'); if (!x) return;
        if (x.dataset.x === 'cancel') return close(null);
        var vals = {}; $$('[data-f]', ov).forEach(function (el) { vals[el.dataset.f] = el.value.trim(); });
        for (var i = 0; i < (o.fields || []).length; i++) { var f = o.fields[i]; if (f.required && !vals[f.name]) { $('[data-f="' + f.name + '"]', ov).focus(); return; } }
        close(vals);
      });
    });
  }

  /* ── data ────────────────────────────────────────────────────────────── */
  function q(promise) {
    return promise.then(function (r) { if (r.error) throw r.error; return r.data; });
  }
  // Ask the AI moderator to check something we just posted. Resolves to its verdict (or null).
  function moderate(kind, id) {
    var c = client();
    if (!c || !c.functions) return Promise.resolve(null);
    return c.functions.invoke('community-moderate', { body: { kind: kind, id: id } }).then(function (r) {
      var res = r && r.data && r.data.results && r.data.results[0];
      return res || null;
    }, function () { return null; });
  }
  function loadProfiles(ids) {
    var need = Array.from(new Set(ids.filter(Boolean).map(String))).filter(function (i) { return !profiles[i]; });
    if (!need.length || !client()) return Promise.resolve();
    return client().rpc('community_public_profiles', { p_ids: need }).then(function (r) {
      (r.data || []).forEach(function (p) { profiles[p.id] = p; });
      need.forEach(function (i) { if (!profiles[i]) profiles[i] = {}; });
    }, function () { need.forEach(function (i) { if (!profiles[i]) profiles[i] = {}; }); });
  }
  function loadMyLikes(postIds, commentIds) {
    if (!loggedIn() || !client()) return Promise.resolve();
    var jobs = [];
    if (postIds && postIds.length) jobs.push(client().from('forum_post_likes').select('post_id').in('post_id', postIds).then(function (r) { (r.data || []).forEach(function (x) { myLikes.posts[x.post_id] = true; }); }));
    if (commentIds && commentIds.length) jobs.push(client().from('forum_comment_likes').select('comment_id').in('comment_id', commentIds).then(function (r) { (r.data || []).forEach(function (x) { myLikes.comments[x.comment_id] = true; }); }));
    return Promise.all(jobs).catch(function () {});
  }
  function refreshStaff() {
    var c = client();
    owner = !!(window.RA10 && RA10.isOwner && RA10.isOwner()) || myEmail() === OWNER_EMAIL;
    staff = owner;
    banned = null;
    if (!loggedIn() || !c) { staffChecked = true; applyStaffUi(); return Promise.resolve(); }
    var jobs = [];
    if (!owner) {
      jobs.push(c.from('community_staff').select('email').eq('email', myEmail()).then(function (r) { if (r.data && r.data.length) staff = true; }, function () {}));
    }
    jobs.push(c.from('forum_bans').select('reason,expires_at').eq('user_id', myId()).then(function (r) {
      var b = (r.data || [])[0];
      if (b && (!b.expires_at || new Date(b.expires_at) > new Date())) banned = b;
    }, function () {}));
    return Promise.all(jobs).then(function () { staffChecked = true; applyStaffUi(); });
  }
  function applyStaffUi() {
    var t = $('.cf-tab-mod'); if (t) t.style.display = staff ? '' : 'none';
    if (!staff && tab === 'mod') setTab('forum');
    if (staff) refreshReportBadge();
    mountAccountPanel();
  }
  function refreshReportBadge() {
    var c = client(); var b = $('#cf-mod-badge'); if (!c || !b) return;
    Promise.all([
      c.from('forum_reports').select('id', { count: 'exact', head: true }).eq('status', 'open'),
      c.from('forum_mod_log').select('id', { count: 'exact', head: true }).eq('reviewed', false)
    ]).then(function (r) {
      var n = (r[0].count || 0) + (r[1].count || 0); b.textContent = n > 99 ? '99+' : n; b.style.display = n ? '' : 'none';
    }, function () {});
  }
  function loadCategories() {
    var c = client(); if (!c) return Promise.reject(new Error('offline'));
    return Promise.all([
      q(c.from('forum_categories').select('*').order('sort')),
      q(c.from('forum_posts').select('category_id,last_activity_at').order('last_activity_at', { ascending: false }).limit(2000)),
      c.from('forum_comments').select('id', { count: 'exact', head: true })
    ]).then(function (r) {
      cats = r[0] || []; catStats = {};
      (r[1] || []).forEach(function (p) { var s = catStats[p.category_id] || (catStats[p.category_id] = { count: 0, last: p.last_activity_at }); s.count++; });
      var t = $('#cf-stat-threads'), rp = $('#cf-stat-replies');
      if (t) t.textContent = (r[1] || []).length >= 2000 ? '2000+' : (r[1] || []).length;
      if (rp) rp.textContent = r[2] && r[2].count != null ? r[2].count : '–';
    });
  }
  function fetchPosts(opts) {
    var c = client();
    var qy = c.from('forum_posts').select('id,category_id,user_id,title,body,pinned,locked,comment_count,like_count,created_at,last_activity_at');
    if (opts.cat) qy = qy.eq('category_id', opts.cat);
    if (opts.user) qy = qy.eq('user_id', opts.user);
    if (opts.q) { var t = opts.q.replace(/[%,()*]/g, ' ').trim(); if (t) qy = qy.or('title.ilike.%' + t + '%,body.ilike.%' + t + '%'); }
    if (opts.pinFirst) qy = qy.order('pinned', { ascending: false });
    var col = opts.sort === 'new' ? 'created_at' : opts.sort === 'top' ? 'like_count' : 'last_activity_at';
    qy = qy.order(col, { ascending: false }).order('created_at', { ascending: false }).range(opts.from || 0, (opts.from || 0) + PAGE - 1);
    return q(qy);
  }

  /* ── view: shell ─────────────────────────────────────────────────────── */
  function setTab(name) {
    tab = name;
    $$('.cf-tab').forEach(function (b) { var on = b.dataset.cfTab === name; b.classList.toggle('active', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
    ['forum', 'apps', 'mod'].forEach(function (n) { var p = $('#cf-pane-' + n); if (p) p.hidden = n !== name; });
    if (name === 'mod') renderMod();
  }
  function bindTabs() {
    $$('.cf-tab').forEach(function (b) { if (b.dataset.bound) return; b.dataset.bound = '1'; b.addEventListener('click', function () { setTab(b.dataset.cfTab); }); });
  }
  function banNotice() {
    if (!banned) return '';
    return '<div class="cf-alert">You are currently unable to post or comment' + (banned.reason ? ': ' + esc(banned.reason) : '') + (banned.expires_at ? ' (until ' + new Date(banned.expires_at).toLocaleDateString() + ')' : '') + '.</div>';
  }
  function setUrl(thread) {
    try {
      var base = location.hash.split('?')[0] || '#/community';
      history.replaceState(null, '', thread ? base + '?thread=' + thread : base);
    } catch (e) {}
  }
  function scrollTop() { var el = $('.cf-tabs'); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start', behavior: 'smooth' }); }

  function skeleton(n) { var o = ''; for (var i = 0; i < (n || 4); i++) o += '<div class="cf-skel"></div>'; return o; }
  function errorBox(e, retry) {
    return '<div class="cf-empty"><div class="cf-empty-ico">⚠️</div><h4>Couldn’t load this</h4><p>' + esc(errMsg(e)) + '</p>' + (retry ? '<button class="cf-btn" type="button" data-act="retry">Try again</button>' : '') + '</div>';
  }

  /* ── view: home ──────────────────────────────────────────────────────── */
  function renderHome() {
    state.view = 'home'; state.cat = null; state.postId = null; setUrl(null);
    host.innerHTML =
      '<div class="cf-layout"><div class="cf-main">' +
      '<div class="cf-bar">' +
        '<label class="cf-search">' + icon('search') + '<input id="cf-q" type="search" placeholder="Search threads…" value="' + esc(state.q) + '" aria-label="Search threads"></label>' +
        '<button type="button" class="cf-btn primary" data-act="new">' + icon('plus') + 'New thread</button>' +
      '</div>' + banNotice() +
      '<section class="cf-block"><div class="cf-block-head"><h2>Categories</h2></div><div class="cf-cats" id="cf-cats">' + skeleton(6) + '</div></section>' +
      '<section class="cf-block"><div class="cf-block-head"><h2>' + (state.q ? 'Search results' : 'Latest threads') + '</h2>' + sortPills() + '</div><div id="cf-list" class="cf-list">' + skeleton(5) + '</div><div id="cf-more"></div></section>' +
      '</div>' + sidebar() + '</div>';
    renderCats();
    loadList(true);
    bindSearch();
  }
  function sortPills() {
    return '<div class="cf-pills" role="group" aria-label="Sort threads">' + [['active', 'Active'], ['new', 'Newest'], ['top', 'Top']].map(function (s) {
      return '<button type="button" class="cf-pill' + (state.sort === s[0] ? ' on' : '') + '" data-sort="' + s[0] + '" aria-pressed="' + (state.sort === s[0]) + '">' + s[1] + '</button>';
    }).join('') + '</div>';
  }
  function sidebar() {
    return '<aside class="cf-side">' +
      '<div class="cf-card cf-cta"><div class="cf-cta-ico">💬</div><h3>Got a question?</h3><p>Ask the community — someone has probably been stuck on it too.</p><button type="button" class="cf-btn primary" data-act="new">Start a thread</button></div>' +
      '<div class="cf-card"><h3>Community guidelines</h3><ul class="cf-rules"><li>Be kind and respectful.</li><li>No cheating: don’t share live exam content.</li><li>Don’t share personal details.</li><li>Search before you post — and use the right category.</li></ul><p class="cf-aimod">🤖 An AI moderator checks every post. Swearing is fine; racism, threats and hate aren\u2019t.</p></div>' +
      '<div class="cf-card"><h3>Study apps</h3><p class="cf-muted">Flashcards, quizzes and guides built by students.</p><button type="button" class="cf-btn" data-cf-go="apps">Browse study apps</button></div>' +
      '</aside>';
  }
  function renderCats() {
    var el = $('#cf-cats'); if (!el) return;
    el.innerHTML = cats.map(function (c) {
      var s = catStats[c.id] || { count: 0 };
      return '<button type="button" class="cf-cat" data-cat="' + esc(c.id) + '" style="--c:' + esc(c.color) + '"><span class="cf-cat-ico" aria-hidden="true">' + esc(c.icon) + '</span><span class="cf-cat-copy"><b>' + esc(c.name) + (c.staff_only ? ' <i class="cf-tag">Staff</i>' : '') + '</b><small>' + esc(c.description) + '</small></span><span class="cf-cat-n"><b>' + s.count + '</b><small>' + (s.count === 1 ? 'thread' : 'threads') + '</small></span></button>';
    }).join('');
  }
  function threadRow(p) {
    var c = catOf(p.category_id);
    return '<article class="cf-row' + (p.pinned ? ' pinned' : '') + '" data-post="' + p.id + '" tabindex="0" role="link" aria-label="' + esc(p.title) + '">' +
      avatar(p.user_id, 42) +
      '<div class="cf-row-main"><div class="cf-row-top">' +
        (p.pinned ? '<span class="cf-flag pin" title="Pinned">' + icon('pin') + '</span>' : '') + (p.locked ? '<span class="cf-flag lock" title="Locked">' + icon('lock') + '</span>' : '') +
        '<h3>' + esc(p.title) + '</h3></div>' +
        '<p>' + esc(excerpt(p.body, 150)) + '</p>' +
        '<div class="cf-meta"><span class="cf-chip" style="--c:' + esc(c.color) + '">' + esc(c.icon) + ' ' + esc(c.name) + '</span>' + byline(p.user_id) + '<span>' + ago(p.last_activity_at) + '</span></div></div>' +
      '<div class="cf-row-stats"><span title="Replies">' + icon('chat') + p.comment_count + '</span><span title="Likes">' + icon('like') + p.like_count + '</span></div></article>';
  }
  function loadList(reset) {
    var list = $('#cf-list'); if (!list) return;
    if (reset) { postsCache = []; postsEnd = false; }
    var opts = { sort: state.sort, q: state.q, cat: state.cat, pinFirst: state.view === 'category', from: postsCache.length };
    return fetchPosts(opts).then(function (rows) {
      postsEnd = rows.length < PAGE; postsCache = postsCache.concat(rows);
      return Promise.all([loadProfiles(rows.map(function (r) { return r.user_id; })), loadMyLikes(rows.map(function (r) { return r.id; }))]);
    }).then(function () {
      if (!postsCache.length) {
        list.innerHTML = '<div class="cf-empty"><div class="cf-empty-ico">🌱</div><h4>' + (state.q ? 'No threads match that search' : 'No threads here yet') + '</h4><p>' + (state.q ? 'Try different words.' : 'Be the first to start a conversation.') + '</p><button class="cf-btn primary" type="button" data-act="new">Start a thread</button></div>';
      } else list.innerHTML = postsCache.map(threadRow).join('');
      var more = $('#cf-more'); if (more) more.innerHTML = postsEnd || !postsCache.length ? '' : '<button type="button" class="cf-btn cf-more" data-act="more">Load more</button>';
    }, function (e) { list.innerHTML = errorBox(e, true); });
  }
  function bindSearch() {
    var inp = $('#cf-q'); if (!inp) return; var t = null;
    inp.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { state.q = inp.value.trim(); var h = $('.cf-block-head h2', inp.closest('.cf-main') ? $('#cf-list').closest('.cf-block') : document); if (h) h.textContent = state.q ? 'Search results' : (state.view === 'category' ? 'Threads' : 'Latest threads'); loadList(true); }, 260); });
  }

  /* ── view: category ──────────────────────────────────────────────────── */
  function renderCategory(id) {
    var c = catOf(id);
    state.view = 'category'; state.cat = id; state.postId = null; setUrl(null);
    if (id === 'announcements') markAnnouncementSeen();
    host.innerHTML =
      '<div class="cf-layout"><div class="cf-main">' +
      '<button type="button" class="cf-back" data-act="home">' + icon('back') + 'All categories</button>' +
      '<header class="cf-cathead" style="--c:' + esc(c.color) + '"><span class="cf-cat-ico big" aria-hidden="true">' + esc(c.icon) + '</span><div><h2>' + esc(c.name) + '</h2><p>' + esc(c.description) + '</p></div>' +
      '<button type="button" class="cf-btn primary" data-act="new">' + icon('plus') + 'New thread</button></header>' + banNotice() +
      '<div class="cf-bar"><label class="cf-search">' + icon('search') + '<input id="cf-q" type="search" placeholder="Search in ' + esc(c.name) + '…" value="' + esc(state.q) + '" aria-label="Search threads"></label>' + sortPills() + '</div>' +
      '<div id="cf-list" class="cf-list">' + skeleton(5) + '</div><div id="cf-more"></div></div>' + sidebar() + '</div>';
    loadList(true); bindSearch(); scrollTop();
  }

  /* ── view: thread ────────────────────────────────────────────────────── */
  var thread = null, comments = [];
  function openThread(id, focusComments) {
    state.view = 'thread'; state.postId = id; setUrl(id);
    host.innerHTML = '<div class="cf-layout"><div class="cf-main"><button type="button" class="cf-back" data-act="back">' + icon('back') + 'Back</button><div class="cf-card">' + skeleton(3) + '</div></div>' + sidebar() + '</div>';
    scrollTop();
    var c = client();
    return Promise.all([
      q(c.from('forum_posts').select('*').eq('id', id).maybeSingle()),
      q(c.from('forum_comments').select('*').eq('post_id', id).order('created_at', { ascending: true }).limit(500))
    ]).then(function (r) {
      thread = r[0]; comments = r[1] || [];
      if (thread && thread.category_id === 'announcements') markAnnouncementSeen();
      if (!thread) { host.innerHTML = '<div class="cf-layout"><div class="cf-main"><button type="button" class="cf-back" data-act="home">' + icon('back') + 'Forums</button><div class="cf-empty"><div class="cf-empty-ico">🕳️</div><h4>That thread isn’t here any more</h4><p>It may have been deleted.</p></div></div>' + sidebar() + '</div>'; return; }
      return Promise.all([loadProfiles([thread.user_id].concat(comments.map(function (x) { return x.user_id; }))), loadMyLikes([thread.id], comments.map(function (x) { return x.id; }))]).then(function () { drawThread(focusComments); });
    }).catch(function (e) { host.innerHTML = '<div class="cf-layout"><div class="cf-main"><button type="button" class="cf-back" data-act="home">' + icon('back') + 'Forums</button>' + errorBox(e, false) + '</div>' + sidebar() + '</div>'; });
  }
  function canEdit(row) { return !!row && (String(row.user_id) === myId() && !banned) ; }
  function canRemove(row) { return !!row && (staff || String(row.user_id) === myId()); }
  function commentHtml(cm, isReply) {
    var liked = !!myLikes.comments[cm.id];
    return '<div class="cf-cm' + (isReply ? ' reply' : '') + '" id="cm-' + cm.id + '" data-cm="' + cm.id + '">' + avatar(cm.user_id, isReply ? 30 : 36) +
      '<div class="cf-cm-body"><div class="cf-cm-head">' + byline(cm.user_id) + '<span class="cf-time">' + ago(cm.created_at) + (cm.edited_at ? ' · edited' : '') + '</span></div>' +
      '<div class="cf-prose" data-prose>' + rich(cm.body) + '</div>' +
      '<div class="cf-acts"><button type="button" class="cf-act' + (liked ? ' on' : '') + '" data-act="clike" data-id="' + cm.id + '" aria-pressed="' + liked + '">' + icon('like') + '<span>' + cm.like_count + '</span></button>' +
      (!isReply || true ? '<button type="button" class="cf-act" data-act="reply" data-id="' + cm.id + '">' + icon('reply') + 'Reply</button>' : '') +
      (canEdit(cm) ? '<button type="button" class="cf-act" data-act="cedit" data-id="' + cm.id + '">' + icon('edit') + 'Edit</button>' : '') +
      (loggedIn() && String(cm.user_id) !== myId() ? '<button type="button" class="cf-act" data-act="creport" data-id="' + cm.id + '">' + icon('flag') + 'Report</button>' : '') +
      (canRemove(cm) ? '<button type="button" class="cf-act danger" data-act="cdel" data-id="' + cm.id + '">' + icon('trash') + 'Delete</button>' : '') +
      (staff && String(cm.user_id) !== myId() ? '<button type="button" class="cf-act danger" data-act="ban" data-user="' + cm.user_id + '">' + icon('ban') + 'Ban</button>' : '') +
      '</div><div class="cf-slot" data-slot="' + cm.id + '"></div></div></div>';
  }
  function drawThread(focusComments) {
    var p = thread, c = catOf(p.category_id), liked = !!myLikes.posts[p.id];
    var tops = comments.filter(function (x) { return !x.parent_id; });
    var kids = {}; comments.filter(function (x) { return x.parent_id; }).forEach(function (x) { (kids[x.parent_id] = kids[x.parent_id] || []).push(x); });
    var staffBar = staff ? '<div class="cf-staffbar"><span class="cf-mod-flag">' + icon('shield') + ' Moderation</span>' +
      '<button type="button" class="cf-btn sm" data-act="pin">' + (p.pinned ? 'Unpin' : 'Pin') + '</button>' +
      '<button type="button" class="cf-btn sm" data-act="lock">' + (p.locked ? 'Unlock' : 'Lock') + '</button>' +
      '<label class="cf-move">Move to <select data-act="move">' + cats.map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === p.category_id ? ' selected' : '') + '>' + esc(x.name) + '</option>'; }).join('') + '</select></label></div>' : '';
    host.innerHTML =
      '<div class="cf-layout"><div class="cf-main">' +
      '<button type="button" class="cf-back" data-act="back">' + icon('back') + 'Back to ' + esc(state.cat ? catOf(state.cat).name : 'forums') + '</button>' +
      '<article class="cf-card cf-post">' + staffBar +
        '<div class="cf-post-meta"><button type="button" class="cf-chip link" data-cat="' + esc(c.id) + '" style="--c:' + esc(c.color) + '">' + esc(c.icon) + ' ' + esc(c.name) + '</button>' + (p.pinned ? '<span class="cf-flag pin">' + icon('pin') + ' Pinned</span>' : '') + (p.locked ? '<span class="cf-flag lock">' + icon('lock') + ' Locked</span>' : '') + '</div>' +
        '<h1 class="cf-post-title">' + esc(p.title) + '</h1>' +
        '<div class="cf-post-author">' + avatar(p.user_id, 44) + '<div>' + byline(p.user_id) + '<div class="cf-time">' + ago(p.created_at) + (p.edited_at ? ' · edited' : '') + '</div></div></div>' +
        '<div class="cf-prose big" id="cf-post-body">' + rich(p.body) + '</div>' +
        '<div class="cf-acts big"><button type="button" class="cf-act' + (liked ? ' on' : '') + '" data-act="plike" aria-pressed="' + liked + '">' + icon('like') + '<span>' + p.like_count + '</span> Like</button>' +
          '<span class="cf-act static">' + icon('chat') + p.comment_count + ' ' + (p.comment_count === 1 ? 'reply' : 'replies') + '</span>' +
          '<button type="button" class="cf-act" data-act="share">' + icon('share') + 'Share</button>' +
          (canEdit(p) ? '<button type="button" class="cf-act" data-act="pedit">' + icon('edit') + 'Edit</button>' : '') +
          (loggedIn() && String(p.user_id) !== myId() ? '<button type="button" class="cf-act" data-act="preport">' + icon('flag') + 'Report</button>' : '') +
          (canRemove(p) ? '<button type="button" class="cf-act danger" data-act="pdel">' + icon('trash') + 'Delete</button>' : '') +
          (staff && String(p.user_id) !== myId() ? '<button type="button" class="cf-act danger" data-act="ban" data-user="' + p.user_id + '">' + icon('ban') + 'Ban author</button>' : '') +
        '</div></article>' +
      '<section class="cf-card" id="cf-comments"><div class="cf-block-head"><h2>' + p.comment_count + ' ' + (p.comment_count === 1 ? 'reply' : 'replies') + '</h2></div>' + composer(null) +
        '<div class="cf-cm-list">' + (tops.length ? tops.map(function (t) { return commentHtml(t, false) + (kids[t.id] || []).map(function (k) { return commentHtml(k, true); }).join(''); }).join('') : '<div class="cf-empty small"><p>No replies yet — start the conversation.</p></div>') + '</div></section>' +
      '</div>' + sidebar() + '</div>';
    if (focusComments) { var el = $('#cf-comments'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }
  function composer(parentId) {
    if (!loggedIn()) return '<div class="cf-signin"><span>Sign in to join the conversation.</span><button type="button" class="cf-btn primary" data-act="login">Sign in</button></div>';
    if (banned) return banNotice();
    if (thread && thread.locked && !staff) return '<div class="cf-alert soft">' + icon('lock') + ' This thread is locked — no new replies.</div>';
    return '<form class="cf-compose" data-parent="' + (parentId || '') + '"><textarea class="cf-in" rows="' + (parentId ? 2 : 3) + '" maxlength="3000" placeholder="' + (parentId ? 'Write a reply…' : 'Share your thoughts…') + '" aria-label="Comment"></textarea>' +
      '<div class="cf-compose-foot"><span class="cf-muted small">Ctrl/⌘ + Enter to post</span><span>' + (parentId ? '<button type="button" class="cf-btn sm" data-act="cancelreply">Cancel</button> ' : '') + '<button type="submit" class="cf-btn primary sm">' + (parentId ? 'Reply' : 'Post reply') + '</button></span></div></form>';
  }

  /* ── view: new / edit thread ─────────────────────────────────────────── */
  function renderNew(preCat) {
    if (needLogin('community_post')) return;
    if (banned) { toast('You can’t post right now.'); return; }
    state.view = 'new';
    var allowed = cats.filter(function (c) { return !c.staff_only || staff; });
    var sel = preCat && allowed.some(function (c) { return c.id === preCat; }) ? preCat : (allowed.filter(function (c) { return c.id === 'general'; })[0] || allowed[0] || {}).id;
    host.innerHTML = '<div class="cf-layout single"><div class="cf-main"><button type="button" class="cf-back" data-act="back">' + icon('back') + 'Cancel</button>' +
      '<form class="cf-card cf-new" id="cf-new"><h2>Start a new thread</h2>' +
      '<label class="cf-lbl">Category<select class="cf-in" name="cat">' + allowed.map(function (c) { return '<option value="' + esc(c.id) + '"' + (c.id === sel ? ' selected' : '') + '>' + esc(c.icon + ' ' + c.name) + '</option>'; }).join('') + '</select></label>' +
      '<label class="cf-lbl">Title<input class="cf-in" name="title" maxlength="140" placeholder="A clear, specific title" required><span class="cf-count" data-for="title">0 / 140</span></label>' +
      '<label class="cf-lbl">What do you want to say?<textarea class="cf-in" name="body" rows="9" maxlength="8000" placeholder="Give enough detail for people to help. Never share live exam content or personal details." required></textarea><span class="cf-count" data-for="body">0 / 8000</span></label>' +
      '<div class="cf-compose-foot"><span class="cf-muted small">Be kind. Moderators can remove posts that break the guidelines.</span><button type="submit" class="cf-btn primary">Post thread</button></div></form></div></div>';
    var f = $('#cf-new');
    ['title', 'body'].forEach(function (n) { var el = f.elements[n], out = $('[data-for="' + n + '"]', f); el.addEventListener('input', function () { out.textContent = el.value.length + ' / ' + el.maxLength; }); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = $('button[type=submit]', f); btn.disabled = true;
      q(client().from('forum_posts').insert({ category_id: f.elements.cat.value, title: f.elements.title.value.trim(), body: f.elements.body.value.trim() }).select('id').single()).then(function (row) {
        toast('Thread posted'); loadCategories().catch(function () {}); openThread(row.id);
        moderate('post', row.id).then(function (v) {
          if (v && v.action === 'remove') {
            toast('Removed by the AI moderator: ' + (v.reason || 'it broke the community rules.'));
            loadCategories().catch(function () {}); if (state.postId === row.id) renderHome();
          }
        });
      }, function (er) { btn.disabled = false; toast(errMsg(er)); });
    });
    scrollTop(); setTimeout(function () { f.elements.title.focus(); }, 60);
  }

  /* ── actions ─────────────────────────────────────────────────────────── */
  function toggleLike(kind, id, btn) {
    if (needLogin('community_like')) return;
    var map = kind === 'post' ? myLikes.posts : myLikes.comments, on = !map[id];
    var row = kind === 'post' ? thread : comments.filter(function (x) { return x.id === id; })[0];
    map[id] = on; row.like_count = Math.max(0, row.like_count + (on ? 1 : -1));
    btn.classList.toggle('on', on); btn.setAttribute('aria-pressed', on); $('span', btn).textContent = row.like_count;
    var tbl = kind === 'post' ? 'forum_post_likes' : 'forum_comment_likes', col = kind === 'post' ? 'post_id' : 'comment_id';
    var op = on ? client().from(tbl).insert((function () { var o = {}; o[col] = id; return o; })()) : client().from(tbl).delete().eq(col, id).eq('user_id', myId());
    op.then(function (r) { if (r.error && !/duplicate/i.test(r.error.message)) { map[id] = !on; row.like_count += on ? -1 : 1; $('span', btn).textContent = row.like_count; btn.classList.toggle('on', !on); toast(errMsg(r.error)); } });
  }
  function submitComment(form) {
    if (needLogin('community_comment')) return;
    var ta = $('textarea', form), body = ta.value.trim(); if (!body) return;
    var btn = $('button[type=submit]', form); btn.disabled = true;
    var parent = form.dataset.parent || null;
    q(client().from('forum_comments').insert({ post_id: thread.id, parent_id: parent, body: body }).select('*').single()).then(function (row) {
      comments.push(row); thread.comment_count++; moderate('comment', row.id).then(function (v) {
        if (v && v.action === 'remove') {
          comments = comments.filter(function (x) { return x.id !== row.id; }); thread.comment_count = Math.max(0, thread.comment_count - 1);
          if (state.postId === thread.id) drawThread(false);
          toast('Removed by the AI moderator: ' + (v.reason || 'it broke the community rules.'));
        }
      });
      return loadProfiles([row.user_id]);
    }).then(function () { drawThread(false); var el = $('#cm-' + comments[comments.length - 1].id); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, function (e) { btn.disabled = false; toast(errMsg(e)); });
  }
  function reportDialog(target) {
    if (needLogin('community_report')) return;
    dialog({ title: 'Report ' + (target.comment_id ? 'comment' : 'thread'), body: 'Tell the moderators what’s wrong. Reports are private.', confirm: 'Send report', fields: [
      { name: 'reason', label: 'Reason', type: 'select', options: [['Spam or advertising', 'Spam or advertising'], ['Rude or abusive', 'Rude or abusive'], ['Shares exam content', 'Shares live exam content'], ['Personal information', 'Personal information'], ['Something else', 'Something else']] },
      { name: 'note', label: 'More detail (optional)', type: 'textarea', max: 300 }
    ] }).then(function (v) {
      if (!v) return;
      var reason = v.reason + (v.note ? ' — ' + v.note : '');
      client().from('forum_reports').insert(Object.assign({ reason: reason }, target)).then(function (r) {
        if (r.error && /duplicate|unique/i.test(r.error.message)) toast('You’ve already reported this.');
        else if (r.error) toast(errMsg(r.error)); else toast('Thanks — a moderator will take a look.');
      });
    });
  }
  function deletePost(id, andBack) {
    return dialog({ title: 'Delete this thread?', body: 'This removes the thread and all its replies for everyone.', confirm: 'Delete', danger: true }).then(function (v) {
      if (!v) return false;
      return client().from('forum_posts').delete().eq('id', id).then(function (r) {
        if (r.error) { toast(errMsg(r.error)); return false; }
        toast('Thread deleted'); loadCategories().catch(function () {}); if (andBack) goBack(); return true;
      });
    });
  }
  function deleteComment(id) {
    return dialog({ title: 'Delete this reply?', body: 'Replies to it will be removed too.', confirm: 'Delete', danger: true }).then(function (v) {
      if (!v) return false;
      return client().from('forum_comments').delete().eq('id', id).then(function (r) {
        if (r.error) { toast(errMsg(r.error)); return false; }
        var gone = {}; gone[id] = true; comments.forEach(function (c) { if (gone[c.parent_id]) gone[c.id] = true; });
        var n = comments.filter(function (c) { return gone[c.id]; }).length;
        comments = comments.filter(function (c) { return !gone[c.id]; }); thread.comment_count = Math.max(0, thread.comment_count - n);
        drawThread(false); toast('Reply deleted'); return true;
      });
    });
  }
  function banUser(userId, after) {
    dialog({ title: 'Ban ' + nameOf(userId) + ' from the forums?', body: 'They won’t be able to post or reply. Existing posts stay unless you delete them.', confirm: 'Ban user', danger: true, fields: [
      { name: 'days', label: 'Length', type: 'select', options: [['1', '1 day'], ['7', '7 days'], ['30', '30 days'], ['0', 'Permanent']] },
      { name: 'reason', label: 'Reason (shown to them)', type: 'text', max: 160, required: true }
    ] }).then(function (v) {
      if (!v) return;
      var exp = Number(v.days) ? new Date(Date.now() + Number(v.days) * 86400000).toISOString() : null;
      client().from('forum_bans').upsert({ user_id: userId, reason: v.reason, expires_at: exp }).then(function (r) {
        if (r.error) toast(errMsg(r.error)); else { toast('User banned'); if (after) after(); }
      });
    });
  }
  function goBack() { if (state.cat) renderCategory(state.cat); else renderHome(); }
  function patchPost(patch, msg) {
    client().from('forum_posts').update(patch).eq('id', thread.id).select('*').single().then(function (r) {
      if (r.error) return toast(errMsg(r.error));
      Object.assign(thread, r.data); drawThread(false); if (msg) toast(msg);
    });
  }
  function editPost() {
    var body = $('#cf-post-body'); if (!body) return;
    body.outerHTML = '<form class="cf-edit" id="cf-edit"><input class="cf-in" name="title" maxlength="140" value="' + esc(thread.title) + '"><textarea class="cf-in" name="body" rows="8" maxlength="8000">' + esc(thread.body) + '</textarea><div class="cf-compose-foot"><span></span><span><button type="button" class="cf-btn sm" data-act="canceledit">Cancel</button> <button type="submit" class="cf-btn primary sm">Save</button></span></div></form>';
    var f = $('#cf-edit'); f.elements.body.focus();
    f.addEventListener('submit', function (e) { e.preventDefault(); patchPost({ title: f.elements.title.value.trim(), body: f.elements.body.value.trim() }, 'Saved'); });
  }
  function editComment(id) {
    var cm = comments.filter(function (x) { return x.id === id; })[0]; var wrap = $('#cm-' + id + ' [data-prose]'); if (!cm || !wrap) return;
    wrap.innerHTML = '<form class="cf-edit"><textarea class="cf-in" rows="3" maxlength="3000">' + esc(cm.body) + '</textarea><div class="cf-compose-foot"><span></span><span><button type="button" class="cf-btn sm" data-act="canceledit">Cancel</button> <button type="submit" class="cf-btn primary sm">Save</button></span></div></form>';
    var f = $('form', wrap); $('textarea', f).focus();
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      client().from('forum_comments').update({ body: $('textarea', f).value.trim() }).eq('id', id).select('*').single().then(function (r) {
        if (r.error) return toast(errMsg(r.error)); Object.assign(cm, r.data); drawThread(false);
      });
    });
  }

  /* ── click handling ──────────────────────────────────────────────────── */
  function onClick(e) {
    var t = e.target;
    var go = t.closest('[data-cf-go]'); if (go) return setTab(go.dataset.cfGo);
    var catBtn = t.closest('[data-cat]'); if (catBtn && !t.closest('[data-act]')) { state.q = ''; return renderCategory(catBtn.dataset.cat); }
    var sortBtn = t.closest('[data-sort]'); if (sortBtn) { state.sort = sortBtn.dataset.sort; $$('.cf-pill').forEach(function (b) { var on = b.dataset.sort === state.sort; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }); return loadList(true); }
    var a = t.closest('[data-act]');
    if (!a) { var row = t.closest('[data-post]'); if (row && !t.closest('a')) openThread(row.dataset.post); return; }
    var act = a.dataset.act, id = a.dataset.id;
    switch (act) {
      case 'new': return renderNew(state.view === 'category' ? state.cat : null);
      case 'home': return renderHome();
      case 'back': return goBack();
      case 'more': a.disabled = true; return loadList(false);
      case 'retry': return state.view === 'home' || state.view === 'category' ? loadList(true) : null;
      case 'login': return needLogin();
      case 'plike': return toggleLike('post', thread.id, a);
      case 'clike': return toggleLike('comment', id, a);
      case 'share': { var url = location.origin + location.pathname + '#/community?thread=' + thread.id; if (navigator.share) navigator.share({ title: thread.title, url: url }).catch(function () {}); else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast('Link copied'); }); return; }
      case 'preport': return reportDialog({ post_id: thread.id });
      case 'creport': return reportDialog({ comment_id: id, post_id: thread.id });
      case 'pdel': return deletePost(thread.id, true);
      case 'cdel': return deleteComment(id);
      case 'pedit': return editPost();
      case 'cedit': return editComment(id);
      case 'canceledit': return drawThread(false);
      case 'pin': return patchPost({ pinned: !thread.pinned }, thread.pinned ? 'Unpinned' : 'Pinned');
      case 'lock': return patchPost({ locked: !thread.locked }, thread.locked ? 'Thread unlocked' : 'Thread locked');
      case 'ban': return banUser(a.dataset.user);
      case 'reply': {
        if (needLogin('community_comment')) return;
        $$('[data-slot]').forEach(function (s) { s.innerHTML = ''; });
        var slot = $('[data-slot="' + id + '"]'); slot.innerHTML = composer(id); var ta = $('textarea', slot); if (ta) ta.focus(); return;
      }
      case 'cancelreply': { var s2 = t.closest('[data-slot]'); if (s2) s2.innerHTML = ''; return; }
    }
  }
  function onSubmit(e) { var f = e.target.closest('.cf-compose'); if (f) { e.preventDefault(); submitComment(f); } }
  function onKey(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { var f = e.target.closest && e.target.closest('.cf-compose'); if (f) { e.preventDefault(); submitComment(f); } }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('cf-row')) { e.preventDefault(); openThread(e.target.dataset.post); }
  }
  function onChange(e) { if (e.target.matches && e.target.matches('[data-act="move"]')) patchPost({ category_id: e.target.value }, 'Thread moved'); }

  /* ── moderation tab ──────────────────────────────────────────────────── */
  function renderMod() {
    var pane = $('#cf-pane-mod'); if (!pane) return;
    if (!staff) { pane.innerHTML = '<div class="cf-empty"><p>Moderators only.</p></div>'; return; }
    var tabs = [['reports', 'Reports'], ['ai', '🤖 AI moderator'], ['threads', 'Threads'], ['apps', 'Study apps'], ['bans', 'Bans']];
    if (owner) tabs.push(['team', 'Moderators']);
    pane.innerHTML = '<div class="cf-mod"><div class="cf-modtabs" role="tablist">' + tabs.map(function (t) { return '<button type="button" class="cf-pill' + (modSub === t[0] ? ' on' : '') + '" data-mod="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div><div id="cf-mod-body">' + skeleton(4) + '</div></div>';
    $$('[data-mod]', pane).forEach(function (b) { b.addEventListener('click', function () { modSub = b.dataset.mod; renderMod(); }); });
    var body = $('#cf-mod-body', pane);
    ({ reports: modReports, ai: modAi, threads: modThreads, apps: modApps, bans: modBans, team: modTeam }[modSub] || modReports)(body);
  }
  function modReports(body) {
    var c = client();
    q(c.from('forum_reports').select('*').eq('status', 'open').order('created_at', { ascending: false }).limit(60)).then(function (rows) {
      refreshReportBadge();
      if (!rows.length) { body.innerHTML = '<div class="cf-empty"><div class="cf-empty-ico">✅</div><h4>All clear</h4><p>No open reports.</p></div>'; return; }
      var postIds = rows.map(function (r) { return r.post_id; }).filter(Boolean), cmIds = rows.map(function (r) { return r.comment_id; }).filter(Boolean);
      return Promise.all([
        postIds.length ? q(c.from('forum_posts').select('id,title,body,user_id').in('id', postIds)) : [],
        cmIds.length ? q(c.from('forum_comments').select('id,body,user_id,post_id').in('id', cmIds)) : []
      ]).then(function (r2) {
        var P = {}, C = {}; r2[0].forEach(function (x) { P[x.id] = x; }); r2[1].forEach(function (x) { C[x.id] = x; });
        return loadProfiles(rows.map(function (x) { return x.reporter_id; }).concat(r2[0].map(function (x) { return x.user_id; }), r2[1].map(function (x) { return x.user_id; }))).then(function () {
          body.innerHTML = rows.map(function (r) {
            var cm = r.comment_id ? C[r.comment_id] : null, p = r.post_id ? P[r.post_id] : null, tgt = cm || p;
            var who = tgt ? tgt.user_id : '';
            return '<article class="cf-card cf-report" data-rep="' + r.id + '"><div class="cf-block-head"><h3>' + (cm ? 'Reply' : 'Thread') + (p ? ': ' + esc(p.title) : '') + '</h3><span class="cf-time">' + ago(r.created_at) + '</span></div>' +
              '<p class="cf-quote">' + (tgt ? esc(excerpt(tgt.body, 300)) : '<i>Already removed.</i>') + '</p>' +
              '<p class="cf-muted small">Reported by ' + esc(nameOf(r.reporter_id)) + ': <b>' + esc(r.reason) + '</b>' + (who ? ' · Author: ' + esc(nameOf(who)) : '') + '</p>' +
              '<div class="cf-row-actions">' + (tgt ? '<button class="cf-btn sm" data-rv="' + (r.post_id || (cm && cm.post_id)) + '">View thread</button>' : '') +
              (tgt ? '<button class="cf-btn sm danger" data-rdel="' + r.id + '" data-kind="' + (cm ? 'c' : 'p') + '" data-target="' + (cm ? cm.id : p.id) + '">Delete ' + (cm ? 'reply' : 'thread') + '</button>' : '') +
              (who && who !== myId() ? '<button class="cf-btn sm danger" data-rban="' + who + '">Ban author</button>' : '') +
              '<button class="cf-btn sm" data-rok="' + r.id + '">Dismiss</button></div></article>';
          }).join('');
        });
      });
    }).then(function () {
      body.onclick = function (e) {
        var t = e.target.closest('button'); if (!t) return;
        if (t.dataset.rv) { setTab('forum'); openThread(t.dataset.rv); }
        else if (t.dataset.rok) resolveReport(t.dataset.rok);
        else if (t.dataset.rban) banUser(t.dataset.rban, function () { renderMod(); });
        else if (t.dataset.rdel) {
          var tbl = t.dataset.kind === 'c' ? 'forum_comments' : 'forum_posts';
          dialog({ title: 'Delete this ' + (t.dataset.kind === 'c' ? 'reply' : 'thread') + '?', confirm: 'Delete', danger: true }).then(function (v) {
            if (!v) return; c.from(tbl).delete().eq('id', t.dataset.target).then(function (r) { if (r.error) return toast(errMsg(r.error)); toast('Removed'); resolveReport(t.dataset.rdel, true); });
          });
        }
      };
    }, function (e) { body.innerHTML = errorBox(e, false); });
  }
  function resolveReport(id, silent) {
    client().from('forum_reports').update({ status: 'resolved', resolved_by: myId(), resolved_at: new Date().toISOString() }).eq('id', id).then(function (r) {
      if (r.error) return toast(errMsg(r.error)); if (!silent) toast('Report dismissed'); renderMod();
    });
  }
  function modThreads(body) {
    fetchPosts({ sort: 'new', from: 0 }).then(function (rows) {
      return loadProfiles(rows.map(function (r) { return r.user_id; })).then(function () {
        body.innerHTML = '<div class="cf-list">' + rows.map(function (p) { return threadRow(p); }).join('') + '</div>';
        body.onclick = function (e) { var r = e.target.closest('[data-post]'); if (r) { setTab('forum'); openThread(r.dataset.post); } };
      });
    }, function (e) { body.innerHTML = errorBox(e, false); });
  }
  function modApps(body) {
    var c = client();
    q(c.from('community_apps').select('id,title,subject,level,status,creator_id,like_count,comment_count,created_at').order('created_at', { ascending: false }).limit(100)).then(function (rows) {
      return loadProfiles(rows.map(function (r) { return r.creator_id; })).then(function () {
        body.innerHTML = rows.length ? '<div class="cf-table">' + rows.map(function (a) {
          return '<div class="cf-trow" data-app="' + a.id + '"><div class="cf-tmain"><b>' + esc(a.title || 'Untitled') + '</b><small>' + esc((a.subject || '') + ' · ' + (a.level || '')) + ' · by ' + esc(nameOf(a.creator_id)) + ' · ' + ago(a.created_at) + ' · ' + (a.comment_count || 0) + ' comments</small></div>' +
            '<span class="cf-chip ' + (a.status === 'published' ? 'ok' : 'warn') + '">' + esc(a.status) + '</span>' +
            '<button class="cf-btn sm" data-open="' + a.id + '">Open</button><button class="cf-btn sm" data-hide="' + a.id + '" data-to="' + (a.status === 'hidden' ? 'published' : 'hidden') + '">' + (a.status === 'hidden' ? 'Unhide' : 'Hide') + '</button><button class="cf-btn sm danger" data-del="' + a.id + '">Delete</button></div>';
        }).join('') + '</div>' : '<div class="cf-empty"><p>No study apps yet.</p></div>';
        body.onclick = function (e) {
          var t = e.target.closest('button'); if (!t) return;
          if (t.dataset.open) { setTab('apps'); if (window.communityOpenApp) window.communityOpenApp(t.dataset.open); }
          else if (t.dataset.hide) c.from('community_apps').update({ status: t.dataset.to }).eq('id', t.dataset.hide).then(function (r) { if (r.error) toast(errMsg(r.error)); else { toast('Updated'); renderMod(); if (window.loadCommunityApps) window.loadCommunityApps(); } });
          else if (t.dataset.del) dialog({ title: 'Delete this study app?', body: 'Its content, likes and comments are removed permanently.', confirm: 'Delete', danger: true }).then(function (v) {
            if (v) c.from('community_apps').delete().eq('id', t.dataset.del).then(function (r) { if (r.error) toast(errMsg(r.error)); else { toast('App deleted'); renderMod(); if (window.loadCommunityApps) window.loadCommunityApps(); } });
          });
        };
      });
    }, function (e) { body.innerHTML = errorBox(e, false); });
  }
  function modBans(body) {
    var c = client();
    q(c.from('forum_bans').select('*').order('created_at', { ascending: false }).limit(100)).then(function (rows) {
      return loadProfiles(rows.map(function (r) { return r.user_id; })).then(function () {
        body.innerHTML = rows.length ? '<div class="cf-table">' + rows.map(function (b) {
          return '<div class="cf-trow"><div class="cf-tmain"><b>' + esc(nameOf(b.user_id)) + '</b><small>' + esc(b.reason || 'No reason given') + ' · ' + (b.expires_at ? 'until ' + new Date(b.expires_at).toLocaleDateString() : 'permanent') + '</small></div><button class="cf-btn sm" data-unban="' + b.user_id + '">Lift ban</button></div>';
        }).join('') + '</div>' : '<div class="cf-empty"><div class="cf-empty-ico">🕊️</div><h4>No one is banned</h4></div>';
        body.onclick = function (e) { var t = e.target.closest('[data-unban]'); if (t) c.from('forum_bans').delete().eq('user_id', t.dataset.unban).then(function (r) { if (r.error) toast(errMsg(r.error)); else { toast('Ban lifted'); renderMod(); } }); };
      });
    }, function (e) { body.innerHTML = errorBox(e, false); });
  }
  /* ── AI moderator log ───────────────────────────────────────────────── */
  function modAi(body) {
    var c = client();
    body.innerHTML = '<div class="cf-ai-head"><div><h3>🤖 AI moderator</h3><p class="cf-muted">Checks every new thread and reply. Swearing is allowed. Racism, hate, threats, sexual content, doxxing and scams are removed automatically; borderline posts are flagged here for you. Removed something wrongly? Restore it.</p></div><button type="button" class="cf-btn sm" data-sweep>Check for missed posts</button></div><div id="cf-ai-list">' + skeleton(3) + '</div>';
    function load() {
      q(c.from('forum_mod_log').select('*').order('reviewed', { ascending: true }).order('created_at', { ascending: false }).limit(60)).then(function (rows) {
        refreshReportBadge();
        return loadProfiles(rows.map(function (r) { return r.author_id; })).then(function () {
          var list = $('#cf-ai-list', body);
          list.innerHTML = rows.length ? rows.map(function (r) {
            var cls = r.action === 'removed' ? 'rm' : r.action === 'flagged' ? 'fl' : 'ok';
            return '<article class="cf-card cf-aicard ' + cls + (r.reviewed ? ' done' : '') + '" data-log="' + r.id + '"><div class="cf-block-head"><h3><span class="cf-aitag ' + cls + '">' + esc(r.action) + '</span> ' + esc(r.category || 'other') + ' <span class="cf-sev" title="Severity ' + r.severity + '/3">' + new Array(r.severity + 1).join('●') + new Array(4 - r.severity).join('○') + '</span></h3><span class="cf-time">' + ago(r.created_at) + (r.source === 'filter' ? ' · word filter' : '') + '</span></div>' +
              '<p class="cf-quote">' + (r.title ? '<b>' + esc(r.title) + '</b><br>' : '') + esc(excerpt(r.content, 400)) + '</p>' +
              '<p class="cf-muted small">' + (r.kind === 'post' ? 'Thread' : 'Reply') + ' by <b>' + esc(nameOf(r.author_id)) + '</b> — ' + esc(r.reason || '') + '</p>' +
              '<div class="cf-row-actions">' +
                (r.action === 'removed' ? '<button class="cf-btn sm" data-restore="' + r.id + '">Restore</button>' : '') +
                (r.action === 'flagged' ? '<button class="cf-btn sm" data-view="' + (r.post_id || r.target_id) + '">View thread</button><button class="cf-btn sm danger" data-rmflag="' + r.id + '">Remove it</button>' : '') +
                (!r.reviewed && r.action !== 'restored' ? '<button class="cf-btn sm" data-ok="' + r.id + '">' + (r.action === 'removed' ? 'Correct — dismiss' : 'Fine — dismiss') + '</button>' : '') +
                (r.author_id && r.author_id !== myId() ? '<button class="cf-btn sm danger" data-ban="' + r.author_id + '">Ban author</button>' : '') +
              '</div></article>';
          }).join('') : '<div class="cf-empty"><div class="cf-empty-ico">🤖</div><h4>Nothing caught yet</h4><p>The AI moderator hasn\u2019t had to step in.</p></div>';
        });
      }, function (e) { $('#cf-ai-list', body).innerHTML = errorBox(e, false); });
    }
    body.onclick = function (e) {
      var t = e.target.closest('button'); if (!t) return;
      if (t.dataset.sweep !== undefined) { t.disabled = true; t.textContent = 'Checking…'; c.functions.invoke('community-moderate', { body: { sweep: true } }).then(function (r) { t.disabled = false; t.textContent = 'Check for missed posts'; var n = r && r.data && r.data.results ? r.data.results.length : 0; toast(n ? 'Checked ' + n + ' item' + (n === 1 ? '' : 's') : (r && r.error ? 'Couldn\u2019t reach the AI moderator.' : 'Nothing was waiting')); load(); }); }
      else if (t.dataset.restore) c.rpc('forum_restore', { p_log_id: t.dataset.restore }).then(function (r) { if (r.error) toast(errMsg(r.error)); else { toast('Restored'); load(); loadCategories().catch(function () {}); } });
      else if (t.dataset.ok) c.from('forum_mod_log').update({ reviewed: true, reviewed_by: myId() }).eq('id', t.dataset.ok).then(function () { load(); });
      else if (t.dataset.view) { setTab('forum'); openThread(t.dataset.view); }
      else if (t.dataset.ban) banUser(t.dataset.ban, load);
      else if (t.dataset.rmflag) {
        var id = t.dataset.rmflag;
        c.from('forum_mod_log').select('kind,target_id').eq('id', id).single().then(function (r) {
          if (r.error) return toast(errMsg(r.error));
          c.from(r.data.kind === 'post' ? 'forum_posts' : 'forum_comments').delete().eq('id', r.data.target_id).then(function (d) {
            if (d.error) return toast(errMsg(d.error));
            c.from('forum_mod_log').update({ action: 'removed', reviewed: true, reviewed_by: myId() }).eq('id', id).then(function () { toast('Removed'); load(); });
          });
        });
      }
    };
    // pick up anything that slipped through while nobody was online
    c.functions.invoke('community-moderate', { body: { sweep: true } }).then(function () { load(); }, function () { load(); });
    load();
  }

  /* ── moderators: requests + member directory (owner only) ───────────── */
  function memberAv(m, size) {
    var name = m.username ? '@' + m.username : (m.full_name || m.email || '?');
    return '<span class="cf-av" style="--s:' + size + 'px;--h:' + hue(m.id || m.email) + '">' + (m.profile_pic_url ? '<img src="' + esc(m.profile_pic_url) + '" alt="" loading="lazy">' : esc(initials(name))) + '</span>';
  }
  function modTeam(body) { renderModerators(body); }
  function renderModerators(el) {
    if (!el) return;
    if (!owner) { el.innerHTML = '<div class="credit-log-note">Owner access required.</div>'; return; }
    var offset = 0, qtext = '', PAGE_M = 25;
    el.innerHTML =
      '<div class="cf-team">' +
      '<div class="cf-callout"><b>🔒 Only you can see this.</b> It lists every RA10 member and their email so you can ask them to moderate. <b>Sending a request does not make anyone a moderator</b> — they get a pop-up the next time they\u2019re on RA10 and only become an Admin if they press Accept.</div>' +
      '<div class="cf-roles"><span><span class="cf-role owner">👑 Owner</span> you — full control</span><span><span class="cf-role admin">🛡️ Admin</span> accepted moderators — manage threads, replies, apps, reports and bans</span></div>' +
      '<h3 class="cf-sub">Your moderation team</h3><div class="cf-table" data-team-list>' + skeleton(2) + '</div>' +
      '<h3 class="cf-sub">All members <span class="cf-muted small" data-total></span></h3>' +
      '<label class="cf-search"><svg class="cf-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input type="search" data-msearch placeholder="Search members by name, @username or email…" aria-label="Search members"></label>' +
      '<div class="cf-table" data-member-list>' + skeleton(4) + '</div><div data-member-more></div>' +
      '</div>';
    var teamEl = $('[data-team-list]', el), listEl = $('[data-member-list]', el), moreEl = $('[data-member-more]', el), totalEl = $('[data-total]', el);
    var c = client();

    function loadTeam() {
      c.rpc('community_staff_overview').then(function (r) {
        if (r.error) { teamEl.innerHTML = errorBox(r.error, false); return; }
        var rows = r.data || [];
        teamEl.innerHTML = '<div class="cf-trow owner"><span class="cf-tav">' + avatar(myId(), 36) + '</span><div class="cf-tmain"><b>' + esc(OWNER_EMAIL) + '</b><small>You</small></div><span class="cf-role owner">👑 Owner</span></div>' +
          (rows.length ? rows.map(function (m) {
            var name = m.username ? '@' + m.username : (m.full_name || '');
            var state = m.state === 'active' ? '<span class="cf-role admin">🛡️ Admin</span>' : m.state === 'pending' ? '<span class="cf-chip warn">Request sent</span>' : '<span class="cf-chip">Declined</span>';
            var btn = m.state === 'active' ? '<button class="cf-btn sm danger" data-rm="' + esc(m.email) + '">Remove</button>' : m.state === 'pending' ? '<button class="cf-btn sm" data-cancel="' + esc(m.email) + '">Cancel request</button>' : '<button class="cf-btn sm" data-resend="' + esc(m.email) + '">Ask again</button><button class="cf-btn sm" data-cancel="' + esc(m.email) + '">Clear</button>';
            return '<div class="cf-trow"><span class="cf-tav">' + memberAv({ id: m.user_id, email: m.email, username: m.username, full_name: m.full_name, profile_pic_url: m.profile_pic_url }, 36) + '</span><div class="cf-tmain"><b>' + esc(name || m.email) + '</b><small>' + esc(m.email) + (m.user_id ? '' : ' · no RA10 account yet') + ' · ' + ago(m.created_at) + '</small></div>' + state + btn + '</div>';
          }).join('') : '<div class="cf-empty small"><p>No moderators yet. Pick a member below and send them a request.</p></div>');
        refreshReportBadge();
      });
    }
    function memberRow(m) {
      var name = m.username ? '@' + m.username : (m.full_name || 'Member');
      var st = m.status === 'owner' ? '<span class="cf-role owner">👑 Owner</span>' : m.status === 'moderator' ? '<span class="cf-role admin">🛡️ Admin</span>' : m.status === 'invited' ? '<span class="cf-chip warn">Request sent</span>' : '';
      var btn = m.status ? '' : '<button class="cf-btn sm primary" data-invite="' + esc(m.email) + '" data-name="' + esc(name) + '">Send moderator request</button>';
      return '<div class="cf-trow"><span class="cf-tav">' + memberAv(m, 36) + '</span><div class="cf-tmain"><b>' + esc(name) + (m.full_name && m.username ? ' <span class="cf-muted small">' + esc(m.full_name) + '</span>' : '') + '</b><small>' + esc(m.email) + '</small></div>' + st + btn + '</div>';
    }
    function loadMembers(reset) {
      if (reset) { offset = 0; listEl.innerHTML = skeleton(3); }
      c.rpc('community_member_search', { p_q: qtext, p_limit: PAGE_M, p_offset: offset }).then(function (r) {
        if (r.error) { listEl.innerHTML = errorBox(r.error, false); return; }
        var rows = r.data || [], total = rows.length ? Number(rows[0].total) : 0;
        if (reset) listEl.innerHTML = '';
        if (!rows.length && reset) listEl.innerHTML = '<div class="cf-empty small"><p>No members match “' + esc(qtext) + '”.</p></div>';
        listEl.insertAdjacentHTML('beforeend', rows.map(memberRow).join(''));
        offset += rows.length; totalEl.textContent = total ? '· ' + total.toLocaleString() + ' member' + (total === 1 ? '' : 's') : '';
        moreEl.innerHTML = offset < total ? '<button class="cf-btn cf-more" data-more>Show more members</button>' : '';
      });
    }
    var st = null;
    $('[data-msearch]', el).addEventListener('input', function (e) { clearTimeout(st); st = setTimeout(function () { qtext = e.target.value.trim(); loadMembers(true); }, 280); });
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.more !== undefined) { b.disabled = true; loadMembers(false); }
      else if (b.dataset.invite || b.dataset.resend) {
        var email = b.dataset.invite || b.dataset.resend, who = b.dataset.name || email;
        dialog({ title: 'Send a moderator request to ' + who + '?', body: 'They\u2019ll see a pop-up the next time they\u2019re on RA10 asking if they want to be a Community Moderator. They only become an Admin if they accept.', confirm: 'Send request' }).then(function (v) {
          if (!v) return;
          c.rpc('community_invite_moderator', { p_email: email }).then(function (r) { if (r.error) toast(errMsg(r.error)); else { toast('Request sent'); loadTeam(); loadMembers(true); } });
        });
      }
      else if (b.dataset.cancel) c.rpc('community_cancel_invite', { p_email: b.dataset.cancel }).then(function (r) { if (r.error) toast(errMsg(r.error)); else { toast('Request cancelled'); loadTeam(); loadMembers(true); } });
      else if (b.dataset.rm) dialog({ title: 'Remove ' + b.dataset.rm + ' as a moderator?', body: 'They lose all moderation powers straight away.', confirm: 'Remove', danger: true }).then(function (v) {
        if (v) c.from('community_staff').delete().eq('email', b.dataset.rm).then(function (r) { if (r.error) toast(errMsg(r.error)); else { toast('Moderator removed'); loadTeam(); loadMembers(true); } });
      });
    });
    loadTeam(); loadMembers(true);
  }
  var renderManagers = renderModerators;

  function mountAccountPanel() {
    var panel = document.getElementById('account-community-staff-panel'); if (!panel) return;
    panel.style.display = owner ? 'block' : 'none';
    if (owner) renderModerators(document.getElementById('account-community-staff-body'));
  }

  /* ── boot ────────────────────────────────────────────────────────────── */
  function boot() {
    host = document.getElementById('cf-pane-forum'); if (!host) return;
    bindTabs();
    if (!host.dataset.bound) {
      host.dataset.bound = '1';
      host.addEventListener('click', onClick); host.addEventListener('submit', onSubmit); host.addEventListener('keydown', onKey); host.addEventListener('change', onChange);
    }
    return refreshStaff().then(function () { return loadCategories(); }).then(function () {
      state.loaded = true;
      var m = (location.hash.split('?')[1] || '').match(/thread=([0-9a-f-]{36})/i);
      var wantApp = /(^|&)app=/.test(location.hash.split('?')[1] || '');
      if (wantApp) setTab('apps');
      if (m) openThread(m[1]); else if (state.view === 'thread' && state.postId) openThread(state.postId); else renderHome();
    }).catch(function (e) { host.innerHTML = errorBox(e, false); });
  }

  /* ── announcements: navbar dot + popup ─────────────────────────────── */
  var ANN_SEEN = 'ra10_forum_ann_seen';
  var ANN_POPUP = 'ra10_forum_ann_popup';
  var latestAnn = null;
  function lsGet(k, st) { try { return (st || localStorage).getItem(k) || ''; } catch (e) { return ''; } }
  function lsSet(k, v, st) { try { (st || localStorage).setItem(k, v); } catch (e) {} }
  function navTargets() {
    return $$('.nav [data-nav="community"], .nav-link[data-nav="community"], .mobile-bottom-nav [onclick*="/community"], .mobile-sheet [onclick*="/community"], .mobile-top-nav [onclick*="/community"], [data-mobile-nav="community"], [data-mobile-you="/community"], .mobile-more-menu [data-dock-item="community"]');
  }
  function setNavDot(on, ann) {
    navTargets().forEach(function (el) {
      var dot = el.querySelector(':scope > .cf-navdot');
      if (!on) { if (dot) dot.remove(); el.classList.remove('cf-has-dot'); return; }
      el.classList.add('cf-has-dot');
      if (!dot) { dot = document.createElement('span'); dot.className = 'cf-navdot'; dot.setAttribute('aria-hidden', 'true'); dot.innerHTML = '<i></i><b>📣</b>'; el.appendChild(dot); }
      el.setAttribute('title', ann ? 'New announcement from ' + ann.author_name : 'New announcement');
    });
  }
  function markAnnouncementSeen() {
    if (!latestAnn) return;
    lsSet(ANN_SEEN, latestAnn.id); setNavDot(false); hideAnnPopup();
    var n = $('[data-cat="announcements"] .cf-new'); if (n) n.remove();
  }
  function hideAnnPopup() { var p = document.getElementById('cf-ann-pop'); if (p) { p.classList.add('out'); setTimeout(function () { p.remove(); }, 260); } }
  function showAnnPopup(ann) {
    if (document.getElementById('cf-ann-pop')) return;
    var p = document.createElement('div');
    p.id = 'cf-ann-pop'; p.className = 'cf-ann-pop'; p.setAttribute('role', 'status'); p.setAttribute('aria-live', 'polite');
    var role = ann.badge === 'owner' ? '👑 Owner' : ann.badge === 'admin' ? '🛡️ Admin' : 'Community team';
    p.innerHTML = '<div class="cf-ann-ico" aria-hidden="true"><span>📣</span><i></i><i></i><i></i></div>' +
      '<div class="cf-ann-copy"><small>New community announcement</small><b>' + esc(ann.title) + '</b><span>' + esc(ann.author_name) + ' · ' + esc(role) + ' · ' + ago(ann.created_at) + '</span>' +
      '<div class="cf-ann-actions"><button type="button" class="cf-btn primary sm" data-ann="read">Read it</button><button type="button" class="cf-btn sm" data-ann="later">Later</button></div></div>' +
      '<button type="button" class="cf-ann-x" aria-label="Dismiss" data-ann="later">✕</button>';
    document.body.appendChild(p);
    p.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ann]'); if (!b) return;
      if (b.dataset.ann === 'later') { lsSet(ANN_POPUP, ann.id, sessionStorage); hideAnnPopup(); return; }
      markAnnouncementSeen();
      if (typeof window.go === 'function') window.go('/community');
      setTimeout(function () { setTab('forum'); openThread(ann.id); }, 450);
    });
    setTimeout(function () { if (document.getElementById('cf-ann-pop') === p) { lsSet(ANN_POPUP, ann.id, sessionStorage); hideAnnPopup(); } }, 20000);
  }
  function checkAnnouncement() {
    var c = client(); if (!c) return;
    c.rpc('forum_latest_announcement').then(function (r) {
      var ann = r.data && r.data[0]; latestAnn = ann || null; if (!ann) return;
      var fresh = Date.now() - new Date(ann.created_at).getTime() < 14 * 86400000;
      var unseen = lsGet(ANN_SEEN) !== ann.id && fresh && String(ann.author_id) !== myId();
      setNavDot(unseen, ann);
      if (unseen && lsGet(ANN_POPUP, sessionStorage) !== ann.id) setTimeout(function () { if (lsGet(ANN_SEEN) !== ann.id) showAnnPopup(ann); }, 1200);
      var cat = $('[data-cat="announcements"] .cf-cat-copy b');
      if (cat && unseen && !$('.cf-new', cat)) cat.insertAdjacentHTML('beforeend', ' <i class="cf-new">New</i>');
    }, function () {});
  }

  /* ── moderator request popup (shown to the invited member on login) ──── */
  function checkInvite() {
    var c = client(); if (!c || !loggedIn()) return;
    if (lsGet('ra10_forum_invite_later', sessionStorage)) return;
    c.rpc('community_my_invite').then(function (r) {
      var inv = r.data && r.data[0]; if (!inv || document.getElementById('cf-invite')) return;
      var ov = document.createElement('div');
      ov.id = 'cf-invite'; ov.className = 'cf-modal-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Community Moderator request');
      ov.innerHTML = '<div class="cf-modal cf-invite"><div class="cf-invite-ico" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path class="sh" d="M24 5 8 11v11c0 10 6.8 17.2 16 21 9.2-3.8 16-11 16-21V11z" fill="currentColor" fill-opacity=".15"/><path class="tk" d="m16.5 24 5 5 10-11" stroke-dasharray="30" stroke-dashoffset="30"/></svg></div>' +
        '<h3>You\u2019ve got a request!</h3><p><b>' + esc(inv.inviter_name || 'The RA10 team') + '</b> would like you to become a <b>Community Moderator</b> on RA10.</p>' +
        '<ul class="cf-invite-list"><li>Help keep the forums friendly and useful</li><li>Delete or pin posts, handle reports</li><li>You\u2019ll get an <span class="cf-role admin">🛡️ Admin</span> badge</li></ul>' +
        '<p class="cf-muted small">It\u2019s completely up to you — you can say no.</p>' +
        '<div class="cf-modal-actions"><button type="button" class="cf-btn" data-i="later">Not now</button><button type="button" class="cf-btn danger" data-i="no">Decline</button><button type="button" class="cf-btn primary" data-i="yes">Accept</button></div></div>';
      document.body.appendChild(ov);
      ov.addEventListener('click', function (e) {
        var b = e.target.closest('[data-i]'); if (!b) return;
        if (b.dataset.i === 'later') { lsSet('ra10_forum_invite_later', '1', sessionStorage); ov.remove(); return; }
        b.disabled = true;
        c.rpc('community_respond_invite', { p_accept: b.dataset.i === 'yes' }).then(function (res) {
          ov.remove();
          if (res.error) return toast(errMsg(res.error));
          if (b.dataset.i === 'yes') { toast('Welcome to the moderation team! 🛡️'); refreshStaff(); } else toast('No problem — request declined.');
        });
      });
    }, function () {});
  }
  function afterLogin() { refreshStaff().then(function () { checkInvite(); }); checkAnnouncement(); }

  window.RA10Forum = {
    isStaff: function () { return staff; },
    isOwner: function () { return owner; },
    show: function () { return boot(); },
    refresh: refreshStaff,
    openThread: openThread,
    mountAccountPanel: mountAccountPanel,
    checkAnnouncement: checkAnnouncement,
    checkInvite: checkInvite
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.cf-tab'); if (b && !b.dataset.bound) { bindTabs(); b.click(); }
  });
  window.addEventListener('ra10:community-open', boot);
  document.addEventListener('DOMContentLoaded', function () {
    if (window.RA10 && RA10.on) {
      RA10.on('authchange', function () {
        afterLogin();
        var pg = document.getElementById('p-community');
        if (pg && pg.classList.contains('active')) { if (tab === 'mod') renderMod(); if (state.view === 'home') renderHome(); }
      });
    }
    mountAccountPanel();
    setTimeout(function () { checkAnnouncement(); if (loggedIn()) afterLogin(); }, 2500);
    setInterval(checkAnnouncement, 5 * 60 * 1000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) checkAnnouncement(); });
  });
})();
