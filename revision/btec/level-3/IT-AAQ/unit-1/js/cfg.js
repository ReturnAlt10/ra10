/* BTEC Level 3 IT Unit 1 — Information Technology Systems: configuration for the shared paper viewer
   (../../business/shared/biz-papers.js). Exam: 2 hours, 90 marks, four scenario questions.
   2025 AAQ specification = paper 60297T. Papers before it are the old specification (31760H) and are labelled clearly. */
(function () {
  'use strict';
  const RULES = [
    ['F', /legislation|\blaw\b|legal|copyright|data protection|gdpr|computer misuse|freedom of information|moral|ethical|netiquette|acceptable use|environment|sustainab|accessib|digital divide|privacy|equal/i],
    ['D', /threat|virus|malware|hack|phishing|firewall|encrypt|anti-?virus|authenticat|password|biometric|backup|back up|access right|physical security|digital certificate|protocol.*secur|secur.*protocol|data loss|protect/i],
    ['C', /cloud|online system|online communit|social media|collaborat|e-?commerce|online (booking|sales|retail|shopping)|website|web server|blog|wiki|forum|remote working|video conferenc|online-only/i],
    ['B', /network|lan\b|wan\b|pan\b|vpn|topology|wireless|wired|bluetooth|wi-?fi|bandwidth|latency|transmi|connect|protocol|smtp|imap|tcp|ip address|router|switch/i],
    ['E', /targeted (online )?marketing|online services|data (logging|analysis|manipulat)|spreadsheet|database|e-?ticket|contactless|gps|impact of (updating|upgrading)|organisation|employees/i],
    ['A', /device|hardware|software|operating system|utility|application|interface|file (type|format)|storage|server|peripheral|input|output|assistive|emerging technolog|\bai\b|flowchart|diagram|choose|choice/i]
  ];
  const TOPICS = [
    [/flowchart/i, 'Flowcharts'], [/network diagram|draw a diagram|draw a network/i, 'Network diagrams'], [/cloud/i, 'Cloud computing'],
    [/firewall|anti-?virus|encrypt|authenticat|password|biometric|vpn|digital certificate|protect/i, 'Protecting data'], [/threat|virus|malware|hack|phishing|data loss|lost/i, 'Threats to data'],
    [/legislation|law|legal|data protection|copyright/i, 'Legal issues'], [/moral|ethical|privacy|acceptable use|netiquette|environment/i, 'Moral and ethical issues'],
    [/lan\b|wan\b|pan\b|network|topology|wired|wireless|connect/i, 'Networks and connectivity'], [/protocol|smtp|imap|transmi/i, 'Transmitting data'],
    [/online|website|e-?commerce|booking|social media|collaborat/i, 'Online systems'], [/utility|application software|operating system|interface|open-?source|file format/i, 'Software'],
    [/input|output|storage|device|peripheral|assistive/i, 'Devices and peripherals'], [/emerging|\bai\b/i, 'Emerging technologies']
  ];
  window.BIZ_UNIT = {
    n: 1, key: 'it_u1', code: '60297T', name: 'Information Technology Systems', kind: 'exam', total: 90, minutes: 120,
    timeLabel: '2 hours', aims: ['A', 'B', 'C', 'D', 'E', 'F'],
    subject: 'Information Technology', pdfPrefix: 'BTEC-IT',
    qualLine: 'Pearson BTEC Level 3 National in Information Technology',
    partLine: 'Answer all four questions',
    sectionTitles: {},
    specGroups: {
      new: { t: 'Current specification · 2025 AAQ (60297T)', d: 'The papers that match your exam exactly.' },
      old: { t: 'Old specification · 31760H (2019–2025)', d: 'Still relevant: most content is the same, but these were written for the old spec.' }
    },
    runLabel: (it) => 'Question ' + it.q,
    cardMeta: (p) => {
      const by = {};
      p.items.forEach(it => { by[it.q] = (by[it.q] || 0) + it.marks; });
      return Object.keys(by).map(q => `Q${q}: ${by[q]}`).join(' · ') + ` · ${p.items.length} parts`;
    },
    instructions: [
      ['Instructions', ['Use black ink or ball-point pen.', 'Answer all questions.', 'Answer the questions in the spaces provided – there may be more space than you need.']],
      ['Information', ['The total mark for this paper is {total}.', 'The marks for each question are shown in brackets – use this as a guide as to how much time to spend on each question.', 'Diagram questions: in “Answer online” mode describe your diagram (devices, connection types, annotations) so it can be marked.']],
      ['Advice', ['Read each question carefully before you start to answer it.', 'Relate every answer to the scenario – generic answers rarely reach the top level.', 'Try to answer every question and check your answers if you have time at the end.']]
    ],
    howto: ['Pick a paper. The 2025 AAQ specification (60297T) papers are marked in green; older papers (31760H) are marked in amber. They are still good practice because most of the content is the same.',
      'Switch to “Answer online”. Write full answers and use the diagram description box for “Draw” questions. Then reveal the mark scheme, self-mark, or use the AI Examiner.',
      'Exam layout: 2 hours, 90 marks, four scenario-based questions. Each one builds up from short “give/explain” parts to a 6–12 mark discuss/evaluate question.'],
    paperNote: 'Old specification (31760H) papers: some topics are no longer assessed in the same way and a few new 2025 topics (e.g. emerging technologies and AI) are missing, so use them for exam technique and core content. Long questions on old papers use 8, 10 and 12 marks; the new specification uses 6, 9 and 12.',
    legal: 'Past paper text © Pearson Education Ltd, reformatted by RA10 for revision. Diagrams from the original papers are described in text. Always check against the official paper where it matters.',
    classify: function (text, section, q, p, own) {
      // the question's own wording first, then the scenario it sits in
      for (const t of [own, text]) if (t) for (const [aim, re] of RULES) if (re.test(t)) return aim;
      return 'A';
    },
    topicFor: function (text) {
      for (const [re, name] of TOPICS) if (re.test(String(text))) return name;
      return 'Information technology systems';
    }
  };
})();
