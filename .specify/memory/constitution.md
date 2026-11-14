# RA10 Constitution

These principles bind every specification, plan and change to RA10. If a spec or plan conflicts with this document, this document wins. Amendments need the owner's approval and a version bump (see the end).

## Core principles

### I. Content accuracy above all (NON-NEGOTIABLE)

- **No real-world claims without a source.** Learning content never presents invented facts, statistics, survey results or chart data as real. Illustrative figures are labelled as illustrative.
- **Every worked answer is verified.** That covers each calculation, code sample, mark scheme and answer key. A wrong mark scheme is worse than no question.
- **AI-generated learning material is verified before learners see it.** Answer keys are checked by a second, stronger model pass, code is executed, and real exam questions are fetched rather than re-created. Anything unverified is withheld.

### II. Exam fidelity

- **Real papers are reproduced in their real layout:** the same sections, tariffs, totals, timings, extracts and mark schemes.
- **RA10 practice papers mirror that layout exactly.** They use fictional organisations with internally consistent data.
- **Labels follow the qualification's own conventions.** BTEC uses learning aims (A, B, C…). A-Level uses chapters (for example Psychology 1.1–3.10). Specification wording is followed, even where it is unusual.
- **Off-specification content is flagged, never silently mixed in.**

### III. Copyright and licensing

- **Exam-board source material (specifications, papers, mark schemes, examiner reports, PSABs) never enters version control** and is never published, except as the transformed, attributed paper data the apps need.
- **Source folders are git-ignored before files are added.**
- **No copied exam-board prose** in guides, banks or AI prompts beyond short, necessary quotations.

### IV. Learner safety, privacy and integrity

- **Learners are often under 18.** Collect the minimum data, define retention, avoid dark patterns, and moderate community spaces (AI first pass, human review and restore).
- **Authorisation is server-side.** Identity comes from the verified JWT. Entitlements (tier, credits, roles, XP) change only through server code, triggers or `security definer` RPCs. Client claims are never trusted.
- **Rewards reflect genuine learning.** XP is rate-limited, tied to recorded learning activity, and withheld for low-effort or nonsense answers.
- **AI never grades internally assessed coursework drafts** (authenticity rules). AI marking of exam answers follows the board's mark scheme and level descriptors.

### V. Owner approval for production

- **Production changes need the owner's approval:** SQL, edge-function deploys, secrets, payments configuration and site-wide announcements.
- **Pushing to `main` deploys.** Changes reach `main` only after review and the release checks (playbook PL-13).

### VI. Generated vs authored

- **Generated artefacts are reproducible from their generator and are never hand-edited.** Examples: unit shells, `spec.js`, `papers-data.js`, assembled A-Level files, the registry block.
- **Fixes go into the generator, its patch lists or the authored content parts,** followed by a rebuild.
- **One source of truth per concept:**
  - the unit registry (`refresh/ra10-units.js`);
  - Premium status (`study_hub_premium()`);
  - each SQL function (one definition).

### VII. Simplicity and compatibility

- **The platform stays a static frontend plus Supabase** unless a change is justified in a plan's complexity tracking.
- **Public contracts change only with a compatibility path.** These are the `window.*` globals, the content APIs, the `?ra10catalog` protocol, public URLs and localStorage keys.
- **Every change ships with cache-token bumps** for the shared assets it touches.

### VIII. Verified before "done"

A change is done only when:

1. its pipeline checks pass;
2. it has been exercised in a real browser with no console errors, at 390 px phone width and in dark mode;
3. the repository health check reports no failures.

## Quality gates (apply to every plan)

| Gate | Evidence |
|---|---|
| Accuracy | Verification notes: recalculated numbers, executed code, cross-checked mark schemes |
| Exam fidelity | Paper totals and sections match the real paper |
| Security | Server-side authorisation, RLS on new tables, no client-trusted entitlements |
| Privacy | Data inventory and retention for new personal data |
| Compatibility | Public contracts unchanged, or a migration path given |
| Verification | Checker output, browser test, `enterprise/scripts/health_check.py` with 0 FAIL |

## Governance

- **Precedence:** this constitution supersedes conflicting guidance in specs, plans, playbooks and skills.
- **Amendments:** propose the change in a PR that edits this file, state its impact on existing specs, and get the owner's approval. The version follows semantic versioning: MAJOR when a principle is removed or redefined, MINOR when a principle is added, PATCH for wording.
- **Review:** reviewers check plans and PRs against the quality gates above.

**Version**: 1.0.0 | **Ratified**: 2026-11-12 | **Last Amended**: 2026-11-12
