import { signOut as signOutFB } from 'firebase/auth';
import getAuth from "./getAuth";

export default async function signOut(): Promise<void> {
  const auth = getAuth();
  return signOutFB(auth);
}
