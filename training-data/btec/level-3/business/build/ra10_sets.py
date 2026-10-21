# RA10 practice set tasks for Units 2, 6 and 7 (original cases in the Pearson format).

def p(x): return {'t': 'p', 'x': x}
def h(x): return {'t': 'h', 'x': x}
def li(*x): return {'t': 'li', 'x': list(x)}
def stat(q, cells, vals): return {'t': 'stat', 'x': {'q': q, 'c': cells, 'v': [str(v) for v in vals]}}
def grid(head, rows): return {'t': 'grid', 'head': head, 'rows': rows}
def cap(x): return {'t': 'cap', 'x': x}

def act(n, marks, text, kind):
    return {'n': n, 'marks': marks, 'text': text, 'kind': kind}

def paper(pid, unit, key, title, theme, total, acts, A, B, minutes=180):
    return {'id': pid, 'unit': unit, 'key': key, 'series': 'RA10 practice', 'title': title, 'theme': theme, 'source': 'ra10', 'kind': 'set', 'total': total,
            'acts': acts, 'partA': A, 'partB': B, 'prep': {}, 'minutes': minutes}

# ───────────────────────── UNIT 2 ─────────────────────────
def u2_acts(name, aim_extra=''):
    a1 = ('Prepare a rationale for a marketing campaign for %s.\n• marketing aims and objectives\n• analysis of research data on the market and competition\n'
          '• an evaluation of the reliability and validity of the information provided\n• a justification for your rationale.') % name
    a2 = ('Based on your rationale from Activity 1, you must produce a plan for the marketing campaign for %s.\n• marketing mix\n• marketing message\n• selection of media\n• campaign budget\n• timescale.\n'
          'You must produce this plan in an appropriate written format for the owners of %s.') % (name, name)
    return [act(1, 34, a1, 'rationale'), act(2, 36, a2, 'plan')]

