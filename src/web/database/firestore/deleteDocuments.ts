import { writeBatch } from "firebase/firestore";
import getFirestore from "./getFirestore";
import getDocumentRef from "./getDocumentRef";

/**
 * @function deleteDocuments
 * Delete firestore document
 * @param {string} collection - The collection name
 * @param {string} documents - Array of document IDs
 * @returns {Promise<void>}
 */
export default async function deleteDocuments(collection: string, documents: string[]): Promise<void> {
  const db = getFirestore();
  // Get a new write batch
  const batch = writeBatch(db);

  documents.forEach((id) => {
    const ref = getDocumentRef(collection, id);
    batch.delete(ref);
  });

  await batch.commit();
}
