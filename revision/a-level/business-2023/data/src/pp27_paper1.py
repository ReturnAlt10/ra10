"""Predicted Paper 1 (June 2027) - three sets. Content written from the 2020-2025 trend
analysis in past_papers.py. Every calculation is computed in code from the
question's own data (see calc_* functions) so answers can't drift from questions."""


def pct(x, d=1):
    return f"{round(x, d):.{d}f}%"


# ── Section B calculation answers (computed) ─────────────────────────────
def calc_labour(d):
    prod = d["output"] / d["employees"]
    lcpu = d["employees"] * d["wage"] / d["output"]
    return prod, lcpu


def calc_payback(cost, flows):
    cum, yr = -cost, 0
    for i, f in enumerate(flows, 1):
        if cum + f >= 0:
            months = (-cum) / f * 12
            return i - 1, months
        cum += f
    return None


def calc_arr(cost, flows):
    years = len(flows)
    net = sum(flows) - cost
    return net / years / cost * 100, net


# ═════════════════════════════════════════════════════════════════════════
# SET A
# ═════════════════════════════════════════════════════════════════════════
A_LAB = {"output": 48000, "employees": 40, "wage": 27600}
A_PB = {"cost": 450000, "flows": [120000, 160000, 200000, 210000]}

_a_prod, _a_lcpu = calc_labour(A_LAB)
_a_pb_y, _a_pb_m = calc_payback(A_PB["cost"], A_PB["flows"])

