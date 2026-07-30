import { Router } from "express";
import db from "../db.js";

const router = Router();

// GET /api/about — returns full about page data
router.get("/", async (req, res) => {
  const about = await db.query("SELECT * FROM about_page WHERE id = 1");
  const values = await db.query("SELECT * FROM about_values ORDER BY sort_order");
  const team = await db.query("SELECT * FROM about_team ORDER BY sort_order");

  res.json({
    mission: { title: about.rows[0]?.mission_title, body: about.rows[0]?.mission_body },
    vision: { title: about.rows[0]?.vision_title, body: about.rows[0]?.vision_body },
    values: values.rows,
    team: team.rows,
  });
});

// PUT /api/about — upsert mission/vision (inserts row if missing)
router.put("/", async (req, res) => {
  const { mission, vision } = req.body;
  const { rows } = await db.query(
    `INSERT INTO about_page (id, mission_title, mission_body, vision_title, vision_body, updated_at)
     VALUES (1, $1, $2, $3, $4, NOW())
     ON CONFLICT (id) DO UPDATE SET mission_title=$1, mission_body=$2, vision_title=$3, vision_body=$4, updated_at=NOW()
     RETURNING *`,
    [mission?.title, mission?.body, vision?.title, vision?.body]
  );
  res.json(rows[0]);
});

// GET /about/values
router.get("/values", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM about_values ORDER BY sort_order");
  res.json(rows);
});

// GET /about/team
router.get("/team", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM about_team ORDER BY sort_order");
  res.json(rows);
});

// Values CRUD
router.post("/values", async (req, res) => {
  const { icon, title, body } = req.body;
  const max = await db.query("SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM about_values");
  const { rows } = await db.query(
    "INSERT INTO about_values (icon, title, body, sort_order) VALUES ($1,$2,$3,$4) RETURNING *",
    [icon || "target", title, body, max.rows[0].next]
  );
  res.status(201).json(rows[0]);
});

router.put("/values/:id", async (req, res) => {
  const { icon, title, body } = req.body;
  const { rows } = await db.query(
    "UPDATE about_values SET icon=$1, title=$2, body=$3 WHERE id=$4 RETURNING *",
    [icon || "target", title, body, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Value not found" });
  res.json(rows[0]);
});

router.delete("/values/:id", async (req, res) => {
  const { rowCount } = await db.query("DELETE FROM about_values WHERE id = $1", [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: "Value not found" });
  res.json({ deleted: true });
});

// Team CRUD
router.post("/team", async (req, res) => {
  const { name, role, bio, image_url } = req.body;
  const max = await db.query("SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM about_team");
  const { rows } = await db.query(
    "INSERT INTO about_team (name, role, bio, image_url, sort_order) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [name, role, bio, image_url, max.rows[0].next]
  );
  res.status(201).json(rows[0]);
});

router.put("/team/:id", async (req, res) => {
  const { name, role, bio, image_url } = req.body;
  const { rows } = await db.query(
    "UPDATE about_team SET name=$1, role=$2, bio=$3, image_url=$4 WHERE id=$5 RETURNING *",
    [name, role, bio, image_url, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Team member not found" });
  res.json(rows[0]);
});

router.delete("/team/:id", async (req, res) => {
  const { rowCount } = await db.query("DELETE FROM about_team WHERE id = $1", [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: "Team member not found" });
  res.json({ deleted: true });
});

export default router;
