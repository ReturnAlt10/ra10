---
name: ra10-safe-js-patching
description: Safely apply scripted or bulk edits to RA10 JavaScript/TypeScript/HTML (many files, generated units, regex-heavy code) without corrupting escapes or line endings — patch scripts as files, exact-once asserts, CRLF preservation, post-patch checks. Use whenever editing JS/TS with a script or touching more than a few files.
---

# Safe JS/TS patching

This has caused real corruption several times: inline Python or bash heredocs turned `\b`, `\n` and `\r` inside JS regexes and strings into control characters.

## Rules

1. **For one or two edits, use the editor or Edit tool.**
2. **For scripted edits, write the patch script to a file** and use raw strings (`r"""…"""`). Never run Python with `python - <<EOF` against JS or TS.
3. Read and write with `encoding='utf-8', newline=''` to keep CRLF and LF exactly as they were.
4. **Assert that each target occurs exactly once** before replacing it:

   ```python
   for old, new in REPLACEMENTS:
       assert s.count(old) == 1, ('not unique / not found', old[:80])
       s = s.replace(old, new, 1)
   ```

5. **Generated files:** patch the generator (`build_apps.py`, `build_alevel.py` `chapterise()`, `make_shared.py` asserted patch lists), then rebuild. Never patch the outputs.
6. **Bulk version bumps:** `sed -i 's/unit-ui\.js?v=OLD/unit-ui.js?v=NEW/g'` on an explicit file list from `grep -rl`. Then count the matches to confirm every file changed.

## After every patch

```bash
grep -rlP '\x08|\x0d(?!\x0a)' <changed files>   # control chars / stray CR → must print nothing
node --check <each changed .js>
deno check <changed .ts>                         # edge functions
python enterprise/scripts/health_check.py
```

## Shell notes (Windows, Git Bash)

- Never use `cat > file` without input. It blocks waiting on stdin.
- Quote paths: the repo lives under `OneDrive/Documents/GitHub/ra10`.
