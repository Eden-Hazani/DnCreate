import AsyncStorage from "@react-native-community/async-storage"
import authApi from "../../app/api/authApi"
import handleToken from "../../app/auth/TokenHandler"
import { Colors } from "../../app/config/colors"
import { UserModel } from "../../app/models/userModel"
import { ActionType } from "../../app/redux/action-type"
import { store } from "../../app/redux/store"
import errorHandler from "../errorHander"
import * as Font from 'expo-font'

const startUp = async () => {
    await loadColors();
    // await checkLoginStatus();
    await loadFonts();
    return { fontsLoaded: true, AppMainLoadAnimation: true }
}


const loadFonts = async () => {
    Font.loadAsync({ 'KumbhSans-Light': require('../../assets/fonts/KumbhSans-Light.ttf') })
}


const loadColors = async () => {
    let colorScheme = await AsyncStorage.getItem('colorScheme');

    if (colorScheme === null || colorScheme === "firstUse") {
        await AsyncStorage.setItem("colorScheme", "firstUse")
        colorScheme = "firstUse"
        Colors.InitializeAsync()

        store.dispatch({ type: ActionType.colorScheme, payload: false })

        return
    }

    store.dispatch({ type: ActionType.colorScheme, payload: colorScheme === "light" ? false : true })
}

export default startUp