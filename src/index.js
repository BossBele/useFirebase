import { AuthProvider, useAuth, signIn } from './auth/useAuth'
import { FirestoreProvider, useFirestore } from './useFirestore'

// expose Auth and Firestore providers and hooks
export { AuthProvider, useAuth, FirestoreProvider, useFirestore }
