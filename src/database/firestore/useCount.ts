import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { getCountFromServer } from 'firebase/firestore';
import { getApps } from 'firebase/app';
import generateQuery from './generateQuery';

export default function useCount(props) {
  const {
    collection,
    constraints,
    enabled = true,
  } = props;

  const [count, setCount] = useState(0);
  const [isCounted, setIsCounted] = useState(false);

  const isEnabled = useMemo(() => collection && enabled && !isCounted, [collection, enabled, isCounted]);

  const isEmpty = useMemo(() => isCounted && count === 0, [count, isCounted]);

  const getCount = useCallback(async () => {
    if (getApps().length < 1) {
      throw new Error('Firebase is not initialized');
    }

    if (!isEnabled) {
      return;
    }

    const query = generateQuery(collection, constraints);

    const snapshot = await getCountFromServer(query);
    const recordsCount = snapshot.data().count;
    setCount(recordsCount);
    setIsCounted(true);
  }, [
    collection,
    constraints,
    isEnabled,
  ]);

  useEffect(() => {
    getCount();
  }, [getCount]);

  const value = useMemo(() => ({
    count,
    isCounted,
    isEmpty,
  }), [count, isCounted, isEmpty]);

  return value;
}
