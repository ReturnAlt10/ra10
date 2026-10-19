/* AI Assigner — Unit 3 mentor, built into the shared RA10 AI tool.
   The same tool (and the same saved chats) opens from the floating AI button
   anywhere in the unit and fills the "AI Assigner" tab. UI, history and
   liquid glass come from /refresh/ra10-ai.js. */
(function () {
  'use strict';

  var UNIT = {
    key: 'it-aaq-unit-3',
    taskTitle: 'Unit 3 assignment',
    welcomeTitle: 'Your <em>Unit 3</em> mentor',
    welcomeText: 'Pick what you need. Everything is checked against the real Pass, Merit and Distinction criteria, and your chats are saved.',
    suggestions: [
      { kicker: 'Explain', label: 'The difference between a wireframe and a mockup', prompt: 'Explain the difference between a wireframe and a mockup' },
      { kicker: 'Plan', label: 'What should go on my annotated sitemap?', prompt: 'What should go on my annotated sitemap?' },
      { kicker: 'Build', label: 'How do I make my website accessible?', prompt: 'How do I make my website accessible?' },
      { kicker: 'Test', label: 'What should my test plan include?', prompt: 'What should my test plan include?' }
    ],
    context: 'Unit 3 Website Development. Learning aims: A (principles + planning), B (design + assets), C (build + test). Assignment has 3 tasks.'
  };

  var chat = null;

  function tasks() {
    var list = (typeof CRITERIA !== 'undefined' && CRITERIA && CRITERIA.tasks) || [];
    return list.map(function (t, i) { return { code: t.code, short: 'Task ' + (i + 1), title: t.title, criteria: t.criteria || [] }; });
  }

  // Marking a single task only sends that task's criteria (more accurate).
  function criteriaMap(task) {
    var map = {};
    (task ? [task] : tasks()).forEach(function (t) {
      t.criteria.forEach(function (c) { map[c.code] = c.level + ': ' + c.text; });
    });
    return map;
  }

  function profile() {
    return {
      product: 'assigner',
      title: 'AI Assigner',
      modes: ['chat', 'hints', 'examiner'],
      tasks: tasks(),
      suggestions: UNIT.suggestions,
      welcomeTitle: UNIT.welcomeTitle,
      welcomeText: UNIT.welcomeText,
      placeholders: { chat: 'Ask AI Assigner…' },
      disclaimer: 'AI Assigner coaches you — it never writes your work for you. Chats auto-delete after 30 days unless you save them.',
      context: function (mode) {
        return UNIT.context + ' Current mode: ' + mode + '. Encourage the student to work things out themselves — never write their work for them. Use markdown: **bold**, lists, - [ ] task lists, tables and fenced code blocks.';
      },
      examiner: {
        submit: function (text, fileName, note, task) {
          var submission = note ? 'Student note: ' + note + '\n\n' + text : text;
          var title = task ? UNIT.taskTitle + ' — ' + task.short + ': ' + task.title : UNIT.taskTitle;
          return RA10.markAssignment({ submission: submission, taskTitle: title, criteria: criteriaMap(task) })
            .then(function (res) { return RA10AI.renderAssignmentResult(res.result); });
        }
      }
    };
  }

  function whenReady(fn) {
    if (window.RA10AI) { fn(); return; }
    document.addEventListener('ra10ai:ready', fn, { once: true });
    // ra10-refresh.js normally loads the core; load it ourselves if not.
    if (!document.getElementById('ra10-ai-js')) {
      var s = document.createElement('script');
      s.id = 'ra10-ai-js';
      s.src = '/refresh/ra10-ai.js?v=20261021';
      document.head.appendChild(s);
    }
  }

  // The floating AI button on every Unit 3 page opens AI Assigner too.
  // Criteria load async, so tasks are read lazily (when the panel first opens).
  whenReady(function () { RA10AI.configure(lazyProfile()); });
  function lazyProfile() {
    var p = profile();
    Object.defineProperty(p, 'tasks', { enumerable: true, get: tasks });
    return p;
  }

  function mount() {
    var host = document.getElementById('ai-assigner-panel');
    if (!host || chat) return;
    host.innerHTML = '';
    chat = RA10AI.mountChat(host, Object.assign(lazyProfile(), { variant: 'inline' }));
  }

  window.openAiAssigner = function (focus) {
    window._pendingAiFocus = focus || null;
    if (typeof switchTab === 'function') switchTab('ai');
    else window.initAiAssigner();
  };

  window.initAiAssigner = function () {
    whenReady(function () {
      mount();
      if (!chat) return;
      chat.setActive(true);
      var pending = window._pendingAiFocus;
      window._pendingAiFocus = null;
      if (pending && typeof pending === 'string' && pending.indexOf('task:') === 0) {
        chat.setMode('hints');
        chat.prefill('I’m working on Task ' + pending.slice(5) + '. So far I have ');
      }
    });
  };
})();
