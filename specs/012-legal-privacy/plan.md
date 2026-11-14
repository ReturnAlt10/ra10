# Implementation Plan (as-built): Legal, privacy and safety

| Piece | Where |
|---|---|
| Pages | `legal/{terms,privacy,cookies,accessibility}.html`, `legal.css` |
| Acceptance | `legal-terms-acceptance.sql`: `legal_documents`, `legal_acceptances`, `accept_legal_terms`, `get_legal_status`, `has_accepted_current_terms`, and a column-protection trigger |
| Client gate | `RA10.getLegalStatus`, `acceptTerms`, `requireTerms` |
| Server gate | `supabase/functions/_shared/legal.ts` `requireTermsAccepted`, used by the AI functions |
| AI chat retention | `ai-chat-history.sql`: `purge_expired_ai_chats()` via pg_cron |
| Moderation | Spec 007 |
| Accessibility | `ra10-a11y.js`; 390 px and dark-mode requirements |

## Gaps → M-10

- Retention for `activity_events`, `study_lessons`, `content_feedback`, `edu_*` and forum content.
- `export_my_data()` / `delete_my_account()` RPCs, and a storage clean-up for avatars.
- A DPIA, a Children's Code review, and a WCAG 2.2 AA audit.
