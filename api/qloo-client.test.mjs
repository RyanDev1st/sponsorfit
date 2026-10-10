import test from 'node:test';
import assert from 'node:assert/strict';
import { QlooClient, HACKATHON_BASE_URL } from './qloo-client.mjs';

test('QlooClient: mock mode detected when QLOO_API_KEY is empty', () => {
  const client = new QlooClient({ apiKey: '' });
  assert.equal(client.isMockMode(), true);
  assert.equal(client.baseUrl, HACKATHON_BASE_URL);
});

test('QlooClient: live mode enabled when valid API key is supplied', () => {
  const client = new QlooClient({ apiKey: 'test_live_key_12345' });
  assert.equal(client.isMockMode(), false);
});

test('QlooClient: mock search returns official Qloo response shape', async () => {
  const client = new QlooClient({ apiKey: '' });
  const res = await client.searchEntities('A24', 'urn:entity:brand');

  assert.equal(res.success, true);
  assert.equal(res.isMock, true);
  assert.ok(Array.isArray(res.results), 'results should be an array');
  assert.ok(res.results.length > 0, 'results should contain entities');

  const first = res.results[0];
  assert.equal(typeof first.id, 'string');
  assert.equal(typeof first.name, 'string');
  assert.equal(first.type, 'urn:entity:brand');
  assert.ok(Array.isArray(first.properties?.tags));
});

test('QlooClient: mock insights returns official brand entities with explainability signals', async () => {
  const client = new QlooClient({ apiKey: '' });
  const res = await client.getInsights({
    filterType: 'urn:entity:brand',
    signalEntityIds: ['qloo_ent_a24_01'],
    explainability: true,
  });

  assert.equal(res.success, true);
  assert.equal(res.isMock, true);
  assert.ok(Array.isArray(res.results?.entities), 'entities should be an array');

  const topBrand = res.results.entities[0];
  assert.equal(typeof topBrand.id, 'string');
  assert.equal(typeof topBrand.name, 'string');
  assert.equal(typeof topBrand.affinity, 'number');
  assert.ok(topBrand.affinity >= 0 && topBrand.affinity <= 1.0);
  assert.ok(Array.isArray(topBrand.tags));
  assert.ok(Array.isArray(topBrand.query?.explainability?.signals));
});

test('QlooClient: live request builds correct base URL, header, and parameters', async () => {
  let capturedUrl = '';
  let capturedHeaders = {};

  const mockFetch = async (url, options) => {
    capturedUrl = url;
    capturedHeaders = options.headers;
    return {
      ok: true,
      json: async () => ({
        success: true,
        duration: 0.05,
        results: { entities: [] },
      }),
    };
  };

  const client = new QlooClient({
    apiKey: 'qloo_hackathon_token_abc',
    fetchFn: mockFetch,
  });

  await client.getInsights({
    filterType: 'urn:entity:brand',
    signalEntityIds: ['ent_1', 'ent_2'],
    explainability: true,
  });

  assert.ok(capturedUrl.startsWith(HACKATHON_BASE_URL));
  assert.ok(capturedUrl.includes('/v2/insights'));
  assert.ok(capturedUrl.includes('filter.type=urn%3Aentity%3Abrand'));
  assert.ok(capturedUrl.includes('signal.interests.entities=ent_1%2Cent_2'));
  assert.ok(capturedUrl.includes('feature.explainability=true'));
  assert.equal(capturedHeaders['X-Api-Key'], 'qloo_hackathon_token_abc');
});
