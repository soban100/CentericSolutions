import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Check } from "lucide-react";
import Reveal from "../components/Reveal";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  if (submitted) {
    return (
      <section style={{ padding: "160px 0 104px", minHeight: "80vh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 28px", textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#dff5ec", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Check size={26} style={{ color: "var(--secondary)" }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>Check your email</h2>
          <p style={{ color: "#5B6172", fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
            We've sent a password reset link to <strong style={{ color: "#10162A" }}>{email}</strong>. It expires in 30 minutes.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ textDecoration: "none" }}>Back to Sign In</Link>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: "160px 0 104px", minHeight: "80vh", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          {/* LEFT */}
          <Reveal>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 12 }}>Reset Password</div>
              <h1 style={{ fontSize: "clamp(32px,3.8vw,44px)", fontWeight: 800, margin: "0 0 16px", lineHeight: 1.08 }}>
                Forgot your password?
              </h1>
              <p style={{ color: "#5B6172", fontSize: 16, maxWidth: 400, lineHeight: 1.65, margin: 0 }}>
                No worries. Enter your email and we'll send you a reset link to get back into your account.
              </p>
              <div style={{ marginTop: 32, padding: 20, background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12 }}>
                <p style={{ margin: 0, fontSize: 13.5, color: "#5B6172" }}>
                  <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600, color: "var(--primary)", textDecoration: "none" }}>
                    <ArrowLeft size={14} /> Back to sign in
                  </Link>
                </p>
              </div>
            </div>
          </Reveal>

          {/* RIGHT — form */}
          <Reveal>
            <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 16, padding: 40 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Reset link</h2>
              <p style={{ color: "#5B6172", fontSize: 14, margin: "0 0 24px" }}>We'll send a reset link to your email.</p>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#10162A" }}>Email</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: 10, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", justifyContent: "center" }}>
                  Send Reset Link
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
