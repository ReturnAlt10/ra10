/* BTEC Construction (AAQ) Unit 3 — per-criterion assignment help (RA10’s guidance; your work must be your own). */
(function () {
  'use strict';
  const CH = (means, evidence, next) => `<p><b>What it means:</b> ${means}</p><p><b>Evidence to include:</b></p><ul>${evidence.map(e => `<li>${e}</li>`).join('')}</ul>${next ? `<p><b>Reaching the next grade:</b> ${next}</p>` : ''}`;
  window.AAQ_CRIT_HELP = {
    _intro: '<h3>Before you start</h3><p>Break the client brief into a checklist of requirements and constraints (client, site, planning, statutory, environmental, social, economic). Research the actual site context if one is given (planning portal, flood maps, conservation areas). Keep every sketch and CAD iteration – they are evidence of your design process.</p>',
    _tips: '<ul><li>Annotate drawings: materials, dimensions, U-values, key features.</li><li>Use correct scales and a title block on every CAD sheet.</li><li>In the design statement, link every decision to the brief or a regulation.</li><li>Use research to support sustainability choices; quote current sources.</li></ul>',
    'group:A': 'Learning aim A: factors that affect design, including sustainability.',
    'group:B': 'Learning aim B: your building design (sketches and CAD) and design statement.',
    'group:C': 'Learning aim C: review of your own design.',
    'A.P1': CH('Outline the factors that can affect the design, including sustainability.', ['Client, planning, statutory, environmental, social and economic factors linked to the brief; sustainability requirements.'], 'For M1, assess the factors with reasons and ways to overcome limitations.'),
    'A.M1': CH('Assess the factors, with supported reasons for sustainability and ways to overcome some limitations.', ['Which factors matter most for this brief and why; sustainability options with reasons; solutions to constraints.'], 'For D1, evaluate using research and justify how all limitations can be overcome.'),
    'A.D1': CH('Evaluate the factors with research, justifying how limitations can be overcome.', ['Research-backed judgements (e.g. heat pump options for this site); justified solutions to every limitation.'], null),
    'B.P2': CH('Produce a realistic, workable design using manual techniques and CAD.', ['Annotated hand sketches; CAD plans, elevations, sections and 3D views; key project information.'], 'For M2/D2, explain and justify your design strategies.'),
    'B.P3': CH('Produce a design statement showing how the design meets the brief.', ['Requirement-by-requirement explanation; site, planning and regulation responses.'], null),
    'B.M2': CH('Discuss the selection and use of design strategies in the design statement.', ['Options considered, reasons for choices; sound understanding of materials, processes and techniques.'], 'For D2, justify choices in depth.'),
    'B.D2': CH('Justify design strategies with in-depth consideration of the brief and materials, processes and techniques.', ['Decision matrices, research, regulations; in-depth technical understanding.'], null),
    'C.P4': CH('Review how well construction methods, materials, layout, design and sustainability meet the brief.', ['Requirement checklist with comments; construction technology, handover and maintenance considerations.'], 'For M3, discuss considerations in more depth.'),
    'C.M3': CH('Discuss your design and the considerations made.', ['Strengths and weaknesses for each area, with peer/client feedback.'], 'For D3, evaluate with justified decisions and improvements.'),
    'C.D3': CH('Evaluate your design, justifying decisions and suggesting improvements.', ['Balanced, evidence-based judgements; wider issues (social, ethical, environmental); specific improvements.'], null)
  };
})();
