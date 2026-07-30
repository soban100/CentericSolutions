import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM faqs WHERE is_active = TRUE ORDER BY sort_order");
  res.json(rows);
});

router.get("/all", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM faqs ORDER BY sort_order");
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { question, answer, category } = req.body;
  const max = await db.query("SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM faqs");
  const { rows } = await db.query(
    "INSERT INTO faqs (question, answer, category, sort_order) VALUES ($1,$2,$3,$4) RETURNING *",
    [question, answer, category || "General", max.rows[0].next]
  );
  res.status(201).json(rows[0]);
});

router.put("/:id", async (req, res) => {
  const { question, answer, category, is_active } = req.body;
  const { rows } = await db.query(
    "UPDATE faqs SET question=$1, answer=$2, category=$3, is_active=$4 WHERE id=$5 RETURNING *",
    [question, answer, category, is_active, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "FAQ not found" });
  res.json(rows[0]);
});

router.delete("/:id", async (req, res) => {
  const { rowCount } = await db.query("DELETE FROM faqs WHERE id = $1", [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: "FAQ not found" });
  res.json({ deleted: true });
});

export default router;
