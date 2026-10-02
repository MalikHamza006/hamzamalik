import Image from "next/image";
import { profile } from "@/lib/content";

export default function HeroVisual() {
  return (
    <div className="relative mx-auto flex w-full max-w-[540px] items-center justify-center lg:max-w-none">
      {/* Subtle crimson ambient glow behind the subject */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 -z-10 rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(185,28,28,0.32),rgba(127,29,29,0.12)_45%,transparent_72%)] blur-[60px]"
      />

      {/* Subtle background technical grid behind the portrait */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-10 grid-lines-fine opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
      />

      {/* Direct Editorial Portrait Container - No card frame, no browser header, no fake UI */}
      <div className="relative aspect-[3/4] w-full max-w-[500px] overflow-hidden sm:aspect-[4/5] lg:aspect-[3.6/4.5] xl:max-w-[540px]">
        {/* The Portrait Image */}
        <Image
          src="/hamza.png"
          alt={`${profile.name} — Software Engineer`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 540px"
          className="object-cover object-top filter brightness-[0.98] contrast-[1.03] transition-transform duration-700 ease-out hover:scale-[1.015]"
        />

        {/* Natural gradient fade to blend the bottom smoothly into the hero background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent"
        />

        {/* Subtle dark gradient along the outer edges to feather naturally */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 [box-shadow:inset_0_0_40px_10px_rgba(8,8,8,0.4)]"
        />
      </div>
    </div>
  );
}