import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import Reveal from "../components/Reveal";
import { api } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login(form);
      sessionStorage.setItem("user_name", data.user.name);
      sessionStorage.setItem("transition_reason", "login");
      setSubmitted(true);
      setTimeout(() => navigate(data.user.role === "admin" ? "/admin" : "/"), 1500);
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section style={{ padding: "160px 0 104px", minHeight: "80vh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 28px", textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#dff5ec", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <ArrowRight size={26} style={{ color: "var(--secondary)" }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>Welcome back!</h2>
          <p style={{ color: "#5B6172", fontSize: 15, marginBottom: 24 }}>You've been logged in successfully. Redirecting...</p>
          <Link to="/" className="btn btn-primary" style={{ textDecoration: "none" }}>Go to Home</Link>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: "160px 0 104px", minHeight: "80vh", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <Reveal>
            <div>
              <div className="eyebrow" style={{ color: "var(--primary)", marginBottom: 12 }}>Welcome Back</div>
              <h1 style={{ fontSize: "clamp(32px,3.8vw,44px)", fontWeight: 800, margin: "0 0 16px", lineHeight: 1.08 }}>
                Sign in to your account
              </h1>
              <p style={{ color: "#5B6172", fontSize: 16, maxWidth: 400, lineHeight: 1.65, margin: 0 }}>
                Access your courses, track your progress, and continue your learning journey.
              </p>
              <div style={{ marginTop: 40, padding: 24, background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12 }}>
                <p style={{ margin: 0, fontSize: 13.5, color: "#5B6172", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--secondary)" }}>New here?</strong> Create an account and start learning from industry professionals.
                </p>
                <Link to="/get-started" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 14, color: "var(--primary)", marginTop: 10 }}>
                  Get started →
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 16, padding: 40 }}>
              <Link to="/" style={{ fontSize: 13, color: "#5B6172", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 16, fontWeight: 500 }}>← Back to Home</Link>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Sign In</h2>
              <p style={{ color: "#5B6172", fontSize: 14, margin: "0 0 24px" }}>Enter your credentials to continue.</p>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {error && (
                  <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fce4e4", color: "#c0392b", fontSize: 13, fontWeight: 600 }}>{error}</div>
                )}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#10162A" }}>Email</label>
                  <input required name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#10162A" }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input required name="password" type={showPw ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Enter your password" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none", paddingRight: 44 }} />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0 }}>
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Link to="/forgot-password" style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)", textDecoration: "none" }}>Forgot password?</Link>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", justifyContent: "center", opacity: loading ? 0.6 : 1 }}>
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
