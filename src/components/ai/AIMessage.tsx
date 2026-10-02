import type { ChatMessage } from "@/lib/ai/types";

function OrbGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="4.2" fill="currentColor" opacity="0.9" />
      <circle
        cx="12"
        cy="12"
        r="8.4"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.45"
      />
      <path
        d="M12 1.6v3M12 19.4v3M1.6 12h3M19.4 12h3"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

export default function AIMessage({ role, text }: Pick<ChatMessage, "role" | "text">) {
  if (role === "user") {
    return (
      <li className="animate-ai-msg flex justify-end">
        <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md border border-white/[0.07] bg-ink-700 px-3.5 py-2.5 text-[14px] leading-[1.6] text-white">
          {text}
        </p>
      </li>
    );
  }

  return (
    <li className="animate-ai-msg flex items-start gap-2.5">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-crimson-800/50 bg-ink-850 text-crimson-500">
        <OrbGlyph className="h-4 w-4" />
      </span>
      <p className="max-w-[88%] whitespace-pre-wrap rounded-2xl rounded-tl-md border border-white/[0.07] bg-ink-850 px-3.5 py-2.5 text-[14px] leading-[1.62] text-[#e4e4e4]">
        {text}
      </p>
    </li>
  );
}