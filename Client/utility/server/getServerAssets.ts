import { CacheManager } from "react-native-expo-image-cache"
import { Config } from "../../config"

const assets = [
    `${Config.serverUrl}/assets/classBackGrounds/Starting.png`,
    `${Config.serverUrl}/assets/classBackGrounds/BarbarianFinal.png`,
    `${Config.serverUrl}/assets/classBackGrounds/BardFinal.jpg`,
    `${Config.serverUrl}/assets/classBackGrounds/FighterFinal.jpg`,
    `${Config.serverUrl}/assets/classBackGrounds/DruidFinal.png`,
    `${Config.serverUrl}/assets/classBackGrounds/ClericFinal.jpg`,
    `${Config.serverUrl}/assets/classBackGrounds/MonkFinal.png`,
    `${Config.serverUrl}/assets/classBackGrounds/PaladinFinal.jpg`,
    `${Config.serverUrl}/assets/classBackGrounds/RangerFinal.png`,
    `${Config.serverUrl}/assets/classBackGrounds/RogueFinal.png`,
    `${Config.serverUrl}/assets/classBackGrounds/SorcererFinal.png`,
    `${Config.serverUrl}/assets/classBackGrounds/WarlockFinal.png`,
    `${Config.serverUrl}/assets/classBackGrounds/WizardFinal.jpg`,
    `${Config.serverUrl}/assets/classBackGrounds/ArtificerFinal.png`,
    `${Config.serverUrl}/assets/misc/animated/lightModeAnimatedRunes.png`,
    `${Config.serverUrl}/assets/misc/animated/darkModeAnimatedRunes.png`,
    `${Config.serverUrl}/assets/specificDragons/raceCreationDragon.png`,
    `${Config.serverUrl}/assets/specificDragons/classCreatorDragon.png`,
    `${Config.serverUrl}/assets/specificDragons/magicCreatorDragon.png`,
    `${Config.serverUrl}/assets/specificDragons/lightModeDragon.png`,
    `${Config.serverUrl}/assets/specificDragons/darkModeDragon.png`
]



export async function serverAssets() {
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
    for (let item of assets) {
        await CacheManager.get(item, {}).getPath()
    }
}