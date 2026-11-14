---
name: ra10-content-authoring
description: Write or fix RA10 learning content (knowledge-bank questions with mark schemes, multiple-choice/true-false quiz items, flashcards, revision-guide topics with diagrams) using the BizBank K/M/TF/F and BizGuide S/H APIs, to the RA10 accuracy rules. Use when adding questions, expanding a unit, or fixing a reported content mistake.
---

# RA10 content authoring

- Content model and rules: `enterprise/docs/06-content-model.md`.
- Pipeline: `enterprise/playbook/PL-06-expand-unit-content.md`.

## Find the file

| Family | Edit | Rebuild |
|---|---|---|
| AAQ / Business / Sport | `revision/.../unit-N/js/{bank,quiz,cards,guide}.js` | none (`node --check`) |
| Psychology / Edexcel | `training-data/a-level/alevel-build/content/<slug>/{bank,guide}/NN_*.js` | `python build_alevel.py <slug>` |
| IT legacy, L2 IT | `revision/.../data/*.json` | Validate the JSON |

## APIs

```js
K(aim, 'A1 Topic', 'Explain', 2, 'Question with a named scenario…', ['Creditable point (1)', 'Linked expansion (1)']);
KL(aim, topic, verb, marks, question, …)                       // levels-marked extended response
M(aim, topic, 'Stem', 'correct', ['plausible wrong 1', 'plausible wrong 2', 'plausible wrong 3'], 'One-line why.');
TF(aim, topic, 'Statement', true, 'Why.');
F(aim, 'Front (term)', 'Back (definition / formula / example)');
```

### Guide blocks

`H.key`, `tip`, `warn`, `example`, `formula(label, expr, noteString)`, `table(headers, rows)`, `ul`, `ol`, `two`, `stats`, `check`, `code(lines, caption)`, `fig(svg, caption)`.

### Diagrams

`S.flow`, `ladder`, `cycle`, `tiles`, `matrix`, `bars`, `lines([{name, col, pts}])`, `pie`, `pyramid`, `gantt`, `tree`, `venn`, `funnel`, `spectrum`, `org`, `breakEven`, `fiveForces`, `plc`.

### Topic pattern

Write every guide topic in this order:

1. plain-English explanation;
2. diagram;
3. table or key terms;
4. worked example on a scenario;
5. exam tip or common mistake.

## Rules (constitution)

1. **No fabricated facts or statistics.** Label illustrative numbers ("illustrative figures"). Ask students to cite current sources for real-world data.
2. **Recompute every number and run every code sample.** A wrong mark scheme is worse than none.
3. **Use the spec's own wording** where it is unusual, then explain.
4. **No copied exam-board text.** Write in British English, plainly.
5. **Quiz items:**
   - distractors are real terms from the same topic, never jokes;
   - every item has an explanation;
   - mark points use "(1)" per creditable point.
6. **Labels:** BTEC uses "Learning aim A…"; A-Level uses "Chapter …" (via `AIM_LABEL`, never hard-coded).

## Check

- Run `node --check <file>`. For AAQ, run `node training-data/btec/level-3/aaq-build/check_units.js <slug> <N>`; the counts must not go down.
- Check that the patch did not mangle escapes: `grep -lP '\x08' <file>` must print nothing.
- Open the unit (`python -m http.server 5500`) and view the changed topic or practice items. Check that the filters show the chapter or aim names.
- If the fix came from a learner report, resolve it in `/admin/quality`.
