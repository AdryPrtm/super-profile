import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseLetterboxdCsv, parseNetflixCsv } from "./parse-watch-imports";
import { watchMatchKey } from "./watch-tracking";
import { readLetterboxdExport } from "./read-letterboxd-export";
import { zipSync, strToU8 } from "fflate";

describe("watch history imports", () => {
  it("Netflix groups episodes and keeps the latest viewing date", () => {
    const csv = 'Title,Date\r\n"Show: Season 1: Pilot",1/2/24\r\n"Show: Season 1: Finale",3/4/24\r\n"Film, The",4/5/24\r\n';
    const entries = parseNetflixCsv(csv, "MDY");
    assert.equal(entries.length, 2);
    assert.equal(entries.find((entry) => entry.title === "Show")?.category, "series");
    assert.deepEqual(entries.find((entry) => entry.title === "Show")?.watchedAt, new Date("2024-03-04T12:00:00.000Z"));
    assert.equal(entries.find((entry) => entry.title === "Film, The")?.category, "film");
  });

  it("Letterboxd merges watched, ratings, and diary by film URI", () => {
    const entries = parseLetterboxdCsv([
      { name: "diary.csv", text: "Date,Name,Year,Letterboxd URI,Watched Date\n2024-04-01,Film,2020,https://letterboxd.com/film/film/,2024-03-30" },
      { name: "watched.csv", text: "Date,Name,Year,Letterboxd URI\n2024-01-01,Film,2020,https://letterboxd.com/film/film/" },
      { name: "ratings.csv", text: "Date,Name,Year,Letterboxd URI,Rating\n2024-04-02,Film,2020,https://letterboxd.com/film/film/,4.5" },
    ]);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].rating, 9);
    assert.deepEqual(entries[0].watchedAt, new Date("2024-03-30T12:00:00.000Z"));
  });

  it("keeps reviews and rewatches together despite different film and diary URLs", () => {
    const entries = parseLetterboxdCsv([
      { name: "watched.csv", text: "Date,Name,Year,Letterboxd URI\n2024-01-01,Film,2020,https://boxd.it/film" },
      { name: "diary.csv", text: "Date,Name,Year,Letterboxd URI,Watched Date,Rewatch,Rating\n2024-02-02,Film,2020,https://boxd.it/first,2024-02-01,,4\n2024-03-02,Film,2020,https://boxd.it/second,2024-03-01,Yes,5" },
      { name: "reviews.csv", text: 'Date,Name,Year,Letterboxd URI,Watched Date,Review,Tags,Rewatch,Rating\n2024-03-02,Film,2020,https://boxd.it/second,2024-03-01,"A quote: ""yes""\nand another line","favorite, cinema",Yes,5' },
      { name: "ratings.csv", text: "Name,Year,Rating\nFilm,2020,4.5" },
      { name: "watchlist.csv", text: "Date,Name,Year,Letterboxd URI\n2023-01-01,Film,2020,https://boxd.it/film\n2024-01-01,Other Film,2021,https://boxd.it/other" },
      { name: "likes/films.csv", text: "Date,Name,Year,Letterboxd URI\n2024-03-02,Film,2020,https://boxd.it/film" },
    ]);
    assert.equal(entries.length, 2);
    const film = entries.find((entry) => entry.title === "Film")!;
    assert.equal(film.status, "completed");
    assert.equal(film.rating, 9);
    assert.equal(film.tracking?.events?.length, 2);
    assert.equal(film.tracking?.events?.[0].rewatch, true);
    assert.equal(film.tracking?.events?.[0].review, 'A quote: "yes"\nand another line');
    assert.deepEqual(film.tracking?.events?.[0].tags, ["favorite", "cinema"]);
    assert.ok(film.tracking?.likedAt);
    assert.equal(entries.find((entry) => entry.title === "Other Film")?.status, "planned");
    assert.equal(entries.find((entry) => entry.title === "Other Film")?.watchedAt, null);
  });

  it("matches punctuation/case across providers but keeps remakes and unknown years apart", () => {
    assert.equal(watchMatchKey("Your Name.", 2016), watchMatchKey("YOUR NAME", 2016));
    assert.notEqual(watchMatchKey("Film", 2000), watchMatchKey("Film", 2020));
    assert.equal(watchMatchKey("Film", null), null);
  });

  it("reads ZIP watch data and excludes deleted, orphaned, and profile files", async () => {
    const content = "Name,Year\nFilm,2020";
    const zip = zipSync(Object.fromEntries(["watched.csv", "watchlist.csv", "reviews.csv", "deleted/reviews.csv", "orphaned/diary.csv", "profile.csv"].map((name) => [name, strToU8(content)])));
    const files = await readLetterboxdExport([new File([new Uint8Array(zip)], "export.zip")]);
    assert.deepEqual(files.map((file) => file.name).sort(), ["reviews.csv", "watched.csv", "watchlist.csv"]);
  });
});
