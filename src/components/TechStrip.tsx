import Reveal from "@/components/Reveal";
import TechIcon from "@/components/TechIcon";

const stackItems = [
  { id: "react", name: "React", category: "UI Library" },
  { id: "next", name: "Next.js", category: "Full-Stack React" },
  { id: "django", name: "Django", category: "Python Framework" },
  { id: "laravel", name: "Laravel", category: "PHP Framework" },
  { id: "node", name: "Node.js", category: "JavaScript Runtime" },
  { id: "typescript", name: "TypeScript", category: "Static Typing" },
  { id: "javascript", name: "JavaScript", category: "Core Language" },
  { id: "tailwind", name: "Tailwind CSS", category: "CSS Architecture" },
  { id: "bootstrap", name: "Bootstrap", category: "Responsive Grid" },
  { id: "ai", name: "AI Engineering", category: "LLM Pipelines" },
];

export default function TechStrip() {
  return (
    <section aria-label="Technology Stack" className="relative py-16 sm:py-20">
      <div className="shell">
        <div className="flex flex-col gap-2">
          <span className="mono-label text-crimson-500">PRODUCTION ECOSYSTEM</span>
          <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-white sm:text-[22px]">
            Technology Stack &amp; Applied Tooling
          </h3>
          <p className="max-w-[48ch] text-[13.5px] leading-relaxed text-mute">
            A battle-tested stack deployed across modern frontend systems, backend services, and AI workflows.
          </p>
        </div>

        {/* Compact Technical Chips Grid */}
        <Reveal delay={60} className="mt-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {stackItems.map((tech) => (
              <div
                key={tech.id}
                className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-ink-850/80 p-3.5 transition-all duration-300 hover:border-crimson-800/60 hover:bg-ink-800"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-ink-900 text-dim transition-colors group-hover:border-crimson-700/60 group-hover:text-white">
                  <TechIcon id={tech.id} className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold text-white">
                    {tech.name}
                  </div>
                  <div className="truncate font-mono text-[8.5px] uppercase tracking-[0.14em] text-dim">
                    {tech.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>
    </section>
  );
}