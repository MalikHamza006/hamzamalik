import ProjectVisual from "@/components/ProjectVisual";
import Reveal from "@/components/Reveal";
import { ArrowGlyph } from "@/components/ui/Primitives";
import { projects } from "@/lib/content";

export default function Projects() {
  const featured = projects[0];
  const secondary = projects.slice(1);

  return (
    <section id="projects" className="relative scroll-mt-24 py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
      />

      <div className="shell">
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-crimson-600" />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-crimson-500">
                  01 / SELECTED WORK
                </span>
              </div>
              <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-bold tracking-[-0.035em] text-white">
                Selected Work
              </h2>
              <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-mute">
                Selected products, systems and interfaces I&apos;ve worked on.
              </p>
            </div>

            <a
              href="#contact"
              className="btn btn-ghost !min-h-[44px] !px-6 self-start md:self-auto font-mono text-[11px] uppercase tracking-[0.16em] text-mute hover:text-white"
            >
              Discuss a Project
              <ArrowGlyph className="text-crimson-600" />
            </a>
          </div>
        </Reveal>

        {/* FEATURED PROJECT: Large Horizontal Architectural Block */}
        {featured && (
          <Reveal delay={90} className="mt-14">
            <article className="card card-hover card-leak group relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
                {/* Left Visual Preview */}
                <div className="lg:col-span-7">
                  <div className="overflow-hidden rounded-xl transition-transform duration-700 ease-out group-hover:scale-[1.01]">
                    <ProjectVisual variant={featured.variant} tall />
                  </div>
                </div>

                {/* Right Details */}
                <div className="flex flex-col justify-between lg:col-span-5">
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                      <span className="text-crimson-500">{featured.category}</span>
                      <span className="text-dim">FEATURED // 01</span>
                    </div>

                    <h3 className="mt-4 text-[24px] font-bold tracking-[-0.03em] text-white sm:text-[28px]">
                      {featured.title}
                    </h3>

                    <p className="mt-3 text-[14.5px] leading-relaxed text-mute">
                      {featured.description}
                    </p>

                    <div className="mt-4 border-l-2 border-crimson-800/60 pl-3.5 text-[13px] text-dim">
                      <span className="text-white">Solution: </span>
                      {featured.solution}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {featured.stack.map((t) => (
                        <span key={t} className="tag text-[9.5px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-white/[0.07] pt-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                      {featured.summaryLabel}
                    </span>
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 text-[13px] font-semibold text-white transition-colors group-hover:text-crimson-400"
                    >
                      <span>VIEW PROJECT</span>
                      <ArrowGlyph className="h-3.5 w-3.5 text-crimson-500 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        )}

        {/* SECONDARY PROJECTS: Clean 3-Column Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {secondary.map((project, idx) => (
            <Reveal key={project.title} delay={(idx % 3) * 80}>
              <article className="card card-hover card-leak group relative flex h-full flex-col justify-between overflow-hidden p-6 sm:p-7">
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
                    <span className="text-crimson-500">{project.category}</span>
                    <span className="text-dim">0{idx + 2}</span>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-lg">
                    <ProjectVisual variant={project.variant} />
                  </div>

                  <h3 className="mt-5 text-[19px] font-semibold text-white tracking-[-0.02em]">
                    {project.title}
                  </h3>

                  <p className="mt-2.5 text-[13px] leading-relaxed text-mute">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.stack.map((t) => (
                      <span key={t} className="tag text-[9px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <span className="truncate font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
                    {project.summaryLabel}
                  </span>
                  <a
                    href="#contact"
                    className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-medium text-white transition-colors group-hover:text-crimson-400"
                  >
                    <span>VIEW PROJECT</span>
                    <ArrowGlyph className="h-3 w-3 text-crimson-500 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}