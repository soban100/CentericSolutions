import { Router } from "express";
import db from "../db.js";
import { createNotification } from "../services/notifications.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM testimonials WHERE is_active = TRUE ORDER BY created_at DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM testimonials ORDER BY created_at DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, role, quote, image_url, course, course_id, tag, tag_color, outcome, rating, is_featured } = req.body;
    const { rows } = await db.query(
      `INSERT INTO testimonials (name, role, quote, image_url, course, course_id, tag, tag_color, outcome, rating, is_featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [name, role || "", quote, image_url, course || "General", course_id, tag || "General", tag_color || "indigo", outcome || "", rating ?? 5, is_featured ?? false]
    );
    createNotification({
      type: "new_testimonial",
      title: `New Testimonial from ${name}`,
      body: quote?.slice(0, 120),
      link: "/testimonials",
    });
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: "Failed to create testimonial" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, role, quote, image_url, course, course_id, tag, tag_color, outcome, rating, is_featured } = req.body;
    const { rows } = await db.query(
      `UPDATE testimonials SET name=$1, role=$2, quote=$3, image_url=$4, course=$5, course_id=$6, tag=$7, tag_color=$8,
       outcome=$9, rating=$10, is_featured=$11, updated_at=NOW() WHERE id=$12 RETURNING *`,
      [name, role || "", quote, image_url, course, course_id, tag, tag_color, outcome, rating, is_featured, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Testimonial not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: "Failed to update testimonial" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { rowCount } = await db.query("DELETE FROM testimonials WHERE id = $1", [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: "Testimonial not found" });
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
});

export default router;
