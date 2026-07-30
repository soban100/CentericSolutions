import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Users, BookOpen, Globe, ExternalLink, ArrowRight, CheckCircle } from "lucide-react";
import { api } from "../api";
import Reveal from "../components/Reveal";
import FinalCTA from "../components/FinalCTA";

export default function InstructorDetail() {
  const { id } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getInstructor(id),
      api.getPublishedCourses(),
    ]).then(([inst, allCourses]) => {
      setInstructor(inst);
      setCourses(allCourses.filter((c) => c.instructor === inst.name));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: "160px 28px", textAlign: "center", color: "#5B6172" }}>Loading...</div>;

  if (!instructor) {
    return (
      <div style={{ padding: "160px 28px", textAlign: "center" }}>
        <h2>Instructor not found</h2>
        <p style={{ color: "#5B6172" }}>The instructor you're looking for doesn't exist.</p>
        <Link to="/instructors" style={{ color: "var(--primary)", fontWeight: 600 }}>← Back to instructors</Link>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 83 }}>
      <section style={{
        background: instructor.gradient, color: "#fff", padding: "80px 0 100px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          <Link to="/instructors" style={{ color: "rgba(255,255,255,.7)", textDecoration: "none", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 40 }}>
            <ArrowLeft size={16} /> Back to Instructors
          </Link>
          <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
            {instructor.image_url ? (
              <img src={instructor.image_url} alt={instructor.name} style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover", border: "4px solid rgba(255,255,255,.3)", flexShrink: 0 }} />
            ) : (
              <span style={{ width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,.2)", flexShrink: 0, border: "4px solid rgba(255,255,255,.3)" }} />
            )}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "clamp(32px,4vw,44px)", fontWeight: 800, margin: "0 0 4px" }}>{instructor.name}</h1>
              <div style={{ fontSize: 17, opacity: 0.85, marginBottom: 6 }}>{instructor.role}</div>
              {instructor.specialty && (
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, padding: "4px 12px", borderRadius: 999, fontWeight: 600, background: "rgba(255,255,255,.15)", display: "inline-block" }}>
                  {instructor.specialty}
                </span>
              )}
              <div style={{ display: "flex", gap: 24, marginTop: 20, fontSize: 14, opacity: 0.8, fontFamily: "'JetBrains Mono',monospace" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Users size={16} /> {instructor.students} students</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><BookOpen size={16} /> {instructor.course_count} courses</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--accent)" }}><Star size={16} fill="var(--accent)" /> {instructor.rating}</span>
              </div>
            </div>
          </div>
          {(instructor.twitter_url || instructor.linkedin_url || instructor.github_url) && (
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              {instructor.twitter_url && (
                <a href={instructor.twitter_url} target="_blank" rel="noopener noreferrer" style={{
                  background: "rgba(255,255,255,.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", textDecoration: "none",
                  fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, transition: "background .2s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,.1)"}>
                  <Globe size={16} /> Twitter
                </a>
              )}
              {instructor.linkedin_url && (
                <a href={instructor.linkedin_url} target="_blank" rel="noopener noreferrer" style={{
                  background: "rgba(255,255,255,.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", textDecoration: "none",
                  fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, transition: "background .2s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,.1)"}>
                  <ExternalLink size={16} /> LinkedIn
                </a>
              )}
              {instructor.github_url && (
                <a href={instructor.github_url} target="_blank" rel="noopener noreferrer" style={{
                  background: "rgba(255,255,255,.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", textDecoration: "none",
                  fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, transition: "background .2s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,.1)"}>
                  <ExternalLink size={16} /> GitHub
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 60 }}>
            <div>
              <Reveal>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>About</h2>
                <p style={{ color: "#5B6172", lineHeight: 1.7, fontSize: 15.5 }}>{instructor.long_bio || instructor.bio}</p>
              </Reveal>

              {courses.length > 0 && (
                <Reveal>
                  <h2 style={{ fontSize: 24, fontWeight: 700, margin: "40px 0 20px" }}>Courses by {instructor.name}</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {courses.map((c) => (
                      <div key={c.id} style={{ display: "flex", gap: 16, alignItems: "center", background: "#F6F4F0", borderRadius: 12, padding: 16 }}>
                        <div style={{
                          width: 60, height: 60, borderRadius: 10, flexShrink: 0,
                          background: c.image_url ? `center/cover url("${c.image_url}")` : c.gradient,
                        }} />
                        <div style={{ flex: 1 }}>
                          <Link to={`/courses/${c.slug}`} style={{ fontWeight: 700, fontSize: 15, color: "#10162A", textDecoration: "none" }}>
                            {c.title}
                          </Link>
                          <div style={{ display: "flex", gap: 12, marginTop: 4, fontSize: 12, color: "#5B6172", fontFamily: "'JetBrains Mono',monospace" }}>
                            <span>{c.level}</span>
                            <span>{c.duration}</span>
                          </div>
                        </div>
                        <Link to={`/courses/${c.slug}`} style={{ color: "var(--primary)", fontWeight: 600, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 }}>
                          View <ArrowRight size={13} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            <div>
              <div style={{ position: "sticky", top: 100 }}>
                <div style={{ background: "#F6F4F0", borderRadius: 12, padding: 24 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: ".04em" }}>Details</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#5B6172" }}>Students</span>
                      <span style={{ fontWeight: 600 }}>{instructor.students}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#5B6172" }}>Courses</span>
                      <span style={{ fontWeight: 600 }}>{instructor.course_count}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#5B6172" }}>Rating</span>
                      <span style={{ fontWeight: 600, color: "var(--accent)" }}>★ {instructor.rating}</span>
                    </div>
                    {instructor.specialty && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#5B6172" }}>Specialty</span>
                        <span style={{ fontWeight: 600 }}>{instructor.specialty}</span>
                      </div>
                    )}
                  </div>
                </div>
                {instructor.long_bio && (
                  <div style={{ marginTop: 16, fontSize: 13, color: "#5B6172" }}>
                    <CheckCircle size={14} color="var(--secondary)" style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
                    Industry professional
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}