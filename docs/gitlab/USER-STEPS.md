# Honesty Guard: judge and account steps

Verified 2026-10-11:

- [Project](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit), public, MIT, ID 87478175.
- [Demo MR](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit/-/merge_requests/1), intentionally false test fixture, not production copy.
- [Catalog flow](https://gitlab.com/explore/ai-catalog/flows/1016557), released version 1.0.1, enabled project consumer 12500616. The captured demonstration used 1.0.0; the patch release replaces the quoted guard-test glob with an explicit file path.
- Active trigger 3014322: Mention, Assign and Assign reviewer; service account `ai-sponsorfit-honesty-guard-gitlab-ai-hackathon`.
- Active trigger 3014324: Merge request / Created, configured through the API with an action-equals-created filter. The numeric event mapping and filter schema were verified from GitLab's [official model](https://gitlab.com/gitlab-org/gitlab/-/blob/master/ee/app/models/ai/flow_trigger.rb) and [filter schema](https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/validators/json_schemas/filter.json); no third-party source was copied into this repository.
- Project API reports Duo features and a workflow runner available.
- [Invocation comment](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit/-/merge_requests/1#note_3991401730).
- [Agent start comment](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit/-/merge_requests/1#note_3991401752) links [real session 9292188](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit/-/automate/agent-sessions/9292188). Starting a session does not prove that review or the human gate finished.
- [Actual classifier findings comment](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit/-/merge_requests/1#note_3991403634): flags the unsupported adoption statistic as blocking, proposes a nonnumeric description, and states no fix was applied. It correctly notes the deterministic guard classified this as needs-human rather than blocking; the independent agent review caught the unsupported adoption claim. Explicit-path test fallback passed 16 core and 9 guard tests in the runner.
- Session status was independently verified through GraphQL as **INPUT_REQUIRED**. The human gate is real; it has not been approved or resumed by this worker.

## Reproduce the human outcome gate

1. Sign in to GitLab using the authorized hackathon account and open the demo MR.
2. Open the agent session linked above, or select **AI > Sessions** in the project and choose session 9292188.
3. Inspect the tool execution history, MR findings comment, proposed replacement and current session status. If it is still running, wait for the review result. If it failed, inspect the error before retrying.
4. When the HumanInput approval request appears, review the proposed replacement. Choose **Approve** only when the unsupported number is removed or independently sourced; use **Modify** for feedback or **Reject** to end without edits. These are human decisions: this worker did not approve them.
5. Inspect the branch diff and remediation result after approval. The flow is never authorized to merge. Leave the deliberately false fixture MR unmerged until it has been corrected.

To start a fresh run if needed, post an MR comment mentioning `@ai-sponsorfit-honesty-guard-gitlab-ai-hackathon` and ask it to audit the changed file, propose an honest replacement and stop for human outcome approval. Mention is an active trigger. Assigning the service account as assignee or reviewer is an alternative trigger; use one to avoid duplicate sessions.

## Merge-request event trigger recovery (exact documented UI route)

Mention/assignment and automatic MR-created triggers are already enabled through the API. No UI-only setup blocker remains. To recreate the MR trigger if it is deleted:

1. Open the project; in the left sidebar choose **AI > Triggers**.
2. Select **New flow trigger** and enter `Honesty Guard on new merge requests` as the description.
3. Under **Conditions**, select **Add condition > On an event**.
4. Select **Merge request** as the event, then **Created** under **Run when**, and select **Add event**. If this event/action is absent on the deployed instance, stop; do not substitute an undocumented setting.
5. Choose `ai-sponsorfit-honesty-guard-gitlab-ai-hackathon` under **Service account**.
6. For **Configuration source**, choose **AI Catalog**, then **SponsorFit Honesty Guard**.
7. Optionally edit the event goal to request changed-copy audit, an MR findings note and human approval before edits; select **Save**.
8. Select **Create flow trigger**. Verify it appears active before creating another deliberately labelled test MR.

Source: [official trigger instructions and event types](https://docs.gitlab.com/user/duo_agent_platform/triggers/). Requires the documented Maintainer/Owner permissions or equivalent custom-role capabilities; if denied, the group administrator must perform this step. No upgrade or paid credits are authorized.

## Registration recovery only

Registration and enablement succeeded through GraphQL, so no separate custom agent or repository-path enablement is needed. A custom flow creates its own agents; the earlier SETUP instructions about selecting an agent from the catalog are superseded by this page.

If recovering a deleted flow, follow [official custom flows](https://docs.gitlab.com/user/duo_agent_platform/flows/custom/): project **AI > Flows > New flow**, enter display name and description, choose visibility, select **Flow** under **Configuration**, paste `.gitlab/duo/flows/honesty-guard.yaml`, then **Create flow**. Open **Managed**, select the flow, choose **Enable**, select this project and Mention/Assign/Assign reviewer triggers, then **Enable**. Record the newly generated service account rather than guessing a handle.

The [Flow Registry v1 reference](https://docs.gitlab.com/user/duo_agent_platform/flows/claude-edit-v1-flow-registry/) describes the YAML. GitLab's live catalog validator is authoritative for this instance: optional root metadata and response schemas accepted by the downloaded schema were rejected, so this flow uses the supported core fields and plain Markdown findings.
