# Copilot Instructions — Build BTEC Sport Unit 1 Revision Tool

## What to build
A complete revision web app for BTEC Level 3 Sport Unit 1 Anatomy and Physiology.

## Where to build it
revision/btec/level-3/sport/unit-1/
  index.html
  js/data-loader.js
  js/app.js
  css/style.css

## Base it on
Copy the FULL structure, CSS design system, tabs, sidebar, XP system, 
daily tasks, progress saving, and app.js logic from:
  revision/btec/level-3/IT-AAQ/unit-1/
Then replace ALL content with Sport Unit 1 anatomy and physiology content.

## Key differences
- Brand colour: #059669 (emerald green)
- Learning sections: A B C D E F (see SPEC.md for full content)
- Question style: see QUESTION-EXAMPLES.md for exact format
- "Accept phonetic spelling" must appear in all anatomy mark schemes
- DNA (Do Not Accept) notes included where relevant
- Impact on performance conclusion required in all 6+ mark questions for L3
- 6-mark questions use L1-L3 levels-based mark scheme
- 8-mark questions use L1-L3 levels-based mark scheme (L3 = 7-8)
- Named athlete scenarios required in ALL questions

## Question targets — match IT Unit 1 in quantity
Write 600+ exam-style questions total spread across sections A-F, 
approximately 100 per section. Aim for same volume as IT Unit 1.

Per section write:
- 25 label/name questions (1-3 marks, anatomy recall, use described diagrams)
- 35 explain/describe questions (2-4 marks, point + linked development)
- 25 analyse questions (6 marks, levels-based L1-L3)
- 10 evaluate/interrelationship questions (6-8 marks)
- 5 calculation-style questions for Section D and E 
  (e.g. calculate cardiac output given HR and SV)

## Named athlete contexts — use consistently
Netball: Steph, Nancy, Shantel (goalkeeper)
Tennis: Robin (male), Dave, Nancy (female)
Football/Hockey: Sammy, Callum, Rhea
Athletics: Luke (decathlete), Boris (long jumper), Crystal (cyclist)
Rugby, Swimming, Basketball: invent appropriate names
ALWAYS name the athlete and specify their sport in every question.

## Mark scheme format for each question type

Short point-based (1-4 marks):
{
  type: 'points',
  instruction: 'Award one mark for each correct point',
  points: ['Humerus (1)', 'Ulna (1)', 'Radius (1)'],
  note: 'Accept phonetic spelling. DNA: [wrong answers]'
}

Explain with development (2