/* BTEC Medical Science (AAQ) Unit 2 — RA10 practice papers.
   Same layout as the Pearson sample: 2 hours, 80 marks. Section A (50): diagnostics, immunity, gene expression, genetics, immune dysfunction.
   Section B (30): cancer, then questions on a short article extract printed with Question 8 (the real exam uses a separate resource booklet),
   ending with a 6-mark and a 9-mark discussion. All article data are fictional, written by RA10 for practice. Mark schemes are RA10’s own. */
(function () {
  'use strict';
  function Q(n, sec, ctx, parts) {
    return parts.map((p, i) => ({ q: n, sub: p[0], marks: p[1], section: sec, ctx: i === 0 ? ctx : (p[4] || []), text: p[2], ms: { body: p[3], levels: null } }));
  }
  const L = (...lines) => lines.join('\n');
  const MC = (stem, opts) => stem + '\n' + opts.map((o, i) => 'ABCD'[i] + '  ' + o).join('\n');
  const IND = (m, ...lines) => L('Indicative content – credit other valid points. Strong answers use evidence from the extract and reach a judgement:', ...lines.map(x => '• ' + x), 'Award marks using the ' + m + '-mark levels (best fit).');
  function paper(n, title, blurb, qs) {
    const items = [].concat(...qs);
    return { id: 'MS2-R' + String(n).padStart(2, '0'), unit: 2, key: 'R' + String(n).padStart(2, '0'), source: 'ra10', spec: 'ra10', kind: 'exam', code: 'RA10',
      series: 'RA10 Paper ' + n, date: 'RA10 practice paper ' + n, title, blurb, minutes: 120, items, total: items.reduce((s, x) => s + x.marks, 0) };
  }
  const papers = [];

  /* ---------- Paper 1 ---------- */
  papers.push(paper(1, 'CVS · vaccination · sickle cell · breast screening extract', 'Prenatal testing, immune memory, mutation, haemophilia and an article on fear of breast screening.', [
    Q(1, 'A', ['Diagnostic techniques', 'Chorionic villus sampling (CVS) can be used to test a foetus for genetic disorders.'], [
      ['a', 1, 'Name one genetic condition that CVS can diagnose.', L('Award one mark for:', '• cystic fibrosis / sickle cell disease / thalassaemia / Down’s syndrome / any valid named condition')],
      ['b', 1, MC('Identify when CVS is usually performed.', ['6–8 weeks', '11–14 weeks', '15–20 weeks', '28–32 weeks']), L('Award one mark for:', '• B')],
      ['c', 2, 'Give two reasons why CVS would be offered rather than waiting for amniocentesis.', L('One mark each, up to two:', '• results available earlier in pregnancy (1)', '• allows earlier decisions / earlier termination is safer (1)', '• family history of a condition detectable from placental DNA (1)', '• high-risk result in first-trimester screening (1)')],
      ['d', 1, 'Name one non-invasive screening test offered in pregnancy.', L('Award one mark for:', '• NIPT (cell-free DNA blood test) / combined test / nuchal translucency ultrasound')],
      ['e', 3, 'Describe the process of CVS.', L('One mark each, up to three:', '• ultrasound used to locate the placenta (1)', '• needle through abdomen or catheter through cervix (1)', '• small sample of chorionic villi (placental tissue) removed (1)', '• cells cultured / DNA or chromosomes analysed (1)')]
    ]),
    Q(2, 'A', ['Immune response'], [
      ['a', 1, 'Name the cell that releases antibodies.', L('Award one mark for:', '• plasma cell (accept B lymphocyte)')],
      ['b', 1, 'Name the type of immunity produced by vaccination.', L('Award one mark for:', '• artificial active immunity')],
      ['c', 4, 'Antibody concentration after a first vaccine dose peaked at 12 arbitrary units at day 14. After a booster it peaked at 150 arbitrary units at day 5. Calculate the percentage increase in peak antibody concentration. Show your working.', L('Up to four marks:', '• difference 150 − 12 = 138 (1)', '• 138 ÷ 12 (1)', '• × 100 (1)', '• = 1150% (1)')],
      ['d', 3, 'Explain why the antibody peak after the booster is reached more quickly.', L('Up to three marks:', '• memory B cells were made after the first dose (1)', '• they recognise the antigen immediately without clonal selection from naive cells (1)', '• rapidly divide into plasma cells producing antibody sooner (1)')]
    ]),
    Q(3, 'A', ['Gene expression', 'In sickle cell disease the DNA triplet GAG is changed to GTG.'], [
      ['a', 1, 'Name the type of mutation in sickle cell disease.', L('Award one mark for:', '• substitution / point mutation')],
      ['b(i)', 1, 'State what is meant by a hereditary mutation.', L('Award one mark for:', '• a mutation in gametes / present before conception that can be passed to offspring')],
      ['b(ii)', 1, 'Give one reason why sickle cell disease is not an acquired condition.', L('Award one mark for:', '• the mutation is inherited from parents / present in every cell from conception')],
      ['c', 4, 'Explain how the substitution in sickle cell disease affects the protein produced.', L('Up to four marks:', '• codon changed so a different amino acid is coded (glutamic acid → valine) (1)', '• primary structure of haemoglobin changes (1)', '• tertiary/quaternary shape changes – haemoglobin polymerises at low oxygen (1)', '• red blood cells become sickle-shaped, carry less oxygen and block capillaries (1)')]
    ]),
    Q(4, 'A', ['Diagnostic techniques', 'A 70-year-old patient has a blood pressure reading of 165/100 mmHg.'], [
      ['a(i)', 1, 'Give the diagnosis suggested by this reading.', L('Award one mark for:', '• hypertension')],
      ['a(ii)', 2, 'Explain one long-term effect of this condition on the body.', L('Up to two marks:', '• damages artery walls / atherosclerosis (1) increasing risk of stroke / heart attack / kidney damage (1)')],
      ['b', 3, 'Five systolic readings were taken: 162, 168, 120, 165, 170 mmHg. Calculate the mean systolic pressure.', L('Up to three marks:', '• identify 120 as anomalous (1)', '• (162 + 168 + 165 + 170) ÷ 4 (1)', '• = 166.25 / 166 mmHg (1)', 'If 120 included: mean = 157 – award 1 mark')],
      ['c', 3, 'Explain why the doctor may request ambulatory blood pressure monitoring.', L('Up to three marks:', '• readings in the clinic may be raised by anxiety (white coat hypertension) (1)', '• ambulatory monitoring records BP regularly over 24 hours during normal life (1)', '• giving a more accurate average to confirm diagnosis/treatment (1)')]
    ]),
    Q(5, 'A', ['Genetic conditions', 'Haemophilia A is an X-linked recessive condition.'], [
      ['a', 1, 'State what is meant by a recessive allele.', L('Award one mark for:', '• only expressed when two copies are present (or one in males for X-linked)')],
      ['b', 2, 'Explain why people with haemophilia bruise easily.', L('Up to two marks:', '• they lack a clotting factor (factor VIII) (1)', '• so blood does not clot and bleeding under the skin continues (1)')],
      ['c', 3, 'A carrier mother (XᴴXʰ) and an unaffected father (XᴴY) have a child. Use a Punnett square to work out the probability that a son will have haemophilia.', L('Up to three marks:', '• correct gametes Xᴴ, Xʰ and Xᴴ, Y (1)', '• offspring XᴴXᴴ, XᴴXʰ, XᴴY, XʰY (1)', '• probability a son is affected = 1/2 / 50% (1)')],
      ['d', 2, 'Explain one ethical concern with pre-employment genetic screening.', L('Up to two marks:', '• employers may discriminate against people with a genetic predisposition (1) even though they may never develop the condition / it does not affect their ability (1)')]
    ]),
    Q(6, 'A', ['Immune dysfunction'], [
      ['a', 1, 'Name one blood test that shows inflammation.', L('Award one mark for:', '• CRP / ESR')],
      ['b', 2, 'Explain why rheumatoid arthritis is an autoimmune disease.', L('Up to two marks:', '• immune system attacks the body’s own tissue (1) – the synovial membrane of joints (1)')],
      ['c(i)', 3, 'A patient receiving chemotherapy has a white blood cell count of 2.1 × 10⁹ per litre (normal 4.0–11.0 × 10⁹). Explain why their count is outside the normal range.', L('Up to three marks:', '• count is below normal (1)', '• chemotherapy kills rapidly dividing cells (1)', '• including stem cells in bone marrow that produce white blood cells (1)')],
      ['c(ii)', 3, 'Explain one precaution the patient should take while their count is low.', L('Up to three marks:', '• avoid crowds / people with infections (1)', '• because they have fewer white cells to fight pathogens (1)', '• so infections could become serious quickly (1)', '(accept food hygiene, handwashing with justification)')]
    ]),
    Q(7, 'B', ['Cancer', 'Melanoma is a malignant tumour of the skin.'], [
      ['a', 1, 'Give one cause of melanoma.', L('Award one mark for:', '• UV radiation (sunlight / sunbeds)')],
      ['b', 2, 'Explain how UV radiation can lead to a tumour.', L('Up to two marks:', '• UV causes mutations in DNA of skin cells (1)', '• e.g. in tumour suppressor genes/oncogenes so cells divide uncontrollably (1)')],
      ['c', 3, 'Explain why a malignant tumour is more dangerous than a benign tumour.', L('Up to three marks:', '• malignant tumours are not encapsulated (1)', '• cells invade surrounding tissue and spread through blood/lymph (metastasis) (1)', '• forming secondary tumours in vital organs (1)')]
    ]),
    Q(8, 'B', ['Interpretation, analysis and evaluation of scientific information', 'Questions 8, 9, 10 and 11 are based on this extract (RA10 – fictional data).', 'Extract: “Fear is keeping women away from breast screening.” A survey of 1 200 women aged 50–71 who did not attend their screening appointment found that 38% gave fear of pain as a reason, 27% fear of the result, 19% embarrassment and 16% lack of time. Data from a retrospective cohort study of 40 000 women showed breast cancer mortality fell from 42 per 100 000 in 1990 to 26 per 100 000 in 2020. Uptake of screening fell from 76% in 2012 to 70% in 2022. The survey was funded by a breast cancer charity and published on its website.'], [
      ['a(i)', 1, 'State what is meant by a retrospective cohort study.', L('Award one mark for:', '• a study that uses existing records to look back at a group of people over time')],
      ['a(ii)', 2, 'Explain one drawback of the survey method used in the extract.', L('Up to two marks:', '• self-reported answers may be inaccurate / socially desirable (1) reducing validity (1)', '• only non-attenders surveyed / response bias (1) so not representative (1)')],
      ['b', 3, 'Explain one trend in screening uptake shown in the extract.', L('Up to three marks:', '• uptake fell from 76% to 70% (1)', '• a 6 percentage point / ~8% decrease over 10 years (1)', '• possibly due to fear or barriers to access, so more cancers may be detected late (1)')]
    ]),
    Q(9, 'B', [], [
      ['', 3, 'Explain one possible extrapolation of breast cancer mortality from the extract.', L('Up to three marks:', '• mortality fell by 16 per 100 000 in 30 years (1)', '• if the trend continues it may reach about 21 per 100 000 by 2030 (1)', '• assuming screening and treatment continue to improve; falling uptake may slow this (1)')]
    ]),
    Q(10, 'B', [], [
      ['', 6, 'Discuss how charities influence public opinion on cancer screening.', IND(6, 'Charities fund research and awareness campaigns', 'Produce accessible information, personal stories, celebrity support', 'Lobby government/NHS for programmes and funding', 'Trusted voice with patients; support services reduce fear', 'May have bias – emphasise benefits for fundraising', 'Judgement on extent of influence')]
    ]),
    Q(11, 'B', [], [
      ['', 9, 'The extract concluded: “Fear is keeping women away from breast screening.” Discuss the validity of this conclusion.', IND(9, 'Supporting: 38% fear of pain and 27% fear of result = majority of reasons; uptake has fallen', 'Sample of 1 200 is reasonably large but only non-attenders; women could give more than one reason?', 'Self-report bias; questionnaire design unknown', 'Funded and published by a charity – not peer reviewed; possible bias', 'Correlation: falling uptake not shown to be caused by fear – other factors (time, access, pandemic)', 'Judgement: partly valid but needs peer-reviewed, representative evidence')]
    ])
  ]));

  /* ---------- Paper 2 ---------- */
  papers.push(paper(2, 'Amniocentesis · inflammation · CF · HPV and cervical screening extract', 'Prenatal diagnosis, innate defences, cystic fibrosis, HIV and an article on HPV vaccination.', [
    Q(1, 'A', ['Diagnostic techniques', 'Amniocentesis is used to diagnose chromosomal conditions.'], [
      ['a', 1, 'Name one chromosomal condition amniocentesis can diagnose.', L('Award one mark for:', '• Down’s syndrome / Edwards’ syndrome / Patau’s syndrome')],
      ['b', 1, MC('Which of these is removed during amniocentesis?', ['Placental tissue', 'Amniotic fluid', 'Maternal blood', 'Umbilical cord tissue']), L('Award one mark for:', '• B')],
      ['c', 2, 'Give two risks of amniocentesis.', L('One mark each, up to two:', '• miscarriage (1)', '• infection (1)', '• leakage of amniotic fluid (1)', '• Rhesus sensitisation (1)', '• injury to foetus (rare) (1)')],
      ['d', 1, 'State the number of chromosomes in a karyotype of a child with Down’s syndrome.', L('Award one mark for:', '• 47')],
      ['e', 3, 'Explain one ethical issue a couple may face when deciding whether to have amniocentesis.', L('Up to three marks:', '• the test carries a risk of miscarriage (1)', '• a healthy pregnancy could be lost (1)', '• so they must balance the benefit of knowing against this risk / beliefs about termination (1)')]
    ]),
    Q(2, 'A', ['Immune response'], [
      ['a', 1, 'Name the chemical released by mast cells during inflammation.', L('Award one mark for:', '• histamine')],
      ['b', 1, 'Name the enzyme in tears that destroys bacteria.', L('Award one mark for:', '• lysozyme')],
      ['c', 4, 'A wound swelled from 12 mm to 21 mm in diameter over 6 hours. Calculate the percentage increase and the mean rate of increase per hour.', L('Up to four marks:', '• (21 − 12) ÷ 12 × 100 (1)', '• = 75% (1)', '• 9 ÷ 6 (1)', '• = 1.5 mm per hour (1)')],
      ['d', 3, 'Explain why the wound becomes red and swollen.', L('Up to three marks:', '• histamine causes vasodilation – more blood flow → redness and heat (1)', '• capillaries become more permeable (1)', '• fluid, proteins and phagocytes leave the blood into tissue → swelling (1)')]
    ]),
    Q(3, 'A', ['Gene expression', 'A section of mRNA reads AUG GCU UAC.'], [
      ['a', 1, 'State the number of amino acids coded by this section of mRNA.', L('Award one mark for:', '• three')],
      ['b(i)', 1, 'State the anticodon that is complementary to the codon GCU.', L('Award one mark for:', '• CGA')],
      ['b(ii)', 1, 'Name the molecule that carries the anticodon.', L('Award one mark for:', '• tRNA')],
      ['c', 4, 'Describe the roles of DNA helicase and RNA polymerase in transcription.', L('Up to four marks:', '• helicase breaks hydrogen bonds between bases (1)', '• unwinding / separating the two DNA strands (1)', '• RNA polymerase moves along the template strand (1)', '• joining complementary RNA nucleotides to form pre-mRNA (1)')]
    ]),
    Q(4, 'A', ['Diagnostic techniques', 'A child arrives at hospital after several days of vomiting.'], [
      ['a(i)', 1, 'Name a quick test used to assess tissue perfusion.', L('Award one mark for:', '• capillary refill test')],
      ['a(ii)', 2, 'The child’s capillary refill time is 4 seconds. Explain what this shows.', L('Up to two marks:', '• longer than the normal 2 seconds (1)', '• indicates dehydration / poor blood flow to tissues (1)')],
      ['b', 3, 'The child’s SpO₂ readings were 97, 98, 82, 97 and 96%. Calculate the mean.', L('Up to three marks:', '• identify 82 as anomalous (e.g. probe movement) (1)', '• (97 + 98 + 97 + 96) ÷ 4 (1)', '• = 97% (1)')],
      ['c', 3, 'Explain why a pulse oximeter may give an inaccurate reading in a dehydrated patient.', L('Up to three marks:', '• poor perfusion to fingers (1)', '• weak pulsatile signal detected by the sensor (1)', '• so the reading may be unreliable / falsely low (1)')]
    ]),
    Q(5, 'A', ['Genetic conditions', 'Cystic fibrosis is caused by a recessive allele.'], [
      ['a', 1, 'State what is meant by a heterozygous genotype.', L('Award one mark for:', '• two different alleles of a gene')],
      ['b', 2, 'Explain why people with cystic fibrosis get frequent chest infections.', L('Up to two marks:', '• thick sticky mucus in the airways is not cleared by cilia (1)', '• bacteria become trapped and multiply (1)')],
      ['c', 3, 'Two carrier parents have four children. Use a Punnett square to work out the expected number of children with cystic fibrosis.', L('Up to three marks:', '• Ff × Ff cross shown (1)', '• 1 in 4 / 25% chance of ff (1)', '• expected number = 1 (1)')],
      ['d', 2, 'Explain one limitation of using plucked hair to obtain DNA.', L('Up to two marks:', '• the root must be present (1) and only a small amount of DNA is obtained / may be degraded (1)')]
    ]),
    Q(6, 'A', ['Immune dysfunction', 'HIV is a virus that causes immunodeficiency.'], [
      ['a', 1, 'Name the type of cell infected by HIV.', L('Award one mark for:', '• helper T cell (CD4)')],
      ['b', 2, 'Explain why HIV is described as a secondary immunodeficiency.', L('Up to two marks:', '• it is acquired during life, not inherited (1)', '• caused by an external factor – viral infection (1)')],
      ['c(i)', 3, 'Explain one difference between a normal blood count and that of a patient with untreated HIV.', L('Up to three marks:', '• lower lymphocyte / CD4 count (1)', '• because HIV destroys helper T cells (1)', '• so the immune system cannot coordinate a response (1)')],
      ['c(ii)', 3, 'Explain how antiretroviral therapy helps a patient with HIV.', L('Up to three marks:', '• stops the virus replicating (1)', '• so CD4 count recovers (1)', '• reducing opportunistic infections and transmission risk / normal life expectancy (1)')]
    ]),
    Q(7, 'B', ['Cancer', 'Cervical cancer is mainly caused by human papillomavirus (HPV).'], [
      ['a', 1, 'Give one type of cancer screening offered by the NHS other than cervical screening.', L('Award one mark for:', '• breast / bowel')],
      ['b', 2, 'Explain how a virus can cause cancer.', L('Up to two marks:', '• viral DNA/proteins interfere with genes controlling the cell cycle (1)', '• e.g. inactivating tumour suppressor proteins so cells divide uncontrollably (1)')],
      ['c', 3, 'Explain why cervical screening can prevent cancer, not just detect it.', L('Up to three marks:', '• screening detects HPV and pre-cancerous (abnormal) cells (1)', '• these can be removed before they become malignant (1)', '• so invasive cancer never develops (1)')]
    ]),
    Q(8, 'B', ['Interpretation, analysis and evaluation of scientific information', 'Questions 8, 9, 10 and 11 are based on this extract (RA10 – fictional data).', 'Extract: “HPV vaccine could end cervical cancer.” A longitudinal study published in a peer-reviewed journal followed 1.5 million women for 12 years. Cervical cancer rates were 87% lower in women vaccinated at age 12–13 than in unvaccinated women. Vaccine uptake among girls was 85% in 2015 but 72% in 2023. Cervical screening uptake among women aged 25–29 is 64%. The study was funded by a government health agency. A social media post claimed the vaccine “stops the need for screening altogether”.'], [
      ['a(i)', 1, 'State what is meant by a longitudinal study.', L('Award one mark for:', '• a study that follows the same group of people over a long period of time')],
      ['a(ii)', 2, 'Explain one strength of the study design described in the extract.', L('Up to two marks:', '• very large sample of 1.5 million (1) so results are representative/reliable (1)', '• peer reviewed (1) methods checked by experts (1)', '• 12-year follow-up (1) allows cancer to develop (1)')],
      ['b', 3, 'Explain one trend in vaccine uptake shown in the extract.', L('Up to three marks:', '• uptake fell from 85% to 72% (1)', '• a decrease of 13 percentage points / about 15% (1)', '• possibly due to misinformation / pandemic disruption, which could increase future cancer rates (1)')]
    ]),
    Q(9, 'B', [], [
      ['', 3, 'Explain why the claim on social media that the vaccine “stops the need for screening altogether” is a misuse of data.', L('Up to three marks:', '• the study showed an 87% reduction, not 100% (1)', '• the vaccine does not protect against all HPV types / women vaccinated later or unvaccinated still at risk (1)', '• the claim extrapolates/misquotes the evidence and could reduce screening uptake (1)')]
    ]),
    Q(10, 'B', [], [
      ['', 6, 'Discuss how the World Health Organization influences health policy on cervical cancer.', IND(6, 'Global strategy to eliminate cervical cancer (90-70-90 targets)', 'Recommends HPV vaccination for girls and screening', 'Guidance and data for national governments', 'Supports lower-income countries with vaccine access', 'Campaigns to counter misinformation', 'Limits: depends on national funding/implementation; judgement')]
    ]),
    Q(11, 'B', [], [
      ['', 9, 'Discuss the validity of the conclusion that the “HPV vaccine could end cervical cancer”.', IND(9, 'Strong evidence: large peer-reviewed longitudinal study; 87% reduction', 'Government funding – less commercial bias but still a stakeholder', 'Correlation vs causation; other factors e.g. screening, lifestyle', 'Falling uptake (72%) and low screening uptake undermine elimination', 'Not all HPV types/other causes; older unvaccinated women', 'Judgement: could greatly reduce but “end” requires high uptake and screening')]
    ])
  ]));

  /* ---------- Paper 3 ---------- */
  papers.push(paper(3, 'ECG · antibodies · deletion mutations · bowel screening extract', 'Heart diagnostics, antibody structure, frameshift, Huntington’s and an article on FIT bowel screening.', [
    Q(1, 'A', ['Diagnostic techniques', 'An electrocardiogram (ECG) is used to assess heart rhythm.'], [
      ['a', 1, 'State what is recorded by an ECG.', L('Award one mark for:', '• electrical activity of the heart')],
      ['b', 1, MC('Which heart rate indicates tachycardia in an adult at rest?', ['45 bpm', '72 bpm', '88 bpm', '125 bpm']), L('Award one mark for:', '• D')],
      ['c', 2, 'Give two possible causes of bradycardia.', L('One mark each, up to two:', '• high fitness (athletes) (1)', '• heart block / damage to SAN (1)', '• hypothyroidism (1)', '• medication e.g. beta blockers (1)', '• hypothermia (1)')],
      ['d', 1, 'Name the part of an ECG trace caused by contraction of the atria.', L('Award one mark for:', '• P wave')],
      ['e', 3, 'An ECG shows 6 heartbeats in 4 seconds. Calculate the heart rate and state whether it is in the normal range.', L('Up to three marks:', '• 6 ÷ 4 × 60 (1)', '• = 90 bpm (1)', '• normal (60–100) (1)')]
    ]),
    Q(2, 'A', ['Immune response'], [
      ['a', 1, 'Name the region of an antibody that is the same in all antibodies of a class.', L('Award one mark for:', '• constant region')],
      ['b', 1, 'Name the process by which phagocytes engulf pathogens.', L('Award one mark for:', '• phagocytosis (endocytosis)')],
      ['c', 4, 'Describe the structure of an antibody.', L('One mark each, up to four:', '• Y-shaped protein / immunoglobulin (1)', '• two heavy and two light polypeptide chains (1)', '• held by disulphide bonds (1)', '• two variable regions forming antigen-binding sites (1)', '• constant region binds to phagocytes (1)')],
      ['d', 3, 'Explain why each antibody only binds to one type of antigen.', L('Up to three marks:', '• variable region has a specific shape / amino acid sequence (1)', '• complementary to the shape of one antigen (1)', '• forming an antigen–antibody complex (1)')]
    ]),
    Q(3, 'A', ['Gene expression', 'Original DNA: TAC GGA TTC. Mutated DNA: TAC GAT TC…'], [
      ['a', 1, 'Name the type of mutation shown.', L('Award one mark for:', '• deletion')],
      ['b(i)', 1, 'State what is meant by a frameshift.', L('Award one mark for:', '• the reading frame shifts so all codons after the mutation change')],
      ['b(ii)', 1, 'Give one chemical that can cause mutations.', L('Award one mark for:', '• tar in tobacco smoke / asbestos / benzene / mustard gas / any valid mutagen')],
      ['c', 4, 'Explain why some substitution mutations have no effect on the protein while deletions usually do.', L('Up to four marks:', '• the genetic code is degenerate – more than one codon codes for the same amino acid (1)', '• so a substitution may still code for the same amino acid (silent) (1)', '• a deletion causes a frameshift (1)', '• changing many amino acids so the protein’s shape and function change (1)')]
    ]),
    Q(4, 'A', ['Diagnostic techniques', 'A 45-year-old with numbness in their feet has a nerve conduction velocity test.'], [
      ['a(i)', 1, 'Give one condition that could cause numbness in the feet.', L('Award one mark for:', '• peripheral neuropathy / diabetes / MS / spinal cord injury')],
      ['a(ii)', 2, 'Explain how diabetes could cause peripheral neuropathy.', L('Up to two marks:', '• high blood glucose damages small blood vessels supplying nerves (1)', '• so nerves are damaged and conduct impulses poorly (1)')],
      ['b', 3, 'NCV readings: 38.2, 36.9, 37.5, 12.0, 38.4 m/s. Calculate the mean NCV.', L('Up to three marks:', '• identify 12.0 as anomalous (1)', '• (38.2 + 36.9 + 37.5 + 38.4) ÷ 4 (1)', '• = 37.75 m/s (1)')],
      ['c', 3, 'Explain why the doctor takes several readings rather than one.', L('Up to three marks:', '• allows anomalies to be identified (1)', '• a mean reduces the effect of random error (1)', '• improving reliability of the diagnosis (1)')]
    ]),
    Q(5, 'A', ['Genetic conditions', 'Huntington’s disease is caused by a dominant allele.'], [
      ['a', 1, 'State what is meant by a dominant allele.', L('Award one mark for:', '• an allele that is expressed when only one copy is present')],
      ['b', 2, 'Explain why Huntington’s disease can be passed on even though it is fatal.', L('Up to two marks:', '• symptoms usually appear after age 30–50 (1)', '• so people may already have had children before they know (1)')],
      ['c', 3, 'A heterozygous father (Hh) and an unaffected mother (hh) have a child. Use a Punnett square to give the probability the child inherits the condition.', L('Up to three marks:', '• gametes H, h × h, h (1)', '• offspring Hh, Hh, hh, hh (1)', '• 50% / 1/2 (1)')],
      ['d', 2, 'Explain one ethical issue of testing an adult for Huntington’s disease.', L('Up to two marks:', '• there is no cure (1) so a positive result can cause serious distress / some prefer not to know (1)', '• implications for relatives (1) who may not want to know their own risk (1)')]
    ]),
    Q(6, 'A', ['Immune dysfunction'], [
      ['a', 1, 'Name the type of drug used to prevent organ rejection.', L('Award one mark for:', '• immunosuppressant')],
      ['b', 2, 'Explain why a transplanted organ may be rejected.', L('Up to two marks:', '• donor cells have different (non-self) antigens (1)', '• recognised by the recipient’s T cells which attack the organ (1)')],
      ['c(i)', 3, 'Explain why transplant recipients are at higher risk of infection.', L('Up to three marks:', '• immunosuppressants reduce lymphocyte activity (1)', '• so pathogens are not destroyed quickly (1)', '• opportunistic infections can develop (1)')],
      ['c(ii)', 3, 'Explain one ethical issue linked to organ donation.', L('Up to three marks:', '• opt-out system presumes consent (1)', '• some argue consent should be explicit / families may disagree (1)', '• but it increases the supply of organs and saves lives (1)')]
    ]),
    Q(7, 'B', ['Cancer', 'Bowel cancer often begins as a benign polyp.'], [
      ['a', 1, 'Give one characteristic of a benign tumour.', L('Award one mark for:', '• encapsulated / does not spread / slow-growing / cells similar to normal')],
      ['b', 2, 'Explain how a benign polyp could become malignant.', L('Up to two marks:', '• further mutations accumulate in oncogenes/tumour suppressor genes (1)', '• cells become invasive and able to spread (1)')],
      ['c', 3, 'Explain why a biopsy is taken during a colonoscopy.', L('Up to three marks:', '• tissue sample examined under the microscope (histopathology) (1)', '• to confirm whether cells are cancerous (1)', '• and identify type/grade to plan treatment (1)')]
    ]),
    Q(8, 'B', ['Interpretation, analysis and evaluation of scientific information', 'Questions 8, 9, 10 and 11 are based on this extract (RA10 – fictional data).', 'Extract: “Home test kits boost bowel screening.” When the FIT home test replaced an older stool test, uptake rose from 59% to 66%. In the most deprived areas uptake was 52%, compared with 74% in the least deprived. A randomised controlled trial of 20 000 people found a reminder text message increased uptake by 4 percentage points (p = 0.01). Bowel cancer deaths in people aged 60–74 fell from 58 per 100 000 in 2006 to 41 per 100 000 in 2022. The trial was carried out by a university and published in a peer-reviewed journal.'], [
      ['a(i)', 1, 'State what is meant by a randomised controlled trial.', L('Award one mark for:', '• participants are randomly allocated to an intervention group or a control group to compare outcomes')],
      ['a(ii)', 2, 'Explain what the p-value of 0.01 shows.', L('Up to two marks:', '• result is statistically significant (p < 0.05) (1)', '• only a 1% probability the increase is due to chance (1)')],
      ['b', 3, 'Explain one pattern in the uptake data shown in the extract.', L('Up to three marks:', '• uptake is lower in deprived areas (52%) than least deprived (74%) (1)', '• a difference of 22 percentage points (1)', '• possibly due to barriers such as literacy, time, awareness – leading to later diagnosis in deprived groups (1)')]
    ]),
    Q(9, 'B', [], [
      ['', 3, 'Calculate the percentage decrease in bowel cancer deaths between 2006 and 2022.', L('Up to three marks:', '• 58 − 41 = 17 (1)', '• 17 ÷ 58 × 100 (1)', '• = 29(.3)% (1)')]
    ]),
    Q(10, 'B', [], [
      ['', 6, 'Discuss how universities and research teams influence decisions about cancer screening.', IND(6, 'Carry out trials such as the reminder-text RCT', 'Peer-reviewed evidence informs NHS/NICE policy', 'Independent from commercial interests (though may be funded by industry/charity)', 'Evaluate cost-effectiveness and new tests', 'Communicate findings to public and media', 'Limits: research takes time; findings may be misreported; judgement')]
    ]),
    Q(11, 'B', [], [
      ['', 9, 'Discuss the validity of the conclusion that “home test kits boost bowel screening”.', IND(9, 'Uptake rose from 59% to 66% after FIT introduced – supports conclusion', 'But before/after comparison – other changes (reminders, campaigns) could explain', 'RCT is strong evidence but tests reminders, not kits', 'Large peer-reviewed university study – credible', 'Inequality: deprived areas still low – kits not equally effective', 'Judgement: likely valid but causation not proven by these data alone')]
    ])
  ]));

  /* ---------- Paper 4 ---------- */
  papers.push(paper(4, 'Spirometry · passive immunity · Down’s syndrome · lung health check extract', 'Respiratory diagnostics, monoclonal antibodies, aneuploidy, allergy and an article on lung cancer screening.', [
    Q(1, 'A', ['Diagnostic techniques', 'Spirometry measures how much and how fast a person can breathe out.'], [
      ['a', 1, 'State what FEV₁ means.', L('Award one mark for:', '• forced expiratory volume in 1 second')],
      ['b', 1, MC('An FEV₁/FVC ratio below 0.7 suggests…', ['normal lungs', 'an obstructive condition', 'hyperthermia', 'tachycardia']), L('Award one mark for:', '• B')],
      ['c', 2, 'Give two conditions that can be diagnosed using spirometry.', L('One mark each, up to two:', '• asthma (1)', '• COPD (1)', '• pulmonary fibrosis (1)', '• cystic fibrosis lung disease (1)')],
      ['d', 1, 'Name a simpler test patients can use at home to monitor asthma.', L('Award one mark for:', '• peak flow meter')],
      ['e', 3, 'A patient’s FEV₁ is 2.1 dm³ and FVC is 3.5 dm³. Calculate the FEV₁/FVC ratio and interpret it.', L('Up to three marks:', '• 2.1 ÷ 3.5 (1)', '• = 0.6 (1)', '• below 0.7 so obstructive – e.g. COPD/asthma (1)')]
    ]),
    Q(2, 'A', ['Immune response'], [
      ['a', 1, 'Name one way a newborn baby gains natural passive immunity.', L('Award one mark for:', '• antibodies across the placenta / in breast milk (colostrum)')],
      ['b', 1, 'Name the type of immunity given by an injection of monoclonal antibodies.', L('Award one mark for:', '• artificial passive immunity')],
      ['c', 4, 'Explain two differences between active and passive immunity.', L('One mark for each difference and one expansion:', '• active – body makes its own antibodies / passive – antibodies given (1) so passive works immediately (1)', '• active produces memory cells / passive does not (1) so passive is short-lived (1)')],
      ['d', 3, 'Explain why passive immunity is used to treat a snake bite.', L('Up to three marks:', '• venom acts very quickly (1)', '• active immune response would take days to make antibodies (1)', '• injected antibodies (antivenom) neutralise the toxin immediately (1)')]
    ]),
    Q(3, 'A', ['Gene expression'], [
      ['a', 1, 'Name the coding sections of a gene that remain in mature mRNA.', L('Award one mark for:', '• exons')],
      ['b(i)', 1, 'State where translation takes place.', L('Award one mark for:', '• ribosome (in the cytoplasm / on RER)')],
      ['b(ii)', 1, 'State the number of bases in a codon.', L('Award one mark for:', '• three')],
      ['c', 4, 'Describe the process of translation.', L('One mark each, up to four:', '• mRNA attaches to a ribosome (1)', '• tRNA with complementary anticodon binds to each codon (1)', '• each tRNA carries a specific amino acid (1)', '• peptide bonds form between adjacent amino acids (1)', '• continues until a stop codon (1)')]
    ]),
    Q(4, 'A', ['Diagnostic techniques', 'An older man is found outdoors on a cold night with a core temperature of 33.8 °C.'], [
      ['a(i)', 1, 'Give the diagnosis suggested by this temperature.', L('Award one mark for:', '• hypothermia')],
      ['a(ii)', 2, 'Explain one effect of this temperature on the body.', L('Up to two marks:', '• enzymes work more slowly (1) so metabolism and heart rate slow / confusion (1)')],
      ['b', 3, 'Readings with an ear thermometer were 33.9, 33.6, 36.8, 33.8 and 33.7 °C. Calculate the mean.', L('Up to three marks:', '• identify 36.8 as anomalous (1)', '• (33.9 + 33.6 + 33.8 + 33.7) ÷ 4 (1)', '• = 33.75 °C (1)')],
      ['c', 3, 'Explain why a rectal thermometer may be preferred in this situation.', L('Up to three marks:', '• gives a more accurate measure of core temperature (1)', '• ear/forehead readings affected by cold skin/environment (1)', '• accurate reading needed to guide rewarming treatment (1)')]
    ]),
    Q(5, 'A', ['Genetic conditions', 'Down’s syndrome is caused by aneuploidy.'], [
      ['a', 1, 'State what is meant by aneuploidy.', L('Award one mark for:', '• an abnormal number of chromosomes')],
      ['b', 2, 'Explain how non-disjunction leads to Down’s syndrome.', L('Up to two marks:', '• chromosome 21 fails to separate during meiosis (1)', '• gamete has an extra copy so the zygote has three copies (trisomy 21) (1)')],
      ['c', 3, 'The risk of Down’s syndrome is about 1 in 1500 at maternal age 20 and 1 in 100 at age 40. Calculate how many times greater the risk is at 40 and explain the trend.', L('Up to three marks:', '• 1500 ÷ 100 (1)', '• = 15 times greater (1)', '• older eggs more likely to have non-disjunction errors (1)')],
      ['d', 2, 'Explain one effect of Down’s syndrome on health.', L('Up to two marks:', '• heart defects (1) may need surgery (1)', '• learning disability (1) needs educational support (1)', '• weaker immune system (1) more infections (1)')]
    ]),
    Q(6, 'A', ['Immune dysfunction', 'Allergy-induced asthma is triggered by allergens such as pollen.'], [
      ['a', 1, 'Name the type of antibody involved in allergic reactions.', L('Award one mark for:', '• IgE')],
      ['b', 2, 'Explain how an allergen causes the airways to narrow.', L('Up to two marks:', '• allergen binds IgE on mast cells causing histamine release (1)', '• smooth muscle contracts and airways become inflamed with mucus (1)')],
      ['c(i)', 3, 'Explain how a preventer (steroid) inhaler helps.', L('Up to three marks:', '• reduces inflammation in the airways (1)', '• making them less sensitive to triggers (1)', '• so fewer attacks occur (1)')],
      ['c(ii)', 3, 'Explain why anaphylaxis needs adrenaline rather than an antihistamine.', L('Up to three marks:', '• adrenaline acts in minutes (1)', '• constricts blood vessels to raise blood pressure (1)', '• and relaxes airway muscles; antihistamines act too slowly for a life-threatening reaction (1)')]
    ]),
    Q(7, 'B', ['Cancer', 'Lung cancer is the leading cause of cancer death in the UK.'], [
      ['a', 1, 'Give one imaging method used to diagnose lung cancer.', L('Award one mark for:', '• CT scan / chest X-ray / PET scan')],
      ['b', 2, 'Explain how smoking causes lung cancer.', L('Up to two marks:', '• tar contains carcinogens/mutagens (1)', '• which cause mutations in genes controlling cell division (1)')],
      ['c', 3, 'Explain one short-term and one long-term side effect of radiotherapy for lung cancer.', L('Up to three marks:', '• short-term: tiredness / sore skin / difficulty swallowing (1)', '• long-term: lung fibrosis / breathlessness (1)', '• because radiation also damages healthy cells near the tumour (1)')]
    ]),
    Q(8, 'B', ['Interpretation, analysis and evaluation of scientific information', 'Questions 8, 9, 10 and 11 are based on this extract (RA10 – fictional data).', 'Extract: “Lung health checks catch cancer early.” Current and former smokers aged 55–74 in a pilot area were invited for a lung health check including a low-dose CT scan. Of 12 000 people invited, 6 300 attended. 1.8% were diagnosed with lung cancer; 76% of these were at stage 1 or 2, compared with 30% nationally. 4% received a false positive result. A newspaper reported the pilot as “Scans to wipe out lung cancer deaths”. The pilot was evaluated by an NHS team and has not yet been peer reviewed.'], [
      ['a(i)', 1, 'Calculate the percentage of invited people who attended.', L('Award one mark for:', '• 6 300 ÷ 12 000 × 100 = 52.5%')],
      ['a(ii)', 2, 'Explain one possible effect of a false positive result.', L('Up to two marks:', '• patient told they may have cancer when they do not (1) causing anxiety and unnecessary further tests/biopsy with risks (1)')],
      ['b', 3, 'Explain one conclusion that can be drawn from the stage at diagnosis data.', L('Up to three marks:', '• 76% diagnosed at stage 1–2 vs 30% nationally (1)', '• cancers are found earlier through the checks (1)', '• when surgery is possible and survival is higher (1)')]
    ]),
    Q(9, 'B', [], [
      ['', 3, 'Explain why the newspaper headline is a misuse of the data.', L('Up to three marks:', '• the pilot measured stage at diagnosis, not deaths (1)', '• only about half of those invited attended and only smokers were invited (1)', '• so “wipe out deaths” is an exaggerated extrapolation (1)')]
    ]),
    Q(10, 'B', [], [
      ['', 6, 'Discuss the barriers that may prevent people attending a lung health check.', IND(6, 'Fear of diagnosis; stigma/guilt about smoking', 'Practical: time off work, transport, caring responsibilities', 'Lower awareness / health literacy; language', 'Disability and access', 'Distrust of services', 'Ways to reduce barriers – mobile units, reminders; judgement')]
    ]),
    Q(11, 'B', [], [
      ['', 9, 'Discuss the validity of the conclusion that “lung health checks catch cancer early”.', IND(9, 'Strong comparison: 76% early vs 30% nationally', 'Sample of 6 300 attendees – reasonable size', 'Selection bias: attenders may be healthier/more health-aware', 'Not yet peer reviewed; evaluated by NHS team (possible interest)', 'Single pilot area – may not generalise; false positives', 'Judgement: supported but needs peer review and wider data')]
    ])
  ]));

  /* ---------- Paper 5 ---------- */
  papers.push(paper(5, 'Arterial blood gases · killer T cells · acquired mutations · sunbed extract', 'Oxygen diagnostics, cellular immunity, mutation causes, MS and an article on sunbeds and melanoma.', [
    Q(1, 'A', ['Diagnostic techniques', 'Pulse oximetry and arterial blood gases measure blood oxygen.'], [
      ['a', 1, 'State the normal range for oxygen saturation.', L('Award one mark for:', '• 95–100%')],
      ['b', 1, MC('Where is blood usually taken for an arterial blood gas test?', ['Vein in the elbow', 'Radial artery at the wrist', 'Fingertip capillary', 'Jugular vein']), L('Award one mark for:', '• B')],
      ['c', 2, 'Give two conditions that could cause hypoxaemia.', L('One mark each, up to two:', '• COPD (1)', '• pneumonia (1)', '• asthma attack (1)', '• pulmonary fibrosis (1)', '• heart failure (1)')],
      ['d', 1, 'Give one advantage of pulse oximetry over arterial blood gases.', L('Award one mark for:', '• non-invasive / painless / continuous / quick')],
      ['e', 3, 'Explain how a pulse oximeter measures oxygen saturation.', L('Up to three marks:', '• clip shines red and infrared light through the finger (1)', '• oxygenated and deoxygenated haemoglobin absorb light differently (1)', '• sensor calculates the percentage of haemoglobin carrying oxygen (1)')]
    ]),
    Q(2, 'A', ['Immune response'], [
      ['a', 1, 'Name the cell that kills body cells infected with a virus and displaying a specific antigen.', L('Award one mark for:', '• killer (cytotoxic) T cell')],
      ['b', 1, 'Name the type of white blood cell that releases histamine and is involved in allergy.', L('Award one mark for:', '• basophil (accept mast cell)')],
      ['c', 4, 'After infection, the number of specific T cells rose from 200 to 25 000 per ml in 8 days. Calculate the mean increase per day and the percentage increase.', L('Up to four marks:', '• 24 800 ÷ 8 (1)', '• = 3100 per ml per day (1)', '• 24 800 ÷ 200 × 100 (1)', '• = 12 400% (1)')],
      ['d', 3, 'Explain how helper T cells activate B cells.', L('Up to three marks:', '• helper T cell with a complementary receptor binds to antigen presented by a macrophage (1)', '• releases cytokines (1)', '• which stimulate the specific B cell to divide into plasma cells and memory cells (1)')]
    ]),
    Q(3, 'A', ['Gene expression'], [
      ['a', 1, 'Name the type of cell in which acquired mutations occur.', L('Award one mark for:', '• somatic (body) cell')],
      ['b(i)', 1, 'State why acquired mutations cannot be passed to offspring.', L('Award one mark for:', '• they are not in gametes')],
      ['b(ii)', 1, 'Give one infectious agent linked to acquired mutations.', L('Award one mark for:', '• HPV / hepatitis B or C / Epstein–Barr virus / H. pylori')],
      ['c', 4, 'Explain two ways that a mutation in a non-coding region could affect a cell.', L('One mark for each location and one for effect:', '• promoter region (1) – RNA polymerase binds less/more, changing rate of expression (1)', '• intron/splice site (1) – mRNA spliced incorrectly, producing an abnormal protein (1)', '• control region of a proto-oncogene (1) – gene switched on permanently, uncontrolled division (1)')]
    ]),
    Q(4, 'A', ['Diagnostic techniques', 'A patient with suspected MS has electromyography (EMG) and reflex tests.'], [
      ['a(i)', 1, 'State what an EMG measures.', L('Award one mark for:', '• electrical activity in muscles (in response to nerve stimulation)')],
      ['a(ii)', 2, 'Explain why the patient’s knee-jerk reflex might be abnormal.', L('Up to two marks:', '• damaged myelin slows/blocks impulses in the reflex pathway (1)', '• so the response is delayed, weak or exaggerated (1)')],
      ['b', 3, 'Reaction times for a reflex test were 0.21, 0.24, 0.22, 0.58 and 0.23 s. Calculate the mean.', L('Up to three marks:', '• identify 0.58 as anomalous (1)', '• (0.21 + 0.24 + 0.22 + 0.23) ÷ 4 (1)', '• = 0.225 s (1)')],
      ['c', 3, 'Explain one other test that could support a diagnosis of MS.', L('Up to three marks:', '• MRI scan of brain/spinal cord (1)', '• shows areas of demyelination / lesions (plaques) (1)', '• confirming damage in the CNS consistent with MS (1)', '(accept lumbar puncture or NCV with explanation)')]
    ]),
    Q(5, 'A', ['Genetic conditions'], [
      ['a', 1, 'State what is meant by phenotype.', L('Award one mark for:', '• the observable characteristics of an individual')],
      ['b', 2, 'Explain why a carrier of a recessive condition does not show symptoms.', L('Up to two marks:', '• they have one dominant (normal) allele (1)', '• which produces enough functional protein (1)')],
      ['c', 3, 'In a pedigree, two unaffected parents have an affected daughter. Explain what this shows about the inheritance of the condition.', L('Up to three marks:', '• the condition is recessive (1)', '• both parents must be carriers / heterozygous (1)', '• it is autosomal – an affected daughter of an unaffected father rules out X-linked recessive (1)')],
      ['d', 2, 'Explain one benefit of whole genome sequencing in newborns.', L('Up to two marks:', '• early detection of treatable conditions (e.g. metabolic disorders) (1) so treatment can start before symptoms / damage (1)')]
    ]),
    Q(6, 'A', ['Immune dysfunction', 'Multiple sclerosis is an autoimmune disease.'], [
      ['a', 1, 'Name the structure in the CNS attacked in MS.', L('Award one mark for:', '• myelin sheath')],
      ['b', 2, 'Give two theoretical causes of MS.', L('One mark each, up to two:', '• genetic predisposition (1)', '• low vitamin D / little sunlight (1)', '• Epstein–Barr virus infection (1)', '• smoking (1)')],
      ['c(i)', 3, 'Explain how MS can affect a person’s mobility.', L('Up to three marks:', '• demyelination slows impulses in motor pathways (1)', '• causing muscle weakness, spasticity or poor coordination (1)', '• so walking and balance are affected (1)')],
      ['c(ii)', 3, 'Explain how disease-modifying drugs help people with MS.', L('Up to three marks:', '• suppress or modify the immune response (1)', '• reducing attacks on myelin / number of relapses (1)', '• slowing progression of disability (1)')]
    ]),
    Q(7, 'B', ['Cancer'], [
      ['a', 1, 'Give one type of laboratory test used in cancer diagnosis.', L('Award one mark for:', '• blood test / tumour marker test / cytogenetic analysis / biopsy histology')],
      ['b', 2, 'Explain why melanoma is often treated with surgery.', L('Up to two marks:', '• it is on the skin surface so easily accessible (1)', '• removing it early with a margin can cure it before it spreads (1)')],
      ['c', 3, 'Explain why different cancers need different treatments.', L('Up to three marks:', '• cancers differ in location, type and stage (1)', '• e.g. hormone-sensitive cancers respond to hormone therapy (1)', '• widespread cancers need systemic treatment such as chemotherapy rather than surgery (1)')]
    ]),
    Q(8, 'B', ['Interpretation, analysis and evaluation of scientific information', 'Questions 8, 9, 10 and 11 are based on this extract (RA10 – fictional data).', 'Extract: “Sunbeds behind rise in young melanoma.” Melanoma rates in people aged 25–34 rose from 6.2 to 9.8 per 100 000 between 2000 and 2020. A questionnaire of 450 young adults found 31% had used a sunbed. A meta-analysis of 20 peer-reviewed studies found that using a sunbed before age 35 increases melanoma risk by 59%. A sunbed industry association stated that “moderate tanning is safe”. Sunbed use by under-18s has been illegal in England since 2011.'], [
      ['a(i)', 1, 'State what is meant by a meta-analysis.', L('Award one mark for:', '• combining and analysing the results of many studies')],
      ['a(ii)', 2, 'Explain one reason why the industry statement may be biased.', L('Up to two marks:', '• the industry profits from sunbed use (1) so has a financial interest in presenting them as safe (1)')],
      ['b', 3, 'Calculate the percentage increase in melanoma rates in people aged 25–34 between 2000 and 2020.', L('Up to three marks:', '• 9.8 − 6.2 = 3.6 (1)', '• 3.6 ÷ 6.2 × 100 (1)', '• = 58(.1)% (1)')]
    ]),
    Q(9, 'B', [], [
      ['', 3, 'Explain one limitation of the questionnaire described in the extract.', L('Up to three marks:', '• sample of 450 is small compared to the population (1)', '• self-reported sunbed use may be under-reported (1)', '• so it may not accurately represent all young adults (1)')]
    ]),
    Q(10, 'B', [], [
      ['', 6, 'Discuss how the government and NHS can reduce the incidence of melanoma.', IND(6, 'Legislation – ban on under-18 sunbed use; could extend', 'Public health campaigns on sun safety (SPF, shade, clothing)', 'Education in schools', 'Early detection – GP checks of moles, awareness of ABCDE signs', 'Limits – behaviour change is hard; tanning culture', 'Judgement')]
    ]),
    Q(11, 'B', [], [
      ['', 9, 'Discuss the validity of the conclusion that “sunbeds are behind the rise in young melanoma”.', IND(9, 'Meta-analysis of 20 peer-reviewed studies – strong evidence of 59% higher risk', 'Rates rose 58% – consistent with risk', 'But other causes: holidays abroad, sun exposure, better detection/diagnosis', 'Questionnaire small and self-reported', 'Correlation vs causation; under-18 ban since 2011 should reduce future rates', 'Judgement: sunbeds are a significant contributor but not the only cause')]
    ])
  ]));

  /* ---------- Paper 6 ---------- */
  papers.push(paper(6, 'Blood pressure · B cells · gene terms · PSA testing extract', 'Hypotension, clonal selection, genetic vocabulary, SCID, Crohn’s and an article on prostate cancer testing.', [
    Q(1, 'A', ['Diagnostic techniques', 'A patient feels dizzy when standing. Their blood pressure is 85/55 mmHg.'], [
      ['a', 1, 'Give the term for this blood pressure reading.', L('Award one mark for:', '• hypotension')],
      ['b', 1, MC('Which unit is blood pressure measured in?', ['bpm', 'mmHg', 'm/s', '%']), L('Award one mark for:', '• B')],
      ['c', 2, 'Give two possible causes of hypotension.', L('One mark each, up to two:', '• dehydration (1)', '• blood loss (1)', '• shock (1)', '• medication e.g. antihypertensives (1)', '• heart problems (1)')],
      ['d', 1, 'State what the second number in a blood pressure reading represents.', L('Award one mark for:', '• diastolic pressure – pressure when the heart relaxes')],
      ['e', 3, 'Explain why low blood pressure can cause dizziness.', L('Up to three marks:', '• less blood reaches the brain (1)', '• so less oxygen and glucose delivered to brain cells (1)', '• reducing brain function – dizziness/fainting (1)')]
    ]),
    Q(2, 'A', ['Immune response'], [
      ['a', 1, 'Name the process by which a specific B cell is chosen and divides.', L('Award one mark for:', '• clonal selection (clonal expansion)')],
      ['b', 1, 'Name the type of cell that remains in the blood for years after an infection.', L('Award one mark for:', '• memory cell (B or T)')],
      ['c', 4, 'In a primary response antibodies first appear at day 7 and peak at 40 units. In a secondary response they appear at day 2 and peak at 320 units. Calculate how many times larger the secondary peak is and the difference in time to appear.', L('Up to four marks:', '• 320 ÷ 40 (1)', '• = 8 times larger (1)', '• 7 − 2 (1)', '• = 5 days sooner (1)')],
      ['d', 3, 'Explain why a person usually does not become ill when exposed a second time to the same pathogen.', L('Up to three marks:', '• memory cells recognise the antigen (1)', '• the secondary response produces more antibodies faster (1)', '• so pathogens are destroyed before they multiply enough to cause symptoms (1)')]
    ]),
    Q(3, 'A', ['Gene expression'], [
      ['a', 1, 'Name the enzyme that unwinds DNA.', L('Award one mark for:', '• DNA helicase')],
      ['b(i)', 1, 'State what is meant by an intron.', L('Award one mark for:', '• a non-coding section of a gene removed during splicing')],
      ['b(ii)', 1, 'Give one type of radiation that can cause mutations.', L('Award one mark for:', '• UV / X-rays / gamma rays / radon (alpha)')],
      ['c', 4, 'Explain two effects of mutations at different locations on gene expression.', L('One mark for each location and one for effect:', '• start codon (1) – translation cannot begin so protein not made (1)', '• stop codon (1) – protein too long (1)', '• tumour suppressor gene (1) – cell division not controlled → cancer (1)')]
    ]),
    Q(4, 'A', ['Diagnostic techniques', 'A runner collapses on a hot day. Their core temperature is 40.6 °C.'], [
      ['a(i)', 1, 'Give the diagnosis suggested by this reading.', L('Award one mark for:', '• hyperthermia / heatstroke')],
      ['a(ii)', 2, 'Explain why this temperature is dangerous.', L('Up to two marks:', '• enzymes denature (1)', '• metabolic reactions and organ function fail – brain damage, seizures (1)')],
      ['b', 3, 'Heart rate readings were 128, 132, 130, 64 and 134 bpm. Calculate the mean heart rate.', L('Up to three marks:', '• identify 64 as anomalous (1)', '• (128 + 132 + 130 + 134) ÷ 4 (1)', '• = 131 bpm (1)')],
      ['c', 3, 'Explain why the runner’s heart rate is high.', L('Up to three marks:', '• dehydration reduces blood volume (1)', '• so stroke volume falls (1)', '• heart rate increases to maintain cardiac output / tachycardia (1)')]
    ]),
    Q(5, 'A', ['Genetic conditions'], [
      ['a', 1, 'State what is meant by homozygous.', L('Award one mark for:', '• two identical alleles of a gene')],
      ['b', 2, 'Explain the difference between genotype and phenotype.', L('Up to two marks:', '• genotype – the alleles present (1)', '• phenotype – the characteristics produced, influenced by genotype and environment (1)')],
      ['c', 3, 'A woman with cystic fibrosis (ff) and a carrier man (Ff) have a child. Use a Punnett square to give the probability the child has cystic fibrosis.', L('Up to three marks:', '• gametes f, f × F, f (1)', '• offspring Ff, Ff, ff, ff (1)', '• 50% / 1/2 (1)')],
      ['d', 2, 'Explain one concern about how genome sequencing data are stored.', L('Up to two marks:', '• data could be hacked/shared without consent (1) leading to discrimination or loss of privacy (1)')]
    ]),
    Q(6, 'A', ['Immune dysfunction'], [
      ['a', 1, 'Name one primary immunodeficiency.', L('Award one mark for:', '• SCID')],
      ['b', 2, 'Explain why babies with SCID develop serious infections soon after birth.', L('Up to two marks:', '• they have no functioning T and B cells (1)', '• once maternal antibodies decline they cannot fight even mild infections (1)')],
      ['c(i)', 3, 'Explain how Crohn’s disease affects the function of the digestive system.', L('Up to three marks:', '• inflammation of the gut wall (1)', '• damages villi / causes ulcers and narrowing (1)', '• reducing absorption → weight loss, malnutrition, diarrhoea (1)')],
      ['c(ii)', 3, 'Explain one treatment for Crohn’s disease.', L('Up to three marks:', '• steroids / immunosuppressants / biologics (1)', '• reduce the immune response attacking the gut (1)', '• reducing inflammation and symptoms (1)', '(accept surgery to remove damaged section with explanation)')]
    ]),
    Q(7, 'B', ['Cancer', 'Prostate cancer is the most common cancer in men in the UK.'], [
      ['a', 1, 'Give one type of cancer treatment other than surgery.', L('Award one mark for:', '• chemotherapy / radiotherapy / hormone therapy')],
      ['b', 2, 'Explain how hormone therapy can treat prostate cancer.', L('Up to two marks:', '• prostate cancer cells grow in response to testosterone (1)', '• hormone therapy lowers/blocks testosterone, slowing tumour growth (1)')],
      ['c', 3, 'Explain why a tumour marker test alone cannot confirm cancer.', L('Up to three marks:', '• markers can be raised by non-cancerous conditions (1)', '• giving false positives (1)', '• so a biopsy/imaging is needed to confirm (1)')]
    ]),
    Q(8, 'B', ['Interpretation, analysis and evaluation of scientific information', 'Questions 8, 9, 10 and 11 are based on this extract (RA10 – fictional data).', 'Extract: “PSA test saves lives – screen all men over 50.” The PSA blood test measures prostate-specific antigen. In a European trial of 160 000 men, regular PSA testing reduced prostate cancer deaths by 20% after 16 years. However, about 75% of men with a raised PSA did not have cancer on biopsy, and around 15% of men with cancer had a normal PSA. There is no national PSA screening programme in the UK. The headline appeared in a men’s health magazine sponsored by a private clinic offering PSA tests.'], [
      ['a(i)', 1, 'State what is meant by a false negative.', L('Award one mark for:', '• a test result that says no disease when the disease is present')],
      ['a(ii)', 2, 'Explain one consequence of the false positive rate described in the extract.', L('Up to two marks:', '• many men without cancer would have biopsies (1) which carry risks of infection/bleeding and cause anxiety (1)')],
      ['b', 3, 'Explain why a national screening programme has not been introduced in the UK, using the extract.', L('Up to three marks:', '• 75% false positives and 15% false negatives (1)', '• test is not accurate enough (1)', '• harms (overdiagnosis, unnecessary treatment) may outweigh the 20% reduction in deaths (1)')]
    ]),
    Q(9, 'B', [], [
      ['', 3, 'Explain one strength of the European trial described in the extract.', L('Up to three marks:', '• very large sample of 160 000 men (1)', '• long follow-up of 16 years (1)', '• so results are reliable and able to detect differences in deaths (1)')]
    ]),
    Q(10, 'B', [], [
      ['', 6, 'Discuss how private companies and the media can influence public opinion about cancer testing.', IND(6, 'Advertising and sponsorship – profit motive', 'Headlines simplify or exaggerate findings', 'Can raise awareness and encourage people to seek help', 'May cause unnecessary anxiety or demand for unproven tests', 'Conflicts with NHS evidence-based guidance', 'Judgement on overall influence')]
    ]),
    Q(11, 'B', [], [
      ['', 9, 'Discuss the validity of the headline “PSA test saves lives – screen all men over 50”.', IND(9, 'Evidence: large trial shows 20% fewer deaths – supports “saves lives”', 'But 75% false positives and 15% false negatives – overdiagnosis and harm', 'Source bias – magazine sponsored by a private clinic selling tests', 'Trial in Europe – may not apply to all UK groups', 'NHS has not adopted national screening after reviewing the evidence', 'Judgement: partly supported but “screen all men” is not justified by the data')]
    ])
  ]));

  window.BIZ_PAPERS = (window.BIZ_PAPERS || []).concat(papers);
})();
