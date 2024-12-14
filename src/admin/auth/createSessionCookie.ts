import cookies from '@boiseitguru/cookie-cutter';
import type { SessionCookieOptions } from 'firebase-admin/auth';
import getAuth from './getAuth';
import { IAuthOptions } from './types';

export default async function createSessionCookie(
  idToken: string,
  sessionCookieOptions: SessionCookieOptions & IAuthOptions,
): Promise<string> {
  const { tenantId, app, ...cookieOptions } = sessionCookieOptions;

  const authOptions: IAuthOptions = {};
  if (tenantId) {
    authOptions.tenantId = tenantId;
  }
  if (app) {
    authOptions.app = app;
  }

  const auth = getAuth(authOptions);
  const session = await auth.createSessionCookie(idToken, cookieOptions);
  cookies().set('__session', session, { secure: true, ...cookieOptions });
  return session;
}
