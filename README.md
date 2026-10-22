# super-profile-dry

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Self, TRPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **tRPC** - End-to-end type-safe APIs
- **Prisma** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Husky** - Git hooks for code quality

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Database Setup

This project uses PostgreSQL with Prisma.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/web/.env` file with your PostgreSQL connection details.

3. Generate the Prisma client and push the schema:

```bash
bun db:push
```

Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see your fullstack application.

## Admin login

Admin login uses Better Auth email/password accounts in PostgreSQL. Configure
`DATABASE_URL`, `BETTER_AUTH_SECRET` (a random application secret, not a user
password), and `BETTER_AUTH_URL` for the running site's URL. Use the same database
on the hosted site. `ADMIN_CONTENT_KEY` is no longer used.

From the project root, run `bun run user:create` in an interactive terminal.
Enter a name, email, and a unique password of 12–128 characters. Password input
is hidden and only its Better Auth hash is stored. The command never overwrites
an existing account. Every account created this way can manage the site;
public registration is disabled.

Login accepts an email or a username (3–32 letters, digits, dots, underscores,
or hyphens). Usernames use a reserved internal email address in the database.
To change an existing account, run `bun run user:update`, enter its current
email or username, then the new name, login, and password. Updating an account
revokes all its existing sessions.

Open `/login` and sign in with the account's email and password. Use `/admin`
for profile content or `/admin/watch` for the watch journal. Sessions last up to
eight hours and are validated against the database. **Log out** revokes the
current session. Old access-key cookies cannot grant access.

## Watch journal imports

In `/admin/watch`, upload the original Letterboxd ZIP or its `watched.csv`,
`watchlist.csv`, `ratings.csv`, `diary.csv`, `reviews.csv`, and `likes/films.csv`.
Reviews are published under **History & reviews**. Diary dates, rewatches,
tags, film likes, watchlist dates, and source links are retained. Profile,
comments, likes of other people's reviews/lists, deleted, and orphaned files
are excluded. CSV import is additive: omitted history is not deleted.

Films are matched by normalized title and release year. AniList title aliases
are also used on subsequent syncs. Different years and ambiguous matches stay
separate. Matching titles share one database row, with provider identities and
ratings preserved in `tracking`. Overall status priority is Watched, Watching,
Paused, Dropped, then Plan to watch; per-source status remains visible in details.
Letterboxd rating takes display priority, then AniList. Existing posters are kept.

For an existing database, apply `packages/db/prisma/sql/add-watch-tracking.sql`
and regenerate Prisma before starting the updated app. The public page and hero
count unique titles, not viewing events or source records.

To inspect an export from the repository root without writing to the database:

```bash
bun run --env-file=apps/web/.env apps/web/scripts/import-letterboxd.ts path/to/export.zip
```

Add `--apply` to import it. The import transaction also consolidates existing
duplicates and keeps source-specific viewing history. Repeating an identical
import does not create new records. New watchlist posters can be filled with
the existing TMDB poster tool after import.

## Project Structure

```
super-profile-dry/
├── apps/
│   └── web/         # Fullstack application (Next.js)
├── packages/
│   ├── api/         # API layer / business logic
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `bun dev`: Start all applications in development mode
- `bun build`: Build all applications
- `bun check-types`: Check TypeScript types across all apps
- `bun db:push`: Push schema changes to database
- `bun db:studio`: Open database studio UI
