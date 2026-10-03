"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AIChatPanel from "@/components/ai/AIChatPanel";
import { hamzaAIConfig } from "@/config/hamzaAI";
import { useAIConversation } from "@/hooks/useAIConversation";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";

export default function HMAssistant() {
  const [open, setOpen] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [launcherHidden, setLauncherHidden] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const chat = useAIConversation();
  const tts = useTextToSpeech();
  const voice = useVoiceAssistant(chat.language);

  /**
   * The hook return values are fresh objects on every render. Everything used
   * inside effects and callbacks is destructured so the dependency arrays hold
   * stable references (otherwise "speak the newest reply" would re-trigger).
   */
  const { send, retry, reset, messages, pending, failure } = chat;
  const { speak, stop: stopSpeech, supported: ttsSupported, speaking } = tts;
  const {
    supported: voiceSupported,
    listening: voiceListening,
    error: voiceError,
    start: startVoice,
    stop: stopVoice,
    teardown: teardownVoice,
    consumeTranscript,
  } = voice;

  /* --- keyboard: Escape closes, never traps focus --- */
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* --- stop speech and mic when the panel closes --- */
  useEffect(() => {
    if (open) return;
    stopSpeech();
    teardownVoice();
  }, [open, stopSpeech, teardownVoice]);

  /* --- lock background scroll on small screens only --- */
  useEffect(() => {
    if (!open) return;
    if (!window.matchMedia("(max-width: 639px)").matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /* --- move focus into the panel when it opens --- */
  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("textarea")?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  /* --- speak the newest assistant reply, only when opted in --- */
  const lastMessage = messages[messages.length - 1];
  useEffect(() => {
    if (!ttsEnabled || !open || pending) return;
    if (!lastMessage || lastMessage.role !== "assistant") return;
    speak(lastMessage.text, chat.language);
  }, [lastMessage, ttsEnabled, open, pending, speak, chat.language]);

  /* --- hide the launcher at the very bottom so it never covers footer links --- */
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setLauncherHidden(entry.isIntersecting),
      { threshold: 0.6 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const toggle = useCallback(() => {
    setOpen((value) => {
      if (value) {
        stopSpeech();
        teardownVoice();
      }
      return !value;
    });
  }, [stopSpeech, teardownVoice]);

  /* --- submit text or the finished voice transcript --- */
  const submit = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value || pending) return;
      if (ttsEnabled) stopSpeech();
      stopVoice();
      send(value);
    },
    [pending, ttsEnabled, stopSpeech, stopVoice, send],
  );

  const toggleVoice = useCallback(() => {
    if (voiceListening) {
      stopVoice();
      return;
    }
    startVoice();
  }, [voiceListening, stopVoice, startVoice]);

  /* when recognition finishes, send whatever it heard */
  const wasListening = useRef(false);
  useEffect(() => {
    if (wasListening.current && !voiceListening) {
      const transcript = consumeTranscript();
      if (transcript) submit(transcript);
    }
    wasListening.current = voiceListening;
  }, [voiceListening, consumeTranscript, submit]);

  return (
    <>
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={`${hamzaAIConfig.name} — ${hamzaAIConfig.subtitle}`}
          className="animate-ai-sheet fixed inset-0 z-[70] sm:inset-auto sm:bottom-[6.5rem] sm:right-5 sm:z-[70] sm:w-[398px]"
        >
          <div className="absolute inset-0 sm:relative sm:h-[min(37rem,calc(100dvh-9rem))] sm:rounded-2xl">
            <AIChatPanel
              messages={messages}
              pending={pending}
              failure={failure}
              showQuickActions={chat.showQuickActions}
              showLeadCard={chat.showLeadCard}
              lead={chat.lead}
              language={chat.language}
              voiceError={voiceError}
              voiceSupported={voiceSupported}
              voiceListening={voiceListening}
              speaking={speaking}
              ttsEnabled={ttsEnabled}
              ttsSupported={ttsSupported}
              onSend={submit}
              onRetry={retry}
              onReset={reset}
              onToggleVoice={toggleVoice}
              onStopSpeaking={stopSpeech}
              onToggleTts={() => {
                const next = !ttsEnabled;
                setTtsEnabled(next);
                if (!next) stopSpeech();
              }}
              onClose={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
            />
          </div>
        </div>
      ) : (
        <button
          ref={launcherRef}
          type="button"
          onClick={toggle}
          aria-label={`Open ${hamzaAIConfig.name} — ${hamzaAIConfig.subtitle}`}
          aria-expanded={false}
          aria-haspopup="dialog"
          tabIndex={launcherHidden ? -1 : 0}
          className={`group fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-[65] flex items-center gap-2.5 rounded-full border border-white/[0.1] bg-ink-850/90 p-2 sm:py-2.5 sm:pl-3 sm:pr-4 backdrop-blur-xl transition-[opacity,transform,border-color,box-shadow] duration-500 hover:-translate-y-0.5 hover:border-crimson-700/80 hover:shadow-[0_16px_42px_-14px_rgba(185,28,28,0.9)] focus-visible:border-crimson-600 ${
            launcherHidden
              ? "pointer-events-none translate-y-3 opacity-0"
              : "opacity-100"
          }`}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[radial-gradient(70%_120%_at_20%_120%,rgba(185,28,28,0.35),transparent_70%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100"
          />
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-crimson-800/60 bg-ink-800 text-crimson-500">
            <span aria-hidden="true" className="animate-ai-orb absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_120%,rgba(220,38,38,0.45),transparent_70%)]" />
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="relative h-[17px] w-[17px]">
              <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.9" />
              <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.1" opacity="0.45" />
            </svg>
          </span>
          <span className="relative hidden sm:flex flex-col items-start leading-none">
            <span className="text-[13px] font-semibold tracking-[0.01em] text-white">
              {hamzaAIConfig.name}
            </span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-dim">
              {hamzaAIConfig.subtitle}
            </span>
          </span>
        </button>
      )}
    </>
  );
}