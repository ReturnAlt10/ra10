# RA10 — Enterprise Handover Pack

**Start here.** This folder is the single entry point for an engineer taking over RA10 (ra10.co.uk). It holds the system documentation, specifications, playbooks, skills and checks needed to work on the platform safely. It was written from a full read of the repository on 12 November 2026.

RA10 is a revision platform for UK BTEC (Level 2 and Level 3, including the 2025 AAQ specifications) and A-Level students. It has:

- 46 unit revision apps;
- an AI Examiner that marks exam answers;
- AI daily lessons (Study Hub);
- XP, a leaderboard and community forums;
- credits and billing;
- a schools/EDU platform.

---

## What is where

| You want to… | Go to |
|---|---|
| Understand the system in 15 minutes | [docs/01-architecture.md](docs/01-architecture.md) |
| Find a file or a folder's purpose | [docs/02-codebase-map.md](docs/02-codebase-map.md) |
| Understand the database | [docs/03-data-model.md](docs/03-data-model.md) |
| Call or change a backend (edge) function | [docs/04-backend-api.md](docs/04-backend-api.md) |
| Understand the browser runtime (shell, unit apps, globals, message protocols) | [docs/05-frontend-runtime.md](docs/05-frontend-runtime.md) |
| Learn the content model and quality rules | [docs/06-content-model.md](docs/06-content-model.md) |
| See what is risky before you touch production | [docs/07-security-and-risk-register.md](docs/07-security-and-risk-register.md) |
| Plan the enterprise migration | [docs/08-enterprise-migration-roadmap.md](docs/08-enterprise-migration-roadmap.md) |
| Deploy, run SQL, rotate secrets, handle incidents | [docs/09-operations-runbook.md](docs/09-operations-runbook.md) |
| Look up an RA10 term (AAQ, SAM, aim, K/M/TF/F…) | [docs/10-glossary.md](docs/10-glossary.md) |
| **Add data: a subject, unit, papers, a feature…** | [playbook/README.md](playbook/README.md), with 18 step-by-step pipelines |
| Read the product specification (SpecKit) | [../specs/README.md](../specs/README.md) and [../.specify/memory/constitution.md](../.specify/memory/constitution.md) |
| Use Claude Code skills for repeatable jobs | [../.claude/skills/](../.claude/skills/), indexed in [skills-index.md](skills-index.md) |
| Run the repository health check | `python enterprise/scripts/health_check.py`, described in [scripts/README.md](scripts/README.md) |

## Where things live (and why they are not all in this folder)

Some tools only work when their files are in a fixed place, so the pack is spread over four locations:

```
enterprise/            ← this hub: docs, playbook, scripts (human-first)
specs/                 ← SpecKit feature specifications (spec.md + plan.md per feature)
.specify/              ← SpecKit project memory (constitution) and templates
.claude/skills/        ← Claude Code skills (auto-discovered by Claude Code)
CLAUDE.md              ← short orientation file read by AI coding assistants
```

None of these folders are published to the live site: the GitHub Pages workflow excludes them.

## Reading order for a new engineer (day 1)

1. [01-architecture.md](docs/01-architecture.md) and [07-security-and-risk-register.md](docs/07-security-and-risk-register.md). Know the risks before changing anything.
2. [.specify/memory/constitution.md](../.specify/memory/constitution.md), the non-negotiable rules (content accuracy, copyright, owner approval).
3. [specs/000-platform/spec.md](../specs/000-platform/spec.md), the whole product on one page.
4. [playbook/README.md](playbook/README.md). Skim it now, and follow it exactly when you add anything.
5. Run `python enterprise/scripts/health_check.py`. It should finish with zero failures.

## The five rules you must not break

1. **Never present fabricated facts or statistics as real** in learning content. Illustrative numbers are labelled. Every worked answer is verified.
2. **Copyrighted exam-board material (Pearson, AQA) never goes into git or onto the site** beyond the generated, transformed data the apps already use. See risk R-03.
3. **Production changes need the owner's approval.** That covers SQL, edge-function deploys, Stripe and announcements. The owner runs SQL by hand in the Supabase SQL editor today.
4. **Never hand-edit generated files.** Change the generator or content parts and rebuild (see playbook PL-00).
5. **Bump cache-busting versions** (`?v=` / `V`) whenever you change a shared JS or CSS file. Otherwise users keep the old file.

## Status snapshot (12 Nov 2026)

| Area | State |
|---|---|
| Hosting | Static site on GitHub Pages (custom domain via `CNAME`); backend is Supabase project `tcrrgsylxbyyrmnouihl` |
| Payments | **Paused.** `TRANSITION_MODE = true` in `ra10-sdk.js`: every signed-in user gets unlimited credits |
| Schools / EDU | Built but not public ("coming soon") |
| Tests | No automated unit tests. Content checkers (`check_units.js`) and Playwright smoke tests (`browser_test.py`) exist for the build pipelines |
| CI | One workflow: deploy to Pages on push to `main`. No lint, test or schema checks |
| Database schema | Only partly in git. Core tables (`profiles`, `schools`, `school_members`…) were created in the dashboard. See risk R-01 |
