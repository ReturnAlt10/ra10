"""Every AQA 7132 question 2020-2024 (read from the papers in training-data) and the
2025 extended questions (reconstructed from the examiner reports), tagged by spec
section. Drives the trend analysis and the 2027 predicted papers.

Run:  python past_papers.py   -> writes ../past_paper_analysis.json
Each record: (year, paper, question, marks, kind, spec, summary)
  kind: mcq | calc | short | analyse | evaluate
  spec: main spec sub-section (v2.0 numbering). Retired models are tagged 'retired:<model>'.
"""
import collections
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), "past_paper_analysis.json")

SECTIONS = {
    "3.1": "What is business?",
    "3.2": "Managers, leadership & decision making",
    "3.3": "Marketing",
    "3.4": "Operations",
    "3.5": "Finance",
    "3.6": "Human resources",
    "3.7": "Strategic position",
    "3.8": "Strategic direction",
    "3.9": "Strategic methods",
    "3.10": "Strategic change",
}

Q = [
    # ── Paper 1 · 2020 ───────────────────────────────────────────────────
    (2020, 1, "1", 1, "mcq", "3.9.4", "Data mining definition"),
    (2020, 1, "2", 1, "mcq", "3.3.4", "Boston Matrix: falling share in growing market"),
    (2020, 1, "3", 1, "mcq", "3.4.3", "Benefits of higher capacity utilisation"),
    (2020, 1, "4", 1, "mcq", "3.5.1", "Operating profit from accounts"),
    (2020, 1, "5", 1, "mcq", "3.4.3", "Lean production and unit costs"),
    (2020, 1, "6", 1, "mcq", "3.10.4", "Strategic drift scenarios"),
    (2020, 1, "7", 1, "mcq", "retired:Greiner", "Greiner's crisis points"),
    (2020, 1, "8", 1, "mcq", "retired:Balanced scorecard", "Balanced scorecard perspectives"),
    (2020, 1, "9", 1, "mcq", "3.7.8", "ARR"),
    (2020, 1, "10", 1, "mcq", "3.6.1", "Soft HRM v Blake Mouton styles"),
    (2020, 1, "11", 1, "mcq", "3.9.1", "Organic v external growth"),
    (2020, 1, "12", 1, "mcq", "3.5.2", "Break-even chart: cost structure change"),
    (2020, 1, "13", 1, "mcq", "retired:Hofstede", "Hofstede and innovation"),
    (2020, 1, "14", 1, "mcq", "3.3.2", "Correlation: incomes and competitor prices"),
    (2020, 1, "15", 1, "mcq", "3.3.2", "PED and YED: price cut + falling incomes"),
    (2020, 1, "16", 4, "calc", "3.5.2", "Profit variance"),
    (2020, 1, "17", 4, "calc", "3.6.2", "Employee costs as % of turnover (with capacity utilisation)"),
    (2020, 1, "18", 9, "analyse", "3.6.1", "More diverse workforce and profit"),
    (2020, 1, "19", 9, "analyse", "3.7.2", "Receivables/payables days changes and cash"),
    (2020, 1, "20", 9, "analyse", "3.9.4", "Digital technology problems for small businesses"),
    (2020, 1, "21", 25, "evaluate", "3.1.2", "Limited liability benefits all stakeholders?"),
    (2020, 1, "22", 25, "evaluate", "3.6.3", "Growth stage of PLC and human resource flow"),
    (2020, 1, "23", 25, "evaluate", "3.9.2", "R&D spending v culture for innovation"),
    (2020, 1, "24", 25, "evaluate", "3.8.2", "Low cost to differentiation: marketing v operations spend"),
    # ── Paper 1 · 2021 ───────────────────────────────────────────────────
    (2021, 1, "1", 1, "mcq", "3.7.1", "SWOT classification"),
    (2021, 1, "2", 1, "mcq", "3.1.2", "Share capital v market capitalisation"),
    (2021, 1, "3", 1, "mcq", "retired:Blake Mouton", "Blake Mouton grid movement"),
    (2021, 1, "4", 1, "mcq", "3.4.5", "When to outsource"),
    (2021, 1, "5", 1, "mcq", "3.3.4", "Boston Matrix: electric car"),
    (2021, 1, "6", 1, "mcq", "3.5.2", "Contribution identities"),
    (2021, 1, "7", 1, "mcq", "3.4.3", "Dynamic/penetration pricing and capacity"),
    (2021, 1, "8", 1, "mcq", "3.7.2", "Efficiency ratios and cash flow"),
    (2021, 1, "9", 1, "mcq", "3.9.1", "YED and economies of scope"),
    (2021, 1, "10", 1, "mcq", "retired:Hackman and Oldham", "Job design model"),
    (2021, 1, "11", 1, "mcq", "retired:Bartlett and Ghoshal", "Global v multi-domestic strategy"),
    (2021, 1, "12", 1, "mcq", "3.7.8", "Payback"),
    (2021, 1, "13", 1, "mcq", "retired:Greiner", "Greiner leadership crisis"),
    (2021, 1, "14", 1, "mcq", "3.10.1", "Kotter & Schlesinger: overcoming self-interest"),
    (2021, 1, "15", 1, "mcq", "3.3.2", "Correlation and extrapolation"),
    (2021, 1, "16", 4, "calc", "3.10.3", "Network: critical path, float, amended network"),
    (2021, 1, "17", 4, "calc", "3.2.2", "Decision tree: expected value and net gain"),
    (2021, 1, "18", 9, "analyse", "3.3.2", "Price rise and PED"),
    (2021, 1, "19", 9, "analyse", "3.7.5", "GDP and exchange rate changes on profitability"),
    (2021, 1, "20", 9, "analyse", "3.2.1", "HR manager's reviewing role and performance"),
    (2021, 1, "21", 25, "evaluate", "3.6.4", "Non-financial v financial motivation"),
    (2021, 1, "22", 25, "evaluate", "retired:Hofstede", "Hofstede and entering overseas markets"),
    (2021, 1, "23", 25, "evaluate", "3.7.7", "Supplier power and rivalry: profits inevitably fall?"),
    (2021, 1, "24", 25, "evaluate", "3.8.1", "Ansoff: penetration v diversification"),
    # ── Paper 1 · 2022 ───────────────────────────────────────────────────
    (2022, 1, "1", 1, "mcq", "3.2.3", "Retained profit and stakeholder conflict"),
    (2022, 1, "2", 1, "mcq", "3.9.1", "Experience curve"),
    (2022, 1, "3", 1, "mcq", "3.2.2", "Decision tree net gain"),
    (2022, 1, "4", 1, "mcq", "3.1.3", "Fair trade: higher costs and demand"),
    (2022, 1, "5", 1, "mcq", "3.5.2", "Break-even chart: price rise"),
    (2022, 1, "6", 1, "mcq", "3.6.2", "Employee costs as % of turnover"),
    (2022, 1, "7", 1, "mcq", "3.8.1", "Ansoff + qualitative research"),
    (2022, 1, "8", 1, "mcq", "3.3.2", "PED, market share by volume and value"),
    (2022, 1, "9", 1, "mcq", "3.10.3", "Critical path and float"),
    (2022, 1, "10", 1, "mcq", "3.4.4", "Quality, PED and added value"),
    (2022, 1, "11", 1, "mcq", "3.7.1", "SWOT classification"),
    (2022, 1, "12", 1, "mcq", "retired:Balanced scorecard", "Balanced scorecard perspective"),
    (2022, 1, "13", 1, "mcq", "3.3.3", "Niche market advantages"),
    (2022, 1, "14", 1, "mcq", "3.10.4", "Emergent strategy and strategic drift"),
    (2022, 1, "15", 1, "mcq", "3.7.8", "Capital expenditure and growth"),
    (2022, 1, "16", 2, "calc", "3.7.2", "Inventory turnover"),
    (2022, 1, "17", 3, "calc", "3.7.2", "Payables days"),
    (2022, 1, "18", 3, "calc", "3.7.2", "Current ratio"),
    (2022, 1, "19", 9, "analyse", "3.1.2", "Why non-profits set financial objectives"),
    (2022, 1, "20", 9, "analyse", "3.6.3", "Wider span of control and labour productivity"),
    (2022, 1, "21", 9, "analyse", "3.4.3", "Labour intensive v capital intensive"),
    (2022, 1, "22", 25, "evaluate", "3.3.4", "Boston Matrix and overall sales growth"),
    (2022, 1, "23", 25, "evaluate", "3.9.4", "E-commerce: all retailers online only?"),
    (2022, 1, "24", 25, "evaluate", "3.5.4", "Finance function and lowest cost"),
    (2022, 1, "25", 25, "evaluate", "3.10.1", "Flexible employment contracts and ethics"),
    # ── Paper 1 · 2023 ───────────────────────────────────────────────────
    (2023, 1, "1", 1, "mcq", "3.4.3", "What raises spare capacity"),
    (2023, 1, "2", 1, "mcq", "3.4.1", "Value added"),
    (2023, 1, "3", 1, "mcq", "3.8.1", "Ansoff: clothes store adds furniture"),
    (2023, 1, "4", 1, "mcq", "3.5.2", "Break-even chart reading"),
    (2023, 1, "5", 1, "mcq", "retired:Blake Mouton", "Blake Mouton concern for production"),
    (2023, 1, "6", 1, "mcq", "3.7.5", "Policy that raises GDP and inflation"),
    (2023, 1, "7", 1, "mcq", "3.10.1", "Kaizen: internal incremental change"),
    (2023, 1, "8", 1, "mcq", "retired:Bowman", "Bowman's undesirable positions"),
    (2023, 1, "9", 1, "mcq", "3.5.1", "Gross profit v profit for the year"),
    (2023, 1, "10", 1, "mcq", "3.1.1", "Role of profit"),
    (2023, 1, "11", 1, "mcq", "3.1.2", "Limited liability"),
    (2023, 1, "12", 1, "mcq", "3.6.2", "Labour productivity and turnover"),
    (2023, 1, "13", 1, "mcq", "3.6.2", "Employee cost per unit and % of turnover"),
    (2023, 1, "14", 1, "mcq", "3.4.5", "Responding to changes in demand"),
    (2023, 1, "15", 1, "mcq", "3.9.1", "Horizontal and backward vertical integration"),
    (2023, 1, "16", 4, "calc", "3.4.5", "Draw on an inventory control chart"),
    (2023, 1, "17", 4, "calc", "3.7.2", "Current ratio after share issue"),
    (2023, 1, "18", 9, "analyse", "3.3.3", "Large business entering a niche"),
    (2023, 1, "19", 9, "analyse", "3.3.2", "PED and YED: revenue change"),
    (2023, 1, "20", 9, "analyse", "3.6.4", "Maslow after redundancies"),
    (2023, 1, "21", 25, "evaluate", "3.10.4", "Contingency plans: internal v external factors"),
    (2023, 1, "22", 25, "evaluate", "3.9.1", "Growth and rising unit costs inevitable?"),
    (2023, 1, "23", 25, "evaluate", "3.9.3", "Emerging economies only as markets?"),
    (2023, 1, "24", 25, "evaluate", "3.4.4", "Profit objective needs higher quality?"),
    # ── Paper 1 · 2024 ───────────────────────────────────────────────────
    (2024, 1, "1", 1, "mcq", "3.1.2", "Unlimited liability"),
    (2024, 1, "2", 1, "mcq", "3.9.3", "Re-shoring influences"),
    (2024, 1, "3", 1, "mcq", "3.6.3", "Delayering"),
    (2024, 1, "4", 1, "mcq", "3.5.2", "Profit variance"),
    (2024, 1, "5", 1, "mcq", "3.7.1", "SWOT classification"),
    (2024, 1, "6", 1, "mcq", "3.8.1", "Ansoff definitions"),
    (2024, 1, "7", 1, "mcq", "3.3.2", "PED/YED and unchanged revenue"),
    (2024, 1, "8", 1, "mcq", "3.9.1", "Experience curve axis"),
    (2024, 1, "9", 1, "mcq", "3.2.2", "Decision tree probabilities"),
    (2024, 1, "10", 1, "mcq", "3.9.1", "Economies of scale v capacity utilisation"),
    (2024, 1, "11", 1, "mcq", "3.4.4", "Quality, PED and competitive advantage"),
    (2024, 1, "12", 1, "mcq", "3.7.5", "Exchange rate rise"),
    (2024, 1, "13", 1, "mcq", "3.7.2", "Current ratio and gearing"),
    (2024, 1, "14", 1, "mcq", "3.10.3", "Network: critical activities"),
    (2024, 1, "15", 1, "mcq", "3.10.3", "Network: delay and critical path"),
    (2024, 1, "16", 4, "calc", "3.5.2", "Margin of safety"),
    (2024, 1, "17", 4, "calc", "3.7.8", "NPV"),
    (2024, 1, "18", 9, "analyse", "3.5.3", "Share capital v bank loan for a plc"),
    (2024, 1, "19", 9, "analyse", "3.10.2", "Role culture to power culture"),
    (2024, 1, "20", 9, "analyse", "3.7.5", "Interest rate rise: geared exporter"),
    (2024, 1, "21", 25, "evaluate", "3.7.3", "Ratios for non-profits"),
    (2024, 1, "22", 25, "evaluate", "3.6.1", "Hard to soft HRM and motivation"),
    (2024, 1, "23", 25, "evaluate", "3.10.4", "Rapid change makes strategic drift inevitable?"),
    (2024, 1, "24", 25, "evaluate", "3.4.3", "Lean production always lowers unit costs?"),
    # ── Paper 1 · 2025 (extended questions; from examiner reports) ───────
    (2025, 1, "16", 4, "calc", "3.7.2", "Current ratio"),
    (2025, 1, "17", 4, "calc", "3.7.2", "Reverse ROCE to find operating profit"),
    (2025, 1, "18", 9, "analyse", "3.6.3", "Organisational structure and speed of response"),
    (2025, 1, "19", 9, "analyse", "3.7.5", "Fiscal policy and the medical market"),
    (2025, 1, "20", 9, "analyse", "3.9.2", "HR and innovation"),
    (2025, 1, "21", 25, "evaluate", "3.9.3", "Multinational in a stagnant market"),
    (2025, 1, "22", 25, "evaluate", "3.3.2", "Market research and market share"),
    (2025, 1, "23", 25, "evaluate", "3.8.2", "Investment and competitive advantage"),
    (2025, 1, "24", 25, "evaluate", "3.4.4", "QC v QA and profit"),

    # ── Paper 2 ──────────────────────────────────────────────────────────
    (2020, 2, "1.1", 6, "calc", "3.7.2", "Drake Hotels: current ratio and gearing"),
    (2020, 2, "1.2", 4, "short", "3.7.8", "Why use sensitivity analysis"),
    (2020, 2, "1.3", 9, "analyse", "3.6.3", "HR challenges of seasonal bookings"),
    (2020, 2, "1.4", 16, "evaluate", "3.7.8", "Should Drake invest in the Oxford hotel?"),
    (2020, 2, "2.1", 3, "short", "3.7.6", "Nari: Carroll's CSR pyramid"),
    (2020, 2, "2.2", 5, "short", "3.7.5", "Responding to protectionism"),
    (2020, 2, "2.3", 9, "analyse", "3.4.3", "JIT and profits"),
    (2020, 2, "2.4", 16, "evaluate", "3.6.4", "Taylor for all businesses?"),
    (2020, 2, "3.1", 2, "short", "3.5.3", "Zani: venture capital"),
    (2020, 2, "3.2", 5, "short", "3.10.2", "Why change a power culture"),
    (2020, 2, "3.3", 9, "analyse", "3.3.2", "Why PED is -0.4"),
    (2020, 2, "3.4", 16, "evaluate", "3.9.1", "Franchising for any business?"),
    (2021, 2, "1.1", 3, "calc", "3.1.2", "Metro Bank: shares from market cap"),
    (2021, 2, "1.2", 2, "calc", "3.3.2", "Percentage change from index"),
    (2021, 2, "1.3", 4, "short", "3.1.2", "Reason for share price change"),
    (2021, 2, "1.4", 9, "analyse", "3.4.5", "Branch closures: matching supply to demand"),
    (2021, 2, "1.5", 16, "evaluate", "3.7.7", "Are new entrants a significant threat?"),
    (2021, 2, "2.1", 2, "calc", "3.5.2", "Bell Ltd: gross profit margin"),
    (2021, 2, "2.2", 6, "analyse", "3.5.4", "Payables and receivables management and cash"),
    (2021, 2, "2.3", 9, "analyse", "3.1.2", "Ownership and strategic decisions"),
    (2021, 2, "2.4", 16, "evaluate", "3.3.4", "Always stop 'dogs'?"),
    (2021, 2, "3.1", 2, "calc", "3.6.2", "Chillax: retention rate"),
    (2021, 2, "3.2", 6, "analyse", "3.4.4", "Benefits of a quality focus"),
    (2021, 2, "3.3", 9, "analyse", "3.6.4", "Why engagement is high"),
    (2021, 2, "3.4", 16, "evaluate", "3.6.2", "Should all worry about labour turnover?"),
    (2022, 2, "1.1", 2, "short", "3.3.2", "Tea: extrapolation"),
    (2022, 2, "1.2", 3, "calc", "3.3.2", "Combined market share"),
    (2022, 2, "1.3", 4, "short", "3.3.3", "Benefit of segmentation"),
    (2022, 2, "1.4", 9, "analyse", "3.3.2", "PED and pricing two teas"),
    (2022, 2, "1.5", 16, "evaluate", "3.8.1", "Good time to launch a new brand?"),
    (2022, 2, "2.1", 2, "short", "3.1.2", "Ocado/M&S: dividend"),
    (2022, 2, "2.2", 4, "short", "3.1.2", "Why the share price rose"),
    (2022, 2, "2.3", 9, "analyse", "3.6.4", "Maslow and senior managers"),
    (2022, 2, "2.4", 16, "evaluate", "3.9.1", "Ventures for all businesses?"),
    (2022, 2, "3.1", 2, "calc", "3.4.5", "DT: lead time"),
    (2022, 2, "3.2", 2, "calc", "3.4.5", "Re-order quantity"),
    (2022, 2, "3.3", 2, "calc", "3.4.5", "Daily usage"),
    (2022, 2, "3.4", 4, "short", "3.7.5", "Falling pound and exports"),
    (2022, 2, "3.5", 9, "analyse", "3.10.4", "Contingency planning and competitiveness"),
    (2022, 2, "3.6", 16, "evaluate", "3.4.5", "Is reliability the key supplier factor?"),
    (2023, 2, "1.1", 4, "calc", "3.7.8", "AJS: NPV"),
    (2023, 2, "1.2", 4, "calc", "3.7.2", "ROCE"),
    (2023, 2, "1.3", 9, "analyse", "3.4.3", "Why become capital intensive"),
    (2023, 2, "1.4", 16, "evaluate", "3.7.2", "Should an investor buy shares?"),
    (2023, 2, "2.1", 3, "calc", "3.6.1", "Homeworking: percentage change"),
    (2023, 2, "2.2", 6, "analyse", "3.7.2", "Homeworking and the balance sheet"),
    (2023, 2, "2.3", 9, "analyse", "3.2.1", "Managers' roles and homeworking"),
    (2023, 2, "2.4", 16, "evaluate", "3.7.3", "Homeworking and the Triple Bottom Line"),
    (2023, 2, "3.1", 4, "short", "3.3.2", "Simply Bake: sample representativeness"),
    (2023, 2, "3.2", 4, "short", "3.2.3", "Stakeholder mapping"),
    (2023, 2, "3.3", 9, "analyse", "3.10.1", "Lewin's force field"),
    (2023, 2, "3.4", 16, "evaluate", "3.7.6", "CSR only if forced by government?"),
    (2024, 2, "1.1", 4, "calc", "3.7.2", "Biggs: payables days"),
    (2024, 2, "1.2", 3, "short", "3.5.2", "Why gross profit margin fell"),
    (2024, 2, "1.3", 9, "analyse", "3.4.2", "Labour productivity and market share"),
    (2024, 2, "1.4", 16, "evaluate", "3.3.4", "Sponsorship to promote a new range"),
    (2024, 2, "2.1", 9, "analyse", "retired:Bowman", "Soundcheck: change of positioning"),
    (2024, 2, "2.2", 9, "analyse", "3.5.4", "Turning a loss into a profit"),
    (2024, 2, "2.3", 16, "evaluate", "3.6.5", "Trade unions and resistance to change"),
    (2024, 2, "3.1", 9, "analyse", "3.5.4", "WWH: improving cash flow"),
    (2024, 2, "3.2", 9, "analyse", "3.6.3", "Organisational design for a portfolio"),
    (2024, 2, "3.3", 16, "evaluate", "3.7.4", "Is environmental legislation always damaging?"),
    (2025, 2, "1.x", 4, "calc", "3.5.2", "Credit-terms calculation"),
    (2025, 2, "1.y", 9, "analyse", "3.2.2", "Decision tree"),
    (2025, 2, "1.z", 16, "evaluate", "3.7.5", "Economic threats v opportunities"),
    (2025, 2, "2.x", 9, "analyse", "3.4.3", "JIT for a retailer"),
    (2025, 2, "2.y", 9, "analyse", "3.6.4", "Herzberg"),
    (2025, 2, "2.z", 16, "evaluate", "3.3.3", "Income segmentation for all businesses"),
    (2025, 2, "3.x", 9, "analyse", "3.6.1", "Airline HR objectives"),
    (2025, 2, "3.y", 9, "analyse", "3.4.4", "Quality measures"),
    (2025, 2, "3.z", 16, "evaluate", "3.8.2", "Non-current assets and low cost"),

    # ── Paper 3 ──────────────────────────────────────────────────────────
    (2020, 3, "1", 12, "analyse", "3.1.2", "Sunport: share price rise and stakeholders"),
    (2020, 3, "2", 12, "analyse", "3.9.3", "Why a multi-domestic strategy"),
    (2020, 3, "3", 16, "evaluate", "3.4.5", "Cheaper suppliers?"),
    (2020, 3, "4", 16, "evaluate", "3.7.3", "Most successful division (scorecard data)"),
    (2020, 3, "5", 20, "evaluate", "3.2.1", "Delegating to autocratic: profitability"),
    (2020, 3, "6", 24, "evaluate", "3.7.6", "Does CSR decrease profit for all?"),
    (2021, 3, "1", 12, "analyse", "3.3.4", "AM plc: marketing mix for focused differentiation"),
    (2021, 3, "2", 12, "analyse", "3.2.1", "Management style and factory performance"),
    (2021, 3, "3", 16, "evaluate", "3.4.3", "JIT at the new factory"),
    (2021, 3, "4", 16, "evaluate", "3.10.3", "Usefulness of network analysis"),
    (2021, 3, "5", 20, "evaluate", "3.7.8", "Site A or Site B (quant + qual)"),
    (2021, 3, "6", 24, "evaluate", "3.9.3", "Should all re-shore?"),
    (2022, 3, "1", 12, "analyse", "3.3.4", "SSN: promotional decisions"),
    (2022, 3, "2", 12, "analyse", "3.9.2", "Copyright and growth"),
    (2022, 3, "3", 16, "evaluate", "3.5.3", "Debt factoring for cash flow"),
    (2022, 3, "4", 16, "evaluate", "3.10.2", "Power to role culture"),
    (2022, 3, "5", 20, "evaluate", "3.2.3", "Takeover and stakeholder conflict"),
    (2022, 3, "6", 24, "evaluate", "3.10.4", "Without strategic planning all fail?"),
    (2023, 3, "1", 12, "analyse", "3.4.1", "Logger Boards: environmental objectives"),
    (2023, 3, "2", 12, "analyse", "3.9.1", "Organic v external growth"),
    (2023, 3, "3", 16, "evaluate", "3.4.2", "New facility and operational efficiency"),
    (2023, 3, "4", 16, "evaluate", "3.3.4", "Can social-media-only promotion raise sales?"),
    (2023, 3, "5", 20, "evaluate", "3.5.3", "Is a bank loan too risky? (quant + qual)"),
    (2023, 3, "6", 24, "evaluate", "3.10.3", "Growth strategy success depends on leadership?"),
    (2024, 3, "1", 12, "analyse", "3.4.2", "Speed-e-Puds: high capacity utilisation"),
    (2024, 3, "2", 12, "analyse", "3.3.1", "Setting a 15% market share objective"),
    (2024, 3, "3", 16, "evaluate", "3.7.8", "Slushy machines (calculations)"),
    (2024, 3, "4", 16, "evaluate", "3.7.1", "SWOT and strategic planning"),
    (2024, 3, "5", 20, "evaluate", "3.9.1", "Organic growth v franchising"),
    (2024, 3, "6", 24, "evaluate", "3.8.2", "Innovation essential for differentiation?"),
    (2025, 3, "1", 12, "analyse", "3.10.1", "VBM: Lewin - why change now"),
    (2025, 3, "2", 12, "analyse", "3.9.1", "Retrenchment and marketing"),
    (2025, 3, "3", 16, "evaluate", "3.10.3", "Network analysis: factory in a year?"),
    (2025, 3, "4", 16, "evaluate", "3.6.3", "HR: overseas recruitment v redundancies"),
    (2025, 3, "5", 20, "evaluate", "3.7.4", "Is legislation the biggest threat?"),
    (2025, 3, "6", 24, "evaluate", "3.4.3", "Capacity management harder for multinationals?"),
]

