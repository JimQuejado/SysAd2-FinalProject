document.title = `${GROUP.name} · ${GROUP.course}`;
const app = document.getElementById("app");

const hero = el("section", { class: "hero" },
  el("div", { class: "wrap" },
    el("p", { class: "eyebrow" }, `${GROUP.course} · ${GROUP.section}`),
    el("h1", {}, GROUP.name),
    el("p", { class: "lead" }, GROUP.tagline),
    el("div", { class: "stack" },
      ["Static HTML/CSS/JS", "nginx:alpine", "Docker", "Ansible", "CentOS + Ubuntu"].map(s => el("span", { class: "chip" }, s)))));

const grid = el("div", { class: "member-grid" },
  MEMBERS.map((m, i) => {
    const c = completion(m);
    return el("a", { class: "member-card", href: `${m.id}.html`, style: `--accent:${m.accent}; --i:${i}` },
      el("div", { class: "card-glow" }),
      avatar(m, "lg"),
      el("h2", {}, m.name),
      el("p", { class: "role" }, m.role),
      el("p", { class: "bio" }, m.bio),
      el("div", { class: "progress", title: `${c.done} of ${c.total} items filled in` },
        el("span", { style: `width:${(c.done / c.total) * 100}%` })),
      el("span", { class: "cta" }, "View portfolio →"));
  }));

const items = el("section", { class: "wrap section" },
  el("h2", { class: "section-title" }, "What each portfolio contains"),
  el("div", { class: "item-list" },
    ["Prelim HOA", "Midterm HOA", "Finals HOA", "Prelim Exam", "Midterm Exam", "Final Exam", "Reflection and Learnings"]
      .map((t, i) => el("div", { class: "item-pill" }, el("b", {}, String(i + 1).padStart(2, "0")), t))));

app.append(topNav(null), hero, el("main", { class: "wrap" }, grid), items, footer());