def u2_glow():
    A = [h('Set Task Brief'),
         p('You have been asked to write a proposal for a marketing campaign for a business called Glow Candle Co. The business produces and sells hand-poured soy candles. The business owners want to increase sales in the autumn and winter gifting season.'),
         p('You are required to use the research you have been given to independently analyse the market for candles in the UK. This research includes primary and secondary data relating to: competitors; market size, share and structure; target market; trends; external influences; and media options. You are allowed a maximum of two sides of A4 of your individually prepared notes and you may annotate Part A to support you during the Part B supervised assessment.'),
         h('The UK candle market'),
         p('The UK home fragrance market, which includes candles, is estimated to be worth about £1.2 billion and has grown by an average of 6% a year over the past five years. Candles are bought both for the home and as gifts: Mintel reports that 41% of all candle purchases are gifts and that sales peak between October and December. Interest in sustainable products has led to growth in soy and vegan wax candles, refill pots and recyclable packaging. A Which? survey in 2023 found that 62% of UK buyers say they would pay more for a candle that is plastic-free and made in the UK. Social media “candle hauls”, unboxing videos and TikTok recommendations have made candles a visual, shareable product. The market is forecast to grow to about £1.6 billion by 2028.'),
         p('However, a trade-journal article warns that the cost of living is leading many consumers to buy cheaper supermarket candles, and that rising wax and shipping costs are reducing the margins of small producers. Candle-related fires have also led to calls for clearer safety labelling.'),
         h('Competitors'),
         grid(['Brand', 'Position in the market', 'Typical price (per 200 g candle)', 'Main promotion'],
              [['Luma & Co', 'Premium, luxury scents; strong online brand', '£28.00', 'Influencers, magazine features, own stores'], ['HomeBright', 'Value range sold in supermarkets', '£8.00', 'Supermarket offers, TV advertising'], ['Wick & Willow', 'Independent, vegan wax, eco packaging', '£18.00', 'Instagram, craft fairs'], ['Glow Candle Co.', 'Hand-poured soy, UK-made, plastic-free packaging', '£16.00 (limited editions £22.00)', 'Own website, Instagram (4,200 followers), email list of 1,500']]),
         p('Luma & Co has an estimated 18% share of UK online candle sales. In 2023 it opened a pop-up “scent bar” in Manchester for two weeks, which increased its website traffic by 34% and social media mentions by 210%. Wick & Willow offers refill pots at £11 and a loyalty card; its sales grew by 15% last year. HomeBright dominates supermarket shelves with seasonal gift sets.'),
         h('Glow Candle Co.'),
         p('Glow Candle Co. was founded four years ago by two friends who pour candles in a converted garage workshop. The business sells through its website and occasional craft fairs. Over the past 12 months sales of its core range (six scents) fell by 8%, although sales of personalised-label candles increased by 12%. The owners donate 5% of profits to a local woodland charity. A shortage of storage space limits how many candles can be made before the Christmas season. The owners want to boost sales over the autumn and winter and have set a budget for the campaign.'),
         h('Glow Candle Co.: Market Research Report'),
         p('Month: September 2024 · Sample size: 600 · Location: busy shopping centre, outside a gift shop · Sample: individuals aged 16 to 75'),
         stat('Age', ['16–25', '26–35', '36–45', '46–55', '56–65', '66–75'], [92, 138, 126, 104, 81, 59]),
         stat('Do you buy candles at least twice a year?', ['Yes', 'No'], [408, 192]),
         stat('Do you buy candles as gifts?', ['Yes', 'No'], [372, 228]),
         stat('What do you consider most important when buying a candle? (Select all that apply.)', ['Scent', 'Price', 'Burn time', 'Eco-friendly/plastic-free', 'Packaging/design', 'Personalisation', 'Brand'], [551, 438, 301, 276, 334, 215, 172]),
         stat('How much would you pay for a good-quality candle?', ['£0–8', '£8–12', '£12–16', '£16–20', '£20+'], [74, 138, 214, 121, 53]),
         stat('Where would you most likely buy a candle as a gift? (Select all that apply.)', ['Online', 'Gift shops', 'Christmas markets', 'Supermarkets', 'Department stores'], [356, 412, 241, 307, 188]),
         stat('Which social media platforms do you use daily? (Select all that apply.)', ['Instagram', 'TikTok', 'Facebook', 'Pinterest', 'None'], [342, 264, 288, 97, 51]),
         h('Research on media selection'),
         p('Glow Candle Co. has researched the following media options for its autumn/winter campaign.'),
         grid(['Media option', 'Costs and information'],
              [['Instagram and Facebook ads', '£0.40–£0.90 per click; 35 million UK users; targeting by age, interest and location'], ['TikTok ads', 'About £9 per 1,000 views; 26% of UK users are aged 15–24'], ['Influencers', '£30–£400 per post depending on followers; some work for free products; typically gain 2–10K new followers a month'], ['Christmas markets / pop-up stands', '£150–£900 per weekend stand (large city markets £600–£900); staff £11 per hour; footfall 5,000–30,000'], ['Gift-shop and retailer listings', 'Listing fee £250 per retailer; retailer takes 35% of the selling price; 120 independent gift shops identified'], ['Local radio', '£200–£1,200 per week for a 30-second advert; production £350'], ['Printing', 'A5 leaflets £28 per 1,000; posters A3 £95 per 100; local newspaper insert £30 per 1,000'], ['Other', 'Photography £400 · video production £800–£4,000 · packaging redesign £1,500 · gift-box samples £3 each · website upgrade £2,200 · insurance for stands £120']])]
    B = [h('The market for gifting candles'),
         p('Over the past three years the number of people buying candles as gifts has risen steadily. Glow Candle Co. makes a range of hand-poured soy candles in recyclable glass jars with paper labels and offers a personalised label service at a premium price. Sales are almost entirely through its own website and the owners ship direct to customers by post. Customers can choose from six scents and four limited-edition seasonal scents.'),
         h('Increasing sales'),
         p('Over the past 12 months the owners reported a fall in sales of their core range, despite a small increase in sales of personalised candles. They are worried that they are not reaching enough new customers and want to boost sales over the next five months.'),
         p('The owners are considering two options to help them achieve their goal:'),
         p('EITHER'), p('Selling at Christmas markets and pop-up stands'), p('OR'), p('Selling through gift shops and retailers.'),
         p('The owners of Glow Candle Co. have allocated a budget of £40 000 for the campaign. The campaign should run for 20 weeks starting in mid-September.')]
    return paper('U2-R1', 2, '9901', 'Glow Candle Co. — hand-poured candles', 'Gifting season campaign', 70, u2_acts('Glow Candle Co.'), A, B)

