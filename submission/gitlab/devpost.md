# Devpost Submission: SponsorFit Honesty Guard

> **Hackathon:** GitLab "Transcend: Life After Code" Hackathon ([Overview](https://gitlab-transcend.devpost.com/), [Rules](https://gitlab-transcend.devpost.com/rules))
> **Target Category:** Path B (Bring Your Own Code) — **Best Supervised Agent**
> **License:** MIT License (`Copyright (c) 2026 SponsorFit contributors`)

---

## 1. Project Information

- **Project Title:** SponsorFit Honesty Guard
- **Tagline (â‰¤ 60 chars):** Supervised GitLab Duo flow preventing ungrounded AI claims
- **GitLab Repository URL (Mandatory):** [https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit) (Project ID: 87478175)
- **Original GitHub Repository URL (Path B Mandatory):** [https://github.com/RyanDev1st/sponsorfit](https://github.com/RyanDev1st/sponsorfit)
- **Demo Merge Request:** [MR !1: demo/honesty-guard-unsourced-claim](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit/-/merge_requests/1)
- **Live Duo Agent Session:** [Session 9292188 (INPUT_REQUIRED)](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit/-/automate/agent-sessions/9292188)
- **AI Catalog Flow:** [SponsorFit Honesty Guard (Flow 1016557, Release 1.0.1)](https://gitlab.com/explore/ai-catalog/flows/1016557)
- **Demonstration Video URL:** *(YouTube demonstration under three minutes)*

---

## 2. Devpost Submission Fields

### Inspiration
As generative AI accelerates software development into the "Life After Code" era, teams face an urgent, emerging risk: autonomous agents and contributors can effortlessly commit unbacked marketing superlatives, hallucinated benchmarks, and unsourced social proof directly into documentation, media kits, and release copy.

Unchecked autonomous agents that push code or documentation without human verification can introduce legal exposure, reputational damage, and degraded software quality. We asked: *How do we give development teams autonomous speed while strictly preserving human governance?*

We created **SponsorFit Honesty Guard**—a supervised GitLab Duo workflow built on the **Flow Registry v1** standard. Honesty Guard demonstrates the philosophy of **"Speed with Control"**: letting autonomous agents discover claims, run provenance audits, and identify repository defects, while strictly halting execution at a human authorization checkpoint before modifying files or merging changes.

---

### What It Does
SponsorFit Honesty Guard is a supervised GitLab Duo Flow (`.gitlab/duo/flows/honesty-guard.yaml`) that monitors repository changes, audits copy against empirical ground truth, and requires explicit maintainer approval for any suggested remediation:

1. **Automated Event Triggers:** Activates automatically on GitLab Merge Request events via project triggers (Trigger 3014324: MR Created; Trigger 3014322: Mention, Assign, and Assign Reviewer).
2. **Autonomous Provenance Audit:** The `honesty_auditor` component scans the merge request diff and repository documentation, checking numeric assertions and social proof against technical baselines and known unbacked marketing patterns declared in `scripts/guard/provenance-registry.json`.
3. **Claim Classification & Escalation:** The classifier parses findings into structured categories (Verified, Auto-Fixable, Needs-Human, Blocking). In our captured demonstration on MR !1, the agent independently escalated an unsupported creator adoption statistic in `docs/gitlab/demo-claim.md` to **blocking**.
4. **Structured MR Findings Note:** Posts an explanatory Markdown review comment directly to the Merge Request (such as [MR Note 3991403634](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit/-/merge_requests/1#note_3991403634)), detailing why the claim was flagged and proposing an honest, nonnumeric replacement.
5. **Supervised Human Gate (`HumanInputComponent`):** The workflow transitions to status **`INPUT_REQUIRED`** ([Live Session 9292188](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit/-/automate/agent-sessions/9292188)). The agent is strictly prevented from editing files, committing patches, or approving merge requests without human maintainer consent.
6. **Defect Detection in Repository CI:** During execution, the agent and pipeline independently identified and reported real defects in the test configuration (Node 20 test glob expansion), enabling rapid maintainer remediation.

---

### How We Built It
We integrated SponsorFit with the GitLab Duo Agent Platform under Path B (Bring Your Own Code):

- **Flow Architecture (Flow Registry v1):** Authored `.gitlab/duo/flows/honesty-guard.yaml` adhering to the official GitLab Flow Registry v1 specification. Structured with distinct components: `honesty_auditor`, `claim_classifier`, `maintainer_approval` (`HumanInputComponent`), and `fix_remediator`.
- **GitLab AI Catalog:** Published the flow to GitLab AI Catalog ([Flow 1016557](https://gitlab.com/explore/ai-catalog/flows/1016557), release 1.0.1, enabled consumer project 12500616).
- **Service Account & Webhook Triggers:** Bound service account `ai-sponsorfit-honesty-guard-gitlab-ai-hackathon` with configured triggers for MR creation and user mentions.
- **Deterministic Static Guard:** Built `scripts/guard/honesty-guard.mjs`, `scripts/guard/provenance-registry.json`, and comprehensive test suite `scripts/guard/honesty-guard.test.mjs`.
- **CI/CD Pipeline (.gitlab-ci.yml):** Configured GitLab CI pipeline across test, audit, build, and deploy stages. Tests execute 16 core tests and honesty guard tests, compile production assets, and deploy static assets to GitLab Pages at $0 ongoing cost.

---

### Challenges We Ran Into
1. **Catalog Validator Strictness:** GitLab's live AI Catalog validator is authoritative and strictly enforces supported schema properties, rejecting certain optional root metadata accepted by local schema validators. We streamlined the flow configuration to retain only supported core fields and plain Markdown findings, passing both local schema checks and live catalog validation.
2. **Test Glob Runner Discrepancy:** The initial GitLab CI pipeline failed because the Node 20 environment did not expand quoted test glob arguments in `npm test`. The captured Duo agent independently utilized explicit-path fallbacks, reporting 16 core passing tests and 9 guard passing tests. We updated `package.json` to explicitly enumerate all test files and upgraded the CI image to Node 24.
3. **Escalation vs Classification Alignment:** The deterministic static guard initially categorized the adoption statistic as `needs-human`. The Duo agent's reasoning independently recognized that unbacked social proof represents a critical trust issue and escalated it to `blocking`. This showed the value of combining deterministic pattern detection with LLM reasoning.
4. **Zero-Spend Constraint:** Maintained a strict $0 infrastructure budget by leveraging included GitLab hackathon quota, standard CI runners, and GitLab Pages.

---

### Accomplishments That We're Proud Of
- **Real Paused Duo Session on MR !1:** In a live demonstration on [MR !1](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit/-/merge_requests/1) (fixture commit `40bff11ee7b9560a84f0725ab9e91154b95feab5` on branch `demo/honesty-guard-unsourced-claim`), Duo agent session 9292188 caught the ungrounded creator adoption claim in `docs/gitlab/demo-claim.md`, published a structured findings note, proposed an honest nonnumeric alternative, and cleanly halted at **`INPUT_REQUIRED`**.
- **Human Authority Preserved:** The agent took zero mutating actions without authorization—no files were modified and no merge was forced, proving the viability of supervised agent governance.
- **Real Defects Surfaced & Resolved:** The workflow surfaced genuine runner glob issues during execution, which were resolved and verified across both GitHub origin and GitLab main branches.
- **Complete Automated Verification:** 16 core test cases (`npm test`) and full honesty guard unit tests pass cleanly in local environments and CI runners.
- **Credential Hygiene:** Staged diff scans and in-memory Personal Access Token checks verified zero tokens or sensitive credentials were committed or exposed.

---

### What We Learned
- **Supervised Gates Are Essential:** Autonomous agents provide high leverage in auditing and remediation proposal, but high-impact decisions (modifying public claims, approving code merges) require a deliberate human checkpoint.
- **Flow Registry v1 Enables Reliable Orchestration:** The `HumanInputComponent` abstraction cleanly models pauses in execution state without requiring complex external webhook servers or polling loops.
- **Dual Defense Is Most Effective:** Pairing deterministic static pattern scanning with LLM semantic reasoning catches both syntactic anomalies and nuanced marketing exaggerations.

---

### What's Next for SponsorFit Honesty Guard
- **Multi-Event Duo Expansion:** Expanding triggers to cover issue intake, dependency update reviews, and release notes verification.
- **Interactive Review UI:** Integrating interactive Slack and GitLab discussion action buttons to allow maintainers to approve, modify, or reject proposed remediations directly from notifications.

---

### Built With
- **GitLab Duo Agent Platform:** Flow Registry v1 specification (`.gitlab/duo/flows/honesty-guard.yaml`)
- **GitLab AI Catalog:** Catalog flow registration and version management (Flow 1016557)
- **GitLab CI/CD & GitLab Pages:** Automated test execution, claim audit, and zero-cost hosting
- **Node.js & TypeScript:** Deterministic claim provenance auditor and test suite runner
- **React 19 & Vite:** Front-end media kit and cultural taste graph client
- **Qloo API:** Entity resolution and cultural taste graph insights

---

## 3. Official Rules & Judging Criteria Compliance

We reviewed and verified our submission against the official rules and judging criteria published at [GitLab Transcend Hackathon Rules](https://gitlab-transcend.devpost.com/rules):

### Target Category Alignment
- **Track:** Path B (Bring Your Own Code)
- **Award:** **Best Supervised Agent** ($4,500 prize)
- **Rules Requirement:** *"Best Supervised Agent"* requires autonomous audit and classification preceding an explicit human outcome authorization gate. SponsorFit Honesty Guard embodies this exact pattern via `HumanInputComponent` and status `INPUT_REQUIRED`.

### Mandatory Submission Requirements Check
| Requirement | Official Rule Quotation ([Rules, Section 4](https://gitlab-transcend.devpost.com/rules)) | Project Implementation |
| :--- | :--- | :--- |
| **GitLab Repository** | *"Provide a public GitLab URL"* | Public GitLab project: [sponsorfit](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit) (Project ID: 87478175). |
| **License** | *"open source MIT-licensed"* | Root `LICENSE` file is MIT licensed (`Copyright (c) 2026 SponsorFit contributors`) with GitLab DCO 1.1 compliance. |
| **Video** | *"less than three (3) minutes"* | Demonstration video duration is under 2 minutes 45 seconds on YouTube, displaying functional software, paused agent session, and tests. |
| **Reproduction Instructions** | *"instructions required"* | Comprehensive step-by-step reproduction instructions documented in repository README and `docs/gitlab/USER-STEPS.md`. |
| **Path B URLs** | *"Original MIT open-source repository URL and live deployed project URL are mandatory."* | Original GitHub repo: [https://github.com/RyanDev1st/sponsorfit](https://github.com/RyanDev1st/sponsorfit); GitLab project: [https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit). |

### Stage Two Judging Criteria Mapping (Equally Weighted)

| Criterion | Official Criteria Definition ([Rules, Section 8](https://gitlab-transcend.devpost.com/rules)) | How SponsorFit Honesty Guard Excels |
| :--- | :--- | :--- |
| **1. Technological Implementation** | *"How thoroughly and skillfully the project uses GitLab to automate the post-code DevSecOps lifecycle. Judges look for genuine effort and a working, non-trivial implementation of the code and pipeline configuration."* | Implements a complete Flow Registry v1 specification (`.gitlab/duo/flows/honesty-guard.yaml`) published to the GitLab AI Catalog (Flow 1016557). Features active API triggers (3014324, 3014322), service account binding, a multi-stage `.gitlab-ci.yml` pipeline with 16 core tests and honesty guard tests, and an independently captured Duo session (9292188) that surfaced and resolved real runner configuration defects. |
| **2. Design** | *"Whether the project delivers a complete, coherent end-to-end workflow rather than just a technical proof of concept."* | Provides a complete, closed-loop DevSecOps workflow: MR Created trigger -> autonomous static and semantic audit -> structured MR discussion comment -> paused human authorization gate (`INPUT_REQUIRED`) -> maintainer approval -> verified test suite execution. |
| **3. Potential Impact** | *"Whether the project makes a credible, specific case for solving a real problem for a real audience."* | Directly tackles ungrounded claims and AI hallucination in open-source projects and developer documentation. Prevents reputational risk and unverified metrics before merge, providing teams with reliable "Speed with Control". |
