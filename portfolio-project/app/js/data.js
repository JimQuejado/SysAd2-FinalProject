/*
 * ============================================================
 *  EDIT THIS FILE to put in your group's real content.
 * ============================================================
 *
 *  Folder structure:
 *
 *  app/
 *  └── files/
 *      ├── member-1/
 *      │   ├── prelim/
 *      │   ├── midterm/
 *      │   └── finals/
 *      ├── member-2/
 *      │   ├── prelim/
 *      │   ├── midterm/
 *      │   └── finals/
 *      ├── member-3/
 *      │   ├── prelim/
 *      │   ├── midterm/
 *      │   └── finals/
 *      └── member-4/
 *          ├── prelim/
 *          ├── midterm/
 *          └── finals/
 *
 *
 *  HOA STRUCTURE:
 *
 *  PRELIM
 *    HOA 1-3  -> PDF only
 *    HOA 4-5  -> PDF + YAML
 *
 *  MIDTERM
 *    HOA 6-10 -> PDF + YAML
 *
 *  FINALS
 *    HOA 11-15 -> PDF + YAML
 *
 * ============================================================
 */

const GROUP = {
  name: "Group Portfolio",
  course: "Automating Server Management",
  section: "CPE212-S2",
  tagline: "ADD YOUR TAGLINE HERE"
};



const prelimActivities = (n) => [1, 2, 3, 4, 5].map(i => ({
  title: `Hands-on Activity ${i}`,
  date: "TODO",
  summary: `TODO: What Member ${n} did in HOA ${i}.`,
  pdf: `files/member-${n}/prelim/hoa-${i}.pdf`
}));

const midtermActivities = (n) => [6, 7, 8, 9, 10].map(i => ({
  title: `Hands-on Activity ${i}`,
  date: "TODO",
  summary: `TODO: What Member ${n} did in HOA ${i}.`,
  pdf: `files/member-${n}/midterm/hoa-${i}.pdf`
}));

const finalsActivities = (n) => [11, 12, 13, 14, 15].map(i => ({
  title: `Hands-on Activity ${i}`,
  date: "TODO",
  summary: `TODO: What Member ${n} did in HOA ${i}.`,
  pdf: `files/member-${n}/finals/hoa-${i}.pdf`
}));


// ============================================================
// MEMBER ITEMS
// ============================================================

const placeholderItems = (n) => ({

  // ----------------------------------------------------------
  // PRELIM
  // ----------------------------------------------------------

  prelimHoa: {
    summary: `Five hands-on activities from the Prelim period (HOA 1-5).`,
    activities: prelimActivities(n)
  },

  prelimExam: {
    date: "TODO",
    summary: `TODO: Member ${n}'s Prelim exam. Coverage, score, or output.`,
    image: "",
    file: ""
  },


  // ----------------------------------------------------------
  // MIDTERM
  // ----------------------------------------------------------

  midtermHoa: {
    summary: `Five hands-on activities from the Midterm period (HOA 6-10).`,
    activities: midtermActivities(n)
  },

  midtermExam: {
    date: "TODO",
    summary: `TODO: Member ${n}'s Midterm exam. Coverage, score, or output.`,
    image: "",
    file: ""
  },


  // ----------------------------------------------------------
  // FINALS
  // ----------------------------------------------------------

  finalsHoa: {
    summary: `Five hands-on activities from the Finals period (HOA 11-15).`,
    activities: finalsActivities(n)
  },

  finalExam: {
    date: "TODO",
    summary: `TODO: Member ${n}'s Final exam. Coverage, score, or output.`,
    image: "",
    file: ""
  },


  // ----------------------------------------------------------
  // REFLECTION
  // ----------------------------------------------------------

  reflection: {
    summary: `TODO: Member ${n}'s reflection on the whole course. What was hardest, what clicked, and how you will use it.`,

    learnings: [
      "TODO: Learning one",
      "TODO: Learning two",
      "TODO: Learning three"
    ]
  }
});


// ============================================================
// MEMBERS
// ============================================================

const MEMBERS = [

  // ==========================================================
  // MEMBER 1
  // ==========================================================

  {
    id: "member-1",

    name: "Jimlord Quejado",

    role: "Team Lead",

    bio: "add your bionote here",

    photo: "files/member-1/photo.jpg",

    nav: "Jim",

    accent: "#7c5cff",

    links: {
      github: "https://github.com/JimQuejado/SysAd2-FinalProjectJimQuejado",
      email: "jimquejado@gmail.com"
    },

    skills: [
      "Linux",
      "Ansible",
      "Docker",
      "C++",
    ],

    items: placeholderItems(1)
  },


  // ==========================================================
  // MEMBER 2
  // ==========================================================

  {
    id: "member-2",

    name: "Member Two",

    role: "Member",

    bio: "TODO: One or two sentences about this member.",

    photo: "",

    nav: "",

    accent: "#22c3a6",

    links: {
      github: "",
      email: ""
    },

    skills: [
      "Networking",
      "Bash"
    ],

    items: placeholderItems(2)
  },


  // ==========================================================
  // MEMBER 3
  // ==========================================================

  {
    id: "member-3",

    name: "Member Three",

    role: "Member",

    bio: "TODO: One or two sentences about this member.",

    photo: "",

    nav: "",

    accent: "#ff7a59",

    links: {
      github: "",
      email: ""
    },

    skills: [
      "CentOS",
      "SELinux"
    ],

    items: placeholderItems(3)
  },


  // ==========================================================
  // MEMBER 4
  // ==========================================================

  {
    id: "member-4",

    name: "Member Four",

    role: "Member",

    bio: "TODO: One or two sentences about this member.",

    photo: "",

    nav: "",

    accent: "#3ba7ff",

    links: {
      github: "",
      email: ""
    },

    skills: [
      "Ubuntu",
      "Nginx"
    ],

    items: placeholderItems(4)
  }

];