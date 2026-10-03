const { spawn } = require('child_process');
const http = require('http');

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9235;

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
      deviceScaleFactor: 1,
      mobile: true,
    });
    await cdp.send('Page.reload');
    await wait(4000);

    const wideElements = await cdp.eval(`
      (() => {
        const threshold = 390;
        const all = Array.from(document.querySelectorAll('*'));
        const wide = [];

        for (const el of all) {
          const rect = el.getBoundingClientRect();
          const scrollW = el.scrollWidth;
          const offsetW = el.offsetWidth;

          if (scrollW > threshold + 2 || offsetW > threshold + 2 || rect.width > threshold + 2) {
            wide.push({
              tag: el.tagName,
              id: el.id,
              className: (el.className || '').toString().slice(0, 80),
              rectWidth: Math.round(rect.width),
              rectRight: Math.round(rect.right),
              offsetWidth: offsetW,
              scrollWidth: scrollW,
              parentTag: el.parentElement?.tagName,
              parentId: el.parentElement?.id,
            });
          }
        }
        return {
          totalWideElements: wide.length,
          topLevelWide: wide.filter(w => ['SECTION', 'MAIN', 'DIV', 'HEADER', 'FOOTER', 'NAV', 'ARTICLE'].includes(w.tag)).slice(0, 25)
        };
      })()
    `);

    console.log("Wide elements report:", JSON.stringify(wideElements, null, 2));

  } finally {
    edge.kill();
  }
}

main().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
