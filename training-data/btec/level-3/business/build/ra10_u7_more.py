# Additional RA10 practice set tasks for Unit 7 (Business Decision Making). 8 original two-option cases with consistent figures.
from ra10_sets import p, h, grid, paper, u7_acts


def gbp(n):
    return '£{:,.0f}'.format(n)


PRICE = {(3,1):4.5,(3,2):3.4,(4,1):18,(4,2):24,(5,1):5.6,(5,2):183500/115000.0,(6,1):1.75,(6,2):6.2,(7,1):78,(7,2):88,(8,1):9.5,(8,2):14,(9,1):28,(9,2):32,(10,1):32,(10,2):27}


def opt_grid(title, o):
    rev = sum(v for _, v in o['rev'])
    rev_label = 'Revenue per year (%s)' % ' + '.join('%s %s' % (l, gbp(v)) for l, v in o['rev'])
    rows = [['Start-up capital required (total capital employed)', gbp(o['cap'])], [rev_label, gbp(rev)], ['Cost of sales (%s) – %% of revenue' % o['cos_what'], '%d%%' % o['cos']]]
    for l, v in o['exp']:
        rows.append([l, gbp(v)])
    rows += [['Owner’s drawings per year', gbp(o['draw'])], [o['c_label'], '£%.2f' % (PRICE[o['_k']] * (1 - o['cos'] / 100.0))], [o['u_label'], '{:,}'.format(o['units'])]]
    return grid([title, ''], rows)


def build(c):
    c['o1']['_k'] = (c['k'], 1)
    c['o2']['_k'] = (c['k'], 2)
    A = [h('Set Task Information'), p(c['intro']), p(c['clients_ask']), p('Option 1 ' + c['o1_short']), p('Option 2 ' + c['o2_short']),
         h(c['mh']), p(c['market']), p(c['competition']), h(c['bh']), p(c['background']),
         h('Option 1 – ' + c['o1_name']), p(c['o1_desc']), opt_grid('Financial and other data for Option 1', c['o1']),
         h('Option 2 – ' + c['o2_name']), p(c['o2_desc']), opt_grid('Financial and other data for Option 2', c['o2']), p(c['finance'])]
    B = [h('Set Task'), p('You must complete both activities. You will produce two documents on a computer: a report; a presentation of slides with speaker notes or script.')]
    return paper('U7-R%d' % c['k'], 7, '99%02d' % c['k'], c['title'], c['theme'], 70, u7_acts(c['client'], c['biz']), A, B)


