# PL-06 — Expand or fix content in an existing unit

- **When:** you need more questions, a guide topic needs improving, a learner has reported a mistake (quality inbox), or the audit shows a gap.
- **Skill:** `.claude/skills/ra10-content-authoring`.

## Find the right file

| Family | Edit here | Then |
|---|---|---|
| AAQ / Business / Sport | `revision/.../unit-N/js/{bank,quiz,cards,guide}.js` | Nothing to rebuild (no cache token on unit content). Check `node --check` |
| Psychology / Edexcel | `training-data/a-level/alevel-build/content/<slug>/{bank,guide}/NN_*.js` | `python build_alevel.py <slug>` |
| AQA Business 7138 quiz/cards | `aqa-build/build26_content.py` | Run it |
| IT legacy / L2 IT | `data/*.json` in the unit | Validate the JSON |

## Steps

1. **Triage the request.**
   - For a reported mistake, open `/admin/quality` → Reports and read the item and the learner's note.
   - Confirm the error against the specification or the official mark scheme.
2. **Make the change** using the content API (`K`, `KL`, `M`, `TF`, `F`, guide `H.*` / `S.*`). See [06-content-model.md](../docs/06-content-model.md).
3. **Keep the bar:**
   - plausible distractors;
   - an explanation on every quiz item;
   - mark points in exam-board style ("(1)" per creditable point).
4. **Check syntax.** Run `node --check <file>`. For AAQ, also run `node check_units.js <slug> <N>`.
5. **Check in the browser.** Open the view you changed and the practice view. Confirm the new items appear and that the filters show the chapter or aim name.
6. **Close the loop.** If the change came from a learner report, resolve it in the quality inbox (`quality_resolve`).

## Verify

- [ ] No syntax errors, and the counts are not lower than before (`check_units.js`).
- [ ] Facts and numbers are verified, with no fabricated statistics.
- [ ] The quality report is marked resolved.
