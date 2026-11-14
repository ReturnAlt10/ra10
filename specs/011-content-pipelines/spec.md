# Feature Specification: Content pipelines

**Status**: As-built (four pipelines)

## User Scenarios & Testing

### US1 — Turn exam-board sources into a faithful app (P1, content engineer)

**Acceptance Scenarios**

1. **Given** a specification and past papers (kept out of git), **When** the pipeline runs, **Then** every paper that validates is reproduced in its real layout with its mark scheme. Papers with any problem are reported and not emitted.
2. **Given** the parsed specification, **Then** the unit's spec view, topic codes and aim or chapter structure come from it, and missing or merged parts can be corrected through recorded patches.
3. **Given** hand-written content parts, **Then** a rebuild assembles them, syntax-checks them and applies the display conventions (chapters for A-Level).

### US2 — Prove the unit meets the bar (P1)

**Acceptance Scenario**

1. **Given** a built unit, **When** the checker runs, **Then** it verifies counts, syntax, paper totals, guide size and criterion-help coverage against the quality bar. The browser test then checks every view.

## Requirements

- **FR-001**: Source material MUST stay out of version control and out of the deployed site.
- **FR-002**: Generated outputs MUST be reproducible from sources, generators and authored parts. Generated files MUST NOT be hand-edited.
- **FR-003**: A paper MUST only be emitted when it validates: the total matches, every item has a mark scheme, and the levels are complete.
- **FR-004**: Each pipeline MUST have a checker and a browser smoke test, or a documented equivalent.

## Success Criteria

- **SC-001**: A clean rebuild reproduces the committed outputs, so the diff is empty.
- **SC-002**: 100% of units pass their checker.
