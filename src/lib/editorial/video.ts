export type VideoLink = { url: string; platform: 'YouTube' | 'Bilibili' | 'X' | 'TikTok'; embedUrl: string | null };

export function parseVideoLink(value: unknown): VideoLink | null {
  if (typeof value !== 'string' || value.length > 500) return null;
  let url: URL;
  try { url = new URL(value); } catch { return null; }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be') {
    const id = host === 'youtu.be' ? url.pathname.slice(1) :
      url.pathname.startsWith('/shorts/') ? url.pathname.split('/')[2] :
        url.pathname.startsWith('/embed/') ? url.pathname.split('/')[2] : url.searchParams.get('v');
    if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return null;
    return { url: `https://www.youtube.com/watch?v=${id}`, platform: 'YouTube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}` };
  }
  if (host === 'bilibili.com' || host === 'm.bilibili.com') {
    const match = /^\/video\/(BV[A-Za-z0-9]{10})\/?$/.exec(url.pathname);
    if (!match) return null;
    return { url: `https://www.bilibili.com/video/${match[1]}/`, platform: 'Bilibili',
      embedUrl: `https://player.bilibili.com/player.html?bvid=${match[1]}` };
  }
  if (host === 'x.com' || host === 'twitter.com') {
    if (!/^\/[A-Za-z0-9_]{1,15}\/status\/[0-9]+\/?$/.test(url.pathname)) return null;
    return { url: `https://x.com${url.pathname}`, platform: 'X', embedUrl: null };
  }
  if (host === 'tiktok.com' || host === 'm.tiktok.com') {
    if (!/^\/@[A-Za-z0-9._-]+\/video\/[0-9]+\/?$/.test(url.pathname)) return null;
    return { url: `https://www.tiktok.com${url.pathname}`, platform: 'TikTok', embedUrl: null };
  }
  return null;
}
