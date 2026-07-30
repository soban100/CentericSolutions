import { useEffect, useState } from "react";

const slideInLeft = `
@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
@keyframes slideOutLeft {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}
@keyframes slideOutRight {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}
@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes fadeOutScale {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.9); }
}
`;

export default function PageLoader({ visible, onDone, title, subtitle }) {
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    if (!visible) {
      setPhase("idle");
      return;
    }
    setPhase("enter");
    const t1 = setTimeout(() => setPhase("hold"), 500);
    const t2 = setTimeout(() => setPhase("exit"), 1000);
    const t3 = setTimeout(() => { setPhase("idle"); onDone?.(); }, 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [visible, onDone]);

  if (phase === "idle") return null;

  const leftStyle = {
    flex: 1, background: "#0C1524",
    animation: phase === "enter" ? `slideInLeft 0.45s ease-out forwards`
             : phase === "exit" ? `slideOutLeft 0.45s ease-in forwards`
             : "none",
  };

  const rightStyle = {
    flex: 1, background: "var(--primary)",
    animation: phase === "enter" ? `slideInRight 0.45s ease-out forwards`
             : phase === "exit" ? `slideOutRight 0.45s ease-in forwards`
             : "none",
  };

  const textAnim = phase === "enter" ? `fadeInScale 0.4s ease-out 0.1s both`
                  : phase === "exit" ? `fadeOutScale 0.3s ease-in forwards`
                  : "none";

  return (
    <>
      <style>{slideInLeft}</style>
      <div style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex" }}>
        <div style={leftStyle} />
        <div style={rightStyle} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "clamp(36px,5vw,72px)", fontWeight: 800, color: "#fff", letterSpacing: "-.02em", whiteSpace: "nowrap", animation: textAnim }}>
            {title}
          </span>
          {subtitle && (
            <span style={{ fontSize: "clamp(18px,2.5vw,36px)", fontWeight: 600, color: "rgba(255,255,255,.7)", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 8, animation: textAnim }}>
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
