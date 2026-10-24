# AQA A-level Business build pipeline

Source PDFs/text live in the git-ignored `training-data/a-level/aqa-business-2023|2026/` (text extracted to `text/`).

- `split_papers.py`, `parse_aqa.py`, `build_papers.py` → `out/aqa_papers_raw.json` (7132 papers 2020-2024 + 2025 QP/MS).
- `import_pp27.py`, `import_extra.py` (+ `ra10_set_d.py`, `ra10_set_e.py`) → RA10 practice papers for 7132.
- `emit_papers.py <target>` → `revision/a-level/business-2023/js/papers-data.js`.
- `parse26.py`, `import26.py` (+ `ra10_26_set_*.py`), `emit26.py` → `revision/a-level/business-2026/js/papers-data.js` (7138 sample + RA10 papers).
- `build26_content.py` → 2026 quiz/cards; `build_alevel26.py` → 2026 app shell (index/css/app/data-loader).
- Shared engine: `revision/a-level/shared/aqa-papers.{js,css}`; shared unit UI: `revision/shared/unit-ui.{js,css}`.
- Bash heredocs mangle backslashes: write Python/JS with regexes via the Write tool.
