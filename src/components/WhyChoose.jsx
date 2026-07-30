import Reveal from "./Reveal";
import { WHY } from "../data/why";

export default function WhyChoose() {
  return (
    <section style={{ background: "#0C1524", color: "#fff", padding: "104px 0" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
        <Reveal>
          <div style={{ maxWidth: 620, marginBottom: 52 }}>
            <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 14 }}>Why Centeric Solutions</div>
            <h2 style={{ fontSize: "clamp(28px,3.6vw,38px)", fontWeight: 800, margin: 0 }}>Built around outcomes, not just content.</h2>
          </div>
        </Reveal>
        <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {WHY.map(({ icon: Icon, bg, fg, title, body }) => (
            <Reveal key={title}>
              <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: 26, height: "100%" }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, background: bg, color: fg }}>
                  <Icon size={20} />
                </div>
                <h3 style={{ fontSize: 17, marginBottom: 8 }}>{title}</h3>
                <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,.62)" }}>{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
