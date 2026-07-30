import { Router } from "express";
import db from "../db.js";
import { createNotification } from "../services/notifications.js";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM courses WHERE is_active = TRUE ORDER BY created_at DESC");
  res.json(rows);
});

router.get("/all", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM courses ORDER BY created_at DESC");
  res.json(rows);
});

router.get("/:slug", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM courses WHERE slug = $1", [req.params.slug]);
  if (!rows.length) return res.status(404).json({ error: "Course not found" });
  res.json(rows[0]);
});

router.post("/", async (req, res) => {
  const { slug, title, description, image_url, tag, tag_color, gradient, duration, level, instructor, rating, students, is_featured } = req.body;
  const isActive = req.body.is_active !== undefined ? req.body.is_active : true;
  const { rows } = await db.query(
    `INSERT INTO courses (slug, title, description, image_url, tag, tag_color, gradient, duration, level, instructor, rating, students, is_featured)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
    [slug, title, description, image_url, tag, tag_color, gradient, duration, level, instructor, rating, students, is_featured ?? false]
  );
  if (isActive) {
    createNotification({
      type: "new_course",
      title: `New Course: ${title}`,
      body: description?.slice(0, 120),
      link: `/courses/${slug}`,
    });
  }
  res.status(201).json(rows[0]);
});

router.put("/:id", async (req, res) => {
  const { slug, title, description, image_url, tag, tag_color, gradient, duration, level, instructor, rating, students, is_featured } = req.body;
  const existing = await db.query("SELECT is_active FROM courses WHERE id = $1", [req.params.id]);
  const wasActive = existing.rows[0]?.is_active;
  const { rows } = await db.query(
    `UPDATE courses SET slug=$1, title=$2, description=$3, image_url=$4, tag=$5, tag_color=$6, gradient=$7,
     duration=$8, level=$9, instructor=$10, rating=$11, students=$12, is_featured=$13, updated_at=NOW() WHERE id=$14 RETURNING *`,
    [slug, title, description, image_url, tag, tag_color, gradient, duration, level, instructor, rating, students, is_featured ?? false, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Course not found" });
  const isActive = req.body.is_active !== undefined ? req.body.is_active : wasActive;
  if (isActive && !wasActive) {
    createNotification({
      type: "new_course",
      title: `New Course: ${title}`,
      body: description?.slice(0, 120),
      link: `/courses/${slug}`,
    });
  }
  res.json(rows[0]);
});

router.delete("/:id", async (req, res) => {
  const { rowCount } = await db.query("DELETE FROM courses WHERE id = $1", [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: "Course not found" });
  res.json({ deleted: true });
});

export default router;
