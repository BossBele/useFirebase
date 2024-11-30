import getFirestore from "./getFirestore";

/**
 * @function listCollections
 * List names of firestore database collections
 * @param {string} [databaseId]
 * @returns {Promise<string[]>}
 */
export default async function listCollections(databaseId?: string): Promise<string[]> {
  const firestore = getFirestore(databaseId);
  const collections = await firestore.listCollections();
  return collections.map((collection) => collection.id);
}
