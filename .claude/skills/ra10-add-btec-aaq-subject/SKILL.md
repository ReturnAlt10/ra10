---
name: ra10-add-btec-aaq-subject
description: Add a new BTEC National AAQ subject or unit to RA10 (or rebuild one) using the aaq-build pipeline — parse spec/SAM, generate unit apps, hand-write guide/bank/quiz/cards/papers/assignment help to the quality bar, register, and verify. Use when asked to add or rebuild any BTEC Level 3 AAQ subject or unit.
---

# Add a BTEC AAQ subject or unit

**Authoritative method:** `training-data/btec/level-3/aaq-build/PLAYBOOK.md`. Read it fully before starting. The enterprise summary is `enterprise/playbook/PL-01-new-btec-aaq-subject.md` (subject) and `PL-02-new-or-rebuilt-btec-unit.md` (unit).

## Non-negotiables

- Only touch the subject or unit you were asked about.
- Content must meet the bar:

  | Unit type | Bank | Quiz | Cards | Guide | Other |
  |---|---|---|---|---|---|
  | Exam unit | 60+ | 80+ | 80+ | 25 KB+ | 6 RA10 papers with totals equal to the SAM |
  | Assignment unit | 40+ | 50+ | 50+ | 16–18 KB | Help for every criterion. No invented sample assignments; no AI marking of drafts |

- **Accuracy:**
  - no fabricated statistics; label illustrative data;
  - verify every number and run every code sample;
  - no copied Pearson prose.
- Source PDFs go in the git-ignored `training-data/btec/level-3/<slug>/` (the slug ends in `-aaq`). Confirm with `git status`.
- **Do not commit or deploy** unless the owner asks.

## Procedure

```bash
cd training-data/btec/level-3/aaq-build
# new subject only: add SUBJECTS['<slug>'] (build_apps.py) and REGISTRY['<slug>'] (write_registry.py)
python parse_spec.py <slug>
python parse_sam.py
python build_apps.py <slug> [N]          # shells + stubs; never overwrites hand-written files
```

For each unit, in order:

1. Read the outline and the SAM.
2. Write `js/guide.js`.
3. Write `js/bank.js`, `js/quiz.js` and `js/cards.js`. `cards.js` must end with `B.publish()`.
4. Write `js/papers-ra10.js` (exam units) or `js/assignment-help.js` (assignment units).
5. Check:

   ```bash
   node check_units.js <slug> <N>                       # must end OK
   python -m http.server 5500 --bind 127.0.0.1          # repo root, separate terminal
   python browser_test.py <slug> <N> --shots <scratch>  # then LOOK at the screenshots
   ```

Then:

- run `python write_registry.py`;
- add the subject to `sitemap.xml`;
- bump `V` if `shared-aaq` changed, and rebuild everything;
- run `python enterprise/scripts/health_check.py`.

## Content API quick reference

```js
const B = BizBank('<CODE>', 'AAQ'); window.__BIZ_B = B; const { K } = B;      // bank.js (loads first)
K('A', 'A1 Topic', 'Explain', 2, 'Question…', ['Point (1)', 'Expansion (1)']);
const { M, TF } = window.__BIZ_B;                                                // quiz.js
M('A', 'Topic', 'Stem', 'correct', ['w1', 'w2', 'w3'], 'Why.'); TF('A', 'Topic', 'Statement', true, 'Why.');
const F = window.__BIZ_B.F; F('A', 'Front', 'Back'); window.__BIZ_B.publish();   // cards.js
```

The guide's `H.*` blocks and `S.*` diagrams are listed in PLAYBOOK §4. Watch for two common mistakes: `formula` takes a **string** note, and the series passed to `S.lines` need `{name, col, pts}`.

## Gotchas

- Patch JS only from script files or with the Edit tool; never inline heredocs (they mangle `\b` and `\n`).
- If the browser test says "RA10UnitUI is not defined", it is a slow-load flake. Rerun it first.
- Never resurrect `build_aaq.py`. It overwrote every unit's `index.html`.
