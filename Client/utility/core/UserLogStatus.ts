import AsyncStorage from "@react-native-async-storage/async-storage";
import authApi from "../../app/api/authApi";
import errorHandler from "../errorHander";

const isUserConnected = async () => {
    const isOffline = await AsyncStorage.getItem('isOffline');
    if (isOffline && JSON.parse(isOffline)) {
        return;
    }
    const result = await authApi.isUserConnected();
    if (result.status === 403) {
        errorHandler(result);
        return;
    }
}

export default isUserConnected