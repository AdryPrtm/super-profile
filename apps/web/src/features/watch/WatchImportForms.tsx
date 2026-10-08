"use client";

import { useFormStatus } from "react-dom";
import { importLetterboxdCsv, importNetflixCsv, syncAniList } from "./watch-import-actions";

const fieldClass = "mt-2 block min-h-11 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm";

function ImportButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="min-h-11 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:cursor-wait disabled:opacity-50">{pending ? "Mengimpor..." : label}</button>;
}

export function WatchImportForms() {
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-7" aria-labelledby="watch-import-heading">
      <h2 id="watch-import-heading" className="text-xl font-semibold">Ambil riwayat tontonan</h2>
      <p className="mt-2 text-sm text-muted-foreground">Impor ulang akan memperbarui judul dari sumber yang sama. Semua proses hanya tersedia di halaman admin.</p>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <form action={syncAniList} className="flex flex-col rounded-xl border border-border p-5">
          <h3 className="font-semibold">AniList</h3>
          <p className="mt-2 flex-1 text-sm text-muted-foreground">Ambil daftar anime publik langsung melalui username. Status dan rating ikut disalin.</p>
          <label className="mt-5 block text-sm font-medium">Username AniList
            <input name="username" required minLength={2} maxLength={30} autoComplete="off" placeholder="username" className={fieldClass} />
          </label>
          <div className="mt-4"><ImportButton label="Sinkronkan AniList" /></div>
        </form>
        <form action={importNetflixCsv} className="flex flex-col rounded-xl border border-border p-5">
          <h3 className="font-semibold">Netflix</h3>
          <p className="mt-2 flex-1 text-sm text-muted-foreground">Di Netflix buka Account → Profiles → Viewing activity → Download all, lalu unggah CSV riwayat tontonan.</p>
          <label className="mt-5 block text-sm font-medium">CSV Netflix
            <input name="file" type="file" accept=".csv,text/csv" required className={fieldClass} />
          </label>
          <label className="mt-4 block text-sm font-medium">Format tanggal di CSV
            <select name="dateOrder" defaultValue="MDY" className={fieldClass}>
              <option value="MDY">Bulan/Hari/Tahun</option>
              <option value="DMY">Hari/Bulan/Tahun</option>
            </select>
          </label>
          <div className="mt-4"><ImportButton label="Impor Netflix" /></div>
        </form>
        <form action={importLetterboxdCsv} className="flex flex-col rounded-xl border border-border p-5">
          <h3 className="font-semibold">Letterboxd</h3>
          <p className="mt-2 flex-1 text-sm text-muted-foreground">Unduh ekspor data Letterboxd, buka ZIP, lalu pilih watched.csv. Tambahkan diary.csv dan ratings.csv agar tanggal dan rating ikut terbaca.</p>
          <label className="mt-5 block text-sm font-medium">CSV ekspor Letterboxd
            <input name="files" type="file" accept=".csv,text/csv" multiple required className={fieldClass} />
          </label>
          <div className="mt-4"><ImportButton label="Impor Letterboxd" /></div>
        </form>
      </div>
    </section>
  );
}
