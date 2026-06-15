import hashlib
import json
import random
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
DATA_DIR = Path(__file__).resolve().parent
TRAINING_DIR = ROOT / "training-data" / "a-level" / "business-2023"

PPT_MAP_PATH = TRAINING_DIR / "ppt_extracted_map.json"
EXTRACTED_TEXT_PATH = TRAINING_DIR / "extracted_content.txt"

TOPIC_SPEC = {
    "1": {
        "title": "Topic 1: What is business?",
        "short": "Nature and purpose, ownership, markets and enterprise",
        "subtopics": [
            ("1.1", "Understanding the nature and purpose of business"),
            ("1.2", "Understanding different business forms"),
            ("1.3", "Understanding that businesses operate within an external environment"),
            ("1.4", "Understanding markets, competition and customers"),
            ("1.5", "Understanding finance and financial decisions"),
            ("1.6", "Understanding operations, marketing and human resource decisions"),
            ("1.7", "Understanding the role of entrepreneurs"),
        ],
    },
    "2": {
        "title": "Topic 2: Managers, leadership and decision making",
        "short": "Management, leadership, decision making and stakeholders",
        "subtopics": [
            ("2.1", "Understanding management, leadership and decision making"),
            ("2.2", "Understanding management decision making"),
            ("2.3", "Understanding the role and importance of stakeholders"),
            ("2.4", "Understanding and leading change"),
        ],
    },
    "3": {
        "title": "Topic 3: Decision making to improve marketing performance",
        "short": "Objectives, markets, segmentation and marketing mix",
        "subtopics": [
            ("3.1", "Setting marketing objectives"),
            ("3.2", "Understanding markets and customers"),
            ("3.3", "Making marketing decisions: segmentation, targeting and positioning"),
            ("3.4", "Using the marketing mix to inform and implement decisions"),
            ("3.5", "Managing marketing performance"),
        ],
    },
    "4": {
        "title": "Topic 4: Decision making to improve operational performance",
        "short": "Operations objectives, capacity, quality and productivity",
        "subtopics": [
            ("4.1", "Setting operational objectives"),
            ("4.2", "Analysing operational performance"),
            ("4.3", "Influences on operational decisions"),
            ("4.4", "Improving operational performance"),
        ],
    },
    "5": {
        "title": "Topic 5: Decision making to improve financial performance",
        "short": "Finance objectives, ratio analysis and funding decisions",
        "subtopics": [
            ("5.1", "Setting financial objectives"),
            ("5.2", "Analysing financial performance"),
            ("5.3", "Influences on financial decisions"),
            ("5.4", "Improving financial performance"),
        ],
    },
    "6": {
        "title": "Topic 6: Decision making to improve human resource performance",
        "short": "People management, motivation and productivity",
        "subtopics": [
            ("6.1", "Setting human resource objectives"),
            ("6.2", "Analysing human resource performance"),
            ("6.3", "Influences on human resource decisions"),
            ("6.4", "Improving human resource performance"),
        ],
    },
    "7": {
        "title": "Topic 7: Analysing the strategic position of a business",
        "short": "Mission, audit tools and strategic position",
        "subtopics": [
            ("7.1", "Mission, corporate objectives and strategy"),
            ("7.2", "Analysing the existing internal position of a business"),
            ("7.3", "Analysing the strategic position of a business through data"),
            ("7.4", "Analysing strategic position and overall performance"),
        ],
    },
    "8": {
        "title": "Topic 8: Choosing strategic direction",
        "short": "Markets, products, positioning and competitiveness",
        "subtopics": [
            ("8.1", "Choosing strategic direction: markets and products"),
            ("8.2", "Choosing strategic direction: strategic positioning"),
            ("8.3", "Choosing strategic direction: choosing how to compete"),
            ("8.4", "Choosing strategic direction: strategic methods"),
        ],
    },
    "9": {
        "title": "Topic 9: Strategic methods: how to pursue strategies",
        "short": "Scale, innovation, internationalisation and digital methods",
        "subtopics": [
            ("9.1", "Assessing a change in scale"),
            ("9.2", "Assessing innovation"),
            ("9.3", "Assessing internationalisation"),
            ("9.4", "Assessing greater use of digital technology"),
        ],
    },
    "10": {
        "title": "Topic 10: Managing strategic change",
        "short": "Culture, implementation and strategic control",
        "subtopics": [
            ("10.1", "Managing organisational change"),
            ("10.2", "Managing strategic implementation"),
            ("10.3", "Managing strategic change"),
        ],
    },
}

