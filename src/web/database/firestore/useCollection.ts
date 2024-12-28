import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { getApps } from 'firebase/app';
import { getDocs, onSnapshot, Query } from 'firebase/firestore';
import { IUseCollection, IUseCollectionValue } from './types';
import useFirestore from './useFirestore';
import { checkPersistenceSupport, getSessionItem, getStorage, setSessionItem, setStorage } from '../../utils';
import generateQuery from './generateQuery';

const EMPTY_FN = () => {};

export default function useCollection({
    collection,
    enabled = true,
    persistence = 'context',
    withRealtimeUpdates = true,
    constraints: constraintsProp,
}: IUseCollection): IUseCollectionValue {
  const { retrieveItem, storeItem } = useFirestore();

  const unsubscribeFn = useRef(EMPTY_FN);

  const [isFetching, setIsFetching] = useState(false);
  const [records, setRecords] = useState(null);
  
  const constraints = useMemo(() => constraintsProp, [constraintsProp]);

  const getCachedData = useCallback(() => {
    switch (persistence) {
        case 'context':
            return retrieveItem(collection);
        case 'local':
            return getStorage(collection);
        case 'session':
            return getSessionItem(collection);
        case 'none':
        default:
            break;
    }
    return null;
  }, [collection, persistence, retrieveItem]);

  const isEnabled: boolean = useMemo(() => {
    return Boolean(collection) && enabled
  }, [collection, enabled]);

  const query: Query = useMemo(() => {
    return generateQuery(collection, constraints);
  }, [collection, constraints]);

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

  useEffect(() => {
    checkPersistenceSupport(persistence);
  }, [persistence]);

  useEffect(() => {
    /**
     * @function getCollection - subscribe to firestore query/collection
     * @returns {Promise<import("firebase/firestore").Unsubscribe|function()>} - Unsubscribe function
     */
    async function getCollection() {
      if (!isEnabled) {
        return;
      }
      if (getCachedData()?.length >= constraints?.limit) {
        setRecords(getCachedData());
      }
      // check if firebase is initialized
      if (getApps().length < 1) {
        throw new Error('Firebase is not initialized');
      }

      setIsFetching(true);

      if (withRealtimeUpdates) {
        // listen for firestore changes
        const unsubscribe = onSnapshot(query, (querySnapshot) => {
          const results: object[] = [];
          querySnapshot.forEach((doc) => {
            const object = doc.data();
            results.push({ ...object, id: doc.id });
          });
          handleOnResults(results);
        });
        unsubscribeFn.current = unsubscribe;
      } else {
        const querySnapshot = await getDocs(query);
        const results: object[] = [];
        querySnapshot.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id });
        });
        handleOnResults(results);
      }

      setIsFetching(false);
    }
    getCollection();
    return () => {
      if (typeof unsubscribeFn.current === 'function') {
        unsubscribeFn.current();
      }
    };
  }, [getCachedData, constraints?.limit, query, isEnabled, handleOnResults, withRealtimeUpdates]);

  const value = useMemo(() => ({
    isFetching,
    isFetched: !isFetching && records !== null,
    records,
  }), [isFetching, records]);

  return value;
}
