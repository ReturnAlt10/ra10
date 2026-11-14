# Implementation Plan (as-built): Content pipelines

| Pipeline | Folder | Stages | Checks | Playbook |
|---|---|---|---|---|
| BTEC AAQ (31 units) | `training-data/btec/level-3/aaq-build/` | `parse_spec.py`, then `parse_sam.py`, then `build_apps.py` (`SPEC_PATCHES`, `split_merged_criteria`, `V`), then hand-written content, then `write_registry.py` | `check_units.js`, `browser_test.py` | PL-01, PL-02; `PLAYBOOK.md` |
| A-Level (Psychology, Edexcel) | `training-data/a-level/alevel-build/` | `extract_text.py`, then `psych_parse.py` / `edexcel_parse.py`, then `*_spec.py`, then `make_shared.py`, then `build_alevel.py` (`SUBJECTS`, `assemble_content`, `chapterise`, `V`) | Parser validity report, `node --check`, browser | PL-03 |
| AQA Business (7132, 7138) | `training-data/a-level/aqa-build/` | `split_papers.py`, then `parse_aqa.py`, then `build_papers.py`, then `emit_papers.py`; and `parse26.py`, then `import26.py`, then `emit26.py`, `build26_content.py`, `build_alevel26.py`; plus RA10 sets `ra10_*set*.py` | Browser | PL-04, PL-05 |
| BTEC Business (Units 2, 3, 6, 7) | `training-data/btec/level-3/business/build/` | `extract_biz.py`, then `parse_u3*.py` / `parse_set.py`, then `finalize_papers.py`, then `build_units.py` | Browser | PL-02 |
| Legacy (IT, Sport, L2 IT) | `tools/gen_*.py` (historical), `training-data/BUILD-PIPELINE.md` | One-off generators | Manual | Rebuild via AAQ when the unit is redone |

**Cross-cutting tools:**

- `extract_pdf_txt.py` / `extract_pdfs.py`;
- `tools/quality/build_bench.py`;
- `enterprise/scripts/health_check.py`.

## Known gaps → roadmap

- No pipeline runs in CI. Adding `check_units.js` and the browser smoke test as PR checks is M-3.
- 11 legacy source PDFs are tracked in git (R-03, M-0).
- The legacy one-off generators should be archived (M-0).
