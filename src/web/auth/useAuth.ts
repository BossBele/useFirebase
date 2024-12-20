import { useContext } from 'react';
import { AuthContext } from './Provider';
import type { UserState } from './types';

const useAuth = (): UserState => useContext(AuthContext);
export default useAuth;