import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import nookies from 'nookies'

/**
 * Firebase Auth
 * @typedef { import("firebase/auth").Auth } Auth
 */

/**
 * Firebase user
 * @typedef { import("firebase/auth").User } User
 */

/**
 * @callback onAuthStateChanged
 * @param {User|null} callback
 * @returns {void}
 */

/**
 * @callback authStateChangedCallback
 * @param {User|null} user
 * @returns {void}
 */

/**
 * @type {{user: User|null, onAuthStateChanged: onAuthStateChanged}} AuthContext
 */
const AuthContext = createContext({
  user: null,
  onAuthStateChanged: () => {}
})

/**
 * @function useAuth
 * @returns {{user: User|null, onAuthStateChanged: function()}}
 */
export const useAuth = () => useContext(AuthContext)

/**
 * @param {object} props
 * @param {Auth} props.auth - Firebase initialized Auth instance
 * @param {React.ReactElement} props.children
 * @returns {React.ProviderProps<{user: User, onAuthStateChanged: onAuthStateChanged}>}
 */
export function AuthProvider({ children, auth }) {
  const [currentUser, setUser] = useState(null)

  // listen for token changes
  // call setUser and write new token as a cookie
  const onAuthStateChanged = useCallback(
    (callback) =>
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          if (callback && typeof callback === 'function') {
            callback(user)
          }
        }
      }),
    []
  )

  // listen for token changes
  // call setUser and write new token as a cookie
  useEffect(
    () =>
      auth.onIdTokenChanged(async (user) => {
        if (!user) {
          setUser(null)
          nookies.set(undefined, 'token', '', { path: '/' })
        } else {
          const { token } = await user.getIdTokenResult()
          setUser(user)
          nookies.set(undefined, 'token', token, { path: '/' })
        }
      }),
    []
  )

  // force refresh the token every 60 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth.currentUser
      if (user) await user.getIdToken(true)
    }, 60 * 60 * 1000)

    // clean up setInterval
    return () => clearInterval(handle)
  }, [])

  const value = useMemo(
    () => ({
      user: currentUser,
      onAuthStateChanged
    }),
    [currentUser, onAuthStateChanged]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
