import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { COURSES } from "../data/courses";
import { TAG_STYLES } from "../data/tagStyles";
import { useSettings } from "../context/SettingsContext";

export default function Hero() {
  const { settings } = useSettings();

  const heroStats = [
    { num: settings.trustbar_students || "2,400+", label: "Students taught" },
    { num: settings.trustbar_courses || "18", label: "Live courses" },
    { num: settings.trustbar_completion || "94%", label: "Completion rate" },
  ];
  return (
    <header id="home" style={{ position: "relative", background: "radial-gradient(circle at 82% 15%, #141F33, #0C1524 60%)", color: "#fff", paddingTop: 180, overflow: "hidden" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "center" }}>
          <div>
            <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 20 }}>{settings.site_name || "Centeric Solutions"} · {settings.site_tagline || "Technology Academy"}</div>
            <h1 style={{ fontSize: "clamp(38px,5.2vw,60px)", lineHeight: 1.06, fontWeight: 800, maxWidth: 640, margin: 0, letterSpacing: "-0.02em" }}>
              Build a career the<br />market actually <span className="accent-word">wants</span>.
            </h1>
            <p style={{ margin: "22px 0 34px", fontSize: 18, color: "rgba(255,255,255,.72)", maxWidth: 480, lineHeight: 1.6 }}>
              Centeric Solutions teaches practical, industry-shaped skills — web development, AI, UX, and marketing — through short, focused courses built with working professionals in mind.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="#courses" className="btn btn-primary" style={{ textDecoration: "none" }}>Explore Courses <ArrowRight size={16} /></a>
              <a href="#about" className="btn btn-ghost" style={{ textDecoration: "none" }}>How It Works</a>
            </div>
            <div style={{ display: "flex", gap: 36, marginTop: 56, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,.14)", flexWrap: "wrap" }}>
              {heroStats.map(({ num, label }) => (
                <div key={label}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 26, fontWeight: 600 }}>{num}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.5)", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div aria-hidden="true" style={{ position: "relative", height: 460 }}>
            <svg viewBox="0 0 420 460" style={{ width: "100%", height: "100%" }}>
              <line x1="210" y1="80" x2="90" y2="170" stroke="rgba(255,255,255,.18)" strokeWidth="1.4" />
              <line x1="210" y1="80" x2="330" y2="150" stroke="rgba(255,255,255,.18)" strokeWidth="1.4" />
              <line x1="90" y1="170" x2="120" y2="290" stroke="rgba(255,255,255,.18)" strokeWidth="1.4" />
              <line x1="330" y1="150" x2="300" y2="280" stroke="rgba(255,255,255,.18)" strokeWidth="1.4" />
              <line x1="120" y1="290" x2="210" y2="380" stroke="rgba(255,255,255,.18)" strokeWidth="1.4" />
              <line x1="300" y1="280" x2="210" y2="380" stroke="rgba(255,255,255,.18)" strokeWidth="1.4" />
              <line x1="210" y1="80" x2="210" y2="380" stroke="rgba(255,255,255,.18)" strokeWidth="1.4" strokeDasharray="2 6" />
              <circle className="node-dot" cx="210" cy="80" r="7" fill="var(--accent)" />
              <text x="222" y="84" fontFamily="'JetBrains Mono',monospace" fontSize="11" fill="rgba(255,255,255,.75)">Career Outcome</text>
              <circle className="node-dot" cx="90" cy="170" r="6" fill="var(--primary)" />
              <text x="30" y="155" fontFamily="'JetBrains Mono',monospace" fontSize="11" fill="rgba(255,255,255,.75)">UX Design</text>
              <circle className="node-dot" cx="330" cy="150" r="6" fill="var(--primary)" />
              <text x="340" y="145" fontFamily="'JetBrains Mono',monospace" fontSize="11" fill="rgba(255,255,255,.75)">AI &amp; Data</text>
              <circle className="node-dot" cx="120" cy="290" r="6" fill="var(--secondary)" />
              <text x="30" y="305" fontFamily="'JetBrains Mono',monospace" fontSize="11" fill="rgba(255,255,255,.75)">Web Dev</text>
              <circle className="node-dot" cx="300" cy="280" r="6" fill="var(--secondary)" />
              <text x="310" y="270" fontFamily="'JetBrains Mono',monospace" fontSize="11" fill="rgba(255,255,255,.75)">Marketing</text>
              <circle className="node-dot" cx="210" cy="380" r="8" fill="#ffffff" />
              <text x="222" y="384" fontFamily="'JetBrains Mono',monospace" fontSize="11" fill="#fff" fontWeight="600">You</text>
            </svg>
          </div>
        </div>

        <div className="preview-strip" style={{ position: "relative", marginTop: 70, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, transform: "translateY(46%)" }}>
          {COURSES.map((c) => (
            <Reveal key={c.title}>
              <div style={{ background: "#fff", color: "#10162A", borderRadius: 14, padding: 20, boxShadow: "0 20px 50px -20px rgba(12,21,36,0.25)", border: "1px solid #E4E1DA" }}>
                <span style={{ display: "inline-block", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, padding: "4px 10px", borderRadius: 999, fontWeight: 600, ...TAG_STYLES[c.tagColor] }}>
                  {c.tag}
                </span>
                <h4 style={{ margin: "14px 0 6px", fontSize: 16.5 }}>{c.title}</h4>
                <p style={{ margin: 0, fontSize: 13.5, color: "#5B6172" }}>{c.duration} · {c.level} · Certificate on completion</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="spacer-hero-bottom" style={{ height: 170 }} />
    </header>
  );
}
