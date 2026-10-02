import { assistantContact, hamzaAIConfig } from "@/config/hamzaAI";
import { buildEmailUrl, buildTelUrl, buildWhatsAppUrl } from "@/lib/ai/handoff";
import type { Language, Lead } from "@/lib/ai/types";
import { ArrowGlyph } from "@/components/ui/Primitives";

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.3-1.94 1.34-.5.05-.98.23-3.3-.69-2.78-1.1-4.55-3.94-4.69-4.13-.14-.19-1.12-1.5-1.12-2.86 0-1.36.71-2.03.96-2.31.25-.27.55-.34.73-.34.18 0 .37 0 .53.01.17.01.4-.06.63.48.24.57.8 1.96.87 2.1.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.49-.14.14-.28.29-.12.56.16.27.72 1.19 1.55 1.93 1.06.95 1.95 1.24 2.23 1.38.27.14.43.12.59-.07.16-.19.68-.79.86-1.06.18-.27.36-.22.61-.13.25.09 1.6.75 1.88.89.27.14.46.21.53.32.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}

function PhoneGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M6.5 3.5h2.2l1.6 4-2 1.4a12 12 0 0 0 6.8 6.8l1.4-2 4 1.6v2.2a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <rect x="3" y="5.5" width="18" height="13" rx="2.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.8 7 7.3 5.4a1.6 1.6 0 0 0 1.8 0L20.2 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

type Props = {
  lead: Lead;
  language: Language;
};

/**
 * Final contact handoff. No calendar integration exists in this project, so
 * there is deliberately no "Book a Meeting" button and no booking claim.
 */
export default function AIContactActions({ lead, language }: Props) {
  const { buttons, ctaHeading, ctaSub, whatsappFallback } = hamzaAIConfig.handoff;
  const ur = language === "ur";

  return (
    <section className="animate-ai-msg relative mt-1 overflow-hidden rounded-xl border border-crimson-800/45 bg-gradient-to-b from-ink-800 to-ink-850">
      <div className="pointer-events-none absolute inset-0 grid-lines-fine opacity-40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(185,28,28,0.28),transparent_70%)]"
      />

      <div className="relative flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1.5">
          <span className="mono-label">{ur ? "Next Step" : "Next step"}</span>
          <h3 className="text-[17px] font-semibold leading-tight text-white">
            {ur ? hamzaAIConfig.handoff.ctaHeading : ctaHeading}
          </h3>
          <p className="text-[12.5px] leading-relaxed text-mute">
            {ur ? whatsappFallback : ctaSub}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px]">
          <a
            href={buildTelUrl()}
            className="break-all text-[#dcdcdc] underline decoration-white/20 underline-offset-4 transition-colors hover:text-crimson-400"
          >
            {assistantContact.phone}
          </a>
          <span aria-hidden="true" className="text-dim">
            ·
          </span>
          <a
            href={assistantContact.emailHref}
            className="break-all text-[#dcdcdc] underline decoration-white/20 underline-offset-4 transition-colors hover:text-crimson-400"
          >
            {assistantContact.email}
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href={buildWhatsAppUrl(lead, language)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary group w-full !min-h-[44px] !text-[13.5px]"
          >
            <WhatsAppGlyph />
            {buttons.whatsapp}
            <ArrowGlyph className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>

          <div className="grid grid-cols-2 gap-2">
            <a href={buildTelUrl()} className="btn btn-ghost w-full !min-h-[44px] !text-[13px]">
              <PhoneGlyph />
              {buttons.call}
            </a>
            <a
              href={buildEmailUrl(lead, language)}
              className="btn btn-ghost w-full !min-h-[44px] !text-[13px]"
            >
              <MailGlyph />
              {buttons.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}