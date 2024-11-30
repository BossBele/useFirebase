import { CollectionReference } from "firebase-admin/firestore";
import getFirestore from "./getFirestore";

export default function getCollectionRef(collection: string): CollectionReference {
  const firestore = getFirestore();
  return firestore.collection(collection);
}
