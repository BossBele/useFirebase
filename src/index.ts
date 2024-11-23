export {
  AuthProvider,
  useAuth,
  getAuth,
  getCurrentUser,
  getEmailAuthCredential,
  getTenant,
  getToken,
  sendPasswordResetEmail,
  setTenant,
  signIn,
  signOut,
} from './auth';

export {
  FirestoreProvider,
  generateQuery,
  getDocument,
  getDocuments,
  getFirestore,
  useCollection,
  useCount,
  useDocument,
  useFirestore,
} from './database/firestore';

export { callFunction } from './functions';
