import { DocumentReference } from "firebase-admin/firestore";
import getCollectionRef from "./getCollectionRef";

/**
 * @function getDocumentRef
 * Get Document Reference
 * @param {string} collection - collection name
 * @param {string} document - document name
 * @returns {DocumentReference}
 */
export default function getDocumentRef(collection: string, document: string): DocumentReference {
  const collectionRef = getCollectionRef(collection);
  const ref = collectionRef.doc(document);
  return ref;
}
