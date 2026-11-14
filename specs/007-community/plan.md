# Implementation Plan (as-built): Community

| Piece | Where |
|---|---|
| UI | `refresh/community/forum.{js,css}`, `refresh/community/apps.{js,css}`. These are under `refresh/` because a top-level `/community` folder would clash with the route |
| Schema | `community-forums.sql`: categories, posts, comments, likes (with counter triggers), reports, bans, `community_staff`, `community_public_profiles` |
| Moderation | `community-moderation.sql`: `forum_mod_queue` (enqueue triggers on insert and edit), `forum_mod_log`, `forum_restore`, staff invites, `forum_latest_announcement`. Edge function `community-moderate` (`MODERATION_MODEL`) |
| Applications | `community-applications.sql`; edge function `community-applicant-summary` (owner, cached on the row) |
| App library | `community_apps`, `community_app_jobs`, `community_app_contents` (pre-existing tables); edge functions `community-create-job`, `community-process-job`, `community-share-preview` (public OG preview) |
| Run order | forums → moderation → applications, then `popups-and-profile-cards.sql` |

## Known gaps

- The `community_apps*` tables are not in git (R-01).
- Moderation queue processing depends on the edge-function invocation path. Add monitoring for queue age (M-9).
