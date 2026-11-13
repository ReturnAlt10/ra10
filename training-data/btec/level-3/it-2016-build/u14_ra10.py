"""RA10 practice set tasks for BTEC Nationals IT (2016) Unit 14, written in the exact Pearson Part A / Part B format.

Every organisation here is fictional and invented by RA10; no figures are presented as real-world statistics.
The activity wording follows the Pearson June 2024 booklet (the mark scheme is identical for every series).
"""
from u14_series import part_a, staff


def activities(org, noun='company', people='employees and customers'):
    """The five Part B activities, worded as in the current Pearson booklets."""
    return [
        dict(n=1, marks=8, kind='strategy', text=(
            'Produce an outline IT service strategy using the template Outline_Service_Strategy.rtf for %s’s current and future needs.\n'
            'Your service strategy should:\n'
            '• identify %s’s IT service and/or process requirements\n'
            '• prioritise the IT service and/or process requirements in relation to the needs of the %s, %s\n'
            '• justify how you have prioritised the IT service and/or process requirements.') % (org, org, noun, people)),
        dict(n=2, marks=8, kind='catalogue', text=(
            'Produce an IT service catalogue by defining the individual IT services for the current and future IT requirements for each given function of the %s. '
            'Use the template Define_IT_Service_Catalogue.rtf') % noun),
        dict(n=3, marks=20, kind='solution', text=(
            'Produce a design for an IT service delivery solution that will meet the current and future needs of %s, its employees and customers.\n'
            'You should include:\n• information requirements\n• data requirements\n• hardware and software service options\n• managing infrastructure and users.\n'
            'Your design evidence must contain a combination of written, tabular and annotated diagrammatic information and may consist of more than one document. '
            'There is no single preferred method of presenting this evidence.') % org),
        dict(n=4, marks=12, kind='evaluation', text=(
            'Produce a report that evaluates the appropriateness of the solution you designed in Activity 3 in relation to the current and future IT service delivery requirements of %s.\n'
            'It should include:\n• an assessment of the appropriateness of your solution\n• a comparison with alternative solutions that could be used\n'
            '• a rationale for choosing your solution over the alternatives.') % org),
        dict(n=5, marks=16, kind='implications', text=(
            'Produce a report using the template IT_Service_Management_Implications.rtf\n'
            'Analyse the IT service management implications for %s of the solution you have designed.\n'
            'Your report should cover the IT service management implications of the following areas:\n'
            '• implementing your solution and delivering the %s’s services and products\n• managing and supporting the %s’s employees\n'
            '• managing and supporting the %s’s customers\n• managing the %s’s IT assets.\n'
            'Think about how each area will be affected by:\n• constraints, such as legal requirements, security issues, resource limitations\n'
            '• changes in the %s’s aims, products and services.') % (org, noun, noun, noun, noun, noun)),
    ]


FICTION = 'This organisation is fictional. It was written by RA10 to be representative of this type of organisation; it is not a real business.'

