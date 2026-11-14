#!/usr/bin/env python3
"""RA10 repository health check.

Run from anywhere:  python enterprise/scripts/health_check.py [--quiet]

Checks (FAIL = must fix before release, WARN = known issue / review):
  1. Unit registry: every RA10_UNITS app exists; every unit app folder is registered; sitemap covers units
  2. JavaScript syntax of every tracked .js file (one Node process, vm.Script compile)
  3. Corruption: control characters (\\x08 etc.) in JS/TS/HTML/CSS/SQL; mojibake (double-encoded UTF-8)
  4. Cache tokens: the same asset referenced with different ?v= values in different pages
  5. Copyright: exam-board PDFs tracked in git
  6. Deploy: every linked /tools/<name> page is copied into the GitHub Pages artifact
  7. Routing: no top-level folder clashes with a shell route
  8. SQL: functions defined in more than one supabase/sql file (drift hazard)
  9. Repo hygiene: git-ignored paths that are still tracked (e.g. supabase/.temp)
 10. A-Level chapter labels: each alevel-build subject declares AIM_WORD = "Chapter"

Exit code: 1 if any FAIL, else 0. Requires git and node on PATH.
"""
import json
import os
import re
import subprocess
import sys
from collections import defaultdict

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
QUIET = '--quiet' in sys.argv
RESULTS = []  # (level, check, message)

# Known, documented issues → WARN instead of FAIL (see enterprise/docs/07-security-and-risk-register.md)
KNOWN_LEGACY_PDFS_RISK = 'R-03'
KNOWN_DUP_SQL_FUNCS = {'increment_xp', 'xp_answer_is_meaningful', 'get_leaderboard', 'apply_school_entitlement',
                       'edu_set_member_role', 'edu_keep_staff_role', 'edu_class_member_role',
                       'edu_is_school_staff',
                       # xp-v3.sql is the live definition (run it after the older files)
                       'claim_xp_boost', 'xp_boost_bonus', 'settle_previous_leaderboard'}


def add(level, check, msg):
    RESULTS.append((level, check, msg))


def sh(args, **kw):
    return subprocess.run(args, cwd=ROOT, capture_output=True, text=True, encoding='utf-8', errors='replace', **kw)


def tracked_files():
    out = sh(['git', 'ls-files', '-z'])
    if out.returncode != 0:
        print('git ls-files failed — run inside the repository'); sys.exit(2)
    return [f for f in out.stdout.split('\0') if f]


def read(path):
    with open(os.path.join(ROOT, path), 'r', encoding='utf-8', errors='replace', newline='') as fh:
        return fh.read()


FILES = tracked_files()


# 1. Registry ---------------------------------------------------------------------------------
def check_registry():
    node = r"""
global.window = {}; global.location = { pathname: '/' };
require(process.argv[1]);
process.stdout.write(JSON.stringify(window.RA10_UNITS.map(u => ({ path: u.path, app: u.app, pub: u.publicPath }))));
"""
    out = sh(['node', '-e', node, os.path.join(ROOT, 'refresh', 'ra10-units.js')])
    if out.returncode != 0:
        add('FAIL', 'registry', 'refresh/ra10-units.js failed to load in Node: ' + out.stderr.strip()[:300]); return
    units = json.loads(out.stdout)
    add('OK', 'registry', f'{len(units)} units registered')
    for u in units:
        if not os.path.isfile(os.path.join(ROOT, u['app'].lstrip('/'))):
            add('FAIL', 'registry', f"registered unit has no app: {u['app']}")
    registered = {u['path'].lower() for u in units}
    unit_dirs = sorted({os.path.dirname(f) for f in FILES
                        if f.startswith('revision/') and f.endswith('/index.html')
                        and (re.search(r'/unit-\d+/index\.html$', f) or re.match(r'revision/a-level/[^/]+/index\.html$', f))})
    for d in unit_dirs:
        if '/' + d.lower() not in registered:
            add('WARN', 'registry', f'unit app folder not in RA10_UNITS (not discoverable on the site): /{d}')
    sitemap = read('sitemap.xml') if os.path.exists(os.path.join(ROOT, 'sitemap.xml')) else ''
    missing = [u['pub'] for u in units if u['pub'] not in sitemap]
    if missing:
        add('WARN', 'sitemap', f'{len(missing)} registered units missing from sitemap.xml: ' + ', '.join(missing[:8]) + (' …' if len(missing) > 8 else ''))
    else:
        add('OK', 'sitemap', 'every registered unit is in sitemap.xml')


