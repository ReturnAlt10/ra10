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
  ],
  '1-B': [
    { title: 'Compression, codecs & protocols', passages: [
      '[[Lossless]] compression removes redundancy so the original file can be perfectly [[reconstructed]] (e.g. [[PNG]], [[ZIP]]). [[Lossy]] compression permanently removes detail that humans are unlikely to notice, giving much [[smaller files]] (e.g. [[JPEG]], [[MP3]]).',
      'A [[codec]] is software or hardware that [[codes and decodes]] media files. Without the right codec a media file will not [[play]].',
      'The protocol [[SMTP]] is used to [[send]] email, whereas [[POP]]/[[IMAP]] are used to [[receive]] it. Web pages travel over [[HTTP]] or its encrypted form [[HTTPS]].',
      '[[Bandwidth]] is the amount of data that can be carried in a given time, while [[latency]] is the [[delay]] between sending and receiving.'
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
  ],
  '2-B': [
    { title: 'Topologies & TCP/IP', passages: [
      'A [[star]] topology connects every node to a central [[switch]], so one cable failure affects only that node. A [[bus]] uses one shared cable, and a [[ring]] passes data around a loop.',
      'The [[TCP/IP]] model layers are [[application]], [[transport]], [[internet]] and [[network access]]. [[NAT]] lets many devices share one [[public IP address]].',
      '[[IPv4]] addresses are running out, so [[IPv6]] provides a much larger address space. [[APIPA]] gives a device a link-local address when [[DHCP]] is unavailable.'
    ]},
  ],
  '2-C': [
    { title: 'Policies: DR vs incident response', passages: [
      'A [[disaster recovery]] policy describes how to restore [[operations]] after a major incident, while an [[incident response]] policy describes the immediate [[steps]] taken when a security incident is detected.',
      'Security is often managed using the [[Plan-Do-Check-Act]] cycle from [[ISO 27001]]. A [[security audit]] checks compliance against [[policies]].'
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
  ],
  '3-B': [
    { title: 'Wireframes, mockups & assets', passages: [
      'A [[wireframe]] is a [[low-fidelity]] layout of boxes and placeholder text showing [[structure]], not style. A [[mockup]] is a [[high-fidelity]] visual showing colours, fonts and images.',
      '[[JPG]] suits photographs, [[PNG]] suits graphics needing [[transparency]], and [[MP4]] is used for video. Compress assets to keep them under about [[1MB]] for fast loading.',
      'Use a logical [[folder structure]] and descriptive, consistent [[naming conventions]] (e.g. hero-banner.jpg, not IMG-3421.jpg).'
    ]},
  ],
  '3-C': [
    { title: 'Development & testing', passages: [
      'Testing should cover [[functionality]] (does it work?), [[usability]] (is it easy to use?) and [[accessibility]]. [[Responsive]] design ensures the site works on [[different screen sizes]].',
      'A [[test plan]] lists each test with its expected [[outcome]], actual [[result]], and any [[actions]] needed.'
    ]},
  ],
  '4-A': [
    { title: 'Keys, integrity & normalisation', passages: [
      'A [[primary key]] uniquely identifies each [[row]] and is never null. A [[foreign key]] in one table matches a [[primary key]] in another, enforcing [[referential integrity]].',
      '[[1NF]] removes [[repeating groups]] so every value is [[atomic]]. [[2NF]] removes [[partial]] dependencies on part of a [[composite key]]. [[3NF]] removes [[transitive]] dependencies (a non-key field depending on another non-key field).',
      'Poor design causes [[insertion]], [[update]] and [[deletion]] anomalies. Normalisation removes [[redundancy]] and these dependency problems.',
      'Entity relationship types: [[one-to-one]], [[one-to-many]] and [[many-to-many]]. A many-to-many link is resolved with a [[linking table]].'
    ]},
  ],
  '4-B': [
    { title: 'Design documentation', passages: [
      'An [[ERD]] (entity relationship diagram) shows entities, their [[attributes]] and the [[relationships]] between them, using [[crow\'s foot]] notation for cardinality.',
      'A [[data dictionary]] lists every [[table]], [[field]], data type, length and [[validation]] rule.',
      'Forms use controls such as [[combo boxes]], [[radio buttons]], [[list boxes]] and input masks to make data entry quick and accurate.'
    ]},
  ],
  '4-C': [
    { title: 'Build, test & optimise', passages: [
      'Tests use [[normal]], [[erroneous]] and [[extreme]] data. [[Referential integrity]] testing checks that related records behave correctly when added or deleted.',
      'To optimise a query, [[SELECT]] only the [[columns]] you need and use efficient [[joins]], avoiding unnecessary tables.'
    ]},
  ],
};

// ---------------------------------------------------------------------------
// Design / workshop page scaffolds for units 3 & 4 (the coursework units).
// Each entry prompts the student to produce a piece of design documentation.
// ---------------------------------------------------------------------------
const DESIGNS = {
  '3-A': [
    { kind: 'sitemap', title: 'Site map for a client website', prompt: 'Choose a brief (or your own client). Sketch a site map showing the pages and how they link. Add a short note on the purpose of each page.' },
    { kind: 'wireframe', title: 'Home page wireframe', prompt: 'Sketch a low-fidelity wireframe of the home page. Show the header, navigation, hero, content sections and footer. Label each element — do NOT add colours or final images.' },
    { kind: 'wireframe', title: 'Mobile UI wireframe', prompt: 'Sketch the same home page as a mobile layout. Show how the navigation collapses (e.g. hamburger) and how content stacks vertically.' },
  ],
  '3-B': [
    { kind: 'wireframe', title: 'Inner-page wireframe', prompt: 'Wireframe a content page (e.g. a film page or "join us" page). Include at least one form and one call-to-action.' },
    { kind: 'mockup', title: 'Visual design (mockup) annotation', prompt: 'Annotate a mockup: which colours, fonts and images you will use, and WHY they suit the target audience. Link each choice to the brief.' },
    { kind: 'table', title: 'Asset log', prompt: 'List the assets you will use: name, source (own work or URL), file type, and where each is used on the site. Check licences.' },
  ],
  '3-C': [
    { kind: 'form', title: 'Form design', prompt: 'Design a form for the site (e.g. request a film, join the charity). Show fields, suitable input types, validation and a clear submit button.' },
    { kind: 'testplan', title: 'Website test plan', prompt: 'Write a test plan: for each test give the test, expected outcome, actual result and any fix needed. Cover functionality, usability and accessibility.' },
    { kind: 'wireframe', title: 'Report / review page', prompt: 'Sketch the layout of a report or review page the client could read, summarising what was built and how it meets the brief.' },
  ],
  '4-A': [
    { kind: 'normalisation', title: 'Normalisation worksheet', prompt: 'Take a UNF table with repeating groups and normalise it to 1NF, 2NF and 3NF. Show tables, fields and keys at each stage.' },
    { kind: 'erd', title: 'Entity relationship diagram', prompt: 'Draw an ERD for a small database (e.g. orders, customers, products). Label primary keys, foreign keys and cardinality (1:1, 1:M, M:N).' },
    { kind: 'table', title: 'Relational algebra notes', prompt: 'For each operation (union, intersect, join, select) write what it does and a small worked example using two relations.' },
  ],
  '4-B': [
    { kind: 'erd', title: 'Full ERD with crow\'s foot notation', prompt: 'Produce a conceptual then logical ERD. Add attributes, primary keys and foreign keys in the logical version.' },
    { kind: 'table', title: 'Data dictionary', prompt: 'Build a data dictionary: table name, field name, data type, length, validation rule and description for every field.' },
    { kind: 'form', title: 'Data-entry form design', prompt: 'Design an input form and a report layout. Include combo boxes, radio buttons, validation and user help.' },
    { kind: 'testplan', title: 'Database test plan', prompt: 'Write a test plan covering referential integrity, functionality and usability, using normal, erroneous and extreme test data.' },
  ],
  '4-C': [
    { kind: 'report', title: 'Report layout & optimisation', prompt: 'Sketch a report layout (grouping, calculated fields, conditional formatting). Then list three ways you would optimise a slow query.' },
    { kind: 'testplan', title: 'Final test log', prompt: 'Record the final tests you carried out on tables, queries, forms and reports, with outcomes and refinements.' },
  ],
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