"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { hamzaAIConfig } from "@/config/hamzaAI";
import {
  initialConversationState,
  type AssistantReply,
  type AssistantState,
  type ChatMessage,
  type ConversationState,
} from "@/lib/ai/types";

const REQUEST_TIMEOUT_MS = 20000;

const COLLECTING_STAGES = new Set([
  "project_type",
  "new_or_existing",
  "design",
  "timeline",
  "budget",
  "name",
  "contact",
]);

const NETWORK_ERROR =
  "I couldn't reach the assistant just now. Please check your connection and try again.";

function nextId(counter: React.MutableRefObject<number>) {
  counter.current += 1;
  return `m${counter.current}`;
}

export function useAIConversation() {
  const idRef = useRef(0);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: "m0", role: "assistant", text: hamzaAIConfig.greeting.en },
  ]);
  const [conversation, setConversation] = useState<ConversationState>(
    initialConversationState,
  );
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showLeadCard, setShowLeadCard] = useState(false);
  const [source, setSource] = useState<"llm" | "local">("local");

  const inFlight = useRef(false);
  const lastUserText = useRef("");
  const abortRef = useRef<AbortController | null>(null);

  /**
   * Mirrored into a ref so `send` stays referentially stable. A changing
   * `send` would re-trigger the panel's speak-on-reply effect.
   */
  const conversationRef = useRef(initialConversationState);
  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const request = useCallback(
    async (text: string, current: ConversationState) => {
      const controller = new AbortController();
      abortRef.current = controller;
      const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch("/api/assistant", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ message: text, state: current }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const detail = (await response.json().catch(() => null)) as {
            message?: string;
          } | null;
          throw new Error(detail?.message || NETWORK_ERROR);
        }

        return (await response.json()) as AssistantReply;
      } finally {
        window.clearTimeout(timer);
        abortRef.current = null;
      }
    },
    [],
  );

  const run = useCallback(
    async (text: string) => {
      const clean = text.replace(/\s+/g, " ").trim();
      if (!clean || inFlight.current) return;

      inFlight.current = true;
      setPending(true);
      setFailure(null);
      lastUserText.current = clean;

      setMessages((current) => [
        ...current,
        { id: nextId(idRef), role: "user", text: clean },
      ]);

      try {
        const snapshot = conversationRef.current;
        const reply = await request(clean, snapshot);

        setConversation({
          stage: reply.stage,
          lead: reply.lead,
          intent: reply.intent,
          language: reply.language,
          askedName: reply.stage === "name" || snapshot.askedName,
          askedContact: reply.stage === "contact" || snapshot.askedContact,
        });
        setShowQuickActions(reply.showQuickActions);
        setShowLeadCard(reply.showLeadCard);
        setSource(reply.source);

        setMessages((current) => [
          ...current,
          { id: nextId(idRef), role: "assistant", text: reply.text },
        ]);
      } catch {
        setFailure(NETWORK_ERROR);
        setMessages((current) => [
          ...current,
          {
            id: nextId(idRef),
            role: "assistant",
            text: "Sorry — I hit a connection problem just now. Tap retry, or use the buttons below to carry on.",
          },
        ]);
      } finally {
        inFlight.current = false;
        setPending(false);
      }
    },
    [request],
  );

  const send = useCallback(
    (text: string) => {
      void run(text);
    },
    [run],
  );

  const retry = useCallback(() => {
    if (!lastUserText.current) return;
    const text = lastUserText.current;
    lastUserText.current = "";
    // Drop the failed user turn so a retry does not duplicate the message.
    setMessages((current) => {
      const index = current.map((item) => item.role).lastIndexOf("user");
      if (index === -1) return current;
      return [...current.slice(0, index), ...current.slice(index + 1)];
    });
    void run(text);
  }, [run]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    inFlight.current = false;
    lastUserText.current = "";
    idRef.current = 1;
    setConversation(initialConversationState);
    setMessages([{ id: "m0", role: "assistant", text: hamzaAIConfig.greeting.en }]);
    setFailure(null);
    setPending(false);
    setShowQuickActions(true);
    setShowLeadCard(false);
  }, []);

  const assistantState = useMemo<AssistantState>(() => {
    if (pending) return "processing";
    if (conversation.stage === "handoff") return "ready_to_contact";
    if (COLLECTING_STAGES.has(conversation.stage)) return "collecting_lead";
    return "idle";
  }, [conversation.stage, pending]);

  return {
    messages,
    conversation,
    assistantState,
    pending,
    failure,
    showQuickActions,
    showLeadCard,
    source,
    lead: conversation.lead,
    language: conversation.language,
    send,
    retry,
    reset,
  };
}