RA10 = [
    # ───────────────────────────── RA10 practice task 1 — veterinary practice ─────────────────────────────
    dict(id='U14-R1', key='ra10-1', series='RA10 practice task 1', title='Harbourside Vets — veterinary practice', sector='animal health',
         partA=part_a('animal health', ['an online appointment booking system with automatic reminders', 'portable devices for vets visiting farms and stables', 'a secure system for sharing test results and X-ray images with specialist referral centres.'], org='Harbourside Vets'),
         partB=[
             {'t': 'p', 'x': 'Harbourside Vets is a veterinary practice in a coastal town. It treats pets in its surgery and also visits farms and stables to treat larger animals. The practice employs 18 members of staff.'},
             {'t': 'p', 'x': 'The practice has a reception and waiting area, three consulting rooms, an operating theatre, an X-ray room, a small laboratory, a dispensary where medicines are stored, a kennel ward and an office.'},
             {'t': 'p', 'x': 'Appointments are booked by telephone and written in a diary at reception. Clients are reminded about vaccinations by letter. Animal records are kept on an old practice management program installed on a single PC at reception; vets write notes on paper during visits to farms and type them up when they return.'},
             {'t': 'p', 'x': 'X-ray images are produced by a digital X-ray machine connected to its own PC. Images are copied to a USB memory stick when they need to be sent to a specialist.'},
             {'t': 'p', 'x': 'Medicines are controlled: the practice must keep an accurate record of controlled drugs that are received, used and disposed of. Payments are taken at reception using a standalone card machine.'},
             {'t': 'p', 'x': 'Most of the IT equipment is more than six years old and is due to be upgraded or replaced, as necessary.'},
             {'t': 'p', 'x': FICTION},
             {'t': 'h', 'x': 'Harbourside Vets'},
             {'t': 'p', 'x': 'Number of staff – 18: Practice Manager (1), Vets (5), Veterinary Nurses (6), Receptionists (3 part-time), Practice Administrator (1), Kennel Assistants (2).'},
             staff([
                 ('Practice Manager', ['Oversees the running of the practice', 'Hires staff and organises the staff rota', 'Manages the budget and orders equipment', 'Monitors health and safety']),
                 ('Vets', ['Examine and treat animals in consulting rooms and on visits', 'Carry out operations', 'Prescribe medicines', 'Request laboratory tests and X-rays and share results with specialists']),
                 ('Veterinary Nurses', ['Assist in operations and monitor animals in the kennel ward', 'Carry out laboratory tests', 'Record the use of medicines, including controlled drugs', 'Run nurse clinics, e.g. weight checks']),
                 ('Receptionists', ['Book appointments and greet clients', 'Take payments', 'Send vaccination reminders', 'Answer telephone and email enquiries']),
                 ('Practice Administrator', ['Sends invoices to farm clients and chases unpaid bills', 'Processes the payroll', 'Updates the practice website and social media']),
                 ('Kennel Assistants', ['Feed and clean animals in the kennel ward', 'Record feeding and medication given to animals staying overnight'])]),
             {'t': 'h', 'x': 'The premises include'},
             {'t': 'grid', 'head': ['Area', 'Equipment'], 'rows': [
                 ['Reception', '1 PC with the practice management program; standalone card machine; printer'],
                 ['Office', 'Practice Manager – 1 desktop computer; Practice Administrator – 1 desktop computer; shared printer/scanner'],
                 ['X-ray room', 'Digital X-ray machine with its own PC'],
                 ['Consulting rooms, theatre, laboratory, dispensary, kennel ward', 'No computers at present']]},
             {'t': 'p', 'x': 'At present no staff use any tablet devices.'},
             {'t': 'p', 'x': 'In the future Harbourside Vets is looking to improve systems by providing:'},
             {'t': 'li', 'x': ['an online appointment booking system with automatic reminders', 'portable devices for vets visiting farms and stables', 'a secure system for sharing test results and X-ray images with specialist referral centres.']},
         ],
         acts=activities('Harbourside Vets', 'practice', 'employees and clients')),

    # ───────────────────────────── RA10 practice task 2 — garden centre ─────────────────────────────
    dict(id='U14-R2', key='ra10-2', series='RA10 practice task 2', title='Fernbrook Garden Centre — garden centre', sector='retail',
         partA=part_a('retail', ['a loyalty scheme with a mobile app for customers', 'electronic shelf labels so that prices can be changed centrally', 'a click-and-collect service for plants and garden products.'], org='Fernbrook Garden Centre'),
         partB=[
             {'t': 'p', 'x': 'Fernbrook Garden Centre is a family-owned garden centre on the edge of a market town. It sells plants, garden tools, furniture and gifts, and has a café. It is busiest in spring and summer, when extra seasonal staff are employed.'},
             {'t': 'p', 'x': 'The site has a main shop building with four tills, outdoor plant areas, two large greenhouses, a café, a warehouse and delivery yard, and an office above the shop.'},
             {'t': 'p', 'x': 'The tills are standalone cash registers. Stock is counted by hand once a month and orders are placed with suppliers by telephone and email. Plants that die or are damaged are written off in a notebook.'},
             {'t': 'p', 'x': 'The café takes orders on paper and uses its own separate till. The garden centre has a basic website that shows opening times and events. Customers often telephone to check whether a plant is in stock.'},
             {'t': 'p', 'x': 'The greenhouses have automatic watering controlled by timers. The Nursery Manager would like to be alerted if the temperature in a greenhouse falls too low overnight.'},
             {'t': 'p', 'x': 'Most of the IT equipment is old and is due to be upgraded or replaced, as necessary.'},
             {'t': 'p', 'x': FICTION},
             {'t': 'h', 'x': 'Fernbrook Garden Centre'},
             {'t': 'p', 'x': 'Number of staff – 22 plus seasonal staff: Owners (2), Store Manager (1), Nursery Manager (1), Café Manager (1), Sales Assistants (8 plus seasonal staff), Nursery Staff (4), Café Staff (3 plus seasonal staff), Warehouse Assistant (1), Bookkeeper (1 part-time).'},
             staff([
                 ('Owners', ['Oversee the running of the business', 'Decide on new product ranges and events', 'Plan marketing and publicity']),
                 ('Store Manager', ['Organises the staff rota', 'Orders stock from suppliers', 'Monitors sales and stock levels', 'Handles customer complaints']),
                 ('Nursery Manager', ['Manages the greenhouses and outdoor plant areas', 'Orders plants and seeds', 'Records plants that are written off']),
                 ('Café Manager', ['Runs the café and orders food', 'Records food safety checks, e.g. fridge temperatures']),
                 ('Sales Assistants', ['Serve customers at the tills', 'Answer customer questions and telephone enquiries', 'Stock shelves']),
                 ('Nursery Staff', ['Care for plants', 'Move plants to the sales areas']),
                 ('Café Staff', ['Take food and drink orders', 'Prepare and serve food']),
                 ('Warehouse Assistant', ['Receives deliveries and checks them against orders', 'Arranges local deliveries of large items']),
                 ('Bookkeeper', ['Records income and expenditure', 'Processes the payroll'])]),
             {'t': 'h', 'x': 'The premises include'},
             {'t': 'grid', 'head': ['Area', 'Equipment'], 'rows': [
                 ['Office', 'Owners – 1 shared desktop computer; Store Manager – 1 desktop computer; Bookkeeper – 1 laptop; printer'],
                 ['Shop', '4 standalone tills; 1 card machine at each till'],
                 ['Café', '1 separate till; card machine'],
                 ['Warehouse', 'No computers at present']]},
             {'t': 'p', 'x': 'At present no staff use any tablet devices.'},
             {'t': 'p', 'x': 'In the future Fernbrook Garden Centre is looking to improve systems by providing:'},
             {'t': 'li', 'x': ['a loyalty scheme with a mobile app for customers', 'electronic shelf labels so that prices can be changed centrally', 'a click-and-collect service for plants and garden products.']},
         ],
         acts=activities('Fernbrook Garden Centre', 'business', 'employees and customers')),

    # ───────────────────────────── RA10 practice task 3 — indoor climbing centre ─────────────────────────────
    dict(id='U14-R3', key='ra10-3', series='RA10 practice task 3', title='Kestrel Climbing Centre — sport and leisure', sector='sport and leisure',
         partA=part_a('sport and leisure', ['online booking and payment for classes and climbing sessions', 'a membership system that uses contactless entry cards or phones', 'digital screens showing route information and safety messages.'], org='Kestrel Climbing Centre'),
         partB=[
             {'t': 'p', 'x': 'Kestrel Climbing Centre is an indoor climbing centre in a converted warehouse in a city. It offers climbing walls, a bouldering area, classes for children and adults, birthday parties and a small shop and café.'},
             {'t': 'p', 'x': 'Every new visitor must complete a safety declaration before they climb. At present this is a paper form that is filed at reception. Members show a paper membership card at reception, and staff check names against a printed list.'},
             {'t': 'p', 'x': 'Classes and parties are booked by telephone and recorded in a spreadsheet. Instructors are given a printed list of who is in each class. Safety checks on ropes, harnesses and the auto-belay devices must be recorded every day, and are currently written in a log book.'},
             {'t': 'p', 'x': 'The centre has a website and social media accounts, which are updated by the Marketing Officer. The shop and café share one till.'},
             {'t': 'p', 'x': 'Most of the IT equipment is old and is due to be upgraded or replaced, as necessary.'},
             {'t': 'p', 'x': FICTION},
             {'t': 'h', 'x': 'Kestrel Climbing Centre'},
             {'t': 'p', 'x': 'Number of staff – 16 plus part-time instructors: Centre Manager (1), Duty Managers (2), Receptionists (3), Climbing Instructors (6 plus part-time instructors), Route Setter (1), Marketing Officer (1), Café/Shop Assistants (2).'},
             staff([
                 ('Centre Manager', ['Oversees the running of the centre', 'Hires staff and organises training', 'Manages the budget', 'Monitors health and safety']),
                 ('Duty Managers', ['Run the centre during each shift', 'Check that daily safety checks are completed', 'Deal with accidents and complete accident reports']),
                 ('Receptionists', ['Check visitors and members in', 'Collect safety declarations', 'Take bookings and payments', 'Answer enquiries']),
                 ('Climbing Instructors', ['Teach classes and run parties', 'Carry out daily equipment safety checks', 'Supervise climbers']),
                 ('Route Setter', ['Designs and sets new climbing routes', 'Records route grades and changes']),
                 ('Marketing Officer', ['Updates the website and social media', 'Promotes classes and events']),
                 ('Café/Shop Assistants', ['Serve customers', 'Record stock used and order stock'])]),
             {'t': 'h', 'x': 'The premises include'},
             {'t': 'grid', 'head': ['Area', 'Equipment'], 'rows': [
                 ['Reception', '2 desktop computers; printer; card machine'],
                 ['Office', 'Centre Manager – 1 desktop computer; Duty Managers – 1 shared desktop computer; Marketing Officer – 1 laptop'],
                 ['Café/shop', '1 till; card machine'],
                 ['Climbing halls and classroom', 'No computers at present']]},
             {'t': 'p', 'x': 'At present no staff use any tablet devices.'},
             {'t': 'p', 'x': 'In the future Kestrel Climbing Centre is looking to improve systems by providing:'},
             {'t': 'li', 'x': ['online booking and payment for classes and climbing sessions', 'a membership system that uses contactless entry cards or phones', 'digital screens showing route information and safety messages.']},
         ],
         acts=activities('Kestrel Climbing Centre', 'centre', 'employees and customers')),
]
