import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Clock, Users, Star, ArrowLeft, BookOpen, Award, CheckCircle, X, LogIn } from "lucide-react";
import { api } from "../api";
import Reveal from "../components/Reveal";
import FinalCTA from "../components/FinalCTA";
import NewBadge from "../components/NewBadge";

function EnrollModal({ course, onClose, user }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    degree: user?.degree || "",
    college: user?.college || "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createEnrollment({ ...form, course_id: course.id, course_name: course.title });
      setSubmitted(true);
    } catch (err) {
      alert("Failed to submit enrollment. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.5)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }} onClick={onClose}>
        <div style={{
          background: "#fff", borderRadius: 16, padding: 48, maxWidth: 420, width: "100%",
          textAlign: "center",
        }} onClick={(e) => e.stopPropagation()}>
          <CheckCircle size={48} color="#22c55e" style={{ marginBottom: 16 }} />
          <h3 style={{ margin: "0 0 8px" }}>Enrollment Submitted</h3>
          <p style={{ color: "#5B6172", margin: 0 }}>We'll reach out to you shortly with the next steps.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.5)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 36, maxWidth: 480, width: "100%",
        position: "relative",
      }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16, border: "none", background: "none",
          cursor: "pointer", color: "#5B6172",
        }}><X size={20} /></button>
        <h3 style={{ margin: "0 0 4px", fontSize: 22 }}>Enroll in {course?.title}</h3>
        <p style={{ color: "#5B6172", fontSize: 14, margin: "0 0 24px" }}>Fill in your details to get started</p>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required style={inputStyle} />
          <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required style={inputStyle} />
          <input name="phone" type="tel" placeholder="Phone number" value={form.phone} onChange={handleChange} required style={inputStyle} />
          <input name="degree" placeholder="Current degree / School" value={form.degree} onChange={handleChange} required style={inputStyle} />
          <input name="college" placeholder="College / Institution" value={form.college} onChange={handleChange} required style={inputStyle} />
          <button type="submit" className="btn btn-primary" style={{ padding: "14px 0", border: "none", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>
            Submit Enrollment
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px 14px", border: "1px solid #E4E1DA", borderRadius: 10,
  fontSize: 14, outline: "none", boxSizing: "border-box",
};

function LoginPrompt({ onLogin, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.5)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={onCancel}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 40, maxWidth: 400, width: "100%",
        textAlign: "center",
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fce4e4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <LogIn size={24} style={{ color: "#c0392b" }} />
        </div>
        <h3 style={{ margin: "0 0 6px", fontSize: 20 }}>Login Required</h3>
        <p style={{ color: "#5B6172", fontSize: 14, margin: "0 0 24px", lineHeight: 1.5 }}>
          You need to be logged in to enroll in a course. Please sign in to continue.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onCancel} style={{
            padding: "10px 24px", borderRadius: 8, border: "1px solid #E4E1DA",
            background: "transparent", fontSize: 14, fontFamily: "inherit", cursor: "pointer", color: "#5B6172",
          }}>Cancel</button>
          <button onClick={onLogin} className="btn btn-primary" style={{
            border: "none", fontFamily: "inherit", cursor: "pointer", padding: "10px 24px", fontSize: 14,
            textDecoration: "none",
          }}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default function CourseDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollUser, setEnrollUser] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPublishedCourses().then((all) => {
      const found = all.find((c) => c.slug === slug);
      setCourse(found);
      setCourses(all);
      setLoading(false);
    })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleEnrollClick = async () => {
    try {
      const user = await api.getMe();
      setEnrollUser(user);
      setEnrolling(true);
    } catch {
      setShowLoginPrompt(true);
    }
  };

  if (loading) return <div style={{ padding: "160px 28px", textAlign: "center", color: "#5B6172" }}>Loading...</div>;

  if (!course) {
    return (
      <div style={{ padding: "160px 28px", textAlign: "center" }}>
        <h2>Course not found</h2>
        <p style={{ color: "#5B6172" }}>The course you're looking for doesn't exist.</p>
        <Link to="/courses" style={{ color: "var(--primary)", fontWeight: 600 }}>← Back to courses</Link>
      </div>
    );
  }

  const related = courses.filter((c) => c.tag === course.tag && c.slug !== course.slug).slice(0, 3);

  return (
    <div style={{ marginTop: 83 }}>
      <section style={{
        background: course.image_url
          ? `linear-gradient(rgba(12,21,36,.8),rgba(12,21,36,.8)), url("${course.image_url}") center/cover no-repeat`
          : course.gradient,
        color: "#fff", padding: "80px 0 100px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          <Link to="/courses" style={{ color: "rgba(255,255,255,.7)", textDecoration: "none", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
            <ArrowLeft size={16} /> Back to Courses
          </Link>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 48, alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, padding: "4px 12px", borderRadius: 999, fontWeight: 600, background: "rgba(255,255,255,.15)", display: "inline-block" }}>{course.tag}</span>
                <NewBadge course={course} style={{ background: "rgba(14,169,122,.25)", color: "var(--secondary)" }} />
              </div>
              <h1 style={{ fontSize: "clamp(32px,4vw,44px)", fontWeight: 800, margin: "0 0 16px" }}>{course.title}</h1>
              <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.85, maxWidth: 600 }}>{course.description}</p>
              <div style={{ display: "flex", gap: 24, marginTop: 24, fontSize: 14, opacity: 0.8, fontFamily: "'JetBrains Mono',monospace" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Clock size={16} /> {course.duration}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Users size={16} /> {course.students} enrolled</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Star size={16} fill="var(--accent)" color="var(--accent)" /> {course.rating}</span>
              </div>
            </div>
            <div style={{
              background: "rgba(255,255,255,.1)", borderRadius: 16, padding: 32, backdropFilter: "blur(8px)",
            }}>
              <div style={{ fontSize: 32, fontWeight: 800 }}>Free</div>
              <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 20 }}>No cost to enroll</div>
              <button onClick={handleEnrollClick} className="btn btn-primary" style={{ width: "100%", padding: "14px 0", border: "none", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                Enroll Now <BookOpen size={16} />
              </button>
              <div style={{ marginTop: 16, fontSize: 12, opacity: 0.6, textAlign: "center" }}>
                <CheckCircle size={12} style={{ display: "inline", marginRight: 4 }} />Certificate on completion
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 60 }}>
            <div>
              <Reveal>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>About This Course</h2>
                <p style={{ color: "#5B6172", lineHeight: 1.7 }}>{course.description}</p>
              </Reveal>
              <Reveal>
                <h2 style={{ fontSize: 24, fontWeight: 700, margin: "40px 0 16px" }}>What You'll Learn</h2>
                <div style={{ display: "grid", gap: 12 }}>
                  {[
                    "Build real-world projects from scratch",
                    "Work with modern tools and frameworks",
                    "Get personalized code reviews from instructors",
                    "Join a community of fellow learners",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <CheckCircle size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ color: "#10162A", fontSize: 15 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal>
                <h2 style={{ fontSize: 24, fontWeight: 700, margin: "40px 0 16px" }}>Instructor</h2>
                <div style={{ display: "flex", gap: 16, alignItems: "center", background: "#F6F4F0", borderRadius: 12, padding: 20 }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#e7e4fc", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{course.instructor}</div>
                    <div style={{ color: "#5B6172", fontSize: 13 }}>Industry professional with years of experience</div>
                  </div>
                </div>
              </Reveal>
            </div>
            <div>
              <div style={{ position: "sticky", top: 100 }}>
                <div style={{ background: "#F6F4F0", borderRadius: 12, padding: 24 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: ".04em" }}>Course Details</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#5B6172" }}>Level</span>
                      <span style={{ fontWeight: 600 }}>{course.level}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#5B6172" }}>Duration</span>
                      <span style={{ fontWeight: 600 }}>{course.duration}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#5B6172" }}>Students</span>
                      <span style={{ fontWeight: 600 }}>{course.students}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#5B6172" }}>Rating</span>
                      <span style={{ fontWeight: 600, color: "var(--accent)" }}>★ {course.rating}</span>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <Award size={20} color="var(--primary)" style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
                  <span style={{ fontSize: 13, color: "#5B6172" }}>Certificate on completion · Project portfolio</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ padding: "80px 0", background: "#F6F4F0" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
            <Reveal>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32 }}>More in {course.tag}</h2>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
              {related.map((c) => (
                <Reveal key={c.slug}>
                  <Link to={`/courses/${c.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, overflow: "hidden" }}>
                      <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "rgba(255,255,255,.85)", textAlign: "center", padding: "0 12px", background: c.image_url ? `linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45)), url("${c.image_url}") center/cover` : c.gradient }}>
                        {c.title}
                      </div>
                      <div style={{ padding: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                          <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{c.title}</h4>
                          <NewBadge course={c} />
                        </div>
                        <p style={{ fontSize: 13, color: "#5B6172", margin: 0, lineHeight: 1.5 }}>{c.description}</p>
                        <div style={{ marginTop: 10, fontSize: 12, color: "var(--primary)", fontWeight: 600 }}>View course →</div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCTA />

      {enrolling && <EnrollModal course={course} user={enrollUser} onClose={() => { setEnrolling(false); setEnrollUser(null); }} />}
      {showLoginPrompt && (
        <LoginPrompt
          onLogin={() => { setShowLoginPrompt(false); navigate("/login"); }}
          onCancel={() => setShowLoginPrompt(false)}
        />
      )}
    </div>
  );
}
