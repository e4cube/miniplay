import type { Game } from './games';

// Separate from the public games array: never used by home, search or sitemap.
export const reviewGames: (Game & { status: 'review'; playPath: string; upstream: string })[] = [{
  id: 'hexgl', slug: 'hexgl', title: 'HexGL: GameVado Edition',
  status: 'review', playPath: '/play/hexgl/', upstream: 'https://github.com/BKcore/HexGL',
  shortDescription: 'The original HexGL futuristic racing game, in local review.',
  description: 'Race the original Cityscape course in the original HexGL WebGL engine by Thibaut Despoulain (BKcore). This review port preserves the classic time-attack mode, ship, textures and sound.',
  category: 'Arcade', categories: ['Arcade', 'Action'], tags: ['racing', 'WebGL', 'original port'],
  icon: '🏁', featured: false, isNew: false,
  controls: 'Arrow Up accelerates; Left/Right steer; A/Q and D/E apply the left/right air brakes. Escape restarts. Use Exit to return to this page.',
  seoTitle: 'HexGL: GameVado Edition — Review', seoDescription: 'Private review of the original HexGL port.',
  howTo: ['Choose keyboard controls and a quality level.', 'Start, read the controls, then click to load the race.', 'Complete three laps of Cityscape without destroying your ship.'],
  tips: ['Use air brakes for tight turns.', 'Lower quality if the original postprocessing is too demanding.'],
  faq: [{ q: 'Is this approved for public release?', a: 'No. Licensing exceptions and commercial resource permissions are still under review.' }],
}];
