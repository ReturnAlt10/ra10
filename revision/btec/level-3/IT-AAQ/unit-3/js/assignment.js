/* Part 2 — Assignment Hub: step-by-step task guidance, sample brief documents,
   and AI Assigner marking of uploaded/typed submissions. */
(function () {
  let activeTaskCode = 'task1';

  function getTask(code) {
    return (window.ASSIGNMENT_TASKS || []).find((t) => t.code === code);
  }

  function renderStepper() {
    const host = document.getElementById('task-stepper');
    if (!host) return;
    host.innerHTML = (window.ASSIGNMENT_TASKS || []).map((t) =>
      '<button class="task-step-btn' + (t.code === activeTaskCode ? ' active' : '') + '" data-task="' + t.code + '"><b>' + esc(t.title) + '</b><span>Learning Aim ' + esc(t.aim) + '</span></button>'
    ).join('');
    host.querySelectorAll('.task-step-btn').forEach((btn) => {
      btn.addEventListener('click', () => { activeTaskCode = btn.dataset.task; renderStepper(); renderTaskDetail(); });
    });
  }

  function criteriaListHtml(list, cls) {
    return '<ul>' + list.map((c) => '<li><strong>' + esc(c.code) + '</strong> — ' + esc(c.text) + '</li>').join('') + '</ul>';
  }

  function renderTaskDetail() {
    const task = getTask(activeTaskCode);
    const host = document.getElementById('task-detail');
    if (!host || !task) return;
    host.innerHTML = '' +
      '<div class="card primary-card">' +
      '  <span class="card-tag">' + esc(task.title) + '</span>' +
      '  <p>' + esc(task.summary) + '</p>' +
      '  <div class="grade-ladder">' +
      '    <div class="grade-pill pass"><b>Pass</b>' + criteriaListHtml(task.criteria.pass) + '</div>' +
      '    <div class="grade-pill merit"><b>Merit (needs all Pass + this)</b>' + criteriaListHtml(task.criteria.merit) + '</div>' +
      '    <div class="grade-pill dist"><b>Distinction (needs all Pass + Merit + this)</b>' + criteriaListHtml(task.criteria.distinction) + '</div>' +
      '  </div>' +
      '  <div class="card-action-row">' +
      '    <button class="btn primary" data-view-sample="' + task.code + '">View sample brief document</button>' +
      '    <button class="btn ghost" data-goto-tab="editor">Open Code Editor</button>' +
      '    <button class="btn ghost" data-goto-tab="ai-hint" data-open-assigner="1">Ask AI Assigner for a hint</button>' +
      '  </div>' +
      '</div>' +
      '<div class="section-block" id="task-tips-block">' + renderTips(task) + '</div>' +
      '<div class="section-block" id="task-upload-block">' + renderUploadPanel(task) + '</div>';

    host.querySelector('[data-view-sample]')?.addEventListener('click', () => showSampleBrief(task));
    host.querySelector('[data-goto-tab="editor"]')?.addEventListener('click', () => switchTab('editor'));
    host.querySelector('[data-open-assigner]')?.addEventListener('click', () => window.toggleAiAssigner && window.toggleAiAssigner());
    wireUploadPanel(task);
  }

  function renderTips(task) {
    const tipsMap = {
      task1: [
        'Read the client brief carefully — highlight the target audience, purpose, required pages/features, and any style/brand hints.',
        'Use the Sitemap Builder to plan every page and how they link together before wireframing.',
        'Use the Wireframe Builder to sketch layouts for each unique page type (homepage, content page, contact page, etc.) — you don\'t need one per page if layouts repeat.',
        'Write a short house style guide: 2-3 brand colours, 1-2 fonts, logo placement, tone of voice.',
        'For Merit: explain WHY each legal/ethical/accessibility decision was made, referencing the actual brief.',
        'For Distinction: justify your choices by comparing at least one alternative you considered and rejected, and explain how your proposal serves different user needs (e.g. accessibility, different devices).',
      ],
      task2: [
        'Set up your file structure first: index.html, style.css, script.js, an /images folder.',
        'Build page-by-page following your wireframes from Task 1 — semantic HTML first, then CSS, then JavaScript interactivity.',
        'Add at least one genuinely interactive feature (form validation, image gallery, accordion/tabs, etc.) — not just a static page.',
        'Optimise images (resize/compress) before uploading them — mention what you did in your evidence.',
        'For Merit: keep your code consistent (naming, indentation) and make sure the finished pages closely match your wireframes.',
        'For Distinction: go further than the brief\'s minimum requirements where possible, and show efficient use of tools (e.g. reusable CSS classes, well-organised JS).',
      ],
      task3: [
        'Create a test plan BEFORE you test: list what you\'ll check (links, forms, responsiveness, browsers, accessibility).',
        'Test in at least two different browsers and on a mobile screen size (resize the Code Editor preview or use your phone).',
        'Record results in a simple table: Test / Expected / Actual / Pass-Fail / Fix made.',
        'Review your finished site against the ORIGINAL client brief from Task 1 — does it meet every requirement?',
        'For Merit: explain how you fixed each issue you found, linking back to specific requirements.',
        'For Distinction: critically evaluate your website\'s overall effectiveness AND reflect honestly on your own performance with specific, justified next steps for improvement.',
      ],
    };
    const tips = tipsMap[activeTaskCode] || [];
    return '<div class="section-block-head"><h2>Step-by-step to a Distinction</h2><span class="sb-eyebrow">Follow in order</span></div>' +
      '<ol style="padding-left:20px;font-size:13.5px;color:var(--ink-2);line-height:1.8">' + tips.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ol>';
  }

  function renderUploadPanel(task) {
    return '' +
      '<div class="section-block-head"><h2>Submit for AI Assigner feedback</h2><span class="sb-eyebrow">Optional — practise before your real submission</span></div>' +
      '<p style="font-size:13px;color:var(--ink-2)">Paste your written work below, or type a summary of your website/code, and AI Assigner will mark it against this task\'s Pass/Merit/Distinction criteria and tell you how to improve.</p>' +
      '<textarea id="task-submission-text" rows="8" style="width:100%;border:1px solid var(--line);border-radius:10px;padding:12px;font-family:var(--mono);font-size:13px;background:var(--surface);color:var(--ink)" placeholder="Paste your written explanation, design proposal text, or a description of your website/code here..."></textarea>' +
      '<div class="card-action-row"><button class="btn primary" id="task-submit-mark">Get AI Assigner feedback<span class="ra10-cost-label">8 credits</span></button></div>' +
      '<div id="task-mark-result" style="margin-top:14px"></div>';
  }

  function wireUploadPanel(task) {
    document.getElementById('task-submit-mark')?.addEventListener('click', async () => {
      const ta = document.getElementById('task-submission-text');
      const submission = ta ? ta.value.trim() : '';
      if (!submission) { alert('Please paste some work first.'); return; }
      if (!window.RA10 || !RA10.isLoggedIn()) { alert('Please sign in to use AI Assigner marking.'); return; }
      const resultHost = document.getElementById('task-mark-result');
      const btn = document.getElementById('task-submit-mark');
      btn.disabled = true;
      resultHost.innerHTML = '<p style="color:var(--muted)">Marking your work…</p>';
      try {
        const res = await RA10.markAssignment({
          submission,
          taskTitle: task.title,
          criteria: task.criteria,
        });
        renderMarkResult(res.result);
      } catch (e) {
        resultHost.innerHTML = '<p style="color:#dc2626">' + esc(e && e.message ? e.message : 'Marking failed.') + '</p>';
      } finally {
        btn.disabled = false;
        updateCostLabels();
      }
    });
  }

  function renderMarkResult(result) {
    const host = document.getElementById('task-mark-result');
    if (!host) return;
    const gradeColour = { 'Not yet met': '#dc2626', Pass: '#65a30d', Merit: '#d97706', Distinction: '#7c3aed' }[result.grade] || '#666';
    host.innerHTML = '' +
      '<div class="card">' +
      '  <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">' +
      '    <span style="font-weight:800;font-size:16px;color:' + gradeColour + '">' + esc(result.grade) + '</span>' +
      '  </div>' +
      '  <p style="font-size:13.5px">' + esc(result.feedback) + '</p>' +
      (result.criteriaMet && result.criteriaMet.length ? '<div style="margin:12px 0">' + result.criteriaMet.map((c) =>
        '<div class="criteria-check"><b>' + esc(c.code) + '</b><span>' + (c.met ? '✅ ' : '❌ ') + esc(c.comment) + '</span></div>'
      ).join('') + '</div>' : '') +
      (result.strengths && result.strengths.length ? '<h4 style="margin:12px 0 4px;font-size:13px">Strengths</h4><ul style="font-size:13px;color:var(--ink-2)">' + result.strengths.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul>' : '') +
      (result.improvements && result.improvements.length ? '<h4 style="margin:12px 0 4px;font-size:13px">Improve next</h4><ul style="font-size:13px;color:var(--ink-2)">' + result.improvements.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul>' : '') +
      (result.nextGradeFocus ? '<div style="margin-top:10px;padding:10px 12px;border-radius:10px;background:var(--accent-2);color:var(--accent-ink);font-size:13px"><strong>To reach the next grade:</strong> ' + esc(result.nextGradeFocus) + '</div>' : '') +
      '</div>';
  }

  /* ── Sample brief document (Pearson-style, view-only, generated) ── */
  const SAMPLE_BRIEFS = {
    task1: {
      client: 'Riverside Community Café',
      brief: 'Riverside Community Café is a small independent café that wants a new website to attract more customers, show its menu and opening hours, and let customers get in touch. They want a warm, welcoming style using their brand colours (deep green and cream) and need the site to be accessible to older customers and screen-reader users.',
      deliverables: ['A sitemap showing the planned page structure', 'Wireframes for the homepage and one other page type', 'A short house style guide (colours, fonts, tone)', 'A written justification of your design decisions, referencing legal/ethical/accessibility considerations'],
    },
    task2: {
      client: 'Riverside Community Café',
      brief: 'Using your Task 1 design proposal, build a working multi-page website for Riverside Community Café using HTML, CSS and JavaScript. Include at least one interactive feature (e.g. a simple contact form with validation, or an image gallery of the café).',
      deliverables: ['A working website (multiple linked pages)', 'At least one interactive JavaScript feature', 'Appropriately optimised images', 'Evidence of your build process (screenshots/code)'],
    },
    task3: {
      client: 'Riverside Community Café',
      brief: 'Test your finished website thoroughly, document your results, and review the website against the original client brief. Reflect honestly on your own performance and suggest specific improvements.',
      deliverables: ['A test plan and results log', 'A review against the Task 1 client requirements', 'A reflective statement on your own performance', 'Suggestions for further improvement'],
    },
  };

  function showSampleBrief(task) {
    const sample = SAMPLE_BRIEFS[task.code];
    if (!sample) return;
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;overflow:auto;';
    overlay.innerHTML = '' +
      '<div style="max-height:90vh;overflow:auto;position:relative;">' +
      '  <button id="sample-close" style="position:absolute;top:-14px;right:-14px;width:32px;height:32px;border-radius:50%;background:#fff;border:1px solid #ccc;cursor:pointer;z-index:2">✕</button>' +
      '  <div class="doc-preview">' +
      '    <h1>Pearson BTEC Level 3 — IT Unit 3: Website Development</h1>' +
      '    <div class="doc-sub">Sample Assignment Brief — ' + esc(task.title) + '</div>' +
      '    <p><strong>Client:</strong> ' + esc(sample.client) + '</p>' +
      '    <p><strong>Scenario / Brief:</strong> ' + esc(sample.brief) + '</p>' +
      '    <p><strong>You must produce:</strong></p>' +
      '    <ul>' + sample.deliverables.map((d) => '<li>' + esc(d) + '</li>').join('') + '</ul>' +
      '    <p style="font-size:12px;color:#666;margin-top:20px">This is a sample/practice brief for skills development only — not a real assessed assignment. Use it to practise before your actual assignment is issued by your teacher.</p>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector('#sample-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  window.renderAssignmentHub = function () {
    renderStepper();
    renderTaskDetail();
  };
})();
