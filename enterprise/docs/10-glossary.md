# 10 — Glossary

| Term | Meaning |
|---|---|
| **AAQ** | Alternative Academic Qualification: the 2025 redesign of BTEC Nationals (Pearson). AAQ subject folders end in `-aaq` |
| **Aim / learning aim** | A BTEC unit's top-level content area (A, B, C…). A-Level units use **chapters** for display (Psychology 1.1–3.10) while the data keeps the aim letters |
| **Assignment unit / set task** | An internally assessed BTEC unit (coursework) or an externally set task. RA10 never AI-marks assignment drafts |
| **AI Examiner** | The `ai-mark` edge function plus spec-specific examiner modules. It marks exam answers against mark schemes and level descriptors |
| **AI Assigner / Helper** | The `ai-assign` edge function: hints and coursework coaching |
| **Catalogue frame** | A unit app loaded hidden with `?ra10catalog=1`, which posts its content (`ra10:catalog`) to the parent |
| **Chapter label** | `AIM_LABEL` mapping (for example `{A:'1.1'}`) used to display A-Level chapters |
| **Command verb** | State, Explain, Analyse, Evaluate, Discuss…; it drives the tariff and marking style |
| **Credits** | The usage currency for AI and premium actions (`ACTION_COSTS`). Tiers grant monthly credits. Currently unlimited (`TRANSITION_MODE`) |
| **EDU** | The schools platform: schools, classes, assignments and teacher analytics. Not yet public |
| **Engine (`biz-*`)** | Shared JS libraries: `biz-bank` (content API), `biz-guide` (guide and diagrams), `biz-papers` (papers, exam mode, PDF, AI hooks) |
| **K / KL / M / TF / F** | Content API calls: knowledge check (points / levels), multiple choice, true/false, flashcard |
| **Kind** | Unit kind in the registry: `Exam`, `Coursework`, `Set task` |
| **Levels / `BIZ_LEVELS`** | Level-of-response descriptors for extended answers (6, 9, 12, 16, 20, 25 marks…) |
| **Off-spec** | A past-paper question on content removed from the current specification. It is flagged, not deleted |
| **Owner** | The site owner account. Today it is identified by email (R-07) |
| **Premium (Study Hub)** | Whoever `study_hub_premium()` returns true for |
| **PSAB** | Pearson Set Assignment Brief (copyrighted; never committed) |
| **RA10 paper** | An original practice paper written by RA10 in the exact layout of the real exam (`source:'ra10'`) |
| **Registry** | `refresh/ra10-units.js`, the single list of unit apps |
| **SAM** | Sample Assessment Material (a specimen paper and mark scheme) published by the exam board |
| **Shell** | The SPA at `index.html` + `refresh/site.js` that hosts navigation and embeds unit apps |
| **Spec code** | Exam-board qualification code: 7132 / 7138 (AQA Business), 7182 (AQA Psychology), 9BS0 (Edexcel Business) |
| **Study Hub** | (1) `/study-hub`: AI daily lessons. (2) The unit dashboards are also titled "Study Hub" (a known naming clash) |
| **Tariff** | The number of marks a question carries |
| **Transition mode** | `TRANSITION_MODE = true` in the SDK: payments paused, everyone signed in gets unlimited use |
| **`V` / `?v=`** | Manual cache-busting version tokens |
| **XP** | Experience points for learning. Awarded only through `increment_xp()` with anti-farm guards |
