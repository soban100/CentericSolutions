import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

export default function FinalCTA() {
  return (
    <section style={{ padding: "0 0 104px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
        <Reveal>
          <div style={{ background: "linear-gradient(135deg,#0C1524,#1c2b47)", color: "#fff", textAlign: "center", borderRadius: 24, padding: "80px 28px" }}>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, maxWidth: 640, margin: "0 auto 18px" }}>Start building your future skills today.</h2>
            <p style={{ color: "rgba(255,255,255,.65)", marginBottom: 30 }}>Enrollment for the next cohort closes soon — courses are kept small on purpose.</p>
            <a href="#courses" className="btn btn-primary" style={{ textDecoration: "none" }}>Explore Courses <ArrowRight size={16} /></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
