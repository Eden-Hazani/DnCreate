import * as SecureStore from 'expo-secure-store';


const key = "authToken"

const storeToken = async (authToken: any) => {
    await SecureStore.setItemAsync(key, JSON.stringify(authToken));

}


const getToken = async () => {
    return await SecureStore.getItemAsync(key);
}


const removeToken = async () => {
    await SecureStore.deleteItemAsync(key);
}


export default { storeToken, getToken, removeToken }