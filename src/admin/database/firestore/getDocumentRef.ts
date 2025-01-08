import { DocumentReference } from "firebase-admin/firestore";
import getCollectionRef from "./getCollectionRef";

/**
 * @function getDocumentRef
 * Get Document Reference
 * @param {string} collection - collection name
 * @param {string} document - document name
 * @param {string} [databaseId] - Optional database Id
 * @returns {DocumentReference}
 */
export default function getDocumentRef(collection: string, document: string, databaseId?: string): DocumentReference {
  const collectionRef = getCollectionRef(collection, databaseId);
  const ref = collectionRef.doc(document);
  return ref;
}
