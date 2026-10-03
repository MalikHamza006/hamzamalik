const { spawn } = require('child_process');
const http = require('http');

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9240;

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

async function run() {
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

    await wait(2500);

    const viewports = [
      { w: 360, h: 800, name: '360x800' },
      { w: 375, h: 812, name: '375x812' },
      { w: 390, h: 844, name: '390x844' },
      { w: 393, h: 852, name: '393x852' },
      { w: 1440, h: 900, name: '1440x900' }
    ];

    const results = {};

    for (const vp of viewports) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.w < 1000
      });

      await wait(800);

      const metrics = await cdp.eval(`(() => {
        const toggleBtn = document.querySelector('button[aria-label*="menu" i]');
        const chatBtn = document.querySelector('button[aria-label*="Hamza" i], button[aria-label*="AI" i]');
        const h1 = document.querySelector('h1');

        let toggleVis = false;
        if (toggleBtn) {
          const r = toggleBtn.getBoundingClientRect();
          const s = window.getComputedStyle(toggleBtn);
          toggleVis = r.width > 0 && r.height > 0 && r.right <= window.innerWidth && r.left >= 0 && s.display !== 'none' && s.visibility !== 'hidden';
        }

        let chatVis = false;
        if (chatBtn) {
          const r = chatBtn.getBoundingClientRect();
          const s = window.getComputedStyle(chatBtn);
          chatVis = r.width > 0 && r.height > 0 && r.right <= window.innerWidth && r.bottom <= window.innerHeight && s.display !== 'none' && s.visibility !== 'hidden';
        }

        return {
          windowInnerWidth: window.innerWidth,
          docScrollWidth: document.documentElement.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
          isMobileNavToggleVisible: toggleVis,
          isChatbotVisible: chatVis,
          heroHeadingFits: h1 ? (h1.getBoundingClientRect().right <= window.innerWidth + 1) : false
        };
      })()`);

      results[vp.name] = metrics;
    }

    // Now test interaction at 393x852
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 393,
      height: 852,
      deviceScaleFactor: 1,
      mobile: true
    });
    await wait(500);

    // 1. Click Hamburger
    const menuClickResult = await cdp.eval(`(() => {
      const toggleBtn = document.querySelector('button[aria-label*="menu" i]');
      if (!toggleBtn) return { error: 'No menu toggle button found' };
      toggleBtn.click();
      return { clicked: true };
    })()`);

    await wait(600);

    const menuOpenResult = await cdp.eval(`(() => {
      const drawer = document.getElementById('mobile-menu');
      const s = drawer ? window.getComputedStyle(drawer) : null;
      const links = drawer ? Array.from(drawer.querySelectorAll('a')).map(a => a.textContent.trim()) : [];
      return {
        drawerExists: !!drawer,
        drawerVisible: s ? (s.visibility !== 'hidden' && s.display !== 'none') : false,
        linksCount: links.length,
        links: links.slice(0, 5),
        hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth
      };
    })()`);

    // Close menu
    await cdp.eval(`(() => {
      const toggleBtn = document.querySelector('button[aria-label*="menu" i]');
      if (toggleBtn) toggleBtn.click();
    })()`);
    await wait(500);

    // 2. Click Chatbot
    const chatbotClickResult = await cdp.eval(`(() => {
      const chatBtn = document.querySelector('button[aria-label*="Hamza" i], button[aria-label*="AI" i]');
      if (!chatBtn) return { error: 'No chatbot launcher button found' };
      chatBtn.click();
      return { clicked: true };
    })()`);

    await wait(800);

    const chatbotOpenResult = await cdp.eval(`(() => {
      const dialog = document.querySelector('[role="dialog"]') || document.querySelector('[aria-label="Hamza AI Assistant"]');
      const input = document.querySelector('input[placeholder*="Ask" i], textarea[placeholder*="Ask" i], input[type="text"]');
      return {
        dialogOpened: !!dialog,
        inputAvailable: !!input,
        docScrollWidth: document.documentElement.scrollWidth,
        hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth
      };
    })()`);

    console.log('=== MULTI-VIEWPORT VERIFICATION RESULTS ===');
    console.log(JSON.stringify(results, null, 2));
    console.log('=== MOBILE MENU INTERACTION (393px) ===');
    console.log(JSON.stringify({ click: menuClickResult, state: menuOpenResult }, null, 2));
    console.log('=== CHATBOT INTERACTION (393px) ===');
    console.log(JSON.stringify({ click: chatbotClickResult, state: chatbotOpenResult }, null, 2));

  } finally {
    edge.kill();
  }
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
