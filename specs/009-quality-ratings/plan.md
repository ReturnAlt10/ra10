# Implementation Plan (as-built): Quality ratings

| Piece | Where |
|---|---|
| Dashboard | `admin/quality/{index.html,quality.js,quality.css}` (scoring, targets per unit type, reports inbox, audit runner with three hidden frames at a time, benchmark runner, CSV export) |
| Learner UI | `revision/shared/unit-feedback.js`, lazy-loaded by `unit-ui.js` (`loadFeedback`); never in `?ra10catalog` frames; triggered by the `ra10:ai-marked` event |
| Audit | `unit-edu.js` `?ra10catalog=1&audit=1` → `ra10:audit` |
| Schema | `quality.sql`: `content_feedback`, `quality_snapshots`, `feedback_submit()`, owner RPCs `quality_usage`, `quality_feedback`, `quality_reports`, `quality_resolve`, `quality_save_snapshot`, `quality_snapshots_list` (all check `edu_is_owner()`), `quality_excluded_users()` |
| Benchmark | `tools/quality/build_bench.py` → `admin/quality/bench/*.json`; the runner uses `AqaPapers.buildQuestions` in a hidden frame |

## Gaps

- Benchmark sets exist only for AQA 7132 (32 items). Add Psychology (needs transcription) and Edexcel sets (PL-08).
- There is no scheduled benchmark run. Nightly runs with alerts are part of M-9.
