"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@super-profile-dry/db";
import { hasAdminAccess } from "@/features/profile-content/auth/admin-access";
import { parseLetterboxdCsv, parseNetflixCsv, type ImportedWatch } from "./watch-import-data";

type AniListEntry = {
  status: string;
  score: number;
  completedAt: { year: number | null; month: number | null; day: number | null } | null;
  media: {
    id: number;
    title: { english: string | null; romaji: string | null; native: string | null };
    seasonYear: number | null;
    startDate: { year: number | null } | null;
    coverImage: { large: string | null } | null;
  } | null;
};

async function saveImported(entries: ImportedWatch[]) {
  let count = 0;
  for (let i = 0; i < entries.length; i += 10) {
    const batch = entries.slice(i, i + 10);
    await Promise.all(batch.map(async (entry) => {
      const { externalId, ...data } = entry;
      await prisma.watchEntry.upsert({
        where: { externalId },
        create: { externalId, ...data },
        update: data,
      });
      count++;
    }));
  }
  return count;
}

function finishImport(source: string, count: number) {
  revalidatePath("/watch");
  revalidatePath("/admin/watch");
  redirect(`/admin/watch?imported=${encodeURIComponent(source)}&count=${count}`);
}

function importError(source: string, error: unknown): never {
  console.error(`Failed to import ${source} watch history`, error);
  const message = error instanceof Error ? error.message : "Impor gagal. Periksa berkas atau akun dan coba lagi.";
  redirect(`/admin/watch?importError=${encodeURIComponent(message.slice(0, 180))}`);
}

async function readCsvFile(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || !value.name.toLowerCase().endsWith(".csv") || value.size === 0 || value.size > 5 * 1024 * 1024) {
    throw new Error("Pilih berkas CSV dengan ukuran maksimal 5 MB.");
  }
  return { name: value.name, text: await value.text() };
}

export async function importNetflixCsv(formData: FormData) {
  if (!(await hasAdminAccess())) redirect("/admin?error=access");
  let count: number;
  try {
    const file = await readCsvFile(formData.get("file"));
    const dateOrder = formData.get("dateOrder") === "DMY" ? "DMY" : "MDY";
    count = await saveImported(parseNetflixCsv(file.text, dateOrder));
  } catch (error) { importError("Netflix", error); }
  finishImport("Netflix", count);
}

export async function importLetterboxdCsv(formData: FormData) {
  if (!(await hasAdminAccess())) redirect("/admin?error=access");
  let count: number;
  try {
    const values = formData.getAll("files");
    if (!values.length || values.length > 3) throw new Error("Pilih watched.csv, diary.csv, dan/atau ratings.csv.");
    const files = await Promise.all(values.map(readCsvFile));
    if (!files.every((file) => /(?:watched|diary|ratings)\.csv$/i.test(file.name))) {
      throw new Error("Pilih CSV watched, diary, atau ratings dari ekspor Letterboxd.");
    }
    count = await saveImported(parseLetterboxdCsv(files));
  } catch (error) { importError("Letterboxd", error); }
  finishImport("Letterboxd", count);
}

export async function syncAniList(formData: FormData) {
  if (!(await hasAdminAccess())) redirect("/admin?error=access");
  let count: number;
  try {
    const username = String(formData.get("username") ?? "").trim();
    if (!/^[A-Za-z0-9_]{2,30}$/.test(username)) throw new Error("Masukkan username AniList yang valid.");
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        query: `query ($name: String) { MediaListCollection(userName: $name, type: ANIME) { lists { entries { status score(format: POINT_10) completedAt { year month day } media { id title { english romaji native } seasonYear startDate { year } coverImage { large } } } } } }`,
        variables: { name: username },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(response.status === 404 ? "Akun AniList tidak ditemukan." : `AniList tidak dapat dihubungi (${response.status}).`);
    const result = await response.json() as { data?: { MediaListCollection?: { lists?: Array<{ entries?: AniListEntry[] }> } }; errors?: Array<{ message: string }> };
    if (result.errors?.length) throw new Error(result.errors[0].message);
    const lists = result.data?.MediaListCollection?.lists;
    if (!lists) throw new Error("Daftar anime tidak ditemukan atau akun bersifat privat.");
    const entries: ImportedWatch[] = lists.flatMap((list) => list.entries ?? []).flatMap((item) => {
      const media = item.media;
      if (!media) return [];
      const title = media.title.english || media.title.romaji || media.title.native;
      if (!title) return [];
      const dateParts = item.completedAt;
      const watchedAt = dateParts?.year && dateParts.month && dateParts.day
        ? new Date(Date.UTC(dateParts.year, dateParts.month - 1, dateParts.day, 12)) : null;
      return [{
        externalId: `anilist:${media.id}`, source: "anilist" as const, title: title.slice(0, 200), category: "anime" as const,
        status: item.status === "COMPLETED" ? "completed" as const
          : item.status === "CURRENT" || item.status === "REPEATING" ? "watching" as const
          : item.status === "PAUSED" ? "paused" as const
          : item.status === "DROPPED" ? "dropped" as const : "planned" as const,
        year: media.seasonYear ?? media.startDate?.year ?? null,
        posterUrl: media.coverImage?.large ?? null,
        rating: item.score > 0 ? Math.min(10, Math.max(1, Math.round(item.score))) : null,
        watchedAt,
      }];
    });
    count = await saveImported(entries);
  } catch (error) { importError("AniList", error); }
  finishImport("AniList", count);
}
