import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./swagger.js";
import { pool, initDb } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());              // Abrir CORS para pruebas (ajusta orígenes en prod)
app.use(express.json());      // JSON body parser

// Init DB
await initDb();

// Helpers
const toDto = (row) => ({
  id_usuario: row.id_usuario,
  nombre: row.nombre,
  correo: row.correo,
  fecha_reg: row.fecha_reg
});

// Rutas base
app.get("/healthz", (_req, res) => res.json({ status: "ok" }));

app.get("/api/saludo", (req, res) => {
  const nombre = req.query.nombre || "mundo";
  res.json({ ok: true, mensaje: `¡Hola, ${nombre}!` });
});

app.get("/api/time", (_req, res) => {
  res.json({ ok: true, utc: new Date().toISOString() });
});

// --- CRUD Usuarios ---
// GET /api/usuarios?skip=0&limit=50
app.get("/api/usuarios", async (req, res) => {
  const skip = Math.max(parseInt(req.query.skip || "0"), 0);
  const limit = Math.min(Math.max(parseInt(req.query.limit || "50"), 1), 200);

  const { rows } = await pool.query(
    "SELECT id_usuario, nombre, correo, fecha_reg FROM usuarios ORDER BY id_usuario OFFSET $1 LIMIT $2",
    [skip, limit]
  );
  res.json(rows.map(toDto));
});

// GET /api/usuarios/:id
app.get("/api/usuarios/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { rows } = await pool.query(
    "SELECT id_usuario, nombre, correo, fecha_reg FROM usuarios WHERE id_usuario=$1",
    [id]
  );
  if (!rows.length) return res.status(404).json({ detail: "No encontrado" });
  res.json(toDto(rows[0]));
});

// POST /api/usuarios
app.post("/api/usuarios", async (req, res) => {
  const { nombre, correo, password } = req.body || {};
  if (!nombre || !correo || !password) {
    return res.status(400).json({ detail: "nombre, correo y password son requeridos" });
  }
  const hash = await bcrypt.hash(password, 10);

  try {
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nombre, correo, password)
       VALUES ($1,$2,$3)
       RETURNING id_usuario, nombre, correo, fecha_reg`,
      [nombre, correo, hash]
    );
    res.status(201).json(toDto(rows[0]));
  } catch (e) {
    if (e.code === "23505") { // unique_violation
      return res.status(409).json({ detail: "El correo ya existe" });
    }
    console.error(e);
    res.status(500).json({ detail: "Error interno" });
  }
});

// PUT /api/usuarios/:id
app.put("/api/usuarios/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, password } = req.body || {};

  // Verificar existencia
  const curr = await pool.query("SELECT * FROM usuarios WHERE id_usuario=$1", [id]);
  if (!curr.rows.length) return res.status(404).json({ detail: "No encontrado" });

  const upd = {
    nombre: nombre ?? curr.rows[0].nombre,
    password: password ? await bcrypt.hash(password, 10) : curr.rows[0].password
  };

  const { rows } = await pool.query(
    `UPDATE usuarios SET nombre=$1, password=$2 WHERE id_usuario=$3
     RETURNING id_usuario, nombre, correo, fecha_reg`,
    [upd.nombre, upd.password, id]
  );
  res.json(toDto(rows[0]));
});

// DELETE /api/usuarios/:id
app.delete("/api/usuarios/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await pool.query("DELETE FROM usuarios WHERE id_usuario=$1", [id]);
  if (result.rowCount === 0) return res.status(404).json({ detail: "No encontrado" });
  res.status(204).send();
});

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Arranque
app.listen(PORT, () => {
  console.log(`Usuarios API escuchando en :${PORT}`);
});
