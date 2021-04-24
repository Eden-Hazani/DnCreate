import AsyncStorage from "@react-native-async-storage/async-storage";
import hitDiceSwitch from "../../../../utility/hitDiceSwitch";
import userCharApi from "../../../api/userCharApi";
import { CharacterModel } from "../../../models/characterModel";
import { updateOfflineChar } from './leveling'



const sheetModifierListStat = (character: CharacterModel) => {
    const char = character;
    if (character.modifiers) {
        const modifiers: any[] = Object.entries(character.modifiers);
        modifiers[0].push(char.strength);
        modifiers[1].push(char.constitution);
        modifiers[2].push(char.dexterity);
        modifiers[3].push(char.intelligence);
        modifiers[4].push(char.wisdom);
        modifiers[5].push(char.charisma);
        return modifiers;
    }
    return []
}


const maxHpCheck = async (character: CharacterModel, user_id: string) => {
    let currentHp = '0';
    if (!character.maxHp) {
        let maxHp = hitDiceSwitch(character.characterClass) + (character.modifiers && character.modifiers.constitution ? character.modifiers.constitution : 0);
        if (character.path?.name === "Draconic Bloodline") {
            maxHp = maxHp + 1
        }
        character.maxHp = maxHp;
        const result = await AsyncStorage.getItem(`${character._id}currentHp`);
        if (!result) {
            currentHp = character.maxHp.toString()
        } else if (result) {
            currentHp = result
        }

        user_id === "Offline" ? updateOfflineChar(character) : userCharApi.updateChar(character);
        return currentHp
    }
    const result = await AsyncStorage.getItem(`${character._id}currentHp`);
    if (!result) {
        currentHp = character.maxHp.toString()
    } else if (result) {
        currentHp = result
    }
    return currentHp
}


export { sheetModifierListStat, maxHpCheck }