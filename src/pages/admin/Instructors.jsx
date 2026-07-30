import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, X, Check, Users, Star } from "lucide-react";
import { api } from "../../api";
import AdminHero from "./AdminHero";
import ImagePicker from "../../components/admin/ImagePicker";
import { BarChart } from "./Charts";

const emptyInstructor = { name: "", role: "", bio: "", image_url: "", specialty: "", tag_color: "indigo", gradient: "linear-gradient(135deg,var(--primary),#2f2793)", students: 0, course_count: 0, rating: 5, twitter_url: "", linkedin_url: "", github_url: "" };

export default function AdminInstructors() {
  const [instructors, setInstructors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyInstructor);

  useEffect(() => { api.getInstructors().then(setInstructors).catch(() => {}); }, []);

  const openNew = () => { setForm(emptyInstructor); setEditing(null); setShowForm(true); };
  const openEdit = (inst) => { setForm({ ...inst }); setEditing(inst.id); setShowForm(true); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    if (!form.name) return;
    try {
      if (editing) {
        const updated = await api.updateInstructor(editing, form);
        setInstructors(instructors.map((i) => (i.id === editing ? updated : i)));
      } else {
        const created = await api.createInstructor(form);
        setInstructors([created, ...instructors]);
      }
      setShowForm(false); setEditing(null);
    } catch (e) { alert("Failed to save"); }
  };

  const remove = async (i, id) => {
    if (!confirm("Delete this instructor?")) return;
    try { await api.deleteInstructor(id); setInstructors(instructors.filter((_, idx) => idx !== i)); }
    catch (e) { alert("Failed to delete"); }
  };

  const totalStudents = instructors.reduce((s, i) => s + i.students, 0);
  const avgRating = instructors.length ? (instructors.reduce((s, i) => s + i.rating, 0) / instructors.length).toFixed(2) : 0;
  const instrData = instructors.map((i) => ({ label: i.name.split(" ")[0], value: i.students }));

  return (
    <div>
      <AdminHero icon={Users} title="Instructor Management" subtitle={`Manage your team of ${instructors.length} instructors serving ${totalStudents.toLocaleString()}+ students.`}
        gradient="linear-gradient(135deg,var(--secondary),#0a6b4e)" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 28 }}>
        <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "var(--secondary)" }}>{instructors.length}</div>
          <div style={{ fontSize: 13, color: "#5B6172", marginBottom: 4 }}>Active Instructors</div>
          <BarChart data={instrData} barColor="var(--secondary)" height={80} />
        </div>
        <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "var(--secondary)" }}>{totalStudents.toLocaleString()}+</div>
          <div style={{ fontSize: 13, color: "#5B6172" }}>Total Students Taught</div>
          <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {instructors.map((i) => (
              <span key={i.id} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "#dff5ec", color: "var(--secondary)" }}>{i.name.split(" ")[0]}: {i.students}</span>
            ))}
          </div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Star size={20} fill="var(--accent)" color="var(--accent)" />
            <span style={{ fontSize: 28, fontWeight: 800, color: "var(--accent)" }}>{avgRating}</span>
          </div>
          <div style={{ fontSize: 13, color: "#5B6172" }}>Average Instructor Rating</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>All Instructors</div>
        <button onClick={openNew} className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "9px 18px", fontSize: 13 }}><Plus size={15} /> Add Instructor</button>
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 620, maxWidth: "90vw", maxHeight: "85vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{editing ? "Edit Instructor" : "Add Instructor"}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16, alignItems: "start" }}>
                <ImagePicker value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} label="Avatar" height={140} />
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Name</label>
                      <input name="name" value={form.name} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Role</label>
                      <input name="role" value={form.role} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Specialty</label>
                    <input name="specialty" value={form.specialty} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                  </div>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Bio</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none", resize: "vertical" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Students</label>
                  <input name="students" type="number" value={form.students} onChange={(e) => setForm({ ...form, students: parseInt(e.target.value) || 0 })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Courses</label>
                  <input name="course_count" type="number" value={form.course_count} onChange={(e) => setForm({ ...form, course_count: parseInt(e.target.value) || 0 })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Rating</label>
                  <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Social Links</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <input name="twitter_url" placeholder="Twitter URL" value={form.twitter_url} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                  <input name="linkedin_url" placeholder="LinkedIn URL" value={form.linkedin_url} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                  <input name="github_url" placeholder="GitHub URL" value={form.github_url} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {instructors.map((inst, i) => (
          <div key={inst.id} style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ height: 120, background: inst.gradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {inst.image_url ? (
                <img src={inst.image_url} alt={inst.name} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,.3)" }} />
              ) : (
                <span style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,.15)", display: "block" }} />
              )}
            </div>
            <div style={{ padding: 20, textAlign: "center" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 2px" }}>{inst.name}</h3>
              <div style={{ fontSize: 12.5, color: "#5B6172", marginBottom: 8 }}>{inst.role}</div>
              <p style={{ fontSize: 13, color: "#5B6172", lineHeight: 1.5, margin: "0 0 12px" }}>{inst.bio}</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, fontSize: 12, color: "#9CA3AF", fontFamily: "'JetBrains Mono',monospace", borderTop: "1px solid #E4E1DA", paddingTop: 12 }}>
                <span>{inst.students} students</span>
                <span>★ {inst.rating}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
                <button onClick={() => openEdit(inst)} style={{ background: "none", border: "1px solid #E4E1DA", borderRadius: 8, cursor: "pointer", color: "var(--primary)", padding: "6px 14px", fontSize: 12, fontFamily: "inherit" }}><Edit3 size={14} /> Edit</button>
                <button onClick={() => remove(i, inst.id)} style={{ background: "none", border: "1px solid #E4E1DA", borderRadius: 8, cursor: "pointer", color: "#c0392b", padding: "6px 14px", fontSize: 12, fontFamily: "inherit" }}><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
