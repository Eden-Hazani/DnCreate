import { CharacterModel } from "../../../models/characterModel";



export function setTotalKnownSpells(character: CharacterModel) {
    const charClass = character.characterClass;
    let int: number = 0;
    let wiz: number = 0;
    let cha: number = 0;
    let level: number = 0;
    if (character.modifiers) {
        if (character.modifiers.intelligence) {
            int = character.modifiers.intelligence
        }
        if (character.modifiers.wisdom) {
            wiz = character.modifiers.wisdom
        }
        if (character.modifiers.charisma) {
            cha = character.modifiers.charisma
        }
    }
    if (character.level) {
        level = character.level
    }
    let knownSpells: number = 0
    switch (true) {
        case charClass === "Wizard":
            knownSpells = int + level;
            break;
        case charClass === "Artificer":
            knownSpells = int + (Math.floor(level / 2));
            break;
        case charClass === "Druid":
            knownSpells = wiz + level;
            break;
        case charClass === "Paladin":
            knownSpells = cha + (Math.floor(level / 2));
            break;
        case charClass === "Cleric":
            knownSpells = wiz + level;
            break;
    }
    if (knownSpells < 1) {
        knownSpells = 1
    }
    return knownSpells
}