FORMULA_BANK = {
    "1": [
        "Profit = Total revenue - Total cost",
        "Total revenue = Price x Quantity",
        "Added value = Selling price - Cost of bought-in inputs",
    ],
    "2": [
        "Decision quality improves when options are compared against weighted objectives",
        "Decision trees can be used to structure uncertainty and expected values",
    ],
    "3": [
        "Price elasticity of demand (PED) = % change in quantity demanded / % change in price",
        "Market share (%) = (Business sales / Total market sales) x 100",
        "Contribution per unit = Selling price - Variable cost per unit",
    ],
    "4": [
        "Capacity utilisation (%) = (Actual output / Maximum output) x 100",
        "Labour productivity = Output / Number of employees",
        "Unit cost = Total cost / Output",
    ],
    "5": [
        "Gross profit margin (%) = (Gross profit / Revenue) x 100",
        "Operating profit margin (%) = (Operating profit / Revenue) x 100",
        "ROCE (%) = (Operating profit / Capital employed) x 100",
        "Current ratio = Current assets / Current liabilities",
    ],
    "6": [
        "Labour turnover (%) = (Number leaving / Average number employed) x 100",
        "Labour productivity = Output / Number of employees",
        "Absenteeism rate (%) = (Total absent days / Total possible working days) x 100",
    ],
    "7": [
        "ROCE (%) = (Operating profit / Capital employed) x 100",
        "Gearing (%) = (Non-current liabilities / Capital employed) x 100",
        "Use strategic audit tools (SWOT, PESTLE) with ratio trends",
    ],
    "8": [
        "Expected return should be balanced against strategic risk",
        "Ansoff options can be compared by risk, resource needs and implementation speed",
    ],
    "9": [
        "Payback period = Initial investment / Annual net cash inflow",
        "Assess strategic fit, synergies and implementation risk",
    ],
    "10": [
        "Strategic control compares expected and actual performance over time",
        "Change implementation must align structure, culture and incentives",
    ],
}

NOISE_PATTERNS = [
    "lesson objective",
    "starter",
    "mini plenary",
    "plenary",
    "slant",
    "shape expectations",
    "worksheet",
    "turn over",
    "every end of lesson",
    "pack away",
]

PAPER_STYLE = {
    "Paper 1": "Use concise definitions, short calculations and data-linked 9-mark analysis.",
    "Paper 2": "Use strategic analysis with Appendix data and balanced argument chains.",
    "Paper 3": "Use synoptic judgement across functions with evidence-based evaluation.",
}


def stable_seed(*parts):
    joined = "|".join(parts)
    return int(hashlib.md5(joined.encode("utf-8")).hexdigest()[:8], 16)


def clean_line(line):
    line = re.sub(r"\s+", " ", str(line or "")).strip()
    if not line:
        return ""
    if len(line) < 12:
        return ""
    lower = line.lower()
    if any(p in lower for p in NOISE_PATTERNS):
        return ""
    if line.startswith("[") and line.endswith("]"):
        return ""
    if re.fullmatch(r"[\W_]+", line):
        return ""
    return line


def unique(seq):
    seen = set()
    out = []
    for x in seq:
        if x in seen:
            continue
        seen.add(x)
        out.append(x)
    return out


def read_sources():
    with PPT_MAP_PATH.open("r", encoding="utf-8") as f:
        ppt_map = json.load(f)
    extracted = EXTRACTED_TEXT_PATH.read_text(encoding="utf-8", errors="ignore")
    return ppt_map, extracted


def source_lines_for_subtopic(ppt_map, code, name):
    raw = ppt_map.get("subtopic_text", {}).get(code, [])
    cleaned = unique([clean_line(x) for x in raw if clean_line(x)])
    merged = []
    i = 0
    while i < len(cleaned):
        line = cleaned[i]
        if line.endswith(":") and i + 1 < len(cleaned):
            nxt = cleaned[i + 1]
            if not nxt.endswith(":"):
                merged.append(f"{line.rstrip(':')}: {nxt}")
                i += 2
                continue
        merged.append(line)
        i += 1
    cleaned = merged
    if not cleaned:
        cleaned = [
            f"{name} affects how businesses set objectives, allocate resources and evaluate performance.",
            "Use relevant context, quantitative evidence and clear judgement to score highly.",
        ]
    return cleaned


def derive_key_terms(lines, subtopic_name):
    terms = []
    for i, line in enumerate(lines):
        if line.lower().startswith("definition"):
            term = ""
            if ":" in line:
                term = line.split(":", 1)[1].strip(" .")
            if not term and i + 1 < len(lines):
                term = lines[i + 1].strip(" .")
            definition = lines[i + 1].strip() if i + 1 < len(lines) else "A core idea in this subtopic."
            if term and len(term.split()) <= 6:
                terms.append({"term": term, "definition": definition})

    if len(terms) < 4:
        chunks = [x.strip() for x in re.split(r"[,()\-]", subtopic_name) if x.strip()]
        for chunk in chunks:
            short = chunk if len(chunk.split()) <= 5 else " ".join(chunk.split()[:5])
            terms.append({
                "term": short,
                "definition": f"A key part of {subtopic_name.lower()} used in AQA analysis and evaluation.",
            })

    terms = unique([json.dumps(t, sort_keys=True) for t in terms])
    parsed = [json.loads(t) for t in terms][:4]
    for entry in parsed:
        definition = str(entry.get("definition", "")).strip()
        if definition.lower().endswith((" that", " which", " with", " of")) or len(definition.split()) < 6:
            entry["definition"] = (
                f"A core concept used when analysing {subtopic_name.lower()} in context-rich AQA responses."
            )
    return parsed


