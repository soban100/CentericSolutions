import { useState, useEffect } from "react";
import { ArrowRight, Mail, MapPin, Phone, Clock, Send } from "lucide-react";
import Reveal from "../components/Reveal";
import HeroCarousel from "../components/HeroCarousel";
import { api } from "../api";
import { useSettings } from "../context/SettingsContext";

export default function Contact() {
  const { settings } = useSettings();
  const [heroes, setHeroes] = useState([]);

  const email = settings.footer_email || "hello@centericsolutions.com";
  const phone = settings.footer_phone || "+31 (0) 20 123 4567";
  const CONTACT_INFO = [
    { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    { icon: MapPin, label: "Location", value: "Amsterdam, Netherlands" },
    { icon: Phone, label: "Phone", value: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    { icon: Clock, label: "Response time", value: "Within 24 hours on business days" },
  ];
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.getHeroes().then(setHeroes).catch(() => {});
    api.getMe().then((user) => {
      if (user) setForm((prev) => ({ ...prev, name: user.name || "", email: user.email || "" }));
    }).catch(() => {});
  }, []);

  const contactHero = heroes.find((h) => h.id === "contact");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createMessage(form);
      setSubmitted(true);
    } catch (err) {
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <>
      <HeroCarousel pageHero={contactHero} />

      <section style={{ padding: "80px 0 104px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 50, alignItems: "start" }}>
            <Reveal>
              <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 16, padding: 40 }}>
                {submitted ? (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#dff5ec", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                      <Mail size={28} style={{ color: "var(--secondary)" }} />
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>Message sent!</h3>
                    <p style={{ color: "#5B6172", fontSize: 15, margin: 0 }}>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: 28 }}>
                      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>Send us a message</h2>
                      <p style={{ color: "#5B6172", fontSize: 14.5, margin: 0 }}>Fill in the form below and we'll respond as soon as possible.</p>
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#10162A" }}>Name</label>
                          <input required name="name" value={form.name} onChange={handleChange} placeholder="Your full name" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#10162A" }}>Email</label>
                          <input required name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#10162A" }}>Subject</label>
                        <input required name="subject" value={form.subject} onChange={handleChange} placeholder="What is this about?" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#10162A" }}>Message</label>
                        <textarea required name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell us more about what you're looking for..." style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none", resize: "vertical" }} />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start", border: "none", fontFamily: "inherit", cursor: "pointer" }}>
                        Send Message <Send size={15} />
                      </button>
                    </form>
                  </>
                )}
              </div>
            </Reveal>

            <Reveal>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "#e7e4fc", color: "var(--primary)", flexShrink: 0 }}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: "#5B6172", fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</div>
                        {href ? (
                          <a href={href} style={{ fontWeight: 600, fontSize: 14.5, color: "#10162A", textDecoration: "none", wordBreak: "break-all" }}>{value}</a>
                        ) : (
                          <div style={{ fontWeight: 600, fontSize: 14.5, color: "#10162A" }}>{value}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div style={{ background: "#0C1524", borderRadius: 12, padding: 24, color: "#fff" }}>
                  <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 8 }}>Office Hours</div>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,.6)", margin: 0, lineHeight: 1.7 }}>
                    Monday — Friday<br />09:00 — 18:00 CET
                  </p>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,.6)", margin: "12px 0 0", lineHeight: 1.7 }}>
                    Virtual meetings available<br />outside office hours by appointment.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 104px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ background: "linear-gradient(135deg,#0C1524,#1c2b47)", color: "#fff", textAlign: "center", borderRadius: 24, padding: "80px 28px" }}>
              <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, maxWidth: 560, margin: "0 auto 18px" }}>Not ready to reach out yet?</h2>
              <p style={{ color: "rgba(255,255,255,.65)", marginBottom: 30, maxWidth: 480, margin: "0 auto 30px", fontSize: 16 }}>
                Browse our courses and see what's possible. No commitment required.
              </p>
              <a href="/courses" className="btn btn-primary" style={{ textDecoration: "none" }}>Explore Courses <ArrowRight size={16} /></a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
