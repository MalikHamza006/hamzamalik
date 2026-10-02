import { ArrowGlyph } from "@/components/ui/Primitives";
import { navLinks, profile } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.08] bg-ink-950">
      <div className="shell py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand Info */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/12 bg-ink-850 font-mono text-[12px] font-bold text-white">
                {profile.monogram}
              </span>
              <span className="text-[13px] font-bold tracking-[0.04em] text-white">
                {profile.name.toUpperCase()}
              </span>
            </div>
            <p className="mt-4 max-w-[40ch] font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-dim">
              Software Engineer • Full Stack Developer • AI Engineer
            </p>
            <p className="mt-3 max-w-[42ch] text-[13px] leading-relaxed text-mute">
              Building scalable digital architectures, typed web applications, and intelligent systems.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 lg:col-start-8">
            <span className="mono-label">Navigation</span>
            <ul className="mt-5 grid gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-[13.5px] text-mute transition-colors duration-300 hover:text-white"
                  >
                    <span className="h-px w-3 bg-white/20 transition-all duration-300 group-hover:w-5 group-hover:bg-crimson-600" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Contact */}
          <div className="lg:col-span-4">
            <span className="mono-label">Connect</span>
            <ul className="mt-5 grid gap-2.5">
              <li>
                <a
                  href={profile.emailHref}
                  className="break-all text-[13px] text-mute transition-colors duration-300 hover:text-white"
                >
                  {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={profile.phoneHref}
                  className="text-[13px] text-mute transition-colors duration-300 hover:text-white"
                >
                  {profile.phone}
                </a>
              </li>
              {profile.whatsappHref && (
                <li>
                  <a
                    href={profile.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-emerald-400/90 transition-colors duration-300 hover:text-emerald-300"
                  >
                    WhatsApp Channel →
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 h-px w-full bg-gradient-to-r from-crimson-800/40 via-white/[0.07] to-transparent" />

        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-mono text-[10px] tracking-[0.14em] text-dim">
            © {profile.year} {profile.name}. Engineering scalable systems.
          </p>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-dim transition-colors duration-300 hover:text-white"
          >
            Back to top
            <ArrowGlyph className="h-3.5 w-3.5 -rotate-90 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}