import { hamzaAIConfig, hamzaAISystemPrompt } from "@/config/hamzaAI";
import { sanitizeLead } from "./privacy";
import type {
  AssistantReply,
  ConversationState,
  Intent,
  Language,
  Lead,
  Stage,
} from "./types";

/**
 * LLM bridge.
 *
 * SERVER ONLY. This module reads API keys from environment variables and must
 * never be imported from a client component — only from the route handler.
 *
 * If no key is configured the route falls back to the local engine, and if a
 * live call fails the route falls back too, so the assistant is never left
 * broken.
 */

const REQUEST_TIMEOUT_MS = 15000;
const MAX_TOKENS = 500;

export type Provider = "anthropic" | "openai" | null;

export function getProvider(): Provider {
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  return null;
}

const VALID_STAGES: Stage[] = [
  "welcome", "project_type", "new_or_existing", "design",
  "timeline", "budget", "name", "contact", "handoff",
];

const VALID_INTENTS: Intent[] = [
  "hire", "services", "skills", "technologies", "projects", "pricing",
  "timeline", "ai_development", "web_development", "fullstack",
  "collaboration", "consultation", "contact", "general",
];

function briefOf(lead: Lead) {
  const entries = Object.entries(lead).filter(([, value]) => Boolean(value));
  if (!entries.length) return "No details collected yet.";
  return entries.map(([key, value]) => `- ${key}: ${value}`).join("\n");
}

function buildReplyInstruction(state: ConversationState): string {
  return `Current conversation stage: ${state.stage}
Detected intent: ${state.intent ?? "none"}
Detected language: ${state.language}
Lead details collected so far:
${briefOf(state.lead)}

Continue the conversation naturally from that stage. Ask at most one or two questions.

Reply with ONLY a JSON object, no markdown, in exactly this shape:
{"text":"...","stage":"one of ${VALID_STAGES.join("|")}","intent":"one of ${VALID_INTENTS.join("|")}","language":"en|ur","lead":{}}

Rules for the JSON:
- "text" is what the visitor reads. Concise, warm, professional, no markdown.
- "lead" must contain ONLY fields you actually learned from THIS message, merged with what was already known. Use keys: name, email, phone, projectType, projectDetail, objective, stack, design, timeline, budget, status.
- Never invent a name, email, phone number, budget or timeline the visitor did not give you.
- Never store passwords, payment details or ID numbers.
- When stage is "handoff", set "lead" to the complete brief and the text must hand the visitor to WhatsApp, phone or email. Never state that a meeting is booked.
- Use Roman Urdu only if the visitor is writing in Roman Urdu.`;
}

async function callAnthropic(system: string, user: string) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY as string,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
      max_tokens: MAX_TOKENS,
      system,
      messages: [{ role: "user", content: user }],
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`anthropic ${response.status}`);
  }

  const data = (await response.json()) as {
    content?: { type: string; text?: string }[];
  };

  return (data.content ?? [])
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("")
    .trim();
}

async function callOpenAI(system: string, user: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.OPENAI_API_KEY as string}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      max_tokens: MAX_TOKENS,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`openai ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  return (data.choices?.[0]?.message?.content ?? "").trim();
}

function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
}

/** Merges model-supplied lead fields over the known lead, then sanitises. */
function mergeLead(previous: Lead, incoming: unknown): Lead {
  const parsed =
    incoming && typeof incoming === "object" && !Array.isArray(incoming)
      ? (incoming as Record<string, unknown>)
      : {};
  return sanitizeLead({ ...previous, ...parsed });
}

export async function askModel(
  state: ConversationState,
  message: string,
): Promise<AssistantReply | null> {
  const provider = getProvider();
  if (!provider) return null;

  const system = `${hamzaAISystemPrompt}\n\nAssistant name: ${hamzaAIConfig.name}\n\n${buildReplyInstruction(state)}`;
  const user = `Visitor said: ${message}`;

  try {
    const raw =
      provider === "anthropic"
        ? await callAnthropic(system, user)
        : await callOpenAI(system, user);

    if (!raw) return null;

    const parsed = extractJson(raw);
    const fields =
      parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
    const text = typeof fields.text === "string" ? fields.text.trim() : "";
    if (!text) return null;

    const stage = VALID_STAGES.includes(fields.stage as Stage)
      ? (fields.stage as Stage)
      : state.stage;
    const intent = VALID_INTENTS.includes(fields.intent as Intent)
      ? (fields.intent as Intent)
      : state.intent;
    const language: Language =
      fields.language === "ur" || fields.language === "en"
        ? (fields.language as Language)
        : state.language;

    return {
      text,
      stage,
      lead: mergeLead(state.lead, fields.lead),
      intent,
      language,
      showLeadCard: stage === "handoff",
      showQuickActions: stage === "welcome",
      source: "llm",
    };
  } catch {
    return null;
  }
}