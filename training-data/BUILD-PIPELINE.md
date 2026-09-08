# RA10 Subject Pipeline — Automated Unit Build Recipe

This file is the **single source of truth** for how to turn a raw spec + past papers
into a complete, live revision app for any subject/unit. When you send a spec, this
recipe is followed automatically — no re-explaining required.

---

## 1. What you (the user) send

Drop into `training-data/<board>/<subject>/unit-N/`:

- The **specification PDF** (Pearson/AQA/OCR spec, or the unit's SAM/PSAB).
- Any **past papers / mark schemes / assignment briefs** you have.
- (Optional) one line of direction, e.g. "focus on exam questions, blue brand".

That's it. Everything below is derived.

---

## 2. Step 0 — Extract & research (automatic)

1. Run `extract_pdf_txt.py` (or `extract_pdfs.py`) against every PDF in the unit folder
   → produces `EXTRACTED.txt` / printed text.
2. From the spec, extract:
   - **Qualification structure** (mandatory vs optional units, GLH, external vs internal).
   - **Every unit's Learning Aims** (A/B/C/D/E/F) + their topics/key content.
   - **Assessment style** (external exam = mark-scheme-driven Q&A; internal = PSAB
     tasks + Pass/Merit/Distinction criteria).
   - **Command verbs + mark scheme level bands** (1-2 mark, 6-mark L1-L3, 12-mark L1-L4…).
3. From past papers, extract **question styles** and **mark scheme formats**, and note
   recurring **named scenarios / athlete names / business contexts** to reuse.

---

## 3. Step 1 — Decide the app shape

Two archetypes (everything else is a variation):

| Archetype | Example | Features |
|-----------|---------|----------|
| **Exam unit** (external) | IT U1, IT U2, Business U3, Sport U1, A-Level | Study guide · flashcards · MCQ quiz · exam Q&A bank (mark-scheme reveal) · mock/predicted papers · AI Examiner |
| **Coursework unit** (internal) | IT U3 Website Dev | Study guide · flashcards · quiz · Creation Tools (wireframe/sitemap/editor) · Assignment hub (sample briefs PDF + step-by-step) · AI Assigner (Chat/Examiner/Hints) |

Determine: brand colour, learning-aim list, and whether calculations/levels need
special UI (working boxes for finance, levels-based mark schemes for essays).

---

## 4. Step 2 — Scaffold the folder

Copy the nearest-matching live unit as the base (preserves design system, XP, gating):

```
revision/<board>/<subject>/unit-N/
  index.html          # from base unit's index.html
  css/style.css       # rebrand accent colour
  js/data-loader.js   # loads the JSON below
  js/app.js           # view controller
  js/guide.js         # revision guide renderer (exam units)
  js/revise.js        # flashcards + quiz + MCQ
  js/spec.js          # spec viewer
  data/aim_A.json …   # exam question bank (per aim)
  data/flashcards.json
  data/mc.json        # multiple choice
  data/quiz.json      # quick quiz
  data/knowledge-bank.json  # guide content (aim → topics → keyPoints)
  data/diagrams.json        # (optional) diagrams
```

For **coursework units**, additionally:
```
  js/assignment.js    # assignment hub
  js/ai-assigner.js   # ChatGPT-style AI mentor
  js/wireframe.js / sitemap.js / editor.js   # creation tools
  data/criteria.json  # tasks → P/M/D criteria
  data/sample-briefs.json
```

---

## 5. Step 3 — Generate the content (the bulk of the work)

Quantities (scale up for 120-GLH units, down for 60-GLH):

- **Exam questions**: ~600 across aims (IT U1 scale), or ~250 for a single-unit course.
  Per aim: 15 × 1-2 mark (State/Give/Identify), 15 × 2-4 mark (Explain), 5 × 6-mark
  (Discuss, levels), 3 × 12-mark (Evaluate, levels), + calculations where relevant.
- **MCQ quiz**: 80–150 multiple choice across all aims.
- **Quick quiz**: 12–40 mixed.
- **Flashcards**: 60–150 (key terms, formulas + worked examples, features, pros/cons).
- **Revision guide**: every aim → topic → keyPoints (from `knowledge-bank.json`).
- **Predicted papers** (exam units): 3 × paper + mark scheme.
- **Assignment** (coursework): 3 sample briefs with full P/M/D criteria + step-by-step.

**Hard requirements** (copied faithfully from each existing PROMPT.md):
- Every exam question must have a **named scenario** (business, school, athlete…).
- Every question must have a **full mark scheme** (points-based or levels-based).
- Match the base unit's JSON **schema exactly** (see `revision/…/unit-1/data/aim_A.json`).
- Unique `session_type` values per unit so progress stays separate (e.g.
  `quiz_business_u3`, `practice_business_u3`).

---

## 6. Step 4 — Wire into the site shell

1. Add the unit to the **revision preview dropdown** + mobile sheet in `/index.html`
   (`rev-preview-unit` links, ~line 4460).
2. Add subject to **admin** `SUBJECTS` array (`admin/index.html` ~line 682).
3. Update **sitemap.xml**, **robots.txt** (if needed), and `meta`/canonical tags.
4. Add credit/XP gating keys matching the base unit.
5. Bump cache-buster version on every `<script src>` / `<link rel=stylesheet>`.

---

## 7. Step 5 — QA (automatic)

- `get_errors` on the whole unit folder (no JS errors).
- Open in browser; click every tab; run the "all views load" sweep.
- Verify: flashcards flip, quiz scores, guide renders, exam Q&A reveals mark scheme,
  AI Examiner/Assigner gate correctly (sign-in + credits), downloads/export work.
- Grep for mojibake (`â€`, `Â·`, `ðŸ`) — fix any double-encoded UTF-8.

---

## Canonical base units to copy from

- **Exam unit base** → `revision/btec/level-3/IT-AAQ/unit-1/`
- **Finance (calculations + levels)** → `revision/btec/level-3/business/unit-3/`
- **Science-heavy (anatomy, phonetic spelling)** → `revision/btec/level-3/sport/unit-1/`
- **Coursework/creative (creation tools + AI Assigner)** → `revision/btec/level-3/IT-AAQ/unit-3/`
- **Full A-Level course (papers + AI Examiner)** → `revision/a-level/business-2023/`

---

## Data schemas (must match)

- `aim_*.json` question: `{ id, learning_aim, topic, command_verb, marks, ao, scenario, question, guidance, type, mark_scheme: { instruction, points[], additional_guidance, do_not_accept } }`
- `flashcards.json`: `[{ id, aim, front, back }]`
- `mc.json` / `quiz.json`: `[{ id, aim, topic, q, options[], answer (index), why }]`
- `knowledge-bank.json`: `{ unit, aims: { A: { code, title, topics: [{ code, name, keyPoints[] }] } } }`
- `criteria.json` (coursework): `{ unit, tasks: [{ code, aim, title, criteria: [{ code, level, text }] }], gradeDescriptions }`
- `sample-briefs.json`: `{ briefs: [{ id, title, audience, scenario, purpose, targetAudience, mustIncludes[], … }] }`
