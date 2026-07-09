"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_ACCESS_COOKIE,
  getAdminAccessKey,
} from "@/features/profile-content/auth/admin-access";
import { getText } from "@/features/profile-content/utils/form-data";

export async function signInAdmin(formData: FormData) {
  const accessKey = getAdminAccessKey();
  const submittedKey = getText(formData, "adminKey", "");

  if (accessKey && submittedKey === accessKey) {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_ACCESS_COOKIE, accessKey, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/admin",
    });
    redirect("/admin");
  }

  redirect("/admin?error=access");
}
