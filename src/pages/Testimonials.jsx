import { useState, useEffect, useMemo } from "react";
import { ArrowRight, Star } from "lucide-react";
import Reveal from "../components/Reveal";
import HeroCarousel from "../components/HeroCarousel";
import { api } from "../api";

const TAG_STYLES = {
  indigo: { background: "#e7e4fc", color: "var(--primary)" },
  emerald: { background: "#dff5ec", color: "var(--secondary)" },
  gold: { background: "#fbf0d9", color: "#9c7519" },
  rose: { background: "#fce4e4", color: "#c0392b" },
};

export default function Testimonials() {
  const [heroes, setHeroes] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeTag, setActiveTag] = useState("All");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    Promise.all([api.getHeroes(), api.getPublishedTestimonials()])
      .then(([h, t]) => { setHeroes(h); setTestimonials(t); })
      .catch(() => {});
  }, []);

  const testimonialsHero = heroes.find((h) => h.id === "testimonials");

  const TAGS = ["All", ...new Set(testimonials.map((t) => t.tag).filter(Boolean))];

  const filtered = useMemo(() => {
    if (activeTag === "All") return testimonials;
    return testimonials.filter((t) => t.tag === activeTag);
  }, [activeTag, testimonials]);

  const featured = testimonials[0];

  return (
    <>
      <HeroCarousel pageHero={testimonialsHero} />

      <section style={{ background: "#fff", borderBottom: "1px solid #E4E1DA" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, padding: "44px 0" }}>
            {[
              { num: testimonials.length, label: "Student Stories" },
              { num: testimonials.filter((t) => t.rating >= 5).length, label: "5-Star Reviews" },
              { num: [...new Set(testimonials.map((t) => t.role).filter(Boolean))].length, label: "Unique Roles" },
              { num: "98%", label: "Satisfaction Rate" },
            ].map((s) => (
              <Reveal key={s.label}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 28, fontWeight: 600, color: "#0C1524" }}>{s.num}</div>
                  <div style={{ fontSize: 12.5, color: "#5B6172", marginTop: 4 }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0 24px", background: "#F6F4F0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
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
            <span style={{ marginLeft: "auto", fontSize: 13, color: "#9CA3AF", alignSelf: "center" }}>
              {filtered.length} {filtered.length === 1 ? "story" : "stories"}
            </span>
          </div>
        </div>
      </section>

      {featured && (
        <section style={{ background: "#F6F4F0" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px 60px" }}>
            <Reveal>
              <div style={{ background: "linear-gradient(135deg,#0C1524,#1c2b47)", borderRadius: 20, padding: "48px 40px", color: "#fff", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
                <div>
                  <div className="accent-word" style={{ fontSize: 56, color: "var(--accent)", lineHeight: 0.8, marginBottom: 16 }}>"</div>
                  <p style={{ fontSize: 19, lineHeight: 1.6, margin: "0 0 24px" }}>{featured.quote}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {featured.image_url ? (
                      <img src={featured.image_url} alt={featured.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,.3)" }} />
                    ) : (
                      <span style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,.15)", display: "inline-block", flexShrink: 0 }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{featured.name}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>{featured.role}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, borderLeft: "1px solid rgba(255,255,255,.1)", paddingLeft: 40 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>Role</div>
                    <div style={{ fontWeight: 600 }}>{featured.role || "Student"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>Rating</div>
                    <div style={{ color: "var(--accent)", fontSize: 15, letterSpacing: 2 }}>{[...Array(featured.rating || 5)].map(() => "★").join("")}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section style={{ background: "#F6F4F0", padding: "0 0 104px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {filtered.map((t, i) => (
              <Reveal key={t.name}>
                <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 14, padding: 28, height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    {t.tag && (
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, padding: "3px 8px", borderRadius: 999, fontWeight: 600, ...TAG_STYLES[t.tag_color] }}>
                        {t.tag}
                      </span>
                    )}
                    <span style={{ color: "var(--accent)", fontSize: 12, letterSpacing: 1.5 }}>{[...Array(t.rating || 5)].map(() => "★").join("")}</span>
                  </div>
                  <div className="accent-word" style={{ fontSize: 30, color: "var(--primary)", lineHeight: 1, marginBottom: 4 }}>"</div>
                  <p style={{ fontSize: 14.5, color: "#10162A", margin: "0 0 20px", lineHeight: 1.6, flex: 1 }}>
                    {expanded === i ? t.quote : (t.quote?.length > 120 ? t.quote.slice(0, 120) + "..." : t.quote)}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid #E4E1DA", paddingTop: 16 }}>
                    {t.image_url ? (
                      <img src={t.image_url} alt={t.name} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <span style={{ width: 36, height: 36, borderRadius: "50%", background: "#e7e4fc", display: "inline-block", flexShrink: 0 }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13.5 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: "#5B6172" }}>{t.role}</div>
                    </div>
                  </div>
                  {expanded === i && (
                    <div style={{ marginTop: 8, fontSize: 12.5, color: "#9CA3AF", lineHeight: 1.6, borderTop: "1px solid #E4E1DA", paddingTop: 12 }}>
                      Published {t.created_at ? new Date(t.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}
                    </div>
                  )}
                  {t.quote?.length > 120 && (
                    <button
                      onClick={() => setExpanded(expanded === i ? null : i)}
                      style={{ marginTop: 10, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, fontWeight: 600, color: "var(--primary)", textAlign: "left", padding: 0 }}
                    >
                      {expanded === i ? "Show less" : "View details →"}
                    </button>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 104px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ background: "linear-gradient(135deg,#0C1524,#1c2b47)", color: "#fff", textAlign: "center", borderRadius: 24, padding: "80px 28px" }}>
              <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, maxWidth: 560, margin: "0 auto 18px" }}>Write your own success story.</h2>
              <p style={{ color: "rgba(255,255,255,.65)", marginBottom: 30, maxWidth: 480, margin: "0 auto 30px", fontSize: 16 }}>
                Join a cohort, learn from practitioners, and build the career you deserve.
              </p>
              <a href="/courses" className="btn btn-primary" style={{ textDecoration: "none" }}>Browse Courses <ArrowRight size={16} /></a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
