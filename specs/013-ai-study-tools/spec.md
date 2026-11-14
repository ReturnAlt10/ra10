# Feature Specification: AI study tools

**Status**: As-built (13 Nov 2026)

Tools that help learners **before** they can write a full extended answer, as well as alongside the AI Examiner (spec 003).

## User Scenarios & Testing

### US1 — Fix the weak link (P1)

1. **Given** an AI Examiner mark below full marks, **Then** a card offers "Fix the weak link".
2. **When** the learner opens it, **Then** the weakest sentence is highlighted with its problem: the chain of analysis stops, it isn't applied to the case, the judgement isn't justified, or a key term is unclear. They also get a nudging question; the improved sentence is never written for them.
3. **When** they rewrite the sentence, **Then** the AI rates it out of 3. A strong rewrite can be put straight back into their answer.

### US2 — AJIM checklist (P1, free)

1. **Given** an evaluate, assess, justify, discuss, recommend or "to what extent" question worth 9+ marks, **Then** an "AJIM check" toggle appears under the answer box.
2. **When** it is on, **Then** Answer, Justify, It depends and Most important tick live as the learner writes the final judgement.
3. "Check with AI" gives a proper check, with tips.

### US3 — Blurt & Grill (Premium with free tries; Study Hub)

1. The learner picks a unit and a learning aim or chapter, then speaks or types everything they remember for 60 or 120 seconds.
2. **Then** each specification point is shown as covered, vague or missed.
3. **Then** a 2-question drill on the gaps follows, answered by voice or text and marked out of 2 each.

### US4 — Part A / Part B simulator (Premium with free tries)

1. The learner picks a supported unit:
   - BTEC Business Units 2, 6 and 7;
   - BTEC Sport Unit 2;
   - BTEC Nationals IT (2016 spec) Unit 14 — IT AAQ Unit 2 is an exam, so it is not included.
2. **Then** a mock Part A pack is written about a fictional organisation, with scenario text, tables and bar charts.
3. The learner writes Part A notes against a 45- or 20-minute timer.
4. **Then** they see which key facts, SWOT points and risks they noted, half-noted or missed.
5. They sit a timed Part B with their notes beside them; it is marked with levels, what went well and even better if.

### US5 — Bug Hunt (Premium with free tries)

1. The learner chooses Python, SQL or OCR pseudocode at BTEC, GCSE or A-Level.
2. **Then** they get a short program with 1–2 subtle logic bugs.
3. **For Python and SQL:** a challenge is shown only if the model fix passes every test and the buggy code fails at least one, both checked by running them in the browser. The learner's fix is checked by running it.
4. **For pseudocode:** the fix and explanation are marked by the AI out of 3.

### US6 — Scan your work (free)

1. A photo of a handwritten answer becomes editable text, which the AI Examiner marks.
2. A photo of handwritten flashcards becomes cards that are saved to a deck.
3. Decks are revised with spaced repetition (Leitner boxes 1–5).

### US7 — Spec-gap daily task (free)

1. **Given** an AI Examiner mark under 60% in the last 7 days, **Then** today's AI-slot task becomes "Fix your weak spot" on that topic.
2. The drill uses real bank questions where possible; otherwise AI questions that pass a second check.
3. 2 or more right out of 3 lets the learner claim the task XP.

## Requirements

- **FR-001**: Premium tools MUST be gated on the server. Learners get free tries first: coach 3, blurt 3, prerelease 2, bughunt 3.
  - A try MUST be given back when the AI call fails.
  - Premium is `study_hub_premium()`.
- **FR-002**: Every AI call MUST count against the `ai_tools` hourly and daily usage limit. Premium and EDU are not limited.
- **FR-003**: AI tools MUST require sign-in and accepted terms.
- **FR-004**: Content shown as fact MUST be accurate:
  - pre-release packs are about fictional organisations, and their figures are labelled as made up;
  - drills prefer the unit's verified bank;
  - Bug Hunt challenges are proved by running them.
- **FR-005**: Learners' scanned cards are private (row-level security means only the owner can read or change them).

## Success Criteria

- **SC-001**: No Premium tool runs for a non-Premium learner who has used all their free tries.
- **SC-002**: No Bug Hunt challenge is shown whose bug was not demonstrated by a failing test.

## Additions (14 Nov 2026)

- **Blurt a topic:** the picker lists the topics inside each learning aim or chapter.
  - A topic with sub-points (for example A1 → A1.1, A1.2) uses them as the checklist.
  - A topic with none gets a 5–8 point checklist written by the AI from the topic's specification wording.
- **Blurt by pen:** the Type / Write / Talk modes can be mixed.
  - **Write:** a stylus pad (`refresh/ra10-ink.js`) with pressure, palm rejection, eraser and undo. The handwriting is read by `ai-transcribe` when the blurt ends.
  - **Grill:** answers can also be written with the pen.
- **Voice:** every speech button uses `refresh/ra10-voice.js` (`RA10Voice`), a glass AI orb that reacts to the microphone level (Web Audio) while the Web Speech API transcribes.
  - Any `<textarea data-voice>` gets a voice button automatically; the scanner and Part A/B use this.
- **Flashcards (free, Study Hub):** `study-hub/flashcards.js` (`SHCards`).
  - Decks are typed (Ctrl+Enter quick add, or paste a list) and revised with Leitner spaced repetition.
  - **Pictures:** a Wikimedia Commons search or a pasted https link; only the link is stored.
  - **Sync:** cards sync through `user_flashcards` (own rows only).
- **Part A / Part B:** IT AAQ Unit 2 is removed (it is an exam); BTEC Nationals IT (2016) Unit 14 is added.
