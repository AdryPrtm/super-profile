"use server";

import { randomUUID } from "node:crypto";

import { hasAdminAccess } from "@/features/profile-content/auth/admin-access";
import { PROJECT_IMAGE_BUCKET, getStorageClient } from "@/lib/supabase-storage";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];

export async function uploadHeroImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  if (!(await hasAdminAccess())) return { error: "Admin access is required." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a PNG image." };
  if (file.type !== "image/png") return { error: "Only PNG images are supported." };
  if (file.size > MAX_IMAGE_BYTES) return { error: "The image exceeds the 5 MB limit." };

  const signature = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (!PNG_SIGNATURE.every((byte, index) => signature[index] === byte)) {
    return { error: "This file is not a valid PNG image." };
  }

  const storage = getStorageClient();
  if (!storage) return { error: "Image storage is not configured." };

  const path = `profile/${randomUUID()}.png`;
  const { error } = await storage.storage.from(PROJECT_IMAGE_BUCKET).upload(path, file, {
    contentType: "image/png",
    upsert: false,
  });
  if (error) {
    console.error("Failed to upload hero image", error);
    if ("code" in error && error.code === "NoSuchBucket") {
      return { error: `Storage bucket "${PROJECT_IMAGE_BUCKET}" was not found. Ask the administrator to create it in Supabase Storage.` };
    }
    return { error: "Could not upload the PNG image. Please try again." };
  }

  return { url: storage.storage.from(PROJECT_IMAGE_BUCKET).getPublicUrl(path).data.publicUrl };
}
