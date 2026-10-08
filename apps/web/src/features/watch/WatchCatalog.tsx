"use client";

import { useMemo, useState } from "react";
import { Clapperboard, Search, Star, Tv2, Sparkles } from "lucide-react";
import type { WatchCategory, WatchEntry, WatchStatus } from "./watch-data";

const categoryLabels: Record<WatchCategory, string> = {
  film: "Film",
  series: "Series",
  anime: "Anime",
};

const statusLabels: Record<WatchStatus, string> = {
  completed: "Selesai ditonton",
  watching: "Sedang ditonton",
  planned: "Ingin ditonton",
  paused: "Ditunda",
  dropped: "Dihentikan",
};

const sourceLabels = { manual: "Pilihan saya", anilist: "AniList", netflix: "Netflix", letterboxd: "Letterboxd" };

const categoryIcons = {
  film: Clapperboard,
  series: Tv2,
  anime: Sparkles,
};

const watchedDateFormatter = new Intl.DateTimeFormat("id-ID", {
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
    const search = query.trim().toLocaleLowerCase("id-ID");
    return entries.filter((entry) =>
      (category === "all" || entry.category === category) &&
      (status === "all" || entry.status === status) &&
      (!search || `${entry.title} ${entry.notes ?? ""} ${entry.year ?? ""}`.toLocaleLowerCase("id-ID").includes(search)),
    );
  }, [entries, query, category, status]);

  const completedCount = entries.filter((entry) => entry.status === "completed").length;
  const watchingCount = entries.filter((entry) => entry.status === "watching").length;

  return (
    <main id="main-content" className="min-h-full bg-[#0b0c13] text-[#f6f4f1]">
      <div className="relative overflow-hidden border-b border-white/10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-48 h-[32rem] w-[32rem] rounded-full bg-violet-600/20 blur-[110px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-44 h-72 w-72 rounded-full bg-rose-600/10 blur-[100px]" />
        <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-16 sm:pb-16 sm:pt-24">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">My watch journal</p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">
            Semua <span className="text-violet-300">tontonan saya.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
            Film, series, dan anime yang sudah saya tonton, sedang saya ikuti, atau masuk daftar berikutnya. Cari judul dan jelajahi koleksinya di sini.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/10 pt-7">
            <div><strong className="block text-3xl font-semibold tabular-nums">{completedCount}</strong><span className="text-sm text-white/45">Selesai ditonton</span></div>
            <div><strong className="block text-3xl font-semibold tabular-nums">{watchingCount}</strong><span className="text-sm text-white/45">Sedang ditonton</span></div>
            <div><strong className="block text-3xl font-semibold tabular-nums">{entries.length}</strong><span className="text-sm text-white/45">Judul tercatat</span></div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-14" aria-label="Katalog tontonan">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
            {(["all", "film", "series", "anime"] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={`min-h-11 cursor-pointer rounded-full border px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 ${category === item ? "border-violet-300 bg-violet-300 text-[#171122]" : "border-white/25 text-white/75 hover:border-white/50 hover:text-white"}`}
              >
                {item === "all" ? "Semua" : categoryLabels[item]}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block">
              <Search aria-hidden="true" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <span className="sr-only">Cari judul tontonan</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari judul..."
                className="h-11 w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-violet-300 sm:w-56"
              />
            </label>
            <label className="block">
              <span className="sr-only">Filter status tontonan</span>
              <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} className="h-11 w-full rounded-xl border border-white/15 bg-[#181922] px-4 text-sm text-white outline-none focus:border-violet-300 sm:w-48">
                <option value="all">Semua status</option>
                <option value="completed">Selesai ditonton</option>
                <option value="watching">Sedang ditonton</option>
                <option value="planned">Ingin ditonton</option>
                <option value="paused">Ditunda</option>
                <option value="dropped">Dihentikan</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mb-6 mt-10 flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Koleksi tontonan</h2>
          <span aria-live="polite" className="text-sm text-white/70">{results.length} judul</span>
        </div>

        {hasDatabaseError ? (
          <div className="rounded-2xl border border-rose-400/25 bg-rose-400/10 p-6 text-sm text-rose-100">Katalog belum dapat dimuat. Silakan coba lagi nanti.</div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
            <Clapperboard aria-hidden="true" className="mx-auto mb-4 h-9 w-9 text-violet-300/70" />
            <h3 className="text-lg font-medium">{entries.length ? "Tidak ada judul yang cocok" : "Koleksi belum dimulai"}</h3>
            <p className="mt-2 text-sm text-white/45">{entries.length ? "Coba ubah pencarian atau filter yang dipilih." : "Judul tontonan akan tampil di sini setelah ditambahkan."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {results.map((entry) => {
              const Icon = categoryIcons[entry.category] ?? Clapperboard;
              return (
                <article key={entry.id} className="group min-w-0 overflow-hidden rounded-2xl border border-white/20 bg-[#171821] transition-colors hover:border-violet-300/60 motion-reduce:transition-none">
                  <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-violet-900/60 via-[#282335] to-[#12131b]">
                    {entry.posterUrl ? (
                      // External poster URLs are entered by the site owner and validated on save.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={entry.posterUrl} alt={`Poster ${entry.title}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none" />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-4 p-5 text-center">
                        <Icon aria-hidden="true" className="h-10 w-10 text-violet-200/55" />
                        <span className="text-lg font-semibold leading-snug tracking-tight text-white/70">{entry.title}</span>
                      </div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-[#101018]/80 px-2.5 py-1 text-[11px] font-medium backdrop-blur">{categoryLabels[entry.category] ?? entry.category}</span>
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 text-base font-semibold leading-snug">{entry.title}</h3>
                      {entry.rating ? <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-amber-300"><Star aria-hidden="true" className="h-3.5 w-3.5 fill-current" />{entry.rating}</span> : null}
                    </div>
                    <p className="mt-2 text-xs text-white/70">{entry.year ? `${entry.year} · ` : ""}{statusLabels[entry.status] ?? entry.status}</p>
                    <p className="mt-1 text-xs text-violet-200/75">{sourceLabels[entry.source] ?? entry.source}</p>
                    {entry.watchedAt ? <p className="mt-1 text-xs text-white/60">Ditonton {watchedDateFormatter.format(new Date(entry.watchedAt))}</p> : null}
                    {entry.notes ? <p className="mt-4 line-clamp-3 border-t border-white/20 pt-3 text-sm leading-6 text-white/75">{entry.notes}</p> : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
