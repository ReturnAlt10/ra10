"""Predicted Paper 2 (June 2027) - three sets of three data-response questions.
Calculations are computed from each context's own appendix data."""


def r1(x):
    return f"{x:.1f}"


# ═════════════════════════════════════════════════════════════════════════
# SET A
# ═════════════════════════════════════════════════════════════════════════
GG = {"rev": (120.0, 132.0), "cos": (66.0, 79.0), "op": (14.0, 12.0), "eq": (80.0, 82.0), "ncl": (40.0, 58.0)}
_gg_roce24 = GG["op"][1] / (GG["eq"][1] + GG["ncl"][1]) * 100
_gg_roce23 = GG["op"][0] / (GG["eq"][0] + GG["ncl"][0]) * 100
_gg_gpm = [(GG["rev"][i] - GG["cos"][i]) / GG["rev"][i] * 100 for i in (0, 1)]
_gg_gear24 = GG["ncl"][1] / (GG["eq"][1] + GG["ncl"][1]) * 100
_gg_gear_after = (GG["ncl"][1] + 30) / (GG["eq"][1] + GG["ncl"][1] + 30) * 100

HK = {"fc": 360000, "price": 40, "vc": 22, "output": 26000}
_hk_beo = HK["fc"] / (HK["price"] - HK["vc"])
_hk_mos = HK["output"] - _hk_beo

