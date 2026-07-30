export default function HeroImage({ src, alt = "", children, style, className }) {
  if (!src && !children) return null;
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        ...style,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: 400,
            objectFit: "contain",
            borderRadius: 12,
          }}
        />
      ) : (
        children
      )}
    </div>
  );
}
