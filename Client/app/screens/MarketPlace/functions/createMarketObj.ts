import { CharacterModel } from "../../../models/characterModel";
import { MarketCharItemModel } from "../../../models/MarketCharItemModel";
import { getCharacterPreviousLevels } from "../../../../utility/charHallFunctions/characterStorage";
import cleanCharObj from "../../../../utility/charHallFunctions/cleanCharObj";
import { getCharArmorArmaments, getCharShieldArmaments, getCharWeaponArmaments } from "../../../../utility/charHallFunctions/getCharArmaments";
import { MarketWeaponItemModel } from "../../../models/MarketWeaponItemModel";
import { WeaponModal } from "../../../models/WeaponModal";

const createNewCharMarketObj = async (character: CharacterModel, values: { name: string, description: string }) => {
    const previousLevels = await getCharacterPreviousLevels(character);
    const marketObj = new MarketCharItemModel();
    marketObj.characterLevelList = previousLevels;
    marketObj.creator_id = character.user_id;
    marketObj.armorItems = await getCharArmorArmaments(character._id || '');
    marketObj.shieldItems = await getCharShieldArmaments(character._id || '');
    marketObj.weaponItems = await getCharWeaponArmaments(character._id || '');
    marketObj.creatorName = values.name;
    marketObj.description = values.description;
    marketObj.currentLevelChar = cleanCharObj(JSON.parse(JSON.stringify(character)));
    marketObj.race = character.race;
    marketObj.currentLevel = character.level;
    marketObj.itemName = character.name;
    marketObj.image = character.raceId?.image;
    marketObj.marketType = "CHAR"
    marketObj.charClass = character.characterClass;
    marketObj.downloadedTimes = 0;
    return marketObj;
}

const createNewWeaponMarketObj = (user_id: string, weapon: WeaponModal, values: { name: string, description: string }) => {
    const marketObj = new MarketWeaponItemModel();
    marketObj.creatorName = values.name;
    marketObj.creator_id = user_id;
    marketObj.itemName = weapon.name;
    marketObj.description = values.description;
    marketObj.weaponInfo = weapon;
    marketObj.image = weapon.image;
    marketObj.marketType = "WEAP"
    marketObj.downloadedTimes = 0;
    return marketObj
}

export { createNewCharMarketObj, createNewWeaponMarketObj };