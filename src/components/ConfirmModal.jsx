import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({ title, message, confirmLabel, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.5)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={onCancel}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 36, maxWidth: 380, width: "100%",
        textAlign: "center",
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#fce4e4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <AlertTriangle size={24} style={{ color: "#c0392b" }} />
        </div>
        <h3 style={{ margin: "0 0 6px", fontSize: 18 }}>{title}</h3>
        <p style={{ color: "#5B6172", fontSize: 14, margin: "0 0 24px", lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onCancel} style={{
            padding: "10px 22px", borderRadius: 8, border: "1px solid #E4E1DA",
            background: "transparent", fontSize: 14, fontFamily: "inherit", cursor: "pointer", color: "#5B6172",
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            padding: "10px 22px", borderRadius: 8, border: "none",
            background: "#c0392b", fontSize: 14, fontFamily: "inherit", cursor: "pointer", color: "#fff", fontWeight: 600,
          }}>{confirmLabel || "Confirm"}</button>
        </div>
      </div>
    </div>
  );
}
