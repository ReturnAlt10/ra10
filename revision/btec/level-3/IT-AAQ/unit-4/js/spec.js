// AAQ 2025 Spec data — Unit 4 Relational Database Development (Aims A, B, C)
// Content areas transcribed from the published unit specification (Issue 5, November 2025).
const SPEC = {
  A: {
    title: 'Understand how the principles of relational database models, data storage and normalisation are used to create effective relational database solutions',
    short: 'RDBMS types, data structure concepts, relational algebra, keys, integrity constraints, entity relationships, SQL, normalisation and scoping to a brief',
    tasks: 'Assignment Task 1 — research, normalisation and preliminary scoping document',
    topics: [
      { code: 'A1', name: 'Relational database management systems', guide: 'gt-A1' },
      { code: 'A2', name: 'Manipulating data structures and data', guide: 'gt-A2' },
      { code: 'A3', name: 'Normalisation', guide: 'gt-A3' },
      { code: 'A4', name: 'Planning a solution in response to a client brief', guide: 'gt-A4' }
    ]
  },
  B: {
    title: 'Design a relational database solution to meet client requirements',
    short: 'Entity relationship modelling, design documentation, user interface design, and reviewing/refining designs',
    tasks: 'Assignment Task 2 — design specification, data dictionary, ERDs and test plan',
    topics: [
      { code: 'B1', name: 'Relational database design techniques and processes', guide: 'gt-B1' },
      { code: 'B2', name: 'Design documentation', guide: 'gt-B2' },
      { code: 'B3', name: 'Reviewing and refining designs', guide: 'gt-B3' }
    ]
  },
  C: {
    title: 'Develop a relational database solution to meet client requirements',
    short: 'Producing a database with SQL, testing, reviewing and optimising the solution',
    tasks: 'Assignment Task 3 — build, test, review and optimise the database',
    topics: [
      { code: 'C1', name: 'Producing a database solution', guide: 'gt-C1' },
      { code: 'C2', name: 'Testing the database solution', guide: 'gt-C2' },
      { code: 'C3', name: 'Reviewing the database solution', guide: 'gt-C3' },
      { code: 'C4', name: 'Optimising the database solution', guide: 'gt-C4' }
    ]
  }
};

const COMMAND_VERBS = [];
const MARKS_OPTIONS = [];

function getSpecAims() { return Object.keys(SPEC); }

window.UNIT4_SPEC = SPEC;
