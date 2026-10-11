#!/usr/bin/env node

/**
 * SponsorFit Honesty Guard — Static & Diff Claim Provenance Auditor
 *
 * Scans markdown documentation, submission drafts, and copy for numeric claims,
 * benchmarking multipliers, and marketing percentages. Audits each claim against
 * the grounded provenance registry and ensures mathematical verification.
 *
 * Outputs:
 * 1. Machine-readable JSON honesty report (for CI artifact and GitLab Duo agent ingestion)
 * 2. Formatted Markdown MR discussion comment (for GitLab supervised review checkpoints)
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..', '..');

// Load registry
const REGISTRY_PATH = join(__dirname, 'provenance-registry.json');
export const defaultRegistry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8'));

/**
 * Extracts numeric, percentage, and multiplier claims from text.
 * @param {string} content - Raw file text
 * @param {string} filePath - Path for reporting line numbers
 * @returns {Array<object>} Extracted candidate claims
 */
export function extractClaims(content, filePath = 'unknown') {
  const lines = content.split(/\r?\n/);
  const claims = [];

  // Patterns for claims
  const percentageRegex = /([+-]?\d+(?:\.\d+)?%)/g;
  const multiplierRegex = /(\b\d+(?:\.\d+)?x\b)/gi;
  const largeScaleRegex = /(\b\d+(?:,\d+)*(?:\.\d+)?[MBKk]\b|\b\d{1,3}(?:,\d{3})+\b)/g;

  // Adoption & social proof covered phrases:
  // "trusted by N", "N+ users/creators/customers/brands/teams", "used by N", "join N", "N downloads", "rated N stars"
  const adoptionPatterns = [
    /\btrusted\s+by\s+(?:(?:~|over|almost|approx\.?|approximately)\s+)?(\d[\d,]*(?:\.\d+)?(?:[MBKk])?\+?|\d+)\b/gi,
    /\b(\d[\d,]*(?:\.\d+)?(?:[MBKk])?)\+\s*(?:[a-zA-Z]+\s+)?(?:users|creators|customers|brands|teams)\b/gi,
    /\bused\s+by\s+(?:(?:~|over|almost|approx\.?|approximately)\s+)?(\d[\d,]*(?:\.\d+)?(?:[MBKk])?\+?|\d+)\b/gi,
    /\bjoin\s+(?:(?:~|over|almost|approx\.?|approximately)\s+)?(\d[\d,]*(?:\.\d+)?(?:[MBKk])?\+?|\d+)\b/gi,
    /\b(\d[\d,]*(?:\.\d+)?(?:[MBKk])?\+?|\d+)\s+downloads?\b/gi,
    /\brated\s+(?:(?:~|over|almost|approx\.?|approximately)\s+)?(\d[\d,]*(?:\.\d+)?(?:[MBKk])?\+?|\d+)\s+stars?\b/gi,
  ];

  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1;
    // Skip markdown image tags or pure URLs
    if (lineText.trim().startsWith('![') || lineText.trim().startsWith('http')) {
      return;
    }

    const matchedSpans = [];

    function addClaim(matchStr, type, index, spanLen = matchStr.length) {
      const start = index;
      const end = index + spanLen;
      for (const span of matchedSpans) {
        if (Math.max(start, span.start) < Math.min(end, span.end)) {
          return;
        }
      }
      matchedSpans.push({ start, end });
      claims.push({
        file: filePath,
        line: lineNum,
        rawLine: lineText.trim(),
        match: matchStr,
        type,
        index,
      });
    }

    // 1. Percentage claims
    let match;
    while ((match = percentageRegex.exec(lineText)) !== null) {
      addClaim(match[1], 'percentage', match.index);
    }

    // 2. Multiplier claims
    while ((match = multiplierRegex.exec(lineText)) !== null) {
      addClaim(match[1], 'multiplier', match.index);
    }

    // 3. Adoption & social proof claims
    for (const pat of adoptionPatterns) {
      pat.lastIndex = 0;
      while ((match = pat.exec(lineText)) !== null) {
        const numOffset = match[0].indexOf(match[1]);
        const numIndex = numOffset >= 0 ? match.index + numOffset : match.index;
        addClaim(match[1], 'adoption', numIndex, match[0].length);
      }
    }

    // 4. Large quantities / numbers
    while ((match = largeScaleRegex.exec(lineText)) !== null) {
      addClaim(match[1], 'quantity', match.index);
    }
  });

  return claims;
}

