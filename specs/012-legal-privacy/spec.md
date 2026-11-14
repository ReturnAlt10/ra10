# Feature Specification: Legal, privacy and safety

**Status**: As-built (partial; see the gaps)

## User Scenarios & Testing

### US1 — Accept the terms before using AI (P1)

**Acceptance Scenario**

1. **Given** the terms version changes, **When** a signed-in user next uses an AI feature, **Then** they must accept the new terms. Until they do, the server refuses AI requests.

### US2 — Understand how data is used (P1)

**Acceptance Scenario**

1. **Given** any visitor, **Then** the terms, privacy, cookies and accessibility pages are reachable from every page.

### US3 — Control my data (P2, planned)

**Acceptance Scenario**

1. **Given** a user requests export or deletion, **Then** all their personal data is exported or deleted within the statutory time. *Planned in M-10.*

## Requirements

- **FR-001**: Acceptance of the current terms MUST be recorded per user, and enforced server-side for AI features.
- **FR-002**: Acceptance records MUST be tamper-proof from the client.
- **FR-003**: AI chat history MUST expire automatically (scheduled purge).
- **FR-004**: Every personal-data table MUST have a defined retention period. *Gap: only AI chats have one today.*
- **FR-005**: Every third-party processor (LLM providers, Stripe, Resend, Supabase, GitHub Pages) MUST be listed in the privacy notice.

## Success Criteria

- **SC-001**: 100% of AI requests from users who have not accepted the terms are refused.
- **SC-002**: A DPIA is completed, and an export and delete runbook has been tested (M-10).
