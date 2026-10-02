"use client";

import Image from "next/image";
import { ArrowGlyph, PlusGlyph } from "@/components/ui/Primitives";
import { profile } from "@/lib/content";

const heroRoles = [
  "Full Stack",
  "Backend Architecture",
  "Applied AI",
  "Prompt Engineering",
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[85vh] w-full overflow-hidden bg-[#070707] pt-[72px] lg:h-[88vh] lg:min-h-[780px] lg:max-h-[920px] lg:pt-0"
    >
      {/* ========================================================================= */}
      {/* 1. RIGHT SIDE: Architectural Red Environment & Large Hamza Portrait       */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 hidden lg:block">
        {/* Deep Crimson Ambient Glow behind Head & Shoulders */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[12%] top-[15%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.32),rgba(153,27,27,0.14)_40%,transparent_70%)] blur-[75px]"
        />

        {/* Technical Architectural Grid Layer (Behind the portrait) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-[58%] grid-lines-fine opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_80%)]"
        />

        {/* Architectural Red Rectangles & Technical Cross Markers */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-[58%]"
        >
          <div className="absolute right-[28%] top-[18%] h-48 w-48 rounded-lg border border-crimson-800/25 [box-shadow:inset_0_0_30px_rgba(185,28,28,0.06)]" />
          <div className="absolute right-[12%] top-[34%] h-64 w-64 rounded-lg border border-crimson-700/20" />
          <span className="absolute right-[32%] top-[14%] font-mono text-[10px] text-crimson-700/60">+</span>
          <span className="absolute right-[10%] top-[22%] font-mono text-[10px] text-crimson-700/60">+</span>
          <span className="absolute right-[24%] bottom-[28%] font-mono text-[10px] text-crimson-700/60">+</span>
        </div>

        {/* Hamza Portrait - Balanced Scale (40-42% presence, not oversized) */}
        <div className="absolute bottom-0 right-[6%] top-4 w-[42%] max-w-[460px] xl:right-[8%] xl:max-w-[500px]">
          <div className="relative h-full w-full">
            <Image
              src="/hamza2.png"
              alt={`${profile.name} — Software Engineer`}
              fill
              priority
              sizes="(max-width: 1200px) 45vw, 500px"
              className="object-contain object-bottom filter brightness-[0.98] contrast-[1.02]"
            />

            {/* Natural Bottom Gradient Fade into Deep Black Surface */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#070707] via-[#070707]/60 to-transparent"
            />
          </div>
        </div>

        {/* Coordinate Marker in Bottom-Right Corner */}
        <div className="absolute bottom-6 right-8 z-10 hidden font-mono text-[9px] uppercase tracking-[0.22em] text-dim lg:block">
          <span>PORTRAIT // SYSTEM-2026</span>
          <span className="mx-2 text-crimson-800">•</span>
          <span className="text-crimson-500">FULL-STACK &amp; AI</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LEFT SIDE: Dark Editorial Panel with Geometric Clip-Path Cut           */}
      {/* ========================================================================= */}
      <div
        className="relative z-10 flex h-full w-full flex-col justify-center bg-[#090909] lg:w-[58%] lg:bg-gradient-to-r lg:from-[#080808] lg:via-[#090909] lg:to-[#0B0B0B] lg:[clip-path:polygon(0_0,100%_0,76%_100%,0_100%)]"
      >
        {/* Subtle Ambient Radial Lighting within Left Panel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/4 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.12),transparent_65%)] blur-[80px]"
        />

        {/* Content Container (Constrained so it never touches the diagonal cut) */}
        <div className="w-full px-6 py-10 sm:px-10 lg:py-14 lg:pl-12 lg:pr-14 xl:pl-16 xl:pr-18">
          <div className="max-w-[500px] xl:max-w-[540px]">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 animate-dot rounded-full bg-crimson-600 shadow-[0_0_8px_1px_rgba(220,38,38,0.8)]" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-mute sm:text-[11.5px]">
                HAMZA MALIK // SOFTWARE ENGINEER
              </span>
            </div>

            {/* Main Heading - Balanced Scale */}
            <h1 className="mt-5 text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.03em] text-white">
              Engineering scalable
              <br />
              digital products &
              <br />
              intelligent <span className="text-crimson-gradient">systems.</span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-[44ch] text-[14.5px] leading-[1.75] text-mute sm:text-[15px]">
              Building dependable full-stack web applications, resilient backend
              architectures, and practical AI systems using React, Next.js,
              Django, Laravel, Node.js, and TypeScript.
            </p>

            {/* CTA Buttons */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#projects"
                className="btn btn-primary group w-full sm:w-auto !min-h-[46px] !px-6 font-semibold tracking-wider text-[12px] uppercase"
              >
                VIEW MY WORK
                <ArrowGlyph className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#contact"
                className="btn btn-ghost group w-full sm:w-auto !min-h-[46px] !px-6 font-semibold tracking-wider text-[12px] uppercase"
              >
                LET&apos;S WORK TOGETHER
                <PlusGlyph className="text-crimson-600 transition-transform duration-300 group-hover:rotate-90" />
              </a>
            </div>

            {/* Disciplines & Fast Contact Channels */}
            <div className="mt-8 border-t border-white/[0.08] pt-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                <span className="text-white">CORE:</span>
                {heroRoles.map((role, idx) => (
                  <span key={role} className="flex items-center gap-2">
                    {idx > 0 && <span className="text-crimson-800">/</span>}
                    {role}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] text-dim">
                <a
                  href={profile.emailHref}
                  className="transition-colors hover:text-white"
                >
                  <span className="mr-1.5 text-crimson-600">01</span>
                  {profile.email}
                </a>
                <a
                  href={profile.phoneHref}
                  className="transition-colors hover:text-white"
                >
                  <span className="mr-1.5 text-crimson-600">02</span>
                  {profile.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DIAGONAL ARCHITECTURAL DIVIDER LINE (Visible along the cut on Desktop) */}
      {/* ========================================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 hidden lg:block"
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <filter id="crimsonDividerGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="diagonalLineGrad" x1="100%" y1="0%" x2="76%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#dc2626" stopOpacity="1" />
              <stop offset="100%" stopColor="#991b1b" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Strong Diagonal Line running from (58% of width, 0) to (44% of width, 100%) */}
          {/* Note: since SVG viewBox is 0 0 100 100, (58, 0) to (44.08, 100) exactly matches the 58% -> 44% polygon */}
          <line
            x1="58"
            y1="0"
            x2="44.08"
            y2="100"
            stroke="url(#diagonalLineGrad)"
            strokeWidth="0.22"
            vectorEffect="non-scaling-stroke"
            filter="url(#crimsonDividerGlow)"
          />

          {/* Faint Parallel Architectural Guide Line */}
          <line
            x1="58.4"
            y1="0"
            x2="44.48"
            y2="100"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.12"
            strokeDasharray="0.8 1.2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 4. MOBILE / TABLET ADAPTATION (< 1024px)                                  */}
      {/* ========================================================================= */}
      <div className="relative z-10 block px-6 pb-12 sm:px-10 lg:hidden">
        {/* Mobile Angled Crimson Divider Line */}
        <div
          aria-hidden="true"
          className="relative my-4 h-6 w-full overflow-hidden"
        >
          <svg viewBox="0 0 360 20" fill="none" className="h-full w-full" preserveAspectRatio="none">
            <line x1="0" y1="18" x2="360" y2="2" stroke="#dc2626" strokeWidth="1.5" strokeOpacity="0.8" />
          </svg>
        </div>

        {/* Mobile Portrait Container - Balanced Scale */}
        <div className="relative mx-auto aspect-[3.5/4] w-full max-w-[340px] overflow-hidden rounded-xl bg-[#090909]">
          {/* Crimson Ambient Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_40%,rgba(185,28,28,0.35),transparent_70%)] blur-[40px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 grid-lines-fine opacity-25"
          />

          <Image
            src="/hamza2.png"
            alt={`${profile.name} — Software Engineer`}
            fill
            sizes="(max-width: 768px) 100vw, 340px"
            className="object-contain object-bottom filter brightness-[0.98] contrast-[1.02]"
          />

          {/* Bottom Fade */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#070707] via-[#070707]/60 to-transparent"
          />
        </div>
      </div>

      {/* Bottom Crimson Boundary Rule */}
      <div className="absolute inset-x-0 bottom-0 z-30 h-px bg-gradient-to-r from-transparent via-crimson-800/50 to-transparent" />
    </section>
  );
}