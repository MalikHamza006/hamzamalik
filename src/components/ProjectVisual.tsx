import type { ProjectVisualVariant } from "@/lib/content";

function Frame({
  label,
  children,
  tall = false,
}: {
  label: string;
  children: React.ReactNode;
  tall?: boolean;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-white/[0.08] bg-ink-900 shadow-2xl ${
        tall
          ? "aspect-auto min-h-[250px] sm:aspect-[16/11]"
          : "aspect-auto min-h-[230px] sm:aspect-[16/10]"
      }`}
    >
      {/* Ambient Red Glow in Card Header */}
      <div className="pointer-events-none absolute -top-12 left-1/2 -z-0 h-32 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(185,28,28,0.28),transparent_70%)] blur-[28px]" />
      <div className="pointer-events-none absolute inset-0 grid-lines-fine opacity-25" />

      {/* Top Application Window Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/[0.07] bg-ink-850/80 px-3.5 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-crimson-600/90" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">
          {label}
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
      </div>

      <div className="relative z-10 h-auto sm:h-[calc(100%-35px)] p-3 sm:p-4">{children}</div>
    </div>
  );
}

function Intelligence({ tall = false }: { tall?: boolean }) {
  return (
    <Frame label="intelligence / signal-engine" tall={tall}>
      <div className="flex h-full flex-col justify-between gap-3">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {[
            { label: "PROCESSED", value: "142,800", sub: "+18.4% signal", color: "text-white" },
            { label: "MODEL LATENCY", value: "84ms", sub: "p99 benchmark", color: "text-crimson-400" },
            { label: "CONFIDENCE", value: "99.4%", sub: "evaluated", color: "text-emerald-400" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-white/[0.07] bg-ink-800/80 p-2 sm:p-2.5"
            >
              <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-dim">
                {item.label}
              </div>
              <div className={`mt-1 font-mono text-[13px] font-semibold sm:text-[15px] ${item.color}`}>
                {item.value}
              </div>
              <div className="mt-0.5 text-[8.5px] text-dim">{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Real-time Telemetry Graph & Pipeline Output */}
        <div className="grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col justify-between rounded-lg border border-white/[0.07] bg-ink-800/60 p-2.5 sm:p-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-dim">
                Telemetry Waveform
              </span>
              <span className="font-mono text-[8px] text-crimson-500">● LIVE RUNTIME</span>
            </div>
            <svg viewBox="0 0 240 70" fill="none" className="mt-1 h-full w-full">
              <defs>
                <linearGradient id="intelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b91c1c" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path
                d="M0 55 Q 30 35, 60 48 T 120 22 T 180 34 T 240 10 L 240 70 L 0 70 Z"
                fill="url(#intelGrad)"
              />
              <path
                d="M0 55 Q 30 35, 60 48 T 120 22 T 180 34 T 240 10"
                stroke="#dc2626"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="240" cy="10" r="3.5" fill="#ef4444" />
              <circle cx="240" cy="10" r="7" stroke="#b91c1c" strokeOpacity="0.4" />
            </svg>
          </div>

          <div className="hidden flex-col justify-between rounded-lg border border-white/[0.07] bg-ink-800/60 p-2.5 sm:flex sm:p-3">
            <div className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-dim">
              Evaluations
            </div>
            <div className="space-y-1.5">
              {[
                { k: "Schema Audit", s: "PASS", c: "text-emerald-400" },
                { k: "Token Efficiency", s: "98.2%", c: "text-white" },
                { k: "Hallucination Check", s: "0.00%", c: "text-crimson-400" },
              ].map((row) => (
                <div key={row.k} className="flex items-center justify-between text-[9.5px]">
                  <span className="text-dim">{row.k}</span>
                  <span className={`font-mono font-medium ${row.c}`}>{row.s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function Operations() {
  return (
    <Frame label="operations / orchestrator">
      <div className="flex h-full flex-col justify-between gap-2.5">
        <div className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-ink-800/60 p-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-crimson-600" />
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white">
              Cluster: us-east-01
            </span>
          </div>
          <span className="font-mono text-[8.5px] text-dim">Active Workers: 16</span>
        </div>

        <div className="flex-1 overflow-hidden rounded-lg border border-white/[0.07] bg-ink-800/80">
          <div className="grid grid-cols-4 border-b border-white/[0.06] bg-ink-850 px-2 sm:px-3 py-1.5 font-mono text-[7px] min-[360px]:text-[8px] uppercase tracking-normal sm:tracking-[0.16em] text-dim">
            <span>SERVICE</span>
            <span>STATUS</span>
            <span>THROUGHPUT</span>
            <span className="text-right">LOAD</span>
          </div>
          {[
            { s: "Auth / RBAC", st: "ACTIVE", th: "2,400 rps", l: "12%", ok: true },
            { s: "Sync Gateway", st: "ACTIVE", th: "8,950 rps", l: "41%", ok: true },
            { s: "Audit Log Store", st: "COMMITTED", th: "1,200 rps", l: "18%", ok: true },
          ].map((row) => (
            <div
              key={row.s}
              className="grid grid-cols-4 items-center border-b border-white/[0.04] px-2 sm:px-3 py-1.5 sm:py-2 text-[9px] min-[360px]:text-[10px] last:border-0"
            >
              <span className="font-medium text-white">{row.s}</span>
              <span className="font-mono text-[8.5px] text-emerald-400">{row.st}</span>
              <span className="font-mono text-[9px] text-dim">{row.th}</span>
              <span className="font-mono text-right text-crimson-400">{row.l}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function Automation() {
  return (
    <Frame label="automation / llm-pipeline">
      <div className="flex h-full flex-col justify-between gap-2.5">
        <div className="grid grid-cols-4 gap-1.5">
          {["Trigger", "Parse", "Prompt", "Commit"].map((step, idx) => (
            <div
              key={step}
              className={`rounded-md border p-2 text-center ${
                idx === 2
                  ? "border-crimson-800/60 bg-crimson-950/40 text-crimson-400"
                  : "border-white/[0.07] bg-ink-800/70 text-dim"
              }`}
            >
              <div className="font-mono text-[8px] uppercase tracking-[0.14em]">
                0{idx + 1}
              </div>
              <div className="mt-1 text-[10px] font-medium text-white">{step}</div>
            </div>
          ))}
        </div>

        <div className="flex-1 rounded-lg border border-white/[0.06] bg-ink-800/60 p-3 font-mono text-[9px] leading-relaxed text-[#c4c4c4]">
          <div className="text-crimson-500">// structured execution schema</div>
          <div className="mt-1 text-dim">&gt; validating JSON payload integrity...</div>
          <div className="text-white">&gt; deterministic temperature: 0.1 · prompt: validated</div>
          <div className="text-emerald-400">&gt; state: automated dispatch completed (46ms)</div>
        </div>
      </div>
    </Frame>
  );
}

function Platform() {
  return (
    <Frame label="platform / system-architecture">
      <div className="flex h-full flex-col justify-between gap-2.5">
        <div className="grid grid-cols-3 gap-2">
          {[
            { l: "Frontend Core", v: "Next.js 16" },
            { l: "Type Safety", v: "Strict TS" },
            { l: "Data Layer", v: "PostgreSQL" },
          ].map((t) => (
            <div
              key={t.l}
              className="rounded-lg border border-white/[0.06] bg-ink-800/70 p-2 text-center"
            >
              <div className="font-mono text-[8px] uppercase text-dim">{t.l}</div>
              <div className="mt-1 text-[11px] font-medium text-white">{t.v}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-around rounded-lg border border-white/[0.07] bg-ink-800/50 p-2">
          <div className="text-center font-mono text-[9px] text-mute">
            <div className="text-crimson-500">CLIENT</div>
            <div className="mt-1 text-[8px] text-dim">React SPA</div>
          </div>
          <span className="font-mono text-crimson-700">──►</span>
          <div className="text-center font-mono text-[9px] text-mute">
            <div className="text-white">API GATEWAY</div>
            <div className="mt-1 text-[8px] text-dim">Node / REST</div>
          </div>
          <span className="font-mono text-crimson-700">──►</span>
          <div className="text-center font-mono text-[9px] text-mute">
            <div className="text-crimson-500">DATABASE</div>
            <div className="mt-1 text-[8px] text-dim">ACID Pools</div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function Analytics() {
  return (
    <Frame label="analytics / high-density-ui">
      <div className="grid h-full grid-cols-2 gap-2">
        <div className="flex flex-col justify-between rounded-lg border border-white/[0.07] bg-ink-800/80 p-2.5">
          <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-dim">
            Daily Volume
          </div>
          <div className="font-mono text-[16px] font-semibold text-white">$428,950</div>
          <div className="flex h-10 items-end gap-1">
            {[35, 60, 45, 80, 65, 95, 85, 100].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-t-sm"
                style={{
                  height: `${h}%`,
                  backgroundColor: i === 7 ? "#dc2626" : "rgba(255,255,255,0.16)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-lg border border-white/[0.07] bg-ink-800/80 p-2.5">
          <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-dim">
            Query Performance
          </div>
          <div className="font-mono text-[16px] font-semibold text-crimson-400">14.2ms</div>
          <div className="space-y-1 font-mono text-[8.5px] text-dim">
            <div className="flex justify-between">
              <span>Cache Hit:</span>
              <span className="text-white">99.1%</span>
            </div>
            <div className="flex justify-between">
              <span>Index Scan:</span>
              <span className="text-white">Optimal</span>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function Web() {
  return (
    <Frame label="web / presence-architecture">
      <div className="flex h-full flex-col justify-between gap-2.5">
        <div className="rounded-lg border border-white/[0.07] bg-gradient-to-r from-ink-800 to-ink-850 p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-white">
              Lighthouse Performance
            </span>
            <span className="font-mono text-[11px] font-bold text-emerald-400">100/100</span>
          </div>
          <div className="mt-2.5 grid grid-cols-4 gap-1.5 font-mono text-[8px] text-dim">
            <div>FCP: 0.4s</div>
            <div>LCP: 0.7s</div>
            <div>CLS: 0.00</div>
            <div className="text-emerald-400">SEO: 100</div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-ink-800/60 px-3 py-2 font-mono text-[9px] text-mute">
          <span>Static Generation (SSG) + Edge Delivery</span>
          <span className="text-crimson-500">READY</span>
        </div>
      </div>
    </Frame>
  );
}

export default function ProjectVisual({
  variant,
  tall = false,
}: {
  variant: ProjectVisualVariant;
  tall?: boolean;
}) {
  switch (variant) {
    case "intelligence":
      return <Intelligence tall={tall} />;
    case "operations":
      return <Operations />;
    case "automation":
      return <Automation />;
    case "platform":
      return <Platform />;
    case "analytics":
      return <Analytics />;
    case "web":
      return <Web />;
    default:
      return <Frame label="module">null</Frame>;
  }
}