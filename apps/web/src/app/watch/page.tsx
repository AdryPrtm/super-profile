import type { Metadata } from 'next';
import { WatchCatalog } from '@/features/watch/components/public/WatchCatalog';
import { getWatchEntries } from '@/features/watch/data/watch-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Watch Journal | super.profile',
  description: 'Films, series, and anime I have watched.',
};

export default async function WatchPage() {
  try {
    const entries = await getWatchEntries();
    return <WatchCatalog entries={entries} />;
  } catch (error) {
    console.error('Failed to load watch catalog', error);
    return <WatchCatalog entries={[]} hasDatabaseError />;
  }
}
