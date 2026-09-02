// BTEC Level 3 IT — Unit 3: Website Development — Spec breakdown
// Internally-assessed unit (60 GLH). Not exam-based — Learning Aims A & B are
// taught through theory (guide + MCQs + interactive tools), Learning Aim C is
// applied through the code editor + assignment (Part 2).
window.SPEC = {
  A: {
    title: 'Examine the impact of website development, and design a website to meet client requirements',
    short: 'Impact & Design',
    topics: [
      { code: 'A1.1', name: 'Impact of websites on individuals, business and society' },
      { code: 'A1.2', name: 'Legal, ethical and security considerations' },
      { code: 'A1.3', name: 'Accessibility and inclusive design' },
      { code: 'A2.1', name: 'Interpreting a client brief and requirements' },
      { code: 'A2.2', name: 'Website structure: sitemaps and navigation' },
      { code: 'A2.3', name: 'Wireframes and layout design' },
      { code: 'A2.4', name: 'House style, branding and design principles' },
    ],
  },
  B: {
    title: 'Explore the tools and technologies used to design, build, test and optimise websites',
    short: 'Tools & Technologies',
    topics: [
      { code: 'B1.1', name: 'HTML — structure and semantic markup' },
      { code: 'B1.2', name: 'CSS — styling, layout and responsive design' },
      { code: 'B1.3', name: 'JavaScript — interactivity and client-side scripting' },
      { code: 'B1.4', name: 'Development tools: code editors vs WYSIWYG (VS Code & Dreamweaver)' },
      { code: 'B2.1', name: 'File types, formats and optimisation (images, video, fonts)' },
      { code: 'B2.2', name: 'Content Management Systems (CMS)' },
      { code: 'B3.1', name: 'Testing types: functional, usability, accessibility, cross-browser, performance' },
      { code: 'B3.2', name: 'Website optimisation: compression, minification, caching' },
      { code: 'B3.3', name: 'Publishing and hosting a website' },
    ],
  },
  C: {
    title: 'Build, test and review a website to meet a client brief',
    short: 'Build & Review',
    topics: [
      { code: 'C1.1', name: 'Building pages using HTML5 semantic structure' },
      { code: 'C1.2', name: 'Styling with CSS (layout, typography, responsiveness)' },
      { code: 'C1.3', name: 'Adding interactivity with JavaScript' },
      { code: 'C1.4', name: 'Organising files and assets in a project' },
      { code: 'C2.1', name: 'Functional and usability testing' },
      { code: 'C2.2', name: 'Reviewing the website against the client brief' },
      { code: 'C2.3', name: 'Reflecting on own performance and identifying improvements' },
    ],
  },
};

// Assignment task structure (Part 2) — models the standard Pearson-style
// three-task internal assignment breakdown for this unit.
window.ASSIGNMENT_TASKS = [
  {
    code: 'task1',
    title: 'Task 1 — Design Proposal',
    aim: 'A',
    summary: 'Analyse a client brief and produce a design proposal: sitemap, wireframes, house style and a justified technical specification.',
    criteria: {
      pass: [
        { code: 'A.P1', text: 'Explain the impact of website development on individuals, businesses and society, referencing the client scenario.' },
        { code: 'A.P2', text: 'Produce a design proposal for a website that meets the client requirements, including a sitemap and wireframes for key pages.' },
      ],
      merit: [
        { code: 'A.M1', text: 'Analyse how legal, ethical and accessibility considerations have shaped the design proposal.' },
      ],
      distinction: [
        { code: 'A.D1', text: 'Justify design decisions in the proposal, evaluating how well they meet client requirements and different user needs.' },
      ],
    },
  },
  {
    code: 'task2',
    title: 'Task 2 — Build the Website',
    aim: 'B/C',
    summary: 'Use appropriate tools and technologies (HTML, CSS, JavaScript) to build a working, multi-page website that implements the design proposal.',
    criteria: {
      pass: [
        { code: 'B.P3', text: 'Use suitable tools and technologies to build a website that includes appropriate structure, styling and at least one interactive feature.' },
        { code: 'B.P4', text: 'Use a range of file types and formats appropriately (e.g. images, fonts) with basic optimisation.' },
      ],
      merit: [
        { code: 'B.M2', text: 'Use tools and technologies effectively and consistently to build a website that closely matches the design proposal.' },
      ],
      distinction: [
        { code: 'B.D2', text: 'Build a website that fully and effectively meets the client requirements, demonstrating skilled and efficient use of tools and technologies.' },
      ],
    },
  },
  {
    code: 'task3',
    title: 'Task 3 — Test, Review & Reflect',
    aim: 'C',
    summary: 'Test the finished website, document the results, review it against the original client brief, and reflect on your own performance.',
    criteria: {
      pass: [
        { code: 'C.P5', text: 'Test the website for functionality and usability, recording the results and any issues found.' },
        { code: 'C.P6', text: 'Review the website against the client requirements and reflect on your own performance, identifying strengths and areas for improvement.' },
      ],
      merit: [
        { code: 'C.M3', text: 'Analyse the test results and explain how issues were resolved, with reference to the client requirements.' },
      ],
      distinction: [
        { code: 'C.D3', text: 'Evaluate the effectiveness of the finished website against the client brief, and critically reflect on own performance with clear, justified suggestions for improvement.' },
      ],
    },
  },
];