# 2. JS syntax --------------------------------------------------------------------------------
def check_js_syntax():
    js = [f for f in FILES if f.endswith('.js') and not f.startswith('training-data/') and '/vendor/' not in f
          and not f.endswith('.min.js')]
    node = r"""
const fs = require('fs'), vm = require('vm');
const files = JSON.parse(fs.readFileSync(0, 'utf8')); const bad = [];
for (const f of files) {
  let src = fs.readFileSync(f, 'utf8');
  if (src.charCodeAt(0) === 0xFEFF) src = src.slice(1);
  try { new vm.Script(src, { filename: f }); }
  catch (e) {
    // ES modules (import/export) are valid but not scripts: retry as a module body
    if (/\b(import|export)\b/.test(String(e.message)) || /Cannot use import statement|Unexpected token 'export'/.test(String(e.message))) {
      try { new vm.SourceTextModule ? new vm.SourceTextModule(src) : 0; continue; } catch (e2) { if (!vm.SourceTextModule) continue; bad.push([f, String(e2.message)]); continue; }
    }
    bad.push([f, String(e.message)]);
  }
}
process.stdout.write(JSON.stringify(bad));
"""
    out = sh(['node', '-e', node], input=json.dumps([os.path.join(ROOT, f) for f in js]))
    if out.returncode != 0:
        add('FAIL', 'js-syntax', 'node failed: ' + out.stderr.strip()[:300]); return
    bad = json.loads(out.stdout or '[]')
    for f, msg in bad:
        add('FAIL', 'js-syntax', f'{os.path.relpath(f, ROOT)}: {msg}')
    if not bad:
        add('OK', 'js-syntax', f'{len(js)} JS files compile')


# 3. Corruption -------------------------------------------------------------------------------
CTRL = re.compile(r'[\x00-\x08\x0b\x0c\x0e-\x1f]')
MOJIBAKE = re.compile(r'â€[\x80-\xbf™œ”“˜¦]|Ã[\x80-\xbf]|ðŸ|Â·')


def check_corruption():
    exts = ('.js', '.ts', '.html', '.css', '.sql', '.json', '.md')
    n_ctrl = n_moj = 0
    for f in FILES:
        if not f.endswith(exts) or f.startswith('training-data/') or f.endswith('.min.js') or '/vendor/' in f:
            continue
        try:
            s = read(f)
        except Exception:
            continue
        m = CTRL.search(s)
        if m:
            line = s.count('\n', 0, m.start()) + 1
            add('FAIL', 'corruption', f'control character {m.group()!r} in {f}:{line} (mangled escape? see ra10-safe-js-patching)')
            n_ctrl += 1
        m = MOJIBAKE.search(s)
        if m:
            line = s.count('\n', 0, m.start()) + 1
            add('WARN', 'mojibake', f'double-encoded UTF-8 {m.group()!r} in {f}:{line}')
            n_moj += 1
    if not n_ctrl:
        add('OK', 'corruption', 'no control characters')
    if not n_moj:
        add('OK', 'mojibake', 'no double-encoded UTF-8')


# 4. Cache tokens -----------------------------------------------------------------------------
REF = re.compile(r'''(?:src|href)=["']([^"'?#]+\.(?:js|css))\?v=([^"'&#]+)["']''')


def check_cache_tokens():
    versions = defaultdict(lambda: defaultdict(list))
    for f in FILES:
        if not f.endswith('.html') or f.startswith('training-data/'):
            continue
        s = read(f)
        base = '/' + os.path.dirname(f)
        for path, v in REF.findall(s):
            if path.startswith('http'):
                continue
            absolute = os.path.normpath(path if path.startswith('/') else os.path.join(base, path)).replace('\\', '/')
            versions[absolute][v].append(f)
    mixed = {a: vs for a, vs in versions.items() if len(vs) > 1}
    for asset, vs in sorted(mixed.items()):
        summary = '; '.join(f'?v={v} ×{len(fs)}' for v, fs in sorted(vs.items(), key=lambda kv: -len(kv[1])))
        add('WARN', 'cache-tokens', f'{asset} referenced with {len(vs)} versions ({summary})')
    if not mixed:
        add('OK', 'cache-tokens', f'{len(versions)} versioned assets, each with a single ?v= value')


# 5. Copyright --------------------------------------------------------------------------------
def check_copyright():
    pdfs = [f for f in FILES if f.lower().endswith('.pdf')]
    risky = [f for f in pdfs if f.startswith('training-data/')]
    other = [f for f in pdfs if not f.startswith('training-data/')]
    if risky:
        add('WARN', 'copyright', f'{len(risky)} exam-board source PDFs tracked in git ({KNOWN_LEGACY_PDFS_RISK}) — untrack + purge history (owner approval)')
    for f in other:
        add('WARN', 'copyright', f'PDF tracked outside training-data (check licence before publishing): {f}')
    if not pdfs:
        add('OK', 'copyright', 'no PDFs tracked')


# 6. Deploy coverage of /tools ----------------------------------------------------------------
def check_tools_deploy():
    wf_path = '.github/workflows/jekyll-gh-pages.yml'
    if wf_path not in FILES and not os.path.exists(os.path.join(ROOT, wf_path)):
        add('WARN', 'deploy', 'Pages workflow not found'); return
    wf = read(wf_path)
    linked = set()
    for f in FILES:
        if f.endswith(('.js', '.html')) and not f.startswith(('training-data/', 'tools/', 'enterprise/')):
            linked.update(re.findall(r'''["'(]/tools/([a-z0-9_-]+)''', read(f)))
    tools_excluded = "--exclude='tools'" in wf
    for name in sorted(linked):
        if tools_excluded and f'tools/{name}/' not in wf:
            add('FAIL', 'deploy', f'/tools/{name} is linked from the site but not copied into the Pages artifact ({wf_path})')
        elif not os.path.isdir(os.path.join(ROOT, 'tools', name)):
            add('FAIL', 'deploy', f'/tools/{name} is linked but tools/{name}/ does not exist')
    for folder in ('enterprise', 'specs', '.specify'):
        if os.path.isdir(os.path.join(ROOT, folder)) and f"--exclude='{folder}'" not in wf:
            add('WARN', 'deploy', f'{folder}/ is not excluded from the public Pages artifact (internal docs would be published)')
    if not [r for r in RESULTS if r[1] == 'deploy' and r[0] != 'OK']:
        add('OK', 'deploy', 'linked /tools pages are deployed; internal folders excluded')


