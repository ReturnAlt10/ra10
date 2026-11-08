/* BTEC Engineering (AAQ) Unit 3 — per-criterion assignment help (RA10’s guidance; your work must be your own). */
(function () {
  'use strict';
  const CH = (means, evidence, next) => `<p><b>What it means:</b> ${means}</p><p><b>Evidence to include:</b></p><ul>${evidence.map(e => `<li>${e}</li>`).join('')}</ul>${next ? `<p><b>Reaching the next grade:</b> ${next}</p>` : ''}`;
  window.AAQ_CRIT_HELP = {
    _intro: '<h3>Before you start</h3><p>Read the design challenge and write a <b>PDS</b> with measurable requirements under every heading. Research existing products and record sources. Keep a <b>design log</b> with dated sketches, models, feedback and CAD screenshots – learning aim D asks you to review the whole process.</p>',
    _tips: '<ul><li>Number your PDS requirements so you can refer to them in every later stage.</li><li>Produce genuinely different ideas, not variations of one.</li><li>Record peer feedback and the decision you made on each point.</li><li>Generate drawings from the 3D model so they stay consistent.</li></ul>',
    'group:A': 'Learning aim A: PDS and initial design ideas.',
    'group:B': 'Learning aim B: peer review and 3D CAD models.',
    'group:C': 'Learning aim C: 2D engineering drawings and presenting the final design.',
    'group:D': 'Learning aim D: reviewing the design process and your own performance.',
    'A.P1': CH('Produce an adequate PDS using some research and analysis.', ['PDS covering the main headings with some measurable requirements; research of existing products.'], 'For M1, add detail and analysis.'),
    'A.P2': CH('Produce adequate initial ideas addressing some PDS requirements.', ['Annotated sketches (isometric, oblique, orthographic), some modelling.'], 'For M2, address the most important requirements in detail.'),
    'A.M1': CH('Produce a mostly detailed PDS with detailed research and analysis.', ['Measurable requirements under most headings; research analysed to justify values.'], 'For D1, make it comprehensive.'),
    'A.M2': CH('Produce mostly detailed ideas addressing the most important requirements.', ['Several ideas with annotations on materials, processes, ergonomics, cost; physical models; cost spreadsheet.'], 'For D2, address most requirements.'),
    'A.D1': CH('Produce a detailed PDS using comprehensive research and analysis.', ['Every heading covered with measurable, justified requirements and referenced research.'], null),
    'A.D2': CH('Produce detailed ideas addressing most PDS requirements.', ['Ideas annotated against numbered PDS points; modelling and costing evidence; sustainability considered.'], null),
    'B.P3': CH('Review ideas using some peer feedback.', ['Design review notes and feedback; features linked to some PDS requirements.'], 'For M3, assess ideas and use feedback appropriately.'),
    'B.P4': CH('Develop ideas into adequate 3D models.', ['CAD parts and an assembly addressing some PDS requirements.'], 'For M4, add detail (features, constraints, analysis).'),
    'B.M3': CH('Assess ideas and use peer feedback appropriately.', ['Weighted comparison; feedback accepted/rejected with reasons.'], 'For D3, evaluate ideas and use feedback effectively.'),
    'B.M4': CH('Develop detailed 3D models addressing the most important requirements.', ['Parametric parts with holes, threads, fillets; constrained assembly; mass/material analysis.'], 'For D4, address most requirements.'),
    'B.D3': CH('Evaluate ideas and use peer feedback effectively.', ['Balanced judgements, justified selection, clear evidence of feedback improving the design.'], null),
    'B.D4': CH('Detailed 3D models addressing most requirements.', ['Complete assembly, interference-free, analysed (mass, stress), modified to better meet the PDS.'], null),
    'C.P5': CH('Produce 2D drawings that partially communicate the final design.', ['Orthographic views from the model with some dimensions and a title block; brief description.'], 'For M5, make drawings detailed and explain the solution.'),
    'C.M5': CH('Produce detailed drawings communicating the design, explaining how it meets key requirements.', ['Dimensioned component drawings, sections, assembly drawing with BOM; presentation.'], 'For D5, fully communicate and justify.'),
    'C.D5': CH('Fully communicate the final design, justifying how it meets requirements.', ['Complete drawing set to BS 8888; confident presentation responding to questions; justification against the PDS.'], null),
    'D.P6': CH('Explain how the design process produced the final design.', ['Stages followed and which PDS requirements were met.'], 'For M6, assess effectiveness.'),
    'D.M6': CH('Assess how effectively the design process was used.', ['Requirement-by-requirement check, strengths and weaknesses of stages; reflection using ERA or Driscoll.'], 'For D6, evaluate with justified improvements.'),
    'D.D6': CH('Evaluate how effectively the design process was used.', ['Evidence-based judgements on each stage; personal performance (SWOT/SOAR); specific improvements.'], null)
  };
})();
