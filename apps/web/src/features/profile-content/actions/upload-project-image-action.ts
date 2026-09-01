"use server";

import { randomUUID } from "node:crypto";

import { hasAdminAccess } from "@/features/profile-content/auth/admin-access";
import {
  PROJECT_IMAGE_BUCKET,
  getStorageClient,
} from "@/lib/supabase-storage";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export type UploadProjectImageResult =
  | { url: string; error?: undefined }
  | { url?: undefined; error: string };

function safeExtension(fileName: string, mimeType: string) {
  const fromName = fileName.split(".").pop()?.toLowerCase() ?? "";

  if (/^[a-z0-9]{1,5}$/.test(fromName)) {
    return fromName;
  }

  return mimeType === "image/svg+xml" ? "svg" : (mimeType.split("/")[1] ?? "png");
}

export async function uploadProjectImage(
  formData: FormData,
): Promise<UploadProjectImageResult> {
  if (!(await hasAdminAccess())) {
    return { error: "Tidak punya akses admin." };
  }

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "File tidak terbaca." };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      error: `Format ${file.type || "tidak dikenal"} tidak didukung.`,
    };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Ukuran gambar melebihi 5 MB." };
  }

  const storage = getStorageClient();

  if (!storage) {
    return {
      error:
        "Upload belum aktif: SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY belum diisi di apps/web/.env",
    };
  }

  const path = `projects/${randomUUID()}.${safeExtension(file.name, file.type)}`;

  const { error } = await storage.storage
    .from(PROJECT_IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error("Failed to upload project image", error);
    return {
      error: `Gagal mengunggah ke bucket "${PROJECT_IMAGE_BUCKET}": ${error.message}`,
    };
  }

  const { data } = storage.storage
    .from(PROJECT_IMAGE_BUCKET)
    .getPublicUrl(path);

  return { url: data.publicUrl };
}
