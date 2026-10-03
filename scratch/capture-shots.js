const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9236;

function getJson(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${PORT}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

class CdpConnection {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    const WebSocket = global.WebSocket || require('ws');
    this.ws = new WebSocket(this.wsUrl);
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(msg.error);
          else cb.resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }
}

async function main() {
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:3000'
  ], { stdio: 'ignore' });

  try {
    for (let i = 0; i < 30; i++) {
      await wait(400);
      try {
        await getJson('/json/version');
        break;
      } catch {}
    }

    const pages = await getJson('/json/list');
    const targetPage = pages.find(p => p.url.includes('localhost:3000')) || pages[0];
    const cdp = new CdpConnection(targetPage.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await cdp.send('Page.reload');
    await wait(4000);

    const sections = ['top', 'projects', 'expertise', 'about', 'experience', 'ai-systems', 'contact'];

    for (const sec of sections) {
      await cdp.eval(`
        {
          const el = document.getElementById('${sec}');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      `);
      await wait(500);

      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`screenshot_${sec}.png`, Buffer.from(shot.data, 'base64'));
      console.log(`Saved screenshot_${sec}.png`);
    }

  } finally {
    edge.kill();
  }
}

main().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
