import { DocumentData, CollectionReference, collection as collectionFB } from 'firebase/firestore';
import getFirestore from './getFirestore';

export default function getCollectionRef(collection: string): CollectionReference<DocumentData, DocumentData> {
  const firestore = getFirestore();

  const collecionRef = collectionFB(firestore, collection);
  return collecionRef;
}
