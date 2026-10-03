import { spawn } from "child_process";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function main() {
  const edge = spawn(edgePath, [
    "--headless=new",
    "--remote-debugging-port=9222",
    "--window-size=393,852",
    "--disable-gpu",
    "http://localhost:3000",
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch("http://localhost:9222/json");
    const tabs = await listRes.json();
    const tab = tabs.find((t) => t.url.includes("localhost:3000")) || tabs[0];

    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let id = 1;
    const send = (method, params = {}) =>
      new Promise((resolve) => {
        const msgId = id++;
        const handler = (evt) => {
          const data = JSON.parse(evt.data);
          if (data.id === msgId) {
            ws.removeEventListener("message", handler);
            resolve(data);
          }
        };
        ws.addEventListener("message", handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });

    await new Promise((r) => (ws.onopen = r));

    await send("Emulation.setDeviceMetricsOverride", {
      width: 393,
      height: 852,
      deviceScaleFactor: 3,
      mobile: true,
    });

    await send("Page.navigate", { url: "http://localhost:3000" });
    await new Promise((r) => setTimeout(r, 2500));

    const res = await send("Runtime.evaluate", {
      expression: `(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const navToggle = document.querySelector('button[aria-controls="mobile-menu"]');
        const navRect = navToggle ? navToggle.getBoundingClientRect() : null;

        const chatbot = document.querySelector('button[aria-label*="HM AI"], button[aria-label*="Hamza"]');
        const chatRect = chatbot ? chatbot.getBoundingClientRect() : null;

        return {
          vw,
          vh,
          docW: document.documentElement.scrollWidth,
          bodyW: document.body.scrollWidth,
          navToggle: navRect ? { x: Math.round(navRect.x), y: Math.round(navRect.y), right: Math.round(navRect.right), width: Math.round(navRect.width), height: Math.round(navRect.height) } : 'NOT FOUND',
          chatbot: chatRect ? { x: Math.round(chatRect.x), y: Math.round(chatRect.y), right: Math.round(chatRect.right), bottom: Math.round(chatRect.bottom), width: Math.round(chatRect.width), height: Math.round(chatRect.height) } : 'NOT FOUND',
        };
      })()`,
      returnByValue: true,
    });

    console.log("DIAGNOSTIC RESULT:", JSON.stringify(res.result?.result?.value ?? res, null, 2));

    const shot = await send("Page.captureScreenshot", { format: "png" });
    import("fs").then(fs => fs.writeFileSync("scratch/mobile_393_verified.png", Buffer.from(shot.result.data, "base64")));
    console.log("Screenshot saved to scratch/mobile_393_verified.png");

    ws.close();
  } catch (err) {
    console.error("Error:", err);
  } finally {
    edge.kill();
  }
}

main();
