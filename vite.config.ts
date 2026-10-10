import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleRequest } from './api/handler.mjs';

function apiDevMiddleware() {
  return {
    name: 'api-dev-middleware',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api')) {
          return next();
        }

        try {
          const protocol = req.headers['x-forwarded-proto'] || 'http';
          const host = req.headers.host || 'localhost:5173';
          const fullUrl = `${protocol}://${host}${req.url}`;

          const chunks: any[] = [];
          for await (const chunk of req) {
            chunks.push(chunk);
          }
          const bodyBuffer = Buffer.concat(chunks);
          const hasBody = req.method !== 'GET' && req.method !== 'HEAD';

          const webRequest = new Request(fullUrl, {
            method: req.method,
            headers: req.headers,
            body: hasBody ? bodyBuffer : undefined,
          });

          const webResponse = await handleRequest(webRequest, process.env);

          res.statusCode = webResponse.status;
          for (const [key, value] of webResponse.headers.entries()) {
            res.setHeader(key, value);
          }

          const arrayBuffer = await webResponse.arrayBuffer();
          res.end(Buffer.from(arrayBuffer));
        } catch (err: any) {
          console.error('Vite API Middleware Error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
        }
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), apiDevMiddleware()],
  server: {
    port: 5173,
    host: true,
  },
});
