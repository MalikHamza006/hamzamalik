type Props = {
  listening: boolean;
  supported: boolean;
  speaking: boolean;
  onToggleVoice: () => void;
  onStopSpeaking: () => void;
  disabled?: boolean;
};

function MicGlyph({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[18px] w-[18px]">
      <rect
        x="9"
        y="2.5"
        width="6"
        height="11"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
        fill={active ? "currentColor" : "none"}
      />
      <path
        d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpeakerGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[18px] w-[18px]">
      <path
        d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 9.5a4 4 0 0 1 0 5M18 7a7.5 7.5 0 0 1 0 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AIVoiceButton({
  listening,
  supported,
  speaking,
  onToggleVoice,
  onStopSpeaking,
  disabled = false,
}: Props) {
  if (!supported) {
    return (
      <span
        className="flex h-10 w-10 shrink-0 cursor-not-allowed items-center justify-center rounded-xl border border-white/[0.08] text-dim"
        aria-hidden="true"
        title="Voice input is not supported in this browser — use the text field"
      >
        <MicGlyph active={false} />
      </span>
    );
  }

  if (speaking) {
    return (
      <button
        type="button"
        onClick={onStopSpeaking}
        aria-label="Stop speaking"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-crimson-700/60 bg-crimson-950/50 text-crimson-400 transition-colors duration-300 hover:bg-crimson-900/60"
      >
        <SpeakerGlyph />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggleVoice}
      disabled={disabled}
      aria-label={listening ? "Stop voice input" : "Start voice input"}
      aria-pressed={listening}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-45 ${
        listening
          ? "animate-ai-mic border-crimson-600 bg-crimson-800 text-white"
          : "border-white/[0.1] bg-white/[0.03] text-[#c9c9c9] hover:border-crimson-700/70 hover:text-white"
      }`}
    >
      <MicGlyph active={listening} />
    </button>
  );
}