import { ArrowDown, ArrowUpRight } from "lucide-react";

import type { ProfileContent } from "@/features/profile-content/data/profile-content";

type HeroSectionProps = {
  hero: ProfileContent["hero"];
};

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section id="hero" className="scroll-mt-20 px-5 sm:px-8">
      <div className="mx-auto max-w-6xl border-x border-[var(--portfolio-border)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--portfolio-border)] px-5 py-4 sm:px-10">
          <p className="portfolio-label">Personal portfolio</p>
          <span className="portfolio-label text-[var(--portfolio-accent)]">Work / Experience / Contact</span>
        </div>
        <div className="grid min-h-[min(690px,calc(100svh-9rem))] lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
          <div className="flex flex-col justify-between border-b border-[var(--portfolio-border)] px-5 pb-10 pt-16 sm:px-10 sm:pb-14 sm:pt-24 lg:border-b-0 lg:border-r">
            <div>
              <p className="portfolio-label mb-6 text-[var(--portfolio-accent)]">01 / Introduction</p>
              <h1 className="portfolio-hero-title max-w-4xl break-words">{hero.name}</h1>
              <p className="mt-8 max-w-xl text-xl font-medium leading-snug tracking-tight sm:text-2xl">{hero.headline}</p>
            </div>
            <div className="mt-14 flex flex-wrap items-center gap-3">
              <a href="#projects" className="portfolio-button portfolio-button-primary">{hero.primaryCtaLabel}<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
              <a href="#contact" className="portfolio-button portfolio-button-outline">{hero.secondaryCtaLabel}</a>
            </div>
          </div>
          <div className="flex flex-col justify-between bg-[var(--portfolio-surface)] px-5 py-8 sm:px-10 lg:py-12">
            <div className="flex items-start justify-between gap-4">
              <span className="portfolio-label">Profile / 001</span>
              <span aria-hidden="true" className="portfolio-cross">+</span>
            </div>
            <div className="my-12 flex aspect-square max-h-64 w-full items-center justify-center border border-[var(--portfolio-border)] bg-[var(--portfolio-background)] sm:max-h-72 lg:my-0">
              <span className="select-none text-[clamp(5rem,12vw,10rem)] font-black tracking-[-0.12em] text-[var(--portfolio-accent)]" aria-label={hero.initials}>{hero.initials}</span>
            </div>
            <div className="flex items-end justify-between gap-6">
              <p className="max-w-xs text-sm leading-relaxed text-[var(--portfolio-muted)]">{hero.summary}</p>
              <a href="#about" aria-label="Explore the portfolio" className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--portfolio-border)] transition-colors hover:bg-[var(--portfolio-accent)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--portfolio-accent)]"><ArrowDown aria-hidden="true" className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="h-3 border-y border-[var(--portfolio-border)] bg-[repeating-linear-gradient(90deg,var(--portfolio-border)_0_1px,transparent_1px_32px)]" />
      </div>
    </section>
  );
}
