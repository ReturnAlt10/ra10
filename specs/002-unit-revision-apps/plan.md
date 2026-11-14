# Implementation Plan (as-built): Unit revision apps

## Technical context

Each unit is a self-contained static app under `revision/…`, loaded in the shell iframe (`ux-embedded`) or opened directly. There are three engine families, copied deliberately:

| Engine family | Used by |
|---|---|
| `revision/btec/level-3/business/shared/` | Business units 2, 3, 6, 7 (also includes the calculator) |
| `revision/btec/level-3/shared-aaq/` | 31 AAQ units (adds `aaq-assignment.*`) |
| `revision/a-level/shared-alevel/` | Psychology and Edexcel (generated from `shared-aaq` by `make_shared.py`) |

AQA Business uses `revision/a-level/shared/aqa-papers.*`. IT and L2 IT use the legacy JSON-data app.

The common UI across all 46 units is `revision/shared/unit-ui.{js,css}`, which loads `unit-edu.js` (catalogue export and assignment runner) and `unit-feedback.js` (feedback) lazily.

## Unit anatomy

The unit anatomy (generated vs hand-written files) is in [enterprise/docs/02-codebase-map.md](../../enterprise/docs/02-codebase-map.md#anatomy-of-a-generated-unit-app-aaq--a-level--business).

## Contracts

| Contract | Detail |
|---|---|
| Content API | `BizBank(code, family)` → `K`, `KL`, `M`, `TF`, `F`, `publish`. `BizGuide` → `S.*` diagrams, `H.*` blocks. `BIZ_GUIDE_DATA` |
| Papers | `BIZ_PAPERS` (paper objects), `BIZ_LEVELS`, `BIZ_FIGURES` |
| Unit UI | `RA10UnitUI.{go, destinations, openGuideSection, guideHeadings, …}` |
| Catalogue export (postMessage) | `ra10:catalog`, `ra10:questions` (`&full=<ids>`), `ra10:audit` (`&audit=1`) |
| Display labels | A-Level `AIM_WORD`/`AIM_LABEL` in `cfg.js`; `chapterise()` rewrites the app strings |

## Verification

- `aaq-build/check_units.js` (counts, syntax, paper totals, guide size, criterion help).
- `aaq-build/browser_test.py` (all views, console errors, 390 px).
- `enterprise/scripts/health_check.py` (registry, syntax, corruption, cache tokens).

## Known gaps

- **Three engine copies** (R-15) and **manual `?v=` bumps** (R-14). Both are addressed by M-6.
- **Fixed 12 Nov 2026:** a corrupted `\b` (backspace byte) in all three `biz-papers.js` copies stopped the "draw a diagram" answer placeholder from appearing.
- **Fixed 12 Nov 2026:** about 180 double-encoded dashes in the IT Unit 2/3 and booklet data.
