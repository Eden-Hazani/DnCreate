import AsyncStorage from "@react-native-community/async-storage";
import authApi from "../../app/api/authApi";
import handleToken from "../../app/auth/TokenHandler";
import { UserModel } from "../../app/models/userModel";
import { ActionType } from "../../app/redux/action-type";
import { store } from "../../app/redux/store";
import errorHandler from "../errorHander";

const startUpLoginCheck = async () => {
    store.dispatch({ type: ActionType.CleanCreator })
    const user = await handleToken().then(async (tokenUser) => {
        if (tokenUser !== null && tokenUser._id !== "Offline") {
            const result = await authApi.isUserLogged();
            if (!result.ok) {
                errorHandler(result);
                return;
            }
            return tokenUser
        }

        if (tokenUser === null) {
            const isOffline = await AsyncStorage.getItem("isOffline");
            const offlineUser: UserModel = { username: 'Offline', activated: true, _id: 'Offline', password: undefined, profileImg: undefined, premium: false }

            if (isOffline) {

                if (JSON.parse(isOffline)) {
                    store.dispatch({ type: ActionType.SetUserInfo, payload: offlineUser })

                    return offlineUser
                }
            }
        }
    })
    if (!user) return null;
    return user
}

export default startUpLoginCheck