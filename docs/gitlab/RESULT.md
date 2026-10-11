# G3 delivery evidence — 2026-10-11

- GitLab project: https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit
- GitHub origin: https://github.com/RyanDev1st/sponsorfit (preserved).
- Demo MR: https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit/-/merge_requests/1
- Fixture commit: `d4551c11c7af61873a7f54cce29de47e0d3e16d5`, on `demo/honesty-guard-unsourced-claim`, mirrored to both hosts. The false adoption claim is clearly labelled and stays on the unmerged demo branch.
- Catalog: https://gitlab.com/explore/ai-catalog/flows/1016557 — enabled, release 1.0.1, consumer 12500616. Custom flow agents are created by the flow, so registering a separate standalone agent is unnecessary.
- Active Mention/Assign/Assign reviewer trigger: 3014322; MR / Created trigger: 3014324.
- Real invocation note: https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit/-/merge_requests/1#note_3991401730
- Actual findings note: https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit/-/merge_requests/1#note_3991403634
- Session: https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit/-/automate/agent-sessions/9292188
- Independently observed session status: **INPUT_REQUIRED**, awaiting human approval. The classifier flags unsupported adoption as blocking, proposes a nonnumeric replacement and states no edit/merge/approval was performed. We did not approve the outcome.

## Verification

Local `npm test`: 16 passed, 0 failed. Guard tests: 9 passed, 0 failed. `npm run build` succeeded. The revised YAML passed the local downloaded Flow Registry v1 JSON schema and GitLab's live AI Catalog validator; the live validator rejected optional fields accepted by the local copy, so only supported core fields remain.

GitLab's first core pipeline failed because Node 20 did not expand the quoted test glob. Fixed npm test to enumerate the existing API tests, the guard command to use its explicit file, and the CI image to Node 24. The captured agent independently used explicit-path fallbacks and reported real 16/16 and 9/9 results. Local copies of third-party specs remain ignored; none are staged or redistributed.

The deterministic guard classifies the adoption number as needs-human and can report passed when there are no blocking signatures. The agent independently escalated it to blocking. This flow is a supervised review aid, not a verified universal claim validator or an enforced merge protection rule. The captured session used release 1.0.0; release 1.0.1 changes only the guard test invocation, and future sessions should use the updated consumer pin.

## Remaining human work

Use [USER-STEPS](USER-STEPS.md) to inspect and approve, modify or reject the paused outcome. The GitLab runtime setup is complete; final Devpost submission still needs a verified live Path B deployment, a public YouTube demonstration under three minutes, a successful visible pipeline, and the completed submission form before **2026-10-27 20:00 ICT**. No cash was spent. Rules quotes and original-source links are in [RULES-CHECK](RULES-CHECK.md).
