import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || "postgresql://localhost:5432/postgres";

// Render exige SSL en producción
const isProd = process.env.NODE_ENV === "production";
export const pool = new Pool({
  connectionString,
  ssl: isProd ? { rejectUnauthorized: false } : false
});

export async function initDb() {
  const ddl = `
  CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    correo     VARCHAR(150) UNIQUE NOT NULL,
    password   VARCHAR(100) NOT NULL,
    fecha_reg  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `;
  await pool.query(ddl);
}
