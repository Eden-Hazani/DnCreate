import storage from "./storage"
import jwtDecode from 'jwt-decode';

const setToken = async (token: any) => {
    await storage.storeToken(token)
    const tokenObj: any = jwtDecode(token);
    return tokenObj.user;
}

const decodeToken = (token: string) => {
    const tokenObj: any = jwtDecode(token);
    return tokenObj.user;
}

export default { setToken, decodeToken };