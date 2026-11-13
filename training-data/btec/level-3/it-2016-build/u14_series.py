"""BTEC Nationals IT (2016 spec, 20161K) Unit 14: IT Service Delivery — the Pearson set-task scenarios.

Transcribed by hand from the Pearson Part A and Part B booklets (source PDFs and extracted text live in the
git-ignored ../information-technology (outgoing)/ folder). Activity wording is NOT typed here: build_u14.py
extracts it from each paper's text so it matches the series exactly.

Block types (rendered by revision/btec/level-3/business/shared/biz-papers.js):
  h  heading · p  paragraph · li  bullet list · grid  table {head, rows} · fig  figure id (js/papers-figures.js)
Past-paper content © Pearson Education Ltd, reformatted by RA10 for revision.
"""

STD_RESEARCH = ['hardware requirements', 'software requirements', 'data and information requirements', 'relevant IT legislation.']


def part_a(sector, future, research=None, extra=None, org=None):
    """Part A research brief in the standard wording used from January 2019 onwards."""
    out = [
        {'t': 'h', 'x': 'Part A set task'},
        {'t': 'p', 'x': 'You are advised to spend a maximum of 3 hours doing your research.'},
        {'t': 'p', 'x': 'You will research the IT service delivery requirements that are relevant to the %s sector. '
                        'You should research similar organisations of this size and type in this sector and you should consider:' % sector},
        {'t': 'li', 'x': research or STD_RESEARCH},
        {'t': 'p', 'x': 'Specifically, for future developments, you may want to investigate the IT service delivery requirements of:'},
        {'t': 'li', 'x': future},
    ]
    if extra:
        out += extra
    out.append({'t': 'p', 'x': 'In Part B you will design and plan the IT service delivery solution for %s in relation to the IT service delivery life cycle. '
                               'You will be able to take two sides of individually prepared hard copy A4 research notes into Part B of the set task.' % (org or 'the organisation')})
    return out


def staff(rows):
    return {'t': 'grid', 'head': ['Staff', 'Responsibilities'], 'rows': [[r[0], ' · '.join(r[1])] for r in rows]}


