import type { UserRecord } from 'firebase-admin/auth';
import getAuth from './getAuth';
import isUserAuthenticated from './isUserAuthenticated';
import getSession from './getSession';

export default async function getCurrentUser(): Promise<UserRecord> {
  const auth = getAuth();
  const session = await getSession();

  if (!(await isUserAuthenticated(session))) {
    return null;
  }

  const decodedIdToken = await auth.verifySessionCookie(session!);
  const currentUser = await auth.getUser(decodedIdToken.uid);

  return currentUser;
}