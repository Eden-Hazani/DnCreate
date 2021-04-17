import jwtDecode from 'jwt-decode';
import { UserModel } from '../models/userModel';
import { ActionType } from '../redux/action-type';
import { store } from '../redux/store';
import storage from './storage';



const handleToken = async (): Promise<UserModel | null> => {
    const token = await storage.getToken()
    if (!token) return null;
    const validToken: any = jwtDecode(token)
    const user: UserModel = validToken.user
    store.dispatch({ type: ActionType.SetUserInfo, payload: user })
    return user;
}

export default handleToken;