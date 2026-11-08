/* BTEC AAQ Unit 1: Principles of Human Physiology, Anatomy and Pathology — content areas from the Pearson specification. */
(function () {
  'use strict';
  window.LEARNING_AIMS = ["A", "B", "C", "D", "E"];
  window.SPEC = {
 "A": {
  "title": "Biological molecules, cells and levels of organisation",
  "short": "Carbohydrates; Proteins; Lipids; Nucleic acids and their derivatives; Cell ultrastructure; Transport of substances into and out of cells; The cell cycle; Levels",
  "topics": [
   {
    "code": "A1",
    "name": "Carbohydrates"
   },
   {
    "code": "A1.1",
    "name": "Monosaccharides"
   },
   {
    "code": "A1.2",
    "name": "Disaccharides"
   },
   {
    "code": "A1.3",
    "name": "Polysaccharides – polymers of alpha glucose"
   },
   {
    "code": "A2",
    "name": "Proteins"
   },
   {
    "code": "A2.1",
    "name": "Proteins (polypeptides) as polymers of amino acids. Students are not expected to know the names of all 20 amino acids involved in protein synthesis, nor are they expected to know the structural details of the side chains"
   },
   {
    "code": "A2.2",
    "name": "Structure of amino acids (backbone)"
   },
   {
    "code": "A2.3",
    "name": "Formation of peptide bonds"
   },
   {
    "code": "A2.4",
    "name": "Structure of proteins and polypeptides"
   },
   {
    "code": "A3",
    "name": "Lipids"
   },
   {
    "code": "A3.1",
    "name": "Saturated and unsaturated fatty acids"
   },
   {
    "code": "A3.2",
    "name": "Triglycerides"
   },
   {
    "code": "A3.3",
    "name": "Phospholipids"
   },
   {
    "code": "A3.4",
    "name": "Cholesterol"
   },
   {
    "code": "A4",
    "name": "Nucleic acids and their derivatives"
   },
   {
    "code": "A4.1",
    "name": "DNA"
   },
   {
    "code": "A4.2",
    "name": "RNA"
   },
   {
    "code": "A4.3",
    "name": "ATP (adenosine tri phosphate)"
   },
   {
    "code": "A4.4",
    "name": "Role of coenzymes in respiration"
   },
   {
    "code": "A4.5",
    "name": "Conditions associated with metabolism of biological molecules"
   },
   {
    "code": "A5",
    "name": "Cell ultrastructure"
   },
   {
    "code": "A5.1",
    "name": "Recognise cell structures from photomicrographs or electron micrographs"
   },
   {
    "code": "A5.2",
    "name": "Calculate magnification and true size of organelles/cells from photo- and electron micrographs"
   },
   {
    "code": "A5.3",
    "name": "Comparison of use of electron and light microscopes (limited to consideration of magnification, resolution, ease of use and ability to observe living specimens)"
   },
   {
    "code": "A5.4",
    "name": "The functions of organelles"
   },
   {
    "code": "A5.5",
    "name": "Surface area to volume (SA/V) ratio"
   },
   {
    "code": "A6",
    "name": "Transport of substances into and out of cells"
   },
   {
    "code": "A6.1",
    "name": "Active transport (use of membrane proteins and ATP)"
   },
   {
    "code": "A6.2",
    "name": "Passive transport"
   },
   {
    "code": "A6.3",
    "name": "Bulk transport"
   },
   {
    "code": "A7",
    "name": "The cell cycle"
   },
   {
    "code": "A7.1",
    "name": "The phases of the cell cycle"
   },
   {
    "code": "A7.2",
    "name": "Stem cells and differentiated cells"
   },
   {
    "code": "A7.3",
    "name": "When the cell cycle is disrupted"
   },
   {
    "code": "A7.4",
    "name": "Cellular processes"
   },
   {
    "code": "A7.5",
    "name": "Cell death"
   },
   {
    "code": "A8",
    "name": "Levels of organisation"
   },
   {
    "code": "A8.1",
    "name": "Tissue definition (as a group of cells that work together to perform a specific function or functions)"
   },
   {
    "code": "A8.2",
    "name": "Location and functions of tissues"
   },
   {
    "code": "A8.3",
    "name": "Organ definition (a group of tissues performing similar functions)"
   },
   {
    "code": "A8.4",
    "name": "Awareness of the range of organ systems in the body"
   },
   {
    "code": "A8.5",
    "name": "Definitions of branches of tissue studies"
   }
  ]
 },
 "B": {
  "title": "The Nervous and endocrine systems",
  "short": "The nervous system; The endocrine system; Homeostasis",
  "topics": [
   {
    "code": "B1",
    "name": "The nervous system"
   },
   {
    "code": "B1.1",
    "name": "The nervous system"
   },
   {
    "code": "B1.2",
    "name": "Outline of disorders of the nervous system (brief overview)"
   },
   {
    "code": "B1.3",
    "name": "Hypothalamus"
   },
   {
    "code": "B1.4",
    "name": "Calculate magnification and true size of structures from photo- and electron micrographs"
   },
   {
    "code": "B2",
    "name": "The endocrine system"
   },
   {
    "code": "B2.1",
    "name": "The endocrine system"
   },
   {
    "code": "B2.2",
    "name": "Outline of disorders of the endocrine system"
   },
   {
    "code": "B2.3",
    "name": "Diabetes type 1 and type 2"
   },
   {
    "code": "B3",
    "name": "Homeostasis"
   },
   {
    "code": "B3.1",
    "name": "Why homeostasis is necessary with reference to regulation of the body’s temperature, salt and water balance, blood pH and blood pressure"
   },
   {
    "code": "B3.2",
    "name": "How negative feedback loops are involved in homeostatic mechanisms"
   },
   {
    "code": "B3.3",
    "name": "Thermoregulation – the role of hypothalamus and skin in sweating, vasodilation, vasoconstriction; the role of muscles in shivering"
   },
   {
    "code": "B3.4",
    "name": "Osmoregulation (the role of the kidneys and ADH in osmoregulation)"
   },
   {
    "code": "B3.5",
    "name": "Control of blood glucose levels (the roles of insulin and glucagon)"
   },
   {
    "code": "B3.6",
    "name": "Control of blood pressure (the roles of the renin-angiotensin system, aldosterone, and baroreceptors)"
   }
  ]
 },
 "C": {
  "title": "The musculoskeletal system",
  "short": "The skeleton; Joints, tissues and muscles; Disorders of the musculoskeletal system",
  "topics": [
   {
    "code": "C1",
    "name": "The skeleton"
   },
   {
    "code": "C1.1",
    "name": "Names and locations of bones and structures"
   },
   {
    "code": "C2",
    "name": "Joints, tissues and muscles"
   },
   {
    "code": "C2.1",
    "name": "Types of joints"
   },
   {
    "code": "C2.2",
    "name": "Synovial joint"
   },
   {
    "code": "C2.3",
    "name": "Physical appearance of muscular tissue as seen in photo- or electron micrographs or diagrams"
   },
   {
    "code": "C2.4",
    "name": "Structure and functions of muscle"
   },
   {
    "code": "C2.5",
    "name": "Principles of sliding filament theory of contraction of skeletal muscle, with the roles of actin, myosin, troponin, tropomyosin, and ATP"
   },
   {
    "code": "C2.6",
    "name": "The different properties of slow and fast twitch muscle fibres"
   },
   {
    "code": "C2.7",
    "name": "Calculations involving proportions of slow and fast twitch fibres and in change of length of sarcomeres and muscles or of changes in muscle mass"
   },
   {
    "code": "C2.8",
    "name": "Neuromuscular junctions and roles of neurotransmitters"
   },
   {
    "code": "C2.9",
    "name": "Antagonistic muscles"
   },
   {
    "code": "C3",
    "name": "Disorders of the musculoskeletal system"
   },
   {
    "code": "C3.1",
    "name": "Osteoarthritis"
   },
   {
    "code": "C3.2",
    "name": "Osteoporosis/rickets"
   },
   {
    "code": "C3.3",
    "name": "Duchenne muscular dystrophy"
   },
   {
    "code": "C3.4",
    "name": "Myasthenia gravis"
   }
  ]
 },
 "D": {
  "title": "The cardiovascular and respiratory systems",
  "short": "The cardiovascular system; The respiratory system",
  "topics": [
   {
    "code": "D1",
    "name": "The cardiovascular system"
   },
   {
    "code": "D1.1",
    "name": "Double circulation"
   },
   {
    "code": "D1.2",
    "name": "The heart"
   },
   {
    "code": "D1.3",
    "name": "The cardiac cycle"
   },
   {
    "code": "D1.4",
    "name": "Structure and functions of blood vessels"
   },
   {
    "code": "D1.5",
    "name": "Blood"
   },
   {
    "code": "D1.6",
    "name": "Outline of disorders associated with the cardiovascular system"
   },
   {
    "code": "D2",
    "name": "The respiratory system"
   },
   {
    "code": "D2.1",
    "name": "Overview of anatomy of respiratory system"
   },
   {
    "code": "D2.2",
    "name": "The structural adaptations of alveoli that allow gas exchange"
   },
   {
    "code": "D2.3",
    "name": "How the features of the airways protect the lungs from pathogens and pollutants"
   },
   {
    "code": "D2.4",
    "name": "The role in ventilation of"
   },
   {
    "code": "D2.5",
    "name": "Interpreting spirometer traces and identifying and defining lung volumes"
   },
   {
    "code": "D2.6",
    "name": "Calculations from spirometer traces or other data"
   },
   {
    "code": "D2.7",
    "name": "Dead space (in the airways where no gas exchange occurs)"
   },
   {
    "code": "D2.8",
    "name": "Outline of factors contributing to, the effect of, disorders associated with the respiratory system"
   }
  ]
 },
 "E": {
  "title": "The renal and digestive systems",
  "short": "The renal system; The digestive system",
  "topics": [
   {
    "code": "E1",
    "name": "The renal system"
   },
   {
    "code": "E1.1",
    "name": "The functions of the kidneys"
   },
   {
    "code": "E1.2",
    "name": "The relationship between the structure, function and processes of the renal system (which, along with the lungs, makes up the excretory system)"
   },
   {
    "code": "E1.3",
    "name": "Overview of anatomy of the renal system"
   },
   {
    "code": "E1.4",
    "name": "Components of the nephron"
   },
   {
    "code": "E1.5",
    "name": "ADH as a homeostatic mechanism in osmoregulation"
   },
   {
    "code": "E1.6",
    "name": "Outline of disorders of the renal system (overview of causes, symptoms and treatment)"
   },
   {
    "code": "E2",
    "name": "The digestive system"
   },
   {
    "code": "E2.1",
    "name": "Appearance and location (as seen on diagrams) of components of the digestive tract"
   },
   {
    "code": "E2.2",
    "name": "Appearance and location (as seen on diagrams) of components of accessory organs"
   },
   {
    "code": "E2.3",
    "name": "Digestion, absorption and assimilation of macronutrients"
   },
   {
    "code": "E2.4",
    "name": "Stomach (site of more mechanical digestion and chemical digestion and action of pepsin"
   },
   {
    "code": "E2.5",
    "name": "Duodenum (action of bile, action of pancreatic enzymes – lipase, amylase and trypsin)"
   },
   {
    "code": "E2.6",
    "name": "Ileum"
   },
   {
    "code": "E2.7",
    "name": "Assimilation of the products of digestion"
   },
   {
    "code": "E2.8",
    "name": "The large intestine"
   },
   {
    "code": "E2.9",
    "name": "Outline of disorders of the digestive system"
   },
   {
    "code": "E2.10",
    "name": "Calculations relating to the digestive system"
   }
  ]
 }
};
})();
