import { CharacterModel } from "../../../models/characterModel";

export function armorBonusCalculator(character: CharacterModel, armorAc: number, armorBonusesCalculationType: any) {
    let newArmorAc: number = null;
    switch (true) {
        case character.path?.name === "Forge Domain" && armorBonusesCalculationType === "Heavy Armor" && character.level >= 6:
            newArmorAc = +armorAc + 1;
            break;
        case character.characterClass === "Monk" && armorBonusesCalculationType === "none":
            newArmorAc = (10 + +character.modifiers.dexterity + +character.modifiers.wisdom);
            break;
        case character.characterClass === "Barbarian" && armorBonusesCalculationType === "none":
            newArmorAc = (10 + character.modifiers.dexterity + +character.modifiers.constitution);
            break;
        case character.pathFeatures?.length > 0 && character.path?.name === "Draconic Bloodline":
            character.pathFeatures.forEach(item => {
                if (item.name === "Draconic Resilience" && armorBonusesCalculationType === "none") {
                    newArmorAc = (13 + character.modifiers.dexterity)
                }
            })
            break;
        case armorBonusesCalculationType === "none":
            newArmorAc = character.equippedArmor?.ac + +character.modifiers.dexterity
            break;
        case armorBonusesCalculationType === "Medium Armor":
            newArmorAc = +armorAc + (character.modifiers.dexterity >= 2 ? 2 : character.modifiers.dexterity);
            break;
        case armorBonusesCalculationType === "Light Armor":
            newArmorAc = +armorAc + (character.modifiers.dexterity);
            break;
        case armorBonusesCalculationType === "Heavy Armor":
            newArmorAc = +armorAc
            break;
    }
    return newArmorAc
}

