import getFirestore from "./getFirestore";

/**
 * @function getDocumentsIds
 * Get document ids in a collection
 * @param {string} collection
 * @param {string} [databaseId] - Optional database Id
 * @returns {Promise<string[]>}
 */
export default async function getDocumentsIds(collection: string, databaseId?: string): Promise<string[]> {
  const firestore = getFirestore(databaseId);
  const store = firestore.collection(collection);

  const snapshot = await store.listDocuments();
  return snapshot.map((doc) => doc.id);
}
