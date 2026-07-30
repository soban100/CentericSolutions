import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Users, BookOpen, Globe, ExternalLink } from "lucide-react";
import Reveal from "../components/Reveal";
import HeroCarousel from "../components/HeroCarousel";
import { api } from "../api";

const TAG_STYLES = {
  indigo: { background: "#e7e4fc", color: "var(--primary)" },
  emerald: { background: "#dff5ec", color: "var(--secondary)" },
  gold: { background: "#fbf0d9", color: "#9c7519" },
  rose: { background: "#fce4e4", color: "#c0392b" },
};

export default function Instructors() {
  const [heroes, setHeroes] = useState([]);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    Promise.all([api.getHeroes(), api.getInstructors()])
      .then(([h, i]) => { setHeroes(h); setInstructors(i); })
      .catch(() => {});
  }, []);

  const instructorsHero = heroes.find((h) => h.id === "instructors");

  return (
    <>
      <HeroCarousel pageHero={instructorsHero} />

      <section style={{ padding: "80px 0 104px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "grid", gap: 24 }}>
            {instructors.map((inst, i) => {
              return (
                <Reveal key={inst.name}>
                  <div className="course-card" style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 14, overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 0 }}>
                      <div style={{ background: inst.gradient, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", color: "rgba(255,255,255,.9)" }}>
                        {inst.image_url ? (
                          <img src={inst.image_url} alt={inst.name} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,.3)", marginBottom: 14 }} />
                        ) : (
                          <span style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "inline-block", marginBottom: 14, border: "3px solid rgba(255,255,255,.3)" }} />
                        )}
                        <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 2px", color: "#fff" }}>{inst.name}</h3>
                        <div style={{ fontSize: 12.5, fontFamily: "'JetBrains Mono',monospace", opacity: 0.8, marginBottom: 12 }}>{inst.role}</div>
                        {inst.twitter_url || inst.linkedin_url || inst.github_url ? (
                          <div style={{ display: "flex", gap: 10 }}>
                            {inst.twitter_url && <a href={inst.twitter_url} style={{ color: "rgba(255,255,255,.6)" }}><Globe size={16} /></a>}
                            {inst.linkedin_url && <a href={inst.linkedin_url} style={{ color: "rgba(255,255,255,.6)" }}><ExternalLink size={16} /></a>}
                            {inst.github_url && <a href={inst.github_url} style={{ color: "rgba(255,255,255,.6)" }}><ExternalLink size={16} /></a>}
                          </div>
                        ) : null}
                      </div>

                      <div style={{ padding: 28 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                          <div>
                            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{inst.name}</h2>
                            {inst.specialty && (
                              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, padding: "3px 10px", borderRadius: 999, fontWeight: 600, display: "inline-block", marginTop: 6, ...TAG_STYLES[inst.tag_color] }}>
                                {inst.specialty}
                              </span>
                            )}
                          </div>
                          <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#5B6172", fontFamily: "'JetBrains Mono',monospace" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Users size={14} /> {inst.students}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><BookOpen size={14} /> {inst.course_count}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--accent)" }}><Star size={14} fill="var(--accent)" /> {inst.rating}</span>
                          </div>
                        </div>

                        <p style={{ color: "#5B6172", fontSize: 14.5, lineHeight: 1.65, margin: "0 0 18px" }}>{inst.bio}</p>

                        <div style={{ borderTop: "1px solid #E4E1DA", paddingTop: 16 }}>
                          <Link to={`/instructors/${inst.id}`} style={{ fontWeight: 700, fontSize: 13.5, color: "var(--primary)", textDecoration: "none" }}>
                            View Profile →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 104px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ background: "linear-gradient(135deg,#0C1524,#1c2b47)", color: "#fff", textAlign: "center", borderRadius: 24, padding: "80px 28px" }}>
              <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, maxWidth: 540, margin: "0 auto 18px" }}>Ready to learn from the best?</h2>
              <p style={{ color: "rgba(255,255,255,.65)", marginBottom: 30, maxWidth: 480, margin: "0 auto 30px", fontSize: 16 }}>
                Browse our course catalog and find the right instructor for your goals.
              </p>
              <a href="/courses" className="btn btn-primary" style={{ textDecoration: "none" }}>Browse Courses <ArrowRight size={16} /></a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
