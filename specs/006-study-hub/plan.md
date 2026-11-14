# Implementation Plan (as-built): Study Hub

## Components

| Piece | Where |
|---|---|
| App | `study-hub/index.html`, `study.js` (player `next()`, `CHECKABLE`, paths, maker, `aimTag()` for chapter labels, `codingPanel`), `study.css`, `icons.js` (`SHIcons`), `code-runner.js` (`SHCode`: Python via the Python Lab worker, JS in a blob Worker, SQL via sql.js 1.10.3) |
| Server | `supabase/functions/study-hub` actions: `plan`, `create`, `mark` (fallback only), `complete`, `assigned`, `draft`, `save-template`, `rewrite-step`, `refine`. Uses `askJson(..., {preferStrong:true})` plus a `verifySteps` pass. `CODE_LANGS` / `codingLang()` |
| Database | `study-hub.sql`: `study_lessons` (kind daily, custom, template or assigned), `study_hub_trials`, `study_hub_premium()`, `study_hub_status()`, `trg_study_lessons_guard` |
| Grounding | Hidden unit frame `?ra10catalog=1` → `ra10:catalog`. `&full=<ids>` → `ra10:questions` |
| Exam marking | Client-side `RA10.examineAnswer` (the real AI Examiner) |
| Chrome | `refresh/ra10-site-chrome.js` (real navbar); overlays `position:fixed!important` |

## Contracts

- **Premium:** `study_hub_premium()` is the only definition. Premium means tier `all_subjects`, `ultra` or `owner`; `unlimited_credits`; the owner; or a school tier or active school member.
- **Lesson step JSON:** see `CODE_PROMPT` / the generation prompt in the function. Steps that cannot be verified get `_skip`.

## Diagrams on learn cards (13 Nov 2026)

| Piece | Where |
|---|---|
| Server | `sanitiseDiagram()` validates a learn step's optional `diagram` (types `flow` (or cycle), `concept`, `table`, `network`, `breakeven`). `diagramPlan(unit, unitName)` decides which types a unit is offered: network diagrams for IT and Computing, break-even charts for Business, and flow, concept and table for everyone. The lesson prompt asks for 2–3 diagrams per lesson, and `verifySteps` checks each diagram (fix, or `null` to remove) |
| Client | `study.js` `diagramHtml()` draws diagrams from the data. The AI never draws them. The break-even point is calculated in the page from fixed costs, variable cost and price. Styles are `.sh-dg*` in `study.css` (light and dark) |
| Teacher editor | `school/school.js` keeps a step's diagram unless the teacher unticks "Keep the … on this card" |

## Known gaps

- No server-side rate limit on `create` (R-05).
- The unit dashboards are also called "Study Hub" (a naming clash; product decision).
