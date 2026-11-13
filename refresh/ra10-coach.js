/* RA10 — answer coaching inside every unit app (loaded by ra10-refresh.js).
   1. AJIM checklist (free): under long evaluate / assess / justify / "to what extent" answers (9+ marks) a small
      checklist ticks Answer · Justify · It depends · Most important as the learner types their final judgement.
      "Check with AI" asks the server for a proper check (counts as one AI tools use).
   2. Fix the weak link (Premium, free tries): after an AI Examiner mark that is not full marks, a card offers to
      find the weakest sentence. The learner rewrites just that sentence; the AI says whether it is better, and the
      new sentence can be put straight back into their answer.
   Needs RA10Tools (refresh/ra10-ai-tools.js). Listens for 'ra10:ai-marked' (revision/shared/unit-ui.js). */
(function () {
  'use strict';
  if (window.RA10Coach) return;
  var $ = function (s, p) { return (p || document).querySelector(s); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function T() { return window.RA10Tools || null; }
  function signedIn() { try { return !!(window.RA10 && RA10.isLoggedIn()); } catch (e) { return false; } }
  var EVAL = /\b(evaluate|assess|to what extent|justify|discuss|recommend|how far)\b/i;

  function css() {
    if (document.getElementById('rco-css')) return;
    var st = document.createElement('style'); st.id = 'rco-css';
    st.textContent = [
      '.rco{--rc-bg:#fff;--rc-line:#e4e2ee;--rc-ink:#1f1d2b;--rc-mut:#6b6880;--rc-acc:#5b4cf5;--rc-ok:#15803d;--rc-okbg:#dcfce7;--rc-soft:#f4f3fb;font-family:"DM Sans","Plus Jakarta Sans",system-ui,sans-serif;color:var(--rc-ink)}',
      'html[data-theme="dark"] .rco,body.dark .rco,.dark .rco{--rc-bg:#1f1d2a;--rc-line:#34314a;--rc-ink:#eeedf5;--rc-mut:#a9a5bd;--rc-ok:#4ade80;--rc-okbg:rgba(34,197,94,.14);--rc-soft:#26233a}',
      '.rco *{box-sizing:border-box}',
      '.rco-ajim{margin:8px 0 4px;display:flex;flex-wrap:wrap;align-items:center;gap:6px}',
      '.rco-tog{display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:5px 12px;border-radius:999px;border:1px solid var(--rc-line);background:var(--rc-bg);color:var(--rc-ink);font:700 .78rem/1 inherit;cursor:pointer}',
      '.rco-tog[aria-pressed="true"]{border-color:var(--rc-acc);color:var(--rc-acc)}',
      '.rco-chk{display:inline-flex;align-items:center;gap:5px;min-height:32px;padding:5px 10px;border-radius:999px;background:var(--rc-soft);color:var(--rc-mut);font:600 .78rem/1.1 inherit;cursor:help}',
      '.rco-chk b{display:inline-grid;place-items:center;width:18px;height:18px;border-radius:50%;border:1.5px solid currentColor;font-size:.7rem}',
      '.rco-chk.ok{background:var(--rc-okbg);color:var(--rc-ok)}',
      '.rco-chk.ok b{background:#16a34a!important;border-color:#16a34a!important;color:#fff!important}',
      '.rco-tip{flex-basis:100%;font-size:.8rem;color:var(--rc-mut);margin:2px 2px 0}',
      '.rco-ai{min-height:32px;padding:5px 12px;border-radius:999px;border:0;background:var(--rc-acc);color:#fff;font:700 .78rem/1 inherit;cursor:pointer}',
      '.rco-ai[disabled]{opacity:.6}',
      '.rco-nudge{position:fixed!important;right:16px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:2147483000;display:flex;align-items:center;gap:12px;max-width:min(380px,calc(100vw - 32px));padding:12px 12px 12px 10px;border-radius:20px;background:var(--rc-bg);border:1px solid var(--rc-line);box-shadow:0 18px 40px -18px rgba(20,16,60,.45);animation:rcoIn .3s ease both}',
      '@keyframes rcoIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}',
      '.rco-nudge b{display:block;font-size:.95rem}',
      '.rco-nudge small{display:block;color:var(--rc-mut);font-size:.8rem;margin-top:2px}',
      '.rco-nudge .go{flex:none;min-height:40px;padding:8px 14px;border-radius:999px;border:0;background:var(--rc-acc);color:#fff;font:700 .85rem inherit;cursor:pointer}',
      '.rco-nudge .x{flex:none;width:28px;height:28px;border-radius:50%;border:0;background:transparent;color:var(--rc-mut);cursor:pointer;font-size:16px}',
      '.rco-ov{position:fixed!important;inset:0;z-index:2147483100;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(18,16,30,.5);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}',
      '.rco-card{width:min(680px,100%);max-height:calc(100dvh - 32px);overflow:auto;border-radius:24px;background:var(--rc-bg);padding:20px;box-shadow:0 30px 80px -20px rgba(0,0,0,.5)}',
      '.rco-head{display:flex;align-items:center;gap:12px;margin-bottom:12px}',
      '.rco-head h3{margin:0;font-size:1.15rem;flex:1}',
      '.rco-head small{display:block;color:var(--rc-mut);font-weight:500;font-size:.82rem}',
      '.rco-x{width:36px;height:36px;border-radius:50%;border:0;background:transparent;color:var(--rc-mut);font-size:18px;cursor:pointer}',
      '.rco-ans{padding:14px;border-radius:16px;background:var(--rc-soft);font-size:.95rem;line-height:1.65}',
      '.rco-ans .s.dim{opacity:.55}',
      '.rco-ans .s.weak{background:#fde68a;color:#422006;border-radius:6px;padding:1px 3px;box-shadow:0 0 0 2px #f59e0b}',
      '.rco-box{margin-top:14px;padding:14px;border-radius:16px;border:1px solid var(--rc-line)}',
      '.rco-kind{display:inline-block;padding:3px 9px;border-radius:999px;background:#fef3c7;color:#92400e;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em}',
      '.rco-box p{margin:8px 0 0;line-height:1.5}',
      '.rco-q{display:flex;gap:8px;align-items:flex-start;margin-top:10px;padding:10px 12px;border-radius:12px;background:var(--rc-soft);font-weight:600}',
      '.rco-card textarea{width:100%;margin-top:12px;min-height:96px;padding:12px;border-radius:14px;border:1.5px solid var(--rc-line);background:var(--rc-bg);color:var(--rc-ink);font:500 .95rem/1.5 inherit;resize:vertical}',
      '.rco-card textarea:focus{outline:none;border-color:var(--rc-acc)}',
      '.rco-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;align-items:center}',
      '.rco-btn{min-height:42px;padding:9px 16px;border-radius:999px;border:1px solid var(--rc-line);background:transparent;color:var(--rc-ink);font:700 .9rem inherit;cursor:pointer}',
      '.rco-btn.pri{background:var(--rc-acc);border-color:var(--rc-acc);color:#fff}',
      '.rco-btn[disabled]{opacity:.55;cursor:default}',
      '.rco-res{margin-top:12px;padding:12px 14px;border-radius:14px;line-height:1.5}',
      '.rco-res.good{background:var(--rc-okbg);color:var(--rc-ok)}',
      '.rco-res.meh{background:#fef3c7;color:#92400e}',
      'html[data-theme="dark"] .rco-res.meh{background:rgba(245,158,11,.16);color:#fcd34d}',
      '.rco-stars{letter-spacing:2px;font-size:1.1rem}',
      '.rco-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;font-size:.84rem;color:var(--rc-mut)}',
      '.rco-load{display:flex;align-items:center;gap:12px;padding:20px 4px}',
      '.rco-spin{width:26px;height:26px;border-radius:50%;border:3px solid var(--rc-line);border-top-color:var(--rc-acc);animation:rcoSpin .9s linear infinite}',
      '@keyframes rcoSpin{to{transform:rotate(360deg)}}',
      '@media (max-width:560px){.rco-ov{padding:0;align-items:flex-end}.rco-card{border-radius:22px 22px 0 0;max-height:92dvh}.rco-nudge{left:12px;right:12px;top:calc(12px + env(safe-area-inset-top,0px));bottom:auto;max-width:none;z-index:2147483300}.rco-nudge .tenn{width:36px;height:36px}}',
      '@media (prefers-reduced-motion:reduce){.rco-nudge{animation:none}.rco-spin{animation-duration:3s}}',
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
  }

  /* ── what question is this textarea answering? ──────────────────── */
  function contextFor(ta) {
    var box = ta.closest('.pp-page, .pp-q, .practice-card, .q-card, .question-card, .card, article, section') || ta.parentElement;
    var text = '';
    // the question normally sits just before the answer box
    for (var el = ta, hops = 0; el && hops < 6 && text.length < 1200; hops++) {
      var prev = el.previousElementSibling;
      while (prev && text.length < 1200) { if (!prev.matches('textarea, .rco, .pp-wc')) text = (prev.textContent || '') + '\n' + text; prev = prev.previousElementSibling; }
      el = el.parentElement;
      if (el === box) break;
    }
    if (text.trim().length < 20 && box) text = (box.textContent || '').slice(0, 1500);
    text = text.replace(/\s+/g, ' ').trim();
    var mm = text.match(/\((\d{1,2})\s*(?:marks?)?\)(?!.*\(\d{1,2}\s*(?:marks?)?\))/i) || text.match(/\[(\d{1,2})\]/) || text.match(/(\d{1,2})\s*marks?/i);
    var marks = mm ? Number(mm[1]) : 0;
    var vm = text.match(EVAL);
    return { text: text.slice(-900), marks: marks, verb: vm ? vm[1] : '' };
  }

  /* ── 1. AJIM ────────────────────────────────────────────────────── */
  var CHECKS = [
    ['A', 'Answer', 'Give a direct answer to the question in your judgement.', /\b(should(?: not)?|would (?:be|recommend)|i (?:would )?recommend|on balance|overall|to (?:a|some) (?:large|great|limited|certain) extent|is (?:the )?(?:better|best|most|more)|yes\b|no\b)/i],
    ['J', 'Justify', 'Back your judgement with the strongest reason, linked to the case.', /\b(because|as a result|this is because|due to|since|given that|which means|so that)\b/i],
    ['I', 'It depends', 'Say what your answer depends on — a condition that would change it.', /\b(it depends|depends on|depend on|unless|provided (?:that)?|as long as|however,? if|if .{3,60}(?:then|would|could)|in the (?:short|long) term)\b/i],
    ['M', 'Most important', 'Name the most important factor and say why it matters most.', /\b(most important|most significant|key factor|main (?:reason|factor)|biggest|crucial|above all|the most)\b/i],
  ];
  function conclusionOf(v) {
    var s = String(v || '');
    var m = s.search(/\b(in conclusion|to conclude|overall|on balance|to summarise|in summary|ultimately)\b/i);
    if (m >= 0) return s.slice(m);
    var paras = s.split(/\n\s*\n/).filter(function (p) { return p.trim(); });
    return paras.length ? paras[paras.length - 1] : s;
  }
  function attachAjim(ta) {
    if (ta.dataset.rcoAjim) return;
    var ctx = contextFor(ta);
    if (!(ctx.marks >= 9 && ctx.verb)) { ta.dataset.rcoAjim = 'no'; return; }
    ta.dataset.rcoAjim = '1';
    css();
    var bar = document.createElement('div');
    bar.className = 'rco rco-ajim';
    bar.innerHTML = '<button type="button" class="rco-tog" aria-pressed="false" title="Check your final judgement: Answer, Justify, It depends, Most important">✓ AJIM check</button>';
    ta.insertAdjacentElement('afterend', bar);
    var on = false, aiTips = null, t = null;
    function paint() {
      if (!on) { bar.innerHTML = '<button type="button" class="rco-tog" aria-pressed="false" title="Check your final judgement: Answer, Justify, It depends, Most important">✓ AJIM check</button>'; return; }
      var c = conclusionOf(ta.value);
      var words = c.split(/\s+/).filter(Boolean).length;
      var html = '<button type="button" class="rco-tog" aria-pressed="true">AJIM</button>';
      var missing = null;
      CHECKS.forEach(function (k) {
        var ok = aiTips ? aiTips[k[0]].ok : (words >= 6 && k[3].test(c));
        if (!ok && !missing) missing = aiTips ? (aiTips[k[0]].tip || k[2]) : k[2];
        html += '<span class="rco-chk' + (ok ? ' ok' : '') + '" title="' + esc(k[2]) + '"><b>' + (ok ? '✓' : k[0]) + '</b>' + k[1] + '</span>';
      });
      html += '<button type="button" class="rco-ai" data-ai' + (words < 12 ? ' disabled' : '') + '>Check with AI</button>';
      html += '<div class="rco-tip" aria-live="polite">' + (words < 6 ? 'Write your final judgement — start it with “Overall” or “On balance”.' : missing ? 'Next: ' + esc(missing) : 'All four parts are there — nice judgement.') + '</div>';
      bar.innerHTML = html;
    }
    bar.addEventListener('click', function (e) {
      if (e.target.closest('.rco-tog')) { on = !on; aiTips = null; paint(); return; }
      var ai = e.target.closest('[data-ai]');
      if (ai && T()) {
        ai.disabled = true; ai.textContent = 'Checking…';
        T().api('ajim', { question: ctx.text, marks: ctx.marks, conclusion: conclusionOf(ta.value) }).then(function (r) { aiTips = r; paint(); }, function (err) { if (!err.handled) alertTip(bar, err.message); paint(); });
      }
    });
    ta.addEventListener('input', function () { if (!on) return; aiTips = null; clearTimeout(t); t = setTimeout(paint, 250); });
  }
  function alertTip(bar, msg) { var tip = $('.rco-tip', bar); if (tip) tip.textContent = msg; }
  document.addEventListener('focusin', function (e) {
    var ta = e.target;
    if (!ta || ta.tagName !== 'TEXTAREA' || ta.closest('.rco, [data-no-track], .ux-menu')) return;
    lastTa = ta;
    try { attachAjim(ta); } catch (err) {}
  }, true);

  /* ── 2. Fix the weak link ──────────────────────────────────────── */
  var lastTa = null, nudgeEl = null;
  function schemePoints(ms) {
    if (!ms || typeof ms !== 'object') return [];
    var toStr = function (x) { return typeof x === 'string' ? x : x && typeof x === 'object' ? String(x.text || x.point || x.description || x.descriptor || '') : ''; };
    var keys = ['points', 'indicative_content', 'marking_points', 'answers', 'credit'];
    for (var i = 0; i < keys.length; i++) if (Array.isArray(ms[keys[i]]) && ms[keys[i]].length) return ms[keys[i]].map(toStr).filter(Boolean).slice(0, 14);
    if (Array.isArray(ms.levels)) return ms.levels.map(toStr).filter(Boolean).slice(0, 6);
    return [];
  }
  function findTextarea(answer) {
    var a = String(answer || '').trim().slice(0, 60);
    if (lastTa && document.contains(lastTa) && lastTa.value.indexOf(a) >= 0) return lastTa;
    var all = document.querySelectorAll('textarea');
    for (var i = 0; i < all.length; i++) if (a && all[i].value.indexOf(a) >= 0) return all[i];
    return null;
  }
  window.addEventListener('ra10:ai-marked', function (e) {
    var d = e.detail || {}, r = d.result || {}, q = d.question || {};
    var max = Number(r.max || r.total || q.marks || 0), earned = Number(r.earned);
    if (!signedIn() || !max || !(earned < max) || String(d.answer || '').split(/[.!?]/).filter(function (s) { return s.trim().length > 3; }).length < 2) return;
    showNudge({ question: q, result: r, answer: d.answer, max: max, earned: earned });
  });
  function showNudge(info) {
    css();
    if (nudgeEl) nudgeEl.remove();
    var n = document.createElement('div'); n.className = 'rco rco-nudge'; n.setAttribute('role', 'status');
    n.innerHTML = (T() ? T().mascot('wave', 44) : '') + '<div style="flex:1;min-width:0"><b>Upgrade this answer</b><small>' + info.earned + '/' + info.max + ' — find the one sentence to fix first. <span data-badge></span></small></div><button type="button" class="go">Fix the weak link</button><button type="button" class="x" aria-label="Dismiss">✕</button>';
    document.documentElement.appendChild(n); nudgeEl = n;
    if (T()) T().status().then(function (st) { var b = $('[data-badge]', n); if (b) b.innerHTML = T().badge('coach', st); });
    $('.x', n).onclick = function () { n.remove(); };
    $('.go', n).onclick = function () { n.remove(); openCoach(info); };
    setTimeout(function () { if (nudgeEl === n) n.remove(); }, 30000);
  }
  function openCoach(info) {
    if (!T()) return;
    css();
    var q = info.question || {};
    var body = { question: q.question || q.text || '', marks: info.max, verb: q.command_verb || '', context: q.scenario || q.context || q.case_study || '', points: schemePoints(q.mark_scheme), answer: info.answer, qual: (window.RA10Units && RA10Units.fromLocation(location.pathname) || {}).qual || '' };
    var ov = document.createElement('div'); ov.className = 'rco rco-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Fix the weak link');
    ov.innerHTML = '<div class="rco-card"><div class="rco-head">' + T().mascot('think', 52) + '<h3>Fix the weak link<small>One sentence. Biggest jump in marks.</small></h3><button type="button" class="rco-x" aria-label="Close">✕</button></div><div data-body><div class="rco-load"><span class="rco-spin"></span>Reading your answer like an examiner…</div></div></div>';
    document.documentElement.appendChild(ov);
    var close = function () { ov.remove(); document.removeEventListener('keydown', onKey, true); };
    var onKey = function (e) { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey, true);
    ov.addEventListener('click', function (e) { if (e.target === ov || e.target.closest('.rco-x')) close(); });
    var host = $('[data-body]', ov);
    T().api('coach', body).then(function (r) {
      var w = r.weak, ss = r.sentences;
      var KIND = { chain: 'Chain of analysis stops', application: 'Not tied to the case', judgement: 'Judgement not justified', knowledge: 'Key term unclear' };
      host.innerHTML = '<div class="rco-ans">' + ss.map(function (s, i) { return '<span class="s' + (i === w.i ? ' weak' : Math.abs(i - w.i) > 1 ? ' dim' : '') + '">' + esc(s) + '</span>'; }).join(' ') + '</div>' +
        '<div class="rco-box"><span class="rco-kind">' + esc(KIND[w.kind] || 'Weak link') + '</span><p>' + esc(w.problem) + '</p>' + (w.nudge ? '<div class="rco-q">💭 <span>' + esc(w.nudge) + '</span></div>' : '') +
        '<div class="rco-meta">' + (r.level_now ? '<span>Now: <b>' + esc(r.level_now) + '</b></span>' : '') + (r.to_reach ? '<span>Next level: ' + esc(r.to_reach) + '</span>' : '') + '</div></div>' +
        '<label style="display:block;margin-top:14px;font-weight:700;font-size:.9rem">Rewrite just this sentence</label><textarea data-re>' + esc(ss[w.i]) + '</textarea>' +
        '<div class="rco-row"><button type="button" class="rco-btn pri" data-check>Check my rewrite</button><span style="color:var(--rc-mut);font-size:.85rem">Tip: add “This means that… which leads to…”</span></div><div data-res></div>';
      var re = $('[data-re]', host);
      re.focus(); re.setSelectionRange(re.value.length, re.value.length);
      $('[data-check]', host).onclick = function () {
        var b = this; b.disabled = true; b.textContent = 'Checking…';
        T().api('coach-check', Object.assign({}, body, { original: ss[w.i], rewrite: re.value, before: ss[w.i - 1] || '', kind: w.kind, problem: w.problem })).then(function (c) {
          b.disabled = false; b.textContent = 'Check again';
          var good = c.rating >= 2;
          $('[data-res]', host).innerHTML = '<div class="rco-res ' + (good ? 'good' : 'meh') + '"><span class="rco-stars" aria-label="' + c.rating + ' of 3">' + '★★★'.slice(0, c.rating) + '☆☆☆'.slice(0, 3 - c.rating) + '</span> ' + esc(c.feedback) + (c.still_missing ? '<br><small>Still missing: ' + esc(c.still_missing) + '</small>' : '') + '</div>' +
            (good ? '<div class="rco-row"><button type="button" class="rco-btn pri" data-use>Put it in my answer</button><button type="button" class="rco-btn" data-done>Done</button></div>' : '');
          var use = $('[data-use]', host);
          if (use) use.onclick = function () {
            var ta = findTextarea(info.answer);
            if (ta && ta.value.indexOf(ss[w.i]) >= 0) {
              ta.value = ta.value.replace(ss[w.i], re.value.trim());
              ta.dispatchEvent(new Event('input', { bubbles: true })); ta.dispatchEvent(new Event('change', { bubbles: true }));
              use.textContent = 'Added ✓'; use.disabled = true;
            } else { try { navigator.clipboard.writeText(re.value.trim()); } catch (x) {} use.textContent = 'Copied — paste it in'; use.disabled = true; }
          };
          var dn = $('[data-done]', host); if (dn) dn.onclick = close;
        }, function (err) { b.disabled = false; b.textContent = 'Check my rewrite'; if (!err.handled) $('[data-res]', host).innerHTML = '<div class="rco-res meh">' + esc(err.message) + '</div>'; });
      };
    }, function (err) { if (err.handled) close(); else host.innerHTML = '<div class="rco-res meh">' + esc(err.message) + '</div>'; });
  }

  window.RA10Coach = { openCoach: openCoach, attachAjim: attachAjim, conclusionOf: conclusionOf };
})();
