import { AdminProfileForm } from "@/features/profile-content/components/admin/AdminProfileForm";
import type { ProfileContent } from "@/features/profile-content/data/profile-content";

type AdminProfilePageProps = {
  content: ProfileContent;
  hasDatabaseError: boolean;
  saved: boolean;
};

export function AdminProfilePage({
  content,
  hasDatabaseError,
  saved,
}: AdminProfilePageProps) {
  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col justify-between gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-light tracking-tight">
              Profile Content
            </h1>
          </div>
          <a
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View public CV
          </a>
        </div>

        {saved ? (
          <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
            Content saved.
          </div>
        ) : null}

        {hasDatabaseError ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Content could not be saved. Make sure the database is running and
            the Prisma schema has been pushed.
          </div>
        ) : null}

        <AdminProfileForm content={content} />
      </div>
    </main>
  );
}
