import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Plus, Edit3, Trash2, X, Check, Globe, Palette, Share2, BookOpen, TrendingUp, Shield } from "lucide-react";
import { api } from "../../api";
import AdminHero from "./AdminHero";

const COLOR_KEYS = ["primary_color", "secondary_color", "accent_color"];

const DISPLAY_NAMES = {
  site_name: "Site Name",
  site_tagline: "Tagline",
  site_logo: "Logo URL",
  site_favicon: "Favicon URL",
  meta_title: "Default Title",
  meta_description: "Default Description",
  meta_keywords: "Keywords",
  primary_color: "Primary Color",
  secondary_color: "Secondary Color",
  accent_color: "Accent Color",
  footer_email: "General Email",
  footer_phone: "General Phone",
  footer_tagline: "Footer Tagline",
  footer_copyright: "Copyright Text",
  social_facebook: "Facebook URL",
  social_twitter: "Twitter URL",
  social_linkedin: "LinkedIn URL",
  social_instagram: "Instagram URL",
  social_youtube: "YouTube URL",
  trustbar_students: "Students Count",
  trustbar_courses: "Courses Count",
  trustbar_completion: "Completion Rate",
  enable_blog: "Enable Blog",
  enable_testimonials: "Enable Testimonials",
  enable_courses: "Enable Courses",
  enable_contact_form: "Enable Contact Form",
  google_analytics_id: "Google Analytics ID",
  facebook_pixel_id: "Facebook Pixel ID",
  admin_email: "Admin Email",
  admin_phone: "Admin Phone",
};

