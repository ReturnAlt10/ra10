# PL-04 — Add a new exam series (newly released real papers)

**When:** the exam board releases a new series of past papers. For AQA and Edexcel this usually happens about a year after the exam. For BTEC AAQ it may be a new SAM or live paper.

## Where real papers live per family

| Family | Generated file | Producer |
|---|---|---|
| AQA Business 7132 | `revision/a-level/business-2023/js/papers-data.js` | `aqa-build/split_papers.py` → `parse_aqa.py` → `build_papers.py` → `emit_papers.py` |
| AQA Business 7138 | `revision/a-level/business-2026/js/papers-data.js` | `aqa-build/parse26.py` → `import26.py` → `emit26.py` |
| AQA Psychology 7182 | `revision/a-level/psychology/js/papers-data.js` | `alevel-build/psych_parse.py` → `build_alevel.py psychology` |
| Edexcel Business 9BS0 | `revision/a-level/business-edexcel/js/papers-data.js` | `alevel-build/edexcel_parse.py` → `build_alevel.py business-edexcel` |
| BTEC Business (Units 2, 3, 6, 7) | `revision/btec/level-3/business/unit-N/js/papers-data.js` | `business/build/parse_u3*.py` / `parse_set.py` → `finalize_papers.py` |
| BTEC AAQ | `revision/btec/level-3/<slug>/unit-N/js/papers-data.js` | `aaq-build/parse_sam.py` → `build_apps.py` |

## Steps

1. Copy the new QP, MS, inserts and ER into the subject's **git-ignored** source folder. Check this with `git status`: no PDFs should appear.
2. Extract the text (`extract_text.py` / `extract_biz.py` / `extract_pdf_txt.py`).
3. Rerun the parser for that family. Fix any layout change in the parser rather than in the output. **A paper is only emitted when it validates:**
   - the totals match;
   - every item has a mark scheme;
   - the levels reach full marks.
4. Update the spec mapping if the series added new topics. Mark questions on removed content as off-spec.
5. Rebuild the app (the commands are in the table above) and bump the version tokens if shared engines changed.
6. Browser-check the new paper:
   - it renders in the exam layout;
   - figures and extracts are present;
   - answer-online works;
   - the AI Examiner works on one question;
   - the PDF export works.
7. Update the unit's marketing copy if it states a year range (for example "2017–2025"). This may live in `SUBJECTS[...].meta` or in `index.html`.
8. Ship (**PL-13**). Optionally post News (**PL-14**): "June 2026 papers added".

## Verify

- [ ] The parser report shows the new paper as valid, with no regression in the paper count.
- [ ] `git ls-files | grep -i pdf` shows nothing new.
- [ ] The quality audit for the unit shows the higher real-paper count.
