import Reveal from "@/components/Reveal";
import { SectionHeading } from "@/components/ui/Primitives";
import { reasons } from "@/lib/content";

function CardVisual({ index }: { index: number }) {
  if (index === 0) {
    // Production-Grade Reliability: Code bracket & keyboard keycaps
    return (
      <div className="relative h-28 w-full overflow-hidden rounded-xl border border-white/[0.07] bg-ink-900/90 p-3">
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.3),transparent_70%)] blur-[20px]" />
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-2 rounded-lg border border-crimson-800/40 bg-crimson-950/30 px-3 py-2 font-mono text-[14px] font-bold text-crimson-400">
            <span>&lt;/&gt;</span>
            <span className="text-[11px] font-normal tracking-wider text-dim">strict.types</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {["ESC", "CMD", "SHIFT", "ALT", "FN", "CTRL"].map((key) => (
              <span
                key={key}
                className="flex h-6 w-7 items-center justify-center rounded border border-white/[0.08] bg-ink-800/90 font-mono text-[7px] text-mute shadow-sm"
              >
                {key}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (index === 1) {
    // Performance First Mindset: Waveform / Frequency Audio Latency Graph
    return (
      <div className="relative h-28 w-full overflow-hidden rounded-xl border border-white/[0.07] bg-ink-900/90 p-3">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-48 rounded-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.25),transparent_70%)] blur-[20px]" />
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-center justify-between font-mono text-[8.5px] uppercase tracking-[0.16em] text-dim">
            <span>Render Budget: 16ms</span>
            <span className="text-crimson-400">60 FPS Locked</span>
          </div>
          <svg viewBox="0 0 240 45" fill="none" className="h-10 w-full">
            <path
              d="M0 22 C 20 22, 35 4, 50 22 C 65 40, 80 8, 100 22 C 120 36, 135 12, 150 22 C 165 32, 180 2, 200 22 C 220 42, 230 22, 240 22"
              stroke="#ef4444"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M0 22 C 25 22, 40 14, 60 22 C 80 30, 95 16, 120 22 C 145 28, 160 18, 180 22 C 200 26, 220 20, 240 22"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
              strokeDasharray="2 3"
            />
          </svg>
          <div className="flex justify-between font-mono text-[7.5px] text-dim">
            <span>0ms (TBT)</span>
            <span>0.4s (FCP)</span>
            <span>0.8s (LCP)</span>
          </div>
        </div>
      </div>
    );
  }

  if (index === 2) {
    // Scalable Cloud Architecture: Server & API Mesh Diagram
    return (
      <div className="relative h-28 w-full overflow-hidden rounded-xl border border-white/[0.07] bg-ink-900/90 p-3">
        <div className="pointer-events-none absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.25),transparent_70%)] blur-[20px]" />
        <div className="flex h-full items-center justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            {["Next.js SSR", "FastAPI / Node", "Django ORM"].map((s, i) => (
              <div
                key={s}
                className="flex items-center gap-1.5 rounded border border-white/[0.06] bg-ink-800/80 px-2 py-1 font-mono text-[8px] text-mute"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    i === 0 ? "bg-crimson-500" : "bg-white/20"
                  }`}
                />
                {s}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center">
            <span className="font-mono text-[8px] text-dim">Load Balancer</span>
            <div className="my-1 h-8 w-px bg-gradient-to-b from-crimson-600 to-transparent" />
            <span className="h-2 w-2 rounded-full bg-crimson-600 animate-ping" />
          </div>
          <div className="flex flex-col gap-1.5">
            {["PostgreSQL (ACID)", "Redis Cache", "S3 Storage"].map((d, i) => (
              <div
                key={d}
                className="flex items-center gap-1.5 rounded border border-white/[0.06] bg-ink-800/80 px-2 py-1 font-mono text-[8px] text-dim"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    i === 0 ? "bg-emerald-400" : "bg-white/10"
                  }`}
                />
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Business-Driven Decisions: Glowing Red 3D Wireframe Globe
  return (
    <div className="relative h-28 w-full overflow-hidden rounded-xl border border-white/[0.07] bg-ink-900/90 p-3">
      <div className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 h-24 w-24 rounded-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.4),transparent_70%)] blur-[22px]" />
      <div className="flex h-full items-center justify-between">
        <div className="max-w-[120px] font-mono text-[8.5px] uppercase tracking-[0.14em] text-dim">
          <div>Outcome Focus</div>
          <div className="mt-1 text-[11px] font-semibold text-white">ROI &gt; Code Volume</div>
        </div>
        <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0" fill="none">
          <circle cx="40" cy="40" r="32" stroke="#b91c1c" strokeWidth="1" strokeOpacity="0.5" />
          <ellipse cx="40" cy="40" rx="32" ry="12" stroke="#dc2626" strokeWidth="1" strokeOpacity="0.7" />
          <ellipse cx="40" cy="40" rx="14" ry="32" stroke="#b91c1c" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="8" y1="40" x2="72" y2="40" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.6" />
          <line x1="40" y1="8" x2="40" y2="72" stroke="#b91c1c" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="2 2" />
          <circle cx="56" cy="34" r="2.5" fill="#ffffff" />
          <circle cx="28" cy="46" r="2" fill="#ef4444" />
        </svg>
      </div>
    </div>
  );
}

export default function WhyWorkWithMe() {
  return (
    <section id="why" className="relative scroll-mt-24 py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
      />

      <div className="shell">
        <Reveal>
          <SectionHeading
            index="02"
            label="PARTNERSHIP STANDARDS"
            title="Why Work With Me"
            accent="Today And Always?"
            description="Four foundational principles guiding every engagement — from initial requirements discovery to production deployment."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
          {reasons.map((reason, index) => (
            <Reveal
              key={reason.number}
              delay={index * 90}
              className="group relative h-full"
            >
              <article className="card card-hover card-leak relative flex h-full flex-col justify-between overflow-hidden p-6 sm:p-7">
                <span className="pointer-events-none absolute -right-2 -top-6 select-none font-mono text-[84px] font-bold leading-none tracking-tighter text-white/[0.03] transition-all duration-700 group-hover:text-crimson-900/25 sm:text-[96px]">
                  {reason.number}
                </span>

                <div className="pointer-events-none absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-crimson-700 via-crimson-600 to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100" />

                {/* Top: Bespoke Visual Diagram for Each Pillar */}
                <div className="relative mb-6">
                  <CardVisual index={index} />
                </div>

                <div className="relative">
                  <div className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.2em] text-crimson-500">
                    <span>{reason.number}</span>
                    <span>//</span>
                    <span>{reason.label}</span>
                  </div>
                  <h3 className="mt-2 text-[19px] font-semibold leading-tight tracking-[-0.03em] text-white sm:text-[21px]">
                    {reason.title}
                  </h3>
                  <p className="mt-3 max-w-[40ch] text-[13.5px] leading-relaxed text-mute">
                    {reason.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}