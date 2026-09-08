# -*- coding: utf-8 -*-
"""
Regenerate BTEC IT Unit 1 predicted papers (1-3) + mark schemes (1-3)
to mirror the real June 2026 paper (60297T) structure.

Reuses the exact <head> (CSS + refresh-loader) and tail <script> (zoom/nav)
from the existing files, regenerating only the body content.
"""
import os

DIR = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\IT-AAQ\unit-1\predicted-papers"


def read_chunks(fname):
    with open(os.path.join(DIR, fname), encoding="utf-8") as f:
        s = f.read()
    head = s[: s.index("</head>") + len("</head>")]
    tail = s[s.index("<script>\n  (function") :]
    return head, tail


PAPER_HEAD, PAPER_TAIL = read_chunks("paper-1.html")
MS_HEAD, MS_TAIL = read_chunks("mark-scheme-1.html")


def paper_topbar(n):
    N = str(n)
    return f"""\n<body class="paper-viewer">

<div class="viewer-topbar no-print">
  <div class="viewer-group viewer-group-nav">
    <span class="viewer-title">RA10 • Unit 1 • Paper {N}</span>
    <button class="viewer-nav-btn active" data-target="cover" onclick="scrollToPage(0)">Cover</button>
    <button class="viewer-nav-btn" data-q="1" onclick="scrollToQuestion(1)">Q1</button>
    <button class="viewer-nav-btn" data-q="2" onclick="scrollToQuestion(2)">Q2</button>
    <button class="viewer-nav-btn" data-q="3" onclick="scrollToQuestion(3)">Q3</button>
    <button class="viewer-nav-btn" data-q="4" onclick="scrollToQuestion(4)">Q4</button>
  </div>
  <div class="viewer-group viewer-group-actions">
    <span class="viewer-zoom-label">Zoom</span>
    <button class="viewer-btn" id="zoomOutBtn" type="button">-</button>
    <span class="viewer-zoom-value" id="zoomLevel">100%</span>
    <button class="viewer-btn" id="zoomInBtn" type="button">+</button>
    <button class="viewer-btn" id="zoomResetBtn" type="button">Reset</button>
    <span class="viewer-counter" id="viewerPageCounter">1 / 1</span>
    <button class="viewer-btn viewer-btn-primary" type="button" onclick="window.print()">Print / Save PDF</button>
    <a class="viewer-btn" href="mark-scheme-{N}.html">Mark Scheme</a>
  </div>
</div>
"""


def paper_cover(paper, n):
    N = str(n)
    topic_rows = []
    for i, q in enumerate(paper["questions"], 1):
        topic_rows.append(
            f'        <div class="cover-topic-row"><span class="cover-topic-q q{i}">Q{i}</span><span class="cover-topic-desc">{q["topics"]}</span><span class="cover-topic-aims">[{q["aims"]}]</span></div>'
        )
    mk = "".join(f"<td>{q['marks']}</td>" for q in paper["questions"])
    return f"""
<!-- FRONT COVER -->
<div class="page">
  <div class="cover-header">
    <div class="cover-logo">RA10</div>
    <div class="cover-tagline">
      <div class="cover-tagline-main">PREDICTED PAPERS</div>
      <div class="cover-tagline-sub">BTEC Level 3 IT Unit 1 • January 2027</div>
    </div>
  </div>

  <div class="cover-badge">PREDICTED PAPER {N}</div>
  <div class="cover-detail">BTEC Level 3 National Extended Certificate</div>
  <div class="cover-title">Information Technology<br>Unit 1: IT Systems</div>
  <div class="cover-subtitle">Paper Reference: RA10/IT/U1/PP{N} • 90 marks • 2 hours</div>

  <div class="cover-meta-grid">
    <div class="cover-topics">
      <div class="cover-topics-title">Topics Covered in This Paper</div>
      <div class="cover-topics-grid">
{chr(10).join(topic_rows)}
      </div>
    </div>

    <div class="cover-candidate">
      <div class="cover-candidate-title">Candidate Details</div>
      <div class="cover-fields">
        <div><div class="cover-field-label">Name</div><div class="cover-field-line"></div></div>
        <div><div class="cover-field-label">Centre/School</div><div class="cover-field-line"></div></div>
        <div><div class="cover-field-label">Candidate Number</div><div class="cover-field-line"></div></div>
        <div><div class="cover-field-label">Date</div><div class="cover-field-line"></div></div>
      </div>
    </div>
  </div>

  <div class="cover-bottom-grid">
    <table class="cover-marks">
      <tr><th>Question</th><th>1</th><th>2</th><th>3</th><th>4</th><th>Total</th></tr>
      <tr><td class="cover-marks-label">Marks Available</td>{mk}<td>90</td></tr>
      <tr><td class="cover-marks-label">Marks Awarded</td><td></td><td></td><td></td><td></td><td></td></tr>
    </table>

    <div class="cover-instructions">
      <div class="instr-box">
        <div class="instr-title">Instructions</div>
        <ul><li>Answer ALL questions</li><li>Use black ink or pen</li><li>Fill in your details</li><li>Show working where required</li></ul>
      </div>
      <div class="instr-box">
        <div class="instr-title">Information</div>
        <ul><li>Marks shown in brackets</li><li>Answer in spaces provided</li><li>Read questions carefully</li><li>Check answers at the end</li></ul>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <span>For revision purposes • Not an official Pearson paper</span>
    <span class="page-number">Page 1</span>
  </div>
</div>
"""


