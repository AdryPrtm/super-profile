import { strFromU8, unzipSync } from 'fflate';

const allowed = new Set([
  'watched.csv',
  'watchlist.csv',
  'ratings.csv',
  'diary.csv',
  'reviews.csv',
  'likes/films.csv',
  'films.csv',
]);
const maxFile = 5 * 1024 * 1024;

export async function readLetterboxdExport(values: File[]) {
  if (
    !values.length ||
    values.length > 7 ||
    values.reduce((size, file) => size + file.size, 0) > 15 * 1024 * 1024
  ) {
    throw new Error(
      'Choose one Letterboxd ZIP or up to seven CSV files (15 MB total).',
    );
  }
  const files: Array<{ name: string; text: string }> = [];
  let expanded = 0;
  for (const file of values) {
    if (!file.size) throw new Error('The selected file is empty.');
    if (file.name.toLowerCase().endsWith('.zip')) {
      if (values.length !== 1)
        throw new Error(
          'Upload the ZIP on its own, or select the extracted CSV files.',
        );
      const archive = unzipSync(new Uint8Array(await file.arrayBuffer()), {
        filter(entry) {
          if (!allowed.has(entry.name.toLowerCase())) return false;
          expanded += entry.originalSize;
          if (entry.originalSize > maxFile || expanded > 30 * 1024 * 1024)
            throw new Error('The export exceeds the uncompressed size limit.');
          return true;
        },
      });
      for (const [name, bytes] of Object.entries(archive))
        files.push({ name: name.toLowerCase(), text: strFromU8(bytes) });
    } else {
      const name = file.name.toLowerCase();
      if (!allowed.has(name) || file.size > maxFile)
        throw new Error(
          'Select watched, watchlist, ratings, diary, reviews, or likes/films CSV files (5 MB each).',
        );
      files.push({ name, text: await file.text() });
    }
  }
  if (!files.length)
    throw new Error(
      'No supported watch tracker files were found in this export.',
    );
  return files;
}
