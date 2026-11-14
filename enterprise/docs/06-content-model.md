# 06 — Content Model and Quality Rules

Learning content is RA10's core asset. This page covers how it is structured, the rules it must follow and how its quality is measured.

## 1. Content families

| Family | Units | Data format | Generator | Hand-written parts |
|---|---|---|---|---|
| **BTEC AAQ** (Computing, Construction, ECD, Engineering, HSC, Medical Science) | 31 | JS content APIs (`K/M/TF/F`, `BIZ_GUIDE_DATA`, `BIZ_PAPERS`) | `aaq-build/build_apps.py` | `js/{guide,bank,quiz,cards,papers-ra10,assignment-help}.js` in the unit |
| **BTEC Business** (Units 2, 3, 6, 7) | 4 | Same APIs (the original engines) | `business/build/*` | `js/{cfg,spec,bank,quiz,cards,guide}.js` in the unit |
| **BTEC Sport** (Units 1, 2) | 2 | Sport templates (Unit 2 is the template for Business) | — | Unit files |
| **BTEC IT AAQ** (Units 1–4) | 4 | Legacy JSON (`data/aim_*.json`, `flashcards.json`, `mc.json`…), plus `papers-ra10.js` and `papers-figures.js` | `tools/*it*` (historical) | Data files |
| **BTEC L2 IT** (Unit 2) | 1 | Legacy JSON (`data/*.json`) | — | Data files |
| **AQA A-Level Business** (7132, 7138) | 2 | `papers-data.js` (AQA engine `aqa-papers`) + guide/quiz/cards | `aqa-build/*` | Guides, RA10 sets (`ra10_*_set_*.py`) |
| **A-Level Psychology (7182), Edexcel Business (9BS0)** | 2 | Same APIs, **assembled** from content parts | `alevel-build/build_alevel.py` | `alevel-build/content/<slug>/{bank,guide,papers-ra10}/NN_*.js` |

## 2. Core schemas

### Knowledge check (`K`) → question bank item

```js
K(aim, topicLabel, commandVerb, marks, question, [markPoints])   // points-marked
KL(aim, topicLabel, commandVerb, marks, question, ...)           // levels-marked
```

Exported item fields (via the catalogue): `{id, aim|learning_aim, topic, marks, command_verb, type, question, mark_scheme}`.

### Quiz and flashcards

```js
M(aim, topic, stem, correct, [wrong1, wrong2, wrong3], why)   // multiple choice
TF(aim, topic, statement, true|false, why)                    // true/false
F(aim, front, back)                                           // flashcard
B.publish()                                                   // last line of cards.js
```

### Paper (real or RA10)

```js
{ id:'<CODE>-R01', unit, key:'R01', source:'ra10'|'pearson'|'aqa'|'edexcel', spec, kind:'exam', code, series, date,
  title, blurb, minutes, total,
  items:[{ q, sub, marks, section, ctx:[lines], ctxb:[blocks], text, ms:{ body, levels }, fig?, padFig? }] }
```

- Context block types (`ctxb`): `p`, `h`, `li`, `tbl`, `grid`, `code`, `fig`, `cap`, `stat`.
- Figures: `[[fig:id]]` tokens resolve via `BIZ_FIGURES`.
- **RA10 paper totals must equal the real paper's totals**, with the same sections, timing and tariffs.

### Guide

`BIZ_GUIDE_DATA = {storeKey, unitLabel, aimWord, aimLabels, aims, titles, subtitles, setTask, setTaskTitle, topics:{A:[{code, name, html()}]}, gallery}`

- Content blocks `H.*`: `key`, `tip`, `warn`, `example`, `formula` (note must be a string), `table`, `ul`, `ol`, `two`, `stats`, `check`, `code`, `steps`, `cards`, `pill`, `fig`.
- Diagrams `S.*`: `flow`, `ladder`, `cycle`, `tiles`, `matrix`, `bars`, `lines` (`{name, col, pts}`), `layers`, `pie`, `pyramid`, `gantt`, `tree`, `venn`, `funnel`, `spectrum`, `org`, `breakEven`, `fiveForces`, `plc`.

