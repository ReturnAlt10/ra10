/* BTEC Computing (AAQ) Unit 3 — per-criterion assignment help (RA10’s guidance; your work must be your own). */
(function () {
  'use strict';
  const CH = (means, evidence, next) => `<p><b>What it means:</b> ${means}</p><p><b>Evidence to include:</b></p><ul>${evidence.map(e => `<li>${e}</li>`).join('')}</ul>${next ? `<p><b>Reaching the next grade:</b> ${next}</p>` : ''}`;
  window.AAQ_CRIT_HELP = {
    _intro: '<h3>Before you start</h3><p>Read the brief carefully and list every requirement in a table – you will tick it off in your designs, solution and review. Collect screenshots of existing systems to analyse for learning aim A and to research for B. Keep every version of your designs.</p>',
    _tips: '<ul><li>Name the principle every time (e.g. Shneiderman’s “informative feedback”, gestalt proximity).</li><li>Show iterations – sketch, wireframe, final – with reasons for changes.</li><li>Test with real users from the target audience and record feedback.</li><li>Back every review judgement with evidence.</li></ul>',
    'group:A': 'Learning aim A: UX/UI concepts, interaction types, use and purpose, design principles.',
    'group:B': 'Learning aim B: proposal and designs for the brief.',
    'group:C': 'Learning aim C: building, testing and reviewing your HCI solution.',
    'A.P1': CH('Explain the UX and UI considerations that affect HCI design.', ['UX vs UI and links; UX concepts; UI concepts; the five interaction types with benefits/drawbacks.'], 'For M1, analyse how principles are applied in real systems.'),
    'A.P2': CH('Describe how the use and purpose of systems affects HCI design.', ['Platforms, user types, demographics, accessibility, sectors, purposes and outputs, haptics, assistive technologies.'], null),
    'A.M1': CH('Analyse how HCI principles are applied for effective UX/UI.', ['Real examples (screenshots) analysed against Shneiderman, gestalt, colour, recognition, behavioural models.'], 'For D1, evaluate how well they are applied.'),
    'A.D1': CH('Evaluate how HCI principles are applied.', ['Strengths and weaknesses of real systems, the impact on users, and justified judgements and improvements.'], null),
    'B.P3': CH('Produce an adequate proposal meeting most requirements.', ['Overview of requirements, scope (tasks, inputs, outputs, user needs), research of similar systems.'], 'For M2, make the proposal meet all requirements with clear justification.'),
    'B.P4': CH('Produce adequate designs with some awareness of UX/UI principles.', ['Wireframes/sketches, task flows, style guide, user stories/personas, functional and non-functional requirements.'], 'For M3, add detail and explicitly link designs to principles.'),
    'B.M2': CH('Produce a good proposal that meets the brief.', ['All requirements covered and justified; constraints identified.'], null),
    'B.M3': CH('Produce detailed designs with good awareness of principles.', ['Annotated wireframes/storyboards; complete style guide with contrast; technical designs (algorithms, wiring).'], 'For D2, make proposal and designs comprehensive with iterations.'),
    'B.D2': CH('Comprehensive, effective proposal and designs.', ['Everything a developer would need; iterations with reasons; accessibility fully considered.'], null),
    'C.P5': CH('Produce an adequate HCI solution meeting most of the brief.', ['Working interface with prepared content, event handling, basic testing.'], 'For M4, make it effective against all requirements.'),
    'C.P6': CH('Partially supported review of how far the solution meets the brief.', ['Comments on audience, ease of use, quality, constraints, with some evidence.'], 'For M5, support most points with evidence.'),
    'C.M4': CH('Produce an effective HCI solution meeting the brief.', ['All requirements met; alternative interface or hardware integration; testing with improvements.'], 'For D3, refine to a highly effective, polished solution.'),
    'C.M5': CH('Mostly supported review.', ['Most judgements backed by test results and user feedback; strengths and weaknesses.'], 'For D4, support every judgement.'),
    'C.D3': CH('Produce a highly effective solution fully meeting the brief.', ['Polished, accessible, optimised; refinements from user testing clearly documented.'], null),
    'C.D4': CH('Fully supported review.', ['Every judgement evidenced; quality characteristics, legal/ethical issues, constraints; prioritised improvements.'], null)
  };
})();
