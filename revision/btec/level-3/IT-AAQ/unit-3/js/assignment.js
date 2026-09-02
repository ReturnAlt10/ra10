/* Part 2 — Assignment Hub: task-by-task walkthroughs, sample briefs,
   evidence checklists, and AI Assigner marking of uploaded submissions. */
(function () {
  'use strict';

  let activeTask = 'task1';
  const CHECKLIST_KEY = 'ra10_u3_checklist';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  function getTask(code) {
    if (!CRITERIA || !CRITERIA.tasks) return null;
    return CRITERIA.tasks.find(function (t) { return t.code === code; });
  }

  function getWalkthrough(code) {
    return WALKTHROUGHS[code] || null;
  }

  function checklistState() {
    try { return JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '{}'); } catch (e) { return {}; }
  }
  function saveChecklist(state) { try { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(state)); } catch (e) {} }

  function criteriaGroup(task, level) {
    const list = task.criteria.filter(function (c) { return c.level === level; });
    return '<ul>' + list.map(function (c) { return '<li><strong>' + esc(c.code) + '</strong> — ' + esc(c.text) + '</li>'; }).join('') + '</ul>';
  }

  function renderStepper() {
    const host = document.getElementById('task-stepper');
    if (!host) return;
    const tasks = CRITERIA && CRITERIA.tasks ? CRITERIA.tasks : [];
    host.innerHTML = tasks.map(function (t) {
      return '<button class="task-step-btn' + (t.code === activeTask ? ' active' : '') + '" data-task="' + esc(t.code) + '">' +
        '<b>Task ' + esc(t.code.slice(-1)) + '</b>' +
        '<span>Learning Aim ' + esc(t.aim) + ' · ' + esc(t.title) + '</span>' +
        '</button>';
    }).join('');
    host.querySelectorAll('.task-step-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeTask = btn.dataset.task;
        renderStepper();
        renderTaskDetail();
      });
    });
  }

  function renderTaskDetail() {
    const task = getTask(activeTask);
    const wt = getWalkthrough(activeTask);
    const host = document.getElementById('task-detail');
    if (!host || !task) return;

    let html = '';
    html += '<div class="card primary-card" style="background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow)">';
    html += '<div class="mc-meta"><span class="chip">Task ' + esc(task.code.slice(-1)) + '</span><span class="chip">Learning Aim ' + esc(task.aim) + '</span><span class="muted small" style="margin-left:auto">' + esc(task.title) + '</span></div>';

    if (wt) {
      html += '<h3 style="margin-top:8px">' + esc(wt.title) + '</h3>';
      html += '<p>' + esc(wt.summary) + '</p>';
      html += '<div class="section-block"><div class="section-block-head"><span class="sb-eyebrow">What you must produce</span></div><ul class="task-checklist" id="checklist-' + esc(task.code) + '">' +
        wt.evidence.map(function (item, i) {
          const done = checklistState()[task.code + '_' + i];
          return '<li data-i="' + i + '" class="' + (done ? 'done' : '') + '"><input type="checkbox" ' + (done ? 'checked' : '') + ' aria-label="Mark done"><span>' + esc(item) + '</span></li>';
        }).join('') +
        '</ul></div>';
      html += '<div class="section-block"><div class="section-block-head"><span class="sb-eyebrow">Grade ladder</span></div><div class="grade-ladder">' +
        '<div class="grade-pill pass"><b>Pass (P)</b>' + criteriaGroup(task, 'Pass') + '</div>' +
        '<div class="grade-pill merit"><b>Merit (M) — includes Pass</b>' + criteriaGroup(task, 'Merit') + '</div>' +
        '<div class="grade-pill dist"><b>Distinction (D) — includes P + M</b>' + criteriaGroup(task, 'Distinction') + '</div>' +
        '</div>';
      const gd = CRITERIA && CRITERIA.gradeDescriptions && CRITERIA.gradeDescriptions[task.code];
      if (gd) {
        html += '<div class="grade-ladder" style="grid-template-columns:1fr 1fr 1fr">' +
          '<div class="grade-pill pass"><b>Pass looks like</b><p class="small">' + esc(gd.Pass) + '</p></div>' +
          '<div class="grade-pill merit"><b>Merit looks like</b><p class="small">' + esc(gd.Merit) + '</p></div>' +
          '<div class="grade-pill dist"><b>Distinction looks like</b><p class="small">' + esc(gd.Distinction) + '</p></div>' +
          '</div>';
      }
      html += '</div>';

      if (wt.steps && wt.steps.length) {
        html += '<div class="section-block"><div class="section-block-head"><span class="sb-eyebrow">Step by step</span></div><ol class="wt-steps" style="padding-left:20px">' +
          wt.steps.map(function (s) { return '<li style="margin-bottom:10px;font-size:.94rem">' + s + '</li>'; }).join('') +
          '</ol></div>';
      }
    }

    html += '<div class="card-action-row">' +
      '<button class="btn ghost" id="task-sample">View sample brief</button>' +
      '<button class="btn ghost" data-goto="editor">Open code editor</button>' +
      '<button class="btn primary" id="task-ai" data-task="' + esc(task.code) + '">Ask AI Assigner about this task</button>' +
      '</div>';
    html += '</div>';

    // Upload + mark panel
    html += '<div class="section-block">' +
      '<div class="section-block-head"><span class="sb-eyebrow">Get it marked</span><h3>Upload your work for this task</h3>' +
      '<p class="muted">Paste your written answer (research, sitemap annotations, testing tables, etc.) and AI Assigner will mark it against the criteria for this task. Text and small images only.</p></div>' +
      '<div class="upload-panel" id="upload-panel">' +
      '<textarea id="upload-text" placeholder="Paste or type your assignment evidence for this task here..."></textarea>' +
      '<div class="card-action-row" style="justify-content:center">' +
      '<button class="btn primary" id="btn-mark">Mark my work<span class="ra10-cost-label">' + costLabel('ai_assigner_mark') + '</span></button>' +
      '<button class="btn" id="btn-hint">Ask for a hint first<span class="ra10-cost-label">' + costLabel('ai_assigner_hint') + '</span></button>' +
      '</div>' +
      '<div class="ai-upload-hint" style="font-size:.82rem;color:var(--ink-3);margin-top:10px">Tip: paste your draft in your own words — AI Assigner coaches you to improve it, it never writes it for you.</div>' +
      '</div>' +
      '<div id="mark-result"></div>' +
      '</div>';

    // Sample briefs
    html += '<div class="section-block" id="sample-briefs-block"></div>';

    host.innerHTML = html;

    // Checkboxes
    const cl = document.getElementById('checklist-' + task.code);
    if (cl) {
      cl.querySelectorAll('li').forEach(function (li) {
        li.querySelector('input').addEventListener('change', function () {
          const state = checklistState();
          state[task.code + '_' + li.dataset.i] = li.querySelector('input').checked;
          saveChecklist(state);
          li.classList.toggle('done', li.querySelector('input').checked);
        });
      });
    }
    document.getElementById('task-sample').addEventListener('click', renderSampleBriefs);
    document.getElementById('task-ai').addEventListener('click', function () {
      if (typeof switchTab === 'function') switchTab('ai');
      if (window.openAiAssigner) window.openAiAssigner('task:' + this.dataset.task);
    });
    document.querySelectorAll('[data-goto="editor"]').forEach(function (b) {
      b.addEventListener('click', function () { if (typeof switchTab === 'function') switchTab('editor'); });
    });
    document.getElementById('btn-mark').addEventListener('click', function () { markSubmission(task, false); });
    document.getElementById('btn-hint').addEventListener('click', function () { markSubmission(task, true); });

    wireUploadDrag();
    renderSampleBriefs();
  }

  function costLabel(action) {
    const cost = (typeof window._ra10GetActionCost === 'function') ? window._ra10GetActionCost(action) : 0;
    return cost + ' credits';
  }

  function wireUploadDrag() {
    const panel = document.getElementById('upload-panel');
    if (!panel) return;
    ['dragenter', 'dragover'].forEach(function (ev) {
      panel.addEventListener(ev, function (e) { e.preventDefault(); panel.classList.add('dragover'); });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      panel.addEventListener(ev, function (e) { e.preventDefault(); panel.classList.remove('dragover'); });
    });
    panel.addEventListener('drop', function (e) {
      const files = e.dataTransfer.files;
      if (!files || !files.length) return;
      const f = files[0];
      if (f.size > 1024 * 1024) { alert('Max file size for upload is 1MB.'); return; }
      const reader = new FileReader();
      reader.onload = function () {
        const ta = document.getElementById('upload-text');
        if (ta) ta.value = String(reader.result || '').slice(0, 12000);
      };
      reader.readAsText(f);
    });
  }

  async function markSubmission(task, hintOnly) {
    const ta = document.getElementById('upload-text');
    const text = ta ? (ta.value || '').trim() : '';
    if (!text) { alert('Paste your work into the box first.'); return; }
    const result = document.getElementById('mark-result');
    if (!result) return;
    if (typeof ra10Gate !== 'function' || !(await ra10Gate(hintOnly ? 'ai_assigner_hint' : 'ai_assigner_mark'))) return;

    result.innerHTML = '<p class="muted">AI Assigner is reading your work against the criteria…</p>';
    try {
      if (hintOnly) {
        const res = await RA10.askAiAssigner({
          message: 'I am working on task ' + task.code.replace('task', '') + ' (' + task.title + '). Here is my draft so far — please give me hints on how to improve it towards the next grade without writing it for me:\n\n' + text.slice(0, 4000),
          context: 'Assignment task: ' + task.title + '. Criteria: ' + (task.criteria || []).map(function (c) { return c.code + ' ' + c.text; }).join('; ').slice(0, 2000)
        });
        result.innerHTML = '<div class="ai-msg bot">' + esc(res.reply) + '</div>';
      } else {
        const criteriaMap = {};
        (task.criteria || []).forEach(function (c) { criteriaMap[c.code] = c.level + ': ' + c.text; });
        const res = await RA10.markAssignment({
          submission: text,
          taskTitle: task.title,
          criteria: criteriaMap
        });
        renderMarkResult(result, res.result, task);
      }
    } catch (e) {
      result.innerHTML = '<div class="mark-result" style="color:var(--bad)"><strong>Could not mark:</strong> ' + esc(e && e.message ? e.message : String(e)) + '</div>';
    }
  }

  function renderMarkResult(host, r, task) {
    const grade = r.grade || 'Not yet met';
    const cls = 'g-' + grade.replace(/[^A-Za-z]/g, '');
    const criteriaSet = new Set((task.criteria || []).map(function (c) { return c.code; }));
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

  function renderSampleBriefs() {
    const host = document.getElementById('sample-briefs-block');
    if (!host) return;
    const briefs = SAMPLE_BRIEFS || [];
    if (!briefs.length) { host.innerHTML = ''; return; }
    host.innerHTML =
      '<div class="section-block-head"><span class="sb-eyebrow">Practice scenarios</span><h3>Sample briefs to practise on</h3>' +
      '<p class="muted">These are original practice briefs built in the same style as a Pearson assignment. Use one to rehearse any task — your teacher sets the real brief.</p></div>' +
      '<div style="display:grid;gap:12px;margin-top:12px">' +
      briefs.map(function (b, i) {
        return '<details class="sample-brief" ' + (i === 0 ? 'open' : '') + '>' +
          '<summary style="cursor:pointer;font-weight:800">' + esc(b.title) + ' <span class="muted small">— audience: ' + esc(b.audience) + '</span></summary>' +
          '<div class="sb-meta" style="margin-top:10px"><span class="chip">' + esc(b.scenario.slice(0, 90)) + '…</span></div>' +
          '<p><strong>Scenario:</strong> ' + esc(b.scenario) + '</p>' +
          '<p><strong>Purpose:</strong> ' + esc(b.purpose) + '</p>' +
          '<p><strong>Target audience:</strong> ' + esc(b.targetAudience) + '</p>' +
          '<p><strong>Must include:</strong></p><ul>' + b.mustIncludes.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' +
          '<p class="muted small"><strong>Style hints:</strong> ' + esc((b.typographyHint || '') + ' ' + (b.colourHint || '')) + '</p>' +
          '<div class="card-action-row">' +
          '<button class="btn" data-brief-open-editor="' + i + '">Practice in the code editor</button>' +
          '<button class="btn ghost" data-brief-open-wireframe="' + i + '">Plan a wireframe</button>' +
          '</div>' +
          '</details>';
      }).join('') +
      '</div>';
    host.querySelectorAll('[data-brief-open-editor]').forEach(function (b) {
      b.addEventListener('click', function () { if (typeof switchTab === 'function') switchTab('editor'); });
    });
    host.querySelectorAll('[data-brief-open-wireframe]').forEach(function (b) {
      b.addEventListener('click', function () { if (typeof switchTab === 'function') switchTab('wireframe'); });
    });
    if (typeof window.aiHintContext === 'function') window.aiHintContext('sample-brief', briefs[0]);
  }

  const WALKTHROUGHS = {
    task1: {
      title: 'Explore the purposes and principles of website development',
      summary: 'Research how existing websites use website development principles, develop content ideas that meet the client brief (including legal and ethical constraints), and produce an annotated site map.',
      evidence: [
        'Requirements established from the client brief (purpose, audience, technical requirements — as a bulleted list or diagram)',
        'Research into at least 3 existing websites serving the same purpose, analysed against the principles (layout, navigation, content, design, UX, accessibility, mobile)',
        'Research into legal and ethical constraints (copyright, data protection/GDPR, digital accessibility, inclusive content)',
        'Ideas for content that meets the client\'s requirements, with legal/ethical notes',
        'A detailed, annotated site map showing how the proposed website meets the client\'s requirements',
        'One of: a written response with supporting images, an edited audio/video recording, or a slide deck with speaker notes'
      ],
      steps: [
        '<strong>Extract every requirement</strong> from the brief into a checklist — purpose, audience, pages, features, technical needs.',
        '<strong>Research 3-4 existing websites</strong> serving a similar purpose. Use the spec\'s principles as your headings: page layout (F/Z patterns, grid, hierarchy), navigation (sticky, hamburger), content and CTAs, design (typography, colour), UX (accessibility, consistency, mobile), SEO.',
        '<strong>For each site, say what works and what doesn\'t</strong> — and then "applying this to my site, I will…". This is where Pass becomes Merit/Distinction: it\'s the application of research, not just description.',
        '<strong>Research legal and ethical constraints</strong>: copyright (can\'t copy assets), GDPR (forms + privacy), accessibility (WCAG), inclusive content. Reference them for YOUR site\'s content choices.',
        '<strong>Produce the annotated site map</strong> — every page, its content/features, and how pages link. Annotate each page with the client requirement it meets.',
        '<strong>Proofread for spec vocabulary</strong> — accurate use of technical terms lifts the grade band. Re-read and refine before submitting.'
      ]
    },
    task2: {
      title: 'Use web design skills and techniques to plan a website',
      summary: 'Create wireframes for each web page, visual designs (the visual style) and visual representations of the pages. Review fitness for purpose and improve your designs, and manage your assets professionally.',
      evidence: [
        'A wireframe for each web page',
        'Visual designs for the website (the visual style: colour palette, branding, typography)',
        'Visual representations of the web pages (high-fidelity mockups of how each page will look)',
        'Original and sourced assets (with sources recorded)',
        'Evidence of asset management (folder structure, naming conventions, asset log)',
        'Evidence of reviewing fitness for purpose and improvements made'
      ],
      steps: [
        '<strong>Start with the wireframes</strong> — one per page. Keep them low-fi: boxes for header, nav, content, images, forms. Show hierarchy, grouping and alignment.',
        '<strong>Define the visual style</strong> — pick 2-3 brand colours (check contrast!), 1-2 fonts (a display + a body font), logo placement, tone of voice. Write it down as a mini house style.',
        '<strong>Create visual representations (mockups)</strong> — apply the style to each wireframe so you can see the real page. Tools: Penpot/Figma/Canva/or the built-in editor.',
        '<strong>Review fitness for purpose</strong> — quality, user experience, and meeting every client requirement. Get feedback from classmates/family, then improve the designs. Record the before → after.',
        '<strong>Asset management</strong> — create or source your assets legally (stock images with credit, your own photos, vector logos). Prepare them (crop, compress, right format, < 1MB). Organise into <code>images/</code>, <code>css/</code>, <code>js/</code> with consistent names.',
        '<strong>Keep an asset log</strong> — asset name, source, where used. It is direct evidence for B.P4/M4/D2.'
      ]
    },
    task3: {
      title: 'Develop a website in response to a client brief',
      summary: 'Use your site map, designs and assets to build the website with HTML/CSS/JS, then run functionality and usability testing, review, and refine until every client requirement is met.',
      evidence: [
        'The finished website — every page viewable in a common web browser',
        'Evidence of using website development tools, techniques and processes (screenshots of your code/editor, version history)',
        'Functionality testing evidence (a test plan with expected vs actual outcomes)',
        'Usability testing evidence (user audit with real users; feedback quotes)',
        'Outcomes of your self-review and the refinements you made'
      ],
      steps: [
        '<strong>Build from your plan</strong> — one page at a time (home first), wiring up navigation as you go. Each page needs: nav menu, content, footer.',
        '<strong>Implement every required interaction</strong> — accordion, modal images, video with controls, search/filter, drop-down menus, form. Use the editor templates to learn each one.',
        '<strong>Make it accessible</strong> — alt text everywhere, semantic HTML (<code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>), keyboard navigation, contrast ≥ 4.5:1, transcripts/captions for video.',
        '<strong>Make it responsive</strong> — media queries + flexbox/grid. Test on phone, tablet, desktop widths in the browser dev tools.',
        '<strong>Cross-browser test</strong> — Chrome, Edge, Firefox, Safari if you can. Fix discrepancies.',
        '<strong>Functionality testing</strong> — build a test plan table (description, test data, expected, actual, comments). Click every link, submit the form, open/close accordion and modals, resize the window.',
        '<strong>Usability testing</strong> — give classmates/friends tasks and collect their feedback. Then act on it: "before → after" screenshots.',
        '<strong>Self-review</strong> — quality vs similar sites, suitability for audience/purpose, client requirements met?, legal/ethical, consistency, readability. Write it up and submit with the site.'
      ]
    }
  };

  window.initAssignmentHub = function () {
    if (!CRITERIA) return;
    const host = document.getElementById('assignment-hub');
    if (!host) return;
    host.innerHTML =
      '<div id="task-stepper" class="task-stepper"></div>' +
      '<div id="task-detail"></div>';
    renderStepper();
    renderTaskDetail();
  };
})();