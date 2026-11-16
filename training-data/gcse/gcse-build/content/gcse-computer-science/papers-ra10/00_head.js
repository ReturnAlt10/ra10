/* RA10 practice papers for OCR GCSE (9–1) Computer Science (J277), written by RA10 in the exact OCR layout:
   Paper 1 Computer systems (80 marks, 1 h 30, one 8-mark extended response marked *) and Paper 2 Computational
   thinking, algorithms and programming (80 marks, 1 h 30: Section A 50, Section B 30). Organisations are fictional.
   Mark schemes follow OCR's format: 1 mark per point, "…" = linked expansion, // = alternative answers. */
(function () {
  'use strict';
  window.BIZ_PAPERS = window.BIZ_PAPERS || [];
  const AIMN = { A: '1.1 Systems architecture', B: '1.2 Memory and storage', C: '1.3 Computer networks, connections and protocols', D: '1.4 Network security', E: '1.5 Systems software', F: '1.6 Ethical, legal, cultural and environmental impacts', G: '2.1 Algorithms', H: '2.2 Programming fundamentals', I: '2.3 Producing robust programs', J: '2.4 Boolean logic', K: '2.5 Programming languages and IDEs' };
  const TITLES = { 1: 'Paper 1: Computer systems', 2: 'Paper 2: Computational thinking, algorithms and programming' };
  let cur = null;
  const made = [];
  function paper(set, n, setLabel) {
    cur = {
      id: 'ra10-cs-' + set.toLowerCase() + '-p' + n, paper: n, key: 'R' + set + n, series: 'RA10 ' + setLabel,
      date: 'RA10 ' + setLabel + ' · Paper ' + n, title: TITLES[n], source: 'ra10', kind: 'exam', code: 'J277/0' + n,
      spec: 'ra10', total: 80, minutes: 90, badge: 'RA10 practice paper', badgeTone: 'new',
      notice: 'Written by RA10 in the exact OCR J277 layout. Organisations are fictional. Not an OCR paper.',
      items: []
    };
    window.BIZ_PAPERS.push(cur); made.push(cur);
  }
  const p = (x) => ({ t: 'p', x });
  const code = (lines) => ({ t: 'code', x: lines });
  const grid = (head, rows) => ({ t: 'grid', head, rows });
  // Q('3', 'b', marks, aim, text, ms, { sec, ctx: [blocks], qer: true })
  function Q(n, sub, marks, aim, text, ms, o) {
    o = o || {};
    const subs = sub ? sub.split('.') : [];
    cur.items.push({
      q: Number(n), sub: subs.join(''), label: n + subs.map(s => '(' + s + ')').join(''), marks, section: o.sec || 'A', aim, topic: AIMN[aim],
      ctx: [], ctxb: o.ctx || [], text, kind: o.qer ? 'qer' : (cur.paper === 2 && o.sec === 'B' ? 'code' : 'short'),
      ms: { body: ms, pts: !o.qer, levels: o.qer ? ((window.BIZ_LEVELS || {})[8] || null) : null }
    });
  }
