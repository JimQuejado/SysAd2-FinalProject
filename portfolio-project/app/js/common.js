// Shared helpers used by the home page and the member pages.
const TERMS = [
  { key: "prelim",  label: "Prelim",  hoa: "prelimHoa",  exam: "prelimExam" },
  { key: "midterm", label: "Midterm", hoa: "midtermHoa", exam: "midtermExam" },
  { key: "finals",  label: "Finals",  hoa: "finalsHoa",  exam: "finalExam" }
];

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "class") node.className = v;
    else if (k === "style") node.style.cssText = v;
    else node.setAttribute(k, v);
  }
  for (const c of children.flat()) if (c !== null && c !== undefined) node.append(c);
  return node;
}

function initials(name) {
  return name.split(/\s+/).map(p => p[0]).join("").slice(0, 2).toUpperCase();
}

function avatar(m, size = "") {
  return m.photo
    ? el("img", { class: `avatar ${size}`, src: m.photo, alt: m.name, style: `--accent:${m.accent}` })
    : el("div", { class: `avatar ${size}`, "aria-hidden": "true", style: `--accent:${m.accent}` }, initials(m.name));
}

function topNav(activeId) {
  const links = MEMBERS.map(m =>
    el("a", { href: `${m.id}.html`, class: m.id === activeId ? "active" : "", style: `--accent:${m.accent}` },
      el("span", { class: "dot" }), m.nav || m.name));
  return el("header", { class: "topbar" },
    el("div", { class: "wrap topbar-inner" },
      el("a", { class: "brand", href: "index.html" }, el("span", { class: "logo" }, "</>"), GROUP.name),
      el("nav", { class: "nav-links", "aria-label": "Members" },
        el("a", { href: "index.html", class: activeId ? "" : "active" }, "Home"), links)));
}

function footer() {
  const f = el("footer", { class: "site-footer" },
    el("div", { class: "wrap footer-inner" },
      el("p", {}, `${GROUP.course} · ${GROUP.section}`),
      el("p", { class: "server-info" }, "Served by ", el("code", { id: "server-info" }, "…"))));
  // /server-info is answered by nginx inside the container (docker/default.conf.template),
  // so each VM shows its own hostname: handy for the grading screenshots.
  fetch("/server-info").then(r => r.ok ? r.json() : Promise.reject())
    .then(i => { document.getElementById("server-info").textContent = `${i.host} · container ${i.container}`; })
    .catch(() => { document.getElementById("server-info").textContent = "static hosting (no Docker)"; });
  return f;
}

// An item with "activities" counts as done once every activity has its PDF
// (and its YAML, when the activity has a "yaml" field).
function isFilled(item) {
  if (!item) return false;
  if (Array.isArray(item.activities))
    return item.activities.length > 0 && item.activities.every(a => a.pdf && (!("yaml" in a) || a.yaml));
  return Boolean(item.summary) && !item.summary.startsWith("TODO");
}

function completion(m) {
  const keys = ["prelimHoa","prelimExam","midtermHoa","midtermExam","finalsHoa","finalExam","reflection"];
  const done = keys.filter(k => isFilled(m.items[k])).length;
  return { done, total: keys.length };
}
