# Feature Specification: Enterprise hardening

**Status**: Planned
**Input**: "Get the website enterprise ready: reproducible, secure, testable, operable, compliant, without breaking learners."

## User Scenarios & Testing

### US1 — Rebuild any environment from git (P1, engineer)

**Acceptance Scenario**

1. **Given** an empty Supabase project, **When** the engineer applies the migrations, **Then** the schema matches production exactly.

### US2 — Nothing reaches production unchecked (P1, engineer)

**Acceptance Scenario**

1. **Given** a pull request, **Then** the automated checks must pass before merge: syntax, health check, content checker, browser smoke test, function type-check and database tests.

### US3 — Money and AI usage cannot be abused (P1, owner)

**Acceptance Scenario**

1. **Given** a user without credits, **When** they call a paid AI endpoint directly, **Then** the call is refused.
2. **Given** excessive requests, **Then** they are rate-limited.

### US4 — Roles, not hard-coded emails (P2)

**Acceptance Scenario**

1. **Given** the owner grants an admin role, **Then** that person gets admin powers without a code change.

### US5 — Know when things break (P2, operations)

**Acceptance Scenario**

1. **Given** an error spike, an AI accuracy drop or a provider outage, **Then** the team is alerted.

### US6 — Compliance (P2, DPO)

**Acceptance Scenario**

1. **Given** a data-subject request, **Then** export and deletion are completed with a tested runbook.

## Requirements

- **FR-001**: The schema MUST be fully version-controlled, with one definition per database function.
- **FR-002**: Exam-board source files MUST be removed from the repository and its history.
- **FR-003**: Paid actions MUST be charged atomically on the server. AI endpoints MUST be rate-limited and accept only allowed origins.
- **FR-004**: Admin and owner rights MUST come from a roles table.
- **FR-005**: Security headers (CSP, HSTS, frame-ancestors) and subresource integrity for third-party scripts MUST be in place.
- **FR-006**: Shared engines MUST exist once, and cache busting MUST be automatic.
- **FR-007**: Learner-visible behaviour, URLs, content APIs and stored progress MUST NOT change.

## Success Criteria

- **SC-001**: `supabase db reset` reproduces production (the schema diff is empty).
- **SC-002**: 0 FAIL and 0 security WARN in `health_check.py`; branch protection is on.
- **SC-003**: A security test cannot obtain AI marking without credits, or raise credits, tier or role.
- **SC-004**: securityheaders.com grade A.
- **SC-005**: Zero learner-facing regressions in the browser smoke tests across all 46 units.
