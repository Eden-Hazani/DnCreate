import { CharacterModel } from "../app/models/characterModel";


export function getSpecialSaveThrows(character: CharacterModel) {
    if (character.characterClassId) {
        let saveThrows = character.characterClassId.savingThrows;
        if (saveThrows) {
            switch (true) {
                case character.characterClass === 'Rogue' && character.level === 15:
                    saveThrows.push('Wisdom')
                    break;

                default: saveThrows;
            }
            return saveThrows
        }
        return []
    }
    return []
}