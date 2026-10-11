export type TmdbSearchResult = {
  title?: string;
  original_title?: string;
  name?: string;
  original_name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
  adult?: boolean;
};

function normalizeTitle(title: string) {
  return title
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/&/g, "and")
    .replace(/[’']/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .toLocaleLowerCase("en-US");
}

function releaseYear(result: TmdbSearchResult) {
  const match = /^(\d{4})/.exec(result.release_date ?? result.first_air_date ?? "");
  return match ? Number(match[1]) : null;
}

function posterUrl(result: TmdbSearchResult) {
  const path = result.poster_path;
  return path && /^\/[A-Za-z0-9_-]+\.(?:jpe?g|png|webp)$/i.test(path)
    ? `https://image.tmdb.org/t/p/w500${path}`
    : null;
}

export function matchTmdbPoster(results: TmdbSearchResult[], title: string, year: number | null) {
  const target = normalizeTitle(title);
  if (!target) return null;

  const exact = results.filter((result) =>
    !result.adult && posterUrl(result) &&
    [result.title, result.original_title, result.name, result.original_name]
      .some((candidate) => candidate && normalizeTitle(candidate) === target),
  );

  if (year !== null) {
    const sameYear = exact.filter((result) => releaseYear(result) === year);
    return sameYear.length === 1 ? posterUrl(sameYear[0]) : null;
  }

  return exact.length === 1 ? posterUrl(exact[0]) : null;
}
