export const adsense = {
  client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-9031551450005780',
  slots: {
    'game-bottom': process.env.NEXT_PUBLIC_ADSENSE_GAME_BOTTOM_SLOT || '8652505817',
    inline: process.env.NEXT_PUBLIC_ADSENSE_INLINE_SLOT ?? '',
  },
};
export const validAdSenseClient = /^ca-pub-\d{16}$/.test(adsense.client);
