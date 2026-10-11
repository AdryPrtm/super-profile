import { matchTmdbPoster, type TmdbSearchResult } from "../utils/match-tmdb-poster";

export async function findTmdbPoster(
  entry: { title: string; category: string; year: number | null },
  token: string,
) {
  const mediaType = entry.category === "series" ? "tv" : "movie";
  const params = new URLSearchParams({ query: entry.title, language: "en-US", include_adult: "false" });
  const response = await fetch(`https://api.themoviedb.org/3/search/${mediaType}?${params}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });

  if (response.status === 401) throw new Error("TMDB rejected the API Read Access Token.");
  if (response.status === 429) throw new Error("TMDB rate limit reached. Please try again shortly.");
  if (!response.ok) throw new Error(`TMDB search failed (${response.status}).`);

  const body = await response.json() as { results?: TmdbSearchResult[] };
  return matchTmdbPoster(body.results ?? [], entry.title, entry.year);
}
