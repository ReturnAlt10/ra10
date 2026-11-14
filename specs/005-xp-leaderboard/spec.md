# Feature Specification: XP, streaks and leaderboard

**Status**: As-built

## User Scenarios & Testing

### US1 — Earn XP for genuine learning (P1)

**Acceptance Scenarios**

1. **Given** a student answering practice questions properly, **When** they finish a session, **Then** they earn XP in proportion to the quality and amount of their learning.
2. **Given** a student who starts and ends sessions repeatedly without learning, **Then** no session bonus is awarded.
3. **Given** an answer like "aidsusdisdij", gibberish, filler, a copied mark scheme or AI boilerplate, **Then** it earns no XP, and the session summary explains why.

### US2 — Compete fairly (P2)

**Acceptance Scenarios**

1. **Given** the leaderboard, **When** a student opens it, **Then** they see the weekly ranking, their own rank and badges. The top three stand on a podium.
2. **Given** the week ends, **Then** results are settled and rewards (boosts) are granted.
3. **Given** a student overtakes someone, **Then** an overtake moment is shown.

### US3 — Keep a streak (P2)

**Acceptance Scenario**

1. **Given** a student studies on consecutive days, **Then** their streak grows and follows their account across devices.

### Edge Cases

- Bursts of XP within one minute are capped.
- There is a daily cap.
- A single award is capped at 100.
- Daily caps (UK day): activity 600, tasks 250, games 90, Study Hub 150, boost bonus 300, 1,000 in total.
- Awards of 10 XP or more require recent recorded learning activity.

## Requirements

- **FR-001**: XP MUST only be awarded through one server-side guarded operation, with per-call, per-minute and per-day caps.
- **FR-002**: Session and completion rewards MUST require genuine recent learning: at least two distinct learning actions, or one examined answer.
- **FR-003**: Low-effort answers MUST be detected and withheld from XP. Detection SHOULD be server-side and MAY use AI scoring in the background. *Today: SQL heuristics plus a client heuristic; see R-19.*
- **FR-004**: The leaderboard MUST be computed on the server.
- **FR-005** *(XP v3, 12 Nov 2026)*: The browser MUST NOT decide XP. The server pays only what the learner's recorded activity earned, scored per question once a day, and records every grant in `xp_ledger`. XP and leaderboard columns MUST NOT be writable from the browser.
- **FR-006**: Daily tasks MUST rotate per learner per day (one per slot: write, AI, quiz, explore, game), be measured on the server and pay once.
- **FR-007**: Daily games MUST be built from the unit's own verified quiz bank. AI-written items MUST pass a second AI check or be replaced by bank-only items. The server MUST re-score every play and pay XP once per game per day, with a minimum play time.
- **FR-008**: Weekly podium rewards are a badge and a 3x XP boost (no credits). The week closes at the end of Saturday, UK time.

## Success Criteria

- **SC-001**: A scripted farm (start/end loops, gibberish answers) earns 0 bonus XP.
- **SC-002**: Genuine answers are never zeroed. In particular, answers that mention "AI" must not be zeroed, which is a known false positive today.
