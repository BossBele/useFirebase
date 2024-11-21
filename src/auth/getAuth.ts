import { Auth, getAuth as getAuthFB } from 'firebase/auth';

const auth = getAuthFB();

export default function getAuth(): Auth {
  return auth;
}
