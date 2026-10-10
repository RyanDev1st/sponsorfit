import test from 'node:test';
import assert from 'node:assert/strict';
import { handleRequest } from './handler.mjs';

test('handleRequest: GET /api/health returns mock status by default', async () => {
  const req = new Request('http://localhost:3001/api/health', { method: 'GET' });
  const res = await handleRequest(req, {});

  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Content-Type'), 'application/json');

  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.equal(data.isMock, true);
  assert.equal(data.hasLiveQloo, false);
});

test('handleRequest: GET /api/search returns matching entity items', async () => {
  const req = new Request('http://localhost:3001/api/search?query=A24', { method: 'GET' });
  const res = await handleRequest(req, {});

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.results.length > 0);
  assert.equal(data.results[0].name, 'A24');
});

test('handleRequest: POST /api/audit triggers autonomous workflow and returns media kit', async () => {
  const req = new Request('http://localhost:3001/api/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creatorName: 'The Editorial Desk',
      audienceSize: '25,000 readers',
      seedQueries: ['A24', 'Phoebe Bridgers', 'Tartine Bakery'],
    }),
  });

  const res = await handleRequest(req, {});
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.isMock, true);
  assert.ok(Array.isArray(data.toolTrace));
  assert.equal(data.toolTrace.length, 4);
  assert.ok(Array.isArray(data.rankedSponsors));
  assert.ok(data.rankedSponsors.length > 0);
  assert.ok(data.mediaKit);
  assert.ok(Array.isArray(data.pitches));
});

test('handleRequest: OPTIONS returns 204 with CORS headers', async () => {
  const req = new Request('http://localhost:3001/api/audit', { method: 'OPTIONS' });
  const res = await handleRequest(req, {});
  assert.equal(res.status, 204);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), '*');
});
