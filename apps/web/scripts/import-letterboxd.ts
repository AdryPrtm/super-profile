import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { readLetterboxdExport } from '../src/features/watch/utils/read-letterboxd-export';
import { parseLetterboxdCsv } from '../src/features/watch/utils/parse-watch-imports';

// Run from the repository root with --env-file=apps/web/.env; dry-run by default.
const path = process.argv[2];
if (!path)
  throw new Error('Usage: import-letterboxd.ts <export.zip> [--apply]');
const files = await readLetterboxdExport([
  new File([await readFile(path)], basename(path)),
]);
const entries = parseLetterboxdCsv(files);
console.log(
  JSON.stringify(
    {
      files: files.map((file) => file.name),
      titles: entries.length,
      watched: entries.filter((entry) => entry.status === 'completed').length,
      planned: entries.filter((entry) => entry.status === 'planned').length,
      reviews: entries.reduce(
        (count, entry) =>
          count +
          (entry.tracking?.events?.filter((event) => event.review).length ?? 0),
        0,
      ),
    },
    null,
    2,
  ),
);
if (process.argv.includes('--apply')) {
  const { saveImported } =
    await import('../src/features/watch/data/save-watch-import');
  const { default: prisma } = await import('@super-profile-dry/db');
  try {
    console.log(await saveImported(entries));
  } finally {
    await prisma.$disconnect();
  }
}
