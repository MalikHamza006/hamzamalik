"use client";

import { useEffect, useRef, useState } from "react";
import AIContactActions from "@/components/ai/AIContactActions";
import AILeadSummary from "@/components/ai/AILeadSummary";
import AIMessage from "@/components/ai/AIMessage";
import AIQuickActions from "@/components/ai/AIQuickActions";
import AIVoiceButton from "@/components/ai/AIVoiceButton";
import { hamzaAIConfig } from "@/config/hamzaAI";
import type { Language, Lead } from "@/lib/ai/types";

type Props = {
  messages: { id: string; role: "assistant" | "user"; text: string }[];
  pending: boolean;
  failure: string | null;
  showQuickActions: boolean;
  showLeadCard: boolean;
  lead: Lead;
  language: Language;
  voiceError: string | null;
  voiceSupported: boolean;
  voiceListening: boolean;
  speaking: boolean;
  ttsEnabled: boolean;
  ttsSupported: boolean;
  onSend: (text: string) => void;
  onRetry: () => void;
  onReset: () => void;
  onToggleVoice: () => void;
  onStopSpeaking: () => void;
  onToggleTts: () => void;
  onClose: () => void;
};

function CloseGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-3.5 w-3.5">
      <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SpeakerGlyph({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {muted ? (
        <path d="m16 9.5 5 5M21 9.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path
          d="M15.5 9.5a4 4 0 0 1 0 5M18 7a7.5 7.5 0 0 1 0 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function ResetGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M19.5 12a7.5 7.5 0 1 1-2.4-5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M19.8 4.2v4.4h-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SendGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="M4 12h14M12.5 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AIChatPanel({
  messages,
  pending,
  failure,
  showQuickActions,
  showLeadCard,
  lead,
  language,
  voiceError,
  voiceSupported,
  voiceListening,
  speaking,
  ttsEnabled,
  ttsSupported,
  onSend,
  onRetry,
  onReset,
  onToggleVoice,
  onStopSpeaking,
  onToggleTts,
  onClose,
}: Props) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages, pending, showLeadCard, showQuickActions]);

  const submit = () => {
    const text = draft.trim();
    if (!text || pending) return;
    setDraft("");
    onSend(text);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  const statusLabel = pending
    ? "Thinking"
    : voiceListening
      ? "Listening"
      : speaking
        ? "Speaking"
        : showLeadCard
          ? "Brief ready"
          : "Ready to help";

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden border border-white/[0.09] bg-ink-900/97 backdrop-blur-2xl">
      {/* Glow + grid, purely decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-20 h-40 bg-[radial-gradient(70%_100%_at_50%_100%,rgba(185,28,28,0.22),transparent_72%)]"
      />

      <header className="relative flex shrink-0 items-center gap-3 border-b border-white/[0.07] px-4 py-3">
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-crimson-800/60 bg-ink-850 text-crimson-500">
          <span
            aria-hidden="true"
            className={`absolute inset-0 rounded-[10px] bg-[radial-gradient(circle_at_50%_120%,rgba(185,28,28,0.5),transparent_70%)] ${
              pending || voiceListening ? "animate-ai-orb" : ""
            }`}
          />
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="relative h-[18px] w-[18px]">
            <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.9" />
            <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.1" opacity="0.45" />
          </svg>
        </span>

        <div className="flex min-w-0 flex-1 flex-col leading-none">
          <span className="text-[14px] font-semibold tracking-[0.01em] text-white">
            {hamzaAIConfig.name}
          </span>
          <span className="mt-1.5 truncate font-mono text-[9.5px] uppercase tracking-[0.18em] text-dim">
            {hamzaAIConfig.subtitle}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {ttsSupported ? (
            <button
              type="button"
              onClick={onToggleTts}
              aria-pressed={ttsEnabled}
              aria-label={ttsEnabled ? "Turn off spoken replies" : "Read replies aloud"}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors duration-300 ${
                ttsEnabled
                  ? "border-crimson-700/60 bg-crimson-950/50 text-crimson-400"
                  : "border-white/[0.08] text-dim hover:border-crimson-800/60 hover:text-white"
              }`}
            >
              <SpeakerGlyph muted={!ttsEnabled} />
            </button>
          ) : null}

          <button
            type="button"
            onClick={onReset}
            aria-label="Start a new conversation"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-dim transition-colors duration-300 hover:border-crimson-800/60 hover:text-white"
          >
            <ResetGlyph />
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close AI assistant"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-dim transition-colors duration-300 hover:border-crimson-800/60 hover:text-white"
          >
            <CloseGlyph />
          </button>
        </div>
      </header>

      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation with HM AI"
        className="relative min-h-0 flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-4 py-4"
      >
        <ul className="space-y-2.5">
          {messages.map((message) => (
            <AIMessage key={message.id} role={message.role} text={message.text} />
          ))}
        </ul>

        {pending ? (
          <div className="flex items-center gap-2.5">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-crimson-800/50 bg-ink-850">
              <span className="flex items-end gap-[3px]" aria-hidden="true">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="animate-ai-bars h-1 w-1 rounded-full bg-crimson-500"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
              {statusLabel}
            </span>
          </div>
        ) : null}

        {showQuickActions && !pending ? <AIQuickActions onSelect={onSend} /> : null}

        {showLeadCard ? (
          <div className="space-y-2 pt-1">
            <AILeadSummary lead={lead} language={language} />
            <AIContactActions lead={lead} language={language} />
          </div>
        ) : null}
      </div>

      {failure ? (
        <div
          role="alert"
          className="flex shrink-0 items-center justify-between gap-3 border-t border-crimson-900/50 bg-crimson-950/30 px-4 py-2"
        >
          <span className="text-[12px] leading-snug text-[#e0c9c9]">{failure}</span>
          <button
            type="button"
            onClick={onRetry}
            className="shrink-0 rounded-full border border-crimson-700/60 px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-crimson-900/60"
          >
            Retry
          </button>
        </div>
      ) : null}

      {voiceError ? (
        <p role="status" className="shrink-0 border-t border-white/[0.05] px-4 py-2 text-[11.5px] leading-snug text-dim">
          {voiceError}
        </p>
      ) : null}

      <div className="shrink-0 border-t border-white/[0.07] px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-end gap-2">
          <AIVoiceButton
            listening={voiceListening}
            supported={voiceSupported}
            speaking={speaking}
            onToggleVoice={onToggleVoice}
            onStopSpeaking={onStopSpeaking}
            disabled={pending}
          />

          <label className="sr-only" htmlFor="hm-ai-input">
            Tell me about your project
          </label>
          <textarea
            ref={inputRef}
            id="hm-ai-input"
            rows={1}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Tell me about your project..."
            className="max-h-28 min-h-[40px] flex-1 resize-none rounded-xl border border-white/[0.1] bg-white/[0.03] px-3.5 py-2.5 text-[14px] leading-[1.5] text-white placeholder:text-dim focus:border-crimson-700/70 focus:outline-none"
          />

          <button
            type="button"
            onClick={submit}
            disabled={!draft.trim() || pending}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-crimson-800 text-white transition-colors duration-300 hover:bg-crimson-700 disabled:cursor-not-allowed disabled:border-white/[0.06] disabled:bg-white/[0.03] disabled:text-dim"
          >
            <SendGlyph />
          </button>
        </div>

        <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-dim">
          {statusLabel}
        </p>
      </div>
    </div>
  );
}