def u2_brew():
    A = [h('Set Task Brief'),
         p('You have been asked to write a proposal for a marketing campaign for a business called Brew Haven. The business roasts speciality coffee and sells it by subscription. The owners want to increase the number of subscribers.'),
         p('You are required to use the research you have been given to independently analyse the market for coffee subscriptions in the UK. This research includes primary and secondary data relating to: competitors; market size, share and structure; target market; trends; external influences; and media options. You are allowed a maximum of two sides of A4 of your individually prepared notes.'),
         h('The UK coffee market'),
         p('The UK coffee market is worth about £4.7 billion a year. Home coffee consumption grew rapidly after 2020 and in 2024 an estimated 55% of adults drink coffee at home at least once a day. Speciality coffee – single-origin, freshly roasted beans – is the fastest growing part of the market, growing by about 9% a year compared with 2% for instant coffee. Subscription services allow customers to receive fresh beans on a regular schedule. A report by the Specialty Coffee Association found that 1 in 7 UK coffee drinkers has tried a coffee subscription, but that 38% cancel within six months, mainly because of cost or because they have too much coffee.'),
         p('Environmental concerns are shaping the market: 64% of coffee buyers say they check whether coffee is ethically sourced, and compostable packaging is increasingly expected. Rising green-coffee prices have forced many roasters to increase prices by 10–15%. Office coffee is also changing: following the growth of hybrid working, many businesses have replaced large catering contracts with smaller subscription deals for shared kitchens.'),
         h('Competitors'),
         grid(['Business', 'Offer', 'Price (250 g bag)', 'Notes'],
              [['Bean Street', 'National subscription brand; app, personalised taste quiz', '£9.50', '120,000 subscribers; heavy online advertising'], ['Monarch Roasters', 'Premium single-origin; coffee-tasting events', '£14.00', 'Sponsors running and cycling events'], ['Supermarket own brand', 'Whole-bean ranges', '£4.50', 'Wide distribution; promotions'], ['Brew Haven', 'Small-batch roasted, compostable packaging, 3 delivery options', '£10.50', '6,200 subscribers; Instagram 7,800 followers']]),
         h('Brew Haven'),
         p('Brew Haven was started six years ago by Idris and Maya, who roast beans in an industrial unit and deliver by post. The business has 6,200 active subscribers who pay by direct debit. Over the past year the number of new subscribers has fallen by 11% and cancellations have risen. The owners have a database of 14,000 past and current customers who receive a monthly newsletter, and they have started selling a small range of brewing equipment and gift boxes. The business uses 100% compostable packaging and donates 10p from each bag to a coffee-growing community project.'),
         h('Brew Haven: Market Research Report'),
         p('Month: October 2024 · Sample size: 800 · Location: two railway stations and a university campus · Sample: individuals aged 18 to 70'),
         stat('Age', ['18–24', '25–34', '35–44', '45–54', '55–70'], [212, 241, 148, 117, 82]),
         stat('How often do you drink coffee at home?', ['Daily', 'A few times a week', 'Occasionally', 'Never'], [418, 236, 104, 42]),
         stat('Have you ever had a coffee subscription?', ['Yes – currently', 'Yes – cancelled', 'No'], [96, 144, 560]),
         stat('Why did you cancel (or why might you)? (Select all that apply.)', ['Too expensive', 'Too much coffee', 'Lack of choice', 'Poor delivery', 'Quality'], [187, 231, 90, 76, 58]),
         stat('What would encourage you to subscribe? (Select all that apply.)', ['Free first bag', 'Flexible delivery dates', 'Ethical sourcing', 'Discount for friends', 'Free equipment'], [502, 478, 346, 329, 251]),
         stat('How much would you pay for a 250 g bag?', ['Under £7', '£7–£10', '£10–£13', '£13–£16', 'Over £16'], [128, 301, 247, 94, 30]),
         stat('Where would you be happy to try coffee samples? (Select all that apply.)', ['Online/free sample in post', 'Food festivals', 'Workplace', 'Sports events', 'Supermarkets'], [455, 336, 268, 142, 203]),
         h('Research on media selection'),
         grid(['Media option', 'Costs and information'],
              [['Instagram / Facebook ads', '£0.45–£1.10 per click; targeted by age, interests and location'], ['YouTube/podcast sponsorship', '£300–£2,500 per episode or video depending on audience'], ['Influencers', '£40–£600 per post; food and lifestyle accounts; many accept free product'], ['Food festivals and stalls', '£120–£1,500 per weekend stall; staff £12 per hour; sampling costs about £0.35 per cup'], ['Workplace/co-working partnerships', 'Free sample kit £6 per workplace; corporate account manager £28,000 salary (part-time £14,000); brewers loaned £90 each'], ['Sponsorship (events/clubs)', '£300–£3,000 per event; community running and cycling events attract 500–3,000 participants'], ['Printing and packaging inserts', 'Leaflets £32 per 1,000; postcard inserts £18 per 1,000; branded cups £0.12 each'], ['Other', 'Video production £1,200–£6,000 · photography £450 · voice-over £600 · website changes £2,500 · market-stand insurance £140']])]
    B = [h('The coffee subscription market'),
         p('Brew Haven operates online and by post. Customers select the size and frequency of their subscription and pay monthly. The owners want to grow subscriber numbers as quickly as possible and to reduce cancellations. They have identified that many customers try subscriptions through a free first bag or at events.'),
         h('Increasing subscribers'),
         p('The owners of Brew Haven are considering two options to help them achieve their goal:'),
         p('EITHER'), p('Partnering with workplaces and co-working spaces to offer office coffee subscriptions'), p('OR'), p('Sponsoring community sports events and selling at food festivals.'),
         p('The owners of Brew Haven have allocated a budget of £55 000 for the campaign. The campaign should run for six months.')]
    return paper('U2-R2', 2, '9902', 'Brew Haven — coffee subscriptions', 'Subscription growth campaign', 70, u2_acts('Brew Haven'), A, B)

