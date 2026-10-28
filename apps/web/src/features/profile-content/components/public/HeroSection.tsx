import { ArrowDown, ArrowUpRight, ImageIcon } from 'lucide-react';

import type { ProfileContent } from '@/features/profile-content/data/profile-content';

type HeroSectionProps = {
  hero: ProfileContent['hero'];
};

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section id="hero" className="scroll-mt-20 px-5 sm:px-8">
      <div className="mx-auto max-w-6xl border-x border-[var(--portfolio-border)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--portfolio-border)] px-5 py-4 sm:px-10">
          <p className="portfolio-label">Personal portfolio</p>
          <span className="portfolio-label text-[var(--portfolio-accent)]">
            Work / Experience / Contact
          </span>
        </div>
        <div
          className="relative isolate overflow-hidden px-5 pb-8 pt-8 sm:px-10 lg:min-h-[740px] lg:pb-12 lg:pt-10"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, var(--portfolio-surface), var(--portfolio-background) 78%)',
          }}
        >
          <div className="relative z-20 flex items-start justify-between gap-4">
            <p className="portfolio-label text-[var(--portfolio-accent)]">
              01 / Introduction
            </p>
            <div className="flex items-center gap-6">
              <span className="portfolio-label hidden sm:inline">
                Profile / 001
              </span>
              <span aria-hidden="true" className="portfolio-cross">
                +
              </span>
            </div>
          </div>

          <h1
            className="portfolio-hero-title relative z-0 mx-auto mt-12 max-w-[1050px] break-words text-center sm:mt-10 lg:mt-8"
            style={{ fontSize: 'clamp(2.65rem, 12vw, 8rem)' }}
            aria-label={hero.name}
          >
            <span className="inline-flex max-w-full flex-col items-center text-center">
              <span>{hero.firstName}</span>
              {hero.lastName && <span>{hero.lastName}</span>}
            </span>
          </h1>

          <div className="pointer-events-none relative z-10 mx-auto -mt-4 flex h-[390px] max-w-[520px] items-end justify-center sm:h-[470px] lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:h-[660px] lg:max-w-[780px]">
            {hero.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hero.imageUrl}
                alt={`Portrait of ${hero.name}`}
                className="h-full w-full object-contain object-bottom lg:scale-[0.8] lg:origin-bottom"
                style={{
                  maskImage:
                    'linear-gradient(to bottom, #000 0%, #000 72%, transparent 99%)',
                  WebkitMaskImage:
                    'linear-gradient(to bottom, #000 0%, #000 72%, transparent 99%)',
                }}
              />
            ) : (
              <div className="mb-24 flex flex-col items-center gap-3 text-[var(--portfolio-muted)]">
                <ImageIcon
                  aria-hidden="true"
                  className="h-10 w-10 text-[var(--portfolio-accent)]"
                />
                <span className="portfolio-label">Portrait coming soon</span>
              </div>
            )}
          </div>

          <div className="relative z-20 mt-2 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between lg:absolute lg:inset-x-10 lg:bottom-12 lg:mt-0">
            <div className="max-w-xs">
              <p className="mb-6 text-xl font-medium leading-snug tracking-tight sm:text-2xl">
                {hero.headline}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className="portfolio-button portfolio-button-primary"
                >
                  {hero.primaryCtaLabel}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="portfolio-button portfolio-button-outline"
                >
                  {hero.secondaryCtaLabel}
                </a>
              </div>
            </div>
            <div className="flex max-w-xs items-end justify-between gap-6 sm:w-72 lg:w-64">
              <p className="text-sm leading-relaxed text-[var(--portfolio-muted)]">
                {hero.summary}
              </p>
              <a
                href="#about"
                aria-label="Explore the portfolio"
                className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--portfolio-border)] transition-colors hover:bg-[var(--portfolio-accent)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--portfolio-accent)]"
              >
                <ArrowDown aria-hidden="true" className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="h-3 border-y border-[var(--portfolio-border)] bg-[repeating-linear-gradient(90deg,var(--portfolio-border)_0_1px,transparent_1px_32px)]"
        />
      </div>
    </section>
  );
}
