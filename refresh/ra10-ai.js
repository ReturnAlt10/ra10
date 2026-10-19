/* RA10 AI — shared core for AI Helper, AI Assigner and AI Examiner.

   window.RA10AI
     mountChat(host, opts)        → chat controller (inline or panel)
     openPanel(opts)              → floating AI panel (used by AI Helper + "Discuss")
     installHelper()              → floating button, "Ask AI" selection pop-up, tip
     renderExamResult(opts)       → modern AI Examiner result card (returns Element)
     confirmCredits(cost, label)  → Promise<boolean> glass confirm dialog
     examinerCost() / hintCost() / markCost()
     store                        → saved-chat storage (Supabase, local fallback)

   Chats are TEXT ONLY. Unsaved chats are deleted 30 days after their last
   message (supabase/sql/ai-chat-history.sql). Saved chats are kept.
   Chats can be put in groups; chats in the same group share a short digest
   of each other as context, so the AI remembers earlier work. */
(function () {
  'use strict';
  if (window.RA10AI) return;

  var BASE = (function () {
    var src = '';
    try { src = (document.currentScript && document.currentScript.src) || ''; } catch (e) {}
    return src ? src.replace(/ra10-ai\.js(\?.*)?$/, '') : '/refresh/';
  })();
  var VERSION = '20261021';
  var RETENTION_DAYS = 30;
  var MAX_MSG = 8000;
  var CONTEXT_BUDGET = 3900; // the ai-assign function keeps the first 4000 chars

  /* ── Assets ─────────────────────────────────────────────────────────── */
  (function injectAssets() {
    if (!document.getElementById('ra10-ai-css')) {
      var link = document.createElement('link');
      link.id = 'ra10-ai-css';
      link.rel = 'stylesheet';
      link.href = BASE + 'ra10-ai.css?v=' + VERSION;
      (document.head || document.documentElement).appendChild(link);
    }
    if (!window.RA10Liquid && !document.getElementById('ra10-liquid-js')) {
      var s = document.createElement('script');
      s.id = 'ra10-liquid-js';
      s.src = BASE + 'ra10-liquid.js?v=' + VERSION;
      (document.head || document.documentElement).appendChild(s);
    }
    // Maths keyboard, calculator and photo-of-working tools.
    if (!window.RA10Math && !document.getElementById('ra10-math-js')) {
      var m = document.createElement('script');
      m.id = 'ra10-math-js';
      m.src = BASE + 'ra10-math.js?v=' + VERSION;
      (document.head || document.documentElement).appendChild(m);
    }
  })();

  /* ── LaTeX: pull maths out before markdown, render with KaTeX after ─── */
  var KATEX = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/';
  var katexPromise = null;
  function loadKatex() {
    if (window.katex) return Promise.resolve(window.katex);
    if (!katexPromise) {
      katexPromise = new Promise(function (resolve, reject) {
        if (!document.getElementById('rai-katex-css')) {
          var l = document.createElement('link');
          l.id = 'rai-katex-css'; l.rel = 'stylesheet'; l.href = KATEX + 'katex.min.css'; l.crossOrigin = 'anonymous';
          document.head.appendChild(l);
        }
        var sc = document.createElement('script');
        sc.src = KATEX + 'katex.min.js'; sc.crossOrigin = 'anonymous';
        sc.onload = function () { resolve(window.katex); };
        sc.onerror = function () { katexPromise = null; reject(new Error('KaTeX failed to load')); };
        document.head.appendChild(sc);
      });
    }
    return katexPromise;
  }
  // Replaces maths with \u0000M<n>\u0000 placeholders; returns { text, maths }.
  function mathProtect(raw) {
    var maths = [];
    function keep(tex, display) { maths.push({ tex: tex.trim(), display: display }); return '\u0000M' + (maths.length - 1) + '\u0000'; }
    raw = raw.replace(/\$\$([\s\S]+?)\$\$/g, function (_, t) { return keep(t, true); });
    raw = raw.replace(/\\\[([\s\S]+?)\\\]/g, function (_, t) { return keep(t, true); });
    raw = raw.replace(/\\\(([\s\S]+?)\\\)/g, function (_, t) { return keep(t, false); });
    // Inline $...$ - not money: no space just inside the dollars, no digit straight after.
    raw = raw.replace(/\$([^\s$](?:[^$\n]*[^\s$\\])?)\$(?!\d)/g, function (_, t) { return keep(t, false); });
    return { text: raw, maths: maths };
  }
  function mathRestore(html, maths) {
    return html.replace(/\u0000M(\d+)\u0000/g, function (_, n) {
      var m = maths[+n];
      if (!m) return '';
      return '<span class="rai-math' + (m.display ? ' rai-math-block' : '') + '" data-display="' + (m.display ? 1 : 0) + '" data-tex="' + esc(m.tex) + '">' + esc(m.tex) + '</span>';
    });
  }
  // Plain text (e.g. what a student typed) -> safe HTML with maths spans and line breaks.
  function mathText(text) {
    var p = mathProtect(String(text == null ? '' : text));
    return mathRestore(esc(p.text).replace(/\n/g, '<br>'), p.maths);
  }
  function renderMath(root) {
    if (!root || !root.querySelectorAll) return;
    var nodes = root.querySelectorAll('.rai-math:not([data-done])');
    if (!nodes.length) return;
    loadKatex().then(function (k) {
      nodes.forEach(function (n) {
        try { k.render(n.getAttribute('data-tex'), n, { displayMode: n.getAttribute('data-display') === '1', throwOnError: false, strict: 'ignore', output: 'htmlAndMathml' }); } catch (e) {}
        n.setAttribute('data-done', '1');
      });
    }, function () {});
  }
  var MATH_HINT = 'Write any maths, formulas or calculations in LaTeX: inline as $...$ and each line of working as $$...$$ (use \\times, \\frac{a}{b}, \\%).';

  /* ── Utils ──────────────────────────────────────────────────────────── */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function h(tag, attrs, html) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] == null || attrs[k] === false) return;
      if (k === 'class') el.className = attrs[k];
      else if (k === 'text') el.textContent = attrs[k];
      else el.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    });
    if (html != null) el.innerHTML = html;
    return el;
  }
  function clip(s, n) { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; }
  function cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  function uid() { return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'l-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10); }
  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {}
    return null;
  }
  function daysLeft(expiresAt) {
    if (!expiresAt) return null;
    return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000));
  }
  function stripText(s) {
    // Text only: drop any data URIs / long base64 runs before storage.
    return String(s || '')
      .replace(/data:[a-z]+\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+/gi, '[image removed]')
      .replace(/[A-Za-z0-9+/]{2000,}={0,2}/g, '[data removed]')
      .slice(0, MAX_MSG);
  }

  var ICON = {
    logo: '<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/><path d="M18.5 15.5l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z"/></svg>',
    send: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    side: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/></svg>',
    plus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    star: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>',
    starOn: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>',
    more: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>',
    close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    expand: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
    copy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    chat: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-8 8H4l1.6-3.2A8 8 0 1 1 21 12z"/></svg>',
    bulb: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.5 1 2.5h6c0-1 .4-1.9 1-2.5A6 6 0 0 0 12 3z"/></svg>',
    exam: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/><path d="M9 13l2 2 4-4"/></svg>',
    upload: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4M8 8l4-4 4 4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
    folder: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    tag: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.3"/></svg>',
    trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    edit: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    sparkle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12a4 4 0 0 1 4-4"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    flag: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>'
  };
  function icon(name, size) { return ICON[name].replace(/\{s\}/g, String(size || 18)); }
  function orb(cls, size) { return '<span class="rai-orb' + (cls ? ' ' + cls : '') + '">' + icon('logo', size || 16) + '</span>'; }

  /* ── Markdown (safe subset: headings, lists, task lists, tables, code) ─ */
  function md(src) {
    var raw = String(src == null ? '' : src).replace(/\r\n/g, '\n');
    var blocks = [];
    raw = raw.replace(/```([a-zA-Z0-9+#-]*)[ \t]*\n?([\s\S]*?)```/g, function (_, lang, code) {
      blocks.push({ lang: lang || '', code: code.replace(/\n+$/, '') });
      return '\u0000B' + (blocks.length - 1) + '\u0000';
    });
    var mp = mathProtect(raw);
    raw = mp.text;
    function inline(t) {
      t = esc(t);
      t = t.replace(/`([^`\n]+)`/g, '<code>$1</code>');
      t = t.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
      t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      t = t.replace(/__([^_]+)__/g, '<strong>$1</strong>');
      t = t.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,!?:;]|$)/g, '$1<em>$2</em>');
      t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
      return t;
    }
    function cells(r) { return r.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(function (c) { return c.trim(); }); }
    function isSep(r) { var c = cells(r); return c.length > 0 && c.every(function (x) { return /^:?-{2,}:?$/.test(x); }); }
    var lines = raw.split('\n');
    function tableAt(i) { return !!(lines[i] && /\|/.test(lines[i]) && i + 1 < lines.length && /\|/.test(lines[i + 1]) && isSep(lines[i + 1])); }
    var out = [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (!line.trim()) continue;
      if (/^\u0000B\d+\u0000$/.test(line.trim())) { out.push(line.trim()); continue; }
      if (tableAt(i)) {
        var rows = [line]; i += 2;
        while (i < lines.length && /\|/.test(lines[i]) && lines[i].trim()) { rows.push(lines[i]); i++; }
        i--;
        out.push('<div class="rai-table"><table>' + rows.map(function (r, ri) {
          var tag = ri === 0 ? 'th' : 'td';
          return '<tr>' + cells(r).map(function (c) { return '<' + tag + '>' + inline(c) + '</' + tag + '>'; }).join('') + '</tr>';
        }).join('') + '</table></div>');
        continue;
      }
      if (/^\s*[-*+]\s+\[[ xX]\]\s/.test(line)) {
        var tasks = [];
        while (i < lines.length && /^\s*[-*+]\s+\[[ xX]\]\s/.test(lines[i])) { tasks.push(lines[i]); i++; }
        i--;
        out.push('<ul class="rai-tasks">' + tasks.map(function (t) {
          var m = /^\s*[-*+]\s+\[([ xX])\]\s+([\s\S]*)$/.exec(t);
          return '<li class="rai-task"><span class="rai-check' + (m[1].toLowerCase() === 'x' ? ' on' : '') + '"></span><span>' + inline(m[2]) + '</span></li>';
        }).join('') + '</ul>');
        continue;
      }
      if (/^\s*[-*+]\s+/.test(line)) {
        var items = [];
        while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*+]\s+/, '')); i++; }
        i--;
        out.push('<ul>' + items.map(function (t) { return '<li>' + inline(t) + '</li>'; }).join('') + '</ul>');
        continue;
      }
      if (/^\s*\d+[.)]\s+/.test(line)) {
        var oitems = [];
        while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) { oitems.push(lines[i].replace(/^\s*\d+[.)]\s+/, '')); i++; }
        i--;
        out.push('<ol>' + oitems.map(function (t) { return '<li>' + inline(t) + '</li>'; }).join('') + '</ol>');
        continue;
      }
      var hm = /^(#{1,4})\s+(.*)$/.exec(line);
      if (hm) { var lvl = Math.min(4, hm[1].length + 1); out.push('<h' + lvl + '>' + inline(hm[2]) + '</h' + lvl + '>'); continue; }
      if (/^\s*>/.test(line)) {
        var q = [];
        while (i < lines.length && /^\s*>/.test(lines[i])) { q.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
        i--;
        out.push('<blockquote>' + q.map(inline).join('<br>') + '</blockquote>');
        continue;
      }
      var para = [line];
      while (i + 1 < lines.length && lines[i + 1].trim() && !/^\s*([-*+]|\d+[.)])\s+/.test(lines[i + 1]) && !/^#{1,4}\s+/.test(lines[i + 1]) && !/^\s*>/.test(lines[i + 1]) && !/^\u0000B/.test(lines[i + 1].trim()) && !tableAt(i + 1)) {
        i++; para.push(lines[i]);
      }
      out.push('<p>' + para.map(inline).join('<br>') + '</p>');
    }
    return mathRestore(out.join('\n').replace(/\u0000B(\d+)\u0000/g, function (_, n) {
      var b = blocks[+n] || { lang: '', code: '' };
      return '<pre>' + (b.lang ? '<span class="rai-code-lang">' + esc(b.lang) + '</span>' : '') + '<code>' + esc(b.code) + '</code></pre>';
    }), mp.maths);
  }

  /* ── Tiny UI helpers: toast, dialogs, menus ─────────────────────────── */
  function toast(text) {
    var old = document.querySelector('.rai-toast');
    if (old) old.remove();
    var t = h('div', { class: 'rai-toast rai-layer', role: 'status', text: text });
    document.body.appendChild(t);
    setTimeout(function () { t.style.transition = 'opacity .3s'; t.style.opacity = '0'; }, 2200);
    setTimeout(function () { t.remove(); }, 2600);
  }

  function dialog(build) {
    return new Promise(function (resolve) {
      var prevFocus = document.activeElement;
      var wrap = h('div', { class: 'rai-dialog rai-layer' });
      var card = h('div', { class: 'rai-dialog-card', role: 'dialog', 'aria-modal': 'true' });
      wrap.appendChild(card);
      function done(v) {
        document.removeEventListener('keydown', onKey, true);
        wrap.remove();
        try { if (prevFocus && prevFocus.focus) prevFocus.focus(); } catch (e) {}
        resolve(v);
      }
      function onKey(e) { if (e.key === 'Escape') { e.stopPropagation(); done(null); } }
      document.addEventListener('keydown', onKey, true);
      wrap.addEventListener('mousedown', function (e) { if (e.target === wrap) done(null); });
      build(card, done);
      document.body.appendChild(wrap);
      var f = card.querySelector('[autofocus], input, button.primary, button');
      if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 30);
    });
  }

  function confirmCredits(cost, label) {
    cost = Number(cost) || 0;
    if (cost <= 0) return Promise.resolve(true);
    var key = 'ra10_ai_noconfirm_' + String(label || '').replace(/\W+/g, '_').toLowerCase();
    try { if (sessionStorage.getItem(key) === '1') return Promise.resolve(true); } catch (e) {}
    var plural = cost === 1 ? '' : 's';
    return dialog(function (card, done) {
      card.setAttribute('aria-label', 'Confirm credit use');
      card.innerHTML = orb('lg', 28) +
        '<h3>Use ' + cost + ' credit' + plural + '?</h3>' +
        '<p>' + esc(label || 'This AI action') + ' uses <b>' + cost + ' credit' + plural + '</b> from your balance. Credits are only taken if it works.</p>' +
        '<label style="display:flex;align-items:center;gap:8px;font-weight:500;margin:0"><input type="checkbox" class="rai-skip"> Don’t ask again this session</label>' +
        '<div class="rai-dialog-actions"><button type="button" class="rai-btn ghost" data-v="0">Cancel</button><button type="button" class="rai-btn primary" data-v="1">Continue</button></div>';
      card.querySelector('[data-v="0"]').onclick = function () { done(false); };
      card.querySelector('[data-v="1"]').onclick = function () {
        if (card.querySelector('.rai-skip').checked) { try { sessionStorage.setItem(key, '1'); } catch (e) {} }
        done(true);
      };
    }).then(function (v) { return !!v; });
  }

  function promptText(opts) {
    return dialog(function (card, done) {
      card.innerHTML = '<h3>' + esc(opts.title) + '</h3>' + (opts.body ? '<p>' + esc(opts.body) + '</p>' : '') +
        '<input class="rai-field" maxlength="' + (opts.max || 120) + '" placeholder="' + esc(opts.placeholder || '') + '">' +
        '<div class="rai-dialog-actions"><button type="button" class="rai-btn ghost">Cancel</button><button type="button" class="rai-btn primary">' + esc(opts.ok || 'Save') + '</button></div>';
      var input = card.querySelector('input');
      input.value = opts.value || '';
      input.setAttribute('autofocus', '');
      function ok() { var v = input.value.trim(); if (v || opts.allowEmpty) done(v); }
      card.querySelector('.ghost').onclick = function () { done(null); };
      card.querySelector('.primary').onclick = ok;
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); ok(); } });
    });
  }

  var GROUP_COLORS = ['#7c3aed', '#1f6feb', '#0ea5a4', '#16a34a', '#e0a100', '#ea580c', '#e11d48', '#64748b'];
  function groupDialog(group) {
    return dialog(function (card, done) {
      var color = (group && group.color) || GROUP_COLORS[0];
      card.innerHTML = '<h3>' + (group ? 'Edit group' : 'New group') + '</h3>' +
        '<p>Chats in the same group share context, so the AI remembers what you covered before.</p>' +
        '<label>Name</label><input class="rai-field" maxlength="60" placeholder="e.g. Unit 3 coursework">' +
        '<label>Colour</label><div class="rai-swatches">' + GROUP_COLORS.map(function (c) {
          return '<button type="button" class="rai-swatch" style="background:' + c + ';color:' + c + '" data-c="' + c + '" aria-label="Colour ' + c + '" aria-pressed="' + (c === color) + '"></button>';
        }).join('') + '</div>' +
        '<div class="rai-dialog-actions"><button type="button" class="rai-btn ghost">Cancel</button><button type="button" class="rai-btn primary">' + (group ? 'Save' : 'Create group') + '</button></div>';
      var input = card.querySelector('input');
      input.value = group ? group.name : '';
      input.setAttribute('autofocus', '');
      card.querySelectorAll('.rai-swatch').forEach(function (b) {
        b.onclick = function () {
          color = b.dataset.c;
          card.querySelectorAll('.rai-swatch').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        };
      });
      function ok() { var v = input.value.trim(); if (v) done({ name: v, color: color }); }
      card.querySelector('.ghost').onclick = function () { done(null); };
      card.querySelector('.primary').onclick = ok;
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); ok(); } });
    });
  }

  var openMenuEl = null;
  function closeMenu() { if (openMenuEl) { openMenuEl.remove(); openMenuEl = null; } }
  // items: [{label, icon, onClick, danger}] | 'hr' | {heading}
  function menu(anchor, container, items) {
    closeMenu();
    var m = h('div', { class: 'rai-menu', role: 'menu' });
    items.forEach(function (it) {
      if (!it) return;
      if (it === 'hr') { m.appendChild(h('hr')); return; }
      if (it.heading) { m.appendChild(h('div', { class: 'rai-menu-label', text: it.heading })); return; }
      var b = h('button', { type: 'button', role: 'menuitem', class: it.danger ? 'danger' : '' }, (it.icon ? icon(it.icon, 16) : '') + '<span>' + esc(it.label) + '</span>');
      b.onclick = function (e) { e.stopPropagation(); closeMenu(); it.onClick(); };
      m.appendChild(b);
    });
    container.appendChild(m);
    var cr = container.getBoundingClientRect();
    var ar = anchor.getBoundingClientRect();
    var mw = m.offsetWidth, mh = m.offsetHeight;
    var left = Math.min(Math.max(8, ar.right - cr.left - mw), cr.width - mw - 8);
    var top = ar.bottom - cr.top + 6;
    if (top + mh > cr.height - 8) top = Math.max(8, ar.top - cr.top - mh - 6);
    m.style.left = left + 'px';
    m.style.top = top + 'px';
    openMenuEl = m;
    var first = m.querySelector('button');
    if (first) first.focus({ preventScroll: true });
    return m;
  }
  document.addEventListener('mousedown', function (e) { if (openMenuEl && !openMenuEl.contains(e.target)) closeMenu(); }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openMenuEl) closeMenu(); });

  /* ── Taxonomy: subject / qualification / unit / topic from the URL ─── */
  var UNITS = {
    'it-aaq-unit-1': { subject: 'IT', qualification: 'BTEC Level 3', unit: 'Unit 1' },
    'it-aaq-unit-2': { subject: 'IT', qualification: 'BTEC Level 3', unit: 'Unit 2 · Cyber Security' },
    'it-aaq-unit-3': { subject: 'IT', qualification: 'BTEC Level 3', unit: 'Unit 3 · Website Development' },
    'it-aaq-unit-4': { subject: 'IT', qualification: 'BTEC Level 3', unit: 'Unit 4 · Relational Databases' },
    'business-unit-1': { subject: 'Business', qualification: 'BTEC Level 3', unit: 'Unit 1 · Exploring Business' },
    'business-unit-2': { subject: 'Business', qualification: 'BTEC Level 3', unit: 'Unit 2 · Marketing Campaign' },
    'business-unit-3': { subject: 'Business', qualification: 'BTEC Level 3', unit: 'Unit 3 · Personal & Business Finance' },
    'business-unit-4': { subject: 'Business', qualification: 'BTEC Level 3', unit: 'Unit 4 · Managing an Event' },
    'sport-unit-1': { subject: 'Sport', qualification: 'BTEC Level 3', unit: 'Unit 1 · Anatomy & Physiology' },
    'sport-unit-2': { subject: 'Sport', qualification: 'BTEC Level 3', unit: 'Unit 2 · Fitness Training' },
    'it-l2-unit-2': { subject: 'IT', qualification: 'BTEC Level 2', unit: 'Unit 2 · Technology Systems' },
    'a-level-business': { subject: 'Business', qualification: 'A Level (AQA)', unit: 'AQA Business' }
  };
  function detectUnitKey(path) {
    var p = String(path || location.pathname || '').toLowerCase();
    var m;
    if ((m = /\/revision\/btec\/level-3\/it-aaq\/unit-(\d)/.exec(p))) return 'it-aaq-unit-' + m[1];
    if ((m = /\/revision\/btec\/level-3\/business\/unit-(\d)/.exec(p))) return 'business-unit-' + m[1];
    if ((m = /\/revision\/btec\/level-3\/sport\/unit-(\d)/.exec(p))) return 'sport-unit-' + m[1];
    if (/\/revision\/btec\/level-2\/it\/unit-2/.test(p)) return 'it-l2-unit-2';
    if (/\/revision\/a-level\/business/.test(p)) return 'a-level-business';
    return '';
  }
  function normText(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
  // Topic = the heading on screen, unless it just repeats the unit/product name.
  function detectTopic() {
    var u = UNITS[detectUnitKey()] || {};
    var unitName = normText(u.unit).replace(/^unit \d+ /, '');
    var nodes = [document.querySelector('.view.active .section-head h2'), document.querySelector('main h1'), document.querySelector('h1')];
    for (var i = 0; i < nodes.length; i++) {
      var t = nodes[i] ? clip(nodes[i].textContent, 80) : '';
      var n = normText(t);
      if (!n || /^ai (assigner|helper|examiner)$/.test(n) || /^(dashboard|home|your progress|progress)$/.test(n)) continue;
      if (unitName && n.indexOf(unitName) !== -1) continue;
      if (/^unit \d+/.test(n)) continue;   // page titles like 'Unit 4 - ...' repeat the unit chip
      return t;
    }
    return '';
  }
  function detectContext(overrides) {
    var key = detectUnitKey();
    var u = UNITS[key] || {};
    var ctx = {
      unit_key: key || null,
      subject: u.subject || null,
      qualification: u.qualification || null,
      unit: u.unit || null,
      topic: detectTopic() || null,
      page_path: location.pathname.slice(0, 200)
    };
    return Object.assign(ctx, overrides || {});
  }

  /* ── Credit costs (mirror ra10-sdk.js) ──────────────────────────────── */
  function tierInfo() {
    var R = window.RA10;
    var tier = (R && typeof R.getTier === 'function') ? String(R.getTier() || 'free') : 'free';
    var transition = !!(R && R._raw && R._raw.TRANSITION_MODE && typeof R.isLoggedIn === 'function' && R.isLoggedIn());
    return {
      tier: tier,
      transition: transition,
      ultra: /^(ultra|owner|unlimited|all_marks|unlimited_marks)$/.test(tier),
      pro: tier === 'all_subjects',
      school: /^school_(student|teacher|admin)$/.test(tier)
    };
  }
  function tiered(map) {
    var t = tierInfo();
    if (t.transition || t.ultra) return map.ultra;
    if (t.pro) return map.pro;
    if (t.school) return map.school;
    if (t.tier === 'subject') return map.subject;
    return map.free;
  }
  function hintCost() { return tiered({ free: 3, school: 1, pro: 1, ultra: 0, subject: 2 }); }
  function markCost() { return tiered({ free: 8, school: 3, pro: 2, ultra: 0, subject: 5 }); }
  function examinerCost() { return tiered({ free: 5, school: 2, pro: 1, ultra: 0, subject: 3 }); }
  function costLabel(n) { return n <= 0 ? 'Free on your plan' : n + ' credit' + (n === 1 ? '' : 's'); }

  function loggedIn() { return !!(window.RA10 && typeof RA10.isLoggedIn === 'function' && RA10.isLoggedIn()); }
  function userId() {
    try { var p = RA10.getProfile && RA10.getProfile(); if (p && p.id) return p.id; } catch (e) {}
    try { var s = RA10.getSession && RA10.getSession(); if (s && s.user && s.user.id) return s.user.id; } catch (e) {}
    return '';
  }

  /* ── Storage ────────────────────────────────────────────────────────────
     Supabase tables from supabase/sql/ai-chat-history.sql. If they aren't
     there yet (or the user is offline) we fall back to localStorage with
     the same 30-day rule, so nothing breaks before the migration runs. */
  var CHAT_COLS = 'id,title,product,subject,qualification,unit,topic,unit_key,group_id,saved,expires_at,updated_at,created_at,digest,message_count';

  var LocalBackend = {
    key: function () { return 'ra10_ai_history:' + (userId() || 'anon'); },
    read: function () {
      var d;
      try { d = JSON.parse(ls(this.key()) || 'null'); } catch (e) { d = null; }
      d = d || { chats: [], groups: [], msgs: {} };
      var now = Date.now();
      var live = d.chats.filter(function (c) { return !c.expires_at || new Date(c.expires_at).getTime() > now; });
      if (live.length !== d.chats.length) {
        var keep = {};
        live.forEach(function (c) { keep[c.id] = d.msgs[c.id] || []; });
        d.chats = live; d.msgs = keep;
        this.write(d);
      }
      return d;
    },
    write: function (d) {
      var json = JSON.stringify(d);
      // Keep local history modest: drop the oldest unsaved chats if > ~1.5 MB.
      while (json.length > 1500000 && d.chats.some(function (c) { return !c.saved; })) {
        var oldest = d.chats.filter(function (c) { return !c.saved; }).sort(function (a, b) { return a.updated_at < b.updated_at ? -1 : 1; })[0];
        d.chats = d.chats.filter(function (c) { return c !== oldest; });
        delete d.msgs[oldest.id];
        json = JSON.stringify(d);
      }
      ls(this.key(), json);
    },
    expiry: function (saved) { return saved ? null : new Date(Date.now() + RETENTION_DAYS * 86400000).toISOString(); },
    list: function () { var d = this.read(); return Promise.resolve({ chats: d.chats.slice().sort(function (a, b) { return a.updated_at < b.updated_at ? 1 : -1; }), groups: d.groups }); },
    createChat: function (meta) {
      var d = this.read(), now = new Date().toISOString();
      var c = Object.assign({ id: uid(), title: 'New chat', product: 'helper', saved: false, message_count: 0, digest: null, group_id: null }, meta, { created_at: now, updated_at: now });
      c.expires_at = this.expiry(c.saved);
      d.chats.push(c); d.msgs[c.id] = [];
      this.write(d);
      return Promise.resolve(c);
    },
    updateChat: function (id, patch) {
      var d = this.read();
      var c = d.chats.find(function (x) { return x.id === id; });
      if (!c) return Promise.reject(new Error('Chat not found'));
      var wasSaved = c.saved;
      Object.assign(c, patch, { updated_at: new Date().toISOString() });
      if (c.saved) c.expires_at = null;
      else if (wasSaved || !c.expires_at) c.expires_at = this.expiry(false);
      this.write(d);
      return Promise.resolve(c);
    },
    deleteChat: function (id) { var d = this.read(); d.chats = d.chats.filter(function (c) { return c.id !== id; }); delete d.msgs[id]; this.write(d); return Promise.resolve(); },
    messages: function (id) { return Promise.resolve((this.read().msgs[id] || []).slice()); },
    addMessages: function (id, rows) {
      var d = this.read();
      var c = d.chats.find(function (x) { return x.id === id; });
      if (!c) return Promise.reject(new Error('Chat not found'));
      d.msgs[id] = (d.msgs[id] || []).concat(rows.map(function (r) { return { role: r.role, content: r.content, created_at: new Date().toISOString() }; })).slice(-300);
      c.message_count = d.msgs[id].length;
      c.updated_at = new Date().toISOString();
      if (!c.saved) c.expires_at = this.expiry(false);
      this.write(d);
      return Promise.resolve(c);
    },
    createGroup: function (g) { var d = this.read(); var row = { id: uid(), name: g.name, color: g.color || null, created_at: new Date().toISOString() }; d.groups.push(row); this.write(d); return Promise.resolve(row); },
    updateGroup: function (id, patch) { var d = this.read(); var g = d.groups.find(function (x) { return x.id === id; }); if (g) Object.assign(g, patch); this.write(d); return Promise.resolve(g); },
    deleteGroup: function (id) {
      var d = this.read();
      d.groups = d.groups.filter(function (g) { return g.id !== id; });
      d.chats.forEach(function (c) { if (c.group_id === id) c.group_id = null; });
      this.write(d);
      return Promise.resolve();
    }
  };

  function missingTable(err) {
    var code = err && (err.code || '');
    var msg = String((err && err.message) || '');
    return code === '42P01' || code === 'PGRST205' || code === 'PGRST202' || /does not exist|Could not find the table|schema cache/i.test(msg);
  }

  var RemoteBackend = {
    client: function () {
      var c = window.RA10 && typeof RA10.getClient === 'function' ? RA10.getClient() : null;
      if (!c) throw new Error('offline');
      return c;
    },
    run: function (q) {
      return q.then(function (res) {
        if (res.error) throw res.error;
        return res.data;
      });
    },
    list: function () {
      var c = this.client();
      return Promise.all([
        this.run(c.from('ai_chats').select(CHAT_COLS).order('updated_at', { ascending: false }).limit(300)),
        this.run(c.from('ai_chat_groups').select('id,name,color,created_at').order('name'))
      ]).then(function (r) { return { chats: r[0] || [], groups: r[1] || [] }; });
    },
    createChat: function (meta) { return this.run(this.client().from('ai_chats').insert(meta).select(CHAT_COLS).single()); },
    updateChat: function (id, patch) { return this.run(this.client().from('ai_chats').update(patch).eq('id', id).select(CHAT_COLS).single()); },
    deleteChat: function (id) { return this.run(this.client().from('ai_chats').delete().eq('id', id)); },
    messages: function (id) { return this.run(this.client().from('ai_chat_messages').select('role,content,created_at').eq('chat_id', id).order('id', { ascending: true }).limit(300)); },
    addMessages: function (id, rows) {
      var self = this;
      // Insert one at a time so ordering by id is guaranteed.
      return rows.reduce(function (p, r) {
        return p.then(function () { return self.run(self.client().from('ai_chat_messages').insert({ chat_id: id, role: r.role, content: r.content })); });
      }, Promise.resolve()).then(function () {
        return self.run(self.client().from('ai_chats').select(CHAT_COLS).eq('id', id).single());
      });
    },
    createGroup: function (g) { return this.run(this.client().from('ai_chat_groups').insert({ name: g.name, color: g.color || null }).select('id,name,color,created_at').single()); },
    updateGroup: function (id, patch) { return this.run(this.client().from('ai_chat_groups').update(patch).eq('id', id).select('id,name,color,created_at').single()); },
    deleteGroup: function (id) { return this.run(this.client().from('ai_chat_groups').delete().eq('id', id)); }
  };

  var store = (function () {
    var backend = null;      // chosen on first call
    var cache = { chats: [], groups: [] };
    var loadedAt = 0;
    var loading = null;
    var subs = [];
    var lastUser = '';

    function pick() {
      if (backend) return backend;
      backend = RemoteBackend;
      try { RemoteBackend.client(); } catch (e) { backend = LocalBackend; }
      return backend;
    }
    function call(method, args) {
      var b = pick();
      return b[method].apply(b, args).catch(function (err) {
        if (b === RemoteBackend && (missingTable(err) || (err && err.message === 'offline'))) {
          if (window.console) console.info('RA10 AI: saved chats are using this device until the ai-chat-history migration is run.');
          backend = LocalBackend;
          return LocalBackend[method].apply(LocalBackend, args);
        }
        throw err;
      });
    }
    function emit() { subs.forEach(function (fn) { try { fn(cache); } catch (e) {} }); }
    function upsertChat(c) {
      if (!c) return c;
      var i = cache.chats.findIndex(function (x) { return x.id === c.id; });
      if (i >= 0) cache.chats[i] = c; else cache.chats.unshift(c);
      cache.chats.sort(function (a, b) { return a.updated_at < b.updated_at ? 1 : -1; });
      emit();
      return c;
    }

    return {
      get chats() { return cache.chats; },
      get groups() { return cache.groups; },
      get isLocal() { return backend === LocalBackend; },
      subscribe: function (fn) { subs.push(fn); return function () { subs = subs.filter(function (x) { return x !== fn; }); }; },
      refresh: function (force) {
        if (!loggedIn()) { cache = { chats: [], groups: [] }; emit(); return Promise.resolve(cache); }
        var u = userId();
        if (u !== lastUser) { lastUser = u; loadedAt = 0; backend = null; }
        if (!force && loadedAt && Date.now() - loadedAt < 30000) return Promise.resolve(cache);
        if (loading) return loading;
        loading = call('list', []).then(function (r) {
          cache = r; loadedAt = Date.now(); loading = null; emit(); return cache;
        }, function (err) { loading = null; throw err; });
        return loading;
      },
      chat: function (id) { return cache.chats.find(function (c) { return c.id === id; }) || null; },
      group: function (id) { return cache.groups.find(function (g) { return g.id === id; }) || null; },
      createChat: function (meta) { return call('createChat', [meta]).then(upsertChat); },
      updateChat: function (id, patch) { return call('updateChat', [id, patch]).then(upsertChat); },
      deleteChat: function (id) {
        return call('deleteChat', [id]).then(function () { cache.chats = cache.chats.filter(function (c) { return c.id !== id; }); emit(); });
      },
      messages: function (id) { return call('messages', [id]); },
      addMessages: function (id, rows) {
        rows = rows.map(function (r) { return { role: r.role, content: stripText(r.content) }; }).filter(function (r) { return r.content.trim(); });
        if (!rows.length) return Promise.resolve(store.chat(id));
        return call('addMessages', [id, rows]).then(upsertChat);
      },
      createGroup: function (g) { return call('createGroup', [g]).then(function (row) { cache.groups.push(row); cache.groups.sort(function (a, b) { return a.name.localeCompare(b.name); }); emit(); return row; }); },
      updateGroup: function (id, patch) { return call('updateGroup', [id, patch]).then(function (row) { var g = store.group(id); if (g && row) Object.assign(g, row); emit(); return row; }); },
      deleteGroup: function (id) {
        return call('deleteGroup', [id]).then(function () {
          cache.groups = cache.groups.filter(function (g) { return g.id !== id; });
          cache.chats.forEach(function (c) { if (c.group_id === id) c.group_id = null; });
          emit();
        });
      }
    };
  })();

  // Digest: short rolling summary used as memory for the chat's group.
  function nextDigest(prev, userText, botText) {
    var add = 'Q: ' + clip(userText, 180) + ' → A: ' + clip(String(botText || '').replace(/[#*`>|_-]{2,}/g, ' '), 320);
    var d = prev ? prev + ' | ' + add : add;
    return d.length > 1200 ? d.slice(d.length - 1200) : d;
  }

  function groupMemory(chat) {
    if (!chat || !chat.group_id) return '';
    var g = store.group(chat.group_id);
    var others = store.chats.filter(function (c) { return c.group_id === chat.group_id && c.id !== chat.id && c.digest; }).slice(0, 6);
    if (!others.length) return '';
    var out = 'Earlier chats in the student’s "' + (g ? g.name : 'group') + '" group (build on these, don’t repeat them):';
    for (var i = 0; i < others.length; i++) {
      var line = '\n- ' + clip(others[i].title, 60) + ': ' + clip(others[i].digest, 380);
      if (out.length + line.length > 1500) break;
      out += line;
    }
    return out;
  }

  /* ── Header stage: aurora canvas + glass bar ────────────────────────── */
  function paintAurora(canvas) {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = canvas.clientWidth || 400, hgt = canvas.clientHeight || 70;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(hgt * dpr);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.fillStyle = dark ? '#16171b' : '#fbfaf8';
    ctx.fillRect(0, 0, w, hgt);
    var blobs = dark
      ? [[0.1, 0.2, '76,141,255', .32], [0.5, 0.6, '162,116,255', .26], [0.9, 0.25, '236,72,153', .16], [0.3, 0.5, '14,165,164', .12]]
      : [[0.1, 0.2, '31,111,235', .22], [0.5, 0.6, '124,58,237', .18], [0.9, 0.25, '236,72,153', .12], [0.3, 0.5, '14,165,164', .09]];
    blobs.forEach(function (b) {
      var r = Math.max(w, hgt) * 0.45;
      var g = ctx.createRadialGradient(b[0] * w, b[1] * hgt, 0, b[0] * w, b[1] * hgt, r);
      g.addColorStop(0, 'rgba(' + b[2] + ',' + b[3] + ')');
      g.addColorStop(1, 'rgba(' + b[2] + ',0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, hgt);
    });
    // Fine diagonal lines give the refraction something to bend.
    ctx.strokeStyle = dark ? 'rgba(255,255,255,.045)' : 'rgba(20,22,28,.04)';
    ctx.lineWidth = 1;
    for (var x = -hgt; x < w; x += 12) { ctx.beginPath(); ctx.moveTo(x, hgt); ctx.lineTo(x + hgt, 0); ctx.stroke(); }
    // The canvas runs ~48px past the glass bar; fade that tail out to
    // transparent so it melts into the page instead of ending in a seam.
    var tail = Math.min(48, hgt * 0.45);
    var fade = ctx.createLinearGradient(0, hgt - tail, 0, hgt);
    fade.addColorStop(0, 'rgba(0,0,0,0)');
    fade.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = fade;
    ctx.fillRect(0, hgt - tail, w, tail);
    ctx.globalCompositeOperation = 'source-over';
  }

  function mountStage(stageEl, canvas, glassEl) {
    paintAurora(canvas);
    var handle = null;
    function attach() {
      if (handle || !window.RA10Liquid) return;
      var r = Math.round((glassEl.offsetHeight || 50) / 2);
      handle = RA10Liquid.stage(stageEl, [glassEl], {
        config: { blurAmount: 0.28, refraction: 0.55, chromAberration: 0.04, edgeHighlight: 0.14, specular: 0.25, fresnel: 0.8, cornerRadius: r, zRadius: Math.min(r, 20), saturation: 0.15, brightness: 0.05, shadowOpacity: 0.16, shadowSpread: 12, shadowOffsetY: 2 }
      });
    }
    if (window.RA10Liquid) attach();
    else {
      var tries = 0;
      var wait = setInterval(function () { if (window.RA10Liquid || ++tries > 40) { clearInterval(wait); attach(); } }, 250);
    }
    var ro = ('ResizeObserver' in window) ? new ResizeObserver(function () { paintAurora(canvas); if (handle) handle.refresh(canvas); }) : null;
    if (ro) ro.observe(stageEl);
    var mo = new MutationObserver(function () { paintAurora(canvas); if (handle) handle.refresh(canvas); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return {
      setEnabled: function (on) { if (handle) handle.setEnabled(on); },
      destroy: function () { if (handle) handle.destroy(); if (ro) ro.disconnect(); mo.disconnect(); }
    };
  }

  /* ── Chat component ─────────────────────────────────────────────────── */
  var MODES = {
    chat: { label: 'Ask', icon: 'chat', placeholder: 'Ask anything…', title: 'Ask a question', desc: 'Explanations, examples and revision help.' },
    hints: { label: 'Hints', icon: 'bulb', placeholder: 'What are you stuck on? I’ll coach you…', title: 'Get unstuck', desc: 'Step-by-step nudges towards a higher grade. It won’t do the work for you.' },
    examiner: { label: 'Mark my work', icon: 'exam', placeholder: 'Anything the marker should know? (optional)', title: 'Mark my work', desc: 'Upload or paste your work for a predicted grade against the criteria.' }
  };
  var PRODUCT_NAMES = { helper: 'AI Helper', assigner: 'AI Assigner', examiner: 'AI Examiner' };
  var SORTS = [['recent', 'Recent'], ['subject', 'Subject'], ['unit', 'Unit'], ['topic', 'Topic'], ['group', 'Groups']];

  /* opts:
       variant:   'panel' | 'inline'
       product:   'helper' | 'assigner'
       title:     header name (default from product)
       modes:     ['chat','hints','examiner'] (first is default)
       suggestions: [{label, prompt}] or strings
       welcomeTitle / welcomeText
       context:   () => string — extra page context for the AI
       meta:      overrides for subject/unit/topic tags
       examiner:  { submit(text, fileName) → Promise<{markdown, render(): Element}> }
       onClose:   () => void (panel)
       disclaimer */
  function mountChat(host, opts) {
    opts = opts || {};
    var product = opts.product || 'helper';
    var modes = (opts.modes && opts.modes.length) ? opts.modes : ['chat'];
    var state = {
      mode: modes[0],
      chat: null,          // stored row once created
      messages: [],        // {role, content}
      meta: detectContext(opts.meta),
      groupId: null,
      busy: false,
      attach: null,        // {label, text}
      sort: ls('ra10_ai_sort') || 'recent',
      query: '',
      work: null,          // examiner: {name, text}
      task: ''             // assignment task code ('' = whole assignment)
    };

    var root = h('div', { class: 'rai' + (opts.variant === 'panel' ? ' compact overlay-side' : '') });
    root.innerHTML =
      '<aside class="rai-side" aria-label="Chat history">' +
        '<div class="rai-side-head">' +
          '<div class="rai-side-top"><span class="rai-side-title">Your chats</span>' +
            '<button type="button" class="rai-icon-btn" data-act="newgroup" title="New group">' + icon('folder', 16) + '<span>Group</span></button>' +
            '<button type="button" class="rai-icon-btn" data-act="closeside" title="Hide history" aria-label="Hide history">' + icon('side') + '</button></div>' +
          '<input class="rai-search" type="search" placeholder="Search chats" aria-label="Search chats">' +
          '<div class="rai-sort" role="group" aria-label="Sort chats by">' + SORTS.map(function (s) { return '<button type="button" data-sort="' + s[0] + '">' + s[1] + '</button>'; }).join('') + '</div>' +
        '</div>' +
        '<div class="rai-side-list"></div>' +
        '<div class="rai-side-foot"></div>' +
      '</aside>' +
      '<div class="rai-scrim"></div>' +
      '<section class="rai-main">' +
        '<div class="rai-aurora-bg"></div>' +
        '<header class="rai-head">' +
          // WebGL root: only a backdrop canvas + an empty glass shape, so
          // the library never has to rasterise DOM text (cheap to start).
          '<div class="rai-stage" aria-hidden="true"><canvas class="rai-stage-canvas"></canvas><div class="rai-bar-glass rai-glass"></div></div>' +
          '<div class="rai-bar">' +
            '<button type="button" class="rai-icon-btn" data-act="side" aria-label="Show chat history" title="Chat history">' + icon('side') + '</button>' +
            '<div class="rai-brand">' + orb('', 16) + '<div class="rai-brand-text"><span class="rai-brand-name"></span><span class="rai-brand-sub"></span></div></div>' +
            '<div class="rai-bar-actions">' +
              '<button type="button" class="rai-icon-btn" data-act="save" aria-pressed="false" title="Save chat (keep forever)" aria-label="Save chat">' + icon('star') + '</button>' +
              '<button type="button" class="rai-icon-btn" data-act="new" title="New chat" aria-label="New chat">' + icon('plus') + '</button>' +
              '<button type="button" class="rai-icon-btn" data-act="more" title="More" aria-label="More options" aria-haspopup="menu">' + icon('more') + '</button>' +
              (opts.variant === 'panel' ? '<button type="button" class="rai-icon-btn" data-act="close" title="Close" aria-label="Close">' + icon('close') + '</button>' : '') +
            '</div>' +
          '</div>' +
        '</header>' +
        '<div class="rai-ctx"></div>' +
        '<div class="rai-scroll"><div class="rai-msgs" role="log" aria-live="polite"></div></div>' +
        '<div class="rai-dock">' +
          '<div class="rai-composer">' +
            '<div class="rai-attach-slot"></div>' +
            '<div class="rai-tray-slot"></div>' +
            '<label class="rai-sr" for="">Message</label>' +
            '<div class="rai-math-slot"></div>' +
            '<textarea class="rai-input" rows="1"></textarea>' +
            '<div class="rai-composer-row">' +
              (modes.length > 1 ? '<div class="rai-modes" role="radiogroup" aria-label="Mode">' + modes.map(function (m) {
                return '<button type="button" class="rai-mode" role="radio" data-mode="' + m + '" aria-checked="false">' + icon(MODES[m].icon, 14) + '<span>' + MODES[m].label + '</span></button>';
              }).join('') + '</div>' : '') +
              '<span class="rai-math-bar"></span><span class="rai-spacer"></span><span class="rai-cost"></span>' +
              '<button type="button" class="rai-send" aria-label="Send" disabled>' + ICON.send + '</button>' +
            '</div>' +
          '</div>' +
          '<div class="rai-disclaimer"></div>' +
        '</div>' +
      '</section>';
    host.appendChild(root);
    // overflow:hidden containers can still be scrolled by focus(); pin them.
    root.addEventListener('scroll', function () { if (root.scrollLeft || root.scrollTop) { root.scrollLeft = 0; root.scrollTop = 0; } });
    var main = root.querySelector('.rai-main');
    main.addEventListener('scroll', function () { if (main.scrollLeft || main.scrollTop) { main.scrollLeft = 0; main.scrollTop = 0; } });

    var $ = function (sel) { return root.querySelector(sel); };
    var input = $('.rai-input');
    var sendBtn = $('.rai-send');
    var msgsEl = $('.rai-msgs');
    var scrollEl = $('.rai-scroll');
    var inputId = 'rai-in-' + Math.random().toString(36).slice(2, 8);
    input.id = inputId;
    $('.rai-sr').setAttribute('for', inputId);
    $('.rai-brand-name').textContent = opts.title || PRODUCT_NAMES[product] || 'RA10 AI';
    $('.rai-disclaimer').textContent = opts.disclaimer || 'AI can make mistakes, so check important facts. Chats are deleted after 30 days unless you save them.';

    var stage = mountStage($('.rai-stage'), $('.rai-stage-canvas'), $('.rai-bar-glass'));
    function hookMath() {
      if (window.RA10Math && !input.hasAttribute('data-rmt')) {
        RA10Math.attach(input, { bar: $('.rai-math-bar'), panelHost: $('.rai-math-slot'), compact: true, onChange: function () { autosize(); } });
      }
    }
    if (window.RA10Math) hookMath(); else document.addEventListener('ra10math:ready', hookMath, { once: true });
    var dock = $('.rai-dock');
    function padForDock() { msgsEl.style.paddingBottom = (dock.offsetHeight + 24) + 'px'; }
    if ('ResizeObserver' in window) new ResizeObserver(padForDock).observe(dock);
    padForDock();

    // Wide inline layouts keep the sidebar docked; narrow ones overlay it.
    function layout() {
      if (opts.variant === 'panel') return;
      var wide = root.clientWidth >= 860;
      root.classList.toggle('overlay-side', !wide);
      root.classList.toggle('compact', root.clientWidth < 620);
      if (wide && ls('ra10_ai_side') !== '0') root.classList.add('side-open');
    }
    if ('ResizeObserver' in window) new ResizeObserver(layout).observe(root);
    setTimeout(layout, 0);

    function setSide(open) {
      root.classList.toggle('side-open', open);
      if (!root.classList.contains('overlay-side')) ls('ra10_ai_side', open ? '1' : '0');
      if (open) { store.refresh().then(renderSide, renderSide); }
    }

    /* Mode */
    function setMode(m) {
      if (modes.indexOf(m) === -1) return;
      state.mode = m;
      root.querySelectorAll('.rai-mode').forEach(function (b) { b.setAttribute('aria-checked', String(b.dataset.mode === m)); });
      input.placeholder = (opts.placeholders && opts.placeholders[m]) || MODES[m].placeholder;
      renderTray();
      updateCost();
      updateSend();
      if (!state.messages.length && msgsEl.querySelector('.rai-welcome')) renderWelcome();
    }

    function updateCost() {
      var c = state.mode === 'examiner' ? markCost() : hintCost();
      $('.rai-cost').textContent = loggedIn() ? (c <= 0 ? '' : costLabel(c) + (state.mode === 'examiner' ? ' / mark' : ' / message')) : 'Sign in to use AI';
    }
    function updateSend() {
      var ready = state.mode === 'examiner' ? !!(state.work && state.work.text) : !!input.value.trim();
      sendBtn.disabled = state.busy || !ready;
    }

    /* Context chips */
    function renderCtx() {
      var c = state.chat || {};
      var meta = state.chat ? c : state.meta;
      var gid = state.chat ? c.group_id : state.groupId;
      var g = gid ? store.group(gid) : null;
      var chips = [];
      var where = [meta.subject, meta.unit].filter(Boolean).join(' · ');
      if (where) chips.push('<button type="button" class="rai-chip" data-act="tags" title="Edit tags">' + icon('tag') + esc(where) + '</button>');
      chips.push('<button type="button" class="rai-chip" data-act="topic" title="Edit topic">' + (meta.topic ? esc(clip(meta.topic, 40)) : '+ Topic') + '</button>');
      chips.push(g
        ? '<button type="button" class="rai-chip group" data-act="group" style="--rai-chip-color:' + esc(g.color || '#7c3aed') + '"><span class="rai-dot"></span>' + esc(g.name) + '</button>'
        : '<button type="button" class="rai-chip" data-act="group">' + icon('folder', 13) + 'Add to group</button>');
      if (state.chat) {
        if (c.saved) chips.push('<span class="rai-chip saved">' + icon('starOn', 12) + 'Saved</span>');
        else { var d = daysLeft(c.expires_at); chips.push('<span class="rai-chip expiry">Auto-deletes in ' + (d == null ? RETENTION_DAYS : d) + ' day' + (d === 1 ? '' : 's') + '</span>'); }
      }
      $('.rai-ctx').innerHTML = chips.join('');
      var sub = [meta.unit || meta.subject, meta.topic].filter(Boolean).join(' — ');
      $('.rai-brand-sub').textContent = state.chat ? clip(c.title, 70) : (sub || 'Ask, revise and get feedback');
      var save = $('[data-act="save"]');
      save.setAttribute('aria-pressed', String(!!c.saved));
      save.innerHTML = c.saved ? icon('starOn') : icon('star');
      save.title = c.saved ? 'Saved — click to let it auto-delete' : 'Save chat (keep forever)';
      save.style.visibility = state.chat ? 'visible' : 'hidden';
    }

    /* Messages */
    function scrollDown(force) {
      var near = scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight < 160;
      if (force || near) scrollEl.scrollTop = scrollEl.scrollHeight;
    }
    function botNode(content, extraEl) {
      var row = h('div', { class: 'rai-msg bot' });
      row.innerHTML = orb('sm', 13);
      var body = h('div', { class: 'rai-body' });
      if (extraEl) body.appendChild(extraEl);
      else body.appendChild(h('div', { class: 'rai-prose' }, md(content)));
      var tools = h('div', { class: 'rai-msg-tools' });
      var copy = h('button', { type: 'button', class: 'rai-icon-btn', title: 'Copy' }, icon('copy') + '<span>Copy</span>');
      copy.onclick = function () {
        try { navigator.clipboard.writeText(content); } catch (e) {}
        copy.querySelector('span').textContent = 'Copied';
        setTimeout(function () { copy.querySelector('span').textContent = 'Copy'; }, 1400);
      };
      tools.appendChild(copy);
      body.appendChild(tools);
      row.appendChild(body);
      renderMath(body);
      return row;
    }
    function userNode(content, quote) {
      var row = h('div', { class: 'rai-msg user' });
      var col = h('div', { style: 'display:flex;flex-direction:column;align-items:flex-end;max-width:100%' });
      if (quote) col.appendChild(h('div', { class: 'rai-quote', text: quote }));
      col.appendChild(h('div', { class: 'rai-bubble' }, mathText(content)));
      row.appendChild(col);
      renderMath(col);
      return row;
    }
    function markLast() {
      root.querySelectorAll('.rai-msg.last').forEach(function (n) { n.classList.remove('last'); });
      var bots = root.querySelectorAll('.rai-msg.bot');
      if (bots.length) bots[bots.length - 1].classList.add('last');
    }
    function notice(text, err) { msgsEl.appendChild(h('div', { class: 'rai-notice' + (err ? ' err' : ''), text: text })); scrollDown(true); }

    function renderWelcome() {
      msgsEl.innerHTML = '';
      var w = h('div', { class: 'rai-welcome' });
      var title = opts.welcomeTitle || 'How can I <em>help</em> today?';
      w.innerHTML = orb('lg', 28) + '<h2>' + title + '</h2>' +
        '<p>' + esc(opts.welcomeText || 'Ask about anything on this page. Your chats are saved to your account and sorted by subject, unit and topic.') + '</p>';
      if (modes.length > 1) {
        var starts = h('div', { class: 'rai-starts', role: 'group', 'aria-label': 'What do you want to do?' });
        modes.forEach(function (m) {
          var b = h('button', { type: 'button', class: 'rai-start rai-glass' + (state.mode === m ? ' on' : '') },
            '<span class="rai-start-ico">' + icon(MODES[m].icon, 18) + '</span><span><b>' + esc(MODES[m].title) + '</b><small>' + esc(MODES[m].desc) + '</small></span>');
          b.onclick = function () { setMode(m); renderWelcome(); input.focus(); };
          starts.appendChild(b);
        });
        w.appendChild(starts);
      }
      var sugs = (opts.suggestions || []).map(function (s) { return typeof s === 'string' ? { label: s, prompt: s } : s; }).slice(0, 4);
      if (sugs.length && state.mode === 'chat') {
        var grid = h('div', { class: 'rai-sugs' });
        sugs.forEach(function (s) {
          var b = h('button', { type: 'button', class: 'rai-sug rai-glass' }, (s.kicker ? '<small>' + esc(s.kicker) + '</small>' : '') + esc(s.label));
          b.onclick = function () { input.value = s.prompt; send(); };
          grid.appendChild(b);
        });
        w.appendChild(grid);
      }
      msgsEl.appendChild(w);
    }

    function renderMessages() {
      msgsEl.innerHTML = '';
      if (!state.messages.length) { renderWelcome(); return; }
      state.messages.forEach(function (m) { msgsEl.appendChild(m.role === 'user' ? userNode(m.content) : botNode(m.content)); });
      markLast();
      scrollDown(true);
    }

    function thinking() {
      var row = h('div', { class: 'rai-msg bot rai-thinking' });
      var steps = opts.statuses || (state.mode === 'examiner'
        ? ['Reading your work', 'Checking the criteria', 'Weighing up the evidence', 'Writing your feedback']
        : ['Thinking', 'Checking the specification', 'Writing your answer']);
      row.innerHTML = orb('sm', 13) + '<span class="rai-shimmer">' + steps[0] + '…</span>';
      msgsEl.appendChild(row);
      scrollDown(true);
      var i = 0;
      var t = setInterval(function () { i = (i + 1) % steps.length; row.querySelector('.rai-shimmer').textContent = steps[i] + '…'; }, 1700);
      return { remove: function () { clearInterval(t); row.remove(); } };
    }

    /* Attachments: selected text / examiner work */
    function renderAttach() {
      var slot = $('.rai-attach-slot');
      slot.innerHTML = '';
      if (!state.attach) return;
      var a = h('div', { class: 'rai-attach' }, '<span class="rai-attach-label">' + esc(state.attach.label || 'Context') + '</span><b></b><button type="button" aria-label="Remove">' + '✕' + '</button>');
      a.querySelector('b').textContent = state.attach.text;
      a.querySelector('button').onclick = function () { state.attach = null; renderAttach(); };
      slot.appendChild(a);
    }

    function renderTasks(slot) {
      var tasks = opts.tasks || [];
      if (!tasks.length || state.mode === 'chat') return;
      var row = h('div', { class: 'rai-tasks-pick', role: 'radiogroup', 'aria-label': 'Which task?' });
      row.appendChild(h('span', { class: 'rai-tasks-label', text: 'Task' }));
      [{ code: '', short: 'Whole assignment' }].concat(tasks).forEach(function (t) {
        var b = h('button', { type: 'button', role: 'radio', class: 'rai-chip', 'aria-checked': String(state.task === t.code), title: t.title || '' }, esc(t.short || t.title));
        b.onclick = function () { state.task = t.code; renderTray(); };
        row.appendChild(b);
      });
      slot.appendChild(row);
    }
    function currentTask() {
      return (opts.tasks || []).find(function (t) { return t.code === state.task; }) || null;
    }

    function renderTray() {
      var slot = $('.rai-tray-slot');
      slot.innerHTML = '';
      renderTasks(slot);
      if (state.mode !== 'examiner') return;
      var tray = h('div', { class: 'rai-tray' });
      var fileInput = h('input', { type: 'file', accept: '.pdf,.docx,.txt,.md,.rtf', hidden: true });
      var drop = h('div', { class: 'rai-drop', tabindex: '0', role: 'button', 'aria-label': 'Upload your work' },
        '<span class="rai-drop-ico">' + icon('upload') + '</span><span><b>Upload your work</b><small>PDF, Word (.docx), text or markdown · up to 4 MB · only the text is read</small></span>');
      tray.appendChild(fileInput);
      if (state.work && state.work.text) {
        var f = h('div', { class: 'rai-file' }, icon('check') + '<span></span><button type="button" class="rai-icon-btn" aria-label="Remove work">' + icon('close', 14) + '</button>');
        f.querySelector('span').textContent = (state.work.name || 'Pasted work') + ' · ' + state.work.text.split(/\s+/).filter(Boolean).length + ' words';
        f.querySelector('button').onclick = function () { state.work = null; renderTray(); updateSend(); };
        tray.appendChild(f);
      } else {
        tray.appendChild(drop);
        var paste = h('textarea', { class: 'rai-input', placeholder: '…or paste your assignment evidence here', 'aria-label': 'Paste your work' });
        paste.addEventListener('input', function () { state.work = paste.value.trim() ? { name: '', text: paste.value.trim().slice(0, 12000) } : null; updateSend(); });
        paste.addEventListener('blur', function () { if (state.work && !state.work.name) renderTray(); });
        tray.appendChild(paste);
      }
      drop.onclick = function () { fileInput.click(); };
      drop.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); } };
      fileInput.onchange = function () { if (fileInput.files && fileInput.files[0]) readFile(fileInput.files[0], drop); };
      var depth = 0;
      drop.addEventListener('dragenter', function (e) { e.preventDefault(); depth++; drop.classList.add('drag'); });
      drop.addEventListener('dragover', function (e) { e.preventDefault(); });
      drop.addEventListener('dragleave', function () { if (--depth <= 0) { depth = 0; drop.classList.remove('drag'); } });
      drop.addEventListener('drop', function (e) { e.preventDefault(); depth = 0; drop.classList.remove('drag'); if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0], drop); });
      slot.appendChild(tray);
    }

    function readFile(file, drop) {
      var ext = (file.name.split('.').pop() || '').toLowerCase();
      function fail(msg) { toast(msg); }
      if (file.size > 4 * 1024 * 1024) return fail('That file is over 4 MB.');
      if (['pdf', 'docx', 'txt', 'md', 'rtf'].indexOf(ext) === -1) return fail(ext === 'doc' ? 'Please save it as .docx and try again.' : 'Use a PDF, Word (.docx), text or markdown file.');
      drop.classList.add('loading');
      extractText(file, ext).then(function (text) {
        text = String(text || '').replace(/\r\n/g, '\n').replace(/\u0000/g, '').trim();
        if (!text) throw new Error('No text found — it may be a scanned image.');
        state.work = { name: file.name, text: text.length > 12000 ? text.slice(0, 12000) + '\n…[truncated]' : text };
        renderTray(); updateSend();
      }).catch(function (e) { fail(e && e.message ? e.message : 'Could not read that file.'); })
        .then(function () { drop.classList.remove('loading'); });
    }

    /* Sending */
    function buildContext() {
      var parts = [];
      var meta = state.chat || state.meta;
      var where = [meta.qualification, meta.subject, meta.unit].filter(Boolean).join(' ');
      if (where) parts.push('Course: ' + where + (meta.topic ? '. Topic: ' + meta.topic : ''));
      if (typeof opts.context === 'function') { try { var c = opts.context(state.mode); if (c) parts.push(c); } catch (e) {} }
      if (state.attach) parts.push((state.attach.label || 'Selected text') + ':\n"' + clip(state.attach.text, 1200) + '"');
      if (state.chat && state.chat.digest && state.messages.length > 8) parts.push('Earlier in this chat: ' + clip(state.chat.digest, 600));
      var mem = groupMemory(state.chat || { group_id: state.groupId });
      var text = parts.join('\n\n');
      if (mem) text = text.slice(0, CONTEXT_BUDGET - mem.length - 2) + '\n\n' + mem;
      return text.slice(0, CONTEXT_BUDGET);
    }

    function ensureChat(firstText) {
      if (state.chat) return Promise.resolve(state.chat);
      if (state._creating) return state._creating;
      var m = state.meta;
      var meta = {
        product: product,
        title: clip(firstText, 70) || 'New chat',
        subject: m.subject, qualification: m.qualification, unit: m.unit, topic: m.topic,
        unit_key: m.unit_key, page_path: m.page_path,
        group_id: state.groupId || null
      };
      state._creating = store.createChat(meta).then(function (c) { state.chat = c; state._creating = null; renderCtx(); renderSide(); return c; },
        function (e) { state._creating = null; throw e; });
      return state._creating;
    }

    function persist(userText, botText) {
      return ensureChat(userText).then(function (c) {
        return store.addMessages(c.id, [{ role: 'user', content: userText }, { role: 'assistant', content: botText }]);
      }).then(function (c) {
        state.chat = c || state.chat;
        return store.updateChat(state.chat.id, { digest: nextDigest(state.chat.digest, userText, botText) });
      }).then(function (c) { if (c) state.chat = c; renderCtx(); })
        .catch(function (e) {
          if (window.console) console.warn('RA10 AI: could not save chat', e);
          toast(e && e.message && /limit|full/i.test(e.message) ? e.message : 'Couldn’t save this chat — it’s still here until you leave.');
        });
    }

    function requireLogin(action) {
      if (loggedIn()) return true;
      notice('Sign in to use ' + (opts.title || PRODUCT_NAMES[product]) + ' — your chats are saved to your account.');
      if (window.RA10 && RA10.showPaywall) RA10.showPaywall('account', action);
      return false;
    }

    function send() {
      if (state.busy) return;
      if (state.mode === 'examiner') return examine();
      var text = input.value.trim();
      if (!text) return;
      if (!requireLogin('ai_assigner_hint')) return;
      var quote = state.attach ? clip(state.attach.text, 220) : '';
      var context = (MATH_HINT + '\n' + buildContext()).slice(0, CONTEXT_BUDGET);
      if (state.mode === 'hints') {
        var tk = currentTask();
        context = 'MODE: Hints — coach the student toward the next grade with questions and nudges; do not write the work for them.' +
          (tk ? ' The student is working on ' + (tk.short || '') + ': ' + (tk.title || '') + '.' : '') + '\n\n' + context;
      }
      if (!state.messages.length) msgsEl.innerHTML = '';
      input.value = ''; autosize();
      msgsEl.appendChild(userNode(text, quote));
      state.messages.push({ role: 'user', content: text });
      state.busy = true; updateSend();
      var think = thinking();
      var history = state.messages.slice(-9, -1).map(function (m) { return { role: m.role === 'assistant' ? 'bot' : 'user', content: m.content.slice(0, 1500) }; });

      confirmCredits(hintCost(), opts.title || PRODUCT_NAMES[product]).then(function (ok) {
        if (!ok) throw { cancelled: true };
        if (typeof window.ra10Gate === 'function') return Promise.resolve(window.ra10Gate('ai_assigner_hint')).then(function (g) { if (g === false) throw { cancelled: true }; });
      }).then(function () {
        ensureChat(text).catch(function () {}); // create the row while the AI thinks
        return RA10.askAiAssigner({ message: text, history: history, context: context, unit: state.meta.unit_key || '' });
      }).then(function (res) {
        think.remove();
        var reply = String(res && res.reply || '').trim() || 'Sorry, I didn’t get a reply. Please try again.';
        state.messages.push({ role: 'assistant', content: reply });
        msgsEl.appendChild(botNode(reply));
        markLast(); scrollDown();
        state.attach = null; renderAttach();
        persist(text, reply);
        if (window._ra10RenderUnitCreditChip) { try { window._ra10RenderUnitCreditChip(); } catch (e) {} }
      }).catch(function (e) {
        think.remove();
        state.messages.pop();
        var last = msgsEl.lastElementChild;
        if (last && last.classList.contains('user')) last.remove();
        if (!state.messages.length) renderWelcome();
        if (e && e.cancelled) { input.value = text; autosize(); return; }
        var msg = (e && e.message) || 'Something went wrong.';
        if (/credit/i.test(msg) && window.RA10 && RA10.showPaywall) RA10.showPaywall('credits', 'ai_assigner_hint');
        input.value = text; autosize();
        notice(msg, true);
      }).then(function () { state.busy = false; updateSend(); updateCost(); });
    }

    function examine() {
      if (!state.work || !state.work.text || !opts.examiner) return;
      if (!requireLogin('ai_assigner_mark')) return;
      var work = state.work;
      var note = input.value.trim();
      var words = work.text.split(/\s+/).filter(Boolean).length;
      var task = currentTask();
      var userText = 'Please mark my work' + (task ? ' for ' + (task.short || task.title) : '') + (work.name ? ' (' + work.name + ', ' + words + ' words)' : ' (' + words + ' words)') + (note ? '\n\nNote: ' + note : '');
      if (!state.messages.length) msgsEl.innerHTML = '';
      msgsEl.appendChild(userNode(userText));
      state.messages.push({ role: 'user', content: userText });
      state.busy = true; updateSend();
      var think = thinking();
      confirmCredits(markCost(), 'Marking your assignment').then(function (ok) {
        if (!ok) throw { cancelled: true };
        if (typeof window.ra10Gate === 'function') return Promise.resolve(window.ra10Gate('ai_assigner_mark')).then(function (g) { if (g === false) throw { cancelled: true }; });
      }).then(function () {
        return opts.examiner.submit(work.text, work.name, note, task);
      }).then(function (out) {
        think.remove();
        state.messages.push({ role: 'assistant', content: out.markdown });
        var node = botNode(out.markdown, out.element);
        msgsEl.appendChild(node);
        markLast();
        requestAnimationFrame(function () { scrollEl.scrollTop = Math.max(0, node.offsetTop - 12); });
        input.value = ''; autosize();
        state.work = null; renderTray();
        // Store a short excerpt of the work, never the whole file.
        persist(userText + '\n\nExcerpt:\n' + clip(work.text, 1200), out.markdown);
        if (window._ra10RenderUnitCreditChip) { try { window._ra10RenderUnitCreditChip(); } catch (e) {} }
      }).catch(function (e) {
        think.remove();
        state.messages.pop();
        var last = msgsEl.lastElementChild;
        if (last && last.classList.contains('user')) last.remove();
        if (!state.messages.length) renderWelcome();
        if (e && e.cancelled) return;
        var msg = (e && e.message) || 'Could not examine your work.';
        if (/credit/i.test(msg) && window.RA10 && RA10.showPaywall) RA10.showPaywall('credits', 'ai_assigner_mark');
        notice(msg, true);
      }).then(function () { state.busy = false; updateSend(); updateCost(); });
    }

    function autosize() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 180) + 'px'; updateSend(); }
    input.addEventListener('input', autosize);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(); } });
    sendBtn.onclick = send;
    root.querySelectorAll('.rai-mode').forEach(function (b) { b.onclick = function () { setMode(b.dataset.mode); }; });
    // Arrow keys move between modes (radiogroup pattern).
    var modesEl = $('.rai-modes');
    if (modesEl) modesEl.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var i = modes.indexOf(state.mode) + (e.key === 'ArrowRight' ? 1 : -1);
      setMode(modes[(i + modes.length) % modes.length]);
      root.querySelector('.rai-mode[data-mode="' + state.mode + '"]').focus();
    });

    /* Chat lifecycle */
    function newChat(silent) {
      state.chat = null; state.messages = []; state.groupId = state.groupId || null;
      state.meta = detectContext(opts.meta);
      renderMessages(); renderCtx(); renderSide();
      if (!silent) input.focus();
    }

    function openChat(id) {
      var c = store.chat(id);
      if (!c) return Promise.resolve(false);
      state.chat = c; state.groupId = c.group_id; state.messages = [];
      msgsEl.innerHTML = '';
      var t = thinking();
      renderCtx(); renderSide();
      if (root.classList.contains('overlay-side')) setSide(false);
      return store.messages(id).then(function (rows) {
        t.remove();
        if (state.chat !== c) return true;
        state.messages = (rows || []).map(function (r) { return { role: r.role, content: r.content }; });
        renderMessages();
        return true;
      }, function () { t.remove(); notice('Couldn’t load that chat.', true); return false; });
    }

    function toggleSave() {
      if (!state.chat) return;
      var to = !state.chat.saved;
      store.updateChat(state.chat.id, { saved: to }).then(function (c) {
        state.chat = c; renderCtx(); renderSide();
        toast(to ? 'Saved — this chat won’t be deleted' : 'Unsaved — it’ll auto-delete in 30 days');
      }, function () { toast('Couldn’t update that chat.'); });
    }

    function editTopic() {
      var cur = (state.chat || state.meta).topic || '';
      promptText({ title: 'Topic', body: 'Topics help sort your chats. e.g. “Normalisation” or “Aim B”.', value: cur, placeholder: 'Topic', max: 120, allowEmpty: true }).then(function (v) {
        if (v == null) return;
        v = v || null;
        if (state.chat) store.updateChat(state.chat.id, { topic: v }).then(function (c) { state.chat = c; renderCtx(); renderSide(); });
        else { state.meta.topic = v; renderCtx(); }
      });
    }

    function editTags() {
      var m = state.chat || state.meta;
      dialog(function (card, done) {
        card.innerHTML = '<h3>Sort this chat</h3><p>Used to group your history by subject, unit and topic.</p>' +
          '<label>Subject</label><input class="rai-field" data-k="subject" maxlength="60">' +
          '<label>Unit</label><input class="rai-field" data-k="unit" maxlength="80">' +
          '<label>Topic</label><input class="rai-field" data-k="topic" maxlength="120">' +
          '<div class="rai-dialog-actions"><button type="button" class="rai-btn ghost">Cancel</button><button type="button" class="rai-btn primary">Save</button></div>';
        card.querySelectorAll('input').forEach(function (i) { i.value = m[i.dataset.k] || ''; });
        card.querySelector('.ghost').onclick = function () { done(null); };
        card.querySelector('.primary').onclick = function () {
          var out = {};
          card.querySelectorAll('input').forEach(function (i) { out[i.dataset.k] = i.value.trim() || null; });
          done(out);
        };
      }).then(function (v) {
        if (!v) return;
        if (state.chat) store.updateChat(state.chat.id, v).then(function (c) { state.chat = c; renderCtx(); renderSide(); });
        else { Object.assign(state.meta, v); renderCtx(); }
      });
    }

    function setGroup(chatId, groupId) {
      if (!chatId) { state.groupId = groupId; renderCtx(); return Promise.resolve(); }
      return store.updateChat(chatId, { group_id: groupId }).then(function (c) {
        if (state.chat && state.chat.id === chatId) { state.chat = c; state.groupId = groupId; }
        renderCtx(); renderSide();
        if (groupId) toast('Added to “' + ((store.group(groupId) || {}).name || 'group') + '” — it now shares context');
      }, function () { toast('Couldn’t move that chat.'); });
    }

    function newGroup(thenAssignChatId) {
      if (!requireLogin('ai_assigner_hint')) return Promise.resolve(null);
      return groupDialog(null).then(function (v) {
        if (!v) return null;
        return store.createGroup(v).then(function (g) {
          renderSide();
          if (thenAssignChatId !== undefined) return setGroup(thenAssignChatId, g.id).then(function () { return g; });
          return g;
        }, function (e) { toast((e && e.message) || 'Couldn’t create that group.'); return null; });
      });
    }

    function groupMenu(anchor, chatId) {
      var current = chatId ? (store.chat(chatId) || {}).group_id : state.groupId;
      var items = [{ heading: 'Move to group' }];
      store.groups.forEach(function (g) {
        if (g.id === current) return;
        items.push({ label: g.name, icon: 'folder', onClick: function () { setGroup(chatId, g.id); } });
      });
      items.push({ label: 'New group…', icon: 'plus', onClick: function () { newGroup(chatId || null); } });
      if (current) items.push('hr', { label: 'Remove from group', icon: 'close', onClick: function () { setGroup(chatId, null); } });
      menu(anchor, root, items);
    }

    function renameChat(id) {
      var c = store.chat(id);
      if (!c) return;
      promptText({ title: 'Rename chat', value: c.title, max: 120 }).then(function (v) {
        if (!v) return;
        store.updateChat(id, { title: v }).then(function (u) { if (state.chat && state.chat.id === id) state.chat = u; renderCtx(); renderSide(); });
      });
    }

    function deleteChat(id) {
      var c = store.chat(id);
      if (!c) return;
      dialog(function (card, done) {
        card.innerHTML = '<h3>Delete this chat?</h3><p>“' + esc(clip(c.title, 80)) + '” will be permanently deleted.</p>' +
          '<div class="rai-dialog-actions"><button type="button" class="rai-btn ghost">Cancel</button><button type="button" class="rai-btn primary" style="background:#c0262d">Delete</button></div>';
        card.querySelector('.ghost').onclick = function () { done(false); };
        card.querySelector('.primary').onclick = function () { done(true); };
      }).then(function (ok) {
        if (!ok) return;
        store.deleteChat(id).then(function () { if (state.chat && state.chat.id === id) newChat(true); renderSide(); toast('Chat deleted'); });
      });
    }

    function glassItems() {
      var cur = window.RA10Liquid ? RA10Liquid.preference : 'auto';
      return [{ heading: 'Glass effects' + (window.RA10Liquid ? ' · ' + RA10Liquid.mode : '') }].concat([
        ['auto', 'Auto (recommended)'], ['webgl', 'Full liquid glass'], ['css', 'Optimised'], ['off', 'Off']
      ].map(function (o) {
        return { label: (cur === o[0] ? '✓ ' : ' ') + o[1], onClick: function () { if (window.RA10Liquid) { RA10Liquid.setMode(o[0]); toast('Glass: ' + o[1]); } } };
      }));
    }

    function moreMenu(anchor) {
      var c = state.chat;
      var items = [];
      if (opts.variant === 'panel' && opts.onExpand) items.push({ label: root.closest('.rai-panel.wide') ? 'Shrink panel' : 'Expand panel', icon: 'expand', onClick: opts.onExpand }, 'hr');
      if (c) {
        items.push({ label: 'Rename', icon: 'edit', onClick: function () { renameChat(c.id); } });
        items.push({ label: c.saved ? 'Unsave (auto-delete in 30 days)' : 'Save (keep forever)', icon: 'star', onClick: toggleSave });
      }
      items.push({ label: 'Edit subject, unit & topic', icon: 'tag', onClick: editTags });
      items.push({ label: 'Move to group…', icon: 'folder', onClick: function () { groupMenu(anchor, c ? c.id : null); } });
      if (c) items.push('hr', { label: 'Delete chat', icon: 'trash', danger: true, onClick: function () { deleteChat(c.id); } });
      items.push('hr');
      menu(anchor, root, items.concat(glassItems()));
    }

    /* Sidebar */
    function bucketRecent(c) {
      var d = new Date(c.updated_at), now = new Date();
      var day = 86400000, startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      if (d.getTime() >= startToday) return '1|Today';
      if (d.getTime() >= startToday - day) return '2|Yesterday';
      if (d.getTime() >= startToday - 7 * day) return '3|Previous 7 days';
      return '4|Older';
    }
    function renderSide() {
      var list = $('.rai-side-list');
      if (!list) return;
      root.querySelectorAll('.rai-sort button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.sort === state.sort)); });
      if (!loggedIn()) {
        list.innerHTML = '<div class="rai-side-empty">Sign in to save your chats and pick up where you left off.</div>';
        $('.rai-side-foot').textContent = '';
        return;
      }
      var q = state.query.toLowerCase();
      var chats = store.chats.filter(function (c) {
        if (!q) return true;
        return [c.title, c.subject, c.unit, c.topic].join(' ').toLowerCase().indexOf(q) !== -1;
      });
      var sections = {};
      function add(key, label, c, extra) { (sections[key] = sections[key] || { label: label, items: [], extra: extra }).items.push(c); }
      chats.forEach(function (c) {
        if (state.sort === 'recent') {
          if (c.saved) add('0|Saved', 'Saved', c);
          else { var b = bucketRecent(c); add(b, b.split('|')[1], c); }
        } else if (state.sort === 'subject') {
          var s = [c.subject, c.qualification].filter(Boolean).join(' · ') || 'General';
          add(s, s, c);
        } else if (state.sort === 'unit') {
          var u = c.unit || c.subject || 'General';
          add(u, u, c);
        } else if (state.sort === 'topic') {
          var t = c.topic || 'No topic';
          add((c.topic ? '' : '~') + t.toLowerCase(), t, c);
        } else {
          var g = c.group_id ? store.group(c.group_id) : null;
          if (g) add('0' + g.name.toLowerCase(), g.name, c, g);
          else add('~', 'Not in a group', c);
        }
      });
      if (state.sort === 'group') store.groups.forEach(function (g) { var k = '0' + g.name.toLowerCase(); if (!sections[k] && !q) sections[k] = { label: g.name, items: [], extra: g }; });
      var keys = Object.keys(sections).sort();
      list.innerHTML = '';
      if (!keys.length) {
        list.innerHTML = '<div class="rai-side-empty">' + (q ? 'No chats match “' + esc(state.query) + '”.' : 'No chats yet. Ask something and it’ll appear here.') + '</div>';
      }
      keys.forEach(function (k) {
        var sec = sections[k];
        var el = h('div', { class: 'rai-sec' });
        var head = h('div', { class: 'rai-sec-head' }, (sec.extra ? '<span class="rai-dot" style="color:' + esc(sec.extra.color || '#7c3aed') + '"></span>' : '') + '<span></span>');
        head.querySelector('span:last-child').textContent = sec.label + (sec.items.length ? ' · ' + sec.items.length : '');
        if (sec.extra) {
          var gb = h('button', { type: 'button', class: 'rai-icon-btn', 'aria-label': 'Group options' }, icon('more', 14));
          gb.onclick = function (e) {
            e.stopPropagation();
            var g = sec.extra;
            menu(gb, root, [
              { label: 'New chat in this group', icon: 'plus', onClick: function () { state.groupId = g.id; newChat(); } },
              { label: 'Edit group', icon: 'edit', onClick: function () { groupDialog(g).then(function (v) { if (v) store.updateGroup(g.id, v).then(function () { renderSide(); renderCtx(); }); }); } },
              'hr',
              { label: 'Delete group (keeps chats)', icon: 'trash', danger: true, onClick: function () { store.deleteGroup(g.id).then(function () { renderSide(); renderCtx(); }); } }
            ]);
          };
          head.appendChild(gb);
        }
        el.appendChild(head);
        sec.items.forEach(function (c) {
          var row = h('button', { type: 'button', class: 'rai-row' + (state.chat && state.chat.id === c.id ? ' active' : '') });
          var kind = c.product || 'helper';
          var d = daysLeft(c.expires_at);
          var metaBits = [];
          if (state.sort !== 'unit' && c.unit) metaBits.push(esc(c.unit));
          else if (state.sort !== 'subject' && c.subject) metaBits.push(esc(c.subject));
          if (state.sort !== 'topic' && c.topic) metaBits.push(esc(clip(c.topic, 28)));
          if (!c.saved && d != null && d <= 5) metaBits.push('<span class="soon">' + d + 'd left</span>');
          row.innerHTML = '<span class="rai-row-kind ' + kind + '">' + icon(kind === 'examiner' ? 'exam' : kind === 'assigner' ? 'bulb' : 'chat', 14) + '</span>' +
            '<span class="rai-row-main"><span class="rai-row-title"></span><span class="rai-row-meta">' + (metaBits.join(' · ') || PRODUCT_NAMES[kind]) + '</span></span>' +
            (c.saved ? '<span class="rai-row-star">' + icon('starOn', 13) + '</span>' : '');
          row.querySelector('.rai-row-title').textContent = c.title;
          row.onclick = function () { openChat(c.id); };
          row.oncontextmenu = function (e) { e.preventDefault(); rowMenu(row, c); };
          row.addEventListener('keydown', function (e) { if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) { e.preventDefault(); rowMenu(row, c); } });
          var mb = h('span', { class: 'rai-icon-btn', role: 'button', tabindex: '-1', 'aria-label': 'Chat options', style: 'height:26px;min-width:26px;padding:0' }, icon('more', 14));
          mb.onclick = function (e) { e.stopPropagation(); rowMenu(mb, c); };
          row.appendChild(mb);
          el.appendChild(row);
        });
        list.appendChild(el);
      });
      var saved = store.chats.filter(function (c) { return c.saved; }).length;
      $('.rai-side-foot').innerHTML = esc(store.chats.length + ' chat' + (store.chats.length === 1 ? '' : 's') + ' · ' + saved + ' saved. Unsaved chats auto-delete 30 days after your last message.') +
        (store.isLocal ? ' <br>Stored on this device for now.' : '');
    }
    function rowMenu(anchor, c) {
      menu(anchor, root, [
        { label: 'Rename', icon: 'edit', onClick: function () { renameChat(c.id); } },
        { label: c.saved ? 'Unsave' : 'Save (keep forever)', icon: 'star', onClick: function () {
          store.updateChat(c.id, { saved: !c.saved }).then(function (u) { if (state.chat && state.chat.id === c.id) state.chat = u; renderCtx(); renderSide(); });
        } },
        { label: 'Move to group…', icon: 'folder', onClick: function () { groupMenu(anchor, c.id); } },
        'hr',
        { label: 'Delete', icon: 'trash', danger: true, onClick: function () { deleteChat(c.id); } }
      ]);
    }

    var search = $('.rai-search');
    var searchT = null;
    search.addEventListener('input', function () { clearTimeout(searchT); searchT = setTimeout(function () { state.query = search.value.trim(); renderSide(); }, 120); });
    root.querySelectorAll('.rai-sort button').forEach(function (b) {
      b.onclick = function () { state.sort = b.dataset.sort; ls('ra10_ai_sort', state.sort); renderSide(); };
    });
    $('.rai-scrim').onclick = function () { setSide(false); };

    /* Header + chip actions */
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b || !root.contains(b)) return;
      var act = b.dataset.act;
      if (act === 'side') setSide(!root.classList.contains('side-open'));
      else if (act === 'closeside') setSide(false);
      else if (act === 'new') { state.groupId = null; newChat(); }
      else if (act === 'save') toggleSave();
      else if (act === 'more') moreMenu(b);
      else if (act === 'close') { if (opts.onClose) opts.onClose(); }
      else if (act === 'topic') editTopic();
      else if (act === 'tags') editTags();
      else if (act === 'group') groupMenu(b, state.chat ? state.chat.id : null);
      else if (act === 'newgroup') newGroup();
    });

    var unsub = store.subscribe(function () { renderSide(); });
    if (window.RA10 && typeof RA10.on === 'function') {
      RA10.on('authchange', function () { store.refresh(true).then(function () { renderSide(); updateCost(); }, function () {}); });
      RA10.on('creditschange', updateCost);
    }

    setMode(state.mode);
    renderWelcome();
    renderCtx();
    renderSide();
    store.refresh().then(function () { renderSide(); renderCtx(); }, function () {});

    var api = {
      el: root,
      get chat() { return state.chat; },
      newChat: newChat,
      openChat: function (id) { return store.refresh().then(function () { return openChat(id); }); },
      setMode: setMode,
      attach: function (text, label) { state.attach = text ? { text: clip(text, 1200), label: label || 'Selected text' } : null; renderAttach(); },
      prefill: function (text) { input.value = text || ''; autosize(); input.focus(); },
      say: function (markdown) { if (!state.messages.length) msgsEl.innerHTML = ''; msgsEl.appendChild(botNode(markdown)); markLast(); scrollDown(true); },
      focus: function () { input.focus(); },
      setActive: function (on) { stage.setEnabled(on); if (on) { store.refresh().then(function () { renderSide(); renderCtx(); }, function () {}); updateCost(); } },
      refreshContext: function () { if (!state.chat) { state.meta = detectContext(opts.meta); renderCtx(); } },
      destroy: function () { unsub(); stage.destroy(); root.remove(); }
    };
    return api;
  }

  /* ── File text extraction (examiner uploads) ────────────────────────── */
  function extractText(file, ext) {
    if (ext === 'pdf') {
      var lib = window.pdfjsLib;
      if (!lib || !lib.getDocument) return Promise.reject(new Error('PDF reader not loaded — try pasting the text instead.'));
      try { lib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'; } catch (e) {}
      return file.arrayBuffer().then(function (buf) { return lib.getDocument({ data: buf }).promise; }).then(function (pdf) {
        var pages = [];
        var chain = Promise.resolve();
        for (var i = 1; i <= pdf.numPages; i++) {
          (function (n) {
            chain = chain.then(function () { return pdf.getPage(n); }).then(function (p) { return p.getTextContent(); }).then(function (c) {
              pages.push(c.items.map(function (it) { return (it && it.str) || ''; }).join(' '));
            });
          })(i);
        }
        return chain.then(function () { return pages.join('\n\n'); });
      });
    }
    if (ext === 'docx') {
      var m = window.mammoth;
      if (!m || !m.extractRawText) return Promise.reject(new Error('Word reader not loaded — try pasting the text instead.'));
      return file.arrayBuffer().then(function (buf) { return m.extractRawText({ arrayBuffer: buf }); }).then(function (r) { return r && r.value ? r.value : ''; });
    }
    return file.text();
  }

  /* ── AI Examiner result card ────────────────────────────────────────── */
  function band(pct) {
    if (pct >= 0.85) return { label: 'Excellent answer', color: '#16a34a' };
    if (pct >= 0.65) return { label: 'Strong answer', color: '#0ea5a4' };
    if (pct >= 0.4) return { label: 'Getting there', color: '#e0a100' };
    return { label: 'Needs more work', color: '#e5484d' };
  }
  function listOf(v) { return Array.isArray(v) ? v.map(function (x) { return String(x || '').trim(); }).filter(Boolean) : []; }

  function examMarkdown(qText, r) {
    var out = ['**AI Examiner: ' + r.earned + '/' + r.max + '**' + (r.level ? ' · Level ' + r.level : '')];
    if (qText) out.push('Question: ' + clip(qText, 300));
    if (r.feedback) out.push(r.feedback);
    if (r.strengths.length) out.push('**What you did well**\n' + r.strengths.map(function (s) { return '- ' + s; }).join('\n'));
    if (r.improvements.length) out.push('**How to improve**\n' + r.improvements.map(function (s) { return '- ' + s; }).join('\n'));
    if (r.nextLevel.length) out.push('**To reach the next level**\n' + r.nextLevel.map(function (s) { return '- ' + s; }).join('\n'));
    return out.join('\n\n');
  }

  function normaliseExam(raw, q) {
    raw = raw || {};
    var max = Math.max(1, Math.round(Number(raw.max) || Number(q && q.marks) || 1));
    var earned = Math.max(0, Math.min(max, Math.round(Number(raw.earned) || 0)));
    var strengths = listOf(raw.strengths), improvements = listOf(raw.improvements);
    if (!strengths.length && Array.isArray(raw.lines)) strengths = raw.lines.filter(function (l) { return l && l.hit; }).map(function (l) { return String(l.label || ''); }).filter(Boolean);
    if (!improvements.length && Array.isArray(raw.lines)) improvements = raw.lines.filter(function (l) { return l && !l.hit; }).map(function (l) { return String(l.label || ''); }).filter(Boolean);
    return {
      earned: earned, max: max,
      strengths: strengths.slice(0, 5),
      improvements: improvements.slice(0, 5),
      feedback: String(raw.examiner_comment || raw.feedback || '').trim(),
      level: Number(raw.level) > 0 ? Math.round(Number(raw.level)) : 0,
      levelMarks: String(raw.level_marks || raw.levelMarks || '').trim(),
      nextLevel: listOf(raw.next_level).slice(0, 4),
      ao: raw.ao_feedback && typeof raw.ao_feedback === 'object' ? raw.ao_feedback : null,
      calc: String(raw.calculation_check || '').trim()
    };
  }

  /* opts: { question (object or string), answer, result (raw ai-mark result),
             markScheme: () => Node, allowAdjust (default true), unitKey, topic,
             save (default true), criteria: [{code, met, comment}] } */
  function renderExamResult(opts) {
    opts = opts || {};
    var q = typeof opts.question === 'string' ? { question: opts.question } : (opts.question || {});
    var qText = String(q.question || q.text || '').trim();
    var r = normaliseExam(opts.result, q);
    var pct = r.earned / r.max;
    var b = band(pct);
    var C = 2 * Math.PI * 34;

    var card = h('div', { class: 'rai-exam' + (opts.inChat ? ' in-chat' : ''), style: '--rai-band:' + b.color });
    var tags = [];
    if (q.marks || r.max) tags.push(r.max + ' mark' + (r.max === 1 ? '' : 's'));
    if (r.level) tags.push('Level ' + r.level + (r.levelMarks ? ' (' + r.levelMarks + ')' : ''));
    if (q.command_verb) tags.push(q.command_verb);
    card.innerHTML =
      '<div class="rai-exam-hero">' +
        '<div class="rai-ring" role="img" aria-label="Score ' + r.earned + ' out of ' + r.max + '">' +
          '<svg viewBox="0 0 80 80" aria-hidden="true"><circle class="track" cx="40" cy="40" r="34" fill="none" stroke-width="7"/><circle class="bar" cx="40" cy="40" r="34" fill="none" stroke-width="7" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '"/></svg>' +
          '<span class="automark-score"><span class="value">' + r.earned + '</span><span class="total">/' + r.max + '</span></span>' +
        '</div>' +
        '<div class="rai-exam-head">' +
          '<span class="rai-eyebrow">' + icon('logo', 12) + 'AI Examiner</span>' +
          '<div class="rai-band"></div>' +
          (r.feedback ? '<p class="rai-exam-summary"></p>' : '') +
          (tags.length ? '<div class="rai-exam-tags">' + tags.map(function (t) { return '<span class="rai-tag">' + esc(t) + '</span>'; }).join('') + '</div>' : '') +
        '</div>' +
        (opts.allowAdjust === false ? '' : '<div class="rai-adjust" aria-label="Adjust mark"><button type="button" data-d="1" aria-label="Add a mark">+</button><button type="button" data-d="-1" aria-label="Remove a mark">−</button></div>') +
      '</div>';
    card.querySelector('.rai-band').textContent = b.label;
    if (r.feedback) card.querySelector('.rai-exam-summary').textContent = r.feedback;

    var grid = h('div', { class: 'rai-exam-grid' });
    function fb(cls, title, ic, items, wide) {
      if (!items.length) return;
      var sec = h('section', { class: 'rai-fb ' + cls + (wide ? ' wide' : '') }, '<h4>' + icon(ic, 14) + esc(title) + '</h4><ul></ul>');
      var ul = sec.querySelector('ul');
      items.forEach(function (t) { ul.appendChild(h('li', null, mathText(t))); });
      grid.appendChild(sec);
    }
    fb('good', 'What you did well', 'check', r.strengths.length ? r.strengths : ['You attempted the question with some relevant points.']);
    fb('improve', 'How to improve', 'arrow', r.improvements.length ? r.improvements : ['Add one more developed point to push for full marks.']);
    if (r.nextLevel.length) fb('next', 'To reach the next level', 'flag', r.nextLevel, true);
    if (r.ao) {
      var aoSec = h('section', { class: 'rai-fb next wide' }, '<h4>' + icon('exam', 14) + 'Assessment objectives</h4><div class="rai-ao"></div>');
      Object.keys(r.ao).slice(0, 6).forEach(function (k) {
        var row = h('div', { class: 'rai-ao-row' }, '<b></b><span></span>');
        row.querySelector('b').textContent = k.toUpperCase();
        row.querySelector('span').textContent = String(r.ao[k]);
        aoSec.querySelector('.rai-ao').appendChild(row);
      });
      grid.appendChild(aoSec);
    }
    if (r.calc) fb('next', 'Calculation check', 'check', [r.calc], true);
    card.appendChild(grid);

    if (Array.isArray(opts.criteria) && opts.criteria.length) {
      var crit = h('div', { class: 'rai-crit' });
      opts.criteria.forEach(function (c) {
        var row = h('div', { class: 'rai-crit-row' + (c.met ? ' met' : '') }, '<i>' + (c.met ? '✓' : '✕') + '</i><span><b></b> — <span></span></span>');
        row.querySelector('b').textContent = c.code;
        row.querySelector('span span').textContent = c.comment || (c.met ? 'Met' : 'Not yet met');
        crit.appendChild(row);
      });
      card.appendChild(crit);
    }

    var actions = h('div', { class: 'rai-exam-actions' });
    var discuss = h('button', { type: 'button', class: 'rai-btn primary sm' }, icon('chat', 14) + 'Discuss with AI');
    actions.appendChild(discuss);
    var copyBtn = h('button', { type: 'button', class: 'rai-btn sm' }, icon('copy', 14) + 'Copy feedback');
    copyBtn.onclick = function () { try { navigator.clipboard.writeText(examMarkdown(qText, r).replace(/\*\*/g, '')); } catch (e) {} toast('Feedback copied'); };
    actions.appendChild(copyBtn);
    var msHolder = null;
    if (typeof opts.markScheme === 'function') {
      var msBtn = h('button', { type: 'button', class: 'rai-btn ghost sm', 'aria-expanded': 'false' }, 'Show mark scheme');
      msHolder = h('div', { class: 'rai-exam-ms', hidden: true });
      msBtn.onclick = function () {
        if (!msHolder.firstChild) { try { var n = opts.markScheme(); if (n) msHolder.appendChild(n); } catch (e) {} }
        msHolder.hidden = !msHolder.hidden;
        msBtn.setAttribute('aria-expanded', String(!msHolder.hidden));
        msBtn.textContent = msHolder.hidden ? 'Show mark scheme' : 'Hide mark scheme';
      };
      actions.appendChild(msBtn);
    }
    card.appendChild(actions);
    if (msHolder) card.appendChild(msHolder);

    var foot = h('div', { class: 'rai-exam-foot' });
    card.appendChild(foot);

    // Score ring animates in; +/- adjusts the displayed mark.
    var bar = card.querySelector('.bar');
    function setRing(v) {
      var p = Math.max(0, Math.min(1, v / r.max));
      bar.style.strokeDashoffset = (C * (1 - p)).toFixed(1);
      var nb = band(p);
      card.style.setProperty('--rai-band', nb.color);
      card.querySelector('.rai-band').textContent = nb.label;
    }
    requestAnimationFrame(function () { requestAnimationFrame(function () { setRing(r.earned); }); });
    card.querySelectorAll('.rai-adjust button').forEach(function (btn) {
      btn.onclick = function () {
        var el = card.querySelector('.value');
        var v = Math.max(0, Math.min(r.max, parseInt(el.textContent, 10) + Number(btn.dataset.d)));
        el.textContent = String(v);
        setRing(v);
      };
    });

    // Save to history (text only) so it can be revisited and discussed.
    var record = null;
    var mdText = examMarkdown(qText, r);
    function recordIt() {
      if (record) return record;
      if (opts.save === false || !loggedIn()) return Promise.resolve(null);
      var meta = detectContext({ topic: opts.topic || q.topic || (q.learning_aim ? 'Aim ' + q.learning_aim : null) || detectTopic() });
      if (opts.unitKey) meta.unit_key = opts.unitKey;
      var userText = 'Question' + (r.max ? ' (' + r.max + ' marks)' : '') + ':\n' + clip(qText, 1500) +
        (q.scenario ? '\n\nScenario: ' + clip(q.scenario, 800) : '') +
        '\n\nMy answer:\n' + String(opts.answer || '').slice(0, 5000);
      record = store.createChat({
        product: 'examiner',
        title: 'Exam · ' + (clip(qText, 60) || 'answer feedback'),
        subject: meta.subject, qualification: meta.qualification, unit: meta.unit, topic: meta.topic,
        unit_key: meta.unit_key, page_path: meta.page_path
      }).then(function (c) {
        return store.addMessages(c.id, [{ role: 'user', content: userText }, { role: 'assistant', content: mdText }]).then(function () {
          return store.updateChat(c.id, { digest: nextDigest('', 'Exam question: ' + qText, 'Scored ' + r.earned + '/' + r.max + '. ' + r.improvements.join('; ')) });
        });
      }).catch(function (e) { if (window.console) console.warn('RA10 AI: could not save examiner result', e); return null; });
      return record;
    }
    function renderFoot(c) {
      if (!c) { foot.innerHTML = loggedIn() ? '' : 'Sign in to keep a history of your feedback.'; if (!foot.innerHTML) foot.remove(); return; }
      foot.innerHTML = c.saved
        ? icon('starOn', 13) + '<span>Saved to your AI history.</span>'
        : '<span>Saved to your AI history · auto-deletes in ' + RETENTION_DAYS + ' days.</span><button type="button">Keep it</button>';
      var keep = foot.querySelector('button');
      if (keep) keep.onclick = function () { store.updateChat(c.id, { saved: true }).then(renderFoot); };
    }
    if (opts.save !== false && loggedIn()) recordIt().then(renderFoot); else renderFoot(null);

    discuss.onclick = function () {
      Promise.resolve(recordIt()).then(function (c) {
        var p = openPanel({ chatId: c && c.id });
        if (!c) p.then(function (chat) { chat.attach('Question: ' + qText + '\nMy answer: ' + clip(opts.answer, 600) + '\nFeedback: ' + clip(mdText, 600), 'Your marked answer'); chat.prefill('How can I improve this answer?'); });
        else p.then(function (chat) { chat.prefill('How can I turn this into a full-mark answer?'); });
      });
    };
    return card;
  }

  /* Assignment marking (AI Assigner → Examiner mode): grade-based card.
     r = markAssignment().result: {grade, criteriaMet[], strengths[],
     improvements[], nextGradeFocus, feedback}. Returns {element, markdown}. */
  var GRADE_COLORS = { distinction: '#7c3aed', merit: '#0ea5a4', pass: '#16a34a' };
  function renderAssignmentResult(r) {
    r = r || {};
    var grade = String(r.grade || 'Not yet met');
    var color = GRADE_COLORS[grade.toLowerCase()] || '#e5484d';
    var strengths = listOf(r.strengths), improvements = listOf(r.improvements);
    var crit = Array.isArray(r.criteriaMet) ? r.criteriaMet.filter(function (c) { return c && c.code; }) : [];
    var card = h('div', { class: 'rai-exam in-chat', style: '--rai-band:' + color });
    card.innerHTML =
      '<div class="rai-exam-hero">' +
        '<div class="rai-grade"></div>' +
        '<div class="rai-exam-head"><span class="rai-eyebrow">' + icon('exam', 12) + 'AI Assigner · predicted grade</span>' +
        '<div class="rai-band"></div>' + (r.feedback ? '<p class="rai-exam-summary"></p>' : '') +
        (crit.length ? '<div class="rai-exam-tags"><span class="rai-tag">' + crit.filter(function (c) { return c.met; }).length + ' of ' + crit.length + ' criteria met</span></div>' : '') +
        '</div>' +
      '</div>';
    card.querySelector('.rai-grade').textContent = grade.charAt(0).toUpperCase();
    card.querySelector('.rai-band').textContent = grade;
    if (r.feedback) card.querySelector('.rai-exam-summary').textContent = r.feedback;
    if (crit.length) {
      var list = h('div', { class: 'rai-crit' });
      crit.forEach(function (c) {
        var row = h('div', { class: 'rai-crit-row' + (c.met ? ' met' : '') }, '<i>' + (c.met ? '✓' : '✕') + '</i><span><b></b> — <span></span></span>');
        row.querySelector('b').textContent = c.code;
        row.querySelector('span span').textContent = c.comment || (c.met ? 'Met' : 'Not yet met');
        list.appendChild(row);
      });
      card.appendChild(list);
    }
    var grid = h('div', { class: 'rai-exam-grid' });
    function fb(cls, title, ic, items, wide) {
      if (!items.length) return;
      var sec = h('section', { class: 'rai-fb ' + cls + (wide ? ' wide' : '') }, '<h4>' + icon(ic, 14) + esc(title) + '</h4><ul></ul>');
      items.forEach(function (t) { sec.querySelector('ul').appendChild(h('li', { text: t })); });
      grid.appendChild(sec);
    }
    fb('good', 'Strengths', 'check', strengths);
    fb('improve', 'To reach the next grade', 'arrow', improvements);
    if (r.nextGradeFocus) fb('next', 'Focus next', 'flag', [String(r.nextGradeFocus)], true);
    if (grid.childNodes.length) card.appendChild(grid);

    var lines = ['**Predicted grade: ' + grade + '**'];
    if (r.feedback) lines.push(String(r.feedback));
    if (crit.length) lines.push(crit.map(function (c) { return '- [' + (c.met ? 'x' : ' ') + '] **' + c.code + '** — ' + (c.comment || (c.met ? 'Met' : 'Not yet met')); }).join('\n'));
    if (strengths.length) lines.push('**Strengths**\n' + strengths.map(function (x) { return '- ' + x; }).join('\n'));
    if (improvements.length) lines.push('**To reach the next grade**\n' + improvements.map(function (x) { return '- ' + x; }).join('\n'));
    if (r.nextGradeFocus) lines.push('**Focus next:** ' + r.nextGradeFocus);
    return { element: card, markdown: lines.join('\n\n') };
  }

  /* ── Floating panel (AI Helper) ─────────────────────────────────────── */
  var panel = null, panelChat = null, fab = null;
  function helperSuggestions() {
    var topic = detectTopic();
    return [
      { kicker: 'Summarise', label: 'Summarise this topic in a few bullet points', prompt: 'Summarise this topic in a few bullet points' },
      { kicker: 'Explain', label: 'Give me a simple real-world example', prompt: 'Give me a simple real-world example of this' },
      { kicker: 'Revise', label: 'What key terms do I need to know?', prompt: 'What are the key terms I need to remember for ' + (topic || 'this topic') + '?' },
      { kicker: 'Test me', label: 'Quiz me with a quick exam-style question', prompt: 'Test me with one quick exam-style question on this, then wait for my answer' }
    ];
  }
  function pageContext() {
    var parts = [];
    var title = (document.title || '').replace(/\s*[—|-]\s*RA10.*$/i, '').trim();
    if (title) parts.push('Page: ' + title);
    var h2s = Array.prototype.slice.call(document.querySelectorAll('.view.active h2, .view.active h3, main h2')).slice(0, 4).map(function (x) { return x.textContent.trim(); }).filter(Boolean);
    if (h2s.length) parts.push('Sections on screen: ' + h2s.join(' | '));
    return parts.join('\n').slice(0, 1000);
  }

  // A page can swap the default AI Helper for its own tool (e.g. Units 3/4
  // make the floating button the AI Assigner) via RA10AI.configure().
  var pageProfile = null;
  function configure(profile) {
    pageProfile = profile || null;
    if (fab && pageProfile) fab.setAttribute('aria-label', 'Open ' + (pageProfile.title || 'AI'));
  }

  function ensurePanel() {
    if (panel) return panel;
    var profile = pageProfile || {};
    panel = h('div', { class: 'rai-panel rai-layer', role: 'dialog', 'aria-label': 'RA10 ' + (profile.title || 'AI Helper'), 'aria-modal': 'false' });
    document.body.appendChild(panel);
    panelChat = mountChat(panel, Object.assign({
      product: 'helper',
      title: 'AI Helper',
      suggestions: helperSuggestions(),
      welcomeTitle: 'What shall we <em>revise</em>?',
      welcomeText: 'Ask about this page, or select any text and tap “Ask AI”. Chats are saved to your account and sorted by subject, unit and topic.',
      context: pageContext
    }, profile, {
      variant: 'panel',
      onClose: closePanel,
      onExpand: function () { panel.classList.toggle('wide'); panelChat.el.classList.toggle('compact', !panel.classList.contains('wide')); }
    }));
    panelChat.setActive(false);
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !openMenuEl && !document.querySelector('.rai-dialog')) closePanel(); });
    return panel;
  }
  function openPanel(o) {
    o = o || {};
    ensurePanel();
    panel.classList.add('open');
    if (fab) fab.classList.add('hidden');
    panelChat.setActive(true);
    var p = o.chatId ? panelChat.openChat(o.chatId) : Promise.resolve();
    return p.then(function () {
      if (o.newChat && !o.chatId) panelChat.newChat(true);
      if (o.attach) panelChat.attach(o.attach.text, o.attach.label);
      if (o.prompt) panelChat.prefill(o.prompt); else panelChat.focus();
      return panelChat;
    });
  }
  function closePanel() {
    if (!panel) return;
    panel.classList.remove('open');
    panelChat.setActive(false);
    if (fab) { fab.classList.remove('hidden'); fab.focus(); }
  }

  function installHelper() {
    if (fab) return;
    fab = h('button', { type: 'button', class: 'rai-fab rai-layer', 'aria-label': 'Open AI Helper', title: 'AI Helper' }, icon('logo', 26) + '<span class="rai-fab-dot"></span>');
    fab.onclick = function () { panelChat && panelChat.refreshContext(); openPanel(); };
    document.body.appendChild(fab);

    // "Ask AI" pop-up for selected text.
    var pop = h('button', { type: 'button', class: 'rai-pop rai-layer' }, icon('logo', 14) + '<span>Ask AI</span>');
    document.body.appendChild(pop);
    var selected = '';
    function hidePop() { pop.classList.remove('show'); }
    document.addEventListener('mouseup', function (e) {
      if (e.target.closest && e.target.closest('.rai-panel, .rai-pop, .rai-fab, .rai-dialog, input, textarea, [contenteditable="true"]')) return;
      setTimeout(function () {
        var sel = window.getSelection();
        var text = sel && !sel.isCollapsed ? sel.toString().trim() : '';
        if (text.length < 2 || text.length > 1500) { hidePop(); return; }
        var rect = sel.getRangeAt(0).getBoundingClientRect();
        if (!rect || (!rect.width && !rect.height)) { hidePop(); return; }
        selected = text;
        pop.classList.add('show');
        var pw = pop.offsetWidth || 92, ph = pop.offsetHeight || 34;
        var top = rect.top - ph - 8;
        if (top < 8) top = rect.bottom + 8;
        pop.style.top = top + 'px';
        pop.style.left = Math.max(8, Math.min(rect.left + rect.width / 2 - pw / 2, window.innerWidth - pw - 8)) + 'px';
      }, 10);
    });
    document.addEventListener('mousedown', function (e) { if (!e.target.closest || !e.target.closest('.rai-pop')) hidePop(); });
    window.addEventListener('scroll', hidePop, { passive: true });
    pop.onclick = function () {
      var t = selected;
      hidePop();
      try { window.getSelection().removeAllRanges(); } catch (e) {}
      openPanel({ attach: { text: t, label: 'Selected text' }, prompt: 'Explain this to me' });
    };

    // One-time tip under the top bar.
    if (ls('ra10_ai_hint_dismissed') !== '1') {
      var tip = h('div', { class: 'rai-tip rai-glass' }, orb('sm', 13) + '<span><b>Tip:</b> select any text and tap <b>Ask AI</b> for an instant explanation. Your chats are saved and sorted by unit and topic.</span><button type="button" class="rai-icon-btn" aria-label="Dismiss tip">' + icon('close', 16) + '</button>');
      tip.querySelector('button').onclick = function () { ls('ra10_ai_hint_dismissed', '1'); tip.remove(); };
      var topbar = document.querySelector('header.topbar, .nav, .navbar, .mobile-top-nav');
      if (topbar && topbar.parentNode) topbar.parentNode.insertBefore(tip, topbar.nextSibling);
      else document.body.insertBefore(tip, document.body.firstChild);
    }
  }

  window.RA10AI = {
    version: VERSION,
    mountChat: mountChat,
    openPanel: openPanel,
    closePanel: closePanel,
    installHelper: installHelper,
    configure: configure,
    renderExamResult: renderExamResult,
    renderAssignmentResult: renderAssignmentResult,
    examMarkdown: function (q, raw) { return examMarkdown(q, normaliseExam(raw)); },
    confirmCredits: confirmCredits,
    examinerCost: examinerCost,
    transcribeCost: function () { return tiered({ free: 2, school: 1, pro: 1, ultra: 0, subject: 1 }); },
    renderMath: renderMath,
    mathText: mathText,
    loadKatex: loadKatex,
    hintCost: hintCost,
    markCost: markCost,
    detectContext: detectContext,
    md: md,
    toast: toast,
    store: store
  };
  try { document.dispatchEvent(new CustomEvent('ra10ai:ready')); } catch (e) {}
})();
