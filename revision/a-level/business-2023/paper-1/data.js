const APP_DATA = (() => {
  const specSummary = {
    title: "AQA A-Level Business Paper 1 (Business 1)",
    scope: [
      "3.1 What is business?",
      "3.2 Managers, leadership and decision making",
      "3.3 Decision making to improve marketing performance",
      "3.4 Decision making to improve operational performance",
      "3.5 Decision making to improve financial performance",
      "3.6 Decision making to improve human resource performance",
      "3.7 Analysing the strategic position of a business",
      "3.8 Choosing strategic direction",
      "3.9 Strategic methods: how to pursue strategies",
      "3.10 Managing strategic change"
    ]
  };

  const revisionTopics = [
    {
      code: "3.1",
      title: "What is business?",
      definitions: [
        { term: "Business", meaning: "An organisation combining resources to produce goods or services and create value." },
        { term: "Mission statement", meaning: "A broad statement of current purpose, values, and strategic direction." },
        { term: "Objective", meaning: "A measurable target the business aims to achieve in a defined period." },
        { term: "Stakeholder", meaning: "Any group affected by or able to affect business decisions." },
        { term: "Economies of scale", meaning: "Falling average cost as output increases." },
        { term: "Diseconomies of scale", meaning: "Rising average cost when growth creates inefficiency." },
        { term: "Organic growth", meaning: "Internal expansion through increased output, products, or markets." },
        { term: "Inorganic growth", meaning: "External growth via merger, acquisition, or takeover." }
      ],
      deepKnowledge: [
        "Profit, growth, market share, and ethics often conflict; strong evaluation weighs trade-offs by stakeholder power.",
        "PLC status improves access to finance but can increase pressure for short-term results.",
        "Economies of scale are not automatic; integration quality and management systems drive real cost savings.",
        "Corporate strategy quality depends on consistency between mission, objectives, and implementation capacity."
      ],
      models: ["Stakeholder mapping", "Ansoff Matrix", "Porter Generic Strategies"],
      pitfalls: [
        "Confusing cash flow with profit.",
        "Assuming growth always raises profit.",
        "Ignoring non-financial objectives in evaluations."
      ],
      examTech: [
        "For 9/12 markers, compare at least two strategic routes before judgement.",
        "Use stakeholder impact to justify why one objective should dominate.",
        "Name the implementation risk in your final paragraph."
      ]
    },
    {
      code: "3.2",
      title: "Managers, leadership and decision making",
      definitions: [
        { term: "Leadership", meaning: "Influencing others to achieve organisational goals." },
        { term: "Autocratic leadership", meaning: "Leader makes decisions with limited employee input." },
        { term: "Democratic leadership", meaning: "Leader consults employees before deciding." },
        { term: "Laissez-faire leadership", meaning: "Leader delegates substantial decision authority to teams." },
        { term: "Scientific decision making", meaning: "Using data, models, and logic to choose options." },
        { term: "Bounded rationality", meaning: "Decision quality limited by time, information, and cognitive constraints." },
        { term: "Herzberg motivators", meaning: "Intrinsic factors such as achievement and recognition that raise satisfaction." },
        { term: "Delegation", meaning: "Passing authority and responsibility down the hierarchy." }
      ],
      deepKnowledge: [
        "No single leadership style is always best; context, skill level, and urgency determine fit.",
        "Motivation packages should combine hygiene factors and motivators to reduce dissatisfaction and raise performance.",
        "Centralisation can improve control but reduce responsiveness; decentralisation can speed local decisions but increase inconsistency.",
        "Decision trees and expected values improve clarity, but probabilities are often subjective."
      ],
      models: ["Maslow", "Herzberg", "Decision trees", "Critical path analysis"],
      pitfalls: [
        "Using theory with no context link.",
        "Assuming all staff are motivated by pay only.",
        "Ignoring information quality when discussing decisions."
      ],
      examTech: [
        "Apply theory to workforce type and business stage.",
        "When evaluating leadership, include speed vs buy-in trade-off.",
        "For AO4, judge which leadership style is most sustainable, not just fastest."
      ]
    },
    {
      code: "3.3",
      title: "Improving marketing performance",
      definitions: [
        { term: "Market segmentation", meaning: "Dividing a market into groups with similar needs or characteristics." },
        { term: "Targeting", meaning: "Selecting specific segments to serve." },
        { term: "Positioning", meaning: "How the product is perceived relative to competitors." },
        { term: "PED", meaning: "Price elasticity of demand, responsiveness of quantity demanded to price change." },
        { term: "YED", meaning: "Income elasticity of demand, responsiveness of demand to income change." },
        { term: "Market share", meaning: "Firm sales as a percentage of total market sales." },
        { term: "Product life cycle", meaning: "Introduction, growth, maturity, and decline phases of a product." },
        { term: "Contribution", meaning: "Selling price minus variable cost per unit." }
      ],
      deepKnowledge: [
        "Marketing decisions should combine quantitative signals (elasticity, share, conversion rates) with qualitative research insights.",
        "In mature markets, differentiation and brand strength can protect margin more effectively than price cuts.",
        "A high PED suggests cautious price rises and potential revenue risk.",
        "STP quality shapes all later marketing-mix decisions and profitability."
      ],
      models: ["Ansoff Matrix", "Boston Matrix", "Marketing mix (7Ps)", "STP"],
      pitfalls: [
        "Treating all segments as equally profitable.",
        "Forgetting competitor reaction to pricing changes.",
        "Using old market research without checking relevance."
      ],
      examTech: [
        "Calculate first, then interpret in context.",
        "Support strategy choices with likely customer response.",
        "In final judgement, state the critical market assumption."
      ]
    },
    {
      code: "3.4",
      title: "Improving operational performance",
      definitions: [
        { term: "Capacity utilisation", meaning: "Current output as a percentage of maximum possible output." },
        { term: "Labour productivity", meaning: "Output produced per worker per period." },
        { term: "Lean production", meaning: "Systematic elimination of waste to improve flow and value." },
        { term: "JIT", meaning: "Producing and ordering only when needed to reduce inventory." },
        { term: "Kaizen", meaning: "Continuous incremental improvement by workforce and managers." },
        { term: "TQM", meaning: "Quality approach where all staff continuously improve processes." },
        { term: "Quality assurance", meaning: "Preventing defects through process design and standards." },
        { term: "Quality control", meaning: "Detecting defects in finished or in-process output." }
      ],
      deepKnowledge: [
        "Operational strategy is an optimization problem across cost, speed, dependability, flexibility, and quality.",
        "High utilisation can improve unit costs but may raise lead times and quality failures if bottlenecks are unmanaged.",
        "JIT reduces storage cost but raises vulnerability to supplier failure and transport disruption.",
        "Process automation can raise consistency but requires capital, training, and change management."
      ],
      models: ["Critical path", "Lean toolkit", "Capacity analysis", "Flow and bottleneck mapping"],
      pitfalls: [
        "Assuming 100% utilisation is always optimal.",
        "Ignoring implementation costs of new systems.",
        "Evaluating quality without measuring customer impact."
      ],
      examTech: [
        "Use one metric to diagnose and another to validate recommendation.",
        "Evaluate impact on quality, speed, and cost simultaneously.",
        "Mention transition risk for strong AO4 judgement."
      ]
    },
    {
      code: "3.5",
      title: "Improving financial performance",
      definitions: [
        { term: "Liquidity", meaning: "Ability to meet short-term financial obligations." },
        { term: "Profitability", meaning: "Ability to generate profit from revenue or capital used." },
        { term: "Current ratio", meaning: "Current assets divided by current liabilities." },
        { term: "Acid test", meaning: "(Current assets minus inventory) divided by current liabilities." },
        { term: "ROCE", meaning: "Operating profit divided by capital employed, shown as a percentage." },
        { term: "Break-even", meaning: "Output level where total revenue equals total costs." },
        { term: "ARR", meaning: "Average annual profit as percentage of initial investment." },
        { term: "Payback", meaning: "Time needed to recover initial investment cost." }
      ],
      deepKnowledge: [
        "Financial analysis is strongest when trends, benchmarks, and qualitative context are combined.",
        "A healthy profit margin with weak liquidity can still create failure risk.",
        "Investment appraisal methods can conflict; better responses explain why one criterion should dominate.",
        "Cash-flow timing and working capital management are central in short-term survival decisions."
      ],
      models: ["Ratio analysis", "Break-even", "Investment appraisal", "Cash flow forecasting"],
      pitfalls: [
        "Quoting ratio values without interpretation.",
        "Using one-year data to make strong strategic claims.",
        "Ignoring financing constraints in recommendations."
      ],
      examTech: [
        "Always include formula, answer, and interpretation sentence.",
        "Compare against prior periods or industry where possible.",
        "Use condition-based judgement for final recommendation."
      ]
    },
    {
      code: "3.6",
      title: "Improving human resource performance",
      definitions: [
        { term: "Labour turnover", meaning: "Rate at which employees leave and are replaced over a period." },
        { term: "Absenteeism", meaning: "Time lost due to employee absence from scheduled work." },
        { term: "Human resource flow", meaning: "Movement of staff through recruitment, retention, development, and exit." },
        { term: "Workforce planning", meaning: "Forecasting future staff needs in number, skills, and timing." },
        { term: "Organisational design", meaning: "How roles, reporting lines, and responsibilities are structured." },
        { term: "Flexible working", meaning: "Employment arrangements that vary working time/location patterns." },
        { term: "Employee engagement", meaning: "Emotional commitment and discretionary effort from employees." },
        { term: "Employer relations", meaning: "The relationship and negotiation climate between management and employees." }
      ],
      deepKnowledge: [
        "HR performance links directly to operational quality, productivity, and strategic execution speed.",
        "High turnover raises recruitment and training costs and can reduce customer experience consistency.",
        "Reward, culture, and leadership style jointly shape retention and motivation outcomes.",
        "Effective HR strategy aligns workforce capability with strategic direction, not only short-term staffing gaps."
      ],
      models: ["Workforce planning cycle", "Motivation frameworks", "Organisational structures", "Employee engagement tools"],
      pitfalls: [
        "Treating HR only as a cost centre.",
        "Ignoring skills mismatch when expanding capacity.",
        "Proposing change without considering industrial relations risk."
      ],
      examTech: [
        "Use at least one HR metric in analysis.",
        "Evaluate both productivity impact and people risk.",
        "Include implementation timeline in judgement."
      ]
    },
    {
      code: "3.7",
      title: "Analysing strategic position",
      definitions: [
        { term: "Strategic position", meaning: "Current competitive and organisational standing that shapes future choices." },
        { term: "Internal audit", meaning: "Assessment of internal strengths and weaknesses, including resources and capabilities." },
        { term: "External audit", meaning: "Assessment of external opportunities and threats in the macro and market environment." },
        { term: "SWOT", meaning: "Framework combining strengths, weaknesses, opportunities, and threats." },
        { term: "Investment appraisal", meaning: "Using techniques to evaluate financial attractiveness of projects." },
        { term: "Decision tree", meaning: "Model showing choices, probabilities, outcomes, and expected values." },
        { term: "Critical path", meaning: "Longest sequence of dependent tasks determining project duration." },
        { term: "Data quality", meaning: "Reliability, relevance, and validity of information used in decision making." }
      ],
      deepKnowledge: [
        "Strong strategic analysis triangulates quantitative evidence with market and organisational insight.",
        "Data can reduce uncertainty but cannot remove it; assumptions must be explicitly tested.",
        "Strategic position is dynamic, so trend analysis matters more than one-point snapshots.",
        "An effective answer distinguishes diagnosis from recommendation."
      ],
      models: ["SWOT", "Financial diagnostics", "Decision trees", "Critical path"],
      pitfalls: [
        "Listing SWOT points without prioritising significance.",
        "Assuming expected value is always sufficient for final choice.",
        "Ignoring non-financial strategic constraints."
      ],
      examTech: [
        "Rank evidence by strategic importance.",
        "Use limitations of data for evaluation depth.",
        "State what additional information would improve confidence."
      ]
    },
    {
      code: "3.8",
      title: "Choosing strategic direction",
      definitions: [
        { term: "Strategic direction", meaning: "The chosen long-term pathway for achieving business objectives." },
        { term: "Ansoff Matrix", meaning: "Framework for market/product growth options and associated risk." },
        { term: "Porter generic strategies", meaning: "Cost leadership, differentiation, and focus strategies." },
        { term: "Strategic objectives", meaning: "Long-term measurable targets guiding major decisions." },
        { term: "Value for money", meaning: "Balance of quality and price perceived by customers." },
        { term: "Profitability strategy", meaning: "Actions aimed at improving margins and returns." },
        { term: "Market development", meaning: "Selling existing products to new markets." },
        { term: "Diversification", meaning: "Entering new markets with new products, usually higher risk." }
      ],
      deepKnowledge: [
        "Strategic direction should match resources, capabilities, risk appetite, and market conditions.",
        "High-growth options can weaken cash flow and execution quality if capability is insufficient.",
        "A coherent strategy aligns operations, finance, marketing, and HR decisions.",
        "Evaluation should test strategic fit, feasibility, and acceptability."
      ],
      models: ["Ansoff", "Porter", "SAF framework", "Strategic objective mapping"],
      pitfalls: [
        "Assuming diversification is automatically best for growth.",
        "Ignoring resource stretch and capability gaps.",
        "Choosing strategy without addressing stakeholder reaction."
      ],
      examTech: [
        "Compare strategic options against explicit criteria.",
        "Use context evidence to justify risk level.",
        "Conclude with which option is most feasible now."
      ]
    },
    {
      code: "3.9",
      title: "Strategic methods",
      definitions: [
        { term: "Organic growth", meaning: "Expansion through internal investment and capability development." },
        { term: "Mergers and acquisitions", meaning: "Combining with or buying other firms for strategic gain." },
        { term: "Internationalisation", meaning: "Expanding operations into overseas markets." },
        { term: "Innovation", meaning: "Commercially useful new ideas in products, processes, or models." },
        { term: "Digital strategy", meaning: "Use of digital tools and channels to create competitive advantage." },
        { term: "Strategic alliance", meaning: "Collaboration between firms to share capabilities or market access." },
        { term: "Franchising", meaning: "Licensing business model/brand to operators in return for fees." },
        { term: "Economies of scope", meaning: "Cost advantages from producing multiple products together." }
      ],
      deepKnowledge: [
        "Method choice should reflect speed requirements, control needs, financing capacity, and integration risk.",
        "M&A can accelerate scale but frequently underperform due to post-deal integration failures.",
        "International growth requires adaptation to legal, cultural, and demand differences.",
        "Strategic methods should be judged by sustainable value creation, not only headline growth."
      ],
      models: ["Organic vs inorganic comparison", "Market entry modes", "Innovation portfolio", "Risk-return matrix"],
      pitfalls: [
        "Recommending M&A without integration plan.",
        "Ignoring foreign exchange and legal risks in internationalisation.",
        "Assuming fast growth always means better strategic performance."
      ],
      examTech: [
        "Discuss implementation capability, not just strategic logic.",
        "Include at least one execution risk and mitigation.",
        "Judge using long-term value and control implications."
      ]
    },
    {
      code: "3.10",
      title: "Managing strategic change",
      definitions: [
        { term: "Strategic change", meaning: "Major alteration to strategy, structure, operations, or culture." },
        { term: "Change management", meaning: "Planning and leading transition from current to desired state." },
        { term: "Culture", meaning: "Shared values, beliefs, and norms shaping behaviour in an organisation." },
        { term: "Resistance to change", meaning: "Opposition from stakeholders due to risk, uncertainty, or perceived loss." },
        { term: "Lewin model", meaning: "Unfreeze, change, refreeze stages for embedding change." },
        { term: "Kotter steps", meaning: "Structured process for building urgency, coalition, and sustained change momentum." },
        { term: "Contingency planning", meaning: "Prepared alternative actions if implementation goes off track." },
        { term: "Post-implementation review", meaning: "Evaluation of outcomes versus objectives after change completion." }
      ],
      deepKnowledge: [
        "Most strategic failures come from poor execution and change adoption rather than weak intent.",
        "Communication quality and leadership credibility strongly affect resistance levels.",
        "Change should include metrics, milestones, and accountability to maintain momentum.",
        "A good evaluation distinguishes short-run disruption from long-run strategic gain."
      ],
      models: ["Lewin", "Kotter", "Force-field analysis", "Change readiness assessment"],
      pitfalls: [
        "Underestimating cultural barriers.",
        "No contingency plan for implementation delays.",
        "Judging change too early without outcome metrics."
      ],
      examTech: [
        "Evaluate both people and process dimensions of change.",
        "Use implementation milestones in recommendations.",
        "Final judgement should state most critical success factor."
      ]
    }
  ];

  const formulas = [
    { name: "Revenue", expandedName: "Revenue", formula: "Revenue = Price x Quantity sold", topic: "3.1/3.3", examUse: "Sales and pricing decisions" },
    { name: "Total costs", expandedName: "Total Costs", formula: "Total costs = Fixed costs + Variable costs", topic: "3.4/3.5", examUse: "Cost diagnostics" },
    { name: "Profit", expandedName: "Profit", formula: "Profit = Revenue - Total costs", topic: "3.1/3.5", examUse: "Profitability judgment" },
    { name: "Average cost", expandedName: "Average Cost", formula: "Average cost = Total costs / Output", topic: "3.4", examUse: "Economies/diseconomies" },
    { name: "Contribution per unit", expandedName: "Contribution Per Unit", formula: "Selling price - Variable cost per unit", topic: "3.3/3.5", examUse: "Break-even and pricing" },
    { name: "Labour productivity", expandedName: "Labour Productivity", formula: "Output / Number of employees", topic: "3.4", examUse: "Operational efficiency" },
    { name: "Capacity utilisation", expandedName: "Capacity Utilisation", formula: "Current output / Maximum output x 100", topic: "3.4", examUse: "Operational pressure" },
    { name: "Break-even output", expandedName: "Break-even Output", formula: "Fixed costs / Contribution per unit", topic: "3.5", examUse: "Viability" },
    { name: "Margin of safety", expandedName: "Margin of Safety", formula: "Actual output - Break-even output", topic: "3.5", examUse: "Demand-risk buffer" },
    { name: "Gross profit margin", expandedName: "Gross Profit Margin", formula: "Gross profit / Revenue x 100", topic: "3.5", examUse: "Core profitability" },
    { name: "Operating profit margin", expandedName: "Operating Profit Margin", formula: "Operating profit / Revenue x 100", topic: "3.5", examUse: "Operating performance" },
    { name: "ROCE", expandedName: "Return on Capital Employed", formula: "Operating profit / Capital employed x 100", topic: "3.5", examUse: "Return on long-term funds" },
    { name: "Current ratio", expandedName: "Current Ratio", formula: "Current assets / Current liabilities", topic: "3.5", examUse: "Liquidity" },
    { name: "Acid test", expandedName: "Acid Test Ratio", formula: "(Current assets - Inventory) / Current liabilities", topic: "3.5", examUse: "Immediate liquidity" },
    { name: "PED", expandedName: "Price Elasticity of Demand", formula: "% change in quantity demanded / % change in price", topic: "3.3", examUse: "Pricing strategy" },
    { name: "YED", expandedName: "Income Elasticity of Demand", formula: "% change in demand / % change in income", topic: "3.3", examUse: "Demand forecasting" },
    { name: "Market share", expandedName: "Market Share", formula: "Firm sales / Total market sales x 100", topic: "3.3", examUse: "Competitive position" },
    { name: "ARR", expandedName: "Average Rate of Return", formula: "Average annual profit / Initial investment x 100", topic: "3.5", examUse: "Investment appraisal" },
    { name: "Payback period", expandedName: "Payback Period", formula: "Initial investment / Annual net cash inflow", topic: "3.5", examUse: "Investment speed" },
    { name: "Percentage change", expandedName: "Percentage Change", formula: "(New value - Old value) / Old value x 100", topic: "All", examUse: "Trend analysis" },
    { name: "Unit cost", expandedName: "Unit Cost", formula: "Total cost / Number of units", topic: "3.4/3.5", examUse: "Operations and pricing" },
    { name: "Average revenue", expandedName: "Average Revenue", formula: "Total revenue / Quantity sold", topic: "3.3", examUse: "Market and pricing analysis" }
  ];

  const modelsDetailed = [
    {
      name: "Ansoff Matrix",
      topic: "3.1/3.3/3.8",
      whatItIs: "A growth model that compares whether a business is using existing or new products and existing or new markets.",
      whatItsFor: "It is for choosing a growth strategy and showing how risky that growth choice is likely to be.",
      whyNeeded: "Businesses do not just want growth; they want growth that matches cash, skills, brand strength, and risk appetite. Ansoff helps you explain why some routes are safer and others stretch the business too far.",
      whenToUse: [
        "When a case study asks whether a business should grow, expand, or enter a new market.",
        "When comparing two strategic options with different levels of risk.",
        "When building AO4 judgement about whether a growth plan is realistic."
      ],
      quadrants: ["Market penetration", "Market development", "Product development", "Diversification"],
      partBreakdown: [
        {
          part: "Market penetration",
          explanation: "Existing products sold to existing markets. This is usually the lowest-risk route because the business already knows the product and customer base. Typical moves include more promotion, sharper pricing, or better distribution."
        },
        {
          part: "Market development",
          explanation: "Existing products sold to new markets. The product stays familiar, but the business takes on market risk because customers, regions, or channels are less known."
        },
        {
          part: "Product development",
          explanation: "New products sold to existing markets. Customer understanding is stronger, but product development costs and launch risk rise."
        },
        {
          part: "Diversification",
          explanation: "New products sold to new markets. This is usually the riskiest route because both the offer and the market are unfamiliar, so failure risk and resource stretch are highest."
        }
      ],
      howToUse: [
        "Identify whether the business is changing product, market, or both.",
        "Judge risk by capability stretch, cost, and uncertainty.",
        "Link the chosen route to objectives such as growth, share, or profit."
      ],
      examExample: "If a coffee chain launches its existing drinks in a new country, that is market development. If it starts selling branded energy drinks in supermarkets abroad, that is diversification.",
      strengths: ["Simple structure", "Good for comparing risk", "Works well in evaluation paragraphs"],
      limitations: ["Risk is not identical for every firm", "Ignores implementation detail unless you add it", "Does not measure financial feasibility on its own"],
      examTrap: "Do not just name the quadrant; explain why it fits the business context and risk appetite."
    },
    {
      name: "Boston Matrix",
      topic: "3.3",
      whatItIs: "A portfolio model that classifies products by market growth and relative market share.",
      whatItsFor: "It is for deciding where to invest, where to hold, and where to reduce support across a product portfolio.",
      whyNeeded: "A business with several products cannot fund everything equally. The Boston Matrix helps managers decide which products generate cash, which need cash, and which may be dragging the portfolio down.",
      whenToUse: [
        "When a business has multiple brands or products and must allocate limited resources.",
        "When judging whether to build, hold, harvest, or divest a product.",
        "When linking marketing strategy to finance and cash flow."
      ],
      quadrants: ["Stars", "Question marks", "Cash cows", "Dogs"],
      partBreakdown: [
        {
          part: "Stars",
          explanation: "High market share in a high-growth market. Stars usually need continued investment to defend position, but they may become future cash cows."
        },
        {
          part: "Question marks",
          explanation: "Low market share in a high-growth market. They have potential, but the business must decide whether it can afford the investment needed to gain share."
        },
        {
          part: "Cash cows",
          explanation: "High market share in a low-growth market. These products often generate strong positive cash flow and can fund other parts of the portfolio."
        },
        {
          part: "Dogs",
          explanation: "Low market share in a low-growth market. These products may offer weak returns, although some are kept for strategic reasons such as completing a range."
        }
      ],
      howToUse: [
        "Place the product using growth and share evidence.",
        "Explain likely cash generation and investment need.",
        "Recommend build, hold, harvest, or divest with context."
      ],
      examExample: "A best-selling detergent in a mature market may be a cash cow, while a new plant-based snack with low share in a fast-growing category may be a question mark.",
      strengths: ["Useful for portfolio balance", "Encourages resource prioritisation", "Good for linking strategy and finance"],
      limitations: ["Relative share can be hard to measure", "Some dogs may still be strategically useful", "Oversimplifies product interactions"],
      examTrap: "Avoid assuming every dog should be removed immediately."
    },
    {
      name: "Decision Tree",
      topic: "3.2/3.7",
      whatItIs: "A quantitative decision-making model that maps options, possible outcomes, and their probabilities.",
      whatItsFor: "It is for comparing risky choices using expected value while still discussing wider business judgement.",
      whyNeeded: "Managers often face uncertain outcomes. A decision tree gives a structured way to compare routes instead of relying only on instinct, but it also reminds you that numbers depend on assumptions.",
      whenToUse: [
        "When a business must choose between investment or strategic options with different probabilities.",
        "When the exam gives outcome values and chances of success or failure.",
        "When you want to evaluate whether the highest expected value is worth the risk."
      ],
      quadrants: ["Decision node", "Chance node", "Outcome", "Expected value"],
      partBreakdown: [
        {
          part: "Decision node",
          explanation: "The square where the business chooses between options, such as launch Product A or Product B."
        },
        {
          part: "Chance node",
          explanation: "The circle where uncertainty appears, usually with probabilities attached to different outcomes."
        },
        {
          part: "Outcome",
          explanation: "The financial result at the end of a branch, often a profit, revenue, or net gain/loss figure."
        },
        {
          part: "Expected value",
          explanation: "Calculated by multiplying each outcome by its probability and adding the totals. It shows the average expected return over time, not a guaranteed result."
        }
      ],
      howToUse: [
        "Calculate expected values for each route.",
        "Compare quantitative result with qualitative risk factors.",
        "State whether the firm should maximise expected value or reduce downside risk."
      ],
      examExample: "If Option A has an expected value of 120,000 pounds and Option B has 100,000 pounds, Option A looks stronger numerically, but Option B could still be chosen if it carries far less downside risk.",
      strengths: ["Clear structure", "Makes probabilities explicit", "Useful for comparing strategic alternatives"],
      limitations: ["Probabilities may be unreliable", "Can ignore non-financial impact", "Expected value can hide downside risk"],
      examTrap: "Expected value is not automatically the best final choice."
    },
    {
      name: "Critical Path Analysis",
      topic: "3.2/3.4/3.7",
      whatItIs: "A project-planning model that maps activities, dependencies, and the longest sequence of tasks.",
      whatItsFor: "It is for managing timing, spotting tasks that cannot slip, and reducing the risk of delayed launches or change programmes.",
      whyNeeded: "Large projects fail when managers do not know which tasks are crucial. Critical path analysis shows where delay matters most, helping managers focus resources on the tasks that control total project length.",
      whenToUse: [
        "When analysing a launch, relocation, IT rollout, or operational change project.",
        "When a case study includes timing, deadlines, or dependency chains.",
        "When judging whether a firm can speed up implementation."
      ],
      quadrants: ["Activities", "Dependencies", "Float", "Critical path"],
      partBreakdown: [
        {
          part: "Activities",
          explanation: "The individual jobs that must be completed, such as staff training, equipment installation, or supplier approval."
        },
        {
          part: "Dependencies",
          explanation: "The links showing which tasks must finish before another task can begin."
        },
        {
          part: "Float",
          explanation: "The spare time available on a non-critical activity before the overall project is delayed. More float means greater flexibility."
        },
        {
          part: "Critical path",
          explanation: "The longest chain of dependent activities. Any delay on this path delays the whole project unless corrective action is taken."
        }
      ],
      howToUse: [
        "Work out earliest start/finish and latest start/finish.",
        "Identify float and the critical path.",
        "Explain how delays on critical tasks affect launch or implementation."
      ],
      examExample: "If staff training sits on the critical path, a delay in trainers arriving could push back the whole store opening date.",
      strengths: ["Improves timing control", "Highlights bottlenecks", "Useful for implementation evaluation"],
      limitations: ["Assumes task durations are predictable", "Can become complex in large projects", "Does not solve resource shortages by itself"],
      examTrap: "Float matters only on non-critical tasks; do not confuse it with spare capacity everywhere."
    },
    {
      name: "Maslow Hierarchy of Needs",
      topic: "3.2/3.6",
      whatItIs: "A motivation model arguing that people are driven by different layers of needs, from basic survival to fulfilment.",
      whatItsFor: "It is for explaining why different employees may respond to different reward and management approaches.",
      whyNeeded: "Managers often assume pay solves every motivation problem. Maslow helps show that employees may also care about security, belonging, recognition, and personal growth, especially in different job roles or career stages.",
      whenToUse: [
        "When evaluating reward systems, leadership, or job design.",
        "When a business has issues with turnover, morale, or engagement.",
        "When explaining why one motivation method may work better than another."
      ],
      quadrants: ["Physiological", "Safety", "Social", "Esteem", "Self-actualisation"],
      partBreakdown: [
        {
          part: "Physiological",
          explanation: "Basic survival needs such as wages sufficient for food, housing, and rest. If these are not met, higher-level motivation is unlikely to matter much."
        },
        {
          part: "Safety",
          explanation: "Security needs such as safe working conditions, predictable income, and job stability."
        },
        {
          part: "Social",
          explanation: "The need to belong, be accepted, and feel part of a team or workplace culture."
        },
        {
          part: "Esteem",
          explanation: "The need for status, recognition, responsibility, and respect from others."
        },
        {
          part: "Self-actualisation",
          explanation: "The desire to achieve full potential through challenge, creativity, autonomy, and growth."
        }
      ],
      howToUse: [
        "Link different rewards or job design choices to the relevant need.",
        "Explain why the workforce profile changes which needs dominate.",
        "Evaluate whether intrinsic or extrinsic methods are more appropriate."
      ],
      examExample: "A warehouse workforce facing insecure hours may value safety needs first, while skilled designers may respond more strongly to esteem and self-actualisation through autonomy and recognition.",
      strengths: ["Easy to apply", "Helps structure motivation answers", "Good for contrasting reward systems"],
      limitations: ["Needs may not follow a strict sequence", "Employees differ significantly", "Can be too general without context"],
      examTrap: "Do not describe all five levels without applying them to the business."
    },
    {
      name: "Herzberg Two-Factor Theory",
      topic: "3.2/3.6",
      whatItIs: "A motivation theory separating factors that prevent dissatisfaction from factors that actively create satisfaction.",
      whatItsFor: "It is for diagnosing whether a motivation problem comes from poor basic conditions or from jobs that lack challenge and meaning.",
      whyNeeded: "Managers often raise pay and expect performance to jump. Herzberg helps explain why removing dissatisfaction is not the same as creating real motivation.",
      whenToUse: [
        "When analysing poor morale, turnover, or absenteeism.",
        "When evaluating job enrichment, recognition, and pay changes.",
        "When comparing short-term fixes with deeper cultural solutions."
      ],
      quadrants: ["Hygiene factors", "Motivators", "Dissatisfaction", "Satisfaction"],
      partBreakdown: [
        {
          part: "Hygiene factors",
          explanation: "Basics such as pay, supervision, job security, and working conditions. If these are poor, staff become dissatisfied, but improving them does not always create strong motivation."
        },
        {
          part: "Motivators",
          explanation: "Intrinsic factors such as achievement, recognition, responsibility, and advancement that make work meaningful and satisfying."
        },
        {
          part: "Dissatisfaction",
          explanation: "The negative state created when hygiene factors are weak, such as unfair pay or unsafe conditions."
        },
        {
          part: "Satisfaction",
          explanation: "The positive state created when motivators are present, such as praise, autonomy, and promotion opportunities."
        }
      ],
      howToUse: [
        "Explain whether the issue is low satisfaction or active dissatisfaction.",
        "Recommend hygiene fixes and/or motivator improvements.",
        "Link to turnover, absenteeism, or productivity."
      ],
      examExample: "If staff leave because rotas are unpredictable, that is mainly a hygiene problem. If they stay but give low effort because jobs are repetitive, motivators may be the real issue.",
      strengths: ["Good diagnostic logic", "Useful for HR performance analysis", "Encourages richer evaluation than pay-only answers"],
      limitations: ["Not all workers respond the same way", "Some factors can overlap", "Difficult to measure directly"],
      examTrap: "Higher pay may remove dissatisfaction but not necessarily create strong motivation."
    },
    {
      name: "Stakeholder Mapping",
      topic: "3.1",
      whatItIs: "A model that classifies stakeholders by power and interest so managers know who matters most in a decision.",
      whatItsFor: "It is for prioritising communication, understanding likely support or resistance, and justifying whose views should carry most weight.",
      whyNeeded: "Businesses face competing pressures from owners, employees, customers, lenders, and communities. Stakeholder mapping helps explain whose influence is strongest and why strategic decisions may create conflict.",
      whenToUse: [
        "When judging which stakeholder objective should dominate.",
        "When a business is facing change, takeover, closure, or rapid growth.",
        "When building a final judgement about acceptability."
      ],
      quadrants: ["High power high interest", "High power low interest", "Low power high interest", "Low power low interest"],
      partBreakdown: [
        {
          part: "High power high interest",
          explanation: "These stakeholders matter most and must be managed closely because they can strongly influence the outcome and care deeply about it."
        },
        {
          part: "High power low interest",
          explanation: "These groups can affect the decision but may not watch every detail, so they must be kept satisfied."
        },
        {
          part: "Low power high interest",
          explanation: "These stakeholders care a lot but have limited direct influence, so they should be kept informed."
        },
        {
          part: "Low power low interest",
          explanation: "These groups need only minimal effort unless the situation changes and their power or interest rises."
        }
      ],
      howToUse: [
        "Identify who has the strongest influence over the decision.",
        "Explain how objectives may conflict.",
        "Judge which stakeholder matters most in the given context."
      ],
      examExample: "In a debt-funded expansion, lenders may become high power high interest because they can restrict finance and care about repayment risk.",
      strengths: ["Sharpens evaluation", "Good for objective conflicts", "Supports justified judgement"],
      limitations: ["Stakeholder power changes over time", "Some interest is hard to observe", "Can oversimplify relationships"],
      examTrap: "Do not assume shareholders are always the most important stakeholder."
    },
    {
      name: "Porter Generic Strategies",
      topic: "3.1/3.8",
      whatItIs: "A strategy model showing how a business can gain competitive advantage through cost leadership, differentiation, or focus.",
      whatItsFor: "It is for explaining how a business plans to win customers against rivals.",
      whyNeeded: "A strategy only works if the business has a clear basis for competing. Porter helps you explain whether the firm is trying to win on low cost, uniqueness, or serving a narrow niche especially well.",
      whenToUse: [
        "When evaluating strategic direction or marketing positioning.",
        "When comparing broad-market and niche approaches.",
        "When discussing how operations and marketing must align with strategy."
      ],
      quadrants: ["Cost leadership", "Differentiation", "Cost focus", "Differentiation focus"],
      partBreakdown: [
        {
          part: "Cost leadership",
          explanation: "The business aims to be the lowest-cost producer in a broad market, allowing lower prices or stronger margins."
        },
        {
          part: "Differentiation",
          explanation: "The business offers something customers see as distinct, such as stronger design, quality, service, or brand image."
        },
        {
          part: "Cost focus",
          explanation: "The business targets a niche segment and serves it at lower cost than rivals."
        },
        {
          part: "Differentiation focus",
          explanation: "The business targets a niche segment with a highly tailored and distinctive offer."
        }
      ],
      howToUse: [
        "Identify how the business is trying to win customers.",
        "Explain operational and marketing implications.",
        "Evaluate whether the strategy is sustainable in the market context."
      ],
      examExample: "A budget airline mainly follows cost leadership, while a luxury skincare brand may rely on differentiation through image, ingredients, and service.",
      strengths: ["Clear strategic comparison", "Links operations and marketing", "Good for long-mark strategy evaluation"],
      limitations: ["Firms may blend strategies", "Competitive environments shift", "Does not show implementation cost by itself"],
      examTrap: "Do not say differentiation always means higher price; it means perceived uniqueness."
    },
    {
      name: "SWOT Analysis",
      topic: "3.7",
      whatItIs: "A diagnostic model that combines internal and external analysis in one structure.",
      whatItsFor: "It is for summarising the business position before recommending strategy.",
      whyNeeded: "Businesses need to separate what they control internally from what is happening outside them. SWOT helps stop messy analysis and gives a simple structure for moving from evidence to recommendation.",
      whenToUse: [
        "When a case gives lots of mixed evidence about a business position.",
        "When deciding whether a strategic option fits the business situation.",
        "When you want to organise analysis before judgement."
      ],
      quadrants: ["Strengths", "Weaknesses", "Opportunities", "Threats"],
      partBreakdown: [
        {
          part: "Strengths",
          explanation: "Internal advantages such as strong finance, loyal customers, patents, or efficient operations."
        },
        {
          part: "Weaknesses",
          explanation: "Internal disadvantages such as skill shortages, weak cash flow, low capacity, or poor brand awareness."
        },
        {
          part: "Opportunities",
          explanation: "External positives such as market growth, weaker rivals, regulatory change, or new technology."
        },
        {
          part: "Threats",
          explanation: "External risks such as inflation, new entrants, substitution, legal pressure, or falling demand."
        }
      ],
      howToUse: [
        "Separate internal and external evidence correctly.",
        "Prioritise the most strategically important points.",
        "Convert the diagnosis into a recommendation."
      ],
      examExample: "A strong brand is a strength, but rising raw material prices are a threat. A good answer then explains how strategy should use the strength to respond to the threat.",
      strengths: ["Simple diagnostic summary", "Good for synthesis", "Useful for turning evidence into strategy"],
      limitations: ["Can become descriptive", "Not all factors matter equally", "Needs evidence to be credible"],
      examTrap: "A SWOT list alone is not analysis; explain why the point matters."
    },
    {
      name: "SAF Framework",
      topic: "3.8",
      whatItIs: "A framework for testing whether a strategic option is suitable, acceptable, and feasible.",
      whatItsFor: "It is for evaluating strategic choices in a balanced way instead of focusing on just growth or profit.",
      whyNeeded: "A strategy can look exciting but still fail if it does not fit the environment, if stakeholders reject it, or if the business lacks finance and skills. SAF gives a disciplined way to test all three issues.",
      whenToUse: [
        "When comparing strategic options such as growth routes, market entry methods, or restructuring plans.",
        "When writing the evaluation and final judgement in long-mark questions.",
        "When checking if a strategy is realistic rather than just attractive."
      ],
      quadrants: ["Suitability", "Acceptability", "Feasibility"],
      partBreakdown: [
        {
          part: "Suitability",
          explanation: "Does the strategy match the business position, objectives, and market conditions? A suitable strategy solves the right problem."
        },
        {
          part: "Acceptability",
          explanation: "Will key stakeholders tolerate the risk, return, and consequences? This includes owners, staff, lenders, and customers."
        },
        {
          part: "Feasibility",
          explanation: "Can the business actually deliver it with its finance, people, systems, and time available?"
        }
      ],
      howToUse: [
        "Test whether the strategy fits the environment and objectives.",
        "Judge stakeholder tolerance for the risk/return profile.",
        "Assess whether finance, skills, and operations can deliver it."
      ],
      examExample: "Buying a rival may be suitable for fast growth, but if debt levels are already high it may fail the feasibility test and worry investors on acceptability too.",
      strengths: ["Excellent evaluation structure", "Balances strategy and implementation", "Supports judgement paragraphs well"],
      limitations: ["Criteria can overlap", "Needs detailed context to apply strongly", "Still requires judgement on trade-offs"],
      examTrap: "Feasible does not mean optimal; compare all three dimensions."
    },
    {
      name: "STP",
      topic: "3.3",
      whatItIs: "A marketing model built around segmentation, targeting, and positioning.",
      whatItsFor: "It is for deciding which customers to serve and how the business should appear in their minds.",
      whyNeeded: "A-Level Business marketing is not about selling to everyone. STP helps show that stronger marketing comes from focusing on the right segment and building a clear position instead of using generic promotion.",
      whenToUse: [
        "When evaluating marketing strategy or market research.",
        "When a firm is trying to improve sales, share, or brand strength.",
        "When judging whether a product should go mass-market or niche."
      ],
      quadrants: ["Segmentation", "Targeting", "Positioning"],
      partBreakdown: [
        { part: "Segmentation", explanation: "Splitting the market into groups with similar needs or characteristics, such as age, income, lifestyle, or buying behaviour." },
        { part: "Targeting", explanation: "Choosing which segment or segments the business will actively serve based on profitability, size, and fit with resources." },
        { part: "Positioning", explanation: "Creating a clear place in the customer mind, such as value, premium quality, convenience, or innovation." }
      ],
      howToUse: ["Identify the likely segment.", "Judge whether the segment is attractive and profitable.", "Explain how the product is positioned against rivals."],
      examExample: "A low-sugar energy drink aimed at gym users shows segmentation by lifestyle, targeting a niche, and positioning around health performance rather than mass appeal.",
      strengths: ["Clear marketing structure", "Links research to strategy", "Useful for context-rich evaluation"],
      limitations: ["Segments may change quickly", "Targeting errors can be expensive", "Positioning must be backed by the product itself"],
      examTrap: "Do not define STP without showing which specific segment and position fit the case."
    },
    {
      name: "Marketing Mix (7Ps)",
      topic: "3.3",
      whatItIs: "A model showing the main marketing decisions around product, price, place, promotion, people, process, and physical evidence.",
      whatItsFor: "It is for planning how a business will market and deliver value to customers.",
      whyNeeded: "In A-Level Business, marketing decisions need to fit together. The 7Ps stop students treating price or promotion in isolation and help explain how the full offer drives demand.",
      whenToUse: [
        "When analysing how to improve marketing performance.",
        "When discussing service businesses where people and process matter.",
        "When evaluating whether a strategy matches the target market."
      ],
      quadrants: ["Product", "Price", "Place", "Promotion", "People", "Process", "Physical evidence"],
      partBreakdown: [
        { part: "Product", explanation: "The features, quality, design, and branding of what is sold." },
        { part: "Price", explanation: "The pricing strategy and whether it supports demand, margin, and positioning." },
        { part: "Place", explanation: "How the product reaches customers, such as stores, e-commerce, or intermediaries." },
        { part: "Promotion", explanation: "How the business communicates with the target market, including advertising and sales promotion." },
        { part: "People", explanation: "Staff quality and interaction, especially important in service businesses." },
        { part: "Process", explanation: "How the service is delivered and how smooth or convenient the customer experience is." },
        { part: "Physical evidence", explanation: "Visible signals of quality such as store design, packaging, website, or environment." }
      ],
      howToUse: ["Pick the 2 or 3 Ps most important in the case.", "Show how the mix fits the target segment.", "Evaluate whether the mix is consistent and affordable."],
      examExample: "A premium hotel may use high prices, strong physical evidence, and highly trained people to reinforce a luxury position.",
      strengths: ["Very practical", "Easy to apply to case studies", "Shows links between marketing decisions"],
      limitations: ["Can become descriptive", "Not every P matters equally", "Needs customer context to be convincing"],
      examTrap: "Do not list all 7Ps if only two are strategically decisive in the case."
    },
    {
      name: "Lean Toolkit",
      topic: "3.4",
      whatItIs: "A collection of lean production methods used to reduce waste and improve flow.",
      whatItsFor: "It is for improving efficiency, cutting unnecessary cost, and raising operational performance.",
      whyNeeded: "Operations questions often focus on waste, delays, and poor quality. Lean tools help explain how a business can simplify processes without just cutting labour blindly.",
      whenToUse: ["When analysing cost reduction or efficiency.", "When evaluating operational improvement plans.", "When discussing waste, stock, or slow workflow."],
      quadrants: ["Kaizen", "Just in Time", "Time-based management", "Cell production"],
      partBreakdown: [
        { part: "Kaizen", explanation: "Continuous incremental improvement driven by small ongoing changes rather than one big redesign." },
        { part: "Just in Time", explanation: "Receiving or producing materials only when needed to reduce inventory and storage cost." },
        { part: "Time-based management", explanation: "Reducing the time taken to complete activities so the business becomes faster and more responsive." },
        { part: "Cell production", explanation: "Organising workers and machines into self-contained units to improve flow and team responsibility." }
      ],
      howToUse: ["Identify the waste problem first.", "Select the lean tool that addresses that waste.", "Evaluate risk such as supplier failure or staff resistance."],
      examExample: "A manufacturer with high storage cost may use JIT, but only if suppliers are reliable enough to avoid stoppages.",
      strengths: ["Strong operational focus", "Links cost and quality", "Useful for evaluation of efficiency plans"],
      limitations: ["Can raise supply risk", "Requires staff buy-in", "Not all processes suit lean equally"],
      examTrap: "Do not assume lean always reduces cost without any risk to quality or continuity."
    },
    {
      name: "Capacity Analysis",
      topic: "3.4",
      whatItIs: "A model for judging how fully a business is using its productive resources.",
      whatItsFor: "It is for assessing whether the business has spare capacity, bottlenecks, or over-stretched operations.",
      whyNeeded: "Capacity is central in A-Level operations because too little capacity loses sales, while too much raises unit costs. This model helps explain trade-offs rather than chasing 100% utilisation blindly.",
      whenToUse: ["When analysing operational efficiency.", "When a business faces strong demand growth or idle resources.", "When judging expansion, outsourcing, or process redesign."],
      quadrants: ["Current output", "Maximum output", "Capacity utilisation", "Spare capacity"],
      partBreakdown: [
        { part: "Current output", explanation: "What the business is actually producing now." },
        { part: "Maximum output", explanation: "The highest realistic output the business can produce with current resources." },
        { part: "Capacity utilisation", explanation: "The percentage of maximum output currently being used." },
        { part: "Spare capacity", explanation: "Unused productive ability that could allow extra output without immediate expansion." }
      ],
      howToUse: ["Calculate capacity utilisation.", "Explain whether the result shows underuse or strain.", "Evaluate effects on unit cost, quality, and flexibility."],
      examExample: "A firm running at 95% utilisation may lower average cost, but it may also face longer lead times and more defects.",
      strengths: ["Simple and numerical", "Highly relevant to operations questions", "Supports clear interpretation"],
      limitations: ["One number does not show where bottlenecks sit", "High utilisation is not always efficient", "Seasonal demand may distort the picture"],
      examTrap: "Do not say higher capacity utilisation is always better."
    },
    {
      name: "Flow and Bottleneck Mapping",
      topic: "3.4",
      whatItIs: "A process model that tracks how work moves through a business and where delays build up.",
      whatItsFor: "It is for identifying the weakest stage in production or service delivery.",
      whyNeeded: "Operations problems often come from one weak stage rather than the entire system. Bottleneck mapping helps explain where output, quality, or speed is being constrained.",
      whenToUse: ["When analysing delays, queues, and poor throughput.", "When judging process redesign or automation.", "When linking operational weaknesses to customer satisfaction."],
      quadrants: ["Input", "Process stages", "Bottleneck", "Output"],
      partBreakdown: [
        { part: "Input", explanation: "Resources entering the process such as materials, labour, or customer requests." },
        { part: "Process stages", explanation: "The sequence of activities that turn inputs into finished output." },
        { part: "Bottleneck", explanation: "The slowest or most constrained stage, which limits the entire system's output." },
        { part: "Output", explanation: "The final goods or services produced after the process is complete." }
      ],
      howToUse: ["Map the stages.", "Identify where work backs up.", "Recommend changes that relieve the constraint."],
      examExample: "If packing is slower than production, finished goods pile up and the packing stage becomes the bottleneck.",
      strengths: ["Very practical", "Shows root causes", "Good for operational diagnosis"],
      limitations: ["May oversimplify complex operations", "Bottlenecks can shift over time", "Needs good process data"],
      examTrap: "Do not recommend broad expansion if only one stage is actually constraining output."
    },
    {
      name: "Ratio Analysis",
      topic: "3.5",
      whatItIs: "A financial model using ratios to judge profitability, liquidity, and efficiency.",
      whatItsFor: "It is for turning raw financial statements into interpretable performance indicators.",
      whyNeeded: "A-Level Business finance questions reward interpretation, not just calculation. Ratio analysis helps explain whether a firm is healthy, risky, efficient, or weakening over time.",
      whenToUse: ["When analysing financial performance.", "When comparing years or competitors.", "When judging whether to invest, lend, or change strategy."],
      quadrants: ["Profitability ratios", "Liquidity ratios", "Efficiency ratios", "Trend comparison"],
      partBreakdown: [
        { part: "Profitability ratios", explanation: "Measures such as gross profit margin, operating profit margin, and ROCE that show how well the firm converts sales and capital into profit." },
        { part: "Liquidity ratios", explanation: "Measures such as current ratio and acid test that show whether short-term bills can be paid." },
        { part: "Efficiency ratios", explanation: "Ratios and metrics that show how effectively resources are being used, such as stock turnover or asset use where available." },
        { part: "Trend comparison", explanation: "Comparing ratios over time or against industry averages to judge whether performance is genuinely strong or weak." }
      ],
      howToUse: ["Calculate the ratio accurately.", "Interpret what the result means.", "Compare and evaluate rather than stopping at one number."],
      examExample: "A current ratio of 0.8 may suggest liquidity pressure, but the judgement should improve if inventory is low and cash inflows are stable.",
      strengths: ["Quantitative and evaluative", "Core to A-Level finance", "Supports evidence-led judgement"],
      limitations: ["Can mislead if used alone", "Different industries have different norms", "Historic data may not predict future performance"],
      examTrap: "Never quote a ratio without explaining whether it is strong, weak, improving, or dangerous."
    },
    {
      name: "Break-even Analysis",
      topic: "3.5",
      whatItIs: "A model showing the sales level needed for total revenue to equal total costs.",
      whatItsFor: "It is for judging viability, risk, and the effect of cost or price changes on profit.",
      whyNeeded: "Break-even is one of the most exam-heavy A-Level Business tools because it links costs, price, output, and risk in one clear structure.",
      whenToUse: ["When evaluating a new product or investment.", "When discussing pricing or cost changes.", "When judging demand risk through margin of safety."],
      quadrants: ["Fixed costs", "Variable costs", "Break-even output", "Margin of safety"],
      partBreakdown: [
        { part: "Fixed costs", explanation: "Costs that do not change directly with output in the short run, such as rent or salaried management." },
        { part: "Variable costs", explanation: "Costs that rise as more units are produced, such as materials or hourly labour." },
        { part: "Break-even output", explanation: "The number of units needed to cover all costs with zero profit." },
        { part: "Margin of safety", explanation: "The gap between actual sales and break-even sales, showing the buffer before losses begin." }
      ],
      howToUse: ["Calculate contribution.", "Find break-even output.", "Use margin of safety to judge risk."],
      examExample: "A business may break even at 5,000 units, but if expected sales are only 5,400 units the margin of safety is thin and risk remains high.",
      strengths: ["Exam-friendly", "Highly visual and quantitative", "Good for risk evaluation"],
      limitations: ["Assumes costs and price stay constant", "Ignores qualitative issues", "Can oversimplify real-world demand"],
      examTrap: "Do not stop after the break-even figure; explain whether the result actually looks safe."
    },
    {
      name: "Investment Appraisal",
      topic: "3.5/3.7",
      whatItIs: "A set of financial methods used to judge whether an investment project is worthwhile.",
      whatItsFor: "It is for comparing project attractiveness using return, speed of payback, and sometimes risk.",
      whyNeeded: "Major decisions such as expansion or equipment purchase need more than instinct. Investment appraisal gives structured evidence, but the best A-Level answers also explain each method's weaknesses.",
      whenToUse: ["When comparing capital projects.", "When a case provides cash flows or profit forecasts.", "When evaluating risky growth or expansion decisions."],
      quadrants: ["ARR", "Payback", "Expected value", "Qualitative judgement"],
      partBreakdown: [
        { part: "ARR", explanation: "Shows average annual profit as a percentage of initial investment. Useful for profitability, but it ignores timing of cash flows." },
        { part: "Payback", explanation: "Shows how quickly the initial investment is recovered in cash terms. Useful for risk and liquidity, but it ignores returns after payback." },
        { part: "Expected value", explanation: "Combines probabilities and outcomes to estimate an average expected return under uncertainty." },
        { part: "Qualitative judgement", explanation: "Non-financial issues such as skills, strategic fit, and market risk that may override the numeric result." }
      ],
      howToUse: ["Calculate the methods given.", "Compare what each suggests.", "Explain which criterion matters most in this business context."],
      examExample: "A project with fast payback but low ARR may still be chosen if the business has tight cash flow and high market uncertainty.",
      strengths: ["Strong for investment questions", "Encourages comparison", "Links finance to strategy"],
      limitations: ["Forecasts may be wrong", "Methods can conflict", "Numbers alone do not guarantee the right choice"],
      examTrap: "Do not say the highest ARR automatically wins if cash flow pressure is the bigger issue."
    },
    {
      name: "Cash Flow Forecasting",
      topic: "3.5",
      whatItIs: "A time-based financial model predicting future cash inflows, outflows, and closing balances.",
      whatItsFor: "It is for spotting likely cash shortages before they happen.",
      whyNeeded: "Profit does not guarantee survival. Cash flow forecasting is essential in A-Level Business because firms can fail even while profitable if cash arrives too late.",
      whenToUse: ["When analysing short-term financial control.", "When judging seasonal businesses or rapid growth.", "When recommending finance or working-capital actions."],
      quadrants: ["Opening balance", "Cash inflows", "Cash outflows", "Closing balance"],
      partBreakdown: [
        { part: "Opening balance", explanation: "The amount of cash the business starts the period with." },
        { part: "Cash inflows", explanation: "Money coming in, such as sales receipts, loans, or asset sales." },
        { part: "Cash outflows", explanation: "Money going out, such as wages, rent, tax, or supplier payments." },
        { part: "Closing balance", explanation: "The remaining cash after inflows and outflows are combined." }
      ],
      howToUse: ["Track how the balance changes over time.", "Identify periods of negative cash flow.", "Recommend actions such as overdrafts, delaying spending, or chasing debtors."],
      examExample: "A retailer may be profitable overall but still need an overdraft in low-sales months when wages and rent still have to be paid.",
      strengths: ["Very practical", "Excellent for short-term planning", "Supports realistic recommendations"],
      limitations: ["Forecasts can be inaccurate", "Unexpected events can disrupt the plan", "Does not directly measure profitability"],
      examTrap: "Do not confuse an improving profit figure with a healthy cash position."
    },
    {
      name: "Workforce Planning Cycle",
      topic: "3.6",
      whatItIs: "A model for forecasting staffing needs and matching them to future business requirements.",
      whatItsFor: "It is for making sure the right number of employees with the right skills are available at the right time.",
      whyNeeded: "HR performance in A-Level Business depends on labour supply, skills, and retention. Workforce planning helps explain why businesses face recruitment gaps, overstaffing, or training shortages.",
      whenToUse: ["When analysing recruitment or retention problems.", "When a business is growing, restructuring, or automating.", "When linking HR to operations and strategy."],
      quadrants: ["Forecast demand", "Assess current workforce", "Identify gaps", "Act and review"],
      partBreakdown: [
        { part: "Forecast demand", explanation: "Estimate the future number and types of staff the business will need." },
        { part: "Assess current workforce", explanation: "Review existing staff numbers, skills, flexibility, and likely turnover." },
        { part: "Identify gaps", explanation: "Compare future demand with current supply to spot shortages or surpluses." },
        { part: "Act and review", explanation: "Use recruitment, training, redeployment, or redundancy and then monitor whether the plan worked." }
      ],
      howToUse: ["Explain the staffing problem.", "Show where the gap lies.", "Recommend the most suitable HR response."],
      examExample: "A business planning online expansion may need fewer shop-floor staff but more digital marketing and fulfilment skills.",
      strengths: ["Strategic and practical", "Links HR to business growth", "Good for explanation of staffing problems"],
      limitations: ["Forecasting can be wrong", "Labour markets change", "Unexpected turnover can disrupt plans"],
      examTrap: "Do not recommend recruitment without checking whether training existing staff is faster or cheaper."
    },
    {
      name: "Organisational Structures",
      topic: "3.6",
      whatItIs: "A model comparing how authority and communication are arranged inside a business.",
      whatItsFor: "It is for judging whether the structure supports control, speed, flexibility, and motivation.",
      whyNeeded: "Structure affects delegation, communication, and morale. In A-Level HR questions, it helps explain why a business is slow, costly, or poorly coordinated.",
      whenToUse: ["When discussing delayering, delegation, or communication problems.", "When judging restructuring plans.", "When linking HR issues to performance."],
      quadrants: ["Tall structure", "Flat structure", "Centralisation", "Decentralisation"],
      partBreakdown: [
        { part: "Tall structure", explanation: "Many layers of management, often with clearer control but slower communication." },
        { part: "Flat structure", explanation: "Fewer layers, often creating wider spans of control and faster communication." },
        { part: "Centralisation", explanation: "Decision making stays near the top of the business, improving consistency but sometimes slowing response." },
        { part: "Decentralisation", explanation: "Decision making is pushed down or outward, often improving local speed and flexibility but reducing consistency." }
      ],
      howToUse: ["Identify the current structural issue.", "Explain effects on speed, motivation, and control.", "Judge whether a structural change fits the business."],
      examExample: "A large retailer may decentralise some local store decisions to react faster to customer demand in different regions.",
      strengths: ["Strong HR and management relevance", "Useful for leadership questions", "Easy to apply to case studies"],
      limitations: ["No single best structure", "Context matters heavily", "Structural change can disrupt operations"],
      examTrap: "Do not assume flatter always means better. It may reduce control or overload managers."
    },
    {
      name: "Market Entry Modes",
      topic: "3.9",
      whatItIs: "A model comparing different ways of entering new markets, especially international ones.",
      whatItsFor: "It is for choosing the right balance of speed, cost, control, and risk when expanding.",
      whyNeeded: "Strategic methods questions often hinge on how a business grows, not just whether it grows. Market entry modes let you compare exporting, franchising, joint ventures, and wholly owned operations properly.",
      whenToUse: ["When evaluating international expansion.", "When judging strategic methods in 3.9.", "When comparing control against risk and cost."],
      quadrants: ["Exporting", "Franchising", "Joint venture", "Wholly owned operation"],
      partBreakdown: [
        { part: "Exporting", explanation: "Selling into a market from the home base. Lower commitment, but often less control and possible transport costs." },
        { part: "Franchising", explanation: "Allowing others to operate using the brand and system in return for fees. Fast growth, but brand control can weaken." },
        { part: "Joint venture", explanation: "Entering with a local partner to share risk, knowledge, and cost, though control must also be shared." },
        { part: "Wholly owned operation", explanation: "The firm owns the overseas operation itself, giving high control but high cost and risk." }
      ],
      howToUse: ["State what the business values most: speed, control, or low risk.", "Compare entry modes against those criteria.", "Judge which route best matches resources and market uncertainty."],
      examExample: "A small brand may franchise overseas to grow quickly without funding every site itself.",
      strengths: ["Excellent for strategic methods", "Supports balanced evaluation", "Links growth with control"],
      limitations: ["Real entry modes can overlap", "Political or cultural risk may dominate", "Fast entry may weaken quality control"],
      examTrap: "Do not recommend wholly owned expansion if the business lacks finance or market knowledge."
    },
    {
      name: "Organic vs Inorganic Growth",
      topic: "3.1/3.9",
      whatItIs: "A comparison model between internal growth and growth through mergers or takeovers.",
      whatItsFor: "It is for judging which growth route offers the best balance of speed, control, and risk.",
      whyNeeded: "Growth questions in A-Level Business often ask whether businesses should expand internally or buy existing capability. This comparison helps structure that judgement clearly.",
      whenToUse: ["When discussing expansion or strategic methods.", "When comparing speed with integration risk.", "When evaluating long-term value creation."],
      quadrants: ["Organic growth", "Inorganic growth", "Speed", "Integration risk"],
      partBreakdown: [
        { part: "Organic growth", explanation: "Expansion through internal investment, such as new products, new sites, or larger output. Usually slower but easier to control." },
        { part: "Inorganic growth", explanation: "Expansion through merger, takeover, or acquisition. Usually faster, but integration risk and cost are often much higher." },
        { part: "Speed", explanation: "How quickly the business can gain sales, capacity, or market share." },
        { part: "Integration risk", explanation: "The danger that systems, culture, and operations will not fit together after growth." }
      ],
      howToUse: ["Compare the business need for speed against the risk of buying growth.", "Explain financial and cultural implications.", "Judge which route is more sustainable in context."],
      examExample: "A start-up with a strong brand but limited cash may prefer organic growth, while a large PLC may acquire a rival to gain share quickly.",
      strengths: ["Simple strategic comparison", "Highly relevant to Paper 1 growth questions", "Good for AO4 evaluation"],
      limitations: ["Not every acquisition creates synergies", "Organic growth can be too slow", "Financing may limit both routes"],
      examTrap: "Do not assume inorganic growth automatically creates economies of scale."
    },
    {
      name: "Lewin Change Model",
      topic: "3.10",
      whatItIs: "A change model based on unfreeze, change, and refreeze stages.",
      whatItsFor: "It is for explaining how a business prepares for, implements, and embeds change.",
      whyNeeded: "Strategic change fails when managers ignore the human side. Lewin gives a simple A-Level structure for explaining how behaviour shifts from the old way of working to the new one.",
      whenToUse: ["When analysing resistance to change.", "When evaluating how to implement a new strategy.", "When judging whether change is likely to stick."],
      quadrants: ["Unfreeze", "Change", "Refreeze"],
      partBreakdown: [
        { part: "Unfreeze", explanation: "Prepare people for change by creating awareness, urgency, and willingness to move away from the old system." },
        { part: "Change", explanation: "Introduce the new process, structure, or behaviour with communication, training, and leadership support." },
        { part: "Refreeze", explanation: "Stabilise the new way of working so it becomes normal through systems, rewards, and reinforcement." }
      ],
      howToUse: ["Identify why change is needed.", "Explain how staff will be moved through the stages.", "Judge whether the new system can be embedded."],
      examExample: "Before digitalising an admin system, managers may need to unfreeze by explaining why the old process is too slow and costly.",
      strengths: ["Simple and memorable", "Useful for change questions", "Strong people focus"],
      limitations: ["Can oversimplify messy change", "Not all change is linear", "Refreeze may be unrealistic in fast-moving industries"],
      examTrap: "Do not jump straight to the change stage without discussing preparation and resistance."
    },
    {
      name: "Kotter Change Steps",
      topic: "3.10",
      whatItIs: "A more detailed change model based on creating urgency, building support, and sustaining momentum.",
      whatItsFor: "It is for explaining how leaders can manage large-scale strategic change step by step.",
      whyNeeded: "Some A-Level change questions need more detail than Lewin alone. Kotter helps explain leadership actions that reduce failure during major transformation.",
      whenToUse: ["When evaluating large or difficult change programmes.", "When a case highlights culture, communication, or weak leadership buy-in.", "When comparing leadership quality in change management."],
      quadrants: ["Urgency", "Coalition and vision", "Action and short-term wins", "Embedding change"],
      partBreakdown: [
        { part: "Urgency", explanation: "Leaders must show why change matters now so staff do not stay comfortable with the old system." },
        { part: "Coalition and vision", explanation: "A strong group of supporters and a clear direction help the business coordinate change." },
        { part: "Action and short-term wins", explanation: "Removing barriers and creating early visible progress helps maintain support." },
        { part: "Embedding change", explanation: "The new behaviours are reinforced so they become part of the culture." }
      ],
      howToUse: ["Link leadership actions to each stage.", "Explain how support is built.", "Evaluate whether the business can maintain momentum."],
      examExample: "A retailer rolling out a new ERP system may use early pilot-store wins to convince sceptical managers.",
      strengths: ["Detailed and practical", "Strong leadership focus", "Useful for evaluating implementation quality"],
      limitations: ["Can be time-consuming", "Not every step is neat in practice", "Requires capable leadership to work"],
      examTrap: "Do not describe the model mechanically without linking it to actual resistance in the case."
    },
    {
      name: "Force-field Analysis",
      topic: "3.10",
      whatItIs: "A model comparing forces driving change against forces resisting change.",
      whatItsFor: "It is for judging how difficult a change will be and what managers should strengthen or weaken.",
      whyNeeded: "This is a strong A-Level evaluation tool because it makes students think about both support and resistance instead of assuming change will happen smoothly.",
      whenToUse: ["When analysing strategic change or resistance.", "When evaluating whether change is likely to succeed.", "When comparing different implementation plans."],
      quadrants: ["Driving forces", "Restraining forces", "Net pressure", "Management actions"],
      partBreakdown: [
        { part: "Driving forces", explanation: "Factors pushing the business toward change, such as falling sales, new technology, or competitive pressure." },
        { part: "Restraining forces", explanation: "Factors resisting change, such as fear, cost, union opposition, or skill gaps." },
        { part: "Net pressure", explanation: "The balance between support and resistance that shows how hard change may be." },
        { part: "Management actions", explanation: "Specific actions to strengthen drivers or reduce resistance, such as communication or training." }
      ],
      howToUse: ["List key driving and restraining forces.", "Judge which are strongest.", "Recommend how management should shift the balance."],
      examExample: "A business pushing automation may face strong cost-saving drivers but also staff fear of redundancy as a restraining force.",
      strengths: ["Balanced", "Simple to apply", "Very useful for evaluation"],
      limitations: ["Hard to measure force strength precisely", "Circumstances can change quickly", "May oversimplify politics and culture"],
      examTrap: "Do not just list forces; explain which one actually determines success."
    }
  ];

  const formulaPractice = [
    {
      topic: "3.1/3.3",
      name: "Revenue",
      expandedName: "Revenue",
      question: "A business sells 2,400 units at 18 pounds each. Calculate revenue.",
      answer: 43200,
      unit: "pounds",
      tolerance: 0.01,
      working: [
        "Revenue = price x quantity sold",
        "18 x 2,400 = 43,200",
        "Revenue = 43,200 pounds"
      ],
      interpretation: "This is the total sales income before costs are deducted."
    },
    {
      topic: "3.4/3.5",
      name: "Total costs",
      expandedName: "Total Costs",
      question: "Fixed costs are 36,000 pounds and total variable costs are 54,000 pounds. Calculate total costs.",
      answer: 90000,
      unit: "pounds",
      tolerance: 0.01,
      working: [
        "Total costs = fixed costs + variable costs",
        "36,000 + 54,000 = 90,000",
        "Total costs = 90,000 pounds"
      ],
      interpretation: "This is the total spending needed to produce the current output."
    },
    {
      topic: "3.1/3.5",
      name: "Profit",
      expandedName: "Profit",
      question: "Revenue is 125,000 pounds and total costs are 98,500 pounds. Calculate profit.",
      answer: 26500,
      unit: "pounds",
      tolerance: 0.01,
      working: [
        "Profit = revenue - total costs",
        "125,000 - 98,500 = 26,500",
        "Profit = 26,500 pounds"
      ],
      interpretation: "The business keeps 26,500 pounds after covering its total costs."
    },
    {
      topic: "3.4",
      name: "Average cost",
      expandedName: "Average Cost",
      question: "Total costs are 72,000 pounds and output is 6,000 units. Calculate average cost per unit.",
      answer: 12,
      unit: "pounds per unit",
      tolerance: 0.01,
      working: [
        "Average cost = total costs / output",
        "72,000 / 6,000 = 12",
        "Average cost = 12 pounds per unit"
      ],
      interpretation: "Each unit costs 12 pounds on average to produce."
    },
    {
      topic: "3.3/3.5",
      name: "Contribution per unit",
      expandedName: "Contribution Per Unit",
      question: "A product sells for 32 pounds and has a variable cost per unit of 19 pounds. Calculate contribution per unit.",
      answer: 13,
      unit: "pounds per unit",
      tolerance: 0.01,
      working: [
        "Contribution per unit = selling price - variable cost per unit",
        "32 - 19 = 13",
        "Contribution per unit = 13 pounds"
      ],
      interpretation: "Each sale contributes 13 pounds towards fixed costs and then profit."
    },
    {
      topic: "3.4",
      name: "Labour productivity",
      expandedName: "Labour Productivity",
      question: "A factory produces 9,600 units using 24 employees. Calculate labour productivity.",
      answer: 400,
      unit: "units per employee",
      tolerance: 0.01,
      working: [
        "Labour productivity = output / number of employees",
        "9,600 / 24 = 400",
        "Labour productivity = 400 units per employee"
      ],
      interpretation: "On average, each worker produces 400 units over the period measured."
    },
    {
      topic: "3.4",
      name: "Capacity utilisation",
      expandedName: "Capacity Utilisation",
      question: "Current output is 18,000 units and maximum output is 24,000 units. Calculate capacity utilisation.",
      answer: 75,
      unit: "%",
      tolerance: 0.1,
      working: [
        "Capacity utilisation = current output / maximum output x 100",
        "18,000 / 24,000 x 100 = 75",
        "Capacity utilisation = 75%"
      ],
      interpretation: "The business is using three quarters of its productive capacity."
    },
    {
      topic: "3.5",
      name: "Break-even output",
      expandedName: "Break-even Output",
      question: "Fixed costs are 84,000 pounds and contribution per unit is 14 pounds. Calculate break-even output.",
      answer: 6000,
      unit: "units",
      tolerance: 0.01,
      working: [
        "Break-even output = fixed costs / contribution per unit",
        "84,000 / 14 = 6,000",
        "Break-even output = 6,000 units"
      ],
      interpretation: "The firm must sell 6,000 units to cover all costs and make zero profit."
    },
    {
      topic: "3.5",
      name: "Margin of safety",
      expandedName: "Margin of Safety",
      question: "Actual output is 8,400 units and break-even output is 6,900 units. Calculate the margin of safety.",
      answer: 1500,
      unit: "units",
      tolerance: 0.01,
      working: [
        "Margin of safety = actual output - break-even output",
        "8,400 - 6,900 = 1,500",
        "Margin of safety = 1,500 units"
      ],
      interpretation: "Sales could fall by 1,500 units before the business starts making a loss."
    },
    {
      topic: "3.5",
      name: "Gross profit margin",
      expandedName: "Gross Profit Margin",
      question: "Gross profit is 96,000 pounds and revenue is 320,000 pounds. Calculate gross profit margin.",
      answer: 30,
      unit: "%",
      tolerance: 0.1,
      working: [
        "Gross profit margin = gross profit / revenue x 100",
        "96,000 / 320,000 x 100 = 30",
        "Gross profit margin = 30%"
      ],
      interpretation: "The business keeps 30 pence of gross profit from every 1 pound of revenue."
    },
    {
      topic: "3.5",
      name: "ROCE",
      expandedName: "Return on Capital Employed",
      question: "Operating profit is 54,000 pounds and capital employed is 300,000 pounds. Calculate ROCE.",
      answer: 18,
      unit: "%",
      tolerance: 0.1,
      working: [
        "ROCE = operating profit / capital employed x 100",
        "54,000 / 300,000 x 100 = 18",
        "ROCE = 18%"
      ],
      interpretation: "The business generates an 18% return on the long-term funds invested in it."
    },
    {
      topic: "3.5",
      name: "Current ratio",
      expandedName: "Current Ratio",
      question: "Current assets are 78,000 pounds and current liabilities are 52,000 pounds. Calculate the current ratio.",
      answer: 1.5,
      unit: "times",
      tolerance: 0.01,
      working: [
        "Current ratio = current assets / current liabilities",
        "78,000 / 52,000 = 1.5",
        "Current ratio = 1.5:1"
      ],
      interpretation: "The business has 1.5 pounds of current assets for every 1 pound of short-term liabilities."
    },
    {
      topic: "3.3",
      name: "Market share",
      expandedName: "Market Share",
      question: "A firm records sales of 4.2 million pounds in a market worth 21 million pounds. Calculate market share.",
      answer: 20,
      unit: "%",
      tolerance: 0.1,
      working: [
        "Market share = firm sales / total market sales x 100",
        "4.2 million / 21 million x 100 = 20",
        "Market share = 20%"
      ],
      interpretation: "The business controls one fifth of total market sales."
    },
    {
      topic: "3.5",
      name: "ARR",
      expandedName: "Average Rate of Return",
      question: "Average annual profit from a project is 24,000 pounds and initial investment is 120,000 pounds. Calculate ARR.",
      answer: 20,
      unit: "%",
      tolerance: 0.1,
      working: [
        "ARR = average annual profit / initial investment x 100",
        "24,000 / 120,000 x 100 = 20",
        "ARR = 20%"
      ],
      interpretation: "The project returns 20% of the original investment per year on average."
    },
    {
      topic: "3.5",
      name: "Payback period",
      expandedName: "Payback Period",
      question: "Initial investment is 180,000 pounds and annual net cash inflow is 45,000 pounds. Calculate payback period.",
      answer: 4,
      unit: "years",
      tolerance: 0.01,
      working: [
        "Payback period = initial investment / annual net cash inflow",
        "180,000 / 45,000 = 4",
        "Payback period = 4 years"
      ],
      interpretation: "The project recovers its original cost after 4 years."
    }
  ];

  const paperTrendRows = [
    {
      year: "2019 trend pattern",
      topicCoverage: { t31: "medium", t32: "medium", t33: "high", t34: "high", t35: "high", t36: "medium", t37: "medium", t38: "low", t39: "medium", t310: "low" },
      recurringCalculations: "PED, break-even, gross/operating margin"
    },
    {
      year: "2020 trend pattern",
      topicCoverage: { t31: "low", t32: "medium", t33: "high", t34: "high", t35: "high", t36: "medium", t37: "medium", t38: "medium", t39: "medium", t310: "low" },
      recurringCalculations: "Capacity utilisation, labour productivity, ARR"
    },
    {
      year: "2021 trend pattern",
      topicCoverage: { t31: "medium", t32: "high", t33: "high", t34: "medium", t35: "high", t36: "medium", t37: "medium", t38: "medium", t39: "low", t310: "medium" },
      recurringCalculations: "ROCE, current ratio, market share"
    },
    {
      year: "2022 trend pattern",
      topicCoverage: { t31: "medium", t32: "medium", t33: "high", t34: "high", t35: "high", t36: "medium", t37: "high", t38: "medium", t39: "medium", t310: "low" },
      recurringCalculations: "Break-even, margin of safety, acid test"
    },
    {
      year: "2023 trend pattern",
      topicCoverage: { t31: "low", t32: "medium", t33: "high", t34: "high", t35: "high", t36: "medium", t37: "high", t38: "medium", t39: "medium", t310: "medium" },
      recurringCalculations: "PED, gross margin, payback"
    },
    {
      year: "2024 trend pattern",
      topicCoverage: { t31: "medium", t32: "medium", t33: "high", t34: "medium", t35: "high", t36: "high", t37: "medium", t38: "high", t39: "medium", t310: "medium" },
      recurringCalculations: "Operating margin, ARR/payback, capacity"
    },
    {
      year: "Most likely mixed pattern",
      topicCoverage: { t31: "medium", t32: "medium", t33: "high", t34: "high", t35: "high", t36: "medium", t37: "medium", t38: "medium", t39: "medium", t310: "medium" },
      recurringCalculations: "Profitability ratios, liquidity, elasticity, break-even"
    }
  ];

  const locallyDetectedFiles = [
    "A Level Business AQA 2020-2024.pdf",
    "AQA-7131-7132-SP-2023.PDF",
    "AQA-71311-QP-JUN23.PDF",
    "AQA-A-Level-Business-New-Paper-1-25-Mark-Essay-Questions-for-2025.pdf",
    "Business Alternative Exam Paper 1.pdf",
    "Stuvia-11079726-actual-2025-aqa-a-level-business-paper-1....pdf"
  ];

  const fixedMCQs = [
    {
      topic: "3.3",
      title: "PED reasoning",
      question: "A product has PED = -2. If price increases by 5%, what is the most likely change in demand?",
      options: ["Fall by 10%", "Rise by 10%", "Fall by 2%", "No change"],
      answerIndex: 0,
      explanation: "Elastic demand: demand falls by a greater percentage than the price increase."
    },
    {
      topic: "3.5",
      title: "Liquidity focus",
      question: "Which metric best shows short-term liquidity without depending on inventory sales?",
      options: ["Gross margin", "Acid test", "ROCE", "Payback"],
      answerIndex: 1,
      explanation: "Acid test removes inventory from current assets."
    },
    {
      topic: "3.4",
      title: "Capacity calculation",
      question: "A firm produces 8,000 units with max capacity of 10,000. Capacity utilisation is:",
      options: ["80%", "125%", "20%", "8%"],
      answerIndex: 0,
      explanation: "8,000/10,000 x 100 = 80%."
    },
    {
      topic: "3.2",
      title: "Leadership",
      question: "Which style is likely to maximise buy-in during major organisational change?",
      options: ["Autocratic", "Democratic", "Laissez-faire", "None"],
      answerIndex: 1,
      explanation: "Consultation can improve acceptance and reduce resistance."
    },
    {
      topic: "3.1",
      title: "Growth risk",
      question: "A likely risk of rapid inorganic growth is:",
      options: ["Guaranteed economies of scale", "Culture clash and integration failure", "Immediate productivity gains", "Lower gearing"],
      answerIndex: 1,
      explanation: "Mergers can fail due to poor integration and cultural mismatch."
    },
    {
      topic: "3.5",
      title: "Investment appraisal",
      question: "Which method ignores the timing of cash flows?",
      options: ["Payback", "Decision tree", "ARR", "Sensitivity analysis"],
      answerIndex: 2,
      explanation: "ARR uses accounting profit, not cash-flow timing patterns."
    },
    {
      topic: "3.3",
      title: "Market share",
      question: "If firm sales are 600,000 and total market sales are 3,000,000, share is:",
      options: ["5%", "20%", "50%", "80%"],
      answerIndex: 1,
      explanation: "600,000/3,000,000 x 100 = 20%."
    },
    {
      topic: "3.4",
      title: "Lean",
      question: "Kaizen is best described as:",
      options: ["One-time radical redesign", "Continuous incremental improvement", "Outsourcing all production", "Final-product inspection only"],
      answerIndex: 1,
      explanation: "Kaizen focuses on ongoing incremental improvements."
    },
    {
      topic: "3.2",
      title: "Motivation",
      question: "In Herzberg, which is a motivator?",
      options: ["Salary level", "Working conditions", "Recognition", "Job security"],
      answerIndex: 2,
      explanation: "Recognition is intrinsic and drives satisfaction."
    },
    {
      topic: "3.5",
      title: "Break-even",
      question: "If fixed costs are 60,000 and contribution per unit is 12, break-even output is:",
      options: ["500", "5,000", "720", "72,000"],
      answerIndex: 1,
      explanation: "60,000/12 = 5,000 units."
    },
    {
      topic: "3.1",
      title: "Objectives",
      question: "Which objective is most likely for a venture-backed start-up in year one?",
      options: ["Dividend maximisation", "Rapid market share growth", "Debt reduction", "Cost minimisation only"],
      answerIndex: 1,
      explanation: "Early-stage firms often prioritise growth and scale."
    },
    {
      topic: "3.3",
      title: "PLC",
      question: "A mature-market product strategy often focuses on:",
      options: ["Awareness creation only", "Line extension and differentiation", "Immediate withdrawal", "No promotion"],
      answerIndex: 1,
      explanation: "At maturity, extension and differentiation help sustain revenue."
    }
  ];

  function rotateQuestion(question, offset) {
    const mapped = question.options.map((option, index) => ({
      option,
      correct: index === question.answerIndex
    }));
    const rotated = mapped.map((_, index) => mapped[(index + offset) % mapped.length]);
    return {
      ...question,
      options: rotated.map((item) => item.option),
      answerIndex: rotated.findIndex((item) => item.correct)
    };
  }

  const formulaMCQs = formulas.slice(0, 22).map((item, i, arr) => {
    const alt1 = arr[(i + 5) % arr.length];
    const alt2 = arr[(i + 11) % arr.length];
    const alt3 = arr[(i + 16) % arr.length];
    return rotateQuestion({
      topic: item.topic,
      title: `Formula focus: ${item.name}`,
      question: `A manager needs to calculate ${item.name.toLowerCase()} while assessing ${item.examUse.toLowerCase()}. Which formula should be used?`,
      options: [item.formula, alt1.formula, alt2.formula, alt3.formula],
      answerIndex: 0,
      explanation: `${item.name} is calculated as: ${item.formula}`
    }, (i % 3) + 1);
  });

  const scenarioMCQs = revisionTopics.flatMap((topic) => {
    return topic.definitions.slice(0, 3).map((def, idx) => {
      const distractorA = topic.definitions[(idx + 2) % topic.definitions.length].term;
      const distractorB = topic.definitions[(idx + 4) % topic.definitions.length].term;
      const distractorC = revisionTopics[(revisionTopics.findIndex((t) => t.code === topic.code) + 1) % revisionTopics.length].definitions[0].term;
      return rotateQuestion({
        topic: topic.code,
        title: `${topic.code} concept check`,
        question: `A student writes: "${def.meaning}". Which term are they describing?`,
        options: [def.term, distractorA, distractorB, distractorC],
        answerIndex: 0,
        explanation: `${def.term} is the correct term for that description.`
      }, (idx % 3) + 1);
    });
  });

  const curatedMCQs = [
    {
      topic: "3.3",
      title: "PED interpretation",
      question: "A business raises price by 6% and quantity demanded falls by 15%. What is the strongest conclusion?",
      options: [
        "Demand is inelastic; revenue is likely to rise.",
        "Demand is elastic; revenue is likely to fall.",
        "Demand is unit elastic; revenue is unchanged.",
        "Demand cannot be estimated from this data."
      ],
      answerIndex: 1,
      explanation: "PED is -2.5 (elastic). With elastic demand, a price rise usually reduces total revenue."
    },
    {
      topic: "3.5",
      title: "Liquidity diagnosis",
      question: "Current ratio falls from 1.6 to 1.1 while acid test falls from 1.0 to 0.6. Which judgement is strongest?",
      options: [
        "Liquidity risk has increased and short-term resilience is weaker.",
        "Profitability has definitely improved.",
        "No concern because current ratio is still above 1.",
        "The business can safely increase credit sales further."
      ],
      answerIndex: 0,
      explanation: "Both liquidity indicators have weakened, especially quick liquidity, suggesting higher short-run cash risk."
    },
    {
      topic: "3.4",
      title: "Operations trade-off",
      question: "A factory runs at 97% capacity and reports rising defects and delivery delays. Best next step?",
      options: [
        "Push utilisation to 100% to dilute fixed costs.",
        "Hold strategy unchanged because high utilisation is always efficient.",
        "Address bottlenecks and process flow before forcing additional volume.",
        "Cut quality checks to restore throughput immediately."
      ],
      answerIndex: 2,
      explanation: "Very high utilisation can overload bottlenecks and harm quality/service, so flow and constraint fixes are typically required."
    },
    {
      topic: "3.2",
      title: "Leadership under pressure",
      question: "During a sudden cyber incident, which leadership style is usually most defensible in the first hour?",
      options: [
        "Highly democratic style with extended consultation.",
        "Short-run directive leadership, then broader consultation during recovery.",
        "Laissez-faire leadership to maximise autonomy immediately.",
        "No leadership intervention to avoid panic."
      ],
      answerIndex: 1,
      explanation: "Crisis conditions usually prioritise speed and coordination first, with consultation expanded once immediate risk is controlled."
    },
    {
      topic: "3.8",
      title: "SAF evaluation",
      question: "A strategy scores high on suitability but weak on feasibility. Best AO4 judgement?",
      options: [
        "Adopt immediately because strategic fit is the only criterion.",
        "Reject permanently because feasibility can never improve.",
        "Proceed only if funding and capability gaps are closed with a phased plan.",
        "Ignore feasibility and rely on stakeholder enthusiasm."
      ],
      answerIndex: 2,
      explanation: "Strong judgement links suitability to practical delivery constraints and states conditions for implementation."
    }
  ];

  const mcqs = [...curatedMCQs, ...fixedMCQs.map((q, i) => rotateQuestion(q, i % 4)), ...formulaMCQs, ...scenarioMCQs].slice(0, 60);

  const fillBlanks = [];
  formulas.forEach((f) => {
    const rhs = f.formula.includes("=") ? f.formula.split("=")[1].trim().toLowerCase() : f.formula.toLowerCase();
    fillBlanks.push({
      topic: f.topic,
      prompt: `${f.name}: ${f.formula.replace(/=.*/, "= ___________")}`,
      answer: rhs
    });
  });
  revisionTopics.forEach((topic) => {
    topic.definitions.slice(0, 4).forEach((def) => {
      fillBlanks.push({
        topic: topic.code,
        prompt: `${def.term} means: ${def.meaning.replace(def.meaning.split(" ")[0], "___________")}`,
        answer: def.meaning.split(" ")[0].toLowerCase()
      });
    });
  });

  const examTemplates = [
    {
      marks: 9,
      stem: "Analyse how [TOPIC] decisions could improve performance in a business facing [CONTEXT]."
    },
    {
      marks: 12,
      stem: "Evaluate whether [TOPIC] strategy should be prioritised over alternatives when [CONTEXT]."
    },
    {
      marks: 16,
      stem: "Assess the extent to which [TOPIC] improvements are the main driver of competitive advantage for a firm experiencing [CONTEXT]."
    },
    {
      marks: 25,
      stem: "To what extent should senior managers rely on [TOPIC] evidence when making strategic decisions during [CONTEXT]?"
    }
  ];

  const contexts = [
    "falling margins and rising costs",
    "stagnant sales in a competitive market",
    "rapid growth with staffing pressure",
    "high inflation and uncertain demand",
    "supply-chain disruption and quality complaints"
  ];

  const examStyle = [];
  revisionTopics.forEach((topic, i) => {
    examTemplates.forEach((template, j) => {
      examStyle.push({
        topic: topic.code,
        marks: template.marks,
        question: template.stem
          .replace("[TOPIC]", topic.title.toLowerCase())
          .replace("[CONTEXT]", contexts[(i + j) % contexts.length]),
        checklist: [
          "Use context-specific evidence and at least one metric or formula.",
          "Develop both argument and counter-argument.",
          "Finish with a condition-based judgement linked to business objectives."
        ]
      });
    });
  });

  const curatedExamStyle = [
    {
      topic: "3.3",
      marks: 16,
      question: "Evaluate whether a supermarket facing margin pressure should prioritise price cuts over non-price differentiation.",
      checklist: [
        "Use PED logic and competitor reaction in your analysis.",
        "Compare short-run volume effects with long-run brand/margin impact.",
        "Finish with a condition-based judgement (e.g. by segment elasticity)."
      ]
    },
    {
      topic: "3.5",
      marks: 25,
      question: "To what extent should a business with weak liquidity prioritise cash protection over growth investment in the next 12 months?",
      checklist: [
        "Integrate liquidity ratios, cash-flow timing and financing constraints.",
        "Assess strategic opportunity cost of delaying growth projects.",
        "Give a decisive final judgement with explicit trigger conditions."
      ]
    },
    {
      topic: "3.4",
      marks: 12,
      question: "Assess whether introducing lean methods is the most effective way to reduce unit costs in a business with volatile demand.",
      checklist: [
        "Apply specific lean tools to the demand pattern described.",
        "Evaluate stockout/supply risks and service-level impacts.",
        "Conclude with the best implementation sequence, not just the tool name."
      ]
    }
  ];

  const duolingoLessons = revisionTopics.map((topic) => {
    const def = topic.definitions[0];
    const nextDef = topic.definitions[1];
    return {
      title: `${topic.code} sprint`,
      topic: topic.code,
      steps: [
        {
          type: "mcq",
          prompt: `Which is the strongest definition of ${def.term}?`,
          options: [
            def.meaning,
            nextDef.meaning,
            "A concept unrelated to business performance"
          ],
          answerIndex: 0
        },
        {
          type: "type",
          prompt: `Type the missing term: ${nextDef.term} = ${nextDef.meaning.replace(nextDef.meaning.split(" ")[0], "_____")}`,
          answer: nextDef.meaning.split(" ")[0].toLowerCase()
        },
        {
          type: "mcq",
          prompt: `Which exam move best improves AO4 in ${topic.code}?`,
          options: [
            "Give one definition only",
            "Give a clear final judgement with conditions",
            "List all formulas without explanation"
          ],
          answerIndex: 1
        }
      ]
    };
  });

  const extraDuo = [
    {
      title: "Formula sprint A",
      topic: "3.5",
      steps: [
        { type: "mcq", prompt: "ROCE formula?", options: ["Operating profit/Capital employed x 100", "Gross profit/Revenue x 100", "Current assets/current liabilities"], answerIndex: 0 },
        { type: "type", prompt: "Type missing word: Break-even = fixed costs / _________", answer: "contribution per unit" },
        { type: "mcq", prompt: "Best final line in an essay?", options: ["No judgement", "Condition-based judgement", "Only formula"], answerIndex: 1 }
      ]
    },
    {
      title: "Formula sprint B",
      topic: "3.3",
      steps: [
        { type: "mcq", prompt: "PED above 1 in magnitude is:", options: ["Inelastic", "Elastic", "Unitary only"], answerIndex: 1 },
        { type: "type", prompt: "Type missing term: Market share = firm sales / _________ sales x 100", answer: "total market" },
        { type: "mcq", prompt: "When demand is elastic, a price rise often:", options: ["Raises revenue", "Lowers revenue", "Has no effect"], answerIndex: 1 }
      ]
    }
  ];

  const lessons = [...duolingoLessons, ...extraDuo];

  const flashcards = [];
  revisionTopics.forEach((topic) => {
    topic.definitions.forEach((d) => {
      flashcards.push({ topic: topic.code, front: `${d.term}`, back: d.meaning });
    });
    topic.deepKnowledge.forEach((k, i) => {
      flashcards.push({ topic: topic.code, front: `${topic.code} deep point ${i + 1}`, back: k });
    });
    topic.pitfalls.forEach((p, i) => {
      flashcards.push({ topic: topic.code, front: `${topic.code} exam pitfall ${i + 1}`, back: p });
    });
    topic.examTech.forEach((e, i) => {
      flashcards.push({ topic: topic.code, front: `${topic.code} technique ${i + 1}`, back: e });
    });
  });

  formulas.forEach((f) => {
    flashcards.push({
      topic: f.topic,
      front: `${f.name}`,
      back: `${f.formula}. Typical use: ${f.examUse}.`
    });
  });

  const examTechnique = {
    timingPlan: [
      "Open with 4-5 minutes scanning command words and data.",
      "Spend longer on high-mark essays only after planning line of argument.",
      "Leave final 8-10 minutes for recalculations and judgement checks."
    ],
    commandWords: [
      { word: "Define", move: "Precise term meaning only, no evaluation.", trap: "Adding long irrelevant detail." },
      { word: "Calculate", move: "Formula -> substitution -> answer -> unit.", trap: "No method shown." },
      { word: "Analyse", move: "Develop chain of cause and effect in context.", trap: "Unlinked points." },
      { word: "Assess", move: "Balanced argument plus judgement criteria.", trap: "One-sided response." },
      { word: "Evaluate", move: "Compare options and decide with conditions.", trap: "No final judgement." },
      { word: "To what extent", move: "Test both sides and decide degree.", trap: "Conclusion not answering extent." }
    ],
    essayFrameworks: [
      {
        title: "9/12 marker framework",
        bullets: [
          "Point with explicit stance.",
          "Chain analysis linked to context.",
          "Counterpoint and mini-judgement."
        ]
      },
      {
        title: "16 marker framework",
        bullets: [
          "Two developed arguments with evidence.",
          "Compare relative significance.",
          "Final judgement based on conditions and objective priorities."
        ]
      },
      {
        title: "25 marker framework",
        bullets: [
          "Brief intro with criteria and line of argument.",
          "3 developed paragraphs with integrated quant evidence.",
          "Counter-argument synthesis and decisive judgement."
        ]
      }
    ],
    judgementChecklist: [
      "Which option best fits the business objective stated in context?",
      "What condition would reverse your recommendation?",
      "Have you compared short-run and long-run effects?",
      "Did you include operational feasibility and finance constraints?"
    ]
  };

  const aiReadyQuestions = [
    {
      question: "A supermarket chain has low operating margin but high market share. Should it cut prices further to defend share?",
      aiModelAnswer: "Likely no as a default: if margin is already weak, further cuts risk unsustainable profit and reduced cash for reinvestment. A better route is selective pricing, category optimisation, and productivity gains to protect both share and margin. Final choice depends on PED by category and competitor reaction speed."
    },
    {
      question: "A manufacturer has 92% capacity utilisation and increasing defects. Evaluate adding another production line.",
      aiModelAnswer: "Adding capacity can reduce bottlenecks and quality pressure, but only if demand is stable and management can finance setup without liquidity stress. Short-term alternatives include process redesign, maintenance scheduling, and workforce upskilling. Recommendation: proceed only with demand evidence and phased implementation."
    },
    {
      question: "A fast-growing startup should prioritise cash flow over profit in year one. To what extent do you agree?",
      aiModelAnswer: "Largely agree in early stages: cash survival is non-negotiable, while accounting profit can be deferred. However, persistent losses without route to unit profitability will undermine investor confidence. Best judgement: prioritise cash flow now while tracking clear path to profit."
    }
  ];

  return {
    specSummary,
    revisionTopics,
    formulas,
    modelsDetailed,
    formulaPractice,
    paperTrendRows,
    locallyDetectedFiles,
    mcqs,
    fillBlanks: fillBlanks.slice(0, 38),
    examStyle: [...curatedExamStyle, ...examStyle].slice(0, 36),
    duolingoLessons: lessons,
    flashcards,
    examTechnique,
    aiReadyQuestions
  };
})();