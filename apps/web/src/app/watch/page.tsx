import type { Metadata } from 'next';
import { WatchCatalog } from '@/features/watch/WatchCatalog';
import { getWatchEntries } from '@/features/watch/watch-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Watch Journal | super.profile',
  description: 'Film, series, dan anime yang saya tonton.',
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
