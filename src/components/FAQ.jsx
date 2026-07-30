import { useState } from "react";
import Reveal from "./Reveal";

export default function FAQ({ faqs = [] }) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section style={{ padding: "104px 0" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
        <Reveal>
          <div style={{ maxWidth: 620, marginBottom: 52 }}>
            <div className="eyebrow" style={{ color: "var(--primary)", marginBottom: 14 }}>Frequently Asked</div>
            <h2 style={{ fontSize: "clamp(28px,3.6vw,38px)", fontWeight: 800, margin: 0 }}>Good to know before you enroll.</h2>
          </div>
        </Reveal>
        <Reveal>
          <div style={{ maxWidth: 760 }}>
            {faqs.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={item.question} style={{ borderBottom: "1px solid #E4E1DA" }}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "22px 0", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16, fontWeight: 700, color: "#0C1524" }}
                  >
                    {item.question}
                    <span style={{ fontSize: 20, color: "var(--primary)", fontWeight: 400, transition: "transform .25s ease", transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  <div style={{ maxHeight: isOpen ? 200 : 0, overflow: "hidden", transition: "max-height .3s ease" }}>
                    <p style={{ margin: "0 0 22px", color: "#5B6172", fontSize: 14.5, maxWidth: 640 }}>{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
