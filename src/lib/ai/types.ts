export type Language = "en" | "ur";

export type Intent =
  | "hire"
  | "services"
  | "skills"
  | "technologies"
  | "projects"
  | "pricing"
  | "timeline"
  | "ai_development"
  | "web_development"
  | "fullstack"
  | "collaboration"
  | "consultation"
  | "contact"
  | "general";

/** Conversation stages drive the discovery and qualification sequence. */
export type Stage =
  | "welcome"
  | "project_type"
  | "new_or_existing"
  | "design"
  | "timeline"
  | "budget"
  | "name"
  | "contact"
  | "handoff";

export type LeadField =
  | "name"
  | "email"
  | "phone"
  | "projectType"
  | "projectDetail"
  | "objective"
  | "stack"
  | "design"
  | "timeline"
  | "budget"
  | "status";

export type Lead = Partial<Record<LeadField, string>>;

export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

/** Client -> server payload. */
export type ConversationState = {
  stage: Stage;
  lead: Lead;
  intent: Intent | null;
  language: Language;
  askedName: boolean;
  askedContact: boolean;
};

/** Server -> client reply. */
export type AssistantReply = {
  text: string;
  stage: Stage;
  lead: Lead;
  intent: Intent | null;
  language: Language;
  showLeadCard: boolean;
  showQuickActions: boolean;
  /** "llm" when a live model answered, "local" when the built-in engine answered. */
  source: "llm" | "local";
};

export const initialConversationState: ConversationState = {
  stage: "welcome",
  lead: {},
  intent: null,
  language: "en",
  askedName: false,
  askedContact: false,
};

/** Client-side assistant lifecycle. */
export type AssistantState =
  | "idle"
  | "listening"
  | "processing"
  | "speaking"
  | "collecting_lead"
  | "ready_to_contact"
  | "error";

export type VoiceState = "idle" | "listening" | "processing" | "error";