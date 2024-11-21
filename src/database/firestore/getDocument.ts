import { doc, getDoc } from 'firebase/firestore';
import getFirestore from './getFirestore';
import { GenericObject, IGetDocumentsOptions } from './types';

export default async function getDocument(collection: string, documentId: string, options: IGetDocumentsOptions): Promise<GenericObject|null> {
  const firestore = getFirestore();

  const docRef = doc(firestore, collection, documentId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }
  return ({ ...docSnap.data(), id: docSnap.id });
}