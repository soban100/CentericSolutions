import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setup() {
  // Connect to default 'postgres' database to create our DB
  const adminPool = new pg.Pool({
    host: "localhost",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: "Slaonvae12",
  });

  const dbName = "centericSolutions";
  const exists = await adminPool.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]
  );

  if (!exists.rows.length) {
    await adminPool.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Database "${dbName}" created.`);
  } else {
    console.log(`Database "${dbName}" already exists.`);
  }
  await adminPool.end();

  // Now run migration on the target database
  const { default: db } = await import("./db.js");
  const schemaPath = path.join(__dirname, "..", "..", "database", "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf-8");

  try {
    await db.query(sql);
    console.log("Migration complete — all tables created.");
  } catch (err) {
    console.error("Migration error:", err.message);
  }
  await db.pool.end();
}

setup();
