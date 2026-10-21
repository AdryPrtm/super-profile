import { headers } from "next/headers";
import { auth } from "@super-profile-dry/auth";

export async function hasAdminAccess() {
  const session = await auth.api.getSession({ headers: await headers() });
  // Accounts are provisioned by the site owner; public sign-up is disabled.
  return Boolean(session?.user);
}
