import { saveWatchEntry } from "./watch-actions";
import { SaveWatchButton } from "./WatchFormButtons";
import type { WatchEntry } from "./watch-data";

const fieldClass = "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring";

export function WatchAdminForm({ entry }: { entry?: WatchEntry }) {
  return (
    <form action={saveWatchEntry} className="grid gap-4 sm:grid-cols-2">
      {entry ? <input type="hidden" name="id" value={entry.id} /> : null}
      <label className="block text-sm font-medium sm:col-span-2">
        Judul <span className="text-destructive">*</span>
        <input name="title" required maxLength={200} defaultValue={entry?.title ?? ""} placeholder="Contoh: Spirited Away" className={fieldClass} />
      </label>
      <label className="block text-sm font-medium">
        Kategori <span className="text-destructive">*</span>
        <select name="category" required defaultValue={entry?.category ?? "film"} className={fieldClass}>
          <option value="film">Film</option>
          <option value="series">Series</option>
          <option value="anime">Anime</option>
        </select>
      </label>
      <label className="block text-sm font-medium">
        Status <span className="text-destructive">*</span>
        <select name="status" required defaultValue={entry?.status ?? "completed"} className={fieldClass}>
          <option value="completed">Selesai ditonton</option>
          <option value="watching">Sedang ditonton</option>
          <option value="planned">Ingin ditonton</option>
          <option value="paused">Ditunda</option>
          <option value="dropped">Dihentikan</option>
        </select>
      </label>
      <label className="block text-sm font-medium">
        Tahun rilis
        <input name="year" type="number" min={1888} max={2100} defaultValue={entry?.year ?? ""} placeholder="2024" className={fieldClass} />
      </label>
      <label className="block text-sm font-medium">
        Rating pribadi (1–10)
        <input name="rating" type="number" min={1} max={10} defaultValue={entry?.rating ?? ""} placeholder="8" className={fieldClass} />
      </label>
      <label className="block text-sm font-medium">
        Tanggal selesai
        <input name="watchedAt" type="date" defaultValue={entry?.watchedAt?.slice(0, 10) ?? ""} className={fieldClass} />
      </label>
      <label className="block text-sm font-medium">
        URL poster
        <input name="posterUrl" type="url" maxLength={1000} defaultValue={entry?.posterUrl ?? ""} placeholder="https://..." className={fieldClass} />
      </label>
      <label className="block text-sm font-medium sm:col-span-2">
        Catatan singkat
        <textarea name="notes" rows={3} maxLength={2000} defaultValue={entry?.notes ?? ""} placeholder="Apa yang membuat judul ini berkesan?" className={fieldClass} />
      </label>
      <div className="sm:col-span-2">
        <SaveWatchButton editing={Boolean(entry)} />
      </div>
    </form>
  );
}
