/**
 * Local conversation engine.
 *
 * Runs entirely on the server with no external API, so the assistant stays
 * fully usable when no LLM key is configured. It implements the full client
 * journey: intent detection, project discovery, lead qualification, brief
 * summary and contact handoff — in English and Roman Urdu.
 */

import { assistantContact, hamzaAIConfig } from "@/config/hamzaAI";
import { projects } from "@/lib/content";
import { looksSensitive, sanitize } from "./privacy";
import type {
  AssistantReply,
  ConversationState,
  Intent,
  Language,
  Lead,
  Stage,
} from "./types";

/* ------------------------------------------------------------------ */
/* Text helpers                                                        */
/* ------------------------------------------------------------------ */

function normalize(text: string) {
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

const ROMAN_URDU_MARKERS = [
  "hai", "hain", "ka", "ki", "ke", "kya", "main", "mujhe", "chahiye", "karwana",
  "bana", "banana", "banayi", "acha", "shukriya", "kaise", "kitna", "kitni",
  "paisay", "paisay", "kam", "zaroorat", "waqt", "namaste", "assalam", "sir",
  "bhai", "apna", "mera", "meri", "tum", "aap", "karo", "karna", "hona",
  "chalna", "chalta", "theek", "wahin", "bilkul", "sirf", "pehle", "baad",
  "abhi", "jaldi", "foran", "acha", "maloom", "pata", "kharcha", "rate",
];

const ENGLISH_MARKERS = [
  "the", "and", "with", "for", "this", "that", "have", "need", "want", "build",
  "website", "project", "please", "can", "you", "what", "your", "about",
];

function countHits(text: string, markers: string[]) {
  let count = 0;
  for (const marker of markers) {
    if (new RegExp(`\\b${marker}\\b`, "i").test(text)) count += 1;
  }
  return count;
}

function detectLanguage(text: string, previous: Language): Language {
  const ur = countHits(text, ROMAN_URDU_MARKERS);
  const en = countHits(text, ENGLISH_MARKERS);
  if (ur > 0 && ur * 2 >= en) return "ur";
  if (en > 0) return "en";
  return previous;
}

/* ------------------------------------------------------------------ */
/* Intent detection                                                    */
/* ------------------------------------------------------------------ */
/* Privacy sanitising                                                  */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Slot extraction                                                     */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_SEQ_RE = /\+?\d[\d\s().-]{8,17}\d/g;
const NAME_PREFIX_RE =
  /^(?:my name is|i am|i'm|this is|it'?s|myself|naam|mera naam)\s+/i;

function extractEmail(text: string) {
  const match = text.match(EMAIL_RE);
  return match ? match[0] : undefined;
}

function extractPhone(text: string) {
  const matches = text.match(PHONE_SEQ_RE) ?? [];
  for (const raw of matches) {
    const digits = raw.replace(/\D/g, "");
    if (digits.length >= 10 && digits.length <= 15) return raw.trim();
  }
  return undefined;
}

function extractName(text: string) {
  const stripped = text.replace(NAME_PREFIX_RE, "").trim();
  if (!stripped) return undefined;
  if (stripped.includes("@") || /\d/.test(stripped)) return undefined;
  const words = stripped.split(" ").filter(Boolean);
  if (words.length < 1 || words.length > 5) return undefined;
  if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(stripped)) return undefined;
  const declined = /\b(no|nope|nahi|nai|skip|skipping|private|personal|not now|baad me|maybe)\b/i;
  if (declined.test(stripped)) return undefined;
  return stripped;
}

const DURATION_RE =
  /(\d+\s*(?:business\s+)?(?:day|days|week|weeks|month|months|year|years))/i;
const URGENT_RE =
  /\b(urgent|asap|as soon as possible|immediately|right away|quickly|tomorrow|next week|this week)\b/i;
const URGENT_UR_RE =
  /(foran|jaldi|foran\s+chahiye|abhi\s+chahiye|iss\s+week|agle\s+hafte|iss\s+mahine|agle\s+mahine)/i;

