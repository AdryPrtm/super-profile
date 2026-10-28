export type DiaryEvent = {
  uri: string;
  loggedAt: string | null;
  watchedAt: string | null;
  rating: number | null;
  rewatch: boolean;
  tags: string[];
  review?: string;
};

export type SourceTracking = {
  externalIds: string[];
  title: string;
  aliases?: string[];
  status: string;
  rating: number | null;
  uri?: string;
  watchedAt?: string | null;
  addedAt?: string | null;
  watchlistedAt?: string | null;
  likedAt?: string | null;
  ratedAt?: string | null;
  events?: DiaryEvent[];
};
export type WatchTracking = Record<string, SourceTracking>;

// Require a release year: unknown years and remakes must not be guessed.
export function watchMatchKey(title: string, year: number | null) {
  return year
    ? `${title
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]/gu, '')}|${year}`
    : null;
}

export function mergeSource(
  previous: SourceTracking | undefined,
  incoming: SourceTracking,
): SourceTracking {
  const events = new Map(
    (previous?.events ?? []).map((event) => [
      event.uri || `${event.loggedAt}|${event.watchedAt}`,
      event,
    ]),
  );
  for (const event of incoming.events ?? []) {
    const key = event.uri || `${event.loggedAt}|${event.watchedAt}`;
    events.set(key, { ...events.get(key), ...event });
  }
  return {
    ...previous,
    ...incoming,
    externalIds: [
      ...new Set([...(previous?.externalIds ?? []), ...incoming.externalIds]),
    ],
    aliases: [
      ...new Set([
        ...(previous?.aliases ?? []),
        ...(incoming.aliases ?? []),
        incoming.title,
      ]),
    ],
    events: [...events.values()].sort((a, b) =>
      (b.watchedAt ?? b.loggedAt ?? '').localeCompare(
        a.watchedAt ?? a.loggedAt ?? '',
      ),
    ),
  };
}
