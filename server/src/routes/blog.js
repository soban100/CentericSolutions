import { Router } from "express";
import db from "../db.js";
import { createNotification } from "../services/notifications.js";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM blog_posts WHERE is_published = TRUE ORDER BY published_at DESC");
  res.json(rows);
});

router.get("/all", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM blog_posts ORDER BY created_at DESC");
  res.json(rows);
});

router.get("/:slug", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM blog_posts WHERE slug = $1", [req.params.slug]);
  if (!rows.length) return res.status(404).json({ error: "Post not found" });
  res.json(rows[0]);
});

router.post("/", async (req, res) => {
  const { slug, title, content, excerpt, image_url, image_placement, tag, tag_color, author, read_time, is_published, published_at } = req.body;
  const pubDate = published_at || (is_published ? new Date().toISOString() : null);
  const { rows } = await db.query(
    `INSERT INTO blog_posts (slug, title, content, excerpt, image_url, image_placement, tag, tag_color, author, read_time, is_published, published_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [slug, title, content, excerpt, image_url, image_placement || "center", tag, tag_color, author, read_time, is_published, pubDate]
  );
  if (is_published) {
    createNotification({
      type: "new_blog",
      title: `New Blog: ${title}`,
      body: excerpt || content?.slice(0, 120),
      link: `/blog/${slug}`,
    });
  }
  res.status(201).json(rows[0]);
});

router.put("/:id", async (req, res) => {
  const { slug, title, content, excerpt, image_url, image_placement, tag, tag_color, author, read_time, is_published, published_at } = req.body;
  const existing = await db.query("SELECT published_at, is_published FROM blog_posts WHERE id = $1", [req.params.id]);
  const wasPublished = existing.rows[0]?.is_published;
  let pubDate = published_at || existing.rows[0]?.published_at;
  if (is_published && !pubDate) pubDate = new Date().toISOString();

  const { rows } = await db.query(
    `UPDATE blog_posts SET slug=$1, title=$2, content=$3, excerpt=$4, image_url=$5, image_placement=$6, tag=$7, tag_color=$8, author=$9,
     read_time=$10, is_published=$11, published_at=$12, updated_at=NOW() WHERE id=$13 RETURNING *`,
    [slug, title, content, excerpt, image_url, image_placement || "center", tag, tag_color, author, read_time, is_published, pubDate, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Post not found" });
  if (is_published && !wasPublished) {
    createNotification({
      type: "new_blog",
      title: `New Blog: ${title}`,
      body: excerpt || content?.slice(0, 120),
      link: `/blog/${slug}`,
    });
  }
  res.json(rows[0]);
});

router.delete("/:id", async (req, res) => {
  const { rowCount } = await db.query("DELETE FROM blog_posts WHERE id = $1", [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: "Post not found" });
  res.json({ deleted: true });
});

export default router;
