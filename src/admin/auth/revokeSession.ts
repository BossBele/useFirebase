import cookies from '@boiseitguru/cookie-cutter';
import getAuth from './getAuth';

export default async function revokeSession(session: string): Promise<void> {
  const auth = getAuth();
  const decodedIdToken = await auth.verifySessionCookie(session);
  // to unset a cookie, use a date in the past, ex: { expires: new Date(0) }
  cookies.set('__session', '', { expires: new Date(0) });

  return await auth.revokeRefreshTokens(decodedIdToken.sub);
}
