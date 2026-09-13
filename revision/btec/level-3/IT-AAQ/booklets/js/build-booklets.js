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
      });
      console.log(`built ${fn}: q=${bundle.examQuestions.length} mcq=${bundle.mcq.length} quiz=${bundle.quiz.length} fc=${bundle.flashcards.length} dg=${bundle.diagrams.length}`);
    }
  }

  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 1), 'utf8');
  console.log('done. index has', index.length, 'booklets');
}

main();