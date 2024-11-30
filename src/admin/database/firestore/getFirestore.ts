import { App } from "firebase-admin/app";
import { Firestore, getFirestore as getFirestoreFB } from "firebase-admin/firestore";

export function getFirestore(): Firestore;
export function getFirestore(databaseId?: string): Firestore;
export function getFirestore(app?: App): Firestore;

/**
 * @function getFirestore
 * Get a Firestore service for the default app or a given app
 * @param {App|string} [app]
 * @returns {Firestore}
 */
export default function getFirestore(app?: any): Firestore {
  return getFirestoreFB(app);
}
