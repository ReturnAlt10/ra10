"""Shared marking framework for the AQA A-level Business (7132) question bank.

Every level grid, AO split and tariff here is taken from the AQA 7132 mark schemes
(June 2020 - June 2024) and the spec v2.0 (exams from June 2025). The build script,
the mock builder and the AI examiner all depend on these being exact.
"""

SUBJECT = "A-Level Business"
SPEC_CODE = "7132"

TOPICS = {
    "1": ("3.1", "What is business?"),
    "2": ("3.2", "Managers, leadership and decision making"),
    "3": ("3.3", "Marketing management"),
    "4": ("3.4", "Operational management"),
    "5": ("3.5", "Financial management"),
    "6": ("3.6", "Human resource management"),
    "7": ("3.7", "Analysing the strategic position of a business"),
    "8": ("3.8", "Choosing strategic direction"),
    "9": ("3.9", "Strategic methods: how to pursue strategies"),
    "10": ("3.10", "Managing strategic change"),
}

SUBTOPICS = {
    "3.1.1": "Understanding the nature and purpose of business",
    "3.1.2": "Understanding different business forms",
    "3.1.3": "Understanding that businesses operate within an external environment",
    "3.2.1": "Understanding management, leadership and decision making",
    "3.2.2": "Understanding management decision making",
    "3.2.3": "Understanding the role and importance of stakeholders",
    "3.3.1": "Setting marketing objectives",
    "3.3.2": "Understanding markets and customers",
    "3.3.3": "Making marketing decisions: segmentation, targeting, positioning",
    "3.3.4": "Making marketing decisions: using the marketing mix",
    "3.4.1": "Setting operational objectives",
    "3.4.2": "Analysing operational performance",
    "3.4.3": "Increasing efficiency and productivity",
    "3.4.4": "Improving quality",
    "3.4.5": "Managing inventory and supply chains",
    "3.5.1": "Setting financial objectives",
    "3.5.2": "Analysing financial performance",
    "3.5.3": "Sources of finance",
    "3.5.4": "Improving cash flow and profits",
    "3.6.1": "Setting human resource objectives",
    "3.6.2": "Analysing human resource performance",
    "3.6.3": "Organisational design and the human resource flow",
    "3.6.4": "Improving motivation and engagement",
    "3.6.5": "Improving employer-employee relations",
    "3.7.1": "Mission, corporate objectives, functional objectives and strategy",
    "3.7.2": "Internal position: financial ratio analysis",
    "3.7.3": "Internal position: overall performance",
    "3.7.4": "External environment: political and legal change",
    "3.7.5": "External environment: economic change",
    "3.7.6": "External environment: social and technological change",
    "3.7.7": "External environment: the competitive environment",
    "3.7.8": "Analysing strategic options: investment appraisal",
    "3.8.1": "Strategic direction: which markets and products",
    "3.8.2": "Strategic positioning: choosing how to compete",
    "3.9.1": "Assessing a change in scale",
    "3.9.2": "Assessing innovation",
    "3.9.3": "Assessing globalisation and internationalisation",
    "3.9.4": "Assessing greater use of digital technology",
    "3.10.1": "Managing change",
    "3.10.2": "Managing organisational culture",
    "3.10.3": "Managing strategic implementation",
    "3.10.4": "Problems with strategy and why strategies fail",
}


def topic_of(spec_ref):
    """'3.4.2' -> '4'"""
    return spec_ref.split(".")[1]


# ---------------------------------------------------------------------------
# Level descriptors, verbatim wording from AQA 7132 mark schemes.
# ---------------------------------------------------------------------------

_L_LIMITED_9 = ("A limited response overall with little focus on the demands of the question. "
                "Demonstrates a limited range and depth of knowledge and understanding of issues in the question; "
                "demonstrates analysis with little development and with mainly descriptive application to the context.")
_L_REASONABLE_9 = ("A reasonable response overall that focuses on some of the demands of the question. "
                   "Demonstrates a limited knowledge and understanding of a range of issues in the question or a good "
                   "knowledge and understanding of relatively few issues in the question; demonstrates analysis which is "
                   "developed and is applied to the context.")
_L_GOOD_9 = ("A good response overall that focuses on many of the demands of the question. "
             "Demonstrates a depth and range of knowledge and understanding of issues in the question; "
             "demonstrates analysis which is well developed and is applied effectively to the context.")

_L_LIMITED_12 = ("A limited response overall with little focus on the demands of the question. "
                 "Demonstrates a limited range and depth of knowledge and understanding of issues in the question; "
                 "demonstrates analysis with little development and mainly descriptive application to the context.")
_L_REASONABLE_12 = ("A reasonable response overall that focuses on some of the demands of the question. "
                    "Demonstrates a limited knowledge and understanding of a range of issues in the question or a good "
                    "knowledge and understanding of relatively few issues in the question; demonstrates analysis which is "
                    "developed, applied to the context and considers some of the issues in the question.")
_L_GOOD_12 = ("A good response overall that focuses on many of the demands of the question. "
              "Demonstrates a depth and range of knowledge and understanding of issues in the question; demonstrates "
              "analysis which is well developed, applied effectively to the context and considers a range of issues "
              "in the question.")

