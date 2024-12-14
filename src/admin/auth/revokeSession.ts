import cookies from '@boiseitguru/cookie-cutter';
import getAuth from './getAuth';
import type { IAuthOptions } from './types';

export default async function revokeSession(session: string, options: IAuthOptions): Promise<void> {
  const authOptions: IAuthOptions = {};
  if (options?.tenantId) {
    authOptions.tenantId = options.tenantId;
  }
  if (options?.app) {
    authOptions.app = options.app;
  }

  const auth = getAuth(authOptions);
  const decodedIdToken = await auth.verifySessionCookie(session);
  // to unset a cookie, use a date in the past, ex: { expires: new Date(0) }
  cookies().set('__session', '', { expires: new Date(0) });

  return await auth.revokeRefreshTokens(decodedIdToken.sub);
}