function extractTimeline(text: string) {
  const duration = text.match(DURATION_RE);
  if (duration) return duration[1].replace(/\s+/g, " ");
  if (URGENT_RE.test(text) || URGENT_UR_RE.test(text)) return "As soon as possible";
  if (/\b(next month|end of month|end of year|by \w+ \d{1,2})\b/i.test(text)) {
    const match = text.match(/\b(next month|end of month|end of year|by \w+ \d{1,2})\b/i);
    if (match) return match[1];
  }
  return undefined;
}

const BUDGET_UNITS = "thousand|lacs?|lakhs?|million|k\\b|m\\b";
const BUDGET_AMOUNT_RE = new RegExp(
  `((?:\\d{1,3}(?:,\\d{2,3})+)|\\d+(?:\\.\\d+)?)\\s*(${BUDGET_UNITS})?`,
  "i",
);
const BUDGET_KEYWORD_RE =
  /\b(budget|pkr|rs\.?|rupees?|paisay|paison|kharcha|usd|usd\$|\$|dollars?)\b/i;
const BUDGET_DECLINE_RE =
  /\b(no|nope|nahi|nai|na|not sure|unsure|prefer not|rather not|don'?t want|wouldn'?t want|would rather not|skip|private|no thanks|not at the moment|batana nahi|nahi batana)\b/i;

function extractBudget(text: string, askingBudget: boolean) {
  if (BUDGET_DECLINE_RE.test(text) && !/\d/.test(text)) {
    return { declined: true } as const;
  }
  if (!askingBudget && !BUDGET_KEYWORD_RE.test(text)) return undefined;

  const match = text.match(BUDGET_AMOUNT_RE);
  if (!match) return undefined;

  const amount = match[1];
  const unit = match[2]?.toLowerCase().trim();
  const hasCurrency = BUDGET_KEYWORD_RE.test(text);
  if (!unit && !hasCurrency) return undefined;

  let normalizedUnit = "";
  if (unit === "k" || unit === "thousand") normalizedUnit = "k";
  else if (unit && unit.startsWith("l")) normalizedUnit = " lakh";
  else if (unit === "m" || unit === "million") normalizedUnit = "M";

  const currency = /\b(usd|usd\$|\$|dollars?)\b/i.test(text)
    ? "USD"
    : /\b(pkr|rs\.?|rupees?|paisay|paison)\b/i.test(text)
      ? "PKR"
      : "";

  return { value: `${currency ? `${currency} ` : ""}${amount}${normalizedUnit}` };
}

type ProjectTypeRule = { id: string; label: string; pattern: RegExp };

const PROJECT_TYPE_RULES: ProjectTypeRule[] = [
  { id: "ecommerce", label: "E-commerce store", pattern: /e-?commerce|online (store|shop)|web ?store|shopping (site|website|cart)|woocommerce|shopify|magento|basket|cart\b/i },
  { id: "mobile", label: "Mobile application", pattern: /mobile app|android|\bios\b|flutter|react native|phone app|app for (android|ios)/i },
  { id: "ai", label: "AI-powered application", pattern: /\bai\b|artificial intelligence|chat ?bot|llm|\bgpt\b|openai|claude|gemini|prompt|automat(e|ed|es|ion|ing)|machine learning|\bai-/i },
  { id: "dashboard", label: "Dashboard / admin panel", pattern: /dashboard|admin panel|crm|erp|reporting|analytics|bi\b|business intelligence/i },
  { id: "saas", label: "SaaS / web application", pattern: /saas|web ?app|web application|portal|platform|booking system|management system|internal tool/i },
  { id: "redesign", label: "Existing product redesign", pattern: /redesign|rebuild|revamp|moderni[sz]e|migrate|migration|existing (website|site|app|application|system)|purana/i },
  { id: "portfolio", label: "Portfolio site", pattern: /portfolio/i },
  { id: "landing", label: "Landing page", pattern: /landing page|campaign page|coming soon page/i },
  { id: "api", label: "API / backend service", pattern: /\bapi\b|backend|back-end|server-?side|web ?service|integration|cron|queue/i },
  { id: "cms", label: "Blog / CMS", pattern: /\bblog\b|\bcms\b|content management|wordpress/i },
  { id: "website", label: "Business website", pattern: /website|web ?site|webpage|web page|company site|business site|brochure/i },
];

const PROJECT_TYPE_PATTERN: Record<string, RegExp> = Object.fromEntries(
  PROJECT_TYPE_RULES.map((rule) => [rule.id, rule.pattern]),
);

