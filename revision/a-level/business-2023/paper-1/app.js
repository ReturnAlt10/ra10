const state = {
  currentView: "revision",
  score: JSON.parse(localStorage.getItem("aqaScore") || '{"correct":0,"attempted":0}'),
  revisionIndex: 0,
  flashIndex: 0,
  activeFlashTopic: "all",
  activeFlashList: [],
  flashStatus: JSON.parse(localStorage.getItem("aqaFlashStatus") || "{}"),
  practiceSession: null
};

const views = [
  { id: "revision", label: "Revision Guide" },
  { id: "models", label: "Models" },
  { id: "formulas", label: "Formulas" },
  { id: "paperTrends", label: "Paper Trends" },
  { id: "practice", label: "Practice" },
  { id: "flashcards", label: "Flashcards" },
  { id: "examTechnique", label: "Exam Technique" }
];

const RA10_THEME_KEY = "ra10-theme";

function getActiveTheme() {
  return document.body.classList.contains("dark-mode") ? "dark" : "light";
}

function openUnitNews() {
  try {
    if (window.top && window.top !== window && typeof window.top.openAnnouncements === "function") {
      window.top.openAnnouncements();
      return;
    }
    if (window.top && window.top !== window) {
      window.top.location.hash = "/updates";
      return;
    }
  } catch (_) {}
}

function syncThemeToParent(theme) {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "RA10_THEME", theme }, "*");
    }
  } catch (_) {}
}

async function renderUnitCreditChip() {
  const host = document.getElementById("unit-credit-chip");
  if (!host || !window.RA10) return;
  host.innerHTML = "";
  try {
    const chip = await RA10.renderCreditChip();
    if (chip) host.appendChild(chip);
  } catch (_) {}
}

function updateUnitAccountAvatar() {
  const btn = document.getElementById("unit-account-avatar");
  if (!btn || !window.RA10) return;
  if (!RA10.isLoggedIn()) {
    btn.textContent = "?";
    return;
  }
  const profile = RA10.getProfile() || {};
  const raw = String(profile.full_name || profile.display_name || profile.email || "U").trim();
  btn.textContent = (raw[0] || "U").toUpperCase();
}

function openAccountOrSignIn() {
  try {
    if (window.top && window.top !== window && typeof window.top.openAccountOrSignIn === "function") {
      window.top.openAccountOrSignIn();
      return;
    }
    if (window.top && window.top !== window) {
      window.top.location.hash = window.RA10 && RA10.isLoggedIn() ? "/account" : "/auth";
      return;
    }
  } catch (_) {}
  if (window.RA10 && !RA10.isLoggedIn() && typeof RA10.showPaywall === "function") {
    RA10.showPaywall("login", "paper1_access");
  }
}

function renderAiExaminerFeedback(container, result) {
  const host = createEl("div", "question-card", "");
  const earned = Number(result && result.earned) || 0;
  const max = Number(result && result.max) || 1;
  host.appendChild(createEl("h4", "", `AI Examiner score: ${earned}/${max}`));

  const strengths = Array.isArray(result && result.strengths) ? result.strengths : [];
  const improvements = Array.isArray(result && result.improvements) ? result.improvements : [];

  if (strengths.length) {
    host.appendChild(createEl("p", "kicker", "Strengths"));
    const ul = createEl("ul", "", "");
    strengths.forEach((s) => ul.appendChild(createEl("li", "", s)));
    host.appendChild(ul);
  }

  if (improvements.length) {
    host.appendChild(createEl("p", "kicker", "Improvements"));
    const ul = createEl("ul", "", "");
    improvements.forEach((s) => ul.appendChild(createEl("li", "", s)));
    host.appendChild(ul);
  }

  if (result && result.feedback) {
    host.appendChild(createEl("p", "small", String(result.feedback)));
  }

  container.appendChild(host);
}

function slugifyModelName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (typeof text === "string") el.textContent = text;
  return el;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatFormulaText(raw) {
  return String(raw)
    .replace(/\s+x\s/gi, " x ")
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatFormulaHtml(raw) {
  const text = escapeHtml(formatFormulaText(raw));
  return text
    .replace(/ x /g, " &times; ")
    .replace(/\b([A-Z]{2,5})\b/g, "<em>$1</em>");
}

function setTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  localStorage.setItem(RA10_THEME_KEY, isDark ? "dark" : "light");
  localStorage.setItem("aqaTheme", isDark ? "dark" : "light");
  syncThemeToParent(isDark ? "dark" : "light");
  const btn = document.getElementById("unit-theme-toggle");
  if (btn) {
    btn.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
    btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }
}

function saveScore() {
  localStorage.setItem("aqaScore", JSON.stringify(state.score));
}

function saveFlashStatus() {
  localStorage.setItem("aqaFlashStatus", JSON.stringify(state.flashStatus));
}

function updateScoreUI() {
  const { correct, attempted } = state.score;
  const accuracy = attempted ? Math.round((correct / attempted) * 100) : 0;
  document.getElementById("scoreCorrect").textContent = String(correct);
  document.getElementById("scoreAttempted").textContent = String(attempted);
  document.getElementById("scoreAccuracy").textContent = `${accuracy}%`;
}

function markAttempt(correct) {
  state.score.attempted += 1;
  if (correct) state.score.correct += 1;
  saveScore();
  updateScoreUI();
}

function updateHeroMetrics() {
  const totalQuestions = APP_DATA.mcqs.length + APP_DATA.fillBlanks.length + APP_DATA.examStyle.length;
  document.getElementById("metricQuestions").textContent = String(totalQuestions);
  document.getElementById("metricFlashcards").textContent = String(APP_DATA.flashcards.length);
  document.getElementById("metricTopics").textContent = String(APP_DATA.revisionTopics.length);
}

function showView(viewId) {
  state.currentView = viewId;
  document.querySelectorAll(".view").forEach((el) => {
    el.classList.toggle("hidden", el.id !== viewId);
  });
  document.querySelectorAll(".tab, .mobile-nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === viewId);
  });
}

