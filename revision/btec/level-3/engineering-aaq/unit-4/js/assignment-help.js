/* BTEC Engineering (AAQ) Unit 4 — per-criterion assignment help (RA10’s guidance; your work must be your own). */
(function () {
  'use strict';
  const CH = (means, evidence, next) => `<p><b>What it means:</b> ${means}</p><p><b>Evidence to include:</b></p><ul>${evidence.map(e => `<li>${e}</li>`).join('')}</ul>${next ? `<p><b>Reaching the next grade:</b> ${next}</p>` : ''}`;
  window.AAQ_CRIT_HELP = {
    _intro: '<h3>Before you start</h3><p>Start a dated <b>logbook</b> on day one – it is evidence for almost every criterion. Research the project theme, write a clear problem statement, and develop <b>at least three</b> genuinely different solutions before choosing one.</p>',
    _tips: '<ul><li>Use precise technical language throughout (A.D1 requires a high standard).</li><li>Update your Gantt chart and risk/issue log regularly and keep the old versions.</li><li>Make every technical specification line testable.</li><li>Justify refinements with test evidence.</li></ul>',
    'group:A': 'Learning aim A: investigating the problem and selecting a solution.',
    'group:B': 'Learning aim B: project management, technical specification and design.',
    'group:C': 'Learning aim C: making, testing and presenting with appropriate behaviours.',
    'A.P1': CH('Explain at least three solutions and select one that partially addresses the problem.', ['Problem research; three solutions with sketches, outline processes, costs, technical info; a selection.'], 'For M1, assess solutions and recommend with reasons.'),
    'A.M1': CH('Assess at least three solutions and recommend one that mostly addresses the problem.', ['Feasibility study against criteria; weighted comparison; recommendation with reasons.'], 'For D1, evaluate and fully justify.'),
    'A.D1': CH('Evaluate realistic solutions and justify one that fully addresses the problem.', ['Thorough feasibility analysis (cost, risk, expertise, sustainability, legal); high-standard technical language; justified choice.'], null),
    'B.P2': CH('Implement some planning and monitoring processes.', ['Gantt chart, resource list, logbook entries, risk/issue log.'], 'For M2, make processes mostly appropriate and consistent.'),
    'B.P3': CH('Produce an adequate technical specification.', ['Main headings covered – function, interfaces, materials, tolerances, performance – with some gaps allowed.'], 'For M3, cover most aspects coherently.'),
    'B.P4': CH('Produce design documentation considering some sustainability.', ['Drawings/CAD, circuits or flow charts, models; sustainability notes.'], null),
    'B.M2': CH('Implement mostly appropriate planning and monitoring.', ['Critical path, milestones, regular updates, severity-rated risks with mitigation.'], 'For D2, optimise with reasonable contingency.'),
    'B.M3': CH('Design a coherent solution covering most aspects, considering alternatives and sustainability.', ['Complete design package; alternatives considered at component level; sustainability choices.'], 'For D2, optimise the design and fully consider sustainability.'),
    'B.D2': CH('Optimise planning, monitoring and design with contingency and full sustainability.', ['Evidence of plans and design refined over time; contingency used wisely; full sustainability analysis.'], null),
    'C.P5': CH('Produce a partially appropriate solution safely with PM processes.', ['Artefact, safe working evidence, status updates, some testing.'], 'For M4, make it mostly fit for purpose and justify refinements.'),
    'C.P6': CH('Demonstrate some appropriate behaviours.', ['Logbook and witness evidence of time management, communication, customer awareness, managing setbacks.'], null),
    'C.M4': CH('Produce a mostly fit-for-purpose solution, justifying refinements and showing appropriate behaviours.', ['Test results against the spec; troubleshooting records; refinements with reasons.'], 'For D3, optimise the solution with consistent behaviours.'),
    'C.D3': CH('Optimise a fit-for-purpose solution with fully appropriate PM and consistent behaviours.', ['Iterative testing and improvement; analysed test data (graphs); complete presentation with conclusions.'], null)
  };
})();
