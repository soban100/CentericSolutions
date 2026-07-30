import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Clock, Users, Star, ArrowRight } from "lucide-react";
import Reveal from "../components/Reveal";
import HeroCarousel from "../components/HeroCarousel";
import FinalCTA from "../components/FinalCTA";
import NewBadge from "../components/NewBadge";
import { api } from "../api";

const TAG_STYLES = {
  indigo: { background: "#e7e4fc", color: "var(--primary)" },
  emerald: { background: "#dff5ec", color: "var(--secondary)" },
  gold: { background: "#fbf0d9", color: "#9c7519" },
  rose: { background: "#fce4e4", color: "#c0392b" },
};

export default function Courses() {
  const [heroes, setHeroes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeTag, setActiveTag] = useState("All");
  const [activeLevel, setActiveLevel] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([api.getHeroes(), api.getPublishedCourses()])
      .then(([h, c]) => { setHeroes(h); setCourses(c); })
      .catch(() => {});
  }, []);

  const coursesHero = heroes.find((h) => h.id === "courses");

  const TAGS = ["All", ...new Set(courses.map((c) => c.tag))];
  const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (activeTag !== "All" && c.tag !== activeTag) return false;
      if (activeLevel !== "All" && c.level !== activeLevel) return false;
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [activeTag, activeLevel, search, courses]);

  return (
    <>
      <HeroCarousel pageHero={coursesHero} />

      <section style={{ background: "#fff", borderBottom: "1px solid #E4E1DA", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                style={{
                  padding: "7px 18px", borderRadius: 999, border: "1px solid", cursor: "pointer", fontSize: 13, fontWeight: 600,
                  fontFamily: "'JetBrains Mono',monospace", transition: "background .18s ease, color .18s ease",
                  background: activeTag === tag ? "#0C1524" : "transparent",
                  color: activeTag === tag ? "#fff" : "#5B6172",
                  borderColor: activeTag === tag ? "#0C1524" : "#E4E1DA",
                }}
              >
                {tag}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <div style={{ position: "relative", minWidth: 220 }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
              <input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", padding: "9px 12px 9px 36px", borderRadius: 999, border: "1px solid #E4E1DA",
                  fontSize: 14, background: "#F6F4F0", outline: "none", fontFamily: "inherit",
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setActiveLevel(level)}
                style={{
                  padding: "4px 14px", borderRadius: 999, border: "1px solid", cursor: "pointer", fontSize: 12, fontWeight: 500,
                  transition: "background .18s ease, color .18s ease",
                  background: activeLevel === level ? "var(--primary)" : "transparent",
                  color: activeLevel === level ? "#fff" : "#5B6172",
                  borderColor: activeLevel === level ? "var(--primary)" : "#E4E1DA",
                }}
              >
                {level}
              </button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 13, color: "#9CA3AF", alignSelf: "center" }}>
              {filtered.length} {filtered.length === 1 ? "course" : "courses"}
            </span>
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0 104px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#5B6172" }}>
              <p style={{ fontSize: 18, fontWeight: 600 }}>No courses match your filters.</p>
              <p style={{ fontSize: 14 }}>Try adjusting your search or clearing the filters above.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {filtered.map((c, i) => (
                <Reveal key={c.title}>
                  <div className="course-card" style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 14, overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 0 }}>
                      <div style={{ height: "100%", minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "rgba(255,255,255,.85)", background: c.image_url ? `linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45)), url("${c.image_url}") center/cover` : c.gradient, padding: 24, textAlign: "center" }}>
                        <span style={{ fontSize: 12, opacity: 0.7, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>{c.tag}</span>
                        <span style={{ fontWeight: 600, fontSize: 17, lineHeight: 1.3 }}>{c.title}</span>
                      </div>
                      <div style={{ padding: 24 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{c.title}</h3>
                              <NewBadge course={c} />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, padding: "3px 8px", borderRadius: 999, fontWeight: 600, ...TAG_STYLES[c.tag_color] }}>{c.tag}</span>
                              <span style={{ fontSize: 12.5, color: "#5B6172", fontFamily: "'JetBrains Mono',monospace" }}>{c.level}</span>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--accent)", fontSize: 13 }}>
                            <Star size={14} fill="var(--accent)" /> {c.rating}
                          </div>
                        </div>
                        <p style={{ color: "#5B6172", fontSize: 14, margin: "12px 0", lineHeight: 1.6 }}>{c.description}</p>
                        <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#5B6172", marginBottom: 16, fontFamily: "'JetBrains Mono',monospace" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Clock size={14} /> {c.duration}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Users size={14} /> {c.students} enrolled</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E4E1DA", paddingTop: 16 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600 }}>
                            <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#e7e4fc", display: "inline-block", flexShrink: 0 }} />
                            {c.instructor}
                          </div>
                          <Link
                            to={`/courses/${c.slug}`}
                            className="enroll-link"
                            style={{ fontWeight: 700, fontSize: 13.5, color: "var(--primary)", textDecoration: "none", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4 }}
                          >
                            View Details <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
