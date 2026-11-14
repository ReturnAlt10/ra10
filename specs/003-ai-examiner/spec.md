# Feature Specification: AI Examiner and AI Assigner

**Status**: As-built

## User Scenarios & Testing

### US1 — Get an exam answer marked like an examiner would (P1)

**Acceptance Scenarios**

1. **Given** a signed-in student who has accepted the terms and has an exam question open, **When** they submit an answer, **Then** they receive:
   - a mark out of the tariff;
   - the level (for extended answers);
   - what went well;
   - how to improve, tied to the official mark scheme or levels.
2. **Given** a board-specific subject (AQA Business 7132/7138, AQA Psychology 7182, Edexcel Business 9BS0, BTEC Business, BTEC Sport Unit 2), **Then** marking uses that board's level descriptors and assessment-objective weighting.
3. **Given** a "draw" question, **When** the student uploads a photo of a diagram, **Then** it is considered in the marking.
4. **Given** handwritten work, **When** the student uploads a photo, **Then** it is transcribed to editable text.
5. **Given** a mark was shown, **Then** the student can say whether it was fair (feedback, spec 009).

### US2 — Coursework guidance without ghost-writing (P1)

**Acceptance Scenario**

1. **Given** an assignment unit, **When** the student asks the AI Assigner, **Then** it coaches (hints, criteria meaning, next steps) in the unit's context. It **never** writes the assignment and never grades drafts as final.

### Edge Cases

- Empty or gibberish answers score 0.
- Marks never exceed the tariff.
- Every AI provider is down: the user sees a clear error and is not charged.
- The terms are not accepted: AI is refused until they are.

## Requirements

- **FR-001**: Marking MUST use the question's real mark scheme and levels, with spec-specific examiner modules routed by spec code or unit.
- **FR-002**: The system MUST fall back across AI providers. Accuracy-critical calls MUST prefer stronger models.
- **FR-003**: AI features MUST require sign-in and accepted terms, checked on the server.
- **FR-004**: AI Examiner use MUST be limited **on the server** by a rolling hourly limit and a rolling daily limit, synced per account. Credits are not used.
  - Premium (Pro, Ultra) and EDU (school) plans MUST NOT be limited.
  - While the launch extension is active, Standard limits MUST be multiplied, and the UI MUST say so.
  - A failed marking MUST NOT use up allowance.
  - When a limit is reached, the learner MUST see when they can mark again. Learners SHOULD be warned when they are close to a limit.
  - *Implemented 12 Nov 2026: `ai-usage.sql`, `ai-mark` and the SDK usage UI.*
- **FR-005**: Accuracy MUST be measurable against senior-examiner-marked benchmark sets.

## Success Criteria

- **SC-001**: ≥80% of benchmark items are within ±1 level, and the mean absolute error is ≤10% of the tariff.
- **SC-002**: p95 marking latency is under 20 s.
