# PL-05 — Write RA10 practice papers

- **When:** a unit needs more practice papers. The minimum is 6 for BTEC exam units; A-Levels have sets of 3 papers (Set A, Set B…).
- **Skill:** `.claude/skills/ra10-write-practice-papers`.

## Rules

- **Mirror the exam exactly:** the same total marks, time, sections, question styles, tariff mix and context style (extracts, data, code, figures).
- **Spread the specification** across the set. No question may be repeated between papers.
- **Use fictional organisations and people** with internally consistent data. Never present invented statistics as real.
- **Verify every number.** Recompute every calculation by hand or in code. Run every code listing.
- **Mark schemes say exactly what earns each mark.** For extended answers, list indicative content for **both sides** of the argument and use levels from `BIZ_LEVELS`.

## Where they live

| Family | File | Shape |
|---|---|---|
| AAQ / BTEC Business | `revision/.../unit-N/js/papers-ra10.js` | `Q(n, ctx, parts)` helper → items; push `{id:'<CODE>-R01', source:'ra10', kind:'exam', minutes, total, items…}` onto `window.BIZ_PAPERS` |
| Psychology / Edexcel | `training-data/a-level/alevel-build/content/<slug>/papers-ra10/NN_*.js` | Same paper object, assembled by `build_alevel.py` |
| AQA Business 7132 / 7138 | `aqa-build/ra10_set_*.py`, `ra10_26_set_*.py` → `emit_papers.py` / `emit26.py` | Python data, emitted to `papers-data.js` |

**Item shape:** `{q, sub, marks, section, ctx:[], ctxb:[blocks], text, ms:{body, levels}}`.

**Context block types (`ctxb`):** `p`, `h`, `li`, `tbl`, `grid`, `code`, `fig`, `cap`, `stat`.

**MCQ options:** append them to `text` as `"A  option"` lines.

## Steps

1. Read two real papers and their mark schemes for the unit. Write down the section names, tariffs per section, total and minutes.
2. Draft a coverage grid: spec topic × paper, so that each topic is examined at least once across the set.
3. Write the papers.
4. **Self-check pass.** Recalculate every number and re-read every mark scheme against its question.
5. Rebuild if the family is assembled (A-Level) or emitted (AQA).
6. Run `node check_units.js <slug> <N>` (AAQ), which prints the totals per paper. Or open the papers view and confirm the totals.
7. Browser-check one paper end to end:
   - answer it online;
   - reveal the mark scheme;
   - mark it with the AI Examiner;
   - export the PDF.

## Verify

- [ ] Every paper total equals the real paper's total.
- [ ] Each topic is covered at least once across the set, and no question is duplicated.
- [ ] Every calculation is independently verified, and every code listing runs.
