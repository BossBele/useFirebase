export interface FirebombOptions {
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
