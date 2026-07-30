const SIZE_STYLES = {
  medium: { fontSize: 17, color: "rgba(255,255,255,.7)", maxWidth: 560, lineHeight: 1.65 },
  large: { fontSize: 18, color: "rgba(255,255,255,.72)", maxWidth: 600, lineHeight: 1.6 },
};

export default function HeroSubtitle({ children, size = "medium", style, className, ...props }) {
  if (!children) return null;
  return (
    <p
      className={className}
      style={{
        margin: "22px 0 34px",
        wordBreak: "break-word",
        overflowWrap: "break-word",
        ...SIZE_STYLES[size],
        ...style,
      }}
      {...props}
    >
      {children}
    </p>
  );
}
