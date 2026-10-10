import test from 'node:test';
import assert from 'node:assert/strict';
import { SponsorFitAgent } from './agent.mjs';
import { QlooClient } from './qloo-client.mjs';

test('SponsorFitAgent: rankBrands deterministically orders by affinity descending', () => {
  const agent = new SponsorFitAgent();
  const mockBrands = [
    { id: 'b1', name: 'Brand Low', affinity: 0.45, category: 'retail', tags: ['budget'] },
    { id: 'b2', name: 'Brand High', affinity: 0.92, category: 'luxury', tags: ['premium'] },
    { id: 'b3', name: 'Brand Mid', affinity: 0.78, category: 'tech', tags: ['modern'] },
  ];

  const ranked = agent.rankBrands(mockBrands, []);
  assert.equal(ranked.length, 3);
  assert.equal(ranked[0].name, 'Brand High');
  assert.equal(ranked[1].name, 'Brand Mid');
  assert.equal(ranked[2].name, 'Brand Low');

  assert.equal(ranked[0].affinityPercent, 92.0);
  assert.ok(ranked[0].multiplierVsBaseline > 1.0);
});

test('SponsorFitAgent: every media kit number traces directly to a Qloo response field', () => {
  const agent = new SponsorFitAgent();
  const mockBrands = [
    {
      id: 'brand_aesop',
      name: 'Aesop',
      affinity: 0.942,
      category: 'personal_care',
      tags: ['luxury', 'sustainable'],
      query: {
        explainability: {
          signals: [{ entity_id: 'seed_1', entity_name: 'A24', influence: 0.82 }],
        },
      },
    },
  ];

  const ranked = agent.rankBrands(mockBrands, []);
  const top = ranked[0];

  assert.equal(top.trace.affinityField, 'results.entities[0].affinity');
  assert.equal(top.trace.affinityValue, 0.942);
  assert.equal(top.trace.categoryField, 'results.entities[0].category');
  assert.equal(top.trace.tagsField, 'results.entities[0].tags');
  assert.equal(top.trace.topSignalField, 'results.entities[0].query.explainability.signals[0].influence');
  assert.equal(top.trace.topSignalInfluence, 0.82);
});

test('SponsorFitAgent: pitches contain explicit field citations and no ungrounded claims', async () => {
  const agent = new SponsorFitAgent({
    qlooClient: new QlooClient({ apiKey: '' }),
  });

  const runResult = await agent.run({
    creatorName: 'The Slow Drift',
    audienceSize: '35,000 monthly listeners',
    seedQueries: ['A24', 'Phoebe Bridgers'],
  });

  assert.equal(runResult.success, true);
  assert.equal(runResult.isMock, true);
  assert.ok(Array.isArray(runResult.pitches));
  assert.ok(runResult.pitches.length > 0);

  for (const pitch of runResult.pitches) {
    assert.equal(typeof pitch.brandName, 'string');
    assert.equal(typeof pitch.subject, 'string');
    assert.ok(pitch.body.includes('[field: results.entities['), 'Pitch body must cite Qloo response fields');
    assert.ok(pitch.citations.length > 0, 'Pitch must include citations list');
  }
});

test('SponsorFitAgent: run outputs full 4-step tool trace with latency and outputs', async () => {
  const agent = new SponsorFitAgent({
    qlooClient: new QlooClient({ apiKey: '' }),
  });

  const res = await agent.run({
    creatorName: 'Kinetic Studio',
    audienceSize: '50,000 subscribers',
    seedQueries: ['A24', 'Severance'],
  });

  assert.equal(res.success, true);
  assert.ok(Array.isArray(res.toolTrace));
  assert.equal(res.toolTrace.length, 4);

  assert.equal(res.toolTrace[0].tool, 'qloo_search_entities');
  assert.equal(res.toolTrace[1].tool, 'qloo_get_insights');
  assert.equal(res.toolTrace[2].tool, 'deterministic_ranking_engine');
  assert.equal(res.toolTrace[3].tool, 'deterministic_template_writer');

  for (const step of res.toolTrace) {
    assert.ok(step.latencyMs >= 0);
    assert.ok(step.summary.length > 0);
  }
});
