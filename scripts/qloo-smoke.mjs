import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SponsorFitAgent } from '../api/agent.mjs';
import { QlooClient } from '../api/qloo-client.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locate and load the workspace .env if QLOO_API_KEY is not already in process.env
if (!process.env.QLOO_API_KEY) {
  const envPaths = [
    path.resolve(__dirname, '../../../.env'),
    path.resolve(process.cwd(), '../../.env'),
    path.resolve(process.cwd(), '.env'),
  ];
  for (const envPath of envPaths) {
    try {
      if (typeof process.loadEnvFile === 'function') {
        process.loadEnvFile(envPath);
        if (process.env.QLOO_API_KEY) break;
      }
    } catch {
      // try next path
    }
  }
}

if (!process.env.QLOO_API_KEY) {
  console.error('Error: QLOO_API_KEY is missing from process.env and .env');
  process.exit(1);
}

const client = new QlooClient();
if (client.isMockMode()) {
  console.error('Error: QlooClient is in mock mode despite QLOO_API_KEY');
  process.exit(1);
}

const agent = new SponsorFitAgent({ qlooClient: client });

console.log('Running SponsorFit agent live smoke audit...');
const sampleCreator = {
  creatorName: 'The Paddock & Stage Show',
  audienceSize: '100,000 monthly listeners',
  seedQueries: ['Taylor Swift', 'Formula 1'],
};

const result = await agent.run(sampleCreator);

console.log(`isMock: ${result.isMock}`);
console.log(`resolvedEntities count: ${result.resolvedEntities.length}`);

const top3 = result.rankedSponsors.slice(0, 3);
console.log('Top 3 Sponsors:');
top3.forEach((sponsor, idx) => {
  console.log(`  ${idx + 1}. ${sponsor.name} — affinity: ${sponsor.affinity} (${sponsor.affinityPercent}%)`);
});

const allRealResponses =
  top3.length > 0 &&
  top3.every(
    (s) =>
      typeof s.affinity === 'number' &&
      s.affinity > 0 &&
      s.affinity <= 1 &&
      typeof s.trace?.affinityValue === 'number' &&
      s.trace.affinityValue > 0
  );

console.log(`Every affinity came from a real response: ${allRealResponses}`);

if (result.isMock !== false || !allRealResponses || top3.length === 0) {
  console.error('Smoke check failed: response did not meet live requirements.');
  process.exit(1);
}
