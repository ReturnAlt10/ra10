---
name: ra10-write-practice-papers
description: Write RA10 practice (predicted) exam papers that mirror the real exam exactly — same totals, timing, sections, tariffs and context style — with verified mark schemes and levels. Use when a unit or A-Level needs new RA10 papers (BTEC needs 6; A-Level sets of 3).
---

# Write RA10 practice papers

**Pipeline:** `enterprise/playbook/PL-05-ra10-practice-papers.md`.

## Before writing

- Open two real papers and their mark schemes for the unit (`js/papers-data.js` in the app, or the SAM). Record:
  - section names;
  - minutes;
  - total;
  - tariff mix per section;
  - context style (extracts, data tables, code, figures, information booklet).
- Build a coverage grid of spec topics × papers, so that every topic is examined at least once across the set.

## File and shape

| Family | Where |
|---|---|
| AAQ / Business | `revision/.../unit-N/js/papers-ra10.js` |
| Psychology / Edexcel | `training-data/a-level/alevel-build/content/<slug>/papers-ra10/NN_*.js`, then `build_alevel.py <slug>` |
| AQA Business | `training-data/a-level/aqa-build/ra10_*set*.py`, then `emit_papers.py` / `emit26.py` |

```js
const toBlocks = (arr) => (arr || []).map(b => typeof b === 'string' ? { t: 'p', x: b } : b);
function Q(n, ctx, parts) {            // parts: [sub, marks, text, markScheme, ctxForThisPart?]
  return parts.map((p, i) => ({ q: n, sub: p[0], marks: p[1], section: 'Q' + n, ctx: [],
    ctxb: toBlocks(i === 0 ? ctx : (p[4] || [])), text: p[2], ms: { body: p[3], levels: null } }));
}
window.BIZ_PAPERS.push({ id: '<CODE>-R01', unit, key: 'R01', source: 'ra10', spec: 'ra10', kind: 'exam', code: 'RA10',
  series, date, title, blurb, minutes, items, total });
```

- Context block types: `p`, `h`, `li`, `tbl`, `grid`, `code`, `fig`, `cap`, `stat`.
- MCQ options are appended to `text` as `"A  option"` lines.
- Use the real section names.

## Rules

- **Fictional organisations only,** with internally consistent data. Never present invented statistics as real.
- **Verify** every calculation independently and run every code listing.
- **Mark schemes** state what earns each mark. Extended answers list indicative content for both sides, with levels from `BIZ_LEVELS`.
- **No repeats:** no question may appear in two papers in the set.
- **Diagram questions follow the real paper's command words.** BTEC IT Unit 2 never asks learners to draw from scratch. The SAM uses "Complete the network diagram (Figure 1) by adding…", with "Complete" meaning add to or amend a given diagram. So:
  - give an incomplete or annotatable figure in `js/papers-figures.js` (`FIG[id]`);
  - show it in the scenario with `[[fig:id]]`;
  - set `{ diagram: true, padFig: id }` on the item, so the answer pad draws on top of it;
  - make the alt text describe exactly what is there and what is missing, because the AI Examiner reads it.
  - Use realistic detail (VLANs, subnets, ports), with public addresses from the RFC 5737 documentation ranges.
  - Escape `&` in any figure text.

## Check

- `node check_units.js <slug> <N>` (AAQ) prints the paper totals, and every total must equal the real paper.
- Browser test: open the paper, answer online, reveal the mark scheme, mark one answer with the AI Examiner, and export the PDF.
