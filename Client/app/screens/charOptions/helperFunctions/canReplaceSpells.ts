import { CharacterModel } from "../../../models/characterModel"



export function canReplaceSpells(character: CharacterModel) {
    if (character.characterClass === 'Wizard' || character.characterClass === 'Cleric' || character.characterClass === 'Paladin'
        || character.characterClass === 'Druid') {
        return true
    }
    if (character.characterClass === 'Sorcerer' || character.characterClass === 'Warlock' || character.characterClass === 'Bard'
        || character.characterClass === 'Ranger') {
        return false
    }
}