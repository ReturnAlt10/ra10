# RA10 practice papers for Unit 3 (80 marks, Pearson format). Numbers are computed so every mark scheme is exact.

def gbp(n):
    return '£{:,.0f}'.format(n) if float(n).is_integer() else '£{:,.2f}'.format(n)

def sp(n):
    return '{:,.0f}'.format(n).replace(',', ' ') if float(n).is_integer() else '{:,.2f}'.format(n)

def lv(items):
    return '\n'.join(['• ' + i for i in items])

def item(q, sub, marks, section, text, ctxb=None, ms=None, levels=None):
    it = {'q': q, 'sub': sub, 'marks': marks, 'section': section, 'ctx': [], 'ctxb': ctxb or [], 'text': text, 'qTotal': None}
    if ms:
        it['ms'] = {'body': ms, 'levels': levels}
    return it

def pts(first, bullets):
    return first + '\n' + '\n'.join(['• ' + b for b in bullets])

def build_paper(pid, key, title, P):
    items = []
    S = 'A'
    # ---- Section A ----
    items.append(item(1, None, 2, 'A', 'Identify two benefits of paying by contactless card.', ms=pts('Award one mark for each benefit identified, up to a maximum of two marks.', ['Quick / saves time (1)', 'No PIN needed for small amounts (1)', 'Reduces handling of cash (1)', 'Can be used with phones/wearables (1)', 'Hygienic – no contact (1)', 'Accept any other appropriate response.'])))
    items.append(item(2, None, 2, 'A', 'Give two features of a student current account.', ms=pts('Award one mark for each feature, up to a maximum of two marks.', ['Interest-free overdraft (1)', 'No monthly fee (1)', 'Railcard/discount perks (1)', 'Overdraft reduces after graduation (1)'])))
    items.append(item(3, None, 2, 'A', 'Explain one advantage for an individual of borrowing from a credit union.', ms=pts('Award one mark for an advantage and one mark for a linked development.', ['Loans are low cost / capped interest (1) so repayments are more affordable (1)', 'Not-for-profit / member-owned (1) so profits are returned to members or kept low cost (1)', 'Considers people with poor credit histories (1) giving access to borrowing that other lenders refuse (1)', 'Accept any other reasonable answer.'])))
    items.append(item(4, None, 4, 'A', 'Explain two disadvantages for an individual of using a store card.', ms=pts('Award one mark for each disadvantage and one for a linked development, up to four marks.', ['High interest rate / APR (1) so unpaid balances become expensive (1)', 'Can only be used in one retailer/group (1) so limited usefulness (1)', 'Encourages overspending through offers (1) leading to debt (1)', 'Missed payments harm credit rating (1) making future borrowing harder (1)'])))
    # Q5 discuss
    c5 = [{'t': 'p', 'x': P['q5_ctx']}]
    items.append(item(5, None, 6, 'A', P['q5_q'], ctxb=c5, ms=lv(P['q5_ms']) + '\n(6)', levels=6))
    # Q6 evaluate with table
    c6 = [{'t': 'p', 'x': P['q6_ctx']}, {'t': 'grid', 'head': P['q6_head'], 'rows': P['q6_rows']}]
    items.append(item(6, None, 12, 'A', P['q6_q'], ctxb=c6, ms=lv(P['q6_ms']) + '\n(12)', levels=12))
    # ---- Section B ----
    items.append(item(7, None, 2, 'B', 'Give two examples of revenue expenditure.', ms=pts('Award one mark for each example, up to a maximum of two marks.', ['Wages / salaries (1)', 'Rent / rates (1)', 'Utilities (1)', 'Insurance (1)', 'Marketing (1)', 'Inventory purchases (1)', 'Do not accept purchase of machinery or vehicles (capital expenditure).'])))
    items.append(item(8, None, 2, 'B', 'Explain one impact of leasing equipment on a small business.', ms=pts('Award one mark for an impact and one mark for a linked development.', ['No large initial outlay (1) so cash is available for other purposes (1)', 'The business does not own the asset (1) so cannot sell it or use it as security (1)', 'Regular lease payments (1) increase fixed costs over the long term (1)'])))
    items.append(item(9, None, 2, 'B', 'Give two sources of internal finance.', ms=pts('Award one mark for each source, up to a maximum of two marks.', ['Retained profit (1)', 'Sale of assets (1)', 'Net current assets / working capital (1)', 'Do not accept bank loan or overdraft.'])))
    # Q10 break-even
    fc, vc, price = P['fc'], P['vc'], P['price']
    sales = P['sales']
    months = P['months']
    rev = [s * price for s in sales]
    tvc = [s * vc for s in sales]
    tc = [fc + v for v in tvc]
    # missing cells: (i) tvc[0], (ii) tc[0], (iii) sales[1], (iv) rev[4]
    head = ['Estimated cost/ revenue'] + months
    def cell(vals, miss):
        return [('(%s)' % miss[i]) if i in miss else sp(v) for i, v in enumerate(vals)]
    rows = [['Number of sales'] + [('(iii)' if i == 1 else sp(v)) for i, v in enumerate(sales)],
            ['Total revenue (£)'] + [('(iv)' if i == 4 else sp(v)) for i, v in enumerate(rev)],
            ['Fixed costs (£)'] + [sp(fc)] * 6,
            ['Total variable costs (£)'] + [('(i)' if i == 0 else sp(v)) for i, v in enumerate(tvc)],
            ['Total costs (£)'] + [('(ii)' if i == 0 else sp(v)) for i, v in enumerate(tc)]]
    c10 = [{'t': 'p', 'x': P['q10_ctx']}, {'t': 'grid', 'head': head, 'rows': rows}]
    items.append(item(10, 'a', 4, 'B', 'Calculate the figures missing from the table above.', ctxb=c10, ms=pts('Award one mark for each correct answer.', ['(i) ' + sp(tvc[0]), '(ii) ' + sp(tc[0]) + ' (ECF) Addition of (i) + fixed costs', '(iii) ' + sp(sales[1]), '(iv) ' + sp(rev[4])]) + '\n(4)'))
    nvc, nprice, nfc = P['nvc'], P['nprice'], P['nfc']
    contr = nprice - nvc
    bep = nfc / contr
    c10b = [{'t': 'p', 'x': P['q10b_ctx']}]
    items.append(item(10, 'b', 4, 'B', 'Calculate the break-even point per month for the new %s if it has: variable costs of %s per %s; a selling price of %s; fixed costs of %s. Show your workings.' % (P['biz'], gbp(nvc), P['unit'], gbp(nprice), gbp(nfc)), ctxb=c10b,
                     ms=pts('Award four marks for the correct response of %s %ss per month. Accept with or without the unit.' % (sp(bep), P['unit']), ['OR Award three marks for the correct formula in numbers: BEP = %s / (%s − %s) (3)' % (sp(nfc), sp(nprice), sp(nvc)), 'OR Award one mark for the correct contribution of %s AND one mark for the formula in words: Break-even point = fixed costs ÷ (selling price − variable cost) (2)' % gbp(contr)]) + '\n(4)'))
    ms_units = P['est_c']
    mos = ms_units - bep
    items.append(item(10, 'c', 2, 'B', 'Calculate the margin of safety in the final month for the new %s, which expects to sell %s %ss. Show your workings.' % (P['biz'], sp(ms_units), P['unit']),
                     ms=pts('Award two marks for the correct response of %s %ss. Apply ECF using the break-even point from 10(b).' % (sp(mos), P['unit']), ['OR Award one mark for the formula in words: margin of safety = expected sales − break-even point (1)', 'OR one mark for the formula in numbers: %s − %s (1)' % (sp(ms_units), sp(bep))]) + '\n(2)'))
    items.append(item(10, 'd', 6, 'B', P['q10d'], ms=lv(P['q10d_ms']) + '\n(6)', levels=6))
    # Q11
    ca, cl, rv, cs, ex, tr, crs = P['ca'], P['cl'], P['rev'], P['cos'], P['exp'], P['tr'], P['credit']
    gp = rv - cs
    ctx11 = [{'t': 'p', 'x': P['q11_ctx']}, {'t': 'cap', 'x': 'Extract of financial information for %s' % P['co']},
             {'t': 'grid', 'head': ['', '£'], 'rows': [['Current assets', sp(ca)], ['Current liabilities', sp(cl)], ['Total revenue', sp(rv)], ['Cost of sales', sp(cs)], ['Expenses', sp(ex)], ['Trade receivables', sp(tr)], ['Credit sales', sp(crs)]]}]
    items.append(item(11, 'a', 2, 'B', 'Calculate the current ratio. Show your workings.', ctxb=ctx11, ms=pts('Award two marks for the correct response of %s : 1. Accept %s.' % (round(ca / cl, 2), round(ca / cl, 2)), ['OR award one mark for the formula in words: current ratio = current assets ÷ current liabilities (1)', 'Accept the correct answer anywhere in the workings box. A ratio of the two numbers (e.g. %s:%s) is not worth marks.' % (sp(ca), sp(cl))]) + '\n(2)'))
    items.append(item(11, 'b', 3, 'B', 'Calculate the gross profit margin. Show your workings.', ms=pts('Award three marks for the correct response of %s%%.' % round(gp / rv * 100, 1), ['Gross profit = %s − %s = %s (1)' % (sp(rv), sp(cs), sp(gp)), 'Formula: (gross profit ÷ revenue) × 100 (1)', 'Answer %s%% (1)' % round(gp / rv * 100, 1)]) + '\n(3)'))
    items.append(item(11, 'c', 2, 'B', 'Calculate the trade receivable days. Show your workings.', ms=pts('Award two marks for the correct response of %s days (accept %s).' % (round(tr / crs * 365, 1), round(tr / crs * 365)), ['OR one mark for the formula: (trade receivables ÷ credit sales) × 365 (1)']) + '\n(2)'))
    profit = gp - ex
    items.append(item(11, 'd', 3, 'B', 'Calculate the profit margin for the year. Show your workings.', ms=pts('Award three marks for the correct response of %s%%.' % round(profit / rv * 100, 1), ['Profit = gross profit − expenses = %s − %s = %s (1)' % (sp(gp), sp(ex), sp(profit)), 'Formula: (profit ÷ revenue) × 100 (1)', 'Answer %s%% (1)' % round(profit / rv * 100, 1)]) + '\n(3)'))
    items.append(item(11, 'e', 8, 'B', P['q11e'], ctxb=[{'t': 'p', 'x': P['q11e_ctx']}], ms=lv(P['q11e_ms']) + '\n(8)', levels=8))
    items.append(item(11, 'f', 12, 'B', P['q11f'], ctxb=[{'t': 'p', 'x': P['q11f_ctx']}], ms=lv(P['q11f_ms']) + '\n(12)', levels=12))
    for it in items:
        pass
    total = sum(i['marks'] for i in items)
    assert total == 80, total
    return {'id': pid, 'unit': 3, 'key': key, 'series': 'RA10 practice', 'date': 'RA10 practice paper', 'title': title, 'source': 'ra10', 'kind': 'exam', 'total': 80,
            'sec': {'A': 28, 'B': 52}, 'items': items, 'minutes': 120}


