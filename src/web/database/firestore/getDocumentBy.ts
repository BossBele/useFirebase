import { GenericObject, IGetDocumentsOptions } from './types';
import getDocuments from './getDocuments';

/**
 * @function getDocumentBy
 * Get a single document from a collection by condition
 * @param {string} collection - Collection name
 * @param {Omit<IGetDocumentsOptions, 'limit'>} [options] - Query options
 * @returns {Promise<GenericObject|null>}
 */
export default async function getDocumentBy(collection: string, options?: Omit<IGetDocumentsOptions, 'limit'>): Promise<GenericObject|null> {
  const documents = await getDocuments(collection, { ...options, limit: 1 });
  return documents?.[0] ?? null;
}