"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@super-profile-dry/db";
import { hasAdminAccess } from "@/features/profile-content/auth/admin-access";
import type { WatchCategory, WatchStatus } from "./watch-data";

const categories: WatchCategory[] = ["film", "series", "anime"];
const statuses: WatchStatus[] = ["completed", "watching", "planned", "paused", "dropped"];

function optionalText(value: FormDataEntryValue | null, maxLength: number) {
  const text = String(value ?? "").trim();
  return text ? text.slice(0, maxLength) : null;
}

function readEntry(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim().slice(0, 200);
  const category = String(formData.get("category") ?? "") as WatchCategory;
  const status = String(formData.get("status") ?? "") as WatchStatus;
  const yearText = String(formData.get("year") ?? "").trim();
  const ratingText = String(formData.get("rating") ?? "").trim();
  const dateText = String(formData.get("watchedAt") ?? "").trim();
  const posterText = optionalText(formData.get("posterUrl"), 1000);

  if (!title || !categories.includes(category) || !statuses.includes(status)) {
    throw new Error("Judul, kategori, atau status tidak valid.");
  }

  const year = yearText ? Number(yearText) : null;
  const rating = ratingText ? Number(ratingText) : null;
  if (year !== null && (!Number.isInteger(year) || year < 1888 || year > 2100)) {
    throw new Error("Tahun tidak valid.");
  }
  if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 10)) {
    throw new Error("Rating harus 1 sampai 10.");
  }

  let posterUrl: string | null = null;
  if (posterText) {
    try {
      const url = new URL(posterText);
      if (!(["http:", "https:"].includes(url.protocol))) throw new Error();
      posterUrl = url.toString();
    } catch {
      throw new Error("URL poster harus menggunakan http atau https.");
    }
  }

  let watchedAt: Date | null = null;
  if (dateText) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) throw new Error("Tanggal tidak valid.");
    watchedAt = new Date(`${dateText}T12:00:00.000Z`);
    if (Number.isNaN(watchedAt.getTime()) || watchedAt.toISOString().slice(0, 10) !== dateText) {
      throw new Error("Tanggal tidak valid.");
    }
  }

  return {
    title,
    category,
    status,
    year,
    rating,
    posterUrl,
    notes: optionalText(formData.get("notes"), 2000),
    watchedAt: status === "completed" ? watchedAt : null,
  };
}

export async function saveWatchEntry(formData: FormData) {
  if (!(await hasAdminAccess())) redirect("/admin?error=access");

  try {
    const data = readEntry(formData);
    const id = String(formData.get("id") ?? "").trim();
    if (id) {
      await prisma.watchEntry.update({ where: { id }, data });
    } else {
      await prisma.watchEntry.create({ data });
    }
  } catch (error) {
    console.error("Failed to save watch entry", error);
    redirect("/admin/watch?error=save");
  }

  revalidatePath("/watch");
  revalidatePath("/admin/watch");
  redirect("/admin/watch?saved=1");
}

export async function deleteWatchEntry(formData: FormData) {
  if (!(await hasAdminAccess())) redirect("/admin?error=access");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/watch?error=delete");

  try {
    await prisma.watchEntry.delete({ where: { id } });
  } catch (error) {
    console.error("Failed to delete watch entry", error);
    redirect("/admin/watch?error=delete");
  }

  revalidatePath("/watch");
  revalidatePath("/admin/watch");
  redirect("/admin/watch?deleted=1");
}
