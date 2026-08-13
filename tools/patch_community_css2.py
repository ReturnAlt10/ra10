"""Patch 2 — fix card clipping, guide sections, mobile layout."""

FIXES = [
    # 1. Widen the left column, add overflow:hidden:none to panel, fix card overflow
    (
        ".community-layout{display:grid;grid-template-columns:340px minmax(0,1fr);gap:var(--sp5);align-items:start}",
        ".community-layout{display:grid;grid-template-columns:minmax(280px,360px) minmax(0,1fr);gap:var(--sp5);align-items:start}"
    ),
    # 2. Panel should NOT clip its children - remove overflow:hidden if present (not there, but ensure panel is safe)
    (
        ".community-panel{border:1px solid var(--color-border);border-radius:var(--radius-xl);background:var(--color-surface);padding:var(--sp5);box-shadow:var(--shadow-sm)}",
        ".community-panel{border:1px solid var(--color-border);border-radius:var(--radius-xl);background:var(--color-surface);padding:var(--sp5);box-shadow:var(--shadow-sm);overflow:visible}"
    ),
    # 3. Library grid: remove max-height clipping, use a proper scrollable container via the panel instead
    (
        ".community-library-grid{display:grid;gap:var(--sp3);max-height:72vh;overflow:auto;padding-right:2px}",
        ".community-library-grid{display:grid;gap:var(--sp3);overflow:visible}"
    ),
    # 4. Card: ensure tags wrap properly, no overflow cut, full width
    (
        ".community-card{border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--sp4);background:var(--color-bg);display:grid;gap:var(--sp3);cursor:pointer;transition:border-color var(--t),box-shadow var(--t),transform var(--t);text-align:left;width:100%}",
        ".community-card{border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--sp4);background:var(--color-bg);display:flex;flex-direction:column;gap:var(--sp3);cursor:pointer;transition:border-color var(--t),box-shadow var(--t),transform var(--t);text-align:left;width:100%}"
    ),
    # 5. Card tags: wrap properly
    (
        ".community-card-tags{display:flex;gap:6px;flex-wrap:wrap}",
        ".community-card-tags{display:flex;gap:6px;flex-wrap:wrap;row-gap:4px}"
    ),
    # 6. Card desc: allow 3 lines instead of 2
    (
        ".community-card-desc{margin:0;color:var(--color-text-muted);font-size:var(--tx-xs);line-height:1.55;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}",
        ".community-card-desc{margin:0;color:var(--color-text-muted);font-size:var(--tx-xs);line-height:1.55;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}"
    ),
    # 7. Left panel: make it sticky with scroll container rather than the grid
    (
        ".community-left,.community-main{display:grid;gap:var(--sp4)}",
        ".community-left{display:grid;gap:var(--sp4);position:sticky;top:calc(56px + var(--sp4));max-height:calc(100vh - 80px);overflow:auto}.community-main{display:grid;gap:var(--sp4)}"
    ),
    # 8. Library panel: no padding-right on library grid, handle scroll at panel level
    (
        ".community-library-grid::-webkit-scrollbar{width:4px}\n.community-library-grid::-webkit-scrollbar-thumb{background:var(--color-border);border-radius:4px}",
        ".community-left::-webkit-scrollbar{width:4px}\n.community-left::-webkit-scrollbar-thumb{background:var(--color-border);border-radius:4px}"
    ),
    # 9. Guide sections: better accordion look, not separated boxes
    (
        ".community-guide-section{border:1px solid var(--color-border);border-radius:var(--radius-lg);background:var(--color-bg);overflow:hidden;margin-bottom:var(--sp1)}\n.community-guide-section-head{display:flex;align-items:center;gap:var(--sp2);padding:var(--sp3) var(--sp4);font-size:var(--tx-sm);font-weight:700;color:var(--color-text);background:var(--color-surface);border-bottom:1px solid var(--color-border)}\n.community-content-scroll{padding:var(--sp4);max-height:220px;overflow:auto;white-space:pre-wrap;color:var(--color-text-muted);font-size:var(--tx-xs);line-height:1.7}\n.community-content-scroll::-webkit-scrollbar{width:4px}\n.community-content-scroll::-webkit-scrollbar-thumb{background:var(--color-border);border-radius:4px}",
        ".community-guide-wrap{display:grid;gap:0;border:1px solid var(--color-border);border-radius:var(--radius-lg);overflow:hidden}\n.community-guide-section{border-bottom:1px solid var(--color-border);background:var(--color-surface)}\n.community-guide-section:last-child{border-bottom:none}\n.community-guide-section-head{display:flex;align-items:center;gap:var(--sp2);padding:var(--sp3) var(--sp4);font-size:var(--tx-sm);font-weight:700;color:var(--color-text);cursor:pointer;user-select:none;background:var(--color-surface);transition:background var(--t)}\n.community-guide-section-head:hover{background:var(--color-surface-offset)}\n.community-guide-section-body{padding:0 var(--sp4) var(--sp4);display:none}\n.community-guide-section.open .community-guide-section-body{display:block}\n.community-content-scroll{white-space:pre-wrap;color:var(--color-text-muted);font-size:var(--tx-xs);line-height:1.7;word-break:break-word}"
    ),
    # 10. Responsive fixes
    (
        "@media (max-width:1100px){\n  .community-layout{grid-template-columns:300px minmax(0,1fr)}\n}\n@media (max-width:860px){\n  .community-layout{grid-template-columns:1fr}\n  .community-library-grid{max-height:50vh}\n  .community-viewer-panel{min-height:0}\n  .community-hero-stats{display:none}\n}\n@media (max-width:560px){\n  .community-panel,.community-create-panel{padding:var(--sp4)}\n  .community-hero{padding:var(--sp5)}\n  .community-features,.community-target-grid{grid-template-columns:1fr}\n  .community-flash-scene{height:160px}\n  .community-toolbar{flex-direction:column}\n  .community-toolbar .auth-input,.community-toolbar select.auth-input{flex:1;width:100%}\n  .community-viewer-menu .btn{font-size:11px;padding:var(--sp1) var(--sp2);min-width:0}\n}",
        "@media (max-width:1100px){\n  .community-layout{grid-template-columns:minmax(260px,300px) minmax(0,1fr)}\n}\n@media (max-width:860px){\n  .community-layout{grid-template-columns:1fr}\n  .community-left{position:static;max-height:none;overflow:visible}\n  .community-viewer-panel{min-height:0}\n  .community-hero-stats{display:none}\n  .community-library-grid{max-height:none}\n}\n@media (max-width:560px){\n  .community-panel,.community-create-panel{padding:var(--sp4)}\n  .community-hero{padding:var(--sp5)}\n  .community-features,.community-target-grid{grid-template-columns:1fr}\n  .community-flash-scene{height:160px}\n  .community-toolbar{flex-direction:column}\n  .community-toolbar .auth-input,.community-toolbar select.auth-input{flex:1;width:100%}\n  .community-viewer-menu .btn{font-size:11px;padding:var(--sp1) var(--sp2);min-width:0}\n  .community-card-summary h4{white-space:normal}\n}"
    ),
]

with open(r'c:\Users\mistr\OneDrive\Documents\GitHub\ra10\index.html', encoding='utf-8') as f:
    content = f.read()

for old, new in FIXES:
    if old not in content:
        print(f'WARNING: not found: {old[:80]!r}')
    else:
        content = content.replace(old, new, 1)
        print(f'OK: {old[:60]!r}')

with open(r'c:\Users\mistr\OneDrive\Documents\GitHub\ra10\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done.')
