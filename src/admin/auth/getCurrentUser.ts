import type { UserRecord } from 'firebase-admin/auth';
import getAuth from './getAuth';
import isUserAuthenticated from './isUserAuthenticated';
import getSession from './getSession';
import type { IAuthOptions } from './types';

export default async function getCurrentUser(options: IAuthOptions): Promise<UserRecord> {
  const authOptions: IAuthOptions = {};
  if (options?.tenantId) {
    authOptions.tenantId = options.tenantId;
  }
  if (options?.app) {
    authOptions.app = options.app;
  }

  const auth = getAuth(authOptions);
  const session = await getSession();

  if (!(await isUserAuthenticated(session, authOptions))) {
    return null;
  }

  const decodedIdToken = await auth.verifySessionCookie(session!);
  const currentUser = await auth.getUser(decodedIdToken.uid);

  return currentUser;
}