# 7. Route / folder clash ---------------------------------------------------------------------
def check_route_clash():
    site = read('refresh/site.js')
    routes = set(re.findall(r"^\s*'/([a-z0-9-]+)'\s*:\s*'p-", site, re.M))
    allowed = {'revision'}  # internal key prefix, public URL is /subjects
    tops = {f.split('/')[0] for f in FILES if '/' in f}
    clash = sorted((routes & tops) - allowed)
    for c in clash:
        add('FAIL', 'routing', f"top-level folder '{c}/' clashes with shell route '/{c}' (GitHub Pages would serve the folder)")
    if not clash:
        add('OK', 'routing', f'{len(routes)} top-level routes, no folder clashes')


# 8. SQL duplicate function definitions -------------------------------------------------------
def check_sql_dupes():
    defs = defaultdict(set)
    for f in FILES:
        if f.startswith('supabase/sql/') and f.endswith('.sql'):
            for name in re.findall(r'create\s+(?:or\s+replace\s+)?function\s+(?:public\.)?"?([a-z_][a-z0-9_]*)"?\s*\(', read(f), re.I):
                defs[name.lower()].add(os.path.basename(f))
    dupes = {n: fs for n, fs in defs.items() if len(fs) > 1}
    for n, fs in sorted(dupes.items()):
        level = 'WARN' if n in KNOWN_DUP_SQL_FUNCS else 'FAIL'
        add(level, 'sql-drift', f'function {n}() defined in {len(fs)} files: {", ".join(sorted(fs))}' + (' (known, R-02)' if level == 'WARN' else ' — NEW duplicate, consolidate'))
    if not dupes:
        add('OK', 'sql-drift', 'every SQL function has a single definition')


# 9. Ignored-but-tracked ----------------------------------------------------------------------
def check_ignored_tracked():
    out = sh(['git', 'ls-files', '-ci', '--exclude-standard'])
    files = [f for f in out.stdout.splitlines() if f]
    if files:
        groups = defaultdict(int)
        for f in files:
            groups[os.path.dirname(f) or f] += 1
        for g, n in sorted(groups.items()):
            add('WARN', 'hygiene', f'{n} tracked file(s) match .gitignore in {g}/ — git rm -r --cached {g}')
    else:
        add('OK', 'hygiene', 'no ignored files are tracked')


# 10. A-Level chapter labels ------------------------------------------------------------------
def check_alevel_chapters():
    build = 'training-data/a-level/alevel-build/build_alevel.py'
    if not os.path.exists(os.path.join(ROOT, build)):
        return
    slugs = re.findall(r"^\s{4}'([a-z0-9-]+)':\s*dict\(", read(build), re.M)
    for slug in slugs:
        cfg = f'revision/a-level/{slug}/js/cfg.js'
        if not os.path.exists(os.path.join(ROOT, cfg)):
            add('FAIL', 'a-level-labels', f'{slug}: {cfg} missing (run build_alevel.py {slug})'); continue
        s = read(cfg)
        if 'AIM_WORD = "Chapter"' not in s and "AIM_WORD = 'Chapter'" not in s:
            add('FAIL', 'a-level-labels', f'{slug}: cfg.js does not set AIM_WORD = "Chapter" (A-Levels must show chapters)')
        else:
            add('OK', 'a-level-labels', f'{slug}: chapters configured')


def main():
    for fn in (check_registry, check_js_syntax, check_corruption, check_cache_tokens, check_copyright,
               check_tools_deploy, check_route_clash, check_sql_dupes, check_ignored_tracked, check_alevel_chapters):
        try:
            fn()
        except Exception as e:  # a broken check must never hide others
            add('FAIL', fn.__name__, f'check crashed: {e!r}')
    order = {'FAIL': 0, 'WARN': 1, 'OK': 2}
    icon = {'FAIL': '✗ FAIL', 'WARN': '! WARN', 'OK': '✓ OK  '}
    for level, check, msg in sorted(RESULTS, key=lambda r: (order[r[0]], r[1])):
        if QUIET and level == 'OK':
            continue
        print(f'{icon[level]}  [{check}] {msg}')
    n = {k: sum(1 for r in RESULTS if r[0] == k) for k in order}
    print(f"\nSummary: {n['FAIL']} FAIL, {n['WARN']} WARN, {n['OK']} OK")
    sys.exit(1 if n['FAIL'] else 0)


if __name__ == '__main__':
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    main()
