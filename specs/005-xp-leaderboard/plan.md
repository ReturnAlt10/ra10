# Implementation Plan (as-built): XP, streaks and leaderboard

## Components

| Piece | Where |
|---|---|
| Award RPC | `increment_xp(amount)`: `security definer`, caps at 100 per call, minute and day limits (`xp_rate`), requires recent learning in `activity_events` for awards of 10 or more. It wraps `increment_xp_unguarded`. **Live definition: `xp-integrity.sql`**, which must run last (R-02) |
| Gibberish filter (SQL) | `xp_answer_is_meaningful(answer, kind)`, regex heuristics |
| Gibberish filter (client) | `jsAnswerCredibility()` in each unit's `js/app.js` (commit `baea7ae`). It scales the session reward by per-question quality |
| Anti-farm client layer | `refresh/ra10-xp.js`, `ra10-refresh.js` (session start/end guards) |
| Activity log | `RA10Track.log` → `activity_events` |
| Leaderboard | `get_leaderboard`, `get_my_rank`, `get_leaderboard_preview`, `reset_weekly_xp`, `settle_previous_leaderboard`, `leaderboard_weekly_results` |
| Boosts | `xp_boosts`, `claim_xp_boost`, `activate_xp_boost`, `get_my_boosts`, `xp_boost_bonus` |
| UI | `refresh/ra10-leaderboard.js` (arena, podium, overtake pop-up), `ra10-profile-card.js` |
| Streaks | `study_days` table, `RA10.markStudyDay` / `getStreak` / `syncStreak` |

## XP v3 (12 Nov 2026)

| Piece | Where |
|---|---|
| SQL | `supabase/sql/xp-v3.sql` (run last). Tested in postgres:15: profile writes blocked, gibberish or no learning pays 0, once per question, 40 a minute, verified AI marks, caps, boosts, tasks, settlement, owner tools, safe to re-run |
| Client | `refresh/ra10-xp.js` routes every `increment_xp` call to `xp_claim`: it sends `RA10Track` first, corrects the app's toast, and pays leftover earned XP every 2 minutes |
| Tasks and games UI | `refresh/ra10-tasks.js` (`RA10Tasks.render`), called by `site.js` `renderGlobalTasksPage`. The legacy local tasks are used only until the SQL is applied |
| Games | `supabase/functions/daily-games` (`state`, `today`, `start`, `finish`) |
| Edge changes | `ai-mark` → `xp_record_mark`; `study-hub` → `xp_award_server` plus a minimum time |

## Known gaps → roadmap M-9

1. **False positive:** the "ai-style" regex in `jsAnswerCredibility` matches the plain word "AI". Narrow it to boilerplate phrases.
2. **Move credibility server-side:**
   - add an `xp_answer_reviews` queue;
   - add an async edge function that scores answers with `_shared/ai.ts` (cheap model plus heuristics);
   - claw XP back via a `security definer` RPC;
   - show the outcome on the profile.
3. **Consolidate the three `increment_xp` definitions** (M-1).
