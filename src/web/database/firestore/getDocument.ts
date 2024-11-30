import getDocumentByRef from './getDocumentByRef';
import getDocumentRef from './getDocumentRef';
import { GenericObject } from './types';

export default async function getDocument(collection: string, documentId: string): Promise<GenericObject|null> {
  const docRef = getDocumentRef(collection, documentId);
  const docData = await getDocumentByRef(docRef);

  return docData;
}
