import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { UserState } from './types';

const useAuth = (): UserState => useContext(AuthContext);
export default useAuth;