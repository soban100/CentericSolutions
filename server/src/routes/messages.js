import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM contact_messages ORDER BY created_at DESC");
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) return res.status(400).json({ error: "All fields required" });
  const { rows } = await db.query(
    "INSERT INTO contact_messages (name, email, subject, message) VALUES ($1,$2,$3,$4) RETURNING *",
    [name, email, subject, message]
  );
  res.status(201).json(rows[0]);
});

router.put("/:id/read", async (req, res) => {
  const { rows } = await db.query("UPDATE contact_messages SET is_read = TRUE WHERE id = $1 RETURNING *", [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "Message not found" });
  res.json(rows[0]);
});

router.delete("/:id", async (req, res) => {
  const { rowCount } = await db.query("DELETE FROM contact_messages WHERE id = $1", [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: "Message not found" });
  res.json({ deleted: true });
});

export default router;