def paper_part_html(part):
    label = part["label"]
    text = part["text"]
    marks = part["marks"]
    kind = part.get("kind", "short")
    out = '  <div class="sub-question">\n'
    out += f'    <div class="sub-q-row"><span class="sub-q-label">{label}</span><span class="sub-q-text">{text}</span><span class="sub-q-marks">({marks})</span></div>\n'
    if kind == "points":
        out += '    <div class="point-answer"><div class="point-number">1</div><div class="point-lines"></div></div>\n'
        out += '    <div class="point-answer"><div class="point-number">2</div><div class="point-lines"></div></div>\n'
    else:
        out += '    <div class="answer-lines"></div>\n'
    out += '  </div>\n'
    return out


def render_diagram_page(part, qnum, qmarks, N):
    guide = part.get("guide", [])
    out = '<div class="page diagram-page">\n'
    out += f'  <div class="question-header">QUESTION {qnum} — Diagram</div>\n'
    out += '  <div class="sub-question">\n'
    out += f'    <div class="sub-q-row"><span class="sub-q-label">{part["label"]}</span><span class="sub-q-text">{part["text"]}</span><span class="sub-q-marks">({part["marks"]})</span></div>\n'
    out += '  </div>\n'
    if guide:
        out += '  <div class="diagram-guide">\n    <p>The drawing must include:</p>\n    <ul>\n'
        for g in guide:
            out += f'      <li>{g}</li>\n'
        out += '    </ul>\n  </div>\n'
    out += f'  <div class="diagram-box">Use this page to draw your {part.get("diagram_kind", "diagram")}.</div>\n'
    out += f'  <div class="q-total-bar">Question {qnum} Total: {qmarks} marks</div>\n'
    out += '  <div class="page-footer">\n'
    out += f'    <span>RA10 — BTEC IT Unit 1 — Predicted Paper {N}</span>\n'
    out += '    <span class="page-number">Page 1</span>\n'
    out += '  </div>\n'
    out += '</div>\n'
    return out


def paper_question_pages(paper, n):
    N = str(n)
    body = ""
    for qi, q in enumerate(paper["questions"], 1):
        body += f'\n<!-- QUESTION {qi} -->\n<div class="page">\n'
        body += f'  <div class="question-header">QUESTION {qi} — {q["marks"]} marks</div>\n'
        body += f'  <div class="scenario-box">\n    <div class="scenario-title">{q["title"]}</div>\n'
        body += f'    <div class="scenario-text">{q["scenario"]}</div>\n  </div>\n'
        for part in q["parts"]:
            if part.get("kind") == "diagram":
                continue
            body += paper_part_html(part)
        body += f'  <div class="page-footer">\n    <span>RA10 — BTEC IT Unit 1 — Predicted Paper {N}</span>\n    <span class="page-number">Page 1</span>\n  </div>\n</div>\n'

        for part in q["parts"]:
            if part.get("kind") == "diagram":
                body += render_diagram_page(part, qi, q["marks"], N)

        body += f'<div class="page">\n  <div class="question-header">QUESTION {qi} (continued)</div>\n'
        body += f'  <div class="q-total-bar">Question {qi} Total: {q["marks"]} marks'
        if qi == 4:
            body += " • Paper Total: 90 marks"
        body += '</div>\n'
        body += f'  <div class="page-footer">\n    <span>RA10 — BTEC IT Unit 1 — Predicted Paper {N}</span>\n    <span class="page-number">Page 1</span>\n  </div>\n</div>\n'
    return body


