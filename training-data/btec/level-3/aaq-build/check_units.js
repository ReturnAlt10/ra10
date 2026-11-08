/* Content checker for the AAQ units (see PLAYBOOK.md). node check_units.js [slug] [unit]
   Loads each unit's data files in a fake browser global and prints counts against the minimums. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..', '..', '..', '..', 'revision', 'btec', 'level-3');
const MIN = { exam: { K: 60, quiz: 80, cards: 80, ra10: 6, guideKB: 25 }, assignment: { K: 40, quiz: 50, cards: 50, ra10: 0, guideKB: 15 } };
const args = process.argv.slice(2);
const slugs = fs.readdirSync(ROOT).filter(d => /-aaq$/.test(d) && (!args[0] || d === args[0]));
let bad = 0;
for (const slug of slugs) {
  for (const u of fs.readdirSync(path.join(ROOT, slug)).filter(d => /^unit-\d+$/.test(d)).sort((a, b) => parseInt(a.slice(5)) - parseInt(b.slice(5)))) {
    if (args[1] && u !== 'unit-' + args[1]) continue;
    const js = path.join(ROOT, slug, u, 'js');
    const ctx = { console, localStorage: { getItem: () => null, setItem() {} }, location: { pathname: '/' + slug + '/' + u } };
    ctx.window = ctx; vm.createContext(ctx);
    const files = ['cfg.js', 'spec.js', '../../../shared-aaq/biz-bank.js', 'bank.js', 'quiz.js', 'cards.js', 'papers-data.js', 'papers-ra10.js', 'assignment-data.js', 'assignment-help.js'];
    const errs = [];
    for (const f of files) {
      const p = path.join(js, f);
      if (!fs.existsSync(p)) continue;
      try { vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f }); } catch (e) { errs.push(f + ': ' + e.message); }
    }
    const kind = ctx.BIZ_UNIT && ctx.BIZ_UNIT.kind === 'exam' ? 'exam' : 'assignment';
    const B = ctx.BIZ || { KNOWLEDGE: [], QUIZ: [], FLASHCARDS: [] };
    const papers = ctx.BIZ_PAPERS || [];
    const ra = papers.filter(p => p.source === 'ra10');
    const guideKB = fs.existsSync(path.join(js, 'guide.js')) ? Math.round(fs.statSync(path.join(js, 'guide.js')).size / 1024) : 0;
    const paperQs = papers.reduce((n, p) => n + p.items.length, 0);
    const help = ctx.AAQ_CRIT_HELP ? Object.keys(ctx.AAQ_CRIT_HELP).filter(k => /\.[PMD]\d/.test(k)).length : 0;
    const crit = ctx.AAQ_ASSIGN ? ctx.AAQ_ASSIGN.criteria.length : 0;
    const totals = ra.map(p => p.total).join('/');
    const sam = papers.find(p => p.source === 'pearson');
    const m = MIN[kind];
    const short = [];
    if (B.KNOWLEDGE.length < m.K) short.push('K ' + B.KNOWLEDGE.length + '<' + m.K);
    if (B.QUIZ.length < m.quiz) short.push('quiz ' + B.QUIZ.length + '<' + m.quiz);
    if (B.FLASHCARDS.length < m.cards) short.push('cards ' + B.FLASHCARDS.length + '<' + m.cards);
    if (ra.length < m.ra10) short.push('ra10 ' + ra.length + '<' + m.ra10);
    if (guideKB < m.guideKB) short.push('guide ' + guideKB + 'KB<' + m.guideKB);
    if (kind === 'exam' && sam && ra.some(p => p.total !== sam.total)) short.push('RA10 totals ' + totals + ' != SAM ' + sam.total);
    if (kind === 'assignment' && help < crit) short.push('crit help ' + help + '/' + crit);
    if (errs.length || short.length) bad++;
    console.log(`${(slug + ' ' + u).padEnd(44)} ${kind.padEnd(10)} K=${String(B.KNOWLEDGE.length).padStart(3)} quiz=${String(B.QUIZ.length).padStart(3)} cards=${String(B.FLASHCARDS.length).padStart(3)} papers=${papers.length} (ra10 ${ra.length}: ${totals || '-'}) paperQs=${paperQs} guide=${guideKB}KB${kind === 'assignment' ? ' critHelp=' + help + '/' + crit : ''}  ${short.length ? 'SHORT: ' + short.join(', ') : 'OK'}${errs.length ? '  ERR: ' + errs.join(' | ') : ''}`);
  }
}
process.exitCode = bad ? 1 : 0;
