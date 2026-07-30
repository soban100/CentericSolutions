import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM instructors WHERE is_active = TRUE ORDER BY name");
  res.json(rows);
});

router.get("/all", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM instructors ORDER BY name");
  res.json(rows);
});

router.get("/:id", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM instructors WHERE id = $1", [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "Instructor not found" });
  res.json(rows[0]);
});

router.post("/", async (req, res) => {
  const { name, role, bio, long_bio, image_url, specialty, tag_color, gradient, twitter_url, linkedin_url, github_url, students, course_count, rating } = req.body;
  const { rows } = await db.query(
    `INSERT INTO instructors (name, role, bio, long_bio, image_url, specialty, tag_color, gradient, twitter_url, linkedin_url, github_url, students, course_count, rating)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
    [name, role, bio, long_bio, image_url, specialty, tag_color, gradient, twitter_url, linkedin_url, github_url, students, course_count, rating]
  );
  res.status(201).json(rows[0]);
});

router.put("/:id", async (req, res) => {
  const { name, role, bio, long_bio, image_url, specialty, tag_color, gradient, twitter_url, linkedin_url, github_url, students, course_count, rating } = req.body;
  const { rows } = await db.query(
    `UPDATE instructors SET name=$1, role=$2, bio=$3, long_bio=$4, image_url=$5, specialty=$6, tag_color=$7, gradient=$8,
     twitter_url=$9, linkedin_url=$10, github_url=$11, students=$12, course_count=$13, rating=$14, updated_at=NOW() WHERE id=$15 RETURNING *`,
    [name, role, bio, long_bio, image_url, specialty, tag_color, gradient, twitter_url, linkedin_url, github_url, students, course_count, rating, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Instructor not found" });
  res.json(rows[0]);
});

router.delete("/:id", async (req, res) => {
  const { rowCount } = await db.query("DELETE FROM instructors WHERE id = $1", [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: "Instructor not found" });
  res.json({ deleted: true });
});

export default router;
