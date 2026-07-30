import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import NewBadge from "./NewBadge";

const TAG_STYLES = {
  indigo: { background: "#e7e4fc", color: "var(--primary)" },
  emerald: { background: "#dff5ec", color: "var(--secondary)" },
  gold: { background: "#fbf0d9", color: "#9c7519" },
  rose: { background: "#fce4e4", color: "#c0392b" },
};

export default function FeaturedCourses({ courses = [] }) {
  const featured = courses.filter((c) => c.is_featured);
  if (!featured.length) return null;
  return (
    <section id="featuredSection" style={{ padding: "104px 0" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
        <Reveal>
          <div style={{ maxWidth: 620, marginBottom: 52 }}>
            <div className="eyebrow" style={{ color: "var(--primary)", marginBottom: 14 }}>Featured Courses</div>
            <h2 style={{ fontSize: "clamp(28px,3.6vw,38px)", fontWeight: 800, margin: 0 }}>A small, sharp catalog — built on purpose.</h2>
            <p style={{ marginTop: 14, color: "#5B6172", fontSize: 16 }}>We'd rather teach five courses exceptionally well than fifty averagely. Every course here is built with an instructor who works in the field.</p>
          </div>
        </Reveal>

        <div className="course-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26 }}>
          {featured.map((c) => (
            <Reveal key={c.title}>
              <div className="course-card" style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ height: 150, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "rgba(255,255,255,.85)", background: c.gradient }}>
                  {c.title}
                </div>
                <div style={{ padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, padding: "4px 10px", borderRadius: 999, fontWeight: 600, ...TAG_STYLES[c.tag_color] }}>{c.tag}</span>
                    <span style={{ color: "var(--accent)", fontSize: 13, letterSpacing: 2 }}>★★★★★</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                    <h3 style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>{c.title}</h3>
                    <NewBadge course={c} />
                  </div>
                  <p style={{ color: "#5B6172", fontSize: 14, margin: "0 0 16px" }}>{c.description}</p>
                  <div style={{ display: "flex", gap: 16, fontSize: 12.5, color: "#5B6172", marginBottom: 18, fontFamily: "'JetBrains Mono',monospace" }}>
                    <span>⏱ {c.duration}</span><span>◐ {c.level}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E4E1DA", paddingTop: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600 }}>
                      <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#e7e4fc", display: "inline-block" }} />
                      {c.instructor}
                    </div>
                    <Link to={`/courses/${c.slug}`} className="enroll-link" style={{ fontWeight: 700, fontSize: 13.5, color: "var(--primary)", textDecoration: "none" }}>View Details →</Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