/**
 * Classifies an extracted claim against provenance registry and surrounding context.
 * @param {object} claim - Extracted claim object
 * @param {object} registry - Provenance registry rules
 * @returns {object} Classified finding
 */
export function classifyClaim(claim, registry = defaultRegistry) {
  const { match, rawLine, file, line } = claim;

  // Check 1: Explicit inline citations (e.g., [field: ...], [derived: ...])
  for (const sig of registry.allowedCitationSignatures) {
    const re = new RegExp(sig, 'i');
    if (re.test(rawLine)) {
      return {
        id: `HG-VER-${line}-${Math.abs(hashString(match)) % 10000}`,
        file,
        line,
        rawLine,
        claim: match,
        status: 'verified',
        severity: 'none',
        reason: 'Explicit empirical field or derivation citation present in context.',
        autoFixable: false,
      };
    }
  }

  // Check 2: Project baseline technical constants declared in provenance registry
  const baselines = registry.projectBaselines || {};
  const isBaseline =
    (baselines.dimensions && baselines.dimensions.some((d) => rawLine.includes(d))) ||
    (baselines.audienceExamples &&
      baselines.audienceExamples.some((a) => rawLine.includes(a) || match === String(a))) ||
    (baselines.runtimeSpecs && baselines.runtimeSpecs.some((s) => rawLine.includes(s))) ||
    (baselines.port && match.includes(String(baselines.port))) ||
    (baselines.httpStatuses && baselines.httpStatuses.some((status) => match === String(status)));

  if (isBaseline) {
    return {
      id: `HG-VER-${line}-${Math.abs(hashString(match)) % 10000}`,
      file,
      line,
      rawLine,
      claim: match,
      status: 'verified',
      severity: 'none',
      reason: 'Known technical baseline constant declared in provenance registry.',
      autoFixable: false,
    };
  }

  // Check 3: Banned unbacked marketing superlative patterns from registry
  if (registry.unbackedMarketingSignatures) {
    for (const rule of registry.unbackedMarketingSignatures) {
      const re = new RegExp(rule.pattern, 'i');
      if (re.test(rawLine)) {
        return {
          id: `HG-BLOCK-${line}-${Math.abs(hashString(match)) % 10000}`,
          file,
          line,
          rawLine,
          claim: match,
          status: 'blocking',
          severity: 'high',
          reason: rule.reason,
          suggestion: rule.suggestedFix,
          autoFixable: false,
        };
      }
    }
  }

  // Check 4: Covered adoption and social-proof claims without provenance
  // ("trusted by N", "N+ users/creators/customers/brands/teams", "used by N", "join N", "N downloads", "rated N stars")
  const adoptionSignatures = [
    {
      re: /\btrusted\s+by\s+(?:(?:~|over|almost|approx\.?|approximately)\s+)?(?:\d[\d,]*(?:\.\d+)?(?:[MBKk])?\+?|\d+)/i,
      reason: 'Unsourced adoption claim ("trusted by N") without verified platform telemetry or provenance tag.',
      suggestion: 'Remove unsourced adoption figure or cite verified provenance in registry.',
    },
    {
      re: /\b(?:\d[\d,]*(?:\.\d+)?(?:[MBKk])?)\+\s*(?:[a-zA-Z]+\s+)?(?:users|creators|customers|brands|teams)\b/i,
      reason: 'Unsourced user community scale claim ("N+ users/creators/customers/brands/teams") without documented telemetry or provenance tag.',
      suggestion: 'Remove unsourced community scale figure or cite verified provenance in registry.',
    },
    {
      re: /\bused\s+by\s+(?:(?:~|over|almost|approx\.?|approximately)\s+)?(?:\d[\d,]*(?:\.\d+)?(?:[MBKk])?\+?|\d+)/i,
      reason: 'Unsourced usage adoption claim ("used by N") without verified telemetry or provenance tag.',
      suggestion: 'Remove unsourced usage figure or cite verified provenance in registry.',
    },
    {
      re: /\bjoin\s+(?:(?:~|over|almost|approx\.?|approximately)\s+)?(?:\d[\d,]*(?:\.\d+)?(?:[MBKk])?\+?|\d+)/i,
      reason: 'Unsourced user count call-to-action ("join N") without verified registry backing.',
      suggestion: 'Remove unsourced count or cite verified provenance in registry.',
    },
    {
      re: /\b(?:\d[\d,]*(?:\.\d+)?(?:[MBKk])?\+?|\d+)\s+downloads?\b/i,
      reason: 'Unsourced download count claim ("N downloads") without verified registry backing.',
      suggestion: 'Remove download count or cite verified provenance in registry.',
    },
    {
      re: /\brated\s+(?:(?:~|over|almost|approx\.?|approximately)\s+)?(?:\d[\d,]*(?:\.\d+)?(?:[MBKk])?\+?|\d+)\s+stars?\b/i,
      reason: 'Unsourced review or star rating social proof ("rated N stars") without verified review source.',
      suggestion: 'Remove star rating claim or cite verified provenance in registry.',
    },
  ];

  for (const sig of adoptionSignatures) {
    if (sig.re.test(rawLine) || claim.type === 'adoption') {
      return {
        id: `HG-BLOCK-${line}-${Math.abs(hashString(match)) % 10000}`,
        file,
        line,
        rawLine,
        claim: match,
        status: 'blocking',
        severity: 'high',
        reason: sig.reason,
        suggestion: sig.suggestion,
        autoFixable: false,
      };
    }
  }

  // Check 5: Mathematical multipliers matching fixture benchmark
  if (claim.type === 'multiplier') {
    const numericVal = parseFloat(match.replace(/x/i, ''));
    if (
      Math.abs(numericVal - baselines.benchmarks.topMultiplier) < 0.05 ||
      rawLine.includes('affinity / mean')
    ) {
      return {
        id: `HG-VER-${line}-${Math.abs(hashString(match)) % 10000}`,
        file,
        line,
        rawLine,
        claim: match,
        status: 'verified',
        severity: 'none',
        reason: 'Matches verified fixture sample mean multiplier.',
        autoFixable: false,
      };
    }

    // If multiplier has no citation, auto-fixable by appending the derivation note
    return {
      id: `HG-FIX-${line}-${Math.abs(hashString(match)) % 10000}`,
      file,
      line,
      rawLine,
      claim: match,
      status: 'auto-fixable',
      severity: 'low',
      reason: 'Multiplier missing required standard disclosure tag [derived: affinity / mean(sample)].',
      suggestion: `Append '[derived: affinity / mean(sample)]' after ${match}.`,
      autoFixable: true,
    };
  }

  // Check 5: Percentage claims without explicit citations
  if (claim.type === 'percentage') {
    const pctVal = parseFloat(match.replace(/%/g, ''));
    // Moderate percentages in technical context (e.g. 100%, 0%)
    if (pctVal === 100 || pctVal === 0) {
      return {
        id: `HG-VER-${line}-${Math.abs(hashString(match)) % 10000}`,
        file,
        line,
        rawLine,
        claim: match,
        status: 'verified',
        severity: 'none',
        reason: 'Standard binary completeness or baseline percentage.',
        autoFixable: false,
      };
    }

    // High percentages without citation are blocking
    if (pctVal >= 100) {
      return {
        id: `HG-BLOCK-${line}-${Math.abs(hashString(match)) % 10000}`,
        file,
        line,
        rawLine,
        claim: match,
        status: 'blocking',
        severity: 'high',
        reason: `Exaggerated percentage claim (${match}) without documented control baseline.`,
        suggestion: `Disclose exact measured ratio or replace with index score multiplier.`,
        autoFixable: false,
      };
    }

    // Other percentages need human review
    return {
      id: `HG-HUMAN-${line}-${Math.abs(hashString(match)) % 10000}`,
      file,
      line,
      rawLine,
      claim: match,
      status: 'needs-human',
      severity: 'medium',
      reason: `Statistical percentage (${match}) requires citation confirmation from data team.`,
      suggestion: `Add inline citation link or [field: ...] tag to substantiate claim.`,
      autoFixable: false,
    };
  }

  // Check 6: Unclassified quantities
  return {
    id: `HG-HUMAN-${line}-${Math.abs(hashString(match)) % 10000}`,
    file,
    line,
    rawLine,
    claim: match,
    status: 'needs-human',
    severity: 'low',
    reason: `Metric figure ${match} not registered in technical baseline list.`,
    suggestion: `Verify whether this is a product specification or register in provenance-registry.json.`,
    autoFixable: false,
  };
}