def declarative_points(lines, minimum=5):
    points = []
    for line in lines:
        if line.endswith(":"):
            continue
        if "?" in line:
            continue
        if len(line) < 24:
            continue
        words = line.split()
        if len(words) < 6:
            continue
        lower = line.lower()
        if not any(v in lower for v in [" is ", " are ", " can ", " should ", " will ", " to "]):
            continue
        points.append(line)
    points = unique(points)
    if len(points) < minimum:
        while len(points) < minimum:
            points.append("Apply context, explain chain effects, and finish with a justified judgement.")
    return points[:max(minimum, 6)]


def pick_source_fact(lines):
    for line in lines:
        s = str(line).strip()
        if len(s) < 40:
            continue
        if "?" in s:
            continue
        if s.endswith(":"):
            continue
        return s
    return "Effective analysis links business decisions to measurable outcomes and stakeholder impact."


def subtopic_overview(topic_num, name, lines):
    fact = pick_source_fact(lines)
    return (
        f"{name} focuses on the business decisions that shape performance in Topic {topic_num}. "
        f"A strong answer defines the concept, applies context, then builds a clear chain from cause to consequence. "
        f"Source anchor: {fact}"
    )


def subtopic_big_picture(name):
    return (
        f"The big-picture exam skill in {name.lower()} is balancing short-run pressure and long-run strategy, "
        "then justifying the final recommendation with explicit criteria."
    )


def subtopic_concept_map(name, lines):
    fact = pick_source_fact(lines)
    return [
        f"Start with a precise definition linked directly to {name.lower()}.",
        "Apply at least one contextual detail from the case material or data appendix.",
        "Develop chain analysis: decision -> operational/financial effect -> stakeholder consequence.",
        "Compare alternatives and explain why one option is more robust under uncertainty.",
        f"Use evidence and source detail: {fact}",
    ]


def subtopic_examples(name, lines):
    anchor = pick_source_fact(lines)
    return [
        f"Example 1: A business applies {name.lower()} to improve decision quality in a changing market.",
        f"Example 2: Managers compare short-run cost outcomes with long-run strategic benefits in {name.lower()}.",
        f"Context clue: {anchor}",
    ]


def subtopic_exam_tip(name):
    return (
        f"Exam tip for {name}: start with a precise definition, apply one concrete context point, "
        "then build a full chain of analysis before giving judgement."
    )


def formulae_for_topic(topic_num, lines):
    base = list(FORMULA_BANK.get(str(topic_num), []))
    for line in lines:
        if "=" in line and len(line) < 120:
            base.append(line)
    return unique(base)[:4]


def memory_hook(code, name):
    first = name.split(" ")[0].lower()
    return f"{code}: define, apply, analyse, evaluate {first}."


def topic_papers(topic_num):
    return ["Paper 1", "Paper 3"] if int(topic_num) <= 6 else ["Paper 2", "Paper 3"]


def short_question_mark_scheme(name, marks):
    points = [
        f"Accurate business point linked to {name.lower()} (1)",
        "Relevant contextual application (1)",
        "Clear analytical consequence (1)",
    ]
    if marks >= 4:
        points.append("Business implication linked to performance (1)")
    if marks >= 9:
        points.append("Balanced argument with supported mini-judgement (1)")
    return {
        "instruction": "Award one mark per valid point up to the maximum.",
        "points": points,
        "additional_guidance": "Accept equivalent wording where business logic and context are secure.",
        "do_not_accept": "Generic comments with no business context.",
    }


def levels_mark_scheme(name, topic_num, formulae):
    return {
        "instruction": "Apply levels-based marking using best fit.",
        "indicative_content": [
            f"Apply {name.lower()} to the business context and use relevant data.",
            "Develop at least two chains of analysis from cause to effect to consequence.",
            "Weigh short-run and long-run outcomes for different stakeholders.",
            "Deliver a clear final judgement with explicit justification.",
        ],
        "level_descriptors": [
            {"level": 1, "marks": "1-6", "descriptor": "Limited knowledge and weak context linkage."},
            {"level": 2, "marks": "7-12", "descriptor": "Reasonable analysis with some contextual support."},
            {"level": 3, "marks": "13-18", "descriptor": "Developed chains of analysis with context."},
            {"level": 4, "marks": "19-25", "descriptor": "Sustained analysis and well-justified evaluation."},
        ],
        "additional_guidance": "Reward reasoned alternatives where chains are logically developed.",
        "formulae": [{"math": f, "notes": "Use calculations only when they improve the argument."} for f in formulae[:2]],
    }


