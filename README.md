# SponsorFit: Cultural Intelligence for Creator Sponsorships

> **Turn audience cultural taste into quantifiable brand partnerships.**  
> Built for the **Qloo Agentic Hackathon: "Agents, but with taste"** (April 2026).

---

## Visual End-to-End Walkthrough (1440x900)

| Step 1: Cultural Audience Input | Step 2: 4-Step Autonomous Agent Execution | Step 3: Verified Rankings, Media Kit & Pitches |
| :---: | :---: | :---: |
| ![01 Input Form](docs/screenshots/01-input.png) | ![02 Agent Trace](docs/screenshots/02-agent-trace.png) | ![03 Results & Media Kit](docs/screenshots/03-results.png) |

---

## 1. Problem & Executive Pitch

Independent newsletter publishers, podcasters, and boutique media creators struggle to win brand sponsorships. They send pitch decks citing basic, flat metrics ("we have 35,000 monthly listeners aged 25–40"), competing against algorithmic ad exchanges. Meanwhile, premium brands (e.g., Oatly, Aesop, Patagonia, Kinto) seek authentic cultural alignment but have no empirical method to verify whether a creator's niche audience truly overlaps with their brand values.

**SponsorFit** solves this with an autonomous cultural intelligence agent powered by **Qloo's Cultural Taste Graph** ([Qloo Developer Guide](https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide)):

1. **Entity Resolution (`/search`):** Ground creator audience affinity seeds into canonical Qloo URN entities.
2. **Taste Graph Ingestion (`/v2/insights`):** Query high-confidence cross-domain brand affinities and explainability drivers.
3. **Deterministic Ranking Engine:** Rank prospective sponsors by empirical affinity multipliers against the candidate set sample mean ($A_i / \bar{A}$).
4. **Cultural Media Kit & Grounded Pitch Writer:** Generate actionable brand pitches and one-page media kits where **every single statistic cites an exact response field from Qloo's API**—eliminating hallucination.

---

## 2. API Provisioning Disclosure ("Mock Until Key")

> **Current Status:** Qloo Hackathon API keys are provisioned manually by hackathon organizers.  
> SponsorFit includes a **transparent, production-identical mock layer** that defaults to offline mode when `QLOO_API_KEY` is omitted or empty.

- **Offline Mode:** The UI displays a prominent amber badge (`MOCK DATA (PROVISIONING API KEY)`). All shapes, URNs, affinity scores, and explainability signals exactly mirror the official Qloo LLM Hackathon OpenAPI specification (`https://hackathon.api.qloo.com`).
- **Live Mode:** Once your hackathon API key is issued, set `QLOO_API_KEY=your_key` in `.env` (or Vercel environment variables). The client immediately switches to live queries against `https://hackathon.api.qloo.com` using the required `X-Api-Key` header with zero code changes.

---

## 3. Quickstart & Local Setup

### Prerequisites
- Node.js 18+ (tested on Node 20 / 22 / 24)
- npm 9+

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional, defaults to mock mode)
cp env.example .env
# Edit .env if you have a Qloo Hackathon API key:
# QLOO_API_KEY=your_key_here

# 3. Run unit & integration test suite (16 tests across all globs)
npm test

# 4. Start local development server (Vite dev server + embedded API mock middleware)
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
# Compile TypeScript and bundle frontend SPA to dist/
npm run build

# Preview production build locally
npm run preview
```

### End-to-End CDP Automation Script

```bash
# Run headless Edge CDP automation script to drive the UI, verify zero console errors, and capture screenshots:
node scripts/capture-e2e.mjs
```

---

## 4. Agent Architecture & Zero Hallucination Guarantee

```
  [User Cultural Seeds]
      (e.g., A24, Phoebe Bridgers, Severance, Tartine Bakery)
               │
               ▼
