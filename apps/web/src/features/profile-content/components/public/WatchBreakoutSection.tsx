import { ArrowUpRight, Clapperboard, Film, Play, Tv2 } from "lucide-react";

export function WatchBreakoutSection() {
  return (
    <section id="get-to-know-me" className="portfolio-section overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div className="portfolio-shell">
        <div className="relative overflow-hidden border border-[var(--portfolio-border)] bg-[var(--portfolio-surface)] px-6 py-8 sm:px-10 sm:py-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[var(--portfolio-accent)] opacity-10 blur-3xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <p className="portfolio-label text-[var(--portfolio-accent)]">06 / Get to know me</p>
            <span className="portfolio-label flex items-center gap-2 text-[var(--portfolio-muted)]"><Play aria-hidden="true" className="h-3 w-3 fill-current" /> Off the clock</span>
          </div>

          <div className="relative mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-end">
            <div>
              <h2 className="max-w-2xl text-[clamp(2.75rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.07em]">More than <span className="text-[var(--portfolio-accent)]">code.</span></h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--portfolio-muted)]">Curious what keeps me inspired after work? Step into my watch journal: films, series, and anime I have enjoyed, am following, or have lined up next.</p>
              <a href="/watch" className="portfolio-button portfolio-button-primary mt-8 inline-flex min-h-12 items-center gap-3">Explore my watch journal <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
            </div>

            <div aria-hidden="true" className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="flex aspect-[0.75] -rotate-3 flex-col justify-between border border-[var(--portfolio-border)] bg-[var(--portfolio-background)] p-3 shadow-lg sm:p-5"><Film className="h-7 w-7 text-[var(--portfolio-accent)]" /><span className="portfolio-label">Film</span></div>
              <div className="flex aspect-[0.75] translate-y-5 rotate-3 flex-col justify-between border border-[var(--portfolio-border)] bg-[var(--portfolio-accent)] p-3 text-white shadow-lg sm:p-5"><Tv2 className="h-7 w-7" /><span className="portfolio-label">Series</span></div>
              <div className="flex aspect-[0.75] -rotate-2 flex-col justify-between border border-[var(--portfolio-border)] bg-[var(--portfolio-background)] p-3 shadow-lg sm:p-5"><Clapperboard className="h-7 w-7 text-[var(--portfolio-accent)]" /><span className="portfolio-label">Anime</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
