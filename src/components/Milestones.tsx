import Reveal from "@/components/Reveal";
import { SectionHeading } from "@/components/ui/Primitives";
import { milestones } from "@/lib/content";

export default function Milestones() {
  return (
    <section id="milestones" className="relative scroll-mt-24 py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[min(34rem,100vw)] w-[min(34rem,100vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(127,29,29,0.16),transparent_68%)] blur-[70px]"
      />

      <div className="shell">
        <Reveal>
          <SectionHeading
            index="03"
            label="Milestones & impact"
            title="Professional Milestones"
            accent="& Impact"
            description="A factual snapshot of where the practice stands today and the range it covers."
          />
        </Reveal>

        <div className="relative mt-16">
          <div
            aria-hidden="true"
            className="absolute left-[7px] top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-crimson-700/70 via-crimson-900/40 to-transparent lg:left-0 lg:top-[9px] lg:h-px lg:w-full lg:bg-gradient-to-r lg:from-transparent lg:via-crimson-800/40 lg:to-transparent"
          />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-6">
            {milestones.map((item, index) => (
              <Reveal key={item.number} delay={index * 100} className="relative">
                <div className="flex gap-5 lg:block">
                  <div className="relative shrink-0">
                    <span className="relative z-10 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-crimson-800/70 bg-ink-950">
                      <span className="h-1.5 w-1.5 rounded-full bg-crimson-600 shadow-[0_0_10px_2px_rgba(185,28,28,0.6)]" />
                    </span>
                    <span className="absolute left-1/2 top-[22px] h-[calc(100%-22px)] w-px -translate-x-1/2 bg-gradient-to-b from-crimson-900/40 to-transparent lg:hidden" />
                  </div>

                  <div className="lg:mt-8">
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-dim">
                        {item.number}
                      </span>
                      <span className="h-px w-6 bg-crimson-800/50" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-crimson-600">
                        {item.label}
                      </span>
                    </div>

                    <div className="mt-3 text-[clamp(2rem,3.4vw,2.7rem)] font-semibold leading-none tracking-[-0.045em] text-white">
                      {item.value}
                    </div>

                    <p className="mt-4 max-w-[26ch] text-[13.5px] leading-relaxed text-mute">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}