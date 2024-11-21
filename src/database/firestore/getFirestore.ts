import { Firestore, getFirestore as getFirestoreFB } from 'firebase/firestore';

export default function getFirestore(): Firestore {
    return getFirestoreFB();
}