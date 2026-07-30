import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT key, value FROM site_settings ORDER BY key");
  const settings = {};
  rows.forEach((r) => { settings[r.key] = r.value; });
  res.json(settings);
});

router.get("/all", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM site_settings ORDER BY key");
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { key, value } = req.body;
  if (!key) return res.status(400).json({ error: "Key is required" });
  const exists = await db.query("SELECT 1 FROM site_settings WHERE key = $1", [key]);
  if (exists.rows.length) return res.status(409).json({ error: "Setting already exists" });
  const { rows } = await db.query(
    "INSERT INTO site_settings (key, value) VALUES ($1, $2) RETURNING *",
    [key, value || ""]
  );
  res.status(201).json(rows[0]);
});

router.put("/", async (req, res) => {
  const entries = Object.entries(req.body);
  for (const [key, value] of entries) {
    await db.query(
      "INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()",
      [key, value]
    );
  }
  const { rows } = await db.query("SELECT key, value FROM site_settings ORDER BY key");
  const settings = {};
  rows.forEach((r) => { settings[r.key] = r.value; });
  res.json(settings);
});

router.put("/:key", async (req, res) => {
  const { value } = req.body;
  const { rows } = await db.query(
    "UPDATE site_settings SET value = $1, updated_at = NOW() WHERE key = $2 RETURNING *",
    [value, req.params.key]
  );
  if (!rows.length) return res.status(404).json({ error: "Setting not found" });
  res.json(rows[0]);
});

router.delete("/:key", async (req, res) => {
  const { rowCount } = await db.query("DELETE FROM site_settings WHERE key = $1", [req.params.key]);
  if (!rowCount) return res.status(404).json({ error: "Setting not found" });
  res.json({ deleted: true });
});

export default router;
