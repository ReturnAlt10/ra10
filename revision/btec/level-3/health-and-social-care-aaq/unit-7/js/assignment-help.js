/* BTEC Health and Social Care (AAQ) Unit 7 — per-criterion assignment help (RA10’s guidance; your work must be your own). */
(function () {
  'use strict';
  const CH = (means, evidence, next) => `<p><b>What it means:</b> ${means}</p><p><b>Evidence to include:</b></p><ul>${evidence.map(e => `<li>${e}</li>`).join('')}</ul>${next ? `<p><b>Reaching the next grade:</b> ${next}</p>` : ''}`;
  window.AAQ_CRIT_HELP = {
    _intro: '<h3>Before you start</h3><p>Pick <b>one example of each microorganism type</b> – a virus (e.g. influenza), a bacterium (e.g. Salmonella), a fungus (e.g. Candida) and a protozoan (e.g. Plasmodium). Using the same examples across learning aims A and B makes comparisons easier. For learning aim D, choose real outbreaks with reliable data (WHO, UKHSA).</p>',
    _tips: '<ul><li>Use labelled diagrams you draw yourself for microbe structures and immune responses.</li><li>Use correct scientific terms throughout.</li><li>Merit: discuss, compare, assess – show links and relative importance. Distinction: justify, evaluate, analyse – reasons, effectiveness, progression and consequences with evidence.</li><li>Reference sources for outbreak statistics.</li></ul>',
    'group:A': 'Learning aim A: structure, reproduction, growth requirements and control of four microorganisms.',
    'group:B': 'Learning aim B: the body’s defences, the immune system, transmission routes and infections.',
    'group:C': 'Learning aim C: nutritional, dietary and environmental causes of disease and how diseases progress.',
    'group:D': 'Learning aim D: classifying outbreaks, the authorities that control them and why outbreaks are becoming more global.',
    'A.P1': CH('Describe the structure and reproduction of four different microorganisms and what they need to grow.', ['Labelled diagrams of a virus, bacterium, fungus and protozoan.', 'How each reproduces (replication, binary fission, budding/spores, fission/life cycle).', 'Growth requirements – host, nutrients, temperature, water.'], 'For M1, discuss transmission and how growth requirements can be controlled.'),
    'A.M1': CH('Discuss how the four microorganisms are transmitted and how their growth can be controlled.', ['Transmission route for each.', 'Control methods linked to the specific requirement they remove (temperature, water, vector, host).'], 'For D1, justify control methods for two microorganisms.'),
    'A.D1': CH('Justify the methods used to control two different microorganisms.', ['Explain why each method is the most appropriate for that organism’s biology and transmission.', 'Consider effectiveness, practicality and limitations.'], null),
    'B.P2': CH('Describe the non-specific defences of the body.', ['Skin, mucous membranes, tears, stomach acid, phagocytes – how each works.'], null),
    'B.P3': CH('Describe how the immune system protects the body.', ['Humoral and cell-mediated responses, inflammation, leucocytes.', 'Vaccination types, herd immunity and eradication.'], null),
    'B.M2': CH('Compare transmission routes and relate them to specific infections.', ['Direct vs indirect routes with similarities/differences.', 'Named infections for each route and why they spread that way.'], 'For D2, evaluate how effective the body’s defences are.'),
    'B.D2': CH('Evaluate how effective non-specific defences and the immune system are in defending the body.', ['Strengths – layers of defence, memory, vaccination.', 'Limitations – pathogens evading defences (HIV), immunocompromised people, antibiotic resistance.', 'Supported conclusion.'], null),
    'C.P4': CH('Describe human and environmental conditions that can lead to disease.', ['Nutritional deficiencies, dietary habits, pollution, radiation, sanitation, pesticides, overcrowding.'], 'For M3, assess their impact on the body.'),
    'C.M3': CH('Assess the impact of these conditions on the human body.', ['Effects on body systems with examples.', 'Which have the most serious or widespread impact and why.'], 'For D3, analyse how diseases progress over time.'),
    'C.D3': CH('Analyse how diseases progress over time and the effects on individuals.', ['Stages of progression for chosen diseases.', 'Physical, emotional, social and economic effects on the individual.', 'Reversibility with early intervention.'], null),
    'D.P5': CH('Explain the characteristics of endemic, epidemic and pandemic outbreaks with an example of each.', ['Definitions and features.', 'Named examples (chickenpox, measles/flu, COVID-19) and changes in classification.'], null),
    'D.P6': CH('Describe the role of authorities in controlling outbreaks.', ['Governments, NGOs, scientists, WHO – their actions.', 'Factors they must consider (cost, staff, drugs, location, customs).'], 'For M4, assess how effective they are.'),
    'D.M4': CH('Assess how effective authorities are in controlling outbreaks and managing impact on society.', ['Real examples (COVID-19, Ebola) – successes and failures.', 'Judgement on effectiveness.'], 'For D4, evaluate why outbreaks are becoming more global and the consequences.'),
    'D.D4': CH('Evaluate the reasons for and consequences of outbreaks becoming more global.', ['Reasons – travel, urbanisation, climate change, zoonoses, resistance.', 'Consequences for individuals, families, communities, societies; ethics.', 'Weigh their importance and conclude.'], null)
  };
})();
