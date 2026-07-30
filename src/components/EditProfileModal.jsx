import { useState } from "react";
import { X } from "lucide-react";

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #E4E1DA",
  fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none",
  boxSizing: "border-box",
};

export default function EditProfileModal({ user, onSave, onClose }) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    degree: user.degree || "",
    college: user.college || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err.message.includes("409") ? "Email already in use" : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.5)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 32, maxWidth: 440, width: "100%",
        position: "relative",
      }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: "absolute", top: 14, right: 14, border: "none", background: "none",
          cursor: "pointer", color: "#5B6172",
        }}><X size={20} /></button>
        <h3 style={{ margin: "0 0 4px", fontSize: 20 }}>Edit Profile</h3>
        <p style={{ color: "#5B6172", fontSize: 13.5, margin: "0 0 22px" }}>Update your personal information</p>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {error && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fce4e4", color: "#c0392b", fontSize: 13, fontWeight: 600 }}>{error}</div>
          )}
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 5, color: "#10162A" }}>Full name</label>
            <input required name="name" value={form.name} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 5, color: "#10162A" }}>Email</label>
            <input required name="email" type="email" value={form.email} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 5, color: "#10162A" }}>Phone</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+1 234 567 890" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 5, color: "#10162A" }}>Degree / School</label>
            <input name="degree" value={form.degree} onChange={handleChange} placeholder="e.g. Bachelor of Science" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 5, color: "#10162A" }}>College / Institution</label>
            <input name="college" value={form.college} onChange={handleChange} placeholder="e.g. University of Example" style={inputStyle} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{
              padding: "10px 20px", borderRadius: 8, border: "1px solid #E4E1DA",
              background: "transparent", fontSize: 14, fontFamily: "inherit", cursor: "pointer", color: "#5B6172",
            }}>Cancel</button>
            <button type="submit" disabled={loading} style={{
              padding: "10px 20px", borderRadius: 8, border: "none",
              background: "var(--primary)", fontSize: 14, fontFamily: "inherit", cursor: "pointer", color: "#fff", fontWeight: 600,
              opacity: loading ? 0.6 : 1,
            }}>{loading ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
