import getFirestore from "./getFirestore";
import getCollectionRef from "./getCollectionRef";

/**
 * @function deleteDocuments
 * Delete firestore documents in a batch
 * @param {string} collection - The collection name
 * @param {string} documents - Array of document IDs
 * @returns {Promise<FirebaseFirestore.WriteResult[]>}
 */
export default async function deleteDocuments(collection: string, documents: string[]): Promise<FirebaseFirestore.WriteResult[]> {
  const firestore = getFirestore();
  const batch = firestore.batch();

  const collectionRef = getCollectionRef(collection);
  documents.forEach((doc) => {
    const ref = collectionRef.doc(doc);
    batch.delete(ref);
  });

  const WriteResults = await batch.commit();
  return WriteResults;
}
