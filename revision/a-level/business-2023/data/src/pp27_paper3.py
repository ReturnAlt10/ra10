"""Predicted Paper 3 (June 2027) - three case studies, six questions each
(12, 12, 16, 16, 20, 24). Figures used in mark schemes are computed here."""

# ═════════════════════════════════════════════════════════════════════════
# SET A  Northlight Cinemas plc
# ═════════════════════════════════════════════════════════════════════════
NL = {"rev": (410, 438, 445), "op": (29, 24, 18), "adm": (31.2, 32.0, 30.1), "ticket": (8.90, 9.40, 9.95),
      "ca": 62, "cl": 88, "ncl": 310, "eq": 240}
NL_PREM = {"cost": 36.0, "flows": [6.0, 9.0, 10.0, 10.0, 9.0]}


def _payback(cost, flows):
    cum = -cost
    for i, f in enumerate(flows, 1):
        if cum + f >= 0:
            return i - 1, (-cum) / f * 12
        cum += f
    return None, None


_nl_pb_y, _nl_pb_m = _payback(NL_PREM["cost"], NL_PREM["flows"])
_nl_arr = (sum(NL_PREM["flows"]) - NL_PREM["cost"]) / len(NL_PREM["flows"]) / NL_PREM["cost"] * 100
_nl_roce = NL["op"][2] / (NL["eq"] + NL["ncl"]) * 100
_nl_cr = NL["ca"] / NL["cl"]
_nl_gear = NL["ncl"] / (NL["eq"] + NL["ncl"]) * 100
_nl_opm = [NL["op"][i] / NL["rev"][i] * 100 for i in range(3)]

