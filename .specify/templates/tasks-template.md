# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story this belongs to (US1, US2…)
- Include exact file paths

## Phase 1: Setup

- [ ] T001 …

## Phase 2: Foundational (blocking)

- [ ] T00X …

## Phase 3: User Story 1 (P1)

**Goal**: …  **Independent Test**: …

- [ ] T0XX [US1] …

## Phase N: Polish & Release

- [ ] T0XX Run `python enterprise/scripts/health_check.py` (0 FAIL)
- [ ] T0XX Bump cache tokens (playbook PL-13)
- [ ] T0XX News article (PL-14)
