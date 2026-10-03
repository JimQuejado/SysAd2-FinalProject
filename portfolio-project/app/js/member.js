// Renders one member's portfolio. The page sets <body data-member="member-N">.
const memberId = document.body.dataset.member;
const m = MEMBERS.find(x => x.id === memberId) || MEMBERS[0];
document.title = `${m.name} · ${GROUP.name}`;
document.documentElement.style.setProperty("--accent", m.accent);
const app = document.getElementById("app");

function workCard(kind, title, item) {
  return el("article", { class: "work-card" },
    item.image ? el("img", { class: "work-img", src: item.image, alt: title, loading: "lazy" }) : null,
    el("div", { class: "work-body" },
      el("div", { class: "work-meta" }, el("span", { class: "tag" }, kind), item.date ? el("span", { class: "date" }, item.date) : null),
      el("h3", {}, title),
      el("p", {}, item.summary || "Not yet submitted."),
      item.file ? el("a", { class: "btn", href: item.file, target: "_blank", rel: "noopener" }, "View output ↗") : null));
}

// One row per activity: PDF button, plus a YAML button that shows the playbook inline.
function activityRow(a, i) {
  const fileBtns = [];
  fileBtns.push(a.pdf
    ? el("a", { class: "btn sm", href: a.pdf, target: "_blank", rel: "noopener" }, "PDF ↗")
    : el("span", { class: "btn sm pending" }, "PDF pending"));
  let code = null;
  if ("yaml" in a) {
    if (a.yaml) {
      code = el("pre", { class: "yaml", hidden: true }, el("code", {}, "Loading…"));
      const toggle = el("button", { class: "btn sm ghost", type: "button", "aria-expanded": "false" }, "YAML ▾");
      toggle.addEventListener("click", () => {
        const open = code.hidden;
        code.hidden = !open;
        toggle.setAttribute("aria-expanded", String(open));
        toggle.textContent = open ? "YAML ▴" : "YAML ▾";
        if (open && !code.dataset.loaded) {
          code.dataset.loaded = "1";
          fetch(a.yaml).then(r => r.ok ? r.text() : Promise.reject())
            .then(t => { code.firstChild.textContent = t; })
            .catch(() => { code.firstChild.textContent = "Could not load the file here. Use the download link."; });
        }
      });
      fileBtns.push(toggle, el("a", { class: "btn sm ghost", href: a.yaml, download: "" }, "Download .yml"));
    } else {
      fileBtns.push(el("span", { class: "btn sm pending" }, "YAML pending"));
    }
  }
  return el("li", { class: "activity" },
    el("span", { class: "activity-num" }, String(i + 1)),
    el("div", { class: "activity-body" },
      el("div", { class: "activity-head" },
        el("h4", {}, a.title || `Activity ${i + 1}`),
        el("span", { class: "activity-kind" }, "yaml" in a ? "PDF + YAML" : "PDF"),
        a.date ? el("span", { class: "date" }, a.date) : null),
      a.summary ? el("p", {}, a.summary) : null,
      el("div", { class: "activity-files" }, fileBtns),
      code));
}

function activitiesCard(title, item) {
  const n = item.activities.length;
  return el("article", { class: "work-card wide" },
    el("div", { class: "work-body" },
      el("div", { class: "work-meta" }, el("span", { class: "tag" }, "Hands-on Activities"), el("span", { class: "date" }, `${n} activit${n === 1 ? "y" : "ies"}`)),
      el("h3", {}, title),
      item.summary ? el("p", {}, item.summary) : null,
      el("ol", { class: "activities" }, item.activities.map(activityRow))));
}

const links = [];
if (m.links.github) links.push(el("a", { class: "btn ghost", href: m.links.github, target: "_blank", rel: "noopener" }, "GitHub ↗"));
if (m.links.email) links.push(el("a", { class: "btn ghost", href: `mailto:${m.links.email}` }, "Email"));

const hero = el("section", { class: "profile" },
  el("div", { class: "wrap profile-inner" },
    avatar(m, "xl"),
    el("div", { class: "profile-text" },
      el("p", { class: "eyebrow" }, m.role),
      el("h1", {}, m.name),
      el("p", { class: "lead" }, m.bio),
      el("div", { class: "stack" }, m.skills.map(s => el("span", { class: "chip" }, s))),
      links.length ? el("div", { class: "links" }, links) : null)));

const jump = el("nav", { class: "jump wrap", "aria-label": "Sections" },
  TERMS.map(t => el("a", { href: `#${t.key}` }, t.label)),
  el("a", { href: "#reflection" }, "Reflection"));

const terms = TERMS.map(t =>
  el("section", { class: "term", id: t.key },
    el("div", { class: "term-head" }, el("h2", {}, t.label), el("span", { class: "line" })),
    el("div", { class: "work-grid" },
      Array.isArray((m.items[t.hoa] || {}).activities)
        ? activitiesCard(`${t.label} HOA`, m.items[t.hoa])
        : workCard("Hands-on Activity", `${t.label} HOA`, m.items[t.hoa] || {}),
      workCard("Exam", t.key === "finals" ? "Final Exam" : `${t.label} Exam`, m.items[t.exam] || {}))));

const r = m.items.reflection || {};
const reflection = el("section", { class: "term", id: "reflection" },
  el("div", { class: "term-head" }, el("h2", {}, "Reflection and Learnings"), el("span", { class: "line" })),
  el("article", { class: "reflection" },
    el("p", { class: "quote" }, r.summary || ""),
    r.learnings && r.learnings.length
      ? el("ul", { class: "learnings" }, r.learnings.map(l => el("li", {}, l)))
      : null));

const idx = MEMBERS.indexOf(m);
const prev = MEMBERS[(idx - 1 + MEMBERS.length) % MEMBERS.length];
const next = MEMBERS[(idx + 1) % MEMBERS.length];
const pager = el("nav", { class: "pager wrap" },
  el("a", { href: `${prev.id}.html` }, `← ${prev.name}`),
  el("a", { href: `${next.id}.html` }, `${next.name} →`));

app.append(topNav(m.id), hero, jump, el("main", { class: "wrap" }, terms, reflection), pager, footer());
