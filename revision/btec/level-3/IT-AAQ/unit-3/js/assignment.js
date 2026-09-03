/* Part 2 — Assignment Hub.
   Top: 3 downloadable sample assignment PDFs.
   Below: an interactive step-by-step guide showing exactly what
   Pearson wants to see for each task (Pass / Merit / Distinction). */
(function () {
  'use strict';

  var activeTask = 'task1';
  var CHECKLIST_KEY = 'ra10_u3_checklist';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function icon(cp) { return String.fromCodePoint(cp); }

  function getTask(code) {
    if (!CRITERIA || !CRITERIA.tasks) return null;
    return CRITERIA.tasks.find(function (t) { return t.code === code; });
  }
  function getWalkthrough(code) { return WALKTHROUGHS[code] || null; }
  function checklistState() { try { return JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '{}'); } catch (e) { return {}; } }
  function saveChecklist(s) { try { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(s)); } catch (e) {} }

  function costLabel(action) {
    var c = (typeof window._ra10GetActionCost === 'function') ? window._ra10GetActionCost(action) : 0;
    return c + ' credits';
  }

  function taskIcon(code) {
    return code === 'task2' ? icon(0x1F3A8) : code === 'task3' ? icon(0x1F6E0) + icon(0xFE0F) : icon(0x1F5FA) + icon(0xFE0F);
  }
  function taskShort(code) {
    return code === 'task1' ? 'Research + plan the site' : code === 'task2' ? 'Design the look + assets' : 'Build + test the site';
  }
  function taskVerb(code) {
    return code === 'task1' ? 'Start planning' : code === 'task2' ? 'Start designing' : 'Start building';
  }

  function structureTip(code) {
    if (code === 'task1') {
      return 'Write it in four clear sections with headings: 1) Client requirements (purpose, audience, features), 2) Research on 3 similar websites (what works and why), 3) Legal &amp; ethical constraints (copyright, GDPR, accessibility), 4) Your content ideas and an annotated site map that maps every page to a requirement.';
    }
    if (code === 'task2') {
      return 'Produce, in order: 1) a wireframe for every page, 2) the visual style (colour palette, fonts, logo) with justification, 3) high-fidelity mockups, 4) an asset log listing every asset, its source and where it is used. Then review the designs against the brief and show the improvements you made.';
    }
    return 'Build the site page by page from your plan, then document: 1) the tools and techniques you used (with screenshots), 2) a functionality test plan (expected vs actual result for every feature), 3) a usability test (ask someone to try it and record their feedback), 4) a self-review listing the refinements you then made.';
  }

  function render() {
    var host = document.getElementById('assignment-hub');
    if (!host) return;
    var tasks = (CRITERIA && CRITERIA.tasks) || [];
    var t = getTask(activeTask) || tasks[0];
    var wt = getWalkthrough(activeTask);

    if (!tasks.length) { host.innerHTML = '<p class="muted">Assignment data is still loading\u2026</p>'; return; }

    var html = '';

    // ── 1. Three sample assignment PDFs ─────────────────────
    var briefs = SAMPLE_BRIEFS || [];
    html += '<div class="assign-samples">' +
      '<div class="assign-samples-hd"><h3>Sample Assignments</h3>' +
      '<p>Download a full Pearson-style assignment brief to work on. Each one is a realistic practice scenario with the real task instructions and Pass/Merit/Distinction criteria.</p></div>' +
      '<div class="assign-sample-grid">' +
      (briefs.length ? briefs.map(function (b, i) {
        return '<div class="assign-sample-card">' +
          '<div class="as-pdf-ico">' + icon(0x1F4C4) + '</div>' +
          '<div class="as-pdf-info"><b>' + esc(b.title) + '</b><small>' + esc(b.audience) + '</small></div>' +
          '<div class="as-pdf-actions">' +
            '<button class="btn primary assign-sample-dl" data-brief="' + i + '">' + icon(0x1F4C4) + ' Open PDF</button>' +
            '<button class="btn assign-sample-view" data-brief="' + i + '">View</button>' +
          '</div>' +
          '</div>';
      }).join('') : '<p class="muted">Sample assignments are loading\u2026</p>') +
      '</div></div>';

    // ── 2. Interactive step-by-step guide ───────────────────
    html += '<div class="assign-pick">' +
      '<p class="assign-eyebrow">Your assignment has 3 tasks. Work through each one \u2014 the guide shows you exactly what Pearson wants to see.</p>' +
      '<div class="assign-task-cards">' + tasks.map(function (task) {
        var wt2 = getWalkthrough(task.code);
        var done = (wt2 && wt2.evidence ? wt2.evidence.length : 0);
        var checked = wt2 ? wt2.evidence.filter(function (_, i) { return checklistState()[task.code + '_' + i]; }).length : 0;
        return '<button class="assign-card' + (task.code === activeTask ? ' active' : '') + '" data-task="' + esc(task.code) + '">' +
          '<span class="assign-card-ico">' + taskIcon(task.code) + '</span>' +
          '<span class="assign-card-tx"><b>Task ' + task.code.slice(-1) + ' \u00B7 ' + taskShort(task.code) + '</b>' +
          '<small>' + esc(task.title) + '</small></span>' +
          (wt2 ? '<span class="assign-card-prog"><span class="p-bar"><i style="width:' + (done ? Math.round(checked / done * 100) : 0) + '%"></i></span><em>' + checked + '/' + done + '</em></span>' : '') +
          '</button>';
      }).join('') + '</div>' +
      '</div>';

    // Task detail panel
    html += '<div class="assign-panel" id="assign-panel">';

    html += '<div class="assign-what">' +
      '<div class="aw-hd"><span class="aw-ico">' + taskIcon(activeTask) + '</span><div><b>What you\'ll make</b><small>One clear outcome \u2014 no essay.</small></div></div>' +
      '<p>' + esc(wt ? wt.summary : '') + '</p>' +
      '</div>';

    html += '<div class="assign-cta">' +
      '<button class="btn primary big assign-go" data-goto="' + (activeTask === 'task2' ? 'wireframe' : activeTask === 'task3' ? 'editor' : 'guide') + '">' +
        taskVerb(activeTask) +
        '<small>' + (activeTask === 'task2' ? 'open the wireframe tool' : activeTask === 'task3' ? 'open the code editor' : 'open the study guide') + '</small></button>' +
      '<button class="btn big assign-ai" data-goto="ai">Ask AI Assigner<small>hints \u00B7 ' + costLabel('ai_assigner_hint') + '</small></button>' +
      '</div>';

    // Step-by-step (default open)
    html += '<div class="assign-steps open">' +
      '<button class="as-toggle" data-target="as-steps"><span>' + icon(0x1F463) + ' Step-by-step</span><span class="as-cherr">\u25BE</span></button>' +
      '<div class="as-body open" id="as-steps">' +
      (wt && wt.steps ? wt.steps.map(function (s) { return '<div class="as-step">' + s + '</div>'; }).join('') : '') +
      '</div></div>';

    // What Pearson wants to see (criteria with codes)
    var crits = (t && t.criteria) ? t.criteria : [];
    html += '<div class="assign-criteria">' +
      '<div class="acr-hd"><b>' + icon(0x1F3AF) + ' What Pearson wants to see</b><span class="small muted">The assessment criteria for this task</span></div>' +
      '<div class="acr-cols">' +
      ['Pass', 'Merit', 'Distinction'].map(function (level) {
        var items = crits.filter(function (c) { return c.level === level; });
        return '<div class="acr-col acr-' + level.toLowerCase() + '"><span class="acr-badge">' + level + '</span>' +
          (items.length ? items.map(function (c) { return '<div class="acr-item"><b>' + esc(c.code) + '</b> ' + esc(c.text) + '</div>'; }).join('') : '<p class="muted">\u2014</p>') +
          '</div>';
      }).join('') +
      '</div></div>';

    // Checklist
    html += '<div class="assign-chck" id="assign-checklist">' +
      '<div class="ach-hd"><b>' + icon(0x2705) + ' Submission checklist</b><span class="small muted">' + (wt ? wt.evidence.length : 0) + ' things to tick off</span></div>' +
      '<ul class="assign-check-lst">' + (wt ? wt.evidence.map(function (item, i) {
        var done = checklistState()[activeTask + '_' + i];
        return '<li class="' + (done ? 'done' : '') + '" data-i="' + i + '"><input type="checkbox" ' + (done ? 'checked' : '') + '><span>' + esc(item) + '</span></li>';
      }).join('') : '') + '</ul></div>';

    // How to write & improve this task
    html += '<div class="assign-guide">' +
      '<div class="asg-hd"><b>' + icon(0x1F4D8) + ' How to write &amp; improve this task</b><span class="small muted">Read this before you start \u2014 it turns a Pass into a Distinction</span></div>' +
      '<div class="asg-grid">' +
        '<div class="asg-card asg-structure">' +
          '<h4>' + icon(0x1F4CB) + ' How to structure it</h4>' +
          '<p>' + structureTip(activeTask) + '</p>' +
        '</div>' +
        '<div class="asg-card asg-distinction">' +
          '<h4>' + icon(0x1F3C6) + ' How to reach Distinction</h4>' +
          '<ul>' +
            '<li><b>Cover every requirement</b> \u2014 Distinction means comprehensive, not just good. Tick the brief off one by one.</li>' +
            '<li><b>Justify every decision</b> \u2014 say why (with reference to the brief and the target audience), don\u2019t just describe what.</li>' +
            '<li><b>Use accurate technical vocabulary</b> \u2014 e.g. \u201Cresponsive layout\u201D, \u201Csemantic HTML\u201D, \u201CWCAG\u201D, \u201Ccontrast ratio\u201D.</li>' +
            '<li><b>Show the review cycle</b> \u2014 before \u2192 feedback \u2192 after, so the examiner sees you improved it.</li>' +
          '</ul>' +
        '</div>' +
        '<div class="asg-card asg-mistakes">' +
          '<h4>' + icon(0x26A0) + icon(0xFE0F) + ' Common mistakes to avoid</h4>' +
          '<ul>' +
            '<li>An un-annotated sitemap (you need annotations for A.M2 / A.D1).</li>' +
            '<li>No test plan with <b>expected vs actual</b> results in Task 3.</li>' +
            '<li>Using images or text without referencing the source (plagiarism).</li>' +
            '<li>Describing what you did without evaluating whether it worked.</li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
    '</div>';

    html += '</div>'; // assign-panel

    host.innerHTML = html;

    // Wire events
    host.querySelectorAll('.assign-card').forEach(function (card) {
      card.addEventListener('click', function () { activeTask = card.dataset.task; render(); });
    });
    host.querySelectorAll('[data-goto]').forEach(function (b) {
      b.addEventListener('click', function () { if (typeof switchTab === 'function') switchTab(b.dataset.goto); });
    });
    host.querySelectorAll('.as-toggle').forEach(function (b) {
      b.addEventListener('click', function () {
        var body = document.getElementById(b.dataset.target);
        var wrap = b.parentElement;
        if (body) body.classList.toggle('open');
        if (wrap) wrap.classList.toggle('open');
      });
    });
    var cl = host.querySelector('.assign-check-lst');
    if (cl) cl.querySelectorAll('li').forEach(function (li) {
      li.querySelector('input').addEventListener('change', function () {
        var st = checklistState();
        st[activeTask + '_' + li.dataset.i] = li.querySelector('input').checked;
        saveChecklist(st);
        li.classList.toggle('done', li.querySelector('input').checked);
        var card = host.querySelector('[data-task="' + activeTask + '"]');
        var bar = host.querySelector('[data-task="' + activeTask + '"] .p-bar i');
        if (bar && wt) {
          var n = wt.evidence.filter(function (_, i) { return checklistState()[activeTask + '_' + i]; }).length;
          bar.style.width = Math.round(n / wt.evidence.length * 100) + '%';
          var em = card ? card.querySelector('em') : null;
          if (em) em.textContent = n + '/' + wt.evidence.length;
        }
      });
    });
    host.querySelectorAll('.assign-sample-dl').forEach(function (btn) {
      btn.addEventListener('click', function () { if (typeof window._openAssignmentPdf === 'function') window._openAssignmentPdf(btn.dataset.brief); });
    });
    host.querySelectorAll('.assign-sample-view').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var brief = SAMPLE_BRIEFS[+btn.dataset.brief];
        if (brief && typeof window._openBrief === 'function') window._openBrief(brief, activeTask);
      });
    });
  }

  /* ── Practice brief viewer ── */
  window._openBrief = function (brief, taskCode) {
    var t = taskCode || activeTask || 'task1';
    var dest = t === 'task2' ? 'wireframe' : t === 'task3' ? 'editor' : 'guide';
    var destLabel = t === 'task2' ? 'Open the Wireframe tool' : t === 'task3' ? 'Open the Code Editor' : 'Open the Study Guide';
    var tabs = ['details', 'must-haves', 'hints', 'start'];
    var tab = 'details';

    var modal = document.createElement('div');
    modal.className = 'brief-modal';
    modal.innerHTML =
      '<div class="brief-modal-backdrop"></div>' +
      '<div class="brief-modal-card" role="dialog" aria-modal="true" aria-label="Practice brief: ' + esc(brief.title) + '">' +
        '<div class="brief-m-head">' +
          '<img class="brief-m-logo" src="/logo.png" alt="" onerror="this.style.display=\'none\'">' +
          '<div class="brief-m-titles"><b>Practice brief</b><span>' + esc(brief.title) + ' \u00B7 ' + esc(brief.audience) + '</span></div>' +
          '<button class="brief-m-x" aria-label="Close">\u2715</button>' +
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
          '<button class="btn primary" data-bstart="1">' + destLabel + ' \u2192</button>' +
        '</div>' +
      '</div>';

    function renderBody() {
      var body = modal.querySelector('#brief-m-body');
      var h = '';
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
        if (!brief.typographyHint && !brief.colourHint) h += '<p class="muted">No design hints given \u2014 decide these yourself.</p>';
      } else if (tab === 'start') {
        h += '<div class="brief-m-start">';
        h += '<p>You\u2019re on <b>' + (t === 'task2' ? 'Task 2 \u2014 design' : t === 'task3' ? 'Task 3 \u2014 build' : 'Task 1 \u2014 planning') + '</b>. Jump straight in, or ask AI Assigner to coach you through this brief.</p>';
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
      var tabBtn = e.target.closest('.brief-m-tab');
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

  /* ── Full Pearson-style assignment brief (PDF / print) ── */
  window._openAssignmentPdf = function (briefIndex) {
    var tasks = (CRITERIA && CRITERIA.tasks) || [];
    var brief = ((SAMPLE_BRIEFS && SAMPLE_BRIEFS[Number(briefIndex) || 0]) || {});

    function escp(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    function scenarioFor(code) {
      var map = {
        task1: 'Explore the purposes and principles of website development for the given client brief. Establish the client\u2019s requirements, then research existing websites that serve the same purpose, and the legal and ethical constraints. Use website development principles to analyse how your chosen websites meet their purpose and appeal to their intended audience. Develop ideas for content that meets the client\u2019s requirements and explain how the content meets legal and ethical constraints. Produce a detailed and annotated site map to demonstrate how your proposed website will meet the client\u2019s requirements.',
        task2: 'Use web design skills and techniques to plan a website in response to the client brief. Create visual representations of the web pages, a wireframe for each web page, and the visual style of the website. Review the fitness for purpose of your designs and make improvements based on the outcomes of your review. Use asset management techniques to create, source, prepare and manage the assets for your website.',
        task3: 'Develop a website in response to the client brief. Use your site map, designs and assets to develop a website that meets all the client\u2019s requirements, using website development tools, techniques and processes. Engage in a testing and review process that includes functionality testing, usability testing and making any required refinements.'
      };
      return map[code] || '';
    }

    function evidenceFor(code) {
      if (code === 'task1') return ['An annotated site map.', 'A written response with supporting images (or an edited audio/video recording, or a presentation slide deck with speaker notes).'];
      if (code === 'task2') return ['A wireframe for each web page.', 'Visual designs for the website.', 'Visual representations of the web pages.', 'Original and sourced assets.', 'Evidence of asset management.'];
      return ['Evidence of engagement with website development tools, techniques and processes.', 'Evidence of functionality and usability testing.', 'Outcomes of the self-review process.', 'The final website \u2014 web pages must be viewable in common web browsers.'];
    }

    function criteriaTable(task) {
      var byGrade = { Pass: [], Merit: [], Distinction: [] };
      (Array.isArray(task.criteria) ? task.criteria : []).forEach(function (c) { if (byGrade[c.level]) byGrade[c.level].push(c); });
      var cols = ['Pass', 'Merit', 'Distinction'];
      var maxRows = Math.max.apply(null, cols.map(function (g) { return byGrade[g].length; }));
      var h = '<table class="pv-crit"><thead><tr>';
      cols.forEach(function (g) { h += '<th>' + g + '</th>'; });
      h += '</tr></thead><tbody>';
      for (var i = 0; i < maxRows; i++) {
        h += '<tr>';
        cols.forEach(function (g) {
          var c = byGrade[g][i];
          h += '<td>' + (c ? '<b>' + escp(c.code) + '</b> ' + escp(c.text) : '') + '</td>';
        });
        h += '</tr>';
      }
      h += '</tbody></table>';
      return h;
    }

    var contextTitle = brief.title || 'Retro Entertainment Website';
    var contextBlurb = brief.scenario || 'Produce a retro entertainment website. The aim of the website is to introduce an audience of specific 17- to 23-year-olds to entertainment from the past. The website must be responsive to mobile devices.';
    var mustIncludes = (Array.isArray(brief.mustIncludes) && brief.mustIncludes.length)
      ? brief.mustIncludes
      : ['three pages', 'drop-down menus', 'information about your selected entertainment from the past', 'an accordion', 'external links to relevant websites', 'a form to request specific content', 'modal images', 'video content with controls', 'search functionality', 'accessibility features'];

    var pagesHtml = '';

    // Cover page — instructions + introductory context
    pagesHtml += '<div class="pv-page">' +
      '<div class="pv-masthead"><span class="pv-paper-code">W80502A</span>' +
      '<h1>Pearson BTEC Level 3 AAQ BTEC National in IT</h1>' +
      '<div class="pv-sub">Unit 3: Website Development \u2014 Pearson Set Assignment Brief</div>' +
      '</div>' +
      '<div class="pv-meta">Internal unit \u00B7 estimated 15 hours \u00B7 Practice replica \u2014 not the live Pearson paper.</div>' +
      '<h2>Instructions for students</h2>' +
      '<p><b>Read the brief carefully.</b> This Pearson Set Assignment Brief consists of 3 tasks. You must submit evidence for each task.</p>' +
      '<ul>' +
      '<li>Work independently and do not share your work with other students. All evidence must be your own.</li>' +
      '<li>Clearly identify and reference any material created by others, including the source. Using others\u2019 work without acknowledgement is plagiarism and can result in disqualification.</li>' +
      '<li>You may ask your teacher for support about the requirements of the tasks and what evidence to produce, but teachers cannot give you feedback on how to improve your work.</li>' +
      '</ul>' +
      '<h2>Introductory context</h2>' +
      '<p><strong>Produce a website for:</strong> ' + escp(contextTitle) + '.</p>' +
      '<p>' + escp(contextBlurb) + '</p>' +
      '<div class="pv-evid"><b>The website must be responsive to mobile devices and include:</b><ul>' +
      mustIncludes.map(function (mi) { return '<li>' + escp(mi) + '</li>'; }).join('') +
      '</ul></div>' +
      '<div class="pv-footer"><span>RA10 \u00B7 Unit 3 Assignment Brief</span><span class="pv-pagenum">Page 1</span></div>' +
      '</div>';

    // One page per task
    tasks.forEach(function (task, idx) {
      var code = task.code;
      var num = String(code).replace('task', '');
      pagesHtml += '<div class="pv-page">' +
        '<div class="pv-task">' +
        '<h3>Task ' + num + ' \u2014 ' + escp(task.title) + '</h3>' +
        '<p>' + escp(scenarioFor(code)) + '</p>' +
        '<div class="pv-evid"><b>Evidence required</b><ul>' +
        evidenceFor(code).map(function (e) { return '<li>' + escp(e) + '</li>'; }).join('') +
        '</ul></div>' +
        '<b>Assessment criteria for this task</b>' + criteriaTable(task) +
        '</div>' +
        '<div class="pv-footer"><span>RA10 \u00B7 Unit 3 Assignment Brief</span><span class="pv-pagenum">Page ' + (2 + idx) + '</span></div>' +
        '</div>';
    });

    // Closing note
    pagesHtml += '<div class="pv-page">' +
      '<h2>About this document</h2>' +
      '<p>This is a practice replica produced by RA10 for revision. It mirrors the format of the real Pearson Set Assignment Brief (W80502A) but is not an official Pearson document.</p>' +
      '<div class="pv-footer"><span>RA10 \u00B7 Unit 3 Assignment Brief</span><span class="pv-pagenum">Page ' + (2 + tasks.length) + '</span></div>' +
      '</div>';

    var overlay = document.createElement('div');
    overlay.className = 'pdf-viewer';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Assignment brief: ' + esc(contextTitle));
    overlay.innerHTML =
      '<div class="pv-topbar">' +
        '<div class="pv-group pv-group-nav"><span class="pv-title">' + esc(contextTitle) + '</span></div>' +
        '<div class="pv-group pv-group-actions">' +
          '<button class="pv-btn" id="pv-zo" type="button" title="Zoom out">\u2212</button>' +
          '<span class="pv-zoom" id="pv-zoom">100%</span>' +
          '<button class="pv-btn" id="pv-zi" type="button" title="Zoom in">+</button>' +
          '<button class="pv-btn" id="pv-zr" type="button">Reset</button>' +
          '<span class="pv-counter" id="pv-counter">1 / ' + (tasks.length + 2) + '</span>' +
          '<button class="pv-btn pv-btn-primary" id="pv-print" type="button">Print / Save PDF</button>' +
          '<button class="pv-btn" id="pv-close" type="button">Close</button>' +
        '</div>' +
      '</div>' +
      '<div class="pv-stage" id="pv-stage">' + pagesHtml + '</div>';

    document.body.appendChild(overlay);
    document.body.classList.add('pv-open');

    var stage = overlay.querySelector('#pv-stage');
    var pages = stage.querySelectorAll('.pv-page');
    var counter = overlay.querySelector('#pv-counter');
    var zoomLabel = overlay.querySelector('#pv-zoom');
    var zoom = 1;

    function getMinZoom() {
      if (!pages.length) return 0.8;
      if (window.innerWidth > 720) return 0.8;
      var baseWidth = pages[0].offsetWidth || 1;
      var availableWidth = Math.max(300, window.innerWidth - 12);
      return Math.min(1, Math.max(0.55, availableWidth / baseWidth));
    }

    function applyZoom() {
      pages.forEach(function (page) {
        if (!page.dataset.baseHeight) page.dataset.baseHeight = String(page.offsetHeight);
        var baseHeight = Number(page.dataset.baseHeight) || page.offsetHeight;
        var extra = Math.max(0, (baseHeight * zoom) - baseHeight);
        page.style.transformOrigin = 'top center';
        page.style.transform = 'scale(' + zoom + ')';
        page.style.marginBottom = (18 + extra) + 'px';
      });
      if (zoomLabel) zoomLabel.textContent = Math.round(zoom * 100) + '%';
    }

    function setZoom(z) { zoom = Math.min(1.6, Math.max(getMinZoom(), z)); applyZoom(); }

    function currentPage() {
      var best = 0, bestDist = Infinity;
      pages.forEach(function (p, i) {
        var r = p.getBoundingClientRect();
        var mid = r.top + r.height / 2;
        var d = Math.abs(mid - window.innerHeight * 0.45);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    }

    function updateCounter() { if (counter) counter.textContent = (currentPage() + 1) + ' / ' + pages.length; }

    function close() {
      overlay.remove();
      document.body.classList.remove('pv-open');
      document.removeEventListener('keydown', escHandler);
      window.removeEventListener('resize', resizeHandler);
    }
    function escHandler(e) { if (e.key === 'Escape' || e.key === 'Esc') close(); }
    function resizeHandler() { zoom = Math.min(1.6, Math.max(getMinZoom(), zoom)); applyZoom(); updateCounter(); }

    overlay.querySelector('#pv-zo').addEventListener('click', function () { setZoom(zoom - 0.1); });
    overlay.querySelector('#pv-zi').addEventListener('click', function () { setZoom(zoom + 0.1); });
    overlay.querySelector('#pv-zr').addEventListener('click', function () { setZoom(1); });
    overlay.querySelector('#pv-print').addEventListener('click', function () { window.print(); });
    overlay.querySelector('#pv-close').addEventListener('click', close);
    document.addEventListener('keydown', escHandler);
    window.addEventListener('resize', resizeHandler);
    stage.addEventListener('scroll', function () { updateCounter(); }, { passive: true });

    zoom = getMinZoom();
    applyZoom();
    updateCounter();
  };

  window.initAssignmentHub = function () {
    var host = document.getElementById('assignment-hub');
    if (!host) return;
    render();
    if (typeof onDataReady === 'function' && !(typeof DATA_READY === 'boolean' && DATA_READY)) {
      onDataReady(function () { render(); });
    }
  };

  var WALKTHROUGHS = {
    task1: {
      summary: 'Research how real websites are planned and designed, write down what the client needs, then draw a site map that shows every page \u2014 annotated so it clearly meets the brief.',
      evidence: [
        'Client needs as a clean list (purpose, audience, tech)',
        '3 example websites \u2014 why their layout/nav works',
        'Law & ethics notes (copyright, privacy, accessibility)',
        'Content ideas you\'d add',
        'Annotated site map (use the Sitemap tool!)'
      ],
      steps: [
        '<b>1 \u00B7 Read the brief like a detective</b> \u2014 highlight every \u201Cmust\u201D (pages, features, audience, tone).',
        '<b>2 \u00B7 Research 3 similar sites</b> \u2014 screenshot + one line on what works/doesn\'t.',
        '<b>3 \u00B7 Note the rules</b> \u2014 copyright, GDPR (no forms without privacy), accessibility.',
        '<b>4 \u00B7 Plan the pages</b> \u2014 use the Sitemap tool so every requirement has a page.',
        '<b>5 \u00B7 Annotate</b> \u2014 for each page add \u201Cmeets: accordion, search\u2026\u201D so it scores D.'
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
        '<b>1 \u00B7 Wireframes first</b> \u2014 one per page, boxes only (header, nav, hero, forms).',
        '<b>2 \u00B7 Pick a vibe</b> \u2014 2-3 colours + 1 display / 1 body font. Contrast must pass!',
        '<b>3 \u00B7 Mockups</b> \u2014 apply the style to your wireframes (Canva/Figma/editor).',
        '<b>4 \u00B7 Source assets legally</b> \u2014 stock images with credit, or your own photos.',
        '<b>5 \u00B7 Organise</b> \u2014 images/, css/, js/ folders, tidy names, keep files under 1MB.'
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
        '<b>1 \u00B7 Build page by page</b> \u2014 home first, then wire up navigation.',
        '<b>2 \u00B7 Nail the features</b> \u2014 accordion, modal images, video with controls, form, search. Use the editor components!',
        '<b>3 \u00B7 Accessible</b> \u2014 alt text, semantic tags, keyboard works, readable contrast.',
        '<b>4 \u00B7 Responsive</b> \u2014 test phone / tablet / desktop widths.',
        '<b>5 \u00B7 Test + fix</b> \u2014 make a test plan, click everything, fix what breaks, ask a friend to try it.'
      ]
    }
  };
})();
