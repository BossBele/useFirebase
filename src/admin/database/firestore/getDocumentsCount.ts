import generateQuery from "./generateQuery";
import { IDocumentsQueryOptions } from "./types";

/**
 * @function getDocumentsCount
 * Get firestore collection documents count
 * @param {string} collection
 * @param {IDocumentsQueryOptions} [options]
 * @returns {Promise<number>}
 */
export default async function getDocumentsCount(collection: string, options?: IDocumentsQueryOptions): Promise<number> {
  const query = generateQuery(collection, options);
  const snapshot = await query.count().get();

  const result = snapshot.data().count;
  return result;
}
