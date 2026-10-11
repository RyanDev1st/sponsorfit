# SponsorFit: Demonstration Video Walkthrough Script

> **Target Duration:** 2 minutes 30 seconds (Max allowed: 2:45)
> **Pacing:** ~145 words per minute (~360 words total)
> **Format:** Timestamped shot list with exact screen interactions and voiceover text.

---

### Shot List & Timestamped Voiceover

#### 0:00 – 0:22 | Act 1: The Hook & The Creator Monetization Problem
- **On Screen:** Close-up of a generic creator pitch deck showing sample demographic reach ("35,000 monthly listeners, ages 25–40", from our demo preset) with callout: "Demographics alone miss cultural taste."
- **Voiceover:**
  > *"When independent newsletter writers and indie podcasters pitch potential sponsors, they are often limited to generic demographic stats: follower counts and age demographics.
  > But sponsorship conversations require authentic audience alignment.
  > Welcome to SponsorFit: the agentic tool that turns audience cultural taste into structured sponsor insights using Qloo's Taste Graph."*

---

#### 0:22 – 0:50 | Act 2: Setting the Cultural Profile & Running the Agent
- **On Screen:** Screen share on [http://localhost:5173](http://localhost:5173). Cursor hovers over the preset button `The Slow Drift (Culture & Essay)` and clicks it.
- **Visual Action:** Input fields populate from the preset with "The Slow Drift", sample reach "35,000 monthly listeners", and seed tags: `A24`, `Phoebe Bridgers`, `Severance`, `Tartine Bakery`.
- **Voiceover:**
  > *"Instead of asking for follower numbers, SponsorFit asks for your audience's cultural fingerprint.
  > Here, our culture podcast audience loves A24 films, indie songwriter Phoebe Bridgers, the show Severance, and Tartine Bakery.
  > We click 'Run Cultural Sponsorship Audit'."*
- **Visual Action:** Click the terracotta button `Run Cultural Sponsorship Audit â†’`. Spinner briefly appears: *"Traversing Qloo Cultural Graph..."*

---

#### 0:50 – 1:15 | Act 3: Agent Tool Execution Trace
- **On Screen:** The run completes. Input card collapses into a sleek summary bar. Cursor clicks `ðŸ¤– Agent Trace (4 steps)`.
- **Visual Action:** Tool trace cards appear showing `qloo_search_entities`, `qloo_get_insights`, `deterministic_ranking_engine`, and `deterministic_template_writer`.
- **Voiceover:**
  > *"Under the hood, the agent executes four transparent steps.
  > First, it resolves each seed keyword into canonical Qloo URN entities.
  > Next, it queries Qloo's v2 insights endpoint for brand affinities and cross-domain overlap.
  > Then, our ranking engine deterministically benchmarks candidate brands against sample averages.
  > Every step records exact parameters, row counts, and latency."*

---

#### 1:15 – 1:45 | Act 4: Ranked Sponsor Fit Tiers (Above the Fold)
- **On Screen:** Cursor clicks `ðŸ† Ranked Sponsors`. The view displays ranked sponsor cards starting right at the top of the 1440x900 viewport.
- **Visual Action:** Focus zooms on top candidate cards from our mock dataset: `Rank 1: Aesop (sample affinity 94.2%, 1.32x sample mean [derived: affinity / mean(sample)])` and `Rank 2: Oatly (sample affinity 91.8%)`. Cursor highlights the plain-English explanation: *"Driven by audience interest in A24 (34% signal pull [field: query.explainability.signals])."*
- **Voiceover:**
  > *"Notice how our collapsed summary keeps all ranked sponsors above the fold.
  > In this mock mode demonstration, the engine ranks sample brand entities from our mock fixture: Aesop shows a sample affinity score of ninety-four percent, thirty-two percent above the sample mean, driven by sample interest in A24 films.
  > In live mode with a provisioned API key, SponsorFit queries Qloo's live Taste Graph with identical transparent field citations."*

---

#### 1:45 – 2:10 | Act 5: One-Page Cultural Media Kit & Markdown Download
- **On Screen:** Cursor clicks `ðŸ“„ Media Kit & Pitches`.
- **Visual Action:** The One-Page Cultural Media Kit dossier appears, detailing audience reach, seed signals, and the sponsor fit table. Cursor clicks `ðŸ“¥ Download media kit (Markdown)`.
- **Voiceover:**
  > *"SponsorFit generates a publication-ready Cultural Media Kit.
  > In one click, creators can download a clean Markdown dossier backed by zero-hallucination data.
  > You're no longer presenting unbacked claims—you're presenting empirical consumer preference data."*
- **Visual Action:** Browser downloads `the-slow-drift-cultural-media-kit.md`.

---

#### 2:10 – 2:32 | Act 6: Grounded Sponsor Pitch Letters & One-Click Copy
- **On Screen:** Cursor clicks `âœ‰ï¸ Sponsor Pitch Letters (3)` and selects sample draft `Pitch: Aesop (sample affinity 94%)`.
- **Visual Action:** Tailored pitch letter appears on screen. Cursor highlights field citations `[field: results.entities[0].affinity = 0.942]`. Cursor clicks `ðŸ“‹ Copy pitch`. Button transforms to `âœ“ Copied!`.
- **Voiceover:**
  > *"Switching to pitch letters, SponsorFit formats personalized cold outreach emails using this sample audit data.
  > Notice the difference: every claim cites verifiable Qloo API response fields, providing transparent data for outreach proposals.
  > One click copies the pitch ready for your email client."*

---

#### 2:32 – 2:45 | Act 7: Zero-Cost Deployment & Hackathon Conclusion
- **On Screen:** Transition to GitHub repo page [https://github.com/RyanDev1st/sponsorfit](https://github.com/RyanDev1st/sponsorfit) showing MIT License and passing test badge.
- **Voiceover:**
  > *"SponsorFit is open-source under MIT, tested with 16 automated tests, and prepped for zero-cost deployment on Vercel Hobby.
  > Built from scratch for the Qloo Agentic Hackathon: because AI agents should have taste."*
- **On Screen:** Closing title slide: **SponsorFit — Cultural Intelligence for Creator Sponsorships**. Links: `github.com/RyanDev1st/sponsorfit` • `sponsorfit.vercel.app`.
