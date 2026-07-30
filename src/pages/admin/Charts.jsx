export function BarChart({ data = [], height = 140, barColor = "var(--primary)" }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const w = Math.max(20, Math.floor(240 / data.length) - 8);
  return (
    <svg width="100%" height={height} viewBox={`0 0 260 ${height}`} style={{ display: "block" }}>
      {data.map((d, i) => {
        const barH = (d.value / max) * (height - 24);
        const x = 12 + i * (w + 8);
        const y = height - 12 - barH;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={w} height={barH} rx={4} fill={barColor} opacity={0.85}>
              <title>{d.label}: {d.value}</title>
            </rect>
            <text x={x + w / 2} y={height - 2} textAnchor="middle" fontSize="9" fill="#9CA3AF" fontFamily="'JetBrains Mono',monospace">
              {d.label.slice(0, 3)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function MiniTrend({ percent = 0, color = "var(--secondary)" }) {
  const up = percent >= 0;
  const abs = Math.min(Math.abs(percent), 100);
  const h = 40;
  const points = Array.from({ length: 20 }, (_, i) => {
    const x = (i / 19) * 100;
    const noise = Math.sin(i * 0.8 + 1) * 0.3 + Math.cos(i * 0.3) * 0.2;
    const trend = (i / 19) * (abs / 100);
    return `${x},${h - (trend + noise * 0.15) * h}`;
  }).join(" ");
  return (
    <svg width="100%" height={h + 8} viewBox={`0 0 100 ${h + 8}`}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
    </svg>
  );
}

export function Doughnut({ value = 75, size = 80, color = "var(--primary)" }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E4E1DA" strokeWidth="6" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x={size / 2} y={size / 2 + 3} textAnchor="middle" fontSize="13" fontWeight="700" fill={color} fontFamily="'JetBrains Mono',monospace">
        {value}%
      </text>
    </svg>
  );
}

export function StatCard({ icon: Icon, label, value, sub, chart, color = "var(--primary)", bg = "#e7e4fc" }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 0, overflow: "hidden",
    }}>
      <div style={{ padding: "20px 22px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: bg, color, flexShrink: 0 }}>
          <Icon size={20} />
        </div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.1 }}>{value}</div>
          <div style={{ fontSize: 12.5, color: "#5B6172" }}>{label}</div>
          {sub && <div style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 2 }}>{sub}</div>}
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          {chart}
        </div>
      </div>
    </div>
  );
}
