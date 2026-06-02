// A-Level AQA Business (7132) topic map (Topics 1-10)
const SPEC = {
  "1": {
    title: "Topic 1: What is business?",
    short: "Nature and purpose of business, forms, markets, finance and enterprise",
    papers: ["Paper 1", "Paper 3"],
    topics: [
      { code: "1.1", name: "Understanding the nature and purpose of business" },
      { code: "1.2", name: "Understanding different business forms" },
      { code: "1.3", name: "Understanding that businesses operate within an external environment" },
      { code: "1.4", name: "Understanding markets, competition and customers" },
      { code: "1.5", name: "Understanding finance and financial decisions" },
      { code: "1.6", name: "Understanding operations, marketing and human resource decisions" },
      { code: "1.7", name: "Understanding the role of entrepreneurs" }
    ]
  },
  "2": {
    title: "Topic 2: Managers, leadership and decision making",
    short: "Management, leadership, decision making and stakeholder influence",
    papers: ["Paper 1", "Paper 3"],
    topics: [
      { code: "2.1", name: "Understanding management, leadership and decision making" },
      { code: "2.2", name: "Understanding management decision making" },
      { code: "2.3", name: "Understanding the role and importance of stakeholders" },
      { code: "2.4", name: "Understanding and leading change" }
    ]
  },
  "3": {
    title: "Topic 3: Decision making to improve marketing performance",
    short: "Marketing objectives, markets, marketing mix and performance",
    papers: ["Paper 1", "Paper 3"],
    topics: [
      { code: "3.1", name: "Setting marketing objectives" },
      { code: "3.2", name: "Understanding markets and customers" },
      { code: "3.3", name: "Making marketing decisions: segmentation, targeting and positioning" },
      { code: "3.4", name: "Using the marketing mix to inform and implement decisions" },
      { code: "3.5", name: "Managing marketing performance" }
    ]
  },
  "4": {
    title: "Topic 4: Decision making to improve operational performance",
    short: "Operational objectives, analysis, influences and performance improvement",
    papers: ["Paper 1", "Paper 3"],
    topics: [
      { code: "4.1", name: "Setting operational objectives" },
      { code: "4.2", name: "Analysing operational performance" },
      { code: "4.3", name: "Influences on operational decisions" },
      { code: "4.4", name: "Improving operational performance" }
    ]
  },
  "5": {
    title: "Topic 5: Decision making to improve financial performance",
    short: "Financial objectives, analysis, influences and performance improvement",
    papers: ["Paper 1", "Paper 3"],
    topics: [
      { code: "5.1", name: "Setting financial objectives" },
      { code: "5.2", name: "Analysing financial performance" },
      { code: "5.3", name: "Influences on financial decisions" },
      { code: "5.4", name: "Improving financial performance" }
    ]
  },
  "6": {
    title: "Topic 6: Decision making to improve human resource performance",
    short: "Human resource objectives, analysis, influences and improvement",
    papers: ["Paper 1", "Paper 3"],
    topics: [
      { code: "6.1", name: "Setting human resource objectives" },
      { code: "6.2", name: "Analysing human resource performance" },
      { code: "6.3", name: "Influences on human resource decisions" },
      { code: "6.4", name: "Improving human resource performance" }
    ]
  },
  "7": {
    title: "Topic 7: Analysing the strategic position of a business",
    short: "Mission, objectives, strategic analysis and overall position",
    papers: ["Paper 2", "Paper 3"],
    topics: [
      { code: "7.1", name: "Mission, corporate objectives and strategy" },
      { code: "7.2", name: "Analysing the existing internal position of a business" },
      { code: "7.3", name: "Analysing the strategic position of a business through data" },
      { code: "7.4", name: "Analysing strategic position and overall performance" }
    ]
  },
  "8": {
    title: "Topic 8: Choosing strategic direction",
    short: "Strategic direction, positioning, methods and risk",
    papers: ["Paper 2", "Paper 3"],
    topics: [
      { code: "8.1", name: "Choosing strategic direction: markets and products" },
      { code: "8.2", name: "Choosing strategic direction: strategic positioning" },
      { code: "8.3", name: "Choosing strategic direction: choosing how to compete" },
      { code: "8.4", name: "Choosing strategic direction: strategic methods" }
    ]
  },
  "9": {
    title: "Topic 9: Strategic methods: how to pursue strategies",
    short: "Scale, innovation, internationalisation and digital strategy",
    papers: ["Paper 2", "Paper 3"],
    topics: [
      { code: "9.1", name: "Assessing a change in scale" },
      { code: "9.2", name: "Assessing innovation" },
      { code: "9.3", name: "Assessing internationalisation" },
      { code: "9.4", name: "Assessing greater use of digital technology" }
    ]
  },
  "10": {
    title: "Topic 10: Managing strategic change",
    short: "Organisational change, implementation and strategic control",
    papers: ["Paper 2", "Paper 3"],
    topics: [
      { code: "10.1", name: "Managing organisational change" },
      { code: "10.2", name: "Managing strategic implementation" },
      { code: "10.3", name: "Managing strategic change" }
    ]
  }
};

const COMMAND_VERBS = ["State", "Identify", "Outline", "Explain", "Analyse", "Assess", "Evaluate"];
const MARKS_OPTIONS = [1, 2, 3, 4, 6, 8, 9, 10, 12, 13, 15, 16, 20, 25];
