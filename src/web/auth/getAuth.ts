import { Auth, getAuth as getAuthFB } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';
import getApps from '../getApps';

export default function getAuth(app?: FirebaseApp): Auth|null {
  if (getApps()?.length) {
    const auth = getAuthFB(app);
    return auth;
  }
  return null;
}
