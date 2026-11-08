/* RA10 — public profile card.
   Click any user (anything with data-user="<id>": leaderboard rows, forum names and avatars,
   study app creators…) to open a card in the middle of the screen with their streak, when they
   joined and their weekly leaderboard results. Data: RA10.getPublicProfile() →
   get_public_profile() in supabase/sql/popups-and-profile-cards.sql. */
(function () {
  'use strict';
  if (window.RA10ProfileCard) return;

  var cache = {};
  var lastFocus = null;
  var HUES = [350, 12, 28, 160, 190, 215, 250, 280, 320];
  var ROLES = { student: '🎓 Student', teacher: '🍎 Teacher', educator: '📚 Educator', other: '✨ Learner' };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function hue(id) { var h = 0, s = String(id || ''); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return HUES[h % HUES.length]; }
  function initials(name) {
    var p = String(name || '?').replace(/^@/, '').trim().split(/\s+/).filter(Boolean);
    if (!p.length) return '?';
    return (p.length === 1 ? p[0].slice(0, 2) : p[0][0] + p[1][0]).toUpperCase();
  }
  function joined(iso) {
    var d = new Date(iso || '');
    if (isNaN(d.getTime())) return { big: '—', small: '' };
    var days = Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
    var ago = days < 1 ? 'today' : days < 2 ? 'yesterday' : days < 31 ? days + ' days ago'
      : days < 365 ? Math.round(days / 30.4) + ' month' + (Math.round(days / 30.4) === 1 ? '' : 's') + ' ago'
      : Math.floor(days / 365) + ' year' + (Math.floor(days / 365) === 1 ? '' : 's') + (days % 365 > 182 ? '+' : '') + ' ago';
    return { big: d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }), small: 'Joined ' + ago };
  }
  function weekLabel(iso) {
    var d = new Date(iso || '');
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /* ── styles ─────────────────────────────────────────────────────────── */
  (function css() {
    if (document.getElementById('rpc-css')) return;
    var st = document.createElement('style');
    st.id = 'rpc-css';
    st.textContent = [
      '#ra10-profile-card{position:fixed!important;inset:0;z-index:2147483000!important;display:grid;place-items:center;padding:16px;background:rgba(10,12,20,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:rpcFade .18s ease both;font-family:var(--font-b,system-ui,sans-serif)}',
      '#ra10-profile-card.out{animation:rpcFade .16s ease reverse both}',
      '.rpc{--ink:var(--color-text,#14161d);--ink2:var(--color-text-muted,#5d6375);--card:var(--color-surface,#fff);--well:rgba(20,22,29,.05);--line:rgba(20,22,29,.08);position:relative;width:min(420px,100%);max-height:calc(100vh - 32px);overflow:auto;border-radius:28px;background:var(--card);color:var(--ink);box-shadow:0 30px 80px -20px rgba(0,0,0,.5),0 0 0 1px var(--line);animation:rpcPop .32s cubic-bezier(.2,1.3,.4,1) both}',
      '[data-theme="dark"] .rpc{--card:#1a1b22;--ink:#eef0f6;--ink2:#a3a9b8;--well:rgba(255,255,255,.06);--line:rgba(255,255,255,.08)}',
      '.rpc-top{position:relative;padding:26px 22px 18px;text-align:center;overflow:hidden;isolation:isolate}',
      '.rpc-top::before{content:"";position:absolute;inset:-60% -30% 35%;z-index:-1;background:conic-gradient(from 90deg,hsl(var(--h) 85% 60% / .55),hsl(calc(var(--h) + 60) 85% 60% / .45),hsl(calc(var(--h) + 140) 85% 62% / .4),hsl(var(--h) 85% 60% / .55));filter:blur(40px);animation:rpcSpin 14s linear infinite}',
      '.rpc-x{position:absolute;top:12px;right:12px;width:36px;height:36px;border-radius:50%;border:0;background:var(--well);color:var(--ink);font-size:18px;line-height:1;cursor:pointer;display:grid;place-items:center}',
      '.rpc-x:hover{background:var(--line)}',
      '.rpc-av{width:92px;height:92px;margin:0 auto 12px;border-radius:50%;display:grid;place-items:center;overflow:hidden;font-weight:900;font-size:2rem;color:#fff;background:linear-gradient(135deg,hsl(var(--h) 75% 55%),hsl(calc(var(--h) + 40) 75% 45%));box-shadow:0 0 0 4px var(--card),0 0 0 7px hsl(var(--h) 80% 60% / .5),0 14px 30px -10px rgba(0,0,0,.45);animation:rpcBob 4s ease-in-out infinite}',
      '.rpc-av img{width:100%;height:100%;object-fit:cover}',
      '.rpc-name{margin:0;font-size:1.35rem;font-weight:900;letter-spacing:-.01em;word-break:break-word}',
      '.rpc-handle{margin:2px 0 0;color:var(--ink2);font-weight:700;font-size:.9rem}',
      '.rpc-chips{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:10px}',
      '.rpc-chip{display:inline-flex;align-items:center;gap:4px;padding:5px 10px;border-radius:999px;font-size:.74rem;font-weight:800;background:var(--well)}',
      '.rpc-chip.owner{background:linear-gradient(135deg,#fde68a,#f59e0b);color:#422006}',
      '.rpc-chip.admin{background:linear-gradient(135deg,#bfdbfe,#6366f1);color:#1e1b4b}',
      '.rpc-chip.you{background:#dcfce7;color:#14532d}',
      '.rpc-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:4px 18px 18px}',
      '.rpc-tile{position:relative;padding:14px 14px 12px;border-radius:20px;background:var(--well);overflow:hidden;animation:rpcUp .4s cubic-bezier(.2,1,.3,1) both}',
      '.rpc-tile:nth-child(2){animation-delay:.05s}.rpc-tile:nth-child(3){animation-delay:.1s}.rpc-tile:nth-child(4){animation-delay:.15s}',
      '.rpc-tile .ic{font-size:1.5rem;line-height:1;display:inline-block}',
      '.rpc-tile.fire .ic{animation:rpcFlame 1.4s ease-in-out infinite;transform-origin:50% 90%}',
      '.rpc-tile.trophy .ic{animation:rpcShine 2.6s ease-in-out infinite}',
      '.rpc-tile b{display:block;margin-top:8px;font-size:1.6rem;font-weight:900;font-variant-numeric:tabular-nums;letter-spacing:-.02em}',
      '.rpc-tile span{display:block;font-size:.76rem;font-weight:700;color:var(--ink2)}',
      '.rpc-tile small{display:block;margin-top:2px;font-size:.7rem;color:var(--ink2)}',
      '.rpc-tile.fire{background:linear-gradient(160deg,rgba(249,115,22,.16),rgba(239,68,68,.08))}',
      '.rpc-tile.trophy{background:linear-gradient(160deg,rgba(234,179,8,.18),rgba(245,158,11,.06))}',
      '.rpc-tile.cal{background:linear-gradient(160deg,rgba(59,130,246,.14),rgba(99,102,241,.06))}',
      '.rpc-tile.xp{background:linear-gradient(160deg,rgba(34,197,94,.15),rgba(16,185,129,.06))}',
      '.rpc-foot{margin:0 18px 18px;padding:12px 14px;border-radius:16px;background:var(--well);font-size:.82rem;color:var(--ink2);text-align:center;line-height:1.5}',
      '.rpc-foot b{color:var(--ink)}',
      '.rpc-skel{display:block;border-radius:10px;background:linear-gradient(90deg,var(--well),var(--line),var(--well));background-size:200% 100%;animation:rpcShimmer 1.2s linear infinite}',
      '.rpc-err{padding:28px 22px;text-align:center;color:var(--ink2)}',
      '@keyframes rpcFade{from{opacity:0}to{opacity:1}}',
      '@keyframes rpcPop{from{opacity:0;transform:translateY(16px) scale(.94)}to{opacity:1;transform:none}}',
      '@keyframes rpcUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}',
      '@keyframes rpcSpin{to{transform:rotate(360deg)}}',
      '@keyframes rpcBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}',
      '@keyframes rpcFlame{0%,100%{transform:scale(1) rotate(-4deg)}50%{transform:scale(1.15) rotate(4deg)}}',
      '@keyframes rpcShine{0%,100%{transform:rotate(0) scale(1)}10%{transform:rotate(-12deg) scale(1.12)}20%{transform:rotate(10deg) scale(1.12)}30%{transform:none}}',
      '@keyframes rpcShimmer{to{background-position:-200% 0}}',
      '@media (max-width:380px){.rpc-tile b{font-size:1.35rem}.rpc-grid{gap:8px;padding:4px 12px 14px}}',
      '@media (prefers-reduced-motion:reduce){#ra10-profile-card *,#ra10-profile-card{animation:none!important}}'
    ].join('\n');
    document.head.appendChild(st);
  })();

  /* ── rendering ──────────────────────────────────────────────────────── */
  function countUp(node, to) {
    var n = Number(to) || 0;
    if (!n || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { node.textContent = n.toLocaleString('en-GB'); return; }
    var t0 = performance.now(), dur = 700;
    (function step(t) {
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      node.textContent = Math.round(n * e).toLocaleString('en-GB');
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  function skeleton(id) {
    return '<div class="rpc" role="dialog" aria-modal="true" aria-label="Loading profile" style="--h:' + hue(id) + '">' +
      '<div class="rpc-top"><button type="button" class="rpc-x" aria-label="Close">✕</button>' +
      '<div class="rpc-av"></div><span class="rpc-skel" style="width:58%;height:22px;margin:0 auto 8px"></span><span class="rpc-skel" style="width:34%;height:14px;margin:0 auto"></span></div>' +
      '<div class="rpc-grid">' + [1, 2, 3, 4].map(function () { return '<div class="rpc-tile"><span class="rpc-skel" style="width:28px;height:28px"></span><span class="rpc-skel" style="width:60%;height:26px;margin-top:10px"></span></div>'; }).join('') + '</div></div>';
  }

  function cardHtml(p) {
    var me = window.RA10 && RA10.getProfile ? RA10.getProfile() : null;
    var isMe = !!(me && me.id && me.id === p.id);
    var name = p.full_name || (p.username ? '@' + p.username : 'RA10 member');
    var pic = String(p.profile_pic_url || '').trim();
    var j = joined(p.joined_at);
    var chips = '';
    if (p.badge === 'owner') chips += '<span class="rpc-chip owner">👑 Owner</span>';
    else if (p.badge === 'admin') chips += '<span class="rpc-chip admin">🛡️ Admin</span>';
    if (ROLES[p.user_role]) chips += '<span class="rpc-chip">' + ROLES[p.user_role] + '</span>';
    if (isMe) chips += '<span class="rpc-chip you">This is you</span>';
    var streak = Number(p.streak || 0), best = Number(p.best_streak || 0);
    var wins = Number(p.wins || 0), pods = Number(p.podiums || 0);
    var bestLabel = p.best_rank === 1 ? '🥇 1st place' : p.best_rank === 2 ? '🥈 2nd place' : p.best_rank === 3 ? '🥉 3rd place' : '';
    var foot = wins
      ? '🏆 <b>' + wins + '× weekly champion</b>' + (bestLabel ? ' · ' + bestLabel : '') + (p.last_win_week ? ' · last won the week of ' + esc(weekLabel(p.last_win_week)) : '')
      : pods
        ? '🥈 Best finish: <b>' + (p.best_rank === 2 ? '2nd' : '3rd') + ' place</b> on the weekly leaderboard'
        : (isMe ? 'Finish in the weekly top three to start your trophy cabinet!' : 'No leaderboard trophies yet — the race resets every Saturday.');
    return '<div class="rpc" role="dialog" aria-modal="true" aria-labelledby="rpc-name" style="--h:' + hue(p.id) + '">' +
      '<div class="rpc-top"><button type="button" class="rpc-x" aria-label="Close">✕</button>' +
        '<div class="rpc-av">' + (pic ? '<img src="' + esc(pic) + '" alt="">' : esc(initials(name))) + '</div>' +
        '<h2 class="rpc-name" id="rpc-name">' + esc(name) + '</h2>' +
        (p.username && p.full_name ? '<p class="rpc-handle">@' + esc(p.username) + '</p>' : '') +
        (chips ? '<div class="rpc-chips">' + chips + '</div>' : '') +
      '</div>' +
      '<div class="rpc-grid">' +
        '<div class="rpc-tile fire"><i class="ic" aria-hidden="true">🔥</i><b data-count="' + streak + '">0</b><span>Day streak</span><small>Best: ' + best + ' day' + (best === 1 ? '' : 's') + '</small></div>' +
        '<div class="rpc-tile trophy"><i class="ic" aria-hidden="true">🏆</i><b data-count="' + wins + '">0</b><span>Leaderboard win' + (wins === 1 ? '' : 's') + '</span><small>' + pods + ' top-3 finish' + (pods === 1 ? '' : 'es') + '</small></div>' +
        '<div class="rpc-tile cal"><i class="ic" aria-hidden="true">📅</i><b>' + esc(j.big) + '</b><span>' + esc(j.small) + '</span><small>' + Number(p.study_days || 0) + ' study day' + (Number(p.study_days) === 1 ? '' : 's') + '</small></div>' +
        '<div class="rpc-tile xp"><i class="ic" aria-hidden="true">⚡</i><b data-count="' + Number(p.xp_total || 0) + '">0</b><span>Total XP</span><small>' + Number(p.xp_this_week || 0).toLocaleString('en-GB') + ' this week</small></div>' +
      '</div>' +
      '<p class="rpc-foot">' + foot + '</p>' +
    '</div>';
  }

  function close() {
    var ov = document.getElementById('ra10-profile-card');
    if (!ov) return;
    ov.classList.add('out');
    document.removeEventListener('keydown', onKey, true);
    setTimeout(function () { ov.remove(); if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) {} }, 150);
  }
  function onKey(e) { if (e.key === 'Escape') { e.preventDefault(); close(); } }

  async function open(ref) {
    ref = String(ref || '').trim();
    if (!ref) return;
    lastFocus = document.activeElement;
    var old = document.getElementById('ra10-profile-card');
    if (old) old.remove();
    var ov = document.createElement('div');
    ov.id = 'ra10-profile-card';
    ov.innerHTML = skeleton(ref);
    document.body.appendChild(ov);
    ov.addEventListener('click', function (e) { if (e.target === ov || e.target.closest('.rpc-x')) close(); });
    document.addEventListener('keydown', onKey, true);
    var x = ov.querySelector('.rpc-x'); if (x) x.focus();
    try {
      var p = cache[ref];
      if (!p || Date.now() - p._at > 60000) {
        if (!window.RA10 || typeof RA10.getPublicProfile !== 'function') throw new Error('Profiles are unavailable right now.');
        p = await RA10.getPublicProfile(ref);
        if (p) { p._at = Date.now(); cache[ref] = p; }
      }
      if (!document.body.contains(ov)) return;
      if (!p) { ov.innerHTML = '<div class="rpc"><div class="rpc-top"><button type="button" class="rpc-x" aria-label="Close">✕</button></div><p class="rpc-err">We couldn’t find this member.</p></div>'; return; }
      ov.innerHTML = cardHtml(p);
      ov.querySelectorAll('[data-count]').forEach(function (b) { countUp(b, b.getAttribute('data-count')); });
      var x2 = ov.querySelector('.rpc-x'); if (x2) x2.focus();
    } catch (err) {
      if (!document.body.contains(ov)) return;
      var msg = err && err.message ? String(err.message) : '';
      ov.innerHTML = '<div class="rpc"><div class="rpc-top"><button type="button" class="rpc-x" aria-label="Close">✕</button></div><p class="rpc-err">' +
        (/get_public_profile|function|schema/i.test(msg) ? 'Profile cards aren’t switched on yet.' : 'Couldn’t load this profile. Please try again.') + '</p></div>';
    }
  }

  // Anything marked data-user="<id>" opens the card (capture phase, so a click on a name inside a
  // clickable thread or row opens the profile instead of the thread).
  function target(e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-user]') : null;
    if (!t || !t.getAttribute('data-user')) return null;
    if (e.target.closest('[data-lbx-pen], #ra10-profile-card')) return null;
    var ctl = e.target.closest('button, a[href], input, select, textarea');
    if (ctl && ctl !== t && t.contains(ctl)) return null;   // real buttons inside a row keep working
    return t;
  }
  document.addEventListener('click', function (e) {
    var t = target(e);
    if (!t) return;
    e.preventDefault(); e.stopPropagation();
    open(t.getAttribute('data-user'));
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var t = target(e);
    if (!t || t !== e.target) return;
    e.preventDefault();
    open(t.getAttribute('data-user'));
  });

  window.RA10ProfileCard = { open: open, close: close };
})();
