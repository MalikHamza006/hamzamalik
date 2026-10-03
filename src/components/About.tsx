import Image from "next/image";
import Reveal from "@/components/Reveal";
import { profile } from "@/lib/content";

const profileStats = [
  { k: "Discipline", v: "Software Engineering" },
  { k: "Core Focus", v: "Full-Stack & Applied AI" },
  { k: "Experience", v: "1 Year Practical Delivery" },
  { k: "Primary Stack", v: "React · Next.js · Django · Laravel" },
  { k: "Availability", v: "Direct Engagement & Contracts" },
];

export default function About() {
  return (
    <section id="about" className="relative scroll-mt-24 overflow-hidden py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/3 top-1/2 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.22),transparent_70%)] blur-[75px]"
      />

      <div className="shell">
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Direct Clean Editorial Portrait (No Border Box, Extended Length Matching Text) */}
          <div className="order-2 flex flex-col justify-end lg:order-1 lg:col-span-5">
            <Reveal variant="up" className="h-full">
              <div className="relative mx-auto flex h-full min-h-[300px] w-full max-w-[340px] flex-col justify-end sm:min-h-[520px] sm:max-w-[460px] lg:min-h-[680px] xl:max-w-[480px] xl:min-h-[720px]">
                <div className="relative h-full min-h-[300px] w-full overflow-hidden sm:min-h-[520px] lg:min-h-[680px] xl:min-h-[720px]">
                  <Image
                    src="/hamza2.png"
                    alt={`${profile.name} — Software Engineer & AI Engineer`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-contain object-bottom filter brightness-[0.98] contrast-[1.02]"
                    priority
                  />

                  {/* Gradient Fade to Bottom */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Narrative & Technical Positioning */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <Reveal delay={100}>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-crimson-600" />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-crimson-500">
                  03 / ABOUT
                </span>
              </div>

              <h2 className="mt-4 text-[clamp(2.2rem,4.4vw,3.2rem)] font-bold leading-[1.05] tracking-[-0.035em] text-white">
                Engineering products that are{" "}
                <span className="text-crimson-gradient">useful, scalable,</span> and
                thoughtfully built.
              </h2>

              <div className="mt-6 max-w-[58ch] space-y-4 text-[15px] leading-[1.8] text-mute">
                <p>
                  I&apos;m {profile.name}, a Software Engineer focused on full-stack web development and practical AI systems.
                </p>
                <p>
                  I build modern digital products across frontend, backend, and AI workflows, with an emphasis on maintainable architecture, thoughtful interfaces, and solutions that solve real operational problems.
                </p>
                <p>
                  My engineering practice spans React, Next.js, Django, Laravel, Node.js, and TypeScript. In parallel, I treat prompt engineering and AI integration as disciplined backend tools designed to automate repetitive business processes and extract signal from unstructured data.
                </p>
              </div>

              {/* Dossier Stats */}
              <div className="mt-7 grid grid-cols-1 gap-2.5 border-y border-white/[0.07] py-4 sm:grid-cols-2">
                {profileStats.slice(0, 4).map((fact) => (
                  <div key={fact.k} className="flex items-center justify-between gap-3 font-mono text-[11px]">
                    <span className="text-dim uppercase tracking-[0.14em]">{fact.k}:</span>
                    <span className="text-white font-medium">{fact.v}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
                <a
                  href="#contact"
                  className="btn btn-primary w-full sm:w-auto !min-h-[46px]"
                >
                  Start a Conversation
                </a>
                <a
                  href={profile.phoneHref}
                  className="btn btn-ghost w-full sm:w-auto !min-h-[46px]"
                >
                  Direct Call: {profile.phone}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}