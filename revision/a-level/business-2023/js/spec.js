// AQA A-level Business (7132) - specification v2.0 (first A-level exams June 2025).
// Keys "1".."10" map to spec sections 3.1..3.10. All three papers assess ALL content.
const SPEC = {
  "1": {
    title: "3.1 What is business?",
    short: "Purpose of business, business forms, external environment",
    papers: ["Paper 1", "Paper 2", "Paper 3"],
    topics: [
      { code: "3.1.1", name: "Understanding the nature and purpose of business" },
      { code: "3.1.2", name: "Understanding different business forms" },
      { code: "3.1.3", name: "Understanding that businesses operate within an external environment" }
    ]
  },
  "2": {
    title: "3.2 Managers, leadership and decision making",
    short: "Leadership styles, decision trees, stakeholders",
    papers: ["Paper 1", "Paper 2", "Paper 3"],
    topics: [
      { code: "3.2.1", name: "Understanding management, leadership and decision making" },
      { code: "3.2.2", name: "Understanding management decision making" },
      { code: "3.2.3", name: "Understanding the role and importance of stakeholders" }
    ]
  },
  "3": {
    title: "3.3 Marketing management",
    short: "Marketing objectives, research, elasticity, STP, the 7Ps",
    papers: ["Paper 1", "Paper 2", "Paper 3"],
    topics: [
      { code: "3.3.1", name: "Setting marketing objectives" },
      { code: "3.3.2", name: "Understanding markets and customers" },
      { code: "3.3.3", name: "Segmentation, targeting, positioning" },
      { code: "3.3.4", name: "Using the marketing mix" }
    ]
  },
  "4": {
    title: "3.4 Operational management",
    short: "Operational objectives, productivity, capacity, lean, quality, inventory",
    papers: ["Paper 1", "Paper 2", "Paper 3"],
    topics: [
      { code: "3.4.1", name: "Setting operational objectives" },
      { code: "3.4.2", name: "Analysing operational performance" },
      { code: "3.4.3", name: "Increasing efficiency and productivity" },
      { code: "3.4.4", name: "Improving quality" },
      { code: "3.4.5", name: "Managing inventory and supply chains" }
    ]
  },
  "5": {
    title: "3.5 Financial management",
    short: "Financial objectives, budgets, break-even, cash flow, sources of finance",
    papers: ["Paper 1", "Paper 2", "Paper 3"],
    topics: [
      { code: "3.5.1", name: "Setting financial objectives" },
      { code: "3.5.2", name: "Analysing financial performance" },
      { code: "3.5.3", name: "Sources of finance" },
      { code: "3.5.4", name: "Improving cash flow and profits" }
    ]
  },
  "6": {
    title: "3.6 Human resource management",
    short: "HR objectives, HR data, structure, motivation, employee relations",
    papers: ["Paper 1", "Paper 2", "Paper 3"],
    topics: [
      { code: "3.6.1", name: "Setting human resource objectives" },
      { code: "3.6.2", name: "Analysing human resource performance" },
      { code: "3.6.3", name: "Organisational design and the human resource flow" },
      { code: "3.6.4", name: "Improving motivation and engagement" },
      { code: "3.6.5", name: "Improving employer-employee relations" }
    ]
  },
  "7": {
    title: "3.7 Analysing the strategic position",
    short: "Mission, SWOT, ratios, PESTLE, CSR, five forces, investment appraisal",
    papers: ["Paper 1", "Paper 2", "Paper 3"],
    topics: [
      { code: "3.7.1", name: "Mission, objectives and strategy" },
      { code: "3.7.2", name: "Financial ratio analysis" },
      { code: "3.7.3", name: "Overall performance" },
      { code: "3.7.4", name: "Political and legal change" },
      { code: "3.7.5", name: "Economic change" },
      { code: "3.7.6", name: "Social and technological change" },
      { code: "3.7.7", name: "The competitive environment" },
      { code: "3.7.8", name: "Investment appraisal" }
    ]
  },
  "8": {
    title: "3.8 Choosing strategic direction",
    short: "Ansoff's matrix, Porter's generic strategies, competitive advantage",
    papers: ["Paper 1", "Paper 2", "Paper 3"],
    topics: [
      { code: "3.8.1", name: "Which markets and products (Ansoff)" },
      { code: "3.8.2", name: "Strategic positioning (Porter)" }
    ]
  },
  "9": {
    title: "3.9 Strategic methods",
    short: "Growth and retrenchment, innovation, globalisation, digital technology",
    papers: ["Paper 1", "Paper 2", "Paper 3"],
    topics: [
      { code: "3.9.1", name: "Assessing a change in scale" },
      { code: "3.9.2", name: "Assessing innovation" },
      { code: "3.9.3", name: "Assessing globalisation and internationalisation" },
      { code: "3.9.4", name: "Assessing greater use of digital technology" }
    ]
  },
  "10": {
    title: "3.10 Managing strategic change",
    short: "Change, culture, implementation, network analysis, strategic drift",
    papers: ["Paper 1", "Paper 2", "Paper 3"],
    topics: [
      { code: "3.10.1", name: "Managing change" },
      { code: "3.10.2", name: "Managing organisational culture" },
      { code: "3.10.3", name: "Managing strategic implementation" },
      { code: "3.10.4", name: "Problems with strategy and why strategies fail" }
    ]
  }
};

