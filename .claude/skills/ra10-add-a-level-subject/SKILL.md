---
name: ra10-add-a-level-subject
description: Add a new A-Level subject to RA10 with the alevel-build pipeline — parse every past paper/mark scheme into exact exam format, parse the spec, write content parts (bank/guide/RA10 papers), build the app with chapter numbering, add an AI Examiner module, register it. Use for any new A-Level (AQA, Edexcel, OCR…) or for rebuilding Psychology / Edexcel Business.
---

# Add an A-Level subject

**Read first:** `enterprise/playbook/PL-03-new-a-level-subject.md`.

**Reference code** (`training-data/a-level/alevel-build/`):

| Script | Covers |
|---|---|
| `psych_parse.py` / `psych_spec.py` | AQA, text-based |
| `edexcel_parse.py` / `edx_spec.py` | Positional, extracts, source booklets |
| `build_alevel.py` | `SUBJECTS` config, `chapterise()`, `assemble_content()` |
| `make_shared.py` | Shared engines with asserted patches |

## Rules

- **Copyright:** add the source folder to `.gitignore` *before* copying in any PDFs.
- **Valid papers only:** a paper is emitted only when its total equals the official total, every item has marks, a mark scheme and its extracts, and its levels reach full marks.
- **Off-spec:** flag past-paper items on removed spec content as off-spec; do not delete them.
- **Chapters, not aims:** A-Levels display **chapters**, never "Learning aim". Set `AIM_LABEL` per subject (Psychology `1.1…3.10`, Edexcel `1…20`). The guide tail sets `aimWord:'Chapter', aimLabels: window.AIM_LABEL`.
- **No invented statistics.** RA10 papers use fictional organisations with consistent data, and every calculation is verified.
- **Never hand-edit `revision/a-level/<slug>/js/*`.** Edit `content/<slug>/**/NN_*.js` and rebuild.

## Procedure

```bash
cd training-data/a-level/alevel-build
python extract_text.py                       # PDFs → text (sources git-ignored)
python <subj>_parse.py                       # → out/<slug>.papers.json (report must show all papers valid)
python <subj>_spec.py                        # → spec topics/subtopics
# add SUBJECTS['<slug>'] in build_alevel.py (copy psychology / business-edexcel entry)
# write content/<slug>/{bank,guide,papers-ra10}/00_head.js … 99_tail.js
python make_shared.py                        # only if shared engines changed (then bump V)
python build_alevel.py <slug>                # assembles, node --check, chapterise
```

Then:

1. **AI Examiner:** follow the `ra10-ai-examiner-module` skill, and route the module early in `ai-mark/index.ts`.
2. **Registry and site:** add the row to `refresh/ra10-units.js` (non-AAQ section) and check the `RA10Subjects.qualShort` / `unitBadge` regexes. Update the homepage subject lists and meta in `index.html`, and `sitemap.xml`.
3. **Browser check:** test every view at 1280 px and 390 px. Scan for leftover BTEC wording:

   ```js
   document.body.innerText.match(/\blearning aims?\b|\baims? [A-T]\b/gi)   // must be empty (content words like "aims to" are fine)
   ```

4. **Study Hub:** confirm the course path shows "Chapter …" (`aimTag()` in `study-hub/study.js`).