SET_A = {
    "mcq": [
        {"q": "Which one of the following best describes a social enterprise?",
         "opts": ["A business owned by the government that provides a public service.",
                  "A business with social objectives that reinvests most of its surpluses to achieve them.",
                  "A charity that is not allowed to make a surplus.",
                  "A private limited company that donates 10% of its profit to charity."],
         "ans": "B", "why": "Social enterprises trade like businesses but pursue social or environmental aims and reinvest surpluses towards them.", "spec": "3.1.2"},
        {"q": "On the Tannenbaum Schmidt continuum, which statement describes the most subordinate-centred style?",
         "opts": ["The manager makes the decision and announces it.",
                  "The manager presents the problem, gets suggestions and then decides.",
                  "The manager permits the team to make decisions within limits that the manager defines.",
                  "The manager sells the decision to the team."],
         "ans": "C", "why": "Allowing the team to decide within defined limits gives subordinates the most freedom on the continuum.", "spec": "3.2.1"},
        {"q": "A business needs its sample to include 200 people aged 18-24 and 300 people aged 25-40, and lets interviewers choose who to ask until each group is full. This is:",
         "opts": ["cluster sampling.", "quota sampling.", "random sampling.", "stratified sampling."],
         "ans": "B", "why": "Fixed numbers per group chosen by the interviewer (not randomly) is quota sampling.", "spec": "3.3.2"},
        {"q": "Statement 1: 'Price skimming is most suitable when a product has a clear unique selling point.'\nStatement 2: 'Penetration pricing is most suitable when demand is price inelastic.'",
         "statements": True, "ans": "B", "why": "Skimming relies on a USP and early adopters; penetration works best when demand is price elastic, so Statement 2 is false.", "spec": "3.3.4"},
        {"q": "A factory has a capacity of 2 500 units per week. It produces 2 100 units per week. Its capacity utilisation is:",
         "opts": ["16.0%", "54.0%", "84.0%", "119.0%"], "ans": "C", "why": "2 100 / 2 500 x 100 = 84%.", "spec": "3.4.2"},
        {"q": "Statement 1: 'Quality assurance aims to prevent defects by checking quality at every stage of production.'\nStatement 2: 'Quality control is usually carried out by every employee rather than by inspectors.'",
         "statements": True, "ans": "B", "why": "QA builds quality into each stage (prevention). QC is traditionally inspection by specialist inspectors at the end, so Statement 2 is false.", "spec": "3.4.4"},
        {"q": "A product sells for £20 and has variable costs of £12 per unit. Fixed costs are £40 000. If the selling price rises to £22, the break-even output will:",
         "opts": ["fall from 5 000 units to 4 000 units.", "fall from 5 000 units to 3 333 units.",
                  "rise from 4 000 units to 5 000 units.", "stay at 5 000 units."],
         "ans": "A", "why": "Contribution rises from £8 to £10, so break-even falls from 40 000/8 = 5 000 to 40 000/10 = 4 000 units.", "spec": "3.5.2"},
        {"q": "Statement 1: 'Crowd funding allows a business to raise finance from a large number of small investors, usually online.'\nStatement 2: 'Debt factoring increases the total amount of revenue a business receives from its customers.'",
         "statements": True, "ans": "B", "why": "Factoring speeds up cash but the factor's fee means the business receives less in total, so Statement 2 is false.", "spec": "3.5.3"},
        {"q": "A business had 160 employees at the start of the year and 180 at the end. During the year 34 employees left. Its labour turnover is:",
         "opts": ["18.9%", "20.0%", "21.3%", "22.5%"], "ans": "B", "why": "Average employees = (160 + 180) / 2 = 170. 34 / 170 x 100 = 20%.", "spec": "3.6.2"},
        {"q": "According to Herzberg, which one of the following is a motivator rather than a hygiene factor?",
         "opts": ["Company policy", "Recognition for achievement", "Relationship with supervisor", "Working conditions"],
         "ans": "B", "why": "Recognition is a motivator; the other three are hygiene factors.", "spec": "3.6.4"},
        {"q": "A company has non-current liabilities of £30m and total equity of £70m. Its gearing is:",
         "opts": ["30%", "42.9%", "57.1%", "70%"], "ans": "A", "why": "Gearing = non-current liabilities / (total equity + non-current liabilities) = 30 / 100 = 30%.", "spec": "3.7.2"},
        {"q": "The Bank of England raises interest rates. This is an example of:",
         "opts": ["contractionary fiscal policy.", "contractionary monetary policy.", "expansionary fiscal policy.", "expansionary monetary policy."],
         "ans": "B", "why": "Interest rates are a monetary policy tool; raising them reduces spending (contractionary).", "spec": "3.7.5"},
        {"q": "A budget airline offers the lowest fares in its market by keeping costs below those of all its rivals. According to Porter, this is:",
         "opts": ["cost focus.", "cost leadership (low cost).", "differentiation.", "differentiation focus."],
         "ans": "B", "why": "Competing across the whole market on lowest costs is Porter's low-cost (cost leadership) strategy.", "spec": "3.8.2"},
        {"q": "Statement 1: 'Overtrading occurs when a business expands too quickly without enough working capital.'\nStatement 2: 'Synergy means that the combined business is worth less than the two businesses were separately.'",
         "statements": True, "ans": "B", "why": "Synergy is when the combined business is worth MORE than the separate parts (2 + 2 = 5), so Statement 2 is false.", "spec": "3.9.1"},
        {"q": "Employees resist a change because they do not trust the information they have been given. According to Kotter and Schlesinger, the most appropriate way to overcome this resistance is:",
         "opts": ["coercion.", "education and communication.", "manipulation and co-optation.", "negotiation and agreement."],
         "ans": "B", "why": "Misunderstanding and lack of trust in information are best tackled with education and communication.", "spec": "3.10.1"},
    ],
    "b": [
        {"n": 16, "marks": 4, "kind": "calc", "spec": "3.4.2 / 3.6.2",
         "q": f"A factory employs {A_LAB['employees']} production workers. Each worker is paid £{A_LAB['wage']:,} per year. Annual output is {A_LAB['output']:,} units.\nCalculate:\n(a) labour productivity (units per worker per year)\n(b) labour cost per unit.\nShow your working.",
         "answer": f"(a) {A_LAB['output']:,} / {A_LAB['employees']} = {_a_prod:,.0f} units per worker per year.\n(b) Total labour cost = {A_LAB['employees']} x £{A_LAB['wage']:,} = £{A_LAB['employees'] * A_LAB['wage']:,}; £{A_LAB['employees'] * A_LAB['wage']:,} / {A_LAB['output']:,} = £{_a_lcpu:.2f} per unit.",
         "points": ["1 mark: correct method for labour productivity.", f"1 mark: {_a_prod:,.0f} units per worker.", f"1 mark: total labour cost £{A_LAB['employees'] * A_LAB['wage']:,} (or wage / productivity).", f"1 mark: £{_a_lcpu:.2f} per unit (unit required)."]},
        {"n": 17, "marks": 4, "kind": "calc", "spec": "3.7.8",
         "q": f"A business is considering an investment costing £{A_PB['cost']:,}. Its expected net returns are:\n" +
              "\n".join(f"Year {i}: £{f:,}" for i, f in enumerate(A_PB["flows"], 1)) +
              "\nCalculate the payback period, in years and months. Show your working.",
         "answer": f"Cumulative: Y1 -£{A_PB['cost'] - 120000:,}; Y2 -£{A_PB['cost'] - 280000:,}; needs £{A_PB['cost'] - 280000:,} of Year 3's £200,000. £{A_PB['cost'] - 280000:,} / £200,000 x 12 = {_a_pb_m:.1f} months. Payback = {_a_pb_y} years {round(_a_pb_m)} months.",
         "points": ["1 mark: cumulative cash flow (or amount outstanding after Year 2 = £170,000).", "1 mark: £170,000 / £200,000 (= 0.85 of Year 3).", "1 mark: 0.85 x 12 = 10.2 months.", "1 mark: 2 years 10 months (accept 2 years 11 months if rounded up)."]},
        {"n": 18, "marks": 9, "kind": "analyse", "spec": "3.7.5",
         "q": "A UK furniture retailer imports most of its products and many customers buy using credit.\nAnalyse how a fall in the rate of inflation might affect the profits of this business.",
         "content": ["Lower inflation can mean real incomes recover (wages rising faster than prices) - furniture is a discretionary, income elastic purchase, so sales volume may rise.",
                     "The Bank of England may cut interest rates when inflation falls - cheaper credit makes 'buy now pay later' and finance deals more attractive, boosting demand for big-ticket items.",
                     "Supplier and import price rises slow, making costs easier to forecast and protecting gross profit margin if retail prices are held.",
                     "Wage pressure eases, so employee costs as a % of turnover may stabilise.",
                     "BUT lower inflation reduces the ability to raise prices - if the business relied on price rises to grow revenue, revenue growth may slow.",
                     "Inventory bought earlier at higher prices may need discounting if rivals cut prices - margins could be squeezed in the short term.",
                     "Impact depends on exchange rates: imported costs depend more on the value of the pound than on UK inflation."]},
        {"n": 19, "marks": 9, "kind": "analyse", "spec": "3.6.3",
         "q": "A household appliance manufacturer is replacing its functional structure with a matrix structure for new product development.\nAnalyse how this change might affect the speed at which it brings new products to market.",
         "content": ["Matrix structures bring specialists from different functions (design, engineering, marketing, finance) into one project team - fewer hand-offs between departments speeds development.",
                     "Problems are solved inside the team rather than sent up separate functional hierarchies, cutting decision time.",
                     "Marketing input early in design reduces costly late redesigns, so launch dates are less likely to slip.",
                     "Teams can work on several products in parallel rather than queuing for each department.",
                     "BUT employees report to two managers (functional and project) - conflicting priorities can slow decisions.",
                     "More meetings and coordination; managers may compete for staff, delaying projects.",
                     "Speed gains depend on project managers having real authority and on staff training in team working."]},
        {"n": 20, "marks": 9, "kind": "analyse", "spec": "3.9.4",
         "q": "Analyse how the use of big data and data mining might help a supermarket chain to increase its market share.",
         "content": ["Loyalty card and online data reveal buying patterns - data mining finds links (e.g. products bought together) used for targeted offers that win spending from rivals.",
                     "Personalised promotions raise visit frequency and basket size, building brand loyalty (a marketing objective).",
                     "Better demand forecasting reduces stock-outs - customers who find products available are less likely to switch.",
                     "Dynamic pricing can match rivals' prices on key lines, reducing reasons to shop elsewhere.",
                     "Store-level data helps decide which stores to open, refit or close, and which ranges suit each catchment.",
                     "BUT rivals use the same tools, so any advantage may be short-lived; cost of systems and data scientists is high; data protection rules (GDPR) and customer privacy concerns limit use."]},
    ],
    "c": [
        {"n": 21, "spec": "3.6.4", "q": "'Herzberg's two-factor theory shows that pay will never motivate employees.'\nDo you agree? Justify your view.",
         "for": ["Herzberg classed salary as a hygiene factor - poor pay causes dissatisfaction, but raising it removes dissatisfaction rather than creating lasting motivation.",
                 "Pay rises quickly become expected; motivators such as achievement, recognition and responsibility create intrinsic motivation that lasts.",
                 "Evidence of well-paid but disengaged staff (e.g. high turnover in some banks) supports the view."],
          "against": ["Herzberg's research was on accountants and engineers - for low-paid workers pay meets physiological needs (Maslow) and can motivate effort.",
                      "Performance-related pay, commission and piece rate link pay to achievement and recognition - pay can act as recognition (a motivator).",
                      "Taylor's view: in repetitive work with measurable output, piece rate raises productivity.",
                      "'Never' is too strong - context (job type, labour market, cost of living) matters."],
          "judge": "Best answers distinguish between pay preventing dissatisfaction and pay used as recognition of achievement; judge that pay alone rarely sustains motivation but can motivate when linked to performance or when pay is low - it depends on the job and the employee."},
        {"n": 22, "spec": "3.2.1", "q": "To what extent is the Tannenbaum Schmidt continuum useful in helping managers choose the most effective leadership style?",
         "for": ["It shows leadership as a range from manager-centred (tells/sells) to subordinate-centred (consults/joins) rather than a fixed type, encouraging managers to adapt.",
                 "Forces in the manager, the subordinates and the situation (time, skills, nature of the problem) give a practical checklist for choosing a style.",
                 "Helps explain why autocratic styles suit emergencies or unskilled teams while democratic styles suit skilled, motivated staff (e.g. software developers)."],
          "against": ["It describes styles but does not tell managers which is 'best' - judgement is still needed.",
                      "Assumes managers can switch style easily; personality and organisational culture (e.g. power culture) constrain this.",
                      "Ignores other influences such as the leader's relationship with the team, national culture and employee motivation theories.",
                      "Effectiveness depends on implementation, not on knowing the model."],
          "judge": "A strong conclusion weighs its value as a framework for thinking about the situation against its limits as a decision tool - most useful for managers who are aware of their own default style and the team's capability."},
    ],
    "d": [
        {"n": 23, "spec": "3.7.7", "q": "To what extent is Porter's five forces the most useful tool for a business deciding whether to enter a new market?",
         "for": ["Shows the likely profitability of the market - high barriers to entry, low buyer/supplier power, few substitutes and low rivalry indicate attractive returns.",
                 "Identifies which forces to manage (e.g. securing suppliers, differentiating to reduce buyer power).",
                 "Explains why some growing markets are still unprofitable (e.g. food delivery: intense rivalry, powerful customers)."],
          "against": ["It is a static snapshot - forces change quickly (technology lowered entry barriers for challenger banks).",
                      "Ignores the business's own strengths - SWOT/core competences matter: can WE compete?",
                      "Financial tools (investment appraisal, break-even) and market research on demand are also needed.",
                      "PESTLE factors (legislation, exchange rates) outside the five forces can dominate, e.g. tariffs."],
          "judge": "Five forces is valuable for judging market attractiveness, but whether to enter depends on combining it with internal analysis and financial forecasts; 'most useful' depends on the market (fast-changing tech v stable industries)."},
        {"n": 24, "spec": "3.3.4", "q": "Will selling through several channels (multi-channel distribution) always make a business more competitive than selling through a single channel?\nJustify your view.",
         "for": ["Reaches more customers and segments (online, stores, marketplaces, wholesalers) - higher sales volume and economies of scale.",
                 "Convenience (click and collect, returns in store) improves customer experience and loyalty.",
                 "Spreads risk - if one channel weakens (high street decline) others continue."],
          "against": ["Higher costs: logistics, IT, staff and inventory across channels - can reduce margins and competitiveness on price.",
                      "Channel conflict - retailers may object if a manufacturer sells direct; inconsistent pricing damages brand.",
                      "Some businesses compete best by focusing on one channel (online-only lower costs; luxury brands control experience through own stores).",
                      "Requires integration (inventory visibility, systems) - poorly run multi-channel can be worse than a well-run single channel."],
          "judge": "'Always' is unlikely: multi-channel improves competitiveness when the business can integrate channels profitably and customers value choice; for niche or low-cost positioning a single channel may be superior."},
    ],
}

