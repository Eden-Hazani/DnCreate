import { useContext } from 'react';
import AuthContext from '../auth/context';

const useAuthContext = () => useContext(AuthContext);

export default useAuthContext;