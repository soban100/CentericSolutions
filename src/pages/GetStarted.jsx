import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, ArrowRight, Mail, Smartphone, ArrowLeft, Shield, X } from "lucide-react";
import Reveal from "../components/Reveal";
import { api } from "../api";

const inputStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E4E1DA",
  fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none",
  boxSizing: "border-box",
};

const COUNTRY_CODE = "+92";

const pwRules = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "At least 1 letter", test: (v) => /[a-zA-Z]/.test(v) },
  { label: "At least 1 number", test: (v) => /\d/.test(v) },
  { label: "At least 1 special character", test: (v) => /[^a-zA-Z0-9]/.test(v) },
];

function formatPhone(value) {
  let digits = value.replace(/[^\d]/g, "");
  if (!digits.startsWith("92")) digits = "92" + digits;
  digits = digits.slice(0, 12);
  return `+${digits}`;
}

export default function GetStarted() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", degree: "", college: "", agree: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [step, setStep] = useState("form");
  const [verifyMethod, setVerifyMethod] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verificationToken, setVerificationToken] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "phone") return setForm({ ...form, phone: formatPhone(value) });
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const passwordChecks = pwRules.map((r) => ({ ...r, pass: r.test(form.password) }));
  const pwScore = passwordChecks.filter((c) => c.pass).length;
  const phoneValid = form.phone.length === 13;

  const handleFirstSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.phone && !phoneValid) return setError("Phone must be +92 followed by 10 digits");
    if (form.phone && form.phone !== "+92" && !phoneValid) return setError("Phone must be +92 followed by 10 digits (e.g. +923001234567)");
    if (pwScore < 4) return setError("Password does not meet all requirements");
    if (!form.agree) return setError("You must agree to the Terms of Service");

    try {
      const res = await api.checkDuplicate({ email: form.email, phone: form.phone });
      if (!res.available) {
        const msgs = Object.values(res.errors).join(". ");
        return setError(msgs);
      }
    } catch {
      return setError("Unable to verify. Please try again.");
    }

    setStep("verify");
  };

  const handleSendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await api.sendOtp({ method: verifyMethod, value: verifyMethod === "email" ? form.email : form.phone });
      setOtpSent(true);
    } catch {
      setError("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const value = verifyMethod === "email" ? form.email : form.phone;
      const res = await api.verifyOtp({ method: verifyMethod, value, otp });
      setVerificationToken(res.token);
      await submitRegistration(res.token);
    } catch {
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const submitRegistration = async (token) => {
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
        degree: form.degree || undefined,
        college: form.college || undefined,
        verificationToken: token,
      };
      const res = await api.register(payload);
      sessionStorage.setItem("user_name", res.user.name);
      sessionStorage.setItem("transition_reason", "login");
      setSubmitted(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      const msg = err.message.includes("already registered") ? err.message : "Registration failed. Please try again.";
      setError(msg);
      setStep("verify");
      setVerifyMethod(null);
      setOtpSent(false);
      setOtp("");
      setVerificationToken("");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section style={{ padding: "160px 0 104px", minHeight: "80vh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 28px", textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#dff5ec", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Check size={26} style={{ color: "var(--secondary)" }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>Account created!</h2>
          <p style={{ color: "#5B6172", fontSize: 15, marginBottom: 24 }}>Welcome to Centeric Solutions. Start exploring your courses.</p>
          <Link to="/courses" className="btn btn-primary" style={{ textDecoration: "none" }}>Browse Courses <ArrowRight size={16} /></Link>
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
              <div className="eyebrow" style={{ color: "var(--secondary)", marginBottom: 12 }}>Get Started</div>
              <h1 style={{ fontSize: "clamp(32px,3.8vw,44px)", fontWeight: 800, margin: "0 0 16px", lineHeight: 1.08 }}>
                Create your free account
              </h1>
              <p style={{ color: "#5B6172", fontSize: 16, maxWidth: 400, lineHeight: 1.65, margin: 0 }}>
                Join thousands of students building practical, career-shaping skills with industry professionals.
              </p>
              <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  "Access all course materials instantly",
                  "Track your progress across courses",
                  "Join a community of motivated learners",
                  "Get personalized career guidance",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={16} style={{ color: "var(--secondary)", flexShrink: 0 }} />
                    <span style={{ fontSize: 14.5, color: "#5B6172" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 32, padding: 20, background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12 }}>
                <p style={{ margin: 0, fontSize: 13.5, color: "#5B6172" }}>
                  <strong style={{ color: "#10162A" }}>Already have an account?</strong>{" "}
                  <Link to="/login" style={{ fontWeight: 700, color: "var(--primary)" }}>Sign in</Link>
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 16, padding: 40 }}>
              {step === "form" && (
                <>
                  <Link to="/" style={{ fontSize: 13, color: "#5B6172", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 16, fontWeight: 500 }}>← Back to Home</Link>
                  <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Sign Up</h2>
                  <p style={{ color: "#5B6172", fontSize: 14, margin: "0 0 24px" }}>No credit card required. Start free.</p>
                  <form onSubmit={handleFirstSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {error && (
                      <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fce4e4", color: "#c0392b", fontSize: 13, fontWeight: 600 }}>{error}</div>
                    )}
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#10162A" }}>Full name</label>
                      <input required name="name" value={form.name} onChange={handleChange} placeholder="Your full name" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#10162A" }}>Email</label>
                      <input required name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#10162A" }}>Phone (Pakistan)</label>
                      <input
                        required name="phone" type="tel" value={form.phone}
                        onChange={handleChange} placeholder="+923001234567"
                        style={{ ...inputStyle, letterSpacing: form.phone ? 1.5 : 0 }}
                      />
                      {form.phone && (
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5, fontSize: 12.5, fontWeight: 600, color: phoneValid ? "var(--secondary)" : "#c0392b" }}>
                          {phoneValid ? <Check size={14} /> : <X size={14} />}
                          {phoneValid ? "Valid Pakistani number" : "Must be +92 followed by 10 digits"}
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#10162A" }}>Password</label>
                      <div style={{ position: "relative" }}>
                        <input required name="password" type={showPw ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Create a strong password" style={{ ...inputStyle, paddingRight: 44 }} />
                        <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0 }}>
                          {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {form.password && (
                        <>
                          <div style={{ display: "flex", gap: 4, marginTop: 8, marginBottom: 6 }}>
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} style={{
                                flex: 1, height: 4, borderRadius: 4,
                                background: i <= pwScore ? (pwScore <= 2 ? "#c0392b" : pwScore === 3 ? "var(--accent)" : "var(--secondary)") : "#E4E1DA",
                                transition: "background .2s",
                              }} />
                            ))}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            {passwordChecks.map(({ label, pass }) => (
                              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: pass ? "var(--secondary)" : "#5B6172" }}>
                                {pass ? <Check size={12} /> : <X size={12} />} {label}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#10162A" }}>Degree / School (optional)</label>
                      <input name="degree" value={form.degree} onChange={handleChange} placeholder="e.g. Bachelor of Science" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#10162A" }}>College / Institution (optional)</label>
                      <input name="college" value={form.college} onChange={handleChange} placeholder="e.g. University of Example" style={inputStyle} />
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <input required name="agree" type="checkbox" checked={form.agree} onChange={handleChange} style={{ marginTop: 3, width: 16, height: 16, accentColor: "var(--secondary)" }} />
                      <label style={{ fontSize: 13, color: "#5B6172" }}>
                        I agree to the{" "}
                        <a href="#" style={{ color: "var(--primary)", fontWeight: 600 }}>Terms of Service</a> and{" "}
                        <a href="#" style={{ color: "var(--primary)", fontWeight: 600 }}>Privacy Policy</a>.
                      </label>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", justifyContent: "center" }}>
                      Create Account
                    </button>
                  </form>
                </>
              )}

              {step === "verify" && (
                <>
                  <button type="button" onClick={() => { setStep("form"); setError(""); setVerifyMethod(null); setOtpSent(false); setOtp(""); }} style={{
                    background: "none", border: "none", cursor: "pointer", color: "#5B6172",
                    display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, padding: 0, marginBottom: 8, fontFamily: "inherit",
                  }}>
                    <ArrowLeft size={14} /> Back to form
                  </button>

                  <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Verify your account</h2>
                  <p style={{ color: "#5B6172", fontSize: 14, margin: "0 0 20px" }}>Choose how you want to verify your identity.</p>

                  {error && (
                    <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fce4e4", color: "#c0392b", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{error}</div>
                  )}

                  {!verifyMethod ? (
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 12, color: "#10162A" }}>Choose verification method</label>
                      <div style={{ display: "flex", gap: 12 }}>
                        <button type="button" onClick={() => { setVerifyMethod("email"); setOtpSent(false); setOtp(""); }} style={{
                          flex: 1, padding: "18px 12px", borderRadius: 10, border: "2px solid #E4E1DA",
                          background: "#fff", cursor: "pointer", fontFamily: "inherit",
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                        }}>
                          <Mail size={26} style={{ color: "var(--primary)" }} />
                          <span style={{ fontWeight: 700, fontSize: 14, color: "#10162A" }}>Email</span>
                          <span style={{ fontSize: 12, color: "#5B6172", textAlign: "center" }}>Verify via {form.email || "your email"}</span>
                        </button>
                        <button type="button" onClick={() => { setVerifyMethod("phone"); setOtpSent(false); setOtp(""); }} style={{
                          flex: 1, padding: "18px 12px", borderRadius: 10, border: "2px solid #E4E1DA",
                          background: "#fff", cursor: "pointer", fontFamily: "inherit",
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                        }}>
                          <Smartphone size={26} style={{ color: "var(--secondary)" }} />
                          <span style={{ fontWeight: 700, fontSize: 14, color: "#10162A" }}>Phone</span>
                          <span style={{ fontSize: 12, color: "#5B6172", textAlign: "center" }}>Verify via {form.phone || "your phone"}</span>
                        </button>
                      </div>
                    </div>
                  ) : !otpSent ? (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#e7e4fc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                        <Shield size={26} style={{ color: "var(--primary)" }} />
                      </div>
                      <p style={{ fontSize: 14, color: "#5B6172", margin: "0 0 6px" }}>
                        Send a verification code to
                      </p>
                      <p style={{ fontWeight: 700, fontSize: 15, margin: "0 0 20px", color: "#10162A" }}>
                        {verifyMethod === "email" ? form.email : form.phone}
                      </p>

                      <button type="button" onClick={() => setVerifyMethod(null)} style={{
                        background: "none", border: "none", cursor: "pointer", color: "var(--primary)", fontSize: 13, fontWeight: 600, fontFamily: "inherit", marginBottom: 16, display: "inline-block",
                      }}>
                        Change method
                      </button>

                      <button onClick={handleSendOtp} disabled={loading} className="btn btn-primary" style={{
                        border: "none", fontFamily: "inherit", cursor: "pointer", justifyContent: "center", width: "100%",
                        opacity: loading ? 0.6 : 1,
                      }}>
                        {loading ? "Sending..." : "Send verification code"}
                      </button>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#dff5ec", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                        <Mail size={26} style={{ color: "var(--secondary)" }} />
                      </div>
                      <p style={{ fontSize: 14, color: "#5B6172", margin: "0 0 4px" }}>
                        Enter the code sent to
                      </p>
                      <p style={{ fontWeight: 700, fontSize: 15, margin: "0 0 20px", color: "#10162A" }}>
                        {verifyMethod === "email" ? form.email : form.phone}
                      </p>

                      <div style={{ marginBottom: 20 }}>
                        <input
                          value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder="000000" maxLength={6}
                          style={{ ...inputStyle, fontSize: 24, letterSpacing: 8, textAlign: "center", maxWidth: 220, margin: "0 auto" }}
                        />
                      </div>

                      <button onClick={handleVerifyOtp} disabled={loading || otp.length < 6} className="btn btn-primary" style={{
                        border: "none", fontFamily: "inherit", cursor: "pointer", justifyContent: "center", width: "100%",
                        opacity: loading || otp.length < 6 ? 0.6 : 1,
                      }}>
                        {loading ? "Verifying..." : "Verify & Create Account"}
                      </button>

                      <button onClick={() => { setOtpSent(false); setOtp(""); setError(""); }} style={{
                        background: "none", border: "none", cursor: "pointer", color: "var(--primary)", fontSize: 13, fontWeight: 600, fontFamily: "inherit", marginTop: 14, display: "inline-block",
                      }}>
                        Resend code
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
