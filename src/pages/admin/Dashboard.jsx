import { useState, useEffect } from "react";
import { Users, BookOpen, Star, MessageSquare, TrendingUp, DollarSign, Activity, GraduationCap, FileText } from "lucide-react";
import { api } from "../../api";
import AdminHero from "./AdminHero";
import { StatCard, Doughnut, MiniTrend } from "./Charts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ courses: 0, instructors: 0, testimonials: 0, blog: 0, students: 0, messages: 0, faqs: 0, heroes: 0 });
  const [alerts, setAlerts] = useState({ unread_messages: 0, pending_enrollments: 0, unpublished_posts: 0 });

  useEffect(() => {
    Promise.all([
      api.getCourses().catch(() => []),
      api.getInstructors().catch(() => []),
      api.getTestimonials().catch(() => []),
      api.getBlogPosts().catch(() => []),
      api.getStudents().catch(() => []),
      api.getMessages().catch(() => []),
      api.getFAQs().catch(() => []),
      api.getHeroes().catch(() => []),
      api.getNotificationCounts().catch(() => ({})),
    ]).then(([courses, instructors, testimonials, blog, students, messages, faqs, heroes, notifs]) => {
      setStats({
        courses: courses.length,
        instructors: instructors.length,
        testimonials: testimonials.length,
        blog: blog.length,
        students: students.length,
        messages: messages.length,
        faqs: faqs.length,
        heroes: heroes.length,
      });
      setAlerts({
        unread_messages: notifs.unread_messages || 0,
        pending_enrollments: notifs.pending_enrollments || 0,
        unpublished_posts: notifs.unpublished_posts || 0,
      });
    });
  }, []);

  const cards = [
    { label: "Students", value: stats.students, icon: Users, color: "var(--primary)", bg: "#F0EEFF" },
    { label: "Courses", value: stats.courses, icon: BookOpen, color: "var(--secondary)", bg: "#dff5ec" },
    { label: "Instructors", value: stats.instructors, icon: Users, color: "var(--secondary)", bg: "#dff5ec" },
    { label: "Testimonials", value: stats.testimonials, icon: Star, color: "var(--accent)", bg: "#fef5d8" },
    { label: "Blog Posts", value: stats.blog, icon: MessageSquare, color: "var(--accent)", bg: "#fef5d8" },
    { label: "Messages", value: stats.messages, icon: Activity, color: "#c0392b", bg: "#f9e0de" },
    { label: "FAQs", value: stats.faqs, icon: MessageSquare, color: "var(--primary)", bg: "#F0EEFF" },
    { label: "Hero Slides", value: stats.heroes, icon: Activity, color: "var(--accent)", bg: "#fef5d8" },
  ];

  const total = stats.students + stats.courses + stats.testimonials + stats.blog + stats.messages + stats.faqs + stats.heroes;
  const doughnutData = [
    { label: "Students", value: stats.students, color: "var(--primary)" },
    { label: "Courses", value: stats.courses, color: "var(--secondary)" },
    { label: "Testimonials", value: stats.testimonials, color: "var(--accent)" },
    { label: "Blog", value: stats.blog, color: "#c0392b" },
    { label: "Messages", value: stats.messages, color: "#E5989E" },
  ].filter((d) => d.value > 0);

  return (
    <div>
      <AdminHero icon={Activity} title="Dashboard" subtitle="Welcome back! Here's your content overview at a glance."
        gradient="linear-gradient(135deg,var(--primary),#2f2793)" />

      {(alerts.unread_messages > 0 || alerts.pending_enrollments > 0 || alerts.unpublished_posts > 0) && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {alerts.unread_messages > 0 && (
            <div style={{ background: "#fff", border: "1px solid #f9e0de", borderRadius: 12, padding: 20, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: "#fce4e4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MessageSquare size={20} color="#c0392b" />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#c0392b", lineHeight: 1.2 }}>{alerts.unread_messages}</div>
                <div style={{ fontSize: 12.5, color: "#5B6172" }}>Unread messages</div>
              </div>
            </div>
          )}
          {alerts.pending_enrollments > 0 && (
            <div style={{ background: "#fff", border: "1px solid #fbf0d9", borderRadius: 12, padding: 20, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: "#fbf0d9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <GraduationCap size={20} color="#9c7519" />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#9c7519", lineHeight: 1.2 }}>{alerts.pending_enrollments}</div>
                <div style={{ fontSize: 12.5, color: "#5B6172" }}>Pending enrollments</div>
              </div>
            </div>
          )}
          {alerts.unpublished_posts > 0 && (
            <div style={{ background: "#fff", border: "1px solid #e7e4fc", borderRadius: 12, padding: 20, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: "#e7e4fc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={20} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--primary)", lineHeight: 1.2 }}>{alerts.unpublished_posts}</div>
                <div style={{ fontSize: 12.5, color: "#5B6172" }}>Unpublished posts</div>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <DollarSign size={18} color="var(--primary)" /> Content Distribution
          </h3>
          <Doughnut data={doughnutData} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, justifyContent: "center" }}>
            {doughnutData.map((d) => (
              <div key={d.label} style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: d.color, display: "inline-block" }} />
                {d.label}: {d.value}
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={18} color="var(--secondary)" /> Quick Overview
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <MiniTrend label="Total Items" value={total} trend={12} />
            <MiniTrend label="Avg per Section" value={(total / Math.max(cards.filter((c) => c.value > 0).length, 1)).toFixed(1)} trend={5} />
          </div>
          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "#F6F4F0", borderRadius: 8, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--primary)" }}>{stats.students}</div>
              <div style={{ fontSize: 12, color: "#5B6172" }}>Registered Students</div>
            </div>
            <div style={{ background: "#F6F4F0", borderRadius: 8, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--secondary)" }}>{stats.courses}</div>
              <div style={{ fontSize: 12, color: "#5B6172" }}>Active Courses</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
