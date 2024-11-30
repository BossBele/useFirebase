import React, {
  createContext,
  useCallback,
  useMemo,
  useState
} from 'react';
import { retrieveItem, storeItem } from './types';

/**
 * @type {{store: any }} FirestoreContext
 */
export const FirestoreContext = createContext({
  store: {},
  storeItem: (key: string, i) => null,
  retrieveItem: (key: string) => null
});

export default function Provider({ children }) {
  const [store, setStore] = useState({});

  const storeItem = useCallback<storeItem>((collection, docs) => {
    if (!store[collection] || !store[collection].length !== docs.length) {
      setStore((prevStore) => ({
        ...prevStore,
        [collection]: docs
      }));
    }
  }, [store]);

  const retrieveItem = useCallback<retrieveItem>((queryKey) => {
    return store[queryKey];
  }, [store]);

  const value = useMemo(
    () => ({
      store,
      storeItem,
      retrieveItem
    }),
    [store, storeItem, retrieveItem]
  );

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
}