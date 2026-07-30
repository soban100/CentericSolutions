import { Router } from "express";
import crypto from "crypto";
import db from "../db.js";
import { sendOtpEmail } from "../services/email.js";
import { sendOtpSms } from "../services/sms.js";

const router = Router();

const OTP_LENGTH = 6;
const OTP_EXPIRY_MS = 10 * 60 * 1000;

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

router.post("/send-otp", async (req, res) => {
  try {
    const { method, value } = req.body;
    if (!method || !["email", "phone"].includes(method)) {
      return res.status(400).json({ error: "Method must be 'email' or 'phone'" });
    }
    if (!value) return res.status(400).json({ error: "Value is required" });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

    await db.query(
      `UPDATE otps SET verified = FALSE, expires_at = NOW() WHERE method = $1 AND value = $2 AND verified = FALSE`,
      [method, value]
    );

    await db.query(
      "INSERT INTO otps (method, value, otp, expires_at) VALUES ($1, $2, $3, $4)",
      [method, value, otp, expiresAt]
    );

    if (method === "email") {
      await sendOtpEmail(value, otp);
    } else {
      await sendOtpSms(value, otp);
    }

    res.json({ ok: true, message: `OTP sent to ${value}` });
  } catch (e) {
    console.error("send-otp error:", e);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { method, value, otp } = req.body;
    if (!method || !value || !otp) {
      return res.status(400).json({ error: "Method, value, and otp are required" });
    }

    const { rows } = await db.query(
      `SELECT id FROM otps
       WHERE method = $1 AND value = $2 AND otp = $3 AND verified = FALSE AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [method, value, otp]
    );

    if (!rows.length) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    const token = generateToken();

    await db.query("UPDATE otps SET verified = TRUE, token = $1 WHERE id = $2", [token, rows[0].id]);

    res.json({ ok: true, token, message: "Verified successfully" });
  } catch (e) {
    console.error("verify-otp error:", e);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

export default router;
