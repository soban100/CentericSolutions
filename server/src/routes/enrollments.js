import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM enrollments ORDER BY created_at DESC");
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { course_id, course_name, name, email, phone, degree, college } = req.body;
  if (!name || !email || !course_name) return res.status(400).json({ error: "Name, email, and course required" });
  const { rows } = await db.query(
    `INSERT INTO enrollments (course_id, course_name, name, email, phone, degree, college) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [course_id, course_name, name, email, phone, degree, college]
  );
  res.status(201).json(rows[0]);
});

router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  if (!["pending", "contacted", "enrolled", "cancelled"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const { rows } = await db.query("UPDATE enrollments SET status = $1 WHERE id = $2 RETURNING *", [status, req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "Enrollment not found" });
  res.json(rows[0]);
});

router.delete("/:id", async (req, res) => {
  const { rowCount } = await db.query("DELETE FROM enrollments WHERE id = $1", [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: "Enrollment not found" });
  res.json({ deleted: true });
});

export default router;
