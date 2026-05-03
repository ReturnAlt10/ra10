# Shared Brief — BTEC IT Unit 1 Question Generation

You are generating BTEC Level 3 National Extended Certificate in IT — Unit 1: Information Technology Systems exam questions, fully aligned to the new AAQ 2025 spec (Pearson, Issue 5, November 2025).

## Hard requirements
1. Output must be a single valid JSON file (UTF-8) — array of 100 question objects.
2. **DO NOT** wrap output in markdown code fences. Write JSON only.
3. Each question must be in the **identical style, tone, and format** of real Pearson Unit 1 papers.
4. Mark schemes must use Pearson's wording conventions (see below).
5. Save to the exact file path specified in your task.

## Question object schema
```json
{
  "id": "A001",
  "learning_aim": "A",
  "topic": "A1.1.4 Servers",                       // spec reference + topic
  "command_verb": "Explain",                        // State / Give / Identify / Describe / Explain / Discuss / Evaluate / Draw
  "marks": 4,
  "ao": "AO1+AO2",                                  // assessment objective(s)
  "scenario": "Riverside Books is an independent bookshop with two branches…",  // realistic UK business context
  "question": "Explain two benefits to Riverside Books of installing a file server.",
  "guidance": "(2)",                                 // marks bracket label as printed on real paper, e.g. (2), (4), (9)
  "type": "short" | "extended_levels" | "draw",
  "mark_scheme": {
    "instruction": "Award one mark for identification and one mark for an appropriate linked justification/expansion, up to a maximum of four marks.",
    "points": [
      "Centralised storage of files (1) so staff at both branches can access the same data (1)",
      "Backups can be automated from one location (1) reducing the risk of data loss (1)",
      "User permissions can be controlled centrally (1) restricting access to sensitive files (1)",
      "Reduces duplication of files across machines (1) saving disk space and avoiding version conflicts (1)"
    ],
    "additional_guidance": "Accept any other appropriate/alternative response",
    "do_not_accept": null
  }
}
```

For **levels-based** questions (Discuss 6/8 marks; Evaluate 9/12 marks; Draw 6 marks), use:
```json
{
  "type": "extended_levels",
  "mark_scheme": {
    "indicative_content": [
      "Cost savings — no need for in-house servers, reduced maintenance staff",
      "Scalability — pay only for what is used, can scale up at busy periods",
      "Security implications — data held by third party, dependence on provider",
      "..."
    ],
    "level_descriptors": [
      {"level": 0, "marks": "0", "descriptor": "No rewardable material."},
      {"level": 1, "marks": "1–3", "descriptor": "Demonstrates basic application of knowledge and understanding that is partially relevant to the context of the question and may consider only one side of the context. (AO2) Demonstrates a basic analysis... (AO3a) Demonstrates a basic evaluation... (AO3b)"},
      {"level": 2, "marks": "4–6", "descriptor": "Demonstrates good application... (AO2) Demonstrates a good analysis... (AO3a) Demonstrates a good evaluation... (AO3b)"},
      {"level": 3, "marks": "7–9", "descriptor": "Demonstrates comprehensive application... (AO2) Demonstrates a thorough analysis... (AO3a) Demonstrates a thorough evaluation... (AO3b)"}
    ]
  }
}
```

## Required mark distribution per Learning Aim (100 questions)
| Marks | Type            | Count |
|-------|-----------------|-------|
| 1     | State/Give/Identify | 15 |
| 2     | Give two / Explain one | 20 |
| 3     | Explain (linked)    | 10 |
| 4     | Describe / Explain two | 25 |
| 6     | Discuss (Levels)    | 15 |
| 8     | Discuss (Levels)    | 10 |
| 9     | Evaluate (Levels)   | 4  |
| 12    | Evaluate (Levels)   | 1  |
| **Total** |             | **100** |

(For Aim A only: include 1 × 6-mark "Draw a flowchart" and 1 × 6-mark "Draw a network diagram" within the 15 six-mark slots.)

## ID convention
- A001…A100, B001…B100, etc.

## Scenario variety
Use a wide range of realistic UK contexts: independent retailers, cafes, dental practices, primary/secondary schools, sixth-form colleges, charities, leisure centres, sports clubs, photographers, accountancy firms, manufacturing companies, design studios, courier firms, online tutors, vet practices, garages, theatre groups, recording studios, recruitment agencies, construction firms, food production, libraries, museums, estate agents, hotels, taxi companies, etc. **Do not reuse the same scenario more than 3 times** across your 100 questions.

## Style rules (matching real Pearson papers)
- Scenario sentences: short, factual, present tense. e.g. "Greenleaf Garden Centre sells plants and gardening tools at three sites and through a website."
- Question stems begin with the command verb (e.g. "State two…", "Describe how…", "Discuss the implications of…", "Evaluate the impact of…").
- Always include the "(N)" marks indicator after the question.
- Mark scheme bullets show the (1) marks with explicit linked clauses for "Explain" questions.
- Always end short-answer mark schemes with: "Accept any other appropriate/alternative response".
- Levels-based questions must reference AO2, AO3a (analysis), and AO3b (evaluation) appropriately.
- Discuss questions = AO2 + AO3a only. Evaluate questions = AO2 + AO3a + AO3b.

## Example references (real Pearson questions)
- "Give two external threats to unsecured data." (2 marks, "1 ID per item")
- "Describe the process used by a system to authenticate passwords." (4 marks, linked points)
- "Explain two validation methods the shop could use in their data entry form to ensure data is accurate." (4 marks, 2 × ID+expansion)
- "Explain one way a VPN ensures any data accessed remotely is secure during transmission." (2 marks, ID+expansion)
- "Discuss the implications of the move to online-only sales for the mobile phone shop." (6 marks, levels-based)
- "Evaluate the cost implications for the retail company of a move to cloud computing. You should consider: Benefits, Drawbacks." (9 marks, levels-based)

## Coverage requirement
Across the 100 questions for your Learning Aim, you MUST cover ALL named sub-topics from the spec (e.g. for Aim A: A1, A2, A3, A4, A5 — and within each, all bulleted concepts). Distribute questions so no sub-topic is missed.

## Quality bar
- No duplicates / near-duplicates.
- No factual errors.
- Mark schemes must be technically correct and substantive.
- Mark scheme points must total at least the marks available (e.g. for a 4-mark "Describe", give 6+ credit-worthy points).
- Indicative content for 9-mark Evaluate questions must list 12+ substantive points across both sides.

## Save
Save the JSON array to: `/home/user/workspace/btec-tool/data/aim_<LETTER>.json`
(LETTER = A, B, C, D, E, or F — your specific aim is in the task instructions.)
