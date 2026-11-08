/* BTEC Construction (AAQ) Unit 6 — per-criterion assignment help (RA10’s guidance; your work must be your own). */
(function () {
  'use strict';
  const CH = (means, evidence, next) => `<p><b>What it means:</b> ${means}</p><p><b>Evidence to include:</b></p><ul>${evidence.map(e => `<li>${e}</li>`).join('')}</ul>${next ? `<p><b>Reaching the next grade:</b> ${next}</p>` : ''}`;
  window.AAQ_CRIT_HELP = {
    _intro: '<h3>Before you start</h3><p>List the client brief requirements (rooms, style, budget, sustainability, fixtures, daylight) and keep a <b>decision log</b> while you model – for each component, record the size, material, cost and the reason it fits the brief. Save screenshots at each modelling stage.</p>',
    _tips: '<ul><li>Use correct terms: PIM, AIM, CDE, ISO 19650, COBie.</li><li>Link security measures to real risks (wrong versions, sensitive layouts, GDPR).</li><li>Make sure your model holds data (materials, costs), not just geometry.</li><li>Pick outputs to suit each audience and explain why.</li></ul>',
    'group:A': 'Learning aim A: models, data, CDEs, security and MMC.',
    'group:B': 'Learning aim B: software and your project information model.',
    'group:C': 'Learning aim C: communicating your design.',
    'group:BC': 'Learning aims B and C combined: justifying your model against the brief.',
    'A.P1': CH('Compare types of models and data.', ['PIM, construction model, AIM, analysis models; graphical and non-graphical data – similarities and differences.'], null),
    'A.P2': CH('Outline how a CDE supports collaboration.', ['Functions (platform, access, storage, real-time, RFIs, change orders); information states; pros and cons.'], null),
    'A.P3': CH('Explain why data security matters.', ['Permissions, protocols, version control, risks of breaches or wrong versions.'], null),
    'A.P4': CH('Describe how models enable sustainable MMC.', ['Waste and time reduction, off-site/3D printing, material selection, renewables, lifecycle analysis.'], 'For M1, analyse how models and CDEs support secure information flow.'),
    'A.M1': CH('Analyse how models and a CDE support the secure flow of information.', ['Trace information from brief to handover through CDE states with security controls at each step.'], 'For D1, evaluate effectiveness.'),
    'A.D1': CH('Evaluate how effective models and CDEs are for secure information flow.', ['Strengths and limitations (cost, training, interoperability, cyber risk); justified conclusion.'], null),
    'B.P5': CH('Explain the purpose of different software types.', ['Authoring, cloud CDE, clash detection, 4D/5D, rendering, sketching; input data (topography, utilities); CAD vs BIM.'], null),
    'B.P6': CH('Produce a project information model for the brief.', ['Three-storey model with grids, levels, walls, floors, roofs, doors, windows, stairs, fixtures, materials, costs, annotations, textures.'], 'For M2, assess components, sizes, materials and costs.'),
    'B.M2': CH('Assess components, dimensions, materials, sizes and costs.', ['Schedules from the model; comments on suitability against the brief and budget.'], 'For BC.D2, justify every choice.'),
    'C.P7': CH('Communicate the design with drawings and a flythrough.', ['Plans, elevations, sections at scale; rendered views; flythrough/360/QR.'], null),
    'C.P8': CH('Communicate the design with documents from the model.', ['Cost estimate, energy/sun study, embodied carbon, COBie, technical language.'], 'For M3, assess how effective the communication is.'),
    'C.M3': CH('Assess the effectiveness of your drawings, flythroughs and documents.', ['Audience, clarity, accuracy, feedback; what worked and what you would improve.'], null),
    'BC.D2': CH('Justify components, dimensions, materials, sizes and costs against the brief.', ['Decision log with evidence (brief, regulations, sustainability, cost); how outputs communicate those choices.'], null)
  };
})();
