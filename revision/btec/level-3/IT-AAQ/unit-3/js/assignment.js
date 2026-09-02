/* Part 2 — Assignment Hub (redesigned, calm & simple).
   One big "where am I?" view: 3 task cards → pick a task → see
   "what to make" (short), "steps" (collapsible), "checklist", and
   big buttons for the tools. No walls of text. */
(function () {
  'use strict';

  let activeTask = 'task1';
  const CHECKLIST_KEY = 'ra10_u3_checklist';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  function getTask(code) {
    if (!CRITERIA || !CRITERIA.tasks) return null;
    return CRITERIA.tasks.find(function (t) { return t.code === code; });
  }
  function getWalkthrough(code) { return WALKTHROUGHS[code] || null; }

  function checklistState() { try { return JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '{}'); } catch (e) { return {}; } }
  function saveChecklist(s) { try { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(s)); } catch (e) {} }

  function costLabel(action) {
    const c = (typeof window._ra10GetActionCost === 'function') ? window._ra10GetActionCost(action) : 0;
    return c + ' credits';
  }

  function taskIcon(code) {
    return code === 'task2' ? '🎨' : code === 'task3' ? '🛠️' : '🗺️';
  }
  function taskShort(code) {
    return code === 'task1' ? 'Research + plan the site' : code === 'task2' ? 'Design the look + assets' : 'Build + test the site';
  }
  function taskVerb(code) {
    return code === 'task1' ? 'Start planning' : code === 'task2' ? 'Start designing' : 'Start building';
  }

  function render() {
    const host = document.getElementById('assignment-hub');
    if (!host) return;
    const tasks = (CRITERIA && CRITERIA.tasks) || [];
    const t = getTask(activeTask) || tasks[0];
    const wt = getWalkthrough(activeTask);

    if (!tasks.length) { host.innerHTML = '<p class="muted">Assignment data is still loading…</p>'; return; }

    let html = '';

    // 1. Big friendly picker
    html += '<div class="assign-pick">' +
      '<p class="assign-eyebrow">Your assignment has 3 tasks — tap one to see exactly what to do.</p>' +
      '<div class="assign-task-cards">' + tasks.map(function (task) {
        const wt2 = getWalkthrough(task.code);
        const done = (wt2 && wt2.evidence ? wt2.evidence.length : 0);
        const checked = wt2 ? wt2.evidence.filter(function (_, i) { return checklistState()[task.code + '_' + i]; }).length : 0;
        return '<button class="assign-card' + (task.code === activeTask ? ' active' : '') + '" data-task="' + esc(task.code) + '">' +
          '<span class="assign-card-ico">' + taskIcon(task.code) + '</span>' +
          '<span class="assign-card-tx"><b>Task ' + task.code.slice(-1) + ' · ' + taskShort(task.code) + '</b>' +
          '<small>' + esc(task.title) + '</small></span>' +
          (wt2 ? '<span class="assign-card-prog"><span class="p-bar"><i style="width:' + (done ? Math.round(checked / done * 100) : 0) + '%"></i></span><em>' + checked + '/' + done + '</em></span>' : '') +
          '</button>';
      }).join('') + '</div>' +
      '</div>';

    // 2. The action panel for the active task
    html += '<div class="assign-panel" id="assign-panel">';

    // What you'll make
    html += '<div class="assign-what">' +
      '<div class="aw-hd"><span class="aw-ico">' + taskIcon(activeTask) + '</span><div><b>What you\'ll make</b><small>One short paragraph — no essay.</small></div></div>' +
      '<p>' + esc(wt ? wt.summary : '') + '</p>' +
      '</div>';

    // Big action buttons
    html += '<div class="assign-cta">' +
      '<button class="btn primary big assign-go" data-goto="' + (activeTask === 'task2' ? 'wireframe' : activeTask === 'task3' ? 'editor' : 'guide') + '">' +
        taskVerb(activeTask) +
        '<small>' + (activeTask === 'task2' ? 'open the wireframe tool' : activeTask === 'task3' ? 'open the code editor' : 'open the study guide') + '</small></button>' +
      '<button class="btn big assign-ai" data-goto="ai">Ask AI Assigner<small>hints · ' + costLabel('ai_assigner_hint') + '</small></button>' +
      '</div>';

    // Step-by-step, collapsible (default open)
    html += '<div class="assign-steps open">' +
      '<button class="as-toggle" data-target="as-steps"><span>👣 Step-by-step</span><span class="as-cherr">▾</span></button>' +
      '<div class="as-body open" id="as-steps">' +
      (wt && wt.steps ? wt.steps.map(function (s) { return '<div class="as-step">' + s + '</div>'; }).join('') : '') +
      '</div></div>';

    // Checklist
    html += '<div class="assign-chck" id="assign-checklist">' +
      '<div class="ach-hd"><b>✅ Submission checklist</b><span class="small muted">' + (wt ? wt.evidence.length : 0) + ' things to tick off</span></div>' +
      '<ul class="assign-check-lst">' + (wt ? wt.evidence.map(function (item, i) {
        const done = checklistState()[activeTask + '_' + i];
        return '<li class="' + (done ? 'done' : '') + '" data-i="' + i + '"><input type="checkbox" ' + (done ? 'checked' : '') + '><span>' + esc(item) + '</span></li>';
      }).join('') : '') + '</ul></div>';

    // Grade ladder — short
    html += '<div class="assign-grades">' +
      '<div class="ag-hd"><b>How you\'re graded</b><small>Pass → Merit → Distinction — each builds on the last.</small></div>' +
      '<div class="ag-rows">' + (CRITERIA && CRITERIA.gradeDescriptions && CRITERIA.gradeDescriptions[activeTask] ? ['Pass', 'Merit', 'Distinction'].map(function (g) {
        return '<div class="ag-row ' + g.toLowerCase() + '"><span class="ag-badge">' + g + '</span><p class="small">' + esc(CRITERIA.gradeDescriptions[activeTask][g]) + '</p></div>';
      }).join('') : '') + '</div></div>';

    // Sample briefs (collapsible, closed)
    const briefs = SAMPLE_BRIEFS || [];
    if (briefs.length) {
      html += '<div class="assign-bref">' +
        '<button class="as-toggle" data-target="as-briefs"><span>📄 Try a practice brief</span><span class="as-cherr">▾</span></button>' +
        '<div class="as-body" id="as-briefs"><div class="brief-grid">' + briefs.map(function (b, i) {
          return '<button class="brief-card" data-brief="' + i + '"><b>' + esc(b.title) + '</b><small>' + esc(b.audience) + '</small></button>';
        }).join('') + '</div></div></div>';
    }

    html += '</div>'; // assign-panel

    host.innerHTML = html;

    // Wire events
    host.querySelectorAll('.assign-card').forEach(function (card) { card.addEventListener('click', function () { activeTask = card.dataset.task; render(); }); });
    host.querySelectorAll('[data-goto]').forEach(function (b) { b.addEventListener('click', function () { if (typeof switchTab === 'function') switchTab(b.dataset.goto); }); });
    host.querySelectorAll('.as-toggle').forEach(function (b) {
      b.addEventListener('click', function () {
        var body = document.getElementById(b.dataset.target);
        var wrap = b.parentElement;
        if (body) body.classList.toggle('open');
        if (wrap) wrap.classList.toggle('open');
      });
    });
    const cl = host.querySelector('.assign-check-lst');
    if (cl) cl.querySelectorAll('li').forEach(function (li) {
      li.querySelector('input').addEventListener('change', function () {
        const st = checklistState();
        st[activeTask + '_' + li.dataset.i] = li.querySelector('input').checked;
        saveChecklist(st); li.classList.toggle('done', li.querySelector('input').checked);
        const card = host.querySelector('[data-task="' + activeTask + '"]');
        const bar = host.querySelector('[data-task="' + activeTask + '"] .p-bar i');
        if (bar && wt) { const n = wt.evidence.filter(function (_, i) { return checklistState()[activeTask + '_' + i]; }).length; bar.style.width = Math.round(n / wt.evidence.length * 100) + '%'; const em = card ? card.querySelector('em') : null; if (em) em.textContent = n + '/' + wt.evidence.length; }
      });
    });
    host.querySelectorAll('[data-brief]').forEach(function (b) { b.addEventListener('click', function () {
      const brief = SAMPLE_BRIEFS[+b.dataset.brief];
      if (brief && typeof window._openBrief === 'function') window._openBrief(brief);
      else if (typeof switchTab === 'function') switchTab(activeTask === 'task2' ? 'wireframe' : activeTask === 'task3' ? 'editor' : 'guide');
    }); });
  }

  window.initAssignmentHub = function () {
    const host = document.getElementById('assignment-hub');
    if (!host) return;
    render();
  };

  const WALKTHROUGHS = {
    task1: {
      summary: 'Research how real websites are planned and designed, write down what the client needs, then draw a site map that shows every page — annotated so it clearly meets the brief.',
      evidence: [
        'Client needs as a clean list (purpose, audience, tech)',
        '3 example websites — why their layout/nav works',
        'Law & ethics notes (copyright, privacy, accessibility)',
        'Content ideas you\'d add',
        'Annotated site map (use the Sitemap tool!)'
      ],
      steps: [
        '<b>1 · Read the brief like a detective</b> — highlight every "must" (pages, features, audience, tone).',
        '<b>2 · Research 3 similar sites</b> — screenshot + one line on what works/doesn\'t.',
        '<b>3 · Note the rules</b> — copyright, GDPR (no forms without privacy), accessibility.',
        '<b>4 · Plan the pages</b> — use the Sitemap tool so every requirement has a page.',
        '<b>5 · Annotate</b> — for each page add "meets: accordion, search…" so it scores D.'
      ]
    },
    task2: {
      summary: 'Sketch every page as a wireframe, pick a colour scheme + fonts, then gather and organise your images and other assets neatly.',
      evidence: [
        'A wireframe for every page (use the Wireframe tool!)',
        'Design style: colours, fonts, logo placement',
        'High-fidelity mockups of how pages look',
        'Assets with sources noted',
        'Asset log (names + where used)'
      ],
      steps: [
        '<b>1 · Wireframes first</b> — one per page, boxes only (header, nav, hero, forms).',
        '<b>2 · Pick a vibe</b> — 2-3 colours + 1 display / 1 body font. Contrast must pass!',
        '<b>3 · Mockups</b> — apply the style to your wireframes (Canva/Figma/editor).',
        '<b>4 · Source assets legally</b> — stock images with credit, or your own photos.',
        '<b>5 · Organise</b> — images/, css/, js/ folders, tidy names, keep files under 1MB.'
      ]
    },
    task3: {
      summary: 'Build the real website from your plan using HTML/CSS/JS, make it accessible and responsive, then test it properly and fix what you find.',
      evidence: [
        'The finished, working website (every page)',
        'Evidence you used tools (editor screenshots)',
        'Test plan: what you tested + result',
        'Usability test with a friend (their feedback)',
        'Self-review + the improvements you made'
      ],
      steps: [
        '<b>1 · Build page by page</b> — home first, then wire up navigation.',
        '<b>2 · Nail the features</b> — accordion, modal images, video with controls, form, search. Use the editor components!',
        '<b>3 · Accessible</b> — alt text, semantic tags, keyboard works, readable contrast.',
        '<b>4 · Responsive</b> — test phone / tablet / desktop widths.',
        '<b>5 · Test + fix</b> — make a test plan, click everything, fix what breaks, ask a friend to try it.'
      ]
    }
  };
})();