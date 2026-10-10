import test from 'node:test';
import assert from 'node:assert/strict';
import handler from './[...path].mjs';

test('Vercel Adapter: imports adapter and calls it with a Request for /api/health in mock mode', async () => {
  const req = new Request('http://localhost/api/health', {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  const response = await handler(req);
  assert.ok(response instanceof Response, 'Handler must return a Web Response object');
  assert.equal(response.status, 200);

  const data = await response.json();
  assert.equal(data.status, 'ok');
  assert.equal(data.service, 'SponsorFit API');
  assert.equal(data.isMock, true, 'Default mock mode should be true when no QLOO_API_KEY is configured');
});

test('Vercel Adapter: routes POST /api/audit through the adapter cleanly', async () => {
  const req = new Request('http://localhost/api/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creatorName: 'The Slow Drift',
      audienceSize: '35,000 monthly listeners',
      seedQueries: ['A24', 'Severance'],
    }),
  });

  const response = await handler(req);
  assert.equal(response.status, 200);

  const data = await response.json();
  assert.equal(data.success, true);
  assert.equal(data.isMock, true);
  assert.ok(Array.isArray(data.rankedSponsors));
  assert.ok(data.rankedSponsors.length > 0);
});