SET_A = [
    {"title": "GreenGrove plc",
     "text": [
         "GreenGrove plc makes chilled and frozen plant-based foods, such as meat-free burgers and dairy-free desserts, which it sells to UK supermarkets under its own premium brand. The company grew rapidly between 2018 and 2022 as plant-based eating became fashionable.",
         "Since 2023 growth in the UK plant-based market has stalled (Appendix B). Supermarkets have launched cheaper own-label ranges, and the costs of GreenGrove's key ingredients and of energy for its freezers have risen sharply. GreenGrove has so far chosen not to cut its prices.",
         "The board is now considering borrowing £30m to build a second factory. The Chief Executive believes that the market will return to growth and that a larger factory would bring economies of scale. Some directors are less sure."],
     "appendices": [
         {"title": "Appendix A  Selected financial data for GreenGrove plc (£m)",
          "table": [["", "2023", "2024"], ["Revenue", "120", "132"], ["Cost of sales", "66", "79"], ["Operating profit", "14", "12"],
                    ["Total equity", "80", "82"], ["Non-current liabilities", "40", "58"]]},
         {"title": "Appendix B  UK plant-based food market, retail sales value (£m)",
          "table": [["2020", "2021", "2022", "2023", "2024"], ["820", "940", "1 010", "1 030", "1 015"]]},
         {"title": "Appendix C  Survey of 2 000 UK adults who have bought plant-based food (2024)",
          "table": [["Main reason for buying", "%", "Main reason for buying less often", "%"],
                    ["Health", "46", "Price", "52"], ["Environment", "31", "Taste/texture", "27"],
                    ["Taste", "14", "Concern about processed ingredients", "15"], ["Price/value", "9", "Other", "6"]],
          "note": "Source: independent market research company, random sample."},
         {"title": "Appendix D  Estimated price elasticity of demand",
          "table": [["Product", "PED"], ["Supermarket own-label plant-based ranges", "-1.8"], ["GreenGrove premium range", "-0.7"]]},
     ],
     "parts": [
         {"n": "1.1", "marks": 4, "kind": "calc", "spec": "3.7.2",
          "q": "Using Appendix A, calculate GreenGrove plc's return on capital employed (ROCE) for 2024.",
          "answer": f"Capital employed = £82m + £58m = £140m. ROCE = £12m / £140m x 100 = {_gg_roce24:.1f}%  (2023 = {_gg_roce23:.1f}%).",
          "points": ["1 mark: capital employed = total equity + non-current liabilities.", "1 mark: £140m.", "1 mark: 12 / 140 x 100.", f"1 mark: {_gg_roce24:.1f}% (accept 8.57%)."]},
         {"n": "1.2", "marks": 4, "kind": "short", "spec": "3.5.2",
          "q": f"GreenGrove plc's gross profit margin fell from {_gg_gpm[0]:.0f}% in 2023 to {_gg_gpm[1]:.1f}% in 2024.\nUsing the information provided, explain one reason why this happened.",
          "content": ["Cost of sales rose by 19.7% (66 to 79) while revenue rose only 10% (120 to 132).",
                      "Reason: higher ingredient and energy costs (freezers) increased cost per unit, and GreenGrove chose not to raise/cut prices - so each sale earned less gross profit.",
                      "Alternative: sales mix or discounts to supermarkets competing with own-label - accept any reason linked to the data.",
                      "Marks: 1 for a reason, 1 for application to GreenGrove/data, 2 for developed explanation of the effect on the margin."]},
         {"n": "1.3", "marks": 9, "kind": "analyse", "spec": "3.3.2 / 3.3.4",
          "q": "Analyse how the data in Appendix C and Appendix D might influence GreenGrove plc's pricing decisions.",
          "content": ["GreenGrove's PED of -0.7 is inelastic - a price rise would increase revenue (smaller % fall in volume), helping to offset rising costs.",
                      "Own-label demand is elastic (-1.8) - price-sensitive shoppers have moved to cheaper ranges; GreenGrove's remaining buyers are less price sensitive (loyal/premium).",
                      "Appendix C: health (46%) and environment (31%) are the main buying motives, not price (9%) - supports premium positioning and a modest price rise.",
                      "BUT 52% buy less often because of price - a further rise could push marginal customers to own-label and shrink volume; the PED is an estimate and may become more elastic as substitutes increase.",
                      "Could use selective pricing: protect entry-level products, raise prices on differentiated lines; or emphasise health benefits to keep demand inelastic."]},
         {"n": "1.4", "marks": 16, "kind": "evaluate", "spec": "3.7.8 / 3.5.3",
          "q": "Using the data, recommend whether GreenGrove plc should borrow £30m to build a second factory. Justify your answer.",
          "content": [f"Against: ROCE has fallen from {_gg_roce23:.1f}% to {_gg_roce24:.1f}%; borrowing £30m raises gearing from {_gg_gear24:.1f}% to about {_gg_gear_after:.1f}% - higher interest costs and risk if interest rates rise.",
                      "Against: market size fell 1.5% in 2024 after slowing growth since 2021 - extrapolation suggests no return to rapid growth; extra capacity could be under-used, raising unit costs.",
                      "Against: price is the main reason customers buy less often (52%) - own-label competition squeezes margins (gross margin already down).",
                      "For: if growth returns, economies of scale lower unit costs and help GreenGrove compete with own-label on cost; health/environment trends are long-term.",
                      "For: GreenGrove's inelastic PED shows a loyal premium base - it may win share as weaker rivals exit.",
                      "Evaluation: missing data (current capacity utilisation, projected NPV/payback, interest rate); a phased expansion or outsourcing/contract manufacturing could test demand with less risk. A strong judgement weighs falling returns and market stagnation against long-term growth potential."]},
     ]},
    {"title": "SwiftDrop Ltd",
     "text": [
         "SwiftDrop Ltd delivers parcels to homes for online retailers in the Midlands. It uses about 900 drivers who are self-employed and choose which delivery 'slots' to accept through SwiftDrop's app. Drivers are paid £1.10 per parcel delivered (piece rate) and use their own vans.",
         "Retailers have complained about parcels left in unsafe places, late deliveries and rude drivers. SwiftDrop's labour turnover is around 45% a year, and it spends £600 000 a year recruiting and training new drivers.",
         "SwiftDrop's managers are under pressure to hit daily delivery targets. Decisions are made by managers and passed to drivers through the app; drivers have no say in routes or targets. The new Managing Director, Lena Ortiz, believes a different leadership approach is needed. She is considering offering drivers employment contracts with a salary, a company van and a team leader for every 25 drivers."],
     "appendices": [
         {"title": "Table 1  SwiftDrop Ltd driver data", "table": [["", "2023", "2024"], ["Parcels delivered per driver per day (average)", "142", "151"],
                                                             ["Customer complaints per 10 000 parcels", "18", "27"], ["Labour turnover (%)", "38", "45"]]},
     ],
     "parts": [
         {"n": "2.1", "marks": 9, "kind": "analyse", "spec": "3.6.4 / 3.4.4",
          "q": "Analyse how SwiftDrop Ltd's use of piece rate might affect the quality of its service.",
          "content": ["Piece rate pays per parcel, so drivers maximise the number delivered (output rose 142 to 151 per day).",
                      "Speed is rewarded but care is not - leaving parcels in unsafe places saves time; complaints rose from 18 to 27 per 10 000 (+50%).",
                      "Pressure and long days increase stress and rudeness to customers; damages SwiftDrop's reputation with retailers who may switch contracts.",
                      "Low earnings per parcel may contribute to high labour turnover - inexperienced drivers make more mistakes.",
                      "BUT piece rate gives an incentive to complete rounds and can motivate some drivers (Taylor); quality could be protected by deductions for complaints or bonuses for customer ratings."]},
         {"n": "2.2", "marks": 9, "kind": "analyse", "spec": "3.6.4 / 3.6.2",
          "q": "With reference to Herzberg's two-factor theory, analyse why SwiftDrop Ltd's labour turnover is high.",
          "content": ["Hygiene factors are poor: insecure self-employed status, low pay per parcel, using own van (costs), supervision only through an app - causing dissatisfaction.",
                      "Motivators are absent: no responsibility for routes, no recognition, no advancement, repetitive work - so no positive motivation to stay.",
                      "Dissatisfied drivers leave for rivals or other jobs - turnover rose from 38% to 45%, costing £600 000 a year.",
                      "Lena's plan (salary, company van) improves hygiene factors - removing dissatisfaction; team leaders could add recognition and some responsibility.",
                      "BUT gig drivers may value flexibility; the labour market for drivers (shortages) also explains turnover, not only Herzberg's factors."]},
         {"n": "2.3", "marks": 16, "kind": "evaluate", "spec": "3.2.1",
          "q": "To what extent will moving towards a more democratic leadership style, as described by the Tannenbaum Schmidt continuum, improve the performance of all businesses?",
          "content": ["Democratic styles (consult/join) use employees' knowledge and increase engagement - better decisions and lower turnover (e.g. drivers know routes).",
                      "Engaged employees provide better customer service, raising quality and reputation.",
                      "BUT slower decisions - unsuitable in a crisis or when decisions are urgent (emergency services, delivery targets on peak days).",
                      "Depends on employees' skills and willingness to take responsibility - unskilled or temporary workforces may prefer clear instructions.",
                      "Depends on culture and structure: power cultures, large spans of control or app-based management make consultation hard.",
                      "Tannenbaum Schmidt suggests the best style depends on forces in the manager, subordinates and situation - so 'all businesses' is unlikely; judgement should identify the conditions that make a democratic move beneficial."]},
     ]},
    {"title": "Harbour Kitchenware Ltd",
     "text": [
         "Harbour Kitchenware Ltd manufactures stainless steel pans in Sheffield. It sells 60% of its output to UK department stores and 40% to retailers in the European Union, priced in euros. It imports most of its steel from Sweden, also priced in euros.",
         "Harbour inspects every finished pan before it is packed (quality control). About 6% of pans are rejected and recycled. A new Operations Director wants to introduce quality assurance, training operators to check their own work at each stage.",
         "To guarantee quick delivery to retailers, Harbour holds high levels of finished inventory: an average of 9 weeks of sales. The Finance Director wants to reduce this."],
     "appendices": [
         {"title": "Table 1  Harbour Kitchenware Ltd: product data (2024)",
          "table": [["Average selling price per pan", f"£{HK['price']}"], ["Variable cost per pan", f"£{HK['vc']}"],
                    ["Fixed costs per year", f"£{HK['fc']:,}"], ["Output and sales (pans per year)", f"{HK['output']:,}"]]},
     ],
     "parts": [
         {"n": "3.1", "marks": 2, "kind": "calc", "spec": "3.5.2", "q": "Using Table 1, calculate Harbour Kitchenware Ltd's break-even output.",
          "answer": f"Contribution per pan = £{HK['price']} - £{HK['vc']} = £{HK['price'] - HK['vc']}; £{HK['fc']:,} / £{HK['price'] - HK['vc']} = {_hk_beo:,.0f} pans.",
          "points": [f"1 mark: contribution £{HK['price'] - HK['vc']}.", f"1 mark: {_hk_beo:,.0f} pans."]},
         {"n": "3.2", "marks": 2, "kind": "calc", "spec": "3.5.2", "q": "Using Table 1, calculate Harbour Kitchenware Ltd's margin of safety.",
          "answer": f"{HK['output']:,} - {_hk_beo:,.0f} = {_hk_mos:,.0f} pans.", "points": ["1 mark: actual output - break-even output.", f"1 mark: {_hk_mos:,.0f} pans (own figure rule)."]},
         {"n": "3.3", "marks": 4, "kind": "short", "spec": "3.7.5",
          "q": "Explain one effect on Harbour Kitchenware Ltd of a fall in the value of the pound against the euro.",
          "content": ["Exports: euro prices can stay the same while each euro converts into more pounds - higher revenue/margin on 40% of sales, or prices in euros can be cut to win sales.",
                      "Imports: Swedish steel costs more in pounds - higher variable costs, lowering contribution.",
                      "Net effect depends on the balance of euro revenue and euro costs - natural hedge.",
                      "Marks: 1 knowledge, 1 application to Harbour, 2 developed chain of reasoning."]},
         {"n": "3.4", "marks": 9, "kind": "analyse", "spec": "3.4.4",
          "q": "Analyse the benefits to Harbour Kitchenware Ltd of changing from quality control to quality assurance.",
          "content": ["QA prevents defects at each stage instead of finding them at the end - fewer of the 6% rejected pans, cutting wasted materials, energy and labour.",
                      "Lower unit costs raise contribution and lower break-even output, increasing the margin of safety.",
                      "Fewer end-line inspectors needed - employee costs saved; operators given responsibility (Herzberg motivator) may be more engaged.",
                      "More consistent quality improves reputation with department stores and EU retailers - supports premium pricing.",
                      "BUT training costs and time; relies on operators' commitment - quality may suffer during transition."]},
         {"n": "3.5", "marks": 16, "kind": "evaluate", "spec": "3.4.5 / 3.4.3",
          "q": "To what extent should all manufacturers hold low levels of inventory?",
          "content": ["For: low inventory reduces holding costs (storage, insurance, obsolescence), frees cash (Harbour's 9 weeks of sales ties up working capital), and exposes inefficiencies (lean/JIT).",
                      "Against: buffer stock lets manufacturers meet sudden demand and guarantee quick delivery - a competitive advantage for Harbour with retailers.",
                      "Against: supply-chain risk - imported materials, long lead times or disruption (pandemics, shipping) make low inventory dangerous.",
                      "Seasonal demand (e.g. Christmas cookware) may require building inventory in advance.",
                      "Depends on product (perishable/fashion v durable), reliability of suppliers, cost of stock-outs, cash position.",
                      "Judgement: low inventory suits stable demand and reliable local suppliers; 'all' is unlikely - many should hold an optimal, not minimal, level."]},
     ]},
]

