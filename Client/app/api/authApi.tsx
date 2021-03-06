import { ApiResponse } from 'apisauce';
import { UserModel } from '../models/userModel';
import client from './client';
declare global {
    interface FormDataValue {
        uri: string;
        name: string;
        type: string;
    }
    interface FormData {
        append(name: string, value: FormDataValue, fileName?: string): void;
        set(name: string, value: FormDataValue, fileName?: string): void;
    }
}
const endpoint = '/auth'

const register = (values: any) => {
    let formData: FormData = new FormData();
    formData.append("userInfo", JSON.stringify(values))
    return client.setHeader('content-type', 'multipart/form-data').post<any>(`${endpoint}/register`, formData);
}
const googleRegister = (values: any) => {
    let formData: FormData = new FormData();
    formData.append("userInfo", JSON.stringify(values))
    return client.setHeader('content-type', 'multipart/form-data').post<any>(`${endpoint}/googleRegister`, formData);
}

const updateProfilePic = (value: any, userInfo: UserModel) => {
    const image = value.profileImg
    userInfo.profileImg = image
    let formData: FormData = new FormData();
    formData.append('userInfo', JSON.stringify(userInfo));
    formData.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: `image`
    });
    return client.patch<any>(`${endpoint}/addProfilePicture`, formData);
}

const login = (values: any, remainLoggedIn: boolean) => {
    let formData: FormData = new FormData();
    formData.append("credentials", JSON.stringify(values))
    formData.append("options", JSON.stringify({ alwaysLogged: remainLoggedIn }))
    return client.setHeader('content-type', 'multipart/form-data').post<any>(`${endpoint}/login`, formData)
};

const resetPass = (values: any) => {
    let formData: FormData = new FormData();
    formData.append("validationInfo", JSON.stringify(values))
    return client.setHeader('content-type', 'multipart/form-data').post<any>(`${endpoint}/resetPassword`, formData)
}

const sendResetEmail = (email: string) => {
    let formData: FormData = new FormData();
    formData.append("email", email)
    return client.setHeader('content-type', 'multipart/form-data').post<any>(`${endpoint}/forgotPassword`, formData)
}

const deleteAccount = (user_id: string) => {
    return client.setHeader('content-type', 'multipart/form-data').delete<any>(`${endpoint}/deleteAccount/${user_id}`)
}

const resendActivationEmail = (userInfo: UserModel) => { return client.setHeader('content-type', 'multipart/form-data').post<any>(`${endpoint}/resendActivationEmail`, userInfo) }

const isUserLogged = (settings: boolean) => client.get<string>(`${endpoint}/isUserLogged/${settings}`);

const isUserConnected = () => client.get<boolean>(`${endpoint}/isUserConnected`);

const isActivated = () => client.get(`${endpoint}/isActivated`);

const isPremium = (_id: string) => client.get(`${endpoint}/isPremium/${_id}`);

const registerNotificationToken = ((user: UserModel, token: string) => {
    user.expoPushToken = token;
    let formData: FormData = new FormData();
    formData.append("user", JSON.stringify(user))
    client.post(`${endpoint}/storeExpoToken`, formData)
})

const inputAlias = (alias: string, user_id: string) => {
    let formData: FormData = new FormData();
    formData.append("alias", alias)
    formData.append("user_id", user_id)
    return client.setHeader('content-type', 'multipart/form-data').post<UserModel>(`${endpoint}/inputAlias`, formData)
}

export default {
    registerNotificationToken,
    register,
    login,
    updateProfilePic,
    resetPass,
    sendResetEmail,
    deleteAccount,
    isUserLogged,
    resendActivationEmail,
    isActivated,
    isPremium,
    googleRegister,
    inputAlias,
    isUserConnected
}