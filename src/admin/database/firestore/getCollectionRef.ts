import { CollectionReference } from "firebase-admin/firestore";
import getFirestore from "./getFirestore";

export default function getCollectionRef(collection: string, databaseId?: string): CollectionReference {
  const firestore = getFirestore(databaseId);
  return firestore.collection(collection);
}
