import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "..", "uploads");

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /\.(png|jpg|jpeg|gif|webp|svg)$/i;
    if (allowed.test(path.extname(file.originalname))) return cb(null, true);
    cb(new Error("Only image files are allowed"));
  },
});

const router = Router();

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename });
});

// Also accept base64 uploads
router.post("/base64", (req, res) => {
  const { data, name } = req.body;
  if (!data) return res.status(400).json({ error: "No image data provided" });

  const matches = data.match(/^data:image\/(png|jpg|jpeg|gif|webp|svg);base64,(.+)$/);
  if (!matches) return res.status(400).json({ error: "Invalid base64 image data" });

  const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
  const filename = `${Date.now()}-${name?.replace(/\.[^.]+$/, "")?.slice(0, 20) || "image"}.${ext}`;
  const buffer = Buffer.from(matches[2], "base64");

  fs.writeFileSync(path.join(uploadsDir, filename), buffer);
  res.json({ url: `/uploads/${filename}`, filename });
});

export default router;
