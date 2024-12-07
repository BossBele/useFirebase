export { default as init } from './init';
export { default as getApp } from './getApp';

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
  createModel,
  createRepository,
} from './database/firestore';

export { callFunction } from './functions';