function extractProjectType(text: string) {
  const isAi = PROJECT_TYPE_PATTERN.ai.test(text);
  const isDashboard = PROJECT_TYPE_PATTERN.dashboard.test(text);

  if (isAi && isDashboard) return "AI-powered dashboard / admin panel";

  for (const rule of PROJECT_TYPE_RULES) {
    if (rule.pattern.test(text)) return rule.label;
  }
  return undefined;
}

const KNOWN_STACK = [
  "React", "Next.js", "Django", "Laravel", "Node.js", "TypeScript", "JavaScript",
  "Tailwind CSS", "Bootstrap", "HTML", "CSS", "Python", "PostgreSQL", "MySQL",
  "Supabase", "MongoDB", "Firebase", "Shopify", "WordPress",
];

function extractStack(text: string) {
  const found = KNOWN_STACK.filter((tech) =>
    new RegExp(`\\b${tech.replace(/[.\s]/g, "\\$&")}\\b`, "i").test(text),
  );
  return found.length ? found.join(", ") : undefined;
}

const PRIVACY_WARNING = {
  en: "For your security, please don't send passwords, payment details or ID numbers here. I only need the project details, so I've left that out of the brief.",
  ur: "Apni security ke liye kripya yahan password, payment details ya ID number na bhejein. Mujhe sirf project details chahiye, is liye main ne usay brief mein shamil nahi kiya.",
} as const;

function extractStatus(text: string) {
  if (/\b(new|brand new|from scratch|starting fresh|launching|greenfield|naya|pehla)\b/i.test(text)) {
    return "New project";
  }
  if (/\b(existing|already|current|improv\w+|redesign|rebuild|migrat\w+|old|purana|ab wala)\b/i.test(text)) {
    return "Existing product being improved";
  }
  return undefined;
}

function extractDesign(text: string) {
  if (/\b(we have|i have|already (have|got)|ready|mock-?up|figma|branding|logo|designer ne)\b/i.test(text)) {
    return "Client has design / branding";
  }
  if (/\b(no|need|needed|include|required|from scratch|also|chahiye|design bhi|bana)\b/i.test(text)) {
    return "Design included in scope";
  }
  return undefined;
}

/* ------------------------------------------------------------------ */
/* Intent detection                                                    */
/* ------------------------------------------------------------------ */

const INTENT_RULES: { intent: Intent; weight: number; pattern: RegExp }[] = [
  { intent: "pricing", weight: 4, pattern: /\b(pricing|price|prices|cost|costs|rate|rates|charges?|budget|kitna|kitne|kya kharcha|kharcha|paisay|paison)\b/i },
  { intent: "timeline", weight: 4, pattern: /\b(how long|timeline|time ?frame|deadline|delivery|kab tak|kitna waqt|kitna time)\b/i },
  { intent: "contact", weight: 4, pattern: /\b(contact|reach you|phone number|email address|whatsapp|number do|rasta|rabta)\b/i },
  { intent: "hire", weight: 5, pattern: /\b(i need (a|an|someone|help)|i want to hire|can you build|can you make|i need a developer|i need someone|we need (a|an|someone)|looking for (a|an) (developer|engineer|freelancer|programmer)|i have a project|can we work together|are you available|available for (work|projects|freelance|new)|i want to discuss my project|mujhe (developer|engineer|chahiye|banwana)|chahiye|banwana (hai|h|krna)|kisi ko chahiye|hiring|karo mujhe)\b/i },
  { intent: "consultation", weight: 3, pattern: /\b(consultation|consult|meeting|call|schedule|discuss|talk|session|advice|guidance|baat karein|mashwara)\b/i },
  { intent: "collaboration", weight: 3, pattern: /\b(collaborat\w+|work together|partner|long[- ]term|retainer|partnership|joint)\b/i },
  { intent: "ai_development", weight: 4, pattern: /\b(ai|artificial intelligence|chat ?bot|llm|gpt|openai|prompt|automat\w+|machine learning|agent)\b/i },
  { intent: "projects", weight: 3, pattern: /\b(projects?|portfolio|case stud(y|ies)|work (you|he) (have|do)|kya kaam)\b/i },
  { intent: "skills", weight: 3, pattern: /\b(skills?|what can (you|he) do|abilities|expertise|strong in|skill set|kya kar sakt)\b/i },
  { intent: "technologies", weight: 3, pattern: /\b(technolog\w+|tech stack|stack|framework|languages?|react|next\.?js|django|laravel|node|tailwind|typescript)\b/i },
  { intent: "services", weight: 3, pattern: /\b(services?|offer|provide|kya (services|karte)|kya offer)\b/i },
  { intent: "web_development", weight: 3, pattern: /\b(website|web ?site|landing page|e-?commerce|online store|web develop\w+|frontend)\b/i },
  { intent: "fullstack", weight: 3, pattern: /\b(full ?stack|database|backend|api|admin panel|dashboard)\b/i },
];

