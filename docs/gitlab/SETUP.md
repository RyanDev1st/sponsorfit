# SponsorFit: GitLab Hackathon Setup Guide

**Target Event:** GitLab Transcend Hackathon — "Life After Code"  
**Track:** Path B (Bring Your Own Project) — Best Supervised Agent  
**Target Repository:** `products/sponsorfit` (Mirror of [https://github.com/RyanDev1st/sponsorfit](https://github.com/RyanDev1st/sponsorfit))  
**Budget:** $0 (Free tiers, provisioned hackathon sandbox, local self-managed runner fallback)  

This guide provides a rapid step-by-step checklist to take SponsorFit from the local workspace to a fully operational, supervised GitLab Duo Agent setup within the provisioned hackathon subgroup. Target execution time: **under 45 minutes**.

---

## Phase 1: Hackathon Onboarding & Sandbox Provisioning

- [ ] **Step 1: Register on Devpost**
  - **Action:** Visit [https://gitlab-transcend.devpost.com/](https://gitlab-transcend.devpost.com/) and click **Register for this hackathon**. Note your exact Devpost username.
  - **Expected Result:** Profile listed under event participants; registration confirmed.
  - **Doc Link:** [Devpost Registration Rules](https://gitlab-transcend.devpost.com/rules)

- [ ] **Step 2: Request Provisioned Subgroup on GitLab Contributor Platform**
  - **Action:** Sign in to [https://contributors.gitlab.com/](https://contributors.gitlab.com/) using your GitLab.com account. Navigate to the **Transcend Hackathon** section and enter your Devpost username.
  - **Expected Result:** Automated approval grants your user the `Developer` role inside a dedicated hackathon sandbox subgroup (e.g. `gitlab.com/gitlab-community/hackathons/transcend-2026/subgroup-<username>`).
  - **Doc Link:** [GitLab Contributor Platform](https://contributors.gitlab.com/)
  - **Security Constraint:** Do NOT enable group-level observability and do NOT add production secrets in this sandbox group.

---

## Phase 2: Project Import & Mirroring

- [ ] **Step 3: Import or Push SponsorFit to Provisioned Subgroup**
  - **Action:** In your provisioned subgroup, click **New Project** > **Import project** > **Repository by URL**:
    - Git repository URL: `https://github.com/RyanDev1st/sponsorfit.git`
    - Project name: `sponsorfit`
    - Visibility Level: `Public`
  - *Alternative via Git Remote:*
    ```bash
    cd products/sponsorfit
    git remote add gitlab https://gitlab.com/<provisioned-subgroup-path>/sponsorfit.git
    git push -u gitlab main
    ```
  - **Expected Result:** Full SponsorFit repository (including `.gitlab-ci.yml`, `.gitlab/duo/`, and `scripts/guard/`) is hosted inside your hackathon project.
  - **Doc Link:** [GitLab Project Import Guide](https://docs.gitlab.com/ee/user/project/import/repo_by_url.html)

- [ ] **Step 4: Verify Default Branch Settings**
  - **Action:** Navigate to **Settings** > **Repository** > **Branch defaults** and confirm `main` is default.
  - **Expected Result:** `main` branch is protected and active.
  - **Doc Link:** [GitLab Default Branch Docs](https://docs.gitlab.com/ee/user/project/repository/branches/default.html)

---

## Phase 3: GitLab Duo Agent & Flow Configuration

- [ ] **Step 5: Verify GitLab Duo Agent Platform Access**
  - **Action:** Navigate to **Settings** > **GitLab Duo** in your project or subgroup sidebar. Ensure Duo features (Chat, Agent Platform, Flows) are toggled **Enabled**.
  - **Expected Result:** GitLab Duo sidebar and AI features are accessible in the UI.
  - **Doc Link:** [GitLab Duo Feature Enablement](https://docs.gitlab.com/user/duo_agent_platform/)

- [ ] **Step 6: Register Custom Flow (`honesty-guard.yaml`)**
  - **Action:**
    1. Verify that `.gitlab/duo/flows/honesty-guard.yaml` is present in the repository root.
    2. In GitLab UI, open the **AI Catalog** or **GitLab Duo Flow Builder** (in VS Code extension or web editor).
    3. Point the flow definition to `.gitlab/duo/flows/honesty-guard.yaml`.
  - **Expected Result:** Flow `sponsorfit-honesty-guard` appears active under project workflows, listening to `merge_request` triggers.
  - **Doc Link:** [GitLab Custom Flow Registration](https://docs.gitlab.com/user/duo_agent_platform/flows/custom/)
  - *Note:* If the UI catalog interface differs slightly in your provisioned tier, flow registration via `.gitlab/duo/flows/` repository path is automatically picked up (`UNVERIFIED` exact UI button label depending on cloud rollout).

---

## Phase 4: CI/CD Runner Verification & Self-Managed Setup ($0 Cost)

- [ ] **Step 7: Check SaaS Shared Runner Status**
  - **Action:** Navigate to **Settings** > **CI/CD** > **Runners**. Inspect whether shared instance runners are enabled and active.
  - **Expected Result:** Green status indicating shared runners are available.
  - **Doc Link:** [GitLab Shared Runners](https://docs.gitlab.com/ee/ci/runners/runners_scope.html)

- [ ] **Step 8 (Conditional Fallback): Register Local Self-Managed Runner**
  - *Context:* If SaaS shared runners request credit card identity verification for anti-abuse checks, register a local runner to run pipelines for $0 without providing card details.
  - **Action (Windows PowerShell):**
    ```powershell
    # 1. Download official GitLab Runner binary
    Invoke-WebRequest -Uri "https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-windows-amd64.exe" -OutFile "C:\gitlab-runner\gitlab-runner.exe"
    cd C:\gitlab-runner

    # 2. Register runner with project registration token (obtained from Settings > CI/CD > Runners)
    .\gitlab-runner.exe register `
      --non-interactive `
      --url "https://gitlab.com/" `
      --registration-token "<YOUR_PROJECT_RUNNER_TOKEN>" `
      --executor "shell" `
      --description "Local-Windows-Runner-SponsorFit" `
      --tag-list "local,windows"

    # 3. Start runner in foreground for testing
    .\gitlab-runner.exe run
    ```
  - *Alternative via Docker (Linux/WSL):*
    ```bash
    docker run -d --name gitlab-runner --restart always \
      -v /var/run/docker.sock:/var/run/docker.sock \
      -v gitlab-runner-config:/etc/gitlab-runner \
      gitlab/gitlab-runner:latest
    ```
  - **Expected Result:** Runner appears with green circle under **Project runners** in GitLab CI/CD settings.
  - **Doc Link:** [Install & Register GitLab Runner](https://docs.gitlab.com/runner/install/)

---

## Phase 5: Verification & Supervised Demo Merge Request

- [ ] **Step 9: Run Baseline Pipeline on `main`**
  - **Action:** Navigate to **Build** > **Pipelines** and click **Run pipeline** on branch `main`.
  - **Expected Result:**
    1. `test_suite` stage passes (16 API tests + 9 Guard tests).
    2. `honesty_audit` stage passes and emits `honesty-report.json`.
    3. `build_spa` compiles static bundle to `dist/`.
    4. `pages` stage deploys `public/` directory.
  - **Doc Link:** [GitLab Pipelines](https://docs.gitlab.com/ee/ci/pipelines/)

- [ ] **Step 10: Verify GitLab Pages Live URL**
  - **Action:** Navigate to **Deploy** > **Pages**. Open the generated Pages URL (e.g. `https://<subgroup>.gitlab.io/sponsorfit`).
  - **Expected Result:** SponsorFit SPA loads in browser, displaying cultural input forms and Amber `MOCK DATA` badge at $0 hosting cost.
  - **Doc Link:** [GitLab Pages Administration](https://docs.gitlab.com/user/project/pages/)

- [ ] **Step 11: Execute Supervised Test Merge Request**
  - **Action:**
    1. Create a test branch: `git checkout -b test/unbacked-claim-demo`.
    2. Add an unbacked claim to `README.md` (e.g. `SponsorFit generates 500% more engagement`).
    3. Push and open a Merge Request targeting `main`.
  - **Expected Result:**
    - Pipeline executes `honesty_audit`.
    - Duo Honesty Guard agent posts the structured MR audit report.
    - Findings highlight `🔴 Blocking: 500% more engagement`.
    - Pipeline blocks auto-merge and requests maintainer supervision.
  - **Doc Link:** [GitLab MR Discussions & Code Quality](https://docs.gitlab.com/ee/user/project/merge_requests/)

- [ ] **Step 12: Supervised Human Resolution**
  - **Action:** Maintainer replies with `/approve-fixes` or commits the empirical derivation tag.
  - **Expected Result:** Agent applies approved changes, unblocks the pipeline, and permits merge.
