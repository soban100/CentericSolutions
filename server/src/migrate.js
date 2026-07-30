import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, "..", "..", "database", "schema.sql");

async function migrate() {
  console.log("Running migration...");
  const sql = fs.readFileSync(schemaPath, "utf-8");
  try {
    await db.query(sql);
    console.log("Migration complete — all tables created.");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  }
  await db.pool.end();
}

migrate();