_E_WEAK = ("A weak response overall lacking focus on the demands of the question. Demonstrates isolated or imprecise "
           "knowledge and understanding; demonstrates undeveloped analysis with descriptive application to the context "
           "and lacking focus on the question; makes judgements or proposes solutions based on assertions.")
_E_LIMITED = ("A limited response overall with little focus on the demands of the question. Demonstrates a limited range "
              "and depth of knowledge and understanding of issues in the question; demonstrates analysis with little "
              "development, mainly descriptive application to the context and considers a limited number of issues in "
              "the question; makes judgements or proposes solutions which have limited links to analysis or limited "
              "focus on the question as a whole.")
_E_REASONABLE = ("A reasonable response overall that focuses on some of the demands of the question. Demonstrates a "
                 "limited knowledge and understanding of a range of issues in the question or a good knowledge and "
                 "understanding of relatively few issues in the question; demonstrates analysis which is developed, "
                 "applied to the context and considers some of the issues in the question; makes judgements or provides "
                 "solutions which are built on analysis, but lack balance and are not fully focused on the question as a whole.")
_E_GOOD = ("A good response overall that focuses on many of the demands of the question. Demonstrates a depth and range "
           "of knowledge and understanding of issues in the question; demonstrates analysis which is well developed, "
           "applied effectively to the context and considers a range of issues in the question; makes judgements or "
           "provides solutions which are built on analysis, show balance and address the question as a whole.")
_E_EXCELLENT = ("An excellent response overall that is fully focused on the key demands of the question. Demonstrates a "
                "depth and range of knowledge and understanding that is precise and well selected in relation to issues "
                "in the question; demonstrates analysis throughout which is well developed, is applied effectively to the "
                "context and considers a balanced range of the issues in the question; makes judgements or provides "
                "solutions which are built effectively on analysis, show balance and have a clear focus on the question "
                "as a whole throughout.")


def levels_for(marks):
    """Return AQA level grid (list of dicts, highest level first) for a levels-marked tariff."""
    if marks == 3:
        return [
            {"level": 3, "marks": "3", "descriptor": "A good response overall that focuses on many of the demands of the question: explains one relevant reason/factor, clearly applied to the context."},
            {"level": 2, "marks": "2", "descriptor": "A reasonable response overall that focuses on some of the demands of the question: an explanation with little use of context."},
            {"level": 1, "marks": "1", "descriptor": "A limited response overall that focuses on a few demands of the question: some understanding of the relevant concept."},
        ]
    if marks == 4:
        return [
            {"level": 3, "marks": "4", "descriptor": "A good response overall that focuses on many of the demands of the question: explains one relevant point fully, applied to the context."},
            {"level": 2, "marks": "2-3", "descriptor": "A reasonable response overall that focuses on some of the demands of the question: explains one relevant point, possibly with some context."},
            {"level": 1, "marks": "1", "descriptor": "A limited response overall that focuses on a few demands of the question: some understanding of the relevant concept."},
        ]
    if marks == 6:
        return [
            {"level": 3, "marks": "5-6", "descriptor": "A good response overall that focuses on many of the demands of the question. Demonstrates a good knowledge and understanding of issues in the question; demonstrates analysis which is well developed and is applied effectively to the context."},
            {"level": 2, "marks": "3-4", "descriptor": "A reasonable response overall that focuses on some of the demands of the question. Demonstrates a reasonable knowledge and understanding of issues in the question; demonstrates analysis which is developed and is applied to the context."},
            {"level": 1, "marks": "1-2", "descriptor": "A limited response overall with little focus on the demands of the question. Demonstrates a limited knowledge and understanding of issues in the question; demonstrates analysis with little development and with mainly descriptive application to the context."},
        ]
    if marks == 9:
        return [
            {"level": 3, "marks": "7-9", "descriptor": _L_GOOD_9},
            {"level": 2, "marks": "4-6", "descriptor": _L_REASONABLE_9},
            {"level": 1, "marks": "1-3", "descriptor": _L_LIMITED_9},
        ]
    if marks == 12:
        return [
            {"level": 3, "marks": "9-12", "descriptor": _L_GOOD_12},
            {"level": 2, "marks": "5-8", "descriptor": _L_REASONABLE_12},
            {"level": 1, "marks": "1-4", "descriptor": _L_LIMITED_12},
        ]
    if marks == 16:
        return [
            {"level": 4, "marks": "13-16", "descriptor": _E_EXCELLENT},
            {"level": 3, "marks": "9-12", "descriptor": _E_GOOD},
            {"level": 2, "marks": "5-8", "descriptor": _E_REASONABLE},
            {"level": 1, "marks": "1-4", "descriptor": _E_LIMITED},
        ]
    if marks == 20:
        return [
            {"level": 5, "marks": "17-20", "descriptor": _E_EXCELLENT},
            {"level": 4, "marks": "13-16", "descriptor": _E_GOOD},
            {"level": 3, "marks": "9-12", "descriptor": _E_REASONABLE},
            {"level": 2, "marks": "5-8", "descriptor": _E_LIMITED},
            {"level": 1, "marks": "1-4", "descriptor": _E_WEAK},
        ]
    if marks == 24:
        return [
            {"level": 5, "marks": "21-24", "descriptor": _E_EXCELLENT},
            {"level": 4, "marks": "16-20", "descriptor": _E_GOOD},
            {"level": 3, "marks": "11-15", "descriptor": _E_REASONABLE},
            {"level": 2, "marks": "6-10", "descriptor": _E_LIMITED},
            {"level": 1, "marks": "1-5", "descriptor": _E_WEAK},
        ]
    if marks == 25:
        return [
            {"level": 5, "marks": "21-25", "descriptor": _E_EXCELLENT},
            {"level": 4, "marks": "16-20", "descriptor": _E_GOOD},
            {"level": 3, "marks": "11-15", "descriptor": _E_REASONABLE},
            {"level": 2, "marks": "6-10", "descriptor": _E_LIMITED},
            {"level": 1, "marks": "1-5", "descriptor": _E_WEAK},
        ]
    raise ValueError(f"No level grid for {marks} marks")


