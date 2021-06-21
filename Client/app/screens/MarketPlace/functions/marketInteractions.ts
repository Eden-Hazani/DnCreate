import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../../../redux/store"


const checkMarketCharItemValidity = (market_id: string, charName: string) => {
    const characters = store.getState().characters;
    for (let item of characters) {
        if (item.marketStatus?.market_id === market_id) {
            return { error: 'MATCH_ID', description: 'You already have this character in your character hall.' }
        }
        if (charName === item.name) {
            return { error: 'MATCH_NAME', description: 'You already have a character with the same name in your hall, if you wish to claim this character you will need to remove the character with the same name in your hall.' }
        }
    }
    return { error: 'OK', description: '' }
}

const checkMarketWeaponItemValidity = async (char_id: string, market_id: string) => {
    const weapons = await AsyncStorage.getItem(`${char_id}WeaponList`);
    if (weapons) {
        for (let item of JSON.parse(weapons)) {
            if (item.marketStatus?.market_id === market_id) {
                return { error: 'MATCH_ID', description: 'This character already owns this weapon' }
            }
        }
    }
    return { error: 'OK', description: '' }
}

const checkMarketSpellItemValidity = async (market_id: string) => {
    const spells = await AsyncStorage.getItem(`customSpellList`);
    if (spells) {
        for (let item of JSON.parse(spells)) {
            if (item.marketStatus?.market_id === market_id) {
                return { error: 'MATCH_ID', description: 'This spell already exists in your spell book' }
            }
        }
    }
    return { error: 'OK', description: '' }
}

const checkMarketWeaponValidity = (marketStatus: { creator_id: string, isInMarket: boolean, market_id: string } | undefined | null, user_id: string) => {
    if (!marketStatus) {
        return 'OWNED_NOT_PUBLISHED'
    }
    if (user_id !== marketStatus.creator_id && marketStatus.isInMarket) {
        return 'NOT_OWNED'
    }
    if (user_id === marketStatus.creator_id && marketStatus.isInMarket) {
        return 'OWNED_PUBLISHED'
    }
    if (user_id === marketStatus.creator_id && !marketStatus.isInMarket) {
        return 'OWNED_NOT_PUBLISHED'
    }
}

const checkMarketSpellValidity = (marketStatus: { creator_id: string, isInMarket: boolean, market_id: string } | undefined | null, user_id: string) => {
    if (!marketStatus) {
        return 'OWNED_NOT_PUBLISHED'
    }
    if (user_id !== marketStatus.creator_id && marketStatus.isInMarket) {
        return 'NOT_OWNED'
    }
    if (user_id === marketStatus.creator_id && marketStatus.isInMarket) {
        return 'OWNED_PUBLISHED'
    }
    if (user_id === marketStatus.creator_id && !marketStatus.isInMarket) {
        return 'OWNED_NOT_PUBLISHED'
    }
}




export { checkMarketCharItemValidity, checkMarketWeaponValidity, checkMarketWeaponItemValidity, checkMarketSpellValidity, checkMarketSpellItemValidity };