# ═════════════════════════════════════════════════════════════════════════
# SET B
# ═════════════════════════════════════════════════════════════════════════
PF = {"members": (412000, 468000), "ca": 9.6, "cl": 16.0, "market": 7.2}
_pf_growth = (PF["members"][1] - PF["members"][0]) / PF["members"][0] * 100
_pf_cr = PF["ca"] / PF["cl"]
LU = {"rd": 3.9, "rev": 52.0}
_lu_rd = LU["rd"] / LU["rev"] * 100
RB = {"ncl": 1.8, "eq": 4.2}
_rb_gear = RB["ncl"] / (RB["ncl"] + RB["eq"]) * 100

SET_B = [
    {"title": "PeakFit Gyms plc",
     "text": [
         "PeakFit Gyms plc runs 160 budget gyms across the UK. Members pay a low monthly fee, there are no contracts, and the gyms are open 24 hours a day with very few staff. The UK budget gym market has grown quickly but is very competitive, with three large chains and many independent gyms.",
         "Building a new gym costs around £1.5m, but empty buildings in town centres have become cheaper to rent. Members can switch gyms easily, and many now use free fitness apps and online classes at home.",
         "PeakFit is considering launching a premium brand, 'PeakFit Plus', with higher fees, personal trainers and spa facilities, in 20 of its largest gyms."],
     "appendices": [
         {"title": "Appendix A  PeakFit Gyms plc selected data", "table": [["", "2023", "2024"], ["Members (year end)", f"{PF['members'][0]:,}", f"{PF['members'][1]:,}"],
                                                                         ["Current assets (£m)", "", f"{PF['ca']}"], ["Current liabilities (£m)", "", f"{PF['cl']:.1f}"],
                                                                         ["Average monthly fee", "£22.99", "£23.99"]]},
         {"title": "Appendix B  UK gym market share by number of members, 2024 (%)", "table": [["PureGym", "The Gym Group", "PeakFit", "Other budget chains", "Mid-market and premium chains", "Independent gyms"], ["18", "14", f"{PF['market']}", "9", "21", "30.8"]]},
         {"title": "Appendix C  PeakFit survey of members (2024)",
          "table": [["Question", "Agree (%)"], ["I would pay £15 more a month for personal training and spa access", "21"],
                    ["Price is the main reason I chose PeakFit", "68"], ["I have used a free fitness app in the last month", "57"]],
          "note": "Stratified sample of 3 000 members by age group and region."},
     ],
     "parts": [
         {"n": "1.1", "marks": 2, "kind": "calc", "spec": "3.3.2", "q": "Using Appendix A, calculate the percentage change in PeakFit Gyms plc's membership between 2023 and 2024.",
          "answer": f"({PF['members'][1]:,} - {PF['members'][0]:,}) / {PF['members'][0]:,} x 100 = +{_pf_growth:.1f}%.", "points": ["1 mark: correct method.", f"1 mark: {_pf_growth:.1f}% increase."]},
         {"n": "1.2", "marks": 2, "kind": "calc", "spec": "3.7.2", "q": "Using Appendix A, calculate PeakFit Gyms plc's current ratio for 2024.",
          "answer": f"{PF['ca']} / {PF['cl']:.1f} = {_pf_cr:.1f} : 1 (accept {_pf_cr:.2f}).", "points": ["1 mark: current assets / current liabilities.", f"1 mark: {_pf_cr:.1f} : 1."]},
         {"n": "1.3", "marks": 4, "kind": "short", "spec": "3.3.2",
          "q": "Explain one benefit to PeakFit Gyms plc of using a stratified sample for its survey in Appendix C.",
          "content": ["Stratified sampling chooses respondents in proportion to sub-groups (age, region) - results reflect the make-up of the membership.",
                      "PeakFit can see whether demand for 'PeakFit Plus' differs by age or region - helps choose which 20 gyms to convert.",
                      "Reduces sampling bias compared with an unstructured sample; with 3 000 respondents results are more reliable.",
                      "Marks: 1 knowledge, 1 application, 2 developed explanation."]},
         {"n": "1.4", "marks": 9, "kind": "analyse", "spec": "3.7.7",
          "q": "Using Porter's five forces, analyse why profit margins in the UK budget gym market may be low.",
          "content": ["Rivalry: three large chains plus many independents; PeakFit's share only 7.2% - competition on price keeps fees low.",
                      "Buyer power: no contracts and easy switching; 68% chose on price - members move for cheaper fees.",
                      "Threat of substitutes: free apps and online classes (57% used one) cap the price gyms can charge.",
                      "Threat of entry: cheaper town-centre buildings lower barriers; independent gyms can enter easily.",
                      "Supplier power is probably moderate (landlords, equipment suppliers) - but rising energy costs for 24-hour gyms squeeze margins.",
                      "Analysis should link each force to lower prices or higher costs and therefore lower margins."]},
         {"n": "1.5", "marks": 16, "kind": "evaluate", "spec": "3.8.1 / 3.8.2",
          "q": "To what extent does the information suggest that launching 'PeakFit Plus' is a good strategic decision?",
          "content": ["For: differentiated product with higher fees raises revenue per member; reduces dependence on price competition and the substitute threat (personal trainers can't be replicated by an app).",
                      "For: 21% would pay £15 more - from 468 000 members that is a large potential customer base, especially in the largest gyms.",
                      "Against: 68% chose PeakFit on price - brand associated with 'budget'; brand confusion could damage both offers.",
                      "Against: mid-market and premium chains already hold 21% of the market - strong competition; spa facilities require capital investment while the current ratio is only 0.6.",
                      "Against: survey intentions may overstate actual behaviour ('would pay' v will pay).",
                      "Judgement: a trial in a few gyms, using sales data to test demand, could reduce risk; success depends on execution, location and whether costs can be covered."]},
     ]},
    {"title": "Lumen Ltd",
     "text": [
         "Lumen Ltd designs and makes energy-efficient LED lighting for offices, schools and hospitals. It was set up by two engineers 15 years ago and now employs 340 people in Cambridge.",
         "Lumen's success is based on innovation. It holds 26 patents and spends heavily on research and development (R&D). Each year it benchmarks its products against those of larger competitors from Germany and Japan.",
         "Lumen encourages intrapreneurship: engineers can spend 10% of their working time on their own projects, and the best ideas receive funding. Two of its best-selling products started this way. However, some managers argue the scheme distracts engineers from urgent customer orders."],
     "appendices": [{"title": "Table 1  Lumen Ltd selected data (2024)", "table": [["Revenue", f"£{LU['rev']:.0f}m"], ["R&D spending", f"£{LU['rd']}m"], ["Number of patents held", "26"],
                                                                                 ["Revenue from products launched in last 3 years", "41%"]]}],
     "parts": [
         {"n": "2.1", "marks": 2, "kind": "short", "spec": "3.9.2", "q": "What is meant by benchmarking?",
          "content": ["Comparing a business's products, processes or performance against those of the best in the industry (or other industries) to identify improvements. 1 mark partial, 2 marks full."]},
         {"n": "2.2", "marks": 3, "kind": "calc", "spec": "3.5.2", "q": "Using Table 1, calculate Lumen Ltd's R&D spending as a percentage of its revenue.",
          "answer": f"£{LU['rd']}m / £{LU['rev']:.0f}m x 100 = {_lu_rd:.1f}%.", "points": ["1 mark: correct figures selected.", "1 mark: correct method.", f"1 mark: {_lu_rd:.1f}%."]},
         {"n": "2.3", "marks": 4, "kind": "short", "spec": "3.9.2", "q": "Explain how patents might benefit Lumen Ltd.",
          "content": ["Patents give the legal right to stop others copying an invention for up to 20 years.",
                      "Lumen can charge higher prices (inelastic demand) without rivals undercutting with copies - earns a return on high R&D spending.",
                      "Can license patents to others for royalties; patents add value to the business (asset for investors).",
                      "Marks: 1 knowledge, 1 application, 2 developed reasoning."]},
         {"n": "2.4", "marks": 9, "kind": "analyse", "spec": "3.9.2 / 3.6.4",
          "q": "Analyse how intrapreneurship might help Lumen Ltd to remain innovative.",
          "content": ["Gives engineers time and funding to pursue ideas - generates new products from inside the business (two best-sellers started this way).",
                      "Motivates skilled staff through responsibility, achievement and recognition (Herzberg) - helps retain talent in a competitive labour market.",
                      "Ideas come from people closest to the technology and customers - faster process and product innovation.",
                      "Supports an innovative (task) culture rather than relying only on a central R&D department.",
                      "BUT reduces time on customer orders; many projects fail; needs good selection of ideas to justify the 10% time cost."]},
         {"n": "2.5", "marks": 16, "kind": "evaluate", "spec": "3.9.2",
          "q": "Is investing in research and development the best way for all businesses to become innovative? Justify your view.",
          "content": ["For: R&D produces new technology and patentable products - essential in tech/pharma (Lumen spends 7.5% of revenue; 41% revenue from new products).",
                      "For: R&D builds core competences that are hard to copy.",
                      "Against: expensive and risky - most projects fail; small firms or low-margin businesses may not afford it.",
                      "Against: other routes - kaizen (incremental process innovation), intrapreneurship, benchmarking, acquiring innovative firms, licensing, customer co-creation.",
                      "Against: in services (retail, hospitality) innovation is often in process and customer experience rather than lab-based R&D.",
                      "Judgement: depends on industry, size, finance and culture - culture and leadership are often what make R&D spending effective."]},
     ]},
    {"title": "Riverside Brewery Ltd",
     "text": [
         "Riverside Brewery Ltd is a craft brewery in Devon owned by the Holt family. It sells beer to local pubs and through its own website. Demand is growing, but the brewery is operating at full capacity.",
         "To expand, it needs £2m for new brewing equipment and a bigger warehouse. The bank has offered a five-year loan. A family member suggested crowd funding instead, offering investors shares in the business plus discounts on beer. Several craft breweries have raised money this way.",
         "One director has also suggested converting to a public limited company in the longer term, but the founder, Sam Holt, is worried that the brewery's mission - 'local ingredients, brewed slowly' - would suffer."],
     "appendices": [{"title": "Table 1  Riverside Brewery Ltd statement of financial position (extract, £m)", "table": [["Non-current liabilities", f"{RB['ncl']}"], ["Total equity", f"{RB['eq']}"]]}],
     "parts": [
         {"n": "3.1", "marks": 2, "kind": "short", "spec": "3.5.3", "q": "What is meant by crowd funding?",
          "content": ["Raising finance from a large number of people, each investing a small amount, usually through an online platform (in return for shares, rewards or interest)."]},
         {"n": "3.2", "marks": 2, "kind": "calc", "spec": "3.7.2", "q": "Using Table 1, calculate Riverside Brewery Ltd's gearing.",
          "answer": f"{RB['ncl']} / ({RB['ncl']} + {RB['eq']}) x 100 = {_rb_gear:.0f}%.", "points": ["1 mark: correct method.", f"1 mark: {_rb_gear:.0f}%."]},
         {"n": "3.3", "marks": 4, "kind": "short", "spec": "3.1.2",
          "q": "Explain one reason why Sam Holt might not want Riverside Brewery Ltd to become a public limited company.",
          "content": ["Loss of control - shares sold publicly could be bought by large investors or rivals (takeover risk).",
                      "Pressure for short-term profit from shareholders could conflict with the 'brewed slowly' mission (higher costs).",
                      "Costs and disclosure requirements of a stock market listing.",
                      "Marks: 1 knowledge, 1 application, 2 development."]},
         {"n": "3.4", "marks": 9, "kind": "analyse", "spec": "3.5.3",
          "q": "Analyse the benefits to Riverside Brewery Ltd of using crowd funding rather than the bank loan.",
          "content": [f"No interest or repayments - protects cash flow while new equipment is installed; gearing stays at {_rb_gear:.0f}% rather than rising (to about {(RB['ncl'] + 2) / (RB['ncl'] + 2 + RB['eq']) * 100:.0f}% with the loan).",
                      "Investors become loyal customers and brand ambassadors - discounts encourage repeat purchase; free marketing and publicity.",
                      "Campaign success shows demand evidence (market research) and may attract pub stockists.",
                      "Many small investors keep the Holt family in control (no single large shareholder).",
                      "BUT shares are diluted; fees; campaign may fail; many shareholders to communicate with."]},
         {"n": "3.5", "marks": 16, "kind": "evaluate", "spec": "3.5.3",
          "q": "To what extent is crowd funding a better source of finance than a bank loan for all small businesses?",
          "content": ["For: no interest, accessible when banks refuse lending, marketing benefits, investor-customers.",
                      "Against: suits consumer-facing brands with a story (breweries, food, tech gadgets) - B2B or unexciting businesses struggle to attract crowds.",
                      "Against: dilution of ownership and future dividends; failure is public and damaging.",
                      "Against: bank loans are quicker, keep ownership, interest is tax-deductible, and suit businesses with stable cash flow and assets for security.",
                      "Depends on: amount needed, gearing, interest rates, the business's appeal to the public, owners' attitude to control.",
                      "Judgement: neither is better for all - the best source depends on purpose, timescale and business type."]},
     ]},
]

