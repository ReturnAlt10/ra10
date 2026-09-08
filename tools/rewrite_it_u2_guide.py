# -*- coding: utf-8 -*-
"""Rewrite guide.js aim C (Cyber security documentation) and aim D (Forensic
procedures) to match the exact AAQ Unit 2 spec."""
import io

PATH = r"revision/btec/level-3/IT-AAQ/unit-2/js/guide.js"

NEW_CD = r'''  /* ============================================================
     AIM C — Cyber security documentation
  ============================================================ */
  const aimC = aim('C', [
    topic('C1','Internal security policies — the Plan-Do-Check-Act approach', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Cyber security policy</span> — a documented set of rules and practices that establish and maintain security on an ongoing basis across an organisation.</div>

<p><strong>The Plan-Do-Check-Act (PDCA) loop</strong>, derived from ISO 27001:2013, underpins an effective cyber security policy:</p>
<ul>
<li><strong>Plan</strong> — establish the security objectives, identify risks and asset requirements</li>
<li><strong>Do</strong> — implement the controls and operate them</li>
<li><strong>Check</strong> — monitor, audit and review results against the objectives</li>
<li><strong>Act</strong> — take corrective action and continually improve</li>
</ul>

<p>General IT policies that organisations put in place include:</p>
<ul>
<li><strong>Internet and email use policy</strong> — rules on inappropriate, offensive or illegal material; not sending confidential information; privacy; uploading/downloading copyrighted material; downloading executable files; visiting potentially dangerous websites</li>
<li><strong>Security and password procedures</strong> — length/strength policy, deny lists of weak/common passwords, monitoring password attempts, lockout policy for inactivity or failed attempts, using technology to reduce reliance on passwords</li>
<li><strong>Staff responsibilities</strong> — completing required security training, following procedures and reporting problems, responding to suspicious activity, maintaining security in their own workspace</li>
<li><strong>Staff IT security training</strong> — funded and resourced by leadership, flexible to include everyone, using a range of resources/learning styles, progress tracking, incentives rather than punishment, ongoing reinforcement for new threats</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>The PDCA loop is the exam's framing for "how policies are continually improved" — always link a policy to <em>regular review and improvement</em>, not a one-off document.</div>`,true),

    topic('C1.2','Security audits, backup policy and data protection', `
<p><strong>Security audits</strong> check compliance against policies and regulations:</p>
<ul>
<li>Audit goals and scope are defined up front</li>
<li>Identify problems, gaps and weaknesses</li>
<li>Check against internal policies <em>and</em> external regulations/laws</li>
<li>Report results and any required improvements/changes</li>
</ul>

<p><strong>Backup policy</strong> sets out how data is protected:</p>
<ul>
<li>Selection of data to be backed up; backup methods and type (full/differential/incremental)</li>
<li>Frequency/scheduling; storage strategy (onsite/offsite/cloud)</li>
<li>Responsibility and accountability; a backup testing strategy</li>
<li>Legal/regulatory compliance; emergency/recovery procedures</li>
</ul>

<p><strong>Data protection policy</strong> ensures organisational compliance:</p>
<ul>
<li>Appointing a <strong>Data Protection Officer</strong></li>
<li>Following data protection principles; protecting rights and privacy</li>
<li>Staff training; system security procedures</li>
<li>Applying the policy to external contractors, consultants and vendors</li>
<li>Responsibility and accountability of staff and the organisation</li>
</ul>`,true),

    topic('C1.5','Incident response and disaster recovery policies', `
<p><strong>Cyber security incident response policy</strong> — sets out how to react to a security incident:</p>
<ul>
<li><strong>Contacts</strong>: incident response team leader/provider, IT team leader, senior management, legal, public relations, human resources, insurance</li>
<li><strong>Procedures / flowcharts / checklists</strong> for: initial decisions/triage/escalation; the main response (analysis, containment, mitigation, recovery); reviewing, reporting and closing the incident</li>
<li><strong>Communications</strong>: a contact telephone plus an alternative/backup, and a conference call facility</li>
</ul>

<p><strong>Disaster recovery policy</strong> — sets out how to recover from a major disruption:</p>
<ul>
<li>Purpose and scope</li>
<li><strong>Triage</strong> — a list of possible events, their severity and the appropriate response (activate incident response / business continuity / disaster recovery plan)</li>
<li>Roles and responsibilities; contact lists</li>
<li>Monitoring and reporting requirements</li>
</ul>

<p><strong>External services policy</strong> — governs third parties such as cloud providers, hardware and software vendors:</p>
<ul>
<li>Authorisation and access control; management, responsibility and accountability</li>
<li>Contact details; regulatory compliance; incident response procedures</li>
<li>Service agreements; licensing; service time/availability and escalation procedures</li>
</ul>`,true)
  ]);

  /* ============================================================
     AIM D — Forensic procedures
  ============================================================ */
  const aimD = aim('D', [
    topic('D1','Forensic collection of evidence', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Digital forensics</span> — the methods used to collect and analyse evidence following a security incident, in a way that keeps it reliable and admissible.</div>

<p><strong>Forensics on devices (servers, PCs and mobile devices)</strong> — meeting the requirements:</p>
<ul>
<li><strong>Confiscation of devices</strong> — prior planning for a range of devices; passwords/codes/PINs; chargers and cables for mobile devices; retain the current power state if possible</li>
<li><strong>Isolation from the network</strong> — photograph the screen, turn off the device, remove battery/power cable, use airplane mode, disable wireless, use a Faraday bag/cage</li>
<li><strong>Appropriate packaging</strong>, documenting the <strong>chain of custody</strong> and establishing legal permissions</li>
<li>Taking an image of the system, using a forensic analysis tool, reviewing files/settings, system logs and user activity, and malware analysis and alerts</li>
</ul>

<p><strong>Challenges of live forensics:</strong> changing data in situ, recovering corrupted data, capturing data in active memory, capturing remote data, not losing temporary files.</p>

<p><strong>Network forensics:</strong> agree a testing methodology with the authorities; scan local infrastructure (with permission, without disrupting a live system, using passive and active analysis tools); review firewalls, switches, routers, WAPs and client/server logs; analyse malware activity and alerts.</p>

<p><strong>Documenting the scene:</strong> prior planning, securing the scene, plans/photos/diagrams, contemporaneous notes and witness statements.</p>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>For forensics questions always mention <strong>not changing the data</strong>, working from a <strong>copy/image</strong> and keeping a <strong>chain of custody</strong> — these are the core "admissibility" requirements.</div>`,true),

    topic('D2','Systematic forensic analysis of a suspect system', `
<p><strong>Requirements for maintaining an accurate record</strong>, made at or as soon as possible after the incident:</p>
<ul>
<li><strong>Retain snapshots of the system</strong> — originals/clean system for comparison, generate a hash/checksum for copies, whole disk/machine, files/folders, memory (RAM, BIOS, memory cards/SIM), virtual discs, process activity, network information (open ports, IP addresses, user logins), temporary and deleted data, and system-generated data (System Volume Information, hibernation files, shadow copies, crash dumps, page files)</li>
<li><strong>Record all findings</strong> — no action that could change data, collection by a competent person, a trail of all actions, documentation of responsibility</li>
<li><strong>Record alterations</strong> — document all actions from initial seizure, working with copies rather than the original</li>
<li><strong>Create visual evidence</strong> — photos, videos, screenshots, date-time stamps and metadata</li>
<li><strong>Ensure relevance, not false positives</strong> — define file signatures and search criteria, know error rates, feed back false positives, manually review positives</li>
</ul>

<p><strong>Assessing the findings</strong> — determine whether they provide evidence of a crime and/or incident (criminal, regulatory breach, civil liability, non-compliance, cyber attack, negligence) and whether the system has been externally/internally compromised:</p>
<ul>
<li>Unusual traffic (inbound/outbound, unusual regions, DoS/DDoS signs)</li>
<li>Unusual login attempts or DNS requests; increased file/data reads or requests</li>
<li>Unusual port usage; suspicious changes to or access to files/data</li>
</ul>

<p><strong>Writing security reports</strong> — a clear structure (title, contents, introduction, headings, numbered/bulleted points, conclusions, footnotes, citations) that analyses the incident to identify errors/omissions in procedures and preventative measures, delays in detection, and remedial actions, plus improvements to IT policies and security protection measures (physical, software, hardware, processes, training).</p>`,true)
  ]);
'''

with io.open(PATH, 'r', encoding='utf-8') as f:
    s = f.read()

start = s.index('  /* ============================================================\n     AIM C —')
end = s.index('  /* ---- Key Terms Glossary ---- */')

s = s[:start] + NEW_CD + '\n' + s[end:]

with io.open(PATH, 'w', encoding='utf-8') as f:
    f.write(s)

print("guide.js aimC/aimD rewritten OK")