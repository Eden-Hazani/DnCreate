import AsyncStorage from "@react-native-async-storage/async-storage"
import { CharacterModel } from "../../../models/characterModel"
import { MarketCharItemModel } from "../../../models/MarketCharItemModel"

const firstMarketPlaceUse = async () => {
    const firstUse = await AsyncStorage.getItem('isMarketPlaceFirstUse')
    if (!firstUse) {
        return true
    }
    return false
}

const setFirstMarketPlaceUse = async () => {
    await AsyncStorage.setItem('isMarketPlaceFirstUse', 'true')
}

const plantNewIdIntoAllPassLevels = (charLevels: CharacterModel[], char_id: string, user_id: string) => {
    charLevels.forEach((level) => {
        level._id = char_id;
        level.user_id = user_id;
    })
    return charLevels;
}

const addAllCharLevelsToStorage = async (charLevels: CharacterModel[], char_id: string, user_id: string) => {
    for (let char of plantNewIdIntoAllPassLevels(charLevels, char_id, user_id)) {
        await AsyncStorage.setItem(`current${char._id}level${char.level}`, JSON.stringify(char));
    }
}

const implantIdIntoSavedChar = (character: CharacterModel, user_id: string) => {
    character.user_id = user_id;
    return character
}

const saveCharArmaments = async (char_id: string | undefined, weaponList: any[] | undefined, armorList: any[] | undefined, shieldList: any[] | undefined) => {
    weaponList && await AsyncStorage.setItem(`${char_id}WeaponList`, JSON.stringify(weaponList))
    armorList && await AsyncStorage.setItem(`${char_id}ArmorList`, JSON.stringify(armorList))
    shieldList && await AsyncStorage.setItem(`${char_id}shieldList`, JSON.stringify(shieldList))
}



export { firstMarketPlaceUse, setFirstMarketPlaceUse, addAllCharLevelsToStorage, implantIdIntoSavedChar, saveCharArmaments }