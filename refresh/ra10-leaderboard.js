/* RA10 Leaderboard v2 — arena hero, "you" card with XP-to-next, XP boost
   rewards, podium, role badges and a profile-picture editor (pen on your own
   avatar). Rendered by index.html's renderLeaderboard() when this file is loaded.

   window.RA10Leaderboard.render({ host, rows, sb, currentId })
   window.RA10Leaderboard.openPictureEditor()                                  */
(function () {
  'use strict';
  if (window.RA10Leaderboard) return;

  var ROLES = {
    student: { label: 'Student', icon: '🎓', cls: 'student' },
    teacher: { label: 'Teacher', icon: '🍎', cls: 'teacher' },
    educator: { label: 'Educator', icon: '📚', cls: 'educator' },
    other: { label: 'Learner', icon: '✨', cls: 'other' },
  };
  var PEN = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  // Historical podium badges contain labels such as "Last week"; they belong
  // in account history, not in the current week's player name.
  function nameOf(u) {
    return esc(u && u.username ? '@' + u.username : ((u && u.full_name) || 'Player'));
  }
  function picOf(u) { return typeof window.getProfilePictureUrl === 'function' ? window.getProfilePictureUrl(u) : (u.profile_pic_url || ''); }
  function initials(u) { return typeof window.getLeaderboardInitials === 'function' ? window.getLeaderboardInitials(u) : esc(((u.full_name || u.username || '?').charAt(0)).toUpperCase()); }
  function badgeOf(u) { return String((u && (u.badge_emoji || u.emoji_badge)) || '').trim(); }
  function roleChip(u) {
    var r = ROLES[u && u.user_role];
    return r ? '<span class="lbx-role ' + r.cls + '" title="' + r.label + '">' + r.icon + ' ' + r.label + '</span>' : '';
  }
  function avatar(u, size, mine) {
    var pic = picOf(u);
    var inner = pic ? '<img src="' + esc(pic) + '" alt="" loading="lazy">' : '<span>' + initials(u) + '</span>';
    return '<span class="lbx-av ' + size + (mine ? ' mine' : '') + '">' + inner +
      (mine ? '<button type="button" class="lbx-pen" data-lbx-pen aria-label="Change your profile picture" title="Change profile picture">' + PEN + '</button>' : '') + '</span>';
  }

  /* ── Styles ─────────────────────────────────────────────────────────── */
  (function css() {
    if (document.getElementById('lbx-css')) return;
    var st = document.createElement('style');
    st.id = 'lbx-css';
    st.textContent = [
      '#p-leaderboard .lb-hero-duo{display:none!important}',
      '.lbx{--lbx-ink:#13151c;--lbx-ink2:#5a6072;--lbx-card:#fff;--lbx-line:rgba(19,21,28,.08);--lbx-well:rgba(19,21,28,.045);display:grid;gap:18px;font-family:var(--font-b,system-ui,sans-serif);color:var(--lbx-ink)}',
      '[data-theme="dark"] .lbx{--lbx-ink:#eef0f6;--lbx-ink2:#a1a7b6;--lbx-card:#1b1c22;--lbx-line:rgba(255,255,255,.08);--lbx-well:rgba(255,255,255,.05)}',
      // hero
      '.lbx-hero{position:relative;overflow:hidden;border-radius:30px;padding:30px 28px 26px;color:#fff;background:#0d1024;isolation:isolate}',
      '.lbx-hero::before{content:"";position:absolute;inset:-40%;z-index:-1;background:conic-gradient(from 0deg at 50% 50%,#22c55e33,#3b82f644,#a855f744,#f59e0b33,#22c55e33);filter:blur(60px);animation:lbxSpin 18s linear infinite}',
      '.lbx-hero::after{content:"";position:absolute;inset:0;z-index:-1;background-image:radial-gradient(rgba(255,255,255,.18) 1px,transparent 1px);background-size:22px 22px;mask-image:linear-gradient(180deg,#000,transparent 85%);-webkit-mask-image:linear-gradient(180deg,#000,transparent 85%)}',
      '@keyframes lbxSpin{to{transform:rotate(360deg)}}',
      '.lbx-eyebrow{font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#a7f3d0}',
      '.lbx-hero h1{margin:6px 0 6px;font-family:var(--font-d,Georgia,serif);font-weight:400;font-size:clamp(2rem,5vw,3.2rem);line-height:1.02;letter-spacing:-.01em;color:#fff}',
      '.lbx-hero p{margin:0 0 16px;max-width:560px;color:#c7cbe0;font-size:.95rem}',
      '.lbx-prizes{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}',
      '.lbx-prize{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:999px;font-weight:800;font-size:.8rem;background:rgba(255,255,255,.1);box-shadow:inset 0 0 0 1px rgba(255,255,255,.14);backdrop-filter:blur(8px)}',
      '.lbx-hero .lb-countdown-pill{background:rgba(255,255,255,.1)!important;color:#fff!important;border-color:rgba(255,255,255,.18)!important}',
      // me card
      '.lbx-me{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:18px;align-items:center;padding:18px 20px;border-radius:24px;background:var(--lbx-card);box-shadow:0 0 0 1px var(--lbx-line),0 16px 40px -24px rgba(15,23,42,.35)}',
      '@media(max-width:640px){.lbx-me{grid-template-columns:auto minmax(0,1fr)}.lbx-me-rank{grid-column:1/-1;justify-self:start}}',
      '.lbx-me h3{margin:0;font-size:1.05rem;font-weight:800;display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
      '.lbx-me-sub{font-size:.84rem;color:var(--lbx-ink2);margin:3px 0 10px}',
      '.lbx-bar{height:10px;border-radius:999px;background:var(--lbx-well);overflow:hidden}',
      '.lbx-bar span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22c55e,#3b82f6);transition:width 1s cubic-bezier(.2,.8,.2,1)}',
      '.lbx-me-rank{text-align:center;min-width:92px;padding:10px 14px;border-radius:18px;background:linear-gradient(135deg,#ecfdf5,#eff6ff)}',
      '[data-theme="dark"] .lbx-me-rank{background:linear-gradient(135deg,#0f2f22,#132544)}',
      '.lbx-me-rank b{display:block;font-size:1.7rem;font-weight:900;line-height:1;background:linear-gradient(135deg,#16a34a,#2563eb);-webkit-background-clip:text;background-clip:text;color:transparent}',
      '.lbx-me-rank small{font-size:.68rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--lbx-ink2)}',
      // avatars
      '.lbx-av{position:relative;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;border-radius:50%;overflow:visible;font-weight:800;color:#fff;background:linear-gradient(135deg,#60a5fa,#a78bfa)}',
      '.lbx-av>img,.lbx-av>span{width:100%;height:100%;border-radius:50%;object-fit:cover;display:inline-flex;align-items:center;justify-content:center}',
      '.lbx-av.sm{width:40px;height:40px;font-size:.85rem}.lbx-av.md{width:64px;height:64px;font-size:1.2rem}.lbx-av.lg{width:78px;height:78px;font-size:1.4rem}',
      '.lbx-av.mine{box-shadow:0 0 0 3px var(--lbx-card),0 0 0 5px #22c55e}',
      '.lbx-pen{position:absolute;right:-4px;bottom:-4px;width:26px;height:26px;border-radius:50%;border:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;color:#fff;background:linear-gradient(135deg,#1f6feb,#7c3aed);box-shadow:0 0 0 3px var(--lbx-card),0 6px 14px -4px rgba(76,80,235,.7);transition:transform .15s}',
      '.lbx-av.sm .lbx-pen{width:20px;height:20px;right:-5px;bottom:-5px}.lbx-av.sm .lbx-pen svg{width:10px;height:10px}',
      '.lbx-pen:hover{transform:scale(1.12)}',
      // role chips
      '.lbx-role{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:999px;font-size:.68rem;font-weight:800;white-space:nowrap}',
      '.lbx-role.student{background:#dbeafe;color:#1d4ed8}.lbx-role.teacher{background:#fee2e2;color:#b91c1c}.lbx-role.educator{background:#ede9fe;color:#6d28d9}.lbx-role.other{background:#f1f5f9;color:#475569}',
      '[data-theme="dark"] .lbx-role.student{background:#1e3a8a55;color:#93c5fd}[data-theme="dark"] .lbx-role.teacher{background:#7f1d1d55;color:#fca5a5}[data-theme="dark"] .lbx-role.educator{background:#4c1d9555;color:#c4b5fd}[data-theme="dark"] .lbx-role.other{background:#33415555;color:#cbd5e1}',
      // boosts
      '.lbx-boosts{padding:18px 20px;border-radius:24px;background:linear-gradient(135deg,#fff7ed,#fdf2f8);box-shadow:0 0 0 1px rgba(249,115,22,.18)}',
      '[data-theme="dark"] .lbx-boosts{background:linear-gradient(135deg,#2a1a0e,#2a1022);box-shadow:0 0 0 1px rgba(249,115,22,.25)}',
      '.lbx-boosts h3{margin:0 0 4px;font-size:1.05rem;font-weight:800}',
      '.lbx-boosts>p{margin:0 0 12px;font-size:.84rem;color:var(--lbx-ink2)}',
      '.lbx-bgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}',
      '.lbx-b{display:flex;flex-direction:column;gap:6px;padding:12px 14px;border-radius:18px;background:var(--lbx-card);box-shadow:0 0 0 1px var(--lbx-line)}',
      '.lbx-b .m{align-self:flex-start;padding:3px 9px;border-radius:999px;font-weight:900;font-size:.8rem;color:#fff;background:linear-gradient(135deg,#f59e0b,#ef4444)}',
      '.lbx-b .m.x3{background:linear-gradient(135deg,#ef4444,#d946ef)}',
      '.lbx-b b{font-size:.9rem}.lbx-b small{font-size:.76rem;color:var(--lbx-ink2)}',
      '.lbx-b button{margin-top:auto;height:34px;border:0;border-radius:11px;font:800 .78rem/1 var(--font-b,system-ui);cursor:pointer;color:#fff;background:linear-gradient(180deg,#22c55e,#16a34a);box-shadow:0 3px 0 #15803d}',
      '.lbx-b button.alt{background:linear-gradient(180deg,#f59e0b,#ea580c);box-shadow:0 3px 0 #c2410c}',
      '.lbx-b button:disabled{opacity:.55;cursor:default;box-shadow:none;background:var(--lbx-well);color:var(--lbx-ink2)}',
      '.lbx-b.live{box-shadow:0 0 0 2px #f59e0b,0 10px 24px -14px rgba(245,158,11,.8)}',
      '.lbx-bmsg{min-height:1.2em;margin-top:8px;font-size:.8rem;font-weight:600;color:#b45309}',
      // podium
      '.lbx-podium{display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:12px;align-items:end;padding:26px 14px 0;border-radius:28px;background:linear-gradient(180deg,var(--lbx-card),transparent);box-shadow:0 0 0 1px var(--lbx-line)}',
      '.lbx-p{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;min-width:0}',
      '.lbx-p .nm{font-weight:800;font-size:.92rem;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.lbx-p .xp{font-weight:900;font-size:.85rem;color:var(--lbx-ink2)}',
      '.lbx-p .crown{font-size:1.6rem;line-height:1;animation:lbxFloat 2.4s ease-in-out infinite}',
      '@keyframes lbxFloat{50%{transform:translateY(-5px)}}',
      '.lbx-ped{width:100%;border-radius:18px 18px 0 0;display:flex;align-items:flex-start;justify-content:center;padding-top:10px;font:900 2.2rem/1 var(--font-b,system-ui);color:rgba(255,255,255,.95);text-shadow:0 2px 0 rgba(0,0,0,.15)}',
      '.lbx-p.r1 .lbx-ped{height:150px;background:linear-gradient(180deg,#fcd34d,#f59e0b);box-shadow:0 -10px 40px -10px rgba(245,158,11,.7)}',
      '.lbx-p.r2 .lbx-ped{height:112px;background:linear-gradient(180deg,#cbd5e1,#94a3b8)}',
      '.lbx-p.r3 .lbx-ped{height:88px;background:linear-gradient(180deg,#fdba74,#c2410c)}',
      '.lbx-p.r1 .lbx-av{box-shadow:0 0 0 4px #fcd34d,0 0 30px rgba(245,158,11,.6)}',
      '.lbx-p.r2 .lbx-av{box-shadow:0 0 0 4px #cbd5e1}.lbx-p.r3 .lbx-av{box-shadow:0 0 0 4px #fdba74}',
      // list
      '.lbx-list{border-radius:24px;background:var(--lbx-card);box-shadow:0 0 0 1px var(--lbx-line);padding:8px}',
      '.lbx-row{display:grid;grid-template-columns:40px auto minmax(0,1fr) auto;gap:12px;align-items:center;padding:10px 12px;border-radius:16px;transition:background .15s}',
      '.lbx-row:hover{background:var(--lbx-well)}',
      '.lbx-row.me{background:linear-gradient(90deg,rgba(34,197,94,.14),rgba(59,130,246,.08));box-shadow:inset 0 0 0 1.5px rgba(34,197,94,.55)}',
      '.lbx-row .rk{font-weight:900;font-size:1rem;text-align:center;color:var(--lbx-ink2);font-variant-numeric:tabular-nums}',
      '.lbx-row .rk.top{font-size:1.25rem}',
      '.lbx-row .who{min-width:0}',
      '.lbx-row .who .l1{display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-weight:800;font-size:.92rem}',
      '.lbx-row .who .l1 .n{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}',
      '.lbx-row .who .l2{display:flex;align-items:center;gap:8px;margin-top:5px;font-size:.72rem;color:var(--lbx-ink2)}',
      '.lbx-row .who .lbx-bar{flex:1;height:6px;max-width:220px}',
      '.lbx-row .pts{font-weight:900;font-variant-numeric:tabular-nums;text-align:right}',
      '.lbx-row .pts small{display:block;font-size:.68rem;font-weight:700;color:var(--lbx-ink2)}',
      '.lbx-you{padding:2px 8px;border-radius:999px;font-size:.68rem;font-weight:800;background:#22c55e;color:#fff}',
      '.lbx-sep{display:flex;align-items:center;gap:8px;margin:6px 12px;font-size:.7rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#16a34a}',
      '.lbx-sep::before,.lbx-sep::after{content:"";flex:1;height:1px;background:rgba(34,197,94,.35)}',
      '.lbx-empty{text-align:center;padding:40px 16px;color:var(--lbx-ink2)}',
      '.lbx-rules{font-size:.84rem;color:var(--lbx-ink2);text-align:center}',
      // picture editor
      '.lbx-pe{position:fixed!important;top:0!important;right:0!important;bottom:0!important;left:0!important;width:100vw!important;height:100dvh!important;z-index:2147483647!important;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;background:rgba(10,12,20,.45);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);overflow:auto;isolation:isolate}',
      '.lbx-modal-open{overflow:hidden!important}',
      '.lbx-pe-card{width:min(400px,100%);border-radius:28px;padding:24px;text-align:center;background:var(--lbx-card,#fff);color:var(--lbx-ink,#13151c);box-shadow:0 30px 80px -20px rgba(0,0,0,.5);font-family:var(--font-b,system-ui,sans-serif);animation:lbxPop .3s cubic-bezier(.2,.9,.3,1.2) both}',
      '[data-theme="dark"] .lbx-pe-card{--lbx-card:#1b1c22;--lbx-ink:#eef0f6;--lbx-ink2:#a1a7b6;--lbx-line:rgba(255,255,255,.1);--lbx-well:rgba(255,255,255,.06)}',
      '@keyframes lbxPop{from{opacity:0;transform:scale(.94) translateY(10px)}to{opacity:1;transform:none}}',
      '.lbx-pe-card h3{margin:0 0 4px;font-size:1.15rem;font-weight:800}',
      '.lbx-pe-card p{margin:0 0 16px;font-size:.84rem;color:var(--lbx-ink2,#5a6072)}',
      '.lbx-pe-av{width:128px;height:128px;margin:0 auto 16px;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:2.4rem;font-weight:900;color:#fff;background:linear-gradient(135deg,#60a5fa,#a78bfa);box-shadow:0 0 0 5px var(--lbx-card,#fff),0 0 0 7px #22c55e,0 18px 40px -16px rgba(15,23,42,.5)}',
      '.lbx-pe-av img{width:100%;height:100%;object-fit:cover}',
      '.lbx-pe-drop{display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px;border-radius:18px;border:2px dashed rgba(59,130,246,.35);background:rgba(59,130,246,.05);cursor:pointer;font-size:.85rem;font-weight:700}',
      '.lbx-pe-drop small{font-weight:500;color:var(--lbx-ink2,#5a6072)}',
      '.lbx-pe-drop.drag{border-color:#3b82f6;background:rgba(59,130,246,.12)}',
      '.lbx-pe-link{display:flex;gap:6px;margin-top:10px}',
      '.lbx-pe-link input{flex:1;min-width:0;height:38px;border-radius:12px;border:1px solid var(--lbx-line,#ddd)!important;background:var(--lbx-well,#f6f6f8)!important;color:inherit!important;padding:0 12px;font:inherit;font-size:.82rem;box-shadow:none!important}',
      '.lbx-pe-err{min-height:1.2em;margin:8px 0 0;font-size:.8rem;color:#dc2626;font-weight:600}',
      '.lbx-pe-actions{display:flex;gap:8px;margin-top:14px}',
      '.lbx-pe-actions button,.lbx-pe-link button{border:0;border-radius:12px;font:800 .84rem/1 var(--font-b,system-ui);cursor:pointer;height:42px;padding:0 14px;background:var(--lbx-well,#f1f1f4);color:inherit}',
      '.lbx-pe-actions .save{flex:1;color:#fff;background:linear-gradient(180deg,#22c55e,#16a34a);box-shadow:0 3px 0 #15803d}',
      '.lbx-pe-actions .del{color:#dc2626}',
      '.lbx-pe-actions button:disabled{opacity:.6;cursor:default}',
    ].join('\n');
    document.head.appendChild(st);
  })();

  /* ── Render ─────────────────────────────────────────────────────────── */
  var last = null;   // remember the last render args so we can refresh after edits

  function render(opts) {
    last = opts;
    var host = opts.host, rows = opts.rows || [], currentId = opts.currentId || '';
    var me = rows.find(function (u) { return u.id === currentId; }) || null;
    var myIndex = me ? rows.indexOf(me) : -1;
    var top = rows[0];
    var maxXp = Math.max(1, Number((top && top.xp_this_week) || 1));

    var html = '<div class="lbx">';
    html += '<section class="lbx-hero"><div class="lbx-eyebrow">Weekly XP League</div><h1>Climb the leaderboard</h1>' +
      '<p>This board shows XP earned this week. Every question, quiz and flashcard earns XP, so overtake friends, grab an XP boost and finish in the top three for credits before the Saturday reset.</p>' +
      '<div class="lbx-prizes"><span class="lbx-prize">🥇 30 credits</span><span class="lbx-prize">🥈 20 credits</span><span class="lbx-prize">🥉 10 credits</span></div>' +
      '<div id="lb-countdown-inline" class="lb-countdown-pill">Resets in --:--:--</div></section>';

    if (currentId) html += '<div data-lbx-me></div><div data-lbx-boosts></div>';

    if (!rows.length) {
      html += '<div class="lbx-list"><div class="lbx-empty">No XP earned yet this week. Answer a question to take first place!</div></div>';
    } else {
      var podium = [rows[1], rows[0], rows[2]];
      html += '<section class="lbx-podium" aria-label="Top three">' + podium.map(function (u, i) {
        if (!u) return '<div></div>';
        var rank = i === 1 ? 1 : (i === 0 ? 2 : 3);
        var mine = u.id === currentId;
        return '<div class="lbx-p r' + rank + '">' + (rank === 1 ? '<span class="crown" aria-hidden="true">👑</span>' : '') +
          avatar(u, rank === 1 ? 'lg' : 'md', mine) +
          '<span class="nm">' + nameOf(u) + '</span>' + roleChip(u) +
          '<span class="xp">' + Number(u.xp_this_week || 0) + ' XP</span>' +
          '<div class="lbx-ped">' + rank + '</div></div>';
      }).join('') + '</section>';

      html += '<section class="lbx-list" aria-label="Leaderboard">' + rows.map(function (u, i) {
        var mine = u.id === currentId;
        var medal = ['🥇', '🥈', '🥉'][i];
        var pct = Math.max(3, Math.round(Number(u.xp_this_week || 0) / maxXp * 100));
        var badge = badgeOf(u);
        return (i === 3 ? '<div class="lbx-sep">Prize zone ends</div>' : '') +
          '<div class="lbx-row' + (mine ? ' me' : '') + '"' + (mine ? ' data-lbx-myrow' : '') + '>' +
          '<span class="rk' + (medal ? ' top' : '') + '">' + (medal || (i + 1)) + '</span>' + avatar(u, 'sm', mine) +
          '<div class="who"><div class="l1"><span class="n">' + nameOf(u) + '</span>' + roleChip(u) + (badge ? '<span>' + badge + '</span>' : '') + (mine ? '<span class="lbx-you">You</span>' : '') + '</div>' +
          '<div class="l2"><div class="lbx-bar"><span style="width:' + pct + '%"></span></div><span>' + Number(u.xp_total || 0).toLocaleString('en-GB') + ' total</span></div></div>' +
          '<span class="pts">' + Number(u.xp_this_week || 0).toLocaleString('en-GB') + '<small>XP</small></span></div>';
      }).join('') + '</section>';
    }
    html += '<p class="lbx-rules">🏆 Top three on Saturday win 30, 20 and 10 credits. XP boosts multiply the XP you earn while they run.</p></div>';
    host.innerHTML = html;
    host.style.display = 'block';

    if (currentId) {
      renderMe(host.querySelector('[data-lbx-me]'), rows, me, myIndex, opts.sb);
      renderBoosts(host.querySelector('[data-lbx-boosts]'));
    }
    host.querySelectorAll('[data-lbx-pen]').forEach(function (b) { b.onclick = function (e) { e.preventDefault(); e.stopPropagation(); openPictureEditor(); }; });
  }

  function renderMe(slot, rows, me, myIndex, sb) {
    if (!slot) return;
    var profile = (window.RA10 && RA10.getProfile && RA10.getProfile()) || {};
    function paint(meRow, rank) {
      var u = Object.assign({}, profile, meRow || {});
      var xp = Number(u.xp_this_week || 0);
      var ahead = rank > 1 ? rows[rank - 2] : null;
      var gap = ahead ? Math.max(1, Number(ahead.xp_this_week || 0) - xp + 1) : 0;
      var pct = ahead ? Math.min(100, Math.round(xp / Math.max(1, Number(ahead.xp_this_week || 0)) * 100)) : 100;
      var sub = !xp ? 'Answer a question to join this week’s league.'
        : rank === 1 ? 'You’re leading the league. Keep the lead until Saturday!'
        : ahead ? '<b>' + gap + ' XP</b> to overtake ' + nameOf(ahead) + '.' : 'Keep earning XP to climb.';
      slot.innerHTML = '<section class="lbx-me">' + avatar(u, 'md', true) +
        '<div><h3>' + nameOf(u) + roleChip(u) + '</h3><div class="lbx-me-sub">' + sub + '</div>' +
        '<div class="lbx-bar" aria-hidden="true"><span style="width:0%"></span></div></div>' +
        '<div class="lbx-me-rank"><b>' + (xp ? '#' + rank : '–') + '</b><small>' + xp.toLocaleString('en-GB') + ' XP this week</small></div></section>';
      var bar = slot.querySelector('.lbx-bar span');
      requestAnimationFrame(function () { requestAnimationFrame(function () { if (bar) bar.style.width = pct + '%'; }); });
      var pen = slot.querySelector('[data-lbx-pen]');
      if (pen) pen.onclick = function (e) { e.preventDefault(); e.stopPropagation(); openPictureEditor(); };
    }
    if (me) { paint(me, myIndex + 1); return; }
    paint(null, 0);
    // Outside the top list: ask the server for our rank.
    if (sb && sb.rpc) {
      sb.rpc('get_my_rank').then(function (res) {
        var r = res && !res.error && (Array.isArray(res.data) ? res.data[0] : res.data);
        if (r) paint({ xp_this_week: r.xp_this_week }, Number(r.rank) || 0);
      }, function () {});
    }
  }

  function renderBoosts(slot) {
    if (!slot) return;
    var XP = window.RA10XP;
    if (!XP) { slot.innerHTML = ''; return; }
    function paint() {
      if (!XP.available()) {
        slot.innerHTML = '<section class="lbx-boosts"><h3>⚡ XP boosts</h3><p>XP boosts are almost ready - check back soon.</p></section>';
        return;
      }
      var owned = XP.boosts();
      var live = XP.active();
      var cards = Object.keys(XP.BOOSTS).map(function (key) {
        var b = XP.BOOSTS[key];
        var inv = owned.find(function (o) { return o.source === key && !o.activated_at; });
        var running = live && live.source === key;
        var btn = running ? '<button type="button" disabled>Running · ' + XP.formatLeft(new Date(live.expires_at) - Date.now()) + '</button>'
          : inv ? '<button type="button" class="alt" data-act="' + inv.id + '"' + (live ? ' disabled title="Wait for your current boost to finish"' : '') + '>Activate ' + b.mult + 'x now</button>'
          : '<button type="button" data-claim="' + key + '">Claim</button>';
        return '<div class="lbx-b' + (running ? ' live' : '') + '"><span class="m' + (b.mult === 3 ? ' x3' : '') + '">' + b.mult + 'x XP · ' + b.mins + ' min</span>' +
          '<b>' + esc(b.title) + '</b><small>' + esc(b.how) + '</small>' + btn + '</div>';
      }).join('');
      slot.innerHTML = '<section class="lbx-boosts"><h3>⚡ XP boosts</h3><p>Earn a boost, then switch it on when you’re ready to revise - every XP you earn while it runs is multiplied.</p>' +
        '<div class="lbx-bgrid">' + cards + '</div><div class="lbx-bmsg" role="status"></div></section>';
      var msg = slot.querySelector('.lbx-bmsg');
      slot.querySelectorAll('[data-claim]').forEach(function (b) {
        b.onclick = function () {
          b.disabled = true; msg.textContent = '';
          XP.claim(b.getAttribute('data-claim')).then(function () { msg.textContent = 'Boost added - activate it when you start revising.'; paint(); },
            function (err) { b.disabled = false; msg.textContent = (err && err.message) || 'Not unlocked yet.'; });
        };
      });
      slot.querySelectorAll('[data-act]').forEach(function (b) {
        b.onclick = function () {
          b.disabled = true;
          XP.activate(Number(b.getAttribute('data-act'))).then(paint, function (err) { b.disabled = false; msg.textContent = (err && err.message) || 'Could not start the boost.'; });
        };
      });
    }
    paint();
    if (!slot._lbxBound) { slot._lbxBound = true; XP.onChange(function () { if (document.body.contains(slot)) paint(); }); }
    XP.refresh();
    clearInterval(slot._lbxTick);
    slot._lbxTick = setInterval(function () { if (!document.body.contains(slot)) return clearInterval(slot._lbxTick); if (XP.active()) paint(); }, 1000);
  }

  /* ── Profile picture editor ─────────────────────────────────────────── */
  function openPictureEditor() {
    if (!window.RA10 || !RA10.isLoggedIn()) return;
    if (document.querySelector('.lbx-pe')) return;
    var profile = RA10.getProfile() || {};
    var current = picOf(profile);
    var pending = null;   // URL to save (string) | '' (remove) | null (unchanged)
    var prevFocus = document.activeElement;
    var previousBodyOverflow = document.body.style.overflow;
    var previousHtmlOverflow = document.documentElement.style.overflow;
    var wrap = document.createElement('div');
    wrap.className = 'lbx-pe';
    wrap.setAttribute('role', 'presentation');
    wrap.setAttribute('aria-label', 'Change profile picture');
    wrap.style.cssText = 'position:fixed;top:0;right:0;bottom:0;left:0;width:100vw;height:100dvh;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;overflow:auto;';
    wrap.innerHTML = '<div class="lbx-pe-card" role="dialog" aria-modal="true" aria-label="Change profile picture">' +
      '<h3>Your profile picture</h3><p>Shown on the leaderboard and your profile.</p>' +
      '<div class="lbx-pe-av"></div>' +
      '<label class="lbx-pe-drop" tabindex="0"><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden><span>📷 Upload a photo</span><small>PNG, JPEG, WebP or GIF · up to 2 MB</small></label>' +
      '<div class="lbx-pe-link"><input type="url" placeholder="…or paste an image link" aria-label="Image link"><button type="button" data-link>Use</button></div>' +
      '<p class="lbx-pe-err" role="alert"></p>' +
      '<div class="lbx-pe-actions">' + (current ? '<button type="button" class="del" data-del>Remove</button>' : '') + '<button type="button" data-cancel>Cancel</button><button type="button" class="save" data-save disabled>Save</button></div></div>';
    // Portal the dialog outside page sections/footers so ancestor layout and
    // stacking contexts cannot place it below the document content.
    (document.documentElement || document.body).appendChild(wrap);
    var $ = function (s) { return wrap.querySelector(s); };
    var av = $('.lbx-pe-av'), err = $('.lbx-pe-err'), save = $('[data-save]');
    function show(url) { av.innerHTML = url ? '<img alt="" src="' + esc(url) + '">' : initials(profile); }
    show(current);
    function setPending(url) { pending = url; show(url); save.disabled = false; err.textContent = ''; }
    function close() {
      wrap.remove();
      document.documentElement.classList.remove('lbx-modal-open');
      document.body.classList.remove('lbx-modal-open');
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.removeEventListener('keydown', onKey, true);
      try { prevFocus && prevFocus.focus(); } catch (e) {}
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey, true);
    document.documentElement.classList.add('lbx-modal-open');
    document.body.classList.add('lbx-modal-open');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    wrap.addEventListener('click', function (e) { if (e.target === wrap) { e.preventDefault(); close(); } });
    $('[data-cancel]').onclick = function (e) { e.preventDefault(); close(); };

    var file = $('input[type=file]'), drop = $('.lbx-pe-drop');
    function upload(f) {
      if (!f) return;
      if (typeof window.uploadProfilePictureToCatbox !== 'function') { err.textContent = 'Upload is not available on this page.'; return; }
      drop.querySelector('span').textContent = 'Uploading…';
      window.uploadProfilePictureToCatbox(f).then(function (url) { setPending(url); }, function (e2) { err.textContent = (e2 && e2.message) || 'Upload failed.'; })
        .then(function () { drop.querySelector('span').textContent = '📷 Upload a photo'; });
    }
    file.onchange = function () { upload(file.files && file.files[0]); };
    drop.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); file.click(); } });
    ['dragenter', 'dragover'].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add('drag'); }); });
    ['dragleave', 'drop'].forEach(function (t) { drop.addEventListener(t, function () { drop.classList.remove('drag'); }); });
    drop.addEventListener('drop', function (e) { e.preventDefault(); upload(e.dataTransfer.files && e.dataTransfer.files[0]); });
    $('[data-link]').onclick = function () {
      var raw = $('.lbx-pe-link input').value;
      var v = typeof window.validateProfileImageUrl === 'function' ? window.validateProfileImageUrl(raw) : { ok: /^https:\/\//.test(raw), value: raw.trim(), error: 'Use an https:// image link.' };
      if (!v.ok) { err.textContent = v.error || 'That link doesn’t look like an image.'; return; }
      setPending(v.value);
    };
    var del = $('[data-del]');
    if (del) del.onclick = function () { setPending(''); };

    save.onclick = function () {
      if (pending === null) return close();
      save.disabled = true; save.textContent = 'Saving…';
      var id = (RA10.getSession() && RA10.getSession().user && RA10.getSession().user.id) || profile.id;
      var req = typeof window.authedProfilesRequest === 'function'
        ? window.authedProfilesRequest('PATCH', '?id=eq.' + encodeURIComponent(id), { profile_pic_url: pending || null }, 'return=representation')
        : RA10.getClient().from('profiles').update({ profile_pic_url: pending || null }).eq('id', id).then(function (r) { if (r.error) throw r.error; });
      Promise.resolve(req).then(function () {
        if (!pending && typeof window.deleteOwnProfilePictureStorage === 'function') return window.deleteOwnProfilePictureStorage().catch(function () {});
      }).then(function () { return RA10.refreshProfile ? RA10.refreshProfile() : null; }).then(function () {
        if (typeof window._updateNavAuth === 'function') window._updateNavAuth();
        close();
        if (typeof window.renderLeaderboard === 'function' && document.getElementById('p-leaderboard')) window.renderLeaderboard();
      }, function (e3) { save.disabled = false; save.textContent = 'Save'; err.textContent = (e3 && e3.message) || 'Could not save.'; });
    };
    $('.lbx-pe-drop').focus();
  }

  window.RA10Leaderboard = { render: render, openPictureEditor: openPictureEditor, ROLES: ROLES };
})();
