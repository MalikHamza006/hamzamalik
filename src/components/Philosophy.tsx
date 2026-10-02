import Reveal from "@/components/Reveal";
import { CornerBrackets, SectionLabel } from "@/components/ui/Primitives";

export default function Philosophy() {
  return (
    <section id="philosophy" className="relative scroll-mt-24 py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[36rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(185,28,28,0.22),transparent_70%)] blur-[80px]"
      />

      <div className="shell">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <SectionLabel index="04">THE ENGINEER BEHIND THE CODE</SectionLabel>

            <h2 className="mt-4 text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-white">
              A commitment to <span className="text-crimson-gradient">engineering philosophy.</span>
            </h2>

            <p className="mx-auto mt-4 max-w-[56ch] text-[15px] leading-relaxed text-mute">
              Software is not merely syntax written to satisfy a specification. It is the architectural discipline of building systems that endure change, respect users, and solve real business problems.
            </p>
          </Reveal>
        </div>

        {/* Cinematic Film / Showcase Container */}
        <Reveal variant="clip" delay={120} className="mt-12">
          <div className="group relative mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-b from-ink-800 via-ink-850 to-ink-950 shadow-[0_30px_100px_-40px_rgba(0,0,0,0.9)]">
            <CornerBrackets />

            {/* Video-Style Header Bar */}
            <div className="flex items-center justify-between border-b border-white/[0.07] bg-ink-900/80 px-4 py-2.5 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-crimson-600" />
                <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-mute">
                  ENGINEERING MANIFESTO // 4K REEL
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-dim">
                REC ● 24 FPS
              </span>
            </div>

            {/* Wide Aspect Studio Showcase Frame */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink-950 sm:aspect-[21/9]">
              <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />

              {/* Atmospheric Red Glow & Gradient Overlay */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(185,28,28,0.32),rgba(11,11,11,0.85)_75%)]" />

              {/* Central Architectural Wireframe & Play Trigger Aesthetic */}
              <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
                <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-white/20 bg-ink-900/80 text-white shadow-[0_0_30px_rgba(185,28,28,0.4)] transition-transform duration-500 group-hover:scale-105">
                  <span className="absolute inset-0 rounded-full border border-crimson-600/50 animate-ping opacity-30" />
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="ml-1 h-6 w-6 sm:h-7 sm:w-7 text-crimson-500"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                  Interactive Philosophy Walkthrough
                </div>

                <div className="mt-2 text-[clamp(1.2rem,2.8vw,1.8rem)] font-semibold tracking-tight text-white">
                  &ldquo;Build with purpose. Design for people. Engineer for scale.&rdquo;
                </div>
              </div>

              {/* Bottom Scrubber Timeline Simulation */}
              <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between border-t border-white/[0.07] bg-ink-900/90 px-4 py-2 font-mono text-[9px] text-dim">
                <div className="flex items-center gap-3">
                  <span className="text-crimson-500">01:48</span>
                  <div className="h-1 w-32 sm:w-64 rounded-full bg-white/10">
                    <div className="h-full w-2/3 rounded-full bg-crimson-600" />
                  </div>
                  <span>02:30</span>
                </div>
                <div className="hidden sm:block text-mute">
                  ARCHITECTURE / DISCIPLINE / SCALE
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 3 Core Philosophical Pillars */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              num: "01",
              title: "Build With Purpose",
              desc: "Every line of code, database query, and interface component must solve a genuine problem. Code is an asset only when it works, and a liability when it is needlessly bloated.",
            },
            {
              num: "02",
              title: "Design For People",
              desc: "Engineering and UX are inseparable. Sub-100ms response times, accessible contrast, responsive fluidity, and predictable states reflect respect for the human on the other side of the glass.",
            },
            {
              num: "03",
              title: "Engineer For Scale",
              desc: "Maintainability is non-negotiable. Decoupled services, strictly typed domain models, and transparent error boundaries ensure systems evolve gracefully without fragile rewrites.",
            },
          ].map((pillar, idx) => (
            <Reveal key={pillar.num} delay={idx * 80}>
              <div className="card card-hover p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-crimson-500">
                    <span>{pillar.num}</span>
                    <span>PRINCIPLE</span>
                  </div>
                  <h3 className="mt-3 text-[18px] font-semibold text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-mute">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}