function detectIntent(text: string): Intent | null {
  let best: Intent | null = null;
  let bestScore = 0;

  for (const rule of INTENT_RULES) {
    if (rule.pattern.test(text)) {
      if (rule.weight > bestScore) {
        bestScore = rule.weight;
        best = rule.intent;
      }
    }
  }
  return best;
}

const GREETING_RE =
  /^(hi|hey|hello|yo|hiya|salaam|salam|assalam|assalam-o-?alaikum|assalam alaikum|good (morning|evening|afternoon)|how are you)\b/i;
const RESET_RE =
  /\b(start over|restart|reset|start again|new chat|do over|phir se (shuru|start)|dobara)\b/i;
const QUESTION_RE = /\?\s*$/;

/* ------------------------------------------------------------------ */
/* Question answering                                                  */
/* ------------------------------------------------------------------ */

const projectTitles = projects.map((project) => project.title).join(", ");

function pick(language: Language, en: string, ur: string) {
  return language === "ur" ? ur : en;
}

function answerIntent(intent: Intent, language: Language): string {
  switch (intent) {
    case "pricing":
      return pick(
        language,
        "Project cost depends on the scope, features, design requirements and timeline, so I can't give a fixed number here. If you tell me a little about the project, I can organise the requirements and connect you with Hamza for an accurate discussion.\n\nWhat are you looking to build?",
        "Project ka cost uske scope, features, design requirements aur timeline par depend karta hai, is liye main yahan fixed amount nahi de sakta. Agar aap thori detail batayen to main requirements organise karke aap ko Hamza se accurate discussion ke liye connect kar sakta hoon.\n\nAap banana kya chahte hain?",
      );

    case "timeline":
      return pick(
        language,
        "That depends on the project's scope and complexity. If you share the main features and your target launch date, I'll include that in the project brief for Hamza.\n\nRoughly when would you like to start?",
        "Ye project ke scope aur complexity par depend karta hai. Agar aap main features aur target launch date share karein to main usay Hamza ke project brief mein shamil kar dunga.\n\nAap approximately kab start karna chahte hain?",
      );

    case "technologies":
    case "skills":
      return pick(
        language,
        "His stack includes React, Next.js, TypeScript, Tailwind CSS, HTML, CSS and JavaScript on the frontend, Django, Laravel and Node.js on the backend, plus AI engineering, AI prompt engineering and AI automation.\n\nAre you looking for something specific on any of those?",
        "Is ka stack frontend par React, Next.js, TypeScript, Tailwind CSS, HTML, CSS aur JavaScript rakhta hai, backend par Django, Laravel aur Node.js, sath hi AI engineering, AI prompt engineering aur AI automation bhi.\n\nKya aap in mein se kisi cheez ke baare mein poochhna chahte hain?",
      );

    case "services":
      return pick(
        language,
        "Hamza covers four main areas: web development (business sites, landing pages, e-commerce), web applications and dashboards, full-stack work with React or Next.js alongside Django, Laravel or Node.js, and AI development including assistants, integrations, automation and prompt engineering.\n\nWhich of those is closest to what you need?",
        "Hamza chaar main areas cover karta hai: web development (business sites, landing pages, e-commerce), web applications aur dashboards, React ya Next.js ke saath Django, Laravel ya Node.js par full-stack kaam, aur AI development jis mein assistants, integrations, automation aur prompt engineering shamil hain.\n\nIn mein se kaun sa aap ki zaroorat ke sab se qareeb hai?",
      );

    case "ai_development":
      return pick(
        language,
        "Yes, AI is one of his main focus areas. He builds AI assistants, integrates language models into existing products, designs automation workflows, and does prompt engineering for production use.\n\nWhat workflow or problem do you have in mind?",
        "Ji haan, AI un ke main focus areas mein se ek hai. Wo AI assistants banate hain, existing products mein language models integrate karte hain, automation workflows design karte hain, aur production ke liye prompt engineering karte hain.\n\nAap ka koi specific workflow ya problem hai?",
      );

    case "web_development":
      return pick(
        language,
        "He builds business websites, portfolio sites, landing pages and e-commerce stores using React, Next.js and Tailwind CSS.\n\nWhat kind of site are you looking for?",
        "Wo React, Next.js aur Tailwind CSS ke istemaal se business websites, portfolio sites, landing pages aur e-commerce stores banate hain.\n\nAap ko kis tarah ki site chahiye?",
      );

    case "fullstack":
      return pick(
        language,
        "He handles both sides — React, Next.js and Tailwind CSS on the frontend, Django, Laravel or Node.js on the backend, including API and database work.\n\nWhat are you building?",
        "Wo dono taraf handle karte hain — frontend par React, Next.js aur Tailwind CSS, backend par Django, Laravel ya Node.js, aur API aur database ka kaam bhi.\n\nAap kya bana rahe hain?",
      );

    case "projects":
      return pick(
        language,
        `The portfolio covers ${projectTitles}.\n\nWould you like me to walk you through any of them?`,
        `Portfolio mein yeh projects hain: ${projectTitles}.\n\nKya aap chahte hain ke main in mein se koi detail mein bataun?`,
      );

    case "collaboration":
    case "consultation":
      return pick(
        language,
        `He's open to new projects, including a short scoping conversation before anything is decided. ${assistantContact.contactLine}\n\nTell me what you're hoping to build and I'll put together a brief for him.`,
        `Wo naye projects ke liye available hain, aur koi bhi faisla karne se pehle aik chhoti scoping conversation bhi ho sakti hai. ${assistantContact.contactLine}\n\nBatayein aap kya banana chahte hain, main un ke liye brief tayyar kar dunga.`,
      );

    case "contact":
      return pick(
        language,
        `You can reach him on ${assistantContact.phone} or ${assistantContact.email}, or message him on WhatsApp.\n\nWould you like to tell me about your project first so I can put together a brief?`,
        `Aap un se ${assistantContact.phone} par ya ${assistantContact.email} par rabta kar sakte hain, ya WhatsApp par message kar sakte hain.\n\nKya aap pehle apna project batana chahenge taake main brief tayyar kar sakun?`,
      );

    case "hire":
      return pick(
        language,
        "Happy to help with that. What are you looking to build?",
        "Zaroor, main madad karta hoon. Aap banana kya chahte hain?",
      );

    default:
      return pick(
        language,
        "I can help with that. I can explain Hamza's skills and services, walk you through his projects, or help you put together a project brief.\n\nWhat would you like to know?",
        "Main is mein madad kar sakta hoon. Main Hamza ki skills aur services samjha sakta hoon, un ke projects dikha sakta hoon, ya aap ka project brief tayyar karne mein madad kar sakta hoon.\n\nAap kya jaanna chahte hain?",
      );
  }
}

