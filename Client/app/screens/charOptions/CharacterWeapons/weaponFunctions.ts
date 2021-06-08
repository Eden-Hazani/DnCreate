import AsyncStorage from "@react-native-async-storage/async-storage";
import logger from "../../../../utility/logger";
import userCharApi from "../../../api/userCharApi";
import { CharacterModel } from "../../../models/characterModel";
import { WeaponModal } from "../../../models/WeaponModal";
import { ActionType } from "../../../redux/action-type";
import { store } from "../../../redux/store";

const removeEquippedWeapon = async (character: CharacterModel, user_id: string) => {
    try {
        character.currentWeapon = new WeaponModal();
        store.dispatch({ type: ActionType.SetInfoToChar, payload: character });
        if (user_id === "Offline") {
            updateOfflineCharacter(character);
            return character;
        }
        await userCharApi.updateChar(character);
        return character;
    } catch (err) {
        logger.log(new Error(err))
        return character
    }
}

const updateOfflineCharacter = async (character: CharacterModel) => {
    try {
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
    } catch (err) {
        logger.log(new Error(err))
    }
}

const addNewWeapon = async (values: any, weapon: WeaponModal, character: CharacterModel) => {
    try {
        if (!validateWeapon(weapon.dice, weapon.modifier)) {
            alert('Must pick damage dice and weapon modifier');
            return;
        }
        weapon.name = values.name;
        weapon.description = values.description;
        weapon.diceAmount = values.diceAmount;
        weapon.removable = true;
        weapon.specialAbilities = values.specialAbilities;
        weapon._id = (weapon.name || '') + Math.floor((Math.random() * 1000000) + 1)
        let weaponList = await AsyncStorage.getItem(`${character._id}WeaponList`);
        if (!weaponList) {
            const weaponList = [weapon]
            AsyncStorage.setItem(`${character._id}WeaponList`, JSON.stringify(weaponList))
            return;
        }
        const newWeaponList = JSON.parse(weaponList)
        newWeaponList.push(weapon)
        AsyncStorage.setItem(`${character._id}WeaponList`, JSON.stringify(newWeaponList))
        return
    } catch (err) {
        logger.log(new Error(err))
    }
}

const editExistingWeapon = async (values: any, weapon: WeaponModal, character: CharacterModel) => {
    try {
        if (!validateWeapon(weapon.dice, weapon.modifier)) {
            alert('Must pick damage dice and weapon modifier');
            return;
        }
        weapon.name = values.name;
        weapon.description = values.description;
        weapon.diceAmount = values.diceAmount;
        weapon.removable = true;
        weapon.specialAbilities = values.specialAbilities;
        let weaponList = await AsyncStorage.getItem(`${character._id}WeaponList`);
        if (!weaponList) {
            return;
        }
        const newWeaponList = JSON.parse(weaponList)
        let index: number = 0
        for (let item of newWeaponList) {
            if (item._id === weapon._id) {
                newWeaponList[index] = weapon
            }
            index++
        }
        AsyncStorage.setItem(`${character._id}WeaponList`, JSON.stringify(newWeaponList))
        return
    } catch (err) {
        logger.log(new Error(err))
    }
}


const equipWeapon = async (weapon: WeaponModal, character: CharacterModel, user_id: string) => {
    try {
        if (weapon) {
            const newWeapon = JSON.parse(JSON.stringify(weapon))
            character.currentWeapon = newWeapon;
            store.dispatch({ type: ActionType.SetInfoToChar, payload: character });
            if (user_id === "Offline") {
                updateOfflineCharacter(character);
                return;
            }
            await userCharApi.updateChar(character)
            return character
        }
    } catch (err) {
        logger.log(new Error(err))
    }
}

const removeWeapon = async (weaponId: string, character: CharacterModel) => {
    try {
        let weaponList = await AsyncStorage.getItem(`${character._id}WeaponList`);
        if (weaponList) {
            let newWeaponList = JSON.parse(weaponList)
            newWeaponList = newWeaponList.filter((weapon: any) => weapon._id !== weaponId);
            AsyncStorage.setItem(`${character._id}WeaponList`, JSON.stringify(newWeaponList));
            return;
        }
    } catch (err) {
        logger.log(new Error(err))
    }
}



const validateWeapon = (dicePicked: string | undefined, scorePicked: string | undefined) => {
    try {
        if (dicePicked === '') {
            return false
        }
        if (scorePicked === '') {
            return false
        }
        return true
    } catch (err) {
        logger.log(new Error(err))
    }
}

export { removeEquippedWeapon, addNewWeapon, editExistingWeapon, equipWeapon, removeWeapon }