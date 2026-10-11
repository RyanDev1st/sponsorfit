# GitLab Transcend rules check

Checked against the live official pages on 2026-10-11. Deadline: **2026-10-27 13:00 UTC / 20:00 ICT**. The older research brief's 21:00 ICT deadline is incorrect.

| Requirement | Official wording / interpretation | Source |
| --- | --- | --- |
| GitLab repository | “Provide a public GitLab URL”; code, assets, functional instructions and visible CI/CD automation history are required. Neither page explicitly mandates a project name or says the supplied showcase must be used. Use the provisioned subgroup for included platform access. | [Rules, section 4](https://gitlab-transcend.devpost.com/rules) |
| License | “open source MIT-licensed”; original entrant code and agent YAML are MIT plus GitLab DCO 1.1. Rules permit compatible OSI-approved third-party components; the resources FAQ uses stricter shorthand about MIT. Check dependencies and rights before submission. | [Rules, section 4](https://gitlab-transcend.devpost.com/rules), [Resources](https://gitlab-transcend.devpost.com/resources) |
| Video | “less than three (3) minutes”; show functioning software and upload to YouTube. Rules say publicly visible; resources allow Public or Unlisted. Public is the conservative choice. | [Rules, section 4](https://gitlab-transcend.devpost.com/rules), [Resources FAQ](https://gitlab-transcend.devpost.com/resources) |
| Reproduction | “instructions required”; README must explain installation, execution and judge reproduction to satisfy this requirement. The rules do not prescribe a named README template. | [Rules, section 4](https://gitlab-transcend.devpost.com/rules) |
| Path B | Original MIT open-source repository URL and live deployed project URL are mandatory. Agent automation and deployment must be added after October 5; keep deployment available through the winner announcement around November 16. | [Rules, section 4](https://gitlab-transcend.devpost.com/rules), [Resources FAQ](https://gitlab-transcend.devpost.com/resources) |
| Target category | “Best Supervised Agent”; autonomous audit/classification precede one human outcome gate. Do not claim a running agent until a real session is verified. | [Rules, sections 4 and 8](https://gitlab-transcend.devpost.com/rules) |

Category list: both Path A (Start Fresh) and Path B (Bring Your Own) offer Assisted, Supervised and Hands-off agent prizes. Special prizes cover Most Stages Covered, Most Environmentally Impactful and Most Creative. Each project can win one path prize and one special prize. Google Cloud deployment is optional and provides at most 0.2 bonus points; no spending or cloud account was authorized here.

## Project placement decision

The existing [showcase](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/showcase) is an automatically provisioned workspace, not a mandatory fork template or a substantive sample implementation. API inspection found only its generic GitLab starter README and the [welcome issue](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/showcase/-/work_items/1). Both invite adding an existing repository; neither requires replacing showcase.

Created [sponsorfit](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43238005/sponsorfit) in the same provisioned subgroup (project ID 87478175). This preserves the welcome workspace and retains the original [GitHub MIT project](https://github.com/RyanDev1st/sponsorfit) as `origin`. The GitLab remote contains no credentials. The subgroup's Developer + AI role grants catalog item and consumer administration despite base access level 30.

## Submission work still required

This setup alone is not a completed Devpost submission. Verify live deployment, running flow/session and visible successful pipeline history; record a video under the limit; then complete the Devpost form before the deadline. Freeze the submitted repository, video and linked artifacts during judging as instructed by the resources FAQ. No third-party specification files are added to this repository by this change; local ignored schema copies were used only for validation.
