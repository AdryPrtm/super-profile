import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseLetterboxdCsv, parseNetflixCsv } from "./watch-import-data";

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
});
