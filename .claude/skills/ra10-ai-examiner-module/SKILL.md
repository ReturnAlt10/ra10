---
name: ra10-ai-examiner-module
description: Add or change a specification-specific AI Examiner marking module in the ai-mark Supabase edge function (predicate, system prompt, prompt builder, post-processor), route it, test and benchmark it. Use when a new subject needs board-accurate AI marking or marking accuracy must improve.
---

# AI Examiner module

**Pipeline:** `enterprise/playbook/PL-07-ai-examiner-module.md`. Benchmarks: `PL-08-ai-benchmark-set.md`.

## Pattern

Every module in `supabase/functions/ai-mark/*_examiner.ts` exports four things:

```ts
export function isSubject(q: AnyObj): boolean              // strict: spec code / board / unit path
export const SUBJECT_SYSTEM = [ ... ].join("\n")           // examiner persona, AO weights, rules
export function buildSubjectPrompt(q: AnyObj, answer: string): string   // question, ms.body, ms.levels, extracts, level grid
export function subjectPostProcess(raw: AnyObj, q: AnyObj, answer: string): AnyObj   // clamp 0..q.marks, normalise
```

The closest models to copy:

- `psychology_examiner.ts` (`gridPsy`, `aoSplit`; AO1/AO2/AO3);
- `edexcel_business_examiner.ts` (`gridEdx`, `skillSplit`; Knowledge, Application, Analysis, Evaluation);
- `business_2026_examiner.ts` (AQA 7138).

## Steps

1. **Gather the marking rules** from the board's mark schemes and examiner reports: AO split per tariff, level descriptors, "do not accept" patterns, and how extracts must be used. **Paraphrase them;** do not paste long copyrighted text.
2. **Write the module.** The post-processor must return the **same response shape** as its siblings, because unit apps render it.
3. **Route it** in `ai-mark/index.ts`. Add the import, and put the predicate **before** broader ones. The current order is Edexcel → Psychology → AQA 2026 → AQA 2023 → Sport U2 → BTEC Business → IT Unit 2 → IT Unit 14 (2016 Nationals, `it_unit14_examiner.ts`, spec code 20161K) → generic. Levels-marked answers of 9+ marks in AQA 7132 / 7138 and IT Unit 2 are marked twice by two strong models and combined (`markWithEnsemble`; `AI_MARK_ENSEMBLE=off` disables it).
4. **Type-check:** `deno check supabase/functions/ai-mark/index.ts`.
5. **Test locally:** `npx supabase functions serve ai-mark`. POST weak, middle and strong exemplar answers for each extended tariff, plus an empty or gibberish answer, which must score 0.
6. **Benchmark** in `/admin/quality` against marked exemplars (PL-08). The target is at least 80% within ±1 level.
7. **Deploy:** only the owner deploys (`npx supabase functions deploy ai-mark`). Ask first.

## Regression check

After the change, mark one question each from AQA 7132, a BTEC unit and Psychology, and confirm the routing is unchanged.