def make_scenario(code, topic_num, name):
    rng = random.Random(stable_seed(code, name))
    firms = [
        "Northbridge Foods plc",
        "Vertex Sports Group",
        "Harbour Retail Ltd",
        "Brightline Electronics plc",
        "Oakfield Services Ltd",
        "Luma Drinks plc",
        "Aster Mobility Group",
    ]
    firm = firms[rng.randrange(len(firms))]
    rev = round(rng.uniform(45, 380), 1)
    margin = round(rng.uniform(4.2, 18.9), 1)
    employees = rng.randrange(80, 1800)
    return (
        f"{firm} is reviewing {name.lower()} as part of its current strategy. "
        f"Recent board data shows revenue of GBP {rev}m, operating margin of {margin}%, and {employees} employees. "
        f"Managers must decide how to improve performance while balancing short-run pressure and long-run resilience."
    )


def make_case_study(code, topic_num, name, marks):
    rng = random.Random(stable_seed(code, str(topic_num), name, str(marks), "case"))
    businesses = [
        "Northbridge Foods plc",
        "Vertex Sports Group",
        "Harbour Retail Ltd",
        "Brightline Electronics plc",
        "Oakfield Services Ltd",
        "Luma Drinks plc",
        "Aster Mobility Group",
        "Horizon Homeware plc",
        "Truvale Fashion Group",
    ]
    firm = businesses[rng.randrange(len(businesses))]
    sector = rng.choice(["retail", "food manufacturing", "consumer services", "digital commerce", "leisure"])
    revenue = round(rng.uniform(120, 980), 1)
    op_margin = round(rng.uniform(3.8, 18.5), 1)
    employees = rng.randrange(650, 12200)
    online_share = rng.randrange(18, 76)
    market_share = round(rng.uniform(4.1, 29.8), 1)
    fixed_cost = round(rng.uniform(22, 190), 1)
    variable_cost = round(rng.uniform(38, 410), 1)
    debt = round(rng.uniform(55, 620), 1)
    inflation = round(rng.uniform(2.8, 11.6), 1)
    wage_growth = round(rng.uniform(2.1, 9.4), 1)
    competitor = rng.choice(["low-cost entrants", "premium international brands", "platform-based disruptors"])

    paragraphs = [
        (
            f"{firm} operates in {sector} markets across the UK and selected international regions. "
            f"Its board is reviewing {name.lower()} after a volatile two-year period. Management reports total revenue of GBP {revenue}m, "
            f"an operating margin of {op_margin}%, and a workforce of approximately {employees} employees. "
            f"The business has grown quickly through a mixed model of physical operations and digital channels, with online sales now contributing {online_share}% of turnover. "
            f"Current market share is {market_share}%, but directors disagree on whether growth should continue at pace or pause to consolidate performance."
        ),
        (
            f"Operational data shows fixed costs of roughly GBP {fixed_cost}m per year and variable costs of GBP {variable_cost}m linked to demand volume. "
            f"Customer complaint rates have risen in two regions, while service speed and inventory availability vary between locations. "
            "Several senior managers argue that short-run performance should be prioritised through cost control and tighter targets. "
            "Others argue that this could weaken medium-term capability if training, quality systems and innovation budgets are reduced. "
            "Recent employee surveys also indicate pressure on engagement and retention in frontline teams."
        ),
        (
            f"External conditions add further uncertainty. Annual inflation is currently {inflation}% and wage growth is {wage_growth}%, "
            f"raising labour and supplier costs. At the same time, {competitor} are reshaping customer expectations on price, speed and product range. "
            "Industry analysts highlight that businesses in this market now compete on data use, delivery reliability and responsiveness to changing customer behaviour. "
            "The finance director warns that debt of approximately GBP "
            f"{debt}m limits strategic flexibility if interest costs rise further."
        ),
        (
            "Appendix A summarises three-year financial trends, including revenue growth, margin movement and return metrics. "
            "Appendix B outlines selected customer and employee data, including satisfaction scores, repeat purchase rates and labour turnover. "
            "Appendix C compares two strategic options: a cost-led stabilisation plan and a capability-led growth plan. "
            "Appendix D provides risk commentary on implementation speed, culture alignment, and likely stakeholder reaction. "
            "Board members expect recommendations that use both quantitative and qualitative evidence rather than generic theory."
        ),
    ]

    if marks >= 9:
        paragraphs.append(
            (
                "The chair has asked the strategy team to model two implementation pathways over a three-year horizon. "
                "Pathway 1 emphasises tighter cost discipline, productivity controls and selective withdrawal from weaker lines. "
                "Pathway 2 emphasises controlled investment in capability, including process redesign, digital enablement and stronger customer proposition execution. "
                "Both pathways carry execution risk, and directors are concerned that poor sequencing could produce short-run disruption without delivering long-run gains. "
                "The board therefore requires analysis that is explicit about assumptions, evidence quality and likely stakeholder responses."
            )
        )
        paragraphs.append(
            (
                "Appendix E presents management estimates for demand sensitivity, contribution movement and expected implementation costs under each pathway. "
                "Appendix F contains stakeholder commentary from employees, suppliers and major customers, including concerns about service continuity and price strategy. "
                "Candidates should use these materials as evidence when building argument chains, rather than repeating generic textbook points. "
                "High-quality responses will identify where data supports a recommendation and where uncertainty means assumptions must be tested."
            )
        )

    if marks >= 16:
        paragraphs.append(
            (
                "In board discussion, one group proposes standardising operations and reducing product range complexity to improve consistency and margin control. "
                "Another group proposes targeted investment in capability, including data systems, people development and customer proposition upgrades, "
                "arguing this would strengthen longer-term differentiation. "
                "The chief executive states that whichever route is chosen must be realistic to implement within existing financial constraints and must protect brand trust. "
                "Candidates are expected to evaluate these trade-offs using the evidence provided and arrive at a clear final judgement."
            )
        )

    if marks >= 25:
        paragraphs.append(
            (
                "Examiner note: the strongest responses will integrate functional analysis (marketing, operations, finance and people) rather than discussing each in isolation. "
                "High-level answers will test assumptions, consider alternative scenarios, and explain conditions under which the recommendation might change. "
                "A reasoned conclusion should reference implementation risk, stakeholder impact and likely performance trajectory over time. "
                "Use the data context as if working with a real board pack and avoid unsupported assertions."
            )
        )

    return "\n\n".join(paragraphs)


