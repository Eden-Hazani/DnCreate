import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSpecialSaveThrows } from "../../../../utility/getSpecialSaveThrows";
import logger from "../../../../utility/logger";
import userCharApi from "../../../api/userCharApi";
import * as levelUpTree from '../../../classFeatures/levelUpTree'
import { CharacterModel } from "../../../models/characterModel";


const checkForFirstLevelStart = async (character: CharacterModel) => {
    const result = null;
    if (await AsyncStorage.getItem(`${character._id}FirstTimeOpened`) !== null && levelUpTree[character.characterClass](character.level, character)) {
        const { operation, action } = await levelUpTree[character.characterClass](character.level, character);
        const result = { levelUpFunctionActive: operation, levelUpFunction: action }
        return (result)
    }
    return (result)
}

const loadCashedSavingThrows = async (character: CharacterModel) => {
    try {
        if (!character.savingThrows || character.savingThrows.length === 0) {
            const cashedSavingThrows = await AsyncStorage.getItem(`${character._id}SavingThrows`);
            const savingThrows: any = cashedSavingThrows !== null ? getSpecialSaveThrows(character).concat(JSON.parse(cashedSavingThrows)) : getSpecialSaveThrows(character)
            character.savingThrows = savingThrows;
            userCharApi.updateChar(character)
            return character
        }
        return character
    } catch (err) {
        return character
        logger.log(err)
    }
}


export { checkForFirstLevelStart, loadCashedSavingThrows }