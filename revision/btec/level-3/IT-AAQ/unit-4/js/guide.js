/* BTEC IT Unit 4 — Relational Database Development — Comprehensive Revision Guide
   Aims A, B and C — theory + Microsoft Access tutorials. Initialised by window.initComprehensiveGuide() */
(function () {
  'use strict';

  const STORE_KEY = 'ra10-guide-revised-IT-u4';
  const AIMS = ['A', 'B', 'C'];
  const AIM_TITLES = {
    A: 'Database principles, data structures & normalisation',
    B: 'Designing a relational database to a client brief',
    C: 'Building, testing, reviewing & optimising the database'
  };
  const AIM_SUBTITLES = {
    A: 'RDBMS types, relations/attributes/tuples, keys, integrity, entity relationships, querying data, normalisation and scoping to a brief',
    B: 'ERDs (conceptual & logical), design documentation, data dictionaries, forms, queries, reports, macros and reviewing designs',
    C: 'Building in a DBMS with graphical tools (Design View, Query Design, wizards), testing, reviewing, and optimising for performance'
  };

  function getRevised() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch (e) { return []; }
  }
  function saveRevised(arr) { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); }

  function buildSidebar() {
    const items = [
      { aim: 'A', topics: [['A1', 'RDBMS & Data Structures'], ['A2', 'Manipulating Data'], ['A3', 'Normalisation'], ['A4', 'Scoping to a Brief']] },
      { aim: 'B', topics: [['B1', 'Design Techniques'], ['B2', 'Design Documentation'], ['B3', 'Reviewing Designs']] },
      { aim: 'C', topics: [['C1', 'Producing a Database'], ['C2', 'Testing'], ['C3', 'Reviewing'], ['C4', 'Optimising']] }
    ];
    return `
<button class="guide-sb-toggle" onclick="this.closest('.guide-sidebar').classList.toggle('sb-open')">
  <span>&#9776; Contents</span><span>&#8595;</span>
</button>
<div class="guide-sidebar-hd">
  <span class="guide-toc-label">Unit 4 Guide</span>
</div>
<div class="guide-toc-scroll">
  ${items.map(g => `
  <div class="guide-toc-aim-group">
    <button class="guide-toc-aim-link" onclick="guideScrollTo('guide-aim-${g.aim}')">
      <span class="guide-toc-badge">${g.aim}</span>${AIM_TITLES[g.aim].split(' ').slice(0, 3).join(' ')}…
    </button>
    <div class="guide-toc-topic-links">
      ${g.topics.map(([code, name]) => `<button class="guide-toc-topic-link" onclick="guideScrollTo('gt-${code}')">${code} ${name}</button>`).join('')}
    </div>
  </div>`).join('')}
</div>`;
  }

  function topic(code, name, bodyHtml, startOpen) {
    return `
<div class="guide-topic${startOpen ? ' open' : ''}" id="gt-${code}">
  <div class="guide-topic-hd" onclick="toggleGT('gt-${code}')">
    <span class="guide-topic-code">${code}</span>
    <span class="guide-topic-name">${name}</span>
    <span class="guide-topic-chevron">&#9660;</span>
  </div>
  <div class="guide-topic-body">${bodyHtml}</div>
</div>`;
  }

  function aim(letter, topicsHtml) {
    return `
<div class="guide-aim-section" id="guide-aim-${letter}">
  <div class="guide-aim-hd">
    <div class="guide-aim-badge">${letter}</div>
    <div>
      <div class="guide-aim-title">Aim ${letter}: ${AIM_TITLES[letter]}</div>
      <div class="guide-aim-subtitle">${AIM_SUBTITLES[letter]}</div>
    </div>
  </div>
  ${topicsHtml}
  <button class="guide-mark-btn" id="gmb-${letter}" onclick="toggleGuideRevised('${letter}')">
    <span class="guide-mark-icon">&#9711;</span> Mark Aim ${letter} as revised
  </button>
</div>`;
  }

  const GUIDE_GALLERY = [
    { aim: 'A', kicker: 'Understand', title: 'Principles & normalisation', copy: 'Relations, keys, integrity, querying and the normalisation stages (UNF → 3NF) that make data reliable and efficient.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
    { aim: 'B', kicker: 'Design', title: 'ERDs & documentation', copy: 'Conceptual and logical ERDs, data dictionaries, form/query/report design and a test plan — the Task 2 blueprint.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80' },
    { aim: 'C', kicker: 'Build', title: 'Access tools, test & optimise', copy: 'Create tables, relationships, queries, forms and reports with Access\u2019s graphical tools (Design View & wizards), populate, test with normal/erroneous/extreme data, then optimise.', image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80' }
  ];

  function buildGuideGallery() {
    return `
<section class="guide-gallery" aria-label="Unit 4 visual overview">
  ${GUIDE_GALLERY.map(card => `
  <button class="guide-gallery-card" type="button" onclick="guideScrollTo('guide-aim-${card.aim}')" style="--guide-card-image:url('${card.image}')">
    <span class="guide-gallery-kicker">${card.kicker}</span>
    <span class="guide-gallery-title">${card.title}</span>
    <span class="guide-gallery-copy">${card.copy}</span>
    <span class="guide-gallery-source">Royalty-free stock photo</span>
  </button>`).join('')}
</section>`;
  }

  /* ════════════════════════════════════════════════════════════
     AIM A — Principles & normalisation
  ════════════════════════════════════════════════════════════ */
  const aimA = aim('A', [
    topic('A1', 'Relational database management systems', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Relational database</span> — a database that stores data in <strong>relations (tables)</strong>, linked together by keys, so that data is stored once and combined when needed. An <strong>RDBMS</strong> is the software that manages it (Access, MySQL, Oracle…).</div>

<p><strong>Types of RDBMS and where they run:</strong></p>
<table class="g-table"><thead><tr><th>Type</th><th>Examples</th><th>Strengths / when to use</th></tr></thead><tbody>
<tr><td><strong>Desktop database</strong></td><td>Microsoft Access, FileMaker</td><td>Stored as a single file on one PC; one (or few) users; ideal for small businesses and this unit's assignment.</td></tr>
<tr><td><strong>Server database</strong></td><td>MySQL, Oracle, SQL Server, PostgreSQL</td><td>Runs on a central server; many concurrent users over a network; scales to huge datasets.</td></tr>
</tbody></table>

<p><strong>Relational data structure concepts — know all six:</strong></p>
<table class="g-table"><thead><tr><th>Concept</th><th>Meaning</th><th>Example</th></tr></thead><tbody>
<tr><td><strong>Relation</strong></td><td>A table of data with a unique name</td><td>Customer</td></tr>
<tr><td><strong>Attribute</strong></td><td>A named column</td><td>CustomerID, FirstName, PostCode</td></tr>
<tr><td><strong>Domain</strong></td><td>The set of allowed values for an attribute</td><td>Age: integers 0–120</td></tr>
<tr><td><strong>Tuple</strong></td><td>A single row (record)</td><td>One customer</td></tr>
<tr><td><strong>Degree</strong></td><td>Number of attributes (columns)</td><td>5 columns → degree 5</td></tr>
<tr><td><strong>Cardinality</strong></td><td>Number of tuples (rows)</td><td>200 rows → cardinality 200</td></tr>
</tbody></table>

<p><strong>Relational keys — the heart of the model:</strong></p>
<ul>
<li><strong>Super key</strong> — any set of attributes that uniquely identifies a tuple.</li>
<li><strong>Candidate key</strong> — a <em>minimal</em> super key (no unnecessary columns); a table may have several.</li>
<li><strong>Primary key (PK)</strong> — the chosen candidate key; unique and never null. Usually an ID (AutoNumber).</li>
<li><strong>Foreign key (FK)</strong> — an attribute that references another table's primary key to link them.</li>
</ul>

<p><strong>Integrity constraints:</strong></p>
<ul>
<li><strong>Entity integrity</strong> — every table has a PK, and it cannot be null or duplicated (each row uniquely identified).</li>
<li><strong>Referential integrity</strong> — a FK must match an existing PK value (or be null). You can't have an order pointing at a customer that doesn't exist.</li>
</ul>

<p><strong>Entity relationship types:</strong></p>
<table class="g-table"><thead><tr><th>Type</th><th>Example</th><th>How modelled</th></tr></thead><tbody>
<tr><td><strong>One-to-one</strong></td><td>Employee ↔ Company car</td><td>FK on one side (or merge into one table)</td></tr>
<tr><td><strong>One-to-many</strong></td><td>Customer → Orders</td><td>PK of "one" becomes FK on "many"</td></tr>
<tr><td><strong>Many-to-many</strong></td><td>Students ↔ Courses</td><td>Linking (junction) table with two FKs</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Quick mnemonic</div>
<strong>Relation = table · Attribute = column · Tuple = row · Degree = #columns · Cardinality = #rows.</strong> Being able to label a table with all five earns easy marks in Aim A.</div>`, true),

    topic('A2', 'Manipulating data structures and data', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Manipulating data</span> — adding, changing and retrieving data in a database. You do this in <strong>Microsoft Access with the graphical tools</strong> (Design View, Datasheet View, Query Design, the Lookup Wizard) — no code needed. Under the hood Access writes the same <strong>SQL</strong>, but you rarely have to type it yourself in this assignment.</div>

<p><strong>1 · Defining and changing tables — the GUI way (Design View):</strong></p>
<ul>
<li><strong>Create</strong> a table: Ribbon → <strong>Create → Table Design</strong>. Add field names and choose a <strong>Data Type</strong> for each.</li>
<li><strong>Modify</strong> a table: open it in Design View and add/rename/remove fields, or change a field\u2019s data type and size.</li>
<li><strong>Remove</strong> a table: right-click it in the Navigation Pane → <strong>Delete</strong>.</li>
</ul>

<p><strong>Adding, editing and deleting records — Datasheet View:</strong></p>
<ul>
<li>Open a table in <strong>Datasheet View</strong> and type straight into the grid to add rows.</li>
<li>Click into a cell to <strong>edit</strong> it; select a row and press Delete to <strong>remove</strong> it.</li>
<li>Or use a <strong>form</strong> (the friendly screen) to enter data — this is how real users will add records.</li>
</ul>

<p><strong>Retrieving and filtering data — Query Design:</strong></p>
<ul>
<li>Ribbon → <strong>Create → Query Design</strong>, add tables, double-click fields, and set <strong>criteria</strong> in the grid (e.g. <code>DateJoined &gt;= #01/01/2025#</code>).</li>
<li><strong>Sort</strong> a column Ascending/Descending, and <strong>Total</strong> a column (Count/Sum/Average) using the Totals button.</li>
<li>Every query has a hidden <strong>SQL View</strong> — the line of SQL beneath what the grid builds, which is useful for understanding (and for the SQL Lab tool).</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; GUI-first is the assignment\u2019s expectation</div>
Teachers recommend the <strong>graphical tools</strong> for this unit — Design View, Datasheet View, Query Design and the wizards. SQL knowledge is still in the spec (and the exam may test it), but you can build your whole assignment without typing a single statement. See the <strong>Access tutorials</strong> under Tools for the click-by-click version.</div>`, true),

    topic('A3', 'Normalisation', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Normalisation</span> — organising tables into smaller, related structures to <strong>remove redundant data</strong> and <strong>dependency problems</strong>. The goal: each fact stored once, so data stays consistent and efficient.</div>

<p><strong>Why bother? Three anomalies caused by bad (unnormalised) design:</strong></p>
<table class="g-table"><thead><tr><th>Anomaly</th><th>Problem</th><th>Example</th></tr></thead><tbody>
<tr><td><strong>Update</strong></td><td>Data duplicated → change it in one place but not another</td><td>Phone number changed in one row only</td></tr>
<tr><td><strong>Insertion</strong></td><td>Can't add new data without adding unrelated data</td><td>Can't add a course until a student enrols</td></tr>
<tr><td><strong>Deletion</strong></td><td>Deleting a record loses other useful data</td><td>Deleting the last student erases the course</td></tr>
</tbody></table>

<p><strong>The stages — learn the rule for each:</strong></p>
<table class="g-table"><thead><tr><th>Form</th><th>What you do</th></tr></thead><tbody>
<tr><td><strong>UNF</strong> (un-normalised)</td><td>Starting point — may contain repeating groups.</td></tr>
<tr><td><strong>1NF</strong></td><td>Remove repeating groups — every cell holds a single <em>atomic</em> value; identify the key.</td></tr>
<tr><td><strong>2NF</strong></td><td>Remove <em>partial</em> dependencies — non-key attributes must depend on the <em>whole</em> primary key (only matters for composite keys).</td></tr>
<tr><td><strong>3NF</strong></td><td>Remove <em>transitive</em> dependencies — non-key attributes must not depend on other non-key attributes.</td></tr>
</tbody></table>

<p><strong>Worked example — a flat table of orders:</strong></p>
<pre><code>Order(OrderID, CustomerName, CustomerPhone, ProductID, ProductName, Qty)</code></pre>
<ul>
<li><strong>1NF</strong> — ensure Qty (and other values) are atomic; assume no repeating groups here.</li>
<li><strong>2NF</strong> — ProductName depends only on ProductID (part of the key), not the whole key → move to a <code>Product</code> table. CustomerName/Phone depend only on OrderID → move to <code>Customer</code>.</li>
<li><strong>3NF</strong> — no non-key attribute depends on another non-key attribute → already achieved.</li>
</ul>
<pre><code>Order(OrderID, CustomerID*, OrderDate)
Customer(CustomerID, CustomerName, CustomerPhone)
Product(ProductID, ProductName, Price)
OrderLine(OrderID*, ProductID*, Qty)   -- linking table</code></pre>

<p><strong>Also know:</strong> <strong>referential integrity</strong> (FKeys match PKs) and the <strong>data dictionary</strong> (documents every table/field/type/validation).</p>

<div class="mistake-box"><div class="mistake-label">&#9888; Common mistake</div>
Saying "3NF just removes duplicate data" — that's vague. Be precise: <strong>1NF = atomic (no repeating groups), 2NF = no partial dependency, 3NF = no transitive dependency.</strong> Show each stage with your own table split up.</div>`, true),

    topic('A4', 'Preliminary scoping of a solution in response to a client brief', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Scoping document</span> — the first planning evidence: what the database must do, the problem it solves, technical requirements, and research into how to structure the data. This is Task 1 output.</div>

<p><strong>1 · Purpose:</strong></p>
<ul>
<li><strong>Problem to be solved</strong> — e.g. "bookings are tracked on a spreadsheet, causing double-bookings".</li>
<li><strong>Technical requirements</strong> — tables needed, relationships, queries/reports, and the DBMS (Access / MySQL / Oracle).</li>
</ul>

<p><strong>2 · Research:</strong></p>
<ul>
<li><strong>Existing databases</strong> — how do similar systems store data? What tables and keys do they use?</li>
<li><strong>Structuring data</strong> — plan your <strong>tables</strong> and <strong>keys</strong> (PKs and FKs).</li>
<li><strong>Available resources</strong> — what software and data do you have access to?</li>
</ul>

<p><strong>3 · Technical vocabulary &amp; logical structure:</strong></p>
<ul>
<li>Use accurate terms (relation, attribute, tuple, primary/foreign key, normalisation) — the spec explicitly rewards this.</li>
<li>Outline the <strong>logical structure</strong>: which tables, how they relate, and the key fields.</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Distinction edge (A.D1)</div>
For Distinction you must <em>evaluate</em> — compare the advantages each stage of normalisation offers, and clearly connect your scoping document back to the client's requirements with fluent technical vocabulary.</div>`, true)
  ]);

  /* ════════════════════════════════════════════════════════════
     AIM B — Design
  ════════════════════════════════════════════════════════════ */
  const aimB = aim('B', [
    topic('B1', 'Relational database design techniques and processes', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Entity Relationship Diagram (ERD)</span> — a diagram showing entities (tables), their attributes, and the relationships between them. Produced at two levels: conceptual and logical.</div>

<p><strong>Entity relationship modelling — two levels:</strong></p>
<table class="g-table"><thead><tr><th>Level</th><th>Contains</th><th>Purpose</th></tr></thead><tbody>
<tr><td><strong>Conceptual</strong></td><td>Entity names, relationships, relationship types</td><td>Big-picture model to discuss with the client — no technical detail yet.</td></tr>
<tr><td><strong>Logical</strong></td><td>+ attributes, primary keys, foreign keys</td><td>The blueprint ready to implement in a DBMS.</td></tr>
</tbody></table>

<p><strong>Relationship types &amp; relational algebra operators:</strong></p>
<ul>
<li>Cardinality: <strong>one-to-one</strong>, <strong>one-to-many</strong>, <strong>many-to-many</strong> (resolve via a linking table).</li>
<li>Selection/condition operators: <strong>AND, OR, NOT, &gt;, &lt;, ≥, ≤</strong> — used in query criteria.</li>
</ul>

<p><strong>DBMS selection:</strong> choose desktop software (Access) or cloud/server-based (MySQL, Oracle) based on scale, users and budget — justify your choice in the design.</p>

<p><strong>Implementation techniques:</strong></p>
<ul>
<li><strong>Prototyping</strong> — build a quick working version early to test ideas and gather feedback.</li>
<li><strong>Testing</strong> — plan how you'll verify correctness of data, relationships, integrity and normalisation.</li>
</ul>

<p><strong>Quality of the solution</strong> — assess correctness of data, relationships between data, data integrity and normalisation.</p>

<div class="exam-tip"><div class="tip-label">&#128161; Task 2 tip</div>
Produce BOTH a conceptual and a logical ERD — showing the progression is exactly what moves your design from "some" (B.P3) toward "comprehensive" (B.D2).</div>`, true),

    topic('B2', 'Design documentation', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Design specification</span> — the full design pack: requirements, data dictionary, ERDs, normalisation, UI designs (forms/menus/queries/reports), test plan and implementation timescales.</div>

<p><strong>1 · Design specification:</strong></p>
<ul>
<li><strong>Requirements of the brief</strong>, <strong>audience</strong>, <strong>purpose</strong>, <strong>client requirements</strong>.</li>
<li><strong>Legal &amp; ethical</strong> — data protection legislation (UK GDPR / Data Protection Act 2018): only collect what you need, store securely, respect privacy. Consider applicable regulations.</li>
</ul>

<p><strong>2 · Data structure designs:</strong></p>
<ul>
<li><strong>Data dictionary</strong> — a table documenting every field: table, field name, data type, length, validation. (This is a core piece of evidence.)</li>
<li><strong>ERDs</strong> and <strong>normalisation</strong> evidence (UNF → 3NF).</li>
</ul>

<p><strong>3 · User interface design:</strong></p>
<table class="g-table"><thead><tr><th>Element</th><th>What to design</th></tr></thead><tbody>
<tr><td><strong>Forms</strong></td><td>Input fields, calculated fields, disabled fields, combo boxes, list boxes, radio buttons/groups, validation, input masks, user help.</td></tr>
<tr><td><strong>Menus</strong></td><td>Action buttons that initiate tasks (open form, run query, print report).</td></tr>
<tr><td><strong>Queries</strong></td><td>Multiple criteria, form values, wildcards, action queries, calculated queries.</td></tr>
<tr><td><strong>Reports</strong></td><td>Calculated fields, grouping, presentation, layouts, conditional formatting.</td></tr>
<tr><td><strong>Automation</strong></td><td>Macros, scripts, program code.</td></tr>
</tbody></table>

<p><strong>4 · Test plan</strong> — plan how you'll check data integrity, functionality, accessibility and usability.</p>
<p><strong>5 · Implementation plan &amp; timescales</strong> — the ordered steps and how long each takes.</p>

<div class="mistake-box"><div class="mistake-label">&#9888; Common mistake</div>
Skipping the data dictionary. It's explicitly listed in B2 and is easy evidence: a simple table of fields + types + lengths + validation. Include it and you're already ahead.</div>`, true),

    topic('B3', 'Reviewing and refining designs', `
<p><strong>Self-review — the spec's checklist:</strong></p>
<ul>
<li><strong>Suitability for user</strong> — would the actual user get on with the forms/menus?</li>
<li><strong>Meeting client requirements</strong> — does the design tick every point in the brief?</li>
<li><strong>Legal and ethical constraints</strong> — is data protected, is access controlled?</li>
<li><strong>Consistency</strong> — naming, layout and validation consistent across tables/forms.</li>
</ul>

<p><strong>Refine ideas and solutions:</strong> act on the review — change field types, split tables further, improve forms — and <strong>update the design specification</strong> so it always reflects the current plan.</p>

<div class="exam-tip"><div class="tip-label">&#128161; Distinction edge (B.D2)</div>
Show an explicit <em>before → after</em> loop: "Reviewed: form allowed free-text for postcode → Refined: added an input mask LL00 0LL." Documenting refinements demonstrates the iterative design the spec rewards.</div>`, true)
  ]);

  /* ════════════════════════════════════════════════════════════
     AIM C — Develop, test, review, optimise
  ════════════════════════════════════════════════════════════ */
  const aimC = aim('C', [
    topic('C1', 'Producing a database solution', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Build</span> — use a DBMS (Microsoft Access) to create tables, relationships and validation, then add a usable interface (forms, queries, reports, macros) and populate it with data — <strong>all with the graphical tools</strong> (Design View, Relationships window, Query Design and the wizards).</div>

<p><strong>1 · Creating, setting up and maintaining tables:</strong></p>
<ul>
<li>Ribbon → <strong>Create → Table Design</strong>: add each field, choose a <strong>Data Type</strong> (Short Text, Number, Date/Time, Yes/No, Currency), set a <strong>Primary Key</strong> on the ID field, and set <strong>Field Size</strong> and validation in the properties pane.</li>
<li>Save with Ctrl+S and give the table a clear name (e.g. <code>Booking</code>).</li>
</ul>

<p><strong>2 · Creating links/relationships</strong> — Ribbon → <strong>Database Tools → Relationships</strong>. Drag the primary key of one table onto the matching foreign key of another and tick <strong>Enforce Referential Integrity</strong> to create one-to-many links.</p>

<p><strong>3 · Applying validation rules</strong> — in each field\u2019s properties set a <strong>Validation Rule</strong> (e.g. <code>&gt;0</code> for seats, <code>&gt;=#01/01/2020#</code> for dates), <strong>Required = Yes</strong>, and an <strong>Input Mask</strong> for formatted entries. A friendly <strong>Validation Text</strong> explains errors to the user.</p>

<p><strong>4 · Generating outputs:</strong></p>
<ul>
<li><strong>User-generated queries</strong> — queries a user runs on demand (search films by genre), built in <strong>Query Design</strong>.</li>
<li><strong>Automated queries</strong> — run by macros/buttons without the user doing anything.</li>
<li><strong>Reports</strong> — formatted, printable outputs (grouping, totals, conditional formatting) via the <strong>Report Wizard</strong>.</li>
</ul>

<p><strong>5 · User interface:</strong> navigation menus, data-entry <strong>forms</strong> (Form Wizard) with combo boxes, and <strong>child (sub) forms</strong> for parent→child data (e.g. an order with its order lines).</p>

<p><strong>6 · Task automation</strong> — <strong>macros</strong>/buttons that open forms, run queries or print reports.</p>

<p><strong>7 · Populating the database</strong> — <strong>importing</strong> (External Data → Excel/CSV), adding data via forms, and editing via Datasheet View.</p>

<div class="exam-tip"><div class="tip-label">&#128161; Evidence checklist</div>
Screenshots of: table Design View, Relationships window (with referential integrity), validation rules, forms, query Design/SQL, and the final report. Walk through each in your write-up.</div>`, true),

    topic('C2', 'Testing the database solution', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Test plan</span> — a documented set of tests: description, test data, expected result, actual result and outcome (pass/fail). Expected vs actual is what makes testing credible.</div>

<p><strong>Types of testing:</strong></p>
<ul>
<li><strong>Referential integrity</strong> — do relationships hold (no orphans, blocked deletes)?</li>
<li><strong>Functionality</strong> — do queries, forms, reports and buttons work?</li>
</ul>

<p><strong>Test data — the three kinds:</strong></p>
<table class="g-table"><thead><tr><th>Data</th><th>Example</th><th>Confirms</th></tr></thead><tbody>
<tr><td><strong>Normal (valid)</strong></td><td>Age 34, a real postcode</td><td>The system handles expected input</td></tr>
<tr><td><strong>Erroneous (invalid)</strong></td><td>Age -5, letters in a number field</td><td>Validation rules reject bad input</td></tr>
<tr><td><strong>Extreme (boundary)</strong></td><td>Age 0, 120, max field length</td><td>Edge cases and limits work</td></tr>
</tbody></table>

<p><strong>Object testing</strong> — test each object type: tables, queries, reports, forms, menus.</p>

<p><strong>Usability testing</strong> — select suitable test users and devise tests; gather feedback; produce test documentation; use outcomes to improve.</p>

<div class="mistake-box"><div class="mistake-label">&#9888; Common mistake</div>
Only testing with normal data. The spec explicitly asks for <strong>erroneous</strong> and <strong>extreme</strong> data too — include all three categories in your test plan to hit the higher bands.</div>`, true),

    topic('C3', 'Reviewing the database solution', `
<p><strong>Review the finished database against:</strong></p>
<ul>
<li><strong>Quality of the database</strong> — is it well-structured, normalised, error-free?</li>
<li><strong>Fitness for purpose</strong> — does it actually do what the client needs?</li>
<li><strong>Suitability against the original requirements</strong> — tick every brief requirement.</li>
<li><strong>Legal and ethical constraints</strong> — is data protected and used appropriately?</li>
<li><strong>Strengths and improvements</strong> — what's good, and what would you change with more time?</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Distinction edge (C.D3)</div>
Link your self-review to your testing outcomes, then make <em>considered refinements</em>. "Usability test showed users couldn't find the booking form → added a menu button" is exactly the loop the spec rewards.</div>`, true),

    topic('C4', 'Optimising the database solution', `
<p><strong>Optimise for size and speed:</strong></p>
<ul>
<li><strong>Data types</strong> — choose the smallest suitable type (Short Text with a small Field Size vs Long Text; Number Integer/Byte where a whole number fits).</li>
<li><strong>Data sizes</strong> — reduce size on disk; for images, store <em>paths</em> rather than the images themselves where possible.</li>
<li><strong>Many tables</strong> — weigh the overhead of too many tables and increased query complexity against normalisation benefits.</li>
<li><strong>Query optimisation</strong> — in Query Design select only the columns you need, and make sure joins use indexed key fields (primary/foreign keys are indexed automatically).</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Quick win</div>
Mention <strong>indexing</strong> key fields (PKs and FKs are usually indexed automatically) and choosing appropriate data types/field sizes — both are easy, concrete optimisation points to name in your review. In Query Design you set all of this in the grid, no SQL needed.</div>`, true)
  ]);

  /* ── Glossary ───────────────────────────────────────────── */
  const glossary = `
<div class="guide-aim-section" id="guide-glossary">
  <div class="guide-aim-hd">
    <div class="guide-aim-badge" style="font-size:.95rem">&#128218;</div>
    <div>
      <div class="guide-aim-title">Key Terms Glossary — All Aims</div>
      <div class="guide-aim-subtitle">Quick-reference definitions for Aims A, B and C</div>
    </div>
  </div>
  <div class="guide-topic open" id="gt-glossary">
    <div class="guide-topic-hd" onclick="toggleGT('gt-glossary')">
      <span class="guide-topic-code">REF</span>
      <span class="guide-topic-name">Key terms and definitions</span>
      <span class="guide-topic-chevron">&#9660;</span>
    </div>
    <div class="guide-topic-body">
      <table class="g-table"><thead><tr><th>Term</th><th>Definition</th></tr></thead><tbody>
      <tr><td>Relation</td><td>A table of data with a unique name</td></tr>
      <tr><td>Attribute</td><td>A named column in a relation</td></tr>
      <tr><td>Tuple</td><td>A single row (record)</td></tr>
      <tr><td>Domain</td><td>The set of allowed values for an attribute</td></tr>
      <tr><td>Degree</td><td>Number of columns</td></tr>
      <tr><td>Cardinality</td><td>Number of rows</td></tr>
      <tr><td>Primary key</td><td>Unique, non-null identifier for each row</td></tr>
      <tr><td>Foreign key</td><td>References another table's primary key</td></tr>
      <tr><td>Composite key</td><td>Primary key made of two+ attributes</td></tr>
      <tr><td>Entity integrity</td><td>PK never null or duplicated</td></tr>
      <tr><td>Referential integrity</td><td>FK must match an existing PK (or null)</td></tr>
      <tr><td>RDBMS</td><td>Software managing related tables (Access, MySQL, Oracle)</td></tr>
      <tr><td>ERD</td><td>Entity Relationship Diagram</td></tr>
      <tr><td>Conceptual model</td><td>Entities + relationships only</td></tr>
      <tr><td>Logical model</td><td>Adds attributes, keys, data types</td></tr>
      <tr><td>Normalisation</td><td>Organising tables to remove redundancy (UNF→3NF)</td></tr>
      <tr><td>Update anomaly</td><td>Inconsistency from duplicated data</td></tr>
      <tr><td>Insertion anomaly</td><td>Can't add data without unrelated data</td></tr>
      <tr><td>Deletion anomaly</td><td>Losing data when deleting a record</td></tr>
      <tr><td>Data dictionary</td><td>Documents tables, fields, types, validation</td></tr>
      <tr><td>SQL</td><td>Structured Query Language</td></tr>
      <tr><td>Validation rule</td><td>Condition data must pass (e.g. Price &gt; 0)</td></tr>
      <tr><td>Input mask</td><td>Formats/controls data entry (e.g. LL00 0LL)</td></tr>
      <tr><td>Combo box</td><td>Drop-down to pick from a list</td></tr>
      <tr><td>Parameter query</td><td>Prompts the user for a value at run time</td></tr>
      <tr><td>Action query</td><td>Modifies data (append/update/delete)</td></tr>
      <tr><td>Macro</td><td>Saved sequence of automated actions</td></tr>
      <tr><td>Normal test data</td><td>Expected, everyday input</td></tr>
      <tr><td>Erroneous test data</td><td>Deliberately invalid input</td></tr>
      <tr><td>Extreme test data</td><td>Boundary/edge-case values</td></tr>
      <tr><td>Fitness for purpose</td><td>Does it meet the client's requirements?</td></tr>
      </tbody></table>
    </div>
  </div>
</div>`;

  function buildGuideHTML() {
    return `
<div class="guide-shell">
  <div class="guide-sidebar" id="guide-sidebar-it">
    ${buildSidebar()}
  </div>
  <div class="guide-main">
    <div class="guide-topbar">
      <div class="guide-progress-track"><div class="guide-progress-fill" id="guide-pf-it" style="width:0%"></div></div>
      <span class="guide-progress-text" id="guide-pt-it">0 / 3 aims revised</span>
      <button class="guide-print-btn" onclick="window.print()">&#128438; Print guide</button>
    </div>
    ${buildGuideGallery()}
    ${aimA}
    ${aimB}
    ${aimC}
    ${glossary}
  </div>
</div>`;
  }

  function updateProgress() {
    const revised = getRevised();
    const count = AIMS.filter(a => revised.includes(a)).length;
    const fill = document.getElementById('guide-pf-it');
    const text = document.getElementById('guide-pt-it');
    if (fill) fill.style.width = (count / AIMS.length * 100) + '%';
    if (text) text.textContent = count + ' / ' + AIMS.length + ' aims revised';
    AIMS.forEach(a => {
      const btn = document.getElementById('gmb-' + a);
      if (!btn) return;
      const done = revised.includes(a);
      btn.classList.toggle('revised', done);
      btn.innerHTML = done
        ? '<span class="guide-mark-icon">&#10003;</span> Aim ' + a + ' revised!'
        : '<span class="guide-mark-icon">&#9711;</span> Mark Aim ' + a + ' as revised';
    });
    AIMS.forEach(a => {
      const link = document.querySelector('.guide-toc-aim-link[onclick*="guide-aim-' + a + '"]');
      if (link) link.style.opacity = revised.includes(a) ? '.7' : '1';
    });
  }

  function setupScrollSpy() {
    const sections = document.querySelectorAll('.guide-aim-section[id]');
    if (!sections.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        document.querySelectorAll('.guide-toc-aim-link').forEach(l => {
          l.classList.toggle('active', !!(l.getAttribute('onclick') && l.getAttribute('onclick').includes(id)));
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => observer.observe(s));
  }

  window.toggleGT = function (id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('open');
  };
  window.toggleGuideRevised = function (aimLetter) {
    const revised = getRevised();
    const idx = revised.indexOf(aimLetter);
    if (idx > -1) revised.splice(idx, 1);
    else revised.push(aimLetter);
    saveRevised(revised);
    updateProgress();
  };
  window.guideScrollTo = function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: 'smooth' });
    setTimeout(() => { if (el.classList && el.classList.contains('guide-topic') && !el.classList.contains('open')) el.classList.add('open'); }, 350);
  };

  window.initComprehensiveGuide = function () {
    const host = document.getElementById('guide-comprehensive');
    if (!host) return;
    host.innerHTML = buildGuideHTML();
    updateProgress();
    setupScrollSpy();
  };
})();
