import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import cookies from '@boiseitguru/cookie-cutter';
import { getIdTokenResult, onIdTokenChanged } from 'firebase/auth';
import getAuth from "./getAuth";
import getCurrentUser from './getCurrentUser';

/**
 * @type {{user: User|null }} AuthContext
 */
export const AuthContext = createContext({
  user: null,
});

/**
 * @param {object} props
 * @param {React.ReactElement} props.children
 * @returns {React.ProviderProps<{user: User}>}
 */
export default function Provider({ children }) {
  const [currentUser, setUser] = useState(null);
  const [claims, setClaims] = useState(null);

  const refreshUser = useCallback(async () => {
    if (currentUser) {
      await currentUser.reload();
      // force refresh
      await currentUser.getIdToken(true);
    }
  }, [currentUser]);

  // listen for token changes
  // call setUser and write new token as a cookie
  useEffect(() => onIdTokenChanged(getAuth(), async (user) => {
    if (!user) {
      setUser(null);
      setClaims(null);
      cookies().set('__token', '', { path: '/', secure: true });
    } else {
      const { token, claims: userClaims } = await getIdTokenResult(user);
      setUser(user);
      setClaims(userClaims);
      cookies().set('__token', token, { path: '/', secure: true });
    }
  }), []);

  // force refresh the token every 60 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = getCurrentUser();
      if (user) await user.getIdToken(true)
    }, 60 * 60 * 1000)

    // clean up setInterval
    return () => clearInterval(handle)
  }, []);

  const value = useMemo(() => ({
    claims,
    user: currentUser,
    refreshUser,
  }), [claims, currentUser, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}