import { useState, useEffect } from "react";
import { ArrowRight, Target, BookOpen, Users, Award } from "lucide-react";
import Reveal from "../components/Reveal";
import HeroCarousel from "../components/HeroCarousel";
import TrustBar from "../components/TrustBar";
import FinalCTA from "../components/FinalCTA";
import { api } from "../api";

export default function About() {
  const [heroes, setHeroes] = useState([]);
  const [values, setValues] = useState([]);
  const [team, setTeam] = useState([]);
  const [about, setAbout] = useState(null);

  useEffect(() => {
    Promise.all([api.getHeroes(), api.getAbout()])
      .then(([h, a]) => {
        setHeroes(h);
        setAbout(a);
        setValues(a?.values || []);
        setTeam(a?.team || []);
      }).catch(() => {});
  }, []);

  const aboutHero = heroes.find((h) => h.id === "about");

  return (
    <>
      <HeroCarousel pageHero={aboutHero} />

      <section style={{ background: "#fff", padding: "104px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50 }}>
            <Reveal>
              <div style={{ padding: 40, background: "#F6F4F0", borderRadius: 20, height: "100%" }}>
                <div className="eyebrow" style={{ color: "var(--primary)", marginBottom: 12 }}>Our Mission</div>
                <h2 style={{ fontSize: "clamp(24px,2.8vw,32px)", fontWeight: 800, margin: "0 0 16px" }}>{about?.mission?.title || "Democratize practical tech education."}</h2>
                <p style={{ color: "#5B6172", fontSize: 15.5, lineHeight: 1.7, margin: 0 }}>
                  {about?.mission?.body || "We believe that a career in technology should be accessible to anyone with curiosity and drive — not just those who can afford bootcamps or computer science degrees."}
                </p>
              </div>
            </Reveal>
            <Reveal>
              <div style={{ padding: 40, background: "#0C1524", borderRadius: 20, color: "#fff", height: "100%" }}>
                <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 12 }}>Our Vision</div>
                <h2 style={{ fontSize: "clamp(24px,2.8vw,32px)", fontWeight: 800, margin: "0 0 16px" }}>{about?.vision?.title || "A world where skill matters more than pedigree."}</h2>
                <p style={{ color: "rgba(255,255,255,.62)", fontSize: 15.5, lineHeight: 1.7, margin: 0 }}>
                  {about?.vision?.body || "We envision a future where your portfolio speaks louder than your diploma, where continuous learning is the norm."}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <TrustBar />

      <section style={{ padding: "104px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ maxWidth: 620, marginBottom: 52 }}>
              <div className="eyebrow" style={{ color: "var(--primary)", marginBottom: 14 }}>What We Believe</div>
              <h2 style={{ fontSize: "clamp(28px,3.6vw,38px)", fontWeight: 800, margin: 0 }}>Four principles that guide everything we build.</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24 }}>
            {values.map((v) => (
              <Reveal key={v.title}>
                <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 14, padding: 28, height: "100%" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, background: "#e7e4fc", color: "var(--primary)" }}>
                    <Target size={22} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{v.title}</h3>
                  <p style={{ margin: 0, color: "#5B6172", fontSize: 14.5, lineHeight: 1.65 }}>{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#0C1524", color: "#fff", padding: "104px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ maxWidth: 620, marginBottom: 52 }}>
              <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 14 }}>Our Team</div>
              <h2 style={{ fontSize: "clamp(28px,3.6vw,38px)", fontWeight: 800, margin: 0 }}>The people behind the courses.</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24 }}>
            {team.map((t) => (
              <Reveal key={t.name}>
                <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: 28, display: "flex", gap: 18, alignItems: "flex-start" }}>
                  <span style={{ width: 56, height: 56, borderRadius: "50%", background: "#e7e4fc", display: "inline-block", flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 2px" }}>{t.name}</h3>
                    <div style={{ fontSize: 13, color: "var(--accent)", fontFamily: "'JetBrains Mono',monospace", marginBottom: 10 }}>{t.role}</div>
                    <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,.6)", lineHeight: 1.65 }}>{t.bio}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "104px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ background: "linear-gradient(135deg,#0C1524,#1c2b47)", color: "#fff", textAlign: "center", borderRadius: 24, padding: "80px 28px" }}>
              <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, maxWidth: 640, margin: "0 auto 18px" }}>Ready to learn the way the industry works?</h2>
              <p style={{ color: "rgba(255,255,255,.65)", marginBottom: 30, maxWidth: 500, margin: "0 auto 30px", fontSize: 16 }}>
                Explore our courses, meet your instructors, and join a cohort that's built around your goals.
              </p>
              <a href="/courses" className="btn btn-primary" style={{ textDecoration: "none" }}>Browse Courses <ArrowRight size={16} /></a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
