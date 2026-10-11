# SponsorFit Honesty Guard: Video Demonstration Script

> **Hackathon Track:** GitLab "Transcend: Life After Code" — Path B: Best Supervised Agent ([Rules](https://gitlab-transcend.devpost.com/rules))
> **Target Video Duration:** 2 minutes 35 seconds (Strict requirement: â‰¤ 2:45)
> **Pacing:** ~140 words per minute (~360 words total)
> **Demonstration Focus:** Real captured GitLab Duo session 9292188 on Merge Request !1

---

### Shot List & Timestamped Narration

#### 0:00 – 0:25 | Act 1: The Problem — AI Hallucination & The Need for Supervised Control
- **On Screen:** Split screen showing the GitLab repository and architecture diagram of the Flow Registry v1 state machine.
- **Visual Action:** Highlight the transition from autonomous analysis to the `HumanInputComponent` gate.
- **Voiceover:**
  > *"Welcome to SponsorFit Honesty Guard, built for GitLab's 'Life After Code' hackathon.
  > In an era where generative AI and autonomous workflows write documentation and copy, unbacked claims can easily slip into codebases.
  > Honesty Guard brings 'Speed with Control' to the GitLab Duo Agent Platform: enabling autonomous provenance auditing while strictly enforcing human authorization before any files are changed."*

---

#### 0:25 – 0:50 | Act 2: The Merge Request & Automated Duo Trigger
- **On Screen:** Navigate to Merge Request !1 on GitLab: `demo/honesty-guard-unsourced-claim`.
- **Visual Action:** Open the MR Changes tab, showing the addition of ungrounded test copy in `docs/gitlab/demo-claim.md` claiming unverified adoption by 10,000 creators.
- **Voiceover:**
  > *"Here on Merge Request exclamation-point-one, a contributor submits new marketing copy adding an unbacked adoption statistic claiming 10,000 creators.
  > Traditional linters pass this without warning.
  > But our Flow Registry v1 workflow triggers automatically on Merge Request Created events under our configured project service account."*

---

#### 0:50 – 1:20 | Act 3: Autonomous Duo Audit & Defect Detection
- **On Screen:** Open the GitLab Duo Agent execution view for session 9292188.
- **Visual Action:** Scroll through execution steps showing `honesty_auditor` and `claim_classifier` inspecting the MR diff against `scripts/guard/provenance-registry.json`.
- **Voiceover:**
  > *"Under the hood, the flow executes the honesty auditor agent.
  > The agent scans the diff against our provenance registry.
  > During execution, the agent also discovered runner test configuration quirks with quoted globs, prompting us to harden our test runner scripts with explicit paths.
  > The claim classifier independently escalates the unsourced 10,000 creator claim to blocking."*

---

#### 1:20 – 1:50 | Act 4: The Findings Comment & Paused Human Gate (INPUT_REQUIRED)
- **On Screen:** Switch to the MR discussion tab displaying findings note 3991403634. Then switch to Session 9292188 showing status **`INPUT_REQUIRED`**.
- **Visual Action:** Zoom in on note 3991403634 detailing the findings and proposed honest replacement: *"SponsorFit helps creators prepare culturally grounded sponsorship pitches."* Zoom in on the session status badge `INPUT_REQUIRED`.
- **Voiceover:**
  > *"Notice what happens next: the agent does not unilaterally modify files or force a merge.
  > Instead, it posts structured findings note 3991403634 to the discussion, proposing an honest nonnumeric replacement.
  > The flow hits the HumanInputComponent gate and cleanly pauses in status INPUT_REQUIRED, awaiting human maintainer direction."*

---

#### 1:50 – 2:15 | Act 5: Supervised Human Decision & Local Guard Verification
- **On Screen:** Maintainer review interface showing the prompt with Approve, Modify, and Reject choices. Split screen to terminal running `npm test`.
- **Visual Action:** Maintainer reviews the proposed replacement. Terminal runs `npm test`, showing 16 core API tests passing and honesty guard tests passing.
- **Voiceover:**
  > *"This is supervised governance in action. The human maintainer retains full authority to approve, modify, or reject the proposed remediation.
  > Meanwhile, our test suite runs locally and in CI: sixteen core tests and full honesty guard tests pass with zero blocking claims.
  > Sensitive credentials stay protected: memory and diff scans confirmed zero leaked tokens."*

---

#### 2:15 – 2:35 | Act 6: CI/CD Pipeline & Conclusion
- **On Screen:** GitLab CI Pipeline graph (pipeline 2934942327 and 2934945967) showing green test and audit stages. Conclude on GitLab repo homepage.
- **Visual Action:** Hover over green pipeline badges and MIT license in the repository.
- **Voiceover:**
  > *"With all tests passing and pipelines green, the project deploys to GitLab Pages at zero ongoing cost.
  > SponsorFit Honesty Guard proves that in the age of autonomous development, teams can achieve speed with control using the GitLab Duo Agent Platform.
  > Thank you!"*

---

### Verification Checklist for Hackathon Judges
- **GitLab Repository:** [https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit) (Public, MIT)
- **Demo MR:** [MR !1](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit/-/merge_requests/1)
- **Agent Session:** [Session 9292188](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit/-/automate/agent-sessions/9292188) (Status: `INPUT_REQUIRED`)
- **Findings Note:** [Note 3991403634](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit/-/merge_requests/1#note_3991403634)
- **Catalog Flow:** [Flow 1016557 (Release 1.0.1)](https://gitlab.com/explore/ai-catalog/flows/1016557)
