import { runLocalEngine } from "@/lib/ai/engine";
import { askModel, getProvider } from "@/lib/ai/llm";
import { sanitizeLead } from "@/lib/ai/privacy";
import {
  initialConversationState,
  type AssistantReply,
  type ConversationState,
  type Stage,
} from "@/lib/ai/types";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY = 12;

/** Fixed-window limiter keyed by client IP. Prevents duplicate/costly floods. */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

const VALID_STAGES: Stage[] = [
  "welcome", "project_type", "new_or_existing", "design",
  "timeline", "budget", "name", "contact", "handoff",
];

function safeState(input: unknown): ConversationState {
  const source = (input ?? {}) as Partial<ConversationState>;
  return {
    stage:
      typeof source.stage === "string" && VALID_STAGES.includes(source.stage as Stage)
        ? (source.stage as Stage)
        : initialConversationState.stage,
    lead: sanitizeLead(source.lead),
    intent: typeof source.intent === "string" ? source.intent : null,
    language: source.language === "ur" ? "ur" : "en",
    askedName: Boolean(source.askedName),
    askedContact: Boolean(source.askedContact),
  };
}

function fallbackReply(state: ConversationState, message: string): AssistantReply {
  return runLocalEngine(state, message);
}

export async function POST(request: Request) {
  if (rateLimited(clientKey(request))) {
    return Response.json(
      { error: "too_many_requests", message: "Please slow down for a moment." },
      { status: 429 },
    );
  }

  let body: { message?: unknown; state?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return Response.json(
      { error: "empty_message", message: "Please type a message." },
      { status: 400 },
    );
  }

  const state = safeState(body.state);

  // Defensive clamp: a long paste must not blow up the prompt.
  const trimmed = message.slice(0, MAX_MESSAGE_LENGTH);
  const stateForModel: ConversationState = { ...state, lead: sanitizeLead(state.lead) };

  try {
    if (getProvider()) {
      const reply = await askModel(stateForModel, trimmed);
      if (reply) {
        return Response.json(reply satisfies AssistantReply, {
          headers: { "cache-control": "no-store" },
        });
      }
    }
  } catch {
    // fall through to the local engine
  }

  return Response.json(fallbackReply(state, trimmed), {
    headers: { "cache-control": "no-store" },
  });
}

export async function GET() {
  return Response.json({
    ok: true,
    provider: getProvider(),
    maxHistory: MAX_HISTORY,
  });
}