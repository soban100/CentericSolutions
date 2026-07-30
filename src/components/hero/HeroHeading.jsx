import Reveal from "../Reveal";

const SIZE_STYLES = {
  xxlarge: { fontSize: "clamp(36px,5.2vw,60px)", lineHeight: 1.06, fontWeight: 800, letterSpacing: "-0.02em" },
  xlarge: { fontSize: "clamp(32px,4.6vw,52px)", lineHeight: 1.08, fontWeight: 800, letterSpacing: "-0.02em" },
  large: { fontSize: "clamp(28px,3.8vw,44px)", lineHeight: 1.1, fontWeight: 700, letterSpacing: "-0.01em" },
};

export default function HeroHeading({ children, size = "xlarge", as: Tag = "h1", style, className, ...props }) {
  return (
    <Reveal>
      <Tag
        className={className}
        style={{
          margin: 0,
          maxWidth: size === "xxlarge" ? 640 : size === "xlarge" ? 620 : 580,
          wordBreak: "break-word",
          overflowWrap: "break-word",
          hyphens: "auto",
          ...SIZE_STYLES[size],
          ...style,
        }}
        dangerouslySetInnerHTML={typeof children === "string" ? { __html: children } : undefined}
        {...props}
      >
        {typeof children !== "string" ? children : undefined}
      </Tag>
    </Reveal>
  );
}
