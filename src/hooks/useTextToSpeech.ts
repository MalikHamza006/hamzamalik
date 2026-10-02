"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Language } from "@/lib/ai/types";

function hasSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * Browser speech synthesis.
 * Opt-in only: nothing is spoken until the visitor turns it on.
 * Always cleaned up so the panel never leaves speech running in the background.
 */
export function useTextToSpeech() {
  const supported = useSyncExternalStore(
    () => () => {},
    hasSpeechSynthesis,
    () => false,
  );

  const [speaking, setSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const synth = typeof window === "undefined" ? null : window.speechSynthesis;
    synthRef.current = synth;
    if (!synth) return;

    const readVoices = () => {
      voicesRef.current = synth.getVoices();
    };

    readVoices();
    synth.addEventListener("voiceschanged", readVoices);

    return () => {
      synth.removeEventListener("voiceschanged", readVoices);
      synth.cancel();
      synthRef.current = null;
    };
  }, []);

  const stop = useCallback(() => {
    synthRef.current?.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((text: string, language: Language) => {
    const synth = synthRef.current;
    const clean = text.replace(/\s+/g, " ").trim();
    if (!synth || !clean) return;

    synth.cancel();

    try {
      const utterance = new SpeechSynthesisUtterance(clean);
      const tag = language === "ur" ? "ur" : "en";

      const voice = voicesRef.current.find((item) =>
        item.lang.toLowerCase().startsWith(tag),
      );
      if (voice) utterance.voice = voice;

      utterance.lang = voice?.lang ?? (language === "ur" ? "ur-PK" : "en-US");
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      setSpeaking(true);
      synth.speak(utterance);
    } catch {
      // Some browsers throw on very long text — fail quietly, never block the UI.
      setSpeaking(false);
    }
  }, []);

  return { supported, speaking, speak, stop };
}