SET_A = {
    "title": "Northlight Cinemas plc",
    "text": [
        ("Background", "Northlight Cinemas plc is the UK's third-largest cinema chain, with 96 cinemas and 4 800 employees, most of them part-time and aged under 25. Northlight's cinemas are mainly in shopping centres and retail parks. Its Chief Executive, Priya Nair, joined in 2023 from a hotel group."),
        ("A difficult market", "Cinema audiences have not returned to the levels seen before 2020 (Appendix C). Many households now subscribe to two or more streaming services, and new films arrive on streaming platforms just weeks after their cinema release. Big blockbusters still fill cinemas, but there are fewer of them, and attendance at other films has fallen. Customers can easily compare prices on their phones and often book with whichever chain is cheapest. Northlight has raised ticket prices each year to cover rising energy and staff costs (Appendix A)."),
        ("More than films", "Food and drink now provide 38% of Northlight's revenue and earn a far higher margin than ticket sales, where around half of each ticket's price is paid to the film's distributor. Northlight's loyalty app has 2.1 million users and records what each member watches and buys. Cinema managers receive a bonus based on admissions at their cinema, and some have been criticised for running heavy discounts on weekdays to boost visitor numbers even when it reduces profit."),
        ("A people business", "Front-of-house staff sell tickets and snacks, clean screens between films and deal with customers. Most work evenings and weekends on flexible contracts, which suits students. Pay is close to the National Living Wage, and labour turnover is around 70% a year. Northlight's customer satisfaction scores are below those of its two larger rivals, mainly because of queues at food counters on busy evenings."),
        ("Cutting costs", "Priya has introduced self-service ticket kiosks and app-based food ordering in all cinemas. Customers now order popcorn and drinks from their seats and staff deliver them. She plans to reduce the number of hours worked by front-of-house staff by 30% and to retrain some staff as 'experience hosts'. Some managers worry that the changes will reduce the number of shifts available to students, who make up 60% of the workforce, and that customer service will suffer."),
        ("Premium screens", "Northlight's research shows that customers will pay much more for a premium experience: reclining seats, laser projection and immersive sound. Priya has proposed converting one screen in each of 40 cinemas into a premium screen. The forecasts are shown in Appendix B. Northlight's investment criteria require a payback period of no more than four years and an average rate of return of at least 10%."),
        ("Where next?", "The board is also considering two longer-term strategies (Appendix D).\nOption 1 - NorthLive: convert 15 of its larger cinemas into multi-purpose venues that show films but also host live comedy, music broadcasts, e-sports tournaments and gaming bars.\nOption 2 - Northlight Unlimited: launch a monthly subscription that allows members to watch as many films as they like for £17.99 a month, aiming to increase visits by existing and lapsed customers.\nPriya must present her recommendation to shareholders, who have seen the share price fall by 40% in two years.\nPriya told the board: 'Cinemas will not disappear, but we cannot just wait for audiences to come back. The cinemas that survive will be the ones that give people a reason to leave the sofa.'"),
    ],
    "appendices": [
        {"title": "Appendix A  Northlight Cinemas plc selected data",
         "table": [["", "2022", "2023", "2024"], ["Revenue (£m)", *[str(x) for x in NL["rev"]]], ["Operating profit (£m)", *[str(x) for x in NL["op"]]],
                   ["Admissions (millions)", *[str(x) for x in NL["adm"]]], ["Average ticket price (£)", *[f"{x:.2f}" for x in NL["ticket"]]]],
         "note": f"Statement of financial position, 31 Dec 2024 (£m): current assets {NL['ca']}; current liabilities {NL['cl']}; non-current liabilities {NL['ncl']}; total equity {NL['eq']}."},
        {"title": "Appendix B  Premium screens proposal (40 screens)",
         "table": [["Initial cost", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"], [f"£{NL_PREM['cost']:.0f}m", *[f"£{x:.0f}m" for x in NL_PREM["flows"]]]],
         "note": "Figures are forecast additional net cash flows compared with keeping standard screens. Useful life of equipment: 5 years."},
        {"title": "Appendix C  UK cinema and streaming data",
         "table": [["", "2019", "2022", "2023", "2024"], ["UK cinema admissions (millions)", "176", "117", "124", "121"], ["UK households with 2+ streaming subscriptions (millions)", "6.1", "11.8", "12.6", "13.4"]]},
        {"title": "Appendix D  Strategic options",
         "table": [["", "Option 1 NorthLive", "Option 2 Northlight Unlimited"], ["Investment", "£45m (15 sites)", "£4m (app and systems)"],
                   ["Forecast extra annual operating profit", "£7.5m from Year 3", "£3m to £9m depending on visit frequency"],
                   ["Main risk", "Northlight has no experience of live events", "Heavy users may visit often while paying less per visit"],
                   ["Evidence", "Two rival venues report 80% occupancy at e-sports events", "A rival's scheme has 400 000 members"]]},
    ],
    "questions": [
        {"n": 1, "marks": 12, "spec": "3.7.7", "q": "Using Porter's five forces, analyse why Northlight Cinemas plc has found it difficult to increase its operating profit.",
         "content": [f"Threat of substitutes is high: streaming households with 2+ subscriptions rose from 6.1m to 13.4m; films arrive on streaming quickly - limits price rises and attendance (admissions fell 32.0m to 30.1m).",
                     "Buyer power is high: customers compare prices on phones and book the cheapest chain - price competition.",
                     "Rivalry: three large chains plus independents competing for a smaller audience (UK admissions 176m to 121m).",
                     "Supplier power: film distributors control blockbusters and take a large share of ticket revenue; fewer blockbusters strengthens their position; energy suppliers raised costs.",
                     f"Result: revenue rose only slightly because ticket prices rose while admissions fell; costs rose faster - operating margin fell from {_nl_opm[0]:.1f}% to {_nl_opm[2]:.1f}%.",
                     "Level 3 answers develop chains linking at least one force to Northlight's prices/costs using the data."]},
        {"n": 2, "marks": 12, "spec": "3.6.3 / 3.9.4", "q": "Analyse the human resource implications for Northlight Cinemas plc of introducing self-service kiosks and app-based ordering.",
         "content": ["Workforce planning: 30% fewer front-of-house hours - redeployment to 'experience host' roles, or fewer shifts/redundancy for some staff.",
                     "Training needed for new roles (customer experience, technology support) - cost but develops skills (talent development).",
                     "Motivation: fewer shifts for students (60% of workforce) may cause dissatisfaction and higher labour turnover (Herzberg hygiene: pay/security); enriched host roles could motivate some (responsibility, recognition).",
                     "Lower employee costs as a % of turnover - improves profit margin.",
                     "Recruitment changes - need fewer but more customer-focused staff; job design changes; risk to customer service if staff are stretched.",
                     "Communication/consultation needed to manage resistance (Kotter & Schlesinger)."]},
        {"n": 3, "marks": 16, "spec": "3.7.8", "q": "Should Northlight Cinemas plc go ahead with the premium screens proposal?\nUse calculations and other information to justify your answer.",
         "content": [f"Payback: cumulative £6m, £15m, £25m, £35m after Year 4; £1m of Year 5's £9m needed = 1/9 x 12 = {_nl_pb_m:.1f} months - payback {_nl_pb_y} years and about {round(_nl_pb_m)} month{'s' if round(_nl_pb_m) != 1 else ''} - just outside the 4-year criterion.",
                     f"ARR: total net cash flow £{sum(NL_PREM['flows']):.0f}m - £36m = £{sum(NL_PREM['flows']) - 36:.0f}m over 5 years = £{(sum(NL_PREM['flows']) - 36) / 5:.1f}m a year; / £36m = {_nl_arr:.1f}% - well below the 10% criterion.",
                     "Against: fails both criteria; forecasts may be optimistic; equipment life only 5 years; capital is scarce (current ratio below 1).",
                     "For: premium experiences differentiate cinemas from streaming - the one thing home viewing cannot copy; customers will pay more (inelastic demand); may raise attendance at standard screens and food sales (not included in figures?).",
                     "For: qualitative benefits for brand and share price; competitors may already offer premium screens - not investing may lose share.",
                     "Judgement must use the calculations; good answers consider whether the criteria are appropriate, trial in fewer cinemas, or financing."]},
        {"n": 4, "marks": 16, "spec": "3.7.2", "q": "To what extent does Appendix A suggest that Northlight Cinemas plc is in a weak financial position?",
         "content": [f"ROCE = £18m / (£240m + £310m) = {_nl_roce:.1f}% - very low; operating margin fell from {_nl_opm[0]:.1f}% to {_nl_opm[2]:.1f}%.",
                     f"Current ratio = 62 / 88 = {_nl_cr:.2f} : 1 - below 1, potential liquidity problems; BUT cinemas receive cash at the point of sale and hold little inventory, so a low ratio is normal in leisure/retail.",
                     f"Gearing = 310 / 550 = {_nl_gear:.1f}% - highly geared; rising interest rates increase finance costs and risk; non-current liabilities may include property leases.",
                     "Revenue still rising (410 to 445) and Northlight is still profitable; admissions held up better than the market in 2023.",
                     "Limitations: one year of balance-sheet data; no cash flow figure; share price fall 40% supports weakness.",
                     "Judgement: weak on profitability and gearing, liquidity less serious given the industry; trend is the main concern."]},
        {"n": 5, "marks": 20, "spec": "3.8.1", "q": "Should Northlight Cinemas plc choose Option 1 (NorthLive) or Option 2 (Northlight Unlimited)?\nUse quantitative and qualitative information to justify your view.",
         "content": ["Option 1 is diversification (new products/experiences, partly new markets) - Ansoff: highest risk; Option 2 is market penetration - lower risk.",
                     "Option 1: £45m for £7.5m a year from Year 3 = 16.7% annual return once established; but no experience of live events; 80% occupancy at rivals' events suggests demand; uses spare capacity on quiet weekdays; differentiates from streaming.",
                     "Option 2: only £4m; £3m-£9m a year = 75%-225% return on investment; increases visits and food/drink spending; builds loyalty and data; BUT cannibalisation - frequent visitors pay less per visit; relies on film supply.",
                     "Finance: high gearing and current ratio below 1 favour the cheaper Option 2; Option 1 may need more borrowing.",
                     "Strategic fit: Option 2 builds on core competence; Option 1 addresses the long-term threat from streaming.",
                     "Answers analysing only one option are limited to Level 3. Good answers weigh risk, return, finance and fit, and may suggest Option 2 first then trial NorthLive at a few sites."]},
        {"n": 6, "marks": 24, "spec": "3.7.6", "q": "To what extent is technological change the biggest threat facing all businesses?",
         "content": ["For: disrupts business models - streaming v cinemas, e-commerce v high street, AI and automation in services; reduces barriers to entry for new competitors.",
                     "For: speed of change makes strategic drift likely for slow businesses (Kodak, Blockbuster).",
                     "Against: technology is also an opportunity - lowers costs (kiosks), creates new products (premium screens), new channels and data.",
                     "Against: other threats may be bigger for some businesses: economic change (interest rates for house builders), legislation (environmental rules), competition, social change, supply chain disruption, labour shortages.",
                     "Context matters: tech-heavy industries v businesses with stable technology (funeral services, haircuts, construction materials).",
                     "Contrasting contexts and a judgement about which businesses and timescales are most affected are needed for Levels 4-5."]},
    ],
}

# ═════════════════════════════════════════════════════════════════════════
# SET B  Orchard & Vine Ltd
# ═════════════════════════════════════════════════════════════════════════
OV_FH = {"price": 2.40, "vc": 1.15, "fc": 150000, "y1": 110000, "y2": 160000, "cap": 200000}
_ov_c = OV_FH["price"] - OV_FH["vc"]
_ov_be = OV_FH["fc"] / _ov_c
_ov_p1 = OV_FH["y1"] * _ov_c - OV_FH["fc"]
_ov_p2 = OV_FH["y2"] * _ov_c - OV_FH["fc"]
OV_CF = {"open": 80, "in": [410, 395, 420, 470, 520, 560], "out": [450, 470, 480, 500, 510, 530], "limit": -150}
_ov_close = []
_b = OV_CF["open"]
for i, o in zip(OV_CF["in"], OV_CF["out"]):
    _b = _b + i - o
    _ov_close.append(_b)
OV_OPT = {"o1": {"jars": 900000, "price": 1.55, "vc": 1.05, "inv": 600000}, "o2": {"jars": 250000, "price": 2.10, "vc": 1.25, "ship": 0.20, "inv": 120000}}
_ov_o1c = OV_OPT["o1"]["jars"] * (OV_OPT["o1"]["price"] - OV_OPT["o1"]["vc"])
_ov_o2c = OV_OPT["o2"]["jars"] * (OV_OPT["o2"]["price"] - OV_OPT["o2"]["vc"] - OV_OPT["o2"]["ship"])

SET_B = {
    "title": "Orchard & Vine Ltd",
    "text": [
        ("A family business", "Orchard & Vine Ltd makes premium chutneys, relishes and sauces in a converted farm in Herefordshire. It was founded 30 years ago by Harriet Vine's parents and is still 100% owned by the Vine family. It employs 120 people and is the largest employer in its village. Harriet, the Managing Director, knows every employee by name. She makes the important decisions herself but always explains her reasons, and she pays above the local average, funds a staff bus and gives every employee a hamper at Christmas. Labour turnover is just 4%."),
        ("The kitchen", "Every product is cooked in small batches in copper pans using recipes developed by the family, with fruit bought from local orchards wherever possible. The products have won 34 Great Taste awards. Cooking in small batches is slow and labour intensive, and unit costs are higher than those of large manufacturers who use continuous production lines. Harriet believes customers will always pay more for food that 'tastes like it was made at home'."),
        ("The market", "UK sales of chutneys and pickles have grown slowly in recent years, while the hot sauce market has grown by around 18% a year, driven by younger shoppers and social media. Large food manufacturers dominate the mass market, and supermarket own-label products sell at about half the price of Orchard & Vine's."),
        ("Selling to supermarkets", "Ten years ago Orchard & Vine sold mainly to delicatessens and farm shops. Today three large supermarkets account for most of its sales (Appendix A). Supermarket buyers are demanding: they ask for annual price cuts, charge fees for promotions and shelf space, and have recently extended their payment terms from 30 to 60 days. Losing one supermarket listing would be a serious blow, and Harriet knows that the supermarkets also sell their own-label chutneys."),
        ("A new product", "Orchard & Vine's development kitchen has created 'Fire & Honey', a range of hot sauces aimed at younger customers. Hot sauces are one of the fastest-growing condiment markets. A new bottling line would be leased to make the range. Forecast data are shown in Appendix B."),
        ("Cash", "Despite growing sales, Orchard & Vine's bank balance has fallen. The longer payment terms, higher ingredient prices and the need to build inventory before the Christmas season are all putting pressure on cash. The Finance Director has prepared the cash flow forecast in Appendix C and warned that the business may be overtrading. The bank has agreed an overdraft limit of £150 000."),
        ("Growth options", "Harriet must choose between two growth opportunities (Appendix D).\nOption 1: Fresco, a large supermarket, has offered a three-year contract to make its own-label 'Finest' chutney range. Orchard & Vine would need to invest £600 000 in extra capacity.\nOption 2: Export Orchard & Vine's branded products to delicatessens and food halls in Germany and the Netherlands through a specialist food distributor, priced in euros.\nHarriet's father, who still sits on the board, says: 'Our competitive advantage is our recipes and our people. Whatever we do, we must not lose that.'\nOne long-serving cook put it differently: 'Harriet looks after us, and we look after the food. But it's always her decision, and we only find out about big changes when they happen.'"),
    ],
    "appendices": [
        {"title": "Appendix A  Orchard & Vine Ltd revenue by channel (%)", "table": [["", "2014", "2019", "2024"], ["Three large supermarkets", "21", "48", "64"], ["Delicatessens and farm shops", "71", "38", "22"], ["Online (own website)", "8", "14", "14"]],
         "note": "Revenue in 2024: £14.6m. Operating profit margin: 2014 14%; 2019 10%; 2024 7%."},
        {"title": "Appendix B  'Fire & Honey' forecasts",
         "table": [["Price to retailers per bottle", f"£{OV_FH['price']:.2f}"], ["Variable cost per bottle", f"£{OV_FH['vc']:.2f}"], ["Fixed costs per year (line lease and marketing)", f"£{OV_FH['fc']:,}"],
                   ["Forecast sales Year 1 (bottles)", f"{OV_FH['y1']:,}"], ["Forecast sales Year 2 (bottles)", f"{OV_FH['y2']:,}"], ["Capacity of new line (bottles per year)", f"{OV_FH['cap']:,}"]]},
        {"title": "Appendix C  Cash flow forecast (£000)",
         "table": [["", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], ["Cash inflows", *map(str, OV_CF["in"])], ["Cash outflows", *map(str, OV_CF["out"])],
                   ["Opening balance", str(OV_CF["open"]), *map(str, _ov_close[:-1])], ["Closing balance", *map(str, _ov_close)]]},
        {"title": "Appendix D  Growth options",
         "table": [["", "Option 1 Fresco own-label", "Option 2 Export via distributor"], ["Annual volume (jars)", f"{OV_OPT['o1']['jars']:,}", f"{OV_OPT['o2']['jars']:,}"],
                   ["Price per jar received", f"£{OV_OPT['o1']['price']:.2f}", f"£{OV_OPT['o2']['price']:.2f} (at current exchange rate)"],
                   ["Variable cost per jar", f"£{OV_OPT['o1']['vc']:.2f}", f"£{OV_OPT['o2']['vc']:.2f} + £{OV_OPT['o2']['ship']:.2f} shipping"],
                   ["Initial investment", f"£{OV_OPT['o1']['inv']:,}", f"£{OV_OPT['o2']['inv']:,} (labelling, certification, trade fairs)"],
                   ["Contract", "3 years; Fresco can end with 6 months' notice", "Distributor agreement reviewed annually"]]},
    ],
    "questions": [
        {"n": 1, "marks": 12, "spec": "3.2.1", "q": "With reference to the Tannenbaum Schmidt continuum, analyse why Harriet's leadership style may have contributed to Orchard & Vine Ltd's success.",
         "content": ["Harriet 'sells' decisions - makes them herself but explains them: towards the manager-centred end but not purely 'tells'; paternalistic (looks after employees' welfare).",
                     "Explaining decisions builds understanding and trust - smoother implementation and fewer misunderstandings.",
                     "Welfare benefits (above-average pay, staff bus, hampers) meet security and social needs - loyalty; labour turnover only 4% keeps skilled cooks and recipe knowledge in the business.",
                     "Fast decisions suit a family-owned business dealing with demanding supermarket buyers.",
                     "Low turnover reduces recruitment/training costs, protecting margins.",
                     "BUT limited delegation may slow innovation and create dependence on Harriet; a democratic style might use staff ideas more."]},
        {"n": 2, "marks": 12, "spec": "3.7.7", "q": "Using Appendix A, analyse how the buyer power of supermarkets affects Orchard & Vine Ltd's profitability.",
         "content": ["Supermarkets' share of revenue rose from 21% to 64% - dependence gives buyers strong bargaining power.",
                     "Annual price cuts and promotion/shelf fees reduce revenue per jar - operating margin fell from 14% to 7% as supermarket share rose.",
                     "60-day payment terms delay cash and may increase overdraft interest costs.",
                     "Supermarkets' own-label chutneys are substitutes they control - threat of delisting.",
                     "BUT supermarkets give volume and economies of scale; strong brand/premium recipes reduce buyer power somewhat; online and deli channels give some independence."]},
        {"n": 3, "marks": 16, "spec": "3.5.2", "q": "Should Orchard & Vine Ltd launch the 'Fire & Honey' range?\nUse calculations from Appendix B and other information to justify your view.",
         "content": [f"Contribution per bottle £{OV_FH['price']:.2f} - £{OV_FH['vc']:.2f} = £{_ov_c:.2f}; break-even = £{OV_FH['fc']:,} / £{_ov_c:.2f} = {_ov_be:,.0f} bottles.",
                     f"Year 1: {OV_FH['y1']:,} bottles is below break-even - loss of £{-_ov_p1:,.0f}. Year 2: {OV_FH['y2']:,} bottles - profit £{_ov_p2:,.0f}; margin of safety {OV_FH['y2'] - _ov_be:,.0f} bottles.",
                     f"Capacity {OV_FH['cap']:,} - Year 2 utilisation {OV_FH['y2'] / OV_FH['cap'] * 100:.0f}% leaves room for growth.",
                     "For: fast-growing market; new, younger customers reduce reliance on chutney and supermarkets (could sell online/delis); innovation strengthens the brand.",
                     "Against: forecasts may be optimistic; cash flow already under pressure (Appendix C) - launch marketing and inventory worsen cash; supermarkets may demand promotion fees.",
                     "Judgement should use the calculations and weigh short-term loss and cash risk against long-term growth; may suggest launching online first or delaying until after Christmas."]},
        {"n": 4, "marks": 16, "spec": "3.9.1 / 3.5.2", "q": "Using Appendix C and other information, to what extent is Orchard & Vine Ltd at risk of overtrading?",
         "content": [f"Closing balances: {', '.join(('-' if b < 0 else '') + f'£{abs(b)}k' for b in _ov_close)} - the balance turns negative in August and reaches -£{abs(min(_ov_close))}k in October, close to the £150k overdraft limit (only £{min(_ov_close) - OV_CF['limit']}k headroom).",
                     "Outflows exceed inflows for four months while sales grow - classic overtrading: cash tied up in inventory and receivables (60-day terms).",
                     "Inflows rise strongly from October (pre-Christmas sales) and the balance improves to -£85k by December - suggests a seasonal timing problem rather than a permanent one.",
                     "Risks: any delay in supermarket payment, ingredient price rise or Fire & Honey launch costs could breach the limit.",
                     "Solutions: negotiate supplier terms, debt factoring, delay launch, increase the overdraft, invoice discounting.",
                     "Judgement: significant short-term risk, manageable if forecasts are accurate - but forecasts are estimates."]},
        {"n": 5, "marks": 20, "spec": "3.9.1 / 3.9.3", "q": "Should Orchard & Vine Ltd choose Option 1 or Option 2?\nUse quantitative and qualitative information to justify your view.",
         "content": [f"Option 1 contribution: {OV_OPT['o1']['jars']:,} x (£{OV_OPT['o1']['price']:.2f} - £{OV_OPT['o1']['vc']:.2f}) = £{_ov_o1c:,.0f} a year for £{OV_OPT['o1']['inv']:,} investment; payback on contribution about {OV_OPT['o1']['inv'] / _ov_o1c * 12:.0f} months.",
                     f"Option 2 contribution: {OV_OPT['o2']['jars']:,} x (£{OV_OPT['o2']['price']:.2f} - £{OV_OPT['o2']['vc']:.2f} - £{OV_OPT['o2']['ship']:.2f}) = £{_ov_o2c:,.0f} a year for £{OV_OPT['o2']['inv']:,}; payback about {OV_OPT['o2']['inv'] / _ov_o2c * 12:.0f} months.",
                     "Option 1: much larger contribution but low margin per jar (£0.50), even greater dependence on supermarkets (buyer power), 6-month notice risk, own-label may cannibalise its branded sales; uses capacity and could worsen cash flow (investment + 60-day terms).",
                     "Option 2: builds the brand and diversifies channels/markets (market development) - reduces supermarket dependence; premium positioning protected; BUT exchange rate risk (euro), smaller scale, distributor control, shipping and regulations.",
                     "Fit with father's view: Option 2 protects recipes/brand; Option 1 turns O&V into a contract manufacturer.",
                     "Answers analysing only one option capped at Level 3. Judgement weighs scale of return v risk and strategic fit."]},
        {"n": 6, "marks": 24, "spec": "3.8.2", "q": "To what extent is it more difficult for small businesses than large businesses to maintain a competitive advantage?",
         "content": ["Small businesses: fewer resources for R&D, marketing and legal protection; weaker bargaining power with buyers/suppliers; dependent on key people (Harriet).",
                     "Large businesses: economies of scale, brand recognition, finance and data - can copy small firms' innovations quickly.",
                     "BUT small businesses have advantages: flexibility, speed, closeness to customers, niche focus, distinctive culture and craftsmanship that large firms cannot copy (O&V's recipes, low turnover).",
                     "Large businesses face diseconomies, bureaucracy and strategic drift; their advantages are also contested (disruptive entrants).",
                     "Depends on the source of advantage (cost-based favours large; differentiation/focus can favour small), the market's rate of change and barriers like patents.",
                     "Levels 4-5 need contrasting contexts and a judgement about the conditions under which size matters."]},
    ],
}

# ═════════════════════════════════════════════════════════════════════════
# SET C  Voltway plc
# ═════════════════════════════════════════════════════════════════════════
VW = {"out": 186000, "workers": 1240, "k_out": 210000, "k_workers": 1000, "rev": 412, "op": 21, "eq": 180, "ncl": 95, "ca": 140, "cl": 118}
VW_ACQ = {"price": 160, "loan": 120, "shares": 40, "zippa_op_eur": 18, "eur_gbp": 0.85}
VW_JV = {"stake": 35, "profit": 9}
_vw_prod = VW["out"] / VW["workers"]
_vw_kprod = VW["k_out"] / VW["k_workers"]
_vw_gear0 = VW["ncl"] / (VW["eq"] + VW["ncl"]) * 100
_vw_gear1 = (VW["ncl"] + VW_ACQ["loan"]) / (VW["eq"] + VW_ACQ["shares"] + VW["ncl"] + VW_ACQ["loan"]) * 100
_vw_roce = VW["op"] / (VW["eq"] + VW["ncl"]) * 100
_vw_cr = VW["ca"] / VW["cl"]
_vw_zop = VW_ACQ["zippa_op_eur"] * VW_ACQ["eur_gbp"]
_vw_zret = _vw_zop / VW_ACQ["price"] * 100
_vw_jvret = VW_JV["profit"] / VW_JV["stake"] * 100

SET_C = {
    "title": "Voltway plc",
    "text": [
        ("An electric future", "Voltway plc designs and assembles electric bikes (e-bikes) in Coventry. It was founded in 2012 and floated on the stock market in 2020. Voltway employs 1 900 people, including 1 240 production workers. Its bikes are sold through independent cycle shops in the UK and online. Most components, including motors and batteries, are imported from Asia."),
        ("The market", "UK e-bike sales grew rapidly between 2019 and 2022 but have been flat since, as higher interest rates and the cost of living reduced spending on expensive leisure products. Many independent cycle shops have closed, and more customers now buy online. In Germany and the Netherlands e-bikes are bought for commuting as much as for leisure, and sales continue to grow by around 9% a year. Competition is intense, with established European brands and low-cost imports."),
        ("Mission and objectives", "Voltway's mission is 'to make clean travel the easy choice'. In 2024 the board set a corporate objective of becoming carbon neutral across its own operations and supply chain by 2030. This will require changes to suppliers, packaging, transport and energy use, and some investors have questioned the cost."),
        ("Productivity problems", "Voltway's bikes have a strong reputation for design, but the business has struggled to keep costs down. Its main UK competitor, Kestrel Bikes, invested heavily in automated frame welding and painting three years ago. Voltway still relies on manual assembly, and absence and defect rates are high (Appendix A). Operations managers blame the old factory layout; employees blame constant changes to production targets."),
        ("A bigger move", "The UK e-bike market has slowed, but demand in mainland Europe is growing strongly. The board is considering two ways to expand (Appendix C).\nOption 1: acquire Zippa BV, a Dutch e-bike maker with a strong network of dealers across Germany, the Netherlands and Belgium. The acquisition would be financed by a £120m bank loan and £40m of new shares.\nOption 2: form a 50:50 joint venture with TaiCycle, a Taiwanese manufacturer, to build a low-cost factory in Vietnam supplying both companies' European sales.\nThe Chief Executive, Marcus Bell, favours the acquisition."),
        ("Culture", "Voltway's culture is informal and engineering-led: decisions are often made quickly in small teams, and engineers are proud of their designs. Zippa, by contrast, is a family-founded business with a formal, consensus-based approach in which decisions are discussed at length with its works council. Zippa's managers have said they want to keep their own brand and management team."),
        ("Resistance", "News of a possible acquisition has worried Voltway's employees. Rumours that Coventry production could move to the Netherlands have spread on social media. The trade union representing production workers has said it will oppose any change that threatens jobs, and several experienced engineers have already left. Marcus says, 'Our people must understand that standing still is not an option.'"),
    ],
    "appendices": [
        {"title": "Appendix A  Operations data, 2024", "table": [["", "Voltway", "Kestrel Bikes"], ["Bikes produced", f"{VW['out']:,}", f"{VW['k_out']:,}"], ["Production workers", f"{VW['workers']:,}", f"{VW['k_workers']:,}"],
                                                                 ["Defects per 1 000 bikes", "14", "6"], ["Staff absence rate (%)", "6.1", "3.2"], ["Capital investment per production worker (£000, last 3 years)", "9", "41"]]},
        {"title": "Appendix B  Voltway plc financial data, 2024 (£m)", "table": [["Revenue", str(VW["rev"])], ["Operating profit", str(VW["op"])], ["Current assets", str(VW["ca"])],
                                                                                 ["Current liabilities", str(VW["cl"])], ["Non-current liabilities", str(VW["ncl"])], ["Total equity", str(VW["eq"])]]},
        {"title": "Appendix C  Expansion options", "table": [["", "Option 1 Acquire Zippa BV", "Option 2 Joint venture with TaiCycle"],
                                                            ["Cost to Voltway", f"£{VW_ACQ['price']}m (£{VW_ACQ['loan']}m loan, £{VW_ACQ['shares']}m shares)", f"£{VW_JV['stake']}m (50% share)"],
                                                            ["Forecast annual operating profit to Voltway", f"€{VW_ACQ['zippa_op_eur']}m (Zippa's current profit)", f"£{VW_JV['profit']}m from Year 3"],
                                                            ["Other information", "600 staff; dealers in 3 countries; different IT systems", "Vietnam wages 70% below UK; 6-week shipping time to Europe"]],
         "note": f"Exchange rate: €1 = £{VW_ACQ['eur_gbp']:.2f}."},
    ],
    "questions": [
        {"n": 1, "marks": 12, "spec": "3.7.1 / 3.7.6", "q": "Analyse why Voltway plc's board has set a corporate objective of becoming carbon neutral by 2030.",
         "content": ["Consistent with the mission 'clean travel' - credibility of the brand depends on practising what it sells.",
                     "Customers buying e-bikes are environmentally aware - green credentials support differentiation and premium prices.",
                     "Pressure from investors (ESG funds), legislation and future carbon costs - acting early reduces risk.",
                     "Motivates employees and attracts talent who share the values (alignment of values - HR objective).",
                     "Supply-chain changes may reduce long-run costs (energy efficiency, less packaging) and reduce risk of shipping disruption.",
                     "BUT costs and investor scepticism - the analysis should link reasons to Voltway's context."]},
        {"n": 2, "marks": 12, "spec": "3.4.2 / 3.6.2", "q": "Using Appendix A, analyse why Voltway plc's labour productivity is lower than Kestrel Bikes'.",
         "content": [f"Voltway productivity = {VW['out']:,} / {VW['workers']:,} = {_vw_prod:.0f} bikes per worker; Kestrel = {_vw_kprod:.0f} - Kestrel is {(_vw_kprod / _vw_prod - 1) * 100:.0f}% higher.",
                     "Capital investment per worker £9k v £41k - Kestrel's automated welding and painting increases output per worker; Voltway relies on manual assembly.",
                     "Absence 6.1% v 3.2% - fewer worker-hours available, overtime/agency costs; may indicate low motivation (changing targets, rumours).",
                     "Defects 14 v 6 per 1 000 - rework takes time away from new output.",
                     "Old factory layout causes wasted movement; constant changes to targets disrupt flow.",
                     "Strong answers link causes together (e.g. low investment -> manual processes -> defects -> rework -> lower productivity)."]},
        {"n": 3, "marks": 16, "spec": "3.7.2 / 3.5.3", "q": "Using Appendix B and Appendix C, to what extent can Voltway plc afford to acquire Zippa BV?\nUse calculations to support your answer.",
         "content": [f"Current gearing = 95 / 275 = {_vw_gear0:.1f}%. After the deal: non-current liabilities £215m, equity £220m - gearing = 215 / 435 = {_vw_gear1:.1f}%, approaching 50% (high).",
                     f"ROCE = 21 / 275 = {_vw_roce:.1f}% - modest; interest on a £120m loan (e.g. 6% = £7.2m) would take a large share of Voltway's £21m operating profit.",
                     f"Zippa's profit €18m = £{_vw_zop:.1f}m; return on £160m = {_vw_zret:.1f}% - roughly covers interest but sensitive to exchange rates.",
                     f"Current ratio = 140 / 118 = {_vw_cr:.2f} : 1 - adequate but not strong; integration costs (IT systems) need cash.",
                     "Issuing £40m shares dilutes existing shareholders; share price may fall if investors doubt the deal.",
                     "Judgement: affordable only if Zippa's profits are maintained and interest rates are stable - risk is significant."]},
        {"n": 4, "marks": 16, "spec": "3.10.1", "q": "To what extent will Kotter and Schlesinger's methods of overcoming resistance to change help Voltway plc to manage its employees' response to the possible acquisition?",
         "content": ["Causes of resistance here: misunderstanding (rumours on social media), self-interest (fear for jobs), low tolerance for change, and different assessment of the need for change.",
                     "Education and communication: clear facts about plans for Coventry would counter rumours - Marcus's message currently sounds threatening.",
                     "Participation and involvement: engineers and union representatives involved in integration planning reduce fear and use their knowledge.",
                     "Negotiation and agreement with the union: job guarantees or retraining in exchange for flexibility - may be needed where self-interest is involved.",
                     "Facilitation and support: retraining for new technology; coercion is risky (engineers already leaving) though may be needed if time is short.",
                     "Limits: methods depend on management credibility, honesty of plans (if jobs will move, communication won't remove resistance), time pressures; the model is a framework, not a guarantee."]},
        {"n": 5, "marks": 20, "spec": "3.9.1 / 3.9.3", "q": "Should Voltway plc acquire Zippa BV (Option 1) or form a joint venture with TaiCycle (Option 2)?\nUse quantitative and qualitative information to justify your view.",
         "content": [f"Option 1: £160m for about £{_vw_zop:.1f}m a year ({_vw_zret:.1f}%); immediate access to dealers in three growing European markets; full control; but high gearing ({_vw_gear1:.1f}%), exchange-rate risk, integration problems (different IT systems, culture), and employee resistance.",
                     f"Option 2: £35m for £9m a year from Year 3 ({_vw_jvret:.1f}%); lower cost production addresses Voltway's cost problem; shared risk; but profits shared 50:50, slower (Year 3), 6-week shipping reduces flexibility, quality control and ethical concerns (carbon objective - shipping from Vietnam conflicts with carbon neutrality), possible job losses in Coventry.",
                     "Strategic fit: Option 1 gives market access; Option 2 tackles costs - which is Voltway's bigger problem?",
                     "Finance: Option 2 is far more affordable given ROCE and gearing.",
                     "Answers analysing only one option capped at Level 3. Good answers weigh return, risk, finance, mission and stakeholder impact."]},
        {"n": 6, "marks": 24, "spec": "3.9.3", "q": "To what extent is globalisation more of an opportunity than a threat for all businesses?",
         "content": ["Opportunities: larger markets and growth (Voltway in Europe); lower-cost sourcing and production (off-shoring); economies of scale; access to skills and technology; spreading risk across markets.",
                     "Threats: more competition from overseas firms; supply-chain risk (shipping disruption, long lead times); exchange-rate risk; ethical and environmental criticism; pressure on wages and jobs.",
                     "Context: large multinationals v small local service firms (hairdressers barely affected); manufacturers of tradable goods face both; UK businesses facing low-cost competitors.",
                     "Recent trends (re-shoring, protectionism, sustainability) change the balance.",
                     "Levels 4-5 require contrasting contexts and a supported judgement on when globalisation is mainly an opportunity."]},
    ],
}

SETS = {"A": SET_A, "B": SET_B, "C": SET_C}
