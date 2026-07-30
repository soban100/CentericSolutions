import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, X, Check, Info, Users, Target } from "lucide-react";
import { api } from "../../api";
import AdminHero from "./AdminHero";
import ImagePicker from "../../components/admin/ImagePicker";

const emptyValue = { title: "", body: "" };
const emptyTeam = { name: "", role: "", bio: "", image_url: "" };

function AboutSection({ label, items, onEdit, onDelete, onAdd, icon: Icon, gradient }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 24, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon size={18} color={gradient.split(",")[0].replace("linear-gradient(135deg,", "")} /> {label}
        </h3>
        <button onClick={onAdd} style={{ background: "none", border: "1px solid #E4E1DA", borderRadius: 8, cursor: "pointer", padding: "6px 12px", fontSize: 12, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}><Plus size={13} /> Add</button>
      </div>
      {items.length === 0 && <div style={{ color: "#9CA3AF", fontSize: 13 }}>No items yet.</div>}
      {items.map((item, i) => (
        <div key={item.id ?? i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 0", borderBottom: i < items.length - 1 ? "1px solid #E4E1DA" : "none" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{item.title || item.name}</div>
            <div style={{ fontSize: 12.5, color: "#5B6172" }}>{(item.body || item.role || "").slice(0, 80)}</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => onEdit(item)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary)", padding: 4 }}><Edit3 size={14} /></button>
            <button onClick={() => onDelete(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", padding: 4 }}><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminAbout() {
  const [about, setAbout] = useState(null);
  const [values, setValues] = useState([]);
  const [team, setTeam] = useState([]);

  const [showAboutForm, setShowAboutForm] = useState(false);
  const [aboutForm, setAboutForm] = useState({ mission_title: "", mission_body: "", vision_title: "", vision_body: "" });

  const [showValueForm, setShowValueForm] = useState(false);
  const [editingValue, setEditingValue] = useState(null);
  const [valueForm, setValueForm] = useState(emptyValue);

  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamForm, setTeamForm] = useState(emptyTeam);

  useEffect(() => {
    api.getAbout().then((d) => {
      setAbout(d);
      if (d?.mission) setAboutForm({ mission_title: d.mission.title || "", mission_body: d.mission.body || "", vision_title: d.vision.title || "", vision_body: d.vision.body || "" });
    }).catch(() => {});
    api.getAboutValues().then(setValues).catch(() => {});
    api.getAboutTeam().then(setTeam).catch(() => {});
  }, []);

  const saveAbout = async () => {
    try {
      const data = { mission: { title: aboutForm.mission_title, body: aboutForm.mission_body }, vision: { title: aboutForm.vision_title, body: aboutForm.vision_body } };
      await api.updateAbout(data);
      setAbout(data);
      setShowAboutForm(false);
    } catch (e) { alert("Failed to save about"); }
  };

  const openNewValue = () => { setValueForm(emptyValue); setEditingValue(null); setShowValueForm(true); };
  const openEditValue = (v) => { setValueForm({ title: v.title, body: v.body }); setEditingValue(v.id); setShowValueForm(true); };

  const saveValue = async () => {
    if (!valueForm.title) return;
    try {
      if (editingValue) {
        const updated = await api.updateAboutValue(editingValue, valueForm);
        setValues(values.map((v) => (v.id === editingValue ? updated : v)));
      } else {
        const created = await api.createAboutValue(valueForm);
        setValues([...values, created]);
      }
      setShowValueForm(false); setEditingValue(null);
    } catch (e) { alert("Failed to save value"); }
  };

  const deleteValue = async (id) => {
    if (!confirm("Delete this value?")) return;
    try { await api.deleteAboutValue(id); setValues(values.filter((v) => v.id !== id)); }
    catch (e) { alert("Failed to delete"); }
  };

  const openNewTeam = () => { setTeamForm(emptyTeam); setEditingTeam(null); setShowTeamForm(true); };
  const openEditTeam = (t) => { setTeamForm({ name: t.name, role: t.role, bio: t.bio, image_url: t.image_url }); setEditingTeam(t.id); setShowTeamForm(true); };

  const saveTeam = async () => {
    if (!teamForm.name) return;
    try {
      if (editingTeam) {
        const updated = await api.updateAboutTeam(editingTeam, teamForm);
        setTeam(team.map((t) => (t.id === editingTeam ? updated : t)));
      } else {
        const created = await api.createAboutTeam(teamForm);
        setTeam([...team, created]);
      }
      setShowTeamForm(false); setEditingTeam(null);
    } catch (e) { alert("Failed to save team member"); }
  };

  const deleteTeam = async (id) => {
    if (!confirm("Delete this team member?")) return;
    try { await api.deleteAboutTeam(id); setTeam(team.filter((t) => t.id !== id)); }
    catch (e) { alert("Failed to delete"); }
  };

  return (
    <div>
      <AdminHero icon={Info} title="About Page" subtitle="Manage your About page content, core values, and team."
        gradient="linear-gradient(135deg,var(--primary),#2f2793)" />

      <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Mission & Vision</h3>
          <button onClick={() => setShowAboutForm(true)} style={{ background: "none", border: "1px solid #E4E1DA", borderRadius: 8, cursor: "pointer", padding: "6px 12px", fontSize: 12, fontFamily: "inherit" }}><Edit3 size={13} /> Edit</button>
        </div>
        {about ? (
          <div style={{ fontSize: 14 }}>
            <div style={{ marginBottom: 8 }}><strong>Mission Title:</strong> {about.mission?.title}</div>
            <div style={{ marginBottom: 8 }}><strong>Mission Body:</strong> {about.mission?.body}</div>
            <div style={{ marginBottom: 8 }}><strong>Vision Title:</strong> {about.vision?.title}</div>
            <div style={{ marginBottom: 8 }}><strong>Vision Body:</strong> {about.vision?.body}</div>
          </div>
        ) : <div style={{ color: "#9CA3AF", fontSize: 13 }}>No about content yet.</div>}
      </div>

      {showAboutForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 540, maxWidth: "90vw", maxHeight: "85vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Edit Mission & Vision</h2>
              <button onClick={() => setShowAboutForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Mission Title</label>
                <input value={aboutForm.mission_title} onChange={(e) => setAboutForm({ ...aboutForm, mission_title: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Mission Body</label>
                <textarea value={aboutForm.mission_body} onChange={(e) => setAboutForm({ ...aboutForm, mission_body: e.target.value })} rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none", resize: "vertical" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Vision Title</label>
                <input value={aboutForm.vision_title} onChange={(e) => setAboutForm({ ...aboutForm, vision_title: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Vision Body</label>
                <textarea value={aboutForm.vision_body} onChange={(e) => setAboutForm({ ...aboutForm, vision_body: e.target.value })} rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none", resize: "vertical" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button onClick={() => setShowAboutForm(false)} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #E4E1DA", background: "transparent", fontSize: 14, fontFamily: "inherit", cursor: "pointer" }}>Cancel</button>
              <button onClick={saveAbout} className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "10px 20px", fontSize: 14 }}><Check size={16} /> Save</button>
            </div>
          </div>
        </div>
      )}

      <AboutSection label="Core Values" items={values} icon={Target} gradient="linear-gradient(135deg,var(--secondary),#0a6b4e)"
        onEdit={openEditValue} onDelete={deleteValue} onAdd={openNewValue} />

      {showValueForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 460, maxWidth: "90vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{editingValue ? "Edit Value" : "Add Value"}</h2>
              <button onClick={() => setShowValueForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Title</label>
                <input value={valueForm.title} onChange={(e) => setValueForm({ ...valueForm, title: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Body</label>
                <textarea value={valueForm.body} onChange={(e) => setValueForm({ ...valueForm, body: e.target.value })} rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none", resize: "vertical" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button onClick={() => setShowValueForm(false)} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #E4E1DA", background: "transparent", fontSize: 14, fontFamily: "inherit", cursor: "pointer" }}>Cancel</button>
              <button onClick={saveValue} className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "10px 20px", fontSize: 14 }}><Check size={16} /> Save</button>
            </div>
          </div>
        </div>
      )}

      <AboutSection label="Team Members" items={team} icon={Users} gradient="linear-gradient(135deg,var(--accent),#a97a1a)"
        onEdit={openEditTeam} onDelete={deleteTeam} onAdd={openNewTeam} />

      {showTeamForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 540, maxWidth: "90vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{editingTeam ? "Edit Team Member" : "Add Team Member"}</h2>
              <button onClick={() => setShowTeamForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <ImagePicker value={teamForm.image_url} onChange={(v) => setTeamForm({ ...teamForm, image_url: v })} label="Photo" height={140} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Name</label>
                  <input value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Role</label>
                  <input value={teamForm.role} onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Bio</label>
                <textarea value={teamForm.bio} onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })} rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none", resize: "vertical" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button onClick={() => setShowTeamForm(false)} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #E4E1DA", background: "transparent", fontSize: 14, fontFamily: "inherit", cursor: "pointer" }}>Cancel</button>
              <button onClick={saveTeam} className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "10px 20px", fontSize: 14 }}><Check size={16} /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