def ms_topbar(n):
    N = str(n)
    return f"""\n<body class="paper-viewer">

<div class="viewer-topbar no-print">
  <div class="viewer-group viewer-group-nav">
    <span class="viewer-title">RA10 • Unit 1 • Mark Scheme {N}</span>
    <button class="viewer-nav-btn active" data-target="cover" onclick="scrollToPage(0)">Cover</button>
    <button class="viewer-nav-btn" data-q="1" onclick="scrollToQuestion(1)">Q1</button>
    <button class="viewer-nav-btn" data-q="2" onclick="scrollToQuestion(2)">Q2</button>
    <button class="viewer-nav-btn" data-q="3" onclick="scrollToQuestion(3)">Q3</button>
    <button class="viewer-nav-btn" data-q="4" onclick="scrollToQuestion(4)">Q4</button>
  </div>
  <div class="viewer-group viewer-group-actions">
    <span class="viewer-zoom-label">Zoom</span>
    <button class="viewer-btn" id="zoomOutBtn" type="button">-</button>
    <span class="viewer-zoom-value" id="zoomLevel">100%</span>
    <button class="viewer-btn" id="zoomInBtn" type="button">+</button>
    <button class="viewer-btn" id="zoomResetBtn" type="button">Reset</button>
    <span class="viewer-counter" id="viewerPageCounter">1 / 1</span>
    <button class="viewer-btn viewer-btn-primary" type="button" onclick="window.print()">Print / Save PDF</button>
    <a class="viewer-btn" href="paper-{N}.html">Question Paper</a>
  </div>
</div>
"""


def ms_cover(n):
    N = str(n)
    return f"""
<!-- COVER -->
<div class="page">
  <div class="cover-top-bar">
    <div class="cover-ra10-logo">RA10</div>
    <div class="cover-ra10-tag"><strong>Mark Schemes</strong><br>BTEC Level 3 National Extended Certificate in IT</div>
  </div>
  <div style="margin-bottom:10px;"><div class="ms-badge">Mark Scheme — Predicted Paper {N}</div></div>
  <div class="cover-title">Unit 1: Information Technology Systems</div>
  <div class="cover-sub">BTEC Level 3 National Extended Certificate in Information Technology</div>
  <div class="cover-info-box">
    <table>
      <tr><td>Paper Reference</td><td>RA10/IT/U1/PP{N}</td></tr>
      <tr><td>Total marks</td><td>90</td></tr>
      <tr><td>Series</td><td>Practice Paper &mdash; January 2027</td></tr>
    </table>
  </div>
  <p style="margin-bottom:10px; font-size:10.5pt;">This mark scheme has been prepared by RA10 for use with Predicted Paper {N}. It follows the Pearson BTEC Level 3 mark scheme conventions for Unit 1 (AAQ 2025, Issue 5).</p>
  <p style="margin-bottom:10px; font-size:10pt; color:#333;"><strong>Using this mark scheme:</strong><br>
  For short-answer questions, award the marks specified. "Accept any other appropriate/alternative response" means equivalent correct answers should be credited.<br>
  For levels-based questions, use the Level Descriptors holistically alongside the indicative content. Indicative content is not a checklist.</p>
  <p style="font-size:10pt; color:#555; font-style:italic;">For revision purposes only. Not an official Pearson qualification document.</p>
  <div class="page-footer">
    <span>RA10 — Mark Scheme {N} &bull; <em>For revision purposes only.</em></span>
    <span>Page 1</span>
  </div>
</div>
<!-- MARK SCHEME CONTENT -->
"""


def ms_part_html(part):
    label = part["label"]
    text = part["text"]
    marks = part["marks"]
    ms = part.get("ms", {})
    instruction = ms.get("instruction", "Award one mark for each correct response.")
    points = ms.get("points", [])
    accept = ms.get("accept")
    dna = ms.get("dna")
    indicative = ms.get("indicative", [])
    levels = ms.get("levels", [])

    badge = f"{marks} marks"
    if levels:
        badge += " — Levels"

    out = '  <div class="part">\n'
    out += f'    <div class="part-header"><span class="part-label">{label}</span><span class="part-q">{text}</span><span class="part-marks-badge">{badge}</span></div>\n'
    if levels and indicative:
        out += '    <div class="levels-box">\n'
        out += '      <div class="indicative-section"><div class="indicative-heading">Indicative Content (not prescriptive — reward any well-developed point)</div><ul class="indicative-list">\n'
        for it in indicative:
            out += f'        <li>{it}</li>\n'
        out += '        </ul>\n      </div>\n'
        out += '      <table class="levels-table">\n'
        out += '        <tr><th>Level</th><th>Mark</th><th>Descriptor</th></tr>\n'
        for (lv, mk, desc) in levels:
            out += f'        <tr class="level-{lv}"><td>{lv}</td><td class="level-mark">{mk}</td><td>{desc}</td></tr>\n'
        out += '      </table>\n    </div>\n'
    else:
        out += '    <div class="ms-box">\n'
        out += f'      <div class="ms-instruction">{instruction}</div>\n'
        out += '      <ul class="ms-points">\n'
        for p in points:
            out += f'        <li>{p}</li>\n'
        out += '      </ul>\n'
        if accept:
            out += f'      <div class="ms-accept">{accept}</div>\n'
        if dna:
            out += f'      <div class="ms-dna"><strong>Do not accept:</strong> {dna}</div>\n'
        out += '    </div>\n'
    out += '  </div>\n\n'
    return out


