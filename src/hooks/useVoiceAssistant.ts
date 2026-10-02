"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Language, VoiceState } from "@/lib/ai/types";

/* Minimal typings for the Web Speech recognition API, which is not in lib.dom. */

type AlternativeLike = { transcript: string };
type ResultLike = { isFinal: boolean; length: number; [index: number]: AlternativeLike };
type ResultListLike = { length: number; [index: number]: ResultLike };

interface SpeechRecognitionEventLike extends Event {
  results: ResultListLike;
  resultIndex: number;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
}

type RecognitionConstructor = new () => SpeechRecognitionLike;

function hasRecognition() {
  return getRecognitionConstructor() !== null;
}

function getRecognitionConstructor(): RecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const scope = window as unknown as {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition ?? null;
}

/** Maps recognition errors to a friendly, recoverable message. */
function describeError(code: string) {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone access was blocked. Enable it in your browser settings, or just type your message below.";
    case "no-speech":
      return "I didn't catch any speech. Tap the microphone and try again, or type below.";
    case "audio-capture":
      return "No microphone was found. You can type your message instead.";
    case "network":
      return "Voice recognition needs a network connection and it isn't responding. Please type your message instead.";
    case "aborted":
      return "Voice input stopped.";
    default:
      return "Voice input didn't work in this browser. Please type your message instead.";
  }
}

const WATCHDOG_MS = 15000;

/**
 * Voice input via the browser Speech Recognition API.
 * The microphone is never started automatically — only from an explicit tap.
 */
export function useVoiceAssistant(language: Language) {
  const supported = useSyncExternalStore(
    () => () => {},
    hasRecognition,
    () => false,
  );

  const [state, setState] = useState<VoiceState>("idle");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const activeRef = useRef(false);
  const watchdogRef = useRef<number | null>(null);
  const finalTextRef = useRef("");

  const clearWatchdog = useCallback(() => {
    if (watchdogRef.current !== null) {
      window.clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  }, []);

  const teardown = useCallback(() => {
    clearWatchdog();
    activeRef.current = false;
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.onstart = null;
      try {
        recognition.abort();
      } catch {
        // already stopped
      }
    }
    setState("idle");
  }, [clearWatchdog]);

  useEffect(() => teardown, [teardown]);

  const start = useCallback(() => {
    if (activeRef.current) return;

    const Recognition = getRecognitionConstructor();
    if (!Recognition) {
      setError("Voice input isn't supported in this browser. Please type your message instead.");
      setState("error");
      return;
    }

    setError(null);
    finalTextRef.current = "";

    let recognition: SpeechRecognitionLike;
    try {
      recognition = new Recognition();
    } catch {
      setError("Voice input couldn't start. Please type your message instead.");
      setState("error");
      return;
    }

    recognition.lang = language === "ur" ? "ur-PK" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      activeRef.current = true;
      setState("listening");
      clearWatchdog();
      watchdogRef.current = window.setTimeout(() => {
        try {
          recognition.abort();
        } catch {
          // noop
        }
        setState("idle");
        setError("Voice input timed out. Tap the microphone to retry, or type below.");
      }, WATCHDOG_MS);
    };

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) finalTextRef.current += text;
        else interim += text;
      }
      // Mirror interim speech so the visitor can see it is being captured.
      setState("listening");
      if (finalTextRef.current) {
        setError(interim ? `Heard: ${finalTextRef.current}` : null);
      }
    };

    recognition.onerror = (event) => {
      clearWatchdog();
      activeRef.current = false;
      recognitionRef.current = null;
      if (event.error === "aborted") {
        setState("idle");
        return;
      }
      setError(describeError(event.error));
      setState("error");
    };

    recognition.onend = () => {
      clearWatchdog();
      activeRef.current = false;
      recognitionRef.current = null;
      setState((current) => (current === "error" ? current : "idle"));
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      activeRef.current = false;
      recognitionRef.current = null;
      setError("Voice input is already active. Please try again.");
      setState("error");
    }
  }, [language, clearWatchdog]);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setState("idle");
      return;
    }
    clearWatchdog();
    try {
      recognition.stop();
    } catch {
      teardown();
    }
  }, [clearWatchdog, teardown]);

  const toggle = useCallback(() => {
    if (activeRef.current || state === "listening") stop();
    else start();
  }, [start, stop, state]);

  const consumeTranscript = useCallback((): string => {
    const transcript = finalTextRef.current.trim();
    finalTextRef.current = "";
    setError(null);
    return transcript;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    supported,
    listening: state === "listening",
    error,
    start,
    stop,
    toggle,
    teardown,
    consumeTranscript,
    clearError,
  };
}