# ───────────────────────── UNIT 6 ─────────────────────────
def u6_acts(name, t1, t2, goals):
    a1 = ('With reference to the information and data in the Part A Set Task Information, you must prepare a report for %s.\nYour report should:\n• show your understanding of %s\n• recommend how %s could improve this to help them achieve their goals.\nThe report should be word processed and in size 12 font.') % (name, t1[0], t1[1])
    a2 = ('With reference to the information and data in the Part A Set Task Information, you need to prepare a presentation to be delivered to %s. The presentation must be accompanied by speaker notes/script.\nThe presentation should:\n• show your understanding of %s\n• recommend how %s could improve this to help them achieve their goals.') % (name, t2[0], t2[1])
    return [act(1, 44, a1, 'report'), act(2, 44, a2, 'presentation')]

def u6_kestrel():
    A = [h('Part A Set Task Information'),
         h('Kestrel Couriers Ltd'),
         p('Kestrel Couriers Ltd is a parcel delivery business based in the Midlands. It was founded in 2012 by Rhys Calloway, who still runs the company with his sister, Dana. The business collects parcels from online retailers and delivers them to homes and businesses across the region. It has the following mission statement: “To deliver every parcel on time and in perfect condition.”'),
         p('The business goals are: to increase market share; to keep its reputation for reliability; and to retain experienced staff.'),
         p('Kestrel has a core group of permanent drivers and warehouse staff. Rhys and Dana manage all staff directly and there are no team leaders. Over the past two years the business won contracts with three large online retailers and delivery volumes more than doubled. To cope with demand Kestrel opened a second depot, introduced a six-day working week and hired agency drivers through a local agency. Agency drivers were given a 20-minute briefing and shown a route map. Rhys said that additional training would “cost money and take drivers off the road”.'),
         p('There is no system for checking parcels at the depot. Drivers are told to “do their best” and mistakes are only noticed when customers complain. Rhys often shouts at drivers in the yard when parcels are late or damaged. Dana, who handles customer complaints, has started to dread opening her emails. A recent attempt to introduce a mobile tracking app was abandoned after drivers said they had not been shown how to use it and that it was “just another way of watching us”.'),
         p('Rhys has recently moved the company to the cheapest available packaging supplier and tyre supplier. Several deliveries have been delayed by vehicle breakdowns. Drivers have complained that they are paid by the parcel, not by the hour, so there is pressure to rush. The two retailers who account for 60% of volume have written to say that they will review their contracts if performance does not improve.'),
         grid(['', '2021', '2022', '2023'], [['Percentage of agency drivers', '4%', '28%', '58%'], ['Labour turnover (permanent staff)', '8%', '17%', '39%'], ['Staff absence (days lost)', '3%', '6%', '19%'], ['Employee satisfaction rating', '70%', '55%', '31%']]),
         cap('Figure 1: Extract from the staffing information for Kestrel Couriers Ltd 2021–2023'),
         grid(['', '2021', '2022', '2023'], [['Parcels delivered late', '3%', '9%', '24%'], ['Parcels damaged', '1%', '4%', '13%'], ['Customer satisfaction rating', '96%', '85%', '66%'], ['Customer complaints (per month)', '40', '210', '780']]),
         cap('Figure 2: Extract from the delivery and quality information for Kestrel Couriers Ltd 2021–2023'),
         p('Dana visited a rival courier that is a member of a regional quality scheme. She found that drivers met in teams every Monday to discuss problems and improvements, supervisors checked a sample of parcels every day, managers handed out “driver of the month” awards, and the company had achieved a recognised customer-service standard. The rival also had a structure of team leaders for each route area and offered flexible shift patterns. Dana returned convinced that Kestrel needed to change.')]
    B = [h('Set Task'), p('You must complete both activities.')]
    acts = u6_acts('Rhys and Dana Calloway, the owners of Kestrel Couriers Ltd',
                   ('the current quality management issues at Kestrel Couriers Ltd', 'Rhys and Dana'),
                   ('the issues created by the business culture and management style at Kestrel Couriers Ltd', 'Rhys and Dana'), None)
    return paper('U6-R1', 6, '9901', 'Kestrel Couriers Ltd', 'Quality management and business culture', 88, acts, A, B)

