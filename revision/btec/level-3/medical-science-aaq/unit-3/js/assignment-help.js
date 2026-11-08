/* BTEC Medical Science (AAQ) Unit 3 — per-criterion assignment help (RA10’s guidance; your work must be your own). */
(function () {
  'use strict';
  const CH = (means, evidence, next) => `<p><b>What it means:</b> ${means}</p><p><b>Evidence to include:</b></p><ul>${evidence.map(e => `<li>${e}</li>`).join('')}</ul>${next ? `<p><b>Reaching the next grade:</b> ${next}</p>` : ''}`;
  window.AAQ_CRIT_HELP = {
    _intro: '<h3>Before you start</h3><p>This unit mixes written work (learning aims A and B) with practical work (C and D). Keep a <b>dated lab book</b>: risk assessments, methods, raw results, photos of slides and plates, and notes on what went wrong. Your teacher will also complete observation records for practical criteria.</p>',
    _tips: '<ul><li>Use scientific terms precisely and draw your own labelled diagrams.</li><li>For practical criteria, show you <b>selected</b> the right technique and used it correctly – explain why.</li><li>Calculations (dilution factors, magnification, means, SD) must show working and units.</li><li>Distinction: evaluate accuracy, reliability and validity, suggest specific improvements and link findings to treating disease.</li></ul>',
    'group:A': 'Learning aim A: characteristics, classification and virulence of microorganisms.',
    'group:B': 'Learning aim B: development, prevention and treatment of infectious diseases and current issues.',
    'group:C': 'Learning aim C: practical microscopy, staining, aseptic culture and counting.',
    'group:D': 'Learning aim D: your antimicrobial investigation – data, conclusions and evaluation.',
    'A.P1': CH('Describe the characteristics used to classify microorganisms.', ['Prokaryotes, protists, fungi, viruses and prions.', 'Shape, Gram stain, oxygen needs, Baltimore classification, motility.'], 'For M1, explain how these characteristics are used to classify.'),
    'A.P2': CH('Describe the roles of microbial structures and the factors affecting growth.', ['Cell wall, flagella, pili, capsule, plasmids, capsid, envelope.', 'Growth curve and effects of temperature, nutrients, pH, oxygen.'], null),
    'A.P3': CH('Describe virulence mechanisms of disease-causing microorganisms.', ['Bacteria – adhesins, toxins, immune evasion.', 'Eukaryotes – proteases, antigenic variation, survival in phagocytes.', 'Viruses – entry, cell damage, latency.'], 'For M2, explain how these mechanisms cause infection.'),
    'A.M1': CH('Explain how characteristics are used to classify microorganisms.', ['Show the reasoning – e.g. Gram stain result reflects wall structure; Baltimore groups by replication route.'], null),
    'A.M2': CH('Explain how virulence mechanisms cause infection.', ['Link each mechanism to a stage of infection (entry, attachment, damage, evasion) with named pathogens.'], 'For D1, compare mechanisms across groups.'),
    'A.D1': CH('Compare the virulence mechanisms of different groups of pathogens.', ['Similarities and differences between bacteria, fungi, protists and viruses.', 'Which mechanisms make infections hardest to treat, with examples.'], null),
    'B.P4': CH('Describe how different types of infectious disease develop.', ['Bacterial, viral, fungal, prionic and protist diseases – signs, symptoms, progression.', 'Transmission routes.'], null),
    'B.P5': CH('Describe the prevention and treatment of different infectious diseases.', ['Vaccine types, hygiene, environmental measures.', 'Antibiotics, antifungals, antivirals, antiprotozoals and how they act.'], 'For M3, discuss development alongside prevention and treatment.'),
    'B.M3': CH('Discuss the development of infectious diseases with their prevention and treatment strategies.', ['Link the biology of each disease to why particular prevention/treatment works.'], 'For D2, evaluate these and current issues.'),
    'B.D2': CH('Evaluate prevention and treatment and the impact of current issues.', ['Effectiveness and limitations of treatments.', 'Antibiotic resistance, sepsis, antigenic variation, vaccine uptake.', 'Supported conclusion.'], null),
    'C.P6': CH('Carry out morphological studies, microscopy and staining to identify microorganisms.', ['Smear and hanging-drop slides, Gram stain, colony and broth descriptions.', 'Photos, drawings with magnification and size calculations.'], 'For M4, discuss the quality of results.'),
    'C.M4': CH('Discuss the identification and cultivation techniques in terms of the quality of results.', ['How well stains/microscopy worked, clarity, limitations of morphology for identification.'], 'For D3, evaluate techniques and skills developed.'),
    'C.D3': CH('Evaluate the microscopy and practical techniques used and the skills you developed.', ['Strengths and weaknesses, sources of error, improvements, personal skill development.'], null),
    'C.P7': CH('Correctly select and use aseptic technique to cultivate microorganisms.', ['Choice of media and method with reasons.', 'Evidence of aseptic steps and safe incubation.'], 'For M5, include serial dilutions and counting.'),
    'C.M5': CH('Use aseptic technique to grow and measure growth, including serial dilutions and counts.', ['Dilution series, plating, counts, calculations of cfu/ml.', 'Haemocytometer or turbidity if used.'], 'For D4, judge the accuracy of your enumeration.'),
    'C.D4': CH('Use aseptic enumeration techniques correctly and judge their accuracy.', ['Compare methods, identify errors (clumping, pipetting, contamination), suggest improvements.'], null),
    'D.P8': CH('Cultivate microorganisms to measure the effects of antimicrobials accurately.', ['Method with controls, repeats, concentrations.', 'Raw data table of zone diameters.'], 'For M6, interpret your data.'),
    'D.M6': CH('Interpret your data to reach a conclusion, considering prevention and treatment of disease.', ['Means, SD, graphs, trends, anomalies.', 'Conclusion linked to real-world use of antimicrobials.'], 'For D5, evaluate methods, techniques and data.'),
    'D.D5': CH('Evaluate the methods, techniques and data used to determine antimicrobial effects.', ['Reliability, validity, sources of error, limitations of disc diffusion.', 'Improvements and further research (e.g. MIC tests).'], null)
  };
})();