# ═════════════════════════════════════════════════════════════════════════
# SET B
# ═════════════════════════════════════════════════════════════════════════
B_BE = {"fc": 180000, "price": 50, "vc": 30, "output": 13500}
_b_cpu = B_BE["price"] - B_BE["vc"]
_b_beo = B_BE["fc"] / _b_cpu
_b_new_cpu = B_BE["price"] * 0.9 - B_BE["vc"]
_b_new_beo = B_BE["fc"] / _b_new_cpu
_b_new_mos = B_BE["output"] - _b_new_beo
B_ROCE = {"op": 6.3, "equity": 38.0, "ncl": 12.0}
_b_roce = B_ROCE["op"] / (B_ROCE["equity"] + B_ROCE["ncl"]) * 100

SET_B = {
    "mcq": [
        {"q": "Which one of these changes is most likely to increase both the costs of a business and the demand for its product?",
         "opts": ["A fall in consumer incomes", "A rise in interest rates", "A successful advertising campaign", "An increase in the population of its target market"],
         "ans": "C", "why": "Advertising is a cost and, if successful, increases demand. A larger population raises demand but not costs directly.", "spec": "3.1.3"},
        {"q": "In a decision tree, Option X costs £50 000. It has a 0.6 probability of earning £200 000 and a 0.4 probability of earning £80 000. The net gain of Option X is:",
         "opts": ["£102 000", "£152 000", "£230 000", "£280 000"], "ans": "A", "why": "EV = (0.6 x 200 000) + (0.4 x 80 000) = £152 000. Net gain = 152 000 - 50 000 = £102 000.", "spec": "3.2.2"},
        {"q": "Using stakeholder mapping, a stakeholder with high power but low interest should be:",
         "opts": ["kept informed.", "kept satisfied.", "managed closely.", "monitored with minimum effort."], "ans": "B", "why": "High power, low interest = keep satisfied.", "spec": "3.2.3"},
        {"q": "Statement 1: 'A 95% confidence interval means the business can be certain the true value lies within the interval.'\nStatement 2: 'A wider confidence interval indicates less precise market research results.'",
         "statements": True, "ans": "C", "why": "95% confidence is not certainty (Statement 1 false); a wider interval is less precise (Statement 2 true).", "spec": "3.3.2"},
        {"q": "A market map with axes of 'price' and 'quality' shows a large gap in the low price / high quality position. The most likely explanation is that:",
         "opts": ["consumers do not want low prices.", "it is difficult to achieve high quality at a low cost.", "the market is too small to be mapped.", "this is the position of the market leader."],
         "ans": "B", "why": "Gaps can exist because they are unprofitable - high quality usually needs higher costs.", "spec": "3.3.3"},
        {"q": "A business uses 40 units of inventory per day. The lead time is 3 days and it keeps a buffer of 60 units. Its re-order level should be:",
         "opts": ["60 units", "120 units", "180 units", "200 units"], "ans": "C", "why": "Re-order level = (usage x lead time) + buffer = (40 x 3) + 60 = 180 units.", "spec": "3.4.5"},
        {"q": "A company has revenue of £800 000, cost of sales of £500 000 and other operating expenses of £180 000. Its operating profit margin is:",
         "opts": ["15.0%", "22.5%", "37.5%", "62.5%"], "ans": "A", "why": "Operating profit = 800 000 - 500 000 - 180 000 = £120 000; 120 000 / 800 000 = 15%.", "spec": "3.5.2"},
        {"q": "A business produces 9 000 units. Its break-even output is 6 000 units. Its margin of safety is:",
         "opts": ["3 000 units", "6 000 units", "15 000 units", "33.3%"], "ans": "A", "why": "Margin of safety = actual output - break-even output = 3 000 units.", "spec": "3.5.2"},
        {"q": "Statement 1: 'Centralisation is likely to improve the consistency of decisions across a business.'\nStatement 2: 'Decentralisation is likely to slow down responses to local market conditions.'",
         "statements": True, "ans": "B", "why": "Decentralisation usually SPEEDS local responses, so Statement 2 is false.", "spec": "3.6.3"},
        {"q": "Which one of the following is most likely to be a role of a works council?",
         "opts": ["Negotiating national pay rates for an industry", "Representing employees in consultation with management on workplace issues",
                  "Setting the legal minimum wage", "Taking strike action on behalf of employees"],
         "ans": "B", "why": "Works councils are employee bodies consulted by management on workplace matters.", "spec": "3.6.5"},
        {"q": "Carroll's Corporate Social Responsibility pyramid places responsibilities in this order, from base to top:",
         "opts": ["economic, legal, ethical, philanthropic.", "ethical, legal, economic, philanthropic.", "legal, economic, philanthropic, ethical.", "philanthropic, ethical, legal, economic."],
         "ans": "A", "why": "Carroll: economic (be profitable) - legal - ethical - philanthropic.", "spec": "3.7.6"},
        {"q": "A project costs £200 000 and produces total net returns of £320 000 over 4 years. Its average rate of return is:",
         "opts": ["15%", "30%", "40%", "60%"], "ans": "A", "why": "Net profit = 320 000 - 200 000 = 120 000; per year = 30 000; 30 000 / 200 000 = 15%.", "spec": "3.7.8"},
        {"q": "Employees who act like entrepreneurs within an existing business to develop new ideas are known as:",
         "opts": ["benchmarkers.", "franchisees.", "intrapreneurs.", "venture capitalists."], "ans": "C", "why": "Intrapreneurship = entrepreneurial behaviour inside an organisation.", "spec": "3.9.2"},
        {"q": "Statement 1: 'Licensing allows a business to enter an overseas market with lower investment than direct investment.'\nStatement 2: 'Direct investment gives a business less control over its overseas operations than licensing.'",
         "statements": True, "ans": "B", "why": "Direct investment gives MORE control, so Statement 2 is false.", "spec": "3.9.3"},
        {"q": "According to Handy, a culture in which teams are formed around projects and expertise matters more than position is a:",
         "opts": ["person culture.", "power culture.", "role culture.", "task culture."], "ans": "D", "why": "Task culture is project/team based where expertise counts.", "spec": "3.10.2"},
    ],
    "b": [
        {"n": 16, "marks": 2, "kind": "calc", "spec": "3.5.2",
         "q": f"A product sells for £{B_BE['price']} and has variable costs of £{B_BE['vc']} per unit. Fixed costs are £{B_BE['fc']:,} per year.\nCalculate the break-even output.",
         "answer": f"Contribution per unit = £{B_BE['price']} - £{B_BE['vc']} = £{_b_cpu}. Break-even = £{B_BE['fc']:,} / £{_b_cpu} = {_b_beo:,.0f} units.",
         "points": [f"1 mark: contribution per unit £{_b_cpu}.", f"1 mark: {_b_beo:,.0f} units."]},
        {"n": 17, "marks": 3, "kind": "calc", "spec": "3.5.2",
         "q": f"The business in Question 16 produces and sells {B_BE['output']:,} units. It decides to cut its price by 10%. Variable and fixed costs do not change.\nCalculate the new margin of safety, in units.",
         "answer": f"New price £{B_BE['price'] * 0.9:.2f}; new contribution £{_b_new_cpu:.2f}; new break-even £{B_BE['fc']:,} / £{_b_new_cpu:.2f} = {_b_new_beo:,.0f} units; margin of safety = {B_BE['output']:,} - {_b_new_beo:,.0f} = {_b_new_mos:,.0f} units.",
         "points": [f"1 mark: new contribution £{_b_new_cpu:.2f}.", f"1 mark: new break-even {_b_new_beo:,.0f} units.", f"1 mark: margin of safety {_b_new_mos:,.0f} units (must be in units)."]},
        {"n": 18, "marks": 3, "kind": "calc", "spec": "3.7.2",
         "q": f"A company has an operating profit of £{B_ROCE['op']}m, total equity of £{B_ROCE['equity']:.0f}m and non-current liabilities of £{B_ROCE['ncl']:.0f}m.\nCalculate its return on capital employed (ROCE).",
         "answer": f"Capital employed = £{B_ROCE['equity']:.0f}m + £{B_ROCE['ncl']:.0f}m = £{B_ROCE['equity'] + B_ROCE['ncl']:.0f}m. ROCE = {B_ROCE['op']} / {B_ROCE['equity'] + B_ROCE['ncl']:.0f} x 100 = {_b_roce:.1f}%.",
         "points": [f"1 mark: capital employed £{B_ROCE['equity'] + B_ROCE['ncl']:.0f}m.", "1 mark: operating profit / capital employed x 100.", f"1 mark: {_b_roce:.1f}%."]},
        {"n": 19, "marks": 9, "kind": "analyse", "spec": "3.5.3",
         "q": "Analyse why a growing private limited company might choose to finance its expansion using retained profit rather than crowd funding.",
         "content": ["Retained profit has no interest or repayment, so cash flow and profit for the year are not reduced by finance costs.",
                     "No dilution of ownership - existing shareholders keep control, unlike equity crowd funding where many new small shareholders join.",
                     "No need to publish plans publicly - crowd funding campaigns reveal strategy to competitors.",
                     "Quick and certain - crowd funding may fail to reach its target, and platform fees (typically 5-8%) add cost.",
                     "BUT retained profit may be insufficient for large projects; using it means lower dividends, which may upset shareholders.",
                     "Crowd funding can also act as marketing and market research (proof of demand) - a reason the business might prefer it in some cases."]},
        {"n": 20, "marks": 9, "kind": "analyse", "spec": "3.9.2 / 3.4.3",
         "q": "Analyse how introducing kaizen might improve the competitiveness of a manufacturing business.",
         "content": ["Kaizen = continuous small improvements suggested by employees at every level.",
                     "Reduces waste (time, materials, defects) so unit costs fall - allows lower prices or higher margins than rivals.",
                     "Improves quality and reliability - fewer defects improve reputation and reduce returns costs.",
                     "Involving employees increases engagement and motivation (Herzberg: responsibility, achievement), lowering labour turnover and recruitment costs.",
                     "Incremental innovation accumulates into a lasting advantage that is hard for rivals to copy because it is built into culture.",
                     "BUT gains are gradual; needs training, time for team meetings and a culture where staff are trusted - may not respond to disruptive change."]},
        {"n": 21, "marks": 9, "kind": "analyse", "spec": "3.7.4",
         "q": "The government announces a significant increase in the National Living Wage.\nAnalyse the possible impact of this on a large supermarket chain.",
         "content": ["Many supermarket staff are paid at or near the living wage - employee costs rise, and pay differentials mean supervisors' pay may rise too.",
                     "Lower operating profit margin unless costs are passed on through higher prices - but rivals (discounters) may compete hard on price.",
                     "Response: more self-service checkouts and automation (capital for labour) - investment cost but lower long-run costs.",
                     "Higher pay may improve recruitment, motivation and retention, reducing turnover costs and improving service.",
                     "Low-paid consumers have more disposable income - demand for groceries may rise slightly, particularly at value ranges.",
                     "Impact depends on the share of employee costs in total costs and on whether competitors face the same increase (they do in the UK)."]},
    ],
    "c": [
        {"n": 22, "spec": "3.3.4", "q": "'The product life cycle is of little value to a business with a large portfolio of products.'\nDo you agree? Justify your view.",
         "for": ["With many products the Boston Matrix (market share and growth) is more useful for managing the whole portfolio and cash.",
                 "Life cycles are only clear in hindsight - predicting when a product will decline is hard, so decisions based on it may be wrong.",
                 "Large businesses use sales and profit data per product rather than a theoretical model."],
          "against": ["Helps plan extension strategies and the timing of new product launches so that products are at different stages - balancing cash flow.",
                      "Guides marketing mix decisions at each stage (e.g. promotion heavy at launch, price cuts in decline).",
                      "Combines with the Boston Matrix - market growth reflects life cycle stage, so they are complementary.",
                      "Particularly valuable where life cycles are short (fashion, tech) and the portfolio must be renewed quickly."],
          "judge": "The model is valuable as a planning and portfolio-balancing tool when used with data and the Boston Matrix; its value is limited when used to predict precise timings."},
        {"n": 23, "spec": "3.6.4 / 3.4.3", "q": "To what extent is employee engagement more important than investment in technology in improving labour productivity?",
         "for": ["Engaged staff work harder, suggest improvements (kaizen) and take fewer days off - productivity rises without large capital spending.",
                 "Technology only raises productivity if staff are trained and willing to use it; disengaged workers resist change.",
                 "In services (care, hospitality) output depends heavily on people."],
          "against": ["Automation and robotics can multiply output per worker many times (e.g. warehouses, car plants) - engagement alone cannot match this.",
                      "Capital intensive processes give consistent quality and speed.",
                      "Technology may itself raise engagement by removing boring repetitive tasks."],
          "judge": "They are complementary: technology sets the potential productivity, engagement determines how much of it is achieved; which matters more depends on the industry and the current level of automation."},
    ],
    "d": [
        {"n": 24, "spec": "3.9.1 / 3.9.3", "q": "Is a takeover of a local business always a better way to enter an overseas market than forming a joint venture?\nJustify your view.",
         "for": ["Full control of strategy, branding and profits; quick access to the local business's customers, distribution and knowledge.",
                 "No need to share profits or negotiate with a partner; avoids partner conflict.",
                 "Can achieve synergies and economies of scale faster."],
          "against": ["Expensive - high premium paid; risk of overpaying and paying with debt (higher gearing).",
                      "Culture clash and integration problems are a major reason takeovers fail.",
                      "Joint ventures share risk and investment, give local knowledge, and may be required by law in some countries.",
                      "JVs are easier to exit if the market fails."],
          "judge": "Depends on the attractiveness and risk of the market, the finance available, legal restrictions and how much control matters - 'always' is unlikely to be true."},
        {"n": 25, "spec": "3.10.1", "q": "To what extent can resistance to strategic change always be overcome by education and communication?",
         "for": ["Much resistance comes from misunderstanding and lack of information (Kotter & Schlesinger) - explaining reasons builds trust.",
                 "Low cost, preserves relationships and supports lasting acceptance.",
                 "Good communication is the foundation for other methods (participation, negotiation)."],
          "against": ["Self-interest: if employees will lose out (pay, jobs), understanding the reasons will not remove resistance - negotiation may be needed.",
                      "Low tolerance for change and different assessments of the situation need participation/support.",
                      "Time - in a crisis, coercion may be the only practical method.",
                      "Depends on culture, trust in leaders, trade union involvement and scale of change."],
          "judge": "Education and communication are usually necessary but rarely sufficient; the best method depends on the cause of resistance and the urgency of the change."},
    ],
}

