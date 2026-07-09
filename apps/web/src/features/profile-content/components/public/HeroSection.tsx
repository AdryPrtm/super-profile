import { ArrowDown } from "lucide-react";

import type { ProfileContent } from "@/features/profile-content/data/profile-content";

type HeroSectionProps = {
  hero: ProfileContent["hero"];
};

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100svh-49px)] flex-col items-center justify-center px-6 text-center"
    >
      <div className="animate-fade-in space-y-6">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-800">
          <span className="text-4xl font-light text-stone-500 dark:text-stone-300">
            {hero.initials}
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-light tracking-tight sm:text-5xl md:text-6xl">
            {hero.name}
          </h1>
          <p className="text-lg font-light text-muted-foreground sm:text-xl">
            {hero.headline}
          </p>
        </div>

        <p className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground/80">
          {hero.summary}
        </p>

        <div className="flex items-center justify-center gap-4 pt-2">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            {hero.primaryCtaLabel}
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            {hero.secondaryCtaLabel}
          </a>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 animate-bounce text-muted-foreground/50 transition-colors hover:text-foreground"
        aria-label="Scroll down"
      >
        <ArrowDown className="h-5 w-5" />
      </a>
    </section>
  );
}