SERIES = [
    # ───────────────────────────── June 2018 — Buckton Construction (civil engineering) ─────────────────────────────
    dict(id='U14-1806', key='2018-06', series='June 2018', title='Buckton Construction — civil engineering',
         src='*Part_B_Jun-2018.txt', sector='civil engineering',
         partA=[
             {'t': 'h', 'x': 'Set task brief (Part A)'},
             {'t': 'p', 'x': 'Buckton Construction is a civil engineering organisation with a Head Office in London. The organisation employs ten members of staff in the Head Office and other staff members who work remotely on construction sites.'},
             {'t': 'p', 'x': 'Typically the organisation would be managing two construction sites at any one time.'},
             {'t': 'p', 'x': 'In addition to the personnel based in the Head Office the organisation uses independent consultants for construction site roles. The consultants and the Head Office staff use a range of IT systems essential to the efficient running of the projects.'},
             {'t': 'p', 'x': 'Buckton Construction is not a real company but is meant to be representative of this type of construction company in the civil engineering world that you might want to investigate as part of your research.'},
             {'t': 'h', 'x': 'Part A set task'},
             {'t': 'p', 'x': 'You are advised to spend a maximum of 3 hours doing your research.'},
             {'t': 'p', 'x': 'You will research the IT service delivery requirements that are relevant to the civil engineering sector. You should research organisations of this type.'},
             {'t': 'p', 'x': 'During your research you should consider the roles of key personnel (other than the Estimator) and the hardware and software they would need to fulfil their job roles and communicate effectively across the organisation.'},
             {'t': 'p', 'x': 'In addition to the personnel based in the Head Office you should also research sector-specific personnel including:'},
             {'t': 'li', 'x': ['Site Manager', 'Site Engineer', 'Quantity Surveyor', 'Project Manager.']},
             {'t': 'p', 'x': 'Here is an example of the information for an Estimator:'},
             {'t': 'grid', 'head': ['Job role', 'Job description', 'Hardware and software'], 'rows': [[
                 'Estimator',
                 'Responsible for: initial calculations for materials, labour and equipment; initial project plan based on data gathered to estimate the requirements of the project (time, money, materials and labour).',
                 'Laptop · Computer Aided Design (CAD) software · spreadsheet software · word processing software · project management software · a ‘total station’ used with an Electronic Distance Measurement (EDM) tool to read slope distances · Global Positioning System (GPS) for accurate positioning of site locations · digital camera']]},
             {'t': 'p', 'x': 'For this type of organisation you should also research the:'},
             {'t': 'li', 'x': ['data and information requirements', 'communication structure and technologies', 'relevant IT systems legislation.']},
             {'t': 'p', 'x': 'Specifically for future developments, you may want to investigate the IT service requirements of:'},
             {'t': 'li', 'x': ['secure forms of file transfer for confidential information', 'a live video security feed for each site that can be viewed and controlled remotely', 'suitable portable devices that will allow users to communicate, record progress and access centrally stored data.']},
             {'t': 'p', 'x': 'In Part B you will design and plan the IT service delivery solution for Buckton Construction in relation to the IT service delivery life cycle. You will be able to take two sides of individually prepared A4 research notes into Part B of the set task.'},
         ],
         partB=[
             {'t': 'p', 'x': 'Buckton Construction is a civil engineering organisation with a Head Office in London. The organisation employs ten members of staff in the Head Office and other staff members who work remotely on construction sites.'},
             {'t': 'p', 'x': 'Typically the organisation would be managing two construction sites at any one time.'},
             {'t': 'p', 'x': 'They need a range of IT systems to store and manage information and data requirements of the organisation.'},
             {'t': 'p', 'x': 'Buckton Construction is not a real organisation but is meant to be representative of this type of construction organisation in the civil engineering world.'},
             {'t': 'p', 'x': 'Once a project has started contracts are issued to independent Estimators, Site Managers, Quantity Surveyors and Project Managers who all have their own specific job roles. They will require suitable technology to allow them to work at construction sites and in other locations.'},
             {'t': 'fig', 'id': 'u14-1806-org'},
             {'t': 'p', 'x': 'In the future Buckton Construction is looking to improve systems by providing the following additional services:'},
             {'t': 'li', 'x': ['a secure form of file transfer as the Managing Director is concerned about the amount of confidential business and individual information held',
                               'a live video security feed for each site that the Site Manager can view and control 24/7',
                               'suitable portable devices that will allow users to communicate, record progress and access centrally stored data.']},
         ]),

    # ───────────────────────────── January 2019 — Nizuk Care Home (care home) ─────────────────────────────
    dict(id='U14-1901', key='2019-01', series='January 2019', title='Nizuk Care Home — care home',
         src='*Unit_14_B_Jan-2019.txt', sector='care home',
         partA=part_a('care home', ['computer controlled access systems', 'access to e-Learning systems', 'IT systems to record petty cash and other small financial transactions.'], org='Nizuk Care Home'),
         partB=[
             {'t': 'p', 'x': 'Nizuk Care Home is based in a village in Wales with the head office in Cardiff. The care home employs 62 members of staff.'},
             {'t': 'p', 'x': 'Currently there are eight computers in the care home and the staff who have access to them include:'},
             {'t': 'li', 'x': ['Care Home Manager – 1 dedicated computer', 'Deputy Manager – 1 dedicated computer', 'Nursing staff – 1 shared computer', 'Senior care staff – 1 shared computer',
                               'Receptionist – 1 dedicated computer', 'Administrators – 2 dedicated computers', 'Maintenance Officer/Activity Coordinators – 1 shared computer.']},
             {'t': 'p', 'x': 'All computers are old and need to be replaced.'},
             {'t': 'p', 'x': 'Central servers are based at head office and are managed by IT Technicians. The computers based in the care home access data and applications from the central servers remotely.'},
             {'t': 'p', 'x': 'The home has three units for the 80 residents: Nursing Unit 40, Residential Unit 25, Dementia Unit 15. Either nurses or senior carers manage each unit. The Care Home Manager and Deputy Manager oversee the running of the care home.'},
             {'t': 'h', 'x': 'The care home has three floors'},
             {'t': 'grid', 'head': ['Floor / area', 'Facilities'], 'rows': [
                 ['Ground floor – front / back entrances', 'CCTV camera and signing-in books'],
                 ['Ground floor – reception area', 'CCTV recording and viewing equipment, two-way intercom with ability to unlock front and back entrance doors'],
                 ['Ground floor – Manager / Deputy’s office', 'Office space with PCs. Secure refrigeration room for storage of medication'],
                 ['Ground floor – training room', 'Projector and screen'],
                 ['Ground floor – nursing unit', '20 bedrooms. Nurses’ station with PC, photocopier / printer / scanner / fax machine. A secure refrigeration area for storage of medication'],
                 ['Ground floor – dementia unit', 'Self-contained secure unit with 15 bedrooms. Senior carers’ station with PC'],
                 ['First floor – nursing unit', 'Nurses’ station and 20 bedrooms'],
                 ['First floor – residential unit', 'Senior carers’ station and 25 bedrooms'],
                 ['Second floor – administrators’ office', 'Office space with PCs, photocopier / printer / scanner / fax machine'],
                 ['Second floor – Maintenance Officer / Activity Coordinators', 'Office space with PC']]},
             {'t': 'p', 'x': 'Nizuk Care Home is not a real organisation but is meant to be representative of this type of facility in the care home sector.'},
             {'t': 'h', 'x': 'Nizuk Care Home'},
             {'t': 'p', 'x': 'Location: Wales. Number of staff – 62: Manager (1), Deputy Manager (1), Receptionist (1), Administrators (2), Nurses (6), Senior Carers (6), Carers (36), Maintenance Manager (1), Activity Coordinators (2), IT Technicians (6).'},
             staff([
                 ('Manager', ['Oversees the running of the care home', 'Manages the budget and prepares monthly reports', 'Prepares agendas and takes minutes of all meetings', 'Responds to emails and correspondence']),
                 ('Deputy Manager', ['Manages the staff rota and staff training', 'Manages, records and orders all medication for the residents']),
                 ('Receptionist', ['Operates two-way intercom system (unlocking both entrances)', 'Provides administrative support to all staff', 'Manages petty cash, residential fees, residents’ personal allowances', 'Updates staff Disclosure and Barring Service (DBS) registrations']),
                 ('Administrators', ['Prepare legally binding contracts for all new residents', 'Send monthly invoices to residents’ families for payment', 'Send annual residential fees information to families', 'Administer payroll']),
                 ('Nurses (six on a rota, two on duty at any one time)', ['Manually update medication details for all residents in the nursing unit', 'Ensure all repeat prescription medication is processed accurately and stored securely', 'Ensure any requests for additional medication are sent to a doctors’ surgery promptly using the fax machine']),
                 ('Senior Carers (six on a rota, four on duty at any one time)', ['In the Nursing Unit: undertake induction with new staff and assist nursing staff', 'In the Residential and Dementia Units: manually update medication details for all residents in these units', 'Ensure all repeat prescription medication is processed accurately and stored securely', 'Ensure any requests for additional medication are sent to a doctors’ surgery promptly using the fax machine'])]),
             {'t': 'p', 'x': 'In the future Nizuk Care Home is looking to improve its systems by providing:'},
             {'t': 'li', 'x': ['computer controlled access systems', 'access to e-Learning systems', 'IT systems to record petty cash and other small financial transactions.']},
         ]),

    # ───────────────────────────── June 2019 — Cinnamon Agricultural Services ─────────────────────────────
    dict(id='U14-1906', key='2019-06', series='June 2019', title='Cinnamon Agricultural Services — agricultural sales and servicing',
         src='*Unit_14_B_Jun-2019.txt', sector='agricultural sales and servicing',
         partA=part_a('agricultural sales and servicing', ['a GPS vehicle tracking system for Cinnamon Agricultural Services’ vehicles', 'mobile technology that will allow the manager to work remotely', 'mobile job management software for mechanics when visiting customers’ premises.'], org='Cinnamon Agricultural Services'),
         partB=[
             {'t': 'p', 'x': 'Cinnamon Agricultural Services is based in Harrogate, Yorkshire, and employs 10 staff. Cinnamon Agricultural Services sells new and used machinery and it also offers servicing and repairs for all types of agricultural machinery both on-site and on customer premises. It also stocks a range of machinery parts.'},
             {'t': 'p', 'x': 'It needs an efficient IT system to store and manage the information and data requirements of the organisation.'},
             {'t': 'p', 'x': 'The current system was set up in 2015. There are six computers on-site, four in the office and two in the shop, and the staff who have access to them include:'},
             {'t': 'li', 'x': ['Manager – 1 dedicated computer', 'Office Manager – 1 dedicated computer', 'Administration Assistants – 2 dedicated computers', 'Shop Manager – 1 dedicated computer', 'Shop Assistant – 1 dedicated computer.']},
             {'t': 'p', 'x': 'Integrated management software is installed on each computer that includes:'},
             {'t': 'li', 'x': ['Parts control – invoicing, purchase and sales information', 'Workshop control – new jobs, job allocation, job history reports', 'Job costing – raising quotations, invoices', 'Point of sale – recording sales, payments and stock control', 'Accounting and payroll – managing debtors, creditors, cash flow and payroll', 'Management reporting – creating and sending reports.']},
             {'t': 'grid', 'head': ['Area', 'Current set-up'], 'rows': [
                 ['Office', 'The Manager, Office Manager and Administration Assistants each has access to a dedicated computer and a high quality printer/fax/scanner. Shop staff access the printer to produce customer receipts.'],
                 ['Shop', 'The Shop Manager and Shop Assistant use the two computers in the shop to order bespoke parts online directly from the supplier. They also order stock flagged up by the Integrated Management System. An electronic card machine is used for customers to pay for parts and/or services. There is a CCTV camera that monitors activity in the shop.'],
                 ['Workshop', 'There is a printer used to print job cards for mechanics; these are generated by office staff.']]},
             {'t': 'p', 'x': 'Cinnamon Agricultural Services is not a real organisation but is meant to be representative of this type of facility in the agricultural sales and servicing sector.'},
             {'t': 'h', 'x': 'Cinnamon Agricultural Services'},
             {'t': 'p', 'x': 'Location: Harrogate. Number of staff – 10: Manager (1), Office Manager (1), Administration Assistants (2), Shop Manager (1), Shop Assistant (1) and mechanics (4).'},
             staff([
                 ('Manager', ['Oversees the running of the organisation', 'Allocates all jobs to mechanics', 'Manages the IT system']),
                 ('Office Manager', ['Prepares invoices', 'Processes payroll', 'Manages purchase and sales ledger', 'Manages CCTV footage']),
                 ('Administration Assistants', ['Enter the purchase invoices onto the system', 'Carry out stock checks', 'Produce management reports']),
                 ('Shop Manager and Shop Assistant', ['Order stock online', 'Update social media sites', 'Manage shop sales']),
                 ('Mechanics', ['Complete jobs and update job cards', 'Update stock records for any parts used', 'Carry out jobs on customer premises'])]),
             {'t': 'p', 'x': 'In the future Cinnamon Agricultural Services is looking to improve its systems by providing the following additional services:'},
             {'t': 'li', 'x': ['a GPS vehicle tracking system for Cinnamon Agricultural Services’ vehicles', 'mobile technology that will allow the manager to work remotely', 'mobile job management software for mechanics when visiting customers’ premises.']},
         ]),

    # ───────────────────────────── January 2020 — Neuton & Neuton Retail ─────────────────────────────
    dict(id='U14-2001', key='2020-01', series='January 2020', title='Neuton & Neuton Retail — retail',
         src='*Part_B_Jan-2020.txt', sector='retail',
         partA=part_a('retail', ['automated systems for stock control', 'an external auction site to sell any surplus stock', 'installation of anti-theft systems.'], org='Neuton & Neuton Retail'),
         partB=[
             {'t': 'p', 'x': 'Neuton & Neuton Retail is a family-owned business based in Yorkshire that operates from the family home. All orders are taken online via its website and stock is tracked manually. Sales have increased, so the owners have decided to rent a building with space for a shop, an office, and a stockroom.'},
             {'t': 'p', 'x': 'There will be seven members of staff: the two owners, three shop assistants, and two assistants in the stockroom.'},
             {'t': 'p', 'x': 'There needs to be a server and two computers in the office, two computers in the stockroom and three EPOS terminals in the shop. An efficient IT system to store and manage the information and data requirements of the company needs to be in place.'},
             {'t': 'p', 'x': 'Neuton & Neuton Retail will work with an independent company to determine hardware and software requirements. The independent company will install and remotely manage the network infrastructure and website.'},
             {'t': 'grid', 'head': ['Floor', 'Room', 'Equipment'], 'rows': [
                 ['Ground floor', 'Shop', 'CCTV, EPOS terminals'], ['Ground floor', 'Stockroom', 'CCTV, two computers'], ['First floor', 'Office', 'Server, printer and two computers']]},
             {'t': 'h', 'x': 'Neuton & Neuton Retail'},
             {'t': 'p', 'x': 'Location: Yorkshire. Number of staff – 7: Owners (2), Shop Assistants (3), Stockroom Assistants (2).'},
             staff([
                 ('Owners', ['Oversee the running of the organisation', 'Manage income and expenditure', 'Manage stock control', 'Manage invoices for processing', 'Manage purchase and sales ledger', 'Order stock online for shop', 'Banking', 'Payroll', 'Respond to emails and correspondence']),
                 ('Shop Assistants', ['Responsible for shop sales', 'Check stock availability']),
                 ('Stockroom Assistants', ['Manage stock arriving at the shop', 'Respond to online orders'])]),
             {'t': 'p', 'x': 'In the future, Neuton & Neuton Retail wants to improve its systems by providing:'},
             {'t': 'li', 'x': ['automated systems for stock control', 'an external auction site to sell any surplus stock', 'installation of anti-theft systems.']},
         ]),

    # ───────────────────────────── January 2021 — Rodri’s restaurant ─────────────────────────────
    dict(id='U14-2101', key='2021-01', series='January 2021', title='Rodri’s — restaurant',
         src='*Part-B-Jan-2021.txt', sector='hospitality',
         partA=part_a('hospitality', ['updating the website to include online restaurant bookings', 'providing technology for customers to order their meals from their tables', 'installing a digital menu board.'], org='Rodri’s'),
         partB=[
             {'t': 'p', 'x': 'Rodri’s is a restaurant in Bath. It employs 16 on-site staff plus two external contractors (an Accountant and IT Support).'},
             {'t': 'p', 'x': 'The restaurant is open Tuesday to Sunday, 6.30 p.m. until 10.30 p.m. It is closed each Monday for stocktaking, deep cleaning and maintenance. The restaurant serves a variety of meals. The restaurant has seating for 60 customers at a time, a bar area, kitchen, administration office and maintenance room.'},
             {'t': 'p', 'x': 'The staff use a manual system for ordering meals. The Server writes down what each customer has chosen and passes the information to the Host. The Host uses the information to prepare the customer’s bill and also gives the information to the kitchen staff so they can prepare the food.'},
             {'t': 'p', 'x': 'At the end of the evening the total takings are balanced against customer orders.'},
             {'t': 'p', 'x': 'The restaurant currently has a website that gives details of the restaurant and the menus. The Owner is responsible for the website.'},
             {'t': 'fig', 'id': 'u14-2101-org'},
             {'t': 'h', 'x': 'Rodri’s'},
             {'t': 'p', 'x': 'Location: Bath. Number of on-site staff – 16; contractors – 2. Owner (1), Assistant Manager (1), Head Chef (1), Sous Chef (1), Cooks (3), Prep Cook (1), Host (1), Servers (3), Bar Staff (2), Maintenance (2); Accountant (1), IT Support (1).'},
             staff([
                 ('Owner', ['Hires staff and manages staff rotas', 'Manages payroll', 'Markets the restaurant', 'Manages and updates the website']),
                 ('Assistant Manager', ['Runs the restaurant when the owner is absent', 'Helps with staff rotas', 'Assists the Head Chef with creating menus', 'Prepares policies and procedures']),
                 ('Host', ['Meets and greets customers', 'Records bookings', 'Records customer orders and passes to the kitchen', 'Calculates the bill and takes the customers’ payments', 'Adds up the money taken at the end of each evening', 'Manages and trains new service staff']),
                 ('Head Chef', ['Creates menus with the Assistant Manager', 'Cooks meals', 'Keeps a record of the ingredients used and stocktakes', 'Buys supplies and ingredients', 'Manages and trains new kitchen staff']),
                 ('Sous Chef', ['Assists the Head Chef with meal preparation', 'Assists the Head Chef with stocktaking']),
                 ('Cooks', ['Cook meals', 'Assist the Head Chef with stocktaking']),
                 ('Prep Cook', ['Prepares the ingredients for the chefs', 'Washes and chops vegetables', 'Cleans the preparation areas']),
                 ('Servers', ['Take orders from customers at the table', 'Pass orders to the Host', 'Serve the meals to the customers']),
                 ('Bar Staff', ['Prepare drinks for the customers', 'Record the stock used', 'Take payments from customers who order drinks at the bar', 'Add up the bar takings at the end of the evening']),
                 ('Maintenance', ['Maintain and service the kitchen appliances', 'Maintain and service the bar and restaurant equipment', 'Order spare parts', 'Keep an inventory of all equipment and appliances']),
                 ('Accountant (contractor)', ['Prepares accounts and tax returns', 'Controls income and expenditure', 'Audits financial information']),
                 ('IT Support (contractor)', ['Installs hardware', 'Installs software', 'Solves technical issues'])]),
             {'t': 'h', 'x': 'The restaurant premises include'},
             {'t': 'grid', 'head': ['Area', 'Use and equipment'], 'rows': [
                 ['Administration office', 'Owner – 1 dedicated computer; Assistant Manager – 1 dedicated computer; Bar Staff/Head Chef/Host – 1 shared laptop. The Owner and Assistant Manager use the office for administration, financial tasks and meetings with the Accountant. The Bar Staff, Head Chef and Host occasionally use the laptop to update stock records and place orders online.'],
                 ['Kitchen', 'The Head Chef, Sous Chef, Cooks and Prep Cook use this area for the preparation and cooking of all meals.'],
                 ['Restaurant and bar area', 'The Host, Servers and Bar Staff work in this area to make sure that customers are looked after professionally.'],
                 ['Maintenance room', 'Maintenance – 1 shared computer between the two members of staff. The maintenance staff are based in the room where the file server is. The room is accessed with a key that does not provide much security.']]},
             {'t': 'p', 'x': 'The restaurant IT systems are old and outdated. They need to be updated or new equipment purchased so that it has an efficient IT system to store and manage its information and data requirements.'},
             {'t': 'p', 'x': 'In the future Rodri’s is looking to improve systems by providing:'},
             {'t': 'li', 'x': ['an updated website to include online restaurant bookings', 'technology for customers to order their meals from their tables', 'installation of a digital menu board.']},
         ]),

    # ───────────────────────────── June 2022 — Warrington Boats ─────────────────────────────
    dict(id='U14-2206', key='2022-06', series='June 2022', title='Warrington Boats — boat hire',
         src='*unit14-que-20220817.txt', sector='hospitality and tourism',
         partA=part_a('hospitality and tourism', ['an updated website to include online boat bookings with real-time availability', 'GPS tracking for the location of boats', 'a staff rota management system that provides access to rotas for staff using their own mobile devices.'], org='Warrington Boats'),
         partB=[
             {'t': 'p', 'x': 'Warrington Boats is a boat hire company based on the Manchester Ship Canal. The company is a small family business that offers boats for hire for canal cruises and holidays. It also hires some static boats for canal-based accommodation.'},
             {'t': 'p', 'x': 'The company owns a marina where the boats are based. It also has workshops, storage facilities and offices at the marina.'},
             {'t': 'p', 'x': 'The company employs 23 members of staff. Some of the staff work part-time.'},
             {'t': 'p', 'x': 'There is a full-time office manager. There are part-time administration assistants who deal with the general administration of the company, including financial administration, as well as the bookings for boats.'},
             {'t': 'p', 'x': 'The office manager is responsible for staff work rotas for all staff in the company. The staff may obtain their work rota from one of the administration assistants.'},
             {'t': 'p', 'x': 'The workshop manager is responsible for the marina compound, overseeing maintenance activities, the workshops and storage facilities as well as having overall responsibility for health and safety in the company.'},
             {'t': 'p', 'x': 'There are maintenance staff who perform a variety of duties in relation to maintaining the marina and the boats. Preparation staff prepare the boats for rental.'},
             {'t': 'p', 'x': 'The company has a website that provides information about the boats that can be hired. It has an online booking form that can be sent to the company to request a booking. The website is hosted by a web hosting service provider.'},
             {'t': 'p', 'x': 'The computing facilities in the company consist of a fileserver with a PC used by the office manager and three PCs available to the administration assistants. One of the three PCs is located in the reception area. All the PCs have internet access.'},
             {'t': 'p', 'x': 'The workshop manager, workshop assistant manager, maintenance staff and supervisors have access to laptop computers. These computers have issues with the Wi-Fi link to the main administration building. Sometimes the staff have to bring the laptops to the main administration building to gain internet access as well as accessing files on the file server.'},
             {'t': 'p', 'x': 'Most of the IT equipment has been in place for several years and is due to be upgraded or replaced, as necessary.'},
             {'t': 'p', 'x': 'The full-time office manager and part-time administration assistants are located in the main administration building. There is an office for the office manager and a general office that includes the reception area for the company. The workshop manager and assistant workshop manager share an office located in the workshop. The supervisors share another office in the workshop.'},
             {'t': 'h', 'x': 'Warrington Boats'},
             {'t': 'p', 'x': 'Location: Manchester Ship Canal, Warrington. Number of on-site staff – 23: Office Manager (1), Administration Assistants (4 part-time), Workshop Manager (1), Workshop Assistant Manager (1), Maintenance Staff (6), Preparation Staff Supervisors (2), Preparation Staff (8 part-time).'},
             staff([
                 ('Office Manager', ['Supervises the running of the boat hire company', 'Hires staff', 'Organises staff rotas', 'Manages the payroll', 'Supervises the website content']),
                 ('Administration Assistants', ['Take bookings for boat hire', 'Process payments', 'General office administration', 'Reception duties relating to customer bookings']),
                 ('Workshop Manager', ['Prioritises maintenance activities to be undertaken', 'Authorises maintenance tasks to be completed', 'Designated Health and Safety Officer', 'Generates purchase requisitions']),
                 ('Workshop Assistant Manager', ['Allocates maintenance tasks', 'Identifies staffing requirements for maintenance and preparation of boats', 'Does the stocktaking']),
                 ('Maintenance Staff', ['Perform authorised maintenance tasks', 'Move the boats to where they are needed']),
                 ('Preparation Staff Supervisors', ['Liaise with administration staff to establish which boats need to be prepared for rental', 'Allocate staff to prepare boats for customers', 'Supervise the preparation of boats for customers']),
                 ('Preparation Staff', ['Prepare boats for customers', 'Identify maintenance to be carried out on boats'])]),
             {'t': 'h', 'x': 'The premises include'},
             {'t': 'grid', 'head': ['Area', 'Equipment'], 'rows': [
                 ['General office', 'Office Manager – 1 dedicated desktop computer; Administration Assistants – 2 shared desktop computers; reception area – 1 desktop computer'],
                 ['General office annexe', 'File server, accessed via the general office'],
                 ['Workshop office', 'Workshop Manager – 1 dedicated laptop; Workshop Assistant Manager – 1 dedicated laptop'],
                 ['Workshop', 'Maintenance Staff – 2 shared laptop computers'],
                 ['Supervisors’ office', 'Supervisors – 1 shared laptop computer']]},
             {'t': 'p', 'x': 'At the moment no staff have access to any tablet devices. However, most of the information relating to boat bookings and maintenance would be accessed on tablet devices in the upgraded IT system.'},
             {'t': 'p', 'x': 'The marina has berths for 30 boats used for cruising and five berths for the static boats.'},
             {'t': 'p', 'x': 'In the future Warrington Boats is looking to improve systems by providing:'},
             {'t': 'li', 'x': ['an updated website to include online boat bookings with real-time availability', 'GPS tracking for the location of boats', 'a staff rota management system that provides access to rotas for staff using their own mobile devices.']},
         ]),

    # ───────────────────────────── June 2023 — Frisson Park ─────────────────────────────
    dict(id='U14-2306', key='2023-06', series='June 2023', title='Frisson Park — amusement park',
         src='*u14-part-a-and-b.txt', sector='entertainment',
         partA=part_a('entertainment', ['an app with an interactive map to help visitors find their way around the amusement park', 'analysing visitor preferences for attractions to assist with future planning for the amusement park', 'providing accurate and up-to-date computerised health and safety records.'], org='Frisson Park'),
         partB=[
             {'t': 'p', 'x': 'Frisson Park is an amusement park near Norwich. The amusement park offers a variety of rides, such as roller coasters and carousels, attractions for younger children, on-site restaurants and cafes.'},
             {'t': 'p', 'x': 'There are 25 full-time permanent members of staff as well as a number of part-time seasonal staff. There is a full-time general manager, an assistant manager and an office manager.'},
             {'t': 'p', 'x': 'Visitors to the amusement park can buy tickets online in advance or at the main entrance. These tickets allow unlimited rides for the day. Another option is to buy a visitor pass and then pay for each ride.'},
             {'t': 'p', 'x': 'There is a supervisor at the entrance to the amusement park who manages a team of park entrance assistants. The park entrance assistants check the tickets visitors have bought and they also sell tickets to visitors who need to buy them.'},
             {'t': 'p', 'x': 'The office manager manages an administration team. The administration team is responsible for the general administration of the amusement park.'},
             {'t': 'p', 'x': 'The assistant manager, who is also the health and safety officer, manages a team of maintenance staff who maintain all the rides and do all the general maintenance.'},
             {'t': 'p', 'x': 'The amusement park has a website that provides information about its facilities and also allows people to buy advance tickets online.'},
             {'t': 'p', 'x': 'The computing facilities in the amusement park consist of:'},
             {'t': 'li', 'x': ['a fileserver', 'a PC used by the office manager', 'six PCs available to the administration team', 'a PC for the general manager', 'a laptop for the assistant manager', 'a laptop for the park entrance supervisor', 'EPOS terminals for the park entrance assistants.']},
             {'t': 'p', 'x': 'Many of the rides have their own computer control systems. These carry out actions such as monitoring sensors, controlling the ride when it is running and controlling the cameras that take photos of the people on the rides.'},
             {'t': 'p', 'x': 'A stock control system is used to keep records of spare parts for rides and attractions in the amusement park.'},
             {'t': 'p', 'x': 'Most of the IT equipment has been in place for several years and is due to be upgraded or replaced, as necessary.'},
             {'t': 'h', 'x': 'Frisson Park amusement park'},
             {'t': 'p', 'x': 'Location: Norwich. Number of on-site staff – 25 full-time plus part-time seasonal staff: General Manager (1), Assistant Manager (1), Office Manager (1), Administration Assistants (6), Park Entrance Supervisor (1), Park Entrance Assistants (1 plus 5 part-time), Maintenance Personnel (2), Ride Operators (10 plus 30 part-time), Catering Staff (1 plus 18 part-time), Caretaking Staff (1 plus 15 part-time).'},
             staff([
                 ('General Manager', ['Monitors activities in the amusement park', 'Makes sure that the amusement park is safe and secure', 'Responsible for marketing and publicity', 'Monitors staffing requirements']),
                 ('Assistant Manager', ['Responsible for health and safety', 'Responsible for staff induction', 'Monitors activities of the amusement park', 'Finds out about new rides and attractions', 'Supervises the maintenance staff']),
                 ('Office Manager', ['Hires staff', 'Organises staff rotas', 'Manages the payroll', 'Supervises the website content']),
                 ('Administration Assistants', ['Process payments', 'General office administration']),
                 ('Park Entrance Supervisor', ['Manages the park entrance assistants', 'Supervises the queues at the entrance']),
                 ('Park Entrance Assistants', ['Sell tickets', 'Check tickets']),
                 ('Maintenance Staff', ['Complete maintenance tasks needed', 'Keep stock control system for parts up to date', 'Order parts needed for rides and attractions', 'Complete health and safety checks']),
                 ('Ride Operators', ['Manage the rides and attractions', 'Supervise the people on the rides']),
                 ('Catering Staff', ['Provide meals and snacks in restaurants and cafes', 'Make sure the vending machines are stocked']),
                 ('Caretaking Staff', ['Keep the amusement park clean and tidy'])]),
             {'t': 'h', 'x': 'The premises include'},
             {'t': 'grid', 'head': ['Area', 'Equipment'], 'rows': [
                 ['Management office', 'General Manager – 1 desktop computer; Assistant Manager – 1 laptop'],
                 ['General office', 'Office Manager – 1 desktop computer; Administration Assistants – 6 desktop computers'],
                 ['File server room', 'File server'],
                 ['Workshop and office', 'Maintenance personnel – 1 desktop computer'],
                 ['Park entrance ticket office', 'Park Entrance Supervisor – 1 laptop; Park Entrance Assistants – 3 EPOS terminals']]},
             {'t': 'p', 'x': 'At present no staff use any tablet devices.'},
             {'t': 'p', 'x': 'In the future Frisson Park is looking to improve systems by:'},
             {'t': 'li', 'x': ['providing an app with an interactive map to help visitors find their way around the amusement park', 'analysing visitor preferences for attractions to assist with future planning for the amusement park', 'providing accurate and up-to-date computerised health and safety records.']},
         ]),

    # ───────────────────────────── January 2024 — Langstone Pottery ─────────────────────────────
    dict(id='U14-2401', key='2024-01', series='January 2024', title='Langstone Pottery — pottery manufacturer',
         src='*PartB_W75794.txt', sector='manufacturing',
         partA=part_a('manufacturing', ['interactive visitor information displays in the gallery', 'an updated website for the business to sell pottery online', 'IT systems to record details of financial transactions.'], org='Langstone Pottery'),
         partB=[
             {'t': 'p', 'x': 'Langstone Pottery is a small pottery business in Stroud. The business makes a range of pottery items such as mugs, vases and bowls. The business has a gallery to exhibit and sell these pottery items. The pottery items can also be purchased at various stockists across the UK.'},
             {'t': 'p', 'x': 'The gallery is open five days a week and is closed on Monday and Tuesday. As well as the gallery, the business has:'},
             {'t': 'li', 'x': ['a workshop where the pottery is made', 'a storeroom used to hold supplies', 'another storeroom used to hold finished items of pottery', 'a packing area where items are prepared for despatch to stockists', 'an office.']},
             {'t': 'p', 'x': 'There is a general manager as well as an office manager. There is an administration team, managed by the office manager, who deal with the general administration of the pottery business.'},
             {'t': 'p', 'x': 'There are sales assistants who work in the gallery, selling items of pottery as well as dealing with general enquiries from visitors. There are three potters who make the items of pottery. Auxiliary staff have a range of duties, such as packing products for despatch as well as general maintenance.'},
             {'t': 'p', 'x': 'The business has a website that provides information about Langstone Pottery.'},
             {'t': 'p', 'x': 'The computing facilities consist of:'},
             {'t': 'li', 'x': ['a PC for the general manager', 'a PC used by the office manager', 'two PCs available to the administration team', 'a PC in the storeroom', 'a fileserver.']},
             {'t': 'p', 'x': 'The till used to sell items in the gallery is not linked to an EPOS system. A stock control system is used to keep records of stock held in the storerooms.'},
             {'t': 'p', 'x': 'Most of the IT equipment has been in place for several years and is due to be upgraded or replaced, as necessary. Maintenance of all equipment, including IT equipment, is outsourced. The business has a contract with a courier company to deliver all orders to stockists.'},
             {'t': 'h', 'x': 'Langstone Pottery'},
             {'t': 'p', 'x': 'Location: Stroud. Number of on-site staff: 10 full-time plus 4 part-time staff — General Manager (1), Office Manager (1), Administration Assistants (2), Potters (3), Auxiliary staff (2 plus 2 part-time), Sales Assistants (1 plus 2 part-time). External contractors: maintenance contractor; courier company.'},
             staff([
                 ('General Manager', ['Monitors staffing requirements', 'Hires staff', 'Initiates marketing and publicity', 'Decides on new pottery items', 'Conducts staff induction', 'Monitors health and safety']),
                 ('Office Manager', ['Organises staff rotas', 'Manages the payroll', 'Supervises the website content', 'Arranges equipment maintenance']),
                 ('Administration Assistants', ['Process payments', 'Process orders', 'General office administration', 'Liaise with stockists', 'Liaise with couriers']),
                 ('Potters', ['Make pottery items']),
                 ('Auxiliary staff', ['Complete general maintenance needed', 'Pack pottery for despatch']),
                 ('Sales Assistants', ['Sell pottery items', 'Deal with general enquiries from visitors']),
                 ('Maintenance contractor (external)', ['Maintenance of equipment, including IT equipment']),
                 ('Courier company (external)', ['Deliver orders to stockists'])]),
             {'t': 'h', 'x': 'The premises include'},
             {'t': 'grid', 'head': ['Area', 'Equipment'], 'rows': [
                 ['Manager’s office', 'General Manager – 1 dedicated desktop computer'],
                 ['General office', 'Office Manager – 1 dedicated desktop computer; Administration Assistants – 2 shared desktop computers'],
                 ['General office annexe', 'File server, accessed via the general office'],
                 ['Storeroom', 'All staff – 1 shared desktop computer'],
                 ['Gallery', 'Till for sales']]},
             {'t': 'p', 'x': 'At present no staff use any tablet devices.'},
             {'t': 'p', 'x': 'In the future Langstone Pottery is looking to improve systems by providing:'},
             {'t': 'li', 'x': ['interactive visitor information displays in the gallery', 'an updated website for the company to sell pottery online', 'IT systems to record details of financial transactions.']},
         ]),

    # ───────────────────────────── June 2024 — Martlepool Coaches ─────────────────────────────
    dict(id='U14-2406', key='2024-06', series='June 2024', title='Martlepool Coaches — minibus and coach hire',
         src='*June_2024_combined.txt', sector='marketing and sales',
         partA=[{'t': 'h', 'x': 'Set task brief (Part A)'},
                {'t': 'p', 'x': 'Martlepool Coaches is a minibus and coach hire company. The company employs 15 members of staff and hires casual staff as needed. Martlepool Coaches has minibuses and coaches available for hire, as well as offering some short break holiday trips. The company has a website to advertise the minibuses, coaches and short break holiday trips. The company premises include a bus depot, workshop and offices.'},
                {'t': 'p', 'x': 'Martlepool Coaches is not a real company but is meant to be representative of the type of marketing and sales company you might want to investigate as part of your research.'}]
               + part_a('marketing and sales', ['security cameras for the premises with remote viewing facilities', 'an app to allow customers to make minibus or coach bookings', 'using social media to promote the activities of Martlepool Coaches.'], org='Martlepool Coaches'),
         partB=[
             {'t': 'p', 'x': 'Martlepool Coaches is a minibus and coach hire company. The company employs 15 members of staff and hires casual staff as needed. Martlepool Coaches has minibuses and coaches available for hire, as well as offering some short break holiday trips.'},
             {'t': 'p', 'x': 'The company has a website to advertise the minibuses and coaches that are available for hire, as well as advertising the short break holiday trips.'},
             {'t': 'p', 'x': 'The company premises include a bus depot and offices. The bus depot is where the minibuses and coaches are stored when not in use. Repairs to minibuses and coaches are done in the workshop at the bus depot. All minibuses and coaches are cleaned at the bus depot before the start of each hire booking. The workshop manager has an office in the workshop. The workshop manager supervises the mechanics and cleaning team.'},
             {'t': 'p', 'x': 'The offices are next to the bus depot. The general manager, office manager and administration assistants use their offices for administration and finance tasks. A marketing assistant shares an office with the administration assistants. The general manager supervises the drivers.'},
             {'t': 'p', 'x': 'The company IT systems are old and outdated. They need to be updated or new equipment purchased so that the company has an efficient IT system to store and manage its information and data requirements.'},
             {'t': 'h', 'x': 'Martlepool Coaches'},
             {'t': 'p', 'x': 'Location: Martlepool. Number of staff: 15 plus casual staff — General Manager (1), Workshop Manager (1), Office Manager (1), Administration Assistants (2), Marketing Assistant (1), Mechanics (2), Cleaning Team (1 plus casual staff), Drivers (6 plus casual staff).'},
             staff([
                 ('General Manager', ['Monitors staffing requirements', 'Hires staff', 'Plans marketing and publicity', 'Conducts staff induction', 'Monitors health and safety']),
                 ('Workshop Manager', ['Monitors servicing of the minibuses and coaches', 'Monitors faults with the minibuses and coaches', 'Monitors stock levels of spare parts used for repairs and servicing', 'Orders parts to carry out repairs', 'Checks cleanliness of minibuses and coaches', 'Organises cleaning team rota']),
                 ('Office Manager', ['Organises drivers’ rota', 'Manages the payroll', 'Supervises the website content']),
                 ('Administration Assistants', ['Process payments', 'Process bookings', 'General office administration', 'Liaise with drivers']),
                 ('Marketing Assistant', ['Promotes Martlepool Coaches using the website and local press']),
                 ('Drivers', ['Drive the minibuses and coaches', 'Report faults with minibuses and coaches', 'Refuel the minibuses and coaches']),
                 ('Mechanics', ['Carry out general maintenance on the minibuses and coaches', 'Service the minibuses and coaches']),
                 ('Cleaning Team', ['Clean the minibuses and coaches'])]),
             {'t': 'h', 'x': 'The premises include'},
             {'t': 'grid', 'head': ['Area', 'Equipment'], 'rows': [
                 ['General Manager’s office', 'General Manager – 1 desktop computer'],
                 ['General office', 'Office Manager – 1 desktop computer; Administration Assistants – 2 desktop computers; Marketing Assistant – 1 laptop computer'],
                 ['Workshop Manager’s office', 'Workshop Manager – 1 desktop computer']]},
             {'t': 'p', 'x': 'At present no staff use any tablet devices.'},
             {'t': 'p', 'x': 'In the future Martlepool Coaches is looking to improve systems by:'},
             {'t': 'li', 'x': ['providing security cameras for the premises with remote viewing facilities', 'providing an app to allow customers to make minibus or coach bookings', 'using social media to promote the activities of Martlepool Coaches.']},
         ]),
]
