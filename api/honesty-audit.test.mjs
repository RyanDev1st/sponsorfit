import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { SponsorFitAgent } from './agent.mjs';
import { QlooClient } from './qloo-client.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mockBrandsData = JSON.parse(
  readFileSync(join(__dirname, 'mocks', 'insights-brands.json'), 'utf-8')
);
const mockSearchResults = JSON.parse(
  readFileSync(join(__dirname, 'mocks', 'search-results.json'), 'utf-8')
);

test('Honesty Audit: all sponsor rankings and multipliers trace strictly to mock fixture fields', async () => {
  const agent = new SponsorFitAgent({
    qlooClient: new QlooClient({ apiKey: '' }),
  });

  const runResult = await agent.run({
    creatorName: 'The Slow Drift',
    audienceSize: '35,000 monthly listeners',
    seedQueries: ['A24', 'Phoebe Bridgers', 'Severance', 'Tartine Bakery'],
  });

  assert.equal(runResult.success, true);
  const { rankedSponsors, mediaKit, pitches } = runResult;

  // 1. Assert sample mean baseline is strictly computed from raw fixture affinities
  const rawEntities = mockBrandsData.results.entities;
  const rawAffinities = rawEntities.map((e) => e.affinity);
  const expectedMean = rawAffinities.reduce((a, b) => a + b, 0) / rawAffinities.length;

  for (const sponsor of rankedSponsors) {
    // Locate original fixture entity
    const fixtureEntity = rawEntities.find((e) => e.id === sponsor.id);
    assert.ok(fixtureEntity, `Sponsor ${sponsor.name} must exist in mock fixture`);

    // Verify exact affinity value and formatted percent
    assert.equal(sponsor.affinity, fixtureEntity.affinity);
    assert.equal(sponsor.affinityPercent, Number((fixtureEntity.affinity * 100).toFixed(1)));

    // Verify deterministic multiplier against candidate set mean
    const expectedMultiplier = Number((fixtureEntity.affinity / expectedMean).toFixed(2));
    assert.equal(sponsor.multiplierVsBaseline, expectedMultiplier);

    // Verify trace field path exists
    assert.match(sponsor.trace.affinityField, /^results\.entities\[\d+\]\.affinity$/);

    // Verify explainability driver if present
    if (fixtureEntity.query?.explainability?.signals?.length > 0) {
      const topSignal = fixtureEntity.query.explainability.signals[0];
      assert.equal(sponsor.topDriver.influence, topSignal.influence);
      assert.match(sponsor.trace.topSignalField, /^results\.entities\[\d+\]\.query\.explainability\.signals\[0\]\.influence$/);
    }
  }

  // 2. Assert media kit tiers have provenance paths and no ungrounded claims
  for (const tier of mediaKit.sponsorTiers) {
    assert.match(tier.fieldCitation, /^results\.entities\[\d+\]\.affinity$/);
    assert.ok(tier.affinityMultiplier.includes('vs sample mean'));
  }

  // 3. Assert pitches have zero ungrounded marketing claims
  for (const pitch of pitches) {
    // Assert no marketing exaggerations
    assert.ok(!pitch.body.includes('250M+'), 'Pitch must not include unbacked 250M+ claim');
    assert.ok(!pitch.body.includes('outperforming'), 'Pitch must not include ungrounded outperforming claim');
    assert.ok(!pitch.body.includes('above category benchmark'), 'Pitch must not claim unbacked category benchmark');

    // Assert explicit field grounding citations
    assert.ok(pitch.body.includes('[field: results.entities['), 'Pitch must cite exact field');
    assert.ok(pitch.body.includes('[derived: affinity / mean(sample)]'), 'Pitch must disclose multiplier derivation');

    // Assert every citation string is a recognized Qloo response property
    for (const citation of pitch.citations) {
      assert.ok(
        citation.startsWith('results.entities[') &&
          (citation.endsWith('.affinity') || citation.endsWith('.tags') || citation.endsWith('.influence')),
        `Citation ${citation} must point to a legitimate response field`
      );
    }
  }
});
