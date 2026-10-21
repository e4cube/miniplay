import 'server-only';
import { currentUser } from './auth';
import { ugcConfig, ugcWritesEnabled } from './config';
import { failure, sameOrigin } from './http';

export function availability() {
  return ugcConfig() ? null : failure('NOT_CONFIGURED', 'Community service is unavailable.', 503);
}

export async function writeGuard(request: Request) {
  if (!sameOrigin(request)) return { error: failure('BAD_ORIGIN', 'Invalid request origin.', 403), token: null };
  if (!ugcConfig()) return { error: failure('NOT_CONFIGURED', 'Community service is unavailable.', 503), token: null };
  if (!ugcWritesEnabled()) return { error: failure('NOT_OPEN', 'Community posting is not open yet.', 403), token: null };
  const auth = await currentUser();
  if (!auth) return { error: failure('AUTH_REQUIRED', 'Sign in to continue.', 401), token: null };
  return { error: null, token: auth.token };
}
