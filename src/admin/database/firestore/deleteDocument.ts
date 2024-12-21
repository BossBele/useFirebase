import getFirestore from "./getFirestore";

/**
 * @function deleteDocument
 * Delete firestore document
 * @param {string} collection - The collection name
 * @param {string} document - The document name
 * @returns {Promise<FirebaseFirestore.WriteResult>}
 */
export default async function deleteDocument(collection: string, document: string): Promise<FirebaseFirestore.WriteResult> {
  const firestore = getFirestore();
  const writeTime = await firestore.collection(collection).doc(document).delete();
  return writeTime;
}
