import cookies from '@boiseitguru/cookie-cutter';
import type { SessionCookieOptions } from 'firebase-admin/auth';
import getAuth from './getAuth';

export default async function createSessionCookie(
  idToken: string,
  sessionCookieOptions: SessionCookieOptions
): Promise<string> {
  const auth = getAuth();
  const session = await auth.createSessionCookie(idToken, sessionCookieOptions);
  cookies.set('__session', session, { secure: true, ...sessionCookieOptions });
  return session;
}
