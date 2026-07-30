function slide(layout, fields) {
  return { layout, gradientOrigin: "50% 50%", ...fields };
}

export const PAGE_HEROES = [
  {
    id: "home", page: "Home", route: "/",
    carousel: { enabled: false, interval: 5 },
    slides: [
      slide("split", {
        eyebrow: "Centeric Solutions \u00B7 Technology Academy",
        title: 'Build a career the<br />market actually <span class="accent-word">wants</span>.',
        subtitle: "Centeric Solutions teaches practical, industry-shaped skills \u2014 web development, AI, UX, and marketing \u2014 through short, focused courses built with working professionals in mind.",
        gradientOrigin: "82% 15%",
        stats: [{ num: "2,400+", label: "Students taught" }, { num: "18", label: "Live courses" }, { num: "94%", label: "Completion rate" }],
        ctaPrimary: { text: "Explore Courses", href: "/courses" },
        ctaSecondary: { text: "How It Works", href: "/about" },
      }),
    ],
  },
  {
    id: "about", page: "About", route: "/about",
    carousel: { enabled: false, interval: 5 },
    slides: [
      slide("quote", {
        eyebrow: "About Centeric Solutions",
        title: 'We\u2019re rebuilding tech education to match how the industry <span class="accent-word">actually</span> works.',
        subtitle: "Most courses teach you tools. We teach you how to think, collaborate, and ship \u2014 the capabilities employers pay for.",
        gradientOrigin: "20% 30%",
        quote: { text: "\u201CTechnology education shouldn\u2019t be a filter \u2014 it should be a bridge. We exist to make that bridge accessible, practical, and human.\u201D", author: "Elena Rossi", role: "CEO & Co-Founder" },
      }),
    ],
  },
  {
    id: "courses", page: "Courses", route: "/courses",
    carousel: { enabled: false, interval: 5 },
    slides: [
      slide("standard", {
        eyebrow: "All Courses",
        title: 'A catalog built around <span class="accent-word">real</span> career outcomes.',
        subtitle: "Every course is taught by a practicing professional, built around real projects, and kept intentionally small so you get the support you deserve.",
        gradientOrigin: "70% 20%",
      }),
    ],
  },
  {
    id: "instructors", page: "Instructors", route: "/instructors",
    carousel: { enabled: false, interval: 5 },
    slides: [
      slide("standard", {
        eyebrow: "Our Instructors",
        title: 'Learn from people who <span class="accent-word">build</span> for a living.',
        subtitle: "Every instructor at Centeric Solutions is currently working in the field they teach. No full-time academics. No outdated curricula. Just practitioners who know what it takes to succeed.",
        gradientOrigin: "30% 80%",
      }),
    ],
  },
  {
    id: "testimonials", page: "Testimonials", route: "/testimonials",
    carousel: { enabled: false, interval: 5 },
    slides: [
      slide("standard", {
        eyebrow: "Testimonials",
        title: 'Stories from students who made the <span class="accent-word">leap</span>.',
        subtitle: "The best way to understand what Centeric Solutions is like is to hear from the people who've been through it. These are their stories.",
        gradientOrigin: "60% 30%",
      }),
    ],
  },
  {
    id: "contact", page: "Contact", route: "/contact",
    carousel: { enabled: false, interval: 5 },
    slides: [
      slide("standard", {
        eyebrow: "Get in Touch",
        title: 'We\u2019d love to hear from <span class="accent-word">you</span>.',
        subtitle: "Whether you have a question about a course, want to partner with us, or just want to say hello \u2014 we're here for you.",
        gradientOrigin: "40% 60%",
      }),
    ],
  },
  {
    id: "blog", page: "Blog", route: "/blog",
    carousel: { enabled: false, interval: 5 },
    slides: [
      slide("standard", {
        eyebrow: "Blog",
        title: 'Insights from the people who <span class="accent-word">teach</span> here.',
        subtitle: "Articles about learning, career growth, and the future of technology education \u2014 written by the people building Centeric Solutions.",
        gradientOrigin: "50% 40%",
      }),
    ],
  },
];

export const LAYOUT_OPTIONS = [
  { value: "standard", label: "Standard", desc: "Centered text block \u2014 clean and minimal. Best for content pages." },
  { value: "split", label: "Split", desc: "Two-column with text left, decorative graphic right, stats bar and CTA buttons." },
  { value: "quote", label: "Quote", desc: "Two-column with text left, featured quote card right. Best for about pages." },
];

export const SLIDE_LIMIT = 4;
export const INTERVAL_MAX = 10;

export function emptySlide() {
  return slide("standard", {
    eyebrow: "", title: "", subtitle: "",
    stats: [], ctaPrimary: null, ctaSecondary: null, quote: null,
  });
}
