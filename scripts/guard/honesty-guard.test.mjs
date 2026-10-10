import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractClaims,
  classifyClaim,
  auditText,
  auditFiles,
  generateMarkdownMRComment,
  defaultRegistry,
} from './honesty-guard.mjs';

test('Honesty Guard: extractClaims extracts percentages, multipliers, and large numbers', () => {
  const sample = `
  We saw +500% more engagement with 1.42x multiplier.
  There are 35,000 monthly listeners and 250M+ total brand impressions.
  Dimensions are 1440x900.
  `;

  const claims = extractClaims(sample, 'test.md');
  assert.ok(claims.length >= 4);

  const types = claims.map((c) => c.type);
  assert.ok(types.includes('percentage'), 'Must extract percentage');
  assert.ok(types.includes('multiplier'), 'Must extract multiplier');
  assert.ok(types.includes('quantity'), 'Must extract quantity');
});

test('Honesty Guard: classifyClaim marks baseline technical constants as verified', () => {
  const claim1 = {
    match: '1440x900',
    rawLine: 'Visual End-to-End Walkthrough (1440x900)',
    file: 'README.md',
    line: 15,
    type: 'quantity',
  };
  const finding1 = classifyClaim(claim1, defaultRegistry);
  assert.equal(finding1.status, 'verified');

  const claim2 = {
    match: '35,000',
    rawLine: 'We have 35,000 monthly listeners aged 25–40',
    file: 'README.md',
    line: 26,
    type: 'quantity',
  };
  const finding2 = classifyClaim(claim2, defaultRegistry);
  assert.equal(finding2.status, 'verified');
});

test('Honesty Guard: classifyClaim marks explicit field citations as verified', () => {
  const claim = {
    match: '1.42x',
    rawLine: 'Calculated 1.42x affinity [field: results.entities[0].affinity]',
    file: 'pitch.md',
    line: 10,
    type: 'multiplier',
  };
  const finding = classifyClaim(claim, defaultRegistry);
  assert.equal(finding.status, 'verified');
  assert.equal(finding.severity, 'none');
});

test('Honesty Guard: classifyClaim blocks unbacked 500% more engagement claim', () => {
  const claim = {
    match: '500%',
    rawLine: 'Our new AI feature generates 500% more engagement for newsletter creators!',
    file: 'README.md',
    line: 42,
    type: 'percentage',
  };
  const finding = classifyClaim(claim, defaultRegistry);
  assert.equal(finding.status, 'blocking');
  assert.equal(finding.severity, 'high');
  assert.ok(finding.suggestion.includes('multiplier'));
});

test('Honesty Guard: classifyClaim blocks 250M+ exaggeration', () => {
  const claim = {
    match: '250M+',
    rawLine: 'Access our 250M+ creator network',
    file: 'copy.md',
    line: 5,
    type: 'quantity',
  };
  const finding = classifyClaim(claim, defaultRegistry);
  assert.equal(finding.status, 'blocking');
});

test('Honesty Guard: classifyClaim marks multiplier missing citation as auto-fixable', () => {
  const claim = {
    match: '3.5x',
    rawLine: 'Expected conversion increase is 3.5x over standard display ads',
    file: 'copy.md',
    line: 8,
    type: 'multiplier',
  };
  const finding = classifyClaim(claim, defaultRegistry);
  assert.equal(finding.status, 'auto-fixable');
  assert.equal(finding.autoFixable, true);
  assert.ok(finding.suggestion.includes('derived: affinity / mean(sample)'));
});

test('Honesty Guard: generateMarkdownMRComment produces structured supervised report', () => {
  const mockReport = {
    summary: {
      totalClaims: 3,
      verified: 1,
      autoFixable: 1,
      needsHuman: 0,
      blocking: 1,
      passed: false,
    },
    findings: [
      {
        id: 'HG-BLOCK-10',
        file: 'README.md',
        line: 10,
        claim: '500%',
        status: 'blocking',
        severity: 'high',
        reason: 'Unbacked marketing percentage.',
        suggestion: 'Replace with empirical multiplier.',
      },
      {
        id: 'HG-FIX-15',
        file: 'README.md',
        line: 15,
        claim: '2.1x',
        status: 'auto-fixable',
        severity: 'low',
        reason: 'Missing derivation tag.',
        suggestion: 'Append [derived: affinity / mean(sample)].',
      },
      {
        id: 'HG-VER-20',
        file: 'README.md',
        line: 20,
        claim: '1440x900',
        status: 'verified',
        severity: 'none',
        reason: 'Known technical constant.',
      },
    ],
  };

  const md = generateMarkdownMRComment(mockReport);
  assert.ok(md.includes('🛡️ SponsorFit Honesty Guard — Audit Report'));
  assert.ok(md.includes('⛔ BLOCKED'));
  assert.ok(md.includes('Supervised Maintainer Checkpoint'));
  assert.ok(md.includes('Action Required Before Merge'));
  assert.ok(md.includes('/approve-fixes'));
});

test('Honesty Guard: auditFiles baseline SponsorFit files pass with zero blocking claims', () => {
  const report = auditFiles(['README.md', 'submission/devpost.md']);
  assert.equal(
    report.summary.blocking,
    0,
    `Baseline clean repo should have 0 blocking claims, found ${report.summary.blocking}`
  );
  assert.equal(report.summary.passed, true);
  assert.ok(report.summary.verified > 0, 'Should verify existing baseline numbers');
});

test('Honesty Guard: synthetic MR with unbacked 500% claim fails audit and blocks merge', () => {
  const syntheticDirtyContent = `
  # SponsorFit Updates
  Now featuring 500% more engagement across all creator campaigns!
  Audience: 35,000 monthly listeners.
  `;

  const report = auditText(syntheticDirtyContent, 'MR-branch-README.md');
  assert.equal(report.summary.passed, false);
  assert.equal(report.summary.blocking, 1);
  assert.equal(report.findings.find((f) => f.claim === '500%').status, 'blocking');
});
