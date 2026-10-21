import 'server-only';

export function ugcConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key || !/^https:\/\//.test(url)) return null;
  return { url: url.replace(/\/$/, ''), key };
}

export const ugcWritesEnabled = () => process.env.UGC_WRITES_ENABLED === 'true';
