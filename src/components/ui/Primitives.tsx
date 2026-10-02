import type { ReactNode } from "react";

export function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[11px] tracking-[0.28em] text-crimson-600">
        {index}
      </span>
      <span className="h-px w-8 bg-gradient-to-r from-crimson-700/80 to-transparent" />
      <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-dim">
        {children}
      </span>
    </div>
  );
}

export function SectionHeading({
  index,
  label,
  title,
  accent,
  description,
  align = "left",
  className = "",
}: {
  index: string;
  label: string;
  title: string;
  accent?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={`flex flex-col gap-6 ${centered ? "items-center text-center" : "items-start"} ${className}`}
    >
      <SectionLabel index={index}>{label}</SectionLabel>
      <h2
        className={`text-balance text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[1.02] text-white ${
          centered ? "max-w-3xl" : "max-w-2xl"
        }`}
      >
        {title}
        {accent ? (
          <>
            {" "}
            <span className="text-crimson-600">{accent}</span>
          </>
        ) : null}
      </h2>
      {description ? (
        <p
          className={`text-[15px] leading-relaxed text-mute ${
            centered ? "max-w-2xl" : "max-w-xl"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function CornerBrackets({ tone = "red" }: { tone?: "red" | "white" }) {
  const border = tone === "red" ? "border-crimson-800/70" : "border-white/20";
  return (
    <>
      <span className={`bracket -left-px -top-px border-l border-t ${border}`} />
      <span className={`bracket -right-px -top-px border-r border-t ${border}`} />
      <span className={`bracket -bottom-px -left-px border-b border-l ${border}`} />
      <span className={`bracket -bottom-px -right-px border-b border-r ${border}`} />
    </>
  );
}

export function ArrowGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`h-4 w-4 ${className}`}
    >
      <path
        d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlusGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`h-4 w-4 ${className}`}
    >
      <path
        d="M8 3v10M3 8h10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Glow({
  className = "",
  intensity = "md",
}: {
  className?: string;
  intensity?: "sm" | "md" | "lg";
}) {
  const scale = {
    sm: "h-56 w-56 opacity-60",
    md: "h-[26rem] w-[26rem] opacity-70",
    lg: "h-[38rem] w-[38rem] opacity-80",
  }[intensity];
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.34),rgba(127,29,29,0.12)_45%,transparent_70%)] blur-[70px] ${scale} ${className}`}
    />
  );
}