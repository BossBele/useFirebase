import { getAuth, signOut as signOutFB } from 'firebase/auth';
import { signOut } from './types';

export default async function signOut(): Promise<void> {
  const auth = getAuth();
  return signOutFB(auth);
}
