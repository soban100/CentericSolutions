import { useState, useEffect } from "react";
import { Trash2, Mail, Check, X, MessageSquare } from "lucide-react";
import { api } from "../../api";
import AdminHero from "./AdminHero";
import { BarChart } from "./Charts";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => { api.getMessages().then(setMessages).catch(() => {}); }, []);

  const remove = async (id) => {
    if (!confirm("Delete this message?")) return;
    try { await api.deleteMessage(id); setMessages(messages.filter((m) => m.id !== id)); if (selected?.id === id) setSelected(null); }
    catch (e) { alert("Failed to delete"); }
  };

  const toggleRead = async (msg) => {
    try {
      const updated = await api.updateMessage(msg.id, { ...msg, is_read: !msg.is_read });
      setMessages(messages.map((m) => (m.id === msg.id ? updated : m)));
      if (selected?.id === msg.id) setSelected(updated);
    } catch (e) { alert("Failed to update"); }
  };

  if (!messages.length) {
    return (
      <div>
        <AdminHero icon={Mail} title="Messages" subtitle="View messages from your contact form."
          gradient="linear-gradient(135deg,#c0392b,#7a1f1a)" />
        <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF", background: "#fff", borderRadius: 12, border: "1px solid #E4E1DA" }}>No messages yet.</div>
      </div>
    );
  }

  const unread = messages.filter((m) => !m.is_read).length;
  const monthCounts = {};
  messages.forEach((m) => {
    const d = new Date(m.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthCounts[key] = (monthCounts[key] || 0) + 1;
  });
  const chartData = Object.entries(monthCounts).sort().slice(-6).map(([label, value]) => ({ label: label.slice(5), value }));

  return (
    <div>
      <AdminHero icon={Mail} title="Messages" subtitle={`${unread} unread of ${messages.length} total messages.`}
        gradient="linear-gradient(135deg,#c0392b,#7a1f1a)" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#c0392b" }}>{messages.length}</div>
          <div style={{ fontSize: 13, color: "#5B6172", marginBottom: 4 }}>Total Messages</div>
          {chartData.length > 0 && <BarChart data={chartData} barColor="#c0392b" height={70} />}
        </div>
        <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "var(--accent)" }}>{unread}</div>
          <div style={{ fontSize: 13, color: "#5B6172" }}>Unread Messages</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 20 }}>
        <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#F6F4F0", textAlign: "left" }}>
                <th style={{ padding: "10px 14px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>STATUS</th>
                <th style={{ padding: "10px 14px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>NAME</th>
                <th style={{ padding: "10px 14px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>EMAIL</th>
                <th style={{ padding: "10px 14px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>SUBJECT</th>
                <th style={{ padding: "10px 14px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>DATE</th>
                <th style={{ padding: "10px 14px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id} style={{ borderTop: "1px solid #E4E1DA", cursor: "pointer", background: selected?.id === msg.id ? "#FAF8F4" : undefined }}
                  onClick={() => setSelected(msg)}>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: msg.is_read ? "#E4E1DA" : "var(--primary)" }} />
                  </td>
                  <td style={{ padding: "10px 14px", fontWeight: msg.is_read ? 400 : 600 }}>{msg.name}</td>
                  <td style={{ padding: "10px 14px", color: "#5B6172" }}>{msg.email}</td>
                  <td style={{ padding: "10px 14px" }}>{msg.subject}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#9CA3AF" }}>{new Date(msg.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={(e) => { e.stopPropagation(); toggleRead(msg); }} style={{ background: "none", border: "none", cursor: "pointer", color: msg.is_read ? "#9CA3AF" : "var(--accent)", padding: 4 }}>
                        {msg.is_read ? <X size={14} /> : <Check size={14} />}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); remove(msg.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", padding: 4 }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 24, position: "sticky", top: 100, alignSelf: "start", maxHeight: "75vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{selected.subject}</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={18} /></button>
            </div>
            <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #E4E1DA" }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{selected.name}</div>
              <div style={{ fontSize: 13, color: "#5B6172" }}>{selected.email}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{new Date(selected.created_at).toLocaleString()}</div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "#10162A", margin: 0 }}>{selected.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
