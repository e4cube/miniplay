import type { Metadata } from 'next';
import GameRequestsPreview from '@/components/GameRequestsPreview';
import { localizedMetadata } from '@/i18n/metadata';
import { ugcConfig } from '@/lib/ugc/config';
import { listPublicGameRequests, type PublicGameRequest } from '@/lib/ugc/requests';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  ...localizedMetadata('en', '/requests', 'Game Requests | GameVado', 'Browse approved game requests from GameVado players.'),
  robots: { index: false, follow: false },
};

export default async function RequestsPage() {
  let items: PublicGameRequest[] | null = null;
  if (ugcConfig()) {
    try { items = await listPublicGameRequests(); }
    catch { /* Keep this preview unavailable rather than exposing unreviewed content. */ }
  }
  return <GameRequestsPreview locale="en" items={items} />;
}
