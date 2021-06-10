

const images = [`${Config.serverUrl}/assets/classBackGrounds/Starting.png`,
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
`${Config.serverUrl}/assets/classBackGrounds/ArtificerFinal.png`]

import { CacheManager } from "react-native-expo-image-cache"
import { Config } from "../config"

export async function classImagesFromServer() {
    for (let item of images) {
        await CacheManager.get(item, {}).getPath()
    }
}