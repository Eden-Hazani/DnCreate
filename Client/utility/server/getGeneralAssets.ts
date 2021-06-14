
import { CacheManager } from "react-native-expo-image-cache"
import { Config } from "../../config"




export async function getGeneralAssets() {
    await CacheManager.get(`${Config.serverUrl}/assets/misc/animated/lightModeAnimatedRunes.png`, {}).getPath();
    await CacheManager.get(`${Config.serverUrl}/assets/misc/animated/darkModeAnimatedRunes.png`, {}).getPath();

}