# Feature Specification: Community (forums, study-app library, moderation)

**Status**: As-built

## User Scenarios & Testing

### US1 — Ask and help in subject forums (P1)

**Acceptance Scenario**

1. **Given** a signed-in user, **When** they post a thread or reply in a subject category, **Then** others can reply (threaded), like, search and share it.

### US2 — Stay safe (P1)

**Acceptance Scenarios**

1. **Given** a new post, **Then** an AI moderator checks it. Swearing and banter are allowed. Racism, hate, serious threats, sexual content, self-harm encouragement, doxxing and scams are removed automatically. Borderline posts are flagged for a human.
2. **Given** a moderator, **When** they review the moderation log, **Then** they can restore anything removed by mistake.
3. **Given** a user reports a post, **Then** it appears in the staff reports queue.

### US3 — Staff and moderators (P2)

**Acceptance Scenarios**

1. **Given** the owner invites a member to moderate, **Then** the member gets a pop-up on their next login and joins only if they accept.
2. **Given** a member applies to moderate, **Then** the owner sees an AI summary of the applicant and decides.
3. **Given** staff, **Then** they can pin, lock, move and delete threads, remove replies and apps, handle reports and ban users. Owner and Admin badges show.

### US4 — Share study apps (P3)

**Acceptance Scenario**

1. **Given** the Community Studio, **When** a user creates a study app, **Then** it is generated asynchronously, listed in the library with comments, and has a share preview.

## Requirements

- **FR-001**: Every post MUST pass through moderation, with a full audit log and restore.
- **FR-002**: Bans MUST block posting server-side.
- **FR-003**: Staff powers MUST be checked server-side (`is_community_staff`, `is_community_owner`).
- **FR-004**: Public profile data exposed in the community MUST be limited to a safe public view.

## Success Criteria

- **SC-001**: Prohibited content is removed within 1 minute of posting (AI queue).
- **SC-002**: The false-removal rate is tracked through restores.
