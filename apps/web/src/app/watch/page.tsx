import type { Metadata } from 'next';
import { WatchCatalog } from '@/features/watch/components/public/WatchCatalog';
import { getWatchEntries } from '@/features/watch/data/watch-data';
import { getProfileContent } from '@/features/profile-content/data/profile-content';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getProfileContent();
  return { title: metadata.watchTitle, description: metadata.watchDescription };
}

export default async function WatchPage() {
  try {
    const entries = await getWatchEntries();
    return <WatchCatalog entries={entries} />;
  } catch (error) {
    console.error('Failed to load watch catalog', error);
    return <WatchCatalog entries={[]} hasDatabaseError />;
  }
}
