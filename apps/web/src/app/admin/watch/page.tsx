import type { Metadata } from "next";
import { AdminAccessPage } from "@/page/admin/AdminAccessPage";
import { hasAdminAccess } from "@/features/profile-content/auth/admin-access";
import { deleteWatchEntry } from "@/features/watch/watch-actions";
import { WatchAdminForm } from "@/features/watch/WatchAdminForm";
import { DeleteWatchButton } from "@/features/watch/WatchFormButtons";
import { getWatchEntries } from "@/features/watch/watch-data";
import { WatchImportForms } from "@/features/watch/WatchImportForms";
import type { WatchEntry } from "@/features/watch/watch-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kelola Tontonan | super.profile",
};

type WatchAdminPageProps = {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string; imported?: string; count?: string; importError?: string }>;
};

export default async function WatchAdminPage({ searchParams }: WatchAdminPageProps) {
  if (!(await hasAdminAccess())) return <AdminAccessPage hasError={false} />;

  const params = await searchParams;
  let entries: WatchEntry[] = [];
  let hasDatabaseError = false;
  try {
    entries = await getWatchEntries();
  } catch (error) {
    console.error("Failed to load watch admin", error);
    hasDatabaseError = true;
  }

  return (
    <main id="main-content" className="min-h-full px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col justify-between gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Admin</p>
            <h1 className="mt-2 text-3xl font-light tracking-tight">Tracker tontonan</h1>
            <p className="mt-2 text-sm text-muted-foreground">Kelola film, series, dan anime yang tampil di halaman publik.</p>
          </div>
          <div className="flex gap-4 text-sm font-medium">
            <a href="/admin" className="text-muted-foreground hover:text-foreground">Profil</a>
            <a href="/watch" className="text-muted-foreground hover:text-foreground">Lihat tracker</a>
          </div>
        </div>

        {params.saved === "1" || params.deleted === "1" ? <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">{params.deleted === "1" ? "Tontonan dihapus." : "Tontonan disimpan."}</p> : null}
        {params.imported ? <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">{params.count ?? "0"} judul dari {params.imported} berhasil diproses.</p> : null}
        {params.importError ? <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{params.importError}</p> : null}
        {params.error || hasDatabaseError ? <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{hasDatabaseError ? "Data belum dapat dimuat. Pastikan database tersedia dan skema Prisma sudah diterapkan." : "Perubahan gagal disimpan. Periksa isian dan coba lagi."}</p> : null}

        <WatchImportForms />

        <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
          <h2 className="mb-5 text-xl font-semibold">Tambah tontonan</h2>
          <WatchAdminForm />
        </section>

        <section>
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-semibold">Judul tercatat</h2>
            <span className="text-sm text-muted-foreground">{entries.length} judul</span>
          </div>
          {entries.length === 0 ? <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Belum ada tontonan. Tambahkan judul pertama di atas.</p> : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <details key={entry.id} className="group rounded-xl border border-border bg-card p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 marker:hidden">
                    <span className="min-w-0 font-medium">{entry.title}<span className="ml-3 text-xs font-normal capitalize text-muted-foreground">{entry.category} · {entry.status} · {entry.source}</span></span>
                    <span className="shrink-0 text-xs text-muted-foreground group-open:hidden">Edit</span>
                  </summary>
                  <div className="mt-6 border-t border-border pt-6">
                    <WatchAdminForm entry={entry} />
                    <form action={deleteWatchEntry} className="mt-5 border-t border-border pt-5">
                      <input type="hidden" name="id" value={entry.id} />
                      <DeleteWatchButton />
                    </form>
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
