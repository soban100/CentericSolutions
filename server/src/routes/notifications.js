import { Router } from "express";
import db from "../db.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, async (req, res) => {
  const { rows } = await db.query(
    "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50"
  );
  const unread = await db.query(
    "SELECT COUNT(*)::int AS count FROM notifications WHERE is_read = FALSE"
  );
  res.json({ notifications: rows, unread_count: unread.rows[0].count });
});

router.put("/read", optionalAuth, async (req, res) => {
  const { id } = req.body;
  if (id) {
    await db.query("UPDATE notifications SET is_read = TRUE WHERE id = $1", [id]);
  } else {
    await db.query("UPDATE notifications SET is_read = TRUE WHERE is_read = FALSE");
  }
  res.json({ success: true });
});

export default router;
