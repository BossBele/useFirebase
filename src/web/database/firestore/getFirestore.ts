import { Firestore, getFirestore as getFirestoreFB } from 'firebase/firestore';
import getApp from '../../getApp';

export default function getFirestore(databaseId?: string): Firestore|null {
    if (getApp()) {
      return getFirestoreFB(databaseId);
    }
    return null;
}