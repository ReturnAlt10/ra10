#!/usr/bin/env node
/*
 * RA10 IT AAQ — Revision booklet builder.
 *
 * Reads each unit's existing data (spec.js is inlined/parsed here, aim questions,
 * flashcards, mcq, quiz, diagrams, knowledge-bank) and generates a
 * per-aim booklet bundle consumed by the reader.
 *
 * Output: revision/btec/level-3/IT-AAQ/booklets/data/<unit>-<aim>.json
 *         revision/btec/level-3/IT-AAQ/booklets/data/index.json   (unit/aim catalogue)
 *
 * Usage: node js/build-booklets.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');          // booklets/
const AAQ = path.resolve(ROOT, '..');                 // IT-AAQ/
const OUT = path.join(ROOT, 'data');

// ---------------------------------------------------------------------------
// Load spec definitions from each unit's spec.js (parse via regex, no eval).
// ---------------------------------------------------------------------------
function loadSpec(unit) {
  const specPath = path.join(AAQ, `unit-${unit}`, 'js', 'spec.js');
  if (!fs.existsSync(specPath)) return null;
  const src = fs.readFileSync(specPath, 'utf8');

  // Units 1 & 2 declare `const SPEC = {...};` with topics arrays of {code,name}.
  // Units 3 & 4 also declare the same `const SPEC` shape.
  const aims = {};
  // Find the `const SPEC = {` block up to the matching `};`.
  const m = src.match(/const\s+SPEC\s*=\s*\{/);
  if (!m) return null;
  const start = m.index + m[0].length;
  // Brace match.
  let depth = 1; let i = start; let inStr = false; let strCh = '';
  for (; i < src.length && depth > 0; i++) {
    const ch = src[i];
    if (inStr) {
      if (ch === '\\') { i++; continue; }
      if (ch === strCh) inStr = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = true; strCh = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
  }
  const block = src.slice(start, i - 1);

  // Parse each aim letter block: `A: { title:"...", short:"...", topics:[{code:"A1", name:"..."},...] },`
  const aimRe = /([A-F])\s*:\s*\{/g;
  let am;
  while ((am = aimRe.exec(block))) {
    const letter = am[1];
    const aimStart = am.index + am[0].length;
    // brace match within block
    let d2 = 1; let j = aimStart; let ins2 = false; let sc2 = '';
    for (; j < block.length && d2 > 0; j++) {
      const ch = block[j];
      if (ins2) { if (ch === '\\') { j++; continue; } if (ch === sc2) ins2 = false; continue; }
      if (ch === '"' || ch === "'" || ch === '`') { ins2 = true; sc2 = ch; continue; }
      if (ch === '{') d2++; else if (ch === '}') d2--;
    }
    const aimBlock = block.slice(aimStart, j - 1);

    const title = (aimBlock.match(/title\s*:\s*["'`]([^"'`]*)["'`]/) || [, ''])[1];
    const short = (aimBlock.match(/short\s*:\s*["'`]([^"'`]*)["'`]/) || [, ''])[1];
    const tasks = (aimBlock.match(/tasks\s*:\s*["'`]([^"'`]*)["'`]/) || [, ''])[1];

    // topics array: find the `topics` array block.
    const topics = [];
    const tp = aimBlock.match(/topics\s*:\s*\[/);
    if (tp) {
      const tpStart = tp.index + tp[0].length;
      let d3 = 1; let k = tpStart; let ins3 = false; let sc3 = '';
      for (; k < aimBlock.length && d3 > 0; k++) {
        const ch = aimBlock[k];
        if (ins3) { if (ch === '\\') { k++; continue; } if (ch === sc3) ins3 = false; continue; }
        if (ch === '"' || ch === "'" || ch === '`') { ins3 = true; sc3 = ch; continue; }
        if (ch === '[') d3++; else if (ch === ']') d3--;
      }
      const topicsBlock = aimBlock.slice(tpStart, k - 1);
      const topicRe = /\{[^}]*\}/g;
      let tm;
      while ((tm = topicRe.exec(topicsBlock))) {
        const obj = tm[0];
        const code = (obj.match(/code\s*:\s*["'`]([^"'`]*)["'`]/) || [, ''])[1];
        const name = (obj.match(/name\s*:\s*["'`]([^"'`]*)["'`]/) || [, ''])[1];
        if (code && name) topics.push({ code, name });
      }
    }

    aims[letter] = { letter, title, short, tasks: tasks || '', topics };
  }

  return aims;
}

// ---------------------------------------------------------------------------
// Data loaders
// ---------------------------------------------------------------------------
function readJson(unit, file) {
  const p = path.join(AAQ, `unit-${unit}`, 'data', file);
  if (!fs.existsSync(p)) return null;
  try {
    let txt = fs.readFileSync(p, 'utf8');
    if (txt.charCodeAt(0) === 0xFEFF) txt = txt.slice(1); // strip BOM
    return JSON.parse(txt);
  } catch { return null; }
}

function readFullSpec(name, unit) {
  // full spec bullet text (used in checklist) — load from spec_unit1_aims.txt for unit 1; others from spec.js
  return '';
}

// ---------------------------------------------------------------------------
// A catalogue describing the data schema per unit, so the builder is generic.
// ---------------------------------------------------------------------------
const CATALOGUE = [
  {
    unit: 1,
    name: 'IT AAQ Unit 1',
    title: 'Information Technology Systems',
    aims: ['A', 'B', 'C', 'D', 'E', 'F'],
    board: 'Pearson BTEC Level 3 National Extended Certificate in IT (AAQ)',
    specIssue: 'Issue 5, November 2025',
    assessment: 'Externally assessed written exam (set + marked by Pearson).',
    // data schema
    examQuestions: ['aim_A.json','aim_B.json','aim_C.json','aim_D.json','aim_E.json','aim_F.json'],
    mcqFile: 'mc.json',
    quizFile: 'quiz.json',
    flashcardsFile: 'flashcards.json',
    diagramsFile: 'diagrams.json',
    knowledgeBank: null,
  },
  {
    unit: 2,
    name: 'IT AAQ Unit 2',
    title: 'Cyber Security & Incident Management',
    aims: ['A', 'B', 'C', 'D'],
    board: 'Pearson BTEC Level 3 National Extended Certificate in IT (AAQ)',
    specIssue: 'Issue 5, November 2025',
    assessment: 'Externally assessed written exam (set + marked by Pearson).',
    examQuestions: ['aim_A.json','aim_B.json','aim_C.json','aim_D.json'],
    mcqFile: 'mc.json',
    quizFile: 'quiz.json',
    flashcardsFile: 'flashcards.json',
    diagramsFile: 'diagrams.json',
    knowledgeBank: null,
  },
  {
    unit: 3,
    name: 'IT AAQ Unit 3',
    title: 'Website Development',
    aims: ['A', 'B', 'C'],
    board: 'Pearson BTEC Level 3 National Extended Certificate in IT (AAQ)',
    specIssue: 'Issue 2, March 2025',
    assessment: 'Internally assessed Pearson Set Assignment (coursework).',
    examQuestions: [],
    mcqFile: 'mc.json',
    quizFile: 'quiz.json',
    flashcardsFile: 'flashcards.json',
    diagramsFile: null,
    knowledgeBank: 'knowledge-bank.json',
    criteriaFile: 'criteria.json',
    briefsFile: 'sample-briefs.json',
  },
  {
    unit: 4,
    name: 'IT AAQ Unit 4',
    title: 'Relational Database Development',
    aims: ['A', 'B', 'C'],
    board: 'Pearson BTEC Level 3 National Extended Certificate in IT (AAQ)',
    specIssue: 'Issue 5, November 2025',
    assessment: 'Internally assessed Pearson Set Assignment (coursework).',
    examQuestions: [],
    mcqFile: 'mc.json',
    quizFile: 'quiz.json',
    flashcardsFile: 'flashcards.json',
    diagramsFile: null,
    knowledgeBank: 'knowledge-bank.json',
    criteriaFile: 'criteria.json',
    briefsFile: 'sample-briefs.json',
  },
];

function unitName(unit) {
  const c = CATALOGUE.find(x => x.unit === unit);
  return c ? c.title : `Unit ${unit}`;
}

// Aim matching: the field can be "A", "A1", "A1.2", "A1 Internal threats",
// etc. We just need the leading letter to match the aim.
function aimLetterOf(q) {
  const raw = String((q.learning_aim || q.aim || '') ).trim().toUpperCase();
  if (!raw) return '';
  return raw.charAt(0);
}

// Extract the questions for a given aim from a loaded question array.
function questionsForAim(qs, aim) {
  if (!Array.isArray(qs)) return [];
  return qs.filter(q => aimLetterOf(q) === aim);
}

function flashcardsForAim(fc, aim) {
  if (!Array.isArray(fc)) return [];
  return fc.filter(f => {
    const la = aimLetterOf(f);
    return la ? la === aim : true;
  });
}

function mcqForAim(mcq, aim) {
  if (!Array.isArray(mcq)) return [];
  return mcq.filter(q => aimLetterOf(q) === aim);
}

function diagramsForAim(dg, aim) {
  if (!Array.isArray(dg)) return [];
  return dg.filter(q => aimLetterOf(q) === aim);
}

// ---------------------------------------------------------------------------
// Build one aim booklet bundle.
// ---------------------------------------------------------------------------
function buildAimBooklet(unit, aim, spec) {
  const c = CATALOGUE.find(x => x.unit === unit);
  const aimSpec = spec[aim] || { letter: aim, title: `Aim ${aim}`, short: '', topics: [] };

  // Gather data.
  let examQs = [];
  (c.examQuestions || []).forEach(f => {
    const arr = readJson(unit, f);
    if (arr) examQs = examQs.concat(questionsForAim(arr, aim));
  });
  const mcq = mcqForAim(readJson(unit, c.mcqFile), aim);
  const quiz = (() => {
    const q = readJson(unit, c.quizFile);
    if (!Array.isArray(q)) return [];
    return q.filter(x => aimLetterOf(x) === aim);
  })();
  const flashcards = flashcardsForAim(readJson(unit, c.flashcardsFile), aim);
  const diagrams = c.diagramsFile ? diagramsForAim(readJson(unit, c.diagramsFile), aim) : [];
  const knowledgeBank = c.knowledgeBank ? (readJson(unit, c.knowledgeBank)?.aims?.[aim] || null) : null;
  const criteria = c.criteriaFile ? readJson(unit, c.criteriaFile) : null;
  const briefs = c.briefsFile ? readJson(unit, c.briefsFile) : null;

  return {
    unit,
    unitTitle: c.title,
    unitName: c.name,
    aim,
    aimTitle: aimSpec.title,
    aimShort: aimSpec.short,
    board: c.board,
    specIssue: c.specIssue,
    assessment: c.assessment,
    topics: aimSpec.topics,
    checklist: buildChecklist(unit, aim, aimSpec, knowledgeBank),
    examQuestions: examQs,
    mcq,
    quiz,
    flashcards,
    diagrams,
    knowledgeBank,
    criteria: criteria ? (criteria.tasks || criteria).filter(t => t.aim === aim) : [],
    briefs: briefs ? briefs.briefs : [],
    notes: notesFor(unit, aim),
    designs: designsFor(unit, aim),
    scenario: SCENARIO[unit] || null,
    taskGuide: TASK_GUIDE[unit] || null,
  };
}

// Build a rich, bullet-level checklist.
// Units 1/2: spec.js topics already carry every bullet (code like A1.1).
// Units 3/4: spec topics are just headers — use knowledge-bank keyPoints.
function buildChecklist(unit, aim, aimSpec, knowledgeBank) {
  const c = CATALOGUE.find(x => x.unit === unit);
  const useKnowledge = !!knowledgeBank && Array.isArray(knowledgeBank.topics);
  const out = [];

  if (useKnowledge) {
    knowledgeBank.topics.forEach(topic => {
      out.push({ code: topic.code, name: topic.name, type: 'group' });
      (topic.keyPoints || []).forEach(kp => {
        out.push({ code: '', name: kp, type: 'item' });
      });
    });
    return out;
  }

  // spec topics (units 1/2) — each is either a group (A1) or an item (A1.2).
  (aimSpec.topics || []).forEach(t => {
    const code = t.code || '';
    const isGroup = /^[A-Z]\d+$/.test(code);
    out.push({ code, name: t.name, type: isGroup ? 'group' : 'item' });
  });
  return out;
}

// ---------------------------------------------------------------------------
// Authored revision-guide notes (cloze "fill the gap" for difficult concepts).
// Each passage is plain text with [[answer]] markers the reader turns into
// blanks (worksheet) or inline answers (solutions).
// ---------------------------------------------------------------------------
const NOTES = {
  '1-A': [
    { title: 'Embedded systems & device selection', passages: [
      'A(n) [[embedded system]] is a dedicated computer built into a device to control a [[specific function]]. It has fixed hardware and software, so it cannot be [[reprogrammed by the user]]. Examples include a washing-machine controller, a pacemaker and a car [[engine management unit]].',
      'A [[file server]] provides large centralised storage for a network, while a [[web server]] responds to HTTP/HTTPS requests and hosts web pages, and an [[application server]] runs the business logic behind a service.',
      'To choose a device for a scenario, always link a [[feature]] to a [[need]]. For example, a tablet suits field work because its [[touchscreen]] allows interaction without a keyboard.',
      'Flowchart notation: an [[oval]] shows start/end, a [[rectangle]] is a process step, a [[diamond]] is a decision, and a [[parallelogram]] is input/output.'
    ]},
    { title: 'Flowcharts vs system diagrams', passages: [
      'A [[flowchart]] shows the [[steps / process]] of a task, using standard symbols linked by [[arrows]].',
      'A [[system diagram]] shows how the [[components]] of an IT system [[interact]] — different to a flowchart, which shows a [[process]].',
      'Storage media are compared on [[capacity]], [[cost]], [[speed]] and [[compatibility]].'
    ]},
  ],
  '1-B': [
    { title: 'Compression, codecs & protocols', passages: [
      '[[Lossless]] compression removes redundancy so the original file can be perfectly [[reconstructed]] (e.g. [[PNG]], [[ZIP]]). [[Lossy]] compression permanently removes detail that humans are unlikely to notice, giving much [[smaller files]] (e.g. [[JPEG]], [[MP3]]).',
      'A [[codec]] is software or hardware that [[codes and decodes]] media files. Without the right codec a media file will not [[play]].',
      'The protocol [[SMTP]] is used to [[send]] email, whereas [[POP]]/[[IMAP]] are used to [[receive]] it. Web pages travel over [[HTTP]] or its encrypted form [[HTTPS]].',
      '[[Bandwidth]] is the amount of data that can be carried in a given time, while [[latency]] is the [[delay]] between sending and receiving.',
      'Connection types: [[Bluetooth]] and [[USB]] for short range/wired, [[Wi-Fi]] for wireless LAN, and [[Ethernet]] for wired LAN.'
    ]},
  ],
  '1-C': [
    { title: 'Cloud service models', passages: [
      '[[IaaS]] gives you raw infrastructure — servers, storage and networking — that you manage yourself. [[PaaS]] adds a managed platform for building and deploying apps. [[SaaS]] delivers ready-to-use software over the internet, so the user only manages their [[data and login]].',
      'A [[VPN]] creates an encrypted "tunnel" over the public internet so remote workers can [[securely]] access the office network as if they were on-site.'
    ]},
  ],
  '1-D': [
    { title: 'Encryption & protection', passages: [
      '[[Symmetric]] encryption uses the [[same key]] to encrypt and decrypt (fast, e.g. [[AES]]). [[Asymmetric]] encryption uses a [[public/private key pair]] (slower, e.g. [[RSA]]) and is used to share symmetric keys securely.',
      '[[Encryption]] protects data in [[storage]] (at rest) and in [[transit]]. It does not stop data being stolen — it makes it [[unreadable]] without the key.',
      'A [[firewall]] filters [[incoming and outgoing]] network traffic using rules. [[Antivirus]] software detects and removes [[malware]] using signatures and behaviour monitoring.',
      '[[RAID]] combines [[multiple disks]] to improve performance and/or provide [[redundancy]] so data survives a disk failure. A [[backup]] is a copy kept separately for [[recovery]].'
    ]},
  ],
  '1-E': [
    { title: 'Transactional data & accuracy', passages: [
      '[[Transactional data]] changes as events happen (e.g. sales, bookings) and must stay [[accurate and consistent]]. [[Master data]] changes less often.',
      '[[Validation]] checks data against [[rules]] (e.g. range, format) as it is entered, while [[verification]] checks the data matches the [[source]] (e.g. typing a password twice).'
    ]},
  ],
  '1-F': [
    { title: 'Legislation & ethics', passages: [
      '[[GDPR]] governs how organisations handle [[personal data]]: keep it minimal, secure and used only for a clear, lawful purpose. The [[Computer Misuse Act 1990]] makes it an offence to gain [[unauthorised access]] to computer material.',
      '[[Copyright]] protects creators of original work — you need [[permission]] to reuse others\' images, text and music.',
      'The [[digital divide]] is the gap between those who have access to technology and those who do not.'
    ]},
  ],
  '2-A': [
    { title: 'Social engineering & malware', passages: [
      '[[Phishing]] uses fake emails to trick users into revealing credentials; [[vishing]] uses phone calls and [[smishing]] uses SMS. [[Spear phishing]] targets a [[specific individual]], and [[whaling]] targets senior [[executives]].',
      '[[Ransomware]] [[encrypts]] a victim\'s files and demands payment. [[Spyware]] secretly [[monitors]] activity. [[Adware]] floods the device with [[advertisements]].',
      '[[DoS/DDoS]] overloads a system with traffic so it becomes [[unavailable]]. A DDoS uses many [[compromised computers]] (a botnet).',
      'The impact of a credible threat is judged as [[operational]], [[financial]], [[reputational]] and [[intellectual-property]] loss.',
      '[[Penetration testing]] is an authorised simulated [[attack]] to find weak spots before attackers do. A [[port scanner]] finds [[open ports]]. Risk can be handled by [[transfer]], [[avoidance]] or [[acceptance]].'
    ]},
    { title: 'Don\u2019t fall for these — common misconceptions', passages: [
      'Thinking anti-virus makes you \u201ccompletely secure\u201d is wrong. Security needs [[defence in depth]] — multiple [[layers]] of protection, so if one fails the others still hold.',
      '[[GDPR]] applies to organisations of [[all]] sizes, not just large firms — even a small business holding personal data must comply.',
      '[[MAC]] addresses CAN be [[spoofed]], so [[MAC filtering]] on its own is not enough security — use proper [[network access controls]].',
      '[[Updates / patches]] are not just extra features — they fix [[security flaws]]. Missing patches are a common cause of real-world [[breaches]].'
    ]},
  ],
  '2-B': [
    { title: 'Topologies & TCP/IP', passages: [
      'A [[star]] topology connects every node to a central [[switch]], so one cable failure affects only that node. A [[bus]] uses one shared cable, and a [[ring]] passes data around a loop.',
      'The [[TCP/IP]] model layers are [[application]], [[transport]], [[internet]] and [[network access]]. [[NAT]] lets many devices share one [[public IP address]].',
      '[[IPv4]] addresses are running out, so [[IPv6]] provides a much larger address space. [[APIPA]] gives a device a link-local address when [[DHCP]] is unavailable.'
    ]},
    { title: 'Don\u2019t fall for these — common misconceptions', passages: [
      'Cyber security is not just about [[technical]] controls — [[human behaviour]] is just as important, so training and policy matter too.',
      'Multiple [[layers]] of defence is called [[defence in depth]] — no single control is enough on its own.'
    ]},
  ],
  '2-C': [
    { title: 'Policies: DR vs incident response', passages: [
      'A [[disaster recovery]] policy describes how to restore [[operations]] after a major incident, while an [[incident response]] policy describes the immediate [[steps]] taken when a security incident is detected.',
      'Security is often managed using the [[Plan-Do-Check-Act]] cycle from [[ISO 27001]]. A [[security audit]] checks compliance against [[policies]].'
    ]},
    { title: 'Don\u2019t fall for these — common misconceptions', passages: [
      '[[Backup]] and [[disaster recovery]] are NOT the same thing — backup is a [[copy]] of data, while disaster recovery is the [[process]] of restoring operations after an incident.',
      'Small organisations DO still need [[security policies]] — breaches affect small businesses too, and policies let you set [[expectations]] and act on unsafe practices.',
      'Policies are not \u201cdocuments nobody reads\u201d — they help [[prevent]] incidents and give a basis to [[discipline]] users who break the rules.'
    ]},
  ],
  '2-D': [
    { title: 'Forensic procedures', passages: [
      '[[Chain of custody]] documents who has handled [[evidence]] and when, so it is admissible. Evidence must be collected in [[order of volatility]] — most volatile first (e.g. [[RAM]], running processes, then [[disks]]).',
      'An [[image]] (bit-for-bit copy) is made of the suspect drive rather than working on the [[original]], preserving its [[integrity]].'
    ]},
  ],
  '3-A': [
    { title: 'Principles & planning', passages: [
      'The [[F-shaped pattern]] describes how users scan text-heavy pages, while the [[Z-shaped pattern]] fits simple hero pages. [[Visual hierarchy]] orders elements by [[importance]].',
      '[[SEO]] improves a site\'s ranking in [[search results]] through headings, keywords, alt text and performance.',
      '[[Accessibility]] means designing so people with [[disabilities]] can use the site — alt text, [[contrast]], captions and [[keyboard]] navigation. In the UK, the [[Equality Act 2010]] makes sites legally required to be accessible.',
      'A [[site map]] shows the [[pages]] of a website and how they [[link]] together.'
    ]},
    { title: 'Planning from a client brief', passages: [
      'A client brief sets the [[purpose]], the [[problem]] to solve, the key [[messages]] and the overall [[goals]].',
      'From the brief you must establish the intended [[audience]] and any [[technical]] requirements (e.g. mobile-first, integration with a stock system).',
      'You must also research [[legal and ethical]] constraints: [[copyright]], [[data protection]] (UK GDPR) and [[digital accessibility]].'
    ]},
  ],
  '3-B': [
    { title: 'Wireframes, mockups & assets', passages: [
      'A [[wireframe]] is a [[low-fidelity]] layout of boxes and placeholder text showing [[structure]], not style. A [[mockup]] is a [[high-fidelity]] visual showing colours, fonts and images.',
      '[[JPG]] suits photographs, [[PNG]] suits graphics needing [[transparency]], and [[MP4]] is used for video. Compress assets to keep them under about [[1MB]] for fast loading.',
      'Use a logical [[folder structure]] and descriptive, consistent [[naming conventions]] (e.g. hero-banner.jpg, not IMG-3421.jpg).'
    ]},
    { title: 'Don\u2019t fall for these — common misconceptions', passages: [
      'Do NOT put all CSS [[inline]] in every HTML tag — use an [[external]] stylesheet so the style is [[consistent]] and easy to maintain.',
      '[[Closing]] HTML tags are NOT optional. Almost every opening tag needs a closing tag — the few exceptions include [[br]], [[img]] and [[link]].'
    ]},
  ],
  '3-C': [
    { title: 'Development & testing', passages: [
      'Testing should cover [[functionality]] (does it work?), [[usability]] (is it easy to use?) and [[accessibility]]. [[Responsive]] design ensures the site works on [[different screen sizes]].',
      'A [[test plan]] lists each test with its expected [[outcome]], actual [[result]], and any [[actions]] needed, backed by [[evidence]] such as screenshots or screen recordings.'
    ]},
    { title: 'Publishing & review', passages: [
      'Before publishing, run a final check for [[legal and ethical]] compliance and run the site through a [[validator]] (e.g. W3C) to confirm it meets web [[standards]].',
      'A self-review compares your site to [[similar websites]], checks it meets the [[client requirements]], and considers [[accessibility]] and [[readability]].'
    ]},
  ],
  '4-A': [
    { title: 'Keys, integrity & normalisation', passages: [
      'A [[primary key]] uniquely identifies each [[row]] and is never null. A [[foreign key]] in one table matches a [[primary key]] in another, enforcing [[referential integrity]].',
      '[[1NF]] removes [[repeating groups]] so every value is [[atomic]]. [[2NF]] removes [[partial]] dependencies on part of a [[composite key]]. [[3NF]] removes [[transitive]] dependencies (a non-key field depending on another non-key field).',
      'Poor design causes [[insertion]], [[update]] and [[deletion]] anomalies. Normalisation removes [[redundancy]] and these dependency problems.',
      'Entity relationship types: [[one-to-one]], [[one-to-many]] and [[many-to-many]]. A many-to-many link is resolved with a [[linking table]].'
    ]},
    { title: 'Don\u2019t fall for these — common misconceptions', passages: [
      'Do not confuse the keys — the [[primary key]] uniquely identifies a [[tuple]] (row), while the [[foreign key]] [[links]] tuples between tables by referencing another table\'s primary key.',
      '[[Data]] and [[information]] are different: data is [[raw and unprocessed]], while information is [[processed and meaningful]] (e.g. a list of numbers vs. "monthly sales figures").',
      'A [[table]] and a [[relation]] are the same thing — \u201crelation\u201d is just the formal database term.',
      'Being in [[2NF]] does NOT mean you are in [[3NF]] — 3NF still removes [[transitive]] dependencies (a non-key field depending on another non-key field).'
    ]},
  ],
  '4-B': [
    { title: 'Design documentation', passages: [
      'An [[ERD]] (entity relationship diagram) shows entities, their [[attributes]] and the [[relationships]] between them, using [[crow\'s foot]] notation for cardinality.',
      'A [[data dictionary]] lists every [[table]], [[field]], data type, length and [[validation]] rule.',
      'Forms use controls such as [[combo boxes]], [[radio buttons]], [[list boxes]] and input masks to make data entry quick and accurate.'
    ]},
    { title: 'Design deliverables to produce', passages: [
      'A [[design specification]] states the requirements of the brief, the [[audience]], [[purpose]], client requirements, and [[legal/ethical]] considerations.',
      '[[Data structure designs]] combine normalisation, an [[ERD]] and a [[data dictionary]].',
      'The user interface includes [[forms]], [[menus]], [[queries]] and [[reports]].',
      'A [[test plan]] covers data integrity, [[functionality]], [[accessibility]] and [[usability]], plus an [[implementation plan]] with timescales.'
    ]},
  ],
  '4-C': [
    { title: 'Build, test & optimise', passages: [
      'Tests use [[normal]], [[erroneous]] and [[extreme]] data. [[Referential integrity]] testing checks that related records behave correctly when added or deleted.',
      'To optimise a query, [[SELECT]] only the [[columns]] you need and use efficient [[joins]], avoiding unnecessary tables.'
    ]},
    { title: 'Optimisation & review', passages: [
      'Database performance is affected by chosen [[data types]], the [[volume]] of data, and the accuracy of [[normalisation]].',
      'A final review weighs [[quality]], [[fitness for purpose]], [[suitability]] against the original requirements, and [[legal/ethical]] constraints — backed by [[evidence]] from testing.'
    ]},
  ],
};

// ---------------------------------------------------------------------------
// Design / workshop page scaffolds for units 3 & 4 (the coursework units).
// Each entry prompts the student to produce a piece of design documentation.
// ---------------------------------------------------------------------------
// Running scenario for each coursework unit's design workshops.
const SCENARIO = {
  3: {
    brief: 'Retro Film Hub',
    text: 'Midnight Picture Show is a small independent cinema that hosts late-night screenings of classic films. It wants a website that introduces young adults (17–23) to the films, stars and cultural moments of Hollywood\'s golden era and encourages them to book tickets.',
    audience: 'Target audience: 17- to 23-year-olds, many of whom have seen remakes or references but never the originals.',
  },
  4: {
    brief: 'College Course Enrolment',
    text: 'A sixth-form college needs a database to manage its learners, courses, subjects and staff, and to track which learner is enrolled on which course. Enrolment data currently lives across spreadsheets and paper.',
    audience: 'Users: enrolment staff enter enrolments; tutors run queries and reports; managers review numbers and completion rates.',
  },
};

// Design / workshop page scaffolds for units 3 & 4 (the coursework units).
// Each entry prompts the student to produce a piece of design documentation,
// tied to the running scenario so the task is concrete.
const DESIGNS = {
  '3-A': [
    { kind: 'sitemap', title: 'Site map for the cinema website', prompt: 'Using the Retro Film Hub brief, sketch a site map showing the three pages and how they link. Note the purpose of each page and the navigation between them.',
      model: { mermaid: 'flowchart TD\n  HOME["Home"] --> FILMS["Film Collection"]\n  HOME --> GENRE["Explore by Genre / Decade"]\n  HOME --> BOOK["My Booking / Tickets"]\n  FILMS --> DETAIL["Film Detail Page"]\n  GENRE --> DETAIL\n  DETAIL --> REQUEST["Request a Screening (form)"]\n  HOME --> ABOUT["About / Contact"]' } },
    { kind: 'wireframe', title: 'Home page wireframe', prompt: 'Sketch a low-fidelity wireframe of the home page for the cinema. Show the header, navigation, hero, film sections and footer. Label each element — no colours or final images yet.',
      model: { wireframe: [
        { h: 24, label: 'Header — logo left, nav right (Home · Films · About · Book)' },
        { h: 120, label: 'Hero — featured film image + headline "Late-night classics" + CTA button "Book now"' },
        { h: 90, label: 'Film cards ×4 (thumbnail + title + genre + "Read more")' },
        { h: 70, label: 'Explore by genre / decade — accordion or filter' },
        { h: 48, label: 'Footer — contact, social links, accessibility statement' },
      ] } },
    { kind: 'wireframe', title: 'Mobile UI wireframe', prompt: 'Sketch the same home page as a mobile layout. Show how the navigation collapses (hamburger) and how content stacks vertically for phone screens.',
      model: { wireframe: [
        { h: 26, label: 'Header — logo left, hamburger (☰) right' },
        { h: 95, label: 'Hero — single column, headline + tap-to-book button' },
        { h: 170, label: 'Film cards stacked vertically (2×2 grid on tablet)' },
        { h: 120, label: 'Genre accordion — collapsible sections' },
        { h: 46, label: 'Footer — stacked links, larger touch targets' },
      ] } },
  ],
  '3-B': [
    { kind: 'wireframe', title: 'Inner-page wireframe', prompt: 'Wireframe a film information page for the cinema site. Include at least one form field (e.g. request a screening) and one call-to-action.',
      model: { wireframe: [
        { h: 24, label: 'Header — breadcrumb Home › Films › [Title]' },
        { h: 100, label: 'Film title + poster thumbnail + synopsis' },
        { h: 80, label: 'Key facts — stars, director, runtime, rating' },
        { h: 70, label: 'CTA: "Book a screening" button (primary)' },
        { h: 60, label: 'Request form — email field + "Send request" button' },
      ] } },
    { kind: 'mockup', title: 'Visual design (mockup) annotation', prompt: 'Annotate a high-fidelity mockup: which colours, fonts and images you will use, and WHY they suit a 17–23 audience. Link every choice back to the cinema brief.',
      model: { table: {
        head: ['Element', 'Choice', 'Why it suits 17–23s'],
        rows: [
          ['Colours', 'Deep burgundy + cream + gold', 'Golden-era Hollywood feel; warm and retro but not dated'],
          ['Headings', 'Bold display serif (e.g. Playfair Display)', 'Echoes vintage cinema signage'],
          ['Body text', 'Clean sans-serif (e.g. Inter)', 'Readable on phone screens at small sizes'],
          ['Images', 'High-quality stills + posters', 'Visual-first — classic films need striking visuals'],
          ['Motion', 'Subtle hover states + image slider', 'Adds energy without hurting accessibility'],
        ],
      } } },
    { kind: 'table', title: 'Asset log', prompt: 'List the assets for the cinema site: name, source, file type and where each is used. Check licences and note any compression needed.',
      model: { table: {
        head: ['Asset', 'Source', 'Type', 'Used on', 'Licence / notes'],
        rows: [
          ['hero-banister.jpg', 'Unsplash (own edit)', 'JPG (compressed)', 'Home hero', 'Royalty-free, credit not required'],
          ['casablanca-poster.webp', 'Studio press kit', 'WebP', 'Film page', 'Promotional use only'],
          ['retro-logo.svg', 'Created in Illustrator', 'SVG', 'Header + footer', 'Own work'],
          ['trailer-1942.mp4', 'Official trailer (embed)', 'MP4', 'Film page', 'Embedded, not re-hosted'],
        ],
      } } },
  ],
  '3-C': [
    { kind: 'form', title: 'Form design', prompt: 'Design the "request a screening" form for the cinema site. Show fields, suitable input types, validation and a clear submit button.',
      model: { form: [
        { field: 'Full name', type: 'text input', required: true },
        { field: 'Email address', type: 'email input', required: true },
        { field: 'Film requested', type: 'select (drop-down)', required: true },
        { field: 'Preferred date', type: 'date picker', required: true },
        { field: 'Number of guests', type: 'number input (1–20)', validation: 'range check' },
        { field: 'Submit', type: 'primary button', required: false },
      ] } },
    { kind: 'table', title: 'Build checklist (HTML → CSS → JS)', prompt: 'Plan your build in three layers, as Pearson expects: HTML structure first, then CSS, then JavaScript for interactivity.',
      model: { table: {
        head: ['Layer', 'What it does', 'Cinema-site examples'],
        rows: [
          ['HTML', 'Structure + content', 'Semantic tags: header, nav, main, sections, footer, form, figure'],
          ['CSS', 'Style + layout', 'External stylesheet, colour scheme, typography, media queries for mobile'],
          ['JavaScript', 'Interactivity', 'Image slider, accordion, modal images, form validation, video controls'],
          ['Accessibility', 'Built in, not added on', 'alt text, semantic tags, keyboard navigation, captions, contrast'],
        ],
      } } },
    { kind: 'testplan', title: 'Website test plan', prompt: 'Write a test plan for the built cinema site: test, expected outcome, actual result and any fix. Cover functionality, usability and accessibility.',
      model: { table: {
        head: ['#', 'Test', 'Expected outcome', 'Actual result', 'Fix needed'],
        rows: [
          ['1', 'All nav links work', 'Each page opens', '', ''],
          ['2', 'Booking form validates email', 'Error shown for invalid email', '', ''],
          ['3', 'Site resizes on phone (responsive)', 'No horizontal scroll', '', ''],
          ['4', 'Images have alt text (accessibility)', 'Screen reader reads descriptions', '', ''],
          ['5', 'Contrast ratio passes WCAG', 'Text readable', '', ''],
        ],
      } } },
    { kind: 'report', title: 'Client review report', prompt: 'Sketch the layout of a review report for the cinema client, summarising what was built and how it meets the brief.',
      model: { wireframe: [
        { h: 30, label: 'Recommendation — "the site meets all requirements" + D/M/P grade claim' },
        { h: 90, label: 'How it meets the brief — map each must-include to what was built' },
        { h: 70, label: 'Strengths + weaknesses (honest self-review)' },
        { h: 60, label: 'Improvements — three considered refinements' },
      ] } },
  ],
  '4-A': [
    { kind: 'normalisation', title: 'Normalisation worksheet', prompt: 'Using the College Course Enrolment brief, take the UNF enrolment table (with repeating groups) and normalise it to 1NF, 2NF and 3NF. Show tables, fields and keys at each stage.',
      model: { table: {
        head: ['Form', 'Tables (with keys)'],
        rows: [
          ['UNF', 'Enrolment(ID, LearnerName, Course, Subjects[], Staff, StaffEmail)'],
          ['1NF', 'Learner(LearnerID) — Course(CourseID) — Enrolment(LearnerID, CourseID) — each subject atomic'],
          ['2NF', 'Remove partial deps: Enrolment(LearnerID, CourseID, EnrolDate) — Subject(SubjectID, SubjectName)'],
          ['3NF', 'Remove transitive deps: Staff(StaffID, StaffName, StaffEmail) — no non-key depends on non-key'],
        ],
      } } },
    { kind: 'erd', title: 'Entity relationship diagram', prompt: 'Draw an ERD for Learner, Course, Subject, Staff and Enrolment. Label primary keys, foreign keys and cardinality (1:1, 1:M, M:N).',
      model: { mermaid: 'erDiagram\n  LEARNER ||--o{ ENROLMENT : makes\n  COURSE ||--o{ ENROLMENT : has\n  STAFF ||--o{ COURSE : teaches\n  LEARNER }o--o{ SUBJECT : studies\n  LEARNER { int LearnerID PK }\n  COURSE { int CourseID PK }\n  SUBJECT { int SubjectID PK }\n  STAFF { int StaffID PK }\n  ENROLMENT { int LearnerID FK }\n  ENROLMENT { int CourseID FK }' } },
    { kind: 'table', title: 'Relational algebra notes', prompt: 'For each operation (union, intersect, join, select) write what it does and a small worked example using two college relations.',
      model: { table: {
        head: ['Operation', 'What it does', 'Example'],
        rows: [
          ['SELECT (σ)', 'Filter rows by a condition', 'σ Course=IT (Enrolment) → only IT rows'],
          ['PROJECT (π)', 'Choose specific columns', 'π LearnerID,CourseID (Enrolment)'],
          ['UNION (∪)', 'Combine rows of two relations', 'Courses ∪ Subjects → all rows'],
          ['JOIN (⋈)', 'Combine on a matching key', 'Learner ⋈ Enrolment on LearnerID'],
        ],
      } } },
  ],
  '4-B': [
    { kind: 'erd', title: 'Full ERD with crow\'s foot notation', prompt: 'Produce a conceptual then logical ERD for the college database. Add attributes, primary keys and foreign keys in the logical version.',
      model: { mermaid: 'erDiagram\n  LEARNER ||--o{ ENROLMENT : enrols\n  COURSE ||--o{ ENROLMENT : on\n  STAFF ||--o{ COURSE : runs\n  LEARNER { int LearnerID PK }\n  LEARNER { string FirstName }\n  LEARNER { string LastName }\n  LEARNER { string DOB }\n  COURSE { int CourseID PK }\n  COURSE { string CourseName }\n  COURSE { int StaffID FK }\n  STAFF { int StaffID PK }\n  STAFF { string StaffEmail }\n  ENROLMENT { int LearnerID FK }\n  ENROLMENT { int CourseID FK }\n  ENROLMENT { date EnrolDate }' } },
    { kind: 'table', title: 'Data dictionary', prompt: 'Build a data dictionary for the college database: table name, field name, data type, length, validation rule and description for every field.',
      model: { table: {
        head: ['Table.Field', 'Data type', 'Length', 'Validation', 'Description'],
        rows: [
          ['Learner.LearnerID', 'Autonumber', '—', 'PK, required', 'Unique learner id'],
          ['Learner.FirstName', 'Short Text', '30', 'Required, not blank', 'Learner first name'],
          ['Learner.DOB', 'Date/Time', '—', 'Between 01/01/1990–today', 'Date of birth'],
          ['Enrolment.EnrolDate', 'Date/Time', '—', 'Not in future', 'Date enrolled'],
          ['Enrolment.CourseID', 'Number', 'Long', 'FK → Course.CourseID', 'Course joined'],
          ['Staff.StaffEmail', 'Short Text', '60', 'Must contain @', 'Staff email'],
        ],
      } } },
    { kind: 'form', title: 'Data-entry form design', prompt: 'Design the enrolment input form and a report layout. Include combo boxes (pick a Learner/Course), radio buttons, validation and user help.',
      model: { form: [
        { field: 'Learner', type: 'combo box (drop-down)', required: true },
        { field: 'Course', type: 'combo box (drop-down)', required: true },
        { field: 'Enrolment date', type: 'date input', validation: 'not in future' },
        { field: 'Full-time / Part-time', type: 'radio buttons', required: true },
        { field: 'Status', type: 'read-only (calculated)', required: false },
      ] } },
    { kind: 'testplan', title: 'Database test plan', prompt: 'Write a test plan for the college database covering referential integrity, functionality and usability, using normal, erroneous and extreme data.',
      model: { table: {
        head: ['#', 'Test', 'Data type', 'Expected outcome', 'Actual'],
        rows: [
          ['1', 'Add enrolment with valid LearnerID', 'Normal', 'Record saved', ''],
          ['2', 'Add enrolment with missing Learner', 'Erroneous', 'Rejected (referential integrity)', ''],
          ['3', 'Enter DOB 45 years ago', 'Extreme', 'Rejected (range check)', ''],
          ['4', 'Deleting a course with enrolments', 'Normal', 'Prevented / warned', ''],
          ['5', 'Form navigable by keyboard', 'Usability', 'All controls reachable', ''],
        ],
      } } },
  ],
  '4-C': [
    { kind: 'table', title: 'Build with SQL (both ways)', prompt: 'Plan how you will build the college database. Pearson expects you to create tables, relationships and validation using BOTH a GUI (Access) AND SQL, then compare the two.',
      model: { table: {
        head: ['Task', 'SQL example'],
        rows: [
          ['Create a table', 'CREATE TABLE Learner (LearnerID ... PRIMARY KEY, ...);'],
          ['Add a relationship', 'Foreign key + referential integrity constraint'],
          ['Add validation', 'CHECK (EnrolDate <= today) or Access validation rule'],
          ['Query data', 'SELECT FirstName, CourseName FROM ... JOIN ... WHERE ...;'],
          ['Update / delete', 'UPDATE ... SET ... WHERE ...;  DELETE FROM ... WHERE ...;'],
        ],
      } } },
    { kind: 'report', title: 'Report layout & optimisation', prompt: 'Sketch a report layout grouping enrolments by course with totals and conditional formatting. Then list three ways to optimise a slow query.',
      model: { table: {
        head: ['Area', 'What to include'],
        rows: [
          ['Report header', 'Title + date + user'],
          ['Group by', 'Course — header per course'],
          ['Detail', 'Learner name, course, enrolment date'],
          ['Totals', 'Count of enrolments per course (calc field)'],
          ['Conditional format', 'Highlight courses above capacity in red'],
          ['Optimise query', 'SELECT only needed columns · index the FK · avoid SELECT *'],
        ],
      } } },
    { kind: 'testplan', title: 'Final test log', prompt: 'Record the final tests on the college database (tables, queries, forms, reports) with outcomes and refinements.',
      model: { table: {
        head: ['Object', 'Test', 'Outcome', 'Refinement'],
        rows: [
          ['Tables', 'Keys + integrity enforced', 'Pass', '—'],
          ['Queries', 'Parameter query returns correct rows', 'Pass', 'Added index'],
          ['Forms', 'Subform shows enrolments', 'Pass', 'Added combo box'],
          ['Reports', 'Group totals correct', 'Pass', 'Conditional formatting added'],
        ],
      } } },
  ],
};

// How to structure Tasks 1–3 to a Distinction standard (units 3 & 4 only).
const TASK_GUIDE = {
  3: {
    title: 'How to structure Tasks 1–3 (Website Development)',
    tasks: [
      { num: 1, aim: 'A', name: 'Research & plan the website', steps: [
        'Read the brief and highlight the purpose, audience and must-include features.',
        'Research 2–3 existing websites and compare what they do well / badly.',
        'Produce a site map showing every page and how they link.',
      ], distinction: 'Use pertinent, named examples and a clearly annotated site map showing HOW each page meets the brief. Use accurate technical vocabulary (SEO, accessibility, UX).' },
      { num: 2, aim: 'B', name: 'Design the website & manage assets', steps: [
        'Sketch wireframes for every page, then a high-fidelity visual design.',
        'Source or create assets and keep an asset log with licences.',
        'Review your designs against the brief and refine them.',
      ], distinction: 'Justify every design choice against the audience and brief. Show a clear link between wireframe, mockup and final site, with effective asset management.' },
      { num: 3, aim: 'C', name: 'Build, test & review the website', steps: [
        'Build the site to your design using the required tools and techniques.',
        'Test functionality, usability and accessibility; log results and fixes.',
        'Write a self-review of strengths, weaknesses and improvements.',
      ], distinction: 'Demonstrate web standards, a consistent and accessible site, effective testing, and considered refinements drawn from a thorough self-review.' },
    ],
  },
  4: {
    title: 'How to structure Tasks 1–3 (Relational Database Development)',
    tasks: [
      { num: 1, aim: 'A', name: 'Research & scope the database', steps: [
        'Read the brief and identify the entities, data and reports needed.',
        'Research how similar databases are structured (keys, normalisation).',
        'Produce a preliminary scoping document with the planned tables and keys.',
      ], distinction: 'Use pertinent examples and fluent, accurate technical vocabulary. Show thorough understanding of normalisation and how it comprehensively meets the brief.' },
      { num: 2, aim: 'B', name: 'Design the database solution', steps: [
        'Draw conceptual then logical ERDs with keys and cardinality.',
        'Write a data dictionary for every table and field.',
        'Design forms, queries and reports, plus a test plan and timescale.',
      ], distinction: 'Produce a complete, logical design package (ERDs, data dictionary, UI designs, test plan) that comprehensively meets every client requirement.' },
      { num: 3, aim: 'C', name: 'Build, test & optimise the database', steps: [
        'Build the tables, relationships, forms, queries and reports.',
        'Test with normal, erroneous and extreme data; log and fix issues.',
        'Review and optimise (data types, efficient queries) and document refinements.',
      ], distinction: 'Build a fully functional database, carry out effective object and usability testing, and make considered optimisations from a thorough self-review.' },
    ],
  },
};

function notesFor(unit, aim) {
  return NOTES[`${unit}-${aim}`] || [];
}

function designsFor(unit, aim) {
  return DESIGNS[`${unit}-${aim}`] || [];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  const index = [];

  for (const c of CATALOGUE) {
    const spec = loadSpec(c.unit);
    if (!spec) { console.warn(`[skip] unit ${c.unit}: no spec.js`); continue; }
    for (const aim of c.aims) {
      if (!spec[aim]) { console.warn(`[skip] unit ${c.unit} aim ${aim}: not in spec`); continue; }
      const bundle = buildAimBooklet(c.unit, aim, spec);
      const fn = `${c.unit}-${aim}.json`;
      fs.writeFileSync(path.join(OUT, fn), JSON.stringify(bundle, null, 1), 'utf8');
      index.push({
        unit: c.unit,
        unitName: c.name,
        unitTitle: c.title,
        aim,
        aimTitle: bundle.aimTitle,
        board: c.board,
        specIssue: c.specIssue,
        file: fn,
        examQuestions: bundle.examQuestions.length,
        mcq: bundle.mcq.length,
        quiz: bundle.quiz.length,
        flashcards: bundle.flashcards.length,
        diagrams: bundle.diagrams.length,
        hasKnowledge: !!bundle.knowledgeBank,
        hasCriteria: bundle.criteria.length > 0,
        hasBriefs: bundle.briefs.length > 0,
        notes: bundle.notes.length,
        designs: bundle.designs.length,
      });
      console.log(`built ${fn}: q=${bundle.examQuestions.length} mcq=${bundle.mcq.length} quiz=${bundle.quiz.length} fc=${bundle.flashcards.length} dg=${bundle.diagrams.length}`);
    }
  }

  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 1), 'utf8');
  console.log('done. index has', index.length, 'booklets');
}

main();