import getAuth from './getAuth';
import getSession from './getSession';

export default async function isUserAuthenticated(
  session?: string
): Promise<boolean> {
  const _session = session ?? (await getSession());
  if (!_session) return false;

  const auth = getAuth();
  try {
    const decodedIdToken = await auth.verifySessionCookie(_session, true);
    return Boolean(decodedIdToken?.uid);
  } catch (error) {
    console.error(error);
    return false;
  }
}
