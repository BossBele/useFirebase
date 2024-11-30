import getFirestore from "./getFirestore";

/**
 * @function getDocumentsIds
 * Get document ids in a collection
 * @param {string} collection
 * @returns {Promise<string[]>}
 */
export default async function getDocumentsIds(collection: string) {
  const firestore = getFirestore();
  const store = firestore.collection(collection);

  const snapshot = await store.listDocuments();
  return snapshot.map((doc) => doc.id);
}
