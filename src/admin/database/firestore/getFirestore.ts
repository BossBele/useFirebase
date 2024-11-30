import { App } from "firebase-admin/app";
import { Firestore, getFirestore as getFirestoreFB } from "firebase-admin/firestore";

export function getFirestore(databaseId: string): Firestore;
export function getFirestore(app: App): Firestore;
export default function getFirestore(app): Firestore {
  return getFirestoreFB(app);
}
