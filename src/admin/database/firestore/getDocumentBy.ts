import { IDocumentsQueryOptions } from "./types";
import { GenericObject } from "../../../web/database/firestore/types";
import getDocuments from "./getDocuments";

/**
 * @function getDocuments
 * Get firestore document in a collection by query
 * @param {string} collection
 * @param {Omit<IDocumentsQueryOptions, 'limit'>} options
 * @returns {Promise<GenericObject|null>}
 */
export default async function getDocumentBy(collection: string, options: Omit<IDocumentsQueryOptions, 'limit'>): Promise<GenericObject|null> {
  const documents = await getDocuments(collection, { ...options, limit: 1 });

  return documents?.[0] ?? null;
}
