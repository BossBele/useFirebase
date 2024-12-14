import getAuth from './getAuth';
import getSession from './getSession';
import type { IAuthOptions } from './types';

export default async function isUserAuthenticated(
  session?: string,
  options?: IAuthOptions,
): Promise<boolean> {
  const _session = session ?? (await getSession());
  if (!_session) return false;

  const authOptions: IAuthOptions = {};
  if (options?.tenantId) {
    authOptions.tenantId = options.tenantId;
  }
  if (options?.app) {
    authOptions.app = options.app;
  }
  const auth = getAuth(authOptions);
  try {
    const decodedIdToken = await auth.verifySessionCookie(_session, true);
    return Boolean(decodedIdToken?.uid);
  } catch (error) {
    console.error(error);
    return false;
  }
}
