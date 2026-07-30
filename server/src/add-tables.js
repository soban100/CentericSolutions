import pg from "pg";

const pool = new pg.Pool({
  host: "localhost", port: 5432, database: "centericSolutions",
  user: "postgres", password: "Slaonvae12",
});

const sql = `
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  degree VARCHAR(200),
  college VARCHAR(200),
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

`;

try {
  await pool.query(sql);
  const { rows } = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
  );
  console.log("Tables:", rows.map((r) => r.table_name).join(", "));
} catch (e) {
  console.error(e.message);
}
await pool.end();
