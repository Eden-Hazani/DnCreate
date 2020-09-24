import jwtDecode from 'jwt-decode';
import { UserModel } from '../models/userModel';
import { ActionType } from '../redux/action-type';
import { store } from '../redux/store';
import storage from './storage';



const handleToken = async (): Promise<any> => {
    const token = await storage.getToken()
    if (!token) return null;
    const validToken: any = jwtDecode(token)
    store.dispatch({ type: ActionType.SetUserInfo, payload: validToken.user })
    return validToken.user;
}

export default handleToken;