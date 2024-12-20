import { deleteDoc } from "firebase/firestore";
import getDocumentRef from "./getDocumentRef";

/**
 * @function deleteDocument
 * Delete firestore document
 * @param {string} collection - The collection name
 * @param {string} document - The document name
 * @returns {Promise<FirebaseFirestore.WriteResult>}
 */
export default async function deleteDocument(collection: string, document: string): Promise<void> {
  const ref = getDocumentRef(collection, document);
  await deleteDoc(ref);
}

