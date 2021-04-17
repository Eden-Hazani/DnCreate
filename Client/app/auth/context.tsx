/* eslint-disable camelcase */
import React, {
    createContext,
    useEffect,
    useReducer,
} from 'react';
import type { FC, ReactNode } from 'react';
import { UserModel } from '../models/UserModel';
import startUpLoginCheck from '../../utility/core/startUpLogin'
import authApi from '../api/authApi';
import reduxToken from './reduxToken';
import { store } from '../redux/store';
import { ActionType } from '../redux/action-type';
import errorHandler from '../../utility/errorHander';
import AsyncStorage from '@react-native-community/async-storage';


interface AuthState {
    isInitialised: boolean;
    isAuthenticated: boolean;
    user: UserModel | null;
}

interface AuthContextValue extends AuthState {
    login: (remainedLogged: boolean, values: any, isGoogleSignIn: boolean) => Promise<any>;
    register: (values: any) => Promise<any>;
    offlineLogin: () => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

type InitialiseAction = {
    type: 'INITIALISE';
    payload: {
        isAuthenticated: boolean;
        user: UserModel | null;
    };
};


type LoginAction = {
    type: 'LOGIN';
    payload: {
        user: UserModel;
    };
};

type LogoutAction = {
    type: 'LOGOUT';
};



type OfflineLogin = {
    type: 'OFFLINELOGIN';
    payload: {
        user: UserModel;
    };
};


type Action =
    | InitialiseAction
    | LoginAction
    | LogoutAction
    | OfflineLogin

const initialAuthState: AuthState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
};





const reducer = (state: AuthState, action: Action): AuthState => {
    switch (action.type) {
        case 'INITIALISE': {
            const { isAuthenticated, user } = action.payload;

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user,
            };
        }
        case 'LOGIN': {
            const { user } = action.payload;
            return {
                ...state,
                isAuthenticated: true,
                user,
            };
        }


        case 'OFFLINELOGIN': {
            const { user } = action.payload;
            return {
                ...state,
                isAuthenticated: true,
                user,
            };
        }

        case 'LOGOUT': {
            store.dispatch({ type: ActionType.Logout })
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            };
        }
        default: {
            return { ...state };
        }
    }
};

const AuthContext = createContext<AuthContextValue>({
    ...initialAuthState,
    login: () => Promise.resolve(),
    register: () => Promise.resolve(),
    offlineLogin: () => { },
    logout: () => { },
});


export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialAuthState);

    const login = async (remainedLogged: boolean, values: any, isGoogleSignIn: boolean) => {
        return await authApi.login(values, remainedLogged).then(result => {
            const userInfo: any = result.data.token;
            reduxToken.setToken(userInfo).then((validToken: UserModel) => {
                store.dispatch({ type: ActionType.SetUserInfoLoginRegister, payload: validToken })
                dispatch({ type: 'LOGIN', payload: { user: validToken } })
                return false
            })
            return false
        }).catch(err => {
            if (isGoogleSignIn) {
                return 'noUserExists'
            }
            errorHandler(err.request)
            return false
        })
    }

    const register = async (values: any) => {
        const validValues = {
            username: values.username.toLowerCase().trim(),
            password: values.password,
            passwordConfirmation: values.passwordConfirmation
        }
        const loginValues = {
            username: values.username.toLowerCase().trim(),
            password: values.password
        }
        return await authApi.register(validValues).then(async (result) => {
            const userInfo: any = result.data;
            alert(userInfo.message)
            return await login(false, loginValues, false)
        }).catch(err => {
            errorHandler(err.request)
            return false
        });
    }


    const offlineLogin = async () => {
        const offlineUser: any = { username: 'Offline', activated: true, _id: 'Offline', password: undefined, profileImg: undefined }
        store.dispatch({ type: ActionType.SetUserInfo, payload: offlineUser })
        await AsyncStorage.setItem('isOffline', JSON.stringify(true));
        dispatch({ type: 'OFFLINELOGIN', payload: { user: offlineUser } })
    }

    const logout = () => dispatch({ type: 'LOGOUT' });



    useEffect(() => {
        const initialise = async () => {
            try {
                const user = await startUpLoginCheck()
                if (user) {
                    dispatch({
                        type: 'INITIALISE',
                        payload: {
                            isAuthenticated: true,
                            user: user,
                        },
                    });
                } else {
                    dispatch({
                        type: 'INITIALISE',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: 'INITIALISE',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        };

        initialise();
    }, []);

    if (!state.isInitialised) {
        return null;
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                register,
                offlineLogin,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
