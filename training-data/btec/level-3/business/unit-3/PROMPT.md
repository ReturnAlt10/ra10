# Copilot Instructions — Build BTEC Business Unit 3 Revision Tool

## What to build
A complete revision web app for BTEC Level 3 Business Unit 3 
Personal and Business Finance.

## Where to build it
revision/btec/level-3/business/unit-3/
  index.html
  js/data-loader.js
  js/app.js  
  css/style.css

## Base it on
Copy the full structure, CSS, UI and app logic from:
  revision/btec/level-3/IT-AAQ/unit-1/
Then replace all content with Business Unit 3 content.

## Key differences from IT Unit 1
- Brand colour: #1a56db (blue) not dark green
- Subject: Personal and Business Finance not IT Systems
- Learning aims: A B C D E F (see SPEC.md for content)
- Question styles: see QUESTION-EXAMPLES.md
- Calculation questions require a special UI — show a workings box 
  with a textarea before revealing the mark scheme
- 12-mark questions use a 4-level mark scheme
- 6-mark questions use a 3-level mark scheme

## Questions to write (see QUESTION-EXAMPLES.md for style guide)
Write at least 250 questions total, roughly 40 per aim A-F:
- 15 questions worth 1-2 marks per aim (Give/State/Identify)
- 15 questions worth 2-4 marks per aim (Explain)
- 5 discussion questions worth 6 marks per aim (Discuss)
- 3 evaluate questions worth 12 marks per aim (Evaluate)  
- 5 calculation questions for aims E and F only
All questions must have realistic named business/personal scenarios.
All questions must have full mark schemes.

## Quiz questions
Write 80 multiple choice questions covering all 6 aims.
Include questions on: definitions, true/false features, formulas, 
calculations with 4 options.

## Flashcards
Write 60 flashcards:
- 20 key term definitions
- 15 financial formulas with worked examples
- 15 financial product features
- 10 advantages/disadvantages

## Progress/XP/Sessions
Use EXACTLY the same system as IT Unit 1 but with these session_type values:
  'quiz_business_u3'
  'practice_business_u3'  
  'mock_business_u3'
  'flashcard_business_u3'
This keeps Business Unit 3 progress separate from IT Unit 1 progress.
XP awards, daily tasks, sidebar — all work identically.

## Page title and branding
Title: "BTEC Business Unit 3 — Personal and Business Finance"
Subtitle: "Personal and Business Finance · Pearson Level 3"
Icon: "U3" in blue (#1a56db) box