const GROUPS = [
  { label: "Site Info", icon: Globe, prefix: "site_", keys: ["site_name", "site_tagline", "site_logo", "site_favicon"] },
  { label: "SEO", icon: Shield, prefix: "meta_", keys: ["meta_title", "meta_description", "meta_keywords"] },
  { label: "Branding", icon: Palette, prefix: "", keys: ["primary_color", "secondary_color", "accent_color"] },
  { label: "Footer", icon: BookOpen, prefix: "footer_", keys: ["footer_email", "footer_phone", "footer_tagline", "footer_copyright"] },
  { label: "Social Links", icon: Share2, prefix: "social_", keys: ["social_facebook", "social_twitter", "social_linkedin", "social_instagram", "social_youtube"] },
  { label: "Trust Bar", icon: TrendingUp, prefix: "trustbar_", keys: ["trustbar_students", "trustbar_courses", "trustbar_completion"] },
  { label: "Features", icon: Shield, prefix: "enable_", keys: ["enable_blog", "enable_testimonials", "enable_courses", "enable_contact_form"] },
  { label: "Analytics", icon: Globe, prefix: "", keys: ["google_analytics_id", "facebook_pixel_id"] },
  { label: "Admin", icon: Shield, prefix: "admin_", keys: ["admin_email", "admin_phone"] },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ key: "", value: "" });

  const settingsMap = {};
  settings.forEach((s) => { settingsMap[s.key] = s; });

  useEffect(() => {
    api.getSettingsAll()
      .then(setSettings)
      .catch(() => setSettings([]))
      .finally(() => setLoading(false));
  }, []);

  const openNew = () => { setForm({ key: "", value: "" }); setEditing(null); setShowForm(true); };
  const openEdit = (s) => { setForm({ key: s.key, value: s.value }); setEditing(s.key); setShowForm(true); };

  const save = async () => {
    if (!form.key) return;
    try {
      if (editing) {
        await api.updateSetting(editing, { value: form.value });
        setSettings(settings.map((s) => (s.key === editing ? { ...s, value: form.value } : s)));
      } else {
        const created = await api.createSetting({ key: form.key, value: form.value });
        setSettings([...settings, created]);
      }
      setShowForm(false);
    } catch (e) {
      alert(e.message);
    }
  };

  const remove = async (key) => {
    if (!confirm(`Delete setting "${key}"?`)) return;
    try {
      await api.deleteSetting(key);
      setSettings(settings.filter((s) => s.key !== key));
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div>
      <AdminHero icon={SettingsIcon} title="Site Settings" subtitle="Manage all site-wide configuration values."
        gradient="linear-gradient(135deg,#0C1524,#1c2b47)" />

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button onClick={openNew} className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "10px 20px", fontSize: 14 }}>
          <Plus size={16} /> Add Custom Setting
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: "center", color: "#9CA3AF" }}>Loading...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {GROUPS.map((group) => {
            const groupSettings = group.keys.map((k) => settingsMap[k]).filter(Boolean);
            if (groupSettings.length === 0) return null;
            const GroupIcon = group.icon;
            return (
              <div key={group.label} style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", background: "#F6F4F0", borderBottom: "1px solid #E4E1DA", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: "#e7e4fc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <GroupIcon size={15} color="var(--primary)" />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{group.label}</span>
                  <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "'JetBrains Mono',monospace" }}>({groupSettings.length})</span>
                </div>
                <div style={{ padding: "4px 0" }}>
                  {groupSettings.map((s, i) => (
                    <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderTop: i > 0 ? "1px solid #E4E1DA" : "none" }}>
                      <div style={{ flex: "0 0 220px" }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#10162A" }}>{DISPLAY_NAMES[s.key] || s.key}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{s.key}</div>
                      </div>
                      <div style={{ flex: 1, color: "#5B6172", fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8 }}>
                        {COLOR_KEYS.includes(s.key) && s.value ? (
                          <span style={{ width: 20, height: 20, borderRadius: 4, background: s.value, border: "1px solid #E4E1DA", display: "inline-block", flexShrink: 0 }} />
                        ) : null}
                        {s.value || <span style={{ color: "#D1D5DB", fontStyle: "italic" }}>empty</span>}
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button onClick={() => openEdit(s)} style={{ background: "#F6F4F0", border: "none", cursor: "pointer", padding: "6px 10px", borderRadius: 6, color: "var(--primary)", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>Edit</button>
                        <button onClick={() => remove(s.key)} style={{ background: "#F6F4F0", border: "none", cursor: "pointer", padding: "6px 10px", borderRadius: 6, color: "#c0392b", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", background: "#F6F4F0", borderBottom: "1px solid #E4E1DA", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "#fce4e4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <SettingsIcon size={15} color="#c0392b" />
              </div>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Other</span>
              <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "'JetBrains Mono',monospace" }}>({settings.filter((s) => !GROUPS.some((g) => g.keys.includes(s.key))).length})</span>
            </div>
            <div style={{ padding: "4px 0" }}>
              {settings.filter((s) => !GROUPS.some((g) => g.keys.includes(s.key))).map((s, i, arr) => (
                <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderTop: i > 0 ? "1px solid #E4E1DA" : "none" }}>
                  <div style={{ flex: "0 0 220px" }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#10162A", fontFamily: "'JetBrains Mono',monospace" }}>{s.key}</div>
                  </div>
                  <div style={{ flex: 1, color: "#5B6172", fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.value || <span style={{ color: "#D1D5DB", fontStyle: "italic" }}>empty</span>}</div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => openEdit(s)} style={{ background: "#F6F4F0", border: "none", cursor: "pointer", padding: "6px 10px", borderRadius: 6, color: "var(--primary)", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>Edit</button>
                    <button onClick={() => remove(s.key)} style={{ background: "#F6F4F0", border: "none", cursor: "pointer", padding: "6px 10px", borderRadius: 6, color: "#c0392b", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
              {settings.filter((s) => !GROUPS.some((g) => g.keys.includes(s.key))).length === 0 && (
                <div style={{ padding: "16px 20px", color: "#9CA3AF", fontSize: 13 }}>No uncategorized settings.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 460, maxWidth: "90vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{editing ? "Edit Setting" : "Add Setting"}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Key</label>
                <input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })}
                  disabled={!!editing}
                  placeholder="e.g. site_name"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "'JetBrains Mono',monospace", background: editing ? "#F6F4F0" : "#fff", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Value</label>
                {COLOR_KEYS.includes(form.key) ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input type="color" value={form.value || "#000000"} onChange={(e) => setForm({ ...form, value: e.target.value })}
                      style={{ width: 48, height: 48, borderRadius: 8, border: "1px solid #E4E1DA", padding: 2, cursor: "pointer", background: "#F6F4F0" }} />
                    <input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })}
                      placeholder="var(--primary)"
                      style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "'JetBrains Mono',monospace", background: "#F6F4F0", outline: "none" }} />
                  </div>
                ) : (
                  <textarea value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} rows={3}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none", resize: "vertical" }} />
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #E4E1DA", background: "transparent", fontSize: 14, fontFamily: "inherit", cursor: "pointer" }}>Cancel</button>
              <button onClick={save} className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "10px 20px", fontSize: 14 }}><Check size={16} /> {editing ? "Update" : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
