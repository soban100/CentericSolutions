import { Router } from "express";
import bcrypt from "bcryptjs";
import db from "../db.js";

const router = Router();
const MAX_SESSIONS = 5;

function sanitizeUser(u) {
  return {
    id: u.id, name: u.name, email: u.email, role: u.role, avatar_url: u.avatar_url,
    phone: u.phone || null, degree: u.degree || null, college: u.college || null,
  };
}

function clearSessionCookie(res) {
  res.clearCookie("__Host-centeric.sid", { path: "/" });
  res.clearCookie("centeric.sid", { path: "/" });
}

router.post("/check", async (req, res) => {
  try {
    const { email, phone } = req.body;
    const errors = {};
    if (email) {
      const e = await db.query("SELECT id FROM users WHERE email = $1", [email]);
      if (e.rows.length) errors.email = "Email already registered";
    }
    if (phone) {
      const p = await db.query("SELECT id FROM students WHERE phone = $1", [phone]);
      if (p.rows.length) errors.phone = "Phone number already registered";
    }
    res.json({ available: !errors.email && !errors.phone, errors });
  } catch {
    res.status(500).json({ error: "Check failed" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, degree, college, verificationToken } = req.body;
    if (!name || !password) {
      return res.status(400).json({ error: "Name and password are required" });
    }

    let verifiedEmail = email;
    let verifiedPhone = phone;

    if (verificationToken) {
      const { rows: otpRows } = await db.query(
        `SELECT method, value FROM otps
         WHERE token = $1 AND verified = TRUE AND expires_at > NOW()
         LIMIT 1`,
        [verificationToken]
      );
      if (!otpRows.length) {
        return res.status(401).json({ error: "Invalid or expired verification" });
      }
      const { method, value } = otpRows[0];
      if (method === "email") verifiedEmail = value;
      else verifiedPhone = value;
    }

    if (!verifiedEmail) {
      return res.status(400).json({ error: "Email verification required" });
    }

    const exists = await db.query("SELECT id FROM users WHERE email = $1", [verifiedEmail]);
    if (exists.rows.length) return res.status(409).json({ error: "Email already registered" });

    if (verifiedPhone) {
      const phoneExists = await db.query("SELECT id FROM students WHERE phone = $1", [verifiedPhone]);
      if (phoneExists.rows.length) return res.status(409).json({ error: "Phone number already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { rows } = await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'student')
       RETURNING id, name, email, role, avatar_url`,
      [name, verifiedEmail, password_hash]
    );

    const user = rows[0];

    await db.query(
      `INSERT INTO students (name, email, password_hash, phone, degree, college)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, verifiedEmail, password_hash, verifiedPhone || null, degree || null, college || null]
    );

    req.session.regenerate(async (err) => {
      if (err) return res.status(500).json({ error: "Session error" });

      req.session.userId = user.id;
      req.session.role = user.role;
      req.session.lastActivity = Date.now();

      await db.query(
        `UPDATE sessions SET user_id = $1, ip_address = $2::inet, user_agent = $3 WHERE sid = $4`,
        [user.id, req.ip, req.headers["user-agent"] || null, req.sessionID]
      );

      res.status(201).json({ user: sanitizeUser(user) });
    });
  } catch (e) {
    console.error("Register error:", e);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const { rows: existing } = await db.query(
      "SELECT sid FROM sessions WHERE user_id = $1 ORDER BY expire DESC",
      [user.id]
    );

    if (existing.length >= MAX_SESSIONS) {
      const toDelete = existing.slice(MAX_SESSIONS - 1).map((r) => r.sid);
      await db.query("DELETE FROM sessions WHERE sid = ANY($1)", [toDelete]);
    }

    req.session.regenerate(async (err) => {
      if (err) return res.status(500).json({ error: "Session error" });

      req.session.userId = user.id;
      req.session.role = user.role;
      req.session.lastActivity = Date.now();

      await db.query(
        `UPDATE sessions SET user_id = $1, ip_address = $2::inet, user_agent = $3 WHERE sid = $4`,
        [user.id, req.ip, req.headers["user-agent"] || null, req.sessionID]
      );

      res.json({ user: sanitizeUser(user) });
    });
  } catch (e) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/logout", (req, res) => {
  const sid = req.sessionID;
  req.session.destroy((err) => {
    if (err) {
      db.query("DELETE FROM sessions WHERE sid = $1", [sid]).catch(() => {});
      return res.status(500).json({ error: "Logout failed" });
    }
    clearSessionCookie(res);
    res.json({ ok: true });
  });
});

router.put("/profile", async (req, res) => {
  if (!req.session?.userId) return res.status(401).json({ error: "Not authenticated" });
  try {
    const { name, email, phone, degree, college } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and email are required" });

    const { rows } = await db.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role, avatar_url",
      [name, email, req.session.userId]
    );
    if (!rows.length) return res.status(404).json({ error: "User not found" });

    await db.query(
      `UPDATE students SET name = $1, email = $2, phone = $3, degree = $4, college = $5 WHERE email = $6`,
      [name, email, phone || null, degree || null, college || null, rows[0].email]
    );

    const { rows: studentRows } = await db.query(
      "SELECT phone, degree, college FROM students WHERE email = $1",
      [email]
    );

    const user = { ...rows[0], ...(studentRows[0] || {}) };
    res.json({ user: sanitizeUser(user) });
  } catch (e) {
    if (e.code === "23505") return res.status(409).json({ error: "Email already in use" });
    res.status(500).json({ error: "Failed to update profile" });
  }
});

router.put("/password", async (req, res) => {
  if (!req.session?.userId) return res.status(401).json({ error: "Not authenticated" });
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: "Current and new password required" });
    if (newPassword.length < 6) return res.status(400).json({ error: "New password must be at least 6 characters" });

    const { rows } = await db.query("SELECT id, password_hash, email FROM users WHERE id = $1", [req.session.userId]);
    if (!rows.length) return res.status(404).json({ error: "User not found" });

    const user = rows[0];
    const match = await bcrypt.compare(currentPassword, user.password_hash);
    if (!match) return res.status(401).json({ error: "Current password is incorrect" });

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password_hash = $1 WHERE id = $2", [newHash, user.id]);
    await db.query("UPDATE students SET password_hash = $1 WHERE email = $2", [newHash, user.email]);

    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to change password" });
  }
});

router.get("/me", async (req, res) => {
  if (!req.session?.userId) return res.status(401).json({ error: "Not authenticated" });
  try {
    const { rows } = await db.query(
      `SELECT u.id, u.name, u.email, u.role, u.avatar_url, u.created_at,
              s.phone, s.degree, s.college
       FROM users u
       LEFT JOIN students s ON s.email = u.email
       WHERE u.id = $1`,
      [req.session.userId]
    );
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json(sanitizeUser(rows[0]));
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