/* ------------------------------------------------------------------ */
/* Stage progression                                                   */
/* ------------------------------------------------------------------ */

const STAGE_ORDER: Stage[] = [
  "project_type",
  "new_or_existing",
  "design",
  "timeline",
  "budget",
  "name",
  "contact",
];

function questionFor(stage: Stage, language: Language, name?: string) {
  const d = hamzaAIConfig.discovery;
  switch (stage) {
    case "project_type":
      return d.projectType[language];
    case "new_or_existing":
      return d.newOrExisting[language];
    case "design":
      return d.design[language];
    case "timeline":
      return d.timeline[language];
    case "budget":
      return d.budget[language];
    case "name":
      return name
        ? pick(
            language,
            `Thanks, ${name}. What's the best email or WhatsApp number for the project?`,
            `Shukriya, ${name}. Project ke liye aap ka best email ya WhatsApp number kya hai?`,
          )
        : d.name[language];
    case "contact":
      return name
        ? pick(
            language,
            `Thanks, ${name}. What's the best email or WhatsApp number so Hamza can reach you?`,
            `Shukriya, ${name}. Hamza aap se rabta kar sake, aap ka best email ya WhatsApp number kya hai?`,
          )
        : d.contact[language];
    default:
      return "";
  }
}

function stageSatisfied(stage: Stage, lead: Lead) {
  switch (stage) {
    case "project_type":
      return Boolean(lead.projectType || lead.projectDetail);
    case "new_or_existing":
      return Boolean(lead.status);
    case "design":
      return Boolean(lead.design);
    case "timeline":
      return Boolean(lead.timeline);
    case "budget":
      return Boolean(lead.budget);
    case "name":
      return Boolean(lead.name);
    case "contact":
      return Boolean(lead.email || lead.phone);
    default:
      return true;
  }
}