def build_guide(topics, source_bank):
    out_topics = []
    for topic_num, topic in topics.items():
        subtopics = []
        for code, name in topic["subtopics"]:
            lines = source_bank[code]
            key_terms = derive_key_terms(lines, name)
            concept = subtopic_concept_map(name, lines)
            formulas = formulae_for_topic(topic_num, lines)
            examples = subtopic_examples(name, lines)
            subtopics.append(
                {
                    "code": code,
                    "name": name,
                    "overview": subtopic_overview(topic_num, name, lines),
                    "big_picture": subtopic_big_picture(name),
                    "why_it_matters": "In AQA Business, strong answers connect theory to context, consequences and judgement.",
                    "key_terms": key_terms,
                    "summary_points": concept[:4],
                    "business_examples": examples,
                    "exam_tip": subtopic_exam_tip(name),
                    "concept_map": concept[:5],
                    "models": [
                        "Cause -> Effect -> Consequence chain",
                        "Short-run vs long-run comparison",
                        "Stakeholder impact and final judgement check",
                    ],
                    "formulae": formulas,
                    "exam_chain": [
                        "AO1: define and use accurate terminology",
                        "AO2: apply directly to the case/context",
                        "AO3: analyse chain effects and trade-offs",
                        "AO4: evaluate and justify final judgement",
                    ],
                    "worked_examples": [
                        {
                            "title": f"{name}: exam-ready structure",
                            "scenario": make_scenario(code, topic_num, name),
                            "steps": [
                                "Define the core concept in one sentence.",
                                "Apply one or two specific contextual details.",
                                "Develop two linked analysis chains.",
                                "Compare with a credible alternative decision.",
                                "Conclude with a justified final judgement.",
                            ],
                            "interpretation": "This structure mirrors AQA command-verb expectations and level descriptors.",
                        }
                    ],
                    "exam_plans": [
                        {
                            "question_type": "Paper 1/2 short-response (4-9 marks)",
                            "plan": [
                                "Define",
                                "Apply context",
                                "Analyse one or two consequences",
                                "Mini judgement",
                            ],
                        },
                        {
                            "question_type": "Paper 3 synoptic evaluation (25 marks)",
                            "plan": [
                                "Frame strategic issue",
                                "Analysis chain 1 (with evidence)",
                                "Analysis chain 2 (counterpoint)",
                                "Synthesis across functions",
                                "Final justified recommendation",
                            ],
                        },
                    ],
                    "common_mistakes": [
                        "Describing theory without context.",
                        "Using one data point with no chain analysis.",
                        "Stating a judgement without criteria.",
                    ],
                    "active_recall": [
                        f"Define {name.lower()} in one exam sentence.",
                        "Give one context-rich example from a real business.",
                        "Explain one short-run and one long-run impact.",
                        "Finish with a justified judgement criterion.",
                    ],
                    "quick_checks": [
                        {"q": f"What is the core idea in {name}?", "a": concept[0]},
                        {"q": "What lifts marks into top levels?", "a": "Context + linked analysis + explicit judgement."},
                        {"q": "How should you conclude?", "a": "Prioritise one option and justify against clear criteria."},
                    ],
                    "memory_hook": memory_hook(code, name),
                }
            )

        out_topics.append(
            {
                "topic": topic_num,
                "title": topic["title"],
                "short": topic["short"],
                "topic_exam_focus": [
                    "Use data/context to support analysis and judgement.",
                    "Follow command verbs exactly for each mark band.",
                    "Balance short-run and long-run stakeholder impacts.",
                ],
                "subtopics": subtopics,
            }
        )

    return {
        "meta": {
            "guide_version": "a-level-business-rebuild-2026-06-07",
            "title": "A-Level AQA Business Revision Guide",
            "description": "Rebuilt from training data slides and past-paper style signals for Paper 1, 2 and 3.",
        },
        "topics": out_topics,
    }


