import { CharacterModel } from "../../../models/characterModel";

export function armorBonusCalculator(character: CharacterModel, armorAc: number, armorBonusesCalculationType: any) {
    let newArmorAc: number = 0;
    let dex: number = 0
    let wiz: number = 0
    let con: number = 0
    if (character.modifiers) {
        if (character.modifiers.dexterity) {
            dex = character.modifiers.dexterity
        }
        if (character.modifiers.wisdom) {
            wiz = character.modifiers.wisdom
        }
        if (character.modifiers.constitution) {
            con = character.modifiers.constitution
        }
    }
    switch (true) {
        case character.characterClass === "Monk" && armorBonusesCalculationType === "none":
            newArmorAc = (10 + +dex + +wiz);
            break;
        case character.characterClass === "Barbarian" && armorBonusesCalculationType === "none":
            newArmorAc = (10 + dex + +con);
            break;
        case character.pathFeatures !== undefined && character.pathFeatures?.length > 0 && character.path?.name === "Draconic Bloodline":
            if (character.pathFeatures !== undefined) {
                character.pathFeatures.forEach(item => {
                    if (item.name === "Draconic Resilience" && armorBonusesCalculationType === "none") {
                        newArmorAc = (13 + dex)
                    }
                })
            }
            break;
        case armorBonusesCalculationType === "none":
            if (character.equippedArmor && character.equippedArmor.ac) {
                newArmorAc = character.equippedArmor?.ac + +dex
            }
            break;
        case armorBonusesCalculationType === "Medium Armor":
            newArmorAc = +armorAc + (dex >= 2 ? 2 : dex);
            break;
        case armorBonusesCalculationType === "Light Armor":
            newArmorAc = +armorAc + (dex);
            break;
        case armorBonusesCalculationType === "Heavy Armor":
            newArmorAc = +armorAc
            break;
    }
    if (character.charSpecials && character.charSpecials.fightingStyle && character.charSpecials.fightingStyle.length > 0) {
        character.charSpecials.fightingStyle.forEach(item => {
            if (item.name === "Defence" && armorBonusesCalculationType !== "none") {
                newArmorAc = (newArmorAc + 1)
            }
        })
    }
    if (character.path?.name === "Forge Domain" && armorBonusesCalculationType === "Heavy Armor" && character.level && character.level >= 6) {
        newArmorAc = +newArmorAc + 1;
    }
    if (character.race === "Lizardfolk" && armorBonusesCalculationType === "none" && character.characterClass !== "Monk" && character.characterClass !== "Barbarian") {
        newArmorAc = 13 + +dex;
    }
    return newArmorAc
}

