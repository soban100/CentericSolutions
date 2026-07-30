import pg from "pg";

const pool = new pg.Pool({
  host: "localhost", port: 5432, database: "centericSolutions",
  user: "postgres", password: "Slaonvae12",
});

const { rows } = await pool.query(
  "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
);
console.log("Tables created:", rows.map((r) => r.table_name).join(", "));
console.log(`Total: ${rows.length} tables`);
await pool.end();
