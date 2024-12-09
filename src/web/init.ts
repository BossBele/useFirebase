import { initializeApp, getApps, FirebaseOptions } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getFunctions } from 'firebase/functions';
import { getMessaging } from "firebase/messaging";
import { FirebombOptions } from './types';

export default function init(
  clientCredentials: FirebaseOptions,
  firebombOptions?: FirebombOptions,
) {
  const { useAuth = true, useFirestore = true, ...options } = firebombOptions || {};
  // Check that `window` is in scope for the modules!
  if (typeof window !== 'undefined' && !getApps().length) {
    const app = initializeApp(clientCredentials);

    if (useAuth) {
      getAuth(app);
    }

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
