/* RA10 — BTEC Level 3 Business: past papers & set tasks (shared by Units 2, 3, 6 and 7).
   Reads window.BIZ_UNIT (unit config) and window.BIZ_PAPERS (paper data) and provides:
     BizPapers.buildQuestions(papers, cfg)  → question-bank items for every activity / question
     BizPapers.init(ctx)                    → paper library, exam-paper viewer, answer mode, AI Examiner, PDF download
   Past-paper text is reproduced from the Pearson papers for revision (© Pearson Education Ltd). */
(function () {
  'use strict';

  const cfg = () => window.BIZ_UNIT || {};

  /* ───────────────────────── helpers ───────────────────────── */
  function blockText(b) {
    if (!b) return '';
    if (b.t === 'stat') return (b.x.q ? b.x.q + '\n' : '') + b.x.c.map((c, i) => c + ': ' + b.x.v[i]).join('; ');
    if (b.t === 'li') return b.x.map(s => '• ' + s).join('\n');
    if (b.t === 'tbl' || b.t === 'flow') return b.x.join('\n');
    if (b.t === 'grid') return (b.head ? b.head.join(' | ') + '\n' : '') + b.rows.map(r => r.join(' | ')).join('\n');
    return String(b.x || '');
  }
  function caseText(p, max) {
    const t = (p.partA || []).concat(p.partB || []).map(blockText).join('\n');
    return t.length > max ? t.slice(0, max) + ' […]' : t;
  }
  function itemKey(it) { return String(it.q) + (it.sub ? '(' + it.sub + ')' : ''); }
  function itemLabel(it) { return it.sub ? it.q + '(' + it.sub + ')' : String(it.q); }
  function isCalc(it) {
    const t = it.text || '';
    return /^(calculate|work out|complete|use the figures|use the information)/i.test(t) || (/calculate/i.test(t) && it.marks <= 5);
  }
  // "Draw a network diagram / flowchart …" questions get a blank page (paper) or a drawing pad (online).
  function isDiagram(it) {
    return !!(it && (it.diagram || /^(draw|sketch)\b|\b(draw|sketch) (a|an|the)\b[^.?]*\b(diagram|flowchart|flow chart)/i.test(String(it.text || ''))));
  }
  function verbOf(text) {
    const m = String(text || '').match(/^(?:\(?[a-z]{1,4}\)?\s+)?([A-Za-z]+)/);
    return m ? m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase() : '';
  }
  function msLines(body) {
    return String(body || '').split('\n').map(s => s.replace(/^[••]\s*/, '').trim()).filter(Boolean);
  }
  function pdfText(t) {
    return String(t || '').replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/×/g, 'x').replace(/÷/g, '/').replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/→/g, '->').replace(/•/g, '-').replace(/·/g, '-').replace(/…/g, '...').replace(/[^\x00-\xFF]/g, '');
  }

  /* ───────────────────────── question bank from papers ───────────────────────── */
  function afTraits(afs, total) {
    return afs.map(a => ({ name: a.id + ' ' + a.name, weight: Math.round(a.max / total * 100), top_band: a.bands[a.bands.length - 1].descriptor, max: a.max }));
  }

  function setQuestion(p, a, c) {
    const afs = (c.afs && c.afs[a.n]) || [];
    const total = afs.reduce((s, x) => s + x.max, 0) || a.marks;
    const aim = c.classify ? c.classify(a.text + ' ' + p.title, 'set', a.n, p) : (c.aims[0] || 'A');
    return {
      id: p.id + '-A' + a.n, learning_aim: aim, topic: (c.activityTitles && c.activityTitles[a.n]) || ('Activity ' + a.n),
      command_verb: a.kind === 'presentation' ? 'Present' : a.kind === 'plan' ? 'Plan' : a.kind === 'rationale' ? 'Rationale' : 'Report',
      marks: a.marks, ao: 'AO3/AO4', scenario: '', question: a.text.replace(/\n• /g, ' • ').replace(/\n\s*– /g, ' – '),
      type: 'extended_levels', origin: p.source, series: p.series, spec_code: c.code, unit: c.n, paper_id: p.id, activity: a.n, case_title: p.title,
      case_text: caseText(p, 16000),
      mark_scheme: {
        instruction: 'Marked by assessment focus (AF). Each AF is placed in a band using best fit, then the AF marks are added together.',
        afs, traits: afTraits(afs, total),
        indicative_content: (c.indicative && c.indicative[a.n]) || [],
        level_descriptors: []
      }
    };
  }

  function examQuestion(p, it, c) {
    const levels = window.BIZ_LEVELS || {};
    const calc = isCalc(it);
    const ext = it.marks >= 6 && !(it.ms && it.ms.pts);   // pts: a 6+ mark item with a points-based (not levels) mark scheme
    const aim = c.classify ? c.classify(it.text + ' ' + (it.ctx || []).join(' '), it.section, it.q, p, it.text) : (c.aims[0] || 'A');
    const q = {
      id: p.id + '-Q' + itemLabel(it).replace(/[()]/g, ''), learning_aim: aim, topic: (c.topicFor && c.topicFor(it.text)) || ('Section ' + it.section),
      command_verb: verbOf(it.text), marks: it.marks, ao: ext ? 'AO3/AO4' : calc ? 'AO2' : 'AO1',
      scenario: ((it.ctx && it.ctx.length) ? it.ctx.join('\n') : (it.ctxb || []).map(blockText).join('\n')), question: it.text,
      type: ext ? 'extended_levels' : calc ? 'calculation' : 'short', origin: p.source, series: p.series, spec_code: c.code, unit: c.n,
      paper_id: p.id, item_q: it.q, item_sub: it.sub || null, section: it.section, case_title: p.title,
    };
    if (it.ms && it.ms.body) {
      const lines = msLines(it.ms.body);
      const guidance = lines.filter(l => /^(accept|do not accept|ignore|allow)/i.test(l));
      const body = lines.filter(l => !/^(accept|do not accept|ignore|allow)/i.test(l));
      if (ext) {
        q.mark_scheme = { instruction: 'Levels-based mark scheme: best fit, judged on knowledge, application, balance and reasoning.', indicative_content: body, level_descriptors: (Array.isArray(it.ms.levels) && it.ms.levels.length ? it.ms.levels : levels[it.marks] || levels[String(it.marks)] || []), additional_guidance: guidance.join(' ') || null };
      } else {
        const first = body.length && /^(award|1 mark|\d+ marks?)/i.test(body[0]) ? body[0] : '';
        q.mark_scheme = { instruction: first || (it.marks === 1 ? 'Award one mark.' : 'Award one mark for each correct point, up to ' + it.marks + ' marks.'), points: first ? body.slice(1) : body, additional_guidance: guidance.join(' ') || null };
      }
      q.mark_scheme.raw = it.ms.body;
    } else {
      q.mark_scheme = { instruction: 'No published mark scheme could be matched to this item; the AI Examiner marks it using Pearson principles for this unit.', points: [] };
    }
    return q;
  }

  function buildQuestions(papers, c) {
    c = c || cfg();
    const out = [];
    (papers || []).forEach(p => {
      if (p.kind === 'set') p.acts.forEach(a => out.push(setQuestion(p, a, c)));
      else p.items.forEach(it => out.push(examQuestion(p, it, c)));
    });
    return out;
  }

  /* ───────────────────────── viewer ───────────────────────── */
  function init(ctx) {
    const { $, el, renderMarkScheme, buildAutoMarkUI, normaliseAiMarkResult, awardXP } = ctx;
    const C = cfg();
    const STORE = 'ra10_' + C.key + '_paper_';
    let timer = null;
    let view = { id: null, mode: 'paper' };

    const allPapers = () => window.BIZ_PAPERS || [];
    const getPaper = (id) => allPapers().find(p => p.id === id);
    const stateOf = (id) => { try { return JSON.parse(localStorage.getItem(STORE + id) || '{}') || {}; } catch (e) { return {}; } };
    const saveState = (id, s) => { try { localStorage.setItem(STORE + id, JSON.stringify(s)); } catch (e) {} };
    const questionsOf = (p) => ctx.getQuestions().filter(q => q.paper_id === p.id);
    const questionFor = (p, key) => questionsOf(p).find(q => (p.kind === 'set' ? String(q.activity) === String(key) : (String(q.item_q) + (q.item_sub ? '(' + q.item_sub + ')' : '')) === String(key)));

    function answeredIn(p, st) {
      if (p.kind === 'set') return p.acts.filter(a => answerText(p, st, a.n).trim().length > 0).length;
      return p.items.filter(it => answerText(p, st, itemKey(it)).trim().length > 0).length;
    }
    function unitsCount(p) { return p.kind === 'set' ? p.acts.length : p.items.length; }
    function scoreOf(p, st) {
      let got = 0, max = 0, n = 0;
      const rows = p.kind === 'set' ? p.acts.map(a => [String(a.n), a.marks]) : p.items.map(it => [itemKey(it), it.marks]);
      rows.forEach(([k, m]) => { const v = Number.isFinite(st['S' + k]) ? st['S' + k] : (Number.isFinite(st['M' + k]) ? st['M' + k] : null); if (v != null) { got += v; max += m; n++; } });
      return { got, max, n, of: rows.length };
    }

    /* ---- answers ---- */
    function slidesText(slides) {
      return (slides || []).map((s, i) => `SLIDE ${i + 1}: ${s.t || ''}\n${s.b || ''}\nSPEAKER NOTES: ${s.n || ''}`).join('\n\n');
    }
    function budgetText(rows) {
      const r = (rows || []).filter(x => (x.item || '').trim() || Number(x.cost));
      if (!r.length) return '';
      const total = r.reduce((s, x) => s + (Number(x.cost) || 0), 0);
      return 'CAMPAIGN BUDGET TABLE\n' + r.map(x => `${x.item || '(item)'}: £${Number(x.cost) || 0}`).join('\n') + `\nTOTAL: £${total}`;
    }
    function answerText(p, st, key) {
      if (p.kind === 'set') {
        const a = p.acts.find(x => String(x.n) === String(key));
        if (!a) return '';
        if (a.kind === 'presentation') {
          const sl = (st['P' + key] || []).filter(s => (s.t || s.b || s.n || '').toString().trim());
          return slidesText(sl);
        }
        const base = String(st['A' + key] || '');
        const bt = a.kind === 'plan' ? budgetText(st.budget) : '';
        return (base + (bt ? '\n\n' + bt : '')).trim();
      }
      const it = p.items.find(x => itemKey(x) === String(key));
      if (!it) return '';
      const w = String(st['W' + key] || '').trim(), a = String(st['A' + key] || '').trim();
      if (isDiagram(it)) return (st['I' + key] ? '[Diagram attached as an image]' + (a ? '\nNotes: ' + a : '') : a).trim();
      if (isCalc(it)) return ((w ? 'Working:\n' + w + '\n' : '') + (a ? 'Answer: ' + a : '')).trim();
      return a;
    }

    /* ---- library ---- */
    function renderPapers(filter) {
      const host = $('#papers-host');
      if (!host) return;
      clearInterval(timer); timer = null; view.id = null;
      host.innerHTML = ''; host.className = 'pp-library';
      const papers = allPapers();
      const cur = filter || host.dataset.filter || 'pearson';
      host.dataset.filter = cur;
      const nP = papers.filter(p => p.source === 'pearson').length, nR = papers.filter(p => p.source === 'ra10').length;

      const top = el('div', { class: 'pp-libbar' });
      const seg = el('div', { class: 'pp-seg', role: 'tablist' });
      [['pearson', 'Past Papers', nP], ['ra10', 'RA10 Papers', nR]].forEach(([k, label, n]) => {
        if (k === 'ra10' && !n) return;
        const b = el('button', { type: 'button', role: 'tab', class: k === cur ? 'on' : '', 'aria-selected': String(k === cur) }, label, el('span', { class: 'pp-count' }, String(n)));
        b.addEventListener('click', () => renderPapers(k));
        seg.appendChild(b);
      });
      top.appendChild(seg);
      if (nR) {
        const mock = el('button', { type: 'button', class: 'btn primary' }, '⏱ Timed mock (unseen paper)');
        mock.addEventListener('click', () => {
          const pool = papers.filter(p => p.source === 'ra10');
          openPaper(pool[Math.floor(Math.random() * pool.length)].id, { mode: 'answer', timed: true });
        });
        top.appendChild(mock);
      }
      host.appendChild(top);

      host.appendChild(el('div', { class: 'pp-howto' }, ...(C.howto || []).map((t, i) => el('div', null, el('b', null, String(i + 1)), el('span', null, t)))));
      if (C.paperNote) host.appendChild(el('p', { class: 'pp-libnote' }, C.paperNote));

      const grid = el('div', { class: 'pp-grid' });
      let lastGroup = null;
      papers.filter(p => p.source === cur).slice().sort((a, b) => (a.key < b.key ? 1 : -1)).forEach(p => {
        const grp = C.specGroups && p.spec && C.specGroups[p.spec];
        if (grp && p.spec !== lastGroup) { lastGroup = p.spec; grid.appendChild(el('h3', { class: 'pp-group-h' }, grp.t, el('small', null, grp.d))); }
        const st = stateOf(p.id);
        const done = answeredIn(p, st), tot = unitsCount(p);
        const sc = scoreOf(p, st);
        const card = el('article', { class: 'pp-card' });
        card.appendChild(el('div', { class: 'pp-card-top' }, el('span', { class: 'pp-series' }, p.source === 'pearson' ? p.series : 'RA10 practice'), el('span', { class: 'pp-focus health' }, p.total + ' marks')));
        if (p.badge) card.appendChild(el('span', { class: 'pp-badge ' + (p.badgeTone || '') }, p.badge));
        card.appendChild(el('h3', null, p.title));
        const meta = C.cardMeta ? C.cardMeta(p) : p.kind === 'set'
          ? (p.theme ? p.theme + ' · ' : '') + p.acts.map(a => `Activity ${a.n}: ${a.marks}`).join(' · ')
          : `Section A ${p.sec && p.sec.A ? p.sec.A : '—'} · Section B ${p.sec && p.sec.B ? p.sec.B : '—'} · ${p.items.length} parts`;
        card.appendChild(el('p', { class: 'pp-meta' }, meta));
        if (p.blurb) card.appendChild(el('p', { class: 'pp-goal' }, p.blurb));
        card.appendChild(el('div', { class: 'pp-progress' }, el('i', { style: `width:${Math.round(done / tot * 100)}%` })));
        card.appendChild(el('p', { class: 'pp-status' }, done ? `${done}/${tot} answered${sc.n ? ` · ${sc.got}/${sc.max} marked` : ''}` : `Not started · ${p.kind === 'set' ? p.acts.length + ' activities' : p.items.length + ' questions'} · ${p.total} marks`));
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
      host.appendChild(el('p', { class: 'pp-legal' }, C.legal || 'Past paper text © Pearson Education Ltd, reformatted by RA10 for revision. Tables and charts in the original papers can lose their layout when converted to text — always check key figures against the official paper.'));
    }

    /* ---- block renderer ---- */
    function renderBlocks(blocks, wrap) {
      (blocks || []).forEach(b => {
        if (b.t === 'h') wrap.appendChild(el('h4', { class: 'pp-qhead' }, b.x));
        else if (b.t === 'li') { const ul = el('ul', { class: 'pp-list' }); b.x.forEach(s => ul.appendChild(el('li', null, s))); wrap.appendChild(ul); }
        else if (b.t === 'tbl') wrap.appendChild(el('div', { class: 'pp-rows' }, ...b.x.map(r => el('div', null, r))));
        else if (b.t === 'cap') wrap.appendChild(el('p', { class: 'pp-tcap' }, b.x));
        else if (b.t === 'flow') wrap.appendChild(el('div', { class: 'pp-flow' }, ...b.x.map(r => el('span', null, r))));
        else if (b.t === 'grid') {
          const t = el('table', { class: 'pp-data' });
          if (b.head) t.appendChild(el('tr', null, ...b.head.map(h => el('th', null, h))));
          b.rows.forEach(r => t.appendChild(el('tr', null, ...r.map((c, i) => i === 0 ? el('th', null, c) : el('td', null, c)))));
          wrap.appendChild(el('div', { class: 'pp-scroll' }, t));
        }
        else if (b.t === 'stat') {
          const vals = b.x.v.map(v => parseFloat(String(v).replace(/[,%£$]/g, '')) || 0);
          const max = Math.max(1, ...vals);
          const card = el('div', { class: 'pp-stat' });
          if (b.x.q) card.appendChild(el('p', { class: 'pp-stat-q' }, b.x.q));
          const t = el('table', { class: 'pp-stat-table' });
          b.x.c.forEach((c, i) => t.appendChild(el('tr', null, el('td', null, c), el('td', { class: 'pp-stat-v' }, String(b.x.v[i])), el('td', { class: 'pp-stat-bar' }, el('i', { style: `width:${Math.max(2, Math.round(vals[i] / max * 100))}%` })))));
          card.appendChild(t);
          wrap.appendChild(card);
        } else wrap.appendChild(el('p', { class: 'pp-body' }, b.x));
      });
    }

    function runHead(p, label) {
      return el('div', { class: 'pp-runhead' }, el('span', null, `Unit ${C.n}: ${C.name}`), el('span', null, label));
    }

    /* ---- open paper ---- */
    function openPaper(id, opts) {
      opts = opts || {};
      const host = $('#papers-host');
      const p = getPaper(id);
      if (!host || !p) return;
      clearInterval(timer); timer = null;
      view = { id, mode: opts.mode || view.mode || 'paper' };
      const st = stateOf(id);
      host.innerHTML = ''; host.className = 'pp-viewer-host';

      const bar = el('div', { class: 'pp-toolbar' });
      const back = el('button', { type: 'button', class: 'pp-tool' }, '← Papers');
      back.addEventListener('click', () => renderPapers());
      const title = el('div', { class: 'pp-title' }, el('strong', null, p.title), el('span', null, p.source === 'pearson' ? `Pearson ${p.series} · ${p.code || C.code}` : 'RA10 practice paper'));
      const modes = el('div', { class: 'pp-seg small' });
      [['paper', '📄 Paper'], ['answer', '✍️ Answer online']].forEach(([k, label]) => {
        const b = el('button', { type: 'button', class: view.mode === k ? 'on' : '' }, label);
        b.addEventListener('click', () => { if (view.mode !== k) { view.mode = k; openPaper(id, { mode: k, keepScroll: true }); } });
        modes.appendChild(b);
      });
      const mins = p.minutes || C.minutes || 120;
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
      const dl = el('button', { type: 'button', class: 'pp-tool primary' }, '⤓ Download PDF');
      const dlMenu = el('div', { class: 'pp-menu', hidden: '' });
      const dlBlank = el('button', { type: 'button' }, 'Blank exam paper');
      const dlMine = el('button', { type: 'button' }, 'Paper with my answers');
      dlBlank.addEventListener('click', () => { dlMenu.hidden = true; downloadPdf(id, false, dl); });
      dlMine.addEventListener('click', () => { dlMenu.hidden = true; downloadPdf(id, true, dl); });
      dlMenu.appendChild(dlBlank); dlMenu.appendChild(dlMine);
      dl.addEventListener('click', (e) => { e.stopPropagation(); dlMenu.hidden = !dlMenu.hidden; });
      host.addEventListener('click', () => { dlMenu.hidden = true; });
      bar.appendChild(back); bar.appendChild(title); bar.appendChild(modes);
      bar.appendChild(el('div', { class: 'pp-tools-right' }, timerEl, timerBtn, el('div', { class: 'pp-dlwrap' }, dl, dlMenu)));
      host.appendChild(bar);

      const shell = el('div', { class: 'pp-shell' });
      const side = el('aside', { class: 'pp-side' });
      const nav = el('nav', { class: 'pp-nav' });
      const navItems = [['pp-cover', 'Cover']];
      let qgroups = [];
      if (p.kind === 'set') {
        if (p.partA && p.partA.length) navItems.push(['pp-parta', C.partALabel || 'Part A · Research']);
        navItems.push(['pp-partb', 'Part B · Set task']);
        p.acts.forEach(a => navItems.push(['pp-act-' + a.n, `Activity ${a.n}`, String(a.n), a.marks]));
      } else {
        const by = {};
        p.items.forEach(it => { (by[it.q] = by[it.q] || []).push(it); });
        qgroups = Object.keys(by).map(Number).sort((a, b) => a - b).map(q => by[q]);
        qgroups.forEach(g => navItems.push(['pp-q-' + g[0].q, `Question ${g[0].q}`, null, g.reduce((s, x) => s + x.marks, 0), g]));
      }
      navItems.forEach(([tid, label, key, marks, grp]) => {
        const b = el('button', { type: 'button', 'data-target': tid }, el('span', null, label));
        if (marks != null) b.appendChild(el('em', { 'data-badge': tid }, badgeText(p, st, key, marks, grp)));
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
        scoreBox.appendChild(el('small', null, sc.n ? `${sc.n} of ${sc.of} ${p.kind === 'set' ? 'activities' : 'parts'} marked` : 'Answer online, then use the AI Examiner or self-mark'));
      };
      paintScore();
      side.appendChild(scoreBox);
      shell.appendChild(side);

      const refresh = () => {
        paintScore();
        nav.querySelectorAll('[data-badge]').forEach(e => {
          const t = e.getAttribute('data-badge');
          const item = navItems.find(x => x[0] === t);
          if (item) e.textContent = badgeText(p, st, item[2], item[3], item[4]);
        });
      };

      const doc = el('div', { class: 'pp-doc' + (view.mode === 'answer' ? ' answering' : '') });
      doc.appendChild(coverPage(p));
      if (p.kind === 'set') {
        if (p.partA && p.partA.length) doc.appendChild(partAPage(p));
        doc.appendChild(partBPage(p));
        p.acts.forEach(a => doc.appendChild(activityPage(p, a, st, view.mode, refresh)));
      } else {
        const secs = {};
        qgroups.forEach(g => {
          const sec = g[0].section;
          doc.appendChild(questionPage(p, g, st, view.mode, refresh, !secs[sec] ? sec : null));
          secs[sec] = true;
        });
      }
      doc.appendChild(el('div', { class: 'pp-page pp-end' }, el('p', null, `TOTAL FOR PAPER = ${p.total} MARKS`), el('small', null, p.legal || (p.source === 'pearson' ? 'Past paper content © Pearson Education Ltd. Reformatted by RA10 for revision.' : `RA10 practice paper written in the Pearson Unit ${C.n} format.`))));
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

    function badgeText(p, st, key, marks, grp) {
      if (p.kind === 'set') {
        const v = Number.isFinite(st['S' + key]) ? st['S' + key] : (Number.isFinite(st['M' + key]) ? st['M' + key] : null);
        return v != null ? `${v}/${marks}` : (answerText(p, st, key) ? '✓' : `${marks}m`);
      }
      let got = 0, n = 0;
      (grp || []).forEach(it => { const k = itemKey(it); const v = Number.isFinite(st['S' + k]) ? st['S' + k] : (Number.isFinite(st['M' + k]) ? st['M' + k] : null); if (v != null) { got += v; n++; } });
      if (n === (grp || []).length && n) return `${got}/${marks}`;
      return (grp || []).some(it => answerText(p, st, itemKey(it))) ? '✓' : `${marks}m`;
    }

    /* ---- pages ---- */
    function coverPage(p) {
      const page = el('section', { class: 'pp-page pp-cover', id: 'pp-cover' });
      page.appendChild(el('div', { class: 'pp-cover-boxes' },
        el('div', null, el('small', null, 'Candidate surname'), el('span')), el('div', null, el('small', null, 'Other names'), el('span')),
        el('div', null, el('small', null, 'Centre number'), el('span')), el('div', null, el('small', null, 'Learner registration number'), el('span'))));
      page.appendChild(el('p', { class: 'pp-qual' }, p.qual || C.qualLine || 'Pearson BTEC Level 3 Nationals Certificate, Extended Certificate, Foundation Diploma, Diploma, Extended Diploma'));
      page.appendChild(el('p', { class: 'pp-series-big' }, p.source === 'pearson' ? (p.date || p.series) : 'RA10 practice paper'));
      page.appendChild(el('h2', null, C.subject || 'Business'));
      page.appendChild(el('h3', null, `Unit ${C.n}: ${C.name}`));
      page.appendChild(el('p', { class: 'pp-part' }, p.kind === 'set' ? C.partsLabel : (C.partLine || `Sections A and B`)));
      if (p.notice) page.appendChild(el('div', { class: 'pp-notice ' + (p.badgeTone || '') }, el('b', null, p.badge || 'Note'), el('span', null, p.notice)));
      page.appendChild(el('div', { class: 'pp-cover-row' }, el('div', null, el('small', null, 'Paper reference'), el('b', null, p.code || C.code)), el('div', null, el('small', null, 'Time'), el('b', null, C.timeLabel)), el('div', { class: 'pp-total' }, el('small', null, 'Total marks'), el('b', null, String(p.total)))));
      const instr = (C.instructions || []);
      const h = el('div', { class: 'pp-instr' });
      instr.forEach(([t, items]) => { h.appendChild(el('h4', null, t)); h.appendChild(el('ul', null, ...items.map(i => el('li', null, i.replace('{total}', p.total))))); });
      page.appendChild(h);
      return page;
    }

    function partAPage(p) {
      const page = el('section', { class: 'pp-page', id: 'pp-parta' });
      page.appendChild(runHead(p, 'Part A'));
      page.appendChild(el('h3', { class: 'pp-section' }, C.partALabel || 'Part A'));
      renderBlocks(p.partA, page);
      if (C.partANote) page.appendChild(el('div', { class: 'pp-note' }, C.partANote));
      return page;
    }

    function partBPage(p) {
      const page = el('section', { class: 'pp-page', id: 'pp-partb' });
      page.appendChild(runHead(p, 'Part B'));
      page.appendChild(el('h3', { class: 'pp-section' }, 'Part B — Set task'));
      p.acts.forEach(a => {
        const box = el('div', { class: 'pp-actbox' });
        box.appendChild(el('h4', { class: 'pp-qhead' }, `Activity ${a.n}`));
        a.text.split('\n').forEach(line => {
          if (/^•/.test(line)) box.appendChild(el('p', { class: 'pp-bullet' }, line.replace(/^•\s*/, '')));
          else if (/^\s*–/.test(line)) box.appendChild(el('p', { class: 'pp-bullet sub' }, line.replace(/^\s*–\s*/, '')));
          else box.appendChild(el('p', { class: 'pp-body' }, line));
        });
        box.appendChild(el('p', { class: 'pp-total-line' }, `(Total for Activity ${a.n} = ${a.marks} marks)`));
        page.appendChild(box);
      });
      const info = (p.partB || []).filter(b => !(b.t === 'h' && /^(Set Task|Activity)/i.test(b.x)));
      const filtered = [];
      let skipping = true;
      // drop the leading activity wording that is already shown above
      info.forEach(b => {
        const t = blockText(b);
        if (skipping && (/^You must complete|^You will need to refer|^Using appropriate software|^Based on your rationale|^Prepare a|^With reference to|^You are to produce|^Your report|^The (rationale|plan|presentation|report) should|^The report should|^Your rationale|^This (should|must)|^You must produce|^You should present/i.test(t) || b.t === 'li')) return;
        skipping = false;
        filtered.push(b);
      });
      if (filtered.length) {
        page.appendChild(el('h3', { class: 'pp-section', style: 'margin-top:22px' }, 'Additional task information'));
        renderBlocks(filtered, page);
      }
      return page;
    }

    function stateBind(p, st, key, field, node) {
      node.value = st[field + key] || '';
      node.addEventListener('input', () => { st[field + key] = node.value; saveState(p.id, st); });
    }

    function activityPage(p, a, st, mode, onScore) {
      const page = el('section', { class: 'pp-page pp-activity', id: 'pp-act-' + a.n });
      page.appendChild(runHead(p, 'Taskbook'));
      page.appendChild(el('div', { class: 'pp-qrow' }, el('span', { class: 'pp-qnum' }, String(a.n)), el('p', { class: 'pp-qtext' }, `Activity ${a.n} — ${(C.activityTitles && C.activityTitles[a.n]) || ''}`), el('span', { class: 'pp-qmarks' }, `(${a.marks})`)));
      const q = questionFor(p, a.n);
      const mins = (C.activityMinutes && C.activityMinutes[a.n]) || Math.round(a.marks / p.total * (p.minutes || C.minutes));
      page.appendChild(el('p', { class: 'pp-hint' }, `Suggested time: about ${mins} minutes${a.kind === 'presentation' ? ' · slides and speaker notes' : ''}`));
      const key = String(a.n);

      if (mode === 'answer') {
        if (a.kind === 'presentation') page.appendChild(slideBuilder(p, st, key));
        else {
          if (a.kind === 'plan' && C.n === 2) page.appendChild(budgetHelper(p, st));
          const ta = el('textarea', { 'data-rmt': 'off', class: 'pp-lines', placeholder: C.placeholders && C.placeholders[a.kind] || 'Write your answer here…', rows: '22' });
          stateBind(p, st, key, 'A', ta);
          const count = el('span', { class: 'pp-wc' });
          const wc = () => { const n = ta.value.trim().split(/\s+/).filter(Boolean).length; count.textContent = n + ' words'; };
          ta.addEventListener('input', wc); wc();
          page.appendChild(ta); page.appendChild(count);
        }
      } else {
        page.appendChild(el('div', { class: 'pp-ruled', style: '--lines:24' }));
      }
      page.appendChild(el('p', { class: 'pp-total-line' }, `(Total for Activity ${a.n} = ${a.marks} marks)`));
      if (mode === 'answer') page.appendChild(feedbackRow(p, st, key, q, a.marks, onScore, () => answerText(p, st, key), a.kind === 'presentation' ? 60 : 120));
      return page;
    }

    function slideBuilder(p, st, key) {
      const wrap = el('div', { class: 'pp-slides' });
      const list = st['P' + key] = st['P' + key] || [{ t: '', b: '', n: '' }];
      const draw = () => {
        wrap.innerHTML = '';
        list.forEach((s, i) => {
          const card = el('div', { class: 'pp-slide' });
          card.appendChild(el('div', { class: 'pp-slide-h' }, el('b', null, `Slide ${i + 1}`), (() => { const x = el('button', { type: 'button', class: 'pp-x', title: 'Remove slide' }, '✕'); x.addEventListener('click', () => { if (list.length > 1) { list.splice(i, 1); saveState(p.id, st); draw(); } }); return x; })()));
          const t = el('input', { type: 'text', 'data-rmt': 'off', placeholder: 'Slide title', 'aria-label': 'Slide title' }); t.value = s.t || '';
          const b = el('textarea', { 'data-rmt': 'off', rows: '3', placeholder: 'Slide content — bullet points, figures, a chart description…', 'aria-label': 'Slide content' }); b.value = s.b || '';
          const n = el('textarea', { 'data-rmt': 'off', rows: '4', placeholder: 'Speaker notes / script — what you will say to persuade the audience…', 'aria-label': 'Speaker notes', class: 'pp-notes' }); n.value = s.n || '';
          [[t, 't'], [b, 'b'], [n, 'n']].forEach(([node, f]) => node.addEventListener('input', () => { s[f] = node.value; saveState(p.id, st); }));
          card.appendChild(t); card.appendChild(b); card.appendChild(el('label', { class: 'pp-notes-l' }, 'Speaker notes')); card.appendChild(n);
          wrap.appendChild(card);
        });
        const add = el('button', { type: 'button', class: 'btn ghost pp-addslide' }, '+ Add slide');
        add.addEventListener('click', () => { list.push({ t: '', b: '', n: '' }); saveState(p.id, st); draw(); });
        wrap.appendChild(add);
      };
      draw();
      return wrap;
    }

    function budgetHelper(p, st) {
      const text = (p.partB || []).concat(p.partA || []).map(blockText).join(' ');
      const m = text.match(/budget[^£]{0,60}£\s?([\d][\d\s,]*)/i);
      const limit = m ? parseInt(m[1].replace(/[\s,]/g, ''), 10) : null;
      const rows = st.budget = st.budget || [{ item: '', cost: '' }, { item: '', cost: '' }, { item: '', cost: '' }];
      const box = el('details', { class: 'pp-budget' });
      box.appendChild(el('summary', null, 'Budget planner (optional)', limit ? el('span', { class: 'pp-budget-lim' }, `Limit £${limit.toLocaleString('en-GB')}`) : null));
      const body = el('div', { class: 'pp-budget-body' });
      const totalEl = el('p', { class: 'pp-budget-total' });
      const draw = () => {
        body.innerHTML = '';
        rows.forEach((r, i) => {
          const row = el('div', { class: 'pp-budget-row' });
          const it = el('input', { type: 'text', 'data-rmt': 'off', placeholder: 'e.g. Instagram ads (6 months)', 'aria-label': 'Budget item' }); it.value = r.item || '';
          const co = el('input', { type: 'number', 'data-rmt': 'off', min: '0', step: '1', placeholder: '£', 'aria-label': 'Cost' }); co.value = r.cost || '';
          it.addEventListener('input', () => { r.item = it.value; saveState(p.id, st); });
          co.addEventListener('input', () => { r.cost = co.value; saveState(p.id, st); tot(); });
          row.appendChild(it); row.appendChild(co); body.appendChild(row);
        });
        const add = el('button', { type: 'button', class: 'btn ghost' }, '+ Add line');
        add.addEventListener('click', () => { rows.push({ item: '', cost: '' }); saveState(p.id, st); draw(); });
        body.appendChild(add); body.appendChild(totalEl); tot();
      };
      const tot = () => {
        const t = rows.reduce((s, r) => s + (Number(r.cost) || 0), 0);
        totalEl.textContent = `Total £${t.toLocaleString('en-GB')}` + (limit ? ` · ${t <= limit ? '£' + (limit - t).toLocaleString('en-GB') + ' remaining' : '£' + (t - limit).toLocaleString('en-GB') + ' OVER budget'}` : '');
        totalEl.classList.toggle('over', !!limit && t > limit);
      };
      draw();
      box.appendChild(body);
      box.appendChild(el('p', { class: 'pp-hint' }, 'Your budget table is sent to the AI Examiner with your plan. Add the same figures to your written plan too.'));
      return box;
    }

    function questionPage(p, grp, st, mode, onScore, sectionTitle) {
      const q0 = grp[0];
      const page = el('section', { class: 'pp-page pp-activity', id: 'pp-q-' + q0.q });
      page.appendChild(runHead(p, C.runLabel ? C.runLabel(q0) : 'Section ' + q0.section));
      const secTitle = sectionTitle && (C.sectionTitles ? C.sectionTitles[sectionTitle] : (sectionTitle === 'A' ? 'SECTION A — Personal Finance' : 'SECTION B — Business Finance'));
      if (secTitle) page.appendChild(el('h3', { class: 'pp-section' }, secTitle));
      const ctxSeen = new Set();
      grp.forEach(it => {
        const key = itemKey(it);
        const q = questionFor(p, key);
        ((it.ctx || []).length || (it.ctxb || []).length) && renderCtx(it, page, ctxSeen);
        page.appendChild(el('div', { class: 'pp-qrow' }, el('span', { class: 'pp-qnum' }, it.sub ? '(' + it.sub + ')' : String(it.q)), el('p', { class: 'pp-qtext' }, it.text), el('span', { class: 'pp-qmarks' }, `(${it.marks})`)));
        if (mode === 'answer' && isDiagram(it)) {
          page.appendChild(diagramPad(p, st, key, onScore));
          const notes = el('textarea', { 'data-rmt': 'off', class: 'pp-lines', placeholder: 'Optional notes: anything you couldn’t fit on the diagram (e.g. why you chose a connection type)…', rows: '3' });
          stateBind(p, st, key, 'A', notes);
          page.appendChild(notes);
          page.appendChild(feedbackRow(p, st, key, q, it.marks, onScore, () => String(st['A' + key] || '').trim(), 1, () => st['I' + key] || ''));
        } else if (mode === 'answer') {
          if (isCalc(it)) {
            const w = el('textarea', { 'data-rmt': 'off', class: 'pp-lines pp-work', rows: '5', placeholder: 'Show your working…' });
            stateBind(p, st, key, 'W', w);
            const a = el('input', { type: 'text', 'data-rmt': 'off', class: 'pp-ans', placeholder: 'Answer', 'aria-label': 'Answer' });
            stateBind(p, st, key, 'A', a);
            page.appendChild(w); page.appendChild(el('div', { class: 'pp-ans-row' }, el('label', null, 'Answer'), a));
          } else {
            const ta = el('textarea', { 'data-rmt': 'off', class: 'pp-lines', placeholder: /^draw/i.test(it.text) ? 'Describe your diagram: every device, how each one connects (wired / wireless / VPN …) and your annotations…' : 'Write your answer here…', rows: String(Math.max(4, Math.min(24, it.marks * 2))) });
            stateBind(p, st, key, 'A', ta);
            const count = el('span', { class: 'pp-wc' });
            const wc = () => { const n = ta.value.trim().split(/\s+/).filter(Boolean).length; count.textContent = n + ' words'; };
            ta.addEventListener('input', wc); wc();
            page.appendChild(ta); page.appendChild(count);
          }
          page.appendChild(feedbackRow(p, st, key, q, it.marks, onScore, () => answerText(p, st, key), isCalc(it) ? 1 : (it.marks >= 6 ? 40 : 6)));
        } else if (isDiagram(it)) {
          page.appendChild(el('div', { class: 'pp-drawspace' }, el('span', null, 'Use this space to draw your diagram.')));
        } else {
          page.appendChild(el('div', { class: 'pp-ruled', style: `--lines:${isCalc(it) ? 5 : Math.min(26, it.marks * 2 + 1)}` }));
        }
      });
      const tot = grp.reduce((s, x) => s + x.marks, 0);
      page.appendChild(el('p', { class: 'pp-total-line' }, `(Total for Question ${q0.q} = ${tot} marks)`));
      return page;
    }

    /* ---- drawing pad for diagram questions: draw on a blank page or upload a photo, then annotate ---- */
    // Drawing is kept as a list of shapes (st['D'+key]) so it can be undone and redrawn; a JPEG of the
    // finished page (st['I'+key]) is what the AI Examiner and the PDF use.
    function diagramPad(p, st, key, onScore) {
      const W = 1000, H = 1300;                       // one portrait "page"
      const ops = st['D' + key] = Array.isArray(st['D' + key]) ? st['D' + key] : [];
      const imgs = {};                                 // photo cache: src → loaded Image
      let tool = 'pen', colour = '#111827', cur = null, saveT = null;

      const wrap = el('div', { class: 'pp-pad' });
      const bar = el('div', { class: 'pp-pad-bar', role: 'toolbar', 'aria-label': 'Drawing tools' });
      const TOOLS = [['pen', '✎', 'Pen'], ['line', '╱', 'Line'], ['arrow', '➝', 'Arrow'], ['rect', '▭', 'Box'], ['round', '▢', 'Start / end'], ['diamond', '◇', 'Decision'], ['ellipse', '◯', 'Circle'], ['text', 'T', 'Text'], ['eraser', '⌫', 'Eraser']];
      const toolBtns = TOOLS.map(([k, ic, label]) => {
        const b = el('button', { type: 'button', class: 'pp-pad-tool' + (k === tool ? ' on' : ''), title: label, 'aria-label': label, 'aria-pressed': String(k === tool) }, el('b', null, ic), el('span', null, label));
        b.addEventListener('click', () => { tool = k; toolBtns.forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', String(on)); }); });
        return b;
      });
      const colours = ['#111827', '#2563eb', '#dc2626', '#16a34a'].map(c => {
        const b = el('button', { type: 'button', class: 'pp-pad-col' + (c === colour ? ' on' : ''), style: `--c:${c}`, title: 'Colour', 'aria-label': 'Colour ' + c });
        b.addEventListener('click', () => { colour = c; colours.forEach(x => x.classList.toggle('on', x === b)); });
        return b;
      });
      const undo = el('button', { type: 'button', class: 'pp-pad-act' }, '↶ Undo');
      const clear = el('button', { type: 'button', class: 'pp-pad-act' }, 'Clear');
      const fileIn = el('input', { type: 'file', accept: 'image/*', hidden: '' });
      const upload = el('button', { type: 'button', class: 'pp-pad-act primary' }, '⤒ Upload photo');
      const expand = el('button', { type: 'button', class: 'pp-pad-act', title: 'Bigger drawing area' }, '⤢ Full screen');
      bar.appendChild(el('div', { class: 'pp-pad-tools' }, ...toolBtns));
      bar.appendChild(el('div', { class: 'pp-pad-tools' }, ...colours, undo, clear, upload, expand, fileIn));
      const canvas = el('canvas', { class: 'pp-pad-canvas', width: String(W), height: String(H), 'aria-label': 'Drawing area for your diagram' });
      const ctx = canvas.getContext('2d');
      const status = el('p', { class: 'pp-pad-status' });
      wrap.appendChild(bar); wrap.appendChild(el('div', { class: 'pp-pad-page' }, canvas)); wrap.appendChild(status);

      const paintStatus = () => { status.textContent = st['I' + key] ? '✓ Diagram saved: it will be sent to the AI Examiner and included in “Paper with my answers”.' : 'Draw your diagram on the page above, or upload a photo of a diagram you drew on paper. You can annotate on top of a photo.'; };
      function drawOp(o) {
        ctx.save();
        ctx.strokeStyle = o.c; ctx.fillStyle = o.c; ctx.lineWidth = o.w || 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        if (o.t === 'img') { const im = imgs[o.src]; if (im && im.complete) ctx.drawImage(im, o.x, o.y, o.w2, o.h2); ctx.restore(); return; }
        if (o.t === 'pen' || o.t === 'eraser') {
          if (o.t === 'eraser') { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 26; }
          ctx.beginPath(); o.pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
          if (o.pts.length === 1) ctx.lineTo(o.pts[0][0] + 0.1, o.pts[0][1]);
          ctx.stroke(); ctx.restore(); return;
        }
        if (o.t === 'text') { ctx.font = '600 30px system-ui, sans-serif'; ctx.textBaseline = 'middle'; String(o.s).split('\n').forEach((ln, i) => ctx.fillText(ln, o.x, o.y + i * 36)); ctx.restore(); return; }
        const x = Math.min(o.x1, o.x2), y = Math.min(o.y1, o.y2), w = Math.abs(o.x2 - o.x1), h = Math.abs(o.y2 - o.y1);
        ctx.beginPath();
        if (o.t === 'line' || o.t === 'arrow') {
          ctx.moveTo(o.x1, o.y1); ctx.lineTo(o.x2, o.y2); ctx.stroke();
          if (o.t === 'arrow') { const a = Math.atan2(o.y2 - o.y1, o.x2 - o.x1), L = 22; ctx.beginPath(); ctx.moveTo(o.x2, o.y2); ctx.lineTo(o.x2 - L * Math.cos(a - 0.4), o.y2 - L * Math.sin(a - 0.4)); ctx.lineTo(o.x2 - L * Math.cos(a + 0.4), o.y2 - L * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill(); }
        } else if (o.t === 'rect') { ctx.strokeRect(x, y, w, h); }
        else if (o.t === 'round') { const r = Math.min(h / 2, w / 2); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); ctx.stroke(); }
        else if (o.t === 'diamond') { ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w, y + h / 2); ctx.lineTo(x + w / 2, y + h); ctx.lineTo(x, y + h / 2); ctx.closePath(); ctx.stroke(); }
        else if (o.t === 'ellipse') { ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); ctx.stroke(); }
        ctx.restore();
      }
      function redraw(extra) {
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
        ops.forEach(drawOp);
        if (extra) drawOp(extra);
      }
      function save() {
        clearTimeout(saveT);
        saveT = setTimeout(() => {
          if (ops.length) st['I' + key] = canvas.toDataURL('image/jpeg', 0.72); else delete st['I' + key];
          saveState(p.id, st); paintStatus(); onScore && onScore();
        }, 250);
      }
      // load any photos used in the saved drawing, then paint
      ops.filter(o => o.t === 'img').forEach(o => { const im = new Image(); im.onload = () => redraw(); im.src = o.src; imgs[o.src] = im; });
      redraw(); paintStatus();

      const pos = (e) => { const r = canvas.getBoundingClientRect(); return [Math.round((e.clientX - r.left) * W / r.width), Math.round((e.clientY - r.top) * H / r.height)]; };
      canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        const [x, y] = pos(e);
        if (tool === 'text') {
          const s = window.prompt('Text to add (e.g. a label or annotation):', '');
          if (s && s.trim()) { ops.push({ t: 'text', s: s.trim(), x, y, c: colour }); redraw(); save(); }
          return;
        }
        canvas.setPointerCapture(e.pointerId);
        cur = (tool === 'pen' || tool === 'eraser') ? { t: tool, pts: [[x, y]], c: colour, w: 3 } : { t: tool, x1: x, y1: y, x2: x, y2: y, c: colour, w: 3 };
        if (cur.pts) drawOp(cur);
      });
      canvas.addEventListener('pointermove', (e) => {
        if (!cur) return;
        const [x, y] = pos(e);
        if (cur.pts) { cur.pts.push([x, y]); drawOp({ t: cur.t, pts: cur.pts.slice(-2), c: cur.c, w: cur.w }); }
        else { cur.x2 = x; cur.y2 = y; redraw(cur); }
      });
      const end = () => {
        if (!cur) return;
        const tiny = !cur.pts && Math.abs(cur.x2 - cur.x1) < 4 && Math.abs(cur.y2 - cur.y1) < 4;
        if (!tiny) ops.push(cur);
        cur = null; redraw(); save();
      };
      canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);

      undo.addEventListener('click', () => { ops.pop(); redraw(); save(); });
      clear.addEventListener('click', () => { if (ops.length && !confirm('Clear the whole drawing?')) return; ops.length = 0; redraw(); save(); });
      upload.addEventListener('click', () => fileIn.click());
      fileIn.addEventListener('change', () => {
        const f = fileIn.files && fileIn.files[0];
        fileIn.value = '';
        if (!f || !/^image\//.test(f.type)) return;
        const rd = new FileReader();
        rd.onload = () => {
          const im = new Image();
          im.onload = () => {
            // shrink the photo so it fits the page (and stays small enough to save and send)
            const s = Math.min(W / im.width, H / im.height, 1);
            const w2 = Math.round(im.width * s), h2 = Math.round(im.height * s);
            const c2 = document.createElement('canvas'); c2.width = w2; c2.height = h2;
            c2.getContext('2d').drawImage(im, 0, 0, w2, h2);
            const src = c2.toDataURL('image/jpeg', 0.8);
            const small = new Image();
            // the photo goes underneath anything already drawn, so annotations stay visible
            small.onload = () => { imgs[src] = small; ops.unshift({ t: 'img', src, x: Math.round((W - w2) / 2), y: Math.round((H - h2) / 2), w2, h2 }); redraw(); save(); };
            small.src = src;
          };
          im.onerror = () => alert('That picture could not be opened. Try a JPEG or PNG photo.');
          im.src = rd.result;
        };
        rd.readAsDataURL(f);
      });
      expand.addEventListener('click', () => {
        const on = wrap.classList.toggle('full');
        expand.textContent = on ? '✕ Close full screen' : '⤢ Full screen';
        document.documentElement.classList.toggle('pp-pad-open', on);
      });
      return wrap;
    }

    function renderCtx(it, page, seen) {
      const key = ((it.ctx || []).join('|') + JSON.stringify(it.ctxb || []).slice(0, 200)).slice(0, 260);
      if (seen.has(key)) return; seen.add(key);
      renderBlocks(it.ctxb && it.ctxb.length ? it.ctxb : BizPapers.ctxBlocks(it.ctx || []), page);
    }

    /* ---- feedback row: AI Examiner + mark scheme + self-mark ---- */
    function feedbackRow(p, st, key, q, marks, onScore, getAnswer, minChars, getImage) {
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
        const image = getImage ? getImage() : '';
        const answer = getAnswer() || (image ? 'My diagram is attached as an image.' : '');
        if (!q) { alert('This question is not available to the AI Examiner.'); return; }
        if (getImage && !image) { alert('Draw your diagram or upload a photo of it first, then press “AI Examiner”.'); return; }
        if (!image && answer.replace(/Working:|Answer:|SLIDE \d+:|SPEAKER NOTES:/g, '').trim().length < Math.min(minChars || 10, 12)) { alert('Write your answer first, then press “AI Examiner”.'); return; }
        if (!window.RA10 || typeof RA10.examineAnswer !== 'function') { alert('AI Examiner is not available right now.'); return; }
        if (window.RA10AI && !(await RA10AI.confirmCredits(RA10AI.examinerCost(), 'AI Examiner'))) return;
        fb.disabled = true; fb.dataset.aiExamining = 'true';
        fb.innerHTML = '<span class="ai-examiner-loading"><span class="ai-examiner-orb"></span><span>Marking<span class="ai-examiner-dots">...</span></span></span>';
        try {
          const response = await RA10.examineAnswer(image ? { question: q, answer, image } : { question: q, answer });
          result.innerHTML = '';
          if (response && response.result) {
            result.appendChild(window.RA10AI
              ? RA10AI.renderExamResult({ question: q, answer, result: response.result, markScheme: () => renderMarkScheme(q) })
              : buildAutoMarkUI(q, answer, normaliseAiMarkResult(response.result, q, true, answer), 'ai'));
            const earned = Number(response.result.earned);
            if (Number.isFinite(earned)) { st['S' + key] = earned; saveState(p.id, st); paintLast(); onScore && onScore(); }
            awardXP(10, '+10 XP — answer examined');
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

    async function downloadPdf(id, withAnswers, btn) {
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
        const clean = pdfText;
        let y = M;
        const unitLine = `Unit ${C.n}: ${C.name}`;
        const runHeadPdf = (txt) => { doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(110); doc.text(clean(unitLine), M, 10); doc.text(txt, W - M, 10, { align: 'right' }); doc.setDrawColor(200); doc.line(M, 12, W - M, 12); doc.setTextColor(20); y = 20; };
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
          if (b.t === 'h') { para(b.x, 11, 'bold', 1, page); }
          else if (b.t === 'li') b.x.forEach(s => para('- ' + s, 10.5, 'normal', 1.2, page));
          else if (b.t === 'stat') { if (b.x.q) para(b.x.q, 10, 'bold', 1, page); table([b.x.v], b.x.c); }
          else if (b.t === 'tbl' || b.t === 'flow') b.x.forEach(r => para(r, 10, 'normal', 0.5, page));
          else if (b.t === 'cap') para(b.x, 10, 'bold', 1, page);
          else if (b.t === 'grid') table(b.rows, b.head || undefined, { columnStyles: { 0: { fontStyle: 'bold' } } });
          else para(b.x, 10.5, 'normal', 3, page);
        });

        // Cover
        doc.setDrawColor(40); doc.setLineWidth(0.4);
        [['Candidate surname', M, 18, 84], ['Other names', M + 88, 18, 86], ['Centre number', M, 34, 84], ['Learner registration number', M + 88, 34, 86]].forEach(([t, x, yy, w]) => { doc.rect(x, yy, w, 12); doc.setFontSize(7); doc.setFont('helvetica', 'normal'); doc.text(t, x + 1.5, yy + 3.5); });
        if (withAnswers) { doc.setFontSize(7); doc.text('Completed online with RA10', M + 1.5, 26); }
        doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.text(doc.splitTextToSize(clean(p.qual || C.qualLine || 'Pearson BTEC Level 3 Nationals Certificate, Extended Certificate, Foundation Diploma, Diploma, Extended Diploma'), CW), M, 62);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.text(clean(p.source === 'pearson' ? (p.date || p.series) : 'RA10 practice paper'), M, 78);
        doc.setFontSize(30); doc.text(clean(C.subject || 'Business'), M, 96);
        doc.setFontSize(14); doc.text(doc.splitTextToSize(clean(unitLine), CW), M, 108);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(12); doc.text(clean(p.kind === 'set' ? C.partsLabel : (C.partLine || 'Sections A and B')), M, 124);
        if (p.notice) { doc.setFontSize(8.5); doc.setTextColor(150, 70, 0); doc.text(doc.splitTextToSize(clean((p.badge ? p.badge + ': ' : '') + p.notice), CW), M, 129); doc.setTextColor(20); }
        doc.rect(M, 132, 56, 18); doc.rect(M + 60, 132, 56, 18); doc.rect(W - M - 54, 132, 54, 18);
        doc.setFontSize(8); doc.text('Paper reference', M + 2, 137); doc.text('Time', M + 62, 137); doc.text('Total marks', W - M - 52, 137);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.text(clean(p.code || C.code), M + 2, 146); doc.text(clean(C.timeLabel), M + 62, 146); doc.text(String(p.total), W - M - 52, 146);
        y = 162;
        (C.instructions || []).forEach(([h, items]) => {
          doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text(h, M, y); y += 6;
          doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
          items.forEach(it => { doc.splitTextToSize('- ' + clean(it.replace('{total}', p.total)), CW).forEach(l => { doc.text(l, M + 2, y); y += 4.6; }); });
          y += 2.5;
        });
        doc.setFontSize(7.5); doc.setTextColor(110);
        doc.text(clean(p.legal || (p.source === 'pearson' ? 'Past paper content (c) Pearson Education Ltd. Reformatted by RA10 for revision practice.' : `RA10 practice paper written in the Pearson Unit ${C.n} format.`)), M, 286);
        doc.setTextColor(20);

        if (p.kind === 'set') {
          if (p.partA && p.partA.length) { newPage('Part A'); heading(C.partALabel || 'Part A', 'Part A'); pdfBlocks(p.partA, 'Part A'); }
          newPage('Part B'); heading('Part B - Set task', 'Part B');
          p.acts.forEach(a => {
            para('Activity ' + a.n, 11.5, 'bold', 1, 'Part B');
            a.text.split('\n').forEach(l => para(l.replace(/^\s*–/, '  -'), 10.5, 'normal', 1.2, 'Part B'));
            para(`(Total for Activity ${a.n} = ${a.marks} marks)`, 9.5, 'bold', 4, 'Part B');
          });
          const info = (p.partB || []).filter(b => !(b.t === 'h' && /^(Set Task|Activity)/i.test(b.x)));
          const rest = []; let skip = true;
          info.forEach(b => { const t = blockText(b); if (skip && (/^You must complete|^You will need|^Using appropriate|^Based on your|^Prepare a|^With reference to|^You are to produce|^Your report|^The (rationale|plan|presentation|report) should|^The report should|^Your rationale|^This (should|must)|^You must produce|^You should present/i.test(t) || b.t === 'li')) return; skip = false; rest.push(b); });
          if (rest.length) { heading('Additional task information', 'Part B'); pdfBlocks(rest, 'Part B'); }
          p.acts.forEach(a => {
            newPage('Taskbook');
            doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
            doc.text(`Activity ${a.n}`, M, y); doc.text(`(${a.marks})`, W - M, y, { align: 'right' }); y += 8;
            const ans = answerText(p, st, String(a.n));
            if (withAnswers && ans.trim()) para(ans, 10.5, 'normal', 4, 'Taskbook'); else ruled(a.marks >= 30 ? 60 : 40, 'Taskbook');
            if (y > BOTTOM) newPage('Taskbook');
            doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text(`(Total for Activity ${a.n} = ${a.marks} marks)`, W - M, y + 2, { align: 'right' }); y += 10;
            if (withAnswers && Number.isFinite(st['S' + a.n])) { doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.text(`RA10 AI Examiner mark: ${st['S' + a.n]}/${a.marks}`, M, y); y += 6; }
          });
        } else {
          let curSec = null;
          newPage('Section A');
          const seen = new Set();
          p.items.forEach(it => {
            if (it.section !== curSec) { if (curSec) newPage('Section ' + it.section); curSec = it.section; const sh = C.sectionTitles ? C.sectionTitles[it.section] : (it.section === 'A' ? 'SECTION A - Personal Finance' : 'SECTION B - Business Finance'); if (sh) heading(sh, 'Section ' + it.section); }
            const ck = ((it.ctx || []).join('|') + JSON.stringify(it.ctxb || []).slice(0, 200)).slice(0, 260);
            if (((it.ctx || []).length || (it.ctxb || []).length) && !seen.has(ck)) { seen.add(ck); pdfBlocks(it.ctxb && it.ctxb.length ? it.ctxb : BizPapers.ctxBlocks(it.ctx || []), 'Section ' + it.section); }
            if (y > BOTTOM - 40 || (isDiagram(it) && y > 40)) newPage('Section ' + it.section);   // a diagram question starts its own page
            doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
            const qLines = doc.splitTextToSize(clean(itemLabel(it) + '  ' + it.text), CW - 14);
            doc.text(qLines, M, y); doc.text(`(${it.marks})`, W - M, y + (qLines.length - 1) * 4.9, { align: 'right' }); y += qLines.length * 4.9 + 3;
            const ans = answerText(p, st, itemKey(it));
            if (isDiagram(it)) {
              // diagram questions: a whole blank page (no lines), or the learner's drawing
              const img = withAnswers && st['I' + itemKey(it)];
              if (BOTTOM - y < 200) newPage('Section ' + it.section);
              if (img) {
                const h = Math.min(BOTTOM - y, CW * 1.3), w = h / 1.3;
                doc.addImage(img, 'JPEG', M + (CW - w) / 2, y, w, h); y += h + 4;
                const notes = String(st['A' + itemKey(it)] || '').trim();
                if (notes) para('Notes: ' + notes, 10, 'normal', 3, 'Section ' + it.section);
              } else {
                doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(140);
                doc.text('Use this space to draw your diagram.', M, y + 2); doc.setTextColor(20);
                y = BOTTOM + 1;
              }
            } else if (withAnswers && ans.trim()) para(ans, 10.5, 'normal', 3, 'Section ' + it.section); else ruled(isCalc(it) ? 5 : Math.min(18, it.marks * 2 + 1), 'Section ' + it.section);
            if (withAnswers) { const v = Number.isFinite(st['S' + itemKey(it)]) ? st['S' + itemKey(it)] : st['M' + itemKey(it)]; if (Number.isFinite(v)) { doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.text(`Mark: ${v}/${it.marks}`, M, y); y += 5; } }
            y += 3;
          });
        }
        doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
        if (y > BOTTOM) newPage('End');
        doc.text(`TOTAL FOR PAPER = ${p.total} MARKS`, W / 2, y + 6, { align: 'center' });

        const pages = doc.getNumberOfPages();
        for (let i = 1; i <= pages; i++) { doc.setPage(i); doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(120); doc.text(`${i} / ${pages}`, W / 2, 292, { align: 'center' }); }
        const fname = `${C.pdfPrefix || 'BTEC-Business'}-Unit${C.n}-${(p.source === 'pearson' ? p.series : 'Practice-' + p.title).replace(/[^A-Za-z0-9]+/g, '-')}${withAnswers ? '-my-answers' : ''}.pdf`;
        doc.save(fname);
      } catch (err) {
        alert('Sorry — the PDF could not be created (' + (err && err.message ? err.message : 'unknown error') + ').');
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = label; }
      }
    }

    return { renderPapers, openPaper };
  }

  /* Turn flattened context lines (scenario text + table rows) from exam papers into readable blocks. */
  function ctxBlocks(lines) {
    const out = [];
    let para = [];
    const flush = () => { if (para.length) { out.push({ t: 'p', x: para.join(' ') }); para = []; } };
    let i = 0;
    const L = (lines || []).map(s => String(s));
    while (i < L.length) {
      const ln = L[i];
      // runs of short lines containing figures read as a table; render them as rows
      let j = i;
      while (j < L.length && L[j].length <= 46 && !/[.?]$/.test(L[j])) j++;
      if (j - i >= 4) { flush(); out.push({ t: 'tbl', x: L.slice(i, j) }); i = j; continue; }
      if (/^[••]/.test(ln)) { flush(); const items = []; while (i < L.length && /^[••]/.test(L[i])) { items.push(L[i].replace(/^[••]\s*/, '')); i++; } out.push({ t: 'li', x: items }); continue; }
      para.push(ln);
      i++;
    }
    flush();
    return out;
  }

  /* Extra mark-scheme rendering: AF grids for set-task questions. Returns a node or null. */
  function afGridNode(q, el) {
    const afs = q && q.mark_scheme && q.mark_scheme.afs;
    if (!afs || !afs.length) return null;
    const wrap = el('div', { class: 'af-grid' });
    wrap.appendChild(el('p', { class: 'instruction' }, el('strong', null, 'Assessment focus grid (best fit within each AF):')));
    afs.forEach(af => {
      const card = el('div', { class: 'af-card' });
      card.appendChild(el('div', { class: 'af-head' }, el('b', null, `${af.id} · ${af.name}`), el('span', null, `${af.max} marks`)));
      if (af.look) card.appendChild(el('p', { class: 'af-look' }, af.look));
      const t = el('table', { class: 'levels af-bands' });
      af.bands.forEach(b => t.appendChild(el('tr', null, el('td', null, 'Band ' + b.band), el('td', null, b.marks), el('td', null, b.descriptor))));
      card.appendChild(t);
      wrap.appendChild(card);
    });
    return wrap;
  }

  window.BizPapers = { buildQuestions, init, ctxBlocks, afGridNode, blockText };
})();
