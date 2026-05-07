/* Business Unit 3 — Comprehensive Revision Guide
   Initialised by calling window.initComprehensiveGuide()  */
(function () {
  'use strict';

  const STORE_KEY = 'ra10-guide-revised-BUS-u3';
  const AIMS = ['A','B','C','D','E','F'];
  const AIM_TITLES = {
    A: 'Personal Finance',
    B: 'Personal Finance Sector',
    C: 'Government and Personal Finance',
    D: 'Sources of Business Finance',
    E: 'Financial Planning',
    F: 'Financial Statements'
  };
  const AIM_SUBTITLES = {
    A: 'Life stages, methods of payment, borrowing, saving, insurance and budgeting',
    B: 'Financial institutions, banking methods, roles and comparison',
    C: 'Taxation, state benefits, FCA, FOS, FSCS consumer protection',
    D: 'Internal sources, short/long-term external sources, suitability',
    E: 'Break-even analysis, cash flow forecasts, variance analysis, budgets',
    F: 'Income statements, SFP, depreciation, profitability and liquidity ratios'
  };

  function getRevised() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch { return []; }
  }
  function saveRevised(arr) { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); }

  function buildSidebar() {
    const items = [
      { aim:'A', topics:[['A1','Life stages & functions of money'],['A2','Methods of payment'],['A3','Borrowing types'],['A4','Savings & investments'],['A5','Insurance products']] },
      { aim:'B', topics:[['B1','Financial institutions'],['B2','Banking methods']] },
      { aim:'C', topics:[['C1','Taxation & state benefits'],['C2','FCA, FOS, FSCS']] },
      { aim:'D', topics:[['D1','Internal sources'],['D2','External sources'],['D3','Choosing finance']] },
      { aim:'E', topics:[['E1','Break-even analysis'],['E2','Cash flow forecasts'],['E3','Budgets & variance']] },
      { aim:'F', topics:[['F1','Income statement'],['F2','Statement of financial position'],['F3','Ratio analysis']] }
    ];
    return `
<button class="guide-sb-toggle" onclick="this.closest('.guide-sidebar').classList.toggle('sb-open')">
  <span>&#9776; Contents</span><span>&#8595;</span>
</button>
<div class="guide-sidebar-hd">
  <span class="guide-toc-label">Unit 3 Guide</span>
</div>
<div class="guide-toc-scroll">
  ${items.map(g=>`
  <div class="guide-toc-aim-group">
    <button class="guide-toc-aim-link" onclick="guideScrollTo('guide-aim-${g.aim}')">
      <span class="guide-toc-badge">${g.aim}</span>${AIM_TITLES[g.aim].split(' ').slice(0,3).join(' ')}…
    </button>
    <div class="guide-toc-topic-links">
      ${g.topics.map(([code,name])=>`<button class="guide-toc-topic-link" onclick="guideScrollTo('gt-${code}')">${code} ${name}</button>`).join('')}
    </div>
  </div>`).join('')}
</div>`;
  }

  function topic(code, name, bodyHtml, open) {
    return `
<div class="guide-topic${open?' open':''}" id="gt-${code}">
  <div class="guide-topic-hd" onclick="toggleGT('gt-${code}')">
    <span class="guide-topic-code">${code}</span>
    <span class="guide-topic-name">${name}</span>
    <span class="guide-topic-chevron">&#9660;</span>
  </div>
  <div class="guide-topic-body">${bodyHtml}</div>
</div>`;
  }

  function aimSection(letter, topicsHtml) {
    return `
<div class="guide-aim-section" id="guide-aim-${letter}">
  <div class="guide-aim-hd">
    <div class="guide-aim-badge">${letter}</div>
    <div>
      <div class="guide-aim-title">Aim ${letter}: ${AIM_TITLES[letter]}</div>
      <div class="guide-aim-subtitle">${AIM_SUBTITLES[letter]}</div>
    </div>
  </div>
  ${topicsHtml}
  <button class="guide-mark-btn" id="gmb-${letter}" onclick="toggleGuideRevised('${letter}')">
    <span class="guide-mark-icon">&#9711;</span> Mark Aim ${letter} as revised
  </button>
</div>`;
  }

  const GUIDE_GALLERY = [
    {
      aim: 'A',
      kicker: 'Personal finance',
      title: 'Money decisions in everyday life',
      copy: 'Accounts, borrowing and budgeting linked to realistic financial choices.',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80'
    },
    {
      aim: 'D',
      kicker: 'Business finance',
      title: 'Funding growth and managing cash',
      copy: 'Sources of finance, planning and financial control with a more visual entry point.',
      image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80'
    },
    {
      aim: 'F',
      kicker: 'Statements',
      title: 'Reports that show business performance',
      copy: 'Income statements, financial position and ratio analysis at a glance.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  function buildGuideGallery() {
    return `
<section class="guide-gallery" aria-label="Unit 3 visual overview">
  ${GUIDE_GALLERY.map(card => `
  <button
    class="guide-gallery-card"
    type="button"
    onclick="guideScrollTo('guide-aim-${card.aim}')"
    style="--guide-card-image:url('${card.image}')"
  >
    <span class="guide-gallery-kicker">${card.kicker}</span>
    <span class="guide-gallery-title">${card.title}</span>
    <span class="guide-gallery-copy">${card.copy}</span>
    <span class="guide-gallery-source">Royalty-free stock photo</span>
  </button>`).join('')}
</section>`;
  }

  /* ============================================================  AIM A — Personal Finance  ============================================================ */
  const aimA = aimSection('A', [
    topic('A1','Life stages, functions of money and current accounts', `
<p>Money performs four key functions in an economy. Personal finance decisions change at each life stage.</p>

<p><strong>Four functions of money:</strong></p>
<ul>
<li><strong>Medium of exchange:</strong> allows buying and selling without barter</li>
<li><strong>Store of value:</strong> holds purchasing power over time for saving</li>
<li><strong>Unit of account:</strong> provides a standard measure for pricing goods and services</li>
<li><strong>Standard of deferred payment:</strong> enables borrowing — repay a debt at a future date</li>
</ul>

<table class="g-table"><thead><tr><th>Life stage</th><th>Financial needs</th><th>Key priorities</th></tr></thead><tbody>
<tr><td>Childhood (0–16)</td><td>Savings accounts, child benefit, school costs</td><td>Parents manage; building savings habit</td></tr>
<tr><td>Young adult (16–25)</td><td>First current account, student loan, mobile contract</td><td>Building credit history; student budgeting</td></tr>
<tr><td>Family stage (25–55)</td><td>Mortgage, life insurance, pension contributions, childcare costs</td><td>Balancing mortgage debt with savings</td></tr>
<tr><td>Later life (55+)</td><td>Pension drawdown, ISAs, care costs, inheritance planning</td><td>Preserving wealth; generating retirement income</td></tr>
</tbody></table>

<p><strong>Factors affecting personal finance decisions:</strong> income level, employment status (employed/self-employed/unemployed), age, number of dependants, attitude to risk (risk-averse vs risk-tolerant).</p>

<p><strong>Types of current account:</strong></p>
<table class="g-table"><thead><tr><th>Account type</th><th>Key features</th><th>Suitable for</th></tr></thead><tbody>
<tr><td>Basic current account</td><td>No overdraft facility; debit card; direct debits</td><td>People with poor credit history</td></tr>
<tr><td>Standard current account</td><td>Debit card, direct debits, some overdraft; low or no fees</td><td>Most adults; everyday banking</td></tr>
<tr><td>Packaged account</td><td>Monthly fee (£10–30) but includes insurance, breakdown cover, travel insurance</td><td>Those who use the included benefits</td></tr>
<tr><td>Student account</td><td>Interest-free overdraft (often £1,000–3,000); student-focused perks</td><td>University students</td></tr>
<tr><td>Graduate account</td><td>Tapering interest-free overdraft over 3 years after graduation</td><td>Recent graduates managing transition</td></tr>
</tbody></table>`,true),

    topic('A2','Methods of payment', `
<table class="g-table"><thead><tr><th>Method</th><th>How it works</th><th>Advantages</th><th>Disadvantages</th></tr></thead><tbody>
<tr><td><strong>Debit card</strong></td><td>Payment deducted from current account immediately</td><td>Widely accepted; convenient; no interest</td><td>Can overspend if low balance; fraud risk</td></tr>
<tr><td><strong>Credit card</strong></td><td>Borrow now; pay at end of statement period</td><td>Section 75 consumer protection; builds credit rating; purchase protection</td><td>High interest (20–30% APR) if not cleared monthly</td></tr>
<tr><td><strong>Contactless</strong></td><td>Tap debit/credit card or phone (NFC technology)</td><td>Very fast; no PIN needed (under £100)</td><td>Limited to £100 per transaction; fraud if card lost</td></tr>
<tr><td><strong>Standing order</strong></td><td>Fixed amount transferred automatically on a set date — YOU set it up</td><td>Automatic; consistent; you stay in control of amount</td><td>Must be changed manually if amount varies</td></tr>
<tr><td><strong>Direct debit</strong></td><td>Variable or fixed amount requested by the payee on agreed dates — PAYEE requests</td><td>Automatic; can handle variable amounts (e.g. utility bills); Direct Debit Guarantee if wrongly charged</td><td>Less control — payee can change amount with notice</td></tr>
<tr><td><strong>BACS</strong></td><td>Electronic bank-to-bank transfer; takes 3 working days</td><td>Free; widely used for payroll</td><td>Slow (3 days); no immediate confirmation</td></tr>
<tr><td><strong>CHAPS</strong></td><td>Same-day guaranteed bank transfer for large amounts</td><td>Immediate; secure for large payments (e.g. house purchase)</td><td>Usually charged (£20–35); for large amounts only</td></tr>
<tr><td><strong>Cheque</strong></td><td>Written payment instruction sent to bank for processing</td><td>Safe for postal payments; paper trail</td><td>Takes 2–3 days to clear; fewer places accept them</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip — Standing order vs Direct debit</div>
This is a very common question. Key distinction: <strong>Standing order = you set a fixed amount</strong> (e.g. paying a friend back £50/month). <strong>Direct debit = payee requests the payment</strong> and the amount can vary (e.g. electricity bill, gym membership). Both are automated.</div>`,true),

    topic('A3','Borrowing types — advantages and disadvantages', `
<table class="g-table"><thead><tr><th>Borrowing type</th><th>Typical APR</th><th>Secured?</th><th>Advantages</th><th>Disadvantages</th><th>Best for</th></tr></thead><tbody>
<tr><td><strong>Bank overdraft</strong></td><td>15–40% EAR</td><td>No</td><td>Flexible; only pay interest on amount used; instant access</td><td>High interest rate; repayable on demand; easy to rely on</td><td>Short-term cash flow gap</td></tr>
<tr><td><strong>Personal loan</strong></td><td>5–25% APR</td><td>Usually no</td><td>Fixed monthly payments; predictable; can be used for anything</td><td>Repayments continue even if income falls; interest cost</td><td>Planned medium-term purchases (car, holiday)</td></tr>
<tr><td><strong>Hire purchase</strong></td><td>10–20% APR</td><td>Yes (item)</td><td>Spread cost of asset; you get use of item immediately</td><td>You don't own item until last payment; more expensive overall</td><td>Buying a car or appliance</td></tr>
<tr><td><strong>Mortgage</strong></td><td>2–6% APR</td><td>Yes (property)</td><td>Enables property ownership; low interest rate</td><td>Property repossessed if payments missed; 25–35 year commitment</td><td>Buying a home</td></tr>
<tr><td><strong>Credit card</strong></td><td>20–30% APR</td><td>No</td><td>Section 75 protection; flexible repayment; rewards/cashback</td><td>Very expensive if only minimum payment made; debt can spiral</td><td>Everyday spending; emergencies; online purchases</td></tr>
<tr><td><strong>Payday loan</strong></td><td>1000%+ APR</td><td>No</td><td>Fast approval; no credit check needed</td><td>Extremely high cost; debt trap; short-term only</td><td>Emergency only — generally inadvisable</td></tr>
</tbody></table>

<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">APR (Annual Percentage Rate)</span> — the total annual cost of borrowing expressed as a percentage, including fees and charges. Enables comparison between different borrowing products.</div>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
When asked to recommend a borrowing method, always match to the purpose and financial situation. A homeowner buying a car might use hire purchase (affordable monthly payments). A student facing an unexpected bill might use a planned overdraft rather than a payday loan (much lower interest rate).</div>`,true),

    topic('A4','Savings and investments', `
<table class="g-table"><thead><tr><th>Product</th><th>Return</th><th>Risk level</th><th>FSCS protected?</th><th>Key features</th></tr></thead><tbody>
<tr><td>Instant access savings account</td><td>Low (1–5% AER)</td><td>Very low</td><td>Yes (up to £85,000)</td><td>Withdraw any time; useful for emergency fund</td></tr>
<tr><td>Fixed-rate savings bond</td><td>Medium (higher than instant)</td><td>Low</td><td>Yes</td><td>Lock money away for fixed term (1–5 years) for better rate</td></tr>
<tr><td>Cash ISA</td><td>Low–medium; tax-free interest</td><td>Very low</td><td>Yes</td><td>Up to £20,000 per year tax-free; interest not subject to income tax</td></tr>
<tr><td>Stocks and Shares ISA</td><td>Potentially high; tax-free growth</td><td>High (value can fall)</td><td>No (investment risk)</td><td>Invests in equities; long-term growth; tax-free gains and dividends</td></tr>
<tr><td>Premium Bonds</td><td>Prize draws (effective ~4.4%); tax-free</td><td>No risk (government backed)</td><td>N/A — government guaranteed</td><td>No guaranteed return; capital always safe; max £50,000 holding</td></tr>
<tr><td>Shares</td><td>Dividends + capital growth (variable)</td><td>High</td><td>No</td><td>Part-ownership of company; value can rise or fall significantly</td></tr>
<tr><td>Pension (workplace/personal)</td><td>Long-term growth; tax relief</td><td>Medium–high</td><td>Partial (PPF for DB schemes)</td><td>Employer contributions; tax relief at marginal rate; locked until 57+</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
Risk vs return trade-off: generally, higher potential return = higher risk. Savings accounts are safe but low return. Shares offer growth but capital is at risk. Premium Bonds are unique — capital is fully safe but return is not guaranteed. Know this trade-off for evaluation questions.</div>`,false),

    topic('A5','Insurance products', `
<table class="g-table"><thead><tr><th>Insurance type</th><th>What it covers</th><th>Legal requirement?</th><th>Key features to know</th></tr></thead><tbody>
<tr><td>Car insurance</td><td>Third party (legal minimum), third party fire &amp; theft, or comprehensive</td><td>Yes — minimum third party required to drive on UK roads</td><td>No-claims discount; excess; telematics (black box) for young drivers</td></tr>
<tr><td>Home buildings insurance</td><td>Damage to the structure of a property</td><td>Usually required by mortgage lender</td><td>Covers flood, fire, subsidence; rebuilding cost not market value</td></tr>
<tr><td>Home contents insurance</td><td>Personal belongings inside the home</td><td>No</td><td>Covers theft, damage; check if items covered outside home</td></tr>
<tr><td>Life insurance</td><td>Pays lump sum on policyholder's death</td><td>No (but recommended with mortgage)</td><td>Term life (fixed period) vs whole of life; joint policies for couples</td></tr>
<tr><td>Travel insurance</td><td>Medical costs abroad, cancellation, lost luggage, flight delay</td><td>No (but strongly advised)</td><td>Check pre-existing medical conditions; single trip vs annual</td></tr>
<tr><td>Pet insurance</td><td>Vet fees, accidents, illness, dental care</td><td>No</td><td>Exclusions for pre-existing conditions; lifetime vs annual policies</td></tr>
<tr><td>Health insurance</td><td>Private medical treatment, reducing waiting times</td><td>No</td><td>Avoids NHS waiting lists; high premiums; may exclude dental/optical</td></tr>
<tr><td>Income protection</td><td>Replaces income (usually 60–70%) if unable to work due to illness</td><td>No (but vital for self-employed)</td><td>Deferred period before payments start; runs to retirement age</td></tr>
</tbody></table>

<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Premium</span> — the regular payment made to an insurance company to maintain coverage.<br><br>
<span class="def-term">Excess</span> — the amount you agree to pay towards each claim before the insurer pays the rest. Higher excess = lower premium.</div>`,false)
  ]);

  /* ============================================================  AIM B — Personal Finance Sector  ============================================================ */
  const aimB = aimSection('B', [
    topic('B1','Financial institutions — types and functions', `
<table class="g-table"><thead><tr><th>Institution</th><th>Main function</th><th>Ownership</th><th>Examples</th></tr></thead><tbody>
<tr><td><strong>Bank of England</strong></td><td>Central bank; sets base interest rate; controls money supply; lender of last resort to other banks; issues banknotes</td><td>Government-owned</td><td>Bank of England</td></tr>
<tr><td><strong>Retail / High Street Banks</strong></td><td>Current/savings accounts; loans; mortgages; overdrafts for individuals and businesses</td><td>Shareholder-owned (plc)</td><td>Barclays, HSBC, Lloyds, NatWest</td></tr>
<tr><td><strong>Building Societies</strong></td><td>Similar to banks; traditionally focused on mortgages and savings; members share profits</td><td>Mutually owned by members</td><td>Nationwide, Yorkshire BS, Coventry BS</td></tr>
<tr><td><strong>Credit Unions</strong></td><td>Member-owned cooperatives; offer savings and loans at low interest; profits returned to members</td><td>Mutually owned by members</td><td>London Mutual Credit Union</td></tr>
<tr><td><strong>National Savings &amp; Investments (NS&amp;I)</strong></td><td>Government-backed savings products; raises money for government; includes Premium Bonds</td><td>Government-owned</td><td>NS&amp;I (nsandi.com)</td></tr>
<tr><td><strong>Insurance Companies</strong></td><td>Provide insurance products; invest premiums; pay claims</td><td>Shareholder-owned or mutual</td><td>Aviva, Legal &amp; General, Direct Line</td></tr>
<tr><td><strong>Pension Companies</strong></td><td>Manage workplace and personal pension funds; invest contributions for long-term growth</td><td>Various</td><td>Aviva, Scottish Widows, Nest</td></tr>
<tr><td><strong>Investment Banks</strong></td><td>Corporate finance; mergers &amp; acquisitions; securities trading; no retail customers</td><td>Shareholder-owned</td><td>Goldman Sachs, JP Morgan, Morgan Stanley</td></tr>
<tr><td><strong>Payday Lenders</strong></td><td>Short-term, very high-interest emergency loans</td><td>Various (private)</td><td>Wonga (closed), QuickQuid (closed)</td></tr>
<tr><td><strong>Pawnbrokers</strong></td><td>Loans secured against valuable items; item sold if loan not repaid</td><td>Various</td><td>Cash Converters, H&amp;T Pawnbrokers</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
Know the key difference between retail banks and building societies: banks are owned by shareholders (profits paid as dividends), while building societies are owned by their members (depositors/borrowers) who share in any profits. This affects how they operate and who they prioritise.</div>`,true),

    topic('B2','Banking methods — branch, online, mobile, telephone, postal', `
<table class="g-table"><thead><tr><th>Method</th><th>Advantages</th><th>Disadvantages</th><th>Best for</th></tr></thead><tbody>
<tr><td><strong>Branch banking</strong></td><td>Face-to-face advice; can handle complex queries; physical documents</td><td>Limited opening hours; requires travel; branch closures reducing access</td><td>Mortgages, complex advice, older customers</td></tr>
<tr><td><strong>Telephone banking</strong></td><td>Easy access; no travel; can be used 24/7 (automated) or in hours (staff)</td><td>Cannot share documents; limited to verbal transactions; waiting times</td><td>Balance enquiries, simple transactions, those without internet</td></tr>
<tr><td><strong>Online banking (website)</strong></td><td>24/7 full range of services; statements; payments; account management</td><td>Cybersecurity risks; requires reliable internet; digital literacy needed</td><td>Regular payments, transfers, monitoring spending</td></tr>
<tr><td><strong>Mobile app banking</strong></td><td>Instant notifications; biometric login; account freezing; contactless payments</td><td>Battery dependent; small screen; requires smartphone and data</td><td>Everyday monitoring, instant transfers, freezing lost cards</td></tr>
<tr><td><strong>Postal banking</strong></td><td>Written instructions; no technology needed; works for rural/elderly customers</td><td>Very slow; not suitable for urgent transactions</td><td>Customers without internet access; cheque deposits</td></tr>
</tbody></table>`,true)
  ]);

  /* ============================================================  AIM C — Government and Personal Finance  ============================================================ */
  const aimC = aimSection('C', [
    topic('C1','Taxation and state benefits', `
<p><strong>Key taxes:</strong></p>
<table class="g-table"><thead><tr><th>Tax</th><th>What it applies to</th><th>Rates (2024–25)</th></tr></thead><tbody>
<tr><td>Income Tax</td><td>Employment and self-employment earnings above personal allowance</td><td>0% (£0–12,570 personal allowance); 20% basic rate; 40% higher rate; 45% additional rate</td></tr>
<tr><td>National Insurance (NI)</td><td>Earnings (funds NHS, state pension, benefits)</td><td>8% on earnings £12,570–50,270 (employee); employers also contribute</td></tr>
<tr><td>VAT (Value Added Tax)</td><td>Sales of goods and services</td><td>20% standard; 5% reduced (energy, children's car seats); 0% zero-rated (most food, children's clothing)</td></tr>
<tr><td>Capital Gains Tax (CGT)</td><td>Profit from selling assets (property, shares)</td><td>18–28% (property); 10–20% (other assets)</td></tr>
<tr><td>Council Tax</td><td>Domestic properties</td><td>Varies by local authority and property band (A–H)</td></tr>
<tr><td>Inheritance Tax</td><td>Estate value above threshold on death</td><td>40% on estate above £325,000 threshold</td></tr>
</tbody></table>

<p><strong>Key state benefits:</strong></p>
<table class="g-table"><thead><tr><th>Benefit</th><th>What it provides</th><th>Eligibility</th></tr></thead><tbody>
<tr><td>Universal Credit</td><td>Monthly payment replacing multiple legacy benefits (JSA, ESA, Housing Benefit, Working Tax Credit)</td><td>Working age people on low income or out of work; means-tested</td></tr>
<tr><td>Child Benefit</td><td>£25.60/week first child; £16.95 additional children (2024–25 rates)</td><td>Any UK resident with children under 16; can be taxed back if household earns over £60,000</td></tr>
<tr><td>State Pension</td><td>£221.20/week full new state pension (2024–25)</td><td>Requires 35 qualifying NI contribution years; claim from state pension age (currently 66)</td></tr>
<tr><td>Statutory Sick Pay (SSP)</td><td>£116.75/week for up to 28 weeks</td><td>Employees earning over £123/week who have been off sick for 4+ days</td></tr>
</tbody></table>`,true),

    topic('C2','Consumer protection — FCA, FOS and FSCS', `
<div class="def-box"><div class="def-label">Three key regulators — know the difference</div>
<span class="def-term">FCA (Financial Conduct Authority)</span> — regulates the financial services industry; sets rules and standards; can authorise, fine or ban firms.<br><br>
<span class="def-term">FOS (Financial Ombudsman Service)</span> — independent dispute resolution service; resolves complaints between consumers and financial firms after internal complaints procedure exhausted.<br><br>
<span class="def-term">FSCS (Financial Services Compensation Scheme)</span> — compensates consumers if an FCA-authorised firm fails (goes bust).</div>

<table class="g-table"><thead><tr><th>Organisation</th><th>Purpose</th><th>Key limits / details</th><th>Free to use?</th></tr></thead><tbody>
<tr><td><strong>FCA</strong></td><td>Regulates financial firms — ensures fair treatment of customers, promotes competition, maintains market integrity</td><td>Can fine firms millions; can ban individuals; all financial firms must be FCA-authorised</td><td>N/A (not a consumer service)</td></tr>
<tr><td><strong>FOS</strong></td><td>Resolves disputes between customers and financial firms; can award compensation</td><td>Up to £415,000 compensation per complaint; firm must have had a chance to resolve complaint first</td><td>Yes — free for consumers</td></tr>
<tr><td><strong>FSCS</strong></td><td>Compensates savers/investors if an authorised firm collapses and cannot pay claims</td><td>Deposits: up to £85,000 per person per institution; Investments: up to £85,000; Insurance: 90–100% of claim</td><td>Yes — automatic protection</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
A very common exam error is confusing these three. Use this memory hook: <strong>FCA = regulates the INDUSTRY</strong>; <strong>FOS = resolves DISPUTES</strong>; <strong>FSCS = pays COMPENSATION when a firm FAILS</strong>. All three protect consumers but in different ways.</div>`,true)
  ]);

  /* ============================================================  AIM D — Sources of Business Finance  ============================================================ */
  const aimD = aimSection('D', [
    topic('D1','Internal sources of finance', `
<table class="g-table"><thead><tr><th>Source</th><th>Description</th><th>Advantages</th><th>Disadvantages</th></tr></thead><tbody>
<tr><td><strong>Retained profit</strong></td><td>Profit kept in the business rather than paid as dividends to shareholders</td><td>No interest cost; no loss of ownership; shows confidence in business</td><td>May reduce dividends (shareholder dissatisfaction); may not be sufficient for large investments; only available to profitable businesses</td></tr>
<tr><td><strong>Sale of assets</strong></td><td>Selling surplus or underused equipment, land, vehicles or property</td><td>Generates immediate cash; clears surplus assets; no interest</td><td>Asset is gone permanently; may reduce operational capacity; low prices if sold quickly</td></tr>
<tr><td><strong>Working capital management</strong></td><td>Collecting receivables faster, delaying payables, reducing inventory levels</td><td>No cost; uses cash already in the business; improves efficiency</td><td>May damage supplier/customer relationships; limited amount available; one-time benefit</td></tr>
</tbody></table>`,true),

    topic('D2','External sources of finance', `
<table class="g-table"><thead><tr><th>Source</th><th>Term</th><th>Advantages</th><th>Disadvantages</th><th>Best for</th></tr></thead><tbody>
<tr><td><strong>Bank overdraft</strong></td><td>Short-term</td><td>Flexible; only pay interest on amount used; quick to arrange</td><td>High interest rate; repayable on demand; not suitable for large amounts</td><td>Bridging short-term cash shortfall</td></tr>
<tr><td><strong>Trade credit</strong></td><td>Short-term</td><td>No immediate cash outflow; 30–90 days to pay; no interest if paid on time</td><td>Must pay eventually; suppliers may reduce credit if overdue; cannot be used for everything</td><td>Purchasing stock/supplies</td></tr>
<tr><td><strong>Factoring (invoice finance)</strong></td><td>Short-term</td><td>Immediate cash from outstanding invoices; reduces admin of chasing debts</td><td>Factor charges 1–5% of invoice value; customers deal with factor not you; affects relationships</td><td>Businesses with slow-paying customers</td></tr>
<tr><td><strong>Bank loan</strong></td><td>Medium/Long</td><td>Fixed repayments make planning easy; large sums available; variety of terms</td><td>Interest cost over term; may require collateral; credit history required</td><td>Equipment purchase, expansion</td></tr>
<tr><td><strong>Hire purchase</strong></td><td>Medium-term</td><td>Spread cost over time; use asset while paying; ownership transfers at end</td><td>Total cost higher than cash purchase; asset seized if payments missed</td><td>Vehicles, machinery</td></tr>
<tr><td><strong>Leasing</strong></td><td>Ongoing</td><td>No large upfront payment; easy to upgrade; maintenance often included</td><td>Never own the asset; ongoing liability; may be restricted in use</td><td>IT equipment, vehicles, property</td></tr>
<tr><td><strong>Share issue (equity)</strong></td><td>Long-term</td><td>No repayment required; large sums possible; shareholders may provide expertise</td><td>Loss of ownership and control; dividends expected; dilution of existing shareholders</td><td>Growth capital for limited companies/PLCs</td></tr>
<tr><td><strong>Debentures / Bonds</strong></td><td>Long-term</td><td>Fixed interest; large sums; does not dilute ownership</td><td>Must repay principal + fixed interest; secured on assets</td><td>Large established businesses; infrastructure</td></tr>
<tr><td><strong>Venture capital</strong></td><td>Long-term</td><td>Large sums; specialist business expertise and contacts provided</td><td>Significant equity given up; VC may influence strategy; high expectations</td><td>High-growth startups with big potential</td></tr>
<tr><td><strong>Crowdfunding</strong></td><td>Variable</td><td>No interest; marketing benefit; tests customer demand; community building</td><td>Time-consuming campaign; no guarantee of reaching target; equity dilution (equity crowdfunding)</td><td>Consumer product startups; creative projects</td></tr>
<tr><td><strong>Government grants</strong></td><td>One-off</td><td>Free money — no repayment required</td><td>Highly competitive; restrictive conditions; small amounts; lengthy application</td><td>Specific sectors (green tech, rural businesses, R&amp;D)</td></tr>
</tbody></table>`,true),

    topic('D3','Choosing the right source of finance', `
<p>Matching the source to the need is essential. Consider: the amount needed, the time period, whether the business can afford repayments, and the impact on ownership and control.</p>

<div class="formula-box">Short-term needs (under 1 year):  → Overdraft, trade credit, factoring

Medium-term needs (1–5 years):   → Bank loan, hire purchase, leasing

Long-term needs (5+ years):      → Share issue, debentures, venture capital, retained profit</div>

<p><strong>Key factors to consider:</strong></p>
<ul>
<li><strong>Purpose:</strong> buying an asset → use finance that matches asset life; covering cash gap → short-term source</li>
<li><strong>Cost:</strong> interest rate, fees, equity given up</li>
<li><strong>Ownership implications:</strong> sole traders and partnerships cannot issue shares; equity finance reduces control</li>
<li><strong>Risk:</strong> secured loans risk losing the asset if payments are missed</li>
<li><strong>Business type:</strong> a new startup may not have retained profit or credit history</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
"Recommend and justify a source of finance" questions are very common. Always: (1) name the source, (2) explain why it suits this specific business/purpose, (3) acknowledge one drawback and explain why it is still the best option in context. A sole trader cannot issue shares — do not recommend this for that business type.</div>`,false)
  ]);

  /* ============================================================  AIM E — Financial Planning  ============================================================ */
  const aimE = aimSection('E', [
    topic('E1','Break-even analysis', `
<p>Break-even analysis identifies the level of output at which total revenue equals total costs — the point of neither profit nor loss.</p>

<p><strong>Key formulas:</strong></p>
<div class="formula-box">Contribution per unit   = Selling price – Variable cost per unit
Break-even output (BEP) = Fixed costs ÷ Contribution per unit
Margin of safety        = Actual output – Break-even output
Profit at output Q      = (Q – BEP) × Contribution per unit
Total costs             = Fixed costs + (Variable cost per unit × Units produced)
Total revenue           = Selling price × Units sold</div>

<p><strong>Worked example:</strong></p>
<table class="g-table"><thead><tr><th>Data</th><th>Value</th></tr></thead><tbody>
<tr><td>Selling price per unit</td><td>£25</td></tr>
<tr><td>Variable cost per unit</td><td>£15</td></tr>
<tr><td>Fixed costs (per month)</td><td>£40,000</td></tr>
<tr><td>Actual monthly production</td><td>5,000 units</td></tr>
</tbody></table>

<div class="formula-box">Step 1: Contribution per unit = £25 – £15 = £10

Step 2: BEP = £40,000 ÷ £10 = 4,000 units

Step 3: Margin of safety = 5,000 – 4,000 = 1,000 units

Step 4: Profit = 1,000 × £10 = £10,000

Verification:
  Total revenue  = 5,000 × £25 = £125,000
  Total costs    = £40,000 + (5,000 × £15) = £40,000 + £75,000 = £115,000
  Profit         = £125,000 – £115,000 = £10,000 ✓</div>

<p><strong>Break-even chart:</strong></p>
<div class="guide-diagram">
  <canvas id="bus-bep-chart" width="520" height="320" style="border-radius:var(--r-sm)"></canvas>
  <figcaption>Figure 1 — Break-even chart: Fixed cost (horizontal), Total cost (rising diagonal), Revenue (steeper diagonal). BEP where TC meets TR. Margin of safety = actual output – BEP. Profit area shaded green, loss area red.</figcaption>
</div>

<p><strong>Limitations of break-even analysis:</strong></p>
<ul>
<li>Assumes all output is sold — in reality, there may be unsold stock</li>
<li>Assumes fixed costs stay fixed — rent, rates can change</li>
<li>Assumes variable costs per unit are constant — bulk buying may give discounts</li>
<li>Only works for a single product — most businesses sell multiple products</li>
<li>Static model — doesn't account for changing prices or market conditions</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
Always show your working in break-even calculations. The examiner can award method marks even if your final answer is wrong. Present your answer clearly: "BEP = FC ÷ CPU = £40,000 ÷ £10 = 4,000 units." Then interpret: "This means the business must sell at least 4,000 units to cover all costs and avoid a loss."</div>`,true),

    topic('E2','Cash flow forecasts', `
<p>A cash flow forecast predicts the expected cash inflows and outflows over a period, showing the expected closing balance at the end of each period.</p>

<div class="def-box"><div class="def-label">Key distinction</div>
<span class="def-term">Cash flow ≠ profit.</span> A business can be profitable but run out of cash (e.g. if customers are slow to pay). Cash flow forecasts track when money actually enters and leaves the bank account.</div>

<p><strong>Structure of a cash flow forecast:</strong></p>
<table class="g-table"><thead><tr><th>Item</th><th>Jan (£)</th><th>Feb (£)</th><th>Mar (£)</th></tr></thead><tbody>
<tr><td><strong>Cash receipts (inflows)</strong></td><td></td><td></td><td></td></tr>
<tr><td>Sales receipts</td><td>18,000</td><td>22,000</td><td>25,000</td></tr>
<tr><td>Loan received</td><td>10,000</td><td>0</td><td>0</td></tr>
<tr><td><strong>Total inflows (A)</strong></td><td><strong>28,000</strong></td><td><strong>22,000</strong></td><td><strong>25,000</strong></td></tr>
<tr><td><strong>Cash payments (outflows)</strong></td><td></td><td></td><td></td></tr>
<tr><td>Stock purchases</td><td>12,000</td><td>14,000</td><td>16,000</td></tr>
<tr><td>Wages</td><td>6,000</td><td>6,000</td><td>6,500</td></tr>
<tr><td>Rent</td><td>2,000</td><td>2,000</td><td>2,000</td></tr>
<tr><td><strong>Total outflows (B)</strong></td><td><strong>20,000</strong></td><td><strong>22,000</strong></td><td><strong>24,500</strong></td></tr>
<tr><td><strong>Net cash flow (A–B)</strong></td><td><strong>+8,000</strong></td><td><strong>0</strong></td><td><strong>+500</strong></td></tr>
<tr><td>Opening balance</td><td>2,000</td><td>10,000</td><td>10,000</td></tr>
<tr><td><strong>Closing balance</strong></td><td><strong>10,000</strong></td><td><strong>10,000</strong></td><td><strong>10,500</strong></td></tr>
</tbody></table>

<div class="formula-box">Closing balance = Opening balance + Net cash flow
Net cash flow   = Total inflows – Total outflows</div>

<p><strong>Common cash flow problems and solutions:</strong></p>
<table class="g-table"><thead><tr><th>Problem</th><th>Likely cause</th><th>Possible solution</th></tr></thead><tbody>
<tr><td>Negative net cash flow</td><td>Costs exceed income in that period</td><td>Reduce costs; increase prices; find new revenue</td></tr>
<tr><td>Negative closing balance</td><td>Cumulative cash deficit</td><td>Arrange overdraft; inject capital; delay payments</td></tr>
<tr><td>Very large outflow in one month</td><td>Annual payment (insurance, corporation tax)</td><td>Budget in advance; spread costs across months</td></tr>
<tr><td>Low inflows despite good sales</td><td>Credit customers not yet paid</td><td>Chase debtors faster; offer early payment discounts</td></tr>
</tbody></table>

<p><strong>Limitations of cash flow forecasts:</strong></p>
<ul>
<li>Based on estimates — actual figures will differ</li>
<li>Cannot predict unexpected events (economic downturn, supplier failure)</li>
<li>Only as accurate as the underlying assumptions</li>
<li>Historical data may not reflect future conditions</li>
</ul>`,true),

    topic('E3','Business budgets and variance analysis', `
<p><strong>Purposes of budgets:</strong></p>
<ul>
<li><strong>Planning:</strong> forces managers to think ahead and set financial targets</li>
<li><strong>Control:</strong> actual performance compared to budget — variance analysis identifies problems</li>
<li><strong>Motivation:</strong> gives staff financial targets to aim for</li>
<li><strong>Coordination:</strong> ensures all departments work towards the same financial goals</li>
<li><strong>Communication:</strong> shares expectations between management levels</li>
</ul>

<p><strong>Types of budget:</strong></p>
<ul>
<li><strong>Income budget:</strong> expected sales revenue for the period</li>
<li><strong>Expenditure budget:</strong> planned spending for the period</li>
<li><strong>Profit budget:</strong> expected profit = budgeted income – budgeted expenditure</li>
</ul>

<p><strong>Variance analysis:</strong></p>
<div class="def-box"><div class="def-label">Key definitions</div>
<span class="def-term">Favourable variance</span> — actual result is better than budget (costs lower than expected OR revenue higher than expected).<br><br>
<span class="def-term">Adverse variance</span> — actual result is worse than budget (costs higher than expected OR revenue lower than expected).</div>

<p><strong>Variance analysis worked example:</strong></p>
<table class="g-table"><thead><tr><th>Item</th><th>Budget (£)</th><th>Actual (£)</th><th>Variance (£)</th><th>Type</th></tr></thead><tbody>
<tr><td>Sales revenue</td><td>80,000</td><td>72,000</td><td>–8,000</td><td>Adverse (lower sales)</td></tr>
<tr><td>Material costs</td><td>30,000</td><td>27,500</td><td>–2,500</td><td>Favourable (lower costs)</td></tr>
<tr><td>Labour costs</td><td>20,000</td><td>23,000</td><td>+3,000</td><td>Adverse (higher costs)</td></tr>
<tr><td>Overheads</td><td>10,000</td><td>10,000</td><td>0</td><td>On target</td></tr>
<tr><td><strong>Net profit</strong></td><td><strong>20,000</strong></td><td><strong>11,500</strong></td><td><strong>–8,500</strong></td><td><strong>Adverse overall</strong></td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
When asked to analyse variance: (1) identify whether each variance is favourable or adverse, (2) suggest a possible cause, (3) suggest how management might respond. "The adverse labour variance of £3,000 may have been caused by overtime to meet an unexpected order. Management should review staffing levels and consider whether to hire additional staff to avoid overtime premiums in future."</div>`,false)
  ]);

  /* ============================================================  AIM F — Financial Statements  ============================================================ */
  const aimF = aimSection('F', [
    topic('F1','Income statement (Statement of Comprehensive Income)', `
<p>The income statement shows revenue earned and costs incurred over an accounting period, resulting in gross profit and then net profit.</p>

<div class="formula-box">INCOME STATEMENT — WORKED EXAMPLE
                                               £
Revenue (sales)                          180,000
Less: Cost of Sales                     (108,000)
                                        --------
GROSS PROFIT                              72,000
                                        --------
Less: Operating Expenses
  Distribution costs                     (8,000)
  Administration expenses               (24,000)
  Depreciation                           (6,000)
                                        --------
OPERATING (NET) PROFIT                    34,000
Less: Finance costs (interest)           (4,000)
                                        --------
PROFIT BEFORE TAX                         30,000
Less: Tax                                (5,000)
                                        --------
PROFIT FOR THE YEAR (Net profit)          25,000
                                        --------</div>

<p><strong>Adjustments to the income statement:</strong></p>
<table class="g-table"><thead><tr><th>Adjustment</th><th>What it is</th><th>Income statement effect</th><th>Balance sheet effect</th></tr></thead><tbody>
<tr><td>Accrual</td><td>Expense owed but NOT yet paid (e.g. electricity bill received after year end)</td><td>Increases expenses (expense included)</td><td>Current liability (amount owed)</td></tr>
<tr><td>Prepayment</td><td>Expense paid in advance (e.g. 12 months insurance paid in October)</td><td>Reduces expenses (only include portion used in period)</td><td>Current asset (prepaid portion)</td></tr>
<tr><td>Depreciation</td><td>Annual reduction in value of non-current assets</td><td>Increases expenses each year</td><td>Reduces carrying value (NBV) of asset</td></tr>
</tbody></table>

<p><strong>Depreciation methods:</strong></p>
<div class="formula-box">STRAIGHT-LINE METHOD:
Annual depreciation = (Cost – Residual value) ÷ Useful life in years

Example: Machine costs £20,000; residual value £2,000; useful life 6 years
Annual depreciation = (£20,000 – £2,000) ÷ 6 = £3,000 per year
Year 1 NBV = £20,000 – £3,000 = £17,000
Year 2 NBV = £17,000 – £3,000 = £14,000

REDUCING BALANCE METHOD:
Annual depreciation = Net Book Value × Depreciation rate

Example: Machine NBV £20,000; rate 25%
Year 1: £20,000 × 25% = £5,000 depreciation; NBV = £15,000
Year 2: £15,000 × 25% = £3,750 depreciation; NBV = £11,250
Year 3: £11,250 × 25% = £2,813 depreciation; NBV = £8,437</div>`,true),

    topic('F2','Statement of financial position (Balance Sheet)', `
<div class="formula-box">THE ACCOUNTING EQUATION:
Assets = Equity + Liabilities
or: Net assets = Equity</div>

<div class="formula-box">STATEMENT OF FINANCIAL POSITION — WORKED EXAMPLE
                                               £
NON-CURRENT ASSETS
  Property, plant & equipment (at cost)   80,000
  Less: Accumulated depreciation         (18,000)
  Net Book Value                          62,000
                                         -------
CURRENT ASSETS
  Inventories (stock)                     15,000
  Trade receivables (debtors)             12,000
  Prepayments                              1,500
  Cash and cash equivalents               8,500
  Total current assets                    37,000
                                         -------
TOTAL ASSETS                              99,000
                                         =======

EQUITY
  Share capital                           40,000
  Retained earnings                       22,000
  Total equity                            62,000
                                         -------
NON-CURRENT LIABILITIES
  Long-term bank loan                     20,000
                                         -------
CURRENT LIABILITIES
  Trade payables (creditors)              12,000
  Accruals                                 3,000
  Tax payable                              2,000
  Total current liabilities               17,000
                                         -------
TOTAL EQUITY AND LIABILITIES              99,000
                                         =======</div>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
The SFP must always balance: Total Assets = Total Equity + Total Liabilities. Check your answer balances. Common errors: forgetting to deduct accumulated depreciation from asset cost; confusing current and non-current items; misplacing accruals (liability) and prepayments (asset).</div>`,true),

    topic('F3','Financial ratio analysis — profitability and liquidity', `
<p>Ratios allow comparison of financial performance over time and between businesses. Know the formula, how to calculate and how to interpret each ratio.</p>

<table class="g-table"><thead><tr><th>Ratio</th><th>Formula</th><th>Worked example</th><th>Interpretation</th><th>Benchmark</th></tr></thead><tbody>
<tr><td><strong>Gross Profit Margin (GPM)</strong></td><td>Gross Profit ÷ Revenue × 100</td><td>£72,000 ÷ £180,000 × 100 = <strong>40%</strong></td><td>40p gross profit earned per £1 of sales</td><td>Varies by sector; higher = better; compare to prior year</td></tr>
<tr><td><strong>Net Profit Margin (NPM)</strong></td><td>Net Profit ÷ Revenue × 100</td><td>£25,000 ÷ £180,000 × 100 = <strong>13.9%</strong></td><td>13.9p net profit per £1 of sales after all costs</td><td>Higher = better; declining NPM may indicate rising overheads</td></tr>
<tr><td><strong>Return on Capital Employed (ROCE)</strong></td><td>Operating Profit ÷ Capital Employed × 100</td><td>£34,000 ÷ (£62,000 + £20,000) × 100 = <strong>41.5%</strong></td><td>41.5% return on every £1 of capital invested</td><td>Should exceed cost of borrowing; higher = more efficient use of capital</td></tr>
<tr><td><strong>Current Ratio</strong></td><td>Current Assets ÷ Current Liabilities</td><td>£37,000 ÷ £17,000 = <strong>2.18 : 1</strong></td><td>£2.18 available to cover every £1 of short-term debt</td><td>1.5:1 to 2:1 is ideal; too high = idle cash; too low = liquidity risk</td></tr>
<tr><td><strong>Acid Test Ratio</strong></td><td>(Current Assets – Inventories) ÷ Current Liabilities</td><td>(£37,000 – £15,000) ÷ £17,000 = <strong>1.29 : 1</strong></td><td>Can pay short-term debts without selling stock</td><td>Should be at least 1:1; below 1 = may struggle to pay short-term debts</td></tr>
</tbody></table>

<div class="formula-box">Capital Employed = Total equity + Non-current liabilities
               = £62,000 + £20,000 = £82,000  (from worked SFP above)</div>

<p><strong>How to evaluate ratios in exam answers:</strong></p>
<ol>
<li>State the ratio and show your calculation</li>
<li>Interpret what it means in plain English</li>
<li>Compare to a benchmark (prior year, industry average, or ideal range)</li>
<li>Identify one reason why it might have changed</li>
<li>Suggest one improvement if the ratio is poor</li>
</ol>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
The difference between current ratio and acid test is inventory. If the current ratio looks healthy but the acid test is poor, the business has too much cash tied up in slow-moving stock. This is especially a concern for retailers with seasonal inventory. Always compare both ratios together.</div>

<div class="mistake-box"><div class="mistake-label">&#9888; Common mistake</div>
Students use net profit for ROCE instead of operating (net) profit. ROCE uses <strong>operating profit</strong> (before interest and tax) and <strong>capital employed</strong> (not total assets). Get these components right before calculating the ratio.</div>`,true)
  ]);

  /* ---- Key Formulas Reference Card ---- */
  const formulaCard = `
<div class="guide-aim-section" id="guide-formulas">
  <div class="guide-aim-hd">
    <div class="guide-aim-badge" style="font-size:0.9rem">&#128220;</div>
    <div>
      <div class="guide-aim-title">Key Formulas Reference Card</div>
      <div class="guide-aim-subtitle">All essential formulas for Unit 3 calculations — print this page for quick revision</div>
    </div>
  </div>
  <div class="guide-topic open" id="gt-formulas">
    <div class="guide-topic-hd" onclick="toggleGT('gt-formulas')">
      <span class="guide-topic-code">REF</span>
      <span class="guide-topic-name">All Unit 3 formulas</span>
      <span class="guide-topic-chevron">&#9660;</span>
    </div>
    <div class="guide-topic-body">
      <div class="formula-box">BREAK-EVEN
Contribution per unit   = Selling price – Variable cost per unit
Break-even output       = Fixed costs ÷ Contribution per unit
Margin of safety        = Actual output – Break-even output
Total revenue           = Selling price × Units
Total costs             = Fixed costs + (Variable cost × Units)
Profit                  = Total revenue – Total costs

CASH FLOW
Net cash flow           = Total inflows – Total outflows
Closing balance         = Opening balance + Net cash flow

DEPRECIATION
Straight-line p.a.      = (Cost – Residual value) ÷ Useful life
Reducing balance p.a.   = Net book value × Rate %

PROFITABILITY RATIOS
Gross profit margin (%) = Gross profit ÷ Revenue × 100
Net profit margin (%)   = Net profit ÷ Revenue × 100
ROCE (%)                = Operating profit ÷ Capital employed × 100

LIQUIDITY RATIOS
Current ratio           = Current assets ÷ Current liabilities
Acid test ratio         = (Current assets – Inventories) ÷ Current liabilities

OTHER
Capital employed        = Total equity + Non-current liabilities
Accounting equation:    Assets = Equity + Liabilities</div>
    </div>
  </div>
</div>`;

  /* ---- Canvas drawing for break-even chart ---- */
  function drawBEPChart() {
    const canvas = document.getElementById('bus-bep-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const bg = dark ? '#1e293b' : '#f8fafc';
    const ink = dark ? '#e2e8f0' : '#1e293b';
    const line = dark ? '#334155' : '#e2e8f0';
    const accent = '#1a56db';

    ctx.fillStyle = bg;
    ctx.fillRect(0,0,W,H);

    const PAD = { l:60, r:24, t:20, b:56 };
    const cW = W - PAD.l - PAD.r;
    const cH = H - PAD.t - PAD.b;

    // Chart data
    const FC = 40000, VCpu = 15, SPpu = 25, maxUnits = 8000;
    const BEP = FC / (SPpu - VCpu); // 4000
    const maxCost = FC + VCpu * maxUnits;
    const maxRev = SPpu * maxUnits;
    const maxY = Math.max(maxCost, maxRev);

    function toX(units) { return PAD.l + (units / maxUnits) * cW; }
    function toY(val) { return PAD.t + cH - (val / maxY) * cH; }

    // Grid lines
    ctx.strokeStyle = line;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = PAD.t + (i / 5) * cH;
      ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(W - PAD.r, y); ctx.stroke();
    }

    // Profit zone (green)
    ctx.fillStyle = 'rgba(34,197,94,0.12)';
    ctx.beginPath();
    ctx.moveTo(toX(BEP), toY(SPpu * BEP));
    ctx.lineTo(toX(maxUnits), toY(SPpu * maxUnits));
    ctx.lineTo(toX(maxUnits), toY(FC + VCpu * maxUnits));
    ctx.closePath();
    ctx.fill();

    // Loss zone (red)
    ctx.fillStyle = 'rgba(239,68,68,0.1)';
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(0));
    ctx.lineTo(toX(BEP), toY(SPpu * BEP));
    ctx.lineTo(toX(BEP), toY(FC + VCpu * BEP));
    ctx.lineTo(toX(0), toY(FC));
    ctx.closePath();
    ctx.fill();

    // Fixed cost line
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 3]);
    ctx.beginPath(); ctx.moveTo(toX(0), toY(FC)); ctx.lineTo(toX(maxUnits), toY(FC)); ctx.stroke();
    ctx.setLineDash([]);

    // Total cost line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(toX(0), toY(FC)); ctx.lineTo(toX(maxUnits), toY(FC + VCpu * maxUnits)); ctx.stroke();

    // Revenue line
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(toX(0), toY(0)); ctx.lineTo(toX(maxUnits), toY(SPpu * maxUnits)); ctx.stroke();

    // BEP vertical line
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(toX(BEP), toY(0)); ctx.lineTo(toX(BEP), toY(SPpu * BEP)); ctx.stroke();
    ctx.setLineDash([]);

    // BEP dot
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.arc(toX(BEP), toY(SPpu * BEP), 6, 0, Math.PI*2); ctx.fill();

    // Margin of safety bracket
    const actualUnits = 6000;
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 1.5;
    const bY = toY(FC) + 18;
    ctx.beginPath();
    ctx.moveTo(toX(BEP), bY); ctx.lineTo(toX(actualUnits), bY);
    ctx.moveTo(toX(BEP), bY - 5); ctx.lineTo(toX(BEP), bY + 5);
    ctx.moveTo(toX(actualUnits), bY - 5); ctx.lineTo(toX(actualUnits), bY + 5);
    ctx.stroke();

    // Axes
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, H - PAD.b); ctx.lineTo(W - PAD.r, H - PAD.b);
    ctx.stroke();

    // Y axis labels
    ctx.fillStyle = ink;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const val = (i / 5) * maxY;
      const y = PAD.t + cH - (i / 5) * cH;
      ctx.fillText('£' + (val/1000).toFixed(0) + 'k', PAD.l - 4, y + 3);
    }

    // X axis labels
    ctx.textAlign = 'center';
    for (let i = 0; i <= 8; i += 2) {
      ctx.fillText(i + 'k', toX(i * 1000), H - PAD.b + 14);
    }

    // Axis titles
    ctx.font = '11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Units produced / sold', W / 2, H - 8);
    ctx.save();
    ctx.translate(14, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Costs and Revenue (£)', 0, 0);
    ctx.restore();

    // Legend
    const lx = PAD.l + 10, ly = PAD.t + 8;
    const items = [
      ['#22c55e', 'Revenue'],
      ['#ef4444', 'Total cost'],
      ['#f59e0b', 'Fixed cost'],
      [accent, 'Break-even point'],
      ['#8b5cf6', 'Margin of safety']
    ];
    items.forEach(([color, label], i) => {
      ctx.fillStyle = color;
      ctx.fillRect(lx, ly + i * 15, 14, 3);
      ctx.fillStyle = ink;
      ctx.textAlign = 'left';
      ctx.font = '9.5px system-ui';
      ctx.fillText(label, lx + 18, ly + i * 15 + 4);
    });

    // BEP label
    ctx.fillStyle = accent;
    ctx.font = 'bold 9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('BEP', toX(BEP), toY(SPpu * BEP) - 10);
    ctx.fillText('4,000 units', toX(BEP), H - PAD.b + 28);

    // MoS label
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText('← MoS →', toX((BEP + actualUnits) / 2), bY + 14);
  }

  /* ---- Full guide HTML ---- */
  function buildGuideHTML() {
    return `
<div class="guide-shell">
  <div class="guide-sidebar" id="guide-sidebar-bus">
    ${buildSidebar()}
  </div>
  <div class="guide-main">
    <div class="guide-topbar">
      <div class="guide-progress-track"><div class="guide-progress-fill" id="guide-pf-bus" style="width:0%"></div></div>
      <span class="guide-progress-text" id="guide-pt-bus">0 / 6 aims revised</span>
      <button class="guide-print-btn" onclick="window.print()">&#128438; Print guide</button>
    </div>
    ${buildGuideGallery()}
    ${aimA}
    ${aimB}
    ${aimC}
    ${aimD}
    ${aimE}
    ${aimF}
    ${formulaCard}
  </div>
</div>`;
  }

  function updateProgress() {
    const revised = getRevised();
    const count = AIMS.filter(a => revised.includes(a)).length;
    const fill = document.getElementById('guide-pf-bus');
    const text = document.getElementById('guide-pt-bus');
    if (fill) fill.style.width = (count / AIMS.length * 100) + '%';
    if (text) text.textContent = count + ' / ' + AIMS.length + ' aims revised';
    AIMS.forEach(a => {
      const btn = document.getElementById('gmb-' + a);
      if (!btn) return;
      const done = revised.includes(a);
      btn.classList.toggle('revised', done);
      btn.innerHTML = done
        ? '<span class="guide-mark-icon">&#10003;</span> Aim ' + a + ' revised!'
        : '<span class="guide-mark-icon">&#9711;</span> Mark Aim ' + a + ' as revised';
    });
  }

  function setupScrollSpy() {
    const sections = document.querySelectorAll('.guide-aim-section[id]');
    if (!sections.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        document.querySelectorAll('.guide-toc-aim-link').forEach(l => {
          l.classList.toggle('active', l.getAttribute('onclick') && l.getAttribute('onclick').includes(id));
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => observer.observe(s));
  }

  window.toggleGT = window.toggleGT || function(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('open');
  };
  window.toggleGuideRevised = function(aimLetter) {
    const arr = getRevised();
    const idx = arr.indexOf(aimLetter);
    if (idx === -1) arr.push(aimLetter); else arr.splice(idx, 1);
    saveRevised(arr);
    updateProgress();
  };
  window.guideScrollTo = window.guideScrollTo || function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const sb = document.getElementById('guide-sidebar-bus');
    if (sb && window.innerWidth < 769) sb.classList.remove('sb-open');
  };

  window.initComprehensiveGuide = function() {
    const container = document.getElementById('guide-comprehensive');
    if (!container) return;
    if (container.dataset.built === '1') { updateProgress(); drawBEPChart(); return; }
    container.innerHTML = buildGuideHTML();
    container.dataset.built = '1';
    updateProgress();
    setupScrollSpy();
    setTimeout(drawBEPChart, 100);
  };

})();
