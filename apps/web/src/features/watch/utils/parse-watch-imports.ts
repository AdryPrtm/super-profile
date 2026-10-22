import { createHash } from "node:crypto";
import type { WatchCategory, WatchStatus } from "../data/watch-data";
import { mergeSource, type SourceTracking } from "./watch-tracking";

export type ImportedWatch = {
  externalId: string;
  source: "netflix" | "letterboxd" | "anilist";
  title: string;
  category: WatchCategory;
  status: WatchStatus;
  year: number | null;
  posterUrl: string | null;
  rating: number | null;
  watchedAt: Date | null;
  tracking?: SourceTracking;
};

type CsvRow = Record<string, string>;

function parseCsv(text: string): CsvRow[] {
  const records: string[][] = [];
  let record: string[] = [];
  let field = "";
  let quoted = false;
  const input = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (quoted) {
      if (char === '"' && input[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"' && field === "") quoted = true;
    else if (char === ",") { record.push(field); field = ""; }
    else if (char === "\n" || char === "\r") {
      if (char === "\r" && input[i + 1] === "\n") i++;
      record.push(field); field = "";
      if (record.some((value) => value.trim())) records.push(record);
      record = [];
    } else field += char;
  }
  if (quoted) throw new Error("The CSV contains an unclosed quotation mark.");
  record.push(field);
  if (record.some((value) => value.trim())) records.push(record);
  const headers = records.shift()?.map((value) => value.trim()) ?? [];
  if (!headers.length) throw new Error("The CSV is empty.");
  if (records.length > 20000) throw new Error("The CSV exceeds the 20,000-row limit.");
  return records.map((values) => Object.fromEntries(headers.map((header, index) => [header, (values[index] ?? "").trim()])));
}

function csvValue(row: CsvRow, ...names: string[]) {
  for (const name of names) {
    const entry = Object.entries(row).find(([key]) => key.toLowerCase() === name.toLowerCase());
    if (entry?.[1]) return entry[1];
  }
  return "";
}

function stableId(source: string, key: string) {
  return `${source}:${createHash("sha256").update(key.trim().toLowerCase()).digest("hex")}`;
}

function dateAtNoon(year: number, month: number, day: number): Date | null {
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
}

function parseDate(raw: string, order: "MDY" | "DMY" = "MDY") {
  if (!raw) return null;
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(raw);
  if (iso) return dateAtNoon(Number(iso[1]), Number(iso[2]), Number(iso[3]));
  const slash = /^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/.exec(raw);
  if (!slash) return null;
  const a = Number(slash[1]);
  const b = Number(slash[2]);
  const givenYear = Number(slash[3]);
  const year = slash[3].length === 2 ? (givenYear >= 70 ? 1900 + givenYear : 2000 + givenYear) : givenYear;
  return dateAtNoon(year, order === "MDY" ? a : b, order === "MDY" ? b : a);
}

function titleKey(title: string, year: number | null) {
  return `${title.normalize("NFKC").replace(/\s+/g, " ").trim().toLowerCase()}|${year ?? ""}`;
}

export function parseNetflixCsv(text: string, dateOrder: "MDY" | "DMY"): ImportedWatch[] {
  const rows = parseCsv(text);
  if (!rows.length || !["title", "date"].every((name) => Object.keys(rows[0]).some((key) => key.toLowerCase() === name))) {
    throw new Error("The Netflix CSV must contain Title and Date columns.");
  }
  const entries = new Map<string, ImportedWatch>();
  for (const row of rows) {
    const rawTitle = csvValue(row, "Title").trim();
    if (!rawTitle) continue;
    const rawDate = csvValue(row, "Date");
    const date = parseDate(rawDate, dateOrder);
    if (rawDate && !date) throw new Error(`Unrecognized Netflix date: ${rawDate.slice(0, 40)}. Check the selected date format.`);
    const series = /^(.*?):\s*(?:Season|Series|Part|Limited Series)\s*\d*\s*:/i.exec(rawTitle);
    const title = (series?.[1] || rawTitle).slice(0, 200);
    const key = stableId("netflix", titleKey(title, null));
    const previous = entries.get(key);
    if (!previous || (date && (!previous.watchedAt || date > previous.watchedAt))) {
      entries.set(key, { externalId: key, source: "netflix", title, category: series ? "series" : "film", status: "completed", year: null, posterUrl: null, rating: null, watchedAt: date });
    }
  }
  return [...entries.values()];
}

export function parseLetterboxdCsv(files: Array<{ name: string; text: string }>): ImportedWatch[] {
  const entries = new Map<string, ImportedWatch>();
  const priority = ["watchlist.csv", "watched.csv", "diary.csv", "reviews.csv", "ratings.csv", "films.csv", "likes/films.csv"];
  const ordered = [...files].sort((a, b) => priority.indexOf(a.name.toLowerCase()) - priority.indexOf(b.name.toLowerCase()));
  for (const file of ordered) {
    const name = file.name.toLowerCase();
    if (!priority.includes(name)) continue;
    for (const row of parseCsv(file.text)) {
      const title = csvValue(row, "Name", "Title").slice(0, 200);
      if (!title) continue;
      const yearValue = Number(csvValue(row, "Year"));
      const year = Number.isInteger(yearValue) && yearValue >= 1888 && yearValue <= 2100 ? yearValue : null;
      const uri = csvValue(row, "Letterboxd URI");
      // Diary/review URLs identify a viewing, not a film. Match the film itself.
      const key = stableId("letterboxd", titleKey(title, year));
      const previous = entries.get(key);
      // A like alone does not tell us whether a film was watched or planned.
      if (name.endsWith("films.csv") && !previous) continue;
      // Watched/ratings Date is the date the activity was recorded; only diary
      // provides the actual viewing date.
      const isEvent = name === "diary.csv" || name === "reviews.csv";
      const diaryDate = isEvent ? csvValue(row, "Watched Date", "WatchedDate") : "";
      const watchedAt = parseDate(diaryDate);
      if (diaryDate && !watchedAt) throw new Error(`Unrecognized Letterboxd diary date: ${diaryDate.slice(0, 40)}.`);
      const rawRating = Number(csvValue(row, "Rating"));
      const rating = rawRating > 0 && rawRating <= 5 ? Math.round(rawRating * 2) : null;
      const activityAt = parseDate(csvValue(row, "Date"))?.toISOString() ?? null;
      const completed = name === "watched.csv" || name === "ratings.csv" || isEvent;
      const status = completed || previous?.status === "completed" ? "completed" : "planned";
      const tracking = mergeSource(previous?.tracking, {
        externalIds: [key, ...(uri ? [stableId("letterboxd", uri)] : [])],
        title, status, rating: rating ?? previous?.rating ?? null,
        ...(!isEvent && uri ? { uri } : {}),
        ...(name === "watched.csv" ? { addedAt: activityAt } : {}),
        ...(name === "watchlist.csv" ? { watchlistedAt: activityAt } : {}),
        ...(name === "ratings.csv" ? { ratedAt: activityAt } : {}),
        ...(name.endsWith("films.csv") ? { likedAt: activityAt } : {}),
        ...(isEvent ? { events: [{
          uri, loggedAt: activityAt, watchedAt: watchedAt?.toISOString() ?? null, rating,
          rewatch: /^(yes|true|1)$/i.test(csvValue(row, "Rewatch")),
          tags: csvValue(row, "Tags").split(",").map((tag) => tag.trim()).filter(Boolean),
          ...(name === "reviews.csv" ? { review: csvValue(row, "Review") } : {}),
        }] } : {}),
      });
      entries.set(key, {
        externalId: key, source: "letterboxd", title, category: "film", status, year, tracking,
        posterUrl: null, rating: rating ?? previous?.rating ?? null,
        watchedAt: watchedAt && (!previous?.watchedAt || watchedAt > previous.watchedAt) ? watchedAt : previous?.watchedAt ?? null,
      });
    }
  }
  if (!entries.size) throw new Error("The Letterboxd CSV contains no films to import.");
  return [...entries.values()];
}
