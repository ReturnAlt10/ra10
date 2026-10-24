/* RA10 — AQA A-level Business: past-paper library, exam-paper viewer, answer online, AI Examiner, PDF download.
   Shared by AQA A-level Business (2023, 7132) and (2026, 7138). Reads window.AQA_UNIT (config) and window.AQA_PAPERS (data).
     AqaPapers.buildQuestions(papers, cfg) -> question-bank items (one per question part) in the format the AI Examiner expects
     AqaPapers.init(ctx)                   -> { renderPapers, openPaper }
   Past-paper text is reproduced from the AQA papers for revision (© AQA and its licensors). */
(function () {
  'use strict';

  const cfg = () => window.AQA_UNIT || {};

  /* ───────────────────────── helpers ───────────────────────── */
  function blockText(b) {
    if (!b) return '';
    if (b.t === 'li') return b.x.map(s => '• ' + s).join('\n');
    if (b.t === 'tbl' || b.t === 'flow') return b.x.join('\n');
    if (b.t === 'grid') return (b.head ? b.head.join(' | ') + '\n' : '') + b.rows.map(r => r.join(' | ')).join('\n');
    return String(b.x || '');
  }
  const blocksText = (bl) => (bl || []).map(blockText).join('\n');
  const hasInsert = (p) => !!(p.insert && p.insert.length);
  function caseBlocks(p, it) {
    const c = p.cases && p.cases[it.main];
    if (c && c.length) return c;
    return hasInsert(p) ? p.insert : [];
  }
  const kindLabel = { mcq: 'Multiple choice', calc: 'Calculation', short: 'Explain', analyse: 'Analyse', assess: 'Assess', evaluate: 'Evaluate' };
  const stripBullet = (s) => String(s || '').replace(/^[••]\s*/, '').trim();
  // Ruled lines per answer, matched to the real AQA answer booklets
  // (about 10 lines for 4 marks, 26 for 9, ~60 for 16, ~100 for 24-25).
  const lineCount = (it) => {
    const m = Number(it.marks) || 1;
    if (m <= 2) return 4;
    if (m <= 4) return Math.round(m * 2.5);
    if (m <= 9) return 6 + (m - 4) * 4;
    return Math.round(26 + (m - 9) * 5);
  };
  const minutesFor =(it) => it.kind === 'mcq' ? 1 : Math.max(2, Math.round(it.marks * ((cfg().minutesPerMark) || 1.2)));

  function pdfText(t) {
    return String(t || '').replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[–—−]/g, '-').replace(/×/g, 'x').replace(/÷/g, '/').replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/[•●]/g, '-').replace(/[^\x09\x0a\x0d\x20-\x7e£€]/g, '');
  }

  function msSections(body) {
    const out = { demands: [], indicative: [], evaluation: [], guidance: [], other: [] };
    let mode = 'other';
    (body || []).forEach(raw => {
      const l = stripBullet(raw);
      if (!l) return;
      if (/^(The )?demands of (this|the) question/i.test(l)) { mode = 'demands'; return; }
      if (/^Markers.{0,2} guidance|^Additional (marking )?guidance/i.test(l)) { mode = 'guidance'; return; }
      if (/^Indicative content/i.test(l)) { mode = 'indicative'; return; }
      if (/^(Evaluation|Judgement|Overall)\b/i.test(l) && l.length < 60) { mode = 'evaluation'; if (l.length > 12) out.evaluation.push(l); return; }
      if (/^Marks awarded as follows|^Broken down as follows/i.test(l)) { mode = 'other'; }
      out[mode].push(l);
    });
    return out;
  }

  /* ───────────────────────── question bank from papers ───────────────────────── */
  function levelsFor(it) {
    const L = window.AQA_LEVELS || {};
    const lv = (it.ms && it.ms.levels) || L[String(it.marks)] || [];
    return lv.map(d => ({ level: d.level, marks: String(d.marks).replace('–', '-'), descriptor: d.descriptor }));
  }

  function examQuestion(p, it, c) {
    const topic = c.classify ? c.classify(it.text + ' ' + (it.spec || ''), it) : 1;
    const names = c.topicNames || {};
    const pn = 'Paper ' + p.paper;
    const sec = it.section ? 'Section ' + it.section : '';
    const ms = it.ms || {};
    const cb = caseBlocks(p, it);
    const scen = blocksText(cb);
    const q = {
      id: p.id + '-Q' + it.q.replace('.', ''), subject: c.subjectName, spec_code: c.code, learning_aim: String(topic), topic_number: Number.isFinite(Number(topic)) ? Number(topic) : null, topic_title: names[topic] || '',
      spec_ref: it.spec || '', topic: (it.spec ? it.spec + ' ' : '') + (names[topic] || ''), command_verb: (it.text.match(/\b(Calculate|Explain|Analyse|Evaluate|Justify|Discuss|State|Complete|Show|Use|Do you agree|To what extent|Should|Which)\b/i) || [''])[0],
      marks: it.marks, papers: [pn], paper: pn, paper_section: sec, question_kind: it.kind, ao: ms.ao || '', ao_split: it.aoSplit || {},
      scenario: scen, context_title: (p.caseNames && p.caseNames.length === 1) ? p.caseNames[0] : '', question: it.text,
      origin: p.source, series: p.series, paper_id: p.id, item_q: it.q, case_title: p.title, quant: !!it.quant
    };
    if (it.kind === 'mcq') {
      q.type = 'multiple_choice';
      q.options = (it.options || []).map(o => ({ label: o[0], text: o[1] }));
      q.mark_scheme = { answer: it.answer || '', explanation: ms.why || (it.answer_text ? 'Correct option: ' + it.answer_text : '') };
      return q;
    }
    const lines = ms.body || [];
    const guidance = lines.filter(l => /^(accept|do not accept|ignore|allow|NB|OFR)/i.test(stripBullet(l)));
    if (it.kind === 'calc') {
      q.type = 'calculation';
      const ansLine = lines.find(l => /^(Answer|Correct answer|Net present value|Payback|ROCE)\b/i.test(stripBullet(l)));
      q.mark_scheme = {
        instruction: 'Award marks for each correct step. Own Figure Rule applies where an earlier error is carried forward correctly.',
        answer: ms.answer || (ansLine ? stripBullet(ansLine) : ''), points: (ms.points && ms.points.length ? ms.points : lines.map(stripBullet)).filter(Boolean),
        additional_guidance: guidance.map(stripBullet).join(' ') || null, raw: lines.join('\n')
      };
      return q;
    }
    if (it.kind === 'short' && it.marks < 6) {
      q.type = 'short';
      q.mark_scheme = { instruction: 'Award marks for a relevant point, explanation and application to the context, up to ' + it.marks + ' marks.', points: (ms.body && ms.body.length ? ms.body : ms.points || []).map(stripBullet).filter(Boolean), additional_guidance: guidance.map(stripBullet).join(' ') || null, raw: lines.join('\n') };
      return q;
    }
    q.type = 'extended_levels';
    const sec2 = msSections(lines);
    const mk = {
      instruction: 'Levels of response. Determine the level using the descriptors (best fit), then the mark within the level. Indicative content is not exhaustive - credit all valid lines of argument.',
      level_descriptors: levelsFor(it), marker_notes: guidance.map(stripBullet).concat(sec2.guidance), raw: lines.join('\n')
    };
    if (ms.for) {
      mk.arguments_for = ms.for; mk.arguments_against = ms.against; mk.evaluation = ms.judge ? [ms.judge] : [];
      mk.demands = [];
    } else {
      mk.demands = sec2.demands;
      mk.indicative_content = sec2.indicative.length ? sec2.indicative : sec2.other;
      mk.evaluation = sec2.evaluation;
    }
    q.mark_scheme = mk;
    return q;
  }

  function buildQuestions(papers, c) {
    c = c || cfg();
    const out = [];
    (papers || []).forEach(p => (p.items || []).forEach(it => out.push(examQuestion(p, it, c))));
    return out;
  }

  /* ───────────────────────── viewer ───────────────────────── */
  function init(ctx) {
    const { $, el, renderMarkScheme, awardXP } = ctx;
    const C = cfg();
    const STORE = 'ra10_' + C.key + '_paper_';
    let timer = null;
    let view = { id: null, mode: 'paper' };
    let questions = null;

    const allPapers = () => window.AQA_PAPERS || [];
    const getPaper = (id) => allPapers().find(p => p.id === id);
    const stateOf = (id) => { try { return JSON.parse(localStorage.getItem(STORE + id) || '{}') || {}; } catch (e) { return {}; } };
    const saveState = (id, s) => { try { localStorage.setItem(STORE + id, JSON.stringify(s)); } catch (e) {} };
    const QS = () => (questions = questions || buildQuestions(allPapers(), C));
    const questionFor = (p, it) => QS().find(q => q.paper_id === p.id && q.item_q === it.q);
    const pcfg = (p) => (C.papers && C.papers[p.paper]) || {};

    function ensureData(cb) {
      if (window.AQA_PAPERS) return cb();
      const host = $('#papers-host');
      if (host) host.innerHTML = '<p class="muted" style="padding:24px">Loading papers…</p>';
      const s = document.createElement('script');
      s.src = C.dataSrc || 'js/papers-data.js';
      s.onload = () => cb();
      s.onerror = () => { if (host) host.innerHTML = '<p class="pp-err" style="padding:24px">Could not load the paper library. Check your connection and reload.</p>'; };
      document.head.appendChild(s);
    }

    /* ---- scoring ---- */
    const valOf = (st, k) => Number.isFinite(st['S' + k]) ? st['S' + k] : (Number.isFinite(st['M' + k]) ? st['M' + k] : null);
    function answerText(p, st, it) {
      const k = it.q;
      if (it.kind === 'mcq') return st['A' + k] ? 'Selected option ' + st['A' + k] : '';
      const w = String(st['W' + k] || '').trim(), a = String(st['A' + k] || '').trim();
      if (it.kind === 'calc') return ((w ? 'Working:\n' + w + '\n' : '') + (a ? 'Answer: ' + a : '')).trim();
      return a;
    }
    function answeredIn(p, st) { return p.items.filter(it => answerText(p, st, it).trim().length > 0).length; }
    function scoreOf(p, st) {
      let got = 0, max = 0, n = 0;
      p.items.forEach(it => { const v = valOf(st, it.q); if (v != null) { got += v; max += it.marks; n++; } });
      return { got, max, n, of: p.items.length };
    }
    function groupsOf(p) {
      const out = [];
      if (p.paper === 1 && !p.twoCase) {
        const A = p.items.filter(i => i.section === 'A');
        if (A.length) out.push({ id: 'pp-secA', label: 'Section A', items: A, section: 'A', badge: A.length + 'm' });
        const by = {};
        p.items.filter(i => i.section === 'B').forEach(i => { (by[i.main] = by[i.main] || []).push(i); });
        Object.keys(by).map(Number).sort((a, b) => a - b).forEach(m => out.push({ id: 'pp-q-' + m, label: 'Question ' + m, items: by[m], section: 'B' }));
        ['C', 'D'].forEach(s => { const it = p.items.filter(i => i.section === s); if (it.length) out.push({ id: 'pp-sec' + s, label: 'Section ' + s, items: it, section: s, choice: true }); });
      } else {
        const by = {};
        p.items.forEach(i => { (by[i.main] = by[i.main] || []).push(i); });
        Object.keys(by).map(Number).sort((a, b) => a - b).forEach((m, idx) => { const sec = by[m][0].section || null; const nm = p.twoCase && p.caseNames && p.caseNames[idx] ? ' · ' + p.caseNames[idx] : ''; out.push({ id: 'pp-q-' + m, label: p.twoCase && sec ? 'Section ' + sec + nm : 'Question ' + m, items: by[m], section: sec }); });
      }
      out.forEach(g => { g.marks = g.choice ? g.items[0].marks : g.items.reduce((s, x) => s + x.marks, 0); });
      return out;
    }
    function groupBadge(p, st, g) {
      const vals = g.items.map(it => valOf(st, it.q)).filter(v => v != null);
      if (g.choice) {
        const done = g.items.filter(it => answerText(p, st, it).trim());
        const sc = done.map(it => valOf(st, it.q)).filter(v => v != null);
        if (sc.length) return Math.max.apply(null, sc) + '/' + g.marks;
        return done.length ? '✓' : g.marks + 'm';
      }
      if (vals.length === g.items.length && vals.length) return vals.reduce((a, b) => a + b, 0) + '/' + g.marks;
      return g.items.some(it => answerText(p, st, it).trim()) ? '✓' : g.marks + 'm';
    }

    /* ---- library ---- */
    function renderPapers(opts) {
      ensureData(() => drawLibrary(opts));
    }
    function drawLibrary(opts) {
      const host = $('#papers-host');
      if (!host) return;
      clearInterval(timer); timer = null; view.id = null;
      document.querySelectorAll('.pp-drawer').forEach(d => d.remove());
      opts = opts || {};
      host.innerHTML = ''; host.className = 'pp-library';
      const papers = allPapers();
      const f = host._f = Object.assign({ src: 'aqa', paper: 0 }, host._f || {}, opts);
      const nA = papers.filter(p => p.source === 'aqa').length, nR = papers.filter(p => p.source === 'ra10').length;

      const top = el('div', { class: 'pp-libbar' });
      const seg = el('div', { class: 'pp-seg', role: 'tablist' });
      [['aqa', C.pastLabel || 'Past Papers', nA], ['ra10', 'RA10 Papers', nR]].forEach(([k, label, n]) => {
        if (!n) return;
        const b = el('button', { type: 'button', role: 'tab', class: k === f.src ? 'on' : '', 'aria-selected': String(k === f.src) }, label, el('span', { class: 'pp-count' }, String(n)));
        b.addEventListener('click', () => drawLibrary({ src: k }));
        seg.appendChild(b);
      });
      top.appendChild(seg);
      if (nR) {
        const mock = el('button', { type: 'button', class: 'btn primary' }, '⏱ Timed mock (unseen paper)');
        mock.addEventListener('click', () => {
          const pool = papers.filter(p => p.source === 'ra10' && (!f.paper || p.paper === f.paper));
          if (pool.length) openPaper(pool[Math.floor(Math.random() * pool.length)].id, { mode: 'answer', timed: true });
        });
        top.appendChild(mock);
      }
      host.appendChild(top);

      const chips = el('div', { class: 'pp-chips', role: 'group', 'aria-label': 'Filter by paper' });
      [[0, 'All papers'], [1, 'Paper 1'], [2, 'Paper 2'], [3, 'Paper 3']].forEach(([n, label]) => {
        const b = el('button', { type: 'button', class: 'pp-chip' + (f.paper === n ? ' on' : ''), 'aria-pressed': String(f.paper === n) }, label);
        b.addEventListener('click', () => drawLibrary({ paper: n }));
        chips.appendChild(b);
      });
      host.appendChild(chips);

      host.appendChild(el('div', { class: 'pp-howto' }, ...(C.howto || []).map((t, i) => el('div', null, el('b', null, String(i + 1)), el('span', null, t)))));
      if (C.paperNote) host.appendChild(el('p', { class: 'pp-libnote' }, C.paperNote));

      const grid = el('div', { class: 'pp-grid' });
      const list = papers.filter(p => p.source === f.src && (!f.paper || p.paper === f.paper)).slice().sort((a, b) => (b.year - a.year) || (a.paper - b.paper) || String(a.set || '').localeCompare(String(b.set || '')));
      if (!list.length) grid.appendChild(el('p', { class: 'muted' }, 'No papers match this filter.'));
      list.forEach(p => {
        const st = stateOf(p.id);
        const done = answeredIn(p, st), tot = p.items.length;
        const sc = scoreOf(p, st);
        const pc = pcfg(p);
        const card = el('article', { class: 'pp-card' });
        card.appendChild(el('div', { class: 'pp-card-top' }, el('span', { class: 'pp-series' }, p.source === 'aqa' ? p.series : 'RA10 practice'), el('span', { class: 'pp-focus paper' + p.paper }, 'Paper ' + p.paper)));
        card.appendChild(el('h3', null, p.source === 'aqa' ? (pc.name || 'Paper ' + p.paper) + ' · ' + (pc.sub || '') : 'Set ' + (p.set || '') + ' · ' + (pc.sub || 'Paper ' + p.paper)));
        const kinds = {}; p.items.forEach(i => { kinds[i.kind] = (kinds[i.kind] || 0) + 1; });
        const mix = Object.keys(kinds).map(k => kinds[k] + ' ' + (kindLabel[k] || k).toLowerCase()).join(' · ');
        card.appendChild(el('p', { class: 'pp-meta' }, p.total + ' marks · ' + (pc.time || '2 hours') + ' · ' + tot + ' parts'));
        if (p.caseNames && p.caseNames.length && p.paper !== 1) card.appendChild(el('p', { class: 'pp-goal' }, (p.paper === 3 ? 'Case study: ' : 'Cases: ') + p.caseNames.join(' · ')));
        else card.appendChild(el('p', { class: 'pp-goal' }, mix));
        card.appendChild(el('div', { class: 'pp-progress' }, el('i', { style: `width:${Math.round(done / tot * 100)}%` })));
        card.appendChild(el('p', { class: 'pp-status' }, done ? `${done}/${tot} answered${sc.n ? ` · ${sc.got}/${sc.max} marked` : ''}` : 'Not started'));
        const actions = el('div', { class: 'pp-card-actions' });
        const open = el('button', { type: 'button', class: 'btn primary' }, done ? 'Continue' : 'Open paper');
        open.addEventListener('click', () => openPaper(p.id, { mode: done ? 'answer' : 'paper' }));
        const pdf = el('button', { type: 'button', class: 'btn ghost', title: 'Download this paper as a PDF' }, '⤓ PDF');
        pdf.addEventListener('click', () => downloadPdf(p.id, false, pdf));
        actions.appendChild(open); actions.appendChild(pdf);
        card.appendChild(actions);
        grid.appendChild(card);
      });
      host.appendChild(grid);
      host.appendChild(el('p', { class: 'pp-legal' }, f.src === 'aqa'
        ? 'Past paper and mark scheme text © AQA and its licensors, reformatted by RA10 for revision. Charts, graphs and diagrams in the originals cannot be reproduced as text — where a question depends on one, a note tells you to check the official paper.'
        : 'RA10 practice papers are written by RA10 in the AQA format. They are not AQA papers and are not endorsed by AQA.'));
    }

    /* ---- block renderer ---- */
    function renderBlocks(blocks, wrap) {
      (blocks || []).forEach(b => {
        if (b.t === 'h') wrap.appendChild(el('h4', { class: 'pp-qhead' }, b.x));
        else if (b.t === 'h2') wrap.appendChild(el('h5', { class: 'pp-subhead' }, b.x));
        else if (b.t === 'li') { const ul = el('ul', { class: 'pp-list' }); b.x.forEach(s => ul.appendChild(el('li', null, s))); wrap.appendChild(ul); }
        else if (b.t === 'tbl') wrap.appendChild(el('div', { class: 'pp-rows' }, ...b.x.map(r => el('div', null, r))));
        else if (b.t === 'cap') wrap.appendChild(el('p', { class: 'pp-tcap' }, b.x));
        else if (b.t === 'flow') wrap.appendChild(el('div', { class: 'pp-flow' }, ...b.x.map(r => el('span', null, r))));
        else if (b.t === 'grid') {
          const t = el('table', { class: 'pp-data' });
          if (b.head) t.appendChild(el('tr', null, ...b.head.map(h => el('th', null, h))));
          b.rows.forEach(r => t.appendChild(el('tr', null, ...r.map((c, i) => i === 0 ? el('th', null, c) : el('td', null, c)))));
          wrap.appendChild(el('div', { class: 'pp-scroll' }, t));
        } else wrap.appendChild(el('p', { class: 'pp-body' }, b.x));
      });
    }
    const runHead = (p, label) => el('div', { class: 'pp-runhead' }, el('span', null, `${C.qualLine || 'A-level'} ${C.subjectLine || 'Business'} · ${pcfg(p).ref || ''}`), el('span', null, label));

    /* ---- open paper ---- */
    function openPaper(id, opts) {
      ensureData(() => drawPaper(id, opts));
    }
    function drawPaper(id, opts) {
      opts = opts || {};
      const host = $('#papers-host');
      const p = getPaper(id);
      if (!host || !p) return;
      clearInterval(timer); timer = null;
      view = { id, mode: opts.mode || view.mode || 'paper' };
      const st = stateOf(id);
      const pc = pcfg(p);
      host.innerHTML = ''; host.className = 'pp-viewer-host';

      const bar = el('div', { class: 'pp-toolbar' });
      const back = el('button', { type: 'button', class: 'pp-tool' }, '← Papers');
      back.addEventListener('click', () => drawLibrary());
      const title = el('div', { class: 'pp-title' }, el('strong', null, p.title), el('span', null, p.source === 'aqa' ? `AQA ${p.series} · ${pc.ref || ''}` : 'RA10 practice paper · AQA format'));
      const modes = el('div', { class: 'pp-seg small' });
      [['paper', '📄 Paper'], ['answer', '✍️ Answer online']].forEach(([k, label]) => {
        const b = el('button', { type: 'button', class: view.mode === k ? 'on' : '' }, label);
        b.addEventListener('click', () => { if (view.mode !== k) { view.mode = k; drawPaper(id, { mode: k, keepScroll: true }); } });
        modes.appendChild(b);
      });
      const mins = p.minutes || pc.minutes || 120;
      const timerEl = el('span', { class: 'pp-timer', title: `Exam timer (${mins} min)` }, '');
      const timerBtn = el('button', { type: 'button', class: 'pp-tool' }, '▶ Timer');
      let remaining = mins * 60, running = false;
      const paint = () => { const h = Math.floor(remaining / 3600), m = Math.floor(remaining % 3600 / 60), s = remaining % 60; timerEl.textContent = `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; timerEl.classList.toggle('low', remaining <= 600); };
      const toggle = () => {
        running = !running; timerBtn.textContent = running ? '❚❚ Pause' : '▶ Resume';
        clearInterval(timer);
        if (running) timer = setInterval(() => { remaining = Math.max(0, remaining - 1); paint(); if (!remaining) { clearInterval(timer); timerBtn.textContent = 'Time up'; } }, 1000);
      };
      timerBtn.addEventListener('click', toggle);
      const dl = el('button', { type: 'button', class: 'pp-tool primary' }, '⤓ PDF');
      const dlMenu = el('div', { class: 'pp-menu', hidden: '' });
      const dlBlank = el('button', { type: 'button' }, 'Blank exam paper');
      const dlMine = el('button', { type: 'button' }, 'Paper with my answers');
      const dlMs = el('button', { type: 'button' }, 'Mark scheme');
      dlBlank.addEventListener('click', () => { dlMenu.hidden = true; downloadPdf(id, false, dl); });
      dlMine.addEventListener('click', () => { dlMenu.hidden = true; downloadPdf(id, true, dl); });
      dlMs.addEventListener('click', () => { dlMenu.hidden = true; downloadPdf(id, false, dl, true); });
      dlMenu.appendChild(dlBlank); dlMenu.appendChild(dlMine); dlMenu.appendChild(dlMs);
      dl.addEventListener('click', (e) => { e.stopPropagation(); dlMenu.hidden = !dlMenu.hidden; });
      host.addEventListener('click', () => { dlMenu.hidden = true; });
      const tools = el('div', { class: 'pp-tools-right' });
      const hasCase = hasInsert(p) || p.twoCase || (p.paper !== 1 && Object.keys(p.cases || {}).length > 0);
      let drawer = null;
      if (hasCase) {
        const cb = el('button', { type: 'button', class: 'pp-tool', title: 'Open the case study / source material beside your answer' }, '📖 Case study');
        drawer = caseDrawer(p);
        cb.addEventListener('click', () => { drawer.hidden = !drawer.hidden; cb.classList.toggle('on', !drawer.hidden); });
        tools.appendChild(cb);
      }
      tools.appendChild(timerEl); tools.appendChild(timerBtn); tools.appendChild(el('div', { class: 'pp-dlwrap' }, dl, dlMenu));
      bar.appendChild(back); bar.appendChild(title); bar.appendChild(modes); bar.appendChild(tools);
      host.appendChild(bar);
      document.querySelectorAll('.pp-drawer').forEach(d => d.remove());
      if (drawer) { drawer.hidden = true; document.body.appendChild(drawer); }

      const groups = groupsOf(p);
      const shell = el('div', { class: 'pp-shell' });
      const side = el('aside', { class: 'pp-side' });
      const nav = el('nav', { class: 'pp-nav', 'aria-label': 'Paper sections' });
      const navItems = [['pp-cover', 'Cover']];
      if (hasInsert(p)) navItems.push(['pp-insert', 'Insert · Case study']);
      groups.forEach(g => navItems.push([g.id, g.label, g]));
      navItems.forEach(([tid, label, g]) => {
        const b = el('button', { type: 'button', 'data-target': tid }, el('span', null, label));
        if (g) b.appendChild(el('em', { 'data-badge': tid }, groupBadge(p, st, g)));
        b.addEventListener('click', () => { const t = document.getElementById(tid); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
        nav.appendChild(b);
      });
      side.appendChild(nav);
      const scoreBox = el('div', { class: 'pp-score' });
      const paintScore = () => {
        const sc = scoreOf(p, st);
        scoreBox.innerHTML = '';
        scoreBox.appendChild(el('span', null, 'Marks recorded'));
        scoreBox.appendChild(el('strong', null, sc.n ? `${sc.got} / ${sc.max}` : '—'));
        scoreBox.appendChild(el('small', null, sc.n ? `${sc.n} of ${sc.of} parts marked` : 'Answer online, then use the AI Examiner or self-mark'));
      };
      paintScore();
      side.appendChild(scoreBox);
      shell.appendChild(side);

      const refresh = () => {
        paintScore();
        nav.querySelectorAll('[data-badge]').forEach(e => {
          const g = groups.find(x => x.id === e.getAttribute('data-badge'));
          if (g) e.textContent = groupBadge(p, st, g);
        });
      };

      const doc = el('div', { class: 'pp-doc' + (view.mode === 'answer' ? ' answering' : '') });
      doc.appendChild(coverPage(p));
      if (hasInsert(p)) doc.appendChild(insertPage(p));
      groups.forEach(g => doc.appendChild(groupPage(p, g, st, view.mode, refresh)));
      doc.appendChild(el('div', { class: 'pp-page pp-end' }, el('p', null, 'END OF QUESTIONS'), el('p', { class: 'pp-endtotal' }, `TOTAL FOR PAPER = ${p.total} MARKS`), el('small', null, p.source === 'aqa' ? 'Past paper content © AQA and its licensors. Reformatted by RA10 for revision.' : 'RA10 practice paper written in the AQA format.')));
      shell.appendChild(doc);
      host.appendChild(shell);

      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => entries.forEach(e => {
          if (!e.isIntersecting) return;
          nav.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.target === e.target.id));
        }), { rootMargin: '-35% 0px -60% 0px' });
        doc.querySelectorAll('.pp-page[id]').forEach(pg => io.observe(pg));
      }
      paint();
      if (opts.timed) toggle();
      if (!opts.keepScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function caseDrawer(p) {
      const d = el('aside', { class: 'pp-drawer', 'aria-label': 'Case study' });
      const head = el('div', { class: 'pp-drawer-h' }, el('strong', null, hasInsert(p) ? 'Insert · Case study' : 'Case studies & appendices'));
      const x = el('button', { type: 'button', class: 'pp-x', title: 'Close' }, '✕');
      x.addEventListener('click', () => { d.hidden = true; document.querySelectorAll('.pp-tools-right .pp-tool.on').forEach(b => b.classList.remove('on')); });
      head.appendChild(x);
      d.appendChild(head);
      const body = el('div', { class: 'pp-drawer-b' });
      if (hasInsert(p)) renderBlocks(p.insert, body);
      else Object.keys(p.cases || {}).sort((a, b) => a - b).forEach(k => { body.appendChild(el('p', { class: 'pp-drawer-tag' }, p.twoCase ? 'Source ' + String.fromCharCode(64 + Number(k)) : 'Question ' + String(k).padStart(2, '0'))); renderBlocks(p.cases[k], body); });
      d.appendChild(body);
      return d;
    }

    /* ---- pages ---- */
    function coverPage(p) {
      const pc = pcfg(p);
      const page = el('section', { class: 'pp-page pp-cover', id: 'pp-cover' });
      page.appendChild(el('div', { class: 'pp-cover-boxes' },
        el('div', null, el('small', null, 'Centre number'), el('span')), el('div', null, el('small', null, 'Candidate number'), el('span')),
        el('div', null, el('small', null, 'Surname'), el('span')), el('div', null, el('small', null, 'Forename(s)'), el('span'))));
      page.appendChild(el('p', { class: 'pp-qual' }, C.qualLine || 'A-level'));
      page.appendChild(el('h2', null, (C.subjectLine || 'Business').toUpperCase()));
      page.appendChild(el('h3', null, `${pc.name || 'Paper ' + p.paper}  ${pc.sub || ''}`));
      page.appendChild(el('p', { class: 'pp-series-big' }, p.source === 'aqa' ? p.series : 'RA10 practice paper'));
      page.appendChild(el('div', { class: 'pp-cover-row' }, el('div', null, el('small', null, 'Paper reference'), el('b', null, pc.ref || C.code)), el('div', null, el('small', null, 'Time allowed'), el('b', null, pc.time || '2 hours')), el('div', { class: 'pp-total' }, el('small', null, 'Maximum mark'), el('b', null, String(p.total)))));
      const h = el('div', { class: 'pp-instr' });
      (pc.instructions || []).forEach(([t, items]) => { h.appendChild(el('h4', null, t)); h.appendChild(el('ul', null, ...items.map(i => el('li', null, i.replace('{total}', p.total))))); });
      page.appendChild(h);
      return page;
    }

    function insertPage(p) {
      const page = el('section', { class: 'pp-page', id: 'pp-insert' });
      page.appendChild(runHead(p, 'Insert'));
      page.appendChild(el('h3', { class: 'pp-section' }, 'Insert — Source material for use in answering all questions'));
      renderBlocks(p.insert, page);
      return page;
    }

    function stateBind(p, st, key, field, node) {
      node.value = st[field + key] || '';
      node.addEventListener('input', () => { st[field + key] = node.value; saveState(p.id, st); });
    }

    function groupPage(p, g, st, mode, onScore) {
      const pc = pcfg(p);
      const first = g.items[0];
      const page = el('section', { class: 'pp-page pp-activity', id: g.id });
      page.appendChild(runHead(p, g.section ? 'Section ' + g.section : g.label));
      if (g.section && pc.sections && pc.sections[g.section]) {
        const sc = pc.sections[g.section];
        page.appendChild(el('h3', { class: 'pp-section' }, sc.title + (sc.sub ? ' — ' + sc.sub : '')));
        if (sc.note) page.appendChild(el('p', { class: 'pp-note' }, sc.note));
      }
      if (!hasInsert(p)) {
        const cb = caseBlocks(p, first);
        if (cb.length) renderBlocks(cb, page);
      }
      if (g.choice) {
        const nums = g.items.map(i => i.q).join(' or ');
        page.appendChild(el('p', { class: 'pp-choice' }, `Answer either Question ${nums.replace(/ or /, ' or Question ')}. Only one answer is marked.`));
      }
      g.items.forEach((it, idx) => {
        const q = questionFor(p, it);
        if (g.choice && idx > 0) page.appendChild(el('p', { class: 'pp-or' }, 'OR'));
        const lab = it.sub ? `${String(it.main).padStart(2, '0')}.${it.sub}` : String(it.main).padStart(2, '0');
        const block = el('div', { class: 'pp-item', id: 'pp-i-' + it.q.replace('.', '-') });
        block.appendChild(el('div', { class: 'pp-qrow' }, el('span', { class: 'pp-qnum' }, lab), el('p', { class: 'pp-qtext' }, it.text), el('span', { class: 'pp-qmarks' }, `[${it.marks} mark${it.marks === 1 ? '' : 's'}]`)));
        if (it.quant) block.appendChild(el('p', { class: 'pp-quant' }, '🧮 Quantitative skills question — 6 of the marks reward the calculation and how you use it (own-figure rule applies).'));
        if (it.fig) block.appendChild(el('p', { class: 'pp-fignote' }, '📊 This question refers to a figure/diagram that cannot be reproduced here — check it in the official AQA paper.'));
        if (it.kind === 'mcq') {
          block.appendChild(mcqBlock(p, st, it, mode, onScore));
        } else if (mode === 'answer') {
          if (it.kind === 'calc') {
            const w = el('textarea', { 'data-rmt': 'off', class: 'pp-lines pp-work', rows: '5', placeholder: 'Show your working…' });
            stateBind(p, st, it.q, 'W', w);
            const a = el('input', { type: 'text', 'data-rmt': 'off', class: 'pp-ans', placeholder: 'Answer (with units)', 'aria-label': 'Answer' });
            stateBind(p, st, it.q, 'A', a);
            block.appendChild(w); block.appendChild(el('div', { class: 'pp-ans-row' }, el('label', null, 'Answer'), a));
          } else {
            block.appendChild(el('p', { class: 'pp-hint' }, `About ${minutesFor(it)} minutes · ${kindLabel[it.kind] || ''}`));
            const ta = el('textarea', { 'data-rmt': 'off', class: 'pp-lines', placeholder: 'Write your answer here…', rows: String(lineCount(it)) });
            stateBind(p, st, it.q, 'A', ta);
            const count = el('span', { class: 'pp-wc' });
            const wc = () => { const n = ta.value.trim().split(/\s+/).filter(Boolean).length; count.textContent = n + ' words'; };
            ta.addEventListener('input', wc); wc();
            block.appendChild(ta); block.appendChild(count);
          }
          block.appendChild(feedbackRow(p, st, it, q, onScore));
        } else {
          block.appendChild(el('div', { class: 'pp-ruled', style: `--lines:${it.kind === 'calc' ? 5 : lineCount(it)}` }));
        }
        page.appendChild(block);
      });
      page.appendChild(el('p', { class: 'pp-total-line' }, g.choice ? `[${g.marks} marks]` : `(Total for ${g.label}${g.section === 'A' ? '' : ''} = ${g.marks} marks)`));
      return page;
    }

    function mcqBlock(p, st, it, mode, onScore) {
      const wrap = el('div', { class: 'pp-mcq' });
      const fb = el('div', { class: 'pp-mcq-fb', 'aria-live': 'polite' });
      const paintFb = () => {
        fb.innerHTML = ''; fb.className = 'pp-mcq-fb';
        const sel = st['A' + it.q];
        if (!sel || !it.answer) return;
        const ok = sel === it.answer;
        fb.classList.add(ok ? 'ok' : 'bad');
        const why = (it.ms && it.ms.why) || '';
        fb.appendChild(el('b', null, ok ? '✓ Correct — 1 mark' : `✗ Not quite — the answer is ${it.answer}`));
        if (!ok && it.answer_text) fb.appendChild(el('span', null, ` ${it.answer}: ${it.answer_text}`));
        if (why) fb.appendChild(el('span', { class: 'pp-why' }, why));
      };
      (it.options || []).forEach(o => {
        const row = el('button', { type: 'button', class: 'pp-opt' + (mode === 'answer' ? '' : ' static'), 'data-opt': o[0], role: 'radio', 'aria-checked': 'false' }, el('b', null, o[0]), el('span', null, o[1]));
        const paintSel = () => {
          const sel = st['A' + it.q];
          row.classList.toggle('sel', sel === o[0]);
          row.setAttribute('aria-checked', String(sel === o[0]));
          row.classList.toggle('right', !!sel && !!it.answer && o[0] === it.answer && sel !== null);
          row.classList.toggle('wrong', !!sel && sel === o[0] && it.answer && sel !== it.answer);
        };
        if (mode === 'answer') {
          row.addEventListener('click', () => {
            st['A' + it.q] = o[0];
            if (it.answer) st['S' + it.q] = o[0] === it.answer ? 1 : 0;
            saveState(p.id, st);
            wrap.querySelectorAll('.pp-opt').forEach(r => r._paint && r._paint());
            paintFb(); onScore && onScore();
            if (window.awardXP && st['S' + it.q] === 1) { try { awardXP(2, '+2 XP — correct'); } catch (e) {} }
          });
        }
        row._paint = paintSel; paintSel();
        wrap.appendChild(row);
      });
      if (mode === 'answer') {
        wrap.appendChild(fb); paintFb();
        const clear = el('button', { type: 'button', class: 'pp-clear' }, 'Clear');
        clear.addEventListener('click', () => { delete st['A' + it.q]; delete st['S' + it.q]; saveState(p.id, st); wrap.querySelectorAll('.pp-opt').forEach(r => r._paint && r._paint()); paintFb(); onScore && onScore(); });
        wrap.appendChild(clear);
      }
      return wrap;
    }

    /* ---- feedback row: AI Examiner + mark scheme + self-mark ---- */
    function feedbackRow(p, st, it, q, onScore) {
      const key = it.q, marks = it.marks;
      const wrap = el('div', { class: 'pp-fb' });
      const actions = el('div', { class: 'pp-actions' });
      const fb = el('button', { type: 'button', class: 'btn primary btn-examine' }, '✦ AI Examiner');
      const msBtn = el('button', { type: 'button', class: 'btn ghost' }, 'Mark scheme');
      actions.appendChild(fb); actions.appendChild(msBtn);
      const self = el('label', { class: 'pp-self' }, 'Self-mark ', (() => { const i = el('input', { type: 'number', min: '0', max: String(marks), step: '1', 'aria-label': 'Self-marked score' }); if (Number.isFinite(st['M' + key])) i.value = st['M' + key]; i.addEventListener('input', () => { const v = i.value === '' ? null : Math.max(0, Math.min(marks, Math.round(Number(i.value)))); if (v == null) delete st['M' + key]; else st['M' + key] = v; saveState(p.id, st); onScore && onScore(); }); return i; })(), ` / ${marks}`);
      actions.appendChild(self);
      const last = el('span', { class: 'pp-last' }, '');
      const paintLast = () => { last.textContent = Number.isFinite(st['S' + key]) ? `AI Examiner: ${st['S' + key]}/${marks}` : ''; last.hidden = !last.textContent; };
      paintLast(); actions.appendChild(last);
      wrap.appendChild(actions);
      const result = el('div', { class: 'pp-result' });
      wrap.appendChild(result);
      const ms = el('div', { class: 'pp-ms', hidden: '' }, q ? renderMarkScheme(q) : el('p', null, 'No mark scheme available.'));
      wrap.appendChild(ms);
      msBtn.addEventListener('click', () => { ms.hidden = !ms.hidden; msBtn.textContent = ms.hidden ? 'Mark scheme' : 'Hide mark scheme'; });
      fb.addEventListener('click', async () => {
        const answer = answerText(p, st, it);
        if (!q) { alert('This question is not available to the AI Examiner.'); return; }
        if (answer.replace(/Working:|Answer:/g, '').trim().length < (it.kind === 'calc' ? 1 : 12)) { alert('Write your answer first, then press “AI Examiner”.'); return; }
        if (!window.RA10 || typeof RA10.examineAnswer !== 'function') { alert('AI Examiner is not available right now.'); return; }
        if (window.RA10AI && !(await RA10AI.confirmCredits(RA10AI.examinerCost(), 'AI Examiner'))) return;
        fb.disabled = true; fb.dataset.aiExamining = 'true';
        fb.innerHTML = '<span class="ai-examiner-loading"><span class="ai-examiner-orb"></span><span>Marking<span class="ai-examiner-dots">...</span></span></span>';
        try {
          const response = await RA10.examineAnswer({ question: q, answer });
          result.innerHTML = '';
          if (response && response.result) {
            result.appendChild(window.RA10AI
              ? RA10AI.renderExamResult({ question: q, answer, result: response.result, markScheme: () => renderMarkScheme(q) })
              : el('p', null, JSON.stringify(response.result)));
            const earned = Number(response.result.earned);
            if (Number.isFinite(earned)) { st['S' + key] = earned; saveState(p.id, st); paintLast(); onScore && onScore(); }
            awardXP && awardXP(10, '+10 XP — answer examined');
            result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } else result.appendChild(el('p', { class: 'pp-err' }, 'The AI Examiner returned no result. Please try again.'));
        } catch (err) {
          const message = err && err.message ? String(err.message) : 'AI Examiner request failed.';
          if (message.includes('Not enough credits') && window.RA10 && RA10.showPaywall) RA10.showPaywall('credits', 'ai_examiner');
          else result.appendChild(el('p', { class: 'pp-err' }, message));
        } finally {
          fb.disabled = false; delete fb.dataset.aiExamining; fb.textContent = '✦ AI Examiner';
        }
      });
      return wrap;
    }

    /* ── PDF download (real file via jsPDF) ── */
    function loadScriptOnce(src, test) {
      return new Promise((resolve, reject) => {
        if (test()) return resolve();
        const s = document.createElement('script');
        s.src = src; s.async = true;
        s.onload = () => test() ? resolve() : reject(new Error('Library failed to initialise'));
        s.onerror = () => reject(new Error('Could not load the PDF library'));
        document.head.appendChild(s);
      });
    }
    async function ensurePdfLib() {
      await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', () => !!(window.jspdf && window.jspdf.jsPDF));
      await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js', () => !!(window.jspdf && window.jspdf.jsPDF && window.jspdf.jsPDF.API.autoTable));
    }

    async function downloadPdf(id, withAnswers, btn, markScheme) {
      const p = getPaper(id);
      if (!p) return;
      const label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Preparing PDF…'; }
      try {
        await ensurePdfLib();
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        const W = 210, M = 18, CW = W - M * 2, BOTTOM = 280;
        const st = stateOf(id);
        const pc = pcfg(p);
        const clean = pdfText;
        let y = M;
        const headLine = `${C.qualLine || 'A-level'} ${C.subjectLine || 'Business'} ${pc.ref || ''}`;
        const runHeadPdf = (txt) => { doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(110); doc.text(clean(headLine), M, 10); doc.text(clean(txt), W - M, 10, { align: 'right' }); doc.setDrawColor(200); doc.line(M, 12, W - M, 12); doc.setTextColor(20); y = 20; };
        const newPage = (txt) => { doc.addPage(); runHeadPdf(txt); };
        const para = (t, size, style, gap, page) => {
          doc.setFont('helvetica', style || 'normal'); doc.setFontSize(size || 10.5);
          doc.splitTextToSize(clean(t), CW).forEach(line => { if (y > BOTTOM) newPage(page || 'Paper'); doc.text(line, M, y); y += (size || 10.5) * 0.45; });
          y += gap == null ? 3 : gap;
        };
        const heading = (t, page) => { if (y > BOTTOM - 12) newPage(page); doc.setFont('helvetica', 'bold'); doc.setFontSize(12.5); doc.text(clean(t), M, y); y += 7; };
        const table = (body, head, opts) => {
          doc.autoTable(Object.assign({ startY: y, head: head ? [head.map(clean)] : undefined, body: body.map(r => r.map(clean)), margin: { left: M, right: M, top: 20 }, styles: { font: 'helvetica', fontSize: 9, cellPadding: 2, lineColor: 180, lineWidth: 0.2, textColor: 20 }, headStyles: { fillColor: [235, 235, 235], textColor: 20, fontStyle: 'bold' }, theme: 'grid' }, opts || {}));
          y = doc.lastAutoTable.finalY + 6;
        };
        const ruled = (n, page) => { doc.setDrawColor(170); for (let i = 0; i < n; i++) { if (y > BOTTOM) newPage(page || 'Answers'); doc.setLineDashPattern([0.6, 0.9], 0); doc.line(M, y, W - M, y); doc.setLineDashPattern([], 0); y += 8; } };
        const pdfBlocks = (blocks, page) => (blocks || []).forEach(b => {
          if (b.t === 'h') para(b.x, 11, 'bold', 1, page);
          else if (b.t === 'h2') para(b.x, 10.5, 'bold', 1, page);
          else if (b.t === 'li') b.x.forEach(s => para('- ' + s, 10.5, 'normal', 1.2, page));
          else if (b.t === 'tbl' || b.t === 'flow') b.x.forEach(r => para(r, 10, 'normal', 0.5, page));
          else if (b.t === 'cap') para(b.x, 9.5, 'italic', 1, page);
          else if (b.t === 'grid') table(b.rows, b.head || undefined, { columnStyles: { 0: { fontStyle: 'bold' } } });
          else para(b.x, 10.5, 'normal', 3, page);
        });

        // Cover
        doc.setDrawColor(40); doc.setLineWidth(0.4);
        [['Centre number', M, 18, 84], ['Candidate number', M + 88, 18, 86], ['Surname', M, 34, 84], ['Forename(s)', M + 88, 34, 86]].forEach(([t, x, yy, w]) => { doc.rect(x, yy, w, 12); doc.setFontSize(7); doc.setFont('helvetica', 'normal'); doc.text(t, x + 1.5, yy + 3.5); });
        if (withAnswers) { doc.setFontSize(7); doc.text('Completed online with RA10', M + 1.5, 26); }
        doc.setFont('helvetica', 'normal'); doc.setFontSize(13); doc.text(clean(C.qualLine || 'A-level'), M, 66);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(30); doc.text(clean((C.subjectLine || 'Business').toUpperCase()), M, 84);
        doc.setFontSize(15); doc.text(clean((pc.name || 'Paper') + '  ' + (pc.sub || '')), M, 98);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(12); doc.text(clean(markScheme ? 'Mark scheme · ' + (p.source === 'aqa' ? p.series : 'RA10 practice paper') : (p.source === 'aqa' ? p.series : 'RA10 practice paper')), M, 110);
        doc.rect(M, 120, 56, 18); doc.rect(M + 60, 120, 56, 18); doc.rect(W - M - 54, 120, 54, 18);
        doc.setFontSize(8); doc.text('Paper reference', M + 2, 125); doc.text('Time allowed', M + 62, 125); doc.text('Maximum mark', W - M - 52, 125);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.text(clean(pc.ref || C.code), M + 2, 134); doc.text(clean(pc.time || '2 hours'), M + 62, 134); doc.text(String(p.total), W - M - 52, 134);
        y = 150;
        (pc.instructions || []).forEach(([h, items]) => {
          doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text(h, M, y); y += 6;
          doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
          items.forEach(it => { doc.splitTextToSize('- ' + clean(it.replace('{total}', p.total)), CW).forEach(l => { doc.text(l, M + 2, y); y += 4.6; }); });
          y += 2.5;
        });
        doc.setFontSize(7.5); doc.setTextColor(110);
        doc.text(clean(p.source === 'aqa' ? 'Past paper content (c) AQA and its licensors. Reformatted by RA10 for revision practice.' : 'RA10 practice paper written in the AQA format. Not an AQA paper.'), M, 286);
        doc.setTextColor(20);

        if (hasInsert(p) && !markScheme) { newPage('Insert'); heading('Insert - Source material', 'Insert'); pdfBlocks(p.insert, 'Insert'); }
        const groups = groupsOf(p);
        const seenCase = new Set();
        groups.forEach(g => {
          newPage(g.section ? 'Section ' + g.section : g.label);
          if (g.section && pc.sections && pc.sections[g.section]) heading(pc.sections[g.section].title + (pc.sections[g.section].sub ? ' - ' + pc.sections[g.section].sub : ''), 'Section ' + g.section);
          if (!markScheme && !hasInsert(p)) { const cb = caseBlocks(p, g.items[0]); if (cb.length && !seenCase.has(g.id)) { seenCase.add(g.id); pdfBlocks(cb, g.label); } }
          if (g.choice) para('Answer either Question ' + g.items.map(i => i.q).join(' or Question ') + '.', 10.5, 'bold', 3, g.label);
          g.items.forEach((it, idx) => {
            if (g.choice && idx > 0) para('OR', 10.5, 'bold', 3, g.label);
            if (y > BOTTOM - 40) newPage(g.label);
            doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
            const lines = doc.splitTextToSize(clean(it.q + '   ' + it.text), CW - 22);
            doc.text(lines, M, y); doc.text(`[${it.marks}]`, W - M, y + (lines.length - 1) * 4.9, { align: 'right' }); y += lines.length * 4.9 + 3;
            if (it.kind === 'mcq') {
              (it.options || []).forEach(o => para(o[0] + '   ' + o[1], 10.5, 'normal', 1.2, g.label));
              if (markScheme) para('Answer: ' + (it.answer || '-') + (it.answer_text ? ' - ' + it.answer_text : '') + (it.ms && it.ms.why ? '  (' + it.ms.why + ')' : ''), 10, 'bold', 3, g.label);
              else if (withAnswers && st['A' + it.q]) para('My answer: ' + st['A' + it.q] + (it.answer ? (st['A' + it.q] === it.answer ? '  (correct)' : '  (correct answer ' + it.answer + ')') : ''), 10, 'italic', 3, g.label);
              y += 1;
              return;
            }
            if (markScheme) {
              const ms = it.ms || {};
              const lines2 = (ms.points && ms.points.length ? ['Answer: ' + (ms.answer || '')].concat(ms.points) : []).concat(ms.body || []);
              if (ms.for) { para('For:', 10, 'bold', 1, g.label); ms.for.forEach(s => para('- ' + s, 10, 'normal', 1, g.label)); para('Against:', 10, 'bold', 1, g.label); ms.against.forEach(s => para('- ' + s, 10, 'normal', 1, g.label)); if (ms.judge) para('Judgement: ' + ms.judge, 10, 'normal', 3, g.label); }
              else lines2.forEach(s => para(stripBullet(s), 10, 'normal', 1, g.label));
              if (ms.ao) para('Marks for this question: ' + ms.ao, 9, 'italic', 3, g.label);
              y += 2; return;
            }
            const ans = answerText(p, st, it);
            if (withAnswers && ans.trim()) para(ans, 10.5, 'normal', 4, g.label); else ruled(it.kind === 'calc' ? 5 : lineCount(it), g.label);
            if (withAnswers) { const v = valOf(st, it.q); if (v != null) { doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.text(`Mark: ${v}/${it.marks}`, M, y); y += 5; } }
            y += 3;
          });
        });
        doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
        if (y > BOTTOM) newPage('End');
        doc.text(`END OF QUESTIONS · TOTAL ${p.total} MARKS`, W / 2, y + 6, { align: 'center' });
        const pages = doc.getNumberOfPages();
        for (let i = 1; i <= pages; i++) { doc.setPage(i); doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(120); doc.text(`${i} / ${pages}`, W / 2, 292, { align: 'center' }); }
        const fname = `${C.fileStem || 'AQA-Business'}-${p.source === 'aqa' ? p.series : 'RA10-' + p.title}${markScheme ? '-mark-scheme' : withAnswers ? '-my-answers' : ''}.pdf`.replace(/[^A-Za-z0-9.]+/g, '-');
        doc.save(fname);
      } catch (err) {
        alert('Sorry — the PDF could not be created (' + (err && err.message ? err.message : 'unknown error') + ').');
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = label; }
      }
    }

    return { renderPapers, openPaper, getQuestions: () => (window.AQA_PAPERS ? QS() : []) };
  }

  window.AqaPapers = { buildQuestions, init, blockText };
})();
