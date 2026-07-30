export default function AdminHero({ icon: Icon, title, subtitle, gradient = "linear-gradient(135deg,#0C1524,#1c2b47)" }) {
  return (
    <div style={{
      background: gradient,
      borderRadius: 16,
      padding: "32px 36px",
      marginBottom: 32,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      gap: 20,
    }}>
      {Icon && (
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "rgba(255,255,255,.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Icon size={26} />
        </div>
      )}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>{title}</h1>
        {subtitle && <p style={{ margin: 0, fontSize: 14.5, color: "rgba(255,255,255,.65)", lineHeight: 1.5 }}>{subtitle}</p>}
      </div>
    </div>
  );
}
