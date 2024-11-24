import { FirebaseApp, getApp as getAppFB, getApps } from 'firebase/app';

export default function getApp(): FirebaseApp|null {
  if(getApps()?.length) {
    const app = getAppFB();
    return app;
  }
  return null;
}
