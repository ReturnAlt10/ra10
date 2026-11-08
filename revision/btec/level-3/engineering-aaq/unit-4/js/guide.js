/* BTEC Engineering (AAQ) Unit 4 — Engineering Project: theory guide for the assignment (shared guide engine). */
(function () {
  'use strict';
  const { svg: S, h: H } = window.BizGuide;
  const { key, tip, warn, fig, table, ul, example, stats, check, two, formula } = H;

  function setTask() {
    return `
<div class="guide-aim-hd"><div class="guide-aim-badge">★</div><div><div class="guide-aim-title">The assignment</div><div class="guide-aim-subtitle">Internally assessed · investigate a problem, generate and select solutions (A) · project management, technical specification and design (B) · build, test and present the solution (C)</div></div></div>
${stats([['3', 'learning aims'], ['13', 'criteria'], ['≥ 3', 'alternative solutions you must compare'], ['1', 'logbook kept throughout']])}
${fig(S.flow([['Initiation', 'problem, research'], ['Solutions', '≥ 3 options'], ['Feasibility', 'select one'], ['Plan and design', 'Gantt, risks, tech spec'], ['Implement and test', 'build, monitor, troubleshoot'], ['Evaluate and present', '']], { w: 790, h: 96, fs: 10, label: 'Project life cycle' }), '')}
${check(['Keep a dated logbook from day one: problems, solutions, decisions, support, iterations.', 'Compare at least three genuinely different solutions with a feasibility study.', 'Use a Gantt chart with milestones, a critical path and contingency – then update it as you go.', 'Test against your technical specification and present the data with graphs.'])}
${warn('Practical work must follow workshop rules: induction, supervision, PPE, risk assessment and safe use of machines and tools.')}`;
  }

  const a1 = () => `
${table(['Stage', 'Key activities', 'Outputs'], [['Initiation', 'identify the problem, research and clarify it, establish key features, propose solutions', 'problem statement, research notes, initial ideas'], ['Planning and design', 'resource and time planning, design based on technical requirements', 'Gantt chart, risk log, technical specification, drawings'], ['Implementation', 'make and test the solution while monitoring against the plan', 'artefact, logbook, status reports, test results'], ['Evaluation', 'review whether technical requirements were met and how well the project was managed', 'evaluation report, presentation']])}`;

  const a2 = () => `
${ul(['<strong>Investigate the theme</strong>: internet, journals, textbooks, manufacturers’ data, interviews with users or experts.', '<strong>Creativity tools</strong>: rewording the problem, challenging assumptions, thinking in reverse, mind mapping, brainstorming, SCAMPER, morphological charts.'])}
${table(['Initial specification of each alternative', 'Example content'], [['Graphic solution', 'sketches, diagrams, photos, storyboards'], ['Outline processes', 'machine tools, systems, assemblies, high-level flow chart'], ['Outline costings', 'spreadsheet of material costs and budget'], ['Initial technical information', 'approximate mass and volume, suggested materials, outline performance (e.g. flow rate, speed, battery life)']])}
${example('Three alternatives for an automatic plant-watering system', '1) Gravity-fed drip system with a mechanical float valve – cheap and no electricity, but no control of timing. 2) Microcontroller with soil-moisture sensor and 5 V pump – precise and programmable, moderate cost and complexity. 3) Wick-based self-watering pot – very simple, but limited to single pots. Each would have a sketch, outline process, cost estimate and performance values.')}`;

  const a3 = () => `
${table(['Feasibility criterion', 'Question'], [['Size and complexity', 'how hard is the problem to solve?'], ['Benefit and performance', 'how well does it solve the problem?'], ['Cost and time', 'can it be developed within the budget and time available?'], ['Expertise', 'do I have, or can I get, the skills needed?'], ['Risk', 'unknowns, unproven technology, equipment availability'], ['Sustainability', 'materials, waste, recycling, environmental impact of production'], ['Legal', 'data protection law, Health and Safety at Work etc. Act 1974, product standards']])}
${table(['Weighted feasibility', 'Weight', 'Drip', 'Microcontroller', 'Wick'], [['Performance', '3', '2 → 6', '5 → 15', '2 → 6'], ['Cost within budget', '2', '5 → 10', '3 → 6', '5 → 10'], ['Time and expertise', '2', '4 → 8', '3 → 6', '5 → 10'], ['Risk', '2', '4 → 8', '3 → 6', '5 → 10'], ['Sustainability', '1', '4 → 4', '3 → 3', '5 → 5'], ['Total', '', '36', '36', '41']])}
${tip('A tie or a surprising winner is fine – what matters is the reasoning. Here the wick wins on scores, but fails the brief if it must water a whole bed – so check fitness for purpose before choosing.')}
${ul(['<strong>Selection methods</strong>: objective testing of mock-ups, design analysis (iterations, feasibility, cost-benefit), statistical/graphical comparison (frequency tables, histograms, bar and pie charts), quality and resource limits, process capability, fitness for purpose.'])}`;

  const b1 = () => `
${table(['Planning element', 'What to include'], [['Resources', 'internet, people (peers, technicians, tutors), books, equipment, materials'], ['Gantt chart', 'tasks, durations, dependencies, milestones'], ['Critical path analysis', 'longest chain of dependent tasks – sets priorities'], ['Contingency', 'extra time or budget for unforeseen events'], ['Constraints', 'time, budget, scope, sustainability, ethics, legality'], ['Monitoring', 'logbook, progress against plan, milestones, modifications, tutor monitoring, peer reviews']])}
${fig(S.ladder([['Week 1–2', 'research, three solutions, feasibility study'], ['Week 3', 'technical specification, risk log, Gantt chart ◆ milestone: design approved'], ['Week 4–6', 'make and assemble – critical path'], ['Week 7', 'testing and refinement ◆ milestone: tested prototype'], ['Week 8', 'contingency week, then presentation']], { w: 740, rowH: 44, label: 'Example plan outline' }), '')}
${table(['Logbook entry (example)', 'Content'], [['Date and session', '14 Nov, workshop session 2 (2 h)'], ['Planned task', 'print and test-fit enclosure lid (Gantt task 4.2)'], ['What happened', 'lid too tight – print shrinkage about 0.3 mm'], ['Decision and reason', 'increase clearance to 0.4 mm in CAD; reprint – keeps the ±0.2 mm fit target'], ['Support', 'technician advised on printer calibration'], ['Progress vs plan', 'half a day behind; use 0.5 day of contingency'], ['Next step', 'reprint lid, then start wiring (critical path)']])}
${key('Critical path', 'Tasks with zero float: if one slips, the project end date slips. Tasks off the critical path can move within their float.')}`;

  const b2 = () => `
${ul(['<strong>Purpose</strong>: avoid “crisis management”, improve the probability of success and give competitive advantage.', '<strong>Definitions used in this specification</strong>: a <em>risk</em> is an event that adversely impacts the project processes or outcome; an <em>issue</em> is a future event which could adversely or positively impact them. (Some project methods, such as PRINCE2, use these words the other way round – define your terms in your log.)'])}
${formula('Severity', 'Severity = probability of occurrence × expected impact', 'on customer requirements, schedule and budget')}
${table(['Probability ↓ / Impact →', 'Minor', 'Moderate', 'Major'], [['Very likely', 'medium', 'high', 'extreme'], ['Likely', 'low', 'medium', 'high'], ['Unlikely', 'low', 'low', 'medium']])}
${table(['Mitigation', 'Meaning', 'Example'], [['Prevention', 'eliminate the threat', 'order components in week 1 so they cannot arrive late'], ['Reduction', 'reduce likelihood or impact', 'test the pump on a breadboard before final assembly'], ['Acceptance', 'do nothing, monitor', 'minor cosmetic marks on the casing'], ['Transference', 'transfer to a third party', 'have a technician laser-cut the parts']])}
${tip('Manage medium, high and extreme items actively and review them throughout the project; contingency gives you room when they occur.')}`;

  const b3 = () => `
${table(['Technical specification heading', 'Example (plant-watering system)'], [['Function and features', 'waters when soil moisture falls below a set threshold; manual override'], ['Interfaces', 'physical (hose connector), electrical (5 V USB), human (status LED, button), software (adjustable threshold)'], ['Materials', 'PLA enclosure, silicone tubing, stainless sensor probes'], ['Tolerances', 'enclosure lid fit ±0.2 mm'], ['Standards', 'relevant electrical safety and IP rating standards'], ['Security', 'no personal data collected'], ['Environment and sustainability', 'recyclable enclosure; low standby power'], ['Operating conditions', 'indoor/greenhouse, 5–35 °C, splashes'], ['Process capability', 'can be made on available 3D printers and soldering stations'], ['Reliability', 'operates for 30 days without intervention'], ['Capacity', '1 L reservoir now; expandable to 5 L'], ['Maintenance', 'reservoir refill, sensor cleaning monthly'], ['Performance', 'delivers 50 ml ± 5 ml per cycle']])}
${tip('Make every line testable – your test plan in C1 will check each one.')}`;

  const b4 = () => `
${table(['Design tool', 'Examples'], [['Drawings and CAD', 'orthographic projections, 2D/3D CAD, diagrams'], ['Simulations', 'pneumatic, hydraulic, electrical/electronic circuits, software models'], ['Physical modelling', '3D printing (additive manufacturing), mock-ups in wood, card, modelling material'], ['Process documents', 'detailed flow charts, planning and operation sheets'], ['Reference documents', 'charts and tables, formulae, pseudocode, algorithms, ergonomic analysis'], ['Safety and sustainability', 'relevant health and safety regulations for the specialist area'], ['Demand and costs', 'possible demand, material and manufacturing costs'], ['Culture', 'beliefs, laws, customs of users']])}
${ul(['<strong>Test plans</strong> to relevant British or International Standards where appropriate: destructive and non-destructive tests, inspection methods, and normal, extreme and erroneous test data.'])}
${table(['Test', 'Spec line', 'Method', 'Data type', 'Test data', 'Expected result'], [['T1', 'delivers 50 ± 5 ml per cycle', 'measure in a measuring cylinder, 5 cycles', 'continuous', 'normal', '45–55 ml each cycle'], ['T2', 'triggers below threshold', 'sensor in dry soil, then wet soil', 'discrete (on/off)', 'normal and extreme (threshold ± 1%)', 'pump runs only when dry'], ['T3', 'refuses to pump when reservoir empty', 'empty reservoir', 'discrete', 'erroneous/abnormal condition', 'red LED flashes, pump off'], ['T4', 'lid fit ±0.2 mm', 'measure with vernier calipers', 'continuous', 'normal', 'within tolerance'], ['T5', 'splash resistant', 'inspection after spray test', 'qualitative', 'extreme', 'no water inside enclosure']])}
${H.code(['WHILE system is on', '    moisture ← READ sensor', '    IF moisture < threshold AND reservoir_level > minimum THEN', '        run pump for 5 seconds', '        WAIT 10 minutes          // let water soak in before re-reading', '    ELSE IF reservoir_level <= minimum THEN', '        flash red LED            // tell the user to refill', '    END IF', '    WAIT 1 minute', 'END WHILE'], 'Pseudocode as design documentation for a controlled system.')}`;

  const c1 = () => `
${table(['Troubleshooting method', 'How it works'], [['Expected behaviour', 'compare what should happen with what does'], ['Half-split', 'test the middle of the system to halve the search area each time'], ['Cause and effect (fishbone)', 'list possible causes under headings (method, materials, machine, people…)'], ['5 Whys', 'ask “why?” repeatedly to reach the root cause']])}
${example('5 Whys', 'The pump does not run. Why? No voltage at the pump. Why? The transistor is not switching. Why? No signal from the microcontroller pin. Why? The wrong pin is set in code. Why? The wiring diagram and code were not checked together. → Root cause: missing design check; fix the code and add a wiring–code cross-check to the process.')}
${table(['Testing', 'Detail'], [['Methods', 'destructive (load to failure), non-destructive (visual, dye penetrant), inspection, measurement'], ['Data types', 'discrete (counts), continuous (measurements), ungrouped, grouped'], ['Presentation', 'line graphs, bar charts, scatter diagrams, pie charts, histograms'], ['Fitness for purpose', 'quality, usability, functionality, performance, compliance with the technical specification']])}
${table(['Status report heading', 'Example'], [['Overall status', 'amber – 0.5 day behind, recoverable'], ['Completed since last report', 'enclosure printed and fitted; sensor calibrated'], ['Next tasks', 'wire pump driver; first water test'], ['Risks/issues update', 'pump delivery delayed – severity raised to medium; mitigation: borrow a spare pump'], ['Contingency used', '0.5 of 3 days'], ['Help needed', 'soldering check by technician']])}
${tip('Short weekly status reports like this are strong evidence of “appropriate project management planning and monitoring processes” in C.P5–C.D3.')}
${formula('Mean of test results', 'mean = Σx ÷ n', 'e.g. five pump cycles of 48, 52, 50, 49 and 51 ml → 250 ÷ 5 = 50 ml (within 50 ± 5 ml)')}`;

  const c2 = () => `
${table(['Behaviour', 'Evidence'], [['Time planning and management', 'Gantt updates, milestones met, tasks in a sensible order'], ['Communication and literacy', 'following instructions, interpreting documents, clear logbook and reports'], ['Commercial and customer awareness', 'checking the product meets the brief and the user’s needs'], ['Managing emotions', 'logbook notes on successes and setbacks and how you responded'], ['Seeking support', 'practical, academic or external help recorded']])}
${fig(S.tiles([['Title and idea', ''], ['Research and problem', ''], ['Solutions and feasibility', ''], ['Technical spec', ''], ['Plans and risk log', ''], ['Logbook', ''], ['Design documents', ''], ['Artefact', ''], ['Test evidence', ''], ['Conclusions', '']], { w: 760, cols: 5, label: 'What your final presentation should contain (C3)' }), '')}`;

  window.BIZ_GUIDE_DATA = {
    storeKey: 'ra10-guide-revised-EN-aaq-u4', unitLabel: 'Unit 4 Guide', aimWord: 'Aim', aims: ['A', 'B', 'C'], setTaskTitle: 'The assignment',
    titles: { A: 'Investigating the project', B: 'Project management and design', C: 'Making, testing and presenting' },
    subtitles: { A: 'Life cycle, idea generation, alternative solutions and feasibility', B: 'Planning, risks and issues, technical specification, design information', C: 'Implementation, troubleshooting, testing, behaviours and presentation' },
    setTask: setTask,
    topics: {
      A: [{ code: 'A1', name: 'Project life cycle', html: a1 }, { code: 'A2', name: 'Ideas and solutions', html: a2 }, { code: 'A3', name: 'Feasibility study', html: a3 }],
      B: [{ code: 'B1', name: 'Planning and monitoring', html: b1 }, { code: 'B2', name: 'Risks and issues', html: b2 }, { code: 'B3', name: 'Technical specification', html: b3 }, { code: 'B4', name: 'Design information', html: b4 }],
      C: [{ code: 'C1', name: 'Making and testing', html: c1 }, { code: 'C2–C3', name: 'Behaviours and presentation', html: c2 }]
    },
    gallery: []
  };
})();
