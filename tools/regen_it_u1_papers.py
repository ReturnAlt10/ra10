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
    "storage_dev": {
        "instruction": "Award one mark for each correct storage device, up to a maximum of two marks.",
        "points": ["External hard drive (1)", "USB memory stick (1)", "Memory/SD card (1)", "Network-attached storage (NAS) (1)", "Cloud storage (1)"],
        "accept": "Accept any other appropriate storage device",
    },
    "os_types": {
        "instruction": "Award one mark for each correct type of operating system, up to a maximum of two marks.",
        "points": ["Network operating system (NOS) (1)", "Multi-tasking OS (1)", "Real-time OS (1)", "Mobile OS (1)", "Multi-user OS (1)", "Single-user OS (1)"],
        "accept": "Accept any other appropriate operating system type",
    },
    "vpn_benefit": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "Secure remote access (1) — employees connect to the office network safely from anywhere (1)",
            "Encrypted connection (1) — data is protected from interception while in transit (1)",
            "Private tunnel over the internet (1) — traffic is hidden from unauthorised users (1)",
            "Cost-effective (1) — uses the public internet rather than dedicated leased lines (1)",
        ],
        "accept": "Accept any other appropriate/alternative response",
    },
    "software_choice": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "Cost (1) — the software must fit the organisation's budget (1)",
            "Compatibility (1) — it must work with the existing hardware/systems (1)",
            "Features/functionality (1) — it must meet the specific needs of the work (1)",
            "Security (1) — it must protect sensitive data (1)",
        ],
        "accept": "Accept any other appropriate factor",
    },
    "encryption_transit": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "Data is scrambled into ciphertext (1) so it cannot be read if intercepted (1)",
            "Only authorised parties with the key can decrypt it (1) protecting it during transmission (1)",
            "Uses protocols such as HTTPS/SSL/TLS (1) securing data over the internet (1)",
        ],
        "accept": "Accept any other appropriate/alternative response",
    },
    "cloud_storage_benefit": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "Accessible anywhere (1) — staff can reach files from any device with an internet connection (1)",
            "Automatic backup (1) — data is preserved if local devices fail (1)",
            "Scalable (1) — storage can grow or shrink to meet demand (1)",
            "Reduces local hardware cost (1) — no need to buy/maintain on-site servers (1)",
        ],
        "accept": "Accept any other appropriate/alternative response",
    },
    "cloud_storage_drawback": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "Requires reliable internet (1) — no connection means no access to data (1)",
            "Ongoing subscription cost (1) — fees continue over time (1)",
            "Security/privacy concerns (1) — data is held by a third party (1)",
            "Speed of transfer (1) — large files depend on connection bandwidth (1)",
        ],
        "accept": "Accept any other appropriate/alternative response",
    },
    "backup_recovery": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "Regular backups copy data (1) so it can be recovered if the original is lost/corrupted (1)",
            "Backups are stored separately/off-site (1) so they survive hardware failure or disaster (1)",
            "Recovery procedures restore data (1) minimising downtime (1)",
            "Automated/scheduled backups (1) reduce the risk of human error (1)",
        ],
        "accept": "Accept any other appropriate/alternative response",
    },
    "physical_access": {
        "instruction": "Award up to six marks using the levels-based approach.",
        "indicative": [
            "Locks on server room doors (key/code/badge) — restrict physical access to hardware",
            "CCTV / security cameras — deter and record unauthorised entry",
            "Biometric door entry (fingerprint) — only authorised staff can enter",
            "Security guards / reception sign-in — control visitors",
            "Locked cabinets/cages for servers and storage devices",
            "Alarms — alert to unauthorised access attempts",
        ],
        "levels": [
            [0, "0", "No rewardable material."],
            [1, "1–3", "Identifies one or two physical measures with limited explanation. (AO2)"],
            [2, "4–5", "Explains several physical access controls and how they prevent unauthorised access to hardware/data. (AO2/AO3a)"],
            [3, "6", "Thoroughly discusses a range of physical controls (locks, CCTV, biometrics, sign-in, alarms) with clear explanation of how each protects the system, contextualised. (AO2/AO3a)"],
        ],
    },
    "wifi_security": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "Unauthorised access (1) — an open network lets others join and misuse it (1)",
            "Eavesdropping/interception (1) — data sent over Wi-Fi can be intercepted (1)",
            "Weak/no encryption (1) — unprotected traffic is readable by attackers (1)",
            "Rogue access points (1) — attackers can set up fake hotspots (1)",
        ],
        "accept": "Accept any other appropriate security issue",
    },
    "data_accuracy": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "Validation (1) — checks data is sensible/valid before it is accepted (1)",
            "Verification (1) — checks data matches the original (e.g. double entry, confirmation) (1)",
            "Drop-down lists / input masks (1) — restrict what can be entered (1)",
            "Proofreading (1) — a person checks for mistakes (1)",
        ],
        "accept": "Accept any other appropriate method",
    },
    "connection_factor": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of two marks.",
        "points": [
            "Performance/speed (1) — the connection must be fast enough for the work (1)",
            "Cost (1) — wired vs wireless and setup costs must suit the budget (1)",
            "Mobility (1) — wireless suits staff who move around (1)",
            "Reliability (1) — wired connections are usually more stable (1)",
            "Security (1) — wired is harder to intercept than wireless (1)",
        ],
        "accept": "Accept any other appropriate factor",
    },
    "external_threats": {
        "instruction": "Award one mark for each correct external threat, up to a maximum of two marks.",
        "points": ["Viruses/malware (1)", "Hackers/unauthorised access (1)", "Social engineering/phishing (1)", "Natural disaster (1)", "Denial-of-service attack (1)"],
        "accept": "Accept any other appropriate external threat",
    },
    "internal_threats": {
        "instruction": "Award one mark for each correct internal threat, up to a maximum of two marks.",
        "points": ["Accidental disclosure/deletion (1)", "Stealing/leaking data (1)", "Visiting inappropriate websites (1)", "Lost/portable devices (1)", "Disgruntled staff (1)"],
        "accept": "Accept any other appropriate internal threat",
    },
    "antivirus_benefit": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "Detects malware (1) by scanning files for known threats (1)",
            "Removes/quarantines infected files (1) preventing damage or spread (1)",
            "Real-time protection (1) monitors the system continuously (1)",
            "Regular updates (1) keep it effective against new viruses (1)",
        ],
        "accept": "Accept any other appropriate/alternative response",
    },
    "backup_benefit": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "Protects against data loss (1) — data can be restored if lost or corrupted (1)",
            "Quick recovery (1) — minimises downtime after an incident (1)",
            "Off-site copies (1) — survive physical damage to the building (1)",
            "Version history (1) — earlier versions can be recovered (1)",
        ],
        "accept": "Accept any other appropriate/alternative response",
    },
    "encryption_benefit": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "Scrambles data (1) so it is unreadable without the key (1)",
            "Protects data at rest (1) — stored data is secure if a device is stolen (1)",
            "Protects data in transit (1) — intercepted traffic cannot be read (1)",
            "Builds customer trust (1) — sensitive data is kept confidential (1)",
        ],
        "accept": "Accept any other appropriate/alternative response",
    },
    "emerging_tech": {
        "instruction": "Award up to three marks for an accurate description of how the organisation can use one emerging technology.",
        "points": [
            "Identifies a technology (e.g. AI, IoT, augmented reality, voice assistants) (1)",
            "Describes how it is applied in the organisation (1)",
            "Explains the intended benefit to the organisation (1)",
        ],
        "accept": "Accept any appropriate emerging technology correctly described",
    },
    "emerging_tech_eval": {
        "instruction": "Award up to nine marks using the levels-based approach.",
        "indicative": [
            "Artificial intelligence — automate tasks, analyse data, improve decisions",
            "Internet of Things (IoT) — connected sensors for monitoring and automation",
            "Closed-loop, sensor-driven systems — gather real-time data",
            "Augmented/virtual reality — training, design, marketing",
            "Voice assistants — hands-free control and customer service",
            "Cost and implementation considerations",
            "Impact on staff, customers and working practices",
            "Security and privacy implications",
        ],
        "levels": [
            [0, "0", "No rewardable material."],
            [1, "1–3", "Basic understanding. Names one or two emerging technologies with limited application. (AO2)"],
            [2, "4–6", "Good evaluation. Describes several emerging technologies and how they could benefit the organisation, with some development. (AO2/AO3a)"],
            [3, "7–9", "Comprehensive evaluation. Thorough discussion of a range of emerging technologies weighing benefits against cost, security and workforce impact, with a justified view. (AO2/AO3a/AO3b)"],
        ],
    },
    "data_protection_legal": {
        "instruction": "Award up to nine marks using the levels-based approach.",
        "indicative": [
            "Must comply with UK GDPR / Data Protection Act",
            "Lawful basis for processing and client consent",
            "Data kept secure, accurate and up to date",
            "Client rights: access, rectification, erasure, portability",
            "Computer Misuse Act — protection against unauthorised access",
            "Consequences of breach — fines, legal action, reputational damage",
            "Staff training and clear data policies",
        ],
        "levels": [
            [0, "0", "No rewardable material."],
            [1, "1–3", "Basic understanding. Names legislation with limited application to the organisation's data. (AO2)"],
            [2, "4–6", "Good application. Discusses several legal requirements and how they apply to client data with some development. (AO2/AO3a)"],
            [3, "7–9", "Comprehensive evaluation. Thorough discussion of legal obligations (GDPR, Computer Misuse Act), client rights and consequences of breach, with a balanced judgement. (AO2/AO3a/AO3b)"],
        ],
    },
    "remote_vpn": {
        "instruction": "Award up to twelve marks using the levels-based approach.",
        "indicative": [
            "Remote working with VPN — secure, flexible, encrypted access from anywhere",
            "On-site working — direct access to the office network",
            "VPN benefits: flexibility, reduced travel, security via encryption",
            "VPN drawbacks: dependent on internet speed/reliability, needs training",
            "On-site benefits: reliable fast network, direct supervision, secure local data",
            "On-site drawbacks: less flexibility, higher premises/travel costs",
            "Performance and efficiency comparison",
            "Suitability depends on the organisation's needs",
        ],
        "levels": [
            [0, "0", "No rewardable material."],
            [1, "1–4", "Basic understanding of remote vs on-site working. Limited comparison, mostly descriptive. (AO2)"],
            [2, "5–8", "Good evaluation comparing VPN remote working with on-site, with several points developed in context. (AO2/AO3a)"],
            [3, "9–12", "Comprehensive evaluation. Thorough, balanced comparison covering security, performance, flexibility, cost and suitability, clearly contextualised, with a justified conclusion. (AO2/AO3a/AO3b)"],
        ],
    },
    "payment_benefit_variation": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "Convenient for customers (1) — payments can be made 24/7 from any device (1)",
            "Faster processing (1) — transactions are completed instantly online (1)",
            "Fewer errors (1) — details entered directly reduce transcription mistakes (1)",
            "Secure encryption (1) — card details are protected during transmission (1)",
        ],
        "accept": "Accept any other appropriate/alternative response",
    },
    "open_source_eval": {
        "instruction": "Award up to nine marks using the levels-based approach.",
        "indicative": [
            "Open source — source code is freely available, can be modified; often free to use",
            "Proprietary — owned by a vendor; paid licence; support and updates provided",
            "Open source benefits: lower cost, community support, customisable",
            "Open source drawbacks: variable support, potential security concerns if not maintained",
            "Proprietary benefits: vendor support, reliability, regular updates",
            "Proprietary drawbacks: licence cost, locked into a vendor",
            "Suitability depends on the organisation's needs and budget",
        ],
        "levels": [
            [0, "0", "No rewardable material."],
            [1, "1–3", "Basic understanding of open source vs proprietary. Limited comparison. (AO2)"],
            [2, "4–6", "Good evaluation. Compares open source and proprietary with several points developed in context. (AO2/AO3a)"],
            [3, "7–9", "Comprehensive evaluation. Thorough, balanced comparison covering cost, support, security, customisation and suitability, with a justified recommendation. (AO2/AO3a/AO3b)"],
        ],
    },
    "breach_impact_variation": {
        "instruction": "Award one mark for identification and one mark for a linked justification/expansion, up to a maximum of four marks.",
        "points": [
            "Financial loss (1) — fines or compensation following a breach (1)",
            "Reputational damage (1) — patients lose trust in the clinic (1)",
            "Legal action (1) — breach of data protection law risks penalties (1)",
            "Operational disruption (1) — staff cannot access records to treat patients (1)",
        ],
        "accept": "Accept any other appropriate impact",
    },
    "protect_tech_encryption": {
        "instruction": "Award up to six marks using the levels-based approach.",
        "indicative": [
            "Encryption — data is scrambled so it cannot be read if intercepted",
            "Multi-factor authentication / 2FA — a second factor blocks access if a password is stolen",
            "Biometric authentication — unique physical feature restricts logins to authorised staff",
            "Firewalls — block unauthorised network traffic",
            "Access control/permissions — restrict data access to authorised staff",
        ],
        "levels": [
            [0, "0", "No rewardable material."],
            [1, "1–3", "Identifies one technique with limited explanation of how it protects data. (AO2)"],
            [2, "4–5", "Identifies two or more techniques with developed explanation of how each protects patient data. (AO2/AO3a)"],
            [3, "6", "Thoroughly discusses several techniques (e.g. encryption, MFA, biometrics, firewalls) with clear explanation of how each protects data, contextualised. (AO2/AO3a)"],
        ],
    },
}


