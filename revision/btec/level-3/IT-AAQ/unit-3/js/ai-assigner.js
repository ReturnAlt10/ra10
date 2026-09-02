/* AI Assigner — floating chat widget for Unit 3 (hints only, never full solutions). */
(function () {
  let history = [];
  let open = false;

  function currentContext() {
    const active = document.querySelector('.tab.active');
    const tabName = active ? active.dataset.tab : 'dashboard';
    let extra = '';
    if (tabName === 'editor' && document.getElementById('code-editor-textarea')) {
      extra = 'Student is in the Code Editor, working on file: ' + (document.getElementById('code-editor-textarea').dataset.file || '') ;
    } else if (tabName === 'assignment') {
      const activeTask = document.querySelector('.task-step-btn.active b');
      extra = 'Student is looking at assignment guidance for: ' + (activeTask ? activeTask.textContent : 'a task');
    } else if (tabName === 'guide') {
      extra = 'Student is reading the theory revision guide.';
    } else if (tabName === 'wireframe') {
      extra = 'Student is using the Wireframe Builder tool.';
    } else if (tabName === 'sitemap') {
      extra = 'Student is using the Sitemap Builder tool.';
    }
    return 'Current tab: ' + tabName + '. ' + extra;
  }

  function renderMessages() {
    const body = document.getElementById('aa-body');
    if (!body) return;
    body.innerHTML = history.map((m) =>
      '<div class="aa-msg ' + (m.role === 'user' ? 'user' : 'ai') + '">' + escapeHtml(m.content) + '</div>'
    ).join('') || '<div class="aa-msg ai">Hi! I\'m AI Assigner 👋 Ask me about website design theory, coding help, or your assignment tasks. I\'ll give hints and guidance — not full solutions.</div>';
    body.scrollTop = body.scrollHeight;
  }

  function escapeHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  async function sendMessage() {
    const input = document.getElementById('aa-textarea');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    history.push({ role: 'user', content: msg });
    renderMessages();

    const sendBtn = document.getElementById('aa-send');
    sendBtn.disabled = true;
    history.push({ role: 'assistant', content: '…thinking…' });
    renderMessages();

    try {
      if (!window.RA10 || typeof RA10.askAiAssigner !== 'function') {
        throw new Error('AI Assigner is not available right now.');
      }
      if (!RA10.isLoggedIn()) {
        history.pop();
        history.push({ role: 'assistant', content: 'Please sign in to use AI Assigner — it uses your account credits.' });
        renderMessages();
        sendBtn.disabled = false;
        return;
      }
      const res = await RA10.askAiAssigner({ message: msg, context: currentContext(), history: history.slice(0, -2) });
      history.pop();
      history.push({ role: 'assistant', content: res.reply });
    } catch (e) {
      history.pop();
      history.push({ role: 'assistant', content: 'Sorry — ' + (e && e.message ? e.message : 'something went wrong.') });
    }
    renderMessages();
    sendBtn.disabled = false;
  }

  window.toggleAiAssigner = function () {
    open = !open;
    const panel = document.getElementById('ai-assigner-panel');
    if (panel) panel.classList.toggle('open', open);
    if (open) renderMessages();
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('ai-assigner-fab')?.addEventListener('click', window.toggleAiAssigner);
    document.getElementById('aa-close')?.addEventListener('click', window.toggleAiAssigner);
    document.getElementById('aa-send')?.addEventListener('click', sendMessage);
    document.getElementById('aa-textarea')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
  });
})();
