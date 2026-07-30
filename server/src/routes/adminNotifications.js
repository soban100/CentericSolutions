import { Router } from "express";
import db from "../db.js";
import { requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/counts", requireRole("admin"), async (req, res) => {
  const [messages, enrollments, blog] = await Promise.all([
    db.query("SELECT COUNT(*)::int AS count FROM contact_messages WHERE is_read = FALSE"),
    db.query("SELECT COUNT(*)::int AS count FROM enrollments WHERE status = 'pending'"),
    db.query("SELECT COUNT(*)::int AS count FROM blog_posts WHERE is_published = FALSE"),
  ]);

  res.json({
    unread_messages: messages.rows[0].count,
    pending_enrollments: enrollments.rows[0].count,
    unpublished_posts: blog.rows[0].count,
  });
});

export default router;
