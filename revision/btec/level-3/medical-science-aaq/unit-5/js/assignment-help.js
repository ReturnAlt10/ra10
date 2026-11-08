/* BTEC Medical Science (AAQ) Unit 5 — per-criterion assignment help (RA10’s guidance; your work must be your own). */
(function () {
  'use strict';
  const CH = (means, evidence, next) => `<p><b>What it means:</b> ${means}</p><p><b>Evidence to include:</b></p><ul>${evidence.map(e => `<li>${e}</li>`).join('')}</ul>${next ? `<p><b>Reaching the next grade:</b> ${next}</p>` : ''}`;
  window.AAQ_CRIT_HELP = {
    _intro: '<h3>Before you start</h3><p>This unit is about how laboratory tests diagnose disease. Collect <b>normal reference ranges</b> (with sources) for blood and urine, and choose a few example diseases to follow through. Your urinalysis practical will use <b>artificial urine samples</b> – keep a clear record of method, results and interpretation.</p>',
    _tips: '<ul><li>Always give values with units and say what a high or low result suggests.</li><li>Explain procedures step by step (who, how, why).</li><li>Evaluate tests: accuracy, sensitivity/specificity, false results, invasiveness, speed, cost and setting.</li><li>Link diagnosis back to treatment outcomes and the health service.</li></ul>',
    'group:A': 'Learning aim A: blood components, how disease changes them and the tests that detect it.',
    'group:B': 'Learning aim B: histology, cytology, screening programmes and the implications of results.',
    'group:C': 'Learning aim C: urine composition and practical urinalysis.',
    'A.P1': CH('Describe the structure and function of the main components of blood.', ['Erythrocytes, leucocytes, thrombocytes, plasma, serum – labelled diagrams.'], null),
    'A.P2': CH('Describe how diseases change blood composition and how tests identify the changes.', ['Anaemias, sickle cell, thalassaemia, malaria, HIV, glandular fever, leukaemia, lymphoma, infections, clotting disorders.', 'Normal values and the abnormal results.'], 'For M1, explain the procedures used in the tests.'),
    'A.M1': CH('Explain the procedures used in diagnostic tests for different diseases.', ['Step-by-step procedures – FBC, blood film, differential, clotting, antibody tests, bone marrow aspiration.', 'Why each step is done.'], 'For D1, evaluate blood testing for detecting disease.'),
    'A.D1': CH('Evaluate the use of blood testing to detect diseases.', ['Strengths – speed, cost, routine, early detection.', 'Limitations – false results, need for confirmation, invasiveness (marrow).', 'Supported judgement.'], null),
    'B.P3': CH('Describe the use of analytical investigations in disease screening.', ['Bowel, cervical, AAA and newborn blood spot screening – who, how, what is detected.'], null),
    'B.P4': CH('Describe analytical investigations of cell and tissue samples.', ['Consent, CSF aspiration, biopsies, autopsy specimens, histology workflow and automation.'], 'For M2, explain why accurate and timely diagnosis matters.'),
    'B.M2': CH('Explain the importance of accurate and timely diagnosis for treatment outcomes.', ['Stage at diagnosis and survival, prognosis and quality of life, effects of false results.'], 'For D2, evaluate implications for individuals and the NHS.'),
    'B.D2': CH('Evaluate the implications of screening and early diagnosis for individuals and the health service.', ['Benefits and harms for individuals; costs and savings for the NHS; uptake and inequality issues.', 'Justified conclusion.'], null),
    'C.P5': CH('Describe how urine composition varies with health.', ['Normal composition and values.', 'Abnormal constituents and the diseases they indicate.'], null),
    'C.P6': CH('Correctly carry out simple urinalysis.', ['Risk assessment, sampling procedure, visual check, dipstick testing, (microscopy if available).', 'Results table and observations; teacher observation record.'], 'For M3, explain the causes of the results.'),
    'C.M3': CH('Explain the causes of urinalysis results used to diagnose changes in health.', ['Physiology behind each abnormal result (e.g. renal threshold for glucose).', 'Factors that could produce misleading results.'], 'For D3, evaluate urinalysis at home and in clinics.'),
    'C.D3': CH('Evaluate the use of urinalysis in domestic and clinical settings.', ['Home tests (pregnancy, glucose, UTI) vs GP/hospital labs.', 'Accuracy, convenience, cost, need for confirmation, user error.', 'Supported conclusion.'], null)
  };
})();
