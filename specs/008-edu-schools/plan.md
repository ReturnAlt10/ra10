# Implementation Plan (as-built): Schools / EDU

| Piece | Where |
|---|---|
| Apps | `/school/` (`school.js`: classes, members, CSV import, assignment builder, Study Hub items); `/admin/` (EDU admin, `invite.js`); `/tools/activity/` |
| Shell | `refresh/ra10-edu.js` (invite pop-up, student and teacher homepages), `refresh/ra10-track.js`, `refresh/ra10-units.js` |
| Unit side | `revision/shared/unit-edu.js` (assignment runner; Study Hub items link out) |
| Schema | `edu-platform.sql` (source of truth; §11 holds the staff-role guards): `edu_classes`, `edu_class_members`, `edu_assignments`, `edu_submissions`, `edu_comments`, `edu_ai_reports`, `activity_events`, `xp_rate`, plus `schools` / `school_members` columns. `edu-fix-staff-roles.sql` mirrors §11 |
| RPCs | `edu_my_context`, `edu_accept_invite`, `edu_decline_invite`, `edu_setup_school`, `edu_student_summary`, `edu_class_roster`, `edu_school_people`, `edu_set_member_role`, `edu_add_to_class`, `edu_mark_comments_read`, the `edu_is_*` / `edu_can_view_student` predicates |
| Server | Edge function `edu-manage`: `scan-school`, `invite`, `invite-many`, `remove-member`, `analyse-student`, `analyse-class`, `set-subjects`, `activate`, `deactivate`. Optional Resend email (`RESEND_API_KEY`, `EDU_FROM_EMAIL`) |
| Entitlement | `apply_school_entitlement()` |

## Launch checklist (before going public)

1. Run `edu-platform.sql`, then `edu-fix-staff-roles.sql`, then `xp-integrity.sql` (R-02 order).
2. Do the three-role test on staging (M-2).
3. Turn on the school plans in billing (spec 004, which first needs M-4).
4. Data protection: a school data-processing agreement and retention for `activity_events` (M-10).
5. Post News when it launches.
