"use client";

import { useMemo, useState } from "react";
import { Clapperboard, Search, Star, Tv2, Sparkles, Check, Play, Bookmark, Pause, X } from "lucide-react";
import type { WatchCategory, WatchEntry, WatchStatus } from "../../data/watch-data";

const categoryLabels: Record<WatchCategory, string> = {
  film: "Film",
  series: "Series",
  anime: "Anime",
};

const statusLabels: Record<WatchStatus, string> = {
  completed: "Watched",
  watching: "Watching",
  planned: "Plan to watch",
  paused: "Paused",
  dropped: "Dropped",
};

const statusStyles: Record<WatchStatus, string> = {
  completed: "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
  watching: "border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-200",
  planned: "border-violet-300 bg-violet-50 text-violet-900 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-200",
  paused: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200",
  dropped: "border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-200",
};
const statusIcons = { completed: Check, watching: Play, planned: Bookmark, paused: Pause, dropped: X };

function WatchPoster({ entry }: { entry: WatchEntry }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const Icon = categoryIcons[entry.category] ?? Clapperboard;
  const StatusIcon = statusIcons[entry.status];
  return (
    <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-violet-100 via-slate-100 to-white dark:from-violet-950 dark:via-slate-900 dark:to-gray-950">
      {entry.posterUrl && failedUrl !== entry.posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={entry.posterUrl} alt={`Poster for ${entry.title}`} loading="lazy" onError={() => setFailedUrl(entry.posterUrl)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none" />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-4 pb-6 pt-20 text-center">
          <Icon aria-hidden="true" className="h-9 w-9 text-violet-600 dark:text-violet-300" />
          <span className="line-clamp-3 text-sm font-semibold leading-snug text-foreground sm:text-lg">{entry.title}</span>
          <span className="text-xs text-muted-foreground">Poster unavailable</span>
        </div>
      )}
      <div className="absolute inset-x-2 top-2 flex flex-wrap items-center gap-1.5 sm:inset-x-3 sm:top-3">
        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
          {categoryLabels[entry.category] ?? entry.category}
        </span>
        <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm ${statusStyles[entry.status]}`}>
          {StatusIcon ? <StatusIcon aria-hidden="true" className="h-3 w-3 shrink-0" /> : null}
          {statusLabels[entry.status] ?? entry.status}
        </span>
      </div>
    </div>
  );
}

const sourceLabels = { manual: "Added by me", anilist: "AniList", netflix: "Netflix", letterboxd: "Letterboxd" };

const categoryIcons = {
  film: Clapperboard,
  series: Tv2,
  anime: Sparkles,
};

const watchedDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

type CategoryFilter = "all" | WatchCategory;
type StatusFilter = "all" | WatchStatus;

export function WatchCatalog({ entries, hasDatabaseError = false }: { entries: WatchEntry[]; hasDatabaseError?: boolean }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const results = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("en-US");
    return entries.filter((entry) =>
      (category === "all" || entry.category === category) &&
      (status === "all" || entry.status === status) &&
      (!search || `${entry.title} ${entry.notes ?? ""} ${entry.year ?? ""}`.toLocaleLowerCase("en-US").includes(search)),
    );
  }, [entries, query, category, status]);

  const completedCount = entries.filter((entry) => entry.status === "completed").length;
  const watchingCount = entries.filter((entry) => entry.status === "watching").length;

  return (
    <main id="main-content" className="min-h-full bg-background text-foreground">
      <div className="relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-48 h-[32rem] w-[32rem] rounded-full bg-violet-600/20 blur-[110px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-44 h-72 w-72 rounded-full bg-rose-600/10 blur-[100px]" />
        <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-16 sm:pb-16 sm:pt-24">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-violet-700 dark:text-violet-300">My watch journal</p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">
            Everything <span className="text-violet-700 dark:text-violet-300">I watch.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Films, series, and anime I have watched, am following, or plan to watch next. Search and explore my collection here.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-7 sm:grid-cols-3 lg:grid-cols-6">
            <div><strong className="block text-3xl font-semibold tabular-nums">{completedCount}</strong><span className="text-sm text-muted-foreground">Watched</span></div>
            <div><strong className="block text-3xl font-semibold tabular-nums">{watchingCount}</strong><span className="text-sm text-muted-foreground">Watching</span></div>
            {(["planned", "paused", "dropped"] as const).map((value) => <div key={value}><strong className="block text-3xl font-semibold tabular-nums">{entries.filter((entry) => entry.status === value).length}</strong><span className="text-sm text-muted-foreground">{statusLabels[value]}</span></div>)}
            <div><strong className="block text-3xl font-semibold tabular-nums">{entries.length}</strong><span className="text-sm text-muted-foreground">Titles logged</span></div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-14" aria-label="Watch catalog">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {(["all", "film", "series", "anime"] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={`min-h-11 cursor-pointer rounded-full border px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${category === item ? "border-violet-700 bg-violet-700 text-white dark:border-violet-300 dark:bg-violet-300 dark:text-violet-950" : "border-input bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"}`}
              >
                {item === "all" ? "All" : categoryLabels[item]}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block">
              <Search aria-hidden="true" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <span className="sr-only">Search watch titles</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search titles..."
                className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring sm:w-56"
              />
            </label>
            <label className="block">
              <span className="sr-only">Filter by watch status</span>
              <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-48">
                <option value="all">All statuses</option>
                <option value="completed">Watched</option>
                <option value="watching">Watching</option>
                <option value="planned">Plan to watch</option>
                <option value="paused">Paused</option>
                <option value="dropped">Dropped</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mb-6 mt-10 flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Watch collection</h2>
          <span aria-live="polite" className="text-sm text-muted-foreground">{results.length} titles</span>
        </div>

        {hasDatabaseError ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">The catalog could not be loaded. Please try again later.</div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
            <Clapperboard aria-hidden="true" className="mx-auto mb-4 h-9 w-9 text-violet-700 dark:text-violet-300" />
            <h3 className="text-lg font-medium">{entries.length ? "No matching titles" : "The collection is empty"}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{entries.length ? "Try a different search or filter." : "Titles will appear here once they are added."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {results.map((entry) => {
              return (
                <article key={entry.id} className="group min-w-0 overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-colors hover:border-violet-500 dark:hover:border-violet-300 motion-reduce:transition-none">
                  <WatchPoster entry={entry} />
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 text-base font-semibold leading-snug">{entry.title}</h3>
                      {entry.rating ? <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-amber-700 dark:text-amber-300"><Star aria-hidden="true" className="h-3.5 w-3.5 fill-current" />{entry.rating}</span> : null}
                    </div>
                    {entry.year ? <p className="mt-2 text-xs text-muted-foreground">{entry.year}</p> : null}
                    <p className="mt-1 text-xs text-violet-700 dark:text-violet-300">{(Object.keys(entry.tracking).length ? Object.keys(entry.tracking) : [entry.source]).map((source) => sourceLabels[source as keyof typeof sourceLabels] ?? source).join(" · ")}</p>
                    {entry.watchedAt ? <p className="mt-1 text-xs text-muted-foreground">Watched {watchedDateFormatter.format(new Date(entry.watchedAt))}</p> : null}
                    {entry.notes ? <p className="mt-4 line-clamp-3 border-t border-border pt-3 text-sm leading-6 text-muted-foreground">{entry.notes}</p> : null}
                    {Object.keys(entry.tracking).length > 0 ? <details className="mt-4 border-t border-border pt-3 text-sm">
                      <summary className="cursor-pointer rounded font-medium focus-visible:outline-2 focus-visible:outline-ring">History & reviews</summary>
                      <div className="mt-3 space-y-4 text-xs leading-5 text-muted-foreground">
                        {Object.entries(entry.tracking).map(([source, data]) => <section key={source} className="space-y-2">
                          <h4 className="font-semibold text-foreground">{sourceLabels[source as keyof typeof sourceLabels] ?? source} · {statusLabels[data.status as WatchStatus] ?? data.status}{data.rating ? ` · ${data.rating}/10` : ""}</h4>
                          {data.addedAt ? <p>Marked watched {watchedDateFormatter.format(new Date(data.addedAt))}</p> : null}
                          {data.watchedAt ? <p>Watched {watchedDateFormatter.format(new Date(data.watchedAt))}</p> : null}
                          {data.watchlistedAt ? <p>Watchlisted {watchedDateFormatter.format(new Date(data.watchlistedAt))}</p> : null}
                          {data.likedAt ? <p>Liked {watchedDateFormatter.format(new Date(data.likedAt))}</p> : null}
                          {data.ratedAt ? <p>Rated {watchedDateFormatter.format(new Date(data.ratedAt))}</p> : null}
                          {data.events?.length ? <p>{data.events.length} diary {data.events.length === 1 ? "entry" : "entries"}</p> : null}
                          {data.uri && /^https:\/\/(boxd\.it|letterboxd\.com|anilist\.co)\//.test(data.uri) ? <a href={data.uri} target="_blank" rel="noreferrer" className="inline-block underline underline-offset-4">View on {sourceLabels[source as keyof typeof sourceLabels] ?? source}</a> : null}
                          {(data.events ?? []).map((event, index) => <div key={`${event.uri}-${index}`} className="space-y-2 border-l-2 border-violet-300 pl-3">
                            <p>{event.watchedAt ? watchedDateFormatter.format(new Date(event.watchedAt)) : "Undated entry"}{event.rewatch ? " · Rewatch" : ""}{event.rating ? ` · ${event.rating}/10` : ""}</p>
                            {event.loggedAt ? <p>Logged {watchedDateFormatter.format(new Date(event.loggedAt))}</p> : null}
                            {event.review ? <p className="whitespace-pre-wrap break-words text-foreground">{event.review}</p> : null}
                            {event.tags.length ? <p>Tags: {event.tags.join(", ")}</p> : null}
                            {event.uri && /^https:\/\/(boxd\.it|letterboxd\.com)\//.test(event.uri) ? <a href={event.uri} target="_blank" rel="noreferrer" className="inline-block underline underline-offset-4">Original diary / review</a> : null}
                          </div>)}
                        </section>)}
                      </div>
                    </details> : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 border-t border-border px-6 py-6 text-xs text-muted-foreground">
        <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" aria-label="The Movie Database (TMDB)" className="rounded bg-white px-2 py-1">
          {/* Official logo from TMDB's Logos & Attribution page. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_2-9665a76b1ae401a510ec1e0ca40ddcb3b0cfe45f1d51b77a308fea0845885648.svg" alt="TMDB" className="h-5 w-auto" loading="lazy" />
        </a>
        <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
      </footer>
    </main>
  );
}