/**
 * Audits a single text string or file content.
 * @param {string} content - Raw content
 * @param {string} filePath - Virtual or real file path
 * @param {object} registry - Registry config
 * @returns {object} Audit result
 */
export function auditText(content, filePath = 'snippet.md', registry = defaultRegistry) {
  const claims = extractClaims(content, filePath);
  const findings = claims.map((c) => classifyClaim(c, registry));

  const verified = findings.filter((f) => f.status === 'verified').length;
  const autoFixable = findings.filter((f) => f.status === 'auto-fixable').length;
  const needsHuman = findings.filter((f) => f.status === 'needs-human').length;
  const blocking = findings.filter((f) => f.status === 'blocking').length;
  const passed = blocking === 0;

  return {
    timestamp: new Date().toISOString(),
    summary: {
      totalClaims: findings.length,
      verified,
      autoFixable,
      needsHuman,
      blocking,
      passed,
    },
    findings,
  };
}

/**
 * Audits an array of file paths.
 * @param {Array<string>} filePaths - Paths relative to repo root or absolute
 * @param {object} registry - Registry config
 * @returns {object} Full audit report
 */
export function auditFiles(filePaths, registry = defaultRegistry) {
  const allFindings = [];

  for (const fp of filePaths) {
    let fullPath = fp;
    if (!existsSync(fullPath)) {
      fullPath = join(REPO_ROOT, fp);
    }
    if (!existsSync(fullPath)) {
      fullPath = join(process.cwd(), fp);
    }
    if (!existsSync(fullPath)) continue;

    const content = readFileSync(fullPath, 'utf-8');
    const relPath = relative(REPO_ROOT, fullPath).replace(/\\/g, '/');
    const result = auditText(content, relPath || fp, registry);
    allFindings.push(...result.findings);
  }

  const verified = allFindings.filter((f) => f.status === 'verified').length;
  const autoFixable = allFindings.filter((f) => f.status === 'auto-fixable').length;
  const needsHuman = allFindings.filter((f) => f.status === 'needs-human').length;
  const blocking = allFindings.filter((f) => f.status === 'blocking').length;
  const passed = blocking === 0;

  return {
    timestamp: new Date().toISOString(),
    engine: 'SponsorFit Honesty Guard v1.0.0',
    summary: {
      totalClaims: allFindings.length,
      verified,
      autoFixable,
      needsHuman,
      blocking,
      passed,
    },
    findings: allFindings,
  };
}

