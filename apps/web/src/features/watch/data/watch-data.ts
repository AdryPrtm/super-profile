import prisma from "@super-profile-dry/db";
import type { WatchTracking } from "../utils/watch-tracking";

export type WatchCategory = "film" | "series" | "anime";
export type WatchStatus = "completed" | "watching" | "planned" | "paused" | "dropped";
export type WatchSource = "manual" | "anilist" | "netflix" | "letterboxd";

export type WatchEntry = {
  id: string;
  title: string;
  category: WatchCategory;
  status: WatchStatus;
  source: WatchSource;
  tracking: WatchTracking;
  year: number | null;
  posterUrl: string | null;
  rating: number | null;
  notes: string | null;
  watchedAt: string | null;
};

export async function getWatchEntries(): Promise<WatchEntry[]> {
  const entries = await prisma.watchEntry.findMany({
    orderBy: [{ watchedAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
  });

  return entries.map((entry) => ({
    id: entry.id,
    title: entry.title,
    category: entry.category as WatchCategory,
    status: entry.status as WatchStatus,
    source: entry.source as WatchSource,
    tracking: entry.tracking as WatchTracking,
    year: entry.year,
    posterUrl: entry.posterUrl,
    rating: entry.rating,
    notes: entry.notes,
    watchedAt: entry.watchedAt?.toISOString() ?? null,
  }));
}
