import { useContext } from 'react';
import { FirestoreContext } from './Provider';
import { IUseFirestore } from './types';

const useFirestore = (): IUseFirestore => useContext(FirestoreContext);
export default useFirestore;