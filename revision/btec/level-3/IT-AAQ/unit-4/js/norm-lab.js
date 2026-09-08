/* BTEC IT Unit 4 — Normalisation Lab
   Interactive examples that split a flat (UNF) table into 1NF, 2NF and 3NF.
   Each step is shown, explained, and the learner can click through the stages. */
(function () {
  'use strict';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  /* Each example: a flat UNF table + the staged breakdown. */
  const EXAMPLES = [
    {
      id: 'orders',
      title: 'Customer orders',
      blurb: 'A shop records each order in one flat table. Notice the repeating product info and the dependencies hiding in it.',
      unf: {
        table: 'Order',
        cols: ['OrderID', 'CustomerName', 'CustomerPhone', 'ProductName', 'ProductPrice', 'Qty'],
        rows: [
          ['101', 'Priya Sharma', '07700 900001', 'Notebook', '3.50', '2'],
          ['101', 'Priya Sharma', '07700 900001', 'Pen', '1.20', '5'],
          ['102', 'Leo Hughes', '07700 900002', 'Notebook', '3.50', '1']
        ],
        note: 'CustomerName/Phone repeat for every order line; ProductPrice depends on ProductName, not the whole key.'
      },
      steps: [
        {
          form: '1NF',
          rule: 'Remove repeating groups — each cell is atomic. The key is now OrderID + ProductName (composite).',
          tables: [
            { name: 'OrderLine', key: 'OrderID + ProductName', cols: ['OrderID', 'CustomerName', 'CustomerPhone', 'ProductName', 'ProductPrice', 'Qty'] }
          ]
        },
        {
          form: '2NF',
          rule: 'Remove partial dependencies — CustomerName/Phone depend only on OrderID; ProductPrice depends only on ProductName.',
          tables: [
            { name: 'Order', key: 'OrderID', cols: ['OrderID', 'CustomerName', 'CustomerPhone'] },
            { name: 'Product', key: 'ProductName', cols: ['ProductName', 'ProductPrice'] },
            { name: 'OrderLine', key: 'OrderID + ProductName', cols: ['OrderID', 'ProductName', 'Qty'] }
          ]
        },
        {
          form: '3NF',
          rule: 'Remove transitive dependencies — CustomerName and Phone both depend only on OrderID (fine), so we extract Customer for cleanliness and to avoid future anomalies.',
          tables: [
            { name: 'Customer', key: 'CustomerID', cols: ['CustomerID', 'CustomerName', 'CustomerPhone'] },
            { name: 'Product', key: 'ProductID', cols: ['ProductID', 'ProductName', 'ProductPrice'] },
            { name: 'Order', key: 'OrderID', cols: ['OrderID', 'CustomerID'] },
            { name: 'OrderLine', key: 'OrderID + ProductID', cols: ['OrderID', 'ProductID', 'Qty'] }
          ]
        }
      ]
    },
    {
      id: 'library',
      title: 'Library loans',
      blurb: 'A library logs loans. The flat table repeats borrower details and mixes data that belongs in separate entities.',
      unf: {
        table: 'Loan',
        cols: ['LoanID', 'StudentName', 'TutorName', 'BookTitle', 'Author', 'DueDate'],
        rows: [
          ['L1', 'Sam Brown', 'Ms Taylor', '1984', 'G. Orwell', '2025-07-01'],
          ['L2', 'Sam Brown', 'Ms Taylor', 'The Great Gatsby', 'F. S. Fitzgerald', '2025-07-08'],
          ['L3', 'Jade Lee', 'Mr Adams', '1984', 'G. Orwell', '2025-07-05']
        ],
        note: 'TutorName depends on StudentName (transitive); Author depends on BookTitle (transitive).'
      },
      steps: [
        {
          form: '1NF',
          rule: 'Data is already atomic — no repeating groups. Move straight to 2NF.',
          tables: [
            { name: 'Loan', key: 'LoanID', cols: ['LoanID', 'StudentName', 'TutorName', 'BookTitle', 'Author', 'DueDate'] }
          ]
        },
        {
          form: '2NF',
          rule: 'LoanID is a single (non-composite) key, so there are no partial dependencies — already in 2NF.',
          tables: [
            { name: 'Loan', key: 'LoanID', cols: ['LoanID', 'StudentName', 'TutorName', 'BookTitle', 'Author', 'DueDate'] }
          ]
        },
        {
          form: '3NF',
          rule: 'Remove transitive dependencies: TutorName → Student, and Author → Book. Split into Student, Book and Loan tables.',
          tables: [
            { name: 'Student', key: 'StudentID', cols: ['StudentID', 'StudentName', 'TutorName'] },
            { name: 'Book', key: 'BookID', cols: ['BookID', 'BookTitle', 'Author'] },
            { name: 'Loan', key: 'LoanID', cols: ['LoanID', 'StudentID', 'BookID', 'DueDate'] }
          ]
        }
      ]
    }
  ];

  function tableHtml(cols, rows, keyNote) {
    let h = '<div class="nl-table"><div class="nl-table-name">' + (keyNote || '') + '</div><table><thead><tr>';
    cols.forEach(function (c) { h += '<th>' + esc(c) + '</th>'; });
    h += '</tr></thead><tbody>';
    (rows || []).forEach(function (r) {
      h += '<tr>';
      r.forEach(function (cell) { h += '<td>' + esc(cell) + '</td>'; });
      h += '</tr>';
    });
    h += '</tbody></table></div>';
    return h;
  }

  function stepCard(step) {
    let tables = step.tables.map(function (t) {
      return '<div class="nl-mini"><div class="nl-mini-head"><b>' + esc(t.name) + '</b><span class="nl-key">🔑 ' + esc(t.key) + '</span></div>' +
        '<div class="nl-mini-cols">' + t.cols.map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('') + '</div></div>';
    }).join('');
    return '<div class="nl-step"><div class="nl-step-badge">' + esc(step.form) + '</div>' +
      '<p class="nl-rule">' + esc(step.rule) + '</p>' +
      '<div class="nl-tables">' + tables + '</div></div>';
  }

  function render() {
    const host = document.getElementById('norm-lab-root');
    if (!host) return;

    let examplesHtml = EXAMPLES.map(function (ex) {
      return '<div class="nl-example">' +
        '<div class="nl-example-hd"><h3>' + esc(ex.title) + '</h3><p>' + esc(ex.blurb) + '</p></div>' +
        '<div class="nl-unf">' +
          '<div class="nl-unf-label">UNF — the flat, un-normalised table</div>' +
          tableHtml(ex.unf.cols, ex.unf.rows) +
          '<p class="nl-note">' + esc(ex.unf.note) + '</p>' +
        '</div>' +
        '<div class="nl-steps">' + ex.steps.map(stepCard).join('') + '</div>' +
        '</div>';
    }).join('');

    host.innerHTML =
      '<div class="nl-shell">' +
      '  <div class="nl-intro">' +
      '    <h3>Normalisation in action</h3>' +
      '    <p>Follow each flat table through <b>UNF → 1NF → 2NF → 3NF</b>. The rule for each stage is stated, and you can see exactly which tables split out and why.</p>' +
      '    <div class="nl-mnemonic"><b>Remember:</b> 1NF = atomic (no repeating groups) · 2NF = no partial dependency · 3NF = no transitive dependency</div>' +
      '  </div>' +
      examplesHtml +
      '</div>';
  }

  window.initNormLab = function () { render(); };
})();
