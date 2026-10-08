"use client";

import { useFormStatus } from "react-dom";
import { importLetterboxdCsv, importNetflixCsv, syncAniList } from "../../actions/watch-import-actions";

const fieldClass = "mt-2 block min-h-11 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm";

function ImportButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="min-h-11 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:cursor-wait disabled:opacity-50">{pending ? "Importing..." : label}</button>;
}

export function WatchImportForms() {
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-7" aria-labelledby="watch-import-heading">
      <h2 id="watch-import-heading" className="text-xl font-semibold">Import watch history</h2>
      <p className="mt-2 text-sm text-muted-foreground">Importing again updates titles from the same source. Import tools are available only to the site admin.</p>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <form action={syncAniList} className="flex flex-col rounded-xl border border-border p-5">
          <h3 className="font-semibold">AniList</h3>
          <p className="mt-2 flex-1 text-sm text-muted-foreground">Fetch a public anime list by username, including watch status and ratings.</p>
          <label className="mt-5 block text-sm font-medium">Username AniList
            <input name="username" required minLength={2} maxLength={30} autoComplete="off" placeholder="username" className={fieldClass} />
          </label>
          <div className="mt-4"><ImportButton label="Sync AniList" /></div>
        </form>
        <form action={importNetflixCsv} className="flex flex-col rounded-xl border border-border p-5">
          <h3 className="font-semibold">Netflix</h3>
          <p className="mt-2 flex-1 text-sm text-muted-foreground">In Netflix, go to Account → Profiles → Viewing activity → Download all, then upload the CSV file.</p>
          <label className="mt-5 block text-sm font-medium">CSV Netflix
            <input name="file" type="file" accept=".csv,text/csv" required className={fieldClass} />
          </label>
          <label className="mt-4 block text-sm font-medium">Date format in the CSV
            <select name="dateOrder" defaultValue="MDY" className={fieldClass}>
              <option value="MDY">Month/Day/Year</option>
              <option value="DMY">Day/Month/Year</option>
            </select>
          </label>
          <div className="mt-4"><ImportButton label="Import Netflix" /></div>
        </form>
        <form action={importLetterboxdCsv} className="flex flex-col rounded-xl border border-border p-5">
          <h3 className="font-semibold">Letterboxd</h3>
          <p className="mt-2 flex-1 text-sm text-muted-foreground">Download your Letterboxd export, open the ZIP file, and select watched.csv. Add diary.csv and ratings.csv to include watch dates and ratings.</p>
          <label className="mt-5 block text-sm font-medium">Letterboxd export CSV files
            <input name="files" type="file" accept=".csv,text/csv" multiple required className={fieldClass} />
          </label>
          <div className="mt-4"><ImportButton label="Import Letterboxd" /></div>
        </form>
      </div>
    </section>
  );
}
