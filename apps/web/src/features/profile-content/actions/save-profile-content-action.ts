"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { hasAdminAccess } from "@/features/profile-content/auth/admin-access";
import { saveProfileContent } from "@/features/profile-content/data/profile-content";
import { buildProfileContentFromFormData } from "@/features/profile-content/utils/profile-content-codec";

export async function saveAdminProfileContent(formData: FormData) {
  if (!(await hasAdminAccess())) {
    redirect("/admin?error=access");
  }

  const content = buildProfileContentFromFormData(formData);

  try {
    await saveProfileContent(content);
  } catch (error) {
    console.error("Failed to save profile content", error);
    redirect("/admin?error=database");
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=1");
}
