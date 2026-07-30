import { isNewCourse } from "../utils/isNewCourse";

export default function NewBadge({ course, style }) {
  if (!isNewCourse(course)) return null;
  return (
    <span style={{
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 10,
      fontWeight: 700,
      padding: "3px 8px",
      borderRadius: 999,
      background: "var(--secondary)",
      color: "#fff",
      textTransform: "uppercase",
      letterSpacing: ".04em",
      ...style,
    }}>
      New Arrival
    </span>
  );
}
