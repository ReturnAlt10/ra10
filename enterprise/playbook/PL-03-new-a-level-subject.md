# PL-03 — New A-Level subject

- **When:** adding an A-Level, for example AQA Sociology or OCR Economics.
- **Skill:** `.claude/skills/ra10-add-a-level-subject`.
- **Reference implementations:**
  - AQA Psychology 7182 (`psych_parse.py`, `psych_spec.py`);
  - Edexcel Business 9BS0 (`edexcel_parse.py`, `edx_spec.py`, `adapter='edexcel'`).
- **Pipeline folder:** `training-data/a-level/alevel-build/`.

## Inputs

- Every available past paper, mark scheme, insert or source booklet, and examiner report (QP/MS/INS/ER).
- The current specification.
- The spec code (for example `7192`), the board, the paper structure (papers, sections, minutes, totals) and the brand palette.

## Steps

1. **Protect copyright.** Add `training-data/a-level/<source-folder>/` to `.gitignore` *before* copying any PDFs in.
2. **Extract text.** Run `python extract_text.py`; keep the layout where you need positions.
3. **Write a parser,** `<subj>_parse.py` → `out/<slug>.papers.json`. Base it on the parser closest to the new board's layout:
   - AQA-style, text-based: `psych_parse.py`.
   - Positional (PyMuPDF), with extracts and source booklets: `edexcel_parse.py`. It is slow (about 10 minutes), so run it in the background.

   **Only emit a paper with zero problems:**
   - the total equals the official total;
   - every item has marks, a mark scheme and its context or extracts;
   - the levels reach full marks.
4. **Write a spec parser,** `<subj>_spec.py`: topic areas → subtopics with spec codes. Flag past-paper items on removed content as **off-spec** (`offspec` list) rather than deleting them.
5. **Add a `SUBJECTS['<slug>']` entry to `build_alevel.py`.** Copy an existing entry, then set:
   - identity: `name`, `short`, `board`, `code`, `qual`, `src`, `pdf`, `key`;
   - styling: `pal`;
   - structure: `aims`, `offspec`, `papers`, `sections`;
   - optional: `adapter`, `real`, `total`, and the `meta`/`cfg` text overrides.
6. **Decide the chapter labels** (`AIM_LABEL`). The data keeps the letters A–T; the UI must show chapters, never "Learning aim":
   - Psychology uses `paper.section` (`1.1`…`3.10`).
   - Edexcel uses `1…20`.
   - Choose what matches how teachers name that spec.
7. **Write the content parts** in `content/<slug>/`:
   - `bank/00_head.js … 99_tail.js` must cover **every spec code**.
   - `guide/00_head.js … 99_tail.js`: `99_tail.js` sets `aimWord:'Chapter', aimLabels: window.AIM_LABEL`.
   - `papers-ra10/`: RA10 sets that mirror the real paper structure, using fictional organisations (**PL-05**).
8. **Build.** Run `python make_shared.py` (only if the shared engines changed; bump `V`), then `python build_alevel.py <slug>`. The build:
   - assembles the parts into `js/*.js` and runs `node --check`;
   - runs `chapterise()`.
9. **Add an AI Examiner module** (**PL-07**) and route it in `supabase/functions/ai-mark/index.ts` **before** the generic and other A-Level checks.
10. **Registry and site.** Many of these steps are manual for A-Levels:
    - add a row to `refresh/ra10-units.js` (non-AAQ section);
    - check that `RA10Subjects.qualShort` / `unitBadge` handle the qualification string and code (regex `9[A-Z]{2}\d` / `7\d{3}`);
    - add the subject to the homepage subject lists in `index.html` and to the meta keywords;
    - add it to `sitemap.xml`.
11. **Benchmark** (recommended): follow **PL-08**, using the examiner reports' marked answers.
12. **Ship:** follow **PL-13** and **PL-14**. The owner deploys `ai-mark`.

## Verify (exit gate)

- [ ] The parser report shows every paper valid (for example "27/27 papers").
- [ ] `node --check` passes on every assembled file. Every spec code is covered by the bank.
- [ ] A browser run of the guide, spec, browse, practice and papers views:
  - shows "Chapter …" everywhere and never "Aim X" or "Learning aim";
  - has no console errors;
  - fits 390 px.
- [ ] The AI Examiner marks a sample 4-, 8-, 16- and 20-mark answer sensibly against the board's levels.
- [ ] Study Hub's course path shows chapters (`aimTag()`), and the quality audit lists the subject.

## Pitfalls

- **Inline PDF patching mangled escapes.** Write patch scripts to files.
- **Charts and tables swallowed by question text.** Use per-chart line ownership (see `edexcel_parse.py`).
- **Never invent statistics** (for example GDP figures) in guides or papers.
- **No exam dates:** if the board has not published dates, leave the exam calendar empty.
