/* Part 2 â€” Assignment Hub (redesigned, calm & simple).
   One big "where am I?" view: 3 task cards â†’ pick a task â†’ see
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
    return code === 'task2' ? 'ðŸŽ¨' : code === 'task3' ? 'ðŸ› ï¸' : 'ðŸ—ºï¸';
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

    if (!tasks.length) { host.innerHTML = '<p class="muted">Assignment data is still loadingâ€¦</p>'; return; }

    let html = '';

    // 1. Big friendly picker
    html += '<div class="assign-pick">' +
      '<div class="assign-pick-top"><p class="assign-eyebrow">Your assignment has 3 tasks â€” tap one to see exactly what to do.</p>' +
      '<button class="btn assign-pdf-btn" id="assign-pdf-btn" title="Open the full Pearson-style assignment brief as a print-ready PDF"><span class="pdf-ico">ðŸ“„</span> Full assignment (PDF)</button></div>' +
      '<div class="assign-task-cards">' + tasks.map(function (task) {
        const wt2 = getWalkthrough(task.code);
        const done = (wt2 && wt2.evidence ? wt2.evidence.length : 0);
        const checked = wt2 ? wt2.evidence.filter(function (_, i) { return checklistState()[task.code + '_' + i]; }).length : 0;
        return '<button class="assign-card' + (task.code === activeTask ? ' active' : '') + '" data-task="' + esc(task.code) + '">' +
          '<span class="assign-card-ico">' + taskIcon(task.code) + '</span>' +
          '<span class="assign-card-tx"><b>Task ' + task.code.slice(-1) + ' Â· ' + taskShort(task.code) + '</b>' +
          '<small>' + esc(task.title) + '</small></span>' +
          (wt2 ? '<span class="assign-card-prog"><span class="p-bar"><i style="width:' + (done ? Math.round(checked / done * 100) : 0) + '%"></i></span><em>' + checked + '/' + done + '</em></span>' : '') +
          '</button>';
      }).join('') + '</div>' +
      '</div>';

    // 2. The action panel for the active task
    html += '<div class="assign-panel" id="assign-panel">';

    // What you'll make
    html += '<div class="assign-what">' +
      '<div class="aw-hd"><span class="aw-ico">' + taskIcon(activeTask) + '</span><div><b>What you\'ll make</b><small>One short paragraph â€” no essay.</small></div></div>' +
      '<p>' + esc(wt ? wt.summary : '') + '</p>' +
      '</div>';

    // Big action buttons
    html += '<div class="assign-cta">' +
      '<button class="btn primary big assign-go" data-goto="' + (activeTask === 'task2' ? 'wireframe' : activeTask === 'task3' ? 'editor' : 'guide') + '">' +
        taskVerb(activeTask) +
        '<small>' + (activeTask === 'task2' ? 'open the wireframe tool' : activeTask === 'task3' ? 'open the code editor' : 'open the study guide') + '</small></button>' +
      '<button class="btn big assign-ai" data-goto="ai">Ask AI Assigner<small>hints Â· ' + costLabel('ai_assigner_hint') + '</small></button>' +
      '</div>';

    // Step-by-step, collapsible (default open)
    html += '<div class="assign-steps open">' +
      '<button class="as-toggle" data-target="as-steps"><span>ðŸ‘£ Step-by-step</span><span class="as-cherr">â–¾</span></button>' +
      '<div class="as-body open" id="as-steps">' +
      (wt && wt.steps ? wt.steps.map(function (s) { return '<div class="as-step">' + s + '</div>'; }).join('') : '') +
      '</div></div>';

    // Checklist
    html += '<div class="assign-chck" id="assign-checklist">' +
      '<div class="ach-hd"><b>âœ… Submission checklist</b><span class="small muted">' + (wt ? wt.evidence.length : 0) + ' things to tick off</span></div>' +
      '<ul class="assign-check-lst">' + (wt ? wt.evidence.map(function (item, i) {
        const done = checklistState()[activeTask + '_' + i];
        return '<li class="' + (done ? 'done' : '') + '" data-i="' + i + '"><input type="checkbox" ' + (done ? 'checked' : '') + '><span>' + esc(item) + '</span></li>';
      }).join('') : '') + '</ul></div>';

    // Grade ladder â€” short
    html += '<div class="assign-grades">' +
      '<div class="ag-hd"><b>How you\'re graded</b><small>Pass â†’ Merit â†’ Distinction â€” each builds on the last.</small></div>' +
      '<div class="ag-rows">' + (CRITERIA && CRITERIA.gradeDescriptions && CRITERIA.gradeDescriptions[activeTask] ? ['Pass', 'Merit', 'Distinction'].map(function (g) {
        return '<div class="ag-row ' + g.toLowerCase() + '"><span class="ag-badge">' + g + '</span><p class="small">' + esc(CRITERIA.gradeDescriptions[activeTask][g]) + '</p></div>';
      }).join('') : '') + '</div></div>';

    // Sample briefs (collapsible, closed)
    const briefs = SAMPLE_BRIEFS || [];
    if (briefs.length) {
      html += '<div class="assign-bref">' +
        '<button class="as-toggle" data-target="as-briefs"><span>ðŸ“„ Try a practice brief</span><span class="as-cherr">â–¾</span></button>' +
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
      if (brief && typeof window._openBrief === 'function') { window._openBrief(brief, activeTask); }
    }); });
    const pdfBtn = host.querySelector('#assign-pdf-btn');
    if (pdfBtn) pdfBtn.addEventListener('click', function () {
      if (typeof window._openAssignmentPdf === 'function') window._openAssignmentPdf();
    });
  }

  /* â”€â”€ Full Pearson-style assignment brief (PDF / print) â”€â”€
     Replicates the format of the real Pearson Set Assignment Brief
     (like W80502A): header, instructions, introductory context with
     must-includes, then each task with its instructions, evidence
     required and the Pass/Merit/Distinction criteria table. Opens a
     print-ready window so learners can Save As PDF. */
  window._openAssignmentPdf = function () {
    const tasks = (CRITERIA && CRITERIA.tasks) || [];
    const brief = ((SAMPLE_BRIEFS && SAMPLE_BRIEFS[0]) || {});
    const wt = function (code) { return WALKTHROUGHS[code] || null; };

    function escp(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    // Scenario for each task (based on walkthrough summary/steps plus criteria)
    function taskScenario(task) {
      const code = task.code;
      const map = {
        task1: 'Explore the purposes and principles of website development for the given client brief. Establish the client\u2019s requirements, then research existing websites that serve the same purpose, and the legal and ethical constraints. Use website development principles to analyse how your chosen websites meet their purpose and appeal to their intended audience. Develop ideas for content that meets the client\u2019s requirements and explain how the content meets legal and ethical constraints. Produce a detailed and annotated site map to demonstrate how your proposed website will meet the client\u2019s requirements.',
        task2: 'Use web design skills and techniques to plan a website in response to the client brief. Create visual representations of the web pages, a wireframe for each web page, and the visual style of the website. Review the fitness for purpose of your designs and make improvements based on the outcomes of your review. Use asset management techniques to create, source, prepare and manage the assets for your website.',
        task3: 'Develop a website in response to the client brief. Use your site map, designs and assets to develop a website that meets all the client\u2019s requirements, using website development tools, techniques and processes. Engage in a testing and review process that includes functionality testing, usability testing and making any required refinements.'
      };
      return map[code] || '';
    }

    function evidenceFor(task) {
      const code = task.code;
      if (code === 'task1') return ['An annotated site map.', 'A written response with supporting images (or an edited audio/video recording, or a presentation slide deck with speaker notes).'];
      if (code === 'task2') return ['A wireframe for each web page.', 'Visual designs for the website.', 'Visual representations of the web pages.', 'Original and sourced assets.', 'Evidence of asset management.'];
      return ['Evidence of engagement with website development tools, techniques and processes.', 'Evidence of functionality and usability testing.', 'Outcomes of the self-review process.', 'The final website â€” web pages must be viewable in common web browsers.'];
    }

    function criteriaTable(task, label) {
      const rows = (Array.isArray(task.criteria) ? task.criteria : []);
      const order = { Pass: 0, Merit: 1, Distinction: 2 };
      const byGrade = { Pass: [], Merit: [], Distinction: [] };
      rows.forEach(function (c) { if (byGrade[c.level]) byGrade[c.level].push(c); });
      const cols = ['Pass', 'Merit', 'Distinction'];
      const maxRows = Math.max.apply(null, cols.map(function (g) { return byGrade[g].length; }));
      let h = '<table class="crit"><thead><tr>';
      cols.forEach(function (g) { h += '<th>' + g + '</th>'; });
      h += '</tr></thead><tbody>';
      for (let i = 0; i < maxRows; i++) {
        h += '<tr>';
        cols.forEach(function (g) {
          const c = byGrade[g][i];
          h += '<td>' + (c ? '<b>' + escp(c.code) + '</b> ' + escp(c.text) : '') + '</td>';
        });
        h += '</tr>';
      }
      h += '</tbody></table>';
      return h;
    }

    const contextTitle = brief.title || 'Retro Entertainment Website';
    const contextBlurb = brief.scenario || 'Produce a retro entertainment website. The aim of the website is to introduce an audience of specific 17- to 23-year-olds to entertainment from the past. The website must be responsive to mobile devices.';
    const mustIncludes = (Array.isArray(brief.mustIncludes) && brief.mustIncludes.length)
      ? brief.mustIncludes
      : ['three pages', 'drop-down menus', 'information about your selected entertainment from the past', 'an accordion', 'external links to relevant websites', 'a form to request specific content', 'modal images', 'video content with controls', 'search functionality', 'accessibility features'];

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    let h = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" />';
    h += '<title>Pearson BTEC Level 3 AAQ in IT - Unit 3: Website Development - Assignment Brief</title>';
    h += '<style>'
      + '@page { size: A4; margin: 14mm 15mm; }'
      + 'body { font-family: Arial, Helvetica, sans-serif; font-size: 10.5pt; color: #111; line-height: 1.42; margin: 0; padding: 0; }'
      + '.paper { max-width: 100%; }'
      + '.masthead { border-top: 5px solid #00247d; padding-top: 8px; margin-bottom: 6px; overflow: hidden; }'
      + '.masthead h1 { font-size: 15pt; margin: 2px 0; }'
      + '.masthead .sub { font-size: 10pt; color: #333; }'
      + '.paper-code { float: right; font-weight: 700; letter-spacing: .5px; font-size: 12pt; color:#00247d; }'
      + '.meta { font-size: 10pt; color: #333; border-bottom: 1px solid #bbb; padding: 2px 0 6px; margin-bottom: 4px; }'
      + 'h2 { font-size: 13pt; margin: 16px 0 4px; color: #00247d; border-bottom: 1px solid #00247d; padding-bottom: 2px; }'
      + 'h3 { font-size: 12pt; margin: 12px 0 4px; }'
      + 'p { margin: 5px 0; } ul, ol { margin: 4px 0 4px 20px; padding: 0; } li { margin: 2px 0; }'
      + '.task { border: 1.2px solid #aab4c4; border-top: 3px solid #00247d; padding: 10px 14px; margin: 14px 0; }'
      + '.task h3 { margin-top: 0; }'
      + '.crit { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 9pt; table-layout: fixed; }'
      + '.crit th { background: #00247d; color: #fff; padding: 5px 7px; text-align: left; font-size: 9.5pt; }'
      + '.crit td { border: 1px solid #aab4c4; padding: 5px 7px; vertical-align: top; }'
      + '.evid { border-left: 4px solid #00247d; background: #f4f6fa; padding: 7px 10px; margin: 8px 0; }'
      + '.evid b { font-size: 10pt; display: block; margin-bottom: 4px; }'
      + '.btnrow { text-align: right; margin: 14px 0; }'
      + '.screen-btn { font: inherit; font-weight: 700; padding: 8px 16px; cursor: pointer; background: #00247d; color: #fff; border: none; border-radius: 6px; }'
      + '.screen-btn.sec { background: #fff; color: #00247d; border: 1px solid #00247d; margin-right: 8px; }'
      + '@media print { .btnrow { display: none; } }'
      + '</style></head><body><div class="paper">';

    h += '<div class="btnrow no-print"><button class="screen-btn sec" onclick="window.close()">Close</button><button class="screen-btn" onclick="window.print()">Print / Save as PDF</button></div>';

    h += '<div class="masthead"><span class="paper-code">W80502A</span>'
      + '<h1>Pearson BTEC Level 3 AAQ BTEC National in IT</h1>'
      + '<div class="sub">Unit 3: Website Development &mdash; Pearson Set Assignment Brief</div>'
      + '</div>';
    h += '<div class="meta">Internal unit &middot; estimated 15 hours &middot; Assessment window: ' + escp(dateStr) + ' &middot; Practice replica &mdash; not the live Pearson paper.</div>';

    h += '<h2>Instructions for students</h2>'
      + '<p><b>Read the brief carefully.</b> This Pearson Set Assignment Brief consists of 3 tasks. You must submit evidence for each task.</p>'
      + '<ul>'
      + '<li>Work independently and do not share your work with other students. All evidence must be your own.</li>'
      + '<li>Clearly identify and reference any material created by others, including the source. Using others&#39; work without acknowledgement is plagiarism and can result in disqualification.</li>'
      + '<li>You may ask your teacher for support about the requirements of the tasks and what evidence to produce, but teachers cannot give you feedback on how to improve your work.</li>'
      + '</ul>';

    h += '<h2>Introductory context</h2>';
    h += '<p><strong>Produce a website for:</strong> ' + escp(contextTitle) + '.</p>';
    h += '<p>' + escp(contextBlurb) + '</p>';
    h += '<div class="evid"><b>The website must be responsive to mobile devices and include:</b><ul>'
      + mustIncludes.map(function (mi) { return '<li>' + escp(mi) + '</li>'; }).join('')
      + '</ul></div>';

    h += '<h2>Tasks</h2>';
    tasks.forEach(function (task) {
      const code = task.code;
      const num = String(code).replace('task', '');
      const w = WALKTHROUGHS[code];
      if (!w) return;
      h += '<div class="task">';
      h += '<h3>Task ' + num + ' &mdash; ' + escp(task.title) + '</h3>';
      h += '<p>' + escp(taskScenario(code)) + '</p>';
      h += '<div class="evid"><b>Evidence required:</b><ul>'
        + evidenceFor(code).map(function (e) { return '<li>' + escp(e) + '</li>'; }).join('')
        + '</ul></div>';
      h += '<b>Assessment criteria for this task</b>' + criteriaTable(task);
      if (w && w.steps && w.steps.length) { h += '<p class="muted small">Guidance: ' + escp(w.steps[0]) + (w.steps.length > 1 ? ' ' + escp(w.steps.slice(1).join(' ')) : '') + '</p>'; }
      h += '</div>';
    });

    h += '<div class="meta" style="margin-top:14px">This is a practice replica produced by RA10 for revision. It mirrors the format of the real Pearson Set Assignment Brief (W80502A) but is not an official Pearson document.</div>';
    h += '</div></body></html>';

    try {
      const w2 = window.open('', '_blank');
      if (w2) { w2.document.write(h); w2.document.close(); }
      else alert('Please allow pop-ups to view the assignment brief as a PDF.');
    } catch (e) { alert('Could not open the assignment brief. ' + (e && e.message ? e.message : '')); }
  }

  /* â”€â”€ Practice brief viewer â”€â”€
     Opens the full client brief in a modal: scenario, purpose,
     target audience, must-include features + hints. From here the
     student can jump straight into the matching tool. */
  window._openBrief = function (brief, taskCode) {
    const t = taskCode || activeTask || 'task1';
    const dest = t === 'task2' ? 'wireframe' : t === 'task3' ? 'editor' : 'guide';
    const destLabel = t === 'task2' ? 'Open the Wireframe tool' : t === 'task3' ? 'Open the Code Editor' : 'Open the Study Guide';
    const tabs = ['details', 'must-haves', 'hints', 'start'];
    let tab = 'details';

    const modal = document.createElement('div');
    modal.className = 'brief-modal';
    modal.innerHTML =
      '<div class="brief-modal-backdrop"></div>' +
      '<div class="brief-modal-card" role="dialog" aria-modal="true" aria-label="Practice brief: ' + esc(brief.title) + '">' +
        '<div class="brief-m-head">' +
          '<img class="brief-m-logo" src="/logo.png" alt="" onerror="this.style.display=\'none\'">' +
          '<div class="brief-m-titles"><b>Practice brief</b><span>' + esc(brief.title) + ' Â· ' + esc(brief.audience) + '</span></div>' +
          '<button class="brief-m-x" aria-label="Close">âœ•</button>' +
        '</div>' +
        '<div class="brief-m-tabs">' +
          tabs.map(function (tt) {
            return '<button class="brief-m-tab' + (tt === tab ? ' active' : '') + '" data-btab="' + tt + '">' +
              ({ details: 'The Brief', 'must-haves': 'Must-includes', hints: 'Design hints', start: 'Start' })[tt] + '</button>';
          }).join('') +
        '</div>' +
        '<div class="brief-m-body" id="brief-m-body"></div>' +
        '<div class="brief-m-foot">' +
          '<button class="btn" data-bdict="archive">Save for later</button>' +
          '<button class="btn primary" data-bstart="1">' + destLabel + ' â†’</button>' +
        '</div>' +
      '</div>';

    function renderBody() {
      const body = modal.querySelector('#brief-m-body');
      let h = '';
      if (tab === 'details') {
        h += '<h4>Scenario</h4><p>' + esc(brief.scenario) + '</p>';
        h += '<h4>Purpose</h4><p>' + esc(brief.purpose) + '</p>';
        h += '<h4>Target audience</h4><p>' + esc(brief.targetAudience) + '</p>';
      } else if (tab === 'must-haves') {
        h += '<h4>Must-include features</h4><ul class="brief-m-list">' +
          (Array.isArray(brief.mustIncludes) ? brief.mustIncludes.map(function (mi) { return '<li>' + esc(mi) + '</li>'; }).join('') : '') +
          '</ul>';
      } else if (tab === 'hints') {
        if (brief.typographyHint) h += '<h4>Typography</h4><p>' + esc(brief.typographyHint) + '</p>';
        if (brief.colourHint) h += '<h4>Colour palette</h4><p>' + esc(brief.colourHint) + '</p>';
        if (!brief.typographyHint && !brief.colourHint) h += '<p class="muted">No design hints given â€” decide these yourself.</p>';
      } else if (tab === 'start') {
        h += '<div class="brief-m-start">';
        h += '<p>You\u2019re on <b>' + (t === 'task2' ? 'Task 2 â€” design' : t === 'task3' ? 'Task 3 â€” build' : 'Task 1 â€” planning') + '</b>. Jump straight in, or ask AI Assigner to coach you through this brief.</p>';
        h += '</div>';
      }
      body.innerHTML = h;
    }

    function close() {
      modal.remove();
      document.removeEventListener('keydown', escHandler);
    }
    function escHandler(e) { if (e.key === 'Escape' || e.key === 'Esc') close(); }

    modal.addEventListener('click', function (e) {
      const tabBtn = e.target.closest('.brief-m-tab');
      if (tabBtn) { tab = tabBtn.dataset.btab; renderBody(); return; }
      if (e.target.closest('.brief-m-x')) { close(); return; }
      if (e.target.closest('[data-bstart]')) { close(); if (typeof switchTab === 'function') switchTab(dest); return; }
      if (e.target.closest('[data-bdict]')) { try { localStorage.setItem('ra10_u3_last_brief', JSON.stringify({ title: brief.title, audience: brief.audience, at: Date.now() })); } catch (e2) {} close(); return; }
      if (e.target.classList.contains('brief-modal-backdrop')) { close(); }
    });
    document.addEventListener('keydown', escHandler);

    renderBody();
    document.body.appendChild(modal);
  };

  window.initAssignmentHub = function () {
    const host = document.getElementById('assignment-hub');
    if (!host) return;
    render();
    // If data hasn't finished loading yet, re-render the moment it arrives
    if (typeof onDataReady === 'function' && !(typeof DATA_READY === 'boolean' && DATA_READY)) {
      onDataReady(function () { render(); });
    }
  };

  const WALKTHROUGHS = {
    task1: {
      summary: 'Research how real websites are planned and designed, write down what the client needs, then draw a site map that shows every page â€” annotated so it clearly meets the brief.',
      evidence: [
        'Client needs as a clean list (purpose, audience, tech)',
        '3 example websites â€” why their layout/nav works',
        'Law & ethics notes (copyright, privacy, accessibility)',
        'Content ideas you\'d add',
        'Annotated site map (use the Sitemap tool!)'
      ],
      steps: [
        '<b>1 Â· Read the brief like a detective</b> â€” highlight every "must" (pages, features, audience, tone).',
        '<b>2 Â· Research 3 similar sites</b> â€” screenshot + one line on what works/doesn\'t.',
        '<b>3 Â· Note the rules</b> â€” copyright, GDPR (no forms without privacy), accessibility.',
        '<b>4 Â· Plan the pages</b> â€” use the Sitemap tool so every requirement has a page.',
        '<b>5 Â· Annotate</b> â€” for each page add "meets: accordion, searchâ€¦" so it scores D.'
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
        '<b>1 Â· Wireframes first</b> â€” one per page, boxes only (header, nav, hero, forms).',
        '<b>2 Â· Pick a vibe</b> â€” 2-3 colours + 1 display / 1 body font. Contrast must pass!',
        '<b>3 Â· Mockups</b> â€” apply the style to your wireframes (Canva/Figma/editor).',
        '<b>4 Â· Source assets legally</b> â€” stock images with credit, or your own photos.',
        '<b>5 Â· Organise</b> â€” images/, css/, js/ folders, tidy names, keep files under 1MB.'
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
        '<b>1 Â· Build page by page</b> â€” home first, then wire up navigation.',
        '<b>2 Â· Nail the features</b> â€” accordion, modal images, video with controls, form, search. Use the editor components!',
        '<b>3 Â· Accessible</b> â€” alt text, semantic tags, keyboard works, readable contrast.',
        '<b>4 Â· Responsive</b> â€” test phone / tablet / desktop widths.',
        '<b>5 Â· Test + fix</b> â€” make a test plan, click everything, fix what breaks, ask a friend to try it.'
      ]
    }
  };
})();
