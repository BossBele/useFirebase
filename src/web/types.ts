import type { FirebaseApp } from "firebase/app";
import type { Auth, EmailAuthCredential, User, UserCredential } from "firebase/auth";
import type { CollectionReference, DocumentData, DocumentReference, Firestore, Query } from "firebase/firestore";
import type { BaseDocument, DocumentModelInstance, GenericObject, ICollectionModel, IGetDocumentsOptions, IUseCollection, IUseCollectionValue, IUseCount, IUseCountValue, IUseDocument, IUseDocumentValue, IUseFirestore } from "./database/firestore/types";
import type { ISignIn, UserState } from "./auth/types";
import type { Messaging } from "firebase/messaging";
import type { IAppNotificationsContext } from "./messaging/types";
import type { Functions } from "firebase/functions";

export interface FirebombOptions {
  /**
   * use this to enable Firebase Auth
   * @default true
   */
  useAuth?: boolean,
  /**
   * use this to enable Firebase Analytics
   */
  useAnalytics?: boolean,
  /**
   * use this to enable Firebase Realtime Database
   */
  useRealtimeDB?: boolean,
  /**
   * use this to enable Firebase Firestore
   * @default true
   */
  useFirestore?: boolean,
  /**
   * use this to enable Firebase Functions
   */
  useFunctions?: boolean,
  /**
   * use this to enable Firebase Cloud Messaging
   */
  useMessaging?: boolean,
}

export interface WebModule {
  /**
   * Initialize Firebomb
   * @param options FirebombOptions
   */
  init(options: FirebombOptions): void,
  getApp(): FirebaseApp,
  getApps(): FirebaseApp[],
  AuthProvider: ({ children }: { children: any }) => React.JSX.Element,
  useAuth: () => UserState,
  getAuth: (app?: FirebaseApp) => Auth|null,
  getCurrentUser: () => User|null;
  getEmailAuthCredential: (password: string) => EmailAuthCredential,
  getTenant: () => string | null,
  getToken: () => Promise<string>,
  sendPasswordResetEmail: (email: string, url: string) => Promise<void>,
  setTenant: (tenant: string) => void,
  signIn: (params: ISignIn) => Promise<UserCredential>,
  signOut: () => Promise<void>,
  createModel: <T>(collection: string, schema: Partial<T>, data?: GenericObject) => DocumentModelInstance<BaseDocument & typeof data>,
  createRepository: <T>(name: string, schema: GenericObject) => (new () => ICollectionModel<T>),
  deleteDocument: (collection: string, document: string) => Promise<void>,
  deleteDocuments: (collection: string, documents: string[]) => Promise<void>,
  FirestoreProvider: ({ children }: { children: any }) => React.JSX.Element,
  generateQuery: (collection: string, options?: IGetDocumentsOptions) => Query,
  getDocument: (collection: string, documentId: string) => Promise<GenericObject|null>,
  getDocumentRef: (collection: string, documentId: string, databaseId?: string) => DocumentReference<DocumentData, DocumentData>,
  getDocuments: (collection: string, options?: IGetDocumentsOptions) => Promise<GenericObject[]>,
  getCollectionRef: (collection: string, databaseId?: string) => CollectionReference<DocumentData, DocumentData>,
  getFirestore: () => Firestore|null,
  useCollection: (params: IUseCollection) => IUseCollectionValue,
  useCount: (props: IUseCount) => IUseCountValue,
  useDocument: (params: IUseDocument) => IUseDocumentValue,
  useFirestore: () => IUseFirestore,
  getFunctions: (app?: FirebaseApp) => Functions|null,
  callFunction: (name: string, payload: object) => Promise<any>;
  getMessaging: (app?: FirebaseApp) => Messaging,
  AppNotificationsProvider: ({ children }: { children: any }) => React.JSX.Element,
  useAppNotifications: () => IAppNotificationsContext,
}