VERIFIED_YEARS = [2020, 2021, 2022, 2023, 2024]   # read from the actual papers
CONTEXTS = {
    2: {2020: ["Drake Hotels PLC (budget hotels)", "Nari (phone maker, Asia)", "Zani PLC (jewellery franchisor)"],
        2021: ["UK banks / Metro Bank", "Bell Ltd (family food manufacturer)", "Chillax Ltd (luxury spas)"],
        2022: ["UK tea market", "Ocado-M&S joint venture", "DT (circuit-board exporter)"],
        2023: ["AJS plc (packaging manufacturer)", "Homeworking (whole economy)", "Simply Bake plc (palm oil)"],
        2024: ["Biggs Ltd (snack foods)", "Soundcheck plc (streaming)", "WWH Ltd (wood-burning stoves)"]},
    3: {2020: "Sunport PLC - multinational consumer goods plc (large)",
        2021: "AM plc - drone maker re-shoring from China (medium plc)",
        2022: "SSN Ltd - cybersecurity founder-led Ltd (medium, fast growth)",
        2023: "Logger Boards Ltd - sole-owner surfboard maker (small)",
        2024: "Speed-e-Puds Ltd - dessert parlours, 3 branches (small)",
        2025: "VBM - car manufacturer (large)"},
}


def section(code):
    return code if code.startswith("retired") else ".".join(code.split(".")[:2])


