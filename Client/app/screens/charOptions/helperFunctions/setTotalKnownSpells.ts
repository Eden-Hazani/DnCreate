import { CharacterModel } from "../../../models/characterModel";



export function setTotalKnownSpells(character: CharacterModel) {
    const charClass = character.characterClass;
    let knownSpells: number = null
    switch (true) {
        case charClass === "Wizard":
            knownSpells = character.modifiers.intelligence + character.level;
            break;
        case charClass === "Druid":
            knownSpells = character.modifiers.wisdom + character.level;
            break;
        case charClass === "Paladin":
            knownSpells = character.modifiers.charisma + (Math.floor(character.level / 2));
            break;
        case charClass === "Cleric":
            knownSpells = character.modifiers.wisdom + character.level;
            break;
    }
    if (knownSpells < 1) {
        knownSpells = 1
    }
    return knownSpells
}