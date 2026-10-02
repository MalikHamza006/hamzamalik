"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { ArrowGlyph, CornerBrackets } from "@/components/ui/Primitives";
import { profile } from "@/lib/content";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const field = document.createElement("textarea");
      field.value = text;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      document.body.removeChild(field);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="rounded-md border border-white/[0.08] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-crimson-700/60 hover:text-white"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Full-Stack Application",
    budget: "Prefer not to say",
    timeline: "Flexible",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.name.trim()) {
      errs.name = "Your name is required.";
    }
    if (!form.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!form.message.trim()) {
      errs.message = "Please describe what you are looking to build.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Submission failed");
      }

      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        projectType: "Full-Stack Application",
        budget: "Prefer not to say",
        timeline: "Flexible",
        message: "",
      });
    } catch {
      setStatus("error");
      setErrorMessage(
        "Something went wrong while sending your message. Please try again or contact me directly via WhatsApp, email, or phone."
      );
    }
  };

  return (
    <section id="contact" className="relative scroll-mt-24 py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[min(48rem,100vw)] w-[min(48rem,100vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.24),transparent_66%)] blur-[90px]"
      />

      <div className="shell">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-b from-ink-800 via-ink-850 to-ink-900 p-6 sm:p-10 lg:p-14 shadow-2xl">
          <CornerBrackets />

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Contact Introduction & Details */}
            <div className="lg:col-span-5">
              <Reveal>
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-crimson-600" />
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-crimson-500">
                    06 / CONTACT
                  </span>
                </div>

                <h2 className="mt-5 text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.035em] text-white">
                  Let&apos;s Build
                  <br />
                  <span className="text-crimson-gradient">Something.</span>
                </h2>

                <p className="mt-5 max-w-[44ch] text-[15px] leading-[1.75] text-mute">
                  Tell me what you&apos;re building, what you&apos;re trying to solve, and where you&apos;d like to take it. I&apos;ll review the architecture and get back to you with the next steps.
                </p>

                {/* Direct Contact Cards */}
                <div className="mt-8 space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-ink-850/80 px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-dim">
                        Direct Phone
                      </span>
                      <a
                        href={profile.phoneHref}
                        className="text-[13.5px] font-medium text-white hover:text-crimson-400 transition-colors"
                      >
                        {profile.phone}
                      </a>
                    </div>
                    <CopyButton text={profile.phone} label="phone" />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-ink-850/80 px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-dim">
                        Primary Email
                      </span>
                      <a
                        href={profile.emailHref}
                        className="text-[13.5px] font-medium text-white hover:text-crimson-400 transition-colors"
                      >
                        {profile.email}
                      </a>
                    </div>
                    <CopyButton text={profile.email} label="email" />
                  </div>

                  {profile.whatsappHref && (
                    <a
                      href={profile.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-emerald-900/40 bg-emerald-950/20 px-4 py-3 text-emerald-400 hover:border-emerald-600/60 hover:text-white transition-all"
                    >
                      <div className="flex flex-col">
                        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-500">
                          Instant Messaging
                        </span>
                        <span className="text-[13.5px] font-medium">
                          Connect on WhatsApp →
                        </span>
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-emerald-400">
                        Online
                      </span>
                    </a>
                  )}
                </div>

                <div className="mt-8 border-t border-white/[0.06] pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
                  {profile.name} // Full-Stack &amp; AI Engineer
                </div>
              </Reveal>
            </div>

            {/* Right Column: Native Dark Contact Form */}
            <div className="lg:col-span-7">
              <Reveal delay={100}>
                <div className="rounded-xl border border-white/[0.08] bg-ink-900/90 p-6 sm:p-8">
                  {status === "success" ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-400">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-6 w-6"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </div>
                      <h3 className="mt-4 text-[22px] font-semibold text-white">
                        Message received.
                      </h3>
                      <p className="mx-auto mt-2 max-w-[42ch] text-[14px] leading-relaxed text-mute">
                        Thanks for reaching out. I&apos;ll review your project details and get back to you with architectural considerations.
                      </p>
                      <button
                        type="button"
                        onClick={() => setStatus("idle")}
                        className="btn btn-ghost mt-6 !min-h-[42px] !px-6"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                      {status === "error" && (
                        <div className="rounded-lg border border-crimson-800/60 bg-crimson-950/40 p-4 text-[13px] text-crimson-200">
                          {errorMessage}
                        </div>
                      )}

                      {/* Name & Email Row */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="name"
                            className="block font-mono text-[10px] uppercase tracking-[0.16em] text-mute"
                          >
                            Your Name <span className="text-crimson-500">*</span>
                          </label>
                          <input
                            id="name"
                            type="text"
                            value={form.name}
                            onChange={(e) => {
                              setForm({ ...form, name: e.target.value });
                              if (errors.name) setErrors({ ...errors, name: "" });
                            }}
                            placeholder="Hamza"
                            className={`mt-1.5 w-full rounded-lg border bg-ink-850 px-3.5 py-2.5 text-[14px] text-white placeholder-dim transition-all focus:outline-none ${
                              errors.name
                                ? "border-crimson-600 focus:ring-1 focus:ring-crimson-600"
                                : "border-white/[0.08] focus:border-crimson-600 focus:ring-1 focus:ring-crimson-600"
                            }`}
                          />
                          {errors.name && (
                            <p className="mt-1 text-[11px] text-crimson-400">
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block font-mono text-[10px] uppercase tracking-[0.16em] text-mute"
                          >
                            Email Address <span className="text-crimson-500">*</span>
                          </label>
                          <input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => {
                              setForm({ ...form, email: e.target.value });
                              if (errors.email) setErrors({ ...errors, email: "" });
                            }}
                            placeholder="hamza@example.com"
                            className={`mt-1.5 w-full rounded-lg border bg-ink-850 px-3.5 py-2.5 text-[14px] text-white placeholder-dim transition-all focus:outline-none ${
                              errors.email
                                ? "border-crimson-600 focus:ring-1 focus:ring-crimson-600"
                                : "border-white/[0.08] focus:border-crimson-600 focus:ring-1 focus:ring-crimson-600"
                            }`}
                          />
                          {errors.email && (
                            <p className="mt-1 text-[11px] text-crimson-400">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Phone & Project Type Row */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="phone"
                            className="block font-mono text-[10px] uppercase tracking-[0.16em] text-mute"
                          >
                            Phone / WhatsApp <span className="text-dim">(Optional)</span>
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="+1 (555) 000-0000"
                            className="mt-1.5 w-full rounded-lg border border-white/[0.08] bg-ink-850 px-3.5 py-2.5 text-[14px] text-white placeholder-dim transition-all focus:border-crimson-600 focus:outline-none focus:ring-1 focus:ring-crimson-600"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="projectType"
                            className="block font-mono text-[10px] uppercase tracking-[0.16em] text-mute"
                          >
                            Project Type
                          </label>
                          <select
                            id="projectType"
                            value={form.projectType}
                            onChange={(e) =>
                              setForm({ ...form, projectType: e.target.value })
                            }
                            className="mt-1.5 w-full rounded-lg border border-white/[0.08] bg-ink-850 px-3.5 py-2.5 text-[14px] text-white transition-all focus:border-crimson-600 focus:outline-none focus:ring-1 focus:ring-crimson-600"
                          >
                            <option value="Website">Website</option>
                            <option value="Web Application">Web Application</option>
                            <option value="E-commerce">E-commerce</option>
                            <option value="Dashboard">Dashboard</option>
                            <option value="AI Application">AI Application</option>
                            <option value="AI Automation">AI Automation</option>
                            <option value="Full-Stack Application">
                              Full-Stack Application
                            </option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Budget & Timeline Row */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="budget"
                            className="block font-mono text-[10px] uppercase tracking-[0.16em] text-mute"
                          >
                            Budget Range <span className="text-dim">(Optional)</span>
                          </label>
                          <select
                            id="budget"
                            value={form.budget}
                            onChange={(e) => setForm({ ...form, budget: e.target.value })}
                            className="mt-1.5 w-full rounded-lg border border-white/[0.08] bg-ink-850 px-3.5 py-2.5 text-[14px] text-white transition-all focus:border-crimson-600 focus:outline-none focus:ring-1 focus:ring-crimson-600"
                          >
                            <option value="Prefer not to say">Prefer not to say</option>
                            <option value="< $1,000">&lt; $1,000</option>
                            <option value="$1,000 - $3,000">$1,000 – $3,000</option>
                            <option value="$3,000 - $5,000">$3,000 – $5,000</option>
                            <option value="$5,000+">$5,000+</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="timeline"
                            className="block font-mono text-[10px] uppercase tracking-[0.16em] text-mute"
                          >
                            Project Timeline <span className="text-dim">(Optional)</span>
                          </label>
                          <select
                            id="timeline"
                            value={form.timeline}
                            onChange={(e) =>
                              setForm({ ...form, timeline: e.target.value })
                            }
                            className="mt-1.5 w-full rounded-lg border border-white/[0.08] bg-ink-850 px-3.5 py-2.5 text-[14px] text-white transition-all focus:border-crimson-600 focus:outline-none focus:ring-1 focus:ring-crimson-600"
                          >
                            <option value="Flexible">Flexible</option>
                            <option value="Within 1 month">Within 1 month</option>
                            <option value="1 - 3 months">1 – 3 months</option>
                          </select>
                        </div>
                      </div>

                      {/* Message Field */}
                      <div>
                        <label
                          htmlFor="message"
                          className="block font-mono text-[10px] uppercase tracking-[0.16em] text-mute"
                        >
                          Tell me about your project <span className="text-crimson-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          value={form.message}
                          onChange={(e) => {
                            setForm({ ...form, message: e.target.value });
                            if (errors.message) setErrors({ ...errors, message: "" });
                          }}
                          placeholder="Outline the scope, requirements, current challenges, or goals..."
                          className={`mt-1.5 w-full rounded-lg border bg-ink-850 px-3.5 py-2.5 text-[14px] text-white placeholder-dim transition-all focus:outline-none ${
                            errors.message
                              ? "border-crimson-600 focus:ring-1 focus:ring-crimson-600"
                              : "border-white/[0.08] focus:border-crimson-600 focus:ring-1 focus:ring-crimson-600"
                          }`}
                        />
                        {errors.message && (
                          <p className="mt-1 text-[11px] text-crimson-400">
                            {errors.message}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={status === "loading"}
                          className="btn btn-primary w-full !min-h-[48px] font-semibold tracking-wider uppercase text-[12px]"
                        >
                          {status === "loading" ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                              Sending Message...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              SEND MESSAGE
                              <ArrowGlyph className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}