/**
 * SponsorFit — Framework-Neutral Web API Handler
 *
 * Implements standard (Request) => Promise<Response> interface compatible with:
 * - Cloudflare Workers: `export default { fetch: handleRequest }`
 * - Vercel Edge Functions: `export const runtime = 'edge'; export default handleRequest`
 * - Node.js http server via standard adapter (api/server.mjs)
 * - Vite dev server middleware
 */

import { QlooClient } from './qloo-client.mjs';
import { SponsorFitAgent } from './agent.mjs';

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Api-Key',
      ...headers,
    },
  });
}

/**
 * Main fetch handler.
 *
 * @param {Request} request Standard Fetch API Request
 * @param {object} [env=process.env] Environment variables map
 * @returns {Promise<Response>} Standard Fetch API Response
 */
export async function handleRequest(request, env = process.env) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Api-Key',
      },
    });
  }

  const qlooKey = env.QLOO_API_KEY || '';
  const geminiKey = env.GEMINI_API_KEY || '';

  const qlooClient = new QlooClient({ apiKey: qlooKey });
  const agent = new SponsorFitAgent({ qlooClient, geminiApiKey: geminiKey });

  try {
    // GET /api/health
    if (request.method === 'GET' && pathname === '/api/health') {
      return jsonResponse({
        status: 'ok',
        isMock: qlooClient.isMockMode(),
        hasLiveQloo: !qlooClient.isMockMode(),
        hasGemini: Boolean(geminiKey && geminiKey.trim().length > 0),
        timestamp: new Date().toISOString(),
      });
    }

    // GET /api/search
    if (request.method === 'GET' && pathname === '/api/search') {
      const query = url.searchParams.get('query') || '';
      const types = url.searchParams.get('types') || undefined;
      const data = await qlooClient.searchEntities(query, types);
      return jsonResponse(data);
    }

    // GET /api/insights
    if (request.method === 'GET' && pathname === '/api/insights') {
      const filterType = url.searchParams.get('filterType') || 'urn:entity:brand';
      const signalsParam = url.searchParams.get('signals') || '';
      const signalEntityIds = signalsParam ? signalsParam.split(',').map((s) => s.trim()) : [];
      const data = await qlooClient.getInsights({
        filterType,
        signalEntityIds,
        explainability: true,
      });
      return jsonResponse(data);
    }

    // POST /api/audit
    if (request.method === 'POST' && pathname === '/api/audit') {
      let body = {};
      try {
        body = await request.json();
      } catch {
        // empty body
      }

      const auditResult = await agent.run(body);
      return jsonResponse(auditResult);
    }

    // 404 for unknown endpoints
    return jsonResponse({ error: `Not Found: ${pathname}` }, 404);
  } catch (err) {
    console.error('API Handler Error:', err);
    return jsonResponse({ error: err.message || 'Internal Server Error' }, 500);
  }
}

export default {
  fetch: handleRequest,
};
