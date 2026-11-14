# RA10 Specifications (SpecKit)

These follow the [GitHub Spec Kit](https://github.com/github/spec-kit) layout.

- **Constitution:** [`.specify/memory/constitution.md`](../.specify/memory/constitution.md).
- **Templates:** [`.specify/templates/`](../.specify/templates/).
- **Per feature:**
  - `spec.md` says **what** the feature does and **why**, for users. It is technology-agnostic.
  - `plan.md` says **how** RA10 implements it today (as-built), with the contracts and known gaps.
  - `tasks.md` is present only where work is planned.

**Status values:**

- **As-built:** the spec describes the live system, reverse-engineered on 12 Nov 2026.
- **Built (not public):** finished but not launched.
- **Planned:** new work.

| # | Feature | Status | Spec | Plan |
|---|---|---|---|---|
| 000 | Platform overview (whole product) | As-built | [spec](000-platform/spec.md) | — |
| 001 | Shell, navigation and routing | As-built | [spec](001-shell-navigation/spec.md) | [plan](001-shell-navigation/plan.md) |
| 002 | Unit revision apps (guide, practice, papers) | As-built | [spec](002-unit-revision-apps/spec.md) | [plan](002-unit-revision-apps/plan.md) |
| 003 | AI Examiner and AI Assigner | As-built | [spec](003-ai-examiner/spec.md) | [plan](003-ai-examiner/plan.md) |
| 004 | Accounts, tiers, credits and billing | As-built (payments paused) | [spec](004-accounts-billing/spec.md) | [plan](004-accounts-billing/plan.md) |
| 005 | XP, streaks and leaderboard | As-built | [spec](005-xp-leaderboard/spec.md) | [plan](005-xp-leaderboard/plan.md) |
| 006 | Study Hub (AI lessons) | As-built | [spec](006-study-hub/spec.md) | [plan](006-study-hub/plan.md) |
| 007 | Community (forums, apps, moderation) | As-built | [spec](007-community/spec.md) | [plan](007-community/plan.md) |
| 008 | Schools / EDU | Built (not public) | [spec](008-edu-schools/spec.md) | [plan](008-edu-schools/plan.md) |
| 009 | Quality ratings (owner) | As-built | [spec](009-quality-ratings/spec.md) | [plan](009-quality-ratings/plan.md) |
| 010 | Python Lab | As-built | [spec](010-python-lab/spec.md) | [plan](010-python-lab/plan.md) |
| 011 | Content pipelines | As-built | [spec](011-content-pipelines/spec.md) | [plan](011-content-pipelines/plan.md) |
| 012 | Legal, privacy and safety | As-built | [spec](012-legal-privacy/spec.md) | [plan](012-legal-privacy/plan.md) |
| 013 | AI study tools (coach, AJIM, Blurt & Grill, Part A/B simulator, Bug Hunt, scanner, spec-gap task) | As-built | [spec](013-ai-study-tools/spec.md) | [plan](013-ai-study-tools/plan.md) |
| 100 | Enterprise hardening | **Planned** | [spec](100-enterprise-hardening/spec.md) | [plan](100-enterprise-hardening/plan.md) · [tasks](100-enterprise-hardening/tasks.md) |

## Working with Spec Kit

New features follow the Spec Kit flow (`/speckit.specify`, then `/speckit.plan`, then `/speckit.tasks`, then implement). Number new features from `013` upwards, and check every plan against the constitution's quality gates.

The CLI is optional: you can copy the templates by hand. If you use the CLI, initialise it in this repo with `specify init --here`. **Keep the existing `.specify/memory/constitution.md`** when it asks to overwrite.
