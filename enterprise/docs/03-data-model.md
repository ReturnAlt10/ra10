# 03 — Data Model (Supabase Postgres)

**Project:** `tcrrgsylxbyyrmnouihl` (Supabase, region per dashboard). Auth is Supabase Auth (email and password, with password recovery). Learners use the **anon key** (public, embedded in `ra10-sdk.js`). Every protected write goes through **RLS policies** or **`security definer` RPCs**.

> **Gap (risk R-01).** There is no complete baseline schema in git. These were created in the Supabase dashboard before the SQL files existed:
>
> - `profiles`, `schools`, `school_members`, `revision_sessions`, `leaderboard`;
> - `community_apps`, `community_app_jobs`, `community_app_contents`;
> - the storage buckets.
>
> First enterprise task: `npx supabase db dump --schema public > supabase/schema/baseline.sql`, commit it, and adopt `supabase/migrations/` (roadmap M-1). `supabase/.temp/remote-schema.sql` exists but is empty.

## 1. Domains and tables

### Identity and entitlement

| Table | Key columns (inferred from code, so verify against the dump) | Written by |
|---|---|---|
| `profiles` (1 row per auth user) | `id` (= auth.uid), `username`, `display_name`, `full_name`, `tier`, `credits`, `credits_reset_at`, `unlimited_credits`, `unlocked_subjects`, `school_id`, `school_name`, `user_role`, `role`, `xp_total`, `xp_this_week`, `profile_pic_url`, `leaderboard_badge`, `onboarding_completed_at`, `seen_flags`, plus preference columns | Client (non-privileged fields only, enforced by trigger), Stripe webhook, RPCs |
| `legal_documents`, `legal_acceptances` | Current terms version; per-user acceptance | `accept_legal_terms()` |
| `study_days` | One row per user per study day (streak) | Client insert, guarded by a trigger |

**Guards** (`security-hardening-profiles.sql`):

- `trg_prevent_profile_privilege_escalation` blocks client changes to `tier` and `unlimited_credits`, and blocks any **increase** of `credits`.
- `trg_sanitise_profile_insert` forces new rows to `credits = 10` and `unlimited_credits = false`.
- Entitlement changes happen only in:
  - `apply_school_entitlement()` (school student 300 credits, teacher 600);
  - `reset_monthly_credits()`;
  - the Stripe webhook (service role).

### Gamification

| Table / RPC | Purpose |
|---|---|
| `xp_rate` | Per-user per-minute and per-day XP counters, `last_award_at`, and the earned bank (`ev_cursor`, `bank`, `bank_day`) |
| `xp_ledger` | **Every XP grant** (`source`: activity, task, game, study_hub, boost, admin). The audit trail behind `xp_this_week` |
| `xp_credited` | What has been credited today (one row per question / guide section / mark), for de-duplication and the 40-points-a-minute pace limit |
| `xp_marks` | Real AI Examiner scores written by `ai-mark` (service role) |
| `daily_task_catalog`, `daily_task_claims` | The task pool (5 slots) and what each learner has claimed |
| `ai_tool_trials`, `user_flashcards`, `prerelease_packs` | AI study tools (`ai-tools.sql`): free tries per tool, learners' flashcard decks — typed in Study Hub or scanned, with optional https picture links `front_image` / `back_image` (own rows only), and Part A packs (edge function only) |
| `daily_games`, `daily_game_plays` | Each learner's daily game set (with answer keys; edge function only) and their plays |
| `increment_xp(amount)`, `xp_claim(amount)` | Apps ask for an amount; the server pays only what the learner's own `activity_events` earned (`xp_refresh_bank`), through `xp_grant`, the single place XP is added (caps, boost bonus, ledger, profile update). `xp_award_server` is the service-role path for games and Study Hub. **Live definition: `xp-v3.sql`** |
| `get_daily_tasks()`, `claim_daily_task(key)` | Five rotating tasks per learner per day, progress measured on the server |
| `trg_protect_profile_xp_columns` | Browser requests cannot change `xp_total`, `xp_this_week` or leaderboard results |
| `xp_owner_review`, `xp_owner_adjust`, `xp_owner_reset_week_to_ledger` | Owner tools |
| `xp_answer_is_meaningful(answer, kind)` | Heuristic gibberish filter (repeated characters, keyboard mashes, no vowels, consonant runs, no-space nonsense) |
| `leaderboard_weekly_results`, `settle_previous_leaderboard()` | Weekly rewards |
| `xp_boosts`, `claim_xp_boost`, `activate_xp_boost`, `get_my_boosts`, `xp_boost_bonus` | XP boosts |
| `get_leaderboard`, `get_my_rank`, `get_leaderboard_preview`, `reset_weekly_xp` | Leaderboard reads |
| `set_user_role` | Owner sets roles and badges |

