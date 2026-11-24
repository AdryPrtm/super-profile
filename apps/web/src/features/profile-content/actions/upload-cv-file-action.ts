"use server";

import { randomUUID } from "node:crypto";

import { hasAdminAccess } from "@/features/profile-content/auth/admin-access";
import { CV_DOWNLOAD_FILENAME } from "@/features/profile-content/utils/profile-links";
import { PROJECT_IMAGE_BUCKET, getStorageClient } from "@/lib/supabase-storage";

const MAX_CV_BYTES = 10 * 1024 * 1024;
const PDF_SIGNATURE = [37, 80, 68, 70, 45];

export async function uploadCvFile(formData: FormData): Promise<{ url?: string; error?: string }> {
  if (!(await hasAdminAccess())) return { error: "Admin access is required." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a PDF file." };
  if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
    return { error: "Only PDF files are supported." };
  }
  if (file.size > MAX_CV_BYTES) return { error: "The PDF exceeds the 10 MB limit." };

  const signature = new Uint8Array(await file.slice(0, PDF_SIGNATURE.length).arrayBuffer());
  if (!PDF_SIGNATURE.every((byte, index) => signature[index] === byte)) {
    return { error: "This file is not a valid PDF." };
  }

  const storage = getStorageClient();
  if (!storage) return { error: "File storage is not configured." };

  const { data: bucket, error: bucketError } = await storage.storage.getBucket(PROJECT_IMAGE_BUCKET);
  if (bucketError || !bucket) {
    return { error: `Storage bucket "${PROJECT_IMAGE_BUCKET}" was not found or could not be accessed.` };
  }
  if (!bucket.public) {
    return { error: `Storage bucket "${PROJECT_IMAGE_BUCKET}" must be public so visitors can download the CV.` };
  }

  const path = `cv/${randomUUID()}.pdf`;
  const { error } = await storage.storage.from(PROJECT_IMAGE_BUCKET).upload(path, file, {
    contentType: "application/pdf",
    upsert: false,
  });
  if (error) {
    console.error("Failed to upload CV", error);
    if ("code" in error && error.code === "NoSuchBucket") {
      return { error: `Storage bucket "${PROJECT_IMAGE_BUCKET}" was not found.` };
    }
    return { error: "Could not upload the PDF. Check that the storage bucket permits PDF files, then try again." };
  }

  return {
    url: storage.storage.from(PROJECT_IMAGE_BUCKET).getPublicUrl(path, { download: CV_DOWNLOAD_FILENAME }).data.publicUrl,
  };
}