/**
 * Generates structured GitLab MR comment markdown for supervised agent review.
 * @param {object} report - Report object from auditFiles or auditText
 * @returns {string} Markdown comment body
 */
export function generateMarkdownMRComment(report) {
  const { summary, findings } = report;
  const statusIcon = summary.passed ? '✅ PASSED' : '⛔ BLOCKED';
  const badgeColor = summary.passed ? 'green' : 'red';

  let md = `## 🛡️ SponsorFit Honesty Guard — Audit Report\n\n`;
  md += `**Status:** ${statusIcon} (Policy Compliance: ${summary.passed ? 'Clean' : 'Violations Detected'})\n\n`;
  md += `| Category | Count | Status Description |\n`;
  md += `| :--- | :---: | :--- |\n`;
  md += `| 🟢 **Verified** | ${summary.verified} | Grounded in fixtures, code constants, or citation tags |\n`;
  md += `| 🟡 **Auto-Fixable** | ${summary.autoFixable} | Missing formatting/derivation citation; can apply automatically |\n`;
  md += `| 🟠 **Needs Human** | ${summary.needsHuman} | Ambiguous number; requires maintainer verification |\n`;
  md += `| 🔴 **Blocking** | ${summary.blocking} | Unbacked marketing superlative or banned claim; **merge prohibited** |\n\n`;

  if (findings.length > 0) {
    md += `### Detailed Findings\n\n`;
    md += `| Status | File & Line | Claim | Severity | Recommendation |\n`;
    md += `| :--- | :--- | :--- | :---: | :--- |\n`;

    findings.forEach((f) => {
      const icon =
        f.status === 'verified'
          ? '🟢 Verified'
          : f.status === 'auto-fixable'
          ? '🟡 Auto-Fix'
          : f.status === 'needs-human'
          ? '🟠 Review'
          : '🔴 Blocking';
      const fileLoc = `\`${f.file}:${f.line}\``;
      const claimSnippet = `\`${f.claim}\``;
      const recommendation = f.suggestion || f.reason;
      md += `| ${icon} | ${fileLoc} | ${claimSnippet} | ${f.severity} | ${recommendation} |\n`;
    });
    md += `\n`;
  }

  // Supervised action checkpoint
  md += `### 🧑‍💻 Supervised Maintainer Checkpoint\n\n`;
  if (summary.blocking > 0) {
    md += `> ⚠️ **Action Required Before Merge:**\n`;
    md += `> ${summary.blocking} blocking claim(s) detected. The agent cannot automatically approve this merge request.\n`;
    md += `> To proceed, please resolve the unbacked claims in your branch or comment with revised empirical citations.\n\n`;
  }

  if (summary.autoFixable > 0) {
    md += `> ℹ️ **Supervised Auto-Fix Ready:**\n`;
    md += `> Reply with \`/approve-fixes\` in this thread to instruct the Honesty Guard agent to apply suggested derivation tags to your branch.\n\n`;
  }

  if (summary.blocking === 0 && summary.autoFixable === 0 && summary.needsHuman === 0) {
    md += `> ✨ **All claims verified.** Ready for maintainer sign-off.\n\n`;
  }

  md += `*Generated automatically by GitLab Duo Flow \`honesty-guard.yaml\` via \`scripts/guard/honesty-guard.mjs\`*\n`;
  return md;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// CLI Execution entry point
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  let outputPath = null;
  let strict = false;
  let targetFiles = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' && args[i + 1]) {
      outputPath = args[i + 1];
      i++;
    } else if (args[i] === '--strict') {
      strict = true;
    } else if (args[i] === '--files' && args[i + 1]) {
      targetFiles.push(...args[i + 1].split(','));
      i++;
    } else if (!args[i].startsWith('--')) {
      targetFiles.push(args[i]);
    }
  }

  if (targetFiles.length === 0) {
    targetFiles = ['README.md', 'submission/devpost.md', 'submission/video-script.md'];
  }

  console.log(`🛡️ SponsorFit Honesty Guard: Auditing ${targetFiles.length} file(s)...`);
  const report = auditFiles(targetFiles);

  console.log(
    `Claims summary: Total=${report.summary.totalClaims}, Verified=${report.summary.verified}, ` +
      `AutoFixable=${report.summary.autoFixable}, NeedsHuman=${report.summary.needsHuman}, ` +
      `Blocking=${report.summary.blocking}, Passed=${report.summary.passed}`
  );

  if (!report.summary.passed) {
    console.log(`Status: ⛔ BLOCKED (passed: false, ${report.summary.blocking} blocking claim(s) detected)`);
    for (const f of report.findings.filter((f) => f.status === 'blocking')) {
      console.log(` - [BLOCKING] ${f.file}:${f.line} -> "${f.claim}": ${f.reason}`);
    }
  } else {
    console.log(`Status: ✅ PASSED (passed: true)`);
  }

  if (outputPath) {
    const fullOut = outputPath.startsWith('/') || outputPath.includes(':') ? outputPath : join(REPO_ROOT, outputPath);
    writeFileSync(fullOut, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`Saved report to ${outputPath}`);
  }

  if (strict && !report.summary.passed) {
    console.error(`❌ Honesty Guard failed: ${report.summary.blocking} blocking claim(s) detected.`);
    process.exit(1);
  }

  process.exit(0);
}
