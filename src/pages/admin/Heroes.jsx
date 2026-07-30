import { useState, useEffect, useRef } from "react";
import { Plus, Edit3, Trash2, X, Check, Layers, Layout } from "lucide-react";
import { api } from "../../api";
import AdminHero from "./AdminHero";
import ImagePicker from "../../components/admin/ImagePicker";
import { navLinks } from "../../data/navLinks";

const NAV_ORDER = navLinks.map((n) => n.toLowerCase() === "home" ? "home" : n.toLowerCase());
const sortByNav = (pages) => {
  const map = {};
  NAV_ORDER.forEach((id, i) => { map[id] = i; });
  return [...pages].sort((a, b) => (map[a.id] ?? 99) - (map[b.id] ?? 99));
};

const emptySlide = { layout: "standard", gradientOrigin: "50% 50%", eyebrow: "", title: "", subtitle: "", imageUrl: "", stats: [], ctaPrimary: null, ctaSecondary: null, quote: null };

const PREVIEW = (children) => (
  <div style={{
    width: "100%", height: 80, borderRadius: 6, background: "#0C1524",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    fontSize: 8, color: "#fff", lineHeight: 1.3, marginBottom: 8, overflow: "hidden",
  }}>
    {children}
  </div>
);

const LAYOUT_OPTIONS = [
  {
    value: "standard", label: "Standard", desc: "Single column", size: "1 Column · Centered",
    preview: PREVIEW(
      <>
        <div style={{ fontSize: 6, color: "var(--primary)", marginBottom: 2 }}>EYEBROW</div>
        <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 2 }}>Title text here</div>
        <div style={{ fontSize: 6, color: "#9CA3AF", width: "60%", textAlign: "center" }}>Subtitle description line</div>
      </>
    ),
  },
  {
    value: "split", label: "Split", desc: "Two columns with SVG + stats", size: "1.1fr / 0.9fr",
    preview: PREVIEW(
      <div style={{ display: "flex", width: "100%", height: "100%", gap: 0 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 8px" }}>
          <div style={{ fontSize: 5, color: "var(--primary)", marginBottom: 1 }}>EYEBROW</div>
          <div style={{ fontSize: 8, fontWeight: 700, marginBottom: 1 }}>Title</div>
          <div style={{ fontSize: 5, color: "#9CA3AF", marginBottom: 2 }}>Subtitle...</div>
          <div style={{ display: "flex", gap: 2 }}>
            <div style={{ background: "var(--primary)", borderRadius: 2, padding: "1px 4px", fontSize: 5 }}>CTA</div>
          </div>
        </div>
        <div style={{ width: 70, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderLeft: "1px solid rgba(255,255,255,.1)", padding: "0 6px" }}>
          <svg width="30" height="24" viewBox="0 0 40 32" fill="none"><rect x="2" y="6" width="36" height="20" rx="3" stroke="var(--primary)" strokeWidth="1" fill="none"/><circle cx="12" cy="16" r="3" fill="var(--primary)"/><circle cx="20" cy="16" r="3" fill="var(--primary)"/><circle cx="28" cy="16" r="3" fill="var(--primary)"/></svg>
          <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 7, fontWeight: 700 }}>2K+</div><div style={{ fontSize: 4, color: "#9CA3AF" }}>Students</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 7, fontWeight: 700 }}>50+</div><div style={{ fontSize: 4, color: "#9CA3AF" }}>Courses</div></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    value: "fullwidth", label: "Full Width", desc: "Ultra-wide single column", size: "Fluid · Max 900px",
    preview: PREVIEW(
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
        <div style={{ fontSize: 5, color: "var(--primary)", marginBottom: 1 }}>EYEBROW</div>
        <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 1, width: "85%", textAlign: "center" }}>Long-form ultra-wide title that wraps fluidly</div>
        <div style={{ fontSize: 6, color: "#9CA3AF", width: "80%", textAlign: "center" }}>Expanded subtitle content that adapts to container width with responsive text scaling.</div>
      </div>
    ),
  },
  {
    value: "quote", label: "Quote", desc: "Two columns with quote card", size: "1fr / 1fr",
    preview: PREVIEW(
      <div style={{ display: "flex", width: "100%", height: "100%", gap: 0 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 8px" }}>
          <div style={{ fontSize: 5, color: "var(--primary)", marginBottom: 1 }}>EYEBROW</div>
          <div style={{ fontSize: 8, fontWeight: 700, marginBottom: 1 }}>Title</div>
          <div style={{ fontSize: 5, color: "#9CA3AF" }}>Subtitle...</div>
        </div>
        <div style={{ width: 80, display: "flex", alignItems: "center", justifyContent: "center", borderLeft: "1px solid rgba(255,255,255,.1)", padding: "0 6px" }}>
          <div style={{ background: "rgba(91,79,229,.2)", borderRadius: 4, border: "1px solid rgba(91,79,229,.3)", padding: "6px", fontSize: 5, lineHeight: 1.4, color: "#C4B5FD", width: "100%" }}>
            <div style={{ fontSize: 10, color: "var(--primary)", marginBottom: 2 }}>"</div>
            <div>Great learning experience...</div>
            <div style={{ marginTop: 3, fontWeight: 600, color: "#fff" }}>— John D.</div>
          </div>
        </div>
      </div>
    ),
  },
];

function slideToForm(s) {
  return {
    layout: s.layout || "standard",
    gradientOrigin: s.gradientOrigin || "50% 50%",
    eyebrow: s.eyebrow || "",
    title: s.title || "",
    subtitle: s.subtitle || "",
    imageUrl: s.imageUrl || "",
    stats: s.stats?.length ? s.stats.map((st) => ({ num: st.num || "", label: st.label || "" })) : [],
    ctaPrimary: s.ctaPrimary ? { text: s.ctaPrimary.text || "", href: s.ctaPrimary.href || "" } : null,
    ctaSecondary: s.ctaSecondary ? { text: s.ctaSecondary.text || "", href: s.ctaSecondary.href || "" } : null,
    quote: s.quote ? { text: s.quote.text || "", author: s.quote.author || "", role: s.quote.role || "" } : null,
  };
}

export default function AdminHeroes() {
  const [heroPages, setHeroPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState(null);
  const [form, setForm] = useState(emptySlide);
  const [carousel, setCarousel] = useState({ enabled: false, interval: 5 });
  const [savingCarousel, setSavingCarousel] = useState(false);
  const [open, setOpen] = useState(false);
  const ddRef = useRef(null);

  useEffect(() => {
    api.getHeroes().then((pages) => {
      const sorted = sortByNav(pages);
      setHeroPages(sorted);
      if (sorted.length && !selectedPageId) setSelectedPageId(sorted[0].id);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const p = heroPages.find((h) => h.id === selectedPageId);
    if (p) setCarousel({ enabled: !!p.carousel?.enabled, interval: p.carousel?.interval ?? 5 });
  }, [selectedPageId, heroPages]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ddRef.current && !ddRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selectedPage = heroPages.find((p) => p.id === selectedPageId);
  const slides = selectedPage?.slides || [];

  const openNew = () => { setForm(emptySlide); setEditingSlideId(null); setShowForm(true); };
  const openEdit = (slide) => { setForm(slideToForm(slide)); setEditingSlideId(slide.id); setShowForm(true); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const updateCta = (field, key, val) => {
    const cta = form[field] || { text: "", href: "" };
    setForm({ ...form, [field]: { ...cta, [key]: val } });
  };

  const addStat = () => setForm({ ...form, stats: [...(form.stats || []), { num: "", label: "" }] });
  const updateStat = (i, field, val) => {
    const s = [...(form.stats || [])];
    s[i] = { ...s[i], [field]: val };
    setForm({ ...form, stats: s });
  };
  const removeStat = (i) => setForm({ ...form, stats: (form.stats || []).filter((_, idx) => idx !== i) });

  const updateQuote = (key, val) => setForm({ ...form, quote: { ...(form.quote || { text: "", author: "", role: "" }), [key]: val } });

  const save = async () => {
    if (!form.title) return;
    try {
      if (editingSlideId) {
        await api.updateHero(selectedPageId, editingSlideId, form);
      } else {
        await api.createHero(selectedPageId, form);
      }
      const pages = await api.getHeroes();
      setHeroPages(pages);
      setShowForm(false); setEditingSlideId(null);
    } catch (e) { alert("Failed to save slide"); }
  };

  const remove = async (slideId) => {
    if (!confirm("Delete this slide?")) return;
    try {
      await api.deleteHero(selectedPageId, slideId);
      const pages = await api.getHeroes();
      setHeroPages(pages);
    } catch (e) { alert("Failed to delete"); }
  };

  const saveCarouselSettings = async () => {
    setSavingCarousel(true);
    try {
      await api.updateCarousel(selectedPageId, carousel);
      const pages = await api.getHeroes();
      setHeroPages(pages);
    } catch (e) { alert("Failed to save carousel settings"); }
    setSavingCarousel(false);
  };

  return (
    <div>
      <AdminHero icon={Layers} title="Hero Slider Management" subtitle={`Manage ${heroPages.length} hero pages with slides.`}
        gradient="linear-gradient(135deg,var(--primary),#2f2793)" />

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24, background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 16 }}>
        <label style={{ fontSize: 14, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: ".04em" }}>Page:</label>
        <div style={{ position: "relative" }} ref={ddRef}>
          <div onClick={() => setOpen(!open)}
            style={{
              padding: "8px 36px 8px 14px", borderRadius: 8, border: open ? "1px solid var(--primary)" : "1px solid #E4E1DA",
              fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none",
              minWidth: 200, cursor: "pointer", color: "#10162A", fontWeight: 500, userSelect: "none",
              boxShadow: open ? "0 0 0 3px rgba(91,79,229,.12)" : "none",
              transition: "border-color .2s, box-shadow .2s",
            }}>
            {heroPages.find((p) => p.id === selectedPageId)?.page} ({selectedPageId})
          </div>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9CA3AF", transition: "transform .25s", rotate: open ? "180deg" : "0deg" }}>
            <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {open && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, zIndex: 100,
              background: "#fff", border: "1px solid #E4E1DA", borderRadius: 8, overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,.1)",
            }}>
              {heroPages.map((p, i) => (
                <div key={p.id} onClick={() => { setSelectedPageId(p.id); setOpen(false); }}
                  style={{
                    padding: "10px 14px", cursor: "pointer", fontSize: 14, color: "#10162A",
                    background: p.id === selectedPageId ? "#F0EEFF" : "#fff",
                    borderBottom: i < heroPages.length - 1 ? "1px solid #F1EFE9" : "none",
                    fontWeight: p.id === selectedPageId ? 600 : 400,
                    transition: "background .15s",
                  }}
                  onMouseEnter={(e) => { if (p.id !== selectedPageId) e.currentTarget.style.background = "#F9F8F5"; }}
                  onMouseLeave={(e) => { if (p.id !== selectedPageId) e.currentTarget.style.background = "#fff"; }}>
                  <span style={{ color: "var(--primary)", fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{p.id}</span>
                  <span style={{ marginLeft: 8 }}>{p.page}</span>
                  {p.id === selectedPageId && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ float: "right", marginTop: 2 }}>
                      <path d="M3 7.5l3 3 5-6" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={openNew} disabled={!selectedPageId} className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "9px 18px", fontSize: 13 }}><Plus size={15} /> Add Slide</button>
      </div>

      {slides.length > 1 && (
        <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 20, background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 16 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: "#10162A", display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={carousel.enabled} onChange={(e) => setCarousel({ ...carousel, enabled: e.target.checked })} />
            Auto-slide
          </label>
          {carousel.enabled && (
            <>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#10162A", display: "flex", alignItems: "center", gap: 6 }}>
                Interval (s):
                <input type="number" min={1} max={30} value={carousel.interval}
                  onChange={(e) => setCarousel({ ...carousel, interval: Math.max(1, Number(e.target.value)) })}
                  style={{ width: 60, padding: "6px 8px", borderRadius: 6, border: "1px solid #E4E1DA", fontSize: 13, fontFamily: "inherit", background: "#F6F4F0", outline: "none", textAlign: "center" }} />
              </label>
            </>
          )}
          <button onClick={saveCarouselSettings} disabled={savingCarousel}
            style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid var(--primary)", background: "var(--primary)", color: "#fff", fontSize: 12, fontFamily: "inherit", cursor: "pointer" }}>
            {savingCarousel ? "Saving..." : "Save"}
          </button>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>{slides.length} slides</div>
        </div>
      )}

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 700, maxWidth: "90vw", maxHeight: "85vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{editingSlideId ? "Edit Slide" : "Add Slide"} — {selectedPage?.page}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Layout</label>
                <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                  {LAYOUT_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => setForm({ ...form, layout: opt.value })}
                      style={{ flex: 1, display: "flex", flexDirection: "column", padding: "10px 12px", borderRadius: 8, border: form.layout === opt.value ? "2px solid var(--primary)" : "1px solid #E4E1DA", background: form.layout === opt.value ? "#F0EEFF" : "#F6F4F0", cursor: "pointer", fontFamily: "inherit", textAlign: "center" }}>
                      {opt.preview}
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{opt.label}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{opt.desc}</div>
                      <div style={{ fontSize: 10, color: "var(--primary)", marginTop: 4, fontFamily: "'JetBrains Mono',monospace" }}>{opt.size}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Eyebrow</label>
                <input name="eyebrow" value={form.eyebrow} onChange={handleChange} placeholder='e.g. "Centeric Solutions · Technology Academy"' style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Title</label>
                <input name="title" value={form.title} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Subtitle</label>
                <textarea name="subtitle" value={form.subtitle} onChange={handleChange} rows={2} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none", resize: "vertical" }} />
              </div>

              {form.layout === "split" && (
                <div style={{ background: "#F6F4F0", borderRadius: 8, padding: 16 }}>
                  <ImagePicker value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} label="Right Side Image" height={140} />
                </div>
              )}

              {(form.layout === "split" || form.layout === "quote" || form.layout === "fullwidth") && (
                <div style={{ background: "#F6F4F0", borderRadius: 8, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label style={{ fontSize: 12.5, fontWeight: 600, color: "#10162A" }}>CTA Primary</label>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <input placeholder="Text (e.g. Explore Courses)" value={form.ctaPrimary?.text || ""} onChange={(e) => updateCta("ctaPrimary", "text", e.target.value)} style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E4E1DA", fontSize: 13, fontFamily: "inherit", background: "#fff", outline: "none" }} />
                    <input placeholder="Link (e.g. /courses)" value={form.ctaPrimary?.href || ""} onChange={(e) => updateCta("ctaPrimary", "href", e.target.value)} style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E4E1DA", fontSize: 13, fontFamily: "inherit", background: "#fff", outline: "none" }} />
                  </div>
                </div>
              )}

              {form.layout === "split" && (
                <div style={{ background: "#F6F4F0", borderRadius: 8, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label style={{ fontSize: 12.5, fontWeight: 600, color: "#10162A" }}>CTA Secondary</label>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <input placeholder="Text" value={form.ctaSecondary?.text || ""} onChange={(e) => updateCta("ctaSecondary", "text", e.target.value)} style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E4E1DA", fontSize: 13, fontFamily: "inherit", background: "#fff", outline: "none" }} />
                    <input placeholder="Link" value={form.ctaSecondary?.href || ""} onChange={(e) => updateCta("ctaSecondary", "href", e.target.value)} style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E4E1DA", fontSize: 13, fontFamily: "inherit", background: "#fff", outline: "none" }} />
                  </div>
                </div>
              )}

              {form.layout === "split" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label style={{ fontSize: 12.5, fontWeight: 600, color: "#10162A" }}>Stats</label>
                    <button onClick={addStat} style={{ background: "none", border: "1px solid #E4E1DA", borderRadius: 6, cursor: "pointer", padding: "4px 10px", fontSize: 11, fontFamily: "inherit" }}>+ Add Stat</button>
                  </div>
                  {(form.stats || []).map((stat, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, marginBottom: 8, alignItems: "center" }}>
                      <input placeholder="Value (e.g. 2,400+)" value={stat.num} onChange={(e) => updateStat(i, "num", e.target.value)} style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E4E1DA", fontSize: 13, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                      <input placeholder="Label (e.g. Students taught)" value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)} style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E4E1DA", fontSize: 13, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                      <button onClick={() => removeStat(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", padding: 4 }}><Trash2 size={15} /></button>
                    </div>
                  ))}
                </div>
              )}

              {form.layout === "quote" && (
                <div style={{ background: "#F6F4F0", borderRadius: 8, padding: 16 }}>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 8, color: "#10162A" }}>Quote</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <textarea placeholder="Quote text" value={form.quote?.text || ""} onChange={(e) => updateQuote("text", e.target.value)} rows={2} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #E4E1DA", fontSize: 13, fontFamily: "inherit", background: "#fff", outline: "none", resize: "vertical" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <input placeholder="Author name" value={form.quote?.author || ""} onChange={(e) => updateQuote("author", e.target.value)} style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E4E1DA", fontSize: 13, fontFamily: "inherit", background: "#fff", outline: "none" }} />
                      <input placeholder="Author role" value={form.quote?.role || ""} onChange={(e) => updateQuote("role", e.target.value)} style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E4E1DA", fontSize: 13, fontFamily: "inherit", background: "#fff", outline: "none" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #E4E1DA", background: "transparent", fontSize: 14, fontFamily: "inherit", cursor: "pointer" }}>Cancel</button>
              <button onClick={save} className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "10px 20px", fontSize: 14 }}><Check size={16} /> Save</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
        {slides.map((slide) => (
          <div key={slide.id} style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <Layout size={14} style={{ color: "#9CA3AF" }} />
                <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase" }}>{slide.layout}</span>
              </div>
              {slide.eyebrow && <div style={{ fontSize: 11, color: "var(--primary)", fontWeight: 600, marginBottom: 2 }}>{slide.eyebrow}</div>}
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>{slide.title}</h3>
              <div style={{ fontSize: 13, color: "#5B6172", marginBottom: 8 }}>{slide.subtitle}</div>
              {slide.stats?.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8, borderTop: "1px solid #E4E1DA", paddingTop: 8 }}>
                  {slide.stats.map((s, si) => (
                    <span key={si} style={{ fontSize: 11, background: "#F6F4F0", padding: "2px 8px", borderRadius: 4, color: "#5B6172" }}>{s.num} {s.label}</span>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={() => openEdit(slide)} style={{ background: "none", border: "1px solid #E4E1DA", borderRadius: 8, cursor: "pointer", color: "var(--primary)", padding: "6px 14px", fontSize: 12, fontFamily: "inherit" }}><Edit3 size={14} /> Edit</button>
                <button onClick={() => remove(slide.id)} style={{ background: "none", border: "1px solid #E4E1DA", borderRadius: 8, cursor: "pointer", color: "#c0392b", padding: "6px 14px", fontSize: 12, fontFamily: "inherit" }}><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          </div>
        ))}
        {slides.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 60, color: "#9CA3AF", background: "#fff", borderRadius: 12, border: "1px solid #E4E1DA" }}>
            No slides yet for this page. Click "Add Slide" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
