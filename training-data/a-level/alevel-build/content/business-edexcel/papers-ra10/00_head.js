/* RA10 practice papers for Pearson Edexcel A-level Business (9BS0), in the exact Edexcel layout:
   Papers 1 and 2 — Section A (Q1, extracts) and Section B (Q2, extracts): (a) 4, (b) 4, (c) 10, (d) 12, (e) 20 = 50 each.
   Paper 3 — context + Section A and B: (a) 8, (b) 10, (c) 12, (d) 20 = 50 each.
   All businesses and data are fictional (written by RA10), so every figure in the extracts is internally consistent.
   Mark schemes follow Edexcel’s format: skills split, points / indicative content with counterbalance and judgement, levels. */
(function () {
  'use strict';
  window.BIZ_PAPERS = window.BIZ_PAPERS || [];
  const AIMN = { A: 'Meeting customer needs', B: 'Market', C: 'Marketing mix and strategy', D: 'Managing people', E: 'Entrepreneurs and leaders', F: 'Raising finance', G: 'Financial planning', H: 'Managing finance', I: 'Resource management', J: 'External influences', K: 'Business objectives and strategy', L: 'Business growth', M: 'Decision-making techniques', N: 'Influences on business decisions', O: 'Assessing competitiveness', P: 'Managing change', Q: 'Globalisation', R: 'Global markets and business expansion', S: 'Global marketing', T: 'Global industries and companies (MNCs)' };
  const TITLES = { 1: 'Paper 1: Marketing, people and global businesses', 2: 'Paper 2: Business activities, decisions and strategy', 3: 'Paper 3: Investigating business in a competitive environment' };
  const SKILLS = { 4: 'Knowledge 1, Application 2, Analysis 1', 8: 'Knowledge 2, Application 2, Analysis 2, Evaluation 2', 10: 'Knowledge 2, Application 2, Analysis 3, Evaluation 3', 12: 'Knowledge 2, Application 2, Analysis 4, Evaluation 4', 20: 'Knowledge 4, Application 4, Analysis 6, Evaluation 6' };
  const lv = (m) => { const L = (window.BIZ_LEVELS || {})[m] || (window.BIZ_LEVELS || {})[String(m)]; return L ? L.slice().sort((a, b) => a.level - b.level) : null; };
  let cur = null, ctx = { 1: [], 2: [] }, context = null;
  const made = [];
  function paper(set, n, label) {
    cur = { id: 'ra10-edx-' + set.toLowerCase() + '-p' + n, paper: n, key: 'R' + set + n, series: 'RA10 ' + label, date: 'RA10 ' + label + ' · Paper ' + n, title: TITLES[n],
      source: 'ra10', kind: 'exam', code: '9BS0/0' + n, spec: 'ra10', total: 100, minutes: 120, badge: 'RA10 practice', badgeTone: 'new',
      notice: 'Written by RA10 in the exact Edexcel layout. The businesses and data in the extracts are fictional. Not a Pearson paper.', items: [] };
    window.BIZ_PAPERS.push(cur); made.push(cur); ctx = { 1: [], 2: [] }; context = null;
  }
  const pp = (x) => ({ t: 'p', x });
  const hd = (x) => ({ t: 'h', x });
  const grid = (head, rows) => ({ t: 'grid', head, rows });
  const src = (x) => ({ t: 'cap', x: '(Source: ' + x + ')' });
  // extracts for question 1 or 2
  function extracts(q, blocks) { ctx[q] = blocks; }
  function setContext(x) { context = x; }
  // Q(q, sub, marks, aim, text, ms, opt)  opt: { kind: 'calc' | 'pts' }  — 8+ marks are levels-marked
  function Q(q, sub, marks, aim, text, ms, o) {
    o = o || {};
    const levels = marks >= 6 ? lv(marks) : null;
    cur.items.push({ q, sub, label: q + '(' + sub + ')', marks, section: q === 1 ? 'A' : 'B', aim, topic: AIMN[aim], ctx: [],
      ctxb: (context ? [pp(context)] : []).concat(ctx[q]).concat((o.stem || []).map(pp)), text, kind: marks >= 8 ? 'extended' : 'short',
      ms: { body: 'Marks for this question: ' + (o.skills || SKILLS[marks]) + '\n' + ms, levels } });
  }
