# RA10 — notes for AI coding assistants

RA10 (ra10.co.uk) is a BTEC and A-Level revision platform. It is a static HTML/JS site on GitHub Pages with a Supabase backend, and has **no build step**.

**Start with `enterprise/README.md`.** It links the architecture docs, data model, risk register, playbook (`enterprise/playbook/`), specs (`specs/`), constitution (`.specify/memory/constitution.md`) and skills (`.claude/skills/`).

## Rules

- **Do not commit, push, run production SQL, deploy edge functions or post announcements unless the owner asks.** Pushing to `main` deploys production.
- **Never hand-edit generated files.** Change the generator or the authored content parts and rebuild (`enterprise/playbook/PL-00-conventions.md`).
- **No fabricated facts or statistics in learning content.** Verify every number and run every code sample. Exam-board PDFs never go into git.
- **A-Levels display "Chapter …"** (via `AIM_LABEL`). **BTEC displays "Learning aim …".**
- **Patch JS/TS only with the Edit tool or script files,** never inline heredocs (they mangle `\b` and `\n`). Run `node --check` afterwards.
- **Bump `?v=` / `V` cache tokens** when shared assets change.
- **Before calling work done,** run `python enterprise/scripts/health_check.py` (0 FAIL) and verify in a real browser at 390 px and in dark mode.
- **Touch only what the task needs.** Other subjects' content is hand-verified.
