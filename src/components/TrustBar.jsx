import Reveal from "./Reveal";
import { useSettings } from "../context/SettingsContext";

export default function TrustBar() {
  const { settings } = useSettings();

  const items = [
    { num: settings.trustbar_students || "2,400+", label: "Students trained" },
    { num: settings.trustbar_courses || "18", label: "Industry courses" },
    { num: settings.trustbar_completion || "94%", label: "Course completion" },
    { num: "4.9/5", label: "Average rating" },
  ];

  return (
    <section style={{ background: "#fff", borderBottom: "1px solid #E4E1DA" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
        <div className="trust-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, padding: "44px 0" }}>
          {items.map(({ num, label }) => (
            <Reveal key={label}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 28, fontWeight: 600, color: "#0C1524" }}>{num}</div>
                <div style={{ fontSize: 12.5, color: "#5B6172", marginTop: 4 }}>{label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
