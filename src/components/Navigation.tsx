"use client";

import { useEffect, useState } from "react";
import { navLinks, profile } from "@/lib/content";
import { ArrowGlyph } from "@/components/ui/Primitives";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(1, y / height) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled
          ? "border-b border-white/[0.08] bg-ink-950/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      {/* Scroll Progress Line */}
      <div
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-crimson-800 via-crimson-600 to-transparent transition-transform duration-150"
        style={{ transform: `scaleX(${progress})` }}
      />

      <nav
        aria-label="Primary"
        className="shell flex h-[72px] items-center justify-between gap-6"
      >
        {/* Brand Monogram & Name */}
        <a
          href="#top"
          className="group flex items-center gap-3"
          aria-label={`${profile.name} — home`}
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/12 bg-ink-850 font-mono text-[12px] font-bold tracking-tight text-white transition-colors duration-400 group-hover:border-crimson-700/80">
            <span className="absolute inset-0 rounded-[10px] bg-[radial-gradient(circle_at_50%_120%,rgba(185,28,28,0.45),transparent_70%)] opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
            <span className="relative">{profile.monogram}</span>
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="text-[13px] font-bold tracking-[0.04em] text-white">
              {profile.name.toUpperCase()}
            </span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-dim">
              Software Engineer
            </span>
          </span>
        </a>

        {/* Center Nav Links */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </div>

        {/* Right CTA Button */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="btn btn-primary hidden !min-h-[42px] !px-5 !text-[12.5px] font-semibold sm:inline-flex"
          >
            Let&apos;s Talk
            <ArrowGlyph className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/10 bg-ink-800/80 transition-colors duration-300 hover:border-crimson-700/70 lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-px w-full bg-white transition-all duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-px w-full bg-white transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-full bg-white transition-all duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-[72px] z-40 origin-top border-b border-white/[0.08] bg-ink-950/98 backdrop-blur-2xl transition-[opacity,transform,visibility] duration-400 lg:hidden ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-3 opacity-0"
        }`}
      >
        <div className="shell flex flex-col py-8">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline justify-between border-b border-white/[0.06] py-4 text-mute transition-colors duration-300 hover:text-white"
              style={{
                transitionDelay: open ? `${index * 40}ms` : "0ms",
              }}
            >
              <span className="text-[15px] font-medium tracking-tight">{link.label}</span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-dim">
                0{index + 1}
              </span>
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-6 w-full !min-h-[46px]"
          >
            Let&apos;s Talk
            <ArrowGlyph />
          </a>
        </div>
      </div>
    </header>
  );
}