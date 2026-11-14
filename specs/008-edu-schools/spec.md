# Feature Specification: Schools / EDU

**Status**: Built, **not public** (school plans "coming soon")

## User Scenarios & Testing

### US1 — Set up a school (P1)

**Acceptance Scenario**

1. **Given** a school admin, **When** they enter the school website, **Then** the AI scan suggests the school's logo, the subjects it offers and the matching RA10 units.
2. **Then** the admin invites staff and students, individually or by CSV/XLSX import.

### US2 — Join by invite (P1)

**Acceptance Scenario**

1. **Given** an invited user, **When** they next sign in, **Then** they see an invite pop-up. They join only if they accept, and then receive the school entitlement (students 300 credits a month, teachers 600).

### US3 — Set and track assignments (P1)

**Acceptance Scenarios**

1. **Given** a teacher, **When** they build an assignment from unit content, **Then** students see it and complete it inside the unit app or Study Hub. Content can be questions, MCQs, papers, guide reading, topics or Study Hub lessons.
2. **Then** submissions and scores appear for the teacher, who can comment.
3. **Given** a teacher, **When** they request an analysis, **Then** the AI summarises a student's or class's strengths and gaps.

### Edge Cases

- A teacher must never be accidentally downgraded to student (staff-role guard).
- Teachers see only their own school's students.
- Declining an invite leaves the account unchanged.

## Requirements

- **FR-001**: Roles MUST come from the database and JWT, never from client input.
- **FR-002**: Cross-school data access MUST be denied by RLS.
- **FR-003**: Invites MUST require explicit acceptance.
- **FR-004**: Student activity MUST be visible only to that student's teachers and school staff.

## Success Criteria

- **SC-001**: A three-role test (admin, teacher, student) passes all visibility checks.
