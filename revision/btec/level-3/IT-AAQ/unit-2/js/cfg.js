/* BTEC Level 3 IT Unit 2 — Cyber Security and Incident Management: configuration for the shared paper viewer
   (../../business/shared/biz-papers.js). Exam: 2 hours 15 minutes, 90 marks, one scenario, four questions,
   each ending in a 9-mark evaluation. This unit is new for the 2025 AAQ specification, so the only Pearson paper so far is the SAM. */
(function () {
  'use strict';
  const RULES = [
    ['D', /forensic|evidence|image of|imaging|chain of custody|log file|live (analysis|forensics)|snapshot|write[- ]block|hash|investigat|suspect|security report/i],
    ['C', /policy|policies|audit|backup|back-?up strategy|disaster recovery|incident response|data protection officer|training|plan-do-check-act|iso 27001|acceptable use|procedure/i],
    ['B', /dhcp|dns|tcp\/?ip|ip address|subnet|nat\b|port\b|switch|router|gateway|segment|vlan|topology|lan\b|wan\b|wlan|san\b|network diagram|directory service|remote access|virtualis|cloud|thin client|peer-to-peer|client\/server/i],
    ['A', /threat|malware|virus|ransomware|phishing|social engineering|tailgating|hack|ddos|dos\b|sql injection|vulnerab|penetration|encrypt|firewall|wpa|ssid|mac (address )?filter|authenticat|password|multi-factor|mfa|trusted computing|gdpr|computer misuse|access control|vpn|antivirus|anti-virus/i]
  ];
  const TOPICS = [
    [/forensic|image|evidence|log file|chain of custody/i, 'Forensic procedures'], [/policy|audit/i, 'Security policies'], [/backup|disaster recovery/i, 'Backup and disaster recovery'],
    [/incident/i, 'Incident response'], [/dhcp|dns|directory|ip address|tcp/i, 'Network infrastructure services'], [/switch|router|segment|vlan|network diagram|topology/i, 'Network architecture'],
    [/wpa|ssid|mac (address )?filter|wap|wi-?fi|wireless/i, 'Wireless security'], [/sql injection|ddos|dos\b|malware|phishing|social engineering|tailgating|threat/i, 'Cyber security threats'],
    [/vulnerab|penetration|scanner/i, 'Vulnerabilities and testing'], [/password|authenticat|mfa|multi-factor|biometric/i, 'Authentication'], [/encrypt|vpn|https|tls/i, 'Encryption'],
    [/gdpr|computer misuse|legal|law/i, 'Legal responsibilities'], [/firewall|antivirus|trusted computing|access control/i, 'Security measures']
  ];
  window.BIZ_UNIT = {
    n: 2, key: 'it_u2', code: 'AAQ Unit 2', name: 'Cyber Security and Incident Management', kind: 'exam', total: 90, minutes: 135,
    timeLabel: '2 hours 15 minutes', aims: ['A', 'B', 'C', 'D'],
    subject: 'Information Technology', pdfPrefix: 'BTEC-IT',
    qualLine: 'Pearson Level 3 Alternative Academic Qualification BTEC National in Information Technology',
    partLine: 'Section A – one scenario, answer all questions',
    sectionTitles: {},
    runLabel: (it) => 'Question ' + it.q,
    cardMeta: (p) => {
      const by = {};
      p.items.forEach(it => { by[it.q] = (by[it.q] || 0) + it.marks; });
      return Object.keys(by).map(q => `Q${q}: ${by[q]}`).join(' · ') + ` · ${p.items.length} parts`;
    },
    instructions: [
      ['Instructions', ['Use black ink or ball-point pen.', 'Answer all questions.', 'Answer the questions in the spaces provided – there may be more space than you need.']],
      ['Information', ['The total mark for this paper is {total}.', 'The marks for each question are shown in brackets – use this as a guide as to how much time to spend on each question.', 'Every question relates to the scenario at the start of the paper.', 'Diagram questions: in “Answer online” mode you can draw on the page or upload a photo of your diagram.']],
      ['Advice', ['Read the scenario carefully before you start – underline the systems, people and risks it mentions.', 'Apply every answer to the scenario. Generic answers rarely reach the top level.', 'Try to answer every question and check your answers if you have time at the end.']]
    ],
    howto: ['Read the scenario first. Every question in a Unit 2 paper is about the same organisation, so keep coming back to it.',
      'Switch to “Answer online” and write your answers. For diagram questions, draw on the page or upload a photo. Then reveal the mark scheme, self-mark, or use the AI Examiner.',
      'Exam layout: 2 hours 15 minutes, 90 marks, four questions of about 22 marks each. Each one builds up from 1–4 mark questions to a 9-mark evaluation.'],
    paperNote: 'Unit 2 is a new unit for the 2025 AAQ specification, so the only official Pearson paper so far is the sample assessment (SAM). The RA10 papers follow exactly the same layout and mark scheme style.',
    specGroups: { new: { t: 'Current specification · 2025 AAQ', d: 'Official Pearson material for this unit.' } },
    legal: 'Sample assessment text © Pearson Education Ltd, reformatted by RA10 for revision. Figures are described in text.',
    classify: function (text, section, q, p, own) {
      for (const t of [own, text]) if (t) for (const [aim, re] of RULES) if (re.test(t)) return aim;
      return 'A';
    },
    topicFor: function (text) {
      for (const [re, name] of TOPICS) if (re.test(String(text))) return name;
      return 'Cyber security';
    }
  };
})();
