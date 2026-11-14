# Claude Code skills for RA10

The skills live in [`.claude/skills/`](../.claude/skills/). Claude Code discovers them automatically when it is run in this repository. Each skill is a `SKILL.md` with frontmatter (`name`, `description`) followed by the procedure. They are also plain checklists that a human can follow.

| Skill | Use it for | Playbook |
|---|---|---|
| `ra10-orientation` | Finding where to make any change; golden rules | — |
| `ra10-add-btec-aaq-subject` | New or rebuilt BTEC AAQ subject or unit | PL-01, PL-02 |
| `ra10-add-a-level-subject` | New A-Level subject (parse papers, build, chapters, examiner) | PL-03 |
| `ra10-content-authoring` | Writing or fixing bank, quiz, cards and guide content | PL-06 |
| `ra10-write-practice-papers` | RA10 practice papers in the exact exam layout | PL-05 |
| `ra10-ai-examiner-module` | Spec-specific AI marking module | PL-07, PL-08 |
| `ra10-supabase-migration` | Any SQL, RLS or RPC change | PL-09 |
| `ra10-edge-function` | Any backend endpoint | PL-10 |
| `ra10-shell-page` | Shell page, route or nav, or a standalone app | PL-11, PL-12 |
| `ra10-python-lab-task` | Python Lab exercises | PL-17 |
| `ra10-verify-unit` | Browser verification of a unit or page | All |
| `ra10-safe-js-patching` | Scripted or bulk edits without corrupting escapes | All |
| `ra10-release` | Checks, cache busting, deploy order, rollback | PL-13 |
| `ra10-news-announcement` | News articles and the announcement bar | PL-14 |

**Writing a new skill:** keep it to a single job. Put the trigger ("Use when…") in the `description`, link the playbook for depth, and end with the verification steps.
