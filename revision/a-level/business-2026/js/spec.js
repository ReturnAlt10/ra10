/* AQA A-level Business (7138) — subject content from the AQA specification (v1.1, November 2025; first A-level exam June 2028).
   Aims A, B and C are Units 3.1, 3.2 and 3.3 (Papers 1, 2 and 3). */
(function () {
  'use strict';
  window.LEARNING_AIMS = ['A', 'B', 'C'];
  window.SPEC = {
    A: { title: 'Unit 3.1 What is business? Managing marketing and finance', short: 'Paper 1 — entrepreneurs, forms of business, stakeholders, marketing and finance', topics: [
      { code: 'A1', name: '3.1.1 Business and objectives' },
      { code: 'A1.1', name: 'Entrepreneurs: financial and non-financial reasons; risk taker, resilient, focused, passionate, innovative, adaptable; challenges; changing role as the business grows' },
      { code: 'A1.2', name: 'Business planning and decisions: purpose of a business plan, competitiveness, risk and reward, opportunity cost, ethical dilemmas (profit v ethics)' },
      { code: 'A1.3', name: 'Business objectives: purpose and value; SMART objectives' },
      { code: 'A2', name: '3.1.2 Forms of business and stakeholders' },
      { code: 'A2.1', name: 'Sole traders, Ltd, plc, co-operatives, social enterprises: control, objectives, finance, profit distribution, liability' },
      { code: 'A2.2', name: 'Share price influences; calculate market capitalisation, dividends per share and dividend yield' },
      { code: 'A2.3', name: 'Internal and external stakeholders; impact of business activity; ethical responsibilities' },
      { code: 'A3', name: '3.1.3 Marketing management' },
      { code: 'A3.1', name: 'Market research: primary/secondary, quantitative/qualitative, confidence levels and intervals, market mapping' },
      { code: 'A3.2', name: 'Markets and marketing data: B2B, B2C, C2C; market conditions; market size, growth and share; return on marketing spend; correlation; index numbers' },
      { code: 'A3.3', name: 'Demand: price and income elasticity (calculate and interpret); effect of price changes on revenue' },
      { code: 'A3.4', name: 'Target market: segmentation (demographic, geographic, psychographic, behavioural); niche v mass' },
      { code: 'A3.5', name: 'Marketing objectives and planning: lead generation, conversion, retention, budget, seasonal and cyclical demand' },
      { code: 'A3.6', name: 'Marketing mix: product life cycle, extension strategies, Boston Matrix, new product development; pricing methods; distribution channels; promotional mix; branding' },
      { code: 'A3.7', name: 'Digital technology and marketing: AI, SEO, PPC, cookies, CRM, data analytics, digital measures of success; international marketing; ethics' },
      { code: 'A4', name: '3.1.4 Financial management' },
      { code: 'A4.1', name: 'Financial objectives; internal and external sources of finance (owners’ investment, retained profit, sale and leaseback, trade credit, share capital, overdraft, loans, business angels, private equity, crowd funding)' },
      { code: 'A4.2', name: 'Break-even: calculate break-even output, margin of safety, contribution; break-even charts' },
      { code: 'A4.3', name: 'Profit, budgets and variances: gross, operating and profit for the year; zero-based budgeting; adverse/favourable variances' },
      { code: 'A4.4', name: 'Cash flow and liquidity: cash flow forecasts; payables and receivables; current ratio, acid test ratio, payables days, receivables days' },
      { code: 'A4.5', name: 'Financial reporting and performance: margins, ROCE, return on investment, gearing; trends, benchmarking and limitations; ethics in finance' }] },
    B: { title: 'Unit 3.2 Managing people and operations', short: 'Paper 2 — HR, operations and business culture (with links to 3.1)', topics: [
      { code: 'B1', name: '3.2.1 People management' },
      { code: 'B1.1', name: 'HR objectives and planning: recruitment, training, retention, redeployment, redundancy; forms of employment; flexible employment' },
      { code: 'B1.2', name: 'HR data: employee turnover, productivity, sales per employee, employee costs as % of revenue; KPIs' },
      { code: 'B1.3', name: 'Organisational design: span of control, tall and flat structures, centralisation and decentralisation, delayering' },
      { code: 'B1.4', name: 'Leadership: autocratic, democratic, transformational; impact on individuals, teams and performance' },
      { code: 'B1.5', name: 'Developing people (appraisal, talent) and teamwork (Hackman’s model)' },
      { code: 'B1.6', name: 'Motivation (Taylor, Maslow, Herzberg), financial and non-financial rewards, wellbeing, employer–employee relations, ethics in HR' },
      { code: 'B2', name: '3.2.2 Operations management' },
      { code: 'B2.1', name: 'Operations objectives, location decisions and KPIs; employee productivity, unit costs, capacity utilisation' },
      { code: 'B2.2', name: 'Efficiency and lean production (kaizen, waste, scheduling); quality (QC, QA, TQM, quality circles, benchmarking)' },
      { code: 'B2.3', name: 'Environmental impact of operations; matching output to demand; supply chain management and ethics' },
      { code: 'B2.4', name: 'Inventory management (JIT v JIC, inventory turnover); innovation and IP; project management and network analysis (critical path, float); scale; technology and AI' },
      { code: 'B3', name: '3.2.3 Managing business culture' },
      { code: 'B3.1', name: 'Values and culture: influences, impact of positive/negative culture, reasons for and challenges of changing culture' }] },
    C: { title: 'Unit 3.3 Business and society, the external environment and strategy', short: 'Paper 3 — sustainability, external environment, strategy and change (synoptic)', topics: [
      { code: 'C1', name: '3.3.1 Business and society' },
      { code: 'C1.1', name: 'Sustainability (environmental, social, economic), Triple Bottom Line, CSR, Carroll’s pyramid, shareholder v stakeholder, greenwashing, ESG reporting' },
      { code: 'C2', name: '3.3.2 Business and the external environment' },
      { code: 'C2.1', name: 'Porter’s five forces; political/legal (trade agreements, tariffs, consumer and employee protection, competition, environment)' },
      { code: 'C2.2', name: 'Economic (GDP, taxation, inflation, interest and exchange rates, unemployment; effect of exchange rates on prices), social and technological change (AI, disruption)' },
      { code: 'C3', name: '3.3.3 Strategy' },
      { code: 'C3.1', name: 'Strategy and planning; mission, vision, objectives; SWOT; stakeholder mapping and stakeholder actions' },
      { code: 'C3.2', name: 'Selecting a strategy: Ansoff, positioning (low cost v differentiation); implementation; strategic drift' },
      { code: 'C3.3', name: 'Strategic investment decisions: payback, average rate of return, net present value' },
      { code: 'C3.4', name: 'Growth: SMEs, organic v external growth, mergers, acquisitions, franchising, integration, retrenchment; global strategy; digital strategy' },
      { code: 'C4', name: '3.3.4 Change' },
      { code: 'C4.1', name: 'Reasons for change, resistance (Kotter and Schlesinger), managing change (Lewin’s force field)' },
      { code: 'C4.2', name: 'Risk and uncertainty: types of risk and ways to manage them; scenario planning; agile business' }] }
  };
})();
