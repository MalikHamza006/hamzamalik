import Reveal from "@/components/Reveal";
import { CornerBrackets } from "@/components/ui/Primitives";

const aiCapabilities = [
  {
    num: "01",
    title: "Deterministic Prompt Engineering",
    desc: "Developing structured prompt schemas, few-shot conditioning, and explicit JSON output validation to eliminate model hallucinations in production workflows.",
    tags: ["Structured JSON", "Few-Shot", "Guardrails", "Schema Audit"],
  },
  {
    num: "02",
    title: "Workflow Automation & Triggers",
    desc: "Connecting language models directly to repeatable backend loops — document classification, intake data routing, and operational action dispatchers.",
    tags: ["Event Triggers", "Data Routing", "Human-in-the-Loop", "APIs"],
  },
  {
    num: "03",
    title: "Conversational Project Assistant",
    desc: "Custom intelligent assistants engineered to intake client project scopes, extract technical requirements, and route inquiries directly to WhatsApp or email.",
    tags: ["Lead Qualification", "Requirement Extraction", "Voice & Chat"],
  },
];

export default function AISystems() {
  return (
    <section id="ai-systems" className="relative scroll-mt-24 py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[36rem] w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.2),transparent_70%)] blur-[80px]"
      />

      <div className="shell">
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-crimson-600" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-crimson-500">
                05 / AI SYSTEMS
              </span>
            </div>
            <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-bold tracking-[-0.035em] text-white">
              AI Systems &amp; Automation
            </h2>
            <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-mute">
              Practical, production-focused AI engineering — transforming language models from experimental novelties into dependable, automated backend execution loops.
            </p>
          </div>
        </Reveal>

        {/* System Pipeline Architectural Visual */}
        <Reveal delay={90} className="mt-14">
          <div className="card relative overflow-hidden p-6 sm:p-8 lg:p-10">
            <CornerBrackets />

            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                PIPELINE ARCHITECTURE // RUNTIME
              </span>
              <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-crimson-500">
                <span className="h-1.5 w-1.5 animate-dot rounded-full bg-crimson-600" />
                DETERMINISTIC EXECUTION
              </span>
            </div>

            {/* 4-Stage Node Flow */}
            <div className="mt-8 grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
              {[
                {
                  step: "01",
                  title: "INPUT",
                  desc: "Unstructured Client & Operational Ingestion",
                  badge: "REST / Webhooks",
                },
                {
                  step: "02",
                  title: "AI PROCESSING",
                  desc: "Structured System Prompts & Temperature 0.1",
                  badge: "Deterministic LLM",
                },
                {
                  step: "03",
                  title: "AUTOMATION",
                  desc: "Schema Validation & Autonomous Triggers",
                  badge: "Node / Django Worker",
                },
                {
                  step: "04",
                  title: "OUTPUT",
                  desc: "Committed Database State & Instant Notification",
                  badge: "PostgreSQL / WhatsApp",
                },
              ].map((node, i) => (
                <div
                  key={node.step}
                  className="relative rounded-xl border border-white/[0.08] bg-ink-850/80 p-5 transition-colors hover:border-crimson-800/60"
                >
                  <div className="flex items-center justify-between font-mono text-[9.5px]">
                    <span className="font-bold text-crimson-500">{node.step}</span>
                    <span className="text-dim">{node.badge}</span>
                  </div>

                  <div className="mt-3 text-[16px] font-semibold text-white tracking-tight">
                    {node.title}
                  </div>

                  <p className="mt-2 text-[12.5px] leading-relaxed text-mute">
                    {node.desc}
                  </p>

                  {/* Flow Arrow indicator between nodes on desktop */}
                  {i < 3 && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-2.5 top-1/2 hidden -translate-y-1/2 z-20 text-crimson-600 lg:block"
                    >
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4 font-mono text-[9.5px] text-dim">
              <span>ZERO HALLUCINATIONS TOLERANCE</span>
              <span className="text-white">STRICT JSON CONTRACTS ONLY</span>
              <span className="text-crimson-500">APPLIED AI ENGINEERING</span>
            </div>
          </div>
        </Reveal>

        {/* 3 Practical Capability Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
          {aiCapabilities.map((card, idx) => (
            <Reveal key={card.num} delay={idx * 80}>
              <article className="card card-hover card-leak flex h-full flex-col justify-between overflow-hidden p-6 sm:p-7">
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-crimson-500">
                    <span>{card.num}</span>
                    <span>DISCIPLINE</span>
                  </div>

                  <h3 className="mt-4 text-[19px] font-semibold text-white tracking-[-0.02em]">
                    {card.title}
                  </h3>

                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-mute">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-4">
                  {card.tags.map((t) => (
                    <span key={t} className="tag text-[9px]">
                      {t}
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
