#!/usr/bin/env node

/**
 * CI Test-Count Guard for SponsorFit
 *
 * Ensures that test runner invocations execute a non-zero number of tests.
 * Prevents false-positive CI passes on Node 20.x where unexpanded quoted globs
 * exit 0 with "# tests 0".
 */

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..');

const DEFAULT_TEST_FILES = [
  'api/agent.test.mjs',
  'api/handler.test.mjs',
  'api/honesty-audit.test.mjs',
  'api/qloo-client.test.mjs',
  'api/vercel-adapter.test.mjs',
  'scripts/guard/honesty-guard.test.mjs',
];

const targetFiles = process.argv.slice(2).length > 0 ? process.argv.slice(2) : DEFAULT_TEST_FILES;

console.log(`[CI test-count guard] Running test runner on ${targetFiles.length} file(s)...`);

const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...targetFiles], {
  cwd: REPO_ROOT,
  encoding: 'utf-8',
  stdio: ['inherit', 'pipe', 'pipe'],
});

const stdout = result.stdout || '';
const stderr = result.stderr || '';
const combined = stdout + '\n' + stderr;

process.stdout.write(stdout);
process.stderr.write(stderr);

if (result.status !== 0) {
  console.error(`\n[CI test-count guard] ❌ Test process failed with exit code ${result.status}`);
  process.exit(result.status ?? 1);
}

const testsMatch = combined.match(/# tests\s+(\d+)/);
if (!testsMatch) {
  console.error('\n[CI test-count guard] ❌ Could not parse TAP "# tests <N>" summary from runner output.');
  process.exit(1);
}

const totalTests = parseInt(testsMatch[1], 10);
if (totalTests === 0) {
  console.error('\n[CI test-count guard] ❌ FAILED: Reported test count is 0 (# tests 0). Test files may not have expanded or were not found.');
  process.exit(1);
}

const failMatch = combined.match(/# fail\s+(\d+)/);
const failCount = failMatch ? parseInt(failMatch[1], 10) : 0;
if (failCount > 0) {
  console.error(`\n[CI test-count guard] ❌ FAILED: ${failCount} test(s) failed (# fail ${failCount}).`);
  process.exit(1);
}

console.log(`\n[CI test-count guard] ✅ PASSED: ${totalTests} test(s) executed (# tests ${totalTests}), 0 failed (# fail 0).`);
process.exit(0);
