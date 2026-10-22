import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { reviewGames } from '@/data/review-games';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'HexGL: GameVado Edition — Review',
  robots: { index: false, follow: false },
  alternates: { canonical: '/games/hexgl' },
};

export default function HexGLReviewPage() {
  if (process.env.HEXGL_REVIEW_ENABLED !== '1') notFound();
  const game = reviewGames.find(item => item.slug === 'hexgl')!;
  return <section className="container" style={{ paddingBlock: 40, maxWidth: 900 }}>
    <p>UNPUBLISHED · LICENSE REVIEW</p>
    <h1>{game.title}</h1>
    <p>{game.description}</p>
    <p><a href={game.playPath}>Launch original HexGL</a></p>
    <h2>Classic controls</h2><p>{game.controls}</p>
    <h2>Original author and source</h2>
    <p>HexGL by Thibaut Despoulain (BKcore). GameVado Edition is a compatibility port, not an endorsement by the original author.</p>
    <p><a href={game.upstream}>Official source repository</a> · <a href="/play/hexgl/LICENSE">Upstream MIT license</a> · <a href="/play/hexgl/GAMEVADO-NOTICES.md">Resource notices and review restrictions</a></p>
    <p>The upstream README excludes files carrying their own license. Multiple original core files retain CC BY-NC 3.0 headers; audio and fonts have separate terms. Commercial publication is paused pending clearance.</p>
  </section>;
}
