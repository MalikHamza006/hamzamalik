import { hamzaAIConfig } from "@/config/hamzaAI";
import { buildLeadRows } from "@/lib/ai/handoff";
import type { Language, Lead } from "@/lib/ai/types";

/** The visitor-facing project brief. No JSON, no internal metadata. */
export default function AILeadSummary({
  lead,
  language,
}: {
  lead: Lead;
  language: Language;
}) {
  const rows = buildLeadRows(lead, language);
  if (!rows.length) return null;

  return (
    <section className="animate-ai-msg mt-1 overflow-hidden rounded-xl border border-crimson-900/45 bg-gradient-to-b from-crimson-950/35 to-ink-850">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-crimson-500" />
        <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          {hamzaAIConfig.handoff.summaryTitle}
        </h3>
      </div>

      <dl className="divide-y divide-white/[0.05]">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-0.5 px-4 py-2.5 sm:flex-row sm:gap-4">
            <dt className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.18em] text-dim sm:w-[92px] sm:pt-0.5">
              {row.label}
            </dt>
            <dd className="min-w-0 break-words text-[13.5px] leading-[1.55] text-[#e8e8e8]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="border-t border-white/[0.05] px-4 py-2.5 font-mono text-[9.5px] leading-relaxed tracking-[0.06em] text-dim">
        {hamzaAIConfig.handoff.noStorageNote[language]}
      </p>
    </section>
  );
}