# AO splits as printed in the 7132 mark schemes. Keyed by (paper, marks, kind).
AO_SPLITS = {
    ("Paper 1", 1, "mcq"): {"AO1": 1},
    ("Paper 1", 4, "calc"): {"AO1": 1, "AO2": 3},
    ("Paper 1", 9, "analyse"): {"AO1": 3, "AO2": 3, "AO3": 3},
    ("Paper 1", 25, "evaluate"): {"AO1": 5, "AO2": 4, "AO3": 6, "AO4": 10},
    ("Paper 2", 2, "calc"): {"AO1": 1, "AO2": 1},
    ("Paper 2", 2, "define"): {"AO1": 2},
    ("Paper 2", 3, "calc"): {"AO1": 1, "AO2": 2},
    ("Paper 2", 3, "explain"): {"AO1": 1, "AO2": 2},
    ("Paper 2", 4, "calc"): {"AO1": 1, "AO2": 3},
    ("Paper 2", 4, "explain"): {"AO1": 2, "AO2": 2},
    ("Paper 2", 6, "analyse"): {"AO1": 2, "AO2": 2, "AO3": 2},
    ("Paper 2", 9, "analyse"): {"AO1": 2, "AO2": 3, "AO3": 4},
    ("Paper 2", 16, "evaluate"): {"AO1": 2, "AO2": 3, "AO3": 4, "AO4": 7},
    ("Paper 3", 12, "analyse"): {"AO1": 3, "AO2": 3, "AO3": 6},
    ("Paper 3", 16, "evaluate"): {"AO1": 2, "AO2": 3, "AO3": 4, "AO4": 7},
    ("Paper 3", 20, "evaluate"): {"AO1": 4, "AO2": 3, "AO3": 5, "AO4": 8},
    ("Paper 3", 24, "evaluate"): {"AO1": 5, "AO2": 4, "AO3": 6, "AO4": 9},
}


def ao_text(split):
    return ", ".join(f"{k} = {v}" for k, v in split.items())


# Generic marker guidance distilled from AQA examiner reports 2022-2025 and the
# "Answers and commentaries" exemplars. Attached to every levels-marked item and
# fed to the AI examiner.
EXAMINER_PRINCIPLES = {
    "analyse": [
        "Analyse questions do NOT need a conclusion or counter-argument; judgement earns no extra credit (2024 P3 Q2 L1 script lost focus by evaluating).",
        "One well-developed argument, applied to the context, can reach the top level (2024 P3 Q2 marker note; 2022 P3 Q1: one factor well developed = 9 marks).",
        "A developed argument explains WHY each link in the chain follows - stating that one thing leads to another is not enough (2024 P3 Q5 commentary).",
        "Arguments built on a misunderstanding of the key term (e.g. capacity instead of capacity utilisation) are not credited.",
        "Every link must stay on the precise question - start where the question starts and finish where it ends (e.g. 'to help strategic planning').",
    ],
    "evaluate": [
        "Higher levels need balance: arguments on both sides AND a judgement that weighs them up - not a summary or restatement (2024/2025 P3 reports).",
        "The judgement must answer the precise question set and flow from the arguments made; new points introduced in the conclusion are not rewarded.",
        "A strong judgement explains what the answer depends on, linked to the context, and which argument is more significant and why.",
        "Flawed analysis cannot support credit-worthy evaluation - a conclusion based on a false premise is not justified.",
        "'All businesses' / 'any business' questions need context through contrasting scenarios or real examples (e.g. fast-moving tech vs slow-moving furniture).",
        "Quantity is less important than focus: two well-developed, balanced arguments with a weighed judgement can reach the top level.",
    ],
    "calc": [
        "Award marks for correct working using the Own Figure Rule (OFR) - an arithmetic slip early on does not stop later method marks.",
        "Correct formula with no valid calculation = 1 mark.",
        "The final answer must be in the correct unit (units, %, days, £m, times, :1). Wrong unit, e.g. adding a £ sign to a number of units, loses the final mark.",
    ],
}