def build_flashcards_from_guide(guide_data):
    """Build proper exam-quality knowledge-testing flashcards from the guide JSON."""
    cards = []
    idx = 1

    def card(topic_num, name, front, back):
        nonlocal idx
        c = {
            "id": f"F{idx:04d}",
            "learning_aim": str(topic_num),
            "topic_number": int(topic_num),
            "topic": f"Topic {topic_num} - {name}",
            "front": front,
            "back": back,
        }
        cards.append(c)
        idx += 1

    for topic in guide_data["topics"]:
        t = topic["topic"]

        for sub in topic["subtopics"]:
            name = sub["name"]

            # --- Definition cards (one per key term) ---
            for term in sub.get("key_terms", []):
                term_text = (term.get("term") or "").strip()
                defn_text = (term.get("definition") or "").strip()
                if not term_text or not defn_text:
                    continue
                # Skip placeholder or slide-artefact definitions
                if "core concept used when analysing" in defn_text.lower():
                    continue
                # Truncate definition at first colon-preceded list fragment (slide merge artefact)
                for sep in [": Cash", ": Card", ": Cheque", ": Apple", ": Pay"]:
                    if sep in defn_text:
                        defn_text = defn_text.split(sep)[0].rstrip(" via").strip()
                if len(defn_text) < 10:
                    continue
                card(t, name,
                     f"What is the definition of '{term_text}'?",
                     defn_text)
                # Reverse card: definition → term
                card(t, name,
                     f"Which key term matches this definition: '{defn_text[:120]}{'...' if len(defn_text)>120 else ''}'?",
                     term_text)

            # --- Formula cards (one per formula) ---
            for formula in sub.get("formulae", []):
                f = (formula or "").strip()
                if "=" not in f or len(f) < 8:
                    continue
                # Skip unhelpful generic lines or garbled slide text
                if any(skip in f.lower() for skip in [
                    "where relevant", "compare legal", "compare risk",
                    "strategic control", "strategic fit", "is total revenue",
                    "money into the business", "use context"
                ]):
                    continue
                # Skip if left-hand side is too long (garbled text)
                lhs = f.split("=", 1)[0].strip()
                if len(lhs) > 60:
                    continue
                card(t, name,
                     f"State the formula for: {lhs}",
                     f)

            # --- Concept/understanding cards ---
            for i, point in enumerate(sub.get("concept_map", [])[:3]):
                p = (point or "").strip()
                if len(p) < 20 or p.lower().startswith("start with") or p.lower().startswith("apply at"):
                    continue
                card(t, name,
                     f"Complete the statement: '{p[:60].rstrip('.')}...' — what is the full point?",
                     p)

            # --- Quick-check Q&A cards ---
            for qc in sub.get("quick_checks", []):
                q_text = (qc.get("q") or "").strip()
                a_text = (qc.get("a") or "").strip()
                if not q_text or not a_text:
                    continue
                if "what lifts marks" in q_text.lower() or "how should you conclude" in q_text.lower():
                    continue
                card(t, name, q_text, a_text)

            # --- AO chain recall ---
            card(t, name,
                 f"In {name}, what do the four AOs stand for and what does each require?",
                 "AO1: Accurate knowledge and definitions. AO2: Application to context. AO3: Analysis — cause-effect chains. AO4: Evaluation — justified final judgement.")

            # --- Common-mistake recall ---
            mistakes = sub.get("common_mistakes", [])
            if mistakes:
                card(t, name,
                     f"Name one common mistake students make when answering questions on {name.lower()}.",
                     mistakes[0])

    return cards


def build_flashcards(topics, source_bank):
    # Legacy stub — main() now calls build_flashcards_from_guide instead.
    return []


def build_mc_bank(topics, source_bank):
    items = []
    idx = 1
    for topic_num, topic in topics.items():
        paper = "Paper 1" if int(topic_num) <= 6 else "Paper 2"
        for code, name in topic["subtopics"]:
            lines = source_bank[code]
            concept = declarative_points(lines)[0]
            options = [
                {"label": "A", "text": concept},
                {"label": "B", "text": "A judgement can be made without any contextual evidence."},
                {"label": "C", "text": "Higher marks are awarded for definition-only answers."},
                {"label": "D", "text": "Evaluation is optional in high-mark AQA responses."},
            ]
            items.append(
                {
                    "id": f"MC{idx:04d}",
                    "learning_aim": str(topic_num),
                    "topic_number": int(topic_num),
                    "topic": f"Topic {topic_num} - {name}",
                    "command_verb": "Identify",
                    "marks": 1,
                    "type": "multiple_choice",
                    "question": f"Which statement best reflects AQA expectations for {name.lower()}?",
                    "options": options,
                    "papers": [paper],
                    "mark_scheme": {
                        "instruction": "Award one mark for the correct answer.",
                        "answer": "A",
                        "explanation": "The correct option reflects source-backed concept knowledge and exam method.",
                        "additional_guidance": "Only one answer is allowed.",
                    },
                    "subject": "A-Level Business",
                }
            )
            idx += 1
    return items


