import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "./Reveal";
import { isNewCourse } from "../utils/isNewCourse";

const TAG_STYLES = {
  indigo: { background: "#e7e4fc", color: "var(--primary)" },
  emerald: { background: "#dff5ec", color: "var(--secondary)" },
  gold: { background: "#fbf0d9", color: "#9c7519" },
  rose: { background: "#fce4e4", color: "#c0392b" },
};

export default function NewCourses({ courses = [] }) {
  const newCourses = courses.filter(isNewCourse);
  const [index, setIndex] = useState(0);

  if (!newCourses.length) return null;

  const visible = 3;
  const max = Math.max(0, newCourses.length - visible);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(max, i + 1));

  return (
    <section style={{ padding: "80px 0", background: "#F6F4F0" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
        <Reveal>
          <div style={{ maxWidth: 620, marginBottom: 40 }}>
            <div className="eyebrow" style={{ color: "var(--secondary)", marginBottom: 14 }}>New Courses</div>
            <h2 style={{ fontSize: "clamp(26px,3.2vw,34px)", fontWeight: 800, margin: 0 }}>Fresh off the press.</h2>
            <p style={{ marginTop: 10, color: "#5B6172", fontSize: 15 }}>Brand-new courses just added to the catalog. Grab a seat while they are hot.</p>
          </div>
        </Reveal>

        <div style={{ position: "relative" }}>
          <div style={{ overflow: "hidden", borderRadius: 14 }}>
            <div style={{
              display: "flex", transition: "transform .4s ease",
              transform: `translateX(-${index * (100 / visible)}%)`,
            }}>
              {newCourses.map((c) => (
                <div key={c.title} style={{ flex: `0 0 ${100 / visible}%`, paddingRight: 24 }}>
                  <div className="course-card" style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 14, overflow: "hidden", height: "100%" }}>
                    <div style={{ height: 130, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "rgba(255,255,255,.85)", background: c.image_url ? `linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45)), url("${c.image_url}") center/cover` : c.gradient }}>
                      {!c.image_url && c.title}
                    </div>
                    <div style={{ padding: 20 }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, padding: "4px 10px", borderRadius: 999, fontWeight: 600, ...TAG_STYLES[c.tag_color] }}>{c.tag}</span>
                      <h3 style={{ fontSize: 17, fontWeight: 700, margin: "10px 0 6px" }}>{c.title}</h3>
                      <p style={{ color: "#5B6172", fontSize: 13.5, margin: "0 0 14px", lineHeight: 1.5 }}>{c.description}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E4E1DA", paddingTop: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600 }}>
                          <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#e7e4fc", display: "inline-block" }} />
                          {c.instructor}
                        </div>
                        <Link to={`/courses/${c.slug}`} className="enroll-link" style={{ fontWeight: 700, fontSize: 13, color: "var(--primary)", textDecoration: "none" }}>View Details →</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {index > 0 && (
            <button onClick={prev} aria-label="Previous" style={{
              position: "absolute", left: -48, top: "50%", transform: "translateY(-50%)",
              width: 44, height: 44, borderRadius: "50%", border: "1px solid #E4E1DA",
              background: "#fff", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#5B6172", zIndex: 2,
            }}>
              <ChevronLeft size={20} />
            </button>
          )}

          {index < max && (
            <button onClick={next} aria-label="Next" style={{
              position: "absolute", right: -48, top: "50%", transform: "translateY(-50%)",
              width: 44, height: 44, borderRadius: "50%", border: "1px solid #E4E1DA",
              background: "#fff", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#5B6172", zIndex: 2,
            }}>
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
