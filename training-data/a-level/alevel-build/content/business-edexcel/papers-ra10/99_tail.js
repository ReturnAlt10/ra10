  made.forEach(pp => {
    const by = {}; pp.items.forEach(i => { by[i.section] = (by[i.section] || 0) + i.marks; });
    if (by.A !== 50 || by.B !== 50) console.error('RA10 Edexcel paper total error', pp.id, JSON.stringify(by));
  });
})();
