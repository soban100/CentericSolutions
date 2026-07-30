import { useState, useEffect, useMemo, useRef } from "react";
import { Plus, Edit3, Trash2, X, Check, FileText, Calendar, Bold, Italic, Heading, Type, Palette } from "lucide-react";
import { api } from "../../api";
import AdminHero from "./AdminHero";
import ImagePicker from "../../components/admin/ImagePicker";
import { BarChart } from "./Charts";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const emptyPost = { title: "", slug: "", tag: "Learning", tag_color: "indigo", author: "", published_at: "", read_time: "5 min", content: "", excerpt: "", image_url: "", image_placement: "center", is_published: false };

function parseMonth(dateStr) {
  if (!dateStr) return -1;
  const d = new Date(dateStr);
  return d.getMonth();
}

function monthCountsFromPosts(posts) {
  const counts = {};
  posts.forEach((p) => { const m = parseMonth(p.published_at); if (m >= 0) counts[m] = (counts[m] || 0) + 1; });
  return MONTHS.map((label, i) => ({ label, value: counts[i] || 0 }));
}

function currentMonthArticles(posts) {
  const cur = new Date().getMonth();
  return posts.filter((p) => parseMonth(p.published_at) === cur).length;
}

function toSlug(str) { return str.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

const btnStyle = {
  width: 30, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center",
  border: "1px solid #E4E1DA", borderRadius: 4, background: "#F6F4F0", cursor: "pointer",
  color: "#10162A", transition: "background .15s",
};

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPost);
  const contentRef = useRef(null);
  useEffect(() => { api.getBlogPosts().then(setPosts).catch(() => {}); }, []);

  const openNew = () => { setForm(emptyPost); setEditing(null); setShowForm(true); };
  const openEdit = (p) => {
    const pub = p.published_at ? p.published_at.split("T")[0] : "";
    setForm({ ...p, published_at: pub });
    setEditing(p.id);
    setShowForm(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    if (name === "title") updated.slug = toSlug(value);
    setForm(updated);
  };

  const wrapContent = (openTag, closeTag) => {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = form.content;
    const selected = text.substring(start, end);
    const wrapped = selected ? `${openTag}${selected}${closeTag}` : `${openTag}${closeTag}`;
    const updated = text.substring(0, start) + wrapped + text.substring(end);
    setForm({ ...form, content: updated });
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(start + openTag.length, start + openTag.length); });
  };

  const wrapColor = (c) => {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = form.content;
    const selected = text.substring(start, end);
    if (!selected) return;
    const tag = `<span style="color:${c}">`;
    const wrapped = `${tag}${selected}</span>`;
    const updated = text.substring(0, start) + wrapped + text.substring(end);
    setForm({ ...form, content: updated });
  };

  const save = async () => {
    if (!form.title || !form.author) return;
    try {
      if (editing) {
        const updated = await api.updateBlogPost(editing, form);
        setPosts(posts.map((p) => (p.id === editing ? updated : p)));
      } else {
        const created = await api.createBlogPost(form);
        setPosts([created, ...posts]);
      }
      setShowForm(false); setEditing(null);
    } catch (e) { alert("Failed to save"); }
  };

  const remove = async (i, id) => {
    if (!confirm("Delete this post?")) return;
    try { await api.deleteBlogPost(id); setPosts(posts.filter((_, idx) => idx !== i)); }
    catch (e) { alert("Failed to delete"); }
  };

  const chartData = useMemo(() => monthCountsFromPosts(posts), [posts]);
  const totalRead = posts.reduce((s, p) => s + (parseInt(p.read_time) || 0), 0);
  const thisMonth = useMemo(() => currentMonthArticles(posts), [posts]);
  const currentMonthName = new Date().toLocaleString("default", { month: "long" });

  return (
    <div>
      <AdminHero icon={FileText} title="Blog Management" subtitle={`Manage your ${posts.length} published articles across the year.`}
        gradient="linear-gradient(135deg,var(--accent),#a97a1a)" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 28 }}>
        <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "var(--accent)" }}>{posts.length}</div>
          <div style={{ fontSize: 13, color: "#5B6172", marginBottom: 4 }}>Total Articles</div>
          <BarChart data={chartData} barColor="var(--accent)" height={80} />
          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4, textAlign: "center" }}>Jan — Dec</div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "var(--accent)" }}>{totalRead}+</div>
          <div style={{ fontSize: 13, color: "#5B6172" }}>Total Read Time (min)</div>
          <div style={{ marginTop: 8, fontSize: 12, color: "#9CA3AF" }}>Avg {posts.length ? (totalRead / posts.length).toFixed(0) : 0} min per article</div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Calendar size={18} style={{ color: "var(--primary)" }} /><span style={{ fontSize: 13, fontWeight: 600 }}>Recent Activity</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "var(--primary)" }}>{currentMonthName}</div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>{thisMonth} {thisMonth === 1 ? "article" : "articles"} this month</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>All Posts</div>
        <button onClick={openNew} className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "9px 18px", fontSize: 13 }}><Plus size={15} /> Add Post</button>
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 620, maxWidth: "90vw", maxHeight: "85vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{editing ? "Edit Post" : "Add Post"}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <ImagePicker value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} label="Cover Image" height={160} />
              {form.image_url && (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#10162A", marginRight: 4 }}>Placement:</label>
                  {["left", "center", "right"].map((p) => (
                    <button key={p} type="button" onClick={() => setForm({ ...form, image_placement: p })}
                      style={{
                        padding: "6px 16px", borderRadius: 8, fontSize: 12.5, fontFamily: "inherit", cursor: "pointer", fontWeight: 600,
                        border: form.image_placement === p ? "2px solid var(--primary)" : "1px solid #E4E1DA",
                        background: form.image_placement === p ? "#F0EEFF" : "#F6F4F0",
                        color: form.image_placement === p ? "var(--primary)" : "#5B6172",
                      }}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Title</label>
                  <input name="title" value={form.title} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Slug</label>
                  <input name="slug" value={form.slug} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none", color: "#9CA3AF" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Author</label>
                  <input name="author" value={form.author} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Tag</label>
                  <input name="tag" value={form.tag} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Date</label>
                  <input name="published_at" type="date" value={form.published_at} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Read Time</label>
                  <input name="read_time" value={form.read_time} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none" }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
                  Published
                </label>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: "#10162A" }}>Excerpt</label>
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none", resize: "vertical" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 6, color: "#10162A" }}>Content</label>
                <div style={{ display: "flex", gap: 4, marginBottom: 6, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => wrapContent("<h2>", "</h2>")} title="Heading" style={btnStyle}><Heading size={15} /></button>
                  <button type="button" onClick={() => wrapContent("<h3>", "</h3>")} title="Subheading" style={btnStyle}><Type size={15} /></button>
                  <button type="button" onClick={() => wrapContent("<p>", "</p>")} title="Paragraph" style={btnStyle}><span style={{ fontSize: 11, fontWeight: 600 }}>P</span></button>
                  <span style={{ width: 1, background: "#E4E1DA", margin: "4px 2px" }} />
                  <button type="button" onClick={() => wrapContent("<strong>", "</strong>")} title="Bold" style={btnStyle}><Bold size={15} /></button>
                  <button type="button" onClick={() => wrapContent("<em>", "</em>")} title="Italic" style={btnStyle}><Italic size={15} /></button>
                  <span style={{ width: 1, background: "#E4E1DA", margin: "4px 2px" }} />
                  <input type="color" onChange={(e) => wrapColor(e.target.value)} title="Text Color" style={{ width: 30, height: 28, padding: 0, border: "1px solid #E4E1DA", borderRadius: 4, cursor: "pointer", background: "none" }} />
                  <Palette size={13} style={{ color: "#9CA3AF", alignSelf: "center" }} />
                </div>
                <textarea ref={contentRef} name="content" value={form.content} onChange={handleChange} rows={8} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E4E1DA", fontSize: 14, fontFamily: "inherit", background: "#F6F4F0", outline: "none", resize: "vertical" }} />
                {form.content && (
                  <div style={{ marginTop: 8, padding: 12, borderRadius: 8, border: "1px solid #E4E1DA", background: "#FAFAFA", fontSize: 14, lineHeight: 1.6, maxHeight: 160, overflow: "auto" }} dangerouslySetInnerHTML={{ __html: form.content }} />
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #E4E1DA", background: "transparent", fontSize: 14, fontFamily: "inherit", cursor: "pointer" }}>Cancel</button>
              <button onClick={save} className="btn btn-primary" style={{ border: "none", fontFamily: "inherit", cursor: "pointer", padding: "10px 20px", fontSize: 14 }}><Check size={16} /> Save</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: "#fff", border: "1px solid #E4E1DA", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#F6F4F0", textAlign: "left" }}>
              <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>IMAGE</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>TITLE</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>AUTHOR</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>TAG</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>DATE</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>READ</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, color: "#5B6172", fontSize: 12 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p, i) => (
              <tr key={p.id} style={{ borderTop: "1px solid #E4E1DA" }}>
                <td style={{ padding: "8px 16px" }}><div style={{ width: 44, height: 32, borderRadius: 6, background: p.image_url ? `center / cover url("${p.image_url}")` : "var(--accent)", overflow: "hidden" }} /></td>
                <td style={{ padding: "12px 16px", fontWeight: 600, maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</td>
                <td style={{ padding: "12px 16px" }}>{p.author}</td>
                <td style={{ padding: "12px 16px" }}>{p.tag}</td>
                <td style={{ padding: "12px 16px", color: "#9CA3AF", fontSize: 13 }}>{p.published_at ? new Date(p.published_at).toLocaleDateString() : "—"}</td>
                <td style={{ padding: "12px 16px", color: "#5B6172", fontSize: 13, fontFamily: "'JetBrains Mono',monospace" }}>{p.read_time || "—"}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => openEdit(p)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary)", padding: 4 }}><Edit3 size={15} /></button>
                    <button onClick={() => remove(i, p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", padding: 4 }}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
