# Feature Specification: Unit revision apps

**Status**: As-built (46 units)

## User Scenarios & Testing

### US1 — Revise a topic (P1)

A student opens a unit, reads the guide topic by topic (each with diagrams, key terms, worked examples and exam tips) and marks topics as revised.

**Acceptance Scenarios**

1. **Given** a unit, **When** the student opens the guide, **Then** they see an exam or assignment overview first, then every specification topic grouped by learning aim (BTEC) or chapter (A-Level).
2. **Given** a topic, **When** it is marked revised, **Then** the progress counter updates and is remembered on that device.

### US2 — Practise and check understanding (P1)

**Acceptance Scenarios**

1. **Given** the practice view, **When** the student filters by aim or chapter (showing its name), topic or command verb, **Then** matching exam-style questions show, each with a full mark scheme.
2. **Given** the quiz, **When** a student answers, **Then** they get immediate feedback and an explanation.
3. **Given** flashcards, **When** a card is flipped, **Then** the back shows the definition, formula or example.

### US3 — Sit a paper in exam conditions (P1)

**Acceptance Scenarios**

1. **Given** the papers library, **When** the student opens a real or RA10 paper, **Then** it renders in the real exam layout (sections, extracts, figures, tariffs, total) with a timer.
2. **When** they answer online, **Then** they can reveal the official-style mark scheme, or request AI Examiner marking (spec 003), and download a PDF.

### US4 — Coursework help (assignment units, P1)

**Acceptance Scenario**

1. **Given** an internally assessed unit, **When** the student opens the assignment guide, **Then** every criterion (Pass, Merit, Distinction) has: what it means, the evidence to include, and how to reach the next grade.
2. **No** invented sample assignments are shown, and drafts are **never** AI-graded.

### Edge Cases

- A past-paper question on content removed from the specification is labelled off-spec.
- A signed-out user trying to download: they are asked to sign in.
- The unit is loaded in a hidden catalogue frame: no UI side effects, and no feedback widgets.

## Requirements

- **FR-001**: Each unit MUST provide a dashboard, guide, specification, practice/question bank, quiz, flashcards and papers (exam units) or assignment guide (assignment units).
- **FR-002**: Labels MUST follow the qualification: "Learning aim A…" for BTEC; "Chapter N" for A-Level (Psychology uses paper.section, for example 1.1). Filters MUST show the aim or chapter **name**.
- **FR-003**: Real papers MUST reproduce the official structure. RA10 papers MUST match the real totals, sections and timing.
- **FR-004**: Minimum content: exam units have a 60+ bank, 80+ quiz, 80+ cards, a 25 KB+ guide and 6 RA10 papers. Assignment units have 40+/50+/50+, a 15 KB+ guide and help for every criterion.
- **FR-005**: Each unit MUST export its content to same-origin parents on request (`?ra10catalog=1`), for Study Hub, EDU and quality.
- **FR-006**: Learners MUST be able to report a content mistake and rate guide helpfulness (spec 009).
- **FR-007**: Learning actions MUST be logged to the activity log, and XP awarded through the guarded path (spec 005).

## Key Entities

- **Question** (aim, topic, command verb, marks, scenario, mark scheme or levels).
- **Quiz item** (stem, options, answer, explanation).
- **Flashcard.**
- **Guide topic** (code, name, HTML, diagrams).
- **Paper** (id, source, series, minutes, total, items with context blocks and mark schemes).
- **Criterion help.**

## Success Criteria

- **SC-001**: `check_units.js` and the browser tests pass for every unit.
- **SC-002**: Every specification topic appears in the guide, the bank and the cards.
- **SC-003**: No console errors; 390 px phone width; dark mode readable.
