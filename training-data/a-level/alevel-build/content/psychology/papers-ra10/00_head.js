/* RA10 practice papers for AQA A-level Psychology (7182), updated specification (first exams June 2027).
   Written by RA10 in the exact AQA layout: Paper 1 (4 × 24), Paper 2 (24 + 24 + 48), Paper 3 (24 compulsory + one option
   from each of Sections B, C and D, 24 each). Question numbers run on through the options as on real AQA Paper 3s.
   Mark schemes follow AQA’s format: AO split, points or levels, possible content / application / discussion. */
(function () {
  'use strict';
  window.BIZ_PAPERS = window.BIZ_PAPERS || [];
  const AIMN = { A: 'Social influence', B: 'Memory', C: 'Attachment', D: 'Clinical Psychology and Mental Health', E: 'Approaches in Psychology', F: 'Biopsychology', G: 'Research methods', H: 'Issues and debates in Psychology', I: 'Relationships', J: 'Gender', K: 'Cognition and development', L: 'Schizophrenia', M: 'Eating behaviour', N: 'Stress', O: 'Aggression', P: 'Forensic Psychology', Q: 'Addiction' };
  const OPT = { I: 'B', J: 'B', K: 'B', L: 'C', M: 'C', N: 'C', O: 'D', P: 'D', Q: 'D' };
  const TITLES = { 1: 'Paper 1: Introductory topics in psychology', 2: 'Paper 2: Psychology in context', 3: 'Paper 3: Issues and options in psychology' };
  const levels = (m) => ((window.BIZ_LEVELS || {})[m] || null);
  const pad = (n) => (n < 10 ? '0' : '') + n;
  let cur = null;
  const made = [];

  function paper(set, n, setLabel) {
    cur = {
      id: 'ra10-psy-' + set.toLowerCase() + '-p' + n, paper: n, key: 'R' + set + n, series: 'RA10 ' + setLabel,
      date: 'RA10 ' + setLabel + ' · Paper ' + n, title: TITLES[n], source: 'ra10', kind: 'exam', code: '7182/' + n,
      spec: 'ra10', total: 96, minutes: 120, badge: 'RA10 · Updated specification', badgeTone: 'new',
      notice: 'Written by RA10 for the updated specification (first A-level exams June 2027) in the exact AQA layout. Not an AQA paper.',
      items: []
    };
    window.BIZ_PAPERS.push(cur); made.push(cur);
  }
  const p = (x) => ({ t: 'p', x });
  const grid = (head, rows) => ({ t: 'grid', head, rows });
  // Q(n, marks, section, aim, text, ms, o)  o: { sub, ctx:[blocks], mcq:true, lv:true }
  function Q(n, marks, section, aim, text, ms, o) {
    o = o || {};
    // levels-marked items: the level descriptors are shown from ms.levels, so drop any typed level lines from the body
    if (o.lv) ms = ms.split('\n').filter(l => !/^Level \d|^0: No relevant/.test(l)).join('\n');
    const it = {
      q: n, sub: o.sub ? String(o.sub) : null, label: pad(n) + (o.sub ? '.' + o.sub : ''), marks, section, aim, topic: AIMN[aim],
      ctx: [], ctxb: o.ctx || [], text, kind: o.mcq ? 'mcq' : (o.lv && marks >= 6) || marks >= 8 ? 'extended' : 'short',
      ms: { body: ms, levels: o.lv ? levels(marks) : null }
    };
    if (OPT[aim] && section !== 'A') it.opt = { group: OPT[aim], name: AIMN[aim] };
    cur.items.push(it);
  }
  const AOs = (s) => 'Marks for this question: ' + s + '\n';
  const MCQ = (stem, opts, ans) => stem + '\nShade one box only.\n' + opts.map((t, i) => 'ABCD'[i] + '  ' + t).join('\n');
