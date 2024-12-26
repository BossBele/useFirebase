import { DocumentData, CollectionReference, collection as collectionFB } from 'firebase/firestore';
import getFirestore from './getFirestore';

export default function getCollectionRef(collection: string, databaseId?: string): CollectionReference<DocumentData, DocumentData> {
  const firestore = getFirestore(databaseId);

  const collecionRef = collectionFB(firestore, collection);
  return collecionRef;
}
