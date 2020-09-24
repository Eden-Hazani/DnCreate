import * as SecureStore from 'expo-secure-store';


const key = "authToken"

const storeToken = async (authToken: any) => {
    try {
        await SecureStore.setItemAsync(key, JSON.stringify(authToken));
    } catch (err) {
        console.log(err.message)
    }
}


const getToken = async () => {
    try {
        return await SecureStore.getItemAsync(key);

    } catch (err) {
        console.log(err.message)
    }
}


const removeToken = async () => {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch (err) {
        console.log(err.message)
    }
}


export default { storeToken, getToken, removeToken }