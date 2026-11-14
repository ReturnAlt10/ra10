# Feature Specification: RA10 Platform (overview)

**Status**: As-built (12 Nov 2026)  **Owner**: RA10 owner  **Domain**: ra10.co.uk

## Purpose

RA10 helps UK students pass BTEC (Level 2 and Level 3, including the 2025 AAQ specifications) and A-Level exams and assignments. It gives every unit an exam-faithful revision app, AI marking against official mark schemes, AI daily lessons, gamified motivation and teacher tools.

## Users

| Persona | Goal |
|---|---|
| **Student (guest)** | Try revision content and see what RA10 offers |
| **Student (signed in)** | Revise units, practise real and RA10 papers, get AI marking, track progress, earn XP, use Study Hub |
| **Teacher** *(not public yet)* | Set assignments, see class progress, get AI insights |
| **School admin** *(not public yet)* | Set up the school, invite staff and students, manage entitlements |
| **Community moderator** | Keep the forums safe |
| **Owner** | Run the platform: content quality, announcements, moderation, roles, billing |

## Capability map

| # | Capability | Spec |
|---|---|---|
| 1 | Find a subject or unit quickly (navbar finder, subject pages, homepage dashboard) | [001](../001-shell-navigation/spec.md) |
| 2 | Revise a unit: guide, specification, flashcards, quiz, question bank, past papers, RA10 papers, assignment help | [002](../002-unit-revision-apps/spec.md) |
| 3 | Get exam answers marked by an AI Examiner, and coursework guidance from an AI Assigner | [003](../003-ai-examiner/spec.md) |
| 4 | Accounts, plans, credits and payments | [004](../004-accounts-billing/spec.md) |
| 5 | XP, streaks, weekly leaderboard, boosts, podium | [005](../005-xp-leaderboard/spec.md) |
| 6 | Personalised AI daily lessons with verified answers | [006](../006-study-hub/spec.md) |
| 7 | Forums and a study-app library with moderation | [007](../007-community/spec.md) |
| 8 | Schools, classes, assignments and analytics | [008](../008-edu-schools/spec.md) |
| 9 | Owner content-quality ratings | [009](../009-quality-ratings/spec.md) |
| 10 | In-browser Python practice | [010](../010-python-lab/spec.md) |
| 11 | Turning exam-board sources into apps | [011](../011-content-pipelines/spec.md) |
| 12 | Terms, privacy, safety | [012](../012-legal-privacy/spec.md) |

## Catalogue (as of 12 Nov 2026)

46 unit apps:

| Qualification | Units |
|---|---|
| BTEC L3 IT AAQ | 4 |
| BTEC L3 Business | 4 |
| BTEC L3 Sport | 2 |
| BTEC L3 Computing AAQ | 4 |
| BTEC L3 Construction AAQ | 6 |
| BTEC L3 Early Childhood Development AAQ | 4 |
| BTEC L3 Engineering AAQ | 4 |
| BTEC L3 Health and Social Care AAQ | 7 |
| BTEC L3 Medical Science AAQ | 6 |
| BTEC L2 IT | 1 |
| AQA A-Level Business 7132 | 1 |
| AQA A-Level Business 7138 | 1 |
| AQA A-Level Psychology 7182 | 1 |
| Pearson Edexcel A-Level Business 9BS0 | 1 |

## Platform-wide requirements

- **FR-P01**: Every unit MUST be reachable at a clean public URL (for example `/btec/level-3/sport/unit-1`), and deep links MUST load directly.
- **FR-P02**: Every page MUST work from 390 px phone width to desktop without horizontal scrolling, in light and dark themes.
- **FR-P03**: Learning content MUST meet the constitution's accuracy and exam-fidelity principles.
- **FR-P04**: AI features MUST require sign-in and acceptance of the current terms.
- **FR-P05**: Entitlements (tier, credits, roles, XP) MUST only change through server-side logic.
- **FR-P06**: Learning activity MUST be recorded per user, so that progress, XP integrity and teacher views can use it.
- **FR-P07**: The owner MUST be able to publish a site-wide announcement and release notes (News).

## Success criteria

- **SC-P01**: A student can go from the homepage to any unit's practice questions in 3 clicks or fewer.
- **SC-P02**: There are zero known factual errors in shipped content. Learner reports are triaged within 7 days.
- **SC-P03**: AI Examiner marks are within ±1 level of senior-examiner marks on at least 80% of the benchmark items.
- **SC-P04**: There are no console errors on any unit view in the release smoke test.