┌────────────────────────────────────────────────────────┐
│ Step 1: Entity Resolution (qloo_search_entities)       │
│ Endpoint: /search?query=...&types=...                  │
│ Output: Canonical URNs (e.g. urn:entity:movie:...)     │
└────────────────────────────────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────────────────┐
│ Step 2: Taste Graph Traversal (qloo_get_insights)      │
│ Endpoint: /v2/insights                                 │
│ Params: filter.type=urn:entity:brand                   │
│         signal.interests.entities=<URNs>               │
│         feature.explainability=true                    │
│ Output: Brand affinities & cross-domain fingerprints   │
└────────────────────────────────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────────────────┐
│ Step 3: Deterministic Ranking Engine                   │
│ Math: Multiplier = round(affinity / mean(sample), 2)   │
│ Sorting: Descending affinity, confidence weighting     │
└────────────────────────────────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────────────────┐
│ Step 4: Grounded Media Kit & Pitch Letter Writer       │
│ Strict Provenance: Every statistic links to:           │
│   • results.entities[i].affinity                       │
│   • results.entities[i].query.explainability.signals   │
│   • results.entities[i].tags                           │
└────────────────────────────────────────────────────────┘
```

### Exact Provenance Citations
Every pitch letter and media kit bullet highlights its underlying Qloo response field:
- **Affinity Score:** `results.entities[i].affinity` (e.g., `0.94`)
- **Index Multiplier:** Derived against candidate sample mean $\bar{A}$ (e.g., `1.32x vs sample mean`)
- **Driver Signal:** `results.entities[i].query.explainability.signals[j].influence` (e.g., `+34%`)
- **Category Alignment:** `results.entities[i].tags` (e.g., `specialty-coffee`, `editorial`)

---

## 5. Free Hosting Preparation

SponsorFit is engineered for $0 budget zero-friction deployment.

### Option A: Vercel Hobby Tier (Primary Target)

Vercel configuration is pre-wired in [`vercel.json`](vercel.json) and [`api/[...path].mjs`](api/[...path].mjs):
- **Vite SPA build:** Pre-configured with `"framework": "vite"`, `"buildCommand": "npm run build"`, and `"outputDirectory": "dist"` (Reference: [Vercel Vite Documentation](https://vercel.com/docs/frameworks/vite)).
- **Serverless API Catch-All:** `api/[...path].mjs` adapts incoming requests directly to the framework-neutral handler (Reference: [Vercel Functions Documentation](https://vercel.com/docs/functions)).
- **Clean Rewrites:** Routes `/api/(.*)` to the serverless function adapter and all other paths to `/index.html` for client routing.

#### Vercel Environment Variables
In your Vercel Project Dashboard (`Settings` → `Environment Variables`), configure:
1. `QLOO_API_KEY`: *(Optional)* Your official Qloo Hackathon API key. If omitted, the app runs gracefully in offline mock mode with the amber badge.
2. `GEMINI_API_KEY`: *(Optional)* Google Gemini API key if enabling live dynamic LLM pitch writing (defaults to deterministic zero-hallucination template writer if omitted).

#### Vercel Hobby Fair Use & Terms Compliance
Under [Vercel Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines):
> *"The Hobby plan is for personal, non-commercial use. If you are using Vercel for your business or monetized project, you must upgrade to Pro."*

SponsorFit is a non-commercial, open-source educational hackathon submission with zero paywalls, zero ads, and zero revenue generation. It strictly complies with the Vercel Hobby plan terms.

### Option B: Cloudflare Workers (Zero-Cost Fallback)

Because [`api/handler.mjs`](api/handler.mjs) is written purely in Web Standard APIs (`Request` and `Response`), it can run on Cloudflare Workers without modification:
- Free tier includes **100,000 requests per day** and unlimited edge deployments.
- Reference: [Cloudflare Workers Platform Pricing](https://developers.cloudflare.com/workers/platform/pricing/).

---

## 6. Verification & Test Evidence

Run the full test suite using glob patterns:
```bash
node --test "api/**/*.test.mjs"
```

### Verified Test Suite (16 of 16 Passing):
- `api/qloo-client.test.mjs`: Tests mock fallback, custom base URL, `X-Api-Key` header injection, and parameter encoding.
- `api/agent.test.mjs`: Tests full 4-step autonomous audit pipeline, ranking order, and pitch provenance generation.
- `api/handler.test.mjs`: Tests HTTP routing, `/api/health`, `/api/search`, `/api/audit`, and CORS preflight.
- `api/honesty-audit.test.mjs`: **Mathematical honesty verification**: Asserts that every number in the sponsor rankings, media kit, and pitches matches exact fixture fields and contains zero ungrounded marketing claims.
- `api/vercel-adapter.test.mjs`: Tests `api/[...path].mjs` handling standard Web `Request` objects in mock mode.

---

## 7. License

MIT License. Designed and crafted for the Qloo Hackathon 2026.
