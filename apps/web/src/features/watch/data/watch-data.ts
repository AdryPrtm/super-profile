import prisma from "@super-profile-dry/db";

export type WatchCategory = "film" | "series" | "anime";
export type WatchStatus = "completed" | "watching" | "planned" | "paused" | "dropped";
export type WatchSource = "manual" | "anilist" | "netflix" | "letterboxd";

export type WatchEntry = {
  id: string;
  title: string;
  category: WatchCategory;
  status: WatchStatus;
  source: WatchSource;
  year: number | null;
  posterUrl: string | null;
  rating: number | null;
  notes: string | null;
  watchedAt: string | null;
};

export async function getWatchEntries(): Promise<WatchEntry[]> {
  const entries = await prisma.watchEntry.findMany({
    orderBy: [{ watchedAt: "desc" }, { createdAt: "desc" }],
  });

  return entries.map((entry) => ({
    id: entry.id,
    title: entry.title,
    category: entry.category as WatchCategory,
    status: entry.status as WatchStatus,
    source: entry.source as WatchSource,
    year: entry.year,
    posterUrl: entry.posterUrl,
    rating: entry.rating,
    notes: entry.notes,
    watchedAt: entry.watchedAt?.toISOString() ?? null,
  }));
}
