# PL-07 — New AI Examiner module for a specification

- **When:** a subject's marking style differs from the generic examiner, for example AO-weighted levels, board-specific level wording or extract-based evaluation.
- **Skill:** `.claude/skills/ra10-ai-examiner-module`.

## How routing works

`supabase/functions/ai-mark/index.ts` reads the question object and checks predicates in order:

1. `isEdexcelBusiness`
2. `isPsychology`
3. `is2026Business`
4. `isALevelBusiness`
5. … BTEC business and sport
6. generic

Each predicate checks fields such as `spec_code`, `board`, `paper` and the unit path. Each module exports a prompt builder and response normaliser that use the board's level descriptors.

## Steps

1. **Collect the marking rules** from the board's mark schemes and examiner reports:
   - AO split per tariff;
   - level descriptors per tariff;
   - "do not accept" patterns;
   - extract-use expectations.

   Paraphrase them; do not paste long copyrighted passages.
2. **Create `supabase/functions/ai-mark/<subject>_examiner.ts`.**
   - Model it on `psychology_examiner.ts` (AO1/AO2/AO3 levels) or `edexcel_business_examiner.ts` (Knowledge, Application, Analysis, Evaluation).
   - Follow the **four-export pattern** that every module uses:

     ```ts
     export function isSubject(q): boolean                     // strict predicate (spec code / board / unit path)
     export const SUBJECT_SYSTEM = [ ... ].join("\n")          // examiner persona + rules
     export function buildSubjectPrompt(q, answer): string     // question, mark scheme (ms.body, ms.levels), extracts, levels grid
     export function subjectPostProcess(raw, q, answer)        // clamp marks to 0..q.marks, normalise levels and feedback
     ```

   - Optional helpers follow the existing names: a levels grid (`gridPsy`, `gridEdx`) and an AO or skill split (`aoSplit`, `skillSplit`).
   - The post-processor must return the **same response shape** as the other modules, because the unit apps render it.
3. **Route it** in `index.ts`: import the module and add the predicate **before** broader checks. Order matters: Edexcel and Psychology are first.
4. **Use strong models.** Level-of-response marking calls the provider chain with paid or strong models first.
5. **Type-check:** `deno check supabase/functions/ai-mark/index.ts`.
6. **Test locally:** `npx supabase functions serve ai-mark`. POST three answers per tariff (weak, middle, strong) taken from examiner-report exemplars.
7. **Benchmark** (**PL-08**): add marked exemplars and run the benchmark in `/admin/quality`.
8. **Deploy** (owner): `npx supabase functions deploy ai-mark`.

## Verify

- [ ] Exemplar answers land within ±1 level of the examiner's mark, and within ±10% of marks on the benchmark set.
- [ ] Marks never exceed the tariff, and an empty or gibberish answer scores 0.
- [ ] Other subjects' routing is unchanged: run one question each from 7132, a BTEC unit and Psychology.
