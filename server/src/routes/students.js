import { Router } from "express";
import bcrypt from "bcryptjs";
import db from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await db.query(
    "SELECT id, name, email, phone, degree, college, avatar_url, is_active, created_at FROM students ORDER BY created_at DESC"
  );
  res.json(rows);
});

router.get("/:id", async (req, res) => {
  const { rows } = await db.query(
    "SELECT id, name, email, phone, degree, college, avatar_url, is_active, created_at FROM students WHERE id = $1",
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Student not found" });
  res.json(rows[0]);
});

router.post("/", async (req, res) => {
  const { name, email, password, phone, degree, college } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password required" });
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await db.query(
    `INSERT INTO students (name, email, password_hash, phone, degree, college) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, name, email, phone, degree, college, created_at`,
    [name, email, hash, phone, degree, college]
  );
  res.status(201).json(rows[0]);
});

router.put("/:id", async (req, res) => {
  const { name, email, phone, degree, college, is_active } = req.body;
  const { rows } = await db.query(
    `UPDATE students SET name=$1, email=$2, phone=$3, degree=$4, college=$5, is_active=COALESCE($6, is_active), updated_at=NOW() WHERE id=$7
     RETURNING id, name, email, phone, degree, college, avatar_url, is_active, created_at`,
    [name, email, phone, degree, college, is_active, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Student not found" });
  res.json(rows[0]);
});

router.delete("/:id", async (req, res) => {
  const { rowCount } = await db.query("DELETE FROM students WHERE id = $1", [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: "Student not found" });
  res.json({ deleted: true });
});
export default router;
