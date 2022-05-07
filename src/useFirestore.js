import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'
import { getApps } from 'firebase/app'
import { onSnapshot } from 'firebase/firestore'

const FirestoreContext = createContext({
  store: {},
  saveQuery: () => null,
  getQuery: () => null
})

export const useFirestore = () => useContext(FirestoreContext)

export function FirestoreProvider({ children }) {
  const [store, setStore] = useState({})

  const saveQuery = useCallback(
    (collection, docs) => {
      if (!store[collection] || !store[collection].length !== docs.length) {
        setStore((prevStore) => ({
          ...prevStore,
          [collection]: docs
        }))
      }
    },
    [store]
  )

  /**
   * @function getQuery - subscribe to firestore query/collection
   * @param {import("firebase/firestore").Query} query - Firestore query
   * @param {string} collection - Query name or collection name
   * @returns {(import("firebase/firestore").Unsubscribe|function())} - Unsubscribe function
   */
  const getQuery = useCallback(
    (query, collection) => {
      if (!store[collection]) {
        // check if firebase is initialized
        if (getApps().length < 1) {
          throw new Error('Firebase is not initialized')
        }
        // listen for firestore changes
        const unsubscribe = onSnapshot(query, (querySnapshot) => {
          const result = []
          querySnapshot.docs.forEach((doc) => {
            const object = doc.data()
            result.push({ ...object, id: doc.id })
          })
          saveQuery(collection, result)
        })
        return unsubscribe
      }
      return () => {}
    },
    [store, saveQuery]
  )

  const value = useMemo(
    () => ({
      store,
      saveQuery,
      getQuery
    }),
    [store, saveQuery, getQuery]
  )

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  )
}
