/* AI Assigner — ChatGPT / Perplexity-style client.
   Modes: Chat, Hints, Examiner. Animated globe logo, status preview
   messages while generating ("Connecting with RA10 AI", "Reviewing
   work"...), and a + button for upload / new chat. */
(function () {
  'use strict';

  var mode = 'chat';
  var chatHistory = [];
  var busy = false;
  var statusTimer = null;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function icon(cp) { return String.fromCodePoint(cp); }
  // Robot-head AI logo (distinct from Gemini's sparkle).
  function aiLogoSvg(size) {
    var s = size || 24;
    return '<svg class="ai-logo-svg" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="4" y="7" width="16" height="12" rx="3"/>' +
      '<path d="M12 7V4"/><circle cx="12" cy="3" r="1"/>' +
      '<circle cx="9" cy="13" r="1.4" fill="currentColor" stroke="none"/>' +
      '<circle cx="15" cy="13" r="1.4" fill="currentColor" stroke="none"/>' +
      '<path d="M9 17h6"/>' +
      '<path d="M2 11v4M22 11v4"/>' +
      '</svg>';
  }
  // CPU / chip icon for the mode selector button.
  function cpuSvg(size) {
    var s = size || 20;
    return '<svg class="ai-cpu-svg" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="6" y="6" width="12" height="12" rx="2"/>' +
      '<rect x="10" y="10" width="4" height="4"/>' +
      '<path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>' +
      '</svg>';
  }
  // Plus icon for the + button.
  function plusSvg(size) {
    var s = size || 20;
    return '<svg class="ai-plus-svg" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  }
  // Upload document icon.
  function uploadSvg(size) {
    var s = size || 18;
    return '<svg class="ai-ico-svg" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4M8 8l4-4 4 4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>';
  }
  // New chat icon (chat bubble with +).
  function newchatSvg(size) {
    var s = size || 18;
    return '<svg class="ai-ico-svg" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 1V11.5A8.5 8.5 0 0 1 11.5 3h1A8.5 8.5 0 0 1 21 11.5z"/><path d="M12 8v6M9 11h6"/></svg>';
  }
  // Chat bubble icon.
  function chatSvg(size) {
    var s = size || 18;
    return '<svg class="ai-ico-svg" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 1V11.5A8.5 8.5 0 0 1 11.5 3h1A8.5 8.5 0 0 1 21 11.5z"/></svg>';
  }
  // Lightbulb (hints) icon.
  function hintsSvg(size) {
    var s = size || 18;
    return '<svg class="ai-ico-svg" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.5 1 2.5h6c0-1 .4-1.9 1-2.5A6 6 0 0 0 12 3z"/></svg>';
  }
  // Examiner (clipboard with check) icon.
  function examinerSvg(size) {
    var s = size || 18;
    return '<svg class="ai-ico-svg" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/><path d="M9 13l2 2 4-4"/></svg>';
  }
  // Hand-drawn style arrow pointing down at the mode button.
  function modeHintArrowSvg(size) {
    var s = size || 26;
    return '<svg class="ai-mode-hint-arrow-svg" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M5 4c6 1 10 5 12 12"/>' +
      '<path d="M13 12l4 4 1-6"/>' +
      '</svg>';
  }

  // Credit cost per tier (mirrors the SDK's _tierCost).
  function actionCost(action) {
    var tier = (window.RA10 && typeof RA10.getTier === 'function') ? RA10.getTier() : 'free';
    var isUltra = tier === 'ultra' || tier === 'owner';
    var isPro = tier === 'all_subjects';
    var isSchool = tier === 'school_student' || tier === 'school_teacher' || tier === 'school_admin';
    var map = action === 'ai_assigner_mark'
      ? { free: 8, school: 3, pro: 2, ultra: 0, subject: 5 }
      : { free: 3, school: 1, pro: 1, ultra: 0, subject: 2 };
    if (isUltra) return map.ultra;
    if (isPro) return map.pro;
    if (isSchool) return map.school;
    if (tier === 'subject') return map.subject != null ? map.subject : map.free;
    return map.free;
  }

  // Confirmation modal before spending credits. Resolves true/false.
  function confirmCredit(action, label) {
    return new Promise(function (resolve) {
      var cost = actionCost(action);
      if (cost <= 0) { resolve(true); return; }
      var host = document.getElementById('ai-assigner-panel');
      if (!host) { resolve(true); return; }
      var overlay = document.createElement('div');
      overlay.className = 'ai-confirm-overlay';
      overlay.innerHTML =
        '<div class="ai-confirm-card" role="dialog" aria-modal="true" aria-label="Confirm credit use">' +
          '<div class="ai-confirm-ico">' + cpuSvg(22) + '</div>' +
          '<h3>Use ' + cost + ' credit' + (cost === 1 ? '' : 's') + '?</h3>' +
          '<p>' + esc(label) + ' This will use <b>' + cost + ' credit' + (cost === 1 ? '' : 's') + '</b> from your balance.</p>' +
          '<div class="ai-confirm-actions">' +
            '<button class="ai-confirm-cancel" type="button">Cancel</button>' +
            '<button class="ai-confirm-ok" type="button">Use ' + cost + ' credit' + (cost === 1 ? '' : 's') + '</button>' +
          '</div>' +
        '</div>';
      host.appendChild(overlay);
      function close(val) { overlay.remove(); resolve(val); }
      overlay.querySelector('.ai-confirm-cancel').addEventListener('click', function () { close(false); });
      overlay.querySelector('.ai-confirm-ok').addEventListener('click', function () { close(true); });
      overlay.addEventListener('click', function (e) { if (e.target === overlay) close(false); });
      document.addEventListener('keydown', function escKey(e) {
        if (e.key === 'Escape') { document.removeEventListener('keydown', escKey); close(false); }
      });
    });
  }

  var STATUSES = [
    'Connecting with RA10 AI',
    'Reading the specification',
    'Reviewing your work',
    'Checking the criteria',
    'Thinking it through',
    'Writing your response'
  ];

  /* Markdown renderer — code blocks, tables, task lists, headings, quotes */
  function md(s) {
    var raw = String(s == null ? '' : s).replace(/\r\n/g, '\n');
    var codeBlocks = [];
    raw = raw.replace(/```([a-zA-Z0-9+#-]*)[ \t]*\n?([\s\S]*?)```/g, function (_, lang, code) {
      codeBlocks.push({ lang: lang || '', code: code.replace(/\n+$/, '') });
      return '\u0000B' + (codeBlocks.length - 1) + '\u0000';
    });

    function inline(t) {
      t = esc(t);
      t = t.replace(/`([^`\n]+)`/g, '<code>$1</code>');
      t = t.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
      t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      t = t.replace(/__([^_]+)__/g, '<strong>$1</strong>');
      t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, tx, u) {
        return /^(javascript|data|vbscript):/i.test(u) ? _ : '<a href="' + u + '" target="_blank" rel="noopener">' + tx + '</a>';
      });
      return t;
    }

    function isSepRow(r) {
      var cells = r.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(function (c) { return c.trim(); });
      return cells.length > 0 && cells.every(function (c) { return /^:?-{2,}:?$/.test(c); });
    }

    function renderTable(rows) {
      var html = '<div class="ai-table-wrap"><table>';
      rows.forEach(function (r, i) {
        if (isSepRow(r)) return;
        var cells = r.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(function (c) { return c.trim(); });
        var tag = i === 0 ? 'th' : 'td';
        html += '<tr>' + cells.map(function (c) { return '<' + tag + '>' + inline(c) + '</' + tag + '>'; }).join('') + '</tr>';
      });
      return html + '</table></div>';
    }

    function renderTask(line) {
      var m = /^\s*[-*+]\s+\[([ xX])\]\s+([\s\S]*)$/.exec(line);
      if (!m) return '<li>' + inline(line.replace(/^\s*[-*+]\s+/, '')) + '</li>';
      var checked = m[1].toLowerCase() === 'x';
      return '<li class="ai-task">' +
        '<span class="ai-check' + (checked ? ' checked' : '') + '"></span>' +
        '<span>' + inline(m[2]) + '</span></li>';
    }

    function startsTableAt(idx) {
      return !!(lines[idx] && /\|/.test(lines[idx]) && idx + 1 < lines.length && /\|/.test(lines[idx + 1]) && isSepRow(lines[idx + 1]));
    }

    var lines = raw.split('\n');
    var out = [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (!line.trim()) continue;

      if (/^\u0000B\d+\u0000$/.test(line.trim())) { out.push(line.trim()); continue; }

      if (/\|/.test(line) && startsTableAt(i)) {
        var tbl = [line, lines[i + 1]];
        i += 2;
        while (i < lines.length && /\|/.test(lines[i]) && lines[i].trim()) { tbl.push(lines[i]); i++; }
        i--;
        out.push(renderTable(tbl));
        continue;
      }

      if (/^\s*[-*+]\s+\[[ xX]\]\s/.test(line)) {
        var tasks = [];
        while (i < lines.length && /^\s*[-*+]\s+\[[ xX]\]\s/.test(lines[i])) { tasks.push(lines[i]); i++; }
        i--;
        out.push('<ul class="ai-tasks">' + tasks.map(renderTask).join('') + '</ul>');
        continue;
      }

      if (/^\s*[-*+]\s+/.test(line)) {
        var items = [];
        while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) { items.push(lines[i]); i++; }
        i--;
        out.push('<ul>' + items.map(function (it) { return '<li>' + inline(it.replace(/^\s*[-*+]\s+/, '')) + '</li>'; }).join('') + '</ul>');
        continue;
      }

      if (/^\s*\d+\.\s+/.test(line)) {
        var oitems = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { oitems.push(lines[i]); i++; }
        i--;
        out.push('<ol>' + oitems.map(function (it) { return '<li>' + inline(it.replace(/^\s*\d+\.\s+/, '')) + '</li>'; }).join('') + '</ol>');
        continue;
      }

      if (/^####\s+/.test(line)) { out.push('<h4>' + inline(line.replace(/^####\s+/, '')) + '</h4>'); continue; }
      if (/^###\s+/.test(line)) { out.push('<h3>' + inline(line.replace(/^###\s+/, '')) + '</h3>'); continue; }
      if (/^##\s+/.test(line)) { out.push('<h2>' + inline(line.replace(/^##\s+/, '')) + '</h2>'); continue; }
      if (/^#\s+/.test(line)) { out.push('<h1>' + inline(line.replace(/^#\s+/, '')) + '</h1>'); continue; }

      if (/^\s*>/.test(line)) {
        var q = [];
        while (i < lines.length && /^\s*>/.test(lines[i])) { q.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
        i--;
        out.push('<blockquote>' + q.map(inline).join('<br>') + '</blockquote>');
        continue;
      }

      var para = [line];
      while (i + 1 < lines.length && lines[i + 1].trim() &&
             !/^\s*[-*+]\s+/.test(lines[i + 1]) &&
             !/^\s*\d+\.\s+/.test(lines[i + 1]) &&
             !/^#+\s+/.test(lines[i + 1]) &&
             !/^\s*>/.test(lines[i + 1]) &&
             !startsTableAt(i + 1)) {
        i++;
        para.push(lines[i]);
      }
      out.push('<p>' + inline(para.join(' ')) + '</p>');
    }

    var html = out.join('\n');
    html = html.replace(/\u0000B(\d+)\u0000/g, function (_m, idx) {
      var b = codeBlocks[+idx] || { lang: '', code: '' };
      var lang = b.lang ? '<span class="ai-code-lang">' + esc(b.lang) + '</span>' : '';
      return '<pre>' + lang + '<code>' + esc(b.code) + '</code></pre>';
    });
    return html;
  }

  function render() {
    var host = document.getElementById('ai-assigner-panel');
    if (!host) return;
    host.innerHTML =
      '<div class="ai-client">' +
      // Header with robot AI logo
      '<header class="ai-head">' +
        '<div class="ai-head-brand"><span class="ai-logo">' + aiLogoSvg(24) + '</span><span class="ai-brand-name">AI Assigner</span></div>' +
        '<button class="ai-newchat" id="ai-newchat" title="Start a new chat">' + newchatSvg(16) + ' New chat</button>' +
      '</header>' +
      '<div class="ai-msgs" id="ai-msgs"></div>' +
      '<div class="ai-suggestions hidden" id="ai-suggestions"></div>' +
      '<div class="ai-composer">' +
        '<div class="ai-examiner hidden" id="ai-examiner">' +
          '<div class="ai-examiner-row">' +
            '<div class="ai-upload-zone" id="ai-upload-zone" tabindex="0">' +
              '<input type="file" id="ai-file-input" accept=".pdf,.docx,.doc,.txt,.md,.rtf" hidden>' +
              '<div class="ai-upload-inner"><span class="ai-upload-ico">' + icon(0x1F4E4) + '</span><b>Upload your work</b><small>PDF, Word (.docx), text or markdown \u00B7 up to 4 MB</small></div>' +
            '</div>' +
            '<div class="ai-examiner-txt"><textarea id="ai-examiner-text" placeholder="Or paste your assignment evidence here (research, sitemap annotations, test plans, reflections...)."></textarea></div>' +
          '</div>' +
          '<div class="ai-file-chip hidden" id="ai-file-chip"><span id="ai-file-name"></span><button type="button" id="ai-file-remove" aria-label="Remove">\u2715</button></div>' +
          '<div class="ai-examiner-actions"><button class="btn primary" id="ai-mark-btn">Examine my work<span class="ra10-cost-label">8 credits</span></button></div>' +
        '</div>' +
        '<div class="ai-input-row">' +
          '<button class="ai-plus" id="ai-plus" title="Upload or new chat">' + plusSvg(20) + '</button>' +
          '<div class="ai-plus-menu hidden" id="ai-plus-menu">' +
            '<button data-plus="upload">' + uploadSvg(18) + ' Upload document</button>' +
            '<button data-plus="newchat">' + newchatSvg(18) + ' New chat</button>' +
          '</div>' +
          '<textarea id="ai-input" placeholder="Ask AI Assigner\u2026" rows="1"></textarea>' +
          '<button class="ai-mode-btn" id="ai-mode-btn" title="Switch mode (Chat / Hints / Examiner)">' + cpuSvg(20) + '</button>' +
          '<button class="ai-send" id="ai-send" title="Send">' + icon(0x2191) + '</button>' +
          '<div class="ai-mode-hint hidden" id="ai-mode-hint">' +
            '<span class="ai-mode-hint-arrow">' + modeHintArrowSvg(26) + '</span>' +
            '<span class="ai-mode-hint-text">Tap to change the mode</span>' +
            '<button class="ai-mode-hint-close" id="ai-mode-hint-close" type="button" aria-label="Dismiss">\u2715</button>' +
          '</div>' +
        '</div>' +
        '<div class="ai-disclaimer">AI Assigner can make mistakes, so double-check the spec. It coaches you \u2014 it never writes your work for you.</div>' +
      '</div>' +
      '</div>';

    // Mode switching via the CPU button (Chat / Hints / Examiner)
    function setMode(next) {
      mode = next;
      var exam = document.getElementById('ai-examiner');
      if (exam) exam.classList.toggle('hidden', mode !== 'examiner');
      var input = document.getElementById('ai-input');
      if (input) input.placeholder = mode === 'hints' ? 'Describe what you\u2019re stuck on and I\u2019ll coach you\u2026' : mode === 'examiner' ? 'Add a note about your work before examining\u2026' : 'Ask AI Assigner\u2026';
      var btn = document.getElementById('ai-mode-btn');
      if (btn) btn.setAttribute('data-mode', mode);
    }

    // CPU mode button opens a small popup with the three modes
    var modeBtn = document.getElementById('ai-mode-btn');
    var modeMenu = document.createElement('div');
    modeMenu.className = 'ai-mode-menu hidden';
    modeMenu.id = 'ai-mode-menu';
    modeMenu.innerHTML =
      '<button data-mode="chat">' + chatSvg(18) + ' Chat</button>' +
      '<button data-mode="hints">' + hintsSvg(18) + ' Hints</button>' +
      '<button data-mode="examiner">' + examinerSvg(18) + ' Examiner</button>';
    modeBtn.parentNode.insertBefore(modeMenu, modeBtn.nextSibling);
    modeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      modeMenu.classList.toggle('hidden');
    });
    // Show the "tap to change mode" hint once, unless the user dismissed it.
    var hint = document.getElementById('ai-mode-hint');
    var hintClose = document.getElementById('ai-mode-hint-close');
    if (hint && hintClose) {
      var hintKey = 'ra10_ai_mode_hint_dismissed';
      var dismissed = false;
      try { dismissed = localStorage.getItem(hintKey) === '1'; } catch (e) {}
      if (!dismissed) hint.classList.remove('hidden');
      hintClose.addEventListener('click', function (e) {
        e.stopPropagation();
        hint.classList.add('hidden');
        try { localStorage.setItem(hintKey, '1'); } catch (e) {}
      });
    }
    modeMenu.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        modeMenu.classList.add('hidden');
        setMode(b.dataset.mode);
      });
    });
    document.addEventListener('click', function (e) {
      if (!modeMenu.classList.contains('hidden') && !e.target.closest('#ai-mode-btn') && !e.target.closest('#ai-mode-menu')) modeMenu.classList.add('hidden');
    });

    // Send
    document.getElementById('ai-send').addEventListener('click', send);
    var input = document.getElementById('ai-input');
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });
    input.addEventListener('input', function () {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 160) + 'px';
    });

    // + button (upload / new chat only)
    document.getElementById('ai-plus').addEventListener('click', function (e) {
      e.stopPropagation();
      document.getElementById('ai-plus-menu').classList.toggle('hidden');
    });
    document.addEventListener('click', function (e) {
      var menu = document.getElementById('ai-plus-menu');
      if (menu && !menu.classList.contains('hidden') && !e.target.closest('#ai-plus') && !e.target.closest('#ai-plus-menu')) menu.classList.add('hidden');
    });
    host.querySelectorAll('#ai-plus-menu [data-plus]').forEach(function (b) {
      b.addEventListener('click', function () {
        document.getElementById('ai-plus-menu').classList.add('hidden');
        var action = b.dataset.plus;
        if (action === 'upload') document.getElementById('ai-file-input').click();
        else if (action === 'newchat') newChat();
      });
    });

    document.getElementById('ai-newchat').addEventListener('click', newChat);
    document.getElementById('ai-mark-btn').addEventListener('click', doExamine);

    // Upload wiring
    var zone = document.getElementById('ai-upload-zone');
    var fileInput = document.getElementById('ai-file-input');
    zone.addEventListener('click', function () { fileInput.click(); });
    zone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); } });
    fileInput.addEventListener('change', function () { if (fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]); });
    var drag = 0;
    zone.addEventListener('dragenter', function () { drag++; zone.classList.add('drag'); });
    zone.addEventListener('dragover', function (e) { e.preventDefault(); });
    zone.addEventListener('dragleave', function () { if (--drag <= 0) { drag = 0; zone.classList.remove('drag'); } });
    zone.addEventListener('drop', function (e) { e.preventDefault(); drag = 0; zone.classList.remove('drag'); if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
    document.getElementById('ai-file-remove').addEventListener('click', function () {
      document.getElementById('ai-file-chip').classList.add('hidden');
      document.getElementById('ai-examiner-text').value = '';
      fileInput.value = '';
    });

    // Welcome
    if (!chatHistory.length) {
      addMsg('bot', 'Hi! I\u2019m **AI Assigner**, your Unit 3 mentor. Ask me about website development theory, get **hints** on a task, or switch to **Examiner** to upload your work and have it checked against the real Pass/Merit/Distinction criteria.');
      renderSuggestions();
    }
  }

  function renderSuggestions() {
    var host = document.getElementById('ai-suggestions');
    if (!host) return;
    var suggestions = [
      'Explain the difference between a wireframe and a mockup',
      'What should go on my annotated sitemap?',
      'How do I make my website accessible?',
      'Give me hints to reach Distinction in Task 2'
    ];
    host.innerHTML = '<div class="ai-suggestions-label">Try these prompts</div>' +
      suggestions.map(function (s) {
        return '<button class="ai-suggestion" data-q="' + esc(s) + '">' + esc(s) + '</button>';
      }).join('');
    host.classList.remove('hidden');
    host.querySelectorAll('.ai-suggestion').forEach(function (b) {
      b.addEventListener('click', function () {
        host.classList.add('hidden');
        var input = document.getElementById('ai-input');
        if (input) { input.value = b.dataset.q; input.focus(); }
        send();
      });
    });
  }

  function newChat() {
    chatHistory = [];
    var msgs = document.getElementById('ai-msgs');
    if (msgs) msgs.innerHTML = '';
    addMsg('bot', 'New chat started. What would you like to work on?');
  }

  function addMsg(role, text, html) {
    var host = document.getElementById('ai-msgs');
    if (!host) return;
    var div = document.createElement('div');
    div.className = 'ai-msg ' + role;
    if (html) div.innerHTML = html;
    else if (role === 'bot') div.innerHTML = md(text);
    else div.textContent = text;
    if (role === 'bot' && !html) {
      var avatar = document.createElement('span');
      avatar.className = 'ai-avatar';
      avatar.innerHTML = aiLogoSvg(18);
      div.insertBefore(avatar, div.firstChild);
      var copyBtn = document.createElement('button');
      copyBtn.className = 'ai-msg-copy';
      copyBtn.title = 'Copy response';
      copyBtn.textContent = 'Copy';
      copyBtn.addEventListener('click', function () {
        var t = div.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t);
        copyBtn.textContent = 'Copied \u2713';
        setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1400);
      });
      div.appendChild(copyBtn);
    }
    host.appendChild(div);
    host.scrollTop = host.scrollHeight;
    if (role !== 'thinking') chatHistory.push({ role: role, content: text });
    if (chatHistory.length > 30) chatHistory = chatHistory.slice(-30);
  }

  function addThinking() {
    var host = document.getElementById('ai-msgs');
    if (!host) return null;
    var div = document.createElement('div');
    div.className = 'ai-msg bot ai-thinking';
    div.innerHTML = '<span class="ai-avatar ai-avatar-small">' + aiLogoSvg(16) + '</span><span class="ai-thinking-status">' + STATUSES[0] + '</span><span class="ai-thinking-dots"></span>';
    host.appendChild(div);
    host.scrollTop = host.scrollHeight;
    var i = 0;
    statusTimer = setInterval(function () {
      i = (i + 1) % STATUSES.length;
      var s = div.querySelector('.ai-thinking-status');
      if (s) s.textContent = STATUSES[i];
      host.scrollTop = host.scrollHeight;
    }, 1600);
    return div;
  }

  function removeThinking(div) {
    if (statusTimer) { clearInterval(statusTimer); statusTimer = null; }
    if (div && div.remove) div.remove();
  }

  function send() {
    if (busy) return;
    var input = document.getElementById('ai-input');
    var text = (input.value || '').trim();
    if (!text) return;
    if (!window.RA10 || !RA10.isLoggedIn()) {
      addMsg('bot', 'You need to sign in first \u2014 then I can help you (this uses credits).');
      RA10.showPaywall('account', 'ai_assigner_hint');
      return;
    }
    input.value = '';
    input.style.height = 'auto';
    var sug = document.getElementById('ai-suggestions');
    if (sug) sug.classList.add('hidden');
    busy = true;
    addMsg('user', text);
    var think = addThinking();

    (async function () {
      try {
        var ok = await confirmCredit('ai_assigner_hint', 'Ask AI Assigner a question.');
        if (!ok) { removeThinking(think); busy = false; return; }
        if (typeof ra10Gate === 'function' && !(await ra10Gate('ai_assigner_hint'))) { removeThinking(think); busy = false; return; }
        var res = await RA10.askAiAssigner({
          message: text,
          history: chatHistory.slice(-8),
          context: 'Unit 3 Website Development. Current mode: ' + mode + '. Modes: chat (ask anything), hints (coach toward next grade), examiner (mark work against criteria). Learning aims: A (principles + planning), B (design + assets), C (build + test). Assignment has 3 tasks. Encourage the student to work things out themselves \u2014 never write their work for them. Use markdown in your answer: **bold**, lists, - [ ] task lists, tables and fenced code blocks.'
        });
        removeThinking(think);
        addMsg('bot', res.reply);
      } catch (e) {
        removeThinking(think);
        addMsg('bot', 'Sorry \u2014 ' + (e && e.message ? e.message : 'something went wrong'));
      } finally {
        busy = false;
      }
    })();
  }

  async function doExamine() {
    if (busy) return;
    var text = (document.getElementById('ai-examiner-text').value || '').trim();
    if (!text) { alert('Upload or paste your work first.'); return; }
    if (!window.RA10 || !RA10.isLoggedIn()) {
      addMsg('bot', 'Sign in to use AI Assigner marking.');
      RA10.showPaywall('account', 'ai_assigner_mark');
      return;
    }
    busy = true;
    addMsg('user', 'Please examine my work for this assignment task.');
    var think = addThinking();
    try {
      var ok = await confirmCredit('ai_assigner_mark', 'Examine your assignment against the Pass/Merit/Distinction criteria.');
      if (!ok) { removeThinking(think); busy = false; return; }
      if (typeof ra10Gate === 'function' && !(await ra10Gate('ai_assigner_mark'))) { removeThinking(think); busy = false; return; }
      var criteriaMap = {};
      if (CRITERIA && CRITERIA.tasks) CRITERIA.tasks.forEach(function (task) { task.criteria.forEach(function (c) { criteriaMap[c.code] = c.level + ': ' + c.text; }); });
      var res = await RA10.markAssignment({ submission: text, taskTitle: 'Unit 3 assignment', criteria: criteriaMap });
      removeThinking(think);
      renderMarkResult(res.result);
    } catch (e) {
      removeThinking(think);
      addMsg('bot', 'Sorry \u2014 ' + (e && e.message ? e.message : 'could not examine your work'));
    } finally {
      busy = false;
    }
  }

  function renderMarkResult(r) {
    var host = document.getElementById('ai-msgs');
    if (!host) return;
    var grade = r.grade || 'Not yet met';
    var cls = 'g-' + grade.replace(/[^A-Za-z]/g, '');
    var html = '<div class="ai-mark-card"><div class="mark-grade-badge ' + cls + '">' + esc(grade) + '</div>';
    if (Array.isArray(r.criteriaMet) && r.criteriaMet.length) {
      html += '<div class="ai-mark-criteria">' + r.criteriaMet.map(function (c) {
        return '<div class="ai-mark-crit"><span class="' + (c.met ? 'tick' : 'cross') + '">' + (c.met ? '\u2713' : '\u2717') + '</span><span><b>' + esc(c.code) + '</b> \u2014 ' + esc(c.comment || (c.met ? 'Met' : 'Not yet met')) + '</span></div>';
      }).join('') + '</div>';
    }
    if (Array.isArray(r.strengths) && r.strengths.length) {
      html += '<h4>Strengths</h4><ul>' + r.strengths.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>';
    }
    if (Array.isArray(r.improvements) && r.improvements.length) {
      html += '<h4>To reach the next grade</h4><ul>' + r.improvements.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>';
    }
    if (r.nextGradeFocus) html += '<p class="small"><b>Focus:</b> ' + esc(r.nextGradeFocus) + '</p>';
    if (r.feedback) html += '<p>' + esc(r.feedback) + '</p>';
    html += '</div>';
    addMsg('bot', '', html);
  }

  async function handleFile(file) {
    var chip = document.getElementById('ai-file-chip');
    var chipName = document.getElementById('ai-file-name');
    var zone = document.getElementById('ai-upload-zone');
    var MAX = 4 * 1024 * 1024;
    if (file.size > MAX) { chipName.textContent = 'File too large (max 4 MB)'; chip.classList.remove('hidden'); return; }
    var ext = (file.name.split('.').pop() || '').toLowerCase();
    if (['pdf', 'docx', 'doc', 'txt', 'md', 'rtf'].indexOf(ext) === -1) { chipName.textContent = 'Unsupported type \u2014 use PDF, Word (.docx), text or markdown'; chip.classList.remove('hidden'); return; }
    zone.classList.add('loading');
    chipName.textContent = 'Reading ' + file.name + '\u2026';
    chip.classList.remove('hidden');
    try {
      var text = '';
      if (ext === 'pdf') text = await extractPdf(file);
      else if (ext === 'docx') text = await extractDocx(file);
      else if (ext === 'doc') throw new Error('Old .doc format \u2014 please save as .docx and try again.');
      else text = await new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(String(r.result || '')); }; r.onerror = function () { rej(new Error('Could not read the file.')); }; r.readAsText(file); });
      text = (text || '').replace(/\r\n/g, '\n').replace(/\u0000/g, '').trim();
      if (!text) throw new Error('No text found \u2014 the file may be scanned images.');
      if (text.length > 12000) text = text.slice(0, 12000) + '\n\u2026[truncated]';
      document.getElementById('ai-examiner-text').value = text;
      chipName.textContent = 'Loaded ' + file.name;
    } catch (e) {
      chipName.textContent = e && e.message ? e.message : 'Could not read that file.';
    } finally {
      zone.classList.remove('loading');
    }
  }

  async function extractPdf(file) {
    var lib = window.pdfjsLib;
    if (!lib || !lib.getDocument) throw new Error('PDF reader not loaded.');
    try { lib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'; } catch (e) {}
    var pdf = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
    var parts = [];
    for (var i = 1; i <= pdf.numPages; i++) {
      var page = await pdf.getPage(i);
      var content = await page.getTextContent();
      var line = content.items.map(function (it) { return (it && it.str) || ''; }).join(' ');
      if (line) parts.push(line);
    }
    return parts.join('\n\n');
  }

  async function extractDocx(file) {
    var m = window.mammoth;
    if (!m || !m.extractRawText) throw new Error('Word reader not loaded.');
    var res = await m.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return res && res.value ? res.value : '';
  }

  window.openAiAssigner = function (focus) {
    window._pendingAiFocus = focus || null;
    if (typeof switchTab === 'function') switchTab('ai');
    else render();
  };

  window.initAiAssigner = function () {
    if (!document.getElementById('ai-msgs')) { chatHistory = []; render(); }
    var pending = window._pendingAiFocus;
    window._pendingAiFocus = null;
    if (pending && typeof pending === 'string' && pending.indexOf('task:') === 0) {
      addMsg('bot', 'You\u2019re on Task ' + pending.replace('task', '') + ' \u2014 tell me what you\u2019ve done so far and what you\u2019re stuck on.');
    }
  };
})();
