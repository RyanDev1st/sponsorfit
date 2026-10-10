# SponsorFit Honesty Guard: Supervised Demo Walkthrough & Video Script

**Target Hackathon Track:** Path B (Bring Your Own Code) — Best Supervised Agent ($4,500 Prize)  
**Total Video Target Duration:** 2 minutes 40 seconds (Strict limit: ≤ 2:45)  
**Repository:** [https://github.com/RyanDev1st/sponsorfit](https://github.com/RyanDev1st/sponsorfit)  

---

## 1. Demo Narrative: Speed with Control

In the era of AI-generated content and autonomous coding, marketing copy and developer documentation are increasingly polluted with hallucinated metrics and unbacked claims (e.g. *"increases conversion by 500%"*). 

**SponsorFit Honesty Guard** is a supervised GitLab Duo Agent that demonstrates **"Speed with Control"**. Instead of letting autonomous agents blindly push changes or hallucinate claims, Honesty Guard audits code and copy against empirical ground truth, classifies risks, and strictly **waits for human maintainer authorization** at defined supervision gates before taking action.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Supervised Lifecycle State Machine                   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   [ Developer Opens MR ]                                               │
│   Adds unbacked "+500% engagement" claim to README.md                  │
│             │                                                          │
│             ▼                                                          │
│   [ Phase 1: Autonomous Audit ]                                        │
│   GitLab Duo Flow executes honesty-guard.mjs & test suite              │
│             │                                                          │
│             ▼                                                          │
│   [ Phase 2: Structured Review ]                                       │
│   Posts MR Comment: 🔴 Blocking violation, suggests 1.42x multiplier   │
│             │                                                          │
│             ▼                                                          │
│   [ SUPERVISION GATE #1 ] ──▶ Maintainer replies: "/approve-fixes"     │
│   Agent WAITS for human       (or rejects MR)                          │
│             │                                                          │
│             ▼                                                          │
│   [ Phase 3: Remediated Merge ]                                        │
│   Agent applies empirical citation tag; pipeline turns green; merge   │
│             │                                                          │
│             ▼                                                          │
│   [ SUPERVISION GATE #2 ] ──▶ Maintainer replies: "/approve-release"   │
│   Agent drafts release notes  Release published to GitLab & Pages live │
│   WAITS for final sign-off                                             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The 5-Act Supervised Scenario

### Act 1: The Unbacked Claim (MR Opened)
A developer submits a feature branch proposing to boost creator outreach. In `README.md`, they add:
> *"Our new AI cultural match engine delivers **500% more engagement** for podcast sponsorships!"*

### Act 2: Autonomous Provenance Audit
The GitLab Duo Flow (`honesty-guard.yaml`) triggers immediately on the MR:
1. Executes `honesty_audit` job in `.gitlab-ci.yml`.
2. Static scanner detects `500%` matching unbacked marketing superlative regex without empirical fixture grounding.
3. Flow generates `honesty-report.json`:
   - `summary.blocking: 1`
   - `summary.passed: false`
4. Duo Agent posts structured MR note:
   ```markdown
   ## 🛡️ SponsorFit Honesty Guard — Audit Report
   Status: ⛔ BLOCKED (Policy Compliance: Violations Detected)
   
   | Status | File & Line | Claim | Severity | Recommendation |
   | :--- | :--- | :--- | :---: | :--- |
   | 🔴 Blocking | `README.md:42` | `500%` | high | Replace with empirical sample multiplier: '1.42x cultural affinity multiplier [derived: affinity / mean(sample)]' |
   
   ### 🧑‍💻 Supervised Maintainer Checkpoint
   > ⚠️ Action Required Before Merge: 1 blocking claim detected.
   > Reply with `/approve-fixes` to authorize the agent to apply suggested empirical citations.
   ```

### Act 3: Supervised Human Authorization Gate
The autonomous loop halts. The MR merge button is disabled by the failed CI check.  
The repository maintainer inspects the MR discussion and replies:
> **Maintainer:** `/approve-fixes`

### Act 4: Remediated Patch & Clean Merge
With explicit human authorization recorded in the event log:
1. Duo Agent commits the suggested replacement:
   > *"Our new AI cultural match engine delivers **1.42x cultural affinity multiplier** `[derived: affinity / mean(sample)]` for podcast sponsorships!"*
2. CI pipeline re-executes:
   - `test_suite`: 16 API tests + 9 Guard tests pass.
   - `honesty_audit`: 0 blocking claims; exits code 0.
   - `build_spa`: Vite compiles production SPA to `dist/`.
3. Merge request turns green; maintainer merges the branch.

### Act 5: Post-Merge Release Supervision
Post-merge trigger activates the second supervised agent:
1. Agent synthesizes release notes highlighting verified mathematical additions and zero ungrounded claims.
2. Compiles deployment verification check for GitLab Pages (`public/` static bundle).
3. Posts release preview asking: *"Ready to tag v0.2.0? Reply with `/approve-release`"*.
4. Maintainer approves; release is published.

---

## 3. Video Production Shot List (Total Duration: 2:40)

| Timestamp | Scene / Visual | Voiceover / Script Narration | On-Screen Action |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:25** (25s) | **Title & Problem**<br>Screen: SponsorFit GitHub repo & architecture diagram. | *"Welcome to SponsorFit Honesty Guard. When AI builds post-code workflows, autonomous speed must never compromise factual honesty. Built for GitLab's 'Life After Code' hackathon, Honesty Guard is a supervised Duo agent that protects projects from hallucinated marketing and ungrounded metrics."* | Pan over `README.md` and show the 4-step Qloo Taste Graph pipeline. |
| **0:25 – 0:55** (30s) | **The Dirty MR**<br>Screen: GitLab Merge Request UI. | *"Here, a developer opens an MR adding an exaggerated claim: '500% more engagement'. Traditional linters ignore this, but our GitLab Duo Flow triggers automatically on the merge request event."* | Show diff adding `500% more engagement` to `README.md`. Click **Create Merge Request**. |
| **0:55 – 1:30** (35s) | **Autonomous Audit & Block**<br>Screen: GitLab MR discussion thread & CI pipeline. | *"The Honesty Guard flow executes our mathematical audit script and fixtures. It flags the 500% claim as a blocking violation, halts the pipeline, and posts a structured audit table with an exact empirical recommendation: 1.42x affinity multiplier."* | Zoom in on the Duo Agent's MR comment showing `⛔ BLOCKED` and the supervised maintainer checkpoint. |
| **1:30 – 1:55** (25s) | **Supervised Human Gate**<br>Screen: Maintainer Duo Chat / Comment. | *"Because this is a supervised agent, it cannot push changes on its own. It waits for maintainer consent. The maintainer reviews the math and types `/approve-fixes`. Instantly, the agent applies the verified provenance tag to the branch."* | Type `/approve-fixes`. Show new commit authored by Duo Honesty Guard landing on the branch. |
| **1:55 – 2:20** (25s) | **Pipeline Green & Deploy**<br>Screen: GitLab CI/CD Pipeline graph. | *"With the claim grounded, the pipeline re-runs: unit tests pass, honesty audit turns green, Vite compiles the SPA, and GitLab Pages deploys the mock-mode app at zero cost."* | Show pipeline stages: `test` -> `honesty-audit` -> `build` -> `pages`. Click Pages link to show live app loading. |
| **2:20 – 2:40** (20s) | **Post-Merge Release Gate**<br>Screen: GitLab Releases draft. | *"Finally, post-merge, the curator agent drafts audit-backed release notes and pauses for human sign-off with `/approve-release`. Speed with control: that is true post-code automation on the GitLab Duo Agent Platform."* | Show release notes draft. Display closing graphic with repo and Devpost links. |

---

## 4. Verification Commands for Judges

Judges can run the complete audit suite locally or in their GitLab web terminal in under 10 seconds:

```bash
# 1. Clone repository
git clone https://github.com/RyanDev1st/sponsorfit.git
cd sponsorfit

# 2. Run core test suite (asserts mathematical taste graph fidelity)
npm test

# 3. Run Honesty Guard unit test suite
node --test "scripts/guard/*.test.mjs"

# 4. Run CLI static audit on copy files
node scripts/guard/honesty-guard.mjs --strict --output honesty-report.json

# 5. Inspect generated JSON report
cat honesty-report.json
```