CASES = [
    dict(k=3, client='Jonah', biz='his new business', title='Jonah Reid — coffee van or station kiosk', theme='New business: mobile van vs kiosk',
         intro='You are working in a business advice centre and Jonah Reid has come to you for advice. Jonah has been a barista in a busy city café for five years and wants to be his own boss. His aims are to break even in the first year and to grow turnover and profit in years 2 and 3.',
         clients_ask='Jonah has identified two options and has asked you to recommend which he should choose.', o1_short='Buying a converted coffee van to trade at markets, events and business parks.', o2_short='Renting a small kiosk in a railway station concourse.',
         mh='The coffee-to-go market', market='UK out-of-home coffee sales are worth about £4 billion and growing by 6% a year, but 40% of independent coffee outlets say that profits fell last year because of rising milk, coffee and energy prices. Commuter footfall is still 15% below its 2019 level. Mobile catering grew 11% last year as festivals recovered.',
         competition='Three national coffee chains already have outlets in the station and charge £3.60 for a latte. At business parks, two vans already operate on weekdays. Event organisers typically charge pitch fees of £75–£200 a day.',
         bh='Jonah Reid — background', background='Jonah has £15,000 in savings. He has excellent coffee skills and a good reputation among regular customers but no experience of paying bills or running accounts. He would hire one part-time assistant for either option.',
         o1_name='Coffee van', o1_desc='Jonah would buy a second-hand van and convert it for £22,000. He would trade at four business parks on weekdays and at weekend markets and events. He estimates 15,600 drinks and snacks a year at an average sale of £4.50 and 120 event bookings at £310 each.',
         o1=dict(cap=30000, rev=[('drinks and snacks', 15600 * 4.5), ('event catering', 120 * 310)], cos=32, cos_what='coffee, milk, food, cups', exp=[('Pitch fees, fuel and insurance per year', 14800), ('Assistant wages and other expenses per year', 16200)], draw=24000, c_label='Contribution per drink or snack after variable costs', c_val='£3.06', u_label='Forecast drinks and snacks per year', units=15600),
         o2_name='Station kiosk', o2_desc='The kiosk costs £2,000 a month in rent plus 8% of takings. Fit-out and equipment would cost £28,000. Footfall is high at peak commuter times but low in the middle of the day. Jonah estimates 30,000 drinks a year at £3.40 and wants to open six days a week with two part-time assistants.',
         o2=dict(cap=40000, rev=[('drinks and snacks', 30000 * 3.4)], cos=30, cos_what='coffee, milk, food, cups', exp=[('Rent, service charge and insurance per year', 29100), ('Wages for two assistants and other expenses per year', 31500)], draw=24000, c_label='Contribution per drink or snack after variable costs', c_val='£2.04', u_label='Forecast drinks and snacks per year', units=30000),
         finance='Jonah has £15,000 in savings. A bank has offered a loan of up to £30,000 at 8.5% interest and the station operator would require a three-year lease.'),
    dict(k=4, client='Priyanka', biz='her new business', title='Priyanka Shah — online tuition or tuition centre', theme='New business: online tutoring vs centre',
         intro='You are working in a business advice centre and Priyanka Shah has come to you for advice. Priyanka is a secondary-school maths teacher who wants to start a tutoring business. Her aims are to break even in the first year and to grow turnover and profit in years 2 and 3.',
         clients_ask='Priyanka has identified two options and has asked you to recommend which she should choose.', o1_short='Opening a small tuition centre offering weekly small-group classes for GCSE students.', o2_short='Launching an online tuition platform with live video lessons and recorded content.',
         mh='The private tuition market', market='The UK private tuition market is worth about £2 billion; around one in four secondary-school pupils has received tuition. Online tuition has grown by 20% a year since 2020 and parents say convenience and price are important. Demand peaks before exams in spring.',
         competition='A national chain of tuition centres operates in the town and charges £28 per student per hour. Online platforms offer lessons from £14 an hour and free revision videos are widely available.',
         bh='Priyanka Shah — background', background='Priyanka has savings of £12,000. She has excellent subject knowledge and many parents ask her for help, but she has no marketing experience. She would continue to teach part-time until the business is established.',
         o1_name='Tuition centre', o1_desc='Priyanka would rent a small unit for £900 a month, equip it for £9,000 and employ two part-time tutors. She plans 50 weekly small-group sessions of six students. She expects 6,200 student sessions over the year at an average price of £18.',
         o1=dict(cap=22000, rev=[('group sessions', 6200 * 18), ('mock-exam days', 40 * 175)], cos=34, cos_what='tutor fees, materials, printing', exp=[('Rent, utilities and insurance per year', 14400), ('Marketing and other expenses per year', 12600)], draw=22000, c_label='Contribution per student session after variable costs', c_val='£11.88', u_label='Forecast student sessions per year', units=6200),
         o2_name='Online platform', o2_desc='Priyanka would pay £6,000 to develop the platform and buy equipment for £3,500. Lessons would be delivered from her home by herself and four freelance tutors. She expects 4,400 online lessons at an average price of £24 and subscriptions to recorded content.',
         o2=dict(cap=12000, rev=[('live lessons', 4400 * 24), ('revision subscriptions', 90 * 120)], cos=45, cos_what='tutor fees and platform costs', exp=[('Platform subscription, marketing and insurance per year', 13200), ('Other expenses per year', 4800)], draw=16000, c_label='Contribution per live lesson after variable costs', c_val='£13.20', u_label='Forecast live lessons per year', units=4400),
         finance='Priyanka has £12,000 in savings. A bank has offered a loan at 9% interest and a local enterprise scheme may provide a grant of £2,000 for online start-ups.'),
    dict(k=5, client='Callum and Beth', biz='their growing business', title='Callum and Beth Doyle — taproom or retail bottles', theme='Expansion: taproom vs retail distribution',
         intro='You are working for a local organisation that supports small businesses and have been asked to advise Callum and Beth Doyle. They run a small craft brewery that sells beer to pubs. Their aims are to increase annual revenue by 50% within two years and to increase profit.',
         clients_ask='They have two options for growth and have asked you to recommend which they should choose.', o1_short='Opening a taproom beside the brewery selling draught beer, food and merchandise.', o2_short='Bottling their beers for sale to independent shops and supermarkets.',
         mh='The craft beer market', market='UK craft beer sales are worth about £1.5 billion but growth has slowed to 3% a year. More than 2,000 small breweries operate in the UK and about one in ten closed last year because of energy, barley and packaging costs. Taprooms and direct-to-customer sales are growing faster, as brewers earn higher margins than selling to pubs.',
         competition='There are five taprooms within 20 miles of the brewery. Supermarkets stock more than 100 craft brands and demand low prices and large volumes. Independent bottle shops pay higher prices but buy smaller quantities.',
         bh='Callum and Beth Doyle — background', background='The business has retained profits of £18,000. Callum is the brewer and Beth manages sales. They employ two part-time staff. Neither has experience of running a bar or negotiating with supermarkets.',
         o1_name='Taproom', o1_desc='The brewery has space for a taproom that seats 60 people. Conversion costs £42,000. Opening hours would be Thursday to Sunday. They expect 14,000 pints a year at an average price of £5.60, and £38,000 of food and merchandise.',
         o1=dict(cap=60000, rev=[('draught beer', 14000 * 5.6), ('food and merchandise', 38000)], cos=30, cos_what='beer, food, merchandise', exp=[('Extra staff wages per year', 36000), ('Utilities, licences and insurance per year', 14500)], draw=26000, c_label='Contribution per pint after variable costs', c_val='£3.92', u_label='Forecast pints sold per year', units=14000),
         o2_name='Bottling and retail', o2_desc='A bottling line would cost £55,000, plus £6,000 for labels and design. They expect to sell 90,000 bottles at an average price of £1.65 to shops and 25,000 at £1.40 to a supermarket if they win its listing.',
         o2=dict(cap=75000, rev=[('independent shops', 90000 * 1.65), ('supermarket', 25000 * 1.4)], cos=55, cos_what='beer, bottles, labels, packaging', exp=[('Extra staff, delivery and maintenance per year', 22000), ('Marketing and other expenses per year', 8500)], draw=26000, c_label='Contribution per bottle after variable costs', c_val='£0.70', u_label='Forecast bottles sold per year', units=115000),
         finance='The brewery has £18,000 in savings. The bank will lend £60,000 at 8% interest, and a regional grant could cover 20% of equipment costs.'),
    dict(k=6, client='Rosa', biz='her expanding business', title='Rosa Delgado — wholesale or high-street shop', theme='Expansion: wholesale vs retail shop',
         intro='You are working for a local organisation that supports small businesses and have been asked to advise Rosa Delgado. Rosa runs a successful home bakery selling cakes and brownies at markets and online. Her aims are to double annual revenue within two years and to increase profit.',
         clients_ask='Rosa has two options and has asked you to recommend which she should choose.', o1_short='Supplying cafés and hotels with her cakes on a wholesale basis from a rented production unit.', o2_short='Opening a retail bakery shop on the high street.',
         mh='The UK bakery and cake market', market='The UK bakery market is worth about £4.5 billion. Premium cakes and “bake at home” products are growing 7% a year, and wholesale demand has risen as cafés look for local suppliers. However, ingredient prices are up 18% in two years and about 15% of independent bakeries have closed in three years.',
         competition='Three supermarkets sell cakes for £1.50–£3 per slice. A national café chain buys cakes from large industrial bakers at very low prices. On the high street, two bakeries and a patisserie already operate.',
         bh='Rosa Delgado — background', background='Rosa has £12,000 saved from her business. She has a loyal following online and good baking skills but no experience of managing staff or large orders. She would employ one baker and one assistant for either option.',
         o1_name='Wholesale unit', o1_desc='A rented production unit costs £850 a month. Equipment and a refrigerated van would cost £38,000. Rosa has three cafés interested in weekly orders. She estimates 52,000 cake slices a year at £1.75 and 600 celebration cakes at £45.',
         o1=dict(cap=50000, rev=[('cake slices', 52000 * 1.75), ('celebration cakes', 600 * 45)], cos=40, cos_what='ingredients and packaging', exp=[('Rent, energy and insurance per year', 17400), ('Staff wages and other expenses per year', 33800)], draw=24000, c_label='Contribution per cake slice after variable costs', c_val='£1.05', u_label='Forecast cake slices per year', units=52000),
         o2_name='High-street shop', o2_desc='The shop rents for £2,100 a month with a five-year lease. Fit-out would cost £45,000. Rosa estimates 28,000 customers a year spending an average of £6.20 on cakes, coffee and gifts, plus £15,000 from celebration cakes.',
         o2=dict(cap=57000, rev=[('shop sales', 28000 * 6.2), ('celebration cakes', 15000)], cos=33, cos_what='ingredients, drinks, packaging', exp=[('Rent, rates, energy and insurance per year', 36500), ('Staff wages and other expenses per year', 52000)], draw=24000, c_label='Contribution per customer after variable costs', c_val='£4.15', u_label='Forecast customers per year', units=28000),
         finance='Rosa has £12,000 in savings. She could borrow from a bank at 9% interest. A shop lease would require a deposit of three months’ rent.'),
    dict(k=7, client='Imran', biz='his new business', title='Imran Qureshi — repair shop or repair van', theme='New business: shop vs mobile service',
         intro='You are working in a business advice centre and Imran Qureshi has come to you for advice. Imran has been a mobile phone technician for six years and wants to set up his own business. His aims are to break even in his first year and to grow turnover and profit in years 2 and 3.',
         clients_ask='Imran has identified two options and has asked you to recommend which he should choose.', o1_short='Opening a phone and tablet repair shop in a shopping arcade.', o2_short='Operating a mobile repair service from a van that visits homes and workplaces.',
         mh='The device repair market', market='The UK device repair market is worth about £1.1 billion and growing at 8% a year, as people keep phones for longer. Around 1 in 3 adults has had a cracked screen in the last two years. “Right to repair” rules are expanding but manufacturers’ spare parts prices have risen.',
         competition='Two national repair chains and three independent shops operate in the town centre, charging £60–£110 for a screen repair. Online mail-in services have reduced prices.',
         bh='Imran Qureshi — background', background='Imran has £9,000 in savings. He has excellent technical skills and certificates from manufacturers but little experience of marketing. Customers value same-day repairs.',
         o1_name='Repair shop', o1_desc='The arcade unit costs £1,100 a month. Fit-out and equipment would cost £14,000 and stock of parts £4,000. Imran estimates 3,600 repairs a year at an average of £78 and £18,000 of accessory sales.',
         o1=dict(cap=21000, rev=[('repairs', 3600 * 78), ('accessories', 18000)], cos=34, cos_what='parts and accessories', exp=[('Rent, rates and insurance per year', 17400), ('Assistant wages and other expenses per year', 24800)], draw=22000, c_label='Contribution per repair after variable costs', c_val='£51.48', u_label='Forecast repairs per year', units=3600),
         o2_name='Mobile repair van', o2_desc='A fitted van would cost £16,000. Imran would visit customers by appointment and advertise online. He estimates 2,200 repairs a year at an average of £88 plus £12,000 from workplace contracts.',
         o2=dict(cap=19000, rev=[('repairs', 2200 * 88), ('workplace contracts', 12000)], cos=30, cos_what='parts', exp=[('Fuel, insurance and van costs per year', 9800), ('Marketing and other expenses per year', 6400)], draw=22000, c_label='Contribution per repair after variable costs', c_val='£61.60', u_label='Forecast repairs per year', units=2200),
         finance='Imran has £9,000 in savings. He could borrow £15,000 from a bank at 9.5% interest or use hire purchase for the van.'),
    dict(k=8, client='Freya', biz='her new business', title='Freya Lindqvist — yoga studio or online memberships', theme='New business: studio vs online',
         intro='You are working in a business advice centre and Freya Lindqvist has come to you for advice. Freya is a qualified yoga teacher who has worked at a gym for four years. Her aims are to break even in her first year and to grow turnover and profit in years 2 and 3.',
         clients_ask='Freya has identified two options and has asked you to recommend which she should choose.', o1_short='Opening a yoga studio offering classes and workshops.', o2_short='Launching an online membership with live and recorded classes.',
         mh='The yoga and wellbeing market', market='The UK yoga market is worth about £0.9 billion, with around 3 million regular participants. Online fitness grew rapidly after 2020 but studio attendance has recovered, with boutique studios growing 9% a year. Wellbeing and mental-health benefits are the most common reasons people join. Studio rents and energy costs have risen sharply.',
         competition='Four yoga studios operate within five miles; the average drop-in class costs £12. Free online videos are widely available and subscription apps cost around £10 a month.',
         bh='Freya Lindqvist — background', background='Freya has £11,000 in savings. She has a strong local following and a diploma in teaching. She has no experience of running accounts. For either option she would hire two part-time teachers.',
         o1_name='Yoga studio', o1_desc='She would rent a first-floor unit for £1,000 a month. Fit-out and equipment would cost £16,000. She expects 9,000 class attendances a year at an average of £9.50 and 20 workshops at £1,100 each.',
         o1=dict(cap=24000, rev=[('class attendances', 9000 * 9.5), ('workshops', 20 * 1100)], cos=20, cos_what='teachers’ fees, consumables', exp=[('Rent, utilities and insurance per year', 17200), ('Other staff and marketing per year', 21800)], draw=22000, c_label='Contribution per class attendance after variable costs', c_val='£7.60', u_label='Forecast class attendances per year', units=9000),
         o2_name='Online membership', o2_desc='Freya would invest £5,500 in a platform and filming equipment. Members would pay £14 a month for live and recorded classes. She expects an average of 480 members during the year.',
         o2=dict(cap=8000, rev=[('membership fees', 480 * 14 * 12), ('workshops', 12 * 300)], cos=22, cos_what='platform fees, teachers, payment fees', exp=[('Marketing and software per year', 9600), ('Other expenses per year', 3600)], draw=16000, c_label='Contribution per member per month after variable costs', c_val='£10.92', u_label='Forecast member-months per year', units=5760),
         finance='Freya has £11,000 in savings. A bank has offered a loan of up to £15,000 at 9% interest.'),
    dict(k=9, client='Tom and Ayo', biz='their new business', title='Tom and Ayo — valeting hub or mobile valeting', theme='New business: fixed site vs mobile',
         intro='You are working in a business advice centre and Tom and Ayo Bello, brothers who have worked in car dealerships, have come to you for advice. They want to start a car-cleaning business. Their aims are to break even in the first year and to grow turnover and profit in years 2 and 3.',
         clients_ask='They have identified two options and have asked you to recommend which they should choose.', o1_short='Renting a unit to run a car valeting and detailing hub.', o2_short='Offering mobile valeting from two small vans at customers’ homes and workplaces.',
         mh='The car-care market', market='The UK car-care and valeting market is worth about £1.2 billion. Demand for ceramic coatings and detailing has doubled in five years, and electric-vehicle owners are more likely to pay for premium services. Many people now prefer convenient services at home or work. Hand car washes face rising scrutiny over labour practices and water use.',
         competition='Three hand car washes and one automatic wash operate within three miles, charging £10–£20 for a basic wash. Specialist detailers charge £120–£350 for a full interior and exterior detail.',
         bh='Tom and Ayo — background', background='The brothers have £14,000 in savings between them. They have strong valeting skills and many contacts through dealerships. They would employ one part-time worker for either option.',
         o1_name='Valeting hub', o1_desc='A unit with water recycling would cost £1,300 a month, plus £26,000 for equipment. They expect 3,000 basic washes at £28, and 450 full details at £165.',
         o1=dict(cap=40000, rev=[('washes', 3000 * 28), ('full details', 450 * 165)], cos=22, cos_what='chemicals, water, supplies', exp=[('Rent, utilities and insurance per year', 21600), ('Staff wages and other expenses per year', 33900)], draw=40000, c_label='Contribution per basic wash after variable costs', c_val='£21.84', u_label='Forecast basic washes per year', units=3000),
         o2_name='Mobile valeting', o2_desc='Two vans and equipment would cost £29,000. Customers book online. They expect 2,400 washes at £32 and 380 full details at £150.',
         o2=dict(cap=36000, rev=[('washes', 2400 * 32), ('full details', 380 * 150)], cos=24, cos_what='chemicals, water, supplies', exp=[('Fuel, insurance and van costs per year', 15800), ('Staff wages and other expenses per year', 26200)], draw=40000, c_label='Contribution per wash after variable costs', c_val='£24.32', u_label='Forecast washes per year', units=2400),
         finance='The brothers have £14,000 in savings. A bank has offered a loan at 9% interest and van finance at 8%.'),
    dict(k=10, client='Hana', biz='her new business', title='Hana Kowalski — flower shop or subscription service', theme='New business: shop vs subscription',
         intro='You are working in a business advice centre and Hana Kowalski has come to you for advice. Hana has worked for a florist for seven years and wants to start her own business. Her aims are to break even in her first year and to grow turnover and profit in years 2 and 3.',
         clients_ask='Hana has identified two options and has asked you to recommend which she should choose.', o1_short='Opening a flower shop in her local high street.', o2_short='Launching an online flower subscription service delivering weekly or monthly bouquets.',
         mh='The flower market', market='The UK flower and plant market is worth about £2.5 billion. Online and subscription sales are growing quickly (15% a year), while high-street florist numbers have fallen by 25% in ten years. Flowers are bought mainly for gifts, weddings and special occasions, with peaks around Valentine’s Day and Mother’s Day. Most cut flowers are imported, so exchange rates and transport costs affect prices.',
         competition='Supermarkets sell bouquets from £4–£10. Two florists operate on the high street charging £25–£60 for a bouquet. National online companies offer next-day delivery from £22.',
         bh='Hana Kowalski — background', background='Hana has £8,000 in savings. She has strong design skills and good contacts with wholesale growers, but she has no experience of online marketing. She would work alone with one part-time helper in busy periods.',
         o1_name='High-street shop', o1_desc='The shop rents for £1,200 a month. Fit-out and equipment (including a cold room) would cost £13,000. She expects 7,500 bouquet and arrangement sales at an average of £32 and £22,000 from weddings and events.',
         o1=dict(cap=20000, rev=[('bouquets and arrangements', 7500 * 32), ('weddings and events', 22000)], cos=42, cos_what='flowers, packaging, wastage', exp=[('Rent, rates and insurance per year', 19800), ('Helper wages and other expenses per year', 14200)], draw=22000, c_label='Contribution per bouquet after variable costs', c_val='£18.56', u_label='Forecast bouquets and arrangements per year', units=7500),
         o2_name='Subscription service', o2_desc='Hana would work from a rented workroom (£400 a month) and use a courier for deliveries. Website and equipment would cost £8,500. She expects 6,000 subscription deliveries at an average of £27 and £9,000 from events.',
         o2=dict(cap=12000, rev=[('subscription deliveries', 6000 * 27), ('events', 9000)], cos=46, cos_what='flowers, packaging, courier', exp=[('Workroom, website and insurance per year', 11200), ('Marketing and other expenses per year', 9800)], draw=18000, c_label='Contribution per delivery after variable costs', c_val='£14.58', u_label='Forecast deliveries per year', units=6000),
         finance='Hana has £8,000 in savings. A bank has offered a loan of up to £12,000 at 9% interest.'),
]


def papers():
    return [build(c) for c in CASES]


if __name__ == '__main__':
    for q in papers():
        print(q['id'], q['title'], len(q['partA']), len(q['partB']), q['total'])
