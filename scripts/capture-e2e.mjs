import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const screenshotsDir = join(projectRoot, 'docs', 'screenshots');
mkdirSync(screenshotsDir, { recursive: true });

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9222;
const TARGET_URL = 'http://localhost:5173';

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.pending = new Map();
    this.events = [];
    this.consoleLogs = [];
    this.exceptions = [];
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        } else if (msg.method) {
          if (msg.method === 'Runtime.consoleAPICalled') {
            const args = msg.params.args.map((a) => a.value ?? a.description ?? '').join(' ');
            this.consoleLogs.push({ type: msg.params.type, text: args });
          } else if (msg.method === 'Runtime.exceptionThrown') {
            const text = msg.params.exceptionDetails.text || msg.params.exceptionDetails.exception?.description;
            this.exceptions.push(text);
          }
          this.events.push(msg);
        }
      };
    });
  }

  async send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.value;
  }

  async screenshot(filePath) {
    const { data } = await this.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    });
    const buffer = Buffer.from(data, 'base64');
    writeFileSync(filePath, buffer);
  }

  close() {
    try {
      this.ws.close();
    } catch {}
  }
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForHttp(url, maxRetries = 20) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {}
    await sleep(300);
  }
  throw new Error(`Timeout waiting for ${url}`);
}

async function run() {
  console.log('--- SponsorFit E2E CDP Automation ---');

  // Verify Vite dev server is running
  console.log(`Checking dev server at ${TARGET_URL}...`);
  await waitForHttp(TARGET_URL);
  console.log('Dev server is online.');

  // Launch Edge in headless debugging mode
  const userDataDir = join(process.env.TEMP || 'C:\\Temp', `edge_cdp_${Date.now()}`);
  console.log(`Launching Edge headless with debugging port ${PORT}...`);
  const edgeProc = spawn(
    EDGE_PATH,
    [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${userDataDir}`,
      '--window-size=1440,900',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  try {
    // Wait for CDP endpoint
    console.log('Waiting for CDP discovery...');
    const versionUrl = `http://127.0.0.1:${PORT}/json/version`;
    await waitForHttp(versionUrl, 30);

    const versionRes = await fetch(versionUrl);
    const versionData = await versionRes.json();
    const wsUrl = versionData.webSocketDebuggerUrl;
    console.log(`Connected to Edge CDP: ${wsUrl}`);

    // Locate page target from /json/list
    console.log('Finding page target from /json/list...');
    let pageTarget = null;
    for (let i = 0; i < 20; i++) {
      const targetsRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const targets = await targetsRes.json();
      pageTarget = targets.find((t) => t.type === 'page');
      if (pageTarget) break;
      await sleep(300);
    }

    if (!pageTarget) {
      throw new Error('No page target found in Edge');
    }

    console.log(`Connecting to page target: ${pageTarget.webSocketDebuggerUrl}`);
    const pageCdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await pageCdp.connect();
    await pageCdp.send('Page.enable');
    await pageCdp.send('Runtime.enable');
    await pageCdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log(`Navigating to ${TARGET_URL}...`);
    await pageCdp.send('Page.navigate', { url: TARGET_URL });
    await sleep(2000);

    // Wait for auto-audit to complete
    console.log('Waiting for audit execution to complete...');
    let ready = false;
    for (let i = 0; i < 30; i++) {
      const hasNav = await pageCdp.evaluate(`Boolean(document.getElementById('results-view-nav'))`);
      if (hasNav) {
        ready = true;
        break;
      }
      await sleep(300);
    }
    if (!ready) {
      throw new Error('Audit did not finish within timeout');
    }
    await sleep(600);

    // SCREENSHOT 1: Input view (expanded form)
    console.log('Expanding input form for Screenshot 1: 01-input.png...');
    await pageCdp.evaluate(`document.getElementById('edit-profile-button')?.click()`);
    await sleep(600);
    console.log('Capturing Screenshot 1: 01-input.png...');
    await pageCdp.screenshot(join(screenshotsDir, '01-input.png'));
    console.log('Saved 01-input.png');

    // Run audit again to collapse input bar
    console.log('Running audit to collapse into compact bar...');
    await pageCdp.evaluate(`document.getElementById('run-audit-button')?.click()`);
    await sleep(1000);

    // SCREENSHOT 2: Agent trace view (02-agent-trace.png)
    console.log('Switching to Agent Trace view...');
    await pageCdp.evaluate(`document.getElementById('tab-trace-btn')?.click()`);
    await sleep(600);
    console.log('Capturing Screenshot 2: 02-agent-trace.png...');
    await pageCdp.screenshot(join(screenshotsDir, '02-agent-trace.png'));
    console.log('Saved 02-agent-trace.png');

    // SCREENSHOT 3: Ranked Sponsors & Fit view (03-results.png)
    console.log('Switching to Ranked Sponsors view...');
    await pageCdp.evaluate(`document.getElementById('tab-sponsors-btn')?.click()`);
    await sleep(600);
    console.log('Capturing Screenshot 3: 03-results.png...');
    await pageCdp.screenshot(join(screenshotsDir, '03-results.png'));
    console.log('Saved 03-results.png');

    // Console capture summary
    console.log('\n=== BROWSER CONSOLE CAPTURE SUMMARY ===');
    console.log(`Total console messages: ${pageCdp.consoleLogs.length}`);
    const errors = pageCdp.consoleLogs.filter((l) => l.type === 'error');
    const warnings = pageCdp.consoleLogs.filter((l) => l.type === 'warn');
    const logs = pageCdp.consoleLogs.filter((l) => l.type === 'log' || l.type === 'info');

    console.log(`Errors: ${errors.length + pageCdp.exceptions.length}`);
    console.log(`Warnings: ${warnings.length}`);
    console.log(`Info/Logs: ${logs.length}`);

    if (errors.length > 0 || pageCdp.exceptions.length > 0) {
      console.error('Console errors detected:');
      for (const err of errors) console.error(`  [${err.type}] ${err.text}`);
      for (const exc of pageCdp.exceptions) console.error(`  [exception] ${exc}`);
      throw new Error(`Browser console contains ${errors.length + pageCdp.exceptions.length} errors!`);
    } else {
      console.log('✓ Zero console errors detected.');
    }

    pageCdp.close();
  } finally {
    edgeProc.kill('SIGTERM');
  }

  console.log('E2E automation completed successfully.');
}

run().catch((err) => {
  console.error('E2E automation error:', err);
  process.exit(1);
});
