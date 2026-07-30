import HeroHeading from "./hero/HeroHeading";
import HeroSubtitle from "./hero/HeroSubtitle";
import HeroCTA from "./hero/HeroCTA";
import HeroImage from "./hero/HeroImage";

function StandardLayout({ eyebrow, title, subtitle }) {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
      {eyebrow && <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 16 }}>{eyebrow}</div>}
      <HeroHeading size="xlarge">{title}</HeroHeading>
      <HeroSubtitle size="medium" style={{ margin: "20px auto 0", textAlign: "center" }}>{subtitle}</HeroSubtitle>
    </div>
  );
}

function SplitLayout({ eyebrow, title, subtitle, stats, ctaPrimary, ctaSecondary, imageUrl }) {
  return (
    <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "center" }}>
      <div>
        {eyebrow && <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 20 }}>{eyebrow}</div>}
        <HeroHeading size="xxlarge">{title}</HeroHeading>
        <HeroSubtitle size="large">{subtitle}</HeroSubtitle>
        <HeroCTA primary={ctaPrimary} secondary={ctaSecondary} />
      </div>
      {imageUrl ? (
        <HeroImage src={imageUrl} alt={title} style={{ alignItems: "center", justifyContent: "center" }} />
      ) : (
        <HeroImage>
          <div aria-hidden="true" style={{ height: 300 }}>
            <svg viewBox="0 0 420 300" style={{ width: "100%", height: "100%" }}>
              <line x1="210" y1="60" x2="90" y2="130" stroke="rgba(255,255,255,.18)" strokeWidth="1.4" />
              <line x1="210" y1="60" x2="330" y2="110" stroke="rgba(255,255,255,.18)" strokeWidth="1.4" />
              <line x1="90" y1="130" x2="120" y2="220" stroke="rgba(255,255,255,.18)" strokeWidth="1.4" />
              <line x1="330" y1="110" x2="300" y2="210" stroke="rgba(255,255,255,.18)" strokeWidth="1.4" />
              <line x1="120" y1="220" x2="210" y2="280" stroke="rgba(255,255,255,.18)" strokeWidth="1.4" />
              <line x1="300" y1="210" x2="210" y2="280" stroke="rgba(255,255,255,.18)" strokeWidth="1.4" />
              <line x1="210" y1="60" x2="210" y2="280" stroke="rgba(255,255,255,.18)" strokeWidth="1.4" strokeDasharray="2 6" />
              <circle className="node-dot" cx="210" cy="60" r="6" fill="var(--accent)" />
              <text x="222" y="64" fontFamily="'JetBrains Mono',monospace" fontSize="10" fill="rgba(255,255,255,.75)">Career Outcome</text>
              <circle className="node-dot" cx="90" cy="130" r="5" fill="var(--primary)" />
              <text x="36" y="118" fontFamily="'JetBrains Mono',monospace" fontSize="10" fill="rgba(255,255,255,.75)">UX Design</text>
              <circle className="node-dot" cx="330" cy="110" r="5" fill="var(--primary)" />
              <text x="340" y="106" fontFamily="'JetBrains Mono',monospace" fontSize="10" fill="rgba(255,255,255,.75)">AI &amp; Data</text>
              <circle className="node-dot" cx="120" cy="220" r="5" fill="var(--secondary)" />
              <text x="36" y="234" fontFamily="'JetBrains Mono',monospace" fontSize="10" fill="rgba(255,255,255,.75)">Web Dev</text>
              <circle className="node-dot" cx="300" cy="210" r="5" fill="var(--secondary)" />
              <text x="310" y="202" fontFamily="'JetBrains Mono',monospace" fontSize="10" fill="rgba(255,255,255,.75)">Marketing</text>
              <circle className="node-dot" cx="210" cy="280" r="7" fill="#ffffff" />
              <text x="222" y="284" fontFamily="'JetBrains Mono',monospace" fontSize="10" fill="#fff" fontWeight="600">You</text>
            </svg>
          </div>
          {stats && stats.length > 0 && (
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", padding: "16px 0 0", borderTop: "1px solid rgba(255,255,255,.14)" }}>
              {stats.map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 600 }}>{s.num}</div>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.5)", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </HeroImage>
      )}
    </div>
  );
}

function QuoteLayout({ eyebrow, title, subtitle, quote }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
      <div>
        {eyebrow && <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 16 }}>{eyebrow}</div>}
        <HeroHeading size="xlarge">{title}</HeroHeading>
        <HeroSubtitle size="medium" style={{ margin: "22px 0 0" }}>{subtitle}</HeroSubtitle>
      </div>
      {quote && (
        <HeroImage>
          <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 20, padding: 40 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}>
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
            <p style={{ fontSize: 18, lineHeight: 1.6, fontStyle: "italic", color: "rgba(255,255,255,.85)", margin: "0 0 20px" }}>
              {quote.text}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 44, height: 44, borderRadius: "50%", background: "#e7e4fc", display: "inline-block" }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{quote.author}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>{quote.role}</div>
              </div>
            </div>
          </div>
        </HeroImage>
      )}
    </div>
  );
}

function FullWidthLayout({ eyebrow, title, subtitle, ctaPrimary }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
      {eyebrow && <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 16 }}>{eyebrow}</div>}
      <HeroHeading size="xxlarge" style={{ maxWidth: "100%", fontSize: "clamp(36px,5.5vw,64px)" }}>{title}</HeroHeading>
      <HeroSubtitle size="large" style={{ margin: "20px auto 0", textAlign: "center", maxWidth: "100%" }}>{subtitle}</HeroSubtitle>
      <HeroCTA primary={ctaPrimary} align="center" style={{ marginTop: 34 }} />
    </div>
  );
}

export default function HeroSection({ slide, hero, children }) {
  const src = slide || hero || {};
  const {
    layout = "standard",
    eyebrow,
    title = "",
    subtitle = "",
    gradientOrigin = "50% 50%",
    imageUrl,
    stats,
    ctaPrimary,
    ctaSecondary,
    quote,
  } = src;

  return (
    <section style={{
      marginTop: 83,
      background: `radial-gradient(circle at ${gradientOrigin}, #141F33, #0C1524 60%)`,
      color: "#fff",
      padding: layout === "split" ? "100px 0 140px" : "140px 0 260px",
      minHeight: 420,
      position: layout === "split" ? "relative" : undefined,
    }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
        {layout === "split" && (
          <SplitLayout eyebrow={eyebrow} title={title} subtitle={subtitle} stats={stats} ctaPrimary={ctaPrimary} ctaSecondary={ctaSecondary} imageUrl={imageUrl} />
        )}
        {layout === "quote" && (
          <QuoteLayout eyebrow={eyebrow} title={title} subtitle={subtitle} quote={quote} />
        )}
        {layout === "fullwidth" && (
          <FullWidthLayout eyebrow={eyebrow} title={title} subtitle={subtitle} ctaPrimary={ctaPrimary} />
        )}
        {layout === "standard" && (
          <StandardLayout eyebrow={eyebrow} title={title} subtitle={subtitle} />
        )}
        {children}
      </div>
    </section>
  );
}
