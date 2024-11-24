import { Firestore, getFirestore as getFirestoreFB } from 'firebase/firestore';
import getApp from '../../getApp';

export default function getFirestore(): Firestore|null {
    if (getApp()) {
      return getFirestoreFB();
    }
    return null;
}