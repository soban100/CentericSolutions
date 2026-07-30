import Reveal from "./Reveal";
import { JOURNEY } from "../data/journey";

export default function LearningJourney() {
  return (
    <section style={{ background: "#fff", padding: "104px 0" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
        <Reveal>
          <div style={{ maxWidth: 620, marginBottom: 52 }}>
            <div className="eyebrow" style={{ color: "var(--primary)", marginBottom: 14 }}>The Learning Journey</div>
            <h2 style={{ fontSize: "clamp(28px,3.6vw,38px)", fontWeight: 800, margin: 0 }}>Five steps. One clear path.</h2>
          </div>
        </Reveal>
        <Reveal>
          <div style={{ position: "relative", paddingTop: 20 }}>
            <div className="journey-line" style={{ position: "absolute", top: 38, left: 0, right: 0, height: 2, background: "repeating-linear-gradient(90deg, #E4E1DA 0 8px, transparent 8px 14px)" }} />
            <div className="journey-steps" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 20, position: "relative" }}>
              {JOURNEY.map((step) => (
                <div key={step.title}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", border: `3px solid ${step.color}`, marginBottom: 18, position: "relative", zIndex: 2 }} />
                  <h3 style={{ fontSize: 15.5, marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ fontSize: 13.5, color: "#5B6172", margin: 0 }}>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