### Learning activity and EDU (`edu-platform.sql`, about 1,050 lines; the source of truth)

| Table | Purpose |
|---|---|
| `activity_events` | Every tracked learning action (`RA10Track.log`). RLS: users insert and see their own; staff see their students |
| `edu_classes`, `edu_class_members` | Classes and membership (`role`: student, teacher, …) with staff-role guards |
| `edu_assignments`, `edu_submissions`, `edu_comments`, `edu_ai_reports` | Assignment builder, submissions (including Study Hub items), teacher feedback, AI analyses |
| RPCs | `edu_my_context`, `edu_accept_invite`, `edu_decline_invite`, `edu_setup_school`, `edu_student_summary`, `edu_class_roster`, `edu_school_people`, `edu_set_member_role`, `edu_add_to_class`, `edu_mark_comments_read`, `edu_is_owner`, `edu_is_school_admin`, `edu_is_school_staff`, `edu_can_view_student`, … |

`edu-platform.sql` also adds columns to `schools` and `school_members`, and grants `school_admin` to `business.returnalt10@gmail.com`.

### AI usage limits (`ai-usage.sql`, added 12 Nov 2026)

This replaces credits for the AI Examiner with **usage limits**: a rolling hour and a rolling 24 hours, synced per account.

| Object | Purpose |
|---|---|
| `ai_usage_config` | One row per AI feature (`ai_mark`): `hourly_limit` (10), `daily_limit` (40), `extension_active` (true), `extension_multiplier` (3), `extension_note`. Readable by everyone |
| `ai_usage_events` | One row per counted use. RLS: users read their own; **no client writes**. Rows older than 2 days are pruned on the next use |
| `ai_usage_plan(user)` | `premium` (Pro, Ultra, owner, unlimited accounts: nothing counted), `edu` (school tiers and active school members: no limits), `standard` (limited) |
| `ai_usage_snapshot(user, feature)` | JSON with plan, `allowed`, `blocked_by`, hour and day `{used, limit, remaining, resets_at, clears_at}`, base limits and extension. Service role only |
| `ai_usage_status(feature)` | The learner's own snapshot (authenticated) |
| `ai_usage_consume(user, feature)` / `ai_usage_refund(user, event_id)` | **Service role only.** Called by `ai-mark` before the AI call and on failure. Uses an advisory lock, so concurrent tabs can't overspend |
| `ai_usage_set_config(...)` | Owner (`edu_is_owner()`): change limits or end the launch extension |

**Launch extension:** while `extension_active` is true, Standard limits are multiplied (3×, so 30 an hour and 120 a day). When the enterprise migration ends, run:

```sql
update public.ai_usage_config set extension_active = false where feature = 'ai_mark';
```

### Study Hub (`study-hub.sql`)

| Object | Purpose |
|---|---|
| `study_lessons` | Generated lessons. `kind` is `daily`, `custom`, `template` (teacher) or `assigned`. Holds steps JSON, results, XP and the `emoji` column (an icon key) |
| `study_hub_trials` | One free trial per non-Premium user, claimed before generation and released on failure |
| `study_hub_premium()` | **The single definition of Premium:** tier `all_subjects` / `ultra` / `owner`, `unlimited_credits`, the owner email, school tiers, or an active school member |
| `study_hub_status()` | Status for the UI |
| `trg_study_lessons_guard` | Learners cannot edit content, XP or marking |

### Community (`community-forums.sql` → `community-moderation.sql` → `community-applications.sql`)

- **Forums:** `forum_categories`, `forum_posts`, `forum_comments`, `forum_post_likes`, `forum_comment_likes`, `forum_reports`, `forum_bans`. Counter triggers keep the like and reply counts.
- **Staff and moderation:**
  - tables: `community_staff`, `community_staff_invites`, `forum_mod_queue` (AI moderation queue), `forum_mod_log`, `community_mod_applications`;
  - RPCs: `is_community_staff`, `is_community_owner`, `forum_is_banned`, `forum_restore`, `forum_latest_announcement`, `community_invite_moderator`, `community_respond_invite`, `community_apply_moderator`, `community_decide_application`, …
- **Study-app library:** `community_apps`, `community_app_jobs`, `community_app_contents` (pre-existing tables). The view `community_public_profiles` exposes public profile fields.

### AI chat (`ai-chat-history.sql`, then `ai-chat-history-fix.sql`)

`ai_chats`, `ai_chat_messages` and `ai_chat_groups`, with before-write triggers. `purge_expired_ai_chats()` is scheduled with **pg_cron**, so the extension must be enabled.

### Quality (`quality.sql`)

- Tables: `content_feedback` (learners write only via `feedback_submit()`, limited to 60 per hour) and `quality_snapshots`.
- Owner RPCs: `quality_usage`, `quality_feedback`, `quality_reports`, `quality_resolve`, `quality_save_snapshot`, `quality_snapshots_list`. All of them check `edu_is_owner()`.
- `quality_excluded_users()` removes the owner's own data from the statistics.

