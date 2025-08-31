# Usuarios API (Express + PostgreSQL)

## Endpoints
- GET /healthz
- GET /api/saludo?nombre=Geovany
- GET /api/time
- GET /api/usuarios
- GET /api/usuarios/:id
- POST /api/usuarios
- PUT /api/usuarios/:id
- DELETE /api/usuarios/:id
- Swagger: /docs

## Desarrollo local
1) Copia `.env.example` a `.env` y ajusta `DATABASE_URL`.
2) `npm ci`
3) `npm run dev` (o `npm start`)

## cURL de prueba
```bash
curl "http://localhost:3000/api/saludo?nombre=Geovany"
curl http://localhost:3000/api/time

curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Carlos Obregón","correo":"carlos@correo.com","password":"pass123"}'

curl http://localhost:3000/api/usuarios
curl http://localhost:3000/api/usuarios/1

curl -X PUT http://localhost:3000/api/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Carlos O."}'

curl -X DELETE http://localhost:3000/api/usuarios/1
