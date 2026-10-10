/**
 * Vercel Serverless / Edge Function Adapter for SponsorFit
 *
 * Official Vercel Documentation References:
 * - https://vercel.com/docs/functions (Vercel Serverless Functions)
 * - https://vercel.com/docs/frameworks/vite (Vite on Vercel)
 * - https://vercel.com/docs/limits/fair-use-guidelines (Vercel Hobby Fair Use)
 *
 * Exposes the framework-neutral handleRequest(Request) handler to Vercel's runtime.
 */

import { handleRequest } from './handler.mjs';

/**
 * Universal Vercel Handler.
 * Supports:
 * 1. Web Standard API: handler(request: Request) => Promise<Response>
 * 2. Node.js Serverless: handler(req: IncomingMessage, res: ServerResponse)
 *
 * @param {Request | import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} [res]
 * @returns {Promise<Response | void>}
 */
export default async function handler(req, res) {
  // Mode 1: Web Standard Request (Vercel Edge, standard Web API, or direct unit test)
  if (typeof Request !== 'undefined' && req instanceof Request) {
    return handleRequest(req);
  }

  // If req is an object with standard Request-like url/method but not an instanceof Request
  if (req && typeof req.url === 'string' && typeof req.method === 'string' && !res) {
    const fullUrl = req.url.startsWith('http') ? req.url : `http://localhost${req.url}`;
    const webReq = new Request(fullUrl, {
      method: req.method,
      headers: req.headers,
      body: req.body,
    });
    return handleRequest(webReq);
  }

  // Mode 2: Node.js Serverless function (req: IncomingMessage, res: ServerResponse)
  const host = req.headers?.host || 'localhost';
  const protocol = req.headers?.['x-forwarded-proto'] || 'https';
  const url = new URL(req.url, `${protocol}://${host}`);

  let body = undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (typeof req.body === 'string') {
      body = req.body;
    } else if (req.body && typeof req.body === 'object') {
      body = JSON.stringify(req.body);
    } else if (req[Symbol.asyncIterator]) {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      body = Buffer.concat(chunks).toString();
    }
  }

  const webRequest = new Request(url.toString(), {
    method: req.method,
    headers: req.headers,
    body,
  });

  const webResponse = await handleRequest(webRequest);

  if (res) {
    res.statusCode = webResponse.status;
    webResponse.headers.forEach((val, key) => {
      res.setHeader(key, val);
    });
    const resBody = await webResponse.text();
    res.end(resBody);
    return;
  }

  return webResponse;
}

export { handler };
