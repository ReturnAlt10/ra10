/* BTEC Nationals IT (2016 spec, 20161K) Unit 14: IT Service Delivery — quiz (multiple choice and true/false). Not the AAQ. */
(function () {
  'use strict';
  const { M, TF } = window.__BIZ_B;
  /* A1 life cycle */
  M('A', 'IT service life cycle', 'Which is the FIRST stage of the IT service life cycle in Unit 14?', 'Service identification', ['Service management', 'Service delivery design', 'Service retirement'], 'Identify (strategy, needs, catalogue) → design → manage.');
  M('A', 'IT service life cycle', 'Producing an outline IT service catalogue belongs to which stage?', 'Service identification', ['Service delivery design', 'Service management', 'Disaster recovery'], 'Strategy, prioritised needs and the outline catalogue are all service identification.');
  M('A', 'IT service life cycle', 'Analysing alternative solutions and justifying improvements is part of…', 'service management', ['service identification', 'service delivery design', 'the Part A research'], 'Service management means continual review and refinement.');
  M('A', 'IT service life cycle', 'Defining the technical requirements of a solution is part of…', 'service delivery design', ['service identification', 'service management', 'asset disposal'], 'Design turns identified needs into a technical plan.');
  M('A', 'Project methodologies', 'Which methodology delivers work in short iterations with frequent user feedback?', 'Agile', ['Waterfall', 'PRINCE2', 'Lean'], 'Agile works in sprints/iterations.');
  M('A', 'Project methodologies', 'Which methodology completes each phase fully before the next begins?', 'Waterfall', ['Agile', 'RAD', 'Lean'], 'Waterfall is sequential.');
  M('A', 'Project methodologies', 'Which methodology focuses on building prototypes quickly for users to try?', 'Rapid application development (RAD)', ['Waterfall', 'PRINCE2', 'ITIL'], 'RAD uses prototyping and user feedback.');
  M('A', 'Project methodologies', 'Which methodology focuses on removing waste from processes?', 'Lean', ['Waterfall', 'RAD', 'PRINCE2'], 'Lean aims to cut anything that does not add value.');
  M('A', 'Project methodologies', 'PRINCE2 stands for…', 'PRojects IN Controlled Environments', ['PRocesses IN Computer Engineering', 'PRIority NEtwork Control 2', 'PRoject INitiation and Closure Evaluation'], 'A structured, controlled project method.');
  TF('A', 'Project methodologies', 'The IT service life cycle can only be used with the waterfall methodology.', false, 'The spec says it can be applied in PRINCE2, Agile, RAD, lean and waterfall.');
  M('A', 'Benefits', 'Which is a key benefit of applying the IT service life cycle listed in the specification?', 'Continuity and availability of service', ['Guaranteed zero cost', 'Removing the need for staff training', 'Avoiding all legislation'], 'Others: standards, automation, security, lower costs, simpler processes…');
  M('A', 'Key staff', 'Who is usually the first point of contact when a user reports a fault?', 'Service desk personnel', ['The IT architect', 'The project manager', 'The developer'], 'The service desk logs and resolves or escalates incidents.');
  M('A', 'Key staff', 'Who designs how hardware, software, networks and data fit together in a solution?', 'An IT architect', ['A service desk analyst', 'A receptionist', 'A technician only'], 'Architects design the overall structure.');
  /* A2 functions */
  M('A', 'Functions', 'A stock control system linked to suppliers mainly supports which function?', 'Supply chain management', ['Staff recruitment', 'Customer relations', 'Marketing'], 'Getting materials in and goods out.');
  M('A', 'Functions', 'A rota management system mainly supports…', 'staff management', ['manufacturing of products', 'financial transactions', 'customer access'], 'It schedules staff working patterns.');
  M('A', 'Functions', 'A customer database with booking history mainly supports…', 'customer relations', ['manufacturing', 'asset disposal', 'supply chain'], 'It lets staff serve and keep customers.');
  TF('A', 'Functions', 'IT service requirements should be driven by the priorities of the organisation.', true, 'Critical and revenue-earning processes come first.');
  /* A3 identification */
  M('A', 'Diagrams', 'Which diagram best shows where data moves between processes and stores?', 'Data flow diagram', ['Gantt chart', 'Organisation chart', 'Pie chart'], 'DFDs show sources, processes, stores and flows.');
  M('A', 'Diagrams', 'Which diagram helps place Wi-Fi access points and cameras in the right rooms?', 'Building/floor plan', ['Data flow diagram', 'Functional chart', 'Bar chart'], 'Floor plans show rooms and floors.');
  TF('A', 'Diagrams', 'In Activity 3, examiners give credit for a Gantt chart and a hierarchy chart.', false, 'The June 2023 report: no credit for the hierarchy diagram and Gantt chart, as they are not required.');
  M('A', 'Contextual factors', 'A seasonal business needs systems that can cope with peaks in demand. This is…', 'scalability', ['interoperability', 'censorship', 'containerisation'], 'Scalable systems grow and shrink with demand.');
  M('A', 'Ethics', 'Which document sets out how staff may use an organisation’s IT systems?', 'Acceptable use policy', ['Service-level agreement', 'Asset register', 'Data flow diagram'], 'An AUP sets rules and sanctions.');
  TF('A', 'Ethics', 'Monitoring staff activity raises privacy concerns, so it should be proportionate and explained to staff.', true, 'Monitoring and privacy are listed moral and ethical considerations.');
  /* Legislation */
  M('A', 'Legislation', 'Which Act makes unauthorised access to computer material an offence?', 'Computer Misuse Act 1990', ['Copyright, Designs and Patents Act 1988', 'Health and Safety at Work etc. Act 1974', 'WEEE Regulations'], 'Hacking and malware offences.');
  M('A', 'Legislation', 'Installing unlicensed copies of software breaks…', 'copyright legislation', ['the Computer Misuse Act only', 'DSE regulations', 'WEEE regulations'], 'Software is protected by the Copyright, Designs and Patents Act 1988.');
  M('A', 'Legislation', 'Under UK data protection law, a serious personal data breach must normally be reported to the ICO within…', '72 hours', ['24 hours', '7 days', '30 days'], 'Where feasible, within 72 hours of becoming aware of it.');
  M('A', 'Legislation', 'Which regulations require employers to assess workstations for staff who use screens regularly?', 'Display screen equipment (DSE) regulations', ['WEEE regulations', 'Lawful business practice regulations', 'Telecommunications regulations'], 'DSE: assessments, breaks, eye tests on request.');
  M('A', 'Legislation', 'Old computers must be disposed of through an approved route because of…', 'WEEE regulations', ['the Computer Misuse Act', 'copyright law', 'DSE regulations'], 'Waste electrical and electronic equipment.');
  M('A', 'Legislation', 'Which allows a business to monitor communications on its own systems for legitimate purposes if users are told?', 'Lawful business practice regulations', ['The Computer Misuse Act', 'WEEE regulations', 'Copyright legislation'], 'Monitoring for purposes such as preventing crime or checking standards.');
  TF('A', 'Legislation', 'Spreading malware is an offence under the Computer Misuse Act.', true, 'Unauthorised acts that impair a computer’s operation.');
  TF('A', 'Legislation', 'Data protection legislation only applies to large companies.', false, 'It applies to any organisation that processes personal data.');
  TF('A', 'Legislation', 'Under data protection principles, personal data should be kept no longer than necessary.', true, 'Storage limitation.');
  /* B1 catalogue */
  M('B', 'Service catalogue', 'Which is NOT part of a service description in the catalogue?', 'The learner’s Part A research notes', ['What needs to be achieved', 'The information and data required and by whom', 'The technologies required'], 'Description = purpose, information/data and who uses it, technologies.');
  M('B', 'Service catalogue', 'For the top band, service names and descriptions should be understood by…', 'a non-IT specialist', ['only IT technicians', 'Pearson examiners only', 'software developers'], 'Clear and concise for a non-IT specialist.');
  M('B', 'Service catalogue', 'Which entry would examiners NOT credit in an IT service catalogue?', 'A set of spanners for the mechanics', ['A fault-logging app for drivers', 'A rota system for the office manager', 'Payroll software'], 'Non-IT items show limited understanding.');
  TF('B', 'Service catalogue', 'The catalogue should cover current AND future IT requirements for each function.', true, 'The activity wording says current and future.');
  TF('B', 'Service catalogue', 'Inventing extra job roles that are not in the scenario improves the catalogue.', false, 'Examiners marked down invented roles such as “storage admin”.');
  /* B2/B3 */
  M('B', 'Designing a solution', 'Which is NOT one of the four required areas of the Activity 3 design?', 'A Gantt chart of the installation', ['Information requirements', 'Data requirements', 'Managing infrastructure and users'], 'The fourth is hardware and software service options.');
  TF('B', 'Designing a solution', 'If software is omitted from Activity 3, the hardware/software trait cannot go above Band 1.', true, 'Both hardware and software are required for Band 1 descriptors and above.');
  M('B', 'Designing a solution', 'Activity 3 evidence should be…', 'a combination of written, tabular and annotated diagrammatic information', ['a single paragraph', 'a presentation with speaker notes', 'a spreadsheet only'], 'From the task wording.');
  M('B', 'Network', 'Which device filters traffic between the internal network and the internet?', 'Firewall', ['Switch', 'Wireless access point', 'Printer'], 'A firewall applies rules to traffic.');
  M('B', 'Network', 'Which device connects the wired devices inside one office network?', 'Switch', ['Modem only', 'Firewall', 'Projector'], 'Switches forward frames between devices on the LAN.');
  M('B', 'Network', 'Which device gives Wi-Fi coverage in a workshop?', 'Wireless access point', ['Network video recorder', 'Firewall', 'UPS'], 'WAPs connect wireless devices to the LAN.');
  M('B', 'Network', 'Power over Ethernet (PoE) lets a camera…', 'receive power and data through one network cable', ['work without any network', 'store a year of video internally', 'bypass the firewall'], 'Useful where there is no socket.');
  M('B', 'Network', 'A UPS (uninterruptible power supply) protects a server by…', 'keeping it running briefly during a power cut so it can shut down safely', ['encrypting its data', 'blocking malware', 'backing up to the cloud'], 'Battery backup.');
  TF('B', 'Network', 'A network diagram in Activity 3 should show the internet connection.', true, 'A missing internet connection was criticised in June 2024.');
  /* B4 */
  M('B', 'Selecting hardware/software', 'Which is a factor in selecting hardware and software listed in B4?', 'Scalability', ['Colour of the casing', 'Learner preference', 'Brand loyalty'], 'Also availability, cost, connectivity, capacity, ease of use, features, privacy, usability.');
  M('B', 'Managing delivery', 'A record of every device, its location, owner and warranty is…', 'an asset register', ['an SLA', 'an AUP', 'a DFD'], 'Asset management.');
  M('B', 'Security', 'Which control most reduces the risk if a staff tablet is stolen?', 'Encryption plus remote wipe via mobile device management', ['A brighter screen', 'Turning off Bluetooth', 'A bigger battery'], 'Data is unreadable and can be erased.');
  M('B', 'Security', 'Multi-factor authentication requires…', 'two or more different types of evidence, e.g. password + code on a phone', ['two passwords', 'a longer username', 'a firewall'], 'Something you know/have/are.');
  M('B', 'Backup', 'The 3-2-1 backup rule means…', '3 copies of data, on 2 different media, 1 kept off-site', ['3 backups a day, 2 staff, 1 server', 'backup every 3 days for 2 weeks', '3 servers, 2 switches, 1 router'], 'A widely used guideline.');
  M('B', 'Backup', 'RAID 1 (mirroring) protects against…', 'a single hard drive failing', ['ransomware encrypting files', 'accidental deletion', 'fire in the building'], 'Both drives hold identical data — RAID is not a backup.');
  TF('B', 'Backup', 'RAID 1 removes the need for backups.', false, 'Deletion, corruption or ransomware are mirrored to both drives.');
  /* C information/data */
  M('C', 'Information levels', 'Long-term, summarised information used by directors is…', 'strategic', ['operational', 'management', 'raw data'], 'Strategic = long-term, organisation-wide.');
  M('C', 'Information levels', 'Today’s list of coaches to clean before hire is…', 'operational information', ['strategic information', 'management information', 'metadata'], 'Day-to-day actions.');
  M('C', 'Information levels', 'A weekly report of faults per vehicle used to plan servicing is…', 'management (tactical) information', ['strategic information', 'operational information', 'raw data'], 'Shorter-term planning by managers.');
  M('C', 'Data', 'Which is DATA rather than information?', '14, 08:30, BK2231', ['Booking BK2231 for 14 passengers at 08:30', 'Bookings rose 10% this month', 'Coach 4 is overdue for a service'], 'Raw values with no context.');
  M('C', 'The 3 Vs', 'The speed at which data is generated is…', 'velocity', ['volume', 'variety', 'validity'], 'The 3 Vs: volume, velocity, variety.');
  M('C', 'The 3 Vs', 'Text, images, sensor readings and video in one system show…', 'variety', ['velocity', 'volume', 'veracity'], 'The mixture of data types.');
  M('C', 'The 3 Vs', 'Ride sensors logging thousands of readings an hour mainly increase…', 'volume and velocity', ['variety only', 'neither', 'validity'], 'Lots of data, quickly.');
  TF('C', 'Data', 'Information is produced by processing data.', true, 'Data + context/processing = information.');
  TF('C', 'Data', 'In Activity 3 it is enough to list information outputs without the data items behind them.', false, 'Examiners: without data having been identified, none of the processes can take place.');
  /* D1 software */
  M('D', 'Software', 'Antivirus and backup programs are examples of…', 'utility software', ['operating systems', 'expert systems', 'CMS'], 'Utilities maintain and protect the system.');
  M('D', 'Software', 'Software that lets staff update a website through templates without coding is a…', 'content management system', ['compiler', 'expert system', 'hypervisor'], 'e.g. WordPress.');
  M('D', 'Software', 'An expert system is made up of a knowledge base and…', 'an inference engine', ['a hypervisor', 'a firewall', 'a switch'], 'The inference engine applies rules to reach advice.');
  M('D', 'Software', 'Running several virtual servers on one physical host uses…', 'a hypervisor (virtualisation)', ['containerisation only', 'RAID', 'a VPN'], 'Virtual machines each have their own OS.');
  M('D', 'Software', 'Containers differ from virtual machines because they…', 'share the host operating system kernel', ['each need their own physical server', 'cannot run applications', 'are hardware devices'], 'Lighter-weight than full VMs.');
  M('D', 'Software', 'Which is a typical advantage of proprietary software?', 'Vendor support and regular tested updates', ['Free access to the source code', 'No licence agreement', 'Unlimited free copies'], 'Open source gives code access; proprietary gives vendor support.');
  TF('D', 'Software', 'Open-source software always costs nothing to run.', false, 'Licences may be free, but support, training and expertise cost money.');
  M('D', 'Software', 'Bespoke software for coach bookings, servicing records and rotas is valued by examiners because it…', 'shows the solution is tailored to the scenario', ['is always cheaper', 'removes the need for hardware', 'avoids data protection law'], 'Generic “office software” alone was marked down.');
  /* D2 hardware */
  M('D', 'Hardware', 'Which device suits mechanics updating job cards in a workshop?', 'A rugged tablet on Wi-Fi', ['A desktop in the manager’s office', 'A projector', 'A fax machine'], 'Mobile, durable, at the point of work.');
  M('D', 'Hardware', 'An EPOS terminal differs from a basic till because it…', 'records each item and updates stock and sales data', ['only stores cash', 'cannot take card payments', 'needs no network'], 'Electronic point of sale.');
  M('D', 'Hardware', 'Remote viewing of security cameras is usually provided by…', 'IP cameras recording to an NVR with secure remote access', ['analogue cameras with no recorder', 'a printer', 'a UPS'], 'Network video recorder + app.');
  M('D', 'Connectivity', 'Which gives remote staff secure access to internal files over the internet?', 'A VPN', ['A switch', 'A CMS', 'WEEE'], 'An encrypted tunnel.');
  /* D3 managing */
  M('D', 'SLAs', 'A service-level agreement mainly sets out…', 'the service, availability and response times a provider guarantees', ['how staff may use the internet', 'where every device is located', 'the network diagram'], 'With penalties if targets are missed.');
  M('D', 'SLAs', '99.9% availability over a year (8,760 hours) allows about how much downtime?', '8.76 hours', ['87.6 hours', '0.876 hours', '24 hours'], '0.1% × 8,760 = 8.76.');
  M('D', 'In-house v external', 'A concern when customer data is stored in another country is…', 'legal jurisdiction and whether its data protection laws are adequate', ['the colour of the server', 'the number of switches', 'screen size'], 'Ownership, jurisdiction and protection of data.');
  TF('D', 'Change', 'Capacity to respond to change includes how the solution will cope with the planned future developments.', true, 'Examiners marked down reports that ignored the future developments.');
  /* Set task */
  M('A', 'Set task', 'How many marks is Unit 14 worth in total?', '68', ['64', '70', '90'], '64 for the five activities + 4 for technical language.');
  M('A', 'Set task', 'Which activity is worth the most marks?', 'Activity 3 – IT service delivery solution (20)', ['Activity 5 – implications (16)', 'Activity 4 – evaluation (12)', 'Activity 1 – strategy (8)'], '8 + 8 + 20 + 12 + 16.');
  M('A', 'Set task', 'How many sides of A4 notes from Part A may be taken into Part B?', 'Two', ['One', 'Four', 'Unlimited'], 'Two sides of individually prepared notes.');
  M('A', 'Set task', 'How long is the supervised Part B period?', '8 hours', ['3 hours', '2 hours', '12 hours'], 'Part A is up to 3 hours of research.');
  M('A', 'Set task', 'Which activities use Pearson templates?', 'Activities 1, 2 and 5', ['Activities 3 and 4', 'All five', 'None'], 'Strategy, catalogue and implications.');
  M('A', 'Set task', 'Technical language (4 marks) is assessed…', 'across all five activities', ['only in Activity 3', 'only in Part A', 'in a separate essay'], 'One grid for the whole task.');
  TF('A', 'Set task', 'Each activity is marked by adding separate marks for each trait.', false, 'Each activity is placed in ONE best-fit band holistically, then a mark within the band.');
  TF('A', 'Set task', 'Learners should write “I” rather than “we”, because “we” may suggest they did not work independently.', true, 'Lead Examiner, January 2023.');
  M('B', 'Activity 4', 'Which is an appropriate ALTERNATIVE in the Activity 4 report?', 'Cloud storage instead of an on-site file server', ['Ignoring data protection law', 'Expecting staff to bring their own laptops', 'Adding a second printer as well'], 'Alternatives replace part of the solution and must be appropriate.');
  M('B', 'Activity 4', 'Justification in the top band of Activity 4 uses…', 'a variety of arguments, not only cost', ['cost only', 'the learner’s opinion only', 'brand names only'], 'June 2024: a variety of arguments rather than relying on one aspect.');
  TF('B', 'Activity 4', 'Activity 4 should evaluate only the future developments.', false, 'Evaluate the WHOLE solution, including future developments.');
  M('D', 'Activity 5', 'Which belongs in Activity 5 rather than Activity 4?', 'Staff training and support needed when the system goes live', ['Why laptops are better than desktops', 'A rationale for rejecting an alternative', 'A comparison of two firewalls'], 'Activity 5 analyses implications; Activity 4 evaluates.');
  M('D', 'Activity 5', 'The four areas of the implications template are implementing/delivering, staff, customers and…', 'IT assets', ['marketing', 'competitors', 'Part A notes'], 'Managing the company’s IT assets.');
})();
