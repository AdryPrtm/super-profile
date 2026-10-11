"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { fillMissingPosters } from "../../actions/poster-actions";

export function WatchPosterTools({ missingCount, hasServerToken }: { missingCount: number; hasServerToken: boolean }) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [running, setRunning] = useState(false);
  const [checked, setChecked] = useState(0);
  const [updated, setUpdated] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (running) return;
    setRunning(true);
    setChecked(0);
    setUpdated(0);
    setError(null);
    setFinished(false);

    let cursor: string | undefined;
    let checkedTotal = 0;
    let updatedTotal = 0;
    try {
      do {
        const result = await fillMissingPosters({ token: hasServerToken ? undefined : token.trim(), afterId: cursor });
        checkedTotal += result.checked;
        updatedTotal += result.updated;
        setChecked(checkedTotal);
        setUpdated(updatedTotal);
        cursor = result.nextId ?? undefined;
        if (result.done) break;
      } while (cursor);
      setFinished(true);
      setToken("");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Poster lookup failed. Please try again.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-7" aria-labelledby="watch-posters-heading">
      <h2 id="watch-posters-heading" className="text-xl font-semibold">Find missing posters</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Search TMDB for film and series posters using exact titles and release years. Ambiguous results are skipped so you can add those posters manually.
      </p>
      <p className="mt-3 text-sm font-medium">{missingCount} films or series currently have no poster.</p>
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
        {!hasServerToken ? (
          <label className="block min-w-0 flex-1 text-sm font-medium">
            TMDB API Read Access Token
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              required
              autoComplete="off"
              placeholder="Paste your TMDB read token"
              className="mt-1.5 min-h-11 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>
        ) : null}
        <button type="submit" disabled={running || missingCount === 0} className="min-h-11 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:cursor-wait disabled:opacity-50">
          {running ? "Finding posters..." : "Fill missing posters"}
        </button>
      </form>
      {!hasServerToken ? <p className="mt-3 text-xs text-muted-foreground">Get a free token from <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer" className="underline underline-offset-2">TMDB API settings</a>. The token is used for this lookup and is not saved.</p> : null}
      {running || finished ? <p role="status" className="mt-4 text-sm text-muted-foreground">Checked {checked} titles; added {updated} posters.{finished ? " Titles without an exact match remain unchanged." : ""}</p> : null}
      {error ? <p role="alert" className="mt-4 text-sm text-destructive">{error}</p> : null}
    </section>
  );
}
