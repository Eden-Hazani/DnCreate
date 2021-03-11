import { CacheManager } from "react-native-expo-image-cache"
import { Config } from "../config"


export async function serverDice() {
    const diceBase = [20, 12, 10, 8, 6, 4]
    for (let item of diceBase) {
        await CacheManager.get(`${Config.serverUrl}/assets/misc/diceRollsD${item}/startingDice.png`, {}).getPath()
        await CacheManager.get(`${Config.serverUrl}/assets/misc/diceRollsD${item}/diceRollAni.gif`, {}).getPath()
    }
    for (let i = 1; i <= 20; i++) {
        await CacheManager.get(`${Config.serverUrl}/assets/misc/diceRollsD${20}/${i}.png`, {}).getPath()
    }
    for (let i = 1; i <= 12; i++) {
        await CacheManager.get(`${Config.serverUrl}/assets/misc/diceRollsD${12}/${i}.png`, {}).getPath()
    }
    for (let i = 1; i <= 10; i++) {
        await CacheManager.get(`${Config.serverUrl}/assets/misc/diceRollsD${10}/${i}.png`, {}).getPath()
    }
    for (let i = 1; i <= 8; i++) {
        await CacheManager.get(`${Config.serverUrl}/assets/misc/diceRollsD${8}/${i}.png`, {}).getPath()
    }
    for (let i = 1; i <= 6; i++) {
        await CacheManager.get(`${Config.serverUrl}/assets/misc/diceRollsD${6}/${i}.png`, {}).getPath()
    }
    for (let i = 1; i <= 4; i++) {
        await CacheManager.get(`${Config.serverUrl}/assets/misc/diceRollsD${4}/${i}.png`, {}).getPath()
    }
}