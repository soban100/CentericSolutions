import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, X, Check, HelpCircle } from "lucide-react";
import { api } from "../../api";
import AdminHero from "./AdminHero";

const emptyFaq = { question: "", answer: "", order_index: 0 };

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyFaq);

  useEffect(() => { api.getFAQs().then(setFaqs).catch(() => {}); }, []);

  const openNew = () => { setForm({ ...emptyFaq, order_index: faqs.length }); setEditing(null); setShowForm(true); };
  const openEdit = (f) => { setForm({ ...f }); setEditing(f.id); setShowForm(true); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    if (!form.question || !form.answer) return;
    try {
      if (editing) {
        const updated = await api.updateFAQ(editing, form);
        setFaqs(faqs.map((f) => (f.id === editing ? updated : f)));
      } else {
        const created = await api.createFAQ(form);
        setFaqs([...faqs, created]);
      }
      setShowForm(false); setEditing(null);
    } catch (e) { alert("Failed to save"); }
  };

  const remove = async (id) => {
    if (!confirm("Delete this FAQ?")) return;
    try { await api.deleteFAQ(id); setFaqs(faqs.filter((f) => f.id !== id)); }
    catch (e) { alert("Failed to delete"); }
  };

  return (
    <div>
      <AdminHero icon={HelpCircle} title="FAQ Management" subtitle={`Manage ${faqs.length} frequently asked questions.`}
        gradient="linear-gradient(135deg,var(--primary),#2f2793)" />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>All FAQs</div>
        <button onClick={openNew} className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "9px 18px", fontSize: 13 }}><Plus size={15} /> Add FAQ</button>
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 540, maxWidth: "90vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{editing ? "Edit FAQ" : "Add FAQ"}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Question</label>
                <input name="question" value={form.question} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Answer</label>
                <textarea name="answer" value={form.answer} onChange={handleChange} rows={5} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none", resize: "vertical" }} />
              </div>
              <div style={{ width: 120 }}>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Order</label>
                <input name="order_index" type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #E4E1DA", background: "transparent", fontSize: 14, fontFamily: "inherit", cursor: "pointer" }}>Cancel</button>
              <button onClick={save} className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "10px 20px", fontSize: 14 }}><Check size={16} /> Save</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, overflow: "hidden" }}>
        {faqs.map((f, i) => (
          <div key={f.id} style={{ borderBottom: i < faqs.length - 1 ? "1px solid #E4E1DA" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: 16, gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{f.question}</div>
                <div style={{ fontSize: 13, color: "#5B6172", lineHeight: 1.6 }}>{f.answer}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 8 }}>Order: {f.order_index}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button onClick={() => openEdit(f)} style={{ background: "none", border: "1px solid #E4E1DA", borderRadius: 8, cursor: "pointer", color: "var(--primary)", padding: "4px 10px", fontSize: 12, fontFamily: "inherit" }}><Edit3 size={13} /></button>
                <button onClick={() => remove(f.id)} style={{ background: "none", border: "1px solid #E4E1DA", borderRadius: 8, cursor: "pointer", color: "#c0392b", padding: "4px 10px", fontSize: 12, fontFamily: "inherit" }}><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
