# Business unit build tools (Units 2, 3, 6, 7)

Developer scripts that produced the data and app files under `revision/btec/level-3/business/`.
Source PDFs/text live in the git-ignored `../new/` folder (Pearson material is not committed).

1. `extract_biz.py` – PDF -> text (into `../new/text`).
2. `parse_u3d.py` / `parse_u3c.py` – Unit 3 exam questions and mark schemes; `parse_set.py` / `build_set.py` – Unit 2/6/7 set tasks.
3. `finalize_papers.py` – merges Pearson + RA10 practice papers (`ra10_sets.py`, `ra10_u3.py`) and writes each unit's `js/papers-data.js`.
4. `build_units.py` – generates each unit's `index.html`, `css/style.css`, `js/app.js`, `js/data-loader.js` from the Sport Unit 2 template.
Hand-written content: `js/{cfg,spec,bank,quiz,cards,guide}.js` in each unit and the shared engine in `business/shared/`.
