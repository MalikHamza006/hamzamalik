export const profile = {
  name: "Hamza Malik",
  monogram: "HM",
  roles: [
    "Software Engineer",
    "Full Stack Developer",
    "AI Engineer",
    "AI Prompt Engineer",
  ],
  summary:
    "Software Engineer building scalable web applications and intelligent AI systems across modern full-stack architectures.",
  phone: "+92 316 0442304",
  phoneHref: "tel:+923160442304",
  email: "hamzamalik789890@gmail.com",
  emailHref: "mailto:hamzamalik789890@gmail.com",
  whatsappHref: "https://wa.me/923160442304",
  year: "2026",
} as const;

export const navLinks = [
  { label: "Work", href: "#projects" },
  { label: "Expertise", href: "#expertise" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "AI Systems", href: "#ai-systems" },
  { label: "Contact", href: "#contact" },
] as const;

export type TechItem = {
  id: string;
  label: string;
};

export const technologies: TechItem[] = [
  { id: "react", label: "React" },
  { id: "next", label: "Next.js" },
  { id: "django", label: "Django" },
  { id: "laravel", label: "Laravel" },
  { id: "node", label: "Node.js" },
  { id: "typescript", label: "TypeScript" },
  { id: "javascript", label: "JavaScript" },
  { id: "tailwind", label: "Tailwind CSS" },
  { id: "bootstrap", label: "Bootstrap" },
  { id: "ai", label: "AI Engineering" },
];

export type ProjectVisualVariant =
  | "intelligence"
  | "operations"
  | "automation"
  | "platform"
  | "analytics"
  | "web";

export type Project = {
  title: string;
  category: string;
  headline: string;
  description: string;
  problem: string;
  solution: string;
  stack: string[];
  variant: ProjectVisualVariant;
  featured?: boolean;
  summaryLabel: string;
};

export const projects: Project[] = [
  {
    title: "AI Business Intelligence & Signal Engine",
    category: "AI Engineering",
    headline: "Transforming raw operational metrics into actionable AI-driven intelligence.",
    summaryLabel: "Real-time AI telemetry",
    description:
      "A high-throughput intelligence platform that ingests unstructured operational data, normalizes telemetry across services, and runs prompt-engineered evaluation pipelines for executive decision-making.",
    problem: "Operational data was fragmented across disparate silos with high latency in identifying anomalies.",
    solution: "Built an event-driven ingestion pipeline with Django and Next.js, integrating structured LLM evaluation prompts to synthesize instant operational summaries.",
    stack: ["React", "Next.js", "Django", "Python", "Tailwind CSS"],
    variant: "intelligence",
    featured: true,
  },
  {
    title: "Enterprise Operations & Workflow Orchestrator",
    category: "Full Stack",
    headline: "Unified workspace management for distributed operational teams.",
    summaryLabel: "Multi-tenant architecture",
    description:
      "A complete enterprise resource management system combining role-based access control, relational transaction guarantees, and real-time activity audit trails.",
    problem: "Manual spreadsheet tracking resulted in lost audit history and synchronization conflicts between departments.",
    solution: "Engineered a normalized relational data model with Laravel and MySQL, paired with an instantaneous React dashboard interface.",
    stack: ["React", "Laravel", "MySQL", "TypeScript", "Tailwind CSS"],
    variant: "operations",
  },
  {
    title: "Intelligent Workflow Automation Pipeline",
    category: "AI & Automation",
    headline: "Connecting language models directly to repeatable business execution loops.",
    summaryLabel: "Reliable LLM workflows",
    description:
      "A prompt-orchestrated backend service executing structured data extraction, document classification, and autonomous trigger sequences with human-in-the-loop validation.",
    problem: "Unstructured client requests required hours of manual triage and repetitive data re-entry.",
    solution: "Developed deterministic prompt templates and structured JSON schema outputs connected to Node.js microservices.",
    stack: ["Node.js", "Django", "TypeScript", "AI Prompt Engineering"],
    variant: "automation",
  },
  {
    title: "Full-Stack SaaS Platform Architecture",
    category: "Product Engineering",
    headline: "Modular, typed full-stack system designed for long-term scalability.",
    summaryLabel: "Type-safe API layer",
    description:
      "An end-to-end web product featuring strict TypeScript contracts across frontend and backend, secure session management, and responsive data caching.",
    problem: "Technical debt from loose API contracts slowed feature velocity and caused frequent client runtime errors.",
    solution: "Designed a single source of truth schema with Next.js App Router, validated API routes, and optimized PostgreSQL queries.",
    stack: ["Next.js", "Node.js", "TypeScript", "Tailwind CSS"],
    variant: "platform",
  },
  {
    title: "High-Density SaaS Analytics Dashboard",
    category: "Frontend Architecture",
    headline: "Low-latency data visualization for high-velocity transaction streams.",
    summaryLabel: "Sub-100ms render budgets",
    description:
      "A dense financial and operational reporting interface built for data clarity, dynamic filtering, and smooth interaction across large datasets.",
    problem: "Complex tabular data and multi-series charts suffered from sluggish UI lag and confusing visual hierarchy.",
    solution: "Implemented virtualized data grids, memoized chart components, and a custom dark mode color system with crimson indicators.",
    stack: ["React", "TypeScript", "Tailwind CSS"],
    variant: "analytics",
  },
  {
    title: "Performant Corporate Web Platform",
    category: "Web Engineering",
    headline: "High-conversion digital presence engineered for speed and search visibility.",
    summaryLabel: "100 Lighthouse performance",
    description:
      "A modern, responsive company web application with optimized asset delivery, semantic markup, and dynamic client inquiry handling.",
    problem: "Legacy website suffered from poor mobile responsiveness, slow time-to-interactive, and negligible lead conversion.",
    solution: "Re-engineered with Next.js static generation, fluid typography tokens, and automated contact ingestion workflows.",
    stack: ["Next.js", "Tailwind CSS", "JavaScript", "Bootstrap"],
    variant: "web",
  },
];

