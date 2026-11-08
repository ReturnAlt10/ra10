/* BTEC Computing (AAQ) Unit 4 — per-criterion assignment help (RA10’s guidance; your work must be your own). */
(function () {
  'use strict';
  const CH = (means, evidence, next) => `<p><b>What it means:</b> ${means}</p><p><b>Evidence to include:</b></p><ul>${evidence.map(e => `<li>${e}</li>`).join('')}</ul>${next ? `<p><b>Reaching the next grade:</b> ${next}</p>` : ''}`;
  window.AAQ_CRIT_HELP = {
    _intro: '<h3>Before you start</h3><p>Turn the brief into a numbered <b>feature list</b>, then write a <b>given / when / then</b> user story for each. Set up your repository (or named archive folder) on day one and commit or archive at every milestone. Plan where each required element fits: validation, delimited files, 1D and 2D arrays, a search and a sort.</p>',
    _tips: '<ul><li>Choose algorithms that suit the data – binary search needs sorted data.</li><li>Every subprogram should have a clear interface: parameters in, return value out.</li><li>Screenshot test runs and lint output as evidence.</li><li>Your milestone reflections should explain problems and how you fixed them.</li></ul>',
    'group:A': 'Learning aim A: the program itself – inputs and outputs, data structures, algorithms, good practice and a systematic approach.',
    'group:B': 'Learning aim B: how you managed development – features, stories, tests, milestones and repository.',
    'A.P1': CH('Develop software that meets some requirements, using some appropriate I/O, data structures and searching/sorting.', ['Working program with validation, file read/write, arrays, at least one search and one sort.'], 'For M1, meet most requirements with mostly appropriate choices.'),
    'A.P2': CH('Employ some good programming practices.', ['Comments, indentation, meaningful names, subprograms, some exception handling.'], 'For M1, use a range of good practices consistently.'),
    'A.P3': CH('Apply a systematic approach.', ['Features list, user stories (given/when/then), some unit tests, linting.'], 'For M1, make the approach effective throughout.'),
    'A.M1': CH('Range of good practices and effective systematic approach; most requirements met.', ['Well-structured subprograms with parameters; exception handling; unit tests for key functions; 1D and 2D arrays; appropriate algorithms.'], 'For D1, be consistent, efficient and fully meet requirements.'),
    'A.D1': CH('Consistently effective practice; efficient approach; fully meets requirements.', ['Well-chosen I/O, a range of data structures, a range of efficient algorithms (e.g. binary search, quick sort) justified; clean linted code; comprehensive tests.'], null),
    'B.P4': CH('Use management strategies, document milestones and keep a code repository.', ['Feature list and stories, milestone notes, archived code.'], 'For M2, make strategies effective and document milestones fully.'),
    'B.M2': CH('Effective management, fully documented milestones, repository showing milestones.', ['Stories done one at a time with tests; each milestone has demo, test evidence and reflection; clearly named archives.'], 'For D2, make every element fully appropriate and effective.'),
    'B.D2': CH('Fully appropriate and effective management and documentation.', ['Consistent test-driven workflow, insightful reflections, a repository that clearly shows the program growing feature by feature.'], null)
  };
})();