def ms_question_pages(paper, n):
    N = str(n)
    body = ""
    for qi, q in enumerate(paper["questions"], 1):
        title_short = q["title"].split(" — ")[-1]
        body += '<div class="page">\n'
        body += f'  <h2 style="font-size:13pt; margin-bottom:16px; border-bottom:2px solid #000; padding-bottom:6px;">Question {qi} — {title_short} &nbsp; <span style="font-size:10pt; font-weight:normal">({q["marks"]} marks total)</span></h2>\n'
        for part in q["parts"]:
            body += ms_part_html(part)
        tail = " &nbsp;&nbsp;&nbsp; Paper Total: 90 marks" if qi == 4 else ""
        body += f'  <div style="border-top:2px solid #000; margin-top:12px; padding-top:6px; text-align:right; font-weight:bold; font-size:10pt;">Question {qi} Total: {q["marks"]} marks{tail}</div>\n'
        body += '  <div class="page-footer">\n'
        body += f'    <span>RA10 — Mark Scheme {N}</span><span>Page 1</span>\n'
        body += '  </div>\n'
        body += '</div>\n\n'
    return body


# ----------------------- shared mark scheme content -----------------------
P = {
    "firewall": {
        "instruction": "Award one mark per correct linked point, up to a maximum of four marks.",
        "points": [
            "A firewall examines/checks data packets entering and leaving the network (1)",
            "It filters traffic against a set of security rules (1)",
            "It blocks unauthorised/unsolicited external access to the system (1)",
            "So malicious traffic cannot reach (and harm) the stored data (1)",
        ],
        "accept": "Accept any other appropriate/alternative response",
    },
    "protect_tech": {
        "instruction": "Award up to six marks using the levels-based approach.",
        "indicative": [
            "Encryption — data is scrambled so it cannot be read if intercepted",
            "Multi-factor authentication / 2FA — a second factor (code, biometric) is required, so access is blocked even if a password is stolen",
            "Biometric authentication (fingerprint/facial recognition) — uses a unique physical feature so only the authorised user can log in",
            "Firewalls — block unauthorised network traffic",
            "Access control/permissions — restrict data access to authorised staff",
        ],
        "levels": [
            [0, "0", "No rewardable material."],
            [1, "1–3", "Identifies one technique with limited explanation of how it protects data. (AO2)"],
            [2, "4–5", "Identifies two or more techniques with developed explanation of how each protects customer/patient data. (AO2/AO3a)"],
            [3, "6", "Thoroughly discusses several techniques (e.g. encryption, MFA, biometrics, firewalls) with clear explanation of how each protects data, contextualised to the organisation. (AO2/AO3a)"],
        ],
    },
    "online_benefit": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "Convenient for customers (1) — bookings can be made 24/7 from any device without phoning (1)",
            "Reduced staff workload (1) — fewer manual entries/phone calls, freeing staff (1)",
            "Fewer errors (1) — data entered directly by the customer reduces transcription mistakes (1)",
            "Instant confirmation (1) — the system confirms the booking immediately (1)",
        ],
        "accept": "Accept any other appropriate/alternative response",
    },
    "online_drawback": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "Cost of setup/hardware/software (1) — the business must purchase new systems (1)",
            "Staff need training (1) — time and cost to learn the new system (1)",
            "Technical failure/downtime (1) — if the system or internet goes down, bookings stop (1)",
            "Security risk (1) — customer data could be exposed to hackers (1)",
        ],
        "accept": "Accept any other appropriate/alternative response",
    },
    "input_dev": {
        "instruction": "Award one mark for each correct input device, up to a maximum of two marks.",
        "points": ["Keyboard (1)", "Mouse (1)", "Touchscreen (1)", "Barcode/QR scanner (1)", "Microphone (1)"],
        "accept": "Accept any other appropriate input device",
    },
    "output_dev": {
        "instruction": "Award one mark for each correct output device, up to a maximum of two marks.",
        "points": ["Monitor/screen (1)", "Printer (1)", "Speakers (1)", "Projector (1)"],
        "accept": "Accept any other appropriate output device",
    },
    "app_sw": {
        "instruction": "Award one mark for each correct type of application software, up to a maximum of two marks.",
        "points": ["Word processing software (1)", "Spreadsheet software (1)", "Database software (1)", "Presentation software (1)", "Email client (1)", "Accounting/business software (1)", "Web browser (1)"],
        "accept": "Accept any other appropriate application software type",
    },
    "lan_benefit": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "File/resource sharing (1) — staff can share files and printers within the office (1)",
            "Centralised storage (1) — data stored on a server so staff access the same up-to-date information (1)",
            "Software sharing (1) — one licensed copy/network software shared by all users (1)",
            "Communication (1) — staff can message/email each other within the office (1)",
        ],
        "accept": "Accept any other appropriate/alternative response",
    },
    "wan_benefit": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "Connect branches to head office (1) — branches communicate/share data with the main office over distance (1)",
            "Centralised data (1) — all branches access the same central records in real time (1)",
            "Centralised backup/management (1) — data backed up and systems managed centrally (1)",
            "Shared resources across sites (1) — e.g. shared systems/email across the organisation (1)",
        ],
        "accept": "Accept any other appropriate/alternative response",
    },
    "aup": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "Do not visit inappropriate/offensive websites (1) — avoids malware and misuse of company systems (1)",
            "Do not download unauthorised software (1) — prevents malware and licence breaches (1)",
            "Do not share passwords (1) — protects accounts from unauthorised access (1)",
            "Use systems only for authorised work purposes (1) — protects productivity and data (1)",
        ],
        "accept": "Accept any other appropriate acceptable behaviour",
    },
    "utility": {
        "instruction": "Award up to nine marks using the levels-based approach.",
        "indicative": [
            "Antivirus software — detects/quarantines/removes malware",
            "Disk defragmentation — reorganises files to improve access speed",
            "Disk cleanup — removes temporary/unwanted files to free storage",
            "Backup software — schedules automatic backups to protect against data loss",
            "Compression software — reduces file size to save storage space",
            "System monitoring/performance tools — identify bottlenecks and resource usage",
            "Encryption tools — secure sensitive data",
            "Firewall management — controls network traffic",
            "Cost vs benefit — most utility software is low cost; some require licences",
            "Needs staff knowledge to use effectively — training requirement",
        ],
        "levels": [
            [0, "0", "No rewardable material."],
            [1, "1–3", "Basic understanding of utility software. Names one or two utilities with limited explanation of their role. (AO2)"],
            [2, "4–6", "Good understanding. Describes several utility software features and explains how they maintain, manage or optimise the system in context. (AO2/AO3a)"],
            [3, "7–9", "Comprehensive evaluation. Discusses a range of utility software with clear evaluation of how each maintains/manages/optimises, weighing benefits against considerations such as cost and training, with a justified view. (AO2/AO3a/AO3b)"],
        ],
    },
    "online_factor": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of two marks.",
        "points": [
            "Cost (1) — subscription fees vs free options must suit the budget (1)",
            "Security (1) — how well the system protects client data (1)",
            "Ease of use (1) — staff must be able to use it effectively (1)",
            "Reliability/uptime (1) — the system must be available when needed (1)",
            "Features/functionality (1) — must meet the specific needs of the work (1)",
            "Device compatibility (1) — must work on the devices staff use (1)",
        ],
        "accept": "Accept any other appropriate factor",
    },
    "data_loss": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "Financial loss (1) — lost records may mean lost business/income or compensation (1)",
            "Reputational damage (1) — clients lose trust in the organisation (1)",
            "Legal/compliance breach (1) — may breach data protection legislation, risking fines (1)",
            "Operational disruption (1) — staff cannot do their work without the lost data (1)",
        ],
        "accept": "Accept any other appropriate impact. Do not accept 'loss of data' (given in the question).",
    },
    "privacy": {
        "instruction": "Award up to nine marks using the levels-based approach.",
        "indicative": [
            "Must comply with UK GDPR / Data Protection Act — client data is personal data",
            "Need lawful basis for processing; obtain client consent where required",
            "Data must be kept secure and confidential (encryption, access controls)",
            "Restrict access to authorised staff only (least privilege)",
            "Clients have rights — access, rectification, erasure, objection to processing",
            "Staff training on privacy and ethical handling of client data",
            "Clear privacy notice explaining how data is used",
            "Data minimisation — collect only what is necessary",
            "Consequences of breach — fines, legal action, reputational damage, loss of trust",
        ],
        "levels": [
            [0, "0", "No rewardable material."],
            [1, "1–3", "Basic understanding of privacy. Mentions one or two considerations with limited application to client data. (AO2)"],
            [2, "4–6", "Good application. Discusses several privacy implications (GDPR, consent, access control, client rights) with some development in context. (AO2/AO3a)"],
            [3, "7–9", "Comprehensive evaluation. Thorough discussion of legal (GDPR), ethical and practical privacy implications of handling client data, including consent, data minimisation, security, client rights and consequences of breach, with a balanced judgement. (AO2/AO3a/AO3b)"],
        ],
    },
    "cloud_model": {
        "instruction": "Award up to three marks for an accurate description of how the organisation can use a cloud computing model.",
        "points": [
            "Identifies a model (e.g. IaaS/SaaS/PaaS or cloud backup service) (1)",
            "Describes how data is stored on remote servers managed by a provider (1)",
            "Explains access over the internet rather than on-site hardware (1)",
        ],
        "accept": "Accept any appropriate cloud model correctly described",
    },
    "cloud_models": {
        "instruction": "Award up to nine marks using the levels-based approach.",
        "indicative": [
            "Infrastructure as a Service (IaaS) — rental of servers/storage; most control, most management",
            "Platform as a Service (PaaS) — development platform; middle level of control",
            "Software as a Service (SaaS) — ready-made application; least control, least management",
            "Private cloud — dedicated to one organisation; more secure, more costly",
            "Public cloud — shared provider; cheaper, less control",
            "Hybrid cloud — mixes private and public; balances security and cost",
            "For backup: public cloud/IaaS is cost-effective for large data volumes",
            "Security/compliance considerations for the specific organisation",
            "Scalability — cloud scales up/down with demand",
            "Cost — pay-as-you-go vs capital expenditure",
        ],
        "levels": [
            [0, "0", "No rewardable material."],
            [1, "1–3", "Basic understanding of cloud models. Names one or two models (IaaS/PaaS/SaaS or public/private) with limited application. (AO2)"],
            [2, "4–6", "Good evaluation. Compares several cloud models and how they could meet the organisation's needs, with some development. (AO2/AO3a)"],
            [3, "7–9", "Comprehensive evaluation. Thorough comparison of multiple cloud models (service and deployment), evaluated against the organisation's needs, security, cost and scalability, with a justified recommendation. (AO2/AO3a/AO3b)"],
        ],
    },
    "web_vs_file": {
        "instruction": "Award up to twelve marks using the levels-based approach.",
        "indicative": [
            "Web server — serves web pages over the internet; enables public access",
            "File server — stores and shares files on a local network; controlled centrally",
            "Performance: web server optimised for concurrent HTTP requests; file server for file I/O throughput",
            "Efficiency: web server caches content and handles many simultaneous clients; file server provides centralised storage",
            "Security: web server exposed to the internet (needs strong protection); file server on the internal network is more contained",
            "Accessibility: web server accessible remotely; file server typically LAN/remote access only",
            "Suitability depends on need — serving content publicly vs internal file sharing",
            "Cost and management considerations of each",
        ],
        "levels": [
            [0, "0", "No rewardable material."],
            [1, "1–4", "Basic understanding of web server and/or file server. Limited comparison, mostly descriptive. (AO2)"],
            [2, "5–8", "Good evaluation comparing performance and efficiency of web server vs file server with several points developed in context. (AO2/AO3a)"],
            [3, "9–12", "Comprehensive evaluation. Thorough, balanced comparison covering performance, efficiency, security, accessibility and suitability, clearly contextualised, with a justified conclusion. (AO2/AO3a/AO3b)"],
        ],
    },
    "login_flowchart": {
        "instruction": "Award up to nine marks using the levels-based approach for a flowchart showing the login process.",
        "indicative": [
            "Start symbol shown",
            "Username entry step",
            "Password entry step (masked)",
            "A decision/check step (are the details correct?)",
            "Access granted outcome",
            "Access denied / retry path",
            "Logout/end step",
            "Correct flow arrows and annotations",
        ],
        "levels": [
            [0, "0", "No rewardable material."],
            [1, "1–3", "Basic flowchart showing a few of the main steps with limited logical flow or annotations. (AO2)"],
            [2, "4–6", "Good flowchart showing most of the correct steps in sequence with sensible flow and some annotations. (AO2/AO3a)"],
            [3, "7–9", "Comprehensive, logically correct flowchart showing all key steps (start, username, password, check, access, logout) with a decision/retry path and clear arrows/annotations. (AO2/AO3a)"],
        ],
    },
    "network_diagram": {
        "points": [
            "Central server shown (1)",
            "Desktop computers shown connecting to the server (1)",
            "Printer (and managers' offices) shown (1)",
            "The mobile worker's laptop and smartphone shown (1)",
            "PAN between laptop and smartphone shown (1)",
            "Connection over the internet to the office server shown with annotations (1)",
        ],
    },
}


