/**
 * SponsorFit Demo Video Pipeline
 *
 * Fully automated $0 demo video production pipeline.
 * - Windows SAPI TTS voiceover synthesis with dynamic mock/sample data phrasing
 * - Headless Microsoft Edge screen recording via Chrome DevTools Protocol (CDP)
 * - Animated cursor, mouse clicks, and click ripple overlays
 * - Configurable FFMPEG/FFPROBE binaries and configurable target VIDEO_URL
 * - 1920x1080 resolution, burned-in subtitles, and 6 QC still frames
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

function findBinary(envVar, name) {
  if (process.env[envVar]) return process.env[envVar];
  const wingetPath = `C:/Users/admin/AppData/Local/Microsoft/WinGet/Links/${name}.exe`;
  if (fs.existsSync(wingetPath)) return wingetPath;
  const hermesPath = `D:/Hermes/tools/ffmpeg-9.0.1-win32-x64/bin/${name}.exe`;
  if (fs.existsSync(hermesPath)) return hermesPath;
  return name;
}

const FFMPEG_BIN = findBinary('FFMPEG_BIN', 'ffmpeg');
const FFPROBE_BIN = findBinary('FFPROBE_BIN', 'ffprobe');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CDP_PORT = 9223;
const FPS = 10;
const FRAME_MS = 1000 / FPS;

const VIDEO_DIR = path.resolve('submission/video');
const FRAMES_DIR = path.join(VIDEO_DIR, 'frames');
const AUDIO_DIR = path.join(VIDEO_DIR, 'audio');
const QC_DIR = path.join(VIDEO_DIR, 'qc');
const OUTPUT_MP4 = path.join(VIDEO_DIR, 'sponsorfit-demo.mp4');
const MASTER_AUDIO = path.join(AUDIO_DIR, 'master_audio.wav');
const SRT_PATH = path.join(VIDEO_DIR, 'subtitles.srt');
const TIMINGS_PATH = path.join(AUDIO_DIR, 'voiceover_timings.json');

const TARGET_URL = process.env.VIDEO_URL || 'http://localhost:5173';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getTitleCardHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px;
      height: 1080px;
      background: #FAF8F5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #1A1A1A;
      overflow: hidden;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 20px;
      background: #FFF1EB;
      border: 1px solid #F5C7B6;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 700;
      color: #C85A32;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 28px;
    }
    .logo-container {
      display: flex;
      align-items: baseline;
      gap: 16px;
      margin-bottom: 14px;
    }
    .title {
      font-size: 76px;
      font-weight: 800;
      color: #1C1917;
      letter-spacing: -1.5px;
    }
    .title span {
      color: #C85A32;
      font-style: italic;
      font-weight: 400;
    }
    .tagline {
      font-size: 28px;
      font-weight: 400;
      color: #57534E;
      font-style: italic;
      margin-bottom: 44px;
    }
    .pills {
      display: flex;
      gap: 16px;
    }
    .pill {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      padding: 10px 22px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      color: #44403C;
      box-shadow: 0 2px 4px rgba(0,0,0,0.04);
    }
  </style>
</head>
<body>
  <div class="badge">✦ Official Qloo Agentic AI Hackathon Submission</div>
  <div class="logo-container">
    <div class="title">SponsorFit <span>AI</span></div>
  </div>
  <div class="tagline">Cultural Intelligence for Creator Sponsorships</div>
  <div class="pills">
    <div class="pill">🌐 Qloo Taste Graph API</div>
    <div class="pill">🤖 Multi-Step Autonomous Agent</div>
    <div class="pill">📊 Deterministic Ranking & Benchmarks</div>
    <div class="pill">📑 Zero-Hallucination Field Citations</div>
  </div>
</body>
</html>`;
}

function getProblemCardHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px;
      height: 1080px;
      background: #FAF8F5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #1C1917;
      overflow: hidden;
      padding: 60px;
    }
    .problem-header {
      text-align: center;
      margin-bottom: 40px;
    }
    .problem-badge {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #C85A32;
      background: #FFF1EB;
      border: 1px solid #F5C7B6;
      padding: 6px 16px;
      border-radius: 999px;
      display: inline-block;
      margin-bottom: 16px;
    }
    .problem-title {
      font-size: 46px;
      font-weight: 700;
      color: #1C1917;
      letter-spacing: -0.5px;
    }
    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 36px;
      max-width: 1400px;
      width: 100%;
    }
    .card {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 16px;
      padding: 36px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .card-title {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .card-bad {
      border-top: 5px solid #EF4444;
    }
    .card-good {
      border-top: 5px solid #16A34A;
    }
    .card-content {
      font-size: 16px;
      line-height: 1.6;
      color: #44403C;
    }
    .card-content ul {
      margin-left: 20px;
      margin-top: 14px;
    }
    .card-content li {
      margin-bottom: 10px;
    }
    .callout {
      margin-top: 40px;
      font-size: 20px;
      font-style: italic;
      color: #57534E;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="problem-header">
    <div class="problem-badge">The Creator Monetization Problem</div>
    <h2 class="problem-title">Demographics Don't Sell Premium Brands — Cultural Taste Does</h2>
  </div>
  <div class="comparison-grid">
    <div class="card card-bad">
      <div class="card-title" style="color: #DC2626;">❌ Generic Media Deck Approach</div>
      <div class="card-content">
        <p><strong>"35,000 monthly listeners, ages 25–40"</strong></p>
        <ul>
          <li>Blunt age brackets fail to differentiate your publication</li>
          <li>Cold emails sound like every other automated sales pitch</li>
          <li>No empirical proof why subscribers buy high-end goods</li>
        </ul>
      </div>
    </div>
    <div class="card card-good">
      <div class="card-title" style="color: #15803D;">✓ SponsorFit Cultural Intelligence</div>
      <div class="card-content">
        <p><strong>"Audience cultural anchors: A24, Phoebe Bridgers, Severance"</strong></p>
        <ul>
          <li>Cross-domain affinity mapping via Qloo Taste Graph</li>
          <li>Verifiable response field citations prove exact audience overlap</li>
          <li>Candidate brand alignment evaluated via Qloo Taste Graph affinities</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="callout">"Turn audience taste into quantifiable brand partnerships."</div>
</body>
</html>`;
}

function getClosingCardHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px;
      height: 1080px;
      background: #FAF8F5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #1C1917;
      overflow: hidden;
    }
    .logo-container {
      display: flex;
      align-items: baseline;
      gap: 16px;
      margin-bottom: 12px;
    }
    .title {
      font-size: 68px;
      font-weight: 800;
      color: #1C1917;
      letter-spacing: -1.5px;
    }
    .title span {
      color: #C85A32;
      font-style: italic;
      font-weight: 400;
    }
    .tagline {
      font-size: 26px;
      font-weight: 400;
      color: #57534E;
      font-style: italic;
      margin-bottom: 36px;
    }
    .meta-box {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 12px;
      padding: 24px 36px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      margin-bottom: 28px;
    }
    .meta-row {
      font-size: 16px;
      font-weight: 600;
      color: #292524;
      margin-bottom: 8px;
    }
    .meta-sub {
      font-size: 14px;
      color: #78716C;
    }
    .links {
      font-size: 17px;
      font-weight: 600;
      color: #C85A32;
      letter-spacing: 0.02em;
    }
  </style>
</head>
<body>
  <div class="logo-container">
    <div class="title">SponsorFit <span>AI</span></div>
  </div>
  <div class="tagline">Because AI Agents Should Have Taste</div>
  <div class="meta-box">
    <div class="meta-row">Open Source (MIT) • 16 Automated Test Suites • $0 Vercel Deployment</div>
    <div class="meta-sub">Built for the Qloo Agentic AI Hackathon with Qloo Taste Graph API</div>
  </div>
  <div class="links">github.com/RyanDev1st/sponsorfit &nbsp;•&nbsp; sponsorfit.vercel.app</div>
</body>
</html>`;
}

async function run() {
  console.log('=== SponsorFit Demo Video Pipeline ===');

  // Prepare directories
  for (const d of [VIDEO_DIR, FRAMES_DIR, AUDIO_DIR, QC_DIR]) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  }

  // 1. Synthesize Audio if needed
  if (!fs.existsSync(MASTER_AUDIO) || !fs.existsSync(TIMINGS_PATH)) {
    console.log('Generating voiceover audio via synthesize-audio.ps1...');
    await new Promise((resolve, reject) => {
      const ps = spawn('powershell', ['-ExecutionPolicy', 'Bypass', '-File', path.join(VIDEO_DIR, 'synthesize-audio.ps1')], {
        stdio: 'inherit',
      });
      ps.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`Audio synthesis failed: ${code}`))));
    });
  }

  const rawTimings = fs.readFileSync(TIMINGS_PATH, 'utf8').replace(/^\uFEFF/, '');
  const timings = JSON.parse(rawTimings);
  console.log(`Loaded voiceover timings: total duration = ${timings.totalDuration} seconds`);

  // Start local preview/mock server if VIDEO_URL not set and port 5173 is not open
  let localServer = null;
  let localPreview = null;

  if (!process.env.VIDEO_URL) {
    let portOpen = false;
    try {
      const probe = await fetch('http://localhost:5173/api/health');
      if (probe.ok) portOpen = true;
    } catch {}

    if (!portOpen) {
      console.log('Building SponsorFit production bundle...');
      await new Promise((resolve, reject) => {
        const build = spawn('cmd.exe', ['/c', 'npm', 'run', 'build'], { stdio: 'inherit' });
        build.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`Build failed: ${code}`))));
      });

      console.log('Starting local api/server.mjs and vite preview...');
      localServer = spawn('node', ['api/server.mjs'], { stdio: 'ignore' });
      localPreview = spawn('cmd.exe', ['/c', 'npx', 'vite', 'preview', '--port', '5173'], { stdio: 'ignore' });
      await sleep(3000);
    }
  }

  // Launch headless Edge
  console.log(`Launching Edge at 1920x1080 on CDP port ${CDP_PORT}...`);
  const edgeArgs = [
    `--remote-debugging-port=${CDP_PORT}`,
    '--headless=new',
    '--window-size=1920,1080',
    '--hide-scrollbars',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ];
  const edgeProc = spawn(EDGE_PATH, edgeArgs);

  try {
    let targetWsUrl = null;
    for (let i = 0; i < 30; i++) {
      await sleep(500);
      try {
        const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
        if (res.ok) {
          const list = await res.json();
          const page = list.find((p) => p.type === 'page');
          if (page && page.webSocketDebuggerUrl) {
            targetWsUrl = page.webSocketDebuggerUrl;
            break;
          }
        }
      } catch {}
    }

    if (!targetWsUrl) {
      throw new Error('Could not find page target on Edge CDP port ' + CDP_PORT);
    }

    const ws = new WebSocket(targetWsUrl);
    let msgId = 1;
    const pending = new Map();
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.id && pending.has(d.id)) {
        pending.get(d.id).resolve(d.result);
        pending.delete(d.id);
      }
    };
    await new Promise((r) => (ws.onopen = r));

    const send = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const id = msgId++;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });

    let frameIndex = 0;
    async function captureFrame() {
      const { data } = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
      const fName = `frame_${String(frameIndex++).padStart(5, '0')}.jpg`;
      fs.writeFileSync(path.join(FRAMES_DIR, fName), Buffer.from(data, 'base64'));
    }

    async function moveCursor(fromX, fromY, toX, toY, steps) {
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const x = Math.round(fromX + (toX - fromX) * t);
        const y = Math.round(fromY + (toY - fromY) * t);
        await send('Runtime.evaluate', { expression: `window.__setCursor(${x}, ${y})` });
        await captureFrame();
      }
    }

    async function clickAt(x, y) {
      await send('Runtime.evaluate', {
        expression: `(() => {
          window.__setCursor(${x}, ${y});
          window.__clickRipple();
          const el = document.elementFromPoint(${x}, ${y});
          if (el) el.click();
        })()`,
      });
    }

    const getShotDuration = (id) => timings.shots.find((s) => s.Id === id)?.Duration || 20.0;
    const getShotFrames = (id) => Math.round(getShotDuration(id) * FPS);

    // --- Title Card (2.0s = 20 frames) ---
    console.log('1. Recording Title Card (2.0s, 20 frames)...');
    const titleDataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(getTitleCardHtml())}`;
    await send('Page.navigate', { url: titleDataUrl });
    await sleep(800);
    for (let i = 0; i < 20; i++) {
      await captureFrame();
    }

    // --- Shot 1: The Hook & Problem Slide (25.24s -> 252 frames) ---
    console.log('2. Recording Shot 1: The Hook & Creator Monetization Problem (252 frames)...');
    const problemDataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(getProblemCardHtml())}`;
    await send('Page.navigate', { url: problemDataUrl });
    await sleep(1000);
    const s1Frames = getShotFrames('shot_01_hook');
    for (let i = 0; i < s1Frames; i++) {
      await captureFrame();
    }

    // --- Navigate to Live App ---
    console.log(`3. Navigating to SponsorFit App at ${TARGET_URL}...`);
    await send('Page.navigate', { url: TARGET_URL });
    await sleep(3500);

    // Inject Demo Cursor Overlay
    await send('Runtime.evaluate', {
      expression: `(() => {
        const cursor = document.createElement('div');
        cursor.id = '__demo_cursor';
        cursor.style.cssText = 'position:fixed;width:24px;height:24px;border-radius:50%;background:rgba(200,90,50,0.35);border:2px solid #C85A32;box-shadow:0 0 10px rgba(200,90,50,0.6);pointer-events:none;z-index:9999999;transform:translate(-50%,-50%);transition:all 0.15s ease-out;display:block;';
        document.body.appendChild(cursor);

        const dot = document.createElement('div');
        dot.style.cssText = 'position:absolute;top:50%;left:50%;width:6px;height:6px;border-radius:50%;background:#C85A32;transform:translate(-50%,-50%);';
        cursor.appendChild(dot);

        window.__cursorX = 960;
        window.__cursorY = 540;

        window.__setCursor = (x, y) => {
          window.__cursorX = x;
          window.__cursorY = y;
          cursor.style.left = x + 'px';
          cursor.style.top = y + 'px';
        };

        window.__clickRipple = () => {
          const rip = document.createElement('div');
          rip.style.cssText = 'position:fixed;left:' + window.__cursorX + 'px;top:' + window.__cursorY + 'px;width:10px;height:10px;border-radius:50%;border:2px solid #C85A32;pointer-events:none;z-index:9999998;transform:translate(-50%,-50%);animation:__ripple 0.4s ease-out forwards;';
          document.body.appendChild(rip);
          setTimeout(() => rip.remove(), 400);
        };

        const style = document.createElement('style');
        style.textContent = '@keyframes __ripple { 0% { width: 10px; height: 10px; opacity: 1; } 100% { width: 60px; height: 60px; opacity: 0; } }';
        document.head.appendChild(style);

        window.__setCursor(400, 40);
      })()`,
    });

    // --- Shot 2: Setting the Cultural Profile & Running the Agent (17.0s -> 170 frames) ---
    console.log('4. Recording Shot 2: Setting Cultural Profile & Running Agent (170 frames)...');
    const s2Frames = getShotFrames('shot_02_seeds');

    // Pan cursor to the top right to prominently show the MOCK DATA badge
    await moveCursor(400, 40, 1680, 28, 30);
    // Pan down to Edit Profile / Presets
    await send('Runtime.evaluate', {
      expression: `(() => {
        const editBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Edit Profile'));
        if (editBtn) editBtn.click();
      })()`,
    });
    await sleep(600);

    // Click preset: "The Slow Drift"
    await send('Runtime.evaluate', {
      expression: `(() => {
        const preset = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('The Slow Drift'));
        if (preset) {
          const r = preset.getBoundingClientRect();
          window.__setCursor(r.left + r.width / 2, r.top + r.height / 2);
          window.__clickRipple();
          preset.click();
        }
      })()`,
    });
    await sleep(600);

    // Pan over seeds tags
    await moveCursor(1000, 180, 450, 400, 30);
    // Click "Run Cultural Sponsorship Audit"
    await send('Runtime.evaluate', {
      expression: `(() => {
        const runBtn = document.querySelector('#run-audit-button') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Run Cultural Sponsorship Audit'));
        if (runBtn) {
          const r = runBtn.getBoundingClientRect();
          window.__setCursor(r.left + r.width / 2, r.top + r.height / 2);
          window.__clickRipple();
          runBtn.click();
        }
      })()`,
    });
    await sleep(1500);

    for (let i = 100; i < s2Frames; i++) {
      await captureFrame();
    }

    // --- Shot 3: Agent Tool Execution Trace (23.8s -> 238 frames) ---
    console.log('5. Recording Shot 3: Agent Tool Execution Trace (238 frames)...');
    const s3Frames = getShotFrames('shot_03_trace');
    // Click "#tab-trace-btn"
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('#tab-trace-btn') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Agent Trace'));
        if (btn) {
          const r = btn.getBoundingClientRect();
          window.__setCursor(r.left + r.width / 2, r.top + r.height / 2);
          window.__clickRipple();
          btn.click();
        }
      })()`,
    });
    await sleep(800);

    // Pan through the 4 tool steps
    await moveCursor(960, 200, 450, 320, 30); // Step 1: qloo_search_entities
    await moveCursor(450, 320, 450, 480, 35); // Step 2: qloo_get_insights
    await moveCursor(450, 480, 450, 640, 35); // Step 3: deterministic_ranking_engine
    await moveCursor(450, 640, 450, 800, 35); // Step 4: deterministic_template_writer

    for (let i = 135; i < s3Frames; i++) {
      await captureFrame();
    }

    // --- Shot 4: Ranked Sponsor Fit Tiers (24.0s -> 240 frames) ---
    console.log('6. Recording Shot 4: Ranked Sponsor Fit Tiers (240 frames)...');
    const s4Frames = getShotFrames('shot_04_ranked');
    // Click "#tab-sponsors-btn"
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('#tab-sponsors-btn') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Ranked Sponsors'));
        if (btn) {
          const r = btn.getBoundingClientRect();
          window.__setCursor(r.left + r.width / 2, r.top + r.height / 2);
          window.__clickRipple();
          btn.click();
        }
      })()`,
    });
    await sleep(800);

    // Pan across Aesop card (rank 1, 94.2% sample affinity, A24 influence)
    await moveCursor(600, 200, 500, 320, 30);
    // Pan to field citation badge
    await moveCursor(500, 320, 750, 420, 35);
    // Pan up to the header MOCK DATA badge to emphasize honesty
    await moveCursor(750, 420, 1680, 28, 40);

    for (let i = 105; i < s4Frames; i++) {
      await captureFrame();
    }

    // --- Shot 5: One-Page Cultural Media Kit & Markdown Download (15.1s -> 151 frames) ---
    console.log('7. Recording Shot 5: One-Page Cultural Media Kit (151 frames)...');
    const s5Frames = getShotFrames('shot_05_mediakit');
    // Click "#tab-mediakit-btn"
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('#tab-mediakit-btn') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Media Kit & Pitches'));
        if (btn) {
          const r = btn.getBoundingClientRect();
          window.__setCursor(r.left + r.width / 2, r.top + r.height / 2);
          window.__clickRipple();
          btn.click();
        }
      })()`,
    });
    await sleep(800);

    // Pan across media kit table
    await moveCursor(1680, 28, 600, 450, 40);
    // Move to download button
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Download media kit'));
        if (btn) {
          const r = btn.getBoundingClientRect();
          window.__setCursor(r.left + r.width / 2, r.top + r.height / 2);
          window.__clickRipple();
        }
      })()`,
    });

    for (let i = 50; i < s5Frames; i++) {
      await captureFrame();
    }

    // --- Shot 6: Grounded Sponsor Pitch Letters (19.31s -> 193 frames) ---
    console.log('8. Recording Shot 6: Grounded Sponsor Pitch Letters (193 frames)...');
    const s6Frames = getShotFrames('shot_06_pitch');
    // Click "Sponsor Pitch Letters" sub-tab
    await send('Runtime.evaluate', {
      expression: `(() => {
        const tab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Sponsor Pitch Letters'));
        if (tab) {
          const r = tab.getBoundingClientRect();
          window.__setCursor(r.left + r.width / 2, r.top + r.height / 2);
          window.__clickRipple();
          tab.click();
        }
      })()`,
    });
    await sleep(800);

    // Pan into pitch text and citations
    await moveCursor(1100, 220, 650, 450, 40);
    // Click "Copy pitch"
    await send('Runtime.evaluate', {
      expression: `(() => {
        const copyBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Copy pitch'));
        if (copyBtn) {
          const r = copyBtn.getBoundingClientRect();
          window.__setCursor(r.left + r.width / 2, r.top + r.height / 2);
          window.__clickRipple();
          copyBtn.click();
        }
      })()`,
    });
    await sleep(800);

    for (let i = 50; i < s6Frames; i++) {
      await captureFrame();
    }

    // --- Shot 7: Zero-Cost Deployment & Hackathon Conclusion (14.68s -> 147 frames) ---
    console.log('9. Recording Shot 7: Closing slide & Open-Source Details (147 frames)...');
    const closeDataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(getClosingCardHtml())}`;
    await send('Page.navigate', { url: closeDataUrl });
    await sleep(1000);
    const s7Frames = getShotFrames('shot_07_close');
    for (let i = 0; i < s7Frames; i++) {
      await captureFrame();
    }

    // Extra hold at end (2.0s = 20 frames)
    for (let i = 0; i < 20; i++) {
      await captureFrame();
    }

    console.log(`Total frames recorded: ${frameIndex}`);
    ws.close();
  } finally {
    edgeProc.kill();
    if (localServer) localServer.kill();
    if (localPreview) localPreview.kill();
  }

  // --- Assembly via FFmpeg ---
  console.log('10. Assembling MP4 with FFmpeg, burned-in subtitles, and master audio...');
  const ffmpegArgs = [
    '-y',
    '-framerate', String(FPS),
    '-i', 'frames/frame_%05d.jpg',
    '-i', 'audio/master_audio.wav',
    '-vf', "scale=1920:1080,subtitles=subtitles.srt:force_style='FontSize=22,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=3,Outline=2,Shadow=0,MarginV=28,FontName=Segoe UI'",
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-b:v', '3500k',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    'sponsorfit-demo.mp4',
  ];

  await new Promise((resolve, reject) => {
    const ff = spawn(FFMPEG_BIN, ffmpegArgs, { cwd: VIDEO_DIR, stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    ff.stderr.on('data', (d) => (stderr += d.toString()));
    ff.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}:\n${stderr}`));
    });
  });

  const mp4Stats = fs.statSync(OUTPUT_MP4);
  console.log('MP4 produced successfully!');
  console.log('Path:', OUTPUT_MP4);
  console.log('Size:', (mp4Stats.size / (1024 * 1024)).toFixed(2), 'MB');

  // --- QC: Probe video & audio streams ---
  console.log('11. Quality Control Verification with ffprobe:');
  const probeInfo = await new Promise((resolve, reject) => {
    const ff = spawn(
      FFPROBE_BIN,
      ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', OUTPUT_MP4],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    );
    let stdout = '';
    ff.stdout.on('data', (d) => (stdout += d.toString()));
    ff.on('close', (code) => {
      if (code === 0) resolve(JSON.parse(stdout));
      else reject(new Error(`ffprobe failed with code ${code}`));
    });
  });

  const durationSec = Number(probeInfo.format.duration);
  const vStream = probeInfo.streams.find((s) => s.codec_type === 'video');
  const aStream = probeInfo.streams.find((s) => s.codec_type === 'audio');

  console.log(`- Duration: ${durationSec.toFixed(2)}s (Acceptance requires < 165s: ${durationSec < 165 ? 'PASS' : 'FAIL'})`);
  console.log(`- Video: ${vStream?.codec_name} ${vStream?.width}x${vStream?.height} @ ${vStream?.r_frame_rate} fps`);
  console.log(`- Audio: ${aStream?.codec_name} ${aStream?.sample_rate} Hz, ${aStream?.channels} ch`);

  // --- Volume level detection ---
  console.log('12. Checking volume levels via FFmpeg volumedetect...');
  const volInfo = await new Promise((resolve) => {
    const ff = spawn(FFMPEG_BIN, ['-i', MASTER_AUDIO, '-af', 'volumedetect', '-f', 'null', '-'], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stderr = '';
    ff.stderr.on('data', (d) => (stderr += d.toString()));
    ff.on('close', () => {
      const meanMatch = stderr.match(/mean_volume:\s*(-?[\d.]+)\s*dB/);
      const maxMatch = stderr.match(/max_volume:\s*(-?[\d.]+)\s*dB/);
      resolve({
        meanVolume: meanMatch ? `${meanMatch[1]} dB` : 'unknown',
        maxVolume: maxMatch ? `${maxMatch[1]} dB` : 'unknown',
      });
    });
  });
  console.log(`- Mean volume: ${volInfo.meanVolume}, Max volume: ${volInfo.maxVolume}`);

  // --- Extract 6 QC still frames ---
  console.log('13. Extracting 6 QC still frames...');
  const qcTimes = [
    { sec: 1.0, name: 'frame_1_title.png', desc: 'Title Card (SponsorFit brand & Qloo Hackathon badge)' },
    { sec: 12.0, name: 'frame_2_problem.png', desc: 'Act 1: Demographics vs Cultural Taste Problem Card' },
    { sec: 35.0, name: 'frame_3_seeds_input.png', desc: 'Act 2: Audience Cultural Fingerprint & Seed Tags' },
    { sec: 55.0, name: 'frame_4_agent_trace.png', desc: 'Act 3: Agent Tool Execution Trace (4 transparent steps)' },
    { sec: 80.0, name: 'frame_5_ranked_sponsors.png', desc: 'Act 4: Ranked Sponsors with MOCK DATA badge and field citations' },
    { sec: 120.0, name: 'frame_6_pitch_copy.png', desc: 'Act 6: Grounded Sponsor Pitch Letter with Copied confirmation' },
  ];

  for (const qc of qcTimes) {
    const outPath = path.join(QC_DIR, qc.name);
    await new Promise((resolve, reject) => {
      const ff = spawn(
        FFMPEG_BIN,
        ['-y', '-ss', String(qc.sec), '-i', OUTPUT_MP4, '-frames:v', '1', outPath],
        { stdio: ['ignore', 'pipe', 'pipe'] }
      );
      ff.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`QC frame extraction failed: ${code}`))));
    });
    console.log(`- Extracted ${qc.name}: ${qc.desc} (${fs.statSync(outPath).size} bytes)`);
  }

  console.log('=== SponsorFit Video Pipeline Completed Successfully ===');
}

run().catch((err) => {
  console.error('Video pipeline failed:', err);
  process.exit(1);
});
