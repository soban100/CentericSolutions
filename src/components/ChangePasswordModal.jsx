import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #E4E1DA",
  fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none",
  boxSizing: "border-box",
};

export default function ChangePasswordModal({ onSave, onClose }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.newPassword !== form.confirmPassword) return setError("Passwords do not match");
    if (form.newPassword.length < 6) return setError("New password must be at least 6 characters");
    setLoading(true);
    try {
      await onSave({ currentPassword: form.currentPassword, newPassword: form.newPassword });
    } catch (err) {
      const msg = err.message.includes("401") ? "Current password is incorrect" : "Failed to change password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (field) => setShow((s) => ({ ...s, [field]: !s[field] }));

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.5)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 32, maxWidth: 420, width: "100%",
        position: "relative",
      }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: "absolute", top: 14, right: 14, border: "none", background: "none",
          cursor: "pointer", color: "#5B6172",
        }}><X size={20} /></button>
        <h3 style={{ margin: "0 0 4px", fontSize: 20 }}>Change Password</h3>
        <p style={{ color: "#5B6172", fontSize: 13.5, margin: "0 0 22px" }}>Enter your current password and a new one</p>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {error && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fce4e4", color: "#c0392b", fontSize: 13, fontWeight: 600 }}>{error}</div>
          )}
          {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
            <div key={field}>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 5, color: "#10162A" }}>
                {field === "currentPassword" ? "Current password" : field === "newPassword" ? "New password" : "Confirm new password"}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  required name={field}
                  type={show[field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm"] ? "text" : "password"}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field === "currentPassword" ? "Enter current password" : field === "newPassword" ? "Enter new password" : "Re-enter new password"}
                  style={{ ...inputStyle, paddingRight: 40 }}
                />
                <button type="button" onClick={() => toggle(field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0 }}>
                  {show[field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm"] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{
              padding: "10px 20px", borderRadius: 8, border: "1px solid #E4E1DA",
              background: "transparent", fontSize: 14, fontFamily: "inherit", cursor: "pointer", color: "#5B6172",
            }}>Cancel</button>
            <button type="submit" disabled={loading} style={{
              padding: "10px 20px", borderRadius: 8, border: "none",
              background: "var(--primary)", fontSize: 14, fontFamily: "inherit", cursor: "pointer", color: "#fff", fontWeight: 600,
              opacity: loading ? 0.6 : 1,
            }}>{loading ? "Changing..." : "Change Password"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
