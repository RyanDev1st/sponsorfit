import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { QlooClient } from '../api/qloo-client.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rawSearchBlob = JSON.parse(
  readFileSync(join(__dirname, '../scratch_live/search.json'), 'utf8')
);
const rawInsightsBlob = JSON.parse(
  readFileSync(join(__dirname, '../scratch_live/insights.json'), 'utf8')
);

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

test('QlooClient: live normalization of search response maps entity_id -> id and types[0] -> type', async () => {
  const mockFetch = async () => ({
    ok: true,
    json: async () => structuredClone(rawSearchBlob),
  });

  const client = new QlooClient({
    apiKey: 'dummy_hackathon_key',
    fetchFn: mockFetch,
  });

  const res = await client.searchEntities('Taylor Swift', 'urn:entity:artist');
  assert.equal(res.isMock, false);
  assert.ok(Array.isArray(res.results), 'results must be an array');
  assert.ok(res.results.length > 0, 'results must not be empty');

  const first = res.results[0];
  assert.equal(typeof first.id, 'string', 'result[0].id must be a string');
  assert.match(first.id, UUID_REGEX, 'result[0].id must be a UUID string');
  assert.equal(first.type, 'urn:entity:artist', 'result[0].type must be urn:entity:artist');
});

test('QlooClient: live normalization of insights response exposes brand affinity and explainability signals', async () => {
  const mockFetch = async () => ({
    ok: true,
    json: async () => structuredClone(rawInsightsBlob),
  });

  const client = new QlooClient({
    apiKey: 'dummy_hackathon_key',
    fetchFn: mockFetch,
  });

  const res = await client.getInsights({
    filterType: 'urn:entity:brand',
    signalEntityIds: ['3C9EEC3A-F4FE-48A4-B89F-97375F292448'],
    explainability: true,
  });

  assert.equal(res.isMock, false);
  assert.ok(Array.isArray(res.results?.entities), 'results.entities must be an array');
  assert.ok(res.results.entities.length > 0, 'entities must not be empty');

  const topBrand = res.results.entities[0];
  assert.equal(typeof topBrand.affinity, 'number', 'brand[0].affinity must be a number');
  assert.ok(topBrand.affinity > 0, 'brand[0].affinity must be > 0');
  assert.equal(topBrand.affinity, topBrand.query.affinity, 'brand[0].affinity must match query.affinity');

  assert.ok(
    Array.isArray(topBrand.query?.explainability?.signals),
    'query.explainability.signals must be an array'
  );
  assert.ok(topBrand.query.explainability.signals.length > 0);

  const firstSignal = topBrand.query.explainability.signals[0];
  assert.equal(typeof firstSignal.entity_id, 'string');
  assert.match(firstSignal.entity_id, UUID_REGEX, 'signals[0].entity_id must be a UUID');
});
