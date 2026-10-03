/*
 * ============================================================
 *  EDIT THIS FILE to put in your group's real content.
 * ============================================================
 *  - One entry per member (4 members). The "id" must match the
 *    page file name: id "member-1" -> member-1.html
 *  - Put each member's files (PDFs, screenshots) in
 *    app/files/<id>/ and reference them like
 *    "files/member-1/prelim-hoa.pdf".
 *    A full URL (GitHub, Google Drive) works too.
 *  - "image" shows a preview picture on the card (optional).
 *  - "file" shows a "View output" button (optional).
 *  - An HOA can instead hold a list of "activities" (Prelim HOA
 *    has 5). Each activity has a "pdf" (the documentation) and,
 *    if the activity has a playbook, a "yaml" too. Leave "yaml"
 *    out entirely for activities that are PDF only.
 *    Suggested layout: files/member-1/prelim/hoa-1.pdf,
 *                      files/member-1/prelim/hoa-4.yml
 */
const GROUP = {
  name: "Group Portfolio",                   // TODO e.g. "Team Kernel"
  course: "System Administration 2",
  section: "BSIT 3A",                        // TODO
  tagline: "Four members, one semester of hands-on activities, exams, and lessons learned."
};

// Prelim HOA: 5 activities. HOA 1-3 are PDF documentation only,
// HOA 4-5 have a PDF and a YAML playbook.
const prelimActivities = (n) => [1, 2, 3, 4, 5].map(i => ({
  title: `HOA ${i}`,                         // rename freely, e.g. "HOA 1.1"
  date: "TODO",
  summary: `TODO: What Member ${n} did in HOA ${i}.`,
  pdf: "",                                   // e.g. "files/member-1/prelim/hoa-1.pdf"
  ...(i >= 4 ? { yaml: "" } : {})            // e.g. "files/member-1/prelim/hoa-4.yml"
}));

const placeholderItems = (n) => ({
  prelimHoa:   { summary: `Five hands-on activities from the Prelim period.`, activities: prelimActivities(n) },
  prelimExam:  { date: "TODO", summary: `TODO: Member ${n}'s Prelim exam. Coverage, score, or output.`, image: "", file: "" },
  midtermHoa:  { date: "TODO", summary: `TODO: Member ${n}'s Midterm hands-on activity.`, image: "", file: "" },
  midtermExam: { date: "TODO", summary: `TODO: Member ${n}'s Midterm exam.`, image: "", file: "" },
  finalsHoa:   { date: "TODO", summary: `TODO: Member ${n}'s Finals hands-on activity.`, image: "", file: "" },
  finalExam:   { date: "TODO", summary: `TODO: Member ${n}'s Final exam.`, image: "", file: "" },
  reflection:  {
    summary: `TODO: Member ${n}'s reflection on the whole course. What was hardest, what clicked, and how you will use it.`,
    learnings: ["TODO: Learning one", "TODO: Learning two", "TODO: Learning three"]
  }
});

const MEMBERS = [
  {
    id: "member-1",
    name: "Member One",                      // TODO real name
    role: "Team Lead",                       // TODO
    bio: "TODO: One or two sentences about this member.",
    photo: "",                               // e.g. "files/member-1/photo.jpg"
    nav: "",                                 // optional short name for the top menu, e.g. first name
    accent: "#7c5cff",
    links: { github: "", email: "" },
    skills: ["Linux", "Ansible", "Docker"],
    items: placeholderItems(1)
  },
  {
    id: "member-2",
    name: "Member Two",
    role: "Member",
    bio: "TODO: One or two sentences about this member.",
    photo: "",
    nav: "",                                 // optional short name for the top menu, e.g. first name
    accent: "#22c3a6",
    links: { github: "", email: "" },
    skills: ["Networking", "Bash"],
    items: placeholderItems(2)
  },
  {
    id: "member-3",
    name: "Member Three",
    role: "Member",
    bio: "TODO: One or two sentences about this member.",
    photo: "",
    nav: "",                                 // optional short name for the top menu, e.g. first name
    accent: "#ff7a59",
    links: { github: "", email: "" },
    skills: ["CentOS", "SELinux"],
    items: placeholderItems(3)
  },
  {
    id: "member-4",
    name: "Member Four",
    role: "Member",
    bio: "TODO: One or two sentences about this member.",
    photo: "",
    nav: "",                                 // optional short name for the top menu, e.g. first name
    accent: "#3ba7ff",
    links: { github: "", email: "" },
    skills: ["Ubuntu", "Nginx"],
    items: placeholderItems(4)
  }
];
