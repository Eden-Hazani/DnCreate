import AsyncStorage from "@react-native-community/async-storage";
import authApi from "../../app/api/authApi";
import errorHandler from "../errorHander";

const isUserLogged = async () => {
    const isOffline = await AsyncStorage.getItem('isOffline');
    if (isOffline && JSON.parse(isOffline)) {
        return;
    }
    const result = await authApi.isUserLogged();
    if (result.status === 403) {
        errorHandler(result);
        return;
    }
}

export default isUserLogged