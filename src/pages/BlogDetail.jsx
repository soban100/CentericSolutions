import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, ChevronRight, ArrowRight } from "lucide-react";
import Reveal from "../components/Reveal";
import { api } from "../api";

const TAG_STYLE_MAP = {
  indigo: { background: "#e7e4fc", color: "var(--primary)" },
  emerald: { background: "#dff5ec", color: "var(--secondary)" },
  gold: { background: "#fbf0d9", color: "#9c7519" },
  rose: { background: "#fce4e4", color: "#c0392b" },
};

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getBlogPost(slug), api.getPublishedBlogPosts()])
      .then(([p, all]) => { setPost(p); setAllPosts(all); })
      .catch(() => { setPost(null); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div style={{ marginTop: 83, padding: "80px 28px", textAlign: "center", color: "#9CA3AF" }}>Loading...</div>;
  if (!post) return (
    <div style={{ marginTop: 83, padding: "80px 28px", textAlign: "center" }}>
      <h2>Post not found</h2>
      <Link to="/blog" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>← Back to Blog</Link>
    </div>
  );

  const tagStyle = TAG_STYLE_MAP[post.tag_color] || TAG_STYLE_MAP.indigo;
  const published = post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";
  const related = allPosts.filter((p) => p.tag === post.tag && p.slug !== slug).slice(0, 3);

  return (
    <div style={{ marginTop: 83 }}>
      <section style={{ background: "#0C1524", color: "#fff", padding: "80px 0 60px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 28px" }}>
          <Link to="/blog" style={{ color: "rgba(255,255,255,.6)", textDecoration: "none", fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 28 }}>
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, padding: "4px 10px", borderRadius: 999, fontWeight: 600, ...tagStyle }}>{post.tag}</span>
          </div>
          <h1 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, margin: "0 0 20px", lineHeight: 1.2 }}>{post.title}</h1>
          <div style={{ display: "flex", gap: 20, fontSize: 13, color: "rgba(255,255,255,.6)", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><User size={14} /> {post.author}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Calendar size={14} /> {published}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Clock size={14} /> {post.read_time}</span>
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0 80px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 50 }}>
          <article>
            {post.image_url && (
              <img src={post.image_url} alt={post.title} style={{
                width: "100%", maxWidth: 400, aspectRatio: "1 / 1", borderRadius: 14, marginBottom: 32,
                objectFit: "cover", display: "block",
                marginLeft: post.image_placement === "left" ? "0" : post.image_placement === "right" ? "auto" : "auto",
                marginRight: post.image_placement === "right" ? "0" : post.image_placement === "left" ? "auto" : "auto",
              }} />
            )}
            <Reveal>
              <div style={{ fontSize: 16, lineHeight: 1.75, color: "#2c2c2c" }} dangerouslySetInnerHTML={{ __html: post.content }} />
            </Reveal>
          </article>

          <aside style={{ position: "sticky", top: 100, alignSelf: "start" }}>
            <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 14, padding: 24 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: 1, color: "#9CA3AF" }}>Article Info</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Author</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{post.author}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Published</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{published}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Read Time</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{post.read_time}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Category</div>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, padding: "3px 8px", borderRadius: 999, fontWeight: 600, ...tagStyle }}>{post.tag}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ padding: "0 0 80px" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
            <Reveal>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>Related Articles</h2>
              <p style={{ color: "#5B6172", fontSize: 14, margin: "0 0 28px" }}>More articles in {post.tag}</p>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26 }}>
              {related.map((p) => (
                <Reveal key={p.slug}>
                  <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <div style={{ height: 6, background: TAG_STYLE_MAP[p.tag_color]?.color || "var(--primary)" }} />
                    <div style={{ padding: 22 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, padding: "2px 7px", borderRadius: 999, fontWeight: 600, ...TAG_STYLE_MAP[p.tag_color] || TAG_STYLE_MAP.indigo }}>{p.tag}</span>
                        <span style={{ fontSize: 11, color: "#9CA3AF" }}>{p.read_time}</span>
                      </div>
                      <h4 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.3 }}>{p.title}</h4>
                      <p style={{ color: "#5B6172", fontSize: 13, lineHeight: 1.5, margin: "0 0 14px" }}>{p.excerpt}</p>
                      <Link to={`/blog/${p.slug}`} style={{ color: "var(--primary)", fontWeight: 600, fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
                        Read <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: "0 0 104px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ background: "linear-gradient(135deg,#0C1524,#1c2b47)", color: "#fff", textAlign: "center", borderRadius: 24, padding: "80px 28px" }}>
              <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, maxWidth: 520, margin: "0 auto 18px" }}>Enjoyed this article?</h2>
              <p style={{ color: "rgba(255,255,255,.65)", marginBottom: 30, maxWidth: 440, margin: "0 auto 30px", fontSize: 16 }}>
                Follow us on LinkedIn and YouTube for weekly insights from our instructors.
              </p>
              <Link to="/blog" className="btn btn-primary" style={{ textDecoration: "none" }}>More Articles <ArrowRight size={16} /></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
