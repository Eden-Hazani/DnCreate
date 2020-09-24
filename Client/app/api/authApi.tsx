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

const login = (values: any) => {
    let formData: FormData = new FormData();
    formData.append("credentials", JSON.stringify(values))
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
    console.log(formData)
    return client.setHeader('content-type', 'multipart/form-data').post<any>(`${endpoint}/forgotPassword`, formData)

}



export default {
    register,
    login,
    updateProfilePic,
    resetPass,
    sendResetEmail
}