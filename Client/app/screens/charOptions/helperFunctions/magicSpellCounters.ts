import AsyncStorage from "@react-native-async-storage/async-storage";
import { CharacterModel } from "../../../models/characterModel";

const nonWarlockSpellCounter = async (character: CharacterModel) => {
    let availableMagic = await AsyncStorage.getItem(`${character._id}availableMagic`);
    if (character.magic) {
        const totalMagic = Object.values(character.magic);
        if (availableMagic) {
            let availableMagicArray = JSON.parse(availableMagic);
            return ({ availableMagic: availableMagicArray, loading: false })
        }
        if (!availableMagic) {
            const newAvailableMagic: number[] = [];
            for (let item of totalMagic) {
                newAvailableMagic.push(item)
            }
            await AsyncStorage.setItem(`${character._id}availableMagic`, JSON.stringify(newAvailableMagic));
            return ({ availableMagic: newAvailableMagic, loading: false })
        }
    }
    return ({ availableMagic: [], loading: false })
}

const warlockSpellCounter = async (character: CharacterModel) => {
    let availableMagic = await AsyncStorage.getItem(`${character._id}availableMagic`);
    if (character.magic) {
        if (availableMagic) {
            let availableMagicArray = JSON.parse(availableMagic);
            return ({ availableMagic: availableMagicArray, loading: false })
        } else {
            const totalMagic = character.charSpecials?.warlockSpellSlots;
            const newAvailableMagic: number[] = [totalMagic || 0];
            await AsyncStorage.setItem(`${character._id}availableMagic`, JSON.stringify(newAvailableMagic));
            return ({ availableMagic: newAvailableMagic, loading: false })
        }
    }
    return ({ availableMagic: [], loading: false })
}

export { warlockSpellCounter, nonWarlockSpellCounter }