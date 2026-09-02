/* AI Assigner — Unit 3 mentor chat + assignment marking panel. */
(function () {
  'use strict';

  let chatHistory = [];
  let markTask = 'task1';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  function getTask(code) {
    if (CRITERIA && CRITERIA.tasks) return CRITERIA.tasks.find(function (t) { return t.code === code; });
    return null;
  }
  function currentTask() { return getTask(markTask) || getTask('task1'); }

  function render() {
    const host = document.getElementById('ai-assigner-panel');
    if (!host) return;
    host.innerHTML = `
<div class="ai-panel">
  <div class="ai-chat">
    <div class="ai-chat-head">
      <b>Chat with AI Assigner</b>
      <span class="muted">Hints, coaching and guidance — it never writes your work for you.</span>
    </div>
    <div class="ai-msgs" id="ai-msgs"></div>
    <div class="ai-input-row">
      <textarea id="ai-input" placeholder="Ask anything about Unit 3 — theory, a task, or your draft..." rows="2"></textarea>
      <button id="ai-send" type="button">Send</button>
    </div>
  </div>
  <div class="ai-mark">
    <div class="ai-mark-head">
      <b>Mark my assignment</b>
      <span class="muted">Paste your work and AI Assigner assesses it against the criteria.</span>
    </div>
    <div class="ai-mark-body">
      <label class="muted small" for="ai-mark-task">Which task is this evidence for?</label>
      <select id="ai-mark-task" class="select" style="width:100%;margin:8px 0 12px">
        ${(CRITERIA && CRITERIA.tasks ? CRITERIA.tasks : []).map(function (t) {
          return '<option value="' + esc(t.code) + '">Task ' + esc(t.code.slice(-1)) + ' — Learning Aim ' + esc(t.aim) + ': ' + esc(t.title) + '</option>';
        }).join('')}
      </select>
      <div class="upload-panel" id="ai-upload-panel" style="text-align:left">
        <textarea id="ai-mark-text" placeholder="Paste your assignment evidence here (research, sitemap annotations, test plans, reflections...). Text only, up to ~12,000 characters."></textarea>
      </div>
      <div class="card-action-row" style="justify-content:center">
        <button class="btn primary" id="ai-mark-btn">Mark my work<span class="ra10-cost-label">8 credits</span></button>
        <button class="btn" id="ai-hint-btn">Just give me hints<span class="ra10-cost-label">3 credits</span></button>
      </div>
      <div id="ai-mark-result"></div>
    </div>
  </div>
</div>`;

    document.getElementById('ai-mark-task').addEventListener('change', function () {
      markTask = this.value;
      const task = currentTask();
      const hintBtn = document.getElementById('ai-hint-btn');
      if (task && hintBtn) hintBtn.innerHTML = 'Just give me hints — ' + task.title.slice(0, 40) + '…';
    });
    document.getElementById('ai-send').addEventListener('click', sendChat);
    document.getElementById('ai-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
    });
    document.getElementById('ai-mark-btn').addEventListener('click', function () { doMark(false); });
    document.getElementById('ai-hint-btn').addEventListener('click', function () { doMark(true); });

    addMsg('bot', 'Hi! I\'m AI Assigner, your Unit 3 mentor. Ask me about website development theory, wireframes, sitemaps, HTML/CSS/JS, or how to hit the criteria for any task — or paste your draft in the marking panel and I\'ll show you where to improve. I\'ll coach you, but you do the work. 😊');
    // apply pending task focus
    if (window._pendingAiFocus) {
      const focus = window._pendingAiFocus;
      window._pendingAiFocus = null;
      if (typeof focus === 'string' && focus.indexOf('task:') === 0) {
        const code = focus.slice(5);
        addMsg('bot', 'You\'re on Task ' + code.replace('task', '') + ' — tell me what you\'ve done so far and what you\'re stuck on, and I\'ll point you in the right direction.');
      }
    }
  }

  function addMsg(role, text) {
    const host = document.getElementById('ai-msgs');
    if (!host) return;
    const div = document.createElement('div');
    div.className = 'ai-msg ' + role;
    div.textContent = text;
    host.appendChild(div);
    host.scrollTop = host.scrollHeight;
    chatHistory.push({ role: role, content: text });
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
  }

  async function sendChat() {
    const input = document.getElementById('ai-input');
    const message = (input.value || '').trim();
    if (!message) return;
    if (!window.RA10 || !RA10.isLoggedIn()) {
      addMsg('bot', 'You need to sign in first — then I can help you (this uses credits).');
      RA10.showPaywall('account', 'ai_assigner_hint');
      return;
    }
    if (typeof ra10Gate === 'function' && !(await ra10Gate('ai_assigner_hint'))) return;

    input.value = '';
    addMsg('user', message);
    addMsg('bot', '…thinking…');
    try {
      const res = await RA10.askAiAssigner({
        message: message,
        history: chatHistory.slice(-8),
        context: 'Unit 3 Website Development. Learning aims: A (principles + planning), B (design + assets), C (build + test). Assignment has 3 tasks. Encourage the student to work things out themselves.'
      });
      const msgs = document.getElementById('ai-msgs');
      if (msgs) { const last = msgs.lastElementChild; if (last && last.textContent === '…thinking…') last.remove(); }
      addMsg('bot', res.reply);
    } catch (e) {
      const msgs = document.getElementById('ai-msgs');
      if (msgs) { const last = msgs.lastElementChild; if (last && last.textContent === '…thinking…') last.remove(); }
      addMsg('bot', 'Sorry — ' + (e && e.message ? e.message : 'something went wrong') + '');
    }
  }

  async function doMark(hintOnly) {
    const ta = document.getElementById('ai-mark-text');
    const text = (ta ? ta.value : '').trim();
    if (!text) { alert('Paste your work into the box first.'); return; }
    const result = document.getElementById('ai-mark-result');
    if (!window.RA10 || !RA10.isLoggedIn()) {
      if (result) result.innerHTML = '<p class="muted">Sign in to use AI Assigner marking.</p>';
      RA10.showPaywall('account', 'ai_assigner_mark');
      return;
    }
    if (typeof ra10Gate === 'function' && !(await ra10Gate(hintOnly ? 'ai_assigner_hint' : 'ai_assigner_mark'))) return;

    result.innerHTML = '<p class="muted">AI Assigner is assessing your work…</p>';
    const task = currentTask();
    const criteriaMap = {};
    if (task && task.criteria) task.criteria.forEach(function (c) { criteriaMap[c.code] = c.level + ': ' + c.text; });

    try {
      if (hintOnly) {
        const res = await RA10.askAiAssigner({
          message: 'I am working on ' + (task ? task.title : 'a task') + '. Here is my draft — give me hints to lift it towards the next grade without writing it for me:\n\n' + text.slice(0, 4000),
          context: 'Assignment task: ' + (task ? task.title : '') + '. Criteria: ' + Object.keys(criteriaMap).join(', ')
        });
        result.innerHTML = '<div class="ai-msg bot" style="max-width:100%;background:var(--surface-2)">' + esc(res.reply) + '</div>';
      } else {
        const res = await RA10.markAssignment({ submission: text, taskTitle: task ? task.title : 'Task', criteria: criteriaMap });
        renderMarkResult(result, res.result, task);
      }
    } catch (e) {
      result.innerHTML = '<div style="color:var(--bad)"><strong>Could not mark:</strong> ' + esc(e && e.message ? e.message : String(e)) + '</div>';
    }
  }

  function renderMarkResult(host, r, task) {
    const grade = r.grade || 'Not yet met';
    const cls = 'g-' + grade.replace(/[^A-Za-z]/g, '');
    const criteriaSet = new Set((task && task.criteria ? task.criteria : []).map(function (c) { return c.code; }));
    const met = Array.isArray(r.criteriaMet) ? r.criteriaMet.filter(function (c) { return criteriaSet.has(c.code); }) : [];
    let html = '<div class="mark-result">';
    html += '<div class="mark-grade-badge ' + cls + '">' + esc(grade) + '</div>';
    if (met.length) {
      html += '<h4 style="margin:6px 0">Criteria</h4><ul class="mark-criteria">' +
        met.map(function (c) {
          return '<li><span class="' + (c.met ? 'tick' : 'cross') + '">' + (c.met ? '✓' : '✗') + '</span><span><strong>' + esc(c.code) + '</strong> — ' + esc(c.comment || (c.met ? 'Met' : 'Not yet met')) + '</span></li>';
        }).join('') +
        '</ul>';
    }
    if (Array.isArray(r.strengths) && r.strengths.length) {
      html += '<h4 style="margin:10px 0 4px">Strengths</h4><ul>' + r.strengths.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>';
    }
    if (Array.isArray(r.improvements) && r.improvements.length) {
      html += '<h4 style="margin:10px 0 4px">To reach the next grade</h4><ul>' + r.improvements.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>';
    }
    if (r.nextGradeFocus) html += '<p class="small" style="margin-top:10px"><strong>Focus:</strong> ' + esc(r.nextGradeFocus) + '</p>';
    if (r.feedback) html += '<p style="margin-top:10px">' + esc(r.feedback) + '</p>';
    html += '</div>';
    host.innerHTML = html;
  }

  window.openAiAssigner = function (focus) {
    window._pendingAiFocus = focus || null;
    if (typeof switchTab === 'function') switchTab('ai');
    else render();
  };

  window.initAiAssigner = function () {
    chatHistory = [];
    render();
  };
})();