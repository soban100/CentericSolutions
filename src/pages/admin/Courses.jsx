import { useState, useEffect, useRef } from "react";
import { Plus, Edit3, Trash2, X, Check, BookOpen, ChevronDown } from "lucide-react";
import { api } from "../../api";
import AdminHero from "./AdminHero";
import ImagePicker from "../../components/admin/ImagePicker";
import { BarChart, Doughnut } from "./Charts";

const emptyCourse = { slug: "", title: "", description: "", image_url: "", tag: "Web Development", tag_color: "indigo", gradient: "linear-gradient(135deg,var(--primary),#2f2793)", duration: "8 weeks", level: "Beginner", instructor: "", rating: 5, students: 0, is_featured: false };

const TAG_COLORS = { "Web Development": "indigo", "Artificial Intelligence": "emerald", "UI/UX Design": "gold", Marketing: "rose" };
const GRADIENTS = {
  indigo: "linear-gradient(135deg,var(--primary),#2f2793)",
  emerald: "linear-gradient(135deg,var(--secondary),#0a6b4e)",
  gold: "linear-gradient(135deg,var(--accent),#a97a1a)",
  rose: "linear-gradient(135deg,#E74C3C,#b03a2e)",
};

function StyledSelect({ value, options, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const [menuPos, setMenuPos] = useState({});

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (triggerRef.current && !triggerRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setMenuPos({ top: r.bottom + 4, left: r.left, width: r.width });
    }
  }, [open]);

  const items = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const selected = items.find((o) => o.value === value);

  return (
    <div style={{ position: "relative" }}>
      <div onClick={() => setOpen(!open)} ref={triggerRef}
        style={{
          padding: "10px 36px 10px 12px", borderRadius: 8, border: open ? "1px solid var(--primary)" : "1px solid #E4E1DA",
          fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none", boxSizing: "border-box",
          width: "100%", cursor: "pointer", color: value ? "#10162A" : "#9CA3AF", fontWeight: 500,
          userSelect: "none", transition: "border-color .2s, box-shadow .2s",
          boxShadow: open ? "0 0 0 3px rgba(91,79,229,.12)" : "none",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
        {selected ? selected.label : (placeholder || "Select")}
      </div>
      <ChevronDown size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9CA3AF", transition: "transform .25s", rotate: open ? "180deg" : "0deg" }} />
      {open && (
        <div style={{
          position: "fixed", ...menuPos, zIndex: 9999,
          background: "#fff", border: "1px solid #E4E1DA", borderRadius: 8, overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,.1)",
        }}>
          {items.map((o) => (
            <div key={o.value} onClick={() => { onChange(o.value); setOpen(false); }}
              style={{
                padding: "9px 14px", cursor: "pointer", fontSize: 14,
                background: o.value === value ? "#F6F4F0" : "transparent",
                color: "#10162A", fontWeight: o.value === value ? 600 : 400,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#F6F4F0"}
              onMouseLeave={(e) => e.currentTarget.style.background = o.value === value ? "#F6F4F0" : "transparent"}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function toSlug(str) {
  return str.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyCourse);

  useEffect(() => { api.getCourses().then(setCourses).catch(() => {}); }, []);
  useEffect(() => { api.getInstructors().then(setInstructors).catch(() => {}); }, []);

  const openNew = () => { setForm(emptyCourse); setEditing(null); setShowForm(true); };
  const openEdit = (c) => { setForm({ ...c }); setEditing(c.id); setShowForm(true); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    if (name === "tag") {
      updated.tag_color = TAG_COLORS[value] || "indigo";
      updated.gradient = GRADIENTS[updated.tag_color];
    }
    if (name === "title") updated.slug = toSlug(value);
    setForm(updated);
  };

  const save = async () => {
    if (!form.title || !form.description) return;
    try {
      if (editing) {
        const updated = await api.updateCourse(editing, form);
        setCourses(courses.map((c) => (c.id === editing ? updated : c)));
      } else {
        const created = await api.createCourse(form);
        setCourses([created, ...courses]);
      }
      setShowForm(false); setEditing(null);
    } catch (e) { alert("Failed to save course"); }
  };

  const remove = async (i, id) => {
    if (!confirm("Delete this course?")) return;
    try { await api.deleteCourse(id); setCourses(courses.filter((_, idx) => idx !== i)); }
    catch (e) { alert("Failed to delete"); }
  };

  const tagDist = Object.entries(TAG_COLORS).map(([tag]) => ({
    label: tag === "Web Development" ? "Web" : tag === "Artificial Intelligence" ? "AI" : tag === "UI/UX Design" ? "UI/UX" : "Mktg",
    value: courses.filter((c) => c.tag === tag).length,
  }));

  const totalStudents = courses.reduce((s, c) => s + (c.students || 0), 0);

  return (
    <div>
      <AdminHero icon={BookOpen} title="Course Management" subtitle={`Manage your catalog of ${courses.length} courses across ${Object.keys(TAG_COLORS).length} categories.`}
        gradient="linear-gradient(135deg,var(--primary),#2f2793)" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 28 }}>
        <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)" }}>{courses.length}</div>
          <div style={{ fontSize: 13, color: "#5B6172", marginBottom: 8 }}>Total Courses</div>
          <BarChart data={tagDist} barColor="var(--primary)" height={80} />
        </div>
        <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Doughnut value={Math.round((courses.filter((c) => c.level === "Beginner").length / (courses.length || 1)) * 100)} size={70} color="var(--secondary)" />
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>Beginner Friendly</div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>{courses.filter((c) => c.level === "Beginner").length} of {courses.length} courses</div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "var(--secondary)" }}>{totalStudents.toLocaleString()}+</div>
          <div style={{ fontSize: 13, color: "#5B6172" }}>Total Enrolled Students</div>
          <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {courses.map((c) => (
              <span key={c.id || c.title} style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: "#F6F4F0", color: "#5B6172" }}>{c.students || 0}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>All Courses</div>
        <button onClick={openNew} className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "9px 18px", fontSize: 13 }}>
          <Plus size={15} /> Add Course
        </button>
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 600, maxWidth: "90vw", maxHeight: "85vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{editing ? "Edit Course" : "Add Course"}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <ImagePicker value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} label="Course Image" height={160} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Title</label>
                  <input name="title" value={form.title} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Slug</label>
                  <input name="slug" value={form.slug} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none", color: "#9CA3AF" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none", resize: "vertical" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Category</label>
                  <StyledSelect value={form.tag} options={Object.keys(TAG_COLORS)} onChange={(val) => {
                    const tc = TAG_COLORS[val] || "indigo";
                    setForm({ ...form, tag: val, tag_color: tc, gradient: GRADIENTS[tc] });
                  }} placeholder="Select category" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Level</label>
                  <StyledSelect value={form.level} options={["Beginner", "Intermediate", "Advanced"]} onChange={(val) => setForm({ ...form, level: val })} placeholder="Select level" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Duration</label>
                  <input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 8 weeks" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Instructor</label>
                  <StyledSelect value={form.instructor} options={instructors.map((inst) => ({ value: inst.name, label: inst.name }))} onChange={(val) => setForm({ ...form, instructor: val })} placeholder="Select instructor" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Rating</label>
                  <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Students</label>
                  <input name="students" type="number" value={form.students} onChange={(e) => setForm({ ...form, students: parseInt(e.target.value) || 0 })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#10162A" }}>
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} style={{ width: 18, height: 18, accentColor: "var(--primary)", cursor: "pointer" }} />
                  Featured on homepage
                </label>
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
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#F6F4F0", textAlign: "left" }}>
              <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>IMAGE</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>TITLE</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>CATEGORY</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>INSTRUCTOR</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>DURATION</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>LEVEL</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>FEATURED</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={c.id} style={{ borderTop: "1px solid #E4E1DA" }}>
                <td style={{ padding: "8px 16px" }}>
                  <div style={{ width: 44, height: 32, borderRadius: 6, background: c.image_url ? `center / cover url("${c.image_url}")` : c.gradient, overflow: "hidden" }} />
                </td>
                <td style={{ padding: "12px 16px", fontWeight: 600 }}>{c.title}</td>
                <td style={{ padding: "12px 16px" }}>{c.tag}</td>
                <td style={{ padding: "12px 16px" }}>{c.instructor}</td>
                <td style={{ padding: "12px 16px" }}>{c.duration}</td>
                <td style={{ padding: "12px 16px" }}>{c.level}</td>
                <td style={{ padding: "12px 16px" }}>
                  {c.is_featured ? <span style={{ color: "var(--secondary)", fontWeight: 700, fontSize: 13 }}>★</span> : <span style={{ color: "#E4E1DA", fontSize: 13 }}>☆</span>}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => openEdit(c)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary)", padding: 4 }}><Edit3 size={15} /></button>
                    <button onClick={() => remove(i, c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", padding: 4 }}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
