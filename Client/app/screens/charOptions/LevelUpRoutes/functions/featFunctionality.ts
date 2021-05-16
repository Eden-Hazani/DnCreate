import { CharacterModel } from "../../../../models/characterModel"

interface FeatObj {
    featName: string;
    featDescription: string;
    featSkillList: string[];
    featSavingThrowList: any[];
    featToolList: any[];
    strength: number;
    constitution: number;
    dexterity: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    weaponProfArray: any;
    armorProfArray: any[]
}

const validateFeat = (feat: FeatObj) => {
    if (feat.featName === "" || feat.featDescription === "") {
        return { error: true, desc: 'Feat Must Have A Name And Description' }
    }
    return { error: false, desc: 'Feat Must Have A Name And Description' }
}

const mergeFeatToChar = (feat: FeatObj, character: CharacterModel, noChangeCharacter: CharacterModel) => {

    character.feats = pushNewFeat(character, noChangeCharacter)
    character.addedArmorProf = noChangeCharacter.addedArmorProf?.concat(feat.armorProfArray)
    character.addedWeaponProf = noChangeCharacter.addedWeaponProf?.concat(feat.weaponProfArray)

    for (let item of feat.featSavingThrowList) {
        if (!character.savingThrows?.includes(item)) {
            character.savingThrows?.push(item)
        }
    }
    for (let item of feat.featSkillList) {
        if (!character.skills?.find((skill) => skill[0] === item[0])) {
            character.skills?.push(item)
        }
    }
    for (let item of feat.featToolList) {
        if (!character.tools?.find((tool) => tool[0] === item[0])) {
            character.tools?.push(item)
        }
    }
    if (character.feats) {
        character.feats[character.feats.length - 1] = { name: feat.featName, description: feat.featDescription }
    }
    character.strength = feat.strength
    character.intelligence = feat.intelligence
    character.wisdom = feat.wisdom
    character.charisma = feat.charisma
    character.dexterity = feat.dexterity
    character.constitution = feat.constitution
    return character;
}


const pushNewFeat = (character: CharacterModel, noChangeCharacter: CharacterModel) => {
    if (noChangeCharacter.feats?.length === character.feats?.length) {
        character.feats?.push({ name: '', description: '' });
    }
    return character.feats
}

const removeNewFeat = (character: CharacterModel) => {
    character.feats?.splice(-1, 1);
    return character
}


export { validateFeat, mergeFeatToChar, pushNewFeat, removeNewFeat }