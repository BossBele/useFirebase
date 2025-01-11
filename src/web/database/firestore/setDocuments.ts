import { doc, writeBatch } from 'firebase/firestore';
import getDocumentRef from './getDocumentRef';
import { GenericObject } from './types';
import getCollectionRef from './getCollectionRef';
import getFirestore from './getFirestore';

export async function setDocuments(collection: string, forms: GenericObject[]): Promise<void>;
export async function setDocuments(collection: string, documentIds: string[], form: GenericObject): Promise<void>;

/**
 * @function setDocuments
 * Set multiple documents in a collection
 * @param {string} collection - The collection name
 * @param {string[]|GenericObject[]} arg2 - The documentIds or form objects; if forms are provided, documents with random ids are created
 * @param {GenericObject} [form] - The form to set/update if documentId is provided
 * @returns {Promise<void>} - The documentId
 */
export default async function setDocuments(collection: string, arg2: string[]|GenericObject[], form?: GenericObject): Promise<void> {
  let documentIds = typeof form !== 'undefined' ? arg2 : null;
  let forms = typeof form === 'undefined' ? arg2 : null;

  const db = getFirestore();
  const batch = writeBatch(db);

  if (documentIds) {
    documentIds.forEach((documentId) => {
      const ref = getDocumentRef(collection, documentId);
      batch.set(ref, form, { merge: true });
    });
  } else {
    forms.forEach((form) => {
      const ref = doc(getCollectionRef(collection));
      batch.set(ref, form);
    });
  }
  await batch.commit();
}