function renderNav() {
  const navGrid = document.getElementById("navGrid");
  const mobileBottomNav = document.getElementById("mobileBottomNav");
  navGrid.innerHTML = "";
  mobileBottomNav.innerHTML = "";
  views.forEach((view) => {
    const btn = createEl("button", "tab", view.label);
    btn.type = "button";
    btn.dataset.view = view.id;
    if (view.id === state.currentView) btn.classList.add("active");
    btn.addEventListener("click", () => showView(view.id));
    navGrid.appendChild(btn);

    const mobileBtn = createEl("button", "mobile-nav-btn", view.label);
    mobileBtn.dataset.view = view.id;
    if (view.id === state.currentView) mobileBtn.classList.add("active");
    mobileBtn.addEventListener("click", () => showView(view.id));
    mobileBottomNav.appendChild(mobileBtn);
  });
}

function renderRevision() {
  const root = document.getElementById("revision");
  root.innerHTML = "";
  root.appendChild(createEl("p", "kicker", APP_DATA.specSummary.title));
  root.appendChild(createEl("h2", "", "Deep Revision Guide"));

  const controls = createEl("div", "page-controls", "");
  const prev = createEl("button", "btn btn-ghost", "Previous topic");
  const next = createEl("button", "btn", "Next topic");
  const pager = createEl("p", "pager", "");
  const search = createEl("input", "", "");
  search.placeholder = "Search definitions, subtopics, models, techniques";

  controls.appendChild(prev);
  controls.appendChild(next);
  controls.appendChild(pager);
  root.appendChild(search);
  root.appendChild(controls);

  const wrap = createEl("div", "revision-page", "");
  root.appendChild(wrap);

  const drawTopic = (topic) => {
    wrap.innerHTML = "";
    pager.textContent = `Topic ${state.revisionIndex + 1} of ${APP_DATA.revisionTopics.length}`;

    const pane = createEl("article", "topic-card topic-pane", "");
    pane.appendChild(createEl("p", "kicker", `${topic.code} Theme`));
    pane.appendChild(createEl("h3", "", topic.title));

    const subCard = createEl("div", "question-card", "");
    subCard.appendChild(createEl("h4", "", "Subtopics to master"));
    const subWrap = createEl("div", "flash-topic-list", "");
    const subtopics = topic.subtopics || topic.definitions.slice(0, 6).map((d) => d.term);
    subtopics.forEach((s) => {
      const chip = createEl("span", "topic-chip active", s);
      subWrap.appendChild(chip);
    });
    subCard.appendChild(subWrap);

    const defs = createEl("div", "question-card", "");
    defs.appendChild(createEl("h4", "", "Definitions"));
    topic.definitions.forEach((d) => {
      const p = createEl("p", "", "");
      p.innerHTML = `<strong>${d.term}:</strong> ${d.meaning}`;
      defs.appendChild(p);
    });

    const cols = createEl("div", "two-col", "");

    const left = createEl("div", "question-card", "");
    left.appendChild(createEl("h4", "", "Deep Knowledge"));
    const ulA = createEl("ul", "", "");
    topic.deepKnowledge.forEach((k) => ulA.appendChild(createEl("li", "", k)));
    left.appendChild(ulA);

    const right = createEl("div", "question-card", "");
    right.appendChild(createEl("h4", "", "Models + Exam Moves"));
    const ulB = createEl("ul", "", "");
    topic.models.forEach((m) => ulB.appendChild(createEl("li", "", m)));
    topic.examTech.forEach((e) => ulB.appendChild(createEl("li", "", e)));
    right.appendChild(ulB);

    cols.appendChild(left);
    cols.appendChild(right);

    const pitfalls = createEl("div", "question-card", "");
    pitfalls.appendChild(createEl("h4", "", "Common Pitfalls"));
    const ulC = createEl("ul", "", "");
    topic.pitfalls.forEach((p) => ulC.appendChild(createEl("li", "", p)));
    pitfalls.appendChild(ulC);

    pane.appendChild(subCard);
    pane.appendChild(defs);
    pane.appendChild(cols);
    pane.appendChild(pitfalls);
    wrap.appendChild(pane);
  };

  const filtered = () => {
    const term = search.value.trim().toLowerCase();
    if (!term) return APP_DATA.revisionTopics;
    return APP_DATA.revisionTopics.filter((t) => {
      const blob = [
        t.code,
        t.title,
        ...(t.subtopics || []),
        ...t.definitions.map((d) => `${d.term} ${d.meaning}`),
        ...t.deepKnowledge,
        ...t.models,
        ...t.pitfalls,
        ...t.examTech
      ].join(" ").toLowerCase();
      return blob.includes(term);
    });
  };

  const drawByIndex = () => {
    const activeList = filtered();
    if (!activeList.length) {
      wrap.innerHTML = "";
      wrap.appendChild(createEl("p", "", "No topic matches that search."));
      pager.textContent = "0 of 0";
      return;
    }
    if (state.revisionIndex >= activeList.length) state.revisionIndex = 0;
    drawTopic(activeList[state.revisionIndex]);
  };

  prev.addEventListener("click", () => {
    const list = filtered();
    state.revisionIndex = (state.revisionIndex - 1 + list.length) % list.length;
    drawByIndex();
  });

  next.addEventListener("click", () => {
    const list = filtered();
    state.revisionIndex = (state.revisionIndex + 1) % list.length;
    drawByIndex();
  });

  search.addEventListener("input", () => {
    state.revisionIndex = 0;
    drawByIndex();
  });

  drawByIndex();
}

