import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { matchTmdbPoster } from "./match-tmdb-poster";

describe("TMDB poster matching", () => {
  it("uses an exact title and release year", () => {
    const result = matchTmdbPoster([
      { title: "Dune", release_date: "1984-12-14", poster_path: "/old.jpg" },
      { title: "Dune", release_date: "2021-09-15", poster_path: "/new.jpg" },
    ], "Dune", 2021);
    assert.equal(result, "https://image.tmdb.org/t/p/w500/new.jpg");
  });

  it("skips ambiguous titles when no year is known", () => {
    assert.equal(matchTmdbPoster([
      { title: "It", release_date: "1990-01-01", poster_path: "/first.jpg" },
      { title: "It", release_date: "2017-01-01", poster_path: "/second.jpg" },
    ], "It", null), null);
  });

  it("rejects a different title and invalid poster path", () => {
    assert.equal(matchTmdbPoster([
      { title: "Another Movie", release_date: "2024-01-01", poster_path: "/image.jpg" },
    ], "My Movie", 2024), null);
    assert.equal(matchTmdbPoster([
      { title: "My Movie", release_date: "2024-01-01", poster_path: "https://example.com/image.jpg" },
    ], "My Movie", 2024), null);
  });
});
