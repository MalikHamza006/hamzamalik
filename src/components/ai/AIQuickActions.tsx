import { hamzaAIConfig } from "@/config/hamzaAI";

type Props = {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
};

/**
 * Shown once, when the assistant first opens, so a visitor can start the
 * conversation without typing a question.
 */
export default function AIQuickActions({ onSelect, disabled = false }: Props) {
  return (
    <div className="animate-ai-msg pt-1">
      <p className="mono-label mb-2.5">What can I help you with?</p>
      <div className="flex flex-wrap gap-1.5">
        {hamzaAIConfig.quickActions.map((action) => (
          <button
            key={action.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(action.prompt)}
            className="rounded-full border border-white/[0.1] bg-white/[0.025] px-3 py-2 text-[12.5px] text-[#d4d4d4] transition-colors duration-300 hover:border-crimson-700/70 hover:bg-crimson-950/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}