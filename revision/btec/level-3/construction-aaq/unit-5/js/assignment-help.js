/* BTEC Construction (AAQ) Unit 5 — per-criterion assignment help (RA10’s guidance; your work must be your own). */
(function () {
  'use strict';
  const CH = (means, evidence, next) => `<p><b>What it means:</b> ${means}</p><p><b>Evidence to include:</b></p><ul>${evidence.map(e => `<li>${e}</li>`).join('')}</ul>${next ? `<p><b>Reaching the next grade:</b> ${next}</p>` : ''}`;
  window.AAQ_CRIT_HELP = {
    _intro: '<h3>Before you start</h3><p>Plan your <b>survey</b> using a checklist: location, structure, condition, heating, energy supply, water, existing EPC and assumptions. Take dated photos and measurements, and interview the end users about comfort and bills. Everything in aims B and C builds on this survey.</p>',
    _tips: '<ul><li>Apply fabric first, and explain why.</li><li>For every solution, state the potential issues and how you would prevent them.</li><li>Your programme must follow a logical sequence – explain each dependency.</li><li>Use payback and heat-loss calculations to support priorities, and show your working.</li></ul>',
    'group:A': 'Learning aim A: survey, retrofit solutions, potential issues and suitability.',
    'group:B': 'Learning aim B: programme of work and safe system of work.',
    'group:C': 'Learning aim C: recommendations and measuring actual benefits.',
    'A.P1': CH('Survey an existing building and detail potential retrofit solutions.', ['Completed survey with photos and notes; list of suitable solutions linked to end-user requirements.'], 'For M1, discuss how solutions apply, with issues.'),
    'A.P2': CH('Explain potential issues with selected solutions.', ['Damp/mould, compatibility, obsolete components, existing defects, structural capacity.'], null),
    'A.M1': CH('Discuss how solutions apply, with sound consideration of users and issues.', ['For each solution: fit to building, benefits for the user, issues and prevention.'], 'For D1, evaluate in depth and reach judgements.'),
    'A.D1': CH('Evaluate solutions with in-depth consideration of users and issues.', ['Weigh options (cost, comfort, payback, risk); whole-building thinking; justified choices.'], null),
    'B.P3': CH('Produce a realistic outline programme of work.', ['Task list and Gantt chart in a logical sequence based on the survey.'], 'For M2, make it detailed with a safe system of work.'),
    'B.P4': CH('Develop an outline safe system of work.', ['Risk assessment, method statement outline, asbestos, work at height, occupant protection, PPE.'], null),
    'B.M2': CH('Detailed programme with a safe system of work.', ['Durations, dependencies, critical path, sign-offs; detailed method statements; legislation applied.'], 'For D2, make it comprehensive and fully justified.'),
    'B.D2': CH('Comprehensive programme and safe system of work.', ['Every task sequenced and justified; full safety and legislative coverage; contingency for issues found.'], null),
    'C.P5': CH('Explain your recommendations using appropriate communication.', ['Proposal document/presentation with recommended solutions and key information.'], 'For M3, discuss with reference to priorities.'),
    'C.P6': CH('Describe methods of measuring actual vs theoretical benefit.', ['EPC vs EUI, meter readings, U/R values, CO₂, kWh, thermal imaging, airtightness.'], 'For M4, discuss methods and importance.'),
    'C.P7': CH('Explain why comparing actual and theoretical benefit matters.', ['Value for money, finding faults, improving designs, user education.'], null),
    'C.M3': CH('Discuss recommendations clearly, referencing priorities.', ['Prioritised list using cost-benefit, payback, disruption and savings.'], 'For D3, evaluate fully developed, prioritised solutions.'),
    'C.M4': CH('Discuss measurement methods and their importance.', ['Strengths/limitations of each method; causes of the performance gap.'], 'For D4, evaluate the methods.'),
    'C.D3': CH('Evaluate fully developed, prioritised recommendations.', ['Justify every decision with evidence; effective communication for the audience.'], null),
    'C.D4': CH('Evaluate measurement methods, justifying their importance.', ['Judge accuracy and practicality of each method; justified conclusion.'], null)
  };
})();
