/* BTEC Medical Science (AAQ) Unit 4 — per-criterion assignment help (RA10’s guidance; your work must be your own). */
(function () {
  'use strict';
  const CH = (means, evidence, next) => `<p><b>What it means:</b> ${means}</p><p><b>Evidence to include:</b></p><ul>${evidence.map(e => `<li>${e}</li>`).join('')}</ul>${next ? `<p><b>Reaching the next grade:</b> ${next}</p>` : ''}`;
  window.AAQ_CRIT_HELP = {
    _intro: '<h3>Before you start</h3><p>Choose a <b>focus disease or disorder</b> you can follow from molecule to treatment – sickle cell disease, type 1 diabetes, breast cancer or Parkinson’s work well. For learning aim C choose a <b>specific drug or medicine</b> that was synthesised for a purpose (e.g. imatinib, insulin analogues, a monoclonal antibody) and trace its development.</p>',
    _tips: '<ul><li>Use diagrams of molecular changes (e.g. normal vs sickle haemoglobin).</li><li>Cover physical AND mental health effects.</li><li>Evaluate treatments with evidence: success/survival data, side effects, risks, quality of life.</li><li>Ethics: use principles (autonomy, beneficence, non-maleficence, justice) and real cases.</li><li>Reference reliable sources – NHS, NICE, MHRA, Cancer Research UK, journals.</li></ul>',
    'group:A': 'Learning aim A: roles of biological molecules and how disruption leads to disease.',
    'group:B': 'Learning aim B: effects of diseases and their treatments on individuals.',
    'group:C': 'Learning aim C: drug development and testing, innovative treatments and ethics.',
    'A.P1': CH('Explain the roles of proteins, nucleic acids and lipids in maintaining health.', ['Proteins: antibodies, hormones, enzymes, repair/clotting, transport – with examples.', 'Lipids: vitamins and hormone production.', 'Nucleic acids: cell division, reproduction, protein synthesis.'], 'For M1, discuss how disruption leads to one disease.'),
    'A.M1': CH('Discuss how disruption to molecules and processes leads to one disease.', ['Molecular change (mutation, missing enzyme, autoimmune damage).', 'Effect on the pathway and resulting symptoms.'], 'For D1, evaluate the impact on the person.'),
    'A.D1': CH('Evaluate the impact of the disease on the person affected.', ['Physical, emotional, social, financial impacts.', 'Severity, variability between people, effect of treatment.', 'Supported judgement.'], null),
    'B.P2': CH('Describe the effects of the listed diseases and disorders.', ['Development and possible effects of each.', 'Mental-health impact of diagnosis and prognosis.'], null),
    'B.P3': CH('Describe the treatments for these diseases.', ['Radiotherapy (incl. brachytherapy), chemotherapy, hormone therapy, surgery, stem cell therapy – how each works and what it treats.'], 'For M2, discuss effects of diseases and treatments on the individual.'),
    'B.M2': CH('Discuss the effects on the individual of diseases and their treatments.', ['Positive and negative effects, risks and mental-health impacts.'], 'For D2, evaluate treatments.'),
    'B.D2': CH('Evaluate the effects of treatments.', ['Benefits vs side effects and risks with evidence.', 'Which treatment is best in which circumstances, and why.'], null),
    'C.P4': CH('Describe the development and testing of a synthesised drug or medicine.', ['Discovery, optimisation, pre-clinical work, phases of clinical trials, regulatory approval.'], 'For M3, discuss problems that arise.'),
    'C.M3': CH('Discuss problems during development and testing of drugs and treatments.', ['Targets, candidate molecules, toxicity, lack of effectiveness, cost, time, recruitment, rare side effects.'], 'For D3, evaluate ethical, legal and moral issues.'),
    'C.D3': CH('Evaluate the ethical, legal and moral issues of drug development, testing and treatment for a disease.', ['Consent, confidentiality, animal testing, placebo use, access and cost, “should it be done?”.', 'Weigh both sides with examples and reach a judgement.'], null)
  };
})();
