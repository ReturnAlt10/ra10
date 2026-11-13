/* BTEC Nationals IT (2016 specification, 20161K) — Unit 14: IT Service Delivery — comprehensive revision guide.
   NOT the AAQ IT qualification. Content areas A–D follow the Pearson specification (Issue 6). Worked examples use the
   June 2024 Pearson scenario (Martlepool Coaches, a minibus and coach hire company) and only the facts given in that brief.
   Examiner advice is paraphrased from the Pearson Lead Examiner reports, June 2018 – June 2024. */
(function () {
  'use strict';
  const { svg: S, h: H, P } = window.BizGuide;
  const { key, tip, warn, fig, table, ul, formula, example, steps, cards, stats, check, two, unsplash } = H;

  // A simple annotated network diagram (raw SVG; text inherits the theme colour).
  function networkSvg() {
    const box = (x, y, w, h, t, col, sub) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${col}" fill-opacity=".14" stroke="${col}" stroke-width="1.6"/>` +
      `<text x="${x + w / 2}" y="${y + (sub ? h / 2 - 3 : h / 2 + 4)}" font-size="12" font-weight="700" text-anchor="middle">${t}</text>` +
      (sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 12}" font-size="10" text-anchor="middle" opacity=".8">${sub}</text>` : '');
    const ln = (x1, y1, x2, y2, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-opacity=".55" stroke-width="2"${dash ? ' stroke-dasharray="6 5"' : ''}/>`;
    let s = '';
    s += box(270, 8, 160, 40, 'Internet (ISP)', P.slate, 'fibre broadband + 4G backup');
    s += ln(350, 48, 350, 70);
    s += box(255, 70, 190, 40, 'Router + firewall', P.red, 'rules, VPN for remote access');
    s += ln(350, 110, 350, 132);
    s += box(250, 132, 200, 40, 'Managed PoE switch', P.blue, 'server room · VLANs');
    s += ln(350, 172, 80, 200); s += ln(350, 172, 230, 200); s += ln(350, 172, 380, 200); s += ln(350, 172, 530, 200); s += ln(350, 172, 640, 200);
    s += box(10, 200, 140, 52, 'Server + NAS', P.violet, 'bookings, files, backup');
    s += box(160, 200, 140, 52, 'General office', P.teal, '3 desktops + laptop');
    s += box(310, 200, 140, 52, 'Managers’ offices', P.teal, '2 desktops');
    s += box(460, 200, 140, 52, 'Depot WAPs', P.green, 'tablets for workshop');
    s += box(610, 200, 80, 52, 'NVR', P.amber, 'IP cameras');
    s += ln(80, 252, 80, 278, true);
    s += box(10, 278, 140, 40, 'Cloud backup', P.slate, 'off-site copy');
    s += ln(530, 252, 530, 278, true);
    s += box(440, 278, 180, 40, 'Drivers’ phones/tablets', P.green, '4G + app via VPN');
    return `<svg viewBox="0 0 700 326" role="img" aria-label="Annotated network diagram for a coach hire company" style="width:100%;max-width:700px;height:auto;font-family:inherit" fill="currentColor">${s}</svg>`;
  }

  function setTask() {
    const bars = S.bars([['A1 Strategy', 8, P.blue], ['A2 Catalogue', 8, P.blue], ['A3 Solution', 20, P.violet], ['A4 Evaluation', 12, P.teal], ['A5 Implications', 16, P.amber], ['Technical language', 4, P.slate]], { w: 700, h: 270, max: 22, unit: 'Marks (68 in total)', label: 'Marks for each activity' });
    return `
<div class="guide-aim-hd"><div class="guide-aim-badge">★</div><div><div class="guide-aim-title">The assessment: a set task in two parts</div><div class="guide-aim-subtitle">BTEC Nationals IT (2016 specification, 20161K) · Extended Diploma mandatory unit · not the AAQ · 68 marks</div></div></div>
<div class="g-set-hero">${S.hero('Identify. Design. Evaluate. Manage.', 'You are the IT consultant: turn a business brief into a prioritised strategy, a service catalogue, a full solution design, an evaluation and an implications report.', ['gear', 'shield', 'chart'], P.violet)}</div>
${stats([['68', 'marks'], ['5', 'activities'], ['8 h', 'Part B (supervised)'], ['3 h', 'Part A research']])}
${key('Which qualification is this?', 'Unit 14 belongs to the <strong>Pearson BTEC Level 3 National Extended Diploma in Information Technology (2016 specification, 20161K)</strong>, the “outgoing” Nationals that are being withdrawn. It is <strong>not</strong> part of the new BTEC AAQ in IT. If your course is the AAQ, use RA10’s IT AAQ units instead.')}
<h4>How the task works</h4>
${steps(['<strong>Part A (two weeks before):</strong> a short brief naming the sector and three future developments. Research for up to 3 hours. No marks, but you may take <strong>two sides of A4 notes</strong> into Part B.', '<strong>Part B (8 supervised hours, no internet):</strong> the full scenario (staff and their duties, premises and current IT, future developments), then five activities typed on a computer and saved as PDFs.', '<strong>Templates:</strong> Activity 1 (Outline_Service_Strategy.rtf), Activity 2 (Define_IT_Service_Catalogue.rtf) and Activity 5 (IT_Service_Management_Implications.rtf).', '<strong>Marking:</strong> each activity is judged as a whole against a band grid. The examiner looks at every trait, chooses the best-fit band, then a mark within it. A further 4 marks are for technical language across the task.'])}
${fig(bars, 'Activity 3 (the solution design) is worth 20 of the 68 marks. Activities 3 and 5 together are more than half the task.')}
${fig(S.flow([['A1 Strategy', '1 hour'], ['A2 Catalogue', '1 hour'], ['A3 Solution', '3 hours'], ['A4 Evaluation', '1½ hours'], ['A5 Implications', '1½ hours']], { w: 700, h: 84, label: 'Suggested Part B timings' }), 'The suggested times are printed in the task booklet and add up to the 8 hours.')}
<h4>What each activity needs for the top band</h4>
${table(['Activity', 'Top band', 'What earns it'], [
  ['1 Outline IT service strategy (8)', '7–8', 'Comprehensive, accurate requirements from the scenario; appropriate priorities (high/medium/low) with a clear rationale; logical reasoning; full awareness of the scenario.'],
  ['2 IT service catalogue (8)', '7–8', 'Services fully appropriate for every function; accurate names and descriptions; clear and concise for a non-IT specialist.'],
  ['3 IT service delivery solution (20)', '16–20', 'Fully maps the solution; accurate, in-depth technical understanding; comprehensive data AND information; how hardware AND software implement it and support users; perceptive awareness of the scenario.'],
  ['4 Management report evaluating the solution (12)', '10–12', 'Developed, convincing justification; appropriate alternatives for a range of aspects; a valid, supported rationale; coherent reasoning; full awareness of the scenario.'],
  ['5 IT service management implications (16)', '13–16', 'Wide-ranging, appropriate implications; comprehensive, realistic capacity to respond to change; coherent reasoning.'],
  ['Technical language (4)', '4', 'Appropriate and consistent technical language used throughout all five activities.']])}
<h4>Your two sides of Part A notes</h4>
${check(['Typical job roles in the sector and the hardware and software each needs (including specialist/bespoke software).', 'How each of the three future developments works: devices, software, data, security, cost and legal points.', 'Data and information each role uses: what is recorded, where it is stored and who sees it.', 'The legislation that applies (data protection, computer misuse, copyright, health and safety/DSE, WEEE) and what it means in practice.', 'A short list of alternatives for key items (e.g. cloud v on-site server, laptops v tablets), with pros and cons.'])}
${warn('Lead Examiner reports, every series: weaker answers were <strong>generic</strong>. They could have been written for any organisation. They left out software or data, ignored the future developments, or wrote an evaluation in Activity 5. Use the names, roles, rooms and devices in the brief in every activity.', 'What loses marks')}
${tip('The paper will always contain the same five activities. Only the sector changes, so practise on several past scenarios. Write in the first person (“I have chosen…”). Examiners have warned that “we” can suggest the work was not done independently.')}`;
  }

  /* ───────────── A Contextual factors ───────────── */
  const a1 = `
<p>An <strong>IT service</strong> is any activity or process an organisation performs that needs an IT system to achieve its aims: email, e-commerce, printing, collaboration, design tools, automated manufacturing. The <strong>IT service life cycle</strong> is a methodology for identifying, defining, planning and evaluating a solution to meet an organisation’s IT service needs.</p>
${fig(S.cycle([['Service identification', 'strategy · prioritised needs · outline catalogue'], ['Service delivery design', 'technical requirements · plan the solution'], ['Service management', 'review · alternatives · impact · improve']], { center: 'IT service life cycle', label: 'The IT service life cycle', h: 300 }), 'The three stages of the life cycle in the Unit 14 specification. Service management feeds back into identification: it is continual.')}
${table(['Stage', 'What it involves', 'Set-task activity'], [['Service identification', 'An outline IT service strategy; identifying and prioritising the needs of the organisation, users and customers; an outline IT service catalogue', 'Activities 1 and 2'], ['Service delivery design', 'Defining the technical requirements and planning a solution to meet the needs', 'Activity 3'], ['Service management', 'Benefits and drawbacks; alternatives and justification; impact of implementation and operation; evaluating success and justifying improvements', 'Activities 4 and 5']])}
<h4>Project methodologies</h4>
<p>The life cycle can be applied within several project management methodologies:</p>
${cards([['PRINCE2', 'PRojects IN Controlled Environments: defined stages, roles and a business case; changes are controlled.', P.navy], ['Waterfall', 'Sequential phases (requirements → design → build → test → deploy). Clear plan; hard to change late.', P.blue], ['Agile', 'Short iterations (sprints) with frequent user feedback; requirements can change.', P.teal], ['RAD', 'Rapid application development: build prototypes fast, test with users, refine.', P.green], ['Lean', 'Remove waste: steps that add no value for the customer.', P.amber]], 3)}
<h4>Why it matters: key benefits</h4>
${fig(S.tiles([['Standards', 'adherence to standards'], ['Automation', 'automated processes'], ['Continuity', 'availability of service'], ['Customers', 'attraction and retention'], ['Disaster recovery', 'prevention and recovery'], ['Integrity', 'data/system integrity, productivity'], ['Interoperability', 'systems work together'], ['Security', 'optimised security'], ['Lower costs', 'reduced operational costs'], ['Simplicity', 'simpler processes']], { cols: 5, th: 76, w: 700, label: 'Benefits of the IT service life cycle' }), 'The ten benefits listed in the specification. Use them to justify priorities (Activity 1) and to judge appropriateness (Activity 4).')}
<h4>Key staff</h4>
${table(['Role', 'Part in the life cycle'], [['Architect', 'Designs the overall structure: how hardware, software, networks and data fit together'], ['Developer', 'Builds or customises software, e.g. a booking app'], ['Project manager', 'Plans resources, time and budget; manages risks and change'], ['Technician', 'Installs, configures and maintains hardware, software and networks'], ['Service desk personnel', 'First point of contact: log, prioritise, resolve or escalate incidents and requests']])}`;

  const a2 = `
<p>Organisations provide a <strong>service</strong> (coach hire, care, hospitality), a <strong>product</strong> (pottery, machinery) or both. Their <strong>priorities</strong> drive their IT: the process that earns the money or keeps people safe gets the highest priority.</p>
${table(['Function', 'Typical IT services', 'Example from a coach hire company'], [
  ['Delivering services', 'Booking/scheduling system, customer accounts', 'Bookings for minibuses, coaches and short breaks'],
  ['Supply chain', 'Stock control, online ordering with suppliers', 'Spare parts for repairs and servicing'],
  ['Marketing and sales', 'Website/CMS, social media tools, email marketing', 'Marketing Assistant promoting trips; social media (future)'],
  ['Customer relations', 'Customer database, online booking app, email/SMS', 'Booking app (future), confirmations, feedback'],
  ['Resource management', 'Asset/fleet records, servicing and fault logs', 'Workshop Manager monitors servicing and faults'],
  ['Staff recruitment and management', 'HR records, rota software, e-learning', 'Office Manager organises drivers’ rota'],
  ['Support and finance', 'Accounts and payroll software, payments, help desk', 'Payments, payroll, IT support contract']])}
${tip('In Activity 2, organise your catalogue by these functions or by the job roles in the brief. The Lead Examiner marked down catalogues that followed neither.')}`;

  const a3 = `
<p>To define requirements, draw on the organisation’s <strong>purpose and type</strong>, <strong>aims and goals</strong>, <strong>customer experience</strong> (what it provides, customers’ needs and expectations, how the service is delivered and consumed), <strong>staff</strong> (needs, working styles and patterns, e.g. shifts, casual staff, staff on the road) and <strong>location</strong> (staff, customers, premises, delivery points).</p>
<h4>Diagrams that represent requirements</h4>
${cards([['Functional chart', 'Who does what and who reports to whom: one catalogue row per role.', P.blue], ['Data flow diagram', 'Sources, processes, data stores and flows, with arrows showing direction.', P.teal], ['Building/floor plan', 'Rooms and floors: where devices, cabling, WAPs and cameras go.', P.green], ['Network diagram', 'Internet, router/firewall, switches, server, WAPs, devices per room.', P.violet]], 4)}
<h4>Contextual factors</h4>
${ul(['<strong>User and customer needs and expectations</strong>, e.g. book online at any time; real-time availability.', '<strong>Changes in demand</strong> and <strong>scalability</strong>, e.g. seasonal staff and casual drivers.', '<strong>Moral and ethical issues</strong>: monitoring staff, privacy (e.g. vehicle tracking of staff), environmental impact, freedom of speech/censorship, and the purpose, content and enforcement of an <strong>acceptable use policy</strong>.', '<strong>Security</strong>, <strong>developments in technology</strong> and <strong>accepted ways of working</strong>.'])}
<h4>Legislation you must apply</h4>
${table(['Legislation', 'What it means for the solution'], [
  ['Computer misuse (Computer Misuse Act 1990)', 'Unauthorised access, access with intent to commit further offences and acts impairing a computer are offences. Justifies passwords, access levels, logging and security software.'],
  ['Copyright, Designs and Patents Act 1988', 'Software and content need licences. Keep a licence register; no unlicensed copies; images on the website must be licensed.'],
  ['Data protection (Data Protection Act 2018 / UK GDPR)', 'Personal data (customers, staff) processed lawfully, kept secure and accurate, only as long as needed; report serious breaches to the ICO within 72 hours.'],
  ['Telecommunications and interception of communications; investigatory powers and lawful business practice regulations', 'Rules on communications networks and interception. Monitoring staff email or calls on company systems must be for legitimate purposes and staff must be told.'],
  ['Health and Safety at Work etc. Act 1974 and DSE regulations', 'Safe equipment and cabling; workstation assessments, breaks/changes of activity, eye tests on request for screen users.'],
  ['WEEE regulations', 'Old IT equipment must be recycled through an approved route. Wipe data from drives first.']])}
${warn('“An alternative to following the legislation is not to follow it” appears in the Lead Examiner reports as an answer that earns nothing. Legislation is a constraint you must meet. Alternatives are other <em>legal</em> ways of meeting it.')}`;

  /* ───────────── Activity 1 worked example (A) ───────────── */
  const a4 = `
<p>Activity 1 uses the template with two tables, <strong>Company Needs</strong> and <strong>Customer Needs</strong>. In each row you write an IT service requirement and an explanation of its priority (high, medium or low). The task bullets also ask you to consider employees, so link requirements to staff roles.</p>
${example('Martlepool Coaches (June 2024): three strong rows', table(['IT service requirement', 'Priority and rationale'], [
  ['Booking and scheduling system for minibuses, coaches and short breaks (bespoke booking software on the server, used by the two Administration Assistants)', '<strong>High.</strong> Bookings are how the company earns revenue; without them vehicles and drivers cannot be allocated. It also supplies the future customer app.'],
  ['Replacement desktops for the General Manager, Office Manager, Workshop Manager and two Administration Assistants; laptop for the Marketing Assistant', '<strong>High.</strong> The current IT is old and outdated, and every administrative and finance task depends on these devices.'],
  ['Security cameras for the depot and offices with remote viewing (future development)', '<strong>Medium.</strong> Protects vehicles and premises out of hours, but the business can operate without it in the short term. It needs a network video recorder and secure remote access.']]))}
${table(['Lead Examiner: requirements expected for Martlepool Coaches', ''], [['Hardware', 'Desktops for General Manager, Workshop Manager, Office Manager and Admin Assistants (2); laptop for the Marketing Assistant; no tablets at present; server, router, access points, printers'], ['Security', 'e.g. secure server room, firewall'], ['Software', 'Office software, stock control, ordering, servicing records, fault logging, rota management, payroll'], ['Other', 'The website; staff and customer needs; the three future developments (cameras with remote viewing, booking app, social media)']])}
${warn('Common Band 1 problems: generic requirements with no link to the hire company; computer systems, servers or switches left out; no bespoke software; illogical priorities (e.g. antivirus or EPOS as “low”).')}`;

  /* ───────────── B IT service delivery design ───────────── */
  const b1 = `
<p>An <strong>IT service catalogue</strong> defines each service for each function of the organisation. The template has three columns: <strong>Function</strong>, <strong>Service name</strong> and <strong>Service description</strong>. The description covers <em>what needs to be achieved</em>, <em>the information and data required (and by whom)</em> and <em>the technologies required</em>.</p>
${example('Two catalogue rows for Martlepool Coaches', table(['Function', 'Service name', 'Service description'], [
  ['Workshop (Workshop Manager, Mechanics)', 'Vehicle servicing and fault log', 'Records each minibus’s and coach’s servicing dates and reported faults so repairs are planned and vehicles are safe. Data: vehicle ID, mileage, fault, date, mechanic, parts used. Used by drivers (report), mechanics (update) and the Workshop Manager (monitor). Technology: fleet-maintenance software on the server; tablets on depot Wi-Fi.'],
  ['Administration (Administration Assistants)', 'Booking and payments', 'Takes and confirms hire and short-break bookings and records payments. Data: customer details, dates, vehicle, driver, price, payment status. Used by Administration Assistants; reports to the General Manager. Technology: booking software, card payment terminal, secure server/cloud database.']]))}
${check(['A row for every role or function in the brief, including drivers, cleaners and mechanics.', 'Current AND future services (e.g. the booking app, social media management, camera monitoring).', 'Plain English that a non-IT manager would understand.', 'Only IT services: no spanners, vans or security guards.'])}`;

  const b2 = `
<p>Every requirement has <strong>benefits and constraints</strong>: technology, costs, environmental, ethical, legal, location, moral, risks, scalability, security and sustainability. When you design, weigh the options against these.</p>
<h4>Choosing hardware and software (B4)</h4>
${table(['Factor', 'Question to ask', 'Example'], [['Availability', 'Can it be bought and supported now?', 'Fleet software with UK support'], ['Cost', 'Up-front and running costs (licences, subscriptions, support)?', 'Cloud subscription v buying a server'], ['Connectivity', 'Does it work where staff are?', 'Wi-Fi in the depot; 4G for drivers'], ['Capacity', 'Enough storage, users and processing?', 'Camera footage needs large storage'], ['Ease of use/usability', 'Can non-IT staff use it?', 'Touch-screen tablets for mechanics'], ['Features', 'Does it do the specific tasks?', 'Rota software that sends shifts to phones'], ['Privacy', 'Does it protect personal data?', 'Encrypted customer records'], ['Scalability', 'Will it cope with growth?', 'Extra licences for casual staff']])}
<h4>Managing IT service delivery</h4>
${ul(['<strong>Asset management</strong>: an asset register; analyse utilisation (are devices used efficiently?).', '<strong>Updates and upgrades</strong>: patch management, tested and scheduled.', '<strong>Installation/deployment</strong>: when, by whom, minimum disruption.', '<strong>Security</strong>: physical (locked server room, access control), traditional, mobile and cloud risks, security software.', '<strong>Legislation, ethics and staff training</strong>.', '<strong>Customer support</strong> and the effect of user problems and equipment faults.', '<strong>Responding to change</strong>: new services, network expansion, emerging technology, new legislation, security and privacy issues.'])}`;

  const b3 = `
<p>Activity 3 is worth <strong>20 marks</strong>. The design must cover <strong>information requirements</strong>, <strong>data requirements</strong>, <strong>hardware and software service options</strong> and <strong>managing infrastructure and users</strong>, using a combination of written, tabular and annotated diagram evidence.</p>
${fig(networkSvg(), 'An annotated network diagram for a coach hire company. Show the internet link, security devices, every location and clear connections. The Lead Examiner marked down diagrams with no internet connection, unclear lines or no IT in the workshop.')}
${example('Information and data table (extract)', table(['Role', 'Information needed', 'Data items', 'Stored in'], [
  ['Administration Assistants', 'Which vehicles and drivers are free on a date', 'Booking ID, customer name and contact, dates, vehicle ID, driver ID, price, payment status', 'Booking database on the server'],
  ['Workshop Manager', 'Vehicles due for service; open faults; parts below re-order level', 'Vehicle ID, last service date, mileage, fault description, part number, quantity in stock, re-order level', 'Fleet-maintenance and stock database'],
  ['Office Manager', 'Drivers’ rota for the week; payroll totals', 'Staff ID, shifts, hours worked, rate of pay, tax code', 'Rota and payroll software (access-restricted)']]))}
${check(['Hardware for every role and room (from the premises list), and the new devices the future developments need.', 'Named types of software for every process, including bespoke systems (booking, fleet maintenance, rota, payroll, CMS for the website).', 'Data AND information, linked to the roles.', 'Managing infrastructure and users: accounts and access levels, AUP, backup (3-2-1), updates, antivirus/firewall, UPS, support/SLA, asset register.', 'How the solution supports users, e.g. training and help desk.'])}
${warn('Both hardware AND software are required. One Lead Examiner report notes that when software is left out, the hardware/software trait cannot go beyond Band 1. Organisation charts and Gantt charts earn no credit in Activity 3.')}`;

  const b4 = `
<p>Activity 4 is a <strong>management report</strong> that evaluates the appropriateness of <em>your</em> Activity 3 solution against the organisation’s current and future requirements. It must include an assessment of appropriateness, a comparison with alternatives and a rationale.</p>
${steps(['Restate the key requirements from the brief (roles, current problems, the three future developments).', 'For each part of your solution, say how well it meets them. Can every role do their job? What are the limitations, and how could they be reduced?', 'For a <strong>range</strong> of aspects, give a genuine <strong>alternative</strong> and compare it on cost, security, scalability, usability, reliability and support.', 'Give a supported <strong>rationale</strong> for choosing your solution, using several arguments, not only cost.'])}
${table(['Aspect', 'Valid alternative', 'Not credited'], [['Office devices', 'Laptops with docks instead of desktops', 'Staff bringing their own devices (BYOD)'], ['File/booking server', 'Cloud database/SaaS booking system', 'No server at all with no rationale'], ['Security cameras', 'Cloud-managed cameras instead of an NVR', 'An alternative to having cameras at all'], ['Legislation', 'A UK-hosted provider to simplify data protection compliance', 'Not following the law'], ['Driver devices', 'Rugged tablets instead of phones', 'Listing an extra device as an “alternative”']])}
${tip('Lead Examiner: it is better to discuss alternatives in detail for a range of aspects than to list many alternatives superficially. Evaluate the whole solution, not just the future developments.')}`;

  /* ───────────── C Information and data ───────────── */
  const c1 = `
<p>Organisations use information at three levels. Each level needs different detail, timing and sources.</p>
${fig(S.pyramid([['Operational', 'Day-to-day, detailed: today’s bookings, jobs, stock to pick'], ['Management', 'Short-term planning: weekly rota, monthly servicing plan'], ['Strategic', 'Long-term, summarised: whether to buy more coaches']], { label: 'Levels of information' }), 'Strategic information is often summarised and includes external data. Operational information is detailed and current.')}
${table(['Why information is used', 'Example'], [['Defining the scope of a customer’s needs', 'Number of passengers, dates and pick-up points for a hire'], ['Managing day-to-day tasks and services', 'Job list for mechanics; cleaning rota'], ['Ensuring continuation of service/product', 'Servicing alerts so vehicles stay roadworthy'], ['Identifying and planning improvements', 'Booking trends to set policy or prices'], ['Communication', 'Rota sent to drivers’ phones; booking confirmations to customers']])}
<p><strong>Sources of information</strong>: customers/clients (bookings, feedback), the IT support team (fault logs, metrics), management/team leaders (rotas, reports) and other staff (fault reports, timesheets).</p>`;

  const c2 = `
<p><strong>Data</strong> is raw facts with no context (“14”, “08:30”, “BK2231”). <strong>Information</strong> is data that has been processed and given meaning (“Booking BK2231: 14 passengers, pick-up 08:30”). An IT solution must capture the right <em>data</em> so that it can produce the <em>information</em> each level needs.</p>
${fig(S.tiles([['Volume', 'quantity of data generated, e.g. camera footage'], ['Velocity', 'speed of generation, e.g. GPS positions every few seconds'], ['Variety', 'mix of types: text, images, video, sensor readings']], { cols: 3, th: 84, w: 700, label: 'The three Vs of data' }), 'Use the three Vs to justify storage, bandwidth and processing in Activity 3.')}
${ul(['Define the scope of data needs by: sector and type, size, products/services, aims, customers, staff, location and operational tasks.', 'Data at each level: operational data must be accurate and current; strategic data may be aggregated over years.'])}
${warn('“Without data having been identified, none of the processes can take place” (Lead Examiner). A design that lists only information outputs stays in the lower bands for the data trait.')}`;

  /* ───────────── D Facilitating IT service delivery ───────────── */
  const d1 = `
${table(['Software service', 'Example in a small organisation'], [['Communication', 'Email, messaging, VoIP'], ['Collaboration', 'Shared calendars and documents'], ['Virtualisation and containerisation', 'Several virtual servers on one host'], ['Product production / service provision', 'Booking or fleet-maintenance software'], ['Financial transactions', 'Card payments, online payments, accounts'], ['File storage and transfer', 'File server, cloud storage, secure transfer'], ['Platform/service hosting', 'Website hosting, SaaS applications'], ['Productivity', 'Office suite'], ['Remote access', 'VPN, remote desktop'], ['Creativity and innovation', 'Design tools, social media content'], ['Customer access', 'Website, booking app'], ['Data collection and analysis', 'Reports, dashboards, metrics']])}
${cards([['Operating systems', 'Manage hardware and run applications (desktop, server, mobile).', P.blue], ['Utility software', 'Maintain and protect: antivirus, backup, compression.', P.teal], ['Application software', 'Do the user’s task, including content management systems and expert systems.', P.violet]], 3)}
${two(`<h4>Open source</h4>${ul(['Free licence; code can be customised', 'Community support or paid contractors', 'Needs in-house expertise for customisation and fixes'])}`, `<h4>Proprietary</h4>${ul(['Licence or subscription cost', 'Vendor support, tested updates, training', 'Less customisation; risk of vendor lock-in'])}`)}
<p>Judge either type against <strong>customisation, expertise, functionality, deployment, interoperability, performance, scalability, stability and support</strong>.</p>`;

  const d2 = `
<p>Hardware forms the whole infrastructure: end-user devices, servers and storage, network devices and connectivity between sites, staff and customers.</p>
${table(['Factor group', 'Points to consider'], [['User factors', 'Number and location of users; user experience (ease of use, performance, availability, accessibility); user needs'], ['Organisational factors', 'Size; geographical spread; layout of buildings; tasks; future developments and diversification'], ['Technological factors', 'Emerging technology; existing equipment, infrastructure and software; capacity; maintenance'], ['General factors', 'Customer expectations, security, budget, connectivity, cost, efficiency, implementation (timescales, testing, migration), productivity, scalability']])}
${example('Matching devices to roles', ul(['<strong>Mechanics</strong>: rugged tablet on depot Wi-Fi to update service and fault records at the vehicle.', '<strong>Drivers</strong>: smartphone/tablet app (4G) to report faults and see rotas; never used while driving.', '<strong>Administration</strong>: desktops with dual screens, card terminal, networked printer.', '<strong>Security</strong>: IP cameras on PoE recording to an NVR, with secure remote viewing for the General Manager.']))}`;

  const d3 = `
<p>Managing an IT service delivery solution means planning for users, customers, product/service delivery, assets, change, incidents and <strong>performance metrics</strong> (collection and analysis).</p>
${table(['In-house v external provision', 'In-house', 'External (cloud/managed)'], [['Cost', 'Up-front hardware and staff', 'Ongoing subscription/contract'], ['Availability', 'Depends on own staff and kit', 'Set by the SLA'], ['Scalability', 'Buy more hardware', 'Add users/storage quickly'], ['Data', 'Stays on site under your control', 'Legal ownership and jurisdiction; data may be held in other countries'], ['Implementation', 'Install and configure locally', 'Migrate data; depends on internet link']])}
${formula('SLA availability', 'Downtime allowed = (100% − availability) × hours in the period', '99.9% over a year: 0.1% × 8,760 h = 8.76 h')}
<h4>Activity 5: the implications report</h4>
<p>The template has four areas: <strong>implementing your solution and delivering services and products</strong>, <strong>managing and supporting staff</strong>, <strong>managing and supporting customers</strong>, and <strong>managing IT assets</strong>. For each one, think about constraints (legal requirements, security issues, resource limitations) and changes in the organisation’s aims, products and services.</p>
${table(['Area', 'Implications to analyse'], [['Implementing and delivering', 'Installation timing (e.g. on a quiet day), downtime, data migration, testing, running old and new systems in parallel, cost and budget'], ['Staff', 'Training, support/help desk, AUP and passwords, DSE assessments, casual staff accounts, monitoring and privacy'], ['Customers', 'New booking app, data protection and consent, payment security, support for customers, accessibility'], ['IT assets', 'Asset register, warranties, updates and licences, maintenance contract, secure disposal (WEEE)']])}
${key('Capacity to respond to change', 'This trait was weak in many scripts. Explain how each future development fits the solution (e.g. the booking app uses the same cloud booking database), and how the solution copes with growth, seasonal peaks, new legislation and new technology.')}
${warn('Lead Examiner: learners should understand the implications of installing or upgrading a system, such as downtime, training and cost, so they do not produce a second evaluation in Activity 5.')}`;

  window.BIZ_GUIDE_DATA = {
    storeKey: 'ra10-guide-revised-IT16-u14', unitLabel: 'Unit 14 Guide', aimWord: 'Content area', aims: ['A', 'B', 'C', 'D'], setTaskTitle: 'The assessment',
    titles: { A: 'Contextual factors driving IT needs and services', B: 'IT service delivery design', C: 'Information and data requirements', D: 'Facilitating IT service delivery' },
    subtitles: { A: 'The IT service life cycle, purpose and functions, service identification, legislation, and the Activity 1 strategy', B: 'The service catalogue, design considerations, the Activity 3 design and the Activity 4 evaluation', C: 'Strategic, management and operational information; data and the three Vs', D: 'Software and hardware service options, managing solutions, SLAs and the Activity 5 implications report' },
    setTask: setTask,
    topics: {
      A: [{ code: 'A1', name: 'IT service life cycle', html: a1 }, { code: 'A2', name: 'Purpose and functions of organisations', html: a2 }, { code: 'A3', name: 'Service identification and legislation', html: a3 }, { code: 'A★', name: 'Activity 1: outline IT service strategy', html: a4 }],
      B: [{ code: 'B1', name: 'Defining requirements: the IT service catalogue', html: b1 }, { code: 'B2', name: 'Considerations when defining and designing', html: b2 }, { code: 'B3', name: 'Designing an IT solution (Activity 3)', html: b3 }, { code: 'B4', name: 'Evaluating the solution (Activity 4)', html: b4 }],
      C: [{ code: 'C1', name: 'Information in an organisation', html: c1 }, { code: 'C2', name: 'Data in an organisation', html: c2 }],
      D: [{ code: 'D1', name: 'Software service options', html: d1 }, { code: 'D2', name: 'Hardware service options', html: d2 }, { code: 'D3', name: 'Managing solutions and change (Activity 5)', html: d3 }]
    },
    gallery: [
      { aim: '★', kicker: 'The task', title: 'Brief to solution', copy: 'Five activities, 68 marks, 8 hours.', image: unsplash('photo-1551288049-bebda4e38f71') },
      { aim: 'B', kicker: 'Design', title: 'Map the whole solution', copy: 'Hardware, software, data and users.', image: unsplash('photo-1460925895917-afdab827c52f') },
      { aim: 'D', kicker: 'Manage', title: 'Plan for change', copy: 'Support, training, assets and SLAs.', image: unsplash('photo-1552664730-d307ca884978') }
    ]
  };
})();