PAPER1 = dict(
    q5_ctx='Amir is 24 and works as an apprentice electrician. He needs a van costing £6,000 to get to jobs. He has £800 in savings. His bank offers a personal loan at 9.9% APR over three years with fixed monthly repayments of about £190. A dealer offers hire purchase: a £600 deposit and 36 payments of £175. Amir’s take-home pay is £1,350 a month and his rent and bills are £900.',
    q5_q='Discuss whether Amir should use a personal loan or hire purchase to buy the van.',
    q5_ms=['Personal loan: he owns the van immediately; fixed repayments of about £190 (£6,840 total) – compare to HP total £600 + 36 × £175 = £6,900; interest rate stated and can be compared; lender may check credit rating; early settlement fees', 'Hire purchase: lower monthly payment (£175) which suits a tight budget (£450 spare per month); deposit £600 of his £800 savings leaves little reserve; he does not own the van until the final payment and it can be repossessed; slightly higher total cost', 'Context: after bills £450 is available – either option is affordable but leaves little for emergencies; tools/van needed for work', 'Judgement: weigh ownership and total cost against the lower monthly payment and cash reserve'],
    q6_ctx='Priya is 27 and wants to save £5,000 for a deposit on a flat in two years. She does not want to risk losing her money. She has researched the following options.',
    q6_head=['Option', 'Interest / return', 'Access', 'Other features'],
    q6_rows=[['Easy-access saver', '2.1% AER variable', 'Instant', 'Protected by FSCS'], ['1-year fixed bond', '4.2% AER fixed', 'No access for 12 months', 'FSCS protected; minimum £1,000'], ['Cash ISA', '3.9% AER variable', 'Instant (withdrawals may reduce allowance)', 'Tax-free; FSCS protected'], ['Premium Bonds', 'No interest – monthly prizes', 'Withdraw any time', 'Backed by the Treasury; no guaranteed return']],
    q6_q='Evaluate which option would be most suitable for Priya.',
    q6_ms=['Easy-access saver: instant access useful for a deposit, FSCS protected, but lowest interest (2.1%) and variable – £5,000 earns about £105 in a year; could reduce if base rate falls', 'Fixed bond: highest rate (4.2% = £210 on £5,000 for a year) and certainty; but money locked in for 12 months; she needs funds in 2 years so could re-invest; not suitable if she needs the cash sooner', 'Cash ISA: 3.9% tax-free (£195), access if needed; tax benefit depends on her tax position (personal savings allowance means many basic-rate taxpayers pay no tax anyway); variable rate', 'Premium Bonds: no guaranteed return – average prize rate may be lower than interest and she wants low risk; inflation erodes value', 'Context: low risk, 2-year timescale, deposit target £5,000', 'Recommendation (e.g. cash ISA, or split between fixed bond and easy-access) with reasons why each alternative is less suitable'],
    biz='café', unit='sandwich', fc=3600, vc=2, price=5, sales=[400, 700, 900, 1000, 1200, 1300],
    months=['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    q10_ctx='Zainab owns Sunrise Sandwiches, a takeaway café with seating for 18 customers. She is considering opening a second branch near the university. She has estimated the following costs and revenue for the first six months of opening.',
    nvc=2, nprice=5, nfc=5400, est_c=2400,
    q10b_ctx='The new branch will be near the university, where rent is higher, so fixed costs will be higher than the estimates above.',
    q10d='Discuss the actions Zainab could take to improve the break-even point of the new branch.',
    q10d_ms=['Raise the selling price – increases contribution per sandwich, but students are price-sensitive and may buy elsewhere', 'Reduce variable costs – cheaper ingredients or packaging raise contribution but may reduce quality and reputation', 'Reduce fixed costs – smaller premises or shorter opening hours; may reduce customers or sales', 'Context: new branch has start-up costs; forecast sales in early months are below break-even so initial losses are likely; aim to break even in the longer term', 'Balanced conclusion – likely combination'],
    co='Orchard Studio Ltd', q11_ctx='Orchard Studio designs wedding stationery and has been trading for four years. You have been hired to help with its finances and have been given the following information.',
    ca=21000, cl=14000, rev=180000, cos=72000, exp=61000, tr=24000, credit=60000,
    q11e='Analyse the limitations of ratio analysis to Orchard Studio in deciding whether it can afford to take on a second studio.',
    q11e_ctx='The business predicts a 25% rise in revenue over the next 12 months if it takes on a second studio. Rent will be 50% higher and the new studio will employ two extra staff.',
    q11e_ms=['Ratios use historical data – the new studio’s rent, wages and revenue will change the figures', 'Only four years of trading so limited trend data; seasonal wedding business means year-end ratios may hide swings', 'Ratios do not show non-financial factors (reputation, quality, staff skills, demand for the new location)', 'Need comparison with similar businesses; different accounting policies', 'Cash flow forecasts and break-even are also needed; ratios do not show the cash needed for fit-out', 'Focus on limitations of ratios – not whether to expand'],
    q11f='Evaluate whether Orchard Studio should finance the second studio by using retained profit or by taking out a five-year bank loan of £40,000 at 8% interest.',
    q11f_ctx='Orchard Studio has retained profit of £22,000 and a bank balance of £9,000. The second studio needs £40,000 for fit-out and equipment. A bank loan of £40,000 at 8% a year would cost about £3,200 interest in the first year. The owner is worried about falling bookings if the economy slows.',
    q11f_ms=['Retained profit: no interest, no repayment, no security, owner keeps control; but only £22,000 so not enough alone and would drain reserves leaving little cash for wages/supplies', 'Bank loan: provides the full £40,000, spreads repayments, can combine with retained profit; interest cost (about £3,200 in year 1, more in total), regular repayments increase fixed costs and break-even, security may be required', 'Context: seasonal wedding business and possible fall in bookings raises risk of repayment problems; current ratio 1.5 and receivable days (146) show cash is tied up', 'Alternatives: leasing equipment, grant, crowd-funding, partial loan + retained profit', 'Justified recommendation with risks managed (e.g. smaller loan, cash flow forecast)'],
)

PAPER2 = dict(
    q5_ctx='Dev is 19 and has just started a university course. He has a student account with an interest-free overdraft of £1,500 and a maintenance loan paid each term. His laptop broke and he needs £700 for a replacement before an assignment deadline next week. A friend suggests he uses a payday loan; his bank offers to increase his overdraft; his parents could lend him £400.',
    q5_q='Discuss whether Dev should use his overdraft or a payday loan to pay for the laptop.',
    q5_ms=['Overdraft: interest-free up to £1,500 so no extra cost for the £700; instant; flexible repayment when the loan arrives; risk of using too much of the buffer and graduating with an overdraft that becomes costly', 'Payday loan: very high APR and fees; full repayment due quickly; risk of debt spiral and damage to credit rating; no benefit when he has a free overdraft', 'Context: student with irregular income; deadline gives urgency; parents could supplement; need a laptop for study', 'Judgement: the overdraft is clearly cheaper – discuss when a payday loan could be considered'],
    q6_ctx='Hannah and Sam are 32 and have a baby. They want life and health protection and are comparing four policies. Their budget is £60 a month.',
    q6_head=['Policy', 'Cost per month', 'Life cover', 'Critical illness cover', 'Excess/Notes'],
    q6_rows=[['SafeStart Basic', '£18', '£100,000 for 20 years', 'No', 'No payout if the term ends'], ['FamilyGuard', '£36', '£200,000 for 25 years', 'No', 'Premiums fixed for the term'], ['LifeShield Plus', '£58', '£200,000 for 25 years', '£50,000', 'Premiums fixed; payout once'], ['WholeLife Gold', '£95', '£150,000 for life', '£30,000', 'Premiums can rise every 5 years']],
    q6_q='Evaluate which policy would be most suitable for Hannah and Sam.',
    q6_ms=['SafeStart Basic: cheapest and affordable, but only £100,000 for 20 years – may not cover a mortgage and childcare; no critical illness cover; term ends before the child is independent', 'FamilyGuard: £36 is within budget; £200,000 for 25 years protects the family until the baby is an adult; no critical illness cover', 'LifeShield Plus: £58 is within £60 budget; includes critical illness £50,000 – covers loss of income if either is ill; leaves little spare budget', 'WholeLife Gold: £95 exceeds budget; cover for life but premiums rise; shorter-term needs', 'Context: young family, mortgage, baby, budget £60', 'Recommendation (FamilyGuard or LifeShield Plus) with reasons for rejecting the others'],
    biz='food stall', unit='portion', fc=2800, vc=1.5, price=6, sales=[250, 450, 600, 650, 800, 900],
    months=['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    q10_ctx='Lena runs Street Eats, a food stall that sells noodle boxes at markets. She plans to open a permanent unit in a food hall. She has estimated these costs and revenue for the first six months.',
    nvc=2, nprice=7, nfc=4500, est_c=1200,
    q10b_ctx='The food-hall unit will have higher rent and an extra member of staff, so costs will differ from the estimates above.',
    q10d='Discuss the actions Lena could take to improve the break-even point of the food-hall unit.',
    q10d_ms=['Raise the price – increases contribution per portion; risk of fewer customers in a competitive food hall', 'Reduce variable costs (bulk buying, simpler packaging) – but quality/brand', 'Reduce fixed costs (negotiate rent, fewer staff hours) – may reduce service/opening hours', 'Context: new unit; early sales below break-even; may accept loss initially', 'Balanced conclusion'],
    co='Lopez Garden Services', q11_ctx='Lopez Garden Services has operated for three years providing landscaping to homeowners and small businesses. The owner has given you the following information.',
    ca=18000, cl=15000, rev=210000, cos=84000, exp=96000, tr=26000, credit=70000,
    q11e='Analyse the limitations of ratio analysis to Lopez Garden Services in deciding whether it can afford to buy a second van and hire two more staff.',
    q11e_ctx='The owner expects revenue to rise by 30% next year with the extra capacity. Fuel and wages would rise, and new commercial customers usually pay after 60 days.',
    q11e_ms=['Past figures may not represent the effect of new staff, fuel costs and longer credit', 'Three years of data only; garden business is seasonal so year-end ratios may mislead', 'No information on non-financial factors (demand, weather, quality)', 'Ratios need comparison with competitors and industry averages', 'Does not show cash flow timing or break-even for the new van; forecasts needed', 'Focus on limitations'],
    q11f='Evaluate whether Lopez Garden Services should buy the van with hire purchase or lease it.',
    q11f_ctx='The van costs £24,000. Hire purchase requires a £4,000 deposit and 36 payments of £650. Leasing costs £480 a month for 36 months including maintenance, but the business will not own the van at the end. The business has £9,000 in the bank.',
    q11f_ms=['Hire purchase: owns the van at the end (asset on statement of financial position), deposit £4,000 of £9,000 cash; total cost £4,000 + 36 × £650 = £27,400; depreciation; maintenance extra', 'Leasing: no deposit, lower monthly cost (£17,280 over 36 months), maintenance included so costs predictable; never owns the van; may have mileage limits; lease continues as a fixed cost', 'Context: limited cash; seasonal revenue; expected growth of 30%; fixed costs raise break-even', 'Alternatives: buy outright with loan, buy second-hand', 'Justified recommendation referring to cash flow, ownership and risk'],
)

def papers():
    return [build_paper('U3-R1', '9901', 'Sunrise Sandwiches · Orchard Studio', PAPER1), build_paper('U3-R2', '9902', 'Street Eats · Lopez Garden Services', PAPER2)]

if __name__ == '__main__':
    for p in papers():
        print(p['id'], len(p['items']), sum(i['marks'] for i in p['items']))
