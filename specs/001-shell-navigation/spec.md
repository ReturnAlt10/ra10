# Feature Specification: Shell, navigation and routing

**Status**: As-built

## User Scenarios & Testing

### US1 — Find my unit fast (P1)

A student searches or browses for their qualification and unit and opens it.

**Acceptance Scenarios**

1. **Given** any page, **When** the student types "sport unit 1" in the navbar finder, **Then** BTEC L3 Sport Unit 1 is offered and opens.
2. **Given** a signed-in student, **When** they open the homepage, **Then** the dashboard shows their apps grouped by subject. Each subject has a distinct icon and colour, filter chips (All / BTEC L3 / BTEC L2 / A-Level) and search.
3. **Given** a shared link `/a-level/psychology`, **When** it is opened in a new browser, **Then** the Psychology app loads directly.

### US2 — Know what is new (P2)

**Acceptance Scenarios**

1. **Given** the owner has posted an announcement, **When** a visitor loads any shell page, **Then** the bar shows the message until it expires or the visitor dismisses it.
2. **Given** the News page, **When** a visitor filters by category, status or text, **Then** only matching release notes show.

### US3 — Signed-out visitor understands the product (P2)

**Acceptance Scenario**

1. **Given** a signed-out visitor, **When** they open the homepage, **Then** they see the marketing sections (feature tour, Study Hub, subjects including the new AAQ subjects, schools) and a sign-up call to action.

### Edge Cases

- Unknown path: show a not-found page with links home.
- Old `#/path` links: they still resolve.
- A unit in the registry without a static page: it renders through the dynamic subject and unit pages.

## Requirements

- **FR-001**: Routing MUST use clean public URLs and map them to internal keys. Public `/subjects` maps to internal `/revision`, and `/btec/...` maps to `/revision/btec/...`.
- **FR-002**: Every subject and unit list MUST be generated from the single unit registry.
- **FR-003**: Standalone apps (Study Hub, School, Admin, Tools, Legal) MUST be excluded from SPA link interception.
- **FR-004**: Unit apps embedded in the shell MUST keep the shell's theme and navigation.
- **FR-005**: Route changes MUST be announced to assistive technology.
- **FR-006**: Standalone pages MUST reuse the shell's real navbar and mobile chrome.

## Key Entities

- **Unit (registry entry):** path, subject, qualification, short name, full name, kind (Exam / Coursework / Set task), colour, keywords.
- **Announcement:** emoji, message (240 characters or fewer), created and expiry time.
- **News article:** id, category, status, date, title, body, tags.

## Success Criteria

- **SC-001**: 100% of registered units resolve by public URL and appear in `sitemap.xml`. Checked by `health_check.py`.
- **SC-002**: The shell's first paint shows no unstyled flash. The theme class is present from the start.
