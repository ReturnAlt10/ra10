// AAQ 2025 Spec data — Unit 3 Website Development (Aims A, B, C)
// Content areas transcribed from the published unit specification (Issue 2, March 2025).
const SPEC = {
  A: {
    title: 'Understand how the principles of website development are used to create effective websites',
    short: 'Purpose and principles of websites; planning a website in response to a client brief',
    tasks: 'Assignment Task 1 — research, ideas and site map',
    topics: [
      { code: 'A1', name: 'Purpose and principles of websites', guide: 'gt-A1' },
      { code: 'A2', name: 'Planning a website in response to a client brief', guide: 'gt-A2' }
    ]
  },
  B: {
    title: 'Explore website design skills and techniques to meet client requirements',
    short: 'Website design; asset management techniques',
    tasks: 'Assignment Task 2 — wireframes, visual designs and assets',
    topics: [
      { code: 'B1', name: 'Website design', guide: 'gt-B1' },
      { code: 'B2', name: 'Asset management techniques', guide: 'gt-B2' }
    ]
  },
  C: {
    title: 'Develop a website to meet client requirements',
    short: 'Common tools and techniques; website development processes; testing',
    tasks: 'Assignment Task 3 — build, test and review the website',
    topics: [
      { code: 'C1', name: 'Common tools and techniques to produce a website', guide: 'gt-C1' },
      { code: 'C2', name: 'Website development processes', guide: 'gt-C2' },
      { code: 'C3', name: 'Testing', guide: 'gt-C3' }
    ]
  }
};

const COMMAND_VERBS = [];
const MARKS_OPTIONS = [];

function getSpecAims() { return Object.keys(SPEC); }

window.UNIT3_SPEC = SPEC;