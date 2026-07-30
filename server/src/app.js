import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import session from "./session.js";
import { idleTimeout } from "./middleware/idleTimeout.js";
import { loginLimiter } from "./middleware/rateLimit.js";
import authRoutes from "./routes/auth.js";
import otpRoutes from "./routes/otp.js";
import courseRoutes from "./routes/courses.js";
import instructorRoutes from "./routes/instructors.js";
import blogRoutes from "./routes/blog.js";
import testimonialRoutes from "./routes/testimonials.js";
import messageRoutes from "./routes/messages.js";
import enrollmentRoutes from "./routes/enrollments.js";
import heroRoutes from "./routes/heroes.js";
import aboutRoutes from "./routes/about.js";
import faqRoutes from "./routes/faqs.js";
import studentRoutes from "./routes/students.js";
import settingsRoutes from "./routes/settings.js";
import uploadRoutes from "./routes/upload.js";
import adminNotificationRoutes from "./routes/adminNotifications.js";
import notificationRoutes from "./routes/notifications.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(session);
app.use(idleTimeout);
app.use("/uploads", express.static("uploads"));

// API routes
app.use("/api/auth", loginLimiter, authRoutes);
app.use("/api/auth", otpRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/heroes", heroRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin/notifications", adminNotificationRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
