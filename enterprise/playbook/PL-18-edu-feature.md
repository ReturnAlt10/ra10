# PL-18 — Schools/EDU feature

**Context:** EDU is built but **not public** ("coming soon"). The single source of truth for the schema is `supabase/sql/edu-platform.sql` (§11 holds the staff-role guards). `edu-fix-staff-roles.sql` must mirror it exactly.

## New assignment item type

Existing item types (the `type` checks in `school.js` / `unit-edu.js`): `question`, `mcq`, `paper`, `exam`, `guide`, `topic`, `other` and `studyhub` (`{type:'studyhub', mode:'personal'|'class', lessonId?, topic, length, focus, request}`).

1. **Builder UI:** add a tab in the `school/school.js` assignment builder. Store the item in `edu_assignments` (items JSON).
2. **Learner runner:** render the item type in `revision/shared/unit-edu.js` (the assignment runner inside unit apps), or send the learner out to the owning app, as Study Hub items do.
3. **Completion:** upsert `edu_submissions` (`item_type`, `score`, `feedback`) through the existing RLS policies (`edu_sub_insert` / `edu_sub_update`).
4. **Teacher view:** show the result in the class and student views. AI analysis goes through `edu-manage` `analyse-student` / `analyse-class`.
5. **Tracking:** call `RA10Track.log` so progress appears in `edu_student_summary`.

## Role and permission changes

- **Change roles only through `edu_set_member_role`.** Triggers keep teachers and staff from being downgraded by accident (`edu_keep_staff_role`).
- **Authorise from the JWT.** In the edge function, never trust a role sent by the client.
- **Invites must be accepted** (`edu_accept_invite`); the SDK no longer self-activates `invited` rows.

## Verify

- [ ] Test with three accounts: a school admin, a teacher and a student. Each sees only what they should; cross-school access is denied.
- [ ] The SQL change is applied to both `edu-platform.sql` and `edu-fix-staff-roles.sql` when it touches role functions.
- [ ] Unit overlays use `position:fixed!important` and attach to `document.documentElement`.
