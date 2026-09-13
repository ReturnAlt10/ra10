/* RA10 IT AAQ — Booklet reader.
 * Loads a per-aim bundle (data/<unit>-<aim>.json) and renders a printable
 * booklet (+ optional solutions) into .bk-paper. */
(function () {
  'use strict';

  const state = {
    unit: null,
    aim: null,
    solutions: false,
    bundle: null,
    index: [],
  };

  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  // Resolve an MCQ's correct answer across the different data schemas:
  //  - Units 1/2: options carry {label:"A"} and the answer is mark_scheme.answer ("B")
  //  - Units 3/4: options are strings and answer is a 0-based index
  function mcqAnswer(q) {
    const ms = q.mark_scheme || {};
    const raw = q.answer ?? q.correct_index;
    const ansLetter = (ms.answer != null ? String(ms.answer) : (typeof raw === 'string' ? raw : '')).trim().toUpperCase();
    let index = -1;
    if (/^[A-Z]$/.test(ansLetter)) index = ansLetter.charCodeAt(0) - 65;
    else if (raw != null && !Number.isNaN(Number(raw))) index = Number(raw);
    return { index, letter: index >= 0 ? 'ABCDEFGH'[index] || '' : '', explanation: q.why || q.explanation || ms.explanation || '' };
  }

  // Normalise a mark scheme's bullet points across the different source schemas.
  function msPoints(ms) {
    if (!ms) return [];
    if (Array.isArray(ms.points)) return ms.points;
    if (Array.isArray(ms.indicative_content)) return ms.indicative_content;
    if (Array.isArray(ms.points_to_award)) return ms.points_to_award;
    return [];
  }

  // Render a full mark scheme (covers points-based and level-descriptor schemas).
  function renderMarkScheme(ms) {
    if (!ms) return '';
    let h = '';
    if (ms.instruction) h += `<div class="bk-tip"><b>Instruction:</b> ${esc(ms.instruction)}</div>`;
    const pts = msPoints(ms);
    if (pts.length) h += `<ul style="margin:6px 0 0 18px;">${pts.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`;
    if (Array.isArray(ms.level_descriptors) && ms.level_descriptors.length) {
      h += '<table class="bk-table"><thead><tr><th>Level</th><th>Marks</th><th>Descriptor</th></tr></thead><tbody>';
      ms.level_descriptors.forEach(ld => {
        if (ld.level === 0 && ld.marks === '0') return;
        h += `<tr><td><strong>${esc(ld.level || '')}</strong></td><td>${esc(ld.marks || '')}</td><td>${esc(ld.descriptor || '')}</td></tr>`;
      });
      h += '</tbody></table>';
    }
    if (ms.additional_guidance) h += `<div class="bk-tip"><b>Note:</b> ${esc(ms.additional_guidance)}</div>`;
    if (ms.do_not_accept) h += `<div style="color:var(--bk-brand);"><b>Do not accept:</b> ${esc(ms.do_not_accept)}</div>`;
    return h;
  }

  // -------------------------------------------------------------------------
  // Loaders
  // -------------------------------------------------------------------------
  async function loadIndex() {
    const res = await fetch('data/index.json');
    state.index = await res.json();
  }

  async function loadBundle(unit, aim) {
    const res = await fetch(`data/${unit}-${aim}.json`);
    state.bundle = await res.json();
  }

  // -------------------------------------------------------------------------
  // Page builders
  // -------------------------------------------------------------------------
  function pageShell(inner, opts) {
    opts = opts || {};
    const badge = state.solutions && opts.solutions ? '<div class="bk-solutions-badge">Solutions</div>' : '';
    return `<div class="bk-page">${badge}<div class="bk-page-hd"><div><div class="bk-section-kicker">${esc(opts.kicker || '')}</div><h2>${esc(opts.title || '')}</h2></div><div class="bk-page-num">${esc(opts.label || '')}</div></div>${inner}</div>`;
  }

  function coverPage() {
    const b = state.bundle;
    return `<div class="bk-page"><div class="bk-cover">
      <div class="bk-cover-band"><span class="bk-cover-logo">RA10 Revision</span></div>
      <div style="margin-top:8px;font-size:13px;font-weight:700;letter-spacing:.06em;color:var(--bk-muted);">${esc(b.board)}</div>
      <h1>${esc(b.unitName)}</h1>
      <div class="bk-cover-aim">Learning Aim ${esc(b.aim)}</div>
      <div class="bk-cover-sub">${esc(b.aimTitle || '')}</div>
      <div class="bk-cover-meta">
        <div>Specification: ${esc(b.specIssue)}</div>
        <div>Assessment: ${esc(b.assessment)}</div>
      </div>
      <div class="bk-cover-fields">
        <div class="bk-field"><b>Name</b>&nbsp;</div>
        <div class="bk-field"><b>Class / Group</b>&nbsp;</div>
        <div class="bk-field"><b>Teacher</b>&nbsp;</div>
        <div class="bk-field"><b>Date</b>&nbsp;</div>
      </div>
      <div style="margin-top:50px;font-size:12px;color:var(--bk-muted);">This booklet is a study aid, not an official Pearson product. Keep it with your class notes.</div>
    </div></div>`;
  }

  function checklistPage() {
    const b = state.bundle;
    const items = b.checklist || [];
    let html = '<p class="bk-lead">Tick each item when you are confident you can explain it. Use this as your revision checklist and as a contents page for this booklet.</p>';
    html += '<ul class="bk-checklist">';
    items.forEach(t => {
      if (t.type === 'group') {
        html += `<li><div class="bk-cl-group">${t.code ? esc(t.code) + ' — ' : ''}${esc(t.name)}</div></li>`;
      } else {
        html += `<li><div class="bk-cl-item"><span class="bk-tick"></span><span>${esc(t.name)}</span></div></li>`;
      }
    });
    html += '</ul>';
    return pageShell(html, { kicker: 'Contents & checklist', title: 'Specification checklist', label: 'page 2' });
  }

  function hl(s) { return s; } // highlighted key text passthrough

  // ---- Knowledge-bank topic pages (units 3/4) ----
  function knowledgePages() {
    const kb = state.bundle.knowledgeBank;
    const pages = [];
    if (!kb || !Array.isArray(kb.topics)) return pages;
    kb.topics.forEach((topic, idx) => {
      const kp = topic.keyPoints || [];
      let body = '';
      if (state.solutions) {
        body += `<div class="bk-def"><div class="bk-def-hd"><span class="bk-code">${esc(topic.code)}</span> ${esc(topic.name)}</div><div class="bk-def-body"><ul>${kp.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div></div>`;
        body += `<div class="bk-tip"><b>Study tip.</b> Re-read each point, then close the book and write what you remember in your own words.</div>`;
      } else {
        // "Fill in / summarise" scaffold — key term underlined prompt.
        body += `<p class="bk-lead">Summarise each key point for <strong>${esc(topic.code)} ${esc(topic.name)}</strong> in the space below. The solutions booklet gives full notes.</p>`;
        body += `<h3>${esc(topic.code)} ${esc(topic.name)}</h3>`;
        const terms = kp.slice(0, 6);
        terms.forEach(p => {
          const short = String(p).split(/[.,;:]|—/)[0].trim() || String(p).slice(0, 60);
          body += `<p style="font-weight:700;margin-top:10px;">${esc(short)} …</p>`;
          body += `<div class="bk-lines tall"></div>`;
        });
        body += `<div class="bk-tip"><b>Retrieval practice.</b> Without looking, write a two-sentence summary of this topic from memory.</div>`;
        body += `<div class="bk-lines tall"></div><div class="bk-lines tall"></div>`;
      }
      pages.push(pageShell(body, { kicker: `Topic ${idx + 1}`, title: `${topic.code} ${topic.name}`, label: 'notes' }));
    });
    return pages;
  }

  // ---- Flashcards -> definitions/match-up pages ----
  function flashcardPages() {
    const fc = (state.bundle.flashcards || []).slice(0, 10); // cap
    const pages = [];
    if (!fc.length) return pages;

    // Page 1: "Define these terms" — term shown, blank lines for definition.
    const defItems = fc.slice(0, 6);
    let body = '<p class="bk-lead">Write a definition for each term from memory, then check against the solutions booklet.</p>';
    defItems.forEach(f => {
      body += `<div class="bk-def"><div class="bk-def-body"><div class="bk-term">${esc(f.front)}</div>${state.solutions ? `<p style="margin-top:6px;color:var(--bk-accent);">${esc(f.back).replace(/\n/g, '<br>')}</p>` : `<div class="bk-lines tall"></div><div class="bk-lines"></div>`}</div></div>`;
    });
    pages.push(pageShell(body, { kicker: 'Key terms', title: 'Define the terms', label: 'recall' }));

    // Page 2+: Match-up — terms shuffled vs definitions (worksheet only).
    if (!state.solutions && fc.length >= 4) {
      const pick = fc.slice(0, 8);
      const terms = pick.map((f, i) => ({ k: String.fromCharCode(65 + i), front: f.front }));
      const defs = pick.map((f, i) => ({ k: i + 1, back: String(f.back).split('\n')[0] })).sort(() => Math.random() - 0.5);
      body = '<p class="bk-lead">Match each term (A–H) to its correct definition (1–8) by writing the number in the box.</p>';
      body += '<div class="bk-match"><div class="bk-match-col">';
      terms.forEach(t => { body += `<div class="bk-match-item"><span class="bk-k">${t.k}</span><span>${esc(t.front)}</span><span class="bk-blank" style="min-width:34px;"></span></div>`; });
      body += '</div><div class="bk-match-col">';
      defs.forEach(d => { body += `<div class="bk-match-item"><span class="bk-k">${d.k}.</span><span>${esc(d.back)}</span></div>`; });
      body += '</div></div>';
      // answer key (page 3, always)
      pages.push(pageShell(body, { kicker: 'Match-up', title: 'Match the term to the definition', label: 'activity' }));
    }
    if (state.solutions) {
      // Full definitions list
      body = '<p class="bk-lead">All key definitions for this aim.</p>';
      fc.forEach(f => { body += `<div class="bk-def"><div class="bk-def-body"><div class="bk-term">${esc(f.front)}</div><p style="margin-top:4px;color:var(--bk-accent);">${esc(f.back).replace(/\n/g, '<br>')}</p></div></div>`; });
      pages.push(pageShell(body, { kicker: 'Solutions', title: 'Key term definitions', label: 'answers', solutions: true }));
    } else if (fc.length > 6) {
      // Second definition worksheet page for the rest
      body = '<p class="bk-lead">More terms to define.</p>';
      fc.slice(6, 12).forEach(f => {
        body += `<div class="bk-def"><div class="bk-def-body"><div class="bk-term">${esc(f.front)}</div><div class="bk-lines tall"></div><div class="bk-lines"></div></div></div>`;
      });
      pages.push(pageShell(body, { kicker: 'Key terms', title: 'Define more terms', label: 'recall' }));
    }
    return pages;
  }

  // ---- MCQ pages ----
  function mcqPages() {
    const mcq = (state.bundle.mcq || []).slice(0, 10); // cap to keep booklet focused
    const pages = [];
    const letters = 'ABCD';
    const per = 5;
    for (let start = 0; start < mcq.length; start += per) {
      const chunk = mcq.slice(start, start + per);
      let body = '<p class="bk-lead">Circle the letter of the correct answer.</p>';
      chunk.forEach(q => {
        const a = mcqAnswer(q);
        body += `<div class="bk-mcq"><div class="bk-q">${esc(q.question || q.q)}</div><ol>`;
        (q.options || q.choices || []).forEach((opt, i) => {
          const text = typeof opt === 'string' ? opt : (opt.text || '');
          const isAns = state.solutions && a.index === i;
          body += `<li><span class="bk-letter">${letters[i]}</span><span>${esc(text)}</span>${isAns ? ' <span style="color:var(--bk-accent);font-weight:800;">★</span>' : ''}</li>`;
        });
        body += '</ol>';
        if (state.solutions && a.letter) body += `<div class="bk-model"><b>Answer:</b> ${a.letter}${a.explanation ? ' — ' + esc(a.explanation) : ''}</div>`;
        body += '</div>';
      });
      const pageNo = Math.floor(start / per) + 1;
      pages.push(pageShell(body, { kicker: 'Multiple choice', title: 'Quick knowledge check ' + (pageNo > 1 ? pageNo : ''), label: 'MCQ', solutions: state.solutions }));
    }
    return pages;
  }

  // ---- Exam-style question pages ----
  function examPages() {
    const qs = (state.bundle.examQuestions || []).slice();

    // Cap totals: a focused set per booklet.
    const short = qs.filter(q => (q.marks || 0) <= 2).slice(0, 4);
    const medium = qs.filter(q => (q.marks || 0) >= 3 && (q.marks || 0) <= 5).slice(0, 3);
    // Long questions: prefer the biggest (9/12 markers where they exist).
    const long = qs.filter(q => (q.marks || 0) >= 6).sort((a, b) => (b.marks || 0) - (a.marks || 0)).slice(0, 3);
    const selected = [...short, ...medium, ...long];

    const pages = [];
    const LONG_THRESHOLD = 6;

    // Short/medium questions share pages (up to 4 per page).
    const sm = selected.filter(q => (q.marks || 0) < LONG_THRESHOLD);
    let body = '';
    let count = 0;
    const flush = (title) => {
      if (!body.trim().length) return;
      pages.push(pageShell(body, { kicker: 'Exam-style questions', title, label: 'practice', solutions: state.solutions }));
      body = '';
      count = 0;
    };

    sm.forEach((q) => {
      const marks = q.marks || 1;
      let block = `<div class="bk-qn">${esc(q.question || q.q)} <span class="bk-marks"><span class="mk">${marks} mark${marks === 1 ? '' : 's'}</span></span></div>`;
      if (q.scenario) block += `<p style="font-style:italic;color:var(--bk-muted);">Scenario: ${esc(q.scenario)}</p>`;
      if (state.solutions) {
        const ms = q.mark_scheme || {};
        block += `<div class="bk-model"><b>Mark scheme</b>${renderMarkScheme(ms)}</div>`;
      } else {
        const lines = Math.max(2, marks * 2);
        for (let i = 0; i < lines; i++) block += `<div class="bk-answer-lines"></div>`;
        block += `<div style="height:12px;"></div>`;
      }
      body += block;
      count++;
      if (count >= 3) flush('Short & medium questions');
    });
    flush('Short & medium questions');

    // Long (6+ mark) questions — each gets at least a full page of space.
    long.forEach((q, idx) => {
      const marks = q.marks || 6;
      let block = `<div class="bk-qn">${esc(q.question || q.q)} <span class="bk-marks"><span class="mk">${marks} marks</span></span></div>`;
      if (q.scenario) block += `<p style="font-style:italic;color:var(--bk-muted);">Scenario: ${esc(q.scenario)}</p>`;
      if (state.solutions) {
        const ms = q.mark_scheme || {};
        block += `<div class="bk-model"><b>Mark scheme</b>${renderMarkScheme(ms)}</div>`;
      } else {
        const lineCount = marks <= 6 ? 18 : marks <= 9 ? 26 : 34;
        for (let i = 0; i < lineCount; i++) block += `<div class="bk-answer-lines" style="height:${marks >= 9 ? 34 : 28}px;"></div>`;
      }
      pages.push(pageShell(block, { kicker: 'Extended answer', title: `Extended question ${idx + 1} (${marks} marks)`, label: 'extended', solutions: state.solutions }));
    });

    return pages;
  }

  // ---- Diagram pages ----
  function diagramPages() {
    const dg = (state.bundle.diagrams || []).slice(0, 4); // cap per booklet
    const pages = [];
    dg.forEach((d, idx) => {
      const isComplete = d.figure && /^(Complete|Label)$/i.test(String(d.command_verb || '')) ||
                         (d.figure && !d.mermaid);
      let body = `<div class="bk-qn">${idx + 1}. ${esc(d.question)} <span class="bk-marks"><span class="mk">${d.marks} mark${d.marks === 1 ? '' : 's'}</span></span></div>`;
      if (d.scenario) body += `<p style="font-style:italic;color:var(--bk-muted);">${esc(d.scenario)}</p>`;
      if (state.solutions) {
        // Model answer: the COMPLETED diagram (mermaid) + mark scheme points.
        if (d.mermaid) {
          const label = d.figure ? 'Completed diagram' : 'Model answer';
          body += `<div class="bk-model"><b>${label}</b>${d.diagram_kind ? ` (${esc(d.diagram_kind)})` : ''}<div class="bk-mermaid" data-mermaid="${esc(d.mermaid)}"></div></div>`;
        } else {
          body += `<div class="bk-model"><b>Answer</b><ul style="margin:6px 0 0 18px;">${msPoints(d.mark_scheme).map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>`;
        }
        const pts = msPoints(d.mark_scheme);
        if (pts.length) {
          body += `<div class="bk-model"><b>Mark scheme</b><ul style="margin:6px 0 0 18px;">${pts.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>`;
        }
        if (d.mark_scheme?.instruction) body += `<div class="bk-tip"><b>Note:</b> ${esc(d.mark_scheme.instruction)}</div>`;
      } else if (d.figure) {
        // Worksheet: show the INCOMPLETE figure + space to complete it.
        body += `<div class="bk-task"><b>Figure ${idx + 1}</b></div>`;
        body += `<div class="bk-mermaid" data-mermaid="${esc(d.figure)}"></div>`;
        body += `<div class="bk-draw-box" style="min-height:420px;"><span>Complete the diagram — add the missing element(s) above in the space below</span></div>`;
      } else {
        // One full page for drawing (draw-from-scratch diagrams).
        body += `<div class="bk-draw-box" style="min-height:820px;"><span>Draw and label your diagram here (full page available)</span></div>`;
      }
      pages.push(pageShell(body, { kicker: 'Diagrams', title: `Diagram practice ${idx + 1}`, label: d.figure ? 'complete' : 'draw', solutions: state.solutions }));
    });
    return pages;
  }

  // ---- Revision-guide notes with cloze gaps (difficult concepts) ----
  function clozePages() {
    const notes = state.bundle.notes || [];
    const pages = [];
    notes.forEach((section) => {
      // Collect all answer words for a scrambled key (word bank).
      const words = [...new Set(
        (section.passages || []).flatMap(p => [...String(p).matchAll(/\[\[([^\]]+)\]\]/g)].map(m => m[1]))
      )];
      const bank = words.slice().sort(() => Math.random() - 0.5);

      let body = '<div class="bk-wordbank"><span class="bk-wordbank-label">Word bank — use these to fill the gaps</span><div class="bk-wordbank-chips">';
      body += bank.map(w => `<span class="bk-word-chip">${esc(w)}</span>`).join('');
      body += '</div></div>';

      if (state.solutions) {
        // Inline answers, highlighted.
        (section.passages || []).forEach(passage => {
          body += `<p class="bk-cloze">${String(passage).replace(/\[\[([^\]]+)\]\]/g, (m, a) => `<span class="ans">${esc(a)}</span>`)}</p>`;
        });
      } else {
        (section.passages || []).forEach(passage => {
          body += `<p class="bk-cloze">${String(passage).replace(/\[\[([^\]]+)\]\]/g, (m, a) => {
            const w = Math.max(90, Math.min(200, a.length * 9));
            return `<span class="bk-blank" style="min-width:${w}px;">&nbsp;</span>`;
          })}</p>`;
        });
        body += `<div class="bk-tip"><b>How to use.</b> Read each sentence, choose the missing word from the bank above, then check in the solutions booklet.</div>`;
      }
      pages.push(pageShell(body, { kicker: 'Revision notes', title: section.title, label: 'notes', solutions: state.solutions }));
    });
    return pages;
  }

  // ---- Design / workshop pages (units 3 & 4 coursework) ----
  function designPages() {
    const designs = state.bundle.designs || [];
    const pages = [];
    designs.forEach((d, idx) => {
      const sc = state.bundle.scenario;
      let body = '';
      // Scenario reminder (first page only) so tasks are concrete.
      if (idx === 0 && sc) {
        body += `<div class="bk-scenario"><b>Working brief:</b> ${esc(sc.brief)} — ${esc(sc.text)} <span class="bk-scenario-aud">${esc(sc.audience || '')}</span></div>`;
      }
      body += `<p class="bk-task">${esc(d.prompt)}</p>`;
      if (state.solutions && d.model) {
        body += `<div class="bk-model"><b>Model answer</b>${d.kind ? ` — <em>${esc(d.kind)}</em>` : ''}${renderDesignModel(d.model)}</div>`;
      } else if (state.solutions) {
        body += `<div class="bk-model"><b>What to include</b>${d.kind ? ` — <em>${esc(d.kind)}</em>` : ''}<p style="margin-top:6px;">Produce this on the worksheet and keep it with your assignment evidence. Use accurate technical vocabulary and label every element.</p></div>`;
      } else {
        const grid = (d.kind === 'table' || d.kind === 'testplan' || d.kind === 'normalisation' || d.kind === 'data dictionary')
          ? '<div class="bk-table-lines"></div>'
          : '<div class="bk-grid-pad"></div>';
        body += grid;
      }
      pages.push(pageShell(body, { kicker: 'Design workshop', title: d.title, label: d.kind || 'design', solutions: state.solutions }));
    });
    return pages;
  }

  function renderDesignModel(m) {
    if (m.mermaid) return `<div class="bk-mermaid" data-mermaid="${esc(m.mermaid)}"></div>`;
    if (m.wireframe) {
      let h = '<div class="bk-wireframe-model">';
      (m.wireframe || []).forEach(b => {
        h += `<div class="bk-wf-row" style="height:${Math.max(24, b.h * 0.9)}px;"><span>${esc(b.label)}</span></div>`;
      });
      return h + '</div>';
    }
    if (m.table) {
      let h = '<table class="bk-table"><thead><tr>';
      (m.table.head || []).forEach(c => { h += `<th>${esc(c)}</th>`; });
      h += '</tr></thead><tbody>';
      (m.table.rows || []).forEach(r => {
        h += '<tr>';
        r.forEach(c => { h += `<td>${esc(c)}</td>`; });
        h += '</tr>';
      });
      return h + '</tbody></table>';
    }
    if (m.form) {
      let h = '<div class="bk-form-model">';
      (m.form || []).forEach(f => {
        h += `<div class="bk-form-row"><span class="bk-form-field">${esc(f.field)}</span><span class="bk-form-type">${esc(f.type)}</span>${f.required ? '<span class="bk-form-req">required</span>' : ''}${f.validation ? `<span class="bk-form-val">${esc(f.validation)}</span>` : ''}</div>`;
      });
      return h + '</div>';
    }
    return '';
  }

  // ---- How to structure Tasks 1–3 (units 3 & 4, Distinction focus) ----
  function taskGuidePage() {
    const g = state.bundle.taskGuide;
    if (!g) return null;
    let body = `<p class="bk-lead">${esc(g.title)} — read each step, then tick it off as you complete it. Aim for the <strong>Distinction</strong> column.</p>`;
    (g.tasks || []).forEach(t => {
      body += `<div class="bk-taskcard"><div class="bk-taskcard-hd"><span class="bk-tasknum">Task ${t.num}</span><div><strong>${esc(t.name)}</strong><span class="bk-taskaim">Learning Aim ${esc(t.aim)}</span></div></div>`;
      body += `<ol class="bk-tasksteps">${(t.steps || []).map(s => `<li>${esc(s)}</li>`).join('')}</ol>`;
      body += `<div class="bk-distinction"><b>To reach Distinction:</b> ${esc(t.distinction)}</div>`;
      body += '</div>';
    });
    return pageShell(body, { kicker: 'Assignment structure', title: g.title, label: 'tasks' });
  }

  // ---- Exam technique + command verb page (always included) ----
  function techniquePage() {
    const b = state.bundle;
    const verbs = {
      'State': 'Give a brief, factual answer — no explanation needed. Usually 1 mark.',
      'Identify': 'Name or point out the key item. Brief and factual.',
      'Describe': 'Say what something is, what it looks like, or how it works — give details, not reasons.',
      'Explain': 'Give reasons: how AND why. Use "because" / "so that".',
      'Analyse': 'Break it into parts and examine each, with reasons and links to the scenario.',
      'Compare': 'Give similarities AND differences. Use "both… however…".',
      'Evaluate': 'Weigh up both sides and reach a justified conclusion with evidence.',
      'Recommend': 'Make a clear choice/action with justification. Name the best option and why.',
      'Justify': 'Give strong reasons for a decision, linked to evidence/context.',
    };
    let body = '<p class="bk-lead">The command verb tells you <em>how</em> to answer. Matching the verb is half the marks.</p>';
    body += '<table class="bk-table"><thead><tr><th>Verb</th><th>What it wants</th></tr></thead><tbody>';
    Object.entries(verbs).forEach(([v, d]) => { body += `<tr><td><strong>${v}</strong></td><td>${d}</td></tr>`; });
    body += '</tbody></table>';
    body += `<div class="bk-tip"><b>Common mistake.</b> Writing everything you know on a "State" question wastes time and loses nothing — but on "Explain" you'll lose marks if you only describe. Always check the verb before you write.</div>`;
    body += `<h3>Plan your extended answer (6/8/12 marks)</h3>`;
    body += `<p>Use this structure:</p>`;
    body += `<div class="bk-model"><b>Model structure</b><ul style="margin:6px 0 0 18px;"><li>Point 1 — state it, then explain and apply to the scenario</li><li>Point 2 — same structure</li><li>Point 3 — same structure</li><li>Conclusion — link back to the question (for Evaluate/Analyse)</li></ul></div>`;
    body += `<div class="bk-lines tall"></div><div class="bk-lines tall"></div>`;
    return pageShell(body, { kicker: 'Exam technique', title: 'Command verbs & structure', label: 'technique' });
  }

  // ---- Criteria page (units 3/4) ----
  function criteriaPage() {
    const crit = state.bundle.criteria || [];
    if (!crit.length) return null;
    let body = '<p class="bk-lead">The grade you earn for this aim depends on meeting the Pass / Merit / Distinction criteria. Tick them as you complete each.</p>';
    crit.forEach(task => {
      body += `<h3>${esc(task.title || task.code)}</h3>`;
      body += '<ul class="bk-checklist">';
      (task.criteria || []).forEach(cc => {
        body += `<li><div class="bk-cl-item"><span class="bk-tick"></span><span><strong style="color:var(--bk-brand);">${esc(cc.code)}</strong> (${esc(cc.level)}): ${esc(cc.text)}</span></div></li>`;
      });
      body += '</ul>';
    });
    body += `<div class="bk-tip"><b>Top-tip.</b> To reach Distinction, note that D criteria ask you to <em>comprehensively</em> meet requirements and justify decisions — always give reasons, not just descriptions.</div>`;
    return pageShell(body, { kicker: 'Assessment criteria', title: 'How this aim is graded', label: 'criteria' });
  }

  // ---- Model answer page (from easy 1-2m questions, solutions only content) ----
  function modelAnswerPage() {
    const qs = state.bundle.examQuestions || [];
    // pick one good 2-4 mark "Explain/Describe" question as a worked model.
    const model = qs.find(q => ['Explain', 'Describe', 'Analyse', 'Evaluate'].includes(q.command_verb) && (q.marks >= 2 && q.marks <= 4));
    if (!model) return null;
    if (!state.solutions) {
      // Worksheet: plan the answer
      let body = `<div class="bk-qn">Model answer task. ${esc(model.question)} <span class="bk-marks"><span class="mk">${model.marks} marks</span></span></div>`;
      if (model.scenario) body += `<p style="font-style:italic;color:var(--bk-muted);">Scenario: ${esc(model.scenario)}</p>`;
      body += `<div class="bk-tip"><b>How to plan.</b> (1) Underline the command verb. (2) List 2–3 points. (3) For each, add an explanation using "because". (4) Link back to the scenario.</div>`;
      body += `<h3>Your plan</h3><div class="bk-lines tall"></div><div class="bk-lines tall"></div><h3>Your answer</h3><div class="bk-lines tall"></div><div class="bk-lines tall"></div><div class="bk-lines tall"></div>`;
      return pageShell(body, { kicker: 'Model answer', title: 'Worked example task', label: 'model' });
    }
    // Solutions page
    let body = `<div class="bk-qn">${esc(model.question)} <span class="bk-marks"><span class="mk">${model.marks} marks</span></span></div>`;
    if (model.scenario) body += `<p style="font-style:italic;color:var(--bk-muted);">Scenario: ${esc(model.scenario)}</p>`;
    const ms = model.mark_scheme || {};
    const pts = msPoints(ms);
    body += `<div class="bk-model"><b>Model answer</b><ol style="margin:8px 0 0 18px;">${pts.map(p => `<li>${esc(p)}</li>`).join('')}</ol></div>`;
    body += `<div class="bk-tip"><b>Why these get marks.</b> Each point earns a mark for being accurate and linked to the scenario. Notice how each point uses a technical term and a reason.</div>`;
    return pageShell(body, { kicker: 'Solutions', title: 'Model answer', label: 'answers', solutions: true });
  }

  // -------------------------------------------------------------------------
  // Assemble + render
  // -------------------------------------------------------------------------
  function render() {
    const paper = $('#bk-paper');
    if (!paper || !state.bundle) return;
    let html = '';
    html += coverPage();
    html += checklistPage();
    // Order: technique, criteria, knowledge/notes, definitions, model answer, MCQ, diagrams, exam questions.
    const tech = techniquePage();
    if (tech) html += tech;
    const crit = criteriaPage();
    if (crit) html += crit;
    const tg = taskGuidePage();
    if (tg) html += tg;
    html += clozePages().join('');
    html += designPages().join('');
    html += knowledgePages().join('');
    html += flashcardPages().join('');
    const model = modelAnswerPage();
    if (model) html += model;
    html += mcqPages().join('');
    html += diagramPages().join('');
    html += examPages().join('');
    paper.innerHTML = html;
    updateHeader();
    renderMermaids(paper);
  }

  let _mermaidCount = 0;
  function renderMermaids(root) {
    if (!window.mermaid) return;
    const nodes = Array.from(root.querySelectorAll('.bk-mermaid[data-mermaid]'));
    nodes.forEach((el) => {
      const src = el.getAttribute('data-mermaid');
      if (!src) return;
      const id = 'bk-mm-' + (++_mermaidCount);
      try {
        window.mermaid.render(id, src).then(({ svg }) => {
          el.innerHTML = svg;
          el.classList.add('rendered');
        }).catch(() => { el.classList.add('failed'); });
      } catch { el.classList.add('failed'); }
    });
  }

  function updateHeader() {
    const b = state.bundle || {};
    const title = $('#bk-current-title');
    if (title) title.textContent = `${b.unitName} — Aim ${b.aim}${state.solutions ? ' (Solutions)' : ''}`;
  }

  // -------------------------------------------------------------------------
  // UI wiring
  // -------------------------------------------------------------------------
  function populateUnitSelect() {
    const sel = $('#bk-unit');
    if (!sel) return;
    const units = [...new Set(state.index.map(x => x.unit))];
    sel.innerHTML = units.map(u => {
      const meta = state.index.find(x => x.unit === u);
      return `<option value="${u}">${esc(meta.unitName)}</option>`;
    }).join('');
  }

  function populateAimSelect(unit) {
    const sel = $('#bk-aim');
    if (!sel) return;
    const aims = state.index.filter(x => x.unit === unit);
    sel.innerHTML = aims.map(a => `<option value="${a.aim}">Aim ${esc(a.aim)} — ${esc(a.aimTitle.slice(0, 60))}</option>`).join('');
  }

  async function loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    const unit = Number(params.get('unit')) || state.unit || state.index[0]?.unit || 1;
    const aim = params.get('aim') || state.aim || 'A';
    state.unit = unit;
    state.aim = aim.toUpperCase();
    if ($('#bk-unit')) $('#bk-unit').value = String(unit);
    if ($('#bk-aim')) {
      populateAimSelect(unit);
      $('#bk-aim').value = state.aim;
    }
    await loadBundle(state.unit, state.aim);
    render();
  }

  function bindUI() {
    $('#bk-unit')?.addEventListener('change', async (e) => {
      state.unit = Number(e.target.value);
      populateAimSelect(state.unit);
      state.aim = $('#bk-aim').value;
      await loadBundle(state.unit, state.aim);
      render();
      syncURL();
    });
    $('#bk-aim')?.addEventListener('change', async (e) => {
      state.aim = e.target.value.toUpperCase();
      await loadBundle(state.unit, state.aim);
      render();
      syncURL();
    });
    $('#bk-solutions')?.addEventListener('change', (e) => {
      state.solutions = e.target.checked;
      render();
    });
    $('#bk-print')?.addEventListener('click', () => window.print());
    $('#bk-solutions-toggle')?.addEventListener('click', (e) => {
      const chk = $('#bk-solutions');
      chk.checked = !chk.checked;
      chk.dispatchEvent(new Event('change'));
    });
  }

  function syncURL() {
    const p = new URLSearchParams({ unit: state.unit, aim: state.aim });
    history.replaceState(null, '', '?' + p.toString());
  }

  async function init() {
    await loadIndex();
    populateUnitSelect();
    const firstUnit = state.index[0]?.unit || 1;
    populateAimSelect(firstUnit);
    bindUI();
    await loadFromURL();
  }

  document.addEventListener('DOMContentLoaded', init);
})();