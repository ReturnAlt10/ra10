# Feature Specification: Study Hub (AI lessons)

**Status**: As-built (Premium; one free trial lesson)

## User Scenarios & Testing

### US1 — Today's lesson (P1)

**Acceptance Scenarios**

1. **Given** a Premium student, **When** they open Study Hub, **Then** they get a short daily lesson. It is built from their recent activity (strengths, gaps, focus) and grounded in their unit's real question bank and specification.
2. **Given** the lesson player, **Then** steps include learn, multiple choice, true/false, fill-in, match, order, an exam question (marked by the real AI Examiner), recap and, for coding units, a code step. Wrong answers are queued again once.

### US2 — Make my own lesson (P1)

**Acceptance Scenario**

1. **Given** the lesson maker, **When** a student picks a unit, a topic (or "surprise me"), a length and a request, **Then** a lesson on that topic is generated.

### US3 — Follow a course path (P2)

**Acceptance Scenario**

1. **Given** a subject page, **When** the student switches to "Full course", **Then** every spec topic and subtopic is shown, grouped by learning aim (BTEC) or **chapter** (A-Level), and ticked off by completed lessons.
2. **Given** "My path", **Then** they see finished lessons and what to do next: fix weak areas, lock in recent reading, new topics, review.

### US4 — Try before buying (P1)

**Acceptance Scenario**

1. **Given** a non-Premium user, **Then** they can generate exactly one free lesson. A failed generation does not use up the trial.

### US5 — Teacher-set lessons (P2, EDU)

**Acceptance Scenario**

1. **Given** a teacher sets a Study Hub item, either personal (per student) or a class template, **When** a student opens it, **Then** they get their own copy, and completion is recorded as a submission.

### Edge Cases

- AI produces a wrong answer key or broken code: the step is verified and skipped if it cannot be verified.
- The user is signed out: they see an overview page that explains Study Hub.

## Requirements

- **FR-001**: Answer keys MUST be generated and checked with stronger models. Code steps MUST be verified by **running** the solution. Expected outputs come from execution, never from the AI.
- **FR-002**: Real exam questions MUST be fetched in full from the unit, not re-created.
- **FR-003**: Premium MUST be decided in exactly one server-side place.
- **FR-004**: Learners MUST NOT be able to edit lesson content, XP or marking.
- **FR-005**: No emoji. Icons are custom SVGs.

## Success Criteria

- **SC-001**: 0 known wrong answer keys reach learners. Verification failures are skipped.
- **SC-002**: Lesson generation p95 is under 45 s.
