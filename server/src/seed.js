import bcrypt from "bcryptjs";
import db from "./db.js";

async function seed() {
  console.log("Seeding database...");

  // Admin user
  const hash = await bcrypt.hash("admin123", 10);
  await db.query(
    `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING`,
    ["Admin", "admin@centericsolutions.com", hash, "admin"]
  );

  // Hero pages
  const pages = [
    { id: "home",    page: "Home",         route: "/" },
    { id: "about",   page: "About",        route: "/about" },
    { id: "courses", page: "Courses",      route: "/courses" },
    { id: "instructors", page: "Instructors", route: "/instructors" },
    { id: "testimonials", page: "Testimonials", route: "/testimonials" },
    { id: "contact", page: "Contact",      route: "/contact" },
    { id: "blog",    page: "Blog",         route: "/blog" },
  ];
  for (const p of pages) {
    await db.query(
      `INSERT INTO hero_pages (id, page, route) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
      [p.id, p.page, p.route]
    );
  }

  // Home hero slide (split)
  const homePage = await db.query("SELECT id FROM hero_pages WHERE id = 'home'");
  if (homePage.rows.length) {
    await db.query(
      `INSERT INTO hero_slides (hero_page_id, sort_order, layout, gradient_origin, eyebrow, title, subtitle,
       stat_1_num, stat_1_label, stat_2_num, stat_2_label, stat_3_num, stat_3_label,
       cta_primary_text, cta_primary_href, cta_secondary_text, cta_secondary_href)
       VALUES ($1,0,'split','82% 15%',$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) ON CONFLICT DO NOTHING`,
      [
        "home",
        "Centeric Solutions · Technology Academy",
        'Build a career the market actually <span class="accent-word">wants</span>.',
        "Centeric Solutions teaches practical, industry-shaped skills — web development, AI, UX, and marketing — through short, focused courses built with working professionals in mind.",
        "2,400+", "Students taught",
        "18", "Live courses",
        "94%", "Completion rate",
        "Explore Courses", "/courses",
        "How It Works", "/about",
      ]
    );
  }

  // Courses
  const courses = [
    { slug: "full-stack-foundations",      title: "Full-Stack Foundations",     desc: "Go from zero to a deployed, working application — HTML through databases, taught in public with real code reviews.",                    tag: "Web Development",       tag_color: "indigo",  gradient: "linear-gradient(135deg,#5B4FE5,#2f2793)",   duration: "12 weeks", level: "Beginner",    instructor: "Amara Osei",   rating: 4.9, students: 840 },
    { slug: "react-modern-frontend",       title: "React & Modern Frontend",    desc: "Master React, Next.js, and modern CSS — build dynamic interfaces with the tools top tech companies use every day.",                  tag: "Web Development",       tag_color: "indigo",  gradient: "linear-gradient(135deg,#6C63FF,#3f37c9)",   duration: "8 weeks",  level: "Intermediate", instructor: "Amara Osei",   rating: 4.8, students: 620 },
    { slug: "nodejs-apis",                 title: "Node.js & APIs",             desc: "Design and build production-ready REST and GraphQL APIs. Covers authentication, testing, and deployment on cloud infrastructure.", tag: "Web Development",       tag_color: "indigo",  gradient: "linear-gradient(135deg,#7c6cf0,#4a3fbf)",   duration: "8 weeks",  level: "Intermediate", instructor: "Elena Rossi",   rating: 4.7, students: 410 },
    { slug: "applied-ai-for-teams",        title: "Applied AI for Teams",       desc: "Learn to actually ship AI features — prompting, evaluation, and integration — through four real client-style briefs.",                tag: "Artificial Intelligence", tag_color: "emerald", gradient: "linear-gradient(135deg,#0EA97A,#0a6b4e)", duration: "8 weeks",  level: "Intermediate", instructor: "Daniel Cho",    rating: 4.9, students: 730 },
    { slug: "machine-learning-fundamentals", title: "Machine Learning Fundamentals", desc: "Build your first models from scratch. Covers regression, classification, neural networks, and ethical AI practices.",            tag: "Artificial Intelligence", tag_color: "emerald", gradient: "linear-gradient(135deg,#1ABC9C,#148f77)", duration: "10 weeks", level: "Beginner",    instructor: "Daniel Cho",    rating: 4.8, students: 560 },
    { slug: "product-design-sprint",       title: "Product Design Sprint",      desc: "Design and test a full product flow in six weeks, and leave with a case study strong enough for your portfolio.",                     tag: "UI/UX Design",          tag_color: "gold",    gradient: "linear-gradient(135deg,#E8B646,#a97a1a)",   duration: "6 weeks",  level: "Beginner",    instructor: "Priya Nair",   rating: 4.9, students: 910 },
    { slug: "design-systems-figma",        title: "Design Systems & Figma",     desc: "Create scalable design systems in Figma — from design tokens to component libraries that developers love to use.",                   tag: "UI/UX Design",          tag_color: "gold",    gradient: "linear-gradient(135deg,#F39C12,#c47f10)",   duration: "6 weeks",  level: "Intermediate", instructor: "Priya Nair",   rating: 4.7, students: 470 },
    { slug: "digital-marketing-analytics", title: "Digital Marketing Analytics", desc: "Make data-driven marketing decisions. Covers SEO, paid media, conversion optimization, and analytics platforms.",                    tag: "Marketing",             tag_color: "rose",    gradient: "linear-gradient(135deg,#E74C3C,#b03a2e)",   duration: "8 weeks",  level: "Beginner",    instructor: "Marcus Chen",  rating: 4.6, students: 350 },
  ];
  for (let i = 0; i < courses.length; i++) {
    const c = courses[i];
    await db.query(
      `INSERT INTO courses (slug, title, description, tag, tag_color, gradient, duration, level, instructor, rating, students, is_featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT (slug) DO NOTHING`,
      [c.slug, c.title, c.desc, c.tag, c.tag_color, c.gradient, c.duration, c.level, c.instructor, c.rating, c.students, i < 3]
    );
  }

  // Instructors
  const instructors = [
    { name: "Amara Osei",   role: "Web Development Lead", bio: "Former senior engineer at Shopify. Teaches full-stack development the way it's actually practiced on the job — with real code reviews, real deployments, and real standards.",       specialty: "Full-Stack Web Development",    tag_color: "indigo",  gradient: "linear-gradient(135deg,#5B4FE5,#2f2793)",   students: 1460, courses: 2, rating: 4.85 },
    { name: "Daniel Cho",   role: "AI & Data Lead",       bio: "Machine learning engineer with a decade of experience shipping production ML at scale across fintech and health-tech.",                                                       specialty: "Machine Learning & AI",         tag_color: "emerald", gradient: "linear-gradient(135deg,#0EA97A,#0a6b4e)", students: 1680, courses: 3, rating: 4.87 },
    { name: "Priya Nair",   role: "Design Lead",          bio: "Product designer who has shaped experiences used by millions at Spotify and Deliveroo.",                                                                                        specialty: "UI/UX & Product Design",        tag_color: "gold",    gradient: "linear-gradient(135deg,#E8B646,#a97a1a)",   students: 1380, courses: 2, rating: 4.8 },
    { name: "Elena Rossi",  role: "CEO & Co-Founder",     bio: "Built and sold two ed-tech startups before founding Centeric Solutions to fix what she felt was broken in technology education.",                                                specialty: "Ed-Tech & API Development",      tag_color: "indigo",  gradient: "linear-gradient(135deg,#6C63FF,#3f37c9)",   students: 410,  courses: 1, rating: 4.7 },
    { name: "Marcus Chen",  role: "Marketing Lead",        bio: "Growth marketer with a track record of scaling revenue at Intercom and Zapier through data-driven campaigns.",                                                                    specialty: "Digital Marketing & Analytics", tag_color: "rose",    gradient: "linear-gradient(135deg,#E74C3C,#b03a2e)",   students: 350,  courses: 1, rating: 4.6 },
  ];
  for (const inst of instructors) {
    await db.query(
      `INSERT INTO instructors (name, role, bio, specialty, tag_color, gradient, students, course_count, rating)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT DO NOTHING`,
      [inst.name, inst.role, inst.bio, inst.specialty, inst.tag_color, inst.gradient, inst.students, inst.courses, inst.rating]
    );
  }

  console.log("Seed complete.");
  await db.pool.end();
}

seed();