def build():
    by_paper = {}
    for p in (1, 2, 3):
        rows = [q for q in Q if q[1] == p]
        ext = [q for q in rows if q[4] != "mcq"]
        marks = collections.Counter()
        count = collections.Counter()
        last = {}
        for y, _, _, m, kind, spec, _ in ext:
            s = section(spec)
            marks[s] += m
            count[s] += 1
            last[spec] = max(last.get(spec, 0), y)
        total = sum(marks.values())
        years = sorted({q[0] for q in rows})
        by_paper[p] = {
            "years": years,
            "questions": [dict(zip(("year", "paper", "q", "marks", "kind", "spec", "summary"), q)) for q in rows],
            "sections": [
                {"code": s, "name": SECTIONS.get(s, s.replace("retired:", "Retired: ")), "marks": marks[s],
                 "share": round(100 * marks[s] / total, 1), "questions": count[s]}
                for s in sorted(marks, key=lambda k: -marks[k])
            ],
            "subtopic_last_seen": dict(sorted(last.items())),
            "kinds": dict(collections.Counter(q[4] for q in rows)),
        }
        if p == 1:
            mcq = collections.Counter(section(q[5]) for q in rows if q[4] == "mcq")
            by_paper[p]["mcq_sections"] = dict(mcq.most_common())
    return {"verified_years": VERIFIED_YEARS, "note": "2025 rows are reconstructed from examiner reports; 2020-2024 are read from the papers.",
            "papers": by_paper, "contexts": CONTEXTS}


if __name__ == "__main__":
    data = build()
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
    for p, d in data["papers"].items():
        print("Paper", p, "| extended marks by section:", ", ".join(f"{s['code']} {s['share']}%" for s in d["sections"][:8]))
    print("wrote", OUT)
