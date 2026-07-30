import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, X, Check, Star, MessageSquare } from "lucide-react";
import { api } from "../../api";
import AdminHero from "./AdminHero";
import ImagePicker from "../../components/admin/ImagePicker";

const emptyTestimonial = { name: "", role: "", quote: "", image_url: "", rating: 5 };

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyTestimonial);

  useEffect(() => { api.getTestimonials().then(setTestimonials).catch(() => {}); }, []);

  const openNew = () => { setForm(emptyTestimonial); setEditing(null); setShowForm(true); };
  const openEdit = (t) => { setForm({ ...t }); setEditing(t.id); setShowForm(true); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    if (!form.name || !form.quote) return;
    try {
      if (editing) {
        const updated = await api.updateTestimonial(editing, form);
        setTestimonials(testimonials.map((t) => (t.id === editing ? updated : t)));
      } else {
        const created = await api.createTestimonial(form);
        setTestimonials([created, ...testimonials]);
      }
      setShowForm(false); setEditing(null);
    } catch (e) { alert("Failed to save"); }
  };

  const remove = async (i, id) => {
    if (!confirm("Delete this testimonial?")) return;
    try { await api.deleteTestimonial(id); setTestimonials(testimonials.filter((_, idx) => idx !== i)); }
    catch (e) { alert("Failed to delete"); }
  };

  const avgRating = testimonials.length ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1) : 0;

  return (
    <div>
      <AdminHero icon={MessageSquare} title="Testimonials" subtitle={`Hear from your students — ${testimonials.length} testimonials with an average rating of ${avgRating}.`}
        gradient="linear-gradient(135deg,var(--accent),#a97a1a)" />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 24, fontSize: 14 }}>
          <span><strong>{testimonials.length}</strong> testimonials</span>
          <span>Avg: <strong>{avgRating}</strong> ★</span>
        </div>
        <button onClick={openNew} className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "9px 18px", fontSize: 13 }}><Plus size={15} /> Add Testimonial</button>
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 520, maxWidth: "90vw", maxHeight: "85vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{editing ? "Edit Testimonial" : "Add Testimonial"}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 16, alignItems: "center" }}>
                <ImagePicker value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} label="Avatar" height={120} />
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Name</label>
                    <input name="name" value={form.name} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Role</label>
                    <input name="role" value={form.role} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                  </div>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Content</label>
                <textarea name="quote" value={form.quote} onChange={handleChange} rows={4} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none", resize: "vertical" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Rating</label>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setForm({ ...form, rating: star })} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                      <Star size={24} fill={star <= form.rating ? "var(--accent)" : "#E4E1DA"} color={star <= form.rating ? "var(--accent)" : "#E4E1DA"} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #E4E1DA", background: "transparent", fontSize: 14, fontFamily: "inherit", cursor: "pointer" }}>Cancel</button>
              <button onClick={save} className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "10px 20px", fontSize: 14 }}><Check size={16} /> Save</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
        {testimonials.map((t, i) => (
          <div key={t.id} style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
              {[...Array(5)].map((_, si) => (
                <Star key={si} size={15} fill={si < t.rating ? "var(--accent)" : "#E4E1DA"} color={si < t.rating ? "var(--accent)" : "#E4E1DA"} />
              ))}
            </div>
            <p style={{ fontSize: 14, color: "#5B6172", lineHeight: 1.7, margin: "0 0 16px" }}>"{t.quote}"</p>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {t.image_url ? (
                <img src={t.image_url} alt={t.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent)" }} />
              )}
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>{t.role}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button onClick={() => openEdit(t)} className="btn btn-secondary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "6px 14px", fontSize: 12, background: "#F6F4F0" }}><Edit3 size={14} /> Edit</button>
              <button onClick={() => remove(i, t.id)} className="btn btn-secondary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "6px 14px", fontSize: 12, background: "#F6F4F0", color: "#c0392b" }}><Trash2 size={14} /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
