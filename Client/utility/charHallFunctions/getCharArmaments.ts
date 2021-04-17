import AsyncStorage from "@react-native-community/async-storage";


const getCharWeaponArmaments = async (character_id: string) => {
    const weaponList = await AsyncStorage.getItem(`${character_id}WeaponList`);
    if (weaponList) {
        return JSON.parse(weaponList);
    }
    return []
}

const getCharArmorArmaments = async (character_id: string) => {
    const armorList = await AsyncStorage.getItem(`${character_id}ArmorList`);
    if (armorList) {
        return JSON.parse(armorList);
    }
    return []
}

const getCharShieldArmaments = async (character_id: string) => {
    const shieldList = await AsyncStorage.getItem(`${character_id}shieldList`);
    if (shieldList) {
        return JSON.parse(shieldList);
    }
    return []
}


export { getCharWeaponArmaments, getCharShieldArmaments, getCharArmorArmaments };