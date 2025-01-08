import { GenericObject } from "../../../web/database/firestore/types";
import getFirestore from "./getFirestore";

/**
 * @function getDocument
 * Get firestore document
 * @param {string} collection - The collection name
 * @param {string} document - The document name
 * @param {string} [databaseId] - Optional database Id
 * @returns {Promise<GenericObject|null>}
 */
export default async function getDocument(collection: string, document: string, databaseId?: string): Promise<GenericObject|null> {
  const firestore = getFirestore(databaseId);
  const result = await firestore.collection(collection).doc(document).get();
  if (result.exists) {
    return { ...result.data(), id: result.id };
  }
  return null;
}