def build_quiz(topics, source_bank):
    quiz = []
    idx = 1
    for topic_num, topic in topics.items():
        for code, name in topic["subtopics"]:
            lines = source_bank[code]
            concepts = declarative_points(lines)
            formulas = formulae_for_topic(topic_num, lines)

            quiz.append(
                {
                    "id": f"Q{idx:04d}",
                    "learning_aim": str(topic_num),
                    "topic_number": int(topic_num),
                    "topic": f"Topic {topic_num} - {name}",
                    "papers": ["Paper 1", "Paper 2", "Paper 3"],
                    "type": "mcq",
                    "question": f"In AQA A-Level Business, what is the strongest approach to {name.lower()}?",
                    "choices": [
                        "Use context, develop chain analysis, then justify a judgement.",
                        "Write definitions only and avoid business data.",
                        "List advantages without linking consequences.",
                        "Ignore command verbs and focus on length only.",
                    ],
                    "correct_index": 0,
                    "explanation": "Top-level responses combine AO1 accuracy, AO2 application, AO3 analysis and AO4 judgement.",
                }
            )
            idx += 1

            quiz.append(
                {
                    "id": f"Q{idx:04d}",
                    "learning_aim": str(topic_num),
                    "topic_number": int(topic_num),
                    "topic": f"Topic {topic_num} - {name}",
                    "papers": ["Paper 1", "Paper 2", "Paper 3"],
                    "type": "mcq",
                    "question": f"Which option best matches a valid quantitative anchor for {name.lower()}?",
                    "choices": [
                        formulas[0] if formulas else "Use relevant data and calculations where appropriate.",
                        "Profit always rises when revenue rises.",
                        "Ratios are optional and never support judgement.",
                        "One year of data is always enough for strategic conclusions.",
                    ],
                    "correct_index": 0,
                    "explanation": "AQA rewards calculations when interpreted in context and linked to decisions.",
                }
            )
            idx += 1

            quiz.append(
                {
                    "id": f"Q{idx:04d}",
                    "learning_aim": str(topic_num),
                    "topic_number": int(topic_num),
                    "topic": f"Topic {topic_num} - {name}",
                    "papers": ["Paper 1", "Paper 2", "Paper 3"],
                    "type": "mcq",
                    "question": f"Past-paper structure check: which pairing is correct?",
                    "choices": [
                        "Paper 1 includes 1-mark objective questions and 9-mark data response.",
                        "Paper 2 contains only 1-mark questions.",
                        "Paper 3 excludes synoptic judgement.",
                        "Section C and D are both 4-mark questions.",
                    ],
                    "correct_index": 0,
                    "explanation": "Extracted past-paper instructions show objective items, 9-mark analysis and 25-mark evaluation blocks.",
                }
            )
            idx += 1

            if concepts:
                quiz.append(
                    {
                        "id": f"Q{idx:04d}",
                        "learning_aim": str(topic_num),
                        "topic_number": int(topic_num),
                        "topic": f"Topic {topic_num} - {name}",
                        "papers": ["Paper 1", "Paper 2", "Paper 3"],
                        "type": "mcq",
                        "question": f"Which statement is most consistent with revision-guide content for {name.lower()}?",
                        "choices": [
                            concepts[0],
                            "Strategic choices should be made without stakeholder analysis.",
                            "Evaluation should avoid weighing alternatives.",
                            "Command words have no impact on mark allocation.",
                        ],
                        "correct_index": 0,
                        "explanation": "The correct response is derived from source-backed subtopic notes.",
                    }
                )
                idx += 1

    return quiz


