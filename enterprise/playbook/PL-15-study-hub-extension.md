# PL-15 — Study Hub: new step type or coding language

**Files:**

- client: `study-hub/study.js` (player `next()`, `CHECKABLE`, paths), `study-hub/study.css`, `study-hub/code-runner.js` (`SHCode`), `study-hub/icons.js`;
- server: `supabase/functions/study-hub/index.ts`;
- database: `supabase/sql/study-hub.sql`.

## New step type

1. **Server.** In `supabase/functions/study-hub/index.ts`:
   - add the type to the step schema in the generation prompt, with exact JSON fields;
   - add it to the verification pass (`verifySteps`), unless it is self-verifying like `code`;
   - normalise it and reject malformed steps.
2. **Client.** In `study.js`:
   - render it in `next()`;
   - add it to `CHECKABLE` if it is scored;
   - give it a recap line.

   Style it in `study.css`, with overlays `position:fixed!important`.
3. **Accuracy gate.** Answer keys must be produced or checked with `preferStrong:true`. Exam-style steps are marked by the real AI Examiner (`RA10.examineAnswer`), not by the Study Hub `mark` fallback.
4. **Unverifiable steps** set `s._skip`. They are not shown and not scored.
5. Bump `?v=` for `study.js` / `study.css` in `study-hub/index.html`. The owner deploys the `study-hub` function.

## New coding language

1. **Server:** add the language to `CODE_LANGS`, and map units to it in `codingLang()` (Python: Computing U1/U4; SQL: IT U4; JavaScript: IT U3).
2. **Runner:** add a runner to `SHCode` in `code-runner.js`. It must:
   - run in a Worker with a timeout;
   - pin the CDN version;
   - support both the `verify()` path (run the AI solution against the tests, before showing the step) and the `check()` path (run the learner's code).
3. **Expected outputs:** the AI writes the solution and test inputs only. Expected outputs are generated **by running the solution**, never by the AI.

## Verify

- [ ] Generate 5 lessons for the target unit. Every step renders, and the verified answers are correct.
- [ ] A broken AI step is skipped, not shown.
- [ ] The trial and Premium rules are unchanged (`study_hub_premium()`).
- [ ] Check signed in as a Premium user, a trial user, and a teacher using template preview.