function nextStage(lead: Lead): Stage {
  for (const stage of STAGE_ORDER) {
    if (!stageSatisfied(stage, lead)) return stage;
  }
  return "handoff";
}

function hasRequiredLead(lead: Lead) {
  return Boolean(
    lead.name &&
      (lead.email || lead.phone) &&
      (lead.projectType || lead.projectDetail),
  );
}

/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */

export function runLocalEngine(
  previous: ConversationState,
  rawMessage: string,
): AssistantReply {
  const message = normalize(rawMessage);
  const language = detectLanguage(message, previous.language);
  const lead: Lead = { ...previous.lead };
  const currentStage = previous.stage;

  const base = {
    stage: currentStage,
    lead,
    intent: previous.intent,
    language,
    showLeadCard: false,
    showQuickActions: currentStage === "welcome",
    source: "local" as const,
  };

  if (!message) {
    return {
      ...base,
      text: pick(
        language,
        "I didn't catch that. Could you type what you're looking to build?",
        "Mera matlab samajh nahi aaya. Aap likh kar bata sakte hain ke aap kya banana chahte hain?",
      ),
    };
  }

  /* --- privacy gate: never extract lead fields from sensitive input --- */
  const sensitive = looksSensitive(message);
  const projectType = sensitive ? undefined : extractProjectType(message);

  /* --- universal slot extraction, so nothing is ever lost --- */
  if (!sensitive) {
    const email = extractEmail(message);
    const phone = extractPhone(message);
    const timeline = extractTimeline(message);
    const stack = extractStack(message);

    if (email) lead.email = sanitize(email);
    if (phone) lead.phone = sanitize(phone);
    if (stack && !lead.stack) lead.stack = stack;

    if (currentStage === "name") {
      const name = extractName(message);
      if (name) lead.name = name;
    }

    if (currentStage === "new_or_existing") {
      lead.status = extractStatus(message) ?? sanitize(message);
    }

    if (currentStage === "design") {
      lead.design = extractDesign(message) ?? sanitize(message);
    }

    if (currentStage === "timeline") {
      lead.timeline = sanitize(timeline) ?? sanitize(message);
    }

    if (currentStage === "budget") {
      const budget = extractBudget(message, true);
      if (budget && "declined" in budget) lead.budget = "Not shared";
      else if (budget && "value" in budget) lead.budget = budget.value;
    }

    if (timeline && !lead.timeline && currentStage !== "timeline") {
      lead.timeline = sanitize(timeline);
    }

    const budgetAnywhere = extractBudget(message, false);
    if (budgetAnywhere && "value" in budgetAnywhere && !lead.budget) {
      lead.budget = budgetAnywhere.value;
    }

    if (projectType && !lead.projectType) lead.projectType = projectType;
  }

  /* --- resets and small talk --- */
  if (RESET_RE.test(message)) {
    return {
      ...base,
      stage: "welcome",
      lead: {},
      intent: null,
      showLeadCard: false,
      showQuickActions: true,
      text: pick(
        language,
        hamzaAIConfig.greeting.en,
        hamzaAIConfig.greeting.ur,
      ),
    };
  }

  const intent = detectIntent(message) ?? previous.intent;

  /* --- after the brief is complete --- */
  if (currentStage === "handoff") {
    const questionish = QUESTION_RE.test(message);
    if (questionish) {
      return {
        ...base,
        intent,
        showLeadCard: true,
        text: `${answerIntent(intent ?? "general", language)}\n\n${
          hamzaAIConfig.handoff.whatsappFallback
        }`,
      };
    }
    const closing = hamzaAIConfig.handoff.closing[language].replace(
      "{{name}}",
      lead.name ?? "",
    );
    return {
      ...base,
      intent,
      showLeadCard: true,
      text: `${closing}\n\n${hamzaAIConfig.handoff.whatsappFallback}`,
    };
  }

  /* --- welcome stage --- */
  if (currentStage === "welcome") {
    const wantsProject =
      intent === "hire" ||
      intent === "consultation" ||
      intent === "collaboration" ||
      Boolean(projectType);

    if (wantsProject) {
      if (projectType) lead.projectType = projectType;
      const detail = sanitize(message);
      if (detail && !lead.projectDetail) lead.projectDetail = detail;

      if (sensitive) {
        return {
          ...base,
          lead,
          intent,
          stage: "project_type",
          showQuickActions: false,
          text: pick(
            language,
            "For your security, please don't send passwords, payment details or ID numbers here — I only need the project details.\n\nWhat are you looking to build?",
            "Apni security ke liye kripya yahan password, payment details ya ID number na bhejein — mujhe sirf project details chahiye.\n\nAap kya banana chahte hain?",
          ),
        };
      }

      const stage = nextStage(lead);
      return {
        ...base,
        lead,
        intent,
        stage,
        showQuickActions: false,
        text: questionFor(stage, language, lead.name),
      };
    }

    if (sensitive) {
      return {
        ...base,
        lead,
        intent,
        stage: "project_type",
        showQuickActions: false,
        text: `${PRIVACY_WARNING[language]}\n\n${questionFor("project_type", language)}`,
      };
    }

    if (GREETING_RE.test(message) && message.split(" ").length <= 5) {
      return {
        ...base,
        intent,
        stage: "welcome",
        showQuickActions: true,
        text: pick(language, hamzaAIConfig.greeting.en, hamzaAIConfig.greeting.ur),
      };
    }

    const answered: Intent = intent ?? "general";
    const reply = answerIntent(answered, language);
    const hint = pick(
      language,
      "\n\nIf you have a project in mind, just tell me about it and I'll put together a brief for Hamza.",
      "\n\nAgar aap ka koi project hai to sirf batayein, main Hamza ke liye brief tayyar kar dunga.",
    );
    return { ...base, intent: answered, stage: "welcome", showQuickActions: true, text: `${reply}${hint}` };
  }

  /* --- mid-discovery: handle a question without losing the flow --- */
  const currentSlotFilled = stageSatisfied(currentStage, lead);
  const askedQuestion =
    QUESTION_RE.test(message) &&
    (intent === "pricing" || intent === "timeline" || intent === "contact");

  if (askedQuestion && !currentSlotFilled) {
    return {
      ...base,
      lead,
      intent,
      text: `${answerIntent(intent as Intent, language)}\n\n${questionFor(currentStage, language, lead.name)}`,
    };
  }

  /* --- capture free-form project description --- */
  if (!lead.projectDetail && currentStage === "project_type") {
    const detail = sanitize(message);
    if (detail && message.split(" ").length >= 3) lead.projectDetail = detail;
  }

  /* --- advance --- */
  let stage = nextStage(lead);

  /* if the visitor front-loaded everything, jump straight to the brief */
  if (stage === "handoff" && hasRequiredLead(lead)) {
    const closing = hamzaAIConfig.handoff.closing[language].replace(
      "{{name}}",
      lead.name ?? "",
    );
    return {
      ...base,
      lead,
      intent,
      stage: "handoff",
      showLeadCard: true,
      text: `${closing}\n\n${hamzaAIConfig.handoff.whatsappFallback}`,
    };
  }

  if (stage === "handoff") {
    stage = STAGE_ORDER.find((item) => !stageSatisfied(item, lead)) ?? "name";
  }

  const question = questionFor(stage, language, lead.name);
  return {
    ...base,
    lead,
    intent,
    stage,
    showQuickActions: false,
    text: sensitive ? `${PRIVACY_WARNING[language]}\n\n${question}` : question,
  };
}

export { hasRequiredLead, nextStage, detectIntent, detectLanguage };