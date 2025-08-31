export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Usuarios API (Express)",
    version: "1.0.0",
    description: "API pública de ejemplo con Express + PostgreSQL"
  },
  servers: [{ url: "/" }],
  paths: {
    "/healthz": {
      get: {
        summary: "Health check",
        responses: { "200": { description: "OK" } }
      }
    },
    "/api/saludo": {
      get: {
        summary: "Saludo",
        parameters: [
          { name: "nombre", in: "query", schema: { type: "string" }, required: false }
        ],
        responses: { "200": { description: "OK" } }
      }
    },
    "/api/time": {
      get: {
        summary: "Hora en UTC",
        responses: { "200": { description: "OK" } }
      }
    },
    "/api/usuarios": {
      get: {
        summary: "Listar usuarios",
        parameters: [
          { name: "skip", in: "query", schema: { type: "integer", minimum: 0 } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 200 } }
        ],
        responses: { "200": { description: "Lista de usuarios" } }
      },
      post: {
        summary: "Crear usuario",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nombre","correo","password"],
                properties: {
                  nombre: { type: "string" },
                  correo: { type: "string", format: "email" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "201": { description: "Creado" }, "409": { description: "Correo existente" } }
      }
    },
    "/api/usuarios/{id}": {
      get: {
        summary: "Obtener usuario por id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "OK" }, "404": { description: "No encontrado" } }
      },
      put: {
        summary: "Actualizar usuario",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nombre: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "Actualizado" }, "404": { description: "No encontrado" } }
      },
      delete: {
        summary: "Eliminar usuario",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "204": { description: "Eliminado" }, "404": { description: "No encontrado" } }
      }
    }
  }
};
