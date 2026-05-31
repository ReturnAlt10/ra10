(function () {
  if (window.__ra10RefreshLoaded) return;
  window.__ra10RefreshLoaded = true;

  document.documentElement.setAttribute("data-ra10-refresh", "1");

  function addBodyClass() {
    if (!document.body) return;
    document.body.classList.add("ra10-refresh-enabled");
  }

  function ensureProgressBar() {
    if (document.querySelector(".ra10-scroll-progress")) return;
    var bar = document.createElement("div");
    bar.className = "ra10-scroll-progress";
    document.body.appendChild(bar);

    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = Math.max(0, Math.min(100, ratio)).toFixed(2) + "%";
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function setupReveal() {
    var selectors = [
      ".card",
      ".aim-card",
      ".tool-card",
      ".question-card",
      ".qrow",
      ".stat",
      ".stat-card",
      ".hero",
      ".dashboard-hero",
      ".paper-section",
      ".flash-card"
    ];

    var nodes = document.querySelectorAll(selectors.join(","));
    if (!nodes.length) return;

    nodes.forEach(function (el, idx) {
      if (idx < 36) el.classList.add("ra10-reveal");
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -6% 0px" });

    document.querySelectorAll(".ra10-reveal").forEach(function (el) { io.observe(el); });
  }

  function shouldSuppressStreakChip() {
    var route = (location.pathname + " " + location.hash).toLowerCase();
    var isUnitRevisionRoute = /\/revision\/btec\/.*\/unit-\d+/.test(route);
    var hasNativeStreakUi = !!document.querySelector([
      ".you-hero-streak",
      ".u1-sb-kpi.streak",
      "#papers-fun-streak",
      "[data-streak-widget]",
      ".streak-widget"
    ].join(","));
    return isUnitRevisionRoute || hasNativeStreakUi;
  }

  function renderStreakChip() {
    var existing = document.querySelector(".ra10-float-chip");
    if (existing) existing.remove();
  }

  function syncStreakChipByRoute() {
    var existing = document.querySelector(".ra10-float-chip");
    if (existing) existing.remove();
  }

  function syncActiveNavFromScroll() {
    var navButtons = Array.prototype.slice.call(document.querySelectorAll(".viewer-nav-btn[data-q]"));
    var pages = Array.prototype.slice.call(document.querySelectorAll(".page"));
    if (!navButtons.length || !pages.length) return;

    function update() {
      var center = window.scrollY + (window.innerHeight * 0.35);
      var activeIdx = 0;
      pages.forEach(function (p, i) {
        if (p.offsetTop <= center) activeIdx = i;
      });
      navButtons.forEach(function (btn) { btn.classList.remove("active"); });
      var target = navButtons[Math.max(0, Math.min(navButtons.length - 1, activeIdx - 1))];
      if (target) target.classList.add("active");
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function init() {
    addBodyClass();
    ensureProgressBar();
    setupReveal();
    syncStreakChipByRoute();
    syncActiveNavFromScroll();
    window.addEventListener("hashchange", syncStreakChipByRoute);
    window.addEventListener("popstate", syncStreakChipByRoute);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
