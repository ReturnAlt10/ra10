# Feature Specification: Quality ratings (owner)

**Status**: As-built (owner only)

## User Scenarios & Testing

### US1 — See which units need work (P1)

**Acceptance Scenario**

1. **Given** the owner opens `/admin/quality`, **Then** every registered unit has a score out of 100 and a "What to improve" list. The score has five parts:

   | Part | Weight |
   |---|---|
   | Guide | 20 |
   | Questions | 25 |
   | Accuracy | 20 |
   | AI | 15 |
   | Engagement | 20 |

### US2 — Learners report problems (P1)

**Acceptance Scenario**

1. **Given** a signed-in learner, **Then** they can:
   - rate a guide section as helpful or not helpful;
   - report a quiz item;
   - say whether an AI mark was fair;
   - report a mistake from the unit menu.

   Reports reach the owner's inbox, where they can be resolved.

### US3 — Audit and benchmark (P2)

**Acceptance Scenarios**

1. **Given** the owner runs the content audit, **Then** each unit's counts are measured from its live data: questions, mark schemes, command verbs, tariffs, quiz, flashcards, papers, spec coverage and guide depth.
2. **Given** the owner runs the benchmark, **Then** the AI Examiner is compared with senior-examiner marks.

## Requirements

- **FR-001**: Only the owner can read the quality data (server-checked).
- **FR-002**: Learner feedback writes are validated and rate-limited (60 per hour).
- **FR-003**: The owner's own activity is excluded from the statistics.
- **FR-004**: New units appear automatically from the registry.

## Success Criteria

- **SC-001**: Every unit has a score. Reports are triaged within 7 days.
