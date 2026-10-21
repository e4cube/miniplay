import 'server-only';

export async function exchangeGitHubIdentity(code: string, redirectUri: string,
  fetcher: typeof fetch = fetch): Promise<number | null> {
  const clientId = process.env.EDITORIAL_OAUTH_CLIENT_ID;
  const clientSecret = process.env.EDITORIAL_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  try {
    const response = await fetcher('https://github.com/login/oauth/access_token', {
      method: 'POST', cache: 'no-store', signal: AbortSignal.timeout(10000),
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: redirectUri }),
    });
    if (!response.ok) return null;
    const token = await response.json() as { access_token?: string };
    if (!token.access_token) return null;
    const user = await fetcher('https://api.github.com/user', { cache: 'no-store', signal: AbortSignal.timeout(10000),
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token.access_token}` } });
    if (!user.ok) return null;
    const identity = await user.json() as { id?: number };
    return Number.isSafeInteger(identity.id) ? identity.id! : null;
  } catch { return null; }
}