# ═════════════════════════════════════════════════════════════════════════
# SET C
# ═════════════════════════════════════════════════════════════════════════
AT = {"cap": 420, "out": 315, "rev": (186.0, 171.0), "op": (22.3, 13.7)}
_at_cu = AT["out"] / AT["cap"] * 100
_at_opm = [AT["op"][i] / AT["rev"][i] * 100 for i in (0, 1)]
TC = {"rev": 28.0, "returns": 7.7, "share_rev": 28.0, "market": 1650.0}
_tc_ret = TC["returns"] / TC["rev"] * 100
_tc_share = TC["share_rev"] / TC["market"] * 100

SET_C = [
    {"title": "Atlas Bricks plc",
     "text": [
         "Atlas Bricks plc makes clay bricks for house builders. Bricks are heavy and expensive to transport, so Atlas has six brickworks spread across the UK. Each works contains kilns that must run continuously; once a kiln is switched off it is costly and slow to restart.",
         "Demand for bricks depends on house building, which has fallen as higher interest rates have made mortgages more expensive. Atlas is now producing well below capacity. It is considering 'mothballing' (temporarily closing) its oldest works in Lancashire.",
         "A smaller rival, Hartley Bricks Ltd, has offered itself for sale. Hartley has two modern, energy-efficient works and specialises in high-value handmade bricks for restoration projects."],
     "appendices": [
         {"title": "Appendix A  Atlas Bricks plc data", "table": [["", "2023", "2024"], ["Revenue (£m)", f"{AT['rev'][0]}", f"{AT['rev'][1]}"], ["Operating profit (£m)", f"{AT['op'][0]}", f"{AT['op'][1]}"],
                                                                  ["Capacity (million bricks)", f"{AT['cap']}", f"{AT['cap']}"], ["Output (million bricks)", "378", f"{AT['out']}"]]},
         {"title": "Appendix B  Economic data", "table": [["", "2022", "2023", "2024"], ["Bank of England base rate (year end, %)", "3.5", "5.25", "4.75"], ["UK new homes started (000s)", "190", "164", "149"]]},
         {"title": "Appendix C  Hartley Bricks Ltd", "table": [["Asking price", "£48m"], ["Operating profit 2024", "£4.1m"], ["Capacity utilisation 2024", "92%"], ["Energy use per 1 000 bricks", "35% below industry average"]]},
     ],
     "parts": [
         {"n": "1.1", "marks": 2, "kind": "calc", "spec": "3.4.2", "q": "Using Appendix A, calculate Atlas Bricks plc's capacity utilisation in 2024.",
          "answer": f"{AT['out']} / {AT['cap']} x 100 = {_at_cu:.0f}%.", "points": ["1 mark: method.", f"1 mark: {_at_cu:.0f}%."]},
         {"n": "1.2", "marks": 3, "kind": "calc", "spec": "3.5.2", "q": "Using Appendix A, calculate the change in Atlas Bricks plc's operating profit margin between 2023 and 2024, in percentage points.",
          "answer": f"2023: {AT['op'][0]} / {AT['rev'][0]} = {_at_opm[0]:.1f}%; 2024: {AT['op'][1]} / {AT['rev'][1]} = {_at_opm[1]:.1f}%; fall of {_at_opm[0] - _at_opm[1]:.1f} percentage points.",
          "points": [f"1 mark: 2023 margin {_at_opm[0]:.1f}%.", f"1 mark: 2024 margin {_at_opm[1]:.1f}%.", f"1 mark: fall of {_at_opm[0] - _at_opm[1]:.1f} percentage points."]},
         {"n": "1.3", "marks": 4, "kind": "short", "spec": "3.1.3 / 3.7.5", "q": "Using Appendix B, explain how changes in interest rates have affected the demand for Atlas Bricks plc's products.",
          "content": ["Base rate rose from 3.5% to 5.25% - higher mortgage costs reduce demand for new homes; house builders started fewer homes (190k to 149k, -22%).",
                      "Bricks are a derived demand - fewer homes started means fewer bricks ordered (output fell from 378m to 315m).",
                      "Higher rates also raise house builders' borrowing costs, delaying projects.",
                      "Marks: 1 knowledge, 1 application with data, 2 development."]},
         {"n": "1.4", "marks": 9, "kind": "analyse", "spec": "3.4.3 / 3.9.1",
          "q": "Analyse the possible benefits to Atlas Bricks plc of mothballing its Lancashire works.",
          "content": [f"Capacity utilisation is only {_at_cu:.0f}% - closing the oldest works raises utilisation of the remaining works, spreading fixed costs over more output and lowering unit costs.",
                      "The oldest works is probably least energy-efficient - large energy saving.",
                      "Cuts fixed costs (staff, maintenance) helping to restore the operating margin (down to 8.0%).",
                      "Mothballing rather than closing keeps the option to restart when interest rates fall and house building recovers.",
                      "BUT restarting kilns is costly and slow; transport costs rise for customers in the North West; redundancy costs and loss of skilled staff."]},
         {"n": "1.5", "marks": 16, "kind": "evaluate", "spec": "3.9.1 / 3.7.8",
          "q": "Using the data, to what extent should Atlas Bricks plc buy Hartley Bricks Ltd?",
          "content": ["For: Hartley's handmade/restoration niche is less dependent on new-house building - diversifies risk; higher value products.",
                      "For: modern, energy-efficient works (35% less energy) - lower costs; 92% utilisation shows demand.",
                      "Against: £48m for £4.1m operating profit = 8.5% return - similar to Atlas's own weak performance; payback over 11 years on profit.",
                      f"Against: Atlas already has spare capacity ({_at_cu:.0f}% utilisation) - buying more capacity in a downturn adds risk; finance may require borrowing at high interest rates.",
                      "Integration risks: culture of a small craft business v large plc; key craftsmen may leave.",
                      "Judgement: depends on finance source, expected recovery of house building, synergies and whether Atlas can keep Hartley's niche expertise."]},
     ]},
    {"title": "Kindred Care",
     "text": [
         "Kindred Care is a social enterprise that runs eight residential care homes for older people in Yorkshire. Its mission is 'care with dignity, run by the community'. Any surplus is reinvested in its homes and staff.",
         "Kindred Care's largest costs are staff wages. Recruiting and keeping care workers is difficult: the work is demanding and pay in the sector is low. Kindred Care has introduced a talent development programme with paid qualifications, mentoring and a clear path to senior roles.",
         "One home, Elm House, is in an old building that needs £1.2m of repairs. The board is considering closing it and moving its 28 residents to other Kindred Care homes. Residents' families, staff, the local council (which pays for many places) and the local newspaper all have strong views."],
     "appendices": [{"title": "Table 1  Kindred Care staff data", "table": [["", "2022", "2023", "2024"], ["Labour turnover (%)", "34", "29", "22"],
                                                                         ["Agency staff costs (£000)", "940", "780", "510"], ["Care workers holding a qualification (%)", "41", "55", "68"]]}],
     "parts": [
         {"n": "2.1", "marks": 9, "kind": "analyse", "spec": "3.6.1 / 3.6.2",
          "q": "Analyse how Kindred Care's talent development programme may have helped it to achieve its objectives.",
          "content": ["Paid qualifications and a career path meet esteem and self-actualisation needs/motivators - labour turnover fell from 34% to 22%.",
                      "Lower turnover cut agency staff costs from £940k to £510k - more surplus to reinvest in homes (social enterprise objective).",
                      "Qualified staff (41% to 68%) provide better care - supports the mission of 'care with dignity' and reputation with families and the council.",
                      "Continuity of staff improves relationships with residents.",
                      "BUT costs of training; qualified staff may leave for better-paid NHS roles; other factors (pay, sector-wide changes) may explain improvements."]},
         {"n": "2.2", "marks": 9, "kind": "analyse", "spec": "3.2.3",
          "q": "Analyse how stakeholder mapping could help Kindred Care's board manage the proposed closure of Elm House.",
          "content": ["Map stakeholders by power and interest: local council (high power - funds places; high interest) - manage closely; families and residents (high interest) - keep informed/consult; staff (high interest); local newspaper (power over reputation).",
                      "Identifies who must be consulted early and who could block or damage the decision (council contracts, bad publicity).",
                      "Helps prioritise communication resources and choose methods (meetings with families, consultation with staff representatives).",
                      "Reduces conflict and protects reputation, supporting future funding.",
                      "BUT positions change over time (newspaper campaign could raise families' power); mapping is subjective."]},
         {"n": "2.3", "marks": 16, "kind": "evaluate", "spec": "3.7.1 / 3.1.1",
          "q": "To what extent do all businesses benefit from having a mission that goes beyond making a profit?",
          "content": ["For: purpose attracts and motivates employees (values alignment), customers and investors who care about ethics - Kindred Care's mission supports recruitment and trust.",
                      "For: guides decisions and long-term strategy; avoids short-termism; CSR reputation (Carroll's ethical/philanthropic levels).",
                      "Against: may conflict with shareholders' demands for returns; higher costs; risk of 'purpose washing' if not genuine.",
                      "Against: in highly price-competitive markets customers may not reward the mission; survival may require focus on profit first (Carroll's base).",
                      "Depends on ownership (social enterprise v plc), industry, customers' values and how the mission is put into practice.",
                      "Judgement: most businesses benefit if the mission is credible and compatible with financial sustainability - but 'all' needs qualification."]},
     ]},
    {"title": "Thread & Co",
     "text": [
         "Thread & Co is an online fashion retailer selling affordable clothes for 18-30 year olds. It sells only through its website and app. It uses dynamic pricing, changing prices several times a day depending on demand, competitors' prices and stock levels.",
         "Much of its promotion relies on social media and viral marketing, such as videos created by influencers. One video in 2024 was viewed 14 million times and led to a record week of sales.",
         "Returns are a major problem: customers often order several sizes and send most back. Processing returns is costly and many returned items cannot be resold at full price."],
     "appendices": [{"title": "Table 1  Thread & Co data (2024)", "table": [["Revenue (before returns)", f"£{TC['rev']:.0f}m"], ["Value of items returned", f"£{TC['returns']}m"],
                                                                          ["UK online fashion market, 18-30 segment (sales value)", f"£{TC['market']:,.0f}m"], ["Thread & Co net revenue in this segment", f"£{TC['share_rev']:.0f}m"]]}],
     "parts": [
         {"n": "3.1", "marks": 2, "kind": "short", "spec": "3.3.4", "q": "What is meant by viral marketing?",
          "content": ["Marketing messages (often videos or posts) that are designed to be shared rapidly by consumers themselves through social media, spreading awareness at low cost."]},
         {"n": "3.2", "marks": 3, "kind": "calc", "spec": "3.5.2", "q": "Using Table 1, calculate the value of returned items as a percentage of Thread & Co's revenue.",
          "answer": f"£{TC['returns']}m / £{TC['rev']:.0f}m x 100 = {_tc_ret:.1f}%.", "points": ["1 mark: figures selected.", "1 mark: method.", f"1 mark: {_tc_ret:.1f}%."]},
         {"n": "3.3", "marks": 2, "kind": "calc", "spec": "3.3.2", "q": "Using Table 1, calculate Thread & Co's market share of the 18-30 segment.",
          "answer": f"£{TC['share_rev']:.0f}m / £{TC['market']:,.0f}m x 100 = {_tc_share:.1f}%.", "points": ["1 mark: method.", f"1 mark: {_tc_share:.1f}%."]},
         {"n": "3.4", "marks": 9, "kind": "analyse", "spec": "3.3.4",
          "q": "Analyse how dynamic pricing might affect Thread & Co's profit.",
          "content": ["Prices rise when demand is high (viral video weeks) - captures more revenue per item and higher margins.",
                      "Prices fall automatically on slow-moving lines - clears inventory before it goes out of fashion, reducing markdown losses and storage costs.",
                      "Responds instantly to rivals' prices - protects sales volume in a price-sensitive market (young customers, elastic demand).",
                      "Software and data costs; risk of customer resentment if prices change between visits - may damage loyalty and increase returns/abandoned baskets.",
                      "Net effect on profit depends on PED, accuracy of the algorithm and how customers perceive fairness."]},
         {"n": "3.5", "marks": 16, "kind": "evaluate", "spec": "3.3.3 / 3.8.2",
          "q": "To what extent is choosing the right position on a market map the key to success for all retailers?",
          "content": ["For: market mapping shows gaps and where competitors are crowded - a clear position (e.g. affordable trend fashion for 18-30s) targets the right customers and supports pricing.",
                      "For: positioning drives the whole marketing mix and brand identity.",
                      "Against: execution matters more - supply chain speed, returns costs, customer service and digital marketing decide success (Thread & Co's returns are 27.5% of revenue).",
                      "Against: gaps may exist because they are unprofitable; positions are easy to copy; markets change quickly (fashion).",
                      "Against: financial management, location (for physical stores), and operational efficiency.",
                      "Judgement: positioning is necessary but not sufficient; its importance is greater in crowded markets and for new entrants."]},
     ]},
]

SETS = {"A": SET_A, "B": SET_B, "C": SET_C}
