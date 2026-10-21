import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { hasAdminAccess } from "@/features/profile-content/auth/admin-access";
import { signOutAdmin } from "@/features/profile-content/actions/admin-session-actions";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasAdminAccess())) redirect("/login");
  return (
    <>
      <div className="border-b border-border bg-muted/30 px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 py-2">
          <p className="text-sm text-muted-foreground">Signed in as administrator</p>
          <form action={signOutAdmin}>
            <button type="submit" className="min-h-11 rounded-md px-4 text-sm font-medium hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              Log out
            </button>
          </form>
        </div>
      </div>
      {children}
    </>
  );
}
