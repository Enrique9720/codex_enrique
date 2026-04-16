const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;

let nextId = 1;
const productos = [];

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
};

const readBody = (req) => new Promise((resolve, reject) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    if (!body) {
      resolve({});
      return;
    }

    try {
      resolve(JSON.parse(body));
    } catch {
      reject(new Error('JSON inválido'));
    }
  });

  req.on('error', reject);
});

const validateProducto = (data) => {
  const nombre = typeof data.nombre === 'string' ? data.nombre.trim() : '';
  const precio = Number(data.precio);

  if (!nombre) {
    return { valid: false, message: 'El campo "nombre" es obligatorio.' };
  }

  if (Number.isNaN(precio) || precio < 0) {
    return { valid: false, message: 'El campo "precio" debe ser un número >= 0.' };
  }

  return { valid: true, value: { nombre, precio } };
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const path = parsedUrl.pathname;

  if (req.method === 'GET' && path === '/productos') {
    sendJson(res, 200, { data: productos });
    return;
  }

  if (req.method === 'POST' && path === '/productos') {
    try {
      const body = await readBody(req);
      const validation = validateProducto(body);

      if (!validation.valid) {
        sendJson(res, 400, { error: validation.message });
        return;
      }

      const nuevoProducto = { id: nextId++, ...validation.value };
      productos.push(nuevoProducto);
      sendJson(res, 201, { message: 'Producto creado.', data: nuevoProducto });
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  const productoIdMatch = path.match(/^\/productos\/(\d+)$/);

  if (productoIdMatch) {
    const id = Number(productoIdMatch[1]);
    const index = productos.findIndex((producto) => producto.id === id);

    if (index === -1) {
      sendJson(res, 404, { error: 'Producto no encontrado.' });
      return;
    }

    if (req.method === 'GET') {
      sendJson(res, 200, { data: productos[index] });
      return;
    }

    if (req.method === 'PUT') {
      try {
        const body = await readBody(req);
        const validation = validateProducto(body);

        if (!validation.valid) {
          sendJson(res, 400, { error: validation.message });
          return;
        }

        productos[index] = { id, ...validation.value };
        sendJson(res, 200, { message: 'Producto actualizado.', data: productos[index] });
      } catch (error) {
        sendJson(res, 400, { error: error.message });
      }
      return;
    }

    if (req.method === 'DELETE') {
      const [eliminado] = productos.splice(index, 1);
      sendJson(res, 200, { message: 'Producto eliminado.', data: eliminado });
      return;
    }
  }

  sendJson(res, 404, {
    error: 'Ruta no encontrada.',
    rutasDisponibles: [
      'GET /productos',
      'POST /productos',
      'GET /productos/:id',
      'PUT /productos/:id',
      'DELETE /productos/:id',
    ],
  });
});

server.listen(PORT, () => {
  console.log(`API de productos corriendo en http://localhost:${PORT}`);
});
