import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { getApps } from 'firebase/app';
import getDocumentsCount from './getDocumentsCount';
import { IUseCount, IUseCountValue } from './types';

export default function useCount(props: IUseCount): IUseCountValue {
  const {
    collection,
    constraints: constraintsProp,
    enabled = true,
  } = props;

  const [count, setCount] = useState(0);
  const [isCounted, setIsCounted] = useState(false);

  const constraints = useMemo(() => constraintsProp, [constraintsProp]);

  const isEnabled = useMemo(() => collection && enabled && !isCounted, [collection, enabled, isCounted]);

  const isEmpty = useMemo(() => isCounted && count === 0, [count, isCounted]);

  const getCount = useCallback(async () => {
    if (getApps().length < 1) {
      throw new Error('Firebase is not initialized');
    }

    if (!isEnabled) {
      return;
    }

    const recordsCount = await getDocumentsCount(collection, constraints);
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
