import { DocumentData, DocumentReference, getDoc } from 'firebase/firestore';
import { GenericObject } from './types';

export default async function getDocumentByRef(docRef: DocumentReference<DocumentData, DocumentData>): Promise<GenericObject|null> {
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }
  return docSnap.data();
}
