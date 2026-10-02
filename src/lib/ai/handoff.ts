import { assistantContact } from "@/config/hamzaAI";
import type { Language, Lead } from "./types";

const emptyToDash = (value?: string) => (value && value.trim() ? value.trim() : "—");

/**
 * Builds the plain-text project brief shown to the visitor.
 * Kept deliberately human-readable: no JSON, no internal metadata.
 */
export function formatLeadBrief(lead: Lead, language: Language = "en"): string {
  const lines: string[] = [];

  if (language === "ur") {
    lines.push("Assalam-o-Alaikum Hamza,", "");
    lines.push("Main aap ke portfolio se aaya hoon.");
    if (lead.name) lines.push(`Mera naam ${lead.name} hai.`);
    lines.push("");
  } else {
    lines.push("Hi Hamza,", "");
    lines.push("I came through your portfolio.");
    if (lead.name) lines.push(`My name is ${lead.name}.`);
    lines.push("");
  }

  lines.push(
    language === "ur" ? "Mujhe yeh project discuss karna hai:" : "I'd like to discuss this project:",
  );
  lines.push("");
  lines.push(
    `${language === "ur" ? "Project" : "Project"}: ${emptyToDash(lead.projectType || lead.projectDetail)}`,
  );

  if (lead.projectDetail) {
    lines.push(
      `${language === "ur" ? "Requirements" : "Requirements"}: ${lead.projectDetail}`,
    );
  }
  if (lead.objective) {
    lines.push(`${language === "ur" ? "Main objective" : "Main objective"}: ${lead.objective}`);
  }
  if (lead.status) {
    lines.push(
      `${language === "ur" ? "Status" : "Project status"}: ${lead.status}`,
    );
  }
  if (lead.stack) {
    lines.push(`${language === "ur" ? "Technologies" : "Technologies"}: ${lead.stack}`);
  }
  if (lead.timeline) {
    lines.push(`${language === "ur" ? "Timeline" : "Timeline"}: ${lead.timeline}`);
  }
  if (lead.budget) {
    lines.push(`${language === "ur" ? "Budget" : "Budget"}: ${lead.budget}`);
  }

  lines.push("");
  if (lead.email) lines.push(`Email: ${lead.email}`);
  if (lead.phone) lines.push(`WhatsApp: ${lead.phone}`);

  lines.push("");
  lines.push(
    language === "ur"
      ? "Kripya mujhe project discuss karne ke liye suitable time batayein. Shukriya!"
      : "Please let me know a suitable time to discuss the project. Thank you!",
  );

  return lines.join("\n");
}

/** Pre-filled WhatsApp handoff. */
export function buildWhatsAppUrl(lead: Lead, language: Language = "en"): string {
  const message = formatLeadBrief(lead, language);
  return `https://wa.me/${assistantContact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Pre-filled email handoff. */
export function buildEmailUrl(lead: Lead, language: Language = "en"): string {
  const subject =
    language === "ur"
      ? `Project inquiry${lead.name ? ` — ${lead.name}` : ""}`
      : `Project inquiry${lead.name ? ` — ${lead.name}` : ""}`;

  return `${assistantContact.emailHref}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(formatLeadBrief(lead, language))}`;
}

export function buildTelUrl(): string {
  return assistantContact.phoneHref;
}

export type LeadRow = { label: string; value: string };

/** Structured rows for the premium lead card. */
export function buildLeadRows(lead: Lead, language: Language = "en"): LeadRow[] {
  const ur = language === "ur";
  const rows: LeadRow[] = [];

  if (lead.name) rows.push({ label: ur ? "Naam" : "Name", value: lead.name });

  const project = lead.projectType || lead.projectDetail;
  if (project) rows.push({ label: ur ? "Project" : "Project", value: project });

  if (lead.objective) {
    rows.push({ label: ur ? "Objective" : "Objective", value: lead.objective });
  }
  if (lead.stack) rows.push({ label: ur ? "Technologies" : "Technologies", value: lead.stack });
  if (lead.status) rows.push({ label: ur ? "Status" : "Status", value: lead.status });
  if (lead.timeline) rows.push({ label: ur ? "Timeline" : "Timeline", value: lead.timeline });
  if (lead.budget) rows.push({ label: ur ? "Budget" : "Budget", value: lead.budget });

  if (lead.email) rows.push({ label: ur ? "Email" : "Email", value: lead.email });
  if (lead.phone) rows.push({ label: ur ? "WhatsApp" : "WhatsApp", value: lead.phone });

  return rows;
}