def u6_harbour():
    A = [h('Part A Set Task Information'),
         h('Harbour Hotels Group'),
         p('Harbour Hotels Group is a group of eight coastal hotels in the south west of England. It was founded in 1998 by the Thornton family and is now led by Chief Executive Elaine Thornton. The group’s mission statement is: “To give every guest a welcome they remember.”'),
         p('Its business goals are: to increase profit by 10% over the next two years; to improve customer review scores; and to be the best employer in the local hospitality sector.'),
         p('Each hotel has a general manager who reports to Elaine. Managers have always been expected to follow detailed procedures set by head office on staffing, pricing and menus. Decisions are made at head office and passed down by email. In the past year Elaine introduced a new cloud booking and housekeeping system across all hotels to replace paper systems and spreadsheets. The change was announced by email three weeks before go-live. Staff received a 45-minute online video as training. Receptionists said the system was slow and housekeepers were given tablets but no time to learn them. Several experienced night receptionists resigned.'),
         p('General managers were told to “make it work” and were not consulted about timing. Some hotels lost bookings because rooms were double-booked. At a recent meeting, one manager said the change felt “like something done to us rather than with us”. Meanwhile, a survey showed that team members at the hotels wanted more say in rotas, clear career paths and recognition for good service. The group has no performance appraisal system; pay rises are decided at head office once a year.'),
         grid(['', '2021', '2022', '2023'], [['Staff turnover', '21%', '24%', '36%'], ['Staff satisfaction', '62%', '58%', '39%'], ['Average review score (out of 5)', '4.6', '4.4', '3.9'], ['Bookings lost through system errors', '—', '—', '5.2%'], ['Profit (as % of revenue)', '14%', '12%', '7%']]),
         cap('Figure 1: Extract from performance information for Harbour Hotels Group 2021–2023'),
         p('Elaine also visited a competitor, Seagate Hotels. At Seagate, general managers help set targets and meet monthly to share ideas; staff are trained on new systems for two days before they are introduced; each employee has an annual appraisal and a development plan; and the company runs an annual “spotlight awards” evening. Seagate also introduced its new booking system gradually, hotel by hotel, with a team of “system champions” from each department. Elaine said: “We are good at running hotels, but not at managing change.”')]
    B = [h('Set Task'), p('You must complete both activities.')]
    acts = u6_acts('Elaine Thornton, Chief Executive of Harbour Hotels Group',
                   ('the current leadership and management issues at Harbour Hotels Group', 'Elaine Thornton'),
                   ('the problems with how change was managed at Harbour Hotels Group and the current approach to staff development and motivation', 'Elaine Thornton'), None)
    return paper('U6-R2', 6, '9902', 'Harbour Hotels Group', 'Leadership, change, motivation and development', 88, acts, A, B)

