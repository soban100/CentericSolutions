import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();
  const siteName = settings.site_name || "Centeric Solutions";
  const tagline = settings.footer_tagline || "A modern technology academy helping students and professionals build careers through practical, industry-shaped skills.";
  const copyright = settings.footer_copyright || "© 2026 Centeric Solutions. All rights reserved.";

  const socialLinks = [
    { label: "LinkedIn", url: settings.social_linkedin || "#" },
    { label: "Instagram", url: settings.social_instagram || "#" },
    { label: "YouTube", url: settings.social_youtube || "#" },
  ].filter((s) => s.url !== "#" || true);

  return (
    <footer id="contact" style={{ background: "#0C1524", color: "rgba(255,255,255,.6)", padding: "60px 0 30px", fontSize: 14 }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr repeat(3,1fr)", gap: 32, paddingBottom: 40, borderBottom: "1px solid rgba(255,255,255,.1)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 19, color: "#fff", marginBottom: 14 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--secondary)" }} />
              {siteName}
            </div>
            <p style={{ maxWidth: 280, color: "rgba(255,255,255,.5)" }}>{tagline}</p>
          </div>
          <div>
            <h4 style={{ color: "#fff", fontSize: 13, marginBottom: 16, fontFamily: "'JetBrains Mono',monospace", letterSpacing: ".05em", textTransform: "uppercase" }}>Explore</h4>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              <li><Link to="/courses" style={{ color: "inherit", textDecoration: "none" }}>Courses</Link></li>
              <li><Link to="/instructors" style={{ color: "inherit", textDecoration: "none" }}>Instructors</Link></li>
              <li><Link to="/about" style={{ color: "inherit", textDecoration: "none" }}>About</Link></li>
              <li><Link to="/testimonials" style={{ color: "inherit", textDecoration: "none" }}>Testimonials</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: "#fff", fontSize: 13, marginBottom: 16, fontFamily: "'JetBrains Mono',monospace", letterSpacing: ".05em", textTransform: "uppercase" }}>Company</h4>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              <li><a href="#" style={{ color: "inherit", textDecoration: "none" }}>Careers</a></li>
              <li><Link to="/contact" style={{ color: "inherit", textDecoration: "none" }}>Contact</Link></li>
              <li><a href="#" style={{ color: "inherit", textDecoration: "none" }}>Support</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: "#fff", fontSize: 13, marginBottom: 16, fontFamily: "'JetBrains Mono',monospace", letterSpacing: ".05em", textTransform: "uppercase" }}>Connect</h4>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {socialLinks.map((s) => (
                <li key={s.label}><a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>{s.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>{copyright}</div>
        </div>
      </div>
    </footer>
  );
}
