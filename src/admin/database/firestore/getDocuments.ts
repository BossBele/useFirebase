import { IDocumentsQueryOptions } from "./types";
import { GenericObject } from "../../../web/database/firestore/types";
import generateQuery from "./generateQuery";

/**
 * @function getDocuments
 * Get firestore documents in a collection
 * @param {string} collection
 * @param {IDocumentsQueryOptions} options
 * @returns {Promise<GenericObject[]>}
 */
export default async function getDocuments(collection: string, options: IDocumentsQueryOptions): Promise<GenericObject[]> {
  const documents = [];

  const query = generateQuery(collection, options);

  const snapshot = await query.get();
  snapshot.forEach((doc) => {
    if (options?.withSubcollections) {
      doc.ref.listCollections();
    }
    documents.push({ ...doc.data(), id: doc.id });
  });

  return documents;
}
