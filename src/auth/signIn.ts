import { getAuth, signInAnonymously as signOutFB } from 'firebase/auth';

export default async function signIn() {
  const auth = getAuth();
  return signOutFB(auth);
}
