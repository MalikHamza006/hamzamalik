import type { Lead } from "./types";

/**
 * Privacy helpers shared by the LLM path and the local engine.
 * Keeps a single definition of "what must never be stored or echoed back".
 */

export function truncate(value: string, max = 260) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}\u2026`;
}

const SENSITIVE_RE =
  /\b(pass(word|code)?|passcode|cnic|nic|ssn|credit card|debit card|card number|cvv|pin code|otp|bank account|iban)\b/i;

/** Pakistani national identity number, with or without dashes. */
const CNIC_RE = /\b\d{5}-?\d{7}-?\d\b/;

/** 13-19 digits with optional spaces/dashes — a card-like number. */
const CARD_RE = /(?:\d[ -]?){13,19}/;

export function looksSensitive(text: string) {
  return SENSITIVE_RE.test(text) || CNIC_RE.test(text) || CARD_RE.test(text);
}

/** Never persist anything that resembles credentials or financial data. */
export function sanitize(value: string | undefined, max = 200): string | undefined {
  if (!value) return undefined;
  if (looksSensitive(value)) return undefined;
  return truncate(value, max);
}

const LEAD_FIELDS = [
  "name", "email", "phone", "projectType", "projectDetail",
  "objective", "stack", "design", "timeline", "budget", "status",
] as const;

/** Applies sanitising to every field of a lead, dropping unsafe values. */
export function sanitizeLead(lead: unknown): Lead {
  const source = (lead ?? {}) as Record<string, unknown>;
  const result: Lead = {};

  for (const field of LEAD_FIELDS) {
    const value = source[field];
    if (typeof value !== "string") continue;
    const clean = sanitize(value, field === "projectDetail" ? 400 : 200);
    if (clean) result[field] = clean;
  }

  return result;
}