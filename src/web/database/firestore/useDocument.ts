import {
  useCallback, useEffect, useMemo, useState, useRef,
} from 'react';
import { getApps } from 'firebase/app';
import { onSnapshot } from 'firebase/firestore';
import getDocumentByRef from './getDocumentByRef';
import getDocumentRef from './getDocumentRef';

export default function useDocument({
  collection,
  documentId,
  enabled = true,
  withRealtimeUpdates = true,
}) {
  const unsubscribeFn = useRef(null);

  const [record, setRecord] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  const isEnabled = useMemo(() => collection && documentId && enabled && !isFetched && !record, [
    collection,
    documentId,
    enabled,
    isFetched,
    record,
  ]);

  const retrieveDocument = useCallback(async () => {
    if (getApps().length < 1) {
      throw new Error('Firebase is not initialized');
    }

    if (!isEnabled) {
      return;
    }

    setIsFetching(true);

    const ref = getDocumentRef(collection, documentId);

    if (withRealtimeUpdates) {
      const unsubscribe = onSnapshot(ref, (doc) => {
        const document = doc.data();
        setRecord(document);
      });
      unsubscribeFn.current = unsubscribe;
    } else {
      const document = await getDocumentByRef(ref);
      setRecord(document);
    }

    setIsFetched(true);
    setIsFetching(false);
  }, [isEnabled]);

  useEffect(() => {
    retrieveDocument();
    return () => {
      if (typeof unsubscribeFn.current === 'function') {
        unsubscribeFn.current();
      }
    };
  }, [retrieveDocument]);

  const value = useMemo(() => ({
    isFetching,
    isFetched,
    record,
  }), [record, isFetched, isFetching]);

  return value;
}
