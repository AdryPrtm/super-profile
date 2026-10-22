import prisma, { Prisma } from "@super-profile-dry/db";
import type { ImportedWatch } from "../utils/parse-watch-imports";
import { mergeSource, watchMatchKey, type WatchTracking } from "../utils/watch-tracking";

/** Keep provider identities on the canonical title so either import updates it. */
export async function saveImported(entries: ImportedWatch[]) {
  return prisma.$transaction(async (tx) => {
    // Serialize imports, including concurrent requests from separate server instances.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(84921367)`;
    const existing = await tx.watchEntry.findMany({ orderBy: { createdAt: "asc" } });
    const original = new Map(existing.map((row) => [row.id, JSON.stringify({ tracking: row.tracking, status: row.status, category: row.category, posterUrl: row.posterUrl, notes: row.notes, rating: row.rating, watchedAt: row.watchedAt })]));
    type Row = (typeof existing)[number];
    const groups: Array<{ row: Row; tracking: WatchTracking; ids: string[]; changed: boolean }> = [];
    const rank: Record<string, number> = { completed: 5, watching: 4, paused: 3, dropped: 2, planned: 1 };
    function matches(a: Row, tracking: WatchTracking, b: { title: string; year: number | null; externalId: string | null }, aliases: string[] = []) {
      if (b.externalId && (a.externalId === b.externalId || Object.values(tracking).some((source) => source.externalIds.includes(b.externalId!)))) return true;
      const key = watchMatchKey(b.title, b.year);
      if (!key || a.year !== b.year) return false;
      const titles = [a.title, ...Object.values(tracking).flatMap((source) => source.aliases ?? [source.title])];
      const candidates = [key, ...aliases.map((title) => watchMatchKey(title, b.year))];
      return titles.some((title) => candidates.includes(watchMatchKey(title, a.year)));
    }
    for (const row of existing) {
      const tracking = row.tracking as WatchTracking;
      if (!tracking[row.source]) tracking[row.source] = {
        externalIds: row.externalId ? [row.externalId] : [], title: row.title,
        status: row.status, rating: row.rating, watchedAt: row.watchedAt?.toISOString() ?? null,
      };
      // Ambiguous matches are kept separate rather than merging different works.
      const candidates = groups.filter((group) => matches(group.row, group.tracking, row));
      const group = candidates.length === 1 ? candidates[0] : undefined;
      if (!group) { groups.push({ row, tracking, ids: [row.id], changed: false }); continue; }
      for (const [source, data] of Object.entries(tracking)) {
        const previous = group.tracking[source];
        group.tracking[source] = mergeSource(previous, {
          ...data, rating: data.rating ?? previous?.rating ?? null,
          status: (rank[data.status] ?? 0) > (rank[previous?.status ?? ""] ?? 0) ? data.status : previous?.status ?? data.status,
        });
      }
      group.row.posterUrl ||= row.posterUrl;
      group.row.rating ??= row.rating;
      if (row.category === "anime") group.row.category = "anime";
      if (row.notes && row.notes !== group.row.notes) group.row.notes = [group.row.notes, row.notes].filter(Boolean).join("\n\n");
      if (row.watchedAt && (!group.row.watchedAt || row.watchedAt > group.row.watchedAt)) group.row.watchedAt = row.watchedAt;
      group.ids.push(row.id); group.changed = true;
    }
    for (const entry of entries) {
      const candidates = groups.filter((group) => matches(group.row, group.tracking, entry, entry.tracking?.aliases));
      let group = candidates.find((candidate) => candidate.row.externalId === entry.externalId || Object.values(candidate.tracking).some((source) => source.externalIds.includes(entry.externalId)));
      group ??= candidates.length === 1 ? candidates[0] : undefined;
      const incoming = { ...entry.tracking, externalIds: entry.tracking?.externalIds ?? [entry.externalId], title: entry.title, status: entry.status, rating: entry.rating, watchedAt: entry.watchedAt?.toISOString() ?? null };
      if (!group) {
        const { tracking: _tracking, ...data } = entry;
        const row = await tx.watchEntry.create({ data: { ...data, tracking: { [entry.source]: incoming } as Prisma.InputJsonValue } });
        group = { row, tracking: { [entry.source]: incoming }, ids: [row.id], changed: false };
        groups.push(group);
      } else {
        const previous = group.tracking[entry.source];
        // Partial CSV imports enrich history; a watchlist alone must not undo a viewing.
        if (entry.source === "letterboxd") {
          if (previous?.status === "completed") incoming.status = "completed";
          incoming.rating ??= previous?.rating ?? null;
          incoming.watchedAt ??= previous?.watchedAt ?? null;
        }
        group.tracking[entry.source] = mergeSource(previous, incoming);
        group.row.posterUrl ||= entry.posterUrl;
        if (entry.category === "anime") group.row.category = "anime";
        group.changed = true;
      }
    }
    let merged = 0;
    for (const group of groups.filter((item) => item.changed)) {
      const sources = Object.values(group.tracking);
      const status = sources.reduce((best, source) => (rank[source.status] ?? 0) > (rank[best] ?? 0) ? source.status : best, "planned");
      const dates = sources.flatMap((source) => [source.watchedAt, ...(source.events ?? []).map((event) => event.watchedAt)]).filter((date): date is string => Boolean(date)).sort();
      const extraIds = group.ids.slice(1);
      if (extraIds.length) await tx.watchEntry.deleteMany({ where: { id: { in: extraIds } } });
      merged += extraIds.length;
      const data = {
        tracking: group.tracking as Prisma.InputJsonValue, status,
        category: group.row.category, posterUrl: group.row.posterUrl, notes: group.row.notes,
        rating: group.tracking.letterboxd?.rating ?? group.tracking.anilist?.rating ?? group.row.rating,
        watchedAt: dates.length ? new Date(dates[dates.length - 1]) : group.row.watchedAt,
      };
      if (original.get(group.row.id) !== JSON.stringify(data)) await tx.watchEntry.update({ where: { id: group.row.id }, data });
    }
    return { count: entries.length, merged };
  }, { timeout: 120000, maxWait: 15000 });
}
