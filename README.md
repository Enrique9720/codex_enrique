# CRUD sencillo de productos

API REST mínima para crear, listar, consultar, actualizar y eliminar productos.

## Requisitos

- Node.js 18+ (o versión reciente compatible)

## Ejecutar

```bash
npm start
```

La API queda disponible en:

- `http://localhost:3000`

## Endpoints

### Crear producto

`POST /productos`

```json
{
  "nombre": "Mouse inalámbrico",
  "precio": 25.99
}
```

### Listar productos

`GET /productos`

### Obtener producto por ID

`GET /productos/:id`

### Actualizar producto

`PUT /productos/:id`

```json
{
  "nombre": "Mouse gamer",
  "precio": 35.5
}
```

### Eliminar producto

`DELETE /productos/:id`

## Ejemplos rápidos con curl

```bash
# Crear
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Teclado","precio":50}'

# Listar
curl http://localhost:3000/productos

# Ver por ID
curl http://localhost:3000/productos/1

# Modificar
curl -X PUT http://localhost:3000/productos/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Teclado mecánico","precio":70}'

# Borrar
curl -X DELETE http://localhost:3000/productos/1
```