def make_papers():
    def Q1(title, scenario):
        return {
            "title": title, "scenario": scenario, "marks": 22,
            "topics": "Input/output devices, online systems benefits & drawbacks, firewall, data protection techniques",
            "aims": "A1, A2, C1, D2",
            "parts": [
                {"label": "(a)(i)", "text": "Give two input devices that will be needed.", "marks": 2, "kind": "short", "ms": P["input_dev"]},
                {"label": "(a)(ii)", "text": "Give two output devices that will be needed.", "marks": 2, "kind": "short", "ms": P["output_dev"]},
                {"label": "(b)(i)", "text": "Explain two benefits of using an online booking/ordering system.", "marks": 4, "kind": "points", "ms": P["online_benefit"]},
                {"label": "(b)(ii)", "text": "Explain two drawbacks of using an online booking/ordering system.", "marks": 4, "kind": "points", "ms": P["online_drawback"]},
                {"label": "(c)", "text": "Describe how a firewall protects the data stored on the computer system.", "marks": 4, "kind": "short", "ms": P["firewall"]},
                {"label": "(d)", "text": "Discuss techniques, other than usernames and passwords, that can be used to protect customer/patient data.", "marks": 6, "kind": "levels", "ms": P["protect_tech"]},
            ],
        }

    def Q2(title, scenario, diagram_flowchart=False):
        parts = [
            {"label": "(a)", "text": "Give two types of application software that might be installed.", "marks": 2, "kind": "short", "ms": P["app_sw"]},
            {"label": "(b)(i)", "text": "Explain two benefits of using a LAN in each office.", "marks": 4, "kind": "points", "ms": P["lan_benefit"]},
            {"label": "(b)(ii)", "text": "Explain two benefits of connecting the branches to the main office using a WAN.", "marks": 4, "kind": "points", "ms": P["wan_benefit"]},
            {"label": "(c)", "text": "Explain two acceptable behaviours that should be included in the Acceptable Use Policy.", "marks": 4, "kind": "points", "ms": P["aup"]},
        ]
        if diagram_flowchart:
            parts.append({
                "label": "(d)", "text": "Draw a flowchart to show the process for logging into the system securely. Include: start, entering a username, entering a password, a security check, access to the system, and logout.",
                "marks": 9, "kind": "diagram", "diagram_kind": "flowchart",
                "guide": ["start: opening the login screen", "entering a username", "entering a password (shown as a security step)", "a check that the details are correct", "access granted to the system", "logout / session end", "arrows and annotations showing the flow"],
                "ms": P["login_flowchart"],
            })
        else:
            parts.append({"label": "(d)", "text": "Evaluate the features of utility software that can be used to maintain, manage and optimise the computer systems.", "marks": 9, "kind": "levels", "ms": P["utility"]})
        return {
            "title": title, "scenario": scenario, "marks": 23,
            "topics": "Application software, LAN/WAN benefits, Acceptable Use Policy" + (", flowchart" if diagram_flowchart else ", utility software"),
            "aims": "A1, B1, C1",
            "parts": parts,
        }

    def Q3(title, scenario, worker_name):
        return {
            "title": title, "scenario": scenario, "marks": 21,
            "topics": "Network diagram, PAN, online systems factor, data loss, privacy",
            "aims": "A1, B1, C1, F1",
            "parts": [
                {"label": "(a)", "text": f"Draw a diagram to show how the company network is set up and how {worker_name} connects when working remotely. The diagram must include devices and systems that are used, connection types and annotations.",
                 "marks": 6, "kind": "diagram", "diagram_kind": "network diagram",
                 "guide": ["all devices and systems that are used", "connection types (e.g. LAN, PAN, internet/WAN)", "annotations labelling each device and connection"],
                 "ms": {"instruction": "Award up to six marks for a correct annotated network diagram.", "points": P["network_diagram"]["points"]}},
                {"label": "(b)", "text": "Explain one factor that affects the use and selection of online systems.", "marks": 2, "kind": "short", "ms": P["online_factor"]},
                {"label": "(c)", "text": "Loss of data is one impact on the company. Explain two other impacts of the loss of data.", "marks": 4, "kind": "points", "ms": P["data_loss"]},
                {"label": "(d)", "text": "Evaluate the privacy implications for the company when working with client data.", "marks": 9, "kind": "levels", "ms": P["privacy"]},
            ],
        }

    def Q4(title, scenario):
        return {
            "title": title, "scenario": scenario, "marks": 24,
            "topics": "Cloud computing models, web server vs file server",
            "aims": "A1, C1, D1",
            "parts": [
                {"label": "(a)", "text": "Describe how the company can use one cloud computing model.", "marks": 3, "kind": "short", "ms": P["cloud_model"]},
                {"label": "(b)", "text": "Evaluate how different cloud computing models could fit the needs of the company.", "marks": 9, "kind": "levels", "ms": P["cloud_models"]},
                {"label": "(c)", "text": "Evaluate the performance and efficiency of a web server compared to a file server.", "marks": 12, "kind": "levels", "ms": P["web_vs_file"]},
            ],
        }

    return [
        {
            "questions": [
                Q1("Brightwell Dental Practice — Online Booking",
                   "A small dental practice currently takes patient appointments and reminders over the telephone using a paper diary. The practice manager is planning to move to an online booking system, with patient details stored on a new computer system in the reception."),
                Q2("Meridian Estate Agents — Branches",
                   "Meridian Estate Agents has its main office in Birmingham with several branches around the West Midlands. Application software has been installed on the branches' computer systems so staff can carry out day-to-day tasks such as preparing property details and managing client records."),
                Q3("Priya the Surveyor — Remote Working",
                   "Priya is a property surveyor working for a company based in Leeds. She works remotely, visiting clients to inspect properties. Priya uses a laptop and creates a personal area network (PAN) between her laptop and smartphone to connect to the company server. The office has a central server storing all survey data, managers' offices, a printer, and desktop computers for staff.", "Priya"),
                Q4("PixelForge Games — Cloud & Servers",
                   "PixelForge Games is an online gaming platform. It currently stores all the data it collects on a file server on site. PixelForge is considering how it can use cloud computing to back up this data, and whether to install a web server to publish content instead of relying solely on the file server."),
            ]
        },
        {
            "questions": [
                Q1("Greenfield Farm Shop — Online Ordering",
                   "A farm shop currently sells produce in-store using a till and a paper order book. The owners are considering adding an online ordering service for local delivery, with customer details stored on a new computer system in the shop office."),
                Q2("Halcyon Solicitors — Branch Network",
                   "Halcyon Solicitors has its main office in Manchester with two branch offices nearby. Application software is installed on the offices' computer systems so staff can carry out their work. Each office has a LAN and the branches connect to the main office over a WAN.", diagram_flowchart=True),
                Q3("Felix the Accountant — Remote Working",
                   "Felix is an accountant who works for a firm based in Bristol. He travels to client sites and uses a laptop, connecting to the office over the internet through a personal area network (PAN) between his laptop and phone. The office has a central server, desktop computers and a printer.", "Felix"),
                Q4("SkyStream Media — Cloud & Servers",
                   "SkyStream Media runs an online streaming platform. It stores all its data on an on-site file server and is considering cloud computing for backup. It is also deciding whether to deploy a web server to serve content to customers."),
            ]
        },
        {
            "questions": [
                Q1("Riverside Dental Clinic — Online Booking",
                   "A dental clinic currently books appointments over the phone in a paper diary. It plans to introduce an online booking system, with patient details stored on a new computer system in reception."),
                Q2("Trent & Co Accountants — Branches",
                   "Trent & Co Accountants has its main office in Nottingham with branch offices across the East Midlands. Application software is installed on the branch systems so staff can complete their work. Each office has a LAN, connected to the main office over a WAN."),
                Q3("Ravi the Architect — Remote Working",
                   "Ravi is an architect who works for a practice based in London. He visits client sites and uses a laptop to record measurements, creating a personal area network (PAN) between his laptop and phone to connect to the office server. The office has a central server, desktop computers for staff, and a large-format printer.", "Ravi"),
                Q4("NovaWare Studios — Cloud & Servers",
                   "NovaWare Studios is a software company that stores all its project data on a file server on site. It is considering cloud computing for backup, and whether to deploy a web server to host its customer portal."),
            ]
        },
    ]


def main():
    papers = make_papers()
    for i, p in enumerate(papers, 1):
        paper_html = (
            PAPER_HEAD + paper_topbar(i) + paper_cover(p, i)
            + paper_question_pages(p, i) + PAPER_TAIL
        )
        ms_html = (
            MS_HEAD + ms_topbar(i) + ms_cover(i)
            + ms_question_pages(p, i) + MS_TAIL
        )
        with open(os.path.join(DIR, f"paper-{i}.html"), "w", encoding="utf-8") as f:
            f.write(paper_html)
        with open(os.path.join(DIR, f"mark-scheme-{i}.html"), "w", encoding="utf-8") as f:
            f.write(ms_html)
        print(f"Wrote paper-{i}.html + mark-scheme-{i}.html")


if __name__ == "__main__":
    main()