# PL-08 — AI-marking benchmark set

- **When:** you add a subject or examiner module, or change the AI providers, models or prompts.
- **Why:** this is the only objective measure of AI Examiner accuracy (risk R-17).

## Files

- `tools/quality/build_bench.py`: builds the benchmark sets.
- `admin/quality/bench/<set>.json` and `admin/quality/bench/index.json`.
- The runner is in `/admin/quality` (owner only). It rebuilds the exact question object inside a hidden unit frame (for AQA, `AqaPapers.buildQuestions`) and calls the live AI Examiner.

## Steps

1. **Source the marked exemplars.**
   - Use the examiner reports, commentaries and exemplar materials with senior-examiner marks.
   - **Transcribe handwritten scripts exactly.** Do not tidy them: the marks were given for what was written.
   - Psychology's EX-S4 commentary is about 85 pages of scanned handwriting, still to be transcribed.
2. **Record each item** with: the paper id, question number and sub-part (so the runner can locate the real question), the student answer text, the examiner mark and level, and the source.
3. **Run `python tools/quality/build_bench.py`** (extend it with a new set builder), then commit the JSON. It contains short student answers and marks only, not whole papers.
4. **Run the benchmark** in `/admin/quality`. Record:
   - mean absolute error (marks);
   - the share within ±1 level;
   - bias (over- or under-marking).
5. **Save a quality snapshot** (`quality_save_snapshot`) so trends are kept.

## Verify

- [ ] At least 20 items per subject, covering every extended tariff.
- [ ] Baseline metrics are recorded in the snapshot, and the new examiner is not worse than the previous baseline.
