import Reveal from "@/components/Reveal";

const expertiseModules = [
  {
    number: "01",
    title: "Full-Stack Development",
    desc: "End-to-end web architectures linking reactive frontend clients with robust server logic, session managers, and relational databases.",
    tags: ["React", "Next.js", "Django", "Laravel", "Node.js"],
  },
  {
    number: "02",
    title: "Frontend Engineering",
    desc: "Building low-latency client applications with strict type safety, memoized components, and fluid responsive behaviors.",
    tags: ["React", "Next.js", "TypeScript", "JavaScript", "HTML/CSS"],
  },
  {
    number: "03",
    title: "Backend Engineering",
    desc: "Designing resilient RESTful microservices, asynchronous request queues, and robust server frameworks in Django, Laravel, and Node.js.",
    tags: ["Django REST", "Laravel", "Node.js", "Python", "PHP"],
  },
  {
    number: "04",
    title: "AI Engineering",
    desc: "Integrating commercial LLM APIs into web apps, orchestrating multi-step generation pipelines, and instrumenting token telemetry.",
    tags: ["LLM APIs", "System Integration", "Telemetry", "Validation"],
  },
  {
    number: "05",
    title: "AI Automation",
    desc: "Automating operational business loops with autonomous trigger sequences, document triage, and human-in-the-loop verification.",
    tags: ["Workflow Automation", "Event Triggers", "Data Extraction"],
  },
  {
    number: "06",
    title: "Prompt Engineering",
    desc: "Engineering deterministic system prompts, few-shot conditioning, and strict JSON schema extraction to eliminate hallucinations.",
    tags: ["Structured Outputs", "JSON Schemas", "Guardrails", "Few-Shot"],
  },
  {
    number: "07",
    title: "API Development",
    desc: "Specifying documented, versioned RESTful APIs with strict payload validation, secure headers, and defensive error boundaries.",
    tags: ["RESTful Standards", "JSON Contracts", "Postman", "CORS/Auth"],
  },
  {
    number: "08",
    title: "Database & System Design",
    desc: "Relational data modeling, ACID transactions, index optimization, and connection pooling across PostgreSQL and MySQL databases.",
    tags: ["PostgreSQL", "MySQL", "ACID", "Migrations", "ORM"],
  },
  {
    number: "09",
    title: "Modern UI Engineering",
    desc: "Developing accessible design tokens, dark mode systems, bespoke typography scales, and sub-100ms render budgets.",
    tags: ["Tailwind CSS", "Bootstrap", "Design Tokens", "Accessibility"],
  },
];

export default function Skills() {
  return (
    <section id="expertise" className="relative scroll-mt-24 py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
      />

      <div className="shell">
        <Reveal>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-crimson-600" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-crimson-500">
                02 / EXPERTISE
              </span>
            </div>
            <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-bold tracking-[-0.035em] text-white">
              Engineering Expertise
            </h2>
            <p className="mt-3 max-w-[54ch] text-[15px] leading-relaxed text-mute">
              Nine core architectural disciplines practiced daily across modern full-stack software development and applied AI.
            </p>
          </div>
        </Reveal>

        {/* Structured 3 × 3 Grid of Architectural Modules */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {expertiseModules.map((item, index) => (
            <Reveal key={item.number} delay={(index % 3) * 70}>
              <article className="card card-hover card-leak relative flex h-full flex-col justify-between overflow-hidden p-6 sm:p-7">
                <div>
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
                    <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-crimson-500">
                      {item.number}
                    </span>
                    <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-dim">
                      MODULE // 0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-4 text-[19px] font-semibold text-white tracking-[-0.02em]">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-mute">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-4">
                  {item.tags.map((tag) => (
                    <span key={tag} className="tag text-[9px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}