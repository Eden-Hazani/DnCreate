import { CharacterModel } from "../../app/models/characterModel";
import { MarketCharItemModel } from "../../app/models/MarketCharItemModel";
import { getCharacterPreviousLevels } from "./characterStorage";
import cleanCharObj from "./cleanCharObj";
import { getCharArmorArmaments, getCharShieldArmaments, getCharWeaponArmaments } from "./getCharArmaments";

const createNewMarketObj = async (character: CharacterModel, values: { name: string, description: string }) => {
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
    marketObj.charName = character.name;
    marketObj.raceImag = character.raceId?.image;
    marketObj.charClass = character.characterClass;
    marketObj.downloadedTimes = 0;
    return marketObj;
}

export default createNewMarketObj;