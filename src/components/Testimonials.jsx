import Reveal from "./Reveal";

export default function Testimonials({ testimonials = [] }) {
  return (
    <section id="testimonials" style={{ background: "#F6F4F0", padding: "104px 0" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
        <Reveal>
          <div style={{ maxWidth: 620, marginBottom: 52 }}>
            <div className="eyebrow" style={{ color: "var(--primary)", marginBottom: 14 }}>Student Stories</div>
            <h2 style={{ fontSize: "clamp(28px,3.6vw,38px)", fontWeight: 800, margin: 0 }}>What it's actually like to study here.</h2>
          </div>
        </Reveal>
        <div className="test-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {testimonials.map((t) => (
            <Reveal key={t.name}>
              <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 14, padding: 28, height: "100%" }}>
                <div className="accent-word" style={{ fontSize: 34, color: "var(--primary)", lineHeight: 1, marginBottom: 6 }}>"</div>
                <p style={{ fontSize: 15, color: "#10162A", margin: "0 0 20px" }}>{t.quote}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {t.image_url ? (
                    <img src={t.image_url} alt={t.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ width: 40, height: 40, borderRadius: "50%", background: "#e7e4fc", display: "inline-block" }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12.5, color: "#5B6172" }}>{t.role}</div>
                  </div>
                </div>
                <div style={{ marginTop: 14, color: "var(--accent)", fontSize: 13, letterSpacing: 2 }}>
                  {[...Array(t.rating || 5)].map((_, i) => "★").join("")}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
