# SponsorFit Honesty Guard: Supervised Demo Walkthrough & Video Script

**Target Hackathon Track:** Path B (Bring Your Own Code) — Best Supervised Agent ($4,500 Prize)  
**Total Video Target Duration:** 2 minutes 40 seconds (Strict limit: ≤ 2:45)  
**Repository:** [https://github.com/RyanDev1st/sponsorfit](https://github.com/RyanDev1st/sponsorfit)  
**Flow Specification:** Flow Registry v1 (`.gitlab/duo/flows/honesty-guard.yaml`)  

---

## 1. Demo Narrative: Speed with Control

In the era of AI-generated content and autonomous coding, marketing copy and developer documentation are increasingly polluted with hallucinated metrics and ungrounded claims (e.g. *"increases conversion by 500%"*). 

**SponsorFit Honesty Guard** is a supervised GitLab Duo Agent Flow built on the **Flow Registry v1** framework that demonstrates **"Speed with Control"**. Instead of letting autonomous agents blindly push changes or hallucinate claims, Honesty Guard audits code and copy against empirical ground truth, classifies risks via response schemas, and strictly **waits for human maintainer authorization** via a `HumanInputComponent` before taking any mutating action.

```
┌────────────────────────────────────────────────────────────────────────┐
│             Supervised Lifecycle State Machine (Flow Registry v1)       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   [ Developer Opens MR ]                                               │
│   Adds unbacked "+500% engagement" claim to README.md                  │
│             │                                                          │
│             ▼  (UI Trigger: Merge request events: Created)             │
│   [ Step 1: honesty_auditor (AgentComponent) ]                         │
│   Executes run_command (honesty-guard.mjs), read_file & get_mr_diff    │
│             │                                                          │
│             ▼                                                          │
│   [ Step 2: claim_classifier (AgentComponent) ]                        │
│   Outputs structured JSON schema: 1 blocking, 1.42x proposed fix       │
│             │                                                          │
│             ▼                                                          │
│   [ Step 3: maintainer_approval (HumanInputComponent) ] ──▶ PAUSES     │
│   Transitions to INPUT_REQUIRED. Displays approval prompt in UI        │
│             │                                                          │
│             ▼  (Maintainer clicks Approve / replies)                   │
│   [ Step 4: fix_remediator (AgentComponent) ]                          │
│   Applies verified derivation tag via edit_file & posts MR note        │
│             │                                                          │
│             ▼                                                          │
│   [ Step 5: End / Pipeline Green ]                                     │
│   CI/CD pipeline runs green, MR merged, GitLab Pages static SPA live   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The 5-Act Supervised Scenario

### Act 1: The Unbacked Claim (MR Opened)
A developer submits a feature branch proposing to boost creator outreach. In `README.md`, they add:
> *"Our new AI cultural match engine delivers **500% more engagement** for podcast sponsorships!"*

### Act 2: Autonomous Provenance Audit
The GitLab Duo Flow (`honesty-guard.yaml`) triggers automatically via the configured project trigger (`Merge request events`):
1. **`honesty_auditor`** executes `node scripts/guard/honesty-guard.mjs --output honesty-report.json`.
2. Static scanner detects `500%` matching unbacked marketing superlative regex without empirical fixture grounding.
3. **`claim_classifier`** processes the audit result through `claim_classification_schema`:
   - `overall_status: "blocked"`
   - `blocking_count: 1`
   - `proposed_fixes: "Replace '500% more engagement' with '1.42x cultural affinity multiplier [derived: affinity / mean(sample)]'"`

### Act 3: Supervised Human Authorization Gate (`HumanInputComponent`)
The flow reaches **`maintainer_approval`** (`HumanInputComponent`).
- Execution pauses cleanly; workflow status transitions to `INPUT_REQUIRED`.
- The GitLab UI presents an interactive approval prompt:
  ```
  Honesty Guard Audit Findings:
  1 blocking claim detected in README.md: '500% more engagement'.

  Proposed Remediations:
  Replace with verified empirical metric: '1.42x cultural affinity multiplier [derived: affinity / mean(sample)]'.

  Please review and approve applying the proposed fixes to this Merge Request.
  [ Approve ]   [ Reject ]
  ```
- The maintainer inspects the finding and clicks **Approve**.

### Act 4: Remediated Patch & Clean Merge
With human approval recorded in the flow state (`context:maintainer_approval.approval == "approve"`):
1. Router directs execution to **`fix_remediator`**.
2. Agent applies the fix to `README.md` using `edit_file`.
3. Agent posts an audit summary note to the MR using `create_merge_request_note`.
4. CI/CD pipeline runs automatically:
   - `test_suite`: 16 API tests + 9 Guard tests pass.
   - `honesty_audit`: 0 blocking claims; exits code 0.
   - `build_spa`: Vite compiles production SPA to `dist/`.
   - `pages`: Deploys static bundle to GitLab Pages at $0.
5. Merge request is unblocked and merged into `main`.

### Act 5: Post-Merge Verification
1. Maintainer inspects the merged commit on `main`.
2. Verifies the live GitLab Pages static deployment loaded cleanly with zero ongoing infrastructure costs.

---

## 3. Video Production Shot List (Total Duration: 2:40)

| Timestamp | Scene / Visual | Voiceover / Script Narration | On-Screen Action |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:25** (25s) | **Title & Problem**<br>Screen: SponsorFit GitHub repo & architecture diagram. | *"Welcome to SponsorFit Honesty Guard. When AI builds post-code workflows, autonomous speed must never compromise factual honesty. Built for GitLab's 'Life After Code' hackathon on the Flow Registry v1 spec, Honesty Guard is a supervised Duo flow that protects projects from hallucinated marketing and ungrounded metrics."* | Pan over `README.md` and show the 4-step Qloo Taste Graph pipeline. |
| **0:25 – 0:55** (30s) | **The Dirty MR**<br>Screen: GitLab Merge Request UI. | *"Here, a developer opens an MR adding an exaggerated claim: '500% more engagement'. Traditional linters ignore this, but our GitLab Duo Flow triggers automatically via project merge request events."* | Show diff adding `500% more engagement` to `README.md`. Click **Create Merge Request**. |
| **0:55 – 1:30** (35s) | **Autonomous Audit & Classifier**<br>Screen: GitLab Flow session execution view. | *"The flow executes the honesty_auditor agent using run_command, then passes findings to claim_classifier with a structured JSON response schema. It detects the 500% claim as a blocking violation and prepares the exact empirical replacement: 1.42x affinity multiplier."* | Show session log transitioning from `honesty_auditor` to `claim_classifier` with structured output. |
| **1:30 – 1:55** (25s) | **Supervised Human Input Gate**<br>Screen: HumanInputComponent approval card in UI. | *"Because this is a supervised flow, it hits the HumanInputComponent. The workflow pauses in INPUT_REQUIRED status. It cannot modify files without maintainer consent. The maintainer reviews the prompt and clicks Approve."* | Zoom in on the `maintainer_approval` card showing findings and proposed fix. Click **Approve**. |
| **1:55 – 2:20** (25s) | **Remediation & Pipeline Green**<br>Screen: GitLab CI/CD Pipeline graph & MR diff. | *"With approval recorded, fix_remediator applies the verified derivation tag using edit_file and posts a confirmation note. The CI pipeline turns green across all four stages, and GitLab Pages deploys the mock-mode app at zero cost."* | Show new commit landing on branch; pipeline stages `test` -> `honesty-audit` -> `build` -> `pages` turn green. |
| **2:20 – 2:40** (20s) | **Conclusion & Compliance**<br>Screen: Summary slide with repo & spec links. | *"By combining Flow Registry v1 components, custom response schemas, and strict human-in-the-loop gates, SponsorFit delivers speed with control on the GitLab Duo Agent Platform."* | Display closing graphic with repo, spec, and Devpost links. |

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
node --test scripts/guard/honesty-guard.test.mjs

# 4. Run CLI static audit on copy files
node scripts/guard/honesty-guard.mjs --strict --output honesty-report.json

# 5. Inspect generated JSON report
cat honesty-report.json
```
