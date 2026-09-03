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
  function sparkleSvg(size) {
    var s = size || 22;
    return '<svg class="ai-sparkle-svg" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c.7 4.9 4.1 8.3 9 9-4.9.7-8.3 4.1-9 9-.7-4.9-4.1-8.3-9-9 4.9-.7 8.3-4.1 9-9z"/></svg>';
  }

  var STATUSES = [
    'Connecting with RA10 AI',
    'Reading the specification',
    'Reviewing your work',
    'Checking the criteria',
    'Thinking it through',
    'Writing your response'
  ];

  /* Minimal safe Markdown renderer */
  function md(s) {
    var input = esc(String(s == null ? '' : s).replace(/\r\n/g, '\n'));
    var blocks = [];
    input = input.replace(/```([\s\S]*?)```/g, function (_, c) { blocks.push(c.replace(/^[a-zA-Z0-9]+\n/, '')); return '\u0000B' + (blocks.length - 1) + '\u0000'; });
    input = input.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    input = input.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    input = input.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    input = input.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    input = input.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, t, u) { return /^(javascript|data|vbscript):/i.test(u) ? _ : '<a href="' + u + '" target="_blank" rel="noopener">' + t + '</a>'; });
    input = input.replace(/^#### (.*)$/gm, '<h4>$1</h4>');
    input = input.replace(/^### (.*)$/gm, '<h3>$1</h3>');
    input = input.replace(/^## (.*)$/gm, '<h2>$1</h2>');
    input = input.replace(/^# (.*)$/gm, '<h1>$1</h1>');
    input = input.replace(/((?:^.*\|\s*\n)+)/gm, function (block) {
      var rows = block.trim().split('\n').filter(function (r) { return /\|/.test(r.trim()); });
      var h = '<div style="overflow-x:auto"><table>';
      rows.forEach(function (line, i) {
        if (/^\s*\|?\s*:?-{2,}.*-{2,}/.test(line)) return;
        var cells = line.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(function (c) { return c.trim(); });
        var tag = i === 0 ? 'th' : 'td';
        h += '<tr>' + cells.map(function (c) { return '<' + tag + '>' + c + '</' + tag + '>'; }).join('') + '</tr>';
      });
      return h + '</table></div>';
    });
    input = input.replace(/(?:^[\t ]*(?:[-*+]|\d+\.)[\t ]+.*\n?)+/gm, function (m) {
      var ordered = /^\s*\d+\./.test(m);
      var items = [];
      var re = /^[\t ]*(?:[-*+]|\d+\.)[\t ]+(.*)$/gm, mm;
      while ((mm = re.exec(m)) !== null) items.push(mm[1]);
      return (ordered ? '<ol>' : '<ul>') + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + (ordered ? '</ol>' : '</ul>');
    });
    input = input.replace(/\u0000B(\d+)\u0000/g, function (_m, i) { return '<pre><code>' + esc(blocks[+i] || '') + '</code></pre>'; });
    return input;
  }

  function render() {
    var host = document.getElementById('ai-assigner-panel');
    if (!host) return;
    host.innerHTML =
      '<div class="ai-client">' +
      // Gemini-style header
      '<header class="ai-head">' +
        '<div class="ai-head-brand"><span class="ai-sparkle">' + sparkleSvg(24) + '</span><span class="ai-brand-name">AI Assigner</span></div>' +
        '<button class="ai-newchat" id="ai-newchat" title="Start a new chat">' + icon(0x2B) + ' New chat</button>' +
      '</header>' +
      '<div class="ai-modes" id="ai-modes">' +
        '<button class="ai-mode active" data-mode="chat">Chat</button>' +
        '<button class="ai-mode" data-mode="hints">Hints</button>' +
        '<button class="ai-mode" data-mode="examiner">Examiner</button>' +
      '</div>' +
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
      '<div class="ai-msgs" id="ai-msgs"></div>' +
      '<div class="ai-suggestions hidden" id="ai-suggestions"></div>' +
      '<div class="ai-composer">' +
        '<div class="ai-input-row">' +
          '<button class="ai-plus" id="ai-plus" title="Upload document or start a new chat">' + icon(0x2B) + '</button>' +
          '<div class="ai-plus-menu hidden" id="ai-plus-menu">' +
            '<button data-plus="upload">' + icon(0x1F4C2) + ' Upload document</button>' +
            '<button data-plus="newchat">' + icon(0x2795) + ' New chat</button>' +
          '</div>' +
          '<textarea id="ai-input" placeholder="Ask AI Assigner\u2026" rows="1"></textarea>' +
          '<button class="ai-send" id="ai-send" title="Send">' + icon(0x2191) + '</button>' +
        '</div>' +
        '<div class="ai-disclaimer">AI Assigner can make mistakes, so double-check the spec. It coaches you \u2014 it never writes your work for you.</div>' +
      '</div>' +
      '</div>';

    // Mode switching
    host.querySelectorAll('.ai-mode').forEach(function (b) {
      b.addEventListener('click', function () {
        mode = b.dataset.mode;
        host.querySelectorAll('.ai-mode').forEach(function (x) { x.classList.toggle('active', x === b); });
        var exam = document.getElementById('ai-examiner');
        if (exam) exam.classList.toggle('hidden', mode !== 'examiner');
        var input = document.getElementById('ai-input');
        if (input) input.placeholder = mode === 'hints' ? 'Describe what you\u2019re stuck on and I\u2019ll coach you\u2026' : mode === 'examiner' ? 'Add a note about your work before examining\u2026' : 'Ask anything about Unit 3\u2026';
      });
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

    // + button
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
        if (b.dataset.plus === 'upload') document.getElementById('ai-file-input').click();
        else newChat();
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
      avatar.innerHTML = sparkleSvg(18);
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
    div.innerHTML = '<span class="ai-avatar ai-avatar-small">' + sparkleSvg(16) + '</span><span class="ai-thinking-status">' + STATUSES[0] + '</span><span class="ai-thinking-dots"></span>';
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
        if (typeof ra10Gate === 'function' && !(await ra10Gate('ai_assigner_hint'))) { removeThinking(think); busy = false; return; }
        var res = await RA10.askAiAssigner({
          message: text,
          history: chatHistory.slice(-8),
          context: 'Unit 3 Website Development. Modes: chat (ask anything), hints (coach toward next grade), examiner (mark work against criteria). Learning aims: A (principles + planning), B (design + assets), C (build + test). Assignment has 3 tasks. Encourage the student to work things out themselves \u2014 never write their work for them.'
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