# ───────────────────────── UNIT 7 ─────────────────────────
def u7_acts(client, biz):
    a1 = ('You are to produce a report that examines the two options that %s is considering for %s. Your report must address both options and include:\n• an assessment of\n  – the key factors and risks\n  – the implications for resources\n• appropriate financial forecasts\n• an interpretation of financial information using ratio analysis\n• the use of appropriate decision-making tools to make a supported recommendation to %s.\nYour report must be set within the context of the business and its aims. Your report should be presented in an appropriate format for %s. You should present your report as a word-processed document in a minimum of 12 point font.') % (client, biz, client, client)
    a2 = ('Using appropriate software, prepare a presentation to %s. The presentation should:\n• summarise the recommendations made in your report\n• give your rationale for the recommendations made.\nThe presentation must be accompanied by speaker notes or a script that will engage and convince %s of the viability of your recommendations.') % (client, client)
    return [act(1, 52, a1, 'report'), act(2, 18, a2, 'presentation')]

def u7_anya():
    A = [h('Set Task Information'),
         p('You are working in a business advice centre and Anya Petrova has come to you for advice. Anya has worked for six years as a ceramics teacher at an adult education college. The college has told her that her hours will be cut next year. Anya has always wanted to run her own business and has some savings. Her aims are to establish the business so that it breaks even in its first year, and to grow turnover and profit in years 2 and 3.'),
         p('Anya has identified two options and has asked you to recommend which she should choose.'),
         p('Option 1 Opening a pottery studio offering classes, workshops and studio hire.'),
         p('Option 2 Opening an online shop selling craft-supply kits (clay, glazes and tools) to home potters.'),
         h('The craft and hobby market'),
         p('The UK craft market is estimated to be worth £3.5 billion a year. Interest in pottery has risen sharply since a popular TV series in 2020. The number of pottery studios in the UK has doubled in five years. Around 1 in 5 adults say they would like to try a craft class in the next year. At the same time, studio costs have risen because of energy prices – electric kilns are expensive to run – and 30% of new studios close within three years. Online craft retail grew by 14% last year and is dominated by a few large marketplaces; the average online craft shopper spends £210 a year and 70% of purchases are made on mobile phones. Delivery costs for heavy clay products are high and breakages typically add 3–5% to costs.'),
         p('Competition: five pottery studios already operate within 15 miles of Anya’s town, charging £35–£55 for a two-hour class. Large online suppliers offer free delivery above £50.'),
         h('Anya Petrova — background'),
         p('Anya has savings of £10,000 and teaches part-time for the college until the end of the year. She has strong technical skills and a good local reputation but no experience of marketing or accounting. She would take on the business full time if she chose Option 1 and would work from her garage and spare room if she chose Option 2.'),
         h('Option 1 – Pottery studio'),
         p('Anya would rent a unit on a small industrial estate and employ a part-time assistant. The unit needs a deposit of £3,000 and will cost £700 a month. She would need to buy two kilns, wheels and equipment. The business would sell classes and workshops (average £45 per person) and run private hire for groups (average £320 per booking). She estimates 3,200 class places and 60 private bookings a year. Anya plans to run the studio five days a week and to spend one day a week marketing.'),
         grid(['Financial and other data for Option 1', ''],
              [['Start-up capital required (total capital employed)', '£34,000'], ['Revenue per year (classes £144,000 + private hire £19,200)', '£163,200'], ['Cost of sales (materials, firing, tutor fees) – % of revenue', '30%'], ['Rent, energy and insurance per year', '£21,600'], ['Assistant wages and other expenses per year', '£27,400'], ['Anya’s drawings per year', '£28,000'], ['Contribution per class place after variable costs', '£31.50'], ['Forecast class places per year', '3,200']]),
         h('Option 2 – Online craft-supply shop'),
         p('Anya would buy craft supplies in bulk from three suppliers and ship kits by post. She would build her own website at a cost of £2,500 and spend £6,000 a year on online advertising. She expects most customers to find her through social media videos showing how to use the products. She could start within eight weeks and continue her part-time teaching at the college until the shop was established.'),
         grid(['Financial and other data for Option 2', ''],
              [['Start-up capital required (total capital employed)', '£12,000'], ['Revenue per year', '£96,000'], ['Cost of sales (kits and packaging) – % of revenue', '58%'], ['Delivery, storage and advertising per year', '£9,800'], ['Other expenses per year', '£3,700'], ['Anya’s drawings per year', '£18,000'], ['Contribution per order after variable costs', '£12'], ['Forecast orders per year', '1,600']]),
         p('Anya has £10,000 in savings. If she needs more than this she would have to borrow. A bank has offered a business loan at 9% interest.')]
    B = [h('Set Task'), p('You must complete both activities. You will produce two documents on a computer: a report; a presentation of slides with speaker notes or script.')]
    return paper('U7-R1', 7, '9901', 'Anya — pottery studio or online craft shop', 'New business: studio vs online shop', 70, u7_acts('Anya', 'her new business'), A, B)

