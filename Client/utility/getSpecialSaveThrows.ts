import { CharacterModel } from "../app/models/characterModel";


export function getSpecialSaveThrows(character: CharacterModel) {
    let saveThrows: any = []
    if (character.characterClassId) {
        if (!character.savingThrows || character.savingThrows.length === 0) {
            saveThrows = character.characterClassId.savingThrows;
        } else {
            saveThrows = character.savingThrows;
        }
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