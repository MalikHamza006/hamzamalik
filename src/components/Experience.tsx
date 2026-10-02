import Reveal from "@/components/Reveal";
import { milestones } from "@/lib/content";

const timelineItems = [
  {
    number: "01",
    role: "Full-Stack & AI Software Engineer",
    period: "2024 — Present",
    domain: "Engineering Practice",
    description:
      "Architecting production web platforms and applied AI systems. Designing type-safe React & Next.js client layers, decoupled Django & Node.js backend services, and deterministic prompt evaluation pipelines.",
    technologies: [
      "Next.js",
      "React",
      "Django",
      "Node.js",
      "TypeScript",
      "Prompt Engineering",
    ],
    deliverables: [
      "Engineered real-time data visualization consoles with sub-100ms render budgets.",
      "Developed structured JSON schema extraction workflows for automated operational reporting.",
      "Implemented relational schemas, indexing strategies, and secure session management.",
    ],
  },
  {
    number: "02",
    role: "Full-Stack Developer",
    period: "2023 — 2024",
    domain: "Web & Product Engineering",
    description:
      "Delivered responsive web applications, relational databases, and RESTful API integrations. Focused on robust CRUD workflows, client state management, and cross-browser accessibility.",
    technologies: [
      "Laravel",
      "MySQL",
      "React",
      "JavaScript",
      "Tailwind CSS",
      "Bootstrap",
    ],
    deliverables: [
      "Built multi-tier business web portals with role-based access control and transactional integrity.",
      "Optimized frontend asset bundles and responsive viewport behaviors across devices.",
      "Created reusable UI component libraries strictly aligned with brand tokens.",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative scroll-mt-24 py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
      />

      <div className="shell">
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-crimson-600" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-crimson-500">
                04 / EXPERIENCE
              </span>
            </div>
            <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-bold tracking-[-0.035em] text-white">
              Professional Experience
            </h2>
            <p className="mt-3 max-w-[54ch] text-[15px] leading-relaxed text-mute">
              A factual track record of software engineering delivery across frontend architecture, backend services, and practical AI systems.
            </p>
          </div>
        </Reveal>

        {/* Milestone Fast-Facts Snapshot */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {milestones.map((item, idx) => (
            <Reveal key={item.number} delay={idx * 60}>
              <div className="card p-4 sm:p-5">
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-dim">
                  <span>{item.number}</span>
                  <span className="text-crimson-500">{item.label}</span>
                </div>
                <div className="mt-2 font-mono text-[26px] font-bold text-white sm:text-[32px]">
                  {item.value}
                </div>
                <div className="mt-1 text-[12px] text-mute">{item.description}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Architectural Timeline with Thin Vertical Crimson Line */}
        <div className="relative mt-16 pl-6 sm:pl-10">
          {/* Thin Vertical Crimson Architectural Line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 left-2.5 top-2 w-[1.5px] bg-gradient-to-b from-crimson-600 via-crimson-800 to-transparent sm:left-4"
          />

          <div className="space-y-12">
            {timelineItems.map((item, index) => (
              <Reveal key={item.number} delay={index * 100}>
                <div className="relative">
                  {/* Timeline Node Dot */}
                  <span className="absolute -left-[27px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-crimson-600 bg-ink-950 sm:-left-[39px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-crimson-500 shadow-[0_0_8px_1px_rgba(220,38,38,0.8)]" />
                  </span>

                  <article className="card card-hover card-leak overflow-hidden p-6 sm:p-8">
                    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-white/[0.06] pb-4">
                      <div>
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-crimson-500">
                          <span>{item.number}</span>
                          <span>//</span>
                          <span>{item.domain}</span>
                        </div>
                        <h3 className="mt-1.5 text-[21px] font-bold text-white tracking-[-0.02em] sm:text-[23px]">
                          {item.role}
                        </h3>
                      </div>
                      <span className="rounded-full border border-white/10 bg-ink-800 px-3 py-1 font-mono text-[10.5px] text-mute">
                        {item.period}
                      </span>
                    </div>

                    <p className="mt-4 text-[14px] leading-relaxed text-mute">
                      {item.description}
                    </p>

                    <div className="mt-5 space-y-2 border-l border-crimson-800/40 pl-4">
                      {item.deliverables.map((d, dIdx) => (
                        <div key={dIdx} className="text-[13px] text-dim leading-relaxed">
                          <span className="text-crimson-500 mr-2">›</span>
                          {d}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-4">
                      {item.technologies.map((t) => (
                        <span key={t} className="tag text-[9px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </article>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}