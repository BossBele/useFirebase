import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { getApps } from 'firebase/app';
import { DocumentData, getDocs, onSnapshot, query as queryFn, Query, QueryDocumentSnapshot, startAfter } from 'firebase/firestore';
import { IUseCollection, IUseCollectionValue } from './types';
import useFirestore from './useFirestore';
import { checkPersistenceSupport, getSessionItem, getStorage, setSessionItem, setStorage } from '../../utils';
import generateQuery from './generateQuery';

export default function useCollection({
    collection,
    enabled = true,
    persistence = 'context',
    withRealtimeUpdates = true,
    constraints,
    withPagination = false,
}: IUseCollection): IUseCollectionValue {
  const { store, storeItem } = useFirestore();

  const lastVisibleDoc = useRef<QueryDocumentSnapshot<DocumentData, DocumentData>|null>(null);

  const [isFetching, setIsFetching] = useState(false);
  const [records, setRecords] = useState(null);

  const cachedData = useMemo(() => {
    switch (persistence) {
        case 'context':
            return store[collection];
        case 'local':
            return getStorage(collection);
        case 'session':
            return getSessionItem(collection);
        case 'none':
        default:
            break;
    }
    return null;
  }, [store, collection]);

  const isEnabled: boolean = useMemo(() => {
    return Boolean(collection) && enabled
  }, [collection, enabled]);

  const query: Query = useMemo(() => generateQuery(collection, constraints), [collection, constraints]);

  const persistCache = useCallback((value) => {
    switch (persistence) {
        case 'context':
            return storeItem(collection, value);
        case 'local':
            return setStorage(collection, value);
        case 'session':
            return setSessionItem(collection, value);
        default:
            break;
    }
  }, [collection, storeItem]);

  const handleOnResults = useCallback((results) => {
    setRecords(results);
    persistCache(results);
  }, [persistCache]);

  /**
   * @function getCollection - subscribe to firestore query/collection
   * @param {import("firebase/firestore").Query} query - Firestore query
   * @param {string} collection - Query name or collection name
   * @returns {(import("firebase/firestore").Unsubscribe|function())} - Unsubscribe function
   */
  const getCollection = useCallback(async () => {
    if (!isEnabled) {
      return;
    }
    // check if firebase is initialized
    if (getApps().length < 1) {
      throw new Error('Firebase is not initialized');
    }

    setIsFetching(true);
    let unsubscribe = () => {};

    const finalQuery = lastVisibleDoc.current ? queryFn(query, startAfter(lastVisibleDoc.current)): query;

    const results: object[] = [];
    if (withRealtimeUpdates) {
      // listen for firestore changes
      unsubscribe = onSnapshot(finalQuery, (querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          const object = doc.data();
          results.push({ ...object, id: doc.id });
        });
        if (withPagination && querySnapshot.docs.length) {
          // Get the last visible document
          lastVisibleDoc.current = querySnapshot.docs[querySnapshot.docs.length - 1];
        }
      });
    } else {
      const querySnapshot = await getDocs(finalQuery);
      querySnapshot.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
      });
      if (withPagination && querySnapshot.docs.length) {
        // Get the last visible document
        lastVisibleDoc.current = querySnapshot.docs[querySnapshot.docs.length - 1];
      }
    }

    handleOnResults(results);
    setIsFetching(false);
    return unsubscribe;
  }, [query, isEnabled, handleOnResults, withPagination, withRealtimeUpdates]);

  useEffect(() => {
    checkPersistenceSupport(persistence);
  }, [persistence]);

  useEffect(() => {
    getCollection();
  }, [getCollection]);

  const value = useMemo(() => ({
    isFetching,
    isFetched: !isFetching && records !== null,
    records,
  }), [isFetching, records]);

  return value;
}
