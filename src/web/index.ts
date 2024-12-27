export { default as init } from './init';
export { default as getApp } from './getApp';
export { default as getApps } from './getApps';

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
  deleteDocument,
  deleteDocuments,
  generateQuery,
  getDocument,
  getDocumentRef,
  getDocuments,
  getFirestore,
  getCollectionRef,
  useCollection,
  useCount,
  useDocument,
  useFirestore,
  createModel,
  createRepository,
} from './database/firestore';

export { callFunction, getFunctions } from './functions';

export { AppNotificationsProvider, getMessaging, useAppNotifications } from './messaging';
