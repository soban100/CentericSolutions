import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function HeroCTA({ primary, secondary, align = "left", style, className }) {
  if (!primary && !secondary) return null;
  return (
    <div
      className={className}
      style={{
        display: "flex",
        gap: 14,
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        ...style,
      }}
    >
      {primary && (
        primary.href ? (
          <Link to={primary.href} className="btn btn-primary" style={{ textDecoration: "none" }}>
            {primary.text} <ArrowRight size={16} />
          </Link>
        ) : (
          <button className="btn btn-primary" onClick={primary.onClick} style={{ border: "none", fontFamily: "inherit", cursor: "pointer" }}>
            {primary.text} <ArrowRight size={16} />
          </button>
        )
      )}
      {secondary && (
        secondary.href ? (
          <Link to={secondary.href} className="btn btn-ghost" style={{ textDecoration: "none" }}>{secondary.text}</Link>
        ) : (
          <button className="btn btn-ghost" onClick={secondary.onClick} style={{ border: "none", fontFamily: "inherit", cursor: "pointer" }}>{secondary.text}</button>
        )
      )}
    </div>
  );
}
