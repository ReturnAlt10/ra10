# Quiz Generation Brief — BTEC IT Unit 1 (AAQ 2025 Spec)

You are generating multiple-choice quiz questions for BTEC Level 3 IT Unit 1: Information Technology Systems, fully aligned with the **AAQ 2025 spec (Pearson, Issue 5, November 2025)**. The student is preparing for May/June 2026 first assessment.

## Hard requirements

1. Output a **single valid JSON file** (UTF-8) — array of **120 quiz question objects**.
2. **DO NOT** wrap output in markdown code fences. Write raw JSON only.
3. Save to: `/home/user/workspace/btec-tool/data/quiz.json`
4. Cover **all six Learning Aims (A–F)** with 20 quiz questions per aim.
5. These are **fast-recall MCQs** for revision — NOT exam-style scenario questions. They check understanding of facts, terminology, definitions, and examples.

## Schema

```json
{
  "id": "Q001",
  "learning_aim": "A",
  "topic": "A1.1.4 Servers",
  "type": "mcq",                        // "mcq" or "true_false"
  "question": "Which type of server is used to store and share files between users on a network?",
  "choices": [
    "Web server",
    "File server",
    "Application server",
    "Database server"
  ],
  "correct_index": 1,
  "explanation": "A file server provides centralised storage so users can access, save, and share files. A web server hosts websites; an application server runs software for clients; a database server manages databases."
}
```

For true/false:
```json
{
  "id": "Q050",
  "learning_aim": "F",
  "topic": "F2.2 Computer Misuse Act",
  "type": "true_false",
  "question": "The Computer Misuse Act 1990 makes unauthorised access to a computer system a criminal offence.",
  "choices": ["True", "False"],
  "correct_index": 0,
  "explanation": "Correct. The Act covers three offences including unauthorised access, unauthorised access with intent, and unauthorised modification."
}
```

## Style rules

- Most questions (~85%) should be **mcq** with **4 plausible choices**
- ~15% can be **true_false** with 2 choices ["True","False"]
- Questions must be **single-correct-answer** with **one unambiguously correct option**
- Distractors must be **plausible but clearly wrong** to a knowledgeable student (don't make joke options)
- Keep questions and choices SHORT — under ~25 words per option
- Each question must include a 1-2 sentence **explanation** that teaches the concept and briefly says why other options are wrong (where useful)
- Cover full breadth of each aim — see coverage notes below

## Coverage per aim (20 questions each)

### Aim A — Devices that form IT systems
- Types of digital devices and their use
- Server types (file/application/web)
- Peripheral devices, storage media
- System / application / utility software
- Emerging technologies (AI, AR/VR, IoT)
- Flowchart and network diagram symbols
- Choosing IT systems for purposes (personal/business)

### Aim B — Transmitting data
- Connectivity types (wired, wireless, mobile, satellite)
- Network types (LAN, WAN, PAN, MAN)
- Transmission protocols (TCP/IP, HTTP/HTTPS, FTP, SMTP, etc.)
- Bandwidth concepts
- Compression (lossy/lossless), codecs, file formats

### Aim C — Operating online
- Cloud deployment models (private/public/hybrid)
- Service models (SaaS, PaaS, IaaS)
- Remote working tools, VPNs
- Online community types (forums, wikis, IM, blogs, social media)

### Aim D — Protecting data
- Malware types (virus, worm, trojan, ransomware, spyware, adware, keylogger)
- Phishing and social engineering
- Firewalls, antivirus
- Encryption, authentication, biometrics
- Backup strategies (full/incremental/differential)
- File permissions, access control

### Aim E — Impact of IT systems
- Online services (banking, retail, gaming, education, entertainment)
- Transactional data and analytics
- Data validation vs verification
- UI design principles
- Data presentation methods

### Aim F — Issues
- Moral and ethical issues
- Acceptable use policies
- Data Protection Act 2018 / UK GDPR
- Computer Misuse Act 1990
- Copyright Designs and Patents Act 1988
- Equality Act 2010, Health & Safety, Freedom of Information

## Validation checklist
- 120 objects exactly
- Sequential IDs Q001–Q120
- Exactly 20 per aim
- All `correct_index` values are valid array indexes
- Every question has a non-empty explanation
- Facts are verified against the AAQ 2025 spec and Pearson textbooks
- No duplicate questions