# ═════════════════════════════════════════════════════════════════════════
# SET C
# ═════════════════════════════════════════════════════════════════════════
C_DT = {"cost": 120000, "outcomes": [(0.55, 400000), (0.45, 150000)], "alt_net": 140000}
_c_ev = sum(p * v for p, v in C_DT["outcomes"])
_c_net = _c_ev - C_DT["cost"]
C_ARR = {"cost": 2400000, "flows": [600000, 800000, 900000, 900000, 700000]}
_c_arr, _c_arr_net = calc_arr(C_ARR["cost"], C_ARR["flows"])

SET_C = {
    "mcq": [
        {"q": "Which one of the following is most likely to cause a company's share price to rise?",
         "opts": ["An announcement of lower-than-expected profits", "An increase in interest rates", "Rumours of a takeover bid for the company", "The resignation of a successful chief executive"],
         "ans": "C", "why": "Takeover bids are usually at a premium, so investors buy the shares expecting a higher price.", "spec": "3.1.2"},
        {"q": "Which one of the following is a measure of brand loyalty?",
         "opts": ["Market share", "Percentage of customers who make a repeat purchase", "Sales growth", "Total market size"],
         "ans": "B", "why": "Repeat purchase rate directly measures loyalty.", "spec": "3.3.1"},
        {"q": "Which one of the following is an extension strategy?",
         "opts": ["Launching an entirely new product", "Reducing promotion as sales fall", "Selling the existing product to a new target market", "Withdrawing the product"],
         "ans": "C", "why": "Finding new markets/uses extends the product life cycle.", "spec": "3.3.4"},
        {"q": "A bakery buys ingredients and packaging for £0.60 per cake and sells each cake for £2.40. The value added per cake is:",
         "opts": ["£0.60", "£1.80", "£2.40", "£3.00"], "ans": "B", "why": "Value added = selling price - cost of bought-in materials = 2.40 - 0.60 = £1.80.", "spec": "3.4.1"},
        {"q": "Statement 1: 'Just in Time reduces the cost of holding inventory.'\nStatement 2: 'Just in Case makes a business less able to meet unexpected increases in demand.'",
         "statements": True, "ans": "B", "why": "Just in Case holds buffer stock, so it is MORE able to meet unexpected demand. Statement 2 is false.", "spec": "3.4.3"},
        {"q": "A business has an opening cash balance of £12 000. In the month, cash inflows are £45 000 and cash outflows are £51 000. Its closing balance is:",
         "opts": ["-£6 000", "£6 000", "£18 000", "£108 000"], "ans": "B", "why": "12 000 + 45 000 - 51 000 = £6 000.", "spec": "3.5.2"},
        {"q": "Budgeted costs were £300 000 and actual costs were £330 000. Budgeted revenue was £400 000 and actual revenue was £420 000. The profit variance is:",
         "opts": ["£10 000 adverse", "£10 000 favourable", "£30 000 adverse", "£50 000 favourable"], "ans": "A", "why": "Budgeted profit 100 000; actual profit 90 000; £10 000 adverse.", "spec": "3.5.2"},
        {"q": "Which one of the following is a feature of a hard HRM approach?",
         "opts": ["Employees seen as a resource to be managed to minimise cost", "Long-term workforce planning focused on development",
                  "High levels of delegation and empowerment", "Regular consultation with employees"],
         "ans": "A", "why": "Hard HRM treats employees as a cost to be minimised and controlled.", "spec": "3.6.1"},
        {"q": "A business has total employee costs of £1.2m and revenue of £4.8m. Its employee costs as a percentage of turnover are:",
         "opts": ["4%", "25%", "40%", "400%"], "ans": "B", "why": "1.2 / 4.8 x 100 = 25%.", "spec": "3.6.2"},
        {"q": "Which one of the following is most likely to be a tactic rather than a strategy?",
         "opts": ["Entering the Chinese market over the next five years", "Merging with a major competitor", "Offering 20% off for a weekend sale", "Repositioning the brand as premium"],
         "ans": "C", "why": "A short-term, small-scale promotion is a tactic.", "spec": "3.7.1"},
        {"q": "Elkington's Triple Bottom Line measures business performance in terms of:",
         "opts": ["people, planet and profit.", "price, product and promotion.", "profit, liquidity and gearing.", "shareholders, customers and employees."],
         "ans": "A", "why": "Triple Bottom Line = People, Planet, Profit.", "spec": "3.7.3"},
        {"q": "Strong patents and high start-up costs in a market are most likely to:",
         "opts": ["increase buyer power.", "increase the threat of substitutes.", "reduce the threat of new entrants.", "reduce supplier power."], "ans": "C",
         "why": "These are barriers to entry, so the threat of new entrants falls.", "spec": "3.7.7"},
        {"q": "A UK coffee chain starts selling its own branded coffee machines to its existing customers. According to Ansoff's matrix this is:",
         "opts": ["diversification.", "market development.", "market penetration.", "product development."], "ans": "D", "why": "New product, existing customers = product development.", "spec": "3.8.1"},
        {"q": "Statement 1: 'Automation is likely to increase the proportion of fixed costs in a business's total costs.'\nStatement 2: 'Automation is likely to reduce labour productivity.'",
         "statements": True, "ans": "B", "why": "Machinery is a fixed cost, so Statement 1 is true; automation raises output per worker, so Statement 2 is false.", "spec": "3.9.4"},
        {"q": "A strategy that develops over time in response to unforeseen events is called:",
         "opts": ["a contingency plan.", "an emergent strategy.", "a planned strategy.", "strategic drift."], "ans": "B", "why": "Emergent strategies arise from responses to events rather than formal plans.", "spec": "3.10.4"},
    ],
    "b": [
        {"n": 16, "marks": 4, "kind": "calc", "spec": "3.2.2",
         "q": f"A business is deciding whether to launch a new product (Option 1). The launch costs £{C_DT['cost']:,}.\nThere is a {C_DT['outcomes'][0][0]} probability of a high demand outcome worth £{C_DT['outcomes'][0][1]:,} and a {C_DT['outcomes'][1][0]} probability of a low demand outcome worth £{C_DT['outcomes'][1][1]:,}.\nOption 2, modifying an existing product, has a net gain of £{C_DT['alt_net']:,}.\n(a) Calculate the expected value and net gain of Option 1. Show your working. [3 marks]\n(b) State which option the business should choose, based on these figures. [1 mark]",
         "answer": f"(a) EV = ({C_DT['outcomes'][0][0]} x £{C_DT['outcomes'][0][1]:,}) + ({C_DT['outcomes'][1][0]} x £{C_DT['outcomes'][1][1]:,}) = £{C_DT['outcomes'][0][0] * C_DT['outcomes'][0][1]:,.0f} + £{C_DT['outcomes'][1][0] * C_DT['outcomes'][1][1]:,.0f} = £{_c_ev:,.0f}. Net gain = £{_c_ev:,.0f} - £{C_DT['cost']:,} = £{_c_net:,.0f}.\n(b) Option {'1' if _c_net > C_DT['alt_net'] else '2'} (higher net gain).",
         "points": ["1 mark: correct EV method.", f"1 mark: EV £{_c_ev:,.0f}.", f"1 mark: net gain £{_c_net:,.0f}.", f"1 mark: Option {'1' if _c_net > C_DT['alt_net'] else '2'} (own figure rule applies)."]},
        {"n": 17, "marks": 4, "kind": "calc", "spec": "3.7.8",
         "q": f"A company is considering buying new equipment for £{C_ARR['cost']:,}. The expected net returns over its five-year life are:\n" +
              "\n".join(f"Year {i}: £{f:,}" for i, f in enumerate(C_ARR["flows"], 1)) +
              "\nCalculate the average rate of return (ARR). Show your working.",
         "answer": f"Total returns £{sum(C_ARR['flows']):,}; net profit = £{sum(C_ARR['flows']):,} - £{C_ARR['cost']:,} = £{_c_arr_net:,}; per year £{_c_arr_net / 5:,.0f}; ARR = £{_c_arr_net / 5:,.0f} / £{C_ARR['cost']:,} x 100 = {_c_arr:.1f}%.",
         "points": [f"1 mark: total net profit £{_c_arr_net:,}.", f"1 mark: average annual profit £{_c_arr_net / 5:,.0f}.", "1 mark: divided by initial cost x 100.", f"1 mark: {_c_arr:.1f}%."]},
        {"n": 18, "marks": 9, "kind": "analyse", "spec": "3.9.1",
         "q": "Analyse why a large business might decide to retrench.",
         "content": ["Retrenchment = reducing the scale of operations (closing sites, cutting product lines, selling divisions).",
                     "Falling demand (recession, changing tastes) leaves spare capacity - closing sites raises capacity utilisation and lowers unit costs.",
                     "Diseconomies of scale - coordination and communication problems; cutting layers improves control and speed.",
                     "Refocus on core competences - selling unrelated divisions frees cash and management time.",
                     "Improve cash flow and reduce gearing by selling assets in a financial crisis; may satisfy shareholders seeking higher ROCE.",
                     "BUT costs of redundancy, damage to morale and reputation, and loss of capacity if demand recovers."]},
        {"n": 19, "marks": 9, "kind": "analyse", "spec": "3.7.5",
         "q": "Analyse how an increase in the rate of corporation tax (tax on company profits) might affect the investment decisions of a large manufacturing business.",
         "content": ["Higher tax reduces profit for the year, so less retained profit is available to fund investment internally.",
                     "Post-tax returns on projects fall - fewer projects meet the business's investment criteria (e.g. required ARR or NPV).",
                     "May switch to external finance - borrowing raises gearing and risk.",
                     "May shift investment to countries with lower tax rates (off-shoring of new capacity).",
                     "Shareholders receive lower dividends, so the share price may fall, making raising share capital harder.",
                     "BUT capital allowances may reduce the effect; long-term strategic investments (e.g. automation to stay competitive) may still go ahead."]},
        {"n": 20, "marks": 9, "kind": "analyse", "spec": "3.6.4",
         "q": "A call centre introduces flexible working, allowing staff to choose their shift patterns and work some days from home.\nAnalyse how this might improve employee motivation.",
         "content": ["Gives employees control over their working lives - autonomy and trust (Herzberg: responsibility; job enrichment).",
                     "Reduces stress and commuting costs - meets security and social/family needs (Maslow), improving wellbeing and attendance.",
                     "Signals that the employer values staff, improving engagement and reducing labour turnover.",
                     "Wider recruitment pool (parents, carers) - staff better matched to roles.",
                     "BUT home working can reduce social contact and team spirit; monitoring performance is harder; some staff may feel isolated or unfairly treated if not eligible."]},
    ],
    "c": [
        {"n": 21, "spec": "3.8.2 / 3.7.7", "q": "To what extent is a low-cost positioning strategy more appropriate than differentiation for a business operating in a market where buyers have a lot of power?",
         "for": ["Powerful buyers (e.g. supermarkets buying from manufacturers) push prices down - only low-cost producers keep acceptable margins.",
                 "Standardised products with little to distinguish them give buyers easy alternatives - competing on cost is realistic.",
                 "Economies of scale and lean production allow survival at low prices."],
          "against": ["Differentiation reduces buyer power by making the product hard to replace (strong brand, patents, unique features) - consumers demand it, so retailers must stock it.",
                      "Only one business can be the lowest-cost producer - others are squeezed.",
                      "Focus strategies (niche) can avoid powerful mass-market buyers by using direct-to-consumer channels.",
                      "Depends on the business's resources and core competences."],
          "judge": "Low cost can be necessary when products are commodities and buyers are concentrated, but differentiation is often the better long-term response because it changes the balance of power."},
        {"n": 22, "spec": "3.10.3", "q": "To what extent does the successful implementation of a strategy depend on effective communication?",
         "for": ["Employees must understand the strategy and their role in it; poor communication causes confusion, rumours and resistance.",
                 "Two-way communication brings feedback that helps managers adjust implementation.",
                 "Communication with external stakeholders (investors, suppliers) maintains support and finance."],
          "against": ["Leadership, resources (finance, skills), organisational structure and culture are also critical.",
                      "Network analysis/project planning needed to coordinate activities on time.",
                      "A poor strategy will fail however well it is communicated; external change can derail implementation."],
          "judge": "Communication is a necessary condition but rarely sufficient; its importance increases with the scale of change and the number of people affected."},
    ],
    "d": [
        {"n": 23, "spec": "3.5.1", "q": "'Cash flow is more important than profit for all businesses.'\nDo you agree? Justify your view.",
         "for": ["Businesses fail because they run out of cash, not because they make a loss in one year - profitable businesses can fail through overtrading.",
                 "Cash pays wages and suppliers; lack of cash damages supplier relationships and credit terms.",
                 "Start-ups and fast-growing firms face long gaps between paying costs and receiving cash."],
          "against": ["Long-term survival needs profit - losses eventually drain cash; investors and lenders judge businesses by profitability (ROCE).",
                      "Large, established businesses with overdraft facilities can manage short-term cash shortages.",
                      "Profit funds investment (retained profit) and is the main objective of shareholders.",
                      "Non-profits care about surpluses/break-even rather than profit."],
          "judge": "In the short run and for small or rapidly growing firms cash is usually more critical; in the long run profit is essential - the answer depends on time scale and the business's situation."},
        {"n": 24, "spec": "3.3.4", "q": "'Social media has made traditional forms of promotion unnecessary.'\nDo you agree? Justify your view.",
         "for": ["Social media is cheap, targeted (data on users) and measurable; viral marketing can reach millions at low cost.",
                 "Two-way engagement builds relationships and brand loyalty; influencers reach younger audiences who watch little TV.",
                 "Small businesses can compete with large ones."],
          "against": ["Older audiences and some B2B customers are reached better by TV, print, trade fairs and sales teams.",
                      "Social media is crowded - organic reach is falling and paid ads are increasingly expensive.",
                      "Negative viral content can damage brands quickly; less control over message.",
                      "Integrated campaigns (TV + online) often work best; mass-market brands still use TV to build awareness."],
          "judge": "Social media has reduced reliance on traditional promotion but has not made it unnecessary - the right mix depends on the target market, product and budget."},
    ],
}

SETS = {"A": SET_A, "B": SET_B, "C": SET_C}