### Other

| Object | Purpose |
|---|---|
| `popups-and-profile-cards.sql` | `get_public_profile`, `mark_seen` (dismissed pop-ups in `profiles.seen_flags`) |
| `profile-pictures.sql`, `fix-profile-pic-constraint.sql` | Storage policies and constraints for avatars |
| `profile-moderation-notices.sql` | Notice columns for owner moderation actions |
| `profile-preferences.sql` | Preference columns, **plus a copy of the `increment_xp` guard** (see below) |
| Site announcement | Stored and served by the `site-announcement` edge function (`get` / `clear`; owner post) |

## 2. Migration order

There is no migration runner. Every file says "safe to re-run" (`create … if not exists`, `create or replace`). For a fresh environment, after restoring the baseline dump, run them in this order:

| Step | Files | Notes |
|---|---|---|
| 1 | Baseline dump (`profiles`, `schools`, `school_members`, …) | Not in git yet |
| 2 | `security-hardening-profiles.sql`, `fix-profiles-insert-policy.sql`, `fix-profiles-update-policy.sql` | |
| 3 | `legal-terms-acceptance.sql` | |
| 4 | `study-streak.sql` | |
| 5 | `profile-pictures.sql`, `fix-profile-pic-constraint.sql`, `profile-moderation-notices.sql` | |
| 6 | `leaderboard-rewards.sql` | |
| 7 | `fix-get-leaderboard-profile-pic.sql`, then `leaderboard-v2-roles-boosts.sql` | |
| 8 | `community-forums.sql`, `community-moderation.sql`, `community-applications.sql` | |
| 9 | `popups-and-profile-cards.sql` | Needs the forums tables |
| 10 | `ai-chat-history.sql`, `ai-chat-history-fix.sql` | Enable pg_cron first |
| 11 | `edu-platform.sql`, then `edu-fix-staff-roles.sql` | |
| 12 | `study-hub.sql`, `quality.sql`, `ai-usage.sql` | `ai-usage.sql` needs `edu_is_owner()` from step 11 |
| 13 | `profile-preferences.sql` | |
| 14 | `xp-integrity.sql`, then `xp-v3.sql` | **`xp-v3.sql` always last** |

`edu-diagnose.sql` is a read-only diagnostic and is not a migration.

### ⚠ Functions defined in more than one file (drift hazard, risk R-02)

| Function | Files | Hazard |
|---|---|---|
| `increment_xp(integer)`, `claim_xp_boost`, `xp_boost_bonus`, `settle_previous_leaderboard` | `edu-platform.sql`, `leaderboard-v2-roles-boosts.sql`, `leaderboard-rewards.sql` (older); **`xp-v3.sql` (live)** | Re-running an older file reverts XP v3. Always re-run `xp-v3.sql` afterwards (the copies in `xp-integrity.sql` / `profile-preferences.sql` were removed) |
| `xp_answer_is_meaningful` | `profile-preferences.sql`, `xp-integrity.sql` | Keep them identical, or delete it from `profile-preferences.sql` |
| `get_leaderboard` | `fix-get-leaderboard-profile-pic.sql`, `leaderboard-v2-roles-boosts.sql` | Run v2 last |
| `apply_school_entitlement` | `security-hardening-profiles.sql`, `edu-platform.sql` | edu-platform's is newer |
| `edu_set_member_role`, `edu_keep_staff_role` | `edu-platform.sql` §11, `edu-fix-staff-roles.sql` | Must stay identical; edu-platform is the source of truth |

Rule (from experience): **never leave a function defined differently in two files.** When you change one, change or delete the other in the same commit.

## 3. Security model summary

| Mechanism | Used for |
|---|---|
| RLS "own rows" policies | `activity_events`, `study_days`, `content_feedback`, `ai_chats*`, `study_lessons` (select) |
| `security definer` RPCs with `auth.uid()` checks | Every write that needs validation (XP, feedback, invites, roles, quality, legal) |
| Owner check | `edu_is_owner()` and `is_community_owner()` (email based, matching `OWNER_EMAIL`) |
| Service role (edge functions only) | Stripe webhook, AI functions, `edu-manage`, profile-picture moderation |
| Triggers | Privilege-escalation guard, lesson guard, staff-role guard, legal-acceptance column protection, counters |

## 4. Testing SQL safely

There is no staging project. The established method is a throwaway container: run `docker run --rm -e POSTGRES_PASSWORD=x postgres:15`, create stub `auth.uid()`, `profiles` and `schools`, run the file and exercise the RPCs. Then delete the image (the owner's C: drive is nearly full). Roadmap M-2 replaces this with a Supabase staging branch and `supabase test db` (pgTAP).
