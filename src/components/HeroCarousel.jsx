import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroSection from "./HeroSection";

const DOT_STYLE = {
  width: 10, height: 10, borderRadius: "50%", border: "none", cursor: "pointer",
  padding: 0, transition: "background .3s",
};

export default function HeroCarousel({ pageHero, children }) {
  const { slides = [], carousel = { enabled: false, interval: 5 } } = pageHero || {};
  const [active, setActive] = useState(0);
  const slideCount = slides.length;
  const sliding = useRef(false);

  const hasMultiple = slideCount > 1;
  const canRotate = carousel.enabled && hasMultiple;

  const goTo = useCallback((i) => {
    if (sliding.current || slideCount < 2) return;
    const next = ((i % slideCount) + slideCount) % slideCount;
    if (next === active) return;
    sliding.current = true;
    setActive(next);
    setTimeout(() => { sliding.current = false; }, 600);
  }, [slideCount, active]);

  useEffect(() => {
    if (!canRotate) return;
    const id = setInterval(() => goTo(active + 1), carousel.interval * 1000);
    return () => clearInterval(id);
  }, [canRotate, active, carousel.interval, goTo]);

  if (slideCount === 0) return null;

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div style={{
        display: "flex",
        transition: "transform .55s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: `translateX(-${active * 100}%)`,
      }}>
        {slides.map((slide, i) => (
          <div key={i} style={{ minWidth: "100%" }}>
            <HeroSection slide={slide}>
              {children}
            </HeroSection>
          </div>
        ))}
      </div>

      {hasMultiple && (
        <>
          <button onClick={() => goTo(active - 1)}
            style={{
              position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)",
              color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(4px)", zIndex: 5, transition: "background .25s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,.25)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,.12)"}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => goTo(active + 1)}
            style={{
              position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)",
              color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(4px)", zIndex: 5, transition: "background .25s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,.25)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,.12)"}>
            <ChevronRight size={20} />
          </button>

          <div style={{
            position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: 8, zIndex: 5,
          }}>
            {slides.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                style={{ ...DOT_STYLE, background: i === active ? "#fff" : "rgba(255,255,255,.35)" }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
