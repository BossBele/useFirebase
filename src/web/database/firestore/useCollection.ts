import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { getApps } from 'firebase/app';
import { getDocs, onSnapshot, Query } from 'firebase/firestore';
import { IUseCollection } from './types';
import useFirestore from './useFirestore';
import { checkPersistenceSupport, getSessionItem, getStorage, setSessionItem, setStorage } from '../../utils';
import generateQuery from './generateQuery';

export default function useCollection({
    collection,
    enabled = true,
    persistence = 'context',
    withRealtimeUpdates = true,
    constraints
}: IUseCollection) {
  const { store, storeItem } = useFirestore();

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
        default:
            break;
    }
    return null;
  }, [store, collection]);

  const isNotCached: boolean = useMemo(() => !cachedData, [cachedData]);

  const isEnabled: boolean = useMemo(() => {
    return collection && enabled && isNotCached
  }, [collection, enabled, isNotCached]);

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

    if (withRealtimeUpdates) {
      // listen for firestore changes
      unsubscribe = onSnapshot(query, (querySnapshot) => {
        const results = [];
        querySnapshot.docs.forEach((doc) => {
          const object = doc.data();
          results.push({ ...object, id: doc.id });
        });
        handleOnResults(results);
      });
    }

    const querySnapshot = await getDocs(query);
    const results = [];
    querySnapshot.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
    });

    setIsFetching(false);
    return unsubscribe;
  }, [query, isEnabled, handleOnResults, withRealtimeUpdates]);

  useEffect(() => {
    checkPersistenceSupport(persistence);
  }, [persistence]);

  const value = useMemo(() => ({
    isFetching,
    isFetched: !isFetching && records !== null,
    records,
  }), [isFetching, records]);

  return value;
}