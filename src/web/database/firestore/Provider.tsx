import React, {
  createContext,
  useCallback,
  useMemo,
  useRef
} from 'react';
import type { retrieveItem, storeItem } from './types';

/**
 * @type {{store: any }} FirestoreContext
 */
export const FirestoreContext = createContext({
  storeItem: (key: string, i) => null,
  retrieveItem: (key: string) => null
});

export default function Provider({ children }) {
  const store = useRef({});

  const storeItem = useCallback<storeItem>((collection, docs) => {
    if (!store.current?.[collection] || !store.current?.[collection].length !== docs.length) {
      store.current[collection] = docs;
    }
  }, []);

  const retrieveItem = useCallback<retrieveItem>((queryKey) => {
    return store.current?.[queryKey];
  }, []);

  const value = useMemo(
    () => ({
      storeItem,
      retrieveItem
    }),
    [storeItem, retrieveItem]
  );

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
}