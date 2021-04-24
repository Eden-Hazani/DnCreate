import AsyncStorage from "@react-native-async-storage/async-storage";
import hitDiceSwitch from "../../../../utility/hitDiceSwitch";
import userCharApi from "../../../api/userCharApi";
import { CharacterModel } from "../../../models/characterModel";
import { ActionType } from "../../../redux/action-type";
import { store } from "../../../redux/store";
import * as levelUpTree from '../../../classFeatures/levelUpTree'



const lowerLevel = async (level: number, character: CharacterModel, user_id: string, index: number) => {
    if (character.level && level < character.level) {
        if (level === 0) {
            return;
        }
        const oldCharacter = await AsyncStorage.getItem(`current${character._id}level${level}`);
        if (oldCharacter) {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: JSON.parse(oldCharacter) })
            if (user_id === "Offline") {
                const currentHp = JSON.parse(oldCharacter).maxHp ? JSON.parse(oldCharacter).maxHp.toString() : "0"
                updateOfflineChar(JSON.parse(oldCharacter));
                return (currentHp);
            }
            await userCharApi.updateChar(JSON.parse(oldCharacter))
            const currentHp = JSON.parse(oldCharacter).maxHp ? JSON.parse(oldCharacter).maxHp.toString() : "0"
            store.dispatch({ type: ActionType.ReplaceExistingChar, payload: { charIndex: index, character: JSON.parse(oldCharacter) } });
            return (currentHp)
        }
    }
}


const upperLevel = async (level: number, character: CharacterModel, user_id: string, index: number) => {
    let validLevel: number = level;
    if (character.level) {
        if (level === 0) {
            return;
        }
        if (level > 20) {
            validLevel = 20;
            character.level = validLevel;
            return;
        }
        if (level < 0) {
            validLevel = 1;
            character.level = validLevel;
            return;
        }
        if (!character.path) {
            character.path = null
        }
        await AsyncStorage.setItem(`current${character._id}level${character.level}`, JSON.stringify(character));
        character.level = validLevel;
        store.dispatch({ type: ActionType.SetInfoToChar, payload: character })
        return await levelUp(character, user_id, index);
    }
}

const levelUp = async (character: CharacterModel, user_id: string, index: number) => {
    let levelUpTreeResult = { operation: false, action: null };
    const hitDice = hitDiceSwitch(character.characterClass);
    let maxHp: number = character.maxHp ? character.maxHp : 0;
    maxHp = (maxHp + Math.floor(Math.random() * hitDice) + 1) + (character.modifiers && character.modifiers.constitution ? character.modifiers.constitution : 0);
    if (character.path?.name === "Draconic Bloodline") {
        maxHp = maxHp + 1
    }
    if (character.characterClass === "Paladin" && character.level) {
        let layOnHandsAmount = 5 * character.level;
        await AsyncStorage.setItem(`layOnHands${character._id}`, JSON.stringify(layOnHandsAmount));
    }
    character.maxHp = maxHp;
    user_id === "Offline" ? updateOfflineChar(character) : userCharApi.updateChar(character);
    if (character.maxHp) {
        await AsyncStorage.setItem(`${character._id}currentHp`, character.maxHp.toString());
    }
    const levelUpTreeFunc = await levelUpTree[character.characterClass](character.level, character)
    if (levelUpTreeFunc) {
        const { operation, action } = levelUpTreeFunc;
        levelUpTreeResult = { operation, action }
    }
    else if (!levelUpTreeFunc) {
        store.dispatch({ type: ActionType.ReplaceExistingChar, payload: { charIndex: index, character: character } });
    }

    return ({ char: character, levelUpResult: levelUpTreeResult, currentHp: maxHp.toString() })
}


const updateOfflineChar = async (character: CharacterModel) => {
    const stringifiedChars = await AsyncStorage.getItem('offLineCharacterList');
    if (stringifiedChars) {
        const characters = JSON.parse(stringifiedChars);
        for (let index in characters) {
            if (characters[index]._id === character._id) {
                characters[index] = character;
                break;
            }
        }
        await AsyncStorage.setItem('offLineCharacterList', JSON.stringify(characters))
    }
}

const levelUpByExperience = async (level: number, character: CharacterModel, user_id: string, index: number, updatedExperience: number) => {
    let validLevel: number = level;
    if (level > 20) {
        validLevel = 20;
        character.level = validLevel;
        return;
    }
    if (level < 0) {
        validLevel = 1;
        character.level = validLevel;
        return;
    }
    if (!character.path) {
        character.path = null
    }
    if (!character.currentExperience) {
        character.currentExperience = 0
    }
    await AsyncStorage.setItem(`current${character._id}level${character.level}`, JSON.stringify(character));
    character.level = validLevel;
    character.currentExperience = updatedExperience;
    store.dispatch({ type: ActionType.SetInfoToChar, payload: character })
    return await levelUp(character, user_id, index);
}




export { lowerLevel, upperLevel, levelUpByExperience, updateOfflineChar }