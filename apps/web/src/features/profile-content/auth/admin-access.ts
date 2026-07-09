import { cookies } from "next/headers";

export const ADMIN_ACCESS_COOKIE = "profile_admin_access";

export function getAdminAccessKey() {
  return process.env.ADMIN_CONTENT_KEY?.trim() ?? "";
}

export async function hasAdminAccess() {
  const accessKey = getAdminAccessKey();

  if (!accessKey) {
    return process.env.NODE_ENV !== "production";
  }

  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_ACCESS_COOKIE)?.value === accessKey;
}
