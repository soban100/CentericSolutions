import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, X, Check, Users, BookOpen } from "lucide-react";
import { api } from "../../api";
import AdminHero from "./AdminHero";

const EMPTY_STUDENT = { name: "", email: "", password: "", phone: "", degree: "", college: "" };

const STATUS_COLORS = {
  pending: { bg: "#fbf0d9", color: "#9c7519" },
  contacted: { bg: "#dff5ec", color: "#0a6b4e" },
  enrolled: { bg: "#e7e4fc", color: "var(--primary)" },
  cancelled: { bg: "#fce4e4", color: "#c0392b" },
};

export default function AdminStudents() {
  const [tab, setTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_STUDENT);
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getStudents().catch(() => []),
      api.getEnrollments().catch(() => []),
    ]).then(([studentsData, enrolledData]) => {
      setStudents(studentsData);
      setEnrolled(enrolledData);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const openNew = () => { setForm(EMPTY_STUDENT); setEditing(null); setShowForm(true); };
  const openEdit = (s) => { setForm({ ...s, password: "" }); setEditing(s.id); setShowForm(true); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const saveStudent = async () => {
    if (!form.name || !form.email) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = await api.updateStudent(editing, form);
        setStudents(students.map((s) => (s.id === editing ? { ...s, ...updated } : s)));
      } else {
        const created = await api.createStudent(form);
        setStudents([created, ...students]);
      }
      setShowForm(false);
    } catch {
      alert("Failed to save student.");
    } finally {
      setSaving(false);
    }
  };

  const removeStudent = async (id) => {
    if (!confirm("Delete this student?")) return;
    try {
      await api.deleteStudent(id);
      setStudents(students.filter((s) => s.id !== id));
    } catch {
      alert("Failed to delete student.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const updated = await api.updateEnrollmentStatus(id, status);
      setEnrolled(enrolled.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    } catch {
      alert("Failed to update status.");
    }
  };

  const removeEnrolled = async (id) => {
    if (!confirm("Delete this enrollment?")) return;
    try {
      await api.deleteEnrollment(id);
      setEnrolled(enrolled.filter((e) => e.id !== id));
    } catch {
      alert("Failed to delete enrollment.");
    }
  };

  const totalActive = students.filter((s) => s.is_active !== false).length;
  const pendingEnrollments = enrolled.filter((e) => e.status === "pending").length;

  return (
    <div>
      <AdminHero icon={Users} title="Student Management"
        subtitle={`${totalActive} registered students · ${enrolled.length} enrollments · ${pendingEnrollments} pending`}
        gradient="linear-gradient(135deg,var(--secondary),#0a6b4e)" />

      <div style={{ display: "flex", gap: 0, marginBottom: 24, background: "#fff", borderRadius: 12, border: "1px solid #E4E1DA", overflow: "hidden" }}>
        <button onClick={() => { setTab("students"); setShowForm(false); }}
          style={{
            flex: 1, padding: "14px 20px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600,
            background: tab === "students" ? "#0C1524" : "transparent",
            color: tab === "students" ? "#fff" : "#5B6172",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
          <Users size={16} /> Registered Students ({students.length})
        </button>
        <button onClick={() => { setTab("enrolled"); setShowForm(false); }}
          style={{
            flex: 1, padding: "14px 20px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600,
            background: tab === "enrolled" ? "#0C1524" : "transparent",
            color: tab === "enrolled" ? "#fff" : "#5B6172",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
          <BookOpen size={16} /> Enrolled Students ({enrolled.length})
        </button>
      </div>

      {tab === "students" ? (
        <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E4E1DA", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F6F4F0" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>All Registered Students</span>
            <button onClick={openNew} className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "8px 16px", fontSize: 12.5 }}>
              <Plus size={14} /> Add Student
            </button>
          </div>

          {loading ? (
            <div style={{ padding: 60, textAlign: "center", color: "#9CA3AF" }}>Loading...</div>
          ) : students.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", color: "#9CA3AF" }}>
              <Users size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ margin: 0, fontSize: 15 }}>No registered students yet.</p>
              <p style={{ margin: "4px 0 0", fontSize: 13 }}>Students who sign up will appear here.</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#F6F4F0", textAlign: "left" }}>
                  <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>NAME</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>EMAIL</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>PHONE</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>DEGREE</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>COLLEGE</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>STATUS</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} style={{ borderTop: "1px solid #E4E1DA" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>{s.name}</td>
                    <td style={{ padding: "12px 16px", color: "#5B6172" }}>{s.email}</td>
                    <td style={{ padding: "12px 16px" }}>{s.phone || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>{s.degree || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>{s.college || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 999, fontWeight: 600, background: "#dff5ec", color: "#0a6b4e" }}>
                        {s.is_active !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => openEdit(s)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary)", padding: 4 }}><Edit3 size={15} /></button>
                        <button onClick={() => removeStudent(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", padding: 4 }}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E4E1DA", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F6F4F0" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>All Enrolled Students</span>
          </div>

          {loading ? (
            <div style={{ padding: 60, textAlign: "center", color: "#9CA3AF" }}>Loading...</div>
          ) : enrolled.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", color: "#9CA3AF" }}>
              <BookOpen size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ margin: 0, fontSize: 15 }}>No enrollment records yet.</p>
              <p style={{ margin: "4px 0 0", fontSize: 13 }}>Course enrollments from the public form will appear here.</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#F6F4F0", textAlign: "left" }}>
                  <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>NAME</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>EMAIL</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>COURSE</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>STATUS</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>DATE</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {enrolled.map((e) => (
                  <tr key={e.id} style={{ borderTop: "1px solid #E4E1DA" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>{e.name}</td>
                    <td style={{ padding: "12px 16px", color: "#5B6172" }}>{e.email}</td>
                    <td style={{ padding: "12px 16px" }}>{e.course_name}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <select value={e.status} onChange={(ev) => updateStatus(e.id, ev.target.value)}
                        style={{
                          fontSize: 12, padding: "3px 10px", borderRadius: 999, fontWeight: 600, fontFamily: "inherit",
                          border: "none", cursor: "pointer", outline: "none",
                          ...STATUS_COLORS[e.status] || STATUS_COLORS.pending,
                        }}>
                        {["pending", "contacted", "enrolled", "cancelled"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#9CA3AF", fontSize: 13 }}>
                      {e.created_at ? new Date(e.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => removeEnrolled(e.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", padding: 4 }}>
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 540, maxWidth: "90vw", maxHeight: "85vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                {editing ? "Edit Student" : "Add Student"}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={20} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Name</label>
                  <input name="name" value={form.name} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
              </div>
              {!editing && (
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Password</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Degree / School</label>
                  <input name="degree" value={form.degree} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>College / Institution</label>
                <input name="college" value={form.college} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #E4E1DA", background: "transparent", fontSize: 14, fontFamily: "inherit", cursor: "pointer" }}>Cancel</button>
              <button onClick={saveStudent} disabled={saving} className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "10px 20px", fontSize: 14, opacity: saving ? 0.6 : 1 }}>
                <Check size={16} /> {saving ? "Saving..." : editing ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
