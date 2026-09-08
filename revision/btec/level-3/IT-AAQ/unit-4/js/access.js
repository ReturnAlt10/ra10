/* BTEC IT Unit 4 — Microsoft Access Tutorials
   GUI-first, click-by-click guides to building the assignment database in
   Microsoft Access. Teachers recommend the graphical tools (Design View,
   Lookup Wizard, Relationships window, Query Design) over writing SQL, so
   these tutorials lead with the GUI. SQL is shown only as an optional
   "under the hood" note at the end.
   Scenario matches the real Unit 4 style: a college enrolment system. */
(function () {
  'use strict';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  const MODULES = [
    {
      id: 'basics',
      icon: '🧭',
      title: 'Getting around Access (the GUI way)',
      intro: 'Everything in Access can be done with the mouse — no code needed. This unit is assessed on a working database, and teachers recommend the graphical tools. Learn the layout first.',
      sections: [
        {
          t: 'Open and explore',
          items: [
            'Open Microsoft Access. On the start screen choose <b>Blank database</b>.',
            'Type a filename (e.g. <code>CollegeEnrolments.accdb</code>), choose where to save it, then click <b>Create</b>.',
            'The <b>Navigation Pane</b> (left) lists every object — tables, queries, forms, reports. Right-click its header and choose <b>Object Type</b> to group them logically.',
            'The <b>Ribbon</b> (top) has the tabs you\u2019ll use: <b>Home</b>, <b>Create</b>, <b>External Data</b>, <b>Database Tools</b>. Most of the build happens under <b>Create</b> and <b>Database Tools</b>.'
          ]
        },
        {
          t: 'The four object types you\u2019ll build',
          items: [
            '<b>Tables</b> — store the data (Learner, Course, Subject, Staff, Enrolment).',
            '<b>Queries</b> — filter and combine data (e.g. "list learners on a course").',
            '<b>Forms</b> — friendly screens for entering and viewing data.',
            '<b>Reports</b> — printable summaries with totals (e.g. course enrolment lists).',
            'Macros / buttons automate tasks (open a form, run a query).'
          ]
        },
        {
          t: 'Two ways to build — use the GUI',
          items: [
            'Access gives you a <b>Design View</b> and a <b>Datasheet View</b> for every object. You can do the whole assignment without typing a single line of SQL.',
            'For this unit, teachers recommend <b>Design View</b> for tables (full control over fields, data types, validation) and the <b>wizards</b> for forms/reports.',
            'SQL View still exists behind every query, so you can peek at it for understanding — but you don\u2019t need to write it.'
          ]
        }
      ]
    },
    {
      id: 'tables',
      icon: '📋',
      title: 'Creating tables in Design View',
      intro: 'Tables are the foundation. Build them in Design View so you control every field\u2019s name, data type and validation — the recommended way for this assignment.',
      sections: [
        {
          t: 'Make the Learner table (Design View)',
          items: [
            'On the Ribbon, click <b>Create → Table Design</b>.',
            'In the grid, type each field name in the <b>Field Name</b> column and pick a <b>Data Type</b> from the drop-down:',
            '<b>LearnerID</b> → <b>Short Text</b> (e.g. "L001") — this will be your primary key.',
            '<b>LearnerForename</b> → Short Text · <b>LearnerSurname</b> → Short Text.',
            '<b>LearnerAddress1</b> → Short Text · <b>LearnerTown</b> → Short Text.',
            '<b>LearnerEmail</b> → Short Text · <b>DateOfBirth</b> → Date/Time (if you add it).',
            'Click the row for <b>LearnerID</b>, then click the <b>Primary Key</b> button (the key icon) on the Design ribbon. A key symbol appears.',
            'Press <b>Ctrl+S</b>, name the table <b>Learner</b>, and click OK.'
          ]
        },
        {
          t: 'Make Course, Subject and Staff tables the same way',
          items: [
            '<b>Course</b>: CourseID (Short Text, primary key), CourseStartDate (Date/Time), CourseEndDate (Date/Time), SubjectID (Short Text — will link to Subject later).',
            '<b>Subject</b>: SubjectID (Short Text, primary key), Subject (Short Text, e.g. "A-Level Chemistry").',
            '<b>Staff</b>: StaffID (Short Text, primary key), StaffForename, StaffSurname, StaffEmail.',
            'Repeat the same steps: type fields, set data types, mark the primary key, save with Ctrl+S.'
          ]
        },
        {
          t: 'Set field sizes and validation (Design View)',
          items: [
            'Select a Short Text field, then in the <b>Field Properties</b> pane below, set <b>Field Size</b> (e.g. 50). Sensible sizes save disk space — an optimisation point.',
            'Add a <b>Validation Rule</b> for numeric or date fields, e.g. <code>&gt;=#01/01/2000#</code> on a date field, or <code>&gt;0</code> on a cost field.',
            'Type a friendly <b>Validation Text</b> like "Date must be on or after 2000."',
            'Set <b>Required = Yes</b> for fields that must never be empty (e.g. LearnerSurname).',
            'Use the <b>Input Mask</b> builder (click the … button) for formatted data like phone numbers or postcodes.'
          ]
        }
      ]
    },
    {
      id: 'relationships',
      icon: '🔗',
      title: 'Relationships (drag & drop, no SQL)',
      intro: 'Link tables with one-to-many relationships using the Relationships window — just drag a primary key onto a foreign key. Access enforces the rules for you.',
      sections: [
        {
          t: 'Create a one-to-many relationship',
          items: [
            'Click <b>Database Tools → Relationships</b>.',
            'If the tables aren\u2019t shown, right-click the blank area and choose <b>Show Table</b>, then add <b>Course</b>, <b>Subject</b>, <b>Learner</b>, <b>Staff</b> and <b>Enrolment</b>.',
            'To link Course to Subject: drag <b>SubjectID</b> from Subject onto <b>SubjectID</b> in Course.',
            'In the <b>Edit Relationships</b> dialog, tick <b>Enforce Referential Integrity</b> (and optionally <b>Cascade Update/Delete</b>).',
            'The line shows <b>1</b> (one subject) → <b>∞</b> (many courses). Click <b>Create</b>.',
            'Repeat to link every table — this is the <b>one-to-many</b> structure the spec asks for.'
          ]
        },
        {
          t: 'Model the many-to-many (Enrolment as the linking table)',
          items: [
            'A learner can enrol on many courses, and a course has many learners — that\u2019s <b>many-to-many</b>.',
            'Resolve it with a <b>linking table</b> called <b>Enrolment</b>:',
            'Enrolment fields: EnrolmentID (primary key), LearnerID (foreign key → Learner), CourseID (foreign key → Course), StaffID (foreign key → Staff), TargetGrade, ActualGrade, CourseCost, EnrolmentStart, EnrolmentPlannedFinish, LearnerCompletedCourse (Yes/No), LearnerWithdrawnCompletely (Yes/No).',
            'Drag LearnerID from Learner onto LearnerID in Enrolment, and CourseID from Course onto CourseID in Enrolment — now every enrolment must point at a real learner and a real course.'
          ]
        },
        {
          t: 'Why referential integrity matters (evidence!)',
          items: [
            'It prevents <b>orphan records</b> — you can\u2019t enter an enrolment with a LearnerID that doesn\u2019t exist.',
            'It blocks deleting a learner who still has enrolments (unless you cascade).',
            'It\u2019s an explicit assignment criterion — screenshot the Relationships window as evidence and describe it in your write-up.'
          ]
        }
      ]
    },
    {
      id: 'lookup',
      icon: '🔎',
      title: 'Lookup fields & combo boxes (the GUI way)',
      intro: 'Instead of typing foreign-key codes by hand, use the Lookup Wizard to turn a field into a friendly drop-down. This is the GUI alternative to writing joins by hand.',
      sections: [
        {
          t: 'Make CourseID in Enrolment a drop-down',
          items: [
            'Open <b>Enrolment</b> in <b>Design View</b>.',
            'Click the <b>Data Type</b> cell for <b>CourseID</b> and choose <b>Lookup Wizard…</b> from the drop-down.',
            'Choose <b>I want the lookup field to get the values from another table</b>, then pick the <b>Course</b> table.',
            'Select <b>CourseID</b> (and any display field like CourseStartDate) and click Next, then Finish.',
            'Now in Datasheet View, CourseID becomes a drop-down showing real courses — no more typing wrong IDs.'
          ]
        },
        {
          t: 'The same for LearnerID and StaffID',
          items: [
            'Repeat the Lookup Wizard for <b>LearnerID</b> (from Learner) and <b>StaffID</b> (from Staff) in the Enrolment table.',
            'This is the GUI equivalent of a relationship-driven combo box — exactly the "combo box" the spec lists under form design.',
            'Screenshot one lookup in Design View as evidence of good UI/validation design.'
          ]
        }
      ]
    },
    {
      id: 'queries',
      icon: '🔍',
      title: 'Queries in Design View (no SQL needed)',
      intro: 'Build queries by dragging fields onto a grid and typing criteria — Access writes the SQL for you. You can peek at SQL View to understand it.',
      sections: [
        {
          t: 'A basic select query',
          items: [
            'Click <b>Create → Query Design</b>.',
            'Add the table(s) you need (e.g. <b>Learner</b> and <b>Enrolment</b>) and close the Show Table dialog.',
            'Double-click fields to add them to the <b>grid</b> below (e.g. LearnerSurname, LearnerForename, CourseID).',
            'Click <b>Run</b> (the red exclamation mark) to see the results.',
            'To see the SQL Access wrote, switch to <b>SQL View</b> (View → SQL View) — but you don\u2019t need to edit it.'
          ]
        },
        {
          t: 'Criteria, wildcards and multiple conditions',
          items: [
            'In the <b>Criteria</b> row under a field, type a value to filter, e.g. <code>COU-001</code> under CourseID.',
            'Use wildcards: <code>Like "A*"</code> finds surnames starting with A (asterisk = any characters, ? = one).',
            'Put criteria on the <b>same row</b> for AND, on <b>different rows</b> for OR.',
            'Use operators: <code>&gt;5</code>, <code>&lt;=10</code>, <code>Between #01/01/2022# And #31/12/2024#</code>.'
          ]
        },
        {
          t: 'A parameter query (prompts the user)',
          items: [
            'In the Criteria cell, type a prompt in square brackets, e.g. <code>[Enter a course ID:]</code>.',
            'Run it — Access pops up a box asking for the value, then filters using whatever you type.',
            'This is a <b>parameter query</b>: one query, many uses. Screenshot the prompt and result as evidence.'
          ]
        },
        {
          t: 'A calculated field (totals, averages)',
          items: [
            'In an empty grid column, type a name followed by a colon and an expression, e.g. <code>YearsOnCourse: ([EnrolmentPlannedFinish]-[EnrolmentStart])/365</code>.',
            'Run to see the calculated value for each row.',
            'Prefer calculating on the fly (rather than storing results) — it stays correct as data changes.'
          ]
        }
      ]
    },
    {
      id: 'forms',
      icon: '🖱️',
      title: 'Forms & subforms (the GUI way)',
      intro: 'Forms give users a friendly way to add and view data, with combo boxes, buttons and validation — all built visually.',
      sections: [
        {
          t: 'A data entry form (Form Wizard)',
          items: [
            'Select a table, then click <b>Create → Form Wizard</b>.',
            'Choose the fields you want (or use <b>Create → Form</b> for a quick auto-form).',
            'Pick a layout (Columnar is good for data entry) and finish.',
            'Switch to <b>Form Layout / Design View</b> to move fields around.',
            'Add a <b>Button</b> (Form Design → Button) to run actions like "Save", "Close" or "Run a query" — the wizard walks you through it.'
          ]
        },
        {
          t: 'A form with a subform (parent + child)',
          items: [
            'A subform shows the "many" side inside the "one" form — e.g. a Course form showing all its Enrolments.',
            'Use the <b>Form Wizard</b>: choose the parent table (Course), then the child table (Enrolment), and pick the relationship. It creates the parent form with an embedded subform automatically.',
            'This parent + child pattern is the <b>form and subform</b> the spec lists under "child forms".'
          ]
        }
      ]
    },
    {
      id: 'reports',
      icon: '📊',
      title: 'Reports (grouping & totals)',
      intro: 'Reports present data for printing, with grouping and calculated totals — built with the Report Wizard.',
      sections: [
        {
          t: 'A grouped report with totals',
          items: [
            'Select a table or query, then click <b>Create → Report Wizard</b>.',
            'Choose fields (e.g. LearnerSurname, LearnerForename, CourseID, TargetGrade, ActualGrade).',
            'Add a <b>grouping level</b> (e.g. group by CourseID) and choose sorting.',
            'Pick a layout and style, then Finish.',
            'In Design View, add a <b>totals</b> field (e.g. <code>=Count([EnrolmentID])</code>) in the group footer to count enrolments per course.',
            'Use <b>Conditional Formatting</b> (Format ribbon) to highlight values — e.g. red for "Not completed" learners.'
          ]
        }
      ]
    },
    {
      id: 'macros',
      icon: '⚙️',
      title: 'Macros & task automation',
      intro: 'Macros automate repeated tasks without code — open a form, run a query, print a report.',
      sections: [
        {
          t: 'Automate with a button or macro',
          items: [
            'On a form, add a <b>Button</b> and use the Command Button Wizard.',
            'Pick an action (e.g. "OpenForm", "RunQuery", "PrintReport") and follow the prompts.',
            'Alternatively click <b>Create → Macro</b>, add actions from the list (OpenForm, RunMenuCommand…), and save it.',
            'Document the macro in your write-up as your "task automation" evidence.'
          ]
        }
      ]
    },
    {
      id: 'data-entry',
      icon: '📥',
      title: 'Populating & importing data (the GUI way)',
      intro: 'Get real data in — either typed through forms, or imported from a spreadsheet or CSV. Your sample data (like a big enrolment list) is perfect for import.',
      sections: [
        {
          t: 'Import a big enrolment list from Excel / CSV',
          items: [
            'Click <b>External Data → New Data Source → From File → Excel</b> (or Text File for CSV).',
            'Browse to your file and follow the wizard: choose the sheet, tick <b>First Row Contains Column Headings</b>, and pick the destination table (or create a new one).',
            'Confirm data types (e.g. dates as Date/Time, IDs as Short Text) and Finish.',
            'Access creates/updates the table — screenshot before and after as "populating the database" evidence.'
          ]
        },
        {
          t: 'Add / edit / delete records through a form',
          items: [
            'Open a form and type into the empty (bottom) record to add.',
            'Click into a cell to edit; select a row and press Delete to remove.',
            'This is the day-to-day GUI alternative to typing SQL INSERT / UPDATE / DELETE — recommend it to users in your write-up.'
          ]
        }
      ]
    },
    {
      id: 'sql-optional',
      icon: '🧾',
      title: 'Optional: understanding SQL View',
      intro: 'You don\u2019t need to write SQL for this assignment, but knowing what Access writes "under the hood" deepens your understanding — and helps you ace the theory (Aim A).',
      sections: [
        {
          t: 'What each GUI action becomes in SQL',
          items: [
            'Creating a table in Design View = <code>CREATE TABLE</code>.',
            'Adding a record in a form = <code>INSERT INTO</code>.',
            'Editing a record = <code>UPDATE</code> · deleting = <code>DELETE</code>.',
            'A query you build by dragging fields = <code>SELECT … FROM … WHERE …</code>.',
            'Switch any query to <b>SQL View</b> to see the exact statement — a great way to learn SQL alongside the GUI.'
          ]
        },
        {
          t: 'Practise in the RA10 SQL Lab',
          items: [
            'The <b>SQL Lab</b> (under Tools) lets you try SELECT / INSERT / UPDATE / DELETE against a sample college database — no Access needed.',
            'Use it to understand what your Design View queries are really doing, then replicate the same result in Access with the GUI.'
          ]
        }
      ]
    }
  ];

  function render() {
    const host = document.getElementById('access-root');
    if (!host) return;

    let html = '<div class="acc-shell">' +
      '<div class="acc-intro">' +
      '  <h3>Learn Microsoft Access the GUI way</h3>' +
      '  <p>These click-by-click tutorials take you from a blank database to a finished enrolment system — the exact journey your assignment (Aim C) asks for. <b>Everything uses the graphical tools</b> (Design View, Lookup Wizard, Relationships window, Query Design), which is what teachers recommend. SQL is optional and shown last.</p>' +
      '</div>' +
      '<div class="acc-modules">';

    MODULES.forEach(function (mod, mi) {
      html += '<div class="acc-module">' +
        '<button class="acc-module-hd" data-target="acc-body-' + mod.id + '">' +
          '<span class="acc-module-num">' + (mi + 1) + '</span>' +
          '<span class="acc-module-ico">' + mod.icon + '</span>' +
          '<span class="acc-module-title">' + esc(mod.title) + '</span>' +
          '<span class="acc-cherr">▾</span>' +
        '</button>' +
        '<div class="acc-body" id="acc-body-' + mod.id + '">' +
          '<p class="acc-module-intro">' + esc(mod.intro) + '</p>' +
          mod.sections.map(function (sec) {
            return '<div class="acc-section"><h4>' + esc(sec.t) + '</h4><ol class="acc-steps">' +
              sec.items.map(function (it) { return '<li>' + it + '</li>'; }).join('') +
              '</ol></div>';
          }).join('') +
        '</div></div>';
    });

    html += '</div></div>';
    host.innerHTML = html;

    host.querySelectorAll('.acc-module-hd').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const body = document.getElementById(btn.dataset.target);
        const module = btn.closest('.acc-module');
        if (body) body.classList.toggle('open');
        if (module) module.classList.toggle('open');
      });
    });
  }

  window.initAccessGuide = function () { render(); };
})();