def build_topic_questions(topics, source_bank):
    out = {str(i): [] for i in range(1, 11)}

    for topic_num, topic in topics.items():
        q_idx = 1
        primary_paper = "Paper 1" if int(topic_num) <= 6 else "Paper 2"
        for code, name in topic["subtopics"]:
            formulas = formulae_for_topic(topic_num, source_bank[code])

            blueprint = [
                ("Identify", 2, "AO1/AO2", "short", [primary_paper]),
                ("Explain", 3, "AO1/AO2/AO3", "short", [primary_paper]),
                ("Explain", 4, "AO1/AO2/AO3", "short", [primary_paper]),
                ("Analyse", 5, "AO1/AO2/AO3", "short", [primary_paper]),
                ("Analyse", 6, "AO1/AO2/AO3", "short", [primary_paper]),
                ("Analyse", 9, "AO1/AO2/AO3", "short", [primary_paper]),
                ("Assess", 10, "AO1/AO2/AO3/AO4", "extended_levels", [primary_paper]),
                ("Evaluate", 12, "AO1/AO2/AO3/AO4", "extended_levels", [primary_paper, "Paper 3"]),
                ("Evaluate", 16, "AO1/AO2/AO3/AO4", "extended_levels", [primary_paper, "Paper 3"]),
                ("Evaluate", 20, "AO1/AO2/AO3/AO4", "extended_levels", [primary_paper, "Paper 3"]),
                ("Evaluate", 24, "AO1/AO2/AO3/AO4", "extended_levels", [primary_paper, "Paper 3"]),
                ("Evaluate", 25, "AO1/AO2/AO3/AO4", "extended_levels", [primary_paper, "Paper 3"]),
                ("Analyse", 8, "AO1/AO2/AO3", "short", [primary_paper]),
                ("Assess", 13, "AO1/AO2/AO3/AO4", "extended_levels", [primary_paper, "Paper 3"]),
            ]

            for verb, marks, ao, qtype, papers in blueprint:
                is_extended = qtype == "extended_levels"
                scenario = "" if marks <= 4 else make_case_study(code, topic_num, name, marks)
                question = (
                    f"{verb} the extent to which effective {name.lower()} will improve this business's performance."
                    if marks >= 10
                    else f"{verb} one way that {name.lower()} could influence business performance."
                )
                mark_scheme = (
                    levels_mark_scheme(name, topic_num, formulas)
                    if is_extended
                    else short_question_mark_scheme(name, marks)
                )
                if not is_extended:
                    mark_scheme = {
                        **mark_scheme,
                        "formulae": [{"math": f, "notes": "Use where relevant to support analysis."} for f in formulas[:2]],
                    }

                out[topic_num].append(
                    {
                        "id": f"T{int(topic_num):02d}Q{q_idx:04d}",
                        "learning_aim": topic_num,
                        "topic_number": int(topic_num),
                        "topic_title": topic["title"].replace("Topic " + topic_num + ": ", ""),
                        "topic": f"Topic {topic_num} - {name}",
                        "command_verb": verb,
                        "marks": marks,
                        "ao": ao,
                        "scenario": scenario,
                        "question": question,
                        "guidance": f"({marks})",
                        "type": qtype,
                        "papers": papers,
                        "mark_scheme": mark_scheme,
                        "subject": "A-Level Business",
                    }
                )
                q_idx += 1

    return out


def save_json(path, data):
    path.write_text(json.dumps(data, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")


def extract_paper_style_notes(extracted_text):
    lines = extracted_text.splitlines()
    picks = []
    patterns = [
        "Only one answer per question is allowed",
        "Answer all questions in Section A and Section B",
        "Answer one question from Section C and one question from Section D",
        "[1 mark]",
        "[9 marks]",
        "[25 marks]",
        "Using the data",
    ]
    for line in lines:
        t = line.strip()
        if not t:
            continue
        if any(p.lower() in t.lower() for p in patterns):
            picks.append(t)
    return unique(picks)[:24]


def main():
    ppt_map, extracted = read_sources()

    source_bank = {}
    for topic in TOPIC_SPEC.values():
        for code, name in topic["subtopics"]:
            source_bank[code] = source_lines_for_subtopic(ppt_map, code, name)

    guide = build_guide(TOPIC_SPEC, source_bank)
    flashcards = build_flashcards_from_guide(guide)
    mc_bank = build_mc_bank(TOPIC_SPEC, source_bank)
    quiz = build_quiz(TOPIC_SPEC, source_bank)
    topic_questions = build_topic_questions(TOPIC_SPEC, source_bank)

    save_json(DATA_DIR / "guide_content.json", guide)
    save_json(DATA_DIR / "flashcards.json", flashcards)
    save_json(DATA_DIR / "mc.json", mc_bank)
    save_json(DATA_DIR / "quiz.json", quiz)
    for topic_num, questions in topic_questions.items():
        save_json(DATA_DIR / f"topic_{topic_num}.json", questions)

    analysis_md = [
        "# A-Level Business Content Rebuild",
        "",
        "Generated from training-data sources:",
        "- ppt_extracted_map.json (subtopic slide text)",
        "- extracted_content.txt (AQA paper wording and section style)",
        "",
        "Past-paper style signals captured:",
    ]
    analysis_md.extend([f"- {x}" for x in extract_paper_style_notes(extracted)])
    analysis_md.extend(
        [
            "",
            "Output files regenerated from scratch:",
            "- guide_content.json",
            "- flashcards.json",
            "- mc.json",
            "- quiz.json",
            "- topic_1.json ... topic_10.json",
            "",
            "Generation date: 2026-06-07",
        ]
    )
    (DATA_DIR / "ANALYSIS.md").write_text("\n".join(analysis_md) + "\n", encoding="utf-8")

    print("Rebuild complete:")
    print(f"- Guide topics: {len(guide['topics'])}")
    print(f"- Flashcards: {len(flashcards)}")
    print(f"- MC bank: {len(mc_bank)}")
    print(f"- Quiz items: {len(quiz)}")
    print(f"- Topic questions: {sum(len(v) for v in topic_questions.values())}")


if __name__ == "__main__":
    main()
