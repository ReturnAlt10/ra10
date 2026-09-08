# -*- coding: utf-8 -*-
"""BTEC Business Unit 3 (Personal and Business Finance) expansion — reach 300+."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, lvl_ms, levels3, levels4, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-3\data"
aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCDEF'}
NEW = []

def add(aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    NEW.append((aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

# ============ AIM A — Personal finance ============
add("A","A1 Life stages","Explain",4,"AO2","","Explain how financial needs change between childhood and later life.","(4)","short",
    short_ms("Award 1+1. Max 4.",["In childhood, financial needs are met by parents and focus on basic provision and saving habits (1); in later life, needs shift to funding retirement, healthcare and a reduced income (1)","Needs evolve from immediate consumption in youth (1) to long-term security and wealth protection in later life (1)"]))
add("A","A1 Factors affecting decisions","Explain",4,"AO2","","Explain how attitude to risk affects personal finance decisions.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Risk-averse individuals prefer safe products such as savings accounts and fixed-rate bonds (1) accepting lower returns for security (1)","Risk-tolerant individuals are willing to invest in shares or funds (1) for potentially higher, but uncertain, returns (1)"]))
add("A","A2 Financial products","Explain",4,"AO2","","Explain the difference between a current account and a savings account.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A current account is for day-to-day money management, allowing regular deposits, withdrawals and payments (1) often with little or no interest (1)","A savings account holds money to be saved and earns interest (1) but is not designed for frequent transactions (1)"]))
add("A","A2 Financial products","Explain",4,"AO2","","Explain what an ISA is and its main benefit.","(4)","short",
    short_ms("Award 1+1. Max 4.",["An ISA (Individual Savings Account) is a tax-efficient savings or investment account (1) allowing money to be saved within an annual limit (1)","Its main benefit is that interest and gains are tax-free (1) increasing the return to the saver (1)"]))
add("A","A2 Borrowing","Explain",4,"AO2","","Explain the difference between a personal loan and a credit card.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A personal loan is a fixed sum borrowed and repaid in regular instalments over a set term (1) at a fixed or variable interest rate (1)","A credit card provides a revolving line of credit up to a limit (1) which can be repaid in full or in part each month, with interest on outstanding balances (1)"]))
add("A","A2 Borrowing","Explain",4,"AO2","","Explain the risks of payday loans.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Payday loans have very high interest rates (1) so borrowing can become very expensive if not repaid quickly (1)","They can trap borrowers in a cycle of debt (1) as they take further loans to repay existing ones (1)"]))
add("A","A2 Insurance","Explain",4,"AO2","","Explain how insurance protects an individual from financial loss.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Insurance transfers risk from the individual to the insurer (1) in exchange for a premium (1)","If an insured event occurs, the insurer pays out (1) protecting the individual from a large unexpected loss (1)"]))
add("A","A3 Budgeting","Explain",4,"AO2","","Explain the difference between discretionary and non-discretionary spending.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Non-discretionary spending is essential and unavoidable (1) e.g. rent, food, utility bills (1)","Discretionary spending is non-essential and optional (1) e.g. entertainment, holidays, luxuries (1)"]))
add("A","A3 Budgeting","Explain",4,"AO2","","Explain what a budget deficit means and its consequences.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A budget deficit occurs when expenditure exceeds income (1) so the individual spends more than they earn (1)","It leads to debt or the need to use savings (1) and, if sustained, financial difficulty (1)"]))
add("A","A3 Budgeting","Explain",4,"AO2","","Explain the purpose of a personal budget.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A budget plans income against expenditure (1) to ensure spending is controlled and within means (1)","It helps individuals save, avoid debt and meet financial goals (1) by giving visibility and control over money (1)"]))
add("A","A2 Borrowing","Explain",4,"AO2","","Explain what an overdraft is and when it is used.","(4)","short",
    short_ms("Award 1+1. Max 4.",["An overdraft allows an account holder to spend more than is in their account (1) up to an agreed limit (1)","It is used for short-term cash flow needs (1) and interest is charged on the amount overdrawn (1)"]))
add("A","A1/A2/A3 Personal finance","Evaluate",12,"AO3","Sam, a 22-year-old graduate starting their first job, wants to buy a car, save for a house deposit and build an emergency fund on a starting salary.","Evaluate how Sam should manage their personal finances to achieve these goals. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Sam should create a budget to understand income and essential (non-discretionary) spending","Prioritise an emergency fund first to cover unexpected costs, using a savings account or ISA","Decide on the car purchase: avoid high-interest borrowing (payday loans); consider a personal loan or saving for it","Start saving for the house deposit regularly, potentially using a Lifetime ISA for the government bonus","Balance needs (car) vs wants; avoid excessive discretionary spending","Consider insurance (car) and plan for longer-term needs as life stage changes","Conclusion: budget first, build an emergency fund, then save systematically for the car and deposit while minimising expensive debt"],
    levels4("Describes personal finance products generically.","Identifies some relevant products with partial application to Sam.","Balanced evaluation linking products to Sam's goals.","Thorough evaluation with a prioritised, justified financial plan.")))

# ============ AIM B — Personal finance sector ============
add("B","B1 Financial institutions","Explain",4,"AO2","","Explain the role of a building society compared with a retail bank.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Building societies are mutual organisations owned by their members (1) focusing on savings accounts and mortgages (1)","Retail banks are typically shareholder-owned (1) offering a wider range of services including current accounts, loans and business banking (1)"]))
add("B","B1 Financial institutions","Explain",4,"AO2","","Explain the role of a credit union.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A credit union is a not-for-profit cooperative (1) that provides savings and affordable loans to its members (1)","Members usually share a common bond (e.g. workplace or community) (1) and benefit from lower loan rates than payday lenders (1)"]))
add("B","B1 Financial institutions","Explain",4,"AO2","","Explain the role of an insurance company.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Insurance companies provide protection against financial loss (1) by pooling premiums from many customers to pay claims (1)","They cover risks such as life, health, home, travel and motor (1) in exchange for regular premiums (1)"]))
add("B","B1 Financial institutions","Explain",4,"AO2","","Explain the role of an investment bank.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Investment banks provide services to companies and governments (1) such as raising capital, advising on mergers and trading securities (1)","They do not typically serve retail customers (1) focusing instead on corporate finance and markets (1)"]))
add("B","B1 Financial institutions","Explain",4,"AO2","","Explain why the Bank of England is not a typical financial institution for consumers.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The Bank of England is the UK's central bank (1) which sets interest rates and maintains financial stability (1)","It does not provide day-to-day accounts or loans to consumers (1) but supervises and supports the banking system (1)"]))
add("B","B2 Communication methods","Explain",4,"AO2","","Explain the advantages of internet banking.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Internet banking is available 24/7 from anywhere (1) and allows quick transactions and account management (1)","It is convenient and often free (1) reducing the need to visit a branch (1)"]))
add("B","B2 Communication methods","Explain",4,"AO2","","Explain the disadvantages of internet banking.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Internet banking requires internet access and digital skills (1) which some customers lack (1)","It carries security risks such as fraud and phishing (1) and can be difficult for complex enquiries (1)"]))
add("B","B2 Communication methods","Explain",4,"AO2","","Explain the advantages of branch banking.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Branches provide face-to-face advice and personal service (1) useful for complex products such as mortgages (1)","They support customers without digital access (1) and allow cash and document handling (1)"]))
add("B","B2 Communication methods","Explain",4,"AO2","","Explain the advantages of telephone banking.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Telephone banking allows customers to manage accounts without visiting a branch (1) at their convenience (1)","It provides human assistance for those uncomfortable with digital banking (1) and handles complex queries (1)"]))
add("B","B2 Communication methods","Explain",4,"AO2","","Explain how mobile banking apps have changed how customers bank.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Mobile apps allow banking anywhere via smartphone (1) with instant payments, transfers and notifications (1)","They have reduced reliance on branches (1) and increased convenience and real-time money management (1)"]))
add("B","B1/B2 Financial sector","Discuss",6,"AO3","An elderly customer without internet access needs to manage their savings and pay bills. Their local bank branch is closing.","Discuss how this customer can continue to access banking services. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["The customer can use telephone banking to manage accounts and pay bills without internet","They may use the Post Office to deposit and withdraw cash for many banks","Alternative providers such as building societies or credit unions may have local presence","A relative or carer could help with digital banking, though care with security is needed","Mobile banking vans or community banking hubs may be available","Conclusion: telephone and Post Office banking, possibly with family support, are the main options; the customer should contact their bank for accessible alternatives"],
    levels3("Identifies one or two alternatives.","Explains several alternatives with partial application.","Thoroughly evaluates accessible options; justified recommendation.")))

# ============ AIM C — Government and personal finance ============
add("C","C1 Taxation","Explain",4,"AO2","","Explain the difference between income tax and National Insurance.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Income tax is levied on an individual's earnings above the personal allowance (1) at progressive rates (1)","National Insurance contributions are paid by workers (and employers) to fund state benefits such as the State Pension (1) (1)"]))
add("C","C1 Taxation","Explain",4,"AO2","","Explain what VAT is and who pays it.","(4)","short",
    short_ms("Award 1+1. Max 4.",["VAT (Value Added Tax) is a tax on most goods and services (1) added to the selling price (1)","It is paid by consumers when they buy goods (1) and collected by businesses on behalf of the government (1)"]))
add("C","C1 Taxation","Explain",4,"AO2","","Explain what council tax is used for.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Council tax is a local tax on residential properties (1) paid by households (1)","It funds local services (1) such as waste collection, policing and local amenities (1)"]))
add("C","C1 Benefits","Explain",4,"AO2","","Explain the purpose of Universal Credit.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Universal Credit is a means-tested benefit (1) that supports people on low incomes or out of work (1)","It combines several benefits into one monthly payment (1) to help cover living costs (1)"]))
add("C","C1 Benefits","Explain",4,"AO2","","Explain the purpose of Child Benefit.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Child Benefit is a payment to people responsible for bringing up a child (1) to help with the costs of raising children (1)","It is paid regardless of income (though higher earners may pay a tax charge) (1) (1)"]))
add("C","C1 Benefits","Explain",4,"AO2","","Explain what the State Pension is.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The State Pension is a regular payment from the government (1) to people who have reached State Pension age (1)","It is funded by National Insurance contributions (1) and provides income in retirement (1)"]))
add("C","C2 Consumer protection","Explain",4,"AO2","","Explain the role of the Financial Conduct Authority (FCA).","(4)","short",
    short_ms("Award 1+1. Max 4.",["The FCA regulates financial firms and markets (1) to protect consumers and ensure market integrity (1)","It sets rules, supervises firms and can take action against misconduct (1) promoting fair competition (1)"]))
add("C","C2 Consumer protection","Explain",4,"AO2","","Explain the role of the Financial Ombudsman Service (FOS).","(4)","short",
    short_ms("Award 1+1. Max 4.",["The FOS resolves complaints between consumers and financial firms (1) when they cannot be settled directly (1)","It is a free, independent service (1) whose decisions can require firms to compensate consumers (1)"]))
add("C","C2 Consumer protection","Explain",4,"AO2","","Explain the role of the Financial Services Compensation Scheme (FSCS).","(4)","short",
    short_ms("Award 1+1. Max 4.",["The FSCS protects consumers' money if an authorised financial firm fails (1) paying compensation up to set limits (1)","It covers deposits (up to £85,000 per person per institution) and some investments and insurance (1) (1)"]))
add("C","C2 Consumer protection","Explain",4,"AO2","","Explain the difference between the FCA and the FOS.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The FCA regulates firms and sets rules (1) to prevent problems and ensure firms behave properly (1)","The FOS resolves individual complaints (1) after a consumer has been unable to settle a dispute with a firm (1)"]))
add("C","C1/C2 Government and protection","Discuss",6,"AO3","A consumer lost money when a financial firm went into administration, and also has a dispute with a bank over charges.","Discuss how the consumer can seek protection and redress. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["For the failed firm, the FSCS may compensate the consumer up to £85,000 for deposits","For the dispute with the bank, the consumer should first complain directly to the bank","If unresolved, the complaint can be escalated to the Financial Ombudsman Service (FOS)","The FCA regulates the firms but does not handle individual complaints directly","The consumer should keep records and act within time limits","Conclusion: the FSCS protects against firm failure; the FOS resolves unresolved complaints — the consumer should use both as appropriate"],
    levels3("Identifies one or two bodies.","Explains the role of FSCS/FOS with partial application.","Thoroughly evaluates the protection route; justified conclusion.")))

# ============ AIM D — Business finance sources ============
add("D","D1 Internal sources","Explain",4,"AO2","","Explain the advantages of using retained profit as a source of finance.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Retained profit has no interest cost (1) and no loss of ownership (1)","It is immediately available (1) and avoids the risk of debt (1)"]))
add("D","D1 Internal sources","Explain",4,"AO2","","Explain the disadvantages of using retained profit.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Retained profit may be limited in amount (1) and using it reduces funds available for dividends or other purposes (1)","Relying on it may slow growth (1) if the business cannot retain enough profit (1)"]))
add("D","D1 Internal sources","Explain",4,"AO2","","Explain what is meant by sale of assets as a source of finance.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The business sells assets it no longer needs (1) to raise cash (1)","This is suitable for one-off needs (1) but the asset is lost and it is not repeatable (1)"]))
add("D","D1 Internal sources","Explain",4,"AO2","","Explain what is meant by working capital management.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Working capital is current assets minus current liabilities (1); managing it means controlling stock, debtors and creditors (1)","Improving working capital (e.g. collecting debts faster, holding less stock) frees up cash (1) for the business to use (1)"]))
add("D","D2 External sources","Explain",4,"AO2","","Explain the difference between an overdraft and a bank loan.","(4)","short",
    short_ms("Award 1+1. Max 4.",["An overdraft is a short-term, flexible facility allowing the account to go negative (1) repaid on demand and used for cash flow (1)","A bank loan is a fixed sum borrowed for a set term (1) repaid in regular instalments, used for longer-term needs (1)"]))
add("D","D2 External sources","Explain",4,"AO2","","Explain what trade credit is and its benefit.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Trade credit is when a supplier allows the business to buy now and pay later (1) e.g. within 30-60 days (1)","It is an interest-free source of short-term finance (1) improving cash flow (1)"]))
add("D","D2 External sources","Explain",4,"AO2","","Explain what factoring is.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Factoring is selling the business's invoices (receivables) to a specialist firm (1) for immediate cash (1)","The factor collects the debts (1) in exchange for a fee, improving the business's cash flow (1)"]))
add("D","D2 External sources","Explain",4,"AO2","","Explain what venture capital is and its characteristics.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Venture capital is funding from investors in exchange for an equity stake (1) usually in high-growth businesses (1)","It provides large sums and expertise (1) but the investors expect high returns and some control (1)"]))
add("D","D2 External sources","Explain",4,"AO2","","Explain what leasing is and its benefit.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Leasing is renting an asset (e.g. equipment) rather than buying it (1) paying regular instalments (1)","It avoids a large upfront cost (1) and spreads the cost of the asset over its use (1)"]))
add("D","D2 External sources","Explain",4,"AO2","","Explain what crowdfunding is.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Crowdfunding raises small amounts from many people (1) usually via an online platform (1)","It can be reward-based, donation-based or equity-based (1) and is useful for start-ups (1)"]))
add("D","D3 Suitability","Explain",4,"AO2","","Explain how a business matches a source of finance to its purpose.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Short-term needs (cash flow) suit short-term finance such as overdrafts and trade credit (1) (1)","Long-term needs (assets, expansion) suit long-term finance such as loans, share capital or retained profit (1) (1)"]))
add("D","D1/D2/D3 Sources of finance","Evaluate",12,"AO3","GrowthCo Ltd, an established manufacturer, needs to fund a new £500,000 factory expansion and also faces seasonal cash flow shortages.","Evaluate the most suitable sources of finance for GrowthCo Ltd's needs. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Factory expansion is a long-term investment, so long-term finance is appropriate: bank loan, share issue, debentures, or retained profit","Retained profit avoids interest and ownership dilution but may be insufficient for £500,000","A bank loan provides the full sum with fixed repayments but adds interest cost and risk","Issuing shares raises capital without debt but dilutes existing owners' control","Seasonal cash flow shortages need short-term finance such as an overdraft or trade credit","Using the right source for each need minimises cost and risk","Conclusion: fund the factory with long-term finance (loan/retained profit), and use an overdraft for seasonal cash flow"],
    levels4("Describes sources of finance generically.","Identifies some suitable sources with partial application.","Balanced evaluation matching sources to each need.","Thorough evaluation with justified, cost-effective financing recommendations.")))

# ============ AIM E — Financial planning ============
add("E","E1 Break-even","Explain",4,"AO2","","Explain the difference between fixed and variable costs.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Fixed costs do not change with output (1) e.g. rent, salaries (1)","Variable costs change in direct proportion to output (1) e.g. raw materials (1)"]))
add("E","E1 Break-even","Explain",4,"AO2","","Explain what contribution per unit represents.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Contribution per unit is selling price minus variable cost (1) — the amount each unit contributes to fixed costs and profit (1)","Once fixed costs are covered, remaining contribution becomes profit (1) (1)"]))
add("E","E1 Break-even","Explain",4,"AO2","","Explain how a rise in variable costs affects the break-even point.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Higher variable costs reduce contribution per unit (1) so each unit covers less of the fixed costs (1)","This raises the break-even output (1) as more units are needed to cover fixed costs (1)"]))
add("E","E2 Cash flow","Explain",4,"AO2","","Explain the difference between a cash inflow and a cash outflow.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Cash inflows are money coming into the business (1) e.g. sales revenue, loans (1)","Cash outflows are money leaving the business (1) e.g. purchases, wages, rent (1)"]))
add("E","E2 Cash flow","Explain",4,"AO2","","Explain the purpose of a cash flow forecast.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A cash flow forecast predicts future cash inflows and outflows (1) to identify periods of surplus or shortage (1)","It helps the business plan for shortfalls (1) e.g. arranging finance before cash runs out (1)"]))
add("E","E2 Cash flow","Explain",4,"AO2","","Explain two limitations of cash flow forecasts.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Forecasts are based on estimates which may be inaccurate (1) so actual cash flows may differ (1)","They do not account for unexpected events (1) such as sudden costs or lost sales (1)"]))
add("E","E3 Budgets","Explain",4,"AO2","","Explain the difference between a favourable and an adverse variance.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A favourable variance is when actual performance is better than budget (1) e.g. lower costs or higher revenue (1)","An adverse variance is when actual is worse than budget (1) e.g. higher costs or lower revenue (1)"]))
add("E","E3 Budgets","Explain",4,"AO2","","Explain how budgets are used to control business performance.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Budgets set targets for income and spending (1) against which actual performance is measured (1)","Variances are investigated and corrective action taken (1) keeping the business on track (1)"]))
add("E","E1 Break-even","Explain",4,"AO2","","Explain what the margin of safety indicates.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The margin of safety is the amount by which actual/forecast sales exceed break-even (1) (1)","A larger margin of safety means lower risk (1) as sales can fall further before losses occur (1)"]))
add("E","E1 Break-even","Calculate",4,"AO2","","A firm has fixed costs of £48,000, a selling price of £20 per unit and variable costs of £8 per unit. Calculate the break-even output. (4)","(4)","calculation",
    short_ms("Award 1 mark per step. Max 4.",["Contribution per unit = £20 − £8 = £12 (1)","Break-even = Fixed costs ÷ Contribution (1)","= £48,000 ÷ £12 (1)","= 4,000 units (1)"]))
add("E","E2 Cash flow","Calculate",4,"AO2","","A business has opening balance £2,000, inflows £15,000 and outflows £13,500. Calculate the net cash flow and closing balance. (4)","(4)","calculation",
    short_ms("Award 1 mark per step. Max 4.",["Net cash flow = £15,000 − £13,500 = £1,500 (1+1)","Closing balance = £2,000 + £1,500 (1)","= £3,500 (1)"]))
add("E","E1/E2/E3 Financial planning","Discuss",6,"AO3","A start-up is forecasting negative cash flow in its first three months due to high set-up costs.","Discuss how the start-up can plan for and manage this negative cash flow. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Use a cash flow forecast to identify the negative periods in advance","Arrange finance before needed — an overdraft or start-up loan","Reduce or delay non-essential outflows during the negative months","Negotiate trade credit or spread large one-off costs","Accelerate inflows where possible (deposits, prompt payment)","Conclusion: forecasting early and arranging appropriate finance, while controlling costs, will help the start-up survive the negative cash flow period"],
    levels3("Describes the problem in basic terms.","Identifies some solutions with partial application.","Thoroughly evaluates planning and financing options; justified conclusion.")))

# ============ AIM F — Financial statements ============
add("F","F1 Income statement","Explain",4,"AO2","","Explain the difference between gross profit and net profit.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Gross profit is revenue minus cost of sales (1) — the profit before other expenses (1)","Net profit is gross profit minus all other expenses (1) — the final profit for the period (1)"]))
add("F","F1 Income statement","Explain",4,"AO2","","Explain what 'cost of sales' means.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Cost of sales is the direct cost of producing the goods sold (1) including materials and direct labour (1)","It is deducted from revenue to calculate gross profit (1) (1)"]))
add("F","F2 SFP","Explain",4,"AO2","","Explain the difference between non-current and current assets.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Non-current assets are held for the long term (1) e.g. buildings, machinery (1)","Current assets are expected to be converted to cash within one year (1) e.g. inventory, receivables, cash (1)"]))
add("F","F2 SFP","Explain",4,"AO2","","Explain what current liabilities are.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Current liabilities are debts due within one year (1) e.g. trade payables, overdrafts (1)","They must be met from current assets or cash flow (1) (1)"]))
add("F","F2 SFP","Explain",4,"AO2","","Explain what equity represents in a statement of financial position.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Equity represents the owners' stake in the business (1) e.g. share capital and retained earnings (1)","It equals total assets minus total liabilities (1) — the net worth of the business (1)"]))
add("F","F3 Depreciation","Explain",4,"AO2","","Explain why depreciation is charged.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Depreciation spreads the cost of a non-current asset over its useful life (1) matching cost to the revenue it generates (1)","It reflects the fall in value/wear and tear of the asset (1) and is charged as an expense (1)"]))
add("F","F4 Ratio analysis","Explain",4,"AO2","","Explain what a high gross profit margin indicates about a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A high gross profit margin means the business keeps a large proportion of revenue after cost of sales (1) (1)","It suggests the business has pricing power or low production costs (1) giving more to cover expenses and generate profit (1)"]))
add("F","F4 Ratio analysis","Explain",4,"AO2","","Explain what the current ratio measures and why it matters.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The current ratio compares current assets to current liabilities (1) measuring short-term liquidity (1)","It matters because it shows whether the business can pay its short-term debts (1); a ratio below 1 indicates risk (1)"]))
add("F","F4 Ratio analysis","Explain",4,"AO2","","Explain why the acid test ratio is stricter than the current ratio.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The acid test excludes inventory (1) which may be hard to sell quickly (1)","It is a stricter measure of liquidity (1) as it considers only the most liquid current assets (1)"]))
add("F","F4 Ratio analysis","Explain",4,"AO2","","Explain what ROCE measures and its importance.","(4)","short",
    short_ms("Award 1+1. Max 4.",["ROCE measures the return generated on the capital invested in the business (1) as a percentage (1)","It shows how efficiently the business uses its capital (1) and is used to compare performance and assess profitability (1)"]))
add("F","F3 Depreciation","Calculate",4,"AO2","","An asset costs £30,000, has a residual value of £3,000 and a useful life of 9 years. Calculate the annual straight-line depreciation. (4)","(4)","calculation",
    short_ms("Award 1 mark per step. Max 4.",["Depreciable amount = £30,000 − £3,000 = £27,000 (1)","Annual depreciation = £27,000 ÷ 9 (1)","= £3,000 (1)","per year (1)"]))
add("F","F4 Ratio analysis","Calculate",4,"AO2","","A business has revenue £200,000, gross profit £80,000 and net profit £20,000. Calculate the gross profit margin and net profit margin. (4)","(4)","calculation",
    short_ms("Award 1 mark per step. Max 4.",["GPM = (£80,000 ÷ £200,000) × 100 (1)","= 40% (1)","NPM = (£20,000 ÷ £200,000) × 100 (1)","= 10% (1)"]))
add("F","F1-F4 Financial statements","Evaluate",12,"AO3","A business's financial statements show rising revenue but a falling net profit margin and a current ratio of 0.9:1.","Evaluate the financial health of this business. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Rising revenue is positive, indicating growing sales and demand","A falling net profit margin suggests costs are rising faster than revenue, squeezing profitability","Investigate why costs are rising (materials, wages, overheads) and whether prices can be raised","A current ratio of 0.9:1 means current liabilities exceed current assets — a liquidity concern","The business may struggle to pay short-term debts, risking insolvency","Actions: control costs, improve working capital (chase debtors, reduce inventory), or arrange finance","Conclusion: despite growth, falling margins and weak liquidity mean the business is financially strained and must improve cost control and cash management"],
    levels4("Describes the financial indicators in basic terms.","Identifies some concerns with partial analysis.","Balanced evaluation of profitability and liquidity.","Thorough evaluation linking the indicators to overall financial health with justified recommendations.")))

for (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms) in NEW:
    nid = next_id(aims[aim], aim)
    aims[aim].append(q(nid, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

write_aims(BASE, aims)
print("U3 aim counts:", {k: len(v) for k, v in aims.items()})
print("U3 total:", sum(len(v) for v in aims.values()))
