"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@super-profile-dry/auth";

export async function signOutAdmin() {
  await auth.api.signOut({ headers: await headers() });
  // Clear legacy access-key cookies during the transition to user sessions.
  const cookieStore = await cookies();
  cookieStore.set("profile_admin_access", "", { path: "/", maxAge: 0 });
  cookieStore.set("profile_admin_access", "", { path: "/admin", maxAge: 0 });
  redirect("/login");
}
