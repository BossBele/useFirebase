import { GenericObject } from "../../../web/database/firestore/types";
import getFirestore from "./getFirestore";

export async function setDocument(collection: string, form: GenericObject): Promise<string>;
export async function setDocument(collection: string, documentId: string, form: GenericObject): Promise<string>;

/**
 * @function setDocument
 * Set a document in a collection
 * @param {string} collection - The collection name
 * @param {string|GenericObject} arg2 - The documentId or form object; if form is provided, a document with random id be created
 * @param {GenericObject} [form] - The form to set/update if documentId is provided
 * @returns {Promise<string>} - The documentId
 */
export default async function setDocument(collection: string, arg2: string|GenericObject, form?: GenericObject): Promise<string> {
  const firestore = getFirestore();
  const collectionRef = firestore.collection(collection);

  let refId = typeof arg2 === 'string' ? arg2 : '';
  if (typeof arg2 === 'string') {
    // documentId provided
    await collectionRef.doc(arg2).set(form, { merge: true });
  } else {
    const docRef = await collectionRef.add(arg2);
    refId = docRef.id;
  }
  return refId;
}
