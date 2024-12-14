import type { App } from 'firebase-admin/app';
import type { ActionCodeSettings, Auth, TenantAwareAuth, UserRecord } from 'firebase-admin/auth';
import type { CollectionReference, DocumentData, DocumentReference, Firestore, Query } from 'firebase-admin/firestore';
import type { Messaging } from 'firebase-admin/messaging';
import type { IDocumentsQueryOptions } from './database/firestore/types';
import type { GenericObject, IGetDocumentsOptions } from '../web/database/firestore/types';
import type { IAuthOptions } from './auth/types';

export interface AdminModule {
  admin: object,
  auth: Auth,
  generateEmailVerificationLink: (email: string, actionCodeSettings?: ActionCodeSettings) => Promise<string>,
  generatePasswordResetLink: (email: string, actionCodeSettings?: ActionCodeSettings) => Promise<string>,
  getAuth: (param?: App|IAuthOptions) => Auth|TenantAwareAuth,
  getCurrentUser: (options: IAuthOptions) => Promise<UserRecord>,
  getSession: () => string,
  isUserAuthenticated: (session?: string, options?: IAuthOptions) => Promise<boolean>,
  revokeSession: (session: string, options: IAuthOptions) => Promise<void>,
  firestore: Firestore,
  getFirestore: (app?: App) => Firestore,
  deleteDocument: (collection: string, document: string) => Promise<FirebaseFirestore.WriteResult>
  generateQuery: (collection: string, options?: IDocumentsQueryOptions) => Query<DocumentData, DocumentData>,
  getCollectionRef: (collection: string) => CollectionReference,
  getDocument: (collection: string, document: string) => Promise<GenericObject|null>,
  getDocumentBy: (collection: string, options: Omit<IDocumentsQueryOptions, 'limit'>) => Promise<GenericObject|null>,
  getDocumentIds: (collection: string) => Promise<string[]>,
  getDocumentRef: (collection: string, document: string) => DocumentReference,
  getDocuments: (collection: string, options?: IDocumentsQueryOptions) => Promise<GenericObject[]>,
  getDocumentsCount: (collection: string, options?: IDocumentsQueryOptions) => Promise<number>,
  getFieldSummation: (collection: string, aggregateField: string, options?: IGetDocumentsOptions) => Promise<number>,
  listCollections: (databaseId?: string) => Promise<string[]>,
  setDocument: (collection: string, arg2: string|GenericObject, form?: GenericObject) => Promise<string>,
  messaging: Messaging,
  getMessaging: (app?: App) => Messaging,
}