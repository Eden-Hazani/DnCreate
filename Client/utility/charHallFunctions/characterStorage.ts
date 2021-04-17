import AsyncStorage from "@react-native-community/async-storage";
import { CharacterModel } from "../../app/models/characterModel";

const getCharacterPreviousLevels = async (character: CharacterModel) => {
    let characterLevels: CharacterModel[] = [];
    if (character.level) {
        for (let i = 1; i <= character.level; i++) {
            let level = await AsyncStorage.getItem(`current${character._id}level${i}`);
            if (level) {
                characterLevels.push(JSON.parse(level))
            }
        }
    }
    return characterLevels
}

const updateMarketStatusFromPreviousLevels = async (character: CharacterModel, marketStatus: { creator_id: string, isInMarket: boolean, market_id: string }) => {
    if (character.level) {
        for (let i = 1; i <= character.level; i++) {
            let level = await AsyncStorage.getItem(`current${character._id}level${i}`);
            if (level) {
                let char: CharacterModel = JSON.parse(level);
                char.marketStatus = marketStatus
                console.log(char.marketStatus)
                await AsyncStorage.setItem(`current${character._id}level${i}`, JSON.stringify(char));
            }
        }
    }
}



export { getCharacterPreviousLevels, updateMarketStatusFromPreviousLevels }