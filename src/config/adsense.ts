export const adsense = {
  client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? '',
  slots: {
    'game-bottom': process.env.NEXT_PUBLIC_ADSENSE_GAME_BOTTOM_SLOT ?? '',
    inline: process.env.NEXT_PUBLIC_ADSENSE_INLINE_SLOT ?? '',
  },
};
export const validAdSenseClient = /^ca-pub-\d{16}$/.test(adsense.client);
