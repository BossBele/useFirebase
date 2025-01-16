import { getStorage as getStorageFB, FirebaseStorage } from 'firebase/storage';
import { getApps } from '..';
import type { FirebaseApp } from 'firebase/app';

export default function getStorage(app?: FirebaseApp): FirebaseStorage|null {
  if (getApps()?.length) {
    const storage = getStorageFB(app);
    return storage;
  }
  return null;
}