export const reasons = [
  {
    number: "01",
    title: "Production-Grade Reliability",
    label: "RELIABILITY",
    description:
      "Clean, defensively typed code engineered with predictable state management and strict error handling from day one.",
  },
  {
    number: "02",
    title: "Performance-First Mindset",
    label: "PERFORMANCE",
    description:
      "Lean bundle sizes, efficient database queries, and sub-second render times built into the foundation rather than patched later.",
  },
  {
    number: "03",
    title: "Scalable Cloud Architecture",
    label: "ARCHITECTURE",
    description:
      "Decoupled frontend systems, well-documented RESTful APIs, and resilient data schemas that scale as product requirements grow.",
  },
  {
    number: "04",
    title: "Business-Driven Decisions",
    label: "BUSINESS ALIGNMENT",
    description:
      "Direct alignment between technical architecture and business objectives—shipping software that solves actual operational needs.",
  },
] as const;

export const milestones = [
  {
    number: "01",
    value: "1+",
    label: "Year",
    description: "Practical Software Engineering Experience",
  },
  {
    number: "02",
    value: "10+",
    label: "Stack",
    description: "Modern Technologies in Daily Production Use",
  },
  {
    number: "03",
    value: "Full-Stack",
    label: "Scope",
    description: "Frontend-to-Backend Architectural Delivery",
  },
  {
    number: "04",
    value: "AI & LLM",
    label: "Applied",
    description: "Prompt Engineering & Intelligent Workflows",
  },
] as const;

export const timelineRoles = [
  {
    role: "Full-Stack & AI Software Engineer",
    period: "2024 — Present",
    company: "Engineering Practice",
    highlights: [
      "Architecting responsive web applications with Next.js, React, Node.js, and Django.",
      "Developing prompt-engineered automation pipelines and integrating LLM APIs into web workflows.",
      "Structuring relational database schemas and RESTful backend services with strict validation.",
    ],
  },
  {
    role: "Full-Stack Developer",
    period: "2023 — 2024",
    company: "Web & Product Engineering",
    highlights: [
      "Engineered performant frontend interfaces using React, TypeScript, and modern CSS frameworks.",
      "Built backend CRUD APIs, authentication middleware, and database integrations with Laravel and MySQL.",
      "Maintained cross-device compatibility and optimized client-side rendering performance.",
    ],
  },
] as const;

export const skillGroups = [
  {
    id: "frontend",
    index: "01",
    title: "Frontend Engineering",
    caption: "Modern, responsive interfaces with sub-100ms render budgets.",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Bootstrap",
      "HTML5",
      "CSS3 / PostCSS",
    ],
  },
  {
    id: "backend",
    index: "02",
    title: "Backend Architecture",
    caption: "Resilient APIs, relational schemas, and dependable services.",
    skills: [
      "Django",
      "Laravel",
      "Node.js",
      "RESTful API Design",
      "PostgreSQL / MySQL",
      "Authentication & Security",
    ],
  },
  {
    id: "ai",
    index: "03",
    title: "AI & Automation",
    caption: "Language models and intelligent pipelines wired into products.",
    skills: [
      "AI Engineering",
      "AI Prompt Engineering",
      "LLM API Integration",
      "Workflow Automation",
      "Structured Output Schemas",
    ],
  },
] as const;

export const focusAreas = [
  "Full Stack Development",
  "Frontend Architecture",
  "Backend Engineering",
  "AI & Prompt Engineering",
  "System Performance",
] as const;