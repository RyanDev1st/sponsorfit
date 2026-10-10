/**
 * SponsorFit — Local Node Server Wrapper
 *
 * Adapts standard Node.js http.Server to the framework-neutral handleRequest(Request).
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleRequest } from './handler.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Zero-dependency .env loader
export function loadEnv(envPath) {
  const target = envPath || path.resolve(__dirname, '../.env');
  if (!fs.existsSync(target)) return;
  try {
    const raw = fs.readFileSync(target, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
  } catch (err) {
    console.warn('Could not read .env file:', err.message);
  }
}

loadEnv();

/**
 * Creates Node http.Server wrapping the fetch handler.
 */
export function createServer() {
  return http.createServer(async (req, res) => {
    try {
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers.host || 'localhost:3001';
      const fullUrl = `${protocol}://${host}${req.url}`;

      // Convert Node IncomingMessage to Web Request
      const chunks = [];
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

      const resArrayBuffer = await webResponse.arrayBuffer();
      res.end(Buffer.from(resArrayBuffer));
    } catch (err) {
      console.error('Node Server Error:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  });
}

// Start if run directly
if (process.argv[1] && (process.argv[1].endsWith('server.mjs') || process.argv[1].endsWith('server.js'))) {
  const PORT = Number(process.env.PORT) || 3001;
  const server = createServer();
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`SponsorFit API Server running at http://127.0.0.1:${PORT}`);
    console.log(`Mode: ${process.env.QLOO_API_KEY ? 'LIVE (hackathon.api.qloo.com)' : 'MOCK (local fixtures)'}`);
  });
}