// Exam structure from the AQA 7132 specification and the 2020-2024 live papers.
const PAPER_FORMATS = {
  "Paper 1": {
    name: "Business 1",
    time: "2 hours", marks: 100,
    summary: "Section A: 15 multiple-choice (15 marks). Section B: short-answer questions (35 marks) - typically two 4-mark calculations and three 9-mark 'Analyse' questions. Sections C and D: choose ONE 25-mark essay from two in each section.",
    sections: [
      { name: "Section A", marks: 15, note: "15 MCQs, 1 mark each (AO1)" },
      { name: "Section B", marks: 35, note: "4 + 4 (calculations, AO1 1 / AO2 3) + 9 + 9 + 9 (analyse, AO1 3 / AO2 3 / AO3 3)" },
      { name: "Section C", marks: 25, note: "Choose one of two essays (AO1 5 / AO2 4 / AO3 6 / AO4 10)" },
      { name: "Section D", marks: 25, note: "Choose one of two essays (AO1 5 / AO2 4 / AO3 6 / AO4 10)" }
    ]
  },
  "Paper 2": {
    name: "Business 2",
    time: "2 hours", marks: 100,
    summary: "Three compulsory data-response questions of about 33 marks each, each with its own context and appendices. Parts build from calculations and short explanations (2-6 marks) through 9-mark 'Analyse' to a 16-mark evaluation.",
    sections: [
      { name: "Question 1", marks: 33, note: "Context + appendices; calc/explain, 9-mark analyse, 16-mark evaluate" },
      { name: "Question 2", marks: 33, note: "As above" },
      { name: "Question 3", marks: 34, note: "As above" }
    ]
  },
  "Paper 3": {
    name: "Business 3",
    time: "2 hours", marks: 100,
    summary: "One compulsory case study (Insert) with six questions: 12, 12, 16, 16, 20 and 24 marks. Q6 is a synoptic question about 'all businesses'.",
    sections: [
      { name: "Q1-Q2", marks: 24, note: "12-mark 'Analyse' (AO1 3 / AO2 3 / AO3 6) - no judgement needed" },
      { name: "Q3-Q4", marks: 32, note: "16-mark evaluation, often requiring calculations (AO1 2 / AO2 3 / AO3 4 / AO4 7)" },
      { name: "Q5", marks: 20, note: "20-mark evaluation, often 'Option 1 or Option 2?' (AO1 4 / AO2 3 / AO3 5 / AO4 8)" },
      { name: "Q6", marks: 24, note: "24-mark synoptic essay on 'all businesses' (AO1 5 / AO2 4 / AO3 6 / AO4 9)" }
    ]
  }
};

const COMMAND_VERBS = ["Select", "Calculate", "Explain", "Analyse", "Evaluate", "To what extent", "Recommend", "Justify"];
const MARKS_OPTIONS = [1, 3, 4, 6, 9, 12, 16, 20, 24, 25];