function renderFormulas() {
  const root = document.getElementById("formulas");
  root.innerHTML = "";
  root.appendChild(createEl("p", "kicker", "High-value calculations"));
  root.appendChild(createEl("h2", "", "Formula Bank + Drill"));

  const tableWrap = createEl("div", "table-wrap", "");
  const table = createEl("table", "", "");
  table.innerHTML = "<thead><tr><th>Formula</th><th>Expression</th><th>Topic</th><th>Exam use</th></tr></thead>";
  const tbody = createEl("tbody", "", "");
  APP_DATA.formulas.forEach((f) => {
    const tr = createEl("tr", "", "");
    const label = f.name !== f.expandedName ? `${f.name} (${f.expandedName})` : f.expandedName;
    tr.innerHTML = `<td>${label}</td><td><span class="math-equation">${formatFormulaHtml(f.formula)}</span></td><td>${f.topic}</td><td>${f.examUse}</td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  tableWrap.appendChild(table);
  root.appendChild(tableWrap);

  const practiceCard = createEl("article", "question-card", "");
  practiceCard.appendChild(createEl("h3", "", "Numerical formula drills"));
  APP_DATA.formulaPractice.forEach((item) => {
    const block = createEl("div", "tech-card", "");
    block.appendChild(createEl("p", "kicker", item.topic));
    const title = item.name !== item.expandedName ? `${item.name} (${item.expandedName})` : item.expandedName;
    block.appendChild(createEl("h4", "", title));
    block.appendChild(createEl("p", "", item.question));

    const input = createEl("input", "", "");
    input.placeholder = `Type your answer${item.unit ? ` in ${item.unit}` : ""}`;

    const actions = createEl("div", "hero-actions", "");
    const check = createEl("button", "btn", "Check answer");
    const reveal = createEl("button", "btn btn-ghost", "Show worked solution");
    actions.appendChild(check);
    actions.appendChild(reveal);

    const feedback = createEl("p", "small", "");
    const answerWrap = createEl("div", "small hidden", "");
    const working = createEl("ul", "", "");
    item.working.forEach((step) => working.appendChild(createEl("li", "", step)));
    answerWrap.appendChild(createEl("p", "", `Correct answer: ${item.answer}${item.unit ? ` ${item.unit}` : ""}`));
    answerWrap.appendChild(working);
    answerWrap.appendChild(createEl("p", "", `What it means: ${item.interpretation}`));

    const normaliseNumericInput = (value) => {
      const cleaned = String(value || "").replace(/,/g, "").replace(/[^0-9.-]/g, "");
      if (!cleaned || cleaned === "-" || cleaned === ".") return Number.NaN;
      return Number(cleaned);
    };

    check.addEventListener("click", () => {
      const userAnswer = normaliseNumericInput(input.value);
      if (Number.isNaN(userAnswer)) {
        feedback.textContent = "Enter a number first so the drill can mark it.";
        return;
      }
      const tolerance = typeof item.tolerance === "number" ? item.tolerance : 0.01;
      const correct = Math.abs(userAnswer - item.answer) <= tolerance;
      feedback.textContent = correct
        ? `Correct. ${item.interpretation}`
        : `Not quite. Your answer was ${userAnswer}. Try the worked solution if needed.`;
    });

    reveal.addEventListener("click", () => answerWrap.classList.toggle("hidden"));

    block.appendChild(input);
    block.appendChild(actions);
    block.appendChild(feedback);
    block.appendChild(answerWrap);
    practiceCard.appendChild(block);
  });
  root.appendChild(practiceCard);
}

function renderModels() {
  const root = document.getElementById("models");
  root.innerHTML = "";
  root.appendChild(createEl("p", "kicker", "Model mastery"));
  root.appendChild(createEl("h2", "", "All key models explained in detail"));

  const search = createEl("input", "", "");
  search.placeholder = "Search model, topic, strength, limitation, or exam trap";
  root.appendChild(search);

  const wrap = createEl("div", "", "");
  root.appendChild(wrap);

  const draw = (term = "") => {
    wrap.innerHTML = "";
    APP_DATA.modelsDetailed
      .filter((model) => {
        const blob = [
          model.name,
          model.topic,
          model.whatItIs,
          model.whatItsFor,
          model.whyNeeded,
          ...(model.whenToUse || []),
          ...model.quadrants,
          ...(model.partBreakdown || []).map((item) => `${item.part} ${item.explanation}`),
          ...model.howToUse,
          model.examExample || "",
          ...model.strengths,
          ...model.limitations,
          model.examTrap
        ].join(" ").toLowerCase();
        return blob.includes(term.toLowerCase());
      })
      .forEach((model) => {
        const card = createEl("article", "topic-card", "");
        card.appendChild(createEl("p", "kicker", model.topic));
        card.appendChild(createEl("h3", "", model.name));

        const figure = createEl("figure", "model-figure", "");
        const img = document.createElement("img");
        img.src = `assets/model-diagrams/${slugifyModelName(model.name)}.svg`;
        img.alt = `${model.name} diagram`;
        img.loading = "lazy";
        img.addEventListener("error", () => {
          figure.remove();
        });
        figure.appendChild(img);
        card.appendChild(figure);

        card.appendChild(createEl("p", "", model.whatItIs));

        const purposeGrid = createEl("div", "two-col", "");
        const purpose = createEl("div", "question-card", "");
        purpose.appendChild(createEl("h4", "", "What it's for"));
        purpose.appendChild(createEl("p", "", model.whatItsFor));

        const why = createEl("div", "question-card", "");
        why.appendChild(createEl("h4", "", "Why you need it"));
        why.appendChild(createEl("p", "", model.whyNeeded));

        purposeGrid.appendChild(purpose);
        purposeGrid.appendChild(why);
        card.appendChild(purposeGrid);

        const when = createEl("div", "question-card", "");
        when.appendChild(createEl("h4", "", "When to use it"));
        const whenList = createEl("ul", "", "");
        model.whenToUse.forEach((item) => whenList.appendChild(createEl("li", "", item)));
        when.appendChild(whenList);
        card.appendChild(when);

        const cols = createEl("div", "two-col", "");
        const left = createEl("div", "question-card", "");
        left.appendChild(createEl("h4", "", "Parts / stages"));
        const ul1 = createEl("ul", "", "");
        model.quadrants.forEach((item) => ul1.appendChild(createEl("li", "", item)));
        left.appendChild(ul1);

        const right = createEl("div", "question-card", "");
        right.appendChild(createEl("h4", "", "How to use it in an answer"));
        const ul2 = createEl("ul", "", "");
        model.howToUse.forEach((item) => ul2.appendChild(createEl("li", "", item)));
        right.appendChild(ul2);

        cols.appendChild(left);
        cols.appendChild(right);
        card.appendChild(cols);

        const partsExplained = createEl("div", "question-card", "");
        partsExplained.appendChild(createEl("h4", "", "Each part explained"));
        model.partBreakdown.forEach((item) => {
          const partBlock = createEl("div", "tech-card", "");
          partBlock.appendChild(createEl("h4", "", item.part));
          partBlock.appendChild(createEl("p", "", item.explanation));
          partsExplained.appendChild(partBlock);
        });
        card.appendChild(partsExplained);

        const cols2 = createEl("div", "two-col", "");
        const strengths = createEl("div", "question-card", "");
        strengths.appendChild(createEl("h4", "", "Strengths"));
        const ul3 = createEl("ul", "", "");
        model.strengths.forEach((item) => ul3.appendChild(createEl("li", "", item)));
        strengths.appendChild(ul3);

        const limits = createEl("div", "question-card", "");
        limits.appendChild(createEl("h4", "", "Limitations"));
        const ul4 = createEl("ul", "", "");
        model.limitations.forEach((item) => ul4.appendChild(createEl("li", "", item)));
        limits.appendChild(ul4);

        cols2.appendChild(strengths);
        cols2.appendChild(limits);
        card.appendChild(cols2);

        const trap = createEl("div", "question-card", "");
        const example = createEl("div", "question-card", "");
        example.appendChild(createEl("h4", "", "Quick example"));
        example.appendChild(createEl("p", "", model.examExample));
        card.appendChild(example);

        trap.appendChild(createEl("h4", "", "Exam trap"));
        trap.appendChild(createEl("p", "", model.examTrap));
        card.appendChild(trap);
        wrap.appendChild(card);
      });
  };

  search.addEventListener("input", (e) => draw(e.target.value));
  draw();
}

function renderPaperTrends() {
  const root = document.getElementById("paperTrends");
  root.innerHTML = "";
  root.appendChild(createEl("p", "kicker", "Paper intelligence"));
  root.appendChild(createEl("h2", "", "Topic + Formula Trend Map"));

  const tableWrap = createEl("div", "table-wrap", "");
  const table = createEl("table", "", "");
  const topicCodes = APP_DATA.revisionTopics.map((t) => t.code);
  table.innerHTML = `<thead><tr><th>Set</th>${topicCodes.map((c) => `<th>${c}</th>`).join("")}<th>Recurring calculations</th></tr></thead>`;
  const tbody = createEl("tbody", "", "");

  APP_DATA.paperTrendRows.forEach((row) => {
    const tr = createEl("tr", "", "");
    const coverageCells = topicCodes
      .map((code) => {
        const key = `t${code.replace(".", "")}`;
        const level = row.topicCoverage[key] || "medium";
        return `<td><span class="pill ${level}">${level}</span></td>`;
      })
      .join("");

    tr.innerHTML = `<td>${row.year}</td>${coverageCells}<td>${row.recurringCalculations}</td>`;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  tableWrap.appendChild(table);
  root.appendChild(tableWrap);
}

function makeSession(mode, list) {
  return {
    mode,
    list,
    index: 0,
    answered: {},
    topicStats: {}
  };
}

function updateTopicStat(session, topic, correct) {
  const key = topic || "mixed";
  if (!session.topicStats[key]) session.topicStats[key] = { attempted: 0, correct: 0 };
  session.topicStats[key].attempted += 1;
  if (correct) session.topicStats[key].correct += 1;
}

function getWeakTopics(topicStats) {
  return Object.entries(topicStats)
    .map(([topic, s]) => ({ topic, accuracy: s.attempted ? Math.round((s.correct / s.attempted) * 100) : 0, ...s }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 4);
}

function animateAIMarker(container, cb) {
  const marker = createEl("div", "ai-marker", "AI marker is checking your answer...");
  container.appendChild(marker);
  setTimeout(() => {
    marker.classList.add("done");
    cb(marker);
  }, 700);
}

function renderSessionSplash(stage, session) {
  stage.innerHTML = "";
  let correct = 0;
  let attempted = 0;
  Object.values(session.topicStats).forEach((s) => {
    correct += s.correct;
    attempted += s.attempted;
  });
  const acc = attempted ? Math.round((correct / attempted) * 100) : 0;

  const splash = createEl("article", "question-card splash", "");
  splash.appendChild(createEl("p", "kicker", "Set complete"));
  splash.appendChild(createEl("h3", "", `Score: ${correct}/${attempted} (${acc}%)`));

  const weak = getWeakTopics(session.topicStats);
  const block = createEl("div", "tech-card", "");
  block.appendChild(createEl("h4", "", "What to improve next"));
  if (!weak.length) {
    block.appendChild(createEl("p", "", "No weak areas detected yet."));
  } else {
    const ul = createEl("ul", "", "");
    weak.forEach((w) => {
      ul.appendChild(createEl("li", "", `${w.topic}: ${w.accuracy}% accuracy (${w.correct}/${w.attempted})`));
    });
    block.appendChild(ul);
  }

  splash.appendChild(block);
  const restart = createEl("button", "btn", "Start another set");
  restart.addEventListener("click", () => renderPractice());
  splash.appendChild(restart);
  stage.appendChild(splash);
}

function renderObjectiveSession(stage, session, type) {
  stage.innerHTML = "";

  const controls = createEl("div", "question-controls", "");
  const pager = createEl("p", "pager", "");
  const next = createEl("button", "btn", "Next");
  controls.appendChild(pager);
  controls.appendChild(next);

  const track = createEl("div", "progress-track", "");
  const fill = createEl("div", "progress-fill", "");
  track.appendChild(fill);

  const mount = createEl("div", "question-shell", "");
  stage.appendChild(controls);
  stage.appendChild(track);
  stage.appendChild(mount);

  const draw = () => {
    mount.innerHTML = "";
    if (session.index >= session.list.length) {
      renderSessionSplash(stage, session);
      return;
    }

    const item = session.list[session.index];
    const topic = item.topic || "mixed";
    pager.textContent = `Question ${session.index + 1} of ${session.list.length}`;
    fill.style.width = `${Math.round(((session.index + 1) / session.list.length) * 100)}%`;

    const card = createEl("article", "question-card one-at-time question-enter", "");
    card.appendChild(createEl("p", "kicker", topic));

    if (type === "mcq") {
      card.appendChild(createEl("h4", "", item.title || "MCQ"));
      card.appendChild(createEl("p", "", item.question));
      const options = createEl("div", "question-options", "");
      const feedback = createEl("p", "small", "");
      item.options.forEach((opt, idx) => {
        const btn = createEl("button", "option-btn", opt);
        btn.addEventListener("click", () => {
          if (session.answered[session.index]) return;
          session.answered[session.index] = true;
          animateAIMarker(card, () => {
            const ok = idx === item.answerIndex;
            btn.classList.add(ok ? "correct" : "wrong");
            [...options.children].forEach((b) => (b.disabled = true));
            feedback.textContent = `${ok ? "Correct" : "Not quite"}. ${item.explanation || ""}`;
            markAttempt(ok);
            updateTopicStat(session, topic, ok);
          });
        });
        options.appendChild(btn);
      });
      card.appendChild(options);
      card.appendChild(feedback);
    }

    if (type === "fill") {
      card.appendChild(createEl("h4", "", "Fill the blank"));
      card.appendChild(createEl("p", "", item.prompt));
      const input = createEl("input", "", "");
      const check = createEl("button", "btn", "Check");
      const feedback = createEl("p", "small", "");
      check.addEventListener("click", () => {
        if (session.answered[session.index]) return;
        session.answered[session.index] = true;
        animateAIMarker(card, () => {
          const ok = input.value.trim().toLowerCase() === (item.answer || "").toLowerCase();
          feedback.textContent = ok ? "Correct" : `Answer: ${item.answer}`;
          markAttempt(ok);
          updateTopicStat(session, topic, ok);
        });
      });
      card.appendChild(input);
      card.appendChild(check);
      card.appendChild(feedback);
    }

    if (type === "exam") {
      card.appendChild(createEl("h4", "", `${item.marks} mark question`));
      card.appendChild(createEl("p", "", item.question));
      const ul = createEl("ul", "", "");
      (item.checklist || []).forEach((c) => ul.appendChild(createEl("li", "", c)));
      card.appendChild(ul);

      const area = createEl("textarea", "", "");
      area.rows = 7;
      area.placeholder = "Write your answer plan...";
      const done = createEl("button", "btn", "Submit to AI Examiner");
      const feedback = createEl("p", "small", "");
      const aiWrap = createEl("div", "", "");

      done.addEventListener("click", async () => {
        if (session.answered[session.index]) return;
        const answerText = area.value.trim();
        if (!answerText) {
          feedback.textContent = "Write an answer first, then submit to AI Examiner.";
          return;
        }
        session.answered[session.index] = true;
        animateAIMarker(card, async () => {
          try {
            if (!window.RA10 || typeof RA10.examineAnswer !== "function") {
              throw new Error("RA10 AI Examiner is unavailable right now.");
            }
            if (!RA10.isLoggedIn()) {
              RA10.showPaywall("login", "ai_examiner");
              throw new Error("Sign in required for AI Examiner.");
            }

            const response = await RA10.examineAnswer({
              question: {
                question: item.question,
                marks: item.marks,
                command_verb: "Evaluate",
                learning_aim: topic,
                topic
              },
              answer: answerText
            });

            const result = response && response.result ? response.result : {};
            aiWrap.innerHTML = "";
            renderAiExaminerFeedback(aiWrap, result);

            const earned = Number(result.earned) || 0;
            const max = Number(result.max) || Math.max(1, Number(item.marks) || 1);
            const ok = earned >= Math.ceil(max / 2);
            feedback.textContent = ok
              ? "Marked by AI Examiner. Keep tightening your judgement criteria."
              : "Marked by AI Examiner. Rebuild with stronger context chains and judgement.";
            markAttempt(ok);
            updateTopicStat(session, topic, ok);
            await renderUnitCreditChip();
          } catch (err) {
            feedback.textContent = `AI Examiner unavailable: ${err.message}`;
            const ok = answerText.split(/\s+/).filter(Boolean).length >= 60;
            markAttempt(ok);
            updateTopicStat(session, topic, ok);
          }
        });
      });

      card.appendChild(area);
      card.appendChild(done);
      card.appendChild(feedback);
      card.appendChild(aiWrap);
    }

    mount.appendChild(card);
  };

  next.addEventListener("click", () => {
    if (!session.answered[session.index]) return;
    session.index += 1;
    draw();
  });

  draw();
}

function runDuolingo(stage, lesson) {
  stage.innerHTML = "";
  const title = createEl("h4", "", `Lesson: ${lesson.title}`);
  stage.appendChild(title);

  const meter = createEl("div", "duo-meter", "");
  const fill = createEl("div", "", "");
  meter.appendChild(fill);
  stage.appendChild(meter);

  const holder = createEl("div", "", "");
  stage.appendChild(holder);
  const topicStats = {};

  const drawStep = (idx) => {
    holder.innerHTML = "";
    if (idx >= lesson.steps.length) {
      renderSessionSplash(stage, { topicStats });
      return;
    }

    const step = lesson.steps[idx];
    const card = createEl("article", "question-card one-at-time question-enter", "");
    card.appendChild(createEl("p", "", step.prompt));

    const finish = (ok, expected) => {
      animateAIMarker(card, () => {
        markAttempt(ok);
        updateTopicStat({ topicStats }, lesson.topic || "duo", ok);
        fill.style.width = `${Math.round(((idx + 1) / lesson.steps.length) * 100)}%`;
        card.appendChild(createEl("p", "small", ok ? "Great" : `Expected: ${expected || "see notes"}`));
        setTimeout(() => drawStep(idx + 1), 500);
      });
    };

    if (step.type === "mcq") {
      step.options.forEach((opt, i) => {
        const btn = createEl("button", "option-btn", opt);
        btn.addEventListener("click", () => finish(i === step.answerIndex));
        card.appendChild(btn);
      });
    } else {
      const input = createEl("input", "", "");
      const submit = createEl("button", "btn", "Submit");
      submit.addEventListener("click", () => {
        const ok = input.value.trim().toLowerCase() === step.answer.toLowerCase();
        finish(ok, step.answer);
      });
      card.appendChild(input);
      card.appendChild(submit);
    }

    holder.appendChild(card);
  };

  drawStep(0);
}

function bindRa10Events() {
  if (!window.RA10 || typeof RA10.on !== "function") return;
  RA10.on("authchange", async () => {
    updateUnitAccountAvatar();
    await renderUnitCreditChip();
  });
  RA10.on("creditschange", async () => {
    await renderUnitCreditChip();
  });
}

async function initRa10Shell() {
  if (!window.RA10 || typeof RA10.init !== "function") return;
  try {
    await RA10.init();
  } catch (_) {}
  bindRa10Events();
  updateUnitAccountAvatar();
  await renderUnitCreditChip();
}

function renderPractice() {
  const root = document.getElementById("practice");
  root.innerHTML = "";
  root.appendChild(createEl("p", "kicker", "Practice lab"));
  root.appendChild(createEl("h2", "", "One-question pages + AI marker"));

  const controls = createEl("div", "three-col", "");
  controls.id = "practiceControls";

  const mode = createEl("select", "", "");
  mode.innerHTML = `
    <option value="mcq">MCQ set</option>
    <option value="fill">Fill-in set</option>
    <option value="exam">Exam-style set</option>
    <option value="duo">Duolingo-style lesson</option>
    <option value="ai">AI Examiner (custom answer)</option>
    <option value="aiReady">Pre-generated model answers</option>
  `;

  const topicFilter = createEl("select", "", "");
  topicFilter.innerHTML = `<option value="all">All topics</option>`;
  APP_DATA.revisionTopics.forEach((t) => {
    topicFilter.innerHTML += `<option value="${t.code}">${t.code} - ${t.title}</option>`;
  });

  const setSize = createEl("select", "", "");
  [5, 10, 15, 20].forEach((n) => {
    setSize.innerHTML += `<option value="${n}">${n} questions</option>`;
  });
  setSize.value = "10";

  const start = createEl("button", "btn", "Start set");

  controls.appendChild(mode);
  controls.appendChild(topicFilter);
  controls.appendChild(setSize);
  root.appendChild(controls);
  root.appendChild(start);

  const stage = createEl("div", "", "");
  root.appendChild(stage);

  const filterByTopic = (list) => {
    const topic = topicFilter.value;
    if (topic === "all") return list;
    return list.filter((x) => (x.topic || "").includes(topic));
  };

  const startSet = async () => {
    stage.innerHTML = "";
    const modeValue = mode.value;

    if (modeValue === "aiReady") {
      const card = createEl("article", "question-card", "");
      card.appendChild(createEl("h4", "", "Pre-generated AI model answers"));
      APP_DATA.aiReadyQuestions.forEach((q, i) => {
        const block = createEl("div", "tech-card", "");
        block.appendChild(createEl("p", "kicker", `Set ${i + 1}`));
        block.appendChild(createEl("p", "", q.question));
        block.appendChild(createEl("p", "small", q.aiModelAnswer));
        card.appendChild(block);
      });
      stage.appendChild(card);
      return;
    }

    if (modeValue === "ai") {
      const card = createEl("article", "question-card", "");
      card.appendChild(createEl("h4", "", "RA10 AI Examiner"));
      card.appendChild(createEl("p", "small", "Uses the same RA10 AI + credit flow as the rest of the revision platform."));
      const q = createEl("textarea", "", "");
      q.rows = 4;
      q.placeholder = "Paste an exam question here (e.g. 16-mark evaluate question)";
      const ans = createEl("textarea", "", "");
      ans.rows = 8;
      ans.placeholder = "Write your answer draft...";
      const runBtn = createEl("button", "btn", "Mark with AI Examiner");
      const out = createEl("div", "", "");
      runBtn.addEventListener("click", async () => {
        out.innerHTML = "";
        out.appendChild(createEl("p", "small", "Marking..."));
        try {
          if (!window.RA10 || typeof RA10.examineAnswer !== "function") {
            throw new Error("RA10 AI Examiner is unavailable.");
          }
          if (!RA10.isLoggedIn()) {
            RA10.showPaywall("login", "ai_examiner");
            throw new Error("Sign in required for AI Examiner.");
          }
          const questionText = q.value.trim();
          const answerText = ans.value.trim();
          if (!questionText || !answerText) {
            throw new Error("Add both a question and an answer.");
          }
          const response = await RA10.examineAnswer({
            question: { question: questionText, marks: 16, command_verb: "Evaluate", learning_aim: "3.1" },
            answer: answerText
          });
          out.innerHTML = "";
          renderAiExaminerFeedback(out, response.result || {});
          const score = Number(response && response.result && response.result.earned) || 0;
          const max = Number(response && response.result && response.result.max) || 1;
          const ok = score >= Math.ceil(max / 2);
          markAttempt(ok);
          await renderUnitCreditChip();
        } catch (err) {
          out.innerHTML = "";
          out.appendChild(createEl("p", "small", `Error: ${err.message}`));
        }
      });
      card.appendChild(q);
      card.appendChild(ans);
      card.appendChild(runBtn);
      card.appendChild(out);
      stage.appendChild(card);
      return;
    }

    if (modeValue === "duo") {
      const lessons = filterByTopic(APP_DATA.duolingoLessons);
      const lesson = lessons[Math.floor(Math.random() * lessons.length)] || APP_DATA.duolingoLessons[0];
      runDuolingo(stage, lesson);
      return;
    }

    const source = modeValue === "mcq" ? APP_DATA.mcqs : modeValue === "fill" ? APP_DATA.fillBlanks : APP_DATA.examStyle;
    const filtered = filterByTopic(source);
    const size = Math.min(Number(setSize.value), filtered.length || 0);
    if (!size) {
      stage.appendChild(createEl("p", "", "No questions available for that filter."));
      return;
    }

    const list = [...filtered].sort(() => Math.random() - 0.5).slice(0, size);
    const session = makeSession(modeValue, list);
    state.practiceSession = session;

    if (modeValue === "mcq") renderObjectiveSession(stage, session, "mcq");
    if (modeValue === "fill") renderObjectiveSession(stage, session, "fill");
    if (modeValue === "exam") renderObjectiveSession(stage, session, "exam");
  };

  start.addEventListener("click", startSet);
  startSet();
}

function renderFlashcards() {
  const root = document.getElementById("flashcards");
  root.innerHTML = "";
  root.appendChild(createEl("p", "kicker", "Active recall"));
  root.appendChild(createEl("h2", "", "Topic-sorted flashcard deck"));

  const extractedTopics = new Set();
  APP_DATA.flashcards.forEach((f) => {
    const matches = (f.topic || "").match(/3\.(10|[1-9])/g);
    if (matches) matches.forEach((m) => extractedTopics.add(m));
  });

  const topics = ["all", ...Array.from(extractedTopics).sort((a, b) => Number(a.replace("3.", "")) - Number(b.replace("3.", "")) )];
  state.activeFlashList = [...APP_DATA.flashcards];
  state.flashIndex = 0;

  const topicRow = createEl("div", "flash-topic-list", "");
  topics.forEach((topic) => {
    const chip = createEl("button", `topic-chip ${topic === "all" ? "active" : ""}`, topic.toUpperCase());
    chip.addEventListener("click", () => {
      state.activeFlashTopic = topic;
      [...topicRow.children].forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      state.activeFlashList = topic === "all" ? [...APP_DATA.flashcards] : APP_DATA.flashcards.filter((f) => (f.topic || "").includes(topic));
      state.flashIndex = 0;
      drawCard();
    });
    topicRow.appendChild(chip);
  });

  const controls = createEl("div", "flash-controls", "");
  const prev = createEl("button", "btn btn-ghost", "Previous");
  const flip = createEl("button", "btn", "Flip");
  const next = createEl("button", "btn", "Next");
  const status = createEl("p", "pager", "");
  const stillLearningBtn = createEl("button", "btn btn-ghost", "Still learning");
  const knowItBtn = createEl("button", "btn", "Know it");
  const swipeHint = createEl("p", "small", "Swipe left = Still learning, swipe right = Know it (mobile)");

  controls.appendChild(prev);
  controls.appendChild(flip);
  controls.appendChild(next);
  controls.appendChild(stillLearningBtn);
  controls.appendChild(knowItBtn);
  controls.appendChild(status);

  const stage = createEl("div", "flash-stage", "");
  const progressTrack = createEl("div", "progress-track flash-progress-track", "");
  const progressFill = createEl("div", "progress-fill flash-progress-fill", "");
  progressTrack.appendChild(progressFill);
  const progressLabel = createEl("p", "small", "");
  const deck = createEl("div", "flash-deck", "");
  stage.appendChild(progressTrack);
  stage.appendChild(progressLabel);
  stage.appendChild(deck);

  root.appendChild(topicRow);
  root.appendChild(controls);
  root.appendChild(swipeHint);
  root.appendChild(stage);

  let flipped = false;

  const keyForCard = (cardData) => `${cardData.topic}::${cardData.front}`;

  const updateFlashProgress = () => {
    if (!state.activeFlashList.length) {
      progressFill.style.width = "0%";
      progressLabel.textContent = "No flashcards in this filter.";
      return;
    }
    const known = state.activeFlashList.filter((card) => state.flashStatus[keyForCard(card)] === "known").length;
    const learning = state.activeFlashList.filter((card) => state.flashStatus[keyForCard(card)] === "learning").length;
    const pct = Math.round((known / state.activeFlashList.length) * 100);
    progressFill.style.width = `${pct}%`;
    progressLabel.textContent = `${known}/${state.activeFlashList.length} known (${pct}%) | ${learning} still learning`;
  };

  const markCard = (type) => {
    if (!state.activeFlashList.length) return;
    const cardData = state.activeFlashList[state.flashIndex];
    const key = keyForCard(cardData);
    state.flashStatus[key] = type;
    saveFlashStatus();
    updateFlashProgress();
    flipped = false;
    state.flashIndex = (state.flashIndex + 1) % state.activeFlashList.length;
    drawCard();
  };

  let touchStartX = 0;

  const drawCard = () => {
    deck.innerHTML = "";
    if (!state.activeFlashList.length) {
      deck.appendChild(createEl("p", "", "No flashcards for this topic."));
      updateFlashProgress();
      return;
    }

    const cardData = state.activeFlashList[state.flashIndex];
    const card = createEl("article", `flash-card ${flipped ? "flipped" : ""}`, "");

    const front = createEl("div", "flash-face front", "");
    front.appendChild(createEl("p", "flash-topic", cardData.topic));
    front.appendChild(createEl("p", "flash-text", cardData.front));

    const back = createEl("div", "flash-face back", "");
    back.appendChild(createEl("p", "flash-topic", cardData.topic));
    back.appendChild(createEl("p", "flash-text", cardData.back));

    const mastery = createEl("p", "small", "");
    const masteryState = state.flashStatus[keyForCard(cardData)];
    mastery.textContent = masteryState === "known"
      ? "Mastery: Known"
      : masteryState === "learning"
        ? "Mastery: Still learning"
        : "Mastery: Unrated";

    card.appendChild(front);
    card.appendChild(back);
    card.appendChild(mastery);

    card.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    card.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (dx > 55) markCard("known");
      if (dx < -55) markCard("learning");
    }, { passive: true });

    deck.appendChild(card);
    status.textContent = `Card ${state.flashIndex + 1}/${state.activeFlashList.length}`;
    updateFlashProgress();
  };

  prev.addEventListener("click", () => {
    if (!state.activeFlashList.length) return;
    flipped = false;
    state.flashIndex = (state.flashIndex - 1 + state.activeFlashList.length) % state.activeFlashList.length;
    drawCard();
  });

  next.addEventListener("click", () => {
    if (!state.activeFlashList.length) return;
    flipped = false;
    state.flashIndex = (state.flashIndex + 1) % state.activeFlashList.length;
    drawCard();
  });

  flip.addEventListener("click", () => {
    flipped = !flipped;
    drawCard();
  });

  stillLearningBtn.addEventListener("click", () => markCard("learning"));
  knowItBtn.addEventListener("click", () => markCard("known"));

  drawCard();
}

function renderExamTechnique() {
  const root = document.getElementById("examTechnique");
  root.innerHTML = "";
  root.appendChild(createEl("p", "kicker", "Exam execution system"));
  root.appendChild(createEl("h2", "", "Proper exam-technique toolkit"));

  const timing = createEl("article", "tech-card", "");
  timing.appendChild(createEl("h3", "", "Timing plan"));
  const ulA = createEl("ul", "", "");
  APP_DATA.examTechnique.timingPlan.forEach((t) => ulA.appendChild(createEl("li", "", t)));
  timing.appendChild(ulA);

  const commands = createEl("article", "tech-card", "");
  commands.appendChild(createEl("h3", "", "Command words"));
  const commandGrid = createEl("div", "command-grid", "");
  APP_DATA.examTechnique.commandWords.forEach((c) => {
    const cc = createEl("div", "command-card", "");
    cc.innerHTML = `<strong>${c.word}</strong><p>${c.move}</p><p class="small">Trap: ${c.trap}</p>`;
    commandGrid.appendChild(cc);
  });
  commands.appendChild(commandGrid);

  root.appendChild(timing);
  root.appendChild(commands);
}

function bindGlobalActions() {
  document.getElementById("unit-account-avatar")?.addEventListener("click", openAccountOrSignIn);

  const themeBtn = document.getElementById("unit-theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
      setTheme(nextTheme);
    });
  }

  document.getElementById("unit-news-btn")?.addEventListener("click", openUnitNews);

  document.getElementById("resetScoreBtn").addEventListener("click", () => {
    state.score = { correct: 0, attempted: 0 };
    saveScore();
    updateScoreUI();
  });

  document.getElementById("printPageBtn").addEventListener("click", () => window.print());

  document.getElementById("downloadPackBtn").addEventListener("click", () => {
    const jsPdfApi = window.jspdf;
    if (!jsPdfApi || !jsPdfApi.jsPDF) {
      alert("PDF engine failed to load. Please refresh and try again.");
      return;
    }

    const { jsPDF } = jsPdfApi;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 42;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    const ensureSpace = (needed = 20) => {
      if (y + needed <= pageHeight - margin) return;
      doc.addPage();
      y = margin;
    };

    const addHeading = (text) => {
      ensureSpace(28);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(text, margin, y);
      y += 20;
    };

    const addBody = (text, indent = 0) => {
      const lines = doc.splitTextToSize(text, maxWidth - indent);
      ensureSpace(14 * lines.length + 4);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.text(lines, margin + indent, y);
      y += 14 * lines.length + 2;
    };

    addHeading("A-Level Business Paper 1 Revision Pack");
    addBody(`Exported: ${new Date().toLocaleString()}`);
    addBody(`Score: ${state.score.correct}/${state.score.attempted}`);

    addHeading("Topic Coverage");
    APP_DATA.revisionTopics.forEach((topic) => {
      addBody(`${topic.code} ${topic.title}`);
      topic.definitions.slice(0, 3).forEach((d) => addBody(`- ${d.term}: ${d.meaning}`, 12));
    });

    addHeading("Core Formula Bank");
    APP_DATA.formulas.forEach((f) => {
      const label = f.name !== f.expandedName ? `${f.name} (${f.expandedName})` : f.expandedName;
      addBody(`${label}: ${formatFormulaText(f.formula)} [${f.topic}]`);
    });

    addHeading("Model Index");
    APP_DATA.modelsDetailed.forEach((m) => addBody(`${m.name} (${m.topic}) - ${m.whatItsFor}`));

    doc.save("a-level-business-paper-1-revision-pack.pdf");
  });
}

function init() {
  const savedTheme = localStorage.getItem(RA10_THEME_KEY) || localStorage.getItem("aqaTheme") || "light";
  setTheme(savedTheme);
  renderNav();
  renderRevision();
  renderModels();
  renderFormulas();
  renderPaperTrends();
  renderPractice();
  renderFlashcards();
  renderExamTechnique();
  updateScoreUI();
  updateHeroMetrics();
  bindGlobalActions();
  initRa10Shell();
  showView("revision");
  
  /* Show community alpha notice if user is logged in */
  const communityNotice = document.getElementById("community-alpha-notice");
  if (communityNotice && window.RA10 && typeof RA10.on === "function") {
    RA10.on("authchange", () => {
      if (RA10.isLoggedIn()) {
        communityNotice.style.display = "block";
      }
    });
    if (RA10.isLoggedIn()) {
      communityNotice.style.display = "block";
    }
  }
}

init();