def u7_cafe():
    A = [h('Set Task Information'),
         p('You are working for a local organisation that supports small businesses and have been asked to advise Mo and Lena Okafor. Mo and Lena own a successful bakery stall at weekend markets. They want to expand and have two options. Their aims are to double annual revenue within two years and to increase profit while keeping the family’s quality reputation.'),
         p('Option 1 Opening a small café in the town centre selling their bread, cakes and light lunches.'),
         p('Option 2 Buying a converted food van to sell at festivals, events and business parks.'),
         h('The food-to-go market'),
         p('The UK out-of-home food and drink market is forecast to be worth £65 billion by 2027, a growth of 8% on 2023. Cafés are the fastest growing category, but 1 in 5 independent cafés closes within two years because of rent and staffing costs. Street food and mobile catering grew by 11% last year: festivals have returned to pre-2020 levels and workers returning to offices have increased lunchtime demand at business parks. Food-van operators face high fuel and pitch costs and are weather-dependent. Both channels face rising ingredient prices (up 14% in two years). Average spend per customer is £7.40 in cafés and £6.20 at street food stalls.'),
         h('Mo and Lena — background'),
         p('Mo and Lena have run the market stall for four years. Mo is a trained baker; Lena runs the finances. They have £15,000 in savings. They employ one part-time stallholder at weekends. They have a strong reputation locally and 6,100 followers on social media.'),
         h('Option 1 – Café'),
         p('The café would occupy a unit in the town centre. The landlord requires a six-month deposit. The couple would need to employ two full-time staff and one part-time. Opening hours would be 8 am to 4 pm, six days a week. The fit-out includes an oven, display counter and furniture. Customers would be drawn from shoppers and office workers.'),
         grid(['Financial and other data for Option 1', ''],
              [['Start-up capital required (total capital employed)', '£45,000'], ['Revenue per year', '£198,000'], ['Cost of sales (ingredients) – % of revenue', '36%'], ['Rent, rates and utilities per year', '£34,800'], ['Wages and other expenses per year', '£70,200'], ['Drawings per year', '£30,000'], ['Contribution per customer after variable costs', '£4.70'], ['Forecast customers per year', '26,800']]),
         h('Option 2 – Food van'),
         p('The van would be bought second-hand and fitted with an oven and serving hatch. Mo and Lena would operate it themselves with weekend help. The van could be at business parks four weekdays and at events on weekends. A licence and pitch fees are required. The van needs servicing every year and would need replacing after about five years.'),
         grid(['Financial and other data for Option 2', ''],
              [['Start-up capital required (total capital employed)', '£22,000'], ['Revenue per year', '£104,000'], ['Cost of sales (ingredients) – % of revenue', '38%'], ['Pitch fees, fuel, servicing and insurance per year', '£14,600'], ['Wages and other expenses per year', '£15,400'], ['Drawings per year', '£26,000'], ['Contribution per customer after variable costs', '£3.85'], ['Forecast customers per year', '16,800']]),
         p('Mo and Lena have £15,000 in savings. A bank has offered a loan at 8.5% interest, and the family could ask Lena’s uncle for a £10,000 loan.')]
    B = [h('Set Task'), p('You must complete both activities. You will produce two documents on a computer: a report; a presentation of slides with speaker notes or script.')]
    return paper('U7-R2', 7, '9902', 'Mo and Lena — café or food van', 'Expansion: café vs food van', 70, u7_acts('Mo and Lena', 'their expanding business'), A, B)

def papers(unit):
    return {2: [u2_glow(), u2_brew()], 6: [u6_kestrel(), u6_harbour()], 7: [u7_anya(), u7_cafe()]}[unit]

if __name__ == '__main__':
    for u in (2, 6, 7):
        for q in papers(u):
            print(q['id'], q['title'], len(q['partA']), len(q['partB']))