### Spec

`spec.js` is **generated** from the parsed specification: aims → topics `{code, name, points}` → criteria (assignment units). Never hand-edit it. Fix the parse or `SPEC_PATCHES` instead.

### Aim vs chapter labelling

- **BTEC** shows "Learning aim A, B, C".
- **A-Level** shows **chapters**:

  | Subject | Labels |
  |---|---|
  | Psychology | `1.1 … 3.10` (paper.section, so 4.1.1 Social influence → Chapter 1.1) |
  | Edexcel Business | `1 … 20` |
  | AQA Business | spec sections (3.x) |

  Data keeps the internal letters. Display uses `AIM_WORD`/`AIM_LABEL` (app), `aimWord`/`aimLabels` (guide, catalogue) and `aimTag()` (Study Hub).

## 3. Quantity bar (minimum to ship)

| Unit type | Bank | Quiz | Cards | Guide | Papers | Other |
|---|---|---|---|---|---|---|
| Exam unit | 60+ | 80+ (with explanations) | 80+ | 25 KB+, exam section first, at least 2 diagrams per aim | Every real paper, plus **6 RA10 papers** in the exact layout | `BIZ_LEVELS` for every extended tariff |
| Assignment unit | 40+ | 50+ | 50+ | 15 KB+ (aim for 16–18 KB) | — | Help for **every** criterion (`AAQ_CRIT_HELP`), `_intro`, `_tips`, group notes. **No invented sample assignments; no AI marking of drafts** |
| A-Level subject | Covers every spec code | | | Every topic with diagrams | RA10 sets mirror the real paper structure | Spec-specific AI examiner module |

`aaq-build/check_units.js` enforces the AAQ numbers. The quality dashboard audit (`?ra10catalog=1&audit=1`) measures every unit.

## 4. Content rules (constitution-level, non-negotiable)

1. **No fabricated facts.** Never present invented statistics or chart data as real. Label illustrative numbers. Ask students to cite current sources (ONS, NHS, GOV.UK, HSE…) for real-world figures.
2. **Verify every worked answer.** Recalculate every number and run every code sample. "A wrong mark scheme is worse than no question."
3. **Use the spec's own wording** where it is unusual, then explain (for example, the risk/issue definitions in Engineering Unit 4).
4. **No copied exam-board text** outside the reproduced papers themselves and the generated criteria.
5. **Name regulations correctly** and note that they change.
6. **Treat sensitive topics** factually and respectfully. Remind students about confidentiality.
7. **Add safety warnings** (`warn()`) in practical units.
8. **Write in British English:** plain, short sentences, correct terms.
9. **Off-spec flags:** past-paper questions on content removed from the current spec are flagged off-spec (Psychology 2025 spec), not deleted.
10. **RA10 papers use fictional organisations** with internally consistent data.

## 5. Quality measurement

| Signal | Source | Where it shows |
|---|---|---|
| Content audit (counts, coverage, guide depth, papers) | `unit-edu.js` audit mode | `/admin/quality` → per-unit score |
| Usage and engagement | `activity_events` via `quality_usage()` | Quality dashboard |
| Learner reports (helpful, not helpful, mistake, "was this mark fair?") | `content_feedback` via `feedback_submit()` | Quality reports inbox |
| AI-marking accuracy | Benchmark sets `admin/quality/bench/*.json` (32 AQA 7132 June 2022 senior-examiner-marked answers) | Benchmark runner |

**Score weights:** Guide 20, Questions 25, Accuracy 20, AI 15, Engagement 20.

**Open items:**

- the Psychology benchmark (the EX-S4 commentary is handwritten scans and needs transcribing);
- an Edexcel benchmark;
- Edexcel RA10 Set B;
- 2027 exam dates for Psychology and Edexcel (unknown, so none were invented).
