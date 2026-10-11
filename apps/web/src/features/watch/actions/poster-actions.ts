"use server";

import { revalidatePath } from "next/cache";
import prisma from "@super-profile-dry/db";
import { hasAdminAccess } from "@/features/profile-content/auth/admin-access";
import { findTmdbPoster } from "../data/tmdb-posters";

const BATCH_SIZE = 12;

export type PosterBatchResult = {
  checked: number;
  updated: number;
  nextId: string | null;
  done: boolean;
};

export async function fillMissingPosters(input: {
  token?: string;
  afterId?: string;
}): Promise<PosterBatchResult> {
  if (!(await hasAdminAccess())) throw new Error("Admin access is required.");

  const token = (process.env.TMDB_READ_ACCESS_TOKEN || input.token || "").trim();
  if (!token || token.length > 2000) throw new Error("Enter a valid TMDB API Read Access Token.");

  const entries = await prisma.watchEntry.findMany({
    where: {
      posterUrl: null,
      category: { in: ["film", "series"] },
      ...(input.afterId ? { id: { gt: input.afterId } } : {}),
    },
    select: { id: true, title: true, category: true, year: true },
    orderBy: { id: "asc" },
    take: BATCH_SIZE,
  });

  let updated = 0;
  for (let index = 0; index < entries.length; index += 3) {
    const chunk = entries.slice(index, index + 3);
    await Promise.all(chunk.map(async (entry) => {
      const posterUrl = await findTmdbPoster(entry, token);
      if (!posterUrl) return;
      const result = await prisma.watchEntry.updateMany({
        where: { id: entry.id, posterUrl: null },
        data: { posterUrl },
      });
      updated += result.count;
    }));
  }

  if (updated) {
    revalidatePath("/watch");
    revalidatePath("/admin/watch");
  }

  return {
    checked: entries.length,
    updated,
    nextId: entries.at(-1)?.id ?? null,
    done: entries.length < BATCH_SIZE,
  };
}
