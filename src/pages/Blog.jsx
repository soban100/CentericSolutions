import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, ChevronRight } from "lucide-react";
import Reveal from "../components/Reveal";
import HeroCarousel from "../components/HeroCarousel";
import { api } from "../api";

const TAG_STYLE_MAP = {
  indigo: { background: "#e7e4fc", color: "var(--primary)" },
  emerald: { background: "#dff5ec", color: "var(--secondary)" },
  gold: { background: "#fbf0d9", color: "#9c7519" },
  rose: { background: "#fce4e4", color: "#c0392b" },
};

export default function Blog() {
  const [heroes, setHeroes] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTag, setActiveTag] = useState("All");

  useEffect(() => {
    Promise.all([api.getHeroes(), api.getPublishedBlogPosts()])
      .then(([h, p]) => { setHeroes(h); setPosts(p); })
      .catch(() => {});
  }, []);

  const blogHero = heroes.find((h) => h.id === "blog");

  const TAGS = ["All", ...new Set(posts.map((p) => p.tag))];
  const filtered = activeTag === "All" ? posts : posts.filter((p) => p.tag === activeTag);

  const tagColorMap = (color) => TAG_STYLE_MAP[color] || TAG_STYLE_MAP.indigo;
  const accentColor = (color) => color === "indigo" ? "var(--primary)" : color === "emerald" ? "var(--secondary)" : "var(--accent)";

  return (
    <>
      <HeroCarousel pageHero={blogHero} />

      <section style={{ background: "#fff", borderBottom: "1px solid #E4E1DA", padding: "20px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                padding: "7px 18px", borderRadius: 999, border: "1px solid", cursor: "pointer", fontSize: 13, fontWeight: 600,
                fontFamily: "'JetBrains Mono',monospace", transition: "background .18s ease, color .18s ease",
                background: activeTag === tag ? "#0C1524" : "transparent",
                color: activeTag === tag ? "#fff" : "#5B6172",
                borderColor: activeTag === tag ? "#0C1524" : "#E4E1DA",
              }}
            >
              {tag}
            </button>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 13, color: "#9CA3AF", alignSelf: "center" }}>
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          </span>
        </div>
      </section>

      <section style={{ padding: "60px 0 104px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26 }}>
            {filtered.map((post) => (
              <Reveal key={post.title}>
                <div className="course-card" style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: 10, background: accentColor(post.tag_color) }} />
                  <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, padding: "3px 8px", borderRadius: 999, fontWeight: 600, ...tagColorMap(post.tag_color) }}>
                        {post.tag}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#9CA3AF", fontSize: 12 }}>
                        <Clock size={12} /> {post.read_time}
                      </div>
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 10px", lineHeight: 1.3 }}>{post.title}</h3>
                    <p style={{ color: "#5B6172", fontSize: 14, lineHeight: 1.6, margin: "0 0 20px", flex: 1 }}>{post.excerpt}</p>
                    <div style={{ borderTop: "1px solid #E4E1DA", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#e7e4fc", display: "inline-block", flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 600 }}>{post.author}</div>
                          <div style={{ fontSize: 11, color: "#9CA3AF" }}>{post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</div>
                        </div>
                      </div>
                      <Link to={`/blog/${post.slug}`} style={{ color: "var(--primary)", fontWeight: 600, fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
                        Read <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 104px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ background: "linear-gradient(135deg,#0C1524,#1c2b47)", color: "#fff", textAlign: "center", borderRadius: 24, padding: "80px 28px" }}>
              <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, maxWidth: 520, margin: "0 auto 18px" }}>Want more content like this?</h2>
              <p style={{ color: "rgba(255,255,255,.65)", marginBottom: 30, maxWidth: 440, margin: "0 auto 30px", fontSize: 16 }}>
                Follow us on LinkedIn and YouTube for weekly insights from our instructors.
              </p>
              <a href="#" className="btn btn-primary" style={{ textDecoration: "none" }}>Follow Us <ArrowRight size={16} /></a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
