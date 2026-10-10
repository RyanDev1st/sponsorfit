# Devpost Submission Form: SponsorFit

> **Hackathon:** Qloo Agentic Hackathon: "Agents, but with taste." (Fall 2026)  
> **Development Notice:** SponsorFit was built 100% from scratch during the official hackathon window (October 2026).

---

## 1. Project Information

- **Project Title:** SponsorFit
- **Tagline (≤ 60 chars):** Turn audience cultural taste into brand sponsorships
- **Live Demo URL:** [https://sponsorfit.vercel.app](https://sponsorfit.vercel.app) *(pending deploy)*
- **GitHub Repository:** [https://github.com/RyanDev1st/sponsorfit](https://github.com/RyanDev1st/sponsorfit)
- **License:** MIT License (`Copyright (c) 2026 SponsorFit contributors`)

---

## 2. Devpost Submission Fields

### Inspiration
Independent creators—newsletter writers, boutique podcasters, and YouTube essayists—power today's most engaged communities. Yet when pitching brands for sponsorships, they are forced to use generic demographic metrics: *"We reach 35,000 monthly listeners aged 25–40."*

This commoditizes creators, forcing them to compete directly against programmatic ad networks on CPM price. Meanwhile, premium brands (such as Aesop, Oatly, and Patagonia) crave authentic cultural resonance but have no objective tool to measure whether a niche creator's audience truly shares their brand values.

We built SponsorFit to replace flat demographics with deep cultural taste. Powered by Qloo's Taste Graph, SponsorFit enables creators to prove empirical cultural alignment to the exact brands their audience loves.

---

### What It Does
SponsorFit is a cultural intelligence agent that turns audience taste into quantifiable, pitch-ready sponsor partnerships:

1. **Audience Seed Grounding:** Creators enter 3–5 cultural anchors their audience loves (e.g., A24, Phoebe Bridgers, Severance, Tartine Bakery).
2. **Canonical Entity Resolution:** Queries Qloo `/search` to resolve input keywords into canonical cultural URNs across cinema, music, dining, and brands.
3. **Taste Graph Traversal:** Ingests high-affinity candidate brands and explainability signals via Qloo `/v2/insights`.
4. **Deterministic Ranking Engine:** Ranks sponsor candidates by affinity scores and computes relative multipliers against candidate sample averages ($A_i / \bar{A}$).
5. **Grounded Cultural Media Kit:** Synthesizes a one-page media kit and tailored cold outreach pitch letters where **every single statistic links directly to an underlying Qloo response field**—eliminating hallucination.
6. **One-Click Export:** Download the generated Media Kit as Markdown and copy personalized pitch emails with a single click.

---

### How We Built It
We designed SponsorFit from scratch with a focus on mathematical grounding, speed, and zero hosting costs:

- **Frontend:** Built with React 19, TypeScript, and Vite. Features an editorial typographic design (Newsreader & Space Grotesk) optimized for demo clarity at 1440x900 and 1280x720, with a compact summary bar keeping rankings above the fold.
- **Agent Core & API:** Framework-neutral ES module architecture (`api/agent.mjs`, `api/qloo-client.mjs`, `api/handler.mjs`) compatible with Web Standard APIs (`Request`/`Response`). Runs seamlessly on Node.js, Vercel Functions (`api/[...path].mjs`), and Cloudflare Workers.
- **Transparent Mock & Live Layer:** Because Qloo hackathon keys are provisioned manually, the client implements a transparent mock layer conforming to official OpenAPI schemas, transitioning to live queries on `https://hackathon.api.qloo.com` upon setting `QLOO_API_KEY`.
- **Honesty Verification:** Built an automated mathematical honesty test suite (`api/honesty-audit.test.mjs`) asserting that every number displayed traces to an official API response path.

---

### Challenges We Ran Into
1. **Zero-Hallucination Enforcement:** LLMs tend to embellish partnership pitches with unverified statistics (e.g., claiming "outperforms 85% of podcasts"). We solved this by implementing a deterministic template synthesizer and strict provenance tracking: every pitch explicitly cites underlying Qloo fields (`results.entities[i].affinity` and `query.explainability.signals`).
2. **Above-the-Fold Demo Polish:** Initial testing showed results starting below the fold on 1440x900 screens. We engineered a responsive view switcher with a collapsible summary bar so judges see ranked sponsors immediately without excessive scrolling.
3. **Free Tier Hosting Compatibility:** We architected the API to be framework-neutral using pure standard `fetch` and Web Standard `Request`/`Response`, allowing zero-cost deployment on Vercel Hobby or Cloudflare Workers with $0 budget.

---

### Accomplishments That We're Proud Of
- **16 of 16 Tests Passing:** Complete automated test suite covering live request building, mock fallback, ranking math, honesty provenance, and Vercel serverless adapters.
- **Deterministic Field Provenance:** Pitch letters don't just recommend sponsors—they prove why with exact field citations (`results.entities[0].affinity = 0.942`).
- **Demo-Quality UI:** Editorial, warm aesthetic crafted specifically for human judges and creators, verified headless via Edge CDP automation with zero console errors.

---

### What We Learned
- Qloo's cross-domain taste graph uncovers fascinating, non-obvious affinities that demographics miss entirely (e.g., an indie film fan base indexing strongly on specialty espresso hardware).
- Explainability signals (`query.explainability.signals`) are the secret weapon for B2B pitches: brands respond far better to specific cultural drivers ("driven by your audience's affinity for A24") than to generic percentages.

---

### What's Next for SponsorFit
- **Multi-Platform Audience Ingest:** Direct sync with Substack subscriber surveys and Spotify for Podcasters data.
- **Dynamic Live LLM Pitch Variations:** Activating live Google Gemini 2.5 Flash synthesis when `GEMINI_API_KEY` is provided to generate multiple tone variants (concise, creative, executive).
- **Outreach Tracker:** Lightweight CRM tracking response rates from pitched brand marketing teams.

---

### Built With
- **Qloo API:** `/search`, `/v2/insights` (Taste Graph, Entity Resolution, Explainability)
- **React 19 & TypeScript:** User Interface & Component Architecture
- **Vite:** Production Bundling & Dev Server Middleware
- **Node.js Test Runner:** Zero-dependency automated test suite
- **Vercel Serverless Functions:** Zero-cost edge hosting

---

## 3. Mapping to the 4 Judging Criteria (25% Each)

| Hackathon Criterion | Weight | How SponsorFit Excels |
| :--- | :---: | :--- |
| **1. Technological Implementation** | **25%** | Deep, non-trivial use of Qloo's `/search` and `/v2/insights`. Implements multi-entity signal ingestion, explainability feature traversal, deterministic relative multiplier math, and automated honesty testing. Full 16-test suite passing. |
| **2. Design** | **25%** | Complete, coherent product experience. Editorial design tokens, clear step-by-step agent execution cards, instant markdown downloads, one-click pitch copying, and compact layout optimized for 1440x900 viewports. |
| **3. Potential Impact** | **25%** | Solves a real, painful problem for independent media creators who struggle to monetize. Replaces race-to-the-bottom CPM pitching with high-value empirical cultural alignment. |
| **4. Quality of the Idea** | **25%** | Highly creative, non-obvious application of Qloo. Instead of generic consumer recommendations, SponsorFit applies taste AI to B2B creator sponsorship economics. |
