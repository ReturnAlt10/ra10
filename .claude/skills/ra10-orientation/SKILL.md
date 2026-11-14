---
name: ra10-orientation
description: Orient in the RA10 codebase fast — where things live, which file is generated vs hand-written, the global JS contracts, the owner-approval rules and where the enterprise docs/playbook/specs are. Use at the start of any RA10 task when unsure where to make a change.
---

# RA10 orientation

**Start at `enterprise/README.md`.** Then use this map to pick the right document.

| Question | Read |
|---|---|
| How does it fit together? | `enterprise/docs/01-architecture.md` |
| Where is file X / what is folder Y? | `enterprise/docs/02-codebase-map.md` |
| Which table or RPC? | `enterprise/docs/03-data-model.md` |
| Which edge function? | `enterprise/docs/04-backend-api.md` |
| Which JS global, event or postMessage? | `enterprise/docs/05-frontend-runtime.md` |
| Content format and rules | `enterprise/docs/06-content-model.md` |
| What is risky? | `enterprise/docs/07-security-and-risk-register.md` |
| How do I add X? | `enterprise/playbook/README.md` (decision tree) |
| What should the feature do? | `specs/<NNN-feature>/spec.md`; technical plan in `plan.md` |
| Rules that never bend | `.specify/memory/constitution.md` |

## Golden rules

1. **Do not commit, push, run production SQL, deploy functions or post announcements** unless the owner asks. Pushing to `main` deploys.
2. **Never hand-edit generated files** (unit shells, `spec.js`, `papers-data.js`, A-Level assembled `js/*`, `shared-alevel`, the registry AAQ block).
3. **No fabricated facts** in content, and no exam-board PDFs in git.
4. **Bump cache tokens** when shared assets change.
5. **Patch JS safely** (see the `ra10-safe-js-patching` skill).
6. **Touch only what the task needs.** Other subjects' content is hand-verified.

## Quick facts

- Static site on GitHub Pages; Supabase project `tcrrgsylxbyyrmnouihl`; no build step.
- 46 unit apps, all listed in `refresh/ra10-units.js`.
- Payments are paused (`TRANSITION_MODE = true` in `ra10-sdk.js`).
- A-Levels show "Chapter N" (data keeps the aim letters; display uses `AIM_LABEL`). BTEC shows "Learning aim A".
- Repo health check: `python enterprise/scripts/health_check.py`.
