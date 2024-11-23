import { initializeApp, getApps, FirebaseOptions } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getFunctions } from 'firebase/functions';
import { getMessaging } from "firebase/messaging";
import { FirebombOptions } from './types';

export default function init(
  clientCredentials: FirebaseOptions,
  { useFirestore = true, ...options}: FirebombOptions,
) {
  // Check that `window` is in scope for the modules!
  if (typeof window !== 'undefined' && !getApps().length) {
    const app = initializeApp(clientCredentials);

    if (useFirestore) {
      getFirestore(app);
    }

    if (options?.useRealtimeDB) {
      getDatabase(app);
    }

    if (options?.useFunctions) {
      getFunctions(app);
    }

    if (options?.useMessaging) {
      getMessaging(app);
    }

    if (options?.useAnalytics) {
      if (!('measurementId' in clientCredentials)) {
        throw new Error('measurementId is required for Firebase Analytics');
      }
      getAnalytics(app);
    }
  }
}
