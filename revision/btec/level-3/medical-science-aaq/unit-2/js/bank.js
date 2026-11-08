/* BTEC Medical Science (AAQ) Unit 2 — Health Issues and Scientific Reporting: knowledge checks in the Pearson style. */
(function () {
  'use strict';
  const B = BizBank('MS2', 'AAQ');
  window.__BIZ_B = B;
  const { K, KL } = B;

  /* A — diagnostic techniques */
  K('A', 'A1 Heart rate', 'State', 2, 'State the normal resting heart rate range for an adult and its unit.', ['60–100 (1)', 'beats per minute / bpm (1)']);
  K('A', 'A1 Heart rate', 'Name', 2, 'Name two diagnostic tests used to observe heart rate.', ['Electrocardiogram (ECG)', 'Pulse oximetry', 'Manual pulse']);
  K('A', 'A1 Heart rate', 'Explain', 2, 'Explain how an ECG could show atrial fibrillation.', ['No clear P waves / irregular baseline (1) because the atria contract chaotically, giving an irregular ventricular rhythm (1)']);
  K('A', 'A1 Blood pressure', 'State', 2, 'State the normal blood pressure for an adult and its unit.', ['About 120/80 (accept 90/60 – 120/80) (1)', 'mmHg (1)']);
  K('A', 'A1 Blood pressure', 'Explain', 2, 'Explain why ambulatory blood pressure monitoring may be used instead of a single reading.', ['Readings taken regularly over 24 hours during normal activities (1) avoids “white coat” effect and gives a more accurate/representative average (1)']);
  K('A', 'A1 Blood pressure', 'Explain', 2, 'Explain one health risk of untreated hypertension.', ['High pressure damages artery walls / atherosclerosis (1) increasing risk of stroke / heart attack / kidney damage (1)']);
  K('A', 'A1 Respiratory', 'Explain', 3, 'Explain how spirometry can distinguish asthma from COPD.', ['Both show reduced FEV₁/FVC (obstruction) (1)', 'In asthma FEV₁ improves significantly after a bronchodilator (reversible) (1)', 'In COPD obstruction is largely irreversible (1)']);
  K('A', 'A1 Respiratory', 'State', 1, 'State the normal respiratory rate for an adult at rest.', ['12–20 breaths per minute']);
  K('A', 'A1 Temperature', 'State', 1, 'State the normal core body temperature range.', ['36.5–37.5 °C']);
  K('A', 'A1 Temperature', 'Give', 1, 'Give one possible diagnosis for a core temperature of 39.3 °C.', ['Infection / fever', 'Hyperthermia / heatstroke']);
  K('A', 'A1 Temperature', 'Explain', 2, 'Explain one effect a core temperature of 39.3 °C could have on the body.', ['Metabolic reactions disrupted (1) because enzymes start to denature (1)', 'Dehydration (1) through increased sweating (1)']);
  K('A', 'A1 Temperature', 'Explain', 2, 'Explain one advantage of an ear (tympanic) thermometer over a rectal thermometer.', ['Quick and non-invasive (1) so more comfortable and acceptable for patients (1)']);
  K('A', 'A1 Perfusion', 'Describe', 3, 'Describe how a capillary refill test is carried out and interpreted.', ['Press on the nail bed/skin for about 5 seconds (1)', 'Release and time how long colour takes to return (1)', 'Normal under 2 seconds; longer suggests dehydration/poor perfusion/shock (1)']);
  K('A', 'A1 Oxygen', 'State', 1, 'State the normal oxygen saturation range.', ['95–100% (SpO₂)']);
  K('A', 'A1 Oxygen', 'Explain', 2, 'Explain why arterial blood gases may be used rather than pulse oximetry.', ['They give a more accurate measure of oxygen, carbon dioxide and pH (1) which is needed for seriously ill patients / when oximetry is unreliable e.g. poor circulation (1)']);
  K('A', 'A1 Nervous', 'Calculate', 3, 'NCV readings were 24.7, 28.4, 62.0, 26.5 and 24.4 m/s. Calculate the mean.', ['Identify 62.0 as anomalous (1)', '(24.7 + 28.4 + 26.5 + 24.4) ÷ 4 (1)', '= 26.0 m/s (1)']);
  K('A', 'A1 Nervous', 'Explain', 3, 'Explain why a person with MS could have NCV readings below the normal range.', ['MS damages the myelin sheath (1)', 'so saltatory conduction between nodes of Ranvier cannot occur (1)', 'so impulses travel more slowly (1)']);
  K('A', 'A1 Nervous', 'Name', 2, 'Name two tests used to assess nervous system function.', ['Electromyography (EMG)', 'Nerve conduction velocity test', 'Reflex test']);
  K('A', 'A2 Amniocentesis', 'Describe', 3, 'Describe the process of amniocentesis.', ['Ultrasound used to locate the foetus/placenta (1)', 'Fine needle inserted through the abdomen into the amniotic sac (1)', 'Small sample of amniotic fluid containing foetal cells removed and analysed (karyotype/DNA) (1)']);
  K('A', 'A2 Amniocentesis', 'Identify', 1, 'Identify when amniocentesis is usually performed.', ['15–20 weeks of pregnancy']);
  K('A', 'A2 Amniocentesis', 'Give', 2, 'Give two reasons why amniocentesis would be offered.', ['High-risk result from screening', 'Family history of a genetic condition', 'Previous affected pregnancy', 'Mother aged 35+', 'Parents known carriers', 'Abnormal ultrasound']);
  K('A', 'A2 CVS', 'Explain', 2, 'Explain one advantage of chorionic villus sampling over amniocentesis.', ['It can be done earlier (11–14 weeks) (1) so parents have results earlier to make decisions (1)']);
  K('A', 'A2 Ethics', 'Explain', 2, 'Explain one ethical concern with prenatal diagnostic testing.', ['Risk of miscarriage of a healthy foetus (1) about 0.5–1% (1)', 'May lead to decisions about termination (1) which conflict with religious/disability-rights views (1)']);

  /* B — immunity */
  K('B', 'B1 Physical barriers', 'Explain', 2, 'Explain how the skin acts as a barrier to infection.', ['Tough outer layer of dead keratinised cells (1) that pathogens cannot easily penetrate; sebum/acidic pH also inhibits microbes (1)']);
  K('B', 'B1 Chemical', 'State', 2, 'State two chemical defences of the body.', ['Lysozyme in tears and saliva', 'Stomach acid', 'Mucus', 'Gut microbiota (competition)']);
  K('B', 'B1 Inflammation', 'Explain', 3, 'Explain the role of histamine in inflammation.', ['Released by mast cells/basophils (1)', 'causes vasodilation and increases capillary permeability (1)', 'so more blood, phagocytes and fluid reach the site, causing redness and swelling (1)']);
  K('B', 'B1 Innate cells', 'State', 1, 'State the role of natural killer cells.', ['Kill virus-infected and cancer cells']);
  K('B', 'B1 Antibody', 'Define', 1, 'Define the term antibody.', ['A protein (immunoglobulin) produced by plasma cells/B cells that binds to a specific antigen']);
  K('B', 'B1 Antibody', 'Name', 1, 'Name the part of an antibody that binds a specific antigen.', ['Variable region / antigen-binding site']);
  K('B', 'B1 Antigen', 'Define', 1, 'Define the term antigen.', ['A molecule, usually a protein on a cell surface, that triggers an immune response']);
  K('B', 'B1 Agglutination', 'Explain', 2, 'Explain how agglutination helps destroy pathogens.', ['Antibodies bind several pathogens together into clumps (1) making it easier for phagocytes to engulf them (1)']);
  K('B', 'B1 Helper T', 'Explain', 3, 'Explain the role of helper T cells in the immune response.', ['Recognise antigen presented by macrophages (1)', 'Release cytokines that activate B cells to divide and produce antibodies (1)', 'Activate killer T cells and macrophages (1)']);
  K('B', 'B1 Clonal selection', 'Describe', 3, 'Describe clonal selection of B cells.', ['B cell with complementary receptor binds the antigen (1)', 'Activated by helper T cell and divides by mitosis (1)', 'Clones differentiate into plasma cells secreting antibodies and memory cells (1)']);
  K('B', 'B1 Secondary response', 'Name', 1, 'Name the type of cell that allows rapid antibody production in a secondary response.', ['B memory cell']);
  K('B', 'B1 Secondary response', 'Explain', 3, 'Explain why the secondary immune response is faster than the primary response.', ['Memory B cells remain after first exposure (1)', 'they recognise the antigen immediately – no need for clonal selection from scratch (1)', 'they rapidly divide into plasma cells so more antibody is made sooner (1)']);
  K('B', 'B1 Vaccination', 'Explain', 2, 'Explain how vaccination provides immunity.', ['A harmless/inactivated antigen stimulates a primary response (1) producing memory cells so a later infection triggers a fast secondary response (1)']);
  K('B', 'B1 Passive', 'Explain', 2, 'Explain the difference between natural and artificial passive immunity.', ['Natural: antibodies passed from mother via placenta or breast milk (1)', 'Artificial: antibodies injected, e.g. monoclonal antibodies/antivenom (1)']);
  K('B', 'B1 Calculation', 'Calculate', 2, 'Antibody concentration increased from 15 to 135 arbitrary units. Calculate the percentage increase.', ['(135 − 15) ÷ 15 × 100 (1)', '= 800% (1)']);
  K('B', 'B2 Autoimmune', 'Name', 1, 'Name one test used to diagnose an autoimmune disease.', ['C-reactive protein (CRP)', 'Antinuclear antibody (ANA) test', 'Complete blood count with differential', 'ESR']);
  K('B', 'B2 Crohn’s', 'Explain', 2, 'Explain why Crohn’s disease is classified as an autoimmune disease.', ['The immune system attacks the body’s own tissue (1) – the lining of the gut, causing inflammation (1)']);
  K('B', 'B2 RA', 'Explain', 2, 'Explain how rheumatoid arthritis affects joint function.', ['Immune cells attack the synovial membrane causing inflammation (1) leading to pain, swelling, stiffness and joint damage/deformity (1)']);
  K('B', 'B2 HIV', 'Explain', 3, 'Explain why a person with HIV is vulnerable to opportunistic infections.', ['HIV infects and destroys helper T (CD4) cells (1)', 'so B cells and killer T cells are not activated (1)', 'so the body cannot fight infections that are normally harmless (1)']);
  K('B', 'B2 SCID', 'State', 1, 'State one treatment for SCID.', ['Bone marrow (stem cell) transplant', 'Gene therapy', 'Enzyme replacement']);
  K('B', 'B2 Chemotherapy', 'Explain', 2, 'Explain why chemotherapy causes immunodeficiency.', ['It kills rapidly dividing cells including in the bone marrow (1) so fewer white blood cells are made (1)']);
  K('B', 'B2 Transplants', 'Explain', 2, 'Explain why transplant patients take immunosuppressants.', ['The donor organ has non-self antigens (1) so suppressing the immune system prevents rejection (1)']);
  K('B', 'B2 Anaphylaxis', 'Explain', 3, 'Explain how anaphylaxis can be life-threatening.', ['Massive release of histamine (1)', 'widespread vasodilation causes a dangerous fall in blood pressure (1)', 'and airway swelling/bronchoconstriction blocks breathing (1)']);
  KL('B', 'B2 Ethics', 'Discuss', 6, 'Discuss the ethical considerations of organ transplants and blood transfusions.', ['Shortage and fair allocation of organs', 'Opt-out consent system; family wishes', 'Risks for living donors', 'Religious objections (e.g. transfusions)', 'Cost, illegal organ trade', 'Safety testing of donations']);

  /* C — genetics */
  K('C', 'C1 Transcription', 'Explain', 2, 'Explain the roles of DNA helicase and RNA polymerase in transcription.', ['Helicase unwinds/unzips DNA by breaking hydrogen bonds (1)', 'RNA polymerase joins RNA nucleotides complementary to the template strand (1)']);
  K('C', 'C1 Splicing', 'Explain', 2, 'Explain what happens during splicing.', ['Non-coding introns are removed from pre-mRNA (1) and coding exons are joined together (1)']);
  K('C', 'C1 Translation', 'Explain', 2, 'Explain the difference between a codon and an anticodon.', ['Codon: three bases on mRNA coding for an amino acid (1)', 'Anticodon: complementary three bases on tRNA (1)']);
  K('C', 'C1 Mutation', 'Name', 1, 'A DNA sequence changes from CCT GAG GAG to CCT GTG GAG. Name the type of mutation.', ['Substitution (point mutation)']);
  K('C', 'C1 Mutation', 'Explain', 2, 'Explain why a deletion usually has a bigger effect than a substitution.', ['Deletion causes a frameshift (1) so every codon after it is changed, altering many amino acids (1)']);
  K('C', 'C1 Acquired', 'State', 1, 'State what is meant by an acquired mutation.', ['A change in the DNA of a somatic cell occurring after conception that cannot be inherited']);
  K('C', 'C1 Acquired', 'Give', 1, 'Give one cause of an acquired mutation.', ['Radiation (UV, X-rays)', 'Chemicals (tobacco tar, asbestos)', 'Infectious agents (HPV)', 'Errors in DNA replication']);
  K('C', 'C1 Locations', 'Explain', 4, 'Explain the effect of mutations in two different locations in a gene.', ['Start codon (1) protein not made (1)', 'Stop codon (1) protein longer than normal (1)', 'Promoter (1) changes binding of RNA polymerase/rate of expression (1)', 'Control gene (1) cell cycle affected / cancer (1)']);
  K('C', 'C2 Terms', 'State', 1, 'State the function of a gene.', ['Codes for a specific protein / polypeptide']);
  K('C', 'C2 Terms', 'Define', 2, 'Define genotype and phenotype.', ['Genotype: the alleles an individual has (1)', 'Phenotype: the observable characteristics (1)']);
  K('C', 'C2 Punnett', 'Calculate', 3, 'Two parents are carriers of cystic fibrosis. Use a Punnett square to give the probability that a child is a carrier.', ['Ff × Ff Punnett square drawn (1)', 'FF, Ff, Ff, ff (1)', 'probability of carrier = 1/2 / 50% (1)']);
  K('C', 'C2 CF', 'Explain', 2, 'Explain why people with cystic fibrosis need a high-energy diet.', ['Thick mucus blocks pancreatic ducts so fewer enzymes reach the gut (1) so food is poorly digested and absorbed (1)']);
  K('C', 'C2 Huntington’s', 'Explain', 2, 'Explain why a person with one parent with Huntington’s disease has a 50% chance of inheriting it.', ['It is caused by a dominant allele (1) so one copy from the heterozygous parent is enough – half of gametes carry it (1)']);
  K('C', 'C2 Haemophilia', 'Explain', 2, 'Explain why haemophilia is more common in males.', ['It is X-linked recessive (1) and males have only one X chromosome so one recessive allele causes the condition (1)']);
  K('C', 'C2 Down’s', 'Explain', 2, 'Explain how Down’s syndrome arises.', ['Non-disjunction during meiosis (1) produces a gamete with an extra chromosome 21 – trisomy 21 (1)']);
  K('C', 'C2 DNA samples', 'Explain', 2, 'Explain one limitation of using a buccal swab to obtain DNA.', ['Sample can be contaminated by food/bacteria (1) giving inaccurate results / small yield of DNA (1)']);
  K('C', 'C2 Ethics', 'Explain', 2, 'Explain one ethical concern with whole genome sequencing in newborns.', ['Babies cannot consent (1) and may later not want to know about conditions such as late-onset diseases (1)', 'Data storage and privacy (1) could lead to discrimination by insurers/employers (1)']);

  /* D — cancer */
  K('D', 'D1 Causes', 'Explain', 2, 'Explain the role of tumour suppressor genes.', ['They slow cell division / trigger apoptosis of damaged cells (1) so if mutated, cells divide uncontrollably (1)']);
  K('D', 'D1 Oncogenes', 'Explain', 2, 'Explain how an oncogene can cause cancer.', ['A mutated proto-oncogene is permanently switched on (1) continually stimulating cell division (1)']);
  K('D', 'D1 Tumours', 'Explain', 2, 'Explain one reason why tumour cells can grow where normal somatic cells cannot.', ['They ignore signals to stop dividing / do not undergo apoptosis (1) and can stimulate their own blood supply (angiogenesis) (1)']);
  K('D', 'D1 Tumours', 'Explain', 4, 'Explain two differences between benign and malignant tumours.', ['Benign encapsulated / malignant not (1) so malignant invades surrounding tissue (1)', 'Malignant metastasises (1) through blood/lymph forming secondary tumours (1)', 'Malignant grows faster (1) with abnormal undifferentiated cells (1)']);
  K('D', 'D2 Diagnosis', 'Explain', 2, 'Explain why a biopsy is used to diagnose cancer.', ['A tissue sample is examined under a microscope (histopathology) (1) to confirm whether cells are cancerous and the type/grade (1)']);
  K('D', 'D2 Imaging', 'Explain', 2, 'Explain one advantage of MRI over CT.', ['No ionising radiation (1) so safer for repeated scans / better soft-tissue detail (1)']);
  K('D', 'D2 Screening', 'State', 3, 'State three NHS cancer screening programmes.', ['Bowel', 'Breast', 'Cervical']);
  K('D', 'D2 Benefits', 'Explain', 3, 'Explain why early detection of a malignant tumour increases survival.', ['Tumour is smaller and has not metastasised (1)', 'so it can be removed by surgery or treated more effectively (1)', 'less aggressive treatment needed / better prognosis (1)']);
  K('D', 'D2 Limitations', 'Explain', 2, 'Explain the effect of a false negative screening result.', ['Cancer present but not detected (1) so the patient is falsely reassured and diagnosis/treatment is delayed (1)']);
  K('D', 'D2 Barriers', 'State', 2, 'State two barriers to cancer screening.', ['Fear of the result', 'Embarrassment', 'Language barriers', 'Disability/access', 'Cultural or religious beliefs', 'Lack of awareness', 'Time off work']);
  K('D', 'D3 Treatment', 'Explain', 2, 'Explain why chemotherapy causes hair loss.', ['Chemotherapy drugs kill rapidly dividing cells (1) including hair follicle cells (1)']);
  K('D', 'D3 Treatment', 'Explain', 2, 'Explain how hormone therapy treats some breast cancers.', ['Some breast cancers grow in response to oestrogen (1) so drugs such as tamoxifen block oestrogen receptors slowing growth (1)']);
  K('D', 'D3 Radiotherapy', 'Explain', 2, 'Explain how radiotherapy kills cancer cells.', ['Ionising radiation damages DNA (1) so the cells cannot divide and die (1)']);

  /* E — scientific information */
  K('E', 'E1 Evidence', 'Explain', 2, 'Explain the difference between quantitative and qualitative evidence.', ['Quantitative: numerical, measurable (1)', 'Qualitative: descriptive, opinions/experiences (1)']);
  K('E', 'E1 Methods', 'State', 1, 'State the meaning of a retrospective cohort study.', ['A study using existing records to look back at a group of people with and without an exposure to compare outcomes']);
  K('E', 'E1 Methods', 'Explain', 2, 'Explain one drawback of using questionnaires to collect data.', ['Respondents may give socially desirable/inaccurate answers (1) reducing validity of the data (1)', 'Low response rate (1) sample may not be representative (1)']);
  K('E', 'E1 Methods', 'Explain', 2, 'Explain why clinical trials are randomised and double-blind.', ['Random allocation avoids selection bias (1)', 'Neither patients nor researchers know who receives the drug, avoiding placebo effect and observer bias (1)']);
  K('E', 'E1 Statistics', 'Explain', 2, 'Explain what a small standard deviation shows.', ['Data are close to the mean (1) so results are consistent / reliable (1)']);
  K('E', 'E1 Statistics', 'Explain', 2, 'Explain what is meant by a statistically significant result.', ['The difference is unlikely to be due to chance (1) usually p < 0.05 (1)']);
  K('E', 'E2 Validity', 'Explain', 2, 'Explain why peer review increases confidence in research.', ['Other experts check the methods, data and conclusions before publication (1) so errors and unsupported claims are identified (1)']);
  K('E', 'E2 Validity', 'Explain', 2, 'Explain why the funding source of a study should be considered.', ['A funder such as a pharmaceutical company may have a financial interest (1) which could bias the design or reporting of results (1)']);
  K('E', 'E2 Errors', 'Explain', 2, 'Explain the difference between systematic and random error.', ['Systematic: consistent error in the same direction, e.g. uncalibrated equipment (1)', 'Random: unpredictable variation between readings (1)']);
  K('E', 'E2 Sources', 'Explain', 2, 'Explain why a social media post is less reliable than a journal article.', ['Not peer reviewed / author may lack expertise (1) so information may be biased, misquoted or inaccurate (1)']);
  K('E', 'E3 Analysis', 'Calculate', 2, 'Screening uptake fell from 75% to 69%. Calculate the percentage change.', ['(69 − 75) ÷ 75 × 100 (1)', '= −8% (8% decrease) (1)']);
  K('E', 'E3 Analysis', 'Explain', 3, 'Explain one risk of extrapolating a trend in mortality data.', ['Extrapolation assumes the trend continues beyond the data (1)', 'but factors may change, e.g. new treatments or screening uptake (1)', 'so the prediction may be inaccurate (1)']);
  KL('E', 'E2 Organisations', 'Discuss', 6, 'Discuss how the NHS influences public opinion on cancer screening.', ['Publicly funded, trusted provider', 'National programmes – breast (1988), bowel, cervical', 'Invitation letters, leaflets, GP encouragement', 'Campaigns and media', 'Statistics on outcomes', 'Possible anxiety about false positives']);
  KL('E', 'E2 Validity', 'Discuss', 9, 'An article concludes that “more should be done to minimise the fear of cancer screening”. Discuss the validity of this conclusion.', ['Source: author, date, peer review, publisher', 'Data: sample size, method (questionnaire vs trial), quantitative vs qualitative', 'Bias: funding, selection of respondents', 'Do data support the conclusion – correlation between fear and uptake?', 'Other barriers to screening (access, language, time)', 'Judgement on validity']);

  window.__BIZ_B = B;
})();
