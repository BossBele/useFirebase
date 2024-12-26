import { DocumentData, DocumentReference, doc } from 'firebase/firestore';
import getFirestore from './getFirestore';

export default function getDocumentRef(collection: string, documentId: string, databaseId?: string): DocumentReference<DocumentData, DocumentData> {
  const firestore = getFirestore(databaseId);

  const docRef = doc(firestore, collection, documentId);
  return docRef;
}
