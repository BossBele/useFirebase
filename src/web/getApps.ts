import { FirebaseApp, getApps as getAppsFB } from 'firebase/app';

export default function getApps(): FirebaseApp[] {
  return getAppsFB();
}
