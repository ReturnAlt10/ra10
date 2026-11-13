/* BTEC Nationals IT (2016 specification, 20161K) — Unit 14: IT Service Delivery. NOT the AAQ IT qualification.
   Set task: Part A (3 hours preparatory research, no marks) then Part B (five activities, 8 supervised hours), 68 marks.
   Mark grid (Pearson "All series" mark scheme, identical every series): each activity is ONE assessment focus marked
   holistically — the examiner judges each trait (row), then places the whole activity in the best-fit band and awards a
   mark within it. Activity 1 8 · Activity 2 8 · Activity 3 20 · Activity 4 12 · Activity 5 16 · technical language 4
   (assessed across all five activities). Wording below follows the Pearson grid; examiner advice is paraphrased from the
   Lead Examiner reports (June 2018 – June 2024). */
(function () {
  'use strict';
  const band = (b, marks, descriptor) => ({ band: b, marks, descriptor });
  const A = {
    1: { id: 'Activity 1', name: 'An outline IT service strategy for the organisation', max: 8,
      traits: ['Description of the IT service/process requirements, using information from the scenario', 'Prioritisation of the requirements, supported by a rationale', 'Logical chains of reasoning and awareness of the scenario'],
      look: 'Every requirement the scenario implies — computers for each role, servers, network, printers, security, bespoke software (e.g. stock control, bookings, rota, payroll), website and the three future developments — described accurately and prioritised high/medium/low with a clear reason linked to the company, staff and customers.',
      bands: [band(1, '1–3', 'Limited information from the scenario is used to produce a superficial or partial outline strategy: a description of IT service/process requirements that meets some of the organisation’s needs but contains inaccuracies and/or omissions; an attempt to prioritise, but prioritisation is inappropriate and/or unsupported. Information is considered in isolation, showing a limited awareness of the scenario.'),
        band(2, '4–6', 'Some relevant information from the scenario is used to produce a basic outline strategy: a mostly accurate description of the requirements needed to meet most of the organisation’s needs; appropriately prioritised requirements mostly supported by a rationale. Mostly logical chains of reasoning and some awareness of the scenario.'),
        band(3, '7–8', 'Relevant information from the scenario is used to produce a comprehensive outline strategy: an accurate description of the requirements needed to meet the organisation’s needs; appropriately prioritised requirements supported by a clear rationale. Logical chains of reasoning and a full awareness of the scenario.')] },
    2: { id: 'Activity 2', name: 'Produce an IT service catalogue defining the individual IT services for each function of the organisation', max: 8,
      traits: ['IT services identified for the given business functions, using information from the scenario', 'Accuracy of service names and descriptions (understanding of the organisation’s requirements)', 'Clarity: could a non-IT specialist understand the names and descriptions?'],
      look: 'A row for every function/job role in the brief (including drivers, kitchen staff, mechanics…) with IT services that fit that role: a clear service name and a description of what it achieves, the information and data it uses and who uses it, and the technology needed. Current and future services. No non-IT items.',
      bands: [band(1, '1–3', 'Limited information from the scenario is used: some IT services identified are appropriate but are largely generic and may not be clearly linked to the given business functions; service names and descriptions contain inaccuracies that show limited understanding of the organisation’s requirements. Names and descriptions are vague and difficult to understand for a non-IT specialist.'),
        band(2, '4–6', 'Some relevant information from the scenario is used: IT services identified are mostly appropriate for the given business functions; mostly accurate service names and descriptions show basic understanding of the organisation’s requirements. Names and descriptions are mostly clear and could be understood, with minimal assistance, by a non-IT specialist.'),
        band(3, '7–8', 'Relevant information from the scenario is used: IT services identified are fully appropriate for the given business functions; accurate service names and descriptions show sound understanding of the organisation’s requirements. Names and descriptions are clear and concise and could be easily understood by a non-IT specialist.')] },
    3: { id: 'Activity 3', name: 'Design an IT service delivery solution that will meet the needs of the organisation and its customers', max: 20,
      traits: ['Mapping of the IT service delivery solution for the organisation', 'Technical understanding of how the solution works', 'Coverage of the data and information required to meet the IT requirements', 'How hardware AND software can be used to implement the solution and support users', 'Awareness of the scenario'],
      look: 'A complete design: an annotated network diagram with every room/location, device, server, switch, router, firewall, wireless access points and internet link; specified hardware and named software for each role (including bespoke systems); an information and data table (who needs what information, the data items behind it, where it is stored); data flows; how users, infrastructure, security, backup and support are managed; the future developments included.',
      bands: [band(1, '1–5', 'Documents provide a limited or inaccurate mapping of the IT service delivery solution. Limited technical understanding of how the solution works. Limited coverage of the data and information required and of how hardware and software can be used to implement the solution and support users. Limited awareness of the scenario.'),
        band(2, '6–10', 'Documents map most of the IT service delivery solution. Some accurate technical understanding of how the solution works. Adequate coverage of the data and information required and of how hardware and software can be used to implement the solution and support users. Some awareness of the scenario.'),
        band(3, '11–15', 'Documents map most of the IT service delivery solution. Mostly accurate technical understanding of how the solution works. Effective coverage of the data and information required and of how hardware and software can be used to implement the solution and support users. Sound awareness of the scenario.'),
        band(4, '16–20', 'Documents fully map the IT service delivery solution. Accurate and in-depth technical understanding of how the solution works, throughout. Effective and comprehensive coverage of the data and information required and of how hardware and software can be used to implement the solution and support users. Perceptive awareness of the scenario.')] },
    4: { id: 'Activity 4', name: 'Evaluate the appropriateness of the solution you designed in relation to the IT service delivery requirements of the organisation', max: 12,
      traits: ['Justification of the appropriateness of the solution against the organisation’s requirements', 'Appropriate alternatives identified for a range of aspects of the solution', 'A valid, supported rationale for choosing the solution over the alternatives', 'Coherent, logical chains of reasoning and awareness of the scenario'],
      look: 'Each part of the Activity 3 solution judged against the original requirements (will every member of staff be able to do their job? what are the limitations?), including the future developments; for a range of aspects (computers, server, network, software, security, backup, website/app…) a genuine alternative item, compared and rejected or chosen with reasons such as cost, scalability, security, usability and support.',
      bands: [band(1, '1–3', 'Superficial or unclear justification of the appropriateness of the solution in relation to the requirements of the organisation. Alternatives, if identified, are likely to be inappropriate. Rationale, if present, shows limited consideration of alternatives and lacks support. Limited reasoning that shows minimal awareness of the scenario.'),
        band(2, '4–6', 'Partial justification of the appropriateness of the solution. Appropriate alternatives are identified for some aspects of the solution. A mostly valid rationale showing some consideration of alternatives with limited support. Some logical chains of reasoning that show an awareness of the scenario, but lack clarity.'),
        band(3, '7–9', 'Developed justification of the appropriateness of the solution. Appropriate alternatives are identified for a range of aspects of the solution. A valid and mostly supported rationale showing some consideration of alternatives. Mostly coherent and logical chains of reasoning that show an awareness of the scenario.'),
        band(4, '10–12', 'Developed and convincing justification of the appropriateness of the solution. Appropriate alternatives are identified for a range of aspects of the solution. A valid and supported rationale showing a thorough consideration of alternatives. Coherent and logical chains of reasoning that show full awareness of the scenario.')] },
    5: { id: 'Activity 5', name: 'Analyse the implications of managing IT service delivery to meet the organisation’s requirements', max: 16,
      traits: ['Consideration of the implications of the solution on the organisation (the four template areas)', 'Understanding of the solution’s capacity to respond to change', 'Coherent, logical chains of reasoning showing awareness of the implications for the scenario'],
      look: 'For each template area (implementing and delivering services, staff, customers, IT assets): the knock-on effects — installation and downtime, data migration, testing, training, support and help desk, acceptable use, security and legislation (UK GDPR/Data Protection Act, Computer Misuse Act, health and safety/DSE, WEEE), costs and budgets, asset register and updates; then how the solution copes with change: the three future developments, growth or seasonal demand, new legislation, new technology.',
      bands: [band(1, '1–4', 'Limited consideration of the implications of the solution on the organisation. Limited understanding of the solution’s capacity to respond to change. Limited reasoning that shows minimal awareness of the implications for the given scenario.'),
        band(2, '5–8', 'Some consideration of the implications of the solution on the organisation. Some understanding of the solution’s capacity to respond to change, but some elements may be unrealistic. Some logical chains of reasoning that show an awareness of the implications for the given scenario, but lack clarity.'),
        band(3, '9–12', 'Mostly appropriate consideration of the implications of the solution on the organisation. Mostly realistic understanding of the solution’s capacity to respond to change. Mostly coherent and logical chains of reasoning that show an awareness of the implications for the given scenario.'),
        band(4, '13–16', 'Wide-ranging and appropriate consideration of the implications of the solution on the organisation. Comprehensive and realistic understanding of the solution’s capacity to respond to change. Coherent and logical chains of reasoning that show full awareness of the implications for the given scenario.')] }
  };
  // Assessed across all five activities (not an activity of its own): 0 none · 1 limited · 2–3 mostly appropriate with some inconsistencies · 4 appropriate and consistent throughout.
  const TECH_LANGUAGE = { id: 'Activities 1–5', name: 'Use of technical language during the task', max: 4,
    bands: [band(1, '1', 'Limited appropriate use of technical language.'), band(2, '2–3', 'Mostly appropriate technical language with some inconsistencies.'), band(3, '4', 'Appropriate and consistent technical language used throughout.')] };

  window.BIZ_UNIT = {
    n: 14, key: 'it16_u14', code: '20161K', name: 'IT Service Delivery', kind: 'set', total: 68, minutes: 480,
    subject: 'Information Technology',
    qualLine: 'Pearson BTEC Level 3 National Extended Diploma in Information Technology (2016 specification, 20161K) — not the AAQ',
    timeLabel: 'Part B: 8 hours (supervised)',
    aims: ['A', 'B', 'C', 'D'],
    partsLabel: 'Part A (preparatory research) and Part B (set task)',
    partALabel: 'Part A · Preparatory research (no marks)',
    partANote: 'Part A is given out two weeks before Part B. You have up to 3 hours to research the sector and the future developments, and you may take two sides of A4 handwritten or typed notes into Part B. Part B is 8 supervised hours, typed on a computer with no internet; Activities 1, 2 and 5 use Pearson templates.',
    partBBriefFirst: true, partBInfoLabel: 'Set task brief',
    instructions: [
      ['Instructions', ['Complete ALL five activities.', 'Produce your documents using a computer. Activities 1, 2 and 5 use the templates Outline_Service_Strategy.rtf, Define_IT_Service_Catalogue.rtf and IT_Service_Management_Implications.rtf.', 'You may use two sides of A4 research notes from Part A. Internet access is not allowed.']],
      ['Information', ['The total mark for this task is {total}: Activity 1 = 8, Activity 2 = 8, Activity 3 = 20, Activity 4 = 12, Activity 5 = 16, and 4 marks for technical language across the task.', 'Each activity is marked as a whole using a band grid.']],
      ['Advice', ['Use the scenario in every activity: every role, room, device and future development.', 'Cover software as well as hardware, and data as well as information.', 'Write in the first person (“I have chosen…”), not “we”.']]
    ],
    howto: ['Open a set task. Read the Part A research brief, then the Part B scenario: staff, premises, current IT and the three future developments.',
      'Switch to “Answer online” and complete each activity. The answer boxes start with the same headings as the Pearson templates.',
      'Use the AI Examiner on each activity. It places the activity in a band for every trait of the Pearson grid and tells you what would move it up.'],
    paperNote: 'This is Unit 14 of the 2016 BTEC Nationals IT (Extended Diploma, 20161K), which is being withdrawn. It is not part of the new AAQ IT. The five activities and the mark grid are the same every series; only the organisation changes.',
    activityTitles: { 1: 'Outline IT service strategy', 2: 'IT service catalogue', 3: 'IT service delivery solution', 4: 'Management report evaluating the solution', 5: 'IT service management implications report' },
    activityMinutes: { 1: 60, 2: 60, 3: 180, 4: 90, 5: 90 },
    placeholders: {
      strategy: 'COMPANY NEEDS\nIT service requirement – Explanation of priority (high, medium or low)\n1. …\n\nCUSTOMER NEEDS\nIT service requirement – Explanation of priority (high, medium or low)\n1. …\n\n(Include hardware for each role, network/server, security, bespoke software, the website and the three future developments. Say WHY each priority is high, medium or low.)',
      catalogue: 'Function / job role – Service name – Service description (what it achieves, the information and data it uses and who uses it, the technology needed)\n\nGeneral Manager – …\nOffice Manager – …\n…',
      solution: '1. Information requirements (who needs which information, and why)\n…\n2. Data requirements (the data items, where they come from, where they are stored)\n…\n3. Hardware and software service options (each device and program, for which role and location)\n…\nNetwork diagram (describe each device, room and connection; mark firewall, router, switch, WAPs, server, internet)\n…\n4. Managing infrastructure and users (accounts and access levels, security, backup, updates, support)\n…',
      evaluation: 'Introduction (what the solution must achieve)\n…\nAppropriateness of the solution (part by part, against the requirements and the future developments; limitations)\n…\nAlternatives considered (for each aspect: the alternative item, how it compares)\n…\nRationale and conclusion (why my solution was chosen over the alternatives)\n…',
      implications: 'Implementing your solution and delivering the company’s services and products\n…\n\nManaging and supporting staff\n…\n\nManaging and supporting the company’s customers\n…\n\nManaging the company’s IT assets\n…\n\n(For each area: constraints — legal, security, resources — and how the solution copes with changes in aims, products and services.)'
    },
    // Practice mode has no Pearson .rtf templates, so the template sentence becomes the layout to follow
    // (pipe rows are drawn as tables by revision/shared/unit-ui.js). The Part B brief is shown with each activity.
    practiceScenario: true,
    practiceText: function (a) {
      let t = String(a.text || '');
      if (a.kind === 'strategy') {
        t = t.replace(/ using the template Outline_Service_Strategy\.rtf/i, '');
        t += '\nLay it out as two tables, one for company needs and one for customer needs:\nIT service requirement | Explanation of priority (high, medium or low)\nName the requirement and who uses it | High, medium or low – and why the company, staff or customers depend on it';
      } else if (a.kind === 'catalogue') {
        t = t.replace(/\s*Use the template Define_IT_Services?_Catalogue\.rtf\.?/i, '');
        t += '\nLay it out as a table with one row for each function or job role:\nFunction | Service name | Service description\nThe function or job role | A short, clear name | What it achieves, the information and data it uses and who uses it, and the technology needed';
      } else if (a.kind === 'implications') {
        t = t.replace(/Produce a report using the template IT_Service_Management_Implications\.rtf/i, 'Produce a report with a separate section for each of the four areas below.');
      } else if (a.kind === 'solution') {
        t += '\nWhen practising online, describe each diagram in words: every device, which room it is in and how it connects.';
      }
      return t;
    },
    afs: { 1: [A[1]], 2: [A[2]], 3: [A[3]], 4: [A[4]], 5: [A[5]] },
    techLanguage: TECH_LANGUAGE,
    indicative: {
      1: ['Use the template: company needs and customer needs, each with IT service requirements and an explanation of priority (high, medium or low).', 'Lead Examiner: weaker strategies were generic and left out infrastructure such as computers, servers or switches, or bespoke software. Strong strategies covered every role’s devices, the network, printers, security, specific software (e.g. stock control, ordering, servicing records, fault logging, rota management, payroll), the website and all three future developments.', 'There is no single correct order of priority. The mark depends on how appropriate the priority is in relation to your rationale (e.g. EPOS or booking systems that the business depends on should not be “low”).'],
      2: ['Work role by role or function by function from the brief. Each service needs a name and a description: what it achieves, the information/data and who uses it, the technology.', 'Lead Examiner: Band 1 catalogues were generic, missed roles (e.g. drivers), invented roles or included non-IT items (e.g. spanners, a security guard). Band 3 catalogues matched every role, included specialist software, and were clear enough for a non-IT specialist.'],
      3: ['Cover all four bullets: information requirements, data requirements, hardware and software service options, managing infrastructure and users. Use written, tabular AND annotated diagram evidence.', 'Lead Examiner: both hardware AND software are needed. If software is left out, the hardware/software trait cannot go beyond Band 1. Network diagrams must show the internet connection, every location and clear links. Data must be identified, not only information. Organisation charts and Gantt charts earn no credit here.', 'Band 4 answers fully map the solution, with locations (e.g. the workshop manager’s office), accurate in-depth technical detail and data for every role.'],
      4: ['Compare the solution with the original requirements: can every role do their job, and what are the limitations? Evaluate the WHOLE solution, including the future developments.', 'Lead Examiner: alternatives must be genuine alternative items for a range of aspects (e.g. laptops versus desktops, cloud versus on-site server). These are not valid alternatives: “not following the law”, expecting staff to bring their own devices, or adding an extra item.', 'Justify using more than one argument, e.g. not only cost.'],
      5: ['Use the template’s four areas. For each one, think about constraints (legal, security, resources) and change (aims, products, services).', 'Lead Examiner: write about implications (training, support, downtime, data migration, costs, policies, legislation, asset management), not a second evaluation. Weaker reports ignored the capacity to respond to change. Strong reports discussed each future development, growth and new legislation realistically.']
    },
    classify: function (text, kind, n) {
      if (kind === 'set') return ({ 1: 'A', 2: 'B', 3: 'C', 4: 'B', 5: 'D' })[n] || 'A';
      return 'A';
    },
    topicFor: function () { return 'Set task'; }
  };
})();