def make_papers():
    def Q1(title, scenario, a1i, a1i_ms, bi_text, bi_ms, bii_text, bii_ms, c_text, c_ms, d_text, d_ms):
        return {
            "title": title, "scenario": scenario, "marks": 22,
            "topics": "Devices/peripherals, online/software benefits & drawbacks, protection, data security",
            "aims": "A1, A2, C1, D2",
            "parts": [
                {"label": "(a)(i)", "text": a1i, "marks": 2, "kind": "short", "ms": a1i_ms},
                {"label": "(a)(ii)", "text": "Give two output devices that will be needed.", "marks": 2, "kind": "short", "ms": P["output_dev"]},
                {"label": "(b)(i)", "text": bi_text, "marks": 4, "kind": "points", "ms": bi_ms},
                {"label": "(b)(ii)", "text": bii_text, "marks": 4, "kind": "points", "ms": bii_ms},
                {"label": "(c)", "text": c_text, "marks": 4, "kind": "short", "ms": c_ms},
                {"label": "(d)", "text": d_text, "marks": 6, "kind": "levels", "ms": d_ms},
            ],
        }

    def Q2(title, scenario, a_text, a_ms, bi_text, bi_ms, bii_text, bii_ms, c_text, c_ms, d_kind, d_text, d_ms, d_diagram=None):
        parts = [
            {"label": "(a)", "text": a_text, "marks": 2, "kind": "short", "ms": a_ms},
            {"label": "(b)(i)", "text": bi_text, "marks": 4, "kind": "points", "ms": bi_ms},
            {"label": "(b)(ii)", "text": bii_text, "marks": 4, "kind": "points", "ms": bii_ms},
            {"label": "(c)", "text": c_text, "marks": 4, "kind": "points", "ms": c_ms},
        ]
        if d_kind == "diagram":
            parts.append({
                "label": "(d)", "text": d_text, "marks": 9, "kind": "diagram", "diagram_kind": "flowchart",
                "guide": d_diagram, "ms": d_ms,
            })
        else:
            parts.append({"label": "(d)", "text": d_text, "marks": 9, "kind": "levels", "ms": d_ms})
        return {
            "title": title, "scenario": scenario, "marks": 23,
            "topics": "Software & OS, networks (LAN/WAN/VPN), policy, protection",
            "aims": "A1, A3, B2, F1",
            "parts": parts,
        }

    def Q3(title, scenario, worker_name, a_diagram_kind, a_ms, b_text, b_ms, c_text, c_ms, d_text, d_ms):
        a_text = f"Draw a diagram to show how the network is set up and how {worker_name} connects when working remotely. The diagram must include devices and systems that are used, connection types and annotations."
        return {
            "title": title, "scenario": scenario, "marks": 21,
            "topics": "Diagram, networks/PAN, online systems, data accuracy/impacts, legal/ethical",
            "aims": "A1, B1, C1, E2, F1",
            "parts": [
                {"label": "(a)", "text": a_text, "marks": 6, "kind": "diagram", "diagram_kind": a_diagram_kind,
                 "guide": ["all devices and systems that are used", "connection types (e.g. LAN, PAN, internet/WAN)", "annotations labelling each device and connection"],
                 "ms": {"instruction": "Award up to six marks for a correct annotated diagram.", "points": a_ms["points"]}},
                {"label": "(b)", "text": b_text, "marks": 2, "kind": "short", "ms": b_ms},
                {"label": "(c)", "text": c_text, "marks": 4, "kind": "points", "ms": c_ms},
                {"label": "(d)", "text": d_text, "marks": 9, "kind": "levels", "ms": d_ms},
            ],
        }

    def Q4(title, scenario, a_text, a_ms, b_text, b_ms, c_text, c_ms):
        return {
            "title": title, "scenario": scenario, "marks": 24,
            "topics": "Cloud/emerging tech, servers, remote working",
            "aims": "A1, A5, C1, D1",
            "parts": [
                {"label": "(a)", "text": a_text, "marks": 3, "kind": "short", "ms": a_ms},
                {"label": "(b)", "text": b_text, "marks": 9, "kind": "levels", "ms": b_ms},
                {"label": "(c)", "text": c_text, "marks": 12, "kind": "levels", "ms": c_ms},
            ],
        }

    flowchart_guide = [
        "start: opening the login screen", "entering a username", "entering a password (shown as a security step)",
        "a check that the details are correct", "access granted to the system", "logout / session end",
        "arrows and annotations showing the flow",
    ]

    return [
        # ---- Paper 1: broad trend mix (online services + encryption + open source) ----
        {
            "questions": [
                Q1("Hartley Academy — Online Enrolment",
                   "Hartley Academy is introducing an online enrolment system so parents can register their children for the school year. Candidate details will be stored on a new computer system in the school office.",
                   "Give two input devices that will be needed.", P["input_dev"],
                   "Explain two benefits of using a secure online payment system for enrolment.", P["payment_benefit_variation"],
                   "Explain two drawbacks of relying on online services.", P["online_drawback"],
                   "Describe how encryption protects the data while it is being transmitted.", P["encryption_transit"],
                   "Discuss techniques, other than usernames and passwords, that can be used to protect candidate data.", P["protect_tech"]),
                Q2("Premier Payroll — Branch Network",
                   "Premier Payroll has its main office in Leeds with branches in Manchester and Sheffield. The branches hold sensitive payroll data and connect to the main office. Staff use a range of software on their computer systems.",
                   "Give two types of operating systems that could be used.", P["os_types"],
                   "Explain two benefits of using a LAN in each office.", P["lan_benefit"],
                   "Explain two benefits of using a VPN to connect the branches to head office.", P["vpn_benefit"],
                   "Explain two factors to consider when choosing software for the payroll team.", P["software_choice"],
                   "levels", "Evaluate the use of open source software compared to proprietary software for the business.", P["open_source_eval"]),
                Q3("Priya the Surveyor — Remote Working",
                   "Priya is a property surveyor who visits clients to inspect buildings. She uses a laptop and creates a personal area network (PAN) between her laptop and smartphone to connect to the office server. The office has a central server, desktop computers and a printer.", "Priya",
                   "network diagram", P["network_diagram"],
                   "Explain one factor that affects the choice of connection type for a remote worker.", P["connection_factor"],
                   "Explain two security issues of connecting over public Wi-Fi.", P["wifi_security"],
                   "Evaluate the data protection (GDPR) obligations when handling client survey data.", P["data_protection_legal"]),
                Q4("PixelForge Games — Cloud & Remote",
                   "PixelForge Games is an online gaming platform. It stores all its data on an on-site file server and is considering how it can use cloud computing. It also allows some staff to work from home.",
                   "Describe how the company can use one cloud computing model.", P["cloud_model"],
                   "Evaluate how different cloud computing models could fit the needs of the company.", P["cloud_models"],
                   "Evaluate the use of a VPN for remote working compared to working on site.", P["remote_vpn"]),
            ]
        },
        # ---- Paper 2: flowchart paper (user prediction) + storage/backup ----
        {
            "questions": [
                Q1("Greenfield Farm Shop — Storage & Online",
                   "A farm shop is expanding into online ordering for local delivery. It currently stores records on paper and a single till, and is worried about losing customer data.",
                   "Give two storage devices that could be used.", P["storage_dev"],
                   "Explain two benefits of storing records in the cloud.", P["cloud_storage_benefit"],
                   "Explain two drawbacks of storing records in the cloud.", P["cloud_storage_drawback"],
                   "Describe how backup and recovery procedures protect the shop's data.", P["backup_recovery"],
                   "Discuss physical access control techniques that can protect the shop's computer equipment and data.", P["physical_access"]),
                Q2("Halcyon Solicitors — Branch Network",
                   "Halcyon Solicitors has its main office in Manchester with two branch offices nearby. Each office has a LAN and the branches connect to the main office over a WAN. Staff must log in securely to access client case files.",
                   "Give two types of application software that might be installed.", P["app_sw"],
                   "Explain two benefits of using a WAN to connect the branches.", P["wan_benefit"],
                   "Explain two benefits of using a VPN.", P["vpn_benefit"],
                   "Explain two acceptable behaviours that should be included in the Acceptable Use Policy.", P["aup"],
                   "diagram", "Draw a flowchart to show the process for logging into the system securely. Include: start, entering a username, entering a password, a security check, access to the system, and logout.", P["login_flowchart"], flowchart_guide),
                Q3("Felix the Accountant — Systems & Data",
                   "Felix is an accountant who travels to client sites. He uses a laptop and creates a personal area network (PAN) between his laptop and phone. The office has a central server, desktop computers and a printer, and recently integrated a new accounting system.", "Felix",
                   "network diagram", P["network_diagram"],
                   "Explain one factor that affects the use and selection of online systems.", P["online_factor"],
                   "Explain two methods of ensuring the accuracy of the data entered into the accounting system.", P["data_accuracy"],
                   "Evaluate the privacy implications for the firm when working with client financial data.", P["privacy"]),
                Q4("SkyStream Media — Emerging Tech",
                   "SkyStream Media is a growing online streaming company. It stores data on an on-site file server and is exploring new technologies to improve its service and reduce costs.",
                   "Describe how the company can use one emerging technology.", P["emerging_tech"],
                   "Evaluate how different emerging technologies could benefit the company.", P["emerging_tech_eval"],
                   "Evaluate the performance and efficiency of a web server compared to a file server.", P["web_vs_file"]),
            ]
        },
        # ---- Paper 3: protection-heavy + accuracy/legal ----
        {
            "questions": [
                Q1("Riverside Dental Clinic — Threats & Protection",
                   "Riverside Dental Clinic stores patient records on its computer system and is concerned about unauthorised access to this sensitive data.",
                   "Give two external threats to the clinic's data.", P["external_threats"],
                   "Explain two benefits of using antivirus software.", P["antivirus_benefit"],
                   "Explain two drawbacks of a breach of patient data for the clinic.", P["breach_impact_variation"],
                   "Describe how a firewall protects the data stored on the system.", P["firewall"],
                   "Discuss techniques to protect patient data, including encryption.", P["protect_tech_encryption"]),
                Q2("Trent & Co Accountants — Backup & Software",
                   "Trent & Co Accountants has a main office in Nottingham with branch offices. The firm relies heavily on its client data and uses a range of software. Each office has a LAN connected to the main office over a WAN.",
                   "Give two types of application software used by the firm.", P["app_sw"],
                   "Explain two benefits of regularly backing up client data.", P["backup_benefit"],
                   "Explain two benefits of encrypting client data.", P["encryption_benefit"],
                   "Explain two acceptable behaviours that should be included in the Acceptable Use Policy.", P["aup"],
                   "levels", "Evaluate the features of utility software that can be used to maintain, manage and optimise the computer systems.", P["utility"]),
                Q3("Ravi the Architect — Remote & Legal",
                   "Ravi is an architect who visits client sites and uses a laptop to record measurements, creating a personal area network (PAN) between his laptop and phone to connect to the office server. The office has a central server, desktop computers and a large-format printer.", "Ravi",
                   "network diagram", P["network_diagram"],
                   "Explain one factor that affects the choice of connection type.", P["connection_factor"],
                   "Explain two other impacts of the loss of the firm's client data.", P["data_loss"],
                   "Evaluate the legal and ethical issues when the firm transfers client drawings and data between sites.", P["data_protection_legal"]),
                Q4("NovaWare Studios — Cloud & Servers",
                   "NovaWare Studios is a software company that stores all its project data on a file server on site. It is considering cloud computing for backup and remote access, and whether to deploy a web server for its customer portal.",
                   "Describe how the company can use one cloud computing model.", P["cloud_model"],
                   "Evaluate how different cloud computing models could fit the needs of the company.", P["cloud_models"],
                   "Evaluate the performance and efficiency of a web server compared to a file server.", P["web_vs_file"]),
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