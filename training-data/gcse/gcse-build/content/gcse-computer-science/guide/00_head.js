/* OCR GCSE (9–1) Computer Science (J277) — RA10 revision guide. One part per chapter (1.1 … 2.5); parts register into
   T / TITLE / SUB below. Every topic starts from the basics, then builds to exam level. WG('name') drops in an
   interactive diagram (98_widgets.js). Code is shown in OCR Exam Reference Language (ERL) and Python side by side. */
(function () {
  'use strict';
  const { svg: S, h: H } = window.BizGuide;
  const { key, tip, warn, fig, table, ul, ol, example, stats, check, two, steps, cards, code } = H;
  const P = { blue: '#2563eb', sky: '#0284c7', teal: '#0d9488', green: '#16a34a', amber: '#d97706', orange: '#ea580c', red: '#dc2626', pink: '#db2777', violet: '#7c3aed', slate: '#64748b', navy: '#1e3a8a' };
  const T = {}, TITLE = {}, SUB = {};
  const p = (...xs) => xs.map(x => `<p>${x}</p>`).join('');
  const h3 = (t) => `<h3>${t}</h3>`;
  const h4 = (t) => `<h4>${t}</h4>`;
  // interactive diagram placeholder (mounted by 98_widgets.js)
  const WG = (name, o) => `<div class="csw" data-w="${name}"${o ? ` data-o='${JSON.stringify(o).replace(/'/g, '&#39;')}'` : ''}><p class="csw-note">Loading interactive diagram…</p></div>`;
  // OCR Exam Reference Language and Python side by side
  const erl = (ocr, py, cap) => two(`<h4>OCR Exam Reference Language</h4>${code(ocr)}`, `<h4>Python</h4>${code(py)}`) + (cap ? `<p class="csw-note" style="margin-top:-4px">${cap}</p>` : '');
  // "In plain English" starter box
  const plain = (body) => `<div class="g-callout g-tip"><strong>In plain English</strong><div>${body}</div></div>`;
  // worked exam question with a model answer
  const exam = (q, marks, ans, note) => example(`Exam question (${marks} mark${marks > 1 ? 's' : ''})`, `<p><b>${q}</b></p><p><i>Model answer:</i> ${ans}</p>${note ? `<p class="csw-note">${note}</p>` : ''}`);
  const terms = (rows) => table(['Key term', 'What it means'], rows.map(r => [`<b>${r[0]}</b>`, r[1]]));
  const pyLab = (task, label) => `<p><a class="g-pill" style="--c:#0f766e;text-decoration:none" href="/tools/python-lab/?course=gcse${task ? '&task=' + task : ''}" target="_top">▶ ${label || 'Practise this in the GCSE Python Lab'}</a></p>`;

  const setTask = () => `
${stats([['2', 'exam papers'], ['1 h 30', 'each paper'], ['80', 'marks per paper'], ['50%', 'of the GCSE each'], ['No', 'calculators allowed']])}
${p('OCR GCSE Computer Science (J277) is assessed by <b>two written exams</b>, both taken at the end of Year 11. There is no coursework mark, but you must have had the chance to do a practical programming project in lessons. The two papers test <b>different content</b> — so revise them differently.')}
${table(['', 'Paper 1 · Computer systems (J277/01)', 'Paper 2 · Computational thinking, algorithms and programming (J277/02)'], [
  ['Content', 'Chapters <b>1.1–1.6</b>: systems architecture, memory and storage, networks, network security, systems software, ethical/legal/cultural/environmental impacts', 'Chapters <b>2.1–2.5</b>: algorithms, programming fundamentals, robust programs, Boolean logic, languages and IDEs'],
  ['Time and marks', '1 hour 30 minutes · 80 marks', '1 hour 30 minutes · 80 marks'],
  ['Structure', 'All questions compulsory; short answers, tables to complete, calculations, and <b>one 8-mark extended response</b> (marked *) on the impact of technology', '<b>Section A</b> (50 marks, ~50 min): algorithms, data, logic, testing, languages. <b>Section B</b> (30 marks, ~40 min): one long scenario where you <b>read, trace, write and refine code</b>'],
  ['Code', 'Very little', 'Lots: in OCR Exam Reference Language <b>or</b> a high-level language you know (eg Python). Some questions say which; Section B questions are clearly marked'],
  ['What wins marks', 'Precise definitions, applying knowledge to the scenario, accurate conversions and file-size calculations', 'Accurate tracing, working algorithms, correct use of programming constructs (not English descriptions!)']])}
${fig(S.ladder([['State / Identify / Give / Name — 1 mark each', 'A word, phrase or value. No explanation needed.'], ['Describe — 2+ marks', 'Say what it is / what happens, with detail. One mark per valid point.'], ['Explain — 2+ marks', 'Point + reason: “… because …” / “… so that …”. Linked points earn the second mark.'], ['Compare / Justify', 'Similarities and differences, or reasons for a choice, linked to the scenario.'], ['Discuss* — 8 marks (Paper 1)', 'Both sides, several areas (eg ethical, legal, environmental), applied to the context, with a conclusion.']], { w: 700, rowH: 50, label: 'Command words, from easiest to hardest' }), 'Look at the command word and the number of marks — they tell you how much to write.')}
${h3('Paper 2, Section B: writing code')}
${p('Some Section B questions require you to respond using <b>OCR Exam Reference Language or a high-level programming language</b>. Examiners mark the <b>logic and the constructs</b> (input, loops, selection, arrays…), not perfect syntax — but an answer written in English sentences, bullet points or vague pseudocode <b>gets no marks</b> on these questions. This guide shows every construct in both OCR Exam Reference Language and Python, and the Python Lab lets you practise writing real code.')}
${pyLab('', 'Open the GCSE Python Lab — auto-marked programming practice for Paper 2')}
${h3('How this guide works')}
${check(['Every topic starts with a plain-English explanation, then builds to exam level — read the topics in order if a chapter is new to you.', 'Interactive diagrams (marked <b>Try it</b>) let you click, step through and change things — use them until you can predict what will happen.', 'Each topic ends with a worked exam question and a model answer in the style the OCR mark scheme rewards.', 'Questions from real OCR papers are in <b>Practise by topic</b>, filtered to the same chapter — practise straight after reading.'])}
${warn('Do not mix up the papers: <b>binary, hex, file sizes and storage are Paper 1</b> (1.2), but <b>logic gates and truth tables are Paper 2</b> (2.4). Searching and sorting algorithms are Paper 2 (2.1).', 'Which paper is it on?')}`;
