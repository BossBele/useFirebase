import { Auth, getAuth as getAuthFB } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';
import { getApp } from '../';

export default function getAuth(app?: FirebaseApp): Auth|null {
  if (getApp()) {
    const auth = getAuthFB(app);
    return auth;
  }
  return null;
}
